#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fetch_scenes.py — telecharge des apercus vrais-couleurs Sentinel-2 (mosaique
"cloudless" annuelle d'EOX, SANS cle) pour les secteurs de focus du Soudan,
via le service WMS public de EOX::Maps.

Source  : EOX::Maps "Sentinel-2 cloudless" (s2cloudless-<annee>)
Licence : CC BY 4.0 — "Contains modified Copernicus Sentinel data" by EOX IT Services GmbH
Attention: composite annuel SANS nuages, PAS une acquisition datee unique.

Usage (chemins et parametres passes en ARGUMENTS, aucune cle requise) :
  python -I scripts/sentinel/fetch_scenes.py <out_dir> <layer> <label> <minlon> <minlat> <maxlon> <maxlat> [width] [height]

Exemple :
  python -I scripts/sentinel/fetch_scenes.py data/raw/sentinel s2cloudless-2025 el_fasher 24.6 12.9 26.1 14.3

Les fichiers sont ecrits dans <out_dir> ; rien n'est ecrit ailleurs, aucune cle
n'est lue ni affichee (ce service est anonyme).
"""
import sys
import os
import json
import urllib.request
import urllib.parse

WMS = "https://tiles.maps.eox.at/wms"
UA = "sudan-map-sentinel-layer/1.0 (personal OSINT map; keyless EOX WMS)"


def fetch(out_dir, layer, label, minlon, minlat, maxlon, maxlat, width, height):
    os.makedirs(out_dir, exist_ok=True)
    params = {
        "service": "WMS",
        "version": "1.1.1",
        "request": "GetMap",
        "layers": layer,
        "srs": "EPSG:4326",
        "bbox": f"{minlon},{minlat},{maxlon},{maxlat}",
        "width": str(width),
        "height": str(height),
        "format": "image/jpeg",
    }
    url = WMS + "?" + urllib.parse.urlencode(params)
    img_name = f"{label}_{layer}.jpg"
    img_path = os.path.join(out_dir, img_name)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=90) as r:
        data = r.read()
    if not data[:2] == b"\xff\xd8":
        sys.stderr.write("WARN: reponse non-JPEG (%d octets)\n" % len(data))
    with open(img_path, "wb") as f:
        f.write(data)
    meta = {
        "label": label,
        "layer": layer,
        "bbox": [minlon, minlat, maxlon, maxlat],
        "width": width,
        "height": height,
        "source": "EOX::Maps Sentinel-2 cloudless (WMS)",
        "license": "CC BY 4.0 - contains modified Copernicus Sentinel data by EOX",
        "kind": "annual cloudless composite (NOT a single-date acquisition)",
        "bytes": len(data),
        "file": img_name,
    }
    with open(os.path.join(out_dir, f"{label}_{layer}.json"), "w") as f:
        json.dump(meta, f, indent=2)
    print(f"OK {img_path} ({len(data)} octets)")
    return meta


if __name__ == "__main__":
    a = sys.argv[1:]
    if len(a) < 7:
        sys.stderr.write(__doc__)
        sys.exit(2)
    out_dir, layer, label = a[0], a[1], a[2]
    minlon, minlat, maxlon, maxlat = map(float, a[3:7])
    width = int(a[7]) if len(a) > 7 else 1024
    height = int(a[8]) if len(a) > 8 else 1024
    fetch(out_dir, layer, label, minlon, minlat, maxlon, maxlat, width, height)
