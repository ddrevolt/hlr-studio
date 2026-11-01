#!/usr/bin/env python3
"""email_html: the HTML twins of the email module library (M01 to M27) and the assembler.

Twins:     python3 crew/producers/email_html.py twins [--out outputs/step-8-email/twins]
           writes M##-600.html and M##-1200.html per module, each slot shown as its own id (a fixture,
           never copy), plus index.json.
Assemble:  python3 crew/producers/email_html.py assemble --email <email.json> --out <file.html>
           [--width 600] [--header M01|M23] [--ground light|warm|deep|night] [--images images.json]
           renders the email writer's block list to one table-based HTML file for Klaviyo.
No Figma call, no network, standard library only. The Figma masters are 1200 wide (Gate 1 C8);
every size here is the 1200 design value times width/1200, so 600 and 1200 are the same layout.
Width: fixed pixel tables at 600 or 1200, no media query (a documented limit, report.md gap 7). Fonts: the families are named from tokens.json with web-safe fallbacks. The licenses are unconfirmed
(logo-assets.md, REVIEW.md rule 8): LICENSE FLAG on every file. Images and marks are labelled grey
placeholders until HLR supplies rights (rule 8) and vectors (logo-assets.md rule 5).
Provenance: sizes, leading, margin, colors come from brand-pack/web/tokens.flat.json (email canvas) [documented] or
[observed]; the column and image dimensions in LAYOUT are [derived] from slotmap.yaml notes and the
pattern review, to be compared with the Figma masters by Eddie (see outputs/step-8-email/report.md)."""
import argparse
import html
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
PACK = os.path.join(ROOT, "brand-pack")
sys.path.insert(0, os.path.join(ROOT, "crew", "checks"))

LICENSE_FLAG = "LICENSE FLAG: Saol Display, Saol Standard, Trade Gothic LT Std and Homemade Apple are not confirmed for web or email use (logo-assets.md; REVIEW.md rule 8). Fallback faces render here."
GROUNDS = {  # semantic background email-page modes [observed]; ink on deep and night is text-on-photo white [derived]
    "light": ("#ffffff", "#353535"), "warm": ("#beada3", "#353535"),
    "deep": ("#17280a", "#ffffff"), "night": ("#353535", "#ffffff"),
}
PLACEHOLDER = ("#dcd8d4", "#353535")  # component.placeholder fill and label [documented]
MUTED = "#63615f"  # color.semantic.text.muted [documented, tokens.json]
FONT = {
    "display": "'Saol Display', Georgia, 'Times New Roman', serif",
    "title": "'Saol Standard', Georgia, 'Times New Roman', serif",
    "body": "'Trade Gothic LT Std', 'Helvetica Neue', Arial, sans-serif",
    "script": "'Homemade Apple', 'Brush Script MT', cursive",
}
# Email canvas sizes at 1200 (tokens.flat.json canvas.email) and leading (tokens.flat.json; slotmap.yaml Review 1 notes).
TYPE = {  # name: (family, size, leading, weight, tracking_em, caps)
    "eyebrow": ("body", 30, 1.4, 700, 0.25, True),
    "label": ("body", 26, 1.4, 400, 0.2, True),
    "body": ("body", 34, 1.4, 400, 0, False),
    "title": ("title", 35, 1.2, 400, 0, False),
    "link": ("title", 46, 1.44, 400, 0, False),
    "headline": ("display", 94, 1.0, 400, 0, False),
    "quote": ("display", 64, 1.2, 400, 0, False),
    "hero": ("display", 106, 1.0, 400, 0, False),
    "script": ("script", 40, 1.4, 400, 0, False),
    "fine": ("body", 26, 1.4, 400, 0, False),
}
MARGIN = 80  # space.email-margin [observed]
GAP = 40     # space/10 [documented]
LAYOUT = {   # [derived] from slotmap.yaml notes; compare with the Figma masters
    "spotlight_image": (622, 812), "spotlight_copy": 338,
    "statement_head": 860, "statement_body": 740,
    "mat_image": (1040, 780), "bleed_image": (1200, 900),
    "feature_image": (500, 625), "square_image": (500, 500), "tall_hero_spacer": 504,
    "hero_height": 1000, "header_height": 200, "promo_height": 100,
    "spec_image": 240, "collage_gap": 40, "pad_y": 120,
}
EM_RE = re.compile(r"_([^_]+)_")


class UnfilledSlot(Exception):
    pass


