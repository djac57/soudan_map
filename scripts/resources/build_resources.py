"""Build data/layer_resources.js — COUCHE RESSOURCES & RICHESSES du site Soudan.

    python3 -I scripts/resources/build_resources.py <soudan_dir> <raw_dir>

Exemple :
    python3 -I scripts/resources/build_resources.py \
        /Users/douglas.comin/Desktop/perso/soudan \
        /Users/douglas.comin/Desktop/perso/soudan/data/raw/resources

N'ECRIT QUE <soudan_dir>/data/layer_resources.js (objet global window.SUDAN.resources).
Ne touche a AUCUN autre fichier. Additif : pose window.SUDAN.resources, charge APRES bundle.js.

Angle ANALYTIQUE : l'economie de guerre soudanaise — l'OR finance largement les FSR (RSF),
le petrole/les barrages/l'agriculture sont des leviers et des cibles. Chaque enregistrement
porte sa SOURCE datee ; chaque lien ressource<->conflit est ATTRIBUE ('selon ...'),
jamais speculatif. Garde-fou Darfour : zones d'orpaillage diffuses = point representatif de
l'Etat (precision='zone_approx'), aucune localisation fine inventee.

Entree : <raw_dir>/sites.json  (donnees curees, compilees a la main depuis des sources
                                 ouvertes verifiees et citees — voir le fichier).
Sortie : <soudan_dir>/data/layer_resources.js
"""
import json
import os
import sys

# ISO-3166-2 (shapeISO de data/boundaries/sudan_adm1.geojson), identique au reste du site.
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
ADM1_FR = {
    "SD-GZ": "Al-Jazirah (Gezira)", "SD-NB": "Nil Bleu", "SD-DC": "Darfour central",
    "SD-DE": "Darfour oriental", "SD-GD": "Gedaref", "SD-KA": "Kassala",
    "SD-KH": "Khartoum", "SD-DN": "Darfour du Nord", "SD-KN": "Kordofan du Nord",
    "SD-NO": "Nord", "SD-RS": "Mer Rouge", "SD-NR": "Nil (fleuve)", "SD-SI": "Sennar",
    "SD-DS": "Darfour du Sud", "SD-KS": "Kordofan du Sud", "SD-DW": "Darfour occidental",
    "SD-GK": "Kordofan occidental", "SD-NW": "Nil Blanc",
}

# Boite englobante grossiere du Soudan (lon_min, lat_min, lon_max, lat_max) pour validation.
SUDAN_BBOX = (21.8, 8.4, 38.7, 22.3)
CATEGORIES = ("gold", "oil", "dams", "agriculture")


def in_bbox(lon, lat):
    x0, y0, x1, y1 = SUDAN_BBOX
    return x0 <= lon <= x1 and y0 <= lat <= y1


def check_coord(lon, lat, ctx):
    if not isinstance(lon, (int, float)) or not isinstance(lat, (int, float)):
        raise ValueError("coord non numerique: %s" % ctx)
    if not in_bbox(lon, lat):
        raise ValueError("coord hors Soudan (%s,%s): %s" % (lon, lat, ctx))


def enrich(rec):
    """Ajoute adm1_id + state_fr a partir de l'Etat (quand un Etat est fourni)."""
    state = rec.get("state")
    if state:
        adm1 = NAME_TO_ADM1.get(state)
        if adm1 is None:
            raise ValueError("Etat inconnu: %r (id=%s)" % (state, rec.get("id")))
        rec["adm1_id"] = adm1
        rec["state_fr"] = ADM1_FR[adm1]
    return rec


def validate_record(rec, cat):
    rid = rec.get("id")
    if not rid:
        raise ValueError("enregistrement sans id (%s)" % cat)
    if not rec.get("name_fr"):
        raise ValueError("sans name_fr: %s" % rid)
    if not rec.get("source"):
        raise ValueError("sans source: %s" % rid)
    if rec.get("kind") == "pipeline":
        route = rec.get("route")
        if not route or len(route) < 2:
            raise ValueError("pipeline sans route: %s" % rid)
        for pt in route:
            check_coord(pt[0], pt[1], "route de %s" % rid)
    else:
        check_coord(rec.get("lon"), rec.get("lat"), rid)
        enrich(rec)


