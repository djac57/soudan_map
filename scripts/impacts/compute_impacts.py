"""Couche IMPACTS Sentinel-2 sur El-Fasher (Darfour Nord) — proxy indicatif de changement de surface.

Calcule une VRAIE couche de changement a partir de DEUX acquisitions Sentinel-2 L2A reelles
(une reference, une recente), via le STAC public de Microsoft Planetary Computer (COG signes par
jetons SAS anonymes, AUCUN compte). Indice NBR = (NIR B08 - SWIR B12) / (NIR + SWIR), difference
dNBR = NBR_avant - NBR_apres (positif = perte de vegetation / sol denude / brule / detruit).
Le dNBR est agrege en CELLULES (mailles urbaines, ~250 m) : surface agregee, JAMAIS de pixel ni de
ciblage de camps / lieux d'exactions. C'est un PROXY INDICATIF, pas une preuve de destruction.

Sorties :
  data/raw/impacts/scenes.json          metadonnees des 2 scenes (dates, nuages, items, tuile)
  data/raw/impacts/change_cells.geojson FeatureCollection des cellules de changement (dNBR)
  data/layer_impacts.js                 window.SUDAN.impacts = {...}

Lecture fenetree des COG via rasterio + WarpedVRT (grille UTM cible, resampling par bande).
Reseau requis (STAC + COG publics). AUCUNE cle, AUCUN secret ecrit dans le depot.

Usage :
  python -I scripts/impacts/compute_impacts.py <racine_projet> \
      [--before-start 2024-01-01 --before-end 2024-05-31] \
      [--after-start 2026-09-15 --after-end 2026-10-28] \
      [--threshold 0.27]
"""
import argparse
import datetime as dt
import json
import os
import sys
import time

os.environ.setdefault("GDAL_DISABLE_READDIR_ON_OPEN", "EMPTY_DIR")
os.environ.setdefault("GDAL_HTTP_MAX_RETRY", "5")
os.environ.setdefault("GDAL_HTTP_RETRY_DELAY", "3")
os.environ.setdefault("GDAL_HTTP_TIMEOUT", "60")
os.environ.setdefault("VSI_CACHE", "TRUE")

import numpy as np
import planetary_computer as pc
import pystac_client
import rasterio
from pyproj import Transformer
from rasterio.enums import Resampling
from rasterio.transform import from_origin
from rasterio.vrt import WarpedVRT

STAC = "https://planetarycomputer.microsoft.com/api/stac/v1"
COLLECTION = "sentinel-2-l2a"

# El-Fasher (Darfour Nord). Centre ~25.35E / 13.63N.
# Fenetre CENTREE SUR LE BATI (~0,14 deg, ~15 km) : la zone construite + sa peripherie immediate
# (aeroport au nord-ouest). Choix delibere : sur une fenetre large ~0,2 deg, le dNBR entre deux dates
# est DOMINE par la phenologie agricole saisonniere (champs peri-urbains), pas par le bati ; cf. le
# diagnostic du README. En zone construite (peu de vegetation), un dNBR positif est un proxy bien
# plus fiable d'un changement de surface reel (gravats, incendie, parcelles denudees).
SITE_NAME = "El Fasher"
CENTER = (25.35, 13.63)
BBOX = [25.28, 13.56, 25.42, 13.70]   # [minlon, minlat, maxlon, maxlat] ~15 km, centre sur le bati

RES = 20.0          # grille cible (m) : B12/SCL natifs 20 m, B08 reechantillonne 10->20 m
CELL = 250.0        # cote des cellules d'agregation (m) — garde-fou : surface agregee
MIN_VALID_FRAC = 0.5    # part de pixels valides (non nuage) requise dans une cellule
MIN_CHANGED_FRAC = 0.30  # part de pixels > seuil requise pour retenir la cellule
# Processing baseline >= 04.00 (apres 2022-01-25) : offset BOA de -1000 sur la reflectance DN.
BOA_OFFSET = 1000.0


