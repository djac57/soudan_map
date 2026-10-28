#!/usr/bin/env python3
# -I : isolated mode. Aucune dependance tierce (shapefile lu en Python pur).
"""
build_ethnolang.py — construit data/layer_ethnolang.js (couche ETHNO-LINGUISTIQUE).

Lit UNIQUEMENT des sources ouvertes deja telechargees dans data/raw/ethnolang/
par fetch_ethnolang.py :
  * GeoEPR-2021 (shapefile)  -> zones de peuplement des groupes ethniques
  * EPR-2021.csv             -> statut d'acces au pouvoir de chaque groupe
  * glottolog_languages.csv  -> points de langues (lat/lon, famille, ISO 639-3)

Pose, de maniere additive : window.SUDAN.ethnolang = { groups, languages, note, sources }.

CADRE : academique et NEUTRE. Toute carte ethnique est une SIMPLIFICATION contestee.
Aucun determinisme : la guerre n'est PAS reduite a l'ethnicite. Cf. champ `note`.

Usage :
    python3 -I scripts/ethnolang/build_ethnolang.py /ABS/soudan /ABS/soudan/data/raw/ethnolang
"""
import csv
import json
import struct
import sys
from pathlib import Path

GENERATED = "2026-10-28"
GW_SUDAN = "625"          # code Gleditsch-Ward du Soudan (Republique du Soudan)
EPR_PERIOD_TO = "2021"    # periode GeoEPR/EPR la plus recente : 2012-2021 (post-secession)
COORD_DP = 3              # arrondi des coordonnees (~110 m) : overlay a l'echelle du pays

# Boite englobante approximative du Soudan (lon_min, lat_min, lon_max, lat_max).
# Sert a ecarter du semis de POINTS de langues les points-reference Glottolog
# situes hors du Soudan (ex. arabe standard place en Arabie). Cf. `note`.
SUDAN_BBOX = (21.5, 8.7, 39.2, 23.6)

# ---- traductions / libelles neutres (FR) ---------------------------------
GROUP_FR = {
    9000: "Autres groupes arabes",
    10000: "Autres groupes du Nord",
    12000: "Shaygiyya, Ja'aliyyin et Danagla (arabes riverains)",
    3000: "Bedja (Beja)",
    7000: "Nouba (monts Nouba)",
    5000: "Four (Fur)",
    14000: "Masalit",
    15000: "Zaghawa",
    16000: "Rachaïda (Rashaida)",
}
STATUS_FR = {
    "MONOPOLY": "monopole",
    "DOMINANT": "dominant",
    "SENIOR PARTNER": "partenaire principal",
    "JUNIOR PARTNER": "partenaire secondaire",
    "POWERLESS": "sans pouvoir",
    "DISCRIMINATED": "discriminé",
    "SELF-EXCLUSION": "auto-exclusion",
    "IRRELEVANT": "non pertinent",
    "STATE COLLAPSE": "effondrement de l'État",
}
# Codage EPR lui-meme : inclus / exclu de l'acces au pouvoir executif central.
INCLUDED = {"MONOPOLY", "DOMINANT", "SENIOR PARTNER", "JUNIOR PARTNER"}
EXCLUDED = {"POWERLESS", "DISCRIMINATED", "SELF-EXCLUSION"}

# Langues « principales » a mettre en avant (par code ISO 639-3), sans hierarchie
# de valeur : simple reperage des langues les plus parlees / emblematiques.
MAJOR_ISO = {
    "apd",  # arabe soudanais
    "bej",  # bedja
    "fia",  # nobiin (nubien)
    "kzh",  # kenuzi-dongola (nubien)
    "mei",  # midob (nubien)
    "fvr",  # four (fur)
    "mls",  # masalit
    "daj",  # daju du Darfour
    "tig",  # tigré (Est)
}


# ========================================================================
#  Lecteurs shapefile / DBF en Python pur (aucune dependance)
# ========================================================================
def read_dbf(path: Path):
    b = path.read_bytes()
    numrec, hdrlen, reclen = struct.unpack("<I H H", b[4:12])
    fields = []
    off = 32
    while b[off] != 0x0D:
        name = b[off:off + 11].split(b"\x00")[0].decode("latin-1")
        flen = b[off + 16]
        fields.append((name, flen))
        off += 32
    rows = []
    for i in range(numrec):
        base = hdrlen + i * reclen
        row = b[base:base + reclen]
        o = 1  # saute le drapeau de suppression
        rec = {}
        for name, flen in fields:
            rec[name] = row[o:o + flen].decode("latin-1").strip()
            o += flen
        rows.append(rec)
    return rows


