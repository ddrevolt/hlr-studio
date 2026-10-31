# Output format: one JSON per post (format 1)

Plain JSON with no consumer built into it, the same shape rule the other copy skills follow. One
file per post: a feed post, a carousel or a story set.

## File names
`<post-slug>.social.json`, `<post-slug>.social_lint.json`, `<post-slug>.fit_check.json`,
`<post-slug>.voice-lint.json`.

## Schema

```json
{
  "skill": "social-copy",
  "format": 1,
  "generated_at": "2026-10-17",
  "post_format": "carousel",
  "module": "S03",
  "build_mode": "gutter",
  "ratios": ["4x5"],
  "on_image": true,
  "brief_figures": ["figures the brief itself states, as strings, e.g. \"20% off\""],
  "stage": "copy",
  "gates_not_run": {},

  "brief": { "name": "...", "objective": "...", "audience": "...", "offer": null, "must_say": ["..."],
             "products": [], "panels": 6, "series": "the brand's series name, when the post belongs to one",
             "selected_route": { "id": "R1", "axis": "Benefit", "selected_by": "human" } },
  "angle_gate": { "ran_inside_route": true, "picked_by": "human", "provisional": false, "picked": 0 },

  "grounding": [ { "id": "G1", "source": "...", "kind": "review", "text": "the customer's own words" } ],

  "gates": {
    "angle": [ { "copy": "the lens in a few words", "axis": "Benefit", "scene": "...", "why": "...", "grounded_in": [] } ],
    "cover": [ { "copy": "the line the post leads with", "axis": "Problem", "register": "<a voice quality from the pack>",
                 "checklist": { "must_say": true, "offer_figures": true, "in_budget": true, "<brand item>": true } } ],
    "caption": [ { "copy": "the whole caption as posted", "composed": "...", "cuts": [],
                   "register": "...", "checklist": { "must_say": true, "offer_figures": true, "in_budget": true } } ],
    "sequence": [
      { "role": "cover", "slots": { "headline": "the picked cover line", "subline": "..." },
        "composed": { "headline": "...", "subline": "..." },
        "cuts": [ { "slot": "S03.cover.subline", "from": "subline", "composed": "...", "cut": "..." } ] },
      { "role": "inner", "slots": { "headline": "...", "body": "..." } },
      { "role": "end", "slots": { "headline": "...", "cta": "..." } }
    ]
  },

  "provenance": {
    "brand": "the resolved brand's display name",
    "brand_context": "resolved path",
    "voice": "voice_contract status line as read this run",
    "exemplars_shown": { "cover": { "favorites": [], "exemplars": [], "widened": false, "thin": true } },
    "facts": [],
    "guardrails": ["prohibited territories", "ledger topics", "caption limits", "slot ceilings"],
    "cost": { "model": null, "input_tokens": null, "output_tokens": null, "media_calls": null, "measured_by": "not measured" }
  },

  "notes": [ { "owner": "brief", "severity": "note", "text": "..." } ]
}
```

A **story set** carries `"post_format": "story_set"`, no `caption` gate, and sequence entries
`{ "role": "frame", "structure": "text" | "inset" | "full_bleed" | "split", "slots": {...} }`. A
**feed post** carries one sequence entry with `"role": "post"`; a feed post with no text on the
image sets `"on_image": false` and skips the cover gate and the sequence.

## Required blocks

`post_format`, `brief` and `provenance` are not optional. A gate you did not run is declared in
`stage` (`"angle"` while the human picks) or `gates_not_run` with its reason; otherwise the lint
cannot tell a deliberate stop from a forgotten gate and calls it an error. `provenance.cost` is the
stamp's cost line, null and `"not measured"` until an orchestrator fills it.

**Slots.** Sequence `slots` are keyed by role, each value a string (or an array of strings for a
slot that sets a list); the lint maps them to stamped slot ids through the declared `module` and the
entry's own panel or structure: `S03.cover.<role>`, `S03.inner.<role>`, `S03.end.<role>`,
`S04.<structure>.<role>`, `S01.<role>`. A repeat group keeps the panel (`item1.body` on an inner
panel is `S03.inner.item1.body`); a key that already carries the module is used as is and must
belong to that entry's panel; `caption` is the module's caption layer (`S03.caption`) when the
brand stamps one.

**Ratios** are sizes the format builds (`gate-data.json → FORMATS`): a carousel `4x5`, a story set
`9x16`, a feed post any of `4x5`, `1x1`, `9x16`. **`brief_figures`** admits the figures the brief
itself states; anything else needs the facts layer.

**A customer's words** in a caption or on a panel set `"verbatim_source": "<grounding id>"` on that
caption option or sequence entry.

## `notes` is not where the lint verdict goes

The verdicts live in `social_lint.json`, `fit_check.json` and `voice-lint.json`, fingerprinted to
the exact file bytes. `notes` is for what no script can know: which inputs the post drew on, what
needs a human call, what the brief asked for that could not be honoured.

## Counts

From `GATE_META` in `gate-data.json`. Not restated in prose anywhere: a contract that says a number
in two places will eventually say two numbers.
