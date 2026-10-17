# HLR email channel: pattern inventory (Step 1b slice)

2026-10-17. Read-only, data only. Sources: Highlight-Rituals-Design-Forge `LYyYXPDUHVoAABh865EvMI`, page Email (0:1), Eddie's copy of the client files (snapshot 2026-10-17); `frames-email.tsv`, `corpus-email.tsv`, `figma-inventory-2026-10-17.md` (cited as "step 1 inventory"), `brand-review-v2.md`; the 2022 brand book cited as pN.

Tags: [observed] = seen in the Figma work (screenshot, single-frame metadata, the TSVs, or the step 1 inventory where named). [documented] = stated or shown in the book, with pN. Contradictions are stated where they occur.

Short forms used in tables:
- Faces: Saol (Display or Standard; the two cannot be told apart at screenshot scale), Saol i (italic), TG (Trade Gothic Regular), TGc (Trade Gothic Bold, caps, wide tracking), HA (Homemade Apple script). Face names come from the step 1 inventory; roles are what I saw.
- Colors (sampled from screenshots; each matches the inventory or p19 where named): Alabaster #FBF7EF, Fawn #BEADA3, Forest #17280A, Onyx #353535, Sea Salt #E0E3E5, white #FFFFFF, near-black #131313.
- CTA shapes: O = outline box, TGc label, square corners; F = filled box, square; U = TGc word with a separate underline rule; L = Saol i sentence-case link with a long rule arrow; P = promo line with a rule arrow.
- Imagery cards: 3.1 model campaign (p21), 3.2 product campaign (p22), 3.3 product ecommerce (p23), 3.4 social media (p24).

## 1. Coverage

[observed] From `frames-email.tsv` (527 rows: 411 frame nodes; 116 loose text, image, slice and line nodes).

| Section | Rows | Frames | Full emails | at 700 | at 1200 to 1222 | Screenshots | Metadata reads |
|---|---|---|---|---|---|---|---|
| final resized email templates | 42 | 39 | 26 | 17 | 9 | 9 | 3 |
| modular blocks | 146 | 134 | 9 | 0 | 9 | 15 (3 boards, 12 modules) | 19 |
| cart checkout browse flows | 77 | 52 | 42 | 0 | 42 | 2 | 1 |
| campaigns 2025 | 122 | 99 | 60 | 0 | 60 | 6 | 0 |
| holiday 2025 | 48 | 26 | 17 | 14 | 3 | 1 | 0 |
| campaign 2026 | 83 | 54 | 41 | 36 | 5 | 2 | 0 |
| welcome 2026 | 6 | 6 | 6 | 6 | 0 | 1 | 0 |
| page level | 3 | 1 | 0 | | | 0 | 0 |
| Total | 527 | 411 | 201 | 73 | 128 | 36 | 23 |

Method:
- Full email = a frame at 700 or 1,200 to 1,222 px wide, at least 1,600 px tall, that is not a library module, module grid or board. The rule misses at least one complete short email (2:3881, 1200x1461).
- Screenshots (36, the cap): 19 full emails one at a time; 3 boards that show 13 more emails (2:192035 templates, 7; 2:193003 welcome series, 3; 2:194032 post-purchase, 3); 12 module frames (2 at small size to check variants); 2 footers. Emails seen: 32 of 201.
- Metadata (23 reads): 19 module frames, 3 frames in the final section (2:9, 2:1256, 2:669), 1 flow (2:190629).
- Resolution limit: tall emails rendered 139 to 480 px wide at maxDimension 1600, and the saved PNGs are the same size, so crops add no detail. Type, stroke and spacing detail therefore comes from module screenshots (0.64 scale), metadata and the step 1 inventory.
- The 5 final-section 1200 templates (2:563, 2:683, 2:809, 2:913, 2:984) match the Templates board emails by height (7,076, 5,273, 8,135, 8,171, 4,705); I read them from the board, not one by one.

## 2. Pattern roster

### 2a. Full-email templates

