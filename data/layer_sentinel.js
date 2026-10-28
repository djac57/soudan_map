/* ---------------------------------------------------------------------------
 * data/layer_sentinel.js  —  COUCHE SENTINEL (imagerie satellite) pour la carte Soudan
 *
 * GENERE par scripts/sentinel/fetch_dated.py le 2026-10-28 — ne pas editer a la main.
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
  var SCENES_DATED = [
  {
    "sector": "el_fasher",
    "label": "El-Fasher (Darfour Nord)",
    "date": "2026-10-27",
    "bbox": [
      25.15,
      13.48,
      25.72,
      13.92
    ],
    "center": [
      25.35,
      13.63
    ],
    "cloud": 0.0,
    "item": "S2C_MSIL2A_20261027T084041_R064_T35PLR_20261027T135650",
    "tile": "T35PLR",
    "tilesUrl": "https://planetarycomputer.microsoft.com/api/data/v1/item/tiles/WebMercatorQuad/{z}/{x}/{y}@1x?collection=sentinel-2-l2a&item=S2C_MSIL2A_20261027T084041_R064_T35PLR_20261027T135650&assets=visual&asset_bidx=visual%7C1,2,3&format=png",
    "imageUrl": "data/raw/sentinel/s2_el_fasher_2026-10-27.png",
    "source": "Copernicus Sentinel-2 L2A via Planetary Computer (keyless)"
  },
  {
    "sector": "kordofan",
    "label": "Kordofan — axe El-Obeid / Bara",
    "date": "2026-10-26",
    "bbox": [
      29.92,
      12.98,
      30.56,
      13.48
    ],
    "center": [
      30.2,
      13.18
    ],
    "cloud": 0.0,
    "item": "S2B_MSIL2A_20261026T082029_R121_T35PRQ_20261026T135212",
    "tile": "T35PRQ",
    "tilesUrl": "https://planetarycomputer.microsoft.com/api/data/v1/item/tiles/WebMercatorQuad/{z}/{x}/{y}@1x?collection=sentinel-2-l2a&item=S2B_MSIL2A_20261026T082029_R121_T35PRQ_20261026T135212&assets=visual&asset_bidx=visual%7C1,2,3&format=png",
    "imageUrl": "data/raw/sentinel/s2_kordofan_2026-10-26.png",
    "source": "Copernicus Sentinel-2 L2A via Planetary Computer (keyless)"
  }
];
  var CHANGE_PAIRS = [
  {
    "key": "el_fasher_dated",
    "label": "El-Fasher (Darfour Nord) — 2025-12-11 -> 2026-10-27",
    "sector": "el_fasher",
    "bbox": [
      25.15,
      13.48,
      25.72,
      13.92
    ],
    "center": [
      25.35,
      13.63
    ],
    "before": {
      "date": "2025-12-11",
      "cloud": 0.2,
      "item": "S2C_MSIL2A_20251211T084351_R064_T35PLR_20251211T122815",
      "tilesUrl": "https://planetarycomputer.microsoft.com/api/data/v1/item/tiles/WebMercatorQuad/{z}/{x}/{y}@1x?collection=sentinel-2-l2a&item=S2C_MSIL2A_20251211T084351_R064_T35PLR_20251211T122815&assets=visual&asset_bidx=visual%7C1,2,3&format=png",
      "imageUrl": "data/raw/sentinel/s2_el_fasher_2025-12-11.png"
    },
    "after": {
      "date": "2026-10-27",
      "cloud": 0.0,
      "item": "S2C_MSIL2A_20261027T084041_R064_T35PLR_20261027T135650",
      "tilesUrl": "https://planetarycomputer.microsoft.com/api/data/v1/item/tiles/WebMercatorQuad/{z}/{x}/{y}@1x?collection=sentinel-2-l2a&item=S2C_MSIL2A_20261027T084041_R064_T35PLR_20261027T135650&assets=visual&asset_bidx=visual%7C1,2,3&format=png",
      "imageUrl": "data/raw/sentinel/s2_el_fasher_2026-10-27.png"
    },
    "note": "Comparatif visuel de DEUX acquisitions S2 DATEES et peu nuageuses, meme tuile MGRS T35PLR (grille de pixels identique), memes conditions saisonnieres (saison seche). INDICATIF : aucun indice (NBR/NDVI) n'est calcule ici — simple bascule avant/apres pour l'oeil."
  },
  {
    "key": "kordofan_dated",
    "label": "Kordofan — axe El-Obeid / Bara — 2025-12-10 -> 2026-10-26",
    "sector": "kordofan",
    "bbox": [
      29.92,
      12.98,
      30.56,
      13.48
    ],
    "center": [
      30.2,
      13.18
    ],
    "before": {
      "date": "2025-12-10",
      "cloud": 0.0,
      "item": "S2B_MSIL2A_20251210T082239_R121_T35PRQ_20251212T112431",
      "tilesUrl": "https://planetarycomputer.microsoft.com/api/data/v1/item/tiles/WebMercatorQuad/{z}/{x}/{y}@1x?collection=sentinel-2-l2a&item=S2B_MSIL2A_20251210T082239_R121_T35PRQ_20251212T112431&assets=visual&asset_bidx=visual%7C1,2,3&format=png",
      "imageUrl": "data/raw/sentinel/s2_kordofan_2025-12-10.png"
    },
    "after": {
      "date": "2026-10-26",
      "cloud": 0.0,
      "item": "S2B_MSIL2A_20261026T082029_R121_T35PRQ_20261026T135212",
      "tilesUrl": "https://planetarycomputer.microsoft.com/api/data/v1/item/tiles/WebMercatorQuad/{z}/{x}/{y}@1x?collection=sentinel-2-l2a&item=S2B_MSIL2A_20261026T082029_R121_T35PRQ_20261026T135212&assets=visual&asset_bidx=visual%7C1,2,3&format=png",
      "imageUrl": "data/raw/sentinel/s2_kordofan_2026-10-26.png"
    },
    "note": "Comparatif visuel de DEUX acquisitions S2 DATEES et peu nuageuses, meme tuile MGRS T35PRQ (grille de pixels identique), memes conditions saisonnieres (saison seche). INDICATIF : aucun indice (NBR/NDVI) n'est calcule ici — simple bascule avant/apres pour l'oeil."
  }
];
  var RADAR = {
  "sector": "el_fasher",
  "label": "El-Fasher (Darfour Nord) — Sentinel-1 RTC (VV)",
  "date": "2026-10-20",
  "bbox": [
    25.15,
    13.48,
    25.72,
    13.92
  ],
  "center": [
    25.35,
    13.63
  ],
  "item": "S1C_IW_GRDH_1SDV_20261020T040451_20261020T040516_009963_013DD2_rtc",
  "orbit": "descending",
  "tilesUrl": "https://planetarycomputer.microsoft.com/api/data/v1/item/tiles/WebMercatorQuad/{z}/{x}/{y}@1x?collection=sentinel-1-rtc&item=S1C_IW_GRDH_1SDV_20261020T040451_20261020T040516_009963_013DD2_rtc&assets=vv&colormap_name=gray&rescale=0,0.4&format=png",
  "imageUrl": "data/raw/sentinel/s1_el_fasher_2026-10-20.png",
  "source": "Copernicus Sentinel-1 RTC (gamma0) via Planetary Computer (keyless)",
  "note": "Backscatter radar VV (gamma0 terrain-corrige), niveaux de gris. Le radar traverse poussiere et nuages (cle a El-Fasher). C'est une mesure de retrodiffusion, PAS une interpretation de positions/fortifications. Chemin alternatif ASF/HyP3 (jeton NASA Earthdata) documente dans le README, NON utilise ici (keyless)."
};

  var S2_ATTR = "Copernicus Sentinel-2 L2A (ESA) via Microsoft Planetary Computer — contains modified Copernicus Sentinel data";
  var S1_ATTR = "Copernicus Sentinel-1 RTC (ESA, terrain-corrige gamma0) via Microsoft Planetary Computer — contains modified Copernicus Sentinel data";

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

    generated: "2026-10-28",
  };
})();
