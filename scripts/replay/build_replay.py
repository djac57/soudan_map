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


def week_to_key(week_serial):
    """Serie Excel -> ('YYYY-MM-DD', date) : date de debut de semaine ISO."""
    d = EPOCH + timedelta(days=int(week_serial))
    return d.isoformat(), d


# --- Point-in-polygon pur-python (ray casting) pour agreger les feux FIRMS
# --- par Etat (frontieres ADM1). Aucune dependance externe. ------------------
def _ring_contains(ring, x, y):
    """Ray casting : le point (x=lon,y=lat) est-il dans l'anneau (liste [lon,lat]) ?"""
    inside = False
    n = len(ring)
    j = n - 1
    for i in range(n):
        xi, yi = ring[i][0], ring[i][1]
        xj, yj = ring[j][0], ring[j][1]
        if ((yi > y) != (yj > y)) and \
           (x < (xj - xi) * (y - yi) / (yj - yi + 1e-18) + xi):
            inside = not inside
        j = i
    return inside


def _poly_contains(rings, x, y):
    """Polygone GeoJSON : dans l'anneau exterieur (rings[0]) et dans aucun trou."""
    if not rings or not _ring_contains(rings[0], x, y):
        return False
    for hole in rings[1:]:
        if _ring_contains(hole, x, y):
            return False
    return True


def load_adm1_polys(path):
    """Charge les polygones ADM1 -> [(sd_id, [polygon,...], (minx,miny,maxx,maxy))].
    Chaque 'polygon' est une liste d'anneaux. shapeISO porte le code SD-XX
    (Abyei = 'N/A' -> ignore : pas d'Etat soudanais SD-XX)."""
    gj = json.load(open(path, encoding="utf-8"))
    out = []
    for feat in gj.get("features", []):
        sd = (feat.get("properties") or {}).get("shapeISO", "")
        if not isinstance(sd, str) or not sd.startswith("SD-"):
            continue
        geom = feat.get("geometry") or {}
        gtype = geom.get("type")
        coords = geom.get("coordinates") or []
        polys = []
        if gtype == "Polygon":
            polys = [coords]
        elif gtype == "MultiPolygon":
            polys = coords
        else:
            continue
        minx = miny = 1e9
        maxx = maxy = -1e9
        for poly in polys:
            for ring in poly:
                for xp, yp in ring:
                    minx = min(minx, xp); maxx = max(maxx, xp)
                    miny = min(miny, yp); maxy = max(maxy, yp)
        out.append((sd, polys, (minx, miny, maxx, maxy)))
    return out


