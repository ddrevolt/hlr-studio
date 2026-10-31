"""HTML twins of the module library: one table-based fragment per module (M01 to M27) at a canvas width
(1200 is the Figma email master, 600 is the same module at half scale). Built from brand-pack/web/tokens.css
(colors, faces, tracking) and brand-pack/web/tokens.flat.json (the email canvas sizes), with the slots from
brand-pack/slotmap.yaml as {{slot.id}} placeholders. A slot the slot map marks as an option is wrapped in
<!--opt:ID--> markers so the assembler can drop it unfilled. Images are grey labelled placeholders, never an
invented photo. Standard library only; no Figma, no network."""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(HERE)))
sys.path.insert(0, os.path.join(ROOT, "crew", "checks"))
import common  # noqa: E402

PACK = os.path.join(ROOT, "brand-pack")


def css_vars():
    text = common.read_text(os.path.join(PACK, "web", "tokens.css"))
    text = text[:text.index("}", text.index(":root"))]  # the default canvas only; later blocks are ground modes
    return dict(re.findall(r"--hlr-([a-z0-9-]+):\s*([^;]+);", text))


def email_sizes():
    flat = common.read_json(os.path.join(PACK, "web", "tokens.flat.json"))
    out = {}
    for k, v in flat.items():
        if k.startswith("font.size.") and "canvas" in v:
            out[k.split(".")[-1]] = int(v["canvas"]["email"].replace("px", ""))
    out["margin"] = int(flat["space.email-margin"]["value"].replace("px", ""))
    return out


V = css_vars()
SZ = email_sizes()
INK = V["color-semantic-text-primary"]
MUTED = V["color-semantic-text-muted"]
PAGE = V["color-semantic-background-email-page"]
GROUND = V["color-semantic-background-default"]
PLACE = V["color-semantic-background-placeholder"]
ON_PLACE = V["color-semantic-text-on-placeholder"]
DISPLAY = "'%s', Georgia, 'Times New Roman', serif" % V["font-family-display"]
TITLE = "'%s', Georgia, 'Times New Roman', serif" % V["font-family-title"]
BODY = "'%s', Arial, Helvetica, sans-serif" % V["font-family-body"]
SCRIPT = "'%s', cursive" % V["font-family-script"]

HEADER = {"M01", "M23"}
IMAGE_ONLY = {"M05": 1, "M20": 2}
CARD_GRID = {"M06": ("E06", 2), "M15": ("E07", 3)}


def style_for(role, scale):
    """CSS for a slot role at a scale (1.0 is the 1200 canvas)."""
    def px(n):
        return "%dpx" % max(1, round(n * scale))
    base = "margin:0;padding:0;text-align:center;color:%s;" % INK
    if role == "eyebrow" or role == "label":
        return base + "font-family:%s;font-size:%s;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;line-height:1.4;" % (BODY, px(SZ["eyebrow"]))
    if role in ("headline", "name"):
        return base + "font-family:%s;font-size:%s;font-weight:400;line-height:1.1;" % (DISPLAY, px(SZ["headline"]))
    if role in ("heading", "title"):
        return base + "font-family:%s;font-size:%s;font-weight:400;line-height:1.2;" % (TITLE, px(SZ["title"] * 1.6))
    if role in ("mantra", "quote"):
        return base + "font-family:%s;font-size:%s;font-style:italic;line-height:1.29;" % (DISPLAY, px(SZ["quote"]))
    if role in ("script", "signoff"):
        return base + "font-family:%s;font-size:%s;line-height:1.4;" % (SCRIPT, px(SZ["body"]))
    if role in ("disclaimer", "legal"):
        return base + "font-family:%s;font-size:%s;color:%s;line-height:1.47;" % (BODY, px(SZ["label"]), MUTED)
    return base + "font-family:%s;font-size:%s;line-height:1.47;" % (BODY, px(SZ["body"]))