| ID | Pattern | Structure, top to bottom | Count (method) | Examples |
|---|---|---|---|---|
| E01 | Monthly letter edit, 700 | [observed] Full-bleed hero (wordmark, Saol i title, HA subline, F white CTA) > Sea Salt info bar with arrow (700x97) > centered TG letter with sign-off > 2x2 product cards (TGc stone eyebrow, Saol name, TG blurb, U link; HA notes over images) > grey offer band (Saol i headline) > review card (image bleeding left, stars, Saol quote, U) > grey affirmation band (TGc eyebrow, Saol quote, O) > fine print. October variant: hero > letter with HA signature > F Onyx CTA > Saol headline > 2x2 cards > Alabaster block (inset image, Saol headline, O) | Anchor line "Monthly energy medicine" in 6 frames; "energy medicine" lines in 11; structure seen in 2 | 2:9, 2:31200, 2:30046 |
| E02 | Short letter edit, 700 | [observed] Wordmark on white > inset image (about 95 px side margins) > justified TG letter, HA signature right > Saol headline + centered TG > 2-up cards (image, TGc eyebrow, Saol title, TG, U) | 11 frames at 700x2723 (9 named Editorial Style Edit, plus 7/21 and 9/24); seen 1; 7 of the 11 hold only 1 or 2 text layers (not verified) | 2:1478, 2:8977, 2:30786 |
| E03 | Testimonial edit, 700 | [observed] Wordmark > inset image > Saol headline with italic word > TG letter + HA signature > rule > [stars > Saol quote headline > TG review > small attribution > O] x3, separated by staggered two-image collages that bleed to opposite edges | 3 frames at 700x4813; anchor "Words from the heart" in 3 frames; seen 1 | 2:1767, 2:1829, 2:30939 |
| E04 | Chaptered theme edit, 700 and 1200 | [observed] Hero (3.1, wordmark, Saol title with italic phrase) or wordmark + inset image + right-aligned title > Saol intro with italic lead-in > O > rule > [TGc eyebrow > Saol headline, italic second line > TG body left, image right > O] repeated with rules > Alabaster or Fawn closing block > O | 700: TheEdit 3 (700x5538) + 2 at 700x8097; anchor "Current Theme" in 14 frames; 1200: board template 6 and welcome series email 5; seen 2 + 2 on boards | 2:1330, 2:30619, 2:192035 (template 6) |
| E05 | Product-grid announcement, 700 | [observed] Hero 3.2 (wordmark, Saol title with italic word, O white) > TG intro > 2x4 grid (Saol i stone, TGc benefit, TG line) > O > feature: TGc eyebrow, Saol headline with italic, TG, L; product image right | 2 frames at 700x4280 (named Welcome Email 14 and 17); seen 1 | 2:126, 2:29383 |
| E06 | Sale or offer, 700 and 1200 | [observed] Hero (wordmark, TGc eyebrow, Saol title, code CTA) > TG body > Saol offer line + O with code (1200) > rule > Saol headline with italic > 2x2 cards (TGc eyebrow or descriptor, Saol name, price pair with red strike at 700, U at 1200) > code CTA (F Onyx at 700) > second grid (700) > gift-guide text + image on Forest (1200) > fine print > link-row footer (700). Board template 5 (Alabaster): TGc "THIS WEEK ONLY", Saol "20% off select styles", 3.1 image, O, 2x2 grid, template footer | 9 frames by name at 1200 (final 1, 2025 7, holiday 1); "SAVE WITH CODE LIGHT25" in 29 frames, "SHOP WITH CODE: LIGHT30" in 6; seen 2 + 1 on board | 2:5556, 2:2153, 2:984 |
| E07 | Product spotlight deep dive, 1200 | [observed] Lockup on Alabaster > M01 Featuring > M03 long header + body > 3.1 image > "Wear It When..." two-column > O > product image > M08 "Product Details" bullets > O > Forest promo bar > template footer (stacked links + crest) | 12 by name (final 1, 2025 8, holiday 1, 2026 2); seen on board | 2:563, 2:4432, 2:5929 |
| E08 | Product listing in grids, 1200 | [observed] Lockup > M17 hero ("Welcome to your sanctuary", O white) > M09 "Fine Jewelry" two-column > M16 2x3 grid (3.3 alternating with 3.1 crops; Saol names; U "SHOP") > template footer | 2 by name; seen on board | 2:683, 2:192870 |
| E09 | Curated picks, 1200 | [observed] Hero 3.1 (wordmark, TGc "CURATED BY DONNIE", Saol title, O white) > Saol headline with two italic words + TG > 2x2 cards (Saol i title, TG, U) > O | 2 (same name, size, texts); seen 1 | 2:1155, 2:4919 |
| E10 | Testimonials, 1200, Forest | [observed] Lockup on Forest > 3.1 image > M10 review > M02 image left (with "PRESS LOGO") > M02 image right > Alabaster "Shop Our Selection" 2-up > Fawn review with image > template footer on Alabaster | 2 by name; seen on board | 2:809, 2:6895 |
| E11 | Inspiration moodboard, 1200, Forest | [observed] Lockup on Forest > 3.1 image > Saol "Seek the sublime" (italic last word) > TG > O > collage > four numbered chapters "01 / Intention" to "04 / Result" (Saol i numeral and slash, TG, O) with images > template footer | 2 (same name, size, texts, both in final); seen on board | 2:913, 2:1696 |
| E12 | Themed product edit, 1200 | [observed] Wordmark on white > Saol headline with italic word > inset B&W image (4:5) > TG > 2x2 cards (Saol name, U) > O > rule > inset nature image > Saol headline with italic > TG quote + body > O > link-row footer | 2 by exact name; 13 more seasonal or themed names in 2025 and 2026 not verified; seen 1 | 2:1092, 2:4855 |
| E13 | The Ritualist journal, 1200 | [observed] Lockup > 3.1 hero > TGc "THE RITUALIST" + date right > Saol headline > long TG body with inline link > M12 collage + Saol pull quote > still-life image > pull quote + body two-column > O > rule > template footer | Not identified by name (2:7381 has the same height; not verified); seen on board | 2:192035 (template 7) |
| E14 | Monthly mantra, 1200 | [observed] Lockup on white > Saol headline (italic "Your") > centered TG mantra lines > four-point star > square line illustration on paper texture (1035x1007 est.) > link-row footer | 3 by name; seen 1 | 2:4490, 2:6447, 2:6501 |
| E15 | Monthly newsletter, 1200 | [observed] Wordmark (Onyx) > text + image (TGc "NEW!", Saol headline with italic, L) > Saol intro + TG > 3x4 grid (Saol i month, TGc stone, U) with a Fawn inset callout mid-grid > text + image, image left (Saol, TG with code, O) > Fawn founder's note band (TGc eyebrow, Saol i affirmation, TG, sign-off) > footer variant (links incl. "Custom Sessions", star, giant wordmark, unsubscribe line and postal address) | 4 by name (May x2, June, March) + "Template - Monthly Email 1"; "FOUNDER'S NOTE" in 4 frames; seen 1 | 2:7443, 2:7765, 2:7988 |
| E16 | Launch, 1200 | [observed] Wordmark, TGc "INTRODUCING:" and Saol title over a light 3.3 product hero > O with offer > TG > 3x4 grid (Saol i month, TGc stone, TG benefit) > bordered tip callout > grid > O > gift-guide text + image on white (TGc "HOLIDAY 2024", Saol with italic, TG, L; 3.2 gift box) | 10 by name (2025 8, holiday 1, 2026 1); "INTRODUCING:" in 12 frames; gift-guide block in 11; seen 1 | 2:5661, 2:5169, 2:7177 |
| E17 | Custom spotlight (service), 1200 | [observed] Wordmark > Saol headline left with two italic words > inset phone-style photo (about 1:1) > TG > O > Saol headline > numbered TG list (4 steps) > O > press feature (TGc "AS FEATURED IN:", Saol publication headline, TG press quote, U; product image right) > link-row footer | 4 by name; seen 1 | 2:5249, 2:5306, 2:6379 |
| E18 | Plain founder letter, 1200 | [observed] Wordmark (Forest) on white > left-aligned TG letter (about 30 px type) > signature line > PS with a blue hyperlink | 1 | 2:3881 |
| E19 | Welcome 2026, 700 | [observed] Title-case text wordmark > inset 3.2 image > justified TG letter + HA signature > Alabaster block (TGc "LET'S BEGIN", Saol with italic "you", TG, bold code line) > three zig-zag text + image rows (Saol with italic, TG, O) > ruled promo line with arrow > dark full-bleed texture band (Saol i title, TGc eyebrow, TG, F white) | Section holds 6 frames (1 named Email 1; 5 named Editorial, not verified); "LET'S BEGIN" in 10 frames; seen 1 | 2:8838 |
| E20 | Welcome series, 1200 (board) | [observed] Lockup > hero (3.2 with Saol overlay + O) or inset 3.1 image or Fawn hero with right-aligned Saol overlay > Saol headlines with italic words > small TG body > O > text + image rows; email 4 adds a 2x2 grid of grey image placeholders with Saol i captions; email 5 is a chaptered edit on Fawn | 3 on board + WelcomeSeries_2 + Welcome 4 (2025); seen 3 | 2:193003, 2:194315, 2:4733 |
| E21 | Flow: browse abandonment, 1200 | [observed] Wordmark (Forest) on white > inset square 3.2 image (about 800 wide, 200 px margins) > Saol headline > centered TG > O > promo bar (warm grey; TG + Saol i "10% off" + arrow) > Forest social band (follow line + crest) > link-row footer | 3 browse frames; "Did you connect with this" in 4; 10 "Cart/Checkout ... White" frames (2,948 to 3,072 tall) not verified; seen 1 | 2:189609, 2:189710, 2:189807 |
| E22 | Flow: cart and checkout, long, 1200 | [observed] Hero 3.1 (wordmark, TGc "MADE FOR YOU", Saol name with italic, O) > TG founder quote > four-point star > Saol headline with italic > 4 spec rows (image bleeding left, Saol i label + Saol value, small Saol body) > O > warm grey block (TGc eyebrow, Saol name, large 3.3 image, O) | 11 "Abandon Cart" + 5 "Abandon Checkout V2" + 4 other checkout (3,736 to 7,723 tall); "MADE FOR YOU" in 6; seen 1 | 2:190749, 2:191052, 2:191433 |
| E23 | Flow: checkout, short V1, 1200 | [observed, metadata only] Wordmark band (200 tall; wordmark 602 wide) > hero image to y 1,468 with a Saol headline over its foot > TG body (938 wide) > O 469x120 > link-row footer | 6 named V1 (2,808 to 3,007 tall); seen 0 | 2:190629, 2:190669, 2:191540 |
| E24 | Flow: post-purchase, 1200 (board) | [observed] Lockup on Alabaster > Saol greeting or headline with italic word > grey "DYNAMIC BLOCK" placeholder > TG body > O > Saol i line > TG contact line with underlined email | 3 on board; seen 3 | 2:194032 |

