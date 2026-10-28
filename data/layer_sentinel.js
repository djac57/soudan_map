/* ---------------------------------------------------------------------------
 * data/layer_sentinel.js  —  COUCHE SENTINEL (imagerie satellite) pour la carte Soudan
 *
 * Chargé APRÈS data/bundle.js. N'écrase rien : il ajoute window.SUDAN.sentinel.
 *
 * Palier 1 (tuiles)   : mosaïque vraies-couleurs Sentinel-2 "cloudless" d'EOX,
 *                       SANS clé, licence claire (CC BY 4.0 / Copernicus Sentinel).
 * Palier 2 (scenes)   : vues focus El-Fasher et Kordofan (mêmes tuiles keyless +
 *                       aperçus JPEG réels téléchargés via WMS dans data/raw/sentinel/).
 * Palier 3 (proxy)    : PAS de détection d'impacts/brûlures calculée ici (voir note) ;
 *                       seul un comparatif visuel before/after de composites annuels
 *                       est fourni, étiqueté "indicatif", et UNIQUEMENT sur l'axe
 *                       logistique du Kordofan (jamais sur El-Fasher / camps — garde-fou).
 *
 * Aucune clé n'est requise ni lue : EOX::Maps est un service anonyme public.
 * ------------------------------------------------------------------------- */
