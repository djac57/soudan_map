# `layer_maps.js` — Known maps + SAF/RSF claims layers

Additive layer file. Loaded **after** `bundle.js`, it does
`window.SUDAN = window.SUDAN || {}` and attaches two new objects. It **touches no
existing file**.

```html
<!-- add after data/bundle.js, before app.js -->
<script src="data/layer_maps.js"></script>
```

Build/research snapshot: **2026-10-27**, enriched **2026-10-28**. Everything is
sourced, dated and tagged `approximatif` / `revendique, non verifie`. **No control
line is invented.**

> **Date caveat.** Several relaying outlets (notably Sudan Tribune) render a
> crawl/view date rather than the article date. Where a date was ambiguous the most
> defensible value is used and each item's `source` names the outlet so it can be
> re-checked. **A claim is not control.**

---

## Layer 1 — `window.SUDAN.known_maps` (CARTES CONNUES)

Reference list of public SAF/RSF **territorial-control** maps (the DeepState/ISW
equivalents), each with `name, author, url, date, license, reuse, note`.

| Map | License | Reuse without permission? |
|---|---|---|
| **Wikipedia/Wikimedia** `War in Sudan (2023)` (`Template:2023 Sudan war detailed map`) | **CC BY-SA 4.0** | **YES** (attribution + share-alike) |
| Sudan War Monitor | All rights reserved (Substack) | No |
| PolGeoNow (Political Geography Now) | Proprietary | No (permission required) |
| Thomas van Linge | No explicit license | No |
| LiveUAMap Sudan | Proprietary ToS | No |
| Sudans Post | Proprietary "Terms of Use" | No |
| EUAA country-guidance map (after PolGeoNow / van Linge) | EU reuse decision | Underlying map still PolGeoNow's |
| ACLED (event data under several maps) | Free non-commercial + attribution | Conditional |
| **Yale HRL** — Sudan Conflict Observatory (satellite analysis) | Reports public; maps under own terms | No |
| Reuters / AFP / Al Jazeera situation graphics | All rights reserved (news agency) | No |

**10 references recensed.** Only one source (Wikipedia, CC BY-SA 4.0) is **freely
reusable**; the others are **cited but not reproduced**. No permissively licensed,
georeferenced source exists that would allow a sketch finer than state level, so
the control layer stays at state level (below).

### `control_approx` — the approximate sketch (and why it is defensible)

`control_approx` points to **`data/control_adm1_approx.geojson`**, built by
`scripts/maps/build_control_adm1.py`.

**Honesty model — this is NOT a front line:**
- The script **reuses the real official geoBoundaries ADM1 (state) polygons**
  already shipped in the project. **No geometry is drawn or traced by hand.**
- It only attaches **one coarse control label per state** (`actor:
  SAF|RSF|contested|other`), read off from cross-referenced dated public
  reporting (the CC BY-SA Wikipedia map, Al Jazeera, Sudans Post, EUAA/PolGeoNow).
- Every feature is tagged `approx: true`, `date: "2026-10-27"`, with its source.

This sidesteps the reason a control layer was previously left `null`
(georeferencing/tracing a rendered map = invented coordinates): here the
coordinates are genuine administrative borders, and only a reported label is
added. **It remains coarse: control does NOT follow state lines** — besieged
cities (El-Obeid), pockets (Heglig) and internal fronts are not representable.
Marked clearly in the file's `_meta.disclaimer` and in `known_maps.note`.

Snapshot classification (19 features): **9 SAF** (centre/north/east, incl.
Khartoum retaken Mar 2025), **6 RSF** (all Darfur — El Fasher fell 2025-10-26 —
plus West Kordofan after Babanusa Dec 2025), **3 contested** (North Kordofan,
South Kordofan, Blue Nile), **1 other** (Abyei PCA, a Sudan/South-Sudan disputed
area).

Feature properties: `{ name, adm1_id, actor, date, source, approx:true }`.

---

## Layer 2 — `window.SUDAN.claims` (REVENDICATIONS SAF & RSF)

