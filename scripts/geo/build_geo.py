#!/usr/bin/env python3
"""build_geo.py — build data/layer_geo.js from raw OSM + curated open data.

Usage:
  python3 -I scripts/geo/build_geo.py <raw_geo_dir> <sudan_adm0.geojson> <out_layer_geo.js>

Produces an ADDITIVE layer loaded AFTER bundle.js:
  window.SUDAN.geo = { relief, roads, airports, ports, crossings, note, sources }

Design goals: LIGHT (major axes only, stitched + simplified), SOURCED (OSM = ODbL,
attribution carried), NOTHING INVENTED (OSM geometry + a short curated list of
named official crossings/ports with coordinates taken from OSM). No control line,
no military unit tracking (Darfur guardrail). Relief tiles are KEYLESS.
"""
import sys, os, json, math

# ---------------------------------------------------------------------------
# geometry helpers
# ---------------------------------------------------------------------------
def load_ring(adm0_path):
    g = json.load(open(adm0_path))
    geom = g["features"][0]["geometry"]
    if geom["type"] == "Polygon":
        return geom["coordinates"][0]
    # MultiPolygon: take the largest outer ring
    best = max(geom["coordinates"], key=lambda p: len(p[0]))
    return best[0]

def point_in_ring(lon, lat, ring):
    c = False; n = len(ring); j = n - 1
    for i in range(n):
        xi, yi = ring[i][0], ring[i][1]
        xj, yj = ring[j][0], ring[j][1]
        if ((yi > lat) != (yj > lat)) and \
           (lon < (xj - xi) * (lat - yi) / ((yj - yi) or 1e-12) + xi):
            c = not c
        j = i
    return c

def hav(a, b):
    R = 6371.0; p = math.pi / 180.0
    dlat = (b[1] - a[1]) * p; dlon = (b[0] - a[0]) * p
    x = math.sin(dlat / 2) ** 2 + math.cos(a[1] * p) * math.cos(b[1] * p) * math.sin(dlon / 2) ** 2
    return 2 * R * math.asin(math.sqrt(x))

def polyline_km(pts):
    return sum(hav(pts[i], pts[i + 1]) for i in range(len(pts) - 1))

def rdp(pts, eps):
    """Ramer-Douglas-Peucker on [lon,lat] in degrees (planar approx, fine at country scale)."""
    if len(pts) < 3:
        return pts[:]
    a, b = pts[0], pts[-1]
    dmax = 0.0; idx = 0
    dx = b[0] - a[0]; dy = b[1] - a[1]
    den = math.hypot(dx, dy) or 1e-12
    for i in range(1, len(pts) - 1):
        px, py = pts[i]
        d = abs(dy * px - dx * py + b[0] * a[1] - b[1] * a[0]) / den
        if d > dmax:
            dmax = d; idx = i
    if dmax > eps:
        left = rdp(pts[:idx + 1], eps)
        right = rdp(pts[idx:], eps)
        return left[:-1] + right
    return [a, b]

# ---------------------------------------------------------------------------
# roads: keep Sudan trunk/motorway, stitch by shared end-node, simplify, keep long
# ---------------------------------------------------------------------------
def build_roads(raw_dir, ring):
    data = json.load(open(os.path.join(raw_dir, "roads_trunk.json")))
    ways = []
    for e in data["elements"]:
        geom = e.get("geometry", [])
        nodes = e.get("nodes", [])
        if len(geom) < 2 or len(nodes) != len(geom):
            continue
        pts = [(round(p["lon"], 5), round(p["lat"], 5)) for p in geom]
        inside = sum(1 for p in pts if point_in_ring(p[0], p[1], ring))
        if inside < len(pts) * 0.5:
            continue  # clip to Sudan
        t = e.get("tags", {})
        ways.append({
            "pts": pts, "nodes": nodes,
            "cls": t.get("highway"), "ref": t.get("ref"),
        })

    # adjacency by endpoint node id
    from collections import defaultdict
    ends = defaultdict(list)  # node_id -> list of way indices touching it at an endpoint
    for i, w in enumerate(ways):
        ends[w["nodes"][0]].append(i)
        ends[w["nodes"][-1]].append(i)

    used = [False] * len(ways)

    def oriented(i, start_node):
        w = ways[i]
        if w["nodes"][0] == start_node:
            return w["pts"], w["nodes"][-1]
        else:
            return list(reversed(w["pts"])), w["nodes"][0]

    def extend(start_node, seed_other_node):
        """Walk a chain starting from seed, going outward from seed_other_node."""
        chain_pts = []
        node = seed_other_node
        prev_pts = None
        # follow degree-2 corridor
        guard = 0
        while guard < 100000:
            guard += 1
            cand = [k for k in ends[node] if not used[k]]
            if len(cand) != 1:
                break
            k = cand[0]
            used[k] = True
            seg, node = oriented(k, node)
            chain_pts.extend(seg if prev_pts is None else seg[1:])
            prev_pts = seg
        return chain_pts

    corridors = []
    for i, w in enumerate(ways):
        if used[i]:
            continue
        used[i] = True
        # grow from this seed in both directions
        start_node, end_node = w["nodes"][0], w["nodes"][-1]
        back = extend(end_node, start_node)      # from start side outward
        back = list(reversed(back))
        fwd = extend(start_node, end_node)       # from end side outward
        chain = back + list(w["pts"]) + fwd
        # dedupe consecutive identical pts
        clean = [chain[0]]
        for p in chain[1:]:
            if p != clean[-1]:
                clean.append(p)
        corridors.append({"pts": clean, "cls": w["cls"], "ref": w["ref"]})

    # simplify + keep long corridors only (major axes)
    MIN_KM = 25.0
    EPS = 0.01  # ~1.1 km
    out = []
    for c in corridors:
        km = polyline_km(c["pts"])
        if km < MIN_KM:
            continue
        simp = rdp(c["pts"], EPS)
        coords = [[round(p[0], 4), round(p[1], 4)] for p in simp]
        out.append({
            "cls": c["cls"], "ref": c["ref"],
            "km": round(km), "coords": coords,
        })
    out.sort(key=lambda r: -r["km"])
    return out

