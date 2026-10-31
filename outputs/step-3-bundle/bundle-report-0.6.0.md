# Step 3: engine 0.6.0 and the bundle

2026-10-31, the build runner (backlog items `legal-delete` and `retire-phase1`, on DECISIONS 2026-10-31: the Phase 2 re-scope). In this folder: `hlr-studio-engine-0.6.0.plugin` (the one to install over 0.5.3, same name), `studio-engine-0.6.0.plugin` (the engine it is built from) and `build_bundle.py` (unchanged; rebuilds either). No review round yet: section 5 is empty until a fresh-context review runs against REVIEW.md. The 0.5.3 engine stays beside it as the source the retired pieces came from.

## 1. What 0.6.0 changes

**The legal regime is deleted (`legal-delete`).** Gone from the engine: `lib/claims.js` (the ledger compiler and its statuses); the `legal_ledger` pack role in `references/pack-contract.md` and the brand-context templates; the ledger branch in `brief_lint.js`, `copy_lint.js` and `paid_lint.js` (the social and web lints left with their skills, below); craft mode (`--craft`) in `copy_lint.js`, which existed to relax the ledger; the craft and legal bands in `render_onepager.js`; the `legal` owner in notes and gaps (`brief-schema.json` now lists `you`, `brief`, `data`, `system`); the `claims_checking`, `ledger_status`, `ledger`, `ledger_trigger_formats`, `paraphrase_review`, `paraphrase_review_required`, `craft_mode` and `craft_claims_for_review` report fields; the options register's `cleared`, `ledger_version` and `ledger_status` (a row now carries `lint_verdict`, `lint_sourcing` and `lint_passed`, read from the lint report and nowhere else); `preflight.py`'s required ledger role. Every lint report carries one `sourcing` line in their place, saying what the figure check ran against and how many prohibited patterns compiled.

**What stays, and is now the whole claims rule.** Sourcing: every figure, price, quote or review in copy traces to the pack's product database or the brief (the unit-aware figure check in all three lints, the comparative check, the literal-code check); the brief's `never_say` list and its union with the pack; the pack's `prohibited_patterns` (voice: house style, the em dash, the misspelled handle; the lints still refuse to run without them); paid's grounding rule. No lint carried a prohibited-territory list of its own: every list is the pack's.

