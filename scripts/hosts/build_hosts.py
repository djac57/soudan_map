"""Build data/layer_hosts.js from scripts/hosts/hosts.json.

    python3 -I scripts/hosts/build_hosts.py <soudan_dir>
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def main():
    if len(sys.argv) != 2:
        sys.exit("usage: build_hosts.py <soudan_dir>")
    with open(os.path.join(HERE, "hosts.json"), encoding="utf-8") as f:
        rec = json.load(f)
    for r in rec["rows"]:
        for k in ("iso3", "name_fr", "name_en", "sudanese", "sudanese_date", "total_refugees", "total_date", "src"):
            if r.get(k) in (None, ""):
                sys.exit("build_hosts: %s: champ %s manquant" % (r.get("name_fr"), k))
    out = os.path.join(sys.argv[1], "data", "layer_hosts.js")
    body = json.dumps(rec, ensure_ascii=False, indent=2)
    with open(out, "w", encoding="utf-8") as f:
        f.write(
            "/* ------------------------------------------------------------------\n"
            " * data/layer_hosts.js — PAYS D'ACCUEIL (réfugiés soudanais) et données de base.\n"
            " * Généré par scripts/hosts/build_hosts.py — NE PAS éditer à la main.\n"
            " * ------------------------------------------------------------------ */\n"
            "(function () {\n"
            "  \"use strict\";\n"
            "  window.SUDAN = window.SUDAN || {};\n"
            "  window.SUDAN.hosts = " + body + ";\n"
            "})();\n"
        )
    print("wrote", out, len(rec["rows"]), "rows")


if __name__ == "__main__":
    main()
