#!/usr/bin/env python3
"""Sudan gazetteer + bilingual (Arabic/Latin) place matcher for the OSINT layer.

Coordinates are town/city points and ADM1 state references, derived from public
geography (geoBoundaries ADM1 for state names/centroids; well-known settlement
coordinates). GRANULARITY GUARDRAIL: only named towns/cities and states — NO IDP
camps, NO neighbourhood/sub-village geocoding (Darfur safeguard). Matching is a
deliberately coarse, NOISY text heuristic; treat every hit as indicative only.

Public API:
    LOCALITIES            -> list of dicts {key, name, adm1, lon, lat, aliases_ar, aliases_en}
    STATES                -> dict adm1_name -> {aliases_ar, aliases_en}
    normalize_ar(text)
    build_matchers(localities, states) -> list of (kind, key, adm1, compiled_regex)
    find_places(text, matchers) -> set of (kind, key, adm1)
"""
import re, unicodedata

# --- Arabic normalization ------------------------------------------------
_AR_DIAC = re.compile(r'[ؐ-ًؚ-ٰٟۖ-ۭـ]')


def normalize_ar(s):
    s = unicodedata.normalize('NFKC', s)
    s = _AR_DIAC.sub('', s)                 # strip harakat + tatweel
    s = (s.replace('أ', 'ا').replace('إ', 'ا')
           .replace('آ', 'ا')      # alef variants -> bare alef
           .replace('ى', 'ي')      # alef maqsura -> ya
           .replace('ة', 'ه'))     # ta marbuta -> ha
    return s


def normalize_lat(s):
    s = unicodedata.normalize('NFKD', s)
    s = ''.join(c for c in s if not unicodedata.combining(c))
    return s.lower()


