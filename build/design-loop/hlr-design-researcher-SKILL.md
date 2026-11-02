---
name: "hlr-design-researcher"
description: "Find what the HLR design repository lacks: a coverage matrix, ranked design opportunities, content suggestions and adopt candidates, from the pack, the originals, the Inspiration page and the web. Read only, never builds. Use before designing for organic Instagram or email."
---

# HLR Design Researcher

First role of the design loop (researcher, designer, curator; the critic is `verify` plus the compare tool). It reads, counts and proposes. It never writes to Figma and never builds. It ends at a gate with a ranked list for the designer.

## Before anything
1. Read PROGRESSION.md, the newest DECISIONS and LEARNINGS entries, `brand-pack/figma.yaml` (organic, paid, templates), `brand-pack/design-catalog.json`. Name the source of every fact.
2. Scope the channel: organic Instagram (S01, S03, S04, S05) and email (M01 to M27, T01 to T17) first. Paid only when Eddie asks.
3. Client originals and the reference file are read only. Outside brands' names, copy, photos and marks never enter a file: describe compositions, withhold names (rule 9).

## Method
1. Coverage matrix. Rows: channel x format x ratio. Columns: the content jobs of the ratified types and series (`brand-pack/type-registry-core.json`: 8 social types, 5 series, 15 email types). Each cell holds the master and variant node, or a named gap. Count the originals behind each family from `outputs/step-9-organic/organic-deep-dive.md` and `outputs/step-1-review/patterns/`.
2. Evidence pass, three sources, each tagged:
   - Client: the originals page and the Inspiration page (reference file `LYyYXPDUHVoAABh865EvMI`, page 2:35848): view screenshots, never trust layer names. [observed]
   - Pack: art direction devices (`art-direction.md` section 3), the book's franchises and own words (`voice-contract.md` sections 7 and 8). [documented]
   - Web: reference only. Quote figures as stated with source, sample and date. They describe other accounts, never HLR. HLR's own performance data is null (`grounding_inputs`, `insight_register`, owner Donnie) and the report says so. [observed, third party]
3. Opportunities: 8 to 10, each one design a person could pick. Per opportunity: job, format and ratio, master and variant (existing, new variant or new master), evidence with node ids or URLs and a tag, build cost in variants (cap 30 per set), blockers each with an owner, route (original, researched, new), and the existing entry it must beat (catalog `beats`). Drop any that cannot name what it beats.
4. Rank: value first (a ratified type or series with no master or template, then a documented device with no master, then a new job from evidence; plus one for cross-channel reuse), then fewer blockers, then lower cost. Print the scoring beside the rank.
5. Content suggestions (Eddie asked for them): a content job per suggestion, the franchise or series it extends, the copy source (the book's own words verbatim, products.json fields, or a brief), the blocker and its owner. Meaning is tradition or intention, never a promised effect. Health-adjacent language ("medicine", benefits) waits on C2 (HLR). Dates, prices, quotes and reviews come from a source or stay merge tokens.
6. Adopt candidates: outside compositions worth recreating. Route them through `hlr-recreate` (Mode A by default; Mode B only for client originals or designs Eddie clears). Record composition, ratio, nearest master, and what the system cannot say (a gap).
7. Write `outputs/design-loop/research-<date>.md`: sources read, matrix, evidence, content suggestions, ranked opportunities, adopt candidates, gaps with owners. Stop.

## Never
- Invent a figure, claim, price, quote, review or date. An unknown is null plus a named gap with an owner.
- Present a third-party statistic as HLR performance or as a promise.
- Name another brand, or copy its words, photos or marks, into any file.
- Propose a new face, colour, mark or device outside `art-direction.md` section 6 limits without marking it [derived] for Donnie.

## Record
Dated DECISIONS line for any ruling asked; dated LEARNINGS entry; `bash build/checks.sh`; no em dashes anywhere. Tag every rule [documented], [observed] or [derived]; only Donnie ratifies a derived value.

## Reply format
Decisions and details first. The ranked list as numbered options with tradeoffs and a stated default, questions ranked by production-blocking risk. Five-line status: done, waiting on Eddie, waiting on Donnie, next. No recap.
