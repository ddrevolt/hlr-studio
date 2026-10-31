---
name: social-copy
description: Write organic social copy for any registered brand (feed post captions, carousel covers and panels, story sets) and check it against the brand's claims law, Instagram's caption and hashtag limits, and the brand's social slot map. Use whenever someone wants captions, an Instagram post or carousel, story frames, a weekly series post, "the copy for Monday's carousel", "write the stories for the launch", or asks to turn a brief into organic posts, including casual delegation and batches. Proposes three angles for a human to choose from, then cover lines, captions and the copy for every panel or frame, composed whole, cut to the stamped slots, and self-checked with a bundled lint. Resolves the brand from the request or folder and reads voice, claims rules, products, favorites and its social masters live from its pack. Not for paid ads (use paid-ad-copy), not for scheduling or posting, and not for building the frames themselves (asset-production builds S01, S03 and S04).
license: MIT
metadata:
  version: 1.0.0
---

# Organic social: brief in, a post's angle, cover, captions and panels out

You write **posts a person scrolls past on purpose or stops for**: a feed post, a carousel or a story
set, on the brand's schedule. Organic runs weekly, so the failure it invites is the template that
writes itself: the same cover, the same opener, the same sign-off, on voice and not worth the swipe.
The angle runs every time, the cover is a spread of hooks, and the captions differ where the reader
decides: the first line.

The engine is brand-neutral. Everything brand-specific (voice, claims law, products, prohibited
territories, its series, its social masters and their ceilings, its favorites and calibration)
comes from the resolved brand's pack through **`brand-context.md`**. The run stops if the brand cannot
be resolved or the pack cannot be found.

## What this owns, and what it does not

This skill: angles, cover lines, captions and the copy for every panel or frame of an organic post.
`asset-production`: the frames (S01 feed post set, S03 carousel set, S04 story set; recipes in its
`asset-types.md`). `paid-ad-copy`: ads, including a story that will run as one. `customer-evidence`:
where a claim about customers comes from. Nothing in this suite: scheduling, posting, community
replies.

## Resolve the brand first

Resolve one, in order: (a) a brand name or alias in the request; (b) otherwise the connected folder
path, `claude-cowork/<brand>/...`; (c) otherwise ask once, listing the registered brands, and stop.
`python3 ${CLAUDE_PLUGIN_ROOT}/scripts/resolve_brand.py --text "<request>"` (or `--path <folder>`)
does (a) and (b) and prints the pack folder; exit 2 is unresolved or ambiguous, and the engine never
picks between brands.

Then read `<pack>/brand-context.md` and its **File map**: the voice contract, legal ledger, product
database, social slot map (`slotmap_social`), favorites, exemplars, voice model and lexicon. Pass
`--pack <pack>` to every script. Roles and costs: `${CLAUDE_PLUGIN_ROOT}/references/pack-contract.md`.

| Role | Missing means | Blocks |
|---|---|---|
| `prohibited_patterns` | The lint cannot run: copy would be certified against no claims rules. The one hard stop. | **everything** |
| `voice_contract` | Angles still run. Finished captions and panels in a voice reconstructed from memory do not. | cover, caption and sequence |
| `exemplars`, `favorites` | Copy comes back fluent and generic. Draft from the contract alone and **say so in `notes`**. | nothing; degrades, loudly |
| `product_db` | No figure is verifiable, so the post states none. | nothing; degrades |
| `legal_ledger` | Graded claims rules are off; the prohibited list still enforces. | nothing; degrades loudly |
| `slotmap_social` | Panel and frame copy is unchecked against any real slot; the lint says `slot_checking: OFF`. | nothing; degrades |
| `voice_model`, `concrete_lexicon` | The voice lint runs on the engine default, announced and weak. | nothing; degrades loudly |

**Say all of it at once, at the top, before the work.** Never invent what a missing role would have
supplied: with no facts layer, write zero figures.

## The workflow

### 1. Read the brief and the format

The post format is `feed_post`, `carousel` or `story_set` (`references/gate-data.json → FORMATS`).
Take the panel or frame count and the ratios from the brief, the series from the brand's type
registry (`type_registry_overlay`) or its `asset_types` roster when the post belongs to one, and the
master (`module`) from the brand's social slot map. Products resolve through
`node ${CLAUDE_PLUGIN_ROOT}/skills/email-copy/scripts/sku_lookup.js --pack <pack> --match "<name>"`:
that output is the facts layer, and nothing else licenses a figure.

