# Review: HLR Forge Guide (explainer), round 1

R1: 3 blockers, 18 should-fix, 10 notes (grouped). All open; owner the explainer build chat unless a finding names another.

Read: `explainer.html`, `content.json`, `explainer-data.json`, `examples-verified.json`, the app source (`App.tsx`, `components/*.tsx`, `lib/content.ts`, `index.css`), `build_data.py`, `verify_examples.js`, `gen_theme.py`, `gen_assets.py`, `prep_publish.py`, `guards/explainer_drift.py`, `guards/tests/run_tests.py`, `README.md`, `plan.md`. From the brand home copy: REVIEW.md (sections 1, 4, 5), PROGRESSION.md (Step 5, Process, Reviews), DECISIONS.md and LEARNINGS.md 2026-10-23, brand-context.md (tags, Channels, Contradictions, Gaps and owners), strictness-map.md, token-model.md (status), tokens.json, legal-ledger.json, products.json (`_meta`), route-axes.json, type-registry-core.json, asset-types.md, the demo run (brief, intake, run1-fail, routes, slates, findings, build.md, facts.json), engine-gaps-chat6.md (G1, G7). From the engine: README.md, the SKILL.md of brief-intake, email-copy, verify, squad-run and design-system, references/pack-contract.md. The three Claude Design pages, fetched 2026-10-23.

Ran: Playwright (Chromium) on the page wrapped in a minimal skeleton, 390x844 and 1440x900, light and dark: overflow, clipped text, contrast of every visible text node, keyboard focus, and every control the brief lists. `build_data.py`, `verify_examples.js` and `gen_theme.py` against a copy of the brand home (output identical to the shipped data, verdicts and theme, apart from build time and commit). `guards/tests/run_tests.py` against a git-initialised copy (15 of 15 pass). The guard on a mutated copy of the page (R1-17). Only the author ran: the census with `--census-terms` (the terms file is not in this container) and the Parcel build. Not re-proved: that quotes exist and values resolve.

Severity: the house rules in the brief are blockers. Other statements the record contradicts are graded should-fix (fix in this release), since the page is HLR's map of the system.

## Blockers

### R1-01 blocker: the rehearsal's delegated pick and unconfirmed copy read as a human pick and approved copy
- Location: `app/src/components/Journey.tsx:138` ("The approved copy, route 1"); `content.json` stages[2].plain[1] ("...then stopped."), stages[2].human ("A person picks the route."), stages[3].human ("A person approves the lines...").
- Wrong: nobody picked or approved in this run. DECISIONS 2026-10-23: R1 "developed as the recommendation, provisional ... for Eddie to confirm the angle and the lines". findings.md: "Angle not ratified". routes.json notes: "No human pick yet. Eddie delegated the angle for this demo". slates.json: `angle_gate.picked_by: "recommended"`, `provisional: true`. findings.md: "no line here is cleared for production". Only the Technical view of Pick says provisional.
- Failure: an HLR reader in plain view sees "The approved copy" under stages that say a person picks and approves, treats "Made after you choose it" and its lines as signed off and reuses them, while Eddie has confirmed neither the angle nor the lines.
- Fix: label "The drafted copy, route 1 (provisional)"; add one plain line to Pick and Copy: "In this rehearsal Eddie delegated the pick: Claude developed its recommendation, R1, and the angle and lines wait for his confirmation."
- Check: plain view of stages 3 and 4; grep components and content.json for "approved".

