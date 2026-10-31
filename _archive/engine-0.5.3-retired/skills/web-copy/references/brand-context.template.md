# Brand context — template (web-copy)

Copy to `brand-context.md` in the brand's pack folder (the path `brands/registry.yaml` names for the
brand) and fill in. **This file is where all specificity lives.** The skills that read it stay
generic; nothing brand-specific belongs in them. The authoritative list of every role the engine
reads, which skill reads it and what missing costs is `references/pack-contract.md` at the plugin
root; this template shows the roles `web-copy` reads.

**One `brand-context.md` per folder, and every skill in the suite reads it — but they do not read
the same parts.** The narrative sections below are shared: the category, the customers, prohibited
language, the claims regime. The **File map** is a union of roles, and each skill uses the ones it
needs and says what a missing one costs rather than guessing. `email-copy` cannot run without a
voice contract; `customer-evidence` has no use for one and never asks. If you run both skills in a
folder, keep one file and let its file map carry both sets of roles — two files with the same name
in different places is how a brand fact ends up updated in one of them.

If a skill needs a brand fact that has no section here, add the section. Do not put the fact in the
skill.

**This copy of the template shows the roles `web-copy` reads.** The other skills in the
suite ship their own copies showing theirs; the narrative sections are the same in all of them, and
a folder running more than one skill should hold a single merged file.

---

## Category and product

What is sold, in one line. The shelf it sits on — how customers would describe the category, in
their words rather than the company's.

## Who the customers are

Segments, in the terms the business actually uses. If there are distinct need-states or cohorts that
behave differently, name them — analysis will otherwise average across them.

## Voice

Point at the voice contract in the file map below rather than restating it here; a second copy of
the voice drifts from the first. Note only what a reader needs *about* the contract: how many
qualities, whether one leads per piece, and anything a drafter gets wrong often.

## Where they talk

Named venues: subreddits, review platforms, communities, retailers whose review pages carry
adjacent products. For each, note anything known about who posts there. If any of these are
first-party (own site reviews, own social), mark them — provenance changes how they can be used.

## Prohibited language

Words, claims, and territories that may never appear in output, and why. Include anything under
regulatory constraint. **Research reads all material; this governs what may be quoted or repeated
downstream.** Drafting treats this as overriding every other instruction, including a brief that
asks for one.

## Claims regime

Who approves claims, what the substantiation requirement is, and where the register of approved
claims lives. If customer verbatims may contain claims the company itself cannot make, say so here —
that is common and it needs a rule, not a case-by-case judgement.

## Existing insight or research assets

Prior studies, an insight register, a research repository, a connected research platform. Skills
should read existing findings as corpus rather than re-deriving them.

## Recency window

Default is twelve months. Widen or narrow with a reason — a fast-moving category may need six.

## What this brand already believes

The assumptions currently guiding decisions. **This is the most useful section and the most often
skipped:** an insight must challenge an assumption to qualify, and a skill cannot tell what would
be surprising without knowing what is already believed.

## House conventions

Punctuation, casing, merge-code format, and any rule that is house style rather than voice. These
are the rules that make output look like it came from this company rather than from a model.

---

## File map

Machine-readable. Scripts parse this block to resolve paths; keep it valid JSON, keep the fences.
A role a brand does not have is `null`, never left out: a null is a recorded gap that skills name, and a missing key reads as an oversight.

```json
{
  "brand": "",
  "folder": "",
  "voice_contract": "",
  "legal_ledger": "",
  "product_db": "",
  "favorites": "",
  "voice_calibration": "",
  "voice_model": "",
  "concrete_lexicon": "",
  "judge_rubric": null,
  "type_registry_core": "",
  "type_registry_overlay": "",
  "slotmap_web": "",
  "section_library": "",
  "tokens": "",
  "strictness_map": "",
  "importer": {
    "name": "",
    "min_version": "",
    "skill_key": ""
  },
  "prohibited_patterns": []
}
```

### Roles

| Role | What reads it | Required by |
|---|---|---|
| `voice_contract` | Read fully; the source of truth for voice. | copy |
| `legal_ledger` | Read fully. **The same file every other skill in the suite reads.** A page stays up until somebody notices, so this is the longest-lived version of a claims mistake. | copy |
| `product_db` | **Never read wholesale.** Supplies the facts layer and the allowed figures. | copy |
| `type_registry_overlay` | `channels.web` is the live section roster and wins over the bundled snapshot in `references/section-data.json`. | composition |
| `favorites` | The brand owner's own keeps (0.3.0): `{favorites: [{id, text, role, channel, type?}]}` in the engine role vocabulary, never a line marked cut. `exemplar_pick.js` hands these to a gate FIRST and fills the rest from `exemplars`; every pick records the ids shown. | optional, degrades loudly |
| `voice_calibration` | The brand owner's blind keep and cut marks (0.3.0). Read only by `voice_lint.js --calibration` (re-fit) and `--report`; never by a writer. | optional |
| `voice_model` | Weights written by `voice_lint.js --calibration --out` (0.3.0): version, the calibration's hash, leave-one-out accuracy and AUC, `weak` under 65%. Read by `voice_lint.js`, the advisory judge that runs after the lint. Null: the engine's hand-set default runs and says so. | optional, degrades loudly |
| `concrete_lexicon` | Product and scene nouns (the `product` list holds what the brand makes), product families and product names, derived from the product database and the keeps (0.3.0). Read by `voice_lint.js` and `verify_packets.js`. Null: the engine's neutral lexicon, which is empty, runs and says so. | optional, degrades loudly |
| `judge_rubric` | The brand owner's measured preference for the pairwise judge, written from the blind marks (0.5.0). Read by `judge_brief.js`. Null: the judge is told no measured preference is on file, and every rank says so. | optional, degrades loudly |
| `section_library` | The brand's measured section roster, per-breakpoint slot budgets and page types (the shape of the engine's `references/section-data.json`, which ships as a schema with an empty roster). `page_lint.js` refuses to grade a page without it. | everything |
| `slotmap_web` | The registry of every fillable node and its slot shape, generated from the built components. **The live map wins** — the section library is a photograph of it and cannot know when a master moved. | composition |
| `tokens` | The colour pairs the contrast check measures. Without it that check does not run, and it is the accessibility finding most likely to exist. | accessibility |
| `strictness_map` | Governance posture per component. | design, build |
| `importer` | A downstream tool that ingests the JSON. Most brands have none. | optional |
| `prohibited_patterns` | Regex fragments for territories that may never appear. The lint fails closed without them. | copy |

### Resolution

Find `brand-context.md` in the working folder. If it is absent, or the roles this skill requires are
absent from its file map, **say exactly what is missing and what each one costs, all at once, before
the work** — then carry on to the last thing the inputs actually support. Never invent what a missing
role would have supplied.