# ----------------------------------------------------------------- STAC
def stac_search(bbox, start, end, cmax, tries=5):
    last = None
    for attempt in range(tries):
        try:
            cat = pystac_client.Client.open(STAC)
            items = list(cat.search(
                collections=[COLLECTION], bbox=bbox, datetime=f"{start}/{end}",
                query={"eo:cloud_cover": {"lt": cmax}}).items())
            return items
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(min(120, 10 * 2 ** attempt))
    raise RuntimeError(f"recherche STAC echouee : {type(last).__name__}: {last}")


def covers(item_bbox, bbox):
    """Vrai si l'item couvre entierement la fenetre bbox (4 bords)."""
    return (item_bbox[0] <= bbox[0] and item_bbox[1] <= bbox[1]
            and item_bbox[2] >= bbox[2] and item_bbox[3] >= bbox[3])


def pick_scene(bbox, start, end, label, cmax=25):
    """Choisit l'acquisition la MOINS nuageuse couvrant toute la fenetre."""
    items = stac_search(bbox, start, end, cmax)
    cands = [it for it in items if covers(list(it.bbox), bbox)]
    if not cands:  # repli : couvre au moins le centre, bbox large
        cands = items
    if not cands:
        raise RuntimeError(f"[{label}] aucune scene S2 L2A dans {start}..{end} (cloud<{cmax})")
    cands.sort(key=lambda it: it.properties.get("eo:cloud_cover", 100.0))
    best = cands[0]
    print(f"[{label}] {len(items)} scenes, retenue {best.id} "
          f"({best.datetime.date()}, nuages {best.properties.get('eo:cloud_cover'):.1f}%)",
          file=sys.stderr)
    return best


