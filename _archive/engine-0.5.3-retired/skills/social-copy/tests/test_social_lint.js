#!/usr/bin/env node
/* test_social_lint.js: the organic post gate. Synthetic posts for Testbrand, a fictional stationery
   brand, and a synthetic slot map; no real brand data.

   Three groups: findings it must catch, valid posts it must NOT flag (a check that over-blocks gets
   switched off), and states where a check could not run, which must never read as clean.

   Run: node tests/test_social_lint.js */
'use strict';
const { spawnSync } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');

const LINT = path.join(__dirname, '..', 'scripts', 'social_lint.js');
const SPECS = path.join(__dirname, '..', 'references', 'organic-specs.json');
const MAP = path.join(__dirname, 'fixtures', 'slotmap_social.yaml');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'social-'));
const w = (n, o) => { const p = path.join(TMP, n); fs.writeFileSync(p, typeof o === 'string' ? o : JSON.stringify(o, null, 1)); return p; };
const uniq = () => Math.random().toString(36).slice(2);

const CTX = w('brand-context.md', '```json\n' + JSON.stringify({
  brand: 'Testbrand', prohibited_patterns: ['miracle', 'detox', 'guaranteed[- ]?results'],
}) + '\n```');
const FACTS = w('facts.json', { allowed_figures: [{ value: '20', unit: '%', source: 'offer.discount' }] });

const angles = () => ([
  { copy: 'One week, one page each day', axis: 'Benefit', why: 'shows the planner doing the job' },
  { copy: 'The first Monday of term', axis: 'Occasion', why: 'a date the reader already has' },
  { copy: 'How the spine is sewn', axis: 'Product', why: 'the making is the proof' },
]);
const covers = () => ([
  { copy: 'Lists that never make it to Friday', axis: 'Problem' },
  { copy: 'What a sewn spine changes', axis: 'Curiosity gap' },
  { copy: 'Your week, on one spread', axis: 'Direct address' },
]);
const captions = () => ([
  { copy: 'Lists on receipts go missing by Wednesday.\nLinen Notebooks keep the week in one place, sewn so the pages lie flat.\nSee the covers through the link in our profile.' },
  { copy: 'A sewn spine is why the page lies flat under your hand.\nLinen Notebooks are bound sixteen pages at a time.' },
  { copy: 'Your week deserves a spread you can see at once.\nLinen Notebooks open flat from the first page to the last.' },
]);
const sequence = () => ([
  { role: 'cover', slots: { headline: 'Lists that never make it to Friday', subline: 'A week that stays in one place' } },
  { role: 'inner', slots: { headline: 'Monday', body: 'The list goes on the left page, the plan on the right.' } },
  { role: 'inner', slots: { headline: 'Wednesday', body: 'The page is still there, and so is the list.' } },
  { role: 'inner', slots: { headline: 'Friday', body: 'Turn back and every line is where you left it.' } },
  { role: 'inner', slots: { headline: 'Sewn, not glued', body: 'Sixteen pages at a time, so the spread lies flat.' } },
  { role: 'end', slots: { headline: 'Linen Notebooks', cta: 'SEE THE COVERS' } },
]);
const carousel = () => ({
  skill: 'social-copy', format: 1, post_format: 'carousel', module: 'S03', build_mode: 'gutter', ratios: ['4x5'],
  brief: { name: 'Term start', objective: 'first orders', audience: 'students', must_say: ['Linen Notebooks'], panels: 6 },
  angle_gate: { picked_by: 'human', provisional: false, picked: 0 },
  gates: { angle: angles(), cover: covers(), caption: captions(), sequence: sequence() },
  provenance: { brand: 'Testbrand', exemplars_shown: { cover: { favorites: [], exemplars: [] } } },
  notes: [],
});
const story = () => ({
  skill: 'social-copy', format: 1, post_format: 'story_set', module: 'S04', ratios: ['9x16'],
  brief: { name: 'Studio day', objective: 'visits', frames: 3 },
  angle_gate: { picked_by: 'human', provisional: false, picked: 1 },
  gates: {
    angle: angles(), cover: covers(),
    sequence: [
      { role: 'frame', structure: 'text', slots: { headline: 'Lists that never make it to Friday' } },
      { role: 'frame', structure: 'inset', slots: { headline: 'Sewn sixteen pages at a time' } },
      { role: 'frame', structure: 'full_bleed', slots: { headline: 'The studio is open' } },
    ],
  },
  provenance: { brand: 'Testbrand', exemplars_shown: { cover: { favorites: [], exemplars: [] } } },
});

