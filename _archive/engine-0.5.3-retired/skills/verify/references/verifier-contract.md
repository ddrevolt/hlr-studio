# Verifier contract (studio-engine 0.5.1)

## What it promises

1. **Every hard gate is deterministic and runs before any judgment.** Schema validity, lint verdicts per deliverable, the fingerprint between each lint report and the copy bytes it certified, completion. A packet that fails one is `rankable: false` with the reason, and its `verifier.rank` is null. The board shows it as unranked, never as last.
2. **Taste is judged by comparison, never by rating.** The judge sees two routes' copy at a time and answers A, B or tie on three binary questions (brief adherence, voice fit, distinctiveness) and an overall pick. Ranks are aggregated from those comparisons (Copeland, then Bradley-Terry, then the deterministic checklist mean). Scores shown on the board are win shares, 0 to 1, with the W/L/T beside them.
3. **The judge is independent by construction.** It receives the judge brief (`judge_brief.js`: the engine rubric plus the brand's measured preference from its pack) and the pairs file: copy exhibits only, positions randomised, no route ids, no lint verdicts, no transcripts. `verifier.independent` records whether that held; an in-run review is labelled as such.
4. **Position bias is measured and neutralised.** With `--mirror`, every pair is judged twice with positions swapped; when the same position wins both times the pair is a tie and the count of such ties is reported.
5. **Every rank carries its calibration.** `judge_calibration.js` tests the same judge on keep-versus-cut pairs from the brand owner's own blind marks and stores the agreement rate in the pack (`judge_calibration` role). `pairwise_rank.js` copies it into every verifier block; a rank produced without one carries a warning.
6. **The taste it judges by is the brand's own.** The engine rubric carries the method; what this brand's owner keeps and cuts is the pack's `judge_rubric`. A pack without one gets a brief that says no measured preference is on file, and the rank is reported as judged without one. No brand's preference is applied to another: not in the judge's brief, not in the copy skills' selection checklist, not in the engine's fallback voice model.
7. **Unknown is a value.** Dimensions that cannot be judged from what the packet carries (visual legibility without a real render, pack fidelity without a composite) are listed under `unknown`, never scored.

## What it refuses

- To rank a packet whose lint failed, whose copy was edited after linting, or whose copy it cannot read.
- To score in isolation on a numeric scale.
- To let the judge see anything that names the source of a line.
- To present a number as the brand's taste when the owner's own test-retest agreement is lower than that number would need to be.
- To choose. The pick is the human's; the board orders and shows.

## The evidence it rests on

- Pairwise over absolute scoring: binary criteria reach about 87 percent exact agreement against 38 to 58 for ordinal scales; criterion order alone shifts absolute scores 0.12 to 0.68 on a 5-point scale; same-family judges prefer their own register (preference correlates 0.999 with style), which the rubric names as a bias to lean against.
- The owner's own consistency is the ceiling. When an owner re-marks his or her own lines blind, the agreement with themselves is well short of certain, and no judge trained on those marks can be expected to beat it. `judge_calibration.js` reads that number from the pack's own calibration (`owner_test_retest`).
- A general rubric does not carry a brand's taste. On the first brand calibrated on this engine, a judge briefed on a general rubric agreed with the owner at about chance, and a judge briefed on that owner's own by-role preference did far better. Each brand needs its own marks; no brand's numbers or preferences apply to another.

## Why the verifier is worth having below a perfect ceiling

Not to replace the owner's taste; it cannot. Three cheaper things: it removes every hard failure before a human sees the board (done by script, no ceiling), it orders a route set so the likely keepers are read first (a small but real saving in correction time, and measurable), and it tells the truth about what it could not judge and how often it has agreed with the owner. If a later marking protocol raises the owner's own consistency (two passes, stable marks only), the same machinery gets better for free; nothing here has to change.
