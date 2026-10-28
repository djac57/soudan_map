#!/usr/bin/env python3
# -I recommended:  python3 -I scripts/analysis/build_analysis.py ...
# ---------------------------------------------------------------------------
# ANALYSE / "POUSSEES PROBABLES" — heuristic "where it is moving" layer.
#
# Reads (never edits):
#   - data/sudan_core.json : UCDP dated clash events, states, timeline,
#                            fires_conflict_recent (<15 km of a recent clash)
#   - a claims JSON dumped from data/layer_maps.js (SAF/RSF dated claims,
#     `contested` flag) via scripts/analysis/dump_claims.js
#
# Writes:
#   - data/layer_analysis.js  (window.SUDAN.analysis = {...})
#
# This is an INDICATIVE heuristic from recent open-data dynamics, NOT a forecast
# and NOT a validated model. Scores are RELATIVE (normalised 0..1) and explained.
# No false precision; coordinates rounded; Darfur guardrail: localities/axes only,
# no camp granularity, no nominative data, nothing invented.
# ---------------------------------------------------------------------------
import sys, json, math, datetime as dt
from collections import defaultdict

# ----------------------------- parameters ----------------------------------
RECENT_DAYS   = 90        # "last ~3 months" recent window for events
CELL_DEG      = 0.25      # ~25 km grid for sub-state watch zones (coarse on purpose)
CLAIM_NEAR_KM = 45.0      # a claim counts for a zone if within this radius
FIRE_NEAR_KM  = 35.0      # a conflict-fire cell counts for a zone within this radius
CAPTURE_RECENT_DAYS = 210 # a "captured" claim is "recent" if within this of ref
MIN_CELL_EVENTS = 2       # candidate zone must have >= this many recent events
DEDUP_KM      = 40.0      # merge adjacent cells into one distinct sector
TOP_ZONES     = 10        # keep at most this many DISTINCT watch zones
COORD_ROUND   = 1         # round output lon/lat to 1 decimal (~11 km): no fake precision

# weights for the relative score (documented in the README)
W_RECENT = 0.40           # recent clash intensity
W_ACCEL  = 0.30           # acceleration vs the zone's own long-run base
W_CLAIM  = 0.20           # recent claimed capture / contested locality nearby
W_FIRE   = 0.10           # conflict-fire corroboration nearby

ADM1_FR = {
    "SD-DN":"Darfour du Nord","SD-DS":"Darfour du Sud","SD-DE":"Darfour oriental",
    "SD-DC":"Darfour central","SD-KH":"Khartoum","SD-NB":"Nil Bleu",
    "SD-DW":"Darfour occidental","SD-KN":"Kordofan du Nord","SD-NW":"Nil Blanc",
    "SD-NO":"Nord","SD-GD":"Gedaref","SD-GK":"Kordofan occidental",
    "SD-KS":"Kordofan du Sud","SD-RS":"Mer Rouge","SD-NR":"Nil (fleuve)",
    "SD-GZ":"Al-Jazirah (Gezira)","SD-KA":"Kassala","SD-SI":"Sennar",
}
# state NAME (UCDP events use the English name) -> adm1_id, via states[]

FR_MONTHS = ["", "janv.", "fevr.", "mars", "avr.", "mai", "juin",
             "juil.", "aout", "sept.", "oct.", "nov.", "dec."]

# ----------------------------- helpers -------------------------------------
def parse_day(s):
    """Parse an event date 'YYYY-MM-DD' -> date."""
    return dt.date(int(s[0:4]), int(s[5:7]), int(s[8:10]))

def parse_claim_date(s):
    """Claims use mixed formats: 'YYYY-MM-DD', 'YYYY-MM', 'YYYY-YYYY', 'YYYY'.
    Return a representative date and whether it is a precise (single-day) value."""
    s = (s or "").strip()
    if len(s) >= 10 and s[4] == "-" and s[7] == "-":
        try:
            return parse_day(s), True
        except Exception:
            pass
    if len(s) == 7 and s[4] == "-":            # YYYY-MM -> mid-month
        return dt.date(int(s[:4]), int(s[5:7]), 15), False
    if len(s) == 9 and s[4] == "-":            # YYYY-YYYY range -> end year
        return dt.date(int(s[5:9]), 7, 1), False
    if len(s) == 4:                            # YYYY
        return dt.date(int(s), 7, 1), False
    # fallback: try leading year
    try:
        return dt.date(int(s[:4]), 7, 1), False
    except Exception:
        return None, False

