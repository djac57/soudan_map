# Couche IMPACTS — proxy de changement de surface Sentinel-2 (El-Fasher)

Produit une **vraie** couche de changement à partir de **deux acquisitions Sentinel-2 L2A réelles**
sur El-Fasher (Darfour Nord), par différence d'indice **NBR** (dNBR). C'est un **proxy indicatif de
changement de surface**, PAS une preuve de destruction.

## Ce que ça fait

- Cherche, via le STAC public de **Microsoft Planetary Computer** (COG signés par jetons SAS
  anonymes — **aucun compte, aucune clé**), les scènes `sentinel-2-l2a` peu nuageuses couvrant la
  fenêtre urbaine d'El-Fasher.
- Retient **deux dates** : une **référence** (fenêtre 2024, avant l'intensification du siège) et une
  **récente** (2026-10). La moins nuageuse couvrant toute la fenêtre est choisie.
- Lit en fenêtre les bandes **B08 (NIR, 10 m)**, **B12 (SWIR, 20 m)** et **SCL** (masque nuages) via
  `rasterio` + `WarpedVRT` (reprojection/rééchantillonnage vers une grille UTM cible à 20 m :
  `average` pour B08 10→20 m, `nearest` pour B12/SCL).
- Calcule **NBR = (NIR − SWIR) / (NIR + SWIR)** par date (réflectance corrigée de l'offset BOA
  −1000 des baselines ≥ 04.00), puis **dNBR = NBR_avant − NBR_après** (positif = perte de
  végétation / sol dénudé / surface brûlée ou détruite).
- **Agrège** le dNBR en **cellules de 250 m** : une cellule est retenue si ≥ 50 % de ses pixels sont
  valides (non nuageux) ET si ≥ 30 % des pixels valides dépassent le seuil dNBR. Chaque cellule porte
  `dnbr_mean`, `dnbr_p90`, `frac_changed`, `n_valid_px`.

## Résultat livré (`data/layer_impacts.js`)

| | |
|---|---|
| Date **avant** | **2024-11-06** (nuages 0,0 %, S2A tuile T35PLR) |
| Date **après** | **2026-10-27** (nuages 0,0 %, S2C tuile T35PLR) |
| Indice / seuil | **dNBR**, seuil **0,27** (sévérité modérée-haute, par pixel) |
| Cellules de changement | **371** cellules de 250 m |
| Aire | **≈ 23,2 km²** |
| Couverture valide (2 dates) | 100 % (ciel clair aux deux dates) |

Fenêtre : `[25.28, 13.56, 25.42, 13.70]` (~15 km), **centrée sur le bâti** et sa périphérie immédiate.

## Pourquoi cette fenêtre (et pas ~0,2°)

Sur une fenêtre large (~0,2°, ~22 km), un essai a donné **1222 cellules / 76 km²**, mais
**97 %** se trouvaient dans les **champs péri-urbains**, pas dans le bâti : à cette échelle, le dNBR
entre deux dates est **dominé par la phénologie agricole saisonnière**, pas par les dégâts urbains. La
fenêtre a donc été resserrée sur la zone construite (peu de végétation), où un dNBR positif est un
proxy **bien plus fiable** d'un changement de surface réel (gravats, incendie, parcelles dénudées).

## Validation — test nul (plancher de bruit)

Deux dates **2024** pré-chute, à 25 jours d'écart (2024-10-12 vs 2024-11-06), même saison, où l'on
n'attend **pas** de destruction nette : **29 cellules / 1,8 km²**. La paire réelle sur ~2 ans en
donne **371 / 23 km²**, soit **~13×** le plancher. L'excès est donc largement au-dessus du bruit
saisonnier — mais il reste un **proxy** (voir limites).

## Limites honnêtes (garde-fou Darfour)

- **Proxy indicatif, pas une preuve.** Un dNBR positif = perte de végétation / dénudation / brûlis
  **ou** destruction — mais aussi labours, sécheresse, chantiers, poussière. À **corroborer** par
  d'autres sources.
- Les deux dates ont été **appariées en saison** (nov. vs oct., post-pluies) pour limiter le biais
  phénologique ; il en reste un résiduel (10 jours d'écart dans l'année, variabilité inter-annuelle
  de sécheresse sur 2 ans).
- **Agrégation en cellules de 250 m** : analyse de **surface urbaine agrégée**. **JAMAIS** de
  résolution pixel, **JAMAIS** de ciblage de camps de déplacés ni de localisation d'exactions.
- dNBR seuillé pour la sévérité de brûlis végétal ; en milieu urbain il capte le changement de
  surface sans en certifier la cause.

## Relancer

```
python -I scripts/impacts/compute_impacts.py <racine_projet> \
    --before-start 2024-09-15 --before-end 2024-11-30 \
    --after-start 2026-09-15 --after-end 2026-10-28 \
    --threshold 0.27
```

Écrit `data/raw/impacts/scenes.json` (métadonnées des 2 scènes),
`data/raw/impacts/change_cells.geojson` (cellules) et `data/layer_impacts.js`
(`window.SUDAN.impacts`, chargé après `data/bundle.js`).

## Dépendances

`rasterio`, `pystac-client`, `planetary-computer`, `pyproj`, `numpy` (env anaconda ;
`pip install rasterio pystac-client planetary-computer pyproj`). Réseau requis (STAC + COG publics).
**Aucune clé ni aucun secret** n'est lu ni écrit.

## Sources

Copernicus **Sentinel-2 L2A** (ESA) via **Microsoft Planetary Computer** (COG publics, jetons SAS
anonymes). Données Copernicus Sentinel.
