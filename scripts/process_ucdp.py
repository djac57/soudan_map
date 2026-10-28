#!/usr/bin/env python3
"""
Process UCDP GED (stable 25.1) + monthly Candidate files into frozen local
GeoJSON/JSON for the Sudan v0 map.

Run isolated (data is untrusted), paths passed as arguments:
    python3 -I scripts/process_ucdp.py <ucdp_raw_dir> <out_dir>

Darfur / ethics guardrail applied here:
  - Armed CLASHES (UCDP type_of_violence 1 state-based + 2 non-state) are kept
    as geolocated points -> the "front" signal, aggregated conflict events.
  - One-sided violence against CIVILIANS (type 3) is NEVER exported as precise
    points. It is aggregated to admin1 (state) counts only, so the map can show
    its scale without fine-grained localisation of atrocities / IDP camps.
Country id 625 = Sudan. Window kept: date_start >= WINDOW_START.
"""
import csv, json, sys, os, glob, io, zipfile

csv.field_size_limit(10_000_000)

WINDOW_START = "2023-04-15"   # RSF-SAF war outbreak (full war covered)
SUDAN_ID = "625"


def classify(side_a, side_b, tov):
    a = (side_a or "").lower()
    b = (side_b or "").lower()
    def is_saf(s): return "government of sudan" in s
    def is_rsf(s): return "rapid support" in s or "rsf" in s
    def is_civ(s): return "civilian" in s
    saf = is_saf(a) or is_saf(b)
    rsf = is_rsf(a) or is_rsf(b)
    civ = is_civ(a) or is_civ(b)
    if tov == "3":
        # one-sided against civilians: label by perpetrator side_a
        if is_saf(a): return "civ_by_saf"
        if is_rsf(a): return "civ_by_rsf"
        return "civ_by_other"
    if saf and rsf:
        return "saf_vs_rsf"
    if saf and not rsf:
        return "saf_vs_other"
    if rsf and not saf:
        return "rsf_vs_other"
    return "nonstate_other"


def _iter_handles(raw_dir):
    """Yield open text handles for the stable GED (from CSV or its zip) then
    each monthly Candidate CSV."""
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
            seen[row.get("id")] = row  # candidate supersedes stable on same id
    return list(seen.values())


def to_float(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def main(raw_dir, out_dir):
    rows = load_rows(raw_dir)
    clash_feats = []
    civ_by_state = {}           # adm1 -> {count, best}
    cat_counts = {}
    months = {}
    total_best_clash = 0
    dmin = dmax = None
    for row in rows:
        tov = row.get("type_of_violence")
        ds = (row.get("date_start") or "")[:10]
        if dmin is None or ds < dmin: dmin = ds
        if dmax is None or ds > dmax: dmax = ds
        cat = classify(row.get("side_a"), row.get("side_b"), tov)
        cat_counts[cat] = cat_counts.get(cat, 0) + 1
        best = int(to_float(row.get("best")) or 0)
        adm1 = (row.get("adm_1") or "Unknown").replace(" state", "").strip() or "Unknown"
        if tov == "3":
            # GUARDRAIL: civilian-targeted -> aggregate to state, NO coordinates
            d = civ_by_state.setdefault(adm1, {"events": 0, "best": 0})
            d["events"] += 1
            d["best"] += best
            continue
        lat = to_float(row.get("latitude"))
        lon = to_float(row.get("longitude"))
        if lat is None or lon is None:
            continue
        total_best_clash += best
        ym = ds[:7]
        months[ym] = months.get(ym, 0) + 1
        clash_feats.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [round(lon, 4), round(lat, 4)]},
            "properties": {
                "date": ds,
                "cat": cat,
                "a": row.get("side_a"),
                "b": row.get("side_b"),
                "best": best,
                "adm1": adm1,
                "adm2": (row.get("adm_2") or "").replace(" district", "").strip(),
                "place": row.get("where_coordinates") or "",
                "wprec": row.get("where_prec"),
                "nsrc": row.get("number_of_sources"),
                "clarity": row.get("event_clarity"),
            },
        })
    clash_feats.sort(key=lambda f: f["properties"]["date"])
    fc = {"type": "FeatureCollection",
          "meta": {"source": "UCDP GED v25.1 (stable) + Candidate v25/v26 (monthly)",
                   "note": "Armed clashes only (state-based + non-state). Civilian-targeted "
                           "one-sided violence excluded from points by design (see README).",
                   "country_id": 625, "window_start": WINDOW_START,
                   "date_min": dmin, "date_max": dmax,
                   "n_clash_points": len(clash_feats)},
          "features": clash_feats}
    with open(os.path.join(out_dir, "events_clashes.geojson"), "w", encoding="utf-8") as f:
        json.dump(fc, f, ensure_ascii=False)

    civ_list = [{"state": k, "events": v["events"], "deaths_best": v["best"]}
                for k, v in sorted(civ_by_state.items(), key=lambda kv: -kv[1]["events"])]
    civ_out = {"source": "UCDP GED v25.1 + Candidate", "window_start": WINDOW_START,
               "note": "One-sided violence against civilians, AGGREGATED to state level only "
                       "(Darfur guardrail: no fine-grained point localisation).",
               "by_state": civ_list}
    with open(os.path.join(out_dir, "civilian_violence_by_state.json"), "w", encoding="utf-8") as f:
        json.dump(civ_out, f, ensure_ascii=False, indent=1)

    summary = {"n_rows_window": len(rows), "n_clash_points": len(clash_feats),
               "date_min": dmin, "date_max": dmax, "cat_counts": cat_counts,
               "clash_best_total": total_best_clash,
               "months": dict(sorted(months.items())),
               "n_states_civ": len(civ_list)}
    with open(os.path.join(out_dir, "ucdp_summary.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=1)
    print(json.dumps(summary, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
