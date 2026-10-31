#!/usr/bin/env python3
"""Build the review workbook's data from HLR's pack: every item the page shows, verbatim, with
the file and line it came from, a hash of the exact text (so a decision can be applied only to
the text it was made on), and its provenance in plain words.

Reads the brand home (read only). Writes review-data.json.
Usage: python3 build_review.py [--home <brand home>] [--out review-data.json]"""
import argparse, datetime, hashlib, json, os, re, subprocess, sys

here = os.path.dirname(os.path.abspath(__file__))
ap = argparse.ArgumentParser()
ap.add_argument("--home", default=os.path.normpath(os.path.join(here, "..", "..")))
ap.add_argument("--out", default=os.path.join(here, "review-data.json"))
a = ap.parse_args()
HOME = a.home

SOURCES = {}


def read(rel):
    p = os.path.join(HOME, rel)
    if not os.path.exists(p):
        sys.exit(f"build_review: {rel} is missing under {HOME}")
    b = open(p, "rb").read()
    SOURCES[rel] = hashlib.sha256(b).hexdigest()
    return b.decode("utf-8")


def h(s):
    return hashlib.sha256(s.encode("utf-8")).hexdigest()[:16]


MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def fmt(d):
    y, m, dd = d.split("-")
    return f"{int(dd)} {MONTHS[int(m) - 1]}"


TAG = re.compile(r"\s*\[(documented|observed|derived)([^\]]*)\]")
RAT = re.compile(r"\s*\(ratified (\d{4}-\d{2}-\d{2}) by Eddie, ([^)]*)\)")
DEC = re.compile(r"DECISIONS (\d{4}-\d{2}-\d{2})")


def chip(kind, detail, ratified=None):
    d = (detail or "").strip(" ,;:")
    if ratified:
        return {"k": "ruled", "label": f"Ruled by Eddie, {fmt(ratified[0])}", "detail": f"{ratified[1]}"}
    if kind == "documented":
        m = re.match(r"p(\d+)(?:\s*(?:to|and)\s*p?(\d+))?", d)
        if m:
            return {"k": "book", "label": "Brand book p." + m.group(1) + (f" to {m.group(2)}" if m.group(2) else ""), "detail": d}
        m = DEC.search(d)
        if m:
            return {"k": "ruled", "label": f"Ruled by Eddie, {fmt(m.group(1))}", "detail": d}
        if "footer" in d:
            return {"k": "client", "label": "Your site footer", "detail": d}
        return {"k": "record", "label": "On record", "detail": d}
    if kind == "observed":
        return {"k": "seen", "label": "Seen in your live work", "detail": d}
    return {"k": "proposal", "label": "Our proposal, not yet ruled", "detail": d}


PICK = re.compile(r"Gate 1,? \(?(C[3-8])\b")
PICK_LINK = {"C3": "d.c3", "C4": "d.c4", "C5": "d.c5", "C6": "d.c6", "C8": "d.c8"}


def prov(text):
    out, seen = [], set()
    for m in TAG.finditer(text):
        r = RAT.match(text, m.end())
        detail = m.group(2)
        if m.group(1) == "documented" and not detail.strip() and not r:
            after = re.match(r"\s*book (p\d+(?:\s*(?:to|and)\s*p?\d+)?)", text[m.end():])
            before = re.findall(r"\(?(p\d+)(?:, paraphrased)?\)?", text[max(0, m.start() - 60):m.start()])
            foot = re.match(r"\s*(site footer[^;\]]*)", text[m.end():])
            if after:
                detail = after.group(1)
            elif foot:
                detail = foot.group(1)
            elif before:
                detail = before[-1]
        c = chip(m.group(1), detail, (r.group(1), r.group(2)) if r else None)
        if c["k"] != "ruled" and m.group(1) == "documented":
            tail = text[m.end():m.end() + 40]
            d2 = DEC.match(tail.strip())
            if d2:
                c = {"k": "ruled", "label": f"Ruled by Eddie, {fmt(d2.group(1))}", "detail": tail.strip()}
        if c["label"] not in seen:
            seen.add(c["label"]); out.append(c)
    for r in RAT.finditer(text):
        lab = f"Ruled by Eddie, {fmt(r.group(1))}"
        if lab not in seen:
            seen.add(lab); out.append({"k": "ruled", "label": lab, "detail": r.group(2)})
    for m in PICK.finditer(text):
        lab = f"Eddie's pick ({m.group(1)}), for you to confirm"
        if lab not in seen:
            seen.add(lab); out.append({"k": "pick", "label": lab, "detail": "Gate 1, 2026-10-17", "link": PICK_LINK[m.group(1)]})
    return out


