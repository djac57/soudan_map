/* ---------------------------------------------------------------------------
 * data/layer_impacts.js  —  COUCHE IMPACTS (proxy de changement de surface S2) El-Fasher
 *
 * GENERE par scripts/impacts/compute_impacts.py — ne pas editer a la main.
 * Charge APRES data/bundle.js. N'ecrase rien : ajoute window.SUDAN.impacts.
 *
 * dNBR = NBR_avant - NBR_apres sur deux acquisitions Sentinel-2 L2A reelles (Planetary
 * Computer, keyless). Agrege en cellules ~250 m. PROXY INDICATIF de changement de surface,
 * PAS une preuve de destruction. GARDE-FOU DARFOUR : surface urbaine agregee, aucun
 * ciblage de camps de deplaces ni de localisation d'exactions.
 * ------------------------------------------------------------------------- */
(function () {
  "use strict";
  window.SUDAN = window.SUDAN || {};
  window.SUDAN.impacts = {
  "sites": [
    {
      "name": "El Fasher",
      "bbox": [
        25.28,
        13.56,
        25.42,
        13.7
      ],
      "center": [
        25.35,
        13.63
      ],
      "date_before": "2024-11-06",
      "date_after": "2026-10-27",
      "cloud_before": 0.0,
      "cloud_after": 0.0,
      "item_before": "S2A_MSIL2A_20241106T084141_R064_T35PLR_20241106T111549",
      "item_after": "S2C_MSIL2A_20261027T084041_R064_T35PLR_20261027T135650",
      "metric": "dNBR",
      "threshold": 0.27,
      "cell_m": 250.0,
      "change": {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.347736,
                    13.700556
                  ],
                  [
                    25.349955,
                    13.700571
                  ],
                  [
                    25.34997,
                    13.698401
                  ],
                  [
                    25.347751,
                    13.698387
                  ],
                  [
                    25.347736,
                    13.700556
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.241,
              "dnbr_p90": 0.509,
              "frac_changed": 0.32,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.361078,
                    13.696306
                  ],
                  [
                    25.363297,
                    13.696321
                  ],
                  [
                    25.363312,
                    13.694151
                  ],
                  [
                    25.361093,
                    13.694137
                  ],
                  [
                    25.361078,
                    13.696306
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.328,
              "dnbr_p90": 0.438,
              "frac_changed": 0.72,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.343345,
                    13.694019
                  ],
                  [
                    25.345563,
                    13.694033
                  ],
                  [
                    25.345578,
                    13.691864
                  ],
                  [
                    25.34336,
                    13.691849
                  ],
                  [
                    25.343345,
                    13.694019
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.201,
              "dnbr_p90": 0.441,
              "frac_changed": 0.36,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.361093,
                    13.694137
                  ],
                  [
                    25.363312,
                    13.694151
                  ],
                  [
                    25.363327,
                    13.691982
                  ],
                  [
                    25.361108,
                    13.691967
                  ],
                  [
                    25.361093,
                    13.694137
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.308,
              "dnbr_p90": 0.425,
              "frac_changed": 0.67,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.34336,
                    13.691849
                  ],
                  [
                    25.345578,
                    13.691864
                  ],
                  [
                    25.345593,
                    13.689695
                  ],
                  [
                    25.343375,
                    13.68968
                  ],
                  [
                    25.34336,
                    13.691849
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.228,
              "dnbr_p90": 0.385,
              "frac_changed": 0.36,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.356671,
                    13.691938
                  ],
                  [
                    25.35889,
                    13.691953
                  ],
                  [
                    25.358905,
                    13.689784
                  ],
                  [
                    25.356686,
                    13.689769
                  ],
                  [
                    25.356671,
                    13.691938
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.285,
              "dnbr_p90": 0.628,
              "frac_changed": 0.4,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.354468,
                    13.689754
                  ],
                  [
                    25.356686,
                    13.689769
                  ],
                  [
                    25.356701,
                    13.6876
                  ],
                  [
                    25.354483,
                    13.687585
                  ],
                  [
                    25.354468,
                    13.689754
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.295,
              "dnbr_p90": 0.574,
              "frac_changed": 0.55,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.363387,
                    13.683305
                  ],
                  [
                    25.365605,
                    13.68332
                  ],
                  [
                    25.36562,
                    13.681151
                  ],
                  [
                    25.363402,
                    13.681136
                  ],
                  [
                    25.363387,
                    13.683305
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.194,
              "dnbr_p90": 0.366,
              "frac_changed": 0.31,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.341536,
                    13.635435
                  ],
                  [
                    25.343754,
                    13.635449
                  ],
                  [
                    25.343769,
                    13.63328
                  ],
                  [
                    25.341551,
                    13.633265
                  ],
                  [
                    25.341536,
                    13.635435
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.243,
              "dnbr_p90": 0.307,
              "frac_changed": 0.37,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.416993,
                    13.629419
                  ],
                  [
                    25.419211,
                    13.629433
                  ],
                  [
                    25.419226,
                    13.627263
                  ],
                  [
                    25.417008,
                    13.627249
                  ],
                  [
                    25.416993,
                    13.629419
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.287,
              "dnbr_p90": 0.356,
              "frac_changed": 0.64,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.328289,
                    13.626669
                  ],
                  [
                    25.330507,
                    13.626683
                  ],
                  [
                    25.330522,
                    13.624514
                  ],
                  [
                    25.328304,
                    13.624499
                  ],
                  [
                    25.328289,
                    13.626669
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.249,
              "dnbr_p90": 0.36,
              "frac_changed": 0.48,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.323868,
                    13.624469
                  ],
                  [
                    25.326086,
                    13.624484
                  ],
                  [
                    25.326101,
                    13.622315
                  ],
                  [
                    25.323883,
                    13.6223
                  ],
                  [
                    25.323868,
                    13.624469
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.244,
              "dnbr_p90": 0.335,
              "frac_changed": 0.34,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.326086,
                    13.624484
                  ],
                  [
                    25.328304,
                    13.624499
                  ],
                  [
                    25.328319,
                    13.62233
                  ],
                  [
                    25.326101,
                    13.622315
                  ],
                  [
                    25.326086,
                    13.624484
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.227,
              "dnbr_p90": 0.365,
              "frac_changed": 0.34,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.350483,
                    13.624647
                  ],
                  [
                    25.352701,
                    13.624662
                  ],
                  [
                    25.352716,
                    13.622493
                  ],
                  [
                    25.350498,
                    13.622478
                  ],
                  [
                    25.350483,
                    13.624647
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.204,
              "dnbr_p90": 0.419,
              "frac_changed": 0.34,
              "n_valid_px": 143
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.323883,
                    13.6223
                  ],
                  [
                    25.326101,
                    13.622315
                  ],
                  [
                    25.326116,
                    13.620146
                  ],
                  [
                    25.323899,
                    13.620131
                  ],
                  [
                    25.323883,
                    13.6223
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.205,
              "dnbr_p90": 0.331,
              "frac_changed": 0.31,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.34828,
                    13.622464
                  ],
                  [
                    25.350498,
                    13.622478
                  ],
                  [
                    25.350513,
                    13.620309
                  ],
                  [
                    25.348295,
                    13.620294
                  ],
                  [
                    25.34828,
                    13.622464
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.25,
              "dnbr_p90": 0.466,
              "frac_changed": 0.42,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.323899,
                    13.620131
                  ],
                  [
                    25.326116,
                    13.620146
                  ],
                  [
                    25.326132,
                    13.617977
                  ],
                  [
                    25.323914,
                    13.617962
                  ],
                  [
                    25.323899,
                    13.620131
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.301,
              "dnbr_p90": 0.462,
              "frac_changed": 0.55,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.326116,
                    13.620146
                  ],
                  [
                    25.328334,
                    13.620161
                  ],
                  [
                    25.32835,
                    13.617992
                  ],
                  [
                    25.326132,
                    13.617977
                  ],
                  [
                    25.326116,
                    13.620146
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.232,
              "dnbr_p90": 0.375,
              "frac_changed": 0.38,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.330552,
                    13.620176
                  ],
                  [
                    25.33277,
                    13.620191
                  ],
                  [
                    25.332785,
                    13.618021
                  ],
                  [
                    25.330567,
                    13.618007
                  ],
                  [
                    25.330552,
                    13.620176
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.256,
              "dnbr_p90": 0.394,
              "frac_changed": 0.48,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.33277,
                    13.620191
                  ],
                  [
                    25.334988,
                    13.620206
                  ],
                  [
                    25.335003,
                    13.618036
                  ],
                  [
                    25.332785,
                    13.618021
                  ],
                  [
                    25.33277,
                    13.620191
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.222,
              "dnbr_p90": 0.367,
              "frac_changed": 0.32,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.348295,
                    13.620294
                  ],
                  [
                    25.350513,
                    13.620309
                  ],
                  [
                    25.350528,
                    13.61814
                  ],
                  [
                    25.34831,
                    13.618125
                  ],
                  [
                    25.348295,
                    13.620294
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.304,
              "dnbr_p90": 0.584,
              "frac_changed": 0.55,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.323914,
                    13.617962
                  ],
                  [
                    25.326132,
                    13.617977
                  ],
                  [
                    25.326147,
                    13.615808
                  ],
                  [
                    25.323929,
                    13.615793
                  ],
                  [
                    25.323914,
                    13.617962
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.3,
              "dnbr_p90": 0.403,
              "frac_changed": 0.73,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.330567,
                    13.618007
                  ],
                  [
                    25.332785,
                    13.618021
                  ],
                  [
                    25.3328,
                    13.615852
                  ],
                  [
                    25.330583,
                    13.615837
                  ],
                  [
                    25.330567,
                    13.618007
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.242,
              "dnbr_p90": 0.33,
              "frac_changed": 0.35,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.343875,
                    13.618096
                  ],
                  [
                    25.346092,
                    13.61811
                  ],
                  [
                    25.346108,
                    13.615941
                  ],
                  [
                    25.34389,
                    13.615926
                  ],
                  [
                    25.343875,
                    13.618096
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.228,
              "dnbr_p90": 0.658,
              "frac_changed": 0.38,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.346092,
                    13.61811
                  ],
                  [
                    25.34831,
                    13.618125
                  ],
                  [
                    25.348325,
                    13.615956
                  ],
                  [
                    25.346108,
                    13.615941
                  ],
                  [
                    25.346092,
                    13.61811
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.487,
              "dnbr_p90": 0.615,
              "frac_changed": 0.93,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.41263,
                    13.618544
                  ],
                  [
                    25.414848,
                    13.618558
                  ],
                  [
                    25.414862,
                    13.616389
                  ],
                  [
                    25.412644,
                    13.616375
                  ],
                  [
                    25.41263,
                    13.618544
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.23,
              "dnbr_p90": 0.312,
              "frac_changed": 0.32,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.330583,
                    13.615837
                  ],
                  [
                    25.3328,
                    13.615852
                  ],
                  [
                    25.332816,
                    13.613683
                  ],
                  [
                    25.330598,
                    13.613668
                  ],
                  [
                    25.330583,
                    13.615837
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.249,
              "dnbr_p90": 0.427,
              "frac_changed": 0.42,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.341672,
                    13.615912
                  ],
                  [
                    25.34389,
                    13.615926
                  ],
                  [
                    25.343905,
                    13.613757
                  ],
                  [
                    25.341687,
                    13.613742
                  ],
                  [
                    25.341672,
                    13.615912
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.247,
              "dnbr_p90": 0.532,
              "frac_changed": 0.49,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.34389,
                    13.615926
                  ],
                  [
                    25.346108,
                    13.615941
                  ],
                  [
                    25.346123,
                    13.613772
                  ],
                  [
                    25.343905,
                    13.613757
                  ],
                  [
                    25.34389,
                    13.615926
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.612,
              "dnbr_p90": 0.736,
              "frac_changed": 0.99,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.346108,
                    13.615941
                  ],
                  [
                    25.348325,
                    13.615956
                  ],
                  [
                    25.34834,
                    13.613787
                  ],
                  [
                    25.346123,
                    13.613772
                  ],
                  [
                    25.346108,
                    13.615941
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.295,
              "dnbr_p90": 0.582,
              "frac_changed": 0.57,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.321727,
                    13.613608
                  ],
                  [
                    25.323944,
                    13.613623
                  ],
                  [
                    25.32396,
                    13.611454
                  ],
                  [
                    25.321742,
                    13.611439
                  ],
                  [
                    25.321727,
                    13.613608
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.219,
              "dnbr_p90": 0.327,
              "frac_changed": 0.33,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.326162,
                    13.613638
                  ],
                  [
                    25.32838,
                    13.613653
                  ],
                  [
                    25.328395,
                    13.611484
                  ],
                  [
                    25.326178,
                    13.611469
                  ],
                  [
                    25.326162,
                    13.613638
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.267,
              "dnbr_p90": 0.369,
              "frac_changed": 0.43,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.32838,
                    13.613653
                  ],
                  [
                    25.330598,
                    13.613668
                  ],
                  [
                    25.330613,
                    13.611499
                  ],
                  [
                    25.328395,
                    13.611484
                  ],
                  [
                    25.32838,
                    13.613653
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.235,
              "dnbr_p90": 0.375,
              "frac_changed": 0.33,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.330598,
                    13.613668
                  ],
                  [
                    25.332816,
                    13.613683
                  ],
                  [
                    25.332831,
                    13.611514
                  ],
                  [
                    25.330613,
                    13.611499
                  ],
                  [
                    25.330598,
                    13.613668
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.251,
              "dnbr_p90": 0.363,
              "frac_changed": 0.33,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412659,
                    13.614205
                  ],
                  [
                    25.414876,
                    13.614219
                  ],
                  [
                    25.414891,
                    13.61205
                  ],
                  [
                    25.412673,
                    13.612036
                  ],
                  [
                    25.412659,
                    13.614205
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.283,
              "dnbr_p90": 0.405,
              "frac_changed": 0.46,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.417094,
                    13.614233
                  ],
                  [
                    25.419312,
                    13.614248
                  ],
                  [
                    25.419327,
                    13.612078
                  ],
                  [
                    25.417109,
                    13.612064
                  ],
                  [
                    25.417094,
                    13.614233
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.268,
              "dnbr_p90": 0.372,
              "frac_changed": 0.45,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.315089,
                    13.611394
                  ],
                  [
                    25.317306,
                    13.611409
                  ],
                  [
                    25.317322,
                    13.60924
                  ],
                  [
                    25.315104,
                    13.609225
                  ],
                  [
                    25.315089,
                    13.611394
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.243,
              "dnbr_p90": 0.379,
              "frac_changed": 0.4,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.319524,
                    13.611424
                  ],
                  [
                    25.321742,
                    13.611439
                  ],
                  [
                    25.321757,
                    13.60927
                  ],
                  [
                    25.319539,
                    13.609255
                  ],
                  [
                    25.319524,
                    13.611424
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.245,
              "dnbr_p90": 0.345,
              "frac_changed": 0.46,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.32396,
                    13.611454
                  ],
                  [
                    25.326178,
                    13.611469
                  ],
                  [
                    25.326193,
                    13.6093
                  ],
                  [
                    25.323975,
                    13.609285
                  ],
                  [
                    25.32396,
                    13.611454
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.223,
              "dnbr_p90": 0.342,
              "frac_changed": 0.33,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.328395,
                    13.611484
                  ],
                  [
                    25.330613,
                    13.611499
                  ],
                  [
                    25.330628,
                    13.60933
                  ],
                  [
                    25.328411,
                    13.609315
                  ],
                  [
                    25.328395,
                    13.611484
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.272,
              "dnbr_p90": 0.357,
              "frac_changed": 0.47,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.330613,
                    13.611499
                  ],
                  [
                    25.332831,
                    13.611514
                  ],
                  [
                    25.332846,
                    13.609345
                  ],
                  [
                    25.330628,
                    13.60933
                  ],
                  [
                    25.330613,
                    13.611499
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.24,
              "dnbr_p90": 0.375,
              "frac_changed": 0.31,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.414891,
                    13.61205
                  ],
                  [
                    25.417109,
                    13.612064
                  ],
                  [
                    25.417123,
                    13.609895
                  ],
                  [
                    25.414905,
                    13.609881
                  ],
                  [
                    25.414891,
                    13.61205
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.255,
              "dnbr_p90": 0.351,
              "frac_changed": 0.42,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.317322,
                    13.60924
                  ],
                  [
                    25.319539,
                    13.609255
                  ],
                  [
                    25.319555,
                    13.607086
                  ],
                  [
                    25.317337,
                    13.607071
                  ],
                  [
                    25.317322,
                    13.60924
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.239,
              "dnbr_p90": 0.31,
              "frac_changed": 0.32,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.319539,
                    13.609255
                  ],
                  [
                    25.321757,
                    13.60927
                  ],
                  [
                    25.321773,
                    13.607101
                  ],
                  [
                    25.319555,
                    13.607086
                  ],
                  [
                    25.319539,
                    13.609255
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.245,
              "dnbr_p90": 0.329,
              "frac_changed": 0.4,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.321757,
                    13.60927
                  ],
                  [
                    25.323975,
                    13.609285
                  ],
                  [
                    25.32399,
                    13.607116
                  ],
                  [
                    25.321773,
                    13.607101
                  ],
                  [
                    25.321757,
                    13.60927
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.233,
              "dnbr_p90": 0.341,
              "frac_changed": 0.33,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.330628,
                    13.60933
                  ],
                  [
                    25.332846,
                    13.609345
                  ],
                  [
                    25.332861,
                    13.607175
                  ],
                  [
                    25.330644,
                    13.60716
                  ],
                  [
                    25.330628,
                    13.60933
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.217,
              "dnbr_p90": 0.345,
              "frac_changed": 0.33,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.403816,
                    13.60981
                  ],
                  [
                    25.406034,
                    13.609824
                  ],
                  [
                    25.406048,
                    13.607655
                  ],
                  [
                    25.403831,
                    13.607641
                  ],
                  [
                    25.403816,
                    13.60981
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.27,
              "dnbr_p90": 0.355,
              "frac_changed": 0.51,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.414905,
                    13.609881
                  ],
                  [
                    25.417123,
                    13.609895
                  ],
                  [
                    25.417138,
                    13.607726
                  ],
                  [
                    25.41492,
                    13.607711
                  ],
                  [
                    25.414905,
                    13.609881
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.257,
              "dnbr_p90": 0.381,
              "frac_changed": 0.42,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.286289,
                    13.606859
                  ],
                  [
                    25.288507,
                    13.606874
                  ],
                  [
                    25.288522,
                    13.604705
                  ],
                  [
                    25.286305,
                    13.60469
                  ],
                  [
                    25.286289,
                    13.606859
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.266,
              "dnbr_p90": 0.357,
              "frac_changed": 0.47,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.288507,
                    13.606874
                  ],
                  [
                    25.290724,
                    13.60689
                  ],
                  [
                    25.29074,
                    13.60472
                  ],
                  [
                    25.288522,
                    13.604705
                  ],
                  [
                    25.288507,
                    13.606874
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.243,
              "dnbr_p90": 0.312,
              "frac_changed": 0.46,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.315119,
                    13.607056
                  ],
                  [
                    25.317337,
                    13.607071
                  ],
                  [
                    25.317352,
                    13.604902
                  ],
                  [
                    25.315135,
                    13.604887
                  ],
                  [
                    25.315119,
                    13.607056
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.284,
              "dnbr_p90": 0.346,
              "frac_changed": 0.65,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.317337,
                    13.607071
                  ],
                  [
                    25.319555,
                    13.607086
                  ],
                  [
                    25.31957,
                    13.604917
                  ],
                  [
                    25.317352,
                    13.604902
                  ],
                  [
                    25.317337,
                    13.607071
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.263,
              "dnbr_p90": 0.299,
              "frac_changed": 0.42,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412702,
                    13.607697
                  ],
                  [
                    25.41492,
                    13.607711
                  ],
                  [
                    25.414934,
                    13.605542
                  ],
                  [
                    25.412716,
                    13.605528
                  ],
                  [
                    25.412702,
                    13.607697
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.239,
              "dnbr_p90": 0.371,
              "frac_changed": 0.31,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.279652,
                    13.604644
                  ],
                  [
                    25.281869,
                    13.604659
                  ],
                  [
                    25.281885,
                    13.60249
                  ],
                  [
                    25.279667,
                    13.602475
                  ],
                  [
                    25.279652,
                    13.604644
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.222,
              "dnbr_p90": 0.321,
              "frac_changed": 0.35,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.281869,
                    13.604659
                  ],
                  [
                    25.284087,
                    13.604675
                  ],
                  [
                    25.284103,
                    13.602505
                  ],
                  [
                    25.281885,
                    13.60249
                  ],
                  [
                    25.281869,
                    13.604659
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.311,
              "dnbr_p90": 0.399,
              "frac_changed": 0.81,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.284087,
                    13.604675
                  ],
                  [
                    25.286305,
                    13.60469
                  ],
                  [
                    25.28632,
                    13.602521
                  ],
                  [
                    25.284103,
                    13.602505
                  ],
                  [
                    25.284087,
                    13.604675
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.318,
              "dnbr_p90": 0.4,
              "frac_changed": 0.76,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.286305,
                    13.60469
                  ],
                  [
                    25.288522,
                    13.604705
                  ],
                  [
                    25.288538,
                    13.602536
                  ],
                  [
                    25.28632,
                    13.602521
                  ],
                  [
                    25.286305,
                    13.60469
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.258,
              "dnbr_p90": 0.365,
              "frac_changed": 0.38,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.288522,
                    13.604705
                  ],
                  [
                    25.29074,
                    13.60472
                  ],
                  [
                    25.290756,
                    13.602551
                  ],
                  [
                    25.288538,
                    13.602536
                  ],
                  [
                    25.288522,
                    13.604705
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.257,
              "dnbr_p90": 0.325,
              "frac_changed": 0.33,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.315135,
                    13.604887
                  ],
                  [
                    25.317352,
                    13.604902
                  ],
                  [
                    25.317368,
                    13.602732
                  ],
                  [
                    25.31515,
                    13.602717
                  ],
                  [
                    25.315135,
                    13.604887
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.268,
              "dnbr_p90": 0.333,
              "frac_changed": 0.56,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.403845,
                    13.605471
                  ],
                  [
                    25.406063,
                    13.605485
                  ],
                  [
                    25.406077,
                    13.603316
                  ],
                  [
                    25.40386,
                    13.603302
                  ],
                  [
                    25.403845,
                    13.605471
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.254,
              "dnbr_p90": 0.341,
              "frac_changed": 0.33,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.406063,
                    13.605485
                  ],
                  [
                    25.408281,
                    13.6055
                  ],
                  [
                    25.408295,
                    13.60333
                  ],
                  [
                    25.406077,
                    13.603316
                  ],
                  [
                    25.406063,
                    13.605485
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.254,
              "dnbr_p90": 0.356,
              "frac_changed": 0.4,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.414934,
                    13.605542
                  ],
                  [
                    25.417152,
                    13.605556
                  ],
                  [
                    25.417166,
                    13.603387
                  ],
                  [
                    25.414949,
                    13.603373
                  ],
                  [
                    25.414934,
                    13.605542
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.244,
              "dnbr_p90": 0.372,
              "frac_changed": 0.33,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.279667,
                    13.602475
                  ],
                  [
                    25.281885,
                    13.60249
                  ],
                  [
                    25.281901,
                    13.600321
                  ],
                  [
                    25.279683,
                    13.600306
                  ],
                  [
                    25.279667,
                    13.602475
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.272,
              "dnbr_p90": 0.378,
              "frac_changed": 0.61,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.390553,
                    13.603216
                  ],
                  [
                    25.392771,
                    13.603231
                  ],
                  [
                    25.392785,
                    13.601061
                  ],
                  [
                    25.390568,
                    13.601047
                  ],
                  [
                    25.390553,
                    13.603216
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.258,
              "dnbr_p90": 0.356,
              "frac_changed": 0.41,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.406077,
                    13.603316
                  ],
                  [
                    25.408295,
                    13.60333
                  ],
                  [
                    25.40831,
                    13.601161
                  ],
                  [
                    25.406092,
                    13.601147
                  ],
                  [
                    25.406077,
                    13.603316
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.311,
              "dnbr_p90": 0.408,
              "frac_changed": 0.63,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.408295,
                    13.60333
                  ],
                  [
                    25.410513,
                    13.603345
                  ],
                  [
                    25.410528,
                    13.601175
                  ],
                  [
                    25.40831,
                    13.601161
                  ],
                  [
                    25.408295,
                    13.60333
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.265,
              "dnbr_p90": 0.345,
              "frac_changed": 0.38,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412731,
                    13.603359
                  ],
                  [
                    25.414949,
                    13.603373
                  ],
                  [
                    25.414963,
                    13.601203
                  ],
                  [
                    25.412745,
                    13.601189
                  ],
                  [
                    25.412731,
                    13.603359
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.279,
              "dnbr_p90": 0.377,
              "frac_changed": 0.54,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.286336,
                    13.600352
                  ],
                  [
                    25.288554,
                    13.600367
                  ],
                  [
                    25.288569,
                    13.598198
                  ],
                  [
                    25.286352,
                    13.598182
                  ],
                  [
                    25.286336,
                    13.600352
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.248,
              "dnbr_p90": 0.325,
              "frac_changed": 0.38,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.321818,
                    13.600593
                  ],
                  [
                    25.324036,
                    13.600608
                  ],
                  [
                    25.324051,
                    13.598439
                  ],
                  [
                    25.321834,
                    13.598424
                  ],
                  [
                    25.321818,
                    13.600593
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.254,
              "dnbr_p90": 0.382,
              "frac_changed": 0.38,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.326254,
                    13.600623
                  ],
                  [
                    25.328471,
                    13.600638
                  ],
                  [
                    25.328487,
                    13.598469
                  ],
                  [
                    25.326269,
                    13.598454
                  ],
                  [
                    25.326254,
                    13.600623
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.223,
              "dnbr_p90": 0.458,
              "frac_changed": 0.31,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.38835,
                    13.601033
                  ],
                  [
                    25.390568,
                    13.601047
                  ],
                  [
                    25.390582,
                    13.598878
                  ],
                  [
                    25.388365,
                    13.598863
                  ],
                  [
                    25.38835,
                    13.601033
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.274,
              "dnbr_p90": 0.335,
              "frac_changed": 0.53,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.40831,
                    13.601161
                  ],
                  [
                    25.410528,
                    13.601175
                  ],
                  [
                    25.410542,
                    13.599006
                  ],
                  [
                    25.408324,
                    13.598992
                  ],
                  [
                    25.40831,
                    13.601161
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.272,
              "dnbr_p90": 0.396,
              "frac_changed": 0.51,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.410528,
                    13.601175
                  ],
                  [
                    25.412745,
                    13.601189
                  ],
                  [
                    25.41276,
                    13.59902
                  ],
                  [
                    25.410542,
                    13.599006
                  ],
                  [
                    25.410528,
                    13.601175
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.221,
              "dnbr_p90": 0.315,
              "frac_changed": 0.32,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412745,
                    13.601189
                  ],
                  [
                    25.414963,
                    13.601203
                  ],
                  [
                    25.414978,
                    13.599034
                  ],
                  [
                    25.41276,
                    13.59902
                  ],
                  [
                    25.412745,
                    13.601189
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.325,
              "dnbr_p90": 0.445,
              "frac_changed": 0.72,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.414963,
                    13.601203
                  ],
                  [
                    25.417181,
                    13.601218
                  ],
                  [
                    25.417195,
                    13.599048
                  ],
                  [
                    25.414978,
                    13.599034
                  ],
                  [
                    25.414963,
                    13.601203
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.256,
              "dnbr_p90": 0.36,
              "frac_changed": 0.44,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.417181,
                    13.601218
                  ],
                  [
                    25.419399,
                    13.601232
                  ],
                  [
                    25.419413,
                    13.599062
                  ],
                  [
                    25.417195,
                    13.599048
                  ],
                  [
                    25.417181,
                    13.601218
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.26,
              "dnbr_p90": 0.339,
              "frac_changed": 0.42,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.410542,
                    13.599006
                  ],
                  [
                    25.41276,
                    13.59902
                  ],
                  [
                    25.412774,
                    13.596851
                  ],
                  [
                    25.410556,
                    13.596837
                  ],
                  [
                    25.410542,
                    13.599006
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.232,
              "dnbr_p90": 0.326,
              "frac_changed": 0.32,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.41276,
                    13.59902
                  ],
                  [
                    25.414978,
                    13.599034
                  ],
                  [
                    25.414992,
                    13.596865
                  ],
                  [
                    25.412774,
                    13.596851
                  ],
                  [
                    25.41276,
                    13.59902
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.27,
              "dnbr_p90": 0.43,
              "frac_changed": 0.51,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.414978,
                    13.599034
                  ],
                  [
                    25.417195,
                    13.599048
                  ],
                  [
                    25.41721,
                    13.596879
                  ],
                  [
                    25.414992,
                    13.596865
                  ],
                  [
                    25.414978,
                    13.599034
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.287,
              "dnbr_p90": 0.409,
              "frac_changed": 0.53,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.286367,
                    13.596013
                  ],
                  [
                    25.288585,
                    13.596028
                  ],
                  [
                    25.2886,
                    13.593859
                  ],
                  [
                    25.286383,
                    13.593844
                  ],
                  [
                    25.286367,
                    13.596013
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.234,
              "dnbr_p90": 0.369,
              "frac_changed": 0.35,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.288585,
                    13.596028
                  ],
                  [
                    25.290802,
                    13.596044
                  ],
                  [
                    25.290818,
                    13.593874
                  ],
                  [
                    25.2886,
                    13.593859
                  ],
                  [
                    25.288585,
                    13.596028
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.319,
              "dnbr_p90": 0.415,
              "frac_changed": 0.75,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.290802,
                    13.596044
                  ],
                  [
                    25.29302,
                    13.596059
                  ],
                  [
                    25.293035,
                    13.59389
                  ],
                  [
                    25.290818,
                    13.593874
                  ],
                  [
                    25.290802,
                    13.596044
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.227,
              "dnbr_p90": 0.356,
              "frac_changed": 0.33,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.410556,
                    13.596837
                  ],
                  [
                    25.412774,
                    13.596851
                  ],
                  [
                    25.412789,
                    13.594681
                  ],
                  [
                    25.410571,
                    13.594667
                  ],
                  [
                    25.410556,
                    13.596837
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.235,
              "dnbr_p90": 0.311,
              "frac_changed": 0.4,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412774,
                    13.596851
                  ],
                  [
                    25.414992,
                    13.596865
                  ],
                  [
                    25.415006,
                    13.594696
                  ],
                  [
                    25.412789,
                    13.594681
                  ],
                  [
                    25.412774,
                    13.596851
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.281,
              "dnbr_p90": 0.379,
              "frac_changed": 0.59,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.414992,
                    13.596865
                  ],
                  [
                    25.41721,
                    13.596879
                  ],
                  [
                    25.417224,
                    13.59471
                  ],
                  [
                    25.415006,
                    13.594696
                  ],
                  [
                    25.414992,
                    13.596865
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.269,
              "dnbr_p90": 0.443,
              "frac_changed": 0.44,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.41721,
                    13.596879
                  ],
                  [
                    25.419427,
                    13.596893
                  ],
                  [
                    25.419442,
                    13.594724
                  ],
                  [
                    25.417224,
                    13.59471
                  ],
                  [
                    25.41721,
                    13.596879
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.273,
              "dnbr_p90": 0.405,
              "frac_changed": 0.5,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.2886,
                    13.593859
                  ],
                  [
                    25.290818,
                    13.593874
                  ],
                  [
                    25.290833,
                    13.591705
                  ],
                  [
                    25.288616,
                    13.59169
                  ],
                  [
                    25.2886,
                    13.593859
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.356,
              "dnbr_p90": 0.477,
              "frac_changed": 0.83,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.293035,
                    13.59389
                  ],
                  [
                    25.295253,
                    13.593905
                  ],
                  [
                    25.295269,
                    13.591736
                  ],
                  [
                    25.293051,
                    13.591721
                  ],
                  [
                    25.293035,
                    13.59389
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.247,
              "dnbr_p90": 0.47,
              "frac_changed": 0.35,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.295253,
                    13.593905
                  ],
                  [
                    25.297471,
                    13.59392
                  ],
                  [
                    25.297486,
                    13.591751
                  ],
                  [
                    25.295269,
                    13.591736
                  ],
                  [
                    25.295253,
                    13.593905
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.265,
              "dnbr_p90": 0.375,
              "frac_changed": 0.48,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412789,
                    13.594681
                  ],
                  [
                    25.415006,
                    13.594696
                  ],
                  [
                    25.415021,
                    13.592526
                  ],
                  [
                    25.412803,
                    13.592512
                  ],
                  [
                    25.412789,
                    13.594681
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.258,
              "dnbr_p90": 0.396,
              "frac_changed": 0.47,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.415006,
                    13.594696
                  ],
                  [
                    25.417224,
                    13.59471
                  ],
                  [
                    25.417239,
                    13.59254
                  ],
                  [
                    25.415021,
                    13.592526
                  ],
                  [
                    25.415006,
                    13.594696
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.443,
              "dnbr_p90": 0.556,
              "frac_changed": 0.97,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.417224,
                    13.59471
                  ],
                  [
                    25.419442,
                    13.594724
                  ],
                  [
                    25.419456,
                    13.592554
                  ],
                  [
                    25.417239,
                    13.59254
                  ],
                  [
                    25.417224,
                    13.59471
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.364,
              "dnbr_p90": 0.485,
              "frac_changed": 0.85,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.279746,
                    13.591629
                  ],
                  [
                    25.281963,
                    13.591644
                  ],
                  [
                    25.281979,
                    13.589475
                  ],
                  [
                    25.279761,
                    13.58946
                  ],
                  [
                    25.279746,
                    13.591629
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.305,
              "dnbr_p90": 0.409,
              "frac_changed": 0.65,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.281963,
                    13.591644
                  ],
                  [
                    25.284181,
                    13.59166
                  ],
                  [
                    25.284196,
                    13.58949
                  ],
                  [
                    25.281979,
                    13.589475
                  ],
                  [
                    25.281963,
                    13.591644
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.239,
              "dnbr_p90": 0.407,
              "frac_changed": 0.38,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.286398,
                    13.591675
                  ],
                  [
                    25.288616,
                    13.59169
                  ],
                  [
                    25.288631,
                    13.589521
                  ],
                  [
                    25.286414,
                    13.589506
                  ],
                  [
                    25.286398,
                    13.591675
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.256,
              "dnbr_p90": 0.376,
              "frac_changed": 0.47,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.288616,
                    13.59169
                  ],
                  [
                    25.290833,
                    13.591705
                  ],
                  [
                    25.290849,
                    13.589536
                  ],
                  [
                    25.288631,
                    13.589521
                  ],
                  [
                    25.288616,
                    13.59169
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.278,
              "dnbr_p90": 0.41,
              "frac_changed": 0.52,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.293051,
                    13.591721
                  ],
                  [
                    25.295269,
                    13.591736
                  ],
                  [
                    25.295284,
                    13.589567
                  ],
                  [
                    25.293066,
                    13.589551
                  ],
                  [
                    25.293051,
                    13.591721
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.305,
              "dnbr_p90": 0.434,
              "frac_changed": 0.66,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.295269,
                    13.591736
                  ],
                  [
                    25.297486,
                    13.591751
                  ],
                  [
                    25.297502,
                    13.589582
                  ],
                  [
                    25.295284,
                    13.589567
                  ],
                  [
                    25.295269,
                    13.591736
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.217,
              "dnbr_p90": 0.351,
              "frac_changed": 0.32,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.390626,
                    13.59237
                  ],
                  [
                    25.392844,
                    13.592384
                  ],
                  [
                    25.392859,
                    13.590215
                  ],
                  [
                    25.390641,
                    13.590201
                  ],
                  [
                    25.390626,
                    13.59237
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.26,
              "dnbr_p90": 0.345,
              "frac_changed": 0.44,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.392844,
                    13.592384
                  ],
                  [
                    25.395062,
                    13.592398
                  ],
                  [
                    25.395076,
                    13.590229
                  ],
                  [
                    25.392859,
                    13.590215
                  ],
                  [
                    25.392844,
                    13.592384
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.246,
              "dnbr_p90": 0.343,
              "frac_changed": 0.42,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412803,
                    13.592512
                  ],
                  [
                    25.415021,
                    13.592526
                  ],
                  [
                    25.415035,
                    13.590357
                  ],
                  [
                    25.412818,
                    13.590343
                  ],
                  [
                    25.412803,
                    13.592512
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.319,
              "dnbr_p90": 0.435,
              "frac_changed": 0.72,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.415021,
                    13.592526
                  ],
                  [
                    25.417239,
                    13.59254
                  ],
                  [
                    25.417253,
                    13.590371
                  ],
                  [
                    25.415035,
                    13.590357
                  ],
                  [
                    25.415021,
                    13.592526
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.432,
              "dnbr_p90": 0.545,
              "frac_changed": 0.99,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.417239,
                    13.59254
                  ],
                  [
                    25.419456,
                    13.592554
                  ],
                  [
                    25.419471,
                    13.590385
                  ],
                  [
                    25.417253,
                    13.590371
                  ],
                  [
                    25.417239,
                    13.59254
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.374,
              "dnbr_p90": 0.47,
              "frac_changed": 0.92,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.284196,
                    13.58949
                  ],
                  [
                    25.286414,
                    13.589506
                  ],
                  [
                    25.286429,
                    13.587337
                  ],
                  [
                    25.284212,
                    13.587321
                  ],
                  [
                    25.284196,
                    13.58949
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.2,
              "dnbr_p90": 0.334,
              "frac_changed": 0.38,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.286414,
                    13.589506
                  ],
                  [
                    25.288631,
                    13.589521
                  ],
                  [
                    25.288647,
                    13.587352
                  ],
                  [
                    25.286429,
                    13.587337
                  ],
                  [
                    25.286414,
                    13.589506
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.229,
              "dnbr_p90": 0.371,
              "frac_changed": 0.41,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.290849,
                    13.589536
                  ],
                  [
                    25.293066,
                    13.589551
                  ],
                  [
                    25.293082,
                    13.587382
                  ],
                  [
                    25.290864,
                    13.587367
                  ],
                  [
                    25.290849,
                    13.589536
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.317,
              "dnbr_p90": 0.413,
              "frac_changed": 0.76,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.293066,
                    13.589551
                  ],
                  [
                    25.295284,
                    13.589567
                  ],
                  [
                    25.2953,
                    13.587397
                  ],
                  [
                    25.293082,
                    13.587382
                  ],
                  [
                    25.293066,
                    13.589551
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.277,
              "dnbr_p90": 0.358,
              "frac_changed": 0.51,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.38177,
                    13.590143
                  ],
                  [
                    25.383988,
                    13.590158
                  ],
                  [
                    25.384003,
                    13.587988
                  ],
                  [
                    25.381785,
                    13.587974
                  ],
                  [
                    25.38177,
                    13.590143
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.304,
              "dnbr_p90": 0.473,
              "frac_changed": 0.6,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.390641,
                    13.590201
                  ],
                  [
                    25.392859,
                    13.590215
                  ],
                  [
                    25.392873,
                    13.588046
                  ],
                  [
                    25.390656,
                    13.588031
                  ],
                  [
                    25.390641,
                    13.590201
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.236,
              "dnbr_p90": 0.315,
              "frac_changed": 0.33,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.392859,
                    13.590215
                  ],
                  [
                    25.395076,
                    13.590229
                  ],
                  [
                    25.395091,
                    13.58806
                  ],
                  [
                    25.392873,
                    13.588046
                  ],
                  [
                    25.392859,
                    13.590215
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.236,
              "dnbr_p90": 0.308,
              "frac_changed": 0.33,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.4106,
                    13.590329
                  ],
                  [
                    25.412818,
                    13.590343
                  ],
                  [
                    25.412832,
                    13.588173
                  ],
                  [
                    25.410614,
                    13.588159
                  ],
                  [
                    25.4106,
                    13.590329
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.23,
              "dnbr_p90": 0.363,
              "frac_changed": 0.37,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412818,
                    13.590343
                  ],
                  [
                    25.415035,
                    13.590357
                  ],
                  [
                    25.41505,
                    13.588188
                  ],
                  [
                    25.412832,
                    13.588173
                  ],
                  [
                    25.412818,
                    13.590343
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.264,
              "dnbr_p90": 0.482,
              "frac_changed": 0.37,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.415035,
                    13.590357
                  ],
                  [
                    25.417253,
                    13.590371
                  ],
                  [
                    25.417267,
                    13.588202
                  ],
                  [
                    25.41505,
                    13.588188
                  ],
                  [
                    25.415035,
                    13.590357
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.464,
              "dnbr_p90": 0.601,
              "frac_changed": 0.96,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.417253,
                    13.590371
                  ],
                  [
                    25.419471,
                    13.590385
                  ],
                  [
                    25.419485,
                    13.588216
                  ],
                  [
                    25.417267,
                    13.588202
                  ],
                  [
                    25.417253,
                    13.590371
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.457,
              "dnbr_p90": 0.599,
              "frac_changed": 0.97,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.284212,
                    13.587321
                  ],
                  [
                    25.286429,
                    13.587337
                  ],
                  [
                    25.286445,
                    13.585167
                  ],
                  [
                    25.284228,
                    13.585152
                  ],
                  [
                    25.284212,
                    13.587321
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.204,
              "dnbr_p90": 0.375,
              "frac_changed": 0.35,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.286429,
                    13.587337
                  ],
                  [
                    25.288647,
                    13.587352
                  ],
                  [
                    25.288663,
                    13.585183
                  ],
                  [
                    25.286445,
                    13.585167
                  ],
                  [
                    25.286429,
                    13.587337
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.24,
              "dnbr_p90": 0.372,
              "frac_changed": 0.46,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.288647,
                    13.587352
                  ],
                  [
                    25.290864,
                    13.587367
                  ],
                  [
                    25.29088,
                    13.585198
                  ],
                  [
                    25.288663,
                    13.585183
                  ],
                  [
                    25.288647,
                    13.587352
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.231,
              "dnbr_p90": 0.382,
              "frac_changed": 0.33,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.290864,
                    13.587367
                  ],
                  [
                    25.293082,
                    13.587382
                  ],
                  [
                    25.293098,
                    13.585213
                  ],
                  [
                    25.29088,
                    13.585198
                  ],
                  [
                    25.290864,
                    13.587367
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.333,
              "dnbr_p90": 0.453,
              "frac_changed": 0.79,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.293082,
                    13.587382
                  ],
                  [
                    25.2953,
                    13.587397
                  ],
                  [
                    25.295315,
                    13.585228
                  ],
                  [
                    25.293098,
                    13.585213
                  ],
                  [
                    25.293082,
                    13.587382
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.328,
              "dnbr_p90": 0.435,
              "frac_changed": 0.73,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.2953,
                    13.587397
                  ],
                  [
                    25.297517,
                    13.587412
                  ],
                  [
                    25.297533,
                    13.585243
                  ],
                  [
                    25.295315,
                    13.585228
                  ],
                  [
                    25.2953,
                    13.587397
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.3,
              "dnbr_p90": 0.394,
              "frac_changed": 0.63,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.324128,
                    13.587593
                  ],
                  [
                    25.326345,
                    13.587608
                  ],
                  [
                    25.32636,
                    13.585439
                  ],
                  [
                    25.324143,
                    13.585424
                  ],
                  [
                    25.324128,
                    13.587593
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.35,
              "dnbr_p90": 0.595,
              "frac_changed": 0.59,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.326345,
                    13.587608
                  ],
                  [
                    25.328563,
                    13.587623
                  ],
                  [
                    25.328578,
                    13.585453
                  ],
                  [
                    25.32636,
                    13.585439
                  ],
                  [
                    25.326345,
                    13.587608
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.282,
              "dnbr_p90": 0.449,
              "frac_changed": 0.56,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.381785,
                    13.587974
                  ],
                  [
                    25.384003,
                    13.587988
                  ],
                  [
                    25.384017,
                    13.585819
                  ],
                  [
                    25.3818,
                    13.585805
                  ],
                  [
                    25.381785,
                    13.587974
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.252,
              "dnbr_p90": 0.402,
              "frac_changed": 0.42,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.390656,
                    13.588031
                  ],
                  [
                    25.392873,
                    13.588046
                  ],
                  [
                    25.392888,
                    13.585876
                  ],
                  [
                    25.39067,
                    13.585862
                  ],
                  [
                    25.390656,
                    13.588031
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.259,
              "dnbr_p90": 0.355,
              "frac_changed": 0.39,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.392873,
                    13.588046
                  ],
                  [
                    25.395091,
                    13.58806
                  ],
                  [
                    25.395105,
                    13.585891
                  ],
                  [
                    25.392888,
                    13.585876
                  ],
                  [
                    25.392873,
                    13.588046
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.271,
              "dnbr_p90": 0.377,
              "frac_changed": 0.49,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412832,
                    13.588173
                  ],
                  [
                    25.41505,
                    13.588188
                  ],
                  [
                    25.415064,
                    13.586018
                  ],
                  [
                    25.412846,
                    13.586004
                  ],
                  [
                    25.412832,
                    13.588173
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.274,
              "dnbr_p90": 0.507,
              "frac_changed": 0.41,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.41505,
                    13.588188
                  ],
                  [
                    25.417267,
                    13.588202
                  ],
                  [
                    25.417282,
                    13.586032
                  ],
                  [
                    25.415064,
                    13.586018
                  ],
                  [
                    25.41505,
                    13.588188
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.337,
              "dnbr_p90": 0.493,
              "frac_changed": 0.55,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.417267,
                    13.588202
                  ],
                  [
                    25.419485,
                    13.588216
                  ],
                  [
                    25.419499,
                    13.586046
                  ],
                  [
                    25.417282,
                    13.586032
                  ],
                  [
                    25.417267,
                    13.588202
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.432,
              "dnbr_p90": 0.634,
              "frac_changed": 0.87,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.286445,
                    13.585167
                  ],
                  [
                    25.288663,
                    13.585183
                  ],
                  [
                    25.288678,
                    13.583013
                  ],
                  [
                    25.286461,
                    13.582998
                  ],
                  [
                    25.286445,
                    13.585167
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.233,
              "dnbr_p90": 0.362,
              "frac_changed": 0.31,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.29088,
                    13.585198
                  ],
                  [
                    25.293098,
                    13.585213
                  ],
                  [
                    25.293113,
                    13.583044
                  ],
                  [
                    25.290896,
                    13.583029
                  ],
                  [
                    25.29088,
                    13.585198
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.258,
              "dnbr_p90": 0.402,
              "frac_changed": 0.37,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.293098,
                    13.585213
                  ],
                  [
                    25.295315,
                    13.585228
                  ],
                  [
                    25.295331,
                    13.583059
                  ],
                  [
                    25.293113,
                    13.583044
                  ],
                  [
                    25.293098,
                    13.585213
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.304,
              "dnbr_p90": 0.445,
              "frac_changed": 0.56,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.295315,
                    13.585228
                  ],
                  [
                    25.297533,
                    13.585243
                  ],
                  [
                    25.297548,
                    13.583074
                  ],
                  [
                    25.295331,
                    13.583059
                  ],
                  [
                    25.295315,
                    13.585228
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.237,
              "dnbr_p90": 0.309,
              "frac_changed": 0.31,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.32636,
                    13.585439
                  ],
                  [
                    25.328578,
                    13.585453
                  ],
                  [
                    25.328593,
                    13.583284
                  ],
                  [
                    25.326376,
                    13.583269
                  ],
                  [
                    25.32636,
                    13.585439
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.27,
              "dnbr_p90": 0.547,
              "frac_changed": 0.44,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.3818,
                    13.585805
                  ],
                  [
                    25.384017,
                    13.585819
                  ],
                  [
                    25.384032,
                    13.58365
                  ],
                  [
                    25.381814,
                    13.583635
                  ],
                  [
                    25.3818,
                    13.585805
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.239,
              "dnbr_p90": 0.365,
              "frac_changed": 0.39,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.384017,
                    13.585819
                  ],
                  [
                    25.386235,
                    13.585833
                  ],
                  [
                    25.38625,
                    13.583664
                  ],
                  [
                    25.384032,
                    13.58365
                  ],
                  [
                    25.384017,
                    13.585819
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.293,
              "dnbr_p90": 0.396,
              "frac_changed": 0.61,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.39067,
                    13.585862
                  ],
                  [
                    25.392888,
                    13.585876
                  ],
                  [
                    25.392902,
                    13.583707
                  ],
                  [
                    25.390685,
                    13.583693
                  ],
                  [
                    25.39067,
                    13.585862
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.276,
              "dnbr_p90": 0.378,
              "frac_changed": 0.56,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.392888,
                    13.585876
                  ],
                  [
                    25.395105,
                    13.585891
                  ],
                  [
                    25.39512,
                    13.583721
                  ],
                  [
                    25.392902,
                    13.583707
                  ],
                  [
                    25.392888,
                    13.585876
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.246,
              "dnbr_p90": 0.351,
              "frac_changed": 0.45,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.395105,
                    13.585891
                  ],
                  [
                    25.397323,
                    13.585905
                  ],
                  [
                    25.397338,
                    13.583736
                  ],
                  [
                    25.39512,
                    13.583721
                  ],
                  [
                    25.395105,
                    13.585891
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.226,
              "dnbr_p90": 0.345,
              "frac_changed": 0.46,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412846,
                    13.586004
                  ],
                  [
                    25.415064,
                    13.586018
                  ],
                  [
                    25.415078,
                    13.583849
                  ],
                  [
                    25.412861,
                    13.583835
                  ],
                  [
                    25.412846,
                    13.586004
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.36,
              "dnbr_p90": 0.517,
              "frac_changed": 0.74,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.415064,
                    13.586018
                  ],
                  [
                    25.417282,
                    13.586032
                  ],
                  [
                    25.417296,
                    13.583863
                  ],
                  [
                    25.415078,
                    13.583849
                  ],
                  [
                    25.415064,
                    13.586018
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.376,
              "dnbr_p90": 0.522,
              "frac_changed": 0.82,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.417282,
                    13.586032
                  ],
                  [
                    25.419499,
                    13.586046
                  ],
                  [
                    25.419514,
                    13.583877
                  ],
                  [
                    25.417296,
                    13.583863
                  ],
                  [
                    25.417282,
                    13.586032
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.378,
              "dnbr_p90": 0.459,
              "frac_changed": 0.92,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.299766,
                    13.583089
                  ],
                  [
                    25.301983,
                    13.583104
                  ],
                  [
                    25.301998,
                    13.580935
                  ],
                  [
                    25.299781,
                    13.58092
                  ],
                  [
                    25.299766,
                    13.583089
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.274,
              "dnbr_p90": 0.348,
              "frac_changed": 0.51,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.301983,
                    13.583104
                  ],
                  [
                    25.3042,
                    13.583119
                  ],
                  [
                    25.304216,
                    13.58095
                  ],
                  [
                    25.301998,
                    13.580935
                  ],
                  [
                    25.301983,
                    13.583104
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.236,
              "dnbr_p90": 0.305,
              "frac_changed": 0.31,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.3042,
                    13.583119
                  ],
                  [
                    25.306418,
                    13.583135
                  ],
                  [
                    25.306433,
                    13.580965
                  ],
                  [
                    25.304216,
                    13.58095
                  ],
                  [
                    25.3042,
                    13.583119
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.261,
              "dnbr_p90": 0.325,
              "frac_changed": 0.45,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.310853,
                    13.583165
                  ],
                  [
                    25.31307,
                    13.58318
                  ],
                  [
                    25.313086,
                    13.58101
                  ],
                  [
                    25.310868,
                    13.580995
                  ],
                  [
                    25.310853,
                    13.583165
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.232,
              "dnbr_p90": 0.368,
              "frac_changed": 0.4,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.31307,
                    13.58318
                  ],
                  [
                    25.315288,
                    13.583195
                  ],
                  [
                    25.315303,
                    13.581025
                  ],
                  [
                    25.313086,
                    13.58101
                  ],
                  [
                    25.31307,
                    13.58318
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.237,
              "dnbr_p90": 0.329,
              "frac_changed": 0.35,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.317506,
                    13.58321
                  ],
                  [
                    25.319723,
                    13.583225
                  ],
                  [
                    25.319738,
                    13.581055
                  ],
                  [
                    25.317521,
                    13.58104
                  ],
                  [
                    25.317506,
                    13.58321
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.23,
              "dnbr_p90": 0.318,
              "frac_changed": 0.37,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.375162,
                    13.583592
                  ],
                  [
                    25.377379,
                    13.583606
                  ],
                  [
                    25.377394,
                    13.581437
                  ],
                  [
                    25.375176,
                    13.581423
                  ],
                  [
                    25.375162,
                    13.583592
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.296,
              "dnbr_p90": 0.375,
              "frac_changed": 0.62,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.381814,
                    13.583635
                  ],
                  [
                    25.384032,
                    13.58365
                  ],
                  [
                    25.384047,
                    13.58148
                  ],
                  [
                    25.381829,
                    13.581466
                  ],
                  [
                    25.381814,
                    13.583635
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.243,
              "dnbr_p90": 0.336,
              "frac_changed": 0.35,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.384032,
                    13.58365
                  ],
                  [
                    25.38625,
                    13.583664
                  ],
                  [
                    25.386264,
                    13.581495
                  ],
                  [
                    25.384047,
                    13.58148
                  ],
                  [
                    25.384032,
                    13.58365
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.352,
              "dnbr_p90": 0.412,
              "frac_changed": 0.99,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.390685,
                    13.583693
                  ],
                  [
                    25.392902,
                    13.583707
                  ],
                  [
                    25.392917,
                    13.581538
                  ],
                  [
                    25.390699,
                    13.581523
                  ],
                  [
                    25.390685,
                    13.583693
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.258,
              "dnbr_p90": 0.35,
              "frac_changed": 0.41,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.392902,
                    13.583707
                  ],
                  [
                    25.39512,
                    13.583721
                  ],
                  [
                    25.395135,
                    13.581552
                  ],
                  [
                    25.392917,
                    13.581538
                  ],
                  [
                    25.392902,
                    13.583707
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.294,
              "dnbr_p90": 0.439,
              "frac_changed": 0.71,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412861,
                    13.583835
                  ],
                  [
                    25.415078,
                    13.583849
                  ],
                  [
                    25.415093,
                    13.58168
                  ],
                  [
                    25.412875,
                    13.581666
                  ],
                  [
                    25.412861,
                    13.583835
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.281,
              "dnbr_p90": 0.496,
              "frac_changed": 0.53,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.417296,
                    13.583863
                  ],
                  [
                    25.419514,
                    13.583877
                  ],
                  [
                    25.419528,
                    13.581708
                  ],
                  [
                    25.417311,
                    13.581694
                  ],
                  [
                    25.417296,
                    13.583863
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.395,
              "dnbr_p90": 0.463,
              "frac_changed": 0.97,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.293129,
                    13.580875
                  ],
                  [
                    25.295346,
                    13.58089
                  ],
                  [
                    25.295362,
                    13.578721
                  ],
                  [
                    25.293144,
                    13.578705
                  ],
                  [
                    25.293129,
                    13.580875
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.279,
              "dnbr_p90": 0.436,
              "frac_changed": 0.52,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.301998,
                    13.580935
                  ],
                  [
                    25.304216,
                    13.58095
                  ],
                  [
                    25.304231,
                    13.578781
                  ],
                  [
                    25.302014,
                    13.578766
                  ],
                  [
                    25.301998,
                    13.580935
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.252,
              "dnbr_p90": 0.329,
              "frac_changed": 0.46,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.315303,
                    13.581025
                  ],
                  [
                    25.317521,
                    13.58104
                  ],
                  [
                    25.317536,
                    13.578871
                  ],
                  [
                    25.315319,
                    13.578856
                  ],
                  [
                    25.315303,
                    13.581025
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.246,
              "dnbr_p90": 0.308,
              "frac_changed": 0.32,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.321956,
                    13.58107
                  ],
                  [
                    25.324173,
                    13.581085
                  ],
                  [
                    25.324189,
                    13.578916
                  ],
                  [
                    25.321971,
                    13.578901
                  ],
                  [
                    25.321956,
                    13.58107
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.28,
              "dnbr_p90": 0.354,
              "frac_changed": 0.51,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.324173,
                    13.581085
                  ],
                  [
                    25.326391,
                    13.5811
                  ],
                  [
                    25.326406,
                    13.578931
                  ],
                  [
                    25.324189,
                    13.578916
                  ],
                  [
                    25.324173,
                    13.581085
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.345,
              "dnbr_p90": 0.494,
              "frac_changed": 0.72,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.326391,
                    13.5811
                  ],
                  [
                    25.328608,
                    13.581115
                  ],
                  [
                    25.328623,
                    13.578946
                  ],
                  [
                    25.326406,
                    13.578931
                  ],
                  [
                    25.326391,
                    13.5811
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.301,
              "dnbr_p90": 0.385,
              "frac_changed": 0.65,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.328608,
                    13.581115
                  ],
                  [
                    25.330826,
                    13.58113
                  ],
                  [
                    25.330841,
                    13.578961
                  ],
                  [
                    25.328623,
                    13.578946
                  ],
                  [
                    25.328608,
                    13.581115
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.236,
              "dnbr_p90": 0.386,
              "frac_changed": 0.36,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.330826,
                    13.58113
                  ],
                  [
                    25.333043,
                    13.581145
                  ],
                  [
                    25.333058,
                    13.578975
                  ],
                  [
                    25.330841,
                    13.578961
                  ],
                  [
                    25.330826,
                    13.58113
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.205,
              "dnbr_p90": 0.411,
              "frac_changed": 0.31,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.372959,
                    13.581408
                  ],
                  [
                    25.375176,
                    13.581423
                  ],
                  [
                    25.375191,
                    13.579253
                  ],
                  [
                    25.372974,
                    13.579239
                  ],
                  [
                    25.372959,
                    13.581408
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.251,
              "dnbr_p90": 0.33,
              "frac_changed": 0.37,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.384047,
                    13.58148
                  ],
                  [
                    25.386264,
                    13.581495
                  ],
                  [
                    25.386279,
                    13.579325
                  ],
                  [
                    25.384061,
                    13.579311
                  ],
                  [
                    25.384047,
                    13.58148
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.316,
              "dnbr_p90": 0.371,
              "frac_changed": 0.81,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.388482,
                    13.581509
                  ],
                  [
                    25.390699,
                    13.581523
                  ],
                  [
                    25.390714,
                    13.579354
                  ],
                  [
                    25.388496,
                    13.57934
                  ],
                  [
                    25.388482,
                    13.581509
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.251,
              "dnbr_p90": 0.391,
              "frac_changed": 0.47,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.390699,
                    13.581523
                  ],
                  [
                    25.392917,
                    13.581538
                  ],
                  [
                    25.392932,
                    13.579368
                  ],
                  [
                    25.390714,
                    13.579354
                  ],
                  [
                    25.390699,
                    13.581523
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.237,
              "dnbr_p90": 0.327,
              "frac_changed": 0.4,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.40844,
                    13.581637
                  ],
                  [
                    25.410658,
                    13.581651
                  ],
                  [
                    25.410672,
                    13.579482
                  ],
                  [
                    25.408455,
                    13.579468
                  ],
                  [
                    25.40844,
                    13.581637
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.329,
              "dnbr_p90": 0.45,
              "frac_changed": 0.72,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.410658,
                    13.581651
                  ],
                  [
                    25.412875,
                    13.581666
                  ],
                  [
                    25.41289,
                    13.579496
                  ],
                  [
                    25.410672,
                    13.579482
                  ],
                  [
                    25.410658,
                    13.581651
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.226,
              "dnbr_p90": 0.343,
              "frac_changed": 0.31,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412875,
                    13.581666
                  ],
                  [
                    25.415093,
                    13.58168
                  ],
                  [
                    25.415107,
                    13.57951
                  ],
                  [
                    25.41289,
                    13.579496
                  ],
                  [
                    25.412875,
                    13.581666
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.271,
              "dnbr_p90": 0.388,
              "frac_changed": 0.42,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.415093,
                    13.58168
                  ],
                  [
                    25.417311,
                    13.581694
                  ],
                  [
                    25.417325,
                    13.579524
                  ],
                  [
                    25.415107,
                    13.57951
                  ],
                  [
                    25.415093,
                    13.58168
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.249,
              "dnbr_p90": 0.324,
              "frac_changed": 0.35,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.417311,
                    13.581694
                  ],
                  [
                    25.419528,
                    13.581708
                  ],
                  [
                    25.419542,
                    13.579538
                  ],
                  [
                    25.417325,
                    13.579524
                  ],
                  [
                    25.417311,
                    13.581694
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.304,
              "dnbr_p90": 0.415,
              "frac_changed": 0.72,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.293144,
                    13.578705
                  ],
                  [
                    25.295362,
                    13.578721
                  ],
                  [
                    25.295377,
                    13.576551
                  ],
                  [
                    25.29316,
                    13.576536
                  ],
                  [
                    25.293144,
                    13.578705
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.254,
              "dnbr_p90": 0.4,
              "frac_changed": 0.41,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.295362,
                    13.578721
                  ],
                  [
                    25.297579,
                    13.578736
                  ],
                  [
                    25.297594,
                    13.576567
                  ],
                  [
                    25.295377,
                    13.576551
                  ],
                  [
                    25.295362,
                    13.578721
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.279,
              "dnbr_p90": 0.4,
              "frac_changed": 0.48,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.302014,
                    13.578766
                  ],
                  [
                    25.304231,
                    13.578781
                  ],
                  [
                    25.304247,
                    13.576612
                  ],
                  [
                    25.302029,
                    13.576597
                  ],
                  [
                    25.302014,
                    13.578766
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.261,
              "dnbr_p90": 0.354,
              "frac_changed": 0.47,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.313101,
                    13.578841
                  ],
                  [
                    25.315319,
                    13.578856
                  ],
                  [
                    25.315334,
                    13.576687
                  ],
                  [
                    25.313116,
                    13.576672
                  ],
                  [
                    25.313101,
                    13.578841
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.249,
              "dnbr_p90": 0.35,
              "frac_changed": 0.38,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.319754,
                    13.578886
                  ],
                  [
                    25.321971,
                    13.578901
                  ],
                  [
                    25.321986,
                    13.576732
                  ],
                  [
                    25.319769,
                    13.576717
                  ],
                  [
                    25.319754,
                    13.578886
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.281,
              "dnbr_p90": 0.395,
              "frac_changed": 0.56,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.321971,
                    13.578901
                  ],
                  [
                    25.324189,
                    13.578916
                  ],
                  [
                    25.324204,
                    13.576747
                  ],
                  [
                    25.321986,
                    13.576732
                  ],
                  [
                    25.321971,
                    13.578901
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.272,
              "dnbr_p90": 0.363,
              "frac_changed": 0.51,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.324189,
                    13.578916
                  ],
                  [
                    25.326406,
                    13.578931
                  ],
                  [
                    25.326421,
                    13.576762
                  ],
                  [
                    25.324204,
                    13.576747
                  ],
                  [
                    25.324189,
                    13.578916
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.277,
              "dnbr_p90": 0.439,
              "frac_changed": 0.54,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.326406,
                    13.578931
                  ],
                  [
                    25.328623,
                    13.578946
                  ],
                  [
                    25.328639,
                    13.576776
                  ],
                  [
                    25.326421,
                    13.576762
                  ],
                  [
                    25.326406,
                    13.578931
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.26,
              "dnbr_p90": 0.402,
              "frac_changed": 0.45,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.384061,
                    13.579311
                  ],
                  [
                    25.386279,
                    13.579325
                  ],
                  [
                    25.386294,
                    13.577156
                  ],
                  [
                    25.384076,
                    13.577142
                  ],
                  [
                    25.384061,
                    13.579311
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.319,
              "dnbr_p90": 0.395,
              "frac_changed": 0.81,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.388496,
                    13.57934
                  ],
                  [
                    25.390714,
                    13.579354
                  ],
                  [
                    25.390729,
                    13.577185
                  ],
                  [
                    25.388511,
                    13.57717
                  ],
                  [
                    25.388496,
                    13.57934
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.301,
              "dnbr_p90": 0.391,
              "frac_changed": 0.7,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.406237,
                    13.579454
                  ],
                  [
                    25.408455,
                    13.579468
                  ],
                  [
                    25.408469,
                    13.577299
                  ],
                  [
                    25.406251,
                    13.577284
                  ],
                  [
                    25.406237,
                    13.579454
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.269,
              "dnbr_p90": 0.339,
              "frac_changed": 0.52,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.408455,
                    13.579468
                  ],
                  [
                    25.410672,
                    13.579482
                  ],
                  [
                    25.410687,
                    13.577313
                  ],
                  [
                    25.408469,
                    13.577299
                  ],
                  [
                    25.408455,
                    13.579468
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.299,
              "dnbr_p90": 0.416,
              "frac_changed": 0.58,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.410672,
                    13.579482
                  ],
                  [
                    25.41289,
                    13.579496
                  ],
                  [
                    25.412904,
                    13.577327
                  ],
                  [
                    25.410687,
                    13.577313
                  ],
                  [
                    25.410672,
                    13.579482
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.295,
              "dnbr_p90": 0.45,
              "frac_changed": 0.53,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.41289,
                    13.579496
                  ],
                  [
                    25.415107,
                    13.57951
                  ],
                  [
                    25.415122,
                    13.577341
                  ],
                  [
                    25.412904,
                    13.577327
                  ],
                  [
                    25.41289,
                    13.579496
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.37,
              "dnbr_p90": 0.467,
              "frac_changed": 0.92,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.415107,
                    13.57951
                  ],
                  [
                    25.417325,
                    13.579524
                  ],
                  [
                    25.417339,
                    13.577355
                  ],
                  [
                    25.415122,
                    13.577341
                  ],
                  [
                    25.415107,
                    13.57951
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.306,
              "dnbr_p90": 0.395,
              "frac_changed": 0.72,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.28429,
                    13.576475
                  ],
                  [
                    25.286507,
                    13.576491
                  ],
                  [
                    25.286523,
                    13.574321
                  ],
                  [
                    25.284306,
                    13.574306
                  ],
                  [
                    25.28429,
                    13.576475
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.233,
              "dnbr_p90": 0.498,
              "frac_changed": 0.38,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.295377,
                    13.576551
                  ],
                  [
                    25.297594,
                    13.576567
                  ],
                  [
                    25.29761,
                    13.574397
                  ],
                  [
                    25.295393,
                    13.574382
                  ],
                  [
                    25.295377,
                    13.576551
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.297,
              "dnbr_p90": 0.382,
              "frac_changed": 0.65,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.297594,
                    13.576567
                  ],
                  [
                    25.299812,
                    13.576582
                  ],
                  [
                    25.299827,
                    13.574412
                  ],
                  [
                    25.29761,
                    13.574397
                  ],
                  [
                    25.297594,
                    13.576567
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.282,
              "dnbr_p90": 0.381,
              "frac_changed": 0.6,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.299812,
                    13.576582
                  ],
                  [
                    25.302029,
                    13.576597
                  ],
                  [
                    25.302045,
                    13.574428
                  ],
                  [
                    25.299827,
                    13.574412
                  ],
                  [
                    25.299812,
                    13.576582
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.289,
              "dnbr_p90": 0.375,
              "frac_changed": 0.6,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.302029,
                    13.576597
                  ],
                  [
                    25.304247,
                    13.576612
                  ],
                  [
                    25.304262,
                    13.574443
                  ],
                  [
                    25.302045,
                    13.574428
                  ],
                  [
                    25.302029,
                    13.576597
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.316,
              "dnbr_p90": 0.398,
              "frac_changed": 0.72,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.306464,
                    13.576627
                  ],
                  [
                    25.308682,
                    13.576642
                  ],
                  [
                    25.308697,
                    13.574473
                  ],
                  [
                    25.30648,
                    13.574458
                  ],
                  [
                    25.306464,
                    13.576627
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.253,
              "dnbr_p90": 0.392,
              "frac_changed": 0.42,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.315334,
                    13.576687
                  ],
                  [
                    25.317551,
                    13.576702
                  ],
                  [
                    25.317567,
                    13.574533
                  ],
                  [
                    25.315349,
                    13.574518
                  ],
                  [
                    25.315334,
                    13.576687
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.231,
              "dnbr_p90": 0.358,
              "frac_changed": 0.31,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.319769,
                    13.576717
                  ],
                  [
                    25.321986,
                    13.576732
                  ],
                  [
                    25.322002,
                    13.574563
                  ],
                  [
                    25.319784,
                    13.574548
                  ],
                  [
                    25.319769,
                    13.576717
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.33,
              "dnbr_p90": 0.408,
              "frac_changed": 0.82,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.321986,
                    13.576732
                  ],
                  [
                    25.324204,
                    13.576747
                  ],
                  [
                    25.324219,
                    13.574578
                  ],
                  [
                    25.322002,
                    13.574563
                  ],
                  [
                    25.321986,
                    13.576732
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.301,
              "dnbr_p90": 0.419,
              "frac_changed": 0.62,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.324204,
                    13.576747
                  ],
                  [
                    25.326421,
                    13.576762
                  ],
                  [
                    25.326436,
                    13.574592
                  ],
                  [
                    25.324219,
                    13.574578
                  ],
                  [
                    25.324204,
                    13.576747
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.28,
              "dnbr_p90": 0.464,
              "frac_changed": 0.49,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.326421,
                    13.576762
                  ],
                  [
                    25.328639,
                    13.576776
                  ],
                  [
                    25.328654,
                    13.574607
                  ],
                  [
                    25.326436,
                    13.574592
                  ],
                  [
                    25.326421,
                    13.576762
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.229,
              "dnbr_p90": 0.376,
              "frac_changed": 0.35,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.366336,
                    13.577026
                  ],
                  [
                    25.368553,
                    13.577041
                  ],
                  [
                    25.368568,
                    13.574871
                  ],
                  [
                    25.366351,
                    13.574857
                  ],
                  [
                    25.366336,
                    13.577026
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.276,
              "dnbr_p90": 0.363,
              "frac_changed": 0.58,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.368553,
                    13.577041
                  ],
                  [
                    25.370771,
                    13.577055
                  ],
                  [
                    25.370786,
                    13.574886
                  ],
                  [
                    25.368568,
                    13.574871
                  ],
                  [
                    25.368553,
                    13.577041
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.251,
              "dnbr_p90": 0.319,
              "frac_changed": 0.33,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.370771,
                    13.577055
                  ],
                  [
                    25.372988,
                    13.57707
                  ],
                  [
                    25.373003,
                    13.5749
                  ],
                  [
                    25.370786,
                    13.574886
                  ],
                  [
                    25.370771,
                    13.577055
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.246,
              "dnbr_p90": 0.347,
              "frac_changed": 0.45,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.388511,
                    13.57717
                  ],
                  [
                    25.390729,
                    13.577185
                  ],
                  [
                    25.390743,
                    13.575016
                  ],
                  [
                    25.388526,
                    13.575001
                  ],
                  [
                    25.388511,
                    13.57717
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.302,
              "dnbr_p90": 0.37,
              "frac_changed": 0.73,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.406251,
                    13.577284
                  ],
                  [
                    25.408469,
                    13.577299
                  ],
                  [
                    25.408483,
                    13.575129
                  ],
                  [
                    25.406266,
                    13.575115
                  ],
                  [
                    25.406251,
                    13.577284
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.34,
              "dnbr_p90": 0.435,
              "frac_changed": 0.83,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.408469,
                    13.577299
                  ],
                  [
                    25.410687,
                    13.577313
                  ],
                  [
                    25.410701,
                    13.575143
                  ],
                  [
                    25.408483,
                    13.575129
                  ],
                  [
                    25.408469,
                    13.577299
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.295,
              "dnbr_p90": 0.388,
              "frac_changed": 0.56,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.410687,
                    13.577313
                  ],
                  [
                    25.412904,
                    13.577327
                  ],
                  [
                    25.412919,
                    13.575158
                  ],
                  [
                    25.410701,
                    13.575143
                  ],
                  [
                    25.410687,
                    13.577313
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.367,
              "dnbr_p90": 0.57,
              "frac_changed": 0.72,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412904,
                    13.577327
                  ],
                  [
                    25.415122,
                    13.577341
                  ],
                  [
                    25.415136,
                    13.575172
                  ],
                  [
                    25.412919,
                    13.575158
                  ],
                  [
                    25.412904,
                    13.577327
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.364,
              "dnbr_p90": 0.449,
              "frac_changed": 0.94,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.415122,
                    13.577341
                  ],
                  [
                    25.417339,
                    13.577355
                  ],
                  [
                    25.417354,
                    13.575186
                  ],
                  [
                    25.415136,
                    13.575172
                  ],
                  [
                    25.415122,
                    13.577341
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.246,
              "dnbr_p90": 0.345,
              "frac_changed": 0.39,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.295393,
                    13.574382
                  ],
                  [
                    25.29761,
                    13.574397
                  ],
                  [
                    25.297625,
                    13.572228
                  ],
                  [
                    25.295408,
                    13.572213
                  ],
                  [
                    25.295393,
                    13.574382
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.279,
              "dnbr_p90": 0.417,
              "frac_changed": 0.61,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.29761,
                    13.574397
                  ],
                  [
                    25.299827,
                    13.574412
                  ],
                  [
                    25.299843,
                    13.572243
                  ],
                  [
                    25.297625,
                    13.572228
                  ],
                  [
                    25.29761,
                    13.574397
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.246,
              "dnbr_p90": 0.346,
              "frac_changed": 0.4,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.299827,
                    13.574412
                  ],
                  [
                    25.302045,
                    13.574428
                  ],
                  [
                    25.30206,
                    13.572258
                  ],
                  [
                    25.299843,
                    13.572243
                  ],
                  [
                    25.299827,
                    13.574412
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.247,
              "dnbr_p90": 0.342,
              "frac_changed": 0.44,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.302045,
                    13.574428
                  ],
                  [
                    25.304262,
                    13.574443
                  ],
                  [
                    25.304278,
                    13.572273
                  ],
                  [
                    25.30206,
                    13.572258
                  ],
                  [
                    25.302045,
                    13.574428
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.244,
              "dnbr_p90": 0.358,
              "frac_changed": 0.32,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.304262,
                    13.574443
                  ],
                  [
                    25.30648,
                    13.574458
                  ],
                  [
                    25.306495,
                    13.572289
                  ],
                  [
                    25.304278,
                    13.572273
                  ],
                  [
                    25.304262,
                    13.574443
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.252,
              "dnbr_p90": 0.336,
              "frac_changed": 0.42,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.319784,
                    13.574548
                  ],
                  [
                    25.322002,
                    13.574563
                  ],
                  [
                    25.322017,
                    13.572393
                  ],
                  [
                    25.319799,
                    13.572378
                  ],
                  [
                    25.319784,
                    13.574548
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.343,
              "dnbr_p90": 0.43,
              "frac_changed": 0.82,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.322002,
                    13.574563
                  ],
                  [
                    25.324219,
                    13.574578
                  ],
                  [
                    25.324234,
                    13.572408
                  ],
                  [
                    25.322017,
                    13.572393
                  ],
                  [
                    25.322002,
                    13.574563
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.299,
              "dnbr_p90": 0.436,
              "frac_changed": 0.57,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.324219,
                    13.574578
                  ],
                  [
                    25.326436,
                    13.574592
                  ],
                  [
                    25.326452,
                    13.572423
                  ],
                  [
                    25.324234,
                    13.572408
                  ],
                  [
                    25.324219,
                    13.574578
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.238,
              "dnbr_p90": 0.364,
              "frac_changed": 0.39,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.366351,
                    13.574857
                  ],
                  [
                    25.368568,
                    13.574871
                  ],
                  [
                    25.368583,
                    13.572702
                  ],
                  [
                    25.366366,
                    13.572688
                  ],
                  [
                    25.366351,
                    13.574857
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.325,
              "dnbr_p90": 0.48,
              "frac_changed": 0.62,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.370786,
                    13.574886
                  ],
                  [
                    25.373003,
                    13.5749
                  ],
                  [
                    25.373018,
                    13.572731
                  ],
                  [
                    25.370801,
                    13.572717
                  ],
                  [
                    25.370786,
                    13.574886
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.258,
              "dnbr_p90": 0.323,
              "frac_changed": 0.47,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.384091,
                    13.574973
                  ],
                  [
                    25.386308,
                    13.574987
                  ],
                  [
                    25.386323,
                    13.572818
                  ],
                  [
                    25.384105,
                    13.572803
                  ],
                  [
                    25.384091,
                    13.574973
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.252,
              "dnbr_p90": 0.335,
              "frac_changed": 0.4,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.386308,
                    13.574987
                  ],
                  [
                    25.388526,
                    13.575001
                  ],
                  [
                    25.38854,
                    13.572832
                  ],
                  [
                    25.386323,
                    13.572818
                  ],
                  [
                    25.386308,
                    13.574987
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.267,
              "dnbr_p90": 0.336,
              "frac_changed": 0.4,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.404048,
                    13.575101
                  ],
                  [
                    25.406266,
                    13.575115
                  ],
                  [
                    25.40628,
                    13.572946
                  ],
                  [
                    25.404063,
                    13.572932
                  ],
                  [
                    25.404048,
                    13.575101
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.272,
              "dnbr_p90": 0.367,
              "frac_changed": 0.53,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.406266,
                    13.575115
                  ],
                  [
                    25.408483,
                    13.575129
                  ],
                  [
                    25.408498,
                    13.57296
                  ],
                  [
                    25.40628,
                    13.572946
                  ],
                  [
                    25.406266,
                    13.575115
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.341,
              "dnbr_p90": 0.45,
              "frac_changed": 0.81,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.408483,
                    13.575129
                  ],
                  [
                    25.410701,
                    13.575143
                  ],
                  [
                    25.410715,
                    13.572974
                  ],
                  [
                    25.408498,
                    13.57296
                  ],
                  [
                    25.408483,
                    13.575129
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.252,
              "dnbr_p90": 0.436,
              "frac_changed": 0.31,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.410701,
                    13.575143
                  ],
                  [
                    25.412919,
                    13.575158
                  ],
                  [
                    25.412933,
                    13.572988
                  ],
                  [
                    25.410715,
                    13.572974
                  ],
                  [
                    25.410701,
                    13.575143
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.488,
              "dnbr_p90": 0.622,
              "frac_changed": 0.99,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412919,
                    13.575158
                  ],
                  [
                    25.415136,
                    13.575172
                  ],
                  [
                    25.415151,
                    13.573002
                  ],
                  [
                    25.412933,
                    13.572988
                  ],
                  [
                    25.412919,
                    13.575158
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.438,
              "dnbr_p90": 0.566,
              "frac_changed": 0.94,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.415136,
                    13.575172
                  ],
                  [
                    25.417354,
                    13.575186
                  ],
                  [
                    25.417368,
                    13.573016
                  ],
                  [
                    25.415151,
                    13.573002
                  ],
                  [
                    25.415136,
                    13.575172
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.253,
              "dnbr_p90": 0.356,
              "frac_changed": 0.51,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.295408,
                    13.572213
                  ],
                  [
                    25.297625,
                    13.572228
                  ],
                  [
                    25.297641,
                    13.570059
                  ],
                  [
                    25.295423,
                    13.570044
                  ],
                  [
                    25.295408,
                    13.572213
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.264,
              "dnbr_p90": 0.34,
              "frac_changed": 0.47,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.297625,
                    13.572228
                  ],
                  [
                    25.299843,
                    13.572243
                  ],
                  [
                    25.299858,
                    13.570074
                  ],
                  [
                    25.297641,
                    13.570059
                  ],
                  [
                    25.297625,
                    13.572228
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.277,
              "dnbr_p90": 0.376,
              "frac_changed": 0.53,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.299843,
                    13.572243
                  ],
                  [
                    25.30206,
                    13.572258
                  ],
                  [
                    25.302076,
                    13.570089
                  ],
                  [
                    25.299858,
                    13.570074
                  ],
                  [
                    25.299843,
                    13.572243
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.228,
              "dnbr_p90": 0.338,
              "frac_changed": 0.33,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.30206,
                    13.572258
                  ],
                  [
                    25.304278,
                    13.572273
                  ],
                  [
                    25.304293,
                    13.570104
                  ],
                  [
                    25.302076,
                    13.570089
                  ],
                  [
                    25.30206,
                    13.572258
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.269,
              "dnbr_p90": 0.354,
              "frac_changed": 0.42,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.304278,
                    13.572273
                  ],
                  [
                    25.306495,
                    13.572289
                  ],
                  [
                    25.30651,
                    13.570119
                  ],
                  [
                    25.304293,
                    13.570104
                  ],
                  [
                    25.304278,
                    13.572273
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.289,
              "dnbr_p90": 0.37,
              "frac_changed": 0.6,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.306495,
                    13.572289
                  ],
                  [
                    25.308712,
                    13.572304
                  ],
                  [
                    25.308728,
                    13.570134
                  ],
                  [
                    25.30651,
                    13.570119
                  ],
                  [
                    25.306495,
                    13.572289
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.315,
              "dnbr_p90": 0.433,
              "frac_changed": 0.67,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.317582,
                    13.572364
                  ],
                  [
                    25.319799,
                    13.572378
                  ],
                  [
                    25.319815,
                    13.570209
                  ],
                  [
                    25.317597,
                    13.570194
                  ],
                  [
                    25.317582,
                    13.572364
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.235,
              "dnbr_p90": 0.365,
              "frac_changed": 0.34,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.319799,
                    13.572378
                  ],
                  [
                    25.322017,
                    13.572393
                  ],
                  [
                    25.322032,
                    13.570224
                  ],
                  [
                    25.319815,
                    13.570209
                  ],
                  [
                    25.319799,
                    13.572378
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.362,
              "dnbr_p90": 0.485,
              "frac_changed": 0.82,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.322017,
                    13.572393
                  ],
                  [
                    25.324234,
                    13.572408
                  ],
                  [
                    25.324249,
                    13.570239
                  ],
                  [
                    25.322032,
                    13.570224
                  ],
                  [
                    25.322017,
                    13.572393
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.358,
              "dnbr_p90": 0.491,
              "frac_changed": 0.76,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.333104,
                    13.572468
                  ],
                  [
                    25.335321,
                    13.572483
                  ],
                  [
                    25.335336,
                    13.570313
                  ],
                  [
                    25.333119,
                    13.570298
                  ],
                  [
                    25.333104,
                    13.572468
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.315,
              "dnbr_p90": 0.432,
              "frac_changed": 0.78,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.361931,
                    13.572659
                  ],
                  [
                    25.364148,
                    13.572673
                  ],
                  [
                    25.364163,
                    13.570504
                  ],
                  [
                    25.361946,
                    13.570489
                  ],
                  [
                    25.361931,
                    13.572659
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.283,
              "dnbr_p90": 0.38,
              "frac_changed": 0.62,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.364148,
                    13.572673
                  ],
                  [
                    25.366366,
                    13.572688
                  ],
                  [
                    25.36638,
                    13.570518
                  ],
                  [
                    25.364163,
                    13.570504
                  ],
                  [
                    25.364148,
                    13.572673
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.315,
              "dnbr_p90": 0.438,
              "frac_changed": 0.69,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.366366,
                    13.572688
                  ],
                  [
                    25.368583,
                    13.572702
                  ],
                  [
                    25.368598,
                    13.570533
                  ],
                  [
                    25.36638,
                    13.570518
                  ],
                  [
                    25.366366,
                    13.572688
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.323,
              "dnbr_p90": 0.43,
              "frac_changed": 0.77,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.368583,
                    13.572702
                  ],
                  [
                    25.370801,
                    13.572717
                  ],
                  [
                    25.370815,
                    13.570547
                  ],
                  [
                    25.368598,
                    13.570533
                  ],
                  [
                    25.368583,
                    13.572702
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.313,
              "dnbr_p90": 0.414,
              "frac_changed": 0.76,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.370801,
                    13.572717
                  ],
                  [
                    25.373018,
                    13.572731
                  ],
                  [
                    25.373033,
                    13.570562
                  ],
                  [
                    25.370815,
                    13.570547
                  ],
                  [
                    25.370801,
                    13.572717
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.292,
              "dnbr_p90": 0.375,
              "frac_changed": 0.65,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.373018,
                    13.572731
                  ],
                  [
                    25.375235,
                    13.572746
                  ],
                  [
                    25.37525,
                    13.570576
                  ],
                  [
                    25.373033,
                    13.570562
                  ],
                  [
                    25.373018,
                    13.572731
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.292,
              "dnbr_p90": 0.398,
              "frac_changed": 0.58,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.381888,
                    13.572789
                  ],
                  [
                    25.384105,
                    13.572803
                  ],
                  [
                    25.38412,
                    13.570634
                  ],
                  [
                    25.381903,
                    13.57062
                  ],
                  [
                    25.381888,
                    13.572789
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.288,
              "dnbr_p90": 0.378,
              "frac_changed": 0.5,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.384105,
                    13.572803
                  ],
                  [
                    25.386323,
                    13.572818
                  ],
                  [
                    25.386338,
                    13.570648
                  ],
                  [
                    25.38412,
                    13.570634
                  ],
                  [
                    25.384105,
                    13.572803
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.313,
              "dnbr_p90": 0.43,
              "frac_changed": 0.62,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.408498,
                    13.57296
                  ],
                  [
                    25.410715,
                    13.572974
                  ],
                  [
                    25.41073,
                    13.570805
                  ],
                  [
                    25.408512,
                    13.570791
                  ],
                  [
                    25.408498,
                    13.57296
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.333,
              "dnbr_p90": 0.47,
              "frac_changed": 0.76,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.410715,
                    13.572974
                  ],
                  [
                    25.412933,
                    13.572988
                  ],
                  [
                    25.412947,
                    13.570819
                  ],
                  [
                    25.41073,
                    13.570805
                  ],
                  [
                    25.410715,
                    13.572974
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.41,
              "dnbr_p90": 0.504,
              "frac_changed": 0.99,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412933,
                    13.572988
                  ],
                  [
                    25.415151,
                    13.573002
                  ],
                  [
                    25.415165,
                    13.570833
                  ],
                  [
                    25.412947,
                    13.570819
                  ],
                  [
                    25.412933,
                    13.572988
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.504,
              "dnbr_p90": 0.571,
              "frac_changed": 0.99,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.415151,
                    13.573002
                  ],
                  [
                    25.417368,
                    13.573016
                  ],
                  [
                    25.417382,
                    13.570847
                  ],
                  [
                    25.415165,
                    13.570833
                  ],
                  [
                    25.415151,
                    13.573002
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.338,
              "dnbr_p90": 0.491,
              "frac_changed": 0.7,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.30651,
                    13.570119
                  ],
                  [
                    25.308728,
                    13.570134
                  ],
                  [
                    25.308743,
                    13.567965
                  ],
                  [
                    25.306526,
                    13.56795
                  ],
                  [
                    25.30651,
                    13.570119
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.239,
              "dnbr_p90": 0.394,
              "frac_changed": 0.32,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.313162,
                    13.570164
                  ],
                  [
                    25.31538,
                    13.570179
                  ],
                  [
                    25.315395,
                    13.56801
                  ],
                  [
                    25.313178,
                    13.567995
                  ],
                  [
                    25.313162,
                    13.570164
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.237,
              "dnbr_p90": 0.349,
              "frac_changed": 0.4,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.317597,
                    13.570194
                  ],
                  [
                    25.319815,
                    13.570209
                  ],
                  [
                    25.31983,
                    13.56804
                  ],
                  [
                    25.317613,
                    13.568025
                  ],
                  [
                    25.317597,
                    13.570194
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.307,
              "dnbr_p90": 0.43,
              "frac_changed": 0.62,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.319815,
                    13.570209
                  ],
                  [
                    25.322032,
                    13.570224
                  ],
                  [
                    25.322047,
                    13.568055
                  ],
                  [
                    25.31983,
                    13.56804
                  ],
                  [
                    25.319815,
                    13.570209
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.251,
              "dnbr_p90": 0.361,
              "frac_changed": 0.41,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.322032,
                    13.570224
                  ],
                  [
                    25.324249,
                    13.570239
                  ],
                  [
                    25.324265,
                    13.56807
                  ],
                  [
                    25.322047,
                    13.568055
                  ],
                  [
                    25.322032,
                    13.570224
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.271,
              "dnbr_p90": 0.465,
              "frac_changed": 0.42,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.333119,
                    13.570298
                  ],
                  [
                    25.335336,
                    13.570313
                  ],
                  [
                    25.335352,
                    13.568144
                  ],
                  [
                    25.333134,
                    13.568129
                  ],
                  [
                    25.333119,
                    13.570298
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.268,
              "dnbr_p90": 0.395,
              "frac_changed": 0.52,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.370815,
                    13.570547
                  ],
                  [
                    25.373033,
                    13.570562
                  ],
                  [
                    25.373048,
                    13.568393
                  ],
                  [
                    25.37083,
                    13.568378
                  ],
                  [
                    25.370815,
                    13.570547
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.25,
              "dnbr_p90": 0.343,
              "frac_changed": 0.42,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.373033,
                    13.570562
                  ],
                  [
                    25.37525,
                    13.570576
                  ],
                  [
                    25.375265,
                    13.568407
                  ],
                  [
                    25.373048,
                    13.568393
                  ],
                  [
                    25.373033,
                    13.570562
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.289,
              "dnbr_p90": 0.399,
              "frac_changed": 0.6,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.379685,
                    13.570605
                  ],
                  [
                    25.381903,
                    13.57062
                  ],
                  [
                    25.381917,
                    13.56845
                  ],
                  [
                    25.3797,
                    13.568436
                  ],
                  [
                    25.379685,
                    13.570605
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.361,
              "dnbr_p90": 0.466,
              "frac_changed": 0.86,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.381903,
                    13.57062
                  ],
                  [
                    25.38412,
                    13.570634
                  ],
                  [
                    25.384135,
                    13.568465
                  ],
                  [
                    25.381917,
                    13.56845
                  ],
                  [
                    25.381903,
                    13.57062
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.443,
              "dnbr_p90": 0.51,
              "frac_changed": 1.0,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.38412,
                    13.570634
                  ],
                  [
                    25.386338,
                    13.570648
                  ],
                  [
                    25.386352,
                    13.568479
                  ],
                  [
                    25.384135,
                    13.568465
                  ],
                  [
                    25.38412,
                    13.570634
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.451,
              "dnbr_p90": 0.524,
              "frac_changed": 1.0,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.386338,
                    13.570648
                  ],
                  [
                    25.388555,
                    13.570663
                  ],
                  [
                    25.38857,
                    13.568493
                  ],
                  [
                    25.386352,
                    13.568479
                  ],
                  [
                    25.386338,
                    13.570648
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.245,
              "dnbr_p90": 0.319,
              "frac_changed": 0.4,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.406295,
                    13.570777
                  ],
                  [
                    25.408512,
                    13.570791
                  ],
                  [
                    25.408527,
                    13.568621
                  ],
                  [
                    25.406309,
                    13.568607
                  ],
                  [
                    25.406295,
                    13.570777
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.24,
              "dnbr_p90": 0.356,
              "frac_changed": 0.35,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.408512,
                    13.570791
                  ],
                  [
                    25.41073,
                    13.570805
                  ],
                  [
                    25.410744,
                    13.568636
                  ],
                  [
                    25.408527,
                    13.568621
                  ],
                  [
                    25.408512,
                    13.570791
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.388,
              "dnbr_p90": 0.481,
              "frac_changed": 0.95,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.41073,
                    13.570805
                  ],
                  [
                    25.412947,
                    13.570819
                  ],
                  [
                    25.412962,
                    13.56865
                  ],
                  [
                    25.410744,
                    13.568636
                  ],
                  [
                    25.41073,
                    13.570805
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.46,
              "dnbr_p90": 0.545,
              "frac_changed": 1.0,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412947,
                    13.570819
                  ],
                  [
                    25.415165,
                    13.570833
                  ],
                  [
                    25.415179,
                    13.568664
                  ],
                  [
                    25.412962,
                    13.56865
                  ],
                  [
                    25.412947,
                    13.570819
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.514,
              "dnbr_p90": 0.574,
              "frac_changed": 1.0,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.415165,
                    13.570833
                  ],
                  [
                    25.417382,
                    13.570847
                  ],
                  [
                    25.417397,
                    13.568678
                  ],
                  [
                    25.415179,
                    13.568664
                  ],
                  [
                    25.415165,
                    13.570833
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.29,
              "dnbr_p90": 0.521,
              "frac_changed": 0.49,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.417382,
                    13.570847
                  ],
                  [
                    25.4196,
                    13.570861
                  ],
                  [
                    25.419614,
                    13.568692
                  ],
                  [
                    25.417397,
                    13.568678
                  ],
                  [
                    25.417382,
                    13.570847
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.257,
              "dnbr_p90": 0.391,
              "frac_changed": 0.44,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.299874,
                    13.567905
                  ],
                  [
                    25.302091,
                    13.56792
                  ],
                  [
                    25.302106,
                    13.565751
                  ],
                  [
                    25.299889,
                    13.565736
                  ],
                  [
                    25.299874,
                    13.567905
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.244,
              "dnbr_p90": 0.41,
              "frac_changed": 0.46,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.302091,
                    13.56792
                  ],
                  [
                    25.304308,
                    13.567935
                  ],
                  [
                    25.304324,
                    13.565766
                  ],
                  [
                    25.302106,
                    13.565751
                  ],
                  [
                    25.302091,
                    13.56792
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.236,
              "dnbr_p90": 0.333,
              "frac_changed": 0.33,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.304308,
                    13.567935
                  ],
                  [
                    25.306526,
                    13.56795
                  ],
                  [
                    25.306541,
                    13.565781
                  ],
                  [
                    25.304324,
                    13.565766
                  ],
                  [
                    25.304308,
                    13.567935
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.326,
              "dnbr_p90": 0.416,
              "frac_changed": 0.78,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.308743,
                    13.567965
                  ],
                  [
                    25.31096,
                    13.56798
                  ],
                  [
                    25.310976,
                    13.565811
                  ],
                  [
                    25.308758,
                    13.565796
                  ],
                  [
                    25.308743,
                    13.567965
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.255,
              "dnbr_p90": 0.318,
              "frac_changed": 0.38,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.317613,
                    13.568025
                  ],
                  [
                    25.31983,
                    13.56804
                  ],
                  [
                    25.319845,
                    13.565871
                  ],
                  [
                    25.317628,
                    13.565856
                  ],
                  [
                    25.317613,
                    13.568025
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.314,
              "dnbr_p90": 0.423,
              "frac_changed": 0.67,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.31983,
                    13.56804
                  ],
                  [
                    25.322047,
                    13.568055
                  ],
                  [
                    25.322063,
                    13.565886
                  ],
                  [
                    25.319845,
                    13.565871
                  ],
                  [
                    25.31983,
                    13.56804
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.315,
              "dnbr_p90": 0.417,
              "frac_changed": 0.71,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.333134,
                    13.568129
                  ],
                  [
                    25.335352,
                    13.568144
                  ],
                  [
                    25.335367,
                    13.565975
                  ],
                  [
                    25.333149,
                    13.56596
                  ],
                  [
                    25.333134,
                    13.568129
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.202,
              "dnbr_p90": 0.343,
              "frac_changed": 0.31,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.364178,
                    13.568335
                  ],
                  [
                    25.366395,
                    13.568349
                  ],
                  [
                    25.36641,
                    13.56618
                  ],
                  [
                    25.364193,
                    13.566165
                  ],
                  [
                    25.364178,
                    13.568335
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.254,
              "dnbr_p90": 0.383,
              "frac_changed": 0.47,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.366395,
                    13.568349
                  ],
                  [
                    25.368613,
                    13.568364
                  ],
                  [
                    25.368628,
                    13.566194
                  ],
                  [
                    25.36641,
                    13.56618
                  ],
                  [
                    25.366395,
                    13.568349
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.286,
              "dnbr_p90": 0.333,
              "frac_changed": 0.7,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.375265,
                    13.568407
                  ],
                  [
                    25.377482,
                    13.568421
                  ],
                  [
                    25.377497,
                    13.566252
                  ],
                  [
                    25.37528,
                    13.566238
                  ],
                  [
                    25.375265,
                    13.568407
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.257,
              "dnbr_p90": 0.366,
              "frac_changed": 0.38,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.3797,
                    13.568436
                  ],
                  [
                    25.381917,
                    13.56845
                  ],
                  [
                    25.381932,
                    13.566281
                  ],
                  [
                    25.379715,
                    13.566267
                  ],
                  [
                    25.3797,
                    13.568436
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.316,
              "dnbr_p90": 0.413,
              "frac_changed": 0.75,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.381917,
                    13.56845
                  ],
                  [
                    25.384135,
                    13.568465
                  ],
                  [
                    25.384149,
                    13.566295
                  ],
                  [
                    25.381932,
                    13.566281
                  ],
                  [
                    25.381917,
                    13.56845
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.4,
              "dnbr_p90": 0.452,
              "frac_changed": 0.98,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.384135,
                    13.568465
                  ],
                  [
                    25.386352,
                    13.568479
                  ],
                  [
                    25.386367,
                    13.56631
                  ],
                  [
                    25.384149,
                    13.566295
                  ],
                  [
                    25.384135,
                    13.568465
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.431,
              "dnbr_p90": 0.506,
              "frac_changed": 0.99,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.386352,
                    13.568479
                  ],
                  [
                    25.38857,
                    13.568493
                  ],
                  [
                    25.388584,
                    13.566324
                  ],
                  [
                    25.386367,
                    13.56631
                  ],
                  [
                    25.386352,
                    13.568479
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.298,
              "dnbr_p90": 0.451,
              "frac_changed": 0.51,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.399657,
                    13.568565
                  ],
                  [
                    25.401874,
                    13.568579
                  ],
                  [
                    25.401889,
                    13.56641
                  ],
                  [
                    25.399672,
                    13.566395
                  ],
                  [
                    25.399657,
                    13.568565
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.237,
              "dnbr_p90": 0.343,
              "frac_changed": 0.35,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.406309,
                    13.568607
                  ],
                  [
                    25.408527,
                    13.568621
                  ],
                  [
                    25.408541,
                    13.566452
                  ],
                  [
                    25.406324,
                    13.566438
                  ],
                  [
                    25.406309,
                    13.568607
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.304,
              "dnbr_p90": 0.441,
              "frac_changed": 0.61,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.408527,
                    13.568621
                  ],
                  [
                    25.410744,
                    13.568636
                  ],
                  [
                    25.410759,
                    13.566466
                  ],
                  [
                    25.408541,
                    13.566452
                  ],
                  [
                    25.408527,
                    13.568621
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.465,
              "dnbr_p90": 0.523,
              "frac_changed": 1.0,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.410744,
                    13.568636
                  ],
                  [
                    25.412962,
                    13.56865
                  ],
                  [
                    25.412976,
                    13.56648
                  ],
                  [
                    25.410759,
                    13.566466
                  ],
                  [
                    25.410744,
                    13.568636
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.462,
              "dnbr_p90": 0.583,
              "frac_changed": 0.97,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412962,
                    13.56865
                  ],
                  [
                    25.415179,
                    13.568664
                  ],
                  [
                    25.415194,
                    13.566494
                  ],
                  [
                    25.412976,
                    13.56648
                  ],
                  [
                    25.412962,
                    13.56865
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.44,
              "dnbr_p90": 0.547,
              "frac_changed": 0.95,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.415179,
                    13.568664
                  ],
                  [
                    25.417397,
                    13.568678
                  ],
                  [
                    25.417411,
                    13.566508
                  ],
                  [
                    25.415194,
                    13.566494
                  ],
                  [
                    25.415179,
                    13.568664
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.437,
              "dnbr_p90": 0.544,
              "frac_changed": 0.97,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.417397,
                    13.568678
                  ],
                  [
                    25.419614,
                    13.568692
                  ],
                  [
                    25.419629,
                    13.566523
                  ],
                  [
                    25.417411,
                    13.566508
                  ],
                  [
                    25.417397,
                    13.568678
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.235,
              "dnbr_p90": 0.338,
              "frac_changed": 0.38,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.299889,
                    13.565736
                  ],
                  [
                    25.302106,
                    13.565751
                  ],
                  [
                    25.302122,
                    13.563582
                  ],
                  [
                    25.299905,
                    13.563566
                  ],
                  [
                    25.299889,
                    13.565736
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.219,
              "dnbr_p90": 0.355,
              "frac_changed": 0.42,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.302106,
                    13.565751
                  ],
                  [
                    25.304324,
                    13.565766
                  ],
                  [
                    25.304339,
                    13.563597
                  ],
                  [
                    25.302122,
                    13.563582
                  ],
                  [
                    25.302106,
                    13.565751
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.241,
              "dnbr_p90": 0.357,
              "frac_changed": 0.45,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.304324,
                    13.565766
                  ],
                  [
                    25.306541,
                    13.565781
                  ],
                  [
                    25.306556,
                    13.563612
                  ],
                  [
                    25.304339,
                    13.563597
                  ],
                  [
                    25.304324,
                    13.565766
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.243,
              "dnbr_p90": 0.354,
              "frac_changed": 0.4,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.308758,
                    13.565796
                  ],
                  [
                    25.310976,
                    13.565811
                  ],
                  [
                    25.310991,
                    13.563642
                  ],
                  [
                    25.308774,
                    13.563627
                  ],
                  [
                    25.308758,
                    13.565796
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.301,
              "dnbr_p90": 0.383,
              "frac_changed": 0.67,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.313193,
                    13.565826
                  ],
                  [
                    25.31541,
                    13.565841
                  ],
                  [
                    25.315426,
                    13.563672
                  ],
                  [
                    25.313208,
                    13.563657
                  ],
                  [
                    25.313193,
                    13.565826
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.254,
              "dnbr_p90": 0.414,
              "frac_changed": 0.35,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.319845,
                    13.565871
                  ],
                  [
                    25.322063,
                    13.565886
                  ],
                  [
                    25.322078,
                    13.563717
                  ],
                  [
                    25.31986,
                    13.563702
                  ],
                  [
                    25.319845,
                    13.565871
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.248,
              "dnbr_p90": 0.454,
              "frac_changed": 0.49,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.361975,
                    13.566151
                  ],
                  [
                    25.364193,
                    13.566165
                  ],
                  [
                    25.364208,
                    13.563996
                  ],
                  [
                    25.36199,
                    13.563982
                  ],
                  [
                    25.361975,
                    13.566151
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.232,
              "dnbr_p90": 0.336,
              "frac_changed": 0.35,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.364193,
                    13.566165
                  ],
                  [
                    25.36641,
                    13.56618
                  ],
                  [
                    25.366425,
                    13.564011
                  ],
                  [
                    25.364208,
                    13.563996
                  ],
                  [
                    25.364193,
                    13.566165
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.314,
              "dnbr_p90": 0.392,
              "frac_changed": 0.75,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.36641,
                    13.56618
                  ],
                  [
                    25.368628,
                    13.566194
                  ],
                  [
                    25.368642,
                    13.564025
                  ],
                  [
                    25.366425,
                    13.564011
                  ],
                  [
                    25.36641,
                    13.56618
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.32,
              "dnbr_p90": 0.422,
              "frac_changed": 0.69,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.368628,
                    13.566194
                  ],
                  [
                    25.370845,
                    13.566209
                  ],
                  [
                    25.37086,
                    13.56404
                  ],
                  [
                    25.368642,
                    13.564025
                  ],
                  [
                    25.368628,
                    13.566194
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.322,
              "dnbr_p90": 0.417,
              "frac_changed": 0.67,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.370845,
                    13.566209
                  ],
                  [
                    25.373062,
                    13.566223
                  ],
                  [
                    25.373077,
                    13.564054
                  ],
                  [
                    25.37086,
                    13.56404
                  ],
                  [
                    25.370845,
                    13.566209
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.346,
              "dnbr_p90": 0.493,
              "frac_changed": 0.72,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.377497,
                    13.566252
                  ],
                  [
                    25.379715,
                    13.566267
                  ],
                  [
                    25.379729,
                    13.564097
                  ],
                  [
                    25.377512,
                    13.564083
                  ],
                  [
                    25.377497,
                    13.566252
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.225,
              "dnbr_p90": 0.335,
              "frac_changed": 0.35,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.379715,
                    13.566267
                  ],
                  [
                    25.381932,
                    13.566281
                  ],
                  [
                    25.381947,
                    13.564112
                  ],
                  [
                    25.379729,
                    13.564097
                  ],
                  [
                    25.379715,
                    13.566267
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.322,
              "dnbr_p90": 0.399,
              "frac_changed": 0.83,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.381932,
                    13.566281
                  ],
                  [
                    25.384149,
                    13.566295
                  ],
                  [
                    25.384164,
                    13.564126
                  ],
                  [
                    25.381947,
                    13.564112
                  ],
                  [
                    25.381932,
                    13.566281
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.348,
              "dnbr_p90": 0.418,
              "frac_changed": 0.88,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.384149,
                    13.566295
                  ],
                  [
                    25.386367,
                    13.56631
                  ],
                  [
                    25.386382,
                    13.56414
                  ],
                  [
                    25.384164,
                    13.564126
                  ],
                  [
                    25.384149,
                    13.566295
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.376,
              "dnbr_p90": 0.452,
              "frac_changed": 0.92,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.386367,
                    13.56631
                  ],
                  [
                    25.388584,
                    13.566324
                  ],
                  [
                    25.388599,
                    13.564155
                  ],
                  [
                    25.386382,
                    13.56414
                  ],
                  [
                    25.386367,
                    13.56631
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.43,
              "dnbr_p90": 0.504,
              "frac_changed": 1.0,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.388584,
                    13.566324
                  ],
                  [
                    25.390802,
                    13.566338
                  ],
                  [
                    25.390816,
                    13.564169
                  ],
                  [
                    25.388599,
                    13.564155
                  ],
                  [
                    25.388584,
                    13.566324
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.327,
              "dnbr_p90": 0.443,
              "frac_changed": 0.71,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.393019,
                    13.566353
                  ],
                  [
                    25.395237,
                    13.566367
                  ],
                  [
                    25.395251,
                    13.564198
                  ],
                  [
                    25.393034,
                    13.564183
                  ],
                  [
                    25.393019,
                    13.566353
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.267,
              "dnbr_p90": 0.325,
              "frac_changed": 0.42,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.399672,
                    13.566395
                  ],
                  [
                    25.401889,
                    13.56641
                  ],
                  [
                    25.401903,
                    13.56424
                  ],
                  [
                    25.399686,
                    13.564226
                  ],
                  [
                    25.399672,
                    13.566395
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.256,
              "dnbr_p90": 0.36,
              "frac_changed": 0.45,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.406324,
                    13.566438
                  ],
                  [
                    25.408541,
                    13.566452
                  ],
                  [
                    25.408556,
                    13.564283
                  ],
                  [
                    25.406338,
                    13.564269
                  ],
                  [
                    25.406324,
                    13.566438
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.384,
              "dnbr_p90": 0.485,
              "frac_changed": 0.9,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.408541,
                    13.566452
                  ],
                  [
                    25.410759,
                    13.566466
                  ],
                  [
                    25.410773,
                    13.564297
                  ],
                  [
                    25.408556,
                    13.564283
                  ],
                  [
                    25.408541,
                    13.566452
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.373,
              "dnbr_p90": 0.467,
              "frac_changed": 0.93,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.410759,
                    13.566466
                  ],
                  [
                    25.412976,
                    13.56648
                  ],
                  [
                    25.412991,
                    13.564311
                  ],
                  [
                    25.410773,
                    13.564297
                  ],
                  [
                    25.410759,
                    13.566466
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.325,
              "dnbr_p90": 0.449,
              "frac_changed": 0.72,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412976,
                    13.56648
                  ],
                  [
                    25.415194,
                    13.566494
                  ],
                  [
                    25.415208,
                    13.564325
                  ],
                  [
                    25.412991,
                    13.564311
                  ],
                  [
                    25.412976,
                    13.56648
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.364,
              "dnbr_p90": 0.477,
              "frac_changed": 0.86,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.415194,
                    13.566494
                  ],
                  [
                    25.417411,
                    13.566508
                  ],
                  [
                    25.417426,
                    13.564339
                  ],
                  [
                    25.415208,
                    13.564325
                  ],
                  [
                    25.415194,
                    13.566494
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.402,
              "dnbr_p90": 0.523,
              "frac_changed": 0.81,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.417411,
                    13.566508
                  ],
                  [
                    25.419629,
                    13.566523
                  ],
                  [
                    25.419643,
                    13.564353
                  ],
                  [
                    25.417426,
                    13.564339
                  ],
                  [
                    25.417411,
                    13.566508
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.262,
              "dnbr_p90": 0.361,
              "frac_changed": 0.46,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.299905,
                    13.563566
                  ],
                  [
                    25.302122,
                    13.563582
                  ],
                  [
                    25.302137,
                    13.561412
                  ],
                  [
                    25.29992,
                    13.561397
                  ],
                  [
                    25.299905,
                    13.563566
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.29,
              "dnbr_p90": 0.423,
              "frac_changed": 0.58,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.306556,
                    13.563612
                  ],
                  [
                    25.308774,
                    13.563627
                  ],
                  [
                    25.308789,
                    13.561458
                  ],
                  [
                    25.306572,
                    13.561443
                  ],
                  [
                    25.306556,
                    13.563612
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.231,
              "dnbr_p90": 0.355,
              "frac_changed": 0.38,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.308774,
                    13.563627
                  ],
                  [
                    25.310991,
                    13.563642
                  ],
                  [
                    25.311006,
                    13.561473
                  ],
                  [
                    25.308789,
                    13.561458
                  ],
                  [
                    25.308774,
                    13.563627
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.296,
              "dnbr_p90": 0.41,
              "frac_changed": 0.67,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.310991,
                    13.563642
                  ],
                  [
                    25.313208,
                    13.563657
                  ],
                  [
                    25.313224,
                    13.561488
                  ],
                  [
                    25.311006,
                    13.561473
                  ],
                  [
                    25.310991,
                    13.563642
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.262,
              "dnbr_p90": 0.354,
              "frac_changed": 0.49,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.313208,
                    13.563657
                  ],
                  [
                    25.315426,
                    13.563672
                  ],
                  [
                    25.315441,
                    13.561503
                  ],
                  [
                    25.313224,
                    13.561488
                  ],
                  [
                    25.313208,
                    13.563657
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.274,
              "dnbr_p90": 0.373,
              "frac_changed": 0.54,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.322078,
                    13.563717
                  ],
                  [
                    25.324295,
                    13.563731
                  ],
                  [
                    25.32431,
                    13.561562
                  ],
                  [
                    25.322093,
                    13.561547
                  ],
                  [
                    25.322078,
                    13.563717
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.278,
              "dnbr_p90": 0.393,
              "frac_changed": 0.53,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.324295,
                    13.563731
                  ],
                  [
                    25.326512,
                    13.563746
                  ],
                  [
                    25.326528,
                    13.561577
                  ],
                  [
                    25.32431,
                    13.561562
                  ],
                  [
                    25.324295,
                    13.563731
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.239,
              "dnbr_p90": 0.355,
              "frac_changed": 0.33,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.32873,
                    13.563761
                  ],
                  [
                    25.330947,
                    13.563776
                  ],
                  [
                    25.330962,
                    13.561607
                  ],
                  [
                    25.328745,
                    13.561592
                  ],
                  [
                    25.32873,
                    13.563761
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.248,
              "dnbr_p90": 0.356,
              "frac_changed": 0.4,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.359773,
                    13.563967
                  ],
                  [
                    25.36199,
                    13.563982
                  ],
                  [
                    25.362005,
                    13.561812
                  ],
                  [
                    25.359788,
                    13.561798
                  ],
                  [
                    25.359773,
                    13.563967
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.23,
              "dnbr_p90": 0.33,
              "frac_changed": 0.32,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.36199,
                    13.563982
                  ],
                  [
                    25.364208,
                    13.563996
                  ],
                  [
                    25.364222,
                    13.561827
                  ],
                  [
                    25.362005,
                    13.561812
                  ],
                  [
                    25.36199,
                    13.563982
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.272,
              "dnbr_p90": 0.389,
              "frac_changed": 0.51,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.366425,
                    13.564011
                  ],
                  [
                    25.368642,
                    13.564025
                  ],
                  [
                    25.368657,
                    13.561856
                  ],
                  [
                    25.36644,
                    13.561841
                  ],
                  [
                    25.366425,
                    13.564011
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.333,
              "dnbr_p90": 0.422,
              "frac_changed": 0.76,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.368642,
                    13.564025
                  ],
                  [
                    25.37086,
                    13.56404
                  ],
                  [
                    25.370875,
                    13.56187
                  ],
                  [
                    25.368657,
                    13.561856
                  ],
                  [
                    25.368642,
                    13.564025
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.27,
              "dnbr_p90": 0.376,
              "frac_changed": 0.44,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.37086,
                    13.56404
                  ],
                  [
                    25.373077,
                    13.564054
                  ],
                  [
                    25.373092,
                    13.561885
                  ],
                  [
                    25.370875,
                    13.56187
                  ],
                  [
                    25.37086,
                    13.56404
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.396,
              "dnbr_p90": 0.5,
              "frac_changed": 0.92,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.373077,
                    13.564054
                  ],
                  [
                    25.375295,
                    13.564069
                  ],
                  [
                    25.375309,
                    13.561899
                  ],
                  [
                    25.373092,
                    13.561885
                  ],
                  [
                    25.373077,
                    13.564054
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.391,
              "dnbr_p90": 0.532,
              "frac_changed": 0.8,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.375295,
                    13.564069
                  ],
                  [
                    25.377512,
                    13.564083
                  ],
                  [
                    25.377527,
                    13.561914
                  ],
                  [
                    25.375309,
                    13.561899
                  ],
                  [
                    25.375295,
                    13.564069
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.251,
              "dnbr_p90": 0.385,
              "frac_changed": 0.35,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.377512,
                    13.564083
                  ],
                  [
                    25.379729,
                    13.564097
                  ],
                  [
                    25.379744,
                    13.561928
                  ],
                  [
                    25.377527,
                    13.561914
                  ],
                  [
                    25.377512,
                    13.564083
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.235,
              "dnbr_p90": 0.357,
              "frac_changed": 0.42,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.379729,
                    13.564097
                  ],
                  [
                    25.381947,
                    13.564112
                  ],
                  [
                    25.381961,
                    13.561942
                  ],
                  [
                    25.379744,
                    13.561928
                  ],
                  [
                    25.379729,
                    13.564097
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.24,
              "dnbr_p90": 0.375,
              "frac_changed": 0.36,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.381947,
                    13.564112
                  ],
                  [
                    25.384164,
                    13.564126
                  ],
                  [
                    25.384179,
                    13.561957
                  ],
                  [
                    25.381961,
                    13.561942
                  ],
                  [
                    25.381947,
                    13.564112
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.342,
              "dnbr_p90": 0.467,
              "frac_changed": 0.75,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.384164,
                    13.564126
                  ],
                  [
                    25.386382,
                    13.56414
                  ],
                  [
                    25.386396,
                    13.561971
                  ],
                  [
                    25.384179,
                    13.561957
                  ],
                  [
                    25.384164,
                    13.564126
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.403,
              "dnbr_p90": 0.502,
              "frac_changed": 0.95,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.386382,
                    13.56414
                  ],
                  [
                    25.388599,
                    13.564155
                  ],
                  [
                    25.388614,
                    13.561985
                  ],
                  [
                    25.386396,
                    13.561971
                  ],
                  [
                    25.386382,
                    13.56414
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.383,
              "dnbr_p90": 0.457,
              "frac_changed": 0.99,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.388599,
                    13.564155
                  ],
                  [
                    25.390816,
                    13.564169
                  ],
                  [
                    25.390831,
                    13.562
                  ],
                  [
                    25.388614,
                    13.561985
                  ],
                  [
                    25.388599,
                    13.564155
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.404,
              "dnbr_p90": 0.477,
              "frac_changed": 0.97,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.397469,
                    13.564212
                  ],
                  [
                    25.399686,
                    13.564226
                  ],
                  [
                    25.399701,
                    13.562057
                  ],
                  [
                    25.397483,
                    13.562043
                  ],
                  [
                    25.397469,
                    13.564212
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.254,
              "dnbr_p90": 0.304,
              "frac_changed": 0.39,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.404121,
                    13.564254
                  ],
                  [
                    25.406338,
                    13.564269
                  ],
                  [
                    25.406353,
                    13.562099
                  ],
                  [
                    25.404135,
                    13.562085
                  ],
                  [
                    25.404121,
                    13.564254
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.323,
              "dnbr_p90": 0.375,
              "frac_changed": 0.83,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.406338,
                    13.564269
                  ],
                  [
                    25.408556,
                    13.564283
                  ],
                  [
                    25.40857,
                    13.562113
                  ],
                  [
                    25.406353,
                    13.562099
                  ],
                  [
                    25.406338,
                    13.564269
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.401,
              "dnbr_p90": 0.473,
              "frac_changed": 1.0,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.408556,
                    13.564283
                  ],
                  [
                    25.410773,
                    13.564297
                  ],
                  [
                    25.410788,
                    13.562128
                  ],
                  [
                    25.40857,
                    13.562113
                  ],
                  [
                    25.408556,
                    13.564283
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.355,
              "dnbr_p90": 0.453,
              "frac_changed": 0.87,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.410773,
                    13.564297
                  ],
                  [
                    25.412991,
                    13.564311
                  ],
                  [
                    25.413005,
                    13.562142
                  ],
                  [
                    25.410788,
                    13.562128
                  ],
                  [
                    25.410773,
                    13.564297
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.334,
              "dnbr_p90": 0.435,
              "frac_changed": 0.8,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.412991,
                    13.564311
                  ],
                  [
                    25.415208,
                    13.564325
                  ],
                  [
                    25.415222,
                    13.562156
                  ],
                  [
                    25.413005,
                    13.562142
                  ],
                  [
                    25.412991,
                    13.564311
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.343,
              "dnbr_p90": 0.464,
              "frac_changed": 0.77,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.415208,
                    13.564325
                  ],
                  [
                    25.417426,
                    13.564339
                  ],
                  [
                    25.41744,
                    13.56217
                  ],
                  [
                    25.415222,
                    13.562156
                  ],
                  [
                    25.415208,
                    13.564325
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.299,
              "dnbr_p90": 0.414,
              "frac_changed": 0.56,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.417426,
                    13.564339
                  ],
                  [
                    25.419643,
                    13.564353
                  ],
                  [
                    25.419657,
                    13.562184
                  ],
                  [
                    25.41744,
                    13.56217
                  ],
                  [
                    25.417426,
                    13.564339
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.245,
              "dnbr_p90": 0.315,
              "frac_changed": 0.35,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.302137,
                    13.561412
                  ],
                  [
                    25.304355,
                    13.561427
                  ],
                  [
                    25.30437,
                    13.559258
                  ],
                  [
                    25.302153,
                    13.559243
                  ],
                  [
                    25.302137,
                    13.561412
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.281,
              "dnbr_p90": 0.459,
              "frac_changed": 0.49,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.308789,
                    13.561458
                  ],
                  [
                    25.311006,
                    13.561473
                  ],
                  [
                    25.311022,
                    13.559303
                  ],
                  [
                    25.308804,
                    13.559288
                  ],
                  [
                    25.308789,
                    13.561458
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.273,
              "dnbr_p90": 0.358,
              "frac_changed": 0.49,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.313224,
                    13.561488
                  ],
                  [
                    25.315441,
                    13.561503
                  ],
                  [
                    25.315456,
                    13.559333
                  ],
                  [
                    25.313239,
                    13.559318
                  ],
                  [
                    25.313224,
                    13.561488
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.226,
              "dnbr_p90": 0.354,
              "frac_changed": 0.31,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.317658,
                    13.561517
                  ],
                  [
                    25.319876,
                    13.561532
                  ],
                  [
                    25.319891,
                    13.559363
                  ],
                  [
                    25.317674,
                    13.559348
                  ],
                  [
                    25.317658,
                    13.561517
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.228,
              "dnbr_p90": 0.367,
              "frac_changed": 0.38,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.319876,
                    13.561532
                  ],
                  [
                    25.322093,
                    13.561547
                  ],
                  [
                    25.322108,
                    13.559378
                  ],
                  [
                    25.319891,
                    13.559363
                  ],
                  [
                    25.319876,
                    13.561532
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.266,
              "dnbr_p90": 0.555,
              "frac_changed": 0.44,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.322093,
                    13.561547
                  ],
                  [
                    25.32431,
                    13.561562
                  ],
                  [
                    25.324326,
                    13.559393
                  ],
                  [
                    25.322108,
                    13.559378
                  ],
                  [
                    25.322093,
                    13.561547
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.319,
              "dnbr_p90": 0.414,
              "frac_changed": 0.72,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.32431,
                    13.561562
                  ],
                  [
                    25.326528,
                    13.561577
                  ],
                  [
                    25.326543,
                    13.559408
                  ],
                  [
                    25.324326,
                    13.559393
                  ],
                  [
                    25.32431,
                    13.561562
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.331,
              "dnbr_p90": 0.447,
              "frac_changed": 0.69,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.326528,
                    13.561577
                  ],
                  [
                    25.328745,
                    13.561592
                  ],
                  [
                    25.32876,
                    13.559423
                  ],
                  [
                    25.326543,
                    13.559408
                  ],
                  [
                    25.326528,
                    13.561577
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.298,
              "dnbr_p90": 0.38,
              "frac_changed": 0.65,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.328745,
                    13.561592
                  ],
                  [
                    25.330962,
                    13.561607
                  ],
                  [
                    25.330977,
                    13.559438
                  ],
                  [
                    25.32876,
                    13.559423
                  ],
                  [
                    25.328745,
                    13.561592
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.286,
              "dnbr_p90": 0.417,
              "frac_changed": 0.58,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.355353,
                    13.561769
                  ],
                  [
                    25.35757,
                    13.561783
                  ],
                  [
                    25.357585,
                    13.559614
                  ],
                  [
                    25.355368,
                    13.559599
                  ],
                  [
                    25.355353,
                    13.561769
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.245,
              "dnbr_p90": 0.322,
              "frac_changed": 0.38,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.359788,
                    13.561798
                  ],
                  [
                    25.362005,
                    13.561812
                  ],
                  [
                    25.36202,
                    13.559643
                  ],
                  [
                    25.359803,
                    13.559628
                  ],
                  [
                    25.359788,
                    13.561798
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.247,
              "dnbr_p90": 0.351,
              "frac_changed": 0.31,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.362005,
                    13.561812
                  ],
                  [
                    25.364222,
                    13.561827
                  ],
                  [
                    25.364237,
                    13.559658
                  ],
                  [
                    25.36202,
                    13.559643
                  ],
                  [
                    25.362005,
                    13.561812
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.296,
              "dnbr_p90": 0.401,
              "frac_changed": 0.61,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.364222,
                    13.561827
                  ],
                  [
                    25.36644,
                    13.561841
                  ],
                  [
                    25.366455,
                    13.559672
                  ],
                  [
                    25.364237,
                    13.559658
                  ],
                  [
                    25.364222,
                    13.561827
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.266,
              "dnbr_p90": 0.462,
              "frac_changed": 0.37,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.36644,
                    13.561841
                  ],
                  [
                    25.368657,
                    13.561856
                  ],
                  [
                    25.368672,
                    13.559687
                  ],
                  [
                    25.366455,
                    13.559672
                  ],
                  [
                    25.36644,
                    13.561841
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.379,
              "dnbr_p90": 0.541,
              "frac_changed": 0.85,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.368657,
                    13.561856
                  ],
                  [
                    25.370875,
                    13.56187
                  ],
                  [
                    25.370889,
                    13.559701
                  ],
                  [
                    25.368672,
                    13.559687
                  ],
                  [
                    25.368657,
                    13.561856
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.318,
              "dnbr_p90": 0.46,
              "frac_changed": 0.62,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.370875,
                    13.56187
                  ],
                  [
                    25.373092,
                    13.561885
                  ],
                  [
                    25.373107,
                    13.559716
                  ],
                  [
                    25.370889,
                    13.559701
                  ],
                  [
                    25.370875,
                    13.56187
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.35,
              "dnbr_p90": 0.508,
              "frac_changed": 0.74,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.373092,
                    13.561885
                  ],
                  [
                    25.375309,
                    13.561899
                  ],
                  [
                    25.375324,
                    13.55973
                  ],
                  [
                    25.373107,
                    13.559716
                  ],
                  [
                    25.373092,
                    13.561885
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.424,
              "dnbr_p90": 0.579,
              "frac_changed": 0.89,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.375309,
                    13.561899
                  ],
                  [
                    25.377527,
                    13.561914
                  ],
                  [
                    25.377541,
                    13.559744
                  ],
                  [
                    25.375324,
                    13.55973
                  ],
                  [
                    25.375309,
                    13.561899
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.284,
              "dnbr_p90": 0.442,
              "frac_changed": 0.49,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.379744,
                    13.561928
                  ],
                  [
                    25.381961,
                    13.561942
                  ],
                  [
                    25.381976,
                    13.559773
                  ],
                  [
                    25.379759,
                    13.559759
                  ],
                  [
                    25.379744,
                    13.561928
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.245,
              "dnbr_p90": 0.427,
              "frac_changed": 0.42,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.381961,
                    13.561942
                  ],
                  [
                    25.384179,
                    13.561957
                  ],
                  [
                    25.384193,
                    13.559788
                  ],
                  [
                    25.381976,
                    13.559773
                  ],
                  [
                    25.381961,
                    13.561942
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.242,
              "dnbr_p90": 0.371,
              "frac_changed": 0.31,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.384179,
                    13.561957
                  ],
                  [
                    25.386396,
                    13.561971
                  ],
                  [
                    25.386411,
                    13.559802
                  ],
                  [
                    25.384193,
                    13.559788
                  ],
                  [
                    25.384179,
                    13.561957
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.27,
              "dnbr_p90": 0.375,
              "frac_changed": 0.46,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.386396,
                    13.561971
                  ],
                  [
                    25.388614,
                    13.561985
                  ],
                  [
                    25.388628,
                    13.559816
                  ],
                  [
                    25.386411,
                    13.559802
                  ],
                  [
                    25.386396,
                    13.561971
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.325,
              "dnbr_p90": 0.428,
              "frac_changed": 0.74,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.388614,
                    13.561985
                  ],
                  [
                    25.390831,
                    13.562
                  ],
                  [
                    25.390846,
                    13.55983
                  ],
                  [
                    25.388628,
                    13.559816
                  ],
                  [
                    25.388614,
                    13.561985
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.373,
              "dnbr_p90": 0.456,
              "frac_changed": 0.9,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.390831,
                    13.562
                  ],
                  [
                    25.393048,
                    13.562014
                  ],
                  [
                    25.393063,
                    13.559845
                  ],
                  [
                    25.390846,
                    13.55983
                  ],
                  [
                    25.390831,
                    13.562
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.242,
              "dnbr_p90": 0.321,
              "frac_changed": 0.36,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.397483,
                    13.562043
                  ],
                  [
                    25.399701,
                    13.562057
                  ],
                  [
                    25.399715,
                    13.559887
                  ],
                  [
                    25.397498,
                    13.559873
                  ],
                  [
                    25.397483,
                    13.562043
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.256,
              "dnbr_p90": 0.32,
              "frac_changed": 0.36,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.404135,
                    13.562085
                  ],
                  [
                    25.406353,
                    13.562099
                  ],
                  [
                    25.406367,
                    13.55993
                  ],
                  [
                    25.40415,
                    13.559916
                  ],
                  [
                    25.404135,
                    13.562085
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.297,
              "dnbr_p90": 0.377,
              "frac_changed": 0.68,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.406353,
                    13.562099
                  ],
                  [
                    25.40857,
                    13.562113
                  ],
                  [
                    25.408585,
                    13.559944
                  ],
                  [
                    25.406367,
                    13.55993
                  ],
                  [
                    25.406353,
                    13.562099
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.346,
              "dnbr_p90": 0.439,
              "frac_changed": 0.84,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.40857,
                    13.562113
                  ],
                  [
                    25.410788,
                    13.562128
                  ],
                  [
                    25.410802,
                    13.559958
                  ],
                  [
                    25.408585,
                    13.559944
                  ],
                  [
                    25.40857,
                    13.562113
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.305,
              "dnbr_p90": 0.358,
              "frac_changed": 0.79,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.410788,
                    13.562128
                  ],
                  [
                    25.413005,
                    13.562142
                  ],
                  [
                    25.413019,
                    13.559972
                  ],
                  [
                    25.410802,
                    13.559958
                  ],
                  [
                    25.410788,
                    13.562128
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.325,
              "dnbr_p90": 0.412,
              "frac_changed": 0.78,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.413005,
                    13.562142
                  ],
                  [
                    25.415222,
                    13.562156
                  ],
                  [
                    25.415237,
                    13.559986
                  ],
                  [
                    25.413019,
                    13.559972
                  ],
                  [
                    25.413005,
                    13.562142
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.365,
              "dnbr_p90": 0.428,
              "frac_changed": 0.97,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.415222,
                    13.562156
                  ],
                  [
                    25.41744,
                    13.56217
                  ],
                  [
                    25.417454,
                    13.56
                  ],
                  [
                    25.415237,
                    13.559986
                  ],
                  [
                    25.415222,
                    13.562156
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.262,
              "dnbr_p90": 0.326,
              "frac_changed": 0.51,
              "n_valid_px": 144
            }
          },
          {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    25.41744,
                    13.56217
                  ],
                  [
                    25.419657,
                    13.562184
                  ],
                  [
                    25.419672,
                    13.560015
                  ],
                  [
                    25.417454,
                    13.56
                  ],
                  [
                    25.41744,
                    13.56217
                  ]
                ]
              ]
            },
            "properties": {
              "dnbr_mean": 0.286,
              "dnbr_p90": 0.378,
              "frac_changed": 0.58,
              "n_valid_px": 144
            }
          }
        ]
      },
      "stats": {
        "n_cells": 371,
        "area_km2": 23.188,
        "valid_coverage": 1.0
      },
      "note": "Proxy indicatif de changement de surface (dNBR Sentinel-2), PAS une preuve de destruction. Un dNBR positif = perte de vegetation / sol denude / surface brulee ou detruite, mais aussi labours, secheresse saisonniere, chantiers. Agrege en cellules de 250 m (surface urbaine), jamais de pixel ni de ciblage de camps de deplaces ou de lieux d'exactions. A corroborer par d'autres sources."
    }
  ],
  "note": "Couche IMPACTS : difference d'indice NBR entre deux acquisitions Sentinel-2 L2A reelles sur El-Fasher, agregee en cellules. PROXY INDICATIF de changement de surface, pas une preuve de destruction. GARDE-FOU DARFOUR : surface agregee, aucun ciblage de populations deplacees.",
  "sources": [
    {
      "name": "Copernicus Sentinel-2 L2A (ESA) via Microsoft Planetary Computer",
      "license": "Copernicus Sentinel data — COG publics, jetons SAS anonymes (aucun compte)",
      "url": "https://planetarycomputer.microsoft.com/dataset/sentinel-2-l2a"
    }
  ],
  "generated": "2026-10-28"
};
})();
