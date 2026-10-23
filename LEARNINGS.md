# HLR learnings

One dated entry per chat, newest first.

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
