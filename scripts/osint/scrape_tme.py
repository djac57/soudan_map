#!/usr/bin/env python3
"""Scrape PUBLIC Telegram web previews (https://t.me/s/<channel>) for the Sudan
OSINT layer. No API, no login, no key: only the public /s/ HTML preview that
Telegram serves to anyone. Polite (serial, delayed). Saves raw HTML pages into
an untrusted raw dir; parsing/aggregation is done separately by build_osint.py.

Usage:
    python3 -I scrape_tme.py <out_raw_dir> <channels_json> [max_pages_per_channel]

Each channel -> <out_raw_dir>/<name>/page_000.html, page_001.html, ...
Pagination uses Telegram's own ?before=<message_id> back-link.
"""
import sys, os, json, re, time, urllib.request, urllib.error

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36")
POST_ID_RE = re.compile(r'data-post="[^"/]+/(\d+)"')


def fetch(url):
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Accept-Language": "ar,en;q=0.8",
        "Accept": "text/html",
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def min_post_id(html):
    ids = [int(x) for x in POST_ID_RE.findall(html)]
    return min(ids) if ids else None


def scrape_channel(name, out_dir, max_pages, delay=1.3):
    cdir = os.path.join(out_dir, name)
    os.makedirs(cdir, exist_ok=True)
    before = None
    saved = 0
    seen_min = None
    for page in range(max_pages):
        url = "https://t.me/s/%s" % name
        if before:
            url += "?before=%d" % before
        try:
            html = fetch(url)
        except (urllib.error.URLError, urllib.error.HTTPError, OSError) as e:
            sys.stderr.write("  [%s] page %d fetch error: %s\n" % (name, page, e))
            break
        mn = min_post_id(html)
        if mn is None:
            sys.stderr.write("  [%s] page %d: no messages (preview empty)\n" % (name, page))
            if page == 0:
                with open(os.path.join(cdir, "page_%03d.html" % page), "w",
                          encoding="utf-8") as f:
                    f.write(html)
            break
        with open(os.path.join(cdir, "page_%03d.html" % page), "w",
                  encoding="utf-8") as f:
            f.write(html)
        saved += 1
        if seen_min is not None and mn >= seen_min:
            # no older messages were loaded -> reached the start of the channel
            break
        seen_min = mn
        before = mn
        time.sleep(delay)
    print("  [%s] saved %d page(s)" % (name, saved))
    return saved


def main():
    if len(sys.argv) < 3:
        sys.stderr.write(__doc__)
        sys.exit(2)
    out_dir = sys.argv[1]
    channels_json = sys.argv[2]
    max_pages = int(sys.argv[3]) if len(sys.argv) > 3 else 6
    os.makedirs(out_dir, exist_ok=True)
    with open(channels_json, encoding="utf-8") as f:
        chans = json.load(f)["channels"]
    print("Scraping %d channels, up to %d pages each ..." % (len(chans), max_pages))
    total = 0
    for ch in chans:
        total += scrape_channel(ch["name"], out_dir, max_pages)
    print("Done. %d pages total in %s" % (total, out_dir))


if __name__ == "__main__":
    main()
