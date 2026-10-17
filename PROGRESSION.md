# HLR Phase 1: progression

High Light Rituals (HLR), a client brand. Phase 1: 4 weeks from Fri 2026-10-16. Live reviews: {{review-1-date}}, {{review-2-date}}, {{review-3-date}} (dates not set; owner Eddie).
Method: `_setup/brand-forge-playbook.md`. Rules: `_setup/hlr-project-instructions.md`. Kickoff: `_setup/hlr-kickoff-prompt.md`.
Registry id `hlr`; aliases HLR, High Light Rituals, HighLight, highlight-brandbook. Slot namespace `hlr`.

Next-chat prompts: `_setup/next-chat-prompts.md`. Each chat opens with this file, then the latest DECISIONS.md and LEARNINGS.md entries. Each chat closes with those files current, `brand-pack/figma.yaml` and `brand-pack/slotmap.yaml` updated, outputs in `outputs/`, and a five-line status: done, waiting on Eddie, next. A fresh chat at each gate.

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

Built per the engine's `references/pack-contract.md` (by default the HLR bundle's, `hlr-studio-engine` 0.5.0): `brand-context.md` with its File map (null for roles HLR lacks); the voice contract (principles with operational definitions and sounds-like and not-like lines, never a mannerism spec); a claims ledger seed; the product database (no figure without a source); a taxonomy for email, organic social, paid and web marked draft-for-ratification; `tokens.json` (DTCG; primitives, semantic, component, layout; kebab names; a neutral ramp; a provenance tag on every token); the contrast law with its certified pairs; `figma.yaml` (namespace `hlr`, file_key null); `logo-assets.md`; `art-direction.md`; `asset-types.md`; for paid and web, `slotmap_paid`, the `section_library`, 9:16 safe zones and display floors (Gate 1 scope).

- [ ] Corpus re-cut to visible text first (Gate 1, call 8)

- [ ] Pack v0 built
- [ ] Preflight with `--pack` until nothing blocks; what degrades is reported
- [ ] Census: zero hits for any other brand's terms in the pack
- [ ] **Gate 2**: Eddie ratifies the derived tokens, the contrast law, the voice principles and the taxonomy

## Step 3. Register HLR

- [x] Confirm which of the two 0.4.0 bundles is canonical: the installed copy (2026-10-17, `outputs/step-3-bundle/bundle-report.md`)
- [x] Brand-free engine release studio-engine 0.5.0, then the single-brand bundle `hlr-studio-engine` 0.5.0: registry lists only `hlr`, pack referenced live, every skill description under 1024 characters, census 0, 576 tests pass (2026-10-17; ran ahead of Step 2, so every skill stops at the missing `brand-context.md` until Pack v0)
- [x] Hand Eddie the `.plugin` to install: `outputs/step-3-bundle/hlr-studio-engine-0.5.0.plugin` (2026-10-17; install pending)
- [ ] 0.5.1: carousel recipe, organic caption route and story-set recipes (Gate 1 b, ruled 2026-10-17); the engine gaps in the Gate 3 proposal; rebuild with HLR's own pack path at handoff

## Step 4. Figma

- [ ] **Gate 3**: Eddie confirms the file and the conventions before any write (proposal 2026-10-17: `outputs/step-4-figma/gate-3-conventions.md`; the build waits on Steps 1b to 3)
- [ ] Foundations through the engine's design-system skill: pages, variables with every id recorded, text styles on the real faces with the OTFs uploaded, marks as SVG components, the certified-pairs board, the strictness map
- [ ] **Gate 4**: Eddie rules on the ground roster and batch scope (CTA shape ruled at Gate 1, C6)
- [ ] Elements and the first module batch through asset-production (email at 1200px with slice-sized type; social, paid and web at the formats the review found), slot-stamped `hlr`, flex-probed, screenshot-checked
- [ ] The client's most-used templates rebuilt as pure instances
- [ ] `tokens.css` and Tailwind tokens exported from `tokens.json`
- [ ] Engine gaps logged where a skill falls short for HLR (no workarounds)

## Step 5. Forge proof

- [ ] One real HLR brief (or one Eddie supplies) through the engine for email and social: estimate before spend, measured cost after
- [ ] Eddie's blind keep or cut sheet marked; the result in LEARNINGS.md

## Reviews (default plan)

- Review 1 ({{review-1-date}}): the Brand Review and the token proposal, with Eddie's Gate 1 picks (C3, C4, C5, C6, C8) for HLR to confirm
- Review 2 ({{review-2-date}}): Figma foundations and the first modules
- Review 3 ({{review-3-date}}): templates and the forge proof