### R1-02 blocker: the quiz teaches a proposed rule as law and names the wrong decider
- Location: `content.json` quiz[2].why ("The button is a locked element. Gate 1 ruled the outline caps box, and filled boxes retired."), quiz[2].options[1] (the right answer: "Eddie").
- Wrong: "Locked" comes from strictness-map.md, which is "[derived] ... for Eddie to confirm; it stays [derived] until he does" (DECISIONS 2026-10-23, Gate 4). C6 is "Eddie's Gate 1 pick, for HLR to confirm", owner "HLR, Review 1" (brand-context.md, Contradictions); REVIEW.md tier 3 gives "HLR's confirmation of Eddie's Gate 1 picks" to HLR.
- Failure: HLR's team learns from the check that the outline button is locked and Eddie's call, so nobody raises the filled-button preference at Review 1, where C6 is HLR's to rule.
- Fix: right answer "HLR, at Review 1, through Eddie"; why: "The outline box is Eddie's Gate 1 pick (C6), for HLR to confirm. The strictness map, still a proposal for Eddie to confirm, would then lock it."

### R1-03 blocker: the Design tokens card shows "Ratified at Gate 2" over values the record says await confirmation
- Location: `content.json` cards[16].state; cards[16].controls ("four grounds (light, warm, deep and night)").
- Wrong: tokens.json's own status reads "ratified at Gate 2, 2026-10-22; alternate grounds named at Gate 4"; token-model.md: the warm, deep and night grounds were "decided by Claude under Eddie's delegation, for Eddie to confirm"; `text.on-placeholder` and the `placeholder.label` alias are [derived], for Eddie to confirm. The card cut the file's status at the semicolon.
- Failure: at Review 2 HLR treats the ground roster as ratified and does not weigh in; if Eddie renames or changes it, the page told the client a proposal was law.
- Fix: state "Ratified at Gate 2; ground names and 2 derived values for Eddie to confirm", or show the file's status whole.

## Should-fix

### R1-04 should-fix: Learn says HLR's reviewers mark once real sends go out
- Location: `content.json` stages[8].plain[0]; scenarios[3].ripple[3] ("marks on the next sends").
- Wrong: the first sheet is Eddie's blind keep-or-cut marks on the forge proof's output (PROGRESSION Step 5; gap register: "the Step 5 sheet is Eddie's blind keep or cut marks, HLR's reviewers mark later"). Marks are on drafts, not sends. The stage's own human line says Eddie marks first.
- Failure: HLR expects calibration to begin only after sends and with its own team; the forge proof's grading step is invisible to it, and "Taste that learns HLR" (R1-12) rests on the wrong picture.
- Fix: "After the forge proof, Eddie marks a blind sheet of the forge's lines keep or cut; HLR's reviewers mark later sheets. The marks become..."

### R1-05 should-fix: Ship says a slice "can't carry live links"
- Location: `content.json` stages[7].plain[1].
- Wrong: build.md: "Each card in slice 4 links to its own product page; the ESP's image map or four separate card slices carry the four links". What a slice cannot carry is live merge tokens (DECISIONS 2026-10-23, R1-02: "a slice bakes the tokens into pixels"). The stage's Technical line says the slices carry the product links.
- Failure: HLR's email operator concludes a sliced send cannot link to products, and the Review 2 ESP question starts from a wrong premise.
- Fix: "because a slice is a picture: it can link as a whole, but it cannot carry the platform's live merge fields."

### R1-06 should-fix: "Change a module and every email follows" overstates propagation
- Location: `content.json` system.parts[2].detail; compare.forge_better[3].detail ("a fix to a module reaches every send").
- Wrong: a module fix reaches instances inside HLR Library at once, other files only after Eddie publishes the library ("publishing the library is Eddie's manual step", REVIEW.md section 1) and the file takes the update; slices already exported or sent never change.
- Failure: a footer fix lands in M09 after the November slices are in the ESP; HLR assumes the scheduled send carries it.
- Fix: "...every email still in Figma follows once the library update is published; slices already exported are exported again."

### R1-07 should-fix: the ground lesson says no check reads the ground; one does now
- Location: `content.json` stages[6].lessons[0].text ("No lint reads which ground a module uses; a reviewer did.").
- Wrong: DECISIONS 2026-10-23: "email_ground.js asserts the email page ground on every module root (R2-09)"; LEARNINGS 2026-10-23: "The review now checks that every module root binds the email page ground."
- Failure: readers take the cream-ground defect as still unguarded, the opposite of the seen-twice-guarded practice the page teaches; the operator may add a duplicate check.
- Fix: "No lint read it then; a reviewer did, and a guard (email_ground.js) checks it now."

