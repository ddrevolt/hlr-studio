# HLR Phase 1: progression

High Light Rituals (HLR), a client brand. Phase 1: 4 weeks from Fri 2026-10-16. Live reviews: {{review-1-date}}, {{review-2-date}}, {{review-3-date}} (dates not set; owner Eddie).
Method: `_setup/brand-forge-playbook.md`. Rules: `_setup/hlr-project-instructions.md`. Kickoff: `_setup/hlr-kickoff-prompt.md`.
Registry id `hlr`; aliases HLR, High Light Rituals, HighLight, highlight-brandbook. Slot namespace `hlr`.

Next-chat prompts: `_setup/next-chat-prompts.md`. Lanes run side by side, each writing only its own files and patching these records once at close (Eddie's ruling, 2026-10-17). Each chat opens with this file, then the latest DECISIONS.md and LEARNINGS.md entries. Each chat closes with those files current, `brand-pack/figma.yaml` and `brand-pack/slotmap.yaml` updated, outputs in `outputs/`, and a five-line status: done, waiting on Eddie, next. A fresh chat at each gate.

## Step 1. Review (read-only)

- [x] Start-of-session checks: brand home, Figma connector, studio-engine version (2026-10-17)
- [x] Brand book: pages inventoried; Brand, Graphic System, Art Direction, Copy and Applications read (2026-10-17)
- [x] Fonts: files, license files and states (2026-10-17)
- [x] Marks: which exist as SVG (2026-10-17)
- [x] Inventory sheet and its links (2026-10-17)
- [x] Live site: catalog snapshot, observed tokens, claims scan (2026-10-17, `outputs/step-1-review/site/`)
- [x] Live Figma, read from Eddie's copy in Highlight-Rituals-Design-Forge: frames counted by type and size, copy corpus from text layer names (playbook section 6), fonts and fills (2026-10-17, `outputs/step-1-review/figma/`)
- [x] Brand Review v2 in `outputs/step-1-review/` (2026-10-17; supersedes v1)
- [x] **Gate 1** closed 2026-10-17: (a) HLR's team runs the forge, single-brand bundle; (b) carousel, caption and story-set recipes in 0.5.1; (c) library file `Gq3yUbLs6MCRM0nOhjvnIW`; the pattern review's calls 2 to 8 (C4 Onyx on Alabaster; C5 Saol and Trade Gothic plus Homemade Apple; C8 1200 masters with slice-sized type; C6 outline box and text link; all four channels in Phase 1; C3 the live roster; corpus re-cut first) and Q10 ("in" names). HLR-owned questions go to Review 1 (DECISIONS 2026-10-17)

## Step 1b. Pattern review (read-only)

Every page of the reference file `LYyYXPDUHVoAABh865EvMI`, read against the brand book: patterns per channel, cross-channel equivalents, channel requirements, a draft system skeleton, outliers to retire. Deliverable: `outputs/step-1-review/pattern-review.md`. Gate 1 closes after it.

- [x] Pattern review delivered (2026-10-17, `outputs/step-1-review/pattern-review.md`; evidence in `patterns/`; frame lists for all nine pages in `figma/`)
- [x] A second pass from a parallel chat kept as evidence: `pattern-inventories/`, its deltas in `pattern-review-addendum.md` (2026-10-17)

## Step 2. Pack v0

Built per the engine's `references/pack-contract.md` (the HLR bundle's, `hlr-studio-engine` 0.5.1; confirmed by Eddie 2026-10-17): `brand-context.md` with its File map (null for roles HLR lacks); the voice contract (principles with operational definitions and sounds-like and not-like lines, never a mannerism spec); a claims ledger seed; the product database (no figure without a source); a taxonomy for email, organic social, paid and web marked draft-for-ratification; `tokens.json` (DTCG; primitives, semantic, component, layout; kebab names; a neutral ramp; a provenance tag on every token); the contrast law with its certified pairs; `figma.yaml` (namespace `hlr`, file_key null); `logo-assets.md`; `art-direction.md`; `asset-types.md`; for paid and web, `slotmap_paid`, the `section_library`, 9:16 safe zones and display floors (Gate 1 scope).

Runs as parallel lanes A to E (`_setup/next-chat-prompts.md`).