# --- Gazetteer -----------------------------------------------------------
# (key, display name, ADM1 state as named in geoBoundaries, lon, lat,
#  [arabic aliases], [latin aliases])
LOCALITIES = [
    # ---- Kordofan focus (El-Obeid / Bara axis + wider Kordofan) ----
    ("el_obeid", "El Obeid", "North Kordofan", 30.217, 13.183,
        ["الابيض"], ["el obeid", "al-obeid", "al ubayyid", "el-obeid", "obeid"]),
    ("bara", "Bara", "North Kordofan", 30.367, 13.700,
        ["بارا"], ["bara"]),
    ("um_rawaba", "Umm Rawaba", "North Kordofan", 31.217, 12.900,
        ["ام روابه", "امروابه"], ["umm rawaba", "um rawaba", "umm ruwaba"]),
    ("er_rahad", "Er Rahad", "North Kordofan", 30.648, 12.717,
        ["الرهد"], ["er rahad", "al rahad", "ar rahad", "el rahad"]),
    ("en_nahud", "En Nahud", "West Kordofan", 28.433, 12.700,
        ["النهود"], ["en nahud", "al nuhud", "an nuhud", "el nahud", "nahud"]),
    ("el_fula", "El Fula", "West Kordofan", 28.350, 11.717,
        ["الفوله"], ["el fula", "al-fula", "al fulah"]),
    ("babanusa", "Babanusa", "West Kordofan", 27.807, 11.330,
        ["بابنوسه"], ["babanusa", "babanousa"]),
    ("muglad", "Muglad", "West Kordofan", 27.733, 11.040,
        ["المجلد"], ["muglad", "al-muglad", "mughlad"]),
    ("abu_zabad", "Abu Zabad", "West Kordofan", 29.250, 12.350,
        ["ابو زبد"], ["abu zabad"]),
    ("lagawa", "Lagawa", "West Kordofan", 29.133, 11.400,
        ["لقاوه"], ["lagawa", "laqawa"]),
    ("kadugli", "Kadugli", "South Kordofan", 29.717, 11.010,
        ["كادقلي", "كادوقلي"], ["kadugli", "kaduqli"]),
    ("dilling", "Dilling", "South Kordofan", 29.650, 12.050,
        ["الدلنج"], ["dilling", "dalang", "al dalanj"]),
    ("talodi", "Talodi", "South Kordofan", 30.383, 10.633,
        ["تلودي"], ["talodi", "taludi"]),
    ("habila_sk", "Habila", "South Kordofan", 29.500, 11.330,
        ["هبيله"], ["habila"]),
    # ---- North Darfur (El-Fasher focus) ----
    ("el_fasher", "El Fasher", "North Darfur", 25.350, 13.630,
        ["الفاشر"], ["el fasher", "al-fashir", "el-fasher", "al fashir", "fasher"]),
    ("mellit", "Mellit", "North Darfur", 25.567, 14.130,
        ["مليط"], ["mellit", "malit"]),
    ("kutum", "Kutum", "North Darfur", 24.667, 14.200,
        ["كتم"], ["kutum"]),
    ("tawila", "Tawila", "North Darfur", 24.730, 13.450,
        ["طويله"], ["tawila"]),
    ("kabkabiya", "Kabkabiya", "North Darfur", 24.083, 13.650,
        ["كبكابيه"], ["kabkabiya", "kebkabiya"]),
    ("um_keddada", "Umm Keddada", "North Darfur", 26.567, 13.600,
        ["ام كدادة", "ام كداده"], ["umm keddada", "um kadadah"]),
    ("saraf_omra", "Saraf Omra", "North Darfur", 23.500, 13.750,
        ["سرف عمره"], ["saraf omra", "sarraf umra"]),
    # ---- South / Central / East / West Darfur ----
    ("nyala", "Nyala", "South Darfur", 24.883, 12.050,
        ["نيالا"], ["nyala"]),
    ("kas", "Kas", "South Darfur", 24.300, 12.500,
        ["كاس"], ["kass", "kas town"]),
    ("ed_daein", "Ed Daein", "East Darfur", 26.130, 11.460,
        ["الضعين"], ["ed daein", "al-daein", "el daein", "al dein"]),
    ("zalingei", "Zalingei", "Central Darfur", 23.483, 12.900,
        ["زالنجي"], ["zalingei", "zalinge", "zalingi"]),
    ("golo", "Golo", "Central Darfur", 23.400, 12.570,
        ["قولو"], ["golo"]),
    ("el_geneina", "El Geneina", "West Darfur", 22.450, 13.450,
        ["الجنينه"], ["el geneina", "al-geneina", "el-geneina", "geneina", "al junaynah"]),
    ("tine", "Tine", "North Darfur", 22.267, 15.000,
        ["الطينه"], ["tine", "tina"]),
    # ---- Khartoum / centre ----
    ("khartoum_city", "Khartoum", "Khartoum", 32.560, 15.500,
        ["الخرطوم"], ["khartoum"]),
    ("omdurman", "Omdurman", "Khartoum", 32.480, 15.645,
        ["ام درمان", "امدرمان"], ["omdurman", "umm durman"]),
    ("bahri", "Khartoum Bahri", "Khartoum", 32.550, 15.633,
        ["بحري", "الخرطوم بحري"], ["khartoum bahri", "khartoum north", "bahri"]),
    ("jebel_awlia", "Jebel Awlia", "Khartoum", 32.490, 15.240,
        ["جبل اوليا"], ["jebel awlia", "jabal awliya"]),
    # ---- Gezira / White Nile / Sennar / Blue Nile ----
    ("wad_madani", "Wad Madani", "Gezira", 33.520, 14.400,
        ["ود مدني", "مدني"], ["wad madani", "wad medani", "madani"]),
    ("el_hasaheisa", "El Hasaheisa", "Gezira", 33.287, 14.750,
        ["الحصاحيصا"], ["el hasaheisa", "hasaheisa"]),
    ("kosti", "Kosti", "White Nile", 32.663, 13.167,
        ["كوستي"], ["kosti"]),
    ("rabak", "Rabak", "White Nile", 32.733, 13.180,
        ["ربك"], ["rabak", "rabmak"]),
    ("ed_dueim", "Ed Dueim", "White Nile", 32.333, 14.000,
        ["الدويم"], ["ed dueim", "al duwaym", "el dueim"]),
    ("sennar_city", "Sennar", "Sennar", 33.630, 13.550,
        ["سنار"], ["sennar"]),
    ("singa", "Singa", "Sennar", 33.930, 13.150,
        ["سنجه"], ["singa", "sinja"]),
    ("ed_damazin", "Ed Damazin", "Blue Nile", 34.350, 11.780,
        ["الدمازين"], ["ed damazin", "al-damazin", "el damazin", "damazin"]),
    # ---- East ----
    ("gedaref_city", "Gedaref", "Gedaref", 35.383, 14.033,
        ["القضارف", "القضارف"], ["gedaref", "al qadarif", "gadarif"]),
    ("kassala_city", "Kassala", "Kassala", 36.400, 15.450,
        ["كسلا"], ["kassala"]),
    ("port_sudan", "Port Sudan", "Red Sea", 37.217, 19.617,
        ["بورتسودان", "بورت سودان"], ["port sudan"]),
    # ---- North / River Nile ----
    ("atbara", "Atbara", "River Nile", 33.986, 17.703,
        ["عطبره"], ["atbara"]),
    ("ed_damer", "Ed Damer", "River Nile", 33.970, 17.590,
        ["الدامر"], ["ed damer", "al-damar", "el damer"]),
    ("shendi", "Shendi", "River Nile", 33.433, 16.691,
        ["شندي"], ["shendi"]),
    ("berber", "Berber", "River Nile", 33.980, 18.020,
        ["بربر"], ["berber"]),
    ("dongola", "Dongola", "Northern", 30.483, 19.167,
        ["دنقلا"], ["dongola", "dunqula"]),
    ("merowe", "Merowe", "Northern", 31.820, 18.470,
        ["مروي"], ["merowe", "merowi"]),

    # ================= ADM2 EXPANSION (v2) =================
    # More towns per state to lift geocoding recall. Town/city granularity only
    # (NO camps, NO neighbourhoods — Darfur safeguard). Coordinates are
    # well-known settlement points (approx.). Aliases bilingual ar/en. Names
    # that are also common Arabic words (e.g. "white", "peace", "come on") are
    # deliberately excluded to limit false positives on this coarse matcher.
    # ---- North Kordofan ----
    ("sodari", "Sodari", "North Kordofan", 29.070, 14.370,
        ["سودري"], ["sodari", "sawdari", "soudari"]),
    ("gebeish", "Ghubaysh", "West Kordofan", 27.150, 12.650,
        ["غبيش"], ["ghubaysh", "gebeish", "ghubeish"]),
    # ---- West Kordofan ----
    ("wad_banda", "Wad Banda", "West Kordofan", 27.950, 13.130,
        ["ود بندة", "ودبندة"], ["wad banda", "wad bandah"]),
    ("al_odaya", "Al Odaya", "West Kordofan", 28.000, 12.050,
        ["العضايه"], ["al odaya", "al udaya", "el odaya"]),
    ("al_khuwayy", "Al Khuwayy", "West Kordofan", 27.800, 13.070,
        ["الخوي"], ["al khuwayy", "al khiwai", "khuwei"]),
    ("al_meiram", "Al Meiram", "West Kordofan", 27.600, 10.600,
        ["الميرم"], ["al meiram", "al mayram", "meiram"]),
    ("keilak", "Keilak", "West Kordofan", 29.270, 11.500,
        ["كيلك"], ["keilak", "kailak"]),
    # ---- South Kordofan ----
    ("abu_jubayha", "Abu Jubayha", "South Kordofan", 30.950, 11.450,
        ["ابو جبيهه"], ["abu jubayha", "abu jibaiha", "abu jebeiha"]),
    ("rashad", "Rashad", "South Kordofan", 31.050, 11.850,
        ["رشاد"], ["rashad"]),
    ("heiban", "Heiban", "South Kordofan", 30.300, 11.200,
        ["هيبان"], ["heiban", "hayban"]),
    ("al_abbasiya", "Al Abbasiya", "South Kordofan", 31.170, 12.170,
        ["العباسيه"], ["al abbasiya", "el abbasiya", "abbasiya tagali"]),
    ("kalogi", "Kalogi", "South Kordofan", 29.600, 10.800,
        ["كالوقي"], ["kalogi", "kaloji"]),
    # ---- North Darfur ----
    ("al_lait", "Al Lait", "North Darfur", 26.100, 14.200,
        ["اللعيت"], ["al lait", "al leit", "el lait"]),
    ("malha", "Malha", "North Darfur", 26.150, 15.150,
        ["ملحة", "ملحه"], ["malha", "maliha"]),
    ("shangil_tobaya", "Shangil Tobaya", "North Darfur", 25.120, 13.000,
        ["شنقل طوباية", "شنقل طوبايه"], ["shangil tobaya", "shangil tobay"]),
    ("tawisha", "At Tawisha", "North Darfur", 26.100, 13.300,
        ["الطويشة", "الطويشه"], ["at tawisha", "tawisha", "el tawisha"]),
    ("umm_baru", "Umm Baru", "North Darfur", 22.700, 15.100,
        ["ام برو"], ["umm baru", "um baru"]),
    ("karnoi", "Karnoi", "North Darfur", 22.250, 15.000,
        ["كرنوي"], ["karnoi", "kornoi", "karnomi"]),
    # ---- South Darfur ----
    ("gereida", "Gereida", "South Darfur", 25.100, 11.300,
        ["قريضة", "قريضه"], ["gereida", "greida", "qarida"]),
    ("buram_sd", "Buram", "South Darfur", 25.170, 10.830,
        ["برام"], ["buram"]),
    ("tullus", "Tullus", "South Darfur", 24.200, 11.600,
        ["تلس"], ["tullus", "tulus", "tullos"]),
    ("rehed_birdi", "Rehed el Birdi", "South Darfur", 23.800, 11.300,
        ["رهيد البردي"], ["rehed el birdi", "rehaid al birdi", "um birdi"]),
    # ---- Central Darfur ----
    ("nertiti", "Nertiti", "Central Darfur", 24.050, 12.900,
        ["نيرتتي"], ["nertiti", "nirteti", "nertity"]),
    ("mukjar", "Mukjar", "Central Darfur", 23.530, 11.970,
        ["مكجر"], ["mukjar", "mokjar"]),
    ("bindisi", "Bindisi", "Central Darfur", 23.650, 12.100,
        ["بندسي"], ["bindisi", "bendesi"]),
    ("umm_dukhun", "Umm Dukhun", "Central Darfur", 23.000, 11.000,
        ["ام دخن"], ["umm dukhun", "um dukhun", "umdukhun"]),
    ("garsila", "Garsila", "Central Darfur", 23.500, 12.330,
        ["قرسلة", "قرسله"], ["garsila", "garsilah", "wadi salih"]),
    # ---- East Darfur ----
    ("shearia", "Shearia", "East Darfur", 25.700, 12.300,
        ["شعيرية", "شعيريه"], ["shearia", "sheiria", "shaeiria"]),
    ("abu_karinka", "Abu Karinka", "East Darfur", 26.600, 11.800,
        ["ابو كارنكا"], ["abu karinka", "abu karinca"]),
    ("adila", "Adila", "East Darfur", 26.750, 11.650,
        ["عديلة", "عديله"], ["adila", "adilla"]),
    ("abu_matariq", "Abu Matariq", "East Darfur", 26.000, 10.800,
        ["ابو مطارق"], ["abu matariq", "abu matareg"]),
    # ---- West Darfur ----
    ("kereneik", "Kereneik", "West Darfur", 22.700, 13.300,
        ["كرينك"], ["kereneik", "krinding", "kerenik"]),
    ("sirba", "Sirba", "West Darfur", 22.680, 13.800,
        ["سربا"], ["sirba", "serba"]),
    ("foro_baranga", "Foro Baranga", "West Darfur", 22.300, 12.900,
        ["فوربرنقا", "فور برنقا"], ["foro baranga", "furbaranga"]),
    # ---- Gezira ----
    ("managil", "Managil", "Gezira", 32.970, 14.250,
        ["المناقل"], ["managil", "el managil", "al manaqil"]),
    ("rufaa", "Rufaa", "Gezira", 33.870, 14.770,
        ["رفاعة", "رفاعه"], ["rufaa", "rufaah", "rafaa"]),
    ("kamlin", "Al Kamlin", "Gezira", 33.250, 15.080,
        ["الكاملين"], ["al kamlin", "el kamlin", "kamlin"]),
    # ---- White Nile ----
    ("jabalain", "Al Jabalain", "White Nile", 32.800, 12.550,
        ["الجبلين"], ["al jabalain", "el jebelein", "jabalayn"]),
    ("tendelti", "Tendelti", "White Nile", 31.900, 13.000,
        ["تندلتي"], ["tendelti", "tandalti"]),
    # ---- Sennar ----
    ("dinder", "Dinder", "Sennar", 34.630, 12.780,
        ["الدندر"], ["dinder", "ad dinder", "el dinder"]),
    ("abu_hujar", "Abu Hujar", "Sennar", 34.150, 12.900,
        ["ابو حجار"], ["abu hujar", "abu hugar"]),
    # ---- Blue Nile ----
    ("roseires", "Er Roseires", "Blue Nile", 34.380, 11.850,
        ["الروصيرص"], ["er roseires", "al rusayris", "roseires"]),
    ("kurmuk", "Kurmuk", "Blue Nile", 34.280, 10.550,
        ["الكرمك"], ["kurmuk", "kurmok"]),
    ("geissan", "Geissan", "Blue Nile", 34.800, 11.650,
        ["قيسان"], ["geissan", "qeisan", "gaisan"]),
    # ---- Gedaref ----
    ("doka", "Doka", "Gedaref", 35.780, 13.520,
        ["دوكة", "دوكه"], ["doka", "dokah"]),
    ("showak", "Es Showak", "Gedaref", 35.420, 14.400,
        ["الشواك"], ["es showak", "al showak", "showak"]),
    ("galabat", "Al Galabat", "Gedaref", 36.150, 12.980,
        ["القلابات"], ["al galabat", "el gallabat", "gallabat"]),
    ("al_faw", "Al Faw", "Gedaref", 34.630, 13.700,
        ["الفاو"], ["al faw", "el fao"]),
    # ---- Kassala ----
    ("khashm_girba", "Khashm el Girba", "Kassala", 35.880, 14.930,
        ["خشم القربة", "خشم القربه"], ["khashm el girba", "khashm al qirbah", "new halfa"]),
    ("aroma", "Aroma", "Kassala", 36.130, 15.820,
        ["اروما"], ["aroma"]),
    ("hamashkoreib", "Hamashkoreib", "Kassala", 36.700, 16.950,
        ["همشكوريب"], ["hamashkoreib", "hamashkureib"]),
    # ---- Red Sea ----
    ("suakin", "Suakin", "Red Sea", 37.330, 19.100,
        ["سواكن"], ["suakin", "sawakin"]),
    ("tokar", "Tokar", "Red Sea", 37.730, 18.430,
        ["طوكر"], ["tokar", "tawkar"]),
    ("sinkat", "Sinkat", "Red Sea", 36.830, 18.830,
        ["سنكات"], ["sinkat", "sinket"]),
    # ---- River Nile ----
    ("abu_hamad", "Abu Hamad", "River Nile", 33.330, 19.530,
        ["ابو حمد"], ["abu hamad", "abu hamed"]),
    ("al_matamma", "El Matamma", "River Nile", 33.370, 16.680,
        ["المتمة", "المتمه"], ["el matamma", "al matammah", "metemma"]),
    # ---- Northern ----
    ("wadi_halfa", "Wadi Halfa", "Northern", 31.800, 21.800,
        ["وادي حلفا"], ["wadi halfa", "wadi halfah", "wady halfa"]),
    ("karima", "Karima", "Northern", 31.850, 18.550,
        ["كريمة", "كريمه"], ["karima", "kareima", "kuraymah"]),
    ("ad_dabbah", "Ad Dabbah", "Northern", 30.950, 18.050,
        ["الدبة", "الدبه"], ["ad dabbah", "al dabbah", "ed debba"]),
]

