# Email build: Protection of energy, with Scorpio season

Built 2026-10-23 by Claude from Eddie's request of the same day ("create the brief and make the email on the staging page"). Brief: `brief-protection-of-energy.md`. Route R1 (benefit, the angle Eddie's brief names). Inside it, scene 1 ("the end of a full day") is Claude's recommendation and not yet ratified (`protection-of-energy.slates.json`, `angle_gate.provisional: true`).

## Where it is

- Figma: HLR Library (`Gq3yUbLs6MCRM0nOhjvnIW`), page 04 Staging (7:5), frame 317:2214 "Email: Protection of energy (R1)". It is 1200 wide on the email canvas (HLR / Layout mode email set on the frame). Claude placed it at x 0, y 5600; Eddie moved it to x -1888, y 80 while it was being built.
- Built only from library instances, with no detached layers. In order:
  1. M23 Lockup header (317:2215)
  2. M02 Hero (317:2235)
  3. M16 Two-column text, Plain (317:2249)
  4. M06 Product grid, Align=Center, one row (318:2375)
  5. M04 Text block, Align=Center, Standard, eyebrow on, on the deep ground (317:2281)
  6. M03 Spotlight, Image=Right (317:2287)
  7. M09 Footer with the star, legal line off (317:2299). A slice cannot carry live merge tokens, so the ESP's live footer adds the unsubscribe link and the address.
- Type: `product_spotlight` (type-registry-core.json, ratified). The order follows the brief: the protection story leads, Scorpio season is the secondary block on its own ground, and The Scorpio Crystal Set closes before the footer.

## Changed during the build

- **The bracelets moved from M03 spotlights to the M06 grid.** As two M03 spotlights (WEAR ONE, OR BOTH), the product names broke inside words ("Tourmal/ine", "Protect/ion"). M03 sets names in the locked headline style (94 px in email) in a 338 px column. The grid sets the full names in the title style without a break, under the heading "Wear one, or both". This is logged as a library gap: M03.name was proven for length, not for word width.
- **The set's eyebrow was shortened to FOR SCORPIO** (from FOR SCORPIO SEASON) so it sets on one line in the M03 column.
- **Eddie's live edits stand:**
  - He cut the first sentence of the M16 body.
  - He switched on the hero's script line, which still shows its placeholder ("a script line"). It needs his line, or the option off, before export.
  - He moved the frame.
  The slate carries his body, and every lint was re-run on it.

## Copy (route 1; every string passed copy_lint, fit_check and the brief lint)

