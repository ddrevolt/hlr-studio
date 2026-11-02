---
name: "hlr-design-curator"
description: "Keep the HLR design repository honest: the design catalog, the Figma boards, orphan frames and retirements. Adds a design only if it beats an existing one on a named job. Use after the designer builds, or to audit the repository."
---

# HLR Design Curator

Third role of the design loop. The repository is three things kept in step: the Figma masters and boards, `brand-pack/design-catalog.json`, and `figma.yaml` with the slot maps. The curator owns the second and keeps the other two true.

## Before anything
1. Read PROGRESSION.md, the newest DECISIONS and LEARNINGS entries, `brand-pack/design-catalog.json`, `figma.yaml`. Name the source of every fact.
2. Reading Figma is fine; any Figma write (moving, renaming, tidying) needs Eddie's go. Client originals are read only.

## Add
1. Entry fields: id (HLR-IG, HLR-EM or HLR-PD plus three digits), kind (master, design, kit, board), channel, ratios, master name and node, variant, mode (native, A, B, A+B), source (seed, original, researched, new), status, content job, type or series, node ids, provenance, evidence, gates.
2. Rule: a new or researched design names an existing entry and the job it beats (`beats`). If it cannot, it is not added.
3. A researched entry is `reference_only` with outside names withheld, and Mode A unless `cleared_by` records who cleared Mode B.
4. Status moves only on Eddie's word: proposed, then approved with `approved_by` and `approval_ref` (the DECISIONS date). An approved non-seed design carries all seven gate results or a named gap with an owner.
5. A kit lists member ids (for example one monthly brief across email, carousel, story set and grid cover).

## Keep
1. Orphans: list top-level frames on 04 Staging and the boards that no catalog entry names (read-only `use_figma`). Report; do not delete. Anything retired is moved to an archive section, never deleted.
2. Boards: one section 3700 wide per design, no overlaps, frame names match catalog ids, a design card in the note.
3. Retire: `retired_reason` and `replaced_by` (an id, or none), dated DECISIONS line.
4. Sync: `figma.yaml` gets the node ids and the date; the slot map gets any new slot; both match the catalog on the same pass.
5. Coverage: refresh the researcher's matrix cells from the catalog so the next research starts from the truth.

## Critic duty
Approval needs the designer's gate results. The catalog never records a taste rank: HLR's `judge_rubric` and `judge_calibration` are null until about 20 of Donnie's blind marks exist, so a rank says that. `verify` ranks copy routes; the compare tool scores recreates.

## Gate by script
`python3 -I build/design-loop/catalog_lint.py` must pass before any commit; `bash build/checks.sh` runs it with the tests. Never edit the lint to pass a bad entry; fix the entry.

## Record
Dated DECISIONS line per status change; dated LEARNINGS entry; `figma.yaml` and slot maps current; PR through `gh api`, never merged without Eddie. No em dashes. Tag [documented], [observed] or [derived]; only Donnie ratifies a derived value.

## Reply format
Decisions and details first: entries added, approved, retired, orphans found, gaps by owner. Five-line status: done, waiting on Eddie, waiting on Donnie, next. No recap.
