#!/usr/bin/env python3
"""Compile the paid masters package for Figma's native agent (backlog paid-package).

Reads brand-pack/slotmap-paid.yaml, tokens.json, figma.yaml and placement-specs.json. Writes
outputs/step-9-paid/agent-package.md: three packages (feed 1:1, feed 4:5, story 9:16), one per format,
in the engine's agent-package format (asset-production/references/agent-package.md). It never talks to
Figma. The masters are built in Eddie's chat; the closing pass (stamp, canvas check, flex, slot lint)
stays ours and is named at the foot of every package.

Usage:
  python3 crew/producers/figma_package.py [--out outputs/step-9-paid/agent-package.md]
  python3 crew/producers/figma_package.py --lint outputs/step-9-paid/agent-package.md

Standard library only (Python 3.9+). Exit 0 clean, 1 on a lint problem.
"""
import argparse
import datetime
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
PACK = os.path.join(ROOT, "brand-pack")
DEFAULT_OUT = os.path.join(ROOT, "outputs", "step-9-paid", "agent-package.md")

EM = chr(0x2014)
# Meta formats of the package. DECISIONS 2026-10-17 (Q11): Meta 1:1, 4:5 and 9:16.
FORMATS = [
    {"key": "1x1", "label": "Feed 1:1", "size": (1080, 1080), "placement": "single_image"},
    {"key": "4x5", "label": "Feed 4:5", "size": (1080, 1350), "placement": "single_image"},
    {"key": "9x16", "label": "Story 9:16", "size": (1080, 1920), "placement": "story"},
]
# Modules built for Meta. P10 (Google link image) and P11 (IAB display) are other platforms: not in scope.
META_MODULES = ["P%02d" % i for i in range(1, 10)]

# Role to text style: a proposal, [derived]; Donnie ratifies, Eddie may swap a style in the build.
ROLE_STYLE = {
    "hook": "headline", "title": "headline", "headline": "headline", "offer": "headline",
    "body": "body", "eyebrow": "eyebrow", "subline": "eyebrow", "label": "label",
    "name": "title", "quote": "quote", "attribution": "label", "disclaimer": "fine",
}
CASE_WORDS = {
    "sentence": "sentence case as given",
    "upper": "text case Upper, applied by the style's case setting, never by retyping",
    "as-is": "exactly as the merge value arrives",
}

SLOT_RE = re.compile(r"-\s*\{\s*id:\s*(P\d+\.[\w.]+),\s*role:\s*(\w+),\s*max_chars:\s*(null|\d+),\s*case:\s*([\w-]+)(.*?)\}")
MOD_RE = re.compile(r"^  (P\d+):\s*$")
SIZE_RE = re.compile(r'name:\s*"Ratio=([\dx.]+)",\s*size:\s*"(\d+x\d+)"')


