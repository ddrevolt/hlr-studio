# HLR learnings

One dated entry per chat, newest first.

## 2026-11-01: Organic board, S03 and S04 built (Eddie's go)

- Eddie's first upload to the originals page was organic social only; the 19 paid nodes were never there. Inventory by name family and ratio (findAll over the sections) answers "is it all here" in one call; never trust a section name.
- Pasted nodes get new ids, so originals match by name and size, not client id. Clone inside the same file (node.clone(), then appendChild into the board section) works across pages in two calls: clone on the source page, reparent on the target page.
- A screenshot fired in the same turn as a use_figma edit can render the state before the edit. Screenshot in a later turn after edits.
- Cloning S01 variants (clone() on a component returns a component) keeps every variable binding, so new organic masters start bound. New text must be cloned from a bound node or bound by hand (fontSize), since styles alone do not carry the social-mode size.
- A single long affirmation (190 characters) cannot be a display/m headline (cap 54): rebuilt in Body it loses Saol and the italics. S01 needs a long-quote option or a shorter line (open for Eddie and Donnie).
- Flex probe floor: with the wide-word corpus every one-line slot lands at 24 characters (two words); read it as a floor, not a tuned budget.
- Cost: not measured.

## 2026-11-01: Paid masters P01 to P09 built in the library (Eddie's go, no review stop)

- Custom properties cannot be set on Figma nodes ("no such property '_row'"): keep per-variant layout metadata in a Map keyed by node id. A failed run leaves stray components named after the temp name, so a retry starts by removing page-level components with that name.
- A whole-range `setRangeBoundVariable` for fontStyle detaches the text style (textStyleId becomes empty). A merge token has no space, so "last word" was the whole token: the masters carry the style only, and the accent word is applied on the instance in the example.
- Component properties for toggles belong on the set (`addComponentProperty`), then each variant's layer references the returned key; a layer absent from a variant is simply skipped.
- Auto-layout rows with FILL children share height only if the row and the tile are FILL vertical; long tracked labels at 32 px wrap inside 215 px columns (Aquamarine, White Topaz), so a 4-column birthstone grid fails at 1080 wide.
- Cross-file image transfer is not possible here: `download_assets` returns URLs, but both the cloud shell and the Mac get 403 on them, so the client's originals can only be referenced and described, not pasted into the library.
- Sections take an explicit variable mode, so notes on a board use the social type sizes and stay readable.
- Flex probe (1080x1080, all toggles on): see `outputs/step-4-figma/paid-masters-notes.md`. P06.offer measures 23 characters on the Offer style, below 2x of the client's "30% off sitewide" (16 needs 32).
- Cost not measured.

## 2026-11-01: S01 Feed Post built in the library (Eddie's go, S01 only)

- An instance's child cannot change its stack positioning ("layoutPositioning cannot be overridden in an instance"), so E04's centred IMAGE chip cannot be nudged on an instance. The Offer tile's offer line sits in the lower third, clear of the chip; moving the chip means changing the E04 master.
- `setRangeBoundVariable` over a whole text range for fontStyle left the node's fontSize unbound; the unbound-property audit caught it and `setBoundVariable('fontSize', ...)` fixed it. Run that audit after any range binding.
- Changing a text node's characters drops the accent range's italic binding, so a flex probe re-applies the accent to the last word at every step or it measures roman widths.
- A `node.screenshot()` returned from use_figma shows inline, and returning anything else with it drops the data: read evidence in a separate call. `get_screenshot` with `enableBase64Response` shows the client's reference where the proxy blocks the URL.
- The client page (Highlight-Rituals-Design-Pull) is reachable through get_metadata and get_screenshot; only downloading its PNGs from the shell is blocked.
- `social-design-scope.md` lives only on the PR #9 branch, not on the Mac, and the Mac repo has no remote, so the PR goes through a cloud clone with a patch of this chat's edits.
- Flex probe, tightest variants at 1080 x 1350 on the social canvas, all toggles on, wide-word corpus: eyebrow 26 characters on one line; headline 63 (Headline on photo), 54 (Text tile), 21 (Offer tile); body 243 on five lines; script 27; cue 33. The Text tile headline (54 against 60 for 2x) and the Offer line (21 against 28) fail the 2x check, and the Offer line breaks inside Rhodochrosite and Phosphosiderite at display/l.
- Cost not measured.

## 2026-10-31: runner, paid-package

- Done: `crew/producers/figma_package.py` and `outputs/step-9-paid/agent-package.md`: three paste-ready packages for the native agent (feed 1:1, feed 4:5, story 9:16) built from `slotmap-paid.yaml` (P01 to P08 at each ratio, P09 on 9:16; 50, 50 and 51 slots), `tokens.json`, `figma.yaml` and `placement-specs.json`. Every slot id carries its budget statement (all null, said so), every package carries the license flag and the notice text, the 9:16 keep-clear is flagged unverified with no number, and no copy is typed (each text layer holds its merge value). `crew/tests/test_figma_package.py`: 21 tests, a lint case per format and mutation cases.
- Checked: `bash build/checks.sh` PASS (guard suite, 17 pack mutants, 18 engine test files, crew tests, em dash 0 new). Fresh-context review (read-only subagent): 0 blockers, 5 should-fix fixed (a keep-clear line that forbade the layers the package requires, a request for new variables outside the frames, the source status not stated, the feed padding source misquoted, the license notice without text), 5 notes, 3 fixed (budget owner wording, single-frame note, date default), 2 left (role to text style map is derived; one process note closed here).
- Findings: none open. The role to text style map (hook, title, headline, offer to `headline`, and so on) is [derived] for Donnie; the press quote on the headline style is a design call.
- Waiting on Eddie: `paid-specs` (the Meta numbers) and `review-2-outcome`: `slotmap-paid.yaml` is proposed and held for Review 2, so the package is a build proposal, not a ruling. Read the package, then set paid-package done if it serves. Waiting on Donnie: the style map. PR #6 (email-html) is open and conflicts with main (a stale copy of merged PR #5); the runner did not resolve it, see the run log.
- Next: klaviyo-push waits on a key (klaviyo-access). Nothing else is ready.
- Cost: one read-only review subagent; tokens not measured.

## 2026-10-31: runner, claude-md

- Done: `CLAUDE.md` at the repo root (47 lines: where things are, ten standing rules as they stand after Phase 2, how to run the crew on any endpoint, open and close, checks, the runner) and `crew/README.md` brought current (the email HTML producer is built; the Klaviyo push and Figma package are named as not built). `crew/tests/test_records.py` keeps both under 100 lines, free of em dashes, and every path they name resolving.
- Checked: `bash build/checks.sh` PASS (43 crew tests). The rules are written from the project instructions in this repo's record; Eddie reads the wording, since "Only Donnie ratifies a derived value" follows DECISIONS 2026-10-23.
- Waiting on Eddie: read CLAUDE.md, set claude-md done. handoff-rebuild waits on HLR's brand home path. Next: paid-package (its slot map is held for Review 2, so it waits on review-2-outcome in practice).
- Cost: not measured, no subagent.

## 2026-10-31: runner, email-html

- Done: `crew/producers/email_html/`: `twins.py` (one table-based fragment per module, M01 to M27, from `tokens.css`, the email canvas sizes in `tokens.flat.json` and the slot map), `assemble.py` (block list to one HTML file, tokens kept for Klaviyo, unfilled slot or unknown module exits 1), `build_twins.py` (twins and a Playwright screenshot per module at 1200 and 600), `examples/` (protection-of-energy at both widths). 11 new tests.
- Found: `tokens.css` redefines the same variables in later `[data-ground]` blocks, so reading every `--hlr-*` line takes the night ground; the twins read the first `:root` block only. A guard worth carrying to any token reader.
- Checked: `bash build/checks.sh` PASS (40 crew tests). Screenshots read by eye at 600 and 1200; the Figma master was not read (no Figma call), so a person compares proportions. Faces render as stand-ins; image slots are labelled placeholders; nav labels and product links are merge tokens, so Eddie owns them.
- Waiting on Eddie: set email-html done after comparing a twin with the master; supply nav labels and product URLs. Next: claude-md (handoff), then klaviyo-push waits on a key.
- Cost: not measured, no subagent.

## 2026-10-31: runner, crew-editor

- Done: a seeded-violation fixture (`crew/fixtures/editor-seeded/`: a misspelling the pack bars, an exclamation mark in a headline, an ampersand in body copy, a typed price) with the editor output that marks those four and nothing else. Applying it returns the clean dry-run files exactly, and `email_check` and `paid_check` fail before and pass after. `editor_check` now bars any typed figure in an `after` (the old test let one typed price replace another) and an email slot over its `max_chars`; `email_check` bars an ampersand in a body slot.
- Checked: `bash build/checks.sh` PASS (31 crew tests). The acceptance line "copy_lint still passes" is met by `email_check` and `paid_check`; the engine lints still read the retired slate shape and stay SKIPPED.
- Waiting on Eddie: set crew-editor done after review. Next: email-html (step 8), then claude-md (handoff). crew-intake, crew-strategist, crew-email, crew-paid and crew-editor are all in review, so Step 7 is built but for Eddie's sign-off.
- Cost: not measured, no subagent.

