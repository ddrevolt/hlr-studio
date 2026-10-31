#!/usr/bin/env python3
"""The review workbook's own words: the decisions for today, section and group intros, and every
interface label. Each factual line carries `facts`: a source file in the brand home and a verbatim
quote, which review_guard.py checks. Writes content.json. Usage: python3 content.py"""
import json, os

BC = "brand-pack/brand-context.md"
VC = "brand-pack/voice-contract.md"
TM = "brand-pack/token-model.md"
LA = "brand-pack/logo-assets.md"
AD = "brand-pack/art-direction.md"
SM = "brand-pack/strictness-map.md"
LL = "brand-pack/legal-ledger.json"
TK = "brand-pack/tokens.json"
TR = "brand-pack/type-registry-core.json"
TP = "outputs/step-2-pack/token-proposal.md"
BR = "outputs/step-1-review/brand-review-v2.md"


def f(source, quote):
    return {"source": source, "quote": quote}


CONFIRM = [{"id": "confirm", "label": "Confirm Eddie's pick"}, {"id": "change", "label": "Change it (say how below)"}]

DECISIONS = [
    {
        "id": "d.c2", "code": "C2", "title": "Positioning, and who signs claims", "decider": "hlr",
        "ask": "Which positioning governs HLR's copy: the brand book's or the live work's? And who at HLR signs off claims?",
        "why": "Until a signer is named, every line that touches health, fertility, sourcing or origin stays blocked, and the writers follow the book.",
        "facts": [
            f(BC, "Positioning and claims: the book's timeless jewelry against the site's healing crystal jewelry, sessions sold as products, spell and witch language"),
            f(VC, "Until HLR rules C2, this contract follows the book, and live lines that lean on healing, witch or spell positioning are not models."),
            f(BC, "No one at HLR is named yet to sign claims"),
            f(BC, "Rows marked needs_legal (health, fertility, sourcing, origin) block every lint, craft mode included, until HLR's signer rules on them"),
            f(BC, "Whether paid and organic social carry it is HLR's (C2)."),
        ],
        "fields": [
            {"id": "positioning", "type": "radio", "label": "Positioning", "options": [
                {"id": "book", "label": "The book's: timeless jewelry for self and space"},
                {"id": "live", "label": "The live work's: healing crystal jewelry, energy work, spell and witch language"},
                {"id": "between", "label": "Somewhere between (describe in the note)"}]},
            {"id": "signer", "type": "text", "label": "Who signs claims for HLR (name and role)"},
            {"id": "social_footer", "type": "radio", "label": "The site footer disclaimer on paid and organic social", "options": [
                {"id": "yes", "label": "Yes, verbatim"}, {"id": "short", "label": "A shorter form (give it in the note)"}, {"id": "no", "label": "No"}]},
        ],
        "applies": "brand-context.md (C2), voice-contract.md sections 1 and 4, legal-ledger.json (signer; the footer row). The blocked claims still wait for the signer's own rulings.",
        "items": ["voice.positioning", "voice.flag", "claims.HLR-H01", "claims.HLR-REQ-01"],
    },
    {
        "id": "d.licenses", "code": "T2", "title": "Font licenses", "decider": "hlr",
        "ask": "Do HLR's licenses for Saol Display, Saol Standard and Trade Gothic cover desktop, web, type rendered into email slices, and social and paid art?",
        "why": "Every asset that renders text carries the license flag until this is confirmed.",
        "facts": [
            f(TP, "Licenses for Saol Display, Saol Standard and Trade Gothic: desktop, web, and type rendered into email slices and social and paid art. Blocks every shipped asset."),
            f(BC, "License flag raised: Saol and Trade Gothic have no license file"),
            f(TM, "Open with HLR: whether the desktop licenses cover type rendered into email image slices and social and paid art."),
        ],
        "fields": [
            {"id": "state", "type": "radio", "label": "Licenses", "options": [
                {"id": "covered", "label": "HLR holds licenses that cover all of it (send the files)"},
                {"id": "partial", "label": "HLR holds some (list them in the note)"},
                {"id": "buy", "label": "HLR will buy what is missing"},
                {"id": "unsure", "label": "Not sure yet"}]},
            {"id": "who", "type": "text", "label": "Who sends the license files, and by when"},
        ],
        "applies": "token-model.md section 4 and gap T2, figma.yaml fonts.licensed. The flag drops only when every production face is confirmed.",
        "items": ["type.license.saol-display", "type.license.saol-standard", "type.license.trade-gothic-lt-std"],
    },
    {
        "id": "d.c4", "code": "C4", "title": "Ink and grounds", "decider": "hlr", "pick": True,
        "ask": "Confirm Eddie's pick: Onyx ink on Alabaster by default, white for the email page and for type on photography, and Forest, Onyx and Fawn as alternate grounds.",
        "why": "Every master in the library is built on these colours.",
        "facts": [
            f(BC, "Ink and grounds by channel: Onyx and Alabaster in the book; Forest on the site, white email pages, blush in social"),
            f(TP, "White stays the email page ground and the ink on photography. Forest, Onyx and Fawn become alternate ground modes."),
            f(TP, "The site (Forest on #f7f4ee), the 1200 email library and the 2025 sends move to Onyx when rebuilt. Blush #f0dfcf, #f1d6d6 and #2e1d13 leave the palette."),
        ],
        "fields": [{"id": "choice", "type": "radio", "label": "Ink and grounds", "options": CONFIRM}],
        "applies": "brand-context.md (C4), token-model.md gap C1, art-direction.md section 1: marked confirmed by HLR, or changed as described.",
        "items": ["color.brand.onyx", "color.brand.alabaster", "color.ground.alabaster", "art.grounds.1", "art.grounds.3"],
    },
    {
        "id": "d.c5", "code": "C5", "title": "Faces", "decider": "hlr", "pick": True,
        "ask": "Confirm Eddie's pick: four faces, Saol Display, Saol Standard, Trade Gothic LT Std and Homemade Apple, and every other face retires.",
        "why": "Every text style in the library is set in these four.",
        "facts": [
            f(TP, "Saol Display (display, headlines, quotes), Saol Standard (titles, links, prices), Trade Gothic LT Std (body, eyebrows, labels, CTAs, fine print), Homemade Apple (one short script line per asset, social and email only)."),
            f(TP, "17 live families become 4; Instrument Serif, Miriam Libre, Futura PT, Avenir, Inter and the rest retire."),
        ],
        "fields": [{"id": "choice", "type": "radio", "label": "Faces", "options": CONFIRM}],
        "applies": "brand-context.md (C5), token-model.md gap T1, art-direction.md section 2.",
        "items": ["type.face.display", "type.face.title", "type.face.body", "type.face.script"],
        "specimens": ["display", "headline", "body", "script"],
    },
    {
        "id": "d.c6", "code": "C6", "title": "Buttons and links", "decider": "hlr", "pick": True,
        "ask": "Confirm Eddie's pick: one outline caps box in the ink colour as the main button, and a text link with a trailing rule as the second. Filled boxes retire.",
        "why": "The library's button and link elements are built this way.",
        "facts": [
            f(BC, "CTA: the book's outline caps and Saol link; email's 2px outline; the site's Saol buttons"),
            f(TP, "The p18 outline caps box in the ink colour, not the book's Fawn (2.17:1 on white); inverse on photography and dark grounds; the p17 trailing-rule link secondary."),
            f(TP, "Five live CTA styles become one primary and one secondary; filled boxes retire."),
        ],
        "fields": [{"id": "choice", "type": "radio", "label": "Buttons and links", "options": CONFIRM}],
        "applies": "brand-context.md (C6), voice-contract.md section 6 (CTA), art-direction.md section 6.",
        "items": ["voice.conv.cta", "art.never.4"],
        "specimens": ["cta", "link"],
    },
    {
        "id": "d.c3", "code": "C3", "title": "Marks", "decider": "hlr", "pick": True,
        "ask": "Confirm Eddie's pick of marks, say whether the stacked lockup is current, and when HLR can send the missing vectors.",
        "why": "The star cannot go into any master until its vector arrives; clear space and minimum sizes wait for the vectors too.",
        "facts": [
            f(TP, "The wordmark primary; the star the one decorative device; the monogram the small mark; the crest retires; the shell stays on packaging."),
            f(TP, "Vectors for the star and the monogram lockup with the star; clear space and minimum sizes; whether the stacked lockup is current. Blocks the star in every master."),
            f(LA, "The stacked lockup is not in C3's roster and has no vector. Question for HLR at Review 1. Default: not used; the one-line wordmark covers every Phase 1 placement."),
        ],
        "fields": [
            {"id": "roster", "type": "radio", "label": "The roster", "options": CONFIRM},
            {"id": "stacked", "type": "radio", "label": "The stacked lockup", "options": [
                {"id": "not_used", "label": "Not used (the default)"}, {"id": "current", "label": "Current: HLR sends its vector"}]},
            {"id": "vectors", "type": "text", "label": "Star and monogram-with-star vectors: who sends them, and by when"},
        ],
        "applies": "logo-assets.md (roster, rules 5 and 6, gaps), brand-context.md (C3), token-model.md gap M1.",
        "items": ["marks.wordmark", "marks.monogram", "marks.monogram-with-the-star-above", "marks.star", "marks.crest", "marks.shell-with-a-star-inside", "marks.stacked-lockup"],
    },
    {
        "id": "d.c8", "code": "C8", "title": "Email width, and how sends are built", "decider": "hlr", "pick": True,
        "ask": "Confirm 1200 wide email masters sent as image slices, and tell us how HLR's email platform builds sends.",
        "why": "Type sizes in every email module depend on it.",
        "facts": [
            f(TP, "1200 masters with type sized for image slices: body 45, small 35."),
            f(TP, "Every type size in the email library rises about a third; the 700 rebuilds of 2026 stop. If HLR's ESP sends live text, body 28 and small 22 replace them."),
            f(BC, "Klaviyo forms on the site; Klaviyo is likely the ESP (HLR to confirm)"),
        ],
        "fields": [
            {"id": "build", "type": "radio", "label": "How sends are built", "options": [
                {"id": "slices", "label": "Image slices from 1200 masters (Eddie's pick)"},
                {"id": "live", "label": "Live text"}, {"id": "mix", "label": "A mix (describe in the note)"}]},
            {"id": "esp", "type": "text", "label": "Email platform, and the width sends go out at"},
        ],
        "applies": "brand-context.md (C8), token-model.md gap T11, asset-types.md (canvases and delivery).",
        "items": [],
    },
    {
        "id": "d.shopify", "code": "Q5", "title": "Shopify products export", "decider": "hlr",
        "ask": "Can HLR send a products export (CSV) from Shopify?",
        "why": "Without it, 101 product variants have no SKU, the writers have no product descriptions to draw on, and no price is confirmed.",
        "facts": [
            f(BR, "101 of 650 variants have no SKU in the public feed. Blocks the product database."),
            f(BC, "Every `description` is empty, so no product prose is verifiable until the export (owner HLR)."),
        ],
        "fields": [
            {"id": "state", "type": "radio", "label": "The export", "options": [
                {"id": "send", "label": "HLR will send it"}, {"id": "no", "label": "Not possible (say why in the note)"}]},
            {"id": "who", "type": "text", "label": "Who sends it, and by when"},
        ],
        "applies": "brand-context.md gaps (Shopify products export), products.json once it arrives.",
        "items": [],
    },
    {
        "id": "d.faces", "code": "Q6", "title": "People in photographs", "decider": "hlr",
        "ask": "Do HLR's releases cover the people who appear in its photographs, and for which uses?",
        "why": "Imagery with people in it waits for this. Eddie has already cleared the images on the library's photos page and the site's product images for HLR's designs.",
        "facts": [
            f(TP, "Image rights, and releases for people in imagery (`faces_policy`)."),
            f(AD, "The pack's `faces_policy` stays null until HLR confirms releases and usage (owner HLR)."),
            f(BC, "Eddie owns the images on the reference file's Images page"),
        ],
        "fields": [
            {"id": "state", "type": "radio", "label": "Releases", "options": [
                {"id": "all", "label": "Releases cover everyone shown, for all of HLR's channels"},
                {"id": "some", "label": "Some do (list in the note)"},
                {"id": "unknown", "label": "None, or not known"}]},
            {"id": "detail", "type": "text", "label": "Limits: people, uses, dates"},
        ],
        "applies": "art-direction.md (People appear in HLR imagery), brand-context.md gaps (faces_policy).",
        "items": ["art.people"],
    },
    {
        "id": "d.c10", "code": "C10", "title": "Offers", "decider": "hlr",
        "ask": "Which free shipping threshold and which codes are current?",
        "why": "Until then every offer figure, code, threshold and date in copy stays a merge token, and a person confirms the terms against the brief.",
        "facts": [
            f(BC, "Offers: three free shipping thresholds and two codes in live work"),
            f(LL, "free shipping at three thresholds, codes LIGHT25 and LIGHT30, '30% off sitewide'"),
            f(VC, "Merge tokens until HLR rules C10: `{{ discount_code }}`, `{{ free_shipping_threshold }}`"),
        ],
        "fields": [
            {"id": "threshold", "type": "text", "label": "Free shipping threshold now"},
            {"id": "codes", "type": "text", "label": "Codes in use, and what each gives"},
            {"id": "standing", "type": "radio", "label": "In copy", "options": [
                {"id": "tokens", "label": "Keep merge tokens; each brief gives its terms"},
                {"id": "standing", "label": "These are standing terms the writers may use"}]},
        ],
        "applies": "voice-contract.md section 6 (offers), legal-ledger.json HLR-P01, brand-context.md (C10).",
        "items": ["voice.conv.offers-prices-dates-codes-thresholds", "claims.HLR-P01"],
    },
    {
        "id": "d.c1", "code": "C1", "title": "The name", "decider": "hlr",
        "ask": "How is the brand written in copy?",
        "why": "Until this is ruled the writers use whatever form the brief gives.",
        "facts": [f(VC, "Open (C1, HLR). The book writes HIGH LIGHT (p24 to p38); live copy writes High Light Rituals; the handle is @highlightrituals. Until C1, use the form the brief gives")],
        "fields": [
            {"id": "name", "type": "radio", "label": "In copy", "options": [
                {"id": "full", "label": "High Light Rituals"}, {"id": "book", "label": "HIGH LIGHT"}, {"id": "by_place", "label": "It depends on where (say in the note)"}]},
            {"id": "short", "type": "radio", "label": "The short form HLR", "options": [
                {"id": "ok", "label": "Fine in copy"}, {"id": "never", "label": "Never in copy"}]},
        ],
        "applies": "voice-contract.md section 6 (Brand name), brand-context.md (C1 and house conventions).",
        "items": ["voice.conv.brand-name"],
    },
    {
        "id": "d.c7", "code": "C7", "title": "The tagline", "decider": "hlr",
        "ask": "Which line is the main tagline today, and which others are still in use?",
        "why": "The writers may quote the brand's own lines; they need to know which are current.",
        "facts": [
            f(VC, "Taglines (p32): \"Timeless jewelry for self and space.\" (main); \"Delight in the pleasure of presence.\", \"Let the light in.\" and \"Inspiring a return to self for a more connected, compassionate world.\" (alternates)."),
            f(VC, "Which is current is C7 (HLR); the live work also uses \"Where Jewelry Meets Energy Work\", \"Embody the force of the natural world\" and \"Fine jewelry for the witch within\""),
        ],
        "fields": [
            {"id": "main", "type": "radio", "label": "The main line", "options": [
                {"id": "t1", "label": "Timeless jewelry for self and space."},
                {"id": "t2", "label": "Delight in the pleasure of presence."},
                {"id": "t3", "label": "Let the light in."},
                {"id": "t4", "label": "Inspiring a return to self for a more connected, compassionate world."},
                {"id": "t5", "label": "Where Jewelry Meets Energy Work"},
                {"id": "t6", "label": "Embody the force of the natural world"},
                {"id": "t7", "label": "Fine jewelry for the witch within"},
                {"id": "other", "label": "Another line (give it in the note)"}]},
            {"id": "also", "type": "checks", "label": "Also current", "options": [
                {"id": "t1", "label": "Timeless jewelry for self and space."},
                {"id": "t2", "label": "Delight in the pleasure of presence."},
                {"id": "t3", "label": "Let the light in."},
                {"id": "t4", "label": "Inspiring a return to self for a more connected, compassionate world."},
                {"id": "t5", "label": "Where Jewelry Meets Energy Work"},
                {"id": "t6", "label": "Embody the force of the natural world"},
                {"id": "t7", "label": "Fine jewelry for the witch within"}]},
        ],
        "applies": "voice-contract.md section 8 (Taglines), brand-context.md (C7).",
        "items": ["voice.words.taglines"],
    },
    {
        "id": "d.quotes", "code": "Q7", "title": "Customer quotes and reviews", "decider": "hlr",
        "ask": "Should the quote-like lines in the old templates be traced to real reviews, or dropped? And can HLR send a Judge.me reviews export?",
        "why": "A customer's words appear only verbatim from a source someone can check. Nothing is written in a customer's voice.",
        "facts": [
            f(BR, "(20 quote-like lines in email, 11 in social): source each in Judge.me before reuse."),
            f(BC, "asked at Review 1 (Gate 2 package call 17), a Judge.me reviews export first; Eddie relays HLR's answer"),
        ],
        "fields": [
            {"id": "lines", "type": "radio", "label": "The quote-like lines", "options": [
                {"id": "source", "label": "Trace each to a Judge.me review"}, {"id": "drop", "label": "Drop them"}]},
            {"id": "export", "type": "radio", "label": "A Judge.me reviews export", "options": [
                {"id": "yes", "label": "HLR will send one"}, {"id": "no", "label": "Not now"}]},
        ],
        "applies": "brand-context.md gaps (grounding_inputs), legal-ledger.json HLR-T01.",
        "items": ["claims.HLR-T01", "makes.email.testimonials"],
    },
    {
        "id": "d.series", "code": "", "title": "Social franchises, series and captions", "decider": "hlr",
        "ask": "Which franchise and series names are current, and where do captions live?",
        "why": "The social writers take series names from this list.",
        "facts": [
            f(VC, "Which names are current is HLR's (Review 1)."),
            f(TR, "Where captions live stays an HLR question (Review 1)"),
        ],
        "fields": [
            {"id": "current", "type": "checks", "label": "Current names", "options": [
                {"id": "high_spirits", "label": "HIGH SPIRITS"}, {"id": "sanctuaries", "label": "SANCTUARIES"},
                {"id": "sublime", "label": "SUBLIME INTERVENTION"}, {"id": "wfyj", "label": "Words For Your Journey"},
                {"id": "energy", "label": "Energy medicine"}, {"id": "field_notes", "label": "Field Notes"},
                {"id": "zodiac", "label": "Zodiac season crystals"}, {"id": "proof", "label": "proof of magic"}]},
            {"id": "captions", "type": "text", "label": "Where captions live"},
        ],
        "applies": "voice-contract.md section 7, type-registry-core.json (social series and captions).",
        "items": ["voice.franchises.book", "voice.franchises.live"],
    },
    {
        "id": "d.founder", "code": "", "title": "Writing as the founder", "decider": "hlr",
        "ask": "Should copy speak as the founder anywhere beyond captions and letters?",
        "why": "Today the writers use the founder's first person only when the brief says the piece is from the founder.",
        "facts": [
            f(VC, "whether founder first-person copy is wanted beyond captions and letters."),
            f(VC, "Write as the founder only when the brief says the piece is from the founder, and never invent the founder's experiences, sessions or words"),
        ],
        "fields": [{"id": "choice", "type": "radio", "label": "The founder's first person", "options": [
            {"id": "as_now", "label": "Captions and letters only, as now"}, {"id": "more", "label": "Also elsewhere (say where in the note)"}]}],
        "applies": "voice-contract.md section 2.",
        "items": ["voice.who.5"],
    },
    {
        "id": "d.customers", "code": "", "title": "Customers and research", "decider": "hlr",
        "ask": "How does HLR describe its customer groups, and does it hold any customer research?",
        "why": "Until then, analysis treats customers as one pool and says so, and paid concepts are labelled as hypotheses.",
        "facts": [
            f(BC, "Segments in HLR's own business terms: unknown."),
            f(BC, "No insight register and no customer research have been received"),
        ],
        "fields": [
            {"id": "segments", "type": "text", "label": "Customer groups, in HLR's words"},
            {"id": "research", "type": "text", "label": "Research HLR holds (surveys, interviews, reports)"},
        ],
        "applies": "brand-context.md (Who the customers are; gaps insight_register and grounding_inputs).",
        "items": [],
    },
    {
        "id": "d.seasalt", "code": "HLR 4", "title": "Sea Salt and the sale-price red", "decider": "hlr",
        "ask": "Should Sea Salt get a role or retire? And should the red used for struck sale prices stay?",
        "why": "Neither has a job in the library today.",
        "facts": [
            f(TP, "A role for Sea Salt, or its retirement; a role for the struck-price red, or its retirement."),
            f(TM, "Struck-price red #d54141 (email: 34 strike lines at 83 percent opacity)"),
        ],
        "fields": [
            {"id": "seasalt", "type": "radio", "label": "Sea Salt", "options": [
                {"id": "retire", "label": "Retire it"}, {"id": "role", "label": "Give it a role (describe in the note)"}]},
            {"id": "red", "type": "radio", "label": "The struck-price red", "options": [
                {"id": "retire", "label": "Retire it: sale prices strike through in the ink"}, {"id": "keep", "label": "Keep it (describe in the note)"}]},
        ],
        "applies": "tokens.json (color.brand.sea-salt), token-model.md gaps C3 and C7.",
        "items": ["color.brand.sea-salt", "color.ground.sea-salt"],
        "swatches": [{"name": "Sea Salt", "hex": "#e0e3e5"}, {"name": "Struck-price red", "hex": "#d54141"}],
    },
    {
        "id": "d.offpalette", "code": "", "title": "Colours that leave the palette", "decider": "hlr",
        "ask": "Confirm the off-palette colours retire, and that the marks use the book's colours rather than the archive files' slightly different ones.",
        "why": "These colours appear in live work but have no place in the library.",
        "facts": [
            f(TM, "blush #f0dfcf (an underlay); #f1d6d6 and #2e1d13 retire unless HLR names a role; the site's #f7f4ee and #f6f4ee become Alabaster at rebuild"),
            f(TM, "Archive mark fills (#faf8f2, #1f2918, #baada3) against p19"),
            f(TM, "tokens carry p19; marks bind to tokens"),
        ],
        "fields": [
            {"id": "offpalette", "type": "radio", "label": "Off-palette colours", "options": [
                {"id": "retire", "label": "They retire"}, {"id": "role", "label": "One keeps a role (say which in the note)"}]},
            {"id": "archive", "type": "radio", "label": "Mark colours", "options": [
                {"id": "book", "label": "The book's colours (p19)"}, {"id": "archive", "label": "The archive files' colours were intended"}]},
        ],
        "applies": "token-model.md gaps C8 and C9, logo-assets.md (Book-era files).",
        "items": [],
        "swatches": [{"name": "Blush", "hex": "#f0dfcf"}, {"name": "", "hex": "#f1d6d6"}, {"name": "", "hex": "#2e1d13"}, {"name": "Site ground", "hex": "#f7f4ee"},
                     {"name": "Archive cream", "hex": "#faf8f2"}, {"name": "Archive green", "hex": "#1f2918"}, {"name": "Archive fawn", "hex": "#baada3"}],
    },
    {
        "id": "d.channels", "code": "", "title": "Channels to confirm", "decider": "hlr",
        "ask": "Is the Substack HLR's channel or a personal one? Is The Ritualist blog current?",
        "why": "Customer research reads HLR's own channels; the Substack stays out until HLR says whose it is.",
        "facts": [
            f(BC, "lightnessbydonnie.substack.com | a newsletter linked from the site | unconfirmed (HLR, Review 1)"),
            f(BC, "the Substack stays out until HLR says whose it is"),
            f(BC, "linked from HLR's email footers; no web design for it in the files"),
        ],
        "fields": [
            {"id": "substack", "type": "radio", "label": "The Substack", "options": [
                {"id": "hlr", "label": "HLR's channel"}, {"id": "personal", "label": "Personal: it stays out"}]},
            {"id": "ritualist", "type": "radio", "label": "The Ritualist", "options": [
                {"id": "current", "label": "Current, HLR's blog"}, {"id": "retired", "label": "Retired"}]},
        ],
        "applies": "brand-context.md (Where they talk).",
        "items": [],
    },
    {
        "id": "d.t6", "code": "T6", "title": "The italic accent word", "decider": "eddie", "heard": True,
        "ask": "For Donnie to hear: one italic accent word per headline, in every channel. It is in the live work but not in the book.",
        "why": "Eddie ruled it at Gate 2; HLR hears it today. If Donnie objects, Eddie decides.",
        "facts": [f(VC, "the italic accent word, one per display line or headline (Gate 2 package call 10), which HLR hears at Review 1")],
        "fields": [{"id": "choice", "type": "radio", "label": "Donnie's view", "options": [
            {"id": "fine", "label": "Fine as ruled"}, {"id": "concern", "label": "Has a concern (note it)"}]}],
        "applies": "Nothing changes unless Eddie rules again: token-model.md T6, art-direction.md section 3.",
        "items": ["type.accent"],
        "specimens": ["headline"],
    },
    {
        "id": "d.c9", "code": "C9", "title": "No em dashes", "decider": "eddie", "heard": True,
        "ask": "For Donnie to hear: no em dashes in anything we make, though the book and live copy use them.",
        "why": "Eddie's standing rule; HLR hears it today.",
        "facts": [
            f(BC, "our rule holds in everything we make; HLR hears it at Review 1"),
            f(VC, "No em dashes. Use a comma, a colon, parentheses or a new sentence. The book's own copy uses them (p26 to p38)"),
        ],
        "fields": [{"id": "choice", "type": "radio", "label": "Donnie's view", "options": [
            {"id": "fine", "label": "Fine"}, {"id": "concern", "label": "Has a concern (note it)"}]}],
        "applies": "Nothing changes unless Eddie rules again.",
        "items": ["voice.conv.dashes", "never.1"],
    },
    {
        "id": "d.strictness", "code": "", "title": "Who may change a locked rule", "decider": "eddie",
        "ask": "Once HLR's team runs the forge, who besides Eddie may change a locked rule?",
        "why": "Eddie's call; Donnie's view helps.",
        "facts": [f(SM, "Open for Eddie: who besides him may change a locked row once HLR's team runs the forge (Gate 1 a).")],
        "fields": [{"id": "who", "type": "text", "label": "Who, and for which kinds of rule"}],
        "applies": "strictness-map.md.",
        "items": [],
    },
]