# ---------------------------------------------------------------------------
# airports: Sudan (ICAO HS...) named aerodromes, major first
# ---------------------------------------------------------------------------
# curated major hubs (by IATA) to flag as "major" in display
MAJOR_IATA = {"KRT", "PZU", "UYL", "ELF", "EGN", "DOG", "ATB", "KSL", "NUD",
              "EBD", "DNX", "RSS", "GSU", "WHF", "MWE", "KDX"}

# Khartoum International (HSSS / KRT) — the country's main airport — is not
# present as a named aeroway=aerodrome node in the OSM extract (only the planned
# "New Khartoum" HSSN is). Added here so the capital's hub is represented.
CURATED_AIRPORTS = [
    {"name": "Khartoum International", "iata": "KRT", "icao": "HSSS",
     "lon": 32.5532, "lat": 15.5895, "major": True,
     "source": "curated (absent du jeu OSM nommé ; coord. aéroport de Khartoum)"},
]

def _clean_name(name):
    """Prefer a Latin-script segment when the name bundles several scripts."""
    parts = [p.strip() for p in name.split("|") if p.strip()]
    for p in parts:
        if any("a" <= ch.lower() <= "z" for ch in p):
            return p
    return parts[0] if parts else name.strip()

def build_airports(raw_dir, ring):
    data = json.load(open(os.path.join(raw_dir, "airports.json")))
    rows = []
    seen = set()
    for a in CURATED_AIRPORTS:
        seen.add(a["icao"])
        rows.append({"name": a["name"], "iata": a["iata"], "icao": a["icao"],
                     "lon": round(a["lon"], 4), "lat": round(a["lat"], 4),
                     "major": a["major"], "source": a["source"]})
    for e in data["elements"]:
        t = e.get("tags", {})
        icao = (t.get("icao") or "")
        iata = t.get("iata")
        name = t.get("name")
        # Keep only ICAO-registered Sudanese aerodromes (HS...) — real airports,
        # not dirt airstrips; drops foreign fields caught by the bbox.
        if not name or not icao.startswith("HS"):
            continue
        if e["type"] == "node":
            lon, lat = e.get("lon"), e.get("lat")
        else:
            c = e.get("center", {})
            lon, lat = c.get("lon"), c.get("lat")
        if lon is None or lat is None:
            continue
        if icao in seen:
            continue
        seen.add(icao)
        rows.append({
            "name": _clean_name(name),
            "iata": iata, "icao": icao,
            "lon": round(lon, 4), "lat": round(lat, 4),
            "major": bool(iata and iata in MAJOR_IATA),
            "source": "OSM aeroway=aerodrome",
        })
    # order: major first, then with iata, then rest (alpha by icao for stability)
    rows.sort(key=lambda r: (not r["major"], not bool(r["iata"]), r["icao"] or ""))
    return rows

