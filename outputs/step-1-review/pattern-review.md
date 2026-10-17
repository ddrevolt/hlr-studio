# HLR Pattern Review

Step 1b, read-only. 2026-10-17. Draft-for-ratification wherever a line is tagged [derived]. Gate 1 closes on Eddie's answers to section 6.

Sources:
- Reference file `LYyYXPDUHVoAABh865EvMI` (Eddie's copy of the client's work, snapshot 2026-10-17), all nine pages: 227 screenshots across four channel reviews, and a read-only census of 2,092 frames in 45 groups (type keys, inks, grounds, text insets, CTA geometry). Nothing in Figma was written.
- Chat 1 extracts: `figma/` (frame lists, corpora, inventory) and `site/`.
- Brand book `061022_HighLight_BrandBook_DS.pdf` (2022-06-11): graphic system p12 to p19, art direction p20 to p24, copy p25 to p38, applications p40 to p53.
- Platform guidance for safe zones (section 3).
- Evidence with every node id: `patterns/` (one inventory per channel, `census.md`, `census.json`, the subagent brief). Frame lists for the five pages chat 1 did not list: `figma/frames-{components,retail-press,print,inspiration,images}.tsv`.

Tags: [documented] the book states it (pN). [observed] the live work shows it (count, node ids). [derived] our inference or proposal; only Eddie ratifies it.

## 0. The system in one view

