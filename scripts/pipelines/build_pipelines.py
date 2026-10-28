#!/usr/bin/env python3
"""build_pipelines.py — build data/layer_pipelines.js (COUCHE OLEODUCS, vraie geometrie).

Usage:
  python3 -I scripts/pipelines/build_pipelines.py <raw_pipelines_dir> <out_layer_pipelines.js>

Produit une couche ADDITIVE chargee APRES bundle.js :
  window.SUDAN.pipelines = { lines[], terminals[], note, sources }

GEOMETRIE : tracee a partir d'OpenStreetMap (ODbL). La relation OSM
"Greater Nile Oil Pipeline" (Q1757784) et ses voies membres sont recollees par
noeud partage en corridors continus, puis simplifiees (Ramer-Douglas-Peucker ~1 km).

ATTRIBUTION DES DEUX OLEODUCS : OSM etiquette TOUT le reseau "Greater Nile Oil
Pipeline" (operateur GNPOC), y compris l'antenne orientale issue du bassin de
Melut (une voie y porte meme un fixme OSM 'uncertain crossing Rabak'). Or la
realite documentee (Wikipedia, Global Energy Monitor) distingue DEUX oleoducs :
  - GNPOC / Greater Nile : bassin de Muglad (Unity/Heglig, ~lon 28,5-30) -> Port-Soudan
  - Petrodar / PDOC      : bassin de Melut (Palogue, Haut-Nil, ~lon 32,5) -> Port-Soudan
On separe donc les corridors recolles par l'ORIGINE (longitude du point le plus au
sud) : < 31 -> GNPOC (ouest/Muglad), >= 31 -> Petrodar (est/Melut). La GEOMETRIE
reste 100 % OSM (geometry_quality='osm') ; seule la mise en deux noms est une
INFERENCE documentee, signalee dans chaque 'note'. Rien n'est invente.

Garde-fou Darfour : aucune ligne de controle, aucun suivi d'unites, aucune donnee
nominative. Infrastructure d'export, non temps reel.
"""
import sys, os, json, math
from collections import defaultdict

# Sudan + South Sudan rough bbox (lon_min, lat_min, lon_max, lat_max) for validation.
BBOX = (22.0, 3.4, 39.2, 23.3)
# Longitude threshold splitting the two basins (Muglad west / Melut east).
SPLIT_LON = 31.0
RDP_EPS = 0.008          # ~0.9 km
ROUND = 5                # coord decimals


def in_bbox(lon, lat):
    x0, y0, x1, y1 = BBOX
    return x0 <= lon <= x1 and y0 <= lat <= y1


def hav(a, b):
    R = 6371.0; p = math.pi / 180.0
    dlat = (b[1] - a[1]) * p; dlon = (b[0] - a[0]) * p
    x = math.sin(dlat / 2) ** 2 + math.cos(a[1] * p) * math.cos(b[1] * p) * math.sin(dlon / 2) ** 2
    return 2 * R * math.asin(math.sqrt(x))


def polyline_km(pts):
    return sum(hav(pts[i], pts[i + 1]) for i in range(len(pts) - 1))


def rdp(pts, eps):
    if len(pts) < 3:
        return pts[:]
    a, b = pts[0], pts[-1]
    dmax = 0.0; idx = 0
    dx = b[0] - a[0]; dy = b[1] - a[1]
    den = math.hypot(dx, dy) or 1e-12
    for i in range(1, len(pts) - 1):
        px, py = pts[i]
        dd = abs(dy * px - dx * py + b[0] * a[1] - b[1] * a[0]) / den
        if dd > dmax:
            dmax = dd; idx = i
    if dmax > eps:
        return rdp(pts[:idx + 1], eps)[:-1] + rdp(pts[idx:], eps)
    return [a, b]


def stitch(ways):
    """Stitch OSM ways (each {pts, nodes}) into continuous corridors via shared end nodes."""
    ends = defaultdict(list)
    for i, w in enumerate(ways):
        ends[w["nodes"][0]].append(i)
        ends[w["nodes"][-1]].append(i)
    used = [False] * len(ways)

    def oriented(i, sn):
        w = ways[i]
        if w["nodes"][0] == sn:
            return w["pts"], w["nodes"][-1]
        return list(reversed(w["pts"])), w["nodes"][0]

    def extend(start_node):
        chain = []; node = start_node; prev = None; guard = 0
        while guard < 100000:
            guard += 1
            cand = [k for k in ends[node] if not used[k]]
            if len(cand) != 1:
                break
            k = cand[0]; used[k] = True
            seg, node = oriented(k, node)
            chain.extend(seg if prev is None else seg[1:]); prev = seg
        return chain

    corridors = []
    for i, w in enumerate(ways):
        if used[i]:
            continue
        used[i] = True
        sn, en = w["nodes"][0], w["nodes"][-1]
        back = list(reversed(extend(sn)))
        fwd = extend(en)
        chain = back + list(w["pts"]) + fwd
        clean = [chain[0]]
        for p in chain[1:]:
            if p != clean[-1]:
                clean.append(p)
        corridors.append(clean)
    return corridors


