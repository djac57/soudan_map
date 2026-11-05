"""Build data/layer_displacement.js from scripts/displacement/records.json.

    python3 -I scripts/displacement/build_displacement.py <soudan_dir>

Ecrit UNIQUEMENT <soudan_dir>/data/layer_displacement.js (window.SUDAN.displacement).
Entree : records.json (versionne, aucune donnee brute gitignoree requise).
Refuse toute valeur sans source attribuee ni date.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def fail(msg):
    sys.exit("build_displacement: " + msg)


def check_src(rec, key, ctx):
    src = rec.get(key)
    if src is not None and src not in SOURCES:
        fail("%s: source inconnue %r" % (ctx, src))


def main():
    if len(sys.argv) != 2:
        fail("usage: build_displacement.py <soudan_dir>")
    soudan = sys.argv[1]
    with open(os.path.join(HERE, "records.json"), encoding="utf-8") as f:
        rec = json.load(f)

    global SOURCES
    SOURCES = rec["sources"]

    for n in rec["neighbours"]:
        for k in ("country_fr", "country_en", "iso3", "lon", "lat", "refugees_stock", "source"):
            if n.get(k) in (None, ""):
                fail("voisin %r: champ %s manquant" % (n.get("country_fr"), k))
        check_src(n, "source", n["country_fr"])
        check_src(n, "source2", n["country_fr"])

    for h in rec["origin_hubs_idp_2023"]:
        for k in ("name_fr", "lon", "lat", "share", "source"):
            if h.get(k) in (None, ""):
                fail("origine %r: champ %s manquant" % (h.get("name_fr"), k))
        check_src(h, "source", h["name_fr"])

    r = rec["returns_to_sudan"]
    check_src(r, "source", "retours")
    for t in rec["idp_totals_timeline"]:
        check_src(t, "source", t["date"])

    payload = {
        "generated": rec["generated"],
        "note": rec["note"],
        "sources": SOURCES,
        "origin_hubs_idp_2023": rec["origin_hubs_idp_2023"],
        "neighbours": rec["neighbours"],
        "returns_to_sudan": rec["returns_to_sudan"],
        "idp_totals_timeline": rec["idp_totals_timeline"],
        "europe": rec.get("europe"),
        "timeseries": json.load(open(os.path.join(HERE, "timeseries.json"), encoding="utf-8")),
    }
    out = os.path.join(soudan, "data", "layer_displacement.js")
    body = json.dumps(payload, ensure_ascii=False, indent=2)
    with open(out, "w", encoding="utf-8") as f:
        f.write(
            "/* ------------------------------------------------------------------\n"
            " * data/layer_displacement.js — MOUVEMENTS DE POPULATION (déplacés internes\n"
            " * et réfugiés). Généré par scripts/displacement/build_displacement.py —\n"
            " * NE PAS éditer à la main ; modifier records.json puis relancer.\n"
            " * Chiffres publiés, datés, sourcés ; bases différentes (stock / arrivées /\n"
            " * retours) à ne pas additionner.\n"
            " * ------------------------------------------------------------------ */\n"
            "(function () {\n"
            "  \"use strict\";\n"
            "  window.SUDAN = window.SUDAN || {};\n"
            "  window.SUDAN.displacement = " + body + ";\n"
            "})();\n"
        )
    print("wrote", out)


if __name__ == "__main__":
    main()
