# HLR Pattern Review (Step 1b), second pass

> Second pass, kept as evidence. The canonical Step 1b review is `../pattern-review.md`; this pass ran in a parallel chat on 2026-10-17 and its copy at that path was replaced at 17:03:37. Its deltas are in `../pattern-review-addendum.md`. Section 7 below shows the calls as first put; Eddie's rulings are in `DECISIONS.md` (2026-10-17).


Read-only. 2026-10-17. Closes Gate 1 on Eddie's answers to section 7; feeds Pack v0 and Review 1. Section 4 is a draft for ratification at Gate 2.

Sources: Eddie's copy of the client's Figma work, Highlight-Rituals-Design-Forge `LYyYXPDUHVoAABh865EvMI` (snapshot 2026-10-17; pages Email, Components, Organic Social, Website, Paid Social, Retail/Press, Print, Inspiration, Images), read with get_metadata, get_screenshot and read-only measurement scripts (no writes); the Step 1 extracts (`figma/`, `site/`); the brand book `061022_HighLight_BrandBook_DS.pdf` (2022, cited pN). The evidence behind every row, with node ids, is in this folder: `email.md`, `social.md`, `paid.md`, `web-other.md`, `foundations.md` (measurements), `foundations.json` (raw) and `measure.js` (the read-only script that took them).

Tags: [documented] the book or the client; [observed] the live work; [derived] our proposal, which only Eddie ratifies. Pattern ids point into the inventories: email templates E, email modules M, email headers H, footers F, email promo bars "email P1 to P5", devices D; social S; paid P01 to P17; web W. P10 means 10th percentile. Sizes are px at the native canvas unless stated.

## Findings that change the plan

1. One system already shows under the drift [observed]. The five book colors, Saol over Trade Gothic, square corners, tracked caps eyebrows and a roman headline with an italic emphasis word recur in all four channels. The drift sits in grounds, marks, CTA shape, alignment and accent faces.
2. The book's marks are gone from the live work [observed]. No shell mark, H shell L or p15 lockup appears in any sampled frame. Sign-offs are the HIGH LIGHT RITUALS wordmark, a four-point star, a line-art crest, a stacked monogram and the handle. The shell-with-star mark exists as vectors (Components 2:31994), so the Brand Review's "PNG only" (C3) is wrong for that mark.
3. Live layouts center; the book sets left. Centered text is 61% of visible email text nodes, 63% social, 81% paid; web is 82% left [observed]. The book's lockups are left aligned (p17, p18) [documented].
4. The book's block CTA fails contrast [derived]. Its label and outline, sampled from the book as Fawn #BEADA3 on white (p18, p51), read 2.17:1, and 2.03:1 on Alabaster. Every Fawn ground carrying Alabaster or white text fails the same way (email E15 founder band). Fawn carries dark ink only: Forest 7.21:1, Onyx 5.66:1.
5. Email sends are sliced images [observed]: export slices sit inside the sends and the copy falls inside them. At a 375 px phone, a 1200 master renders its 34 px body at about 10.6 px and a 700 master renders its 25 px body at about 13.4 px [derived]. New evidence for C8.
6. Copy counts overstate what readers saw [observed]. "Embody the force / of the natural world" (131 layers) is a hidden group copied into 112 frames, never a visible footer. Paid lines such as "Protect your energy" (75 frames) and the LIGHT30 offer sit under images in sampled frames. One layer name differs from its rendered copy (2:185800). Pack v0 weighs visible use in voice and claims work.
7. Step 1 inventory corrections [observed]: paid holds 488 more ad frames inside boards (1,059 in all); the Website page has 3 main components (Step 1 said the file has none); paid annotated cards use Forest ink (Step 1 listed Onyx and white). Section 6 has the full list.
8. The Figma connector on this account allows 10 calls a minute and 200 a day [observed]. This review used about 180. Step 4 sessions need a call budget.

## 1. Foundations seen

### 1.1 Color

| Color | Book role [documented p19] | Live roles [observed] |
|---|---|---|
| Onyx #353535 | Primary | Ink of 2026 email (583 segments) and paid (1,590); full ground of the Seeking the Sublime stories (S20, 35 frames); fill of the 2022 logo SVGs. Absent from the site |
| Alabaster #FBF7EF | Primary | Email module library ground (named "Ecru"); paid card grounds (P09, P16); social stone guide (S14); text on Forest in email (E10, E11). The site uses #F7F4EE instead |
| Forest #17280A | Secondary | The widest live ink: site (1,970 text uses), email 2025 and flows (983 segments), social light grounds, paid annotated cards (P01, P09, P16). Deep ground in email (E10, E11, social band F4, promo bars) |
| Sea Salt #E0E3E5 | Secondary | Email info and promo bars; paid landscape panels (P06, P14); one social text tile (S06a). The book's email footer ground (p51) |
| Fawn #BEADA3 | Secondary | Email library ground (named "Brown") and callouts (E15); web rules, accents and the announcement bar (#BEADA2); badges |
| Gilt | Printed foil only | Not seen in digital work |

Off-book values [observed]:
- Light grounds: white #FFFFFF (every individual email send seen, retail pages, zodiac story panels); #F7F4EE and #F6F4EE (site and redesign); a cream paper texture placed as a stock photo layer (sampled #F0E7D3 to #F2EBDA; social mantra, editorial, founder and offer frames); blush #F0DFCF (Step 1 counted 403 fills in the social grid, yet none of 11 sampled grid frames shows it as a visible ground: unverified); blush #F1D6D6 (Step 1 paid; not seen in 24 paid samples); warm greys #EEEBE3, #ECE8E3, #EAE6E0, #EAE7E5, #EEEAE6; cool grey #D5D7D9; web panels #F2EDE7, #F0ECE6.
- Darks: #231F20 (2024 logo SVGs, paid wordmark, badges, monogram), #000000 (outlines, site component text, menu heads), #131313 and #1F2918 (email inks and outlines), #1B280E (highlight cover grounds), #2D1E15 (one story set ground).
- Accents: red #D54141 (strike prices), rust #812800, pale blue #E3F1FA, link blue #1028FD, #C9C5BD, and 12 birthstone mat colors (P07).