class Ctx:
    """Rendering context: width, scale, ground, slot values, image urls, links."""

    def __init__(self, width=600, ground="light", values=None, images=None, cta_href="#", fixture=False):
        self.width, self.k = width, width / 1200.0
        self.ground, self.values, self.images = ground, values or {}, images or {}
        self.bg, self.ink = GROUNDS[ground]
        self.cta_href, self.fixture = cta_href, fixture
        self.used, self.tokens = [], set()

    def px(self, n):
        v = round(n * self.k, 1)
        return ("%d" % v) if v == int(v) else ("%.1f" % v)

    def slot(self, sid, optional=False):
        self.used.append(sid)
        if sid in self.values and self.values[sid] not in (None, ""):
            return self.values[sid]
        if self.fixture:
            return "[%s]" % sid
        if optional:
            return None
        raise UnfilledSlot(sid)


TOKEN_RE = re.compile(r"(\{\{[a-z_0-9]+\}\})")


def esc(text):
    """Escape a slot value; _word_ becomes the italic accent; {{merge_tokens}} pass through untouched."""
    out = []
    for piece in TOKEN_RE.split(text):
        if TOKEN_RE.fullmatch(piece):
            out.append(piece)
        else:
            out.append(EM_RE.sub(lambda m: "<em>%s</em>" % m.group(1), html.escape(piece, quote=True)))
    return "".join(out).replace("\n", "<br>")


def style(ctx, name, color=None, align="left", extra=""):
    fam, size, lead, weight, track, caps = TYPE[name]
    return ("font-family:%s;font-size:%spx;line-height:%spx;font-weight:%d;letter-spacing:%sem;color:%s;text-align:%s;%s%s"
            % (FONT[fam], ctx.px(size), ctx.px(round(size * lead, 2)), weight, track, color or ctx.ink, align,
               "text-transform:uppercase;" if caps else "", "overflow-wrap:break-word;word-break:break-word;" + extra))


def para(ctx, name, text, align="left", color=None, pad_b=0, tag="td", extra=""):
    return '<tr><td align="%s" style="%spadding-bottom:%spx;">%s</td></tr>' % (
        align, style(ctx, name, color, align, extra), ctx.px(pad_b), esc(text))


def table(ctx, inner, width=None, bg=None, pad=(0, 0), align="center", extra=""):
    w = ctx.px(width) if width else ctx.px(1200)
    return ('<table role="presentation" width="%s" cellpadding="0" cellspacing="0" border="0" align="%s" '
            'style="width:%spx;%s%s"%s>%s</table>' % (
                w, align, w, ("background-color:%s;" % bg) if bg else "", extra,
                (' bgcolor="%s"' % bg) if bg else "", inner))


def module(ctx, rows, name, pad_y=None, bg=None, inner_w=None):
    """A full-width band: ground color, vertical padding, content column of the margin width."""
    py = ctx.px(LAYOUT["pad_y"] if pad_y is None else pad_y)
    iw = inner_w or 1200 - 2 * MARGIN
    inner = table(ctx, rows, iw)
    cell = ('<tr><td align="center" style="padding:%spx %spx;">%s</td></tr>' % (py, ctx.px(MARGIN), inner))
    return '<!-- %s -->\n%s' % (name, table(ctx, cell, 1200, bg or ctx.bg))


def placeholder(ctx, key, w, h, label, rounded=False):
    """An image well: the real image when images[key] is given, else a labelled grey placeholder."""
    url = ctx.images.get(key)
    if url:
        return '<img src="%s" width="%s" height="%s" alt="%s" style="display:block;width:%spx;height:%spx;border:0;">' % (
            html.escape(url, True), ctx.px(w), ctx.px(h), html.escape(label, True), ctx.px(w), ctx.px(h))
    return ('<table role="presentation" width="%s" cellpadding="0" cellspacing="0" border="0" style="width:%spx;" bgcolor="%s">'
            '<tr><td height="%s" align="center" valign="middle" style="height:%spx;background-color:%s;%s">%s</td></tr></table>' % (
                ctx.px(w), ctx.px(w), PLACEHOLDER[0], ctx.px(h), ctx.px(h), PLACEHOLDER[0],
                style(ctx, "fine", PLACEHOLDER[1], "center"), html.escape("[image placeholder: %s]" % label if w >= 200 else "[star]")))


def mark(ctx, key, w, h, label):
    return placeholder(ctx, key, w, h, "%s (placed mark, logo-assets.md)" % label)


def cta(ctx, label_slot, surface="ground", filled=False, align="center", href=None):
    label = ctx.slot(label_slot)
    ink, fill = (ctx.ink, ctx.bg) if surface == "ground" else ("#ffffff", "#353535")
    if filled:
        bgc, fg, border = ink, ctx.bg, ink
    else:
        bgc, fg, border = "transparent", ink, ink
    bw = max(1, round(1 * ctx.k))
    href = href or ctx.cta_href
    ctx.tokens.update(re.findall(r"\{\{[a-z_0-9]+\}\}", href))
    return ('<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="%s"><tr>'
            '<td align="center" style="border:%dpx solid %s;background-color:%s;padding:%spx %spx;">'
            '<a href="%s" style="%stext-decoration:none;">%s</a></td></tr></table>' % (
                align, bw, border, bgc, ctx.px(28), ctx.px(56), html.escape(href, True),
                style(ctx, "label", fg, "center"), esc(label)))