### 2. Angle, with a human between

Three framings, each leading a different axis, each saying what the post gives a reader who never
buys. **When brief-intake has already selected a route, the angle gate is not skipped**: it runs
inside the route's frame, every option on the route's axis, differing on `scene`. A claim about
customers cites the `grounding` pool (`grounded_in`) or stays out. **Present the three, recommend
one, and stop.** Unattended: develop the recommendation and label it provisional
(`angle_gate: {picked_by: "recommended", provisional: true}`).

### 3. Cover, caption, then the panels or frames

Before each gate, show it the brand's real lines for its role, favorites first:

```
node scripts/exemplar_pick.js --pack <pack> --channel social --role <cover|caption|headline|body|cta>
```

Copy the SHOWN ids into `provenance.exemplars_shown`. **Never fall back to email, paid or web
exemplars**: a caption is a different job from a subject line or an ad, and substituting produces
copy that is fluent, on voice and wrong for the surface.

- **Cover (3).** The line the post leads with, hooks by position: A Problem, B Curiosity gap,
  C Direct address. A feed post with no text on the image skips it (`on_image: false`).
- **Caption (3).** Whole captions as posted, each with a different first line (before the fold).
  Story sets have none.
- **Sequence.** On the human's pick: a carousel runs cover, inner panels, end; a story set runs
  frames, each one structure (text, inset, full bleed, split); a feed post is one entry.

**Compose, map, cut, lint, in that order.** Compose each caption and each panel whole, with no
limits in view; map panel copy to the stamped slots of the declared `module`; cut what is over its
ceiling in a separate pass and record each cut in `cuts`; then
`node ${CLAUDE_PLUGIN_ROOT}/scripts/fit_check.js --slate post.social.json --pack <pack> > fit_check.json`.
Every form choice comes from the brand's voice contract, its slot map and, once it has one, its own
fitted model; where the brand has not ruled, say what you assumed in `notes`. Recipes and the
selection checklist: `references/generation-contract.md`.

### 4. Lint

```
node scripts/social_lint.js --slate post.social.json --pack <pack> --facts facts.json > social_lint.json
node ${CLAUDE_PLUGIN_ROOT}/scripts/voice_lint.js --slate post.social.json --pack <pack> > voice-lint.json
```

| verdict | what it means | what you do |
|---|---|---|
| `PASS` | every check ran and found nothing | ship |
| `WARN` | craft findings: a first line past the fold, a pasted URL, two captions with one opener, a missing `exemplars_shown` | fix what you can, then ship and list the rest |
| `FAIL` | a rule was broken: an unverified figure, a prohibited territory, a caption over the ceiling, too many hashtags, a carousel out of shape, copy over a slot | fix and re-run. Never ship |
| `INSUFFICIENT-INPUT` | a check **could not run**: a slot with no measured budget, a conditional claim, a gate deliberately not run | a human resolves it and records the resolution |

Read `checked.slot_checking` and `checked.caption_checking`: they say `OFF` with the reason
whenever a check could not run. Platform numbers come from `references/organic-specs.json`, with
their sources and confidence; a contested or approximate number warns and never fails (the fold is
approximate).

### 5. Deliver

One JSON per post (`references/output-format.md`), plus the three reports as their own files: **the
verdicts live there, never in `notes`.** The frames are built by `asset-production` from the
sequence.

## Hard rules and why

**No figure that does not trace.** A post is a claim the brand makes in public, every week.

**No claim outside the ledger.** A caption is copy; the ledger reads it like any other.

**No customer's words without their source.** A quote on a panel or in a caption cites the
grounding item it came from (`verbatim_source`).

**Prohibited territories are absolute** and override the brief. Refuse in the copy and raise a flag.

**Compose whole, then map, cut, lint.** No caption or panel is written to a character limit.

## Reference files

| File | Read it when |
|---|---|
| `references/gate-data.json` | Counts, axes and hooks per gate; the three post formats and what each requires |
| `references/organic-specs.json` | Any question about caption length, the fold, hashtags, the carousel range, the grid crop or story safe zones. Carries sources and a confidence per number |
| `references/generation-contract.md` | Writing the gates: angle, cover, caption, sequence; compose, map, cut, lint; selection |
| `references/output-format.md` | Writing the deliverable |
