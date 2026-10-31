# HLR forge explainer: plan

2026-10-23. A proposal; nothing is built. Read for it: PROGRESSION.md; the 2026-10-23 entries of DECISIONS.md and LEARNINGS.md; REVIEW.md section 4; the playbook, sections 1 to 3; `brand-pack/brand-context.md` (Gaps and owners, File map); the engine README (`hlr-studio-engine` 0.5.3); the demo run in `outputs/step-4-figma/demo-email/`; `outputs/step-4-figma/engine-gaps-chat6.md` (G7); Anthropic's Claude Design announcement (2026-04-17).

## 1. Calls for Eddie, ranked by what blocks the build

1. **Reader and depth.**
   - a. One page, plain by default, with a Technical toggle that adds paths, ids, scripts and the DECISIONS lines. **Default.** One map for both of you and one thing to keep current; the plain text takes discipline.
   - b. Two pages, HLR's and the operator's. Each fits its reader; twice the upkeep, and they drift apart.
   - c. The operator page now, HLR's at handoff. Cheapest now; HLR learns nothing before handoff.
2. **Where the content comes from.**
   - a. Generated from the pack: every rule quoted verbatim with its file and key, the page stamped with the brand home's commit, and a drift guard that fails when a quote leaves its source (section 4). The script takes `--pack`, so HLR's session rebuilds it after handoff. **Default.**
   - b. Written by hand once, stamped "as of". About a third cheaper; it drifts at the first gate ("A record kept in two places drifts", LEARNINGS 2026-10-23).
3. **When HLR sees it, and the run it walks through.**
   - a. Review 2, walking the demo run (the made-to-order pendants), labelled a rehearsal on a brief Claude wrote; the real brief replaces it after Step 5. **Default.**
   - b. Review 3, walking the real brief. A real example; HLR waits for it.
4. **The comparison.**
   - a. Claude Design only, dated and sourced, its "better at" list as full as the forge's; cost relative in the plain view, measured tokens in the Technical view. **Default.**
   - b. Also the category (Canva, Adobe Express, Figma Make), a row each. More to research and keep current.
   - c. Left out of HLR's view.
5. **Change requests on the page.**
   - a. Not in v1. Each rule card names its owner, its file and what re-runs; requests reach Eddie as they do now. **Default.**
   - b. In v1: a "Propose a change" form on each card, stored in the page's shared database; Claude reads the requests and routes each through its tier. The loop closes in context; anyone with the link can write to it, and the build needs the artifact capabilities.
6. **Look.**
   - a. HLR's own tokens (`brand-pack/web/tokens.css`, the night ground as dark mode), with OFL stand-in faces named on the page; the licensed faces stay out while their license flag is raised. The page shows the tokens at work. **Default.**
   - b. Neutral styling, so the page never reads as a brand deliverable.

Found while planning (default: the build chat fixes it): `demo-email/made-to-order-pendants.intake.md` still reads "NOT READY: FAIL" (the 1200 breakpoint, engine gap G7), while `made-to-order-pendants.brief-lint.json` reads PASS after G7's workaround. The build re-renders the intake from the passing brief and keeps the failed run as G7's evidence, so the page shows both, in order.

For HLR (Review 1 or 2, not blocking): who on HLR's team owns products, claims, voice and design day to day, so each card names a role instead of "HLR".

## 2. Purpose

Eddie (2026-10-23): help HLR and Eddie understand how the system works, guided and intuitive, so its rules and structure can be reviewed and updated to calibrate the forge as the business changes.

In about 20 minutes, a reader on HLR's team can:

1. Trace one email from the ask to the files the email platform sends: what each stage takes, what it makes, and the human call at each checkpoint.
2. Find the file and the owner behind any rule an output follows: a word it will not use, the module it chose, a color pair it allowed.
3. Say what changes, who approves it and what re-runs when the business changes.
4. Choose the forge or Claude Design for a job, and say why.

From the three skills:

- learn: diagnose first (a reader picker sets the path and depth); one step at a time (a stepper, never the whole mechanism animated at once); predict, then reveal (one optional question per stage); a short trace-it check; a plain "you can now" close.
- thinking-partner: the brief stress-tested in section 7.
- web-artifacts-builder: React 18, TypeScript, Tailwind and shadcn/ui, bundled by Parcel into one HTML file, published as a private artifact.

## 3. The page

### 3.1 Start (core)

"Who's reading?": on HLR's team, running the forge, or the overview. It sets the path and the Plain or Technical default. Then the system in one picture: the pack (rules and facts), the engine (skills that read the pack on every run), the library (HLR's Figma building blocks), and the people who pick, ratify and mark. The stamp: date, brand-home commit, engine version.