# ADM1 states (names must match geoBoundaries shapeName). Centroid filled by
# build_osint.py from the ADM1 GeoJSON. Aliases drive the matcher.
# NOTE: states whose name equals a same-named capital city (Khartoum, Gezira,
# Sennar, Kassala, Gedaref) are deliberately OMITTED here — they are represented
# by their city point, to avoid duplicate points and double counting. Only the
# multi-word / distinct state names are kept. English river names (blue/white
# nile) are dropped to avoid cross-conflict noise (GERD dam, river geopolitics).
STATES = {
    "North Kordofan":  {"ar": ["شمال كردفان"],     "en": ["north kordofan"]},
    "South Kordofan":  {"ar": ["جنوب كردفان"],     "en": ["south kordofan"]},
    "West Kordofan":   {"ar": ["غرب كردفان"],      "en": ["west kordofan"]},
    "North Darfur":    {"ar": ["شمال دارفور"],     "en": ["north darfur"]},
    "South Darfur":    {"ar": ["جنوب دارفور"],     "en": ["south darfur"]},
    "West Darfur":     {"ar": ["غرب دارفور"],      "en": ["west darfur"]},
    "Central Darfur":  {"ar": ["وسط دارفور"],      "en": ["central darfur"]},
    "East Darfur":     {"ar": ["شرق دارفور"],      "en": ["east darfur"]},
    "Blue Nile":       {"ar": ["النيل الازرق"],    "en": []},
    "White Nile":      {"ar": ["النيل الابيض"],    "en": []},
    "Red Sea":         {"ar": ["البحر الاحمر"],    "en": ["red sea state"]},
    "River Nile":      {"ar": ["نهر النيل"],       "en": ["river nile state"]},
    "Northern":        {"ar": ["الشماليه"],        "en": ["northern state"]},
}

