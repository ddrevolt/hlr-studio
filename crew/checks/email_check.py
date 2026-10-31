#!/usr/bin/env python3
"""email_check: the email block list against slotmap.yaml, module-library.json and products.json.
Usage: python3 crew/checks/email_check.py --output <run>/email.json [--pack brand-pack] [--intake <intake.json>]
Checks: every module in MOD_LABEL; every slot id belongs to its module (own slot or a composed element
slot); every string within the slot's max_chars; upper-case slots in caps; verbatim slots (the disclaimer)
and price slots hold merge tokens only; card product ids exist in products.json and E06.name is the
display name; three subject pairs; no em dash, prohibited hit or typed price anywhere; at most one
exclamation mark and none in a headline, subject or CTA.
Engine copy_lint.js: SKIPPED (see crew/checks/README.md). Exit 0 PASS, 1 FAIL."""
import os
import re
import common

a = common.args(__doc__, extras=[("--intake", "the intake.json this run used (default: beside the output)")])
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

# every product named anywhere traces to products.json by key, and to the intake
for b in [doc["hero"]] + doc.get("blocks", []):
    if b.get("module") == "M03":
        nm = b.get("slots", {}).get("M03.name")
        if nm and nm not in {v.get("name") for v in prods.values()}:
            f.append("M03.name %r is not a display name in products.json" % nm)
intake_path = a.intake or os.path.join(os.path.dirname(os.path.abspath(a.output)), "intake.json")
if os.path.isfile(intake_path):
    intake = common.read_json(intake_path)
    if doc.get("brief_slug") != intake.get("slug"):
        f.append("brief_slug %r is not the intake's slug %r" % (doc.get("brief_slug"), intake.get("slug")))
    allowed_names = {p.get("name") for p in intake.get("products", [])}
    for pid, v in prods.items():
        nm = v.get("name")
        if nm and nm not in allowed_names:
            for path, text in common.walk_strings(doc):
                if nm in text:
                    f.append("%s: names %r, which the intake does not carry" % (path, nm))
    for b in doc.get("blocks", []):
        for c in b.get("cards", []):
            if prods.get(c.get("product_id"), {}).get("name") not in allowed_names:
                f.append("card %s is not a product in the intake" % c.get("product_id"))
    tokens_ok = set(__import__("re").findall(r"\{\{[A-Za-z0-9_]+\}\}", common.json_blob(intake)))
    house = {"{{cta_url}}", "{{footer_disclaimer}}", "{{unsubscribe_url}}", "{{postal_address}}", "{{price}}"}
    for path, text in common.walk_strings(doc):
        for tok in __import__("re").findall(r"\{\{[A-Za-z0-9_]+\}\}", text):
            if tok not in tokens_ok and tok not in house:
                f.append("%s: merge token %s is neither in the intake nor a house token" % (path, tok))
else:
    f.append("no intake.json at %s; pass --intake, the product and token checks cannot run" % intake_path)

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
