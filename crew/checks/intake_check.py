#!/usr/bin/env python3
"""intake_check: the crew's structured brief against the pack.
Usage: python3 crew/checks/intake_check.py --output <run>/intake.json [--pack brand-pack]
Checks: every resolved product id exists in products.json with its display name; an unresolved product
has a gap; every gap has an owner; never_say carries every pack prohibited pattern; no em dash or
prohibited hit in any copy field; a price or dollar figure in message or offer is a merge token.
Engine brief_lint.js: SKIPPED (see crew/checks/README.md). Exit 0 PASS, 1 FAIL."""
import re
import common

a = common.args(__doc__)
doc = common.read_json(a.output)
prods = common.products(a.pack)
pats = common.prohibited(a.pack)
fm = common.file_map(a.pack)
f = []

gap_fields = {g.get("field") for g in doc.get("gaps", [])}
for i, p in enumerate(doc.get("products", [])):
    if p.get("resolved"):
        if p["id"] not in prods:
            f.append("products[%d]: id %r not in products.json" % (i, p["id"]))
        elif prods[p["id"]].get("name") != p.get("name"):
            f.append("products[%d]: name %r is not the display name %r" % (i, p.get("name"), prods[p["id"]].get("name")))
    else:
        if not any(p["id"] in g.get("note", "") or p.get("name", "") in g.get("note", "") for g in doc.get("gaps", [])):
            f.append("products[%d]: unresolved with no gap naming it" % i)

for i, g in enumerate(doc.get("gaps", [])):
    if not g.get("owner", "").strip():
        f.append("gaps[%d]: no owner" % i)

for pat in fm.get("prohibited_patterns") or []:
    if pat not in doc.get("never_say", []):
        f.append("never_say: pack pattern missing: %s" % pat[:40])

copy_paths = ("$.objective", "$.audience", "$.message", "$.must_say", "$.guidance", "$.offer.text", "$.moment")
sub = {k: doc.get(k) for k in ("objective", "audience", "message", "must_say", "guidance", "moment")}
if isinstance(doc.get("offer"), dict):
    sub["offer_text"] = doc["offer"].get("text")
f += common.scan_text(sub, pats)

money = re.compile(r"\$\s?\d|\d+\s?(usd|dollars)|\b\d+\s?%\s?off", re.I)
for path, s in common.walk_strings(sub):
    if money.search(s):
        f.append("%s: a price or offer figure is typed, not a merge token" % path)

common.engine_lint_skipped("brief_lint.js",
    "it validates the engine's brief-schema.json (channels[], dates, source.kind, never_say.union) and the retired "
    "route plan; the crew intake shape is slimmer by design (backlog crew-intake slims the lint to this schema)")
common.report("intake_check", f)
