# Review 2 package: Figma foundations and the first modules

For Review 2 (Fri 2026-10-30, owner Donnie, who owns every decision since Eddie's ruling of 2026-10-23). Prepared 2026-10-23 by Claude under Eddie's delegation, and updated the same day after his morning decision sheet and the build it called for: the filled CTA, the rest of the module roster, product images per category, and the rest of HLR's email templates and the flows. Everything below is built in the library and checked: structure lint, every slot flex-probed (at least twice its drawn copy, most four times) and restored, screenshots, and the guards in `guards/` (`tests/run_all.sh` PASS). A fresh-context review (REVIEW.md) checked each batch: three rounds on the first email batch (`review-email-batch-r1.md` to `-r3.md`), three on Foundations (`review-foundations-r1.md` to `-r3.md`) and three on this batch (`review-batch-2-r1.md` to `-r3.md`): round 1 found 1 blocker, 8 should-fix and 4 notes, round 2 1 blocker, 2 should-fix and 5 notes, round 3 no blocker, 3 should-fix and 4 notes. Every blocker and should-fix was fixed and verified by its rerun (round 3's after the last round, so not re-reviewed), and each note left open has an owner in DECISIONS 2026-10-23. Section 7 holds what is still Donnie's to confirm; section 6 the questions for HLR.

## 1. What to open

HLR Library, `Gq3yUbLs6MCRM0nOhjvnIW`:

| Page | What is on it |
|---|---|
| 00 Foundations (0:1) | Color, Type, Layout, Marks, Certified pairs and Strictness map boards: 96 variables in four collections (ground modes light, warm, deep, night; canvas modes web, social, email), 15 text styles, 22 certified or recorded pairs, the wordmark, the monogram and the star |
| 01 Elements (7:2) | Board 39:104: E01 to E15 and the E01 on-photo specimen |
| 02 Modules (7:3) | M01 to M27, the email modules at 1200 on the email canvas |
| 03 Templates (7:4) | T01 to T17, pure module instances on the email canvas |
| 04 Staging (7:5) | The demo email, The made-to-order pendants (63:354) |
| photos (27:104) | The images Eddie cleared for HLR's designs (97) |

## 2. Elements