Contrast of live pairs [derived, WCAG 2 ratio from the hex values]:
- Body-safe, 4.5:1 and up: Forest on Alabaster 14.62, on white 15.62, on #F7F4EE 14.23, on Sea Salt 12.12, on the paper texture (#F1E8D5) 12.83, on blush #F0DFCF 12.02, on Fawn 7.21. Onyx on Alabaster 11.48, on Sea Salt 9.51, on Fawn 5.66. Alabaster on Forest 14.62 and on Onyx 11.48.
- Failing even for display, under 3:1: Alabaster on Fawn 2.03, white on Fawn 2.17, Fawn on Alabaster 2.03, Fawn on Sea Salt 1.68 (S06a).
- At the floor: red #D54141 on white 4.50.

### 1.2 Type

Book roles [documented p16 to p18]:

| Role | Face and setting |
|---|---|
| Headline one, headline two | Saol Display Light; Saol Display Regular. Sentence case or caps |
| Typeset headline | Saol Display 80/80, 0 tracking, sentence case, left |
| Product names and pull quotes | Saol Standard Regular; pull quote in Saol Display 35/45, left |
| Principal body | Saol Standard (Medium on the type sheet); 14/23 in the lockup, left |
| Numerals and prices | Saol Standard Medium |
| Inline titles, small headlines | Trade Gothic Bold, caps |
| Subhead (eyebrow) | Trade Gothic 10/17, +200, caps, left |
| Secondary and detail body | Trade Gothic Regular; 15/22 |
| Link CTA | Saol Standard 16/23, sentence case, rule arrow |
| Block CTA | Trade Gothic 10/17, +200, caps, hairline outline; right aligned in the sample |
| Rule | Trade Gothic never sets a large headline or leads over Saol |

Live [observed; measurement pass unless an inventory is named]:
- Family share of text segments. Email: Trade Gothic 51%, Saol Display 38%, Miriam Libre 6%, Saol Standard 5%. Social: Saol Display 50%, Trade Gothic 37%, Saol Standard 7%, Homemade Apple 2%, Inter 2%, Instrument Serif 1%. Paid: Saol Display 47%, Trade Gothic 43%, Saol Standard 5%, Futura PT 4%, Avenir LT Std 1%. Web: Trade Gothic 84%, Saol Display 15%.
- Saol Display sets every headline seen in every channel, and Trade Gothic sets no large headline in email (inventories). The book's principal body face, Saol Standard, has given way to Trade Gothic body in every channel.
- A roman Saol headline with an italic word or line is the cross-channel signature: email Saol Display Regular Italic (113 segments at 42, 56 at 110), paid italic at 90 (129), social italic emphasis throughout, web Saol Display Thin Italic at 22 (56). The book shows no italic (p16). The client's font folder holds Light Italic and Regular Italic, not Thin Italic.
- Eyebrows keep the book's setting: Trade Gothic caps at 20% tracking (the book's +200) in every channel, 10% to 25% at the edges.
- Caps share of segments: email 32%, social 30%, paid 40%, web 35%.
- Script and accents: Homemade Apple in 7 of 19 emails seen (signatures, sublines, notes over images) and 110 social segments (Field Notes materials, carousel covers); Instrument Serif on social series covers (41). Both licenses are cleared (Step 1). Miriam Libre runs through the email module library (287 segments, 34.5 to 140) and renders close to Saol at screenshot scale.

Sizes in use [observed]:

| | Email | Organic social | Paid | Web |
|---|---|---|---|---|
| Saol Display, five most used sizes | 46, 55, 96, 42, 110 | 60, 50, 24, 90, 100 | 80, 60, 90, 75, 70 | 22, 30, 40, 48, 20 |
| Trade Gothic caps, most used styles | Bold 26 at 25% (249); Regular 19.5 at 20% (248) | Regular 18 at 20% (164); Bold 20 at 20% (131) | Bold 36 at 20% (103); Bold 30 at 30% (72) | Bold 11 at 10% (220) and at 20% (65) |
| Body-length text (60+ characters), most used | 700: 25, 26, 24. 1200: 34, 39, 38 | 4:5: 24, 50, 32. 9:16: 60, 24, 30 | 9:16: 40, 45, 34. 1:1: 38, 40, 35 | 13, 11. Live body 13/22 |
| Smallest / P10 / median | 700: 13 / 18.5 / 25. 1200: 18.5 / 26 / 39 | 4:5: 15 / 18 / 32. 9:16: 15 / 20 / 42 | 4:5: 10 / 10 / 32. 9:16: 12 / 12 / 36. 1:1: 18 / 26 / 40 | 1440: 8 / 11 / 13. 375: 6 / 11 / 13. Live eyebrow 11 |

Rendered size at a 375 px phone [derived; assumes the canvas, or the sliced email, fills the phone width; factor 0.536 for 700, 0.3125 for 1200, 0.347 for 1080]: email body 25 at 700 renders 13.4 and 34 at 1200 renders 10.6; social 4:5 body 24 renders 8.3 and the 15 px handle 5.2; the smallest paid 4:5 text (10) renders 3.5.

### 1.3 Spacing, grids, radius, strokes

