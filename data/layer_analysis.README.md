# `layer_analysis.js` — Couche ANALYSE / « POUSSÉES PROBABLES »

Couche **additive**, chargée **après** `data/bundle.js` et `data/layer_maps.js`.
Elle fait `window.SUDAN = window.SUDAN || {}` puis pose `window.SUDAN.analysis`.
**Elle ne touche aucun autre fichier.**

```html
<!-- à ajouter après data/layer_maps.js, avant app.js -->
<script src="data/layer_analysis.js"></script>
```

> **INDICATIF — basé sur la dynamique récente des données ouvertes, PAS une
> prévision ni un modèle validé. Ne pas lire comme une certitude.** C'est
> l'équivalent prudent du « poussée possible » ukrainien, **sans** la calibration
> conforme ukrainienne. Les scores sont **relatifs** (normalisés 0..1), pas des
> probabilités.

Build : `ref_date` = dernier événement UCDP (**2026-09-28**) ; fenêtre récente =
**90 jours**. Les revendications les plus fraîches vont jusqu'au **2026-10-22**.

---

## Ce que la couche expose

```
window.SUDAN.analysis = {
  generated, ref_date, window_days, weights,
  watch_zones:       [ { lon, lat, adm1, adm1_fr, score, drivers:[...], window }, ... ],
  momentum_by_state: [ { state, adm1_id, adm1_fr, recent, base, ratio, trend }, ... ],
  note
}
```

- **`watch_zones`** — secteurs sous-étatiques à surveiller (≤ 10), triés par
  `score` décroissant. `lon/lat` = centroïde des affrontements récents de la zone,
  **arrondi à 0,1°** (~11 km : pas de fausse précision). `score` ∈ [0,1], **relatif**
  (le secteur le plus « chaud » = 1). `drivers` = phrases FR qui **justifient** le
  score (accélération chiffrée, prise revendiquée datée, localité contestée, feux de
  conflit). `window` = la fenêtre temporelle évaluée.
- **`momentum_by_state`** — pour chaque ADM1 : `recent` (nb d'affrontements sur 90 j),
  `base` (nb attendu sur 90 j au rythme moyen de toute la guerre), `ratio` =
  `recent/base`, `trend` ∈ {`forte hausse`, `hausse`, `stable`, `baisse`,
  `faible activité`}.

---

## Méthode de score (heuristique, explicable)

Pour chaque **cellule ~25 km** (0,25°) contenant ≥ 2 affrontements des 90 derniers
jours, on calcule quatre sous-indices, chacun **normalisé 0..1** sur l'ensemble des
cellules candidates, puis une somme pondérée :

| Composante | Poids | Mesure |
|---|---|---|
| **Intensité récente** | 0,40 | `log(1+nb d'affrontements sur 90 j)` |
| **Accélération** | 0,30 | `(récent − base) / (récent + base + 1)`, tronqué ≥ 0 — hausse vs le rythme historique **propre à la cellule** (avant la fenêtre récente, ramené à 90 j) |
| **Revendications** | 0,20 | prises SAF/RSF **datées** `captured` récentes (≤ 210 j) et localités `contested` dans un rayon de 45 km, pondérées par la distance |
| **Feux de conflit** | 0,10 | `log(1+nb de cellules `fires_conflict_recent` < 35 km)` — sous-ensemble à < 15 km d'un affrontement récent ; **indice faible, jamais une preuve** |

Les cellules adjacentes (< 40 km) d'un même secteur sont **fusionnées** (fléau
greedy) pour que Bara, Kazgeil, Kurmuk… n'apparaissent qu'une fois avec l'ensemble
de leurs *drivers*. Le `score` affiché est **renormalisé 0..1** sur les secteurs
retenus. Le momentum par état compare `recent` (90 j) à une **base = rythme moyen de
toute la guerre** (depuis le premier événement, 2023-04-15) ramené à 90 j.

### Pourquoi ces choix
- **Base = moyenne longue de la zone**, pas la période précédente seule : plus stable,
  et fait ressortir les zones qui chauffent **par rapport à leur propre histoire**
  (p. ex. le Nil Bleu, longtemps calme, bondit ; le Darfour du Nord **retombe** après
  la chute d'El-Fasher d'octobre 2025).
- **Revendications** = les signaux les plus frais (jusqu'au 22/10/2026), au-delà de
  l'horizon UCDP (28/09/2026) : une prise datée récente ou une localité qui change de
  mains est un marqueur direct de front mouvant.

---

## Limites (à lire absolument)

- **Heuristique, non validée.** Aucun modèle entraîné, aucune calibration, aucun
  back-test. Les scores sont **relatifs et comparatifs**, pas des probabilités ni une
  prévision. Un score élevé = « ça a bougé récemment ici », **pas** « ça va tomber ».
- **UCDP sous-compte** les zones où la presse est absente, les coordonnées sont des
  centroïdes de localité (pas du GPS), et les mois 2025–2026 sont **Candidate (non
  finalisés)** → le classement des toutes dernières semaines est provisoire.
- **Une revendication n'est pas un contrôle** ; `fires_conflict_recent` détecte de la
  **chaleur, pas une cause**. Ces deux signaux ne font que corroborer faiblement.
- **Garde-fou Darfour** : zones à l'échelle **localité/axe** (~25 km, coord. arrondies
  à ~11 km). Aucune granularité camp de déplacés, aucune donnée nominative, aucune
  unité suivie, rien d'inventé. La violence anti-civile n'entre **pas** dans ce calcul
  (elle n'existe qu'agrégée à l'état dans `bundle.js`).
- `adm1 = "Unknown"` possible si UCDP n'a pas résolu l'état d'un point.

---

## Régénérer

```
# 1. extraire les revendications datées de layer_maps.js en JSON (lecture seule)
node scripts/analysis/dump_claims.js data/layer_maps.js <scratch>/claims.json

# 2. construire la couche (python -I, chemins en arguments)
python3 -I scripts/analysis/build_analysis.py \
  data/sudan_core.json <scratch>/claims.json data/layer_analysis.js

# 3. vérifier que le JS est valide
node -e 'global.window={SUDAN:{}};require("./data/layer_analysis.js");\
         console.log(Object.keys(window.SUDAN.analysis))'
```

`<scratch>` = n'importe quel dossier temporaire hors `data/` (l'intermédiaire
`claims.json` n'est pas un livrable). `build_analysis.py` **lit** `sudan_core.json`
et le JSON des revendications ; il **n'écrit que** `data/layer_analysis.js`.

## Fichiers créés (périmètre strict)

- `data/layer_analysis.js` — le livrable (`window.SUDAN.analysis`).
- `scripts/analysis/build_analysis.py` — le calcul (Python, `-I`).
- `scripts/analysis/dump_claims.js` — extraction lecture seule des revendications.
- `data/layer_analysis.README.md` — ce fichier.

Rien d'autre n'est modifié. Le branchement dans `index.html` / `app.js` (balise
`<script>` + rendu) relève du propriétaire de ces fichiers, **hors de ce périmètre**.
