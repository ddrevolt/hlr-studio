# HLR crew

A brief in, validated email and paid copy out, on any OpenAI-compatible chat endpoint. The same files run on Claude today and on the xAI API at handoff. Nothing here depends on a chat product, a plugin, an MCP server or a skill file.

## What a co-worker is

One folder, `crew/<name>/`, holding exactly three things:

- `prompt.md`: the whole instruction, with a front matter (`stage`, `check`) and two explicit sections, `## Inputs` (every input it reads, by name and source file) and `## Outputs` (the JSON it returns). Inputs are rendered into the prompt as `{{placeholders}}` (`{{brief}}`, `{{intake}}`, `{{picked_angle}}`, `{{voice_contract}}`, `{{slotmap}}` and so on) and `{{include:path}}` inlines a file under the repo. A placeholder that names no input stays as written, so merge tokens such as `{{price}}` travel through.
- `schema.json`: the shape of its output. `run.py` validates every reply against it with a small built-in validator (type, required, enum, const, minItems, maxItems, pattern, minLength, maxLength, minimum, maximum, additionalProperties false). No third-party library.
- One check command, named in the front matter, that reads files and exits non-zero on a finding (`crew/checks/`). A failing check stops the run.

Every prompt carries the same standing rules: sources never memory, nulls stay null with an owner, no em dash, the never-say list honoured, no invented figure, price, quote or review.

## Pipeline order

1. `intake`: the brief to a structured brief (products resolved by `products.json` id, moment, offer as tokens, audience, never-say, gaps with owners).
2. `strategist`: three angles on distinct axes from `route-axes.json`, each with a lead line, an opening module and an exemplar reference or null.
3. HUMAN PICK: the run stops (exit 2) until `crew/runs/<slug>/<timestamp>/pick.json` exists as `{"angle": n, "by": "name"}` or `--pick n` is given.
4. `email`: the picked angle into subjects, a hero, module blocks with slot copy, a CTA and a footer of tokens.
5. `paid`: Meta ad sets for `single_image` and `story`, each with three primary texts, three headlines, a description and hooks.
6. `editor`: a list of proposed edits (`stage`, `path`, `before`, `after`, `reason`); never a rewrite. Applied only with `--accept-edits` (or by a person).
7. `producer`: `run.py` writes `producer.json`, the manifest the producers read. The email HTML producer is built (`crew/producers/email_html/assemble.py`, see `crew/producers/README.md`); the Klaviyo push and the Figma package are not built yet.

## How to run

```
python3 crew/run.py --brief <file> [--dry-run] [--until <stage>] [--pick <n>] [--accept-edits] [--run-dir <dir>]
```

- `--dry-run`: no key, no network. Each stage reads `crew/fixtures/dry-run/<stage>.json` as its canned model output; validation and checks still run.
- `--until <stage>`: stop after that stage.
- `--pick <n>`: the angle a person picked (1-based). Writes `pick.json` and continues past the strategist.
- `--accept-edits`: apply every edit the editor proposes, writing `<stage>.edited.json` and re-running that stage's check.
- `--run-dir <dir>`: resume an existing run (stage files already there are reused; the pick is read from its `pick.json`).

Exit codes: 0 done, 2 stopped for the human pick, 1 any failure, with a one-line reason on stderr.

Outputs land in a run folder, `crew/runs/<brief-slug>/<timestamp>/<stage>.json`, plus `pick.json`, `<stage>.edited.json` when edits were applied, `producer.json`, and `<stage>.json.invalid` when a reply failed its schema. Run folders are working state, not a record, and are created at run time.

## Environment

| Variable | Meaning |
|---|---|
| `CREW_BASE_URL` | the OpenAI-compatible base, without `/chat/completions` |
| `CREW_MODEL` | the model name the endpoint expects |
| `CREW_API_KEY` | the bearer key |

`XAI_BASE_URL`, `XAI_MODEL` and `XAI_API_KEY` are read as fallbacks. The call is `POST {base}/chat/completions` through `urllib` with `model`, `messages` and `response_format: {"type": "json_object"}`; if the endpoint rejects `response_format` with a 400, the call is retried without it and the JSON is extracted from the text.

xAI API (the handoff target; the key is HLR's, and this has not been run here):

```
export CREW_BASE_URL=https://api.x.ai/v1
export CREW_MODEL=grok-4
export CREW_API_KEY=xai-...
python3 crew/run.py --brief outputs/step-5-forge/protection-of-energy/brief-protection-of-energy.md
```

An OpenAI-compatible Claude gateway (any proxy that exposes Claude on `/v1/chat/completions`):

```
export CREW_BASE_URL=https://<your-gateway>/v1
export CREW_MODEL=claude-sonnet-4-5
export CREW_API_KEY=...
python3 crew/run.py --brief crew/fixtures/brief.md --pick 1
```

The model name is whatever that endpoint lists; the runner passes it through unchanged.

## Portability rules

- No chat product, plugin, MCP server or skill file on the path. `run.py` is Python 3.9+ and the standard library; the checks are file-reading CLIs.
- Figma and Klaviyo are reached by REST from the producers, never from the writers.
- The pack is read live from `brand-pack/` on every run (`brand-context.md`, `products.json`, `voice-contract.md`, `route-axes.json`, `slotmap.yaml` as text, `module-library.json`). Nothing about HLR is copied into a prompt by hand.
- Every HLR fact in an output traces to the pack or the brief; an unknown is null plus a gap with an owner.

## Tests and checks

```
python3 -m unittest discover -s crew/tests
python3 crew/run.py --brief crew/fixtures/brief.md --dry-run            # exit 2 at the pick
python3 crew/run.py --brief crew/fixtures/brief.md --dry-run --pick 1   # exit 0
```

`crew/checks/README.md` states each check's command and what it does not prove. The engine's lints are not yet adapted to the crew's JSON shapes; each wrapper prints a `SKIPPED` line naming why.
