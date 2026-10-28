# `data/layer_osint.js` — couche OSINT / Telegram (Soudan)

Équivalent Soudan de la couche Telegram « qui parle de quel lieu / présence
signalée » de l'Ukraine, mais **100 % public et sans clé** : on ne lit que les
**aperçus web publics** `https://t.me/s/<canal>` que Telegram sert à n'importe
quel visiteur (pas d'API, pas de login, pas de scraping d'app). Le fichier pose
`window.SUDAN.osint` (voir schéma plus bas) et est chargé **après** `bundle.js`.

> **Signalements OSINT NON VÉRIFIÉS, purement INDICATIFS.** Ce n'est pas une
> vérité terrain. La géolocalisation est faite par simple détection de noms de
> lieux dans le texte : c'est **bruité**. À croiser avec UCDP / FIRMS.

Généré par les scripts de `scripts/osint/`. **Aucun fichier existant n'est
modifié** (ni `bundle.js`, ni `sudan_core.json`, ni les `build_*.py`, ni HTML/CSS/JS).

---

## Canaux retenus (équilibre pro-SAF / pro-RSF / neutre)

Choisis par recherche web, puis vérifiés : seuls les canaux dont l'aperçu
public `/s/` fonctionne réellement sont retenus. L'étiquette `lean` est le
**bord éditorial** du canal, **pas** une vérité terrain.

| Canal (`t.me/s/…`) | `lean` | Nature | Remarque de couverture |
|---|---|---|---|
| `RSFSudan` | **rsf** | Compte **officiel** des Rapid Support Forces | actif, ~40 j couverts |
| `GeneralDagalo` | **rsf** | Compte de Hemedti (chef RSF) | très peu de posts géolocalisables |
| `SudanBreaking` | **saf** | « عاجل السودان », pro-SAF (cadrage « milice DAF », couverture d'al-Burhan) | **quasi inactif depuis ~avril 2026** → 0 dans la fenêtre |
| `sudaaan` | **saf** | « السودان », actualités générales **pro-gouvernement / pro-SAF** | **actif mais firehose** : ~6 j seulement dans 8 pages, gros volume |
| `NewsfromSudan` | **neutre** | Documentation indépendante (droits humains) | actif, ~46 j, bon contributeur |
| `SudanTribune` | **neutre** | Presse indépendante soudanaise | aperçu quasi vide (posts = liens) → ~0 |
| `ourwarstoday` | **neutre** | Agrégateur OSINT guerres (mondial) | peu de contenu Soudan sur la fenêtre |
| `OSINTWarfare` | **neutre** | Agrégateur OSINT conflits (mondial) | peu de contenu Soudan sur la fenêtre |

Sources d'attribution du `lean` : IFRI, *Sudan Wartime Online Propaganda*
(2026) — confirme `@RSFSudan` et `@GeneralDagalo` comme comptes RSF officiels,
et documente que **l'écosystème pro-SAF est surtout Facebook / X / YouTube /
TV satellite, pas Telegram** — plus auto-description des canaux.

Le champ `channels[].coverage` du JSON expose, pour chaque canal, sa plage de
dates réellement captée, son nombre de messages « conflit » et de mentions
géolocalisées : **à regarder avant toute lecture des totaux** `sides`.

## Fenêtre

- `window_days = 60` (paramètre du build), soit `window = [AAAA-MM-JJ, aujourd'hui]`.
- Pagination via le lien natif `?before=<id>` de Telegram ; chaque canal est
  remonté jusqu'à ~8 pages. **Un canal très prolixe (sudaaan) ne remonte alors
  que quelques jours** : la profondeur réelle diffère d'un canal à l'autre
  (voir `coverage`).

## Méthode de géolocalisation (texte → lieu)

1. **Parsing** des aperçus : par message, on extrait le texte
   (`tgme_widget_message_text`) et la date (`<time datetime>`), avec dédoublonnage
   par id de message sur les pages qui se chevauchent.
2. **Filtre conflit** : un message n'est compté que s'il contient ≥1 terme de
   guerre/sécurité (arabe + latin : الجيش، الدعم السريع، اشتباك، قصف، مسيرة،
   هجوم، سيطر… / clash, shelling, drone, offensive, RSF, SAF…). Ça écarte les
   annonces d'emploi, la météo et le hors-sujet des gros canaux de news.
3. **Gazetteer bilingue** (`scripts/osint/gazetteer.py`) : ~50 localités +
   13 États. Noms d'États alignés sur **geoBoundaries** (ADM1, mêmes
   `shapeName`), centroïdes calculés depuis `data/boundaries/sudan_adm1.geojson`.
   Coordonnées des villes = points de localités connus. Chaque lieu a des alias
   **arabes et latins**.
