# Paid masters: agent package for the Figma build at 1:1, 4:5 and 9:16

Generated 2026-10-31 by `crew/producers/figma_package.py` from `brand-pack/slotmap-paid.yaml`, `tokens.json`, `figma.yaml` and `placement-specs.json`. Backlog item `paid-package`, Phase 2 step 9. Paste one package at a time into Figma's native agent inside the HLR Library. Nothing here is sent to Figma by the runner.

## Read first

- **License flag, raised on every format.** Saol Display, Saol Standard and Trade Gothic LT Std have no license file (`figma.yaml` `fonts.licensed: false`, `brand-context.md`). Each package repeats it. Owner: HLR, Review 1.
- **Status of the source.** `slotmap-paid.yaml` is "proposed, unbuilt" and held for Review 2 (its header; DECISIONS 2026-10-18); backlog item `review-2-outcome` is waiting. The nine modules, their slots and roles are proposals, not rulings.
- **Single frames.** Each module is one frame per ratio. The Style and Callouts variants of the yaml (for example P01 Line or Masthead, P07 Card or List) and the component sets come later; every slot is listed so the frame can be trimmed.
- **Keep-clear bands are unverified.** `placement-specs.json` holds `null` for every number, status `unverified`, gap owner Eddie (item `paid-specs`). The story package says so and gives no number. The feed packages use the social margin only.
- **No budget is measured.** Every `max_chars` in `slotmap-paid.yaml` is `null` until a master is built and measured; each slot below says so. A null ceiling is read as no ceiling by the lint, so the build is where Eddie sets them.
- **Text styles per role are a proposal [derived].** The role to style map (hook, title, headline, offer to `headline`; body to `body`; eyebrow, subline to `eyebrow`; label, attribution to `label`; name to `title`; quote to `quote`; disclaimer to `fine`) is this generator's reading of the 15-style roster. Donnie ratifies a derived value; Eddie may swap a style in the build.
- **Copy is not in the package.** Each text layer holds its merge value `{{slot id}}`, filled from the paid writer's ad set by the crew. Module P02's name and P08's tiles come from the product database, never written.
- **Scope.** Meta only: P01 to P08 at 1:1, 4:5 and 9:16, and P09 (end frame) at 9:16. P10 (Google link image) and P11 (IAB display) are other platforms and are not in this package.
- **Carried over from the email elements:** the wordmark and star components, the hairline and leader strokes, the callout label color and the labelled grey placeholder. Email modules themselves do not carry over; paid has its own module set.

## Package A: Feed 1:1, 1080x1080

