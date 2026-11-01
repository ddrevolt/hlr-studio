# Paid masters P01 to P09: build notes (2026-11-01)

Eddie's go, 2026-11-01: build out paid social the way S01 was done, no review stop until assets are fully built. Library Gq3yUbLs6MCRM0nOhjvnIW.

## What exists

- Section "Paid" on 02 Modules (341:466): nine component sets, 67 variants, a License notice under each set.
  P01 Brand Line 341:622 (6), P02 Product Hero 341:830 (6), P03 Annotated 342:1882 (24), P04 Quote 342:2148 (9), P05 Mantra 341:1002 (6), P06 Offer 343:1666 (6), P07 Meaning 343:1923 (6), P08 Birthstone Grid 343:2228 (3), P09 End Frame 341:1029 (1).
- Properties per slotmap-paid.yaml: Ratio (1x1, 4x5, 9x16) with Style (P01 Line or Masthead; P02 Cut-out or Inset; P03 On ground or On model, with Callouts 1 to 4; P04 Press, Review or DM; P06 Offer or Gift with purchase; P07 Card or List), Ground (P05 Photo or Flat), none (P08), 9x16 only (P09). Boolean Show properties on optional slots.
- Slots stamped hlr/slot with P## ids on every text layer; image layers stamped P##.image. P08 tiles are an element repeat, not slots.
- Placed, never redrawn: Marks/Wordmark 28:28 (540 wide, observed 500 to 600), Marks/Star 200:161, Elements/E03 Rule 39:117, Elements/E04 Image 39:119 (Full bleed).
- 04 Staging, x 11000: nine comparison sections (346:3722 P01, 346:3886 P02, 346:4101 P03, 346:4361 P04, 346:4634 P05, 346:4813 P06, 346:5031 P07, 346:5291 P08, 346:5603 P09) and "Paid examples" 347:5871 (46 instances in 16 rows).

## Conventions

- Existing variables only, none created. Social canvas mode on every root. Side padding space/social-margin (64). Text styles by name (display/m, display/s, display/l, headline, title, body, quote, eyebrow, label, fine).
- Ground modes: Alabaster default; Forest through the Semantic deep mode (P05 Flat, P06 Gift with purchase); DM on warm.
- No CTA, no handle. 9x16: a labelled provisional guide ("Decor / Guide provisional keep-clear") marks the organic band (250 px top and bottom). It is not the paid zone: placement-specs.json is all null (item paid-specs, owner Eddie). Hide the guide before export.
- Licence flag raised on every set (Saol Display, Saol Standard, Trade Gothic LT Std: no license file).

## Checks

- Audit over all 67 variants: no text outside the 64 px side margin; on 9x16 no text outside the provisional band; every text layer has a text style and a bound fill; no content overflow. P08 1x1 tile images are chip height (40) by design.
- Screenshots: every set at all variants except P03, where 24 variants were audited and 1 to 3 representative frames were viewed.
- Contrast: copy on photography is judged by eye on the real image (token-model rule 3); the master grounds are grey placeholders with the scrim, white ink. Not a pass for any real photo.

## Flex probe, tightest variants at 1080x1080, all toggles on, wide-word corpus (proposals, every max_chars stays null)

Ceiling = most characters before the canvas or a fill region overflows; 400 = probe cap reached, not a bound.

| Slot | Measured ceiling |
|---|---|
| P01.headline | Line 67, Masthead 128 |
| P01.body | at least 400 |
| P02.eyebrow / name / subline / side_label / offer | Cut-out 345 / 252 / 141 / 175 / 162; Inset 316 / 224 / 125 / 154 / 162 |
| P03.title / subline / calloutN.name / calloutN.line | On ground, 4 callouts: 57 / 66 / 86 / 66; On model, 2 callouts: 162 / 316 / 220 / 316 |
| P04.quote | Press 229, DM 282 |
| P04.reviewN.quote | 162 each (two reviews) |
| P04.attribution | at least 400 |
| P05.line | 78 |
| P06.eyebrow / offer / headline / sideN.label / subline / terms | Offer 223 / 23 / 111 / 112 / 223 / 400; Gift 191 / 31 / 111 / 101 / 191 / 373 |
| P07 Card headline / item1.name / item1.line | 184 / 113 / at least 400 |
| P07 List headline / label / name | 57 / 61 / 47 |
| P09.line (9x16) | 390 |

2x check (min_flex_multiple 2) against the client's own lines as baselines: P06.offer "30% off sitewide" (16) needs 32, measured 23 on the Offer style: fails. P01.headline "Fine jewelry for the witchy ones" (32) needs 64, measured 67: passes by 3. P05.line "In my healing era" (17) needs 34, measured 78: passes. Other slots have no baseline in the pack (every budget is null); the paid writer's first ad set supplies them.

## [derived] for Donnie

- Ground per style (P01 Masthead flat Alabaster, P05 Flat Forest, P06 Gift on Forest, P04 DM on warm).
- Type step per role: P01 Line display/m, Masthead display/s; P02 name title at 1x1 and display/s above; P06 offer display/l (Offer) and display/m (Gift); P03 callout name title up to two callouts, body for three and four; P04 Press headline, DM title, Review quote; P05 display/m; P07 Card name display/s, List name title; P08 labels 32.
- 64 px side padding; 250 px top and bottom on 9x16 is unbound (no variable holds 250). Proposal for Donnie: a layout value "space/social-story-band" 250 [derived], only after Eddie confirms the paid 9:16 zone.
- Wordmark 540 px at the foot; star above the line on P04 and P05.
- P03 callouts are rows with a short hairline, not leaders to the piece.
- P04 DM bubble is a hairline box: no radius token exists. Press has no publication-logo slot.
- P07 List holds eight pairs in two columns at every ratio; P08 1x1 is 3 by 4 with chip images, 4x5 and 9x16 are 3 by 4 with larger images.
- E04 Full bleed is the image element on every master (its centred IMAGE chip cannot be moved on an instance), so the P03 On model chip sits behind callouts until a photo replaces it.

## Open

- 9x16 keep-clear numbers (item paid-specs, Eddie).
- Originals could not be pasted into the comparison board: Figma asset downloads from the client file return 403 from the cloud shell and from the Mac. The board references each original by node id and quotes its observed structure. Eddie: PNG exports of the listed nodes in the folder let them be placed.
- No cleared photo placed in the examples; no sourced press line, review or DM text is on file.
- P10 and P11 unbuilt; see expansion.md.
