"""Build data/layer_backers.js + data/backers_countries.geojson — COUCHE SOUTIENS ÉTRANGERS.

    python3 -I scripts/backers/build_backers.py <soudan_dir> [raw_dir]

N'ÉCRIT QUE :
  - <soudan_dir>/data/layer_backers.js        (objet global window.SUDAN.backers)
  - <soudan_dir>/data/backers_countries.geojson (polygones pays alignés par camp)
Ne touche à AUCUN autre fichier. layer_backers.js est chargé APRÈS data/bundle.js,
additif. Le geojson est référencé par le JS (champ `alignment.geojson`).

SUJET DIPLOMATIQUEMENT SENSIBLE — rigueur maximale :
  - chaque soutien / alignement / route / aéroport est ATTRIBUÉ (source + URL + date) ;
  - niveaux de certitude « multi-source » / « rapporte » / « ambivalent » ;
  - démentis gouvernementaux notés (`denied`) ; équilibre SAF / RSF ;
  - aucune donnée nominative ; rien d'inventé ; garde-fou Darfour (transit ≠ soutien d'État).

Entrées (raw_dir, par défaut <soudan_dir>/data/raw/backers) :
  backers_records.json          notes détaillées par camp (saf/rsf) + cibles Soudan
  backers_model.json            alignment (par ISO3), routes typées, logistics_airports
  countries_adm0/<ISO>.geojson  geoBoundaries gbOpen ADM0 simplifié (CC BY 4.0)

Sources privilégiées : Groupe d'experts de l'ONU sur le Soudan (comité 1591), ACLED,
Chatham House « Gold and the war in Sudan », Reuters/AFP/Al Jazeera, ICG, GI-TOC,
The Sentry, Sudan Tribune, Middle East Eye, Conflict Intelligence Group. Voir le README.
"""
import json
import os
import sys

GENERATED = "2026-10-28"
CERTAINTY_OK = {"multi-source", "rapporte", "ambivalent"}
SIDE_OK = {"RSF", "SAF", "mixed", "context", "theatre"}

# Précision de simplification des polygones ADM0 (décimales). Contours de contexte,
# pas des polygones analytiques. Russie dégradée davantage (immense, loin).
PREC = 2
PREC_COARSE = {"RUS": 1}
# Surface mini d'un anneau conservé (deg^2) pour éliminer les micro-îles.
MIN_RING_AREA = {"default": 0.02, "RUS": 2.0, "SDN": 0.0}


# ---------- validation des enregistrements attribués ----------

def check_source(obj, ctx):
    s = obj.get("source")
    if isinstance(s, dict):
        s = [s]
    if not s:
        raise ValueError("%s: source attribuée manquante" % ctx)
    for one in s:
        for k in ("name", "url", "date"):
            if not one.get(k):
                raise ValueError("%s: source incomplète (%s)" % (ctx, k))


def clean_support(side, e):
    for key in ("country", "country_fr", "iso3", "lon", "lat",
                "support_type", "certainty", "status", "note", "sources"):
        if key not in e:
            raise ValueError("%s: champ '%s' manquant (%r)" % (side, key, e.get("country")))
    if e["certainty"] not in CERTAINTY_OK:
        raise ValueError("%s/%s: certainty invalide %r" % (side, e["country"], e["certainty"]))
    if not e["sources"]:
        raise ValueError("%s/%s: au moins une source requise" % (side, e["country"]))
    for s in e["sources"]:
        for k in ("name", "url", "date"):
            if not s.get(k):
                raise ValueError("%s/%s: source incomplète" % (side, e["country"]))
    out = {
        "country": e["country"], "country_fr": e["country_fr"], "iso3": e["iso3"],
        "lon": round(float(e["lon"]), 4), "lat": round(float(e["lat"]), 4),
        "support_type": list(e["support_type"]), "certainty": e["certainty"],
        "denied": bool(e.get("denied", False)), "status": e["status"], "note": e["note"],
        "sources": [{"name": s["name"], "url": s["url"], "date": s["date"]} for s in e["sources"]],
    }
    if e.get("hub"):
        h = e["hub"]
        out["hub"] = {"name": h["name"], "lon": round(float(h["lon"]), 4),
                      "lat": round(float(h["lat"]), 4)}
    return out


