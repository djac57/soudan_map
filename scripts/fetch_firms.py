#!/usr/bin/env python3
"""
Fetch NASA FIRMS VIIRS active-fire points over Sudan and freeze to local GeoJSON.

Usage (key read from env, NEVER written into the soudan/ deliverables):
    FIRMS_MAP_KEY=... python3 -I scripts/fetch_firms.py <out_dir> <days> [out_name]

FIRMS area CSV API allows <=10 days per call; we loop in 10-day chunks.
Sudan bbox (lon_min,lat_min,lon_max,lat_max) = 21.8,8.6,39.1,22.2
Caveat (documented on the page): FIRMS detects heat/fire, NOT its cause.
Clouds suppress detections. This is a physical proxy, not a conflict feed.
"""
import csv, io, json, os, sys, urllib.request, datetime

BBOX = "21.8,8.6,39.1,22.2"
SOURCE = "VIIRS_SNPP_NRT"
BASE = "https://firms.modaps.eosdis.nasa.gov/api/area/csv"
CHUNK = 5  # VIIRS_SNPP_NRT area-CSV caps the day range at 5 (API rejects >5)


def fetch_window(key, days, start_date):
    url = f"{BASE}/{key}/{SOURCE}/{BBOX}/{days}/{start_date}"
    req = urllib.request.Request(url, headers={"User-Agent": "sudan-v0/1.0"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read().decode("utf-8", "replace")


def main(out_dir, total_days, out_name="firms_fires.geojson"):
    key = os.environ.get("FIRMS_MAP_KEY")
    if not key:
        print("ERROR: FIRMS_MAP_KEY not set", file=sys.stderr)
        sys.exit(2)
    total_days = int(total_days)
    feats = []
    seen = set()
    got_any = False
    today = datetime.date.today()
    start = today - datetime.timedelta(days=total_days)
    windows = []
    d = start
    while d <= today:
        windows.append(d.isoformat())
        d += datetime.timedelta(days=CHUNK)
    for ws in windows:
        try:
            text = fetch_window(key, CHUNK, ws)
        except Exception as e:
            print(f"window {ws} failed: {e}", file=sys.stderr)
            continue
        rdr = csv.DictReader(io.StringIO(text))
        if not rdr.fieldnames or "latitude" not in rdr.fieldnames:
            print(f"window {ws}: unexpected response head={text[:120]!r}", file=sys.stderr)
            continue
        got_any = True
        n_win = 0
        for row in rdr:
            try:
                lat = float(row["latitude"]); lon = float(row["longitude"])
            except (KeyError, ValueError):
                continue
            key_t = (round(lat, 4), round(lon, 4), row.get("acq_date"), row.get("acq_time"))
            if key_t in seen:
                continue
            seen.add(key_t)
            n_win += 1
            feats.append({
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [round(lon, 4), round(lat, 4)]},
                "properties": {
                    "date": row.get("acq_date"),
                    "conf": row.get("confidence"),   # l/n/h or numeric
                    "frp": row.get("frp"),           # fire radiative power
                    "dn": row.get("daynight"),
                },
            })
        print(f"window {ws}: +{n_win} (total {len(feats)})", file=sys.stderr)
    if not got_any:
        print("ERROR: no FIRMS data retrieved", file=sys.stderr)
        sys.exit(3)
    dates = [f["properties"]["date"] for f in feats if f["properties"]["date"]]
    fc = {"type": "FeatureCollection",
          "meta": {"source": f"NASA FIRMS {SOURCE}", "bbox": BBOX,
                   "days": total_days, "n": len(feats),
                   "date_min": min(dates) if dates else None,
                   "date_max": max(dates) if dates else None,
                   "note": "Active-fire detections; heat signal only, cause NOT attributed. "
                           "Clouds suppress detections."},
          "features": feats}
    with open(os.path.join(out_dir, out_name), "w", encoding="utf-8") as f:
        json.dump(fc, f, ensure_ascii=False)
    print(json.dumps({"n": len(feats), "date_min": fc["meta"]["date_min"],
                      "date_max": fc["meta"]["date_max"], "out": out_name}, ensure_ascii=False))


if __name__ == "__main__":
    out_name = sys.argv[3] if len(sys.argv) > 3 else "firms_fires.geojson"
    main(sys.argv[1], sys.argv[2], out_name)
