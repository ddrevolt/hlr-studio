# HLR site, observed (2026-10-17)

Source: https://highlightrituals.com, the homepage and the Seeds of Protection Bracelet page, read in the built-in browser on 2026-10-17. Shopify store `high-light-rituals.myshopify.com`, theme "[C8] | Release Candidate | 11-13-25". Provenance: observed. Nothing here is ratified. Client text is quoted verbatim except where a quote would carry a dash, which is cut and marked [...].

## Positioning and copy

- Page title: "High Light Rituals [...] Fine Healing Crystal Jewelry, Healer-Activated".
- Hero: "Shamanic energy healing & hand-blessed talismans to guide you home"; CTA "Let's begin".
- H1: "You've done the work." The paragraph under it names talk therapy, manifestation practices and apps, then: "Our work goes where those tools haven't reached."
- "Founded and led by a Shamanic Practitioner, High Light Rituals guides your return to wholeness through energy medicine and sacred jewelry, one season of growth at a time."
- Nav line: "Where Jewelry Meets Energy Work". Nav groups: shop by type (Bracelets, Necklaces, Personalized Jewelry, Birthstones, Crystals & Tools), by collection (Sacred Layers, Tiny Talismans, Spell Jewelry, Garden, Amulet), by intention (Protection & Grounding, Intuition & Divine Connection, Abundance & Prosperity, Calm & Inner Peace, Confidence & Worthiness), and healing (What Is Shamanic Healing?, Book Your Session, Meet Donnie, Read Donnie's Substack).
- Product page title pattern: "The Seeds of Protection Bracelet | Black Tourmaline | Reiki-Activated". Sections: "The energy inside this piece", "Our Founder", "Our Process", "Collective Impact", "Common Questions", "Energy Readings".
- Footer disclaimer: "We have experienced the transformative power of crystals and stones firsthand, but we do not consider energy work to be a substitute for medical treatment. Our products are not intended to diagnose or treat ailments."
- Free shipping: the announcement bar says "Free shipping for orders $50+"; the cart drawer says "You are $100 away from Free shipping!" with an empty bag. Two thresholds.

## Tokens (computed styles)

Colors. Count = homepage elements using the value (text, fill or border).

| Value | Where | Count | Book |
|---|---|---|---|
| #17280A | All ink; filled buttons; borders; reviews widget | text 1970, fill 19, border 83 | Forest (secondary in the book) |
| #F7F4EE | Page ground (the theme's body background) | fill 62 | None (Alabaster is #FBF7EF) |
| #F6F4EE | Light text on dark, some fills | text 38, fill 7 | None (one step from #F7F4EE) |
| #FBF7EF | Fills, often at 70% | fill 14 | Alabaster |
| #BEADA3 | Fills, borders | fill 18, border 5 | Fawn |
| #E0E3E5 | Fill | fill 1 | Sea Salt |
| #FFFFFF | Fills; text on dark | fill 53, text 44 | None |
| #000000 | Component text; outline button | text 384 | None (Onyx #353535 does not appear) |
| #1F1F1F | H2 and paragraph text | text 3 | None |
| #4A5A3D, #E3DAD5, #EEE6DE | Accents | 3, 4, 1 | None |

Framework noise, not brand: Bootstrap's #0D6EFD and #DEE2E6 (components and the accessibility widget).

Type.

| Element | Face | Size / line (px) | Weight | Case, tracking | Color |
|---|---|---|---|---|---|
| H1, homepage | Saol Display | 40 / 44 | 300 | | #17280A |
| H1, product page | Saol Display | 31.1 / 35 | 300 | -1.44px | #17280A |
| H2 | Saol Standard | 18 / 22 | 400 | | #1F1F1F |
| H3 | Saol Display | 14 / 22 | 400 | | #17280A |
| H4 (eyebrow) | Trade Gothic | 11 / 13.2 | 700 | Caps, 1.1px | #17280A |
| Body, links, nav | Trade Gothic | 13 / 22 (paragraphs 13 / 16.9) | 400 | Nav +0.26px | #17280A |
| Price, product page | Trade Gothic | 13 / 20 | 400 | | #17280A |
| Price, cards | Saol Standard | 14 / 22 | 400 | | #17280A |

CTAs and shape.
- Filled: Saol Display 18 / 22, white on #17280A, 1px #17280A border, square (homepage buttons, cookie "Accept").
- Outline: Saol Standard 14 / 15, capitalized ("Add to bag"), black label and 1px black border, no fill, square (product page).
- Text link: "LET'S BEGIN", small Trade Gothic caps (hero).
- Radius is 0 on every button and on the reviews widget.
- Breakpoints: 576, 768, 992, 1200 (Bootstrap) plus 1024 and 1280.

Fonts.
- Saol Display 300 and 400, roman and italic, and Saol Standard 400, roman and italic: self-hosted WOFF2 in the theme. The Saol Standard web files are not in the client's font folder.
- Trade Gothic 400 and 700: the Monotype web kit (files b1979d94 and f9be987b), the same kit as on disk. No Monotype page-view tracking request appeared on the homepage; the EULA requires the tracking code wherever Monotype supplies one.
- Declared but not loaded on these pages: an Adobe Fonts kit (`use.typekit.net/mhw3leu`, trade-gothic-next 300, 400, 700); Playfair Display, Poppins and Roboto from apps; Kanit and Nunito Sans hosted by Klaviyo for its forms.
- Not on the site: Instrument Serif and Homemade Apple (social only, per the client's note).

## Stack seen

- Shopify, on a Bootstrap-based custom theme.
- Klaviyo onsite forms: likely the email platform; confirm.
- Judge.me reviews (72 on the Seeds of Protection Bracelet): a sourced pool for customer evidence.
- Beam Impact SDK: a giving widget. Any giving claim needs a ledger row.
- Instafeed (Instagram feed), Swiper and Slick carousels, an accessibility widget.
- Social: `instagram.com/highlightrituals`; `lightnessbydonnie.substack.com`.

## Catalog (summary; snapshot in `catalog-2026-10-17.tsv`)

- 182 published products and 650 variants; 549 variants carry a SKU (101 do not; 20 products have none). First published 2023-05-01, latest 2026-09-10.
- Types: Bracelet 94, Necklace 65, Ritual Kit 12, Crystals 3, Not for Collections 3, untyped 2, Anklet 1, Chain 1, Waist Beads 1.
- Prices from $5 (gift bag) to $2,300 (top variant). 74 products tagged made to order; 13 unavailable.
- Services sold as products: Shamanic Healing Session, 60 minutes ($200); Shamanic Healing Intensive, 2 hours ($300); Crystal Reiki Session, 45 minutes ($150); Initiation Session & Anchor Charm ($200); Custom Soul Spell Bracelet And Energy Reading ($405); Custom Seeds Bracelet And Energy Reading ($250); Personal Intuitive Message Add-On ($33).
- Metals offered: 14K Solid Gold, 14K Gold Filled, Sterling Silver, and 14K Rose Gold on one pendant.
- Bestsellers collection (13): Seeds of Wholeness (Chakra), Seeds of Protection (Black Tourmaline), Seeds of Abundance (Citrine), Mermaid Necklace for New Beginnings, Mermaid Bracelet, Custom Seeds Bracelet And Energy Reading, Classic Bracelet in Rose Quartz, Garden Pendant in Moonstone, Blessings & Protection Amulet, Classic Bracelet in Black Tourmaline, Seeds of Harmony (Watermelon Tourmaline), The Love Drop, The Sacred Pendant.
- The vendor field reads "High Light" on every product.
- Defects to fix before a database: 2 type mismatches (the Seeds of Abundance Necklace is typed Bracelet; the Word Witch Bracelet is typed Necklace); 6 handles that no longer match their titles (one ends in "-copy", one carries "-x-", one says 90 minutes on a 45-minute session); stone tags copied across products (the Kunzite, Dumortierite and Chakra bracelets are tagged golden rutilated quartz); "Gold FIlled" casing; titles mix em dashes (68) and en dashes (11).
- Product names carry dashes. Our copy needs a house-style rendering without them, for example "The Seeds of Protection Bracelet in Black Tourmaline".

## Claims (summary; scan in `claims-scan-2026-10-17.md`)

Descriptions mention energy (139 products), healing (64), protection (50), negativity (49), chakras (34), shielding or warding off (33), activation (32), manifestation or attraction (29), vibration or frequency (29), shamanic work (24), Reiki (19) and anxiety or stress (11). Health-adjacent lines include "soothes anxiety and restores emotional equilibrium. It's said to calm the nervous system" and "a beautiful tangible tool to banish anxiety". Sourcing and material claims: recycled 14 karat gold (79), "ethically-sourced" (51), "responsibly sourced, high quality, untreated natural crystals" (47), "water-resistant, and tarnish-resistant" (93, gold filled care), "Handmade & Shamanically Activated in Westport, CT" and "Made in America" (1). The homepage sets the work against talk therapy and calls it energy medicine. The book's fertility kit does not appear in descriptions, but a "fertility" collection holds 29 products and a "health-vitality" collection 3.

## What this changes in the Brand Review

- Positioning moved from the book's "Timeless jewelry for self and space" and "We are not creating a new-age practice" (p8, p32) to shamanic energy healing, energy medicine and healer-activated jewelry. The voice principles may still hold; the positioning and the claims load have changed.
- The live ink is Forest #17280A on a #F7F4EE ground. Onyx #353535 does not appear, so the book's primary pair (Onyx and Alabaster) is not the live pair.
- Buttons are square: filled Forest with a Saol Display label, or outline with a Saol Standard label. The book's tracked Trade Gothic caps CTA survives only as a small text link.
