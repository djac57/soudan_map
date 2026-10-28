#!/usr/bin/env python3
"""
Build the enriched window.SUDAN contract object (data/sudan_core.json) consumed
by the architect UI. ADDITIVE: the legacy window.SD_* layers stay untouched;
this produces the single normalized object described in data/SCHEMA.md.

Run isolated (downloaded data is untrusted), paths passed as arguments:
    python3 -I scripts/build_sudan.py <soudan_dir> <out_json>

Reads:
  <soudan_dir>/data/raw/ucdp/ (stable GED + monthly Candidate CSVs)
  <soudan_dir>/data/raw/firms/firms_raw_90d.geojson  (90-day VIIRS fetch)
  <soudan_dir>/data/boundaries/sudan_adm1.geojson    (ADM1 name -> ISO)

Darfur / ethics guardrail (same as process_ucdp.py):
  - type_of_violence 1 (state-based) + 2 (non-state) armed CLASHES -> geolocated
    points in `events`.
  - type_of_violence 3 (one-sided violence against CIVILIANS) is NEVER a point;
    it is aggregated to ADM1 only, in `states[].civ_violence` / `civ_deaths`.
"""
import csv, json, sys, os, glob, io, zipfile, math, datetime

csv.field_size_limit(10_000_000)

WINDOW_START = "2023-04-15"      # RSF-SAF war outbreak -> full war covered
SUDAN_ID = "625"
BBOX = [21.8, 8.2, 39.1, 22.3]   # lon_min, lat_min, lon_max, lat_max (extended S
                                 # to the South Sudan border band where fires peak)
FIRMS_STEP = 0.05                # ~5.5 km density cells
NEAR_DAYS = 60                   # "fire near a recent clash" lookback
NEAR_KM = 15.0                   # distance threshold


# ---------- UCDP loading (self-contained; -I removes scripts/ from sys.path) ----

def _iter_handles(raw_dir):
    stable_csv = os.path.join(raw_dir, "GEDEvent_v25_1.csv")
    stable_zip = os.path.join(raw_dir, "ged251-csv.zip")
    if os.path.exists(stable_csv):
        with open(stable_csv, newline="", encoding="utf-8", errors="replace") as f:
            yield f
    elif os.path.exists(stable_zip):
        with zipfile.ZipFile(stable_zip) as z:
            name = next(n for n in z.namelist() if n.lower().endswith(".csv"))
            with z.open(name) as raw:
                yield io.TextIOWrapper(raw, encoding="utf-8", errors="replace", newline="")
    for path in sorted(glob.glob(os.path.join(raw_dir, "candidate", "GEDEvent_*.csv"))):
        with open(path, newline="", encoding="utf-8", errors="replace") as f:
            yield f


def load_rows(raw_dir):
    seen = {}
    for f in _iter_handles(raw_dir):
        for row in csv.DictReader(f):
            if (row.get("country_id") or "") != SUDAN_ID:
                continue
            ds = (row.get("date_start") or "")[:10]
            if not ds or ds < WINDOW_START:
                continue
            seen[row.get("id")] = row   # candidate supersedes stable on same id
    return list(seen.values())


