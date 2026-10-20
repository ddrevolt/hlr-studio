# Step 3: the single-brand bundle

2026-10-17, chat 4 (the Chat 4 prompt). In this folder: `hlr-studio-engine-0.5.1.plugin` (install this one, over 0.5.0), `studio-engine-0.5.1.plugin` (the brand-free engine it is built from) and `build_bundle.py` (rebuilds either).

0.5.1 supersedes the 0.5.0 installed earlier the same day. Two fresh-context audits of 0.5.0, then two content-overlap scans of the bundle against every other brand folder under claude-cowork (8-word runs, and every quoted string verbatim), found another brand's content that the name census could not see: its taste as engine defaults, its web and paid slot-map values and module ids with their budgets in test fixtures, its barred territories in prohibited-pattern fixtures and evals, guide-layer safe bands stated as platform numbers, reworded customer quotes, and copy and claims phrases in test strings. 0.5.1 removes all of it. It also carries the organic social work Gate 1 (b) ruled into this release, the fixes from a fresh-context review of that work, the two Gate 3 engine gaps that do not depend on the Gate 3 ruling, and a fix that lets a Cowork shell find the pack. The 0.5.0 files were moved out of this folder.

## 1. The canonical 0.4.0

- **Canonical: the installed 0.4.0** (My Uploads, manifest dated 2026-09-07), the bundle the playbook lists as Sep 7.
- **The Oct 14 zip** in the reference implementation's `claude-ai/plugins/` snapshot holds the same 135 files byte for byte (sha256 of every file). It also carries `.in_use/90`, the lock file a live plugin cache writes (`{"pid":90,...}`), so it was zipped from an installed copy, not built. That file, the zip's 56 directory entries and its compression are the whole size difference.
- **`Claude outputs/studio-engine.plugin`** (2026-09-06, 491 KB), the only other studio-engine bundle under claude-cowork, is 0.2.0 by its own manifest: 8 skills, no verify, no squad-run, no voice lint, no fit check. Superseded.
- 0.5.1 is built from the canonical 0.4.0 with the lock file stripped.

## 2. studio-engine 0.5.1: what changed

**Brand-free**
- **Registry ships empty.** A bundle adds its brands. The docs' example is a fictional brand.
- **No other brand's pack files.** `pack-additions/` and `MIGRATION.md` are gone.
- **Skill descriptions.** The list of registered brands is out of all of them. Eleven skills, longest description 981 characters (asset-production).
- **The judge's taste comes from the brand.** The judge's brief keeps the method in the engine (`skills/verify/references/pairwise-rubric.md`) and appends the pack's `judge_rubric` through `skills/verify/scripts/judge_brief.js`. With the role null (HLR today) the judge is told no measured preference is on file, and every rank says so.
- **The copy skills' ranking comes from the brand.** The selection checklist keeps three brief items in the engine (must-say carried, the briefed offer with its figures, inside the budget) and takes every taste item from the brand's voice contract and `judge_rubric`.
- **Fallbacks carry no taste.** The default voice model weights only AI-register tells; the neutral lexicon is empty; question and bare-exclamation flags appear only from a brand's own calibration.
- **Product families and the lexicon come from the pack.** `verify_packets.js` reads `concrete_lexicon.product_families`; the lexicon takes a `product` list (`food` is still read).
- **Contracts, scripts, skills, evals.** Another brand's copy lines, scenes, insights, voice qualities, campaign names, module ids and counts, calibration numbers and run facts are out of the generation contracts, gate data, output formats, evals, the verifier contract, lint messages, script comments, the squad workflow and the skill bodies. The web writing contract is written by section kind. The engine's own dated change notes stay: they record when the engine changed, not facts about a brand.
- **Fixtures and tests,** rewritten fresh on fictional brands (Testbrand, a stationery line; Acme, Northwind and Globex for the registry) or in domains no pack covers: the paid eval's customer inputs (gift buying, labelled synthetic), synthetic paid and social slot maps, invented ids and budgets in every inline slot and seam map, a neutral prohibited-territory list, and fresh copy lines throughout. The email, web and brief-intake evals are synced to the fixtures they grade. The voice fixtures are an 80-label synthetic calibration with its own fitted model.
- **Platform numbers are platform numbers.** The paid safe bands in `asset-types.md` were one brand's guide layer and contradicted `placement-specs.json`; the recipe now reads the bands from `placement-specs.json`, and the social recipes point to `organic-specs.json` rather than restating its numbers.

