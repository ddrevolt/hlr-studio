Read and ran (round 3, fresh context, 2026-10-21): read REVIEW.md in full, PROGRESSION.md, the 2026-10-20 and 2026-10-18 entries of DECISIONS.md and LEARNINGS.md, token-proposal.md sections 4 to 7 (section 7 the spec), bundle-report-0.5.2.md sections 5 to 8, close-status.md, review-engine-0.5.3-r1.md and review-engine-0.5.3-r2.md, BUNDLE.md, previous-rc3/diff-rc3-rc4.patch in full, diff-0.5.2-0.5.3.patch (its file list and the hunks of tokens_build.js, face_check.js, slot_lint.js, lib/pack.js, token-model.md, pack-contract.md, both SKILL.md files, agent-package.md, asset-types.md, slot-contract.md and the evals), and in the shipped bundle canvas_check.js in full, both SKILL.md files in full, agent-package.md, the figma-recipes.md prelude, "A master on its canvas", the structure linter, the flex probe and the slot map export, slot_lint.js from its config read to C4, lib/pack.js's canvas helpers, the slot-contract.md head and its canvas lines, README's 0.5.3 paragraph and plugin.json; the checks/ folder (both scripts, the rc4 cloud outputs, the rc3 Mac log); and in the pack copy tokens.json (its stroke, weight and component tokens), figma.yaml, asset-types.md, the head of slotmap-social.yaml and slotmap-paid.yaml's modules, and brand-context.md's lines on prefixes and tokens. Ran in the cloud (node v22.22.0, Python 3.13.16, bytecode off, every run from scratch unzips under /tmp/claude-0/): run_tests.sh on fresh unzips of both plugins; 0.5.2's test files against the 0.5.3 code; a description length check of my own (desc_check.py is not in the review folder); REVIEW's spec scan; REVIEW's resolution loop; check, export and figma-plan on a copy of pack/ and on a copy with the layout mode ids recorded; REVIEW's rule 4 provenance scan on the copy; the email preflight on the copy; a self-consistency script over the plan; the em dash grep over both diffs' added lines and BUNDLE.md; my own diff of 0.5.2 against the unzipped studio-engine compared with the shipped patch; sha256 of both plugins; round 1's probes P-R1-01 to P-R1-04 and its R1-05 probe and round 2's P-R2-01, p3d, p-section and R1-05 rerun, adapted to review3; and probes of my own (the canvas inventory recipe read out of figma-recipes.md and run on mock files of the Plugin API surface it touches, canvas_check.js, slot_lint.js and face_check.js). No Figma call, no remote-devices tool.

# Review: studio-engine 0.5.3 and hlr-studio-engine 0.5.3 (build rc4), round 3

Fresh-context reviewer: I did not write the work or rounds 1 and 2, and I did not read the author's transcript. Counts, new this round: 1 blocker, 0 should-fix, 5 notes, and two observations that touch 0.5.4 items (below the findings, not counted). Round 1: every finding confirmed fixed by its rerun but R1-09 (a) and (b) (defaults waiting for Eddie) and R1-11 (the lane's close); R1-05, refuted in round 2, is now fixed. Round 2: six of seven confirmed fixed; R2-02 refuted in part and still open as a note (R3x-02). Out of scope and not reported: R3-01, R3-02, R3-03 to R3-07, REVIEW's R5 and R6 guards, lane D's engine gaps. Every probe and scratch output sits under /tmp/claude-0/ (r3rev, and r3-probe for the probe block below); the only file I wrote here is this one, and no Python ran from engine-0.5.3/ (its two bytecode files keep their size and mtime).

The one blocker closes on the author's rerun, not by patching: it is the Mac battery, which has not run on rc4. It needs no approach question for Eddie unless a check in it fails or the final build is not rc4. No should-fix is open after this round.

## Findings, most severe first

