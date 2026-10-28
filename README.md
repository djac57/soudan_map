# Soudan — carte du conflit (SAF / RSF)

Projet **perso** (djac57), **séparé** du projet Ukraine. Site web multi-pages du conflit
soudanais (armée régulière **SAF** vs **RSF**) : événements de conflit géolocalisés (UCDP) +
signaux physiques de feux satellite (NASA FIRMS), agrégés, datés, **sans ligne de contrôle
fabriquée**. Inspiré du site Ukraine (<https://ukraine-front.pp.ua>) pour le « chrome » et
l'ergonomie, adapté au Soudan avec une prudence maximale.

> **Ouvrir :** `index.html`. Les données sont figées dans `data/bundle.js` (chargé en local) ;
> seul le fond de carte (tuiles OpenStreetMap) et, en arabe, rien d'externe, nécessitent le réseau.
> Pour un test complet (fetch éventuel des frontières), servir le dossier en HTTP :
> `python3 -m http.server` puis ouvrir `http://127.0.0.1:8000/`.

---

## Ce que contient le site

Autonome, sans build, sans dépendance externe installée (Leaflet est **vendu** dans `vendor/`).

### Pages
- **`index.html`** — la carte et les analyses.
- **`methode.html`** — méthodologie, sources + licences datées, prudence, garde-fou Darfour,
  et l'honnêteté sur l'absence de ligne de contrôle. Même mise en page que la méthode Ukraine.

### Fonctionnalités (carte)
- **Fond de carte** OpenStreetMap, inversé en CSS pour le thème sombre.
- **Couches basculables** (cases à cocher + légende) : frontières pays + États (ADM0/ADM1),
  **affrontements** (points colorés par paire d'acteurs), **densité d'activité** (~11 km),
  **feux FIRMS** (densité, fenêtre affichée dynamiquement), **secteurs de focus**, et —
  si les données le fournissent — **esquisse de contrôle** (voir plus bas).
- **Affrontements par paire d'acteurs** : SAF↔RSF, SAF↔autres groupes armés, RSF↔autres,
  autres (non-étatique). Cases à cocher + compteurs. Couleurs **par paire**, aucun camp privilégié.
- **Filtre temporel** : 3 / 6 / 12 / 24 mois / tout.
- **Vues de focus** : zoom Kordofan (axe El-Obeid / Bara), El-Fasher, tout le Soudan.
- **Info au clic AGRÉGÉE** sur chaque point (acteurs, date, État, morts estimés) — jamais de
  granularité fine au Darfour.
- **Bandeau de garde-fou Darfour permanent** + caveats honnêtes (FIRMS = chaleur, pas conflit).

#### Couches signaux additionnelles (fichiers `data/layer_*.js`, chargés après `bundle.js`)
Chaque couche est **feature-detectée** (aucune erreur si le champ manque) et porte une **étiquette de
fiabilité** explicite. Toutes sont i18n FR/EN/AR (dates via `Intl`).

| Couche (fichier) | Source (`window.SUDAN.*`) | Étiquette de fiabilité affichée |
|---|---|---|
| **Imagerie Sentinel-2** (`layer_sentinel.js`) | `sentinel` — tuiles EOX « Sentinel-2 cloudless », sans clé | « mosaïque **annuelle** sans nuages — EOX », **pas une acquisition datée** ; sélecteur d'année 2020→2025 ; attribution EOX/Copernicus **CC BY 4.0** respectée dans le footer ; pane dédiée (non inversée en sombre) |
| **Signalements OSINT** (`layer_osint.js`) | `osint.points` — Telegram public | « Telegram public — **non vérifié** » ; rayon ∝ volume, couleur = camp dominant (SAF / RSF / neutre) ; popup agrégé (lieu, nb, dernière date, répartition) ; caveat : biais pro-SAF léger, géoloc bruitée, à croiser avec UCDP/FIRMS |
| **Contrôle approximatif par État** (`layer_maps.js` + `control_adm1_approx.geojson`) | `known_maps.control_approx` | remplissage ADM1 par acteur (SAF / RSF / contesté / autre) ; caveat **proéminent** : « esquisse au niveau **ÉTAT** — PAS une ligne de front (sièges, poches, fronts internes non représentés), à valider » ; **remplace** le créneau « à venir v1 » (repli conservé si absent) |
| **Revendications SAF** / **RSF** (`layer_maps.js`) | `claims.saf` / `claims.rsf` | deux couches à parts égales, couleurs distinctes, étiquetées « **revendiqué — non vérifié** » ; popup lieu/date/source/prise |
| **Cartes de référence** (`layer_maps.js`) | `known_maps.references` | panneau sur `methode.html` (nom, auteur, lien, date, licence) + note « citées, non reproduites — sauf Wikipédia **CC BY-SA 4.0** » |

### Fonctionnalités (analyses, sous la carte)
- **Chiffres clés** : affrontements, morts estimés, États touchés, détections de feux.
- **Panneau par État** : agrégats affrontements / morts, **et** violences unilatérales contre les
  civils **comptées au niveau de l'État uniquement** (jamais en points — garde-fou Darfour).
- **Chronologie mensuelle** : graphe à barres (SVG inline, une série, survol), bascule
  événements / morts estimés.
- **Créneau « ligne de contrôle & prévision »** (voir ci-dessous).

### Langues & thème
- **i18n** FR (principal) + **EN** (requis) + **AR** (bonus, avec **RTL** `dir="rtl"`), via
  attributs `data-t` / `data-tt` / `data-ph` et un petit `i18n.js`. Défaut = `?lang=`, sinon choix
  mémorisé, sinon langue du navigateur, sinon EN.
- **Thème clair/sombre** via variables CSS (tokens sur `:root`, redéfinis en sombre pour l'OS **et**
  la bascule). Bascule mémorisée dans `localStorage["sdn-theme"]` ; langue dans `localStorage["sdn-lang"]`.
- **SEO** : titre, description, Open Graph / Twitter, `theme-color`, favicon SVG générique
  (`logo.svg`). **Responsive** : gouttière 16 px, **0 scroll horizontal à 390 px**.

---

## La ligne de contrôle : honnêteté absolue

Le site **ne fabrique aucune ligne de contrôle**. La ligne fusionnée + bande 95 % + prévision +
flèches de l'Ukraine exige une **digitisation manuelle du front** (snapshots OSINT datés) puis des
**modèles entraînés** — rien de tout cela n'existe encore pour le Soudan. Le code fait du
**feature-detection** au runtime :
- **`window.SUDAN.known_maps.control_approx`** (cas actuel) : une **esquisse au niveau ÉTAT**
  (remplissage ADM1 par acteur, d'après des cartes connues à licence permissive) **remplace** le
  créneau « à venir v1 », avec un caveat **proéminent** sous la carte : « esquisse au niveau ÉTAT —
  **PAS une ligne de front** ; sièges, poches et fronts internes ne sont pas représentés ; à valider ».
- **repli** : si `control_approx` est absent, l'interface **réserve le créneau** avec la note
  « à venir (v1) — nécessite une digitisation du front ».
- **`window.SUDAN.control`** (polygones approximatifs sourcés, encore `null`) : s'afficherait en
  couche optionnelle étiquetée « esquisse approximative — source X, à valider ».

Dans tous les cas, **aucune ligne de front n'est inventée** : seule une classification au niveau de
l'État (géométrie = frontières administratives réelles) est affichée, clairement étiquetée.

---

## Contrat de données (`window.SUDAN`, fourni par l'agent données)

Le site lit `window.SUDAN` (`data/bundle.js`) et **dégrade proprement** si un champ manque. Il sait
aussi retomber sur l'ancien format `window.SD_*` si `window.SUDAN` est absent — **aucune erreur** si
un champ (`states`, `timeline`, `focus`, `control`…) arrive plus tard.

```
window.SUDAN = {
  meta:{ generated, updated_through, bbox, fires_days, counts, sources:[{name,license,url,date}] },
  events:[{lon,lat,date,pair,deaths,type,state}],      // affrontements seulement ; type 3 (civils) exclu
  states:[{name,adm1_id,events,deaths,civ_violence,civ_deaths}],
  fires_density:[{lon,lat,weight,near}],
  timeline:[{month,events,deaths,...}],
  focus:[{key,label,bbox,note}],
  boundaries:{adm0,adm1}, boundaries_url, control: null | [...],
  // couches signaux additives (fichiers data/layer_*.js) :
  sentinel:{ tiles:{url,attribution,maxZoom,maxNativeZoom,bounds}, composites:[…2020-2025], scenes, license },
  osint:{ points:[{lon,lat,place,adm1,count,last_date,sides:{saf,rsf,neutral}}], channels, window_days },
  known_maps:{ references:[{name,author,url,date,license}], control_approx:[{geojson_url,actor,date,source,approx}] },
  claims:{ saf:[{lon,lat,place,adm1,date,source,claim}], rsf:[…] }
}
```

> **Appartenance.** Ce site **ne possède ni `data/` ni `scripts/`** : un agent « données » parallèle
> les maintient. La page les **lit seulement** au runtime. Tout le reste (`*.html`, `style.css`,
> `i18n.js`, `chrome.js`, `app.js`, `logo.svg`, `vendor/`, `screenshots/`) est géré ici.

---

## Prudence appliquée (non négociable)

- **Garde-fou Darfour** : violences unilatérales/civils **agrégées à l'État**, jamais en points ;
  pas de granularité camps de déplacés ; double filtrage (`type === 3` **et** motif « civ/one-sided »).
- **Pas de suivi d'unités, aucune donnée nominative.** Acteurs institutionnels/collectifs seulement.
- **Données historiques et datées** (en-tête, popups, méthode). Pas de temps réel.
- **Équilibre SAF/RSF** sans narratif (couleurs par paire d'acteurs).
- **Sources à licence ouverte vérifiée**, citées avec licence + date.
- **FIRMS honnête** : chaleur, pas cause ; brûlage agricole dominant ; masqué par défaut, en densité.

---

## Preuve headless (Chromium / Puppeteer)

Vérifié en headless sur `index.html` **et** `methode.html`, en **FR, EN et AR** :
- **0 erreur console / pageerror** sur les 5 chargements, **toutes les 10 couches activées
  simultanément** (les requêtes de tuiles externes OSM/EOX abandonnées en vol sont ignorées, ce ne
  sont pas des erreurs de code) ;
- couches (dont Sentinel + sélecteur d'année, OSINT, contrôle approx., revendications SAF/RSF),
  catégories, filtre temporel, vues de focus, bascule du graphe et **bascule de thème** exercés ;
  **AR** passe bien en `dir="rtl"` ;
- **0 scroll horizontal à 390 px** (`scrollWidth == clientWidth`) sur les deux pages ;
- captures **clair / sombre / mobile** dans `screenshots/` (`light.png`, `dark.png`, `mobile.png`).

---

## Publication (TODO — le site n'est pas encore hébergé)

Liens **relatifs** et **host-agnostiques** : aucune URL de domaine ni d'outil de mesure n'est codée
en dur (des `TODO` balisent les emplacements dans les `<head>`). Pour publier :

1. **Nouveau dépôt `djac57`** dédié (séparé du dépôt Ukraine).
2. **GitHub Pages** sur ce dépôt (branche + `/`), le site est servi tel quel.
3. **Domaine** (ex. via nic.ua / eu.org) → `CNAME` + DNS, HTTPS Pages.
4. *(option)* ajouter un **og:image** et un `<link rel="canonical">` absolus, et une mesure
   d'audience **respectueuse de la vie privée** une fois le domaine connu.

---

## Parité Ukraine : ce qui reste

- **Ligne de contrôle digitisée** (2-3 snapshots datés) → première géométrie de front (grossière,
  cadence mensuelle), **avant** toute bande d'incertitude ou prévision.
- **Modèles entraînés** (nowcast / prévision) : seulement une fois une vérité-terrain digitisée
  disponible et validée en walk-forward — sinon on n'affiche rien.
- **Corroboration OSINT crédibilité** (Sudan Airstrikes Hub, Yale HRL) en couche tierce, sans nominatif.
- **FIRMS × proximité conflit** pour isoler les feux probablement liés au conflit du brûlage agricole.

---

## Arborescence (partie site)

```
soudan/
  index.html        # la carte + analyses
  methode.html      # méthode, sources, prudence
  style.css         # thème clair/sombre (tokens CSS), responsive
  i18n.js           # dictionnaire FR / EN / AR (clés data-t)
  chrome.js         # thème + bascule de langue (partagé par les 2 pages)
  app.js            # adaptateur de données + carte Leaflet + stats + graphe
  logo.svg          # favicon générique
  vendor/leaflet/   # Leaflet 1.9.4 local (BSD-2)
  screenshots/      # light.png, dark.png, mobile.png (preuve headless)
  data/  scripts/   # MAINTENUS PAR L'AGENT DONNÉES — lus seulement, jamais édités ici
```

Projet perso, non affilié, à but de recherche. Aucune donnée nominative.