def clean_alignment(a):
    ctx = "alignment/%s" % a.get("iso3")
    for k in ("iso3", "country_fr", "side", "support_type", "certainty", "note"):
        if k not in a:
            raise ValueError("%s: champ '%s' manquant" % (ctx, k))
    if a["side"] not in SIDE_OK:
        raise ValueError("%s: side invalide %r" % (ctx, a["side"]))
    if a["certainty"] not in CERTAINTY_OK:
        raise ValueError("%s: certainty invalide %r" % (ctx, a["certainty"]))
    check_source(a, ctx)
    out = {
        "iso3": a["iso3"], "country_fr": a["country_fr"], "side": a["side"],
        "support_type": list(a["support_type"]), "certainty": a["certainty"],
        "denied": bool(a.get("denied", False)), "note": a["note"],
        "source": {"name": a["source"]["name"], "url": a["source"]["url"], "date": a["source"]["date"]},
    }
    if a.get("ambivalent"):
        out["ambivalent"] = True
    return out


def clean_route(r):
    ctx = "route/%s" % r.get("label")
    for k in ("type", "actor", "label", "coords", "certainty", "source", "note"):
        if k not in r:
            raise ValueError("%s: champ '%s' manquant" % (ctx, k))
    if r["actor"] not in ("RSF", "SAF"):
        raise ValueError("%s: actor invalide %r" % (ctx, r["actor"]))
    if r["certainty"] not in CERTAINTY_OK:
        raise ValueError("%s: certainty invalide" % ctx)
    if len(r["coords"]) < 2:
        raise ValueError("%s: polyligne < 2 points" % ctx)
    check_source(r, ctx)
    return {
        "type": r["type"], "actor": r["actor"], "label": r["label"],
        "coords": [[round(float(x), 4), round(float(y), 4)] for x, y in r["coords"]],
        "certainty": r["certainty"], "denied": bool(r.get("denied", False)), "note": r["note"],
        "source": {"name": r["source"]["name"], "url": r["source"]["url"], "date": r["source"]["date"]},
    }


def clean_airport(p):
    ctx = "airport/%s" % p.get("name")
    for k in ("name", "lon", "lat", "side", "role", "source"):
        if k not in p:
            raise ValueError("%s: champ '%s' manquant" % (ctx, k))
    check_source(p, ctx)
    return {
        "name": p["name"], "country": p.get("country", ""),
        "lon": round(float(p["lon"]), 4), "lat": round(float(p["lat"]), 4),
        "side": p["side"], "role": p["role"],
        "source": {"name": p["source"]["name"], "url": p["source"]["url"], "date": p["source"]["date"]},
    }


# ---------- simplification des polygones ----------

def ring_area(ring):
    s = 0.0
    n = len(ring)
    for i in range(n - 1):
        x1, y1 = ring[i]
        x2, y2 = ring[i + 1]
        s += x1 * y2 - x2 * y1
    return abs(s) / 2.0


def round_ring(ring, prec, min_area):
    out, last = [], None
    for pt in ring:
        p = [round(pt[0], prec), round(pt[1], prec)]
        if p != last:
            out.append(p)
            last = p
    if len(out) >= 3 and out[0] != out[-1]:
        out.append(out[0])
    if len(out) < 4 or ring_area(out) < min_area:
        return None
    return out


def simplify_geom(geom, prec, min_area):
    t = geom["type"]
    if t == "Polygon":
        rings = [r for r in (round_ring(r, prec, min_area if i == 0 else 0.0)
                             for i, r in enumerate(geom["coordinates"])) if r]
        return {"type": "Polygon", "coordinates": rings} if rings else None
    if t == "MultiPolygon":
        polys = []
        for poly in geom["coordinates"]:
            rings = [r for r in (round_ring(r, prec, min_area if i == 0 else 0.0)
                                 for i, r in enumerate(poly)) if r]
            if rings:
                polys.append(rings)
        return {"type": "MultiPolygon", "coordinates": polys} if polys else None
    return None


