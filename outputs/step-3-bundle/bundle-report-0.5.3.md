# Step 3: engine 0.5.3 and the bundle

2026-10-21, lane H (the lane H 0.5.3 prompt, on Gate 2 question 1). In this folder: `hlr-studio-engine-0.5.3.plugin` (the one to install over 0.5.1, same name), `studio-engine-0.5.3.plugin` (the engine it is built from), `build_bundle.py` (unchanged; rebuilds either) and the three review rounds (`review-engine-0.5.3-r1.md` to `-r3.md`, each with the author's status at its end). Eddie's ruling on the 0.5.2 report's section 7, item 1: 0.5.2 is never installed and 0.5.3 replaces it, because 0.5.2's `check`, `export` and `figma-plan` stop on the canvas-mode pack (DECISIONS 2026-10-20).

## 1. What 0.5.3 changes

**The six items of the token proposal's section 7** (tests first; `design-system` and `asset-production`):
1. **Canvas modes on `HLR / Layout`.** `tokens.json` declares them at its root (`"layout": ["web", "social", "email"]`, the first the default) and `check`, `export` and `figma-plan` accept them. The plan creates them in `HLR / Layout`: per collection `figma.yaml` records, `figma_modes` says what the build does, here rename the recorded `default` mode (7:3) to `web` and create `social` and `email`, their ids then recorded in `collection_ids.layout`. Only the recorded `default` (the one mode the engine names for an undeclared collection) is ever renamed; any other recorded mode the tokens do not name stays a finding.
2. **The canvas grammar.** A Layout token with `$extensions.com.hlr.modes` states every alternate canvas (`canvas-mode-missing`); a canvas the root does not declare, or the default named there, is `canvas-mode-undeclared`; a Layout token without modes holds its `$value` on every canvas; every `font.size.*` and `stroke.*` token carries modes, itself or through the token it aliases, or it is `canvas-mode-required`. Canvas modes on a font family or style are `canvas-mode-unsupported` (the stand-ins and the faces to load are per family), and modes on a primitive, a component token or a token the plan does not create are `modes-misplaced` (0.5.2's `modes-outside-semantic`). Aliases resolve on each canvas; a cycle or a dangling alias on one canvas names it.
3. **The `stroke` category.** Planned in Layout, scoped to `STROKE_FLOAT`; `component.cta.weight` aliases `stroke.cta` in one mode and follows the canvas through the alias (the plan shows `canvas_values`: web 1, social 2, email 2).
4. **Export from `web` only.** `tokens.css` and `tailwind.tokens.js` carry the default canvas; `tokens.flat.json` keeps every canvas under `canvas`. The `[data-ground]` blocks are unchanged.
5. **Text styles.** The 15 styles bind their size to the moded `font.size` variables, so the frame's canvas mode sets the size; the plan gives each style `font_size_by_canvas`. Leading, tracking and case stay set on each style, unbound, in percent (Gate 2 question 3), and a px leading or tracking on a size that changes by canvas is a finding.
6. **Masters on their canvas.** `asset-production` plans each master's canvas from the pack's `asset_types` (email masters `email`; feed, story and Meta paid `social`; web and IAB display `web`), sets it on the master's root, every master and the default canvas too, and leaves every element on Auto (`figma-recipes.md`, "A master on its canvas", and the agent package). `canvas_check.js` reads a paged canvas inventory of the built frame against the plan the library was built from: a master on Auto or on another canvas, an element that sets one, and a text size or stroke weight that is unbound or renders off its variable's value on the canvas are findings, before the flex probe measures anything. `measured_at` names the canvas, and `slot_lint.js --pack` warns when a measured social or web entry names none (C5c; email and paid entries are R3x-05, section 7).

**From the review (rounds 1 and 2):** the stand-in switch is per canvas mode, since the family and style variables sit in `HLR / Layout`: `font_switch` names every mode for each variable and counts the values (8 variables, 24 values on HLR's pack), the build's leave-it rule reads every mode and reports a partly switched variable, and `face_check.js` says to switch in every mode. `canvas_check.js` compares every node's resolved mode with the master's canvas (so a pin it cannot see as an override still shows), finds any pin inside an element, checks a variant set on every variant (never the set's own frame, Figma's container), checks stroke weights as it checks sizes, and holds an element's stroke to that element's weight (a CTA outline coloured by `component.cta.stroke` takes `component.cta.weight`, not the rule's). A typed label inside the recipe's own placeholder frame warns (an `E##` placeholder element and the agent package's rectangle still fail: R3x-02), a master the roster names `none` skips the check, and a master too big for one first page is checked per section with `--section` (which reads neither the master's root nor a set's other variants: R3x-03). The build binds stroke weights (the skill's binding rule, the recipe, the agent package). A slot map entry records its own canvas (`canvas`, exported from `meta.canvas`), and `slot_lint.js` warns when it is missing or `measured_at` names another. The plan says what `figma.yaml → collection_ids` reads after the build (`figma_modes.record_as`) and lists the aliases that point to a later collection (`forward_aliases`: `component.cta.weight` to `stroke.cta`), so the build creates every variable before setting any value. Tailwind carries stroke weights as `borderWidth`. The first build that places an element in a master reads how an instance reports its main component's mode and records it in its LEARNINGS entry.

**Also in 0.5.3:** `check` counts token findings apart from contrast failures (0.5.2 counted the canvas modes in its contrast total), prints a canvas line, and its exit stays 1 on either; every Layout variable states its value on every canvas (`held: true` where the token keeps its `$value`), so the build never leans on what Figma copies into a new mode, which the Plugin API reference does not say; `export`'s findings line says which findings leave a token out. Tests: 28 files, 767 checks (0.5.2: 27 and 730): 13 canvas tests in `test_tokens_build.js` (TB8 reworded for the canvases), the new `test_canvas_check.js` (22, six of them running the recipe from the markdown on a mock file), FC13 in `test_face_check.js` and ST10 in `test_slot_lint.js`. 0.5.2's own tests run against the 0.5.3 code fail only TB8, on the intended rename of `modes-outside-semantic` (rounds 1 and 3).

`BUNDLE.md` inside the plugin says a placeholder's typed label only warns (its lines 9 and 12); that holds for the recipe's own placeholder frame only, until 0.5.4 (R3x-02).

## 2. The bundle: hlr-studio-engine 0.5.3

- Same name, registry, aliases and pack path as 0.5.1 (`hlr` only; pack read live from `/Users/eddie/Documents/claude-cowork/highlight-brandbook/brand-pack`, through `~/mnt/claude-cowork` in a Cowork shell).
- `BUNDLE.md` at the plugin root states the canvas modes, the Gate 3 conventions, the faces, the engine defaults and what waits for 0.5.4.
- **sha256** (rc4, the build round 3 read): `hlr-studio-engine-0.5.3.plugin` 99bee31dbb0400335f86ab083e108176689d1af8f890d8a3468d6824d7e04363; `studio-engine-0.5.3.plugin` 70e05b2457fee7052db27a5862fc45edd65043dc9987728e1a17a05dfef4fd0c.

## 3. Checks

REVIEW.md section 3, run in the Mac's Cowork shell on the shipped files (rc4, the build round 3 read; Node v22.23.2, Python 3.10.12); the cloud ran the tests on both plugins and the pack commands on a copy, and round 3 reran tests, descriptions, the spec scan, the sha256 and the pack commands.

| # | Check | Result |
|---|---|---|
| 1 | Tests | 28 files, 767 checks, 0 failed, 0 non-zero exits, on both plugins, on the Mac and in the cloud |
| 2 | Census, other brands | rebuilt list 327 terms, none new or dropped against 0.5.2's; 0 hits in both plugins and both unzipped folders |
| 3 | 8-word runs | 1,089 file and span pairs (0.5.2: 1,083); 7 new, each read: 3 engine-origin (lines reused from `face_check.js` and `test_slot_lint.js`; the token model's own grammar line re-split), 4 coincidental code idioms; no brand content |
| 4 | Quoted strings | 741 (0.5.2: 737); 9 new, each read: 4 engine-origin (token paths in the engine's naming grammar; the copy lints' own status phrase), 5 coincidental generic phrases and code; no brand content |
| 5 | Descriptions | 11 skills, all under 1024 characters; longest 981 (`asset-production`) |
| 6 | Platform numbers | paid specs verified 2026-07-27 (3 sources), organic 2026-10-17 (9 sources); every number has a confidence; the six far numbers are the organic grid crops, as in 0.5.2 |
| 7 | Build | both plugins rebuilt from the shipped engine to the shipped sha256; 0 runtime files in either |
| 8 | Resolution | name, alias and folder: rc 0, pack found, no traceback (lane E's `brand-context.md` is in); `nonesuch`: rc 2 |
| 9 | Pack | `check`, `export` and `figma-plan` exit 0 on a scratch copy and on the live pack, with the counts in section 4 |
| 10 | Review | three fresh-context rounds (section 5); none left a blocker or should-fix open |
| | Em dashes | 0 added by 0.5.3; the 65 engine files that carried them in 0.5.1 are unchanged |

The census list and the scan outputs name other brands, so they live in `claude-cowork/_tools/release-checks/0.5.3/` (`terms.txt`, `runs.txt`, `ngram-all.jsonl`, `quotes.txt`, `new-hits-classified.md`, and each build's `out/`).

## 4. The pack

Done means `check`, `export` and `figma-plan` pass on a scratch copy of `brand-pack/`, re-run on the live pack right before the build. Both ran with lane E's `brand-context.md` in the folder; the live run below is the final one (2026-10-21: tokens.json sha256 09b23b04..., figma.yaml 7f3b17f3..., unchanged through the lane, and `brand-context.md` as lane E last wrote it):

- `check`: exit 0. 32 graded pair-roles pass, 4 recorded failures keep their restriction; the canvas line says 10 tokens vary by canvas and contrast is graded per ground.
- `export`: exit 0. `tokens.css` and `tailwind.tokens.js` carry the web scale only (label 12 to display-xl 79 px; `stroke.cta` and `component.cta.weight` 1 px; Tailwind's `borderWidth.cta` 1 px); `tokens.flat.json` keeps all three canvases for the 10 tokens that vary (the 8 sizes, `stroke.cta`, `component.cta.weight`). `font.style` stays out of the web files (14 tokens), as in 0.5.2.
- `figma-plan`: exit 0, no finding. Primitives 17, Semantic 10, Component 16, Layout 45 over `web`, `social` and `email` (9 change by canvas, 36 hold one value), 15 text styles with their size per canvas, not planned 14 (`font.weight` 4, `font.leading` 8, `font.tracking` 2): the token proposal's forecast to the count. `figma_modes` on `HLR / Layout`: rename `default` (7:3) to `web`, create `social` and `email`, after which `collection_ids.layout` reads `web: 7:3` and the two new ids. `forward_aliases`: `component/cta/weight` to `stroke/cta`. `font_switch`: 8 variables in 3 modes, 24 values. Faces to load: Instrument Serif Regular and Italic, Homemade Apple Regular, Inter Regular and Bold.

0.5.2 on the same pack stopped all three: 10 findings in `check` and `export`, 12 in `figma-plan` (the canvas modes read as ground modes out of place, `stroke.cta` not planned, `component.cta.weight` dropped with it, the recorded `default` mode a finding).

## 5. Review

Three fresh-context rounds against REVIEW.md, each on the build in hand; the reviewers never read the author's transcript.

| Round | Build | Blocker | Should-fix | Note | Cost |
|---|---|---|---|---|---|
| 1 | rc2 | 0 | 4 | 7 | 0.42M tokens |
| 2 | rc3 | 0 | 1 | 6 | 0.51M |
| 3 | rc4 | 1 | 0 | 5 | 0.49M |

- **Blocker, 1:** R3x-01, the Mac battery had not run on rc4: closed, the battery ran on rc4 and every check passed (section 3).
- **Should-fix, 5, all fixed and verified by the next round's reruns:** R1-01 (the stand-in switch per canvas mode), R1-02 (a pin inside a master that the inventory cannot see), R1-03 (stroke weights unchecked), R1-04 (the bundle note's pack state), R2-01 (a variant set's own frame read as a variant).
- **Notes, 18:** 10 fixed and verified (R1-05 to R1-08, R1-10, R2-03 to R2-07); R1-09 fixed for (c) and (d), with (a) and (b) the defaults in section 6 for Eddie; R2-02 fixed for the recipe's own placeholder and open on the element path as R3x-02; R1-11 closed at this close (DECISIONS, PROGRESSION's 0.5.2 install line); R3x-06 fixed here, every count read against the final battery log; R3x-02 to R3x-05 open, lane H, 0.5.4 (section 7).
- Round 3 also found 0.5.2's R3-04 and R3-05 classes in the new canvas inventory (section 7, item 3).
- Cost: the three review subagents 1.42M tokens in all; the main chat not measured; no Figma call.

## 6. Engine defaults until Eddie rules

One DECISIONS line (2026-10-21), as 0.5.2's were (2026-10-18). From 0.5.2, unchanged: the root `modes` grammar; a component token's scope read from the last word of its name; semantic `border` scoped to strokes; web code syntax `var(--hlr-...)`; a style no text style uses names its own family; a semantic token missing a ground is a finding; `[data-ground]` blocks in `tokens.css`, Tailwind on the default ground; `font.weight` not planned; a recorded Figma mode the tokens do not name is a finding; a face with no stand-in that does not load is reported, never replaced.

New in 0.5.3:
1. A `font.size` or `stroke` token that aliases a canvas-moded token satisfies the per-canvas rule (DECISIONS 2026-10-18 says every such token "must" state social and email; round 1, R1-09 a).
2. A component token may hold one raw value on every canvas; only `font.size` and `stroke` must state each (`component.rule.weight` holds 1 px everywhere, as the observed rules do; R1-09 b).
3. Canvas modes on a font family or style are a finding: the stand-ins and the faces to load are per family.
4. Only the recorded `default` mode is ever renamed, to the declared default; any other recorded mode the tokens do not name stays a finding.
5. Every master sets its canvas explicitly, `web` included; a variant set on every variant; an element pins no canvas anywhere inside it.
6. The stand-in switch is per mode: 8 variables, 24 values on HLR's pack (Gate 2 question 2's DECISIONS line counts the eight variables, one value each); a partly switched variable is reported and the build sets nothing.
7. A px leading or tracking on a size that changes by canvas is a finding.
8. `tokens.flat.json` keeps every canvas under `canvas`; Tailwind carries stroke weights as `borderWidth`.
9. The canvas check warns, and does not fail, on unbound decor, on a typed label inside the recipe's placeholder frame and on a nested layer that repeats its master's canvas; it never reads a variant set's own frame; an element's stroke takes that element's weight.
10. `measured_at` names the canvas as `canvas <mode>`, and a measured slot map entry records its `canvas` (a warning when it does not).
11. A master the roster names `none` takes no canvas check.
12. `check` counts token findings apart from contrast failures; the finding names `modes-misplaced` (was `modes-outside-semantic`), `canvas-mode-missing`, `canvas-mode-undeclared`, `canvas-mode-required` and `canvas-mode-unsupported`.

## 7. Open, ranked by production-blocking risk

1. **Install 0.5.3 over 0.5.1 (Eddie).** Chat 5 runs on it: on today's pack 0.5.1 cannot plan the canvas modes and 0.5.2 stops. Steps in section 8.
2. **`slot_lint.js` does not reach HLR's email (`M##`) or paid (`P##`) entries (R3x-05, pre-existing).** It reads only the web, element and social prefixes, so it exits 2 on an email or paid entry, and 0.5.3's canvas guard on `measured_at` reaches social and web entries only. It bites at Chat 6, whose first module batch is email; 0.5.4 lands before Chat 6. Options: (a) default: `slot_lint.js` lints every prefix `figma.yaml` declares, each against its own surface's slot map, in 0.5.4; (b) the docs name what checks those entries instead, which leaves the email batch's reachability unchecked. Tradeoff: (a) is a 0.5.4 item with tests; (b) costs nothing now and ships Chat 6's first batch on a stamp check alone.
3. **Seen twice, guards owed (REVIEW section 5, step 5).** Two failures came back in round 3: R2-02's placeholder label on the element path (R3x-02: an `E##` placeholder element, and the agent package's rectangle with its label beside it, exit 1 where `BUNDLE.md` says a placeholder's label only warns), and 0.5.2's R3-04 and R3-05 classes in the new canvas inventory (pages of two frames pass as one; the page budget counts characters). Their guards are code and tests, which after round 3 would ship with no review round, so 0.5.3 ships without them. Options: (a) default: assign both to lane H for 0.5.4 (both are in its prompt) with a dated DECISIONS line, and lane F adds the two rows below to REVIEW.md section 6; (b) a further 0.5.3 build now with the R3x-02 fix and its tests, which ships a change no review round read; (c) accept both gaps for Phase 1. Tradeoff: under (a), until 0.5.4 a placeholder built as an element stops the canvas check on its typed label (binding the label to the library's label style passes it, and is the cleaner build), and the two-frame mix-up needs pages of two frames fed to one run; (b) closes R3x-02 now against the three-round rule; (c) leaves both known.
   Rows for REVIEW.md section 6, paste-ready:
   `| R16 | A placeholder's typed label held to the size rule outside the recipe's own placeholder frame | lane H 0.5.3, rounds 2 and 3 (R2-02; R3x-02: an E## placeholder element, the agent package's rectangle) | K19 covers the recipe's placeholder() frame only | the label marked by its own name (IMAGE, ILLUSTRATION), with K tests through the recipe on both shapes; lane H, 0.5.4 |`
   `| R17 | A paged inventory that passes pages of two frames as one, or caps a page by characters where the limit is bytes | engine 0.5.2, round 3 (R3-04, R3-05: the face inventory); lane H 0.5.3, round 3 (the canvas inventory) | none | the frame id on every page and a byte budget in both recipes, with tests on each; lane H, 0.5.4 |`
4. **0.5.3's defaults (section 6).** Items 1 and 2 read DECISIONS 2026-10-18's "must" more loosely than its wording (R1-09 a and b). Default: ratify the twelve as listed; a no on 1 or 2 is an engine change in 0.5.4 and may change lane E's `tokens.json`.
5. **Lane C's `flag` severity (DECISIONS 2026-10-21).** Lane C's Gate 2 rulings routed an engine gap to 0.5.3 after round 3 had read rc4: `lib/claims.js` has no severity that flags each matching line without blocking, so calls 4 and 5 are flagged by count in `checked.paraphrase_review`. 0.5.3 ships without it. Options: (a) default: 0.5.4, before Chat 6 (it is in its prompt); (b) a further 0.5.3 build with it now, which ships a change no review round read. Tradeoff: under (a), copy runs before 0.5.4 list those rows by count and block nothing; (b) brings per-line flags sooner, against the three-round rule.
6. **The stand-in switch is 24 values, not 8 (section 6, item 6).** It bites when a real face is licensed and the build switches to it. Options: (a) default: by hand in the desktop app, from the plan's `font_switch`, with the build reporting a partly switched variable; (b) a switch recipe in 0.5.4 that sets all 24 values from `font_switch` in one run in the desktop app (a write). Tradeoff: (a) is 24 hand edits with a check behind them; (b) is one more recipe to test before it is needed.
7. **R3x-03 and R3x-04 (notes, lane H, 0.5.4).** Section mode reads neither the master's root nor a set's other variants (reached only past some 140 pinned nodes; Phase 1's masters hold far fewer), and the stroke mismatch message moves the weight when the colour is the mistake (a divider coloured with the CTA's stroke). Both are in the 0.5.4 prompt.
8. **First runs in Figma (not decisions).** Chat 5 is the plan's first run in a file: rename `default` to `web`, add `social` and `email`, then record the ids as `record_as` gives them, after creating every variable before any value. The canvas recipe first runs at Chat 6's first element build, which records in its LEARNINGS entry how an instance reports its main component's mode.

## 8. Install handoff

1. Install `hlr-studio-engine-0.5.3.plugin` from this folder over 0.5.1 in the Claude desktop app (same name). 0.5.2 stays uninstalled.
2. In a Cowork session, `python3 <plugin>/scripts/resolve_brand.py hlr --check` names the pack and exits 0 (lane E's `brand-context.md` is in).
3. Chat 5 still waits on Gate 2 (PROGRESSION). On today's pack its `figma-plan` exits 0 with the counts in section 4; the build creates every variable before setting values (`forward_aliases`), renames `default` to `web` and adds `social` and `email`, and records the ids as `record_as` gives them.
