---
name: squad-run
description: Run the creative squad on a brief for any registered brand: one fresh-context copy worker per route from the intake's route plan, each writing a finished route packet, then the independent pairwise verifier (hard gates by script, taste by fresh-context comparison, calibrated against the brand owner's marks), then the options board. Use whenever someone wants the squad run, the routes developed and ranked, a board built from a route plan, or the single-agent versus squad A/B ("run the squad on the launch brief", "develop all four routes", "fan out the routes", "squad this brief"). Needs the structured brief and route plan files that brief-intake writes. Expensive by design (about 250K output tokens per route worker plus the judge), so it states the estimate and waits for a go unless the request already said to run it. Not for a single route (use email-copy or paid-ad-copy) and never the human pick.
---

# Squad run: fan out, gate, judge, board

The squad is a workflow, not a conversation: one worker per route in a fresh context, so no route inherits another's phrasing; the verifier in another fresh context, so no judge inherits a worker's reasoning; the board rendered from files on disk, so nothing is claimed that a file does not prove. The script is `${CLAUDE_PLUGIN_ROOT}/workflows/squad-run.js`; you run it with the Workflow tool and pass everything it needs as `args`.

## Before you run it

1. **Resolve the brand and the inputs.** `python3 ${CLAUDE_PLUGIN_ROOT}/scripts/resolve_brand.py --text "<request>"` (or `--path`). Find `<slug>.brief.json` and `<slug>.routes.json` from brief-intake; if there is no route plan, run brief-intake first and stop for the route pick. Routes: the human's picks if any, otherwise every route in the plan (all provisional).
2. **State the cost and wait for a go** unless the request already said to run: roughly 250K output tokens per route worker (the July evals measured about 80K per subagent run on a lighter skill; the September intake measured 235K), plus about 30K per judge batch (six mirrored pairs), plus two cheap script agents. Four routes on email only is about 1.2M; adding paid roughly doubles the workers. Say the number.
3. **Decide parallel or sequential.** Parallel is faster; sequential (`sequential: true`) is the only way to measure output tokens per route, which the Phase 2 production record needs. Default to sequential for the A/B, parallel for a routine run.

## Running it

Call the Workflow tool with `scriptPath` pointing at `${CLAUDE_PLUGIN_ROOT}/workflows/squad-run.js` and `args`:

```json
{ "slug": "spring-launch", "engine": "<plugin root>", "pack": "<pack folder>", "brief": "<abs path>/spring-launch.brief.json", "routes_file": "<abs path>/spring-launch.routes.json",
  "outputs": "<abs path to the brand's outputs folder>", "routes": [{ "id": "R1", "axis": "benefit", "angle": "..." }],
  "surfaces": ["email"], "timestamp": "<ISO now, passed in because scripts cannot read the clock>", "sequential": true, "judge_batch": 6, "board_title": "Spring launch squad board" }
```

`surfaces` is any of `email`, `paid`, `web` and `social` (default `email`): each adds its copy skill to what every worker reads and one deliverable to its packet; an unknown surface stops the run before any worker starts. One deliverable per surface means one post per route on `social`: the worker develops the first post the brief's social channel names and lists the others as not developed, because the verifier compares routes surface by surface and judges only the first deliverable on each. The packet's completion checklist takes the first surface's contract type (`email`, `paid_static`, `web` or `social`) and adds the other surfaces' items.

Every path is absolute on the machine the agents run on. The script writes under `<outputs>/<slug>-squad/`: one folder per route with the copy skill's files and the packet, then `verify-signals.json`, `pairs.json`, `judge-brief.md` (the engine rubric plus the pack's `judge_rubric`), the judge batches, `judgments.json`, `verified/` (packets with `verifier` filled) and `board.html`.

## Reading the result

The workflow returns the workers' verdicts, the gates (rankable and not, with reasons), the judgment count, the rank with the judge's most frequent reason per route, the board path, and the cost line. The reply is: the rank, one line per route; what was not rankable and why; the calibration line from the verified packets ("this judge agreed with the brand owner on N of M pairs; the owner's own test-retest is P percent", or that it has never been checked); "judged without a measured preference" when the gates returned `preference: none on file`; the board; the cost. Then the human picks. Nothing else.

## Rules

- **Fresh contexts are the point.** Never paste a worker's output into another worker's prompt or into the judge's. The script already keeps them apart; do not help.
- **Never rank a FAIL, never hide an INSUFFICIENT-INPUT.** The gates agent reports them; the board shows them.
- **The cost line is a measurement or it is "not measured".** Parallel runs cannot attribute tokens per route and the return says so.
- **A run that produced fewer than two rankable packets renders an unranked board.** That is the honest result, not a failure to retry.
