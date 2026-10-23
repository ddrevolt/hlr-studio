# High Light Rituals: brand context

Pack role: the brand context of the pack contract [documented] (`hlr-studio-engine` 0.5.3, `references/pack-contract.md`). Every skill reads the narrative below; every script parses the File map at the end. Lane E, Pack v0, 2026-10-20.

Status: Pack v0, Gate 2 closed 2026-10-22. Lane C's eight calls were ruled on 2026-10-21 (DECISIONS), and Eddie took every call of `outputs/step-2-pack/gate-2-package.md` at the brand home at its default on 2026-10-22 (DECISIONS); every [derived] rule still here is a proposal, never law. Preflight and the guards that check this file: `outputs/step-2-pack/preflight.md`.

Tags: [documented] the brand book `061022_HighLight_BrandBook_DS.pdf` (dated 2022-06-11, cited by PDF page), the client, or our own standing records (project rules, the playbook, the pack contract), named after the tag; a ruling of Eddie's is written [documented, DECISIONS <date>]; a derived value or rule Eddie ratifies flips its leading tag to [documented] and carries "(ratified <date> by Eddie, Gate 2 package call N)" (Gate 2 package call 4, DECISIONS 2026-10-22); [observed] live work and the client's files, dated (`outputs/step-1-review/`; the corpus re-cut in `outputs/step-2-pack/corpus/`); [derived] our proposal, which only Eddie ratifies. Rulings cite `DECISIONS.md` at the brand home by date. Paths are relative to this folder (`brand-pack/`) unless they start with `outputs/`, `_setup/` or a file at the brand home root. No HLR fact here comes from memory; a fact with no source is a gap in the last table.

## Category and product

- What HLR sells: jewelry (bracelets 94 and necklaces 65 of 182 products), ritual kits (12), crystals (3), and energy healing sessions and readings listed as products; 650 variants on Shopify [observed, `outputs/step-1-review/site/catalog-stats-2026-10-17.json`]. These counts describe the catalog for planning, never for copy: a figure reaches copy only from `products.json` through `sku_lookup.js` [documented, the pack contract's `product_db` row; project rule 3].
- The shelf, in the brand's words: timeless jewelry for self and space (p6, p32) [documented]. The live site calls it fine healing crystal jewelry, healer-activated [observed, site 2026-10-17], which the book does not: contradiction C2 below.
- The shelf in customers' words: not gathered [observed: no customer material read]. The nearest first-party source is the Judge.me reviews on the site (Where they talk); a customer-evidence run supplies it (owner Eddie, who scopes the run).
- Sessions and readings with a practitioner are sold as products; their positioning and claims are HLR's call (C2; ledger row HLR-H04) [observed, catalog 2026-10-17].
- The product database, `products.json`: keyed by Shopify handle until HLR's export lands, then by SKU (DECISIONS 2026-10-18, Gate 2 call 7 a); display names use "in", never a dash (DECISIONS 2026-10-17, Q10; 2026-10-18, call 4 a); `kind` and `family` are [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 14). Every `description` is empty, so no product prose is verifiable until the export (owner HLR).

## Who the customers are

- Segments in HLR's own business terms: unknown. The book's Brand section (p3 to p11) and the client files read in Step 1 define none [observed, Step 1]; asked at Review 1 (Gate 2 package call 17), and Eddie relays HLR's answer [documented, DECISIONS 2026-10-22, Gate 2 package call 17]. Analysis never invents a segment: it reports one undivided pool and says so [derived].
- Who the voice speaks to, from the book's Copy section (p28, p30): carried in `voice-contract.md` section 2 with its page numbers [documented]. Read it there; a second copy here would drift.
- Buyers observed in live work: none profiled yet [observed].

## Voice

The voice contract is `voice-contract.md` (role `voice_contract`), read in full on every run. It carries the five qualities of the brand book's Copy section (p27 to p31): eloquent, refined, sensual, real, uplifting [documented]. They are also the `register` tags: every piece stays on the IS side of all five, each option leads with one, and a set covers at least two [documented, DECISIONS 2026-10-21: ratified by Eddie, lane C call 1 a]. What drafters get wrong most: writing to the live positioning (healing, witch, spell) instead of the book's while C2 is open; stacking the book's sensual words as a quota; stating a stone's meaning as an outcome rather than as a tradition or an intention [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 12). Devices (the italic accent word, the asterisk aside, the ellipsis) are seasoning, at most one per piece [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 12). The Brand section's own five principles (p9: Sensual, Connected, Curious, Real, Intentional) are named in the contract, not used as tags.

Status: ratified by Eddie at Gate 2 on 2026-10-21 (lane C calls 1 a, 7 a and 8 a) [documented, DECISIONS 2026-10-21]; the contract's section 4 rules 2 and 3 and its devices rule read [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 12). Exemplars: 159 lines in `exemplars.json` (role `exemplars`), approved at Gate 2 and moved from `_proposed/` by lane E [documented, DECISIONS 2026-10-21: approved by Eddie, lane C call 2 a]; the owner's favorites outrank them once HLR's reviewers mark lines [documented, the pack contract's `favorites` row].