def read_shp(path: Path):
    """Retourne, pour chaque enregistrement, la liste de ses anneaux (rings)."""
    b = path.read_bytes()
    recs = []
    off = 100
    n = len(b)
    while off < n:
        _rnum, clen = struct.unpack(">II", b[off:off + 8])
        c = b[off + 8:off + 8 + clen * 2]
        off += 8 + clen * 2
        if len(c) < 4:
            recs.append([])
            continue
        stype = struct.unpack("<i", c[0:4])[0]
        if stype != 5:          # 0 = null ; on ne gere que Polygon (5)
            recs.append([])
            continue
        numparts, numpoints = struct.unpack("<ii", c[36:44])
        parts = list(struct.unpack("<%di" % numparts, c[44:44 + 4 * numparts]))
        pts_off = 44 + 4 * numparts
        parts.append(numpoints)
        rings = []
        for k in range(numparts):
            s, e = parts[k], parts[k + 1]
            ring = []
            for j in range(s, e):
                x, y = struct.unpack("<dd", c[pts_off + 16 * j:pts_off + 16 * j + 16])
                ring.append((x, y))
            rings.append(ring)
        recs.append(rings)
    return recs


# ========================================================================
#  Geometrie : simplification legere + assemblage GeoJSON
# ========================================================================
def simplify_ring(ring):
    """Arrondit a COORD_DP decimales et supprime les points consecutifs identiques."""
    out = []
    last = None
    for x, y in ring:
        p = [round(x, COORD_DP), round(y, COORD_DP)]
        if p != last:
            out.append(p)
            last = p
    if len(out) >= 3 and out[0] != out[-1]:
        out.append(out[0])          # referme l'anneau
    return out if len(out) >= 4 else None


def signed_area(ring):
    s = 0.0
    for i in range(len(ring) - 1):
        x1, y1 = ring[i]
        x2, y2 = ring[i + 1]
        s += (x2 - x1) * (y2 + y1)
    return s  # >0 = sens horaire (anneau exterieur dans un shapefile)


def rings_to_multipolygon(rings):
    """Anneaux shapefile -> coordonnees GeoJSON MultiPolygon (trous = anneaux
    horaires inverses qui suivent leur anneau exterieur)."""
    polys = []
    for ring in rings:
        sr = simplify_ring(ring)
        if sr is None:
            continue
        if signed_area(sr) > 0 or not polys:   # exterieur -> nouveau polygone
            polys.append([sr])
        else:                                   # trou -> rattache au dernier
            polys[-1].append(sr)
    return polys


def representative_point(rings):
    """Point-label approximatif : barycentre de l'anneau exterieur le plus grand."""
    best, best_area = None, -1.0
    for ring in rings:
        a = abs(signed_area(ring))
        if a > best_area and len(ring) >= 3:
            best_area, best = a, ring
    if best is None:
        return None
    xs = [p[0] for p in best]
    ys = [p[1] for p in best]
    return [round(sum(xs) / len(xs), COORD_DP), round(sum(ys) / len(ys), COORD_DP)]


def bbox_of(rings):
    xs, ys = [], []
    for r in rings:
        for x, y in r:
            xs.append(x)
            ys.append(y)
    if not xs:
        return None
    return [round(min(xs), COORD_DP), round(min(ys), COORD_DP),
            round(max(xs), COORD_DP), round(max(ys), COORD_DP)]


