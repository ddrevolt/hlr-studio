# Writing contract: what each kind of section's copy is for

**How long a slot can be is data, not prose.** It is `slots[name].budget[breakpoint]` in the brand's section library (the pack's `section_library` role, shaped like `section-data.json`), the lint checks it, and this file does not restate a number. What this file carries is the thing a budget cannot: what the slot is *for*. Section ids, names, budgets, page counts and live-site quirks all belong to the brand's library. Match each section there to the kind below by what it does.

Write the tightest breakpoint first. A card body that is far shorter on a mobile slide than on desktop, written for desktop and then cut, reads like it was cut.

---

## Collection or category header: the page's first sentence and its h1

The title is the page's subject and almost always its only h1. Say the category the way a customer would say it, not the way the merchandising system does.

The description has one job: **tell someone who arrived from search whether they are in the right place.** Not to sell (the products below do that), to orient. A description that could sit on any collection is doing nothing.

## Benefit row: three reasons, not three moods

Each card is one reason, and the three should not be paraphrases. If the component already sets the heading in capitals, do not write it shouting twice.

**A card body on a narrow slide is often the tightest real budget in the library.** Two lines is one idea. A body that needs a subordinate clause is a body that needs a different idea.

## FAQ accordion: the claims-densest copy on the site

An FAQ answers exactly the questions a claims ledger has opinions about: sourcing, materials, care, what a product does. **Every answer routes through the ledger**, and this is the section where "conditional with no required language" will actually happen.

Write the question the way people ask it, including when that is blunter than the brand voice. Then answer it in the first sentence and stop. An FAQ answer that opens with context is a reader still not knowing.

## Reviews and ratings: other people's words, cited

The pull quote is yours; the reviews are not.

Read the section library for what the live section actually renders: some carry no CTA, and some drop the subcopy on mobile, which makes anything load-bearing there invisible to most of the traffic.

Every quote cites its source. An uncited verbatim slot is how invented reviewer names and a rating line that does not exist reach a page.

## Content card grid: the navigational one

Heading, sub, a handful of cards. It is how someone gets from this page to the next one, so **card titles are destinations, not teases.** "Gifts under $50" beats "Something special."

When the grid has two mobile forms (a carousel and a stack) with different budgets for the same slot, write to the tighter one.

## Promo: one offer, one line

Eyebrow, heading, body, CTA. The heading is short by construction. If the section library records an open defect on the master, write it and note that it is written against a component that will move.

## Value-prop list: checked lines

Parallel construction, same grammatical shape, one idea each. A list where the fourth line is a sentence and the first is two words reads as a list somebody stopped editing.

## Rich text block: the only place length is the point

The long-form SEO block.

**One search intent.** A page answering several ranks for none of them well and reads as a list.

Write it for a reader who arrived with a question, and answer the question before optimising anything. The rest of the page is written to slot budgets; this is the one place with room, which makes it the one place where padding is possible.

## Global footer: every label names its destination

The widest accessibility surface on the site. Every label names its destination. See `references/accessibility.md`; a column of identical "Learn more" links is the failure a long footer makes inevitable if nobody is watching.

## Product buy box: the highest claims exposure

Prices and eligibility lines route through the ledger. Plan or option labels say what the plan is, not what it feels like.

## How it works: write it, and say where it goes

If the section library records that the live site ships this section as baked images (no title, body or badge exists as a node in its DOM), copy written for the editable rebuild will not appear on the live site until the site changes too. Say so when delivering it. Writing it well and quietly is worse than writing it well and flagging it.

## Product grid, image band, attribute bar

A **product grid** repeats the product card, and its content is the product database. Do not draft into it.

An **image band** is image only: nothing to write, and it still needs alt text.

An **attribute bar** is icon-and-label pairs with no body. Labels are attributes, not benefits: what the thing *is*, in as few words as the icon needs.

---

## Open decisions you will meet (moved from SKILL.md, 2026-09-07)

The pack's section library records unresolved modelling decisions per section under `open_decision`, and `page_lint.js` surfaces them on every page composing that section. The kinds to expect: a mobile form still carrying two variants, so copy must survive both budgets (the tighter one first); a master held with a known type defect or height delta, so copy is written for a component that will move; a section the editable rebuild renders that the live site ships as baked images, so copy written into it will not appear until the site changes. Write around them and say when one bites; do not quietly pick a side. The brand's own list is in its `section_library`, never here.

## Compose, map, cut (0.3.0)

Class-A sections are composed whole (eyebrow, heading, body, CTA, or a benefit row as its three reasons in one set) with no budgets in view, then mapped to slots through this contract, then cut to the tightest breakpoint first under the cut rules in the SKILL (delete before rewriting, keep the idea, keep every must-say, never introduce a figure, flag what cannot survive). `scripts/fit_check.js` checks the cuts; the budgets in the section library are copied onto each cut entry or passed as `--budgets`.