# ----------------------------------------------------------------- grille cible UTM
def utm_epsg(lon):
    return 32600 + int((lon + 180) // 6) + 1


def build_grid(bbox):
    epsg = utm_epsg(CENTER[0])
    tr = Transformer.from_crs("EPSG:4326", f"EPSG:{epsg}", always_xy=True)
    xs, ys = tr.transform([bbox[0], bbox[2], bbox[0], bbox[2]],
                          [bbox[1], bbox[1], bbox[3], bbox[3]])
    x0 = np.floor(min(xs) / RES) * RES
    x1 = np.ceil(max(xs) / RES) * RES
    y0 = np.floor(min(ys) / RES) * RES
    y1 = np.ceil(max(ys) / RES) * RES
    W = int(round((x1 - x0) / RES))
    H = int(round((y1 - y0) / RES))
    return dict(epsg=int(epsg), x0=float(x0), y1=float(y1), W=W, H=H,
                transform=from_origin(x0, y1, RES, RES))


def read_band(item, band, G, resampling):
    """Lit un asset S2 dans la grille cible (WarpedVRT : CRS + resolution uniformises)."""
    href = pc.sign(item.assets[band].href)
    last = None
    for attempt in range(4):
        try:
            with rasterio.open(href) as ds:
                with WarpedVRT(ds, crs=f"EPSG:{G['epsg']}", transform=G["transform"],
                               width=G["W"], height=G["H"], resampling=resampling) as vrt:
                    return vrt.read(1)
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(5 * (attempt + 1))
    raise RuntimeError(f"lecture {band} echouee : {type(last).__name__}: {last}")


def nbr_and_mask(item, G):
    """NBR (reflectance offset-corrigee) + masque valide (SCL vegetation/sol/eau/non-classe)."""
    b08 = read_band(item, "B08", G, Resampling.average).astype(np.float32)  # 10 m -> 20 m
    b12 = read_band(item, "B12", G, Resampling.nearest).astype(np.float32)  # 20 m natif
    scl = read_band(item, "SCL", G, Resampling.nearest)                     # 20 m natif
    nir = np.maximum(b08 - BOA_OFFSET, 0.0)
    swir = np.maximum(b12 - BOA_OFFSET, 0.0)
    nbr = (nir - swir) / np.maximum(nir + swir, 1.0)
    # SCL : 4 vegetation, 5 sol nu, 6 eau, 7 non classe. Exclus : nuages/ombres/neige 3,8,9,10,11.
    valid = np.isin(scl, (4, 5, 6, 7)) & (b08 > 0) & (b12 > 0)
    return nbr.astype(np.float32), valid


# ----------------------------------------------------------------- agregation en cellules
def aggregate_cells(dnbr, valid, G, threshold):
    """Agrege le dNBR en cellules de CELL metres ; retient les cellules de changement net."""
    step = int(round(CELL / RES))     # pixels par cote de cellule
    nj = G["H"] // step
    ni = G["W"] // step
    tr = Transformer.from_crs(f"EPSG:{G['epsg']}", "EPSG:4326", always_xy=True)
    feats = []
    changed_px = valid & (dnbr > threshold)
    for cj in range(nj):
        for ci in range(ni):
            r0, c0 = cj * step, ci * step
            vsub = valid[r0:r0 + step, c0:c0 + step]
            nv = int(vsub.sum())
            if nv < MIN_VALID_FRAC * step * step:
                continue
            csub = changed_px[r0:r0 + step, c0:c0 + step]
            frac = csub.sum() / nv
            if frac < MIN_CHANGED_FRAC:
                continue
            dsub = dnbr[r0:r0 + step, c0:c0 + step][vsub]
            dmean = float(np.mean(dsub))
            dp90 = float(np.percentile(dsub, 90))
            # coins de la cellule (UTM -> lon/lat)
            ux0 = G["x0"] + c0 * RES
            uy1 = G["y1"] - r0 * RES
            ux1 = ux0 + step * RES
            uy0 = uy1 - step * RES
            lon, lat = tr.transform([ux0, ux1, ux1, ux0, ux0],
                                    [uy1, uy1, uy0, uy0, uy1])
            ring = [[round(float(a), 6), round(float(b), 6)] for a, b in zip(lon, lat)]
            feats.append({
                "type": "Feature",
                "geometry": {"type": "Polygon", "coordinates": [ring]},
                "properties": {
                    "dnbr_mean": round(dmean, 3),
                    "dnbr_p90": round(dp90, 3),
                    "frac_changed": round(float(frac), 2),
                    "n_valid_px": nv,
                },
            })
    return {"type": "FeatureCollection", "features": feats}


# ----------------------------------------------------------------- ecriture layer_impacts.js
def write_layer_js(path, payload):
    body = json.dumps(payload, ensure_ascii=False, indent=2)
    header = (
        "/* ---------------------------------------------------------------------------\n"
        " * data/layer_impacts.js  —  COUCHE IMPACTS (proxy de changement de surface S2) El-Fasher\n"
        " *\n"
        " * GENERE par scripts/impacts/compute_impacts.py — ne pas editer a la main.\n"
        " * Charge APRES data/bundle.js. N'ecrase rien : ajoute window.SUDAN.impacts.\n"
        " *\n"
        " * dNBR = NBR_avant - NBR_apres sur deux acquisitions Sentinel-2 L2A reelles (Planetary\n"
        " * Computer, keyless). Agrege en cellules ~250 m. PROXY INDICATIF de changement de surface,\n"
        " * PAS une preuve de destruction. GARDE-FOU DARFOUR : surface urbaine agregee, aucun\n"
        " * ciblage de camps de deplaces ni de localisation d'exactions.\n"
        " * ------------------------------------------------------------------------- */\n"
    )
    js = (header
          + "(function () {\n  \"use strict\";\n  window.SUDAN = window.SUDAN || {};\n"
          + "  window.SUDAN.impacts = " + body + ";\n})();\n")
    with open(path, "w", encoding="utf-8") as f:
        f.write(js)


# ----------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("root")
    ap.add_argument("--before-start", default="2024-01-01")
    ap.add_argument("--before-end", default="2024-05-31")
    ap.add_argument("--after-start", default="2026-09-15")
    ap.add_argument("--after-end", default="2026-10-28")
    ap.add_argument("--threshold", type=float, default=0.27)
    args = ap.parse_args()

    root = os.path.abspath(args.root)
    raw_dir = os.path.join(root, "data", "raw", "impacts")
    os.makedirs(raw_dir, exist_ok=True)

    G = build_grid(BBOX)
    print(f"grille cible EPSG:{G['epsg']} {G['W']}x{G['H']} @ {RES} m", file=sys.stderr)

    before = pick_scene(BBOX, args.before_start, args.before_end, "AVANT")
    after = pick_scene(BBOX, args.after_start, args.after_end, "APRES")

    nbr0, v0 = nbr_and_mask(before, G)
    nbr1, v1 = nbr_and_mask(after, G)
    valid = v0 & v1
    dnbr = np.where(valid, nbr0 - nbr1, 0.0).astype(np.float32)

    fc = aggregate_cells(dnbr, valid, G, args.threshold)
    n_cells = len(fc["features"])
    area_km2 = round(n_cells * (CELL / 1000.0) ** 2, 3)
    valid_cov = float(valid.mean())
    print(f"couverture valide (2 dates) {valid_cov*100:.1f}% ; "
          f"{n_cells} cellules de changement, {area_km2} km2", file=sys.stderr)

    date_before = str(before.datetime.date())
    date_after = str(after.datetime.date())
    cloud_before = round(float(before.properties.get("eo:cloud_cover", -1)), 1)
    cloud_after = round(float(after.properties.get("eo:cloud_cover", -1)), 1)

    scenes_meta = {
        "site": SITE_NAME, "center": list(CENTER), "bbox": BBOX,
        "grid": {"epsg": G["epsg"], "W": G["W"], "H": G["H"], "res_m": RES},
        "before": {"date": date_before, "cloud_cover": cloud_before, "item": before.id,
                   "tile": before.properties.get("s2:mgrs_tile"),
                   "baseline": before.properties.get("s2:processing_baseline")},
        "after": {"date": date_after, "cloud_cover": cloud_after, "item": after.id,
                  "tile": after.properties.get("s2:mgrs_tile"),
                  "baseline": after.properties.get("s2:processing_baseline")},
        "metric": "dNBR", "threshold": args.threshold,
        "cell_m": CELL, "valid_coverage": round(valid_cov, 4),
        "generated": dt.date.today().isoformat(),
    }
    with open(os.path.join(raw_dir, "scenes.json"), "w", encoding="utf-8") as f:
        json.dump(scenes_meta, f, ensure_ascii=False, indent=2)
    with open(os.path.join(raw_dir, "change_cells.geojson"), "w", encoding="utf-8") as f:
        json.dump(fc, f, ensure_ascii=False)

    note_proxy = ("Proxy indicatif de changement de surface (dNBR Sentinel-2), PAS une preuve de "
                  "destruction. Un dNBR positif = perte de vegetation / sol denude / surface brulee "
                  "ou detruite, mais aussi labours, secheresse saisonniere, chantiers. Agrege en "
                  "cellules de 250 m (surface urbaine), jamais de pixel ni de ciblage de camps de "
                  "deplaces ou de lieux d'exactions. A corroborer par d'autres sources.")

    payload = {
        "sites": [{
            "name": SITE_NAME,
            "bbox": BBOX,
            "center": list(CENTER),
            "date_before": date_before,
            "date_after": date_after,
            "cloud_before": cloud_before,
            "cloud_after": cloud_after,
            "item_before": before.id,
            "item_after": after.id,
            "metric": "dNBR",
            "threshold": args.threshold,
            "cell_m": CELL,
            "change": fc,
            "stats": {"n_cells": n_cells, "area_km2": area_km2,
                      "valid_coverage": round(valid_cov, 4)},
            "note": note_proxy,
        }],
        "note": ("Couche IMPACTS : difference d'indice NBR entre deux acquisitions Sentinel-2 L2A "
                 "reelles sur El-Fasher, agregee en cellules. PROXY INDICATIF de changement de "
                 "surface, pas une preuve de destruction. GARDE-FOU DARFOUR : surface agregee, "
                 "aucun ciblage de populations deplacees."),
        "sources": [{
            "name": "Copernicus Sentinel-2 L2A (ESA) via Microsoft Planetary Computer",
            "license": "Copernicus Sentinel data — COG publics, jetons SAS anonymes (aucun compte)",
            "url": "https://planetarycomputer.microsoft.com/dataset/sentinel-2-l2a",
        }],
        "generated": dt.date.today().isoformat(),
    }
    write_layer_js(os.path.join(root, "data", "layer_impacts.js"), payload)
    print("OK -> data/layer_impacts.js", file=sys.stderr)


if __name__ == "__main__":
    main()