def state_of_point(polys_tbl, lon, lat):
    """Renvoie le SD-XX contenant (lon,lat), sinon None (hors Soudan)."""
    for sd, polys, (minx, miny, maxx, maxy) in polys_tbl:
        if lon < minx or lon > maxx or lat < miny or lat > maxy:
            continue
        for poly in polys:
            if _poly_contains(poly, lon, lat):
                return sd
    return None


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
    # Optionnels (defauts = chemins standards du depot) :
    adm1_path = sys.argv[5] if len(sys.argv) > 5 else "data/boundaries/sudan_adm1.geojson"
    firms_sp_path = sys.argv[6] if len(sys.argv) > 6 else "data/raw/firms/firms_sp_agg.json"

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
    by_state_week = {}     # 'YYYY-MM-DD' (lundi ISO) -> {adm1_id -> {e,f}}
    totals_week = {}       # 'YYYY-MM-DD' -> {e,f}
    weeks_set = set()
    states_seen = set()
    last_month = WAR_START_MONTH
    n_sudan = 0

    for row in rows:
        if len(row) <= c_country or row[c_country] != "Sudan":
            continue
        month, d = week_to_month(row[c_week])
        if d < WAR_START:
            continue
        wk, _ = week_to_key(row[c_week])
        n_sudan += 1
        events = int(row[c_events]) if row[c_events] not in ("", None) else 0
        fat = int(row[c_fat]) if row[c_fat] not in ("", None) else 0
        if month > last_month:
            last_month = month
        weeks_set.add(wk)

        tot = totals.setdefault(month, {"e": 0, "f": 0})
        tot["e"] += events
        tot["f"] += fat
        totw = totals_week.setdefault(wk, {"e": 0, "f": 0})
        totw["e"] += events
        totw["f"] += fat

        name, adm1_id = ADMIN1_TO_ADM1.get(row[c_admin1], (row[c_admin1], None))
        if adm1_id is None:
            continue                 # transfrontalier : hors choroplethe SD-XX
        states_seen.add(adm1_id)
        cell = by_state.setdefault(month, {}).setdefault(adm1_id, {"e": 0, "f": 0})
        cell["e"] += events
        cell["f"] += fat
        cellw = by_state_week.setdefault(wk, {}).setdefault(adm1_id, {"e": 0, "f": 0})
        cellw["e"] += events
        cellw["f"] += fat

    periods = month_range(WAR_START_MONTH, last_month)
    periods_week = sorted(weeks_set)

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
    # 4) FEUX par ETAT et par mois.
    #    L'archive FIRMS gelee (firms_sp_agg.json) ne garde, par maille
    #    0.1deg, qu'un decompte ANNUEL (champ 'y') + un drapeau 'north12'
    #    (centroide >= 12N). On obtient donc :
    #      * fires_year_by_state : MESURE direct (point-in-polygon des mailles
    #        sur les frontieres ADM1), {a=tous feux, n=sous-ensemble nord12}.
    #      * fires_by_state (mensuel) : ESTIMATION par desagregation — chaque
    #        total ANNUEL mesure par Etat est reparti sur les mois selon le
    #        PROFIL mensuel NATIONAL FIRMS (sudan_core.fires_timeline). Les deux
    #        entrees (part spatiale annuelle par Etat, forme temporelle mensuelle
    #        nationale) sont des valeurs sources ; leur produit est un estime,
    #        signale dans meta. Jamais une preuve de feux de combat.
    # ------------------------------------------------------------------
    polys_tbl = load_adm1_polys(adm1_path)
    sp = json.load(open(firms_sp_path, encoding="utf-8"))
    years = sorted({y for c in sp.get("grid", []) for y in c.get("y", {})})

    # Point-in-polygon : maille -> Etat ; cumul annuel {a,n} par Etat.
    sy_all = {}   # sd -> {year -> count tous feux}
    sy_north = {} # sd -> {year -> count nord12}
    n_cells_in = 0
    for c in sp.get("grid", []):
        sd = state_of_point(polys_tbl, c["lon"], c["lat"])
        if sd is None:
            continue
        n_cells_in += 1
        north = bool(c.get("north12"))
        a = sy_all.setdefault(sd, {})
        nn = sy_north.setdefault(sd, {})
        for yr, cnt in c.get("y", {}).items():
            a[yr] = a.get(yr, 0) + cnt
            if north:
                nn[yr] = nn.get(yr, 0) + cnt

    fires_year_by_state = {}
    for yr in years:
        d = {}
        for sd in sorted(set(sy_all) | set(sy_north)):
            av = sy_all.get(sd, {}).get(yr, 0)
            nv = sy_north.get(sd, {}).get(yr, 0)
            if av or nv:
                d[sd] = {"a": av, "n": nv}
        if d:
            fires_year_by_state[yr] = d

    # Profil mensuel national (fires_timeline.all), somme annuelle. On repartit
    # 'a' ET 'n' par le MEME poids mensuel national : l'invariant n <= a (le
    # sous-ensemble nord12 ne peut depasser le total) reste ainsi garanti chaque
    # mois. Le decoupage temporel suit la saisonnalite nationale tous-feux.
    nm_all = {rec["month"]: rec.get("all", 0) for rec in core.get("fires_timeline", [])}
    ny_all = {}
    for m in periods:
        y = m[:4]
        ny_all[y] = ny_all.get(y, 0) + nm_all.get(m, 0)

    fires_by_state = {}
    for m in periods:
        y = m[:4]
        wa = (nm_all.get(m, 0) / ny_all[y]) if ny_all.get(y) else 0.0
        row_m = {}
        for sd in sorted(set(sy_all) | set(sy_north)):
            av = round(sy_all.get(sd, {}).get(y, 0) * wa)
            nv = round(sy_north.get(sd, {}).get(y, 0) * wa)
            if av or nv:
                row_m[sd] = {"a": av, "n": nv}
        fires_by_state[m] = row_m

    # ------------------------------------------------------------------
    # 5) CUMULS nationaux depuis le debut de la guerre (2023-04).
    # ------------------------------------------------------------------
    cum_events, cum_fatalities = {}, {}
    ce = cf = 0
    for m in periods:
        t = totals.get(m, {"e": 0, "f": 0})
        ce += t["e"]
        cf += t["f"]
        cum_events[m] = ce
        cum_fatalities[m] = cf

    firms_sp_meta = sp.get("meta", {})

    # ------------------------------------------------------------------
    # 6) Assemblage du cube + ecriture du module JS.
    # ------------------------------------------------------------------
    replay = {
        "granularity": "month",
        "periods": periods,
        "by_state": {m: by_state.get(m, {}) for m in periods},
        "totals": {m: totals.get(m, {"e": 0, "f": 0}) for m in periods},
        "fires": {m: fires.get(m, 0) for m in periods},
        "fires_by_state": fires_by_state,
        "fires_year_by_state": fires_year_by_state,
        "cum_events": cum_events,
        "cum_fatalities": cum_fatalities,
        # Granularite HEBDO (ACLED natif hebdomadaire ; cle = lundi ISO).
        "granularity_week": "week",
        "periods_week": periods_week,
        "by_state_week": {w: by_state_week.get(w, {}) for w in periods_week},
        "totals_week": {w: totals_week.get(w, {"e": 0, "f": 0}) for w in periods_week},
        "claims_dated": claims_dated,
        "meta": {
            "source": ("ACLED (intensite par Etat, mensuel + hebdo) ; NASA FIRMS "
                       "VIIRS (feux national + par Etat) ; revendications SAF/RSF "
                       "publiques geocodees (via data/layer_maps.js)."),
            "as_of": AS_OF,
            "fires_basis": ("FIRMS fires_timeline.north — sous-ensemble des "
                            "detections au nord de ~12N, proxy conflit REDUIT "
                            "(le total 'all' reste domine par les feux agricoles "
                            "saisonniers). N'est PAS une preuve de feux de combat."),
            "fires_by_state_basis": (
                "fires_by_state[mois][SD-XX] = {a: tous feux, n: sous-ensemble "
                "nord12}. ESTIMATION mensuelle par desagregation : le total "
                "ANNUEL mesure par Etat (point-in-polygon des mailles 0.1deg de "
                "l'archive FIRMS VIIRS_SNPP_SP sur les frontieres ADM1) est "
                "reparti sur les mois selon le PROFIL mensuel NATIONAL FIRMS "
                "tous-feux (sudan_core.fires_timeline.all, meme poids pour 'a' et "
                "'n' -> l'invariant n<=a tient chaque mois). L'archive gelee ne conserve qu'un "
                "decompte ANNUEL par maille : la repartition intra-annuelle par "
                "Etat n'est donc PAS mesuree, elle suit la saisonnalite nationale. "
                "fires_year_by_state[annee][SD-XX] donne, lui, la valeur MESUREE "
                "(spatiale, annuelle). 'a' et 'n' restent domines par les feux "
                "agricoles : jamais une preuve de feux de combat. Archive FIRMS "
                "du " + str(firms_sp_meta.get("start")) + " au " +
                str(firms_sp_meta.get("end")) + " (les mois 2026 posterieurs a la "
                "fin d'archive heritent de la part spatiale annuelle mesuree "
                "jusque-la)."),
            "cumuls_basis": ("cum_events / cum_fatalities = somme cumulee de "
                             "'totals' (national ACLED, toutes lignes Sudan) "
                             "depuis 2023-04."),
            "week_basis": ("periods_week / by_state_week / totals_week : "
                           "granularite HEBDOMADAIRE native ACLED (cle = date du "
                           "lundi ISO de debut de semaine). Memes regles que le "
                           "mensuel : by_state_week au niveau Etat SD-XX, "
                           "totals_week national."),
            "displaced_basis": ("Deplacement NON animable : une seule date DTM "
                                "disponible (IOM DTM snapshot_008, 28/07/2026). "
                                "Aucun 'displaced_by_period' n'est produit — aucun "
                                "etat intermediaire n'est invente."),
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
    print("mailles FIRMS dans un Etat :", n_cells_in, "/", len(sp.get("grid", [])))
    print("fires_year_by_state : annees", years,
          "/ Etats couverts", len(set(sy_all) | set(sy_north)))
    print("semaines (periods_week) :", len(periods_week),
          (periods_week[0] + " -> " + periods_week[-1]) if periods_week else "")
    print("cum_events final :", cum_events[periods[-1]],
          " cum_fatalities final :", cum_fatalities[periods[-1]])
    print("deplaces animables : NON (1 seul snapshot DTM)")
    print("taille layer_replay.js :", size, "octets (%.1f Ko)" % (size / 1024))


if __name__ == "__main__":
    main()