def load_ways(raw_dir):
    data = json.load(open(os.path.join(raw_dir, "pipeline_relation_ways.json"), encoding="utf-8"))
    ways = []
    for e in data["elements"]:
        g = e.get("geometry", [])
        nd = e.get("nodes", [])
        if len(g) < 2 or len(nd) != len(g):
            continue
        pts = []
        for p in g:
            lon, lat = p["lon"], p["lat"]
            if not in_bbox(lon, lat):
                raise SystemExit("point OSM hors bbox: %s,%s (way %s)" % (lon, lat, e["id"]))
            pts.append((lon, lat))
        ways.append({"id": e["id"], "pts": pts, "nodes": nd})
    return ways


def corridor_simplified(corridor):
    simp = rdp(corridor, RDP_EPS)
    return [[round(p[0], ROUND), round(p[1], ROUND)] for p in simp]


def multiline(corridors):
    """Return (coordinates, measured_km). MultiLineString unless a single corridor."""
    coords = []
    km = 0.0
    for c in corridors:
        km += polyline_km(c)
        coords.append(corridor_simplified(c))
    if len(coords) == 1:
        return {"type": "LineString", "coordinates": coords[0]}, km
    return {"type": "MultiLineString", "coordinates": coords}, km


def southmost_lon(corridor):
    return min(corridor, key=lambda p: p[1])[0]


