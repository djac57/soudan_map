# `window.SUDAN.pipelines` — couche OLÉODUCS (pétrole), **vraie géométrie de tracé**

Couche **additive** du site Soudan : les deux **oléoducs** qui évacuent le brut du
**Soudan du Sud (enclavé)** à travers le Soudan jusqu'à **Port-Soudan** (mer Rouge),
plus leurs **terminaux**. Chargée **après** `data/bundle.js`, elle pose
`window.SUDAN.pipelines` **sans toucher à aucun autre fichier**.

> Distincte de la couche `layer_resources.js`, qui contient un tracé **SCHÉMATIQUE**
> (quelques points indicatifs). Ici le tracé est **réel**, issu d'OpenStreetMap.

```html
<!-- à ajouter dans index.html, APRÈS bundle.js, avec les autres couches -->
<script src="data/layer_pipelines.js"></script>
```

Date de génération : **2026-10-28**.

## Contexte stratégique (sourcé)
Le **Soudan du Sud est enclavé** ; la quasi-totalité de son brut transite par deux
oléoducs à travers le Soudan jusqu'à **Port-Soudan**, et le **Soudan perçoit des
droits de transit**. Ces tubes traversent des **zones de conflit** :
- **Greater Nile (GNPOC)** ~1 600 km : bassin de **Muglad** (champs d'**Unity/Heglig**)
  → Port-Soudan. Selon **Al Jazeera** et **Sudan Tribune** (8 déc. 2025), les **FSR**
  ont pris le champ de **Heglig**, nœud clé ; des droits de passage (~4 USD/baril)
  seraient prélevés en zone FSR (Sudan Tribune).
- **Petrodar (PDOC)** ~1 380 km : bassin de **Melut** (champs de **Palogue**, Haut-Nil),
  brut **« Dar Blend »** → Port-Soudan. En **2024**, une **rupture** du réseau d'export
  (zone affectée par la guerre) a entraîné une **force majeure** et une chute de la
  production (**Reuters**, **Sudan Tribune**).

## Prudence / garde-fous
- **Rien d'inventé** : la géométrie est tracée depuis **OpenStreetMap** (ODbL).
- **Aucune ligne de contrôle**, **aucun suivi d'unités**, **aucune donnée nominative**
  (garde-fou Darfour respecté) — ce sont des infrastructures d'export, **non temps réel**.
- Sources ouvertes, **licences citées** : **OSM = ODbL** (attribution requise),
  **Global Energy Monitor = CC BY 4.0**, Wikipedia = CC BY-SA, presse citée.

## Contenu de l'objet
```
window.SUDAN.pipelines = {
  generated,
  lines:     [ { name, operator, length_km, length_km_osm, substance:"oil",
                 status, geometry, geometry_quality, source, note } ],
  terminals: [ { name, lon, lat, type, source } ],
  note, sources, counts
}
```

### `lines[]`
| champ | sens |
|---|---|
| `name`, `operator` | nom de l'oléoduc et opérateur |
| `length_km` | longueur **documentée** (GNPOC ~1 600, Petrodar ~1 380) |
| `length_km_osm` | longueur **mesurée** sur la géométrie OSM tracée (recollée, avant simplification) |
| `substance` | `"oil"` |
| `status` | état d'exploitation (perturbations de guerre, sourcé dans `note`) |
| `geometry` | GeoJSON `LineString` / `MultiLineString`, coordonnées `[lon, lat]` |
| `geometry_quality` | `"osm"` = géométrie réelle OpenStreetMap |
| `source` | provenance de la géométrie + de l'attribution |
| `note` | rôle / transit / impact de la guerre, **sourcé** |

### `terminals[]`
Points `{ name, lon, lat, type, source }` — ancrés sur les **extrémités nord** des
tracés OSM à **Port-Soudan** (débouchés GNPOC et Petrodar). Positions **approximatives**.

## Méthode (géométrie)
1. **Fetch** `scripts/pipelines/fetch_pipelines.py` → Overpass poli (une requête à la
   fois, backoff, rotation de miroirs, `User-Agent` descriptif) : relation OSM
   **« Greater Nile Oil Pipeline »** ([`Q1757784`](https://www.openstreetmap.org/relation/4195758))
   + ses **voies membres** (`man_made=pipeline`, `substance=oil`), bbox Soudan +
   Soudan du Sud. Brut déposé dans `data/raw/pipelines/` (**git-ignoré**).
2. **Build** `scripts/pipelines/build_pipelines.py` → les voies sont **recollées** par
   nœud partagé en corridors continus, puis **simplifiées** (Ramer-Douglas-Peucker
   ~1 km). Sortie : `data/layer_pipelines.js` (objet global, ~10 Ko, 160 sommets).

```bash
python3 -I scripts/pipelines/fetch_pipelines.py data/raw/pipelines
python3 -I scripts/pipelines/build_pipelines.py data/raw/pipelines data/layer_pipelines.js
```

## ⚠️ Attribution GNPOC / Petrodar — limite importante
Dans **OpenStreetMap**, **tout** le réseau est étiqueté **« Greater Nile Oil
Pipeline »** (opérateur GNPOC), **y compris l'antenne orientale** issue du bassin de
Melut (une voie y porte même un *fixme* OSM `uncertain crossing Rabak`). Il **n'existe
pas** de tracé nommé « Petrodar » dans OSM.

La **géométrie** restituée ici est donc **100 % OSM** (`geometry_quality:"osm"`). En
revanche, la **séparation en deux oléoducs nommés** est une **INFÉRENCE documentée** :
les corridors recollés sont répartis selon l'**origine du tracé** (longitude du point
le plus au sud) — bassin de **Muglad** (`lon < 31` → **GNPOC**) vs bassin de **Melut**
(`lon ≥ 31` → **Petrodar**) — conformément à la réalité documentée (Wikipedia, Global
Energy Monitor) : GNPOC dessert Unity/Heglig, Petrodar dessert Palogue/Melut.
**Corroboration** : l'antenne de Melut mesure ~**1 392 km** sur OSM, très proche des
**~1 380 km** documentés de Petrodar. Cette limite est répétée dans chaque `note`.

## Limites
- Couverture OSM possiblement **incomplète** (quelques voies « Greater Nile » hors
  relation ne sont pas reprises ; antennes de collecte partielles).
- **Attribution Petrodar inférée** (voir ci-dessus), pas affirmée par OSM.
- **Terminaux approximatifs** (ancrés sur l'extrémité nord des tracés, pas sur un nœud
  OSM de terminal vérifié).
- **Statuts d'exploitation très mouvants** (dates indiquées par enregistrement).

## Sources
- **OpenStreetMap** — relation `Q1757784` + voies `man_made=pipeline` (géométrie) —
  **ODbL 1.0**, © contributeurs OpenStreetMap, **attribution requise**.
- **Global Energy Monitor** — Global Oil Infrastructure Tracker (existence, opérateurs,
  longueurs ; référence croisée) — **CC BY 4.0**.
- **Wikipedia** — « Greater Nile Oil Pipeline », « Petrodar » — CC BY-SA 4.0.
- **Al Jazeera** (prise de Heglig par les FSR, 8 déc. 2025) ; **Sudan Tribune** (transit,
  contrôle du corridor) ; **Reuters** (rupture / force majeure 2024) — presse citée.

## Ownership
Fichiers **créés** par cet agent, et **uniquement** ceux-ci :
`data/layer_pipelines.js`, `data/layer_pipelines.README.md`, `scripts/pipelines/`,
`data/raw/pipelines/`. **Aucun autre fichier touché** (notamment pas `index.html` ni
`layer_resources.js`).

> **À faire par le propriétaire d'`index.html`** : ajouter
> `<script src="data/layer_pipelines.js"></script>` **après** `data/bundle.js`
> (par ex. juste après la ligne `layer_resources.js`).
