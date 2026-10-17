# HLR Step 1b pattern review: common brief for every subagent

Read this whole file before any tool call.

## Rules (non-negotiable)

1. Read-only. No writes to any Figma file: never call use_figma (except the census agent, read-only scripts only), never create, edit, move, rename or comment. Read tools only: get_screenshot, get_metadata.
2. Write files only under /home/claude/hlr-1b/. Never write to /mnt/user-data/uploads/.
3. Tag every finding: [documented] = the brand book states it (cite the PDF page, pN); [observed] = seen in the client's live work (cite node ids or the TSV and count); [derived] = your inference or a proposal from the two. A finding that is both seen and in the book is [documented] with the observed count beside it.
4. No invention. An unknown is written as "unknown" plus a named gap. Never invent figures, claims, prices, quotes or reviews. Client text is quoted verbatim (keep its own punctuation).
5. Your own prose uses no em dashes. Use a comma, a colon, parentheses or a new sentence.
6. Name no other brand, company or product line except High Light Rituals (HLR, HIGH LIGHT) and the platforms (Instagram, Meta, Google, Shopify, Klaviyo). If the file shows another brand (for example on the Inspiration page), write "third-party reference" and do not name it.
7. Be token-thrifty: small screenshots, no repeated screenshots of the same layout, no page-level metadata pulls where a frame list exists.

## Source

Figma file (Eddie's read-only copy of the client's work, snapshot 2026-10-17): fileKey `LYyYXPDUHVoAABh865EvMI`.
Pages: Email 0:1, Components 2:31579, Organic Social 2:32177, Website 2:182972, Paid Social 2:35858, Retail/Press 2:33120, Print 2:35751, Inspiration 2:35848, Images 2:31298.

Extracts from chat 1 (read with Read or grep/awk, never re-pull):
- Frame lists: /mnt/user-data/uploads/highlight-brandbook/outputs/step-1-review/figma/frames-{email,social,paid,web}.tsv. Columns: section, id, name, type, w, h, texts, hidden. Line 1 is a comment.
- Copy corpora: .../figma/corpus-{email,social,paid,web}.tsv. Columns: line, count, units, visible, generic, sections, flag. Line 1 is a comment.
- Inventory summary: .../figma/figma-inventory-2026-10-17.md (fonts, inks and grounds per channel, counted in chat 1).
- Live site: /mnt/user-data/uploads/highlight-brandbook/outputs/step-1-review/site/site-observed-2026-10-17.md.
- Brand review: /mnt/user-data/uploads/highlight-brandbook/outputs/step-1-review/brand-review-v2.md (contradictions C1 to C10).

## Tools

Load the Figma read tools first: ToolSearch query "select:mcp__Figma__get_screenshot,mcp__Figma__get_metadata".
- get_screenshot: always pass fileKey, nodeId (colon form), enableBase64Response: true, and a small maxDimension. The URL in the response cannot be downloaded from any shell here; ignore it. Sizes: 1080-wide tiles 512; 9:16 frames 640; emails and web pages (tall) 1400 for structure, then 600 on a single module or section for detail; carousel strips 2000; print and press 640.
- get_metadata: only on a single frame (to get child ids for detail shots), never on a page or section that already has a frame list. Large responses overflow to a file under tool-results; read that file with grep or a regex, not an XML parser.

## Documented law (brand book 061022_HighLight_BrandBook_DS.pdf, June 2022, cited by PDF page)

Type (p16 to p18). Saol leads; Trade Gothic accents and body, never a large headline or the lead.
- Headline one: Saol Display Light. Headline two: Saol Display Regular. Product names and pull quotes: Saol Standard Regular. Principal body: Saol Standard Medium. Numerals and prices: Saol Standard Medium.
- Trade Gothic Bold: inline titles and small headlines, caps, tracked. Trade Gothic Regular: secondary and detail body.
- Typesetting lockup (p17): eyebrow Trade Gothic caps 10/17 +200, left; headline Saol Display 80/80 sentence case, 0 tracking; body Saol Standard 14/23; CTA as a text link, Saol Standard 16/23, with a short trailing rule.
- Pull quote (p18): Saol Display 35/45 in quotation marks; body option Trade Gothic 15/22; block CTA: Trade Gothic caps 10/17 +200 inside a thin outline box ("DISCOVER").

