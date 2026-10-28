"""Build data/layer_humanitarian.js — COUCHE HUMANITAIRE (deplaces / IDP) du site Soudan.

    python3 -I scripts/humanitarian/build_humanitarian.py <soudan_dir> <raw_dir>

N'ecrit QUE data/layer_humanitarian.js (objet global window.SUDAN.humanitarian).
Ne touche a aucun autre fichier. Donnees publiees/agregees UNIQUEMENT (angle humanitaire :
ampleur + geographie du deplacement), avec attribution et date de chaque source.

Entrees (raw_dir, telechargees depuis des sources humanitaires officielles publiees) :
  dtm_sdn_idps_returnees_snapshot_008_28072026.xlsx
      IOM DTM Sudan — "Displacement and Return Snapshot 008" (donnees au 2026-07-31).
      Dataset HDX CC BY : "Sudan: Displacement Situation - IDPs [IOM DTM]".
      -> IDP par Etat (ADMIN1), localites (ADMIN2), returnees par Etat.
  sdn_cod_ab_admin_boundaries.xlsx
      OCHA COD-AB Sudan (CC BY-IGO) — onglet sdn_adminpoints : point-label (x,y)
      par pcode admin2. Sert UNIQUEMENT a geolocaliser les localites DTM (memes pcodes OCHA).
  unhcr_rdf_sdn_origin_2025.json
      UNHCR Refugee Data Finder (api.unhcr.org) — stock fin 2025 des personnes
      originaires du Soudan (refugies + demandeurs d'asile) par pays d'asile.

Sortie : <soudan_dir>/data/layer_humanitarian.js
"""
import csv
import json
import os
import sys

import openpyxl

# geoBoundaries ISO-3166-2 adm1_id utilise par le reste du site (control_adm1_approx.geojson).
# Cle = nom d'Etat DTM/OCHA (anglais).
NAME_TO_ADM1 = {
    "Aj Jazirah": "SD-GZ", "Gezira": "SD-GZ",
    "Blue Nile": "SD-NB",
    "Central Darfur": "SD-DC",
    "East Darfur": "SD-DE",
    "Gedaref": "SD-GD", "Gedarif": "SD-GD",
    "Kassala": "SD-KA",
    "Khartoum": "SD-KH",
    "North Darfur": "SD-DN",
    "North Kordofan": "SD-KN",
    "Northern": "SD-NO",
    "Red Sea": "SD-RS",
    "River Nile": "SD-NR",
    "Sennar": "SD-SI",
    "South Darfur": "SD-DS",
    "South Kordofan": "SD-KS",
    "West Darfur": "SD-DW",
    "West Kordofan": "SD-GK",
    "White Nile": "SD-NW",
}
# Nom francais court par adm1_id (pour l'UI).
ADM1_FR = {
    "SD-GZ": "Al-Jazirah (Gezira)", "SD-NB": "Nil Bleu", "SD-DC": "Darfour central",
    "SD-DE": "Darfour oriental", "SD-GD": "Gedaref", "SD-KA": "Kassala",
    "SD-KH": "Khartoum", "SD-DN": "Darfour du Nord", "SD-KN": "Kordofan du Nord",
    "SD-NO": "Nord", "SD-RS": "Mer Rouge", "SD-NR": "Nil (fleuve)", "SD-SI": "Sennar",
    "SD-DS": "Darfour du Sud", "SD-KS": "Kordofan du Sud", "SD-DW": "Darfour occidental",
    "SD-GK": "Kordofan occidental", "SD-NW": "Nil Blanc",
}
# Camps/sites emblematiques publics compris DANS une localite DTM (pour contextualiser
# honnetement le point "localite" ; ces camps ne sont PAS geolocalises individuellement).
LOCALITY_CAMPS = {
    "SD02114": "camps de Zamzam, Abu Shouk et Al-Salam",  # Al Fasher locality, North Darfur
}

AS_OF_IDP = "2026-07-31"       # donnees DTM round 8 (snapshot 008)
AS_OF_REF = "2025-12-31"       # stock fin d'annee UNHCR RDF
GENERATED = "2026-10-28"

N_SITES = 40  # localites IDP geolocalisees retenues (top localite/Etat + suivantes par volume)


def num(v):
    try:
        return int(float(v))
    except (TypeError, ValueError):
        return None


