# HLR Phase 1: progression

High Light Rituals (HLR), a client brand. Phase 1: 4 weeks from Fri 2026-10-16. Live reviews: {{review-1-date}}, {{review-2-date}}, {{review-3-date}} (dates not set; owner Eddie).
Method: `_setup/brand-forge-playbook.md`. Rules: `_setup/hlr-project-instructions.md`. Kickoff: `_setup/hlr-kickoff-prompt.md`.
Registry id `hlr`; aliases HLR, High Light Rituals, HighLight, highlight-brandbook. Slot namespace `hlr`.

Each chat opens with this file, then the latest DECISIONS.md and LEARNINGS.md entries. Each chat closes with those files current, `brand-pack/figma.yaml` and `brand-pack/slotmap.yaml` updated, outputs in `outputs/`, and a five-line status: done, waiting on Eddie, next. A fresh chat at each gate.

## Step 1. Review (read-only)

- [x] Start-of-session checks: brand home, Figma connector, studio-engine version (2026-10-17)
- [x] Brand book: pages inventoried; Brand, Graphic System, Art Direction, Copy and Applications read (2026-10-17)
- [x] Fonts: files, license files and states (2026-10-17)
- [x] Marks: which exist as SVG (2026-10-17)
- [x] Inventory sheet and its links (2026-10-17)
- [x] Live site: catalog snapshot, observed tokens, claims scan (2026-10-17, `outputs/step-1-review/site/`)
- [ ] Live Figma: current templates counted by type, copy corpus from text layer names (playbook section 6), live formats and sizes. Blocked: no edit access on HLR-EMAIL or HLR-Social
- [ ] One-page Brand Review in `outputs/step-1-review/` (v1 on 2026-10-17 without the Figma sections)
- [ ] **Gate 1**: Eddie answers the ranked questions and rules on (a) who runs the forge (decided 2026-10-17: HLR's team, single-brand bundle), (b) organic social coverage, (c) where the library lives

## Step 2. Pack v0

Built per the engine's `references/pack-contract.md`: `brand-context.md` with its File map (null for roles HLR lacks); the voice contract (principles with operational definitions and sounds-like and not-like lines, never a mannerism spec); a claims ledger seed; the product database (no figure without a source); an email and social taxonomy marked draft-for-ratification; `tokens.json` (DTCG; primitives, semantic, component, layout; kebab names; a neutral ramp; a provenance tag on every token); the contrast law with its certified pairs; `figma.yaml` (namespace `hlr`, file_key null); `logo-assets.md`; `art-direction.md`; `asset-types.md`.

- [ ] Pack v0 built
- [ ] Preflight with `--pack` until nothing blocks; what degrades is reported
- [ ] Census: zero hits for any other brand's terms in the pack
- [ ] **Gate 2**: Eddie ratifies the derived tokens, the contrast law, the voice principles and the taxonomy

## Step 3. Register HLR

- [ ] Confirm which of the two 0.4.0 bundles is canonical (both are listed in the playbook, section 1)
- [ ] Add the `hlr` registry entry as a patch release; every skill description under 1024 characters
- [ ] Hand Eddie the `.plugin` to install (if Gate 1 chose a client-run forge: the single-brand bundle instead)

## Step 4. Figma

- [ ] **Gate 3**: Eddie confirms the file and the conventions before any write
- [ ] Foundations through the engine's design-system skill: pages, variables with every id recorded, text styles on the real faces with the OTFs uploaded, marks as SVG components, the certified-pairs board, the strictness map
- [ ] **Gate 4**: Eddie rules on the ground roster, CTA shape and batch scope
- [ ] Elements and the first module batch through asset-production (email at 1200px, social at the formats the review found), slot-stamped `hlr`, flex-probed, screenshot-checked
- [ ] The client's most-used templates rebuilt as pure instances
- [ ] `tokens.css` and Tailwind tokens exported from `tokens.json`
- [ ] Engine gaps logged where a skill falls short for HLR (no workarounds)

## Step 5. Forge proof

- [ ] One real HLR brief (or one Eddie supplies) through the engine for email and social: estimate before spend, measured cost after
- [ ] Eddie's blind keep or cut sheet marked; the result in LEARNINGS.md

## Reviews (default plan)

- Review 1 ({{review-1-date}}): the Brand Review and the token proposal
- Review 2 ({{review-2-date}}): Figma foundations and the first modules
- Review 3 ({{review-3-date}}): templates and the forge proof
