#!/usr/bin/env python3
"""
Fetch the NASA FIRMS VIIRS SNPP *archive* (standard-processing source
VIIRS_SNPP_SP, available from 2012 to ~2 months ago) over Sudan and aggregate
it to a compact, TIME-AWARE fire layer: monthly totals + an annual 0.1-deg grid.

This complements fetch_firms.py (which only fetches the recent ~90-day NRT
window). Together they give the map a history of burning back to the start of
the war instead of a single 90-day snapshot.

Usage (key read from env, NEVER written into soudan/ deliverables):
    FIRMS_MAP_KEY=... python3 -I scripts/fetch_firms_archive.py <out_dir> <start> <end>
      <out_dir> : data/raw/firms
      <start>   : YYYY-MM-DD (e.g. 2023-04-01, war outbreak)
      <end>     : YYYY-MM-DD (<= SP max date; clamp to availability)

Writes <out_dir>/firms_sp_agg.json :
    {
      meta: {...},
      monthly: { "YYYY-MM": {all:int, north12:int, frp:float}, ... },
      grid: [ {lon,lat, y:{ "2023":n, ...}, total:int, frp:float, north12:bool}, ... ]
    }
where grid cells are 0.1-deg (~11 km). "north12" flags cells north of 12N,
i.e. OUTSIDE the main seasonal agricultural-burning belt of the far south.

Caveat (same as NRT): FIRMS detects heat, NOT its cause. Clouds suppress
detections. This is a physical proxy, never a conflict feed.
"""
import csv, io, json, os, sys, math, urllib.request, datetime

BBOX = "21.8,8.2,39.1,22.3"       # extended south to the South Sudan border band
SOURCE = "VIIRS_SNPP_SP"          # standard-processing archive
BASE = "https://firms.modaps.eosdis.nasa.gov/api/area/csv"
CHUNK = 5                         # area-CSV caps the VIIRS day range at 5
STEP = 0.10                       # ~11 km aggregation cells
NORTH12 = 12.0                    # latitude dividing the agri-burning south


def snap(v, step):
    return math.floor(v / step) * step


def fetch_window(key, days, start_date):
    url = f"{BASE}/{key}/{SOURCE}/{BBOX}/{days}/{start_date}"
    req = urllib.request.Request(url, headers={"User-Agent": "sudan-v0/1.0"})
    with urllib.request.urlopen(req, timeout=180) as r:
        return r.read().decode("utf-8", "replace")


def main(out_dir, start, end):
    key = os.environ.get("FIRMS_MAP_KEY")
    if not key:
        print("ERROR: FIRMS_MAP_KEY not set", file=sys.stderr)
        sys.exit(2)
    d0 = datetime.date.fromisoformat(start)
    d1 = datetime.date.fromisoformat(end)

    monthly = {}                   # ym -> {all, north12, frp}
    grid = {}                      # (cx,cy) -> {y:{yr:n}, total, frp}
    n_total = 0
    n_windows = n_fail = 0
    seen = set()

    d = d0
    while d <= d1:
        n_windows += 1
        try:
            text = fetch_window(key, CHUNK, d.isoformat())
        except Exception as e:
            n_fail += 1
            print(f"window {d} failed: {e}", file=sys.stderr)
            d += datetime.timedelta(days=CHUNK)
            continue
        rdr = csv.DictReader(io.StringIO(text))
        if not rdr.fieldnames or "latitude" not in rdr.fieldnames:
            n_fail += 1
            print(f"window {d}: unexpected head={text[:100]!r}", file=sys.stderr)
            d += datetime.timedelta(days=CHUNK)
            continue
        n_win = 0
        for row in rdr:
            try:
                lat = float(row["latitude"]); lon = float(row["longitude"])
            except (KeyError, ValueError):
                continue
            ad = row.get("acq_date") or ""
            if len(ad) < 7:
                continue
            kt = (round(lat, 4), round(lon, 4), ad, row.get("acq_time"))
            if kt in seen:
                continue
            seen.add(kt)
            try:
                frp = float(row.get("frp") or 0)
            except ValueError:
                frp = 0.0
            ym = ad[:7]; yr = ad[:4]
            north = lat >= NORTH12
            m = monthly.setdefault(ym, {"all": 0, "north12": 0, "frp": 0.0})
            m["all"] += 1
            m["frp"] += frp
            if north:
                m["north12"] += 1
            cx = round(snap(lon, STEP) + STEP / 2, 4)
            cy = round(snap(lat, STEP) + STEP / 2, 4)
            c = grid.setdefault((cx, cy), {"y": {}, "total": 0, "frp": 0.0, "north12": north})
            c["y"][yr] = c["y"].get(yr, 0) + 1
            c["total"] += 1
            c["frp"] += frp
            n_win += 1
            n_total += 1
        if n_windows % 20 == 0 or n_win:
            print(f"window {d}: +{n_win} (total {n_total}, cells {len(grid)})", file=sys.stderr)
        d += datetime.timedelta(days=CHUNK)

    grid_list = []
    for (cx, cy), c in grid.items():
        grid_list.append({"lon": cx, "lat": cy, "y": c["y"],
                          "total": c["total"], "frp": round(c["frp"], 1),
                          "north12": c["north12"]})
    grid_list.sort(key=lambda g: g["total"])

    out = {
        "meta": {"source": f"NASA FIRMS {SOURCE} (archive)", "bbox": BBOX,
                 "step_deg": STEP, "start": start, "end": end,
                 "n_detections": n_total, "n_cells": len(grid_list),
                 "n_windows": n_windows, "n_failed_windows": n_fail,
                 "north12_rule": "cells with centroid lat >= 12N (outside the "
                                 "far-south seasonal agricultural-burning belt)",
                 "note": "Active-fire archive; heat only, cause NOT attributed."},
        "monthly": {k: {"all": v["all"], "north12": v["north12"], "frp": round(v["frp"], 1)}
                    for k, v in sorted(monthly.items())},
        "grid": grid_list,
    }
    os.makedirs(out_dir, exist_ok=True)
    outp = os.path.join(out_dir, "firms_sp_agg.json")
    with open(outp, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False)
    print(json.dumps({"n_detections": n_total, "n_cells": len(grid_list),
                      "n_windows": n_windows, "n_failed": n_fail,
                      "months": len(monthly), "out": outp}, ensure_ascii=False))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3])
