---
name: web-copy
description: Write the copy that fills the web section library of any registered brand: collection pages, product and bundle pages, campaign landing pages, editorial and SEO pages, composed from masters that already exist rather than invented from scratch, with every string checked against its slot's measured budget at every breakpoint it ships, against the claims ledger, and against the accessibility floors a public page owes its readers. Use whenever someone wants web copy, site copy, page copy, a landing page, a collection or category page, PDP copy, an FAQ, hero or section copy, or asks to adapt an existing page for mobile or for search. Also use to audit a page that already exists. Resolves the brand from the request or folder and reads voice, claims law, products and the section library live from its pack. Not for email (use email-copy), not for paid ads (use paid-ad-copy), and not for building the Figma section masters themselves.
license: MIT
metadata:
  version: 1.0.0
---

# Web sections: pages assembled from a library, filled with copy that fits

**The sections already exist.** A brand that has built its web library has masters derived from a profile of its live site, pages assembled at its breakpoints, and a slot map. This skill writes into those slots and checks the result: **you are not designing pages, you are composing from a library and writing to measured boxes.** A page that needs a section the library does not have is a request for a new master; say so plainly.

Three things make web different from email and paid. **Mobile is not a reflow**: a benefit row becomes a carousel whose slides are a fraction of the desktop card, and copy that fits the card can be half again too long for the slide; the desktop breakpoint will never tell you. **A page is wrong until somebody notices**: same claims rule as email, far longer exposure, so the ledger is not optional. **Accessibility is a floor, not a finish**: the one gate email and paid do not have, and on web a legal object.

## Resolve the brand first

Nothing here knows a brand. Resolve one, in order: (a) a brand name or alias in the request; (b) otherwise the folder path, `claude-cowork/<brand>/...`; (c) otherwise ask once and stop. `python3 ${CLAUDE_PLUGIN_ROOT}/scripts/resolve_brand.py --text "<request>"` (or `--path <folder>`) does (a) and (b) from `brands/registry.yaml`; exit 2 is unresolved or ambiguous, and the engine never picks. Then read `<pack>/brand-context.md` and pass `--pack <pack>` to every script below. Roles and what each missing one costs: `${CLAUDE_PLUGIN_ROOT}/references/pack-contract.md`.

A missing role costs something specific, and the costs are not equal. Resolve what is there, **name what is not, all at once, before the work**, and carry on to the last thing the inputs support.

| Role | Missing means | Blocks |
|---|---|---|
| `prohibited_patterns` | The lint cannot run: a page would be certified against no claims rules, and it stays up. | **everything** |
| `section_library` | The measured section roster, slot budgets per breakpoint and page types. The engine ships only the schema (`references/section-data.json`, empty roster) and `page_lint.js` refuses to grade against it. | **everything** |
| `slotmap_web` | Parsed and governing when present; without it budgets come from the section library alone and the report says so. **The live map wins**: it is generated from the built components. | nothing; degrades |
| `voice_contract` | You can compose the page and specify what each slot must say, not write finished copy in a voice reconstructed from memory. | the **copy**, not the composition |
| `exemplars`, `favorites` | The copy comes back generic, brand-shaped rather than shaped like this brand: the failure hardest to see in review. Draft from the contract alone and **say so in `notes`**. | nothing; degrades, loudly |
| `product_db` | No figure is verifiable, so the page states none. | nothing; degrades |
| `legal_ledger` | Graded claims rules off; the prohibited list still enforces. The lint reports `claims_checking: OFF`. | nothing; degrades loudly |
| `tokens` / colour pairs | Contrast cannot be checked, the accessibility finding most likely to exist. | the contrast check only |
| `voice_model`, `concrete_lexicon` | The voice judge runs on the engine's default weights and neutral lexicon, announced and treated as weak. | nothing; degrades loudly |

## The workflow

### 1. Name the page type and the one thing the page is for

The page types live in the brand's section library (`page_types`): typically **collection**, **pdp**, **landing**, **editorial**. The type sets the expected section sequence and, where the library says `requires`, the sections that make it that type at all; an editorial page without its rich-text block is a collection page with fewer products.

**One page, one job.** A page serving two search intents or two audiences does both badly; say so rather than hedge.

### 2. Compose from the library

Read `channels.web` and the slot map live; use the section library for the shape and the budgets. Pick the sequence, not the layout.

**When several pages of one type already exist and differ mostly in copy,** say so: the answer is usually the same sections with different words. **A section the library does not have is a request, not a gap in your imagination.** Say which master needs building and its slot shape; inventing a near-duplicate is the default failure.

### 3. Compose, map, cut, lint: the class-A sections, in that order

Every section declares a generation class. **Class A** (the generator writes: eyebrow, heading, body, CTA) and the framing fields of **class B** are written this way; **class C** selects from the rights-cleared pool and takes no exemplars; **class D** binds data and takes no copy. The brand owner approved this order; slot-by-slot writing to budgets produced flat copy.

**Show the gate the brand's real lines first**, favorites before the historical file (the brand owner's blind keeps outrank it):

```
node scripts/exemplar_pick.js --pack <pack> --channel web --role <heading|title|description|card_title|eyebrow|cta|message> --type <module term>
```

