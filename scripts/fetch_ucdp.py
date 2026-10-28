#!/usr/bin/env python3
"""
Fetch the UCDP GED *bulk* files (keyless) into the local raw dir, so CI can
rebuild the Sudan event layers from scratch (data/raw/ is gitignored and absent
on a fresh checkout).

Two public, keyless bulk downloads from https://ucdp.uu.se/downloads/ :
  1. Stable GED release zip  -> <raw_dir>/ged251-csv.zip
     (annual "finished" dataset; the war history 2023-2024). Pinned to v25.1 to
     match the filename process_ucdp.py / build_sudan.py look for. When UCDP
     ships the next annual release (ged26-1), bump STABLE_* here AND the two
     build scripts together -- that is a deliberate MANUAL yearly step.
  2. Monthly "Candidate" CSVs -> <raw_dir>/candidate/GEDEvent_v<YY>_0_<M>.csv
     (provisional recent months; this is the part that actually changes monthly).
     Discovered by probing v<YY> and v<YY-1>, months 1..12, keeping only the
     responses that are real CSV (the server answers 200 with an empty body for
     a month that does not exist yet, so content is validated, not the status).

NOT keyless anymore: the ucdpapi REST endpoint now requires an access token, so
we use the bulk CSV/zip downloads only -- exactly what the build scripts read.

Usage (paths passed as arguments; no key, stdlib only, run isolated):
    python3 -I scripts/fetch_ucdp.py <ucdp_raw_dir>   e.g. data/raw/ucdp

Idempotent: a valid stable zip already present is kept (so an Actions cache hit
avoids the ~29 MB re-download); candidate months are always refreshed (small,
and the latest month is revised in place by UCDP during the month).
"""
import datetime
import os
import sys
import urllib.error
import urllib.request

UA = {"User-Agent": "sudan-ucdp-fetch/1.0 (personal research)"}

STABLE_URL = "https://ucdp.uu.se/downloads/ged/ged251-csv.zip"
STABLE_OUT = "ged251-csv.zip"
STABLE_MIN_BYTES = 1_000_000          # the real zip is ~29 MB; guard truncation
ZIP_MAGIC = b"PK\x03\x04"

CAND_BASE = "https://ucdp.uu.se/downloads/candidateged/"
CAND_HEADER = b"id,relid,year"        # first bytes of a genuine GED candidate CSV
CAND_MIN_BYTES = 10_000


def _get(url, timeout=240):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def fetch_stable(raw_dir):
    out = os.path.join(raw_dir, STABLE_OUT)
    if os.path.exists(out) and os.path.getsize(out) >= STABLE_MIN_BYTES:
        with open(out, "rb") as f:
            if f.read(4) == ZIP_MAGIC:
                print("stable: kept existing %s (%d bytes)" % (STABLE_OUT, os.path.getsize(out)))
                return True
    try:
        data = _get(STABLE_URL)
    except (urllib.error.URLError, OSError) as e:
        print("stable: download FAILED: %s" % e, file=sys.stderr)
        return False
    if len(data) < STABLE_MIN_BYTES or data[:4] != ZIP_MAGIC:
        print("stable: rejected response (%d bytes, magic=%r)" % (len(data), data[:4]), file=sys.stderr)
        return False
    with open(out, "wb") as f:
        f.write(data)
    print("stable: wrote %s (%d bytes)" % (STABLE_OUT, len(data)))
    return True


def fetch_candidates(raw_dir):
    cdir = os.path.join(raw_dir, "candidate")
    os.makedirs(cdir, exist_ok=True)
    yy = datetime.date.today().year % 100
    versions = sorted({yy, yy - 1})      # cover the Jan boundary (prev-year months)
    saved = 0
    for ver in versions:
        for month in range(1, 13):
            name = "GEDEvent_v%d_0_%d.csv" % (ver, month)
            url = CAND_BASE + name
            try:
                data = _get(url, timeout=120)
            except (urllib.error.URLError, OSError) as e:
                print("  candidate %s: fetch error: %s" % (name, e), file=sys.stderr)
                continue
            if len(data) < CAND_MIN_BYTES or not data.lstrip()[:16].startswith(CAND_HEADER):
                continue                 # month not published (empty/HTML body) -> skip
            with open(os.path.join(cdir, name), "wb") as f:
                f.write(data)
            saved += 1
            print("  candidate: wrote %s (%d bytes)" % (name, len(data)))
    print("candidates: %d file(s) saved into %s" % (saved, cdir))
    return saved


def main():
    if len(sys.argv) < 2:
        sys.stderr.write(__doc__)
        sys.exit(2)
    raw_dir = sys.argv[1]
    os.makedirs(raw_dir, exist_ok=True)
    ok_stable = fetch_stable(raw_dir)
    n_cand = fetch_candidates(raw_dir)
    # Succeed if we have at least the stable bulk or some candidate months; the
    # workflow's integrity guard (events-count floor) is the real safety net.
    if not ok_stable and n_cand == 0:
        print("ERROR: no UCDP data retrieved", file=sys.stderr)
        sys.exit(3)


if __name__ == "__main__":
    main()