### R1-08 should-fix: the seasonal color ripple invents automation
- Location: `content.json` scenarios[4].ripple[1] and ripple[3] (who: "Automatic"); neither has a source.
- Wrong: certified pairs are a list in tokens.json (`contrast-pairs`) that changes by ruling; the design-system check grades pairs when someone runs it, and the web export is a run (`tokens_build.js export`, design-system SKILL.md). Semantic tokens alias primitives "so a palette change propagates": re-pointing a shared token recolors every send, while a new accent token is bound by nothing until a Figma write, which needs Eddie's go.
- Failure: HLR expects a winter accent to appear in winter sends by itself and nowhere else; either nothing changes or every send does.
- Fix: Eddie decides where the accent binds (a token only seasonal masters use, or a mode); the check grades the new pairs and Eddie ratifies them into `contrast-pairs`; binding is a Figma write on his go; the export is run again.

### R1-09 should-fix: "Waiting on HLR" lists 6 items; HLR owes 10 more rulings
- Location: `app/src/components/Rulebook.tsx:110-131` (gap register only) and :125 ("Asked at Review 1"); `content.json` rulebook.waiting_intro, close.next ("It lists what HLR owes the forge"), system.parts[3].stat.
- Wrong: brand-context.md Contradictions has 10 open rows owned "HLR, Review 1" (C1 to C8, C10, token-model C9), among them C2 (positioning and claims) and the Gate 1 picks C3, C4, C5, C6 and C8 for HLR to confirm. Review 1 has no date (PROGRESSION Reviews: "{{review-1-date}}"; gap "Live review dates: not set"), so "Asked at Review 1" reports a meeting that has not happened.
- Failure: HLR takes the view the close sends it to as its Review 1 list and arrives without rulings on C2 and the Gate 1 picks, the ones that unblock benefit routes and the design choices.
- Fix: add a "Rulings HLR owes" group from `data.contradictions` where the owner starts with HLR, count it in the stat, and say "Due at Review 1 (date not set)".

### R1-10 should-fix: the thesis says Claude Design knows how HLR looks
- Location: `content.json` compare.thesis; compare.rows[1] ("What it knows about HLR").
- Wrong: no HLR design system exists in Claude Design; the page's own together[2] calls seeding one "Worth testing, not yet a claim".
- Failure: HLR's team opens Claude Design for a wholesale sheet expecting HLR's look and gets a generic draft.
- Fix: "Given a design system built from HLR's files, Claude Design can know how HLR looks..."; rename the row "What it knows about a brand".

### R1-11 should-fix: "every Claude plan" is cited to a page that says otherwise
- Location: `content.json` compare.cd_facts[5] (source anthropic.com/news/claude-design-anthropic-labs); relied on by cd_better[5] ("Free included").
- Wrong: the announcement says "available in research preview for Claude Pro, Max, Team, and Enterprise subscribers" and never mentions Free. claude.com/product/design: "included within every plan, including the Free plan"; the support article: "available on Free, Pro, Max, Team, and Enterprise plans". The guard checks only a date for outside pages, so it cannot see this.
- Failure: a reader, or the next rebuild's re-check, opens the cited page, finds no Free plan, and reads "Free included" as invented.
- Fix: two facts: plan and usage from the product page with its quote; the launch from the announcement.

### R1-12 should-fix: "Taste that learns HLR" is listed as a present strength
- Location: `content.json` compare.forge_better[7].
- Wrong: favorites, voice_calibration, voice_model, judge_rubric and judge_calibration are all null; the voice lint runs on default weights; every rank says the judge was never checked (gap register; findings.md: "no measured preference is on file").
- Failure: HLR picks the forge for taste-sensitive work believing it already reflects HLR's taste; plan section 7 names over-selling as the way the page loses trust.
- Fix: "From the forge proof on (not run yet): ...", or move it under a "what comes next" line.