```
FIGMA AGENT BRIEF: HLR · Meta paid masters · Feed 1:1 · 2026-10-31
Build in: HLR Library (file key Gq3yUbLs6MCRM0nOhjvnIW) → page "02 Modules" · Do not modify anything outside the frames you create.

LICENSE FLAG (raised): Saol Display, Saol Standard and Trade Gothic LT Std have no license file (figma.yaml fonts.licensed: false). Every frame in this package carries the flag; do not remove it. Beside each frame, 40 px below it and outside it, place a text layer named "License notice" in text style "fine" reading exactly: "License flag raised: Saol Display, Saol Standard and Trade Gothic LT Std have no license file." (sources: figma.yaml fonts.licensed, brand-context.md).

CANVAS
- One frame per module below, each 1080x1080 px, named "P## <Name> 1x1": prefix, space, name, never a dash between them. Place them on one shelf, 120 px apart.
- Set each frame's variable mode for the collection "HLR / Layout" to "social" (the 1080 canvas). Set no layout mode on anything inside the frame.
- Ground: bind the fill to the variable color/semantic/background/default (#fbf7ef) in "HLR / Semantic"; where a module sits on a photo, use the labelled placeholder below, never a palette fill to fake a photo.
- Side margin: variable space/social-margin (64px). Bind hairline stroke weights to component/rule/weight; never type a weight.

LAYOUT (auto-layout, so copy can change length without breaking)
- Vertical auto-layout inside the safe margins; text hugs and fills so it reflows; the wordmark and star are absolutely positioned in layers prefixed "Decor / ".
- No CTA is drawn: Meta adds it [observed, slotmap-paid.yaml header]. No price, percent, code, threshold or date is typed: those arrive as merge values.

KEEP-CLEAR (UNVERIFIED)
- Feed 1x1 has no platform overlay: slotmap-paid.yaml safe_zones.feed says feed padding follows the keep_clear_px of the engine placement file (not in the pack, not read here) and that HLR margins are layout tokens. Until it is confirmed, pad with the social margin (64px) [derived]. brand-pack/placement-specs.json holds null (unverified); owner Eddie, item paid-specs.

ELEMENTS (per module, in this order; every layer name is a slot id)

Shared on every module, carried over from the email elements by name:
- Place component "Marks/Wordmark" (node 28:28) at the foot, fill bound to component/mark/fill (#353535; on photo component/mark/fill-on-photo, #ffffff). Place component "Marks/Star" (200:161) where the module's pattern uses it. Never redraw, stretch or recolor a mark.
- Image area: rectangle named "Image Placeholder", fill #dcd8d4 (color/semantic/background/placeholder), label it "IMAGE" in text style "label", color #353535 (color/semantic/text/on-placeholder). No photo is cleared for these masters.
- Hairlines and callout leaders: stroke bound to component/rule/stroke and component/rule/weight; callout labels in color component/callout/label.

#### P01 Brand Line, frame "P01 Brand Line 1x1" 1080x1080

Use: One Saol line with one italic accent word over a model photo, or the wordmark as a masthead with a short line (types brand_line).

- Text "{{P01.headline}}", layer name "P01.headline", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P01.body}}", layer name "P01.body", text style "body" (40px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P02 Product Hero, frame "P02 Product Hero 1x1" 1080x1080

Use: One piece cut out on a plain ground or inset on Alabaster, named in Saol (types product_hero).

- Text "{{P02.eyebrow}}", layer name "P02.eyebrow", text style "eyebrow" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P02.name}}", layer name "P02.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm); fed from the product database, never written. Do NOT rewrite this copy.
- Text "{{P02.subline}}", layer name "P02.subline", text style "headline" (72px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P02.side_label}}", layer name "P02.side_label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P02.offer}}", layer name "P02.offer", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P03 Annotated, frame "P03 Annotated 1x1" 1080x1080

Use: The piece with one to four callouts on hairline leaders, on a ground or on model; a build adds one callout per frame (types annotated).

- Text "{{P03.title}}", layer name "P03.title", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.subline}}", layer name "P03.subline", text style "eyebrow" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout1.name}}", layer name "P03.callout1.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout1.line}}", layer name "P03.callout1.line", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout2.name}}", layer name "P03.callout2.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout2.line}}", layer name "P03.callout2.line", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout3.name}}", layer name "P03.callout3.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout3.line}}", layer name "P03.callout3.line", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout4.name}}", layer name "P03.callout4.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout4.line}}", layer name "P03.callout4.line", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P04 Quote, frame "P04 Quote 1x1" 1080x1080

Use: Someone else's words: a press quote with the publication's logo, one or two customer reviews over customer imagery, or a DM reply bubble (types press_quote, customer_review, dm_reply).

- Text "{{P04.quote}}", layer name "P04.quote", text style "headline" (72px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm); verbatim, never trimmed to fit. Do NOT rewrite this copy.
- Text "{{P04.attribution}}", layer name "P04.attribution", text style "label" (32px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P04.review1.quote}}", layer name "P04.review1.quote", text style "quote" (72px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm); verbatim, never trimmed to fit. Do NOT rewrite this copy.
- Text "{{P04.review2.quote}}", layer name "P04.review2.quote", text style "quote" (72px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm); verbatim, never trimmed to fit. Do NOT rewrite this copy.

#### P05 Mantra, frame "P05 Mantra 1x1" 1080x1080

Use: A short affirmation alone on an image or a flat ground, or built word by word for motion (types mantra).

- Text "{{P05.line}}", layer name "P05.line", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P06 Offer, frame "P06 Offer 1x1" 1080x1080

Use: The offer is the headline over full-bleed photo; a gift-with-purchase variant names what comes free and on what terms (types offer).

- Text "{{P06.eyebrow}}", layer name "P06.eyebrow", text style "eyebrow" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P06.offer}}", layer name "P06.offer", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P06.headline}}", layer name "P06.headline", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P06.subline}}", layer name "P06.subline", text style "eyebrow" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P06.terms}}", layer name "P06.terms", text style "fine" (from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P06.side1.label}}", layer name "P06.side1.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P06.side2.label}}", layer name "P06.side2.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P07 Meaning, frame "P07 Meaning 1x1" 1080x1080

Use: A stone or material card, or a list of intention and stone pairs (types meaning). Card style: itemN.name and itemN.line, the gloss (one card; 9x16 stacks two). List style: itemN.label, the intention, over itemN.name, the stone, up to eight.

- Text "{{P07.headline}}", layer name "P07.headline", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item1.name}}", layer name "P07.item1.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item1.line}}", layer name "P07.item1.line", text style "body" (40px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item1.label}}", layer name "P07.item1.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item2.name}}", layer name "P07.item2.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item2.line}}", layer name "P07.item2.line", text style "body" (40px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item2.label}}", layer name "P07.item2.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item3.name}}", layer name "P07.item3.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item3.label}}", layer name "P07.item3.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item4.name}}", layer name "P07.item4.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item4.label}}", layer name "P07.item4.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item5.name}}", layer name "P07.item5.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item5.label}}", layer name "P07.item5.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item6.name}}", layer name "P07.item6.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item6.label}}", layer name "P07.item6.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item7.name}}", layer name "P07.item7.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item7.label}}", layer name "P07.item7.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item8.name}}", layer name "P07.item8.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item8.label}}", layer name "P07.item8.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P08 Birthstone Grid, frame "P08 Birthstone Grid 1x1" 1080x1080

Use: Twelve months, each a tile with the piece, the month and the stone (types birthstone_grid).

- Text "{{P08.eyebrow}}", layer name "P08.eyebrow", text style "eyebrow" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P08.headline}}", layer name "P08.headline", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

RULES
- Use ONLY these colors: #353535 (Onyx, ink), #fbf7ef (Alabaster, ground), #ffffff (white, on photo), #dcd8d4 (placeholder), bound to the variables named above. No gradients, no effects, no extra decoration.
- Use the library text styles by name (the roster: display/xl to display/s, headline, quote, title, link, price, script, body, eyebrow, label, cta, fine). The style sets face and size; never type a size or a face.
- Keep every text layer's name exactly as given: downstream tooling resolves by those names.
- If a font, variable, style or component is unavailable, stop and report it back instead of substituting.

WHEN DONE
- Reply with the frame links or node ids. A closing pass (ours) is still owed: stamp the slots from the layer names (hlr:slot), run the canvas check for the social mode, flex-probe at 2x, slot_lint against slotmap-paid.yaml, and the contrast pairs. Until that pass runs these frames are not reachable by the copy engines and are not done.
```

