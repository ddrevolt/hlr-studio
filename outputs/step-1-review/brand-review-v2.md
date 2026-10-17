# HLR Brand Review v2

Step 1, read-only. 2026-10-17. For Gate 1 and Review 1. Supersedes v1.

Sources: the brand book `061022_HighLight_BrandBook_DS.pdf` (54 slides, 2022-06-11; cited as pN); the client folders (fonts, marks, imagery, inventory sheet); the live site highlightrituals.com (`site/`); and Eddie's copy of the client's Figma files in Highlight-Rituals-Design-Forge (`figma/`): 527 email frames, 1,288 organic social, 723 paid, 111 web. The copy corpus is deduped from text layer names: 1,416 email lines, 972 social, 512 paid, 162 web.

## 1. Documented vs observed

| Area | Book (2022) | Live work (site, Figma, marks; 2023 to 2026) | Flag |
|---|---|---|---|
| Name | HIGH LIGHT, in caps inside sentences (p14, p19, p26) | High Light Rituals and HLR; "High Light Ritual" in the web redesign (12 layers); the handle misspelled "@HIGHTLIGHTRITUALS" in 51 social layers; Shopify vendor "High Light" | C1 |
| Positioning | "Timeless jewelry for self and space"; "We are not creating a new-age practice" (p8, p32) | "Fine Healing Crystal Jewelry, Healer-Activated"; "Shamanic energy healing & hand-blessed talismans"; healing sessions sold as products; a paid end frame reads "Fine jewelry for the witch within" | C2 |
| Marks | Scallop shell system; HIGH LIGHT logotype in three cuts (p13 to p15) | HIGH LIGHT RITUALS wordmark (SVG); HLR monogram, shell with star, star and crest (PNG only) | C3 |
| Ink | Onyx #353535 and Alabaster #fbf7ef primary; Sea Salt, Forest, Fawn secondary; Gilt is foil only (p19) | Site: Forest #17280A, no Onyx. Email: Onyx in 2026 sends, Forest in 2025 and in the flows. Paid: Onyx and white. Logo SVGs: #231f20 | C4 |
| Grounds | The lighter palette colors sit behind text (p19) | Email white #FFFFFF; social blush #F0DFCF; site #F7F4EE; paid Alabaster and blush #F1D6D6. None of the three new grounds is in the book | C4 |
| Type | Saol leads (Display Light and Regular, Standard Regular and Medium); Trade Gothic accents and body, never a large headline (p16 to p18) | Saol and Trade Gothic everywhere; Trade Gothic now leads current social and 2026 email text. 17 font families appear in the live work, among them Instrument Serif and Homemade Apple (social), Miriam Libre (email modules, 353 segments), Futura PT and Avenir (paid), Times New Roman and Inter (social) | C5 |
| CTA | Text link in Saol Standard with a rule arrow; outline block in Trade Gothic caps, +200 (p17, p18) | Email: caps labels ("SHOP NOW" 339, "SHOP" 239) in 2px outlines, square. Site: square buttons with Saol labels (filled Forest, or black outline) | C6 |
| Voice | Eloquent, Refined, Sensual, Real, Uplifting, each with IS and IS NOT (p27 to p31); "6 or 7" on the witchy scale; long copy welcome | Short mantra lines and affirmations; spell and magic language in 108 email lines; health-adjacent lines ("CALM YOUR ANXIETY"; "Protect your energy", 75 paid layers; "In my healing era…") | C2 |
| Taglines | "Timeless jewelry for self and space." and three alts (p32); the lockup says "Sanctuaries of self and space" (p15) | "Where Jewelry Meets Energy Work" (site); "FOR SELF & SPACE" (social, 37); "Embody the force / of the natural world" (email footer, 131); "Fine jewelry for the witch within" (paid) | C7 |
| Email | One layout, as a mobile mockup (p51 to p53) | About 200 full emails; 2026 sends at 700 wide, flows and 2025 at 1200; a module library of about 20 types at 1200, most in 6 variants | C8 |
| Social | Franchises High Spirits, Sanctuaries, Sublime Intervention; an emoji set (p35) | 4:5 feed leads current work (110 of 117 grid frames); 9:16 stories; carousel strips; captions written in layers | |
| Dashes | The book's copy uses em dashes | So does live copy: 73 email lines, 22 social, 9 paid, 68 product titles | C9 |
| Offers | None | Free shipping at $50+ (site bar), $100 (cart drawer), $150 (web redesign); codes LIGHT25 and LIGHT30; "30% off sitewide" | C10 |

## 2. Contradictions (flagged, not resolved)

- **C1 Name.** Decide the full form, short form and caps in copy. Fix the handle typo and the vendor field.
- **C2 Positioning and claims.** Decide which positioning governs voice and claims: the book's or the live one.
- **C3 Marks.** Decide the current roster and its rules, and supply vectors for the PNG-only marks.
- **C4 Color by channel.** Decide which ink and ground are law in each channel, and whether #F0DFCF, #F7F4EE and #F1D6D6 join the palette. The same ruling settles the three blacks (#353535, #231f20, #000000).
- **C5 Faces.** Give each added face a role or retire it. The book names two families.
- **C6 CTA.** One shape for the system: the book's outline caps, email's 2px outline caps, or the site's Saol buttons.
- **C7 Tagline.** One current line, and where each of the others lives.
- **C8 Email width.** Masters at 1200 (2x of 600, our build convention) or 700 (their 2026 sends).
- **C9 Dashes.** Our rule removes them from everything we make, product names included. The client should hear this from us.
- **C10 Offers.** One free shipping threshold. Offers stay merge tokens until it lands.

## 3. Licensing

