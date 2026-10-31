---
name: verify
description: Rank the finished routes of a squad run for any registered brand before a human picks, as an independent verifier that never saw the workers' transcripts. Use whenever someone wants routes verified, ranked, scored, compared or judged ("verify the routes", "rank the board", "which route is strongest", "score the packets", "run the verifier", "calibrate the judge"), including from copy-skill outputs wrapped as route packets. Applies the hard gates deterministically (schema, lint verdicts, fingerprints, completion), computes the taste signals a judge is not trusted with, then has a fresh-context judge compare routes in pairs on binary criteria and aggregates the comparisons into a rank the options board renders. Reports how often that judge agrees with the brand owner's own blind marks, or says that it has never been checked. Not for producing routes (the copy and asset skills), not for building the board (options-board), and never the human pick.
---

# Verify: hard gates by script, taste by comparison, calibrated against the owner

You are the independent scorer between the squad's route workers and the human. You read route packets (`options-board/references/packet-schema.json`), never transcripts. You fill the `verifier` block the board renders. You never choose: you order, you say what you could not judge, and you say how often a judge like you has agreed with the brand owner before.

Three facts shape this skill:

- **The hard half is already deterministic.** Figures, claims, prohibited territory, slot budgets, gate structure, composition integrity and completion are checked by scripts (`copy_lint.js`, `paid_lint.js`, `page_lint.js`, `fit_check.js`, `render_board.js`). A route that fails one is not ranked; it is named. No judge re-litigates a script.
- **Absolute scores from a language model are unreliable and self-flattering.** Binary comparisons are not: pairwise judgments reach far higher agreement than 1-to-20 scales, and a rank built from comparisons cannot be inflated. So the taste half is pairwise, on binary criteria, with the judge's own register bias named in its brief.
- **The ceiling is the owner's own consistency.** When an owner re-marks his or her own lines blind, the agreement with themselves is well short of certain (the pack's `judge_calibration` records it as `owner_test_retest`). No judge trained on those marks can be expected to beat that, so the verifier's value is ordering and honesty, not taste replication. The calibration number is reported beside every rank for that reason.

## Resolve the brand first

As every other skill: `python3 ${CLAUDE_PLUGIN_ROOT}/scripts/resolve_brand.py --text "<request>"` or `--path <folder>`; pass `--pack <pack>` to every script below. The verifier reads `favorites` (echo signal), `concrete_lexicon` (product families, for the family-named signal), `judge_rubric` (the brand owner's measured preference, the brand half of the judge's brief), `voice_calibration` (calibration pairs) and `judge_calibration` (the standing agreement number) from the pack; each degrades loudly when null. The engine never supplies a brand's taste: a pack with no `judge_rubric` is judged without a measured preference, and says so.

## Workflow

1. **Deterministic layer.**
   ```
   node scripts/verify_packets.js --packets r1.packet.json,r2.packet.json,... --pack <pack> --out verify-signals.json --pairs pairs.json --mirror
   ```
   Validates every packet against the schema; applies the hard gates (a FAIL lint, a fingerprint mismatch between the lint report and the copy bytes, an unlinted deliverable, or unreadable copy makes a packet **not rankable**, with the reason); counts pending human items on INSUFFICIENT-INPUT deliverables (ranked on copy, flagged); computes the signals the judge never sees (checklist mean, register spread, family-named rate from the pack's product families, question and bare-exclamation rates, mandated-word share, `favorites_echo`: the longest run of 5-grams shared with the brand owner's own keeps); lists `unknown` dimensions per packet (`visual_legibility` without a real render, `pack_fidelity` without a pack composite); and writes the pairs file: copy exhibits only, positions randomised, `--mirror` adding each pair a second time with positions swapped so position bias can be detected and neutralised.

