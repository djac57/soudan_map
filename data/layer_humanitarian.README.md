# `window.SUDAN.humanitarian` — couche humanitaire (déplacés / IDP)

Couche **humanitaire** du site Soudan : montre l'**ampleur** et la **géographie** du
déplacement — la guerre au Soudan est la plus grande crise de déplacement au monde.
Chargée **après** `data/bundle.js`, additive : elle pose `window.SUDAN.humanitarian`
sans toucher à aucun autre fichier.

Produite par `scripts/humanitarian/build_humanitarian.py` à partir de fichiers
**officiels publiés** (téléchargés par `scripts/humanitarian/fetch_humanitarian.py`
dans `data/raw/humanitarian/`). **Uniquement des données humanitaires publiées**, celles
que les agences diffusent pour coordonner l'aide — aucun renseignement opérationnel,
aucun détail non public.

Date de génération : **2026-10-28**.

## Cadre éthique
Objectif = rendre visible l'échelle humaine du déplacement, avec soin, attribution et
dates. Les chiffres sont **agrégés comme les agences les publient** (par État, par
localité, par pays d'asile). Les camps emblématiques ne sont **pas** géolocalisés
individuellement : le jeu public DTM agrège à la **localité**, et c'est ce niveau qui
est cartographié.

---

## Contenu de l'objet
```
window.SUDAN.humanitarian = {
  idp_sites, displacement_by_state, totals, refugees_by_country, sources, note, generated
}
```

### `idp_sites` — localités de déplacement (points)
Tableau de 40 objets :
```
{ lon, lat, name, state, state_fr, adm1_id, pcode, population, as_of, source, includes? }
```
- **Provenance** : IOM DTM Sudan, *IDP Masterlist ADMIN2* (localité de déplacement).
  `population` = IDP présents dans la localité. Géolocalisé au **point-label officiel
  OCHA** de la localité (COD-AB, onglet `sdn_adminpoints`, jointure par `pcode`).
- **Sélection** : la plus grande localité de **chaque** État (couverture nationale,
  18 États) + les suivantes par volume → 40 points. Darfour dominant car épicentre réel.
- `includes` (optionnel) : camps publics compris dans la localité — présent pour
  **Al Fasher** (« camps de Zamzam, Abu Shouk et Al-Salam »).
- **Ce ne sont PAS des coordonnées GPS de camps individuels** : ce sont des localités
  (ADMIN2) placées sur leur point-label officiel.

### `displacement_by_state` — ampleur par État (choroplèthe)
Tableau de 18 objets, triés par IDP décroissant :
```
{ state, state_fr, adm1_id, dtm_code, idp, returnees, as_of, source }
```
- `adm1_id` = code **geoBoundaries ISO-3166-2** (ex. `SD-DN`), compatible avec
  `data/control_adm1_approx.geojson` du reste du site. `dtm_code` = pcode OCHA (`SD02`).
- `idp` = déplacés internes présents dans l'État ; `returnees` = retours enregistrés
  (DTM *Returnees Masterlist ADMIN1*) — montre que le stock IDP courant est **inférieur**
  au cumul historique.

### `totals` — chiffres nationaux
```
{ idp, idp_as_of, idp_source, refugees, refugees_as_of, refugees_source }
```
- `idp` = **8 622 801** déplacés internes (DTM, au **2026-07-31**).
- `refugees` = **3 761 034** personnes originaires du Soudan réfugiées à l'étranger
  (réfugiés + demandeurs d'asile, stock **fin 2025**, UNHCR Refugee Data Finder).

### `refugees_by_country` — réfugiés sortis par pays d'asile
Tableau trié décroissant : `{ country, people, neighbour }`. Principaux pays
voisins : **Tchad** (1 334 595), **Égypte** (834 201), **Libye** (639 166),
**Soudan du Sud** (571 071), **Éthiopie** (98 924), **Ouganda** (92 889),
**RCA** (40 323). `neighbour=true` pour les pays limitrophes / de première ligne.

### `sources` / `note`
`sources` = `{name, url, license, date}` par source. `note` = limites honnêtes.

---

## Sources & licences (vérifiées le 2026-10-28)
| Source | Rôle | Licence | Date |
|---|---|---|---|
| **IOM DTM Sudan — Displacement & Return Snapshot 008** ([HDX](https://data.humdata.org/dataset/sudan-displacement-situation-countrywide-idps-iom-dtm)) | IDP par État & localité, retours | **CC BY** | publié 2026-08-24, données au **2026-07-31** |
| **OCHA COD-AB Sudan** ([HDX](https://data.humdata.org/dataset/cod-ab-sdn)) | point-label admin2 (géoloc. uniquement) | **CC BY-IGO** | v03 (2020-08-31) |
| **UNHCR Refugee Data Finder** ([unhcr.org](https://www.unhcr.org/refugee-statistics/) / api.unhcr.org) | réfugiés sortis par pays d'asile | **CC BY 4.0** | stock **fin 2025** |

Citation DTM requise : « International Organization for Migration (IOM), [mois/année de
publication], DTM Sudan ». Attribution obligatoire pour chaque source dans l'UI.

---

## Limites (honnêteté)
- **Sous-dénombrement** : accès humanitaire restreint dans certaines zones (Darfour,
  **El-Fasher assiégé**) → les évaluations DTM manquent des populations inaccessibles.
- **Estimations, pas un recensement** : chiffres issus d'évaluations de terrain (key
  informants, observation), avec marge d'erreur ; les rounds DTM récents sont provisoires.
- **Dates hétérogènes** : IDP au 2026-07-31 (DTM round 8), réfugiés au 31-12-2025 (UNHCR).
  Le stock IDP courant (8,6 M) est **inférieur** au cumul souvent cité (~10-12 M uprootés
  depuis avril 2023) car des retours massifs ont eu lieu (Khartoum, Gezira).
- **Granularité** : les « sites » sont des **localités** (ADMIN2) sur leur point-label
  OCHA, pas des camps géolocalisés individuellement.
- **Aucun détail opérationnel non public** n'est inclus.

---

## Régénération
```
# 1. télécharger les sources officielles (-> data/raw/humanitarian/)
python3 -I scripts/humanitarian/fetch_humanitarian.py \
    /ABS/soudan/data/raw/humanitarian
# 2. construire la couche (-> data/layer_humanitarian.js)
python3 -I scripts/humanitarian/build_humanitarian.py \
    /ABS/soudan /ABS/soudan/data/raw/humanitarian
# 3. vérifier que le JS est valide et pose window.SUDAN.humanitarian
node -e "global.window={};require('./data/layer_humanitarian.js');\
console.log(Object.keys(window.SUDAN.humanitarian))"
```
Tous les scripts tournent en `python3 -I` et prennent les chemins en arguments ;
les données téléchargées (non fiables) restent dans `data/raw/humanitarian/`.
