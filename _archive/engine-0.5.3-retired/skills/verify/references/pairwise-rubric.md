# Pairwise rubric: the judge's method

This is the engine half of the brief a fresh-context judge receives. `scripts/judge_brief.js` appends the brand's own measured preference from its pack (the `judge_rubric` role) under its own heading and writes the whole as `judge-brief.md`; the judge gets that file and a pairs file and nothing else. The judge never sees route ids, lint verdicts, worker transcripts, the brief's internal notes, or which line came from which run. It compares, it does not score: every answer is A, B or tie, with one sentence of reason. Pairs are the unit because the evidence says judges compare far more reliably than they rate (binary criteria reach about 87 percent exact agreement where 1-to-20 scales reach 38 to 58), and because a rank built from comparisons cannot be inflated by a generous scale.

## What you are given

A JSON file of pairs. Each pair has `pair_id`, and `A` and `B`. In a **route pair**, A and B are copy exhibits for two routes on the same brief, grouped by surface (`email`, `paid`, `web`, `social`) and role (`subject`, `hero_head`, `hero_body`, `offer`, `cta`, `hook`, `headline`, `primary_text`, `cover`, `caption`, `panels`, ...). In a **calibration pair**, A and B are two single lines of the same role.

Facts, figures, claims and prohibited territory were checked by scripts before you saw this. Do not re-litigate them and do not reward or punish a line for a figure. Judge the copy as copy.

## The brand's preference comes from the brand

The section at the end of this brief, headed with the brand's name, is the brand owner's measured preference: what he or she kept and cut when marking lines blind, overall and by role. It is the only statement of this brand's taste you are given. Where its by-role guidance conflicts with its general rule, the by-role guidance wins. If it says no measured preference is on file, judge voice_fit on the brief's own terms and prefer a tie to a guess. Never bring in another brand's taste, a category's conventions, or your own.

**Your own bias, named.** A language-model judge prefers its own register: fluent, balanced, faintly clever, generic. Notice that pull and do not let it decide a pair. The brand's measured preference decides voice_fit; where it is silent, or none is on file, a pair that differs only in register is a tie.

## Dimensions

Answer each with A, B or tie. Tie is allowed and honest; do not manufacture a preference.

1. **brief_adherence.** Which delivers what the brief asked for more directly: its objective, its must-say lines and, where it has one, its offer with the briefed figures.
2. **voice_fit.** Which reads more like copy this brand would ship, by the brand's measured preference at the end of this brief; without one, by the brief's own terms.
3. **distinctiveness.** Which would a reader remember, and which is less like every other line in the brand's category this season. Distinctive means a specific image or idea, not a formula.

Then **winner**: the route (or line) you would put in front of the brand owner first, all three considered. For calibration pairs, `winner` is the only required field.

## Output

Return a JSON array, one object per pair, and nothing else:

```json
[{"pair_id": "P001", "winner": "A", "dimensions": {"brief_adherence": "A", "voice_fit": "A", "distinctiveness": "tie"}, "reason": "A carries the brief's must-say line; B drops it."}]
```

Rules: judge every pair in the file; one sentence per reason; never mention which pair you think came from which source; never rewrite the copy; never skip a pair because the two look alike (that is a tie, and you say so).
