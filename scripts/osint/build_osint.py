#!/usr/bin/env python3
"""Build data/layer_osint.js from scraped Telegram public previews.

Parses raw t.me/s HTML (saved by scrape_tme.py), extracts message text + date,
geolocates place mentions via the bilingual gazetteer, aggregates per LOCALITY /
STATE (count, last_date, split by channel lean saf/rsf/neutral), and writes a JS
file that sets `window.SUDAN.osint`. Nothing nominative; locality granularity
minimum; everything dated; labelled as unverified/indicative OSINT.

Usage:
  python3 -I build_osint.py <raw_osint_dir> <channels_json> <adm1_geojson> \
          <out_js> [window_days]
"""
import sys, os, re, json, html, datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gazetteer as G

POST_RE = re.compile(r'data-post="[^"/]+/(\d+)"')
TEXT_RE = re.compile(r'<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>', re.S)
TIME_RE = re.compile(r'<time[^>]*datetime="([^"]+)"')
TAG_RE = re.compile(r'<[^>]+>')


def clean_text(frag):
    frag = frag.replace('<br/>', ' ').replace('<br>', ' ')
    frag = TAG_RE.sub(' ', frag)
    return html.unescape(re.sub(r'\s+', ' ', frag)).strip()


def iter_messages(page_html):
    """Yield (msg_id, date_str, text) per message bubble in one preview page."""
    positions = [(m.start(), int(m.group(1))) for m in POST_RE.finditer(page_html)]
    for i, (start, mid) in enumerate(positions):
        end = positions[i + 1][0] if i + 1 < len(positions) else len(page_html)
        chunk = page_html[start:end]
        tm = TIME_RE.search(chunk)
        date = tm.group(1)[:10] if tm else None
        texts = [clean_text(t) for t in TEXT_RE.findall(chunk)]
        text = ' \n '.join(t for t in texts if t)
        if text:
            yield mid, date, text


def state_centroids(adm1_path):
    with open(adm1_path, encoding='utf-8') as f:
        gj = json.load(f)
    out = {}
    for feat in gj.get('features', []):
        name = feat.get('properties', {}).get('shapeName')
        if not name:
            continue
        xs, ys = [], []

        def walk(coords):
            if not coords:
                return
            if isinstance(coords[0], (int, float)):
                xs.append(coords[0]); ys.append(coords[1])
            else:
                for c in coords:
                    walk(c)
        walk(feat.get('geometry', {}).get('coordinates'))
        if xs:
            out[name] = (round(sum(xs) / len(xs), 4), round(sum(ys) / len(ys), 4))
    return out


