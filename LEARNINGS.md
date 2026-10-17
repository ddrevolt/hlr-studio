# HLR learnings

One dated entry per chat, newest first.

## 2026-10-17: Chat 3 prompt, a second Step 1b pass, Gate 1 closed

- The Chat 3 prompt arrived before the pattern review existed (its precondition line was added after the paste). On Eddie's go this chat ran Step 1b while the Chat 2 chat was running it: two full passes, about 2.07M subagent tokens here against 2.06M there, and about 180 Figma calls here. Before redirecting a chat to an earlier step, look for another live chat on that step: `git status`, new untracked outputs, record mtimes.
- This seat's Figma connector allows 10 calls a minute and 200 a day (a refusal said so). A budget sent to running subagents reached them after 28 to 59 calls each: the call budget belongs in the first brief.
- get_screenshot with enableBase64Response also saves the PNG under tool-results/, at the requested size only, so cropping it adds no detail. Ask for a larger maxDimension on a smaller node instead.
- One read-only measurement script (`pattern-inventories/measure.js`) gave type floors, spacing, strokes, radius and text insets for four pages in 9 calls: the cheapest route to layout-token evidence.
- Gate 1 closed here on both passes' calls; the second pass's deltas went to an addendum rather than into the canonical review.
- Cost: subagents 2.07M tokens (email 0.43M, organic social 0.42M, paid 0.46M, web and other pages 0.46M, measurement 0.30M); main chat not measured.

## 2026-10-17: chat 4, Chat 4 prompt, engine 0.5.0 and the bundle

- The leak was taste as well as names. 0.4.0 briefed every pairwise judge with one brand owner's measured preference and hard-coded a product family in a script. A name census passes on that: read the judge's brief and the generation contracts too.
- A census term has to count plurals and possessives. A singular product-family term missed its plural in the 0.4.0 tests until the pattern took an optional "s".
- A zip made from an installed plugin carries the cache's `.in_use/` lock file. Build bundles from source and strip runtime files.
- A bundle that references the working pack needs no rebuild when the pack changes. It needs one for a new engine release or a new pack path.
- The engine's fallback lexicon is food nouns. A brand that makes anything else needs its own `concrete_lexicon` (`product` key) in Pack v0, or concreteness scores near zero.
- Four chats wrote this brand home today. These record files were re-read and patched in one step, with an mtime check, not rewritten from an earlier read.
- Cost: not measured.

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