4. **Appariement robuste** : normalisation arabe (retrait des harakat, unification
   alef/ya/ta-marbuta, tatweel) et latine (sans diacritiques, minuscules) ;
   gestion des **clitiques arabes** (و/ف/ب/ك/ل + article ال) et des frontières de
   mot pour limiter les faux positifs (ex. « مباراة » ne matche pas « بارا »).
5. **Agrégation** par localité/État : `count` (mentions), `last_date`, et
   `sides` = répartition par bord éditorial du canal émetteur.

Garde-fous appliqués dans le gazetteer : **États homonymes d'une ville capitale
(Khartoum, Gezira, Sennar, Kassala, Gedaref) non dupliqués** (représentés par la
ville) ; alias anglais « blue/white nile » retirés (bruit barrage GERD / fleuve).

## Secteurs de focus

Couverture dense sur **Kordofan** (axe El-Obeid / Bara, + En Nahud, Umm Rawaba,
Er Rahad, Babanusa, Muglad, El Fula, Kadugli, Dilling…) et **El-Fasher /
Darfour** (El Fasher, Nyala, Ed Daein, Zalingei, El Geneina, Tawila, Mellit…).

## Limites honnêtes

- **Géoloc bruitée** : homonymes, lieux cités « de loin », négations, reprises
  d'événements anciens, titres de médias (ex. الجزيرة), toponymes ambigus. Aucun
  effort de désambiguïsation sémantique — c'est volontairement grossier.
- **Biais de source / de volume** : les totaux `sides` reflètent **l'activité des
  canaux**, pas la réalité. Ici un canal pro-gouvernement très prolixe (sudaaan)
  domine le compte SAF sur seulement ~6 jours, tandis que le RSF s'appuie sur un
  canal officiel moins « tactique ». La **présence pro-SAF active sur Telegram
  est structurellement faible** (écosystème SAF ailleurs). → Lire la
  **présence/récence par camp et par localité**, jamais les totaux absolus.
- **Couverture temporelle inégale** entre canaux (cf. `coverage`).
- **Aperçus publics seulement** : un canal qui désactive `/s/` (ex. Shahid
  al-Sudan) n'est pas capté ; les posts médias sans texte ne sont pas géolocalisés.
- **Garde-fous Darfour** : granularité **localité/État minimum**, **aucun contenu
  nominatif**, **aucun suivi d'unités**, **aucun camp de déplacés**.
- **CGU** : consultation d'aperçus publics uniquement ; aucune rediffusion de
  contenu, seuls des comptes agrégés de mentions sont conservés.

## Schéma (`window.SUDAN.osint`)

```js
{
  generated:   "AAAA-MM-JJ",
  window_days: 60,
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
# 1. scraper les aperçus publics (serial, poli) → data/raw/osint/<canal>/page_*.html
python3 -I "$ABS/scripts/osint/scrape_tme.py" "$ABS/data/raw/osint" \
        "$ABS/scripts/osint/channels.json" 8
# 2. construire la couche (parse + géoloc + agrégation) → data/layer_osint.js
python3 -I "$ABS/scripts/osint/build_osint.py" "$ABS/data/raw/osint" \
        "$ABS/scripts/osint/channels.json" \
        "$ABS/data/boundaries/sudan_adm1.geojson" \
        "$ABS/data/layer_osint.js" 60
```

Tout tourne en `python3 -I`, chemins passés en arguments ; les données **non
fiables** restent dans `data/raw/osint/` et ne sont jamais importées comme code.
Si un canal échoue en SSL (sandbox), il peut être re-téléchargé à part via `curl`
dans `data/raw/osint/<canal>/page_NNN.html` (même format), puis rebuild.
```
