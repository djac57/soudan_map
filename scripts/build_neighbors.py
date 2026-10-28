#!/usr/bin/env python3
"""
Merge geoBoundaries ADM0 outlines of Sudan's neighbours into one light context
layer (data/boundaries/sudan_neighbors.geojson). Coordinates are rounded to ~1 km
and consecutive duplicates dropped: these are context outlines for an extended
map, not analytical polygons.

Usage (raw files are untrusted; pass out path + the ISO:name:path triples):
    python3 -I scripts/build_neighbors.py <out_geojson> <raw_dir>
<raw_dir> holds <ISO>.geojson from geoBoundaries gbOpen ADM0 (CC BY 4.0).
"""
import json, os, sys

NAMES = {"SSD": "South Sudan", "TCD": "Chad", "EGY": "Egypt", "ERI": "Eritrea",
         "ETH": "Ethiopia", "CAF": "Central African Republic", "LBY": "Libya"}
ORDER = ["SSD", "TCD", "EGY", "ERI", "ETH", "CAF", "LBY"]
PREC = 2  # decimals (~1.1 km) -- context outline only


def round_ring(ring):
    out = []
    last = None
    for pt in ring:
        p = [round(pt[0], PREC), round(pt[1], PREC)]
        if p != last:
            out.append(p)
            last = p
    if len(out) >= 3 and out[0] != out[-1]:
        out.append(out[0])
    return out if len(out) >= 4 else None


def simplify_geom(geom):
    t = geom.get("type")
    if t == "Polygon":
        rings = [r for r in (round_ring(r) for r in geom["coordinates"]) if r]
        return {"type": "Polygon", "coordinates": rings} if rings else None
    if t == "MultiPolygon":
        polys = []
        for poly in geom["coordinates"]:
            rings = [r for r in (round_ring(r) for r in poly) if r]
            if rings:
                polys.append(rings)
        return {"type": "MultiPolygon", "coordinates": polys} if polys else None
    return None


def main(out_geojson, raw_dir):
    feats = []
    for iso in ORDER:
        p = os.path.join(raw_dir, f"{iso}.geojson")
        if not os.path.exists(p):
            print("missing", p, file=sys.stderr)
            continue
        with open(p, encoding="utf-8") as f:
            g = json.load(f)
        geom = None
        for feat in g.get("features", []):
            geom = simplify_geom(feat["geometry"])
            if geom:
                break
        if not geom:
            continue
        feats.append({"type": "Feature",
                      "properties": {"name": NAMES[iso], "iso3": iso, "ctx": True},
                      "geometry": geom})
    fc = {"type": "FeatureCollection",
          "meta": {"source": "geoBoundaries gbOpen ADM0 (CC BY 4.0)",
                   "url": "https://www.geoboundaries.org/",
                   "note": "Context outlines of Sudan's neighbours for the extended "
                           "map; coords rounded to ~1 km. Not analytical polygons.",
                   "countries": [NAMES[i] for i in ORDER]},
          "features": feats}
    with open(out_geojson, "w", encoding="utf-8") as f:
        json.dump(fc, f, ensure_ascii=False)
    print(json.dumps({"countries": len(feats), "bytes": os.path.getsize(out_geojson),
                      "out": out_geojson}, ensure_ascii=False))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
