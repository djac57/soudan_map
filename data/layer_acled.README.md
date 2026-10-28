# layer_acled — couche ACLED (intensite / tendance par Etat)

Couche **intensite et tendance du conflit** par Etat soudanais, construite a
partir des donnees agregees **ACLED** (Armed Conflict Location & Event Data).

- **Fichier produit** : `data/layer_acled.js` — additif, pose `window.SUDAN.acled`.
- **Script** : `scripts/acled/build_acled.py` (stdlib seule).
- **Source brute** : `data/raw/acled/Africa_aggregated_data_up_to_week_of-2026-10-17.xlsx`.
- **Chargement** : apres `data/bundle.js` (comme les autres `layer_*.js`).

## Attribution OBLIGATOIRE

**ACLED** — <https://acleddata.com>. Attribution requise (voir `meta.source` /
`meta.url` / `meta.license`, affiches par l'UI). (c) ACLED. All rights reserved.
Usage non commercial.

## Construire

```sh
python3 -I scripts/acled/build_acled.py \
  "data/raw/acled/Africa_aggregated_data_up_to_week_of-2026-10-17.xlsx"
```

Le script ecrit `data/layer_acled.js` et imprime un rapport (totaux, top Etats,
repartition par type, plage temporelle).

### Pourquoi parser le XML brut (pas openpyxl)

openpyxl **echoue** sur ce classeur : son `workbook.xml.rels` reference
`xl/drawings/drawing1.xml`, absent de l'archive. Le script lit donc directement
le ZIP avec la stdlib (`zipfile` + `xml.etree.ElementTree`) :

- `xl/sharedStrings.xml` → table des chaines ; les cellules `t="s"` sont
  resolues par index entier.
- `xl/worksheets/sheet1.xml` → lignes `<row>` / cellules `<c>` / valeurs `<v>`.

`WEEK` est un **numero de serie Excel** (epoque 1899-12-30) converti en date ISO
via `date(1899,12,30) + timedelta(days=int(WEEK))` (la semaine ACLED = semaine
*commencant* a cette date).

## Donnees source

- `COUNTRY == "Sudan"` → **20 198 lignes**, **22 ADMIN1**.
- Colonnes : `WEEK, REGION, COUNTRY, ADMIN1, EVENT_TYPE, SUB_EVENT_TYPE, EVENTS,
  FATALITIES, POPULATION_EXPOSURE, DISORDER_TYPE, ID, CENTROID_LATITUDE,
  CENTROID_LONGITUDE`.
- 6 types d'evenements ACLED : Battles, Explosions/Remote violence, Violence
  against civilians, Protests, Riots, Strategic developments.
- `CENTROID_LATITUDE/LONGITUDE` = **centroide de l'ADMIN1** (identique pour
  toutes les lignes d'un meme Etat), pas la position d'un evenement.

## Correspondance ADMIN1 ACLED → adm1_id geoBoundaries (SD-XX)

18 des 22 ADMIN1 sont les vrais Etats du Soudan et portent un `adm1_id`
(convention `window.SUDAN.states` / `humanitarian.displacement_by_state`) :

| ACLED ADMIN1 | Etat | adm1_id |
|---|---|---|
| Al Jazirah | Gezira | SD-GZ |
| Blue Nile | Blue Nile | SD-NB |
| Central Darfur | Central Darfur | SD-DC |
| East Darfur | East Darfur | SD-DE |
| Gedaref | Gedaref | SD-GD |
| Kassala | Kassala | SD-KA |
| Khartoum | Khartoum | SD-KH |
| North Darfur | North Darfur | SD-DN |
| North Kordofan | North Kordofan | SD-KN |
| Northern | Northern | SD-NO |
| Red Sea | Red Sea | SD-RS |
| River Nile | River Nile | SD-NR |
| Sennar | Sennar | SD-SI |
| South Darfur | South Darfur | SD-DS |
| South Kordofan | South Kordofan | SD-KS |
| West Darfur | West Darfur | SD-DW |
| West Kordofan | West Kordofan | SD-GK |
| White Nile | White Nile | SD-NW |

Les **4 restants sont transfrontaliers / anciens** et n'ont pas de polygone
SD-XX ; ils sont conserves avec `adm1_id = null` (ne s'affichent pas sur la
choroplethe Soudan) :

| ACLED ADMIN1 | Nature |
|---|---|
| Abyei | Zone PCA contestee Soudan / Soudan du Sud |
| Bahr el Ghazal | Soudan du Sud |
| Equatoria | Soudan du Sud |
| Upper Nile | Soudan du Sud |

## Schema `window.SUDAN.acled`

```js
{
  by_state: [{
    state,            // nom d'Etat (aligne sur window.SUDAN.states)
    acled_admin1,     // nom ADMIN1 brut ACLED
    adm1_id,          // "SD-XX" ou null (transfrontalier)
    lat, lon,         // centroide d'Etat (ACLED)
    events_total, fatalities_total,          // tout l'historique (1996→)
    events_since_war, fatalities_since_war,  // depuis 2023-04-15
    by_type: { Battles, "Explosions/Remote violence",
               "Violence against civilians", Protests, Riots,
               "Strategic developments" }   // evenements/type depuis la guerre
  }, ...],                                   // trie par intensite de guerre desc.

  timeline_weekly: [{ week, events, fatalities }, ...],
      // serie hebdomadaire NATIONALE de la guerre (2023-04-15 →, 184 semaines)
  timeline_weekly_full: [{ week, events, fatalities }, ...],
      // historique national complet (1996-12-28 →, 1503 semaines)

  by_type_totals: { <type>: { events, fatalities }, ... },  // depuis la guerre

  totals: { events, fatalities, as_of:"2026-10-17", since:"2023-04-15" },

  meta: { source, url, license, as_of, note }
}
```

## Totaux (depuis 2023-04-15), au 2026-10-17

- **Evenements : 22 387 · Morts : 57 057** (national, periode de guerre).
- Top Etats (intensite = evenements de guerre) : Khartoum (7 187 ev / 8 957 m),
  North Darfur (2 793 / 14 431), Gezira (2 297 / 3 959), North Kordofan
  (1 825 / 6 360), South Darfur (1 433 / 3 671).
- Repartition par type (evenements) : Battles 6 444, Explosions/Remote violence
  5 785, Strategic developments 4 890, Violence against civilians 4 708,
  Protests 503, Riots 57.

## Limites / honnetete

- Donnees **AGREGEES par Etat** (centroide d'Etat, **pas** des points
  d'evenements individuels) — garde-fou Darfour respecte par construction : aucune
  localisation fine.
- **ACLED est quasi temps reel et plus complet qu'UCDP**, mais les **semaines les
  plus recentes sont parfois revisees** (chiffres provisoires).
- `fatalities` = morts rapportees par ACLED (meilleure estimation), pas un bilan
  officiel ; prudence sur les comparaisons entre sources.
- Rien d'invente : chaque valeur provient directement du fichier source agrege.
