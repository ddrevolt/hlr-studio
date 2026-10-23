# Review 2 package: Figma foundations and the first modules

For Review 2 ({{review-2-date}}, owner Eddie). Prepared 2026-10-23 by Claude under Eddie's overnight delegation. Everything below is built in the library and checked; the calls marked "for Eddie to confirm" were Claude's under that delegation and are on Eddie's morning decision sheet before HLR sees them. A fresh-context review (REVIEW.md) checked the batch before this package: three rounds on the email batch (`review-email-batch-r1.md` to `-r3.md`: 2 blockers, 10 should-fix and 23 notes in all, every blocker and should-fix fixed and verified, closed with none open) and three on Foundations (`review-foundations-r1.md` to `-r3.md`: 2 blockers, 6 should-fix and 14 notes in all; all fixed but the closed-gate guard’s approach and rule 4’s wording, on Eddie’s decision sheet, and three guard notes logged for the next close; the guards are in `guards/`). Two of the fixes are derived and wait on Eddie (R1-04, E07's short names; R1-10, the SHOP link weight).

## 1. What to open

HLR Library, `Gq3yUbLs6MCRM0nOhjvnIW`:

| Page | What is on it |
|---|---|
| 00 Foundations (0:1) | Color, Type, Layout, Marks, Certified pairs and Strictness map boards: 89 variables in four collections (ground modes light, warm, deep, night; canvas modes web, social, email), 15 text styles, the wordmark and the monogram |
| 01 Elements (7:2) | Board 39:104: E01 to E08 and the E01 on-photo specimen |
| 02 Modules (7:3) | M01 to M21, the email modules at 1200 on the email canvas |
| 03 Templates (7:4) | T01 Product Spotlight (46:104), T02 Editorial send (46:227), T03 Product listing (64:354) |
| 04 Staging (7:5) | The demo email, The made-to-order pendants (63:354) |
| photos (27:104) | The images Eddie cleared for HLR's designs (97) |

## 2. Elements

