#!/usr/bin/env python3
"""fetch_geo.py — polite OSM/Overpass fetch for the Sudan GEO layer.

Downloads OPEN OpenStreetMap data (ODbL) into data/raw/geo/ :
  - roads_trunk.json   : highway=motorway|trunk  (strategic national axes only)
  - airports.json      : aeroway=aerodrome        (named aerodromes)
  - crossings.json     : barrier=border_control   (border control points)

Usage:
  python3 -I scripts/geo/fetch_geo.py <raw_out_dir>

Politeness: ONE request at a time, generous timeout, exponential backoff,
descriptive User-Agent. Nothing invented here — raw OSM only, kept out of git
(data/raw/ is .gitignored). No control line, no military unit tracking.
"""
import sys, os, time, json, urllib.request, urllib.parse, urllib.error

# Sudan bbox for Overpass area filter: (south, west, north, east)
BBOX = "8.2,21.8,22.3,39.1"
ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]
UA = "sudan-map-perso/1.0 (personal open-data research; OSM ODbL)"

QUERIES = {
    "roads_trunk": (
        "[out:json][timeout:180];"
        '(way["highway"="motorway"](%s);'
        ' way["highway"="trunk"](%s););'
        "out geom;" % (BBOX, BBOX)
    ),
    "airports": (
        "[out:json][timeout:120];"
        '(node["aeroway"="aerodrome"]["name"](%s);'
        ' way["aeroway"="aerodrome"]["name"](%s););'
        "out center tags;" % (BBOX, BBOX)
    ),
    "crossings": (
        "[out:json][timeout:120];"
        '(node["barrier"="border_control"](%s);'
        ' node["amenity"="border_control"](%s););'
        "out tags;" % (BBOX, BBOX)
    ),
}


def fetch(query):
    last_err = None
    for attempt in range(5):
        ep = ENDPOINTS[attempt % len(ENDPOINTS)]
        try:
            data = urllib.parse.urlencode({"data": query}).encode("utf-8")
            req = urllib.request.Request(ep, data=data, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=240) as r:
                body = r.read().decode("utf-8")
            obj = json.loads(body)
            return obj
        except (urllib.error.URLError, urllib.error.HTTPError, ValueError) as e:
            last_err = e
            wait = 15 * (attempt + 1)
            sys.stderr.write("  retry %d (%s) after %ds via next endpoint...\n"
                             % (attempt + 1, type(e).__name__, wait))
            time.sleep(wait)
    raise SystemExit("Overpass failed after retries: %s" % last_err)


def main():
    out_dir = sys.argv[1]
    os.makedirs(out_dir, exist_ok=True)
    for i, (name, q) in enumerate(QUERIES.items()):
        if i:
            time.sleep(8)  # be polite between queries
        sys.stderr.write("Fetching %s ...\n" % name)
        obj = fetch(q)
        n = len(obj.get("elements", []))
        path = os.path.join(out_dir, name + ".json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(obj, f)
        sys.stderr.write("  -> %d elements, saved %s\n" % (n, path))


if __name__ == "__main__":
    main()
