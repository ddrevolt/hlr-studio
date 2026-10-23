Read and ran (round 1, fresh context, 2026-10-21): read REVIEW.md in full, PROGRESSION.md, the 2026-10-20 and 2026-10-18 entries of DECISIONS.md and LEARNINGS.md, token-proposal.md sections 4, 5 and 7, bundle-report-0.5.2.md section 7, close-status.md, BUNDLE.md, diff-0.5.2-0.5.3.patch and every file it changes in full, the author's checks/ outputs and battery.sh, and the pack copy; ran in the cloud (node v22.22.0, Python 3.13.16) run_tests.sh on fresh unzips of both plugins, the description check, REVIEW's spec scan, tokens_build.js check, export and figma-plan on a copy of pack/, the email preflight on that copy, REVIEW's resolution loop, the em dash grep over the diff's added lines, 0.5.2's tests against the 0.5.3 code, and probes of my own against tokens_build.js, canvas_check.js, slot_lint.js and the canvas recipe; no Figma call.

# Review: studio-engine 0.5.3 and hlr-studio-engine 0.5.3, round 1

Fresh-context reviewer; the author's transcript was not read. Counts: 0 blockers, 4 should-fix, 7 notes. Every probe output sits under /tmp/claude-0/ (my scratch). Out of scope and not reported: R3-01, R3-02, R3-03 to R3-07, REVIEW's R5 and R6 guards, lane D's engine gaps.

## Findings, most severe first

R1-01 should-fix | skills/design-system/scripts/tokens_build.js:994 (also :905; skills/design-system/SKILL.md:38 and :41; skills/design-system/references/token-model.md:198; skills/asset-production/scripts/face_check.js:137) | Failure: 0.5.3 puts the family and style variables in a collection with three canvas modes (the plan gives font/family/display the stand-in Instrument Serif on web, social and email), while font_switch still lists 8 variables with no mode ("Switch each one to its real value") and the build's rule "a variable that already holds its plan real_value was switched: leave it" has no per-mode reading -> a review switch made by the list, one value per variable (DECISIONS 2026-10-18, Gate 2 question 2, counts the switch as eight variables), leaves the social and email columns on the stand-ins, so every social and email master, and the Type board's social and email frames, still render Instrument Serif and Inter while web shows Saol and Trade Gothic; a later build then either keeps the half switch or sets the switched column back; face_check's way back ("switch the variable to the stand-in") has the same gap, and the switch is now 24 values, not 8 | Owner: lane H; Eddie rules the changed switch procedure | Check: a test that font_switch names every canvas mode of a moded family or style variable (or says every mode) and that a partly switched variable is reported; probe P-R1-01 | Status: open

R1-02 should-fix | skills/asset-production/scripts/canvas_check.js:191 (the claim: skills/asset-production/references/figma-recipes.md:255) | Failure: an email master on its canvas holds an element whose main component, or a layer inside it, pins web, under the reading the recipe says it handles where the instance does not report that mode as its own (overrides empty) -> the element's label resolves to web and renders 12 px; canvas_check reads each size in the mode its own text resolves to and never against the master's canvas, so it compares 12 with font/size/label on web, exits 0 and reports "2 sized on their canvas"; the element's own check passes the inner pin with a warning (probe P2, exit 0), so nothing stops it and the flex probe then measures web sizes on an email master; "the check reads either answer correctly" is not true for that reading (K3 covers only the reading where the override is listed) | Owner: lane H | Check: a finding when a text node's resolved mode is not the asked canvas's mode id, which holds under both readings, with a K test whose node mode differs from the root and lists no override; probe P-R1-02 | Status: open

R1-03 should-fix | skills/asset-production/SKILL.md:42 (also :27; skills/asset-production/scripts/canvas_check.js:186; skills/asset-production/references/figma-recipes.md:173) | Failure: Step 4 builds the CTA element (the C6 outline box) by the skill, whose binding rule is "Every fill, text color, radius and gap that has a token uses the token"; no line in asset-production names a stroke weight (the only stroke line is "type sizes and strokes take a value per canvas"), so nothing makes the build bind strokeWeight to component/cta/weight -> a typed weight in an email master draws that weight where component/cta/weight resolves to 2 px (web 1), canvas_check passes because its inventory reads text sizes only, and item 3's purpose (one CTA element for every canvas, component.cta.weight aliasing stroke.cta) is lost at the first build without a word | Owner: lane H | Check: the binding rule names stroke weights, and canvas_check (or the structure linter) reads each stroke weight's binding on the master and its value on the canvas; probe P-R1-03 | Status: open

