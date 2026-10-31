#!/usr/bin/env python3
"""paid_check: the Meta ad sets against the pack.
Usage: python3 crew/checks/paid_check.py --output <run>/paid.json [--pack brand-pack]
Checks: ad types from {single_image, story} with no repeat; three primary texts and three headlines each,
all distinct; spec_confidence "unverified" until placement-specs.json lands (backlog paid-specs); no em
dash, prohibited hit, typed price, rating, award or "best seller"; at most one exclamation mark and none
in a headline. It does not check Meta character limits: the pack carries none yet.
Engine paid_lint.js: SKIPPED (see crew/checks/README.md). Exit 0 PASS, 1 FAIL."""
import re
import common

a = common.args(__doc__)
doc = common.read_json(a.output)
pats = common.prohibited(a.pack)
f = []
money = re.compile(r"\$\s?\d|\d+\s?(usd|dollars)\b|\b\d+\s?%\s?off", re.I)
proof = re.compile(r"\bbest[- ]?sell(er|ers|ing)\b|\b\d(\.\d)?\s?stars?\b|\b\d[\d,]*\+?\s?(reviews|ratings|customers)\b|\baward", re.I)

seen = set()
for i, s in enumerate(doc.get("ad_sets", [])):
    w = "ad_sets[%d]" % i
    if s["ad_type"] in seen:
        f.append("%s: ad_type %s repeats" % (w, s["ad_type"]))
    seen.add(s["ad_type"])
    for key in ("primary_text", "headline"):
        vals = s.get(key, [])
        if len(vals) != 3:
            f.append("%s: %s has %d, want 3" % (w, key, len(vals)))
        if len(set(vals)) != len(vals):
            f.append("%s: %s repeats a line" % (w, key))
    for j, h in enumerate(s.get("headline", [])):
        if "!" in h:
            f.append("%s.headline[%d]: exclamation mark in a headline" % (w, j))
    if s.get("spec_confidence") != "unverified":
        f.append("%s: spec_confidence must stay unverified until placement-specs.json lands" % w)
bangs = sum(x.count("!") for _, x in common.walk_strings(doc))
if bangs > 1:
    f.append("output: %d exclamation marks, at most one" % bangs)
for path, x in common.walk_strings(doc):
    if money.search(x):
        f.append("%s: a price or offer figure is typed, not a merge token" % path)
    if proof.search(x):
        f.append("%s: social proof or a sales claim with no source" % path)
f += common.scan_text(doc, pats)

common.engine_lint_skipped("paid_lint.js",
    "it reads the retired slate shape (insights and concepts citing grounding ids, placements by ratio) and "
    "returns INSUFFICIENT-INPUT on an empty grounding pool; the crew paid output is ad sets by ad type and the "
    "pack has no placement-specs.json yet (backlog crew-paid and paid-specs)")
common.report("paid_check", f)
