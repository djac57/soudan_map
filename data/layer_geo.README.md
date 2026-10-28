# `window.SUDAN.geo` — couche GÉOGRAPHIE PHYSIQUE & INFRASTRUCTURES

Couche **de contexte** du site Soudan : **relief** (ombrage) + **infrastructures**
(routes majeures, aéroports, ports, passages frontaliers). Chargée **après**
`data/bundle.js`, strictement **additive** : elle pose `window.SUDAN.geo` sans
toucher à aucun autre fichier.

```html
<!-- à ajouter dans index.html, après bundle.js, avec les autres couches -->
<script src="data/layer_geo.js"></script>
```

Date de génération : **2026-10-28**.

## Cadre & prudence
Objectif = donner le **décor physique et logistique** du conflit (le relief, les
axes, les points d'entrée/sortie), **pas** un suivi opérationnel.

- **Aucune ligne de contrôle**, **aucun mouvement d'unité**, **aucune donnée
  nominative** — garde-fou Darfour respecté.
- Données **ouvertes et publiques** d'infrastructure, **non temps réel**.
- Sources ouvertes, **licences citées** (OSM = ODbL, attribution requise).
- **Rien d'inventé** : géométrie OpenStreetMap, reliefs *keyless*, et une courte
  liste curée de ports/passages **nommés** dont les coordonnées sont posées sur
  la ligne frontière (ou recoupées sur un nœud OSM `barrier=border_control`).

## Contenu de l'objet
```
window.SUDAN.geo = {
  generated, relief, roads, airports, ports, crossings, note, sources
}
```

### `relief` — tuiles d'ombrage KEYLESS
```
relief.tiles = { url, attribution, maxZoom, maxNativeZoom, opacity }
relief.alt   = { url, subdomains, attribution, maxZoom, note }  // repli
```
- **Source retenue : Esri World Hillshade** (`.../Elevation/World_Hillshade/
  MapServer/tile/{z}/{y}/{x}`) — **sans clé**, vérifiée sur le Soudan (Darfour,
  Khartoum, Port-Soudan, zoom 6→12 : HTTP 200, JPEG). Attention à l'ordre des
  axes : Esri est en **`{z}/{y}/{x}`** (et non `{z}/{x}/{y}`). `opacity: 0.55`
  suggéré pour poser l'ombrage **sous** les couches de données sans les écraser.
- **Repli : OpenTopoMap** (`{s}.tile.opentopomap.org/{z}/{x}/{y}.png`, CC-BY-SA)
  — respecter sa **politique d'usage** (usage léger). Fourni dans `relief.alt`,
  non activé par défaut.

### `roads` — axes MAJEURS (array de corridors)
```
{ cls:"trunk"|"motorway", ref:string|null, km:number, coords:[[lon,lat],…] }
```
- **Source** : OpenStreetMap via Overpass, **`highway=motorway|trunk` uniquement**
  (axes stratégiques nationaux), bbox Soudan puis **clip** sur le polygone
  frontière Soudan (geoBoundaries ADM0, >50 % des sommets à l'intérieur).
- **Traitement léger** : tronçons OSM **recousus** en corridors par nœud commun,
  géométrie **simplifiée** (Ramer-Douglas-Peucker ~1 km), corridors **< 25 km
  écartés**. Résultat : **39 corridors**, ~6 570 km, coordonnées à 4 décimales.
- Couvre les grands axes : El-Obeid↔Nyala↔El-Fasher (Darfour/Kordofan), vallée
  du Nil / A1 vers l'Égypte, axe vers Port-Soudan, Gedaref/Kassala, etc.
- **Le réseau secondaire (`primary`) est VOLONTAIREMENT exclu** (8 000+ tronçons)
  pour rester léger.

### `airports` — aérodromes (array)
```
{ name, iata, icao, lon, lat, major:bool, source }
```
- **Source** : OSM `aeroway=aerodrome` nommés, **filtrés aux aérodromes
  immatriculés OACI `HS…`** (vrais aéroports, pas des pistes en terre ; écarte
  les terrains étrangers attrapés par la bbox). **37 aéroports**.
- `major:true` pour les grands hubs (Khartoum, Port-Soudan, Nyala, El-Fasher,
  El-Geneina, Kassala, Atbara, Dongola, El-Obeid, Ed-Damazin, Kadugli…).
- **Khartoum International (KRT/HSSS)** est **ajouté manuellement** : il **manque**
  comme nœud `aerodrome` nommé dans l'extrait OSM (seul « New Khartoum » HSSN y
  figure). Les noms arabes sont conservés tels quels (le site est FR/EN/AR) ; le
  code IATA/OACI sert d'étiquette neutre.

### `ports` — mer Rouge (array)
```
{ name, lon, lat, type, note }
```
- **4 points curés** autour de **Port-Soudan** (port principal — poumon logistique
  et siège *de facto* des autorités alignées SAF), son terminal Sud, **Suakin**,
  et le terminal pétrolier d'Oseif/Bashair. Coordonnées recoupées OSM.

### `crossings` — passages frontaliers (array)
```
{ name, country, lon, lat, note, source }
```
- **10 passages officiels** vers le **Tchad** (Adré — corridor humanitaire majeur,
  Tine, Um Dukhun), l'**Égypte** (Argeen, Ashkeit, Ras Haderba), l'**Éthiopie**
  (Gallabat/Metema), le confluent **Érythrée/Éthiopie** (Hamdayet) et le **Soudan
  du Sud** (Joda, Ulu).
- Quand `source = "OSM barrier=border_control"`, la coordonnée vient d'un nœud OSM
  **vérifié sur la frontière** ; sinon `curated` = point posé sur l'axe frontalier
  connu. Les **checkpoints internes** renvoyés par OSM (Soba, Jaili près de
  Khartoum) sont **écartés** — ce ne sont pas des passages frontaliers.

## Reconstruire
```bash
# 1) récupérer les données brutes OSM (poli : une requête à la fois, backoff)
python3 -I scripts/geo/fetch_geo.py data/raw/geo
# 2) construire la couche (clip Soudan + stitch + simplification)
python3 -I scripts/geo/build_geo.py data/raw/geo data/boundaries/sudan_adm0.geojson data/layer_geo.js
# 3) valider le JS
node -e "global.window={};require('./data/layer_geo.js');console.log(Object.keys(window.SUDAN.geo))"
```
`data/raw/geo/` est **git-ignoré** (voir `.gitignore`). Les scripts utilisent
`python3 -I`, des chemins en arguments, et des requêtes Overpass **bornées**
(timeout, User-Agent descriptif, une à la fois, repli d'endpoint).

## Sources & licences
- **OpenStreetMap** (routes, aéroports, passages) — **ODbL**, attribution requise.
- **Esri World Hillshade** (relief) — fond gratuit *keyless*, attribution requise.
- **OpenTopoMap** (relief alternatif) — CC-BY-SA, politique d'usage (usage léger).
- **geoBoundaries** (clip frontière Soudan ADM0) — CC BY 3.0 IGO.

## Limites
- Les routes `primary` (réseau secondaire) ne sont pas incluses ; la couverture
  OSM `trunk` est inégale selon les régions.
- Les coordonnées d'aéroports/ports sont des **points de repère**, pas des emprises.
- `relief` est un fond visuel ; aucune donnée d'élévation n'est stockée localement.