def clean(text):
    t = RAT.sub("", text)
    t = TAG.sub("", t)
    t = t.replace("`", "")
    t = re.sub(r"\s+([,.;:)])", r"\1", t)
    t = re.sub(r"\(\s*\)", "", t)
    t = re.sub(r"\s{2,}", " ", t).strip()
    t = re.sub(r"^[,;:]\s*", "", t)
    t = re.sub(r"^(?:- |\d+\. )", "", t)
    t = re.sub(r"^The book:\s*", "", t)
    t = re.sub(r"^book p\d+(?:\s*(?:to|and)\s*p\d+)?:\s*", "", t)
    return t


def cap(t):
    return t[:1].upper() + t[1:] if t else t


def lines_of(text):
    return text.split("\n")


def block(L, heading):
    """(start, end) line indexes (0-based, end exclusive) of the body under an exact heading line."""
    try:
        i = L.index(heading)
    except ValueError:
        sys.exit(f"build_review: heading not found: {heading!r}")
    level = len(heading) - len(heading.lstrip("#"))
    j = i + 1
    while j < len(L):
        s = L[j]
        if s.startswith("#"):
            lv = len(s) - len(s.lstrip("#"))
            if lv <= level:
                break
        j += 1
    return i + 1, j


def paras(L, s, e):
    return [(i, L[i]) for i in range(s, e) if L[i].strip() and not L[i].startswith(("#", "- ", "|")) and not re.match(r"^\d+\. ", L[i])]


def bullets(L, s, e):
    return [(i, L[i][2:]) for i in range(s, e) if L[i].startswith("- ")]


def numbered(L, s, e):
    out = []
    for i in range(s, e):
        m = re.match(r"^(\d+)\. (.*)$", L[i])
        if m:
            out.append((i, int(m.group(1)), m.group(2)))
    return out


def split_row(row):
    cells = row.strip().strip("|").split("|")
    return [c.strip() for c in cells]


def table(L, s, e, first=0):
    rows = [(i, L[i]) for i in range(s, e) if L[i].startswith("|")]
    out, k = [], 0
    while k < len(rows):
        i, r = rows[k]
        if k + 1 < len(rows) and re.match(r"^\|[-| ]+\|$", rows[k + 1][1]):
            head = split_row(r)
            k += 2
            body = []
            while k < len(rows) and rows[k][0] == rows[k - 1][0] + 1:
                body.append((rows[k][0], split_row(rows[k][1]), rows[k][1]))
                k += 1
            out.append((head, body))
        else:
            k += 1
    return out


items = []


def add(**kw):
    raw = kw["raw"]
    kw.setdefault("prov", prov(raw))
    kw.setdefault("text", clean(raw))
    t, title = kw["text"], kw.get("title", "")
    if title and t.lower().startswith(title.lower() + ":"):
        t = t[len(title) + 1:].strip()
    kw["text"] = cap(t)
    kw.setdefault("review1", False)
    kw.setdefault("links", [])
    kw["sha"] = h(raw)
    items.append(kw)


# ---------- Voice: brand-pack/voice-contract.md ----------
VF = "brand-pack/voice-contract.md"
V = lines_of(read(VF))