### R1-13 should-fix: plain view shows internal owners and raw role ids
- Location: `app/src/components/Rulebook.tsx:86-88` (gap rows) and :38 (file line outside `Tech`); `Journey.tsx:252` (Learn evidence).
- Wrong: plain mode shows "voice_model / Owner: Chat 7", "judge_rubric / Owner: Chat 7", "slotmap_web / Owner: Chat 6", "section_library / Blocks: `web-copy` stops by design" (backticks shown), "Meta 9:16 keep-clear bands and copy limits confirmed (_verified in the engine's placement specs)", "Web breakpoints, margins and grid (figma.yaml breakpoints: null)", and file lines such as "favorites · voice_model · judge_rubric · judge_calibration · all empty".
- Failure: the page's stated aim is to find "the file and the owner behind any rule"; an HLR reader opening HLR's taste or Social, paid and web gets "Chat 7", an internal working session, and cannot tell whom to ask.
- Fix: give every gap row a card shows a `gap_plain` entry, render Chat 6 and Chat 7 as "Eddie (build session)", and wrap the file line and raw items in `Tech`.

### R1-14 should-fix: two more cards state a pending rule or pick without its status
- Location: `content.json` cards[14] (state "Measured"; example "The longest allowed line is the usual length times the proven stretch."); cards[17].example ("The default pair is Onyx on Alabaster.").
- Wrong: the length rule (`max_chars` = typical x the proven multiple) was "decided by Claude under Eddie's delegation, for Eddie to confirm" (DECISIONS 2026-10-23, slot map conventions). Onyx on Alabaster is C4, "Eddie's Gate 1 pick, for HLR to confirm".
- Failure: HLR treats both as settled and neither confirms nor contests them at its reviews.
- Fix: "Measured; the length rule for Eddie to confirm"; "...Onyx on Alabaster (Eddie's Gate 1 pick, C4, for HLR to confirm)".

### R1-15 should-fix: "documented" is defined as the brand book or HLR
- Location: `content.json` cards[23].controls; read with cards[16].stat ("82 documented").
- Wrong: brand-context.md: [documented] also covers "our own standing records" and "a ruling of Eddie's", and "a derived value or rule Eddie ratifies flips its leading tag to [documented]". A scan of tokens.json `$description` fields finds 54 of the 82 [documented] tokens carrying a ratification note or a DECISIONS pointer.
- Failure: HLR reads "82 documented" as 82 values from its own brand book and does not question Eddie's ratified proposals, which it is meant to confirm.
- Fix: "documented (the brand book, HLR, or a ruling of Eddie's, dated)".

### R1-16 should-fix: closing a card sends keyboard focus to the top of the page
- Location: `app/src/App.tsx:113` and `Rulebook.tsx:22-27` (a controlled Sheet with no `SheetTrigger`); the journey's card chips (`bits.tsx` CardChip).
- Wrong: measured: open a card with Enter, press Escape, and `document.activeElement` is BODY; the next Tab lands on "Skip to the journey". Same from a journey chip.
- Failure: a keyboard reader working through the 28 cards loses their place after each one and tabs through every stop above the rulebook again; the plan asked for a keyboard path through the cards.
- Fix: remember the opener and focus it in `onCloseAutoFocus`, or render the card buttons as `SheetTrigger`.