Keeps: what recurs in every channel.
- Saol Display headlines with one italic accent word [observed: email 22 of 28 sampled sends, social in every serif head of 52 renders, paid about 34 of 54 shots, the live site's H1; Saol Display Italic segments: email 421, social 444, paid 619]. The accent word is not in the book; its headline spec is roman, sentence case (p17).
- Trade Gothic tracked caps for eyebrows and labels [documented p17], in every channel [observed].
- Trade Gothic body [observed: all 28 sampled emails, web 13/20, social, paid]. The book's principal body is Saol Standard (p16, p17) and allows Trade Gothic "when legibility is a concern" (p18) [documented].
- Square corners: radius 0 on buttons, cards and frames [observed; exceptions in section 5].
- Hairlines and annotation callouts (leader lines to labels on a product) [documented p48 to p50; observed in about 222 frames: paid 181, social 41].
- White ink over full-bleed photography; dark ink on pale grounds [observed].
- A small sign-off at the foot: the handle in social (380 layers), the wordmark in paid (bottom center, 500 to 600 wide) [observed].
- Saol and Trade Gothic carry 93 to 100% of the text in each channel's top type keys [observed, census].

Flexes by channel: canvas and safe zones; type sizes (one rendered floor, converted per canvas); CTA presence (email: outline box; social: text cues only; paid: the platform button, except Google formats; web: buttons); copy length (email letters to a single paid line); ground (the email library's ground trio, photo-first social, Alabaster or photo in paid, off-white web) [observed].

Drift to rule (section 6): ink (Forest or Onyx); default ground (white, Alabaster or #F7F4EE); body face and the off-book display faces; CTA shape (five styles live); marks (the book's shell appears nowhere in the live digital work); email master width (700 or 1200).

## 1. Foundations seen

### 1.1 Color roles

| Role | Book | Email | Organic social | Paid | Web | Proposal [derived] |
|---|---|---|---|---|---|---|
| Ink on pale grounds | Onyx #353535 primary (p19) | Forest #17280A in 1200 work (2025 sends 785 segments, flows 267, library 166); Onyx in 700 work (2026 sends 465, holiday 252, final templates 153) | Forest in 2023 to 2024 stories (482); Onyx in text tiles | Onyx (1:1 388, 9:16 163, 4:5 64); Forest in boards (394) | Forest (847); #000000 component text (72) | one ink, call 2 |
| Ink on dark grounds and photos | white over images in the book's ad and email layouts (p48 to p53) | Alabaster on Forest (library 74); white on photo (2026, 71) | white over photo (grid 99 of 146 segments) | white (1:1 194, 9:16 204) | #F6F4EE on dark (live) | ink-inverse Alabaster; ink-on-photo white |
| Default ground | the lighter colors sit behind text; Alabaster primary (p19) | white (2025 sends 61 of 72 frames, 2026 35 of 37); Alabaster in the library (53) | Alabaster (stories 149 and 188); the grid is photo-covered (103 of 109) | Alabaster (1:1 150) | #F6F4EE (design 39), #F7F4EE (live) | call 2 |
| Alternate grounds | Sea Salt, Forest, Fawn secondary (p19) | library trio Alabaster, Fawn, Forest (Forest 37 frames; Fawn by eye); Onyx footer variant | Onyx (stories 100); dark brown #2E1D13 (Sept 2026) | Sea Salt-like panel (1.91:1) | Forest footer in the book (p46, p47) | ground modes Light, Warm, Deep, Night, Photo |
| Lines and CTA strokes | hairlines in the book's layouts | 2 px strokes in Forest, Onyx, #131313, #000000; Alabaster on dark | hairlines | hairlines | 1 px Forest | line and cta-stroke alias the ink |
| Underlays and off-palette | none | warm greys #EEEBE3, #ECE8E3, #EAE6E0; red #D54141 struck price | blush #F0DFCF under photos (86 frame fills, 0 visible in 52 renders) | #F1D6D6 (boards, 7); jewel-tone birthstone tiles | none | warm neutral ramp from the greys; retire the rest (section 5) |
| Gilt | gold foil, print only (p19) | none | none | none | none | print only |

Contrast, WCAG 2 ratios [derived from the hex values]:

| Ink on ground | Alabaster | White | #F7F4EE | Sea Salt | Fawn | Forest | Onyx |
|---|---|---|---|---|---|---|---|
| Onyx | 11.48 | 12.27 | 11.17 | 9.51 | 5.66 | 1.27 | 1.00 |
| Forest | 14.62 | 15.62 | 14.23 | 12.12 | 7.21 | 1.00 | 1.27 |
| Alabaster | 1.00 | 1.07 | 1.03 | 1.21 | 2.03 | 14.62 | 11.48 |
| Fawn | 2.03 | 2.17 | 1.97 | 1.68 | 1.00 | 7.21 | 5.66 |

Reading [derived]: every dark-on-pale and pale-on-dark pair clears 4.5:1 for body. Fawn carries dark ink only (Alabaster on Fawn is 2.03, under even 3:1). Fawn works as an accent ink on Forest and Onyx. White over photography has no fixed ratio, so it needs a scrim rule; the Sept to Oct 2026 work already lays a 50% black overlay on 9 frames [observed].

### 1.2 Type roles and ramp

Sizes in canvas px. SD Saol Display, SS Saol Standard, TG Trade Gothic LT Std.

| Role | Book | Email 1200 | Email 700 | Social 1080 | Paid 1080 | Web (CSS px) |
|---|---|---|---|---|---|---|
| Display, headline | SD Light (headline one), SD Regular (headline two); 80/80, sentence case, 0 tracking (p16, p17) | SD Rg 46/46, -1% (2025, 111 segments); to 140 | SD to 90 | SD Rg 60/85 (stories), 100/140 (page frames); Instrument Serif caps in the 2025 to 2026 grid | SD It 90/60 (1:1, 88 segments); SD Rg 75 to 80 (boards) | SD Light 40/44 (live H1); about 40 (PDP title) |
| Title: product name, pull quote | SS Regular; pull quote SD 35/45 (p16, p18) | SD 46 in review modules | | SS Rg 32/35.2 (100 segments) | SS Rg 32 to 35 | SS 18/22 (H2); quote SD Light about 36 |
| Eyebrow | TG caps 10/17, +20% (p17); TG Bold for small headlines (p16) | TG Rg 19.5 caps +20% (126) | TG Bd 18.5/25.9 caps +10% (72); TG Rg 14 caps +10% | TG Rg 15 to 18 caps +20% | TG Bd 36 caps +20% (1:1, 74); TG Rg 18 to 20 caps +20% | TG Bd 11/13.2 caps +10% |
| Body | SS 14/23 (p17); TG 15/22 when legibility is a concern (p18) | TG Rg 34/47.6 | TG Rg 24 to 26/36.4 | TG Rg 35 to 45/67.5 | SS Rg 35/38.5 (9:16); lowercase sans glosses | TG Rg 13/20 |
| CTA label | SS 16/23 link with a trailing rule (p17); TG caps 10/17 +20% in an outline box (p18) | TG Bd 26 caps +25% | TG Bd 19 caps +25% | none | SD It 40 "Shop now" (Google formats only) | TG Bd 11 caps +10% (design); SS 14/15 (live) |
| Price, numerals | SS Medium (p16) | | | | | SS 14/22 (cards); TG 13/20 (PDP) |
| Fine print, handle | none | legal lines | TG 14 caps | handle 18 to 24 px tall | TG Bd 10 to 12 caps in annotated builds | min 8 (1440), 6 (375) |
| Script accent | none | script stickers, signature images | | Homemade Apple 50/70 | | |

All [documented] in the Book column, [observed] elsewhere. Off-book faces by segments in each channel's top type keys [observed]: Miriam Libre 237 (email library display, 65.6/65.6), Futura PT Book 149 (paid boards, 100/110 +3%), Homemade Apple 35 and Instrument Serif 25 (social), Times New Roman 15 (social), Saol Display Thin Italic 33 (web; not a book style). Chat 1 also counted Inter (76, Sept to Oct 2026), Avenir LT Std (36, paid) and eight minor faces (section 5).

Type floors [derived]. One floor in rendered px on a 375-point phone, converted to each canvas: body 14; eyebrows, labels, handle and fine print 11 (the iOS interface minimum).

| Canvas | Shown on a 375 phone at | Body floor | Small floor | Observed body | Observed small (p10) |
|---|---|---|---|---|---|
| Social and paid, 1080 wide | 0.347 | 40 | 32 | 35 to 45 social; 32 to 35 paid | 15 to 26 |
| Email 1200, sent as image slices at 600 | 0.3125 | 45 | 35 | 34 | 19.5 |
| Email 1200, sent as live text at 600 | 0.5 | 28 | 22 | 34 | 19.5 |
| Email 700, sent as image slices | 0.536 | 26 | 21 | 24 to 26 | 14 to 18.5 |
| Link ads 1200x628 | 0.3125 | 45 | 35 | none | 30 |
| Web and display (CSS px) | 1 | 14 | 11 | 13 | 11 web; 3.5 to 9 in display banners |

Reading [derived]: the 2026 700 sends sit at the body floor; the 1200 work and the tracked caps everywhere sit under it (15 to 20 px caps show at about 5 to 7 px on a phone). Floors bind anything a reader must read: offers, terms, claims, CTAs, names, the handle. Decorative caps may stay smaller only if they carry nothing a reader needs.

Ramp proposal [derived], for Gate 2: body at the floor and a perfect-fourth step (1.333) above it, the step the email library already uses from body to headline (34 to 46). Rendered px, then per canvas:

| Step | label | body | title | headline | display-s | display-m | display-l | display-xl |
|---|---|---|---|---|---|---|---|---|
| Rendered (web CSS px) | 11 | 14 | 19 | 25 | 33 | 44 | 59 | 79 |
| Social and paid 1080 | 32 | 40 | 54 | 72 | 96 | 127 | 170 | 226 |
| Email 1200, image slices | 35 | 45 | 60 | 80 | 106 | 142 | 189 | 251 |
| Email 1200, live text | 22 | 28 | 37 | 50 | 66 | 88 | 118 | 157 |
| Email 700, image slices | 21 | 26 | 35 | 46 | 62 | 83 | 110 | 147 |

The 700 row sits close to what the 2026 sends already set (body 24 to 26, labels 18.5 to 19, heads to 90) [observed].

### 1.3 Spacing and grids [observed unless tagged]

- Email 1200: an 80 px text margin in every full-width library module; image mats 1050 wide (75 a side) as square, portrait 1050x1260 and landscape 1050x720, and a small 810; product cards 450x560 (4:5), 2 up; CTA box 333x94 (padding 85/37); outermost text 54 px from both edges (p5); about 13 words a line.
- Email 700: a 52 px margin (The Edit, 2:1330 against 2:193565 at 1200); body left inset median 66 to 74; CTA 215 to 245x67 (padding 46 to 48/26); about 8 words a line. The CTA label box is 24 px tall at both widths, so 700 type is about 1.7 times larger relative to width [derived].
- Social 4:5: eyebrow at x 62, y 37; handle box 240x22 with a 28 px bottom margin (2026); template insets 62 left, 63 right (p5); spread eyebrows run edge to edge.
- Stories: insets 79 and 72 at the sides, 242 top, 184 bottom (p5, 2023 to 2024); 75 bottom in Sept to Oct 2026.
- Paid: centered text boxes run full width (p5 side inset 0); wordmark 57 to 174 px from the foot (1:1), 75 (4:5), 120 (9:16 boards); side margin p10 50 px (4.6%).
- Web: desktop side margin about 100 to 158; mobile gutter about 17 to 20; Bootstrap breakpoints 576, 768, 992, 1200, plus 1024 and 1280.
- Retail and press 1800x1200: margin about 50; footer band about 100.
- Proposal [derived]: a 4-based space scale; margin and safe-zone tokens per canvas (section 3); grids: email 2-up and 3-up cards, social single column with an optional diptych, web 12 columns from the theme.

### 1.4 Devices

| Device | Book [documented] | Live [observed] | Proposal [derived] |
|---|---|---|---|
| Wordmark HIGH LIGHT RITUALS | logotype HIGH LIGHT in three cuts by size (p13); lockup with shell and "SANCTUARIES OF SELF AND SPACE" (p15) | email bar in 11 of 28 sends; "HIGH LIGHT" over italic "rituals" in templates (2:563, 2:809); paid bottom center, 2026 masthead at about 90% width (2:60736); posters; the only mark with a vector | primary mark, call 7 |
| Shell mark, "H shell L" | three versions (p14); "H shell L" atop every story ad (p48 to p50) | 0 of 28 emails, 0 of 54 paid shots, no social render; shells only as photo props and draft icons (2:31956, 2:31994) | call 7 |
| HLR monogram | none | PNG, 63 placements in press decks, a sparkle above it (2:33202) | call 7 |
| Four-point star (sparkle) | none | email nav footer (2:1062), story tops and feed corners (2:62552, 2:180130), display cards breaking an inset frame (2:35604), icons (2:31684) | call 7 |
| Crest | none | email footers (2:192035, 2:194481) | call 7 |
| Hairline rule | page rules in the book's layouts | email dividers, leaders, web hairlines, press footers | element |
| Annotation callout | callouts on product shots, "annotations fade in" (p48 to p50) | paid 148 builds (boards 2:42399, 2:45203), 13 on model (2:37799), 20 stacks (2:57502); social Field Notes 9 feed and 32 story frames, "NOTED MATERIALS" 29 layers (2:180130); web "FIG. 1" lists (2:184078) | element and module |
| Numbered plate | none | "03 / Material" (2:193777), numbered circles (2:180877), web "(1)" captions | callout variant |
| Eyebrow, tracked caps | p17 | every channel | element |
| Italic accent word | none (p17 head is roman) | every channel (section 0) | headline rule |
| Script accent | none | social sublines and titles; email stickers and signatures (2:9, 2:1478) | call 3 |
| Outline CTA box | p18 | email, 23 of 28 sends | call 5 |
| Text link with a trailing rule | p17 | "SHOP" plus rule on email cards and reviews (2:193967, 2:193247); italic link with a long arrow (2:193211); promo bar arrow (2:194014) | secondary CTA |
| Image on a mat (inset) | none | email image blocks (17), paid insets (2:46166), inset stories (2:62473), display cards (2:35604) | image element |
| Diptych | postcard p44, homepage p46, email p52 | email collage (2:193764), web split hero (2:185212), 2023 carousel slides | image element |
| Rotated caps label | email p52 | paid side labels (2:52919) | callout variant; low use |
| Star rating row | none | email reviews (2:193247, 2:193520); web reviews widget | element, sourced reviews only |
| Handle sign-off | none | 380 layers in 296 frames; bottom center since 2024 | element |
| Spread eyebrow | none | social journey prompts (2:181816); paid offer bands (2:53265) | eyebrow variant |
| Wax seal | packaging (p41, p43) | none in digital | packaging only |
| Publication logos | none | paid press quotes (2:36273); web "AS FEATURED IN" (2:185665); social "As seen in" (39 layers) | press module; rights |

### 1.5 Imagery families against the art direction cards

| Family | Card | Where [observed] | Count, ids | Note |
|---|---|---|---|---|
| Model and body, film editorial | AD1 Model campaign (p21) [documented] | email heroes (2:9, 2:193998); paid offers and lines (2:53265, 2:50853); annotated model (2:37799); social prompts and story covers (2:181816, 2:64042); press covers (2:33159) | Images page 15 (2:31312 to 2:31329) | rights unknown |
| Product vignette with an organic object | AD2 Product campaign (p22) [documented] | web split hero (2:185212); paid material cards (2:47064); press quote (2:36273) | Images 3 (2:31320, 2:31328, 2:31329); 36 HLR stills misfiled on Inspiration (from 2:194964) | |
| Sell shot on a plain ground | AD3 Product ecommerce (p23) [documented] | email cards and spotlights (2:193967, 2:9); paid annotated builds (2:42498); web PDP (2:185628); line sheets (2:33210) | Images 33 on chain (from 2:31331); zodiac flat lays 12 (2:31466 to 2:31510) | the card asks for movement ("alive"); few shots show it [derived] |
| Cut-out on flat color with a cast shadow | not in the book | paid heroes (2:56624, 2:57300); style boards (2:31434) | 5 sampled; 4 boards | an AD3 variant or retire, call 3 area [derived] |
| Assortment, UGC, found objects | AD4 Social media (p24) [documented] | "proof of magic" (2:181769); energy moodboards (2:181792); UGC reviews and DMs (2:58872, 2:48723); email blog collage (2:193664) | | UGC needs consent |
| Founder portraits | not in the book | founder letters (2:1478); press about pages (2:33409); mobile nav (2:184749) | Images 12 (2:31299 to 2:31310) | photographer, usage unknown |
| Found and historical art, painterly | not in the book | inset stories (2:62473); a 700 hero (2:9); moodboard covers | | third-party rights |
| Black and white documentary | AD1 allows black and white; documentary is not a card | 2023 carousel strips (2:64675); email follow block (2:251) | | |
| Illustration and line icons | not in the book | mantra email (2:4490); draft icon sets (2:31589 to 2:32079) | 7 icon sets | |
| Stock | not in the book | Website (2:185915, 2:185917 to 2:185920) | Inspiration 36 (2:194914 to 2:194952) | license unknown |
| Aura gradients | not in the book | paid page, 500x500, not ads (2:54349) | 12 | move out of paid |

Until rights land, every image in a build is a labelled grey placeholder (rule 8).

## 2. Pattern roster

Codes follow the channel inventories in `patterns/`, which hold every structure note and module sequence. Count methods: names (frame names in the lists), corpus (text layers), k of n (screenshot sample), nested (frames inside boards or sub-sections that chat 1's lists missed).

### 2.1 Email: 278 frames at 1200, 76 at 700

Library modules, all at 1200: 121 frames in 20 types, each in the ground trio (Alabaster, Fawn, Forest); 6-variant types add a trio that flips alignment or image side [observed].

| Code | Pattern | Count | Ids | Tag | Module |
|---|---|---|---|---|---|
| E-M01 | Feature split: eyebrow, name, link; plated image | 4 | 2:193211, 2:7443 | [documented p17] | Spotlight |
| E-M02 | Review split: half-bleed image, stars, pull quote, body, press slot | 13 | 2:193247, 2:191950 | [documented p18] | Quote |
| E-M03 | Long header, 3-line sentence | 12 | 2:193358, 2:193382 | [observed] | Text block |
| E-M04 | Short header with one italic word | 12; 22 of 28 sends | 2:193439, 2:193445 | [observed] | Text block |
| E-M05 | Body only | 6 | 2:193451 | [observed] | Text block |
| E-M06 | Bullet list | 3 | 2:193463 | [observed] | Text block |
| E-M07 | Two-column body, head or quote left | 6 | 2:193487, 2:193511 | [observed] | Text block |
| E-M08 | Centered review with attribution | 3; 5 uses in 2 sends | 2:193520, 2:1767 | [documented p18] | Quote |
| E-M09 | The Edit: eyebrow, head, body, image, outline CTA | 7 | 2:193565, 2:30619 | [documented p17] | Spotlight |
| E-M10 | Blog masthead "THE RITUALIST" with collage | 6, boards only | 2:193664 | [observed] | Collage |
| E-M11 | Eyebrow and header; offer variant "THIS WEEK ONLY" | 6; 5 of 28 | 2:193628, 2:193736 | [documented p17] | Text block, Offer |
| E-M12 | Image block on a mat, or full bleed | 17 | 2:193760, 2:193827 | [observed] | Image |
| E-M13 | Offset two-image collage | 3; 3 of 28 | 2:193764 | [documented p52] | Collage |
| E-M14 | Numbered split, "03 / Material" | 7 | 2:193777, 2:193795 | [observed] | Spotlight |
| E-M15 | Shop grid, 2 columns of 450x560 cards | 6; 6 of 28 | 2:193967, 2:984 | [observed] | Product grid |
| E-M16 | Outline button | 3; 23 of 28 | 2:193980, 2:1092 | [documented p18] | CTA |
| E-M17 | Image header with white overlay | 6 | 2:193998, 2:194008 | [documented p52] | Hero |
| E-M18 | Promo bar, one line and a long arrow | 12; welcome-offer line 31 | 2:194014, 2:5552 | [observed] | Offer |
| E-M19 | Divider hairline | 3 | 2:194018 | [observed] | Rule |
| E-M20 | Social footer with crest | 2 | 2:194481 | [observed] | Sign-off |

Send chrome and send-only blocks:

| Code | Pattern | Count | Ids | Tag | Module |
|---|---|---|---|---|---|
| E-H1 | Lockup header, "HIGH LIGHT" over italic "rituals" | 6 of 28 | 2:563, 2:809 | [observed] | Email chrome |
| E-H2 | One-line wordmark bar | 11 of 28 | 2:1092, 2:251 | [observed] | Email chrome |
| E-H3 | Hero overlay: wordmark, eyebrow, italic head, script | 11 of 28 (8 of 14 at 700) | 2:9, 2:5556 | [observed] | Hero |
| E-F0 | Stacked footer with crest | 7 of 7 board templates | 2:192035 | [observed] | Sign-off |
| E-F1 | Nav footer: Shop Now, The Ritualist, Follow Us, star, wordmark | 6 by name; 12 of 14 sends at 1200, 1 of 14 at 700 | 2:1062, 2:635 | [observed] | Sign-off |
| E-P1 | Product grid with copy (700) | 7 of 14 at 700 | 2:9, 2:31200 | [observed] | Product grid |
| E-P2 | Founder letter with signature | 8 of 14 at 700 | 2:1478, 2:8838 | [observed] | Letter |
| E-P3 | Affirmation or mantra | 4 of 28 | 2:4490 | [observed] | Mantra |
| E-P4 | Code CTA; struck price in red | corpus: LIGHT25 line 38, LIGHT30 line 15 | 2:2153, 2:5556 | [observed] | Offer |
| E-P5 | Spec rows in a flow | 1 of 28 | 2:190749 | [observed] | Meaning |
| E-P6 | Follow block, black and white photo, filled button | 3 of 28 | 2:251, 2:8838 | [observed] | Sign-off |
| E-P7 | Transactional card with a "DYNAMIC BLOCK" slot | 3, board | 2:194032 | [observed] | Flow card |

Most-used templates: Product Spotlight 2:563, Product Listing 2:683, Sale 2:984, Testimonials 2:809, Moodboard 2:913 (= 2:1696), boards 2:192035 and 2:193003 (Welcome 3 to 5). 700 sends: 2:9, 2:126, 2:251, 2:408, 2:481, 2:1330, 2:1478, 2:1767. Flows: browse 2:189609, cart 2:189904, abandoned cart 2:190749, checkout 2:191052.

2025 to 2026 [observed]: 1200 to 700 (from holiday 2025); Forest to Onyx ink; white pages with grey or Alabaster bands replace Forest and Fawn bands; the nav footer drops (0 of 12 sampled 2026 sends); the wordmark moves into the hero or a white bar; denser copy (founder letters, product notes, affirmations, journal prompts); filled buttons, script accents and signatures arrive.

### 2.2 Organic social: 525 at 9:16, 378 at 4:5, 27 at 1:1, plus 111 nested in Sept to Oct 2026

| Code | Pattern | Count | Ids | Tag | Module |
|---|---|---|---|---|---|
| S-WFYJ | "WORDS FOR YOUR JOURNEY" weekly prompt carousel | 8 by name; 4 of 23 posts in the Oct 2026 calendar, Mondays | 2:181816, 2:181810 | [observed]; HIGH SPIRITS lineage (p35) | Mantra |
| S-ENERGY | Monthly energy medicine: cover, "CRYSTAL ALLIES" slide, story set | one a month; "september energy medicine" 14 layers | 2:181792, 2:182011 | [observed] | Series |
| S-ANNOT | Annotated product, Field Notes | 9 feed, 32 story; "NOTED MATERIALS" 29 layers | 2:180130, 2:180877 | [documented p48 to p50] | Annotated |
| S-SEASON | Zodiac season crystals | May, Jun, Aug, Sep 2026 | 2:181620, 2:181993 | [observed] | Meaning |
| S-TEXT | Text-only tile on a flat ground | 5 rendered; 12 sign affirmations | 2:181328, 2:180244 | [observed]; nearest to p17 | Mantra, Quote |
| S-PHOTOTEXT | Headline over photo | text on 17 of 23 Sept to Oct grid frames | 2:181982, 2:181851 | [observed] | Hero |
| S-LONG | Long-copy slide in education carousels | 11 | 2:180943 | [observed] | Letter |
| S-OFFER | Offer tile and sale story | 3 grid lines; 8 sale stories | 2:181188, 2:179067 | [observed] | Offer |
| S-PHOTO | Photo-only tile: lifestyle, UGC, reel cover | text-free grid share 27 of 35 (Sep to Dec 2025), 26 of 51 (Jan to Aug 2026), 6 of 23 (Sep to Oct 2026) | 2:181774, 2:180194 | [observed] | Image |
| S-PROOF | "proof of magic" monthly collection | 1 tile; 1 calendar row | 2:181769 | [observed]; SUBLIME INTERVENTION lineage (p35) | Collage |
| C-STRIP | 2023 carousel strips: mission, mantra | 12 feed, 5 story strips | 2:180722, 2:64438 | [observed] | Carousel, rebuilt as frames |
| ST-TEXT | Text story on a solid ground | Moon 34 | 2:62552, 2:182912 | [observed] | Mantra |
| ST-INSET | Inset image story | Seeking the Sublime 35, Goddess 8, sale 8 | 2:62473, 2:179026 | [observed] | Image |
| ST-FULL | Full-bleed photo story with a Saol title | Launch 34, Spell Bracelets 40, Launch Story 13, Witch 17 | 2:64042, 2:62359 | [observed]; the book tops it with "H shell L" (p48 to p50) | Hero |
| ST-SPLIT | Split product story, photo over a white panel | zodiac families 100 | 2:178746 | [observed] | Spotlight |
| ST-HL | Highlight stories and covers | 61; covers 6 at 1507x1468 | 2:179342, 2:33106 | [observed] | Highlight cover |

Current look [observed]: since 2025 the grid is photo-first, with white Instrument Serif caps and one italic word, Homemade Apple script, Trade Gothic lines and a small handle bottom center; Saol stays in stories and flat text tiles. Grid tiles with any text: 23% (Sep to Dec 2025), 49% (Jan to Aug 2026), 74% (Sep to Oct 2026). No tile carries a button or outline box (0 of 52 renders).

### 2.3 Paid: about 422 at 9:16, 358 at 1:1, 141 at 4:5, nested boards included

| Code | Pattern | Count | Ids | Tag | Module |
|---|---|---|---|---|---|
| P-HERO | Product hero, cut-out with shadow on a plain ground | 5 of 54; "BETTER THAN BLACK FRIDAY" 20 | 2:56624, 2:53235 | [observed]; p17 stack [documented] | Spotlight |
| P-OFFER | Offer over full-bleed photo | corpus: LIGHT30 line 87, "30% off sitewide" 22 (inflated by buried copy) | 2:53265, 2:36590 | [observed] | Offer |
| P-GWP | Gift with purchase | corpus 4 and 3 | 2:51663 | [observed] | Offer |
| P-INSET | Inset photo on Alabaster, rotated side labels | Image01 set 22, BRACELET 9 | 2:46166, 2:52919 | [observed] | Image |
| P-INGRED | Material or stone card | 45 of 54 on one board | 2:47064 | [observed] | Meaning |
| P-ANNOT-BUILD | Annotated build, one callout added per frame | 148 nested | 2:42498, 2:45562 | [documented p48 to p50] | Annotated |
| P-ANNOT-MODEL | Annotated piece on model | 13 | 2:37799, 2:52036 | [documented p48 to p50] | Annotated |
| P-STACK | Annotated necklace stack | 20 | 2:57502 | [observed] | Annotated |
| P-LIST | Intentions list | 13 lines | 2:54733 | [observed] | Meaning |
| P-GRID | Birthstone 12-month grid | 1 frame, 3 boards | 2:57657 | [observed] | Product grid |
| P-LINE | Brand line over a model photo | corpus 25, 13, 8 | 2:50853 | [observed] | Hero |
| P-PRESS | Press quote with a publication logo | banners 6, drafts 6 | 2:36273 | [observed]; p18 | Quote |
| P-REVIEW | Customer quotes over UGC | 1 sampled; 8 quote lines | 2:58872 | [observed] | Quote |
| P-DM | Instagram DM reply | 6 statics, 12 storyboard frames | 2:48723 | [observed] | Quote |
| P-MANTRA | Mantra, built word by word | 41 on one board | 2:47957 | [observed]; p35 | Mantra |
| P-VIDEO | Storyboards and end frames | 3 boards (24, 41, 50) | 2:48398, 2:48703 | [observed] | End frame |
| P-MAST | 2026 masthead, wordmark at about 90% width | 6 sampled | 2:60736, 2:60756 | [observed] | Hero |
| P-LAND | 1.91:1 link ad with a drawn CTA | 3 of 26 | 2:36590, 2:56900 | [observed] | Hero |
| P-BANNER | Display banners | 20 | 2:36253, 2:36004 | [observed] | Banner |

Habits [observed]: 1:1 and 4:5 are mostly one layout resized; 9:16 and landscape are recomposed. Templates are duplicated and new copy is stacked over old, so the layer corpus overstates what ran. 92 of 181 top-level 9:16 frames carry no live text (flattened or empty).

### 2.4 Web: 111 frames at 1440 and 375

| Code | Pattern | Count | Ids | Tag | Module |
|---|---|---|---|---|---|
| W-NAV | Bar, header, mega menu | 4 menus; "Find Your Match" 38 | 2:184523 | [observed] | Header |
| W-HERO | Split hero, two images, white headline | 24 hero frames | 2:185212 | [observed]; p46 [documented] | Hero |
| W-BUY | PDP buy box | 6 | 2:185628, 2:185489 | [observed] | web only |
| W-TRUST | Trust marquee in Saol italic | "Healer-led" 8 | 2:185646 | [observed] | Proof line |
| W-STORY | "The energy inside this piece", tabs | 6 | 2:184078 | [observed] | Letter, Meaning |
| W-QUOTE | Testimonial | 3 | 2:185733 | [observed]; p18 | Quote |
| W-PROOF | Reviews, cross-sell, press | "You may also like" 10 | 2:185655 | [observed] | Product grid, Press |
| W-FOOT | Footer with disclaimer | 6 | 2:185644 | [observed] | Sign-off |
| W-MNAV, W-MPDP, W-FILTER | Mobile drawer, PDP, filter | 9, 4, 2 | 2:184749, 2:183590, 2:185324 | [observed] | web only |

### 2.5 Retail and press, print, components, images, inspiration

| Code | Pattern | Count | Ids | Tag | Module |
|---|---|---|---|---|---|
| R-COVER | Deck cover | 5 | 2:33159 | [observed] | Hero |
| R-ABOUT | Ethos, story, founder | 8 | 2:33202, 2:33409 | [observed] | Letter |
| R-SHEET | Line sheet with spec table and wholesale price | 37 | 2:33210 | [observed]; confidential | Spotlight |
| R-GRID | Multi-product page | 14 | 2:34416 | [observed] | Product grid |
| R-CRYSTAL | Crystal sheet, 2024 | 5 | 2:33438 | [observed] | Meaning |
| R-SHORT | Intro, press, thank you | 10 | 2:34320 | [observed] | |
| R-CARD | Display cards: wordmark, inset frame broken by a sparkle | about 10 | 2:35604 | [observed] | |
| PR-POSTER | Poster 3600x5400 | 2 | 2:35752 | [observed]; p45 | Hero |
| PR-SIGN | Sign 1200x1800 with QR and offer | 1 | 2:35791 | [observed] | Offer |
| PR-GIFT | Sign 1800x1200 | 1 | 2:35799 | [observed] | |

- Components page: the book's p16 ramp as loose text layers with no styles (2:31580 to 2:31588) [documented p16]. Seven draft icon sets in line art with caps labels: stars, crescent moon, shell, hands, figures, laurel, infinity, circles, coin; no crystal (2:31589 to 2:32079) [observed]. The proof icons carry claims ("BLACK-OWNED HEALER-LED", "CONSCIOUSLY HANDMADE", "3 - YEAR WARRANTY", "FREE ENERGY READING on orders $300+").
- Images page: 51 rows, mapped in section 1.5.
- Inspiration page: 121 items: third-party references, a stock library, camera files of unknown source, and misfiled HLR stills and video frames. Its direction (black and white figure light, candlelight, flowers, shells, soft focus) already shows in the live editorial; screenshots of other brands' ads (packshots on saturated color) do not [observed]. Reference only.

### 2.6 Cross-channel equivalents [derived]

| Job | Email | Organic social | Paid | Web | Print, press | One module |
|---|---|---|---|---|---|---|
| Product spotlight | E-M01, E-M09, E-M14 | ST-SPLIT | P-HERO, P-INSET | W-STORY | R-SHEET | Spotlight |
| Annotated product | E-P5 (labels only) | S-ANNOT | P-ANNOT-BUILD, P-ANNOT-MODEL, P-STACK | W-STORY "FIG. 1" | | Annotated |
| Quote: review, press, founder, philosophy | E-M02, E-M08 | S-TEXT, ST-INSET | P-REVIEW, P-DM, P-PRESS | W-QUOTE | press pages | Quote |
| Mantra, affirmation | E-P3 | S-WFYJ, ST-TEXT, S-TEXT | P-MANTRA | | | Mantra |
| Offer | E-P4, E-M11, E-M18 | S-OFFER | P-OFFER, P-GWP | W-NAV bar | PR-SIGN | Offer |
| Launch | E-H3 with "INTRODUCING" (14 layers) | ST-FULL (Launch 34) | board labels "NEW NECKLACES DROP" | | | Hero, launch eyebrow |
| Monthly ritual: energy medicine, seasons, birthstones | "9/30 - October energy medicine" (2:31200) | S-ENERGY, S-SEASON | P-GRID | | | Series templates |
| Meaning: stone, metal, intention | E-P5 | S-SEASON, S-LONG | P-INGRED, P-LIST | metal copy (2:184421) | R-CRYSTAL | Meaning |
| Letter, editorial | E-P2, E-M10 | S-LONG, C-STRIP | | W-STORY founder note | R-ABOUT | Letter |
| Product grid | E-M15, E-P1 | | P-GRID | W-PROOF | R-GRID | Product grid |
| Hero overlay | E-M17, E-H3 | S-PHOTOTEXT, ST-FULL | P-LINE, P-MAST, P-LAND | W-HERO | PR-POSTER, R-COVER | Hero |
| Collage, moodboard | E-M13, E-M10, 2:913 | S-ENERGY cover, S-PROOF | | | | Collage |
| Proof line | | | "Handmade in America" (39 layers) | W-TRUST, icons | | Proof line |
| Sign-off | E-F0, E-F1, E-M20 | handle | wordmark at the foot | W-FOOT | footer trio | Sign-off |

## 3. Channel requirements

| Channel, format | Master | Live frames [observed] | Safe zone | Type floors, master px [derived] | Margins | Format notes |
|---|---|---|---|---|---|---|
| Email | 1200 wide, 2x of 600 [derived, our convention, the library's width]; 700 in 2026 sends [observed] | 278 at 1200; 76 at 700 | none; alt text on every image slice [derived] | sliced: body 45, small 35; live text: 28, 22; 700 sliced: 26, 21 | 80 at 1200, 52 at 700 [observed] | 700 is a 1x rebuild, not a scale; 2:9 ships as 10 slices [observed]. ESP route and send width unknown (HLR) |
| Feed 4:5 | 1080x1350 | 378, plus 87 nested | the 3:4 profile grid shows the center 1012 of 1080, about 34 px off each side [derived] | body 40, small 32 | 64 sides [derived from 62 observed]; handle 28 from the foot | carousels now separate frames; 2023 strips had 40 to 56 px gutters [observed] |
| Story 9:16 | 1080x1920 | 525, plus 17 nested | top 270 (14%), bottom 384 (20%), sides 65 (6%) [derived] | body 40, small 32 | bottom insets 184 (2023 to 2024), 75 (Sept to Oct 2026) [observed] | stickers added in the app [observed] |
| Reel cover and Reels | 1080x1920; covers 4:5 | 1 reel a month (Sep to Nov 2025, Sep 2026) | bottom 672 (35%) for Reels [derived] | body 40, small 32 | | covers are photo-only 4:5 (2:181774) |
| Paid feed | 1080x1080, 1080x1350 | about 358 and 141 | keep copy 54 px (5%) inside the edge [derived] | body 40, small 32 | boxes run full width; wordmark 57 to 174 from the foot (1:1), 75 (4:5) | no CTA in the art; the platform adds it [observed] |
| Paid 9:16 | 1080x1920 | about 422 | top 270, bottom 672, sides 65 [derived] | body 40, small 32 | lowest text 30 to 185 px from the foot in 14 of 16 checked [observed] | 92 of 181 top-level frames flattened or empty |
| Link and Google | 1200x628 standard [derived]; 1200x1200 | 1280x628 (23), 1200x628 (2), 1260x628 (1); 1200x1200 (21); 1280x720 photo crops (17) | 5% edge [derived] | body 45, small 35 | | drawn CTA: white box, Saol italic "Shop now", 230x61 [observed] |
| Display | IAB 728x90, 300x250, 160x600 [derived] | 728x90 (5), "medium rectangle" 500x300 (5), "wide skyscraper" 600x160 (5), 180x150 (5) | | body 14, small 11 (CSS px) | | text 3.5 to 9 px; names and sizes disagree [observed] |
| Pin 2:3 | 1000x1500 | 5 | | | | channel unconfirmed (HLR) |
| Web | 1440, 375; theme breakpoints 576, 768, 992, 1200, 1024, 1280 | 111 design frames | | body 14, small 11 (live body 13) | 100 to 158 desktop, about 20 mobile | Shopify theme; reviews widget [observed] |
| Retail and press | 1800x1200 | 90 pages, 6 decks | | | about 50; footer band about 100 | 37 pages carry wholesale prices: confidential. Outside Phase 1 |
| Print | 3600x5400 poster (12x18 in at 300 dpi), 1200x1800 and 1800x1200 signs (4x6 in) [derived inches] | 4 | | | | Gilt foil, print only (p19). Outside Phase 1 |

Platform sources: Meta's Ads Guide refuses automated reads, so the 9:16 figures come from a 2026 summary of Meta's unified Stories and Reels safe zone (billo.app, "Meta Ads Safe Zones: A Guide to the 2026 Unified Creative Updates"); confirm in the Ads Guide before the first paid build. The 3:4 profile grid is from 2025 to 2026 coverage (inro.social, kapwing.com); the 34 px crop is our geometry.

## 4. System skeleton, draft-for-ratification

Principle [derived]: one set of roles, elements and modules for every channel. A channel changes only layout values (canvas, margins, safe zones, type sizes from the rendered floors) and which modules it uses. Theme rides on ground modes, never on per-variant fills.

### 4.1 Tokens

| Tier | Tokens | Value or rule | Tag |
|---|---|---|---|
| Primitive | color-onyx, color-alabaster, color-sea-salt, color-forest, color-fawn | #353535, #FBF7EF, #E0E3E5, #17280A, #BEADA3 | [documented p19] |
| Primitive | color-white, color-black-50 (scrim) | #FFFFFF; #000000 at 50% | [observed] |
| Primitive | warm neutral ramp | from #EEEBE3, #ECE8E3, #EAE6E0 between Alabaster and Onyx; steps set at Gate 2 | [observed] values, [derived] ramp |
| Primitive | font-saol-display, font-saol-standard, font-trade-gothic | styles in use: SD Light, Regular, Italic; SS Regular, Medium, Italic; TG Regular, Bold | [documented p16] |
| Primitive | radius-0, stroke-hairline | 0 everywhere; 1 px rendered (2 px on 2x masters) | [observed] |
| Semantic | ink-default, ink-inverse, ink-on-photo | call 2; Alabaster; white | [derived] |
| Semantic | ground-light, ground-warm, ground-deep, ground-night, ground-photo | Alabaster (white for the email page, call 2); Fawn; Forest; Onyx; photo with scrim | [observed] trio, [derived] roles |
| Semantic | line, cta-stroke, cta-label | alias the ink of the mode | [derived] |
| Semantic | type roles: display, headline, title, quote, body, eyebrow, label, cta, price, fine, script | faces per call 3; the italic accent rule lives on headline | [derived] |
| Component | cta-outline | stroke, label, padding; square | [documented p18] |
| Component | callout | 1 px leader, dot or number, label style | [documented p48 to p50] |
| Component | image-mat, rule, star-row, handle | | [observed] |
| Layout | canvas modes: email-1200, feed-1080x1350, story-1080x1920, square-1080, link-1200x628, web-1440, web-375 | margins, safe zones, the ramp per canvas (1.2), grids | [derived] |
| Layout | space scale | 4-based | [derived] |
| Mode | ground modes Light, Warm, Deep, Night, Photo | the email library's trio maps to Light, Warm, Deep | [observed] |

Contrast law preview [derived]: dark ink on Light and Warm; light ink on Deep and Night; Fawn never carries light ink; Photo requires the scrim. Gate 2 certifies the pairs.

### 4.2 Elements (01 Elements)

| Code | Element | Absorbs | Tag |
|---|---|---|---|
| EL-01 | Wordmark: bar, masthead, sign-off | E-H1, E-H2, P-MAST, paid foot | [observed]; call 7 |
| EL-02 | Small mark | monogram, star, crest, shell | call 7 |
| EL-03 | Eyebrow: standard, spread | every channel | [documented p17] |
| EL-04 | Headline with one italic accent word | every channel | [observed] |
| EL-05 | Body block | every channel | [documented p17, p18] |
| EL-06 | CTA outline box, inverse on photo and dark | E-M16 | [documented p18]; call 5 |
| EL-07 | Text link with a trailing rule | E-M01, E-M15 | [documented p17] |
| EL-08 | Rule: hairline, divider | E-M19 | [observed] |
| EL-09 | Callout: leader and label; numbered | S-ANNOT, P-ANNOT-*, E-M14 | [documented p48 to p50] |
| EL-10 | Image frame: full bleed, mat, diptych | E-M12, E-M13, P-INSET, ST-INSET | [observed]; diptych [documented p44] |
| EL-11 | Star row | E-M02, E-M08 | [observed]; sourced reviews only |
| EL-12 | Handle sign-off | social | [observed] |
| EL-13 | Offer line with merge tokens: code, percent, threshold | E-P4, P-OFFER | [observed]; C10 |
| EL-14 | Swipe cue | S-TEXT | [observed] |
| EL-15 | Proof line: icon and caps label | W-TRUST, icons | [observed]; claims ledger |
| EL-16 | Price | W-PROOF cards | [documented p16] |
| EL-17 | Script accent | social, email | call 3 |
| EL-18 | Labelled grey image placeholder | every build until rights land | rule 8 |

### 4.3 Modules (02 Modules)

| Module | Absorbs | Channels | Variants | Content |
|---|---|---|---|---|
| Hero | E-M17, E-H3, S-PHOTOTEXT, ST-FULL, P-LINE, P-MAST, P-LAND, W-HERO, PR-POSTER, R-COVER | all | overlay or split; launch eyebrow; canvas modes | design-loose |
| Spotlight | E-M01, E-M09, E-M14, ST-SPLIT, P-HERO, P-INSET, W-STORY, R-SHEET | all | image side, ground mode, numbering | names and prices from the product database |
| Annotated | S-ANNOT, P-ANNOT-BUILD, P-ANNOT-MODEL, P-STACK | social, paid; new in email | 1 to 4 callouts, numbered or not, on model or on ground, build order for motion | callout text from the claims ledger |
| Product grid | E-M15, E-P1, P-GRID, W-PROOF, R-GRID | email, paid, web | 2-up, 3-up, with copy | product database |
| Quote | E-M02, E-M08, S-TEXT, ST-INSET, P-REVIEW, P-DM, P-PRESS, W-QUOTE | all | review, press, founder, philosophy; split or centered | sourced only (Judge.me, press ledger) |
| Mantra | E-P3, S-WFYJ, ST-TEXT, S-TEXT, P-MANTRA | all | flat ground or photo; cover and slides | voice contract |
| Offer | E-P4, E-M11, E-M18, S-OFFER, P-OFFER, P-GWP, PR-SIGN | all | bar, block, tile | merge tokens until C10 lands |
| Meaning | E-P5, S-SEASON, S-LONG, P-INGRED, P-LIST, R-CRYSTAL, web metal copy | all | card, list, legend | claims ledger (C2) |
| Letter | E-P2, E-M10, S-LONG, C-STRIP, W-STORY note, R-ABOUT | email, social, web | signature on or off | voice contract |
| Collage | E-M13, E-M10, 2:913, S-ENERGY cover, S-PROOF | email, social | diptych, offset, 3x3 | image rights |
| Text block | E-M03 to E-M07, E-M11 | email | head length, alignment, columns | |
| Image | E-M12, S-PHOTO | email, social | mat sizes, full bleed | image rights |
| Email chrome | E-H1, E-H2, E-F0, E-F1, E-M18, E-M19, E-M20, E-P6 | email | header, footer, promo bar, divider | |
| Press | P-PRESS, W-PROOF press row, R-SHORT press, "As seen in" | paid, web, social | logo strip, quote | third-party rights |

### 4.4 Templates (03 Templates): pure instances of the modules

- Email: Product Spotlight (2:563), Product Listing (2:683), Sale (2:984), Testimonials (2:809), Moodboard (2:913), the editorial send (2:9, 2:1330, 2:1767), Welcome 1 to 5 (2:193003, 2:8838), monthly energy medicine (2:31200); flows: browse (2:189609), cart (2:189904), abandoned cart (2:190749), checkout (2:191052). Held: 2:1092 ("Anxiety Calming Pieces") until C2 rules on health-adjacent claims.
- Organic social: single feed post (photo; photo with headline); carousels for the four live series, Words For Your Journey (2:181816), energy medicine (2:181792), Field Notes (2:180130), season crystals (2:181620), plus "proof of magic" (2:181769); story sets: text (2:62552), inset (2:62473), full bleed (2:64042), split (2:178746); highlight cover.
- Paid, if call 6 takes it: hero set at 1:1, 4:5 and 9:16 (2:53235), offer set (2:53265), annotated set (2:42498, 2:37799), quote set (2:58872, 2:36273), mantra (2:47957), link 1200x628 (2:36590), end frame (2:48703).

## 5. Outliers to retire

Items [observed]; actions [derived].

| Item | Where, count | Ids | Action |
|---|---|---|---|
| Off-book faces | Miriam Libre (email library, 353 segments in chat 1's count), Futura PT (paid, 200), Avenir LT Std (36), Inter (76), Times New Roman (17 grid segments), Saol Display Thin; Kristi, Ingrid Darling, Allison, Arvo, Over the Rainbow, P22 Cezanne Pro, GT Walsheim Pro, Cannu (chat 1) | 2:180792; 2:53206 (Futura, by eye) | retire unless call 3 gives a role |
| Near-duplicate inks | #131313, #000000, #1F2918, #353635, #1F1F1F as text or strokes | census | collapse to ink-default |
| Grounds | #F0DFCF (an underlay under photos), #F1D6D6, #2E1D13, pale blue; #F6F4EE beside #F7F4EE | 2:182912 | do not adopt; one ground-light |
| Radius | 1 px on 305 email nodes; 30 and 60 on 38 paid nodes | census | radius 0 |
| Hidden copy inside modules | the "Embody the force" / "of the natural world" group: 131 layers, 0 visible, carried into 112 frames | 2:193247, 2:193382 | strip before rebuilding |
| Hidden remnants | "What is the Highest Self? How can I connect with it?" 144 layers, 0 visible; "Cosmic Bliss" 36 (1 visible) | | exclude from the corpus |
| Buried copy | paid templates duplicated with old copy under new images or off canvas | 2:59084, 2:56975 | rebuild clean |
| Placeholders in sends and art | "xxx.", "TBD TBD", "tktkt", "PRESS LOGO" (6), "Text will be here", "$00" (20), "$xx" (20), "Jane Smith" (5), "TO BE COMPLETED" (9 pages), "& X MORE HEALING CRYSTALS" | 2:481, 2:29855, 2:191052, 2:37279 | retire |
| Handle errors | "@HIGHTLIGHTRITUALS" 51 layers in 40 frames (2023 mission strips); one doubled handle | 2:180729, 2:64438, 2:64907, 2:64908; 2:182952 | fix |
| Typos | "The Spell BRacelets", "Black Toumaline", "RELIEVE STRES", "it's" for "its", "REAIL PRICE", "Pendent", "Satisfaction guranteed" | 2:52895, 2:37948, 2:42498, 2:194032 | fix on any reuse |
| Non-standard sizes | 1280x628 (23), 1260x628 (1); banners named for IAB sizes but sized 500x300 and 600x160; organic 1:1 (27, older, lorem); 1073, 1082, 1080x1342, 1080x1352 | | 1200x628; IAB sizes; 4:5 masters |
| Not ads on the paid page | 500x500 aura gradients (12) | 2:54349 | move to assets |
| Layout habits | justified body (2:1478, 2:8838); chevron links (2:408); blank tails from re-widthed frames (2:481, 2:31200); 9:16 copy inside the platform's bottom zone (14 of 16 checked) | | retire |
| Low contrast | white callouts over a light wall; dark text over a face | 2:52036, 2:178559 | retire |
| Rights risks | another maker's photo as a PDP placeholder; third-party names on image layers; stock on Website (5) | 2:185169; 2:191431, 2:191499; 2:185915 | grey placeholders until cleared |
| Strip-built carousels | 2023 strips with gutters | 2:180722 | separate 4:5 frames |
| Open notes | "edit logo & resize all templates below" (2:1090) on 2:563, 2:683, 2:809, 2:913, 2:984 | | closed by the rebuild |
| Book devices absent from digital | shell, "H shell L", wax seal | | call 7 |

## 6. Gate 1 and the calls the review made blocking

Ranked by production-blocking risk. Eddie's picks on calls 2, 3, 5 and 7 become the token proposal for Review 1, where HLR confirms.

**1. Gate 1 (b): organic social coverage.** Carousels now carry the feed: Sept to Oct 2026 holds 87 feed frames across 16 posting days, about 5 a day. The file holds 14 caption lines for those 16 days, under five different labels, and none for any earlier post. Four series recur (Words For Your Journey weekly, energy medicine monthly, Field Notes, season crystals).
- 1. Existing types only: S01 feed set and S02 story or reel cover; carousels and captions become logged gaps. Fastest; HLR's team builds the dominant format by hand.
- 2. A brand-free organic social type in the same engine release as the scrub: a carousel recipe (cover, slides, end slide; 4:5 masters, 3:4-grid-safe sides) and an organic caption route. One more engine change before Step 3.
- 3. Option 2 plus story-set recipes (text, inset, full bleed, split). Widest coverage; stories are 525 frames, though S02 already covers the frame.
- Default 2: carousels are the default post, and HLR's team will run it.

**2. Ink and default ground (C4).** Onyx is the book's ink and runs in the 2026 sends and paid; Forest runs on the site, in the 1200 library and the 2025 sends. Every candidate pair clears 11:1.
- 1. Onyx on Alabaster (book law). Forest, Fawn and Onyx become alternate ground modes; white stays the email page ground (96 of 109 send frames use it) and the ink on photos. The 1200 library and the site change ink when rebuilt.
- 2. Forest on #F7F4EE (the live site). Departs from the book, the 2026 sends and paid.
- 3. Channel modes: Forest on web, Onyx elsewhere. Least change now; two inks in every token and contrast check.
- Default 1. Blush #F0DFCF is not adopted (an underlay); #F1D6D6 and #2E1D13 retire unless HLR names a role.

**3. Faces (C5).** Saol and Trade Gothic carry 93 to 100% of the text; body is Trade Gothic in every channel, which p18 allows for legibility. Instrument Serif (25 segments) and Homemade Apple (35) carry the current grid's look and are the only faces with cleared licenses.
- 1. The book pair only: Saol for display, titles, quotes and prices; Trade Gothic for body, eyebrows and labels; every other face retired. The grid loses its script and Instrument Serif heads.
- 2. The pair plus Homemade Apple as a script accent, one short line per asset, social and email only; the rest retired.
- 3. Option 2 plus Instrument Serif for social headlines. Two display serifs, but it is the cleared fallback if Saol's license fails.
- Default 2.

**4. Email master width (C8), moved up from Gate 4 because it sets the email layout tokens in Pack v0.** 278 frames at 1200 (library, 2025, flows), 76 at 700 (2026 sends). The 700 sends are a 1x rebuild shipped as slices, with type about 1.7 times larger relative to width, which keeps sliced text legible on a phone.
- 1. 1200 masters with type sized for image slices (body 45, small 35): one width, our convention, exportable to a 600 or 700 send at the 2026 legibility. Every type size in the 1200 library rises about a third.
- 2. 1200 masters with live-text sizes (body 28, small 22): closest to today's library; legible on phones only if HLR's ESP sends copy as live text.
- 3. 700 masters, as the 2026 sends: no change for HLR's team; the library is rebuilt at 700 and the engine convention bends.
- Default 1 until HLR confirms how the ESP builds sends; switch to 2 if copy goes live.

**5. CTA (C6).** Five styles are live: the email outline caps box (23 of 28 sends; "SHOP NOW" 339 layers), white and Onyx filled boxes (2026 email), filled Forest caps (web design), outline Saol (live site), italic Saol outline (mobile). Paid draws one only on Google formats; social never. Radius 0 everywhere.
- 1. Outline caps box (p18) primary, inverse on photos and dark grounds; the trailing-rule text link (p17) secondary; filled boxes retired. The site's buttons change at its next rebuild.
- 2. Filled square box primary, outline secondary. Off-book; reads stronger on photos.
- 3. Text link only (p17). Quietest and closest to the book's lead example; a weaker tap target in email.
- Default 1.

**6. Paid scope (v2 question 11).** About 920 paid frames in the three main formats, boards included; 9:16 copy sits inside the platform's bottom zone in 14 of 16 checked; banners set text at 3.5 to 9 px.
- 1. Phase 1 stays email and organic social; paid findings wait for Phase 2.
- 2. Add Meta paid (1:1, 4:5, 9:16) on the social modules, with the safe zones; Google and display later; web stays tokens only. More templates in Step 4, no new foundations.
- 3. Option 2 plus Google formats (1200x628, 1200x1200) and IAB display. Widest; display needs its own small-canvas floors.
- Default 2: same canvases and modules as organic social, and the 9:16 safe-zone fix pays off on the first paid build.

**7. Marks (C3).** The book's shell and "H shell L" appear in 0 of 28 emails, 0 of 54 paid shots and no social render. The live work signs with the wordmark, the four-point star, a crest and the HLR monogram (PNG); only the wordmark is a vector.
- 1. The live roster: wordmark primary; the star as the one decorative device; the monogram for small spaces; crest retired; the shell kept for packaging only.
- 2. The book roster: logotype and shell, "H shell L" atop stories; star and crest retired.
- 3. The live roster with the shell (with star) as the small mark; monogram and crest retired.
- Default 1, sent to HLR with the vector request.

**8. Corpus re-cut.** Chat 1's frame lists hold only the direct children of each section and miss 111 Sept to Oct 2026 social frames and 524 paid frames; the layer corpus counts hidden and buried copy.
- 1. Re-cut the corpus to visible text with a recursive walk at the start of chat 3 (read-only, the census method).
- 2. Keep the corpus with the inflations flagged; the claims and voice seeds then lean on lines that never ran.
- Default 1.

Still open with HLR, unchanged from v2: positioning and claims (C2), font licenses, mark vectors, image rights, the products export, offers (C10). New for HLR: how the ESP builds sends (slices or live text) and at what width; where captions live; the conflicting origin and karat claims in paid ("Handmade in America", "HANDMADE IN NYC", "handwoven in CT"; 14k and 18k recycled gold).
