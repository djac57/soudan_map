# `window.SUDAN.ethnolang` — couche ethno-linguistique

Couche **ethno-linguistique** du site Soudan : fond **structurel** montrant, à gros grain,
les **zones de peuplement** de groupes ethniques politiquement pertinents et un **semis de
points de langues**. Chargée **après** `data/bundle.js`, additive : elle pose
`window.SUDAN.ethnolang` sans toucher à aucun autre fichier.

Produite par `scripts/ethnolang/build_ethnolang.py` à partir de sources **ouvertes,
académiques et citées**, téléchargées par `scripts/ethnolang/fetch_ethnolang.py` dans
`data/raw/ethnolang/` (dossier git-ignoré).

Date de génération : **2026-10-28**.

---

## ⚠️ Cadre & sensibilité (à lire avant tout usage UI)

L'ethnicité est un sujet **très sensible** au Soudan (dimension arabe / non-arabe, Darfour,
question d'une détermination de génocide). Cette couche est **strictement académique et
neutre** :

- **Toute carte ethnique ou linguistique est une SIMPLIFICATION et une construction
  CONTESTÉE.** Les groupes se mélangent, les frontières sont floues et poreuses,
  l'auto-identification varie, et de vastes zones sont mixtes. Ces données ne disent **pas**
  « qui vit où » de façon exacte ni exhaustive.
- **Aucun déterminisme.** La guerre (FAS/SAF vs FSR/RSF) n'est **pas** présentée comme une
  guerre « ethnique » : c'est d'abord un conflit de **pouvoir** entre appareils militaires.
  L'appartenance à un groupe **ne prédit ni n'explique** la violence.
- **Garde-fou Darfour maintenu.** Les zones des groupes du Darfour (Four, Masalit, Zaghawa)
  et des monts Nouba sont montrées comme **géographie académique**, jamais pour cibler,
  essentialiser ou présumer des responsabilités collectives. La question du génocide relève
  d'**instances judiciaires et d'enquêtes**, pas de cette carte.
- **« Selon la source »** systématique : statut de pouvoir = codage **EPR** ; familles de
  langues = classification **Glottolog**. Rien n'est inventé ; aucune donnée nominative.

L'UI **doit** afficher l'avertissement (`ethnolang.note`) et créditer chaque source.

---

## Contenu de l'objet
```
window.SUDAN.ethnolang = { groups, languages, note, sources, generated }
```

### `groups` — zones de peuplement (polygones) + statut de pouvoir
9 objets (période **2012-2021**, c.-à-d. **après** la sécession du Soudan du Sud de 2011 :
les groupes du Sud — Dinka, Nuer, Azande… — ne font plus partie du Soudan et sont donc
absents). Chaque objet :
```
{ gwgroupid, name, name_fr, status, status_fr, power_access,
  pop_share_epr, period, point, bbox, geometry, source }
```
- `geometry` : GeoJSON **MultiPolygon** (lon/lat WGS84, arrondi ~3 déc. ≈ 110 m).
- `status` / `status_fr` : statut EPR brut puis traduit (`DOMINANT` → « dominant »,
  `POWERLESS` → « sans pouvoir », `DISCRIMINATED` → « discriminé »…).
- `power_access` : **codage EPR** résumé — `inclus` vs `exclu` de l'accès à l'exécutif
  **central** (pas une hiérarchie sociale locale).
- `pop_share_epr` : part de population **estimée par EPR** (0–1), estimation d'expert,
  **pas** un recensement.
- `point` : point-label indicatif (barycentre du plus grand anneau) ; `bbox` : emprise.

Groupes et statut (selon EPR, 2012-2021) :

| Groupe (name_fr) | Statut EPR | Accès | Part pop. (EPR) |
|---|---|---|---|
| Shaygiyya, Ja'aliyyin et Danagla (arabes riverains) | dominant | inclus | 0,19 |
| Autres groupes arabes | sans pouvoir | exclu | 0,32 |
| Autres groupes du Nord | sans pouvoir | exclu | 0,22 |
| Bedja (Beja) | sans pouvoir | exclu | 0,09 |
| Nouba (monts Nouba) | discriminé | exclu | 0,07 |
| Four (Fur) | discriminé | exclu | 0,03 |
| Masalit | discriminé | exclu | 0,015 |
| Zaghawa | discriminé | exclu | 0,005 |
| Rachaïda (Rashaida) | sans pouvoir | exclu | 0,003 |

> Lecture neutre : EPR code un petit noyau **arabe riverain** de la vallée du Nil comme
> contrôlant l'exécutif central, et les groupes du **Darfour** et des **monts Nouba** comme
> *discriminés*. C'est une description de l'**accès au pouvoir d'État**, pas un jugement sur
> les personnes ni une explication mécanique de la guerre.

