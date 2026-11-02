# High Light Rituals (HLR): brand home

HLR is a client. This repo holds its design system (DTCG tokens, a Figma library, web tokens) and its brand forge: a brand pack, a crew that turns a brief into email and paid copy, and the checks that guard both. Phase 2 (DECISIONS.md 2026-10-31) is a short brief in, Klaviyo email and Meta paid ads out, on brand, with a person picking from options.

## Where things are

- `brand-pack/`: the only source of HLR facts. `brand-context.md` (File map), `voice-contract.md`, `products.json`, `route-axes.json`, `module-library.json`, `slotmap.yaml`, `slotmap-paid.yaml`, `placement-specs.json`, `tokens.json`, `figma.yaml`, `design-catalog.json` (the design repository's catalog), `brand-pack/web/tokens.css`.
- `build/design-loop/`: the design loop (researcher, designer, curator skill sources, `catalog_lint.py` and its tests). `build/recreate/`: `hlr-recreate` v2 and the compare tool. Research and shortlists go to `outputs/design-loop/`.
- `PROGRESSION.md` is the plan and its gates. `DECISIONS.md` and `LEARNINGS.md` are the record. `REVIEW.md` holds the review rules.
- `crew/`: the portable crew. `crew/README.md` says how it runs. `crew/run.py`, one folder per co-worker, `crew/checks/`, `crew/producers/`, `crew/fixtures/`, `crew/tests/`.
- `outputs/`: what was made, by step. `build/`: `build/RUNNER.md`, `build/backlog.json`, `build/checks.sh`, `build/log/`. `_archive/`: retired work, never deleted.
- Client originals (brand book, fonts, marks, imagery) are read-only and are not in the repo.

## Standing rules

1. Open every session with `PROGRESSION.md`, then the newest `DECISIONS.md` and `LEARNINGS.md` entries.
2. Sources, never memory. Every HLR fact names a pack file and key, a brand book page, or the brief.
3. Loud absence: an unknown is `null` plus a named gap with an owner, or a merge token such as `{{price}}`. No invented figure, claim, price, quote or review.
4. Every token and brand rule carries a provenance tag: `[documented]`, `[observed]` or `[derived]`. Only Donnie ratifies a derived value.
5. No Figma write without Eddie's go. Stop at each gate until he gives one.
6. Copy before design. Meaning is tradition or intention ("long held as a stone of"), never a promised effect.
7. HLR files and outputs stay in this repo. No other brand's name, fact or file key enters it.
8. Every decision is a dated line in `DECISIONS.md` with its reason and what it replaced. Never edit an old line.
9. No em dash anywhere, copy included: a comma, a colon, parentheses or a new sentence. `build/emdash_scan.py` enforces it.
10. Delete nothing: move it to `_archive/`.

## Run the crew

```
python3 crew/run.py --brief <brief.md> --dry-run            # no key, stops at the pick (exit 2)
python3 crew/run.py --brief <brief.md> --dry-run --pick 1   # completes (exit 0)
export CREW_BASE_URL=... CREW_MODEL=... CREW_API_KEY=...    # any OpenAI-compatible endpoint
python3 crew/run.py --brief <brief.md> --pick 1
```

Stages: intake, strategist, a person's pick, email, paid, editor, producer. Each stage's output is checked by a file-reading CLI in `crew/checks/`; the engine lints that read the retired slate shape are marked SKIPPED, not passed. `crew/producers/email_html/assemble.py` turns the email block list into HTML.

## Open and close a session

Open: read the three record files above and the relevant `brand-pack/` files. Close: a dated `LEARNINGS.md` entry, `brand-pack/figma.yaml` and `brand-pack/slotmap.yaml` current, `build/backlog.json` statuses true, and a five-line status: done, waiting on Eddie, waiting on Donnie, next.

## Checks

`bash build/checks.sh` runs the guard suite, the pack mutation tests, the engine tests, the crew tests and the em dash scan. The census and overlap scans run on Eddie's Mac and are named in every pull request.

## The build runner

`build/RUNNER.md` governs the scheduled runner: at most two backlog items per run, one pull request, never a gate, a ratification, a Figma write or a merge without Eddie's go.
