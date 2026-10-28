#!/usr/bin/env python3
# -I : run isolated ->
#   python3 -I scripts/replay/build_replay.py \
#       data/raw/acled/Africa_aggregated_data_up_to_week_of-2026-10-17.xlsx \
#       data/sudan_core.json data/layer_maps.js data/layer_replay.js
# ------------------------------------------------------------------
# build_replay.py — construit data/layer_replay.js : le CUBE DE DONNEES
# TEMPOREL pour le REPLAY anime de la guerre au Soudan (2023-04 -> 2026-10).
#
# Trois sources, deja presentes dans le depot, agregees AU MOIS :
#   * ACLED  (xlsx agrege Afrique) : intensite par Etat (events/morts).
#           openpyxl ECHOUE sur ce classeur -> on parse le XML brut via
#           zipfile + xml.etree (meme methode que scripts/acled/build_acled.py,
#           dont on reutilise la table ADMIN1 -> adm1_id SD-XX).
#   * FIRMS  (data/sudan_core.json -> fires_timeline) : feux par mois,
#           sous-ensemble "north" (proxy conflit, au nord de ~12N).
#   * REVENDICATIONS datees (data/layer_maps.js -> window.SUDAN.claims) :
#           prises SAF/RSF geocodees et datees, pour les faire apparaitre
#           au fil du temps (El-Fasher oct. 2025, Khartoum/Gezira...).
#
# Donnees AGREGEES au niveau ETAT (garde-fou Darfour : aucun point
# d'evenement individuel, aucune unite, aucune donnee nominative).
# Rien d'invente : chaque valeur vient directement d'une source.
#
# OWNERSHIP : ce script n'ecrit QUE data/layer_replay.js.
# ------------------------------------------------------------------
import sys
import json
import zipfile
import subprocess
import xml.etree.ElementTree as ET
from datetime import date, timedelta

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
EPOCH = date(1899, 12, 30)          # epoque serie Excel (systeme 1900)
WAR_START = date(2023, 4, 1)        # premier mois de guerre (2023-04)
WAR_START_MONTH = "2023-04"
AS_OF = "2026-10-17"                # semaine la plus recente du classeur ACLED

# Table ADMIN1 ACLED -> (nom, adm1_id SD-XX), reprise telle quelle de
# scripts/acled/build_acled.py. Les 18 vrais Etats ont un SD-XX ; les 4
# entrees transfrontalieres/anciennes ont adm1_id None (pas de polygone).
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
    "Abyei":          ("Abyei",          None),
    "Bahr el Ghazal": ("Bahr el Ghazal", None),
    "Equatoria":      ("Equatoria",      None),
    "Upper Nile":     ("Upper Nile",     None),
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
    """Genere les lignes de sheet1 comme listes de chaines."""
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
                val = shared[int(v.text)] if c.get("t") == "s" else v.text
                cells[col_index(c.get("r"))] = val
            maxc = max(cells) if cells else -1
            yield [cells.get(i, "") for i in range(maxc + 1)]
            el.clear()


def week_to_month(week_serial):
    """Serie Excel -> 'YYYY-MM' (mois du debut de semaine ISO)."""
    d = EPOCH + timedelta(days=int(week_serial))
    return "%04d-%02d" % (d.year, d.month), d


def month_range(start_month, end_month):
    """Liste chronologique inclusive de 'YYYY-MM'."""
    sy, sm = (int(x) for x in start_month.split("-"))
    ey, em = (int(x) for x in end_month.split("-"))
    out = []
    y, m = sy, sm
    while (y, m) <= (ey, em):
        out.append("%04d-%02d" % (y, m))
        m += 1
        if m > 12:
            m = 1
            y += 1
    return out