## Package B: Feed 4:5, 1080x1350

```
FIGMA AGENT BRIEF: HLR · Meta paid masters · Feed 4:5 · 2026-10-31
Build in: HLR Library (file key Gq3yUbLs6MCRM0nOhjvnIW) → page "02 Modules" · Do not modify anything outside the frames you create.

LICENSE FLAG (raised): Saol Display, Saol Standard and Trade Gothic LT Std have no license file (figma.yaml fonts.licensed: false). Every frame in this package carries the flag; do not remove it. Beside each frame, 40 px below it and outside it, place a text layer named "License notice" in text style "fine" reading exactly: "License flag raised: Saol Display, Saol Standard and Trade Gothic LT Std have no license file." (sources: figma.yaml fonts.licensed, brand-context.md).

CANVAS
- One frame per module below, each 1080x1350 px, named "P## <Name> 4x5": prefix, space, name, never a dash between them. Place them on one shelf, 120 px apart.
- Set each frame's variable mode for the collection "HLR / Layout" to "social" (the 1080 canvas). Set no layout mode on anything inside the frame.
- Ground: bind the fill to the variable color/semantic/background/default (#fbf7ef) in "HLR / Semantic"; where a module sits on a photo, use the labelled placeholder below, never a palette fill to fake a photo.
- Side margin: variable space/social-margin (64px). Bind hairline stroke weights to component/rule/weight; never type a weight.

LAYOUT (auto-layout, so copy can change length without breaking)
- Vertical auto-layout inside the safe margins; text hugs and fills so it reflows; the wordmark and star are absolutely positioned in layers prefixed "Decor / ".
- No CTA is drawn: Meta adds it [observed, slotmap-paid.yaml header]. No price, percent, code, threshold or date is typed: those arrive as merge values.

KEEP-CLEAR (UNVERIFIED)
- Feed 4x5 has no platform overlay: slotmap-paid.yaml safe_zones.feed says feed padding follows the keep_clear_px of the engine placement file (not in the pack, not read here) and that HLR margins are layout tokens. Until it is confirmed, pad with the social margin (64px) [derived]. brand-pack/placement-specs.json holds null (unverified); owner Eddie, item paid-specs.

ELEMENTS (per module, in this order; every layer name is a slot id)

Shared on every module, carried over from the email elements by name:
- Place component "Marks/Wordmark" (node 28:28) at the foot, fill bound to component/mark/fill (#353535; on photo component/mark/fill-on-photo, #ffffff). Place component "Marks/Star" (200:161) where the module's pattern uses it. Never redraw, stretch or recolor a mark.
- Image area: rectangle named "Image Placeholder", fill #dcd8d4 (color/semantic/background/placeholder), label it "IMAGE" in text style "label", color #353535 (color/semantic/text/on-placeholder). No photo is cleared for these masters.
- Hairlines and callout leaders: stroke bound to component/rule/stroke and component/rule/weight; callout labels in color component/callout/label.

#### P01 Brand Line, frame "P01 Brand Line 4x5" 1080x1350

Use: One Saol line with one italic accent word over a model photo, or the wordmark as a masthead with a short line (types brand_line).

- Text "{{P01.headline}}", layer name "P01.headline", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P01.body}}", layer name "P01.body", text style "body" (40px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P02 Product Hero, frame "P02 Product Hero 4x5" 1080x1350

Use: One piece cut out on a plain ground or inset on Alabaster, named in Saol (types product_hero).

- Text "{{P02.eyebrow}}", layer name "P02.eyebrow", text style "eyebrow" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P02.name}}", layer name "P02.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm); fed from the product database, never written. Do NOT rewrite this copy.
- Text "{{P02.subline}}", layer name "P02.subline", text style "headline" (72px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P02.side_label}}", layer name "P02.side_label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P02.offer}}", layer name "P02.offer", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P03 Annotated, frame "P03 Annotated 4x5" 1080x1350

Use: The piece with one to four callouts on hairline leaders, on a ground or on model; a build adds one callout per frame (types annotated).

- Text "{{P03.title}}", layer name "P03.title", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.subline}}", layer name "P03.subline", text style "eyebrow" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout1.name}}", layer name "P03.callout1.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout1.line}}", layer name "P03.callout1.line", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout2.name}}", layer name "P03.callout2.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout2.line}}", layer name "P03.callout2.line", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout3.name}}", layer name "P03.callout3.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout3.line}}", layer name "P03.callout3.line", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout4.name}}", layer name "P03.callout4.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout4.line}}", layer name "P03.callout4.line", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P04 Quote, frame "P04 Quote 4x5" 1080x1350

Use: Someone else's words: a press quote with the publication's logo, one or two customer reviews over customer imagery, or a DM reply bubble (types press_quote, customer_review, dm_reply).

- Text "{{P04.quote}}", layer name "P04.quote", text style "headline" (72px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm); verbatim, never trimmed to fit. Do NOT rewrite this copy.
- Text "{{P04.attribution}}", layer name "P04.attribution", text style "label" (32px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P04.review1.quote}}", layer name "P04.review1.quote", text style "quote" (72px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm); verbatim, never trimmed to fit. Do NOT rewrite this copy.
- Text "{{P04.review2.quote}}", layer name "P04.review2.quote", text style "quote" (72px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm); verbatim, never trimmed to fit. Do NOT rewrite this copy.

#### P05 Mantra, frame "P05 Mantra 4x5" 1080x1350

Use: A short affirmation alone on an image or a flat ground, or built word by word for motion (types mantra).

- Text "{{P05.line}}", layer name "P05.line", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P06 Offer, frame "P06 Offer 4x5" 1080x1350

Use: The offer is the headline over full-bleed photo; a gift-with-purchase variant names what comes free and on what terms (types offer).

- Text "{{P06.eyebrow}}", layer name "P06.eyebrow", text style "eyebrow" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P06.offer}}", layer name "P06.offer", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P06.headline}}", layer name "P06.headline", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P06.subline}}", layer name "P06.subline", text style "eyebrow" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P06.terms}}", layer name "P06.terms", text style "fine" (from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P06.side1.label}}", layer name "P06.side1.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P06.side2.label}}", layer name "P06.side2.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P07 Meaning, frame "P07 Meaning 4x5" 1080x1350

Use: A stone or material card, or a list of intention and stone pairs (types meaning). Card style: itemN.name and itemN.line, the gloss (one card; 9x16 stacks two). List style: itemN.label, the intention, over itemN.name, the stone, up to eight.

- Text "{{P07.headline}}", layer name "P07.headline", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item1.name}}", layer name "P07.item1.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item1.line}}", layer name "P07.item1.line", text style "body" (40px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item1.label}}", layer name "P07.item1.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item2.name}}", layer name "P07.item2.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item2.line}}", layer name "P07.item2.line", text style "body" (40px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item2.label}}", layer name "P07.item2.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item3.name}}", layer name "P07.item3.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item3.label}}", layer name "P07.item3.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item4.name}}", layer name "P07.item4.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item4.label}}", layer name "P07.item4.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item5.name}}", layer name "P07.item5.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item5.label}}", layer name "P07.item5.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item6.name}}", layer name "P07.item6.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item6.label}}", layer name "P07.item6.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item7.name}}", layer name "P07.item7.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item7.label}}", layer name "P07.item7.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item8.name}}", layer name "P07.item8.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item8.label}}", layer name "P07.item8.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P08 Birthstone Grid, frame "P08 Birthstone Grid 4x5" 1080x1350

Use: Twelve months, each a tile with the piece, the month and the stone (types birthstone_grid).

- Text "{{P08.eyebrow}}", layer name "P08.eyebrow", text style "eyebrow" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P08.headline}}", layer name "P08.headline", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

RULES
- Use ONLY these colors: #353535 (Onyx, ink), #fbf7ef (Alabaster, ground), #ffffff (white, on photo), #dcd8d4 (placeholder), bound to the variables named above. No gradients, no effects, no extra decoration.
- Use the library text styles by name (the roster: display/xl to display/s, headline, quote, title, link, price, script, body, eyebrow, label, cta, fine). The style sets face and size; never type a size or a face.
- Keep every text layer's name exactly as given: downstream tooling resolves by those names.
- If a font, variable, style or component is unavailable, stop and report it back instead of substituting.

WHEN DONE
- Reply with the frame links or node ids. A closing pass (ours) is still owed: stamp the slots from the layer names (hlr:slot), run the canvas check for the social mode, flex-probe at 2x, slot_lint against slotmap-paid.yaml, and the contrast pairs. Until that pass runs these frames are not reachable by the copy engines and are not done.
```

