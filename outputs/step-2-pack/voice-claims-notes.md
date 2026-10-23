# Lane C notes: voice, claims, exemplars, lexicon

2026-10-18. Pack v0, Step 2, lane C (words side). Built against `hlr-studio-engine` 0.5.1's `references/pack-contract.md` (the installed copy; its sha256 matches `outputs/step-3-bundle/hlr-studio-engine-0.5.1.plugin`). Sources, all read this session: the brand book's Copy section (PDF p25 to p38) with p6 to p10 and p16 to p18 for positioning and type case; the corpus re-cut in `outputs/step-2-pack/corpus/` (method.md sections 4 and 6 first); `outputs/step-1-review/site/claims-scan-2026-10-17.md`; Brand Review v2; lane D's `products.json` and `type-registry-core.json` v0.2.0. Nothing from memory.

Gate 2 rulings: Eddie ruled lane C's eight calls on 2026-10-21 (section 10 records each; section 12 holds what lane E changes in `brand-context.md`).

Precondition: lane A's email, organic social and paid re-cut was in place when the lane opened. `corpus-visible-web.tsv` landed during the lane (lane A, web, closed the same afternoon), so web exemplars are built rather than left null.

## 1. What landed

| File | Role | Status | Provenance |
|---|---|---|---|
| `brand-pack/voice-contract.md` | `voice_contract` | ratified (Gate 2, 2026-10-21, calls 1, 7 and 8); section 4's rules 2 and 3 and section 5's devices rule stay [derived] | the five qualities and their IS and IS NOT words [documented p27 to p31]; definitions, checks, defaults and not-like lines [derived]; sounds-like lines verbatim [documented] or [observed] with page or node id |
| `brand-pack/legal-ledger.json` | `legal_ledger` | `_status: "test-seed"`, v0.2.0 with the Gate 2 postures (calls 4 to 6) | evidence per row [observed] or [documented]; triggers [derived] |
| `brand-pack/_proposed/exemplars.json` | `exemplars`, once moved | approved (Gate 2, call 2); lane E moves it to `brand-pack/exemplars.json` and sets the role | text [observed]; role, type and voice tags [derived] |
| `brand-pack/concrete-lexicon.json` | `concrete_lexicon` | derived, proposed for Gate 2 | product words and names from `products.json`; scene words [derived], kept on corpus counts [observed] |
| this file | notes for lane E and Eddie | | |

Not written, as the prompt says: `favorites`, `voice_calibration` and `judge_rubric` stay null until HLR's reviewers mark lines. No Figma call was made; `figma.yaml` and the slot maps are untouched.

## 2. For lane E: the File map entries

Paths are relative to `brand-pack/`. Eddie approved the exemplars (call 2): lane E moves `_proposed/exemplars.json` to `brand-pack/exemplars.json`, and the role below then resolves. `prohibited_patterns` goes inline. The first pattern is the escape `\u2014` written as text, so no file carries the character; the JSON below already escapes the backslash. Paste it as is.

```json
{
 "voice_contract": "voice-contract.md",
 "legal_ledger": "legal-ledger.json",
 "exemplars": "exemplars.json",
 "favorites": null,
 "voice_calibration": null,
 "voice_model": null,
 "concrete_lexicon": "concrete-lexicon.json",
 "judge_rubric": null,
 "judge_calibration": null,
 "corpus": null,
 "prohibited_patterns": [
  "\\u2014",
  "\\bhightlight",
  "\\btoumaline\\b|\\bpendent\\b|\\bguranteed\\b|\\breail\\b|\\bstres\\b|\\bjouney\\b",
  "\\bcur(e|es|ed|ing)\\b",
  "\\b(treat|treats|treating|prevent|prevents|preventing|reverse|reverses)\\s+(your\\s+)?(anxiety|depression|disease|diseases|illness|illnesses|cancer|infertility|insomnia|pain|symptoms|conditions?|disorders?)\\b",
  "\\b(instead of|replaces?|replacement for|no need for|alternative to)\\s+(your\\s+|a\\s+)?(medication|medicine|doctor|therapist|therapy|treatment|prescription)s?\\b"
 ]
}
```

