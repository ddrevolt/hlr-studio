# Demo email build: The made-to-order pendants (Review 2)

Built 2026-10-23 by Claude under Eddie's overnight delegation. Provisional: the angle (R1, scene 1) is the recommendation, not a human pick (`made-to-order-pendants.slates.json`, `angle_gate.picked_by: recommended`).

## Where it is

- Figma: HLR Library (`Gq3yUbLs6MCRM0nOhjvnIW`), page 04 Staging (7:5), frame 63:354, 1200 wide, on the email canvas (HLR / Layout mode email set on the frame).
- Built from library instances only, no detached layers: M01 Header (63:355), M02 Hero with Space below on (63:373), M16 Two-column text, Plain (63:383), M06 Product grid (63:387), M05 Image, Full bleed (63:426), M14 CTA (63:430), M09 Footer with the legal line off (63:434): a slice cannot carry live merge tokens, so the ESP's live footer adds the unsubscribe link and the address.
- Revised after the fresh-context review, round 1 (`../review-email-batch-r1.md`): white module grounds (C4), the hero reframed, the packshots cropped to the piece, the legal line off, and the copy varied where "choose" ran six times.
- Order: the product_listing type's observed sequence (template 2:683: H1>M17>M07>M15>F1) as M01, M02, M16, M06, M09, plus the cleared editorial band (M05) and a closing CTA (M14) before the footer.
- The same skeleton without copy or photos is T03 Product listing on 03 Templates (64:354), with two M06 grids for HLR's eight-card listing.

## Copy (R1, from the slate; every string through copy_lint PASS, fit_check PASS)

| Slot | Copy | Accent word |
|---|---|---|
| M02.eyebrow | MADE TO ORDER | |
| M02.headline | Made after you choose it | choose |
| E01.label (hero) | CHOOSE YOURS | |
| M16.headline | Nothing here waits on a shelf | shelf |
| M16.body | Each of these four pendants is made to order, so the making begins only once you have picked one. Take your time with the four designs below, and find the one you mean to wear. | |
| M06.heading | The four designs | |
| E06.name, cards 1 to 4 | The Element Pendant; The Sacred Pendant; The Genesis Pendant; The Seeker Pendant (products.json display names) | |
| E02.label, cards 1 to 4 | SHOP (the module's own label) | |
| E01.label (closing) | SHOP THE PENDANTS | |
| M09 | Nav labels and the HLR-REQ-01 disclaimer as built in the module; the legal line off (live-text sends only) | |

Subject: Four pendants, made to order. Preheader: The Element, Sacred, Genesis, and Seeker pendants, and where each one begins.

## Photos (cleared by Eddie, DECISIONS 2026-10-23; fills reuse the photos page's image hashes in the same file)

| Module | Photo | Treatment |
|---|---|---|
| M02 Hero | 27:137, HLR Editorial (HighLight8717) | Space below on (space/40 under the CTA); crop mode, full width, the window placed so the pendant sits whole in the space below the CTA, with clear room above and below. The chain passes behind the outline CTA, by choice. The optional 50 percent scrim is off: the photo's ground is already dark and the scrim buried the pendant. The module's IMAGE label is hidden on the instance. |
| M06 cards 1 to 4 | 27:174 The Element Pendant; 27:210 The Sacred Pendant; 27:206 The Genesis Pendant; 27:191 The Seeker Pendant | E05 Portrait, crop mode at one zoom (a window 30 percent of the image tall), each centered on its pendant; the placeholder label hidden. The grounds differ (white, linen, pale grey) because they are HLR's own product shots |
| M05 band | 27:136, HLR Editorial (HighLight8679) | Full bleed, fill; the placeholder label hidden |

## Slices and alt text

Set to export as image slices at 1200, one slice per module: each of the seven carries PNG 1x and @2x export settings in Figma, ready to export from the app (nothing is exported yet). Alt text on every slice (asset-types.md, Delivery). Alt text says what the slice says first, then what it shows.

| Slice | Alt text |
|---|---|
| 1 Header | High Light Rituals |
| 2 Hero | Made to order. Made after you choose it. Choose yours. A hand lifts two fine chains; a pendant hangs below, lit warm against a dark ground. |
| 3 Text | Nothing here waits on a shelf. Each of these four pendants is made to order, so the making begins only once you have picked one. Take your time with the four designs below, and find the one you mean to wear. |
| 4 Grid | The four designs: The Element Pendant, The Sacred Pendant, The Genesis Pendant, and The Seeker Pendant, each shown close on its chain. Shop. |
| 5 Band | A hand in a lace sleeve holds a pendant on a fine chain over a table of pomegranates, grapes, and clear crystal points. |
| 6 CTA | Shop the pendants |
| 7 Footer | Shop Now. The Ritualist. Follow Us. High Light Rituals. The footer disclaimer in full (HLR-REQ-01). The ESP's live footer adds the unsubscribe link and the postal address below the slices. |

Each card in slice 4 links to its own product page; the ESP's image map or four separate card slices carry the four links (HLR's ESP setup, Review 2 question).

## Checks

- Library checks behind it: every module and element passes structure lint, flex at 2x or better, canvas and face checks (`outputs/step-4-figma/` check notes; slot map regenerated 2026-10-23).
- The build stand-ins render the accent in Instrument Serif Italic; server screenshots show a fallback sans for that one face (a plain, unbound Instrument Serif Italic node renders the same way), so the italic is judged in the Figma app, not in a screenshot.
- Standing flags: fonts unlicensed (stand-ins in the file); the ledger is a test seed, so no line is cleared for production; the four-point star in the footer waits for its vector (HLR).
