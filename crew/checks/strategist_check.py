#!/usr/bin/env python3
"""strategist_check: the three angles against route-axes.json, module-library.json and exemplars.json.
Usage: python3 crew/checks/strategist_check.py --output <run>/strategist.json [--pack brand-pack] [--intake <intake.json>]
Checks: exactly default_route_count angles; every axis in route_axes.axes and no two alike; opening_module
in MOD_LABEL and not a no-copy module (M01, M05, M10); exemplar_ref null or an id in exemplars.json;
at least two registers across the set; no em dash or prohibited hit; no dollar figure in a lead line;
a lead line of at most 140 characters that starts in sentence case.
Against the intake (default: intake.json beside the output; absent is a failure): the angle set names the
intake's slug; an urgency angle needs an offer in the intake (tokens count); a proof angle needs a quote in
the intake's must_say; every pattern in the intake's never_say applies to every string.
No engine lint covers angles on their own (the retired route plan did). Exit 0 PASS, 1 FAIL."""
import os
import re
import common

a = common.args(__doc__, extras=[("--intake", "the intake.json this run used (default: beside the output)")])
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
for i, ang in enumerate(angles):
    ll = ang.get("lead_line", "")
    if len(ll) > 140:
        f.append("angles[%d]: lead_line is %d characters, the limit is 140" % (i, len(ll)))
    first = next((c for c in ll if c.isalpha() or c == "_"), "")
    if first and first.isalpha() and not first.isupper():
        f.append("angles[%d]: lead_line does not start in sentence case" % i)

intake_path = a.intake or os.path.join(os.path.dirname(os.path.abspath(a.output)), "intake.json")
extra = []
if os.path.isfile(intake_path):
    intake = common.read_json(intake_path)
    if doc.get("brief_slug") != intake.get("slug"):
        f.append("brief_slug %r is not the intake's slug %r" % (doc.get("brief_slug"), intake.get("slug")))
    for i, ang in enumerate(angles):
        if ang.get("axis") == "urgency" and not intake.get("offer"):
            f.append("angles[%d]: urgency needs an offer or a date in the intake; it has none" % i)
        if ang.get("axis") == "proof" and not intake.get("must_say"):
            f.append("angles[%d]: proof needs a sourced quote in the intake's must_say; it has none" % i)
    for pat in intake.get("never_say", []):
        try:
            extra.append(re.compile(pat, re.I))
        except re.error:
            f.append("intake never_say: %r is not a valid pattern" % pat[:40])
else:
    f.append("no intake.json at %s; pass --intake, the checks against the intake cannot run" % intake_path)
f += common.scan_text(doc, pats)
seen_msgs = set(f)
f += [m for m in common.scan_text(doc, extra) if m not in seen_msgs]
common.report("strategist_check", f)
