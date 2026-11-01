#!/usr/bin/env python3
"""assemble: the email writer's block list into one Klaviyo-ready HTML file, from the module twins.
Usage: python3 crew/producers/email_html/assemble.py --run <run folder> [--width 600|1200] [--subject 1|2|3] [--out file.html]
Reads <run>/email.edited.json (else email.json) and <run>/intake.json. Fails (exit 1) when any slot
placeholder is left unfilled. Every merge token ({{cta_url}}, {{discount_code}}, ...) stays a token for
Klaviyo. Images are grey labelled placeholders listed in the report. Standard library only; no network."""
import argparse
import html
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import twins  # noqa: E402

TOKEN = re.compile(r"(\{\{[A-Za-z0-9_]+\}\})")
OPT = re.compile(r"<!--opt:([A-Za-z0-9_.]+)-->(.*?)<!--/opt:\1-->", re.S)
CARD = re.compile(r"<!--card-->(.*?)<!--/card-->", re.S)
ALLOWED_COMPOSED = {"E01.label", "E02.label", "E06.name", "E07.label", "E07.name"}


def render_text(text):
    """Escape, keep merge tokens whole, turn _word_ into an italic accent word."""
    out = []
    for part in TOKEN.split(text):
        if TOKEN.fullmatch(part):
            out.append(part)
        else:
            out.append(re.sub(r"_([^_\s][^_]*?)_", r"<em>\1</em>", html.escape(part, quote=False)))
    return "".join(out)


def fill(fragment, values):
    for sid, text in values.items():
        fragment = fragment.replace("{{%s}}" % sid, render_text(text))
    return fragment


def drop_unfilled_options(fragment, values):
    def sub(m):
        return m.group(2) if m.group(1) in values else ""
    return OPT.sub(sub, fragment)


def build_module(module, values, cards, tw):
    frag = tw[module]
    if cards:
        m = CARD.search(frag)
        cells = []
        for c in cards:
            cell = m.group(1)
            vals = dict(c.get("slots", {}))
            cell = cell.replace('href="{{cta_url}}"', 'href="{{url_%s}}"' % c["product_id"].replace("-", "_"))
            cells.append(fill(cell, vals))
        frag = frag[:m.start()] + "".join(cells) + frag[m.end():]
    frag = drop_unfilled_options(frag, values)
    return fill(frag, values)


def assemble(run_dir, width=1200, subject=1, tw=None):
    email_path = os.path.join(run_dir, "email.edited.json")
    if not os.path.exists(email_path):
        email_path = os.path.join(run_dir, "email.json")
    with open(email_path, encoding="utf-8") as fh:
        email = json.load(fh)
    tw, slots, by_module, composed = twins.all_twins(width)
    header = "M23"
    footer = email["footer"]
    foot_vals = {"M09.nav1.label": "{{nav1_label}}", "M09.nav2.label": "{{nav2_label}}", "M09.nav3.label": "{{nav3_label}}",
                 "M09.disclaimer": footer["disclaimer_token"], "M09.legal": " ".join(footer.get("legal_tokens", []))}
    seq = [(header, {}, None), (email["hero"]["module"], email["hero"].get("slots", {}), None)]
    for b in email.get("blocks", []):
        seq.append((b["module"], b.get("slots", {}), b.get("cards")))
    seq.append((footer["module"], foot_vals if footer["module"] == "M09" else {}, None))
    parts, problems = [], []
    for module, vals, cards in seq:
        if module not in tw:
            problems.append("module %s has no twin" % module)
            continue
        parts.append(build_module(module, vals, cards, tw))
    body = "".join('<tr><td align="center" style="padding:0;">%s</td></tr>' % p for p in parts)
    subj = email["subjects"][subject - 1]
    doc = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
           '<title>%s</title></head><body style="margin:0;padding:0;background:%s;">'
           '<span style="display:none;max-height:0;overflow:hidden;opacity:0;">%s</span>'
           '<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" border="0" bgcolor="%s"><tr><td align="center">'
           '<table role="presentation" width="%d" cellpadding="0" cellspacing="0" border="0" style="width:%dpx;max-width:100%%;">%s</table>'
           '</td></tr></table></body></html>') % (render_text(subj["subject"]), twins.PAGE, render_text(subj["preview"]),
                                                  twins.PAGE, width, width, body)
    left = sorted(set(m for m in re.findall(r"\{\{((?:[ME]\d\d)[A-Za-z0-9_.]*)\}\}", doc)))
    unfilled = list(left)
    for x in unfilled:
        problems.append("unfilled slot %s" % x)
    tokens = sorted(set(re.findall(r"\{\{([A-Za-z0-9_]+)\}\}", doc)))
    report = {
        "email": os.path.basename(email_path), "width": width, "subject": subj["subject"],
        "modules": [s[0] for s in seq], "unfilled_slots": unfilled, "problems": problems,
        "merge_tokens": tokens,
        "image_placeholders": len(re.findall(r"photo placeholder|product image|image well", doc)),
        "faces": "Saol and Trade Gothic render as the stand-ins Georgia and Arial where the recipient lacks them; licenses are open with HLR",
    }
    return doc, report


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--run", required=True)
    ap.add_argument("--width", type=int, default=1200, choices=(600, 1200))
    ap.add_argument("--subject", type=int, default=1, choices=(1, 2, 3))
    ap.add_argument("--out")
    a = ap.parse_args()
    doc, report = assemble(a.run, a.width, a.subject)
    out = a.out or os.path.join(a.run, "email.html")
    with open(out, "w", encoding="utf-8") as fh:
        fh.write(doc)
    print(json.dumps(report, indent=1))
    if report["problems"]:
        sys.exit(1)


if __name__ == "__main__":
    main()