Localities whose capture/control is **publicly claimed** by each side, geocoded,
dated, with the relaying source. **Both camps separate and at equal footing.**
Every item is **"revendique, non verifie"**.

```
claims = {
  generated,
  saf: [ { lon, lat, place, adm1, date, claim, geo, source, contested? }, ... ],  // 29
  rsf: [ { ... }, ... ],                                                          // 32
  note
}
```

- `claim`: `"captured"` (fresh claim of taking) or `"held"` (claims to hold / de
  facto control).
- `geo`: `"gazetteer"` (reliable town coordinates) or `"approx"` (placed from a
  relative description / coarse gazetteer — to verify).
- `contested`: `true` = locality double-claimed and/or changed hands; it then
  appears on **both** lists on purpose (not deduplicated). App.js ignores the extra
  key; it is metadata for honesty/auditing.
- **SAF (29):** Khartoum state (palace, Bahri, Omdurman, Jebel Aulia); Gezira (Wad
  Madani, Rufaa, Tamboul, Al Hilaliya); Sennar (Jebel Moya, Singa, Ad-Dali, Al
  Mazmum); White Nile (Kosti, Rabak, Ed Dueim); North Kordofan (El-Obeid, Bara,
  Umm Sayala, Jabra al-Sheikh, Umm Garfa, Al-Baraka, Al-Mazroub, Kazgeil, Um Dam
  Haj Ahmed); Blue Nile (Ed Damazin, Bukuri, Uklili); Port Sudan; Heglig pocket.
- **RSF (32):** Darfur (El Fasher, Nyala, Zalingei, Ed Daein, El Geneina, Kulbus,
  Sirba, Mellit, Al-Malha, Um Keddada, Karnoi, Umm Baru); West Kordofan (El Fula,
  Babanusa, Muglad, En Nahud, Lagawa, Meiram, El Khawi, Wad Banda); South Kordofan
  (Al-Dibeibat, Kadugli, Dilling); Blue Nile (Kurmuk, Surkum); North Kordofan (Bara,
  Umm Sumeima, Kazgeil, Um Dam Haj Ahmed, Hamrat El Sheikh, Sodari, Umm Badr).
- **Contested / changed hands (on BOTH lists, deliberate):** Bara, Umm Sumeima,
  Kazgeil, Um Dam Haj Ahmed (North Kordofan belt); Al-Dibeibat (South Kordofan);
  Babanusa (West Kordofan); Kurmuk (Blue Nile); Heglig (SAF pocket in RSF state).
  **Bara** is the clearest case: it has changed hands repeatedly
  (SAF Sep 2025 → RSF Oct 2025 → ... → SAF Jul 2026 → RSF ~Oct 2026).

---

## Honest limits

- A **claim is not control.** These layers show *who says what*, not verified
  ground truth. Several localities changed hands or are double-claimed.
- `control_approx` is a **state-level reading**: it cannot show front lines,
  sieges or pockets. For a true control line, trace a dated, properly licensed
  source map (only the CC BY-SA Wikipedia map qualifies here).
- Small-locality coordinates flagged `geo:"approx"` (Singa, Al-Malha, Umm
  Sumeima, Al-Dibeibat) are from relative descriptions / coarse gazetteer and
  should be verified before any precise display.
- **Darfur guardrail:** localities only — no unit tracking, no nominative data,
  no IDP-camp granularity.

## Rebuild

```
# approximate state-level control sketch (reuses real ADM1 geometry; invents nothing)
python3 -I scripts/maps/build_control_adm1.py \
  data/boundaries/sudan_adm1.geojson \
  data/control_adm1_approx.geojson
```

`layer_maps.js` and the claims list are hand-curated from dated public reporting
(see per-item `source`); edit the arrays in place and keep the
`revendique/non verifie` + `approx` tags.

## Files created (ownership-safe)

- `data/layer_maps.js` — the deliverable (sets `known_maps` + `claims`).
- `data/control_adm1_approx.geojson` — the approximate control polygons.
- `scripts/maps/build_control_adm1.py` — builder for the geojson.
- `data/layer_maps.README.md` — this file.

Nothing else is modified. Raw/untrusted inputs belong in `data/raw/maps/`.