def build_countries_geojson(raw_dir, alignment):
    by_iso = {a["iso3"]: a for a in alignment}
    cdir = os.path.join(raw_dir, "countries_adm0")
    feats = []
    for iso in sorted(by_iso):
        path = os.path.join(cdir, iso + ".geojson")
        if not os.path.exists(path):
            raise ValueError("polygone manquant pour %s (%s)" % (iso, path))
        with open(path, encoding="utf-8") as fh:
            fc = json.load(fh)
        src_feat = fc["features"][0]
        prec = PREC_COARSE.get(iso, PREC)
        min_area = MIN_RING_AREA.get(iso, MIN_RING_AREA["default"])
        geom = simplify_geom(src_feat["geometry"], prec, min_area)
        if geom is None:
            raise ValueError("géométrie vide après simplification: %s" % iso)
        a = by_iso[iso]
        feats.append({
            "type": "Feature",
            "properties": {
                "iso3": iso, "name_fr": a["country_fr"], "side": a["side"],
                "support_type": a["support_type"], "certainty": a["certainty"],
                "denied": a["denied"], "ambivalent": a.get("ambivalent", False),
                "note": a["note"], "source": a["source"]["name"],
                "source_url": a["source"]["url"], "source_date": a["source"]["date"],
            },
            "geometry": geom,
        })
    return {
        "type": "FeatureCollection",
        "name": "backers_countries",
        "_license": "Frontières : geoBoundaries gbOpen ADM0 (CC BY 4.0). Attributs d'alignement : voir data/layer_backers.README.md (ATTRIBUÉS/ALLÉGUÉS).",
        "_generated": GENERATED,
        "features": feats,
    }


# ---------- assemblage ----------

