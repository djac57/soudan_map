# `window.SUDAN.backers` — couche SOUTIENS ÉTRANGERS (qui soutient SAF vs RSF)

Couche **soutiens étrangers** du site Soudan, au niveau d'une **carte de cartographe**
(modèle : *Le Monde* « Le Soudan, épicentre mondial » ; sources ACLED, Chatham House,
Sudan Tribune, Middle East Eye). Elle cartographie, de façon **prudente, attribuée et
équilibrée**, les appuis extérieurs *rapportés* aux deux belligérants — l'armée (**SAF**,
al-Burhan) et les **Forces de soutien rapide** (**RSF**, Hemedti).

Deux fichiers, chargés/référencés **après** `data/bundle.js`, additifs (ne touchent aucun
autre fichier) :

- `data/layer_backers.js` → pose `window.SUDAN.backers` ;
- `data/backers_countries.geojson` → polygones pays colorés par camp (référencé par le JS
  via `alignment.geojson`).

Produits par `scripts/backers/build_backers.py`. Date de génération : **2026-10-28**.

## Avertissement — sujet diplomatiquement sensible
Aucun de ces soutiens n'est **officiel** : ce sont des **allégations attribuées** à des
sources fiables, chacune **datée** et **liée** (URL). Les gouvernements concernés
**démentent le plus souvent** (`denied`). Niveaux de certitude :

- **`multi-source`** — convergence de plusieurs sources indépendantes (souvent dont le
  Groupe d'experts de l'ONU) ;
- **`rapporte`** — rapporté / allégué par une ou quelques sources ;
- **`ambivalent`** — rôle changeant / jouant les deux camps (ex. Russie).

**Garde-fou** : pour un pays-**relais** (Tchad, Libye, Soudan du Sud, RCA,
Somalie/Puntland), le camp indiqué reflète un **transit allégué**, pas nécessairement un
soutien de l'État. Aucune donnée **nominative** ; rien d'inventé ; **absence** d'une
entrée ≠ absence de soutien ; situation **évolutive**.

---

## Structure de `window.SUDAN.backers`
```
{ generated, target, legend, alignment, routes, logistics_airports, saf, rsf, sources, note }
```

### `alignment` — pays de la région colorés par camp
```
{ geojson: "data/backers_countries.geojson",
  source_boundaries: "geoBoundaries gbOpen ADM0 (CC BY 4.0)",
  countries: [ { iso3, country_fr, side, support_type[], certainty, denied,
                 ambivalent?, note, source:{name,url,date} }, … ] }
```
- `side` ∈ `RSF` | `SAF` | `mixed` | `context` | `theatre`.
- Les **polygones** sont dans `data/backers_countries.geojson` (une *feature* par pays),
  avec dans `properties` : `iso3, name_fr, side, support_type, certainty, denied,
  ambivalent, note, source, source_url, source_date` → coloration directe par `side`.
- Frontières : **geoBoundaries gbOpen ADM0** (CC BY 4.0), simplifiées (coordonnées
  arrondies à ~1 km, micro-îles supprimées ; Russie dégradée davantage). Contours de
  **contexte**, pas des polygones analytiques.

### `routes` — flux typés tracés via des hubs réels
```
[ { type, actor:"RSF"|"SAF", label, coords:[[lon,lat],…], certainty, denied,
    note, source:{name,url,date} } ]
```
`type` ∈ `gold` | `arms_fuel` | `arms` | `fighters`. Chaque route est une **polyligne**
passant par ses **hubs réels** (aéroports/villes) — pas un trait droit centroïde‑à‑centroïde.

### `logistics_airports` — aéroports/hubs logistiques
```
[ { name, country, lon, lat, side, role, source:{name,url,date} } ]
```

### `saf` / `rsf` — fiches détaillées par camp (inchangées, enrichies)
`{ country, country_fr, iso3, lon, lat, support_type[], certainty, denied, status, note,
   hub?{name,lon,lat}, sources[] }`

### `target`
`{ saf:{lon,lat,place}, rsf:{lon,lat,place} }` — **Port‑Soudan** (37.22, 19.62) et
**Nyala** (24.88, 12.05), destinations des flèches.

### `legend`, `sources`, `note`
Libellés FR (camps, `sides`, certitude, `route_types`) ; liste dédupliquée de **24
sources** ; avertissement complet.

---

## Pays alignés (au 2026-10-28)

### Côté RSF (6)
| Pays / acteur | Rôle | Certitude | Source | Démenti |
|---|---|---|---|---|
| **Émirats arabes unis** | armes, munitions, financement, or | multi-source | Groupe d'experts ONU S/2024/65 | oui |
| **Tchad** | transit (Amdjarass) | rapporté | GI-TOC | oui |
| **Libye (Haftar, est)** | transit, carburant, combattants | rapporté | The Sentry / CIG | oui |
| **Soudan du Sud** | transit, or | rapporté | Chatham House | oui |
| **RCA (via Wagner)** | transit, armes, combattants | rapporté | Middle East Eye / US Treasury | oui |
| **Kenya** | diplomatique (accueil charte RSF, Nairobi fév. 2025) | rapporté | Reuters / Jurist | oui |