def link(ctx, label_slot, href="#", align="left", arrow=True):
    label = ctx.slot(label_slot)
    ctx.tokens.update(re.findall(r"\{\{[a-z_0-9]+\}\}", href))
    return '<a href="%s" style="%stext-decoration:underline;">%s%s</a>' % (
        html.escape(href, True), style(ctx, "link", ctx.ink, align), esc(label), " &rarr;" if arrow else "")


def spacer(ctx, h):
    return '<tr><td height="%s" style="height:%spx;font-size:0;line-height:0;">&nbsp;</td></tr>' % (ctx.px(h), ctx.px(h))


def row(ctx, inner, align="left", pad_b=0):
    return '<tr><td align="%s" style="padding-bottom:%spx;">%s</td></tr>' % (align, ctx.px(pad_b), inner)


def two_col(ctx, left, right, lw, rw, gap=GAP, valign="middle"):
    return ('<tr><td><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="%s" style="width:%spx;"><tr>'
            '<td width="%s" valign="%s" style="width:%spx;">%s</td><td width="%s" style="width:%spx;font-size:0;">&nbsp;</td>'
            '<td width="%s" valign="%s" style="width:%spx;">%s</td></tr></table></td></tr>' % (
                ctx.px(lw + gap + rw), ctx.px(lw + gap + rw), ctx.px(lw), valign, ctx.px(lw), left,
                ctx.px(gap), ctx.px(gap), ctx.px(rw), valign, ctx.px(rw), right))


def copy_table(ctx, rows_html, width):
    return table(ctx, rows_html, width)


def opt(ctx, name, default):
    return ctx.values.get("@" + name, default)


# ---------------------------------------------------------------- modules
# Each builder returns the HTML of one module and reads slots through ctx.slot, so a twin cannot
# use a slot the slot map does not name; SLOTS_USED in the tests proves the match.

def m01(c):
    return module(c, row(c, mark(c, "M01.wordmark", 560, 60, "Marks/Wordmark"), "center"), "M01 Header", pad_y=(LAYOUT["header_height"] - 60) / 2)


def m23(c):
    return module(c, row(c, mark(c, "M23.lockup", 420, 120, "Marks/Lockup"), "center"), "M23 Lockup header", pad_y=(LAYOUT["header_height"] - 120) / 2)


def m02(c):
    if c.images.get("M02.image"):
        c.ink = "#ffffff"  # text on a photo is white (text-on-photo [documented]; the scrim is the designer's call)
    eyebrow = c.slot("M02.eyebrow", True)
    head = c.slot("M02.headline")
    body = c.slot("M02.body", True)
    script = c.slot("M02.script", True)
    rows = ""
    if opt(c, "tall", False):
        rows += spacer(c, LAYOUT["tall_hero_spacer"])
    if eyebrow:
        rows += para(c, "eyebrow", eyebrow, "center", pad_b=GAP)
    rows += para(c, "hero", head, "center", pad_b=GAP)
    if body:
        rows += para(c, "body", body, "center", pad_b=GAP)
    if script:
        rows += para(c, "script", script, "center", pad_b=GAP)
    if opt(c, "show_cta", True):
        rows += row(c, cta(c, "E01.label", "photo" if c.images.get("M02.image") else "ground"), "center")
    url = c.images.get("M02.image")
    inner = table(c, rows, 1200 - 2 * MARGIN)
    if url:
        bgattr = ' background="%s" style="background-image:url(%s);background-size:cover;background-position:center;background-color:#353535;"' % (html.escape(url, True), html.escape(url, True))
        ink_note = "photo"
    else:
        bgattr = ' bgcolor="%s" style="background-color:%s;"' % (PLACEHOLDER[0], PLACEHOLDER[0])
        ink_note = "placeholder"
    cell = ('<tr><td align="center" valign="middle" height="%s"%s><div style="font-size:0;line-height:0;">&nbsp;</div>'
            '<table role="presentation" width="%s" cellpadding="0" cellspacing="0" border="0" style="width:%spx;">'
            '<tr><td align="center" style="padding:%spx %spx;">%s</td></tr></table></td></tr>' % (
                c.px(LAYOUT["hero_height"]), bgattr, c.px(1200), c.px(1200), c.px(LAYOUT["pad_y"]), c.px(MARGIN), inner))
    return '<!-- M02 Hero (photo well: %s) -->\n%s' % (ink_note, table(c, cell, 1200))