## Package C: Story 9:16, 1080x1920

```
FIGMA AGENT BRIEF: HLR · Meta paid masters · Story 9:16 · 2026-10-31
Build in: HLR Library (file key Gq3yUbLs6MCRM0nOhjvnIW) → page "02 Modules" · Do not modify anything outside the frames you create.

LICENSE FLAG (raised): Saol Display, Saol Standard and Trade Gothic LT Std have no license file (figma.yaml fonts.licensed: false). Every frame in this package carries the flag; do not remove it. Beside each frame, 40 px below it and outside it, place a text layer named "License notice" in text style "fine" reading exactly: "License flag raised: Saol Display, Saol Standard and Trade Gothic LT Std have no license file." (sources: figma.yaml fonts.licensed, brand-context.md).

CANVAS
- One frame per module below, each 1080x1920 px, named "P## <Name> 9x16": prefix, space, name, never a dash between them. Place them on one shelf, 120 px apart.
- Set each frame's variable mode for the collection "HLR / Layout" to "social" (the 1080 canvas). Set no layout mode on anything inside the frame.
- Ground: bind the fill to the variable color/semantic/background/default (#fbf7ef) in "HLR / Semantic"; where a module sits on a photo, use the labelled placeholder below, never a palette fill to fake a photo.
- Side margin: variable space/social-margin (64px). Bind hairline stroke weights to component/rule/weight; never type a weight.

LAYOUT (auto-layout, so copy can change length without breaking)
- Vertical auto-layout inside the safe margins; text hugs and fills so it reflows; the wordmark and star are absolutely positioned in layers prefixed "Decor / ".
- No CTA is drawn: Meta adds it [observed, slotmap-paid.yaml header]. No price, percent, code, threshold or date is typed: those arrive as merge values.

KEEP-CLEAR (UNVERIFIED)
- Story keep-clear top and bottom: safe_zone_top_px = null and safe_zone_bottom_px = null in brand-pack/placement-specs.json (status unverified). No number is given and none is guessed. Build as laid out, keep every text layer, mark and callout inside the side margin, and add no guide layer and no variable. Eddie confirms the 9:16 zone in Ads Manager placement preview (item paid-specs) before the masters are signed off.
- [observed] the wordmark sits 120 px from the foot in 27 board frames (slotmap-paid.yaml safe_zones.sign_off): a starting point to compare, not a rule.

ELEMENTS (per module, in this order; every layer name is a slot id)

Shared on every module, carried over from the email elements by name:
- Place component "Marks/Wordmark" (node 28:28) at the foot, fill bound to component/mark/fill (#353535; on photo component/mark/fill-on-photo, #ffffff). Place component "Marks/Star" (200:161) where the module's pattern uses it. Never redraw, stretch or recolor a mark.
- Image area: rectangle named "Image Placeholder", fill #dcd8d4 (color/semantic/background/placeholder), label it "IMAGE" in text style "label", color #353535 (color/semantic/text/on-placeholder). No photo is cleared for these masters.
- Hairlines and callout leaders: stroke bound to component/rule/stroke and component/rule/weight; callout labels in color component/callout/label.

#### P01 Brand Line, frame "P01 Brand Line 9x16" 1080x1920

Use: One Saol line with one italic accent word over a model photo, or the wordmark as a masthead with a short line (types brand_line).

- Text "{{P01.headline}}", layer name "P01.headline", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P01.body}}", layer name "P01.body", text style "body" (40px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P02 Product Hero, frame "P02 Product Hero 9x16" 1080x1920

Use: One piece cut out on a plain ground or inset on Alabaster, named in Saol (types product_hero).

- Text "{{P02.eyebrow}}", layer name "P02.eyebrow", text style "eyebrow" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P02.name}}", layer name "P02.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm); fed from the product database, never written. Do NOT rewrite this copy.
- Text "{{P02.subline}}", layer name "P02.subline", text style "headline" (72px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P02.side_label}}", layer name "P02.side_label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P02.offer}}", layer name "P02.offer", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P03 Annotated, frame "P03 Annotated 9x16" 1080x1920

Use: The piece with one to four callouts on hairline leaders, on a ground or on model; a build adds one callout per frame (types annotated).

- Text "{{P03.title}}", layer name "P03.title", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.subline}}", layer name "P03.subline", text style "eyebrow" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout1.name}}", layer name "P03.callout1.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout1.line}}", layer name "P03.callout1.line", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout2.name}}", layer name "P03.callout2.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout2.line}}", layer name "P03.callout2.line", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout3.name}}", layer name "P03.callout3.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout3.line}}", layer name "P03.callout3.line", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout4.name}}", layer name "P03.callout4.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P03.callout4.line}}", layer name "P03.callout4.line", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P04 Quote, frame "P04 Quote 9x16" 1080x1920

Use: Someone else's words: a press quote with the publication's logo, one or two customer reviews over customer imagery, or a DM reply bubble (types press_quote, customer_review, dm_reply).

- Text "{{P04.quote}}", layer name "P04.quote", text style "headline" (72px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm); verbatim, never trimmed to fit. Do NOT rewrite this copy.
- Text "{{P04.attribution}}", layer name "P04.attribution", text style "label" (32px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P04.review1.quote}}", layer name "P04.review1.quote", text style "quote" (72px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm); verbatim, never trimmed to fit. Do NOT rewrite this copy.
- Text "{{P04.review2.quote}}", layer name "P04.review2.quote", text style "quote" (72px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm); verbatim, never trimmed to fit. Do NOT rewrite this copy.

#### P05 Mantra, frame "P05 Mantra 9x16" 1080x1920

Use: A short affirmation alone on an image or a flat ground, or built word by word for motion (types mantra).

- Text "{{P05.line}}", layer name "P05.line", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P06 Offer, frame "P06 Offer 9x16" 1080x1920

Use: The offer is the headline over full-bleed photo; a gift-with-purchase variant names what comes free and on what terms (types offer).

- Text "{{P06.eyebrow}}", layer name "P06.eyebrow", text style "eyebrow" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P06.offer}}", layer name "P06.offer", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P06.headline}}", layer name "P06.headline", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P06.subline}}", layer name "P06.subline", text style "eyebrow" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P06.terms}}", layer name "P06.terms", text style "fine" (from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P06.side1.label}}", layer name "P06.side1.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P06.side2.label}}", layer name "P06.side2.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P07 Meaning, frame "P07 Meaning 9x16" 1080x1920

Use: A stone or material card, or a list of intention and stone pairs (types meaning). Card style: itemN.name and itemN.line, the gloss (one card; 9x16 stacks two). List style: itemN.label, the intention, over itemN.name, the stone, up to eight.

- Text "{{P07.headline}}", layer name "P07.headline", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item1.name}}", layer name "P07.item1.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item1.line}}", layer name "P07.item1.line", text style "body" (40px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item1.label}}", layer name "P07.item1.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item2.name}}", layer name "P07.item2.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item2.line}}", layer name "P07.item2.line", text style "body" (40px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item2.label}}", layer name "P07.item2.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item3.name}}", layer name "P07.item3.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item3.label}}", layer name "P07.item3.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item4.name}}", layer name "P07.item4.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item4.label}}", layer name "P07.item4.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item5.name}}", layer name "P07.item5.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item5.label}}", layer name "P07.item5.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item6.name}}", layer name "P07.item6.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item6.label}}", layer name "P07.item6.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item7.name}}", layer name "P07.item7.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item7.label}}", layer name "P07.item7.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item8.name}}", layer name "P07.item8.name", text style "title" (54px on this canvas, from the style), exactly as the merge value arrives; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P07.item8.label}}", layer name "P07.item8.label", text style "label" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P08 Birthstone Grid, frame "P08 Birthstone Grid 9x16" 1080x1920

Use: Twelve months, each a tile with the piece, the month and the stone (types birthstone_grid).

- Text "{{P08.eyebrow}}", layer name "P08.eyebrow", text style "eyebrow" (32px on this canvas, from the style), text case Upper, applied by the style's case setting, never by retyping; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.
- Text "{{P08.headline}}", layer name "P08.headline", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

#### P09 End Frame, frame "P09 End Frame 9x16" 1080x1920

Use: The video end frame: the wordmark centered and an optional line.

- Text "{{P09.line}}", layer name "P09.line", text style "headline" (72px on this canvas, from the style), sentence case as given; budget: none (null in slotmap-paid.yaml, set when the master is built and measured; owner the build step, Eddie to confirm). Do NOT rewrite this copy.

RULES
- Use ONLY these colors: #353535 (Onyx, ink), #fbf7ef (Alabaster, ground), #ffffff (white, on photo), #dcd8d4 (placeholder), bound to the variables named above. No gradients, no effects, no extra decoration.
- Use the library text styles by name (the roster: display/xl to display/s, headline, quote, title, link, price, script, body, eyebrow, label, cta, fine). The style sets face and size; never type a size or a face.
- Keep every text layer's name exactly as given: downstream tooling resolves by those names.
- If a font, variable, style or component is unavailable, stop and report it back instead of substituting.

WHEN DONE
- Reply with the frame links or node ids. A closing pass (ours) is still owed: stamp the slots from the layer names (hlr:slot), run the canvas check for the social mode, flex-probe at 2x, slot_lint against slotmap-paid.yaml, and the contrast pairs. Until that pass runs these frames are not reachable by the copy engines and are not done.
```