(function () {
  "use strict";

  window.SUDAN = window.SUDAN || {};

  // Modèle d'URL XYZ Leaflet pour une année de la mosaïque S2 cloudless d'EOX.
  // Format WMTS/REST EOX : .../{layer}_3857/default/g/{z}/{y}/{x}.jpg  (ordre z/y/x)
  function eoxUrl(year) {
    return (
      "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-" +
      year +
      "_3857/default/g/{z}/{y}/{x}.jpg"
    );
  }

  var ATTRIBUTION =
    'Sentinel-2 cloudless (<a href="https://s2maps.eu">s2maps.eu</a>) par EOX IT Services GmbH — ' +
    "contient des données Copernicus Sentinel modifiées — " +
    '<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>';

  var LICENSE =
    "CC BY 4.0 — Sentinel-2 cloudless by EOX IT Services GmbH " +
    "(contains modified Copernicus Sentinel data). Attribution obligatoire.";

  var LATEST = 2025; // mosaïque annuelle la plus récente disponible chez EOX

  // Années de mosaïque disponibles (vérifiées via WMTSCapabilities EOX, 2026-10-27).
  var YEARS = [2025, 2024, 2023, 2022, 2021, 2020];

  function composite(year) {
    return {
      year: year,
      label: "S2 cloudless " + year,
      url: eoxUrl(year),
    };
  }

  // Centre [lon, lat] d'une bbox [minlon, minlat, maxlon, maxlat].
  function centerOf(b) {
    return [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2];
  }

  var BBOX_EL_FASHER = [24.6, 12.9, 26.1, 14.3]; // focus Darfour Nord
  var BBOX_KORDOFAN = [29.4, 12.4, 31.4, 14.4]; // focus axe El-Obeid / Bara

  window.SUDAN.sentinel = {
    // --- Palier 1 : couche de tuiles par défaut (la plus récente) -------------
    tiles: {
      url: eoxUrl(LATEST),
      attribution: ATTRIBUTION,
      maxZoom: 16, // Leaflet sur-échantillonne au-delà du natif
      maxNativeZoom: 14, // ~10 m/px natif de Sentinel-2
      minZoom: 1,
      tileSize: 256,
      bounds: [
        [8.6, 21.8],
        [22.2, 39.1],
      ], // bbox Soudan [lat,lon] (indicatif pour Leaflet)
    },
    date: "composite annuel " + LATEST,
    periode: String(LATEST),
    key_required: false,
    source:
      "EOX::Maps « Sentinel-2 cloudless » (WMTS public, sans clé) — https://s2maps.eu",
    license: LICENSE,

    // Toutes les années disponibles (pour un sélecteur / comparaison temporelle).
    composites: YEARS.map(composite),

    // --- Palier 2 : scènes centrées sur les secteurs de focus -----------------
    // Mêmes tuiles keyless, cadrées sur chaque focus ; aperçus JPEG réels
    // (téléchargés via EOX WMS par scripts/sentinel/fetch_scenes.py).
    scenes: [
      {
        key: "el_fasher",
        label: "El-Fasher (Darfour Nord)",
        bbox: BBOX_EL_FASHER,
        center: centerOf(BBOX_EL_FASHER),
        zoom: 10,
        date: "composite annuel " + LATEST,
        source: "EOX S2 cloudless " + LATEST,
        tilesUrl: eoxUrl(LATEST),
        preview: "data/raw/sentinel/el_fasher_s2cloudless-2025.jpg",
      },
      {
        key: "kordofan",
        label: "Kordofan — axe El-Obeid / Bara",
        bbox: BBOX_KORDOFAN,
        center: centerOf(BBOX_KORDOFAN),
        zoom: 10,
        date: "composite annuel " + LATEST,
        source: "EOX S2 cloudless " + LATEST,
        tilesUrl: eoxUrl(LATEST),
        preview: "data/raw/sentinel/kordofan_s2cloudless-2025.jpg",
      },
    ],

    // --- Palier 3 : comparatif visuel "indicatif" (PAS un indice calculé) -----
    // Avant/après de deux composites ANNUELS sur l'axe logistique du Kordofan.
    // Ce n'est PAS une détection de brûlures/combats (ni NBR ni NDVI diff) :
    // c'est un simple toggle d'imagerie pour l'œil. Restreint au Kordofan ;
    // jamais El-Fasher / camps de déplacés (garde-fou Darfour).
    change_pairs: [
      {
        key: "kordofan_2023_2025",
        label: "Kordofan 2023 → 2025 (indicatif, composites annuels)",
        sector: "kordofan",
        bbox: BBOX_KORDOFAN,
        center: centerOf(BBOX_KORDOFAN),
        before: {
          year: 2023,
          url: eoxUrl(2023),
          preview: "data/raw/sentinel/kordofan_s2cloudless-2023.jpg",
        },
        after: {
          year: 2025,
          url: eoxUrl(2025),
          preview: "data/raw/sentinel/kordofan_s2cloudless-2025.jpg",
        },
        note:
          "Comparatif visuel indicatif de mosaïques annuelles sans nuages. " +
          "AUCUN indice de brûlure/combat n'est calculé. Les composites peuvent " +
          "mélanger des dates différentes d'une année à l'autre.",
      },
    ],

    // --- Honnêteté / limites --------------------------------------------------
    note:
      "Imagerie Sentinel-2 vraies couleurs, SANS clé, via EOX::Maps « Sentinel-2 " +
      "cloudless » (CC BY 4.0, données Copernicus Sentinel modifiées). " +
      "IMPORTANT : ce sont des MOSAÏQUES ANNUELLES sans nuages (composites), PAS " +
      "des acquisitions datées uniques — la date affichée est l'année du composite, " +
      "pas un jour de prise de vue. Résolution ~10 m/px (zoom natif max ~14). " +
      "Le vrai pipeline de détection d'impacts par asymétrie de texture (type Ukraine) " +
      "demande des mois de travail et des scènes datées appariées : CE N'EST PAS " +
      "l'objectif ici, et aucune analyse fine de positions/fortifications n'est faite. " +
      "GARDE-FOU DARFOUR : aucun produit dérivé ne cible des camps de déplacés ; " +
      "le comparatif before/after est limité à l'axe logistique du Kordofan. " +
      "ROADMAP (non livré) : des scènes datées réelles nécessiteraient un jeton " +
      "Copernicus Data Space / SentinelHub (absent ici — seul un identifiant NASA " +
      "Earthdata existe) ; l'alternative keyless NASA GIBS HLS (S30 = Sentinel-2 daté) " +
      "a une couverture trop lacunaire sur le Soudan (tuiles vides testées le 2026-10-27) " +
      "pour une couche statique fiable. Un proxy NBR/NDVI-diff « cicatrices » reste à " +
      "faire proprement sur paires datées, étiqueté « indicatif ».",

    generated: "2026-10-27",
  };
})();