def main():
    if len(sys.argv) < 5:
        sys.stderr.write(__doc__)
        sys.exit(2)
    raw_dir, channels_json, adm1_path, out_js = sys.argv[1:5]
    window_days = int(sys.argv[5]) if len(sys.argv) > 5 else 60

    with open(channels_json, encoding='utf-8') as f:
        chans = json.load(f)['channels']
    lean_of = {c['name']: c['lean'] for c in chans}

    matchers = G.build_matchers()
    centroids = state_centroids(adm1_path)

    today = datetime.date.today()
    cutoff = today - datetime.timedelta(days=window_days)

    # agg[(kind,key)] = {adm1, count, last_date, sides{}, msgs set}
    agg = {}
    n_msgs = n_in_window = n_conflict = n_geoloc = 0
    seen = set()  # (channel, msg_id) dedupe across overlapping pages
    cov = {c['name']: {'in_window': 0, 'conflict': 0, 'mentions': 0,
                       'first': None, 'last': None} for c in chans}

    for ch in chans:
        name = ch['name']
        lean = lean_of.get(name, 'neutral')
        cdir = os.path.join(raw_dir, name)
        if not os.path.isdir(cdir):
            sys.stderr.write("  no raw dir for %s\n" % name)
            continue
        for fn in sorted(os.listdir(cdir)):
            if not fn.endswith('.html'):
                continue
            with open(os.path.join(cdir, fn), encoding='utf-8', errors='replace') as f:
                page = f.read()
            for mid, date, text in iter_messages(page):
                if (name, mid) in seen:
                    continue
                seen.add((name, mid))
                n_msgs += 1
                if not date:
                    continue
                try:
                    d = datetime.date.fromisoformat(date)
                except ValueError:
                    continue
                if d < cutoff or d > today:
                    continue
                n_in_window += 1
                cv = cov[name]
                cv['in_window'] += 1
                if cv['first'] is None or date < cv['first']:
                    cv['first'] = date
                if cv['last'] is None or date > cv['last']:
                    cv['last'] = date
                if not G.is_conflict(text):
                    continue
                n_conflict += 1
                cv['conflict'] += 1
                hits = G.find_places(text, matchers)
                if hits:
                    n_geoloc += 1
                    cv['mentions'] += len(hits)
                for kind, key, adm1 in hits:
                    rec = agg.setdefault((kind, key), {
                        'adm1': adm1, 'count': 0, 'last_date': date,
                        'sides': {'saf': 0, 'rsf': 0, 'neutral': 0}})
                    rec['count'] += 1
                    rec['sides'][lean] += 1
                    if date > rec['last_date']:
                        rec['last_date'] = date

    # coords lookup
    loc_coord = {l[0]: (l[3], l[4], l[1]) for l in G.LOCALITIES}

    points = []
    for (kind, key), rec in agg.items():
        if kind == 'loc':
            lon, lat, place = loc_coord[key]
        else:  # state
            c = centroids.get(key)
            if not c:
                continue
            lon, lat, place = c[0], c[1], key
        points.append({
            'lon': round(lon, 4), 'lat': round(lat, 4),
            'place': place, 'adm1': rec['adm1'],
            'count': rec['count'], 'last_date': rec['last_date'],
            'sides': rec['sides'],
        })
    points.sort(key=lambda p: (-p['count'], p['place']))

    layer = {
        'generated': today.isoformat(),
        'window_days': window_days,
        'window': [cutoff.isoformat(), today.isoformat()],
        'points': points,
        'channels': [{'name': c['name'], 'lean': c['lean'], 'url': c['url'],
                      'label': c.get('label', ''),
                      'coverage': {'days': ([cov[c['name']]['first'], cov[c['name']]['last']]
                                            if cov[c['name']]['first'] else None),
                                   'conflict_msgs': cov[c['name']]['conflict'],
                                   'geo_mentions': cov[c['name']]['mentions']}}
                     for c in chans],
        'counts': {
            'messages_scanned': n_msgs,
            'messages_in_window': n_in_window,
            'messages_conflict': n_conflict,
            'messages_geolocated': n_geoloc,
            'places': len(points),
            'mentions': sum(p['count'] for p in points),
        },
        'note': ("Signalements OSINT NON VERIFIES, purement INDICATIFS. Agreges a partir "
                 "d'apercus web PUBLICS de canaux Telegram (pro-SAF, pro-RSF et neutres) : "
                 "ni API, ni cle, ni login. La geolocalisation est faite par simple "
                 "detection de noms de lieux dans le texte (arabe + latin) : c'est BRUITE "
                 "(homonymes, lieux cites de loin, negations, reprises d'anciens evenements). "
                 "'sides' = repartition par BORD EDITORIAL du canal, pas une verite terrain. "
                 "Granularite minimale = localite/Etat ; aucun contenu nominatif, aucun suivi "
                 "d'unites, aucun camp de deplaces (garde-fou Darfour). A croiser avec UCDP/FIRMS. "
                 "BIAIS DE VOLUME : les comptes 'sides' sont domines par l'ACTIVITE des canaux, "
                 "pas par la realite terrain. Cf. channels[].coverage : canaux de volumes et de "
                 "profondeurs temporelles tres inegaux (un canal de news prolixe type sudaaan "
                 "n'eclaire que quelques jours ; un canal officiel ou regional couvre une plage "
                 "plus large mais plus clairsemee). La fenetre d'agregation a ete allongee pour "
                 "gagner en profondeur, mais chaque canal ne la remplit qu'a hauteur de ses "
                 "propres posts (voir coverage par canal). La presence PRO-RSF publique et "
                 "geolocalisable sur les apercus /s/ est STRUCTURELLEMENT MINCE au-dela du compte "
                 "officiel (la plupart des handles desactivent l'apercu web ou sont inactifs), et "
                 "la presence PRO-SAF active sur Telegram est elle aussi faible (ecosysteme SAF "
                 "surtout Facebook/X/YouTube/TV, cf. IFRI 2026) : l'equilibre affiche des canaux "
                 "ne corrige pas ces biais de plateforme. Lire la PRESENCE/RECENCE par camp et "
                 "par localite, jamais les totaux absolus."),
        'license_note': ("Apercus publics t.me/s/<canal> uniquement (pages servies a tout "
                         "visiteur, sans compte). Aucune rediffusion de contenu ; seuls des "
                         "comptes agreges de mentions de lieux sont conserves. Respect des CGU "
                         "Telegram (consultation publique)."),
        'sources': [{'name': c['name'], 'lean': c['lean'], 'url': c['url']} for c in chans],
    }

    body = json.dumps(layer, ensure_ascii=False, indent=2)
    js = ("/* Auto-generated by scripts/osint/build_osint.py. OSINT Telegram layer.\n"
          " * UNVERIFIED, INDICATIVE signals from PUBLIC t.me/s previews. Do not treat\n"
          " * as ground truth. Balanced pro-SAF / pro-RSF / neutral channel set. */\n"
          "window.SUDAN = window.SUDAN || {};\n"
          "window.SUDAN.osint = " + body + ";\n")
    with open(out_js, 'w', encoding='utf-8') as f:
        f.write(js)

    print("messages scanned=%d in_window=%d conflict=%d geolocated=%d | places=%d mentions=%d"
          % (n_msgs, n_in_window, n_conflict, n_geoloc, len(points),
             layer['counts']['mentions']))
    print("wrote %s" % out_js)


if __name__ == '__main__':
    main()