def m03(c):
    eyebrow, name = c.slot("M03.eyebrow"), c.slot("M03.name")
    iw, ih = LAYOUT["spotlight_image"]
    copy = table(c, para(c, "eyebrow", eyebrow, "left", pad_b=GAP) + para(c, "headline", name, "left", pad_b=GAP)
                 + row(c, link(c, "E02.label", "{{cta_url}}")), LAYOUT["spotlight_copy"])
    img = placeholder(c, "M03.image", iw, ih, "E05 product image")
    left, right = (img, copy) if opt(c, "image", "right") == "left" else (copy, img)
    lw, rw = (iw, LAYOUT["spotlight_copy"]) if opt(c, "image", "right") == "left" else (LAYOUT["spotlight_copy"], iw)
    inner = two_col(c, left, right, lw, rw, gap=80)
    return module(c, inner, "M03 Spotlight", inner_w=lw + 80 + rw)


def m04(c):
    stmt = opt(c, "style", "standard") == "statement"
    align = opt(c, "align", "left")
    eyebrow = c.slot("M04.eyebrow", True)
    head = c.slot("M04.headline", True) if opt(c, "show_headline", True) else None
    body = c.slot("M04.body", True) if opt(c, "show_body", True) else None
    rows = ""
    if eyebrow:
        rows += para(c, "eyebrow", eyebrow, align, pad_b=GAP)
    if head:
        rows += para(c, "quote" if stmt else "headline", head, align, pad_b=GAP)
    if body:
        rows += para(c, "body", body, align, pad_b=GAP)
    if opt(c, "show_cta", False):
        rows += row(c, cta(c, "E01.label"), align)
    w = LAYOUT["statement_head"] if stmt else 1200 - 2 * MARGIN
    return module(c, table(c, rows, w), "M04 Text block", inner_w=w)


def m05(c):
    bleed = opt(c, "shape", "mat") == "bleed"
    w, h = LAYOUT["bleed_image" if bleed else "mat_image"]
    if bleed:
        return '<!-- M05 Image, full bleed -->\n' + table(c, row(c, placeholder(c, "M05.image", w, h, "E04 image, full bleed")), 1200)
    return module(c, row(c, placeholder(c, "M05.image", w, h, "E04 image, mat")), "M05 Image", pad_y=GAP)


def _card(c, i, name_slot, align, label_slot=None, price=False, size=500):
    name = c.slot(name_slot)
    key = "card%d" % i
    img = placeholder(c, key, size, size, "E05 product image: %s" % name)
    rows = row(c, img, align, pad_b=GAP / 2)
    if label_slot:
        lab = c.slot(label_slot, True)
        if lab:
            rows += para(c, "eyebrow", lab, align, pad_b=GAP / 4)
    rows += para(c, "title", name, align, pad_b=GAP / 2)
    if price:
        p = c.slot("E06.price", True)
        if p:
            rows += para(c, "title", p, align, pad_b=GAP / 2)
    return table(c, rows, size)


def _grid(c, n_cols, name_slot, link_slot, total, size, align, heading_slot, cards=None, label_slot=None):
    """Heading and a grid of cards with a row of links under each row of cards."""
    rows = ""
    head = c.slot(heading_slot, True)
    if head:
        rows += para(c, "headline", head, align, pad_b=GAP)
    cards = cards or [{"slots": {}}] * total
    gap = GAP if n_cols == 2 else GAP // 2 or 20
    for r0 in range(0, len(cards), n_cols):
        chunk = cards[r0:r0 + n_cols]
        cells = ""
        for j, card in enumerate(chunk):
            i = r0 + j
            saved = dict(c.values)
            c.values.update(card.get("slots", {}))
            tile = _card(c, i, name_slot, align, label_slot, size=size)
            href = card.get("href") or "{{cta_url}}"
            ln = link(c, link_slot, href)
            c.values = saved
            cells += '<td valign="top" width="%s" style="width:%spx;">%s%s%s</td>' % (
                c.px(size), c.px(size), tile, "<div style='height:%spx;font-size:0;line-height:0;'>&nbsp;</div>" % c.px(GAP / 2), ln)
            if j < len(chunk) - 1:
                cells += '<td width="%s" style="width:%spx;font-size:0;">&nbsp;</td>' % (c.px(gap), c.px(gap))
        rows += row(c, '<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="%s"><tr>%s</tr></table>' % (
            "center" if align == "center" else "left", cells), align, pad_b=GAP * 1.5)
    return rows


def m06(c):
    align = opt(c, "align", "left")
    cards = opt(c, "cards", None) or [{"slots": {"E06.name": c.values.get("E06.name", "[E06.name]"), "E02.label": c.values.get("E02.label", "[E02.label]")}}] * (4 if opt(c, "second_row", True) else 2)
    rows = _grid(c, 2, "E06.name", "E02.label", len(cards), 500, align, "M06.heading", cards)
    return module(c, rows, "M06 Product grid")


