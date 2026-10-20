# HLR token proposal, Pack v0

2026-10-18, lane B. For Review 1 (HLR confirms Eddie's Gate 1 picks) and Gate 2 (Eddie ratifies the derived tokens and the contrast law). Draft for ratification throughout.

Files in `brand-pack/`: `tokens.json` (102 tokens: 28 [documented], 23 [observed], 51 [derived]), `token-model.md` (the contrast law, the type roster, the gap register, the licensing flags), `logo-assets.md`, `art-direction.md`, `asset-types.md`. Engine checks with `hlr-studio-engine` 0.5.2 `tokens_build.js` (built, not installed; run on a scratch copy of the pack, 2026-10-18): `check` grades 32 pair-roles, all pass; `export` writes CSS and Tailwind under `--hlr-`; `figma-plan` plans 104 variables and 42 text styles and exits 0 on the pack as it stood before the canvas modes; it refuses the canvas modes, and its `check` and `export` count them as findings too (every colour pair still passes), so the build waits for 0.5.3 (section 7). The installed 0.5.1 passes `check` and exports the web scale. The stand-in block is in `figma.yaml` (question 2), so every face the build loads exists.

## 1. For HLR at Review 1: the Gate 1 picks

| Pick | What the tokens do | What changes in HLR's live work |
|---|---|---|
| C4 ink and ground | `text.primary` Onyx #353535 on `background.default` Alabaster #fbf7ef (book law, p19). White stays the email page ground and the ink on photography. Forest, Onyx and Fawn become alternate ground modes. | The site (Forest on #f7f4ee), the 1200 email library and the 2025 sends move to Onyx when rebuilt. Blush #f0dfcf, #f1d6d6 and #2e1d13 leave the palette. |
| C5 faces | Saol Display (display, headlines, quotes), Saol Standard (titles, links, prices), Trade Gothic LT Std (body, eyebrows, labels, CTAs, fine print), Homemade Apple (one short script line per asset, social and email only). | 17 live families become 4; Instrument Serif, Miriam Libre, Futura PT, Avenir, Inter and the rest retire. |
| C6 CTA | The p18 outline caps box in the ink colour, not the book's Fawn (2.17:1 on white); inverse on photography and dark grounds; the p17 trailing-rule link secondary. | Five live CTA styles become one primary and one secondary; filled boxes retire. |
| C8 email width | 1200 masters with type sized for image slices: body 45, small 35. | Every type size in the email library rises about a third; the 700 rebuilds of 2026 stop. If HLR's ESP sends live text, body 28 and small 22 replace them. |
| C3 marks | The wordmark primary; the star the one decorative device; the monogram the small mark; the crest retires; the shell stays on packaging. Every mark's fill binds to `component.mark.fill`. | The crest leaves the email footers; the 2022 shell system stays out of digital work. |

## 2. Palette

| Token | Hex | CMYK | Pantone | Role | Tag |
|---|---|---|---|---|---|
| `color.brand.onyx` | #353535 | C69 M63 Y62 K57 | 418 C / 419 U | the ink | [documented p19] |
| `color.brand.alabaster` | #fbf7ef | C1 M2 Y5 K0 | none given | the default ground | [documented p19] |
| `color.brand.sea-salt` | #e0e3e5 | C11 M7 Y7 K0 | 649 C / 649 U | none (question 9) | [documented p19] |
| `color.brand.forest` | #17280a | C74 M55 Y83 K73 | 627 C / 627 U | alternate ground | [documented p19] |
| `color.brand.fawn` | #beada3 | C26 M29 Y33 K0 | 7528 C / 7528 U | alternate ground; accent ink on Forest and Onyx | [documented p19] |
| `color.extended.white` | #ffffff | | | email page; ink on photography | [observed] |
| `color.extended.scrim` | #00000080 | | | optional 50 percent overlay under copy on photography | [observed] |
| `color.extended.neutral-50` to `-900` | #f4efe9, #ece8e3, #dcd8d4, #c5c2be, #aca9a5, #918f8b, #797774, #63615f, #514f4e, #454342 | | | bands, placeholders, muted ink | 100 [observed]; the rest [derived] |

Gilt stays a print foil (p19) with no screen token.

Semantic, light mode: `background.default` Alabaster, `background.email-page` white, `background.subtle` neutral-100, `background.placeholder` neutral-200, `background.scrim`; `text.primary` Onyx, `text.muted` neutral-700, `text.on-photo` white; `interactive.cta` and `interactive.link` Onyx. Component tokens alias these, so a frame set to a ground mode switches everything inside it (Gate 3 call 4).

## 3. The contrast law

Floors: body 4.5:1; display 3.0:1, for the headline and display steps only (the only steps at WCAG large-text size on every canvas); ui 3.0:1.

| Ground | Ink | Ratio | Carries |
|---|---|---|---|
| Alabaster | Onyx | 11.48 | everything; muted neutral-700 at 5.77 |
| White (email page) | Onyx | 12.27 | everything; muted 6.17 |
| neutral-100 band | Onyx | 10.06 | everything; muted 5.06 |
| Fawn | Onyx | 5.66 | everything; no muted ink |
| Forest | Alabaster | 14.62 | everything; Fawn accent 7.21; muted neutral-300 8.80 |
| Onyx | Alabaster | 11.48 | everything; Fawn accent 5.66; muted neutral-300 6.91 |
| Photography | white | judged by eye on the real image at review | the 50 percent overlay optional; no pair test (Eddie, 2026-10-18) |

Never: Fawn as an ink on Alabaster (2.03) or white (2.17); light ink on Fawn (2.03); copy over a busy or light area of a photo. Every ground in the roster carries body copy, so no ground is display-only. Where a slot would land on a failing pair, its copy is carded on a certified ground or declared `not_rendered_on` in its slot map. Candidate values for the alternate modes: `token-model.md` section 2.

## 4. Type

Ramp, a perfect fourth above the floors, one value per canvas mode (Gate 2 question 1). Floors: web and IAB display body 14 and small 12 CSS px (Gate 2 call 5 a); 1080 canvases 40 and 32 (14 and 11 rendered px on a 375 phone); email 45 and 35 (Gate 1 C8):

| Step | web | social (1080) | email (1200) |
|---|---|---|---|
| label | 12 | 32 | 35 |
| body | 14 | 40 | 45 |
| title | 19 | 54 | 60 |
| headline | 25 | 72 | 80 |
| display-s | 33 | 96 | 106 |
| display-m | 44 | 127 | 142 |
| display-l | 59 | 170 | 189 |
| display-xl | 79 | 226 | 251 |

Roster: 15 text styles named by role and size; the frame's canvas mode sets the size. Display Light for display (p16, headline one), Display Regular for headlines (p16, headline two), Display Light for quotes (question 6), Standard Regular for titles and links, Standard Medium for prices (p16), Trade Gothic Regular for body and eyebrows, Bold for labels and CTA labels, caps tracked 0.2em (p17, p18), Homemade Apple for script. Leading from the book where it states one (display 1.0, quote 1.29, link 1.44, body 1.47). Full table: `token-model.md` section 3.

`font.family.*` names the real faces (C5). The Figma build sets the stand-ins in `figma.yaml` `fonts.build_stand_ins` (Instrument Serif for Saol, Inter for Trade Gothic; Homemade Apple is real), and Eddie switches the family variables in the desktop app (Gate 3 call 7, path 1). The license flag stays raised: Saol and Trade Gothic have no license files on disk.

## 5. Layout

- Space: a 4-based scale, `space.0` to `space.40` in Tailwind numbering (`space.4` is 16 px, `space.20` is 80 px). It normalises the observed gaps 10, 15, 20 and paddings 40, 50, 60.
- Margins: `space.email-margin` 80 [observed]; `space.social-margin` 64 [derived from 62 and 63]. Web margins, grid and breakpoints wait for Gate 4; then the margins fold into one canvas-moded `space.margin`.
- Radius: `radius.none` 0 [observed on 11,838 nodes]; every non-zero radius retires.
- Strokes: rules 1 px; the CTA outline `stroke.cta`, 1 px on `web` and 2 px on `email` [observed] (2 px on `social`, unused [derived]), which `component.cta.weight` aliases so one CTA element serves every canvas.

## 6. Questions, ranked by production-blocking risk

Eddie, at Gate 2:

1. **Type sizes per canvas.** Ruled (Eddie, 2026-10-18): option 2, canvas modes on `HLR / Layout` (`web`, `social`, `email`) and one roster of 15 styles. Amends Gate 3 call 4 for Layout. Built into `tokens.json`, with the CTA stroke weight on the canvas modes too; the engine support is 0.5.3 (section 7).
2. **Stand-in styles for the Figma build.** Ruled (Eddie, 2026-10-18): option 1. `figma.yaml` carries `fonts.build_stand_in_styles`: for Instrument Serif, Light and Medium build as Regular, Light Italic and Regular Italic as Italic; Inter carries Trade Gothic's Regular and Bold. Every face the build loads exists, and the switch in the desktop app covers eight variables, three families and five styles (the plan's switch list).
3. **Leading and tracking.** Ruled (Eddie, 2026-10-18): option 2. They stay set on each text style, unbound, in percent: percent follows the size in every canvas mode, and `tokens.json` keeps the unitless leading and em tracking the CSS uses. Figma binds a number variable to line height and letter spacing only as pixels.
4. **Scrim.** Ruled (Eddie, 2026-10-18): no pair test. Copy on photography is judged by eye on the real image at review; the overlay stays as an optional tool at the observed 50 percent; copy over a placeholder is reported unchecked.
5. **Neutral ramp and muted ink.** Ten steps from Alabaster toward Onyx, anchored on the observed warm email grey (#ece8e3 as neutral-100); muted ink neutral-700 on light grounds, neutral-300 on Forest and Onyx. 1. Ratify as built. 2. Keep only the steps with a role (100, 200, 300, 700). Cost: the next grey becomes a retrofit (the playbook's lesson). Default 1.
6. **Pull quote face** (the book disagrees with itself). 1. Saol Display Light (p18, the live site). 2. Saol Standard Regular (p16). Default 1.
7. **The italic accent word**, in every channel and not in the book. 1. Ratify: one word per display line or headline, as a range override. 2. Retire it (p17's headline is roman). Default 1; HLR hears it at Review 1.
8. **Space scale and the social margin.** 1. Ratify as built. 2. An 8-based scale. Default 1.

HLR, at Review 1 (adding to Brand Review v2's list):

1. Licenses for Saol Display, Saol Standard and Trade Gothic: desktop, web, and type rendered into email slices and social and paid art. Blocks every shipped asset.
2. Vectors for the star and the monogram lockup with the star; clear space and minimum sizes; whether the stacked lockup is current. Blocks the star in every master.
3. C4, C5, C6, C8 and C3 as in section 1, and how the ESP builds sends (slices or live text, at what width).
4. A role for Sea Salt, or its retirement; a role for the struck-price red, or its retirement.
5. Image rights, and releases for people in imagery (`faces_policy`).

## 7. For the other lanes

- **Lane E** (File map): `tokens: tokens.json`, `token_model: token-model.md`, `logo_assets: logo-assets.md`, `art_direction: art-direction.md`, `asset_types: asset-types.md`; `figma_config: figma.yaml` (no change from lane B); `faces_policy: null` (gap, owner HLR). Ready to paste:
  ```json
  "type_ruling": { "stack": ["Saol Display", "Saol Standard", "Trade Gothic LT Std", "Homemade Apple"], "decided_on": "2026-10-17", "decided_by": "Eddie (Gate 1 C5), for HLR to confirm at Review 1", "supersedes": ["17 live families (Brand Review v2, C5)"], "source": "DECISIONS.md 2026-10-17" }
  ```
- **Lane H, 0.5.3** (Gate 2 question 1; Chat 5 needs it). 0.5.2 reads the ground-mode grammar, the family links and the stand-in style map as built here. 0.5.3 adds, tests first:
  1. Layout modes declared at the root (`"layout": ["web", "social", "email"]`, the first the default), accepted by `check`, `export` and `figma-plan` (0.5.2 counts them as findings in all three). The plan creates them in `HLR / Layout`, renaming the recorded `default` mode (`figma.yaml`, 7:3) to `web` and recording the new mode ids.
  2. A Layout token with `$extensions.com.hlr.modes` states every alternate canvas (a missing one is a finding); a Layout token without modes holds its `$value` on every canvas; every `font.size.*` and `stroke.*` token carries modes, or it is a finding.
  3. A `stroke` category in Layout, scoped to stroke weight, and a component token aliasing a Layout token (`component.cta.weight` to `stroke.cta`).
  4. `export` writes CSS and Tailwind from `web` only.
  5. The roster's 15 styles bind size to the moded variable; leading, tracking and case stay set on each style.
  6. asset-production sets each master's canvas mode on its root (email masters `email`; feed, story and Meta paid `social`; web and IAB display `web`), leaves elements on Auto, and measures and lints sizes in the master's mode.
  Ground modes are untouched: a frame carries both.
- **Chat 5** (Foundations, on 0.5.3): the roster in `$extensions.com.hlr.text_styles`; the Type board shows each style in all three canvas modes; the certified-pairs board from contrast-pairs (20 entries: 16 certified pairs, 4 recorded with a restriction); the strictness map has no owner yet (gap K3).
- Expected from 0.5.3 `figma-plan` (counted from `tokens.json`): Primitives 17, Semantic 10, Component 16, Layout 45 across three canvas modes, 15 text styles; not planned 14 (`font.weight` 4, `font.leading` 8, `font.tracking` 2).