def to_float(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def norm_state(name):
    s = (name or "").replace(" state", "").strip()
    return s or "Unknown"


def pair_label(side_a, side_b, tov):
    a = (side_a or "").strip()
    b = (side_b or "").strip()
    def tag(s):
        l = s.lower()
        if "government of sudan" in l:
            return "SAF"
        if "rapid support" in l or l == "rsf" or "rsf" in l:
            return "RSF"
        if "civilian" in l:
            return "Civilians"
        return s or "?"
    ta, tb = tag(a), tag(b)
    if tov == "3":
        return f"{ta} -> civilians"
    return f"{ta} vs {tb}"


def haversine_km(lon1, lat1, lon2, lat2):
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def snap(v, step):
    return math.floor(v / step) * step


def main(soudan_dir, out_json):
    data_dir = os.path.join(soudan_dir, "data")
    raw_ucdp = os.path.join(data_dir, "raw", "ucdp")
    today = datetime.date.today()

    # ----- ADM1 name -> ISO map from boundaries -----
    adm1_iso = {}
    try:
        b = json.load(open(os.path.join(data_dir, "boundaries", "sudan_adm1.geojson"), encoding="utf-8"))
        for feat in b["features"]:
            p = feat["properties"]
            nm = (p.get("shapeName") or "").lower()
            iso = p.get("shapeISO")
            if iso and iso != "N/A":
                adm1_iso[nm] = iso
    except Exception as e:
        print("warn: adm1 iso map failed:", e, file=sys.stderr)
    aliases = {"gedarif": "gedaref"}   # UCDP spelling -> boundary spelling

    def iso_for(state_name):
        key = state_name.lower()
        key = aliases.get(key, key)
        return adm1_iso.get(key)

    # ----- UCDP: events (type 1/2 points) + states + timeline -----
    rows = load_rows(raw_ucdp)
    events = []
    states = {}       # name -> dict
    months = {}       # ym -> {events,deaths,civ_events,civ_deaths}
    dmin = dmax = None
    for row in rows:
        tov = row.get("type_of_violence")
        ds = (row.get("date_start") or "")[:10]
        if not ds:
            continue
        if dmin is None or ds < dmin: dmin = ds
        if dmax is None or ds > dmax: dmax = ds
        ym = ds[:7]
        best = int(to_float(row.get("best")) or 0)
        state = norm_state(row.get("adm_1"))
        st = states.setdefault(state, {"events": 0, "deaths": 0, "civ_violence": 0, "civ_deaths": 0})
        m = months.setdefault(ym, {"events": 0, "deaths": 0, "civ_events": 0, "civ_deaths": 0})
        if tov == "3":
            # GUARDRAIL: civilian-targeted -> state aggregate only, NO coordinates
            st["civ_violence"] += 1
            st["civ_deaths"] += best
            m["civ_events"] += 1
            m["civ_deaths"] += best
            continue
        st["events"] += 1
        st["deaths"] += best
        m["events"] += 1
        m["deaths"] += best
        lat = to_float(row.get("latitude"))
        lon = to_float(row.get("longitude"))
        if lat is None or lon is None:
            continue
        events.append({
            "lon": round(lon, 4), "lat": round(lat, 4), "date": ds,
            "pair": pair_label(row.get("side_a"), row.get("side_b"), tov),
            "deaths": best, "type": int(tov) if tov and tov.isdigit() else None,
            "state": state,
            "source": "ucdp",   # forward-compat: ACLED events (if key added) -> "acled"
        })
    events.sort(key=lambda e: e["date"])

    states_list = []
    for name, d in sorted(states.items(), key=lambda kv: -(kv[1]["events"] + kv[1]["civ_violence"])):
        states_list.append({
            "name": name, "adm1_id": iso_for(name),
            "events": d["events"], "deaths": d["deaths"],
            "civ_violence": d["civ_violence"], "civ_deaths": d["civ_deaths"],
        })

    timeline = [{"month": ym, "events": v["events"], "deaths": v["deaths"],
                 "civ_events": v["civ_events"], "civ_deaths": v["civ_deaths"]}
                for ym, v in sorted(months.items())]

    # ----- FIRMS 90d -> density grid (0.05 deg) with near-conflict flag -----
    firms_meta = {}
    fires_density = []
    firms_path = os.path.join(data_dir, "raw", "firms", "firms_raw_90d.geojson")
    recent_events = []
    cutoff = (today - datetime.timedelta(days=NEAR_DAYS)).isoformat()
    for e in events:
        if e["date"] >= cutoff:
            recent_events.append((e["lon"], e["lat"]))
    try:
        fr = json.load(open(firms_path, encoding="utf-8"))
        firms_meta = fr.get("meta", {})
        cells = {}
        for f in fr["features"]:
            lon, lat = f["geometry"]["coordinates"][:2]
            cx = round(snap(lon, FIRMS_STEP) + FIRMS_STEP / 2, 5)
            cy = round(snap(lat, FIRMS_STEP) + FIRMS_STEP / 2, 5)
            cells[(cx, cy)] = cells.get((cx, cy), 0) + 1
        for (cx, cy), n in cells.items():
            near = False
            for (elon, elat) in recent_events:
                if abs(elon - cx) <= 0.2 and abs(elat - cy) <= 0.2:
                    if haversine_km(cx, cy, elon, elat) <= NEAR_KM:
                        near = True
                        break
            fires_density.append({"lon": cx, "lat": cy, "weight": n, "near": near})
        fires_density.sort(key=lambda c: c["weight"])
    except FileNotFoundError:
        print("warn: firms_raw_90d.geojson not found; fires_density empty", file=sys.stderr)

    n_near = sum(1 for c in fires_density if c["near"])

    # ----- conflict-fire subset: EXPLICIT, named layer kept apart from the
    #       seasonal agricultural burning that dominates the far south. A cell
    #       qualifies only if it is within NEAR_KM of a clash in the last
    #       NEAR_DAYS (same test as `near`). This is the UI's "fires near recent
    #       fighting" layer; `fires_density` alone is NOT a conflict signal. -----
    fires_conflict_recent = [
        {"lon": c["lon"], "lat": c["lat"], "weight": c["weight"]}
        for c in fires_density if c["near"]
    ]
    fires_conflict_recent.sort(key=lambda c: c["weight"])

    # ----- TIME-AWARE fire history (FIRMS VIIRS_SNPP_SP archive, aggregated by
    #       scripts/fetch_firms_archive.py) + recent NRT months appended -----
    MIN_HIST = 2                 # drop single-detection cells (archive noise)
    fires_history = []
    fires_timeline = []
    firms_hist_meta = {}
    sp_path = os.path.join(data_dir, "raw", "firms", "firms_sp_agg.json")
    monthly = {}                 # ym -> {all, north12, frp}
    try:
        sp = json.load(open(sp_path, encoding="utf-8"))
        firms_hist_meta = sp.get("meta", {})
        for g in sp.get("grid", []):
            if g.get("total", 0) < MIN_HIST:
                continue
            fires_history.append({"lon": g["lon"], "lat": g["lat"],
                                  "y": g.get("y", {}), "total": g["total"],
                                  "north": bool(g.get("north12"))})
        fires_history.sort(key=lambda g: g["total"])
        for ym, v in sp.get("monthly", {}).items():
            monthly[ym] = {"all": v.get("all", 0), "north": v.get("north12", 0)}
    except FileNotFoundError:
        print("warn: firms_sp_agg.json not found; fires_history empty "
              "(run scripts/fetch_firms_archive.py)", file=sys.stderr)
    # append recent NRT months (period after the SP archive's end) from the 90d raw
    try:
        fr90 = json.load(open(firms_path, encoding="utf-8"))
        sp_end = firms_hist_meta.get("end", "")
        sp_end_ym = sp_end[:7] if sp_end else "9999-99"
        nrt_m = {}
        for f in fr90["features"]:
            ad = (f["properties"].get("date") or "")
            if len(ad) < 7 or ad[:7] <= sp_end_ym:
                continue   # already covered by the archive
            lat = f["geometry"]["coordinates"][1]
            ym = ad[:7]
            d = nrt_m.setdefault(ym, {"all": 0, "north": 0})
            d["all"] += 1
            if lat >= 12.0:
                d["north"] += 1
        for ym, d in nrt_m.items():
            monthly[ym] = d
    except Exception as e:
        print("warn: NRT monthly append failed:", e, file=sys.stderr)
    fires_timeline = [{"month": ym, "all": v["all"], "north": v["north"]}
                      for ym, v in sorted(monthly.items())]

    # ----- focus sectors (bbox = west, south, east, north) -----
    focus = [
        {"key": "kordofan", "label": "Kordofan - axe El-Obeid / Bara",
         "bbox": [29.4, 12.4, 31.4, 14.4],
         "note": "Verrou logistique SAF<->RSF sur la route d'El-Obeid vers Khartoum; "
                 "combats recurrents autour de Bara et El-Obeid (Nord-Kordofan)."},
        {"key": "el_fasher", "label": "El-Fasher (Darfour Nord)",
         "bbox": [24.6, 12.9, 26.1, 14.3],
         "note": "Derniere grande ville du Darfour longtemps tenue par la SAF, prise par "
                 "la RSF fin 2025; siege prolonge, violences anti-civils agregees a l'ETAT "
                 "(jamais en points - voir garde-fou Darfour)."},
    ]

    # ----- meta + sources -----
    build_date = today.isoformat()
    meta = {
        "generated": build_date,
        "updated_through": dmax,
        "bbox": BBOX,
        "fires_days": firms_meta.get("days"),
        "fires_window": [firms_meta.get("date_min"), firms_meta.get("date_max")],
        "fires_history_window": [firms_hist_meta.get("start"), firms_hist_meta.get("end")],
        "counts": {
            "events": len(events), "states": len(states_list),
            "fires_cells": len(fires_density), "fires_near_conflict_cells": n_near,
            "fires_conflict_recent_cells": len(fires_conflict_recent),
            "fires_detections": firms_meta.get("n"),
            "fires_history_cells": len(fires_history),
            "fires_history_detections": firms_hist_meta.get("n_detections"),
            "fires_timeline_months": len(fires_timeline),
            "timeline_months": len(timeline),
        },
        "guardrail": "UCDP type_of_violence 3 (civilian-targeted) excluded from `events` "
                     "points; aggregated only in states[].civ_violence / civ_deaths.",
        "fires_note": "fires_density/fires_history are a HEAT proxy dominated by seasonal "
                      "agricultural burning (mostly south of 12N, see `north` flag); only "
                      "fires_conflict_recent (within 15 km of a clash in the last 60 days) "
                      "is a tentative conflict-fire hint, never proof.",
        "sources": [
            {"name": "UCDP GED v25.1 (stable) + Candidate v25/v26 (monthly)",
             "license": "CC BY 4.0",
             "url": "https://ucdp.uu.se/downloads/", "date": dmax},
            {"name": "NASA FIRMS VIIRS SNPP NRT + SP archive (active fire)",
             "license": "Public domain (NASA EOSDIS/LANCE; attribution requested)",
             "url": "https://firms.modaps.eosdis.nasa.gov/", "date": firms_meta.get("date_max")},
            {"name": "geoBoundaries ADM0/ADM1 (Sudan) + ADM0 neighbours (context)",
             "license": "CC BY 4.0 (Open)",
             "url": "https://www.geoboundaries.org/", "date": "2023"},
        ],
    }

    sudan = {
        "meta": meta,
        "events": events,
        "states": states_list,
        "fires_density": fires_density,
        "fires_conflict_recent": fires_conflict_recent,
        "fires_history": fires_history,
        "fires_timeline": fires_timeline,
        "timeline": timeline,
        "focus": focus,
        "boundaries_url": "data/boundaries/sudan_adm1.geojson",
        "boundaries": {"adm0": "data/boundaries/sudan_adm0.geojson",
                       "adm1": "data/boundaries/sudan_adm1.geojson",
                       "neighbors": "data/boundaries/sudan_neighbors.geojson"},
        "control": None,   # see SCHEMA.md: honest "no fabricated control line" default
    }

    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(sudan, f, ensure_ascii=False, separators=(",", ":"))

    print(json.dumps({
        "events": len(events), "events_date_min": dmin, "events_date_max": dmax,
        "states": len(states_list), "timeline_months": len(timeline),
        "fires_cells": len(fires_density), "fires_near_conflict": n_near,
        "fires_conflict_recent_cells": len(fires_conflict_recent),
        "fires_history_cells": len(fires_history),
        "fires_history_detections": firms_hist_meta.get("n_detections"),
        "fires_timeline_months": len(fires_timeline),
        "fires_history_window": [firms_hist_meta.get("start"), firms_hist_meta.get("end")],
        "fires_days": firms_meta.get("days"), "fires_detections": firms_meta.get("n"),
        "fires_window": [firms_meta.get("date_min"), firms_meta.get("date_max")],
        "out": out_json,
    }, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
