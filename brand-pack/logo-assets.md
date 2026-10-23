# HLR logo assets

Pack role `logo_assets`. Lane B, Pack v0, 2026-10-18. Ratified 2026-10-22 by Eddie (Gate 2 package call 11). Gate 1 C3 (Eddie, 2026-10-17) set the roster; HLR confirms it and supplies the missing vectors at Review 1.

Tags: [documented] the brand book `061022_HighLight_BrandBook_DS.pdf` (cited by PDF page) or the client; [observed] the client's files and live work; [derived] our proposal, binding once Eddie ratifies it.

Paths are relative to the brand home `~/Documents/claude-cowork/highlight-brandbook/`. Client originals are read-only. Fills were read from the SVG source, geometry compared by hashing path data, and every match below was checked by eye on 2026-10-18.

## Rules

1. A mark is an asset, never type: placed from its file or its Figma component, never redrawn, re-set in a font or rebuilt from letterforms. A typeset lockup in live work (the email header "HIGH LIGHT" over an italic "rituals", E-H1, 6 of 28 sends) is type, not a mark, and retires. [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) engine design-system rule; playbook section 4
2. One Figma component per mark, named `Marks/<Mark>`. Its fill binds to `component.mark.fill`, or `component.mark.fill-on-photo` over photography, so the colourway follows the ground mode. The source file's own fill is ignored. [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) Gate 3 call 8 a
3. Strip any full-canvas background rect before import. None of the current SVGs carries one. [observed] 2026-10-18
4. The star is the one decorative device: at most one per surface. [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) from Gate 1 C3
5. A mark that exists only as PNG is not placed in a master until HLR supplies its vector. The master carries a labelled placeholder in its place. Two marks are never combined by eye into a lockup HLR has not drawn. [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11) playbook section 4 (real SVG components)
6. Clear space and minimum sizes: none documented for the current roster; the book's size rules (p13) cover the 2022 HIGH LIGHT logotype. Gap, owner HLR; a proposal comes at Gate 4. [observed absence]

## Current roster (Gate 1 C3)

| Mark | Role | Vector on disk | Other files | State |
|---|---|---|---|---|
| Wordmark, one line, HIGH LIGHT RITUALS | Primary | `HLR Logo & Marks/SVG LOGOS/HLR-BLACK LOGO.svg`, `HLR-DARK GREEN-LOGO.svg`, `HLR-WHITE-LOGO.svg` (2024-03-07) | `HLR-Logo_FNL.ai` (2024-01-05, source, not opened); `HLR-Logo_FNL-02.png` (3111x299); `HLR full logo_black.png` and `_white.png` (4688x1576, with clear space, 2024-07-29); `logo.pdf` (Illustrator, 2024-06-21, with clear space); `Archive/HLR-Logo_FNL-02.svg` (2024-10-07) | Ready for Step 4 |
| Monogram, HLR letters with the tall L | Small mark | `HLR Logo & Marks/HLR-Jewelry Logo_Monogram.svg` (2024-09-11) | `HLR-Jewelry Logo_Monogram.jpg`; the same geometry as `Archive/HLR-Logo_FNL-03.svg` (2024-01-08) | Letters ready for Step 4 |
| Monogram with the star above | Social avatar | none | `Logo Marks_Black/HLR_black.png` (966x1214), `Logo Marks_Forest Green/HLR_green.png` (741x930), `Logo Marks_White/HLR_white.png` (966x1214), all 2024-02-19; `Social Avatar.png` (3375x3375, 2024-04-12) | Vector requested from HLR |
| Star, four long points and four short | The one decorative device | none current | `Logo Marks_*/Star_*.png` (507x567, 2024-02-19) | Vector requested from HLR |
| Crest | Retired | 2022 only, `Archive/High Light - Crest*` | `Logo Marks_*/Crest_*.png` (1671x1856, 2024-02-19) | Not placed |
| Shell with a star inside | Packaging only | none | `Logo Marks_*/Shell_*.png` (1467x1346, 2024-02-19) | Not placed in digital work |
| Stacked lockup, HIGH / LIGHT / RITUALS under the star | Not in C3's roster | none; `Archive/HLR-Logo_FNL-01.svg` (2024-01-08) is a two-line HIGH LIGHT / RITUALS without the star | `Logo Marks_*/Logo_stacked_*.png` (1554x1605; green 1268x1309; 2024-02-19) | Not placed until ruled |

### Wordmark [observed; role from C3]

