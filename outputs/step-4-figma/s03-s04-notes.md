# S03 Carousel Set and S04 Story Set: build notes (2026-11-01)

Built in library Gq3yUbLs6MCRM0nOhjvnIW, page 02 Modules, section "Social / S03 and S04" 356:1857, on Eddie's go. Every max_chars in the pack stays null; the measured numbers are proposals.

## What exists
- S03 Carousel Set 356:1858, 1080x1350: Panel=Cover 356:1787 (photo, scrim, eyebrow, headline, subline, script, cue off), Panel=Inner 356:1804 (eyebrow, rule, image, headline, body off, up to 4 items each a Saol name over a caps line), Panel=End 356:1837 (star, image, headline, body off, cue off). Toggles: Show subline, script, cue, body, image, item 1 to 4.
- S04 Story Set 357:1882, 1080x1920: Structure=Text 357:1799, Inset 357:1816 (mat image, headline, body, attribution), Full bleed 357:1837 (photo, scrim, eyebrow, headline, item labels, body, script off), Split 357:1857 (photo 1094 px over a ground panel, headline, item labels, no handle). Toggles: Show body, script, attribution, item 1 to 4.
- Slots stamped hlr/slot with S03.* and S04.* ids; no S01 stamps left. Images are E04 instances (labelled placeholders). Handle is E16. No CTA drawn. No variable created; fills, spacing and sizes bind to the S01 variables (figma.yaml s01_bindings). Panel and structure variants carry the social Layout mode.

## Checks
- Every text layer carries a text style (0 unstyled). Horizontal: all text between x 120 and 960 on S03. 9x16 top and bottom padding is 250 px, unbound (no variable holds the organic story band; scope question 2, owner Eddie).
- Screenshots: S03 three panels and S04 four structures checked. S03 Inner with four items needs the image at 200 px high to clear the handle; set that way.

## Flex probe: measured budgets (proposed, not applied)
Temp instances, every toggle on, text grown word by word from a wide-word corpus until the line cap or the handle clearance (16 px) failed. Caps: headline 3 (S04 Text 4), body 5, every other slot 1 line. One-line slots all stop at 24 characters (two wide words), so 24 is a floor, not a tuned budget.

| Slot | Cover | Inner | End | Text | Inset | Full bleed | Split |
|---|---|---|---|---|---|---|---|
| eyebrow, subline, script, cue, name, line, label, attribution | 24 | 24 | 24 | 24 | 24 | 24 | 24 |
| headline | 40 | 40 | 24 | 50 | 40 | 40 | 40 |
| body | none | 211 | 211 | none | 211 | 211 | none |

Not run: the 2x check against real copy (no slot has real client copy yet).

## [derived] for Donnie
1. Inner and Inset headlines at display/s, End and S04 Text at display/m; item names at the title style with a caps eyebrow line.
2. S04 padding 250 top and bottom (organic band), 120 sides.
3. Split: photo 57 percent of the height, no handle, no eyebrow.
4. S03 Cover: headline top, subline and script low, scrim on.
5. Inner image 200 px so four items clear the handle.

## Open
- Eddie: the 9x16 story band (250 px); apply the measured budgets; S01 long-quote option; S05 grid cover (organic-deep-dive.md); examples row for S03 and S04 not built yet; caption layer for S03 and S04 not built.
- Donnie: the list above, plus the off-book items in organic-deep-dive.md (corner botanicals, Inter Italic, Times).