def load_dtm(path):
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    # --- IDP par Etat (ADMIN1) ---
    ws = wb["IDPs Masterlist (ADMIN1)"]
    rows = list(ws.iter_rows(values_only=True))
    idp_by_state = []  # (name, code, idp)
    for r in rows[5:]:
        name, code, idp = r[0], r[1], num(r[2])
        if name and code and idp is not None:
            idp_by_state.append((str(name).strip(), str(code).strip(), idp))
    # --- Returnees par Etat (ADMIN1) ---
    ws = wb["Returnees Masterlist (ADMIN1)"]
    rows = list(ws.iter_rows(values_only=True))
    ret_by_state = {}  # code -> returnees
    for r in rows:
        code, ind = r[1], num(r[2])
        if code and str(code).startswith("SD") and ind is not None:
            ret_by_state[str(code).strip()] = ind
    # --- IDP par localite (ADMIN2) ---
    ws = wb["IDPs Masterlist (ADMIN2)"]
    rows = list(ws.iter_rows(values_only=True))
    idp_by_loc = []  # (state_name, state_code, loc_name, loc_pcode, idp)
    for r in rows[5:]:
        sname, scode, lname, lpcode, idp = r[0], r[1], r[2], r[3], num(r[4])
        if lpcode and str(lpcode).startswith("SD") and idp is not None:
            idp_by_loc.append((str(sname).strip(), str(scode).strip(),
                               str(lname).strip(), str(lpcode).strip(), idp))
    return idp_by_state, ret_by_state, idp_by_loc


def load_cod_points(path):
    """pcode admin2 -> (lon, lat) depuis l'onglet sdn_adminpoints (OCHA COD-AB)."""
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    ws = wb["sdn_adminpoints"]
    rows = list(ws.iter_rows(values_only=True))
    hdr = rows[0]
    ix = {h: i for i, h in enumerate(hdr)}
    pts = {}
    for r in rows[1:]:
        if str(r[ix["admin_level"]]) != "2":
            continue
        pc = r[ix["adm2_pcode"]]
        x, y = r[ix["x_coord"]], r[ix["y_coord"]]
        if pc and x is not None and y is not None:
            pts[str(pc).strip()] = (round(float(x), 4), round(float(y), 4))
    return pts


def load_unhcr(path):
    """Stock fin 2025 depuis le Soudan par pays d'asile (refugies + demandeurs d'asile)."""
    d = json.load(open(path))
    agg = {}
    for it in d.get("items", []):
        coa = it.get("coa_name")
        v = (int(it.get("refugees") or 0) + int(it.get("asylum_seekers") or 0))
        agg[coa] = agg.get(coa, 0) + v
    return agg


def js(obj):
    return json.dumps(obj, ensure_ascii=False)


