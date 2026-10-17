Snapshot 2026-10-17, file LYyYXPDUHVoAABh865EvMI (Eddie's copy of the HLR client files). Every number in this report is [observed] from the file, collected 2026-10-17 by read-only aggregate scripts.

# HLR Figma foundations inventory (pattern review data)

## Method

- Visible means the node and every ancestor up to the page have visible = true. Hidden nodes, slices and whitespace-only text are excluded.
- A segment is one run returned by getStyledTextSegments for fontName, fontSize, lineHeight, letterSpacing, textCase. Whitespace-only segments are excluded. Size is rounded to 0.5 px. Line height and letter spacing keep their unit and are rounded to 0.01. Case "orig" is textCase ORIGINAL (typed case).
- Top-level frame: the node that is a direct child of the page or of a section (nested sections included). Top-level GROUP, COMPONENT and INSTANCE nodes are counted as frames by their own bounds. Text placed directly on the page or in a section is reported as "text outside any frame" (its Frames column counts those text nodes).
- Buckets use the top-level frame size rounded to whole px. Percentiles are nearest-rank for P10 and the middle value for the median (mean of the two middle values when the count is even), computed over segments for type and over frames for margins.
- D: auto-layout frames are visible FRAME, COMPONENT, COMPONENT_SET and INSTANCE nodes with layoutMode set. itemSpacing "auto" means primaryAxisAlignItems SPACE_BETWEEN. Strokes cover visible FRAME, COMPONENT, INSTANCE, RECTANGLE and VECTOR nodes with a visible stroke paint and weight above 0 (LINE nodes are listed separately). Mixed weights and radii are written top/right/bottom/left and tl/tr/br/bl. Radius counts cover visible FRAME, COMPONENT, INSTANCE and RECTANGLE nodes that have a visible fill or a visible stroke.
- E: per top-level frame, the smallest inset from the frame edge to any visible text that overlaps the frame, rounded to 1 px. "Box" uses the text layer bounds (absoluteBoundingBox, as specified). "Ink" uses the rendered glyph bounds (absoluteRenderBounds), added for comparison. Negative values mean the text box extends past the frame edge.

## Coverage

| Page | Top-level nodes | Visible text nodes | Segments | Hidden text nodes skipped | Whitespace-only text nodes skipped | Distinct style keys |
|---|---|---|---|---|---|---|
| Email (0:1) | 518 | 3867 | 4713 | 285 | 4 | 326 |
| Organic Social (2:32177) | 1464 | 3572 | 5035 | 233 | 2 | 333 |
| Paid Social (2:35858) | 763 | 3331 | 4345 | 282 | 0 | 337 |
| Website (2:182972) | 111 | 779 | 872 | 24 | 0 | 30 |

## Email (page 0:1)

Top-level node types: FRAME 357, TEXT 81, GROUP 54, RECTANGLE 23, LINE 3; slices skipped: 10.

### A. Text styles

Top 50 style keys by segment count (of 326 distinct keys, 4713 segments).

| # | Family | Style | Size | Line height | Letter spacing | Case | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Trade Gothic LT Std | Bold | 26 | auto | 25% | UPPER | 249 |
| 2 | Trade Gothic LT Std | Regular | 19.5 | auto | 20% | UPPER | 248 |
| 3 | Trade Gothic LT Std | Regular | 34 | 140% | 0% | orig | 240 |
| 4 | Saol Display | Regular | 46 | 100% | -1% | orig | 237 |
| 5 | Trade Gothic LT Std | Bold | 19 | auto | 25% | UPPER | 177 |
| 6 | Trade Gothic LT Std | Bold | 18.5 | 140% | 10% | orig | 163 |
| 7 | Saol Standard | Regular | 25 | 120% | 2% | orig | 123 |
| 8 | Saol Display | Regular Italic | 42 | 150% | 2% | orig | 113 |
| 9 | Trade Gothic LT Std | Regular | 25 | 140% | 0% | orig | 105 |
| 10 | Trade Gothic LT Std | Regular | 14 | auto | 10% | UPPER | 104 |
| 11 | Trade Gothic LT Std | Bold | 30 | 140% | 2% | orig | 91 |
| 12 | Trade Gothic LT Std | Regular | 26 | 140% | 0% | orig | 80 |
| 13 | Trade Gothic LT Std | Regular | 19.5 | auto | 10% | UPPER | 78 |
| 14 | Trade Gothic LT Std | Regular | 30 | 140% | 2% | orig | 63 |
| 15 | Saol Display | Regular Italic | 110 | 100% | 0% | orig | 56 |
| 16 | Saol Display | Regular | 55 | 100% | 0% | orig | 51 |
| 17 | Trade Gothic LT Std | Bold | 30 | 140% | 25% | orig | 46 |
| 18 | Miriam Libre | Regular | 34.5 | 120% | 2% | orig | 46 |
| 19 | Saol Display | Regular | 96 | 100% | 0% | orig | 44 |
| 20 | Miriam Libre | Regular | 39.5 | 140% | 2% | orig | 43 |
| 21 | Saol Display | Regular | 34.5 | 120% | 2% | orig | 43 |
| 22 | Trade Gothic LT Std | Regular | 38 | 140% | 0% | orig | 42 |
| 23 | Trade Gothic LT Std | Regular | 24 | 140% | 0% | orig | 41 |
| 24 | Saol Display | Regular | 55 | auto | 0% | orig | 40 |
| 25 | Trade Gothic LT Std | Regular | 32 | 140% | 0% | orig | 40 |
| 26 | Miriam Libre | Regular | 110 | 100% | 0% | orig | 40 |
| 27 | Saol Standard | Regular | 34.5 | 120% | 2% | orig | 38 |
| 28 | Saol Display | Regular Italic | 55 | auto | 0% | orig | 36 |
| 29 | Trade Gothic LT Std | Regular | 31 | auto | 20% | UPPER | 35 |
| 30 | Trade Gothic LT Std | Regular | 34 | 150% | 0% | orig | 35 |
| 31 | Saol Display | Regular Italic | 44 | 140% | 0% | orig | 33 |
| 32 | Saol Display | Regular Italic | 39.5 | 140% | 2% | orig | 32 |
| 33 | Saol Display | Regular | 84 | 95% | 0% | orig | 32 |
| 34 | Saol Display | Regular | 64 | 120% | 1% | orig | 31 |
| 35 | Saol Display | Regular | 110 | 100% | 0% | orig | 31 |
| 36 | Saol Display | Regular | 61 | 100% | 0% | orig | 31 |
| 37 | Saol Standard | Regular | 20 | 120% | 2% | orig | 30 |
| 38 | Miriam Libre | Regular | 65.5 | 100% | -1% | orig | 30 |
| 39 | Saol Display | Regular | 96 | 95% | 2% | orig | 28 |
| 40 | Saol Display | Regular Italic | 84 | 100% | 0% | orig | 28 |
| 41 | Trade Gothic LT Std | Bold | 36 | auto | 20% | orig | 28 |
| 42 | Miriam Libre | Regular | 64 | 120% | 1% | orig | 28 |
| 43 | Saol Display | Regular Italic | 55 | 100% | 0% | orig | 27 |
| 44 | Trade Gothic LT Std | Regular | 30 | 140% | 0% | orig | 27 |
| 45 | Trade Gothic LT Std | Bold | 36 | 140% | 25% | orig | 26 |
| 46 | Saol Display | Regular | 39.5 | 140% | 2% | orig | 26 |
| 47 | Trade Gothic LT Std | Bold | 31 | auto | 25% | UPPER | 26 |
| 48 | Trade Gothic LT Std | Regular | 39 | 140% | 2% | orig | 26 |
| 49 | Saol Display | Regular | 39 | 140% | 0% | orig | 25 |
| 50 | Saol Display | Regular Italic | 96 | 100% | 0% | orig | 24 |

Per family:

| Family | Segments | Min size | Max size | 5 most used sizes (segments) |
|---|---|---|---|---|
| Trade Gothic LT Std | 2383 | 13 | 400 | 26 (349), 19.5 (326), 34 (316), 30 (250), 19 (199) |
| Saol Display | 1802 | 20 | 160 | 46 (237), 55 (171), 96 (131), 42 (124), 110 (101) |
| Miriam Libre | 287 | 34.5 | 140 | 34.5 (46), 110 (44), 39.5 (43), 65.5 (30), 64 (28) |
| Saol Standard | 225 | 20 | 96 | 25 (125), 34.5 (38), 20 (30), 27 (8), 40 (8) |
| Homemade Apple | 9 | 28 | 28 | 28 (9) |
| Inter | 5 | 12 | 300 | 12 (2), 44 (1), 200 (1), 300 (1) |
| Helvetica | 2 | 150 | 150 | 150 (2) |

### B. Type floors by top-level frame size

| Bucket | Frames | Frames with text | Segments | Smallest | P10 | Median | 3 most used sizes, body text of 60+ characters (segments) |
|---|---|---|---|---|---|---|---|
| width 700 | 76 | 75 | 1637 | 13 | 18.5 | 25 | 25 (113), 26 (96), 24 (41) |
| width 1200 | 278 | 255 | 2620 | 18.5 | 26 | 39 | 34 (230), 39 (57), 38 (45) |
| other | 57 | 42 | 355 | 14 | 19.5 | 38 | 34 (50), 32 (12), 66 (9) |
| text outside any frame | 81 | 81 | 101 | 12 | 20 | 50 | 50 (5), 32 (4), 34 (4) |

No top-level frames in: 1080x1350, 1080x1920, 1080x1080, 1080 wide (other height), width 1440, width 375.

### C. Case and alignment

- Segments: 4713. textCase UPPER: 1061 (22.5%). Typed fully upper case: 1283 (27.2%). Either: 1520 (32.3%).
- textAlignHorizontal over 3867 visible text nodes: CENTER 2350 (60.8%), LEFT 1482 (38.3%), RIGHT 19 (0.5%), JUSTIFIED 16 (0.4%).

### D. Spacing, strokes, radius

- Auto-layout frames: 658 (HORIZONTAL 512, VERTICAL 146).
- itemSpacing, top 15: 10 (270), 15 (132), 20 (122), 19.33 (33), 12.02 (24), 10.96 (22), 0 (13), 24 (13), 32 (8), -19 (5), 16 (3), 40 (3), 60 (3), 11.98 (2), 12.69 (2).
- Padding, four sides pooled (2632 values), top 15: 0 (1089), 40 (528), 60 (508), 50 (342), 48.06 (48), 72.09 (48), 200 (16), 30 (10), 45 (10), 82 (6), 80 (5), 10 (4), 47.93 (4), 50.74 (4), 71.89 (4).
- Stroked frames, rectangles, vectors: 674 (RECTANGLE 200, VECTOR 196, FRAME 278). strokeWeight, top 15: 2 (425), 0.5 (108), 1.93 (35), 2.4 (24), 1.64 (22), 1 (17), 1.65 (14), 1.08 (9), 1.5 (7), 2.8 (7), 2.54 (2), 0.8 (1), 2.03 (1), 5 (1), 0/2.8/2.8/2.8 (1).
- Stroke colors, top 8 (paints): #17280A (158), #353535 (141), #231F20 (108), #000000 (90), #131313 (81), #FBF7EF (57), #FFFFFF (19), #1F2918 (18).
- LINE nodes with visible strokes: 588. Weights: 1.08 (373), 1 (97), 2 (62), 1.72 (52), 1.1 (4). Colors, top 8: #17280A (286), #353535 (166), #000000 (77), #D54141@83 (34), #FFFFFF (9), #FBF7EF (8), #1F2918 (6), #131313 (2).
- Corner radius, nodes with a fill or stroke: radius 0: 3232, non-zero: 0. Non-zero values: none.

### E. Text margins inside top-level frames

| Bucket | Frames | Box left median | Box left P10 | Box left min | Box right median | Box right P10 | Box right min | Ink left median | Ink left P10 | Ink right median | Ink right P10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| width 700 | 75 | 0 | -3 | -107 | 0 | -10 | -725 | 50 | 24 | 45 | 19 |
| width 1200 | 255 | 80 | 50 | -1 | 83 | 43 | -413 | 83 | 55 | 104 | 57 |

No frames with text in: 1080x1350, 1080x1920, 1080x1080.

## Organic Social (page 2:32177)

Top-level node types: FRAME 1085, TEXT 167, RECTANGLE 125, GROUP 80, VECTOR 6, ELLIPSE 1.

### A. Text styles

Top 50 style keys by segment count (of 333 distinct keys, 5035 segments).

| # | Family | Style | Size | Line height | Letter spacing | Case | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Trade Gothic LT Std | Regular | 15 | auto | 20% | orig | 234 |
| 2 | Trade Gothic LT Std | Regular | 18 | auto | 20% | orig | 183 |
| 3 | Trade Gothic LT Std | Regular | 18 | auto | 20% | UPPER | 164 |
| 4 | Trade Gothic LT Std | Bold | 20 | auto | 20% | UPPER | 131 |
| 5 | Saol Display | Regular | 60 | 140% | 0% | orig | 127 |
| 6 | Saol Display | Regular | 50 | 75px | 0% | orig | 123 |
| 7 | Saol Standard | Regular | 32 | 110% | 0% | orig | 122 |
| 8 | Saol Display | Regular | 24 | 140% | 0% | orig | 119 |
| 9 | Saol Standard | Regular | 40 | 110% | 0% | orig | 109 |
| 10 | Trade Gothic LT Std | Regular | 24 | 45px | 20% | UPPER | 102 |
| 11 | Saol Display | Regular | 60 | 85px | 0% | orig | 101 |
| 12 | Saol Display | Regular | 100 | 140% | 0% | orig | 97 |
| 13 | Trade Gothic LT Std | Bold | 20 | auto | 20% | orig | 93 |
| 14 | Saol Display | Regular Italic | 24 | 140% | 0% | orig | 86 |
| 15 | Saol Display | Regular Italic | 60 | 85px | 0% | orig | 83 |
| 16 | Trade Gothic LT Std | Regular | 35 | 50px | 0% | orig | 80 |
| 17 | Saol Display | Regular Italic | 50 | 75px | 0% | orig | 77 |
| 18 | Saol Display | Regular | 50 | 60px | 0% | orig | 58 |
| 19 | Trade Gothic LT Std | Regular | 25 | auto | 20% | orig | 56 |
| 20 | Trade Gothic LT Std | Regular | 30 | 85px | 20% | UPPER | 53 |
| 21 | Saol Standard | Regular | 35 | 110% | 0% | orig | 52 |
| 22 | Saol Display | Regular | 50 | 55px | 0% | orig | 51 |
| 23 | Inter | Italic | 60 | auto | 0% | orig | 51 |
| 24 | Saol Display | Regular | 90 | 100px | 0% | orig | 48 |
| 25 | Saol Display | Regular | 70 | 140% | 0% | orig | 47 |
| 26 | Trade Gothic LT Std | Regular | 20 | auto | 20% | UPPER | 46 |
| 27 | Saol Display | Regular | 32 | 140% | 0% | orig | 42 |
| 28 | Trade Gothic LT Std | Regular | 28 | 130% | 0% | orig | 40 |
| 29 | Saol Display | Regular | 90 | auto | 0% | orig | 38 |
| 30 | Saol Display | Regular | 60 | 100px | 0% | orig | 38 |
| 31 | Trade Gothic LT Std | Regular | 45 | 150% | 0% | orig | 37 |
| 32 | Trade Gothic LT Std | Regular | 30 | 45px | 20% | UPPER | 36 |
| 33 | Trade Gothic LT Std | Regular | 32 | auto | 20% | UPPER | 33 |
| 34 | Saol Display | Regular | 60 | 65px | 0% | orig | 32 |
| 35 | Trade Gothic LT Std | Regular | 28 | auto | 20% | orig | 31 |
| 36 | Saol Display | Regular Italic | 50 | 60px | 0% | orig | 31 |
| 37 | Saol Display | Regular Italic | 90 | auto | 0% | orig | 30 |
| 38 | Trade Gothic LT Std | Regular | 20 | 85px | 20% | UPPER | 30 |
| 39 | Saol Display | Regular | 38 | auto | 0% | orig | 29 |
| 40 | Saol Display | Regular | 60 | 70px | 0% | orig | 29 |
| 41 | Trade Gothic LT Std | Regular | 40 | 165% | -2% | orig | 28 |
| 42 | Trade Gothic LT Std | Bold | 18 | auto | 20% | orig | 28 |
| 43 | Saol Display | Regular | 70 | 100px | 0% | orig | 28 |
| 44 | Saol Display | Regular | 80 | 90px | 0% | orig | 25 |
| 45 | Saol Display | Regular | 50 | 140% | 0% | orig | 25 |
| 46 | Instrument Serif | Regular | 80 | 90px | 0% | UPPER | 25 |
| 47 | Saol Display | Regular | 30 | 140% | 0% | orig | 24 |
| 48 | Homemade Apple | Regular | 45 | 140% | -2% | orig | 24 |
| 49 | Saol Display | Regular | 55 | 65px | 0% | orig | 23 |
| 50 | Trade Gothic LT Std | Regular | 30 | 150% | 0% | orig | 23 |

Per family:

| Family | Segments | Min size | Max size | 5 most used sizes (segments) |
|---|---|---|---|---|
| Saol Display | 2504 | 24 | 220 | 60 (540), 50 (430), 24 (205), 90 (160), 100 (114) |
| Trade Gothic LT Std | 1860 | 15 | 500 | 18 (381), 20 (325), 15 (235), 30 (207), 25 (135) |
| Saol Standard | 371 | 30 | 100 | 32 (142), 40 (113), 35 (54), 52 (17), 45 (14) |
| Homemade Apple | 110 | 35 | 65 | 50 (34), 45 (27), 60 (18), 36 (12), 40 (11) |
| Inter | 97 | 50 | 80 | 60 (53), 50 (24), 80 (20) |
| Instrument Serif | 41 | 32 | 80 | 80 (35), 32 (5), 65 (1) |
| Times New Roman | 22 | 75 | 200 | 75 (17), 200 (5) |
| P22 Cezanne Pro | 16 | 80 | 135 | 80 (8), 130 (7), 135 (1) |
| Kristi | 5 | 80 | 100 | 80 (3), 100 (2) |
| Ingrid Darling | 3 | 95 | 95 | 95 (3) |
| Allison | 3 | 95 | 95 | 95 (3) |
| Arvo | 2 | 80 | 80 | 80 (2) |
| Over the Rainbow | 1 | 28 | 28 | 28 (1) |

### B. Type floors by top-level frame size

| Bucket | Frames | Frames with text | Segments | Smallest | P10 | Median | 3 most used sizes, body text of 60+ characters (segments) |
|---|---|---|---|---|---|---|---|
| 1080x1350 | 465 | 362 | 1818 | 15 | 18 | 32 | 24 (161), 50 (53), 32 (46) |
| 1080x1920 | 542 | 526 | 2201 | 15 | 20 | 42 | 60 (157), 24 (95), 30 (93) |
| 1080x1080 | 27 | 24 | 205 | 15 | 18 | 38 | 38 (19), 24 (16), 28 (12) |
| 1080 wide (other height) | 8 | 8 | 22 | 24 | 24 | 40 | 24 (3) |
| width 700 | 2 | 2 | 4 | 35 | 35 | 37.5 | none |
| width 1200 | 2 | 2 | 7 | 26 | 26 | 26 | 35 (1), 55 (1) |
| other | 119 | 45 | 528 | 15 | 18 | 50 | 50 (92), 60 (24), 45 (22) |
| text outside any frame | 167 | 166 | 250 | 15 | 24 | 52 | 50 (41), 24 (28), 80 (19) |

No top-level frames in: width 1440, width 375.

### C. Case and alignment

- Segments: 5035. textCase UPPER: 871 (17.3%). Typed fully upper case: 792 (15.7%). Either: 1496 (29.7%).
- textAlignHorizontal over 3572 visible text nodes: CENTER 2248 (62.9%), LEFT 1076 (30.1%), JUSTIFIED 133 (3.7%), RIGHT 115 (3.2%).

### D. Spacing, strokes, radius

- Auto-layout frames: 16 (HORIZONTAL 16).
- itemSpacing, top 15: 40 (4), 49 (4), 0 (3), 50 (3), 56 (2).
- Padding, four sides pooled (64 values), top 15: 0 (64).
- Stroked frames, rectangles, vectors: 352 (VECTOR 346, RECTANGLE 6). strokeWeight, top 15: 1.5 (175), 1 (59), 2.5 (48), 4 (33), 2 (19), 3 (12), 3.5 (6).
- Stroke colors, top 8 (paints): #000000 (258), #17280A (61), #FFFFFF (28), #353535 (5).
- LINE nodes with visible strokes: 209. Weights: 1 (182), 2 (27). Colors, top 8: #FFFFFF (98), #353535 (69), #17280A (22), #FBF7EF (20).
- Corner radius, nodes with a fill or stroke: radius 0: 3951, non-zero: 14. Non-zero values: 5 (4), 400 (4), 70 (2), 100 (2), 200 (2).

### E. Text margins inside top-level frames

| Bucket | Frames | Box left median | Box left P10 | Box left min | Box right median | Box right P10 | Box right min | Ink left median | Ink left P10 | Ink right median | Ink right P10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1080x1350 | 362 | 117.5 | 47 | -165 | 141.5 | 38 | -311 | 161.5 | 60 | 186 | 56 |
| 1080x1920 | 526 | 116 | 57 | -50 | 121 | 48 | -78 | 140 | 95 | 156.5 | 92 |
| 1080x1080 | 24 | 150 | 55 | 44 | 74 | 50 | 50 | 178.5 | 55 | 87 | 50 |
| width 700 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 14 | 14 | 14 | 14 |
| width 1200 | 2 | 244 | 244 | 244 | 245 | 245 | 245 | 252.5 | 246 | 253.5 | 247 |

1080x1920 vertical insets (526 frames): box top median 272, P10 170, min 82; box bottom median 291, P10 122, min 28; ink top median 281, P10 192; ink bottom median 298, P10 165.

## Paid Social (page 2:35858)

Top-level node types: FRAME 608, RECTANGLE 97, TEXT 54, VECTOR 3, GROUP 1.

### A. Text styles

Top 50 style keys by segment count (of 337 distinct keys, 4345 segments).

| # | Family | Style | Size | Line height | Letter spacing | Case | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Saol Display | Regular | 80 | 110% | 0% | orig | 130 |
| 2 | Saol Display | Regular Italic | 90 | 60px | 0% | orig | 129 |
| 3 | Trade Gothic LT Std | Bold | 48 | auto | 20% | orig | 110 |
| 4 | Trade Gothic LT Std | Bold | 36 | auto | 20% | UPPER | 103 |
| 5 | Trade Gothic LT Std | Bold | 40 | auto | 20% | orig | 96 |
| 6 | Futura PT | Book | 100 | 110% | 3% | orig | 88 |
| 7 | Saol Standard | Regular | 32 | 110% | 0% | orig | 74 |
| 8 | Trade Gothic LT Std | Regular | 18 | auto | 20% | UPPER | 72 |
| 9 | Trade Gothic LT Std | Bold | 30 | 120% | 30% | UPPER | 72 |
| 10 | Trade Gothic LT Std | Bold | 26 | 140% | 1% | UPPER | 72 |
| 11 | Trade Gothic LT Std | Regular | 26 | 140% | 1% | UPPER | 72 |
| 12 | Trade Gothic LT Std | Bold | 36 | auto | 20% | orig | 70 |
| 13 | Saol Display | Regular Italic | 80 | 110% | 0% | orig | 60 |
| 14 | Saol Display | Regular Italic | 60 | 110% | 0% | orig | 60 |
| 15 | Trade Gothic LT Std | Bold | 12 | 120% | 10% | UPPER | 60 |
| 16 | Trade Gothic LT Std | Regular | 12 | 120% | 10% | UPPER | 60 |
| 17 | Saol Display | Regular | 25 | 110% | 0% | orig | 60 |
| 18 | Saol Display | Regular | 75 | 110% | 4% | orig | 56 |
| 19 | Saol Display | Regular Italic | 75 | 110% | 4% | orig | 54 |
| 20 | Trade Gothic LT Std | Regular | 35 | 253% | 5% | UPPER | 54 |
| 21 | Saol Display | Regular | 60 | 110% | 0% | orig | 52 |
| 22 | Saol Display | Regular | 64 | 120% | 0% | Title | 52 |
| 23 | Saol Display | Regular | 60 | 130% | 4% | orig | 51 |
| 24 | Trade Gothic LT Std | Bold | 22 | 140% | 1% | UPPER | 48 |
| 25 | Saol Standard | Regular | 100 | 110% | 0% | orig | 48 |
| 26 | Saol Display | Regular | 22 | 110% | 0% | orig | 48 |
| 27 | Trade Gothic LT Std | Bold | 10 | 120% | 10% | UPPER | 48 |
| 28 | Trade Gothic LT Std | Regular | 10 | 120% | 10% | UPPER | 48 |
| 29 | Trade Gothic LT Std | Regular | 20 | auto | 20% | UPPER | 47 |
| 30 | Saol Standard | Regular | 35 | 110% | 0% | orig | 45 |
| 31 | Trade Gothic LT Std | Bold | 28 | 136% | 5% | UPPER | 43 |
| 32 | Trade Gothic LT Std | Bold | 32 | 140% | 1% | UPPER | 42 |
| 33 | Saol Display | Regular Italic | 70 | 120% | 0% | orig | 40 |
| 34 | Trade Gothic LT Std | Regular | 28 | 140% | 1% | UPPER | 39 |
| 35 | Saol Display | Regular Italic | 75 | 110% | 0% | orig | 36 |
| 36 | Trade Gothic LT Std | Regular | 30 | 130% | 11% | UPPER | 36 |
| 37 | Trade Gothic LT Std | Regular | 50 | 253% | 5% | UPPER | 36 |
| 38 | Trade Gothic LT Std | Bold | 35 | 150% | 2% | UPPER | 34 |
| 39 | Saol Display | Regular | 75 | 110% | 0% | orig | 33 |
| 40 | Futura PT | Book | 200 | 110% | 3% | orig | 33 |
| 41 | Trade Gothic LT Std | Regular | 32 | auto | 5% | UPPER | 33 |
| 42 | Futura PT | Book | 60 | 110% | 3% | orig | 32 |
| 43 | Trade Gothic LT Std | Regular | 40 | 130% | 0% | UPPER | 32 |
| 44 | Trade Gothic LT Std | Regular | 32 | 140% | 0% | orig | 30 |
| 45 | Saol Display | Regular | 64 | 110% | 0% | orig | 29 |
| 46 | Saol Display | Regular | 60 | 120% | 0% | orig | 28 |
| 47 | Saol Display | Regular Italic | 64 | 120% | 0% | Title | 26 |
| 48 | Saol Display | Regular Italic | 70 | 120% | 0% | Title | 26 |
| 49 | Saol Display | Regular Italic | 150 | 70px | 0% | orig | 26 |
| 50 | Saol Display | Regular Italic | 150 | 100% | 0% | orig | 25 |

Per family:

| Family | Segments | Min size | Max size | 5 most used sizes (segments) |
|---|---|---|---|---|
| Saol Display | 2028 | 11 | 250 | 80 (308), 60 (294), 90 (221), 75 (190), 70 (145) |
| Trade Gothic LT Std | 1888 | 3.5 | 300 | 30 (220), 40 (192), 36 (175), 35 (153), 26 (144) |
| Saol Standard | 205 | 32 | 100 | 32 (74), 100 (48), 35 (45), 60 (25), 50 (3) |
| Futura PT | 172 | 40 | 200 | 100 (88), 200 (33), 60 (32), 75 (15), 40 (4) |
| Avenir LT Std | 36 | 28 | 35 | 28 (18), 35 (18) |
| Inter | 16 | 60 | 200 | 128 (9), 200 (6), 60 (1) |

### B. Type floors by top-level frame size

| Bucket | Frames | Frames with text | Segments | Smallest | P10 | Median | 3 most used sizes, body text of 60+ characters (segments) |
|---|---|---|---|---|---|---|---|
| 1080x1350 | 80 | 66 | 473 | 10 | 10 | 32 | 30 (2), 50 (2), 33 (1) |
| 1080x1920 | 189 | 165 | 860 | 12 | 12 | 36 | 40 (12), 45 (3), 34 (2) |
| 1080x1080 | 186 | 173 | 972 | 18 | 26 | 40 | 38 (4), 40 (4), 35 (3) |
| 1080 wide (other height) | 3 | 2 | 2 | 40 | 40 | 40 | none |
| width 1200 | 23 | 20 | 85 | 30 | 30 | 40 | 30 (3) |
| other | 128 | 80 | 1875 | 3.5 | 30 | 60 | 32 (31), 60 (26), 30 (19) |
| text outside any frame | 54 | 54 | 78 | 28 | 32 | 85 | 32 (6), 150 (2), 28 (1) |

No top-level frames in: width 700, width 1440, width 375.

### C. Case and alignment

- Segments: 4345. textCase UPPER: 1369 (31.5%). Typed fully upper case: 589 (13.6%). Either: 1750 (40.3%).
- textAlignHorizontal over 3331 visible text nodes: CENTER 2711 (81.4%), LEFT 486 (14.6%), RIGHT 134 (4.0%).

### D. Spacing, strokes, radius

- Auto-layout frames: 43 (VERTICAL 1, HORIZONTAL 42).
- itemSpacing, top 15: 19.33 (42), 37 (1).
- Padding, four sides pooled (172 values), top 15: 0 (172).
- Stroked frames, rectangles, vectors: 209 (VECTOR 195, RECTANGLE 13, FRAME 1). strokeWeight, top 15: 1 (78), 2 (61), 1.5 (48), 3 (22).
- Stroke colors, top 8 (paints): #17280A (61), #FBF7EF (61), #F1E7D4 (48), #FFFFFF (37), #000000 (2).
- LINE nodes with visible strokes: 171. Weights: 1 (167), 3 (2), 10 (2). Colors, top 8: #FFFFFF (121), #FBF7EF (39), #000000 (11).
- Corner radius, nodes with a fill or stroke: radius 0: 4195, non-zero: 38. Non-zero values: 30 (24), 60 (14).

### E. Text margins inside top-level frames

| Bucket | Frames | Box left median | Box left P10 | Box left min | Box right median | Box right P10 | Box right min | Ink left median | Ink left P10 | Ink right median | Ink right P10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1080x1350 | 66 | 138 | 0 | 0 | 82.5 | 0 | -182 | 172 | 48 | 144 | 49 |
| 1080x1920 | 165 | 41 | 0 | -50 | 6 | -11 | -172 | 122 | 52 | 121 | 47 |
| 1080x1080 | 173 | 0 | 0 | -56 | 0 | 0 | -180 | 75 | 48 | 68 | 49 |
| width 1200 | 20 | 83 | 0 | 0 | 82 | -179 | -272 | 162 | 48 | 169.5 | 33 |

1080x1920 vertical insets (165 frames): box top median 396, P10 126, min -10; box bottom median 339, P10 98, min -35; ink top median 400, P10 167; ink bottom median 388, P10 142.

No frames with text in: width 700.

## Website (page 2:182972)

Top-level node types: FRAME 56, RECTANGLE 40, TEXT 11, VECTOR 2, INSTANCE 2.

### A. Text styles

Top 30 style keys by segment count (of 30 distinct keys, 872 segments).

| # | Family | Style | Size | Line height | Letter spacing | Case | Segments |
|---|---|---|---|---|---|---|---|
| 1 | Trade Gothic LT Std | Regular | 13 | 20px | 2% | orig | 399 |
| 2 | Trade Gothic LT Std | Bold | 11 | 120% | 10% | UPPER | 220 |
| 3 | Trade Gothic LT Std | Bold | 11 | 120% | 20% | UPPER | 65 |
| 4 | Saol Display | Thin Italic | 22 | 20px | 2% | orig | 56 |
| 5 | Saol Display | Regular | 30 | 100% | -3% | orig | 24 |
| 6 | Trade Gothic LT Std | Bold | 13 | 20px | 2% | orig | 15 |
| 7 | Saol Display | Regular | 40 | 100% | -3% | orig | 12 |
| 8 | Trade Gothic LT Std | Regular | 6 | 17px | 2% | orig | 9 |
| 9 | Saol Display | Regular | 48 | 100% | -3% | orig | 8 |
| 10 | Saol Display | Thin Italic | 20 | 20px | 2% | orig | 8 |
| 11 | Trade Gothic LT Std | Bold | 11 | 20px | 10% | UPPER | 7 |
| 12 | Trade Gothic LT Std | Regular | 12 | 20px | 2% | orig | 6 |
| 13 | Saol Display | Regular Italic | 30 | 100% | -3% | orig | 5 |
| 14 | Saol Display | Regular | 21 | 22px | -3% | UPPER | 4 |
| 15 | Saol Display | Regular Italic | 40 | 100% | -3% | orig | 4 |
| 16 | Saol Display | Regular | 27 | 100% | -3% | orig | 4 |
| 17 | Saol Display | Regular Italic | 48 | 100% | -3% | orig | 4 |
| 18 | ABeeZee | Regular | 305.5 | 76.35px | 0% | orig | 3 |
| 19 | Trade Gothic LT Std | Bold | 11 | 120% | 15% | UPPER | 3 |
| 20 | Trade Gothic LT Std | Bold | 8 | 16px | 10% | UPPER | 3 |
| 21 | Saol Display | Regular Italic | 47 | 100% | -3% | orig | 2 |
| 22 | Saol Display | Regular Italic | 27 | 100% | -3% | orig | 2 |
| 23 | Saol Standard | Regular Italic | 13 | 80% | -3% | orig | 2 |
| 24 | Trade Gothic LT Std | Bold | 11 | 20px | 10% | orig | 1 |
| 25 | Neue Haas Grotesk Display Pro | 65 Medium | 305.5 | 76.35px | 0% | orig | 1 |
| 26 | Trade Gothic LT Std | Regular | 13 | 16px | 2% | orig | 1 |
| 27 | Saol Standard | Regular Italic | 25 | 80% | -3% | orig | 1 |
| 28 | Saol Standard | Regular Italic | 25 | 120% | -3% | orig | 1 |
| 29 | Trade Gothic LT Std | Regular | 15 | 20% | 2% | orig | 1 |
| 30 | Trade Gothic LT Std | Regular | 13 | 40px | 2% | orig | 1 |

Per family:

| Family | Segments | Min size | Max size | 5 most used sizes (segments) |
|---|---|---|---|---|
| Trade Gothic LT Std | 731 | 6 | 15 | 13 (416), 11 (296), 6 (9), 12 (6), 8 (3) |
| Saol Display | 133 | 20 | 48 | 22 (56), 30 (29), 40 (16), 48 (12), 20 (8) |
| Saol Standard | 4 | 13 | 25 | 13 (2), 25 (2) |
| ABeeZee | 3 | 305.5 | 305.5 | 305.5 (3) |
| Neue Haas Grotesk Display Pro | 1 | 305.5 | 305.5 | 305.5 (1) |

### B. Type floors by top-level frame size

| Bucket | Frames | Frames with text | Segments | Smallest | P10 | Median | 3 most used sizes, body text of 60+ characters (segments) |
|---|---|---|---|---|---|---|---|
| 1080 wide (other height) | 1 | 0 | 0 | n/a | n/a | n/a | none |
| width 1440 | 42 | 40 | 476 | 8 | 11 | 13 | 13 (78), 11 (27), 40 (12) |
| width 375 | 15 | 15 | 385 | 6 | 11 | 13 | 13 (40), 11 (10), 27 (6) |
| text outside any frame | 11 | 11 | 11 | 11 | 11 | 13 | 13 (4) |

No top-level frames in: 1080x1350, 1080x1920, 1080x1080, width 700, width 1200.

### C. Case and alignment

- Segments: 872. textCase UPPER: 302 (34.6%). Typed fully upper case: 63 (7.2%). Either: 307 (35.2%).
- textAlignHorizontal over 779 visible text nodes: LEFT 638 (81.9%), CENTER 141 (18.1%).

### D. Spacing, strokes, radius

- Auto-layout frames: 218 (HORIZONTAL 53, VERTICAL 165).
- itemSpacing, top 15: 25 (110), 15.02 (25), 16 (22), 20 (22), 15 (20), 74 (8), 10 (5), 35 (3), 90 (3).
- Padding, four sides pooled (872 values), top 15: 0 (852), 15 (8), 201 (8), 16 (2), 191 (2).
- Stroked frames, rectangles, vectors: 138 (RECTANGLE 50, VECTOR 87, FRAME 1). strokeWeight, top 15: 1 (138).
- Stroke colors, top 8 (paints): #17280A (83), #BEADA2 (41), #BEADA2@40 (9), #353535 (3), #BEADA2@30 (2).
- LINE nodes with visible strokes: 273. Weights: 1 (270), 2 (3). Colors, top 8: #BEADA2 (196), #17280A (48), #000000 (24), #F6F4EE (3), #F0EDE6 (2).
- Corner radius, nodes with a fill or stroke: radius 0: 460, non-zero: 9. Non-zero values: 5/5/0/0 (9).

### E. Text margins inside top-level frames

No top-level frames in buckets 1080x1350, 1080x1920, 1080x1080, width 700 or width 1200 on this page.

## Components (page 2:31579)

### F. Type specimens

The page has 17 top-level nodes: 8 text nodes (listed below as specimens), 1 image rectangle (2:31583, "Screen Shot 2023-03-05 at 12.01 1", 1915x1326, a raster that cannot be read as text) and 8 frames named FIRST DRAFT ICONS (5), UPDATED 4 ICON, UPDATED 3 ICON and DRAFT 01 that hold icon and badge text (not listed). "Role named" quotes the specimen's own text when that text names a role. No other text layers sit at the top level of the page, so no separate label layers were found.

| Node | Position x,y | Text (first characters) | Family | Style | Size | Line height | Letter spacing | Case | Align | Role named |
|---|---|---|---|---|---|---|---|---|---|---|
| 2:31580 | 0,0 | High Light | Saol Display | Regular | 150 | 115% | 0% | orig | LEFT | none |
| 2:31582 | 0,217 | High Light (first of 2 lines, 21 characters) | Saol Display | Regular | 90 | 120% | 0% | orig | LEFT | none |
| 2:31584 | 0,478 | Product Name & Pull Quotes | Saol Display | Regular | 50 | auto | 0% | orig | LEFT | "Product Name & Pull Quotes" |
| 2:31585 | 0,608 | 12345 $24 | Saol Display | Regular | 30 | auto | 15% | orig | LEFT | none |
| 2:31581 | 958,29 | INLINE TITLES + SMALL HEADLINES | Trade Gothic LT Std | Bold | 24 | auto | 20% | orig (typed caps) | LEFT | "INLINE TITLES + SMALL HEADLINES" |
| 2:31586 | 957,100 | Paragraph Style 1 (first line, 89 characters) | Saol Display | Regular | 24 | 150% | 2% | orig | LEFT | "Paragraph Style 1" |
| 2:31587 | 958,366 | Paragraph Style 2 (first line, 71 characters) | Trade Gothic LT Std | Regular | 24 | 140% | 2% | orig | LEFT | "Paragraph Style 2" |
| 2:31588 | 958,544 | Paragraph Style 3 (first line, 71 characters) | Trade Gothic LT Std | Regular | 20 | 130% | 2% | orig | LEFT | "Paragraph Style 3" |