R1-04 should-fix | BUNDLE.md:7 | Failure: the bundle note inside both shipped .plugin files says brand-context.md is not in the pack and "Every skill resolves hlr, then stops at the missing brand-context.md" -> at this build the pack carries lane E's brand-context.md (checks/mac-battery-rc2.log:30, "the pack's own (lane E)"; REVIEW check 8 at rc 0), and the email preflight on the pack copy exits 0 (resolved 5, blocking 0, degraded 10), so after install every copy skill runs on Pack v0 while PROGRESSION still has lane E and Gate 2 open, which the note tells its reader cannot happen | Owner: lane H | Check: the note's pack-state line read against preflight.py --pack and REVIEW check 8 at the final build; the note rides inside the plugin, so the fix needs the rebuild and check 7 again; probe P-R1-04 | Status: open

R1-05 note | skills/asset-production/scripts/slot_lint.js:382 | Failure: an S03 or S04 entry whose measured_at names "canvas email" -> C5c is silent (it warns only when no declared canvas is named), so a social master measured on the email canvas passes; an element (E##) has no canvas of its own (on Auto it measures at the default canvas) and the docs give no measured_at form for it, so C5c warns on every element entry or accepts "canvas web" | Owner: lane H | Check: a canvas field on each slot map entry, from asset_types, that C5c compares; probe: tpl-social-on-email.json through slot_lint.js --pack draws no canvas warning | Status: open

R1-06 note | skills/asset-production/references/figma-recipes.md:174 | Failure: HLR's S01, S03 and S04 are variant sets (pack asset-types.md); the recipe says a master sets its canvas on its root and never says whether a set takes it on the set or on each variant -> if the canvas goes on the set and an instance of a variant does not take a mode set on its parent set (the API reference the recipe cites does not say), every instance placed outside the set renders web sizes while canvas_check on the set passes | Owner: lane H | Check: the recipe names where a set's canvas goes, and the first build reads one variant instance's resolvedVariableModes (read only) and records the answer beside the instance question at :255 | Status: open

R1-07 note | skills/asset-production/SKILL.md:32 | Failure: a master whose canvas the roster names "none" (Google link 1200x628 and square 1200x1200, pack asset-types.md Canvases table) reaches step 6, "Canvas, first", which runs canvas_check --canvas <mode> whenever the tokens declare canvas modes -> --canvas none exits 2 (could not start), and neither the skill nor the recipe says to skip the check or what to run instead | Owner: lane H | Check: one line in step 6 and the recipe for a none master, or a canvas_check path for it with a test | Status: open

R1-08 note | skills/asset-production/references/figma-recipes.md:209 | Failure: a frame with many nodes that set an explicit layout mode (a template of nested masters, under the reading where instances report their main component's mode) -> the first page's overrides list counts toward no budget (size starts at 600 at :219 and grows by nodes only), so page 1 can pass use_figma's 20 KB result cap (REVIEW row R9) | Owner: lane H | Check: count the collection, root and overrides into size; a mock test with a long overrides list | Status: open

R1-09 note | skills/design-system/scripts/tokens_build.js:353 (also :476; BUNDLE.md:12) | Failure: design choices ship without a marked default for Eddie -> (a) canvas-mode-required passes a font.size or stroke token that aliases a moded token, while DECISIONS 2026-10-18 says every font.size and stroke token "must" state social and email; (b) a component weight or size that holds a raw value gets no canvas check (component.rule.weight, 1px on every canvas, passes, where the same token under stroke.* would be a finding); (c) tailwind.tokens.js has no stroke key (no borderWidth), unannounced, while the export line says tokens.css and Tailwind carry the web canvas (the class of REVIEW row R15, a token left out without a word); (d) BUNDLE.md's 0.5.3 defaults leave out two that close-status lists, token findings counted apart from contrast failures and the renamed and new rule names | Owner: lane H lists them; Eddie rules | Check: the defaults list in BUNDLE.md and the release report read against the code and close-status | Status: open

R1-10 note | skills/design-system/scripts/tokens_build.js:978 (also skills/design-system/SKILL.md:38) | Failure: Chat 5 follows the plan line "rename default (7:3) to web; create social, email; record each new mode id" and records social and email, keeping the key default: "7:3" -> figma.yaml names a mode the library no longer has and leaves out web, which rule 5's both-ways compare reads as an unrecorded write and an unrecorded delete (the next plan asks for the rename again, harmlessly) | Owner: lane H | Check: the plan line and step 4 name the figma.yaml edit (layout: id, web 7:3, then social and email) | Status: open

R1-11 note | BUNDLE.md:3 | Failure: the note and close-status cite Eddie's 2026-10-20 ruling (0.5.2 is never installed; 0.5.3 replaces it), which has no DECISIONS line yet, and PROGRESSION Step 3 still reads "then installs hlr-studio-engine 0.5.2" -> a chat that opens on the record (rule 1) reads 0.5.2 as still to install | Owner: lane H, at its close | Check: rule 10's git diff of DECISIONS.md and PROGRESSION.md at close | Status: open

## Probes (each should-fix)

Set up once (scratch only):

```
S=/tmp/claude-0/r1-probe; rm -rf $S && mkdir -p $S && cp -R /home/claude/w/review/pack $S/pack && chmod -R u+w $S/pack
E=/home/claude/w/review/engine-0.5.3
```

P-R1-01 (the switch list has no canvas dimension; the variable has three):

```
node $E/skills/design-system/scripts/tokens_build.js figma-plan --pack $S/pack --out $S/plan.json > /dev/null
python3 -I -c "import json,sys; p=json.load(open(sys.argv[1])); L=[c for c in p['collections'] if c['key']=='layout'][0]; print(L['modes'], [v['modes'] for v in L['variables'] if v['name']=='font/family/display']); print(len(p['font_switch']['variables']), p['font_switch']['variables'][0])" $S/plan.json
```

Output: `['web', 'social', 'email']`, font/family/display `Instrument Serif` on all three (social and email `held`), then `8 {'name': 'font/family/display', 'build': 'Instrument Serif', 'real': 'Saol Display'}`; font_switch.how reads "Switch each one to its real value".

P-R1-02 (a text node off the master's canvas, no override listed, passes; an element's inner pin only warns):

```
rm -rf $S/pk && cp -R /home/claude/w/review/pack $S/pk && chmod -R u+w $S/pk
sed -i 's#  layout: { id: "VariableCollectionId:7:9", default: "7:3" }#  layout: { id: "VariableCollectionId:7:9", web: "7:3", social: "7:20", email: "7:21" }#' $S/pk/figma.yaml
node $E/skills/design-system/scripts/tokens_build.js figma-plan --pack $S/pk --out $S/pk/figma-variable-plan.json > /dev/null
cat > $S/p1.json <<'EOF'
{"checked_at":"2026-10-21T00:00:00.000Z","collection":{"id":"VariableCollectionId:7:9","name":"HLR / Layout","default_mode":"7:3","modes":{"7:3":"web","7:20":"social","7:21":"email"}},"root":{"id":"100:1","name":"M01 Hero","type":"COMPONENT","explicit":"7:21","resolved":"7:21"},"overrides":[],"nodes":[{"id":"100:2","slot":"M01.headline","mode":"7:21","segs":[{"size":80,"var":"font/size/headline","via":"style"}]},{"id":"100:9","slot":"E01.label","mode":"7:3","segs":[{"size":12,"var":"font/size/label","via":"style"}]}],"next":null,"total":2}
EOF
cat > $S/p2.json <<'EOF'
{"checked_at":"2026-10-21T00:00:00.000Z","collection":{"id":"VariableCollectionId:7:9","name":"HLR / Layout","default_mode":"7:3","modes":{"7:3":"web","7:20":"social","7:21":"email"}},"root":{"id":"200:1","name":"E01 CTA","type":"COMPONENT","explicit":null,"resolved":"7:3"},"overrides":[{"id":"200:2","name":"Label row","type":"FRAME","explicit":"7:3"}],"nodes":[{"id":"200:3","slot":"E01.label","mode":"7:3","segs":[{"size":12,"var":"font/size/label","via":"style"}]}],"next":null,"total":1}
EOF
node $E/skills/asset-production/scripts/canvas_check.js --pack $S/pk --inventory $S/p1.json --canvas email; echo exit=$?
node $E/skills/asset-production/scripts/canvas_check.js --pack $S/pk --inventory $S/p2.json --element; echo exit=$?
```

Output: p1 `2 text node(s) of 2, a master on canvas email: 2 sized on their canvas, 0 finding(s), 0 warning(s).` exit 0 (the label renders 12 px where email's label is 35); p2 one `WARN element-sets-canvas`, exit 0.

P-R1-03 (no stroke weight rule or check in asset-production; the plan expects one):

```
grep -n -i stroke $E/skills/asset-production/SKILL.md $E/skills/asset-production/references/figma-recipes.md $E/skills/asset-production/references/agent-package.md $E/skills/asset-production/scripts/canvas_check.js
python3 -I -c "import json,sys; p=json.load(open(sys.argv[1])); C=[c for c in p['collections'] if c['key']=='component'][0]; print([(v['name'], v.get('aliasOf'), v.get('canvas_values')) for v in C['variables'] if v['name'].endswith('weight')])" $S/plan.json
```

Output: one grep hit, figma-recipes.md:173; then `component/cta/weight` aliasing `stroke/cta` with `{'web': 1, 'social': 2, 'email': 2}`. The canvas inventory (figma-recipes.md:228) records text sizes only.

P-R1-04 (the note says the skills stop; preflight runs):

```
rm -rf $S/eng && mkdir -p $S/eng && unzip -q /home/claude/w/review/plugins/hlr-studio-engine-0.5.3.plugin -d $S/eng
PYTHONDONTWRITEBYTECODE=1 python3 -I -B $S/eng/skills/email-copy/scripts/preflight.py --pack $S/pack > $S/preflight.txt 2>&1; echo rc=$?; grep -m1 'resolved:' $S/preflight.txt
sed -n 7p $S/eng/BUNDLE.md
grep -n "brand-context.md: the pack's own" /home/claude/w/review/checks/mac-battery-rc2.log
```

Output: rc 0, `resolved: 5 blocking: 0 degraded: 10`; the note's line 7 says brand-context.md is not in the folder; the battery log's line 30 says the pack carries lane E's.

## What I reran, and what only the author ran

- Reran, matching the author: tests, `FILES 28 PASSED 753 FAILED 0 NONZERO_EXIT 0` on fresh unzips of both plugins, line for line as checks/tests-hlr.txt; descriptions, 11 skills all under 1024, longest 981 (asset-production); the spec scan, paid verified 2026-07-27 with 3 sources and 0 far, organic 2026-10-17 with 9 sources and the six grid-crop far numbers, both spec files unchanged from 0.5.2; check, export and figma-plan on the pack copy, all exit 0, check's output identical to checks/pack-check.txt, the plan identical to checks/pack-figma-variable-plan.json but for the figma_config path (Primitives 17, Semantic 10, Component 16, Layout 45 over web, social and email, 15 text styles, not planned 14); 0 added lines in the diff carry U+2014; both shipped sha256 match close-status; the unzipped bundle equals engine-0.5.3 and differs from studio-engine only in plugin.json, brands/registry.yaml (hlr only) and BUNDLE.md; 0 runtime files in either plugin.
- Regression run: 0.5.2's test files against the 0.5.3 code: 740 passed, 1 failed, TB8, the intended rename of modes-outside-semantic to modes-misplaced; no other 0.5.2 test changed.
- Resolution in the cloud: nonesuch rc 2, no traceback; hlr and HighLight rc 1 here, since the registered pack path is the Mac's, no traceback.
- Only the author ran: the Mac test run; the census (its term list is built from the other brand folders on the Mac); both overlap scans; the rebuild (build_bundle.py is not in the review folder, so I checked the shipped sha256 only); resolution at rc 0 on the registered path. The live-pack rerun has not run anywhere yet (close-status: before the final build).
- Not re-read: the judge's brief and the generation contracts (verify, squad-run, the copy skills); the diff does not touch them.

## PASS, with what each read

- Item 1, PASS: read tokens_build.js:216-256 and :954-980, token-model.md "Canvas modes (0.5.3)", tests C1 and C2, and the pack reruns: the root's layout list is accepted by all three commands, web the default, and the plan's figma_modes on HLR / Layout is rename default (7:3) to web, create social and email (the record step: R1-10).
- Item 2, PASS: read tokens_build.js:258-362 and tests C3 to C5: a missing, undeclared or default-named canvas is a finding in check, export and the plan; a Layout token without modes is held (space/4 holds 16 on social and email); every font.size and stroke token states its canvases (the alias reading: R1-09).
- Item 3, PASS for the plan: read tokens_build.js:538 and :747-759 and test C6: stroke is scoped STROKE_FLOAT, stroke/cta plans web 1, social 2, email 2, and component/cta/weight aliases it in one mode with its canvas_values (the build side: R1-03).
- Item 4, PASS: read tokens_build.js:437-523 and test C7: my export of the pack writes the web sizes (12 to 79 px) and stroke 1px into tokens.css and Tailwind, no social or email value, and tokens.flat.json keeps the 10 canvas-varying tokens under canvas (Tailwind and strokes: R1-09).
- Item 5, PASS: read tokens_build.js:810-935 and test C8: the plan's 15 styles bind fontSize to font/size/<step> with font_size_by_canvas, leading and tracking in percent, case set; a px leading or tracking on a moded size is a finding (the switch across canvases: R1-01).
- Item 6, partly: read asset-production SKILL.md:22, :27 and :32, agent-package.md:23 and :49, asset-types.md:11, the recipe at figma-recipes.md:171-256, canvas_check.js in full and test_canvas_check.js: the canvas on every master's root and elements on Auto are stated on every path, and canvas_check and the recipe agree on the inventory (K11 runs the markdown); open: R1-02, R1-03, R1-05.
- Docs against code: README, token-model.md, pack-contract.md, slot-contract.md and both SKILL.md files say what the code does, but for BUNDLE.md:7 (R1-04) and the recipe's either-answer claim (R1-02).
- Standing rules for this work: no Figma call by the author (close-status) or by me; no em dash added; the added lines carry only fictional fixture names (the census is the author's); the release's defaults are listed for Eddie, with R1-09's gaps.

## One write of mine outside scratch, disclosed

A first run of the email preflight from engine-0.5.3/ rewrote two Python bytecode caches already there from an earlier cloud run: engine-0.5.3/lib/__pycache__/pack.cpython-313.pyc and registry.cpython-313.pyc (8429 to 8436 bytes, 14299 to 14306). They are in neither .plugin (0 runtime files; both sha256 unchanged). P-R1-04 above runs from a scratch unzip with bytecode off.

## Status after the author's fixes (lane H, rc3)

- R1-01: fixed, verified by C12 (test_tokens_build.js), FC13 (test_face_check.js) and P-R1-01 rerun (font_switch: 8 variables, modes web, social and email, 24 values). `font_switch` names every canvas mode per variable, counts the values and says a variable switched in some modes leaves the other canvases in the stand-in; the build's leave-it rule reads every mode and reports a partly switched variable (design-system SKILL.md step 4, token-model.md "Build stand-ins"); face_check's way forward says to switch in every mode when the pack's tokens declare canvases. The count in DECISIONS (eight variables) goes to Eddie at close as 8 variables, 24 values.
- R1-02: fixed, verified by K12, K6 and P-R1-02 rerun (p1 exit 1, node-off-canvas on the label; p2 exit 1, element-overrides-canvas). Every node's resolved mode is compared with the frame's canvas, sizes are read on the master's canvas, and any pin inside an element is a finding; the recipe's either-answer paragraph now says how each reading is caught.
- R1-03: fixed, verified by K13 and K11 (the recipe on a mock file with a CTA stroke bound to the component weight). The binding rule names stroke weights (SKILL.md hard rule and step 5, the recipe, the agent package); the inventory lists stroked layers with each side's weight and binding, and canvas_check finds stroke-unbound, stroke-off-canvas, stroke-not-a-weight-variable and stroke-unknown-variable.
- R1-04: fixed, verified at rc3 by check 7 (rebuild to the shipped sha256) and a reading of BUNDLE.md against the pack: the pack-state line names lane E's brand-context.md and Gate 2 open.
- R1-05: fixed (note), verified by ST10: a module entry may carry `canvas` (exportSlotMapEntry writes it), and C5c warns when measured_at names another; slot-contract.md gives an element's form.
- R1-06: fixed (note), verified by K14 and K16: a variant set takes its canvas on every variant (recipe, SKILL.md, agent package), the inventory lists variants, and a variant on Auto or on another canvas is a finding.
- R1-07: fixed (note), verified by K15: a master the roster names none skips the check (SKILL.md steps 5 and 6, the recipe); --canvas none exits 2 and says why.
- R1-08: fixed (note), verified by K17: the first page counts collection, root, overrides and variants toward its budget and stops when they alone pass it.
- R1-09: (a) and (b) listed as engine defaults in BUNDLE.md and the release report, for Eddie; (c) fixed, Tailwind carries stroke weights as borderWidth (C7); (d) fixed, BUNDLE.md's defaults list is complete.
- R1-10: fixed (note), verified by C2: figma_modes carries record_as, and the MODES TO BUILD line names the figma.yaml block after the build, the key rename included (design-system SKILL.md step 4).
- R1-11: at the lane's close: the DECISIONS line for Eddie's ruling and the PROGRESSION line marked superseded.
