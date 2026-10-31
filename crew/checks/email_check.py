#!/usr/bin/env python3
"""email_check: the email block list against slotmap.yaml, module-library.json and products.json.
Usage: python3 crew/checks/email_check.py --output <run>/email.json [--pack brand-pack]
Checks: every module in MOD_LABEL; every slot id belongs to its module (own slot or a composed element
slot); every string within the slot's max_chars; upper-case slots in caps; verbatim slots (the disclaimer)
and price slots hold merge tokens only; card product ids exist in products.json and E06.name is the
display name; three subject pairs; no em dash, prohibited hit or typed price anywhere; at most one
exclamation mark and none in a headline, subject or CTA.
Engine copy_lint.js: SKIPPED (see crew/checks/README.md). Exit 0 PASS, 1 FAIL."""
import os
import re
import common

a = common.args(__doc__)
doc = common.read_json(a.output)
slots, by_module, composed = common.slotmap(a.pack)
lib = common.read_json(os.path.join(a.pack, "module-library.json"))
prods = common.products(a.pack)
pats = common.prohibited(a.pack)
f = []
money = re.compile(r"\$\s?\d|\d+\s?(usd|dollars)\b|\b\d+\s?%\s?off", re.I)
token = re.compile(r"^\{\{[a-z_]+\}\}$")


def allowed(module, sid):
    if sid in by_module.get(module, []):
        return True
    if sid.startswith("E"):
        for c in composed.get(module, []):
            if sid == c or sid.startswith(c.split(".")[0] + "."):
                return True
    return False


def check_slots(where, module, slot_dict):
    if module not in lib.get("MOD_LABEL", {}):
        f.append("%s: module %s not in module-library.json" % (where, module))
        return
    for sid, text in slot_dict.items():
        if sid not in slots:
            f.append("%s: slot %s not in slotmap.yaml" % (where, sid))
            continue
        if not allowed(module, sid):
            f.append("%s: slot %s does not belong to %s" % (where, sid, module))
        spec = slots[sid]
        if spec["max_chars"] and len(text) > spec["max_chars"]:
            f.append("%s: %s is %d chars, max_chars %d" % (where, sid, len(text), spec["max_chars"]))
        if spec["case"] == "upper" and text != text.upper():
            f.append("%s: %s is a caps slot" % (where, sid))
        if spec["role"] in ("price", "disclaimer") and not token.match(text):
            f.append("%s: %s takes a merge token, never typed copy" % (where, sid))
        if spec["role"] == "headline" and "!" in text:
            f.append("%s: %s has an exclamation mark in a headline" % (where, sid))


check_slots("hero", doc["hero"]["module"], doc["hero"].get("slots", {}))
for i, b in enumerate(doc.get("blocks", [])):
    where = "blocks[%d]" % i
    check_slots(where, b["module"], b.get("slots", {}))
    for j, c in enumerate(b.get("cards", [])):
        cw = "%s.cards[%d]" % (where, j)
        if c["product_id"] not in prods:
            f.append("%s: product_id %r not in products.json" % (cw, c["product_id"]))
        elif c["slots"].get("E06.name") and c["slots"]["E06.name"] != prods[c["product_id"]]["name"]:
            f.append("%s: E06.name is not the display name %r" % (cw, prods[c["product_id"]]["name"]))
        check_slots(cw, b["module"], c.get("slots", {}))

if len(doc.get("subjects", [])) != 3:
    f.append("subjects: %d, want 3" % len(doc.get("subjects", [])))
for i, s in enumerate(doc.get("subjects", [])):
    if "!" in s.get("subject", ""):
        f.append("subjects[%d]: exclamation mark in a subject" % i)
if "!" in doc.get("cta", {}).get("label", ""):
    f.append("cta: exclamation mark in the CTA")
bangs = sum(s.count("!") for _, s in common.walk_strings(doc))
if bangs > 1:
    f.append("piece: %d exclamation marks, at most one" % bangs)
for path, s in common.walk_strings(doc):
    if money.search(s):
        f.append("%s: a price or offer figure is typed, not a merge token" % path)
f += common.scan_text(doc, pats)

common.engine_lint_skipped("copy_lint.js",
    "it reads the retired slate shape (gates, modules, routes[], preheader) and the engine's type registry gate "
    "set; the crew email is a block list by module id (backlog crew-email adapts the lint or the shape)")
common.report("email_check", f)
