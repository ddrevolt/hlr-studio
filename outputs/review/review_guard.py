#!/usr/bin/env python3
"""Checks for the review workbook. Fails (exit 1) on:
- a fact whose quote is not verbatim in its source file under the brand home;
- review-data.json out of step with the pack (rebuilt here and compared item by item);
- a decision or item that points at an id that does not exist;
- an em dash (U+2014, or its HTML or JS escapes) in our content, the data or the built page;
- a term from the release-check census list (with --census-terms) in our content, our data, our
  source files or the page's markup and styles (library code in the bundle is not scanned);
- an asset manifest whose specimen text is not verbatim in its named source, or (with --assets-home)
  whose font or mark hashes do not match HLR's files.
Usage: python3 review_guard.py [--home <brand home>] [--page review.html] [--census-terms <terms.txt>]
                               [--assets <assets dir>] [--assets-home <brand home with fonts and marks>]"""
import argparse, hashlib, json, os, re, subprocess, sys, tempfile

here = os.path.dirname(os.path.abspath(__file__))
ap = argparse.ArgumentParser()
ap.add_argument("--home", default=os.path.normpath(os.path.join(here, "..", "..")))
ap.add_argument("--content", default=os.path.join(here, "content.json"))
ap.add_argument("--data", default=os.path.join(here, "review-data.json"))
ap.add_argument("--page", default=None)
ap.add_argument("--census-terms", default=None)
ap.add_argument("--extra-term", action="append", default=[])
ap.add_argument("--assets", default=os.path.join(here, "assets"))
ap.add_argument("--assets-home", default=None)
a = ap.parse_args()

EM = chr(0x2014)
fails = []


def fail(msg):
    fails.append(msg)


def src(rel):
    p = os.path.join(a.home, rel)
    if not os.path.exists(p):
        fail(f"source missing: {rel}")
        return None
    return open(p, encoding="utf-8").read()


def em_count(t):
    n = t.count(EM)
    n += len(re.findall(r"&mdash;|&#8212;|&#x2014;", t, re.I))
    for m in re.finditer(r"(\\+)(u2014|u\{2014\})", t, re.I):
        if len(m.group(1)) % 2 == 1:
            n += 1
    return n


C = json.load(open(a.content, encoding="utf-8"))
D = json.load(open(a.data, encoding="utf-8"))

# 1. facts are verbatim
facts = []
for d in C["decisions"]:
    facts += [("decision " + d["id"], x) for x in d.get("facts", [])]
for s in C["sections"]:
    facts += [("section " + s["id"], x) for x in s.get("facts", [])]
    for g in s.get("groups", []):
        facts += [("group " + s["id"] + "/" + g["id"], x) for x in g.get("facts", [])]
cache = {}
for where, x in facts:
    t = cache.get(x["source"]) if x["source"] in cache else cache.setdefault(x["source"], src(x["source"]))
    if t is None:
        continue
    q = x["quote"]
    if q not in t and q not in t.replace('\\"', '"'):
        fail(f"{where}: quote not verbatim in {x['source']}: {q[:90]!r}")
print(f"facts: {len(facts)} checked")

# 2. the data matches the pack as it stands
with tempfile.TemporaryDirectory() as t:
    out = os.path.join(t, "d.json")
    r = subprocess.run([sys.executable, os.path.join(here, "build_review.py"), "--home", a.home, "--out", out], capture_output=True, text=True)
    if r.returncode != 0:
        fail("build_review.py failed: " + (r.stderr or r.stdout)[-400:])
    else:
        D2 = json.load(open(out, encoding="utf-8"))
        old = {i["id"]: i["sha"] for i in D["items"]}
        new = {i["id"]: i["sha"] for i in D2["items"]}
        for k in sorted(set(old) | set(new)):
            if old.get(k) != new.get(k):
                fail(f"item {k}: the shipped data differs from the pack now ({old.get(k)} against {new.get(k)})")
        if D["stamp"]["sources"] != D2["stamp"]["sources"]:
            fail("stamp: a source file changed since review-data.json was built")
print(f"items: {len(D['items'])} compared with a fresh build")

# 2b. raw text of markdown items is verbatim in its file
for i in D["items"]:
    if i.get("line") and i["file"].endswith(".md"):
        t = cache.get(i["file"]) if i["file"] in cache else cache.setdefault(i["file"], src(i["file"]))
        if t is not None and i["raw"] not in t:
            fail(f"item {i['id']}: raw text not verbatim in {i['file']}")

# 3. references
ids = {i["id"] for i in D["items"]}
dids = {d["id"] for d in C["decisions"]}
for d in C["decisions"]:
    for x in d.get("items", []):
        if x not in ids:
            fail(f"decision {d['id']}: unknown item {x}")
    for fld in d.get("fields", []):
        if fld["type"] in ("radio", "checks") and not fld.get("options"):
            fail(f"decision {d['id']}: field {fld['id']} has no options")