### 3.2 The journey, from the ask to the send (core)

A stage strip with one stage open at a time. The worked example is the demo run; its 15 files are the evidence at each stage.

```
ASK -> INTAKE -> PICK A ROUTE -> COPY -> BUILD -> REVIEW -> SHIP
                     |                                       ^
                     +-- optional: SQUAD (a worker per route) |
                         -> VERIFY -> OPTIONS BOARD -> pick --+
LEARN: keep-or-cut marks -> favorites, voice model, judge rubric -> into the pack
The pack is read at every stage; the Figma library at BUILD.
```

Each stage panel: what happens, in plain words; what it reads (chips that open rulebook cards); what it makes (the demo's file, excerpted); its checks with the demo's real verdicts; the human call; one predict-first question. Where an answer is a check's verdict, the build runs that check on the example and the page shows the verdict it gave. The reads and makes below are this plan's sketch; the build takes them from each skill's SKILL.md and the demo's provenance stamps.

- **Ask.** A brief or a note. The demo brief's headings double as what a good brief holds: objective, audience, message, products, offer, channel and deliverable, must say, guidance, never say, references, success metric (`brief-made-to-order-pendants.md`).
- **Intake** (brief-intake). Structures the brief, resolves products and allowed figures, unions the brief's never-say list with the pack's prohibited patterns, routes every gap to an owner, proposes routes that differ on frame only. Reads products.json, legal-ledger.json, the prohibited patterns, type-registry-core.json, route-axes.json. Makes `.brief.json`, `.routes.json`, `.intake.md`. Human call: the route ("the angle is the one call the model never makes for you"). Predict: the brief wants a karat and the product records carry none; what does intake do? (It allows no figure and lists the gap under data.)
- **Copy** (email-copy). Writes the picked route whole, maps it to slots, cuts to budget, lints. Reads voice-contract.md, exemplars.json, concrete-lexicon.json, slotmap.yaml, the ledger. Makes `.slates.json`, `.onepager.html`, `.findings.md` (findings routed to YOU, DATA/OPS, LEGAL, SYSTEM). Checks: copy_lint PASS, fit_check PASS, voice_lint WARN on the engine's default model. Predict: a line says a crystal treats anxiety; which rule stops it?
- **Squad** (optional: squad-run, verify, options-board). A worker per route, an independent judge comparing routes in pairs, a board. Not run in the demo; shown as the branch it is, with its cost. Predict: does the judge pick the winner? (It ranks; a person picks.)
- **Build** (asset-production). Assembles the email from library modules as instances, fills the slots, places cleared photos, sets the slices to export. Reads figma.yaml, module-library.json, slotmap.yaml, tokens.json, strictness-map.md. Makes frame 63:354 on 04 Staging, `build.md`, `demo-email-preview.png`. Checks: structure lint, flex at 2x or better, canvas and face checks. Predict: the headline runs long; what gives?
- **Review** (REVIEW.md). A fresh context checks the work, up to three rounds. Predict: every check passed; is it done? (Round 1 of the email batch found a blocker every script had passed.)
- **Ship.** The slices go to the email platform, whose live footer adds the unsubscribe link and the address. Predict: why is the footer's legal line off in a sliced send?
- **Learn.** Blind keep-or-cut marks become favorites, a fitted voice model and the judge's rubric (null until Step 5). Predict: how does the forge learn HLR's taste?

### 3.3 The rulebook (core)

Every role in the File map as a card, in layers: Facts (products, brand context), Claims (the ledger, prohibited patterns), Voice (the contract, exemplars, lexicon, the taste roles), Structure (taxonomy, route axes, asset types, slot maps, module library, seam map, section library), Design (tokens, the contrast law and certified pairs, the strictness map, art direction, logo assets), Figma (figma.yaml, the library's pages), Process (provenance, gates, review tiers, the never-ships list).

A card: plain name; what it controls; file and key; one example, quoted; its provenance mix, counted live; status (ratified, awaiting Eddie's confirmation, HLR to confirm, gap); who changes it (its REVIEW.md tier and, for a design class, the strictness map's column); why it exists (the dated DECISIONS reason); what enforces it; what re-runs after a change; its open gaps. Filters by owner, provenance and status.

A "Waiting on HLR" view renders the gap register in plain words: what HLR owes (the font licenses, a claims signer, the Shopify export, the star and lockup vectors, the faces policy) and what each one unblocks.

### 3.4 When the business changes (core)

Scenario cards, predict then reveal: the files that change, who approves at which tier, what re-runs, what moves in Figma and in outputs. Each ripple below is a draft, verified at build against the engine's docs and DECISIONS before it ships.

1. A new product or collection: products.json from HLR's Shopify export, the pack-shot index, card names under the short-name rule, the longest name probed.
2. Legal clears or blocks a claim: the ledger row's status; the lint enforces it on the next run; a class of claim joins the prohibited patterns.
3. A sale or offer email: it meets open gaps on purpose (offer rules HLR has not set, C10; the struck price E-P4 not built), which shows a team in a hurry what loud absence looks like.
4. The voice shifts: the principles (Eddie ratifies a derived one, HLR confirms), exemplars with their channel, then marks refit the voice model.
5. A new color or a seasonal palette: tokens.json, the pairs re-certified, the Figma variables through the design-system skill, the boards (board drift guard), the web exports.
6. A new email type (the welcome series, the monthly energy medicine send): the taxonomy, a module only where no pattern covers it, budgets measured, a template of instances.
7. A new channel or format (paid 9:16, web): slotmap-paid.yaml, the section library, Meta's specs confirmed by a person.
8. Taste drift (the team keeps cutting one kind of line): the marks sheet, favorites, the judge rubric Eddie ratifies before a judge reads it.

### 3.5 The forge or Claude Design (core, per call 4)

Dated facts, re-checked at each rebuild. As announced 2026-04-17 (Anthropic Labs, research preview): designs, prototypes, slides, one-pagers and marketing collateral from conversation; a team design system built from a codebase and design files and applied to later projects; edits by chat, inline comments, direct text edits and adjustment controls; sharing within the organization; exports to an org URL, Canva, PDF, PPTX or standalone HTML, and a handoff bundle for Claude Code.

The line the section argues: Claude Design knows how HLR looks. The forge also knows what HLR may say, about which product, in which module, at what length, and who signs it off.

| | Claude Design | The forge |
|---|---|---|
| The job | Explore and make a visual fast | HLR's recurring email and social, on brand and on claim, in HLR's Figma library |
| Brand knowledge | A design system: colors, type, components | The pack: facts, claims, voice, taxonomy, tokens, measured slot budgets, owners, provenance on every rule |
| A fact it lacks | Relies on the prompt and its sources | Stops, names the gap and its owner |
| Claims | No claims ledger announced; the review is yours | The ledger and prohibited patterns, linted every run |
| Layout | Free-form; new layouts welcome | 21 email modules as instances: slot-stamped, flex-proven, on certified contrast pairs |
| Output | A design in Claude Design; Canva, PDF, PPTX, HTML; Claude Code handoff | A Figma frame in HLR Library on HLR's faces, slices set to export |
| The human's part | Steer by chat, comments and controls | Pick routes, ratify derived values, mark keep or cut |
| Changing the rules | Refine the design system | Edit a pack file with its owner and tier; the checks re-run |
| Setup and upkeep | Onboarding reads your files | Phase 1 is four weeks; the pack needs an owner |
| Speed and cost | A first version from a description, on subscription usage | Slower; a squad run is about 250K output tokens per route plus the judge |

Claude Design is better at: a first version from a description; any format, including ones the forge has no module or type for; shaping by pointing; no pack to keep current; Canva and PPTX; prototype to code.

The forge is better at: claims in sensitive territory (intentions, healing language); facts that stay true (no karat, stone meaning or price without a source); copy that fits measured slots on the real faces; a year of sends that look like one brand; output in Figma, where HLR's designs already live; a trail for every line; taste that calibrates to HLR's own keep-or-cut marks (from Step 5 on).

Together: concept in Claude Design; a concept that recurs graduates into the forge as a type or a module. Whether HLR's tokens can seed a Claude Design system for on-brand concepting is a test to run, not a claim to make.

### 3.6 Glossary and check (light)

Hover definitions everywhere (pack, engine, library, element, module, template, slot, budget, route, angle, ledger, lint, gate, ground, canvas, token, provenance), one list page, a five-question trace-it check with explanations, then the "you can now" close.

## 4. How it stays true

- `build_data.py` reads the pack, REVIEW.md, DECISIONS.md and the demo run and writes `explainer-data.json`: counts, tags, owners, gaps, verdicts, and the stamp (date, brand-home commit, a hash per source).
- `content.yaml` holds the plain words. Every factual line carries `source` (file and key) and `quote` (verbatim); the page shows the plain words beside the quote, never instead of it.
- `guards/explainer_drift.py` fails when a quote is missing from its source, a source hash moved since the stamp, another brand's term appears (the census in `claude-cowork/_tools/release-checks/`), our text carries an em dash (built with `chr(0x2014)` in the scan), or an example states a figure the pack does not carry. Its must-fail cases live in `guards/tests/`.
- Never quoted: `_setup/` (it names other brands, which is why `.gitignore` keeps it out of the repo HLR may receive).
- Rebuilt at each gate close and each engine release with one command, data then bundle, then republished to the same artifact.

## 5. Look and build

- Stack per web-artifacts-builder: init, develop, bundle to one HTML file. shadcn Tabs, Accordion, Sheet, Tooltip, Toggle, Badge and Command (search across cards); the journey map in SVG and CSS, no graph library.
- Styling per call 6. Text sits only on the pack's certified pairs. The web focus ring is an open pack gap (token-model K2), so the page uses its own focus style, labelled as the page's, not HLR's.
- Phone (390) and desktop (1440), light and dark, a keyboard path through the stepper and the cards; a screenshot of every section before review.
- Before the page: the Artifact quickstart, artifact-design and frontend-design, then the builder's scripts. Published private; Eddie shares it.

## 6. Steps, checks and estimate

| Step | Work | Check | Estimate |
|---|---|---|---|
| A1 | `build_data.py`, `content.yaml` (quotes first, plain words second), the intake re-render, the comparison facts re-verified | the drift guard and its must-fail tests | 100K to 150K tokens |
| A2 | The page, bundled and published private | screenshots at 390 and 1440, light and dark | 100K to 200K |
| A3 | One fresh-context review, scoped by what to verify: each quote against its source, each ripple against the engine docs and DECISIONS, the comparison against Anthropic's pages, the plain view read as a newcomer | REVIEW.md section 5, up to three rounds | 360K to 440K a round (measured here, LEARNINGS 2026-10-23) |
| Go | Eddie's go before HLR sees it (REVIEW.md tier 2) | a dated DECISIONS line | |
| B | Change requests (call 5 b) | | 80K to 150K |

Phase A: about 0.6M to 0.8M tokens, most of it the review. Files in `outputs/explainer/`: this plan, `build_data.py`, `content.yaml`, `explainer-data.json`, `guards/`, `app/` (source, no `node_modules`), `explainer.html` and the review notes.

## 7. The brief, stress-tested

- Curse of Knowledge: the record speaks in ids (M15, R3-01, Gate 2 call 1 b, lane H). The plain view leads with names; the ids live in the Technical view.
- Map is not the Territory: the page is a map of the pack; section 4 is there so it cannot drift silently.
- Chesterton's Fence: each card shows why its rule exists before anyone changes it.
- Second-order effects: a page that edited the pack would skip ratification, re-measurement and the guards. The page never writes the pack; at most it files a request (call 5 b).
- Steel man: Claude Design's column has to be as strong as the forge's, or the comparison reads as a pitch and HLR stops trusting the rest.
- Opportunity cost: about one review round of tokens against Step 4's open batches. Generated data keeps rebuilds cheap, so building now does not mean building twice.
- Pre-mortem, three months after handoff: stale (section 4); too dense to open twice (call 1 a, the stepper); explains what but not how to change (3.3 and 3.4 are the core); over-sells (3.5); leaks internal or other-brand detail (the census, the toggle); nobody rebuilds it (`--pack`).
- Key insight: the forge beats a general tool only while the pack is current. The rulebook and the scenarios carry the most weight; the journey teaches; the comparison earns trust.
- Assumptions to watch: HLR names owners for the pack; the flow stays as 0.5.3 runs it (0.5.4 and 0.5.5 change lints and severities, so the data rebuilds at each release); Claude Design changes fast; the rehearsal stands in for a real brief until Step 5.

## 8. Build chat prompt (paste-ready once the calls are ruled)

> HLR explainer, Phase A. Open with PROGRESSION.md, then the latest DECISIONS.md and LEARNINGS.md entries, then `outputs/explainer/plan.md` and Eddie's rulings on its calls. Build A1 and A2 per sections 3 to 6: the content quoted from the pack with sources, the drift guard with its must-fail tests, the intake re-render, the page through web-artifacts-builder, published private. Then A3, one fresh-context review scoped as section 6 says, its estimate stated before it starts. Write only `outputs/explainer/`, plus the demo intake re-render. Patch PROGRESSION.md, DECISIONS.md and LEARNINGS.md once at close and end with the five-line status.