- [x] Lane A: corpus re-cut to visible text for email, organic social and paid (Gate 1, call 8; 2026-10-18; `outputs/step-2-pack/corpus/`, every row hash-checked against the file)
- [x] Lane A, web: the Website page (2026-10-18; `corpus-visible-web.tsv`, every row hash-checked on the first read); Components, Retail/Press, Print and Images out of scope (Eddie, 2026-10-18, call 1 a)
- [x] Lane A, two visibility calls put to Eddie (2026-10-18): a board's clipping on its children, and below-the-fold text in comps that scroll (2026-10-22: Gate 2 package calls 18 a and 19 b, DECISIONS)
- [x] Lane B: design side: tokens, the contrast law, marks, art direction, asset types, the token proposal for Review 1 (after the Gate 3 ruling; 2026-10-18: `brand-pack/` tokens.json, token-model.md, logo-assets.md, art-direction.md, asset-types.md; `outputs/step-2-pack/token-proposal.md`, its section 6 the Gate 2 questions)
- [x] Lane C: words side: voice contract, claims ledger seed, exemplars, lexicon, prohibited patterns (after lane A; 2026-10-18: `brand-pack/` voice-contract.md, legal-ledger.json, concrete-lexicon.json, `_proposed/exemplars.json`; `outputs/step-2-pack/voice-claims-notes.md`, its section 2 the File map entries and prohibited patterns for lane E, its section 10 the Gate 2 calls)
- [x] Lane D: structure side: products, taxonomy and route axes, planned slot maps, section library (2026-10-18: `brand-pack/` products.json, type-registry-core.json, route-axes.json, slotmap-paid.yaml, slotmap-social.yaml, section-library.json; `outputs/step-2-pack/structure-notes.md`, its section 2 the Gate 2 calls; every budget null until Step 4)
- [x] Gate 2, lane D's calls: ruled by Eddie 2026-10-18 (DECISIONS; `outputs/step-2-pack/structure-notes.md` section 2): taxonomy ratified for email and organic social, paid and web at Review 2; route axes ratified; lane B's 12 affected lines patched on his go
- [x] Gate 2, lane C's calls: ruled by Eddie 2026-10-21 (DECISIONS; `outputs/step-2-pack/voice-claims-notes.md` section 10): voice principles ratified; exemplars approved, lane E moves the file and sets the role; the six prohibited patterns; karat and metaphysical rows flagged without a sign-off; the disclaimer as its own row; house defaults; founder voice
- [x] Lane E: Pack v0 assembled: `brand-context.md` with its File map; preflight with `--pack` until nothing blocks, what degrades reported; census zero (after lanes B, C and D) (2026-10-23: nothing blocks, 8 roles degrade by design; census 0; round 3 guards and their mutation tests; `outputs/step-2-pack/preflight.md` section 7)
- [x] **Gate 2**: Eddie ratifies the derived tokens, the contrast law, the voice principles and the taxonomy (2026-10-22: every call of `outputs/step-2-pack/gate-2-package.md` at its default, applied in `brand-pack/`; DECISIONS)

## Step 3. Register HLR

- [x] Confirm which of the two 0.4.0 bundles is canonical: the installed copy (2026-10-17, `outputs/step-3-bundle/bundle-report.md`)
- [x] Brand-free engine release studio-engine 0.5.0 and the bundle `hlr-studio-engine` 0.5.0 (2026-10-17; installed; superseded by 0.5.1)
- [x] studio-engine 0.5.1 and `hlr-studio-engine` 0.5.1: another brand's content found by audits and overlap scans removed; Gate 1 (b) organic social (S03 carousel and S04 story-set recipes, the `social-copy` skill); the fresh-context review's findings fixed; Cowork shells read the pack through `~/mnt/claude-cowork`; two Gate 3 gaps fixed; registry `hlr` only, pack referenced live, 11 skill descriptions under 1024 characters, census 0, overlap scans clean, 662 tests pass in the cloud and on the Mac (2026-10-17)
- [x] Hand Eddie the `.plugin` to install over 0.5.0: `outputs/step-3-bundle/hlr-studio-engine-0.5.1.plugin` (2026-10-17; installed by Eddie the same day)
- [x] Lane H: 0.5.2 after Gate 3: the component collection, ground modes on the semantic collection, scopes, font style in the token grammar, `collections.component` in the pack contract (2026-10-18: built and reviewed in three rounds, not installed; `outputs/step-3-bundle/bundle-report-0.5.2.md`)
- [x] Eddie rules on the two findings round 3 left open (the 0.5.2 bundle report, section 7, item 1), then installs `hlr-studio-engine` 0.5.2 over 0.5.1: `outputs/step-3-bundle/hlr-studio-engine-0.5.2.plugin` (2026-10-20: ruled, 0.5.2 is never installed; superseded by 0.5.3, DECISIONS 2026-10-20)
- [x] Lane H: 0.5.3 before Chat 5: canvas modes on `HLR / Layout` and the `stroke` category (Gate 2 question 1, Eddie 2026-10-18; spec in `outputs/step-2-pack/token-proposal.md` section 7), with what Eddie rules into it from the 0.5.2 bundle report's section 7; then install 0.5.3, since 0.5.2's `check`, `export` and `figma-plan` stop on the canvas-mode pack (2026-10-21: built, reviewed in three rounds, handed to Eddie; `outputs/step-3-bundle/bundle-report-0.5.3.md`)
- [x] Eddie installs `hlr-studio-engine` 0.5.3 over 0.5.1 (`outputs/step-3-bundle/hlr-studio-engine-0.5.3.plugin`) and rules on the 0.5.3 bundle report's sections 6 and 7 (2026-10-22: installed; sections 6 and 7 at their defaults, DECISIONS)
- [ ] Lane H: 0.5.4 before Chat 6: R3-01 and R3-02, 0.5.2's round 3 notes R3-03 to R3-07, the R5 and R6 guards, lane D's engine gaps, lane C's `flag` severity and 0.5.3's round 3 notes (DECISIONS 2026-10-20 and 2026-10-21; prompt in `_setup/next-chat-prompts.md`) Scope trimmed to Chat 6's email needs (slot_lint.js on every prefix, R3-01, R3-02, R3x-02); the rest moves to 0.5.5 (DECISIONS 2026-10-22). Not run before Chat 6: Chat 6 ran on 0.5.3 with its limits logged (DECISIONS 2026-10-23).
- [ ] At handoff: rebuild with HLR's own pack path, unless their brand home sits under a `claude-cowork` folder

