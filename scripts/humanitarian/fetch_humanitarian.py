"""Telecharge les donnees humanitaires officielles publiees dans raw_dir.

    python3 -I scripts/humanitarian/fetch_humanitarian.py <raw_dir>

Ecrit UNIQUEMENT dans raw_dir (data/raw/humanitarian/). Donnees non fiables :
ne jamais lancer un interpreteur depuis raw_dir (ce script, lui, vit dans scripts/).
Toutes les sources sont des jeux publics sous licence ouverte (voir layer_humanitarian.README.md).
"""
import json
import os
import sys
import urllib.request

UA = {"User-Agent": "sudan-humanitarian-layer/1.0 (personal research)"}

# 1) IOM DTM Sudan — Displacement & Return Snapshot 008 (HDX, CC BY). Donnees au 2026-07-31.
DTM_URL = ("https://data.humdata.org/dataset/44594ae2-dde9-417f-acae-523bc012c162/"
           "resource/dfeac4ff-47a0-454c-92c1-501d34ec0fff/download/"
           "2026_dtm_sdn_idps_returnees_snapshot_008_28072026_public_hdx_vf.xlsx")
DTM_OUT = "dtm_sdn_idps_returnees_snapshot_008_28072026.xlsx"

# 2) OCHA COD-AB Sudan (HDX, CC BY-IGO) — points-label admin2 pour geolocalisation.
COD_URL = ("https://data.humdata.org/dataset/a66a4b6c-92de-4507-9546-aa1900474180/"
           "resource/6b6dc98a-3c49-4e16-9c2a-bc926d2ee988/download/"
           "sdn_admin_boundaries.xlsx")
COD_OUT = "sdn_cod_ab_admin_boundaries.xlsx"

# 3) UNHCR Refugee Data Finder (api.unhcr.org, CC BY) — stock fin d'annee, origine Soudan.
UNHCR_URL = ("https://api.unhcr.org/population/v1/population/?limit=500&"
             "yearFrom={y}&yearTo={y}&coo=SDN&coa_all=true&cf_type=ISO")


def download(url, out_path):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=120) as r:
        data = r.read()
    with open(out_path, "wb") as f:
        f.write(data)
    print("wrote", out_path, len(data), "bytes")


def main():
    raw_dir = sys.argv[1]
    os.makedirs(raw_dir, exist_ok=True)
    download(DTM_URL, os.path.join(raw_dir, DTM_OUT))
    download(COD_URL, os.path.join(raw_dir, COD_OUT))
    for y in (2024, 2025):
        download(UNHCR_URL.format(y=y),
                 os.path.join(raw_dir, "unhcr_rdf_sdn_origin_%d.json" % y))
    # petit controle de validite du dernier JSON UNHCR
    j = json.load(open(os.path.join(raw_dir, "unhcr_rdf_sdn_origin_2025.json")))
    print("UNHCR 2025 items:", len(j.get("items", [])))


if __name__ == "__main__":
    main()
