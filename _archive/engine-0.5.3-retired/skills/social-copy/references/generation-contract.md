# Generation contract: organic posts, gate by gate, and the compose, map, cut, lint order

The gate counts and axes are in `gate-data.json` and nowhere else. Platform numbers are in
`organic-specs.json`. Everything about the brand (its voice, its series, its masters and ceilings,
its claims law) comes from its pack. This file says how to write each gate and why.

## Why the contract reads this way

Organic posts run on a schedule, not a media plan: a weekly carousel, a monthly story set, a launch
post. The failure that schedule invites is the template that writes itself: the same cover shape,
the same caption opener, the same sign-off every week, all of it on voice and none of it worth the
swipe. So the angle still runs every time, the cover is a real spread of hooks, and the three
captions differ where the reader decides: the first line.

## Angle

Three framings of the post, each leading a different axis (Benefit, Occasion, Product, Proof,
Urgency, Curiosity) when no route is pre-selected; **inside a pre-selected route** every option
leads the route's axis and a different `scene` or mechanism. Each says, in `why`, what the post
gives a reader who never buys. A series post (the brand's weekly or monthly format) still gets three
angles on its subject: the series fixes the shape, not the idea.

A claim about customers (what they want, what they do, what they feel) is grounding, not angle: cite
it from the `grounding` pool the way paid concepts do (`grounded_in`), or leave it out.

**A human picks.** Present the three, recommend one and say why, and stop.

## Cover line

The line the post leads with: a feed post's on-image line, a carousel's cover, a story set's first
frame. Three options, hooks by position: A Problem, B Curiosity gap, C Direct address. The cover
earns the swipe or the tap, so it carries the promise the rest pays off, in a picture a reader can
see. A cover that only names the series is a label, not a hook.

## Caption

Three whole captions, as posted. The part that matters most is the **first line**, everything before
the fold (`organic-specs.json → caption.visible`): the hook, any must-say and the offer land there or
not at all. The three differ in their first line. After the fold: the body the brand's voice
contract allows, one call to action, and hashtags inside both the platform's maximum and the
brand's own rule. A URL in a caption does not click, so a caption points to the profile link or a
story sticker, never to a pasted address.

Story sets carry no caption: skip the gate and say so, never invent one.

## Panels and frames (the sequence)

Written once, on the picked angle and cover.

**Carousel.** Cover first (the picked cover line), then inner panels, then the end panel. One idea
per inner panel, in the order a reader needs them; the panel count comes from the brief and stays
inside the platform's range. The end panel does one job: the action, the takeaway or the sign-off.
In a seamless strip no word crosses a seam (the recipe is in `asset-production`, S03).

**Story set.** Frames in order, each one structure (`text`, `inset`, `full_bleed`, `split`), chosen
by what the frame has to do: a line on its own (text), a product or image that needs a frame
(inset), a scene (full bleed), the product with its copy (split). The first frame carries the picked
cover line. Leave the brand's sticker band clear; a sticker is added in the app, never written into
the frame.

**Feed post.** One entry: the picked cover line and whatever else the post's master stamps.

## Compose, map, cut, lint

- **Compose** each caption whole and each panel or frame whole, in natural form, with no character
  limits and no slot names in view. Every must-say string once; the briefed offer with its figures.
  Store it as `composed`. Every form choice (length, case, whether a question or an exclamation
  belongs, emoji and hashtags, how the product and the offer are named) comes from the brand's
  voice contract, its slot map and, once it has one, its own fitted model; where the brand has not
  ruled, say what you assumed in `notes`.
- **Map** panel and frame copy to the stamped slots of the brand's social master
  (`slotmap_social`), declared as `module`: `S03.cover.headline`, `S03.inner.body`,
  `S04.split.body`. The caption maps to nothing unless the brand stamps a caption layer
  (`S03.caption`, keyed `caption` in the slots).
- **Cut** any string over its ceiling in a separate pass: delete before rewriting, keep the idea and
  the rhythm, keep every must-say verbatim, never introduce a figure or claim the composed text did
  not carry, and when the idea cannot survive the cut return the string unchanged and flag it. Record
  each cut in that entry's `cuts` array and run `fit_check.js`. A panel or frame cut takes its
  budget from the slot map. A caption has no slot, so a caption cut (over the platform's ceiling, or
  over a caption length the brand's voice contract states) records `slot: "caption"` and the
  `budget` it was cut to; without one, `fit_check.js` asks for a sign-off rather than guess.
- **Select.** Angle fit is pass/fail. The rest rank on the binary `checklist`: the brief items every
  brand gets (`must_say` carried, `offer_figures` as briefed, `in_budget` inside the ceilings) plus
  the brand items its own voice contract and `judge_rubric` state, never another brand's. The voice
  lint's likelihood breaks ties only when the pack has its own fitted model.

## Claims

The same ledger, prohibited list and facts layer as every other channel: a claim is a claim whether
it sits in a caption or a carousel panel. Every figure traces to the facts layer. A customer's words
on a panel or in a caption cite the grounding item they came from (`verbatim_source`). Prohibited
territories override the brief, including a brief that asks for one: refuse in the copy and raise a
flag.