## 2026-10-31: runner, crew-paid

- Done: `brand-pack/placement-specs.json` holds Meta's placement limits as nulls with the gap and its owner (Eddie, item paid-specs), so the absence is loud. `paid_check.py` requires `spec_confidence` to equal the file's status, enforces any limit once a person fills it, and fails any numeral in ad copy that the intake does not carry. The paid prompt dropped its working limits (125, 40, 30) because no source backs them, and now includes the specs file.
- Checked: `bash build/checks.sh` PASS (29 crew tests). The engine `paid_lint.js` reads the retired slate shape and stays SKIPPED, so its acceptance line "paid_lint PASS" is not met; `paid_check` stands in.
- Waiting on Eddie: Meta's numbers for `placement-specs.json`; whether the File map in `brand-context.md` should list the new file (protected pack contract, not changed here). Waiting on Donnie: none. Next: crew-editor, then email-html.
- Cost: not measured, no subagent.

## 2026-10-31: runner, crew-email

- Done: `email_check.py` now reads the intake beside the output (slug, no product the intake lacks, `M03.name` a products.json display name, every merge token the intake's or a house token; a missing intake fails). Canned email block list for protection-of-energy in `crew/fixtures/protection-of-energy/email.json`: three subject pairs, hero, product text block, two-up grid, a Scorpio season block with three plain rituals, The Scorpio Crystal Set as the closing spotlight, every slot within `max_chars`. The six generated Phase 1 files that held em dashes are swept and `build/emdash_baseline.txt` is empty, with a test that keeps it empty.
- Checked: `bash build/checks.sh` PASS (26 crew tests, em dash scan 0 known, 0 new). The engine `copy_lint.js` still reads the retired slate shape and stays SKIPPED, so voice quality is not proven by a lint; a person reads the draft.
- Waiting on Eddie: set crew-email done after review. Waiting on Donnie: keep, cut or swap the three Scorpio rituals; a contents line for the set if wanted. crew-paid not started: its acceptance needs `placement-specs.json`, which waits on paid-specs (Meta numbers from a person). Next: email-html once crew-email is done.
- Cost: not measured, no subagent.

## 2026-10-31: runner, crew-intake and crew-strategist

- Done: `intake_check.py` is now the slimmed brief lint. Besides the pack checks it reads the brief the intake came from: every Products bullet is in `products[]`, every merge token survives (an Offer token must sit in `offer`), an Offer of None means `offer` is null, each named channel is present, a named send date leaves a `send_date` gap, and a typed price or date in a copy field fails. `strategist_check.py` now reads `intake.json`: the slug matches, an `urgency` angle needs an offer, a `proof` angle needs a quote in `must_say`, the brief's `never_say` applies, lead lines stay within 140 characters in sentence case, and a missing intake fails. Intake prompt rules 9 to 11 added. Canned intake and angles for the protection-of-energy brief in `crew/fixtures/protection-of-energy/`, written from the brief and `products.json` only. `build/checks.sh` now runs the crew tests.
- Checked: `bash build/checks.sh` PASS (23 crew tests, guard suite, 17 pack mutants, 18 engine test files, em dash scan 0 new). Dry run exits 2 at the pick and 0 with `--pick 1`. The census and overlap scans live on the Mac and were not run.
- Review (fresh context, files only): 0 blockers, 2 should-fix (a month regex that matched ordinary words, an Offer section read too strictly), 5 notes. Fixed: the regex, Offer `None` with a tail, missing sections named, wider token pattern, a missing intake now fails, the send-date gap owner reads "Eddie or Donnie" as the brief says, and the offer gap dropped (the brief decides None). Open notes: the brief's own Never say bullets are not mapped to `never_say` patterns by the check; angle 3 on the protection brief is `benefit`, which waits on C2, so a person reads it at the pick.
- Cost: not measured (review subagent about 104K tokens).
- Status: done: crew-intake and crew-strategist set to review. Waiting on Eddie: merge the pull request, then set both done; rule on the open Never say mapping note. Waiting on Donnie: the send date for the protection brief; C2 for benefit angles. Next: crew-email and crew-paid.

## 2026-10-31: engine 0.6.0, legal regime deleted and Phase 1 machinery retired

- Built by the runner on DECISIONS 2026-10-31 (backlog `legal-delete` and `retire-phase1`), from the 0.5.3 engine unzipped to scratch: `outputs/step-3-bundle/studio-engine-0.6.0.plugin` (92 files) and `hlr-studio-engine-0.6.0.plugin` (93 files); the report is `bundle-report-0.6.0.md`, same sections as 0.5.3's. Gone from the engine: `lib/claims.js`, the claims ledger role, its legal statuses and counsel sign-off, craft mode, the `legal` owner, the `claims_checking`, `ledger_status`, `paraphrase_review` and `craft_claims_for_review` report fields, the register's `cleared`; every lint report carries one `sourcing` line instead. Retired to `_archive/engine-0.5.3-retired/` (with a README naming the version and the ruling): web-copy, social-copy, customer-evidence, options-board, verify, squad-run, `workflows/squad-run.js`, `route_findings.js`, the route-plan reference. Kept with tests: the lints, `fit_check`, `slot_lint`, `tokens_build`, `preflight.py`, the register scripts, `resolve_brand.py`, `voice_lint.js`.
- The pack: `legal-ledger.json` moved to `_archive/brand-pack/` (git mv); eleven facts that lived only in it are in `products.json` `_meta.brand_facts` with their wording, source and status (observed or documented; what HLR still confirms), eight posture-only rows dropped and named; `brand-context.md`'s Claims regime is Sourcing, the File map has no ledger key, the claims-signer gap row is gone; every pack file that pointed at the ledger now points at `products.json` or the sourcing rule. `preflight.md`'s R7 guard reads the footer text from `products.json` and probes the three remaining lints; R14 reads no ledger topics.
- Checks: `bash build/checks.sh` PASS (guards PASS; pack mutation tests 17 mutants, 0 failures after one tag fix; engine tests 18 files, 0 failed; em dash scan 0 new, 17 known). REVIEW section 3 in the cloud: tests 18 files, 466 checks; descriptions all under 1024 (longest 1014); the paid spec scan clean; both plugins rebuilt to the shipped sha256 (hlr 07eac533..., engine 6fe859a4...), 0 runtime files; the resolution loop rc 1 with the pack path found and no traceback (the Mac path is not in the cloud). Checks 2, 3, 4 and 9 are Eddie's on the Mac. The grep test (`needs_legal|legal_ledger|legal-ledger|signer`) returns only the word "designer". Regenerating the demo and forge-proof outputs with 0.6.0 into scratch produced no em dash; the baseline is unchanged because those 0.5.x outputs were not regenerated in place.
- Lesson: `checks.sh` pipes the mutation tests through `tail -1`, so a mutation failure cannot fail the run on its own; the one failure this run (a tag citing "project rule 3" after the DECISIONS date, which the pointer check reads as a call) was found by running the script directly. Fix the pipeline in a later run. Also: the word "designer" matches the grep token `signer`; a release grep wants a word boundary before it.
- Cost: not measured (one runner session).
- Status: done, engine 0.6.0 built and checked, the pack and the records updated, the backlog items in review; waiting on Eddie, the fresh-context review of 0.6.0, the Mac checks 2 to 4, the install go, and a ruling on the eight engine defaults in the report's section 6 (the health-claim prohibited patterns 4 to 6 among them); waiting on Donnie, nothing new; next, re-own the `legal` gaps in the two existing briefs, regenerate or archive the 17 baseline outputs, fix the `checks.sh` pipeline, then the next backlog item.
## 2026-10-31: crew scaffold (crew/run.py, portable by construction)

- Built (backlog `crew-scaffold`, in a worktree branch for review): `crew/README.md`; `crew/run.py` (Python 3.9+, standard library only, the chat completions call through `urllib` with `response_format: json_object` and a text fallback, a built-in schema validator, `{{placeholder}}` and `{{include:}}` prompt rendering, the stop at the human pick, resume on `pick.json` or `--run-dir`, `--accept-edits` applying the editor's diff by JSON pointer); five co-workers (`intake`, `strategist`, `email`, `paid`, `editor`), each a `prompt.md` with Inputs and Outputs sections written from the voice contract and the route axes, plus a `schema.json`; `crew/checks/` (one file-reading CLI per stage plus `common.py`, which reads the File map's `prohibited_patterns` and parses `slotmap.yaml` as text for slot ownership, `max_chars` and case); `crew/fixtures/brief.md` (three products from `products.json`, every figure, date and code a merge token) with dry-run outputs for every stage; `crew/producers/README.md` (stub naming `klaviyo.py` and `figma_package.py`); `crew/tests/test_run.py`.
- Tests: `python3 -m unittest discover -s crew/tests`, 12 tests, OK. `run.py --brief crew/fixtures/brief.md --dry-run` exits 2 at the pick; with `--pick 1` exits 0 and writes every stage; the mutated-document checks fail as they should (a repeated axis, a slot over budget, a lower-case caps slot, an unknown product id, a typed price, a prohibited pattern).
- Skipped, and why: the engine's `brief_lint.js`, `copy_lint.js` and `paid_lint.js` read the Phase 1 shapes (the engine brief schema with channels and dates, the route plan, the email and paid slates with gates and grounding ids) and cannot read the crew's JSON; each wrapper prints a `SKIPPED` line with the reason and runs the crew-native checks instead. Backlog `crew-intake`, `crew-email` and `crew-paid` adapt the lints or the shapes. Meta character limits are not checked (no `placement-specs.json` until `paid-specs`); paid outputs carry `spec_confidence: unverified`.
- Deviations from the backlog's intent line, for Eddie to ratify or reverse: `run.py` uses `urllib`, not the `openai` package (one less install at handoff; the task asked for it); the environment is `CREW_BASE_URL`, `CREW_MODEL`, `CREW_API_KEY` with `XAI_*` read as fallbacks; the pointer skill files are left to the handoff item `claude-md`.
- Learned: prompts that quote merge tokens (`{{price}}`, `{{discount_code}}`) collide with a strict placeholder renderer, so an unknown placeholder now stays as written and the Inputs section is the contract for what renders. The `M02` hero's CTA is a composed `E01.label`, so the slot checker has to read each module's `composed:` line, not only its own slot list.
- Cost: not measured.
- Status: done, the scaffold built, tested and committed on the worktree branch; waiting on Eddie, the pull request review and the two deviations above; waiting on HLR, an xAI key for the live run (`portability-proof`); next, `legal-delete`, then `crew-intake` and `crew-strategist` on this scaffold.

## 2026-10-31: Phase 2 re-scope (Eddie's rulings)

- Ruled: the legal regime is deleted from the engine; product facts keep their sources; paid starts with Meta; portability targets the xAI API. Defaults taken on purpose, crew, paid formats, Klaviyo path and portability shape (DECISIONS 2026-10-31; proposal in the project doc `claude/phase-2-rescope.md`).
- The runner was paused by `build/KILL` while the backlog was rewritten (a settings-side pause was not available to this chat); the kill switch is off again with the Phase 2 backlog: 13 live items across Steps 6 to 10 and handoff, 8 waiting on a person, 7 Phase 1 items retired with their record kept.
- Inventory before the deletion: `lib/claims.js`, `brand-pack/legal-ledger.json` (10 topics), 16 needs_legal and 95 blocked references across the lints and templates; 71 prohibited_patterns references are voice and stay.
- Klaviyo's API creates HTML templates and assigns them to campaign messages; sends stay manual; flows are read-only. The xAI API is OpenAI-SDK compatible with function calling and server-side tools; Grok Build and the CLI are waitlisted, so the crew is built as files and CLIs with one orchestrator script.
- Cost: not measured (main chat).
- Status: done, the re-scope recorded, the backlog and map rewritten, the runner resumed; waiting on Eddie, a Klaviyo key and test list, an xAI key, the Meta specs, Review 2's outcome; waiting on Donnie, the protection email's calls, T02 and the picker; next, the runner's first Phase 2 run: legal-delete, then crew-scaffold.

## 2026-10-31: HLR Studio map and the build runner (Eddie's request)

- Built: the HLR Studio map (private artifact, four views: Studio, Runner, How it operates, Record), `build/` with RUNNER.md, backlog.json (15 items from PROGRESSION's open boxes, DECISIONS and the ai-firstify calls), checks.sh and the em dash scan, `.github/` with the pull request template and a checks workflow, and the hourly scheduled runner. The repo `ddrevolt/hlr-studio` carries the brand home's history.
- `bash build/checks.sh` passes in the cloud: guard tests PASS (20 host shape mutations, 18 board expectation mutations), 17 pack mutants with 0 failures, 28 engine test files with 0 failures, em dash scan 0 new and 17 known.
- Nothing in the record is dated after 2026-10-24, so Review 2 (Fri 2026-10-30) has no recorded outcome; the paid and web batches and the explainer wait on it in the backlog.
- The runner cannot reach the Mac: the census, the overlap scans, Figma reads and `board_drift.js` are listed as Eddie's at every release.
- Cost: not measured (main chat).
- Status: done, the map, the repo scaffolding and the runner; waiting on Eddie, Review 2's outcome, the ai-firstify calls, the paid specs; waiting on Donnie, the protection email's open calls, T02 and the picker photos; next, the runner's first run (eng-054 or eng-emdash, review-chat6b).

## 2026-10-24: ai-firstify audit of the forge (Eddie's request)

- Scores: agent architecture GREEN; structure, skills, scope, context, safety and workflow YELLOW; no RED (`outputs/ai-firstify/ai-firstify-report.md`, 11 calls). The drag is weight and drift, not design.
- The live Project instructions had drifted from the record: rule 4 still named Eddie after the Donnie sweep, and rule 8 (licenses) was gone with no DECISIONS line retiring it, while the `_setup/` copy still carried retired rule 6. A sweep of "every live record" should include both instruction copies.
- Rule 1's read is about 91KB (~23k tokens): the 2026-10-23 block alone is 72KB in 124 entries (median 513 bytes, 30 narrating builds). One heading per chat would hide earlier same-day rulings; a first-sentence cut keeps every ruling visible at under 25KB.
- 10 of the 11 HLR skill names collide with other installed plugins on Eddie's machine, and the listing showed 8 by name only. Description length is not the cause: the three shown have the same lengths.
- The guard suite passes on the uncommitted tree (gates 1 to 4, parity, 20 and 18 mutation cases).
- The device shell's home changed between calls in this chat, so scratch outside `mnt/` did not survive: unpack and use in one call.
- Cost: the fresh-context review used about 171k tokens (the subagent count); the main chat not measured.

## 2026-10-23: sunburst home campaign, concept round in Firefly (Eddie's request)

- A flat line drawing gives image-to-3D nothing to build depth from, and text alone gave needles or a spiky ball. The drawing as Firefly's reference, prompted to become a real object, gave dimensional stars. Counts drift: eight arms asked, nine common.
- Nano Banana 2 in Firefly runs one generation per click (a second click while it runs is dropped), about 20 seconds at 1K and 50 at 4K. Chain a master with Edit, Use as reference image. A prompt edit did not remove a single spike.
- The reference carries the material better than prompt text: editing the master's finish to the product's satin gold and swapping it in as the reference gave every scene the same gold.
- HLR today, for generated scenes: the HLR Editorial set (27:119) and the September and October posts are film, low-key, browns and forest greens; bright home scenes read as a catalog. Eddie's final look was simpler still: black onyx, short focus, soft directional light, a low white point.
- The Chrome extension dropped during a batch of about 130 seconds; one generation per batch held after that.
- Video stills: twenty 9:16 frames at 1K with one placement line (centered, a third of the frame, the reference's angle) held the object close enough to align in the edit; at 1K a generation takes about 20 seconds, and two per browser batch held.
- Cost: about 51 Firefly generations (31 at 1K, 20 at 4K); credits not measured; tokens not measured.

## 2026-10-23: the protection-of-energy email (Eddie's brief, intake to the 04 Staging build)

- The engine ran end to end on a request Eddie wrote: brief-intake, email-copy and the build in one session, every lint PASS (`outputs/step-5-forge/protection-of-energy/`). The brief lint failed once on its own references: naming HLR's send series "Energy Medicine" tripped HLR-H01, because references are linted like copy. Name a send by its node or its eyebrow instead.
- Layer names on the originals page do not describe their images: the "altar kit" layers hold moss, swimmers, quartz on linen and roses, and the "magnific" layers hold packshots. Look at an image by its hash (a temporary FIT rectangle, screenshot, delete) before using it.
- The proxy refuses highlightrituals.com, cdn.shopify.com and Figma's MCP asset URLs from both the cloud and the Mac shell, so a site product image cannot be fetched and a screenshot cannot be downloaded. A packshot that is not already in the file needs Eddie to paste it. The tool-result copy of a base64 screenshot is the way to keep a preview.
- `figma.createImage` on `exportAsync` bytes works through the connector: a composed frame (the Zodiac Set, 27:289) flattens to one image fill in the same file.
- Flex probes prove length, not word width: at the email headline size M03.name breaks a word over about eight letters (Tourmaline, Protection). Long stone names go to M06 and E06 (title style) or wait for a hand setting.
- Module instances report their master's explicit email mode as their own (`explicitVariableModes`), so canvas_check warns once per module instance (element-sets-canvas). That is expected for nested masters, and it answers the recipe's open question on how instances report a main component's mode. G1 did not show: E02's rule stroke resolved to email here. The variable plan canvas_check needs is not in the pack; it was rebuilt in a scratch copy with `tokens_build.js figma-plan`.
- Eddie edited the frame live while it was being built (a sentence cut, the script line on, the frame moved). Only the re-read before the last screenshot caught it: re-read a frame before any close-out claim, and keep a live edit.
- Cost not measured.

## 2026-10-23: Chat 6b at Review 1 (the Donnie sweep, the registry, the staging comparison, the 2026 sends as the email system)

- Figma's image URLs (screenshots and fills) return 403 from both the cloud and the Mac shells, and clientStorage is unsupported, so nothing crosses files but a paste. A pasted send is flattened in the file: clone it into a clipping frame, exportAsync at 1200 wide in slices under 4096 px (createImage's limit), createImage, one rectangle per slice.
- Figma's description setter turns straight quotes and apostrophes into HTML entities; write descriptions with ’ and “ ”.
- combineAsVariants changes property keys but keeps instance overrides; a cloned variant loses its componentPropertyReferences, so relink them by walking the tree. A whole-range setRangeBoundVariable detaches the text style, so bind family, size and style together.
- A FILL child in a HUG parent collapses, wrap and grid included: bottom-aligned card links came from link rows instead. A nested instance's size cannot be overridden from an instance, so a size is a variant (M12 Size=Tall).
- Measure the sends, not one send. One tally across 15 sends (face, size at 1200, leading and tracking per role) showed which values are HLR's system and which belong to one send (2:563's italic link).
- Figma holds a face per canvas (string variable modes) and a leading or tracking per canvas (pixels per mode); the engine's grammar holds neither (G11). Log the gap the moment the library leads the engine, or the next sync quietly undoes the ruling.
- A token change has three surfaces beyond its variable: the web exports, the board lines that print it, and the slot budgets. The Type board's email lines and `tokens.flat.json` kept the old sizes for hours because no guard reads the spec lines and nothing re-exported. Re-export and re-probe in the same step; a spec-line check belongs in `board_drift.js`.
- The Mac relay dropped twice mid-edit: check whether an edit landed before applying it again.
- Check a send's design width before reading its sizes. HLR's 2026 sends were designed at 700 (4) and at 1200 (13), and a scale taken from one 700-wide send (2:9) set every 1200-wide rebuild about a quarter too large until T01 showed it. Tally by design width first.
- Read a layout request literally: “the eyebrow should be top aligned” meant the eyebrow alone, not its column. When a request names one element, change that element.
- A photo's file name is not its SKU. Of the 97 cleared photos, 23 match a products.json name well enough to offer in a picker; the rest stay out until someone who knows the line names them, since a wrong name ships one product's photo under another's (G10).
- A colour that reads black may be the brand's darkest colour: 2:563's “black” copy is Forest #17280a. Measure the fill before naming it, and offer what the sends use beside what was asked.
- Cost: not measured precisely; the chat ran long (one compaction) because Review 1 ran live through it.

## 2026-10-23: Chat 6, batch 2 (the decision sheet, the roster, the star, the templates and flows, the guards)

- A tool layer between Claude and the files decodes `\u` escapes: written through the Write tool or pasted into use_figma, an escaped U+2028 inside a JS regex literal becomes the real character and a syntax error, and escapes in Python source turn into literal characters. Build such characters from char codes (`String.fromCharCode`, `chr`), write files that need escapes from a script, and grep each written file for non-ASCII.
- A page guard rerun only where a fix landed misses the rest: the R8 node guard found M21's four unbound labels only when rerun on all of 02 Modules, and round 2 found r8 and the entity scan left off 01 Elements. Seen twice, it became one script: `close_checks.js`, generated from the page guards, runs every page guard on every library page in one call.
- A guard that looks for masters at a page's top level finds none when they sit inside a board, and passes empty: the first lint of 01 Elements returned 0 roots and 0 fails. Give every page guard a floor (the slot map's set count) so it fails when it finds fewer.
- A rule and its twin in another language agree by construction only when both normalise the same input before matching (every space one plain space) and both test words and case the same way (ASCII); a seeded fuzz in the parity test keeps it so.
- A register is data: reading its Status and Closes at columns found 20 stale rows in the 02:31 pack that phrase patterns had passed. Read it fully, though: a word list for open states and step names missed "to be confirmed", "awaiting", "Gate four" and "G4", and a quoted plan line that matched nothing passed silently (BR1-06, BR1-07).
- A rules table typed by hand drifts from the data it guards: E09's merge-token rule never reached host_shape_check's list. Check that every ruled slot note has an entry, so a new rule cannot go unchecked (BR1-08).
- A test harness reads the guard's own verdict, never its exit code alone: a crash exits 1 like a FAIL and reads as a catch.
- Board text that paraphrases the pack can be checked where it carries data (values, aliases, tags, dates, names); a format kept identical across cells (`HEX, alias of PATH`) is what lets a guard read every cell in full.
- A source frame's children and a screenshot of the frame node miss the layers drawn over it later in its section: T09's two "gaps" held two features and a heading, T16's an image (BR1-02). Read the section's order and screenshot the section, then list the source block by block against the template; that list also finds a CTA dropped without a record (BR1-04).
- Map a source CTA by its fill and its stroke, not by the word white: a white box with an ink stroke on a pale band is the outline box with a white fill (BR1-03).
- Placed marks are assets: exempt them from the structure lint by their main component, not their layer name. Renaming E15's inner instance to Marks/Star took it out of a name list, and the element itself needed auto-layout with the star filling it, so a placement scales the star and the lint reads a container (BR2-01).
- A package written before its review must not say the review passed; its review line is written from the review files at close (BR1-09). Tick a PROGRESSION box after the round that checks the work, not before it.
- Figma descriptions are records too: retiring the star's placeholder reached the pack's files and missed M09's and M10's component descriptions, which a grep of the pack cannot see (BR3-02). A state change goes through every description that states it.
- Another chat wrote to the Mac brand home mid-session (the explainer: a DECISIONS line, a PROGRESSION box, a LEARNINGS entry, its own folders and a re-rendered demo intake). Before a sync, read git status on the Mac, merge the shared record files line by line, push only this chat's files, and leave the other chat's work for it to commit. A PNG that differs by md5 can be the same image re-encoded by the bridge: compare pixels before pushing it.
- Decision ownership moved mid-close (Eddie: "Donnie owns everything"). The instruction named the strictness map, so that changed at once; the sweep of every other record that names Eddie as owner or confirmer (several hundred mentions, history to keep) is the next chat's first task, written into its prompt, rather than a half-done sweep at the end of a compacted chat.
- The chat compacted several times; the fix lists survived because they lived in files (the review files, the DECISIONS lines, a fix ledger) and not only in the transcript.
- Cost: the batch 2 review round 1 was not recorded before a compaction; round 2 used 536,426 tokens and 114 tool calls over about 35 minutes; round 3 446,616 tokens and 91 tool calls over about 30 minutes.

