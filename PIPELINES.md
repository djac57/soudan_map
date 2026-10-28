# PIPELINES — auto-update du site Soudan (GitHub Actions)

Ce dépôt a **deux** workflows :

| Workflow | Déclencheur | Rôle |
|---|---|---|
| `.github/workflows/deploy.yml` | `push` sur `main`, manuel | déploie Pages du site tel quel (inchangé) |
| `.github/workflows/update.yml` | `schedule` (cron) + manuel | **rafraîchit les données AUTO**, reconstruit les couches, commit si changé, **puis déploie Pages lui-même** |

> ⚠️ **Gotcha géré.** Un `push` fait par `github-actions` (jeton `GITHUB_TOKEN`)
> **ne redéclenche pas** `deploy.yml`. `update.yml` déploie donc Pages directement
> (`configure-pages` + `upload-pages-artifact` + `deploy-pages`), avec les
> permissions `contents: write`, `pages: write`, `id-token: write`.

---

## Classification des sources

### AUTO — rafraîchies en CI

| Source | Fetcher | Builder(s) consommateur(s) | Clé ? | Cadence |
|---|---|---|---|---|
| **FIRMS NRT** (feux VIIRS 90 j) | `scripts/fetch_firms.py` → `data/raw/firms/firms_raw_90d.geojson` | `build_sudan.py`, `process_grids.py` | **secret `FIRMS_MAP_KEY`** | **quotidien** |
| **UCDP GED** (bulk CSV/zip, événements) | `scripts/fetch_ucdp.py` → `data/raw/ucdp/` *(nouveau, créé ici)* | `process_ucdp.py`, `build_sudan.py` | non (bulk public) | hebdo |
| **FIRMS archive SP** (historique feux) | `scripts/fetch_firms_archive.py` → `data/raw/firms/firms_sp_agg.json` | `build_sudan.py` | `FIRMS_MAP_KEY` | hebdo |
| **OSINT Telegram** (`t.me/s/` public) | `scripts/osint/scrape_tme.py` → `data/raw/osint/` | `scripts/osint/build_osint.py` → `layer_osint.js` | non | hebdo |
| **Humanitaire** (IOM DTM / OCHA / UNHCR, HDX) | `scripts/humanitarian/fetch_humanitarian.py` | `scripts/humanitarian/build_humanitarian.py` → `layer_humanitarian.js` | non | hebdo |
| **Sentinel daté** (Planetary Computer) | `scripts/sentinel/fetch_dated.py` → `data/raw/sentinel/` + `layer_sentinel.js` | *(auto-contenu)* | non (keyless) | hebdo |

Couches **dérivées recalculées** après tout refresh événements/feux (appel des
builders **existants**, jamais réécrits) :
`process_ucdp.py` → `build_sudan.py` → `process_grids.py` → `build_bundle.py`,
puis `scripts/analysis/build_analysis.py` (via `node scripts/analysis/dump_claims.js`).

### MANUEL / STATIQUE — jamais touché par le CI

- **ACLED agrégé** (`data/raw/acled/*.xlsx`) : l'API ACLED renvoie **403** → export
  web **manuel**. Alimente `layer_acled.js` **et** `layer_replay.js`. Comme
  `data/raw/` est gitignoré, ce classeur est **absent du runner** : l'étape replay
  de `update.yml` est **sautée** s'il manque (le replay est reconstruit en local
  quand l'ACLED est rafraîchi).
- **Claims / maps, backers, resources, ethnolang, geo/relief, pipelines, impacts,
  control** : curés / structurels, changent rarement → rebuild **à la main** en local.

---

## Cadence

- **Quotidien** (cron `20 3 * * 0,2,3,4,5,6`, soit tous les jours **sauf lundi**) :
  FIRMS NRT → rebuild cœur (`sudan_core.json`, grilles, `bundle.js`) → recompute
  analyse. UCDP est garanti présent (cache, sinon refetch idempotent).
- **Hebdomadaire** (cron `40 3 * * 1`, **lundi**) : en plus, OSINT + humanitaire +
  UCDP frais + FIRMS archive SP + Sentinel daté.
- **Manuel** : onglet **Actions → Auto-update données (Soudan) → Run workflow**,
  choisir `mode = daily | weekly`.