def m07(c):
    rows = para(c, "quote", c.slot("M07.mantra"), "center", pad_b=GAP)
    s = c.slot("M07.script", True) if opt(c, "show_script", True) else None
    if s:
        rows += para(c, "script", s, "center")
    return module(c, table(c, rows, LAYOUT["statement_body"] + 120), "M07 Mantra", inner_w=LAYOUT["statement_body"] + 120)


def m08(c):
    line = '<span style="%s">%s</span>' % (style(c, "label", "#ffffff", "center"), esc(c.slot("M08.line")))
    cell = '<tr><td align="center" style="padding:%spx %spx;">%s</td></tr>' % (c.px(30), c.px(MARGIN), line)
    return "<!-- M08 Promo bar -->\n" + table(c, cell, 1200, GROUNDS["night"][0])


def _footer(c, stacked):
    n = [c.slot("M%s.nav%d.label" % ("24" if stacked else "09", i)) for i in (1, 2, 3)]
    pre = "M24" if stacked else "M09"
    rows = ""
    if opt(c, "show_star", True) and not stacked:
        rows += row(c, mark(c, pre + ".star", 64, 71, "E15 Star"), "center", pad_b=GAP)
    rows += row(c, mark(c, pre + ".wordmark", 520, 55, "Marks/Wordmark"), "center", pad_b=GAP)
    if stacked:
        for t in n:
            rows += para(c, "label", t, "center", pad_b=GAP / 2)
    else:
        links = []
        for i, t in enumerate(n, 1):
            href = "{{footer_nav_%d_url}}" % i
            c.tokens.add(href)
            links.append('<a href="%s" style="color:%s;text-decoration:none;">%s</a>' % (href, c.ink, esc(t)))
        rows += row(c, '<span style="%s">%s</span>' % (style(c, "label", c.ink, "center"), "  |  ".join(links)), "center", pad_b=GAP)
    rows += para(c, "fine", c.slot(pre + ".disclaimer"), "center", color=MUTED if c.ink == GROUNDS["light"][1] else c.ink, pad_b=GAP / 2)
    legal = c.slot(pre + ".legal", True) if opt(c, "show_legal", True) else None
    if legal:
        rows += para(c, "fine", legal, "center", color=MUTED if c.ink == GROUNDS["light"][1] else c.ink)
        c.tokens.update(re.findall(r"\{\{[a-z_0-9]+\}\}", legal))
    return module(c, rows, "%s Footer%s" % (pre, ", stacked" if stacked else ""))


def m09(c):
    return _footer(c, False)


def m24(c):
    return _footer(c, True)


def m10(c):
    if opt(c, "style", "rule") == "star":
        return module(c, row(c, mark(c, "M10.star", 64, 71, "E15 Star"), "center"), "M10 Divider, star", pad_y=GAP)
    return module(c, '<tr><td style="border-top:%dpx solid %s;font-size:0;line-height:0;">&nbsp;</td></tr>' % (max(1, round(c.k)), c.ink), "M10 Divider, rule", pad_y=GAP)


def _feature(c, name, head_style, slots, numbered=False):
    eyebrow = c.slot(slots["eyebrow"], True) if "eyebrow" in slots else None
    head = c.slot(slots["headline"])
    body = c.slot(slots["body"])
    rows = ""
    if eyebrow:
        rows += para(c, "eyebrow", eyebrow, "left", pad_b=GAP)
    rows += para(c, head_style, head, "left", pad_b=GAP)
    rows += para(c, "body", body, "left", pad_b=GAP)
    if opt(c, "show_cta", True):
        rows += row(c, cta(c, slots["cta"], "ground"), "left")
    iw, ih = LAYOUT["feature_image"]
    cw = 1200 - 2 * MARGIN - iw - 80
    img = placeholder(c, name + ".image", iw, ih if not opt(c, "tall", False) else ih * 1.3, "E05 product image")
    copy = table(c, rows, cw)
    left, right = (img, copy) if opt(c, "image", "right") == "left" else (copy, img)
    lw, rw = (iw, cw) if opt(c, "image", "right") == "left" else (cw, iw)
    return module(c, two_col(c, left, right, lw, rw, gap=80), name)


def m11(c):
    return _feature(c, "M11 Edit feature", "headline", {"eyebrow": "M11.eyebrow", "headline": "M11.headline", "body": "M11.body", "cta": "M11.cta"})


def m12(c):
    return _feature(c, "M12 Numbered feature", "headline", {"headline": "M12.headline", "body": "M12.body", "cta": "M12.cta"})