s, e = block(V, "## 1. The voice")
p = paras(V, s, e)
add(id="voice.voice", section="voice", group="voice", kind="text", title="The voice", raw=V[p[0][0]], file=VF, line=p[0][0] + 1, decider="hlr", edit="text")
add(id="voice.positioning", section="voice", group="voice", kind="text", title="The positioning it serves", raw=V[p[1][0]], file=VF, line=p[1][0] + 1, decider="hlr", edit="text", review1=True)
add(id="voice.flag", section="voice", group="voice", kind="text", title="Where the live work goes further", raw=V[p[2][0]], file=VF, line=p[2][0] + 1, decider="hlr", edit="text", review1=True, links=["d.c2"])

s, e = block(V, "## 2. Who we talk to, and who is talking")
for n, (i, b) in enumerate(bullets(V, s, e), 1):
    title = ["The reader", "Who she is", "The moments", "The speaker", "The founder's voice"][n - 1] if n <= 5 else f"Point {n}"
    add(id=f"voice.who.{n}", section="voice", group="who", kind="text", title=title, raw=V[i], file=VF, line=i + 1, decider="hlr", edit="text", review1=(n == 5))

QUALS = ["Eloquent", "Refined", "Sensual", "Real", "Uplifting"]
for q in QUALS:
    s, e = block(V, f"### {q}")
    key = q.lower()
    body = [(i, V[i]) for i in range(s, e)]
    book = next(i for i, t in body if t.startswith("The book [documented"))
    opdef = next(i for i, t in body if t.startswith("Operational definition"))
    check = next(i for i, t in body if t.startswith("Check:"))
    sounds = next(i for i, t in body if t.startswith("Sounds like:"))
    notlike = next(i for i, t in body if t.startswith("Not like,"))
    add(id=f"voice.q.{key}.book", section="voice", group=f"q.{key}", kind="text", title="In the book's words", raw=V[book], file=VF, line=book + 1, decider="hlr", edit="text")
    add(id=f"voice.q.{key}.definition", section="voice", group=f"q.{key}", kind="text", title="What it means in practice", raw=V[opdef], file=VF, line=opdef + 1, decider="eddie", edit="text",
        text=clean(re.sub(r"^Operational definition \[documented\] \(ratified [^)]*\):\s*", "", V[opdef])))
    add(id=f"voice.q.{key}.check", section="voice", group=f"q.{key}", kind="check", title="The check every draft gets", raw=V[check], file=VF, line=check + 1, decider="eddie", edit="text",
        text=V[check][len("Check: "):])
    ents, i = [], sounds + 1
    while i < e and V[i].startswith("- "):
        m = re.match(r'^- "(.*)"\s*\[(documented|observed)([^\]]*)\]\s*(.*)$', V[i])
        if not m:
            sys.exit(f"build_review: sounds-like line not parsed: {V[i]!r}")
        where = re.sub(r",?\s*node [0-9:]+", "", m.group(4)).strip(" ,")
        c = chip(m.group(2), m.group(3))
        ents.append({"quote": m.group(1), "src": c["label"] if m.group(2) == "documented" else ("Your " + where if where else c["label"]), "k": c["k"]})
        i += 1
    raw = "\n".join(V[sounds:i])
    add(id=f"voice.q.{key}.sounds", section="voice", group=f"q.{key}", kind="quotes", title="Sounds like", raw=raw, file=VF, line=sounds + 1, decider="hlr", edit="lines", entries=ents, text="")
    ents, i = [], notlike + 1
    while i < e and V[i].startswith("- "):
        m = re.match(r'^- "(.*)"\s*\((.*)\)\s*$', V[i])
        if not m:
            sys.exit(f"build_review: not-like line not parsed: {V[i]!r}")
        ents.append({"quote": m.group(1), "why": m.group(2)})
        i += 1
    raw = "\n".join(V[notlike:i])
    add(id=f"voice.q.{key}.notlike", section="voice", group=f"q.{key}", kind="notlike", title="Not like (our illustrations, not your copy)", raw=raw, file=VF, line=notlike + 1, decider="eddie", edit="lines", entries=ents, text="")