Palette (p19). Primary: Onyx #353535, Alabaster #FBF7EF. Secondary: Sea Salt #E0E3E5, Forest #17280A, Fawn #BEADA3. Gilt is gold foil on print only. Lighter colors may sit behind text.

Marks and devices (p13 to p15, p40 to p53).
- Logotype HIGH LIGHT in three cuts by size (large, standard, small). The live work uses a HIGH LIGHT RITUALS wordmark and an HLR monogram [observed in chat 1].
- Mark: a scallop shell. Versions: shell alone (avatar, favicon, sticker, wax seal); horizontal "H shell L"; vertical H over shell over L. With the logotype, only the shell without HL.
- Lockup (p15): shell over logotype over "SANCTUARIES OF SELF AND SPACE" in small tracked caps.
- Seen in the book's own layouts: hairline rules; small tracked-caps eyebrows; the text link with a trailing rule; the outline block CTA; image diptychs (two images side by side); annotation callouts with thin leader lines on product shots (Instagram ad, p48 to p50, "annotations fade in"); a rotated vertical caps label (email, p52); italic captions under images; the "H shell L" mark centered at the top of every story frame (p48 to p50); a wax seal (packaging, p41, p43).
- Marks seen in chat 1 but not in the book: shell with star, star and crest (PNG only).

Art direction cards (p21 to p24). Map every imagery family you see to one of these, or to "not in the book":
- AD1 Model campaign (p21): intimate, visceral; light natural, raw, ethereal (flares, glow welcome); color soft, warm, romantic (black and white, feminine pastels or jewel tones); styling natural, abundant, classic (florals, lace, draped cloth); casting diverse, feminine, unique.
- AD2 Product campaign (p22): zoomed-in vignettes of the product's world; light natural, raw, textural; color soft, warm, romantic; styling natural, simple, classic, always with an organic object (fruit, linen, plants).
- AD3 Product ecommerce (p23): sell shots; light natural, simple, clean; color warm, neutral, minimal; styling organic, simple, considered (subtle natural textures); feeling alive (smoking sage, a necklace mid-swing, a tumbling crystal ball).
- AD4 Social media (p24): assortment of nature, symbolic objects, locations, moments of beauty; look inviting, romantic, ethereal, leaning occult or mystical; UGC aspirational, refined, authentic.

Book applications (p40 to p53): shipping carton, in-box envelope, ritual box with wax seal, postcard (eyebrow, image diptych, Saol headline, logotype bottom right), poster, homepage (split hero with Saol headline over image, 4-up product row, editorial copy block, Forest footer), Instagram story ads as 5-frame sequences with motion notes, a marketing email (logotype header, full-bleed hero with eyebrow and Saol headline in white, centered body, outline CTA, captioned images, diptych, Sea Salt footer with shell and tagline).

Copy direction (p26 to p38): voice Eloquent, Refined, Sensual, Real, Uplifting; long copy welcome; social franchises HIGH SPIRITS (mantras and affirmations), SANCTUARIES (artists' and thinkers' spaces), SUBLIME INTERVENTION (weekly lists of beautiful things); taglines p32; additional language p33.

## What to return

Write your inventory to the path your task names, under 15 KB, in this shape:

```
# <channel> pattern inventory, 2026-10-17
Scope and sample: frames in scope, screenshots taken, how you sampled.

## Patterns
| id | pattern | structure | type pairing | ground / ink | devices | imagery (AD card) | CTA | count (method) | example node ids | tag |
(id = a short code you assign, for example E-HERO-1. count method = "names" (frame names in the TSV matched), "sample k of n", or "corpus" (a signature line and its count). Give 2 to 4 example node ids per pattern.)

## Variants and flex
What varies within a pattern (ground, alignment, image side, column count, copy length) and what never varies.

## Channel requirements seen
Canvas sizes with frame counts; margins and safe zones as seen; the smallest text that looks legible at the sample size; anything the format forces.

## One-offs and outliers
Patterns seen once or twice, off-book faces or colors, broken or placeholder work, each with node ids and a retire or keep note [derived].

## Cross-channel equivalents
Patterns here that do the same job as a pattern in another channel (quote tile, pull quote module, testimonial, product spotlight, offer, mantra, launch).

## Gaps
Unknowns with an owner (HLR or Eddie).
```

Your final message: 8 lines at most, the path of your file and the three findings that matter most for a design system.
