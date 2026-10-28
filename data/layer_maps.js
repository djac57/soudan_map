/*
 * layer_maps.js — two ADDITIVE layers for the Sudan map, loaded AFTER bundle.js.
 *
 *   window.SUDAN.known_maps  : Layer 1 — CARTES CONNUES (reference control maps)
 *   window.SUDAN.claims      : Layer 2 — REVENDICATIONS SAF & RSF (claimed captures)
 *
 * This file touches nothing else: it only augments the global `window.SUDAN`
 * object that bundle.js already sets. All content is sourced, dated and tagged
 * "approximatif" / "revendique, non verifie". No control line is invented.
 *
 * Darfur guardrail respected: localities only, no unit tracking, no nominative
 * data, no IDP-camp granularity.
 *
 * Built 2026-10-27 (research snapshot). Sources cited inline per item.
 */
(function () {
  "use strict";
  window.SUDAN = window.SUDAN || {};

  /* =====================================================================
   * LAYER 1 — KNOWN MAPS (equivalent of DeepState/ISW for Ukraine)
   * Public SAF/RSF territorial-control maps, each with author, URL, last
   * update and LICENSE (whether reuse is permitted). The `control_approx`
   * sketch below is built ONLY from the permissively licensed references.
   * ===================================================================== */
  window.SUDAN.known_maps = {
    generated: "2026-10-27",

    references: [
      {
        name: "War in Sudan (2023) — Wikipedia/Wikimedia map",
        author: "Wikipedia editors (file War_in_Sudan_(2023).svg; Template:2023 Sudan war detailed map)",
        url: "https://commons.wikimedia.org/wiki/File:War_in_Sudan_(2023).svg",
        date: "updated continuously (infobox caption: situation as of 2026-09-27)",
        license: "CC BY-SA 4.0 — REUSE PERMITTED with attribution + share-alike",
        reuse: true,
        note: "Open data: a crowd-maintained detailed-map template of settlements tagged by controlling faction. Used as the primary cross-reference for the approximate sketch."
      },
      {
        name: "Sudan War Monitor — Areas of Control",
        author: "Sudan War Monitor (editor Aliaa Elamin / contributors)",
        url: "https://sudanwarmonitor.com/",
        date: "periodic (2023–present)",
        license: "All rights reserved (Substack) — reuse NOT freely licensed; permission required",
        reuse: false,
        note: "Built from geolocated combat videos, credible news/social-media reports and own military assessment; flags its own approximation on emerging fronts."
      },
      {
        name: "PolGeoNow (Political Geography Now) — Sudan control map",
        author: "Evan Centanni & Djordje Djukic",
        url: "https://www.polgeonow.com/",
        date: "periodic (subscriber updates)",
        license: "Proprietary — reuse requires explicit permission (stated on site)",
        reuse: false,
        note: "Redrawn from news, UN/NGO reports and thousands of ACLED data points. Basis of the EUAA country-guidance map."
      },
      {
        name: "Thomas van Linge — conflict control maps",
        author: "Thomas van Linge (independent conflict mapper)",
        url: "https://x.com/ThomasVLinge",
        date: "periodic (shared on X)",
        license: "No explicit open license — all rights reserved; cited by EUAA with attribution",
        reuse: false,
        note: "Widely reused in analysis with attribution; underlies the EUAA March-2025 Sudan map."
      },
      {
        name: "LiveUAMap — Sudan",
        author: "LiveUAMap (Live Universal Awareness Map)",
        url: "https://sudan.liveuamap.com/",
        date: "near-real-time crowdsourced",
        license: "Proprietary Terms of Use — no open reuse of the map layer",
        reuse: false,
        note: "Event/marker aggregator rather than a drawn control polygon layer."
      },
      {
        name: "Sudans Post — territorial control maps",
        author: "Sudans Post (field correspondents)",
        url: "https://sudanspost.com/",
        date: "periodic (e.g. assessment as of 2026-06-21)",
        license: "Proprietary 'Terms of Use' — reuse restricted",
        reuse: false,
        note: "Built from field reports, eyewitness accounts, satellite imagery and local verification. Used as a dated cross-reference for state-level control only."
      },
      {
        name: "EUAA — Sudan country guidance, areas of control map",
        author: "EU Agency for Asylum (map after PolGeoNow / Thomas van Linge)",
        url: "https://www.euaa.europa.eu/country-guidance-sudan/21-map-areas-control-and-influence",
        date: "as of March 2025 (June-2025 guidance)",
        license: "EU document — reuse under the EU reuse decision (attribution); underlying map remains PolGeoNow's",
        reuse: false,
        note: "Institutional snapshot; useful dated cross-reference."
      },
      {
        name: "ACLED — Armed Conflict Location & Event Data (Sudan)",
        author: "ACLED",
        url: "https://acleddata.com/",
        date: "weekly updates",
        license: "Free for non-commercial use with attribution under ACLED Terms & Attribution Policy",
        reuse: "conditional",
        note: "Not a control map but the event dataset underpinning several of the maps above; used here only as corroboration, not traced."
      }
    ],

    /* Approximate control sketch — built ONLY from permissively usable material
     * (the CC BY-SA Wikipedia detailed map, cross-checked against Al Jazeera,
     * Sudans Post and EUAA/PolGeoNow dated descriptions). Geometry is the REAL
     * geoBoundaries ADM1 (state) borders already shipped in the project — no
     * line is drawn or traced by hand. Only a coarse control label is attached
     * per state. This is NOT a front line. */
    control_approx: [
      {
        geojson_url: "data/control_adm1_approx.geojson",
        actor: "mixed",            // one file, each feature tagged SAF/RSF/contested/other
        date: "2026-10-27",
        approx: true,
        method: "state-level classification of official geoBoundaries ADM1 polygons (no geometry invented)",
        source: "Wikipedia 'War in Sudan (2023)' map (CC BY-SA 4.0), cross-checked vs Al Jazeera / Sudans Post / EUAA",
        label: "approximatif, lecture au niveau de l'Etat — a valider"
      }
    ],

    note: ("Couche CARTES CONNUES : recense les cartes publiques de controle SAF/RSF avec " +
           "auteur, URL, date et licence. UNE seule source (carte Wikipedia, CC BY-SA 4.0) " +
           "est reutilisable sans permission ; les autres sont citees mais NON reproduites. " +
           "L'esquisse 'control_approx' n'est PAS une ligne de front : c'est une coloration " +
           "APPROXIMATIVE des Etats (geometrie administrative reelle) selon le controle rapporte, " +
           "tag approx:true. Le controle ne suit pas les limites d'Etat (villes assiegees, poches, " +
           "fronts internes non representes). A valider contre une carte sourcee.")
  };

  /* =====================================================================
   * LAYER 2 — SAF & RSF CLAIMS (equivalent of the RF-MoD / UA-General-Staff
   * claim layers for Ukraine). Localities whose capture/control is PUBLICLY
   * CLAIMED by each side, geocoded, dated, with the relaying source.
   * BOTH sides are presented SEPARATELY and at EQUAL footing.
   * Every item is "revendique, non verifie".
   *
   * `geo`: "gazetteer" = reliable town coordinates; "approx" = placed from a
   *        relative description / coarse gazetteer, to be verified.
   * `claim`: "captured" (fresh claim) or "held" (claims to hold / de facto).
   * Darfur guardrail: localities only; no units; no camp-level detail.
   * ===================================================================== */
  window.SUDAN.claims = {
    generated: "2026-10-27",

    saf: [
      { lon: 32.5599, lat: 15.5007, place: "Khartoum (full control / presidential palace)",
        adm1: "Khartoum", date: "2025-03-26", claim: "captured", geo: "gazetteer",
        source: "SAF statement via Arab News / ACLED" },
      { lon: 32.4833, lat: 15.6500, place: "Omdurman (last RSF pockets cleared)",
        adm1: "Khartoum", date: "2025-03", claim: "captured", geo: "gazetteer",
        source: "SAF statements / ACLED" },
      { lon: 33.5199, lat: 14.4012, place: "Wad Madani",
        adm1: "Gezira", date: "2025-01-11", claim: "captured", geo: "gazetteer",
        source: "SAF statement / ACLED" },
      { lon: 33.9300, lat: 13.1500, place: "Singa (Sennar state capital)",
        adm1: "Sennar", date: "2025-01", claim: "captured", geo: "approx",
        source: "SAF / ACLED (Sennar & Gezira capitals retaken by end-Mar 2025)" },
      { lon: 30.3669, lat: 13.7050, place: "Bara",
        adm1: "North Kordofan", date: "2026-03-05", claim: "captured", geo: "gazetteer",
        source: "SAF statement via Al Jazeera (2026-03-06); re-claimed Jul 2026 (changed hands)" },
      { lon: 30.2167, lat: 13.1833, place: "El-Obeid (secured; Khartoum–Kordofan highway reopened)",
        adm1: "North Kordofan", date: "2026-03", claim: "held", geo: "gazetteer",
        source: "SAF via Ahram / The National" },
      { lon: 29.7200, lat: 13.1800, place: "Umm Sumeima (RSF pushed out, joint forces)",
        adm1: "North Kordofan", date: "2025-07", claim: "captured", geo: "approx",
        source: "SAF/joint-forces claim via Sudans Post (~55 km W of El-Obeid)" }
    ],

    rsf: [
      { lon: 25.3494, lat: 13.6279, place: "El Fasher (6th Inf. Div. HQ / full control)",
        adm1: "North Darfur", date: "2025-10-26", claim: "captured", geo: "gazetteer",
        source: "RSF statement via Radio Dabanga / Al Jazeera (SAF confirmed withdrawal)" },
      { lon: 27.8000, lat: 11.3333, place: "Babanusa (22nd Inf. Div. HQ)",
        adm1: "West Kordofan", date: "2025-12-03", claim: "captured", geo: "gazetteer",
        source: "RSF / Ta'sis statement via Arab News / Radio Dabanga (Sudan Witness verified)" },
      { lon: 24.8807, lat: 12.0489, place: "Nyala (RSF Darfur hub / de facto seat)",
        adm1: "South Darfur", date: "2023-2026", claim: "held", geo: "gazetteer",
        source: "widely reported; RSF-held since 2023" },
      { lon: 26.1833, lat: 15.1500, place: "Al-Malha",
        adm1: "North Darfur", date: "2025-03", claim: "captured", geo: "approx",
        source: "RSF claim via Darfur reporting (far-north desert town)" },
      { lon: 29.7200, lat: 13.1800, place: "Umm Sumeima (claimed control)",
        adm1: "North Kordofan", date: "2025-07", claim: "captured", geo: "approx",
        source: "RSF claim via Radio Dabanga — both sides claimed it (contested)" },
      { lon: 30.0000, lat: 11.5200, place: "Al-Dibeibat (Tayba Triangle)",
        adm1: "South Kordofan", date: "2025", claim: "captured", geo: "approx",
        source: "RSF claim via Kordofan reporting (crossroads of the 3 Kordofan states)" }
    ],

    note: ("Couche REVENDICATIONS : localites dont la prise/le controle est REVENDIQUE " +
           "publiquement par la SAF (armee) ou la RSF, geocodees et datees. Les deux camps " +
           "sont presentes SEPAREMENT et a parts egales. CHAQUE point est 'revendique, NON " +
           "VERIFIE' — une revendication n'est pas une preuve de controle, et plusieurs " +
           "localites (ex. Umm Sumeima, Bara) ont change de mains ou sont revendiquees par " +
           "les deux camps. geo='approx' = point place d'apres une description relative / " +
           "gazetteer grossier, a verifier. Garde-fou Darfour : localites uniquement, aucune " +
           "unite suivie, aucune donnee nominative, aucune granularite camp de deplaces.")
  };
})();