- The three SVGs share one geometry: viewBox 746.48 x 71.61, 16 paths, identical path data. Only the fill differs: #231f20, #17280a, #fff.
- #17280a is Forest exactly. #231f20 is not Onyx #353535, the C4 ink. Rule 2 settles it: the component's fill binds to the ink token, so the three blacks (#231f20 here, #353535 Onyx, #000000 in live work) become one.
- `Archive/HLR-Logo_FNL-02.svg` has the same viewBox and path count with differently written path data. Not compared by eye; the SVG LOGOS set is the source.
- Live placements: the email wordmark bar (11 of 28 sends), the paid sign-off at the bottom centre (500 to 600 px wide on 1080), the 2026 paid masthead at about 90 percent width (2:60736). pattern-review 1.4

### Monogram [observed]

- `HLR-Jewelry Logo_Monogram.svg`: viewBox 176.54 x 148.21, 3 paths, no fill attribute. Its path data is identical to `Archive/HLR-Logo_FNL-03.svg`.
- By eye its letterforms match the HLR in `Logo Marks_*/HLR_*.png`. The PNGs add a star above the letters; the SVG does not carry it. This closes the Gate 3 check ("needs a visual match").
- `Social Avatar.png` is the lockup with the star, in a dark green ink on a cream ground. Colours not sampled.
- Live placements: 63 in press decks, with a sparkle above it (2:33202). pattern-review 1.4

### Star [observed]

- The current drawing (`Star_*.png`) has four long points and four short diagonal points. DECISIONS (C3) calls it the four-point star.
- No current vector exists on disk. The 2022 `Archive/High Light - Star` and `Star 2` SVGs are different drawings: an irregular sparkle and a rayed outline star.
- A draft vector sits in the reference file `LYyYXPDUHVoAABh865EvMI`, Components, DRAFT 01 (2:31993; the star at 2:32034, described by the second pass as an eight-point star). It is a draft source, not a master. addendum item 2
- Live placements: the email nav footer (2:1062), story tops and feed corners (2:62552, 2:180130), display cards (2:35604), icons (2:31684). pattern-review 1.4

### Crest, shell and stacked lockup [observed; dispositions from C3]

- The crest PNG is an ornate shield with HIGH LIGHT RITUALS and a star. It retires; the email footers that carry it (2:192035, 2:194481) rebuild without it.
- The shell PNG is a scallop outline with a star inside. It stays on packaging (outside Phase 1). Draft vectors of the shell and its ribs sit in the reference file (Components 2:31994, 2:32016).
- The stacked lockup is not in C3's roster and has no vector. Question for HLR at Review 1. Default: not used; the one-line wordmark covers every Phase 1 placement.

## The book's system, 2022 [documented]

p13: the logotype "HIGH LIGHT" in three cuts by size (large formats over 6 inches wide; the standard digital cut; a cut for small sizes). p14: the mark in three versions, for constricted spaces (avatar, favicon, sticker, wax seal); beside the logotype only the version without "HL". p15: the lockup of logotype, mark and tagline at fixed space and scale. The book predates the 2023 rename to High Light Rituals; C3 replaces this system in digital work with the live roster.

## Book-era files in `Archive/` [observed]

- `High Light - Star`, `Star 2`, `Monogram`, `Monogram and Star`, `Wordmark and Star`, `Crest`, `Crest - Blank`, `Crest - Monogram`, `Crest - Stars`: each in AI, EPS, JPG, PDF, PNG and SVG, in six colourways. Also `HL Logo White.png` and `Ecomm Shipper/` (mailer artwork, 15.7x11).
- Gate 3 call 8 a: they stay out of the library unless HLR rules them current.
- Colourway fills: 1 #353535, 2 #faf8f2, 3 #e0e3e5, 4 #1f2918, 5 #baada3, 6 no fill attribute; some duplicates carry #f9f7f1, #dfe2e4 and #b9aca2. Three differ from the book's own hexes (p19): #faf8f2 against Alabaster #fbf7ef, #1f2918 against Forest #17280a, #baada3 against Fawn #beada3. Flagged, not resolved; the tokens carry the p19 values.

## Gaps

| Gap | Owner | Blocks |
|---|---|---|
| Vector of the current star | HLR | the star device in every master |
| Vector of the monogram lockup with the star | HLR | the avatar lockup (the monogram letters are ready) |
| Clear space and minimum sizes for the current roster | HLR; proposal at Gate 4 | placement rules in elements and modules |
| Whether the stacked lockup is current, and its vector | HLR | nothing in Phase 1 by default |
| Whether any 2022 archive vector is current | HLR | nothing (out by default) |
| The shell on packaging | HLR | nothing in Phase 1 |