# Conflict-relevance gate: a scraped message is counted only if it carries at
# least one of these war/security terms (Arabic + Latin). This filters out the
# job ads, weather, services and other non-conflict chatter that high-volume
# general news channels mix in, so the geolocated signal stays conflict-focused.
CONFLICT_TERMS = [
    # Arabic
    "الجيش", "القوات المسلحة", "الدعم السريع", "المليشيا", "مليشيا", "اشتباك",
    "معارك", "معركه", "قصف", "قصفت", "مسيره", "مسيرات", "طيران", "غاره", "هجوم",
    "هجمات", "سيطر", "تقدم", "اقتحم", "كمين", "جبهه", "محور", "حصار", "تحرير",
    "استهدف", "قتلي", "جرحي", "نزوح", "عسكري", "كتيبه", "لواء", "مدفعيه",
    "مسير", "درون", "صاروخ", "انفجار",
    # Latin
    "clash", "clashes", "shelling", "airstrike", "air strike", "drone", "offensive",
    "assault", "frontline", "front line", "siege", "advance", "captured", "seized",
    "army", "rsf", "saf", "militia", "artillery", "ambush", "battle", "fighting",
    "attack", "killed", "troops", "military",
]

# Arabic clitic prefixes that attach before a noun (و f b k l + definite ال)
_AR_LET = r'ء-ي'


