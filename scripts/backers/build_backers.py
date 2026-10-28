"""Build data/layer_backers.js — COUCHE SOUTIENS ÉTRANGERS du site Soudan.

    python3 -I scripts/backers/build_backers.py <soudan_dir> [raw_dir]

N'ÉCRIT QUE <soudan_dir>/data/layer_backers.js (objet global window.SUDAN.backers).
Ne touche à AUCUN autre fichier. Chargé APRÈS data/bundle.js, additif.

SUJET DIPLOMATIQUEMENT SENSIBLE — rigueur maximale :
  - chaque soutien est ATTRIBUÉ (source + URL + date) et étiqueté par niveau de certitude ;
  - aucune accusation non étayée ; équilibre SAF / RSF ;
  - les démentis gouvernementaux sont notés (champ `denied` + mention dans `status`/`note`) ;
  - aucune donnée nominative ; rien d'inventé ; distinction « multi-source » / « rapporté » / « ambivalent ».

Entrée : <raw_dir>/backers_records.json — notes sources curées à la main (citations).
  Par défaut raw_dir = <soudan_dir>/data/raw/backers.

Sources privilégiées : Groupe d'experts de l'ONU sur le Soudan (comité 1591),
Reuters/AFP/NYT/Al Jazeera, International Crisis Group, Sudan Conflict Observatory,
GI-TOC, The Sentry. Voir data/layer_backers.README.md.
"""
import json
import os
import sys

GENERATED = "2026-10-28"

FIELDS = [
    "country", "country_fr", "iso3", "lon", "lat",
    "support_type", "certainty", "denied", "status", "note", "hub", "sources",
]

CERTAINTY_OK = {"multi-source", "rapporte", "ambivalent"}


def clean_entry(side, e):
    """Valide et normalise un enregistrement de soutien."""
    for key in ("country", "country_fr", "iso3", "lon", "lat",
                "support_type", "certainty", "status", "note", "sources"):
        if key not in e:
            raise ValueError("%s: champ manquant '%s' pour %r"
                             % (side, key, e.get("country")))
    if e["certainty"] not in CERTAINTY_OK:
        raise ValueError("%s/%s: certainty invalide %r"
                         % (side, e["country"], e["certainty"]))
    if not isinstance(e["sources"], list) or not e["sources"]:
        raise ValueError("%s/%s: au moins une source attribuée est requise"
                         % (side, e["country"]))
    for s in e["sources"]:
        for k in ("name", "url", "date"):
            if k not in s or not s[k]:
                raise ValueError("%s/%s: source incomplète (%s manquant)"
                                 % (side, e["country"], k))
    out = {
        "country": e["country"],
        "country_fr": e["country_fr"],
        "iso3": e["iso3"],
        "lon": round(float(e["lon"]), 4),
        "lat": round(float(e["lat"]), 4),
        "support_type": list(e["support_type"]),
        "certainty": e["certainty"],
        "denied": bool(e.get("denied", False)),
        "status": e["status"],
        "note": e["note"],
        "sources": [{"name": s["name"], "url": s["url"], "date": s["date"]}
                    for s in e["sources"]],
    }
    if e.get("hub"):
        h = e["hub"]
        out["hub"] = {"name": h["name"],
                      "lon": round(float(h["lon"]), 4),
                      "lat": round(float(h["lat"]), 4)}
    return out