| Face or asset | Evidence | State |
|---|---|---|
| Saol Display, Saol Standard (Schick Toikka) | Desktop OTF and Saol Display web kits; no license file. The site self-hosts Saol Display and Saol Standard web files | Unconfirmed: flagged on every deliverable |
| Trade Gothic LT Std, desktop (Adobe-vended) | No license file | Unconfirmed |
| Trade Gothic LT W01, web (Monotype) | Pay-As-You-Go EULA: sites the licensee owns, @font-face only, tracking code kept, 250,000 page views unless the invoice says otherwise. No email cover; no tracking request seen on the site | Web only |
| Instrument Serif; Homemade Apple | OFL 1.1; Apache 2.0 (LICENSE files in the folder) | Cleared |
| Miriam Libre, Inter, Kristi, Ingrid Darling, Allison, Arvo, Over the Rainbow | No files on disk; believed to be Google Fonts faces with open licenses | Confirm per face if kept |
| Futura PT, Avenir LT Std, P22 Cezanne Pro, GT Walsheim Pro, Cannu | No license file | Unconfirmed; commercial |
| Times New Roman, Helvetica | System fonts | Likely stand-ins; retire or rule |
| Imagery: 198 files on disk and the Figma Images page | None | Unconfirmed: labelled grey placeholders until rights land; Swipe and Inspiration count as reference |

## 4. Confidentiality

No marking in the book, the inventory sheet or the Figma files. The Figma copies hold internal planning notes (58 lines flagged in the corpora) and founder photography. Default: treat every client file and copy as confidential.

## 5. Channel roster

| Channel | Status | Live formats (frames) | Source |
|---|---|---|---|
| Email | Live; Klaviyo forms on the site | 700 wide (2026 sends) and 1200 wide (flows, modules, 2025); module library of about 20 types | `figma/` Email |
| Organic social (Instagram) | Live | 4:5 at 1080x1350 (grid 110, templates 50, work in progress 205); 9:16 at 1080x1920 (about 525 stories); 1:1 (28, older); carousel strips; highlight covers | `figma/` Organic Social |
| Paid social and display | Live work; Phase 1 scope unconfirmed | 1:1 (182), 9:16 (181), 4:5 (72), 1280x628 (23), 1200x1200 (21), 1280x720 (17), display banners | `figma/` Paid Social |
| Web | Live on Shopify; a product page redesign in Figma | 1440 desktop, 375 mobile | `site/`; `figma/` Website |
| Retail and press, print | In the files; outside Phase 1 | Press kit pages at 1800x1200 | `figma/` |

## 6. Questions, ranked by production-blocking risk

1. **Positioning and claims (C2).** Which positioning governs, and who signs claims. Live copy makes health-adjacent claims ("CALM YOUR ANXIETY"; "soothes anxiety and restores emotional equilibrium"; a send titled "Anxiety Calming Pieces"; "energy medicine"; metals that support "emotional balance"), uses fertility symbolism, and makes sourcing and origin claims ("Handmade in America", "14k recycled solid gold", "ethically-sourced", Westport, CT). The only required language found is the site footer's disclaimer. Blocks the voice contract, the claims ledger and any copy. Owner: HLR.
2. **Fonts.** Licenses for Saol and Trade Gothic (desktop, web, email), and a role or retirement for each added face (C5). Blocks text styles at Step 4 and every shipped asset. Owner: HLR.
3. **Marks.** The current roster and vector masters for the PNG-only marks (C3). Blocks `logo-assets.md` and the mark components. Owner: HLR.
4. **Color by channel (C4) and CTA shape (C6).** Blocks the token proposal for Review 1 and the contrast law. Owner: HLR, ratified by Eddie.
5. **A Shopify products export (CSV).** 101 of 650 variants have no SKU in the public feed. Blocks the product database. Owner: HLR.
6. **Image rights** per folder and for the Figma Images page. Blocks real imagery. Owner: HLR.
7. **Customer quotes in templates** (20 quote-like lines in email, 11 in social): source each in Judge.me before reuse. Blocks customer evidence. Owner: HLR.
8. **Email build width (C8).** Owner: Eddie, at Gate 4.
9. **Tagline (C7), name forms (C1) and offers (C10).** Owner: HLR.
10. **Product names without dashes (C9)** in our copy, for example "The Seeds of Protection Bracelet in Black Tourmaline". Owner: Eddie.
11. **Paid and web**: in Phase 1 scope or not. Both have live work. Owner: Eddie.
12. **Live review dates.** Owner: Eddie.

## 7. Gate 1 calls

**a. Who runs the forge.** Decided 2026-10-17: HLR's team. Step 3 builds a single-brand bundle after a brand-free engine release (the installed 0.4.0 names other registered brands in all 10 skill descriptions and ships another brand's pack additions).

**b. Organic social.**
1. Existing coverage: asset-production's S01 Feed post set (1080x1350 master with 1080x1080 and 1080x1920 siblings) and S02 Story/Reel cover (1080x1920) hold the frames that dominate the live work. Carousels (strips in the grid and templates) and captions (written in the grid's layers) become logged gaps.
2. A new brand-free organic social type: a carousel recipe and an organic caption route, shipped in the same engine release as the scrub in (a).

Default 2: the live grid runs carousels and captions every month, and HLR's team will run it.

**c. Where the library lives.**
1. A new file in the HLR team hub (team 1213133368922004657). HLR owns it from day one; Eddie needs editor access before Gate 3.
2. Highlight-Rituals-Design-Forge. Readable now; it holds the client copies on 9 pages and no styles, variables or components. The library is built there with the copies moved to a separate reference file, so the library file carries only the system; it moves to HLR's hub at handoff.

Default 2, with the copies moved out before Gate 3.
