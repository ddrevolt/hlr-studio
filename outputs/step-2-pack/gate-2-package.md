# Gate 2 package: HLR Pack v0

Lane E, 2026-10-20. For Eddie. Gate 2 ratifies the derived tokens, the contrast law, the voice principles and the taxonomy (PROGRESSION, Step 2); this package also carries lane A's two visibility calls, what the R14 guard found and every DECISIONS 2026-10-18 line still marked "default until Eddie rules" that belongs to this gate. 19 calls, ranked by production-blocking risk, each with a default. Lane C's eight calls are already ruled (2026-10-21, below). Reply with the numbers you change ("all defaults", or "defaults except 4 b, 11 c"). DECISIONS records them as "Gate 2 package call N", apart from lane D's "Gate 2 call N" rulings of 2026-10-18.

The go to write outside lane E's own files. Your message opening this lane (2026-10-20) said: "After I rule, apply the rulings in brand-pack/ (lanes B, C and D are closed, so your write scope widens to brand-pack/ for this)". The prompt file `_setup/next-chat-prompts.md` still gives lane E only its three files, and no DECISIONS line records the widening yet, so your reply to this package is the go: lane E records it in DECISIONS with your rulings. Under it, a ruling that lands in `tokens.json`, `token-model.md`, `voice-contract.md`, `products.json`, `concrete-lexicon.json`, `art-direction.md`, `asset-types.md`, `logo-assets.md` or `brand-context.md` is applied by lane E, then preflight, the guards and the census are rerun. A ruling that lands outside `brand-pack/` (REVIEW.md, `_setup/next-chat-prompts.md`, the corpus) is recorded in DECISIONS and stays with that file's owner (call 16).

Already ruled at Gate 2, not reopened here: lane C's calls 1 to 8 (DECISIONS 2026-10-21); lane D's calls 1 to 7 (the taxonomy for email and organic social, Google formats, case per slot role, the story zone, non-stone tails, the display and web floors, no standing angle policy, product keys) and lane B's questions 1 to 4 (canvas modes on Layout, the stand-in style map, leading and tracking unbound in percent, no pair test for copy on photography) (DECISIONS 2026-10-18).

Not in this package: the 0.5.2 bundle report's section 7 and the engine defaults DECISIONS 2026-10-18 lists for 0.5.2 (scopes, CSS syntax, the `[data-ground]` block and the rest), which Eddie rules with the release; the paid on-image `hook` role (DECISIONS 2026-10-18), ruled with the paid taxonomy at Review 2 (call 1 b); HLR's own questions (C1, C2, C7, C10, licenses, vectors, image rights, the export, the claims signer), which go to Review 1. Evidence: `outputs/step-2-pack/preflight.md` (preflight, the guards, the census), `token-proposal.md`, `voice-claims-notes.md`, `structure-notes.md`, `brand-pack/token-model.md`.

## Tokens, the contrast law and the design rules (block engine 0.5.3, Chat 5 and Chat 6)

### 1. The `stroke` category and the canvas-mode grammar
Origin: DECISIONS 2026-10-18, the CTA stroke line, the canvas-mode grammar line and the two ground-mode grammar lines (all "default until Eddie rules"); `token-proposal.md` section 7, the spec lane H is building into 0.5.3 now.
- (a) Ratify as built: a `stroke` category in `HLR / Layout`; `stroke.cta` per canvas mode (web 1 px [observed], email 2 px [observed], social 2 px, unused [derived]), aliased by `component.cta.weight`; canvas-dependent geometry lives in Layout with a value per canvas mode and a component aliases it; every `font.size.*` and `stroke.*` token states `social` and `email`, and a Layout token without modes holds its value on every canvas. One CTA element serves every canvas. (a) also ratifies the ground-mode grammar as drafted and as 0.5.2 reads it (DECISIONS 2026-10-18, the two mode-grammar lines): modes declared per collection at the root; a semantic token's `$value` is its `light` value; each alternate ground stated on every semantic token under `$extensions.com.hlr.modes.<mode>`, and a token that omits one is a finding, never inherited.
- (b) Two weight tokens on the component tier (`weight-1200`, `weight-web`) and a CTA element variant per canvas. No new category for 0.5.3, but the element exists twice, against the reason for question 1's ruling.
- Default (a). Lands in: `tokens.json` tags; `token-model.md` (log, section 1); 0.5.3 needs no change. (b) changes `tokens.json` and lane H's 0.5.3 spec mid-build.

