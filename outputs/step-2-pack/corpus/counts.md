# HLR corpus re-cut: counts

2026-10-18. Lane A, Gate 1 call 8. Source: Figma file `LYyYXPDUHVoAABh865EvMI` (read-only walk through the Figma connector). Provenance: observed.

Pages walked in full: Email (0:1), Organic Social (2:32177), Paid Social (2:35858), Website (2:182972). Pages not walked, by the client lead's ruling of 2026-10-18: Components (2:31579), Retail/Press (2:33120), Print (2:35751), Inspiration (2:35848), Images (2:31298). See "Left out" at the end. `corpus-visible-other.tsv` was not written, because a header-only file would read as "no visible copy".

Completeness check: an independent count of every TEXT node on each walked page (`findAllWithCriteria`) equals the rows walked, and every text id appears once.

| Channel | Page | TEXT nodes on page (independent count) | Rows walked | Unique text ids |
|---|---|---|---|---|
| email | Email (0:1) | 4156 | 4156 | 4156 |
| social | Organic Social (2:32177) | 3807 | 3807 | 3807 |
| paid | Paid Social (2:35858) | 3613 | 3613 | 3613 |
| web | Website (2:182972) | 1398 | 1398 | 1398 |

Verification against the file: after the walk, read-only calls computed FNV-1a hashes inside the file over blocks of 20 records, for every row (text id, reason, font, x, y, w, h, characters), for every unit (id, kind, nesting, frame size, section path, text count) and for every name the TSVs carry (unit names, layer names that differ from their text, section paths). The files match every block on Email, Organic Social and Paid Social. Strings that lost invisible characters in copying (line separators U+2028, no-break spaces, word joiners, zero-width joiners and spaces) were re-read with those characters escaped, checked by hash one by one, and are corrected here (method.md, section 5e). Website was read with both safeguards from the start (method.md, section 5f): every string came back escaped to printable ASCII, and every chunk carried the same hashes, computed in the file by the walk itself over the original strings; each chunk was checked as soon as it was stored, and every block matches. Website hashes are per chunk, so a unit split across two chunks is hashed in both; the unit count below counts it once.

| Channel | Rows hashed (blocks) | Units hashed (blocks) | Unit names / differing layer names / section paths hashed | Strings re-read and corrected | Mismatches |
|---|---|---|---|---|---|
| email | 4156 (208) | 472 (24) | 391 / 9 / 12 | 45 | 0 |
| social | 3807 (191) | 1276 (64) | 1109 / 93 / 69 | 110 | 0 |
| paid | 3613 (181) | 1033 (52) | 979 / 157 / 20 | 33 | 0 |
| web | 1398 (71) | 69 (5) | 58 / 73 / 2 | 0 | 0 |

## 1. Units walked, per page

A unit is what the walk treated as one deliverable. Frame: a frame, group, component, component set or instance that is a direct child of the page or of a section (sections recursed). Board: a frame that holds two or more deliverable-sized frames laid side by side or stacked; its deliverable children are walked as frames (counted as nested) and the board itself is walked only for text that sits directly on it. Loose text: a text node that is a direct child of the page or a section. Top-level means a direct child of the page or of a first-level section; nested means inside a second-level section or inside a board.

| Channel | Frames top-level | Frames nested | Frames total | Boards (top-level / nested) | Loose text nodes | Units with at least one text node | Units total |
|---|---|---|---|---|---|---|---|
| email | 408 | 20 | 428 | 3 (3 / 0) | 81 | 472 | 512 |
| social | 958 | 712 | 1670 | 117 (96 / 21) | 167 | 1276 | 1954 |
| paid | 560 | 552 | 1112 | 16 (11 / 5) | 54 | 1033 | 1182 |
| web | 57 | 6 | 63 | 1 (1 / 0) | 11 | 69 | 75 |

## 2. Text nodes, per page: visible and excluded by reason

Visible counts include text flagged `unresolved` (counted visible, see method.md). Zero opacity includes text whose fills and strokes are all invisible (flag `no_visible_paint`). Off frame includes text clipped away by a clipping frame or mask (flag `clipped_or_masked`).

| Channel | Text nodes | Visible | of which unresolved | Hidden | Zero opacity (of which no visible paint) | Empty | Off frame (of which clipped or masked) | Buried (by image / by solid) |
|---|---|---|---|---|---|---|---|---|
| email | 4156 | 3787 | 0 | 285 | 0 (0) | 4 | 59 (2) | 21 (4 / 17) |
| social | 3807 | 3478 | 0 | 234 | 0 (0) | 2 | 1 (0) | 92 (64 / 28) |
| paid | 3613 | 3038 | 0 | 282 | 0 (0) | 0 | 46 (0) | 247 (228 / 19) |
| web | 1398 | 971 | 0 | 24 | 0 (0) | 0 | 369 (0) | 34 (17 / 17) |

