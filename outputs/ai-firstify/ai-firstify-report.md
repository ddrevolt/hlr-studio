# AI-Firstify Assessment Report

**Project:** HLR brand forge: the brand home `highlight-brandbook/` (218 tracked files), the installed `hlr-studio-engine` 0.5.3 (155 files, 11 skills), and the claude.ai Project instructions
**Date:** 2026-10-24
**Mode:** Re-engineer, audit phase only. No forge file was changed: every change below waits for Eddie's go (standing rule 5).
**Read:** PROGRESSION.md; the latest DECISIONS.md and LEARNINGS.md entries; git state; sizes and greps over the brand home, the pack and `_setup/`; the `_setup/` copy of the instructions; the 0.5.3 bundle unpacked (frontmatter, headings, scripts, `workflows/squad-run.js`); the guard suite, run on today's tree. One fresh-context review checked the scores; its adjustments are in. Not read: Figma, the brand-free engine source, the text of the `_setup/` lane prompts.
**Mapping:** ai-firstify is written for code repos. Here its CLAUDE.md is the Project instructions plus rule 1's read-first set, and its `.claude/skills/` is the installed engine bundle.

## Overall Score

| Dimension | Score | Summary |
|---|---|---|
| 1. Project Structure | YELLOW | Git, ignores and layout are sound; no in-repo instructions file; the Project instructions have drifted from the record (rule 4 stale, rule 8 missing); a day of work uncommitted |
| 2. Agent Architecture | GREEN | No embedded agents or LLM API calls; orchestration uses the platform's own workers and fresh-context reviewers |
| 3. Skill Usage | YELLOW | 11 well-built engine skills; the ritual every chat repeats is prose, not a skill; 10 of 11 HLR skill names collide on Eddie's install |
| 4. Scope & Complexity | YELLOW | No needless UI or infrastructure; two side tracks open beside an unclosed Step 5, 6 days before Review 2 |
| 5. Context Hygiene | YELLOW | Lean instructions, but rule 1 costs about 23k tokens per chat and the Figma rule about 21k more |
| 6. Safety | YELLOW | No secrets, client files ignored, gates hold; the history census is open and history carries six engine zips |
| 7. Workflow Design | YELLOW | Prescriptive lanes, fresh-context reviews, mutation-tested guards that pass today; no run has measured its cost, and commits lapsed a day |

No RED. The architecture is sound and the guards are strong. The drag is weight and drift: records and state files every chat reads, instructions that no longer match the record, and an operating ritual that lives in prose and will not ship to HLR's team.

## Priority Recommendations

1. **[HIGH]** Re-sync the Project instructions with the record in one paste: rule 4 names Donnie (ruled 2026-10-23), and rule 8 (licenses) comes back, since no decision retired it and Gate 3 call 7 cites it. The paste also carries the routing, decision-line and Figma-read lines of calls 2, 5 and 7. Effort: 2 minutes (call 1).
2. **[HIGH]** Route HLR work to HLR skills by full name: 10 of the 11 HLR skill names collide with other installed plugins, asset-production (the Figma writer) among them. Effort: rides the paste; 10 minutes more to turn off unused plugins (call 2).
3. **[HIGH]** Checkpoint now: a day of work and the Step 5 run have no restore point. Effort: 5 minutes (call 3).
4. **[HIGH]** Close the forge's outcome loop: a measured cost on every run, and Donnie's keep-or-cut on Step 5's output. Effort: a run setting and one close line (call 4).
5. **[MEDIUM]** Cut rule 1's read with a tool, not by hiding entries: an open script prints the latest day's DECISIONS cut to each entry's first sentence, about 44KB instead of 91KB. Effort: 30 minutes (call 5).
6. **[MEDIUM]** Make the open and close ritual a skill, shipped in the engine. Effort: 1 to 2 hours in lane H 0.5.4 (call 6).
7. **[MEDIUM]** Read only the Figma state a call needs, not 84KB before every call. Effort: the rule rides the paste; about 1 hour for a lookup script (call 7).
8. **[MEDIUM]** Keep the side tracks parked until Review 2 closes. Effort: none (call 8).
9. **[MEDIUM]** Decide whether `.plugin` builds belong in HLR's git history before the census runs. Effort: 30 minutes with the census (call 9).
10. **[MEDIUM]** Give the repo its own instructions file before handoff, with the Project instructions pointing to it. Effort: 30 minutes (call 10).
11. **[LOW]** Move detail out of customer-evidence (32KB), email-copy (22KB) and paid-ad-copy (17KB) at 0.5.5. Effort: inside the release (call 11).
12. **[LOW]** Add generic secret patterns to `.gitignore`. Effort: 1 minute (call 11).

