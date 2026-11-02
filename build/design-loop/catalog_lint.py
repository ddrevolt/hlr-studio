#!/usr/bin/env python3
"""catalog_lint.py: the hard gate on brand-pack/design-catalog.json (the design loop's repo catalog).

Usage: python3 -I build/design-loop/catalog_lint.py [catalog.json]
Exit 0 when the catalog holds; 1 with one line per error; 2 when it cannot start.
Standard library only. Reads one file, writes nothing.

What it enforces (each is a project rule, not a taste call):
- Shape: required keys, closed enums, id pattern that matches the channel, unique ids, node ids as "123:456" or null.
- Evidence: every entry carries at least one tagged reference ([documented], [observed], [derived]).
- Approval: approved needs approved_by and approval_ref; proposed carries neither; retired needs a reason and a replacement.
- Beat-or-skip: a new or researched design names an existing entry and the job it beats (field beats).
- Outside designs: researched entries are reference only, withhold other brands' names, and are Mode A unless
  cleared_by names who cleared Mode B (rule 9; Mode B is for client originals or designs Eddie clears).
- Gates: an approved design that is not a seed carries all seven gate results, or null with a named gap.
- No em dash anywhere in the file.
"""
import json, re, sys

CHANNELS = {"IG": "organic_instagram", "EM": "email", "PD": "paid"}
ENUMS = {
    "kind": ["master", "design", "kit", "board"],
    "channel": ["organic_instagram", "email", "paid"],
    "mode": ["native", "A", "B", "A+B"],
    "source": ["seed", "original", "researched", "new"],
    "status": ["proposed", "approved", "retired"],
    "provenance": ["documented", "observed", "derived"],
}
GATE_KEYS = ["compare", "bound_variables", "scale_steps", "safe_margins", "contrast", "slot_budgets", "copy"]
REQUIRED = ["id", "kind", "title", "channel", "ratios", "master", "mode", "source", "status",
            "content_job", "provenance", "nodes", "evidence"]
ID_RE = re.compile(r"^HLR-(IG|EM|PD)-\d{3}$")
NODE_RE = re.compile(r"^\d+:\d+$")
EM_DASH = chr(0x2014)


def lint(path):
    errs = []
    try:
        with open(path, encoding="utf-8") as f:
            raw = f.read()
        cat = json.loads(raw)
    except Exception as e:  # unreadable or not JSON
        return None, ["cannot read %s: %s" % (path, e)]
    if EM_DASH in raw:
        errs.append("file: contains an em dash")
    if cat.get("_role") != "design_catalog":
        errs.append("file: _role must be design_catalog")
    if cat.get("enums") != ENUMS:
        errs.append("file: enums differ from the lint's closed enums (edit both together)")
    if cat.get("gate_keys") != GATE_KEYS:
        errs.append("file: gate_keys differ from the lint's gate keys")
    designs = cat.get("designs")
    if not isinstance(designs, list) or not designs:
        return cat, errs + ["file: designs must be a non-empty list"]
    ids = [d.get("id") for d in designs if isinstance(d, dict)]
    for i in set(ids):
        if ids.count(i) > 1:
            errs.append("%s: duplicate id" % i)
    idset = set(ids)
    for d in designs:
        if not isinstance(d, dict):
            errs.append("entry: not an object")
            continue
        i = d.get("id", "?")
        e = lambda m: errs.append("%s: %s" % (i, m))
        for k in REQUIRED:
            if k not in d:
                e("missing %s" % k)
        for k, allowed in ENUMS.items():
            if k in d and d[k] not in allowed:
                e("%s=%r not in %s" % (k, d[k], allowed))
        m = ID_RE.match(str(i))
        if not m:
            e("id does not match HLR-(IG|EM|PD)-NNN")
        elif d.get("channel") != CHANNELS[m.group(1)]:
            e("id prefix does not match channel %s" % d.get("channel"))
        if not (isinstance(d.get("ratios"), list) and d["ratios"] and all(isinstance(r, str) and r for r in d["ratios"])):
            e("ratios must be a non-empty list of strings")
        if not isinstance(d.get("master"), dict) or not d["master"].get("name"):
            e("master.name is required")
        elif d["master"].get("node") is not None and not NODE_RE.match(str(d["master"]["node"])):
            e("master.node is not an id")
        elif d["master"].get("node") is None and d.get("source") != "seed":
            e("master.node is null: a non-seed design names its master node")
        nodes = d.get("nodes")
        if not isinstance(nodes, dict) or not nodes:
            e("nodes must be a non-empty object")
        else:
            for k, v in nodes.items():
                if v is not None and not NODE_RE.match(str(v)):
                    e("nodes.%s=%r is not a node id" % (k, v))
        ev = d.get("evidence")
        if not (isinstance(ev, list) and ev):
            e("evidence needs at least one item")
        else:
            for x in ev:
                if not isinstance(x, dict) or x.get("tag") not in ENUMS["provenance"] or not x.get("ref"):
                    e("evidence item needs a tag %s and a ref" % ENUMS["provenance"])
        st = d.get("status")
        if st == "approved":
            if not d.get("approved_by") or not d.get("approval_ref"):
                e("approved needs approved_by and approval_ref")
        elif st == "proposed":
            if d.get("approved_by") or d.get("approval_ref"):
                e("proposed must not carry approved_by or approval_ref")
        elif st == "retired":
            if not d.get("retired_reason") or not d.get("replaced_by"):
                e("retired needs retired_reason and replaced_by (an id, or the word none)")
            elif d["replaced_by"] != "none" and d["replaced_by"] not in idset:
                e("replaced_by %r is not an entry" % d["replaced_by"])
        src = d.get("source")
        if src in ("new", "researched"):
            b = d.get("beats")
            if not (isinstance(b, dict) and b.get("id") in idset and b.get("id") != i and b.get("job")):
                e("a %s design needs beats {id: an existing entry, job: the named job}" % src)
        if src == "researched":
            if d.get("reference_only") is not True:
                e("researched needs reference_only: true")
            if d.get("outside_names_withheld") is not True:
                e("researched needs outside_names_withheld: true (rule 9)")
        if d.get("mode") in ("B", "A+B") and src in ("researched", "new") and not d.get("cleared_by"):
            e("Mode B on a %s design needs cleared_by (who cleared it, and when)" % src)
        if st == "approved" and src != "seed":
            g = d.get("gates")
            if not isinstance(g, dict):
                e("approved non-seed needs gates")
            else:
                for k in GATE_KEYS:
                    if k not in g:
                        e("gates.%s missing" % k)
                    elif g[k] is None:
                        if not d.get("gate_gap"):
                            e("gates.%s is null and gate_gap names no owner" % k)
                    elif not (isinstance(g[k], str) and (g[k].startswith("pass") or g[k].startswith("declared:"))):
                        e("gates.%s must start with pass or declared:" % k)
    return cat, errs


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else "brand-pack/design-catalog.json"
    cat, errs = lint(path)
    if cat is None:
        print("\n".join(errs))
        return 2
    n = len(cat.get("designs", []))
    by = {}
    for d in cat.get("designs", []):
        if isinstance(d, dict):
            by[d.get("status")] = by.get(d.get("status"), 0) + 1
    if errs:
        print("\n".join(errs))
        print("catalog_lint: FAIL, %d entries, %d errors" % (n, len(errs)))
        return 1
    print("catalog_lint: PASS, %d entries (%s)" % (n, ", ".join("%s %d" % kv for kv in sorted(by.items()))))
    return 0


if __name__ == "__main__":
    sys.exit(main())