## 2026-10-23: review workbook, explainer build

- The device commit tool resends the first upload made from a staged path: a file overwritten at the same container path reached the Mac in its old version while the tool reported it written. Stage each new version under a fresh path and compare hashes after every commit.
- Figma screenshot URLs stay unreachable from both shells (403). For HLR's own type and marks, render from HLR's files on the Mac (Pillow is there), which also shows the real faces.
- census.py reads a bundled page whole, so library code and embedded images produce hits (a two-letter term inside React's minified names, key-shaped tokens inside base64). Adjudicate by where each hit sits, and keep the guard on our own words: a naive string-literal scan of a minified bundle desyncs on backticks and regex literals.
- Every fact on the workbook passed the verbatim check on the first run because each was copied by script from files read in the same session, never typed from memory.
- A typed escape for the em dash can land as the real character, in our files and in a reviewer's (REVIEW.md R12): scan every written file for U+2014 after writing it.
- Parcel resolves Radix's subpath imports only with `"@parcel/resolver-default": {"packageExports": true}` in package.json.
- Cost: explainer review round 1, 497,577 subagent tokens; round 2, 426,126. The workbook build: not measured.

## 2026-10-23: explainer plan

- The demo run's files map one to one onto the journey's stages (ask, intake, route pick, copy, build), so an explainer can teach from the run's own evidence instead of examples written for it.
- The record's ids (M15, R3-01, Gate 2 call 1 b, lane H) are the main barrier for a reader outside the build; a page for HLR leads with names and keeps the ids behind a toggle.
- A demo file can disagree with its own lint: `made-to-order-pendants.intake.md` reads FAIL while `brief-lint.json` reads PASS after G7's workaround. Read the JSON verdict, not the rendered header, and re-render after a workaround.
- `_setup/` names other brands and `.gitignore` keeps it out of the repo; nothing written for HLR may quote it.
- Claude Design's facts here come from Anthropic's announcement of 2026-04-17, when it was a research preview; date them and re-check at each use.

## 2026-10-23: overnight run (Gate 2 closed, Chat 5 Foundations, Gate 4 under delegation, Chat 6 email batch)

- An instance carries its main component's explicit canvas mode as its own: M02 placed in T02 reads back `explicitVariableModes` email (19:1), the same as its master. So a module master pins its canvas for every placement, and an element must stay on Auto to follow the frame it sits in.
- Figma's server screenshots render Instrument Serif Italic in a fallback sans, even on a plain, unbound text node (tested with a throwaway node on 04 Staging). Judge the accent face in the Figma app; a screenshot only proves layout.
- Screenshot URLs are refused by this session's egress proxy; `enableBase64Response: true` returns the image inline and also saves the PNG under the session's tool results, which is the copy to reuse.
- Context compaction drops earlier tool results from the transcript, so the M11 to M21 probe results had to be re-run. Write every probe or inventory result to a file in the same turn it returns.
- The Plugin API refuses a `maxWidth` override on an instance sublayer, so a column that must narrow for its copy is fixed in the master (M12's image to 440 x 550), never per placement.
- Component descriptions written earlier came back holding `&quot;` and `&#39;` as text. Write typographic quotes and read every description back after writing it.
- A probe that sets `characters` loses range-bound variables and list formatting; snapshot each range's `fontStyle` binding and list type before the probe and re-bind and read them back after (engine gap G4).
- `fit_check.js` needs a `cuts` array even when nothing was cut; recording each mapped string unchanged (cut equals composed) lets it confirm every budget and keeps the compose, map, cut, lint order auditable.
- The brief lint reads guidance notes for ledger lemmas: a note that names a banned word ("handmade") trips HLR-O01. State the rule without the word.
- `copy_lint.js` reads "four starting points" as the spelled quantity "four star" (a ratings pattern); reword rather than argue with a regex.
- A photo is reframed for a slot with crop mode: `imageTransform` [[1, 0, 0], [0, h, y]] shows the full width and a window of height h starting at y, as fractions of the image; the demo hero moved its window up 8 percent so the pendant hangs below the CTA.
- The optional scrim is a judgement on the real photo: on 27:137 it buried the subject, and the dark ground already carried white type.
- The engine's report text (one-pager, findings, lint) carries em dashes, and Eddie's 2026-10-18 ruling exempts engine text; the chat first rewrote them, then restored the reports as the engine wrote them. Re-read REVIEW.md's house rules before changing machine output.
- A text style id ends in a comma ("S:...,"); `setTextStyleIdAsync` with the id minus the comma detaches the style without an error. Take the id from `getLocalTextStylesAsync()` by name and read the style back after setting it.
- A frame made by script clips its content by default; set `clipsContent = false` on a wrapper unless clipping is the design, or the flex probe fails a label the column could carry.
- Structure lint rule 3 (no fixed height) must allow a column that stretches to its row: `FILL` vertical inside a horizontal auto-layout parent that hugs. The check library exempts that case now.
- The Write tool turned a typed escape for U+2014 into the character itself inside two scripts, and an assert caught it. Build the character with `chr(0x2014)` or `String.fromCharCode(0x2014)` in any script that tests for it.
- A crop alone could not clear the hero's CTA: the photo's subject sat where the CTA sits. A module option that adds room under the CTA (Space below) solved it, and the crop window then places the subject in that room.
- C8's CTA label (35 px) runs wider than the sources' (26 px), so a split that holds the CTA in its text column needs a narrower image than its source (M12 at 440; M11 at 400 with its own 16-character CTA slot) for the label to prove 2x.
- Round 1 of the fresh-context review found a blocker in a batch that had passed every scripted check: module roots bound to the wrong semantic ground, which no lint reads. The review now checks that every module root binds the email page ground.
- `absoluteRenderBounds` is cropped by a clipping ancestor: a label clipped by its column reports ink that stops at the column's edge. Test clipping on the text's box; use ink only for collisions and a fixed box's overflow.
- A probe that grows every slot at once can hide a collision: a long body pushed M11's long CTA below the image it would hit beside a short body. Grow each slot alone as well.
- A fix verified by a probe alone can ship a defect the probe cannot see: round 1's M11 rebuild passed the flex probe while its body ran through the CTA. Screenshot every module a fix touches.
- A fix to an element's placeholder does not reach a host's placed instances that override it (M15's six cards kept "Product name"). Fix the hosts in the same pass.
- A record kept in two places drifts: the strictness map file took round 1's change and its board did not. Diff the board against the file at each close.
- Plugin data set on an instance's sublayer inside a master (M11's E01 label) reads back on that master while the main component keeps its own stamp, so a host can re-stamp a composed slot with its own budget.
- Cost: the round 1 review subagent used 385,427 tokens and 79 tool calls over about 20 minutes, round 2 356,630 tokens and 86 tool calls over about 23 minutes, round 3 389,346 tokens and 67 tool calls over about 27 minutes, the Foundations review 377,617 tokens and 73 tool calls over about 20 minutes, its round 2 420,173 tokens and 91 tool calls over about 29 minutes, its round 3 442,414 tokens and 105 tool calls over about 31 minutes; the rest of the run was not measured.
- A phrase rule for promises is a heuristic: round 3 broke the closed-gate rule 20 ways in 22 lines. Where a promise lives in a table (a register’s step column), check the structure, not the prose.
- Review rounds on guard code cost as much as rounds on the deliverable (Foundations: about 1.24M tokens over three rounds) and keep finding near variants. Build a guard for the class a round names, record its known limits in the R row, and stop.
- The bridge to the Mac dropped at about 06:46 UTC, before the night’s last sync, so three review rounds of records waited in the session: sync and commit at each round’s close, not once at the end.
- The real faces barely moved the budgets: one slot of 100 changed, and it grew, because Trade Gothic sets narrower than Inter and every module hugs its copy. Building on stand-ins while the faces could not load was sound.
- Fonts loaded to the team Figma become loadable on the build path at once: check `listAvailableFontsAsync` before treating a face as desktop-only.
- A second `device_commit_files` of the same staged path can resend the first upload, and PNGs arrive re-encoded: stage a changed file under a new name and compare md5 sums on the Mac after every commit.
- An inline `//` comment pasted into a one-line function swallowed the rest of `scrolls()` in `checklib.js`: write comments on their own lines (or as `/* */` in a one-liner) and parse a probe library before a run.
- A scan beats a list: round 2 named six pack lines still promising Gate 4’s work, and the scan built for them found five more. Fix a class with a scan, then let the scan find the instances.
- A guard that hashes a prefix, a first tag word or only a pair’s names cannot see a change past what it hashes (F2-02: an exemplar changed after character 40, a ratio or a role, "[derived], ratified"). Hash the whole of what the board shows, and keep the cases that must fail beside the guard (`guards/tests/run_all.sh`).
- A token description edit is a Figma edit too: the engine’s figma-plan is the source of the variables’s descriptions, so 19:5 and 19:44 changed in the same release as tokens.json.
- The Plugin API's description setter stores a straight apostrophe, a straight double quote and an ampersand as HTML entities (`&#39;`, `&quot;`, `&amp;`) on text styles, variables and components alike. Write descriptions with typographic quotes and no ampersand, and keep the source text (tokens.json) in the same characters so the two still compare equal.
- A wrap grid sums wider than its frame, so a scroller test that sums child widths reads it as a scroller and turns the clip check off inside it: check `layoutWrap` first.
- A probe's filler words bound what it proves: with no word over 7 letters, nothing tested a stone name wider than a 320 card (Phosphosiderite breaks inside the word). Test the longest real value of a name slot as well.
- Boards drift from the pack after a gate closes: Foundations' five boards still said what Gate 4 would do after it had done it. A guard that hashes what the pack says and checks every board cell is cheap once written (`board_drift.js`).
- Each fresh-context review cost about 360K to 390K tokens however tight the brief's aim (150K): briefs should cap the work by scope (what to verify) rather than by a token number the reviewer cannot see.

## 2026-10-21: lane H, engine 0.5.3

- Tests written against the real pack's shape first made the pack the oracle: on lane B's canvas-mode `tokens.json` the plan came out at the token proposal's forecast to the count (Primitives 17, Semantic 10, Component 16, Layout 45, 15 styles, 14 not planned) on the first run of the new code.
- Moving a tier onto modes moves everything that sits in it. Family and style variables live in Layout, so canvas modes turned the stand-in switch from 8 values into 24, and the build's leave-it rule into a per-mode rule; round 1 found it, not the six-item spec. Before putting modes on a collection, list every variable it holds and what each one's per-mode value means.
- A check that reads each value in the mode its own node resolves to proves nothing about the frame's mode. Compare every node with the mode the frame is meant to have, so a pin the inventory cannot see as an override still shows as a node off its canvas.
- A recipe kept in markdown can be tested: the canvas tests cut the js block out of figma-recipes.md and run it on a mock of the Plugin API surface it touches, so the recipe and the script that reads its output cannot drift apart unseen.
- A fix tested on the shape the recipe builds can miss the shape the finding names: R2-02's fix covered the recipe's own placeholder frame, and round 3 found the same failure on an `E##` placeholder element and on the agent package's rectangle. Test the inputs a finding names, in the shapes the next step will build.
- Round 3 read a build whose Mac battery had not run, so its one blocker was a check nobody had run yet; then the Mac dropped off the bridge after a container restart and held the close. Run the battery on each build before its review round, so the round reads that build's log. A container restart stopped round 2 mid-run; messaging the same reviewer resumed it with its context.
- The file tools turned a typed backslash-u escape into the em dash itself in a new test file (lane C and lane F saw the same); the byte grep over the added lines caught it. Build such characters with String.fromCharCode.
- An input landed mid-lane again: lane E wrote `brand-context.md` while the release was in its checks, so resolution moved from rc 1 to rc 0 and the bundle note's pack-state line went stale (round 1, R1-04). Read each check's lines against the pack as it is at the final build, not against the last release's expected values. And lane C's Gate 2 rulings routed an engine gap to 0.5.3 after round 3 had read the final build; the DECISIONS re-read before the handover caught it, and it moved to 0.5.4.
- The Plugin API reference names `renameMode`, `addMode` and `resolvedVariableModes` but says nothing of what a new mode copies or whether an instance reports its main component's explicit mode: the plan states every mode's value, and the check is built to hold under either answer.
- Cost: the three review subagents 0.42M, 0.51M and 0.49M tokens (1.42M); main chat not measured; no Figma calls.

## 2026-10-21: lane C, Gate 2 rulings applied

- A ruling can fall between the options offered: Eddie answered calls 4 and 5 with "no strong flag" and "flag, no sign-off", which neither option carried. The engine has no flag-only severity; info with `paraphrase_risk` is its one non-blocking path, and it flags by count, not by line. Offer that posture as an option the next time a claims row goes to a gate.
- Lane E packaged lane C's calls as items 11 to 18 while Eddie ruled them here by lane C's numbers. Cite both numbers in the record, or the two lists drift.
- Cost: not measured; no subagents; no Figma calls.

## 2026-10-20: restart triage and git checkpoint

- The lane protocol patches the records but never commits: the 2026-10-18 lanes sat untracked for two days until this checkpoint. Commit at each gate from one chat while no lane writes.
- Leaked files leave history cheaply while the repo has no remote: filter-branch with an index filter on the paths, drop refs/original, expire the reflog, gc with prune now, then ask git for the old blob ids. Commits before the first one that held the files keep their ids.
- The Cowork shell needs delete permission for any git write (lock files, the rewrite's temp folder, gc).
- Gap: no census ran over the rewritten history; access to `claude-cowork/_tools/release-checks/` was declined in this chat. Owner: Eddie.
- Cost: not measured.

## 2026-10-18: lane C, Pack v0 words side

- The device shell turns a typed backslash-u escape into the character itself: a `\u2028` in a command broke a JS regex, and the em dash escape in a notes template became an em dash that only the byte grep caught. Build such characters in code (`chr`, `String.fromCharCode`) and grep for the UTF-8 bytes after every write; lane F saw the same in the file tools.
- The playbook's ledger statuses are not all engine words: `lib/claims.js` knows needs_legal, prohibited, conditional (needs_edit) and approved (info), and anything else compiles as conditional. Write the engine's words.
- Required language is checked inside the same string as the claim, so a footer disclaimer cannot be a claim row's `required_language`, and the disclaimer's own words ("treat", "diagnose", "medical treatment", "energy work") must stay out of every trigger, or the required text fails the lints. Run the required text against every rule.
- Lexical triggers miss the claim forms the work uses: reading 519 candidates found 13 uncaught forms ("designed to protect", "helps you feel", "energy-charged", "earth-conscious" among them), which became triggers, and an identity row. Read the corpus before trusting a trigger list, and mark what stays loose `paraphrase_risk`.
- Most visible copy is not voice: of about 3,100 distinct strings, the automatic filters left about 1,350 and the read kept 159. Product names, labels, offers, claims and planning layers dominate; the Website page is almost all interface (8 of 160 kept).
- Captions sit in loose layers labelled "Caption" beside the posts: strip the label and record the strip. Only the posted grid tells a cover from a panel; the corpus keeps no frame order inside a board.
- An input can land mid-lane: lane A's web TSV arrived and Gate 2 call 1 b moved the paid and web rosters while lane C ran. Re-run the opening scan before closing.
- Cost: main chat not measured; no subagents; no Figma calls.

## 2026-10-18: lane A, web re-cut

- Escaping at the source and hashing in Figma before each chunk is saved removed the repair: all 1,398 web rows matched on the first read. Cost about 0.34M tokens over 51 tool calls and 30 minutes (about 245 tokens per text node, method reading included) against a 0.25M target.
- Web comps strain a fixed-canvas visibility model. A homepage comp passed the board size test, so its clipping was not applied to its children (8 rows count as visible that the canvas hides); comps cut to a viewport send below-the-fold copy off frame; 43% of web text sits in component instances, and desktop and mobile comps repeat the same lines.
- The website comps carry one block of template copy about picture framing, repeated above 39 desktop comps (312 rows), all clipped off frame.

## 2026-10-18: lane H, engine 0.5.2

- Build against the real pack before the first review. Lane H's first grammar (its own ground-mode list, stand-ins as objects, explicit style links only) met lane B's draft with 20 findings; adopting lane B's grammar and reading the text style roster left 2, both real (the accent styles' family links).
- A probe from a brand review carries the brand into the engine. Round-1 probes, copied in as tests, held an HLR palette name and hex, HLR's scrim value and "owner HLR"; the reverse census on the next build caught them. Give a probe fictional values before it becomes an engine test.
- A probe's letter can outlive its finding. Three round-1 probes (P01, P03, P18) still fail on their criteria after the failure they guard is gone, because the fix took another mechanism; round 2 judged them on the failure scenario, and they stay as evidence, unedited.
- Second sightings come back at the seams: round 2 found round 1's classes again through new paths (a way forward that leaves text blocked, a parser that drops input without a word, unchecked text counted toward exit 0). Each now has a test, per REVIEW's seen-twice rule.
- The connector cannot load faces installed on the Mac: two read-only calls on three type-specimen nodes in the reference copy (nothing written) found Saol Display and Trade Gothic LT Std unloadable and flagged missing. Path 1's stand-ins rest on that, and `face_check.js` names what cannot be edited.
- Three rounds leave the residue at the edges of the last fix: round 3's two should-fix items were round 2's restore fix met with the accent word first, and the same accent built by the second driver (the native agent). A fix to text styling needs every position and every driver checked, not only the case the finding named.
- Stage every build under a new path before committing it to the Mac and check its sha256 there: a repeated staged path resent the previous build once (lane F saw the same).
- The shared YAML parser throws on a sequence item whose keys sit two spaces past the dash (the common YAML layout); it is loud, so Pack v0's files avoid it, but a hand-written file will hit it.
- Cost: review subagents 0.38M and 0.42M tokens (round 1), 0.40M (round 2), 0.34M (round 3); main chat not measured; Figma: 2 read-only calls, no writes.

## 2026-10-18: lane F, REVIEW.md

- Run each check once on real data before writing it down. The first provenance scan called a token derived if any of its tags was, and counted 68 against lane B's 67 (two tokens carry two tags); it now counts by first tag and lists the two-tag tokens. Every command block in REVIEW.md ran as written on 0.5.1 and on lane B's `tokens.json`, and the rebuild reproduced both shipped 0.5.1 sha256s.
- Rules that send a reviewer to the author's transcript contradict their own brief. Round 1's one blocker was exactly that (rules 1, 5 and 10 were checked against the transcript, which the brief forbids), plus checks a cloud reviewer cannot run. Now the author runs the Cowork-shell commands and hands over their output, and the reviewer says which checks only the author ran.
- The census term list rebuilt today has 331 terms against 0.5.1's 327, and all four new ones are junk: `build_terms.py` takes `com` from other packs' `extensions_namespace:` lines and three `{font.family.*}` alias values as font families. They hit HLR's own files 269 times. Read a rebuilt list's new terms before a census. Fixed the same day with a test, on Eddie's ruling.
- A common word can be a census term: REVIEW.md's draft hit one twice through an ordinary verb. Census your own prose before it lands in the brand home.
- A written escape does not survive the file tools: a typed escape for the em dash became the character, and only the grep caught it. Name a character by its code point in prose, and grep for its UTF-8 bytes, which works in any locale (`grep -P` with a code point fails in the cloud shell's C locale).
- Reusing a staged file name for a commit to the Mac can resend the previous version: one commit wrote the old file (same size, old sha). Stage each version under a new name and check the sha after every commit.
- `get_variable_defs` and `get_metadata` cannot list a library's collections, variables or styles, and no connector reads a file's version history: a read-only `use_figma` script lists them, and Eddie reads the history in the app.
- The claude.ai project instructions skip rule 6 (the brand-free engine); the copy in `_setup/` has it.
- Two clocks date the record: the Cowork shell's `date` is UTC, so this evening's lanes are dated 2026-10-18 while Eddie's local date is 2026-10-17.
- Findings, three fresh-context rounds, kept in the session (lane F's write scope is REVIEW.md): round 1, 1 blocker, 13 should-fix and 16 notes; round 2, 3 should-fix and 5 notes; round 3, 4 notes. Every blocker and should-fix was fixed and its check rerun. Two notes were left by choice: the scans stay inline until they are files in `_tools/` (lane H), and section 7 stays because ten rules point into it.
- Eddie ruled all seven calls in one reply. Rule 6 was missing from the claude.ai instructions on purpose: the tool is HLR's own. A gap between two copies of the rules can be a decision, so ask before restoring it.
- A house rule needs a lint, not only a grep: the copy lints let em dashes through (`copy_lint.js` warns only on an unspaced one; the others never check). One fragment in the pack's `prohibited_patterns` closes it for every lint.
- The tag grammar drifts in use: `[derived, ruled]` and `[observed, <note>]` appeared in `tokens.json` within hours, and a strict scan read them as untagged. Scans read the first word; the grammar wants a DECISIONS line.
- The rulings round's review found 1 blocker (a paid-only ruling written as a gate on every platform), 3 should-fix and 5 notes; each fix used the reviewer's own wording, so no second round ran.
- Cost: review subagents 0.27M, 0.22M, 0.16M and 0.23M tokens (0.88M); main chat not measured; no Figma calls.

## 2026-10-18: lane D, Pack v0 structure side

- A slot map's roles are wiring, not labels. `paid_lint.js` maps a slate's `on_image` only to a slot whose role is `hook` or `title`; a map with `headline` roles passes every on-image line unchecked. Run a planned map through every lint that reads it, with a synthetic slate, before calling it done.
- An unmeasured slot (null budget) reads three ways: `copy_lint.js` reports INSUFFICIENT-INPUT, `social_lint.js` asks for a sign-off, and `page_lint.js` and `paid_lint.js` skip it silently (`paid_lint.js` even reports "checked against measured ceilings"). Until the engine changes, web and paid copy is unchecked for length: read the slot statuses, not the verdict.
- `_meta` is the only top-level key `sku_lookup.js` and `brief_lint.js` skip in a product database; any other key becomes a SKU. Only `description`, `badges` and `nutrition` license figures, so observed prices kept elsewhere in a record license none.
- The public catalog is product-level and cannot key a database by SKU: it keeps one example SKU per product, and 101 of 650 variants carry none. The Shopify products export is what unlocks SKUs, descriptions and confirmed prices.
- Parallel lanes can answer one question two ways from two sources: lane B drew the C6 CTA on Google art (from the CTA ruling), lane D left Google art without copy (from Google's guidance). Read sibling lanes' new files before closing and flag the conflict for the gate; neither lane edits the other's file.
- Platform numbers stay in the engine; the pack records the brand's policy (which zone governs, where the sign-off sits) and points at the engine file. A copied number becomes a second source that drifts when the platform moves.
- Write an option's consequence against the engine path for every channel it names. Call 1 b promised paid and web a fallback to the engine's generic roster; paid has one (`ad-type-data.json`), web has none (an empty section library that web-copy refuses), so web copy waits for Review 2.
- Check what the engine does before an option's tradeoff rests on what its docs say. Call 2 said the lints enforce case, as the slot contract says; in 0.5.1 the social and web lints never read case and nothing checks sentence case.
- A partial ratification cannot sit in one `_status`: the engine reads `channels.paid` and never a status, so the held paid and web rosters moved to a key it skips, and their slot maps stay unwired until Review 2.
- Once a case rule is law, one slot cannot carry two roles: P07's item line held a sentence-case gloss on the card and a caps intention on the list, so it split in two.
- Rulings land in other lanes' files: four of the seven changed 12 lines in lane B's closed files. Name the files each call changes when packaging a gate, so one go covers them.
- Cost: not measured.

## 2026-10-18: lane B, Pack v0 design side

- Rulings can collide only in their cross-product. Call 7 (one roster by role and size), call 4 (one Layout mode) and C8 with the floors (three canvas scales) cannot all hold, and it showed only when the roster was written out. Write the roster before ruling the collections.
- A stand-in maps families, not styles. Instrument Serif has Regular and Italic, so Saol's Light, Light Italic, Regular Italic and Medium have no match: `fonts.build_stand_ins` needs a style map before Chat 5 builds text styles (token proposal question 2).
- `tokens_build.js export` keys Tailwind on one segment under `space`, `radius` and `breakpoint` and one under `font.size`; deeper names overwrite each other in `tailwind.tokens.js` without a warning. Keep those names flat.
- `check` grades only the roles a pair lists, so a failing pair recorded with empty roles and a `restriction` keeps the law on file without failing the run.
- A 50 percent black scrim gives white text 3.95:1 over a white area of a photo: display only. Body needs 55 percent (4.74:1).
- The 2022 archive marks carry #faf8f2, #1f2918 and #baada3, not the book's own hexes. Read fills from every file before trusting a palette.
- The monogram's vector was on disk under two names. Hashing path data across the marks folder found it, and a contact sheet of PNGs beside rendered SVGs (cairosvg in the cloud workspace) settled it in two staging calls.
- `pdftotext -layout` on the Mac reads the book's palette and type pages exactly (CMYK, PMS, hex, sizes, tracking): cheaper than page renders for text facts.
- No step or lane owns the strictness map, though the playbook puts it before any module and the Foundations board expects it.
- Run the next engine build against the pack before a lane closes. 0.5.2 `figma-plan` stopped on three lane B tokens: a malformed tag another chat wrote, and two style tokens no text style uses, so the plan could not pick their stand-in. Each was a one-line fix.
- A tag is exactly [documented], [observed] or [derived]. "[derived, ruled]" reads as untagged; a ratified value flips to [documented] with "(ratified <date> by <name>)".
- A worst-case contrast test for copy on a photo certifies a case nobody designs and asks for an overlay the brand does not use; with every image a placeholder, nothing real can be tested at build anyway. Put the rule where the build's check reads (a recorded entry in contrast-pairs), so the check reports instead of blocking.
- Figma binds a number variable to line height and letter spacing only as pixels (Figma forum, 2024 and 2025, community answers). Percent set on the style, unbound, follows the size, across modes too.
- Figma's mode cap per collection is no longer 4: a pinned forum reply gives Pro 10 and Org 20 (its date and staff status not shown). HLR's 4 ground modes and 3 canvas modes fit even the old cap.
- Merging per-canvas tokens into one moded token merges their provenance: the token takes its weakest tag (`font.size.label`: web ratified, social derived, so [derived]), and its description carries each canvas's state.
- A pack change can run ahead of the engine: the canvas modes pass the installed 0.5.1 and stop every 0.5.2 command. Check which release a grammar change needs, and put that release on the plan in the same step.
- 0.5.2's `check` counts mode-grammar findings in its contrast total ("10 contrast finding(s)" with every colour pair passing). Read the lines, not the count.
- A shared closing line ("Cost: ... no Figma calls") is no anchor: lane C's entry carries the same one. Anchor a patch on the entry's own heading.
- Cost: main chat not measured; no subagents; no Figma calls.

## 2026-10-18: lane A, corpus re-cut (email, organic social, paid)

- Copying text through model context changes invisible characters, and a length check cannot see it: 188 strings came back with soft line breaks (U+2028) as newlines and no-break spaces as spaces, and the lane's own method notes lost two written escapes the same way. Check a copy against hashes taken inside Figma by a read-only call, and escape non-ASCII text in tool output.
- A verbatim round trip costs about 155 tokens per text node: plan a walk from the node count. Lane A ran 204 tool calls over 3.4 hours (the harness counts 0.23M subagent tokens; the lane's own estimate is about 1.8M against a 0.4M target, 0.4M of it on the repair). It stopped at budget in the brief's order, so email, social and paid are whole and web and the other pages wait.
- Chat 1's lists held only the direct children of each first-level section (527 email, 1,288 social, 723 paid entries); the recursive walk finds 428, 1,670 and 1,112 frames.
- Step 1b counted 486 paid frames in 13 boards; the walk finds 514 in 16 (the 38 in nested sections agree). Board detection is a size heuristic, and an independent count of text nodes equals the rows on every page, so the text is complete whichever split is right.
- The connector cannot read image transparency: 296 rows under images count as buried and may show through a cut-out PNG. A few screenshots would settle it.
- The social corpus has the handle misspelled as @HIGHTLIGHTRITUALS in 48 rows against 391 spelled right: a candidate check for the social lint or the prohibited patterns.
- A cloud subagent keeps running whether or not the Mac is awake; only the copy into the brand home needs the Mac.

## 2026-10-17: Chat 3 prompt, a second Step 1b pass, Gate 1 closed

- The Chat 3 prompt arrived before the pattern review existed (its precondition line was added after the paste). On Eddie's go this chat ran Step 1b while the Chat 2 chat was running it: two full passes, about 2.07M subagent tokens here against 2.06M there, and about 180 Figma calls here. Before redirecting a chat to an earlier step, look for another live chat on that step: `git status`, new untracked outputs, record mtimes.
- This seat's Figma connector allows 10 calls a minute and 200 a day (a refusal said so). A budget sent to running subagents reached them after 28 to 59 calls each: the call budget belongs in the first brief.
- get_screenshot with enableBase64Response also saves the PNG under tool-results/, at the requested size only, so cropping it adds no detail. Ask for a larger maxDimension on a smaller node instead.
- One read-only measurement script (`pattern-inventories/measure.js`) gave type floors, spacing, strokes, radius and text insets for four pages in 9 calls: the cheapest route to layout-token evidence.
- Gate 1 closed here on both passes' calls; the second pass's deltas went to an addendum rather than into the canonical review.
- Cost: subagents 2.07M tokens (email 0.43M, organic social 0.42M, paid 0.46M, web and other pages 0.46M, measurement 0.30M); main chat not measured.

## 2026-10-17: chat 4, Chat 4 prompt, engines 0.5.0 and 0.5.1 and the bundle

- The leak was taste as well as names. 0.4.0 briefed every pairwise judge with one brand owner's measured preference and hard-coded a product family in a script. Read the judge's brief and the generation contracts, not only the names.
- A name census proves names only. 0.5.0 passed it with zero hits; two fresh-context audits and two overlap scans against every other brand folder (8-word runs, verbatim quoted strings) then found that brand's taste as engine defaults, its slot-map values and module ids with budgets in test fixtures, its barred territories, and its copy in test strings. Run the overlap scans on every engine release before handover.
- A census term has to count plurals and possessives. A singular product-family term missed its plural until the pattern took an optional "s".
- Test fixtures are where another brand's facts hide: copied slot maps, measured budgets, a ledger's barred terms, review ids, reworded quotes. Write fixtures fresh, in a domain no pack covers, and label them synthetic.
- A number labelled "platform" can be a brand's. The paid safe bands in the asset-types recipe were one brand's guide layer and contradicted the engine's own placement specs.
- Evals drift from their fixtures: three 0.4.0 evals graded against an earlier version of their fixture brief.
- A new skill breaks at its seams, not in its own tests. The review of the organic social work found seven should-fix items, all where social met existing machinery (the asset lint, the board's renders, the squad prompt, the verifier's per-surface signals, malformed input), none inside social-copy's own suite.
- A reviewer's probe files are a free fuzz set: rerun them after the fixes, then keep them as tests.
- The fallback lexicon ships empty in 0.5.1: a pack without a `concrete_lexicon` (`product` key) earns no concreteness credit at all.
- The Mac's Cowork shell is a Linux sandbox: the brand home is at `~/mnt/claude-cowork`, `/Users/eddie` does not exist, and background processes die with each call, so a long check has to finish inside one call.
- Re-read DECISIONS.md before the last build of a long chat. Gate 1 (b) was ruled in another chat mid-run and widened this release.
- A zip made from an installed plugin carries the cache's `.in_use/` lock file. Build bundles from source and strip runtime files.
- A bundle that references the working pack needs no rebuild when the pack changes, only for a new engine release or a new pack path.
- Several chats wrote this brand home today. These record files were re-read and patched in one step with an mtime check.
- The Figma connector's build path loads Google Fonts and fonts an organization hosts, not fonts installed on the Mac: Homemade Apple and Instrument Serif load, Saol and Trade Gothic do not. A Pro team cannot host fonts, so the real faces reach the library only through the Figma desktop app where they are installed, or an org plan.
- The Plugin API cannot rename a Figma file: the document reads "Document". File names are changed in Figma itself.
- Cost: audit subagents 0.29M and 0.39M tokens, the review 0.34M; main chat not measured.

## 2026-10-17: Step 1b pattern review (the Chat 2 prompt)

- Chat 1's frame lists hold only the direct children of each top-level section. Nested sub-sections and boards were missed: 111 social frames in the 16 dated sub-sections of sept-october 2026 (the current work) and 524 paid frames (486 inside 13 boards, 38 in nested sections). Walk recursively and checksum ids before reusing a count.
- The layer-name corpus counts hidden and buried copy. "Embody the force" sits in 131 layers with 0 visible (a hidden group copied into 112 frames); "What is the Highest Self?" in 144 with 0 visible; paid templates keep old copy under new images. What ran comes from a visible-text pass.
- A fill count is not a ground: blush #F0DFCF fills 86 grid frames but sits under a full photo in 103 of 109. Check coverage before naming a ground.
- Numbers by script, judgement by eye: a read-only use_figma census (45 groups, 2,092 frames, 77 tool calls, no failures) gave exact type keys, inks, grounds, insets and CTA geometry; 227 screenshots across four subagents gave structure, imagery and devices. Neither alone would have done.
- Parallel subagents share one Figma rate limit: the four screenshot agents paced to about one call a minute at times, and each ran 25 to 35 minutes.
- The 700 sends are a 1x rebuild of the 1200 modules (margin 52 vs 80; label boxes the same height at both widths), shipped as image slices. Never scale a module set between widths; derive both from one rendered floor.
- The book's art direction cards map to most live imagery, but five live families have no card (founder portraits, cut-outs with shadows, found art, documentary, stock). Map imagery before ratifying `art-direction.md`.
- Meta's Ads Guide refuses automated reads; the 9:16 safe zone came from a 2026 secondary summary. Confirm in the guide before the first paid build.
- Sessions ran in parallel on this brand home: a second Step 1b session wrote `outputs/step-1-review/pattern-inventories/` at 17:03:30, and this one committed `pattern-review.md` at 17:03:37. A device commit takes no lock, so the later write wins. One session per brand home, and check for a target file's mtime before committing over it.
- Cost: subagents 2.06M tokens (email 0.40M, organic social 0.44M, paid 0.40M, web and other pages 0.38M, census 0.43M); main chat not measured.

## 2026-10-17: chat 3, Chat 5 prompt, Gate 3 proposed

- Same stop as chat 2: the Chat 5 prompt arrived with Steps 1b to 3 open. Gate 3 was proposed (`outputs/step-4-figma/gate-3-conventions.md`) because it feeds Pack v0; nothing was written to Figma.
- Two chats wrote this file on the same day without seeing each other. Run one chat at a time on the brand home, and re-read a record file right before writing it.
- Figma takes custom font uploads only on Organization and Enterprise plans. A library in a Pro team cannot load licensed OTFs server-side, so use_figma builds text on stand-ins there. Bind family and style to variables so the swap is one edit.
- The engine's `figma-plan` emits three single-mode collections and drops `component.*`, `font.leading` and `font.tracking` without a warning. Count the plan against `tokens.json` before building.
- asset-production puts an em dash in frame names (prefix, em dash, name). The separator belongs in `figma.yaml`.
- The three 2024 wordmark SVGs are one geometry with three fills. Hash the path data before importing colorways as separate masters.
- Cost: not measured.

## 2026-10-17: chat 2, Chat 6 prompt stopped at the record

- The Chat 6 prompt (elements, modules, templates) arrived with the record at Step 1b: no pattern review, no `tokens.json`, no `slotmap.yaml`, no `hlr` registry entry, Gates 1 (b) to 4 open, `file_key` null. The opening reads caught it; nothing was written to Figma.
- Each prompt in `_setup/next-chat-prompts.md` presumes the gates before it. A precondition line at the top of each (for example "Runs when PROGRESSION shows Gate 4 checked") would stop an out-of-order paste on the first read.
- No step in PROGRESSION creates `brand-pack/slotmap.yaml`, though every chat is told to keep it current.
- The library file `Gq3yUbLs6MCRM0nOhjvnIW` reads through the cloud connector: one empty page, `0:1` "Page 1". Write access is untested until Gate 3.
- Cost: not measured.

## 2026-10-17: Step 1, chat 1

- Figma: the cloud connector refuses files shared view-only, even with a Full seat on your own team, and whoami still passes. The start-of-session check has to call get_metadata on the real file. The fix is a copy in a team you edit.
- Figma desktop: the Dev Mode MCP Server toggle was not under Preferences in Eddie's Figma desktop. Not pursued.
- The brand book (June 2022) predates the rename: marks and posts since mid-2023 say High Light Rituals. Date every source; an older book is evidence, not law.
- Logo SVGs from different years carry different blacks (#353535 in 2022, #231f20 in 2024). Read the fills in every SVG, not only the palette page.
- The IG archive's file names hold caption openers and post dates: a 36-line organic corpus before Figma opens.
- The installed engine names other registered brands in all 10 skill descriptions. A client-run bundle needs a brand-free release, so the census covers the engine, not only the pack.
- The site is Shopify: `/products.json` and `/collections.json` give the public catalog in two calls. Neither shell can reach the site; the built-in browser can, and a pull that size goes to disk by parsing the session's own record of the tool result, never by re-typing it.
- The book (2022) and the site (2025 theme) disagree on positioning, ink and CTA shape. Read the live site before ratifying anything from a book.
- use_figma returns at most 20 KB; anything bigger fails and commits nothing. Use it for aggregates (font and fill counts) and get_metadata for bulk reads: past the token limit the result is saved under tool-results/, where a regex pass reads it.
- The client's files carry no styles, variables or components (only 6 instances of a remote Logo). Every value is hard-coded, so observed tokens come from counts, not from a library.
- The copy grew between reads (email went from 304 to 527 frames). Re-read once the owner says the copy is complete.
- Neither shell can download Figma screenshot URLs (www.figma.com/api/mcp/asset). Visual review needs inline screenshots (enableBase64Response), best inside subagents so the images stay out of the main chat.
- Cost: not measured.