SECTIONS = [
    {"id": "start", "nav": "Start"},
    {"id": "decisions", "nav": "Decisions", "title": ["Today's ", "decisions"],
     "intro": "The questions the pack is waiting on, most production-blocking first. Each says what it asks, why it matters, what the pack does until it is answered, and what changes once it is."},
    {"id": "voice", "nav": "Voice", "title": ["How HLR ", "sounds"],
     "intro": "The writers read this in full on every run, and every draft is checked against it.",
     "facts": [f(BC, "The voice contract is `voice-contract.md` (role `voice_contract`), read in full on every run.")],
     "groups": [
         {"id": "voice", "title": "The voice"},
         {"id": "who", "title": "Who we talk to"},
         {"id": "q.eloquent", "title": "Eloquent", "eyebrow": "Quality 1 of 5", "intro": "Every piece stays on the IS side of all five qualities, and each option leads with one.",
          "facts": [f(VC, "Every piece stays on the IS side of all five; each option leads with one and is tagged with it; a set of options covers at least two")]},
         {"id": "q.refined", "title": "Refined", "eyebrow": "Quality 2 of 5"},
         {"id": "q.sensual", "title": "Sensual", "eyebrow": "Quality 3 of 5"},
         {"id": "q.real", "title": "Real", "eyebrow": "Quality 4 of 5"},
         {"id": "q.uplifting", "title": "Uplifting", "eyebrow": "Quality 5 of 5"},
         {"id": "rules", "title": "Operating rules"},
         {"id": "devices", "title": "Devices", "intro": "Seasoning, never required."},
         {"id": "conventions", "title": "House conventions"},
         {"id": "franchises", "title": "Franchises and series"},
         {"id": "words", "title": "The brand's own words"},
     ]},
    {"id": "claims", "nav": "Claims", "title": ["What HLR may ", "claim"],
     "intro": "Each row says what a draft may say about a topic and who signs it off. This list is a working draft: nothing in it is approved by counsel yet.",
     "facts": [f(LL, "nothing here is counsel-approved and no row clears copy for production"),
               f(LL, "needs_legal blocks every lint, craft mode included, until the row is ruled; conditional asks a person to confirm and record each use (craft mode reports it); info never blocks.")],
     "groups": [
         {"id": "blocks", "title": "Blocked until your signer rules", "intro": "A draft that touches one of these cannot go out until HLR's claims signer rules on the row."},
         {"id": "confirm", "title": "A person confirms each use", "intro": "Allowed with a person's confirmation, recorded each time."},
         {"id": "listed", "title": "Listed for review, never blocks", "intro": "Flagged for the reviewer with how often it appears. It never stops a draft."},
     ]},
    {"id": "never", "nav": "Never say", "title": ["Never ", "said"],
     "intro": "Barred in all output, whatever a brief asks.",
     "facts": [f(BC, "Barred in all output, whatever a brief asks")],
     "groups": [{"id": "patterns", "title": "The six patterns"}]},
    {"id": "color", "nav": "Colour", "title": ["Colour and ", "grounds"],
     "intro": "The book's palette, the grounds copy may sit on, and the contrast law every build checks.",
     "facts": [f(BC, "every ground in the roster carries body copy in its ink; Fawn is never an ink on Alabaster, white or the neutrals.")],
     "groups": [
         {"id": "brand", "title": "The palette"},
         {"id": "grounds", "title": "Grounds and inks", "intro": "Each ground with its ink and the contrast between them. Body copy needs 4.5 or more; display lines need 3.0."},
         {"id": "law", "title": "The contrast law"},
     ]},
    {"id": "type", "nav": "Type", "title": ["Type and its ", "roles"],
     "intro": "Four faces, and which one does each job. The specimens are set in HLR's own font files at web size (scaled down on a phone); the rest of this page uses stand-in faces.",
     "facts": [f(BC, "Faces (Gate 1, C5, for HLR to confirm): Saol Display, Saol Standard, Trade Gothic LT Std, Homemade Apple.")],
     "groups": [
         {"id": "faces", "title": "The four faces"},
         {"id": "roles", "title": "Roles"},
         {"id": "scale", "title": "Sizes"},
         {"id": "licenses", "title": "Licenses", "intro": "The license flag stays raised until HLR confirms the licenses."},
     ]},
    {"id": "marks", "nav": "Marks", "title": ["The ", "marks"],
     "intro": "Which marks the library places, and how. The images are HLR's own files.",
     "facts": [f(BC, "a mark is placed, never redrawn or set in a font")],
     "groups": [{"id": "roster", "title": "The roster"}, {"id": "rules", "title": "Rules"}]},
    {"id": "art", "nav": "Art direction", "title": ["Art ", "direction"],
     "intro": "How a piece looks: grounds, devices, photography, and what never happens. Every build reads it.",
     "facts": [f("brand-pack/asset-types.md", "art direction from `art-direction.md`")],
     "groups": [
         {"id": "grammar", "title": "The grammar"},
         {"id": "grounds", "title": "Grounds and pairings"},
         {"id": "devices", "title": "Signature devices"},
         {"id": "photo", "title": "Photography: the book's four cards"},
         {"id": "families", "title": "Live photography with no card", "intro": "A proposed handling for each, for Review 1.",
          "facts": [f(AD, "Live families with no card [observed], with a proposed handling [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) for Review 1:")]},
         {"id": "never", "title": "What never happens"},
     ]},
    {"id": "makes", "nav": "What it makes", "title": ["What the forge ", "makes"],
     "intro": "The email and social types the writers know. Are these the sends and posts HLR makes?",
     "facts": [f(TR, "email and organic social are the copy engines' contract")],
     "groups": [
         {"id": "email", "title": "Email types"},
         {"id": "social", "title": "Organic social types"},
         {"id": "series", "title": "Recurring series", "intro": "Cadence is what the file shows, not a commitment.",
          "facts": [f(TR, "Cadence is what the file shows, not a commitment: HLR confirms the calendar.")]},
     ]},
    {"id": "summary", "nav": "Summary"},
]