## Where they talk

| Venue | What it holds | First-party | Source |
|---|---|---|---|
| Judge.me reviews on highlightrituals.com product pages | customer reviews (72 on the Seeds of Protection Bracelet page) | yes | [observed] site, 2026-10-17 |
| Instagram, @highlightrituals | the brand's feed and its comments; the site embeds the feed | yes | [observed] site, 2026-10-17 |
| Email | Klaviyo forms on the site; Klaviyo is likely the ESP (HLR to confirm) | yes | [observed] site, 2026-10-17 |
| The Ritualist (blog) | linked from HLR's email footers; no web design for it in the files | likely; HLR to confirm | [observed] `section-library.json` page-type gaps |
| lightnessbydonnie.substack.com | a newsletter linked from the site | unconfirmed (HLR, Review 1) | [observed] site, 2026-10-17 |

No third-party venue is declared. Until Eddie names a roster, a customer-evidence run states that its sampling frame was not chosen in advance [documented, the engine's customer-evidence template]. `brand_domains` lists the two first-party domains the site pull confirmed [observed, site 2026-10-17]; the Substack stays out until HLR says whose it is [derived].

## Prohibited language

Barred in all output, whatever a brief asks, and enforced by `prohibited_patterns` in the File map, which every lint compiles into one case-insensitive expression and `brief-intake` copies into `never_say.pack` [documented, the pack contract's `prohibited_patterns` row; lane E's guard R7 in `preflight.md`]. The six patterns are ratified [documented, DECISIONS 2026-10-21, lane C call 3 a]. The prose here explains; the patterns enforce. Human record of the six patterns (lane C, `outputs/step-2-pack/voice-claims-notes.md` section 4; corpus counts there):

| # | Barred | Why | Provenance |
|---|---|---|---|
| 1 | The em dash (U+2014), written in the pattern as its escape so no file carries the character | Eddie's standing rule: no em dashes in marketing copy or in anything we write for Eddie and HLR. Use a comma, a colon, parentheses or a new sentence | [documented] DECISIONS 2026-10-17 (C9) and 2026-10-18 (the rule's scope; REVIEW.md R7) |
| 2 | The misspelled name or handle HIGHTLIGHT, in any case | Found in 48 social rows against 391 spelled right | [observed] the social corpus (lane A, 2026-10-18) |
| 3 | The misspellings found in the client's files: toumaline, pendent, guranteed, reail, stres, jouney | A reused line cannot carry them | [observed] the pattern review's typo list and the corpus |
| 4 | Cure, cures, cured, curing | A piece, a stone or a session never cures anything: the site footer says the products are not intended to diagnose or treat ailments | [documented] site footer, 2026-10-17; the pattern [derived] |
| 5 | Treating, preventing or reversing a named condition (anxiety, depression, disease, illness, cancer, infertility, insomnia, pain, symptoms, conditions, disorders) | Against the same footer | [documented] site footer; the pattern [derived] |
| 6 | Standing in for medical care (instead of, replaces, replacement for, no need for, alternative to medication, medicine, a doctor, a therapist, therapy, treatment or a prescription) | The footer says energy work is no substitute for medical treatment | [documented] site footer; the pattern [derived] |