- Base: multiples of 5 dominate every channel (10, 15, 20, 25, 40, 50, 60, 80) [observed].
- Email 1200 [observed]: text inset 80 (library); image blocks inset 75 or 195 per side; grids 107 outer and 87 gutter with 4:5 tiles at 450x560; block CTA 333x94; divider 1040 long at 80 insets; auto-layout gaps 10, 15, 20 and paddings 40, 50, 60. Values 48.06, 72.09, 19.33, 12.02 and 10.96 are 1.2x scaling artifacts from resized modules.
- Email 700 [observed]: side margins 40 to 61 (letters 53 to 61); cards 283 wide with a 55 gutter.
- Social 1080 [observed]: text ink P10 56 to 60 from the sides on 4:5 and 92 to 95 on 9:16 (medians 140 to 186); stories keep text P10 170 to 192 from the top and 122 to 165 from the bottom (medians about 280 and 295); the handle sits 28 to 205 above the bottom; carousel strips use 40 to 50 gutters or run seamless.
- Paid 1080 [observed]: side medians 132 to 134; on 9:16 no measured live text starts above y 253, top clear median 564, bottom clear median 699; text boxes cover a median 9% (9:16) to 13% (1:1) of the canvas.
- Web [observed]: desktop header inset 30; product page content span 1039 (thumbs 53, image 547, buy box 512); card rail 404 with 72 gutters; menu tiles 213 with 20 gutters. Mobile margin 20 (content 335), tiles 160 with a 15 gutter, controls 45 tall. Auto-layout gaps 25, 15, 16, 20.
- Radius [observed]: 0 on 3,232 email nodes, 3,951 social, 4,195 paid and 460 web. Exceptions: 14 social (pills and circles), 38 paid (30 and 60, the message sticker), 9 web (5 px tab tops). The book's block CTA is square (p18) [documented].
- Strokes [observed]: 2 px strokes (425), the weight of the CTA outlines at 1200 (1 px at 1x), in dark inks; rules 1 to 1.08 px; web lines 1 px in Forest and Fawn. The book's block CTA outline is a hairline (p18) [documented].

### 1.4 Devices

