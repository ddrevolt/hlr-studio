# Pack v0, structure side: lane D notes

2026-10-18. Lane D (Step 2). Eddie ruled lane D's seven Gate 2 calls the same day (section 2): the taxonomy is ratified for email and organic social, and paid and web wait for Review 2 with the first masters. Built from `PROGRESSION.md`, `DECISIONS.md` and `LEARNINGS.md`, `hlr-studio-engine` 0.5.1's `references/pack-contract.md`, `outputs/step-1-review/pattern-review.md`, `pattern-review-addendum.md`, `brand-review-v2.md`, `site/catalog-2026-10-17.tsv`, and the channel inventories in `patterns/`. No HLR fact from memory. The Shopify export has not arrived, so the product database comes from the catalog snapshot. Figma: no calls.

## 1. Files and roles

| Role | File in `brand-pack/` | What it holds | State |
|---|---|---|---|
| `product_db` | `products.json` | 182 products keyed by Shopify handle; `name` (house-style display name), `shopify_title` verbatim, observed store values, flags, `_meta` with every gap | names and keys ruled (calls 4 a, 7 a); `kind` and `family` derived, unratified |
| `type_registry_core` | `type-registry-core.json` | v0.2.0: 15 email types with gates and module-job sections; `channels.email`; `channels.social` (formats, 8 types, 5 series); the paid roster (12 types) and web page types under `held_for_review_2` | email and organic social ratified (call 1 b); paid and web held |
| `route_axes` | `route-axes.json` | the engine's six frames with HLR notes, 3 routes by default, 5 at most, no standing policy | ratified (call 6 a) |
| `slotmap_social` | `slotmap-social.yaml` | S01 feed post, S03 carousel set, S04 story set; 51 slots; the organic story band in `meta` | wired; masters unbuilt |
| `slotmap_paid` | `slotmap-paid.yaml` | P01 to P11, 53 slots; the ads 9:16 zone and the display floors in `meta` | held for Review 2; unwired |
| `section_library` | `section-library.json` | W01 to W14, 3 page types, 2 page-type gaps, breakpoints | held for Review 2; unwired |

Every budget is null with status "proposed, unbuilt" until Step 4 measures the masters. The email `slotmap.yaml` and `module_library` are Chat 6's; `slotmap_web` stays null until the W## masters exist.

File map lines for lane E (paste into `brand-context.md`):

```json
"product_db": "products.json",
"type_registry_core": "type-registry-core.json",
"type_registry_overlay": null,
"route_axes": "route-axes.json",
"slotmap_social": "slotmap-social.yaml",
"slotmap_paid": null,
"section_library": null,
"slotmap_web": null
```

Lane E names the two held roles as gaps in the narrative: `slotmap_paid` is planned at `slotmap-paid.yaml` and `section_library` at `section-library.json`, both wired at Review 2 with the first masters (Gate 2 call 1 b; owner Eddie). Until then paid briefs run on the engine's bundled ad types with in-frame checks off, and web-copy stops by design, because the engine ships no web roster to fall back to. Chat 6 builds the P## and W## masters from the two files by path.

## 2. Gate 2 calls, ruled by Eddie 2026-10-18

