#!/usr/bin/env python3
"""paid_check: the Meta ad sets against the pack.
Usage: python3 crew/checks/paid_check.py --output <run>/paid.json [--pack brand-pack] [--intake <intake.json>]
Checks: ad types from {single_image, story} with no repeat; three primary texts and three headlines each,
all distinct; spec_confidence equal to placement-specs.json's status (unverified until paid-specs closes); a character limit
in placement-specs.json, once a person fills it, is enforced on every line; a numeral in ad copy must appear in the
intake beside the output (a missing intake fails), so no number is untraceable; no em
dash, prohibited hit, typed price, rating, award or "best seller"; at most one exclamation mark and none
in a headline. Limits stay null in placement-specs.json until a person confirms them, so none is enforced yet.
Engine paid_lint.js: SKIPPED (see crew/checks/README.md). Exit 0 PASS, 1 FAIL."""
import os
import re
import common

a = common.args(__doc__, extras=[("--intake", "the intake.json this run used (default: beside the output)")])
doc = common.read_json(a.output)
pats = common.prohibited(a.pack)
f = []
money = re.compile(r"\$\s?\d|\d+\s?(usd|dollars)\b|\b\d+\s?%\s?off", re.I)
proof = re.compile(r"\bbest[- ]?sell(er|ers|ing)\b|\b\d(\.\d)?\s?stars?\b|\b\d[\d,]*\+?\s?(reviews|ratings|customers)\b|\baward", re.I)

specs = common.read_json(os.path.join(a.pack, "placement-specs.json"))
intake_path = a.intake or os.path.join(os.path.dirname(os.path.abspath(a.output)), "intake.json")
intake_text = None
if os.path.isfile(intake_path):
    intake_text = common.json_blob(common.read_json(intake_path))
else:
    f.append("no intake.json at %s; pass --intake, the number trace cannot run" % intake_path)

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
    if s.get("spec_confidence") != specs.get("_status"):
        f.append("%s: spec_confidence %r is not placement-specs.json's status %r" % (w, s.get("spec_confidence"), specs.get("_status")))
    lim = specs.get("meta", {}).get(s.get("ad_type"), {})
    for key, field in (("primary_text", "primary_text_max_chars"), ("headline", "headline_max_chars")):
        if lim.get(field):
            for j, v in enumerate(s.get(key, [])):
                if len(v) > lim[field]:
                    f.append("%s.%s[%d]: %d chars, limit %d" % (w, key, j, len(v), lim[field]))
    if lim.get("description_max_chars") and s.get("description") and len(s["description"]) > lim["description_max_chars"]:
        f.append("%s.description: over %d chars" % (w, lim["description_max_chars"]))
bangs = sum(x.count("!") for _, x in common.walk_strings(doc))
if bangs > 1:
    f.append("output: %d exclamation marks, at most one" % bangs)
for path, x in common.walk_strings(doc):
    if money.search(x):
        f.append("%s: a price or offer figure is typed, not a merge token" % path)
    if proof.search(x):
        f.append("%s: social proof or a sales claim with no source" % path)
if intake_text is not None:
    for path, x in common.walk_strings({k: v for k, v in doc.items() if k in ("ad_sets",)}):
        if path.endswith("spec_confidence") or path.endswith("ad_type"):
            continue
        for n in re.findall(r"\d[\d,.:]*", x):
            if n not in intake_text:
                f.append("%s: the number %s is not in the intake or placement-specs.json" % (path, n))
f += common.scan_text(doc, pats)

common.engine_lint_skipped("paid_lint.js",
    "it reads the retired slate shape (insights and concepts citing grounding ids, placements by ratio) and "
    "returns INSUFFICIENT-INPUT on an empty grounding pool; the crew paid output is ad sets by ad type and "
    "placement-specs.json carries no confirmed limit yet (backlog paid-specs)")
common.report("paid_check", f)