| Device | Book [documented] | Live [observed] |
|---|---|---|
| Logotype | "HIGH LIGHT" in three cuts by size (p13) | "HIGH LIGHT RITUALS" wordmark in every channel (vector in email; LOGO frames 225 to 875 wide in paid; 16-letter builds on Retail/Press). The web redesign nav reads "HIGH LIGHT RITUAL" (34 instances of Component 111). One email sets the name as title-case text (H4) |
| Shell mark, H shell L, lockup | Shell alone, horizontal and vertical H shell L, lockup with "SANCTUARIES OF SELF AND SPACE" (p14, p15); H shell L tops every book ad (p48 to p50) | In no sampled frame. Shells appear as photo props (email), an icon (trust set) and offer badge shapes. Shell-with-star line mark as vectors on Components (2:31994) |
| Lockup with "rituals" | None | "HIGH LIGHT" over lowercase Saol italic "rituals" on email templates and series (H3, 14) |
| Crest, monogram | None | Line-art crest with HIGH LIGHT and a star (email footers F3, F4); stacked HLR monogram with a star (retail, #231F20) |
| Four-point star | None | Email footers and section marks; social sign-off (vector 37x48, raster TIF 39x50); a star-over-serif lockup in one paid family (2:37392) |
| Handle sign-off | None | "@HIGHLIGHTRITUALS" in Trade Gothic caps on 296 social frames; misspelled in 51 layers across 40 frames |
| Rule arrow | Link CTA (p17) | Email links and promo lines; social carousel swipe cue (S12) |
| Block outline | Hairline, Fawn label (p18, p51) | 2 px square outlines with dark labels (email); filled Forest and outline buttons (web); a filled white box (one paid family) |
| Annotation | Hairline leaders ending in a dot, small sentence-case labels, "annotations fade in" (p48 to p50) | Leaders without dots, caps labels (paid P01, P02; social S19); numbered circles with leaders (S03); one callout added per frame as a reveal sequence (P01) |
| Vertical caps label | "EMBODY" beside an image (p51) | Not seen |
| Keyline frame | None | Inset keyline in paid cards (P01) and retail display cards |
| Five-star rating | None | Email reviews (M02, M10, E03, E10); web reviews |
| Script notes and signatures | None | Email letters and notes; social materials and covers |
| Paper texture | None | A stock photo layer as the ground of many social frames |
| Trust icons | None | Draft line icons on Components (infinity, 8-point star, concentric circles, ribbed shell); the concentric-circle icon on the web ceremony line |
| Emoji | Nature and celestial emoji, black and white symbols (p35) | Social captions only; one paid customer quote |

### 1.5 Imagery

| Book card | Live families [observed] | Fit |
|---|---|---|
| 3.1 Model campaign (p21) | HLR Editorial (18 photos, 15 on this card), email and web heroes, paid on-body (P02), social launch stories, founder carousel | On-card: warm natural light, intimate, B&W allowed |
| 3.2 Product campaign (p22) | Inspiration stills (crystals, egg, eucalyptus, flower: 36), stones in water, honeycomb, linen, gift boxes | On-card |
| 3.3 Product ecommerce (p23) | Images OPTION sets (33 frames), zodiac composites (12), email grids, web gallery, paid P01, P06, P07 | On-card; cut-out composites drift from natural light |
| 3.4 Social media (p24) | Stock nature (36 on Inspiration), occult-leaning series covers, UGC | On-card in mood; stock licenses unknown |
| Off-card | Line illustration (E14), phone snapshots (E17, S03), screenshots placed as photos (144 web fills; email, social and paid layers), archival engraving, B&W documentary (S29), stock template photos (S18), grey placeholders | Off-card |
| Founder photography | 12 headshots; used on web, retail, social and email | Not a book card |

Rights: none confirmed for any family (Brand Review Q6).

## 2. Pattern roster

### 2.1 Volume [observed]

- Email: 527 rows; 201 full emails (73 at 700, 128 at 1200); 130 library modules in 19 types; 24 template patterns.
- Organic social: 1,054 frames among 1,288 top-level nodes (386 at 4:5, 527 at 9:16, 27 at 1:1, 17 strips holding about 120 panels, 6 highlight cover grounds); 30 patterns.
- Paid: 571 top-level frames plus 488 inside boards (9:16 424, 1:1 358, 4:5 family 144, landscape and square placements 64, display 20); 17 patterns.
- Web: 56 frames (1440 and 375); 23 patterns. Other pages: Components (8 type specimens, 4 icon sets, draft marks and 9 offer badges), Retail/Press (90 pages at 1800x1200 in six decks and one loose page, 12 display cards at 750x1050), Print (4 posters), Inspiration (121 images), Images (12 founder, 18 editorial, 33 product frames, 12 zodiac composites, 4 boards).

### 2.2 Cross-channel equivalents (by job) [observed]

| Job | Email | Organic social | Paid | Web | Book |
|---|---|---|---|---|---|
| Key visual: photo, overlay title, CTA | E01, E04, E06 heroes; M17, M18 (2:194003) | S01 series cover, S02 statement, S10 event, S23 launch story (2:181028) | P03 brand-line hero, P15 display (2:50856) | W05 split hero (2:184444) | p46, p51 to p53 |
| Annotated product: name, callouts, materials | E07 spotlight, E22 spec rows, M01 feature (2:193211) | S19 annotated story, S03 Field Notes, S04 crystal guide (2:180196) | P01 reveal sequence, P02 on-body, P16 inset (2:42545) | W07 gallery, W09 buy box, W14 story tabs (2:185628) | p48 to p50 |
| Product card and grid | M16 grids; E05, E08, E09, E15, E16 (2:193873) | S14 stone guide list (2:93075) | P04, P06, P07 grid, P09 carousel cards (2:46238) | W19 card rail, W03 promo tiles | p46, p47 |
| Stone and intention meanings | E05 benefit grid, E15 and E16 month grids, email P5 tip callout (2:5661) | S04, S14, S22 zodiac (2:61020) | P08 intention list, P09 (2:54485) | W14 figure notes, W12 ceremony line, filters by meaning | None |
| Mantra, affirmation, quote | E14 mantra, E01 affirmation band, E15 founder note (2:4490) | S05 mantra, S06 text tile, S08 symbol entry, S20 quote story (2:65020) | P17 affirmation cards (2:40303) | W17 testimonial styling | p35 High Spirits; p18 pull quote |
| Review and testimonial | M02, M10, E03, E10 (2:193520) | S13 UGC; S17 (1 frame) | P10 message sticker (2:48750) | W17, W18 | p24 UGC |
| Offer and promo | Email P1 to P4 bars, E06 sale (2:669) | S11 feed and story (2:61341) | P05 offer and event, P14 (2:53206) | W01 announcement bar; draft offer badges | None (C10) |
| Founder and letter | E02, E18, E19, E01 letter (2:1478) | S28 founder carousel, S24 welcome letter (2:180722) | None | W15 ritual block, W16 brand promise | None |
| Chaptered editorial | E04, E11, E13 The Ritualist (2:1330) | S07, S09 long-copy slides, S12 carousel cover (2:180327) | None | Not designed | p17 lockup |
| Press proof | E17 press block (2:5249) | S16 "as seen in" (28 frames, unsampled) | P11 (2:37594) | W20 press strip | None |
| Launch | E16 (2:5661) | S23 (2:178559) | P03 | W05 | None |
| Sign-off and footer | F1 to F4 (2:1062) | Handle and star | P12 wordmark end frame | W21 footer | p51 footer: Sea Salt, shell, tagline |
| Motion | None | Reels (photo-only covers) | P12 storyboards, P01 reveal sequences | W08 video modal | p48 to p50 motion notes |
| Giving and impact | Not seen | S29 giving carousel (2:64675) | None | Impact tiles, 1% icon | None |
| Event | Not itemized | S10 (2:181483) | P05 | None | None |

### 2.3 Email [observed]

Templates (count; example nodes):

| Id | Pattern | Count | Examples |
|---|---|---|---|
| E01 | Monthly letter edit, 700 | 6 by anchor line | 2:9, 2:31200 |
| E02 | Short letter edit, 700 | 11 | 2:1478 |
| E03 | Testimonial edit, 700 | 3 | 2:1767 |
| E04 | Chaptered theme edit, 700 and 1200 | 5 at 700, 2 on boards | 2:1330, 2:30619 |
| E05 | Product-grid announcement, 700 | 2 | 2:126 |
| E06 | Sale or offer | 9 at 1200 by name; LIGHT25 in 29 frames | 2:5556, 2:2153 |
| E07 | Product spotlight, 1200 | 12 | 2:563, 2:4432 |
| E08 | Product listing in grids, 1200 | 2 | 2:683 |
| E09 | Curated picks, 1200 | 2 | 2:1155 |
| E10 | Testimonials on Forest, 1200 | 2 | 2:809 |
| E11 | Inspiration moodboard, 1200 | 2 | 2:913 |
| E12 | Themed product edit, 1200 | 2 (13 more names unverified) | 2:1092 |
| E13 | The Ritualist journal, 1200 | Board template | 2:192035 |
| E14 | Monthly mantra, 1200 | 3 | 2:4490 |
| E15 | Monthly newsletter, 1200 | 4 | 2:7443 |
| E16 | Launch, 1200 | 10 | 2:5661 |
| E17 | Custom service spotlight, 1200 | 4 | 2:5249 |
| E18 | Plain founder letter, 1200 | 1 | 2:3881 |
| E19 | Welcome 2026, 700 | 6 in section | 2:8838 |
| E20 | Welcome series, 1200 | 3 on board, 2 more | 2:193003 |
| E21 | Browse abandonment flow | 3 (10 more unverified) | 2:189609 |
| E22 | Cart and checkout flow, long | 20 | 2:190749 |
| E23 | Checkout flow, short | 6 | 2:190629 |
| E24 | Post-purchase flow | 3 on board | 2:194032 |

Module library at 1200, variant axes: ground (Alabaster, Fawn, Forest), alignment (left, centered), image side, with or without a press line. M01 Featuring text and image (5; 2:193211). M02 Text and image review (13; 2:193247). M03 Long header and body (6; 2:193358). M04 Long header sentence (6; 2:193409). M05 Short header and body (6; 2:193421). M06 Short header (6; 2:193439). M07 Body left (6; 2:193451). M08 Bullet points (3; 2:193463). M09 Body two column (6; 2:193487). M10 Review (3; 2:193520). M11 The Edit (7; 2:193565). M12 Blog collage (6; 2:193601). M13 Eyebrow and header (6; 2:193628). M14 Image blocks (20; 2:193760). M15 Text and image (10; 2:193777). M16 Grids 2x1, 2x2, 2x3 (6; 2:193873). M17 Full image header with CTA (4; 2:194003). M18 Full image header with text (2; 2:194008). M19 Button (3; 2:193980).

Headers, footers, bars: H1 wordmark on white and H2 wordmark over the hero (2:1478, 2:9); H3 "HIGH LIGHT / rituals" lockup (14; 2:192035); H4 text wordmark (1; 2:8838). F1 link-row footer, light (6 seen and 5 frames; 2:1062); F2 dark (1; 2:635); F3 template footer with crest (7; 2:192035); F4 Forest social band (2; 2:194481); F5 the hidden "Embody the force" group (112 frames, 0 visible; 2:193212). Email P1 promo bar (10; 2:669), P2 banner (3; 2:5552), P3 info bar (1; 2:92), P4 ruled promo line (1; 2:8838), P5 tip callout (5 by line; 2:5661). No navigation row in any email; 13 of 19 sends seen carry no footer in frame.

### 2.4 Organic social [observed]

| Id | Pattern | Count | Examples |
|---|---|---|---|
| S01 | Series cover over photo (Energy Medicine, Words For Your Journey, proof of magic) | About 21 by name | 2:181056, 2:181028 |
| S02 | Statement over photo | 7 | 2:182952 |
| S03 | Field Notes annotated object | 42 | 2:180130 |
| S04 | Crystal guide | About 17 | 2:181360 |
| S05 | Mantra tile (star, two lines, handle) | 26 | 2:65020 |
| S06 | Flat-ground text tile, 3 variants | About 9 | 2:181328, 2:180792 |
| S07 | Editorial headline with inset image | 8 | 2:180327 |
| S08 | Symbol entry ("The Egg") | 26 | 2:65199 |
| S09 | Long-copy slide | 7 | 2:180943 |
| S10 | Event announcement | 1 (2 more unverified) | 2:181483 |
| S11 | Offer, feed and story | 1 and 8 | 2:181188, 2:61341 |
| S12 | Seamless carousel cover with swipe cue | 4 to 5 | 2:181650 |
| S13 | Photo-only post (UGC, reel, launch, collab) | 59 grid frames carry no live text | 2:181205 |
| S14 | Stone guide list | 8 | 2:93075 |
| S15 | Product feature (unsampled) | About 7 | 2:180857 |
| S16 | Press mention (unsampled) | 28, plus 26 press-kit frames | 2:71955 |
| S17 | Testimonial (unsampled) | 1 | |
| S18 | Imported template images | 2 | 2:181015 |
| S19 | Annotated product story | 49 | 2:180196 |
| S20 | Quote story on Onyx (Seeking the Sublime) | 35 | 2:62290 |
| S21 | Inset-photo story on dark brown | 34 | 2:182904 |
| S22 | Split photo and panel story (zodiac) | 100 | 2:61020 |
| S23 | Launch story | 54 | 2:178559 |
| S24 | Highlight story sets | 61 | 2:60823 |
| S25 | Other story sets (unsampled) | About 156 | 2:81815 |
| S26 | Highlight cover grounds | 6 | 2:33106 |
| S27 | Reel covers (4:5 grid crops) | 5 | 2:181193 |
| S28 | Founder quote carousel strip | 3 | 2:180722 |
| S29 | Giving carousel, seamless | 2 | 2:64675 |
| S30 | Other strips | 12 | 2:62473 |

Series [observed against documented p35]: the book's franchises have drifted. High Spirits runs unnamed as the mantra tile (S05, 26) with one "high spirits" card (2:180792). Sublime Intervention runs as "Seeking the Sublime" (S20, 35 frames) with a different job: a quote story, not a weekly list. Sanctuaries survives only as name echoes. Live series the book does not name: Field Notes, Rituals of Winter, Words For Your Journey, Energy Medicine (monthly), proof of magic, Crystal Allies, zodiac seasons, Awakening Adornments, Goddess Focus, Rosette Focus, What's a Witch?, Rituals of Adornment. No franchise hashtag appears in any layer.

### 2.5 Paid [observed]

| Id | Pattern | Count | Examples | Formats |
|---|---|---|---|---|
| P01 | Annotated product card, light ground, one callout per frame | 136 | 2:42545 | 1:1, 9:16 |
| P02 | Annotated on-body photo | 38 | 2:37799, 2:52036 | 9:16, 1:1, 4:5, 2:3 |
| P03 | Brand-line hero (tagline and wordmark) | About 74 | 2:50856 | 4:5, 1:1, 9:16, display |
| P04 | Headline, name and benefit static | About 40 | 2:56524 | 4:5, 1:1, 9:16 |
| P05 | Offer and event | 20 or more | 2:53206 | 4:5, 1:1, 9:16 |
| P06 | Birthstone amulet card | 12 | 2:57300 | 1:1, 1.91:1 |
| P07 | Birthstone collection grid | 1, 3 boards, 12 explorations | 2:57657 | 9:16 |
| P08 | Intention list | 10 to 13 | 2:54485 | 1:1, 9:16, 4:5 |
| P09 | Stone and material carousel cards | 72 | 2:46238 | 1:1, 4:5, 9:16 |
| P10 | Customer quote as a message sticker | 19 | 2:48750 | 9:16, 1:1 |
| P11 | Press | 21 or more | 2:37594 | 9:16, 1:1, 4:5, display |
| P12 | Video storyboards | 132 | 2:49815 | 9:16, 1:1 |
| P13 | Image-only creative | Not determinable | 2:56959 | All |
| P14 | Landscape and square placements | 64 | 2:37135, 2:56900 | 1.91:1, 1200x1200, 16:9 |
| P15 | Display banners | 20 | 2:36253 | 728x90, 600x160, 500x300, 180x150 |
| P16 | Spell bracelet inset with side lines | 28 | 2:42316 | 4:5, 1:1, 9:16 |
| P17 | Affirmation text cards | 5 | 2:40303 | 9:16 |

### 2.6 Web [observed]

| Id | Pattern | Count | Examples |
|---|---|---|---|
| W01 | Announcement bar | 34 desktop, 13 mobile | 2:185628 |
| W02 | Desktop header | 34 | 2:184444 |
| W03 | Mega menu | 4 | 2:184523 |
| W04 | Mobile header and drawer | 7 drawers; header in 11 | 2:184678 |
| W05 | Desktop split hero | 24, plus 2 component frames | 2:184444, 2:185212 |
| W06 | Mobile hero | 2 | 2:184427 |
| W07 | Product gallery | 10 | 2:185628 |
| W08 | Video modal | 1 | 2:184322 |
| W09 | Buy box | 10 | 2:185628, 2:185489 |
| W10 | Info popovers | 2 sets | 2:184420 |
| W11 | Session add-on card | 7 frames, 3 instances | 2:185628 |
| W12 | Ceremony line | 17 | 2:185628 |
| W13 | Trust marquee | 8 | 2:185628 |
| W14 | Story tabs and accordion | 14 | 2:184078 |
| W15 | Ritual and process block | 3 | 2:185628 |
| W16 | Brand promise block (mobile menu) | 7 | 2:184678 |
| W17 | Testimonial | 7 | 2:185628 |
| W18 | Reviews (pasted image) | 7 | 2:185628 |
| W19 | Product card rail | 7 | 2:185628 |
| W20 | Press strip | 6 | 2:185628 |
| W21 | Footer with disclaimer | 6 | 2:185628 |
| W22 | Filters drawer | 2 | 2:185324 |
| W23 | Impact and FAQ, tiles only | 5 | 2:184678 |

## 3. Channel requirements

| Channel | Canvases [observed] | Margins and safe zones [observed] | Build [observed] |
|---|---|---|---|
| Email | 1200 (library, flows, 2025; 128 emails; 2x of 600) and 700 (2026 sends and welcome; 73 emails). C8 open | 1200: text inset 80, grids 107 and 87, image blocks 75 or 195 per side. 700: 40 to 61 | Sliced images with copy inside the slices; no navigation; 13 of 19 sends seen carry no footer in frame; one carries unsubscribe and address lines |
| Organic social | 4:5 at 1080x1350 is the master (386; 112 of 117 grid frames); 9:16 at 1080x1920 (527); 1:1 (27, older); strips of 2 to 11 panels (17); highlight cover grounds at 1507x1468 (6) | Text P10 56 to 60 from the sides (4:5) and 92 to 95 (9:16); stories P10 170 to 192 from the top and 122 to 165 from the bottom; handle 28 to 205 above the bottom | Captions written as text layers beside the posts; reel covers are 4:5 grid crops; series run as sets of up to 100 frames |
| Paid | 9:16 (424), 1:1 (358), 4:5 (144, including 1080x1351 and 1080x1352), 1.91:1 (26), 1200x1200 (21), 16:9 (17, image only), 2:3 (5), display 728x90, 600x160, 500x300, 180x150 (5 each), 500x500 (12) | 9:16: no live text above y 253, top clear median 564, bottom clear median 699, 17 of 159 frames end within 340 of the bottom; sides 132 to 134 | Concepts ship as size families; annotation reveals as frame sequences; video as timecoded storyboards; 4:5 built by nesting a clipped 9:16 |
| Web | 1440 desktop and 375 mobile frames; live breakpoints 576, 768, 992, 1200, 1024, 1280 | Desktop header inset 30, product span 1039; mobile margin 20, controls 45 tall | Shopify theme live; Figma redesign with 3 components; 144 image fills are screenshots |

Proposed floors and thresholds [derived; ratified at Gate 2 with the contrast law; reference phone width 375]:

| Rule | Email 700 | Email 1200 | 1080 canvases | Web (CSS px) |
|---|---|---|---|---|
| No text under 12 px rendered | 22 | 38 | 35 | 12 (live eyebrow 11 sits under it) |
| Body at 14 px rendered | 26 | 45 | 40 | 14 (live body 13 sits under it) |
| Large text for 3:1 (24 px regular or 18.66 px bold rendered) | 45 or 35 bold | 77 or 60 bold | 69 or 54 bold | 24 or 19 bold |

- Social body (24) and 1200 email body (34) sit well under the body line; paid body-length text sits at or just under it (38 to 40); 700 email body (25, about 13.4 rendered) sits just under it. P10 text sits under the floor on every canvas, web included (11).
- 9:16 safe zones get set from the current platform overlay specs at Gate 4 (owner Eddie); live practice keeps text at least 253 from the top (paid boards) and P10 122 from the bottom (social).

## 4. Proposed system skeleton [derived; draft for ratification at Gate 2]

One system with channel modes: the same tokens, elements and modules, flexed by a channel's canvas, size mode and ground modes.

### 4.1 Tokens

- Primitives: the five book colors [documented]; Gilt stays print only, with no digital token. A neutral ramp from Alabaster to Onyx [derived] absorbs #F7F4EE, the warm greys and the near-blacks (#231F20, #131313, #000000) at their nearest steps. White, blush #F0DFCF, blush #F1D6D6 and the paper texture wait outside the ramp for C4. Families: Saol Display, Saol Standard, Trade Gothic [documented]; Homemade Apple and Instrument Serif held as accents pending C5 [observed].
- Semantic roles: ink (primary, secondary, inverse, on-image), ground (page, raised, tint, deep, image), rule, action (block CTA fill, label, stroke; text link), rating. Ground modes: light (Alabaster or white; Forest or Onyx ink per C4), tint (Sea Salt; Fawn as a dark-ink ground only), deep (Forest or Onyx; Alabaster ink), image (photo; white or Alabaster ink under a scrim rule).
- Component: block CTA (shape per C6, label, 1 px stroke at 1x, radius 0, padding), text link (Saol with rule arrow, p17), card (4:5 image, name, meta, link), promo bar, rule, callout (leader weight, end dot per p48 or none), rating.
- Layout: spacing on a 5 base (5, 10, 15, 20, 30, 40, 60, 80, 120); radius 0; stroke 1 at 1x; a type ramp by role (display, headline, title, pull quote, body, detail, eyebrow, label, legal) with a size mode per channel (email 1x, 1080 canvas, web); canvas, safe-zone and floor tokens per format; grid tokens (email inset 80 at 1200, 40 at 1x; web span and mobile margin 20).
- Type behaviors: italic emphasis inside a roman Saol headline becomes a documented behavior (it is the live signature in every channel); eyebrow tracking 20%; alignment: centered for display lockups and statements of one or two lines on fixed canvases, left for reading text over three lines, letters, lists and all web reading text.

### 4.2 Elements

Wordmark and lockups (per C1, C3); mark set (shell, shell with star, four-point star, crest, monogram; per C3); eyebrow; headline with emphasis; body; pull quote; block CTA and text link (per C6); rule and rule arrow; rating stars; callout (leader and label); numbered marker; handle sign-off; price and offer-code line (per C10); image frame (full bleed, inset, keyline inset); script signature (per C5); trust icon set (drafts on Components); offer badge (per C10).

### 4.3 Modules and recipes

Email modules (130 library frames in 19 types become 16 modules with variants by mode and slot):

| Module | Absorbs |
|---|---|
| Header | H1 to H3 |
| Hero (overlay title and CTA; model or product image) | M17, M18, send heroes |
| Text lockup (eyebrow, headline, body, CTA; alignment by rule) | M03 to M07, M13 |
| Text and image (image left or right) | M01, M11, M15 |
| Review card (stars, quote, body, attribution, optional image) | M02, M10 |
| Product grid (2x1, 2x2, 2x3; optional header) | M16 |
| Image block (full bleed, inset, collage) | M12, M14 |
| Two-column body | M09 |
| List (bullets or numbered steps) | M08, E17 steps |
| Spec rows (label and value) | E22 |
| Letter (body and script signature) | E02, E18, E19 |
| Promo bar | Email P1 to P4 |
| Callout | Email P5 |
| Press block | E17 |
| Divider | D1 |
| Footer (one, by ground mode) | F1 to F4 |

Organic social recipes, 4:5 master with 9:16 and 1:1 siblings: statement over photo (S01, S02, S10, S23); text tile on a ground mode (S05, S06, S08, S20); annotated product (S03, S19); meaning guide (S04, S14, S22); offer (S11); inset photo with headline (S07, S21); long-copy slide (S09); carousel cover and inner panels, gutter or seamless (S12, S28 to S30; per Gate 1 b); photo-only post (S13, S27); highlight cover (S26).

Paid recipes on the same elements, as size families: annotated product, static and reveal sequence (P01, P02, P16); brand-line hero (P03, P15); name and benefit static (P04, P06); offer and event (P05, P14); collection grid (P07); meaning list and stone cards (P08, P09); quote or review (P10 restyled, P17); press (P11); wordmark end frame (P12). In scope only per Gate 1 call 2.

Web sections W01 to W22 seed a section library if web enters scope (Gate 1 call 2).

### 4.4 Templates

Email types (24 patterns become 14 types): editorial letter (E01, E02, E18); testimonial edit (E03, E10); chaptered edit (E04, E11, E12, E13); collection (E05, E08, E09); offer (E06); spotlight, product or service (E07, E17); launch (E16); mantra (E14); newsletter (E15); welcome series (E19, E20); browse flow (E21); cart flow (E22); checkout flow (E22, E23); post-purchase flow (E24).

Organic social series run on the recipes rather than as new visuals: High Spirits, Seeking the Sublime (the book's Sublime Intervention), Sanctuaries, Field Notes, Crystal Allies, Energy Medicine, Words For Your Journey, Rituals of Winter, zodiac seasons, launch, offer, event, founder, giving. Which series survive, and under which names, is HLR's call at Review 1.

### 4.5 What flexes per channel

| | Email | Organic social | Paid | Web |
|---|---|---|---|---|
| Canvas mode | 1200 (2x) or 700 per C8 | 1080, 4:5 master | 1080 families, 1.91:1, display | 1440 and 375, CSS px |
| Ground modes | Light, tint, deep; image in heroes | Image leads; light, deep, tint | Image and light | Light |
| CTA | Block CTA and text link | None on canvas | Platform button; on-canvas CTA only on landscape | Block CTA, text link |
| Signature | Wordmark header, footer | Handle and star | Wordmark low or end frame | Header wordmark |
| Motion | None | Reels | Reveal sequences, storyboards | Video modal |

## 5. Outliers to retire [observed; retirement derived]

- Faces: Miriam Libre (287 email segments; map to Saol Display), Futura PT (172) and Avenir LT Std (36) in paid (map to Trade Gothic), Inter (118 across channels), Times New Roman (22), Helvetica (2), P22 Cezanne Pro (16), Kristi (5), Ingrid Darling (3), Allison (3), Arvo (2), Over the Rainbow (1), ABeeZee and Neue Haas Grotesk Display Pro (web strays at 305.5), Saol Display Thin Italic (web, 56; no file in the client's folder).
- Colors: red #D54141, rust #812800, dark brown #2D1E15, pale blue #E3F1FA, link blue #1028FD, #1B280E, #C9C5BD, #D5D7D9; the 12 birthstone mats unless HLR rules them product data; near-blacks folded into the ramp; the two blushes and #F7F4EE pending C4.
- Shapes: radius exceptions (social pills and circles, the paid 30 and 60 sticker, web 5 px tab tops); strokes and spacing from 1.2x resizing (1.93, 2.4, 1.64, 1.65, 2.8; 48.06, 72.09, 19.33, 12.02, 10.96).
- Patterns: S18 imported templates; S06 Times New Roman tiles; P10 message sticker in a system sans with rounded corners (restyle as a review card); E18 default-blue link; F2 dark footer; H4 text wordmark; filled Onyx and white CTAs pending C6; red strike prices; the hidden "Embody the force" group in 112 frames.
- Copy and build: placeholders (19 lorem lines in email; lorem in 13 social frames and "placeholder" in 8; "Text will be here" in 9 paid frames; "$00" in 20 web layers, "Jane Smith" in 5, "tktktk" on display cards); the handle misspelling (51 layers in 40 frames, plus a hashtag); "High Light Ritual" (12 layers and 34 nav instances); typos ("Satisfaction guranteed" 5, "REAIL PRICE" 20, "Pendent", "Black Toumaline", "relieve stres", "SUpports" 7, "empowerinGthe" 5, "on it's journey"); dashes in copy (email 131 layers, paid offers 91, product titles 68 em and 11 en; C9); buried template text under images in paid; screenshots as images; stock and marketplace file names as images (licensing); duplicates (27 email groups; mirrored social sets).
- Claims that vary, for the ledger in Pack v0: origin "Made in USA", "Handcrafted in America", "Handmade in America", "Handmade in New York", "Handmade in Connecticut", "HANDMADE IN CT", "handmade in nyc"; warranty 2 or 3 years; free shipping at $50, $100 or $150; a free reading over $300; 1% giving; press features.

## 6. Corrections to the Step 1 record [observed]

- "Embody the force / of the natural world" (131 layers) is a hidden group in 112 frames, never visible. It is not a live email footer tagline (Brand Review section 1, Taglines row).
- The file has components: 3 main components on the Website page (2:183708, 2:184058, 2:185204) and instances of 111 to 121 (the inventory said none).
- The shell-with-star mark exists as vectors (Components 2:31994); C3 said PNG only.
- Paid holds 488 more frames inside boards: 1,059 ad frames in all.
- Corpus counts include hidden layers and copy buried under images, and one layer name differs from its rendered copy (2:185800).
- Social: the 1,288 rows are top-level nodes, of which 1,054 are frames; the two 6342x935 items are labels, not strips.
- Paid ink: Forest in P01, P09 and P16 (Step 1 listed Onyx and white only).

## 7. Gate 1 calls

Gate 1 closes on these answers. The HLR-owned questions in Brand Review v2 (Q1 to Q7, Q9) go to Review 1 and do not block Pack v0: their roles stay null with named gaps. The email build width (Q8) stays at Gate 4, now with the slicing evidence in section 3. Review dates (Q12) stay unset until Eddie sets them.

**1. Organic social coverage (Gate 1 b).** Evidence: 17 strips (about 120 panels) and 25 post dates with two or more frames across the grid, templates and September to October sections; captions written in text layers; stories carry the most volume (527 frames), in sets of up to 100.
1. Existing coverage: S01 Feed post set and S02 Story/Reel cover make single frames; carousels and captions become logged gaps. No engine work; HLR's team hand-builds carousels and writes captions outside the forge.
2. A brand-free organic social type in the scrub release: a carousel recipe (gutter or seamless strip, panel count, cover and inner panels) and an organic caption route. Story sets ride on S02 frames. Engine work inside the scrub release.
3. Option 2 plus a story-set recipe (sequenced 9:16 frames for launches, guides and highlights). Covers the largest volume; more engine work.

Default 2: the grid runs carousels and captions every month and HLR's team runs the forge; story sets can be built frame by frame until volume proves a recipe.

**2. Phase 1 channel scope (Brand Review Q11).** Evidence: paid holds about 1,059 ad frames in 17 patterns on the same 1080 canvases as organic social, and the heaviest claims load (for example "Fine Jewelry for Stress Relief", "Protect your energy"); web holds a redesign in progress beside the live theme.
1. Email and organic social. Paid and web stay reference; their pack roles stay null with named gaps, and the tokens and elements already fit paid's canvases. Paid keeps being hand-built in Phase 1.
2. Email, organic social and paid. Adds the paid recipes, `slotmap_paid`, 9:16 safe-zone tokens and a paid claims pass. More build and a heavier legal gate inside four weeks.
3. All four. Adds the section library (blocking for web-copy) from W01 to W22. The redesign is still moving, so sections may change under us.

Default 1: Phase 1 is four weeks and HLR's brief is email and social; paid joins in Phase 2 on the same elements.

**3. Product names without dashes (Brand Review Q10).** Evidence: 79 of 182 titles carry a dash (68 em, 11 en); a stone follows the dash in nearly all of them, with exceptions such as "Chakra" and a session length ("2 hours").
1. "in": The Seeds of Protection Bracelet in Black Tourmaline. Reads as a sentence; needs a case-by-case rule where the second part is not a stone.
2. Comma: The Seeds of Protection Bracelet, Black Tourmaline. Mechanical; reads like a catalog line.
3. Colon: The Seeds of Protection Bracelet: Black Tourmaline. Mechanical; heavier.

Default 1. In every option the product database keeps the Shopify title verbatim as source and adds a house-style display name.

Added to the Review 1 questions for HLR [derived from this review]: whether blush #F0DFCF is a visible ground at all (verify before C4); the franchise names against the live series (p35); italic emphasis as a documented behavior; Homemade Apple and Instrument Serif (C5); the CTA, given that the book's Fawn label fails contrast (C6); one origin claim and one warranty term for the ledger.
