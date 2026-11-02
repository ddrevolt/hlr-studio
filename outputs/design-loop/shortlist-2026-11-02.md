# Designer shortlist, batch 1, 2026-11-02

Gate 1 of the designer: nothing is built. Eddie picks; Figma writes start only after the pick and his go on conventions. Input: `research-2026-11-02.md` (ranked list). Catalog ids below are proposed, not yet in `design-catalog.json`.

Checks run on the copy below: em dash scan clean; voice lint (`voice_lint.js --lines`, advisory) returned WARN on the engine's default model, because HLR's `voice_model` is null (owner Donnie). One line, "INTRODUCING", was flagged as a participial opener: a false positive on a caps eyebrow that HLR's own sends already carry. The lint says nothing about HLR's taste.

Facts that shape the copy (read from `brand-pack/products.json`, 182 records): `description` is empty on all 182, so no product prose is sourced; 105 pieces list one material, 1 lists two, 76 list none. A callout can honestly carry a piece's name and its stone, nothing more.

## Options

### 1. S04 Callouts: annotated product story (recommended)
- Job and format: annotate a product on a story, 9x16.
- Master: S04 `357:1882`, new Structure=Callouts, 1 to 2 variants (13 now). Mirrors S03 Inner callouts `362:2078`: up to four numbered circles with hairline leaders over a photo, item 4 hidden by default.
- Route: original, the client's Field Notes story frames (32 by name). Mode A default; Mode B allowed because it is a client original.
- Copy: eyebrow "NOTED MATERIALS" [observed, HLR's own, 29 layers in the corpus]. Labels "01 / piece name" and "02 / stone" from `products.json` `name` and `ingredients` [documented]. Handle is the E16 element, star the E15 element. No benefit or meaning line: none is sourced.
- Image: a cleared photo from the `photos` page (for example the Scorpio set flat, 27:289, hash in `figma.yaml` photos) or an E04 placeholder.
- Cost and gates: 1 to 2 variants. Compare gate, bound variables, scale steps, 9x16 band, contrast, slot budgets.
- Blocker: you name the pieces in the photo so every label is sourced (Eddie).
- Beats: HLR-IG-003, job: annotate a product on a story.

### 2. T18 Product launch email
- Job and format: announce a new piece, email 1200 wide.
- Master: M23 lockup, M02 hero with the INTRODUCING eyebrow, M04 or M16 text, M03 or M06 product, M14 CTA, M09 footer. Pure instances. Closes the one ratified type with no template.
- Route: original, the client's launch hero (E-H3, 14 layers). Mode A.
- Copy: eyebrow "INTRODUCING" [observed, E-H3]; product name `{{product_name}}` from `products.json`; body and CTA label from the brief; no price, no claim.
- Cost and gates: 0 masters. Compare gate, bound variables, contrast, slot budgets at 1x and 2x, copy gates.
- Blocker: which piece, and the brief (Eddie).
- Beats: HLR-EM-001, job: announce a new product. Same method gives T19 offer urgency if you want both.

### 3. S06 Diptych feed post
- Job and format: pair two photographs, 4x5 and 1x1.
- Master: new set S06, 2 variants. S01 is not the home: it already holds 33 variants against the 30 cap.
- Route: new, from a documented device (`art-direction.md` section 3 item 6, book p44, p46, p52). The Inspiration page shows paired crops, intent unconfirmed.
- Copy: none on the art; the caption lives in a layer beside the post [documented, slot map]. Optional eyebrow and handle (E16); star off by default.
- Image: cleared photos only; E04 placeholders otherwise.
- Cost and gates: one new master (library-gap go from you), pin Layout to Social, bind spacing. Compare gate does not apply (no original); bound variables, scale steps, 4x5 crop margins, slot budgets.
- Blocker: none.
- Beats: HLR-IG-001, job: pair two photographs (S01 has one image slot).

### 4. S04 Prompt story
- Job and format: invite a reply, 9x16.
- Master: S04 Text, Statement scale (72 px), Night ground, a reserved band for the reply sticker added in the app. 0 to 1 variant. I verify first, read only, whether S04 already reserves that band; the slot map says its position was left to Step 4.
- Route: new. Reference: Stories replies up 88 percent year on year across accounts [observed, Metricool, third party].
- Copy drafts, all [derived] from the book's behaviours (p10) and line "Take pause, give gratitude" (p33); questions, no claim:
  1. "Where did you pause today?" (recommended)
  2. "Name one small thing you noticed today."
  3. "What are you grateful for today?"
  4. "What does presence feel like to you?"
- Cost and gates: bound variables, scale steps, 9x16 band, contrast, copy gates.
- Blocker: none; your ear on the question.
- Beats: HLR-IG-003, job: invite replies.

### 5. Monthly ritual kit
- Job: one brief across T12 email, S05 3x3 cover, S03 carousel, S04 stories, as a linked kit entry.
- Route: new, from existing masters; original reference the monthly energy cover `349:128048`. 0 masters.
- Copy: stones and names from `products.json`; nothing else is sourced. The meaning lines are claims and "medicine" is unruled (C2).
- Blocker: C2 wording (HLR). Not recommended for batch 1.
- Beats: HLR-EM-012, job: one brief across channels.

### 6. Win-back and back-in-stock emails
- Job: re-engage lapsed buyers; tell a waiting subscriber a piece is back. Email 1200.
- Master: existing modules, pure instances. 0 masters.
- Route: new; the flow list is a web reference, timings not adopted.
- Copy: merge tokens `{{url_<product_id>}}`, `{{unsubscribe_url}}`; no price, no claim.
- Blocker: new types need a ruling from you and Donnie ([derived]). Not recommended for batch 1.
- Beats: HLR-EM-004, job: re-engage lapsed or waiting buyers.

### Add-on A. Mantra tiles from the book's own words (content, not a design)
Six tiles, verbatim, on S01 Text tile (Quote or Statement) or S04 Text, from `voice-contract.md` section 8: p32 taglines, p33 additional language, p10 behaviours. 0 masters. It extends HIGH SPIRITS (p35); which franchise names are current is HLR's (Review 1). Cleared to run alongside any option.

## Default

Batch 1 = options 1, 2 and 3: two structures and one template, no copy blocker beyond your product pick. Option 4 is a cheap add if S04 already reserves the band. Options 5 and 6 wait on rulings.

## Questions, ranked by production-blocking risk

1. Which piece or set for options 1 and 2, and for 2 the brief? Without it both build on tokens and placeholders. Default: option 1 on the Scorpio set photo with you naming the pieces; option 2 on tokens until a piece is named.
2. Option 3 as a new master S06 (needs your library-gap go) or fold it into S01 past the cap? Default: new master S06.
3. Conventions for the build on 04 Staging, library file `Gq3yUbLs6MCRM0nOhjvnIW`: a new column right of the boards at x 17000, one section per design, frames named by catalog id, a design card in the section note, images as E04 placeholders unless cleared. Default: as written.
4. Mode B for option 1 (client original): build A only, or A and B? Default: A, then B only if the compare shows gaps worth closing.
5. Add-on A now, or later? Default: later.
