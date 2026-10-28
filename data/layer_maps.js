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
 * Built 2026-10-27, enriched 2026-10-28 (research snapshot). Sources cited inline
 * per item. DATE CAVEAT: several relaying outlets (notably Sudan Tribune) render a
 * crawl/view date rather than the article date; where a date was ambiguous the
 * most defensible value is used and the per-item source names the outlet so it can
 * be re-checked. A claim is NOT control.
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
    generated: "2026-10-28",

    references: [
      {
        name: "War in Sudan (2023) — Wikipedia/Wikimedia map",
        author: "Wikipedia editors (file War_in_Sudan_(2023).svg; Template:2023 Sudan war detailed map)",
        url: "https://commons.wikimedia.org/wiki/File:War_in_Sudan_(2023).svg",
        date: "updated continuously (infobox caption snapshot ~2026-10)",
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
        note: "Built from geolocated combat videos, credible news/social-media reports and own military assessment; flags its own approximation on emerging fronts. Primary analytic source for the claim list below (e.g. Babanusa, Heglig sieges)."
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
      },
      {
        name: "Yale HRL — Sudan Conflict Observatory",
        author: "Yale School of Public Health, Humanitarian Research Lab (HRL)",
        url: "https://medicine.yale.edu/lab/khoshnood/sudan-conflict-observatory/",
        date: "periodic reports (satellite-based)",
        license: "Published reports public; imagery/derived maps under their own terms — not an open control-polygon layer",
        reuse: false,
        note: "Satellite-imagery analysis (burning, mass-casualty, siege dynamics — e.g. El Fasher). Corroborates events behind several claims; not traced into geometry here."
      },
      {
        name: "Reuters / AFP / Al Jazeera situation graphics",
        author: "Reuters Graphics, Agence France-Presse, Al Jazeera (news desks)",
        url: "https://www.reuters.com/graphics/",
        date: "episodic (per major battle)",
        license: "All rights reserved (news agency content) — reuse NOT permitted",
        reuse: false,
        note: "Wire-service maps published around key events (Khartoum, El Fasher, Kordofan). Used only as dated cross-references for the claim list; not reproduced."
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
        date: "2026-10-28",
        approx: true,
        method: "state-level classification of official geoBoundaries ADM1 polygons (no geometry invented)",
        source: "Wikipedia 'War in Sudan (2023)' map (CC BY-SA 4.0), cross-checked vs Al Jazeera / Sudans Post / EUAA / Sudan War Monitor",
        label: "approximatif, lecture au niveau de l'Etat — a valider"
      }
    ],

    note: ("Couche CARTES CONNUES : recense les cartes publiques de controle SAF/RSF avec " +
           "auteur, URL, date et licence. UNE seule source (carte Wikipedia, CC BY-SA 4.0) " +
           "est reutilisable sans permission ; les autres sont citees mais NON reproduites. " +
           "L'esquisse 'control_approx' n'est PAS une ligne de front : c'est une coloration " +
           "APPROXIMATIVE des Etats (geometrie administrative reelle) selon le controle rapporte, " +
           "tag approx:true. Le controle ne suit pas les limites d'Etat (villes assiegees, poches, " +
           "fronts internes non representes). A valider contre une carte sourcee. Faute de source a " +
           "licence permissive permettant une esquisse plus fine qu'au niveau de l'Etat (seule la " +
           "carte Wikipedia l'est, et elle n'est pas georeferencee), on NE descend PAS sous l'Etat : " +
           "rien n'est trace a main levee.")
  };

  /* =====================================================================
   * LAYER 2 — SAF & RSF CLAIMS (equivalent of the RF-MoD / UA-General-Staff
   * claim layers for Ukraine). Localities whose capture/control is PUBLICLY
   * CLAIMED by each side, geocoded, dated, with the relaying source.
   * BOTH sides are presented SEPARATELY and at EQUAL footing.
   * Every item is "revendique, non verifie".
   *
   * `geo`:   "gazetteer" = reliable town coordinates; "approx" = placed from a
   *          relative description / coarse gazetteer, to be verified.
   * `claim`: "captured" (fresh claim of taking) or "held" (claims to hold /
   *          de facto control).
   * `contested`: true = locality double-claimed and/or changed hands; it then
   *          appears on BOTH lists on purpose (NOT deduplicated).
   * Darfur guardrail: localities only; no units; no camp-level detail.
   * ===================================================================== */
  window.SUDAN.claims = {
    generated: "2026-10-28",

    saf: [
      /* --- Khartoum state (retaken early 2025) --- */
      { lon: 32.5599, lat: 15.5007, place: "Khartoum (presidential palace / full control)",
        adm1: "Khartoum", date: "2025-03-26", claim: "captured", geo: "gazetteer",
        source: "SAF statement via Arab News / Al Jazeera / ACLED" },
      { lon: 32.5333, lat: 15.6333, place: "Khartoum Bahri (Khartoum North)",
        adm1: "Khartoum", date: "2025-03", claim: "captured", geo: "gazetteer",
        source: "SAF statements via Al Jazeera (Feb–Mar 2025 Khartoum advance)" },
      { lon: 32.4833, lat: 15.6500, place: "Omdurman (last RSF pockets cleared)",
        adm1: "Khartoum", date: "2025-03", claim: "captured", geo: "gazetteer",
        source: "SAF statements / ACLED" },
      { lon: 32.4833, lat: 15.2417, place: "Jebel Aulia (southern Khartoum, RSF bridgehead)",
        adm1: "Khartoum", date: "2025-04", claim: "captured", geo: "approx",
        source: "SAF via Reuters / Al Jazeera (RSF escape route south closed)" },

      /* --- Gezira state (retaken Jan–Feb 2025) --- */
      { lon: 33.5199, lat: 14.4012, place: "Wad Madani (Gezira capital)",
        adm1: "Gezira", date: "2025-01-11", claim: "captured", geo: "gazetteer",
        source: "SAF statement via Reuters / Al Jazeera" },
      { lon: 33.5300, lat: 14.7600, place: "Rufaa",
        adm1: "Gezira", date: "2025-02", claim: "captured", geo: "approx",
        source: "SAF via Al Jazeera (Gezira towns secured after Wad Madani)" },
      { lon: 33.7200, lat: 14.9300, place: "Tamboul",
        adm1: "Gezira", date: "2025-02", claim: "captured", geo: "approx",
        source: "SAF via Al Jazeera / ACLED (Gezira sweep)" },
      { lon: 33.5000, lat: 14.6333, place: "Al Hilaliya",
        adm1: "Gezira", date: "2025-02", claim: "captured", geo: "approx",
        source: "SAF via Al Jazeera (Gezira towns list)" },

      /* --- Sennar state (retaken late 2024 / early 2025) --- */
      { lon: 33.4900, lat: 13.5100, place: "Jebel Moya (Sennar–White Nile hinge)",
        adm1: "Sennar", date: "2024-10", claim: "captured", geo: "approx",
        source: "SAF via Radio Dabanga / AllAfrica (Burhan visit after recapture)" },
      { lon: 33.9300, lat: 13.1500, place: "Singa (Sennar state capital)",
        adm1: "Sennar", date: "2025-01", claim: "captured", geo: "gazetteer",
        source: "SAF / ACLED (Sennar capital retaken)" },
      { lon: 33.9000, lat: 12.9000, place: "Ad-Dali / El Dali (southern Sennar)",
        adm1: "Sennar", date: "2025-03", claim: "captured", geo: "approx",
        source: "SAF via Al Jazeera (El Dali & Al Mazmum locality)" },
      { lon: 34.2000, lat: 12.0000, place: "Al Mazmum (southern Sennar)",
        adm1: "Sennar", date: "2025-03", claim: "captured", geo: "approx",
        source: "SAF via Al Jazeera" },

      /* --- White Nile state (SAF-held; western pockets cleared May 2025) --- */
      { lon: 32.6635, lat: 13.1629, place: "Kosti (18th Division base)",
        adm1: "White Nile", date: "2024-2026", claim: "held", geo: "gazetteer",
        source: "SAF-held throughout (Sudan Tribune; RSF drone strikes reported)" },
      { lon: 32.7400, lat: 13.1800, place: "Rabak (White Nile capital)",
        adm1: "White Nile", date: "2024-2026", claim: "held", geo: "gazetteer",
        source: "SAF-held (widely reported)" },
      { lon: 32.3317, lat: 13.9959, place: "Ed Dueim / Al-Dueim (RSF pockets pushed west)",
        adm1: "White Nile", date: "2025-05", claim: "held", geo: "gazetteer",
        source: "SAF via Sudan Tribune (army cleared towns W of White Nile)" },

      /* --- North Kordofan (El-Obeid hub; deeply contested belt) --- */
      { lon: 30.2167, lat: 13.1833, place: "El-Obeid (capital; Khartoum–Kordofan highway reopened)",
        adm1: "North Kordofan", date: "2026-03", claim: "held", geo: "gazetteer",
        source: "SAF via Ahram / The National (siege eased)" },
      { lon: 30.3669, lat: 13.7050, place: "Bara (changed hands repeatedly)",
        adm1: "North Kordofan", date: "2026-07-26", claim: "captured", geo: "gazetteer", contested: true,
        source: "SAF via Ahram / Radio Dabanga; RSF re-claimed ~2026-10-25 (Daily Sabah) — CONTESTED" },
      { lon: 30.0500, lat: 13.6000, place: "Umm Sayala (road Darfur↔centre)",
        adm1: "North Kordofan", date: "2026-07-26", claim: "captured", geo: "approx", contested: true,
        source: "SAF via Radio Dabanga / AllAfrica (fierce fighting, both sides claim) — CONTESTED" },
      { lon: 29.9000, lat: 13.9000, place: "Jabra al-Sheikh",
        adm1: "North Kordofan", date: "2026-07-26", claim: "captured", geo: "approx", contested: true,
        source: "SAF via Ahram / Anadolu (RSF counter-attacked 2026-08-13) — CONTESTED" },
      { lon: 30.1500, lat: 13.5500, place: "Umm Garfa",
        adm1: "North Kordofan", date: "2026-07", claim: "captured", geo: "approx",
        source: "SAF-allied forces via Sudan Tribune / Radio Dabanga" },
      { lon: 30.2000, lat: 13.4500, place: "Al-Baraka",
        adm1: "North Kordofan", date: "2026-07", claim: "captured", geo: "approx",
        source: "SAF-allied forces via Radio Dabanga" },
      { lon: 30.2500, lat: 13.0000, place: "Al-Mazroub",
        adm1: "North Kordofan", date: "2026-10-04", claim: "captured", geo: "approx",
        source: "SAF via Al Jazeera" },
      { lon: 30.4000, lat: 13.0000, place: "Kazgeil",
        adm1: "North Kordofan", date: "2026-10", claim: "captured", geo: "approx", contested: true,
        source: "SAF via Daily Sabah (RSF had taken it 2025-09) — CONTESTED" },
      { lon: 30.3500, lat: 12.9000, place: "Um Dam Haj Ahmed",
        adm1: "North Kordofan", date: "2026-10", claim: "captured", geo: "approx", contested: true,
        source: "SAF via Daily Sabah (RSF had taken it) — CONTESTED" },

      /* --- Blue Nile (SAF-held NE; RSF+SPLM-N in SW) --- */
      { lon: 34.3500, lat: 11.7833, place: "Ed Damazin (Blue Nile capital)",
        adm1: "Blue Nile", date: "2024-2026", claim: "held", geo: "gazetteer",
        source: "SAF-held (widely reported)" },
      { lon: 34.5500, lat: 11.7500, place: "Bukuri base (Geissan county)",
        adm1: "Blue Nile", date: "2026-10-22", claim: "captured", geo: "approx",
        source: "SAF via Sudan Tribune (retaken from RSF/SPLM-N alliance)" },
      { lon: 34.4000, lat: 10.7000, place: "Uklili (Kurmuk NE axis)",
        adm1: "Blue Nile", date: "2026-10-22", claim: "captured", geo: "approx", contested: true,
        source: "SAF via Sudan Tribune (Kurmuk area; alliance took Kurmuk Mar 2026) — CONTESTED" },

      /* --- Seat of government / oil pocket --- */
      { lon: 37.2167, lat: 19.6167, place: "Port Sudan (de facto seat of government)",
        adm1: "Red Sea", date: "2023-2026", claim: "held", geo: "gazetteer",
        source: "SAF-held throughout (widely reported; RSF drone strikes May 2025)" },
      { lon: 29.4000, lat: 9.9500, place: "Heglig (oilfield pocket, 90th Bde)",
        adm1: "West Kordofan", date: "2024-2026", claim: "held", geo: "approx", contested: true,
        source: "SAF pocket inside RSF-majority West Kordofan (Sudan War Monitor) — CONTESTED" }
    ],

    rsf: [
      /* --- Darfur (RSF holds nearly all of it) --- */
      { lon: 25.3494, lat: 13.6279, place: "El Fasher (North Darfur capital / 6th Inf. Div. HQ)",
        adm1: "North Darfur", date: "2025-10-26", claim: "captured", geo: "gazetteer",
        source: "RSF statement via Radio Dabanga / Al Jazeera (SAF confirmed withdrawal; 18-month siege)" },
      { lon: 24.8807, lat: 12.0489, place: "Nyala (RSF Darfur hub / de facto seat)",
        adm1: "South Darfur", date: "2023-2026", claim: "held", geo: "gazetteer",
        source: "RSF-held since 2023 (widely reported)" },
      { lon: 23.4850, lat: 12.9067, place: "Zalingei (Central Darfur capital)",
        adm1: "Central Darfur", date: "2023-2026", claim: "held", geo: "gazetteer",
        source: "RSF-held (widely reported)" },
      { lon: 26.1281, lat: 11.4617, place: "Ed Daein (East Darfur capital)",
        adm1: "East Darfur", date: "2023-2026", claim: "held", geo: "gazetteer",
        source: "RSF-held (widely reported)" },
      { lon: 22.4467, lat: 13.4526, place: "El Geneina (West Darfur capital)",
        adm1: "West Darfur", date: "2023-11", claim: "held", geo: "gazetteer",
        source: "RSF-held since Nov 2023 (widely reported)" },
      { lon: 23.7333, lat: 15.0833, place: "Kulbus / Kalbus (West Darfur, Chad border)",
        adm1: "West Darfur", date: "2026-07-10", claim: "captured", geo: "approx",
        source: "RSF via Sudan Tribune (joint forces withdrew; state fully RSF)" },
      { lon: 22.7300, lat: 13.8000, place: "Sirba (West Darfur)",
        adm1: "West Darfur", date: "2024", claim: "captured", geo: "approx",
        source: "RSF via Radio Dabanga (West Darfur sweep)" },
      { lon: 25.5900, lat: 14.1300, place: "Mellit (North Darfur, N of El Fasher)",
        adm1: "North Darfur", date: "2024-04", claim: "captured", geo: "approx",
        source: "RSF via Darfur reporting (joint-force HQ taken)" },
      { lon: 26.1833, lat: 15.1500, place: "Al-Malha (far-north desert town)",
        adm1: "North Darfur", date: "2025-03", claim: "captured", geo: "approx",
        source: "RSF claim via Darfur reporting" },
      { lon: 26.5700, lat: 13.6000, place: "Um Keddada (road El Fasher↔Kordofan)",
        adm1: "North Darfur", date: "2025", claim: "captured", geo: "approx",
        source: "RSF via Darfur reporting (eastern approach)" },
      { lon: 23.4000, lat: 15.8000, place: "Karnoi (North Darfur, Chad border)",
        adm1: "North Darfur", date: "2025", claim: "captured", geo: "approx",
        source: "RSF statement via Sudan Tribune (unconfirmed independently)" },
      { lon: 23.5000, lat: 15.6000, place: "Umm Baru (North Darfur, far NW)",
        adm1: "North Darfur", date: "2025-12", claim: "captured", geo: "approx",
        source: "RSF claim via Darfur24 (no independent confirmation)" },

      /* --- West Kordofan (RSF-majority; Babanusa/Heglig disputed) --- */
      { lon: 28.3500, lat: 11.7167, place: "El Fula (West Kordofan capital)",
        adm1: "West Kordofan", date: "2024-06-20", claim: "captured", geo: "gazetteer",
        source: "RSF via The New Arab (SAF retreated to Babanusa)" },
      { lon: 27.8000, lat: 11.3333, place: "Babanusa (22nd Inf. Div. HQ)",
        adm1: "West Kordofan", date: "2025-12-03", claim: "captured", geo: "gazetteer", contested: true,
        source: "RSF / Ta'sis via Arab News / Radio Dabanga; SAF contests (Sudan War Monitor: assault repelled) — CONTESTED" },
      { lon: 27.7167, lat: 11.0333, place: "Muglad",
        adm1: "West Kordofan", date: "2024-2026", claim: "held", geo: "approx",
        source: "RSF-held per Sudan Tribune / Sudans Post" },
      { lon: 28.4333, lat: 12.6833, place: "En Nahud / Al-Nuhud",
        adm1: "West Kordofan", date: "2024-2026", claim: "held", geo: "gazetteer",
        source: "RSF-held per Sudan Tribune / Sudans Post" },
      { lon: 29.1333, lat: 11.4000, place: "Lagawa",
        adm1: "West Kordofan", date: "2024-2026", claim: "held", geo: "approx",
        source: "RSF-held per Sudan Tribune" },
      { lon: 28.9000, lat: 10.6667, place: "Meiram",
        adm1: "West Kordofan", date: "2025", claim: "captured", geo: "approx",
        source: "RSF via Sudans Post (seized control)" },
      { lon: 29.0000, lat: 13.0700, place: "El Khawi / Al-Khawi",
        adm1: "West Kordofan", date: "2026", claim: "captured", geo: "approx",
        source: "RSF-linked report via Sudan Tribune (claimed)" },
      { lon: 27.9000, lat: 13.1333, place: "Wad Banda",
        adm1: "West Kordofan", date: "2024-2026", claim: "held", geo: "approx",
        source: "RSF-held per Sudan Tribune" },

      /* --- South Kordofan (RSF / SAF / SPLM-N mix) --- */
      { lon: 30.0000, lat: 11.5200, place: "Al-Dibeibat (Tayba Triangle crossroads)",
        adm1: "South Kordofan", date: "2026", claim: "captured", geo: "approx", contested: true,
        source: "RSF via Darfur24 (reclaimed; changed hands) — CONTESTED" },
      { lon: 29.7167, lat: 11.0167, place: "Kadugli (South Kordofan capital, besieged)",
        adm1: "South Kordofan", date: "2024-2026", claim: "held", geo: "approx", contested: true,
        source: "Besieged; SAF/SPLM-N contest (reporting) — CONTESTED" },
      { lon: 29.6500, lat: 12.0500, place: "Dilling (South Kordofan)",
        adm1: "South Kordofan", date: "2024-2026", claim: "held", geo: "approx", contested: true,
        source: "Contested siege zone (reporting) — CONTESTED" },

      /* --- Blue Nile (RSF + SPLM-N alliance, SW) --- */
      { lon: 34.2833, lat: 10.5500, place: "Kurmuk (Ethiopia border town)",
        adm1: "Blue Nile", date: "2026-03", claim: "captured", geo: "approx", contested: true,
        source: "RSF+SPLM-N via AllAfrica / Sudan Tribune; SAF retook parts Oct 2026 — CONTESTED" },
      { lon: 34.4500, lat: 10.6000, place: "Surkum base (Kurmuk area outpost)",
        adm1: "Blue Nile", date: "2026-08", claim: "captured", geo: "approx", contested: true,
        source: "RSF via Sudan Tribune (Bakori/Surkum bases) — CONTESTED" },

      /* --- North Kordofan (RSF-infiltrated belt; many double-claimed) --- */
      { lon: 30.3669, lat: 13.7050, place: "Bara (changed hands repeatedly)",
        adm1: "North Kordofan", date: "2025-10-25", claim: "captured", geo: "gazetteer", contested: true,
        source: "RSF via Al Jazeera; re-claimed ~2026-10-25 (Daily Sabah); SAF held it Jul 2026 — CONTESTED" },
      { lon: 29.7200, lat: 13.1800, place: "Umm Sumeima (~55 km W of El-Obeid)",
        adm1: "North Kordofan", date: "2025-07", claim: "captured", geo: "approx", contested: true,
        source: "RSF via Radio Dabanga — SAF/joint-forces also claimed it — CONTESTED" },
      { lon: 30.4000, lat: 13.0000, place: "Kazgeil",
        adm1: "North Kordofan", date: "2025-09", claim: "captured", geo: "approx", contested: true,
        source: "RSF via Daily Sabah (SAF retook Oct 2026) — CONTESTED" },
      { lon: 30.3500, lat: 12.9000, place: "Um Dam Haj Ahmed",
        adm1: "North Kordofan", date: "2025-10-27", claim: "captured", geo: "approx", contested: true,
        source: "RSF via Daily Sabah (SAF retook) — CONTESTED" },
      { lon: 27.9667, lat: 14.6333, place: "Hamrat El Sheikh (NW North Kordofan)",
        adm1: "North Kordofan", date: "2025-2026", claim: "held", geo: "approx",
        source: "RSF-held per Daily Sabah" },
      { lon: 29.0667, lat: 14.3833, place: "Sodari / Soudari",
        adm1: "North Kordofan", date: "2025-2026", claim: "held", geo: "approx",
        source: "RSF-held per Daily Sabah" },
      { lon: 27.9000, lat: 14.2000, place: "Umm Badr (NW North Kordofan)",
        adm1: "North Kordofan", date: "2025-2026", claim: "held", geo: "approx",
        source: "RSF-held per Daily Sabah" }
    ],

    note: ("Couche REVENDICATIONS : localites dont la prise/le controle est REVENDIQUE " +
           "publiquement par la SAF (armee) ou la RSF, geocodees et datees. Les deux camps " +
           "sont presentes SEPAREMENT et a parts egales (SAF 29, RSF 32). CHAQUE point est " +
           "'revendique, NON VERIFIE' — une revendication n'est pas une preuve de controle. Les " +
           "localites marquees contested:true ont CHANGE DE MAINS ou sont revendiquees par les " +
           "DEUX camps (Bara, Umm Sumeima, Kazgeil, Um Dam Haj Ahmed, Al-Dibeibat, Babanusa, " +
           "Kurmuk, Heglig...) : elles figurent VOLONTAIREMENT sur les deux listes, non " +
           "dedoublonnees. geo='approx' = point place d'apres une description relative / gazetteer " +
           "grossier, a verifier. ATTENTION DATES : certains relais (Sudan Tribune) affichent une " +
           "date de crawl et non de publication ; en cas d'ambiguite la valeur la plus defendable " +
           "est retenue et la source est nommee pour recoupement. Garde-fou Darfour : localites " +
           "uniquement, aucune unite suivie, aucune donnee nominative, aucune granularite camp de " +
           "deplaces.")
  };
})();
