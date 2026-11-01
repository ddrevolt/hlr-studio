# Paid expansion: repeating programs and what the masters already serve

2026-11-01. Proposals only. Nothing here is built. Eddie rules; Donnie ratifies any derived value.
Sources: `outputs/step-2-pack/corpus/` (corpus-visible-paid.tsv, corpus-visible-social.tsv, counts.md), `outputs/step-1-review/patterns/patterns-paid.md`, `brand-pack/slotmap-paid.yaml`.

## Programs that repeat, and the master that serves each

| Program | Evidence | Served by | Gap |
|---|---|---|---|
| Birthstone and month | P-GRID 1 frame and 3 boards (2:57657, 2:54760); 12 month-keyed products in products.json (the-january-birthstone-aura-pendant-garnet to the-december-birthstone-nova-pendant-turquoise) | P08 Birthstone Grid for the chart; P02 Cut-out for one month's pendant; P07 Card for one stone | none |
| Season and energy medicine sends (for example Scorpio season, October energy medicine) | corpus social and email rows, T12 Energy medicine | P05 Mantra, P07 Card or List (stone and intention), P01 Line | none; the season is copy, not structure |
| Mother's Day | headline swap on the gift layout (2:57602 vs 2:51663) | P06 Gift with purchase | none |
| Black Friday and sitewide offers | P-OFFER (2:53265, 2:58968, 2:36435), P-HERO offer variant (2:53235) | P06 Offer, P02 Cut-out with the offer slot | none; percents, codes and dates stay merge tokens |
| Spell Bracelets family (name cards, material cards, annotated model, reviews, DM, mantra video) | largest family in the corpus (patterns-paid.md) | P02 Inset, P07 Card, P03 On model, P04 Review and DM, P05, P09 | rotated side labels (see proposal 3) |
| Stack and layering | P-STACK (2:57502, 2:60294, 2:49357); 8 "Add ... stack" lines over 20 frames | P03 On model with 2 to 4 callouts, P01 Line for the italic-word line | none |
| Press | P-PRESS (2:36273, 2:35895, 2:40881); P-BANNER quote variant | P04 Press | publication logo (see proposal 2) |
| Customer voice | P-REVIEW (2:58872), P-DM (2:48723) | P04 Review, P04 DM | none |

## Proposed additions, ranked by production-blocking risk

Default: build none until Eddie rules. Numbered options state their tradeoff.

1. P10 Link Image and P11 Display Banner (already specified in `slotmap-paid.yaml`, unbuilt and outside this request). Reason: the corpus holds 26 link-ad frames at 1.91:1 (P-LAND, sample 3 of 26, 2:37135, 2:36590, 2:56900) and 20 named banners (P-BANNER, 2:36253, 2:36273); Meta masters do not cover Google or IAB. Tradeoff: needs the IAB size set and display floors (14 and 12 px, ruled 2026-10-18) and a decision that Google is in scope. Default: build after Eddie confirms Google and display are in scope.
2. Publication logo slot on P04 Press. Reason: P-PRESS places a third-party publication logo under the quote (2:36273) and the master carries text attribution only. Source: patterns-paid.md P-PRESS. Tradeoff: needs cleared logo files from each publication, and a new image slot id (P04.logo). Owner HLR for the logos, Donnie for the slot. Default: wait for the logos.
3. P02 Inset variant with rotated side labels. Reason: 2:52919 and 2:41729 rotate the family label ("The Spell Bracelets") along the photo edge; the contract has no rotation. Source: patterns-paid.md P-INSET. Tradeoff: adds a Style value and a rotated text layer; the false-extent problem on rotated boxes (2:41729) makes the safe-area check unreliable. Default: skip, use the side label horizontally.
4. P03 pointing leaders on a real photo. Reason: the annotated frames converge long hairlines on the piece (2:37799); the master stacks callouts as rows. Source: patterns-paid.md P-ANNOT-MODEL. Tradeoff: leader endpoints depend on the photo, so this is a per-ad placement job or a Leader style with draggable endpoints. Default: place leaders per example once a cleared photo is chosen.
5. Video supers and storyboard frames. Reason: P-VIDEO boards hold 24, 41 and 50 frames with one super per 9:16 frame. Source: patterns-paid.md P-VIDEO. Blocked: `video_rules` is null in the pack (owner Eddie). Default: wait.
6. Word-by-word mantra build. Reason: P05 corpus builds "In / my / healing / era" for motion (2:47353, 41 frames). A motion job, not a static master. Default: out of scope.

## Not proposed

No new module for birthstone, season, Mother's Day, Black Friday or stack programs: each is a copy and image change on an existing master.