**Organic social (Gate 1 b)**
- **`asset-production` recipes:** S03 carousel set (cover, inner and end panels as separate 4:5 masters; gutter or seamless strip; 3:4-grid-safe sides; slots `S03.cover.<role>`, `S03.inner.<role>`, `S03.end.<role>`, repeat groups such as `S03.inner.item1.body`, and an `S03.caption` layer where the brand keeps captions in the file) and S04 story set (text, inset, full bleed and split; slots `S04.<structure>.<role>`; stickers added in the app, never baked in).
- **`social-copy`, the organic caption route:** a new skill. Three angles for a human pick; three cover lines by hook; three captions that differ before the fold; the copy for every panel or frame, composed whole and cut to the brand's masters. `social_lint.js` checks the claims law (the same ledger and prohibited list as every channel), the post's shape and sizes, the caption ceiling, the fold, hashtags, pasted links and domains, and slot ceilings, and says OFF with the reason for any check that could not run.
- **Platform facts** for organic posts are in `skills/social-copy/references/organic-specs.json`, verified 2026-10-17 with sources and a confidence each: caption 2,200 characters (agreed) with the fold at about 125 (approximate); five hashtags (agreed, since December 2025); carousels of 2 to 20; the 3:4 profile grid; story keep-clear bands (contested, so the ads zone stays the default). A breach errors when the number is agreed and warns when it is contested or approximate.
- **Wiring:** a new pack role `slotmap_social`; the `social` channel for favorites and exemplars; the `social` surface in brief-intake (post format, sizes, panels, frames), the squad workflow, the verifier's exhibits, the packet schema, the completion contract and the board; `voice_lint.js` and `fit_check.js` read social files; `slot_lint.js` lints social masters.
- **Default until Eddie rules:** a new skill rather than an organic mode inside `paid-ad-copy` (section 6).

**The review of the organic social work** (fresh context, 0.34M tokens): seven should-fix items and nine notes, every one fixed in this release. The reviewer's own 40 malformed slates and its paid, fit-check and template probes were rerun on the fixed engine: each returns a verdict, none crashes, and they are now tests.
- **Asset lint.** `slot_lint.js` rejected the social slot ids and read only the web slot map. It now lints social masters as fixed canvases: a measured `max_chars` per slot (or null with a status, which asks for a sign-off), ids that name their panel or structure, declared parts, `slotmap_social` from the pack.
- **Malformed input.** `social_lint.js` and `paid_lint.js` crashed on figures that were not lists and passed copy that was not a string without checking it. Both now refuse such input by name.
- **Social lint.** The post's sizes and its panel roles come from the gate data; slot keys map through their own panel (repeat groups keep it, another panel's ids are refused, `caption` is the caption layer); a slot map the pack names and cannot find is an error; glued hashtags count; bare domains warn; captions are compared before the fold; a must-say split by a line break is found.
- **Intake and board.** A carousel brief needs three panels at least, and a social deliverable's sizes must fit its format. The board asks for one render per panel or frame (the packet's render takes an `item` number), takes the default sizes per post format from the completion contract, shows the picked angle and says when a long sequence is cut short.
- **Squad runs.** The worker's completion checklist follows the surface instead of always email; a social route develops one post (the verifier compares routes surface by surface and now names any second deliverable on a surface rather than overwriting it); the product lookup path is given explicitly.
- **Docs.** Stale reader lists, counts and file names fixed; the fold marked approximate; caption cuts carry their own budget.

**Cowork shells**
- A Cowork shell on the Mac sees the brand home at `~/mnt/claude-cowork`, not at `/Users/eddie`, so the registry's pack path did not exist there. When the registered path is missing, the resolver now reads the same folder through its `claude-cowork/` segment and says so (`resolve_brand.py` on stderr, every lint in `pack_resolved_by`). A pack on neither path is still reported missing. Checked on the Mac's Cowork shell.

**Gate 3 engine gaps**
- **Fixed now** (they do not depend on the ruling): the agent package names frames `<PREFIX> <Name>` (no dash), and `figma-plan` lists every token it does not plan under `not_planned` and announces it, instead of dropping component, leading and tracking tokens silently.
- **Waiting for Gate 3, as 0.5.2:** a component collection with modes, scopes, font style in the token grammar, `collections.component` in the pack contract.

## 3. The bundle: hlr-studio-engine 0.5.1

- **Name** `hlr-studio-engine`, so installing it cannot replace a multi-brand `studio-engine` in the same account. It installs over the 0.5.0 bundle of the same name.
- **Registry** lists `hlr` only: name High Light Rituals; aliases HLR, High Light Rituals, HighLight, highlight-brandbook; pack `/Users/eddie/Documents/claude-cowork/highlight-brandbook/brand-pack` (read through `~/mnt/claude-cowork` in a Cowork shell).
- **The pack is referenced, not copied in.** The engine writes into the pack (option registers, Figma ids, calibration and judge files), and an installed plugin is a read-only cache, so the working copy stays authoritative. Pack v0 will be read live: no rebuild, no reinstall.
- **`BUNDLE.md`** at the plugin root says this to whoever installs it.
- **sha256:** `hlr-studio-engine-0.5.1.plugin` 0715777439f72175918dea7f86e1b64d29b72cf29fd0546e1f7f17bd83e6c8a5; `studio-engine-0.5.1.plugin` 6e4682ffafd87f26635fcbb9f508c3519499d66a6e1c64d0c16e21189de29e04.

## 4. Checks

