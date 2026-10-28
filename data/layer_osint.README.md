# `data/layer_osint.js` — couche OSINT / Telegram (Soudan)

Équivalent Soudan de la couche Telegram « qui parle de quel lieu / présence
signalée » de l'Ukraine, mais **100 % public et sans clé** : on ne lit que les
**aperçus web publics** `https://t.me/s/<canal>` que Telegram sert à n'importe
quel visiteur (pas d'API, pas de login, pas de scraping d'app). Le fichier pose
`window.SUDAN.osint` (voir schéma plus bas) et est chargé **après** `bundle.js`.

> **Signalements OSINT NON VÉRIFIÉS, purement INDICATIFS.** Ce n'est pas une
> vérité terrain. La géolocalisation est faite par simple détection de noms de
> lieux dans le texte : c'est **bruité**. À croiser avec UCDP / FIRMS.

Généré par les scripts de `scripts/osint/`. **Aucun fichier hors du périmètre
OSINT n'est modifié** (ni `bundle.js`, ni `sudan_core.json`, ni les autres
`build_*.py` / `layer_*.js`, ni HTML/CSS/JS).

---

## v2 (approfondissement)

Cette couche a été **approfondie** par rapport à la v1 : plus de canaux équilibrés,
fenêtre temporelle plus longue, gazetteer beaucoup plus fin. Les ordres de grandeur
(AVANT → APRÈS) sont rappelés dans « Limites » ; les totaux exacts vivent dans
`counts` et `channels[].coverage` du JSON généré.

## Canaux retenus (équilibre pro-SAF / pro-RSF / neutre)

Choisis par recherche web **puis probés un par un** : seuls les canaux dont
l'aperçu public `/s/` sert réellement des **messages datés** sont retenus. Un très
grand nombre de handles « guerre du Soudan » renvoient en réalité une page
`Contact @x` (aperçu web désactivé), sont **inactifs**, ou ont été **revendus**.
L'étiquette `lean` est le **bord éditorial** du canal, **pas** une vérité terrain.

| Canal (`t.me/s/…`) | `lean` | Nature | Couverture |
|---|---|---|---|
| `RSFSudan` | **rsf** | Compte **officiel** des Rapid Support Forces | actif, géolocalisable |
| `GeneralDagalo` | **rsf** | Compte de Hemedti (chef RSF) | actif mais surtout communiqués politiques, **peu de posts géolocalisables** |
| `SudanBreaking` | **saf** | « عاجل السودان », pro-SAF (cadrage « milice DAF ») | **quasi inactif depuis ~2026-04** → faible dans la fenêtre |
| `sudaaan` | **saf** | « السودان », actualités **pro-gouvernement / pro-SAF** | **actif mais firehose** : gros volume, faible profondeur temporelle |
| `sudanewsnow` | **saf** | « اخبار السودان », news indépendantes **à cadrage anti-RSF / pro-armée** (*nouveau v2*) | actif, documente les exactions RSF |
| `NewsfromSudan` | **neutre** | Documentation indépendante (droits humains, depuis 2024) | actif, bon contributeur |
| `kordofan24` | **neutre** | « منصة كردفان 24 », plateforme de news **régionale Kordofan** (*nouveau v2*) | actif, densifie l'axe Kordofan |
| `ourwarstoday` | **neutre** | Agrégateur OSINT guerres (mondial) | peu de contenu Soudan géolocalisé |
| `OSINTWarfare` | **neutre** | Agrégateur OSINT conflits (mondial) | peu de contenu Soudan géolocalisé |

