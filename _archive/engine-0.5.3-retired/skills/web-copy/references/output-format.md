# Output format: one JSON per page (format 2)

Plain JSON, no consumer built into it.

**Format 2 (0.3.0) adds:** `composed` and `cuts` on every class-A section (the section as the writer composed it whole: eyebrow, heading, body, CTA; and the entries `scripts/fit_check.js` reads for every string condensed to a breakpoint budget), `register` and `checklist` per section, `provenance.exemplars_shown`, and a third report, `voice-lint.json`.

## File names
`<page-slug>.page.json`, `<page-slug>.page_lint.json`, `<page-slug>.fit_check.json`, `<page-slug>.voice-lint.json`, `<page-slug>.a11y.json`.

## Schema

```json
{
  "skill": "web-copy",
  "format": 2,
  "generated_at": "2026-09-07",
  "page_type": "collection",
  "url_path": "/collections/everyday",
  "breakpoints": ["desktop", "mobile_carousel"],
  "search_intent": "<the one query this page answers>",

  "brief": { "name": "...", "objective": "...", "audience": "...", "must_say": ["..."] },

  "sections": [
    { "id": "<collection header id>",
      "composed": { "heading": "<collection title>", "body": "the description as written, whole" },
      "cuts": [ { "slot": "<collection header id>.description", "from": "body", "breakpoint": "mobile", "composed": "...", "cut": "...", "budget": "<chars from the library>" } ],
      "register": "<a voice quality from the pack>",
      "checklist": { "must_say": true, "offer_figures": true, "in_budget": true, "<brand item from the voice contract>": true },
      "slots": { "title": "<collection title>", "description": "..." } },
    { "id": "<benefit row id>",
      "composed": { "heading": "...", "cards": ["one reason, written whole", "...", "..."] },
      "cuts": [ { "slot": "<benefit row id>.card_body", "from": "cards[0]", "breakpoint": "mobile_carousel", "composed": "...", "cut": "...", "budget": "<chars from the library>" } ],
      "slots": { "heading": "...", "card_title": ["...", "...", "..."],
                 "card_body": ["...", "...", "..."], "cta_label": "..." } },
    { "id": "<reviews id>",
      "verbatim_source": "<review platform>/reviews/<brand>/<id>",
      "slots": { "pull_quote": "...", "review_quote": ["..."], "attribution": ["<as the review platform shows it>"] } }
  ],

  "new_masters_needed": [
    { "shape": "heading + 2 x (image + caption)", "why": "the brief asks for a comparison the library has no slot shape for", "seen_elsewhere": false }
  ],

  "provenance": {
    "brand": "the resolved brand's display name",
    "brand_context": "resolved path",
    "section_source": "slotmap_web.yaml (live) | the pack's section_library",
    "voice": "voice_contract status line as read this run",
    "exemplars_shown": { "<collection header id>.heading": { "favorites": [], "exemplars": [], "exit": 1, "note": "no web exemplar exists; drafted from the contract" } },
    "facts": [{ "sku": "...", "figures": ["..."] }],
    "guardrails": ["prohibited territories", "ledger topics", "slot budgets", "accessibility"],
    "cost": { "model": null, "input_tokens": null, "output_tokens": null, "media_calls": null, "measured_by": "not measured" }
  },

  "notes": [
    { "owner": "system", "severity": "note", "text": "<section> copy written against the editable rebuild; the section library records that the live site ships it as baked images" },
    { "owner": "brief", "severity": "note", "text": "FLAG: brief asked for a barred territory; refused" }
  ]
}
```

## Required blocks

`page_type`, `brief`, `provenance` (with `cost`: `{model, input_tokens, output_tokens, media_calls, measured_by}`, null and "not measured" until an orchestrator fills it) and at least one section. A gate you did not run is declared with its reason, the same way the other skills do it; otherwise the lint cannot tell a deliberate stop from an omission.

**`breakpoints` is not optional in practice.** Omit it and the lint checks desktop only and returns INSUFFICIENT-INPUT saying so, because mobile is not a reflow here and a desktop-only check says nothing about whether the copy survives at 390.

**`composed` and `cuts`** belong to class-A sections (the ones the generator writes: eyebrow, heading, body, CTA) and to the framing fields of class-B sections. Class C selects and class D binds; they carry neither. The lint type-checks `composed` and walks its strings for figures and prohibited territories; the budgets apply to the cut strings in `slots`. Each cut entry names its `breakpoint`; cut to the tightest breakpoint first, and a wider breakpoint may take the composed string when it fits. `fit_check.js` resolves a budget from the entry (copy it from the section library) or from `--budgets`.

## `new_masters_needed` is a real field

A page that needs a section the library does not have is a request for a new master. Write it here with its slot shape rather than describing a layout in prose: the library was derived by grouping on structure, so a shape is what the next person can act on.

## `notes` is not where a verdict goes

The lint verdict lives in `page_lint.json`, the fit check in `fit_check.json`, the voice judge (advisory, naming the model version that scored it) in `voice-lint.json` and the accessibility findings in their own report, all fingerprinted. `notes` is for what no script can know.