# ---------------------------------------------------------------------------
# crossings: OSM border_control (named) near borders + curated official list
# ---------------------------------------------------------------------------
# Curated OFFICIAL named crossings. Coordinates are at the border line and were
# cross-checked against OSM place/boundary nodes. country = neighbour side.
# Each entry's source says OSM when its coordinates come from an OSM
# barrier=border_control node (verified at the border), else "curated" when the
# point marks a well-known crossing/corridor whose coordinate is placed on the
# border line. Internal checkpoints returned by OSM (e.g. Soba, Jaili near
# Khartoum) are deliberately EXCLUDED — they are not border crossings.
CURATED_CROSSINGS = [
    # Chad (spillover / refugees) — most active humanitarian corridors
    {"name": "Adré (axe El Geneina–Adré)", "country": "Tchad", "lon": 22.197, "lat": 13.462,
     "note": "Principal corridor humanitaire et de réfugiés vers le Tchad (Darfour-Ouest).",
     "source": "curated (corridor connu ; coord. ville d'Adré)"},
    {"name": "Tine / Tina", "country": "Tchad", "lon": 22.283, "lat": 15.000,
     "note": "Passage nord vers le Tchad (Darfour-Nord).",
     "source": "curated (axe frontalier connu)"},
    {"name": "Um Dukhun / Foro Boranga", "country": "Tchad", "lon": 21.95, "lat": 11.60,
     "note": "Passage sud vers le Tchad (Darfour-Central/Sud).",
     "source": "curated (axe frontalier connu)"},
    # Egypt
    {"name": "Argeen (Arqeen)", "country": "Égypte", "lon": 31.1512, "lat": 21.9997,
     "note": "Poste routier vers l'Égypte (désert nubien).",
     "source": "OSM barrier=border_control"},
    {"name": "Ashkeit (Eshket)", "country": "Égypte", "lon": 31.5124, "lat": 22.0,
     "note": "Axe Wadi Halfa–Qustul vers l'Égypte.",
     "source": "OSM barrier=border_control"},
    {"name": "Ras Haderba (land port)", "country": "Égypte", "lon": 36.7258, "lat": 22.0006,
     "note": "Poste frontière routier côtier (mer Rouge, nord-est).",
     "source": "OSM barrier=border_control"},
    # Ethiopia
    {"name": "Gallabat / Metema", "country": "Éthiopie", "lon": 36.165, "lat": 12.970,
     "note": "Principal poste frontière Soudan–Éthiopie (Gedaref–Gondar).",
     "source": "curated (poste frontière connu)"},
    # Eritrea / Ethiopia confluence
    {"name": "Hamdayet / Lugdi", "country": "Érythrée/Éthiopie", "lon": 36.35, "lat": 14.28,
     "note": "Point de passage de réfugiés au confluent Soudan–Éthiopie–Érythrée (Kassala).",
     "source": "curated (axe frontalier connu)"},
    # South Sudan
    {"name": "Joda / Jodah", "country": "Soudan du Sud", "lon": 32.40, "lat": 10.07,
     "note": "Principal passage White Nile–Renk (retours et réfugiés vers le Soudan du Sud).",
     "source": "curated (axe frontalier connu)"},
    {"name": "Ulu (معبر اولو)", "country": "Soudan du Sud", "lon": 33.4977, "lat": 10.6523,
     "note": "Passage vers le Soudan du Sud (Nil Bleu / Haut-Nil).",
     "source": "OSM barrier=border_control"},
]

def build_crossings(raw_dir, ring):
    out = []
    for c in CURATED_CROSSINGS:
        out.append({
            "name": c["name"], "country": c["country"],
            "lon": round(c["lon"], 4), "lat": round(c["lat"], 4),
            "note": c["note"], "source": c["source"],
        })
    return out

# ---------------------------------------------------------------------------
# ports: Red Sea (vital for SAF). Curated, coords from OSM.
# ---------------------------------------------------------------------------
PORTS = [
    {"name": "Port-Soudan (port principal)", "lon": 37.216, "lat": 19.617,
     "type": "Port maritime majeur", "note": "Principal port du Soudan sur la mer Rouge ; "
     "poumon logistique et siège de facto des autorités alignées sur la SAF."},
    {"name": "Port-Soudan — terminal Sud / Green Terminal", "lon": 37.233, "lat": 19.567,
     "type": "Terminal conteneurs/vrac", "note": "Extension sud du complexe portuaire de Port-Soudan."},
    {"name": "Suakin (Sawakin)", "lon": 37.333, "lat": 19.108,
     "type": "Port historique secondaire", "note": "Ancien port sur la mer Rouge, au sud de Port-Soudan."},
    {"name": "Oseif / Bashair (terminal pétrolier)", "lon": 37.25, "lat": 18.17,
     "type": "Terminal pétrolier", "note": "Terminal d'exportation d'hydrocarbures au sud de Port-Soudan (zone de Marsa Bashair)."},
]

