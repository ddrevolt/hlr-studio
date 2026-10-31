# The route plan: method, bounds, and the unattended policy

A route plan turns one brief into N complete executions the squad runs in parallel, one worker
per route. Every worker inherits the same structured brief; what differs between them is the
**strategic frame** the route leads. This file is the method behind `<slug>.routes.json`.

## Where the frames come from

The pack's `route_axes` role names the frames a route may lead, the default and maximum route
counts, and any standing angle policy per content type. That file is brand data: a brand may cut
or add frames, tighten the counts, or rule that a type always leads a given axis.

When the role is null, the engine defaults apply and every output says so: the six frames
**benefit, occasion, product, proof, urgency, curiosity** (the email gate model's angle axes),
three routes by default, five at most, no standing policy. While a pack file's `_status` is not
`ratified`, the plan says the axes are proposed. The engine never treats a proposal as brand law.

## How many routes

**As many frames as the brief supports, usually the default, never more than the maximum.**

- A frame the brief cannot support stays empty and is listed in `axes_left_empty` with the reason.
  A product with no proof has no proof route worth writing; an evergreen send has no urgency route
  worth writing. Forcing one manufactures filler, and filler on the board costs a reviewer's
  attention.
- Fewer than the default is allowed and warned on: the plan must say why the other frames were
  unsupportable, in `axes_left_empty`.
- Two routes read as an A/B, not a choice. Six read as a flood: the reviewer stops reading. The
  maximum is a cap on attention, not on ideas.

## Why routes vary on frame only

The pick is the strategic bet. For a human to make that bet cleanly, the options must differ in
**what the execution argues**, not in how it sounds. So:

- Every route leads a different axis (`axis` is unique within the plan; the lint refuses a repeat).
- Register and tone are held constant across the plan (`register_held_constant: true` on every
  route). Two routes that differ in tone are one route written twice, and a pick between them is a
  taste call dressed as a strategy call. Tone is chosen later, inside a route, by the copy skills
  on their own gates.
- Each route names its `supported_by` evidence: the brief facts and the customer-evidence leads
  (by id) that make the frame supportable. A route nothing supports is a guess wearing a frame,
  and the lint warns on it.
- Each route states its `weakness`. Three routes that all sound strong are a harder choice than
  three that are honest, and the weakness is usually what the chooser already half-suspects.

This is the generation-axes rule the copy skills already follow (vary on strategic frame, hold
register constant), applied one level up.

## Attended: the human picks

Present the routes flat and unscored. Say which you would pick and why (`recommended`,
`recommended_why`). Then stop. Nothing downstream is developed until a person picks, because the
angle is the one call the model never makes for you: everything downstream is that argument said
different ways, and a route nobody chose is a route nobody wanted.

A pick, when it comes, is recorded on the route: `selected: true`, `selected_by: "human"`. The
others stay `selected: false`, and the reason a route was passed over (occasion, weaker,
off-brief, duplicate, blocked) is worth recording on the board so nobody re-litigates it.

## Unattended: do not block, do not decide silently

An unattended run (a batch, a schedule, a fan-out with nobody watching) still needs a plan. Two
rules, in order:

1. **A standing angle policy applies when the pack names one for this content type.** Select that
   route with `selected_by: "standing angle policy"` and list the others. The policy is the brand
   owner's standing decision, recorded in `route_axes.standing_angle_policy`, and applying it is
   following an instruction, not making a bet.
2. **Otherwise every route is selected, by the unattended policy.** `selected: true`,
   `selected_by: "unattended policy"` on each. The squad runs all of them and the board shows all
   of them; the human picks from finished options instead of from angles.

Either way the plan carries `provisional: true`, the summary says the strategic bet was not
ratified by a person, and the lint refuses an unattended plan that is not marked so. An unattended
run may produce a plan; it may not present a bet as settled.

## What a route carries

```json
{ "id": "R2", "axis": "occasion", "angle": "The gift that says you were paying attention",
  "tension": "finding a gift is easy; believing it says the right thing is not",
  "supported_by": { "brief_facts": ["offer: 20% off the first order", "audience: no prior order"],
                    "customer_evidence": ["G1", "G3"] },
  "channels": ["email", "paid"], "weakness": "rests on a claim about the reader's doubt that nothing in the grounding pool states directly",
  "register_held_constant": true, "selected": false, "selected_by": null }
```

The angle is one line and abstract: the lens, not the headline. Headlines, subjects and hooks are
the copy skills' work, inside the route, on their own gates and their own exemplars.
