# HLR art direction

Pack role `art_direction`, in the engine's card schema (`asset-production/references/art-direction.md`). Lane B, Pack v0, 2026-10-18. Ratified 2026-10-22 by Eddie (Gate 2 package call 11); the Gate 1 picks it rests on (C3, C4, C5, C6, C8) go to HLR at Review 1.

Tags: [documented] the brand book `061022_HighLight_BrandBook_DS.pdf` (cited by PDF page) or the client; [observed] HLR's live work, from `outputs/step-1-review/pattern-review.md` (227 screenshots, a census of 2,092 frames) and its addendum; [derived] our proposal. A line with no tag is not art direction.

## The grammar

[observed] HLR's work leads with one serif line in Saol Display that carries a single italic accent word, set over a pale ground or a full-bleed photograph. Tracked Trade Gothic caps label it, Trade Gothic body explains it, and a small sign-off closes it (the wordmark in email and paid, the handle in social). Corners are square, rules are hairlines, and annotation callouts point at the piece. Dark ink sits on pale grounds and white sits on photography. [documented p16] Saol leads; Trade Gothic never sets a large headline or takes the lead. What never happens is the last section.

### 1. Grounds and pairings

- Default: Alabaster with Onyx ink. [documented p19] Gate 1 C4.
- Email page: white with Onyx ink; grey (`neutral-100`) or Alabaster bands. [observed] 96 of 109 send frames; Gate 1 C4.
- Alternate grounds: Forest and Onyx with Alabaster ink; Fawn with Onyx ink. Fawn is an accent ink on Forest and Onyx only. [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) Gate 1 C4; the modes are named at Gate 4.
- Photography: white ink where the image is calm and dark enough under the copy, judged by eye on the real image at review; the 50 percent overlay is optional. [observed] white on photography in every channel; no pair test (Eddie, 2026-10-18)
- Where each is used today [observed]: the email library cycles an Alabaster, Fawn and Forest trio; 2026 sends sit on white; stories alternate Alabaster and Onyx; the grid is photo-first.
- The certified set is `tokens.json` contrast-pairs; the law and the candidate mode values are in `token-model.md`. A new pairing is a contrast check and a proposal into that table.

### 2. Type behaviour

| Role | Face and style | Case | Leading | Where the type is the layout |
|---|---|---|---|---|
| display (s to xl) | Saol Display Light [documented p16, headline one] | sentence [documented p17], on every channel; caps headlines retire (Gate 2 call 2 a) | 1.0 [documented p17, 80/80] | text tiles, mantras, story text frames [observed] |
| headline | Saol Display Regular [documented p16, headline two] | sentence | 1.1 [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) | |
| accent word | the italic of the line's face: Light Italic or Regular Italic, one word per line [observed every channel; not in the book] | as the line | as the line | |
| quote | Saol Display Light [documented: p18 against p16, see `token-model.md`] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) | sentence | 1.29 [documented p18, 35/45] | quote modules and tiles |
| title, product name | Saol Standard Regular [documented p16] | sentence | 1.2 [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) | |
| price, numerals | Saol Standard Medium [documented p16] | | 1.2 [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) | |
| link (secondary CTA) | Saol Standard Regular with a trailing rule [documented p17] | sentence | 1.44 [documented p17, 16/23] | |
| body | Trade Gothic Regular [documented p18; Gate 1 C5 for every channel] | sentence | 1.47 [documented p18, 15/22] | long-copy slides, letters |
| eyebrow | Trade Gothic Regular, tracked 0.2em [documented p17] | caps | 1.4 [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) | |
| label, small headline | Trade Gothic Bold, tracked 0.2em [documented p16, p17] | caps | 1.4 [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) | |
| CTA label | Trade Gothic Bold, tracked 0.2em, in the outline box [documented p18; weight observed; Gate 1 C6] | caps | 1.4 [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) | |
| fine print, handle | Trade Gothic Regular [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) | as written | 1.4 [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) | |
| script | Homemade Apple, one short line per asset, social and email only [observed; Gate 1 C5] | as written | 1.4 [observed, 50/70] | |

- Scale [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11): one rendered ramp, a perfect fourth (1.333) above the body floor, with a value per canvas mode: `web`, `social` (1080 canvases), `email` (1200 masters) (Gate 2 question 1). A text style is set once and the master's canvas mode sets its size. Sizes in `token-model.md` section 3.
- Floors: web and IAB display take body 14 and small 12 CSS px, no text under 12 px rendered (Gate 2 call 5 a). 1080 canvases take body 40 and small 32 [documented: 14 and 11 rendered px on a 375 phone] (ratified 2026-10-22 by Eddie, Gate 2 package call 11), and 1200 email masters body 45 and small 35 (Gate 1 C8). Floors bind anything a reader must read: offers, terms, claims, CTAs, names, the handle.

### 3. Signature devices

1. The italic accent word: one per display line or headline. [observed]
2. The tracked caps eyebrow, standard or spread edge to edge. [documented p17; spread observed]
3. The hairline: dividers, the link's trailing rule, leader lines. [documented p17; observed]
4. The annotation callout: a leader line to a caps label on the piece, one to four per frame, numbered or not ("03 / Material"). [documented p48 to p50; observed]
5. The star: the one decorative device (`logo-assets.md`). [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) Gate 1 C3
6. The image on a mat (inset), and the diptych. [observed; diptych documented p44, p46, p52]
7. The script line. [observed] Gate 1 C5
8. The sign-off at the foot: the handle in social, the wordmark in paid and email. [observed]

