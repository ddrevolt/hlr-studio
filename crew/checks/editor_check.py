#!/usr/bin/env python3
"""editor_check: the editor's proposed edits against the stage files they would change.
Usage: python3 crew/checks/editor_check.py --output <run>/editor.json --run <run> [--pack brand-pack]
Checks: every edit's path resolves in <run>/<stage>.json; `before` is the exact current string there;
`after` differs from `before`, carries no em dash or prohibited hit and no new typed price; one edit
per path. No engine lint covers a diff. Exit 0 PASS, 1 FAIL."""
import os
import re
import common

a = common.args(__doc__, run=True)
doc = common.read_json(a.output)
pats = common.prohibited(a.pack)
f = []
money = re.compile(r"\$\s?\d|\d+\s?(usd|dollars)\b|\b\d+\s?%\s?off", re.I)
cache = {}


def get(stage, pointer):
    if stage not in cache:
        path = os.path.join(a.run, stage + ".json")
        if not os.path.exists(path):
            return None, "%s.json not in the run folder" % stage
        cache[stage] = common.read_json(path)
    node = cache[stage]
    try:
        for part in pointer.lstrip("/").split("/"):
            part = part.replace("~1", "/").replace("~0", "~")
            node = node[int(part)] if isinstance(node, list) else node[part]
    except (KeyError, IndexError, ValueError, TypeError):
        return None, "path %s not found in %s.json" % (pointer, stage)
    return node, None


seen = set()
for i, e in enumerate(doc.get("edits", [])):
    w = "edits[%d]" % i
    key = (e["stage"], e["path"])
    if key in seen:
        f.append("%s: a second edit on %s %s" % (w, e["stage"], e["path"]))
    seen.add(key)
    cur, err = get(e["stage"], e["path"])
    if err:
        f.append("%s: %s" % (w, err))
    elif cur != e["before"]:
        f.append("%s: before does not match the current string at %s" % (w, e["path"]))
    if e["after"] == e["before"]:
        f.append("%s: after equals before" % w)
    if money.search(e["after"]) and not money.search(e["before"]):
        f.append("%s: after introduces a typed figure" % w)
f += common.scan_text({"edits": [{"after": e["after"], "reason": e["reason"]} for e in doc.get("edits", [])],
                       "summary": doc.get("summary", "")}, pats)
common.report("editor_check", f)