## 3. Per first-level section

### email

| Section | Frames top-level | Frames nested | Boards | Loose text | Text nodes | Visible | Hidden | Zero opacity | Empty | Off frame | Buried |
|---|---|---|---|---|---|---|---|---|---|---|---|
| (page) | 1 | 0 | 0 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 0 |
| final resized email templates | 39 | 0 | 0 | 4 | 415 | 406 | 4 | 0 | 0 | 2 | 3 |
| holiday 2025 | 26 | 0 | 0 | 12 | 498 | 473 | 20 | 0 | 0 | 2 | 3 |
| campaigns 2025 | 99 | 0 | 0 | 14 | 1212 | 1105 | 98 | 0 | 0 | 6 | 3 |
| welcome 2026 | 6 | 0 | 0 | 0 | 92 | 88 | 2 | 0 | 0 | 0 | 2 |
| campaign 2026 | 54 | 0 | 0 | 21 | 811 | 774 | 12 | 0 | 4 | 15 | 6 |
| cart checkout browse flows | 52 | 0 | 0 | 17 | 455 | 421 | 30 | 0 | 0 | 0 | 4 |
| modular blocks | 131 | 20 | 3 | 12 | 672 | 519 | 119 | 0 | 0 | 34 | 0 |

### social

| Section | Frames top-level | Frames nested | Boards | Loose text | Text nodes | Visible | Hidden | Zero opacity | Empty | Off frame | Buried |
|---|---|---|---|---|---|---|---|---|---|---|---|
| (page) | 154 | 0 | 0 | 4 | 472 | 413 | 59 | 0 | 0 | 0 | 0 |
| hlr stories and work in progress | 704 | 183 | 20 | 90 | 2734 | 2502 | 174 | 0 | 2 | 1 | 55 |
| social templates | 40 | 69 | 14 | 2 | 160 | 154 | 0 | 0 | 0 | 0 | 6 |
| social grid | 49 | 283 | 66 | 1 | 124 | 115 | 0 | 0 | 0 | 0 | 9 |
| sept-october 2026 | 11 | 177 | 17 | 70 | 317 | 294 | 1 | 0 | 0 | 0 | 22 |

### paid

| Section | Frames top-level | Frames nested | Boards | Loose text | Text nodes | Visible | Hidden | Zero opacity | Empty | Off frame | Buried |
|---|---|---|---|---|---|---|---|---|---|---|---|
| (page) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Section 1 | 560 | 552 | 16 | 54 | 3613 | 3038 | 282 | 0 | 0 | 46 | 247 |

### web

| Section | Frames top-level | Frames nested | Boards | Loose text | Text nodes | Visible | Hidden | Zero opacity | Empty | Off frame | Buried |
|---|---|---|---|---|---|---|---|---|---|---|---|
| (page) | 57 | 6 | 1 | 11 | 1398 | 971 | 24 | 0 | 0 | 369 | 34 |

## 4. Frame counts against Chat 1

Chat 1 lists: `outputs/step-1-review/figma/frames-{email,social,paid,web}.tsv` (read-only). Chat 1 listed the direct children of each first-level section (and of the page), whatever their type, and did not recurse into sub-sections or boards. Column "Direct children (re-cut census)" counts the same level in this walk: frame-like children / text children. "Frames walked" counts every frame unit this walk opened under that section, including frames inside sub-sections and boards.

### email

| Section | Chat 1 rows (by type) | Direct children (re-cut census): frame-like / text / sub-sections | Frames walked (top-level + nested) | Boards found |
|---|---|---|---|---|
| (page) | 3 (frame 1, rounded-rectangle 1, text 1) | 1 / 1 / 7 | 1 | 0 |
| final resized email templates | 42 (frame 39, text 3) | 39 / 3 / 1 | 39 | 0 |
| holiday 2025 | 48 (frame 26, line 1, rounded-rectangle 7, slice 2, text 12) | 26 / 12 / 0 | 26 | 0 |
| campaigns 2025 | 122 (frame 99, rounded-rectangle 8, slice 1, text 14) | 99 / 14 / 0 | 99 | 0 |
| welcome 2026 | 6 (frame 6) | 6 / 0 / 0 | 6 | 0 |
| campaign 2026 | 83 (frame 54, line 2, rounded-rectangle 3, slice 3, text 21) | 54 / 21 / 0 | 54 | 0 |
| cart checkout browse flows | 77 (frame 52, rounded-rectangle 4, slice 4, text 17) | 52 / 17 / 0 | 52 | 0 |
| modular blocks | 146 (frame 134, text 12) | 134 / 12 / 0 | 151 | 3 |
| Total | 527 | 411 / 80 / 8 | 428 | 3 |

### social