def load_claims(layer_maps_path):
    """window.SUDAN.claims est un litteral JS (cles non quotees, commentaires).
    On le fait evaluer par node — le parseur naturel d'un fichier .js — et on
    recupere un JSON propre. node sert UNIQUEMENT de lecteur, rien n'est modifie."""
    import os
    abspath = os.path.abspath(layer_maps_path)
    js = (
        "global.window={};require(process.argv[1]);"
        "process.stdout.write(JSON.stringify(window.SUDAN.claims));"
    )
    res = subprocess.run(
        ["node", "-e", js, abspath],
        capture_output=True, text=True, check=True,
    )
    return json.loads(res.stdout)


def main():
    acled_path = sys.argv[1]
    core_path = sys.argv[2]
    maps_path = sys.argv[3]
    out_path = sys.argv[4]

    # ------------------------------------------------------------------
    # 1) ACLED -> by_state[mois][adm1_id] = {e,f} + totals[mois] = {e,f}
    # ------------------------------------------------------------------
    rows = iter_rows(acled_path)
    header = next(rows)
    col = {name: i for i, name in enumerate(header)}
    c_week = col["WEEK"]
    c_country = col["COUNTRY"]
    c_admin1 = col["ADMIN1"]
    c_events = col["EVENTS"]
    c_fat = col["FATALITIES"]

    by_state = {}          # mois -> {adm1_id -> {e,f}}
    totals = {}            # mois -> {e,f}  (national, toutes lignes Sudan)
    states_seen = set()
    last_month = WAR_START_MONTH
    n_sudan = 0

    for row in rows:
        if len(row) <= c_country or row[c_country] != "Sudan":
            continue
        month, d = week_to_month(row[c_week])
        if d < WAR_START:
            continue
        n_sudan += 1
        events = int(row[c_events]) if row[c_events] not in ("", None) else 0
        fat = int(row[c_fat]) if row[c_fat] not in ("", None) else 0
        if month > last_month:
            last_month = month

        tot = totals.setdefault(month, {"e": 0, "f": 0})
        tot["e"] += events
        tot["f"] += fat

        name, adm1_id = ADMIN1_TO_ADM1.get(row[c_admin1], (row[c_admin1], None))
        if adm1_id is None:
            continue                 # transfrontalier : hors choroplethe SD-XX
        states_seen.add(adm1_id)
        cell = by_state.setdefault(month, {}).setdefault(adm1_id, {"e": 0, "f": 0})
        cell["e"] += events
        cell["f"] += fat

    periods = month_range(WAR_START_MONTH, last_month)

    # ------------------------------------------------------------------
    # 2) FIRMS -> fires[mois] = count (sous-ensemble "north", proxy conflit)
    # ------------------------------------------------------------------
    core = json.load(open(core_path, encoding="utf-8"))
    fires = {}
    for rec in core.get("fires_timeline", []):
        m = rec["month"]
        if m >= WAR_START_MONTH:
            fires[m] = rec.get("north", 0)

    # ------------------------------------------------------------------
    # 3) REVENDICATIONS datees -> claims_dated (tri chronologique)
    #    On ne garde que les prises DATABLES au mois : 'YYYY-MM-DD' ou
    #    'YYYY-MM'. On ECARTE les plages de controle ('YYYY-YYYY') et les
    #    dates a l'annee seule ('YYYY'), non placables sur un mois precis.
    # ------------------------------------------------------------------
    raw = load_claims(maps_path)
    claims_dated = []
    dropped = 0
    for actor, key in (("SAF", "saf"), ("RSF", "rsf")):
        for c in raw.get(key, []):
            dt = c.get("date", "")
            if len(dt) == 10 and dt[4] == "-" and dt[7] == "-":
                period = dt[:7]
                day = dt
            elif len(dt) == 7 and dt[4] == "-":
                period = dt
                day = dt + "-01"
            else:
                dropped += 1
                continue
            if period < WAR_START_MONTH:
                dropped += 1
                continue
            claims_dated.append({
                "date": day,
                "period": period,
                "actor": actor,
                "place": c.get("place"),
                "lon": c.get("lon"),
                "lat": c.get("lat"),
            })
    claims_dated.sort(key=lambda x: (x["date"], x["actor"], x["place"] or ""))

    # ------------------------------------------------------------------
    # 4) Assemblage du cube + ecriture du module JS.
    # ------------------------------------------------------------------
    replay = {
        "granularity": "month",
        "periods": periods,
        "by_state": {m: by_state.get(m, {}) for m in periods},
        "totals": {m: totals.get(m, {"e": 0, "f": 0}) for m in periods},
        "fires": {m: fires.get(m, 0) for m in periods},
        "claims_dated": claims_dated,
        "meta": {
            "source": ("ACLED (intensite par Etat) ; NASA FIRMS (feux) ; "
                       "revendications SAF/RSF publiques geocodees "
                       "(via data/layer_maps.js)."),
            "as_of": AS_OF,
            "fires_basis": ("FIRMS fires_timeline.north — sous-ensemble des "
                            "detections au nord de ~12N, proxy conflit REDUIT "
                            "(le total 'all' reste domine par les feux agricoles "
                            "saisonniers). N'est PAS une preuve de feux de combat."),
            "note": ("Cube temporel pour le replay anime (2023-04 -> " + last_month +
                     "). ACLED agrege AU MOIS a partir des semaines ISO (mois du "
                     "debut de semaine) et AU NIVEAU ETAT (adm1_id SD-XX) — "
                     "garde-fou Darfour : aucun point d'evenement individuel, "
                     "aucune unite, aucune donnee nominative. 'totals' = national "
                     "(toutes lignes Sudan, y compris les 4 entrees "
                     "transfrontalieres sans SD-XX exclues de by_state). "
                     "'claims_dated' ne contient que les prises datables au mois "
                     "(jour ou mois) ; " + str(dropped) + " revendications a plage "
                     "de controle (YYYY-YYYY) ou a l'annee seule sont ecartees car "
                     "non placables sur un mois. Chaque revendication est "
                     "'revendiquee, NON VERIFIEE'. Attribution : (c) ACLED "
                     "(acleddata.com), NASA FIRMS."),
        },
    }

    payload = json.dumps(replay, ensure_ascii=False, separators=(",", ":"))
    out = (
        "/* ------------------------------------------------------------------\n"
        " * data/layer_replay.js — CUBE DE DONNEES TEMPOREL (replay anime)\n"
        " * Genere par scripts/replay/build_replay.py — NE PAS editer a la main.\n"
        " * Charge APRES data/bundle.js. Additif : pose window.SUDAN.replay.\n"
        " * Sources : ACLED (acleddata.com) + NASA FIRMS + revendications SAF/RSF.\n"
        " * Donnees au niveau ETAT (garde-fou Darfour). Rien d'invente.\n"
        " * ------------------------------------------------------------------ */\n"
        "(function () {\n"
        "  \"use strict\";\n"
        "  window.SUDAN = window.SUDAN || {};\n"
        "  window.SUDAN.replay = " + payload + ";\n"
        "})();\n"
    )
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(out)

    # ------------------------------------------------------------------
    # Rapport console.
    # ------------------------------------------------------------------
    tot_e = sum(t["e"] for t in totals.values())
    tot_f = sum(t["f"] for t in totals.values())
    import os
    size = os.path.getsize(out_path)
    print("lignes Sudan (depuis guerre) :", n_sudan)
    print("mois (periods) :", len(periods), periods[0], "->", periods[-1])
    print("Etats SD-XX couverts :", len(states_seen), "/ 18")
    print("totaux national  events :", tot_e, " morts :", tot_f)
    print("claims_dated :", len(claims_dated), " (ecartees non datables :", dropped, ")")
    print("fires_basis : FIRMS north subset")
    print("taille layer_replay.js :", size, "octets (%.1f Ko)" % (size / 1024))


if __name__ == "__main__":
    main()