s, e = block(V, "## 4. Operating rules")
for i, n, t in numbered(V, s, e):
    add(id=f"voice.rule.{n}", section="voice", group="rules", kind="text", title=f"Rule {n}", raw=V[i], file=VF, line=i + 1, decider="hlr" if n == 1 else "eddie", edit="text", text=clean(t))

s, e = block(V, "## 5. Devices: seasoning, never required")
p = paras(V, s, e)
add(id="voice.devices", section="voice", group="devices", kind="text", title="The devices the work uses", raw=V[p[0][0]], file=VF, line=p[0][0] + 1, decider="hlr", edit="text")
add(id="voice.devices.rule", section="voice", group="devices", kind="text", title="The rule for devices", raw=V[p[1][0]], file=VF, line=p[1][0] + 1, decider="eddie", edit="text",
    text=clean(re.sub(r"^The rule \[documented\] \(ratified [^)]*\):\s*", "", V[p[1][0]])))

s, e = block(V, "## 6. House conventions")
(head, body), = table(V, s, e)
for i, cells, raw in body:
    slug = re.sub(r"[^a-z0-9]+", "-", cells[0].lower()).strip("-")
    add(id=f"voice.conv.{slug}", section="voice", group="conventions", kind="row", title=cells[0], raw=raw, file=VF, line=i + 1,
        decider="hlr" if cells[0] in ("Brand name", "Offers, prices, dates, codes, thresholds", "Required language", "Emoji", "Hashtags") else "eddie",
        edit="text", text=clean(cells[1]), prov=prov(cells[2]) or prov(raw), review1=cells[0] in ("Brand name", "Offers, prices, dates, codes, thresholds"))

s, e = block(V, "## 7. Social franchises and series")
p = paras(V, s, e)
add(id="voice.franchises.book", section="voice", group="franchises", kind="text", title="The book's franchises", raw=V[p[0][0]], file=VF, line=p[0][0] + 1, decider="hlr", edit="text", review1=True)
add(id="voice.franchises.live", section="voice", group="franchises", kind="text", title="The live series", raw=V[p[1][0]], file=VF, line=p[1][0] + 1, decider="hlr", edit="text", review1=True)

s, e = block(V, "## 8. The brand's own words [documented]")
titles = {"Taglines": "Taglines", "Additional language": "Additional language", "Behaviors": "Behaviors", "Website categories": "Website categories"}
for i, b in bullets(V, s, e):
    k = next((t for t in titles if b.startswith(t)), None)
    if not k:
        continue
    slug = k.split()[0].lower()
    pg = re.search(r"\((p\d+)\)", b)
    add(id=f"voice.words.{slug}", section="voice", group="words", kind="text", title=titles[k], raw=V[i], file=VF, line=i + 1, decider="hlr", edit="text",
        text=re.sub(r"^[A-Za-z ]+\(p\d+\):\s*", "", clean(b)), prov=[chip("documented", pg.group(1) if pg else "")] + prov(b), review1=(k == "Taglines"))

# ---------- Claims: brand-pack/legal-ledger.json ----------
LF = "brand-pack/legal-ledger.json"
LJ = json.loads(read(LF))
SEV = {"needs_legal": "blocks", "conditional": "confirm", "info": "listed"}
for n, r in enumerate(LJ["entries"]):
    raw = json.dumps(r, ensure_ascii=False, sort_keys=True)
    add(id=f"claims.{r['id']}", section="claims", group=SEV[r["severity"]], kind="claim", title=r["title"], raw=raw, file=LF, line=None, path=f"entries[{n}]",
        decider="signer" if r["severity"] == "needs_legal" else "hlr", edit="claim", text="", prov=prov(r.get("evidence", "")),
        claim={"code": r["id"], "topic": r["topic"], "severity": r["severity"], "words": r.get("lemmas", []), "patterns": len(r.get("triggers", [])),
               "requires": r["requires"], "ruling": r.get("ruling"), "evidence": clean(r.get("evidence", "")), "note": clean(r.get("note", "")) if r.get("note") else "",
               "required_language": r.get("required_language")},
        review1=r["severity"] != "info" or r["id"] == "HLR-REQ-01")