| Section | Chat 1 rows (by type) | Direct children (re-cut census): frame-like / text / sub-sections | Frames walked (top-level + nested) | Boards found |
|---|---|---|---|---|
| (page) | 162 (ellipse 1, frame 154, rounded-rectangle 2, text 4, vector 1) | 154 / 4 / 4 | 154 | 0 |
| hlr stories and work in progress | 897 (frame 724, rounded-rectangle 78, text 90, vector 5) | 724 / 90 / 0 | 887 | 20 |
| social templates | 89 (frame 53, rounded-rectangle 34, text 2) | 53 / 2 / 0 | 109 | 14 |
| social grid | 117 (frame 112, rounded-rectangle 4, text 1) | 112 / 1 / 0 | 332 | 66 |
| sept-october 2026 | 23 (frame 11, rounded-rectangle 4, text 8) | 11 / 8 / 16 | 188 | 17 |
| Total | 1288 | 1054 / 105 / 20 | 1670 | 117 |

### paid

| Section | Chat 1 rows (by type) | Direct children (re-cut census): frame-like / text / sub-sections | Frames walked (top-level + nested) | Boards found |
|---|---|---|---|---|
| (page) | 0 (none) | 0 / 0 / 1 | 0 | 0 |
| Section 1 | 723 (frame 571, rounded-rectangle 95, text 54, vector 3) | 571 / 54 / 4 | 1112 | 16 |
| Total | 723 | 571 / 54 / 5 | 1112 | 16 |

### web

| Section | Chat 1 rows (by type) | Direct children (re-cut census): frame-like / text / sub-sections | Frames walked (top-level + nested) | Boards found |
|---|---|---|---|---|
| (page) | 111 (frame 56, instance 2, rounded-rectangle 40, text 11, vector 2) | 58 / 11 / 0 | 63 | 1 |
| Total | 111 | 58 / 11 / 0 | 63 | 1 |

Checks against the figures in the lane brief:

- Organic Social, "sept-october 2026": 16 dated sub-sections; frames walked inside them: 177 (94 frames directly in the sub-sections, 83 frames inside 17 boards within them), plus 62 loose text nodes in the sub-sections. The brief cites 111 frames in 16 sub-sections, which equals the 94 frames plus 17 boards that sit directly in the sub-sections; this walk opens those boards and walks their 83 frames.
- Paid Social: 11 first-level boards plus 5 boards nested inside them (16 boards in all); 514 frames walked inside boards; 38 frames in 4 nested sections (BIRTHSTONE PENDANTS, LAYERING JEWELRY ADS, BIRTHSTONE CHART OPTIONS, GIFT CARD IMAGE OPTIONS). The brief cites 486 frames in 13 boards and 38 in nested sections. The nested-section figure matches. The board figure differs because this walk's board rule (method.md, section 2) found 16 boards and opened their nested boards as well.

## 5. Twenty most repeated visible lines, per channel

Exact characters (case, spacing and line breaks as in the file; newlines shown as \n, and Figma soft line breaks, the line separator U+2028, shown as \u2028)."Text nodes" counts visible text nodes carrying exactly that string; "Frames" counts distinct units (frames, boards, or loose text) carrying it. Dashes and all other punctuation inside the lines are the client's own characters, kept verbatim. Trailing spaces are kept in the TSVs but do not show in this table.

### email (3787 visible text nodes, 1501 distinct strings)

| # | Line | Text nodes | Frames |
|---|---|---|---|
| 1 | SHOP | 225 | 67 |
| 2 | SHOP NOW | 210 | 98 |
| 3 | Follow Us | 90 | 90 |
| 4 | The Ritualist | 86 | 85 |
| 5 | Shop Now | 84 | 82 |
| 6 | LEARN MORE | 48 | 30 |
| 7 | Enjoy 10% off with code WELCOME | 30 | 30 |
| 8 | Shop now | 25 | 25 |
| 9 | Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam et ultricies lectus, nec cursus augue. Nam tortor elit, pharetra sit amet placerat nec, auctor vitae erat. Nullam et libero sapien. | 24 | 15 |
| 10 | PROTECTION | 22 | 10 |
| 11 | Seek the sublime | 19 | 19 |
| 12 | Invoke the magic of fire, flow of water, stability of earth, power of spirit and movement of wind. | 16 | 16 |
| 13 | Its five stars and five diamonds symbolize nature’s eternal spirit that sparks and sustains life, while its egg-shaped silhouette functions as a talisman for inner transformation and renewal.  | 16 | 16 |
| 14 | Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus pharetra leo ac ex lobortis vestibulum. Etiam sit amet est orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.  | 16 | 11 |
| 15 | $100  | 16 | 1 |
| 16 | The Element Pendant | 15 | 15 |
| 17 | The Abundance Prayer Pendant | 15 | 11 |
| 18 | The Spirit Pendant | 15 | 14 |
| 19 | SHOP WITH CODE: LIGHT30 | 15 | 6 |
| 20 | SHOP THE SALE | 15 | 12 |