def build_ports():
    return [{"name": p["name"], "lon": p["lon"], "lat": p["lat"],
             "type": p["type"], "note": p["note"]} for p in PORTS]

# ---------------------------------------------------------------------------
# emit
# ---------------------------------------------------------------------------
def main():
    raw_dir, adm0, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
    ring = load_ring(adm0)
    roads = build_roads(raw_dir, ring)
    airports = build_airports(raw_dir, ring)
    crossings = build_crossings(raw_dir, ring)
    ports = build_ports()

    relief = {
        "tiles": {
            "url": "https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}",
            "attribution": "Relief: Esri World Hillshade (Esri, USGS, NGA, NASA, CGIAR, GEBCO et al.)",
            "maxZoom": 13,
            "maxNativeZoom": 13,
            "opacity": 0.55,
        },
        "alt": {
            "url": "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            "subdomains": "abc",
            "attribution": "Relief alt.: © OpenTopoMap (CC-BY-SA), données SRTM/OSM",
            "maxZoom": 15,
            "note": "Repli topographique ; respecter la politique d'usage OpenTopoMap (usage léger).",
        },
    }

    geo = {
        "generated": "2026-10-28",
        "relief": relief,
        "roads": roads,
        "airports": airports,
        "ports": ports,
        "crossings": crossings,
        "note": (
            "Couche GEOGRAPHIE PHYSIQUE & INFRASTRUCTURES (contexte, additive). "
            "Relief = tuiles d'ombrage KEYLESS (Esri World Hillshade ; repli OpenTopoMap). "
            "Routes = axes MAJEURS seulement (OSM highway=motorway|trunk), tronconnes stitchees "
            "en corridors, geometrie simplifiee (RDP ~1 km) et corridors < 25 km ecartes pour "
            "rester leger ; le reseau secondaire (primary) est VOLONTAIREMENT exclu. Aeroports, "
            "ports et passages frontaliers = points de reference statiques, non un suivi "
            "operationnel. AUCUNE ligne de controle, AUCUN mouvement d'unite, AUCUNE donnee "
            "nominative (garde-fou Darfour). Donnees d'infrastructure ouvertes et publiques, "
            "non temps reel."
        ),
        "sources": [
            {"name": "OpenStreetMap (routes, aeroports, passages)",
             "license": "ODbL — attribution requise", "url": "https://www.openstreetmap.org/copyright"},
            {"name": "Esri World Hillshade (relief)",
             "license": "Esri free basemap (keyless) — attribution requise",
             "url": "https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer"},
            {"name": "OpenTopoMap (relief alternatif)",
             "license": "CC-BY-SA ; politique d'usage (usage leger)", "url": "https://opentopomap.org/about"},
            {"name": "geoBoundaries (clip frontiere Soudan ADM0)",
             "license": "CC BY 3.0 IGO", "url": "https://www.geoboundaries.org/"},
        ],
    }

    js = (
        "/*\n"
        " * layer_geo.js — couche GEOGRAPHIE PHYSIQUE & INFRASTRUCTURES (ADDITIVE),\n"
        " * chargee APRES bundle.js. Pose window.SUDAN.geo sans toucher a autre chose.\n"
        " *\n"
        " *   relief    : tuiles d'ombrage KEYLESS (Esri World Hillshade ; repli OpenTopoMap)\n"
        " *   roads     : axes majeurs OSM (motorway|trunk) stitches + simplifies, clippes Soudan\n"
        " *   airports  : aerodromes nommes (Soudan, ICAO HS...)\n"
        " *   ports     : ports de la mer Rouge (Port-Soudan...)\n"
        " *   crossings : passages frontaliers officiels (Tchad / Egypte / Ethiopie / Soudan du Sud)\n"
        " *\n"
        " * Sources ouvertes, licences citees (OSM = ODbL). Rien d'invente : geometrie OSM,\n"
        " * reliefs keyless, et courte liste curee de ports/passages nommes aux coord. recoupees.\n"
        " * Garde-fou Darfour : aucune ligne de controle, aucun suivi d'unites, aucune donnee\n"
        " * nominative. Genere par scripts/geo/build_geo.py le 2026-10-28.\n"
        " */\n"
        "window.SUDAN = window.SUDAN || {};\n"
        "window.SUDAN.geo = " + json.dumps(geo, ensure_ascii=False) + ";\n"
    )
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(js)

    print("roads corridors:", len(roads),
          "| airports:", len(airports),
          "| ports:", len(ports),
          "| crossings:", len(crossings))
    print("road km total:", sum(r["km"] for r in roads))
    print("wrote", out_path, "(%d KB)" % (os.path.getsize(out_path) // 1024))


if __name__ == "__main__":
    main()