## Detailed Findings

### Dimension 1: Project Structure (YELLOW)
- Basis: on the literal rubric, no CLAUDE.md is RED. It scores YELLOW because the Project instructions do that job for Eddie's chats (see Mapping); the YELLOW lines that apply are an incomplete `.gitignore` (Dimension 6) and a commit lapse.
- Git: 16 commits in the last 7 days. Last checkpoint 3d4ab65, 2026-10-23 14:28 UTC. Before this audit, 29 tracked files had changed since it (+542, -228), and 5 paths were untracked: `outputs/step-5-forge/` (the Step 5 run on Eddie's brief), `outputs/review/` (the Review 1 workbook source), `outputs/explainer/`, `outputs/concepts/`, and the pendants rehearsal's `run1-fail.md`. This audit adds `outputs/ai-firstify/`.
- `.gitignore` covers the client originals (fonts and brand book included) and `_setup/` (it names other brands). It lacks generic secret patterns (Dimension 6).
- Root: four records, `brand-pack/`, `outputs/`, `_setup/`, and the ignored client originals (three folders, the brand book PDF, a workbook). Tidy.
- The instructions have drifted from the record, in both copies. Live Project instructions: rule 4 reads "Only Eddie ratifies a derived value", while DECISIONS 2026-10-23 (the Donnie sweep) reads "only Donnie ratifies a derived value". Rule 8 (fonts and imagery need a confirmed license or usage right) is missing: no DECISIONS line retires it, Gate 3 call 7 (2026-10-17) cites it, and the live rule 7 ends "Copy before design.." where the `_setup/` copy has rule 8 next. The `_setup/` copy still carries rule 6, retired 2026-10-18, and the same stale rule 4.
- Nothing inside the repo tells an agent how to work in it. Gate 1 (a) hands the forge to HLR's team, so the repo needs its own entry file before handoff (call 10).

### Dimension 2: Agent Architecture (GREEN)
- No LLM API calls, keys or endpoints (greps over the tracked files, `brand-pack/`, `outputs/` and the bundle).
- Orchestration uses the platform's primitives: `workflows/squad-run.js` runs one fresh-context worker per route through `agent()` and `parallel()`, gates the packets with scripts, and ranks them with an independent pairwise judge. No custom framework.
- Reviews follow the review-agent pattern: REVIEW.md's reviewer brief reads files only, never the author's transcript, and makes no fixes and no decisions.
- Nothing to de-agentify.

### Dimension 3: Skill Usage (YELLOW)
- Basis: the engine meets every GREEN line. The YELLOW is for a repeated workflow that is not a skill (in part, the rubric's "no skills despite repeated workflows").
- The engine: 11 skills, each with name and description frontmatter and numbered steps (as a list or as numbered headings). Ten carry `references/`, `scripts/` and tests; `squad-run` keeps its logic in `workflows/squad-run.js`. GREEN-grade work. (Their weight is a Dimension 5 matter.)
- Not captured as a skill: the ritual every chat repeats. Open is rule 1; close is rule 10, the guard run, the mtime-checked patches and the five-line status. It lives as prose in the Project instructions, PROGRESSION's header and the lane prompts in `_setup/` (ignored, so it will not reach HLR's team). The 19 guard files (tests included) under `outputs/step-4-figma/guards/` are called by no engine skill; lane prompts and REVIEW.md R20 call them.
- An install issue, not a bundle flaw: 10 of the 11 HLR skill names also exist in other installed plugins (all but social-copy). email-copy, paid-ad-copy, web-copy, customer-evidence and design-system each exist in six plugins and asset-production in five (this bundle, the brand-free engine, three other brand studios, and for the copy skills a generic pack); brief-intake, options-board, squad-run and verify also exist in the brand-free engine. In this session's listing, 8 of the 11 appear by name only. A chat routing on name alone can pick another brand's skill, and asset-production writes to Figma (rule 9). The three HLR skills that keep their descriptions have the same description lengths (891 to 981 characters) as the eight that lose them, so length is not the cause. HLR's single-brand install will not have the collision.

### Dimension 4: Scope & Complexity (YELLOW)
- Basis: the rubric's "some scope creep (2 to 3 extra features)": two side tracks are open beside the unclosed core.
- No needless frontend, databases, auth or deployment. The two HTML artifacts (the explainer and the review workbook) serve Donnie and HLR, who decide without a terminal: justified.
- Engine pace: 0.5.0 to 0.5.3 in five days; 0.5.4 trimmed and not built, with G1 to G9 added to it on 2026-10-23; 0.5.5 holds the rest.
- 8 open PROGRESSION items with Review 2 in 6 days (Fri 2026-10-30). Side tracks: the explainer (paused; round 2's 5 should-fix and 10 notes open) and the Firefly concept round (`outputs/concepts/`, tracked by neither git nor PROGRESSION). Core: Step 5 is open (email ran end to end twice; social and a measured cost have not), and the organic social batch has not started.
- Every side track is an ask on record from Eddie, so the risk is order, not drift (call 8).

### Dimension 5: Context Hygiene (YELLOW)
- Basis: on the rubric's line test, rule 1's read-first set is about 232 lines (PROGRESSION 95, the 2026-10-23 block 127, the latest LEARNINGS entry 10) plus the instructions: the YELLOW band. By bytes it is 91KB, two to three times what a 500-line file of normal width holds, so it sits near the RED edge.
- The always-loaded Project instructions are lean (2.9KB). Skills use progressive disclosure and read the pack live through its File map. The project copy of REVIEW.md is current (R20 and R21 present).
- Rule 1's read-first set: PROGRESSION.md 17KB, plus DECISIONS.md's latest entry, which is the whole 2026-10-23 day under one heading (72KB), plus LEARNINGS.md's latest entry (1.5KB). About 91KB, roughly 23k tokens (bytes/4), before work starts.
- DECISIONS.md growth: 10.7KB at the 2026-10-17 checkpoint, 48KB at 2026-10-20, 113KB at 2026-10-23 14:28, 131KB in the working tree. The 2026-10-23 block holds 124 entries, median 513 bytes; 89 run over 400 bytes and carry 61.5KB of its 72KB; 30 narrate builds (built, published, switched, ran). Rule 10 asks for the decision, its reason and what it replaced.
- One heading per chat would shrink the read but hide earlier rulings from the same day, the failure behind rule 4. Cutting each entry to its first sentence keeps every ruling visible: 124 entries at 200 bytes or less is under 25KB, so the read drops to about 44KB (call 5).
- A fresh-context reviewer also reads REVIEW.md (43KB): about 134KB, roughly 33k tokens, before it opens the work. Call 5's cut applies there too.
- "Read figma.yaml and slotmap.yaml before any Figma call": 84KB, roughly 21k tokens; slotmap's `modules` key alone is 41KB. The engine already ships pack libraries (`lib/pack.py`, `lib/yaml.js`) a lookup can sit on.
- SKILL.md weight: the bodies total 153KB; five run over 100 lines; the heaviest are customer-evidence (262 lines, 32KB), email-copy (22KB) and paid-ad-copy (17KB). asset-production is 52 lines but 12.9KB, so line counts understate weight.

### Dimension 6: Safety (YELLOW)
- Basis: the rubric's ".gitignore exists but may miss some sensitive files", plus a pre-handoff check still open.
- No credentials or keys in the 218 tracked files (greps for key, bearer and password patterns).
- Client originals and licensed fonts are ignored; `_setup/` is ignored for its other-brand names; the release-check tools sit outside the brand folders.
- Human in the loop holds: rule 5 gates every Figma write and convention; delegated overnight work was ratified on decision sheets.
- Open: the census over every commit before handoff. History holds six `.plugin` zips (4.2MB): three `hlr-studio-engine` builds and three brand-free engine builds, which are not HLR deliverables. A name census has to unpack zips, and the 0.5.0 bundles were already removed from history once (2026-10-20).
- Open and tracked: the font licenses (`brand-context.md`, Gaps and owners, owner HLR). The library now runs on the real faces at Eddie's request, so the item belongs on Review 2's agenda. Rule 8, which governs it, is missing from the live instructions (Dimension 1).
- `.gitignore` has no generic secret patterns (`.env*`, `*.pem`, `*.key`, `credentials*`). None found; low risk.

### Dimension 7: Workflow Design (YELLOW)
- Basis: the machinery meets every GREEN line except commit discipline, which lapsed a day (Dimension 1). The YELLOW is for partial validation of the forge's own outcome: no run has measured its cost, and the keep-or-cut has not run.
- Prescriptive: lane prompts carry "Runs only when" lines (R2's guard); all 11 skills run numbered steps; decisions go out as sheets with defaults.
- Review: three rounds at most, "seen twice, guarded" (21 rows, each naming its guard), a paste-ready reviewer brief.
- Validation: the guard suite passes on today's uncommitted tree: closed gates 1 to 4 clean over 23 files; parity on 77 cases and 5,000 fuzzed lines; 20 of 20 host-shape mutations and 18 of 18 board-expectation mutations caught; `close_checks.js` current. Mutation-tested guards are rare. Keep them.
- The outcome loop: every logged run records cost as not measured (the pendants rehearsal, the protection-of-energy email, the concept round). The only cost capture is in `squad-run.js` (output tokens when `sequential` is set), and both Step 5 runs went brief-intake, email-copy, build, without it, so the design lets the measure be skipped. Donnie's blind keep-or-cut sheet has not run (Review 3 in the plan). The one number this audit measured: its single fresh-context review used about 171k tokens.

## Changes Made (Re-engineer mode only)

| Action | File | Description |
|---|---|---|
| Created | `outputs/ai-firstify/ai-firstify-report.md` | This report |
| Created | `_setup/hlr-project-instructions.proposed.md` | The Project instructions at the defaults, paste-ready (ignored: it names another brand's folder) |
| Modified | `LEARNINGS.md` | A dated entry for this chat |
| Modified | `PROGRESSION.md` | One Process line pointing to this report |

No forge file changed. Re-engineer phases 1 to 7 wait for Eddie's go on the calls below.

## Still Needs Human Decision

Ranked by production-blocking risk. "Take all defaults" works.

- [ ] **Call 1, the Project instructions, one paste.** The complete text at the defaults is `_setup/hlr-project-instructions.proposed.md`. Against the live text: rule 4 names Donnie; rule 8 is back and rule 7 loses its stray period; rule 10 asks for the decision first, then its reason and what it replaced, with narration going to LEARNINGS or PROGRESSION (call 5); the Figma bullet reads only the sections a call needs (call 7); a new rule 11 invokes engine skills by full name (call 2). Rule 8: (a) restore; (b) retired, with a dated DECISIONS line. Default (a): no decision retired it. Only Eddie can edit the Project instructions; after the paste, Claude replaces the `_setup/` copy with the pasted text, which also drops retired rule 6.
- [ ] **Call 2, skill routing.** (a) Rule 11, in the paste. (b) Also turn off plugins the HLR project does not use while working on HLR. (c) As is. Default (a); (b) is Eddie's call, since he works across brands.
- [ ] **Call 3, checkpoint scope.** (a) Commit every tracked change and every untracked path, this report's folder included. (b) Commit tracked changes, `step-5-forge/`, the `run1-fail.md` log and this report; ignore the explainer, review and concept sources (3.7MB) as artifact sources. Default (a): they are HLR work with no other restore point, and the census then covers them.
- [ ] **Call 4, the outcome loop.** (a) Every close logs the run's cost (the session's usage, or squad-run's count) or says why not; Step 5's real brief runs through squad-run with `sequential: true` for per-route output tokens; Donnie's keep-or-cut on its output at Review 3, as planned. (b) The same with squad-run in parallel (faster; no per-route numbers). (c) One session with the usage line only. Default (a). Input tokens are not in squad-run's count; say so beside the number.
- [ ] **Call 5, rule 1's read.** (a) An open script that prints PROGRESSION, the latest day's DECISIONS cut to each entry's first sentence with its line number, and the latest LEARNINGS entry; the decision-first format (in the paste) keeps the cut meaningful; past entries untouched. (b) One heading per chat, and rule 1 reads the latest chat only (smallest read; an earlier ruling from the same day can hide). (c) As is. Default (a).
- [ ] **Call 6, the ritual as a skill.** (a) A `session` skill in hlr-studio-engine 0.5.4: `open` is call 5's script; `close` runs the em dash grep and `run_all.sh`, makes the mtime-checked record patches, writes the cost line and prints the five-line status. Ships to HLR's team. (b) An account skill for Eddie now (fast; does not ship). (c) Leave it in prose. Default (a).
- [ ] **Call 7, Figma state reads.** (a) Read the sections a call needs (the rule rides the paste), plus a lookup script on the engine's pack libraries in 0.5.4. (b) Keep full reads. Default (a).
- [ ] **Call 8, sequencing to Review 2.** (a) The explainer stays parked until Review 2 closes, and the concept round gets a PROGRESSION line or is closed; Step 5 and the organic social batch go first. (b) As is. Default (a).
- [ ] **Call 9, plugin builds in history.** (a) Keep only the installed `hlr-studio-engine` build tracked, ignore other `*.plugin` files, and rewrite once with the census. (b) Keep all six; the census unpacks them. (c) No builds in git; ship builds outside the repo. Default (a).
- [ ] **Call 10, in-repo instructions.** (a) An HLR-clean `CLAUDE.md` at the brand home root (under 100 lines: where things are, standing rules, open and close), the Project instructions pointing to it. (b) The Project instructions stay the only copy; HLR's team learns from the explainer. Default (a), before handoff.
- [ ] **Call 11, the LOW items.** `.gitignore` patterns at the checkpoint; the SKILL.md diet for customer-evidence, email-copy and paid-ad-copy in 0.5.5. Default: yes to both.

## Recommended Next Steps

1. Eddie: paste `_setup/hlr-project-instructions.proposed.md` into the Project instructions (call 1), then rule on calls 2 to 11 or take the defaults.
2. On the go, one short chat with no lane open: the checkpoint commit with the `.gitignore` lines (calls 3 and 11), the `_setup/` copy replaced by the pasted text, and the open script in `claude-cowork/_tools/` until 0.5.4 ships it (call 5).
3. Step 5 before Review 2 (Fri 2026-10-30): a real HLR brief through squad-run, email and social, cost measured (call 4); the font licenses on Review 2's agenda.
4. Lane H 0.5.4: the session skill (call 6), the Figma lookup (call 7), and the queued G1 to G9 and R3 items.
5. Before handoff: the instructions file (call 10), the plugin-build call (call 9), then the census over history.