for i in D["items"]:
    for l in i.get("links", []):
        if l not in dids:
            fail(f"item {i['id']}: links to unknown decision {l}")
    for c in i.get("prov", []):
        if c.get("link") and c["link"] not in dids:
            fail(f"item {i['id']}: chip links to unknown decision {c['link']}")
secs = {s["id"] for s in C["sections"]}
for i in D["items"]:
    if i["section"] not in secs:
        fail(f"item {i['id']}: section {i['section']} has no page section")
    groups = {g["id"] for s in C["sections"] if s["id"] == i["section"] for g in s.get("groups", [])}
    if i["group"] not in groups:
        fail(f"item {i['id']}: group {i['group']} is not declared in section {i['section']}")

# 4. em dashes
ctext = open(a.content, encoding="utf-8").read()
if em_count(ctext):
    fail(f"content.json: {em_count(ctext)} em dash(es)")
dtext = json.dumps([{k: v for k, v in i.items() if k != "raw"} for i in D["items"]], ensure_ascii=False)
if em_count(dtext):
    fail(f"review-data.json: {em_count(dtext)} em dash(es) in shown text")
page = open(a.page, encoding="utf-8").read() if a.page else ""
if a.page and em_count(page):
    fail(f"{a.page}: {em_count(page)} em dash(es)")

# 5. census terms
terms = list(a.extra_term)
if a.census_terms:
    for line in open(a.census_terms, encoding="utf-8"):
        line = line.strip()
        if line and not line.startswith("#"):
            terms.append(line)
def page_text(html):
    """The page's markup and styles, without its scripts and embedded images. The words in the
    scripts come from content.json, review-data.json and our own source files, which are scanned
    whole below; the rest of the bundle is library code, whose generated names can match a short
    term by chance (census.py reports those; see the README)."""
    html = re.sub(r"data:[a-z/+.-]+;base64,[A-Za-z0-9+/=]+", " ", html)
    return re.sub(r"<script[^>]*>.*?</script>", " ", html, flags=re.S)


def our_sources():
    out = []
    app = os.path.join(here, "app")
    for root, dirs, files in os.walk(os.path.join(app, "src")):
        dirs[:] = [d for d in dirs if d != "data"]
        for f in files:
            if f.endswith((".ts", ".tsx", ".css", ".html")):
                out.append((os.path.relpath(os.path.join(root, f), here), open(os.path.join(root, f), encoding="utf-8").read()))
    ih = os.path.join(app, "index.html")
    if os.path.exists(ih):
        out.append(("app/index.html", open(ih, encoding="utf-8").read()))
    return out


ptext = page_text(page) if page else ""
srcs = our_sources()
for name, text in srcs:
    if em_count(text):
        fail(f"{name}: {em_count(text)} em dash(es)")
for term in terms:
    rx = re.compile(r"(?<![A-Za-z0-9])" + re.escape(term) + r"(?![A-Za-z0-9])", re.I)
    for name, text in (("content.json", ctext), ("review-data.json", dtext), (a.page or "", ptext), *srcs):
        if text and rx.search(text):
            fail(f"{name}: census term found")
print(f"census: {len(terms)} terms checked")

# 6. assets
mf = os.path.join(a.assets, "manifest.json")
if os.path.exists(mf):
    M = json.load(open(mf, encoding="utf-8"))
    for s in M["specimens"]:
        if s.get("text_source"):
            t = cache.get(s["text_source"]) if s["text_source"] in cache else cache.setdefault(s["text_source"], src(s["text_source"]))
            txt = s["text"]
            if t is not None and not (txt in t or txt.lower() in t.lower() or txt.strip("“”") in t):
                fail(f"specimen {s['style']}: text not verbatim in {s['text_source']}")
        if not os.path.exists(os.path.join(a.assets, s["file"])):
            fail(f"specimen file missing: {s['file']}")
    if a.assets_home:
        for k, v in M["fonts"].items():
            p = os.path.join(a.assets_home, v["file"])
            if not os.path.exists(p) or hashlib.sha256(open(p, "rb").read()).hexdigest() != v["sha256"]:
                fail(f"font {k}: file changed or missing since the specimens were rendered")
        for m in M["marks"]:
            p = os.path.join(a.assets_home, m["source"])
            if not os.path.exists(p) or hashlib.sha256(open(p, "rb").read()).hexdigest() != m["sha256"]:
                fail(f"mark {m['file']}: source changed or missing since it was copied")
    print(f"assets: {len(M['specimens'])} specimens, {len(M['marks'])} marks")
else:
    fail("assets/manifest.json missing")

for x in fails:
    print("FAIL", x)
print("PASS" if not fails else f"{len(fails)} failure(s)")
sys.exit(1 if fails else 0)
