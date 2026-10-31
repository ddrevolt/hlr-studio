#!/usr/bin/env python3
"""Drift guard for the HLR forge explainer.

Fails (exit 1) when the page could say something the pack no longer says:
  1. a quoted fact is missing from its source (brand home files, or the engine with --engine);
  2. a source file changed since explainer-data.json was built (rebuild the data);
  3. an em dash appears in the content, the data, the verdicts or a built page;
  4. our prose states a product figure (a price, a karat, a size) outside a verified quote;
  5. a fact quotes _setup/ (it names other brands and never leaves Eddie's machine);
  6. a reference is broken: a stage, scenario or quiz names a card that does not exist,
     a non-null File map role has no card, or a {value} has no path in the data;
  7. an external source has no checked date.
With --census-terms <terms.txt> it also runs the other-brand census over the given files
(whole words, case-insensitive). The terms never enter the brand folder: pass the file in from
claude-cowork/_tools/release-checks/. --extra-term exists for the guard's own tests.

Usage:
  python3 guards/explainer_drift.py [--home <brand home>] [--engine <engine folder>]
      [--census-terms <file>] [--extra-term <term>] [--page <built html>]...
"""
import argparse, hashlib, json, os, re, sys

EM_DASH = chr(0x2014)
here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(here)  # outputs/explainer
ap = argparse.ArgumentParser()
ap.add_argument("--home", default=os.path.normpath(os.path.join(root, "..", "..")))
ap.add_argument("--engine", default=None)
ap.add_argument("--content", default=os.path.join(root, "content.json"))
ap.add_argument("--data", default=os.path.join(root, "explainer-data.json"))
ap.add_argument("--verdicts", default=os.path.join(root, "examples-verified.json"))
ap.add_argument("--page", action="append", default=[])
ap.add_argument("--census-terms", default=None)
ap.add_argument("--extra-term", action="append", default=[])
a = ap.parse_args()

fails, warns = [], []


def norm(s):
    return re.sub(r"\s+", " ", s).strip()


def strings_in(obj, out):
    if isinstance(obj, str):
        out.append(obj)
    elif isinstance(obj, dict):
        for v in obj.values():
            strings_in(v, out)
    elif isinstance(obj, list):
        for v in obj:
            strings_in(v, out)
    return out


_cache = {}


def haystacks(path):
    """The normalized raw text of a file plus every decoded string value (JSON, YAML)."""
    if path in _cache:
        return _cache[path]
    with open(path, encoding="utf-8") as f:
        raw = f.read()
    hay = [norm(raw)]
    try:
        if path.endswith(".json"):
            hay += [norm(s) for s in strings_in(json.loads(raw), [])]
        elif path.endswith((".yaml", ".yml")):
            import yaml
            hay += [norm(s) for s in strings_in(yaml.safe_load(raw), [])]
    except Exception as e:  # a parse failure still leaves the raw text
        warns.append(f"could not parse {path}: {e}")
    _cache[path] = hay
    return hay


def load(path, what):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        fails.append(f"{what}: cannot read {path}: {e}")
        return None


content = load(a.content, "content")
data = load(a.data, "data")
verdicts = load(a.verdicts, "verdicts") if os.path.exists(a.verdicts) else None
if content is None or data is None:
    print("\n".join("FAIL " + f for f in fails))
    sys.exit(1)

# ---------------------------------------------------------------- 1, 5, 7: facts
facts = []


def collect(obj, where):
    if isinstance(obj, dict):
        if "source" in obj and ("quote" in obj or "checked" in obj or str(obj.get("source", "")).startswith("http")):
            facts.append((where, obj))
        for k, v in obj.items():
            collect(v, f"{where}.{k}")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            collect(v, f"{where}[{i}]")


collect(content, "content")
checked_quotes = set()
external = 0
for where, f in facts:
    src = str(f.get("source"))
    quote = f.get("quote")
    if src.startswith("http"):
        external += 1
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(f.get("checked", ""))):
            fails.append(f"{where}: external source {src} has no checked date (YYYY-MM-DD)")
        if quote:
            checked_quotes.add(norm(quote))
        continue
    if src.startswith("_setup/"):
        fails.append(f"{where}: quotes _setup/ ({src}); it names other brands and never leaves Eddie's machine")
        continue
    if not quote:
        fails.append(f"{where}: source {src} without a quote")
        continue
    if src.startswith("engine:"):
        if not a.engine:
            warns.append(f"{where}: engine source {src} not verified (no --engine given)")
            checked_quotes.add(norm(quote))
            continue
        path = os.path.join(a.engine, src[len("engine:"):])
    else:
        path = os.path.join(a.home, src.split("#", 1)[0])
    if not os.path.exists(path):
        fails.append(f"{where}: source missing: {src}")
        continue
    q = norm(quote)
    if not any(q in h for h in haystacks(path)):
        fails.append(f"{where}: quote not found in {src}: {quote[:90]!r}")
    else:
        checked_quotes.add(q)

# ---------------------------------------------------------------- 2: stamp
stamp = data.get("stamp", {})
for relp, sha in (stamp.get("sources") or {}).items():
    p = os.path.join(a.home, relp)
    if not os.path.exists(p):
        fails.append(f"stale: {relp} is in the stamp but missing now; rebuild the data")
        continue
    with open(p, encoding="utf-8") as fh:
        now = hashlib.sha256(fh.read().encode("utf-8")).hexdigest()
    if now != sha:
        fails.append(f"stale: {relp} changed since the data was built; run build_data.py")