def build(raw_dir, out_path):
    ways = load_ways(raw_dir)
    corridors = stitch(ways)
    corridors.sort(key=lambda c: -polyline_km(c))

    west, east = [], []
    for c in corridors:
        (west if southmost_lon(c) < SPLIT_LON else east).append(c)

    gnpoc_geom, gnpoc_km = multiline(west)
    pdoc_geom, pdoc_km = multiline(east)

    SRC_OSM = ("Geometrie : OpenStreetMap (ODbL), relation 'Greater Nile Oil Pipeline' "
               "Q1757784 et voies membres (man_made=pipeline, substance=oil), recollees "
               "et simplifiees (RDP ~1 km) par scripts/pipelines/.")

    lines = [
        {
            "name": "Greater Nile Oil Pipeline (GNPOC)",
            "operator": "Greater Nile Petroleum Operating Company (GNPOC)",
            "length_km": 1600,
            "length_km_osm": round(gnpoc_km),
            "substance": "oil",
            "status": "en service mais perturbe par la guerre (2024-2025) ; noeud de Heglig pris par les FSR (dec. 2025)",
            "geometry": gnpoc_geom,
            "geometry_quality": "osm",
            "source": SRC_OSM + " Operateur/longueur (~1 600 km) : tags OSM (operator=GNPOC), "
                      "Wikipedia 'Greater Nile Oil Pipeline' et Global Energy Monitor.",
            "note": (
                "Oleoduc d'environ 1 600 km (tronc principal documente). Longueur totale des "
                "tubes traces dans OSM, tronc + antennes de collecte : ~%d km. Evacue le brut du bassin de Muglad "
                "(champs d'Unity/Heglig, Soudan du Sud et zone frontaliere) jusqu'au terminal "
                "de Port-Soudan (mer Rouge). Le Soudan du Sud etant ENCLAVE, la quasi-totalite "
                "de son brut transite par le Soudan, qui percoit des DROITS DE TRANSIT (selon "
                "Reuters et Sudan Tribune). Selon Al Jazeera et Sudan Tribune (8 dec. 2025), les "
                "FSR (RSF) ont pris le champ de HEGLIG, noeud cle de ce reseau ; selon Sudan "
                "Tribune, des droits de passage (~4 USD/baril) seraient preleves dans les zones "
                "sous controle FSR. Production nationale et transit fortement reduits depuis 2023."
                % round(gnpoc_km)
            ),
        },
        {
            "name": "Petrodar (PDOC) — oleoduc du Dar Blend",
            "operator": "Petrodar Operating Company (PDOC)",
            "length_km": 1380,
            "length_km_osm": round(pdoc_km),
            "substance": "oil",
            "status": "perturbe : rupture du reseau d'export et force majeure declaree (2024), exportations sud-soudanaises reduites",
            "geometry": pdoc_geom,
            "geometry_quality": "osm",
            "source": SRC_OSM + " ATTRIBUTION a Petrodar : INFERENCE documentee (OSM etiquette ce "
                      "trace 'Greater Nile Oil Pipeline', avec un fixme 'uncertain crossing Rabak') ; "
                      "l'origine du trace dans le bassin/les champs de Melut-Palogue (Haut-Nil) "
                      "correspond au reseau Petrodar/PDOC selon Wikipedia 'Petrodar' et Global Energy Monitor.",
            "note": (
                "Oleoduc d'environ 1 380 km (longueur mesuree sur la geometrie OSM : ~%d km, "
                "coherente avec les ~1 380 km documentes) acheminant le brut 'Dar Blend' du "
                "bassin de Melut (champs de Palogue, Haut-Nil, Soudan du Sud) jusqu'a Port-Soudan. "
                "En 2024, une RUPTURE sur le reseau d'export, dans une zone affectee par la guerre, "
                "a interrompu les exportations sud-soudanaises et conduit a une declaration de "
                "FORCE MAJEURE (selon Reuters et Sudan Tribune, 2024), faisant chuter la production. "
                "ATTENTION attribution : dans OpenStreetMap ce trace est etiquete 'Greater Nile Oil "
                "Pipeline' (relation Q1757784) ; sa separation en 'Petrodar' est faite ici d'apres "
                "l'ORIGINE documentee du trace (bassin de Melut-Palogue, operateur PDOC). La "
                "geometrie elle-meme est bien OSM (geometry_quality='osm')."
                % round(pdoc_km)
            ),
        },
    ]

    # Terminals : ancres sur les EXTREMITES NORD des traces OSM (Port-Soudan).
    def north_end(geom):
        if geom["type"] == "LineString":
            segs = [geom["coordinates"]]
        else:
            segs = geom["coordinates"]
        best = None
        for s in segs:
            for pt in (s[0], s[-1]):
                if best is None or pt[1] > best[1]:
                    best = pt
        return best

    g_end = north_end(gnpoc_geom)
    p_end = north_end(pdoc_geom)
    terminals = [
        {
            "name": "Terminal petrolier de Port-Soudan (debouche du Greater Nile / zone Bashayer)",
            "lon": round(g_end[0], ROUND), "lat": round(g_end[1], ROUND),
            "type": "terminal d'export maritime (mer Rouge)",
            "source": "Coordonnees : extremite nord du trace OSM du GNPOC (Port-Soudan). "
                      "Nom/contexte (terminal de Bashayer/Bashair, debouche d'export) : documentation ouverte. APPROXIMATIF.",
        },
        {
            "name": "Terminal petrolier de Port-Soudan (debouche Petrodar / Dar Blend)",
            "lon": round(p_end[0], ROUND), "lat": round(p_end[1], ROUND),
            "type": "terminal d'export maritime (mer Rouge)",
            "source": "Coordonnees : extremite nord du trace OSM de l'antenne de Melut (Port-Soudan). "
                      "Nom/contexte (terminal d'export du Dar Blend/Petrodar) : documentation ouverte. APPROXIMATIF.",
        },
    ]

    obj = {
        "generated": "2026-10-28",
        "lines": lines,
        "terminals": terminals,
        "note": (
            "Couche OLEODUCS (petrole) : VRAIE geometrie de trace issue d'OpenStreetMap (ODbL), "
            "distincte du trace SCHEMATIQUE de la couche 'ressources'. Deux oleoducs relient les "
            "champs du Soudan du Sud (enclave) a Port-Soudan a travers le Soudan, qui percoit des "
            "droits de transit : le Greater Nile (GNPOC, bassin de Muglad / Unity-Heglig) et le "
            "Petrodar (PDOC, bassin de Melut / Palogue, brut 'Dar Blend'). Ces tubes traversent "
            "des zones de conflit : selon Al Jazeera et Sudan Tribune, les FSR ont pris Heglig "
            "(dec. 2025) ; en 2024 une rupture du reseau d'export a entraine une declaration de "
            "force majeure et une chute de la production (Reuters, Sudan Tribune). "
            "METHODE : voies OSM de la relation 'Greater Nile Oil Pipeline' (Q1757784) recollees "
            "par noeud partage puis simplifiees (RDP ~1 km). La geometrie est OSM "
            "(geometry_quality='osm'). La separation GNPOC/Petrodar est une INFERENCE documentee "
            "fondee sur l'origine du trace (bassin de Muglad vs bassin de Melut) : OSM regroupe "
            "tout sous le nom 'Greater Nile' (avec un fixme d'incertitude sur un croisement a "
            "Rabak). Terminaux ancres sur les extremites nord des traces OSM a Port-Soudan "
            "(positions APPROXIMATIVES). Garde-fou Darfour : aucune ligne de controle, aucun suivi "
            "d'unites, aucune donnee nominative. LIMITES : couverture OSM possiblement incomplete "
            "(quelques voies 'Greater Nile' hors relation non reprises) ; attribution Petrodar "
            "inferee ; statuts d'exploitation tres mouvants (dates indiquees). Attribution OSM "
            "requise (c) contributeurs OpenStreetMap."
        ),
        "sources": [
            {"key": "osm", "name": "OpenStreetMap — relation 'Greater Nile Oil Pipeline' (Q1757784) et voies man_made=pipeline, substance=oil (geometrie des traces)",
             "url": "https://www.openstreetmap.org/relation/4195758", "license": "ODbL 1.0 — (c) contributeurs OpenStreetMap, attribution requise", "date": "2026-10 (consulte)"},
            {"key": "gem", "name": "Global Energy Monitor — Global Oil Infrastructure Tracker (existence, operateurs, longueurs ; reference croisee)",
             "url": "https://globalenergymonitor.org/projects/global-oil-infrastructure-tracker/", "license": "CC BY 4.0", "date": "ref."},
            {"key": "wiki_gnpoc", "name": "Wikipedia — 'Greater Nile Oil Pipeline'",
             "url": "https://en.wikipedia.org/wiki/Greater_Nile_Oil_Pipeline", "license": "CC BY-SA 4.0", "date": "ref."},
            {"key": "wiki_petrodar", "name": "Wikipedia — 'Petrodar' / 'PetroDar'",
             "url": "https://en.wikipedia.org/wiki/Petrodar", "license": "CC BY-SA 4.0", "date": "ref."},
            {"key": "aljazeera_heglig", "name": "Al Jazeera — 'RSF seizes key Heglig oil field'",
             "url": "https://www.aljazeera.com/news/2025/12/8/rsf-claims-seizure-of-key-heglig-oil-field-in-sudan", "license": "presse, citee", "date": "2025-12-08"},
            {"key": "sudantribune_transit", "name": "Sudan Tribune — droits de transit et controle du corridor petrolier",
             "url": "https://sudantribune.com/", "license": "presse, citee", "date": "2025"},
            {"key": "reuters_forcemajeure", "name": "Reuters — rupture du pipeline et force majeure sur le brut sud-soudanais (2024)",
             "url": "https://www.reuters.com/business/energy/", "license": "presse, citee", "date": "2024"},
        ],
        "counts": {"lines": len(lines), "terminals": len(terminals)},
    }

    header = (
        "/* ------------------------------------------------------------------\n"
        " * data/layer_pipelines.js - COUCHE OLEODUCS (petrole), VRAIE geometrie OSM\n"
        " * Genere par scripts/pipelines/build_pipelines.py - NE PAS editer a la main.\n"
        " * Entree : data/raw/pipelines/pipeline_relation_ways.json (OSM/Overpass, ODbL).\n"
        " * Charge APRES data/bundle.js. Additif : pose window.SUDAN.pipelines.\n"
        " * Geometrie = traces OSM recolles + simplifies (RDP ~1 km). Separation GNPOC/\n"
        " * Petrodar = inference documentee (origine Muglad vs Melut). Voir .README.md.\n"
        " * ------------------------------------------------------------------ */\n"
    )
    body = json.dumps(obj, ensure_ascii=False, separators=(", ", ": "))
    js = (
        header
        + "(function () {\n  \"use strict\";\n"
        + "  window.SUDAN = window.SUDAN || {};\n"
        + "  window.SUDAN.pipelines = " + body + ";\n"
        + "})();\n"
    )
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(js)

    print("OK -> %s (%d KB)" % (out_path, os.path.getsize(out_path) // 1024))
    print("  GNPOC: %d corridors, ~%d km OSM | Petrodar: %d corridors, ~%d km OSM"
          % (len(west), round(gnpoc_km), len(east), round(pdoc_km)))
    npts = sum(len(s) for ln in lines for s in (
        [ln["geometry"]["coordinates"]] if ln["geometry"]["type"] == "LineString"
        else ln["geometry"]["coordinates"]))
    print("  terminals: %d | total simplified vertices: %d" % (len(terminals), npts))


def main(argv):
    if len(argv) != 3:
        sys.stderr.write("usage: python3 -I build_pipelines.py <raw_pipelines_dir> <out_layer_pipelines.js>\n")
        return 2
    build(argv[1], argv[2])
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