`data/raw/` étant gitignoré (absent d'un checkout neuf), un **cache** (`actions/cache`,
clé hebdo `sudan-raw-<année>-<semaine>`) persiste les entrées lourdes/quasi-statiques
(zip stable UCDP ~29 Mo, archive FIRMS SP). Le NRT FIRMS est re-fetché chaque jour.

---

## Robustesse

- `continue-on-error: true` **par source** de fetch : une source en panne ne casse
  pas le run.
- **Garde-fou intégrité** : avant tout commit, le nombre d'`events` du nouveau
  `sudan_core.json` est comparé à la version `HEAD`. Si 0, ou < 50 % de l'ancien
  (fetch UCDP probablement cassé), **le commit est refusé** — jamais de régression.
- **Commit seulement si changement** (`git diff --cached --quiet`) ; déploiement
  Pages **seulement** si un commit a eu lieu.
- `data/raw/` est écarté de l'artefact Pages (on ne publie pas le brut), puis remis
  pour que le cache de fin de job le repersiste.
- Aucun secret en clair, aucun jeton écrit dans le dépôt ; garde-fou Darfour et
  attributions des sources conservés (ils vivent dans les builders, non modifiés).

---

## SECRET à poser (action utilisateur requise)

Le seul secret nécessaire est **`FIRMS_MAP_KEY`** (NASA FIRMS MAP_KEY, utilisé par
`fetch_firms.py` et `fetch_firms_archive.py`).

1. Récupérer la valeur locale (ne **jamais** l'afficher/committer) :
   elle est dans `~/.config/firms/credentials` sous la forme `FIRMS_MAP_KEY=...`.
2. GitHub : dépôt **`djac57/soudan_map`** → **Settings → Secrets and variables →
   Actions → New repository secret** :
   - **Name** : `FIRMS_MAP_KEY`
   - **Secret** : *(coller la valeur)*
3. (`gh` CLI absent sur ce poste → pose via l'interface web.)

Aucune autre source AUTO ne demande de clé (UCDP bulk, OSINT, humanitaire, Sentinel
sont keyless).

---

## Déclencher / surveiller

- **Manuel** : Actions → *Auto-update données (Soudan)* → **Run workflow** (`daily`
  pour un test rapide, `weekly` pour tout tirer).
- **Suivi** : onglet Actions ; chaque run logue le mode, les compteurs par source,
  le verdict du garde-fou (`events: HEAD=… nouveau=…`), et l'URL Pages déployée.
- **URL Pages** : exposée par l'étape *Deploy to GitHub Pages* (sortie
  `page_url`).

---

## Validé en local (run à blanc, sans push)

Testés ici depuis `soudan/`, sorties écrites en scratch (aucun fichier suivi touché) :

- `fetch_ucdp.py` : découvre et télécharge les **21** CSV candidats (v25 × 12 + v26 × 9),
  validation du contenu CSV (le serveur peut répondre 200 à corps vide) — OK.
- `process_ucdp.py` → **1 626** points de clash ; `build_sudan.py` → `sudan_core.json`
  (events=1626, toutes les clés) ; `process_grids.py` → grilles feux/activité ;
  `build_bundle.py` → `bundle.js` 3,5 Mo — OK.
- `analysis` : `node dump_claims.js` (saf=29, rsf=32) + `build_analysis.py` → OK.
- `fetch_firms.py` avec la vraie clé (fenêtre 10 j) → ~39,7 k détections — OK.

## À valider en **runtime** GitHub (non testable en local)

Le runtime Actions n'est pas reproductible en local. Après avoir posé le secret et
poussé, lancer **manuellement** le workflow (`mode: weekly`) et vérifier :

1. Le secret `FIRMS_MAP_KEY` est bien lu (étape FIRMS NRT verte).
2. Le **déploiement Pages depuis `update.yml`** fonctionne (gotcha : `deploy.yml`
   ne se déclenche pas sur le push `github-actions`).
3. Les fetchers **hebdo réseau** côté runner (OSINT `t.me/s/`, HDX, Planetary
   Computer) — testés en motif ici mais pas sur IP GitHub (certaines peuvent être
   rate-limitées ; `continue-on-error` absorbe).
4. Le **cache** `data/raw` se crée (1ʳᵉ exécution) puis se restaure.
5. Le garde-fou laisse bien passer un vrai refresh et refuse une régression.
6. **Replay** : reste sauté tant que l'`ACLED .xlsx` manuel n'est pas fourni.
