# S01 Feed Post: build notes (2026-11-01)

Status: built in library Gq3yUbLs6MCRM0nOhjvnIW, page 02 Modules, on Eddie's go (all defaults). S01 only. Stop here for Eddie's review before S03 and S04. Every max_chars in the pack stays null; the measured budgets below are proposals.

## Sources read, in order

1. PROGRESSION.md; DECISIONS.md newest entry (2026-10-23) and LEARNINGS.md newest entries (2026-10-24, 2026-10-23).
2. outputs/step-4-figma/social-design-scope.md, from PR #9 (branch eddie/social-design-scope on ddrevolt/hlr-studio); it is not on the Mac.
3. brand-pack/figma.yaml; brand-pack/slotmap-social.yaml (module S01).
4. brand-pack/tokens.json, web/tokens.css, module-library.json, logo-assets.md; brand-context.md Imagery line; token-model.md contrast law.
5. outputs/step-1-review/patterns/patterns-social.md: S-PHOTO, S-PHOTOTEXT, S-TEXT, S-OFFER.
6. Engine reference social-copy/references/organic-specs.json (grid crop: 4x5 visible 1012 x 1350, about 34 px a side).
7. Client file LYyYXPDUHVoAABh865EvMI, read only: nodes 2:181774, 2:181982, 2:181328, 2:181188 (metadata for all four, screenshot of 2:181982).
8. Library: variables (4 collections), 15 text styles, 02 Modules (M02 Hero for conventions), 01 Elements (E01, E03, E04, E15, marks).

## What exists now

- Section "Social" 334:454 on 02 Modules (y 26070, below "Order and flow pieces"), on the email canvas like its neighbours.
- Component set "Social/S01 Feed Post" 334:502, 1080 x 1350, social canvas set on each variant root. Property Structure: Photo 334:455, Headline on photo 334:459, Text tile 334:474, Offer tile 334:491. Booleans: Show eyebrow, Show body, Show script (off), Show cue, Show rule, Show star, Show scrim.
- "Elements/E16 Handle" 331:459 on 01 Elements (Marks section): Surface=Ground 331:455, Surface=Photo 331:457. The handle @HIGHLIGHTRITUALS in caps [observed], fine style, an element, never a slot.
- Slots stamped hlr/slot: S01.eyebrow, headline, body, script, cue, image on the variants that carry them; S01.caption 334:505 is a layer beside the set, never exported.
- Placed from library components, never redrawn: E04 Image (every image, labelled grey placeholder), E03 Rule, E15 Star (Text tile only), E16 Handle. Wordmark and monogram are not placed (no S01 reference carries them).
- No variable created. Fills, type, padding and gaps bind to existing variables (figma.yaml s01_bindings). Text styles: display/s, display/m, display/l, eyebrow, body, script, fine. No CTA box.
- Text tile ground is set by overriding the Semantic mode on the instance (light, warm, deep, night); checked on all four.

## Structures

| Structure | Pattern | Build |
|---|---|---|
| Photo | S-PHOTO | full-bleed E04 placeholder, no text, no handle |
| Headline on photo | S-PHOTOTEXT | E04, 50 percent scrim (toggle), eyebrow and display/s headline top, body and optional script lower, handle foot |
| Text tile | S-TEXT | flat ground, star, eyebrow, rule, centred display/m headline, body, cue, handle |
| Offer tile | S-OFFER | E04, scrim, eyebrow top, display/l italic offer line in the lower third (clear of the centred IMAGE chip), handle foot |

## Checks (2026-11-01)

- Structure: every text, rectangle and frame binding audited; 0 unbound after one fix (Offer headline fontSize). 4 variants, 8 component properties, slots stamped.
- Safe area: every visible text, handle, star and rule sits between x 120 and 960 on all variants, inside 98 to 982 (34 px crop plus 64 px margin). 0 outside.
- Overflow: 0 slots overflow at their measured budgets; no temp nodes left.
- Contrast: Text tile pairs, text/primary on background/default: light 11.48, warm 5.66, deep 14.62, night 11.48 (all pass 4.5). White on the 50 percent scrim over the grey placeholder 5.23; worst case over a pure white photo 3.98. Copy on photography is judged by eye on the real image at review (token-model rule 3), so the photo numbers are information, not a certified pair.
- Screenshots: all four structures, and the Text tile on four grounds, checked.

## Flex probe: measured budgets (proposed, not applied)

Probe: temp instance of each structure with every toggle on (script on in Headline on photo), text grown word by word from a wide-word corpus until the line cap or the content frame overflowed. Line caps: eyebrow, script, cue 1; headline 3 (Offer line 2); body 5. Canvas 1080 x 1350, social mode, text width 840.

| Slot | Headline on photo | Text tile | Offer tile | Proposed max_chars |
|---|---|---|---|---|
| S01.eyebrow | 26 | 26 | 26 | 26 |
| S01.headline | 63 | 54 | 21 | 54 (Offer line 21, see below) |
| S01.body | 243 | 243 | none | 243 |
| S01.script | 27 | none | none | 27 |
| S01.cue | none | 33 | none | 33 |

2x check (placeholder length doubled): all pass except Text tile headline (30 characters, max 54, 60 needed) and the Offer line (14, max 21, 28 needed). Word breaks: Protection, Rhodochrosite and Phosphosiderite fit one line at display/s and display/m; the Offer line at display/l breaks inside Rhodochrosite and Phosphosiderite.

Options for the two failures, default first: (1) accept the measured budgets and say so in the slot (the offer is a short merge token); (2) give the Offer tile its own slot S01.offer at 21 and keep S01.headline at 54; (3) drop the Offer line to display/m for about 1.5x the characters.

## [derived] for Donnie

1. Type step per structure: Headline on photo display/s (96), Text tile display/m (127), Offer tile display/l (170), the offer line italic throughout.
2. Side inset space/30 (120) for text on all structures [observed 120 in 2:181328]; it clears the 34 px crop [derived, 3:4 arithmetic] plus space/social-margin 64 [documented].
3. Handle sits space/8 (32) above the foot; the observed value is 28, not on the scale. Handle in caps [observed].
4. Scrim on by default on the two photo-text structures: the 50 percent overlay is optional in asset-types.md [observed]; defaulting it on is [derived].
5. Offer tile on photo [observed 2:181188] with the offer line low rather than centred [derived, to clear the placeholder chip; a cleared photo may want it centred].
6. Keep or cut for each structure against the references: Donnie's call (scope doc question 6).

## Open

- Eddie: the Offer tile's lower-third placement; slot split for the offer line; the two 2x failures; apply the proposed budgets to the pack (his go).
- HLR via Eddie: caption home (layer beside the set vs HLR's own tool) and the content pillar names; rights for any found art stays a grey placeholder.

## Screenshots

- s01-feed-post-structures.png: the four structures in order (Photo, Headline on photo, Text tile, Offer tile).
- s01-text-tile-grounds.png: the Text tile on light, warm, deep and night.
