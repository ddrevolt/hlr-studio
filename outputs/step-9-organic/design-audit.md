# Organic design audit, 2026-11-01

Scope: S01 Feed Post, S03 Carousel Set and S04 Story Set against the organic originals on the library `originals` page (sections 349:6817, 349:124710, 349:127373, 349:128295). Evidence: the four S01 side-by-side renders (S-PHOTO, S-PHOTOTEXT, S-TEXT, S-OFFER), 7 renders of original families, a type-size census of every visible text layer in the 4x5 and 9x16 frames, and the frame census in organic-deep-dive.md. S03 and S04 were checked in isolation and by data; they have no side-by-side board yet.

## Verdict
Structure and governance exceed the originals. Type scale and range of structures fall short. Fix the scale first: it affects every organic master.

## Where we exceed [observed]
- Every fill, space and size is variable-bound; the originals hard-code hex and use 122 misnamed frames, hidden remnants and off-book faces (Inter Italic 50 layers, Times 6, P22 Cezanne Pro 5 story frames, Over the Rainbow 1).
- Slots stamped, budgets measured, structure survives longer copy; the originals break (doubled handle, eyebrow off the left edge, invisible copy, empty frames).
- One handle element (E16) and one star, never retyped.

## Where we fall short
| # | Finding | Evidence | Severity |
|---|---|---|---|
| 1 | Our display sizes are larger than the originals set copy. Lead text in 4x5 originals is mostly 30 to 79 px (Trade Gothic 30-44: 56 frames, serif 45-59: 58, 60-79: 24+) with 80 to 109 px in 19 (Saol Display 11, Instrument Serif 8). Ours: Headline on photo 96, Text tile 127, Offer 170. In 9x16 originals lead Saol is 60-79 px (86 frames) and 80-109 (69). Ours: 96 and 127. | type census, 4x5 and 9x16 | high |
| 2 | Long statements do not fit. The 190 character affirmation (349:6841) needs a 54 px quote scale; our Text tile caps at 54 characters at 127 px. | S-TEXT board | high |
| 3 | Placement: originals centre or set the headline low (wfyj, offer); S01 puts it at the top. | S-PHOTOTEXT and S-OFFER boards | medium |
| 4 | S01 exists only at 4x5. Originals include 1x1 (79 frames, 11 Press Kit) and 9x16 text and photo posts (24 "Instagram story" frames and the story sets). | frame census | medium |
| 5 | No grid cover (monthly energy 3x3, zodiac 3x4, birthstone). | 349:128048, 349:123303 | medium |
| 6 | No callouts on a photo (Field Notes annotated product); S03 Inner lists items but draws no leaders. | patterns S-ANNOT | medium |
| 7 | Caps serif headline (Instrument Serif caps, wfyj) has no role; Saol Display is the book face and carries it only in sentence case. | 349:125609 | low, needs Donnie |
| 8 | Highlight covers 1507x1468 (6), press "as seen in" logo row, strips: no master. | census | low |

## Proposed additions, numbered, default first
1. Scale property on the text masters (S01 Text tile, Headline on photo; S04 Text, Inset): Quote 54 px (title), Statement 72 px (headline), Display (current 96 to 127). Uses existing variables; default Statement for posts, Quote for long copy. Fixes findings 1 and 2.
2. Placement property on S01 Headline on photo, S01 Offer tile and S03 Cover: Top, Low centred, Centred. Default add Low centred and Centred.
3. Ratio property on S01 (1x1, 4x5, 9x16) and keep S03 4x5, S04 9x16. Default 1x1 and 9x16 for Photo, Headline on photo and Text tile only.
4. S05 Grid cover, one component with Rows and Columns on E04 tiles and a script title; default build after 1 to 3.
5. S03 Inner variant Callouts: numbered circles and hairline leaders on a photo, mirrors P03. Default build.
6. Caps headline: keep Saol with text case, no new face, and let Donnie rule on Instrument Serif caps. Default no new role.
7. Defer: Highlight covers (no icon supplied), press logo row (rights), strips (retired; S03 gutter replaces).

## Not yet checked
S03 and S04 against their originals side by side; none of the 2x tests against real copy; no contrast read on the new masters beyond the S01 pairs.