| Check | Result |
|---|---|
| Tests, cloud (Node 22.22, Python 3.13) | 26 files, 662 checks, 0 failed, run from the built bundle |
| Tests, the Mac's Cowork shell (Node 22.23, Python 3.10) | 26 files, 662 checks, 0 failed, on the bundle in this folder |
| Census of other brands' terms (327 terms and Figma-key shapes; plurals and possessives count) | 0 in the HLR bundle and 0 in the engine, in the cloud and on the Mac |
| Overlap scan: shared 8-word runs with every other brand folder | 1,093 spans. The 7 not in the pre-review scan were read: engine idioms (test helpers, the packet and cost schema, the product lookup command) and one slot-map line shape with a round ceiling. No brand content |
| Overlap scan: quoted strings found verbatim in other brand folders | 722 strings. The 11 new ones were read: short generic phrases ("is not in the", "by a human", "page after page"). No brand content |
| Skill descriptions | 11, all under 1024 characters; longest 981 |
| Resolution | `hlr` resolves by name, alias and folder; in the Cowork shell it reads the pack through `~/mnt/claude-cowork` and says so; `--check` exits 1 until Pack v0 writes `brand-context.md` |
| Deterministic build | each plugin rebuilt from source, identical sha256 |
| The reviewer's probes | 40 malformed social slates plus paid, fit-check and template probes: each returns a verdict, none crashes |
| The HLR brand home | no other brand's term in any HLR output or record. The setup copies of the playbook and of the project instructions name the reference implementation by design. The four Figma-key-shaped tokens are HLR's own files (the library, the reference copy, HLR-EMAIL, HLR-Social) |

The census list was built from every other pack and client folder under claude-cowork: registry names and aliases, product databases (names and SKU ids), Figma file keys, slot and CSS namespaces, font families, domains, campaign and client names, and the terms of earlier purge censuses. The overlap scans compare the bundle's text with every text file in those folders; each hit was read. The term list and the scan output name those brands, so they are kept out of this folder.

## 5. What the bundle does today

It installs and resolves HLR. Then every skill stops at the missing `brand-context.md` and names it. That is correct until Pack v0 passes Gate 2. Nothing in the bundle is a fact about HLR beyond its name, aliases and pack path.

## 6. Open, ranked by production-blocking risk

1. **Pack v0** (Step 2, Gate 2). Until it exists the bundle runs nothing. It should build against this release's pack contract, which adds `slotmap_social` (DECISIONS records 0.5.0's). Owner: Eddie.
2. **Gate 3.** The four convention-dependent engine gaps ship as 0.5.2 once Eddie rules; Figma Foundations waits on both. Owner: Eddie.
3. **What Pack v0 needs for organic social:** `slotmap_social` for HLR's S01, S03 and S04 masters (budgets null until they are built and measured, and the lint asks for a sign-off), favorites and exemplars tagged `social`, its series (the weekly and monthly posts) in its type registry overlay and `asset_types`, and its hashtag and caption rules in the voice contract. Where captions live (an HLR question for Review 1) decides whether the slot map stamps an `S03.caption` layer. Owner: Eddie, then HLR.
4. **The organic caption route's home.** Options: (a) default, a new `social-copy` skill: organic gets its own gates, lint and triggers, and paid stays paid; cost, an eleventh skill to maintain. (b) An organic mode inside `paid-ad-copy`: one social skill; cost, paid's grounding, placement and Ads Manager rules would have to be switched off per post, and "paid" is the wrong word for HLR's team to reach for. Owner: Eddie.
5. **Engine defaults from the review, until Eddie rules:** a social slot's ceiling is measured on the tightest variant of its set; a contested or approximate platform number warns where an agreed one errors; a squad run develops one social post per route; the board wants one render per panel or frame; a missing registry path is read through its `claude-cowork/` segment. Owner: Eddie.
6. **HLR's machines.** Their absolute pack path is unknown. If their brand home sits under a `claude-cowork` folder, the resolver finds it through that segment; otherwise rebuild with `build_bundle.py --pack <their path>` at handoff. Owner: Eddie.
7. **The release checks' tools.** The census list and the overlap scans live only in this session's scratch space and go with it. They name other brands, so they belong outside the HLR folders (proposed: `claude-cowork/_tools/release-checks/`). Owner: Eddie.
8. **What Pack v0 has to carry for the copy skills to rank on HLR's taste:** voice principles with operational definitions (they become the checklist's brand items), a `concrete_lexicon` with a `product` list, and, once HLR's reviewers have marked lines blind, `voice_calibration`, a fitted `voice_model` and a `judge_rubric`. Until then ranking uses the brief items and the voice contract only, and says so.
9. **Embed the pack instead** (the old per-brand plugin style). Needs an engine change (plugin-relative pack paths) and makes the pack read-only. Default: no.
10. **Note:** the ratified alias "HighLight" also matches the ordinary verb ("highlight the price" resolves to `hlr`). Harmless in a single-brand bundle; it would matter in a multi-brand registry.