Per surface [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11): the star at most once; at most one script line; callouts only on product imagery.

### 4. Photography

The book's four cards [documented], with where HLR uses them [observed]:

| Card | Light | Colour | Styling and feeling | Live use |
|---|---|---|---|---|
| AD1 Model campaign (p21) | natural, raw, ethereal; flares and glow welcome | soft, warm, romantic; black and white, pastels or jewel tones allowed | natural, abundant, classic; casting diverse, feminine, unique; the goal is an emotional reaction | email heroes, paid offers and lines, social covers, press covers |
| AD2 Product campaign (p22) | natural, raw, textural | soft, warm, romantic | close vignettes, styling simplified, always one organic object or material (fruit, linen, plants) | the web split hero, paid material cards |
| AD3 Product ecommerce (p23) | natural, simple, clean | warm, neutral, minimal | organic, simple, considered props; a sense of movement (a piece mid-swing, smoke, a rolling sphere) | email cards, paid annotated builds, the PDP, line sheets; few live shots show the movement the card asks for [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) |
| AD4 Social media (p24) | | | an assortment of nature, symbolic objects and places; a look pushed further toward the mystical than campaign; UGC and partners only when on-brand and authentic | proof of magic, moodboards, UGC reviews and DMs |

Live families with no card [observed], with a proposed handling [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) for Review 1:

- Cut-out on flat colour with a cast shadow (paid heroes, style boards): a variant of AD3, or retire.
- Founder portraits (letters, press pages, the mobile nav): photographer and usage unknown.
- Found and historical art, painterly (inset stories, a 700 hero, moodboards): third-party rights; reference only.
- Black and white documentary (2023 strips, the email follow block): inside AD1's black and white allowance.
- Illustration and line icons (a mantra email; seven draft icon sets): no card; the proof icons carry claims, so they go through the claims ledger.
- Stock (Website, Inspiration): license unknown; out.
- Aura gradients (500x500 on the paid page, not ads): not ad imagery; move out of paid.

People appear in HLR imagery [documented p21]. The pack's `faces_policy` stays null until HLR confirms releases and usage (owner HLR). Eddie owns the images on the reference file's Images page (now the library's `photos` page) and the product images on the site, and cleared them for HLR's designs [documented, DECISIONS 2026-10-23: Eddie's ruling, image rights]; a photo slot takes one of them, and any other image keeps the labelled grey placeholder (`component.placeholder.*`) until its right lands (project rule 8). Whether a generated image may stand in for a real shot is not ruled for HLR (owner Eddie).

### 5. Surfaces seen in live work

[observed] Email: hero overlays, product spotlights, review and press quotes, text blocks, two-up product grids, offers and promo bars, image blocks on mats, collages, founder letters, mantras, send chrome. Organic social: photo-first feed posts, headline over photo, type-only tiles, carousels for four running series, story sets (text, inset, full bleed, split), highlight covers. Paid: product heroes, offers over photo, inset photos with side labels, material cards, annotated builds and models, mantras, press and customer quotes, DM replies, mastheads, link ads, display banners. Web: nav, split hero, buy box, trust marquee, story tabs, testimonial, reviews and cross-sell, footer with the disclaimer. The recipes that build them: `asset-types.md`.

### 6. What never happens

- An em dash in any copy, product names included. [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) project rule; DECISIONS 2026-10-17
- A mark set in type or redrawn; the crest; the shell outside packaging; a 2022 archive mark. [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) Gate 1 C3; Gate 3 call 8 a
- A face other than Saol Display, Saol Standard, Trade Gothic and Homemade Apple; Trade Gothic as a large headline or leading over Saol. [documented p16; Gate 1 C5]
- A filled CTA box, a CTA in Fawn, a CTA drawn into social or Meta art, a rounded corner. [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) Gate 1 C6; [observed] radius 0 on every channel's buttons, cards and frames
- Fawn as an ink on Alabaster, white or the neutrals; light ink on Fawn. [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) the contrast law
- Copy on photography where the image is busy or light under it: white callouts over a light wall, dark copy over a face. [observed] pattern-review 5
- The retired grounds: blush #f0dfcf, #f1d6d6, #2e1d13, the site's #f7f4ee and #f6f4ee. [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) Gate 1 C4
- More than one star, or more than one script line, on a surface. [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) Gate 1 C3, C5
- Unlicensed photography or stock in a deliverable. [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) project rule 8
- A customer quote, review or star row without a verified source. [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) playbook section 3
- A sticker baked into a story; text, a face, a mark or the product's key detail across a carousel seam; copy inside a platform keep-clear band. [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) the engine's S03 and S04 recipes; [observed] 14 of 16 checked 9:16 paid frames set copy inside the bottom band
- Justified body, chevron links, hidden or buried copy left in a master, placeholder text in a send. [observed] pattern-review 5

## Master cards

None yet. A card is written for each master when it is built and approved at Step 4, in the engine's schema. Until then every composition is a proposal and is labelled as one. [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11)
