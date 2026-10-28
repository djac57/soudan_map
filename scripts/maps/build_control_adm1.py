#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_control_adm1.py — build an *approximate*, state-level SAF/RSF control sketch.

HONESTY MODEL (read this before trusting the output)
----------------------------------------------------
This script does NOT draw or trace any front line. It reuses the REAL, official
geoBoundaries ADM1 (state) polygons that already ship with the project and simply
attaches a `control` label to each state, read off from cross-referenced, dated,
public reporting (see SOURCES below). So:
  * No geometry is invented — every boundary is a genuine administrative border.
  * The only added information is one coarse label per state (SAF / RSF /
    contested / other), tagged `approx: true` and dated.
  * This is a COARSE, STATE-LEVEL reading. Real front lines cut ACROSS states
    (e.g. El Fasher city sits inside RSF-held North Darfur; Kordofan and Blue
    Nile are split). Besieged cities and pockets are NOT representable here.
A state-level choropleth of reported control is defensible; a freehand polygon
front line would be fabricated, so it is deliberately not attempted.

Usage:
  python3 -I build_control_adm1.py <in_adm1.geojson> <out_control.geojson>

The input path is passed as an argument (never imported / executed). Output is a
GeoJSON FeatureCollection with slim properties, each polygon tagged
{actor, date, source, approx:true}.
"""
import json
import sys

SNAPSHOT_DATE = "2026-10-28"

# Short source string embedded in every feature. Full reference list + licenses
# live in data/layer_maps.js (window.SUDAN.known_maps.references).
SOURCE = ("approximatif, lecture au niveau de l'Etat recoupee de sources publiques "
          "datees (carte Wikipedia 'War in Sudan (2023)' CC BY-SA 4.0, "
          "Al Jazeera, Sudans Post, EUAA/PolGeoNow) - a valider")

# Control label per geoBoundaries ADM1 ISO code, snapshot 2026-10-27.
# RSF holds all of Darfur (El Fasher fell 2025-10-26) + West Kordofan
# (Babanusa fell Dec 2025). SAF holds the centre/north/east (Khartoum retaken
# Mar 2025, Gezira/Sennar retaken early 2025). North/South Kordofan and Blue
# Nile are genuinely split -> contested. Abyei PCA is a Sudan/South Sudan
# disputed area, not an SAF/RSF front -> other.
CONTROL = {
    "SD-NO": "SAF",        # Northern
    "SD-NR": "SAF",        # River Nile
    "SD-RS": "SAF",        # Red Sea (Port Sudan, de facto seat of government)
    "SD-KA": "SAF",        # Kassala
    "SD-GD": "SAF",        # Gedaref
    "SD-KH": "SAF",        # Khartoum (retaken Mar 2025)
    "SD-GZ": "SAF",        # Gezira (retaken early 2025)
    "SD-SI": "SAF",        # Sennar (retaken late 2024/early 2025)
    "SD-NW": "SAF",        # White Nile (largely SAF; southern frontier active)
    "SD-DN": "RSF",        # North Darfur (El Fasher fell 2025-10-26)
    "SD-DW": "RSF",        # West Darfur
    "SD-DC": "RSF",        # Central Darfur
    "SD-DS": "RSF",        # South Darfur (Nyala, RSF Darfur hub)
    "SD-DE": "RSF",        # East Darfur
    "SD-GK": "RSF",        # West Kordofan (Babanusa fell Dec 2025; Heglig SAF pocket)
    "SD-KN": "contested",  # North Kordofan (El-Obeid SAF-besieged; Bara changed hands)
    "SD-KS": "contested",  # South Kordofan (SAF / RSF / SPLM-N mix)
    "SD-NB": "contested",  # Blue Nile (Ta'sis/SPLM-N active SW/SE; Damazin SAF)
}
# geoBoundaries also carries "Abyei PCA" (shapeISO "N/A") -> other/disputed.


def main(argv):
    if len(argv) != 3:
        sys.stderr.write("usage: build_control_adm1.py <in_adm1.geojson> <out.geojson>\n")
        return 2
    in_path, out_path = argv[1], argv[2]
    with open(in_path, "r", encoding="utf-8") as fh:
        src = json.load(fh)

    out_feats = []
    seen = set()
    for feat in src.get("features", []):
        pr = feat.get("properties", {})
        iso = pr.get("shapeISO")
        name = pr.get("shapeName", "?")
        if pr.get("shapeName") == "Abyei PCA" or iso in (None, "N/A"):
            actor = "other"
        else:
            actor = CONTROL.get(iso)
            if actor is None:
                sys.stderr.write("WARN: no control mapping for %s (%s)\n" % (iso, name))
                actor = "contested"
        seen.add(iso)
        out_feats.append({
            "type": "Feature",
            "properties": {
                "name": name,
                "adm1_id": iso if iso not in (None, "N/A") else None,
                "actor": actor,
                "date": SNAPSHOT_DATE,
                "source": SOURCE,
                "approx": True,
            },
            "geometry": feat["geometry"],
        })

    missing = set(CONTROL) - seen
    if missing:
        sys.stderr.write("WARN: ISO codes in table but not in input: %s\n" % sorted(missing))

    fc = {
        "type": "FeatureCollection",
        "name": "sudan_control_adm1_approx",
        "_meta": {
            "title": "Approximate state-level SAF/RSF control, snapshot " + SNAPSHOT_DATE,
            "approx": True,
            "disclaimer": ("Esquisse APPROXIMATIVE au niveau de l'Etat. Geometrie = "
                           "frontieres administratives reelles (geoBoundaries, CC BY). "
                           "Le controle ne suit PAS les limites d'Etat : lignes de front, "
                           "villes assiegees et poches ne sont pas representees. "
                           "A valider contre une carte sourcee."),
            "source": SOURCE,
        },
        "features": out_feats,
    }
    with open(out_path, "w", encoding="utf-8") as fh:
        json.dump(fc, fh, ensure_ascii=False)
    counts = {}
    for f in out_feats:
        a = f["properties"]["actor"]
        counts[a] = counts.get(a, 0) + 1
    sys.stderr.write("wrote %d features -> %s  %s\n" % (len(out_feats), out_path, counts))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
