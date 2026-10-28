#!/usr/bin/env python3
# -I : run isolated  ->  python3 -I scripts/acled/build_acled.py <path_to_xlsx>
# ------------------------------------------------------------------
# build_acled.py — construit data/layer_acled.js (couche ACLED Soudan).
#
# Lit le classeur agrege ACLED (Afrique) en PARSANT LE XML BRUT via la
# stdlib (zipfile + xml.etree). openpyxl echoue sur ce fichier : il
# reference xl/drawings/drawing1.xml qui n'existe pas dans l'archive.
#
# Filtre COUNTRY == "Sudan", agrege par ADMIN1 (Etat) et par type
# d'evenement, produit une serie hebdomadaire nationale, et aligne les
# noms ADMIN1 ACLED sur les adm1_id geoBoundaries (SD-XX) utilises
# ailleurs sur le site (voir window.SUDAN.states / displacement_by_state).
#
# Donnees AGREGEES au niveau Etat (centroide d'Etat, PAS des points
# d'evenements individuels) — garde-fou Darfour respecte par construction.
# ------------------------------------------------------------------
import sys
import json
import zipfile
import xml.etree.ElementTree as ET
from datetime import date, timedelta

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
EPOCH = date(1899, 12, 30)          # epoque serie Excel (systeme 1900)
WAR_START = date(2023, 4, 15)       # debut guerre SAF / RSF
AS_OF = "2026-10-17"                # semaine la plus recente du fichier

# Les 6 types d'evenements ACLED (ordre canonique, toujours presents).
EVENT_TYPES = [
    "Battles",
    "Explosions/Remote violence",
    "Violence against civilians",
    "Protests",
    "Riots",
    "Strategic developments",
]

# ------------------------------------------------------------------
# Table de correspondance : nom ADMIN1 ACLED -> adm1_id geoBoundaries.
# Les 18 vrais Etats du Soudan portent un SD-XX. Les 4 entrees
# transfrontalieres / anciennes (relevent du Soudan du Sud ou de la zone
# contestee d'Abyei) n'ont pas de polygone SD-XX : adm1_id = None, on les
# conserve mais elles ne s'affichent pas sur la choroplethe Soudan.
# ------------------------------------------------------------------
ADMIN1_TO_ADM1 = {
    "Al Jazirah":     ("Gezira",         "SD-GZ"),
    "Blue Nile":      ("Blue Nile",      "SD-NB"),
    "Central Darfur": ("Central Darfur", "SD-DC"),
    "East Darfur":    ("East Darfur",    "SD-DE"),
    "Gedaref":        ("Gedaref",        "SD-GD"),
    "Kassala":        ("Kassala",        "SD-KA"),
    "Khartoum":       ("Khartoum",       "SD-KH"),
    "North Darfur":   ("North Darfur",   "SD-DN"),
    "North Kordofan": ("North Kordofan", "SD-KN"),
    "Northern":       ("Northern",       "SD-NO"),
    "Red Sea":        ("Red Sea",        "SD-RS"),
    "River Nile":     ("River Nile",     "SD-NR"),
    "Sennar":         ("Sennar",         "SD-SI"),
    "South Darfur":   ("South Darfur",   "SD-DS"),
    "South Kordofan": ("South Kordofan", "SD-KS"),
    "West Darfur":    ("West Darfur",    "SD-DW"),
    "West Kordofan":  ("West Kordofan",  "SD-GK"),
    "White Nile":     ("White Nile",     "SD-NW"),
    # Transfrontalier / ancien — pas de SD-XX (adm1_id None) :
    "Abyei":          ("Abyei",          None),   # zone PCA contestee
    "Bahr el Ghazal": ("Bahr el Ghazal", None),   # Soudan du Sud
    "Equatoria":      ("Equatoria",      None),   # Soudan du Sud
    "Upper Nile":     ("Upper Nile",     None),   # Soudan du Sud
}


def col_index(ref):
    """'C12' -> 2 (index colonne 0-base)."""
    n = 0
    for ch in ref:
        if ch.isalpha():
            n = n * 26 + (ord(ch.upper()) - 64)
        else:
            break
    return n - 1


