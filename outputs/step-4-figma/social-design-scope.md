# Organic social design: scope (2026-11-01)

Status: proposal for Eddie's go. Nothing here writes to Figma. Paid layers on after this, reusing the same masters (slotmap-paid.yaml P## masters are re-layouts of S01 and S04).

## 1. What the references are

Node 2:32177 "Organic Social" in the client read-only file LYyYXPDUHVoAABh865EvMI: 164 top-level frames [observed, metadata read 2026-11-01]. Sizes: 1080x1920 stories (most), 1080x1350 (4:5 feed and story-sized feed), 1080x1080 (12 older lorem placeholders, retire), 1507x1468 highlight covers (6). Pattern inventory: `outputs/step-1-review/patterns/patterns-social.md` (15 patterns, S-* feed and C-STRIP, ST-* stories).

## 2. Decision: same elements, new layouts

The elements stay as ruled: Saol and Trade Gothic (+ Homemade Apple script, one short line per asset) (C5), Onyx on Alabaster with Forest, Fawn, Onyx grounds (C4), wordmark, four-point star E15 and HLR monogram (C3), hairline E03, image E04, handle as an element never a slot, no CTA box on social (0 of 52 renders carry one). What the references change is structure: layouts, density, type scale and imagery. Those are [derived] and go to Donnie.

Default: build the three planned modules (`brand-pack/slotmap-social.yaml`) on the existing library variables, no new tokens unless a reference needs a value the tokens lack; any such value is proposed, tagged [derived], never added silently.

## 3. Build plan (planned masters, all "proposed, unbuilt" today)

| Order | Module | Structures | Reference patterns | Canvas |
|---|---|---|---|---|
| 1 | S01 Feed Post | Photo, Headline on photo, Text tile, Offer tile | S-PHOTO, S-PHOTOTEXT, S-TEXT, S-OFFER | 1080x1350 |
| 2 | S03 Carousel Set | Cover, Inner, End (annotated product S-ANNOT, weekly prompt S-WFYJ, energy S-ENERGY, season S-SEASON as inner variants) | S-WFYJ, S-ENERGY, S-ANNOT, S-SEASON, S-LONG | 1080x1350 |
| 3 | S04 Story Set | Text, Inset, Full bleed, Split | ST-TEXT, ST-INSET, ST-FULL, ST-SPLIT, S-OFFER story | 1080x1920 |
| 4 | Highlight covers | flat Forest, no icon until HLR supplies one | ST-HL | 1507x1468 (optional) |

Per module: variables bound, slots stamped `hlr`, flex probe on the tightest variant, screenshot check, then `max_chars` measured from the build (budgets stay null until measured).

## 4. Steps for today

1. Done in this file: scope.
2. On Eddie's go (rule 5): build S01 in library Gq3yUbLs6MCRM0nOhjvnIW page 02 Modules, in Eddie's chat from an agent package (the runner never writes Figma).
3. Runner, no go needed: draft the S01, S03, S04 Figma agent packages in `outputs/` (as done for paid) so step 2 is paste-ready.
4. Copy before design: a social-copy pass on one real brief fills the slots S01 needs; budgets come from step 2's measure.

## 5. Questions, ranked by production-blocking risk

1. Go to build S01 in the library (default: yes, S01 then S03 then S04). Owner: Eddie.
2. Organic story band (top and bottom 250 px, confidence contested): confirm on a live story before S04. Owner: Eddie.
3. Caption home (layer beside the set vs HLR's own tool) and the three content pillar names. Owner: HLR via Eddie.
4. Rights for found art, stock texture and third-party images stay grey placeholders until cleared. Owner: HLR.
5. Highlight cover icon. Owner: HLR.
6. Which structures from the references are keep or cut (layout calls are [derived]). Owner: Donnie.

## 6. Out of scope today

Paid masters (P##), Reels, Figma writes, any new brand value, any generated imagery (REVIEW.md rule 8: no ruling).

Sources: slotmap-social.yaml, patterns-social.md, DECISIONS 2026-10-17/18 (C3 to C6, Gate 2 call 3 b), brand-context.md Imagery line.