### social (3478 visible text nodes, 1099 distinct strings)

| # | Line | Text nodes | Frames |
|---|---|---|---|
| 1 | @HIGHLIGHTRITUALS | 391 | 383 |
| 2 | Your Zodiac Crystal Set | 97 | 97 |
| 3 | @HIGHTLIGHTRITUALS | 48 | 47 |
| 4 | FOR SELF & SPACE | 37 | 36 |
| 5 | AWAKENING ADORNMENTS | 35 | 35 |
| 6 | Solid Gold | 33 | 33 |
| 7 | NOTED MATERIALS | 29 | 29 |
| 8 | Citrine | 29 | 29 |
| 9 | Rose Quartz | 28 | 28 |
| 10 | Clear Quartz | 27 | 27 |
| 11 | Bone | 24 | 24 |
| 12 | RITUALS OF WINTER | 23 | 23 |
| 13 | The “Master Healer”, amplifies and protects your spell. | 22 | 22 |
| 14 | 1 | 21 | 13 |
| 15 | 2 | 21 | 13 |
| 16 | as seen in | 20 | 16 |
| 17 | notes | 19 | 19 |
| 18 | Moonstone | 17 | 17 |
| 19 | Labradorite | 17 | 17 |
| 20 | spell BRACELET | 17 | 17 |

### paid (3038 visible text nodes, 639 distinct strings)

| # | Line | Text nodes | Frames |
|---|---|---|---|
| 1 | The Spell Bracelets | 44 | 40 |
| 2 | Solid Gold | 35 | 35 |
| 3 | Citrine | 32 | 32 |
| 4 | spell BRACELET | 29 | 29 |
| 5 | 30% off sitewide | 29 | 29 |
| 6 | Embody your intention | 26 | 26 |
| 7 | Attract what you seek | 26 | 26 |
| 8 | 30% OFF SITEWIDE—CODE LIGHT30 | 24 | 20 |
| 9 | Clear Quartz | 22 | 22 |
| 10 | Golden eggs for \ngood fortune | 22 | 22 |
| 11 | Spell Bracelet | 21 | 21 |
| 12 | 14k recycled solid gold | 20 | 20 |
| 13 | BLACK FRIDAY EVENT | 20 | 20 |
| 14 | Handmade in America | 19 | 19 |
| 15 | The Garden Pendant | 19 | 19 |
| 16 | Amethyst | 19 | 19 |
| 17 | Aquamarine | 19 | 19 |
| 18 | Turquoise | 19 | 19 |
| 19 | 25% off sitewide\n | 19 | 19 |
| 20 | Abundance And Positivity | 18 | 18 |

### web (971 visible text nodes, 184 distinct strings)

| # | Line | Text nodes | Frames |
|---|---|---|---|
| 1 | Free shipping over $150 | 49 | 49 |
| 2 | High Light Ritual | 40 | 40 |
| 3 | Search | 34 | 34 |
| 4 | Bag (1) | 34 | 34 |
| 5 |  Find Your Match | 28 | 28 |
| 6 | Healing Jewelry              | 27 | 27 |
| 7 |   Energy Readings          About Us | 27 | 27 |
| 8 | Energy Readings | 14 | 13 |
| 9 | The Garden Pendant embodies the principle of "as you sow, so shall you reap." It serves as a daily reminder to tend to your inner garden with the care and dedication you deserve. Featuring Clear Quartz, the master healing crystal, each pendant is infused with energies that foster personal development, encouraging you to cultivate a space of peace, balance, and flourishing growth within. | 13 | 9 |
| 10 | Crystals | 13 | 13 |
| 11 | Founder’s note | 13 | 13 |
| 12 | DESIGN ELEMENTS | 13 | 13 |
| 13 | The energy inside this piece | 13 | 13 |
| 14 | Healing Jewelry | 13 | 13 |
| 15 | The Garden Pendant | 11 | 10 |
| 16 | Add to bag • $00 | 11 | 10 |
| 17 | (6) | 11 | 8 |
| 18 | About Us | 11 | 11 |
| 19 | shop now | 11 | 11 |
| 20 | Select Metal | 9 | 9 |

## 6. Left out

Not walked, by the client lead's ruling of 2026-10-18. Text node counts are from the read-only page census earlier in this lane.

| Page | Id | Channel | Text nodes on page |
|---|---|---|---|
| Components | 2:31579 | other | 53 |
| Retail/Press | 2:33120 | other | 1287 |
| Print | 2:35751 | other | 20 |
| Inspiration | 2:35848 | other | 0 |
| Images | 2:31298 | other | 85 |