| Call | Ruling | What changed |
|---|---|---|
| 1. Taxonomy | b: email and organic social now; paid and web at Review 2 with the first masters | registry v0.2.0: the email types, `channels.email` and `channels.social` ratified; paid and web moved under `held_for_review_2`, which the engine does not read; `slotmap_paid` and `section_library` unwired until Review 2 |
| 1. Google formats | a: no overlaid copy and no drawn CTA | P10 stamps no text; the held `link_ad` type says so; lane B's `asset-types.md` no longer draws the C6 box on Google art |
| 2. Case | a: the book's sentence case for headlines everywhere | house style in DECISIONS; restamped to fit it: `S03.cover.subline` caps, `S04.inset.attribution` as written, P07's item line split into a sentence-case gloss (`itemN.line`) and a caps intention (`itemN.label`), W10's caps heading renamed `eyebrow`; lane B's display row loses "Saol caps allowed" |
| 3. Story zone | b: the organic band for stories, the ads zone for paid | `slotmap-social.yaml` and `slotmap-paid.yaml` `meta.safe_zones`; lane B's S04 recipe |
| 4. Non-stone tails | a: drop the tail | 5 records in `products.json` |
| 5. Floors | a: body 14 and small 12 CSS px on display and web | `slotmap-paid.yaml` `meta.display_floors`; lane B's web label step 11 to 12 |
| 6. Standing policy | a: none | `route-axes.json` ratified as drafted |
| 7. Product keys | a: handles until the export, then SKUs | `products.json` `_meta.keys` and gaps |

Corrections to lane D's own call text, found while applying the rulings:
- Call 1 b said paid and web briefs fall back to the engine's generic roster. Paid has one (`ad-type-data.json`); web has none: the engine's section library is empty and web-copy refuses it. Applied: web-copy stops until Review 2. The alternative is wiring the held library, which runs web copy on proposed sections that no lint labels as proposed.
- Call 2 said the lints enforce case. In 0.5.1 only `slot_lint.js` (a slot must declare a case), `paid_lint.js` (a warning on an upper slot) and `copy_lint.js` (email CTAs in caps) read it; `social_lint.js` and `page_lint.js` do not, and nothing checks sentence case (engine gap 8).

## 3. Lane B lines the rulings changed

Patched from this chat on Eddie's go, 2026-10-18: 12 lines in 5 files.

| File | Line | Ruling |
|---|---|---|
| `brand-pack/asset-types.md` | Paid concepts: Google link and square ads carry no overlaid copy and no drawn CTA | 1, Google a |
| `brand-pack/asset-types.md` | S04: the organic story band, not the ads keep-clear | 3 b |
| `brand-pack/asset-types.md` | Canvases, Web: small 12; Canvases, Display: floors body 14 and small 12 | 5 a |
| `brand-pack/art-direction.md` | Type roles, display: sentence case on every channel; caps headlines retire | 2 a |
| `brand-pack/art-direction.md` | Floors: web and display body 14 and small 12; 1080 and 1200 unchanged | 5 a |
| `brand-pack/token-model.md` | Ramp: the web label step is ruled at 12; the label row reads 12 | 5 a |
| `brand-pack/token-model.md` | Gap L5: ruled | 3 b, 5 a |
| `brand-pack/tokens.json` | `font.size.web-label` 12px (was 11px) | 5 a |
| `outputs/step-2-pack/token-proposal.md` | Section 4: the ramp line and the label row | 5 a |

`tokens_build.js check` still passes every declared pair after the patch.

## 4. For lane E

- The taxonomy is ruled (call 1 b), so Gate 2's package carries the derived tokens, the contrast law and the voice principles. The paid and web taxonomy goes to Review 2.
- The 12 px rendered floor (call 5 a) covers display and web. Lane B's 1080 small step (32) renders at 11.1 px on a 375 phone, and C8's email small (35) at 10.9 px. The token calls should say whether the floor holds there too: 1080 small 35 keeps 12 px; email small 38 would reopen C8.

## 5. Named gaps

