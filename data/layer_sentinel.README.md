# Couche Sentinel — `data/layer_sentinel.js`

Imagerie satellite vraies couleurs pour la carte Soudan. Fichier chargé **après**
`data/bundle.js` par un `<script>` ; il ne modifie rien, il ajoute seulement
`window.SUDAN.sentinel`.

## Ce qui est exposé

`window.SUDAN.sentinel = { tiles, date, periode, key_required, source, license,
composites[], scenes[], change_pairs[], note, generated }`

- **tiles** (Palier 1) — couche de tuiles Leaflet par défaut (mosaïque la plus
  récente, 2025). `url` au format XYZ `{z}/{y}/{x}`, `attribution`, `maxZoom` 16,
  `maxNativeZoom` 14, `bounds` Soudan.
- **composites[]** — les 6 mosaïques annuelles disponibles (2020→2025) pour un
  sélecteur / une comparaison temporelle.
- **scenes[]** (Palier 2) — vues cadrées sur les focus **El-Fasher** et
  **Kordofan** (mêmes tuiles keyless + `bbox`, `center`, `zoom`, et un aperçu JPEG
  réel `preview` dans `data/raw/sentinel/`).
- **change_pairs[]** (Palier 3, partiel) — comparatif visuel *avant/après*
  (2023→2025) **indicatif** sur l'axe logistique du Kordofan uniquement.

## Source & licence

- **Source** : EOX::Maps « Sentinel-2 cloudless » (`s2maps.eu`), service WMTS/WMS
  public et **anonyme**.
- **Licence** : **CC BY 4.0** — *contient des données Copernicus Sentinel
  modifiées* par EOX IT Services GmbH. Attribution obligatoire (voir
  `tiles.attribution`).
- **Avec/sans clé** : **SANS clé**. `key_required: false`. Aucune clé n'est lue ni
  écrite. (`~/.config/` ne contient qu'un identifiant **NASA Earthdata**, pas de
  jeton Copernicus/SentinelHub — donc pas de scène datée réelle ici.)

## Date / honnêteté

- Imagerie = **mosaïques ANNUELLES sans nuages** (composites), **pas** des
  acquisitions datées uniques. La « date » affichée est l'**année du composite**.
- Résolution ~**10 m/px**, zoom natif max ~14.
- **Pas** d'analyse d'impacts/texture/fortifications. Le pipeline Ukraine
  (détection par asymétrie) demande des mois et des scènes datées appariées :
  hors périmètre.
- **Garde-fou Darfour** : aucun produit dérivé ne cible des camps de déplacés ;
  le before/after est limité au Kordofan (El-Obeid/Bara).

## Roadmap (non livré)

- Scènes datées réelles → nécessitent un jeton **Copernicus Data Space /
  SentinelHub** (absent).
- Alternative keyless **NASA GIBS HLS** (S30 = Sentinel-2 daté) testée le
  2026-10-27 : couverture trop lacunaire sur le Soudan (tuiles vides) pour une
  couche statique fiable.
- Proxy **NBR/NDVI-diff** « cicatrices de combat/brûlures » : à faire proprement
  sur paires de scènes datées, étiqueté « indicatif ».

## Scripts & données

- `scripts/sentinel/fetch_scenes.py` — télécharge les aperçus focus via EOX WMS
  (`python -I`, chemins/paramètres en arguments, aucune clé).
  Ex. : `python -I scripts/sentinel/fetch_scenes.py data/raw/sentinel s2cloudless-2025 el_fasher 24.6 12.9 26.1 14.3`
- `data/raw/sentinel/` — aperçus JPEG réels (données externes non fiables) +
  petits `.json` de métadonnées par scène.

## Intégration

```html
<script src="data/bundle.js"></script>
<script src="data/layer_sentinel.js"></script>
<script>
  var s = window.SUDAN.sentinel;
  L.tileLayer(s.tiles.url, {
    attribution: s.tiles.attribution,
    maxZoom: s.tiles.maxZoom,
    maxNativeZoom: s.tiles.maxNativeZoom,
  }); // .addTo(map)
</script>
```
