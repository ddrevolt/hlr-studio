---
name: "hlr-recreate"
description: "Recreate an existing HLR design in Figma in two modes, A system-faithful or B work-faithful, scored by a read-only compare with a gap list and ledger. Use for any replicate-this request."
---

# HLR Recreate v2

The original supplies composition and copy. The library supplies parts and variables. Two modes, both scored by numbers, never by eye alone.

- Mode A, system-faithful: only system parts and variables. Every size snaps to the nearest Social scale step (32, 40, 54, 72, 96, 127, 170, 226). Ground from the Semantic mode on the instance. Output is a pure instance. Where the system cannot say what the original says, record a declared gap with a proposal; never draw it ad hoc.
- Mode B, work-faithful: the original's sizes, line height, colours and positions, using system parts and variables wherever one fits. Every value outside the system goes in a ledger with its nearest system value and a ratify proposal.
- Default when the request does not say: build both, A first, side by side. If it says "exactly", "as is" or "match it", B. If it says "in our system", A.

Builds on the generic `figma-recreate` skill (structure, slot and fidelity contracts). Tooling lives in the repo: `build/recreate/measure_compare.js`.

## Before anything
1. Read PROGRESSION.md, the newest DECISIONS and LEARNINGS entries, brand-pack/figma.yaml and the slotmap for the channel. Name the source of every fact.
2. Library key and ids come from figma.yaml. Confirm conventions with Eddie before writing to Figma; stop at each gate for an explicit go. Client originals are read only: work on clones inside the library.
3. View the original (screenshot) before writing any note about it.
4. Declare the non-negotiables: copy verbatim, accent (italic) ranges read from the original, marks (star, handle) present, ground colour. These are scored.

## Method
1. Inventory: census the originals by name family and ratio. Never trust a section name. Pasted nodes get new ids; match by name and size.
2. Map the family to a master (S01, S03, S04, S05, P01 to P09) and a variant. Paid originals map through outputs/step-9-organic/paid-complements.md. No CTA and no handle on paid; handle is the E16 element on organic. If no master fits, that is a gap.
3. Build A: createInstance of the exact variant, toggle properties, override text only. Set Semantic mode on the instance (night gave the exact Onyx ground). Accent words take the system italic variable on the range, never on the master.
4. Score: paste measure_compare.js at the top of a use_figma call. `measure(original)` and `measure(rebuild)` read text, marks and ground as fractions of the frame; `compare(o, r, 'A')`. Read only.
5. Gate A: every row passes, or each FAIL traces to a declared gap. Thresholds [derived, Donnie ratifies]: size equals the nearest step; placement within 0.06 and the same third; colour within 0.2; a quantising jump beyond x1.25 or x0.8 is listed in gaps as a scale gap.
6. Library gap: if the cause is a missing master option, propose a property with its variant cost and stop for Eddie's go. When built: one axis at a time off the default, cap 30 variants per set, resize the set and reflow the section after variants move, pin the Layout collection to Social on the new master, bind spacing to variables, rebind toggles by node name after any clone (a clone drops componentPropertyReferences), then rerun the compare.
7. Build B from a clone of A, in this order, stopping at the first rung that scores:
   1. system part and property toggles;
   2. bind colours to the exact variable (distance 0.005 or less; a primitive when no semantic role fits, flagged);
   3. unbind fontSize, set the original's size, copy its line height and letter spacing; keep the face on system variables where one matches (Regular is 19:51, Regular Italic 19:52);
   4. spacing: Content to MIN, zero gaps, then one paddingTop per block; shift the centre with side padding;
   5. wrapper frame holding the instance plus a separate system part (Star, Handle) for any element that must sit off the layout;
   6. detach, only if nothing else scores, logged as off-system.
8. Gate B: `compare(o, r, 'B')` passes with no declared gap: size within 3 percent, position within 0.01, colour within 0.03, same face, displayed case, alignment and line count. Run `offSystem` on the A and B instances; the ledger is B minus A (master-owned unbound values appear in both).

## Figma limits learned (do not rediscover)
- In an instance these cannot be overridden: stack-positioning (absolute), x and y of absolute children, max width. Padding, gaps, size, fills, fontSize (unbind first), range font bindings can.
- A text set FIXED inside an instance can keep a stale width and wrap; hug it (WIDTH_AND_HEIGHT).
- A cloned instance's nested main components can point to ghost ids: take the part from the master variant.
- Component sets do not grow when variants move; unsized variants render blank (1x1 screenshot).
- Screenshots right after an edit can show the old state: screenshot in a later turn, with base64 on.

## Board
04 Staging, one section 3700 wide per pattern: Original | A | B at x 100, 1280, 2460, then one note: what is the same, what changed, declared gaps G1, G2 with proposals, each marked [derived] for Donnie, and "Reference only, not cleared for reuse". Images stay E04 placeholders unless cleared. Name the frames "Ours A / system-faithful" and "Ours B / work-faithful". Defects of the original are named, not copied.

## Checks before reporting
- No unbound fill, space or size in A; slots stamped with the module prefix.
- Safe margins: 4x5 crop about 34 px a side and 64 px margin; the 9x16 band is 250 px top and bottom, unbound and provisional (owner Eddie, proposal space/story-safe).
- Flex: the original's longest line against the slot budget at 1x and 2x. Report; never widen a budget silently.
- Contrast on the Semantic ground.

## Record
Dated DECISIONS line with reason and what it replaced; dated LEARNINGS entry; figma.yaml and slotmap current; `bash build/checks.sh`; branch and PR through `gh api`, never merged without Eddie. No em dashes anywhere. Tag every rule [documented], [observed] or [derived]; only Donnie ratifies a derived value.

## Reply format
Decisions and details first. Two lines: A score with its declared gaps, B score with ledger count. Numbered options with tradeoffs and a stated default, ranked by production-blocking risk. Five-line status: done, waiting on Eddie, waiting on Donnie, next. No recap.
