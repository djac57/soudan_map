"""Build data/layer_places.js from scripts/places/places.json (English place-name overlay).

    python3 -I scripts/places/build_places.py <soudan_dir>
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))

def main():
    if len(sys.argv) != 2:
        sys.exit("usage: build_places.py <soudan_dir>")
    rec = json.load(open(os.path.join(HERE, "places.json"), encoding="utf-8"))
    for group in ("countries", "sudan", "other"):
        for p in rec[group]:
            for k in ("name", "kind", "lat", "lon"):
                if p.get(k) in (None, ""):
                    sys.exit("build_places: %s: champ %s manquant" % (p.get("name"), k))
    out = os.path.join(sys.argv[1], "data", "layer_places.js")
    body = json.dumps(rec, ensure_ascii=False, indent=2)
    with open(out, "w", encoding="utf-8") as f:
        f.write("/* Noms de lieux en anglais (superposition). Généré par scripts/places/build_places.py */\n"
                "(function () { \"use strict\"; window.SUDAN = window.SUDAN || {}; window.SUDAN.places = " + body + "; })();\n")
    print("wrote", out)

if __name__ == "__main__":
    main()
