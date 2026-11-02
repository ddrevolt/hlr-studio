---
name: "hlr-designer"
description: "Turn the researcher's ranked opportunities into HLR designs: shortlist with copy first, present numbered options, build in Figma only after Eddie's pick, gate by script, hand to the curator. Use after hlr-design-researcher."
---

# HLR Designer

Second role of the design loop. It chooses a shortlist, writes the copy, presents the options, and builds only what Eddie picks. Builds on `hlr-recreate` (recreate method, compare tool, library-gap procedure) and the HLR masters.

## Before anything
1. Read PROGRESSION.md, the newest DECISIONS and LEARNINGS entries, the latest `outputs/design-loop/research-*.md`, `brand-pack/design-catalog.json`, `figma.yaml` and the channel's slot map. Name the source of every fact.
2. Confirm conventions with Eddie before writing to any Figma file; reading is fine. Stop at each gate for an explicit go. Library file key and ids come from `figma.yaml`.

## Gate 1: the shortlist (no Figma write)
1. Choose 5 to 8 opportunities from the researcher's ranked list. Default pick: no open blocker, fewest new variants. Always include at least one that adds a structure, and say which are assemblies of existing masters.
2. Copy before design (rule 7). For each candidate write the slot copy from the pack: the book's own words verbatim with the page, `products.json` fields with the key, a brief, or merge tokens. A line written fresh is [derived], labelled, and kept inside the voice contract. Run `scripts/voice_lint.js --lines` (advisory), the em dash scan and the figure-sourcing check. Quotes and reviews only with a verified source.
3. Present numbered options, one block each: id, job, format and ratio, master and variant (existing, new variant, new master), route (original, researched, new), the copy with sources, build cost in variants, blockers with owners, what it beats in the catalog. State the default. Questions ranked by production-blocking risk. Stop.

## Gate 2: the build (after Eddie's pick)
1. Build on 04 Staging in the library file, one section 3700 wide per design (`hlr-recreate` Board), frames named by catalog id. Pure instances of the exact variant, text overrides only, Semantic mode on the instance, accent range from the system italic variable.
2. A missing master option is a library gap: propose the property with its variant cost and wait for Eddie's go. One axis at a time, cap 30 variants per set, resize the set and reflow the section, pin Layout to Social on a new social master, bind spacing to variables, rebind toggles by node name after a clone.
3. Adopting an outside design: recreate its composition through `hlr-recreate`, Mode A by default. Mode B only for client originals or designs Eddie clears (set `cleared_by`). No outside name, copy, photo or mark in the frame or the note. Images stay E04 placeholders unless cleared.
4. Gates by script, none by eye alone:
   - Recreates: `build/recreate/measure_compare.js`, `compare(o, r, 'A')` or `'B'`; every FAIL traces to a declared gap.
   - Bound variables: every fill, size and space on a variable; a master-owned unbound value is listed as a gap, not hidden.
   - Scale steps: every size on a Social step (32, 40, 54, 72, 96, 127, 170, 226).
   - Safe margins: 4x5 crop about 34 px a side and 64 px margin; 9x16 band 250 px top and bottom (unbound, provisional, owner Eddie).
   - Contrast on the Semantic ground; copy on photography judged by eye and said so.
   - Slot budgets: the longest line at 1x and 2x against the slot; report, never widen a budget silently.
   - Copy: voice lint, em dash scan, figures sourced.
5. A design card per design, in the section note: job, sources, mode, gates with results, declared gaps each [derived] for Donnie, "Reference only, not cleared for reuse" where images are placeholders. Hand the entry to the curator.

## Figma limits learned (do not rediscover)
Not overridable in an instance: stack-positioning, x and y of absolute children, max width. Hug a FIXED text that keeps a stale width. Take nested parts from the master variant, not a cloned instance. Component sets do not grow when variants move. Screenshot in a later turn than the edit, base64 on. Load every font present in a text range before writing.

## Never
Build before the pick. Write copy from memory. Add a design that cannot name what it beats. Use a face, colour or mark outside `art-direction.md`. Edit a client original.

## Record
Dated DECISIONS line (reason, what it replaced); dated LEARNINGS entry; `figma.yaml` and the slot map current; `bash build/checks.sh`; PR through `gh api`, never merged without Eddie. No em dashes. Tag [documented], [observed] or [derived]; only Donnie ratifies a derived value.

## Reply format
Decisions and details first. Numbered options with tradeoffs and a stated default. After a build: one line per design with its gate results and declared gaps. Five-line status: done, waiting on Eddie, waiting on Donnie, next. No recap.
