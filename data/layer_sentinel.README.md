# Couche Sentinel — `data/layer_sentinel.js`

Imagerie satellite pour la carte Soudan. Fichier chargé **après** `data/bundle.js`
par un `<script>` ; il ne modifie rien, il ajoute seulement `window.SUDAN.sentinel`.

**`layer_sentinel.js` est GÉNÉRÉ** par `scripts/sentinel/fetch_dated.py` (ne pas
éditer à la main) : il embarque des **acquisitions Sentinel-2 DATÉES** réelles et
une **acquisition Sentinel-1 RADAR** datée, le tout **SANS AUCUN compte ni clé**.

## Nouveauté : du daté, plus seulement de l'annuel

Avant : mosaïque EOX « Sentinel-2 cloudless » **annuelle** uniquement (la « date »
affichée était l'année du composite). Désormais la couche **« Sentinel-2 » par
défaut pointe vers une acquisition RÉELLE DATÉE** quand disponible ; l'EOX annuel
reste en **repli étiqueté** « composite annuel ».

## Accès keyless (identique à l'Ukraine)

- **STAC public Microsoft Planetary Computer** (`planetarycomputer.microsoft.com/api/stac/v1`),
  collections `sentinel-2-l2a` et `sentinel-1-rtc` — recherche REST **sans clé**.
- **Affichage** : le **tiler** Planetary Computer (`api/data/v1`) **signe chaque
  tuile par item côté serveur** (jetons SAS anonymes) → URL XYZ Leaflet **keyless**,
  par scène datée. Aperçus PNG bornés par secteur via `/item/bbox/.../{W}x{H}.png`.
- **Aucune clé n'est lue ni écrite.** `key_required: false`. Le jeton **NASA
  Earthdata** (`~/.config/earthdata/`) **n'est PAS utilisé** et **n'est JAMAIS
  écrit** dans ce dépôt (voir « Radar — chemin ASF » plus bas).

## Ce qui est exposé

`window.SUDAN.sentinel = { tiles, date, periode, key_required, source,
scenes_dated[], radar, change_pairs[], fallback_annual, attribution_s2,
attribution_s1, note, generated }`

- **tiles** — couche Leaflet **par défaut**. `tiles.dated === true` et pointe vers
  la scène datée la plus récente (XYZ `{z}/{x}/{y}`, `date`, `cloud`, `item`,
  `attribution`). Si aucune scène datée n'est trouvée, repli automatique sur EOX
  (`tiles.dated === false`).
- **scenes_dated[]** — `{sector, label, date, bbox, center, cloud, item, tile,
  tilesUrl, imageUrl, source}` : 1 scène **datée** S2 vraies couleurs par secteur
  de focus (El-Fasher, Kordofan). `tilesUrl` = tuiles XYZ keyless ; `imageUrl` =
  aperçu PNG borné (`data/raw/sentinel/`).
- **radar** — `{sector, label, date, bbox, center, item, orbit, tilesUrl, imageUrl,
  source, note}` : **Sentinel-1 RTC**, **backscatter VV** (gamma0 terrain-corrigé,
  niveaux de gris, `rescale 0–0.4`) sur **El-Fasher** (le radar traverse
  poussière/nuages). C'est une **mesure de rétrodiffusion**, pas une interprétation
  de positions.
- **change_pairs[]** — comparatif **avant/après de DEUX scènes DATÉES** (même tuile
  MGRS = grille de pixels identique, même saison sèche), étiqueté **INDICATIF** :
  simple bascule pour l'œil, **aucun indice NBR/NDVI n'est calculé**.
- **fallback_annual** — mosaïque EOX annuelle (`tiles`, `composites[]` 2020→2025,
  `license` CC BY 4.0) en **repli**, étiquetée « composite annuel ».

## Honnêteté / limites

- La **date affichée est le vrai jour d'acquisition** (S2 : date + % nuages réels ;
  S1 : date + orbite). Résolution S2 ~10 m/px (zoom natif max ~14).
- **Radar S1 = backscatter VV**, pas une interprétation de positions/fortifications.
- **Garde-fou Darfour** : aucun produit dérivé ne cible des camps de déplacés.
- **EOX annuel** reste en repli, étiqueté « composite annuel » (dates mélangées).

## Radar — chemin ASF (documenté, NON utilisé ici)

L'alternative demandée (ASF + jeton NASA Earthdata `~/.config/earthdata/` → HyP3
RTC) est **documentée mais non utilisée** : Planetary Computer fournit déjà des
**Sentinel-1 RTC** keyless (gamma0 terrain-corrigé) prêts à afficher, sans jeton et
sans attendre un job HyP3. Le jeton Earthdata **n'est jamais écrit dans `soudan/`**.
Chemin ASF si besoin un jour : `api.daac.asf.alaska.edu/services/search/param`
(recherche) puis HyP3 `RTC_GAMMA` (traitement), identifiants lus hors dépôt.

## Roadmap (non livré)

- **Proxy d'impacts NBR/NDVI-diff** calculé sur paires datées (le vrai début du
  pipeline Ukraine) : demande `rasterio` + lecture fenêtrée des COG, cf.
  `~/Desktop/perso/ukraine-feux/scripts/impacts_v1/fetch.py`. Ici seul un
  comparatif **visuel** daté (`change_pairs`) est fourni, étiqueté indicatif.

## Scripts & données

- `scripts/sentinel/fetch_dated.py` — **pipeline principal** (keyless, `python -I`,
  chemins en arguments) : interroge les STAC publics, choisit les scènes datées
  récentes peu nuageuses (S2) et une S1 RTC couvrant le secteur, construit les URL
  de tuiles keyless, télécharge les aperçus PNG, écrit `dated_index.json` et
  **régénère `data/layer_sentinel.js`**.
  Ex. : `python -I scripts/sentinel/fetch_dated.py data/raw/sentinel data/layer_sentinel.js`
- `scripts/sentinel/fetch_scenes.py` — (hérité) aperçus EOX annuels keyless via WMS.
- `data/raw/sentinel/` — aperçus PNG réels (données externes) + `dated_index.json`
  (métadonnées : items, dates, nébulosité, bbox, orbite).

## Intégration

```html
<script src="data/bundle.js"></script>
<script src="data/layer_sentinel.js"></script>
<script>
  var s = window.SUDAN.sentinel;
  // Couche Sentinel-2 datée par défaut (repli EOX si s.tiles.dated === false)
  L.tileLayer(s.tiles.url, {
    attribution: s.tiles.attribution,
    maxZoom: s.tiles.maxZoom, maxNativeZoom: s.tiles.maxNativeZoom,
  }); // .addTo(map)  — libellé : "Sentinel-2 " + s.tiles.date
  // Radar : L.tileLayer(s.radar.tilesUrl, { attribution: s.attribution_s1 })
</script>
```