def main():
    soudan_dir, raw_dir = sys.argv[1], sys.argv[2]
    idp_by_state, ret_by_state, idp_by_loc = load_dtm(
        os.path.join(raw_dir, "dtm_sdn_idps_returnees_snapshot_008_28072026.xlsx"))
    pts = load_cod_points(os.path.join(raw_dir, "sdn_cod_ab_admin_boundaries.xlsx"))
    refugees = load_unhcr(os.path.join(raw_dir, "unhcr_rdf_sdn_origin_2025.json"))

    DTM_SRC = "IOM DTM Sudan, Displacement & Return Snapshot 008 (round 8)"

    # --- displacement_by_state ---
    idp_total = 0
    by_state = []
    for name, code, idp in idp_by_state:
        adm1 = NAME_TO_ADM1.get(name)
        idp_total += idp
        by_state.append({
            "state": name,
            "state_fr": ADM1_FR.get(adm1, name),
            "adm1_id": adm1,
            "dtm_code": code,
            "idp": idp,
            "returnees": ret_by_state.get(code, 0),
            "as_of": AS_OF_IDP,
            "source": DTM_SRC,
        })
    by_state.sort(key=lambda d: -d["idp"])

    # --- idp_sites : localites de deplacement DTM geolocalisees (COD-AB adminpoints) ---
    # Selection = la plus grande localite de CHAQUE Etat (equilibre geographique
    # national) + les suivantes par volume jusqu'a N_SITES. Toutes sont des localites
    # DTM reelles, geolocalisees au point-label officiel OCHA.
    loc_geo = [t for t in idp_by_loc if pts.get(t[3])]  # celles qu'on sait placer
    loc_sorted = sorted(loc_geo, key=lambda t: -t[4])

    def make_site(t):
        sname, scode, lname, lpcode, idp = t
        adm1 = NAME_TO_ADM1.get(sname)
        lon, lat = pts[lpcode]
        s = {
            "lon": lon, "lat": lat,
            "name": lname,
            "state": sname,
            "state_fr": ADM1_FR.get(adm1, sname),
            "adm1_id": adm1,
            "pcode": lpcode,
            "population": idp,
            "as_of": AS_OF_IDP,
            "source": DTM_SRC + " (localite / ADMIN2)",
        }
        if lpcode in LOCALITY_CAMPS:
            s["includes"] = LOCALITY_CAMPS[lpcode]
        return s

    picked = set()
    sites = []
    seen_state = set()
    # 1) plus grande localite de chaque Etat
    for t in loc_sorted:
        if t[1] not in seen_state:
            seen_state.add(t[1])
            picked.add(t[3])
            sites.append(make_site(t))
    # 2) completer par volume decroissant
    for t in loc_sorted:
        if len(sites) >= N_SITES:
            break
        if t[3] not in picked:
            picked.add(t[3])
            sites.append(make_site(t))
    sites.sort(key=lambda s: -s["population"])

    # --- totals ---
    ref_total = sum(refugees.values())
    totals = {
        "idp": idp_total,
        "idp_as_of": AS_OF_IDP,
        "idp_source": DTM_SRC,
        "refugees": ref_total,
        "refugees_as_of": AS_OF_REF,
        "refugees_source": "UNHCR Refugee Data Finder (api.unhcr.org), stock fin 2025",
    }

    # --- refugees par pays d'asile (neighbouring first) ---
    NEIGHBOURS = {"Chad", "South Sudan", "Egypt", "Libya", "Ethiopia",
                  "Central African Rep.", "Eritrea", "Kenya", "Uganda"}
    ref_rows = []
    for coa, v in sorted(refugees.items(), key=lambda x: -x[1]):
        if v < 1000:
            continue
        ref_rows.append({"country": coa, "people": v,
                         "neighbour": coa in NEIGHBOURS})

    sources = [
        {"name": "IOM DTM Sudan — Displacement & Return Snapshot 008",
         "url": "https://data.humdata.org/dataset/sudan-displacement-situation-countrywide-idps-iom-dtm",
         "license": "CC BY (IOM DTM)", "date": "2026-08-24 (donnees au 2026-07-31)"},
        {"name": "OCHA COD-AB Sudan (points-label admin2, pour geolocalisation uniquement)",
         "url": "https://data.humdata.org/dataset/cod-ab-sdn",
         "license": "CC BY-IGO", "date": "v03 (2020-08-31)"},
        {"name": "UNHCR Refugee Data Finder — personnes originaires du Soudan par pays d'asile",
         "url": "https://www.unhcr.org/refugee-statistics/ (api.unhcr.org)",
         "license": "CC BY 4.0", "date": "stock fin 2025"},
    ]

    note = (
        "Donnees humanitaires OFFICIELLES PUBLIEES (diffusees par les agences pour "
        "coordonner l'aide), montrees pour l'AMPLEUR et la GEOGRAPHIE du deplacement. "
        "DEPLACES INTERNES (IDP) : stock DTM au " + AS_OF_IDP + " = "
        + "{:,}".format(idp_total).replace(",", " ") + " personnes dans 18 Etats ; "
        "c'est le stock COURANT (des retours massifs ont eu lieu, cf. champ 'returnees' "
        "par Etat), INFERIEUR au cumul historique (~10-12 M de personnes uprootees depuis "
        "avril 2023 souvent cite). REFUGIES SORTIS : stock UNHCR fin 2025 = "
        + "{:,}".format(ref_total).replace(",", " ") + " originaires du Soudan (refugies + "
        "demandeurs d'asile), majoritairement au Tchad, en Egypte, Libye, Soudan du Sud et "
        "Ethiopie. SITES IDP : ce sont les LOCALITES de deplacement telles que DTM les publie "
        "(ADMIN2), geolocalisees au point-label officiel OCHA de la localite — PAS des "
        "coordonnees GPS de camps individuels. Les camps emblematiques (Zamzam, Abu Shouk, "
        "Al-Salam) se situent dans la localite d'Al Fasher mais ne sont pas pointes separement "
        "(le jeu public agrege a la localite). LIMITES : sous-denombrement dans les zones "
        "d'acces humanitaire restreint (Darfour, El-Fasher assiege) ; chiffres = estimations "
        "issues d'evaluations, non un recensement ; dates de collecte heterogenes (IDP juillet "
        "2026, refugies fin 2025) ; rounds DTM recents provisoires. Aucun detail operationnel "
        "non public. Attribution requise pour chaque source."
    )

    obj = {
        "idp_sites": sites,
        "displacement_by_state": by_state,
        "totals": totals,
        "refugees_by_country": ref_rows,
        "sources": sources,
        "note": note,
        "generated": GENERATED,
    }

    out = os.path.join(soudan_dir, "data", "layer_humanitarian.js")
    with open(out, "w", encoding="utf-8") as f:
        f.write("/* ------------------------------------------------------------------\n")
        f.write(" * data/layer_humanitarian.js — COUCHE HUMANITAIRE (deplaces / IDP)\n")
        f.write(" * Genere par scripts/humanitarian/build_humanitarian.py — NE PAS editer a la main.\n")
        f.write(" * Charge APRES data/bundle.js. Additif : pose window.SUDAN.humanitarian.\n")
        f.write(" * Sources officielles publiees (IOM DTM, OCHA COD, UNHCR) — voir .README.md.\n")
        f.write(" * ------------------------------------------------------------------ */\n")
        f.write('(function () {\n  "use strict";\n  window.SUDAN = window.SUDAN || {};\n')
        f.write("  window.SUDAN.humanitarian = ")
        f.write(js(obj))
        f.write(";\n})();\n")

    print("sites", len(sites), "/ states", len(by_state),
          "/ idp_total", idp_total, "/ refugees_total", ref_total,
          "/ ref_countries", len(ref_rows))
    print("wrote", out)


if __name__ == "__main__":
    main()