claims_meta = {"status": LJ["_status"], "version": LJ["version"], "signer": LJ["signer"]}

# ---------- Never say: brand-pack/brand-context.md, Prohibited language ----------
BF = "brand-pack/brand-context.md"
B = lines_of(read(BF))
s, e = block(B, "## Prohibited language")
(head, body), = table(B, s, e)
for i, cells, raw in body:
    add(id=f"never.{cells[0]}", section="never", group="patterns", kind="never", title=clean(cells[1]), raw=raw, file=BF, line=i + 1, decider="eddie",
        edit="text", text=clean(cells[2]), prov=prov(cells[3]) or prov(raw))
kept = next(i for i in range(s, e) if B[i].startswith("Kept out on purpose"))
add(id="never.keptout", section="never", group="patterns", kind="text", title="Kept out on purpose", raw=B[kept], file=BF, line=kept + 1, decider="eddie", edit="text")

# ---------- Colour: tokens.json and token-model.md ----------
TF = "brand-pack/tokens.json"
TJ = json.loads(read(TF))
for name, t in TJ["color"]["brand"].items():
    ext = t.get("$extensions", {}).get("com.hlr", {})
    raw = json.dumps({"$value": t["$value"], "$description": t["$description"]}, ensure_ascii=False)
    add(id=f"color.brand.{name}", section="color", group="brand", kind="color", title=name.replace("-", " ").title(), raw=raw, file=TF, line=None, path=f"color.brand.{name}",
        decider="hlr", edit="hex", text=clean(t["$description"]), prov=prov(t["$description"]), hex=t["$value"], cmyk=ext.get("cmyk"), pantone=ext.get("pantone"),
        review1=name == "sea-salt")
w = TJ["color"]["extended"]["white"]
add(id="color.white", section="color", group="brand", kind="color", title="White", raw=json.dumps({"$value": w["$value"], "$description": w["$description"]}, ensure_ascii=False),
    file=TF, line=None, path="color.extended.white", decider="hlr", edit="hex", text=clean(w["$description"]), prov=prov(w["$description"]), hex=w["$value"])
ramp = [(k, v["$value"]) for k, v in TJ["color"]["extended"].items() if k.startswith("neutral-")]
n1 = TJ["color"]["extended"]["neutral-100"]
add(id="color.neutrals", section="color", group="brand", kind="ramp", title="Warm neutrals", raw=json.dumps(dict(ramp)), file=TF, line=None, path="color.extended.neutral-*",
    decider="eddie", edit="text", text=clean(n1["$description"]), prov=prov(n1["$description"]), ramp=[{"name": k, "hex": v} for k, v in ramp])

MF = "brand-pack/token-model.md"
M = lines_of(read(MF))
s, e = block(M, "## 2. The contrast law")
p = paras(M, s, e)
add(id="color.floors", section="color", group="law", kind="text", title="The contrast floors", raw=M[p[0][0]], file=MF, line=p[0][0] + 1, decider="eddie", edit="text")
tabs = table(M, s, e)
head, body = tabs[0]
GROUND_MODE = {"Alabaster, the default": "light", "Fawn, alternate": "warm", "Forest, alternate": "deep", "Onyx, alternate": "night"}
GHEX = {"Alabaster": "#fbf7ef", "White": "#ffffff", "neutral-100": "#ece8e3", "neutral-200": "#dcd8d4", "Fawn": "#beada3", "Forest": "#17280a", "Onyx": "#353535", "Sea Salt": "#e0e3e5"}
IHEX = {"Onyx": "#353535", "Alabaster": "#fbf7ef", "white": "#ffffff"}
law_prov = prov(M[p[0][0]])
for i, cells, raw in body:
    g = cells[0]
    gname = g.split(",")[0]
    slug = re.sub(r"[^a-z0-9]+", "-", gname.lower()).strip("-")
    add(id=f"color.ground.{slug}", section="color", group="grounds", kind="ground", title=g, raw=raw, file=MF, line=i + 1, decider="eddie" if g not in ("Sea Salt",) else "hlr",
        edit="text", text="", prov=law_prov, ground={"name": g, "hex": GHEX.get(gname), "ink": cells[1], "ink_hex": IHEX.get(cells[1]), "ratio": cells[2], "body": cells[3], "display": cells[4],
                                                      "accent": cells[5], "mode": GROUND_MODE.get(g)})
