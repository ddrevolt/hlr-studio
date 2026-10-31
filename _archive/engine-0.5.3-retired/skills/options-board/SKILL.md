---
name: options-board
description: Assemble the options board for any registered brand: every finished route from a squad run, side by side, with its copy, its renders at every ratio and breakpoint, its lint verdicts, its verifier scores when they exist, its completion checklist and what it passed over, for a human to pick from. Use whenever someone wants the board built, the options laid out, or the routes compared ("build the board", "show me the options", "put the routes side by side", "assemble the board for the launch", "what did the squad come back with"), including from copy-skill outputs that already exist. Reads route packets in the packet schema, refuses a malformed one by name, recomputes completion from the render files, and never ranks on its own: ranks come from the verifier or stay absent. Not for producing the routes (the copy and asset skills), not for scoring them (verify), and not for choosing.
license: MIT
metadata:
  version: 1.0.0
---

# Options board: finished routes, side by side, for a human to pick

The board is a script, not a judgment. It assembles what the routes produced, shows what each one is missing, and stops. The pick is the human's; the ranking, when there is one, is the verifier's.

## Resolve the brand

Resolve the brand in order: (a) a name or alias in the request; (b) otherwise the folder path `claude-cowork/<brand>/...`; (c) otherwise ask once and stop. `python3 ${CLAUDE_PLUGIN_ROOT}/scripts/resolve_brand.py --text "<request>"` (or `--path <folder>`) does (a) and (b) from `brands/registry.yaml`; exit 2 is unresolved. The board reads only the pack's `onepager_palette` (through `--pack <pack>`); everything else it needs is in the packets. Without a pack it renders in the neutral default palette and says nothing else is missing.

## When to build a board

After a squad run (Phase 2) returns one packet per route, or today, by hand, when the copy skills have produced their outputs for two or more routes and someone wants them compared. A board with one route is a status page, not a choice; build it anyway if asked, but say so.

## The packet

`references/packet-schema.json` is the unit a route worker returns and the verifier reads: `route_id`, `frame`, `angle`, `brief_ref`, `channel_deliverables` (per surface: the copy skill's JSON, the lint report and verdict, the renders as `{surface, ratio_or_breakpoint, item, path, rendered_by, placeholder}` (`item` numbers the panel or frame of a social set), the image plan with its pack composite, the image files), `passed_over` (options dropped, with a reason from `occasion`, `weaker`, `off-brief`, `duplicate`, `blocked`), `provenance` with `cost`, `verifier` (null until verify runs), and `completion` (the brief type's contract checklist, `references/completion-contract.json`, item by item).

A packet is compact by design: paths and verdicts, never transcripts. Anything the board shows it reads from the files the packet points at.

## Assembling the manifest by hand

Until squad-run exists, a packet is written by whoever ran the route. For each route:

1. Run the copy skill for each surface (`email-copy`, `paid-ad-copy`, `web-copy`, `social-copy`) and keep its JSON and its lint report.
2. Export the renders: a Figma screenshot or export per ratio for paid, per panel or frame for social (each with its 1-based `item`, at every ratio), a render at 1440 and 390 for web, one for email. A grey box or a draft image is `placeholder: true`; it never counts.
3. Write `<slug>.R<n>.packet.json` against the schema, filling `completion.items` truthfully. A render you do not have is `path: null`, not a guess.
4. Write `board.json`: `{ "title", "brief_ref": "<slug>.brief.json", "routes_ref": "<slug>.routes.json", "packets": ["<slug>.R1.packet.json", ...] }`, paths relative to the manifest.

```
node scripts/render_board.js --manifest board.json --pack <pack> --out board.html --out-md board.md
```

The script validates every packet against the schema and refuses to render when one fails, naming it. It recomputes completion from the render files on disk and the brief's declared geometry (falling back to the completion contract when the brief is unreadable): a missing render, a placeholder, a missing lint report or a lint FAIL makes the route INSUFFICIENT-INPUT or FAIL on the board, never PASS, whatever the packet claims. Exit 0 when every route passes, 1 when the board rendered but a route is not complete, 2 when it could not start.

## What the board shows

A header with the brief's objective and deliverables and one chip per route. Per route: frame and angle; per surface the copy (subjects, preheader, hero and CTA for email; hooks, headline and primary text for paid; hero and section copy for web; angle, cover lines, caption first lines and panels for social), the renders embedded as images or a labelled NOT RENDERED block, the lint chip coloured by verdict, the image plan; the verifier's scores and rank when present; the completion checklist; what was passed over and why. A footer with every route's provenance stamp and cost line and the board total, which says how many routes were measured.

## The rule that binds

**The board never ranks on its own.** Routes appear in verifier rank order only when every packet carries a rank; otherwise in manifest order, labelled unranked. It adds no score, no recommendation and no default. What it adds is honesty about completeness: a blank never looks intentional, and a claim of `complete: true` the render files do not support is shown as the claim it is.

## Reference files

| File | Read it when |
|---|---|
| `references/packet-schema.json` | Writing a packet by hand, or building squad-run or verify to fill one |
| `references/completion-contract.json` | Knowing what complete means for each brief type and which renders are required |
| `${CLAUDE_PLUGIN_ROOT}/skills/brief-intake/references/brief-schema.json` | The brief the board reads for objective and deliverables |
