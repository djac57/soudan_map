# Audit des données — carte Soudan

Audit du **cœur de données** du site (couches UCDP, FIRMS, OSINT, revendications,
contrôle, frontières, timeline, Sentinel). Date : 2026-10-28. Build de référence
audité : `data/bundle.js` du 2026-10-27.

Projet **personnel, non commercial**, avec attribution. Garde-fou Darfour maintenu
(violences anti-civils agrégées à l'État, jamais en points). Aucune donnée
nominative, pas de suivi d'unités.

---

## ACTIONS UTILISATEUR (par ordre de priorité)

1. **🔑 Créer une clé ACLED gratuite — GAP n°1, plus gros gain possible.**
   - S'inscrire sur le portail d'accès ACLED → https://acleddata.com/register/
     (compte individuel ; un e-mail perso suffit pour un usage perso/non
     commercial). Puis portail développeur → « Add New Key » (la clé ne s'affiche
     qu'une fois, la copier).
   - Déposer la clé dans `~/.config/acled/credentials` au format :
     ```
     ACLED_EMAIL_ADDRESS=...
     ACLED_ACCESS_KEY=...
     ```
     (chmod 600, comme les autres services ; **jamais** dans `soudan/`.)
   - **Gain attendu : densité × ~7 à 10** (voir § ACLED). Dès que la clé existe,
     un prochain passage pourra intégrer les événements ACLED dans
     `window.SUDAN.events` (champ `source:"ucdp"|"acled"` déjà prévu).

2. **(Optionnel) Clé NASA Earthdata** déjà présente mais **expire le 17/12/2026**
   — à régénérer (concerne la couche Sentinel, pas le cœur UCDP/FIRMS).

3. **(Optionnel) ADM2 geoBoundaries** (localités) si l'on veut un meilleur
   géocodage / infobulles au niveau district (voir § Frontières). Aucune clé
   requise, c'est du téléchargement libre — à activer si souhaité.

Rien d'autre ne bloque : tout le reste de l'enrichissement ci-dessous a été fait
**sans nouvelle clé**.

---

## VERDICT ACLED (priorité du brief)

**ACLED est utilisable pour CE site** (carte personnelle, non commerciale, avec
attribution) — **sous 3 conditions** — et c'est le plus gros gisement de données
manquant.

### Couverture — ordre de grandeur
| Source | Événements Soudan (depuis le 15/04/2023) | Résolution |
|---|---|---|
| **UCDP GED** (ce qu'on a) | **~1 626 affrontements** géolocalisés + **~486** événements anti-civils (agrégés État) ≈ **2 100** | localité (centroïde) |
| **ACLED** | **> 7 600 événements** de violence politique dès fin 2024 ; **~15 000+ estimés fin 2026** | localité + date, codage quotidien |

→ ACLED code **≈ 7 à 10 × plus d'événements** que l'UCDP sur le Soudan (il inclut
batailles, frappes à distance, explosions/engins, émeutes, violences ciblées,
manifestations). Intégrer ACLED **décuplerait** la densité de la couche
événements et comblerait les zones où l'UCDP sous-compte.

### Licence — ré-examen pour une carte perso non commerciale
Le doute initial portait sur l'usage **LLM**, pas sur une carte. Après relecture
des *Content Usage Terms*, *EULA* et *Attribution Policy* (acleddata.com, versions
2025) :
- ✅ **Usage non commercial / perso autorisé gratuitement** : seules les
  **entités commerciales** doivent prendre une licence corporate ; un particulier
  qui publie une carte gratuite n'est pas « commercial ». L'accès est libre après
  inscription.
- ⚠️ **La restriction AI/ML/LLM est stricte** — « To train, test, develop, or
  improve any ML models, LLMs… » est **interdit**. **MAIS ce site n'utilise aucun
  LLM** : cette clause **ne s'applique pas** ici. (Le projet LLM multi-théâtres est
  séparé et différé.)
- ⚠️ **Pas de redistribution de la donnée brute** : interdit de « provide direct
  access to raw data to any other user » ou de créer un jeu de données/produit qui
  **se substitue** à ACLED. Une **visualisation dérivée avec attribution est
  explicitement prévue** par l'Attribution Policy (exemple « your own
  visualization »). → **Condition pratique : afficher ACLED comme couche
  cartographique dérivée, de préférence agrégée (grille/État) ou allégée, et NE
  PAS publier de dump brut téléchargeable de tous les points ACLED.** Le site
  inlin­ant tout dans `bundle.js`, intégrer ACLED en **grille agrégée** (comme la
  couche feux) plutôt qu'en liste de points bruts respecte cette clause tout en
  décuplant la densité visible.
- ✅ **Attribution requise** (à mettre dans `meta.sources` + `methode.html`) :
  première mention « **ACLED (Armed Conflict Location & Event Data)** », + date
  d'accès + filtres appliqués + lien www.acleddata.com. Ex. :
  « ACLED (Armed Conflict Location & Event Data), consulté le AAAA-MM-JJ,
  https://acleddata.com ».

**Conclusion : OUI, utilisable.** Gain : densité × ~7-10. Action requise :
l'utilisateur crée une clé gratuite (§ Actions n°1). Sans la clé, impossible
d'intégrer maintenant → **c'est LE gap n°1**. Aucune clé ACLED n'a été trouvée
dans `~/.config/` ni l'environnement au moment de l'audit.

---

## Gap map par couche

### 1. Événements armés (UCDP) — ✅ ENRICHI
- **Avant** : fenêtre tronquée au **2024-01-01** → 1 320 points dans
  `window.SUDAN.events`, et **2024-10-01** (!) côté `events_clashes.geojson` →
  seulement **990** points. Incohérence entre les deux chemins.
- **Disponible dans les dumps locaux** : UCDP GED stable v25.1 (1989→2024) +
  Candidate v25/v26 couvre le Soudan **du 15/04/2023 (début de la guerre
  RSF-SAF) au 2026-09-28**.
- **Manque comblé** : fenêtre réalignée sur le **début de la guerre
  (2023-04-15)**. `events` passe à **1 626 affrontements géolocalisés**
  (+306, soit +23 %) et **486** événements anti-civils agrégés (+63). L'année
  **2023 (306 affrontements, dont le 1ᵉʳ siège d'El-Fasher et la bataille de
  Khartoum)** était **entièrement absente** — c'est probablement « ce qui
  manquait » ressenti par l'utilisateur. Timeline remonte à 2023-04.
- **Latence** : Candidate le plus récent = 2026-09-28, build 2026-10-28 → **~1
  mois** de latence (normal pour UCDP Candidate, non finalisé). Rien à combler.
- **Plausibilité** : OK. Top États = North Darfur 516 (siège El-Fasher), Khartoum
  280 (bataille de la capitale), ceinture Kordofan 456 (front actuel) — conforme
  à la géographie connue de la guerre. 20 points « Unknown » (ADM1 non résolu par
  l'UCDP), acceptable.
- **Reste** : seul ACLED peut densifier davantage (§ ACLED).

### 2. Feux (NASA FIRMS) — ✅ FORTEMENT ENRICHI
- **Avant** : une seule fenêtre **90 jours** NRT (2026-08-01→2026-10-27), 56 219
  détections, grille 0,05° (6 986 cellules). **Aucune histoire** : impossible de
  voir la saisonnalité → effet « tous les feux sont au sud » trompeur.
- **Disponible** : archive **VIIRS_SNPP_SP** = 2012-01-20 → 2026-07-31 (vérifié
  via l'endpoint data_availability). Même clé `FIRMS_MAP_KEY`.
- **Comblé** : nouvelle couche **temporelle** (`scripts/fetch_firms_archive.py`)
  de **2023-04 à 2026-07** (archive SP) + mois récents NRT raccordés →
  - `fires_timeline` : total mensuel + sous-ensemble **`north` (≥12N)** qui retire
    l'essentiel du brûlage agricole — montre que la masse de feux du sud est
    **saisonnière et agricole**, pas des combats.
  - `fires_history` : grille annuelle 0,1° (2023/2024/2025/2026) pour un
    curseur temporel. [VOLUMES: voir ci-dessous après génération]
- **Lisibilité conflit vs agriculture** (demande utilisateur) : sous-ensemble
  **`fires_conflict_recent`** désormais **explicite et nommé** = cellules à <15 km
  d'un affrontement des 60 derniers jours. `meta.fires_note` le dit clairement :
  `fires_density`/`fires_history` sont un proxy **de chaleur** dominé par le
  brûlage agricole ; seul `fires_conflict_recent` est un indice (jamais une
  preuve) de feu lié aux combats.
- **Limites** (citées dans `meta`) : FIRMS détecte la **chaleur, pas la cause** ;
  les nuages suppriment les détections ; NRT préliminaire. Ne jamais étiqueter un
  feu comme « frappe » ou « village brûlé ».

### 3. OSINT (Telegram / presse) — hors de mon périmètre (agent dédié)
- Présent : `data/raw/osint/` = 8 sources (GeneralDagalo, NewsfromSudan,
  OSINTWarfare, RSFSudan, SudanBreaking, SudanTribune, ourwarstoday, sudaaan),
  ~4,7 Mo. Rendu par `layer_osint.js` (**autre agent** — non modifié ici).
- Gap signalé pour mémoire : pas de clé API Telegram → collecte limitée ;
  dédoublonnage et géocodage à surveiller. À traiter côté `layer_osint`.

### 4. Revendications (contrôle revendiqué) — à construire
- **Aucune donnée de revendication structurée** dans le cœur aujourd'hui.
- Piste : Sudan War Monitor / Liveuamap / ACLED (via la clé) pour des
  revendications datées SAF/RSF. À cadrer plus tard ; pas bloquant.

### 5. Contrôle territorial — ✅ `null` assumé (honnête)
- `window.SUDAN.control === null` **à dessein** : tracer une ligne SAF/RSF
  exigerait de décalquer une carte publique datée et citée (Sudan War Monitor,
  Thomas van Linge…). Sans source traçable, toute polygone serait **inventée**,
  ce que le brief interdit. **Garder `null`** tant qu'on n'a pas de source
  décalquable. (Il existe `data/control_adm1_approx.geojson` — approximatif, à ne
  pas confondre avec un vrai relevé ; relève de l'agent carte.)

### 6. Frontières — ✅ ENRICHI
- **Avant** : seulement Soudan ADM0 + ADM1 (19 États). Carte étendue au sud
  illisible (on ne distinguait pas le Soudan du Soudan du Sud).
- **Comblé** : `data/boundaries/sudan_neighbors.geojson` — contours ADM0 de
  **Soudan du Sud, Tchad, Égypte, Érythrée, Éthiopie, RCA, Libye** (geoBoundaries
  gbOpen, **CC BY 4.0**), simplifiés à ~1 km (226 Ko). Référencé dans
  `window.SUDAN.boundaries.neighbors` et exposé en `window.SD_NEIGHBORS`.
- **Emprise sud** : `meta.bbox` étendu de `[21.8, 8.6, 39.1, 22.2]` à
  `[21.8, 8.2, 39.1, 22.3]` pour couvrir la bande d'activité jusqu'à la frontière
  sud-soudanaise. Le fetch FIRMS archive utilise la même bbox élargie.
- **Reste (optionnel)** : **ADM2** geoBoundaries (localités/districts) —
  intéressant pour de meilleures infobulles et l'agrégation des violences
  anti-civils au district ; pas indispensable car l'UCDP fournit déjà des
  coordonnées. À activer sur demande.

### 7. Timeline — ✅ ENRICHI
- Remonte désormais à **2023-04** (début de la guerre) au lieu de 2024-01.
  `timeline` (clashes + civ) couvre toute la guerre. `fires_timeline` ajoute la
  saisonnalité des feux (total vs `north`).
- Derniers ~1-2 mois provisoires (UCDP Candidate non finalisé) — déjà documenté.

### 8. Sentinel-2 — hors de mon périmètre (agent dédié)
- Présent : 3 vignettes s2cloudless statiques (El-Fasher 2025, Kordofan 2023 &
  2025), ~916 Ko. Rendu par `layer_sentinel.js` (**autre agent**). Couverture
  limitée à 2 secteurs/2 dates — documenté pour mémoire, non modifié ici.

---

## Licences (vérifiées, à citer dans `meta.sources` + methode.html)
- **UCDP GED v25.1 + Candidate** — **CC BY 4.0** — https://ucdp.uu.se/downloads/
- **NASA FIRMS VIIRS SNPP NRT + SP archive** — domaine public (NASA EOSDIS/LANCE,
  attribution demandée) — https://firms.modaps.eosdis.nasa.gov/
- **geoBoundaries ADM0/ADM1 Soudan + ADM0 voisins** — **CC BY 4.0 (Open)** —
  https://www.geoboundaries.org/
- **ACLED** (si clé créée) — accès gratuit non commercial, **attribution
  obligatoire**, pas de redistribution brute, pas d'usage LLM — https://acleddata.com/

---

## Enrichissements réalisés (sans nouvelle clé)
| Élément | Avant | Après |
|---|---|---|
| `events` (affrontements géoloc.) | 1 320 (dep. 2024-01) / 990 dans geojson | **1 626 (dep. 2023-04-15)** |
| Événements anti-civils (agrégés État) | 423 | **486** |
| Fenêtre temporelle | 2024-01 → 2026-09 | **2023-04 → 2026-09** |
| Feux | 90 j NRT seulement | **+ archive 2023-04→2026-07 (histoire mensuelle + grille annuelle)** |
| Sous-couche feux de conflit | champ `near` implicite | **`fires_conflict_recent` explicite + `fires_note`** |
| Frontières | Soudan ADM0/ADM1 | **+ 7 voisins ADM0 (contexte)** |
| Emprise (bbox) | lat 8.6→22.2 | **lat 8.2→22.3 (sud élargi)** |

## Manques restants (par priorité)
1. **ACLED** (× ~7-10 densité) — attend la clé utilisateur. **GAP n°1.**
2. **Revendications SAF/RSF datées** — pas de source structurée ; à cadrer.
3. **Ligne de contrôle** — reste `null` faute de source décalquable (correct).
4. **OSINT / Sentinel** — couverture partielle, gérée par les agents dédiés.
5. **ADM2** (option) — meilleur géocodage/infobulles district.
