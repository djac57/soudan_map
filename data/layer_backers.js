/* ------------------------------------------------------------------
 * data/layer_backers.js — COUCHE SOUTIENS ÉTRANGERS (qui soutient SAF vs RSF)
 * Généré par scripts/backers/build_backers.py — NE PAS éditer à la main.
 * Chargé APRÈS data/bundle.js. Additif : pose window.SUDAN.backers.
 * Pays alignés : data/backers_countries.geojson (geoBoundaries CC BY 4.0).
 * SUJET SENSIBLE : soutiens/alignements/routes RAPPORTÉS, ATTRIBUÉS, étiquetés par
 * certitude ; démentis notés ; équilibre SAF/RSF ; garde-fou transit≠soutien d'État.
 * Sources : Groupe d'experts de l'ONU, ACLED, Chatham House, etc. — voir .README.md.
 * ------------------------------------------------------------------ */
(function () {
  "use strict";
  window.SUDAN = window.SUDAN || {};
  window.SUDAN.backers = {
  "generated": "2026-10-28",
  "target": {
    "saf": {
      "lon": 37.22,
      "lat": 19.62,
      "place": "Port-Soudan (siège de facto du gouvernement/SAF)"
    },
    "rsf": {
      "lon": 24.88,
      "lat": 12.05,
      "place": "Nyala (bastion RSF au Darfour)"
    }
  },
  "legend": {
    "saf": "Forces armées soudanaises (al-Burhan) — soutiens rapportés",
    "rsf": "Forces de soutien rapide (Hemedti) — soutiens rapportés",
    "sides": {
      "RSF": "soutient / sert de relais aux Forces de soutien rapide",
      "SAF": "soutient l'armée (al-Burhan)",
      "mixed": "joue les deux camps / ambivalent",
      "context": "pays de la région sans alignement militaire documenté (contexte)",
      "theatre": "théâtre du conflit (enjeu)"
    },
    "certainty": {
      "multi-source": "Confirmé par plusieurs sources indépendantes",
      "rapporte": "Rapporté / allégué (non confirmé indépendamment)",
      "ambivalent": "Rôle changeant / joue les deux camps"
    },
    "route_types": {
      "gold": "Or (financement du conflit)",
      "arms_fuel": "Armes & carburant",
      "arms": "Armes / drones",
      "fighters": "Combattants / mercenaires"
    }
  },
  "alignment": {
    "geojson": "data/backers_countries.geojson",
    "source_boundaries": "geoBoundaries gbOpen ADM0 (CC BY 4.0)",
    "countries": [
      {
        "iso3": "ARE",
        "country_fr": "Émirats arabes unis",
        "side": "RSF",
        "support_type": [
          "armes",
          "munitions",
          "financement",
          "or"
        ],
        "certainty": "multi-source",
        "denied": true,
        "note": "Principal soutien rapporté du RSF ; jugé crédible par le Groupe d'experts de l'ONU. Abou Dhabi dément.",
        "source": {
          "name": "Groupe d'experts de l'ONU sur le Soudan — S/2024/65",
          "url": "https://digitallibrary.un.org/record/4039195?ln=en",
          "date": "2024-01-15"
        }
      },
      {
        "iso3": "TCD",
        "country_fr": "Tchad",
        "side": "RSF",
        "support_type": [
          "transit"
        ],
        "certainty": "rapporte",
        "denied": true,
        "note": "Voie de transit aérien (Amdjarass) des approvisionnements EAU→RSF, rapportée ; N'Djamena dément. Trafic en baisse en 2025.",
        "source": {
          "name": "Global Initiative (GI-TOC)",
          "url": "https://globalinitiative.net/analysis/the-illicit-transnational-supply-chains-sustaining-sudans-conflict/",
          "date": "2025"
        }
      },
      {
        "iso3": "LBY",
        "country_fr": "Libye (forces de K. Haftar, est)",
        "side": "RSF",
        "support_type": [
          "transit",
          "carburant",
          "combattants"
        ],
        "certainty": "rapporte",
        "denied": true,
        "note": "Est libyen (Haftar) = corridor aérien/terrestre RSF via Koufra et arrivée de mercenaires via Benghazi ; Haftar dément.",
        "source": {
          "name": "The Sentry / Conflict Intelligence Group",
          "url": "https://thesentry.org/",
          "date": "2025"
        }
      },
      {
        "iso3": "SSD",
        "country_fr": "Soudan du Sud",
        "side": "RSF",
        "support_type": [
          "transit",
          "or"
        ],
        "certainty": "rapporte",
        "denied": true,
        "note": "Corridor de l'or RSF (Songo→Wau→Juba→ÉAU) selon GI-TOC / Chatham House. Transit, pas un soutien étatique établi.",
        "source": {
          "name": "Chatham House — Gold and the war in Sudan",
          "url": "https://www.chathamhouse.org/2025/03/gold-and-war-sudan",
          "date": "2025-03-26"
        }
      },
      {
        "iso3": "CAF",
        "country_fr": "République centrafricaine (via Wagner)",
        "side": "RSF",
        "support_type": [
          "transit",
          "armes",
          "combattants"
        ],
        "certainty": "rapporte",
        "denied": true,
        "note": "Frontière RCA–Darfour (Um Dafuq, Birao) utilisée comme route d'armes Wagner→RSF ; le RSF dément recevoir une aide extérieure.",
        "source": {
          "name": "Middle East Eye / US Treasury",
          "url": "https://www.middleeasteye.net/news/sudan-war-wagner-group-weapons-rsf",
          "date": "2023-2024"
        }
      },
      {
        "iso3": "KEN",
        "country_fr": "Kenya",
        "side": "RSF",
        "support_type": [
          "diplomatique"
        ],
        "certainty": "rapporte",
        "denied": true,
        "note": "A accueilli à Nairobi (févr. 2025) la signature de la charte politique du RSF/alliés ; Khartoum a accusé Nairobi de parti pris. Alignement diplomatique contesté, pas de soutien militaire établi.",
        "source": {
          "name": "Reuters / Jurist — charte RSF à Nairobi",
          "url": "https://www.jurist.org/news/2025/02/sudan-paramilitary-group-rsf-signs-charter-to-form-parallel-rival-government/",
          "date": "2025-02-18"
        }
      },
      {
        "iso3": "EGY",
        "country_fr": "Égypte",
        "side": "SAF",
        "support_type": [
          "diplomatique",
          "militaire",
          "drones"
        ],
        "certainty": "rapporte",
        "denied": true,
        "note": "Principal appui régional du SAF (al-Burhan = dirigeant légitime pour Le Caire) ; soutien militaire direct démenti.",
        "source": {
          "name": "RTÉ / ACLED",
          "url": "https://acleddata.com/qa/qa-how-do-escalating-tensions-middle-east-affect-sudan-conflict",
          "date": "2025"
        }
      },
      {
        "iso3": "IRN",
        "country_fr": "Iran",
        "side": "SAF",
        "support_type": [
          "drones"
        ],
        "certainty": "multi-source",
        "denied": false,
        "note": "Drones (Mohajer-6/Ababil) livrés au SAF via Port-Soudan (fin 2023–2024) ; reflux rapporté depuis.",
        "source": {
          "name": "Critical Threats — Drones over Sudan",
          "url": "https://www.criticalthreats.org/analysis/drones-over-sudan-foreign-powers-in-sudans-civil-war",
          "date": "2025-01-27"
        }
      },
      {
        "iso3": "SAU",
        "country_fr": "Arabie saoudite",
        "side": "SAF",
        "support_type": [
          "financement",
          "diplomatique"
        ],
        "certainty": "rapporte",
        "denied": true,
        "note": "Appui financier/diplomatique à al-Burhan + médiation (Djeddah) ; soutien matériel démenti.",
        "source": {
          "name": "Africa Confidential",
          "url": "https://www.africa-confidential.com/article/id/15842/riyadh-flashes-the-gold-card",
          "date": "2025"
        }
      },
      {
        "iso3": "QAT",
        "country_fr": "Qatar",
        "side": "SAF",
        "support_type": [
          "diplomatique",
          "financement"
        ],
        "certainty": "rapporte",
        "denied": false,
        "note": "Soutien déclaré au « gouvernement légitime »/SAF (juillet 2024) ; détails matériels peu documentés.",
        "source": {
          "name": "AllAfrica (fr)",
          "url": "https://fr.allafrica.com/stories/202407240595.html",
          "date": "2024-07-24"
        }
      },
      {
        "iso3": "TUR",
        "country_fr": "Turquie",
        "side": "SAF",
        "support_type": [
          "drones",
          "diplomatique"
        ],
        "certainty": "rapporte",
        "denied": true,
        "note": "Drones (Bayraktar) rapportés côté SAF ; Ankara ne confirme pas.",
        "source": {
          "name": "RTÉ / Fair Observer",
          "url": "https://www.rte.ie/news/world/2025/1031/1541428-sudan-war",
          "date": "2025-10-31"
        }
      },
      {
        "iso3": "ERI",
        "country_fr": "Érythrée",
        "side": "SAF",
        "support_type": [
          "diplomatique",
          "entraînement",
          "logistique"
        ],
        "certainty": "rapporte",
        "denied": false,
        "note": "Alliance avec al-Burhan (visite à Asmara, nov. 2024) ; entraînement de forces alignées sur le SAF et facilitation logistique/drones rapportés (non confirmés). Asmara reste silencieuse.",
        "source": {
          "name": "Dabanga / Horn Review",
          "url": "https://hornreview.org/2025/12/06/destabilization-as-modus-operandi-eritrea-and-the-sudan-conflict/",
          "date": "2025-12-06"
        }
      },
      {
        "iso3": "RUS",
        "country_fr": "Russie",
        "side": "SAF",
        "support_type": [
          "armes",
          "diplomatique"
        ],
        "certainty": "ambivalent",
        "denied": true,
        "note": "AMBIVALENT : bascule de l'État russe vers le SAF en 2024 (reconnaissance d'al-Burhan, base navale à Port-Soudan contre armes) ; mais Wagner a historiquement appuyé le RSF via la RCA et l'or. À lire des deux côtés.",
        "source": {
          "name": "Jamestown — Russia Switches Sides in Sudan War",
          "url": "https://jamestown.org/program/russia-switches-sides-in-sudan-war/",
          "date": "2024-05"
        },
        "ambivalent": true
      },
      {
        "iso3": "SOM",
        "country_fr": "Somalie (Puntland)",
        "side": "context",
        "support_type": [
          "transit"
        ],
        "certainty": "rapporte",
        "denied": false,
        "note": "Bossaso (Puntland) cité comme point de transit ALTERNATIF de mercenaires vers le RSF — route logistique, PAS un soutien de l'État fédéral somalien.",
        "source": {
          "name": "Conflict Intelligence Group / presse",
          "url": "https://adf-magazine.com/2025/02/colombian-mercenaries-in-sudan-show-internationalization-of-conflict/",
          "date": "2025-02"
        }
      },
      {
        "iso3": "UGA",
        "country_fr": "Ouganda",
        "side": "context",
        "support_type": [],
        "certainty": "rapporte",
        "denied": true,
        "note": "Cité par GI-TOC comme corridor logistique possible du RSF ; aucun soutien étatique établi — affiché en contexte.",
        "source": {
          "name": "Global Initiative (GI-TOC)",
          "url": "https://globalinitiative.net/analysis/the-illicit-transnational-supply-chains-sustaining-sudans-conflict/",
          "date": "2025"
        }
      },
      {
        "iso3": "BHR",
        "country_fr": "Bahreïn",
        "side": "context",
        "support_type": [],
        "certainty": "rapporte",
        "denied": false,
        "note": "Membre du CCG ; aucun alignement militaire documenté dans le conflit soudanais — affiché en contexte régional (Golfe).",
        "source": {
          "name": "—",
          "url": "https://www.chathamhouse.org/2025/03/gold-and-war-sudan",
          "date": "2025-03"
        }
      },
      {
        "iso3": "ETH",
        "country_fr": "Éthiopie",
        "side": "context",
        "support_type": [],
        "certainty": "rapporte",
        "denied": false,
        "note": "Relations tendues avec Port-Soudan ; pas de soutien militaire documenté à un camp — affiché en contexte.",
        "source": {
          "name": "—",
          "url": "https://acleddata.com/qa/qa-how-do-escalating-tensions-middle-east-affect-sudan-conflict",
          "date": "2025"
        }
      },
      {
        "iso3": "SDN",
        "country_fr": "Soudan",
        "side": "theatre",
        "support_type": [],
        "certainty": "multi-source",
        "denied": false,
        "note": "Théâtre du conflit SAF–RSF.",
        "source": {
          "name": "—",
          "url": "https://www.chathamhouse.org/2025/03/gold-and-war-sudan",
          "date": "2025-03"
        }
      }
    ]
  },
  "routes": [
    {
      "type": "gold",
      "actor": "RSF",
      "label": "Or : Darfour → Abou Dhabi (via Tchad)",
      "coords": [
        [
          24.88,
          12.05
        ],
        [
          20.68,
          16.07
        ],
        [
          54.37,
          24.47
        ]
      ],
      "certainty": "multi-source",
      "denied": true,
      "note": "La majorité de l'or artisanal soudanais finit aux ÉAU (1er marché d'exportation, ~1,6 Md$ en 2024, >91% d'or). Route via le Tchad. Abou Dhabi dément soutenir le RSF.",
      "source": {
        "name": "Chatham House — Gold and the war in Sudan",
        "url": "https://www.chathamhouse.org/2025/03/gold-and-war-sudan",
        "date": "2025-03-26"
      }
    },
    {
      "type": "gold",
      "actor": "RSF",
      "label": "Or : Darfour → Abou Dhabi (via Soudan du Sud)",
      "coords": [
        [
          24.2,
          9.8
        ],
        [
          27.99,
          7.7
        ],
        [
          31.58,
          4.85
        ],
        [
          54.37,
          24.47
        ]
      ],
      "certainty": "rapporte",
      "denied": true,
      "note": "Cas de mars 2024 : or de Songo acheminé via Wau et Juba puis par jet privé vers les ÉAU (GI-TOC).",
      "source": {
        "name": "Global Initiative (GI-TOC)",
        "url": "https://globalinitiative.net/analysis/the-illicit-transnational-supply-chains-sustaining-sudans-conflict/",
        "date": "2025"
      }
    },
    {
      "type": "arms_fuel",
      "actor": "RSF",
      "label": "Armes & carburant : Émirats → Amdjarass → Nyala",
      "coords": [
        [
          54.37,
          24.47
        ],
        [
          20.68,
          16.07
        ],
        [
          24.88,
          12.05
        ]
      ],
      "certainty": "multi-source",
      "denied": true,
      "note": "Pont aérien (Il-76) depuis Abou Dhabi vers Amdjarass (Tchad oriental), puis acheminement vers des positions RSF au Darfour ; jugé crédible par l'ONU. ÉAU démentent.",
      "source": {
        "name": "Groupe d'experts de l'ONU sur le Soudan — S/2024/65",
        "url": "https://digitallibrary.un.org/record/4039195?ln=en",
        "date": "2024-01-15"
      }
    },
    {
      "type": "arms_fuel",
      "actor": "RSF",
      "label": "Armes : Émirats → Koufra (Libye) → Nyala",
      "coords": [
        [
          54.37,
          24.47
        ],
        [
          23.29,
          24.18
        ],
        [
          21.98,
          21.7
        ],
        [
          24.88,
          12.05
        ]
      ],
      "certainty": "rapporte",
      "denied": true,
      "note": "Route aérienne alternative via l'est libyen (Haftar) : Koufra / Maaten al-Sarra ; 143 vols Il-76 à Koufra entre avril et décembre 2025 (CIG).",
      "source": {
        "name": "Conflict Intelligence Group",
        "url": "https://adf-magazine.com/2025/02/colombian-mercenaries-in-sudan-show-internationalization-of-conflict/",
        "date": "2025"
      }
    },
    {
      "type": "fighters",
      "actor": "RSF",
      "label": "Combattants (Colombiens) : Libye (Benghazi) → Nyala",
      "coords": [
        [
          20.27,
          32.1
        ],
        [
          23.29,
          24.18
        ],
        [
          24.88,
          12.05
        ]
      ],
      "certainty": "rapporte",
      "denied": true,
      "note": "Recrutés (via une société basée aux ÉAU) et acheminés à Benghazi, puis par la route à travers le désert jusqu'au Darfour (Nyala). 22 tués par un drone du SAF en nov. 2024.",
      "source": {
        "name": "Yahoo/Telegraph — Colombian mercenaries ; Bellingcat",
        "url": "https://www.yahoo.com/news/articles/colombia-teenage-mercenaries-become-soldiers-050000188.html",
        "date": "2025"
      }
    },
    {
      "type": "fighters",
      "actor": "RSF",
      "label": "Combattants : RCA (Bangui → Birao) → Nyala",
      "coords": [
        [
          18.56,
          4.39
        ],
        [
          22.78,
          10.28
        ],
        [
          24.88,
          12.05
        ]
      ],
      "certainty": "rapporte",
      "denied": true,
      "note": "Route rapportée en 2026 : Casablanca→Bangui, puis petits avions vers Birao, puis passage vers Nyala (HRW).",
      "source": {
        "name": "Human Rights Watch",
        "url": "https://allafrica.com/stories/202606020625.html",
        "date": "2026-06"
      }
    },
    {
      "type": "fighters",
      "actor": "RSF",
      "label": "Combattants : Bossaso (Puntland) → Nyala",
      "coords": [
        [
          49.18,
          11.28
        ],
        [
          24.88,
          12.05
        ]
      ],
      "certainty": "rapporte",
      "denied": false,
      "note": "Route alternative d'acheminement de mercenaires via Bossaso (Puntland).",
      "source": {
        "name": "Conflict Intelligence Group / presse",
        "url": "https://adf-magazine.com/2025/02/colombian-mercenaries-in-sudan-show-internationalization-of-conflict/",
        "date": "2025-02"
      }
    },
    {
      "type": "arms",
      "actor": "SAF",
      "label": "Drones iraniens : Iran → Port-Soudan",
      "coords": [
        [
          56.28,
          27.19
        ],
        [
          37.22,
          19.62
        ]
      ],
      "certainty": "multi-source",
      "denied": false,
      "note": "Drones Mohajer-6/Ababil acheminés à Port-Soudan (fin 2023–mi-2024) ; reflux rapporté depuis.",
      "source": {
        "name": "Critical Threats / The Cipher Brief",
        "url": "https://www.criticalthreats.org/analysis/drones-over-sudan-foreign-powers-in-sudans-civil-war",
        "date": "2025-01-27"
      }
    },
    {
      "type": "arms",
      "actor": "SAF",
      "label": "Drones turcs : Turquie → Port-Soudan",
      "coords": [
        [
          32.85,
          39.93
        ],
        [
          37.22,
          19.62
        ]
      ],
      "certainty": "rapporte",
      "denied": true,
      "note": "Drones Bayraktar (TB2/Akıncı) rapportés côté SAF ; Ankara ne confirme pas.",
      "source": {
        "name": "RTÉ / Fair Observer",
        "url": "https://www.rte.ie/news/world/2025/1031/1541428-sudan-war",
        "date": "2025-10-31"
      }
    }
  ],
  "logistics_airports": [
    {
      "name": "Amdjarass",
      "country": "Tchad",
      "lon": 20.68,
      "lat": 16.07,
      "side": "RSF",
      "role": "Pont aérien EAU→RSF (Il-76), selon le Groupe d'experts de l'ONU",
      "source": {
        "name": "Groupe d'experts de l'ONU — S/2024/65",
        "url": "https://digitallibrary.un.org/record/4039195?ln=en",
        "date": "2024-01-15"
      }
    },
    {
      "name": "Koufra",
      "country": "Libye",
      "lon": 23.31,
      "lat": 24.18,
      "side": "RSF",
      "role": "Hub aérien de ravitaillement RSF ; 143 vols Il-76 (avr.–déc. 2025)",
      "source": {
        "name": "Conflict Intelligence Group",
        "url": "https://adf-magazine.com/2025/02/colombian-mercenaries-in-sudan-show-internationalization-of-conflict/",
        "date": "2025"
      }
    },
    {
      "name": "Maaten al-Sarra",
      "country": "Libye",
      "lon": 21.98,
      "lat": 21.7,
      "side": "RSF",
      "role": "Base aérienne sud-libyenne, transit allégué vers le Darfour",
      "source": {
        "name": "Conflict Intelligence Group / presse",
        "url": "https://adf-magazine.com/2025/02/colombian-mercenaries-in-sudan-show-internationalization-of-conflict/",
        "date": "2025"
      }
    },
    {
      "name": "Benghazi (Benina) / Al-Marj",
      "country": "Libye",
      "lon": 20.27,
      "lat": 32.1,
      "side": "RSF",
      "role": "Arrivée de mercenaires (Colombiens) avant transfert terrestre vers le Darfour ; Al-Marj cité par CIG/presse (à confirmer)",
      "source": {
        "name": "Yahoo/Telegraph ; Bellingcat",
        "url": "https://www.yahoo.com/news/articles/colombia-teenage-mercenaries-become-soldiers-050000188.html",
        "date": "2025"
      }
    },
    {
      "name": "Nyala",
      "country": "Soudan (Darfour)",
      "lon": 24.88,
      "lat": 12.05,
      "side": "RSF",
      "role": "Centre névralgique RSF : mercenaires et opérations de drones (CIG)",
      "source": {
        "name": "Conflict Intelligence Group",
        "url": "https://adf-magazine.com/2025/02/colombian-mercenaries-in-sudan-show-internationalization-of-conflict/",
        "date": "2025"
      }
    },
    {
      "name": "Birao",
      "country": "République centrafricaine",
      "lon": 22.78,
      "lat": 10.28,
      "side": "RSF",
      "role": "Transit de combattants via la RCA (HRW, mai 2026)",
      "source": {
        "name": "Human Rights Watch",
        "url": "https://allafrica.com/stories/202606020625.html",
        "date": "2026-06"
      }
    },
    {
      "name": "Bossaso",
      "country": "Somalie (Puntland)",
      "lon": 49.18,
      "lat": 11.28,
      "side": "RSF",
      "role": "Route alternative d'acheminement de mercenaires",
      "source": {
        "name": "CIG / presse",
        "url": "https://adf-magazine.com/2025/02/colombian-mercenaries-in-sudan-show-internationalization-of-conflict/",
        "date": "2025"
      }
    },
    {
      "name": "Abou Dhabi",
      "country": "Émirats arabes unis",
      "lon": 54.37,
      "lat": 24.47,
      "side": "RSF",
      "role": "Destination de l'or soudanais et origine du pont aérien (selon Chatham House / ONU) ; ÉAU démentent",
      "source": {
        "name": "Chatham House — Gold and the war in Sudan",
        "url": "https://www.chathamhouse.org/2025/03/gold-and-war-sudan",
        "date": "2025-03-26"
      }
    },
    {
      "name": "Port-Soudan",
      "country": "Soudan (Mer Rouge)",
      "lon": 37.22,
      "lat": 19.62,
      "side": "SAF",
      "role": "Principal point d'entrée du SAF (drones iraniens/turcs) ; siège de facto du gouvernement",
      "source": {
        "name": "Critical Threats",
        "url": "https://www.criticalthreats.org/analysis/drones-over-sudan-foreign-powers-in-sudans-civil-war",
        "date": "2025-01-27"
      }
    },
    {
      "name": "Asmara / Massawa",
      "country": "Érythrée",
      "lon": 38.93,
      "lat": 15.33,
      "side": "SAF",
      "role": "Facilitation logistique / drones côté SAF, alléguée (ONU / Horn Review)",
      "source": {
        "name": "Horn Review",
        "url": "https://hornreview.org/2025/12/06/destabilization-as-modus-operandi-eritrea-and-the-sudan-conflict/",
        "date": "2025-12-06"
      }
    }
  ],
  "saf": [
    {
      "country": "Egypt",
      "country_fr": "Égypte",
      "iso3": "EGY",
      "lon": 31.24,
      "lat": 30.04,
      "support_type": [
        "diplomatique",
        "militaire",
        "drones"
      ],
      "certainty": "rapporte",
      "denied": true,
      "status": "Soutien politique/militaire rapporté. Le Caire dément un soutien militaire direct.",
      "note": "L'Égypte est le principal appui RÉGIONAL du SAF : elle considère al-Burhan comme le dirigeant légitime (liens armée-à-armée anciens). ACLED cite des rapports selon lesquels des drones du SAF opéreraient depuis une base en Égypte contre des lignes RSF. Le Caire DÉMENT les accusations RSF de soutien militaire direct.",
      "sources": [
        {
          "name": "RTÉ — explainer guerre du Soudan",
          "url": "https://www.rte.ie/news/world/2025/1031/1541428-sudan-war",
          "date": "2025-10-31"
        },
        {
          "name": "ACLED — tensions régionales et conflit soudanais",
          "url": "https://acleddata.com/qa/qa-how-do-escalating-tensions-middle-east-affect-sudan-conflict",
          "date": "2025"
        }
      ]
    },
    {
      "country": "Iran",
      "country_fr": "Iran",
      "iso3": "IRN",
      "lon": 51.39,
      "lat": 35.69,
      "support_type": [
        "drones"
      ],
      "certainty": "multi-source",
      "denied": false,
      "status": "Livraisons de drones rapportées (Mohajer-6 / Ababil), fin 2023–2024 ; reflux depuis.",
      "note": "Plusieurs sources (Critical Threats, The Cipher Brief) rapportent des livraisons de DRONES iraniens (Mohajer-6, Ababil) au SAF, arrivés à Port-Soudan de fin 2023 à mi-2024, Téhéran cherchant en retour un accès à la mer Rouge. Fair Observer (2026) indique un REFLUX de l'approvisionnement iranien du fait de la guerre d'Iran, au profit de drones turcs/égyptiens.",
      "sources": [
        {
          "name": "Critical Threats — « Drones over Sudan »",
          "url": "https://www.criticalthreats.org/analysis/drones-over-sudan-foreign-powers-in-sudans-civil-war",
          "date": "2025-01-27"
        },
        {
          "name": "The Cipher Brief — « Sudan: war without borders »",
          "url": "https://www.thecipherbrief.com/sudan-war-without-borders",
          "date": "2025"
        }
      ]
    },
    {
      "country": "Russia (state / SAF pivot)",
      "country_fr": "Russie (bascule État vers le SAF)",
      "iso3": "RUS",
      "lon": 37.62,
      "lat": 55.75,
      "support_type": [
        "armes",
        "diplomatique",
        "ambivalent"
      ],
      "certainty": "ambivalent",
      "denied": false,
      "status": "Bascule 2024 vers le SAF (aide militaire promise contre base navale). Ambivalent.",
      "note": "AMBIVALENT : après avoir laissé Wagner opérer côté RSF/or, l'État russe a basculé vers le SAF en 2024 — le vice-ministre Bogdanov a reconnu al-Burhan à Port-Soudan (29 avril 2024) et promis une aide militaire, en échange d'un accord de base navale à Port-Soudan (logistique/ravitaillement). Mise en œuvre et finalisation de la base NON confirmées.",
      "sources": [
        {
          "name": "Jamestown Foundation — « Russia Switches Sides in Sudan War »",
          "url": "https://jamestown.org/program/russia-switches-sides-in-sudan-war/",
          "date": "2024-05"
        },
        {
          "name": "ADF Magazine — accord base mer Rouge contre armes",
          "url": "https://adf-magazine.com/2024/06/sudanese-armed-forces-agrees-to-russian-red-sea-base-in-exchange-for-weapons/",
          "date": "2024-06"
        }
      ]
    },
    {
      "country": "Turkey",
      "country_fr": "Turquie",
      "iso3": "TUR",
      "lon": 32.85,
      "lat": 39.93,
      "support_type": [
        "drones",
        "diplomatique"
      ],
      "certainty": "rapporte",
      "denied": true,
      "status": "Drones (Bayraktar) rapportés côté SAF. Ankara ne confirme pas.",
      "note": "RTÉ et d'autres rapportent que la Turquie soutient le SAF depuis le début de la guerre et aurait fourni des DRONES (Bayraktar TB2 / Akıncı) utilisés contre des positions RSF. Relation aussi diplomatique/économique. À traiter comme RAPPORTÉ.",
      "sources": [
        {
          "name": "RTÉ — explainer guerre du Soudan",
          "url": "https://www.rte.ie/news/world/2025/1031/1541428-sudan-war",
          "date": "2025-10-31"
        },
        {
          "name": "Fair Observer — réarmement du SAF (Turquie/Égypte)",
          "url": "https://www.fairobserver.com/region/middle_east_north_africa/as-irans-war-drains-its-arsenal-egypt-turkey-and-pakistan-rearm-sudans-army/",
          "date": "2026"
        }
      ]
    },
    {
      "country": "Saudi Arabia",
      "country_fr": "Arabie saoudite",
      "iso3": "SAU",
      "lon": 46.72,
      "lat": 24.69,
      "support_type": [
        "financement",
        "diplomatique"
      ],
      "certainty": "rapporte",
      "denied": true,
      "status": "Appui financier/diplomatique à al-Burhan + médiation. Riyad dément un soutien matériel.",
      "note": "Riyad appuie le SAF surtout par des canaux FINANCIERS et DIPLOMATIQUES (et promesse d'aide à la reconstruction de Khartoum), tout en se posant en médiateur (processus de Djeddah). Africa Confidential juge ce soutien modeste face aux liens EAU–RSF. Objectif : empêcher un rival d'accéder à la mer Rouge. Soutien matériel démenti.",
      "sources": [
        {
          "name": "Africa Confidential — « Riyadh flashes the gold card »",
          "url": "https://www.africa-confidential.com/article/id/15842/riyadh-flashes-the-gold-card",
          "date": "2025"
        },
        {
          "name": "AllAfrica — alliances et lignes de ravitaillement",
          "url": "https://allafrica.com/stories/202603180257.html",
          "date": "2026-03"
        }
      ]
    },
    {
      "country": "Qatar",
      "country_fr": "Qatar",
      "iso3": "QAT",
      "lon": 51.53,
      "lat": 25.29,
      "support_type": [
        "diplomatique",
        "financement"
      ],
      "certainty": "rapporte",
      "denied": false,
      "status": "Soutien déclaré au « gouvernement légitime »/SAF. Détails matériels peu documentés.",
      "note": "En juillet 2024, un ministre d'État qatari reçu par al-Burhan a confirmé le soutien de Doha au « gouvernement légitime » et aux forces armées soudanaises ; soutien décrit comme politique et financier. Détails matériels PEU DOCUMENTÉS — à traiter avec prudence.",
      "sources": [
        {
          "name": "AllAfrica (fr) — al-Burhan reçoit le ministre d'État qatari",
          "url": "https://fr.allafrica.com/stories/202407240595.html",
          "date": "2024-07-24"
        }
      ]
    },
    {
      "country": "Ukraine",
      "country_fr": "Ukraine",
      "iso3": "UKR",
      "lon": 30.52,
      "lat": 50.45,
      "support_type": [
        "opérations",
        "drones"
      ],
      "certainty": "rapporte",
      "denied": false,
      "status": "Opérations de forces spéciales/drones contre Wagner-RSF rapportées (2023–2024). Kyiv ni confirme ni dément.",
      "note": "CNN (2023) puis le Wall Street Journal (mars 2024) ont rapporté des opérations de FORCES SPÉCIALES ukrainiennes et des frappes de drones visant des cibles RSF liées à Wagner près de Khartoum (et l'évacuation d'al-Burhan). Il s'agit d'opérations CONTRE un soutien du camp adverse (Wagner/RSF) plus que d'un ravitaillement du SAF. KYIV NE CONFIRME NI NE DÉMENT. Sources = fuites/anonymes.",
      "sources": [
        {
          "name": "CNN (via Kyiv Post) — frappes attribuées aux services ukrainiens",
          "url": "https://www.kyivpost.com/post/21821",
          "date": "2023-09"
        },
        {
          "name": "Wall Street Journal (via Euromaidan Press) — forces spéciales ukrainiennes au Soudan",
          "url": "https://euromaidanpress.com/2024/03/06/ukrainian-special-forces-in-secret-mission-against-russians-in-sudan-wsj/",
          "date": "2024-03-06"
        }
      ]
    }
  ],
  "rsf": [
    {
      "country": "United Arab Emirates",
      "country_fr": "Émirats arabes unis",
      "iso3": "ARE",
      "lon": 54.37,
      "lat": 24.47,
      "support_type": [
        "armes",
        "munitions",
        "financement",
        "or"
      ],
      "certainty": "multi-source",
      "denied": true,
      "status": "Allégué ; jugé crédible par le Groupe d'experts de l'ONU. Démenti par les ÉAU.",
      "note": "Soutien au RSF le PLUS DOCUMENTÉ. Le Groupe d'experts de l'ONU (rapport final S/2024/65, 15 janv. 2024) a jugé « crédibles » les allégations de livraisons d'armes/munitions acheminées par un pont aérien via l'aéroport d'Amdjarass (Tchad oriental) vers des positions RSF au Darfour ; il identifie aussi les ÉAU comme pays-clé des réseaux financiers du RSF et de l'exportation d'or soudanais. Les ÉAU DÉMENTENT tout transfert d'armes et affirment n'acheminer que de l'aide humanitaire.",
      "sources": [
        {
          "name": "Groupe d'experts de l'ONU sur le Soudan — rapport final S/2024/65",
          "url": "https://digitallibrary.un.org/record/4039195?ln=en",
          "date": "2024-01-15"
        },
        {
          "name": "The New Arab — UN tracks UAE–Chad military air bridge",
          "url": "https://www.newarab.com/news/un-report-ties-uae-sudan-war-chad-airbridge",
          "date": "2025-04-29"
        },
        {
          "name": "Swissaid — hausse des imports d'or soudanais par les ÉAU",
          "url": "https://globalinitiative.net/analysis/the-illicit-transnational-supply-chains-sustaining-sudans-conflict/",
          "date": "2025"
        }
      ],
      "hub": {
        "name": "Amdjarass (Tchad oriental)",
        "lon": 20.68,
        "lat": 16.07
      }
    },
    {
      "country": "Chad",
      "country_fr": "Tchad",
      "iso3": "TCD",
      "lon": 15.05,
      "lat": 12.11,
      "support_type": [
        "transit",
        "logistique"
      ],
      "certainty": "rapporte",
      "denied": true,
      "status": "Voie de transit rapportée (vols EAU vers l'est du Tchad). N'Djamena dément.",
      "note": "Rapporté comme principale VOIE DE TRANSIT des approvisionnements EAU→RSF en 2023–2024 (aéroports de l'est tchadien). GI-TOC note que les vols EAU vers l'est du Tchad ont baissé en 2025, le trafic se déplaçant vers Koufra (Libye) ou directement vers Nyala, sous la pression de l'armée soudanaise. N'Djamena nie toute coopération avec le RSF.",
      "sources": [
        {
          "name": "Global Initiative (GI-TOC) — chaînes d'approvisionnement illicites",
          "url": "https://globalinitiative.net/analysis/the-illicit-transnational-supply-chains-sustaining-sudans-conflict/",
          "date": "2025"
        },
        {
          "name": "Groupe d'experts de l'ONU sur le Soudan — S/2024/65",
          "url": "https://digitallibrary.un.org/record/4039195?ln=en",
          "date": "2024-01-15"
        }
      ],
      "hub": {
        "name": "Amdjarass / Tchad oriental",
        "lon": 20.68,
        "lat": 16.07
      }
    },
    {
      "country": "Libya",
      "country_fr": "Libye (forces de K. Haftar, est)",
      "iso3": "LBY",
      "lon": 20.07,
      "lat": 32.12,
      "support_type": [
        "transit",
        "carburant",
        "logistique"
      ],
      "certainty": "rapporte",
      "denied": true,
      "status": "Voie de transit / soutien rapporté via l'est libyen (Haftar). Haftar dément.",
      "note": "The Sentry et GI-TOC décrivent le territoire sous contrôle de Khalifa Haftar (est libyen, aligné sur Abou Dhabi) comme un CORRIDOR TERRESTRE clé de ravitaillement du RSF (armes, carburant) via Koufra ; la prise RSF de la zone frontière Soudan–Libye–Égypte en juin 2025, appuyée par une milice pro-Haftar, aurait facilité ces routes. Haftar NIE livrer des armes au RSF.",
      "sources": [
        {
          "name": "The Sentry — rôle de l'est libyen dans le ravitaillement RSF",
          "url": "https://thesentry.org/",
          "date": "2025"
        },
        {
          "name": "Global Initiative (GI-TOC)",
          "url": "https://globalinitiative.net/analysis/the-illicit-transnational-supply-chains-sustaining-sudans-conflict/",
          "date": "2025"
        }
      ],
      "hub": {
        "name": "Koufra (sud-est libyen)",
        "lon": 23.29,
        "lat": 24.18
      }
    },
    {
      "country": "Russia (Wagner / Africa Corps)",
      "country_fr": "Russie (Wagner / réseaux or)",
      "iso3": "RUS",
      "lon": 37.62,
      "lat": 55.75,
      "support_type": [
        "or",
        "logistique",
        "ambivalent"
      ],
      "certainty": "ambivalent",
      "denied": true,
      "status": "Lien historique via Wagner et l'or ; AMBIVALENT — Moscou a basculé vers le SAF en 2024.",
      "note": "Rôle AMBIVALENT. Historiquement, Wagner (et ses affiliés Meroe Gold / M-Invest) exploitait des mines d'or dont les routes de contrebande passaient par la zone d'influence RSF ; estimation Jamestown/banque centrale : ~1,9 Md$ d'or sortis 2022–2023. Mais Moscou a OFFICIELLEMENT BASCULÉ vers le SAF en avril 2024 (reconnaissance d'al-Burhan, promesse d'aide militaire contre une base navale à Port-Soudan). Soutien RSF démenti ; relation en recul.",
      "sources": [
        {
          "name": "Jamestown Foundation — « Russia Switches Sides in Sudan War »",
          "url": "https://jamestown.org/program/russia-switches-sides-in-sudan-war/",
          "date": "2024-05"
        },
        {
          "name": "Critical Threats — « Drones over Sudan »",
          "url": "https://www.criticalthreats.org/analysis/drones-over-sudan-foreign-powers-in-sudans-civil-war",
          "date": "2025-01-27"
        }
      ]
    },
    {
      "country": "South Sudan",
      "country_fr": "Soudan du Sud",
      "iso3": "SSD",
      "lon": 31.58,
      "lat": 4.85,
      "support_type": [
        "transit",
        "or"
      ],
      "certainty": "rapporte",
      "denied": true,
      "status": "Corridor logistique / économie de l'or du RSF rapporté (GI-TOC).",
      "note": "GI-TOC décrit le Soudan du Sud comme central dans l'économie de l'OR du RSF (ex. mars 2024 : des centaines de kg d'or de Songo acheminés via Wau et Juba puis par jet privé vers les ÉAU) et comme corridor logistique. Statut de soutien ÉTATIQUE non établi — il s'agit surtout de routes et de réseaux. À traiter comme TRANSIT allégué.",
      "sources": [
        {
          "name": "Global Initiative (GI-TOC)",
          "url": "https://globalinitiative.net/analysis/the-illicit-transnational-supply-chains-sustaining-sudans-conflict/",
          "date": "2025"
        },
        {
          "name": "Radio Tamazuj — watchdog nomme le Soudan du Sud",
          "url": "https://www.radiotamazuj.org/en/news/article/global-watchdog-names-south-sudan-among-countries-supporting-rsf",
          "date": "2025"
        }
      ]
    }
  ],
  "sources": [
    {
      "name": "ACLED — tensions régionales et conflit soudanais",
      "url": "https://acleddata.com/qa/qa-how-do-escalating-tensions-middle-east-affect-sudan-conflict",
      "date": "2025"
    },
    {
      "name": "ADF Magazine — accord base mer Rouge contre armes",
      "url": "https://adf-magazine.com/2024/06/sudanese-armed-forces-agrees-to-russian-red-sea-base-in-exchange-for-weapons/",
      "date": "2024-06"
    },
    {
      "name": "Africa Confidential — « Riyadh flashes the gold card »",
      "url": "https://www.africa-confidential.com/article/id/15842/riyadh-flashes-the-gold-card",
      "date": "2025"
    },
    {
      "name": "AllAfrica (fr) — al-Burhan reçoit le ministre d'État qatari",
      "url": "https://fr.allafrica.com/stories/202407240595.html",
      "date": "2024-07-24"
    },
    {
      "name": "AllAfrica — alliances et lignes de ravitaillement",
      "url": "https://allafrica.com/stories/202603180257.html",
      "date": "2026-03"
    },
    {
      "name": "Chatham House — Gold and the war in Sudan",
      "url": "https://www.chathamhouse.org/2025/03/gold-and-war-sudan",
      "date": "2025-03-26"
    },
    {
      "name": "CNN (via Kyiv Post) — frappes attribuées aux services ukrainiens",
      "url": "https://www.kyivpost.com/post/21821",
      "date": "2023-09"
    },
    {
      "name": "Conflict Intelligence Group / presse",
      "url": "https://adf-magazine.com/2025/02/colombian-mercenaries-in-sudan-show-internationalization-of-conflict/",
      "date": "2025-02"
    },
    {
      "name": "Critical Threats — « Drones over Sudan »",
      "url": "https://www.criticalthreats.org/analysis/drones-over-sudan-foreign-powers-in-sudans-civil-war",
      "date": "2025-01-27"
    },
    {
      "name": "Dabanga / Horn Review",
      "url": "https://hornreview.org/2025/12/06/destabilization-as-modus-operandi-eritrea-and-the-sudan-conflict/",
      "date": "2025-12-06"
    },
    {
      "name": "Fair Observer — réarmement du SAF (Turquie/Égypte)",
      "url": "https://www.fairobserver.com/region/middle_east_north_africa/as-irans-war-drains-its-arsenal-egypt-turkey-and-pakistan-rearm-sudans-army/",
      "date": "2026"
    },
    {
      "name": "Groupe d'experts de l'ONU sur le Soudan — rapport final S/2024/65",
      "url": "https://digitallibrary.un.org/record/4039195?ln=en",
      "date": "2024-01-15"
    },
    {
      "name": "Human Rights Watch",
      "url": "https://allafrica.com/stories/202606020625.html",
      "date": "2026-06"
    },
    {
      "name": "Jamestown Foundation — « Russia Switches Sides in Sudan War »",
      "url": "https://jamestown.org/program/russia-switches-sides-in-sudan-war/",
      "date": "2024-05"
    },
    {
      "name": "Middle East Eye / US Treasury",
      "url": "https://www.middleeasteye.net/news/sudan-war-wagner-group-weapons-rsf",
      "date": "2023-2024"
    },
    {
      "name": "Radio Tamazuj — watchdog nomme le Soudan du Sud",
      "url": "https://www.radiotamazuj.org/en/news/article/global-watchdog-names-south-sudan-among-countries-supporting-rsf",
      "date": "2025"
    },
    {
      "name": "Reuters / Jurist — charte RSF à Nairobi",
      "url": "https://www.jurist.org/news/2025/02/sudan-paramilitary-group-rsf-signs-charter-to-form-parallel-rival-government/",
      "date": "2025-02-18"
    },
    {
      "name": "RTÉ — explainer guerre du Soudan",
      "url": "https://www.rte.ie/news/world/2025/1031/1541428-sudan-war",
      "date": "2025-10-31"
    },
    {
      "name": "Swissaid — hausse des imports d'or soudanais par les ÉAU",
      "url": "https://globalinitiative.net/analysis/the-illicit-transnational-supply-chains-sustaining-sudans-conflict/",
      "date": "2025"
    },
    {
      "name": "The Cipher Brief — « Sudan: war without borders »",
      "url": "https://www.thecipherbrief.com/sudan-war-without-borders",
      "date": "2025"
    },
    {
      "name": "The New Arab — UN tracks UAE–Chad military air bridge",
      "url": "https://www.newarab.com/news/un-report-ties-uae-sudan-war-chad-airbridge",
      "date": "2025-04-29"
    },
    {
      "name": "The Sentry — rôle de l'est libyen dans le ravitaillement RSF",
      "url": "https://thesentry.org/",
      "date": "2025"
    },
    {
      "name": "Wall Street Journal (via Euromaidan Press) — forces spéciales ukrainiennes au Soudan",
      "url": "https://euromaidanpress.com/2024/03/06/ukrainian-special-forces-in-secret-mission-against-russians-in-sudan-wsj/",
      "date": "2024-03-06"
    },
    {
      "name": "Yahoo/Telegraph — Colombian mercenaries ; Bellingcat",
      "url": "https://www.yahoo.com/news/articles/colombia-teenage-mercenaries-become-soldiers-050000188.html",
      "date": "2025"
    }
  ],
  "note": "SOUTIENS ÉTRANGERS RAPPORTÉS — sujet diplomatiquement sensible, inspiré des cartographies de référence (Le Monde, ACLED, Chatham House). Aucun de ces soutiens n'est « officiel » : ce sont des allégations ATTRIBUÉES à des sources fiables (Groupe d'experts de l'ONU sur le Soudan en priorité, puis ACLED, Chatham House « Gold and the war in Sudan », Reuters/AFP/Al Jazeera, ICG, GI-TOC, The Sentry, Sudan Tribune, Middle East Eye, Conflict Intelligence Group), chacune datée et liée. Les gouvernements concernés DÉMENTENT le plus souvent (champ `denied`). Étiquetage par certitude : « multi-source », « rapporte », « ambivalent » (ex. Russie, des deux côtés). GARDE-FOU : pour un pays-RELAIS (Tchad, Libye, Soudan du Sud, RCA, Somalie/Puntland), le camp indiqué reflète un TRANSIT allégué — pas nécessairement un soutien de l'État. Les `routes` sont des polylignes passant par des HUBS réels (aéroports/villes), indicatives et non des tracés précis. Les polygones pays proviennent de geoBoundaries (CC BY 4.0), simplifiés pour l'affichage. LIMITES : couverture non exhaustive ; dates hétérogènes ; situation évolutive (bascule russe 2024, reflux iranien, baisse des vols EAU via le Tchad en 2025) ; absence d'une entrée ≠ absence de soutien. À lire comme une cartographie PRUDENTE et ÉQUILIBRÉE de ce qui est allégué, pas comme un constat judiciaire."
};
})();