def m13(c):
    head, lst = c.slot("M13.heading"), c.slot("M13.list")
    items = "".join('<tr><td valign="top" width="%s" style="width:%spx;%s">&bull;</td><td style="%spadding-bottom:%spx;">%s</td></tr>' % (
        c.px(40), c.px(40), style(c, "body"), style(c, "body"), c.px(GAP / 2), esc(t)) for t in lst.split("\n") if t.strip())
    iw = 500
    colw = 460 if opt(c, "show_image", True) else 1200 - 2 * MARGIN
    rows = para(c, "headline", head, "left", pad_b=GAP) + row(c, table(c, items, colw), "left", pad_b=GAP) + row(c, cta(c, "E01.label"), "left")
    img = placeholder(c, "M13.image", iw, 625, "E04 image, mat")
    inner = two_col(c, table(c, rows, 460), img, 460, iw, gap=80) if opt(c, "show_image", True) else rows
    return module(c, inner, "M13 Product details")


def m14(c):
    return module(c, row(c, cta(c, "E01.label"), "center"), "M14 CTA", pad_y=GAP * 2)


def m15(c):
    cards = opt(c, "cards", None) or [{"slots": {}}] * (6 if opt(c, "second_row", True) else 3)
    rows = _grid(c, 3, "E07.name", "E02.label", len(cards), 320, "left", "M15.heading", cards, label_slot="E07.label")
    return module(c, rows, "M15 Product grid, three up")


def m16(c):
    head, body = c.slot("M16.headline"), c.slot("M16.body")
    cw = (1200 - 2 * MARGIN - 80) / 2
    inset = opt(c, "style", "plain") == "inset"
    l = table(c, para(c, "headline", head, "left"), cw)
    r = table(c, para(c, "body", body, "left"), cw)
    return module(c, two_col(c, l, r, cw, cw, gap=80, valign="top"), "M16 Two-column text", bg=PLACEHOLDER[0] if inset and c.ground == "light" else None)


def m17(c):
    eyebrow = c.slot("M17.eyebrow", True) if opt(c, "show_eyebrow", True) else None
    head = c.slot("M17.headline", True) if opt(c, "show_headline", True) else None
    body = c.slot("M17.body")
    sign = c.slot("M17.signoff")
    rows = ""
    if eyebrow:
        rows += para(c, "eyebrow", eyebrow, "left", pad_b=GAP)
    if head:
        rows += para(c, "headline", head, "left", pad_b=GAP)
    for p in body.split("\n\n"):
        rows += para(c, "body", p, "left", pad_b=GAP / 2 + 10)
    rows += para(c, "script", sign, "left")
    return module(c, table(c, rows, 860), "M17 Letter", inner_w=860)


def m18(c):
    layout = opt(c, "layout", "split")
    quote, body, attr = c.slot("M18.quote"), c.slot("M18.body"), c.slot("M18.attribution")
    stars = '<span style="%s">&#9733;&#9733;&#9733;&#9733;&#9733;</span>' % style(c, "title")
    centered = layout == "centered"
    al = "center" if centered else "left"
    rows = row(c, stars, al, pad_b=GAP / 2) + para(c, "quote", quote, al, pad_b=GAP) + para(c, "body", body, al, pad_b=GAP / 2) + para(c, "label", attr, al, pad_b=GAP)
    if opt(c, "show_press", False):
        rows += row(c, placeholder(c, "M18.press", 300, 60, "E10 press logo, rights not cleared"), al, pad_b=GAP)
    if centered:
        return module(c, table(c, rows, 860), "M18 Review, centered", inner_w=860)
    rows += row(c, link(c, "E02.label", "{{cta_url}}"), al)
    iw = 500
    img = placeholder(c, "M18.image", iw, 625, "E05 product image")
    cw = 1200 - 2 * MARGIN - iw - 80
    left, right = (table(c, rows, cw), img) if layout == "split" else (img, table(c, rows, cw))
    lw, rw = (cw, iw) if layout == "split" else (iw, cw)
    return module(c, two_col(c, left, right, lw, rw, gap=80), "M18 Review, split")


def m19(c):
    rows = para(c, "eyebrow", c.slot("M19.eyebrow"), "center", pad_b=GAP) + para(c, "headline", c.slot("M19.headline"), "center", pad_b=GAP) \
        + para(c, "fine", c.slot("M19.terms"), "center", color=MUTED if c.ink == GROUNDS["light"][1] else c.ink, pad_b=GAP)
    if opt(c, "show_cta", True):
        rows += row(c, cta(c, "E01.label"), "center")
    return module(c, table(c, rows, 860), "M19 Offer", inner_w=860)


def m20(c):
    w = (1200 - 2 * MARGIN - LAYOUT["collage_gap"]) / 2
    a = placeholder(c, "M20.image1", w, w * 1.25, "E05 product image")
    b = placeholder(c, "M20.image2", w, w * 1.25, "E05 product image")
    return module(c, two_col(c, a, b, w, w, gap=LAYOUT["collage_gap"], valign="top"), "M20 Collage", pad_y=GAP)


