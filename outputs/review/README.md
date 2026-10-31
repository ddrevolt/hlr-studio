# HLR Pack Review (Review 1 workbook)

One page that shows the pack's essentials in plain words (voice, claims, never-say, colour and grounds, type, marks, art direction, the email and social types) beside today's decisions, so Donnie can confirm or change them during the review. Decisions save to the artifact's own database as they are made; nothing in the pack changes until Claude applies them on Eddie's go.

## Files

| File | What it is |
|---|---|
| `build_review.py` | Reads the pack (read only) and writes `review-data.json`: every item verbatim with its file, line or JSON path, a hash of the exact text, and its provenance in plain words. |
| `content.py` | The page's own words: the decisions for today (each with verbatim facts and their sources), section and group intros, every interface label. Writes `content.json`. |
| `tools/render_assets.py` | Renders the type specimens from HLR's own font files and copies or downscales the marks from `HLR Logo & Marks/`. Writes `assets/` and `assets/manifest.json`. Run on the Mac, where the fonts are. |
| `gen_assets.py` | Copies the data into `app/src/data/` and writes `assets.ts` (specimens and PNG marks as data URIs; the SVG marks with their fill bound to the ink). |
| `gen_theme.py` | Writes `app/src/theme.css` from `brand-pack/web/tokens.css`. |
| `app/` | React, TypeScript and Tailwind, built with Parcel. No visible words live here. |
| `prep_publish.py` | Turns the build into one artifact page, `review.html`. |
| `review_guard.py` | Fails on a fact not verbatim in its source, data out of step with the pack, a broken reference, an em dash, a census term (with `--census-terms`), or assets that no longer match HLR's files (with `--assets-home`). |

## The record

The page keeps decisions in its database, never in the page:

- `decisions/<id>`: one per item or decision. `status` is `keep`, `change`, `discuss` or `decided`; `value` is the new text, fields or answers; `note`; `by` (`donnie`, `eddie` or `both`, whoever decided in the room); `uid` (the account that recorded it); `at`; `base`, the hash of the exact text the decision was made on; `build`.
- `sections/<id>`: "confirm the rest of this section as written".
- `notes/<id>`: points raised that have no item of their own.
- `review/state`: `closed` once the review is over.

## Applying the decisions (after the review, on Eddie's go)

1. Read every collection with ArtifactData (`list` on `decisions`, `sections`, `notes`, and `get` on `review/state`).
2. For each decision, find its item in `review-data.json` and check `base` against a fresh `build_review.py` run: a mismatch means the pack changed since the page was built, so stop and ask.
3. Apply each change to its file and line, re-tag it (Donnie's decisions are HLR's: [documented, HLR at Review 1, <date>]; our rules stay Eddie's), and write one dated DECISIONS.md line per decision with who decided, the reason given, and what it replaced.
4. Re-run the pack checks and the token exports, then Eddie commits.

## Rebuild

From this folder, with the brand home two levels up:

```
python3 build_review.py
python3 content.py
python3 tools/render_assets.py          # on the Mac, only when fonts or marks change
python3 gen_assets.py
python3 gen_theme.py --out app/src/theme.css
(cd app && pnpm install && pnpm exec parcel build index.html --dist-dir dist --no-source-maps)
python3 prep_publish.py app/dist review.html
python3 review_guard.py --page review.html --census-terms "$RC/terms.txt" --assets-home ../..
```

Then republish `review.html` to the same artifact; the record survives a republish.

## What the guard does not check

It proves each quote exists in its source, not that the quote supports the line beside it: a reviewer judges that. It scans our words (content, data, our source files, the page's markup and styles), not the library code bundled into the page. The release checks' `census.py` does read the whole page, and on 2026-10-23 it reported two kinds of hit in `review.html`, both adjudicated as not brand content: 248 Figma-key-shaped tokens, every one inside an embedded image, and 8 hits of the two-letter term it reports in any case: one inside an embedded image and seven a function name in React's own minified code.