# ========================================================================
#  Construction des couches
# ========================================================================
def build_groups(raw: Path):
    geodir = raw / "GeoEPR-2021"
    dbf = read_dbf(geodir / "GeoEPR-2021.dbf")
    shp = read_shp(geodir / "GeoEPR-2021.shp")

    # statut EPR le plus recent (periode 2012-2021) par groupid, pour le Soudan
    epr = {}
    with open(raw / "EPR-2021.csv", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if r["gwid"] != GW_SUDAN:
                continue
            gid = int(r["groupid"])
            if gid not in epr or int(r["to"]) > int(epr[gid]["to"]):
                epr[gid] = r

    groups = []
    for i, r in enumerate(dbf):
        if r.get("gwid") != GW_SUDAN or r.get("to") != EPR_PERIOD_TO:
            continue
        rings = shp[i]
        if not rings:
            continue
        gid = int(r["groupid"])
        mp = rings_to_multipolygon(rings)
        e = epr.get(gid, {})
        status = e.get("status", "")
        if status in INCLUDED:
            power = "inclus"
        elif status in EXCLUDED:
            power = "exclu"
        else:
            power = "inconnu"
        try:
            share = round(float(e["size"]), 4) if e.get("size") else None
        except ValueError:
            share = None
        groups.append({
            "gwgroupid": r["gwgroupid"],
            "name": r["group"],
            "name_fr": GROUP_FR.get(gid, r["group"]),
            "status": status,                      # libelle EPR brut (en)
            "status_fr": STATUS_FR.get(status, status.lower()),
            "power_access": power,                 # codage EPR : inclus / exclu
            "pop_share_epr": share,                # part de pop. estimee par EPR (0-1)
            "period": "2012-2021",
            "point": representative_point(rings),
            "bbox": bbox_of(rings),
            "geometry": {"type": "MultiPolygon", "coordinates": mp},
            "source": "GeoEPR-2021 + EPR-2021 (ETH Zurich, ICR)",
        })
    # tri : d'abord inclus/dominant puis par part de population decroissante
    groups.sort(key=lambda g: (-(g["pop_share_epr"] or 0)))
    return groups


def build_languages(raw: Path):
    rows = list(csv.DictReader(open(raw / "glottolog_languages.csv", encoding="utf-8")))
    name_by_code = {r["Glottocode"]: r["Name"] for r in rows}
    lon0, lat0, lon1, lat1 = SUDAN_BBOX
    langs = []
    skipped_outside = 0
    for r in rows:
        if r["Level"] != "language":
            continue
        countries = [c.strip() for c in r["Countries"].split(";") if c.strip()]
        if "SD" not in countries:
            continue
        if not (r["Latitude"] and r["Longitude"]):
            continue
        lat = round(float(r["Latitude"]), 4)
        lon = round(float(r["Longitude"]), 4)
        if not (lon0 <= lon <= lon1 and lat0 <= lat <= lat1):
            skipped_outside += 1
            continue
        fam = name_by_code.get(r["Family_ID"], "") if r["Family_ID"] else ""
        langs.append({
            "name": r["Name"],
            "glottocode": r["Glottocode"],
            "iso639_3": r["ISO639P3code"] or None,
            "family": fam or ("Isolat" if r.get("Is_Isolate") == "True" else None),
            "lat": lat,
            "lon": lon,
            "major": (r["ISO639P3code"] in MAJOR_ISO),
            "source": "Glottolog (CLDF)",
        })
    langs.sort(key=lambda d: (not d["major"], d["name"]))
    return langs, skipped_outside


def main(argv):
    if len(argv) != 3:
        print(__doc__)
        return 2
    root = Path(argv[1]).resolve()
    raw = Path(argv[2]).resolve()

    groups = build_groups(raw)
    languages, skipped = build_languages(raw)

    note = (
        "Couche ETHNO-LINGUISTIQUE — cadre ACADEMIQUE et NEUTRE. "
        "AVERTISSEMENT : toute carte ethnique ou linguistique est une SIMPLIFICATION "
        "et une construction CONTESTEE. Les groupes se melangent, les frontieres sont "
        "floues et poreuses, l'auto-identification varie dans le temps et selon les "
        "contextes, et de vastes zones sont mixtes. Ces donnees ne disent PAS « qui vit "
        "ou » de facon exacte ni exhaustive. "
        "AUCUN DETERMINISME : la guerre au Soudan (FAS/SAF contre FSR/RSF) n'est PAS une "
        "guerre « ethnique » et ne se reduit pas a l'ethnicite ; c'est d'abord un conflit "
        "de pouvoir entre appareils militaires. L'appartenance a un groupe ne predit ni "
        "n'explique la violence ; mobiliser l'ethnicite est un choix politique, pas une "
        "fatalite. "
        "GROUPES (GeoEPR/EPR, ETH Zurich) : ne figurent que les groupes juges "
        "POLITIQUEMENT PERTINENTS par le projet EPR — ce n'est donc PAS la liste de tous "
        "les peuples du Soudan. Les zones sont des regions de peuplement a gros grain pour "
        "la periode 2012-2021 (apres la secession du Soudan du Sud en 2011 : les groupes "
        "du Sud — Dinka, Nuer, etc. — ne font plus partie du Soudan et sont absents). Le "
        "statut d'acces au pouvoir (dominant / sans pouvoir / discrimine, inclus vs exclu) "
        "est le codage d'EPR, « selon EPR », a une echelle nationale ; il decrit l'acces a "
        "l'executif CENTRAL, pas une hierarchie sociale locale. La part de population "
        "(pop_share_epr) est une ESTIMATION d'expert, pas un recensement. "
        "GARDE-FOU DARFOUR : les zones des groupes du Darfour (Four, Masalit, Zaghawa) et "
        "des monts Nouba sont montrees a titre de geographie academique ; elles ne doivent "
        "en aucun cas servir a cibler, essentialiser ou presumer des responsabilites "
        "collectives. La question d'une determination de genocide releve d'instances "
        "judiciaires et d'enquetes, pas de cette carte. "
        "LANGUES (Glottolog) : chaque langue est reduite a UN point-reference unique "
        "(centroide indicatif), ce qui ne represente ni l'etendue ni le nombre de "
        f"locuteurs ; {skipped} langue(s) rattachee(s) au Soudan mais dont le point "
        "Glottolog tombe hors du pays (ex. arabe standard) ont ete ecartees du semis. La "
        "classification par famille suit Glottolog (conservatrice : pas de macro-famille "
        "« nilo-saharienne »). "
        "Donnees potentiellement ANCIENNES (GeoEPR s'arrete en 2021 ; Glottolog agrege des "
        "sources d'epoques variees) : a lire comme un fond structurel, pas comme un "
        "instantane de la guerre. Aucune donnee nominative. Sources ouvertes, citees."
    )

    sources = [
        {
            "name": "GeoEPR-2021 — Geo-referencing Ethnic Power Relations",
            "org": "ETH Zurich, International Conflict Research (ICR)",
            "role": "zones de peuplement des groupes ethniques politiquement pertinents",
            "url": "https://icr.ethz.ch/data/epr/geoepr/",
            "license": "usage academique libre, citation requise "
                       "(Wucherpfennig et al. 2011 ; Vogt et al. 2015)",
            "date": "version 2021",
        },
        {
            "name": "EPR-2021 — Ethnic Power Relations core dataset",
            "org": "ETH Zurich, International Conflict Research (ICR)",
            "role": "statut d'acces au pouvoir de chaque groupe (inclus / exclu)",
            "url": "https://icr.ethz.ch/data/epr/core/",
            "license": "usage academique libre, citation requise (Vogt et al. 2015)",
            "date": "version 2021 (periode retenue : 2012-2021)",
        },
        {
            "name": "Glottolog (CLDF)",
            "org": "Max Planck Institute for Evolutionary Anthropology, Leipzig",
            "role": "points de langues (lat/lon), famille, code ISO 639-3",
            "url": "https://glottolog.org/ "
                   "(https://github.com/glottolog/glottolog-cldf)",
            "license": "CC BY 4.0",
            "date": "telecharge le " + GENERATED,
        },
    ]

    obj = {
        "groups": groups,
        "languages": languages,
        "note": note,
        "sources": sources,
        "generated": GENERATED,
    }

    payload = json.dumps(obj, ensure_ascii=False, separators=(",", ":"))
    header = (
        "/* ------------------------------------------------------------------\n"
        " * data/layer_ethnolang.js — COUCHE ETHNO-LINGUISTIQUE (groupes + langues)\n"
        " * Genere par scripts/ethnolang/build_ethnolang.py — NE PAS editer a la main.\n"
        " * Charge APRES data/bundle.js. Additif : pose window.SUDAN.ethnolang.\n"
        " * Sources OUVERTES academiques : GeoEPR-2021 + EPR-2021 (ETH Zurich),\n"
        " * Glottolog (CC BY 4.0). Cadre neutre, non deterministe — voir .README.md\n"
        " * et le champ `note`. Toute carte ethnique est une simplification contestee.\n"
        " * ------------------------------------------------------------------ */\n"
    )
    body = (
        "(function () {\n"
        "  \"use strict\";\n"
        "  window.SUDAN = window.SUDAN || {};\n"
        "  window.SUDAN.ethnolang = " + payload + ";\n"
        "})();\n"
    )
    out = root / "data" / "layer_ethnolang.js"
    out.write_text(header + body, encoding="utf-8")
    print(f"OK -> {out}")
    print(f"   groupes   : {len(groups)}")
    print(f"   langues   : {len(languages)} (dont {sum(l['major'] for l in languages)} majeures ; "
          f"{skipped} ecartees hors-bbox)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