for i, n, t in numbered(M, s, e):
    add(id=f"color.law.{n}", section="color", group="law", kind="text", title=f"Law {n}", raw=M[i], file=MF, line=i + 1, decider="eddie", edit="text", text=clean(t))
names = next(i for i in range(s, e) if M[i].startswith("Values for the alternate ground modes"))
add(id="color.modes", section="color", group="grounds", kind="text", title="The ground names", raw=M[names], file=MF, line=names + 1, decider="eddie", edit="text")

# ---------- Type: art-direction.md section 2, token-model.md sections 3 and 4 ----------
AF = "brand-pack/art-direction.md"
A = lines_of(read(AF))
for name, t in TJ["font"]["family"].items():
    raw = json.dumps({"$value": t["$value"], "$description": t["$description"]}, ensure_ascii=False)
    add(id=f"type.face.{name}", section="type", group="faces", kind="face", title=t["$value"], raw=raw, file=TF, line=None, path=f"font.family.{name}", decider="hlr", edit="text",
        text=clean(t["$description"]), prov=prov(t["$description"]), role=name, review1=True)
s, e = block(A, "### 2. Type behaviour")
(head, body), = table(A, s, e)
SPEC = {"display (s to xl)": "display", "headline": "headline", "accent word": "headline", "quote": "quote", "title, product name": "title", "price, numerals": "price",
        "link (secondary CTA)": "link", "body": "body", "eyebrow": "eyebrow", "label, small headline": "label", "CTA label": "cta", "fine print, handle": "fine", "script": "script"}
for i, cells, raw in body:
    slug = re.sub(r"[^a-z0-9]+", "-", cells[0].lower()).strip("-")
    add(id=f"type.role.{slug}", section="type", group="roles", kind="typerole", title=cells[0], raw=raw, file=AF, line=i + 1, decider="eddie", edit="fields", text="",
        prov=prov(raw), fields={"face": clean(cells[1]), "case": clean(cells[2]), "leading": clean(cells[3]), "where": clean(cells[4])}, specimen=SPEC.get(cells[0]))
for i, b in bullets(A, s, e):
    t = "The scale" if b.startswith("Scale") else "Size floors"
    add(id=f"type.{'scale' if t == 'The scale' else 'floors'}", section="type", group="scale", kind="text", title=t, raw=A[i], file=AF, line=i + 1, decider="eddie", edit="text", text=clean(b))
s, e = block(M, "## 3. Type: ramp and text style roster")
tabs = table(M, s, e)
head, body = tabs[0]
add(id="type.ramp", section="type", group="scale", kind="table", title="The size ramp", raw="\n".join(r for _, _, r in body), file=MF, line=body[0][0] + 1, decider="eddie", edit="text",
    text="", prov=prov(M[s + 1]), table={"head": head, "rows": [c for _, c, _ in body]})
acc = next(i for i in range(s, e) if M[i].startswith("- The italic accent word"))
add(id="type.accent", section="type", group="roles", kind="text", title="The italic accent word", raw=M[acc], file=MF, line=acc + 1, decider="eddie", edit="text", text=clean(M[acc][2:]), review1=True, links=["d.t6"])
s, e = block(M, "## 4. Licensing flags (project rule 8)")
(head, body), = table(M, s, e)
for i, cells, raw in body:
    slug = re.sub(r"[^a-z0-9]+", "-", cells[0].split("(")[0].lower()).strip("-")
    add(id=f"type.license.{slug}", section="type", group="licenses", kind="row", title=clean(cells[0]), raw=raw, file=MF, line=i + 1, decider="hlr", edit="text",
        text=f"{clean(cells[2])}. State: {clean(cells[3])}.", prov=[], review1=("owner HLR" in cells[3]), links=["d.licenses"])

