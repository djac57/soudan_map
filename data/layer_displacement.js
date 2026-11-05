/* ------------------------------------------------------------------
 * data/layer_displacement.js — MOUVEMENTS DE POPULATION (déplacés internes
 * et réfugiés). Généré par scripts/displacement/build_displacement.py —
 * NE PAS éditer à la main ; modifier records.json puis relancer.
 * Chiffres publiés, datés, sourcés ; bases différentes (stock / arrivées /
 * retours) à ne pas additionner.
 * ------------------------------------------------------------------ */
(function () {
  "use strict";
  window.SUDAN = window.SUDAN || {};
  window.SUDAN.displacement = {
  "generated": "2026-11-05",
  "note": "Chiffres publiés, attribués et datés. Chaque valeur garde sa base (stock, arrivées, retours). Ne pas additionner des bases différentes.",
  "sources": {
    "unhcr_stock": {
      "name": "UNHCR Refugee Data Finder — stock de réfugiés soudanais, fin 2025",
      "url": "https://data.unhcr.org/en/situations/sudansituation",
      "date": "2025-12-31"
    },
    "iom_rrp": {
      "name": "IOM — Sudan and Neighbouring Countries 2026 Regional Response Plan (arrivées, retours)",
      "url": "https://reliefweb.int/report/sudan/sudan-and-neighbouring-countries-2026-iom-regional-response-plan",
      "date": "2026-03-31"
    },
    "dtm_cbm2": {
      "name": "IOM DTM — Sudan Cross-Border Monitoring Report (2) (flux de retour vers le Soudan, jan. 2024–déc. 2025)",
      "url": "https://reliefweb.int/report/sudan/dtm-sudan-cross-border-monitoring-report-2-15-february-2026",
      "date": "2026-02-15"
    },
    "africa_center": {
      "name": "Africa Center for Strategic Studies — Sudan conflict straining fragility of its neighbors",
      "url": "https://africacenter.org/spotlight/sudan-conflict-straining-fragility-of-its-neighbors-displacement-refugees/",
      "date": "2026-08-13"
    },
    "mmc_2023": {
      "name": "Mixed Migration Centre — consequences of the Sudan conflict (juin 2023)",
      "url": "https://mixedmigration.org/articles/mixed-migration-consequences-sudan-conflict-june-2023/",
      "date": "2023-06-20"
    },
    "idp_dtm": {
      "name": "IOM DTM Sudan — Displacement & Return Snapshot (round 8)",
      "url": "https://dtm.iom.int/sudan",
      "date": "2026-07-31"
    },
    "unhcr_europe": {
      "name": "UNHCR Regional Bureau for Europe — Sudanese Movement to Europe: Profiles, Routes and Challenges Along the Way (sept. 2026)",
      "url": "https://www.unhcr.org/",
      "date": "2026-09"
    }
  },
  "origin_hubs_idp_2023": [
    {
      "name_fr": "Khartoum",
      "name_en": "Khartoum",
      "lon": 32.5599,
      "lat": 15.5007,
      "share": 0.65,
      "basis": "Part des déplacés partis de cet État, juin 2023",
      "source": "mmc_2023"
    },
    {
      "name_fr": "Darfour Ouest",
      "name_en": "West Darfur",
      "lon": 22.45,
      "lat": 13.45,
      "share": 0.19,
      "basis": "Part des déplacés, juin 2023",
      "source": "mmc_2023"
    },
    {
      "name_fr": "Darfour Sud",
      "name_en": "South Darfur",
      "lon": 24.88,
      "lat": 12.05,
      "share": 0.07,
      "basis": "Part des déplacés, juin 2023",
      "source": "mmc_2023"
    },
    {
      "name_fr": "Darfour Central",
      "name_en": "Central Darfur",
      "lon": 23.47,
      "lat": 12.9,
      "share": 0.06,
      "basis": "Part des déplacés, juin 2023",
      "source": "mmc_2023"
    }
  ],
  "neighbours": [
    {
      "country_fr": "Égypte",
      "country_en": "Egypt",
      "iso3": "EGY",
      "lon": 31.2357,
      "lat": 30.0444,
      "refugees_stock": 834201,
      "refugees_basis": "stock UNHCR fin 2025",
      "arrivals": 1500000,
      "arrivals_basis": "arrivées depuis 2023 (IOM, >1,5 M)",
      "source": "unhcr_stock",
      "source2": "africa_center"
    },
    {
      "country_fr": "Tchad",
      "country_en": "Chad",
      "iso3": "TCD",
      "lon": 15.0444,
      "lat": 12.1348,
      "refugees_stock": 1334595,
      "refugees_basis": "stock UNHCR fin 2025",
      "arrivals": 1200000,
      "arrivals_basis": "arrivées (IOM RRP 2026, >1,2 M)",
      "source": "unhcr_stock",
      "source2": "iom_rrp"
    },
    {
      "country_fr": "Soudan du Sud",
      "country_en": "South Sudan",
      "iso3": "SSD",
      "lon": 31.582,
      "lat": 4.8594,
      "refugees_stock": 571071,
      "refugees_basis": "stock UNHCR fin 2025",
      "arrivals": 1300000,
      "arrivals_basis": "arrivées (IOM RRP 2026, >1,3 M, dont >900 000 retours)",
      "source": "unhcr_stock",
      "source2": "iom_rrp"
    },
    {
      "country_fr": "Libye",
      "country_en": "Libya",
      "iso3": "LBY",
      "lon": 13.1913,
      "lat": 32.8872,
      "refugees_stock": 639166,
      "refugees_basis": "stock UNHCR fin 2025",
      "arrivals": 157000,
      "arrivals_basis": "franchissements (Africa Center, >157 000)",
      "source": "unhcr_stock",
      "source2": "africa_center"
    },
    {
      "country_fr": "Éthiopie",
      "country_en": "Ethiopia",
      "iso3": "ETH",
      "lon": 38.7469,
      "lat": 9.032,
      "refugees_stock": 98924,
      "refugees_basis": "stock UNHCR fin 2025",
      "arrivals": 184000,
      "arrivals_basis": "entrées depuis le début de la guerre (Africa Center, ~184 000 dont ~53 % de retours)",
      "source": "unhcr_stock",
      "source2": "africa_center"
    },
    {
      "country_fr": "Centrafrique",
      "country_en": "Central African Rep.",
      "iso3": "CAF",
      "lon": 18.5582,
      "lat": 4.3947,
      "refugees_stock": 40323,
      "refugees_basis": "stock UNHCR fin 2025",
      "arrivals": 37000,
      "arrivals_basis": "Soudanais arrivés (Africa Center, ~37 000)",
      "source": "unhcr_stock",
      "source2": "africa_center"
    },
    {
      "country_fr": "Ouganda",
      "country_en": "Uganda",
      "iso3": "UGA",
      "lon": 32.5825,
      "lat": 0.3476,
      "refugees_stock": 92889,
      "refugees_basis": "stock UNHCR fin 2025",
      "arrivals": 91000,
      "arrivals_basis": "arrivés depuis le début (Africa Center, >91 000)",
      "source": "unhcr_stock",
      "source2": "africa_center"
    },
    {
      "country_fr": "Kenya",
      "country_en": "Kenya",
      "iso3": "KEN",
      "lon": 36.8219,
      "lat": -1.2921,
      "refugees_stock": 13349,
      "refugees_basis": "stock UNHCR fin 2025",
      "arrivals": null,
      "arrivals_basis": "",
      "source": "unhcr_stock",
      "source2": null
    }
  ],
  "returns_to_sudan": {
    "total": 529661,
    "period": "jan. 2024 – déc. 2025",
    "share_egypt": 0.89,
    "share_chad": 0.11,
    "share_ethiopia_lt": 0.01,
    "drivers": "amélioration de la sécurité (41 %), opportunités économiques (26 %), visites familiales (19 %)",
    "entry_points": [
      {
        "name_fr": "Ashkeet / Argeen (Nord, frontière Égypte)",
        "lon": 30.48,
        "lat": 19.17,
        "from": "EGY",
        "note": "point de retour indicatif, approximatif (vers Dongola, État du Nord)"
      },
      {
        "name_fr": "At Tina (Darfour Nord, frontière Tchad)",
        "lon": 22.45,
        "lat": 13.45,
        "from": "TCD",
        "note": "point de retour indicatif (région de Geneina)"
      }
    ],
    "source": "dtm_cbm2"
  },
  "idp_totals_timeline": [
    {
      "date": "2025-01",
      "idp": 11580000,
      "label_fr": "pic (~janv. 2025)",
      "source": "idp_dtm"
    },
    {
      "date": "2026-03-19",
      "idp": 9044786,
      "label_fr": "DTM, 19 mars 2026",
      "source": "idp_dtm"
    },
    {
      "date": "2026-04-15",
      "idp": 8936175,
      "label_fr": "IOM, bilan 3 ans (15 avr. 2026)",
      "source": "idp_dtm"
    },
    {
      "date": "2026-07-31",
      "idp": 8622801,
      "label_fr": "DTM round 8 (31 juil. 2026)",
      "source": "idp_dtm"
    }
  ],
  "europe": {
    "note": "Flux vers l'Europe : faible en nombre (14 104 arrivées en 2025 vs ~4,5 M réfugiés et demandeurs d'asile dans la région) mais documenté. Enquête : 173 entretiens, non représentative.",
    "source": "unhcr_europe",
    "arrivals_mediterranean_by_year": {
      "2021": 2460,
      "2022": 2253,
      "2023": 7161,
      "2024": 4094,
      "2025": 14104
    },
    "asylum_first_time_by_year": {
      "2021": 5449,
      "2022": 7419,
      "2023": 10981,
      "2024": 14432,
      "2025": 21298
    },
    "greece_arrivals_2025": 9110,
    "libya_departure_share_2025": 0.84,
    "survey_routes": {
      "via_libya": 0.93,
      "libya_to_greece": 0.79,
      "greece_to_albania": 0.64,
      "reached_greece": 0.88
    },
    "survey_destinations": {
      "France": 0.31,
      "Germany": 0.24,
      "Italy": 0.22
    },
    "points": {
      "libya": {
        "name_fr": "Libye (départ)",
        "lon": 13.1913,
        "lat": 32.8872
      },
      "greece": {
        "name_fr": "Grèce",
        "lon": 23.7275,
        "lat": 37.9838
      },
      "crete": {
        "name_fr": "Crète (nouveau corridor 2025)",
        "lon": 25.1442,
        "lat": 35.2401
      },
      "albania": {
        "name_fr": "Albanie",
        "lon": 19.8187,
        "lat": 41.3275
      },
      "italy": {
        "name_fr": "Italie",
        "lon": 12.4964,
        "lat": 41.9028
      },
      "france": {
        "name_fr": "France",
        "lon": 2.3522,
        "lat": 48.8566
      },
      "germany": {
        "name_fr": "Allemagne",
        "lon": 13.405,
        "lat": 52.52
      },
      "europe": {
        "name_fr": "Europe (centre approximatif)",
        "lon": 10.0,
        "lat": 50.0
      }
    }
  }
};
})();