function run(slate, extra = [], opts = {}) {
  const p = w('s-' + uniq() + '.json', slate);
  const args = [LINT, '--slate', p, '--brand-context', opts.ctx || CTX, ...(opts.noFacts ? [] : ['--facts', FACTS]),
    ...(opts.noMap ? [] : ['--slotmap-social', opts.map || MAP]), ...extra];
  const r = spawnSync('node', args, { encoding: 'utf8' });
  let out; try { out = JSON.parse(r.stdout || '{}'); } catch (e) { out = { errors: ['<unparseable: ' + (r.stdout || '').slice(0, 80) + '>'] }; }
  return { code: r.status, out, stderr: String(r.stderr || ''), path: p };
}
let pass = 0, fail = 0;
const t = (name, fn) => { try { fn(); pass++; console.log('  \x1b[32mPASS\x1b[0m  ' + name); } catch (e) { fail++; console.log('  \x1b[31mFAIL\x1b[0m  ' + name + '\n        ' + e.message); } };
const errHas = (r, re) => (r.out.errors || []).some(e => re.test(e));
const warnHas = (r, re) => (r.out.warns || []).some(x => re.test(x));
const expectErr = (r, re, msg) => { if (!errHas(r, re)) throw new Error((msg || 'expected an error matching ' + re) + '; got ' + JSON.stringify(r.out.errors)); };
const expectWarn = (r, re, msg) => { if (!warnHas(r, re)) throw new Error((msg || 'expected a warning matching ' + re) + '; got ' + JSON.stringify(r.out.warns)); };

console.log('\nsocial_lint.js\n');

// ---------------------------------------------------------------- valid posts it must not flag
t('SL1 control: a well-formed carousel is PASS, with the slot check on', () => {
  const r = run(carousel());
  if (r.out.verdict !== 'PASS') throw new Error('verdict ' + r.out.verdict + ': ' + JSON.stringify([r.out.errors, r.out.warns, r.out.insufficient_input, r.out.needs_human_signoff]));
  if (r.code !== 0) throw new Error('exit ' + r.code);
  if (!/^on: 12 slot/.test(r.out.checked.slot_checking)) throw new Error('slot checking: ' + r.out.checked.slot_checking);
  if (r.out.checked.sequence !== 'cover,inner,inner,inner,inner,end') throw new Error('sequence shape: ' + r.out.checked.sequence);
});
t('SL2 control: a story set with no caption gate is PASS (stories carry no caption)', () => {
  const r = run(story());
  if (r.out.verdict !== 'PASS') throw new Error('verdict ' + r.out.verdict + ': ' + JSON.stringify([r.out.errors, r.out.warns, r.out.insufficient_input]));
  if (!/^OFF: no caption gate/.test(r.out.checked.caption_checking)) throw new Error('caption checking: ' + r.out.checked.caption_checking);
});
t('SL3 control: a feed post with no text on the image needs only the angle and the caption', () => {
  const s = { skill: 'social-copy', format: 1, post_format: 'feed_post', on_image: false, brief: { name: 'p' },
    angle_gate: { picked_by: 'human' }, gates: { angle: angles(), caption: captions() }, provenance: { brand: 'Testbrand', exemplars_shown: {} } };
  const r = run(s, [], { noMap: true });
  if (r.out.verdict !== 'PASS') throw new Error('verdict ' + r.out.verdict + ': ' + JSON.stringify([r.out.errors, r.out.warns, r.out.insufficient_input]));
});

