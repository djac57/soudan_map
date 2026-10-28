#!/usr/bin/env python3
"""Scrape PUBLIC Telegram web previews (https://t.me/s/<channel>) for the Sudan
OSINT layer. No API, no login, no key: only the public /s/ HTML preview that
Telegram serves to anyone. Polite (serial, delayed). Saves raw HTML pages into
an untrusted raw dir; parsing/aggregation is done separately by build_osint.py.

Usage:
    python3 -I scrape_tme.py <out_raw_dir> <channels_json> \
            [max_pages_per_channel] [window_days]

Each channel -> <out_raw_dir>/<name>/page_000.html, page_001.html, ...
Pagination uses Telegram's own ?before=<message_id> back-link. If window_days is
given, paging stops early once a page's OLDEST message predates the window
cutoff (so deep windows stay cheap and polite: slow channels page back far,
high-volume firehose channels stop at the cap without hammering).
"""
import sys, os, json, re, time, datetime, urllib.request, urllib.error

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36")
POST_ID_RE = re.compile(r'data-post="[^"/]+/(\d+)"')
TIME_RE = re.compile(r'<time[^>]*datetime="([^"]+)"')


def fetch(url, retries=3, backoff=2.0):
    """GET with small retry loop: transient SSL handshake / timeout errors are
    common from sandboxes and otherwise truncate a whole channel (we break on
    the first failed page because pagination needs that page's min id)."""
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Accept-Language": "ar,en;q=0.8",
        "Accept": "text/html",
    })
    last = None
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read().decode("utf-8", "replace")
        except (urllib.error.URLError, OSError) as e:
            last = e
            if attempt < retries - 1:
                time.sleep(backoff * (attempt + 1))
    raise last


def min_post_id(html):
    ids = [int(x) for x in POST_ID_RE.findall(html)]
    return min(ids) if ids else None


def min_date(html):
    ds = [d[:10] for d in TIME_RE.findall(html)]
    return min(ds) if ds else None


def scrape_channel(name, out_dir, max_pages, cutoff=None, delay=1.3):
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
        # window-aware early stop: once this page's oldest message is older than
        # the cutoff, the whole window is already covered -> stop paging.
        if cutoff is not None:
            md = min_date(html)
            if md is not None and md < cutoff:
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
    window_days = int(sys.argv[4]) if len(sys.argv) > 4 else None
    cutoff = None
    if window_days:
        cutoff = (datetime.date.today()
                  - datetime.timedelta(days=window_days)).isoformat()
    os.makedirs(out_dir, exist_ok=True)
    with open(channels_json, encoding="utf-8") as f:
        chans = json.load(f)["channels"]
    print("Scraping %d channels, up to %d pages each%s ..."
          % (len(chans), max_pages,
             (" (stop past %s)" % cutoff) if cutoff else ""))
    total = 0
    for ch in chans:
        total += scrape_channel(ch["name"], out_dir, max_pages, cutoff)
    print("Done. %d pages total in %s" % (total, out_dir))


if __name__ == "__main__":
    main()