def m21(c):
    n = 4 if opt(c, "rows34", True) else 2
    rows = ""
    for i in range(1, n + 1):
        lab, bod = c.slot("M21.row%d.label" % i), c.slot("M21.row%d.body" % i)
        img = placeholder(c, "M21.image%d" % i, LAYOUT["spec_image"], LAYOUT["spec_image"], "E05 product image")
        cw = 1200 - 2 * MARGIN - LAYOUT["spec_image"] - GAP
        txt = table(c, para(c, "title", lab, "left", pad_b=GAP / 2) + para(c, "body", bod, "left"), cw)
        rows += two_col(c, img, txt, LAYOUT["spec_image"], cw, gap=GAP, valign="middle")
        rows += spacer(c, GAP)
    return module(c, rows, "M21 Spec rows")


def m22(c):
    rows = para(c, "eyebrow", c.slot("M22.eyebrow"), "center", pad_b=GAP) + para(c, "headline", c.slot("M22.headline"), "center", pad_b=GAP) \
        + para(c, "body", c.slot("M22.body"), "center", pad_b=GAP) + row(c, cta(c, "E01.label"), "center")
    return module(c, table(c, rows, 860), "M22 Follow block", inner_w=860)


def m25(c):
    rows = para(c, "body", c.slot("M25.line"), "center", pad_b=GAP) + row(c, placeholder(c, "M25.icons", 480, 60, "social icons, marks not supplied"), "center")
    return module(c, rows, "M25 Social footer", pad_y=GAP * 2)


def m26(c):
    rows = para(c, "headline", c.slot("M26.headline"), "left", pad_b=GAP) + para(c, "body", c.slot("M26.body"), "left", pad_b=GAP)
    rows += row(c, cta(c, "E01.label"), "left", pad_b=GAP)
    cl = c.slot("M26.closing", True) if opt(c, "show_closing", False) else None
    if cl:
        rows += para(c, "body", cl, "left")
    return module(c, table(c, rows, 860), "M26 Transactional card", inner_w=860)


def m27(c):
    rows = para(c, "headline", c.slot("M27.title"), "center", pad_b=GAP / 2) + para(c, "label", c.slot("M27.date"), "center")
    return module(c, rows, "M27 Ritualist masthead", pad_y=GAP * 2)


BUILDERS = {"M01": m01, "M02": m02, "M03": m03, "M04": m04, "M05": m05, "M06": m06, "M07": m07, "M08": m08,
            "M09": m09, "M10": m10, "M11": m11, "M12": m12, "M13": m13, "M14": m14, "M15": m15, "M16": m16,
            "M17": m17, "M18": m18, "M19": m19, "M20": m20, "M21": m21, "M22": m22, "M23": m23, "M24": m24,
            "M25": m25, "M26": m26, "M27": m27}


def page(ctx, bodies, title="HLR email twin", preview=None):
    pre = ""
    if preview:
        pre = ('<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#ffffff;">%s</div>' % html.escape(preview))
    return ('<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
            '<title>%s</title></head>\n<!-- %s -->\n<body style="margin:0;padding:0;background-color:#ffffff;">%s'
            '<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"><tr><td align="center">\n%s\n</td></tr></table></body></html>\n'
            % (html.escape(title), LICENSE_FLAG, pre, "\n".join(bodies)))


# ---------------------------------------------------------------- twins
def fixture_ctx(mid, width, extra=None):
    c = Ctx(width, "light", fixture=True)
    c.values.update(extra or {})
    return c


# The states a twin renders in, so every option the slot map names has a twin.
TWIN_STATES = {
    "M02": {"@tall": False}, "M03": {"@image": "right"},
    "M04": {"@style": "standard", "@align": "left", "M04.eyebrow": "[M04.eyebrow]", "@show_cta": True},
    "M06": {"@cards": [{"slots": {"E06.name": "[E06.name]", "E02.label": "[E02.label]"}}] * 4},
    "M15": {"@cards": [{"slots": {"E07.name": "[E07.name]", "E07.label": "[E07.label]", "E02.label": "[E02.label]"}}] * 6},
    "M09": {"@show_legal": True}, "M24": {"@show_legal": True},
}


def build_twin(mid, width):
    c = fixture_ctx(mid, width, TWIN_STATES.get(mid))
    body = BUILDERS[mid](c)
    return page(c, [body], "HLR %s twin %d" % (mid, width)), c


