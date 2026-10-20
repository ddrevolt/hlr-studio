# Gate 3: Figma conventions (proposal)

2026-10-17, Step 4 (Chat 5). For Eddie's ruling. Nothing is written to Figma until he says go.
Library: Highlight-Rituals-Design-Forge `Gq3yUbLs6MCRM0nOhjvnIW`. Reference, read-only: `LYyYXPDUHVoAABh865EvMI`.

## 0. Sequencing: the build cannot run yet

- `brand-pack/` holds only `figma.yaml`: no `tokens.json`, `brand-context.md`, contrast pairs, `logo-assets.md` or `strictness_map`. `slotmap.yaml` does not exist.
- HLR is not in the engine registry, so the design-system skill stops at brand resolution and `tokens_build.js figma-plan` has nothing to plan from.
- PROGRESSION still has Gate 1 (b), Step 1b, Step 2 with Gate 2, and Step 3 open. This is Chat 5's prompt; Chats 2 to 4 have not run.

1. **Default.** Rule on Gate 3 now (it feeds Pack v0's `figma.yaml`), then Chats 2, 3 and 4 in order. Foundations resumes after Step 3, through the engine, with the gaps in section 1 fixed in the Step 3 patch release. Cost: Figma waits three chats.
2. Rule on Gate 3 and, on go, create the five pages only. Cost: little gained. The file key goes into `figma.yaml` without touching Figma, and everything with a value still waits.
3. Compress: a Foundations-only token set and Gate 2 in this chat, then build. Cost: reverses the 2026-10-17 ruling that the pattern review comes before Pack v0, builds outside the engine (HLR unregistered), and puts derived values in Figma before the patterns that should shape them.

## 1. Findings that shape the options

- **Fonts.** Figma takes custom font uploads only on Organization and Enterprise plans. Eddie's only edit seat is a Pro team, so that is where this library sits, and use_figma cannot load Saol or Trade Gothic server-side whatever the license says. The licenses are unconfirmed anyway (`fonts.licensed: false`). Real faces need HLR's licenses and an org-plan admin to upload them.
- **Engine gaps** (for the Step 3 release, no workarounds): `figma-plan` emits three single-mode collections and silently drops `component.*`, `font.leading` and `font.tracking`; it plans no scopes; the token grammar has no font style; the pack contract has no `collections.component`; asset-production puts an em dash between prefix and name in frame names, which the HLR rule forbids.
- **Marks.** The three wordmark SVGs (`SVG LOGOS/`, 2024-03) share one geometry (identical path data) and differ only in fill: #231f20, #17280a, #fff. No background rect. `HLR-Jewelry Logo_Monogram.svg` (2024-09, 3 paths) may be the monogram vector the review called PNG only; it needs a visual match against `Logo Marks_Black/HLR_black.png`. Shell, star, crest and stacked lockup are PNG only (C3).
- **Library file.** One empty page, `Page 1` (0:1). Local variables and styles get read at build start.

## 2. Conventions (default first)

1. **File**
   a. Keep the name until HLR rules name forms (C1); rename at handoff to HLR's hub.
   b. Rename now (for example "HLR Library"). Tradeoff: commits to a name form HLR has not ruled.
2. **Pages**
   a. `00 Foundations`, `01 Elements`, `02 Modules`, `03 Templates`, `04 Staging` (playbook section 4). Channels are sections inside 01 to 03. `Page 1` is renamed to `00 Foundations`, not deleted.
   b. Channel pages for the heavy stages: `02 Modules Email`, `02 Modules Social`, `03 Templates Email`, `03 Templates Social`. Tradeoff: faster loads and a one-to-one family-to-page map in `figma.yaml`; more ids to keep current, and paid or web would add pages.
3. **Collections**
   a. Four, in playbook order: `HLR / Primitives`, `HLR / Semantic` (aliases only), `HLR / Component` (modes), `HLR / Layout`. Component needs the engine fix.
   b. Three, as the engine plans today; Component added when the CTA lands. Tradeoff: no engine change now, but modes arrive after elements exist, the retrofit the intake rule exists to prevent.
   The `HLR /` prefix beats `High Light Rituals /` or none: short, survives C1, and tells collections apart when several libraries are enabled.
4. **Modes**
   a. Primitives, Semantic and Layout: one mode, `default`. Component: one mode per ground, named by role in lowercase (for example `light`, `dark`), never by hex or palette name; roster at Gate 4; each element variant pinned to its mode. Per-channel ink (C4) lands as ground modes, whatever HLR rules.
   b. Semantic modes per channel (`email`, `social`, `web`). Tradeoff: states C4 directly, but splits theming across two collections and needs mode resolution in the engine.
5. **Scopes** (set on every variable; nothing keeps `ALL_SCOPES`)
   a. Primitives: none, so they stay out of pickers while aliases still resolve. Semantic `background`: frame and shape fill. `text`: text fill. `interactive`: fills and stroke. Component: the one property each token drives. `space`: gap and padding. `radius`: corner radius. `font/*`: the matching font scope. `breakpoint`: none.
   b. Primitives also open to fills and strokes for one-off art. Tradeoff: matches the engine's "primitives only for one-off art", but invites bypassing the semantic tier; the playbook's default posture is locked.
6. **Variable names**
   a. The Figma name mirrors the `tokens.json` path, dots to slashes, lowercase kebab: `color/brand/onyx`, `color/semantic/text/primary`, `component/cta/fill`, `font/size/body-m`. Primitives keep the book's color names (p19); colors observed but absent from the book sit under `color/extended/` until C4 lands; the neutral ramp is `color/extended/neutral-50` to `neutral-900`. Each description opens with its tag and source (`[documented] book p19`, `[observed] site 2026-10-17`, `[derived] Gate 2`). Web code syntax is set to the CSS name: prefix `--hlr-`, `$extensions` namespace `com.hlr`.
   b. Shorter picker names (drop `color/semantic/`). Tradeoff: tidier pickers; breaks the one-to-one path to the CSS name and needs an engine change.
7. **Text styles**
   a. Named by role and size, lowercase, never by face: `display/xl`, `heading/m`, `body/m`, `label/s` (the roster comes from Pack v0). Family, style, size, leading and tracking all bound to Layout variables, so the face swap is a variable edit. Stand-in faces with the flag raised, taken from HLR's live work: Instrument Serif (OFL, cleared) in the Saol roles, Inter (OFL, no license file on disk yet) in the Trade Gothic roles, both `[derived]` and ratified at Gate 2 as the `$extensions` fallbacks. The Type board carries a visible line: stand-in faces, not licensed for production. Slot budgets measured on stand-ins are re-measured after the swap.
   b. No stand-ins: text styles wait for licensed faces on an org plan. Tradeoff: no swap pass, but no module can be built or measured until HLR delivers.
   c. Per-channel ramps (`email/heading/m`, `social/heading/m`). Tradeoff: exact sizes per canvas at about twice the styles; one ramp is enough if email masters are 2x.
8. **Marks**
   a. One component per mark: the client SVG's geometry unchanged, fill bound to `component/mark/fill` so the colorway follows the ground mode; named `Marks/<mark>`. Now: the wordmark. Then the monogram, after the visual match. The PNG-only marks wait for vectors from HLR (C3); the 2022 archive vectors stay out unless HLR rules them current.
   b. One component per delivered file (three wordmarks). Tradeoff: literal to the source, but three masters, and the clashing blacks (#231f20 against Onyx #353535) get baked into the library instead of settled once in tokens.
9. **Foundations boards**
   a. On `00 Foundations`, left to right: `Color`, `Type`, `Layout`, `Marks`, `Certified pairs`, `Strictness map`. Every swatch and specimen bound to variables and styles. Certified pairs: a ground-by-ink grid from `tokens.json → contrast-pairs`; each cell shows ratio, floor (body 4.5, display 3.0, ui 3.0) and status (certified, display only, decorative). Strictness map: one row per element class (tier, mode switching, floor, where content and claims rules live, who can change it), from the pack's `strictness_map` role. Each board screenshot-checked.
   b. Pairs and strictness on a page of their own. Tradeoff: easier to find; splits what a designer reads before building.
10. **Slots and names**
   a. Namespace `hlr`, key `slot` (recorded). Prefixes: `E##` elements; `M##` email modules; `S##` organic social, where S01 (feed post set) and S02 (story or reel cover) keep the engine's numbers; `P##` paid and `W##` web reserved until scope (Q11). Templates are `T##` frames (ours; the engine is silent), unstamped, compositions in `slotmap.yaml`. Numbers are never reused. Frame and component names: `<PREFIX> <Name>` with a space, grouped by channel in component names (`Email/M01 <Name>`).
   b. Channel-qualified prefixes (`EM##`, `SO##`). Tradeoff: self-describing, but off the engine grammar and its portable social recipes.

Breakpoints and the email width (C8) stay with Gate 4.

Ranked by rework if wrong: 3, 4 and 7 (every binding depends on them), then 5, 6, 8 and 10, then 1, 2 and 9 (cheap to change later).

Sources: playbook section 4; engine 0.4.0 (`design-system/SKILL.md`, `references/token-model.md`, `tokens_build.js`, `references/pack-contract.md`, `asset-production/references/slot-contract.md` and `asset-types.md`); Brand Review v2 (C1, C3, C4, C8; Q2, Q11); Figma `whoami` 2026-10-17; Figma Help, "Upload custom fonts to an organization" (help.figma.com/hc/en-us/articles/360039956774).

## Ruling (Eddie, 2026-10-17, chat 4)

1. b: rename the file now, to `HLR Library`.
2. a: pages `00 Foundations`, `01 Elements`, `02 Modules`, `03 Templates`, `04 Staging`; `Page 1` renamed to `00 Foundations`.
3. a: four collections, `HLR / Primitives`, `HLR / Semantic`, `HLR / Component`, `HLR / Layout`.
4. Delegated to Claude, on best practice: ground modes on `HLR / Semantic`, one per ground, named by role (`light` the default; the alternates named at Gate 4 with the roster). Primitives, Component and Layout keep one mode, `default`. Component tokens alias semantic tokens, so a frame set to a ground switches everything inside it. Replaces 4 a.
5. b: every variable scoped; primitives also open to fills and strokes for one-off art.
6. a: names mirror `tokens.json` paths; CSS prefix `--hlr-`; `$extensions` namespace `com.hlr`.
7. Changed: role and size names bound to variables, set in the real faces (Saol, Trade Gothic, Homemade Apple), no stand-ins. The license flag stays raised (rule 8) until HLR confirms the licenses.
8. a: one component per mark, fill bound to a variable.
9. a: the six boards on `00 Foundations`.
10. a: namespace `hlr`, key `slot`; `E##` elements, `M##` email, `S##` social (S01 to S04 since 0.5.1), `P##` and `W##` reserved, `T##` templates; names `<PREFIX> <Name>`.

Section 0 is overtaken: Gate 1 is closed and 0.5.1 shipped. The variables and text styles wait for Pack v0's `tokens.json` (lane B) and Gate 2.

Built at the ruling (2026-10-17): pages `00 Foundations` (0:1), `01 Elements` (7:2), `02 Modules` (7:3), `03 Templates` (7:4), `04 Staging` (7:5); collections `HLR / Primitives` (7:6, mode `default`), `HLR / Semantic` (7:7, mode `light`), `HLR / Component` (7:8, `default`), `HLR / Layout` (7:9, `default`), all empty; the six boards on `00 Foundations` (7:10 to 7:15), empty. Not done: the file rename (the Plugin API cannot rename a file; rename it to `HLR Library` in Figma); the text styles, which wait for Pack v0's ramp, and whose real faces the build path cannot load (Saol and Trade Gothic are installed on the Mac only).