| Slot | Copy | Accent word |
|---|---|---|
| Subject | Scorpio season is here. Keep your energy close. | |
| Preheader | Two bracelets in black tourmaline, and a few rituals for the season. | |
| M02.eyebrow | PROTECTION | |
| M02.headline | Keep your energy your own | own |
| M02.script | (placeholder showing: Eddie's call) | |
| E01.label (hero) | SHOP THE BRACELETS | |
| M16.headline | The stone they share | share |
| M16.body | Black tourmaline has long been held as a stone of protection, and both of these bracelets carry it: a quiet reminder, right at your wrist, to leave the rest at the door. (Eddie's edit) | |
| M06.heading | Wear one, or both | |
| E06.name, cards 1 and 2 | The Classic Bracelet in Black Tourmaline; The Seeds of Protection Bracelet in Black Tourmaline (products.json display names) | |
| E02.label, cards 1 and 2 | SHOP (the module's own label) | |
| M04.eyebrow | SCORPIO SEASON | |
| M04.headline | Scorpio season is here | here |
| M04.body | Scorpio season has long been read as a time for depth and turning inward, and a few small rituals make room for it: / An evening with no plans, a candle lit, your phone in another room. / One thing you are ready to let go of, written down, then closed in a notebook. / Black tourmaline kept close, on your wrist or your altar, as a reminder of what is yours to tend. | |
| M03.eyebrow | FOR SCORPIO | |
| M03.name | The Scorpio Crystal Set (products.json) | |
| E02.label (set) | Shop now (the module's own label) | |
| M09 | Nav labels and the HLR-REQ-01 disclaimer as built in the module (read back verbatim) | |

The accent words are bound through their style variables, never set as a raw face. M02 and M16 take `font/style/display-accent` and M04 takes `font/style/headline-accent`: each was read from the instance before its text was set.

## Photos

| Module | Photo | Source and treatment |
|---|---|---|
| M02 Hero | image 8366d8eb (2304 x 1536) | Clear quartz, smoky quartz and black tourmaline casting long shadows on a wall. HLR's own photo from its 2026 Welcome send (originals page: 267:7045, and the PROTECT & GROUND row 267:7110). Crop mode at full height, with the window 10 percent in from the left. The module's 50 percent scrim is kept so the white type reads; the IMAGE label is hidden. |
| M06 card 1 | image 50a2b86c (1800 x 2250) | HLR's packshot of The Classic Bracelet in Black Tourmaline from its September 2026 GET GROUNDED send (originals 228:3425 in 228:3377). Fill on the card's E05 Portrait; placeholder label hidden. |
| M06 card 2 | none | The grey E05 placeholder, labelled IMAGE. No cleared photo of The Seeds of Protection Bracelet is in the library, and this session cannot reach the site's image (the proxy refuses highlightrituals.com, cdn.shopify.com and Figma's asset URLs). Once a packshot is in the file, paste it onto the card's Product image layer. |
| M03 (set) | image 4c68d98a (1800 x 2250) | The photos page frame 27:289 (Zodiac Set, Scorpio), flattened in this file to one JPG at 1800 wide so a single image fill can carry it. It shows two beaded bracelets and five tumbled stones. Fill on M03's E05; placeholder label hidden. |

Eddie cleared the site's product images, the original emails and the Zodiac Sets (DECISIONS 2026-10-23). The two photos taken from HLR's own sends are for Donnie to confirm in a send. Layer names on the originals page do not describe their images (the "altar kit" layers hold moss, swimmers and roses), so every photo was confirmed by looking at it.

The spotlights keep the masters' own E05 elements with fills, rather than the category elements: E12's product picker carries neither bracelet photo, and E13 has no picker. Adding these photos to the pickers is a library change, offered to Eddie, not made.

## Slices and alt text

Each of the seven module instances carries PNG 1x and @2x export settings, ready to export from the app once the script line is resolved and the Seeds packshot is in. Nothing is exported yet. Alt text says what the slice says first, then what it shows.

| Slice | Alt text |
|---|---|
| 1 Header | High Light Rituals |
| 2 Hero | Protection. Keep your energy your own. Shop the bracelets. A clear quartz point, a smoky quartz point and a piece of black tourmaline on a stone wall, their shadows long in low light. (Add the script line's words if one ships.) |
| 3 Text | The stone they share. Black tourmaline has long been held as a stone of protection, and both of these bracelets carry it: a quiet reminder, right at your wrist, to leave the rest at the door. |
| 4 Grid | Wear one, or both. The Classic Bracelet in Black Tourmaline, a double strand of black beads on a pale ground. The Seeds of Protection Bracelet in Black Tourmaline. Shop. (Describe the Seeds photo once it is in.) |
| 5 Scorpio | Scorpio season. Scorpio season is here. Scorpio season has long been read as a time for depth and turning inward, and a few small rituals make room for it: an evening with no plans, a candle lit, your phone in another room; one thing you are ready to let go of, written down, then closed in a notebook; black tourmaline kept close, on your wrist or your altar, as a reminder of what is yours to tend. |
| 6 Set | For Scorpio. The Scorpio Crystal Set. Shop now. Two beaded bracelets and five tumbled stones laid out on a pale ground. |
| 7 Footer | Shop Now. The Ritualist. Follow Us. High Light Rituals. The footer disclaimer in full (HLR-REQ-01). The ESP's live footer adds the unsubscribe link and the postal address below the slices. |

Each card in slice 4 and the set in slice 6 link to their own product pages. The hero's SHOP THE BRACELETS needs a destination (both bracelets, or a protection collection if HLR has one); that is a question for HLR's ESP setup.

## Checks

- Faces: all eight of HLR's faces load through the connector (Saol Display Regular, Regular Italic, Light and Light Italic; Saol Standard Regular; Trade Gothic LT Std Regular and Bold; Homemade Apple), and every slot was set on them.
- Canvas (`checks/canvas-check.json`): 25 of 25 nodes on the email canvas, 0 findings. The 7 warnings are the module instances reporting their masters' email mode as their own, which is expected for nested masters. The check ran against a variable plan rebuilt from tokens.json in a scratch copy of the pack (`tokens_build.js figma-plan`); nothing in the pack changed.
- Slots: every visible slot was read back by stamp after the build and matches the slate, except the two live edits above.
- Contrast: type on the deep ground uses certified pairs (Gate 4). The hero's white type sits on the photo under the 50 percent scrim; the strictness map has on-photo text judged by eye, and it reads clearly at 1200.
- Copy lints: brief_lint PASS, copy_lint PASS, fit_check PASS, voice_lint advisory (engine default model, no brand model fitted).
- Standing flags:
  - The fonts are not yet licensed (Brand Review v2 Q2).
  - The ledger is a test seed, so no line is cleared for production.
  - The footer star is HLR's own vector, [observed] until HLR confirms it.
