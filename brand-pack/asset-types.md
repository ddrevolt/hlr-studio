# HLR asset types

Pack role `asset_types`, in the engine's recipe grammar (`asset-production/references/asset-types.md`). Lane B, Pack v0, 2026-10-18. Ratified 2026-10-22 by Eddie (Gate 2 package call 11); Phase 1 covers email, organic social, paid and web (Gate 1, Brand Review Q11).

Tags: [documented] the brand book (cited by PDF page); [observed] HLR's live work (`outputs/step-1-review/pattern-review.md`, codes from its section 2); [derived] our proposal.

Authority. Slot ids and budgets live in the slot maps, which win over anything stated here: `slotmap_social`, `slotmap_paid` and the web `section_library` (lane D: planned, every budget null until Step 4 measures the masters) and the email `slotmap.yaml` (Chat 6). Prefixes are in `figma.yaml`: E elements, M email, S social, P paid, W web, T templates; numbers are assigned at build and never reused (Gate 3 call 10). Platform numbers (keep-clear bands, the profile grid crop, caption limits, the carousel range) come from the engine's `placement-specs.json` and `organic-specs.json`, never from the pack.

Every recipe: text slots stamped in namespace `hlr`, flex-proven at 2x, bound to `tokens.json`; type from the one roster, sized by the master's canvas mode (`web`, `social` or `email`, set on the master's root; an element stays on Auto and takes the mode of the frame it sits in; Gate 2 question 1); images as labelled grey placeholders until rights land (project rule 8); art direction from `art-direction.md`.

## Canvases

| Canvas | Size | Canvas mode | Carries | Tag |
|---|---|---|---|---|
| Email master | 1200 wide, sent as image slices | `email` (body 45, small 35) | email | Gate 1 C8 |
| Feed | 1080x1350 master; 1080x1080 and 1080x1920 siblings | `social` (body 40, small 32) | organic social, Meta paid | [observed] 4:5 leads the grid, 110 of 117 frames |
| Story | 1080x1920 | `social` | organic social, Meta paid | [observed] about 525 frames |
| Link ad | 1200x628 | none: no overlaid copy (Gate 2 call 1) | Google | [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) the standard size; the live 1280x628 (23) and 1260x628 (1) retire |
| Square link | 1200x1200 | none: no overlaid copy (Gate 2 call 1) | Google | [observed] 21 frames |
| Display | 728x90, 300x250, 160x600 | `web` | IAB display | [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) the live banners are named for IAB sizes but sized 500x300 and 600x160; display floors body 14 and small 12 (Gate 2 call 5 a) |
| Web | CSS px, designed at 1440 and 375 | `web` (body 14, small 12; Gate 2 call 5 a) | web | [observed] breakpoints at Gate 4 |

## Organic social (the engine's portable recipes)

**S01 Feed post set.** Engine recipe: 1080x1350 master with 1080x1080 and 1080x1920 siblings as variants of one set. HLR structures [observed]:
- Photo card: the grid's photo-first tile (text-free on 27 of 35 tiles in late 2025, 6 of 23 in Sept to Oct 2026). Reel covers are photo-only 4:5 tiles, so they build here.
- Headline over photo (S-PHOTOTEXT): one white Saol display line with its italic accent word, where the photo is calm under it (the 50 percent overlay optional); handle at the foot.
- Type-only card on a flat ground (S-TEXT): a mantra or affirmation.
- Offer tile (S-OFFER): figures as merge tokens until C10 lands.
Art direction moves: one display line, one accent word; caps eyebrow; the handle bottom centre (28 px above the foot in 2026 work [observed]); at most one script line; no drawn CTA [Gate 1 C6].

**S02 Story or reel cover.** [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 15) Not adopted: reel covers run as S01 photo cards and story covers as S04 frames.

**S03 Carousel set.** Engine recipe: cover, inner and end panels at 1080x1350 from one component set, `Panel` property. Build mode: gutter, separate frames [observed: current carousels are separate frames; the 2023 seamless strips retire]. HLR series that run as carousels [observed]:
- Words For Your Journey: weekly prompts, Mondays (4 of 23 posts in the October 2026 calendar).
- Energy medicine: monthly; a cover, a crystal slide, a story set.
- Field Notes: annotated product (9 feed, 32 story frames).
- Season crystals: zodiac seasons (May, Jun, Aug, Sep 2026).
- Proof of magic: a monthly collection.
Art direction moves: the cover carries the promise in display type with a swipe cue; inner panels hold one idea each (education carousels run long-copy slides at the body floor); the end panel signs off. Captions are written in layers today (14 caption lines for 16 posting days [observed]); where captions live is a Review 1 question for HLR.