R3x-01 blocker | close-status.md:52 (the last Mac run is checks/mac-battery-rc3.log, on rc3) | Failure: rc4 changed 13 files after the last Mac battery (BUNDLE.md, README.md and 11 skill files: previous-rc3/diff-rc3-rc4.patch), and the battery has not run on rc4 -> REVIEW section 3's check 2 (census), checks 3 and 4 (both overlap scans), check 7 (both plugins rebuilt to the shipped sha256), check 8 at rc 0 on the registered path and the Mac half of check 1 have run on no build that would ship, nor has the live-pack rerun that BUNDLE.md:7's "exit 0 on the pack" rests on; the last Mac log names rc3's plugins (5eb1e2be..., 0d3d8e75...), not rc4's (99bee31d..., 70e05b24...), so a census hit, a new overlap hit or a bundle that does not rebuild from the engine would ship unseen; REVIEW section 5: a required check nobody ran is a blocker | Owner: lane H (battery.sh base, runs, quotes, compare and live, in the Mac's Cowork shell, on the final build) | Check: the battery's log on the final build, showing what "What the Mac battery must show" lists below; probe P-R3x-01 | Status: open

R3x-02 note | skills/asset-production/references/figma-recipes.md:241 (also :53; skills/asset-production/references/agent-package.md:34; skills/asset-production/SKILL.md:22; BUNDLE.md:9 and :12) | Failure: Step 4 builds HLR's labelled grey placeholder as the element its roster lists (brand-pack/asset-types.md:56; an element is named `E## <Name>` by the frame grammar, the grey box its own root) with the recipe's placeholder(), whose label is a typed 14 px, or the native agent follows the package's "Placeholder rectangle" with its label beside it -> the recipe marks a label as a placeholder's only when an ancestor below the root has a name starting "Image Placeholder", so canvas_check exits 1 (size-unbound) on that label in every master holding the element (probe ph1), on the element itself (ph1c) and on the agent-built placeholder (ph-agent), where BUNDLE.md:9 and :12 say a placeholder's typed label only warns; only placeholder()'s own nested shape warns (ph1b, K19); this is R2-02's failure on the element path R2-02 named, now seen on two shapes, so REVIEW section 5 step 5 may apply | Owner: lane H | Check: mark the label by its own name (IMAGE or ILLUSTRATION, the names the flex probe and fillableTexts already skip), or have placeholder() and the package's line set the library's label style; a K test through the recipe on an E## placeholder element and on the package's rectangle | Status: open

R3x-03 note | skills/asset-production/scripts/canvas_check.js:193 (also skills/asset-production/references/figma-recipes.md:231 and :288) | Failure: a frame whose first page cannot hold its overrides (the stop trips once the overrides fill about 15,000 characters: some 140 to 190 nodes with an explicit layout mode, by the length of their names; probe big) is checked per section, each a child of its root, with --section -> section mode never reads the master's root or, for a set, its other variants: a web master left on Auto passes every section (sec-web, exit 0, where the whole frame is root-on-auto) and a set's variant on Auto passes as a section when the set is pinned (sec-set, exit 0, where the whole set is variant-on-auto), and nothing checks that the sections together cover the master, so BUNDLE.md:12's "every master sets its canvas explicitly, web included, and a variant set on every variant" is not enforced on that path; masters of the kind HLR's Phase 1 roster plans hold far fewer pins, so the path is out of reach today | Owner: lane H | Check: the stop returns a first page without nodes (collection, root, overrides counted, variants) that canvas_check reads beside the section pages, or --section takes the master's root id and mode; a K test of both cases | Status: open

R3x-04 note | skills/asset-production/scripts/canvas_check.js:273 | Failure: an email master's divider coloured by component/cta/stroke (#353535, the same as component/rule/stroke in the export's tokens.css, so an easy pick in the picker) on component/rule/weight -> stroke-weight-mismatch tells the builder the stroke takes component/cta/weight; following it draws the divider at 2 px on email and social and passes (probes div1 exit 1, div2 exit 0), where a rule is 1 px and the right fix is the colour (div3 exit 0); the element is read from the colour variable and the advice only ever moves the weight; needs a builder error, as R2-03 did | Owner: lane H | Check: the message names both ways out (bind that element's weight, or, when the layer is not that element, colour it with its own element's stroke variable); a K test on the divider | Status: open

R3x-05 note | skills/asset-production/scripts/slot_lint.js:209 (also :214; skills/asset-production/SKILL.md:33 and :34; BUNDLE.md:9) | Failure: the exported entry of an HLR email master (M01; email is Step 4's first module batch, PROGRESSION.md:62) or a paid master (P01) -> slot_lint exits 2 on either surface ("no module keyed W##/E##", "no module keyed S##"), since it reads only the `module` (W for HLR), `element` and `social` prefixes and HLR's figma.yaml puts email on M and paid on P (brand-pack/figma.yaml:7); so 0.5.3's measured_at canvas guard (C5c) reaches HLR's social and web entries only, and SKILL.md:34's Reachability step cannot start for email or paid, while SKILL.md:33 and BUNDLE.md:9 state the guard for every measured entry; pre-existing (0.5.2's slot_lint reads the same surfaces), not a regression, and canvas_check before measuring still guards every master | Owner: lane H, for 0.5.4 before Chat 6; Eddie if email or paid needs its own lint surface | Check: slot_lint lints the email and paid prefixes figma.yaml declares, or the docs name what checks those entries; probes m01 and p01 | Status: open

