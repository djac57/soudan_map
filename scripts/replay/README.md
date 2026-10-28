# scripts/replay — Cube de données temporel (replay animé)

Construit `data/layer_replay.js` : le **cube mensuel** qui alimente le replay
animé de la guerre au Soudan (2023-04 → 2026-10). Additif, chargé **après**
`data/bundle.js` ; pose `window.SUDAN.replay`. Rien d'autre n'est touché.

## Lancer

```sh
python3 -I scripts/replay/build_replay.py \
    data/raw/acled/Africa_aggregated_data_up_to_week_of-2026-10-17.xlsx \
    data/sudan_core.json \
    data/layer_maps.js \
    data/layer_replay.js \
    [data/boundaries/sudan_adm1.geojson] \
    [data/raw/firms/firms_sp_agg.json]
```

(Les deux derniers arguments sont **optionnels** — frontières ADM1 pour le
point-in-polygon des feux, et archive FIRMS VIIRS_SNPP_SP. Défauts = chemins
standards du dépôt.)

(`node` est requis : il sert uniquement de lecteur pour le littéral JS
`window.SUDAN.claims` de `data/layer_maps.js`.)

## Sources (déjà présentes dans le dépôt)

- **ACLED** — `data/raw/acled/…​.xlsx`. `openpyxl` échoue sur ce classeur ; on
  parse le XML brut via `zipfile` + `xml.etree` (même méthode que
  `scripts/acled/build_acled.py`, dont on réutilise la table
  `ADMIN1 → adm1_id` SD-XX). Filtre `COUNTRY == "Sudan"`, agrégé **au mois**
  (mois du début de semaine ISO) et **au niveau État**.
- **FIRMS** — `data/sudan_core.json → fires_timeline` (43 mois, `all` / `north`).
  On retient le sous-ensemble **`north`** (au nord de ~12°N), proxy conflit
  réduit — jamais une preuve de feux de combat (`meta.fires_basis`).
- **Revendications datées** — `data/layer_maps.js → window.SUDAN.claims`
  (SAF/RSF, géocodées, datées). « Revendiqué, NON VÉRIFIÉ ».

## Schéma produit (`window.SUDAN.replay`)

| clé | contenu |
|---|---|
| `granularity` | `"month"` |
| `periods` | `["2023-04", …, "2026-10"]` (43 mois) |
| `by_state` | `{ "YYYY-MM": { "SD-XX": {e, f}, … } }` — events/morts ACLED par État |
| `totals` | `{ "YYYY-MM": {e, f} }` — national (toutes lignes Sudan) |
| `fires` | `{ "YYYY-MM": <count> }` — FIRMS `north` national par mois |
| `fires_by_state` | `{ "YYYY-MM": { "SD-XX": {a, n} } }` — feux par État/mois (`a`=tous, `n`=nord12). **Estimation** : total annuel MESURÉ par État (point-in-polygon des mailles 0.1° FIRMS sur ADM1) réparti sur les mois selon le profil mensuel national FIRMS `all` (même poids pour `a` et `n` → `n≤a`). |
| `fires_year_by_state` | `{ "YYYY": { "SD-XX": {a, n} } }` — feux par État/an, **MESURE** directe (point-in-polygon). |
| `cum_events` / `cum_fatalities` | `{ "YYYY-MM": <cumul> }` — somme cumulée de `totals` depuis 2023-04. |
| `periods_week` | `["2023-04-01", …]` (186 semaines, clé = lundi ISO) |
| `by_state_week` | `{ "YYYY-MM-DD": { "SD-XX": {e, f} } }` — ACLED hebdo par État |
| `totals_week` | `{ "YYYY-MM-DD": {e, f} }` — ACLED hebdo national |
| `granularity_week` | `"week"` |
| `claims_dated` | `[{date, period, actor, place, lon, lat}]` trié chronologiquement |
| `meta` | `source`, `as_of`, `fires_basis`, `fires_by_state_basis`, `cumuls_basis`, `week_basis`, `displaced_basis`, `note` |

**Feux par État.** L'archive FIRMS gelée (`firms_sp_agg.json`) ne conserve, par
maille 0.1°, qu'un décompte **annuel** (pas de mensuel-par-maille). On mesure
donc le total **annuel** par État (point-in-polygon, 7 037 / 12 012 mailles
tombent dans un État soudanais) → `fires_year_by_state`, puis on **désagrège**
ce total annuel sur les mois via la saisonnalité nationale FIRMS →
`fires_by_state` (estimation, signalée dans `meta.fires_by_state_basis`). `a` et
`n` restent dominés par les feux agricoles : **jamais** une preuve de feux de
combat.

**Déplacement — NON animable.** Une seule date DTM disponible (IOM DTM
`snapshot_008`, 28/07/2026). Aucun `displaced_by_period` n'est produit : aucun
état intermédiaire n'est inventé (cf. `meta.displaced_basis`).

`claims_dated` ne retient que les prises **datables au mois** (jour `YYYY-MM-DD`
ou mois `YYYY-MM`). Les revendications à **plage de contrôle** (`YYYY-YYYY`) ou
à l'**année seule** (`YYYY`) sont écartées (non plaçables sur un mois).

## Prudence (garde-fou Darfour)

Tout est agrégé **au niveau État** : aucun point d'événement individuel, aucune
unité, aucune donnée nominative, aucune granularité camp de déplacés.
`totals` inclut les 4 entrées transfrontalières (Abyei, Bahr el Ghazal,
Equatoria, Upper Nile) ; `by_state` ne contient que les 18 États SD-XX.

Attribution : © ACLED (acleddata.com) · NASA FIRMS. `as_of` = 2026-10-17.