**S04 Story set.** Engine recipe: 1080x1920 frames from one component set, `Structure` property. All four structures are HLR's own [observed]: text (ST-TEXT: Moon, 34 frames), inset (ST-INSET: Seeking the Sublime, 35), full bleed (ST-FULL: Launch 34, Spell Bracelets 40), split (ST-SPLIT: zodiac families, 100; a photo over a white panel). Safe zones: the organic story band (`organic-specs.json` story), not the ads 9x16 keep-clear (Gate 2 call 3 b, Eddie, 2026-10-18); a story runs as an ad only after a re-layout onto a P## master. Stickers are added in the app [observed].

## HLR's own types

**Highlight cover** [observed]: 61 highlight stories and 6 covers at 1507x1468 (ST-HL). No recipe yet: canvas and structure are a Gate 4 item (owner Eddie).

**Email modules, M##, 1200.** [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) The module roster from pattern-review 4.3, each absorbing the observed patterns listed there: Hero, Spotlight, Annotated (new in email), Product grid, Quote, Mantra, Offer, Meaning, Letter, Collage, Text block, Image, Email chrome (header bar, footer, promo bar, divider), Press. Built in Chat 6 at 1200 in the ground modes, exported as slices. Geometry seen at 1200 [observed]: an 80 px text margin (`space.email-margin`); image mats 1050 wide (75 a side) as square, 1050x1260 portrait, 1050x720 landscape, and a small 810; product cards 450x560 (4:5), two up. The CTA box is measured at build: the observed 333x94 holds a 26 px label, and C8 raises the label to 35. The nav footer keeps the star and the wordmark; the crest leaves it (C3).

**Email templates, T##.** [observed] Pure instances of the modules, rebuilt from the client's most-used: Product Spotlight (2:563), Product Listing (2:683), Sale (2:984), Testimonials (2:809), Moodboard (2:913), the editorial send (2:9, 2:1330, 2:1767), Welcome 1 to 5 (2:193003, 2:8838), monthly energy medicine (2:31200); flows: browse (2:189609), cart (2:189904), abandoned cart (2:190749), checkout (2:191052). Held until C2 rules: 2:1092 ("Anxiety Calming Pieces").

**Paid concepts, P##.** Engine recipe: one single-frame concept in fixed ratios (1x1, 4x5, 9x16) as variants, with the action-safe guide. HLR's concept families [observed]: product hero (a cut-out on a plain ground), offer over photo, inset photo with rotated side labels, material or stone card, annotated build (one callout added per frame, for motion), annotated piece on model, necklace stack, intentions list, birthstone grid, brand line over a model photo, press quote with a publication logo, customer quote over UGC, DM reply, mantra built word by word, masthead (the wordmark at about 90 percent width), video end frame. Meta art carries no CTA (the platform adds it) and signs off with the wordmark at the bottom centre [observed]. Google link and square ads carry no overlaid copy and no drawn CTA: the words live in the platform's headline and description fields (Gate 2 call 1, Google a, Eddie, 2026-10-18; Google's responsive display guidance advises against overlaid text). The live white box with a Saol italic label retires.

**Web sections, W##.** [observed] Nav and announcement bar, split hero, PDP buy box (web only), trust marquee in Saol italic, story tabs ("The energy inside this piece"), testimonial, reviews and cross-sell, footer with the disclaimer, mobile drawer, mobile PDP, filter. Per-breakpoint budgets live in lane D's `section_library`; breakpoints at Gate 4.

**Elements, E##.** [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) From pattern-review 4.2: wordmark (bar, masthead, sign-off), small mark (the monogram), eyebrow (standard, spread), headline with one italic accent word, body block, CTA outline box (inverse on photo and on dark grounds), text link with a trailing rule, rule, callout (leader and label; numbered), image frame (full bleed, mat, diptych), star row (sourced reviews only), handle sign-off, offer line with merge tokens, swipe cue, proof line (icon and caps label, through the claims ledger), price, script line, labelled grey placeholder.

## Physical, retail and print

HLR makes them [observed]: press and wholesale decks at 1800x1200 (90 pages, 37 with wholesale prices, confidential), posters at 3600x5400, signs at 1200x1800 and 1800x1200, display cards, packaging with the shell and a wax seal [documented p41, p43], an ecomm mailer (15.7x11 in). Outside Phase 1: no recipes in Pack v0. Gilt is a print foil only [documented p19].

## Delivery

[documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) Screen: PNG at 1x and 2x. Email: image slices from the 1200 masters with alt text on every slice; if HLR's ESP sends live text, C8's live-text sizes replace the slice sizes. Every report lists the tokens, marks (file path), slot ids, flex results and contrast pairs it touched, and carries the standing flags: fonts unlicensed, imagery unlicensed.
