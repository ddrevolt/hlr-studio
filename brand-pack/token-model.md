# HLR token model: gap register, contrast law, roster and ratification log

Pack role `token_model`. Lane B, Pack v0, 2026-10-18. The naming grammar and the ratification flow are the engine's (`design-system/references/token-model.md`); this file holds HLR's data. Status: ratified 2026-10-22 by Eddie at Gate 2 (the Gate 2 package at its defaults; section 6 logs each call); the alternate grounds were named at Gate 4 on 2026-10-23 (`warm`, `deep`, `night`; decided by Claude under Eddie's delegation, for Eddie to confirm), and HLR confirms the Gate 1 picks (C3, C4, C5, C6, C8) at Review 1.

Tags: [documented] the brand book `061022_HighLight_BrandBook_DS.pdf` (cited by PDF page) or the client; [observed] live work (`outputs/step-1-review/`) or the client's files; [derived] our proposal.

## 1. What `tokens.json` carries

102 tokens: 82 [documented], 20 [observed], 0 [derived] (counted 2026-10-22, after the Gate 2 rulings).

| Tier | Paths | Collection (Gate 3 call 3 a) | Modes |
|---|---|---|---|
| Primitives | `color.brand.*` (the five p19 colours), `color.extended.*` (white, the scrim, the neutral ramp 50 to 900) | `HLR / Primitives` | `default` |
| Semantic | `color.semantic.background.*`, `.text.*`, `.interactive.*`, aliases only | `HLR / Semantic` | ground modes (Gate 3 call 4): `light` (the default), `warm` (Fawn), `deep` (Forest) and `night` (Onyx), named by role at Gate 4 (2026-10-23) |
| Component | `component.cta.*`, `.link.*`, `.rule.*`, `.callout.*`, `.mark.*`, `.placeholder.*`; colours alias semantic tokens, canvas-dependent geometry aliases Layout (`component.cta.weight` to `stroke.cta`) | `HLR / Component` | `default` (Gate 3 call 4) |
| Layout | `font.*`, `space.*`, `radius.*`, `stroke.*` | `HLR / Layout` | canvas modes: `web` (the default), `social` (1080 canvases), `email` (1200 masters); Gate 2 question 1, Eddie, 2026-10-18, amending Gate 3 call 4 for Layout |

- Names mirror paths: `color/semantic/text/primary` in Figma, `--hlr-color-semantic-text-primary` in CSS, `$extensions` namespace `com.hlr` (Gate 3 call 6 a).
- Mode grammar. The root declares the modes per collection in `$extensions.com.hlr.modes`. Ground modes (the engine's grammar since 0.5.2): a semantic token's `$value` is its `light` value; every semantic token states each alternate ground (`warm`, `deep`, `night`, named at Gate 4) as `$extensions.com.hlr.modes.<mode>` (values in section 2). Canvas modes (Gate 2 question 1): a Layout token's `$value` is its `web` value; a token whose value depends on the canvas states `social` and `email` under `$extensions.com.hlr.modes`, and every `font.size.*` and `stroke.*` token must; a Layout token without modes holds its `$value` on every canvas [documented: the space scale, radius, families and styles do not change by canvas] (ratified 2026-10-22 by Eddie, Gate 2 package call 1). A frame carries a ground mode and a canvas mode at once.
- Canvas-dependent geometry lives in Layout with a value per canvas mode, and a component aliases it (`component.cta.weight` to `stroke.cta`), as component colours alias the semantic grounds; an element then serves every canvas. A master sets its canvas mode on its root; an element stays on Auto. The margins stay two tokens (`space.email-margin`, `space.social-margin`) until Gate 4 sets the web margins, then fold into one canvas-moded `space.margin` (gap L2).
- Format notes: colours are hex strings, as `tokens_build.js` reads them (DTCG 2025.10 also allows an object form); the scrim is 8-digit hex (#00000080). `font.style.*` (Figma face-style names) and `font.tracking.*` (em) carry no `$type`: DTCG has no type for a face-style name, and its dimension units are px and rem, while tracking is in em so it holds at every canvas size. `font.leading.*` is a unitless `number`.
- The engine. The installed engine is 0.5.3 (Eddie, 2026-10-22): `check` passes in every ground and canvas, and `figma-plan` plans the four collections with their ground and canvas modes (built in Figma by Chat 5, 2026-10-23). 0.5.2 refuses modes outside Semantic and does not plan the `stroke` category: its `check`, `export` and `figma-plan` all count the canvas modes as findings and stop (every colour pair still passes), so 0.5.2 is not installed and 0.5.3 adds both (spec: `outputs/step-2-pack/token-proposal.md` section 7). Before the canvas modes, 0.5.2 `figma-plan` exited 0 on a scratch copy (Primitives 17, Semantic 10, Component 17, Layout 60, 42 text styles). Not planned, by design: `font.leading` and `font.tracking`, set on each text style, unbound, in percent, and `font.weight`, which serves the web. The stand-in block is in `figma.yaml` (Gate 2 question 2, 2026-10-18), so every face the build loads exists.
- The text style roster rides in `$extensions.com.hlr.text_styles` (section 3). `tokens_build.js` ignores `$` keys, so it never reaches CSS.

## 2. The contrast law

Floors (WCAG 2): body 4.5:1; display 3.0:1, for the headline and display steps only, because only they clear the WCAG large-text size on every canvas (web 24 px; 1080 canvases 69; 1200 masters 77); ui 3.0:1, for the CTA outline and rules that carry meaning. [documented; floors per addendum item 5] (ratified 2026-10-22 by Eddie, Gate 2 package call 2)

| Ground | Ink | Ratio | Body | Display | Accent and muted inks |
|---|---|---|---|---|---|
| Alabaster, the default | Onyx | 11.48 | yes | yes | muted neutral-700, 5.77 |
| White, the email page | Onyx | 12.27 | yes | yes | muted neutral-700, 6.17 |
| neutral-100, the grey band | Onyx | 10.06 | yes | yes | muted neutral-700, 5.06 |
| neutral-200, the placeholder | Onyx | 8.65 | the label only | | neutral-700 fails (4.35) |
| Fawn, alternate | Onyx | 5.66 | yes | yes | no muted ink (neutral-700 2.85); Alabaster and white fail (2.03, 2.17) |
| Forest, alternate | Alabaster | 14.62 | yes | yes | Fawn 7.21; muted neutral-300, 8.80 |
| Onyx, alternate | Alabaster | 11.48 | yes | yes | Fawn 5.66; muted neutral-300, 6.91 |
| Photography | white | judged by eye on the real image at review | | | the 50 percent overlay optional; never a pair test |
| Sea Salt | Onyx | 9.51 | not a ground | | no role (C4); a ground only if HLR names one |

1. Every ground in the roster carries body copy in its ink. None is display-only.
2. Fawn is never an ink on Alabaster, white or the neutrals, and light ink never sits on Fawn. On Forest and Onyx, Fawn may carry body and display copy as an accent.
3. Copy on photography is judged by eye on the real image at review, never tested as a pair [documented, DECISIONS 2026-10-18: Eddie's ruling, Gate 2 question 4]: a photo has no single value to test. Since 2026-10-23 an image well holds a cleared image (Eddie owns the reference file's and the site's images, DECISIONS) or, for any other image, the grey placeholder (rule 8). White copy goes where the image is calm and dark enough under it; the 50 percent overlay (`background.scrim`, observed on 9 frames) is optional, the designer's call. The build reports copy over a placeholder as unchecked (its recorded entry in contrast-pairs), not as a failure.
4. A pair absent from `tokens.json` contrast-pairs is uncertified: check it with `tokens_build.js check`, add it, then ship it (the intake rule).
5. Where a slot would land on a failing pair in some variant, its copy is carded on a certified ground, or the slot is declared `not_rendered_on` that variant in its slot map. Copy never disappears silently.

`tokens.json` contrast-pairs holds 20 entries: 9 light-mode semantic pairs, 7 candidate-ground pairs as primitives, and 4 recorded entries with empty roles and a restriction (three failures; copy over a placeholder). 0.5.2 `tokens_build.js check` (2026-10-18): 32 graded pair-roles, all pass.

Candidate values for the alternate ground modes [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 2). Gate 4 named the modes by role (2026-10-23, Claude under Eddie's delegation, for Eddie to confirm): the Forest ground is `deep`, the Onyx ground `night`, the Fawn ground `warm`. The placeholder label aliases `color.semantic.text.on-placeholder` (Onyx on every ground) [derived], since `text.primary` turns Alabaster on deep and night and would fail on the grey placeholder (1.33:1).

| Semantic token | light (default) | Forest ground | Onyx ground | Fawn ground |
|---|---|---|---|---|
| background.default | alabaster | forest | onyx | fawn |
| background.email-page | white | forest | onyx | fawn |
| background.subtle | neutral-100 | forest | onyx | fawn |
| background.placeholder | neutral-200 | neutral-200 | neutral-200 | neutral-200 |
| background.scrim | scrim | scrim | scrim | scrim |
| text.primary | onyx | alabaster | alabaster | onyx |
| text.muted | neutral-700 | neutral-300 | neutral-300 | onyx |
| text.on-photo | white | white | white | white |
| interactive.cta | onyx | alabaster | alabaster | onyx |
| interactive.link | onyx | alabaster | alabaster | onyx |

## 3. Type: ramp and text style roster

Ramp [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 3): body at the floor and a perfect fourth (1.333) above it, one rendered scale (pattern-review 1.2) with a value per canvas mode (Gate 2 question 1). Tokens `font.size.<step>`: `$value` is the web size, `social` and `email` sit in `$extensions.com.hlr.modes`. Ruled: web label 12 and body 14 (Gate 2 call 5 a, 2026-10-18); email label 35 and body 45 (Gate 1 C8, for HLR to confirm). The other values are ratified as built (Gate 2 package call 3), and the 12 px rendered floor holds on display and web only: social labels render at 11.1 px and email labels at 10.9 px on a 375 phone.

| Step | web (CSS px) | social (1080 canvases) | email (1200 masters) |
|---|---|---|---|
| label (the small floor) | 12 | 32 | 35 |
| body (the body floor) | 14 | 40 | 45 |
| title | 19 | 54 | 60 |
| headline | 25 | 72 | 80 |
| display-s | 33 | 96 | 106 |
| display-m | 44 | 127 | 142 |
| display-l | 59 | 170 | 189 |
| display-xl | 79 | 226 | 251 |

Roster (Gate 3 call 7 and Gate 2 question 1): 15 text styles named by role and size, each bound to its family, style and size variables and set in the real faces; the canvas mode of the frame sets the size. Leading, tracking and case are set on each style.

| Style | Family token | Style token | Size step | Leading | Tracking | Case |
|---|---|---|---|---|---|---|
| display/xl, /l, /m, /s | display (Saol Display) | Light | display steps | 1.0 | 0 | sentence |
| headline | display | Regular | headline | 1.1 | 0 | sentence |
| quote | display | Light | headline | 1.29 | 0 | sentence |
| title | title (Saol Standard) | Regular | title | 1.2 | 0 | sentence |
| link | title | Regular | title | 1.44 | 0 | sentence |
| price | title | Medium | title | 1.2 | 0 | |
| script | script (Homemade Apple) | Regular | title | 1.4 | 0 | as written |
| body | body (Trade Gothic LT Std) | Regular | body | 1.47 | 0 | sentence |
| eyebrow | body | Regular | label | 1.4 | 0.2em | caps |
| label | body | Bold | label | 1.4 | 0.2em | caps |
| cta | body | Bold | label | 1.4 | 0.2em | caps |
| fine | body | Regular | label | 1.4 | 0 | as written |

- The italic accent word is a range override, not a style: `font.style.display-accent` (Light Italic) or `font.style.headline-accent` (Regular Italic), same size and leading. No text style uses either, so each names its family (`$extensions.com.hlr.family`: `{font.family.display}`) for the build to load the right face (0.5.2 bundle report, section 7 item 4). One accent word per display line or headline [documented] (ratified 2026-10-22 by Eddie, Gate 2 package call 10); HLR hears it at Review 1.
- Leading and tracking are set on each text style, unbound, in percent (0.5.2): percent follows the size, so a style stays right in every canvas mode. Figma binds a number variable to line height and letter spacing only as pixels, so binding them would need a pixel value per style and canvas. Ruled unbound (Eddie, 2026-10-18, Gate 2 question 3).
- Each style exists once. Script is used on social and email only (C5); the CTA style on web and email only, since social and Meta art draw no CTA (C6) and Google art carries no overlaid copy (Gate 2 call 1).
- CSS sets `font-style: italic` for the accent roles; weights come from `font.weight.*` (Light 300, Regular 400, Medium 500, Bold 700, from the font files).

## 4. Licensing flags (project rule 8)

`figma.yaml` keeps `fonts.licensed: false` until every production face is confirmed. Every deliverable that renders text carries the flag.

| Face | Files | Evidence | State |
|---|---|---|---|
| Saol Display (Light, Light Italic, Regular, Regular Italic) | `High Light Rituals Fonts/Desktop/*.otf`; web kits for all four in `Web/` | no license file; name table points to Schick Toikka's legal page; the site self-hosts Saol | unconfirmed; owner HLR |
| Saol Standard (Regular, Regular Italic, Medium) | `Desktop/*.otf` (Regular twice: `SaolStandard-Regular (1).otf` is the same family and style) | no license file | unconfirmed; owner HLR |
| Trade Gothic LT Std (Regular, Bold, Light, Light Oblique, Oblique) | `Desktop/*.otf` | no license file | unconfirmed; owner HLR |
| Trade Gothic LT W01 (web kit) | `Web/Trade Gothic Roman + Bold/` | Monotype Webfonts Pay-As-You-Go EULA: sites the licensee owns, no email | web only |
| Homemade Apple | `homemade-apple/` | Apache 2.0, LICENSE on disk | cleared |
| Instrument Serif (Figma build stand-in) | `instrument-serif/` | SIL OFL 1.1, LICENSE on disk | cleared |
| Inter (Figma build stand-in) | none on disk | no license file on disk | confirm before any use outside the Figma build |

Open with HLR: whether the desktop licenses cover type rendered into email image slices and social and paid art.

## 5. Gap register

Status: open, [observed], [derived] proposal, ruled, conflict. Owner is who closes it.

| # | Gap | Status | Filled by | Owner | Closes at |
|---|---|---|---|---|---|
| C1 | Ink and default ground per channel | ruled by Eddie (C4), for HLR to confirm | Onyx on Alabaster; white email page; white on photography | HLR | Review 1 |
| C2 | Alternate ground modes | values ruled (ratified 2026-10-22 by Eddie, Gate 2 package call 2); names ruled at Gate 4 (2026-10-23): `warm`, `deep`, `night` | section 2 table | Eddie | Gate 4 (names), Gate 2 (values) |
| C3 | Sea Salt | open | [documented p19] primitive, no role | HLR | Review 1 |
| C4 | Neutral ramp | ruled (ratified 2026-10-22 by Eddie, Gate 2 package call 6) | 10 OKLCH steps anchored on the observed warm email grey #ece8e3 | Eddie | Gate 2 |
| C5 | Muted ink | ruled (ratified 2026-10-22 by Eddie, Gate 2 package call 6) | neutral-700 (light), neutral-300 (Forest, Onyx) | Eddie | Gate 2 |
| C6 | Scrim | ruled (Eddie, 2026-10-18): no pair test | the observed 50 percent overlay, optional | none | |
| C7 | Struck-price red #d54141 (email: 34 strike lines at 83 percent opacity) | [observed], no token | sale prices strike through in the ink | HLR | Review 1 |
| C8 | Off-palette colours, not adopted (C4) | ruled | blush #f0dfcf (an underlay); #f1d6d6 and #2e1d13 retire unless HLR names a role; the site's #f7f4ee and #f6f4ee become Alabaster at rebuild; #131313, #000000, #1f2918, #353635, #1f1f1f, #231f20 and #beada2 collapse to Onyx or Fawn | HLR | Review 1 |
| C9 | Archive mark fills (#faf8f2, #1f2918, #baada3) against p19 | conflict, flagged | tokens carry p19; marks bind to tokens | HLR | Review 1 |
| C10 | Gilt | [documented p19] foil only (Crown Royal Leaf 270) | no screen token by design; print only | none | |
| C11 | Pantone for Alabaster | open: the book prints "PMS ---" | | HLR, if print needs it | Phase 2 |
| T1 | Faces | ruled by Eddie (C5), for HLR to confirm | Saol Display, Saol Standard, Trade Gothic LT Std, Homemade Apple; every other face retires | HLR | Review 1 |
| T2 | Licenses | open | section 4 | HLR | before production |
| T3 | Faces on disk with no role | ruled (C5 retires them) | GT Walsheim Pro Bold, Cannu Regular; Trade Gothic Light and the obliques unused | none | |
| T4 | Pull quote face | ruled (ratified 2026-10-22 by Eddie, Gate 2 package call 9); the book's conflict: p16 says Saol Standard Regular, p18 Saol Display | [documented] Saol Display Light (p18, the live site) | Eddie | Gate 2 |
| T5 | Principal body specimen | conflict: p16 labels it Saol Standard Medium, p17 sets body in Saol Standard | moot under C5 (body is Trade Gothic) | none | |
| T6 | The italic accent word | ruled (ratified 2026-10-22 by Eddie, Gate 2 package call 10); [observed] every channel; not in the book (p17 roman); HLR hears it at Review 1 | `font.style.*-accent`, one word per display line or headline | Eddie, then HLR | Gate 2, Review 1 |
| T7 | Type ramp | ruled (ratified 2026-10-22 by Eddie, Gate 2 package call 3) | section 3 | Eddie | Gate 2 |
| T8 | Ramp per canvas | ruled (Eddie, 2026-10-18, Gate 2 question 1): canvas modes on Layout, `web`, `social`, `email`; 15 styles | `font.size.<step>` with a value per canvas mode; the engine support is 0.5.3 | lane H | 0.5.3 |
| T9 | Leading and tracking in Figma | ruled (Eddie, 2026-10-18, Gate 2 question 3): set on each style, unbound, in percent | Figma binds them only as pixels | none | |
| T10 | Stand-in styles: Instrument Serif has no Light, Light Italic, Regular Italic or Medium | ruled (Eddie, 2026-10-18, Gate 2 question 2) | `figma.yaml` `fonts.build_stand_in_styles`; every face the build loads exists | none | |
| T11 | Live-text email sizes (body 28, small 22) | conditional (C8) | no tokens until HLR says the ESP sends live text | HLR | Review 1 |
| T12 | Case and text-style properties a variable cannot bind | ruled (ratified 2026-10-22 by Eddie, Gate 2 package call 5) | the roster in `$extensions.com.hlr.text_styles` | Chat 5 | Step 4 |
| L1 | Space scale | ruled (ratified 2026-10-22 by Eddie, Gate 2 package call 8): 4-based, Tailwind numbering | normalises observed 10, 15, 50 | Eddie | Gate 2 |
| L2 | Social side margin 64 | ruled (ratified 2026-10-22 by Eddie, Gate 2 package call 8): from 62 and 63 | `space.social-margin`; with `space.email-margin` it folds into one canvas-moded `space.margin` once Gate 4 sets the web margins | Eddie | Gate 2, Gate 4 |
| L3 | Web margins, grid and breakpoints | open | `figma.yaml` breakpoints null | Eddie | Gate 4 |
| L4 | Email module geometry (mats, cards, CTA box) | [observed], measured at build | `asset-types.md` | Chat 6 | Step 4 |
| L5 | Safe zones and display floors | ruled (Gate 2 calls 3 b and 5 a, 2026-10-18); outside the tokens | the engine's platform specs; the policy in `slotmap-paid.yaml` and `slotmap-social.yaml` meta; `font.size.label` (web 12) | Eddie | Gate 2 |
| L6 | Motion | open: annotations fade in (p48 to p50); `video_rules` null | | Eddie | later |
| L7 | Photography grade | open: the cards only (p21 to p24) | `art-direction.md` | HLR | later |
| K1 | CTA padding and box size | measured at build, per canvas | Layout values with a value per canvas mode, aliased by the CTA component, like `stroke.cta` | Chat 6 | Step 4 |
| K2 | Web focus ring | open | not tokenized | Eddie | Gate 4 |
| K3 | Strictness map | ruled at Gate 4 (2026-10-23, Claude under Eddie's delegation, for Eddie to confirm): `strictness-map.md` | board `Strictness map` (7:15) | Eddie (confirms) | Gate 4 |
| M1 | Mark vectors (star, monogram lockup, stacked lockup), clear space, minimum sizes | open | `logo-assets.md` | HLR | Review 1 |

## 6. Ratification log

| Date | Token or rule | From | To | Ratified by |
|---|---|---|---|---|
| 2026-10-18 | `font.size.web-label` (now `font.size.label`, `web` mode) | 11px [derived] | 12px [documented] | Eddie, Gate 2 call 5 a |
| 2026-10-18 | Leading and tracking in Figma | bound to variables (the Gate 3 proposal, call 7 a) | set on each text style, unbound, in percent | Eddie, Gate 2 question 3 |
| 2026-10-18 | Type sizes per canvas | per-canvas size tokens and 42 styles [derived] | canvas modes on `HLR / Layout` (`web`, `social`, `email`), 15 styles; amends Gate 3 call 4 for Layout | Eddie, Gate 2 question 1 |
| 2026-10-18 | Floors on web and IAB display | small 11 [derived] | body 14, small 12 CSS px, no text under 12 px rendered | Eddie, Gate 2 call 5 a |
| 2026-10-18 | Case per slot role | display in sentence case or Saol caps | sentence case on every channel; caps headlines retire | Eddie, Gate 2 call 2 a |
| 2026-10-18 | Copy on photography | certified over a 55 percent scrim [derived] | judged by eye on the real image at review; overlay optional at the observed 50 percent | Eddie |
| 2026-10-22 | The `stroke` category; the canvas-mode and ground-mode grammar | [derived]: the token proposal, section 7; DECISIONS 2026-10-18 (the CTA stroke line, the canvas-mode grammar line, the two ground-mode grammar lines) | [documented] as built: `stroke.cta` per canvas mode (web 1 px, email 2 px, social 2 px, unused), aliased by `component.cta.weight`, so one CTA element serves every canvas; canvas-dependent geometry lives in Layout with a value per canvas mode; every `font.size.*` and `stroke.*` token states `social` and `email`, and a Layout token without modes holds its value on every canvas; ground modes declared per collection at the root, a semantic token's `$value` is its `light` value, and each alternate ground is stated on every semantic token, never inherited | Eddie, Gate 2 package call 1 |
| 2026-10-22 | The contrast law and the candidate values for the alternate grounds | [derived] (section 2, for Gate 2) | [documented] as written: floors body 4.5:1, display 3.0:1 (the headline and display steps only), ui 3.0:1; the rules and the roster in section 2; the candidate values for the Forest, Onyx and Fawn grounds, whose names wait for Gate 4 | Eddie, Gate 2 package call 2 |
| 2026-10-22 | Type ramp per canvas (T7) | [derived]: body at the floor and a perfect fourth (1.333) above it, a value per canvas mode | [documented] as built: web 12, 14, 19, 25, 33, 44, 59, 79; social 32, 40, 54, 72, 96, 127, 170, 226; email 35, 45, 60, 80, 106, 142, 189, 251; the 12 px rendered floor holds on display and web only (social labels render at 11.1 px and email labels at 10.9 px on a 375 phone) | Eddie, Gate 2 package call 3 |
| 2026-10-22 | The remaining derived tokens and the text style roster | [derived] | [documented] as built: `color.semantic.interactive.cta` and `.link` (Onyx, from C6); `component.cta.stroke`, `.label`, `.stroke-on-photo` and `.label-on-photo`; `component.mark.fill`; `component.placeholder.fill` and `.label`; `font.style.fine`; `font.leading.headline` 1.1, `.title` 1.2 and `.caps` 1.4 (the book gives none); the 15 text styles of section 3 | Eddie, Gate 2 package call 5 |
| 2026-10-22 | Neutral ramp and muted ink (C4, C5) | [derived] | [documented]: ten steps from Alabaster toward Onyx, anchored on the observed warm email grey (#ece8e3 as neutral-100); muted ink neutral-700 on light grounds, neutral-300 on Forest and Onyx | Eddie, Gate 2 package call 6 |
| 2026-10-22 | Strictness map owner (K3) | Eddie to assign | Chat 5 drafts it with Foundations as a [derived] proposal; Eddie rules it at Gate 4, before any module | Eddie, Gate 2 package call 7 |
| 2026-10-22 | Space scale and the social margin (L1, L2) | [derived]: a 4-based scale; 64 from the observed 62 and 63 | [documented] as built: a 4-based scale in Tailwind numbering (`space.4` is 16 px); `space.social-margin` 64 | Eddie, Gate 2 package call 8 |
| 2026-10-22 | Pull quote face (T4) | [derived] Saol Display Light, against the book's conflict (p16 Saol Standard Regular, p18 Saol Display) | [documented] Saol Display Light (p18, the live site) | Eddie, Gate 2 package call 9 |
| 2026-10-22 | The italic accent word (T6) | [observed] in every channel; not in the book (p17 roman) | [documented]: one word per display line or headline, as a range override (`font.style.display-accent`, `.headline-accent`); HLR hears it at Review 1 | Eddie, Gate 2 package call 10 |
| 2026-10-23 | Names of the alternate ground modes | open (C2 names) | `warm` (Fawn), `deep` (Forest), `night` (Onyx), from the pattern review's roles (4.1) | Claude under Eddie's delegation (Gate 4), for Eddie to confirm |
| 2026-10-23 | `color.semantic.text.on-placeholder` | none: the placeholder label aliased `text.primary`, which fails on the grey placeholder on deep and night (1.33:1) | [derived] Onyx on every ground (8.65:1); `component.placeholder.label` aliases it | Claude under Eddie's delegation (Gate 4), for Eddie to confirm; stays [derived] until he does |
| 2026-10-23 | Strictness map (K3) | Chat 5 draft | adopted as drafted: `strictness-map.md` (two guided rows: rule placement, image crop) | Claude under Eddie's delegation (Gate 4), for Eddie to confirm |

Gate 2 closed on 2026-10-22: Eddie took the Gate 2 package (`outputs/step-2-pack/gate-2-package.md`) at its defaults (DECISIONS 2026-10-22), and Gate 4 named the alternate grounds on 2026-10-23 (`warm`, `deep`, `night`). Eddie's Gate 1 picks are rulings recorded in `DECISIONS.md` (2026-10-17); HLR's confirmation at Review 1 and Eddie's Gate 2 ratifications are logged here, and each ratified token's tag flips to [documented] with "(ratified <date> by Eddie, Gate 2 package call N)" in its description (Gate 2 package call 4); this log keeps the derivation.