**Changements v2 :** ajout de `sudanewsnow` (saf) et `kordofan24` (neutre) ;
**retrait de `SudanTribune`** dont le handle affiche désormais « اسم المستخدم للبيع »
(nom d'utilisateur à vendre → canal abandonné). Résultat : **9 canaux** répartis
**2 rsf / 3 saf / 4 neutres**.

**Honnêteté sur l'équilibre :** on ne peut pas équilibrer parfaitement, et c'est
documenté. La présence **pro-RSF publique ET géolocalisable** sur les aperçus `/s/`
est **structurellement mince** au-delà du compte officiel (la plupart des handles
pro-RSF désactivent l'aperçu web ou sont inactifs). La présence **pro-SAF active**
sur Telegram est elle aussi faible : l'écosystème SAF est surtout
Facebook / X / YouTube / TV satellite (IFRI, *Sudan Wartime Online Propaganda*,
2026). L'affichage « équilibré » des canaux **ne corrige pas** ces biais de
plateforme — d'où la règle : lire la **présence/récence par camp et par localité**,
jamais les totaux absolus.

Sources d'attribution du `lean` : IFRI 2026 (confirme `@RSFSudan` et
`@GeneralDagalo` comme comptes RSF officiels), auto-description des canaux et
cadrage éditorial observé. Le champ `channels[].coverage` du JSON expose, pour
chaque canal, sa plage de dates réellement captée, son nombre de messages
« conflit » et de mentions géolocalisées : **à regarder avant toute lecture des
totaux** `sides`.

## Fenêtre

- `window_days = 150` (paramètre du build), soit `window = [AAAA-MM-JJ, aujourd'hui]`
  (v1 : 60 j). Objectif : **plus de profondeur temporelle**.
- Pagination via le lien natif `?before=<id>` de Telegram, jusqu'à ~16 pages par
  canal. Le scraper est **« window-aware »** : il **arrête de paginer** dès qu'une
  page a son plus ancien message antérieur au `cutoff`. Les canaux lents (compte
  officiel, régional) remontent donc loin dans la fenêtre à moindre coût ; un canal
  **firehose (sudaaan)** sature le plafond de pages sans le marteler et ne couvre
  alors que quelques jours. **La profondeur réelle diffère d'un canal à l'autre**
  (voir `coverage`), c'est normal et attendu.

## Méthode de géolocalisation (texte → lieu)

1. **Parsing** des aperçus : par message, texte (`tgme_widget_message_text`) + date
   (`<time datetime>`), dédoublonné par id de message sur les pages qui se chevauchent.
2. **Filtre conflit** : un message n'est compté que s'il contient ≥1 terme de
   guerre/sécurité (arabe + latin). Écarte annonces d'emploi, météo, sport, promos.
3. **Gazetteer bilingue** (`scripts/osint/gazetteer.py`) : **~108 localités**
   (v1 : ~50) + 13 États. **Expansion v2 à l'échelle ADM2** : chefs-lieux et petites
   villes ajoutés dans tous les États (Kordofan, Darfour, Gezira, Nil Blanc, Sennar,
   Nil Bleu, Gedaref, Kassala, Mer Rouge, Nil, Nord…), chacun avec alias **arabes et
   latins** + variantes de translittération. Noms d'États alignés sur
   **geoBoundaries** (ADM1), centroïdes calculés depuis `data/boundaries/sudan_adm1.geojson`.
4. **Appariement robuste** : normalisation arabe (harakat, alef/ya/ta-marbuta,
   tatweel) et latine (sans diacritiques) ; gestion des **clitiques arabes**
   (و/ف/ب/ك/ل + article ال) et des **frontières de mot** pour limiter les faux
   positifs (ex. « سرب الجيش » = escadron de l'armée ne matche **pas** « سربا »/Sirba).
5. **Agrégation** par localité/État : `count`, `last_date`, et `sides` = répartition
   par bord éditorial du canal émetteur. **Dé-doublonnage** : chaque point a une clé
   unique (localité ou État) ; aucune duplication localité↔État homonyme.

Garde-fous conservés dans le gazetteer : **États homonymes d'une ville capitale
(Khartoum, Gezira, Sennar, Kassala, Gedaref) non dupliqués** (représentés par la
ville) ; alias anglais « blue/white nile » retirés (bruit barrage GERD / fleuve) ;
**exclusion des toponymes = mots arabes courants** (ex. « blanc », « paix »,
« viens ») pour limiter le bruit sur ce matcher volontairement grossier.

## Secteurs de focus (couverture élargie v2)

- **Kordofan** (dense) : El-Obeid, Bara, Umm Rawaba, Er Rahad, En Nahud, El Fula,
  Babanusa, Muglad, Kadugli, Dilling… + ajouts v2 : **Sodari, Wad Banda, Al Odaya,
  Al Khuwayy, Al Meiram, Keilak, Abu Jubayha, Rashad, Heiban, Al Abbasiya, Kalogi,
  Ghubaysh**.
- **Darfour** (dense) : El Fasher, Nyala, Ed Daein, Zalingei, El Geneina, Tawila,
  Mellit… + ajouts v2 : **Al Lait, Malha, Shangil Tobaya, At Tawisha, Umm Baru,
  Karnoi, Gereida, Buram, Tullus, Rehed el Birdi, Nertiti, Mukjar, Bindisi,
  Umm Dukhun, Garsila, Shearia, Abu Karinka, Adila, Abu Matariq, Kereneik, Sirba,
  Foro Baranga**.
- **Centre / Est / Nord** (nouvellement densifiés) : Gezira (Managil, Rufaa,
  Al Kamlin), Nil Blanc (Al Jabalain, Tendelti), Sennar (Dinder, Abu Hujar),
  Nil Bleu (Er Roseires, Kurmuk, Geissan), Gedaref (Doka, Es Showak, Al Galabat,
  Al Faw), Kassala (Khashm el Girba, Aroma, Hamashkoreib), Mer Rouge (Suakin, Tokar,
  Sinkat), Nil (Abu Hamad, El Matamma), Nord (Wadi Halfa, Karima, Ad Dabbah).

## Limites honnêtes

- **Volume AVANT → APRÈS (ordres de grandeur)** : canaux **8 → 9** (dont 2 nouveaux
  actifs, 1 mort retiré), fenêtre **60 → 150 j**, gazetteer **~50 → ~108 localités**.
  Les nombres exacts de **lieux** et de **mentions** sont dans `counts` du JSON
  régénéré (v1 : 47 lieux / 291 mentions ; v2 attendue nettement supérieure grâce à
  la fenêtre + au gazetteer, à lire dans `counts`).
- **Géoloc bruitée** : homonymes (ex. « الابيض » = El-Obeid *mais aussi* « blanc »),
  lieux cités « de loin », négations, reprises d'événements anciens, noms propres de
  personnes homonymes de villes (ex. Rashad), titres de médias. Aucune
  désambiguïsation sémantique — c'est volontairement grossier.
- **Biais de source / de volume** : les totaux `sides` reflètent **l'activité des
  canaux**, pas la réalité. Présence pro-RSF géolocalisable mince (hors compte
  officiel) et présence pro-SAF Telegram faible (écosystème SAF ailleurs, IFRI 2026).
  → Lire la **présence/récence par camp et par localité**, jamais les totaux absolus.
- **Couverture temporelle inégale** entre canaux (cf. `coverage`) : la fenêtre à
  150 j ne « remplit » chaque canal qu'à hauteur de ses propres posts.
- **Aperçus publics seulement** : un canal qui désactive `/s/` (page `Contact @x`)
  ou dont le handle a été revendu (ex. ex-`SudanTribune`) n'est pas/plus capté ; les
  posts médias sans texte ne sont pas géolocalisés.
- **Garde-fous Darfour** : granularité **localité/État minimum**, **aucun contenu
  nominatif**, **aucun suivi d'unités**, **aucun camp de déplacés / quartier**.
- **CGU** : consultation d'aperçus publics uniquement ; aucune rediffusion de
  contenu, seuls des comptes agrégés de mentions sont conservés.

## Schéma (`window.SUDAN.osint`)

```js
{
  generated:   "AAAA-MM-JJ",
  window_days: 150,
  window:      ["AAAA-MM-JJ","AAAA-MM-JJ"],
  points: [ { lon, lat, place, adm1, count, last_date,
              sides:{ saf, rsf, neutral } }, … ],   // trié par count desc
  channels: [ { name, lean, url, label, coverage:{days,conflict_msgs,geo_mentions} }, … ],
  counts:  { messages_scanned, messages_in_window, messages_conflict,
             messages_geolocated, places, mentions },
  note:         "…",   // avertissement indicatif + biais
  license_note: "…",   // aperçus publics / CGU
  sources: [ { name, lean, url }, … ]
}
```

## Régénérer

```bash
ABS=/Users/douglas.comin/Desktop/perso/soudan
# 1. scraper les aperçus publics (serial, poli, window-aware) -> data/raw/osint/<canal>/page_*.html
#    args: <raw_dir> <channels_json> <max_pages> <window_days>
python3 -I "$ABS/scripts/osint/scrape_tme.py" "$ABS/data/raw/osint" \
        "$ABS/scripts/osint/channels.json" 16 150
# 2. construire la couche (parse + géoloc + agrégation) -> data/layer_osint.js
python3 -I "$ABS/scripts/osint/build_osint.py" "$ABS/data/raw/osint" \
        "$ABS/scripts/osint/channels.json" \
        "$ABS/data/boundaries/sudan_adm1.geojson" \
        "$ABS/data/layer_osint.js" 150
```

Tout tourne en `python3 -I`, chemins passés en arguments ; les données **non
fiables** restent dans `data/raw/osint/` et ne sont jamais importées comme code.
Si un canal échoue en SSL (sandbox), il peut être re-téléchargé à part via `curl`
dans `data/raw/osint/<canal>/page_NNN.html` (même format), puis rebuild.