## Step 4. Figma

- [x] **Gate 3** (lane G): Eddie ruled the file and the conventions (2026-10-17, chat 4: `outputs/step-4-figma/gate-3-conventions.md`, DECISIONS); the variables and text styles wait for Pack v0 and Gate 2
- [x] Foundations through the engine's design-system skill (2026-10-17: the pages, the four empty collections with their modes and the six empty boards exist; ids in `figma.yaml`): pages, variables with every id recorded, text styles on the real faces with the OTFs uploaded, marks as SVG components, the certified-pairs board, the strictness map (2026-10-23, Chat 5: built, with the text styles on the stand-ins under Gate 2 question 2 and the license flag raised; guards R8 and R13; DECISIONS)
- [x] **Gate 4**: Eddie rules on the ground roster and batch scope (CTA shape ruled at Gate 1, C6) (2026-10-23: decided by Claude under Eddie's delegation, for Eddie to confirm: grounds light, warm, deep and night; the placeholder label ink; the strictness map adopted; email first; DECISIONS)
- [ ] Before the first paid build: a person confirms the 9:16 keep-clear bands and the copy limits in Meta's Ads Guide, and `placement-specs.json`'s `_verified` moves (DECISIONS 2026-10-18)
- [ ] Elements and the first module batch through asset-production (email at 1200px with slice-sized type; social, paid and web at the formats the review found), slot-stamped `hlr`, flex-probed, screenshot-checked
- [ ] The client's most-used templates rebuilt as pure instances
- [ ] `tokens.css` and Tailwind tokens exported from `tokens.json`
- [ ] Engine gaps logged where a skill falls short for HLR (no workarounds)

## Step 5. Forge proof

- [ ] One real HLR brief (or one Eddie supplies) through the engine for email and social: estimate before spend, measured cost after
- [ ] Eddie's blind keep or cut sheet marked; the result in LEARNINGS.md

## Process

- [x] Lane F: REVIEW.md at the brand home root, the review rules every lane's review reads (2026-10-18; three fresh-context review rounds; in the project docs; Eddie ruled its seven calls the same day)
- [x] Release-check tools kept outside the brand folders: `claude-cowork/_tools/release-checks/` (2026-10-17)
- [x] Git checkpoint of the 2026-10-18 lanes; the two 0.5.0 bundles removed from history (2026-10-20, DECISIONS)
- [ ] Census over every commit in git history with `claude-cowork/_tools/release-checks/`, before the repo goes to HLR

## Reviews (default plan)

- Review 1 ({{review-1-date}}): the Brand Review and the token proposal, with Eddie's Gate 1 picks (C3, C4, C5, C6, C8) for HLR to confirm
- Review 2 ({{review-2-date}}): Figma foundations and the first modules, with the paid and web taxonomy ratified on them (Gate 2 call 1 b)
- Review 3 ({{review-3-date}}): templates and the forge proof