# ---------- Marks: logo-assets.md ----------
GF = "brand-pack/logo-assets.md"
G = lines_of(read(GF))
s, e = block(G, "## Current roster (Gate 1 C3)")
(head, body), = table(G, s, e)
IMG = {"Wordmark": "wordmark.svg", "Monogram, HLR": "monogram.svg", "Monogram with": "monogram-star.png", "Star": "star.png", "Crest": "crest.png", "Shell": "shell.png", "Stacked": "stacked.png"}
for i, cells, raw in body:
    img = next((v for k, v in IMG.items() if cells[0].startswith(k)), None)
    slug = re.sub(r"[^a-z0-9]+", "-", cells[0].split(",")[0].lower()).strip("-")
    add(id=f"marks.{slug}", section="marks", group="roster", kind="mark", title=cells[0], raw=raw, file=GF, line=i + 1, decider="hlr", edit="fields", text="",
        prov=[{"k": "pick", "label": "Eddie's pick (C3), for you to confirm", "detail": "Gate 1, 2026-10-17", "link": "d.c3"}],
        fields={"role": clean(cells[1]), "state": clean(cells[4])}, image=img, review1=True, links=["d.c3"])
s, e = block(G, "## Rules")
for i, n, t in numbered(G, s, e):
    add(id=f"marks.rule.{n}", section="marks", group="rules", kind="text", title=f"Rule {n}", raw=G[i], file=GF, line=i + 1, decider="eddie" if n != 6 else "hlr", edit="text", text=clean(t),
        review1=(n == 6))

# ---------- Art direction: art-direction.md ----------
s, e = block(A, "## The grammar")
g0 = next(i for i in range(s, e) if A[i].startswith("[observed] HLR's work leads"))
add(id="art.grammar", section="art", group="grammar", kind="text", title="The grammar", raw=A[g0], file=AF, line=g0 + 1, decider="hlr", edit="text")
s, e = block(A, "### 1. Grounds and pairings")
for n, (i, b) in enumerate(bullets(A, s, e), 1):
    add(id=f"art.grounds.{n}", section="art", group="grounds", kind="text", title=clean(b.split(":")[0]) if ":" in b[:40] else f"Grounds {n}", raw=A[i], file=AF, line=i + 1, decider="hlr" if n <= 3 else "eddie",
        edit="text", text=clean(b.split(":", 1)[1]) if ":" in b[:40] else clean(b), prov=prov(b), links=["d.c4"] if n <= 3 else [])
s, e = block(A, "### 3. Signature devices")
for i, n, t in numbered(A, s, e):
    add(id=f"art.device.{n}", section="art", group="devices", kind="text", title=clean(t.split(":")[0].split(".")[0]), raw=A[i], file=AF, line=i + 1, decider="eddie", edit="text", text=clean(t))
ps = next(i for i in range(s, e) if A[i].startswith("Per surface"))
add(id="art.device.persurface", section="art", group="devices", kind="text", title="Per surface", raw=A[ps], file=AF, line=ps + 1, decider="eddie", edit="text",
    text=clean(re.sub(r"^Per surface \[documented\] \(ratified [^)]*\):\s*", "", A[ps])))
s, e = block(A, "### 4. Photography")
(head, body), = table(A, s, e)
for i, cells, raw in body:
    code = cells[0].split()[0]
    pg = re.search(r"\((p\d+)\)", cells[0])
    add(id=f"art.photo.{code.lower()}", section="art", group="photo", kind="photocard", title=clean(cells[0]), raw=raw, file=AF, line=i + 1, decider="hlr", edit="fields", text="",
        prov=[chip("documented", pg.group(1) if pg else ""), chip("observed", "live use")],
        fields={"light": clean(cells[1]), "colour": clean(cells[2]), "styling": clean(cells[3]), "live": clean(cells[4])})