| ID | Type pairing | Ground / ink | Devices | Imagery | CTA |
|---|---|---|---|---|---|
| E01 | Saol i hero title (72 px line pitch at 700), Saol names (30) and quotes, TG body (about 35), TGc eyebrows (26), HA subline and notes | White page; Sea Salt bar; cool grey bands (about #D5D7D9 sampled); Alabaster block (Oct); ink Onyx (step 1: Onyx leads 2026) | Rule arrow, 5-star group, underline rules, HA notes over images | Hero: painterly landscape, tree (3.4); cards 3.3 on light warm grey; review hand + bracelet (3.2) | F white 245x67, U (link box 133x23, rule 81), O 345x67, F Onyx |
| E02 | TG justified letter, HA signature, Saol headline and titles, TGc eyebrows | White; dark ink | Underline rules | Inset B&W water (3.4); model with drum (3.1); product on grey (3.3) | U |
| E03 | Saol headlines and quote heads, TG letter and reviews, HA signature | White; dark ink | Hairline rule, star groups, staggered collages | B&W water (3.4); model wearing scallop shells (3.1); pendant on linen (3.2) | O |
| E04 | Saol titles with italic phrases, Saol intro, TGc eyebrows, TG body, HA signature (2:30619) | 700: white with Alabaster or Fawn block; 1200: full Fawn, ink #131313 or Onyx | Hairline rules | Décolletage with a scallop shell, hand on earth (3.1); crystals on linen (3.2) | O |
| E05 | Saol title, Saol i stone names, TGc benefits, TG | White; dark ink | Rule arrow | Bracelet on stone in sun (3.2); grid 3.3 | O white, O, L |
| E06 | TGc eyebrows, Saol (italic at 700) titles, TG body, Saol names | White; Forest band (1200); Alabaster (template 5) | Red strikethrough prices #D54141 (700), hairline rule | Hero 3.1 or 3.2; grid 3.3; pendant on knit (3.2) | O white or F white (hero), O, F Onyx, U, L |
| E07 | TGc, Saol, L, TG, bullets | Alabaster; Forest ink; Forest promo bar | Crest footer, rule arrow | 3.3 product on white; neck close-up (3.1) | L, O |
| E08 | Saol overlay title, Saol, TG, TGc | Alabaster; Forest ink | Crest footer | 3.1 crops alternating with 3.3 | O white, U |
| E09 | TGc, Saol, Saol i titles, TG | White; Forest headline ink | None | Arms and neck with bracelets (3.1); grid 3.3 | O white, U, O |
| E10 | Saol quotes, TG, TGc | Forest with Alabaster ink; Alabaster and Fawn blocks | Star groups, "PRESS LOGO" slot, crest footer | 3.1, 3.2, 3.3 | O (cream on Forest), U |
| E11 | Saol with italics, Saol i numerals, TG | Forest; Alabaster footer | "01 /" chapter marks, crest footer | 3.1 (model, shells), 3.2, collages | O |
| E12 | Saol with italic, TG, Saol names | White; Forest ink | Rule, star footer | B&W motion-blur model (3.1); 3.3 grid; hands in water with crystals (3.4) | U, O |
| E13 | TGc eyebrow + date, Saol, TG long body, Saol pull quote | Alabaster; dark ink | Rule, crest footer | Model in forest (3.1); path (3.4); candles and crystals still life (3.2) | O |
| E14 | Saol title, TG mantra lines | White; Forest ink | Four-point star, star footer | Line illustration on paper (other) | None |
| E15 | TGc, Saol, L, Saol i months, TGc stones, Saol i affirmation | White; Fawn callout and band with Alabaster text | Rule arrow, star, giant wordmark | 12-amulet composite and grid (3.3); hands (3.1) | L, U, O |
| E16 | TGc, Saol, TG, Saol i months, TGc stones | White; Alabaster callout; Onyx ink | Outline callout box, rule arrow | 3.3 hero and grid; gift box with foil wordmark (3.2) | O, L |
| E17 | Saol left-aligned headlines, TG body and numbered list, TGc | White; Forest ink | Star footer | Phone-style photo of hand, bracelets, crystal (other; 3.4 names UGC for social); 3.3 | O, U |
| E18 | TG letter | White; Forest ink; link blue #1028FD | None | None | Inline link |
| E19 | Text wordmark (Saol), TG justified, HA, TGc, Saol with italic | White; Alabaster block; dark texture band | Ruled promo line + arrow | 3.2 inset and crystals; motion-blur model (3.1); roses (3.4); dark water texture | O, F white |
| E20 | Lockup, Saol with italics, small TG, Saol i captions | Alabaster (emails 3, 4); Fawn (email 5) | Rules, grey placeholder boxes | Hanging pendants (3.2); model in doorway, hand (3.1); path, earth (3.4) | O |
| E21 | Saol, TG, TGc label, TG + Saol i promo | White; promo bar #EAE7E5 (sampled); Forest band | Crest, star, rule arrow | Pendant on honeycomb (3.2) | O, P |
| E22 | TGc, Saol with italic, TG quote, Saol i labels, small Saol body | White; warm grey block #EEEAE6 (sampled) | Four-point star | 3.1 hero; crystals on beige (3.2); large pendant on grey (3.3) | O |
| E23 | Saol, TG, TGc, Saol footer links | Not seen | Star, rule | Hero image layer named as a screenshot, over a product image | O |
| E24 | Lockup, Saol with italic, TG, Saol i, TGc | Alabaster | Grey placeholder | None (placeholder) | O |

### 2b. Module library (modular blocks, 1200)

[observed] The section holds 130 module frames at 1200, 3 boards, 9 email-length frames and 12 text labels. Nine labels name the library's own categories: "Text + Image", "Shop Grid", "Image Header with Text Overlay", "Text - Left Aligned", "Text - Center Aligned", "Images Blocks", "CTA", "Promo Bar", "Divider".

Variant axes [observed]:
- Ground: Alabaster #FBF7EF, Fawn #BEADA3, Forest #17280A (sampled; image-block frame names call them Ecru, Brown, Forest).
- Alignment: left or centered. M03 v1 left and v4 centered (screenshots); M04 v1 text at x 80, v4 at x 169 (metadata), although all six M04 frames are named "- Left".
- Image side: M02 v1 image left, v4 image right (metadata).
- Content: M02 v1 to v3 carry a "PRESS LOGO" line (6 text layers); v4 to v6 do not (5).
- Height: M09, M11, M12 and M13 each come in two heights; the shorter M11 and M12 frames crop a taller composition (content sits outside the frame).
- Seen per variant: M03 v1 Alabaster, left, Forest ink; v2 Fawn, left, #131313 ink; v4 Alabaster, centered. Forest variants of the text modules were not screenshotted.
- Hidden group: all 6 text modules read by metadata hold the hidden "Embody the force" image group (F5).

| ID | Module (frames) | Structure and measurements at 1200 | Type, ground, ink, CTA | Count | Examples |
|---|---|---|---|---|---|
| M01 | Text+Image "Featuring" (956) | [observed] TGc eyebrow (42 line box), Saol product name (91 per line), L (arrow 64); image right 622x812 inset 72; text inset 82 | Alabaster, Forest ink; L; 3.3 product on light grey | 5 (4 at 1200; 1 at 700x1144) | 2:193211, 2:194778, 2:29132 |
| M02 | Text+Image Review (956 to 1129) | [observed] Image bleeding to one edge 572x808; stars; Saol quote (curly quotes); TG body; "PRESS LOGO" (v1 to v3); U "SHOP" | v1 Forest with Alabaster ink, image left; v4 image right; 3.1 or 3.2 hands with pendant | 13 (library 6, flows 6, holiday 1) | 2:193247, 2:193304, 2:191672 |
| M03 | Long Header + Body (617) | [observed] Saol headline (77 per line, 862 wide) + TG body (48 per line); padding 80 | v1 Alabaster/Forest/left; v2 Fawn/#131313/left; v4 Alabaster/centered | 6 | 2:193358, 2:193366, 2:193382 |
| M04 | Long Header Sentence (351) | [observed] Saol headline only (862 wide), top 60 | Left (v1) and centered (v4) | 6 | 2:193409, 2:193415 |
| M05 | Short Header + Body (488) | Not seen | | 6 | 2:193421 |
| M06 | Short Header (270) | Not seen | | 6 | 2:193439 |
| M07 | Body - Left aligned (312) | Not seen | | 6 | 2:193451 |
| M08 | Bullet Points (541) | [observed] Saol "Product Details" (86 box) + TG list (lorem); padding 80 | Bullets seen on board template 1 | 3 | 2:193463 |
| M09 | Body - Two Column (350, 562) | [observed] Saol headline left; TG body in a right column from about x 625 | v1 Alabaster, Forest ink | 6 | 2:193487, 2:193511 |
| M10 | Review (553) | [observed] Centered stars, Saol quote, TG body, attribution placeholder "by abcd" | v1 Alabaster, Forest ink | 3 | 2:193520 |
| M11 | The Edit (1154, 762) | [observed] TGc eyebrow; Saol headline with italic second line; TG body 480 wide at x 80; O 333x94; image right 468x618, 90 from the right edge | v1 Fawn, #131313 ink; outline sampled #131313 and #1F2918; 3.1 hand on earth | 7 | 2:193565, 2:193700, 2:194762 |
| M12 | Blog (1355, 174) | [observed] Staggered collage: image bleeding left 622x978, image bleeding right about 465x631; Saol pull quote. The 174 frames show only "The Ritualist" eyebrow and a date | v1 Fawn, Onyx quote; path (3.4), hand with crystals (3.3) | 6 | 2:193601, 2:193664 |
| M13 | Eyebrow + Header (422, 344) | [observed] TGc eyebrow; Saol headline, italic second line; inset 80 | v1 Alabaster, #131313 ink | 6 | 2:193628, 2:193736 |
| M14 | Image blocks | [observed] Big Square 1050x1050 and Portrait 1050x1260 and Landscape 1050x720 (75 px side margins); Small Square 810x810 and Small Portrait 810x1000 (195 px); each in Ecru, Forest, Brown by name. Full Bleed 1200x953 (image 1283 wide, overflowing) and 1200x1416. Two Image Collage: 623x1030 bleeding left + 486x770 bleeding right, 130 px vertical offset | Ground by name; 3.3 product images | 20 | 2:193760, 2:193815, 2:193764 |
| M15 | Text + Image (989) | Not seen | | 10 (library 7, final 1, 2025 2) | 2:193777, 2:1280 |
| M16 | Grids 2x1, 2x2, 2x3, each with or without a Saol header | [observed] Image 450x560 (4:5); Saol name (42 box); U "SHOP" (63x23, rule 63); 107 outer margin, 87 gutter | Alabaster; Onyx header ink; 3.3 alternating with 3.1 | 6 | 2:193873, 2:193908, 2:193955 |
| M17 | Full Image Header, CTA overlay (797, 1200) | [observed] Full-bleed 3.1 image (1:1 on long), centered white Saol title with italic word, O white | White on photo | 4 | 2:194003, 2:193998 |
| M18 | Full Image Header, text overlay (1200) | [observed] 1:1 image; Saol title at the top (x 139, 971 wide) | White on photo | 2 | 2:194008, 2:194011 |
| M19 | Button (174) | [observed] O 333x94 centered; TGc label in a 24 px box; padding 60 by 35 | Square | 3 | 2:193980 |

Promo bars, divider and footers in the library are listed in 2c (P1, P2, D1, F1, F4).

### 2c. Headers, footers, promo bars, dividers and devices

| ID | Pattern | Description | Count | Examples |
|---|---|---|---|---|
| H1 | Wordmark on white | [observed] "HIGH LIGHT RITUALS" one line, caps, vector group (not a component instance in the 3 frames read), centered; Forest or Onyx/black; 372 wide at 700 (53%), 600 to 602 at 1200 (50%); 48 from top at 700, 75 to 88 at 1200 | 8 of 19 emails seen, + 2:1256 by metadata | 2:1478, 2:189609, 2:5249 |
| H2 | Wordmark over hero photo | [observed] Same vector, white (Forest over light photos) | 9 of 19 seen | 2:9, 2:1155, 2:5556 |
| H3 | Lockup "HIGH LIGHT" over "rituals" | [observed] Logotype with lowercase Saol i "rituals" beneath, centered, on Alabaster, Fawn or Forest | 14 (13 on boards + 2:4490) | 2:192035, 2:194032, 2:4490 |
| H4 | Title-case text wordmark | [observed] "High Light Rituals" set as Saol text | 1 seen | 2:8838 |
| (nav) | Navigation row | [observed] None in any email seen; nav-like lines occur once or twice in the corpus | 0 | |
| F1 | Link-row footer, light | [observed] Hairline > three Saol links in a row ("Shop Now", "The Ritualist", "Follow Us"; 46 px boxes at x 54, 479, 961) > four-point star > optional giant full-width wordmark (cropped at the bottom edge in 2:1062); white, Forest ink; 1200x618 or 574. Variants: "Custom Sessions" link (line in 6 frames), unsubscribe and address (2:7443), small emblem instead of star at 700 (2:2153) | 6 of 19 seen + 5 Footer-light frames; "Follow Us" in 86 frames, "The Ritualist" in 82 (both shared with F3) | 2:1062, 2:189609, 2:7443 |
| F2 | Link-row footer, dark | [observed] F1 layout on Onyx with Alabaster links and star | 1 | 2:635 |
| F3 | Template footer | [observed] Alabaster; stacked Saol links "Shop / Follow Us / The Ritualist" left; line-art crest right | 7 (board templates) | 2:192035 |
| F4 | Social band | [observed] Forest 1200x350; TG follow line in white left; white line-art crest right | 2 frames + in 2:189609; follow lines in 12 frames | 2:194481, 2:194661 |
| F5 | Hidden "Embody the force" group | [observed] Not a footer: a hidden group holding a 1200x1120 image and a two-line staggered display title ("Embody the force" at x 118, "of the natural world" at x 229; 102 per line). The step 1 inventory calls it a footer; metadata contradicts that | 131 layers in 112 frames, 0 visible; confirmed hidden in 6 module frames | 2:193212 (in 2:193211), 2:193359, 2:193305 |
| (none) | No footer in frame | [observed] 13 of 19 emails seen, including 8 of the 9 at 700 | 13 | 2:9, 2:31200, 2:8838 |
| P1 | Promo bar | [observed] 1200x172; centered TG line (55 box) with Saol i offer words + 55 px rule arrow; grounds Forest, Fawn, Sea Salt (board), warm grey #EAE7E5 (flows) | 10 frames; "Enjoy 10% off with code WELCOME" in 28 frames | 2:669, 2:194014, 2:189706 |
| P2 | Banner promo | 1200x115; not seen | 3 | 2:5552, 2:2149 |
| P3 | Info bar under hero, 700 | [observed] Sea Salt 700x97, TG line + arrow, inset 40 (layer named Footer_Promo) | 1 seen | 2:92 in 2:9 |
| P4 | Ruled promo line | [observed] Code line between two hairlines, with arrow, on Alabaster, 700 | 1 seen | 2:8838 |
| P5 | Bordered tip callout | [observed] Outline box on Alabaster, TG with an underlined "Healer Tip:" label | "Healer Tip" in 5 frames; 1 seen | 2:5661 |
| D1 | Hairline rule | [observed] Divider module: one line 1040 long, 80 px insets, in a 112 frame; between chapters in edits | 3 frames; seen in 7 emails | 2:194018, 2:1330 |
| D2 | Four-point star | [observed] In F1, F2; as a section mark in 2:190749 and 2:4490 | 6 footers seen + 2 | 2:1062, 2:4490 |
| D3 | Five-star rating | [observed] Vector group (179x33 at 700, 224x41 at 1200) | M02, M10, E01, E03, E10 | 2:193520 |
| D4 | Crest monogram | [observed] Line-art crest with "HIGH LIGHT" and a star | F3 (7), F4 | 2:189609 |
| D5 | HA script | [observed] Signatures, sublines, notes overlapping images | 7 of 19 emails seen | 2:9, 2:1478 |
| D6 | Rule arrow | [observed] Long hairline arrow after L links and promo lines | L, P1, P3, P4 | 2:193211 |
| D7 | Underline rule | [observed] Separate line vector under caps links (63 to 139 px) | Every U link | 2:9 |
| D8 | Numbered chapter mark | [observed] Saol i "01 /" | E11 | 2:192035 |
| D9 | Scallop shell as photo prop | [observed] Real shells in photography, never as a drawn mark | 4 emails or modules seen | 2:194003, 2:1767 |

## 3. Channel requirements observed

- Widths [observed]: 1200 = 278 frame nodes (128 full emails at 1,200 to 1,222, all flows, all 130 library modules); 700 = 76 (73 full emails: 2026 36, final 17, holiday 14, welcome 2026 6); 1222 = 4 (2 full emails in 2025); 1201 = 1; 1100 = 8 and 1071 = 2 (fragments in final and 2025). The 5 frames at 1200 in campaign 2026 copy 2025 templates (2:29604, 2:29719, 2:29788, 2:30714) plus one Editorial Style Edit (2:28114).
- Margins and gutters at native width [observed, metadata unless marked estimate]:
  - 700 (2:9): letter text 61 left, 53 right; cards 283 wide, outer margin 40, gutter 55; info bar inset 40; affirmation text inset 58. 2:1478 inset image and letter about 95 per side (estimate). 2:126 grid about 38 outer, 57 gutter (estimate).
  - 1200, library: text inset 80 (M03, M04, M08, D1); M01 text 82, image 72 from right, top and bottom; M02 v4 text 123 with image bleeding right; M11 text 80, image 90 from right; grids 107 outer, 87 gutter; image blocks 75 or 195 per side.
  - 1200, sends: 2:1256 image and body 130 to 135; 2:190629 body 131; 2:1155 grid about 50 outer, 40 gutter (estimate).
  - Bleeds: heroes full width; M02, M12, the collage and the 2:9 review image bleed to one edge.
- Smallest text [observed]: fine print. 700: 2:9 disclaimer, about 11 px line pitch, so about 8 to 9 px type (estimate from the screenshot; its text box is fixed at 588x202). 1200: 2:7443 unsubscribe and address lines, about 24 px pitch (about 17 to 19 px type, 8 to 9 px if rendered at 600); 2:5556 legal lines, about 29 px pitch. Smallest designed UI text: U link "SHOP" in a 23 px box (700 and 1200); button label 24 px box (1200); eyebrows 26 px box (700), 42 px (1200).
- Line boxes at 1200 [observed, metadata]: eyebrow 42; grid product name 42; footer links 46; body 48 per line; promo line 55; italic link 61; Saol long header 77 per line; M01 product name 91 per line; overlay titles 96 to 102 per line. At 700 (2:9): hero title 72 per line; card names 30; body about 35; eyebrow 26; links 23.
- CTA sizes [observed]: 1200: 333x94 (M19, M11), 469x120 (2:190629), 553x94 (2:1256); 700: 245x67 filled and 345x67 outline (2:9). Stroke 2 px and no corner radius anywhere (step 1 inventory); white outlines on photos not measurable at screenshot scale.
- Section heights [observed]: library frames at 1200: divider 112; banner promo 115; promo bar 172; button 174; short header 270; body left 312; eyebrow + header 344 or 422; two-column 350 or 562; social band 350; long header sentence 351; short header + body 488; bullets 541; review 553; footers 574 or 618; long header + body 617; The Edit 762 or 1154; CTA hero 797 or 1200; landscape 886; full bleed 953 or 1416; text + image 956 or 989; small square 970; small portrait 1160; big square and collage 1176; blog 1355; portrait 1426; grids 868 (2x1) to 2604 (2x3 with header). 700 sections in 2:9 (from its export slices): hero 908; info bar 97; letter 608; card rows 894 and 967; offer and review 808; affirmation 362; fine print 113.
- Full-email heights [observed]: 700 family median 4,682 (1,694 to 8,097). 1200 medians: mantra 2,846; browse 2,764; cart 3,072; checkout 3,836; themed 4,477; sale 4,705; spotlight 5,055; launch 6,264; newsletter 7,076; testimonials 8,135; moodboard 8,171.
- Image aspect ratios [observed, metadata]: 4:5 (grid 450x560; 700 cards 283x353; small portrait 810x1000; 2:1256 935x1169); near 3:4 (M01 622x812; M11 468x618); 0.71 (M02 572x808; 2:9 review 321x453); 1:1 (big and small squares; full-image headers 1200x1200); 5:6 (portrait 1050x1260); about 3:2 (landscape 1050x720); 1.26:1 (full bleed 1200x953 visible); 0.60 and 0.63 (collage pair); 0.64 and 0.74 (blog pair).
- Build [observed]: export slices sit inside sends: 10 in 2:9 (hero 694x908, half-width card cells 348 wide, full-width bands) and 3 in 2:190629; copy and CTAs fall inside the sliced bands. Only 2:7443 carries an unsubscribe line and postal address in frame.

## 4. Book comparison by pattern family

| Family | Verdict | Documented vs observed |
|---|---|---|
| Header and wordmark (H1 to H4) | Drifted | [documented p13, p51] "HIGH LIGHT" logotype centered on white above the hero. [observed] The wordmark reads HIGH LIGHT RITUALS, often over the hero photo; a "rituals" lockup on templates and series; title-case text in welcome 2026. The p15 lockup (logotype, shell mark, tagline) appears in no email. Name question: C1 |
| Hero (send heroes, M17, M18) | On-book structure, drifted detail | [documented p51 to p53] Full-bleed model image with TG caps eyebrow and roman Saol Display title overlaid, centered; CTA below the image on white. [observed] Same overlay, but the CTA sits on the photo (white outline or white filled box), titles mix roman and italic words, HA sublines appear (2:9), and heroes also use 3.2, 3.4 and painterly images |
| Body and letters | On-book, one drift | [documented p16 to p18, p51] TG as secondary body, Saol Standard as principal body, centered short body in the mock. [observed] TG centered and left; Saol body in E22 and edits; justified letters in 2:1478 and 2:8838, which the book does not show |
| Eyebrow + headline lockup (M13, M11, E04) | On-book roles, drifted | [documented p17] TG caps subhead, Saol Display headline, sentence case, left aligned. [observed] Same roles with italic second lines and centered variants |
| CTAs | Split | Link: [documented p17] Saol Standard, sentence case, rule arrow; [observed] L matches. Block: [documented p18, p51] TG caps +200 in a hairline outline with a Fawn label (Fawn #BEADA3 sampled on p51); [observed] 2 px outline with a dark label (#353535, #17280A, #131313, #000000 per the step 1 inventory): stroke weight and label color contradict the book. Filled boxes (white, Onyx) and underlined caps links: off-book |
| Product cards and grids | Off-book layout, mostly on-book roles | [documented p51 to p53] no grid in the email; p16 sets product names in Saol Standard and prices in Saol Standard Medium. [observed] 2 and 3 column grids; Saol names (on-book); TGc benefit eyebrows; prices in TG with a red strike (drifted from p16) |
| Reviews and quotes (M02, M10, E03, E10) | Drifted | [documented p18] pull quote in Saol Display 35/45, left. [observed] Saol quotes centered or left, plus a five-star device, attribution lines and "PRESS LOGO" slots, none in the book |
| Feature text + image (M01) | Drifted | [documented p51] image with a vertical TG caps label ("EMBODY"), a Saol italic caption stack, Saol body and a rule-arrow link. [observed] Eyebrow, Saol name and rule-arrow link beside the image; no vertical label or caption stack in any email seen |
| Chaptered edits (E04, E11, E13) | Off-book layout | [documented] none; built from the p17 lockup. [observed] numbered "01 /" marks (E11) are not in the book |
| Image blocks and collages (M12, M14) | Drifted | [documented p51 to p53] two images side by side, edge to edge, with Saol caption pairs. [observed] Staggered collages bleeding to opposite edges, no captions; single inset images with 75 to 195 px margins |
| Promo bars and offers (P1 to P5) | Off-book | [documented] no offer, code or promo bar in the book (C10) |
| Dividers and devices (D1 to D9) | Off-book, except the rule arrow | [documented p14] marks are scallop-shell based; p17 shows the rule arrow. [observed] Four-point star, crest, five-star rating and script notes; the scallop shell appears only as a photo prop |
| Footers (F1 to F4) | Off-book | [documented p51] Sea Salt #E0E3E5 ground (sampled on p51), shell mark, Saol tagline "Sanctuaries of self and space", a short quote, two links. [observed] White or Onyx link row with star and giant wordmark; Alabaster stacked links with crest; Forest social band with crest; none on Sea Salt; most 700 sends carry no footer in frame |
| Grounds and ink | Split | [documented p19] Onyx and Alabaster primary; Sea Salt, Forest, Fawn secondary; the lighter colors sit behind text. [documented p51] white email ground. [observed] Library and template boards use exactly Alabaster, Fawn and Forest, and set Alabaster text on a full Forest ground (the book names only lighter colors as text grounds). Sends use white (as on p51), Sea Salt bars, and off-palette greys, red and near-blacks (section 5) |
| Faces | On-book core, off-book additions | [documented p16] Saol leads; TG for accents and body, never a large headline. [observed] Saol carries every headline seen; TG never appears as a large headline; HA script in 7 of 19 emails seen; Miriam Libre and Inter per the step 1 inventory |
| Imagery | Mostly on-book | [documented p21 to p24] [observed] Warm natural-light model crops with diverse casting (3.1); product with natural objects such as honeycomb, stones, textiles, shells (3.2); product on plain warm grey (3.3); nature and occult-leaning images (3.4). Off-book: line illustration (E14), phone-style photo (E17), screenshots used as product images (layer names in 2:9, 2:190629), grey placeholders |
| Lifecycle flows (E21 to E24) | Undocumented | [documented p51 to p53] the book shows one marketing email, as a mobile mock with no width (C8), and no lifecycle or transactional email |

## 5. Outliers

One-offs (2 or fewer seen) [observed]:
- E18 plain founder letter with a default-blue link #1028FD (2:3881).
- F2 dark Onyx footer (2:635, the only one).
- H4 title-case text wordmark (2:8838).
- Filled Onyx CTA (2:31200, 2:2153).
- Red strikethrough prices #D54141 (2:2153; the step 1 inventory places the red in holiday).
- Press feature block and numbered steps (2:5249).
- Footer with an unsubscribe line and postal address (2:7443).
- Cool grey bands about #D5D7D9 (2:9, sampled).
- Grey image placeholder grid (welcome series email 4 on 2:193003).
- Two image layers named after fictional TV characters (2:191431, 2:191499, flows).
- Image layers with a non-HLR file prefix "DTS_Caldo_009" (2:193664, 2:193700).

Off-palette fills against p19 [observed]:
- #FFFFFF page ground in every individual send seen (white matches the p51 mock [documented p51] but is not in the p19 palette).
- Warm greys #EAE7E5 (2:189609 promo bar) and #EEEAE6 (2:190749 block), sampled; the step 1 inventory lists #EEEBE3, #ECE8E3, #EAE6E0.
- Cool grey about #D5D7D9 (2:9); placeholder grey #D9D9D9 (2:194032); red #D54141; link blue #1028FD.
- Inks #131313 and #1F2918 (sampled in M03 v2, M11, M13) and #000000 (step 1 inventory).

Off-book faces and possible stand-ins:
- [observed] Homemade Apple script: sublines and image notes (2:9); signatures (2:1330, 2:1478, 2:31200, 2:8838, 2:1767, 2:30619). Not in p16.
- [observed, step 1 inventory] Miriam Libre (353 segments in the module library) and Inter (a few). In my screenshots module headers render as a high-contrast serif consistent with Saol, and labels and body as a grotesque consistent with TG. I could not isolate the layers that carry Miriam Libre or Inter, so whether either is a stand-in is unresolved.

Placeholders [observed]:
- Lorem ipsum: 19 flagged corpus lines across final, modules, 2025, 2026 and holiday; visible in a final 700 send (2:1330, intro and both chapters), on the template board, in welcome series emails 3 and 5, and in M02, M08, M10, M11, M12.
- "PRESS LOGO" (6 frames); attribution "by abcd" (5); "Intro paragraph" and "Ending paragraph" lorem (5 and 2 layers); "Pull quote. Lorem" (9 layers); "xxx" and "xxxxx" fills (6 layers); "TBD TBD" (1 layer); "DYNAMIC BLOCK" boxes (2:194032); grey image boxes (2:193003).
- Unattributed stock review lines in modules and templates: "Timeless design." (11 layers), "Beautifully made." (7).

Duplicates [observed]:
- 27 groups of full emails share name, size and text count (61 frames). Examples: 2:913 = 2:1696 (Inspiration Moodboard, both in final); 2:5661 = 2:2034 = 2:29604 (Birthstone Bracelet Launch in 2025, holiday, 2026); 2:563 = 2:30714 (Product Spotlight, final and 2026); 2:1092 = 2:4855; 2:1155 = 2:4919.
- Final-section fragments repeat 2025 fragments by size and text count: 2:1256 = 2:4781; 2:1280 = 2:4805; 2:1286, 2:1295, 2:1304, 2:1316 = 2:4811, 2:4820, 2:4829, 2:4841; 2:1327 = 2:4852.
- Same size and text count under different names: 2:126 and 2:29383 (Welcome Email 14 and 17); 2:1894 and 2:5410 (Ref: Black Friday 24, Black Friday Launch); 5 cart variants at 1200x2948 with 8 texts.
- The hidden F5 group copied into 112 frames.

Misspellings, naming and build errors [observed]:
- "on it's journey" (2:194032, post-purchase email 3).
- Layer text "OCt 2023" (2:193664), shown in caps by its style.
- A four-item list followed by "both stones" (2 layers); "Your welcome gift is waiting Use code DIVINE10 for 10% off" with no punctuation between sentences (2 layers; may be a two-line layout).
- Dashes: em dashes in 74 unique email lines (131 layers); hyphens and en dashes also stand in for dashes in signatures and asides (C9).
- Frame names that do not match content: "Welcome Email 1" (2:2153) is a Black Friday sale; "Welcome Email 14" (2:126) is an Earth Day new-arrivals send; the frame "Sale" inside 2:1256 is a Libra season set; "Long Header Sentence - Left" v4 to v6 are centered; "Editorial Style Edit" names four structures (E02, E03, E04, 1200 edits); "white header" (2:3881) is a whole letter.
- Orphan text "SAVE WITH CODE LIGHT25" below the bottom edge of 2:9 (y 5,901 in a 5,181 frame); masks holding 2 to 4 stacked images, some named "Screenshot 2024-..." and "Screenshot 2025-..." (2:9, 2:190629).
- Library frames whose content sits outside their bounds (2:193664, 2:193700).
- About 1,100 px of empty ground below the footer of 2:2153 (estimate).

Offers in copy, for the record (C10) [observed]: codes WELCOME 10% (28 frames), LIGHT25 (29), LIGHT30 (6 frames plus 4 sentence lines), DIVINE10, SOLSTICE, TAKECARE (2:7443); prices hard-coded in product cards.

## 6. Cross-channel candidates (by job)

[observed] email patterns whose job another channel likely shares.

| Job | Email patterns | Job likely shared with |
|---|---|---|
| Key visual with overlay title and CTA | E01, E04, E06 heroes; M17, M18 | Social 4:5 and 9:16 posts, paid statics, web hero |
| Product card (4:5 image, Saol name, caps benefit, link) | M16; cards in E01, E05, E06, E09, E15, E16 | Web collection tiles, paid catalog and carousel cards, social carousels |
| Review or testimonial card (stars, Saol quote, short body, attribution) | M02, M10, E03, E10 | Social quote posts, paid review ads, web review blocks |
| Offer or code bar | P1 to P4 | Web announcement bar, paid offer end frames, story stickers |
| Eyebrow + headline lockup | M13, M11 | Every channel (the p17 lockup) |
| Affirmation or mantra block | E01 band, E12, E14, E15 founder note | Social quote and affirmation posts, paid lines such as "Protect your energy" |
| Founder letter with script signature | E01, E02, E18, E19 | Social long captions, web about page |
| Spec rows (crystal, design, metal, activation) | E22 | Web product page detail, paid carousel cards |
| Feature text + image with rule-arrow link | M01 | Web feature rows, social carousel covers |
| Staggered two-image collage with pull quote | M12, M14 collage | Social carousels, web editorial |
| Link-row footer with star; social band with crest | F1, F2, F4 | Web footer, print inserts |
| Press feature block | E17 | Web press strip, paid social proof |
| Numbered steps (how a service works) | E17 | Web service pages, social carousels |
| Bordered tip callout | P5 | Social stories, web product page notes |
| Gift guide text + image | E06, E16 | Web gift guide, social and paid seasonal sets |
| Chaptered edit (eyebrow, headline, text + image) | E04, E11, E13 | Web journal (The Ritualist), social carousels |