Null roles and their owners: `favorites` and `voice_calibration` (HLR's reviewers' blind keep and cut marks, through Eddie); `voice_model` (written by `voice_lint.js --calibration` from those marks); `judge_rubric` (written from the marks and ratified by Eddie before a judge reads it); `judge_calibration` (written by `judge_calibration.js` once the judge is checked against the marks); `corpus` (a reserve role; the re-cut stays evidence and is not retrieved per run).

## 3. For lane E: narrative sections for `brand-context.md`

Paste-ready. Each keeps its sources.

### Voice

The voice contract is `voice-contract.md` (role `voice_contract`), read in full on every run. It carries the five qualities of the brand book's Copy section (p27 to p31): eloquent, refined, sensual, real, uplifting. They are also the `register` tags: every piece stays on the IS side of all five, each option leads with one, and a set covers at least two. What drafters get wrong most: writing to the live positioning (healing, witch, spell) instead of the book's, while C2 is open; stacking the book's sensual words as a quota; stating a stone's meaning as an outcome rather than as a tradition or an intention. Devices (the italic accent word, the asterisk aside, the ellipsis) are seasoning, at most one per piece. Status: ratified by Eddie at Gate 2 on 2026-10-21 (lane C calls 1, 7 and 8); section 4's rules 2 and 3 and the devices rule stay [derived]. Exemplars: 159 lines in `exemplars.json` (role `exemplars`), approved by Eddie at Gate 2 (call 2); the owner's favorites outrank them once HLR's reviewers mark lines.

### Prohibited language

