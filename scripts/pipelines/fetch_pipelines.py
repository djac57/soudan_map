#!/usr/bin/env python3
"""fetch_pipelines.py — polite OSM/Overpass fetch for the Sudan OIL PIPELINES layer.

Downloads OPEN OpenStreetMap data (ODbL) into data/raw/pipelines/ :
  - pipelines_oil.json : man_made=pipeline with an oil substance (oil / crude oil),
                         over a Sudan + South Sudan bounding box.

Usage:
  python3 -I scripts/pipelines/fetch_pipelines.py <raw_out_dir>

Politeness: ONE request at a time, generous timeout, exponential backoff,
descriptive User-Agent, mirror rotation on failure. Nothing invented here —
raw OSM only, kept out of git (data/raw/ is .gitignored).
"""
import sys, os, time, json, urllib.request, urllib.parse, urllib.error

# Sudan + South Sudan bbox for Overpass: (south, west, north, east).
# Covers Unity/Heglig fields (~lon 29-30), Melut/Palogue (~lon 32.5),
# the corridor north through Sudan, and the Red Sea terminal (~lon 37).
BBOX = "3.4,22.0,23.2,39.1"
ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
]
UA = "sudan-map-perso/1.0 (personal open-data research; OSM ODbL)"

# man_made=pipeline carrying oil. OSM tags the product on either `substance=*`
# or the legacy `type=*`; we accept oil / crude oil / "oil;gas" style values and
# filter precisely in the build step. `out geom;` returns full node geometry.
QUERIES = {
    # 1) direct oil-tagged pipeline ways/relations in the bbox.
    "pipelines_oil": (
        "[out:json][timeout:240];"
        "("
        ' way["man_made"="pipeline"]["substance"~"oil",i](%s);'
        ' way["man_made"="pipeline"]["type"~"oil",i](%s);'
        ' relation["man_made"="pipeline"]["substance"~"oil",i](%s);'
        ' relation["route"="pipeline"]["substance"~"oil",i](%s);'
        ");"
        "out geom;" % (BBOX, BBOX, BBOX, BBOX)
    ),
    # 2) member ways (with full geometry) of EVERY pipeline relation in the bbox,
    #    so route relations (e.g. the Greater Nile Oil Pipeline) resolve to lines.
    "pipeline_relation_ways": (
        "[out:json][timeout:240];"
        "("
        ' relation["man_made"="pipeline"](%s);'
        ' relation["route"="pipeline"](%s);'
        ");"
        "way(r);"
        "out geom;" % (BBOX, BBOX)
    ),
    # 3) tags of every pipeline relation in the bbox (to discover named routes
    #    such as Petrodar / PDOC that may be tagged without a substance=oil key).
    "pipeline_relations_index": (
        "[out:json][timeout:240];"
        "("
        ' relation["man_made"="pipeline"](%s);'
        ' relation["route"="pipeline"](%s);'
        ' relation["pipeline"]["name"~"petro",i](%s);'
        ' way["man_made"="pipeline"]["name"~"petro|nile|melut|palogue|pdoc",i](%s);'
        ");"
        "out tags;" % (BBOX, BBOX, BBOX, BBOX)
    ),
}


def fetch(query):
    last_err = None
    for attempt in range(6):
        ep = ENDPOINTS[attempt % len(ENDPOINTS)]
        try:
            data = urllib.parse.urlencode({"data": query}).encode("utf-8")
            req = urllib.request.Request(ep, data=data, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=300) as r:
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
    if len(sys.argv) != 2:
        sys.stderr.write("usage: python3 -I fetch_pipelines.py <raw_out_dir>\n")
        return 2
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
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
