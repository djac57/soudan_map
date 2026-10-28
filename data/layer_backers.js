/* ------------------------------------------------------------------
 * data/layer_backers.js — COUCHE SOUTIENS ÉTRANGERS (qui soutient SAF vs RSF)
 * Généré par scripts/backers/build_backers.py — NE PAS éditer à la main.
 * Chargé APRÈS data/bundle.js. Additif : pose window.SUDAN.backers.
 * SUJET SENSIBLE : soutiens RAPPORTÉS/ALLÉGUÉS, ATTRIBUÉS à des sources fiables,
 * étiquetés par certitude ; démentis gouvernementaux notés. Équilibre SAF/RSF.
 * Sources privilégiées : Groupe d'experts de l'ONU sur le Soudan — voir .README.md.
 * ------------------------------------------------------------------ */
(function () {
  "use strict";
  window.SUDAN = window.SUDAN || {};
  window.SUDAN.backers = {
  "generated": "2026-10-28",
  "target": {
    "saf": {
      "lon": 32.53,
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
    "certainty": {
      "multi-source": "Confirmé par plusieurs sources indépendantes",
      "rapporte": "Rapporté / allégué (non confirmé indépendamment)",
      "ambivalent": "Rôle changeant / joue les deux camps"
    }
  },
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
      "name": "CNN (via Kyiv Post) — frappes attribuées aux services ukrainiens",
      "url": "https://www.kyivpost.com/post/21821",
      "date": "2023-09"
    },
    {
      "name": "Critical Threats — « Drones over Sudan »",
      "url": "https://www.criticalthreats.org/analysis/drones-over-sudan-foreign-powers-in-sudans-civil-war",
      "date": "2025-01-27"
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
      "name": "Jamestown Foundation — « Russia Switches Sides in Sudan War »",
      "url": "https://jamestown.org/program/russia-switches-sides-in-sudan-war/",
      "date": "2024-05"
    },
    {
      "name": "Radio Tamazuj — watchdog nomme le Soudan du Sud",
      "url": "https://www.radiotamazuj.org/en/news/article/global-watchdog-names-south-sudan-among-countries-supporting-rsf",
      "date": "2025"
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
    }
  ],
  "note": "SOUTIENS ÉTRANGERS RAPPORTÉS — sujet diplomatiquement sensible. Aucun de ces soutiens n'est « officiel » : ce sont des allégations ATTRIBUÉES à des sources fiables (Groupe d'experts de l'ONU sur le Soudan en priorité, puis Reuters/AFP/NYT/Al Jazeera, International Crisis Group, GI-TOC, The Sentry, etc.), chacune datée et liée. Les gouvernements concernés DÉMENTENT le plus souvent (champ `denied`). Étiquetage par certitude : « multi-source » (convergence de plusieurs sources), « rapporte » (allégué / une ou quelques sources), « ambivalent » (rôle changeant, ex. Russie). Le soutien EAU→RSF est le plus documenté (jugé crédible par le Groupe d'experts de l'ONU) ; beaucoup d'autres restent des rapports de presse ou de think tanks. Les coordonnées (lon/lat = capitale/QG ; `hub` = point de transit réel) servent d'éventuelles flèches de flux vers le Soudan — elles n'impliquent pas une route précise. LIMITES : aucune donnée nominative ; rien d'inventé ; situation évolutive (les alliances changent, cf. bascule russe de 2024) ; absence d'une entrée ≠ absence de soutien. À lire comme une cartographie PRUDENTE et ÉQUILIBRÉE de ce qui est allégué, pas comme un constat judiciaire."
};
})();