# ---------------------------------------------------------------- 3: em dashes
texts = {"content.json": json.dumps(content, ensure_ascii=False), "explainer-data.json": json.dumps(data, ensure_ascii=False)}
if verdicts is not None:
    texts["examples-verified.json"] = json.dumps(verdicts, ensure_ascii=False)
for pg in a.page:
    with open(pg, encoding="utf-8") as fh:
        html = fh.read()
    # library code may carry the character in its own strings; the page's words are the content and data above
    texts[os.path.basename(pg) + " (visible text)"] = re.sub(r"<script\b.*?</script>|<style\b.*?</style>", " ", html, flags=re.S)
for name, t in texts.items():
    n = t.count(EM_DASH) + t.count("\\u2014")
    if name == "explainer-data.json":
        n = t.count(EM_DASH)  # the prohibited pattern itself is stored as the escape text —
    if n:
        fails.append(f"em dash: {n} in {name}")

# ---------------------------------------------------------------- 4: figures in our prose
FIG = [r"\$\s?\d", r"\bUSD\s?\d", r"\b(9|10|14|18|22|24)\s?(k|kt|K|KT)\b", r"\b\d+(\.\d+)?\s?(mm|cm|inch|inches|oz)\b", r"\bkarat\s+\d|\d+\s*karat"]
prose = []


def prose_strings(obj, where):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in ("quote", "source", "checked", "_note", "_role"):
                continue
            prose_strings(v, f"{where}.{k}")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            prose_strings(v, f"{where}[{i}]")
    elif isinstance(obj, str):
        prose.append((where, obj))


prose_strings(content, "content")
for where, s in prose:
    for pat in FIG:
        m = re.search(pat, s)
        if m and not any(norm(s) in q or m.group(0) in q for q in checked_quotes):
            fails.append(f"{where}: our prose states a figure ({m.group(0)!r}); quote it from the pack or remove it")

# ---------------------------------------------------------------- 6: references
cards = {c.get("id"): c for c in content.get("cards", [])}
for i, s in enumerate(content.get("stages", [])):
    for r in s.get("reads", []):
        if r not in cards:
            fails.append(f"stage {s.get('id')}: reads unknown card {r!r}")
for s in content.get("scenarios", []):
    for r in s.get("options", []) + s.get("answer", []):
        if r not in cards:
            fails.append(f"scenario {s.get('id')}: unknown card {r!r}")
    for r in s.get("answer", []):
        if r not in s.get("options", []):
            fails.append(f"scenario {s.get('id')}: answer {r!r} is not among its options")
for q in content.get("quiz", []):
    if not (0 <= q.get("answer", -1) < len(q.get("options", []))):
        fails.append(f"quiz: answer index out of range in {q.get('q', '')[:40]!r}")
covered = {r for c in cards.values() for r in c.get("roles", [])}
for role, val in (data.get("file_map") or {}).items():
    if role in ("brand", "brand_slug", "folder", "brand_domains", "type_ruling"):
        continue
    if val is not None and role not in covered:
        fails.append(f"File map role {role!r} has no card")
for c in cards.values():
    if c.get("layer") not in {l.get("id") for l in content.get("layers", [])}:
        fails.append(f"card {c.get('id')}: unknown layer {c.get('layer')!r}")


def resolve(path):
    node = data
    for part in path.split("."):
        if part == "#":
            return len(node) if isinstance(node, (list, dict)) else None
        m = re.fullmatch(r"(\w+)\[(\w+)=([^\]]+)\]", part)
        if m:
            node = node.get(m.group(1)) if isinstance(node, dict) else None
            node = [x for x in (node or []) if isinstance(x, dict) and str(x.get(m.group(2))) == m.group(3)]
            continue
        if not isinstance(node, dict) or part not in node:
            return None
        node = node[part]
    return node


values = content.get("values", {})
for k, p in values.items():
    if resolve(p) is None:
        fails.append(f"value {k!r}: path {p!r} does not resolve in the data")
used_vals = set(re.findall(r"\{(\w+)\}", json.dumps(content, ensure_ascii=False)))
for k in used_vals:
    if k not in values and k not in ("name",):
        fails.append(f"placeholder {{{k}}} has no entry in content.values")

if verdicts is not None:
    ids = {e.get("id") for e in verdicts.get("examples", [])}
    for where, s in prose:
        pass
    for st in content.get("stages", []):
        v = (st.get("predict") or {}).get("verdict")
        if v and v not in ids:
            fails.append(f"stage {st.get('id')}: verdict {v!r} not in examples-verified.json")
    for c in cards.values():
        v = (c.get("example") or {}).get("verdict")
        if v and v not in ids:
            fails.append(f"card {c.get('id')}: verdict {v!r} not in examples-verified.json")

# ---------------------------------------------------------------- census
if a.census_terms or a.extra_term:
    terms = list(a.extra_term)
    if a.census_terms:
        with open(a.census_terms, encoding="utf-8") as fh:
            terms += [t.strip() for t in fh if t.strip() and not t.startswith("#")]
    for name, t in texts.items():
        for term in terms:
            if re.search(r"(?<![\w-])" + re.escape(term) + r"(s|'s|es)?(?![\w-])", t, re.I):
                fails.append(f"census: a term from the list appears in {name} (term index {terms.index(term)})")

print(f"facts checked: {len(facts)} ({external} external), cards {len(cards)}, values {len(values)}, sources in stamp {len(stamp.get('sources') or {})}")
for w in warns:
    print("WARN " + w)
for f in fails:
    print("FAIL " + f)
print("PASS" if not fails else f"FAIL ({len(fails)})")
sys.exit(1 if fails else 0)