R3x-06 note | close-status.md:24 (also :46, :1 and :32) | Failure: the close status says the Mac ran 767 checks on rc3 (:24, under "In the Mac's Cowork shell on rc3", with the Mac's node v22.23.2) and that rc3's fixes ran 767 "in the cloud and on the Mac" (:46) -> the Mac log it cites shows 761 on rc3 (checks/mac-battery-rc3.log:9 and :10), round 2 reran 761 on rc3, and 767 is rc4's count, which the Mac has not run; a release report or LEARNINGS line taken from it would state a Mac result that never happened; the title still reads "(round 1)" (:1), and :32 cites checks/pack-*.txt and pack-figma-variable-plan.json, which the handover does not carry (it carries rc4-*.txt) | Owner: lane H, at the release report | Check: every count in the release report read against the final battery log | Status: open

## New failures that touch the 0.5.4 items (not findings of this release)

- R3-04's class recurs in the new canvas inventory: only the first page carries the frame's root, so page 1 of one master and a page 2 of another frame with the same total pass as one complete frame (probe two-frames: exit 0, "2 node(s) of 2"). 0.5.4's R3-04 fix should cover canvasInventory and canvas_check.js:113 as well as the face inventory.
- R3-05's class recurs: the canvas inventory's page budget counts characters (figma-recipes.md:230 and :270). A page of 107 nodes with 40-character accented names measured 14,984 characters and 16,268 bytes, under the cap; names mostly outside ASCII would pass it if the cap counts bytes. 0.5.4's R3-05 fix should cover both recipes.

## Round 1 and round 2 findings: status after the rerun on rc4

- R1-01 should-fix: confirmed fixed. P-R1-01 rerun: font_switch lists 8 variables, each with modes web, social and email, `modes` [web, social, email], `values` 24, and `how` says to switch in every mode and names a partly switched variable; C12 and FC13 pass; face_check with --pack adds "Switch it in every mode of the layout collection (web, social, email)". The DECISIONS count (eight variables) is a record item for the lane's close.
- R1-02 should-fix: confirmed fixed. P-R1-02 rerun: p1 exit 1, node-off-canvas on E01.label; p2 exit 1, element-overrides-canvas.
- R1-03 should-fix: confirmed fixed. P-R1-03 adapted: a typed CTA stroke exits 1 (stroke-unbound), the CTA on component/cta/weight at 2 px on email exits 0, at 1 px exits 1 (stroke-off-canvas). Changed since round 2's rerun: a CTA bound straight to stroke/cta at 2 px now exits 1 (stroke-weight-mismatch), which follows the binding rule (SKILL.md:27, the CTA outline to the component weight) and BUNDLE.md:12.
- R1-04 should-fix: confirmed fixed for the note's text: BUNDLE.md:7 says the skills resolve hlr and run on the pack; preflight on the pack copy from a scratch unzip: rc 0, resolved 5, blocking 0, degraded 10. Check 7 on rc4 has not run: R3x-01.
- R1-05 note: confirmed fixed. Round 1's probe rerun: the S03 entry measured on "canvas email" with no `canvas` warns "records no `canvas`"; with `canvas: social` it warns that it was measured on "email"; measured on social, no canvas warning; ST10 passes. Its reach: R3x-05.
- R1-06 note: confirmed fixed. K14 and K16 pass; the set frame is R2-01 (fixed). The --section path skips the variant rule: R3x-03.
- R1-07 note: confirmed fixed. --canvas none exits 2 and says a master with no text and no stroke takes no check; K15 passes.
- R1-08 note: confirmed fixed. The first page counts collection, root, overrides and variants and stops when they alone pass the budget (probe big: 200 pinned instances stop it); K17 passes.
- R1-09 note: (c) and (d) confirmed fixed (Tailwind borderWidth {cta: 1px}, web only; BUNDLE.md:12 lists the defaults); (a) and (b) are listed as 0.5.3 defaults in BUNDLE.md:12 and stay open as rulings for Eddie.
- R1-10 note: confirmed fixed. The plan's figma_modes on HLR / Layout gives `record_as` {id, web 7:3, social null, email null} and the MODES TO BUILD line names the key change; on a copy with web, social and email recorded the plan asks for nothing (idempotent); C2 passes.
- R1-11 note: still open, as the author says (the lane's close): DECISIONS.md has no line for Eddie's 2026-10-20 ruling (0.5.2 is never installed; 0.5.3 replaces it), and PROGRESSION.md:52 still reads "then installs hlr-studio-engine 0.5.2", while BUNDLE.md:3 cites the ruling.
- R2-01 should-fix: confirmed fixed. P-R2-01 rerun: clean, auto and pinned all exit 0, and the recipe lists only the two headlines; K18 passes.
- R2-02 note: refuted in part, still open (note). K19 passes for placeholder()'s shape (ph1b warns, exit 0), but HLR's placeholder element and the package's rectangle still exit 1 on the typed label: R3x-02.
- R2-03 note: confirmed fixed as its check asked. p3d with stroke_color exits 1 (stroke-weight-mismatch); the same inventory without stroke_color warns stroke-colour-unread and exits 0; K20 and K22 pass. A new edge: R3x-04.
- R2-04 note: confirmed fixed. The plan lists forward_aliases (component/cta/weight to stroke/cta, the only one, matching my own count over the plan), prints the ORDER line, and design-system SKILL.md:38 creates every collection and variable before any value; C13 passes.
- R2-05 note: confirmed fixed. One home and one owner: asset-production SKILL.md:32, figma-recipes.md:301 to :303 and BUNDLE.md:14 give the first build that places an element in a master the read-only read and its LEARNINGS entry the answers.
- R2-06 note: confirmed fixed as its check asked. p-section rerun: exit 1 without --section (root-on-auto), exit 0 with it; the stop names the way through; K21 passes. Section mode's own gaps: R3x-03.
- R2-07 note: confirmed fixed. agent-package.md:23 sets no layout mode inside the frame but on the variants of a set.

## What the Mac battery must show on the final build

If the final build is rc4 (hlr-studio-engine 99bee31d...04363, studio-engine 70e05b24...4fd0c), battery.sh on it must show:
- base, check 7: both rebuilt plugins match those sha256; 0 runtime files in each.
- base, check 1: `FILES 28  PASSED 767  FAILED 0  NONZERO_EXIT 0` on both unzips (node v22.23.2, Python 3.10.12).
- base, check 5: rc 0, ALL UNDER 1024, longest 981 (asset-production).
- base, check 2: the rebuilt list at 327 terms with nothing new or dropped against 0.5.2's clean list (any new term read), and `TOTAL	0`, rc 0, on both plugins and both unzipped folders; the list saved as `$RC/0.5.3/terms.txt`.
- base, check 6: paid verified 2026-07-27, 3 sources, 0 far; organic 2026-10-17, 9 sources, the six grid-crop far numbers.
- base, check 8: hlr, HighLight and the brand home folder rc 0, pack 1 or more, traceback 0; nonesuch rc 2, pack 0, traceback 0.
- base, em dash: 0 added lines with U+2014 against 0.5.2 (65 files carrying it, as before).
- runs, quotes and compare, checks 3 and 4: every file and span pair and every quoted string missing from 0.5.2's saved lists read and classed (rc3 had 7 and 9, each coincidental or engine-origin), the new ones from rc4's added prose and tests among them, no brand content; runs.txt, ngram-all.jsonl and quotes.txt saved under `$RC/0.5.3/`.
- live: check, export and figma-plan exit 0 on the live brand-pack with every output in scratch: the CANVAS MODES line, Primitives 17, Semantic 10, Component 16, Layout 45, 15 text styles, not planned 14, the ORDER line and the 24-value STAND-INS line; tokens.json and figma.yaml at the sha256 of the copy reviewed here (09b23b04..., 7f3b17f3...), or the reads above rerun on the live files.
If the final build is not rc4, the files changed since rc4 have had no review round, and REVIEW section 5 step 4 puts that to Eddie.

## Probes

Set up once (scratch only):

```
S=/tmp/claude-0/r3-probe; rm -rf $S && mkdir -p $S/w && cd $S/w
unzip -q /home/claude/w/review3/plugins/hlr-studio-engine-0.5.3.plugin -d $S/eng
cp -R /home/claude/w/review3/pack $S/pk && chmod -R u+w $S/pk
sed -i 's#  layout: { id: "VariableCollectionId:7:9", default: "7:3" }#  layout: { id: "VariableCollectionId:7:9", web: "7:3", social: "7:20", email: "7:21" }#' $S/pk/figma.yaml
node $S/eng/skills/design-system/scripts/tokens_build.js figma-plan --pack $S/pk --out $S/pk/figma-variable-plan.json > /dev/null
E=$S/eng; CC=$E/skills/asset-production/scripts/canvas_check.js
cat > $S/w/mock.js <<'EOF'
// Runs the canvas inventory recipe read out of figma-recipes.md ("A master on its canvas") on a mock file built from a
// JSON spec and writes the page it returns. argv: engine root, spec.json, out.json.
// Spec: {coll: {id, default, modes: {id: name}}, vars: {id: name}, styles: {id: sizeVarId}, frame?, root: node}
// node: {id, type, name, explicit?, strokes?: [{colorVar?}], weight?, weightVar?, size?, sizeVar?, style?, slot?, chars?, children?}
// A node resolves to its own explicit mode, else its nearest ancestor's, else the collection default.
const fs = require('fs'), [ENG, SPEC, OUT] = process.argv.slice(2);
const md = fs.readFileSync(ENG + '/skills/asset-production/references/figma-recipes.md', 'utf8');
const sec = md.slice(md.indexOf('## A master on its canvas'), md.indexOf('## Pattern builders'));
const block = sec.match(/```js\n([\s\S]*?)```/g).map(b => b.slice(6, -3)).find(b => /async function canvasInventory/.test(b));
const spec = JSON.parse(fs.readFileSync(SPEC, 'utf8')), C = spec.coll.id, mixed = Symbol('mixed'), all = [];
const coll = { id: C, name: 'HLR / Layout', defaultModeId: spec.coll.default, modes: Object.entries(spec.coll.modes).map(([modeId, name]) => ({ modeId, name })) };
function build(s, parent) {
  const n = { id: s.id, type: s.type, name: s.name || s.id, parent, explicitVariableModes: s.explicit ? { [C]: s.explicit } : {}, children: [] };
  n.resolvedVariableModes = { [C]: s.explicit || (parent ? parent.resolvedVariableModes[C] : null) || spec.coll.default };
  if (s.type === 'TEXT') {
    n.characters = s.chars || 'Copy'; n.fontSize = s.size; n.textStyleId = s.style || ''; n.strokes = []; n.strokeWeight = 0;
    n.getStyledTextSegments = () => [{ fontSize: s.size, boundVariables: s.sizeVar ? { fontSize: { id: s.sizeVar } } : {}, textStyleId: s.style || '' }];
    n.getSharedPluginData = () => s.slot || '';
  } else {
    n.strokes = (s.strokes || []).map(p => Object.assign({ type: 'SOLID', visible: true }, p.colorVar ? { boundVariables: { color: { id: p.colorVar } } } : {}));
    n.strokeWeight = n.strokes.length ? (s.weight === undefined ? 1 : s.weight) : 0;
    n.boundVariables = s.weightVar ? { strokeWeight: { id: s.weightVar } } : {};
  }
  all.push(n);
  for (const c of s.children || []) n.children.push(build(c, n));
  return n;
}
const root = build(spec.root, null);
const desc = r => { const out = []; const walk = x => { for (const c of x.children) { out.push(c); walk(c); } }; walk(r); return out; };
for (const n of all) { n.findAllWithCriteria = q => desc(n).filter(x => q.types.includes(x.type)); n.findAll = p => desc(n).filter(p); }
const figma = { mixed, variables: { getVariableCollectionByIdAsync: async id => (id === C ? coll : null), getVariableByIdAsync: async id => (spec.vars[id] ? { name: spec.vars[id] } : null) },
  getStyleByIdAsync: async id => (spec.styles && spec.styles[id] ? { boundVariables: { fontSize: { id: spec.styles[id] } } } : null),
  getNodeByIdAsync: async id => all.find(n => n.id === id) || { id }, setCurrentPageAsync: async () => {} };
new (Object.getPrototypeOf(async function () {}).constructor)('figma', 'PAGE_ID', 'FRAME_ID', 'LAYOUT_COLLECTION_ID', 'NS', 'KEY', block)(figma, 'p', spec.frame || root.id, C, 'hlr', 'slot')
  .then(page => { fs.writeFileSync(OUT, JSON.stringify(page)); console.log('recipe: ' + page.nodes.map(n => n.id + (n.strokes ? '(stroke)' : '(text)') + (n.placeholder ? '[placeholder]' : '')).join(' ')); })
  .catch(e => { console.log('recipe threw: ' + e.message); process.exit(3); });
EOF
H='"coll":{"id":"VariableCollectionId:7:9","default":"7:3","modes":{"7:3":"web","7:20":"social","7:21":"email"}},"vars":{"V:label":"font/size/label","V:body":"font/size/body","V:head":"font/size/headline","V:cta":"component/cta/weight","V:ctaS":"component/cta/stroke","V:rule":"component/rule/weight","V:ruleS":"component/rule/stroke"},"styles":{"S:label":"V:label","S:body":"V:body","S:head":"V:head"}'
run() { node $S/w/mock.js $E $1.json $1.page.json > /dev/null; node $CC --pack $S/pk --inventory $1.page.json $2 | grep -E '^(FINDING|WARN)' | cut -c1-120; echo "$1: exit=${PIPESTATUS[0]}"; }
```

P-R3x-01 (the last Mac battery read rc3, not the build in hand):

```
sha256sum /home/claude/w/review3/plugins/*.plugin | cut -c1-16
grep '  shipped/' /home/claude/w/review3/checks/mac-battery-rc3.log | cut -c1-16
grep -c '^diff -ruN' /home/claude/w/review3/previous-rc3/diff-rc3-rc4.patch
```

Output: rc4's 99bee31dbb040033 and 70e05b2457fee705; the last Mac run's 5eb1e2beb419873d and 0d3d8e753027c9e9 (rc3); 13 files changed between them.

R3x-02 (ph1: a master holding the placeholder as an E## element; ph1b: placeholder()'s own shape; ph1c: the element itself; ph-agent: the package's rectangle with its label beside it):

```
L='{"id":"10:9","type":"TEXT","name":"IMAGE","chars":"IMAGE","size":14}'; HL='{"id":"10:2","type":"TEXT","name":"Headline","size":80,"style":"S:head","slot":"M02.headline"}'
echo '{'"$H"',"root":{"id":"10:1","type":"COMPONENT","name":"M02 Spotlight","explicit":"7:21","children":['"$HL"',{"id":"10:5","type":"INSTANCE","name":"E18 Image placeholder","children":['"$L"']}]}}' > ph1.json
echo '{'"$H"',"root":{"id":"10:1","type":"COMPONENT","name":"M02 Spotlight","explicit":"7:21","children":['"$HL"',{"id":"10:5","type":"FRAME","name":"Image Placeholder","children":['"$L"']}]}}' > ph1b.json
echo '{'"$H"',"root":{"id":"20:1","type":"COMPONENT","name":"Image Placeholder","children":['"$L"']}}' > ph1c.json
echo '{'"$H"',"root":{"id":"11:1","type":"COMPONENT","name":"M03 Image","explicit":"7:21","children":['"$HL"',{"id":"11:3","type":"FRAME","name":"Image well","children":[{"id":"11:4","type":"RECTANGLE","name":"Image Placeholder"},'"$L"']}]}}' > ph-agent.json
run ph1 '--canvas email'; run ph1b '--canvas email'; run ph1c --element; run ph-agent '--canvas email'
```

Output: ph1 exit 1 (FINDING size-unbound on 10:9); ph1b exit 0 (WARN size-unbound); ph1c exit 1 (FINDING); ph-agent exit 1 (FINDING).

R3x-03 (big: where the stop trips; sec-web: a section of a web master on Auto, and whole-web the same master as one frame; sec-set: a pinned set's variant on Auto as a section, and whole-set as one set):

```
python3 -I -c "import json; print(json.dumps({'coll':{'id':'VariableCollectionId:7:9','default':'7:3','modes':{'7:3':'web','7:20':'social','7:21':'email'}},'vars':{},'styles':{},'root':{'id':'80:0','type':'FRAME','name':'T01 Editorial','explicit':'7:21','children':[{'id':'80:%d'%i,'type':'INSTANCE','name':'M%02d Module instance'%(i%100),'explicit':'7:21'} for i in range(200)]}}))" > big.json
node $S/w/mock.js $E big.json big.page.json | cut -c1-90
W1='{"id":"30:1","type":"COMPONENT","name":"W01 PDP","children":[{"id":"30:2","type":"FRAME","name":"Buy box","children":[{"id":"30:3","type":"TEXT","name":"Title","size":25,"style":"S:head","slot":"W01.title"}]}]}'
echo '{'"$H"',"frame":"30:2","root":'"$W1"'}' > sec-web.json; echo '{'"$H"',"root":'"$W1"'}' > whole-web.json
S4='{"id":"40:1","type":"COMPONENT_SET","name":"S04 Story set","explicit":"7:20","children":[{"id":"40:2","type":"COMPONENT","name":"Structure=Text","explicit":"7:20","children":[{"id":"40:4","type":"TEXT","name":"Line","size":72,"style":"S:head","slot":"S04.text.line"}]},{"id":"40:3","type":"COMPONENT","name":"Structure=Inset","children":[{"id":"40:5","type":"TEXT","name":"Line","size":72,"style":"S:head","slot":"S04.inset.line"}]}]}'
echo '{'"$H"',"frame":"40:3","root":'"$S4"'}' > sec-set.json; echo '{'"$H"',"root":'"$S4"'}' > whole-set.json
run sec-web '--canvas web --section'; run whole-web '--canvas web'; run sec-set '--canvas social --section'; run whole-set '--canvas social'
```

Output: big, the recipe throws "200 nodes under this frame set an explicit layout mode, too many for one page"; sec-web exit 0; whole-web exit 1 (root-on-auto); sec-set exit 0; whole-set exit 1 (variant-on-auto on 40:3).

R3x-04 (div1: a divider on the CTA colour and the rule weight; div2: after following the message; div3: the colour fixed instead):

```
div() { echo '{'"$H"',"root":{"id":"12:1","type":"COMPONENT","name":"M06 Text block","explicit":"7:21","children":[{"id":"12:2","type":"TEXT","name":"Headline","size":80,"style":"S:head","slot":"M06.headline"},{"id":"12:3","type":"FRAME","name":"Divider","strokes":[{"colorVar":"'$1'"}],"weight":'$2',"weightVar":"'$3'"}]}}' > $4.json; }
div V:ctaS 1 V:rule div1; div V:ctaS 2 V:cta div2; div V:ruleS 1 V:rule div3
run div1 '--canvas email'; run div2 '--canvas email'; run div3 '--canvas email'
```

Output: div1 exit 1 (stroke-weight-mismatch: "takes that element's weight, component/cta/weight"); div2 exit 0 (the divider at 2 px on email); div3 exit 0.

R3x-05 (an email and a paid entry through slot_lint):

```
python3 -I -c "import json; json.dump({'M01':{'name':'Hero','family':'email','use_when':'x','status':'built','node_id':'9301:1','measured_at':'2026-10-21 · 1200 · canvas email','canvas':'email','breakpoints':['1200'],'slots':[{'id':'M01.headline','role':'headline','case':'sentence','typical_chars':30,'flex_verified':{'1200':'>=2x'}}]}}, open('m01.json','w')); json.dump({'P01':{'name':'Product hero','family':'paid','status':'built','node_id':'9401:1','measured_at':'2026-10-21 · 1080x1350 · canvas social','canvas':'social','slots':[{'id':'P01.hook','role':'hook','case':'sentence','max_chars':30}]}}, open('p01.json','w'))"
for t in m01 p01; do for s in web social; do node $E/skills/asset-production/scripts/slot_lint.js --template $t.json --pack $S/pk --surface $s > $t-$s.out 2>&1; echo "$t --surface $s rc=$? $(grep -m1 -o 'contains no module keyed [^ ]*' $t-$s.out)"; done; done
```

Output: rc 2 for all four ("contains no module keyed W##/E##" on web, "S##" on social).

Two-frames (the R3-04 class in canvas_check):

```
CO='{"id":"VariableCollectionId:7:9","name":"HLR / Layout","default_mode":"7:3","modes":{"7:3":"web","7:20":"social","7:21":"email"}}'
echo '{"collection":'"$CO"',"root":{"id":"500:1","name":"M04 Quote","type":"COMPONENT","explicit":"7:21","resolved":"7:21"},"overrides":[],"nodes":[{"id":"500:2","slot":"M04.quote","mode":"7:21","segs":[{"size":80,"var":"font/size/headline","via":"style"}]}],"next":1,"total":2}' > a-p1.json
echo '{"nodes":[{"id":"600:3","slot":"M05.body","mode":"7:21","segs":[{"size":45,"var":"font/size/body","via":"style"}]}],"next":null,"total":2}' > b-p2.json
node $CC --pack $S/pk --inventory a-p1.json --inventory b-p2.json --canvas email | tail -1; echo "exit=${PIPESTATUS[0]}"
```

Output: "2 node(s) of 2 ... 0 finding(s)", exit 0.

## What I reran, and what only the author ran

- Reran, matching the author: tests, `FILES 28  PASSED 767  FAILED 0  NONZERO_EXIT 0` on fresh unzips of both plugins; descriptions, 11 skills all under 1024, longest 981 (asset-production), by a length check of my own; the spec scan, paid verified 2026-07-27 with 3 sources and 0 far, organic 2026-10-17 with 9 sources and the six grid-crop far numbers, both spec files byte-identical to 0.5.2's; check, export and figma-plan on the pack copy (tokens.json sha256 09b23b04..., figma.yaml 7f3b17f3...), all exit 0, output identical to checks/rc4-check.txt, rc4-export.txt and rc4-plan.txt but for paths (Primitives 17, Semantic 10, Component 16, Layout 45 over web, social and email, 15 text styles, not planned 14, the ORDER line and the 24-value STAND-INS line); the plan self-consistent (88 variables: every alias resolves, every layout variable states every canvas, every variable scoped and tagged, every style's face in faces_to_load, forward_aliases complete); REVIEW's rule 4 scan on the copy, 102 tokens, 0 untagged, first tags 28 documented, 23 observed, 51 derived, as export's provenance line; 0 added lines with U+2014 in either diff and 0 in BUNDLE.md (65 bundle files carry it from 0.5.1; engine text is exempt); both shipped sha256 as close-status gives them; the unzipped bundle equals engine-0.5.3/ but for that folder's lib/__pycache__ (in neither plugin) and differs from studio-engine only in plugin.json, brands/registry.yaml (hlr only) and BUNDLE.md; 0 runtime files in either plugin; my diff of 0.5.2 against the unzipped studio-engine equals the shipped patch, 21 files and 2,243 lines.
- Regression run: 0.5.2's test files against the 0.5.3 code: 751 passed (0.5.2's 729 and the 22 canvas checks), 1 failed, TB8, the intended rename of modes-outside-semantic to modes-misplaced; no other 0.5.2 test changed.
- Resolution in the cloud: nonesuch rc 2, no traceback; hlr and HighLight rc 1 here (the registered pack path is the Mac's), no traceback.
- Not rerun, because the diff does not touch them: the judge's brief and the generation contracts (verify, squad-run, the copy skills, brief-intake, options-board, customer-evidence and workflows are byte-identical to 0.5.2).
- Only the author runs, and none of it has run on rc4 (R3x-01): the Mac test run; the census (its term list is built from the brand folders on the Mac); both overlap scans; the rebuild (build_bundle.py is not in the review folder, so I checked the shipped sha256 and the bundle's three added files only); resolution at rc 0 on the registered path; the live-pack rerun. No Figma check exists for the canvas recipe: it has not run against a file (BUNDLE.md:14).

## PASS, with what each read

- Item 1, PASS: read tokens_build.js's mode declaration and figma_modes code and ran the three commands on the pack copy: the root's layout list is accepted, web the default; the plan renames default (7:3) to web, creates social and email and gives `record_as`; with the three ids recorded it asks for nothing.
- Item 2, PASS: read the canvas value code and canvas-mode-required, and the plan: every layout variable states every canvas, space and radius carry `held` on social and email, and every font.size and stroke token states its canvases (through an alias: the R1-09 (a) default); C3 to C5 pass.
- Item 3, PASS: stroke/cta is scoped STROKE_FLOAT with web 1, social 2, email 2; component/cta/weight aliases it in one mode with its canvas_values; forward_aliases lists that alias and design-system SKILL.md:38 builds every variable before any value; canvas_check reads the weight on the master's canvas (R1-03 rerun), with R3x-04 at the edge.
- Item 4, PASS: my export writes tokens.css and Tailwind at the web values (12 to 79 px, the strokes at 1px, Tailwind borderWidth {cta: 1px}), no social or email value, and tokens.flat.json keeps the 10 canvas-varying tokens under `canvas`.
- Item 5, PASS: the plan's 15 styles bind fontSize to font/size/<step> with font_size_by_canvas, leading and tracking in percent, case set, every face loaded first; C8 passes.
- Item 6, PASS but for R3x-02 to R3x-05: read canvas_check.js in full, the canvas recipe, its K tests, asset-production SKILL.md steps 3, 5 and 6 and the hard rules, agent-package.md and slot_lint.js C5c, and ran the recipe on mocks: every master sets its canvas on its root (a set on every variant), elements stay on Auto, sizes and strokes are checked on the master's canvas before the flex probe, the set frame is skipped, and measured_at and the entry's `canvas` are linted for social and web entries.
- Docs against code: BUNDLE.md lines 3 to 19, README's 0.5.3 paragraph, token-model.md "Canvas modes (0.5.3)" and "Build stand-ins", both SKILL.md files, slot-contract.md:136 to :142 and agent-package.md say what the code does, but for the placeholder lines (R3x-02), the --section line and default (R3x-03) and slot_lint's reach (R3x-05).
- Standing rules for this work: no Figma call by the author (close-status) or by me; no em dash added; the added lines carry only fictional fixture names and platform names by my read of their capitalized words (the census is the author's, R3x-01); the release's defaults are listed in BUNDLE.md:12 for Eddie.

## Status after the author's close (lane H, rc4)

No file changed after rc4; rc4 ships.
- R3x-01 blocker: fixed, verified by the Mac battery on rc4 (`_tools/release-checks/0.5.3/rc4/out/`): both rebuilt to the shipped sha256 with 0 runtime files; 28 files, 767 checks, 0 failed on both plugins (Node v22.23.2, Python 3.10.12); descriptions rc 0, longest 981; census 327 terms, TOTAL 0 on both plugins and both folders; the spec scan as 0.5.2's; resolution rc 0 for hlr, HighLight and the brand home, rc 2 for nonesuch, no traceback; 0 added em dashes; runs 1,089 with 7 new and quotes 741 with 9 new, identical to rc3's, each classed, no brand content; the live pack's check, export and figma-plan exit 0 with the forecast counts, the ORDER line and the 24-value STAND-INS line, tokens.json and figma.yaml unchanged (sha256 09b23b04 and 7f3b17f3).
- R3x-02 note: open, lane H, 0.5.4. R2-02's second sighting: its guard (the label marked by its own name, K tests through the recipe on an `E##` placeholder element and on the package's rectangle) goes to Eddie under REVIEW section 5 step 5 (bundle-report-0.5.3.md section 7, item 3), since a change after round 3 ships with no review round.
- R3x-03 note: open, lane H, 0.5.4.
- R3x-04 note: open, lane H, 0.5.4.
- R3x-05 note: open, lane H, 0.5.4 (bundle-report-0.5.3.md section 7, item 2).
- R3x-06 note: fixed in bundle-report-0.5.3.md, every count read against the final battery log; close-status.md was the review packet's and does not ship.
- R1-11: closed at this close (DECISIONS 2026-10-20; PROGRESSION's 0.5.2 install line marked superseded).
- R1-09 (a) and (b): defaults for Eddie (bundle-report-0.5.3.md section 6, items 1 and 2).
- The R3-04 and R3-05 classes in the canvas inventory: in the 0.5.4 prompt beside the face inventory's (section 7, item 3).
