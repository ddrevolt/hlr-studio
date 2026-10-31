#!/usr/bin/env python3
"""strategist_check: the three angles against route-axes.json, module-library.json and exemplars.json.
Usage: python3 crew/checks/strategist_check.py --output <run>/strategist.json [--pack brand-pack]
Checks: exactly default_route_count angles; every axis in route_axes.axes and no two alike; opening_module
in MOD_LABEL and not a no-copy module (M01, M05, M10); exemplar_ref null or an id in exemplars.json;
at least two registers across the set; no em dash or prohibited hit; no dollar figure in a lead line.
No engine lint covers angles on their own (the retired route plan did). Exit 0 PASS, 1 FAIL."""
import os
import re
import common

a = common.args(__doc__)
doc = common.read_json(a.output)
axes = common.read_json(os.path.join(a.pack, "route-axes.json"))
lib = common.read_json(os.path.join(a.pack, "module-library.json"))
ex = common.read_json(os.path.join(a.pack, "exemplars.json"))
ex_ids = {e.get("id") for e in ex.get("exemplars", [])}
pats = common.prohibited(a.pack)
f = []

angles = doc.get("angles", [])
want = axes.get("default_route_count", 3)
if len(angles) != want:
    f.append("angles: %d, route-axes default_route_count is %d" % (len(angles), want))
seen = []
for i, ang in enumerate(angles):
    ax = ang.get("axis")
    if ax not in axes.get("axes", []):
        f.append("angles[%d]: axis %r not in route-axes.json" % (i, ax))
    if ax in seen:
        f.append("angles[%d]: axis %r repeats; angles differ on frame" % (i, ax))
    seen.append(ax)
    mod = ang.get("opening_module")
    if mod not in lib.get("MOD_LABEL", {}):
        f.append("angles[%d]: opening_module %r not in module-library.json" % (i, mod))
    elif mod in ("M01", "M05", "M10"):
        f.append("angles[%d]: opening_module %s carries no copy" % (i, mod))
    ref = ang.get("exemplar_ref")
    if ref is not None and ref not in ex_ids:
        f.append("angles[%d]: exemplar_ref %r not in exemplars.json" % (i, ref))
    if re.search(r"\$\s?\d|\d+\s?%", ang.get("lead_line", "")):
        f.append("angles[%d]: lead_line carries a figure" % i)
if len({ang.get("register") for ang in angles}) < 2 and len(angles) >= 2:
    f.append("angles: one register across the set; the voice contract wants at least two")
f += common.scan_text(doc, pats)
common.report("strategist_check", f)
