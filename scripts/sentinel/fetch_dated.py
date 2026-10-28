#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fetch_dated.py — recupere des acquisitions Sentinel-2 L2A DATEES (vraies couleurs)
et une acquisition Sentinel-1 RTC DATEE (backscatter VV) sur les secteurs de focus
du Soudan, SANS AUCUN compte ni jeton, via les STAC publics et le tiler keyless de
Microsoft Planetary Computer.

Approche (identique a l'Ukraine, cf. ukraine-feux/scripts/impacts_v1/fetch.py) :
  - STAC public Planetary Computer (https://planetarycomputer.microsoft.com/api/stac/v1),
    collections "sentinel-2-l2a" et "sentinel-1-rtc" — recherche REST keyless.
  - Affichage : le TILER de Planetary Computer (api/data/v1) signe chaque tuile par item
    cote serveur avec des jetons SAS anonymes -> URL XYZ Leaflet keyless, par scene datee.
  - Apercu PNG borne par secteur : endpoint /item/bbox/{minx,miny,maxx,maxy}/{W}x{H}.png.

AUCUNE cle n'est lue ni ecrite. Le jeton NASA Earthdata (~/.config/earthdata/) n'est
PAS utilise ici et n'est JAMAIS ecrit dans le depot soudan (voir README, chemin ASF documente).

Donnees : Copernicus Sentinel (ESA), "contains modified Copernicus Sentinel data".
S1 RTC : terrain-corrige (gamma0), distribue par Microsoft Planetary Computer.

Usage (chemins passes en ARGUMENTS) :
  python -I scripts/sentinel/fetch_dated.py <raw_out_dir> <layer_js_out>

  <raw_out_dir>  = data/raw/sentinel         (apercus PNG + dated_index.json)
  <layer_js_out> = data/layer_sentinel.js    (couche regeneree a partir du template)

Rien n'est ecrit hors de ces deux chemins.
"""
import sys
import os
import io
import json
import time
import datetime as dt
import urllib.request
import urllib.parse

STAC = "https://planetarycomputer.microsoft.com/api/stac/v1"
DATA = "https://planetarycomputer.microsoft.com/api/data/v1"
UA = "sudan-map-sentinel-dated/1.0 (personal OSINT map; keyless Planetary Computer)"

# --- Secteurs de focus -------------------------------------------------------
# center = [lon, lat] (doit etre couvert par la tuile MGRS retenue).
# view   = bbox d'affichage/apercu [minlon, minlat, maxlon, maxlat].
SECTORS = [
    {
        "key": "el_fasher",
        "label": "El-Fasher (Darfour Nord)",
        "center": [25.35, 13.63],
        "view": [25.15, 13.48, 25.72, 13.92],
        "radar": True,  # poussiere/nuages y masquent l'optique -> radar prioritaire
    },
    {
        "key": "kordofan",
        "label": "Kordofan — axe El-Obeid / Bara",
        "center": [30.20, 13.18],
        "view": [29.92, 12.98, 30.56, 13.48],
        "radar": False,
    },
]

# Rendu Sentinel-2 vraies couleurs (asset "visual" = TCI 10 m).
S2_RENDER = "assets=visual&asset_bidx=visual%7C1,2,3"
# Rendu Sentinel-1 RTC : backscatter VV en niveaux de gris (gamma0 power, 0..0.4 lineaire).
S1_RENDER = "assets=vv&colormap_name=gray&rescale=0,0.4"

S2_ATTR = ("Copernicus Sentinel-2 L2A (ESA) via Microsoft Planetary Computer — "
           "contains modified Copernicus Sentinel data")
S1_ATTR = ("Copernicus Sentinel-1 RTC (ESA, terrain-corrige gamma0) via Microsoft "
           "Planetary Computer — contains modified Copernicus Sentinel data")


def _get(url, timeout=90):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def _post(url, payload, timeout=90):
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, data=body,
        headers={"User-Agent": UA, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read())


def stac_search(payload, tries=5):
    last = None
    for k in range(tries):
        try:
            return _post(STAC + "/search", payload)
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(3 * (k + 1))
    raise RuntimeError("recherche STAC echouee: %r" % last)


def covers(bbox, lon, lat):
    return bbox[0] <= lon <= bbox[2] and bbox[1] <= lat <= bbox[3]


def contains_view(bbox, view, pad=0.0):
    """Vrai si l'item (bbox) contient toute la fenetre d'affichage view (4 coins)."""
    return (bbox[0] <= view[0] + pad and bbox[1] <= view[1] + pad
            and bbox[2] >= view[2] - pad and bbox[3] >= view[3] - pad)


def pick_s2(center, start, end, cmax=15, tile_id=None):
    """Scene S2 L2A la plus recente couvrant le centre, nuages < cmax.
    Si tile_id est fourni, on force cette tuile MGRS (grille de pixels identique)."""
    lon, lat = center
    feats = stac_search({
        "collections": ["sentinel-2-l2a"],
        "bbox": [lon - 0.25, lat - 0.25, lon + 0.25, lat + 0.25],
        "datetime": f"{start}T00:00:00Z/{end}T00:00:00Z",
        "query": {"eo:cloud_cover": {"lt": cmax}},
        "limit": 50,
        "sortby": [{"field": "properties.datetime", "direction": "desc"}],
    }).get("features", [])
    for f in feats:
        if not covers(f["bbox"], lon, lat):
            continue
        if tile_id and tile_id not in f["id"]:
            continue
        return f
    return None


def pick_s1(center, view, start, end):
    """Scene S1 RTC la plus recente qui couvre TOUTE la fenetre view (toutes conditions
    meteo : radar). A defaut, la plus recente couvrant au moins le centre."""
    lon, lat = center
    feats = stac_search({
        "collections": ["sentinel-1-rtc"],
        "bbox": view,
        "datetime": f"{start}T00:00:00Z/{end}T00:00:00Z",
        "limit": 30,
        "sortby": [{"field": "properties.datetime", "direction": "desc"}],
    }).get("features", [])
    for f in feats:  # priorite : couverture complete de la fenetre
        if contains_view(f["bbox"], view):
            return f
    for f in feats:  # repli : au moins le centre
        if covers(f["bbox"], lon, lat):
            return f
    return None


def tile_id_of(item):
    # S2 id: ..._T35PLR_... ; renvoie "T35PLR"
    for p in item["id"].split("_"):
        if len(p) == 6 and p[0] == "T" and p[1:3].isdigit():
            return p
    return None


def tiles_url(collection, item_id, render):
    return (f"{DATA}/item/tiles/WebMercatorQuad/{{z}}/{{x}}/{{y}}@1x?"
            f"collection={collection}&item={urllib.parse.quote(item_id)}&{render}&format=png")


def bbox_png_url(collection, item_id, view, render, w=768, h=576):
    bb = ",".join(f"{v:.4f}" for v in view)
    return (f"{DATA}/item/bbox/{bb}/{w}x{h}.png?"
            f"collection={collection}&item={urllib.parse.quote(item_id)}&{render}")


def download(url, path):
    data = _get(url)
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        sys.stderr.write("WARN: reponse non-PNG pour %s (%d octets)\n" % (path, len(data)))
    with open(path, "wb") as f:
        f.write(data)
    return len(data)


def date_of(item):
    return (item["properties"].get("datetime") or "")[:10]


def cloud_of(item):
    return round(float(item["properties"].get("eo:cloud_cover", -1)), 1)


def build(raw_dir, js_path):
    os.makedirs(raw_dir, exist_ok=True)
    today = dt.date.today()
    recent_start = (today - dt.timedelta(days=90)).isoformat()
    end = today.isoformat()

    scenes_dated = []
    change_pairs = []
    radar = None
    index = {"generated": today.isoformat(), "sectors": {}}

    for sec in SECTORS:
        info = {"label": sec["label"], "center": sec["center"], "view": sec["view"]}

        # --- S2 "after" : la plus recente peu nuageuse -----------------------
        after = pick_s2(sec["center"], recent_start, end, cmax=15)
        if after is None:  # fenetre plus large / seuil plus permissif
            after = pick_s2(sec["center"],
                            (today - dt.timedelta(days=180)).isoformat(), end, cmax=35)
        if after is None:
            sys.stderr.write("WARN: aucune scene S2 pour %s\n" % sec["key"])
            index["sectors"][sec["key"]] = info
            continue

        tid = tile_id_of(after)
        a_prev = f"s2_{sec['key']}_{date_of(after)}.png"
        download(bbox_png_url("sentinel-2-l2a", after["id"], sec["view"], S2_RENDER),
                 os.path.join(raw_dir, a_prev))

        after_rec = {
            "sector": sec["key"],
            "label": sec["label"],
            "date": date_of(after),
            "bbox": sec["view"],
            "center": sec["center"],
            "cloud": cloud_of(after),
            "item": after["id"],
            "tile": tid,
            "tilesUrl": tiles_url("sentinel-2-l2a", after["id"], S2_RENDER),
            "imageUrl": "data/raw/sentinel/" + a_prev,
            "source": "Copernicus Sentinel-2 L2A via Planetary Computer (keyless)",
        }
        scenes_dated.append(after_rec)
        info["s2_after"] = {k: after_rec[k] for k in ("date", "cloud", "item", "tile")}

        # --- S2 "before" : ~1 an avant, MEME tuile (grille de pixels identique) ---
        by0 = (today - dt.timedelta(days=400)).isoformat()
        by1 = (today - dt.timedelta(days=320)).isoformat()
        before = pick_s2(sec["center"], by0, by1, cmax=8, tile_id=tid)
        if before is None:
            before = pick_s2(sec["center"], by0, by1, cmax=20, tile_id=tid)
        if before is not None:
            b_prev = f"s2_{sec['key']}_{date_of(before)}.png"
            download(bbox_png_url("sentinel-2-l2a", before["id"], sec["view"], S2_RENDER),
                     os.path.join(raw_dir, b_prev))
            change_pairs.append({
                "key": f"{sec['key']}_dated",
                "label": f"{sec['label']} — {date_of(before)} -> {date_of(after)}",
                "sector": sec["key"],
                "bbox": sec["view"],
                "center": sec["center"],
                "before": {
                    "date": date_of(before), "cloud": cloud_of(before),
                    "item": before["id"],
                    "tilesUrl": tiles_url("sentinel-2-l2a", before["id"], S2_RENDER),
                    "imageUrl": "data/raw/sentinel/" + b_prev,
                },
                "after": {
                    "date": date_of(after), "cloud": cloud_of(after),
                    "item": after["id"],
                    "tilesUrl": after_rec["tilesUrl"],
                    "imageUrl": after_rec["imageUrl"],
                },
                "note": ("Comparatif visuel de DEUX acquisitions S2 DATEES et peu nuageuses, "
                         "meme tuile MGRS " + str(tid) + " (grille de pixels identique), "
                         "memes conditions saisonnieres (saison seche). INDICATIF : aucun indice "
                         "(NBR/NDVI) n'est calcule ici — simple bascule avant/apres pour l'oeil."),
            })
            info["s2_before"] = {"date": date_of(before), "cloud": cloud_of(before), "item": before["id"]}

        # --- S1 RTC (backscatter VV) ----------------------------------------
        if sec["radar"]:
            s1 = pick_s1(sec["center"], sec["view"], (today - dt.timedelta(days=60)).isoformat(), end)
            if s1 is None:
                s1 = pick_s1(sec["center"], sec["view"], (today - dt.timedelta(days=120)).isoformat(), end)
            if s1 is not None:
                s1_prev = f"s1_{sec['key']}_{date_of(s1)}.png"
                download(bbox_png_url("sentinel-1-rtc", s1["id"], sec["view"], S1_RENDER),
                         os.path.join(raw_dir, s1_prev))
                radar = {
                    "sector": sec["key"],
                    "label": sec["label"] + " — Sentinel-1 RTC (VV)",
                    "date": date_of(s1),
                    "bbox": sec["view"],
                    "center": sec["center"],
                    "item": s1["id"],
                    "orbit": s1["properties"].get("sat:orbit_state"),
                    "tilesUrl": tiles_url("sentinel-1-rtc", s1["id"], S1_RENDER),
                    "imageUrl": "data/raw/sentinel/" + s1_prev,
                    "source": "Copernicus Sentinel-1 RTC (gamma0) via Planetary Computer (keyless)",
                    "note": ("Backscatter radar VV (gamma0 terrain-corrige), niveaux de gris. "
                             "Le radar traverse poussiere et nuages (cle a El-Fasher). "
                             "C'est une mesure de retrodiffusion, PAS une interpretation de "
                             "positions/fortifications. Chemin alternatif ASF/HyP3 (jeton NASA "
                             "Earthdata) documente dans le README, NON utilise ici (keyless)."),
                }
                info["s1"] = {"date": date_of(s1), "item": s1["id"], "orbit": radar["orbit"]}

        index["sectors"][sec["key"]] = info

    index["scenes_dated"] = scenes_dated
    index["radar"] = radar
    with open(os.path.join(raw_dir, "dated_index.json"), "w") as f:
        json.dump(index, f, indent=2)

    render_js(js_path, scenes_dated, change_pairs, radar, today.isoformat())
    print("OK dated_index.json + %d scene(s) S2 datee(s), radar=%s"
          % (len(scenes_dated), bool(radar)))
    return index


# ---------------------------------------------------------------------------
# Generation de data/layer_sentinel.js (JS valide posant window.SUDAN.sentinel)
# ---------------------------------------------------------------------------
JS_TEMPLATE = r'''/* ---------------------------------------------------------------------------
 * data/layer_sentinel.js  —  COUCHE SENTINEL (imagerie satellite) pour la carte Soudan
 *
 * GENERE par scripts/sentinel/fetch_dated.py le %(generated)s — ne pas editer a la main.
 * Charge APRES data/bundle.js. N'ecrase rien : il ajoute window.SUDAN.sentinel.
 *
 * Sentinel-2 DATE (par defaut)  : acquisitions L2A reelles, peu nuageuses, DATEES, affichees
 *   via le tiler keyless de Microsoft Planetary Computer (tuiles XYZ signees par item cote
 *   serveur, jetons SAS anonymes). AUCUN compte, AUCUNE cle.
 * Sentinel-1 RADAR (VV)         : acquisition RTC (gamma0 terrain-corrige) recente sur
 *   El-Fasher — le radar traverse poussiere/nuages. Backscatter, pas une interpretation.
 * EOX annuel (repli)            : mosaique "Sentinel-2 cloudless" d'EOX, SANS cle, gardee
 *   en fond de repli etiquete "composite ANNUEL" (pas une date unique).
 *
 * Aucune cle n'est requise ni lue. Donnees : Copernicus Sentinel (ESA).
 * ------------------------------------------------------------------------- */
(function () {
  "use strict";
  window.SUDAN = window.SUDAN || {};

  // ---- Repli : mosaique annuelle EOX "Sentinel-2 cloudless" (keyless) -------
  function eoxUrl(year) {
    return ("https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-" + year +
            "_3857/default/g/{z}/{y}/{x}.jpg");
  }
  var EOX_ATTR =
    'Sentinel-2 cloudless (<a href="https://s2maps.eu">s2maps.eu</a>) par EOX IT Services GmbH — ' +
    "contient des donnees Copernicus Sentinel modifiees — " +
    '<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>';
  var EOX_LATEST = 2025;
  var EOX_YEARS = [2025, 2024, 2023, 2022, 2021, 2020];

  // ---- Donnees DATEES (Planetary Computer, keyless) — injectees par le script
  var SCENES_DATED = %(scenes_dated)s;
  var CHANGE_PAIRS = %(change_pairs)s;
  var RADAR = %(radar)s;

  var S2_ATTR = %(s2_attr)s;
  var S1_ATTR = %(s1_attr)s;

  // Scene datee par defaut = la plus recente parmi les secteurs.
  var DEFAULT_S2 = SCENES_DATED.length
    ? SCENES_DATED.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; })[0]
    : null;

  window.SUDAN.sentinel = {
    // --- Couche "Sentinel-2" PAR DEFAUT : DATEE quand dispo -------------------
    // (tiles.url pointe vers la scene datee la plus recente ; repli EOX si absent)
    tiles: DEFAULT_S2 ? {
      url: DEFAULT_S2.tilesUrl,
      attribution: S2_ATTR,
      dated: true,
      date: DEFAULT_S2.date,
      cloud: DEFAULT_S2.cloud,
      item: DEFAULT_S2.item,
      maxZoom: 16,
      maxNativeZoom: 14,
      minZoom: 1,
      tileSize: 256,
      bounds: [[8.6, 21.8], [22.2, 39.1]],
    } : {
      url: eoxUrl(EOX_LATEST),
      attribution: EOX_ATTR,
      dated: false,
      maxZoom: 16, maxNativeZoom: 14, minZoom: 1, tileSize: 256,
      bounds: [[8.6, 21.8], [22.2, 39.1]],
    },
    date: DEFAULT_S2 ? DEFAULT_S2.date : ("composite annuel " + EOX_LATEST),
    periode: DEFAULT_S2 ? ("acquisition datee " + DEFAULT_S2.date) : String(EOX_LATEST),
    key_required: false,
    source: DEFAULT_S2
      ? "Sentinel-2 L2A date via Microsoft Planetary Computer (tiler keyless)"
      : "EOX::Maps « Sentinel-2 cloudless » (WMTS public, sans cle)",

    // --- Sentinel-2 DATE : une ou deux scenes reelles par secteur ------------
    scenes_dated: SCENES_DATED,

    // --- Sentinel-1 RADAR (backscatter VV, RTC) ------------------------------
    radar: RADAR,

    // --- Comparatif avant/apres de DEUX scenes DATEES (indicatif) ------------
    change_pairs: CHANGE_PAIRS,

    // --- Repli EOX (mosaique ANNUELLE, etiquetee) ----------------------------
    fallback_annual: {
      tiles: {
        url: eoxUrl(EOX_LATEST), attribution: EOX_ATTR,
        maxZoom: 16, maxNativeZoom: 14, minZoom: 1, tileSize: 256,
      },
      kind: "composite annuel sans nuages (PAS une date unique)",
      composites: EOX_YEARS.map(function (y) {
        return { year: y, label: "S2 cloudless " + y, url: eoxUrl(y) };
      }),
      license: "CC BY 4.0 — Sentinel-2 cloudless by EOX (modified Copernicus Sentinel data).",
      source: "EOX::Maps « Sentinel-2 cloudless » — https://s2maps.eu",
      attribution: EOX_ATTR,
    },

    attribution_s2: S2_ATTR,
    attribution_s1: S1_ATTR,

    // --- Honnetete / limites -------------------------------------------------
    note:
      "Sentinel-2 vraies couleurs DATEES (acquisitions L2A reelles, nuages indiques) et " +
      "Sentinel-1 RADAR (backscatter VV, gamma0 terrain-corrige) sur les secteurs de focus, " +
      "via les STAC publics + le tiler keyless de Microsoft Planetary Computer (aucun compte, " +
      "aucune cle). La DATE affichee est le vrai jour d'acquisition. Le radar S1 traverse " +
      "poussiere/nuages (utile a El-Fasher) : c'est une mesure de retrodiffusion, PAS une " +
      "interpretation de positions/fortifications. Le comparatif avant/apres est une simple " +
      "bascule entre deux scenes datees (meme tuile MGRS, grille identique), etiquete INDICATIF : " +
      "AUCUN indice (NBR/NDVI) n'est calcule. La mosaique EOX annuelle reste en repli, etiquetee " +
      "« composite annuel ». GARDE-FOU DARFOUR : aucun produit derive ne cible des camps de " +
      "deplaces. ROADMAP (non livre ici) : proxy d'impacts NBR/NDVI-diff calcule sur paires " +
      "datees (demande rasterio + lecture fenetree des COG, cf. ukraine-feux/scripts/impacts_v1) ; " +
      "chemin radar alternatif ASF/HyP3 (jeton NASA Earthdata) documente dans le README, NON " +
      "utilise ici (le jeton n'est jamais ecrit dans ce depot).",

    generated: "%(generated)s",
  };
})();
'''


def render_js(js_path, scenes_dated, change_pairs, radar, generated):
    def j(x):
        return json.dumps(x, ensure_ascii=False, indent=2)
    body = JS_TEMPLATE % {
        "generated": generated,
        "scenes_dated": j(scenes_dated),
        "change_pairs": j(change_pairs),
        "radar": j(radar) if radar is not None else "null",
        "s2_attr": json.dumps(S2_ATTR, ensure_ascii=False),
        "s1_attr": json.dumps(S1_ATTR, ensure_ascii=False),
    }
    with open(js_path, "w") as f:
        f.write(body)


if __name__ == "__main__":
    a = sys.argv[1:]
    if len(a) < 2:
        sys.stderr.write(__doc__)
        sys.exit(2)
    build(a[0], a[1])