| Id | Element | Notes |
|---|---|---|
| E01 | CTA | Style=Outline, the caps box (Gate 1 C6), the primary CTA; Style=Filled (Eddie, 2026-10-23), from HLR's 2026 sends: Onyx with a white label on a white page, white with an Onyx label on a photo. A white box with an Onyx stroke on a pale band is the outline box with a white fill, so it takes Style=Outline. Each on a ground or on a photo. The filled colours on warm, deep and night are derived (section 7) |
| E02 | Text link | Style=Rule (Regular caps over a hairline, as HLR's SHOP links; Eddie, 2026-10-23), Style=Arrow (serif link with a long arrow) |
| E03 | Rule | The hairline: 1 px on web and social, 2 px on email, where the 1200 master displays at 600 (Eddie, 2026-10-23) |
| E04 | Image | Full bleed and three mats (square, portrait, landscape) |
| E05 | Product image | The image for a mixed grid or an unknown category: square, 4:5 portrait, on a ground |
| E06 | Product card | A product image (E05, or E11 to E14 by category), the name, an optional price, the SHOP link; Show struck price adds E09 for a sale grid |
| E07 | Product card, labelled | The three-up card of 2:7443: a square image (E05, or E11 to E14), one italic label word, the short name in caps (the stone, or the display name's tail after "in"; Eddie, 2026-10-23), SHOP |
| E08 | Star row | Only beside a sourced review |
| E09 | Price, struck | The price and the compare-at price struck through (E-P4, 2:2153), merge tokens only; the strike line's colour is derived (section 7) |
| E10 | Press logo | A labelled placeholder until HLR clears press rights; the split layouts of M18 carry it |
| E11 | Product image, necklace | Necklaces and chains: portrait by default, as the site's necklace packshots; square; on a ground. Shows a cleared packshot by default (photos page 27:174, Eddie, 2026-10-23), swapped per product |
| E12 | Product image, bracelet | Bracelets: square by default; anklets and waist beads take it too (derived, section 7). Shows a cleared packshot by default (photos page 27:244, Eddie, 2026-10-23), swapped per product |
| E13 | Product image, ritual kit | Portrait by default; no kit packshot is cleared yet, so the grey placeholder holds (HLR) |
| E14 | Product image, crystal | Portrait by default; no crystal packshot is cleared yet, so the grey placeholder holds (HLR) |
| E15 | Star | The four-point star, at most one per surface: HLR's own vector, from the footer of their live sends (2:1062), placed from Marks/Star (Eddie, 2026-10-23); HLR confirms it as the master |

## 3. Email modules

Every module is built from element instances, bound to tokens, stamped for the copy engine and proven to take at least twice its drawn copy without clipping or collision, each slot alone and all together (most take four times). The reference node is the HLR send each was rebuilt from (reference file `LYyYXPDUHVoAABh865EvMI`).

| Id | Module | HLR pattern and reference | Options |
|---|---|---|---|
| M01 | Header | E-H2 wordmark bar | ground mode on the instance |
| M02 | Hero | E-M17, E-H3; 2:193998, 2:9 | wordmark, eyebrow, body, one script line, CTA, Space below (room under the CTA for a photo whose subject sits low); the scrim is optional |
| M03 | Spotlight | E-M01 feature split; 2:193211 | image left or right |
| M04 | Text block | E-M03 to E-M06, E-M11 | left or centered; eyebrow, headline, body and CTA each optional |
| M05 | Image | E-M12 | mat or full bleed |
| M06 | Product grid | E-M15, E-P1; 2:193967 | heading; one or two rows of two |
| M07 | Mantra | E-P3; 2:4490 | script line |
| M08 | Promo bar | E-M18; 2:194014 | usually on the deep ground |
| M09 | Footer | E-F1; 2:1062 | the ESP's legal line (unsubscribe, address), in live-text sends only (a sliced send takes the ESP's live footer); the star (E15) |
| M10 | Divider | E-M19 | a hairline, or the star (E15, at the size HLR's flows place it, 2:190749); one star per surface |
| M11 | Edit feature | E-M09 The Edit; 2:193565 | the CTA in the text column, its label 16 characters (M11.cta) |
| M12 | Numbered feature | E-M14 "03 / Material"; 2:193777 | image left or right, alternated for a zigzag; the CTA label 16 characters (M12.cta) |
| M13 | Product details | the details block of 2:563; E-M06 | image on or off |
| M14 | CTA | E-M16, in 23 of 28 sends | |
| M15 | Product grid, three up | the birthstone grid of 2:7443 | heading; one or two rows of three |
| M16 | Two-column text | E-M07; 2:193487 | plain or inset on a warm band |
| M17 | Letter | E-P2; the founder's note of 2:7443 | eyebrow, headline |
| M18 | Review | E-M02 split, 2:193247; E-M08 centered, 2:193520 | split, split with the image right, or centered; a press logo (E10) on the split layouts |
| M19 | Offer | E-M11 offer variant, 2:193736; E-P4 | every figure, code and date a merge token; CTA |
| M20 | Collage | E-M13; 2:193764 | |
| M21 | Spec rows | E-P5; 2:190749 | two or four rows |
| M22 | Follow block | E-P6; 2:251, 2:8838 | a dark photo, the eyebrow naming the platform, the white filled CTA; the platform is a third party the brief names, with its rights |
| M23 | Lockup header | E-H1; 2:563, 2:809 | the lockup is a labelled placeholder until HLR's vector; until then a send opens with M01 |
| M24 | Footer, stacked | E-F0; the board templates, 2:192035 | Shop, Follow Us and The Ritualist without the crest (C3, kept retired by Eddie, 2026-10-23); the footer disclaimer verbatim; the ESP's legal line in live-text sends only |
| M25 | Social footer | E-M20; 2:194481 | one line on the deep ground, without the crest; never ends a send (M09 or M24 follows with the disclaimer) |
| M26 | Transactional card | E-P7; 2:194122, 2:194153 | the order block is the ESP's (a labelled placeholder); an optional closing line |
| M27 | Ritualist masthead | E-M10; 2:193664 | THE RITUALIST and the issue month on the warm ground |

Every pattern on the email roster is now built. What still waits is in the placeholders: HLR's vector for the lockup (M23) and press rights for E10.

## 4. Templates

Seventeen templates, each a frame of module instances in the order of the HLR send it rebuilds, with the modules' labelled placeholders in place of copy. `templates-batch-2.md` gives T04 to T17's module orders and what each leaves out.

| Id | Template | Rebuilt from |
|---|---|---|
| T01 | Product Spotlight | 2:563 |
| T02 | Editorial send | 2:9, 2:1330, 2:1767 |
| T03 | Product listing | 2:683 |
| T04 | Sale | 2:984 |
| T05 | Testimonials | 2:809 |
| T06 | Moodboard | 2:913 |
| T07 | Welcome 1 | 2:8838 (welcome 2026) |
| T08 | Welcome 2 | 2:8917 (welcome 2026; derived, section 7) |
| T09 | Welcome 3 | 2:193004 (Welcome Series 3-5 board) |
| T10 | Welcome 4 | 2:193050 |
| T11 | Welcome 5 | 2:193107 (TheEdit) |
| T12 | Energy medicine | 2:31200 |
| T13 | Browse flow | 2:189609 |
| T14 | Cart flow | 2:189904 |
| T15 | Abandoned cart flow | 2:190749 |
| T16 | Checkout flow | 2:191052 |
| T17 | Post-purchase | 2:194122 |

Left out on purpose: T12's tail (a code line on a blank band). T09's two gaps and T16's image gap are not blank: layers drawn over each frame hold two features and a heading (T09, now rebuilt with M11 and M04) and a third party's picture (T16, now a labelled grey placeholder). Seven sends draw no footer (T07, T08, T09, T10, T12, T15 and T17) and T11's lies outside its frame: each of those templates adds the library's footer (M09 or M24), since every email owes the disclaimer (HLR-REQ-01). T15's footer star is off: one star per surface. Every departure from a send (a CTA colour, a ground Eddie changed, a block set in another module) is listed in `templates-batch-2.md`.

## 5. The demo email

`demo-email/` holds the brief, the route plan, the copy slate with its lint reports, the build notes and a preview (`demo-email-preview.png`). The brief: four of HLR's made-to-order pendants (The Element, Sacred, Genesis and Seeker Pendants), one fact from the product database (made to order), no figures. The angle, "Made after you choose it" (route R1, the making is the story), and the hero as built are confirmed (Eddie, 2026-10-23). The copy went through the engine end to end (copy lint PASS, fit check PASS) and the email is built from library instances only, with Eddie's cleared photos.

## 6. Questions for HLR, ranked by what they block

1. Font licenses for Saol Display, Saol Standard and Trade Gothic LT Std (Brand Review v2 Q2): nothing ships until they are confirmed; the library is set in the real faces, with the license flag raised on every board.
2. The claims signer (Q1, C2): every line that touches health, origin, sourcing or making waits on a ruling; the demo stays inside made to order for that reason.
3. The Shopify products export (Q5): product descriptions, metals, stones and SKUs; until it lands, the product modules carry names and images only (M13 and M21 have nothing to say yet).
4. The lockup vector and the star's master (Q3): the lockup header (M23) is a labelled placeholder until the vector comes; the star is placed from HLR's own live footer vector, and HLR confirms it as the master.
5. The email platform (new): whether sends go out as image slices or live text (C8 sized both), how a four-card grid links, the merge tokens for the unsubscribe link and the address (the legal line ships only in live text), and the order block the transactional card (M26) and T17 take from it.
6. A reviews export (Judge.me, Q7) and press rights: M18 runs only on sourced reviews, and E10 waits for press rights.
7. Offers (Q9, C10): M19, M08 and E09 hold merge tokens until HLR rules on offers; HLR strikes a sale price in red #D54141, off the palette (token-model C7).
8. Packshots for ritual kits and crystals: E13 and E14 hold the grey placeholder until HLR clears them.
9. The filled CTA (C6): the outline box stays primary, and HLR confirms the filled box at Review 1 with the rest of C6 (Eddie, 2026-10-23).
10. The paid and web taxonomy (Gate 2 call 1 b): ratified on these masters at this review, before the paid and web batches.
11. Releases for people in imagery (`faces_policy`; Q6 and token proposal HLR 5): the founder headshots and the editorial images with people wait for it; so do the third parties the welcome series names (T10's causes and partners, M22's platform), which need their rights before any is named.

## 7. Donnie's calls at this review

None blocks the next batch. Each has a default: what is built.

1. Web margins and grid (token-model L3): with the web masters. The breakpoints are set (1440 desktop, 390 mobile; Eddie, 2026-10-23).
2. The web focus ring (token-model K2): with the web masters' interactive states.
3. The highlight cover (`asset-types.md`): 6 covers at 1507 x 1468 observed and no recipe; its canvas and structure decide with the organic social batch.
4. Four derived values, for Donnie to confirm:
   1. The filled CTA off the light ground (`component.cta.fill`, `component.cta.fill-label`): an Onyx box with a Fawn label on warm; an Alabaster box with a Forest label on deep and an Onyx label on night, the inverse the outline box takes there. Default: as built. The other choice keeps the filled box to the light ground and photos, as HLR's sends show it.
   2. The struck price's line (`component.price.strike-line`): the muted ink, so the struck price reads quieter than the price. Default: muted. The other choice is HLR's red, which needs a new colour on the palette (C7, HLR's to answer).
   3. Anklets and waist beads take E12 (bracelet) until HLR says otherwise. Default: as built. The other choice is an element each, which waits on their packshots.
   4. T08 Welcome 2's source: the welcome 2026 section's second frame (2:8917, named Editorial Style Edit), the follow-up letter to Email 1; the pattern review named no Welcome 2. Default: as built.
5. T15's two CTAs are Forest outlines in the source. The library has no Forest CTA, so they read Onyx on the page and white on the photo. Default: as built. The other choice is a Forest outline token, a new [derived] value.

## 8. Next

Organic social is the next batch (S01, S03 and S04 at 1080 on the social canvas); paid and web follow the taxonomy ruling at this review. Lane H's 0.5.4 takes the nine engine gaps (G1 to G9, `engine-gaps-chat6.md`).
