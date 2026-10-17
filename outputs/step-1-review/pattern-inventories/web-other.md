# HLR pattern inventory: Website and the other pages (Components, Retail/Press, Print, Inspiration, Images)

Slice of the Step 1b pattern review. Read-only, data only, no recommendations. 2026-10-17.

Sources: Highlight-Rituals-Design-Forge `LYyYXPDUHVoAABh865EvMI` (Eddie's copy of the client files, snapshot 2026-10-17), read with `get_metadata` and `get_screenshot` only; `frames-web.tsv`, `corpus-web.tsv`, `site-observed-2026-10-17.md` (cited as [site]), `figma-inventory-2026-10-17.md`, `brand-review-v2.md`; the 2022 brand book (cited pN).

Method notes:
- Faces in Figma were identified by appearance on renders, not read from the file (no plugin reads in this slice). Sizes are text line boxes from `get_metadata` (height of a one-line box), not font sizes. Hex values marked (render) were sampled from screenshot pixels and can sit one step off the source fill.
- Figma calls: 28 succeeded (6 metadata, 22 screenshots), 5 refused at the per-minute limit. The coordinator's cap of 18 calls arrived after call 28; no call was made after it.
- Unsampled (metadata only, no screenshot): all of Print; Retail/Press except one page; the Display card board; Images: founder headshots (by choice), OPTION 2, OPTION 3, Amulets, the four style boards; Inspiration: phone screenshots, web references, camera originals, video frames; Website: desktop About menu (2:185054), live collection capture (2:185484), 20 of 24 hero explorations, mobile hero (2:184427), Reference frame (2:185169), the loose images; Components: specimens other than the two "High Light" lines, UPDATED 3 ICON, FIRST DRAFT ICONS 2 to 5, the 2023 pasted screenshot.

## 1. Coverage per page

| Page | Top-level content (type, size, count) | Screenshots |
|---|---|---|
| Website 2:182972 | 111 nodes [observed]: 56 frames (28 `D_HP_V1` 1440x902; 3 `D_PDP` 1440x4980; 3 `D_PDP` 1440x910; 6 "Channeling this design" 1440x794; 4 `M_Nav` 375 wide, 2240 to 4244 tall; 9 `M_Nav_1` 375 wide, 950 to 2026 tall; 2 "FILTERS DESIGN" 375x2265 and 375x1389; 1 "Reference" 1080x1468), 40 loose images, 11 loose texts (labels "PDP", "FINAL DESKTOP", "FINAL", "FINAL IMAGES", popover copy), 2 hero component frames 1440x760, 2 vectors | 11 (2:185628, 2:184322, 2:184444, 2:184523, 2:185789, 2:185212, 2:184078, 2:183590, 2:184678, 2:185324, 2:184418) |
| Components 2:31579 | 17 nodes [observed]: 8 specimen texts, 1 pasted screenshot 1915x1326 (2:31583, dated 2023-03-05), 5 "FIRST DRAFT ICONS" 1008x332, "UPDATED 4 ICON" 880x161, "UPDATED 3 ICON" 646x161, "DRAFT 01" 4276x1518 | 5 (2:31580, 2:31582, 2:31589, 2:31952, 2:31993) |
| Retail/Press 2:33120 | 108 nodes [observed]: 90 pages 1800x1200 in 7 rows; "Display card options" board 5233x3566 holding 12 cards 750x1050; 1 size board 1842x2303; 5 logo frames; 1 press-logo section 1088x278; 8 loose texts; 1 loose founder headshot (2:33408); 1 note panel | 1 (2:33331) |
| Print 2:35751 | 4 frames [observed]: 2 posters 3600x5400, 1 at 1200x1800, 1 at 1800x1200 | 0 |
| Inspiration 2:35848 | 121 loose images, no frames [observed] | 2 (2:194919, 2:194972) |
| Images 2:31298 | 3 sections (founder headshots 12 images; HLR Editorial 18; Zodiac Sets 12 frames 1800x2250), 4 boards of 1080x1350 frames (OPTION 01: 22; OPTION 2: 3; OPTION 3: 2; Amulets: 6), 4 boards 1800x2250, 1 loose image [observed] | 3 (2:31330, 2:31331, 2:31465) |

Rows on Website, by position [observed]: "FINAL DESKTOP" row (homepage frames and mega menus, y 3212 to 7743) with the mobile menu row (y 5148); a hero exploration field to the right (x 20298 to 36538, 13 frames); "PDP" / "FINAL" row (mobile PDPs, long and short desktop PDPs, y 11272) with the Channeling row under it (y 12400); a later PDP row beside a live collection capture dated 2025-10-22 (y 17563); a live homepage capture dated 2026-07-28 and two screenshots of the same date at the bottom (y 24896).

Components found that the step-1 inventory does not list [observed]: the Website page holds 3 main components (2:183708 "Component 119" 323x354; 2:184058 "Component 118" 446x95, the story headline with tabs; 2:185204 "Component 120" 1440x760, a hero) and instances named Component 111 (nav, 34), 112 (hero, 28), 113 (announcement bar, 34), 115, 117, 118, 120, 121. Their main components for 111 to 117 are not on this page. The step-1 inventory states the file has no components; this contradicts it for the Website page.

## 2. Website pattern roster

Ink and ground on all redesign frames: page ground #F6F4EE (render), ink Forest #17280A (render) [observed]. The live page ground is #F7F4EE and live ink #17280A [site]. Radius is 0 on every button, card and tag seen [observed]; the live site is also radius 0 [site].

| ID | Pattern | Structure | Type pairing | Ground / ink | Devices | Imagery | CTA | Count | Examples |
|---|---|---|---|---|---|---|---|---|---|
| W01 | Announcement bar | Full-width strip, one centred line. Desktop 1440x25; mobile 375x25 (also 21 and 45 tall) | Trade Gothic by appearance, sentence case, line box 20 ("Free shipping over $150") | A: Fawn #BEADA2 (render) with Forest ink (PDP set). B: #F6F4EE with Forest ink (homepage, menu, filter sets) | B carries a hairline rule below | None | None | 34 desktop instances, 13 mobile frames | 2:185628 (A), 2:184444 (B), 2:184678 (B) |
| W02 | Desktop header | 1440x60: 3 links left from x 30, wordmark centred (about 244 wide), "Find Your Match", Search, Bag (1) right; hairline below | Links sentence case, line box 20; live nav Trade Gothic 13/22 +0.26px [site] | #F6F4EE / Forest; active-item underline Fawn #BEADA2 (render) | Wordmark artwork reads "HIGH LIGHT RITUAL" (singular) | None | Text links | 34 instances; 2 label sets ("Healing Jewelry / Energy Readings / About Us" in most; "Shop / Learn / Find your energetic ally" in 2:184322) | 2:184444, 2:184322, 2:185628 |
| W03 | Mega menu, desktop | 1440x474 panel under the nav, page dimmed. Shop: 4 link columns (Shop all, RECOMMENDED, SHOP BY MEANING, SHOP BY TYPE) and 2 promo tiles 213x240. About: 6 tiles 213x240, 20 gutter | Column heads bold tracked caps (Trade Gothic Bold by appearance), line box 13; links line box 20; "NEW" superscript tag; tile captions bold tracked caps, centred | Panel #F6F4EE; heads #000000; links Forest; tag Fawn; tile grounds #EDE9E6, #EBE8E0 (render) | Dim overlay (page renders #DFDFD7) | Promo tiles: 3.3 product ecommerce. About tiles: unsampled on desktop | Links and tiles | 4 (3 Shop, 1 About) | 2:184523, 2:184576, 2:185054 |
| W04 | Mobile header and drawer | 375x85 (25 bar, 60 header): menu or close icon left, search and bag icons right, Fawn count badge. Drawer rows 45 tall at a 70 pitch with plus and minus toggles; About expands to 2-column tiles 160x180 (15 gutter) | Rows sentence case, line box 20; tile captions bold tracked caps, line box 13 | #F6F4EE; About panel #F0ECE6 (render); Forest; badge Fawn | Thin line icons; hairlines | Tiles: founder and people photography (usage only), B&W process hands, a grass path, B&W ritual objects | Rows and tiles | 7 drawer frames; the header sits in 11 frames (9 `M_Nav_1`, 2 filters) | 2:184678, 2:184749, 2:184468 |
| W05 | Hero, desktop | 1440x760 split into two 720x760 images; 2-line headline (box 408x96) and a text link at x 88 over the left image; headline sits at y 395 or y 583 | Saol Display italic by appearance, white, line box 48 per line; sale variant mixes italic and roman. Live homepage H1 Saol Display 40/44 weight 300 [site] | Image / white | None | 3.1 model campaign (B&W neck close-up; warm model in cream dress), 3.2 product campaign on hands (pendant held; crystal held; charm necklace on linen) | Caps text link "SHOP NOW", bold tracked, white, no box, no rule | 24 hero frames (4 with frame-level copy, 20 image-only) and 2 hero component frames | 2:184444, 2:185789, 2:185212 |
| W06 | Hero, mobile | 375x549: image 375x364, 2-line headline below (344x94), full-width button 345x45 at x 15 | Unsampled | Unsampled | None | Unsampled | Block button with "shop now" (fill unsampled) | 2 | 2:184427, 2:184435 |
| W07 | Product gallery | Thumb rail of 5 at 53x66 (71 pitch) from x 100, main image 547x634 at x 158, chevrons, "BEST SELLER" tag 89x20, video thumb 95x118 with "WATCH OUR ACTIVATION RITUAL" play link. Mobile: image 335x388 and a row of 5 thumbs 35x43 | Tag and link bold tracked caps, line box 13 | Image grounds #E9E6DF to #EDEAE5 (render); tag white with Forest | Play triangle; chevrons | 3.3 product ecommerce (pendant on a neutral ground, natural shadow); B&W on-body video still | Play link | 10 (6 desktop, 4 mobile) | 2:185628, 2:183883, 2:183590 |
| W08 | Video modal | Page dimmed; video still 586x767 centred; close X | None | Overlay over #F6F4EE | Close glyph | B&W hands with bracelets and rings (3.1 or 3.2) | Close | 1 | 2:184322 |
| W09 | Buy box | 512 column at x 735 (mobile 335): optional collection eyebrow; title; price, 5 stars, count; 2-line benefit line; rule; option groups (metal, chain length, stone) as text options, as 6 named stone swatches, or as a 144x24 dropdown; info glyph; ceremony line (W12); add-to-bag block; pay-in-4 line with a payment badge and "Learn more"; ship-date line; rule; tabs DESCRIPTION / DETAILS / WHEN TO WEAR IT with an 80 px accent underline; body | Title Saol Display by appearance, line box 48 (mobile 30); live product H1 Saol Display 31.1/35, 300, -1.44px [site]. Price line box 20; live Trade Gothic 13/20 [site]. Eyebrows bold caps line box 13; live H4 Trade Gothic 11/13.2, 700, caps +1.1px [site]. Body line box 20; live 13/22 [site] | #F6F4EE / Forest; unselected options grey | Hairline rules; tab underline | None | Filled Forest #17280A block 512x45 (mobile 335x45), square, bold tracked caps label in white "ADD TO BAG • $00". Live: outline, 1px black, Saol Standard 14/15 "Add to bag" [site] | 10 (6 desktop, 4 mobile); 3 option builds: text (2:184190), swatches (2:185489), dropdown (2:185628) | 2:185628, 2:185489, 2:183590 |
| W10 | Info popovers | Loose cards 296x419 and 296x353 with long copy (metal meanings; reading session terms) and a 256x31 bar "Add Session To Bag • $00"; 11x11 close glyph | Unsampled | Unsampled | Close glyph | None | Bar button (unsampled) | 2 sets | 2:184420, 2:184424, 2:185161 |
| W11 | Session add-on card | Card 512x100 (mobile 335x115): 100x100 thumbnail, 2 to 3 lines, "More details" link, button | Copy line box 20; button label bold caps on 2 lines | Card #F2EDE7 (render); Forest; mobile button #DAD1C9 (render) | None | Founder photography thumbnail | Desktop: outline square 118x60, hairline. Mobile: full-width filled taupe bar "ADD SESSION TO BAG • $00" | 7 frames and 3 instances | 2:185628, 2:183590, 2:183883 |
| W12 | Ceremony line | 26x26 concentric-circle icon, one line, underlined link ("Every piece is ceremonially charged...") | Sentence case, line box 20 | Forest on the PDP; muted grey green (#707A65 render) in the menu | Concentric-circle icon (same glyph as the "Black-owned, Healer-led" icon on Components) | None | Underlined link | 17 frames | 2:185628, 2:184678 |
| W13 | Trust marquee | One line of 7 to 8 phrases in a row wider than the frame (1463 to 1703), bleeding both edges | Saol italic by appearance, line box 20 | #F6F4EE; light grey-green ink | None | None | None | 8 frames; 2 phrase sets | 2:185628, 2:183590, 2:184322 |
| W14 | Story tabs and accordion ("The energy inside this piece") | Desktop: headline with one italic word and a tab row (CRYSTALS, FOUNDER'S NOTE, DESIGN ELEMENTS, RITUAL) over a 446 text column (x 208) beside a 512 image (x 735). Mobile: accordion rows with plus toggles. Explorations: figure-numbered stone notes ("FIG. 1 / ROSE QUARTZ") beside 3x2 or 2x2 product grids with numbered captions | Headline Saol Display roman with italic; tabs and FIG labels bold tracked caps, line box 13; body line box 20 | #F6F4EE / Forest; grid grounds #E9E6DF to #EBE8E1 (render) | Tab underline; rules | 3.1 model campaign (warm film-look neck crop from the Editorial set) or 3.3 product grids | Tabs | 14 (3 long PDP, 4 mobile, 6 Channeling, 1 short PDP) | 2:184078, 2:185628, 2:183590 |
| W15 | Ritual and process block ("the ritual that makes it yours") | Two portrait images 210x255 (20 gutter), each with a caps caption and a 3-line note; right column: eyebrow, 5-line statement (box 512x200) with an italic word, short body | Statement Saol Display by appearance, line box 40; captions bold caps; body line box 20 | #F6F4EE / Forest | None | Founder photography in ceremony and a B&W process detail (usage only) | None | 3 desktop; a mobile accordion row | 2:185628, 2:185489, 2:184190 |
| W16 | Brand promise block (mobile menu) | Ceremony line, image 335x183, eyebrow "WHERE JEWELRY MEETS ENERGY WORK", 3-line body, button 335x45 | Eyebrow bold tracked caps; body line box 20 | #F6F4EE / Forest | None | Founder photography (at an altar) | Filled Forest block, white bold caps "LEARN MORE", square | 7 | 2:184678, 2:184468, 2:184749 |
| W17 | Testimonial ("Words from the Heart") | Centred eyebrow, centred 4-line quote (box 877x160), attribution, slider indicator (273 rule with a 49 active segment) | Quote Saol Display by appearance, line box 40; eyebrow bold caps | #F6F4EE / Forest | Slider rule | None | None | 7 (3 desktop; 4 mobile, 2 of them through the main component 2:183708 and its instance) | 2:185628, 2:183289, 2:183590 |
| W18 | Reviews | Eyebrow, stars and count, "5.00 out of 5" (line box 30), review list pasted as an image (1169x436; mobile 2 at 321x292), pager | Score in Saol by appearance | #F6F4EE / Forest | Stars | None | Pager | 7 (3 desktop, 4 mobile) | 2:185628 (2:185656), 2:183590 |
| W19 | Product card rail ("You may also like") | Desktop: cards 404 wide, 72 gutter, from x 137, the third bleeding off the right edge; the whole rail is one pasted image (2:185655, 1391x623). Mobile: 2-up cards with a variant line and a button. Card: image on light grey, "More options" italic tag top right, serif name, serif "From $" price | Name and price Saol by appearance; live card price Saol Standard 14/22 [site] | #F6F4EE / Forest | Italic tag | 3.3 product ecommerce | Mobile: outline square, hairline, italic serif sentence-case label "Add to Bag" | 7 (3 desktop, 4 mobile) | 2:185628, 2:183590, 2:183289 |
| W20 | Press strip ("As featured in") | Eyebrow and one full-bleed row of third-party logos pasted as an image (1454x62) | Eyebrow bold caps | #F6F4EE; logos black | None | None | None | 6 (3 desktop; 3 mobile, where the heading reads "You may also like") | 2:185628 (2:185665), 2:183590 (2:183696) |
| W21 | Footer | Stacked links (social, terms, privacy, FAQs, accessibility; box 683x100), disclaimer (683x80; mobile 335x140), "© 2025 High Light Rituals" | Line box 20, sentence case | #F6F4EE / Forest, disclaimer lighter | None | None | Links | 6 (3 desktop, 3 mobile) | 2:185628, 2:183590 |
| W22 | Filters drawer (mobile) | Header; "Filter" title and product count; 5 accordion groups (Price, Type, Stone, Meaning, Metal) with checkbox lists; 2 buttons 162x45, 11 gap | Title Saol Display italic by appearance; count small italic serif; options line box 20; button labels bold caps | #F6F4EE / Forest | Checkboxes; minus toggles | None | CLEAR: Alabaster #FBF7EF fill, grey hairline. APPLY: Forest fill, white label. Both square | 2, plus a filter-button draft over the live collection capture (2:185485 to 2:185488) | 2:185324, 2:185425 |
| W23 | Impact and FAQ | Not designed as page sections. "Collective Impact" and "COMMON QUESTIONS" exist only as About tiles | As W03, W04 | As W03, W04 | None | Tile images | Tiles | 5 frames | 2:184678, 2:185054 |

### Redesign against the live site

| Area | Figma redesign [observed] | Live site |
|---|---|---|
| Wordmark | "HIGH LIGHT RITUAL" in the nav component and as live text on mobile | "HIGH LIGHT RITUALS", white over the hero (capture 2:184418) [observed] |
| Header | Solid #F6F4EE bar, Forest links "Healing Jewelry / Energy Readings / About Us", "Find Your Match" | Transparent over the hero, white links (capture) [observed]; nav groups by type, collection, intention and healing [site] |
| Announcement | "Free shipping over $150", Fawn or light bar | "Free shipping for orders $50+" on a light bar [site] [observed]; cart drawer threshold $100 [site] |
| Hero | Split 720/720, italic Saol headline, caps text link | One full-bleed image with "Meet Mermaid Medicine" (capture 2026-07-28) [observed]; hero line with a "Let's begin" caps link [site] |
| Add to bag | Filled Forest block, bold caps sans label | Outline 1px black, Saol Standard 14/15 [site] |
| Other filled buttons | Forest block, bold caps sans label | Forest block with a Saol Display 18/22 label [site] |
| Product title | Line box 48 | Saol Display 31.1/35 [site] |
| PDP sections | Story tabs, ritual block, testimonial, reviews, rail, press, footer | "The energy inside this piece", "Our Founder", "Our Process", "Collective Impact", "Common Questions", "Energy Readings" [site] |
| Reviews | Static image, "(6)" and "5.00 out of 5" | Live widget, 72 reviews on the Seeds of Protection Bracelet [site] |
| Shared | Trust marquee in italic serif; "More options" italic card tag; centred serif testimonial; press logo row; footer disclaimer text | Same patterns on the capture [observed] and the same disclaimer text [site] |

## 3. Components page

Type specimens: 8 loose text layers, no text styles behind them [observed]. Labels mirror the book's type sheet (p16: "Headline one", "Headline two", "Product Names & Pull Quotes", "INLINE TITLES + SMALL HEADLINES", body paragraph styles, numerals "2 / 4", "2.4.21", "$24") [documented p16].

| Node | Text as set | Line box (w x h) | Role as labelled | Face |
|---|---|---|---|---|
| 2:31580 | "High Light" | 661x172, one line | Headline | High-contrast display serif, Saol Display by appearance, white [observed] |
| 2:31582 | "High Light" twice | 397x216, two lines | Headline, second cut | Same display serif on both lines; a weight difference is not resolvable on the render [observed] |
| 2:31584 | "Product Name & Pull Quotes" | 598x66 | Product names and pull quotes | Unsampled |
| 2:31585 | "12345 $24" | 161x39 | Numerals and price | Unsampled |
| 2:31581 | "INLINE TITLES + SMALL HEADLINES" | 495x29 | Inline titles, small headlines | Unsampled |
| 2:31586 to 2:31588 | "Paragraph Style 1", "2", "3" (filler repeats) | 181x180, 195x136, 162x104 | Body paragraph styles 1 to 3 | Unsampled |

Specimens and icons are drawn in white or taupe for a dark canvas (renders show the page canvas as #3D3D3D) [observed].

Icon sets [observed]:

| Set | Nodes | Icons | Drawing | Colour | Labels | State |
|---|---|---|---|---|---|---|
| FIRST DRAFT ICONS | 2:31589, 2:31686, 2:31778, 2:31876, 2:32079 (1008x332 each) | 4 per board in 90x90 frames: ring with Roman numeral III and a bound band (warranty), two hands passing a crescent (giving), 8-point star (ceremony), oval badge with stars and stripes (made in America). Boards 2 to 4 redraw the giving icon; board 5 swaps the ceremony label for a free-reading offer above a spend threshold | Single-weight line drawings (stroke), no fills | White | 2-line caps in a wide neutral sans (face unverified; wider than Trade Gothic) | Named first drafts; 1 sampled (2:31589) |
| UPDATED 4 ICON | 2:31952 (880x161) | Infinity (satisfaction guaranteed), 8-point star (giving 1% to charity), concentric circles (Black-owned, Healer-led), scallop shell with ribs (consciously handmade) | Line drawings between two hairline rules | Taupe #BBAEA4 (render, near Fawn #BEADA3) | Bold tracked caps, Trade Gothic Bold by appearance | Updated set; holds a hidden 2024-08-05 reference screenshot (2:31973) |
| UPDATED 3 ICON | 2:31974 (646x161) | The same set without the giving icon | As above (metadata) | Unsampled | Unsampled | Updated set |
| DRAFT 01 | 2:31993 (4276x1518) | Shell-with-star line mark as vectors (2:31994: 17 rib vectors, a shell outline, a star), shell ribs alone (2:32016), 8-point star alone (2:32034); 9 offer badges "Free Reading / ORDERS $300+": 4 scallop-shell badges with an inner keyline (2:32038, 2:32043, 2:32049, 2:32055), 1 circle inside a starburst (2:32062), 1 starburst (2:32035), 2 pills (2:32070, 2:32071), 1 plain line with a star (2:32078) | Mark: line drawing. Badges: solid fills with reversed type | Badges #231F20 on white (render) | "Free Reading" in a display serif (Saol Display by appearance); "ORDERS $300+" small tracked caps sans | Draft |

The shell-with-star mark exists here as vectors [observed]; brand-review-v2 lists it as PNG only (C3).

## 4. Images and Inspiration

Card key: 3.1 model campaign (p21), 3.2 product campaign (p22), 3.3 product ecommerce (p23), 3.4 social media (p24) [documented].

Images page 2:31298 [observed]:

| Family | Count | What it is | Card | Sampled |
|---|---|---|---|---|
| Founder headshots (section 2:31311) | 12 photos (6 portrait 2731x4096, 5 landscape 4096x2731, 1 square) | Founder photography. Usage: the Retail/Press founder-story pages place a headshot (2:33408); the web designs place founder images through screenshots and one altar image (2:184972) | Not a card (founder) | No (by choice) |
| HLR Editorial (section 2:31330) | 18 photos: 8 film scans (numbered 00040548 to 00040556 series), 10 digital (HighLight8176 to 8717) | One-model editorial in warm, low, natural light with a film look; 3 of 18 in B&W; cream lace and linen, scallop shells, pomegranates, a fruit table | 3.1 (15), 3.2 (3 product-led vignettes) | Yes |
| Product on chain, captioned (OPTION 01 2:31331; OPTION 2 2:31526; OPTION 3 2:31568; Amulets 2:31536) | 33 frames at 1080x1350 (22, 3, 2, 6), frame name "HighLight_IGStorySet-PressKit" on OPTION 01 | Studio shots of pendants hanging on chains on a warm off-white seamless (#DEDCD7 to #E8E4DB render) with soft shadow; one on-model crop; a caption line naming piece, metal and chain on 20 of the 22 OPTION 01 frames (2 carry length labels instead); 18 older centred captions hidden; Amulets carry "(size reference)" captions | 3.3 | OPTION 01 only |
| Zodiac sets (section 2:31465) | 12 frames 1800x2250 | Flat-lay composites on #EEEBE2 (render): two birthstone bead bracelets on a diagonal around a cluster of tumbled crystals | 3.3 (composite cut-outs) | Yes |
| Style boards (2:31434, 2:31514, 2:31446, 2:31459) | 4 boards 1800x2250 | Cut-out product collages with product-type names; 2 carry a line that crystals are chosen during a reading | 3.3 (composite) | No |
| Loose | 2 (2:31577; a 2024-08-27 screenshot 2:31433) | A product image; an on-skin pendant screenshot | 3.2 | No |

Inspiration page 2:35848, 121 loose images, classified by file name [observed]:

| Family | Count | What it is | Card | Sampled |
|---|---|---|---|---|
| Stock | 36 | File names carry a stock-library tag. Subjects: water, waves, mountains, flowers, hands, shells in sand, animals, light, a figure in a concrete room | 3.4 (nature, otherworldly) | 1: grainy B&W flower with film scratches (2:194919) |
| HLR stills, 4 sets | 36 (Crystals 5, Egg 16, Eucalyptus 8, Flower 7) | Exports at 8x10 (1600x2000) and 9x16 (1080x1920) with "single" variants | 3.2 on body | 1: egg pendant on a ball chain over a forearm, grey wall, natural light (2:194972) |
| Video frames | 13 | "VIDEO 01" to "05" at 1280x720 and 1920x1080; portrait frames named "HL" at 1080x1920; an activation-ritual video frame; 2 others | Unclassified | No |
| Camera originals | 13 | Camera-series names (DSC, IMG, 0R9A, 0V2A) at full camera size; origin not labelled | Unclassified | No |
| Web references | 15 | Named after third-party sources (a painting, photographers' prints, blog and social reposts, hashed names) | Reference only | No |
| Phone screenshots | 8 | Dated 2025-04-05 to 2025-04-22 | Reference only | No |

AI-made: no image on these pages or on Website is labelled as AI-made [observed]. One Website image has a hashed name and no label (2:185921).

Website images [observed]: inside the designs, 144 image fills are named "Screenshot 2025-04-03 ..." (screen captures standing in for photos), 56 are named "image", 3 "IMG_2927", 2 dated 2026-05-06, 1 a named product photo. Loose on the page (40): 6 HLR product or campaign files, 2 fairy-charm group shots, 1 founder-at-altar image, 2 camera originals, 5 images whose names carry a stock-library prefix and photographer credit, 1 hashed name, 2 live-site captures, 13 dated screenshots, 8 grey card rectangles behind popover copy.

## 5. Retail/Press and Print

Retail/Press 2:33120 [observed]:

| Group (row label) | Pages at 1800x1200 | Content |
|---|---|---|
| Unlabelled, Spring 2024 "Healing Crystals & Ritual Tools" | 6 (cover 2:33159) | Crystal and ritual-kit line sheet with retail and wholesale price rows |
| Unlabelled, Spring 2024 "Mystical Heirlooms" | 11 (2:34296 to 2:34286) | Pendant line sheet with "$xx" prices (20 layers) and "Text will go here." filler (2 pages) |
| "WHOLESALE - ALL JEWELRY" | 22 (cover 2:33121) | Ethos, founder story, collection intros, product pages, 5 pages named as unfinished |
| Loose | 1 (2:33210) | Product page |
| "MEDIA" | 22 (cover 2:34680) | Same deck with retail prices only, 4 pages named as unfinished, a thank-you page |
| "WHOLESALE - SACRED LAYERS ONLY" | 10 (cover 2:34327) | One collection |
| "NOV 19 2025 WHOLESALE - ALL JEWELRY" | 18 (cover 2:33140) | Brand intro, founder page, pendant and bracelet pages, a press page with 7 third-party logos (2:34306), a thank-you page |

Also: "Display card options" (2:35604) with 12 cards at 750x1050 (5x7 in at 150 ppi): wordmark 500x40 at top, a title line ("Otherworldly elegance" or a product name), stone and intention pairs, handle or URL, an inner keyline (678x970), a shell vector; 1 card holds placeholders [observed, metadata only]. A size board "Large / Medium / Small / Mini" (2:34409). Logo frames: 3 builds of the 16-letter wordmark "HIGH LIGHT RITUALS" (2:34392 1033x85; 2:33185 474x148 on two lines; 2:33168 364x112) and 2 empty 169x138 frames (2:34384, 2:34388). Press-logo section (2:60822) with 3 third-party logos.

Devices and type on the sampled page (2:33331, Nov 2025 deck) [observed]: left half text on white #FFFFFF, right half a full-bleed product photo (#EAE8DE ground, render); an inset back-view photo with a hairline border; title in a light, tracked serif and a serif tagline, both Onyx #353535 (render); body and spec labels in a neutral sans, #000000; spec table with bold caps labels (materials, dimensions, retail and wholesale price rows); footer with URL left, contact right and a stacked HLR monogram with a star, #231F20, centred. Covers are full-bleed photos (HighLight shoot names) with the 16-letter wordmark as vectors across the foot (2:33142, 1706x138) [observed, metadata].

Print 2:35751, metadata only [observed]:

| Frame | Size | Holds |
|---|---|---|
| 2:35752 Poster | 3600x5400 | Full-bleed photo (film-scan number, like the Editorial set), wordmark at 2500 and 600 wide, headline "Energy-Infused Fine Jewelry", a claims line in caps with bullets ("HEALER-ACTIVATED • CUSTOM SPELLS • HANDMADE IN CT"), handle and URL |
| 2:35808 Poster | 3600x5400 | Same, headline higher, URL only |
| 2:35791 Poster | 1200x1800 | "FOLLOW US FOR" / "20% Off Jewelry", handle and URL, one image 532x536 |
| 2:35799 Poster | 1800x1200 | "Gift a Custom Spell Bracelet", a press-feature line naming a magazine gift guide, a 4-item caps list |

Faces and colours in Print are unsampled. The two small posters carry off-canvas copies of the large poster's text layers [observed].

## 6. Channel requirements observed for web

- Frame widths [observed]: desktop 1440 only; mobile 375 only; no tablet frames. Desktop heights 902 (homepage viewport), 910 (PDP fold), 794 (section studies), 4980 (full PDP). Mobile heights 950 to 4244.
- Live breakpoints [site]: 576, 768, 992, 1200 from the theme framework, plus 1024 and 1280.
- Desktop grid, measured on 2:185628, 2:184523, 2:185054 [observed]:
  - Header insets 30 left and right; nav bar 60 under a 25 bar; hero 760.
  - Mega menu tiles: 6 columns of 213 with 20 gutters (pitch 233), insets 32 left and 30 right.
  - PDP top: thumb rail 53 at x 100, 5 gap, main image 547 (x 158 to 705), 30 gap, buy box 512 (x 735 to 1247), right inset 193.
  - PDP lower: text column 446 (x 208 to 654), 81 gap, image column 512 (x 735 to 1247); content span 1039.
  - Ritual images 2 x 210, 20 gutter.
  - Card rail 404 wide, 72 gutter, from x 137, last card bleeding; reviews, press and footer align at x 137.
  - Testimonial measure 877, centred.
  - Hero split 720 / 720, copy inset 88 (77 in one variant).
- Mobile grid, measured on 2:183590, 2:184678, 2:185324 [observed]: side margin 20 (content 335; some elements at 15 to 17); tiles 2 x 160 with a 15 gutter; drawer rows 45 at a 70 pitch; full-width buttons 335x45; paired buttons 2 x 162 with an 11 gap; thumbs 35x43 at about a 40 pitch; header 85 including a 25 bar.
- Smallest text [observed]: the bag count "1" in a 4x4 box (9 layers, mobile header); then "11 products" (10 box) and one "Learn more" (11 box). Most captions, tags and eyebrows sit in 13 boxes (247 layers); body and links in 20 boxes (362 layers). Live minimums: eyebrow 11 px, body 13 px [site].

## 7. Book comparison per family

| Family | Verdict | How, with sources |
|---|---|---|
| Logotype | Drifted | Book: "HIGH LIGHT" in three cuts by size [documented p13]. Web redesign nav: "HIGH LIGHT RITUAL" [observed]; live, Retail/Press and Print: 16-letter "HIGH LIGHT RITUALS" [observed]. Same high-contrast serif style by appearance; the name differs in all three |
| Mark | Drifted | Book: scallop shell mark, "H" shell "L" horizontal and vertical, lockup with "SANCTUARIES OF SELF AND SPACE" [documented p14, p15]. Figma: shell with an added star (2:31994), shell ribs icon (2:31952), stacked HLR monogram with a star on press pages (2:33331) [observed]. The book's H shell L is not used on any page sampled |
| Type pairing | On-book with drifts | Book: Saol leads, Trade Gothic accents and body, never a large Trade Gothic headline [documented p16]. Web: Saol for titles, heroes, section heads, quotes, card names; Trade Gothic for nav, body, eyebrows, buttons [observed]. Drifts: Saol italic carries hero headlines and emphasis words (italic is not shown in p16 or p17); body at 13 px Trade Gothic against the book's Saol Standard 14/23 body or Trade Gothic 15/22 [documented p17, p18] |
| Subhead / eyebrow | On-book | Book: Trade Gothic 10/17, +200, caps [documented p17]; Trade Gothic Bold for inline titles [documented p16]. Web: bold tracked caps in 13 boxes [observed]; live 11/13.2 [site] |
| CTA | Drifted | Book: link CTA in Saol Standard 16/23, sentence case, with a rule [documented p17]; block CTA as an outline in Trade Gothic 10/17, +200, caps [documented p18]. Web redesign: filled Forest blocks with bold caps labels; outline blocks (session, CLEAR); caps text links with no rule; an outline card button with an italic serif label [observed]. Live: filled Forest with Saol Display labels, outline with Saol Standard [site]. Filled blocks and the italic label are not in the book |
| Colour | Drifted | Book: Onyx #353535 and Alabaster #FBF7EF primary; Sea Salt, Forest, Fawn secondary; lighter colours behind text [documented p19]. Web: Forest ink on #F6F4EE, Fawn bars and accents, #000000 menu heads, #F2EDE7 and #F0ECE6 panels; Alabaster only on one button [observed]. Retail Nov 2025: Onyx titles on white [observed]. Components: #231F20 badges [observed] |
| Hero | Drifted | Book homepage: split hero, model left and product right, eyebrow "SEEK THE SUBLIME", Saol headline, body and a ruled link over the right image [documented p46, p47]. Redesign: split hero, italic headline and a caps link over the left image, no eyebrow or body [observed]. Live: one full-bleed image [observed] |
| Header | Drifted | Book: "Self" and "Space" left, H shell L centred, "Journal" and "Cart (0)" right [documented p46]. Redesign: 3 links, wordmark, utilities [observed] |
| Product card | Drifted | Book: product grid on light grounds with names, prices and outline buttons [documented p46, p47]. Redesign: rail on light grey grounds, serif names and prices, italic "More options" tag, mobile outline button with an italic serif label [observed] |
| Footer | Drifted | Book: Forest footer with an email sign-up and link columns [documented p46, p47]. Redesign and live: light footer with stacked links and a disclaimer, no sign-up [observed] |
| Pull quote / testimonial | Drifted (alignment) | Book: Saol Display 35/45, left aligned [documented p18]. Web: Saol Display in 40 line boxes, centred [observed] |
| Announcement bar, mega menu, buy box, session card, trust marquee, reviews, press strip, filters, icons, offer badges | Off-book (not in the book) | Built from the book's faces and from Forest and Fawn [observed]. The book has no icon set; brand-review-v2 cites an emoji set at p35 |
| Imagery, Editorial and product sets | On-book | Natural warm light, B&W allowed, romantic styling, organic objects, hanging pieces [documented p21 to p23]; Editorial, OPTION and Zodiac sets match [observed] |
| Imagery, stock | On-book in mood | Nature and symbolic subjects suit 3.4 [documented p24]; licensed status unknown |
| Imagery, web placements | Drifted (source) | 144 screen-capture stand-ins in place of original files [observed] |
| Print and retail cards | Drifted | Book: postcard with tracked caps eyebrow, two photos, Saol line, logotype and shell mark [documented p44]; poster with photo, body block and logotype [documented p45]. Figma posters: positioning line "Energy-Infused Fine Jewelry" and a claims line, 16-letter wordmark [observed]. Display cards keep a keyline, wordmark and shell vector (metadata) [observed] |

## 8. Outliers

- Singular name [observed]: "High Light Ritual" in 12 text layers (4 visible as the mobile header wordmark: 2:183592, 2:183297, 2:183441, 2:183736; 8 hidden in 2:183893, 2:183978 and the six Channeling frames) and as the desktop nav wordmark artwork (34 instances of Component 111).
- Layer name against rendered copy [observed]: the layer named "Energy infused fine jewelry" (2:185800) renders "Spiritual jewelry for returning to yourself" (2:185789). The web corpus, built from layer names, can miss rendered copy.
- Placeholders [observed]: "$00" in 20 button and offer layers ("Add to bag • $00" 11; "Add Session To Bag • $00" 6; "More details $00" 3); reviewer "Jane Smith" (5); stale ship date "04/21/25 - 04/30/25" (6); every filter group repeats the same 6 options (2:185324); different stones all captioned "CLEAR QUARTZ" and filler sentences repeated (2:184078); mobile heading "You may also like" over the press strip (2:183289, 2:183437, 2:183590); card price "From $495" against the PDP's "$180" for the same product (2:183590); Retail "$xx" (20 layers), "Text will go here." (2 pages), 9 pages named as unfinished; display card "tktktk", "TKTKTK", "SKUX".
- Stand-ins [observed]: 144 screen captures as image fills; reviews, card rail and press strip as pasted images; leftovers inside 40 Website frames, placed above each frame's top edge and clipped (a "D_Get Started" instance at y -1720 and an arrow icon frame at y -990, 40 of each).
- Off-palette fills [observed]: #F6F4EE ground (book Alabaster #FBF7EF; live #F7F4EE); #F2EDE7 session card; #F0ECE6 mobile About panel; #DAD1C9 mobile session button; #000000 mega menu heads and Retail body; #231F20 offer badges and HLR monogram; #EEEBE2 Zodiac ground; #FFFFFF Retail page ground and the OPTION board; #E6E2DA to #EDEAE5 product grounds (photo, not fills).
- Faces [observed]: icon labels on the first drafts in a wide neutral sans that does not read as Trade Gothic; Retail body in a neutral sans; both unverified without a font read.
- Two of a kind [observed]: two announcement bar grounds (Fawn and #F6F4EE); two nav label sets; mobile bar heights 21, 25 and 45; three stone-selector builds.
- Claims that vary [observed]: warranty "2 Year" (5 frames) against "3-Year" (3 frames) and "3 - YEAR" (icon drafts); origin "Made in USA" (8 web frames), "Handcrafted in America" (3), "Handmade in America" (Retail, about 23 layers), "Handmade in New York" (9 Nov 2025 pendant pages), "Handmade in Connecticut" (4 Nov 2025 bracelet and necklace pages), "HANDMADE IN CT" (Print); free shipping $150 here against $50 and $100 live [site]; offer "Free Reading" on orders over $300 (badges); a giving claim of 1% to charity (icons); a press-feature claim on a print poster.
- Typos [observed]: "Satisfaction guranteed" (5 layers), "REAIL PRICE" (20 layers), "Pendent" (1).
- Components outside the step-1 count [observed]: 3 main components on the Website page (2:183708, 2:184058, 2:185204).

## 9. Cross-channel candidates (by job)

- Offer or announcement strip (W01) [observed]: the email module library has a promo bar (figma-inventory).
- Product card with name, variant line, price, tag and button (W19, W03 tiles).
- Trust band: icon row with caps labels (Components) and the italic phrase marquee (W13).
- Ceremony line with the concentric-circle icon (W12).
- Founder or healer block: image, eyebrow, statement, button (W15, W16; Retail founder pages).
- Ritual or process explainer: paired images with captions and a statement (W15).
- Testimonial or pull quote (W17).
- Rating summary (W18).
- Press proof row (W20; Retail press page; a Print press line).
- Split hero with italic headline and caps link (W05); sale hero with mixed italic and roman (2:185212).
- Stone and intention meaning list (W14 FIG notes; display-card stone and intention pairs; the "Meaning" filter).
- Reading or session upsell (W11, W10).
- Offer badge (Components DRAFT 01).
- Product caption line naming piece, metal and chain (Images OPTION sets).
- Claims disclaimer (W21).
- Eyebrow, headline, body and CTA lockup (book p17; W15, W16).
- Category taxonomy: shop by meaning and by type (W03, W04).
