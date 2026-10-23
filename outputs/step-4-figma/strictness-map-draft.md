# HLR strictness map (draft for Gate 4)

[derived] Drafted by Chat 5 with Foundations, 2026-10-23 (Gate 2 package call 7 a). Eddie rules it at Gate 4, before any module; until then nothing here binds. Board: HLR Library, 00 Foundations, `Strictness map` (7:15).

Rules from the playbook (section 4): one row per element class; default posture is locked and latitude needs a reason; the map governs appearance only, while exact figures, legal language and testimonial authenticity live in the claims ledger, so an element can be design-loose and content-strict; checks flag and never block shipping; every new master gets a strictness row, a slot-map entry and a type-registry entry.

Element classes from `asset-types.md` (E##, pattern-review 4.2). Tiers: the variables and styles in HLR Library (`figma.yaml` variable_ids).

| Element class | Binds to | Modes | Floor | Content and claims rule | Posture and who changes it |
|---|---|---|---|---|---|
| Wordmark (bar, masthead, sign-off) | Marks/Wordmark; fill component/mark/fill (on photo: mark/fill-on-photo) | Ground: yes. Canvas: scaled by the master | Clear space and minimum size: gap, owner HLR | logo-assets.md rules 1 to 5 | Locked. HLR (the asset); Eddie (placement rules) |
| Small mark (monogram) | Marks/Monogram; fill component/mark/fill | Ground: yes. Canvas: scaled by the master | Clear space and minimum size: gap, owner HLR | logo-assets.md; the star lockup waits for HLR's vector | Locked. HLR; Eddie |
| Eyebrow (standard, spread) | Text style eyebrow; ink color/semantic/text/* | Ground: yes. Canvas: yes (size) | Label floor: web 12; body 4.5:1 ink | voice-contract.md; slot map budget | Locked. Eddie |
| Headline with one italic accent word | Styles display/* and headline; accent as a range override (font/style/display-accent) | Ground: yes. Canvas: yes (size) | Display 3.0:1 on certified pairs | voice-contract.md; one accent word per line (Gate 2 package call 10) | Locked. Eddie |
| Body block | Text style body; ink text/primary or text/muted | Ground: yes. Canvas: yes (size) | Body 4.5:1; web 14, social 40, email 45 | voice-contract.md; legal-ledger.json | Locked. Eddie |
| CTA outline box | component/cta/*; weight aliases stroke/cta | Ground: yes (inverse on dark and on photo). Canvas: yes (stroke) | ui 3.0:1; label at the label floor | Gate 1 C6 (outline caps box; filled boxes retire); CTA copy from the copy engines | Locked. Eddie |
| Text link with a trailing rule | component/link/label and link/rule; style link | Ground: yes. Canvas: yes (size) | Body 4.5:1 | Gate 1 C6 (the secondary CTA) | Locked. Eddie |
| Rule | component/rule/stroke and rule/weight | Ground: yes. Canvas: no | ui 3.0:1 where it carries meaning | art-direction.md | Placement guided (layout varies by module); look locked. Eddie |
| Callout (leader and label; numbered) | component/callout/* | Ground: yes (on photo only where the image is dark under it). Canvas: yes (size) | Body 4.5:1 on certified grounds; on photo judged by eye | art-direction.md (callouts on product imagery only); legal-ledger.json for what a label claims | Locked. Eddie |
| Image frame (full bleed, mat, diptych) | space/*, radius/none; component/placeholder/* until rights land | Ground: frame only. Canvas: margins by canvas | No text test on photography; judged by eye at review | Project rule 8 (usage rights); art-direction.md | Crop and composition guided (each image differs); frame locked. Eddie |
| Star row (sourced reviews only) | The star device (one per surface); styles label and body | Ground: yes. Canvas: yes (size) | Body 4.5:1 | Customer evidence: verified, sourced quotes only; never fabricated (playbook) | Locked; content-strict. Eddie; HLR supplies the reviews |
| Handle sign-off | Text style fine | Ground: yes. Canvas: yes (size) | Label floor | voice-contract.md prohibited patterns (the handle's known misspelling) | Locked. Eddie |
| Offer line with merge tokens | Text styles label or body | Ground: yes. Canvas: yes (size) | Body 4.5:1 | legal-ledger.json (required language); offers wait on HLR (C10) | Locked; content-strict. Eddie; HLR for the offer |
| Swipe cue | Text style label | Ground: yes. Canvas: social only | Label floor | asset-types.md (organic social recipes) | Locked. Eddie |
| Proof line (icon and caps label) | Text style label; the claims ledger | Ground: yes. Canvas: yes (size) | Label floor; body 4.5:1 ink | legal-ledger.json: every proof line routes through it | Locked; content-strict. Eddie; HLR signs claims |
| Price | Text style price | Ground: yes. Canvas: yes (size) | Body 4.5:1 | products.json: no figure without a source | Locked; content-strict. Eddie |
| Script line | Text style script (Homemade Apple) | Ground: yes. Canvas: social and email only | Display 3.0:1; one short line per asset | Gate 1 C5 (social and email only) | Locked. Eddie |
| Labelled grey placeholder | component/placeholder/fill and placeholder/label | Ground: no (always grey). Canvas: yes (label size) | Body 4.5:1 for the label (8.65:1 certified) | Project rule 8: stands in until rights land | Locked. Eddie |

Open for Gate 4: whether any row gets latitude (the two guided rows above are the proposal), and who besides Eddie may change a locked row once HLR's team runs the forge (Gate 1 a).