def build(soudan_dir, raw_dir):
    with open(os.path.join(raw_dir, "sites.json"), encoding="utf-8") as fh:
        raw = json.load(fh)

    out = {}
    counts = {}
    for cat in CATEGORIES:
        recs = raw.get(cat, [])
        for rec in recs:
            validate_record(rec, cat)
        out[cat] = recs
        counts[cat] = len(recs)

    out["sources"] = raw["sources"]
    out["generated"] = raw.get("generated", "")
    out["note"] = (
        "Couche RESSOURCES & RICHESSES : lecture ANALYTIQUE de l'economie de guerre "
        "soudanaise a partir de SOURCES OUVERTES VERIFIEES, CITEES ET DATEES. "
        "OR (central) : nerf financier de la guerre ; selon le Panel d'experts de l'ONU "
        "(S/2024/65, 2024, rapporte par Bloomberg/Reuters) les FSR (RSF) controlent "
        "l'essentiel du commerce de l'or soudanais, qui finance leur effort militaire, "
        "l'or du Darfour etant exporte en grande partie via les Emirats arabes unis (EAU) "
        "- allegations jugees credibles par le Panel, dementies par les EAU. Selon Chatham "
        "House (2025), de vastes zones d'orpaillage (ASGM) du Darfour et du Kordofan sont en "
        "territoire FSR, tandis que l'essentiel de la production INDUSTRIELLE et licenciee "
        "(Ariab-Hassai, Mer Rouge ; Nil-fleuve ; Nord) se trouve dans l'est/nord tenu par "
        "l'armee (SAF) : les DEUX camps tirent des revenus de l'or. PETROLE : champs "
        "(Heglig, Fula) et oleoduc Greater Nile vers Port-Soudan ; selon Al Jazeera et Sudan "
        "Tribune (dec. 2025) les FSR ont pris Heglig et percevraient des droits de transit "
        "(~4 USD/baril) sur le brut sud-soudanais. BARRAGES & EAU (Merowe, Roseires, Sennar, "
        "Jebel Aulia, Khashm el-Girba) : leviers energie/eau et CIBLES militaires (frappes de "
        "drones, entretien interrompu). AGRICULTURE : Gezira (pillee/endommagee par les FSR "
        "apres dec. 2023), gomme arabique du Kordofan (~70 % de l'offre mondiale, exports "
        "perturbes), greniers de l'est (Gedaref, New Halfa). "
        "GARDE-FOUS : rien d'invente ; lien ressource<->controle UNIQUEMENT quand il est "
        "source ('selon ...'). PRECISION : 'point' = coordonnee d'un site identifie "
        "(Mindat/OSM/Wikipedia) ; 'zone_approx' = point REPRESENTATIF d'un Etat pour une "
        "ressource DIFFUSE (orpaillage, perimetre, ceinture agricole), PAS un site GPS ; "
        "'schematic' = trace indicatif (oleoduc), non geometrique. LIMITES : situation de "
        "controle TRES mouvante (dates indiquees par enregistrement) et parfois contradictoire "
        "entre sources (ex. Jebel Aulia) ; volumes de production incertains depuis 2023 "
        "(donnees declaratives, contrebande) ; coordonnees des zones diffuses approximatives. "
        "Attribution requise pour chaque source (voir 'sources')."
    )
    out["counts"] = counts

    header = (
        "/* ------------------------------------------------------------------\n"
        " * data/layer_resources.js - COUCHE RESSOURCES & RICHESSES (economie de guerre)\n"
        " * Genere par scripts/resources/build_resources.py - NE PAS editer a la main.\n"
        " * Entree : data/raw/resources/sites.json (sources ouvertes verifiees/citees/datees).\n"
        " * Charge APRES data/bundle.js. Additif : pose window.SUDAN.resources.\n"
        " * Angle : l'OR finance largement les FSR (RSF) ; petrole/barrages/agriculture =\n"
        " * leviers et cibles. Liens ressource<->conflit SOURCES uniquement. Voir .README.md.\n"
        " * ------------------------------------------------------------------ */\n"
    )
    body = json.dumps(out, ensure_ascii=False, separators=(", ", ": "))
    js = (
        header
        + "(function () {\n  \"use strict\";\n"
        + "  window.SUDAN = window.SUDAN || {};\n"
        + "  window.SUDAN.resources = " + body + ";\n"
        + "})();\n"
    )

    out_path = os.path.join(soudan_dir, "data", "layer_resources.js")
    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write(js)

    total = sum(counts.values())
    print("OK -> %s" % out_path)
    print("  or=%d  petrole=%d  barrages=%d  agriculture=%d  (total %d features, %d sources)"
          % (counts["gold"], counts["oil"], counts["dams"], counts["agriculture"],
             total, len(out["sources"])))


def main(argv):
    if len(argv) != 3:
        sys.stderr.write(
            "usage: python3 -I build_resources.py <soudan_dir> <raw_dir>\n")
        return 2
    build(argv[1], argv[2])
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