def cta(slot, scale, on="E01"):
    w = max(1, round(scale))
    if on == "E01":
        st = ("display:inline-block;border:%dpx solid %s;padding:%dpx %dpx;font-family:%s;font-size:%dpx;font-weight:700;"
              "letter-spacing:0.2em;text-transform:uppercase;color:%s;text-decoration:none;" % (
                  w, INK, round(26 * scale), round(56 * scale), BODY, max(1, round(SZ["label"] * scale)), INK))
    else:
        st = ("font-family:%s;font-size:%dpx;color:%s;text-decoration:none;border-bottom:%dpx solid %s;" % (
            TITLE, max(1, round(SZ["link"] * scale)), INK, w, INK))
    return '<a href="{{cta_url}}" style="%s">{{%s}}</a>' % (st, slot)


def placeholder(label, width, height, scale):
    return ('<table role="presentation" width="%d" cellpadding="0" cellspacing="0" border="0" style="width:%dpx;">'
            '<tr><td align="center" valign="middle" height="%d" bgcolor="%s" style="height:%dpx;background:%s;color:%s;'
            'font-family:%s;font-size:%dpx;letter-spacing:0.2em;text-transform:uppercase;">%s</td></tr></table>' % (
                width, width, height, PLACE, height, PLACE, ON_PLACE, BODY, max(1, round(SZ["label"] * scale)), label))


def row(inner, scale, pad_top=0, pad_bottom=0, margin=True, optional=None):
    m = round(SZ["margin"] * scale) if margin else 0
    r = ('<tr><td align="center" style="padding:%dpx %dpx %dpx %dpx;">%s</td></tr>' % (
        round(pad_top * scale), m, round(pad_bottom * scale), m, inner))
    if optional:
        return "<!--opt:%s-->%s<!--/opt:%s-->" % (optional, r, optional)
    return r


def text_row(slot, spec, scale):
    inner = '<p style="%s">{{%s}}</p>' % (style_for(spec["role"], scale), slot)
    return row(inner, scale, 24, 24, optional=slot if (spec["optional"] or spec["role"] == "script") else None)


def wrap(module, rows, width, bg=PAGE):
    return ('<table role="presentation" width="%d" cellpadding="0" cellspacing="0" border="0" bgcolor="%s" '
            'style="width:%dpx;background:%s;" data-module="%s">%s</table>' % (width, bg, width, bg, module, "".join(rows)))