### Côté SAF (7)
| Pays | Rôle | Certitude | Source | Démenti |
|---|---|---|---|---|
| **Égypte** | diplomatique, militaire, drones | rapporté | RTÉ / ACLED | oui |
| **Iran** | drones | multi-source | Critical Threats | non |
| **Arabie saoudite** | financement, diplomatique | rapporté | Africa Confidential | oui |
| **Qatar** | diplomatique, financement | rapporté | AllAfrica | non |
| **Turquie** | drones, diplomatique | rapporté | RTÉ / Fair Observer | oui |
| **Érythrée** | diplomatique, entraînement, logistique | rapporté | Dabanga / Horn Review | non (Asmara muette) |
| **Russie** *(ambivalent)* | armes, diplomatique (bascule État 2024) | ambivalent | Jamestown | oui |

### Contexte (polygone affiché, sans coloration de camp)
**Somalie/Puntland** (Bossaso = transit allégué de mercenaires, pas l'État fédéral),
**Ouganda** (corridor logistique allégué, GI-TOC), **Bahreïn** (aucun alignement
documenté), **Éthiopie** (relations tendues, pas de soutien documenté), **Soudan**
(`theatre`).

> **Russie** figure côté SAF **mais** porte `ambivalent:true` : bascule de l'État vers le
> SAF en 2024, alors que Wagner a historiquement appuyé le RSF via la RCA et l'or.

---

## Routes typées (9) et leurs hubs
- **Or** (RSF) : Darfour → **Amdjarass (Tchad)** → **Abou Dhabi** ; et Songo → Wau →
  **Juba** → Abou Dhabi *(Chatham House « Gold and the war in Sudan », GI-TOC)*.
- **Armes & carburant** (RSF) : Émirats → **Amdjarass** → **Nyala** *(Groupe d'experts
  ONU)* ; Émirats → **Koufra / Maaten al-Sarra (Libye)** → Nyala *(CIG)*.
- **Combattants** (RSF) : **Benghazi (Libye)** → Nyala *(mercenaires colombiens ;
  Yahoo/Bellingcat)* ; **Bangui → Birao (RCA)** → Nyala *(HRW 2026)* ; **Bossaso
  (Puntland)** → Nyala.
- **Drones** (SAF) : **Iran → Port‑Soudan** *(Critical Threats)* ; **Turquie →
  Port‑Soudan** *(RTÉ)*.

## Aéroports logistiques (10)
Amdjarass (TCD), Koufra, Maaten al-Sarra, Benghazi/Al-Marj (LBY), Nyala, Birao (CAF),
Bossaso (SOM/Puntland), Abou Dhabi (ARE) — côté **RSF** ; Port‑Soudan, Asmara/Massawa
(ERI) — côté **SAF**. Chacun avec `role` et `source`.

---

## Sources privilégiées
1. **Groupe d'experts de l'ONU sur le Soudan** (comité 1591) — rapport final **S/2024/65**
   (15 janv. 2024). <https://digitallibrary.un.org/record/4039195?ln=en>
2. **Chatham House — « Gold and the war in Sudan »** (26 mars 2025).
   <https://www.chathamhouse.org/2025/03/gold-and-war-sudan>
3. **ACLED**, **GI-TOC**, **The Sentry**, **Conflict Intelligence Group**,
   **Sudan Tribune**, **Middle East Eye**, **HRW**, presse (Reuters/AFP/Al Jazeera,
   RTÉ, Critical Threats, Jamestown, Africa Confidential, Bellingcat).
4. Frontières : **geoBoundaries gbOpen ADM0** (CC BY 4.0).

> À intégrer lors d'une mise à jour : **International Crisis Group** et **Sudan Conflict
> Observatory** (Yale HRL) comme sources d'appoint.

---

## Régénérer
```
python3 -I scripts/backers/build_backers.py .
```
Entrées (dans `data/raw/backers/`) :
- `backers_records.json` — fiches détaillées SAF/RSF + cibles ;
- `backers_model.json` — `alignment` (par ISO3), `routes`, `logistics_airports` ;
- `countries_adm0/<ISO>.geojson` — geoBoundaries gbOpen ADM0 simplifié (CC BY 4.0).

Sorties : **uniquement** `data/layer_backers.js` + `data/backers_countries.geojson`. Le
script **refuse** toute entrée sans source attribuée, sans champ obligatoire, avec un
`side`/`certainty` inconnu, ou sans pays alignés des deux côtés.

Validation :
```
node -e "global.window={};require('./data/layer_backers.js');console.log(window.SUDAN.backers.generated)"
node -e "JSON.parse(require('fs').readFileSync('./data/backers_countries.geojson','utf8')).features.length"
```

## Rendu conseillé (pour l'architecte)
- **Choroplèthe** : colorer chaque *feature* du geojson par `properties.side` (RSF / SAF /
  mixte / contexte) ; hachures ou pointillés si `denied` ; motif distinct si `ambivalent`.
- **Routes** : tracer les polylignes `routes[].coords`, couleur par `actor`, style par
  `type` (or, armes, combattants), opacité/épaisseur selon `certainty`.
- **Aéroports** : marqueurs `logistics_airports` avec `role` au survol.
- **Tableau** synchronisé (pays, type, certitude, démenti, source datée cliquable).
- Toujours afficher l'**étiquette de certitude** et la mention **« démenti »** — ne jamais
  présenter un soutien comme un fait établi.

## Limites
- Données **non officielles**, agrégées depuis le domaine public ; routes/hubs
  **indicatifs** (pas des tracés GPS réels).
- Polygones **simplifiés** (affichage) ; pays-relais colorés par camp = **transit
  allégué**, pas un soutien d'État prouvé.
- Couverture **non exhaustive** ; biais possibles ; dates hétérogènes ; situation
  **évolutive** (bascule russe 2024, reflux iranien, baisse des vols EAU via le Tchad 2025).