### R1-17 should-fix: the guard's page scan cannot see the page's text
- Location: `guards/explainer_drift.py:161-165`.
- Wrong: the scan strips every `<script>`, but the bundled page's visible text lives in the script, so the em dash and census checks on the page check nothing; strings typed in components (Journey.tsx:129, 138, 183, 197; Compare.tsx:108; App.tsx:107) sit outside content.json and outside every check. Proof: a copy of explainer.html with an em dash put into "Tap to see the pick", run with `--page` and `--extra-term Tap`, prints PASS.
- Failure: a later edit to a component string adds an em dash or another brand's term and the guard passes it on to HLR.
- Fix: scan the rendered text (headless render) or the bundle's string literals; move visible strings into content.json; add a must-fail test with an em dash in a component string.

### R1-18 should-fix: the stamp names a commit the page was not built from
- Location: `build_data.py:379-396`; `App.tsx:91` ("brand home fa42d58").
- Wrong: this build ran on a copy without git, with the commit passed by hand and `pack_uncommitted_changes: null`, and it read the re-rendered intake.md, which is not in that commit (the brand home's copy "reads FAIL", DECISIONS 2026-10-23, first line). Even in a repo the dirty check covers only brand-pack/: on a git copy with an uncommitted edit to the demo intake, build_data.py stamped HEAD with `pack_uncommitted_changes: False`.
- Failure: someone checks out fa42d58 to audit the page and finds intake.md reads FAIL there, while the page shows the re-run PASS from that commit.
- Fix: run `git status` over every file in `used`, record the changed paths, show "+ local changes" on the page; with `--commit` on a copy, mark the stamp unverified.

### R1-19 should-fix: the re-run verdict comes from the rendered header LEARNINGS says not to trust
- Location: `build_data.py:316-317` (reads `Verdict:` from intake.md); `Journey.tsx:91`.
- Wrong: LEARNINGS 2026-10-23: "Read the JSON verdict, not the rendered header, and re-render after a workaround." The page's "Re-run" pill reads the header; `brief-lint.json` holds the verdict.
- Failure: if the re-rendered intake.md does not reach the Mac before the next rebuild, the page shows "Re-run FAIL" beside a passing brief lint.
- Fix: take the re-run verdict from `lints.brief.verdict` and stop the build when the header and the JSON disagree.

### R1-20 should-fix: the README's swap to a real brief would break the build
- Location: `README.md` (last paragraph); `build_data.py:309`; `gen_assets.py:10`; `Journey.tsx:129, 138, 197`; `verify_examples.js:28-34`.
- Wrong: the README says to change `DEMO` and `SLUG`, but the brief's file name is typed in full at build_data.py:309, the preview defaults to the demo PNG, "Why route 1", "The approved copy, route 1" and the email's alt text are typed into the component, and the example verdicts include the demo headline.
- Failure: after Step 5 the operator follows the README; build_data.py stops with FileNotFoundError on the brief, or, once that is patched, the page shows the new run under the rehearsal's labels and alt text.
- Fix: derive the brief path from `SLUG` and the labels from `demo.recommended`; move the alt text and labels into content.json; list every place in the README.

### R1-21 should-fix: "HLR's live site carries ... CALM YOUR ANXIETY" names a place the sources don't
- Location: `content.json` compare.forge_better[0].detail.
- Wrong: route-axes.json says "HLR's live benefit language", brand-context.md "Live copy"; legal-ledger.json ties the line to Brand Review v2 Q1 beside "a send titled 'Anxiety Calming Pieces'". None says the site.
- Failure: HLR searches its site, does not find the line (if it ran in an email), and disputes the comparison's lead point.
- Fix: "HLR's live copy carries benefit lines such as...".

## Notes

### R1-22 note: journey and system wording
- stages[6].plain[0] "A fresh reviewer that never saw the work checks it": the reviewer reads the work; it never wrote it or read how it was made (the glossary has it right).
- stages[6].lessons[1].text "dropped it from the copy": DECISIONS 2026-10-23 dropped "one at a time" from the brief's vocabulary; no slate string ever carried it (the route note says so).
- stages[1].first_run.text "the brief was corrected": G7's workaround dropped `breakpoints` and named the 1200 canvas in the notes; the schema was wrong, not the brief.
- stages[4].plain[0] "For a bigger send": squad-run SKILL.md gives no size trigger.
- Journey.tsx:286-331: Squad sits between Copy and Build in Previous and Next, so Build's badge reads 5 and its counter "6 of 9".
- system.headline and readers[2].hint say three parts; four render.
- system.parts[3].what "Eddie and HLR's team ... ratify proposals ... and sign off claims": only Eddie ratifies; only HLR's signer signs claims.

### R1-23 note: lines no source supports, or that overstate
- cards[0].why "No price, karat or size reaches copy unless this file carries it": products.json carries observed prices and metal options; the observed block "never reaches a writer" (`_meta.how_to_read`).
- cards[0].enforced "every product resolves to a real record": the brief lint accepts an unresolved SKU that carries a gap (brief-intake SKILL.md).
- cards[0].tier "The derived fields (kind, family)": ratified 2026-10-22 (products.json status).
- cards[2].why "the pack follows Eddie's interim pick": C1's interim is lane C's; C7 and C10 have none.
- cards[4].controls "never appears in anything the forge makes": engine reports keep their em dashes (exempt, DECISIONS 2026-10-18).
- cards[15] state "Planned", stat "Social planned", rerun "Wire each slot map when its masters are built": brand-context.md Channels: "slotmap-social.yaml wired, masters unbuilt".
- cards[18].rerun "A changed row changes the masters it governs": a row records posture; masters change only by a Figma write.
- cards[21].example "every convention was ruled before the first one": true of Gate 3 (PROGRESSION Step 4); the Gate 4 ground names, the slot map conventions and the E07 short name went in under delegation, for Eddie to confirm.
- cards[24].controls "a fresh review for evidence and records": REVIEW tier 1 needs only the author's re-read for record lines and read-only evidence.
- system.rule and compare.rows[2] "the forge stops": in the rehearsal the run went on without the missing descriptions and named the gap; "never guesses: it stops or works around the gap, and names it" fits both.
- scenarios[0].ripple[3] "HLR supplies them": today's photos are Eddie's (DECISIONS 2026-10-23, image rights), nothing says who supplies new ones, and the step skips the usage right and `faces_policy`. scenarios[1].ripple[3]: no source. scenarios[7].ripple[0] "shuffled order" and ripple[1] "Automatic": no source; favorites is a pack file written from the marks (pack-contract.md).

### R1-24 note: quotes beside lines they do not support (the guard checks presence, not support)
- stages[4].technical: "the judge never sees the workers' transcripts" carries "never the human pick"; verify's "never saw the workers' transcripts" fits.
- cards[13].why: a governed set of modules carries "every Figma write and every convention".
- cards[16].why: one set of values drives Figma and the web carries "[derived] our proposal, which only Eddie ratifies."
- Journey.tsx:304 renders `s.fact` under The human call: on Build, "Built from library instances only" sits under "Eddie confirms the build at Review 2"; on Learn, "no measured preference is on file" under "Eddie marks the first sheet".

### R1-25 note: Claude Design lines beyond the three pages, and strengths left out
- rows[4].cd "Writes copy along with the design" and rows[5].cd "Free-form": not stated on the pages (the product page shows "Draft the strategy" only as an example prompt).
- Decks: the product page now names Claude Slides beside Claude Design, so "presentations" and "decks" may belong to Slides.
- "Figma isn't among ... listed integrations" appears twice and serves as a forge strength; true of both pages, but the product page imports from "design files" without defining them. Say it once, in the facts.
- Left out of "Where Claude Design does better": organization-scoped sharing and co-editing ("grant edit access so colleagues can modify the design and chat with Claude together"), and the admin lock to one approved design system.

### R1-26 note: comparison balance
Nine forge points against six; the forge panel sits on the filled deep band in full ink and Claude Design's table column in muted ink (Compare.tsx:16, 79), and the forge list comes first on phones; "Facts that stay true" and "Loud absence" make one point; the big-type thesis and "they work well together" (an untested pairing) read as positioning (plan section 7, steel man). Merge the overlap, give both columns the same ink, add Claude Design's collaboration strength.

### R1-27 note: remaining plain-view jargon
Hero stamp ("brand home fa42d58 · hlr-studio-engine 0.5.3"); progress names ("Step 3. Register HLR", "Step 1b"); the brief panel's ids (product_listing, 04 Staging, node 27:137, template 2:683, HLR-REQ-01); slot ids in the copy table (M02.eyebrow, E06.name); intake gap lines ("Gate 2 package call 17", C2); "Unblocks: every line a needs_legal row hits"; source chips show a bare "SKILL.md" or "README.md" (bits.tsx:74) that does not say which skill; footer "build_data.py"; "Tier", "Review 1 and 2", "Gate 2 and 4" and "ratify" appear on cards but not in the glossary; the Slot lengths card shows "53 slots" beside "one slot of 100 moved" (map slots against probe entries).

### R1-28 note: rendering and controls
No horizontal overflow at 390 or 1440, light or dark; every listed control works (toggle, stage buttons, Previous and Next, Show the answer, filters, card sheet open and close by Escape and by Close, Waiting on HLR, scenario chips and ripple, tool picker, quiz, source popovers); no console error besides the blocked font request. Found:
- Focus ring clipped top and bottom inside `.scroll-x` (header nav links, layer filters): only the two side strokes show (index.css:21, 40). Add `padding-block: 4px` to `.scroll-x`, or an inset ring there.
- 1440: a two-cell grey block after card 28 (the grid's `bg-line` shows through).
- 390: the side-by-side table shows the Claude Design column and cuts the forge column off with no cue that it scrolls.
- Disabled scenario chips and quiz options at 60 percent opacity measure 3.56:1 in light mode: exempt as disabled controls, but the footer's "Text sits only on the pack's certified color pairs" is not true of them.
- Every quiz answer is option B; close.next names a view without linking to it.

### R1-29 note: the footer overclaims what the guard checks
App.tsx:107 "Every quoted line on this page is checked against its source file": the two Claude Design quotes come from outside pages, for which the guard requires only a checked date. Say "every quote from the pack and the record".

### R1-30 note: the taste card's evidence was measured on another brand
cards[10].why quotes the README's "a preference derived from that owner's own marks did far better"; the README's sentence opens "On the first calibrated brand". A reader will take it as HLR's result. Label it "measured on an earlier brand" or drop the quote.

### R1-31 note: scripts and record
- build_data.py: a missing source stops with a bare FileNotFoundError traceback (tested by removing voice-lint.json in a copy); dead loop at 319-320; the findings owner split depends on the engine's em dash (361) and fails quietly if a later engine drops it.
- README lists no prerequisites (PyYAML, Pillow, Node, pnpm); app/package.json and vite.config.ts still describe a Vite build the README does not use.
- The re-rendered intake.md, like run1-fail.md, carries a session scratch path in its PROVENANCE STAMP (`/tmp/claude-0/.../hb/brand-pack/route-axes.json`); committing it puts a path that never existed on the Mac into the record. Engine behavior (owner lane H): log it beside G1 to G7, or relativize on re-render.
- README cites "Plan and rulings: plan.md and DECISIONS 2026-10-23", but the record copy says the plan's six calls "stay open for Eddie" (DECISIONS 2026-10-23; PROGRESSION Process). The rulings need their dated line at close, and the page needs Eddie's tier 2 go before HLR sees it.

## Status after fixes (author, 2026-10-23)

Every blocker and should-fix is fixed; verified by the drift guard (168 facts, 9 outside pages dated), its tests (19 of 19, four new must-fail cases), `tsc --noEmit`, and a Playwright pass at 1440 light and 390 dark (no overflow, no em dash in the rendered text, no page error, focus back on the opener after Escape). Published as Version 2.

| Finding | Status |
|---|---|
| R1-01 | fixed: copy label "Drafted copy for route 1, provisional"; an "In this rehearsal" note on Pick and Copy, quoting DECISIONS ("for Eddie to confirm the angle and the lines") and the findings ("Angle not ratified", nothing cleared for production) |
| R1-02 | fixed: right answer "HLR, at Review 1, through Eddie"; the why names C6 as Eddie's Gate 1 pick for HLR to confirm and the strictness map as a proposal |
| R1-03 | fixed: state "Ratified at Gate 2; ground names and 2 derived values for Eddie to confirm", with a status block quoting token-model.md |
| R1-04 | fixed: Learn and the voice and taste scenarios say Eddie marks the first blind sheet after the forge proof, HLR's reviewers later, on drafts |
| R1-05 | fixed: a slice links as a whole and cannot carry live merge fields |
| R1-06 | fixed: a module fix reaches emails still in Figma once the library update is published; exported slices are exported again (REVIEW.md section 1 quoted) |
| R1-07 | fixed: the lesson says a guard checks the ground now (email_ground.js, quoted) |
| R1-08 | fixed: the color ripple names the decision, the grading and ratifying of pairs, the Figma write on Eddie's go and the export run, each with its owner; no "Automatic" |
| R1-09 | fixed: Waiting on HLR lists 6 files and rights and 10 rulings (contradictions owned by HLR), "Due at Review 1 (date not set)"; counts and the system stat say 16; the close links to the view |
| R1-10 | fixed: thesis "Claude Design learns how a brand looks from its files..."; row "What it knows about a brand"; Together says an HLR design system there is not tried yet |
| R1-11 | fixed: plan coverage from the product page ("included within every plan, including the Free plan"); the launch from the announcement, quoted as checked 2026-10-23 |
| R1-12 | fixed: "Taste that will learn HLR", labelled Not running yet, says every taste file is empty |
| R1-13 | fixed: plain names and "unblocks" lines for every gap row a card or stage shows; Chat 6 and Chat 7 shown as "Eddie (build session)"; file lines and raw ids only in Technical |
| R1-14 | fixed: slot lengths "Measured; the length rule for Eddie to confirm"; the default pair as Eddie's Gate 1 pick (C4) for HLR to confirm |
| R1-15 | fixed: documented defined as the brand book, HLR, or a dated ruling of Eddie's; the tokens card counts 54 documented by Eddie's ruling (computed by build_data.py) |
| R1-16 | fixed: the sheet returns focus to its opener (`onCloseAutoFocus`); probed |
| R1-17 | fixed: every visible string is in content.json (`ui`); the guard scans the whole bundle and judges escapes; must-fail tests inject an em dash and a census term into a script string |
| R1-18 | fixed: the stamp records local changes to every file read and `commit_verified`; the Technical stamp says "plus local changes" or "(commit not verified)"; the final data is built on the Mac at close |
| R1-19 | fixed: the re-run verdict comes from brief-lint.json; the build stops when the header disagrees |
| R1-20 | fixed: `--demo` and `--slug`; labels from the route plan; preview alt text and labels in content.json; the README lists each place to change |
| R1-21 | fixed: "HLR's live copy" |
| R1-22 to R1-30 | fixed as listed in the findings, except R1-27's remainder: ids inside verbatim quotes and a few C-numbers stay, since quotes are not reworded |
| R1-31 | fixed: missing-file message, dead loop removed, findings owner split without the em dash, README prerequisites; the scratch path in the intake's provenance stamp is engine behavior, logged for lane H in DECISIONS; the plan's rulings get their DECISIONS line at close |
| Class | "a pending value shown as settled" was seen three times (R1-01, R1-03, R1-14): every card state now carries a `state_fact` quote, guarded, with a must-fail test (REVIEW.md section 5, step 5) |