Barred in all output, whatever a brief asks, and enforced by `prohibited_patterns`: the em dash (Eddie's standing rule, DECISIONS 2026-10-17); the misspelled name or handle HIGHTLIGHT and five misspellings found in the client's files; any line that says a piece, a stone or a session cures, treats, prevents or reverses a condition, or stands in for medical care, because the client's own site footer says its products are not intended to diagnose or treat ailments (site, 2026-10-17). Everything else that carries a claim is graded in the legal ledger rather than barred.

### Claims regime

No one at HLR is named yet to sign claims (C2, Review 1, owner HLR). The ledger `legal-ledger.json` is a test seed: every row enforces provisionally and nothing in it is counsel-approved. Rows marked needs_legal (health, fertility, sourcing, origin) block every lint, craft mode included, until HLR's signer rules on them; rows marked conditional (durability and guarantees, endorsements, identity, offers) ask a person to confirm and record each use; metal and karat and the five metaphysical rows are info rows, listed for the verifier in every lint report with their hit counts and never blocking (Eddie, Gate 2, 2026-10-21). Required language: the site footer disclaimer, verbatim (row HLR-REQ-01), in every email footer and on every product page, fed by the brief into the disclaimer slot. Customer and press words appear only verbatim and sourced (Judge.me, a press URL); the quote-like lines in the email and social templates are unsourced (Brand Review v2, question 7). Customer material often carries claims HLR cannot make (healing, anxiety): research may read it; copy may not repeat it.

### House conventions

The voice-side house style is in the voice contract, section 6: no em dashes; product display names with "in"; sentence-case headlines; Trade Gothic caps for eyebrows and labels; the CTA as an outline caps box or a text link (C6); questions allowed, exclamation marks rare and never in a headline; the serial comma and curly apostrophes (defaults until Eddie rules); emoji in social captions only; offers, prices, dates and codes as merge tokens until C10.

## 4. Prohibited patterns: the human record

Ratified by Eddie at Gate 2 (call 3, 2026-10-21): all six. Compiled the way the lints do (one case-insensitive expression). Tested in Node and Python; none matches the footer disclaimer. Corpus counts are distinct visible strings in lane A's four TSVs (email 1470, social 1054, paid 579, web 178); client text keeps its own punctuation, so the dash counts are the client's.

| # | Pattern (regex fragment) | Why | Provenance | Corpus strings hit (email / social / paid / web) |
|---|---|---|---|---|
| 1 | `\u2014` | No em dashes in any HLR copy or deliverable | [documented] DECISIONS 2026-10-17 (standing project rule; Brand Review C9) | 74 / 26 / 11 / 2 |
| 2 | `\bhightlight` | Misspelled brand name or handle (@HIGHTLIGHTRITUALS) | [observed] social corpus, 48 rows (LEARNINGS 2026-10-18, lane A) | 0 / 2 / 0 / 0 |
| 3 | `\btoumaline\b\|\bpendent\b\|\bguranteed\b\|\breail\b\|\bstres\b\|\bjouney\b` | Known misspellings in the client's files, so a reused line cannot carry them | [observed] pattern review typo list (2:52895, 2:37948, 2:42498, 2:194032); corpus ('jouney', 'relieve stres') | 1 / 0 / 2 / 2 |
| 4 | `\bcur(e\|es\|ed\|ing)\b` | A piece or a stone never cures anything: the client's own footer says the products are not intended to diagnose or treat ailments | [documented] site footer disclaimer, 2026-10-17; [derived] pattern | 0 / 0 / 0 / 0 |
| 5 | `\b(treat\|treats\|treating\|prevent\|prevents\|preventing\|reverse\|reverses)\s+(your\s+)?(anxiety\|depression\|disease\|diseases\|illness\|illnesses\|cancer\|infertility\|insomnia\|pain\|symptoms\|conditions?\|disorders?)\b` | Treatment or prevention of a condition, against the same footer | [documented] site footer disclaimer; [derived] pattern | 0 / 0 / 0 / 0 |
| 6 | `\b(instead of\|replaces?\|replacement for\|no need for\|alternative to)\s+(your\s+\|a\s+)?(medication\|medicine\|doctor\|therapist\|therapy\|treatment\|prescription)s?\b` | Never a substitute for medical care, as the footer says | [documented] site footer disclaimer; [derived] pattern | 0 / 0 / 0 / 0 |

Kept out on purpose: the words "treat", "diagnose", "medical" and "ailment" on their own (the disclaimer uses them), and the en dash (Eddie's rule names the em dash; call 3).

## 5. The claims ledger seed

Severity uses the engine's words (`lib/claims.js`): needs_legal blocks (it compiles to prohibited), conditional asks for a person, info never blocks. A row marked `paraphrase_risk` is listed in every lint's `checked.paraphrase_review` with its hit count, matched or not: that is how the metal and karat row and the five metaphysical rows are flagged without a sign-off (Eddie, Gate 2, calls 4 and 5). The playbook's three statuses map as allowed = approved, needs_legal = needs_legal, blocked = prohibited. "Allowed" and "blocked" are not engine words: written as such, both would compile to conditional.

| Row | Topic | Severity | What it covers | Corpus strings hit (email / social / paid / web) | paraphrase_risk |
|---|---|---|---|---|---|
| HLR-H01 | health | needs_legal | Disease, cure, treatment and healing | 120 / 68 / 48 / 13 | yes |
| HLR-H02 | health | needs_legal | Mental and emotional health | 17 / 31 / 5 / 1 | yes |
| HLR-H03 | health | needs_legal | Body, sleep, allergy and skin | 0 / 0 / 0 / 0 |  |
| HLR-H04 | health | needs_legal | Energy healing services, readings and practitioner credentials | 44 / 13 / 3 / 6 |  |
| HLR-F01 | fertility | needs_legal | Fertility, pregnancy and the body's cycles | 4 / 9 / 0 / 0 | yes |
| HLR-S01 | sourcing | needs_legal | Ethical, responsible, recycled and sustainable sourcing | 15 / 6 / 15 / 1 |  |
| HLR-S02 | sourcing | needs_legal | Natural, genuine and untreated stones; grades and quality | 6 / 1 / 0 / 0 |  |
| HLR-O01 | origin | needs_legal | Origin, place of making, handmade and one of a kind | 30 / 11 / 18 / 5 | yes |
| HLR-K01 | materials | info | Metal and karat | 36 / 17 / 29 / 3 | yes |
| HLR-K02 | materials | conditional | Durability, water, tarnish and guarantees | 6 / 0 / 0 / 2 |  |
| HLR-M01 | metaphysical | info | Protection and warding stated as what the piece does | 24 / 7 / 7 / 1 | yes |
| HLR-M02 | metaphysical | info | Abundance, luck, love and manifestation stated as an outcome | 44 / 52 / 42 / 0 | yes |
| HLR-M03 | metaphysical | info | Energy work done to the piece: activated, charged, infused, blessed | 42 / 10 / 32 / 16 | yes |
| HLR-M04 | metaphysical | info | Chakra, vibration, frequency and aura | 33 / 16 / 7 / 2 | yes |
| HLR-M05 | metaphysical | info | Stone meaning stated as an outcome | 16 / 19 / 10 / 1 | yes |
| HLR-T01 | endorsements | conditional | Reviews, press, ratings and popularity | 15 / 5 / 4 / 3 |  |
| HLR-T02 | identity | conditional | Ownership and identity claims | 3 / 2 / 1 / 0 |  |
| HLR-P01 | offers | conditional | Offer terms: free shipping, gifts with purchase, codes, sale windows | 51 / 4 / 14 / 2 |  |
| HLR-REQ-01 | required_language | info | The site footer disclaimer, verbatim | 0 / 0 / 0 / 1 |  |

How the footer disclaimer is carried. The lints check required language line by line, inside the same string as the claim. Set as `required_language` on the metaphysical rows, it would fail every such line, since a footer is its own slot. So the verbatim text sits on its own row (HLR-REQ-01, info, one literal trigger that records each run carrying it), and each M row names it in `requires`. Every trigger and every prohibited pattern was run against the disclaimer: only HLR-REQ-01 matches it, so the required text passes every lint.

What it costs while C2 is open, measured on the work's distinct visible strings: a needs_legal row hits 177 in email, 110 in social, 75 in paid and 18 on web, and those lines fail; an M row hits 143, 89, 90 and 18, and each is listed for the verifier, never blocking. Craft mode reports the conditional rows instead of blocking them. Lexical matching cannot judge meaning: ten rows carry `paraphrase_risk`, so every lint lists them for a verifier, matched or not. Engine gap: no severity flags each matching line without blocking; the info rows are flagged by count only (for 0.5.3).

## 6. Exemplars

159 lines in `brand-pack/_proposed/exemplars.json`, in the engine's shape (`{exemplars: [{id, text, role, type, channel, voice}]}`), each with its source file, frame id, text id, frame name, section and occurrence count.

| Channel | Lines | By role | By leading quality |
|---|---|---|---|
| email | 72 | headline 31, body 19, cta 9, eyebrow 7, subhead 6 | eloquent 4, refined 16, sensual 14, real 24, uplifting 14 |
| social | 49 | body 25, headline 11, cover 8, caption 3, cta 2 | eloquent 11, refined 9, sensual 5, real 17, uplifting 7 |
| paid | 30 | on_image 30 | eloquent 2, refined 9, sensual 7, real 5, uplifting 7 |
| web | 8 | heading 4, eyebrow 2, cta 2 | refined 4, sensual 1, real 1, uplifting 2 |

How they were chosen. Automatic filters first, on distinct visible strings (case and punctuation folded, so the counts run lower than in section 4; on web, a ledger row of any status already excludes here):

| Channel | Distinct visible strings | Clean after the automatic filters | Excluded, by reason (a string can carry several) |
|---|---|---|---|
| email | 1394 | 730 | needs_legal 174, digits 160, product_or_stone_name 141, role_other 113, dash 78, prohibited_pattern 75, quote_or_review 55, planning_layer 53, too_short 39, too_long 31, boilerplate 29, placeholder 24, role_script 6, emoji_or_hashtag 3, note 1, typo 1 |
| social | 992 | 430 | role_other 199, product_or_stone_name 108, needs_legal 106, planning_layer 100, role_label 78, digits 67, too_short 41, quote_or_review 30, dash 27, prohibited_pattern 23, too_long 23, role_script 22, placeholder 20, note 18, boilerplate 15, emoji_or_hashtag 8 |
| paid | 527 | 124 | role_secondary 364, planning_layer 86, digits 78, needs_legal 67, product_or_stone_name 65, quote_or_review 15, prohibited_pattern 12, dash 10, emoji_or_hashtag 9, boilerplate 4, placeholder 1, typo 1 |
| web | 160 | 68 | ledger 31, digits 30, product_or_stone_name 22, planning_layer 9, hidden_by_board_clip 8, boilerplate 4, prohibited 3, quote_or_review 2, dash 2, typo 1 |

Then any ledger row of any status and any prohibited pattern excluded the line, and lane C read 519 candidates sampled across sections. The read cut product and stone names, series labels, fragments of multi-line sequences, Lorem ipsum, designer notes, customer reviews, event and service lines (sessions and readings are C2), lines that make a claim the triggers miss (the misses became triggers: "designed to protect", "keeps you protected", "shield from", "for daily defense", "helps you feel", "luck", "invite abundance", "charged in", "energy-charged", "handwoven", "not mass-made", "earth-conscious", "well-being", and a new identity row, HLR-T02), and lines that lean on the live positioning held by C2 and C7 ("Fine jewelry for the witchy ones", "for the witch within", "A spell made just for you", "Golden eggs for good fortune"). Near-duplicate templates kept one line each ("Add intention to your stack" for the five "Add X to your stack" lines). Captions came from layers labelled "Caption", "caption:" or "FINAL CAPTION"; the label is removed and the removal recorded on the line.

Tags: role from the face, the size and the frame (email at the 600-wide scale; the paid `on_image` is the largest line in its frame); type from the frame name against the ratified email and social types, the engine's `text_forward` for paid (paid runs on the bundled ad roster until Review 2, Gate 2 call 1 b; HLR's held type stays in `source.hlr_type_held`), null for web (the section library is held for Review 2); voice as the quality the line leads with. All three are [derived]. Covers come from the posted grid and the 2026 templates only; story and panel lines are `headline` and `body`.

Checks: no exemplar carries a figure, an em dash or an en dash; none trips a ledger row or a pattern. `exemplar_pick.js` reads the file on every channel; the thin roles are named in its `gaps`.

## 7. Concrete lexicon

58 product words, 42 scene words, 15 families, 182 product names. `product` holds single words, because `voice.js` matches tokens whole: the stones, parts and metals in the display names, plus silk, egg and rosette from the corpus. `scene` is lane C's list of concrete nouns of HLR's world, kept where the corpus uses each at least twice (counts under `evidence`). `product_families` are lane D's family keys verbatim ("Seeds of" included). `product_names` are all 182 display names. Re-derive it from the owner's keeps once favorites exist, and from HLR's export when it replaces the snapshot.

## 8. Checks run (author's output)

1. `exemplar_pick.js --coverage` on each channel: email 72 lines in 5 roles, social 49 in 5, paid 30 in 1, web 8 in 3; role picks print their ids and exit 0. Thin (under 3): social `cta`, web `cta` and web `eyebrow`. `--channel web --role description` exits 1 by design.
2. The ledger through 0.5.1's `lib/claims.js`: 19 rows compile (17 with regex triggers, 16 with lemmas, 1 with a literal trigger; 7 carry `paraphrase_risk`); status test-seed; the footer disclaimer matches HLR-REQ-01 only.
3. `paid_lint.js` against a scratch probe pack outside the brand home (a File map pointing at these files and lane D's): an em dash fails as a prohibited territory; "heals anxiety" fails on HLR-H01 and HLR-H02; "cures" fails on the pattern and HLR-H01; "ethically sourced" fails on HLR-S01; "fertility" fails on HLR-F01; "protects your energy" lands in `needs_human_signoff` on HLR-M01 (INSUFFICIENT-INPUT); the disclaimer as copy raises no claims finding.
4. `voice_lint.js --lines` with the lexicon: it loads with the counts in section 7, and a vague line earns no concrete noun.
5. `preflight.py --pack` on the probe pack: blocking 0, and every lane C role resolves.
6. All exemplars and the 26 quoted lines in the voice contract: no ledger row, no pattern. Em dash grep on the five files: 0.
7. Census of the five files against the saved term list: one hit, `figma-key-shaped`, HLR's own reference file key.
8. Gate 2 rulings (2026-10-21), on a scratch probe pack: `paid_lint.js` and `social_lint.js` no longer put HLR-K01 or HLR-M01 in errors, sign-offs or warnings; both rows appear in `checked.paraphrase_review` with their hits (paid 1 and 1, social 2 and 2). The ledger still compiles 19 rows; the disclaimer still matches HLR-REQ-01 only.

## 9. Gaps (null, with owner)

| Gap | Owner |
|---|---|
| Who signs claims; every needs_legal row's ruling | HLR (C2, Review 1) |
| Favorites, voice calibration, judge rubric (blind keep and cut marks) | HLR's reviewers, through Eddie |
| Exemplars file move and role (approved at Gate 2) | lane E |
| Email subject and preheader exemplars: none in the Figma file | HLR (ESP export) |
| Paid primary text, headline and description exemplars: the platform fields are not in Figma | HLR (Meta and Google ad exports) |
| Social captions: 3 lines; where captions live | HLR (Review 1) |
| Web: 8 lines, no description or card copy; web types | HLR (live site copy); Review 2 |
| Product prose: every `description` in products.json is empty, so no product story is verifiable | HLR (Shopify export) |
| Brand name forms (C1), tagline (C7), offers (C10), current social franchise names | HLR (Review 1) |

## 10. Gate 2 calls, as ruled by Eddie (2026-10-21)

Package items (`gate-2-package.md`) in brackets.

1. **The voice principles** [11]: (a) ratified as written. The voice contract's status line, section 9 and its tags carry it.
2. **The exemplars** [12]: (a) approved. Lane E moves the file to `brand-pack/exemplars.json` and sets the role.
3. **The prohibited patterns** [15]: (a) all six, the em dash included. Already wired in the File map.
4. **Metal and karat, HLR-K01** [14]: neither option. Eddie: no strong flag. The row is info with `paraphrase_risk`: listed in every lint report with its hits, never blocking. The figure rule still needs a karat number in the facts layer or the brief.
5. **Metaphysical benefit, HLR-M01 to M05** [13]: neither option. Eddie: flag, no sign-off. The five rows are info with `paraphrase_risk`, as in 4. Their framing guidance (tradition or intention, the footer disclaimer) stays in `requires`; C2 can still change the posture.
6. **The footer disclaimer** [16]: (a) its own info row, fed by the brief into the footer slot.
7. **House defaults** [17]: (a) as written: voice contract section 6, every row.
8. **The founder's first person** [18]: (a) only on a brief that says the piece is from the founder.

## 11. Cross-lane notes

- Engine gap (for 0.5.3, lane H): `lib/claims.js` has no severity that warns per matching line without blocking. Calls 4 and 5 run on info rows flagged by count in `checked.paraphrase_review`; a per-line flag needs a new severity (for example `flag`, reported among the warnings).

- Gate 2 call 1 b (lane D's chat) moved the paid and web rosters under `held_for_review_2`; the exemplars follow it: paid lines carry the engine's `text_forward`, web lines no type.
- Lane A's two open visibility calls touch web text only: the 8 texts of the `D_Get Started` block count as visible but sit outside a clipping board, and they are excluded here; below-the-fold copy off frame is not used.
- The paid lint asks for a sign-off on any HLR paid type id ("not in the roster"), so a paid slate should name the bundled ad type until Review 2.

## 12. For lane E: what the rulings change in `brand-context.md`

Lane E's file, so lane C does not edit it. Three changes, paste-ready:

1. **File map:** `"exemplars": "exemplars.json"`, once the file is moved from `_proposed/`.
2. **Voice**, the status paragraph, in place of the one that begins "Status: draft for Gate 2":

> Status: ratified by Eddie at Gate 2 on 2026-10-21 (lane C calls 1, 7 and 8); the contract's section 4 rules 2 and 3 and its devices rule stay [derived]. Exemplars: 159 lines in `exemplars.json` (role `exemplars`), approved at Gate 2 (call 2); the owner's favorites outrank them once HLR's reviewers mark lines.

3. **Claims regime**, in place of the sentence on conditional rows and the closing sentence on open postures:

> Rows marked conditional (durability and guarantees, endorsements, identity, offers) ask a person to confirm and record each use. Metal and karat (HLR-K01) and metaphysical benefit (HLR-M01 to M05) are info rows: every lint lists them for the verifier with their hit counts and none blocks or asks for a sign-off (Eddie, Gate 2, 2026-10-21). The disclaimer stays its own row, fed by the brief into the footer slot (Gate 2, call 6).