Kept out on purpose: "treat", "diagnose", "medical" and "ailment" on their own, because the required footer text uses them, and the en dash, which Eddie's rule does not name [derived; lane C, `outputs/step-2-pack/voice-claims-notes.md` section 4]. Every pattern was run against the footer text and none matches it [observed: lane C's test, rerun for the compiled list by guard R7]. Everything else that carries a claim is graded in the claims ledger rather than barred [derived; lane C].

## Sensitive territory

- Live copy makes mental and emotional health claims ("CALM YOUR ANXIETY"; "soothes anxiety and restores emotional equilibrium"), uses fertility symbolism, and sells energy healing sessions and readings (Brand Review v2, question 1; ledger rows HLR-H01, H02, H04 and F01, with their corpus hits in `outputs/step-2-pack/voice-claims-notes.md` section 5) [observed].
- No customer material has been read yet. A customer-evidence run treats health, mental state, fertility and pregnancy as sensitive, with the special-category data the engine names (health, medication, mental state, finances, sexuality, minors): read and counted, never quoted [derived; the engine's customer-evidence template].
- Copy never repeats a customer's health words (Claims regime) [derived].

## Claims regime

- No one at HLR is named yet to sign claims (`legal-ledger.json` `signer: null`; C2, Review 1, owner HLR) [observed].
- `legal-ledger.json` is a test seed (`_status: test-seed`, 19 rows): every row enforces provisionally and nothing in it is counsel-approved [documented] `legal-ledger.json` `_status` and `_note` (provisional, not counsel-approved); test-seed, 19 rows at v0.2.0 [documented, DECISIONS 2026-10-21: Eddie's answer to lane C calls 4 and 5].
- Rows marked needs_legal (health, fertility, sourcing, origin) block every lint, craft mode included, until HLR's signer rules on them [documented, the lane C prompt in `_setup/next-chat-prompts.md`]. Rows marked conditional (durability and guarantees, endorsements, identity, offers) ask a person to confirm and record each use [derived: lane C's severities; their rulings wait for HLR's claims signer, C2, DECISIONS 2026-10-18]. Metal and karat (HLR-K01) and metaphysical benefit (HLR-M01 to M05) are info rows with `paraphrase_risk`: every lint lists them for the verifier with their hit counts, and none blocks or asks for a sign-off [documented, DECISIONS 2026-10-21: Eddie's answer to lane C calls 4 and 5]. `legal-ledger.json` v0.2.0: needs_legal 8, conditional 4, info 7 [observed, 2026-10-21].
- Required language: the site footer disclaimer, verbatim (row HLR-REQ-01) [observed, the site footer, 2026-10-17]. It stays its own row, fed by the brief into the footer slot [documented, DECISIONS 2026-10-21, lane C call 6 a]; the row's `requires` names every email footer and every product page, and the email corpus carries it 0 times today, so sends change [observed, `outputs/step-2-pack/voice-claims-notes.md` section 5]. Whether paid and organic social carry it is HLR's (C2).
- Customer and press words appear only verbatim and sourced (Judge.me, a press URL); nothing is invented [documented, project rule 3; playbook section 3]. The quote-like lines in the email and social templates are unsourced (Brand Review v2, question 7) [observed].
- Customer material often carries claims HLR cannot make (healing, anxiety): research may read it; copy may not repeat it [derived; the engine's brand-context template].

## Existing insight or research assets

- No insight register and no customer research have been received (`insight_register` null) [observed, 2026-10-20]. Whether HLR holds any is asked at Review 1 (Gate 2 package call 17), and Eddie relays HLR's answer [documented, DECISIONS 2026-10-22, Gate 2 package call 17].
- Evidence on file, read as corpus and never as findings about customers [documented, the engine's brand-context template]: Brand Review v2 and the pattern review with its addendum (`outputs/step-1-review/`); the site pull, catalog snapshot and claims scan (`outputs/step-1-review/site/`, 2026-10-17); the corpus re-cut of visible copy (`outputs/step-2-pack/corpus/`); the client's inventory sheet `HLR Creative AI System.xlsx` (read-only original).
- The Judge.me review pool has not been pulled [observed, 2026-10-20].

## Recency window

Twelve months, the engine default: `recency_months` stays null so the default applies [derived]. No reason to change it has come up (owner Eddie).

## What this brand already believes

An insight has to challenge one of these to count [documented, the engine's brand-context template].

- From the book (2022) [documented]: jewelry as timeless objects for self and space, designed to ground, awaken and inspire (p6); the mission, to inspire a return to self (p7); the purpose, a conduit to spark reconnection, action oriented but non-prescriptive, accessing age-old rituals and traditions rather than creating a new-age practice (p8); the five principles (p9) and the five behaviors (p10, p11).
- From the live work, acted on but not stated by HLR [observed]: a healing and energy-work positioning ("Fine Healing Crystal Jewelry, Healer-Activated" and "Where Jewelry Meets Energy Work" on the site); short mantra and affirmation lines; spell and magic language (108 email lines); the 4:5 feed leading social (110 of 117 grid frames) (Brand Review v2, sections 1 and 5). The positioning diverges from the book (C2).
- In this build, Eddie's Gate 1 picks for HLR to confirm at Review 1 [documented, DECISIONS 2026-10-17]: the marks roster (C3), Onyx ink on Alabaster (C4), four faces (C5), one CTA shape (C6), email masters at 1200 (C8).

## House conventions

Voice-side house style lives in `voice-contract.md` section 6 and wins over this summary [documented, DECISIONS 2026-10-21, lane C call 7 a]:

- No em dashes in copy (pattern 1 enforces it); verbatim client text in the evidence files keeps its own punctuation [documented, DECISIONS 2026-10-17 and 2026-10-18].
- Product display names from `products.json` with "in" in place of a dash ("The Seeds of Protection Bracelet in Black Tourmaline"), never the Shopify title [documented, DECISIONS 2026-10-17, Q10].
- Case per slot role [documented, DECISIONS 2026-10-18, Gate 2 call 2 a]: headlines and lines in sentence case on every channel (p17); eyebrows in tracked caps (p17); callouts, labels, sublines and terms in caps; names, quotes, scripts and cues as written; CTA labels in caps (Gate 1, C6).
- The CTA is an outline caps box in the ink colour or a text link (Gate 1, C6) [documented, DECISIONS 2026-10-17].
- The brand name form is open (C1, HLR): the book writes HIGH LIGHT in caps inside sentences (Brand Review v2 C1: p14, p19, p26) [documented]; live copy writes High Light Rituals and HLR, and the handle is @highlightrituals [observed, Brand Review v2 C1; site 2026-10-17]; until C1, use the form the brief gives [derived; lane C's interim, `voice-contract.md` section 6].
- Unconfirmed offers, prices, dates, codes and thresholds are merge tokens in the form `{{ name }}` until HLR rules C10 [documented, playbook section 3; REVIEW.md rule 3; Brand Review v2 C10]; the token names (`{{ discount_code }}`, `{{ free_shipping_threshold }}`) are the voice contract's, section 6 [derived].
- Questions allowed; exclamation marks never in a headline, cover or CTA and at most one per piece; the serial comma; curly apostrophes; emoji in social captions only; the founder's first person only on a brief that says the piece is from the founder [documented, DECISIONS 2026-10-21, lane C calls 7 a and 8 a].

## Design system

- Tokens: `tokens.json` (DTCG; 103 tokens, 82 [documented], 20 [observed], 1 [derived] by first tag (`color.semantic.text.on-placeholder`, Gate 4; the placeholder label’s alias carries a second, [derived] tag), counted 2026-10-23; namespace `com.hlr`, CSS prefix `--hlr-`). Ground modes on `HLR / Semantic` (`light`, `warm`, `deep`, `night`, named at Gate 4 on 2026-10-23); canvas modes on `HLR / Layout` (`web`, `social`, `email`; DECISIONS 2026-10-18, Gate 2 question 1). The installed engine is 0.5.3 (Eddie, 2026-10-22): `check` passes in every ground and canvas. Web exports: `web/tokens.css`, `web/tailwind.tokens.js` and `web/tokens.flat.json`, generated from `tokens.json` by `tokens_build.js export` on 2026-10-23 (regenerated, never hand-edited; `font.style` stays in Figma, the web takes `font.weight`).
- The contrast law, the type roster, the gap register and the ratification log: `token-model.md`. The law is [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 2): every ground in the roster carries body copy in its ink; Fawn is never an ink on Alabaster, white or the neutrals. Copy on photography is judged by eye on the real image [documented, DECISIONS 2026-10-18: Eddie's ruling, Gate 2 question 4].
- Faces (Gate 1, C5, for HLR to confirm): Saol Display, Saol Standard, Trade Gothic LT Std, Homemade Apple. License flag raised: Saol and Trade Gothic have no license file (`figma.yaml` `fonts.licensed: false`) [observed, 2026-10-17], so every deliverable that renders text carries the flag [documented, project rule 8]. The Figma library is set in the real faces since 2026-10-23, when Eddie loaded them to the team Figma and the build path could load them [observed, 2026-10-23]; it ran on Instrument Serif and Inter stand-ins until then (Gate 3 call 7, path 1).
- Marks: `logo-assets.md`. The wordmark and the monogram exist as SVG [observed, `HLR Logo & Marks/`, 2026-10-18]; the star and every lockup with it wait for HLR's vectors, and no lockup is composed by eye [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11); a mark is placed, never redrawn or set in a font [documented, playbook section 4; the pack contract's `logo_assets` row]. The rest of the mark rules are [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 11).
- Imagery: Eddie owns the images on the reference file's Images page (97: founder headshots, HLR Editorial, product shots, Zodiac Sets, Amulets; now on the library's `photos` page, 27:104) and the product images on the site, and cleared them for HLR's designs [documented, DECISIONS 2026-10-23: Eddie's ruling, image rights]; an image from any other source keeps the labelled grey placeholder until its right is confirmed [documented, project rule 8]; releases for the people in them stay HLR's question (`faces_policy`) [documented, Brand Review v2 Q6]; nothing is generated in place of a real shot until Eddie rules on it for HLR (REVIEW.md rule 8: no ruling yet) [derived]. Art direction cards: `art-direction.md`. The asset roster: `asset-types.md`. Figma state: `figma.yaml` (library `Gq3yUbLs6MCRM0nOhjvnIW`, slot namespace `hlr`).

## Channels in Phase 1

All four channels are in Phase 1 [documented, DECISIONS 2026-10-17, Gate 1]. Every slot budget is null until Step 4 builds and measures the masters [documented, the slot maps' status; DECISIONS 2026-10-18, lane D's line].

| Channel | Taxonomy | Slot map | What runs today |
|---|---|---|---|
| Email | ratified: 15 types [documented, DECISIONS 2026-10-18, Gate 2 call 1 b] | `slotmap.yaml` wired: 21 modules and 8 elements built and measured on the email canvas (Chat 6, 2026-10-23); `seam-map.json` generated from it | `email-copy` drafts with slot checking on: `copy_lint.js` resolves every field and ceiling against the seam map |
| Organic social | ratified: formats, 8 types, 5 series [documented, the same ruling] | `slotmap-social.yaml` wired, masters unbuilt | `social-copy` drafts; `social_lint.js` asks for a sign-off on every unmeasured slot |
| Paid | held for Review 2 [documented, the same ruling] | `slotmap-paid.yaml` planned, `slotmap_paid` null | `paid-ad-copy` on the engine's bundled ad types, in-frame checks off; a person confirms Meta's 9:16 bands before the first paid build |
| Web | held for Review 2 [documented, the same ruling] | `section-library.json` planned, `section_library` null | `web-copy` stops by design and waits for Review 2, when the W## masters exist [documented, DECISIONS 2026-10-22, Gate 2 package call 13] |

## Contradictions (flagged, not resolved)

Book (2022) against live work (2023 to 2026), from Brand Review v2 sections 1 and 2 and the pack's gap register. Each stays open until its owner rules; none is resolved silently here [documented, playbook section 3: contradictions are flags]. Each row pits the book [documented] against live work [observed]; a state that is a ruling cites it.

| # | Contradiction | State | Owner | Source |
|---|---|---|---|---|
| C1 | Name: HIGH LIGHT in the book; High Light Rituals and HLR live; the handle misspelled in social | open; copy uses the form the brief gives [derived, lane C's interim] | HLR, Review 1 | Brand Review v2, C1 [documented], [observed] |
| C2 | Positioning and claims: the book's timeless jewelry against the site's healing crystal jewelry, sessions sold as products, spell and witch language | open; the voice contract follows the book [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 12); the ledger grades the claims | HLR, Review 1 | Brand Review v2, C2 [documented], [observed] |
| C3 | Marks: the book's shell system against the live wordmark, monogram, star and crest | Eddie's Gate 1 pick, for HLR to confirm; vectors for the PNG-only marks | HLR, Review 1 | Brand Review v2, C3 [documented], [observed] |
| C4 | Ink and grounds by channel: Onyx and Alabaster in the book; Forest on the site, white email pages, blush in social | Eddie's Gate 1 pick (Onyx on Alabaster), for HLR to confirm | HLR, Review 1 | Brand Review v2, C4 [documented], [observed] |
| C5 | Faces: two families in the book; 17 in the live work | Eddie's Gate 1 pick (four faces), for HLR to confirm; licenses open | HLR, Review 1 | Brand Review v2, C5 [documented], [observed] |
| C6 | CTA: the book's outline caps and Saol link; email's 2px outline; the site's Saol buttons | Eddie's Gate 1 pick, for HLR to confirm | HLR, Review 1 | Brand Review v2, C6 [documented], [observed] |
| C7 | Tagline: the book's main line and alternates against three live lines | open | HLR, Review 1 | Brand Review v2, C7 [documented], [observed] |
| C8 | Email width: 1200 masters or the 700-wide 2026 sends | Eddie's Gate 1 pick (1200, slice-sized type); how the ESP builds sends is HLR's | HLR, Review 1 | Brand Review v2, C8 [documented], [observed] |
| C9 | Dashes: the book's and the live copy's em dashes against our rule | our rule holds in everything we make; HLR hears it at Review 1 | Eddie | Brand Review v2, C9 [documented], [observed] |
| C10 | Offers: three free shipping thresholds and two codes in live work | open; merge tokens until HLR rules | HLR, Review 1 | Brand Review v2, C10 [documented], [observed] |
| token-model C9 | Archive mark fills (#faf8f2, #1f2918, #baada3) against the p19 hexes | tokens carry p19; marks bind to the tokens | HLR, Review 1 | `token-model.md` gap register, C9 [documented], [observed] |
| token-model T4 | Pull quote face: Saol Standard Regular (p16) or Saol Display (p18) | ruled: Saol Display Light [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 9) | Eddie, Gate 2 | `token-model.md` gap register, T4 [documented], [observed] |
| token-model T6 | The italic accent word: in every channel, not in the book (p17 is roman) | [observed]; ruled: one word per display line or headline [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 10); HLR hears it at Review 1 | Eddie (ruled at Gate 2), then HLR | `token-model.md` gap register, T6 [documented], [observed] |

## Gaps and owners

Every null role and every required artifact with no file yet, its owner, and the plan step that carries it. `preflight.md` (guard R14) checks this table. A Step cell quotes, verbatim, at least four words of an open line of `PROGRESSION.md`: an unticked box for a lane or chat, which may also quote its own section of the chat prompts, and an unticked box or a line of the Reviews plan for Eddie or HLR; "none" means the owner decides without a planned step. A lane or chat owner needs a step; an HLR-owned row also names the question that asks HLR (Brand Review v2 Q<n> or token proposal HLR <n>). The check fails on a row with no owner or an owner still to be assigned, a step the plan does not carry, an HLR row no list asks, a malformed or repeated row, a null role with no row and a Foundations board in `figma.yaml` with no row; it warns when a lane's or chat's step and prompt do not name what it owns, and when a cited question shares no word with the row.

| Item | Kind | State | Owner | Step | Blocks |
|---|---|---|---|---|---|
| `favorites` | role | null; the Step 5 sheet is Eddie's blind keep or cut marks, HLR's reviewers mark later (lane C) | Eddie | `Eddie's blind keep or cut sheet marked` | the owner's keeps steer nothing |
| `voice_calibration` | role | null; the Step 5 sheet is Eddie's blind keep or cut marks, HLR's reviewers mark later (lane C) | Eddie | `Eddie's blind keep or cut sheet marked` | no pack voice model can be fitted |
| `voice_model` | role | null; the engine's default weights run, announced | Chat 7 | `Eddie's blind keep or cut sheet marked` | the advisory voice judge runs weak |
| `judge_rubric` | role | null; derived from the blind marks, ratified by Eddie before a judge reads it | Chat 7 | `Eddie's blind keep or cut sheet marked` | every rank says no measured preference is on file |
| `judge_calibration` | role | null | Chat 7 | `Eddie's blind keep or cut sheet marked` | every rank says it was never checked against the owner |
| `corpus` | role | null by design: the re-cut is evidence, never retrieved per run | Eddie | none | nothing |
| `type_registry_overlay` | role | null: the core registry governs | Eddie | none | nothing |
| `options_register` | role | null until a first real choice is recorded; then `options-register.jsonl`, created on first append | Chat 7 | `One real HLR brief` | the reason a line was kept is lost |
| `onepager_palette` | role | null; the engine's neutral default renders | Eddie | none | nothing a reader would notice |
| `importer` | role | null; optional, and most brands have none: a question only if HLR's team wants slates imported into a tool | Eddie | none | nothing; the JSON and the one-pager are the deliverables |
| `slotmap_paid` | role | null; planned at `slotmap-paid.yaml`, wired at Review 2 with the first masters | Eddie | `Review 2 ({{review-2-date}}): Figma foundations and the first modules` | paid in-frame ceilings unchecked |
| `slotmap_web` | role | null until the web masters exist | Chat 6 | `social, paid and web at the formats the review found` | web budgets would come from the section library alone |
| `section_library` | role | null; planned at `section-library.json`, wired at Review 2 with the W## masters (Gate 2 package call 13) | Eddie | `Review 2 ({{review-2-date}}): Figma foundations and the first modules` | `web-copy` stops by design |
| `grounding_inputs` | role | null; no customer material on file; asked at Review 1 (Gate 2 package call 17), a Judge.me reviews export first; Eddie relays HLR's answer | Eddie | none | paid concepts are labelled hypotheses |
| `insight_register` | role | null; no research received; asked at Review 1 (Gate 2 package call 17); Eddie relays HLR's answer | Eddie | none | nothing can be recognised as already assumed beyond the section above |
| `recency_months` | role | null; the engine default (12) applies | Eddie | none | nothing |
| `faces_policy` | role | null; image rights and releases for people in imagery; asked by token proposal HLR 5 | HLR | `Review 1 ({{review-1-date}}): the Brand Review and the token proposal` | real imagery with people |
| `image_look` | role | null; no generation ruling for HLR: the cleared photos on the `photos` page or labelled placeholders, nothing generated | Eddie | none | the image layer |
| `pack_shot_index` | role | null; the cleared product shots sit on the library's `photos` page (27:104, DECISIONS 2026-10-23), and the index keys on SKUs from HLR's Shopify products export (Brand Review v2 Q5) | HLR | `Review 1 ({{review-1-date}}): the Brand Review and the token proposal` | real product imagery |
| `video_rules` | role | null; video scope not set | Eddie | none | video beyond the P09 end frame |
| Star and lockup vectors, clear space, minimum sizes | artifact | PNG only; asked by Brand Review v2 Q3 and token proposal HLR 2 | HLR | `Review 1 ({{review-1-date}}): the Brand Review and the token proposal` | the star in every master |
| Licenses for Saol Display, Saol Standard and Trade Gothic LT Std | artifact | no license file; asked by Brand Review v2 Q2 and token proposal HLR 1 | HLR | `Review 1 ({{review-1-date}}): the Brand Review and the token proposal` | every shipped asset (the flag stays raised) |
| Shopify products export | artifact | not received; asked by Brand Review v2 Q5 | HLR | `Review 1 ({{review-1-date}}): the Brand Review and the token proposal` | SKUs, product prose, confirmed prices |
| HLR's claims signer and the needs_legal rulings | artifact | not named; asked by Brand Review v2 Q1 | HLR | `Review 1 ({{review-1-date}}): the Brand Review and the token proposal` | every line a needs_legal row hits |
| Web breakpoints, margins and grid (`figma.yaml` `breakpoints: null`) | artifact | open; Gate 4 left them open | Eddie | `Review 2 ({{review-2-date}}): Figma foundations and the first modules` | web budgets |
| Web focus ring (`token-model.md` K2) | artifact | open, not tokenized; Gate 4 left it open | Eddie | `Review 2 ({{review-2-date}}): Figma foundations and the first modules` | the web masters’ interactive states |
| Meta 9:16 keep-clear bands and copy limits confirmed (`_verified` in the engine's placement specs) | artifact | secondary sources only | Eddie | `Before the first paid build: a person confirms the 9:16 keep-clear bands` | the paid 9:16 masters |
| The organic story band confirmed on a live story | artifact | one 2026 guide | Eddie | none | the S04 masters |
| Live review dates | artifact | not set | Eddie | none | Reviews 1 to 3 |

## File map

Machine-readable; scripts parse the fenced block below. Every role of the pack contract is named; a null is a recorded gap with its row above. `prohibited_patterns` is lane C's list as written in `outputs/step-2-pack/voice-claims-notes.md` section 2; `type_ruling` is lane B's (`outputs/step-2-pack/token-proposal.md` section 7); `brand_domains` is [observed] (site, 2026-10-17).

```json
{
 "brand": "High Light Rituals",
 "brand_slug": "hlr",
 "folder": "/Users/eddie/Documents/claude-cowork/highlight-brandbook/brand-pack",
 "voice_contract": "voice-contract.md",
 "exemplars": "exemplars.json",
 "favorites": null,
 "voice_calibration": null,
 "voice_model": null,
 "concrete_lexicon": "concrete-lexicon.json",
 "judge_rubric": null,
 "judge_calibration": null,
 "product_db": "products.json",
 "corpus": null,
 "prohibited_patterns": [
  "\\u2014",
  "\\bhightlight",
  "\\btoumaline\\b|\\bpendent\\b|\\bguranteed\\b|\\breail\\b|\\bstres\\b|\\bjouney\\b",
  "\\bcur(e|es|ed|ing)\\b",
  "\\b(treat|treats|treating|prevent|prevents|preventing|reverse|reverses)\\s+(your\\s+)?(anxiety|depression|disease|diseases|illness|illnesses|cancer|infertility|insomnia|pain|symptoms|conditions?|disorders?)\\b",
  "\\b(instead of|replaces?|replacement for|no need for|alternative to)\\s+(your\\s+|a\\s+)?(medication|medicine|doctor|therapist|therapy|treatment|prescription)s?\\b"
 ],
 "legal_ledger": "legal-ledger.json",
 "type_registry_core": "type-registry-core.json",
 "type_registry_overlay": null,
 "module_library": "module-library.json",
 "slotmap": "slotmap.yaml",
 "seam_map": "seam-map.json",
 "strictness_map": "strictness-map.md",
 "options_register": null,
 "onepager_palette": null,
 "importer": null,
 "slotmap_paid": null,
 "slotmap_web": null,
 "slotmap_social": "slotmap-social.yaml",
 "section_library": null,
 "grounding_inputs": null,
 "tokens": "tokens.json",
 "figma_config": "figma.yaml",
 "logo_assets": "logo-assets.md",
 "art_direction": "art-direction.md",
 "asset_types": "asset-types.md",
 "token_model": "token-model.md",
 "brand_domains": [
  "highlightrituals.com",
  "high-light-rituals.myshopify.com"
 ],
 "insight_register": null,
 "recency_months": null,
 "route_axes": "route-axes.json",
 "type_ruling": {
  "stack": [
   "Saol Display",
   "Saol Standard",
   "Trade Gothic LT Std",
   "Homemade Apple"
  ],
  "decided_on": "2026-10-17",
  "decided_by": "Eddie (Gate 1 C5), for HLR to confirm at Review 1",
  "supersedes": [
   "17 live families (Brand Review v2, C5)"
  ],
  "source": "DECISIONS.md 2026-10-17"
 },
 "faces_policy": null,
 "image_look": null,
 "pack_shot_index": null,
 "video_rules": null
}
```
