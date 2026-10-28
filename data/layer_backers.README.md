# `window.SUDAN.backers` — couche SOUTIENS ÉTRANGERS (qui soutient SAF vs RSF)

Couche **soutiens étrangers** du site Soudan : cartographie, de façon **prudente et
équilibrée**, les appuis extérieurs *rapportés* aux deux belligérants — l'armée
(**SAF**, al-Burhan) et les **Forces de soutien rapide** (**RSF**, Hemedti). Chargée
**après** `data/bundle.js`, additive : elle pose `window.SUDAN.backers` sans toucher à
aucun autre fichier.

Produite par `scripts/backers/build_backers.py` à partir de notes sources **curées à la
main** (`data/raw/backers/backers_records.json`). Date de génération : **2026-10-28**.

## Avertissement — sujet diplomatiquement sensible
Aucun de ces soutiens n'est **officiel**. Ce sont des **allégations attribuées** à des
sources fiables, chacune **datée** et **liée** (URL). Les gouvernements concernés
**démentent le plus souvent** (champ `denied`). La couche distingue explicitement :

- **`multi-source`** — convergence de plusieurs sources indépendantes (souvent dont le
  Groupe d'experts de l'ONU) ;
- **`rapporte`** — rapporté / allégué par une ou quelques sources, non confirmé de façon
  indépendante ;
- **`ambivalent`** — rôle changeant ou jouant les deux camps (ex. Russie).

Règles appliquées : aucune accusation non étayée ; équilibre SAF / RSF ; aucune donnée
**nominative** ; rien d'inventé ; l'**absence** d'une entrée ≠ absence de soutien ;
situation **évolutive** (les alliances changent). À lire comme une cartographie de ce qui
est **allégué**, pas comme un constat judiciaire.

---

## Contenu de l'objet
```
window.SUDAN.backers = {
  generated, target, legend, saf:[…], rsf:[…], sources:[…], note
}
```

### `saf` / `rsf` — tableaux de soutiens rapportés
Chaque entrée :
```
{
  country, country_fr, iso3,
  lon, lat,                 // origine (capitale / QG) pour flèches de flux
  support_type: [ … ],      // armes, munitions, financement, drones, transit,
                            //   logistique, carburant, or, diplomatique, militaire,
                            //   opérations, ambivalent…
  certainty,                // "multi-source" | "rapporte" | "ambivalent"
  denied,                   // true si le gouvernement/l'acteur dément
  status,                   // étiquette courte FR (ex. « Allégué ; jugé crédible par l'ONU. Démenti. »)
  note,                     // détail FR, ATTRIBUÉ
  hub?: { name, lon, lat }, // point de transit réel quand ≠ origine (Amdjarass, Koufra…)
  sources: [ { name, url, date }, … ]   // ≥ 1 source obligatoire
}
```

### `target` — points Soudan (destination des flèches)
`{ saf:{lon,lat,place}, rsf:{lon,lat,place} }` — Port-Soudan (SAF) et Nyala (RSF).

### `legend`
Libellés FR pour SAF, RSF et les trois niveaux de certitude.

### `sources`
Liste **dédupliquée** (par URL) de toutes les sources citées, triée par nom — pour un
onglet crédits/méthode.

### `note`
Avertissement complet (sensibilité, certitude, démentis, limites).

---

## Soutiens recensés (au 2026-10-28)

### RSF (Forces de soutien rapide)
| Pays / acteur | Type | Certitude | Démenti |
|---|---|---|---|
| **Émirats arabes unis** | armes, munitions, financement, or | multi-source | oui |
| **Tchad** (transit, est) | transit, logistique | rapporté | oui |
| **Libye** (Haftar, est) | transit, carburant | rapporté | oui |
| **Russie** (Wagner / or) | or, logistique | ambivalent | oui |
| **Soudan du Sud** | transit, or | rapporté | oui |

### SAF (armée, al-Burhan)
| Pays / acteur | Type | Certitude | Démenti |
|---|---|---|---|
| **Égypte** | diplomatique, militaire, drones | rapporté | oui |
| **Iran** | drones | multi-source | non |
| **Russie** (bascule État 2024) | armes, diplomatique | ambivalent | non |
| **Turquie** | drones, diplomatique | rapporté | oui |
| **Arabie saoudite** | financement, diplomatique | rapporté | oui |
| **Qatar** | diplomatique, financement | rapporté | non |
| **Ukraine** | opérations, drones (anti-Wagner) | rapporté | non (ni confirme ni dément) |

> **Russie** apparaît des deux côtés à dessein : réseaux Wagner/or historiquement liés au
> RSF, **puis bascule de l'État russe vers le SAF en 2024**. C'est l'illustration même de
> l'étiquette `ambivalent`.

---

## Sources privilégiées
1. **Groupe d'experts de l'ONU sur le Soudan** (comité des sanctions 1591) — rapport
   final **S/2024/65** (15 janv. 2024) : juge « crédibles » les livraisons EAU→RSF via
   Amdjarass (Tchad). <https://digitallibrary.un.org/record/4039195?ln=en>
2. **GI-TOC** (Global Initiative) — chaînes d'approvisionnement illicites (transit Tchad,
   Libye/Koufra, Soudan du Sud, or). 2025.
3. **The Sentry** — rôle de l'est libyen (Haftar) dans le ravitaillement RSF. 2025.
4. Presse de référence : **Reuters/AFP/NYT/Al Jazeera**, **RTÉ**, **The Cipher Brief**,
   **Critical Threats**, **Jamestown**, **Africa Confidential**, **CNN/WSJ** (Ukraine).

> Pistes non encore intégrées faute de citation stable au moment du build :
> **International Crisis Group** et **Sudan Conflict Observatory** (Yale HRL) — à ajouter
> comme sources d'appoint lors d'une mise à jour.

---

## Régénérer
```
python3 -I scripts/backers/build_backers.py .
```
Lit `data/raw/backers/backers_records.json`, écrit **uniquement**
`data/layer_backers.js`. Validation : le script refuse toute entrée sans source, sans
champ obligatoire ou avec un niveau de certitude inconnu.

Validation JS :
```
node -e "global.window={}; require('./data/layer_backers.js'); console.log(window.SUDAN.backers.generated)"
```

## Rendu conseillé (pour l'architecte)
- **Annotations pays → acteur** : flèche de `lon/lat` (ou `hub` si présent) vers
  `target.saf` / `target.rsf`, épaisseur/opacité selon `certainty`, couleur par camp.
- **Tableau** synchronisé (pays, type, certitude, démenti, source datée cliquable).
- Toujours afficher l'**étiquette de certitude** et la mention **« démenti »** quand
  `denied` — ne jamais présenter un soutien comme un fait établi.

## Limites
- Données **non officielles**, agrégées depuis le domaine public ; pas de renseignement
  opérationnel, pas de coordonnées de route réelles (les `hub`/flèches sont indicatifs).
- Situation **évolutive** : alliances changeantes (bascule russe 2024, reflux iranien
  rapporté en 2026, baisse des vols EAU via le Tchad en 2025).
- Couverture **non exhaustive** ; biais possibles des sources ; dates hétérogènes.