### `languages` — points de langues
91 objets (Glottolog, langues rattachées au Soudan `SD`, point tombant dans le pays).
Chaque objet :
```
{ name, glottocode, iso639_3, family, lat, lon, major, source }
```
- `family` : famille **de plus haut niveau selon Glottolog** (classification *conservatrice* :
  pas de macro-famille « nilo-saharienne » — d'où Nubian, Nilotic, Saharan, Central Sudanic,
  Kadugli-Krongo… comme familles distinctes).
- `major` : `true` pour 9 langues principales / emblématiques (arabe soudanais `apd`, bedja
  `bej`, nubien nobiin `fia` / kenuzi-dongola `kzh` / midob `mei`, four `fvr`, masalit `mls`,
  daju du Darfour `daj`, tigré `tig`) — simple repérage, **sans hiérarchie de valeur**.
- `lat`/`lon` : **un** point-référence Glottolog par langue (centroïde indicatif) — ne
  représente ni l'étendue ni le nombre de locuteurs.

### `note`
Avertissement complet (simplification contestée, non-déterminisme, garde-fou Darfour, limites
Glottolog). **À afficher dans l'UI.**

### `sources`
`[{ name, org, role, url, license, date }]` — 3 sources (ci-dessous).

---

## Sources & licences (vérifiées le 2026-10-28)
| Source | Rôle | Licence | Date |
|---|---|---|---|
| **GeoEPR-2021** — Geo-referencing Ethnic Power Relations ([ICR/ETH Zürich](https://icr.ethz.ch/data/epr/geoepr/)) | zones de peuplement des groupes politiquement pertinents | usage académique libre, **citation requise** (Wucherpfennig et al. 2011 ; Vogt et al. 2015) | version 2021 |
| **EPR-2021** — Ethnic Power Relations core ([ICR/ETH Zürich](https://icr.ethz.ch/data/epr/core/)) | statut d'accès au pouvoir (inclus / exclu) | usage académique libre, **citation requise** (Vogt et al. 2015) | 2021, période retenue **2012-2021** |
| **Glottolog (CLDF)** ([glottolog.org](https://glottolog.org/) · [GitHub](https://github.com/glottolog/glottolog-cldf)) | points de langues (lat/lon), famille, ISO 639-3 | **CC BY 4.0** | téléchargé 2026-10-28 |

Attribution obligatoire pour chaque source dans l'UI. Ethnologue / WLMS (propriétaires) **non
utilisés**.

---

## Limites (honnêteté)
- **Carte = simplification contestée** : frontières floues, zones mixtes, auto-identification
  variable ; les polygones peuvent **se chevaucher** (régions de peuplement, pas parcelles).
- **Liste non exhaustive** : GeoEPR ne retient que les groupes jugés *politiquement
  pertinents* par EPR → ce n'est **pas** l'inventaire de tous les peuples du Soudan.
- **Échelle nationale** : statut de pouvoir et part de population sont des agrégats nationaux
  (estimations d'expert), pas des mesures locales ni un recensement.
- **Données potentiellement anciennes** : GeoEPR/EPR s'arrêtent en **2021** ; Glottolog agrège
  des sources d'époques variées → fond **structurel**, pas instantané de la guerre.
- **Points de langues réducteurs** : un seul point par langue ; **11 langues** rattachées au
  Soudan mais dont le point Glottolog tombe **hors du pays** (ex. arabe standard placé en
  Arabie) ont été écartées du semis.
- **Aucune donnée nominative ni opérationnelle.**

---

## Régénération
```
# 1. télécharger les sources ouvertes (-> data/raw/ethnolang/, git-ignoré)
python3 -I scripts/ethnolang/fetch_ethnolang.py \
    /ABS/soudan/data/raw/ethnolang
# 2. construire la couche (-> data/layer_ethnolang.js)
python3 -I scripts/ethnolang/build_ethnolang.py \
    /ABS/soudan /ABS/soudan/data/raw/ethnolang
# 3. vérifier que le JS est valide et pose window.SUDAN.ethnolang
node -e "global.window={};require('./data/layer_ethnolang.js');\
console.log(Object.keys(window.SUDAN.ethnolang))"
```
Tous les scripts tournent en `python3 -I`, sans dépendance tierce (le shapefile GeoEPR est lu
par un parseur Python pur), et prennent les chemins en arguments ; les données téléchargées
(non fiables) restent dans `data/raw/ethnolang/`.

## Branchement UI (à faire par l'intégrateur — hors périmètre de cet agent)
Ajouter, **après** `data/bundle.js` dans `index.html` :
```html
<script src="data/layer_ethnolang.js"></script>
```
puis consommer `window.SUDAN.ethnolang` par *feature-detection*, en affichant toujours
`ethnolang.note` et les crédits `ethnolang.sources`.