// ---------------------------------------------------------------- claims, the same law as every channel
t('SL4 a prohibited territory in a caption, a cover option or a panel is an error', () => {
  const a = carousel(); a.gates.caption[1].copy = 'A miracle for your week.\nLinen Notebooks.';
  expectErr(run(a), /gates\.caption\[1\]: prohibited territory/);
  const b = carousel(); b.gates.cover[2].copy = 'Guaranteed results by Friday';
  expectErr(run(b), /gates\.cover\[2\]: prohibited territory/);
  const c = carousel(); c.gates.sequence[2].slots.body = 'A detox for a cluttered desk.';
  expectErr(run(c), /gates\.sequence\[2\]\.slots\.body: prohibited territory/);
});
t('SL5 an unverified figure is an error; a verified one in its own unit passes', () => {
  const a = carousel(); a.gates.sequence[5].slots.headline = 'Save 30% this week';
  expectErr(run(a), /figure "30%" not verified/);
  const b = carousel(); b.gates.sequence[5].slots.headline = 'Take 20% off this week';
  const r = run(b);
  if ((r.out.errors || []).some(e => /figure/.test(e))) throw new Error('a verified figure errored: ' + JSON.stringify(r.out.errors));
});
t('SL6 a customer\'s words cite the grounding item they came from', () => {
  const a = carousel(); a.gates.sequence[3].verbatim_source = 'G9';
  expectErr(run(a), /verbatim_source "G9" is not in the grounding pool/);
  const b = carousel(); b.gates.caption[0].quote = true;
  expectErr(run(b), /marked as a quote with no `verbatim_source`/);
  const c = carousel(); c.grounding = [{ id: 'G1', source: 'review/T-0003', kind: 'review', text: 'The pages really do lie flat.' }];
  c.gates.sequence[3].verbatim_source = 'G1';
  if (errHas(run(c), /verbatim_source/)) throw new Error('a cited quote errored');
});

