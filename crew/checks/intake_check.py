#!/usr/bin/env python3
"""intake_check: the crew's structured brief against the pack and against the brief it came from.
Usage: python3 crew/checks/intake_check.py --output <run>/intake.json [--pack brand-pack] [--brief <brief.md>]
Against the pack: every resolved product id exists in products.json with its display name; an unresolved
product has a gap; every gap has an owner; never_say carries every pack prohibited pattern; no em dash or
prohibited hit in any copy field; a price, discount figure or date in a copy field is a merge token, not typed.
Against the brief (default: the path in source.path, relative to the repo root): every bullet under
"Products" is a product in the output; every {{merge token}} the brief carries survives into the output;
"Offer" None means offer is null, any other offer means it is not and carries the Offer section's tokens; each channel the brief's "Channel and
deliverable" names is in channels; a brief that names a send date leaves a send_date gap. A product dropped
or a figure typed after the brief changed fails here.
Engine brief_lint.js: SKIPPED (see crew/checks/README.md). Exit 0 PASS, 1 FAIL."""
import os
import re
import common

a = common.args(__doc__, extras=[("--brief", "the brief the intake came from (default: source.path)")])
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

sub = {k: doc.get(k) for k in ("objective", "audience", "message", "must_say", "guidance", "moment")}
if isinstance(doc.get("offer"), dict):
    sub["offer_text"] = doc["offer"].get("text")
f += common.scan_text(sub, pats)

money = re.compile(r"\$\s?\d|\d+\s?(usd|dollars)|\b\d+\s?%\s?off", re.I)
dated = re.compile(r"\b\d{4}-\d{2}-\d{2}\b|\b(jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|june?|july?|aug(ust)?|sep(t|tember)?|oct(ober)?|nov(ember)?|dec(ember)?)\.?\s+\d{1,2}\b", re.I)
for path, s in common.walk_strings(sub):
    if money.search(s):
        f.append("%s: a price or offer figure is typed, not a merge token" % path)
    if dated.search(s):
        f.append("%s: a date is typed; dates are merge tokens or a gap until a person sets them" % path)

# against the brief
brief_path = a.brief or os.path.join(common.ROOT, (doc.get("source") or {}).get("path", ""))
if not os.path.isfile(brief_path):
    f.append("brief not found: %s" % brief_path)
else:
    text = common.read_text(brief_path)
    sec = common.sections(text)
    named = []
    for line in sec.get("Products", "").splitlines():
        m = re.match(r"^-\s+(.+?)(?:\s+\(.*\))?\s*$", line)
        if m:
            named.append(m.group(1).strip())
    have = {p.get("name") for p in doc.get("products", [])}
    if not named:
        f.append("brief: no bullets under Products to check against")
    for n in named:
        if n not in have:
            f.append("brief names %r under Products; it is not in products[]" % n)
    blob = common.json_blob(doc)
    for tok in sorted(set(re.findall(r"\{\{[A-Za-z0-9_]+\}\}", text))):
        if tok not in blob:
            f.append("brief carries the merge token %s; it does not survive into the output" % tok)
    offer = sec.get("Offer", "")
    if offer:
        none = re.match(r"^none\b", offer.strip(), re.I) is not None
        if none and doc.get("offer") is not None:
            f.append("brief Offer is None; offer must be null")
        if not none and doc.get("offer") is None:
            f.append("brief carries an offer; offer is null")
        if not none and doc.get("offer") is not None:
            oblob = common.json_blob(doc["offer"])
            for tok in sorted(set(re.findall(r"\{\{[A-Za-z0-9_]+\}\}", offer))):
                if tok not in oblob:
                    f.append("brief Offer carries %s; the offer object does not" % tok)
    for need in ("Products", "Offer", "Channel and deliverable"):
        if need not in sec:
            f.append("brief has no '## %s' section; the checks against it cannot run" % need)
    chan = sec.get("Channel and deliverable", "")
    for word, name in (("email", "email"), ("paid", "paid")):
        if re.search(r"\b%s\b" % word, chan, re.I) and name not in doc.get("channels", []):
            f.append("brief names the %s channel; channels lacks it" % name)
    if re.search(r"send date", chan, re.I) and not any("send_date" in (x or "") for x in gap_fields):
        f.append("brief names a send date; no send_date gap")

common.engine_lint_skipped("brief_lint.js",
    "it validates the engine's brief-schema.json (channels[], dates, source.kind, never_say.union) and the retired "
    "route plan; the crew intake shape is slimmer by design, and this check is the slimmed lint (backlog crew-intake)")
common.report("intake_check", f)
