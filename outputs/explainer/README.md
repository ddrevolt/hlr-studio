# HLR forge explainer

The HLR Forge Guide: one page that follows an email from the ask to the send, opens the pack as a rulebook (what each rule controls, who owns it, why it exists, what runs again after a change), shows what changes when the business changes, and compares the forge with Claude Design. Plan and rulings: `plan.md` and DECISIONS 2026-10-23.

Every number on the page is counted from the pack when the page is built, and every quoted line carries its source; `guards/explainer_drift.py` checks both.

## Files

| File | What it is |
|---|---|
| `content.json` | The plain words. Each factual line has `source` and a verbatim `quote` (or, for an outside page, a `checked` date). Numbers appear as `{value}` names, resolved from the data. |
| `build_data.py` | Reads the pack, REVIEW.md, DECISIONS.md, PROGRESSION.md and the demo run; writes `explainer-data.json` with a stamp: the brand home's commit and a sha256 per source. |
| `verify_examples.js` | Runs the page's example lines through the engine's own claims matcher (`lib/claims.js`); writes `examples-verified.json`. |
| `gen_theme.py` | Writes `app/src/theme.css` from `brand-pack/web/tokens.css`: light is HLR's light ground, dark is the night ground, bands use `[data-ground]`. |
| `gen_assets.py` | Copies the three JSON files into `app/src/data/` and writes the email preview module. |
| `app/` | The page's source: React, TypeScript, Tailwind and two shadcn/ui parts (popover, sheet). |
| `prep_publish.py` | Turns the Parcel build into one artifact page. |
| `explainer.html` | The built page, as published. |
| `guards/` | The drift guard and its must-fail tests. |

## Rebuild (at each gate close and each engine release)

From this folder, with the engine folder as `$ENGINE`:

```
python3 build_data.py
node verify_examples.js --engine "$ENGINE"
python3 gen_theme.py --out app/src/theme.css
python3 gen_assets.py
(cd app && pnpm install && pnpm exec parcel build index.html --dist-dir dist --no-source-maps)
python3 prep_publish.py app/dist explainer.html
python3 guards/explainer_drift.py --engine "$ENGINE" --page explainer.html --census-terms <release-checks>/terms.txt
python3 guards/tests/run_tests.py --engine "$ENGINE"
```

Then republish `explainer.html` to the same artifact. The census terms stay in `claude-cowork/_tools/release-checks/`; never copy them here. When a real HLR brief replaces the rehearsal, point `build_data.py` at its run (constants `DEMO` and `SLUG`) and update the stage texts in `content.json`.