def iter_rows(path):
    """Genere les lignes de sheet1 comme listes de chaines (cellules t='s'
    resolues via sharedStrings)."""
    z = zipfile.ZipFile(path)

    shared = []
    with z.open("xl/sharedStrings.xml") as f:
        for _, el in ET.iterparse(f):
            if el.tag == NS + "si":
                shared.append("".join(t.text or "" for t in el.iter(NS + "t")))
                el.clear()

    with z.open("xl/worksheets/sheet1.xml") as f:
        for _, el in ET.iterparse(f):
            if el.tag != NS + "row":
                continue
            cells = {}
            for c in el.findall(NS + "c"):
                v = c.find(NS + "v")
                if v is None:
                    continue
                if c.get("t") == "s":
                    val = shared[int(v.text)]
                else:
                    val = v.text
                cells[col_index(c.get("r"))] = val
            maxc = max(cells) if cells else -1
            yield [cells.get(i, "") for i in range(maxc + 1)]
            el.clear()


def week_to_date(week_serial):
    return EPOCH + timedelta(days=int(week_serial))


def main():
    path = sys.argv[1]

    rows = iter_rows(path)
    header = next(rows)
    col = {name: i for i, name in enumerate(header)}
    c_week = col["WEEK"]
    c_country = col["COUNTRY"]
    c_admin1 = col["ADMIN1"]
    c_etype = col["EVENT_TYPE"]
    c_events = col["EVENTS"]
    c_fat = col["FATALITIES"]
    c_lat = col["CENTROID_LATITUDE"]
    c_lon = col["CENTROID_LONGITUDE"]

    # Agregats par Etat
    states = {}                     # admin1 -> dict agrege
    weekly = {}                     # iso week date -> [events, fatalities] (guerre)
    weekly_full = {}                # iso week date -> [events, fatalities] (tout l'historique)
    by_type_totals = {t: {"events": 0, "fatalities": 0} for t in EVENT_TYPES}
    tot_events_war = 0
    tot_fat_war = 0
    n_sudan = 0
    unmapped_types = set()

    for row in rows:
        if len(row) <= c_country or row[c_country] != "Sudan":
            continue
        n_sudan += 1
        admin1 = row[c_admin1]
        etype = row[c_etype]
        events = int(row[c_events]) if row[c_events] not in ("", None) else 0
        fat = int(row[c_fat]) if row[c_fat] not in ("", None) else 0
        wdate = week_to_date(row[c_week])
        wiso = wdate.isoformat()
        is_war = wdate >= WAR_START

        if etype not in EVENT_TYPES:
            unmapped_types.add(etype)

        st = states.get(admin1)
        if st is None:
            st = states[admin1] = {
                "events_total": 0, "fatalities_total": 0,
                "events_since_war": 0, "fatalities_since_war": 0,
                "by_type": {t: 0 for t in EVENT_TYPES},
                "lat": None, "lon": None,
            }
        st["events_total"] += events
        st["fatalities_total"] += fat
        if st["lat"] is None and row[c_lat]:
            st["lat"] = round(float(row[c_lat]), 4)
            st["lon"] = round(float(row[c_lon]), 4)

        # Serie nationale complete
        fw = weekly_full.setdefault(wiso, [0, 0])
        fw[0] += events
        fw[1] += fat

        if is_war:
            st["events_since_war"] += events
            st["fatalities_since_war"] += fat
            if etype in st["by_type"]:
                st["by_type"][etype] += events
            if etype in by_type_totals:
                by_type_totals[etype]["events"] += events
                by_type_totals[etype]["fatalities"] += fat
            tot_events_war += events
            tot_fat_war += fat
            ww = weekly.setdefault(wiso, [0, 0])
            ww[0] += events
            ww[1] += fat

    # ------------------------------------------------------------------
    # by_state : trie par intensite de guerre (evenements) decroissante.
    # ------------------------------------------------------------------
    by_state = []
    for admin1 in sorted(states, key=lambda a: -states[a]["events_since_war"]):
        st = states[admin1]
        name, adm1_id = ADMIN1_TO_ADM1.get(admin1, (admin1, None))
        by_state.append({
            "state": name,
            "acled_admin1": admin1,
            "adm1_id": adm1_id,
            "lat": st["lat"],
            "lon": st["lon"],
            "events_total": st["events_total"],
            "fatalities_total": st["fatalities_total"],
            "events_since_war": st["events_since_war"],
            "fatalities_since_war": st["fatalities_since_war"],
            "by_type": st["by_type"],
        })

    timeline_weekly = [
        {"week": w, "events": weekly[w][0], "fatalities": weekly[w][1]}
        for w in sorted(weekly)
    ]
    timeline_weekly_full = [
        {"week": w, "events": weekly_full[w][0], "fatalities": weekly_full[w][1]}
        for w in sorted(weekly_full)
    ]

    acled = {
        "by_state": by_state,
        "timeline_weekly": timeline_weekly,
        "timeline_weekly_full": timeline_weekly_full,
        "by_type_totals": by_type_totals,
        "totals": {
            "events": tot_events_war,
            "fatalities": tot_fat_war,
            "as_of": AS_OF,
            "since": WAR_START.isoformat(),
        },
        "meta": {
            "source": "ACLED (Armed Conflict Location & Event Data)",
            "url": "https://acleddata.com",
            "license": "ACLED terms of use — attribution requise, usage non commercial. (c) ACLED. All rights reserved.",
            "as_of": AS_OF,
            "note": ("Donnees AGREGEES par Etat (centroide d'Etat, pas des points "
                     "d'evenements individuels) — garde-fou Darfour respecte. "
                     "ACLED est quasi temps reel et plus complet qu'UCDP ; les "
                     "semaines les plus recentes sont parfois revisees. 'since_war' "
                     "= depuis le 2023-04-15. Les entrees Abyei, Bahr el Ghazal, "
                     "Equatoria et Upper Nile sont transfrontalieres/anciennes "
                     "(pas de polygone SD-XX, adm1_id null)."),
        },
    }

    # ------------------------------------------------------------------
    # Ecriture du module JS (additif sur window.SUDAN.acled).
    # ------------------------------------------------------------------
    payload = json.dumps(acled, ensure_ascii=False, separators=(",", ":"))
    out = (
        "/* ------------------------------------------------------------------\n"
        " * data/layer_acled.js — COUCHE ACLED (intensite / tendance par Etat)\n"
        " * Genere par scripts/acled/build_acled.py — NE PAS editer a la main.\n"
        " * Charge APRES data/bundle.js. Additif : pose window.SUDAN.acled.\n"
        " * Source : ACLED (https://acleddata.com) — attribution requise.\n"
        " * ------------------------------------------------------------------ */\n"
        "(function () {\n"
        "  \"use strict\";\n"
        "  window.SUDAN = window.SUDAN || {};\n"
        "  window.SUDAN.acled = " + payload + ";\n"
        "})();\n"
    )
    with open("data/layer_acled.js", "w", encoding="utf-8") as f:
        f.write(out)

    # ------------------------------------------------------------------
    # Rapport console.
    # ------------------------------------------------------------------
    print("lignes Sudan :", n_sudan)
    print("ADMIN1 distincts :", len(states))
    mapped = sum(1 for s in by_state if s["adm1_id"])
    print("alignes SD-XX :", mapped, "/ transfrontaliers (adm1_id null) :",
          len(by_state) - mapped)
    print("totaux GUERRE  evenements :", tot_events_war, " morts :", tot_fat_war)
    print("timeline_weekly (guerre) :", len(timeline_weekly), "semaines",
          timeline_weekly[0]["week"], "->", timeline_weekly[-1]["week"])
    print("timeline_weekly_full :", len(timeline_weekly_full), "semaines",
          timeline_weekly_full[0]["week"], "->", timeline_weekly_full[-1]["week"])
    print("par type (depuis guerre) :")
    for t in EVENT_TYPES:
        print("   ", t, by_type_totals[t])
    print("top 8 Etats (intensite guerre) :")
    for s in by_state[:8]:
        print("    %-16s %-6s ev=%6d morts=%6d" % (
            s["state"], s["adm1_id"], s["events_since_war"], s["fatalities_since_war"]))
    if unmapped_types:
        print("!! types d'evenements inconnus :", unmapped_types)


if __name__ == "__main__":
    main()
