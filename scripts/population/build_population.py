"""Build data/layer_population.js from scripts/population/population.json.

    python3 -I scripts/population/build_population.py <soudan_dir>

Ecrit UNIQUEMENT <soudan_dir>/data/layer_population.js (window.SUDAN.population).
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def main():
    if len(sys.argv) != 2:
        sys.exit("usage: build_population.py <soudan_dir>")
    with open(os.path.join(HERE, "population.json"), encoding="utf-8") as f:
        rec = json.load(f)
    for k in ("national", "states", "states_source"):
        if k not in rec:
            sys.exit("build_population: champ manquant " + k)
    for name, s in rec["states"].items():
        if not isinstance(s.get("population"), int):
            sys.exit("build_population: population invalide pour " + name)
    out = os.path.join(sys.argv[1], "data", "layer_population.js")
    body = json.dumps(rec, ensure_ascii=False, indent=2)
    with open(out, "w", encoding="utf-8") as f:
        f.write(
            "/* ------------------------------------------------------------------\n"
            " * data/layer_population.js — POPULATION (national et par État), sourcée.\n"
            " * Généré par scripts/population/build_population.py — NE PAS éditer à la main.\n"
            " * ------------------------------------------------------------------ */\n"
            "(function () {\n"
            "  \"use strict\";\n"
            "  window.SUDAN = window.SUDAN || {};\n"
            "  window.SUDAN.population = " + body + ";\n"
            "})();\n"
        )
    print("wrote", out, len(rec["states"]), "states")


if __name__ == "__main__":
    main()
