"""Shared pieces of the crew checks: pack readers, the string walk, the prohibited-pattern scan,
the slot map parser, and the engine-lint locator. Standard library only."""
import argparse
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EM = chr(0x2014)


def args(description, run=False, extras=()):
    ap = argparse.ArgumentParser(description=description)
    for flag, helptext in extras:
        ap.add_argument(flag, default=None, help=helptext)
    ap.add_argument("--output", required=True, help="the stage output JSON to check")
    ap.add_argument("--pack", default=os.path.join(ROOT, "brand-pack"))
    if run:
        ap.add_argument("--run", required=True, help="the run folder (sibling stage outputs)")
    return ap.parse_args()


def read_json(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def read_text(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def file_map(pack):
    """The fenced JSON block at the end of brand-context.md."""
    text = read_text(os.path.join(pack, "brand-context.md"))
    m = re.search(r"## File map.*?```json\n(.*?)\n```", text, re.S)
    if not m:
        raise SystemExit("FAIL: brand-context.md has no File map block")
    return json.loads(m.group(1))


def prohibited(pack):
    pats = file_map(pack).get("prohibited_patterns") or []
    return [re.compile(p, re.I) for p in pats]


def products(pack):
    d = read_json(os.path.join(pack, "products.json"))
    return {k: v for k, v in d.items() if not k.startswith("_") and isinstance(v, dict)}


def walk_strings(node, path="$"):
    """Yield (path, string) for every string in a JSON document."""
    if isinstance(node, str):
        yield path, node
    elif isinstance(node, list):
        for i, v in enumerate(node):
            for item in walk_strings(v, "%s[%d]" % (path, i)):
                yield item
    elif isinstance(node, dict):
        for k, v in node.items():
            for item in walk_strings(v, "%s.%s" % (path, k)):
                yield item


def scan_text(doc, patterns, skip_paths=()):
    """Every string against the em dash and the prohibited patterns. Returns a list of findings."""
    out = []
    for path, s in walk_strings(doc):
        if any(path.startswith(sp) for sp in skip_paths):
            continue
        if EM in s:
            out.append("%s: em dash" % path)
        for p in patterns:
            if p.search(s):
                out.append("%s: prohibited pattern %s" % (path, p.pattern[:40]))
    return out


SLOT_RE = re.compile(r"-\s*\{\s*id:\s*([A-Z]\d\d\.[A-Za-z0-9_.]+),(.*?)\}\s*$")


def slotmap(pack):
    """slotmap.yaml read as text: {slot_id: {module, role, case, max_chars}} plus {module: [slot ids]} and composed."""
    slots, by_module, composed = {}, {}, {}
    current = None
    for line in read_text(os.path.join(pack, "slotmap.yaml")).splitlines():
        m = re.match(r"^  ([ME]\d\d):\s*$", line)
        if m:
            current = m.group(1)
            by_module.setdefault(current, [])
            continue
        m = re.match(r"^    composed:\s*\{(.*)\}", line)
        if m and current:
            composed[current] = re.findall(r"E\d\d(?:\.[a-z_]+)?", m.group(1))
            continue
        m = SLOT_RE.search(line)
        if m and current:
            sid, rest = m.group(1), m.group(2)
            fields = dict(re.findall(r"(\w+):\s*(\"[^\"]*\"|[^,]+)", rest))
            slots[sid] = {
                "module": current,
                "role": fields.get("role", "").strip(),
                "case": fields.get("case", "").strip(),
                "max_chars": int(fields["max_chars"]) if fields.get("max_chars", "").strip().isdigit() else None,
            }
            by_module[current].append(sid)
    return slots, by_module, composed


def newest_bundle():
    d = os.path.join(ROOT, "outputs", "step-3-bundle")
    if not os.path.isdir(d):
        return None
    names = [n for n in os.listdir(d) if n.startswith("hlr-studio-engine-") and n.endswith(".plugin")]

    def ver(n):
        return tuple(int(x) for x in re.findall(r"\d+", n))
    return os.path.join(d, sorted(names, key=ver)[-1]) if names else None


def engine_lint_skipped(lint, reason):
    """The engine lint exists in the newest bundle but cannot read the crew's JSON shape yet."""
    bundle = newest_bundle()
    where = os.path.relpath(bundle, ROOT) if bundle else "no bundle under outputs/step-3-bundle"
    print("SKIPPED engine %s (%s): %s" % (lint, where, reason))


def report(name, findings):
    for f in findings:
        print("ERROR %s" % f)
    if findings:
        print("%s: FAIL (%d)" % (name, len(findings)))
        sys.exit(1)
    print("%s: PASS" % name)


def sections(markdown):
    """A brief's '## Heading' sections as {heading: body}, in order of appearance."""
    out, name, buf = {}, None, []
    for line in markdown.splitlines():
        m = re.match(r"^##\s+(.+?)\s*$", line)
        if m:
            if name is not None:
                out[name] = "\n".join(buf).strip()
            name, buf = m.group(1), []
        elif name is not None:
            buf.append(line)
    if name is not None:
        out[name] = "\n".join(buf).strip()
    return out


def json_blob(doc):
    return json.dumps(doc, ensure_ascii=False)
