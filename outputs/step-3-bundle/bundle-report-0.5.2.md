# Step 3: engine 0.5.2 and the bundle

2026-10-18, lane H (the lane H prompt, on the Gate 3 ruling of 2026-10-17). In this folder: `hlr-studio-engine-0.5.2.plugin` (the one to install over 0.5.1, same name, once section 7's item 1 is ruled), `studio-engine-0.5.2.plugin` (the brand-free engine it is built from) and `build_bundle.py` (unchanged; rebuilds either). Built, not installed.

## 1. What 0.5.2 changes

**The Gate 3 engine gaps, as ruled** (tests first; `design-system` and `asset-production`):
- **Four collections.** `figma-plan` plans the collections `figma.yaml` names (`HLR / Primitives`, `HLR / Semantic`, `HLR / Component`, `HLR / Layout`); component tokens alias semantic tokens (call 3 a).
- **Ground modes on the semantic collection** (call 4). The modes `tokens.json` declares at its root, in lane B's grammar: `light` the default, each alternate stated on every semantic token (a missing one is a `mode-missing` finding, never inherited). A frame on a ground sets its explicit mode on `HLR / Semantic` (a new recipe). `export` writes a `[data-ground]` block per ground; `check` grades each pair in every ground it changes in, ink on ground.
- **Scopes** (call 5 b). Every variable scoped, never all scopes; primitives also open to fills and strokes; a component token's scope comes from the last word of its name unless it declares one. The valid scope lists and their sources are in `token-model.md`.
- **Font style in the token grammar** (call 7). `font.style` beside family and size, and the text style roster (`$extensions.com.hlr.text_styles`, lane B's 42 styles) planned as text styles bound to family, style and size, with leading, tracking and case set on each style.
- **`collections.component` in the pack contract**, with `collection_ids`, `fonts.build_stand_ins` and `fonts.build_stand_in_styles`.
- **Font stand-ins** (call 7, path 1). `tokens.json` keeps the real faces. The plan sets each family variable to the stand-in `figma.yaml` names (Instrument Serif for Saol Display and Saol Standard, Inter for Trade Gothic LT Std; Homemade Apple is real), each style variable to the stand-in style `fonts.build_stand_in_styles` names, and records the real face beside each one it changes, with a switch list for the desktop app and the faces the build loads first. A later build leaves a variable already switched to its real value.
- **Text the connector cannot edit is reported, never worked around.** The connector loads Google Fonts and fonts an organization hosts, not fonts installed on the Mac (two read-only calls on 2026-10-18 ran the face inventory on three type-specimen text nodes in the reference copy: Saol Display and Trade Gothic LT Std did not load and were flagged missing; nothing was written). `asset-production` takes a paged face inventory and runs `face_check.js`, which names each blocked text node with its slot and the family and style variables to switch back, or sends it to the desktop app. Budgets measured on a stand-in are provisional, and `fit_check.js` and `slot_lint.js` say so until they are re-measured after the switch.

**Also in 0.5.2** (each from the review or the build against Pack v0):
- A null token is a gap: listed, never planned or exported. An 8-digit hex carries its alpha (the plan's `rgba`; a fill bound to the variable takes it from the variable, a raw hex fill as paint opacity); `check` will not grade a translucent color. DTCG 2025 color objects are read; any other color form is a finding.
- Token names must be lowercase-hyphen, and two names that share one CSS name are a finding with neither written. Every Figma description carries its provenance tag (an untagged one is a finding). Each variable carries its description and web code syntax (`var(--hlr-...)`).
- One YAML parser for every config and slot map (`lib/yaml.js`), which refuses a tab in indentation.
- From review round 2: the paged face check exits 1 unless the pages cover the frame; a node set in two blocked faces gets both ways forward; the YAML parser refuses a key set twice; a token or text style whose alias the plan leaves out is left out too, with a finding; the flex-probe harness restores each range's text style and variables and reads them back; an accent word binds its range to its style variable, and its face is loaded first.
- Tests: 27 files, 730 checks (0.5.1: 26 and 662). Every defect a review probe reproduced now has a test.

## 2. The bundle: hlr-studio-engine 0.5.2

- Same name, registry, aliases and pack path as 0.5.1 (`hlr` only; pack read live from `/Users/eddie/Documents/claude-cowork/highlight-brandbook/brand-pack`, through `~/mnt/claude-cowork` in a Cowork shell).
- `BUNDLE.md` at the plugin root states the Gate 3 conventions, the faces, the two Pack v0 stops with their owners, and the engine defaults below.
- **sha256:** `hlr-studio-engine-0.5.2.plugin` 659229f9a7193310a548e6809681ce02c8926ea41ddeaf20b0ef7d7665949fad; `studio-engine-0.5.2.plugin` 18087389077fe4b01ab094d1d6553b281b42c039d0e44350a237a33bc7baea59.

## 3. Checks

REVIEW.md section 3, run in the Mac's Cowork shell on the shipped files (rc8, the build the third review read); the cloud reran tests, census and rebuild.

| # | Check | Result |
|---|---|---|
| 1 | Tests | 27 files, 730 checks, 0 failed, 0 non-zero exits, on both plugins (Mac: Node 22.23, Python 3.10) and in the cloud |
| 2 | Census, other brands | rebuilt list 331 terms; the four junk terms REVIEW rule 9 names dropped (REVIEW open item 2); 327 terms, 0 hits in both plugins and both unzipped folders |
| 3 | Reverse census, HLR | a kept list of 305 terms (names and aliases, the four file keys, faces, grounds, Pack v0's hexes, product titles), saved for the next release: 0 in `studio-engine`; in the bundle, hits only in `plugin.json`, `BUNDLE.md` and `brands/registry.yaml`. On an earlier build it caught HLR values that round-1 probes had carried into the engine's tests (a palette name and hex, the scrim value, "owner HLR"); replaced with fictional ones |
| 4 | 8-word runs | 1,083 spans (0.5.1: 1,079); 15 new file and span pairs, each read: 7 engine-origin (the YAML parser moved between engine files; 0.5.1's own token-model text re-split), 8 coincidental code idioms; no brand content |
| 5 | Quoted strings | 737 (0.5.1: 722); 21 new, each read: 10 engine-origin (the engine's file names, config keys and token paths), 11 coincidental generic phrases; no brand content |
| 6 | Descriptions | 11 skills, all under 1024 characters; longest 981 |
| 7 | Platform numbers | paid specs verified 2026-07-27 (3 sources), organic 2026-10-17 (9 sources); every number has a confidence; the six far numbers are the organic grid crops, as in 0.5.1 |
| 8 | Build | both plugins rebuilt from the shipped engine to the shipped sha256; 0 runtime files in either |
| 9 | Resolution | name, alias and folder: rc 1 (no `brand-context.md` yet), pack found, no traceback; `nonesuch`: rc 2 |
| 10 | Review | three fresh-context rounds (section 4); round 3 left 2 should-fix items open, which go to Eddie (section 7, item 1) |
| | Em dashes | 0 added by 0.5.2; the 65 engine files that carried them in 0.5.1 are unchanged (section 7, item 6) |

The census lists and scan outputs name other brands, so they live in `claude-cowork/_tools/release-checks/0.5.2/` (with the kept HLR list, the classified new hits and the spec scan as a file).

## 4. Review

Three fresh-context rounds against REVIEW.md. Each reviewer read the work, the record and the author's check output (never the author's transcript), reran what it could reach in the cloud, and said which checks only the author ran on the Mac. No reviewer and no author call wrote to Figma (two read-only calls, section 1).

- **Round 1** (two reviewers, 0.38M and 0.42M tokens): 38 findings once the two lists are merged: 1 blocker (runtime files in the bundle), 19 should-fix, 18 notes. All fixed with their probes rerun, except three handoffs: lane B's two family links, and token proposal questions 2 and 3 (Eddie). Three probes (P01, P03, P18) still fail on their letter after the failure they guard is gone, because the fix took another mechanism; rounds 2 and 3 agreed.
- **Round 2** (0.40M): 0 blockers, 5 should-fix, 4 notes, all fixed in rc8 with a test each. Three of the should-fix were round-1 classes seen a second time (a way forward that leaves text blocked, a parser that drops input without a word, unchecked text counted toward exit 0), so each now has its guard, as REVIEW's seen-twice rule asks.
- **Round 3** (0.34M): 0 blockers, 2 should-fix, 5 notes. Round 2's findings verified fixed but one, which is only partly fixed: the flex probe's restore. Open after the last round, so for Eddie (section 7, item 1): R3-01 and R3-02. The five notes are logged for 0.5.3 (item 9).

What stays unverified without a Figma write (round 3 lists it): how the Plugin API treats a range's variables when `characters` is rewritten, a raw value set on a range under a text style, and an empty text style id on a range. The restore reports what does not come back; it cannot be proven here.

The reviews are in this folder: `review-engine-0.5.2-r1-a.md`, `review-engine-0.5.2-r1-b.md`, `review-engine-0.5.2-r2.md`, `review-engine-0.5.2-r3.md`. Every defect a review probe reproduced has a test in the suite.

## 5. What the bundle does on Pack v0 today

It installs and resolves HLR, then every copy skill stops at the missing `brand-context.md`, as intended until Gate 2. `figma-plan` on lane B's draft plans 104 variables in the four collections and 42 text styles, and stops on two findings: `font.style.display-accent` and `font.style.headline-accent` need `$extensions.com.hlr.family: "{font.family.display}"` (owner: lane B). Until `figma.yaml` carries `fonts.build_stand_in_styles` (question 2), the faces to load include Instrument Serif Light and Medium, which do not exist, so the type step would stop. With both (tried on copies), the plan exits 0 and loads Instrument Serif Regular, Homemade Apple Regular, Inter Regular and Inter Bold, plus Instrument Serif Italic for the accent words. `check` passes every graded pair; `export` writes the web files.

## 6. Engine defaults until Eddie rules

Each is a DECISIONS line: lane B's root `modes` grammar, confirmed as the engine's; a semantic token missing a ground is a finding, not inherited; a component scope read from the last word of its name (a declared `scopes` wins); semantic `border` scoped to strokes; web code syntax `var(--hlr-...)`; the stand-in style map keyed by stand-in family (question 2, option 1); a style no text style uses names its own family, and its face is loaded so an accent range can be bound to it; leading and tracking set on each text style unbound (question 3); `font.weight` not planned; `[data-ground]` blocks in `tokens.css` and Tailwind on the default ground; a recorded Figma mode the tokens do not name is a finding; a face with no stand-in that does not load is reported, never replaced; two names that share one CSS name, and a token or text style whose alias the plan leaves out, are findings and are left out.

## 7. Open, ranked by production-blocking risk

1. **Two review findings open after round 3 (REVIEW section 5, step 4); the release waits on your ruling.** R3-01: when a headline opens with its accent word, the flex probe's restore leaves the rest of the headline in a raw stand-in face, so after the review switch only the accent moves to Saol (or, under the other API reading, the check fails on a correct master and leaves it detached). R3-02: the native-agent package has no line that binds an accent range to its style variable, so an accent built that way stays in the stand-in. Both bite only when modules are built (Step 4's first module batch); Foundations (Chat 5) uses neither the flex probe nor the package.
   (a) Default: install 0.5.2 now for Foundations; 0.5.3 fixes both before the first module batch (the restore first unbinds what the capture does not hold, then sets only the values that differ; the package names each accent range and its style variable, and the closing pass binds and reads it back), with one scratch-file Figma run to settle the API behavior above (a write to a scratch file, so it needs your go), plus the five round-3 notes. Cost: one more release before modules; nothing Chat 5 runs is exposed.
   (b) Hold 0.5.2: fix both now and review a fourth round (beyond REVIEW's three, so it needs your go). Cost: about 0.4M tokens and a day; Foundations waits.
   (c) Install 0.5.2 and accept both for Phase 1: no flex probe on a master whose text opens with an accent word, and accents built by the native agent are bound by hand in the desktop app. Cost: a manual step and a known trap left in the engine.
   Owner: Eddie.
2. **Install 0.5.2**, once item 1 is ruled: `hlr-studio-engine-0.5.2.plugin` over 0.5.1 (same name). Nothing in the pack changes. Owner: Eddie.
3. **The stand-in style map (token proposal question 2).** Without it, Chat 5's type step stops on faces Instrument Serif lacks. (a) Default: add `fonts.build_stand_in_styles` to `figma.yaml` as the proposal's option 1 prints it; the engine reads it as is. (b) Rename HLR's style tokens to styles the stand-ins have: no figma.yaml change, but the real styles leave `tokens.json`. Owner: Eddie, who names the lane.
4. **The accent styles' family link.** Two lines in `tokens.json` (RB02 in the review). Owner: lane B.
5. **Leading and tracking (question 3).** 0.5.2 sets them on each text style, unbound. (a) Default: keep that for Chat 5; a later release binds them once `tokens.json` carries pixel values per style (a Figma number variable holds pixels), and rebinding 42 styles is one scripted pass. (b) Bind now: lane B adds pixel leading and tracking per style and lane H ships 0.5.3 before Chat 5; Foundations waits for both. Owner: Eddie.
6. **Em dashes in engine text (REVIEW open item 6).** 0.5.2 adds none; 65 files and 970 lines carry them from 0.5.1, among them lint rules and tests that name the character on purpose. (a) Default: a 0.5.3 sweep, the character written by its code point (U+2014) in code and tests, a zero check added to section 3; about a day of one lane, with a full review. (b) Text a person or a model reads only (SKILL.md files, references, messages). (c) Leave the engine. Owner: Eddie, then lane H.
7. **REVIEW's guard rows owned by lane H.** R15 (a key collision in the export) now has its test. R6: the spec scan is saved as `_tools/release-checks/0.5.2/spec_scan.py`; (a) default, move it to `_tools/release-checks/` and point section 3 at it; lane H's write scope stopped at `0.5.2/`. R5 (no test checks a fixture's label or an eval's match to its fixture): not built; (a) default, a 0.5.3 test that each eval suite's fixture files exist, carry a "synthetic" label line, and that every trap the key names appears in its fixture; (b) accept it for Phase 1 (open item 5). Owner: Eddie.
8. **Lane D's engine gaps** (structure notes, section 2): `copy_lint.js` refuses an email angle off the engine's six frames; the pack contract has no role for the 9:16 keep-clear policy or the display floors; `paid_lint.js` maps on-image copy only to a hook or title slot. Outside 0.5.2's Gate 3 scope. Default: a 0.5.3 engine lane after Gate 2 rules lane D's calls 3, 5 and 6. Owner: Eddie.
9. **Round 3's notes, logged for 0.5.3** (owner: lane H): R3-03, `P()` given a variable that does not resolve may return an unbound paint without throwing, so a translucent color would go opaque without a word; R3-04, pages of two frames with the same text count pass the coverage check (the pages carry no frame id); R3-05, the inventory's page budget counts characters, not bytes, so names outside ASCII could pass 20 KB; R3-06, a family variable dropped by the alias rule stays on the switch list; R3-07, the engine's tests name the accent variable `font/style/display-accent`, HLR's own token path (rename it to a fictional one, or rule the name generic).
10. **The census term builder (REVIEW open item 2)** still collects `com` and three alias values; lane H dropped them as rule 9 says. Owner: Eddie.

## 8. Install handoff

1. Once section 7's item 1 is ruled, install `hlr-studio-engine-0.5.2.plugin` from this folder over 0.5.1 in the Claude desktop app.
2. In a Cowork session, `python3 <plugin>/scripts/resolve_brand.py hlr --check` should name the pack and exit 1 until lane E writes `brand-context.md`.
3. Before Chat 5: question 2 in `figma.yaml`, lane B's two family links, and Gate 2. Then `figma-plan --pack` exits 0 and the build can start.