| Id | Element | Notes |
|---|---|---|
| E01 | CTA | The outline caps box (Gate 1 C6); Surface=Ground follows the ground mode, Surface=Photo is the inverse on photography |
| E02 | Text link | Style=Rule (Regular caps over a hairline, as HLR's SHOP links; for Eddie to confirm), Style=Arrow (serif link with a long arrow) |
| E03 | Rule | The hairline |
| E04 | Image | Full bleed and three mats (square, portrait, landscape) |
| E05 | Product image | One element with crop variants (square, 4:5 portrait, on a ground); the picture swaps per product |
| E06 | Product card | E05 portrait, name, optional price, SHOP link |
| E07 | Product card, labelled | The three-up card of 2:7443: square image, one italic label word, the short name in caps (the stone, as 2:7443 shows; for Eddie to confirm), SHOP |
| E08 | Star row | Only beside a sourced review |

## 3. Email modules

Every module is built from element instances, bound to tokens, stamped for the copy engine and proven to take at least twice its drawn copy without clipping or collision, each slot alone and all together (most take four times). The reference node is the HLR send each was rebuilt from (reference file `LYyYXPDUHVoAABh865EvMI`).

| Id | Module | HLR pattern and reference | Options |
|---|---|---|---|
| M01 | Header | E-H2 wordmark bar | ground mode on the instance |
| M02 | Hero | E-M17, E-H3; 2:193998, 2:9 | wordmark, eyebrow, body, one script line, Space below (room under the CTA for a photo whose subject sits low); the scrim is optional |
| M03 | Spotlight | E-M01 feature split; 2:193211 | image left or right |
| M04 | Text block | E-M03 to E-M06, E-M11 | left or centered; optional CTA |
| M05 | Image | E-M12 | mat or full bleed |
| M06 | Product grid | E-M15, E-P1; 2:193967 | heading; one or two rows of two |
| M07 | Mantra | E-P3; 2:4490 | script line |
| M08 | Promo bar | E-M18; 2:194014 | usually on the deep ground |
| M09 | Footer | E-F1; 2:1062 | the ESP's legal line (unsubscribe, address), in live-text sends only; a sliced send takes the ESP's live footer |
| M10 | Divider | E-M19 | |
| M11 | Edit feature | E-M09 The Edit; 2:193565 | the CTA in the text column, its label 16 characters (M11.cta) |
| M12 | Numbered feature | E-M14 "03 / Material"; 2:193777 | image left or right, alternated for a zigzag; the CTA label 16 characters (M12.cta) |
| M13 | Product details | the details block of 2:563; E-M06 | image on or off |
| M14 | CTA | E-M16, in 23 of 28 sends | |
| M15 | Product grid, three up | the birthstone grid of 2:7443 | heading; one or two rows of three |
| M16 | Two-column text | E-M07; 2:193487 | plain or inset on a warm band |
| M17 | Letter | E-P2; the founder's note of 2:7443 | eyebrow |
| M18 | Review | E-M02 split, 2:193247; E-M08 centered, 2:193520 | split or centered |
| M19 | Offer | E-M11 offer variant, 2:193736; E-P4 | every figure, code and date a merge token |
| M20 | Collage | E-M13; 2:193764 | |
| M21 | Spec rows | E-P5; 2:190749 | two or four rows |

Not built yet, each with its owner: the lockup header (E-H1) and the footer star (HLR's vectors), the transactional card (E-P7, with the flows), a filled CTA and the follow block that uses one (E-P6; Gate 1 C6 ruled outline), the struck price (E-P4; offers wait for C10), the crest footers (E-F0, E-M20; the crest left the footer at C3), the Ritualist masthead (E-M10, boards only) and a press logo slot (press rights).

## 4. Templates

T01 Product Spotlight (from 2:563, in its order: header, spotlight, text, image, CTA, product details, promo bar, footer), T02 Editorial send (from 2:9, 2:1330, 2:1767) and T03 Product listing (from 2:683: header, hero, two-column text, a grid of eight, footer) are pure instances of the modules. The rest of HLR's most-used templates follow: Sale, Testimonials, Moodboard, Welcome 1 to 5, the monthly energy medicine send and the flows.

## 5. The demo email

`demo-email/` holds the brief, the route plan, the copy slate with its lint reports, the build notes and a preview (`demo-email-preview.png`). The brief: four of HLR's made-to-order pendants (The Element, Sacred, Genesis and Seeker Pendants), one fact from the product database (made to order), no figures. The angle: "Made after you choose it" (route R1, the making is the story), provisional until Eddie confirms. The copy went through the engine end to end (copy lint PASS, fit check PASS) and the email is built from library instances only, with Eddie's cleared photos. Revised after review round 1: white grounds, the hero reframed with Space below, the packshots cropped to the piece, the legal line off (a slice cannot carry live merge tokens) and the verb varied where "choose" ran six times.

## 6. Questions for HLR, ranked by what they block

1. Font licenses for Saol Display, Saol Standard and Trade Gothic LT Std (Brand Review v2 Q2): nothing ships until they are confirmed; the library is set in the real faces since 2026-10-23, with the license flag raised on every board.
2. The claims signer (Q1, C2): every line that touches health, origin, sourcing or making waits on a ruling; the demo stays inside made to order for that reason.
3. The Shopify products export (Q5): product descriptions, metals and stones; until it lands, the product modules carry names and images only (M13 and M21 have nothing to say yet).
4. The star and lockup vectors (Q3): the footer star and the lockup header wait for them.
5. The email platform (new): whether sends go out as image slices or live text (C8 sized both), how a four-card grid links (an image map or one slice per card), and the merge tokens for the unsubscribe link and the address (the legal line ships only in live text, so a sliced send needs the ESP's live footer).
6. A reviews export (Judge.me, Q7) and press rights: M18 runs only on sourced reviews, and the press logo slot waits for rights.
7. Offers (Q9, C10): M19 and M08 hold merge tokens until HLR rules on offers.
8. The paid and web taxonomy (Gate 2 call 1 b): ratified on these masters at this review, before the paid and web batches.
9. Releases for people in imagery (`faces_policy`; Q6 and token proposal HLR 5): the founder headshots and the editorial images with people wait for it.

## 7. Eddie’s calls at this review

Gate 4 closed under Eddie’s delegation and left these open (DECISIONS 2026-10-23); none blocks the email batch.

1. Web breakpoints, margins and grid (`figma.yaml` `breakpoints: null`; token-model L2 and L3): the web masters need them. Observed so far: design frames at 1440 and 375, and the theme breaking at 576, 768, 992, 1024, 1200 and 1280 (`type-registry-core.json`).
2. The web focus ring (token-model K2): not tokenized; the web masters’ interactive states need it.
3. The highlight cover (`asset-types.md`): 6 covers at 1507x1468 observed and no recipe; its canvas and structure decide with the organic social batch.
4. The Gate 4 calls Claude made for Eddie to confirm, on the morning decision sheet: the ground mode names, on-placeholder and the placeholder label’s alias, the strictness map, the batch scope.

## 8. Next

Organic social is the next batch (S01, S03, S04 at 1080 on the social canvas), then the rest of the email templates and the flows; paid and web follow the taxonomy ruling at this review. Lane H's 0.5.4 takes the engine gaps logged in `engine-gaps-chat6.md`.