### 2. The contrast law
Origin: `token-model.md` section 2; DECISIONS 2026-10-18 ("Contrast law, derived, for Gate 2"); candidate values for the Forest, Onyx and Fawn ground modes (section 2 table).
- (a) Ratify as written: floors body 4.5:1, display 3.0:1 for the headline and display steps only, ui 3.0:1; every ground in the roster carries body copy in its ink, none display-only; Fawn is never an ink on Alabaster, white or the neutrals, and light ink never sits on Fawn; the placeholder ground carries its label only; Sea Salt is not a ground; a slot on a failing pair is carded on a certified ground or declared `not_rendered_on`; a pair not in contrast-pairs is uncertified; and the candidate values for the three alternate grounds (their names wait for Gate 4).
- (b) As (a), with the alternate-ground values held to Gate 4, where the ground roster is ruled. The certified-pairs board shows the light ground only until then.
- (c) As (a), with a 7:1 body floor (AAA). Fawn (5.66) becomes display-only and muted ink on every light ground fails (neutral-700 on Alabaster is 5.77), so muted copy needs a darker step.
- Default (a): the 20 contrast-pairs entries pass `tokens_build.js check` (32 pair-roles), and Gate 4 then only names the modes. Lands in: `token-model.md` sections 2 and 6; tags on the semantic tokens.

### 3. The type ramp, and the 12 px rendered floor on social and email
Origin: `token-model.md` section 3 (T7, [derived]); `structure-notes.md` section 4 (lane D: the token calls should say whether the floor holds on social and email).
- (a) Ratify the ramp as built: body at the floor and a perfect fourth above it, web 12, 14, 19, 25, 33, 44, 59, 79; social 32, 40, 54, 72, 96, 127, 170, 226; email 35, 45, 60, 80, 106, 142, 189, 251. The 12 px rendered floor stays display and web only, as call 5 a ruled; social labels render at 11.1 px and email labels at 10.9 px on a 375 phone.
- (b) As (a), with the social label at 35 (12.2 px rendered on a 375 phone). Email stays on C8's 35 for HLR to confirm.
- (c) As (b), with the email label raised to 39 (12.2 px). Reopens C8, Eddie's Gate 1 pick for HLR (body 45, small 35).
- Default (a), which keeps call 5 a as ruled. Lands in: `tokens.json` (`font.size.label`, tags on the eight size tokens); `token-model.md` sections 3 and 6.

