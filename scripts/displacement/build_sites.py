"""Build data/layer_refugee_sites.js from scripts/displacement/sites.json.

    python3 -I scripts/displacement/build_sites.py <soudan_dir>

Ecrit UNIQUEMENT <soudan_dir>/data/layer_refugee_sites.js (window.SUDAN.refugeeSites).
Refuse tout site sans coordonnees sourcees ni effectif date.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def fail(msg):
    sys.exit("build_sites: " + msg)


def main():
    if len(sys.argv) != 2:
        fail("usage: build_sites.py <soudan_dir>")
    soudan = sys.argv[1]
    with open(os.path.join(HERE, "sites.json"), encoding="utf-8") as f:
        rec = json.load(f)
    for s in rec["sites"]:
        name = s.get("name_fr", "?")
        for k in ("name_fr", "country_fr", "kind", "lon", "lat", "coord_source", "sudanese", "count_source"):
            if s.get(k) in (None, ""):
                fail("%s: champ %s manquant" % (name, k))
        if not s["coord_source"].get("url") or not s["count_source"].get("url"):
            fail("%s: source sans URL" % name)
        if s["kind"] not in ("camp", "settlement", "city", "national"):
            fail("%s: kind inconnu %r" % (name, s["kind"]))
    out = os.path.join(soudan, "data", "layer_refugee_sites.js")
    body = json.dumps(rec, ensure_ascii=False, indent=2)
    with open(out, "w", encoding="utf-8") as f:
        f.write(
            "/* ------------------------------------------------------------------\n"
            " * data/layer_refugee_sites.js — SITES D'ACCUEIL des réfugiés soudanais.\n"
            " * Généré par scripts/displacement/build_sites.py — NE PAS éditer à la main ;\n"
            " * modifier sites.json puis relancer. Coordonnées et effectifs sourcés.\n"
            " * ------------------------------------------------------------------ */\n"
            "(function () {\n"
            "  \"use strict\";\n"
            "  window.SUDAN = window.SUDAN || {};\n"
            "  window.SUDAN.refugeeSites = " + body + ";\n"
            "})();\n"
        )
    print("wrote", out, len(rec["sites"]), "site(s)")


if __name__ == "__main__":
    main()
