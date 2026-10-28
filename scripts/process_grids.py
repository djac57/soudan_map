#!/usr/bin/env python3
"""
Build light aggregated layers for the Sudan v0 map from the frozen raw data:
  1. firms_grid.geojson   : 0.05 deg (~5.5 km) fire-detection DENSITY grid
                            (VIIRS is dominated by seasonal agricultural burning
                             in the south; density + caveat avoids fake precision)
  2. activity_grid.geojson: 0.10 deg (~11 km) CLASH-EVENT density grid
                            -> honest "active front" proxy (Palier 3)

Usage:
    python3 -I scripts/process_grids.py <data_dir> [firms_raw_name]
Reads  <data_dir>/raw/firms/<firms_raw_name> (default firms_raw_90d.geojson) and
       <data_dir>/events_clashes.geojson
Writes <data_dir>/firms_grid.geojson and <data_dir>/activity_grid.geojson
"""
import json, os, sys, math


def snap(v, step):
    return math.floor(v / step) * step


def grid(features, step, value_key=None):
    cells = {}
    for f in features:
        lon, lat = f["geometry"]["coordinates"][:2]
        cx = round(snap(lon, step) + step / 2, 5)
        cy = round(snap(lat, step) + step / 2, 5)
        k = (cx, cy)
        c = cells.setdefault(k, {"n": 0, "w": 0.0, "dmax": ""})
        c["n"] += 1
        if value_key:
            try:
                c["w"] += float(f["properties"].get(value_key) or 0)
            except (TypeError, ValueError):
                pass
        d = f["properties"].get("date") or ""
        if d > c["dmax"]:
            c["dmax"] = d
    feats = []
    for (cx, cy), c in cells.items():
        feats.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [cx, cy]},
            "properties": {"n": c["n"], "w": round(c["w"], 1), "dmax": c["dmax"]},
        })
    feats.sort(key=lambda f: f["properties"]["n"])
    return feats


def main(data_dir, firms_raw_name="firms_raw_90d.geojson"):
    # FIRMS density grid (0.05 deg).
    # ROBUSTESSE daily : le FIRMS NRT est fetché sous continue-on-error ; si le
    # brut manque (échec transitoire, cache vide), on GARDE le firms_grid.geojson
    # COMMITTÉ au lieu de planter le rebuild (ancien bug : FileNotFoundError ->
    # exit 1 de l'étape « Rebuild cœur »). Le weekly (brut présent) regénère.
    firms_raw = os.path.join(data_dir, "raw", "firms", firms_raw_name)
    n_fcells = n_fdet = None
    if os.path.exists(firms_raw):
        with open(firms_raw, encoding="utf-8") as f:
            fr = json.load(f)
        fcells = grid(fr["features"], 0.05, value_key="frp")
        fg = {"type": "FeatureCollection",
              "meta": {"source": fr["meta"]["source"], "step_deg": 0.05,
                       "window_days": fr["meta"].get("days"),
                       "date_min": fr["meta"].get("date_min"),
                       "date_max": fr["meta"].get("date_max"),
                       "n_detections": len(fr["features"]), "n_cells": len(fcells),
                       "note": "Fire-detection density, ~5.5km cells. Dominated by seasonal "
                               "AGRICULTURAL burning (95% south of 12N); heat only, cause NOT "
                               "attributed. Not a conflict feed."},
              "features": fcells}
        with open(os.path.join(data_dir, "firms_grid.geojson"), "w", encoding="utf-8") as f:
            json.dump(fg, f, ensure_ascii=False)
        n_fcells, n_fdet = len(fcells), len(fr["features"])
    else:
        print("warn: %s absent -> firms_grid.geojson COMMITTÉ conservé" % firms_raw,
              file=sys.stderr)

    # Clash-event activity grid (0.10 deg). Entrée = events_clashes.geojson
    # (écrit par process_ucdp). Absent -> on garde l'activity_grid COMMITTÉ.
    ev_path = os.path.join(data_dir, "events_clashes.geojson")
    n_acells = n_aev = None
    if os.path.exists(ev_path):
        with open(ev_path, encoding="utf-8") as f:
            ev = json.load(f)
        acells = grid(ev["features"], 0.10, value_key="best")
        ag = {"type": "FeatureCollection",
              "meta": {"source": "UCDP GED clashes", "step_deg": 0.10,
                       "window_start": ev["meta"].get("window_start"),
                       "date_max": ev["meta"].get("date_max"),
                       "n_events": len(ev["features"]), "n_cells": len(acells),
                       "note": "Armed-clash density (count per ~11km cell, w=sum best deaths). "
                               "Proxy for active front; not a control line."},
              "features": acells}
        with open(os.path.join(data_dir, "activity_grid.geojson"), "w", encoding="utf-8") as f:
            json.dump(ag, f, ensure_ascii=False)
        n_acells, n_aev = len(acells), len(ev["features"])
    else:
        print("warn: %s absent -> activity_grid.geojson COMMITTÉ conservé" % ev_path,
              file=sys.stderr)

    print(json.dumps({"firms_cells": n_fcells, "firms_detections": n_fdet,
                      "activity_cells": n_acells, "activity_events": n_aev},
                     ensure_ascii=False))


if __name__ == "__main__":
    main(*sys.argv[1:3])