def build(soudan_dir, raw_dir):
    with open(os.path.join(raw_dir, "backers_records.json"), encoding="utf-8") as fh:
        rec = json.load(fh)
    with open(os.path.join(raw_dir, "backers_model.json"), encoding="utf-8") as fh:
        model = json.load(fh)

    saf = [clean_support("saf", e) for e in rec["saf"]]
    rsf = [clean_support("rsf", e) for e in rec["rsf"]]
    alignment = [clean_alignment(a) for a in model["alignment"]]
    routes = [clean_route(r) for r in model["routes"]]
    airports = [clean_airport(p) for p in model["logistics_airports"]]

    # Vérifs d'équilibre / garde-fous.
    saf_aligned = [a for a in alignment if a["side"] == "SAF"]
    rsf_aligned = [a for a in alignment if a["side"] == "RSF"]
    if not saf_aligned or not rsf_aligned:
        raise ValueError("déséquilibre: il faut des pays alignés des DEUX côtés")

    # Écriture du geojson des pays.
    countries = build_countries_geojson(raw_dir, alignment)
    geo_path = os.path.join(soudan_dir, "data", "backers_countries.geojson")
    with open(geo_path, "w", encoding="utf-8") as fh:
        json.dump(countries, fh, ensure_ascii=False, separators=(",", ":"))

    # Sources dédupliquées (toutes les briques).
    seen = {}
    def add_src(s):
        seen.setdefault(s["url"], {"name": s["name"], "url": s["url"], "date": s["date"]})
    for e in saf + rsf:
        for s in e["sources"]:
            add_src(s)
    for coll in (alignment, routes, airports):
        for item in coll:
            add_src(item["source"])
    sources = sorted(seen.values(), key=lambda s: s["name"].lower())

    obj = {
        "generated": GENERATED,
        "target": rec["sudan_target"],
        "legend": {
            "saf": "Forces armées soudanaises (al-Burhan) — soutiens rapportés",
            "rsf": "Forces de soutien rapide (Hemedti) — soutiens rapportés",
            "sides": model["_sides"],
            "certainty": {
                "multi-source": "Confirmé par plusieurs sources indépendantes",
                "rapporte": "Rapporté / allégué (non confirmé indépendamment)",
                "ambivalent": "Rôle changeant / joue les deux camps",
            },
            "route_types": {
                "gold": "Or (financement du conflit)",
                "arms_fuel": "Armes & carburant",
                "arms": "Armes / drones",
                "fighters": "Combattants / mercenaires",
            },
        },
        "alignment": {
            "geojson": "data/backers_countries.geojson",
            "source_boundaries": "geoBoundaries gbOpen ADM0 (CC BY 4.0)",
            "countries": alignment,
        },
        "routes": routes,
        "logistics_airports": airports,
        "saf": saf,
        "rsf": rsf,
        "sources": sources,
        "note": (
            "SOUTIENS ÉTRANGERS RAPPORTÉS — sujet diplomatiquement sensible, inspiré des "
            "cartographies de référence (Le Monde, ACLED, Chatham House). Aucun de ces soutiens "
            "n'est « officiel » : ce sont des allégations ATTRIBUÉES à des sources fiables "
            "(Groupe d'experts de l'ONU sur le Soudan en priorité, puis ACLED, Chatham House "
            "« Gold and the war in Sudan », Reuters/AFP/Al Jazeera, ICG, GI-TOC, The Sentry, "
            "Sudan Tribune, Middle East Eye, Conflict Intelligence Group), chacune datée et liée. "
            "Les gouvernements concernés DÉMENTENT le plus souvent (champ `denied`). Étiquetage "
            "par certitude : « multi-source », « rapporte », « ambivalent » (ex. Russie, des "
            "deux côtés). GARDE-FOU : pour un pays-RELAIS (Tchad, Libye, Soudan du Sud, RCA, "
            "Somalie/Puntland), le camp indiqué reflète un TRANSIT allégué — pas nécessairement "
            "un soutien de l'État. Les `routes` sont des polylignes passant par des HUBS réels "
            "(aéroports/villes), indicatives et non des tracés précis. Les polygones pays "
            "proviennent de geoBoundaries (CC BY 4.0), simplifiés pour l'affichage. LIMITES : "
            "couverture non exhaustive ; dates hétérogènes ; situation évolutive (bascule russe "
            "2024, reflux iranien, baisse des vols EAU via le Tchad en 2025) ; absence d'une entrée "
            "≠ absence de soutien. À lire comme une cartographie PRUDENTE et ÉQUILIBRÉE de ce "
            "qui est allégué, pas comme un constat judiciaire."
        ),
    }

    body = json.dumps(obj, ensure_ascii=False, indent=2, sort_keys=False)
    header = (
        "/* ------------------------------------------------------------------\n"
        " * data/layer_backers.js — COUCHE SOUTIENS ÉTRANGERS (qui soutient SAF vs RSF)\n"
        " * Généré par scripts/backers/build_backers.py — NE PAS éditer à la main.\n"
        " * Chargé APRÈS data/bundle.js. Additif : pose window.SUDAN.backers.\n"
        " * Pays alignés : data/backers_countries.geojson (geoBoundaries CC BY 4.0).\n"
        " * SUJET SENSIBLE : soutiens/alignements/routes RAPPORTÉS, ATTRIBUÉS, étiquetés par\n"
        " * certitude ; démentis notés ; équilibre SAF/RSF ; garde-fou transit≠soutien d'État.\n"
        " * Sources : Groupe d'experts de l'ONU, ACLED, Chatham House, etc. — voir .README.md.\n"
        " * ------------------------------------------------------------------ */\n"
    )
    js = (header + "(function () {\n" + '  "use strict";\n'
          + "  window.SUDAN = window.SUDAN || {};\n"
          + "  window.SUDAN.backers = " + body + ";\n})();\n")
    js_path = os.path.join(soudan_dir, "data", "layer_backers.js")
    with open(js_path, "w", encoding="utf-8") as fh:
        fh.write(js)

    print("layer_backers.js : %d SAF, %d RSF, %d pays alignés (SAF %d / RSF %d), "
          "%d routes, %d aéroports, %d sources."
          % (len(saf), len(rsf), len(alignment), len(saf_aligned), len(rsf_aligned),
             len(routes), len(airports), len(sources)))
    print("  -> " + js_path)
    print("  -> %s (%d pays, %d o)" % (geo_path, len(countries["features"]), os.path.getsize(geo_path)))


def main(argv):
    if len(argv) < 2:
        sys.stderr.write(__doc__)
        return 2
    soudan_dir = os.path.abspath(argv[1])
    raw_dir = (os.path.abspath(argv[2]) if len(argv) > 2
               else os.path.join(soudan_dir, "data", "raw", "backers"))
    build(soudan_dir, raw_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
