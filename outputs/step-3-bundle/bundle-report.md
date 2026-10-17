# Step 3: the single-brand bundle

2026-10-17, chat 4 (the Chat 4 prompt). In this folder: `hlr-studio-engine-0.5.0.plugin` (install this one), `studio-engine-0.5.0.plugin` (the brand-free engine it is built from) and `build_bundle.py` (rebuilds either).

## 1. The canonical 0.4.0

- **Canonical: the installed 0.4.0** (My Uploads, manifest dated 2026-09-07), the bundle the playbook lists as Sep 7.
- **The Oct 14 zip** in the reference implementation's `claude-ai/plugins/` snapshot holds the same 135 files byte for byte (sha256 of every file). It also carries `.in_use/90`, the lock file a live plugin cache writes (`{"pid":90,...}`), so it was zipped from an installed copy, not built. That file, the zip's 56 directory entries and its compression are the whole size difference.
- **`Claude outputs/studio-engine.plugin`** (2026-09-06, 491 KB), the only other studio-engine bundle under claude-cowork, is 0.2.0 by its own manifest: 8 skills, no verify, no squad-run, no voice lint, no fit check. Superseded.
- 0.5.0 is built from the canonical 0.4.0 with the lock file stripped.

## 2. studio-engine 0.5.0: what changed

- **Registry ships empty.** A bundle adds its brands. The docs' example is a fictional brand.
- **No other brand's pack files.** `pack-additions/` (another brand's calibration, lexicon, fitted model and favorites, used as test fixtures) and `MIGRATION.md` (history naming the registered brands) are gone.
- **Skill descriptions.** The list of registered brands is out of all 10. Longest: 962 characters.
- **The judge's taste comes from the brand.** In 0.4.0 the judge's whole brief (`skills/verify/references/pairwise-rubric.md`) was one brand owner's measured preference, illustrated with his products, offers and copy, so every brand's routes would have been ranked by it. 0.5.0 keeps the method in the engine and adds a pack role, `judge_rubric`. `skills/verify/scripts/judge_brief.js` joins the two into `judge-brief.md`. With the role null (HLR today) the brief tells the judge no measured preference is on file, and every rank says it was judged without one.
- **Product families come from the pack.** `verify_packets.js` hard-coded one brand's product family for its family-named signal. It now reads `concrete_lexicon.product_families` (null and warned without it).
- **Contracts and skills.** Another brand's copy lines, scenes, voice qualities, campaign names and calibration numbers are out of the email and paid generation contracts, the gate data, the output formats, the verifier contract, the squad workflow and the skill bodies. The selection checklist stays as an engine default, labelled as derived from the first calibration; a brand's own marks override it.
- **Lexicon key.** `concrete_lexicon` takes a `product` list (the concrete nouns of what the brand makes); `food`, its old name, is still read. Flags now say "concrete product or scene noun".
- **Tests and fixtures** are rewritten on fictional brands: Testbrand (a stationery line) for copy, voice and verifier tests; Acme, Northwind and Globex for the registry. The voice tests run on an 80-label synthetic calibration with its own fitted model.
- **Not in 0.5.0:** the organic social carousel recipe and caption route. Gate 1 (b) has no ruling.

## 3. The bundle: hlr-studio-engine 0.5.0

- **Name** `hlr-studio-engine`, so installing it cannot replace the multi-brand `studio-engine` in the same account.
- **Registry** lists `hlr` only: name High Light Rituals; aliases HLR, High Light Rituals, HighLight, highlight-brandbook; pack `/Users/eddie/Documents/claude-cowork/highlight-brandbook/brand-pack`.
- **The pack is referenced, not copied in.** The engine writes into the pack (option registers, Figma ids, calibration and judge files), and an installed plugin is a read-only cache, so the working copy stays authoritative. Pack v0 will be read live: no rebuild, no reinstall.
- **`BUNDLE.md`** at the plugin root says this to whoever installs it.

## 4. Checks

| Check | Result |
|---|---|
| Census of the bundle for other brands' terms | 0 hits in 135 text files (0.4.0, for scale: 758) |
| Census of the engine release | 0 hits in 134 text files |
| Census of `brand-pack/` | 0 other-brand hits; its four Figma keys are HLR's own (library, reference copy, HLR-EMAIL, HLR-Social) |
| Engine tests inside the bundle | 22 files, 576 passed, 0 failed, in the cloud (Node 22.22, Python 3.13) and in your Mac's shell (Node 22.23, Python 3.10) |
| Skill descriptions | 10 of 10 under 1024 characters; longest 962 |
| Resolution | `--name HLR`, a request naming High Light Rituals and a path under `claude-cowork/highlight-brandbook/` all resolve to `hlr`; another brand's name is refused, with only `hlr` listed |
| `resolve_brand.py --check` | exit 1: `brand-context.md` is not there yet |
| Preflight on `brand-pack/` | stops: no brand context (Pack v0 not built) |
| Build | deterministic: two builds give the same sha256 |
| Whole HLR repo (records, `brand-pack/`, `outputs/`) | 0 other-brand hits; the only key-shaped tokens are HLR's four Figma keys |

The census list was built from every other pack and client folder under claude-cowork: registry names and aliases, product databases (names and SKU ids), Figma file keys, slot and CSS namespaces, font families, domains, campaign and client names, and the terms of earlier purge censuses. Plurals and possessives count. The list names those brands, so it is kept out of this folder.

## 5. What the bundle does today

It installs and resolves HLR. Then every skill stops at the missing `brand-context.md` and names it. That is correct until Pack v0 passes Gate 2. Nothing in the bundle is a fact about HLR beyond its name, aliases and pack path.

## 6. Open, ranked by production-blocking risk

1. **Pack v0** (Step 2, Gate 2). Until it exists the bundle runs nothing. Owner: Eddie (Chat 3 prompt).
2. **HLR's machines.** Their absolute pack path is unknown. Default: rebuild with `build_bundle.py --pack <their path>` at handoff. Owner: Eddie.
3. **Gate 1 (b), organic social.** If it adds a carousel and organic captions, they ship as 0.5.1. Owner: Eddie.
4. **Engine gaps for 0.5.1** (no workarounds). From the Gate 3 proposal (`outputs/step-4-figma/gate-3-conventions.md`): figma-plan's single-mode collections, dropped `component.*`, `font.leading` and `font.tracking`, no scopes; no font style in the token grammar; no `collections.component` in the pack contract; an em dash in asset-production frame names. From this chat: the engine's fallback lexicon is food nouns, so HLR needs its own `concrete_lexicon` (`product` key) in Pack v0, or concreteness scores near zero.
5. **Embed the pack instead** (the old per-brand plugin style). Needs an engine change (plugin-relative pack paths) and makes the pack read-only. Default: no.
