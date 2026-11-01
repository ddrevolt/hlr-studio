# Email HTML twins and assembler (step 8, item email-html)

Built by the build runner, 2026-10-31 (New York time). Code: `crew/producers/email_html.py` (twins and assembler), `crew/producers/email_screens.py` (Playwright). Tests: `crew/tests/test_email_html.py`. No Figma call, no network.

## What exists

- `twins/M01-600.html` to `twins/M27-1200.html`: one table-based twin per module, at 600 and 1200 wide, each with a Playwright screenshot beside it (`.png`) and `proportions.json`. Each slot shows as its own id, a fixture, never copy.
- `assemble` renders the email writer's block list to one HTML file. Protection of energy: header (M01 default, M23 by flag), hero M02, blocks, a closing CTA band M14 from the send's `cta`, footer M09.
- Sizes come from `tokens.flat.json` (email canvas) and the slot map's Review 1 notes; every size is the 1200 design value times width/1200, so 600 and 1200 are one layout.

## What a person must check against Figma [derived]

The pack carries no module geometry beyond these, so the rest of the twin layout is derived from the slot map's `use_when` text and notes. Eddie's chat reads the masters and compares (a Figma read; the runner makes none):

- [observed] margin 80 (`space.email-margin`); [documented] gap 40 (space/10).
- [derived, from slotmap notes] M03 image 622 x 812, copy column 338; M04 Statement header column 860 and body 740; M02 Tall spacer 504.
- [derived, no source] hero height 1000, hero headline in display-s 106, header bar 200, promo bar 100, mat image 1040 x 780, full bleed 1200 x 900, feature image 500 x 625, spec-row image 240, collage gap 40, vertical padding 120, M18 and M13 image 500 x 625, footer marks sizes except the star (64 x 71, [observed] slot map M09).
- Muted ink #63615f is color.semantic.text.muted [documented, tokens.json]. Sizes and colors read `brand-pack/web/tokens.flat.json`; the link arrow is always added (E02 Style=Arrow) and CTA and link padding are [derived].
- Ground inks on deep and night are white [derived]. The inset style of M16 uses the placeholder grey [derived].
- Assembler choices [derived]: the header is M01 unless `--header M23`; the send's `cta` renders as an M14 band before the footer with `link_token` as every CTA's href; product card links are `{{url_<product_id>}}`.

## Gaps, each with an owner

1. Fonts: Saol Display, Saol Standard, Trade Gothic LT Std and Homemade Apple are named with web-safe fallbacks; licenses unconfirmed (owner HLR, via Eddie). Every file carries the license flag. Screenshots show the fallback faces, so line breaks differ from Figma.
2. Marks (wordmark, lockup, star, social icons, press logo) are labelled grey placeholders: vectors and press rights are not supplied (owner HLR, logo-assets.md rule 5).
3. Images are labelled grey placeholders unless `--images images.json` gives a URL per well (`M02.image`, `card0`, ...). Rights per image: owner HLR.
4. Footer nav labels, the disclaimer, the postal address and the unsubscribe label and URL stay merge tokens (`{{footer_nav_1_label}}`, `{{footer_nav_1_url}}` (each nav label links to its url token), `{{footer_disclaimer}}`, `{{postal_address}}`, `{{unsubscribe_label}}`, `{{unsubscribe_url}}`); the disclaimer is `products.json` `_meta.brand_facts` `site_footer_text`, resolved by the producer or Klaviyo, not here.
5. Email clients: background images in the hero use `background` plus CSS, no VML fallback; the real clients are not tested here (owner Eddie, a send test once `klaviyo-access` closes).
6. Masters are sent as image slices (Gate 1 C8); these twins are the live-text path, which the slot map's M09 note already anticipates.

## Proportion check

`email_screens.py`: each module's height at 600 is half its height at 1200 (3 percent), and no file is wider than its width. The check against the Figma master's own heights is not made (needs a Figma read).

7. Responsiveness: every table is a fixed pixel width (600 or 1200) with no media query, so a 600 send on a phone may scroll or shrink; the option set also leaves M02 Show wordmark unrendered, M18 stars as typed glyphs (not the E08 element) and no VML hero fallback (owner Eddie, a send test and a decision on a responsive layer).