def build(soudan_dir, raw_dir):
    raw_path = os.path.join(raw_dir, "backers_records.json")
    with open(raw_path, encoding="utf-8") as fh:
        raw = json.load(fh)

    saf = [clean_entry("saf", e) for e in raw["saf"]]
    rsf = [clean_entry("rsf", e) for e in raw["rsf"]]

    # Liste de sources de référence dédupliquée (pour l'onglet méthode/crédits).
    seen = {}
    for e in saf + rsf:
        for s in e["sources"]:
            seen.setdefault(s["url"], {"name": s["name"], "url": s["url"], "date": s["date"]})
    sources = sorted(seen.values(), key=lambda s: s["name"].lower())

    obj = {
        "generated": GENERATED,
        "target": raw["sudan_target"],
        "legend": {
            "saf": "Forces armées soudanaises (al-Burhan) — soutiens rapportés",
            "rsf": "Forces de soutien rapide (Hemedti) — soutiens rapportés",
            "certainty": {
                "multi-source": "Confirmé par plusieurs sources indépendantes",
                "rapporte": "Rapporté / allégué (non confirmé indépendamment)",
                "ambivalent": "Rôle changeant / joue les deux camps",
            },
        },
        "saf": saf,
        "rsf": rsf,
        "sources": sources,
        "note": (
            "SOUTIENS ÉTRANGERS RAPPORTÉS — sujet diplomatiquement sensible. "
            "Aucun de ces soutiens n'est « officiel » : ce sont des allégations ATTRIBUÉES "
            "à des sources fiables (Groupe d'experts de l'ONU sur le Soudan en priorité, puis "
            "Reuters/AFP/NYT/Al Jazeera, International Crisis Group, GI-TOC, The Sentry, etc.), "
            "chacune datée et liée. Les gouvernements concernés DÉMENTENT le plus souvent "
            "(champ `denied`). Étiquetage par certitude : « multi-source » (convergence de plusieurs "
            "sources), « rapporte » (allégué / une ou quelques sources), « ambivalent » (rôle "
            "changeant, ex. Russie). Le soutien EAU→RSF est le plus documenté (jugé crédible par "
            "le Groupe d'experts de l'ONU) ; beaucoup d'autres restent des rapports de presse ou de "
            "think tanks. Les coordonnées (lon/lat = capitale/QG ; `hub` = point de transit réel) "
            "servent d'éventuelles flèches de flux vers le Soudan — elles n'impliquent pas une route "
            "précise. LIMITES : aucune donnée nominative ; rien d'inventé ; situation évolutive "
            "(les alliances changent, cf. bascule russe de 2024) ; absence d'une entrée ≠ absence "
            "de soutien. À lire comme une cartographie PRUDENTE et ÉQUILIBRÉE de ce qui est "
            "allégué, pas comme un constat judiciaire."
        ),
    }

    body = json.dumps(obj, ensure_ascii=False, indent=2, sort_keys=False)
    header = (
        "/* ------------------------------------------------------------------\n"
        " * data/layer_backers.js — COUCHE SOUTIENS ÉTRANGERS (qui soutient SAF vs RSF)\n"
        " * Généré par scripts/backers/build_backers.py — NE PAS éditer à la main.\n"
        " * Chargé APRÈS data/bundle.js. Additif : pose window.SUDAN.backers.\n"
        " * SUJET SENSIBLE : soutiens RAPPORTÉS/ALLÉGUÉS, ATTRIBUÉS à des sources fiables,\n"
        " * étiquetés par certitude ; démentis gouvernementaux notés. Équilibre SAF/RSF.\n"
        " * Sources privilégiées : Groupe d'experts de l'ONU sur le Soudan — voir .README.md.\n"
        " * ------------------------------------------------------------------ */\n"
    )
    js = (
        header
        + "(function () {\n"
        + '  "use strict";\n'
        + "  window.SUDAN = window.SUDAN || {};\n"
        + "  window.SUDAN.backers = " + body + ";\n"
        + "})();\n"
    )

    out_path = os.path.join(soudan_dir, "data", "layer_backers.js")
    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write(js)

    n_src = len(sources)
    print("layer_backers.js écrit : %d soutiens SAF, %d soutiens RSF, %d sources."
          % (len(saf), len(rsf), n_src))
    print("  -> " + out_path)


def main(argv):
    if len(argv) < 2:
        sys.stderr.write(__doc__)
        return 2
    soudan_dir = os.path.abspath(argv[1])
    raw_dir = (os.path.abspath(argv[2]) if len(argv) > 2
               else os.path.join(soudan_dir, "data", "raw", "backers"))
    build(soudan_dir, raw_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