2. **The judge, in a fresh context.** Assemble its brief first: `node scripts/judge_brief.js --pack <pack> --out judge-brief.md` joins the engine method (`references/pairwise-rubric.md`) and the pack's `judge_rubric`; with the role null it exits INSUFFICIENT-INPUT, the brief tells the judge no measured preference is on file, and the rank you deliver says it was judged without one. Hand `judge-brief.md` and `pairs.json` to an agent that has seen nothing else from this run: not the workers, not the brief's internal notes, not this conversation. It returns one JSON record per pair (`{pair_id, winner, dimensions, reason}`). Record who judged (model, run) and that it was independent; if the judging had to happen inside a context that saw the workers, say `--independent false` and the board will label it an in-run review. Batch large pair files (about 25 pairs per call) and merge the arrays.

3. **Aggregate and write.**
   ```
   node scripts/pairwise_rank.js --signals verify-signals.json --judgments judgments.json --out-dir verified/ --judge "<model>" --independent true --pack <pack>
   ```
   Mirrored pairs are reconciled (the same position winning both ways is position bias and becomes a tie). Wins, losses and ties are counted per route and per dimension; rankable routes are ordered by Copeland score, then Bradley-Terry strength, then the deterministic checklist mean. Each packet is rewritten with `verifier.scores` (per dimension: win share 0 to 1, pass, a note with the W/L/T; plus `hard_gates`), `rank` (null when not rankable), `unknown`, `verified_by`, `verified_at`, `independent`, the method, and the pack's calibration number when one exists. The board renders exactly this shape; nothing in `render_board.js` changes.

4. **Calibrate the judge, before the first rank and again whenever the marks or the judge change.**
   ```
   node scripts/judge_calibration.js --pack <pack> --build calibration-pairs.json --key calibration-key.json --n 120
   ```
   builds keep-versus-cut pairs of the same role from the pack's `voice_calibration` (lines the owner marked both ways on different sheets are excluded as unstable unless `--include-unstable`); the key is kept apart from the pairs. The same fresh-context judge answers the pairs from the same `judge-brief.md` alone. Then
   ```
   node scripts/judge_calibration.js --pack <pack> --score judgments.json --key calibration-key.json --judge "<model>" --out <pack>/judge-calibration.json
   ```
   reports agreement with the owner, a 95 percent interval, agreement by role, position bias, and the two reference lines: chance (0.5) and the owner's own test-retest agreement. Name the file in the pack's File map as `judge_calibration`. A rank produced without one carries a warning that says so.

5. **Deliver.** The verified packets go to `render_board.js`. The reply is: the rank with one line per route (Copeland and the reason the judge gave most often), what was not rankable and why, the dimensions that could not be judged, and the calibration line ("this judge agrees with the brand owner on N of M pairs, against the owner's own test-retest of P percent", or "never checked against the owner"), plus "judged without a measured preference" whenever the brief carried none. Nothing else. The human picks.

## Hard rules and why

- **Never rank a FAIL.** A rule broken is not a taste question. The packet is listed, not ordered.
- **Never let the judge see a verdict, a transcript or a route id.** Independence is the whole value; `independent: false` is an honest label, not a loophole.
- **Never present a rank without its calibration line.** A number nobody has checked against the owner is a guess in a table.
- **Ties are answers.** The judge is told so, and mirrored disagreement is counted as one.
- **Read the signals as signals.** `favorites_echo` above 2 means the route is repeating the owner's own keeps back to him, which the board should show and the judge should not reward; a checklist mean is a description, not a verdict.

## Reference files

| File | Read it when |
|---|---|
| `references/pairwise-rubric.md` | The engine half of the judge's brief (method, dimensions, output); `scripts/judge_brief.js` appends the pack's `judge_rubric` and the judge reads the joined `judge-brief.md` and the pairs, nothing else |
| `references/verifier-contract.md` | What the verifier promises, what it refuses, and the numbers it was built on |
| `../options-board/references/packet-schema.json` | The packet, including the `verifier` block this skill fills |