### 4. How a ratified derived value is tagged
Origin: DECISIONS 2026-10-18, two defaults that disagree: `token-model.md` section 6 flips a ratified token to `[documented]` with "(ratified <date> by <name>)" (done for `font.size.label` on the web canvas), while REVIEW.md rule 4 reads `[derived, ruled]` as ruled ("default until Eddie rules on the tag grammar"). Every engine reads only a bare tag at the start of a description (`tokens_build.js`), so `[derived, ruled]` reads as untagged and 0.5.2's `figma-plan` stops on it. Every Gate 2 ratification lands in this form.
- (a) Flip to `[documented]` with "(ratified <date> by Eddie, Gate 2 call N)"; `token-model.md`'s log keeps the derivation. Runs on every engine. REVIEW.md rule 4's sentence on `[derived, ruled]` becomes stale (lane F's file).
- (b) Keep `[derived]` and append "(ratified ...)". Honest about origin, but the engine prints derived tokens as proposals, and REVIEW.md's scan lists them as not ruled until its scan reads "(ratified".
- (c) `[derived, ruled]`. 0.5.1 runs but counts the token as untagged, and 0.5.2's `figma-plan` stops on it (DECISIONS 2026-10-18); reading it as ruled needs an engine change in 0.5.3 (lane H).
- Default (a); lane C already wrote its 2026-10-21 rulings in this form, "until Eddie rules the tag grammar" (DECISIONS 2026-10-21). Lands in: every token you ratify; `token-model.md` section 6. Under (b) or (c), also every ruled line the pack writes as [documented, DECISIONS <date>] (`brand-context.md`, `voice-contract.md`, `art-direction.md`, `asset-types.md`, `logo-assets.md`), which this pack wrote in (a)'s form while the call was open. Outside lane E's scope: REVIEW.md rule 4 (call 16).
- The same line's other half, a note inside the brackets (`[observed, the live site's button outline]`): default, allowed in markdown, where REVIEW.md's scan reads the first word, and never in a `tokens.json` description, where the engine needs the bare tag first and the note follows it (every token description passes that today).

### 5. The derived tokens not covered by calls 1 to 3, 6, 8 and 9
Origin: the provenance scan in `preflight.md` (52 tokens carry a derived part, 51 by first tag). This call covers: `color.semantic.interactive.cta` and `.link` (Onyx, from C6); seven component tokens (`component.cta.stroke`, `.label`, `.stroke-on-photo`, `.label-on-photo`; `component.mark.fill`; `component.placeholder.fill`, `.label`; `component.cta.weight` rides with call 1); `font.style.fine`; `font.leading.headline` 1.1, `.title` 1.2 and `.caps` 1.4 (the book gives none); and the text style roster (15 styles by role and size, `token-model.md` section 3).
- (a) Ratify as built.
- (b) Ratify as built except the ones you name, which stay [derived] and are built in Figma with the tag in their descriptions.
- (c) Hold them all: Chat 5 builds them as proposals and you ratify on the boards at Review 2. Changes the plan's order (Chat 5 runs after Gates 2 and 3).
- Default (a). Lands in: `tokens.json` tags; `token-model.md` section 6.

### 6. The neutral ramp and muted ink
Origin: `token-proposal.md` question 5; `token-model.md` gaps C4 and C5.
- (a) Ratify the ten steps from Alabaster toward Onyx, anchored on the observed warm email grey (#ece8e3 as neutral-100); muted ink neutral-700 on light grounds and neutral-300 on Forest and Onyx.
- (b) Keep only the steps with a role (100, 200, 300, 700). The next grey becomes a retrofit.
- Default (a). Lands in: `tokens.json` (`color.extended.neutral-*`, `background.subtle`, `.placeholder`, `text.muted`); `token-model.md`.

### 7. The strictness map: owner
Origin: R14, check in `preflight.md` (fails); `token-model.md` gap K3 ("Eddie to assign"); DECISIONS 2026-10-18 ("Eddie assigns the strictness map"). PROGRESSION Step 4 and the Chat 5 prompt already list it.
- (a) Chat 5 drafts it with Foundations (per element class: tier, mode switching, floor, where its content or claims rule lives, who can change it; locked by default) as a [derived] proposal, and you rule it at Gate 4, before any module.
- (b) Chat 6, with the first elements, since the map is per element class.
- (c) Eddie writes it.
- Default (a): the playbook puts it before any module. Lands in: `brand-context.md` (its gap row), `token-model.md` gap K3; the R14 check then passes.

### 8. The space scale and the social margin
Origin: `token-proposal.md` question 8; gaps L1 and L2.
- (a) Ratify as built: a 4-based scale in Tailwind numbering (`space.4` is 16 px), and `space.social-margin` 64 from the observed 62 and 63.
- (b) An 8-based scale.
- Default (a). Lands in: `tokens.json` (`space.*`); `token-model.md`.

### 9. The pull quote face
Origin: `token-proposal.md` question 6; gap T4 (the book disagrees with itself).
- (a) Saol Display Light (p18, the live site).
- (b) Saol Standard Regular (p16).
- Default (a). Lands in: `tokens.json` (`font.style.quote`); the roster's quote style.

### 10. The italic accent word
Origin: `token-proposal.md` question 7; gap T6 ([observed] in every channel, not in the book: p17's headline is roman).
- (a) Ratify: one word per display line or headline, as a range override (`font.style.display-accent`, `.headline-accent`); HLR hears it at Review 1.
- (b) Retire it.
- Default (a). Lands in: `token-model.md` section 3; `voice-contract.md` section 5 (a device, seasoning only).

### 11. Lane B's design rules: art direction, asset types and mark rules
Origin: `art-direction.md` and `asset-types.md` ("Draft for ratification at Gate 2") and `logo-assets.md` ("[derived] ... binding once Eddie ratifies it"); DECISIONS 2026-10-18, lane B's line (every derived value waits for Gate 2). Round 2 of lane E's review found no call carried them. Covered: the mark rules (`logo-assets.md` rules 1, 2, 4 and 5: a mark is placed from its file or component, never typeset or redrawn; one component per mark, its fill bound to `component.mark.fill`; the star at most once per surface; a PNG-only mark waits for its vector and two marks are never combined by eye); the art direction grammar (grounds and pairings, type behaviour, signature devices, the per-surface limits: one star, one script line, callouts only on product imagery), its handling for the live families with no card, and its list of what never happens; the asset roster (the M## email modules and E## elements from the pattern review, the 1200x628 link ad and the IAB display sizes, the delivery formats: PNG at 1x and 2x, email slices with alt text). S02 is call 15.
- (a) Ratify as built.
- (b) Ratify the mark rules and the list of what never happens now (Chat 5 places the marks), and hold the M## and E## rosters, the ad sizes and the delivery formats to Gate 4, where batch scope is ruled.
- (c) Hold all three files: Chats 5 and 6 build on them as [derived] proposals and you rule them on the boards at Review 2.
- Default (a): Gate 4 can still narrow the batch, and an unratified roster would reach Chat 6 as law. Lands in: the tags and status lines of `art-direction.md`, `asset-types.md` and `logo-assets.md`.

## Words (block finished copy)

Lane C's eight calls were ruled by Eddie on 2026-10-21 in lane C's chat (DECISIONS 2026-10-21; they were this package's first version's items 11 to 18): the voice principles, the 159 exemplars (lane E has moved the file and set the role), all six prohibited patterns, the disclaimer as its own row, the house defaults and the founder's first person as drafted, and metal and karat and metaphysical benefit as info rows flagged without a sign-off.

### 12. The voice rules lane C's call 1 left [derived]
Origin: DECISIONS 2026-10-21 ("The voice contract's section 4 rules 2 and 3 and section 5's devices rule stay [derived], because call 1 named the qualities, their definitions and checks"). Rule 2: meaning is said as tradition or intention, never as an outcome. Rule 3: one spiritual idea at a time, at 6 or 7 on the book's witchy scale; spells, hexes and witch positioning wait for C2. The devices rule: at most one device per piece, never in place of the point, never required.
- (a) Ratify the three as written.
- (b) Ratify rules 2 and 3 and drop the one-device cap.
- (c) Hold all three until HLR rules C2 at Review 1: they stay drafting guidance and no check enforces them.
- Default (a): rule 2 keeps stone meanings away from outcome claims the ledger lists for the verifier but no longer blocks (lane C calls 4 and 5). Lands in: `voice-contract.md` sections 4 and 5 (tags).

## The taxonomy (residue after lane D's call 1 b)

### 13. Web copy before Review 2
Origin: DECISIONS 2026-10-18, "Web under call 1 b" ("the alternative: lane E wires `section_library` now").
- (a) Wait for Review 2: `web-copy` stops by design until the W## masters exist.
- (b) Lane E wires `section_library` to `section-library.json` now. Web copy runs on proposed sections that no lint labels as proposed, and `page_lint.js` skips a null budget silently (engine gap 1), so lengths go unchecked.
- Default (a). Lands in: nothing under (a).

### 14. Product kinds and families, and the concrete lexicon
Origin: `products.json` `_meta` (`kind` and `family` [derived], unratified); `concrete-lexicon.json` (`_status` "derived, proposed for Gate 2"), wired now because the voice judge is advisory and never fails a slate.
- (a) Ratify both as built: seven kinds (159 jewelry, 12 ritual kits, the rest crystals, services, packaging); 15 families; the lexicon's 58 product words, 42 scene words and 182 names.
- (b) Ratify the kinds only; null the lexicon role until HLR's export and the owner's keeps exist. The voice judge then runs the engine's empty lexicon and says so.
- Default (a). Lands in: `products.json` `_meta`; `concrete-lexicon.json` `_status`. Under (b), also the File map (`concrete_lexicon` null) and its gap row in `brand-context.md`.

### 15. S02 (story or reel cover)
Origin: DECISIONS 2026-10-18 ("not adopted... default until Eddie rules"); `asset-types.md`.
- (a) Not adopted: reel covers build as S01 photo cards and story covers as S04 frames.
- (b) Adopt S02 as a separate master.
- Default (a). Lands in: `asset-types.md` (tag).

## Process and evidence

### 16. Records other owners keep
Origin: R14's warnings in `preflight.md`; REVIEW.md section 5, step 5 (a finding seen twice gets its guard, named in a section 6 row); round 1 and round 2 of lane E's review. Lane E cannot write these files.
- The chat prompts (`_setup/next-chat-prompts.md`): Chat 6's prompt names neither `module_library` nor `seam_map`, and builds email and social masters only, while PROGRESSION's Step 4 line adds paid and web (`slotmap_web`); Chat 7's prompt names neither `options_register` nor `voice_model`, `judge_rubric` or `judge_calibration`.
- REVIEW.md section 6: rows R7 and R14 to read "guard built: lane E, `outputs/step-2-pack/preflight.md`", and a new row for a rule in the brand context with no provenance tag (round 1 B2, round 2 B3), whose guard is the tag scan in `preflight.md` section 5; and rule 4's sentence on `[derived, ruled]` under call 4.
- (a) You name an owner (lane F wrote both files) and they patch them now.
- (b) Leave them: the warnings stay, each chat finds its gaps in `brand-context.md`, and REVIEW.md's rows lag the guards.
- Default (a). Lands in: nothing in `brand-pack/`.

### 17. Three questions for HLR's Review 1 list
Origin: R14 (round 1 review): `brand-context.md` holds three gaps that no Review 1 list puts to HLR (Brand Review v2 section 6 and the token proposal's HLR list hold neither). Until you rule, those rows are yours.
- (a) Add them to Review 1: HLR's customer segments in its own terms; any research or insight HLR holds (`insight_register`); customer material for paid grounding, a Judge.me reviews export first (`grounding_inputs`). Lane E records the questions in DECISIONS, and the rows read "asked at Review 1", with you relaying HLR's answer.
- (b) Leave them for a later review: the roles stay null, the rows read "not asked in Phase 1", and customer-evidence runs on public material only.
- Default (a). Lands in: `brand-context.md` (Who the customers are, Existing insight, the two gap rows); Review 1's agenda is yours.

### 18. A board's clip on its children (lane A)
Origin: PROGRESSION Step 2; `outputs/step-2-pack/corpus/method.md` section 6. The board D_HP_V1 clips its contents, but the walk gives each child its own clip region, so the 8 texts of D_Get Started (picture-framing template copy, outside the board's box) count as visible.
- (a) Apply a board's clip to its children: the 8 rows leave the visible web corpus at the next re-cut.
- (b) Keep the rule; the 8 rows stay, flagged `nested`.
- Default (a): visible means visible on the canvas. Lane C already excluded the 8 from the exemplars, so no pack file changes. Owner of the re-cut: lane A.
- Calls 18 and 19 also settle lane A's method default (DECISIONS 2026-10-18, the re-cut line): default, the rest as written, including text under an image counted as buried (313 rows: email 4, organic social 64, paid 228, web 17; flag `cover=image`), which a few screenshots could settle later.

### 19. Text below the fold in web comps
Origin: same section. Desktop comps cut to a viewport send the copy below their bottom edge off frame (34 rows), though a page scrolls.
- (a) Count text below a web comp's bottom edge as visible, flagged, on the Website page only.
- (b) Keep the fixed-canvas rule now, and take web voice from the live site's copy when web is ratified at Review 2 (lane C's named gap).
- Default (b). No pack file changes. Owner of any re-cut: lane A.