def _ar_regex(alias):
    core = normalize_ar(alias)
    if core.startswith('ال'):      # drop leading "ال" -> make optional
        core = core[2:]
    core = re.escape(core).replace('\\ ', r'\s+')   # flexible whitespace
    # boundary-or-clitic before; optional (prefix)(ال); negative Arabic lookahead after
    return re.compile(
        r'(?:^|[^' + _AR_LET + r'])(?:[وفبكل]?(?:ال)?)'
        + core + r'(?![' + _AR_LET + r'])')


def _lat_regex(alias):
    core = normalize_lat(alias)
    tokens = [t for t in re.split(r'[\s\-]+', core.strip()) if t]
    pat = r'[\s\-]+'.join(re.escape(t) for t in tokens)
    return re.compile(r'(?<![a-z0-9])' + pat + r'(?![a-z0-9])')


def build_matchers(localities=LOCALITIES, states=STATES):
    out = []  # (kind, key, adm1, regex, is_arabic)
    for key, name, adm1, lon, lat, ar, en in localities:
        for a in ar:
            out.append(("loc", key, adm1, _ar_regex(a), True))
        for a in en:
            out.append(("loc", key, adm1, _lat_regex(a), False))
    for adm1, al in states.items():
        for a in al.get("ar", []):
            out.append(("state", adm1, adm1, _ar_regex(a), True))
        for a in al.get("en", []):
            out.append(("state", adm1, adm1, _lat_regex(a), False))
    return out


def find_places(text, matchers):
    nar = normalize_ar(text)
    nlat = normalize_lat(text)
    hits = set()
    for kind, key, adm1, rx, is_ar in matchers:
        if rx.search(nar if is_ar else nlat):
            hits.add((kind, key, adm1))
    return hits


_CONFLICT_AR = [normalize_ar(t) for t in CONFLICT_TERMS if any('؀' <= c <= 'ۿ' for c in t)]
_CONFLICT_LAT = [normalize_lat(t) for t in CONFLICT_TERMS if not any('؀' <= c <= 'ۿ' for c in t)]
_CONFLICT_LAT_RX = [re.compile(r'(?<![a-z])' + re.escape(t).replace('\\ ', r'\s+') + r'(?![a-z])')
                    for t in _CONFLICT_LAT]


def is_conflict(text):
    """True if the message carries at least one war/security term."""
    nar = normalize_ar(text)
    if any(t in nar for t in _CONFLICT_AR):
        return True
    nlat = normalize_lat(text)
    return any(rx.search(nlat) for rx in _CONFLICT_LAT_RX)
