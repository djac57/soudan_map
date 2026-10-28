# `window.SUDAN.resources` — couche ressources & richesses (économie de guerre)

Couche **RESSOURCES & RICHESSES** du site Soudan : une lecture **analytique** de
l'**économie de guerre**. Fil directeur : **l'OR finance largement les FSR (RSF)** ;
le pétrole, les barrages et l'agriculture sont à la fois des **leviers** et des **cibles**.
Chargée **après** `data/bundle.js`, additive : elle pose `window.SUDAN.resources`
sans toucher à aucun autre fichier.

Produite par `scripts/resources/build_resources.py` à partir de
`data/raw/resources/sites.json` (données **curées à la main** depuis des **sources
ouvertes vérifiées, citées et datées**).

Date de génération : **2026-10-28**.

## Cadre & garde-fous
- **Rien d'inventé.** Chaque enregistrement porte sa `source` (attribution + date).
- **Lien ressource ↔ contrôle uniquement quand il est sourcé** (`war_link` rédigé
  « selon [source] »), jamais spéculatif.
- **Garde-fou Darfour** : les zones d'orpaillage diffuses ne sont **pas** géolocalisées
  à un site précis — `precision = "zone_approx"` = point **représentatif de l'État**.
  Aucune localisation fine inventée, aucun cadrage ethnique.
- **Deux camps.** On documente explicitement que l'or industriel/licencié de l'est–nord
  (Ariab-Hassai, Nil-fleuve, Nord) est en zone **SAF**, et l'orpaillage Darfour/Kordofan
  en partie en zone **FSR** : les deux belligérants tirent des revenus des ressources.

## Contenu de l'objet
```
window.SUDAN.resources = {
  gold:[...], oil:[...], dams:[...], agriculture:[...],
  sources:[...], note, counts, generated
}
```
Volumes : **or 6**, **pétrole 5** (dont 1 oléoduc), **barrages 5**, **agriculture 5** —
21 features, 18 sources.

### Champs communs d'un enregistrement
```
{ id, name, name_fr, lon, lat, state, adm1_id, state_fr, kind,
  precision, status, control, control_source, war_link, source, as_of }
```
- `adm1_id` (`SD-XX`, ISO-3166-2) et `state_fr` sont **ajoutés par le build** à partir de
  `state` (même table que le reste du site : `shapeISO` de `boundaries/sudan_adm1.geojson`).
- `precision` ∈ `point` (site identifié : Mindat/OSM/Wikipedia) · `zone_approx` (point
  représentatif d'un État pour une ressource diffuse) · `schematic` (tracé indicatif).
- `kind` : or `artisanal|industrial` · pétrole `field|refinery|terminal|pipeline` ·
  barrages `hydropower|dam` · agriculture `irrigation|gum_arabic|rainfed`.
- L'oléoduc (`kind:"pipeline"`) n'a pas `lon/lat` mais une `route:[[lon,lat],…]`
  **schématique** (quelques points indicatifs, **pas** le tracé géométrique réel).

### `gold` — l'or, nerf financier (central)
Jebel Amer (Darfour du Nord, pt Mindat), Ariab-Hassai (Mer Rouge, industriel SAF),
ceinture ASGM du Kordofan, région du Nil (Abu Hamad), État du Nord (Dongola),
orpaillage du Darfour du Sud. Lien sourcé : **Panel d'experts ONU S/2024/65 (2024,
via Bloomberg/Reuters)** — les FSR contrôlent l'essentiel du commerce de l'or qui
**finance leur guerre**, or du Darfour exporté largement **via les EAU** (allégations
jugées crédibles par le Panel, démenties par les EAU) ; **Chatham House (2025)** pour la
géographie ASGM FSR vs industriel SAF.

### `oil` — champs & oléoduc
Heglig (+ CPF, frontière, **pris par les FSR le 8 déc. 2025** selon Al Jazeera/Sudan
Tribune, **droits de transit ~4 USD/baril** sur le brut sud-soudanais), Fula (Bloc 6),
raffinerie d'Al-Jaili (Khartoum), terminal de Port-Soudan (Bashayer), **oléoduc Greater
Nile** (~1 600 km, Heglig → Port-Soudan, tracé schématique).

### `dams` — barrages & eau
Merowe (Nil, ~1 250 MW), Er Roseires (Nil Bleu, frappes de drones FSR sur Ed Damazin
selon Sudan Tribune 2026), Sennar (irrigation Gezira), Jebel Aulia (Nil Blanc — sources
**contradictoires** sur le contrôle), Khashm el-Girba (Atbara, alimente New Halfa).

### `agriculture` — grands périmètres & gomme arabique
Gezira (~2 M acres, **pillé/endommagé par les FSR** après la prise de Wad Medani déc.
2023, selon Reuters/AAWSAT), New Halfa, Rahad, **gomme arabique du Kordofan** (~70 % de
l'offre mondiale, exports perturbés — Arab News/East African 2023), ceinture pluviale de
Gedaref.

## Sources & licences
Voir le tableau `sources` de l'objet. Principales :
- **Chatham House**, *Gold and war in Sudan* (2025) — géographie de l'or / contrôle.
- **Panel d'experts ONU sur le Soudan**, S/2024/65 (2024, domaine public ONU) — or ↔ FSR,
  via **Bloomberg** (2024-01-21).
- **Mindat.org** (coordonnées des mines, usage non commercial cité).
- **Global Energy Monitor** (Global Oil & Gas, CC BY) · **USGS MRDS** (domaine public) —
  pétrole / minéraux.
- **OpenStreetMap** (ODbL, © contributeurs) · **Wikipedia** (CC BY-SA) ·
  **Global Dam Watch** (CC BY) — barrages, raffineries, terminaux, périmètres.
- **Al Jazeera / Sudan Tribune / Radio Tamazuj** (2025) — pétrole & front.
- **Reuters / Asharq Al-Awsat**, **Arab News**, **The East African**, **Dabanga** — Gezira,
  gomme arabique, barrages.
- **OCHA / FAO** — production et périmètres agricoles (référence).

## Limites
- **Contrôle très mouvant** : la situation militaire change vite ; voir `as_of` par
  enregistrement. Certaines sources se **contredisent** (ex. Jebel Aulia) — c'est signalé
  dans le champ `control`.
- **Volumes de production incertains depuis 2023** (données déclaratives, forte
  contrebande de l'or) : aucun chiffre de production fin n'est posé comme certain.
- **Coordonnées diffuses approximatives** (`zone_approx`) : points représentatifs d'un
  État, **pas** des sites GPS — à ne jamais présenter comme des localisations précises.
- **Oléoduc schématique** : tracé indicatif, non géométrique.

## Reproduire
```
python3 -I scripts/resources/build_resources.py \
    /Users/douglas.comin/Desktop/perso/soudan \
    /Users/douglas.comin/Desktop/perso/soudan/data/raw/resources
```
Le script **n'écrit que** `data/layer_resources.js` (validation : coordonnées dans la
bbox Soudan, `adm1_id` résolu, `source` obligatoire). Vérifier le JS :
`node -e 'global.window={};require("./data/layer_resources.js");console.log(window.SUDAN.resources.counts)'`.

## Intégration (hors périmètre de ce livrable)
`data/layer_resources.js` doit être inclus **après** `data/bundle.js`, à côté des autres
couches, par le propriétaire de `index.html` :
```html
<script src="data/layer_resources.js"></script>
```
(La présente contribution **ne modifie pas** `index.html` ni `app.js` : périmètre strict.)