| Gap | Owner | Blocks |
|---|---|---|
| Shopify products export: variant SKUs, barcodes, descriptions, confirmed prices | HLR, Review 1 | figures in copy; `description` is empty on every record |
| Re-key `products.json` by SKU when the export lands, the handle kept as a field (call 7 a) | Eddie, with the export | SKU-keyed briefs |
| Metals and karat by variant; origin and karat claims in paid | HLR, Review 1; lane C ledger rows | any metal or karat statement |
| Services sold as products (sessions, readings: 7 records flagged C2) | HLR, Review 1 | copy for those records |
| Source defects for HLR to fix in Shopify: 2 type mismatches (Seeds of Abundance Necklace typed Bracelet; Word Witch Bracelet typed Necklace), 6 stale handles, 3 copied stone tags (Kunzite, Dumortierite, Chakra bracelets), "Gold FIlled", 80 dashed titles, 20 products with no SKU | HLR | clean data at the export |
| Paid and web taxonomy and masters: ratify the held rosters and wire `slotmap_paid` and `section_library` | Eddie, Review 2 | paid copy on HLR's own types; any web copy |
| Confirm Meta's 9x16 zone in Ads Manager's placement preview (Meta's Ads Guide refuses automated reads) | Eddie, before the first paid build | the paid 9x16 masters |
| Confirm the organic story band (top and bottom 250 px, contested: one 2026 guide) on a live story | Eddie, before the first S04 build | the S04 masters |
| Web breakpoints (figma.yaml `breakpoints` null; design frames 375, the engine's reference 390) | Eddie, Gate 4 | W## budgets |
| Home page beyond the hero; a collection header; editorial and landing pages | Eddie (scope), Step 4 | web page types beyond pdp |
| The mobile drawer's About Us copy: page copy or menu settings (W02) | Eddie, Step 4 | W02 |
| Where captions live (layers beside the set, or outside Figma) | HLR, Review 1 | `S01.caption`, `S03.caption` |
| Paid video: storyboards and supers (`video_rules` null) | Eddie (scope) | video beyond the P09 end frame |
| Email module ids and the email slot map | Chat 6 | `sections` move from module jobs to M## ids |
| Sourced quotes: every review, DM and press line in Judge.me or a press ledger | HLR; customer-evidence | P04, W08, testimonials, quote types |
| Imagery and publication logos with usage rights | HLR | real images (labelled grey placeholders until then) |

## 6. Engine gaps (for a later release; no workarounds here)

1. `page_lint.js` skips a null budget silently: a 500-character string in an unmeasured slot passed with no finding. `copy_lint.js` reports INSUFFICIENT-INPUT and `social_lint.js` asks for a sign-off on the same state.
2. `paid_lint.js` also skips a null ceiling, and its report reads "checked against P02's measured ceilings" when none is measured.
3. Route axes cannot extend the engine's six frames: `copy_lint.js` refuses an angle option whose axis is outside the gate's set, so an HLR frame such as ritual or meaning would fail every email run inside that route.
4. No pack role for the safe-zone policy or canvas floors. They sit in the slot maps' `meta` and the brand's `asset_types`; the engine's own story-set default (the ads zone) cannot be overridden by a role.
5. Google formats: the engine's placement specs carry Meta's copy limits only; Google's headline and description limits are not in the engine.
6. `paid_lint.js` maps `on_image` only to a slot whose role is `hook` or `title`; the paid map marks each module's primary line that way, and modules without one need explicit `in_frame` ids.
7. `page_lint.js` labels its section source "bundled section-data.json ONLY" when the pack's `section_library` resolved.
8. Case enforcement is partial: `social_lint.js` and `page_lint.js` never read a slot's case, `paid_lint.js` warns only on upper, and nothing checks sentence case, though the slot contract says the lint always enforces it.
9. `social-copy`'s SKILL and `paid-ad-copy`'s brand-context template name `type_registry_overlay` as the home of series and `channels.paid`, while `lib/pack.js` reads `channels` from `type_registry_core` only.
10. Ratification has no per-channel status the engine reads: holding paid and web while ratifying email and social needed a key the engine skips (`held_for_review_2`).

## 7. How each file was checked

Against the installed engine 0.5.1, from a scratch File map outside the brand home with lane E's lines above (never delivered):
- `sku_lookup.js --pack`: names, handles and words resolve, the five ruled tails included ("The Seeds of Wholeness Necklace", "Shamanic Healing Session"); `allowed_figures` is empty, so the database licenses no figure.
- `preflight.py --pack`: `product_db` and `type_registry_core` resolve; 15 types read live (v0.2.0); no gate drift against the engine fixture; blocked only by `voice_contract` and `legal_ledger` (lanes C and E).
- `lib/pack.js`: `loadRouteAxes` reads six axes, 3 and 5, status ratified; `loadTypeRegistry` reads two live channels (email, social); `slotmap_paid` and `section_library` resolve null.
- `paid_lint.js`: the ad type resolves from the bundled fallback roster; with the role null it reports slot checking OFF; with the held map passed by flag, P07's split slots check and an unstamped slot errors.
- `social_lint.js`: carousel and story slates map by panel and structure, the recased slots included; every unmeasured slot asks for a sign-off with its status.
- `page_lint.js`: with the role null it refuses the engine's empty library (web-copy stops by design); with the held library passed by flag, W10's `eyebrow` checks and a page type's required section is enforced.
- `slot_lint.js --surface social`: its YAML parser reads `slotmap-social.yaml`.
- `tokens_build.js check`: every declared pair still clears after lane B's patch.
- PyYAML and `json.load` parse every file; no em or en dash outside the verbatim Shopify titles; no other brand's name.

## 8. Product database

- 182 records: 159 jewelry, 12 ritual kits, 3 crystals, 1 packaging, 7 services or service bundles.
- Names: 75 by the Q10 "in" rule, 102 unchanged (no dash in the title), 5 with the non-stone tail dropped (call 4 a). The rule read these 47 tails as stones or gem materials; strike any that is not: Agate, Amethyst, Angelite, Aquamarine, Black Obsidian, Black Tourmaline, Carnelian, Chrysocolla, Citrine, Clear Quartz, Diamond, Dumortierite, Emerald, Fluorite, Garnet, Golden Obsidian, Golden Rutilated Quartz, Green Aventurine, Hematite, Jade, Kunzite, Labradorite, Lapis Lazuli, Larimar, Malachite, Moonstone, Opal, Pearl, Peridot, Peruvian Turquoise, Phosphosiderite, Pink Aventurine, Pink Opal, Red Coral, Red Jasper, Rhodonite, Rose Quartz, Ruby, Sapphire, Smoky Quartz, Sunset Sodalite, Sunstone, Turquoise, Watermelon Tourmaline, White Fossil Jasper, White Topaz, Zircon.
- `family` (derived, two or more products): Seeds of 40, Spell Bracelet 19, Sacred Layer 18, the three Birthstone lines 12 each, Crystal Set 12, Classic Bracelet 10, Garden Pendant 10, and five smaller lines. Lane C's `concrete_lexicon.product_families` can read it.
- Prices, options and tags sit under `observed` and reach no writer: `sku_lookup.js` returns only name, category, description, ingredients, nutrition and badges. Intention tags (Calm, Protection, Love) are store data, not claims copy may state.

## 9. Platform numbers as read (reference only; the engine files are the source)

| Number | Value | Source |
|---|---|---|
| Ads 9x16 keep-clear | top 270, bottom 670, sides 65 px (agreed) | `paid-ad-copy/references/placement-specs.json`, verified 2026-07-27 |
| Organic story band | top 250, bottom 250 px (contested) | `social-copy/references/organic-specs.json`, verified 2026-10-17 |
| Profile grid crop, 4:5 | 1012 x 1350 visible, about 34 px off each side (derived) | `organic-specs.json` |
| Google responsive display images | landscape 1.91:1 at 1200x628 (minimum 600x314); square 1200x1200 (minimum 300x300); overlaid text advised against | [Google Ads Help, responsive display best practices](https://support.google.com/google-ads/answer/9823397), read 2026-10-18 |
| Display sizes | 300x250, 336x280, 728x90 and 160x600 listed as top performers; 180x150 and 320x50 supported | [Google Authorized Buyers, guide to display ad sizes](https://support.google.com/authorizedbuyers/answer/3011898), read 2026-10-18 |

Cost: not measured.