// ---------------------------------------------------------------- captions
t('SL7 a caption over the platform ceiling is an error; a first line past the fold and a must-say after it warn', () => {
  const a = carousel(); a.gates.caption[0].copy = 'Linen Notebooks. ' + 'Page after page. '.repeat(140);
  expectErr(run(a), /characters against the platform's caption ceiling of 2200/);
  const b = carousel(); b.gates.caption[2].copy = 'Your week deserves a spread you can see at once, a page for every day, and a margin wide enough for everything the day adds on top of it by Sunday night.\nLinen Notebooks open flat.';
  expectWarn(run(b), /gates\.caption\[2\]: the first line runs \d+ characters/);
  const c = carousel(); c.gates.caption[1].copy = 'A sewn spine is why the page lies flat under your hand.\n' + 'It is bound sixteen pages at a time, by hand, in the studio. '.repeat(2) + 'Linen Notebooks.';
  expectWarn(run(c), /must-say "Linen Notebooks" first appears at character \d+, after the fold/);
});
t('SL8 hashtags over the agreed maximum are an error; contested, a warning', () => {
  const a = carousel(); a.gates.caption[0].copy += '\n#notebooks #paper #stationery #desk #planner #study';
  expectErr(run(a), /6 hashtags against the platform's maximum of 5 \(agreed\)/);
  const specs = JSON.parse(fs.readFileSync(SPECS, 'utf8')); specs.hashtags.confidence = 'contested';
  const r = run(a, ['--specs', w('specs-' + uniq() + '.json', specs)]);
  if (errHas(r, /hashtags/)) throw new Error('a contested ceiling errored');
  expectWarn(r, /6 hashtags against the platform's maximum of 5 \(contested\)/);
});
t('SL9 a URL or a bare domain in a caption warns (it does not click); two captions that read the same before the fold warn', () => {
  const a = carousel(); a.gates.caption[0].copy = 'Lists on receipts go missing by Wednesday.\nLinen Notebooks at www.testbrand.example/notebooks';
  expectWarn(run(a), /a URL or domain in an organic caption does not click/);
  const a2 = carousel(); a2.gates.caption[0].copy = 'Lists on receipts go missing by Wednesday.\nLinen Notebooks at testbrand.shop/notebooks today.';
  expectWarn(run(a2), /a URL or domain in an organic caption does not click/);
  const b = carousel(); b.gates.caption[2].copy = b.gates.caption[0].copy.slice(0, 125) + ', and a close of its own after the fold.';
  expectWarn(run(b), /gates\.caption\[0\] and \[2\] read the same before the fold/);
  const c = carousel(); c.gates.caption[2].copy = 'Lists on receipts go missing by Wednesday!\nA second line that says something else entirely, so the fold differs.';
  if (warnHas(run(c), /read the same before the fold/)) throw new Error('captions that differ before the fold were flagged as the same');
});

// ---------------------------------------------------------------- shape
t('SL10 a carousel opens on its cover, closes on its end, and has an inner panel between', () => {
  const a = carousel(); a.gates.sequence[0].role = 'inner';
  expectErr(run(a), /a carousel opens on its cover panel/);
  const b = carousel(); b.gates.sequence[5].role = 'inner';
  expectErr(run(b), /a carousel closes on its end panel/);
  const c = carousel(); c.gates.sequence = [c.gates.sequence[0], c.gates.sequence[5]]; c.brief.panels = 2;
  expectErr(run(c), /needs at least one inner panel/);
});
t('SL11 the panel count stays inside the platform range and matches the brief', () => {
  const a = carousel(); const inner = a.gates.sequence[1];
  a.gates.sequence = [a.gates.sequence[0], ...Array.from({ length: 19 }, () => inner), a.gates.sequence[5]]; delete a.brief.panels;
  expectErr(run(a), /21 panels against the platform's maximum of 20/);
  const b = carousel(); b.brief.panels = 7;
  expectErr(run(b), /the brief asks for 7 panels and the sequence has 6/);
});
t('SL12 the build mode is declared and is one of the two', () => {
  const a = carousel(); delete a.build_mode;
  expectWarn(run(a), /build_mode is not declared/);
  const b = carousel(); b.build_mode = 'collage';
  expectErr(run(b), /build_mode "collage" is not one of gutter, seamless/);
});
t('SL13 a story set is frames, each one structure from the set; a caption on it warns', () => {
  const a = story(); a.gates.sequence[1].structure = 'polaroid';
  expectErr(run(a), /structure "polaroid" is not one of text, inset, full_bleed, split/);
  const b = story(); delete b.gates.sequence[0].structure;
  expectErr(run(b), /gates\.sequence\[0\]: no `structure`/);
  const c = story(); c.gates.caption = captions();
  expectWarn(run(c), /a story set carries no caption/);
  const d = story(); d.brief.frames = 4;
  expectErr(run(d), /the brief asks for 4 frames and the sequence has 3/);
});
t('SL14 the first panel carries one of the cover lines (warns otherwise)', () => {
  const a = carousel(); a.gates.sequence[0].slots.headline = 'A different line altogether';
  expectWarn(run(a), /the first panel carries none of the cover gate's lines/);
});

// ---------------------------------------------------------------- gates and the route
t('SL15 a missing gate with no reason is an error; declared, or at the angle stage, it is INSUFFICIENT-INPUT', () => {
  const a = carousel(); delete a.gates.caption;
  expectErr(run(a), /requires gate `caption`/);
  const b = carousel(); delete b.gates.caption; b.gates_not_run = { caption: 'the caption goes to the brand team this week' };
  const rb = run(b);
  if (rb.out.verdict !== 'INSUFFICIENT-INPUT') throw new Error('declared: verdict ' + rb.out.verdict + ' ' + JSON.stringify(rb.out.errors));
  const c = { ...carousel(), stage: 'angle' }; c.gates = { angle: angles() }; delete c.angle_gate;
  const rc = run(c);
  if (rc.out.verdict !== 'INSUFFICIENT-INPUT' || !(rc.out.insufficient_input || []).some(x => /ANGLE stage/.test(x))) throw new Error('angle stage: ' + rc.out.verdict + ' ' + JSON.stringify(rc.out));
});
t('SL16 option counts and axes: too few is an error, repeated axes are an error, a hook out of position warns', () => {
  const a = carousel(); a.gates.cover = a.gates.cover.slice(0, 2);
  expectErr(run(a), /gates\.cover: 2 options \(need 3\)/);
  const b = carousel(); b.gates.angle[2].axis = 'Benefit';
  expectErr(run(b), /gates\.angle: 2 distinct axes across 3 options/);
  const c = carousel(); c.gates.cover[0].axis = 'Direct address'; c.gates.cover[2].axis = 'Problem';
  expectWarn(run(c), /hook is "Direct address"; the contract assigns "Problem"/);
});
t('SL17 inside a pre-selected route the angles share its axis and differ on scene; who picked is recorded', () => {
  const a = carousel(); a.brief.selected_route = { id: 'R1', axis: 'Benefit', selected_by: 'human' };
  a.gates.angle.forEach((o, i) => { o.axis = 'Benefit'; o.scene = ['the first page of a new term', 'a letter from the bindery', 'the pen tray on a Monday'][i]; });
  const ra = run(a);
  if (ra.out.verdict !== 'PASS') throw new Error('a compliant route post did not pass: ' + JSON.stringify([ra.out.errors, ra.out.warns, ra.out.needs_human_signoff]));
  const b = JSON.parse(JSON.stringify(a)); b.gates.angle[1].axis = 'Occasion';
  expectErr(run(b), /leaves the pre-selected route's frame/);
  const c = JSON.parse(JSON.stringify(a)); delete c.angle_gate;
  expectErr(run(c), /does not say who picked the angle/);
  const d = JSON.parse(JSON.stringify(a)); d.angle_gate = { picked_by: 'recommended' };
  expectErr(run(d), /provisional is not true/);
});
t('SL18 exemplars_shown missing warns; brief or provenance missing is an error', () => {
  const a = carousel(); delete a.provenance.exemplars_shown;
  expectWarn(run(a), /provenance\.exemplars_shown is missing/);
  const b = carousel(); delete b.brief;
  expectErr(run(b), /no `brief` block/);
});
t('SL19 a missing or unknown post_format is an error', () => {
  const a = carousel(); delete a.post_format;
  expectErr(run(a), /declares no `post_format`/);
  const b = carousel(); b.post_format = 'reel';
  expectErr(run(b), /post_format "reel" is not one of/);
});

// ---------------------------------------------------------------- slots: measured or named as absent
t('SL20 panel copy over its slot ceiling is an error; a slot the master does not stamp is an error', () => {
  const a = carousel(); a.gates.sequence[5].slots.cta = 'SEE EVERY COVER IN THE RANGE';
  expectErr(run(a), /28 chars against S03\.end\.cta's measured ceiling of 24/);
  const b = carousel(); b.gates.sequence[1].slots.kicker = 'Day one';
  expectErr(run(b), /"S03\.inner\.kicker" is not a stamped slot on S03/);
});
t('SL21 a slot with no measured budget is INSUFFICIENT-INPUT, and no budget is invented', () => {
  const a = story(); a.gates.sequence[2] = { role: 'frame', structure: 'split', slots: { headline: 'The studio is open', body: 'Saturday, all day.' } };
  const r = run(a);
  if (r.out.verdict !== 'INSUFFICIENT-INPUT') throw new Error('verdict ' + r.out.verdict);
  if (!(r.out.needs_human_signoff || []).some(x => /S04\.split\.body carries no measured budget \(proposed, unbuilt\)/.test(x))) throw new Error(JSON.stringify(r.out.needs_human_signoff));
});
t('SL22 an unknown module is an error and reads OFF; no module and no slot map read OFF with the reason', () => {
  const a = carousel(); a.module = 'S99';
  const ra = run(a);
  if (!errHas(ra, /no such module/) || !/^OFF/.test(ra.out.checked.slot_checking)) throw new Error(JSON.stringify([ra.out.errors, ra.out.checked.slot_checking]));
  const b = carousel(); delete b.module;
  if (!/^OFF: a social slot map resolved/.test(run(b).out.checked.slot_checking)) throw new Error('no module did not read OFF');
  if (!/^OFF: no social slot map resolved/.test(run(carousel(), [], { noMap: true }).out.checked.slot_checking)) throw new Error('no slot map did not read OFF');
});

// ---------------------------------------------------------------- runs that cannot start
t('SL23 no prohibited list is exit 2 with nothing checked', () => {
  const r = run(carousel(), [], { ctx: w('ctx-empty-' + uniq() + '.md', '```json\n' + JSON.stringify({ brand: 'Testbrand' }) + '\n```') });
  if (r.code !== 2 || r.out.verdict !== 'FAIL' || !/no prohibited-territory list/.test(r.out.errors[0])) throw new Error('exit ' + r.code + ' ' + JSON.stringify(r.out));
});
t('SL24 the report fingerprints the slate and states what it checked', () => {
  const r = run(carousel());
  const want = crypto.createHash('sha256').update(fs.readFileSync(r.path)).digest('hex');
  if (r.out.checked.slate_sha256 !== want) throw new Error('fingerprint mismatch');
  if (!/^on: ceiling 2200 \(agreed\), fold at about 125 \(approximate\), hashtags 5 \(agreed\)/.test(r.out.checked.caption_checking)) throw new Error(r.out.checked.caption_checking);
  if (r.out.checked.recipe !== 'S03' || r.out.checked.specs_verified !== '2026-10-17') throw new Error(JSON.stringify(r.out.checked));
});
t('SL25 no --facts warns that every figure is unverified', () => {
  expectWarn(run(carousel(), [], { noFacts: true }), /no --facts supplied/);
});

// ---------------------------------------------------------------- inputs it must refuse rather than misread
t('SL26 brief_figures that are not an array are an error, not a crash; allowed_figures that are not an array stop the run', () => {
  const a = carousel(); a.brief_figures = '20% off';
  const r = run(a);
  if (r.code === null || /TypeError/.test(r.stderr)) throw new Error('crashed: ' + r.stderr.slice(0, 200));
  expectErr(r, /brief_figures is a string, not an array of strings/);
  const facts = w('facts-' + uniq() + '.json', { allowed_figures: { value: '20', unit: '%' } });
  const p = w('s-' + uniq() + '.json', carousel());
  const r2 = spawnSync('node', [LINT, '--slate', p, '--brand-context', CTX, '--facts', facts, '--slotmap-social', MAP], { encoding: 'utf8' });
  if (r2.status !== 2 || !/allowed_figures` is an object, not an array/.test(r2.stdout)) throw new Error('exit ' + r2.status + ': ' + r2.stdout.slice(0, 200));
});
t('SL27 copy that is not a string is an error and is never coerced', () => {
  const a = carousel(); a.gates.cover[1].copy = { text: 'A miracle for your week' };
  expectErr(run(a), /gates\.cover\[1\]: copy is an object, not a string/);
  const b = carousel(); b.gates.sequence[2].slots.body = 30;
  expectErr(run(b), /gates\.sequence\[2\]\.slots\.body: is a number; a slot takes a string/);
  const c = carousel(); c.gates.angle[0].why = ['a list', 'of reasons'];
  expectErr(run(c), /gates\.angle\[0\]\.why: is an array, not a string/);
});
t('SL28 each declared ratio is a size the format builds', () => {
  const a = story(); a.ratios = ['4x5'];
  expectErr(run(a), /ratios: "4x5" is not a story set size \(9x16\)/);
  const b = carousel(); b.ratios = ['4x5', '9x16'];
  expectErr(run(b), /ratios: "9x16" is not a carousel size \(4x5\)/);
});
t('SL29 slot keys map through the entry\'s own panel: repeat groups keep the panel, another panel\'s id is an error, caption is the caption layer', () => {
  const a = carousel(); a.gates.sequence[1].slots = { headline: 'Monday', 'item1.body': 'The list goes on the left page.' };
  expectErr(run(a), /"S03\.inner\.item1\.body" is not a stamped slot on S03/);
  const b = carousel(); b.gates.sequence[0].slots['S03.inner.body'] = 'The list goes on the left page.';
  expectErr(run(b), /"S03\.inner\.body" belongs to another panel; this entry is "cover"/);
  const map = fs.readFileSync(MAP, 'utf8').replace('      - { id: S03.end.cta, role: cta, max_chars: 24, case: upper }',
    '      - { id: S03.end.cta, role: cta, max_chars: 24, case: upper }\n      - { id: S03.caption, role: caption, max_chars: 120, case: sentence }');
  const r = run(carousel(), [], { map: w('map-' + uniq() + '.yaml', map) });
  if (r.out.checked.caption_layer !== 'S03.caption') throw new Error('caption layer: ' + r.out.checked.caption_layer);
  expectWarn(r, /gates\.caption\[0\]: \d+ characters against the caption layer S03\.caption \(120\)/);
  if (errHas(r, /caption/)) throw new Error('a caption over its layer errored: ' + JSON.stringify(r.out.errors));
});
t('SL30 a must-say split by a line break is still found; glued hashtags each count', () => {
  const a = carousel(); a.gates.caption[1].copy = 'A sewn spine is why the page lies flat. Linen\nNotebooks are bound sixteen pages at a time.';
  if (warnHas(run(a), /must-say "Linen Notebooks"/)) throw new Error('a must-say split by a line break before the fold was not found');
  const b = carousel(); b.gates.caption[0].copy += ' #notebooks#paper#stationery #desk#planner#study';
  expectErr(run(b), /6 hashtags against the platform's maximum of 5/);
});
t('SL31 a slot map the File map names and cannot find is an error, and so is an unreadable one', () => {
  const ctx = w('ctx-' + uniq() + '.md', '```json\n' + JSON.stringify({ brand: 'Testbrand', prohibited_patterns: ['miracle'], slotmap_social: 'missing/slotmap_social.yaml' }) + '\n```');
  expectErr(run(carousel(), [], { ctx, noMap: true }), /names slotmap_social "missing\/slotmap_social\.yaml" and it does not resolve/);
  expectErr(run(carousel(), [], { map: path.join(TMP, 'nope.yaml') }), /social slot map at .*nope\.yaml is unreadable/);
});
t('SL32 a contested or approximate platform number warns where an agreed one errors', () => {
  const specs = JSON.parse(fs.readFileSync(SPECS, 'utf8')); specs.caption.confidence = 'contested'; specs.carousel.confidence = 'contested';
  const sp = w('specs-' + uniq() + '.json', specs);
  const a = carousel(); a.gates.caption[0].copy = 'Linen Notebooks. ' + 'Page after page. '.repeat(140);
  const ra = run(a, ['--specs', sp]);
  if (errHas(ra, /caption ceiling/)) throw new Error('a contested caption ceiling errored');
  expectWarn(ra, /characters against the platform's caption ceiling of 2200 \(contested\)/);
  const b = carousel(); const inner = b.gates.sequence[1];
  b.gates.sequence = [b.gates.sequence[0], ...Array.from({ length: 19 }, () => inner), b.gates.sequence[5]]; delete b.brief.panels;
  const rb = run(b, ['--specs', sp]);
  if (errHas(rb, /platform's maximum of 20/)) throw new Error('a contested carousel maximum errored');
  expectWarn(rb, /21 panels against the platform's maximum of 20 \(contested\)/);
});
t('SL33 gates, module and must_say of the wrong type are errors; panel copy on a post with no text on the image warns', () => {
  const a = carousel(); a.gates = [];
  expectErr(run(a), /gates is an array, not an object keyed by gate/);
  const b = carousel(); b.module = 3;
  expectErr(run(b), /module is a number, not a master id string/);
  const c = carousel(); c.brief.must_say = 'Linen Notebooks';
  expectErr(run(c), /brief\.must_say is a string, not an array of strings/);
  const d = { skill: 'social-copy', format: 1, post_format: 'feed_post', on_image: false, brief: { name: 'p' },
    angle_gate: { picked_by: 'human' }, gates: { angle: angles(), caption: captions(), sequence: [{ role: 'post', slots: { headline: 'A line' } }] }, provenance: { brand: 'Testbrand', exemplars_shown: {} } };
  expectWarn(run(d, [], { noMap: true }), /on_image is false, yet the slate carries panel copy/);
});

console.log('\n' + pass + ' passed, ' + fail + ' failed\n');
fs.rmSync(TMP, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
