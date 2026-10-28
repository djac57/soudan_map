#!/usr/bin/env python3
# -I : isolated mode (ignore env / user site-packages).
"""
fetch_ethnolang.py — telecharge les sources OUVERTES de la couche ethno-linguistique
dans data/raw/ethnolang/. Ne transforme rien : simple telechargement + dezippage.

Sources (toutes ouvertes, academiques, citees) :
  * GeoEPR-2021  (ETH Zurich, ICR) — polygones de peuplement des groupes ethniques
                 politiquement pertinents + identifiants de groupe.  Licence : usage
                 academique libre, citation requise (Vogt et al. 2015 ; Wucherpfennig
                 et al. 2011).  https://icr.ethz.ch/data/epr/geoepr/
  * EPR-2021     (ETH Zurich, ICR) — statut d'acces au pouvoir de chaque groupe
                 (MONOPOLY ... DISCRIMINATED) par periode.  Meme licence.
                 https://icr.ethz.ch/data/epr/core/
  * Glottolog    (CLDF, MPI EVA Leipzig) — points de langues (lat/lon), famille,
                 code ISO 639-3.  Licence : CC BY 4.0.
                 https://github.com/glottolog/glottolog-cldf

Usage :
    python3 -I scripts/ethnolang/fetch_ethnolang.py /ABS/soudan/data/raw/ethnolang
"""
import io
import sys
import urllib.request
import zipfile
from pathlib import Path

UA = {"User-Agent": "Mozilla/5.0 (sudan-map ethnolang fetch, academic use)"}

SOURCES = {
    "GeoEPR-2021.zip": "https://icr.ethz.ch/data/epr/geoepr/GeoEPR-2021.zip",
    "EPR-2021.csv": "https://icr.ethz.ch/data/epr/core/EPR-2021.csv",
    "glottolog_languages.csv":
        "https://raw.githubusercontent.com/glottolog/glottolog-cldf/"
        "master/cldf/languages.csv",
}


def download(url: str, timeout: int = 120) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def main(argv):
    if len(argv) != 2:
        print(__doc__)
        return 2
    out = Path(argv[1]).resolve()
    out.mkdir(parents=True, exist_ok=True)

    for name, url in SOURCES.items():
        print(f"[fetch] {name} <- {url}")
        blob = download(url)
        dest = out / name
        dest.write_bytes(blob)
        print(f"        {len(blob):,} octets -> {dest}")

    # Dezippe GeoEPR (shapefile : .shp/.dbf/.shx/.prj) dans un sous-dossier dedie.
    zpath = out / "GeoEPR-2021.zip"
    geo_dir = out / "GeoEPR-2021"
    geo_dir.mkdir(exist_ok=True)
    with zipfile.ZipFile(io.BytesIO(zpath.read_bytes())) as z:
        for member in z.namelist():
            # securite : pas de chemins absolus / remontees
            safe = Path(member).name
            if not safe:
                continue
            (geo_dir / safe).write_bytes(z.read(member))
            print(f"[unzip] {member} -> {geo_dir / safe}")

    print("OK fetch_ethnolang termine.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