for n, (i, b) in enumerate(bullets(A, s, e), 1):
    nm, rest = b.split(":", 1)
    add(id=f"art.family.{n}", section="art", group="families", kind="text", title=clean(nm), raw=A[i], file=AF, line=i + 1, decider="hlr", edit="text", text=clean(rest), review1=True)
pp = next(i for i in range(s, e) if A[i].startswith("People appear in HLR imagery"))
add(id="art.people", section="art", group="families", kind="text", title="People and image rights", raw=A[pp], file=AF, line=pp + 1, decider="hlr", edit="text", review1=True, links=["d.faces"])
s, e = block(A, "### 6. What never happens")
for n, (i, b) in enumerate(bullets(A, s, e), 1):
    add(id=f"art.never.{n}", section="art", group="never", kind="text", title="", raw=A[i], file=AF, line=i + 1, decider="eddie", edit="text", text=clean(b))

# ---------- What the forge makes: type-registry-core.json ----------
RF = "brand-pack/type-registry-core.json"
RJ = json.loads(read(RF))
for k, v in RJ["types"].items():
    raw = json.dumps({"label": v.get("label"), "content": v.get("content"), "status": v.get("status")}, ensure_ascii=False)
    add(id=f"makes.email.{k}", section="makes", group="email", kind="registry", title=v["label"], raw=raw, file=RF, line=None, path=f"types.{k}", decider="hlr", edit="text",
        text=clean(v.get("content") or ""), prov=[])
for k, v in RJ["channels"]["social"]["types"].items():
    raw = json.dumps({"label": v.get("label"), "content": v.get("content"), "formats": v.get("formats")}, ensure_ascii=False)
    add(id=f"makes.social.{k}", section="makes", group="social", kind="registry", title=v["label"], raw=raw, file=RF, line=None, path=f"channels.social.types.{k}", decider="hlr", edit="text",
        text=clean(v.get("content") or ""), prov=[], formats=[f.replace("_", " ") for f in v.get("formats", [])])
for k, v in RJ["channels"]["social"]["series"].items():
    if k.startswith("_"):
        continue
    raw = json.dumps({"label": v.get("label"), "cadence": v.get("cadence"), "content": v.get("content")}, ensure_ascii=False)
    add(id=f"makes.series.{k}", section="makes", group="series", kind="registry", title=v["label"], raw=raw, file=RF, line=None, path=f"channels.social.series.{k}", decider="hlr", edit="text",
        text=clean(v.get("content") or ""), prov=[], cadence=v.get("cadence"), review1=True, links=["d.series"])

# ---------- Stamp ----------
def git(*args):
    try:
        return subprocess.run(["git", "-C", HOME, *args], capture_output=True, text=True, timeout=20).stdout.strip()
    except Exception:
        return ""

ids = [it["id"] for it in items]
dup = {x for x in ids if ids.count(x) > 1}
if dup:
    sys.exit(f"build_review: duplicate ids {sorted(dup)}")
for it in items:
    if not re.fullmatch(r"[A-Za-z0-9_.\-]+", it["id"]):
        sys.exit(f"build_review: id breaks the db path grammar: {it['id']}")

commit = git("rev-parse", "HEAD")
dirty = [l[3:] for l in git("status", "--porcelain").splitlines() if l[3:] in SOURCES]
data = {
    "stamp": {"built_at": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), "brand_home_commit": commit or None,
              "local_changes": dirty, "sources": SOURCES, "build": h(json.dumps(SOURCES, sort_keys=True))},
    "claims_meta": claims_meta,
    "items": items,
}
json.dump(data, open(a.out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
by = {}
for it in items:
    by[it["section"]] = by.get(it["section"], 0) + 1
print(f"wrote {a.out}: {len(items)} items {by}; build {data['stamp']['build']}; commit {commit[:8] if commit else 'none'}; local changes {dirty}")
