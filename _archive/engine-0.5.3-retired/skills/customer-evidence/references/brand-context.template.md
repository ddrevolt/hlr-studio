# Brand context — template (customer-evidence)

Optional. Copy to `brand-context.md` in the sponsoring brand's pack folder (the path
`brands/registry.yaml` names for the brand) if there is one. **This file is where all specificity
lives** — the skill itself stays generic and carries nothing about any industry or company. The
authoritative list of every role the engine reads is `references/pack-contract.md` at the plugin
root; this template shows the roles `customer-evidence` reads.

If there is no brand context, the skill still runs. What it must not do is invent what this file
would have supplied: with no declared venue roster it says the sampling frame was not chosen in
advance, rather than implying it was.

**One `brand-context.md` per folder, and every skill in the suite reads it — but they do not read
the same parts.** The narrative sections below are shared: the category, the customers, prohibited
language, the claims regime. The **File map** is a union of roles, and each skill uses the ones it
needs and says what a missing one costs rather than guessing. `email-copy` cannot run without a
voice contract; `customer-evidence` has no use for one and never asks. If you run both skills in a
folder, keep one file and let its file map carry both sets of roles — two files with the same name
in different places is how a brand fact ends up updated in one of them.

If a skill needs a brand fact that has no section here, add the section. Do not put the fact in the
skill.

**This copy of the template shows the roles `customer-evidence` reads** — a corpus, first-party
domains, an insight register, a recency window. `email-copy` ships its own copy showing its roles
(voice contract, claims ledger, product database, type registry). The narrative sections are the
same in both, and a folder running both skills should hold one merged file.

---

## Category and product

What is sold, in one line. The shelf it sits on — how customers would describe the category, in
their words rather than the company's.

## Who the customers are

Segments in the terms the business actually uses. Name any need-states or cohorts that behave
differently; analysis will otherwise average across them.

## Where they talk

**The most useful section.** Named venues: subreddits, review platforms, communities, retailer pages
carrying adjacent products. Mark any that are first-party (own-site reviews, own social) — provenance
changes how they may be used, and these are the domains `corpus_lint.py --brand-domains` needs.

Without this, a corpus is whatever a search surfaced, which is a sampling frame nobody chose.

## Prohibited language

Words, claims and territories that may never appear in output, and why. **Research reads all
material; this governs what may be quoted or repeated downstream.**

## Sensitive territory

Anything in this category that is special-category personal data — health, medication, mental state,
finances, sexuality, minors. Read and counted, never quoted. See `references/ethics.md`.

## Claims regime

Who approves claims and where the register lives. Customer verbatims often contain claims the company
itself cannot make; that needs a rule rather than a case-by-case judgement.

## Existing insight or research assets

Prior studies, an insight register, a research repository. Read existing findings as corpus rather
than re-deriving them.

## Recency window

Default twelve months. Widen or narrow with a reason.

## What this brand already believes

**The section that decides whether a finding counts.** An insight must challenge an assumption to
qualify, and the skill cannot tell what would be surprising without knowing what is already believed.

---

## File map

Machine-readable. Scripts parse this block; keep it valid JSON, keep the fences. A role the brand
does not have is simply absent.

```json
{
  "brand": "",
  "folder": "",

  "corpus": "",
  "brand_domains": [],
  "insight_register": "",
  "recency_months": 12
}
```

| Role | What reads it |
|---|---|
| `corpus` | The item file `corpus_lint.py` and `verify_quotes.py` run against |
| `brand_domains` | First-party domains. Passed to `--brand-domains`; without them the brand-copy check does not run and the lint reports INSUFFICIENT-INPUT rather than PASS |
| `insight_register` | Prior findings, read as corpus |
| `recency_months` | Overrides the twelve-month default |