Paste its output into the section's prompt, copy the ids it prints under SHOWN into `provenance.exemplars_shown`, and read the coverage notes. **A thin pick is a real signal**; exit 1 means no exemplar exists for that role: write from the contract alone and **say so in `notes`**. Never hand a slot another channel's exemplars (the script filters channel before role and never relaxes it). **Carry over cadence and personality, never a figure, a claim or a phrase.** Cuts are never shown.

**Compose.** Write the section whole and in its natural form, no budgets and no slot names in view: eyebrow, heading, body, CTA (a benefit row as its three reasons, one set). One idea, in a scene or object a reader can picture; every must-say string once. Store it as `composed`. Every form choice (length, case, whether a question or an exclamation belongs, how the product and the offer are named) comes from the brand's voice contract, its slot map and, once it has one, its own fitted model; where the brand has not ruled, say what you assumed in `notes`.

**Map.** Assign each composed string to its slot through the section library and the live map; `references/writing-contract.md` says what each slot is for, imposed here, after composition.

**Cut.** Each slot carries a character budget per breakpoint, derived from the measured geometry of the built component. Cut the composed string to the **tightest breakpoint first** (a card body's mobile-slide budget can be two thirds of its desktop budget); a wider breakpoint may take the composed string when it fits. Rules: delete before rewriting; keep the idea and the rhythm; keep every must-say verbatim; never introduce a figure or claim the composed text did not carry; if the idea cannot survive the cut, return the string unchanged and flag it. Record each cut in the section's `cuts` array (`{slot, from, breakpoint, composed, cut, budget}`) and run `node ${CLAUDE_PLUGIN_ROOT}/scripts/fit_check.js --slate page.json --pack <pack> --budgets <budgets.json> > fit_check.json`.

**Budgets are warnings, not walls** (derived from width and type size, so over budget means *look at it in the file*), **except where the budget is zero**: a slot marked `budget: 0` at a breakpoint is not rendered there, copy written into it disappears, and that one is an error.

### 4. Lint

```
node scripts/page_lint.js --page page.json --pack <pack> --facts facts.json > lint.json
node ${CLAUDE_PLUGIN_ROOT}/scripts/voice_lint.js --slate page.json --pack <pack> > voice-lint.json
```

Read `checked.paraphrase_review`: ledger topics marked `paraphrase_risk` are listed there, matched or not, because the lint matches wording and never judges meaning. The voice lint is advisory and never fails a page: per-line keep likelihood, top three flags, distribution per section, the model version that scored it; a weak model says so on every run. Read its flags, not its decimals.

| verdict | what it means | what you do |
|---|---|---|
| `PASS` | every check ran and found nothing | ship |
| `WARN` | budgets, an open modelling decision, an SEO mismatch | look at it, fix what you can, ship and say what is left |
| `FAIL` | a rule was broken: a claim, an unverified figure, a slot that does not exist, copy in a slot that is not rendered | fix and re-run. Never ship |
| `INSUFFICIENT-INPUT` | a check could not run: no declared breakpoints, an unratified page type, a ledger topic with no machine-checkable required language | a human resolves it. Not fixable by re-running |

### 5. Check accessibility, separately and always

```
node scripts/a11y_check.js --page page-nodes.json
```

Export the page's headings, links, images and colour pairs and measure them: heading structure (1.3.1), link purpose (2.4.4 / 2.4.9), alt text (1.1.1), contrast (1.4.3), target size (2.5.8), **each finding naming its criterion and conformance level** (overclaiming a level is how a report gets dismissed whole). **It reports, it does not block**; `--strict` exits non-zero for CI; what fails without `--strict` is not being able to run. **A clean result is not an accessible page**: automated checking finds roughly a third of real problems, and keyboard order, focus visibility, motion and reading aloud are not in there. Say that when you report a clean run. Details: `references/accessibility.md`.

### 6. Deliver

One JSON per page (`references/output-format.md`, with `composed`, `cuts`, `register` and `checklist` on each class-A section and `exemplars_shown` in provenance) plus the reports as their own files. Provenance carries `cost`: `{model, input_tokens, output_tokens, media_calls, measured_by}`, model named if stated, the rest null and `measured_by: "not measured"` until an orchestrator fills them. **The verdicts live in the reports, never in `notes`.**

## Hard rules and why

**No figure that does not trace.** Same as everywhere, longer-lived.

**No customer's words without a citation.** A reviews section was once built with invented reviewer names and a rating that did not exist on the site. Every verbatim cites its source.

**Sections the library marks as data-fed take no copy** (a product grid's content is the product database), and **a section gets no slot the library does not stamp**. The per-section rules are the brand's: read them from `section_library` and the slot map.

**Compose whole, then map, cut, lint.** No string is written to a budget; the cut fits it.

**Prohibited territories override the brief.** Refuse in the copy and surface it as a flag.

## Open decisions you will meet, which are not yours to close

The section library records unresolved modelling decisions per section (`open_decision`) and the lint surfaces them on every page composing that section. Write around them and say when one bites; do not quietly pick a side. The known ones: `references/writing-contract.md`.

## Reference files

| File | Read it when |
|---|---|
| the pack's `section_library` | Composing a page; checking a slot's budget or a section's own rules (`references/section-data.json` is the schema only) |
| `references/writing-contract.md` | Mapping the composed section: what each slot is for |
| `references/accessibility.md` | Any finding from `a11y_check.js`, or writing link and alt text |
| `references/output-format.md` | Writing the deliverable |
| `references/brand-context.template.md` | Setting up a new brand, or diagnosing an unresolved role |