**Phase 1 machinery is retired (`retire-phase1`).** Moved out of the engine into `_archive/engine-0.5.3-retired/` (nothing deleted; the folder's README says why and names the version): `skills/web-copy`, `skills/social-copy`, `skills/customer-evidence`, `skills/options-board`, `skills/verify` (the pairwise judge, `judge_brief.js`, `verify_packets.js`, the calibration), `skills/squad-run` with `workflows/squad-run.js`, `email-copy`'s `route_findings.js` with its test, brief-intake's `references/route-plan.md`, `lib/claims.js`, and the 0.5.3 `tests/test_pack_and_claims.js` (replaced by `tests/test_pack.js`). Kept, with their tests: `brief_lint.js` (still accepts `--routes` for a brief that carries a Phase 1 route plan; a social channel is linted for shape only, the format table having left with `social-copy`), `copy_lint.js`, `paid_lint.js`, `fit_check.js` (its social fixture copied to `tests/fixtures/slotmap_social.yaml`, the smallest piece it needs), `slot_lint.js`, `canvas_check.js`, `face_check.js`, `tokens_build.js`, `preflight.py`, `sku_lookup.js`, `exemplar_pick.js`, `build_seam_map.py`, `register_append.js`, `register_view.py`, `render_onepager.js`, `safe_zone.js`, `resolve_brand.py`, `voice_lint.js`. The registry is unchanged in shape; `plugin.json` is 0.6.0 with a five-skill description; README.md, BUNDLE.md, `pack-contract.md` and every kept SKILL.md name no retired skill (the README keeps one line saying what was retired and where it went).

**Em dashes.** The strings `copy_lint.js`, `paid_lint.js`, `register_append.js` and `render_onepager.js` write into outputs carry none (`claims_checking` and `slot_checking` were two of the 17 baseline lines; the one-pager's bands and chips the rest). The findings template (`route_findings.js`) is retired, so no findings file is produced. Comments inside engine code keep theirs (REVIEW.md section 2: engine text is exempt).

## 2. The bundle: hlr-studio-engine 0.6.0

- Built 2026-10-31 by `build_bundle.py` from the 0.6.0 engine: `studio-engine-0.6.0.plugin` 92 files; `hlr-studio-engine-0.6.0.plugin` 93 files (the registry with `hlr` only, `plugin.json` renamed and described, `BUNDLE.md`). 0.5.3 shipped 154 files.
- **sha256:** `hlr-studio-engine-0.6.0.plugin` 07eac53381bd1f9e266ea40809e3192e53a7ab16f29982366c4cce32a7fe85cf; `studio-engine-0.6.0.plugin` 6fe859a4437264577010aba7b2537cd0e1f397574cc7c3a32769d9469427acea.
- The registry lists `hlr` (aliases HLR, High Light Rituals, HighLight, highlight-brandbook) and the Mac pack path. 0 runtime files in either plugin.

## 3. Checks

Run in the cloud (the runner's container, Node 22, Python 3) on the shipped files. `bash build/checks.sh /tmp/hlr-checks-060` from the repo root printed `checks: PASS`: guard suite PASS (77 prose and 31 register cases, parity on 5,000 fuzzed lines, 20 host shape and 18 board mutations, `close_checks.js` current); pack mutation tests 17 mutants, 0 failures; engine tests 18 files, 0 failed; em dash scan 0 new lines, 17 known.

| # | Check | Result |
|---|---|---|
| 1 | Tests | 18 files, 466 checks, 0 failed, in the cloud on the hlr bundle (0.5.3: 28 files, 767 checks; the drop is the ten retired test files and the ledger cases, section 1) |
| 2 | Census, other brands | not run: the tool lives in `claude-cowork/_tools` on the Mac. Eddie runs it |
| 3 | 8-word runs | not run: the Mac. Eddie runs it against 0.5.3's `runs.txt` |
| 4 | Quoted strings | not run: the Mac. Eddie runs it against 0.5.3's `quotes.txt` |
| 5 | Descriptions | 5 skills, all under 1024 characters; longest 1014 (`email-copy`), then 1003 (`paid-ad-copy`), 988, 960, 766 |
| 6 | Platform numbers | paid specs verified 2026-07-27 (3 sources); every number has a confidence; 0 far. The organic specs left with `social-copy` |
| 7 | Build | both plugins rebuilt from the shipped engine to the shipped sha256 (section 2); 0 runtime files in either |
| 8 | Resolution | `hlr`, `HighLight` and the folder path: rc 1, the pack path found twice in the output, 0 tracebacks (the Mac path is not on this machine, so rc 1 is the cloud's expected state; on the Mac it is 0); `nonesuch`: rc 2, pack 0 |
| 9 | Review | not run yet: the fresh-context review is Eddie's or the next runner's; section 5 is empty |
| | Pack guards | the four `preflight.md` section 6 guards hold on the pack as it stands: R7 (the em dash fragment compiles, matches U+2014 and not the footer text now read from `products.json`; the three lints draw prohibited territory on it end to end, the comma control draws none), R14 (43 roles, 43 keys, 28 gap rows, 5 warnings all pre-existing), the tag scan (76 lines, 0 untagged), the pointer check (77 tags, 0 failures) |
| | Regeneration | the demo email and the forge-proof slates re-linted and re-rendered with 0.6.0 into a scratch folder: 0 em dashes in the outputs; `copy_lint` WARN on both (as before: no `exemplars_shown`, and a `legal` note owner now warned); `brief_lint` FAIL on both because each brief carries a gap owned by `legal`, which the schema no longer allows (section 7) |
| | Grep | `grep -rIn "needs_legal\|legal_ledger\|legal-ledger\|signer" <engine src> brand-pack` returns only the word "designer" (five engine lines, one pack line, every one the word designer, which the pattern `signer` matches); no ledger token remains |

## 4. The pack

- `brand-pack/legal-ledger.json` moved to `_archive/brand-pack/legal-ledger.json` (`git mv`; nothing deleted).
- `brand-pack/products.json` `_meta.brand_facts`: eleven facts that lived only in the ledger, each with its ledger id (`was`), its wording as the ledger's evidence carried it, its source and a status saying whether it is observed or documented and what HLR still confirms: the site footer text verbatim, the ownership line (book p6), the place of making, the sourcing, stone quality, energy work, metal and karat, durability and endorsement statements the live copy makes, the services sold as products, and the observed offer terms (thresholds, codes, 30% off). Eight ledger rows carried only a legal posture (H01, H02, H03, F01, M01, M02, M04, M05) and were dropped; `_meta.brand_facts.dropped_rows` names them. `_meta.figures`, `_meta.claims_note` and one gap owner no longer point at a ledger.
- `brand-pack/brand-context.md`: the Claims regime section is now Sourcing (six tagged lines); the File map has no ledger key and its intro says the role is removed (DECISIONS 2026-10-31); the claims-signer gap row is gone; the C2 contradiction row, the sessions line, the prohibited-language footnote and the sensitive-territory line no longer cite ledger rows. The six `prohibited_patterns` are unchanged.
- The ledger references in `voice-contract.md`, `slotmap.yaml`, `slotmap-paid.yaml`, `slotmap-social.yaml`, `strictness-map.md`, `module-library.json`, `type-registry-core.json`, `section-library.json`, `route-axes.json`, `exemplars.json`, `art-direction.md` and `asset-types.md` now point at `products.json` or at the sourcing rule.
- `outputs/step-2-pack/preflight.md`: the R7 guard reads the footer text from `products.json` and probes the three lints that remain; the R14 guard no longer reads ledger topics; the results and degrade tables say the role is removed. `guards/mutation_tests.py` is unchanged and passes.

## 5. Review

None yet. A fresh-context review against REVIEW.md (sections 2 and 3, lane H's prompt) is the next step before the bundle is installed; its findings go to `review-engine-0.6.0-r1.md` beside this file.

## 6. Engine defaults until Eddie rules

Each is a line for DECISIONS.md when he rules, and each ships as a marked default until then:

1. A short gate is an error, never a warning, now that craft mode is gone; the slate's notes say why an axis is unsupportable and a person accepts or rejects that.
2. `legal` is no longer an owner for a gap or a note: the schema refuses it, and a question about a fact or a right is owned by `brief` (the requester takes it to the brand). Existing briefs re-own those gaps before they lint clean (section 7).
3. The register's `lint_passed` is `verdict !== 'FAIL'` from the lint report and nothing else; no row records a clearance.
4. The roles the retired skills read (`section_library`, `brand_domains`, `insight_register`, `recency_months`, `judge_calibration`, `judge_rubric`) stay in the pack contract as optional, so an existing File map stays valid; the contract says nothing in 0.6.0 reads them.
5. `brief_lint.js` keeps `--routes` as a legacy shape; a social channel in a brief warns that its format is not checked.
6. The site footer text is recorded in `products.json` as an observed fact and carried only when a brief's `must_say` names it; no lint requires it (the required-language row was deleted with the ledger).
7. The pack's six `prohibited_patterns` are kept as written. Patterns 4 to 6 (cure; treating, preventing or reversing a named condition; standing in for medical care) read as health-claim bars rather than voice: kept because Eddie ruled the prohibited patterns stay, flagged for his call.
8. The engine's own pairwise judge, the board and the verifier are retired; the crew's Editor reads `judge_rubric` as the owner's taste, if at all.

## 7. Open, ranked by production-blocking risk

1. **A fresh-context review** of 0.6.0 (REVIEW.md section 3, check 9) and the Mac-only checks 2, 3 and 4: none has run. Owner: Eddie (or the next runner for check 9).
2. **The existing briefs carry `legal` gaps.** `made-to-order-pendants.brief.json` (gap 4) and `protection-of-energy.brief.json` (gap 8) fail the 0.6.0 brief lint on the schema; their slates' `legal` notes warn. Re-owning those gaps to `brief` is a two-line edit per brief, left to the next run that touches them (the files are records of a 0.5.x run). Owner: runner.
3. **The em dash baseline is unchanged** (17 lines): the known files are 0.5.x outputs that stay as records and were not regenerated in place; regenerated into scratch they carry none. The baseline clears when those files are regenerated or archived. Owner: runner, with Eddie's go to touch the demo and forge-proof outputs.
4. **The facts moved to `products.json` are observed, not confirmed.** Every `brand_facts` entry says what HLR still confirms (C2, C10, the export). Owner: HLR, through Eddie.
5. **The web and social masters' copy paths** have no lint in the bundle (`slotmap_web` and `slotmap_social` are read by `slot_lint.js` only). In scope only if Phase 2 brings web or organic social back. Owner: Eddie.
6. **`checks.sh` reads only the last line of the mutation tests** (`| tail -1`), so a mutation failure cannot fail the run on its own; the mutation run this time passed after one fix, found by running the script directly. A one-line fix (`set -o pipefail` or a status capture) for a later run. Owner: runner.

## 8. Install handoff

Install `hlr-studio-engine-0.6.0.plugin` over 0.5.3 (same name) once the review in section 5 closes with no open blocker and Eddie gives the go. The pack needs no reinstall: the registry still points at `/Users/eddie/Documents/claude-cowork/highlight-brandbook/brand-pack`, and the pack changes in section 4 are already in the brand home. After install: `python3 <plugin>/skills/email-copy/scripts/preflight.py --pack <pack>` should list three required roles resolved and no ledger; a run of `copy_lint.js` on any slate should carry `checked.sourcing` and no `claims_checking`.