def read(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def parse_slotmap(text):
    """Line parser, as the engine's paid_lint does: modules with name, sizes and slot lines."""
    mods, cur, in_slots = {}, None, False
    for line in text.splitlines():
        m = MOD_RE.match(line)
        if m:
            cur = {"id": m.group(1), "name": "", "sizes": {}, "slots": [], "use_when": ""}
            mods[m.group(1)] = cur
            in_slots = False
            continue
        if cur is None:
            continue
        s = line.strip()
        if s.startswith("name:") and not cur["name"]:
            cur["name"] = s.split(":", 1)[1].strip().strip('"')
        elif s.startswith("use_when:"):
            cur["use_when"] = s.split(":", 1)[1].strip().strip('"')
        for r, sz in SIZE_RE.findall(line):
            cur["sizes"][r] = sz
        if s.startswith("slots:"):
            in_slots = True
        elif in_slots:
            sm = SLOT_RE.search(line)
            if sm:
                rest = sm.group(5)
                cur["slots"].append({
                    "id": sm.group(1), "role": sm.group(2),
                    "max": None if sm.group(3) == "null" else int(sm.group(3)),
                    "case": sm.group(4), "verbatim": "verbatim: true" in rest,
                    "feed": (re.search(r"feed:\s*(\w+)", rest) or [None, None])[1],
                })
            elif s and not s.startswith("-") and not s.startswith("#"):
                in_slots = False
    return mods


def token(tokens, path):
    node = tokens
    for p in path.split("."):
        node = node[p]
    return node


def resolve(tokens, value):
    m = re.fullmatch(r"\{(.+)\}", value)
    return resolve(tokens, token(tokens, m.group(1))["$value"]) if m else value


def build_context():
    tokens = json.loads(read(os.path.join(PACK, "tokens.json")))
    specs = json.loads(read(os.path.join(PACK, "placement-specs.json")))
    figma = read(os.path.join(PACK, "figma.yaml"))
    mods = parse_slotmap(read(os.path.join(PACK, "slotmap-paid.yaml")))
    coll = {k: re.search(r"^\s+%s:\s*(HLR / \w+)" % k, figma, re.M).group(1)
            for k in ("primitives", "semantic", "component", "layout")}
    prefix_ok = "paid: P" in figma
    licensed_false = re.search(r"^\s+licensed:\s*false", figma, re.M) is not None
    sizes = {}
    for k in ("label", "eyebrow", "body", "title", "headline", "quote"):
        n = token(tokens, "font.size." + k)
        sizes[k] = n["$extensions"]["com.hlr"]["modes"]["social"]
    colors = {
        "ink": resolve(tokens, token(tokens, "color.semantic.text.primary")["$value"]),
        "ground": resolve(tokens, token(tokens, "color.semantic.background.default")["$value"]),
        "on_photo": resolve(tokens, token(tokens, "color.semantic.text.on-photo")["$value"]),
        "placeholder": resolve(tokens, token(tokens, "color.semantic.background.placeholder")["$value"]),
        "placeholder_label": resolve(tokens, token(tokens, "color.semantic.text.on-placeholder")["$value"]),
    }
    return {"tokens": tokens, "specs": specs, "coll": coll, "mods": mods, "sizes": sizes, "colors": colors,
            "prefix_ok": prefix_ok, "licensed_false": licensed_false,
            "margin": resolve(tokens, token(tokens, "space.social-margin")["$value"]),
            "wordmark": re.search(r'"Marks/Wordmark":\s*"([\d:]+)"', figma).group(1),
            "star": re.search(r'"Marks/Star":\s*"([\d:]+)"', figma).group(1)}


def budget_text(slot, spec_meta):
    if slot["max"] is not None:
        return "budget %d characters" % slot["max"]
    return "budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm)"


def module_block(ctx, mod, fmt):
    ratio = fmt["key"]
    w, h = fmt["size"]
    out = []
    out.append("#### %s %s, frame \"%s %s %s\" %dx%d" % (mod["id"], mod["name"], mod["id"], mod["name"], ratio, w, h))
    out.append("")
    out.append("Use: %s" % re.sub(r"\s*Patterns? .*$", "", mod["use_when"]).strip().rstrip(".") + ".")
    out.append("")
    for s in mod["slots"]:
        style = ROLE_STYLE.get(s["role"], "body")
        size = ctx["sizes"].get(style)
        size_txt = "%s on this canvas, from the style" % size if size else "from the style"
        flags = []
        if s["verbatim"]:
            flags.append("verbatim, never trimmed to fit")
        if s["feed"] == "product_db":
            flags.append("fed from the product database, never written")
        out.append("- Text \"{{%s}}\", layer name \"%s\", text style \"%s\" (%s), %s; %s%s. Do NOT rewrite this copy."
                   % (s["id"], s["id"], style, size_txt, CASE_WORDS.get(s["case"], s["case"]),
                      budget_text(s, None), ("; " + "; ".join(flags)) if flags else ""))
    out.append("")
    return out


def package(ctx, fmt, today):
    w, h = fmt["size"]
    key = fmt["key"]
    sp = ctx["specs"]["meta"][fmt["placement"]]
    c = ctx["colors"]
    coll = ctx["coll"]
    L = []
    mods = [ctx["mods"][m] for m in META_MODULES if m in ctx["mods"] and key in ctx["mods"][m]["sizes"]]
    L.append("## Package %s: %s, %dx%d" % ("ABC"[[f["key"] for f in FORMATS].index(key)], fmt["label"], w, h))
    L.append("")
    L.append("```")
    L.append("FIGMA AGENT BRIEF: HLR · Meta paid masters · %s · %s" % (fmt["label"], today))
    L.append("Build in: HLR Library (file key Gq3yUbLs6MCRM0nOhjvnIW) → page \"02 Modules\" · Do not modify anything outside the frames you create.")
    L.append("")
    L.append("LICENSE FLAG (raised): Saol Display, Saol Standard and Trade Gothic LT Std have no license file (figma.yaml fonts.licensed: false). Every frame in this package carries the flag; do not remove it. Beside each frame, 40 px below it and outside it, place a text layer named \"License notice\" in text style \"fine\" reading exactly: \"License flag raised: Saol Display, Saol Standard and Trade Gothic LT Std have no license file.\" (sources: figma.yaml fonts.licensed, brand-context.md).")
    L.append("")
    L.append("CANVAS")
    L.append("- One frame per module below, each %dx%d px, named \"P## <Name> %s\": prefix, space, name, never a dash between them. Place them on one shelf, 120 px apart." % (w, h, key))
    L.append("- Set each frame's variable mode for the collection \"%s\" to \"social\" (the 1080 canvas). Set no layout mode on anything inside the frame." % coll["layout"])
    L.append("- Ground: bind the fill to the variable color/semantic/background/default (%s) in \"%s\"; where a module sits on a photo, use the labelled placeholder below, never a palette fill to fake a photo." % (c["ground"], coll["semantic"]))
    L.append("- Side margin: variable space/social-margin (%s). Bind hairline stroke weights to component/rule/weight; never type a weight." % ctx["margin"])
    L.append("")
    L.append("LAYOUT (auto-layout, so copy can change length without breaking)")
    L.append("- Vertical auto-layout inside the safe margins; text hugs and fills so it reflows; the wordmark and star are absolutely positioned in layers prefixed \"Decor / \".")
    L.append("- No CTA is drawn: Meta adds it [observed, slotmap-paid.yaml header]. No price, percent, code, threshold or date is typed: those arrive as merge values.")
    L.append("")
    L.append("KEEP-CLEAR (UNVERIFIED)")
    if key == "9x16":
        L.append("- Story keep-clear top and bottom: safe_zone_top_px = null and safe_zone_bottom_px = null in brand-pack/placement-specs.json (status unverified). No number is given and none is guessed. Build as laid out, keep every text layer, mark and callout inside the side margin, and add no guide layer and no variable. Eddie confirms the 9:16 zone in Ads Manager placement preview (item paid-specs) before the masters are signed off.")
        L.append("- [observed] the wordmark sits 120 px from the foot in 27 board frames (slotmap-paid.yaml safe_zones.sign_off): a starting point to compare, not a rule.")
    else:
        L.append("- Feed %s has no platform overlay: slotmap-paid.yaml safe_zones.feed says feed padding follows the keep_clear_px of the engine placement file (not in the pack, not read here) and that HLR margins are layout tokens. Until it is confirmed, pad with the social margin (64px) [derived]. brand-pack/placement-specs.json holds null (unverified); owner Eddie, item paid-specs." % key)
    L.append("")
    L.append("ELEMENTS (per module, in this order; every layer name is a slot id)")
    L.append("")
    L.append("Shared on every module, carried over from the email elements by name:")
    L.append("- Place component \"Marks/Wordmark\" (node %s) at the foot, fill bound to component/mark/fill (%s; on photo component/mark/fill-on-photo, %s). Place component \"Marks/Star\" (%s) where the module's pattern uses it. Never redraw, stretch or recolor a mark." % (ctx["wordmark"], c["ink"], c["on_photo"], ctx["star"]))
    L.append("- Image area: rectangle named \"Image Placeholder\", fill %s (color/semantic/background/placeholder), label it \"IMAGE\" in text style \"label\", color %s (color/semantic/text/on-placeholder). No photo is cleared for these masters." % (c["placeholder"], c["placeholder_label"]))
    L.append("- Hairlines and callout leaders: stroke bound to component/rule/stroke and component/rule/weight; callout labels in color component/callout/label.")
    L.append("")
    for mod in mods:
        L.extend(module_block(ctx, mod, fmt))
    L.append("RULES")
    L.append("- Use ONLY these colors: %s (Onyx, ink), %s (Alabaster, ground), %s (white, on photo), %s (placeholder), bound to the variables named above. No gradients, no effects, no extra decoration." % (c["ink"], c["ground"], c["on_photo"], c["placeholder"]))
    L.append("- Use the library text styles by name (the roster: display/xl to display/s, headline, quote, title, link, price, script, body, eyebrow, label, cta, fine). The style sets face and size; never type a size or a face.")
    L.append("- Keep every text layer's name exactly as given: downstream tooling resolves by those names.")
    L.append("- If a font, variable, style or component is unavailable, stop and report it back instead of substituting.")
    L.append("")
    L.append("WHEN DONE")
    L.append("- Reply with the frame links or node ids. A closing pass (ours) is still owed: stamp the slots from the layer names (hlr:slot), run the canvas check for the social mode, flex-probe at 2x, slot_lint against slotmap-paid.yaml, and the contrast pairs. Until that pass runs these frames are not reachable by the copy engines and are not done.")
    L.append("```")
    L.append("")
    return L


def compile_all(today):
    ctx = build_context()
    L = []
    L.append("# Paid masters: agent package for the Figma build at 1:1, 4:5 and 9:16")
    L.append("")
    L.append("Generated %s by `crew/producers/figma_package.py` from `brand-pack/slotmap-paid.yaml`, `tokens.json`, `figma.yaml` and `placement-specs.json`. Backlog item `paid-package`, Phase 2 step 9. Paste one package at a time into Figma's native agent inside the HLR Library. Nothing here is sent to Figma by the runner." % today)
    L.append("")
    L.append("## Read first")
    L.append("")
    L.append("- **License flag, raised on every format.** Saol Display, Saol Standard and Trade Gothic LT Std have no license file (`figma.yaml` `fonts.licensed: false`, `brand-context.md`). Each package repeats it. Owner: HLR, Review 1.")
    L.append("- **Status of the source.** `slotmap-paid.yaml` is \"proposed, unbuilt\" and held for Review 2 (its header; DECISIONS 2026-10-18); backlog item `review-2-outcome` is waiting. The nine modules, their slots and roles are proposals, not rulings.")
    L.append("- **Single frames.** Each module is one frame per ratio. The Style and Callouts variants of the yaml (for example P01 Line or Masthead, P07 Card or List) and the component sets come later; every slot is listed so the frame can be trimmed.")
    L.append("- **Keep-clear bands are unverified.** `placement-specs.json` holds `null` for every number, status `unverified`, gap owner Eddie (item `paid-specs`). The story package says so and gives no number. The feed packages use the social margin only.")
    L.append("- **No budget is measured.** Every `max_chars` in `slotmap-paid.yaml` is `null` until a master is built and measured; each slot below says so. A null ceiling is read as no ceiling by the lint, so the build is where Eddie sets them.")
    L.append("- **Text styles per role are a proposal [derived].** The role to style map (hook, title, headline, offer to `headline`; body to `body`; eyebrow, subline to `eyebrow`; label, attribution to `label`; name to `title`; quote to `quote`; disclaimer to `fine`) is this generator's reading of the 15-style roster. Donnie ratifies a derived value; Eddie may swap a style in the build.")
    L.append("- **Copy is not in the package.** Each text layer holds its merge value `{{slot id}}`, filled from the paid writer's ad set by the crew. Module P02's name and P08's tiles come from the product database, never written.")
    L.append("- **Scope.** Meta only: P01 to P08 at 1:1, 4:5 and 9:16, and P09 (end frame) at 9:16. P10 (Google link image) and P11 (IAB display) are other platforms and are not in this package.")
    L.append("- **Carried over from the email elements:** the wordmark and star components, the hairline and leader strokes, the callout label color and the labelled grey placeholder. Email modules themselves do not carry over; paid has its own module set.")
    L.append("")
    for fmt in FORMATS:
        L.extend(package(ctx, fmt, today))
    text = "\n".join(L).rstrip() + "\n"
    return text, ctx


def lint(text, ctx=None):
    """Structure lint, one case per format. Returns a list of problem strings."""
    ctx = ctx or build_context()
    problems = []
    if EM in text:
        problems.append("em dash present")
    parts = re.split(r"(?m)^## Package ", text)[1:]
    if "proposed, unbuilt" not in text.split("## Package ")[0]:
        problems.append("source status (proposed, unbuilt) not stated")
    if len(parts) != len(FORMATS):
        problems.append("expected %d packages, found %d" % (len(FORMATS), len(parts)))
        return problems
    for fmt, part in zip(FORMATS, parts):
        key, (w, h) = fmt["key"], fmt["size"]
        tag = "[%s]" % key
        if "LICENSE FLAG (raised)" not in part:
            problems.append("%s license flag missing" % tag)
        if "fonts.licensed: false" not in part:
            problems.append("%s license evidence missing" % tag)
        if "%dx%d px" % (w, h) not in part:
            problems.append("%s canvas size %dx%d missing" % (tag, w, h))
        if "KEEP-CLEAR (UNVERIFIED)" not in part or "unverified" not in part.lower():
            problems.append("%s keep-clear not flagged unverified" % tag)
        if "new local variables" in part or "guide layer" in part.replace("add no guide layer", ""):
            problems.append("%s asks for a Figma write outside the frames" % tag)
        if "License notice" not in part or "have no license file." not in part:
            problems.append("%s license notice text missing" % tag)
        if "closing pass (ours) is still owed" not in part:
            problems.append("%s closing pass not named" % tag)
        if ctx["coll"]["layout"] not in part or ctx["coll"]["semantic"] not in part:
            problems.append("%s collections not named" % tag)
        want = []
        for mid in META_MODULES:
            mod = ctx["mods"].get(mid)
            if mod and key in mod["sizes"]:
                want.extend(s["id"] for s in mod["slots"])
        for sid in want:
            n = part.count('layer name "%s"' % sid)
            if n != 1:
                problems.append("%s slot %s appears %d times" % (tag, sid, n))
        got = re.findall(r'layer name "(P\d+\.[\w.]+)"', part)
        for sid in got:
            if sid not in want:
                problems.append("%s unknown slot %s" % (tag, sid))
        for line in part.splitlines():
            if 'layer name "P' in line and "budget" not in line:
                problems.append("%s slot line without a budget statement: %s" % (tag, line[:60]))
        for hexv in set(re.findall(r"#[0-9a-fA-F]{6}\b", part)):
            allowed = set(ctx["colors"].values())
            if hexv.lower() not in {a.lower() for a in allowed}:
                problems.append("%s hex %s not from tokens" % (tag, hexv))
        if key != "9x16" and "P09" in part:
            problems.append("%s P09 belongs to 9:16 only" % tag)
        if key == "9x16" and "P09" not in part:
            problems.append("%s P09 end frame missing" % tag)
    return problems


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--out", default=DEFAULT_OUT)
    ap.add_argument("--lint", metavar="FILE")
    ap.add_argument("--date", default=None)
    a = ap.parse_args(argv)
    if a.lint:
        probs = lint(read(a.lint))
        for p in probs:
            print("LINT:", p)
        print("lint: %s" % ("FAIL (%d)" % len(probs) if probs else "PASS"))
        return 1 if probs else 0
    today = a.date or datetime.date.today().isoformat()
    text, ctx = compile_all(today)
    probs = lint(text, ctx)
    if probs:
        for p in probs:
            print("LINT:", p)
        return 1
    os.makedirs(os.path.dirname(a.out), exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as fh:
        fh.write(text)
    print("wrote %s (%d lines)" % (os.path.relpath(a.out, ROOT), text.count("\n")))
    return 0


if __name__ == "__main__":
    sys.exit(main())
