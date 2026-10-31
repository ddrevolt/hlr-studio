#!/usr/bin/env python3
"""Render the review workbook's visual assets from HLR's own files (read only).

Type specimens: one PNG per text style, set in HLR's real faces from `High Light Rituals Fonts/`,
Onyx on Alabaster, at twice the web size (shown at the web size). Every specimen line is verbatim
from the pack (the manifest names the file). Marks: the wordmark and monogram SVGs copied as they
are; the PNG-only marks trimmed and downscaled. Writes outputs/review/assets/ and manifest.json.
Client originals are opened read only. Usage: python3 render_assets.py [--home <brand home>]"""
import argparse, hashlib, json, os, shutil
from PIL import Image, ImageDraw, ImageFont

ap = argparse.ArgumentParser()
ap.add_argument("--home", default=os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..")))
a = ap.parse_args()
H = a.home
OUT = os.path.join(H, "outputs", "review", "assets")
os.makedirs(OUT, exist_ok=True)
FD = os.path.join(H, "High Light Rituals Fonts", "Desktop")
SCRIPT = os.path.join(H, "High Light Rituals Fonts", "homemade-apple")
ONYX, ALABASTER = (0x35, 0x35, 0x35), (0xfb, 0xf7, 0xef)
S = 2  # render scale: shown at half size, so the web size is what the reader sees

def sha(p):
    return hashlib.sha256(open(p, "rb").read()).hexdigest()

def script_face():
    for root, _, files in os.walk(SCRIPT):
        for f in sorted(files):
            if f.lower().endswith((".ttf", ".otf")):
                return os.path.join(root, f)
    raise SystemExit("no Homemade Apple font file in " + SCRIPT)

F = {
    "display": os.path.join(FD, "SaolDisplay-Light.otf"),
    "display-italic": os.path.join(FD, "SaolDisplay-LightItalic.otf"),
    "headline": os.path.join(FD, "SaolDisplay-Regular.otf"),
    "headline-italic": os.path.join(FD, "SaolDisplay-RegularItalic.otf"),
    "title": os.path.join(FD, "SaolStandard-Regular.otf"),
    "price": os.path.join(FD, "SaolStandard-Medium.otf"),
    "body": os.path.join(FD, "TradeGothicLTStd.otf"),
    "bold": os.path.join(FD, "TradeGothicLTStd-Bold.otf"),
    "script": script_face(),
}
for k, p in F.items():
    if not os.path.exists(p):
        raise SystemExit("missing font file: " + p)

# style, web size (px), leading, tracking (em), caps, segments [(text, face)], extra, text source
SPEC = [
    ("display", 44, 1.0, 0, False, [("Timeless jewelry for self and space.", "display")], None, "brand-pack/voice-contract.md"),
    ("headline", 25, 1.1, 0, False, [("Delight in the pleasure of ", "headline"), ("presence", "headline-italic"), (".", "headline")], None, "brand-pack/voice-contract.md"),
    ("quote", 25, 1.29, 0, False, [("“Surrender is not the same as giving up.”", "display")], None, "brand-pack/voice-contract.md"),
    ("title", 19, 1.2, 0, False, [("The Seeds of Protection Bracelet in Black Tourmaline", "title")], None, "brand-pack/voice-contract.md"),
    ("link", 19, 1.44, 0, False, [("Let the light in", "title")], "rule", "brand-pack/voice-contract.md"),
    ("price", 19, 1.2, 0, False, [("0123456789", "price")], None, None),
    ("script", 19, 1.4, 0, False, [("With love from the altar", "script")], None, "brand-pack/voice-contract.md"),
    ("body", 14, 1.47, 0, False, [("It’s eloquent, refined, sensual, real and uplifting. It is intriguing, engaging, and trustworthy.", "body")], None, "brand-pack/voice-contract.md"),
    ("eyebrow", 12, 1.4, 0.2, True, [("Embody, Adorn, Receive", "body")], None, "brand-pack/voice-contract.md"),
    ("label", 12, 1.4, 0.2, True, [("Sanctuaries", "bold")], None, "brand-pack/voice-contract.md"),
    ("cta", 12, 1.4, 0.2, True, [("Shop now", "bold")], "box", "brand-pack/voice-contract.md"),
    ("fine", 12, 1.4, 0, False, [("Our products are not intended to diagnose or treat ailments.", "body")], None, "brand-pack/legal-ledger.json"),
]

W = 680 * S
PAD = 24 * S

def font(face, px):
    return ImageFont.truetype(F[face], px * S)

def seg_width(d, text, f, track_px):
    if not track_px:
        return d.textlength(text, font=f)
    return sum(d.textlength(ch, font=f) for ch in text) + track_px * max(0, len(text) - 1)

def draw_seg(d, x, base, text, f, track_px):
    asc, _ = f.getmetrics()
    if not track_px:
        d.text((x, base - asc), text, font=f, fill=ONYX)
        return x + d.textlength(text, font=f)
    for ch in text:
        d.text((x, base - asc), ch, font=f, fill=ONYX)
        x += d.textlength(ch, font=f) + track_px
    return x

def layout(d, segs, px, track_em):
    """Greedy word wrap across mixed-face segments; returns lines of [(text, font)]."""
    words = []
    for text, face in segs:
        f = font(face, px)
        parts = text.split(" ")
        for i, w in enumerate(parts):
            words.append((w + (" " if i < len(parts) - 1 else ""), f))
    lines, cur, cur_w = [], [], 0
    track_px = track_em * px * S
    maxw = W - 2 * PAD
    for w, f in words:
        ww = seg_width(d, w, f, track_px)
        if cur and cur_w + ww > maxw and w.strip():
            lines.append(cur); cur, cur_w = [], 0
            w = w.lstrip()
            ww = seg_width(d, w, f, track_px)
        cur.append((w, f)); cur_w += ww
    if cur:
        lines.append(cur)
    return lines, track_px

manifest = {"fonts": {k: {"file": os.path.relpath(p, H), "sha256": sha(p)} for k, p in F.items()}, "specimens": [], "marks": []}
for style, px, lead, track_em, caps, segs, extra, src in SPEC:
    segs = [(t.upper() if caps else t, f) for t, f in segs]
    probe = Image.new("RGB", (10, 10)); pd = ImageDraw.Draw(probe)
    lines, track_px = layout(pd, segs, px, track_em)
    line_h = round(px * S * lead)
    box_pad_x, box_pad_y = (24 * S, 14 * S) if extra == "box" else (0, 0)
    text_h = line_h * len(lines)
    h = PAD * 2 + text_h + box_pad_y * 2 + (10 * S if extra == "rule" else 0)
    img = Image.new("RGB", (W, int(h)), ALABASTER)
    d = ImageDraw.Draw(img)
    y = PAD + box_pad_y
    widths = []
    for ln in lines:
        asc = max(f.getmetrics()[0] for _, f in ln)
        desc = max(f.getmetrics()[1] for _, f in ln)
        base = y + (line_h + asc - desc) / 2
        x = PAD + box_pad_x
        for t, f in ln:
            x = draw_seg(d, x, base, t, f, track_px)
        widths.append(x - PAD - box_pad_x)
        y += line_h
    if extra == "box":
        tw = max(widths) - track_px
        d.rectangle([PAD, PAD, PAD + tw + 2 * box_pad_x, PAD + text_h + 2 * box_pad_y], outline=ONYX, width=1 * S)
    if extra == "rule":
        ry = PAD + text_h + 4 * S
        d.line([PAD, ry, PAD + max(widths), ry], fill=ONYX, width=1 * S)
    name = f"type-{style}.png"
    img.save(os.path.join(OUT, name), optimize=True)
    manifest["specimens"].append({"style": style, "file": name, "width": W // S, "height": int(h) // S, "web_px": px, "leading": lead,
                                  "tracking_em": track_em, "caps": caps, "text": "".join(t for t, _ in segs), "faces": sorted({f for _, f in segs}), "text_source": src})

MK = os.path.join(H, "HLR Logo & Marks")
for name, rel in [("wordmark.svg", "SVG LOGOS/HLR-BLACK LOGO.svg"), ("monogram.svg", "HLR-Jewelry Logo_Monogram.svg")]:
    p = os.path.join(MK, rel)
    shutil.copyfile(p, os.path.join(OUT, name))
    manifest["marks"].append({"file": name, "source": os.path.relpath(p, H), "sha256": sha(p)})
for name, rel in [("star.png", "Logo Marks_Black/Star_black.png"), ("monogram-star.png", "Logo Marks_Black/HLR_black.png"),
                  ("crest.png", "Logo Marks_Black/Crest_black.png"), ("shell.png", "Logo Marks_Black/Shell_black.png"),
                  ("stacked.png", "Logo Marks_Black/Logo_stacked_black.png")]:
    p = os.path.join(MK, rel)
    im = Image.open(p).convert("RGBA")
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    im.thumbnail((360, 360), Image.LANCZOS)
    im.save(os.path.join(OUT, name), optimize=True)
    manifest["marks"].append({"file": name, "source": os.path.relpath(p, H), "sha256": sha(p), "size": im.size})

json.dump(manifest, open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print("wrote", len(manifest["specimens"]), "specimens and", len(manifest["marks"]), "marks to", OUT)