def cmd_twins(a):
    os.makedirs(a.out, exist_ok=True)
    index = {}
    for mid in sorted(BUILDERS):
        for w in (600, 1200):
            doc, c = build_twin(mid, w)
            with open(os.path.join(a.out, "%s-%d.html" % (mid, w)), "w", encoding="utf-8") as fh:
                fh.write(doc)
        index[mid] = sorted(set(c.used))
    with open(os.path.join(a.out, "index.json"), "w", encoding="utf-8") as fh:
        json.dump(index, fh, indent=1)
        fh.write("\n")
    print("wrote %d twins x 2 widths to %s" % (len(index), a.out))


# ---------------------------------------------------------------- assembler
def product_href(pid):
    return "{{url_%s}}" % re.sub(r"[^a-z0-9]+", "_", pid.lower()).strip("_")


def assemble(email, width=600, header="M01", ground="light", images=None):
    """Render the email writer's block list to (html, report). Raises UnfilledSlot."""
    cta_doc = email["cta"]
    parts, report = [], {"modules": [], "tokens": set(), "slots_used": []}

    def add(mid, values, options=None, extra_ctx=None):
        c = Ctx(width, ground, dict(values), images or {}, cta_href=cta_doc.get("link_token", "{{cta_url}}"))
        c.values.update(options or {})
        parts.append(BUILDERS[mid](c))
        report["modules"].append(mid)
        report["tokens"].update(c.tokens)
        report["slots_used"] += c.used

    add(header, {})
    hero = email["hero"]
    add(hero["module"], hero["slots"], {"@tall": False})
    for b in email["blocks"]:
        vals = dict(b.get("slots", {}))
        opts = {}
        if b["module"] == "M06":
            opts["@cards"] = [{"slots": dict(cd["slots"]), "href": product_href(cd["product_id"])} for cd in b.get("cards", [])]
            opts["@second_row"] = len(b.get("cards", [])) > 2
        if b["module"] == "M04":
            opts["@show_cta"] = "E01.label" in vals
            opts["@show_headline"] = "M04.headline" in vals
            opts["@show_body"] = "M04.body" in vals
        add(b["module"], vals, opts)
    add("M14", {"E01.label": cta_doc["label"]})
    foot = email["footer"]
    nav = {"M09.nav%d.label" % i: "{{footer_nav_%d_label}}" % i for i in (1, 2, 3)}
    legal = "%s | <a href=\"%s\">{{unsubscribe_label}}</a>" % (foot["legal_tokens"][1], foot["legal_tokens"][0]) if len(foot.get("legal_tokens", [])) == 2 else None
    fvals = dict(nav)
    fvals["M09.disclaimer"] = foot["disclaimer_token"]
    if legal:
        fvals["M09.legal"] = legal
    add(foot["module"], fvals, {"@show_legal": bool(legal)})
    subj = email["subjects"][0]
    doc = page(Ctx(width), parts, subj["subject"], subj["preview"])
    # the legal slot carries an anchor on purpose; every other slot is escaped text
    doc = doc.replace("{{postal_address}} | &lt;a href=&quot;{{unsubscribe_url}}&quot;&gt;{{unsubscribe_label}}&lt;/a&gt;",
                      '{{postal_address}} | <a href="{{unsubscribe_url}}" style="color:inherit;">{{unsubscribe_label}}</a>')
    report["tokens"].update(re.findall(r"\{\{[a-z_0-9]+\}\}", doc))
    report["tokens"] = sorted(report["tokens"])
    return doc, report


def cmd_assemble(a):
    with open(a.email, encoding="utf-8") as fh:
        email = json.load(fh)
    images = json.load(open(a.images, encoding="utf-8")) if a.images else None
    doc, report = assemble(email, a.width, a.header, a.ground, images)
    with open(a.out, "w", encoding="utf-8") as fh:
        fh.write(doc)
    print("wrote %s (%d modules, width %d)" % (a.out, len(report["modules"]), a.width))
    print("merge tokens left for the ESP: " + ", ".join(report["tokens"]))
    return 0


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    t = sub.add_parser("twins")
    t.add_argument("--out", default=os.path.join(ROOT, "outputs", "step-8-email", "twins"))
    s = sub.add_parser("assemble")
    s.add_argument("--email", required=True)
    s.add_argument("--out", required=True)
    s.add_argument("--width", type=int, default=600, choices=(600, 1200))
    s.add_argument("--header", default="M01", choices=("M01", "M23"))
    s.add_argument("--ground", default="light", choices=sorted(GROUNDS))
    s.add_argument("--images", default=None, help="JSON of image urls keyed by well, e.g. M02.image, card0")
    a = ap.parse_args(argv)
    try:
        return cmd_twins(a) if a.cmd == "twins" else cmd_assemble(a)
    except UnfilledSlot as e:
        print("FAIL: unfilled slot %s" % e)
        return 1


if __name__ == "__main__":
    sys.exit(main() or 0)