def twin(module, width, slots, by_module, composed):
    """The module's fragment at a width. {{slot.id}} placeholders are the slot map's ids."""
    scale = width / 1200.0
    own = by_module.get(module, [])
    comp = composed.get(module, [])
    rows = []
    if module in HEADER:
        rows.append(row('<p style="%s">HIGH LIGHT RITUALS</p>' % style_for("eyebrow", scale), scale, 40, 40))
        return wrap(module, rows, width)
    if module == "M10":
        rows.append(row('<table role="presentation" width="100%%"><tr><td height="1" style="border-top:%dpx solid %s;'
                        'font-size:0;line-height:0;">&nbsp;</td></tr></table>' % (max(1, round(scale)), INK), scale, 32, 32))
        return wrap(module, rows, width)
    if module in IMAGE_ONLY:
        n = IMAGE_ONLY[module]
        cell = (width - round(SZ["margin"] * scale) * 2 - (n - 1) * round(24 * scale)) // n
        cells = "".join('<td style="padding:0 %dpx;">%s</td>' % (round(12 * scale * (n - 1)), placeholder(
            "image well %d" % (i + 1), cell, round(cell * 1.25), scale)) for i in range(n))
        rows.append(row('<table role="presentation" cellpadding="0" cellspacing="0"><tr>%s</tr></table>' % cells, scale, 24, 24))
        return wrap(module, rows, width)
    if module in CARD_GRID:
        el, n = CARD_GRID[module]
        for sid in own:
            rows.append(text_row(sid, slots[sid], scale))
        inner_w = width - round(SZ["margin"] * scale) * 2
        cell = inner_w // n - round(16 * scale)
        card = "<!--card-->"
        card += '<td valign="top" align="center" style="padding:0 %dpx;">' % round(8 * scale)
        card += placeholder("product image", cell, round(cell * 1.25), scale)
        if el == "E07":
            card += '<p style="%s">{{E07.label}}</p>' % style_for("label", scale)
            card += '<p style="%s">{{E07.name}}</p>' % style_for("name", scale)
        else:
            card += '<p style="%s">{{E06.name}}</p>' % style_for("title", scale)
        card += '<p style="margin:%dpx 0 0 0;text-align:center;">%s</p>' % (round(12 * scale), cta("E02.label", scale, "E02"))
        card += "</td><!--/card-->"
        rows.append(row('<table role="presentation" cellpadding="0" cellspacing="0"><tr>%s</tr></table>' % card, scale, 16, 24))
        return wrap(module, rows, width)
    if module in ("M09", "M24"):
        navs = [s for s in own if ".nav" in s]
        cells = "".join('<td style="padding:0 %dpx;"><p style="%s"><a href="{{cta_url}}" style="color:%s;text-decoration:none;">{{%s}}</a></p></td>' % (
            round(16 * scale), style_for("label", scale), INK, s) for s in navs)
        rows.append(row('<table role="presentation" cellpadding="0" cellspacing="0"><tr>%s</tr></table>' % cells, scale, 32, 8))
        for s in own:
            if s not in navs:
                rows.append(text_row(s, slots[s], scale))
        return wrap(module, rows, width, GROUND)
    # generic stack: image first when the module composes one (a spotlight puts its eyebrow above it),
    # then each slot in the slot map's order, then the CTA or link.
    img = module == "M02" or any(c in ("E04", "E05", "E11", "E14") for c in comp)
    img_row = row(placeholder("hero photo placeholder" if module == "M02" else "photo placeholder", width - round(SZ["margin"] * scale) * 2, round(width * 0.62), scale), scale, 8, 8, margin=True) if img else ""
    if module == "M02":
        # hero: a placeholder ground carries the text, the CTA sits under the headline
        for s in own:
            rows.append(text_row(s, slots[s], scale))
        rows.append(row(cta("E01.label", scale), scale, 8, 40, optional="E01.label"))
        return wrap(module, [img_row] + rows, width, PLACE)
    if module == "M03":
        rows.append(text_row("M03.eyebrow", slots["M03.eyebrow"], scale))
        rows.append(img_row)
        rows.append(text_row("M03.name", slots["M03.name"], scale))
    else:
        if img:
            rows.append(img_row)
        for s in own:
            rows.append(text_row(s, slots[s], scale))
    for c in comp:
        if c == "E01.label":
            rows.append(row(cta("E01.label", scale), scale, 8, 40, optional=None if module == "M14" else "E01.label"))
        elif c == "E02.label":
            rows.append(row(cta("E02.label", scale, "E02"), scale, 8, 40, optional="E02.label"))
    for s in own:
        # a module whose CTA is its own slot (M11.cta, M12.cta, M13...)
        if slots[s]["role"] == "label" and s.endswith(".cta"):
            rows = [r for r in rows if "{{%s}}" % s not in r]
            rows.append(row(cta(s, scale), scale, 8, 40))
    return wrap(module, rows, width)


def module_ids(by_module):
    return [m for m in sorted(by_module) if re.match(r"^M\d\d$", m)]


def all_twins(width):
    slots, by_module, composed = common.slotmap(PACK)
    return {m: twin(m, width, slots, by_module, composed) for m in module_ids(by_module)}, slots, by_module, composed


PLACEHOLDER_RE = re.compile(r"\{\{((?:[ME]\d\d)(?:\.[A-Za-z0-9_.]+)?)\}\}")


def placeholders(html):
    return set(PLACEHOLDER_RE.findall(html))