def haversine_km(lo1, la1, lo2, la2):
    R = 6371.0
    p1, p2 = math.radians(la1), math.radians(la2)
    dphi = math.radians(la2 - la1)
    dl = math.radians(lo2 - lo1)
    a = math.sin(dphi/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2*R*math.asin(min(1.0, math.sqrt(a)))

def fr_date(d):
    return "%d %s %d" % (d.day, FR_MONTHS[d.month], d.year)

def cell_of(lon, lat):
    return (math.floor(lon/CELL_DEG), math.floor(lat/CELL_DEG))

def norm01(vals):
    """Scale a dict/list of values to 0..1 by its own max (relative index)."""
    mx = max(vals) if vals else 0.0
    if mx <= 0:
        return [0.0 for _ in vals]
    return [v/mx for v in vals]

# ----------------------------- main ----------------------------------------
def main():
    core_path, claims_path, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
    core = json.load(open(core_path, encoding="utf-8"))
    claims = json.load(open(claims_path, encoding="utf-8"))

    events = [e for e in core["events"] if "lon" in e and "lat" in e and "date" in e]
    states = core["states"]
    fires = core.get("fires_conflict_recent", [])

    name2id = {s["name"]: s["adm1_id"] for s in states}

    # reference "now": latest clash event (events are the acceleration spine),
    # but claims may be fresher — use the later of the two for claim recency.
    ref_ev = max(parse_day(e["date"]) for e in events)
    all_claims = [("saf", c) for c in claims.get("saf", [])] + \
                 [("rsf", c) for c in claims.get("rsf", [])]
    claim_dates = []
    for _, c in all_claims:
        d, _p = parse_claim_date(c.get("date"))
        if d:
            claim_dates.append(d)
    ref_claim = max(claim_dates) if claim_dates else ref_ev
    ref = max(ref_ev, ref_claim)

    recent_start = ref_ev - dt.timedelta(days=RECENT_DAYS - 1)
    first_ev = min(parse_day(e["date"]) for e in events)
    base_days = max(1, (recent_start - first_ev).days)   # span used for base rate

    # ---- per-state momentum: recent 90 d vs own long-run base (per-90 d) ----
    rec_by_state = defaultdict(int)
    base_by_state = defaultdict(int)
    for e in events:
        d = parse_day(e["date"])
        st = e.get("state") or "Unknown"
        if d >= recent_start:
            rec_by_state[st] += 1
        elif d < recent_start:
            base_by_state[st] += 1

    momentum = []
    for s in states:
        st = s["name"]
        rec = rec_by_state.get(st, 0)
        base_cnt = base_by_state.get(st, 0)
        base_per90 = base_cnt / base_days * RECENT_DAYS       # expected recent count
        ratio = rec / base_per90 if base_per90 > 0.25 else (rec and 9.99 or 0.0)
        if rec < 2 and base_per90 < 0.5:
            trend = "faible activite"
        elif ratio >= 1.6 and rec >= 3:
            trend = "forte hausse"
        elif ratio >= 1.15:
            trend = "hausse"
        elif ratio <= 0.6:
            trend = "baisse"
        else:
            trend = "stable"
        momentum.append({
            "state": st,
            "adm1_id": s["adm1_id"],
            "adm1_fr": ADM1_FR.get(s["adm1_id"], st),
            "recent": rec,
            "base": round(base_per90, 1),
            "ratio": round(ratio, 2),
            "trend": trend,
        })
    momentum.sort(key=lambda m: (-m["recent"], -m["ratio"]))

    # ---- candidate watch cells from recent events ----
    recent_events = [e for e in events if parse_day(e["date"]) >= recent_start]
    cells = defaultdict(list)
    for e in recent_events:
        cells[cell_of(e["lon"], e["lat"])].append(e)

    base_cell_count = defaultdict(int)   # events BEFORE the recent window, per cell
    for e in events:
        if parse_day(e["date"]) < recent_start:
            base_cell_count[cell_of(e["lon"], e["lat"])] += 1

    # pre-parse claims with representative dates
    claim_pts = []
    for side, c in all_claims:
        d, precise = parse_claim_date(c.get("date"))
        claim_pts.append({
            "side": side, "lon": c["lon"], "lat": c["lat"],
            "place": c.get("place", ""), "adm1": c.get("adm1", ""),
            "date": d, "date_raw": c.get("date"), "precise": precise,
            "claim": c.get("claim", ""), "contested": bool(c.get("contested")),
        })

    raw = []
    for cell, evs in cells.items():
        if len(evs) < MIN_CELL_EVENTS:
            continue
        # weighted centroid of recent events in the cell
        clon = sum(e["lon"] for e in evs) / len(evs)
        clat = sum(e["lat"] for e in evs) / len(evs)
        rec = len(evs)
        # acceleration vs the cell's own pre-window base, scaled to a 90 d expectation
        base_c = base_cell_count.get(cell, 0)
        base_c90 = base_c / base_days * RECENT_DAYS
        accel = (rec - base_c90) / (rec + base_c90 + 1.0)    # -1..~1, >0 = heating up
        accel = max(0.0, accel)                               # only count acceleration
        # dominant state of the cell
        stc = defaultdict(int)
        for e in evs:
            stc[e.get("state") or "Unknown"] += 1
        dom_state = max(stc.items(), key=lambda kv: kv[1])[0]
        deaths = sum(e.get("deaths", 0) or 0 for e in evs)

        # nearby claims
        near_claims = []
        for cp in claim_pts:
            dkm = haversine_km(clon, clat, cp["lon"], cp["lat"])
            if dkm <= CLAIM_NEAR_KM:
                near_claims.append((dkm, cp))
        # nearby conflict fires
        n_fire = 0
        for f in fires:
            if haversine_km(clon, clat, f["lon"], f["lat"]) <= FIRE_NEAR_KM:
                n_fire += 1

        raw.append({
            "cell": cell, "lon": clon, "lat": clat, "rec": rec,
            "base90": base_c90, "accel": accel, "deaths": deaths,
            "state": dom_state, "near_claims": near_claims, "n_fire": n_fire,
        })

    if not raw:
        print("no candidate cells", file=sys.stderr)

    # relative sub-scores (normalised across candidates)
    rec_idx  = norm01([math.log1p(r["rec"]) for r in raw])
    acc_idx  = norm01([r["accel"] for r in raw])
    fire_idx = norm01([math.log1p(r["n_fire"]) for r in raw])
    claim_strength = []
    for r in raw:
        s = 0.0
        for dkm, cp in r["near_claims"]:
            w = max(0.2, 1.0 - dkm / CLAIM_NEAR_KM)   # closer = stronger
            if cp["contested"]:
                s += 1.0 * w
            if cp["claim"] == "captured" and cp["date"] and \
               (ref - cp["date"]).days <= CAPTURE_RECENT_DAYS:
                s += 0.8 * w
        claim_strength.append(s)
    claim_idx = norm01(claim_strength)

    for i, r in enumerate(raw):
        r["score"] = (W_RECENT*rec_idx[i] + W_ACCEL*acc_idx[i] +
                      W_CLAIM*claim_idx[i] + W_FIRE*fire_idx[i])

    raw.sort(key=lambda r: -r["score"])
    # greedy spatial dedup: keep the strongest cell of each distinct sector,
    # fold an adjacent weaker cell's events/claims/fires into it (so Bara,
    # Kurmuk, Kazgeil etc. appear once with their full driver set).
    top = []
    for r in raw:
        host = None
        for k in top:
            if haversine_km(r["lon"], r["lat"], k["lon"], k["lat"]) <= DEDUP_KM:
                host = k
                break
        if host is None:
            if len(top) < TOP_ZONES:
                top.append(r)
        else:
            host["rec"] += r["rec"]
            host["n_fire"] = max(host["n_fire"], r["n_fire"])
            host["near_claims"].extend(r["near_claims"])
            if r["base90"] > host["base90"]:
                host["base90"] = r["base90"]
    # renormalise displayed score to 0..1 over the kept zones (relative index)
    smax = max((r["score"] for r in top), default=1.0) or 1.0

    win_lo = recent_start
    window_str = "%d j (≈ %s – %s)" % (RECENT_DAYS, fr_date(win_lo), fr_date(ref_ev))

    watch_zones = []
    for r in top:
        drivers = []
        # acceleration driver
        delta = r["rec"] - r["base90"]
        if r["base90"] >= 0.5 and delta >= 2:
            drivers.append("+%d affrontements vs base (%.0f attendus, %d observes sur %d j)"
                           % (round(delta), r["base90"], r["rec"], RECENT_DAYS))
        else:
            drivers.append("%d affrontements sur les %d derniers jours"
                           % (r["rec"], RECENT_DAYS))
        # claim drivers (closest first, dedup by place)
        seen = set()
        for dkm, cp in sorted(r["near_claims"], key=lambda x: x[0]):
            place = cp["place"].split(" (")[0]
            if place in seen:
                continue
            if cp["contested"]:
                seen.add(place)
                drivers.append("%s : localite contestee (a change de mains)" % place)
            elif cp["claim"] == "captured" and cp["date"] and \
                 (ref - cp["date"]).days <= CAPTURE_RECENT_DAYS:
                seen.add(place)
                when = fr_date(cp["date"]) if cp["precise"] else (cp["date_raw"] or "")
                drivers.append("prise %s revendiquee (%s) pres de %s"
                               % (cp["side"].upper(), when, place))
            if len(seen) >= 3:
                break
        # fire driver
        if r["n_fire"] >= 2:
            drivers.append("%d cellules de feux de conflit <%d km (indice faible)"
                           % (r["n_fire"], int(FIRE_NEAR_KM)))

        watch_zones.append({
            "lon": round(r["lon"], COORD_ROUND),
            "lat": round(r["lat"], COORD_ROUND),
            "adm1": r["state"],
            "adm1_fr": ADM1_FR.get(name2id.get(r["state"]), r["state"]),
            "score": round(r["score"]/smax, 3),
            "drivers": drivers,
            "window": window_str,
        })

    note = ("INDICATIF — base sur la dynamique recente des donnees ouvertes "
            "(UCDP + revendications SAF/RSF datees + feux de conflit), PAS une "
            "prevision ni un modele valide. Ne pas lire comme une certitude. "
            "Scores RELATIFS normalises 0..1 (le plus chaud = 1), non une probabilite. "
            "Garde-fou Darfour : zones a l'echelle de localites/axes (~25 km), "
            "aucune granularite camp, aucune donnee nominative, rien d'invente.")

    analysis = {
        "generated": dt.date.today().isoformat(),
        "ref_date": ref_ev.isoformat(),
        "window_days": RECENT_DAYS,
        "weights": {"recent": W_RECENT, "acceleration": W_ACCEL,
                    "claims": W_CLAIM, "fires": W_FIRE},
        "watch_zones": watch_zones,
        "momentum_by_state": momentum,
        "note": note,
    }

    header = (
        "/* ------------------------------------------------------------------\n"
        " * data/layer_analysis.js — COUCHE ANALYSE / \"POUSSEES PROBABLES\"\n"
        " * Genere par scripts/analysis/build_analysis.py — NE PAS editer a la main.\n"
        " * Charge APRES data/bundle.js + data/layer_maps.js. Additif : pose\n"
        " * window.SUDAN.analysis. Ne touche aucun autre fichier.\n"
        " *\n"
        " * INDICATIF, heuristique, NON VALIDE. Pas une prevision. Scores relatifs.\n"
        " * Garde-fou Darfour respecte (localites/axes, pas de camps). Voir .README.md\n"
        " * ------------------------------------------------------------------ */\n"
    )
    body = ("(function () {\n  \"use strict\";\n"
            "  window.SUDAN = window.SUDAN || {};\n"
            "  window.SUDAN.analysis = " +
            json.dumps(analysis, ensure_ascii=False) + ";\n})();\n")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(header + body)

    print("ref_ev=%s ref_claim=%s zones=%d states=%d" %
          (ref_ev, ref_claim, len(watch_zones), len(momentum)), file=sys.stderr)


if __name__ == "__main__":
    main()