UI = {
    "title": "HLR Pack Review",
    "eyebrow": "High Light Rituals · Review 1 · 23 Oct 2026",
    "headline": ["Is the forge ", "right?"],
    "lede": "Everything the forge knows about HLR, in plain words: the voice, the claims, colour, type, marks and art direction. Read it together, change what is wrong, and park what needs a conversation.",
    "how": [
        "Anything right as written needs nothing. At the end of each section, confirm the rest in one step.",
        "To change something, press Change, edit the words and save. To park it, press Discuss later. Each decision saves at once with who made it.",
        "When the review is over, close it in the Summary. Claude then reads the decisions and applies each to the pack with a dated line in DECISIONS.md once Eddie says go, and Eddie commits.",
    ],
    "how_title": "How it works",
    "who_title": "Who decides",
    "who": [
        {"k": "hlr", "label": "Donnie", "text": "HLR's facts and choices: positioning, the name, offers, which lines and series are current. He confirms Eddie's Gate 1 picks."},
        {"k": "eddie", "label": "Eddie", "text": "The rules we hold: house style, the contrast law, how the forge checks. Donnie's view is welcome on all of it."},
        {"k": "signer", "label": "HLR's claims signer", "text": "The claims marked blocked. Donnie names who that is."},
    ],
    "legend_title": "Where each line comes from",
    "legend": [
        {"k": "book", "label": "Brand book p.N", "text": "HLR's 2022 brand book."},
        {"k": "seen", "label": "Seen in your live work", "text": "HLR's emails, social posts or site."},
        {"k": "pick", "label": "Eddie's pick, for you to confirm", "text": "A Gate 1 choice HLR confirms today."},
        {"k": "ruled", "label": "Ruled by Eddie", "text": "Our proposal, approved by Eddie."},
        {"k": "proposal", "label": "Our proposal, not yet ruled", "text": "Waiting for Eddie."},
        {"k": "record", "label": "On record", "text": "HLR's own material or our standing records."},
    ],
    "license_flag": "License flag: Saol and Trade Gothic have no license file on record, so anything that renders them carries this flag.",
    "deciders": {"hlr": "Donnie decides", "eddie": "Eddie decides", "signer": "HLR's claims signer"},
    "by": [{"id": "donnie", "label": "Donnie"}, {"id": "eddie", "label": "Eddie"}, {"id": "both", "label": "Both"}],
    "deciding": "Deciding",
    "show": "Show",
    "recording_as": "Recording as",
    "status": {"none": "Not reviewed", "keep": "Keep", "change": "Change", "discuss": "Discuss later", "decided": "Decided", "confirmed": "Confirmed with the section"},
    "btn": {"keep": "Keep", "change": "Change", "discuss": "Discuss later", "save": "Save", "cancel": "Cancel", "clear": "Undo", "note": "Add a note", "record": "Record the decision",
            "confirm_rest": "Confirm the rest of this section as written", "undo_confirm": "Undo", "add_point": "Add a point", "close": "Close the review", "reopen": "Reopen",
            "copy": "Select the summary", "source": "Source text", "plain": "Plain", "show_why": "Why it matters", "top": "Back to top"},
    "filters": [{"id": "all", "label": "Everything"}, {"id": "open", "label": "Needs a decision"}, {"id": "changed", "label": "Changed"}, {"id": "discuss", "label": "To discuss"}],
    "labels": {
        "ask": "The question", "why": "Why it matters", "now": "What the pack says now", "applies": "Changes on apply", "note": "Note", "your_edit": "The new wording",
        "was": "Was", "now_reads": "Now reads", "by": "by", "at": "at", "recorded_by": "recorded by", "decided": "decided", "of": "of",
        "sounds": "Sounds like", "notlike": "Not like", "src_file": "Source", "line": "line", "words_watched": "Words it watches", "requires": "What it requires",
        "evidence": "Where it shows up", "ruling": "Ruling", "no_ruling": "No ruling yet", "required_text": "The required text", "patterns": "patterns",
        "ink": "ink", "ratio": "contrast", "body": "body", "display": "display", "accent": "accent and muted inks", "mode": "mode",
        "face": "Face and style", "case": "Case", "leading": "Leading", "where": "Where the type is the layout",
        "role": "Role", "state": "State", "light": "Light", "colour": "Colour", "styling": "Styling and feeling", "live": "Live use",
        "cmyk": "CMYK", "pantone": "Pantone", "hex": "Hex", "formats": "Formats", "cadence": "Cadence",
        "section_confirmed": "Rest of section confirmed", "point_placeholder": "Something Donnie raised that has no item of its own",
        "note_placeholder": "Why, or what to check", "points": "Points raised", "flagged_r1": "For Review 1", "links": "See the decision",
        "unsaved": "Edited here, not recorded yet", "decided_count": "decided", "changes_count": "changes", "discuss_count": "to discuss",
    },
    "summary": {
        "title": ["The ", "summary"],
        "intro": "Everything recorded so far. Close the review when it is over; Claude reads this and applies it to the pack once Eddie says go.",
        "decisions": "Decisions", "changes": "Changes to the pack", "discuss": "To discuss later", "keeps": "Kept as written", "confirmed": "Sections confirmed", "points": "Points raised",
        "none": "Nothing yet.", "text_title": "As text", "closed": "Closed", "closed_note": "The review is closed. Claude reads these decisions and applies them to the pack once Eddie says go.",
        "open_note": "The review is open. Anyone with edit access can record decisions.",
        "next_title": "What happens next",
        "next": [
            "Claude reads every decision from this page and checks each against the exact text it was made on.",
            "Each change goes into its pack file with a dated line in DECISIONS.md saying who decided, why, and what it replaced. Donnie's decisions are recorded as HLR's; anything that is our rule waits for Eddie.",
            "The checks and the token exports run again, and Eddie commits.",
        ],
    },
    "db": {
        "loading": "Connecting to the review record.",
        "offline": "Decisions can't be saved in this view. Open the review in Claude while signed in to record them; you can still read everything.",
        "readonly": "You can read this review. Only its editors can record decisions.",
        "error": "That didn't save. Try again in a moment.",
        "saving": "Saving",
        "saved": "Saved",
        "closed": "The review is closed. Reopen it in the Summary to change anything.",
        "full": "The review record is full. Tell Eddie.",
    },
    "footer": "Built from the pack as it stood when this page was made. Each item names the file it came from.",
}

C = {"decisions": DECISIONS, "sections": SECTIONS, "ui": UI}
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "content.json")
json.dump(C, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"wrote {out}: {len(DECISIONS)} decisions, {len(SECTIONS)} sections")
