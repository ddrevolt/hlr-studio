#!/usr/bin/env node
/* test_render_board.js: the board renders complete and incomplete routes honestly, refuses an
   invalid packet, and never ranks on its own. Run: node tests/test_render_board.js */
'use strict';
const { spawnSync } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path'), zlib = require('zlib');

const RENDER = path.join(__dirname, '..', 'scripts', 'render_board.js');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'board-'));
const w = (n, o) => { const p = path.join(TMP, n); fs.writeFileSync(p, typeof o === 'string' || Buffer.isBuffer(o) ? o : JSON.stringify(o, null, 1)); return p; };
const run = args => spawnSync('node', [RENDER, ...args], { encoding: 'utf8' });
let npass = 0, nfail = 0;
function t(name, fn) { try { fn(); npass++; console.log('  \x1b[32mPASS\x1b[0m  ' + name); } catch (e) { nfail++; console.log('  \x1b[31mFAIL\x1b[0m  ' + name + '\n        ' + e.message); } }
const assert = (c, m) => { if (!c) throw new Error(m); };

/* A valid 2x2 PNG so the "real render" path embeds a real image. */
function png() {
  const crc32 = buf => { let c, crc = 0xffffffff; for (let n = 0; n < buf.length; n++) { c = (crc ^ buf[n]) & 0xff; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crc = (crc >>> 8) ^ c; } return (crc ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, crc]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(2, 0); ihdr.writeUInt32BE(2, 4); ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.from([0, 200, 30, 30, 30, 200, 30, 0, 30, 30, 200, 200, 200, 30]);
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
const PNG = w('r1-4x5.png', png()); w('r1-1x1.png', png()); w('r1-9x16.png', png()); w('r1-1440.png', png()); w('r1-390.png', png()); w('r2-1440.png', png());

/* Pack for the palette */
const PACK = path.join(TMP, 'pack'); fs.mkdirSync(PACK);
fs.writeFileSync(path.join(PACK, 'brand-context.md'), '```json\n' + JSON.stringify({ brand: 'Testbrand', prohibited_patterns: ['detox'], onepager_palette: { accent: '#2b5f8e', route_tones: ['#2b5f8e', '#8e3b2b', '#ffffff'] } }) + '\n```\n');

const COST = { model: null, input_tokens: null, output_tokens: null, media_calls: null, measured_by: 'not measured' };
const brief = w('summer.brief.json', {
  skill: 'brief-intake', format: 1, slug: 'summer-launch', brand: 'Testbrand', objective: 'Drive first orders.', audience: 'Prospects', message: 'The notebook you will buy twice.',
  channels: [
    { surface: 'paid', type: 'problem_solution', placements: ['feed', 'reels'], grounding_ref: 'r', deliverables: [{ name: 'Static set', ratios: ['4x5', '1x1', '9x16'] }] },
    { surface: 'web', page_type: 'landing', one_thing: 'first order', deliverables: [{ name: 'Landing page', breakpoints: [1440, 390] }] },
  ],
});
const paidCopy = w('r1.paid.json', { skill: 'paid-ad-copy', gates: { concept: [{ copy: 'Lost lists' }], copy: [{ axis: 'Problem', headline: 'Every list in one place', primary_text: 'The list on the receipt went through the wash.' }, { axis: 'Curiosity gap', headline: 'Look at the spine', primary_text: 'There is a reason it opens flat.' }] } });
const pageCopy = w('r1.page.json', { skill: 'web-copy', sections: [{ id: 'W01', slots: { heading: 'Welcome to the launch', body: 'Good paper, sewn by hand.' } }] });
const lintPass = w('lint-pass.json', { verdict: 'PASS', errors: [], warns: [] });
const lintWarn = w('lint-warn.json', { verdict: 'WARN', errors: [], warns: ['x'] });
const lintFail = w('lint-fail.json', { verdict: 'FAIL', errors: ['figure not verified'] });

const deliverable = (surface, over = {}) => ({
  surface, name: surface === 'paid' ? 'Static set' : 'Landing page', type: surface === 'paid' ? 'problem_solution' : 'landing',
  copy: { path: surface === 'paid' ? 'r1.paid.json' : 'r1.page.json', skill: surface === 'paid' ? 'paid-ad-copy' : 'web-copy' },
  lint: { path: 'lint-pass.json', verdict: 'PASS' },
  renders: surface === 'paid'
    ? ['4x5', '1x1', '9x16'].map(r => ({ surface: 'paid', ratio_or_breakpoint: r, path: 'r1-' + r + '.png', rendered_by: 'figma-export', placeholder: false }))
    : [{ surface: 'web', ratio_or_breakpoint: 1440, path: 'r1-1440.png', rendered_by: 'playwright', placeholder: false }, { surface: 'web', ratio_or_breakpoint: 390, path: 'r1-390.png', rendered_by: 'playwright', placeholder: false }],
  image_plan: { scene: 'a desk by the window, morning light', pack_composite: { sku: 'SKU-1', file: 'packshots/sku-1.png' }, focal_point: 'the pack', crops: [], source: 'generated' },
  image_files: [], ...over,
});
const packet = (id, over = {}) => ({
  kind: 'route-packet', format: 1, route_id: id, frame: 'benefit', angle: 'Angle for ' + id, brief_ref: 'summer.brief.json', routes_ref: null, brand: 'Testbrand',
  worker: null,
  channel_deliverables: [deliverable('paid'), deliverable('web')],
  passed_over: [{ option: 'Lists for a long weekend', surface: 'paid', gate: 'headline', reason: 'occasion', note: 'strong, wrong moment' }],
  provenance: { brand: 'Testbrand', brand_context: path.join(PACK, 'brand-context.md'), voice: 'read', cost: COST },
  verifier: null,
  completion: { brief_type: 'paid_static', items: ['finished exports for every requested placement', "complete platform copy inside Meta's limits", 'editable source', 'safe-zone check passed'].map(i => ({ item: i, done: true, evidence: 'x' })), complete: true, verdict: 'PASS' },
  ...over,
});
const P1 = w('r1.packet.json', packet('R1'));
const incomplete = packet('R2', { frame: 'occasion' });
incomplete.channel_deliverables[1].renders = [{ surface: 'web', ratio_or_breakpoint: 1440, path: 'r2-1440.png', rendered_by: 'playwright', placeholder: false }];   // no 390
incomplete.completion.complete = true;   // the packet's claim, which the board must not take
const P2 = w('r2.packet.json', incomplete);
const manifest = (packets, extra = {}) => w('board' + Math.random().toString(36).slice(2, 7) + '.json', { title: 'Summer launch board', brief_ref: 'summer.brief.json', packets, ...extra });

/* ================================================================ */
t('a manifest with a complete route and a route missing its mobile render renders, flags the second, exits 1', () => {
  const out = path.join(TMP, 'board.html'), md = path.join(TMP, 'board.md');
  const r = run(['--manifest', manifest(['r1.packet.json', 'r2.packet.json']), '--pack', PACK, '--out', out, '--out-md', md]);
  assert(r.status === 1, 'expected exit 1 with an incomplete route: ' + r.status + ' ' + r.stderr);
  const html = fs.readFileSync(out, 'utf8');
  assert(/R1 PASS/.test(html) && /R2 INSUFFICIENT-INPUT/.test(html), 'route verdict chips missing');
  assert(/NOT RENDERED/.test(html) && /web 390/.test(html) && /expected by the brief/.test(html), 'the missing mobile render is not labelled: ' + r.stdout);
  assert(/packet claims complete: true; the board found/.test(html), 'the packet\'s complete claim was taken at face value');
  assert((html.match(/data:image\/png;base64,/g) || []).length >= 6, 'real renders were not embedded as data URIs');
  assert(!/src="[^d]/.test(html), 'an external asset reference slipped in');
  assert(/Every list in one place/.test(html) && /Welcome to the launch/.test(html), 'copy excerpts missing');
  assert(/unranked: no verifier scores; the board never ranks on its own/.test(html), 'ordering line missing');
  assert(/board total: not measured/.test(html) && /cost: not measured/.test(html), 'cost lines missing');
  assert(/#2b5f8e/.test(html) && !/#ffffff.*route/.test(html), 'pack palette not applied');
  assert(/strong, wrong moment/.test(html), 'passed-over reasons missing');
  const mdText = fs.readFileSync(md, 'utf8');
  assert(/## R2 · occasion · INSUFFICIENT-INPUT/.test(mdText) && /NOT RENDERED/.test(mdText), 'markdown lacks the flagged route: ' + mdText.slice(0, 400));
});
t('a social deliverable shows its angle, cover lines, caption first lines and panels on the board', () => {
  w('r9.social.json', { skill: 'social-copy', post_format: 'carousel', gates: {
    angle: [{ copy: 'One week, one page each day', axis: 'Benefit' }],
    cover: [{ copy: 'Lists that never make it to Friday', axis: 'Problem' }, { copy: 'What a sewn spine changes', axis: 'Curiosity gap' }],
    caption: [{ copy: 'Lists on receipts go missing by Wednesday.\nLinen Notebooks keep the week in one place.' }],
    sequence: [{ role: 'cover', slots: { headline: 'Lists that never make it to Friday' } }, { role: 'end', slots: { cta: 'SEE THE COVERS' } }] } });
  w('r9.packet.json', packet('R9', { channel_deliverables: [{ surface: 'social', name: 'Term carousel', type: 'carousel', copy: { path: 'r9.social.json', skill: 'social-copy' }, lint: { path: 'lint-pass.json', verdict: 'PASS' },
    renders: [{ surface: 'social', ratio_or_breakpoint: '4x5', path: null, rendered_by: null, placeholder: true }], image_plan: null, image_files: [] }],
    completion: { brief_type: 'social', items: [{ item: 'editable source', done: false }], complete: false, verdict: 'INSUFFICIENT-INPUT' } }));
  const out = path.join(TMP, 'social.html');
  const r = run(['--manifest', manifest(['r9.packet.json']), '--out', out]);
  assert(r.status !== 2, 'the social packet was refused: ' + r.stderr);
  const html = fs.readFileSync(out, 'utf8');
  assert(/Cover A \(Problem\)/.test(html) && /Lists that never make it to Friday/.test(html) && /Caption 1, first line/.test(html) && /Lists on receipts go missing by Wednesday\./.test(html), 'social excerpt missing: ' + r.stdout);
  assert(!/Linen Notebooks keep the week in one place/.test(html), 'the caption past its first line reached the board');
  assert(/end 2/.test(html) && /SEE THE COVERS/.test(html), 'panels missing');
});
t('a social carousel or story set needs one render per panel or frame; the picked angle is the one shown; a long sequence says what it left out', () => {
  ['1', '2', '3'].forEach(i => w('r8-4x5-' + i + '.png', png()));
  const seq = [{ role: 'cover', slots: { headline: 'Lists that never make it to Friday' } }, { role: 'inner', slots: { body: 'Monday' } }, { role: 'end', slots: { cta: 'SEE THE COVERS' } }];
  w('r8.social.json', { skill: 'social-copy', post_format: 'carousel', angle_gate: { picked_by: 'human', picked: 1 }, gates: {
    angle: [{ copy: 'One week, one page each day', axis: 'Benefit' }, { copy: 'The first Monday of term', axis: 'Occasion' }],
    cover: [{ copy: 'Lists that never make it to Friday', axis: 'Problem' }], caption: [{ copy: 'Lists on receipts go missing by Wednesday.' }], sequence: seq } });
  const del = items => ({ surface: 'social', name: 'Term carousel', type: 'carousel', copy: { path: 'r8.social.json', skill: 'social-copy' }, lint: { path: 'lint-pass.json', verdict: 'PASS' },
    renders: items.map(i => ({ surface: 'social', ratio_or_breakpoint: '4x5', item: i, path: 'r8-4x5-' + i + '.png', rendered_by: 'figma-export', placeholder: false })), image_plan: null, image_files: [] });
  const items = ['the angle picked, or the recommendation labelled provisional', "cover lines and captions inside the platform's limits", "copy for every panel or frame, mapped to the brand's social masters", 'finished exports for every panel or frame', 'editable source'].map(i => ({ item: i, done: true, evidence: 'x' }));
  w('r8a.packet.json', packet('R8', { channel_deliverables: [del([1, 2, 3])], completion: { brief_type: 'social', items, complete: true, verdict: 'PASS' } }));
  w('r8b.packet.json', packet('R8', { channel_deliverables: [del([1, 2])], completion: { brief_type: 'social', items, complete: true, verdict: 'PASS' } }));
  const outA = path.join(TMP, 'social-a.html'), outB = path.join(TMP, 'social-b.html');
  const ra = run(['--manifest', manifest(['r8a.packet.json'], { brief_ref: 'missing.brief.json' }), '--out', outA]);
  const htmlA = fs.readFileSync(outA, 'utf8');
  assert(!/4x5 #\d not rendered/.test(htmlA), 'a carousel with every panel rendered was flagged: ' + ra.stdout);
  assert(/Angle, picked by a human/.test(htmlA) && /The first Monday of term/.test(htmlA), 'the picked angle is not the one shown');
  const rb = run(['--manifest', manifest(['r8b.packet.json'], { brief_ref: 'missing.brief.json' }), '--out', outB]);
  const htmlB = fs.readFileSync(outB, 'utf8');
  assert(rb.status === 1 && /social: 4x5 #3 not rendered/.test(htmlB), 'a missing third panel was not flagged: ' + rb.stdout);
  const long = Array.from({ length: 12 }, (_, i) => ({ role: i === 0 ? 'cover' : (i === 11 ? 'end' : 'inner'), slots: { headline: 'Panel ' + (i + 1) } }));
  w('r8.social.json', { skill: 'social-copy', post_format: 'carousel', gates: { angle: [{ copy: 'One week', axis: 'Benefit' }], sequence: long } });
  const outC = path.join(TMP, 'social-c.html');
  run(['--manifest', manifest(['r8a.packet.json'], { brief_ref: 'missing.brief.json' }), '--out', outC]);
  assert(/2 more panels; the copy file has every one/.test(fs.readFileSync(outC, 'utf8')), 'a truncated sequence did not say so');
});
t('a complete board exits 0 and says every route passed', () => {
  const out = path.join(TMP, 'ok.html');
  const r = run(['--manifest', manifest(['r1.packet.json']), '--out', out]);
  assert(r.status === 0 && /board: PASS/.test(fs.readFileSync(out, 'utf8')), 'expected exit 0: ' + r.stdout + r.stderr);
});
t('an invalid packet is refused before anything renders, naming the packet', () => {
  const bad = packet('R3'); delete bad.completion; bad.route_id = 'three';
  w('r3.packet.json', bad);
  const out = path.join(TMP, 'never.html');
  const r = run(['--manifest', manifest(['r1.packet.json', 'r3.packet.json']), '--out', out]);
  assert(r.status === 2 && /packet r3\.packet\.json fails the packet schema/.test(r.stderr) && /route_id/.test(r.stderr), 'expected a refusal naming the packet: ' + r.status + ' ' + r.stderr);
  assert(!fs.existsSync(out), 'a board was written from an invalid packet');
});
t('a placeholder render never counts, and a missing lint report or a lint FAIL marks the route', () => {
  const ph = packet('R4'); ph.channel_deliverables[0].renders[2].placeholder = true;
  w('r4.packet.json', ph);
  const out = path.join(TMP, 'ph.html');
  const r = run(['--manifest', manifest(['r4.packet.json']), '--out', out]);
  const html = fs.readFileSync(out, 'utf8');
  assert(r.status === 1 && /placeholder, not a render/.test(html), 'placeholder counted as rendered: ' + r.stdout);
  const nolint = packet('R5'); nolint.channel_deliverables[0].lint = { path: 'missing-lint.json', verdict: 'PASS' };
  w('r5.packet.json', nolint);
  const r2 = run(['--manifest', manifest(['r5.packet.json']), '--out', path.join(TMP, 'nl.html')]);
  assert(r2.status === 1 && /lint report missing/.test(fs.readFileSync(path.join(TMP, 'nl.html'), 'utf8')), 'missing lint report not flagged');
  const failed = packet('R6'); failed.channel_deliverables[0].lint = { path: 'lint-fail.json', verdict: 'PASS' };
  w('r6.packet.json', failed);
  const r3 = run(['--manifest', manifest(['r6.packet.json']), '--out', path.join(TMP, 'lf.html')]);
  const h3 = fs.readFileSync(path.join(TMP, 'lf.html'), 'utf8');
  assert(r3.status === 1 && /R6 FAIL/.test(h3) && /packet declared PASS, the report says FAIL/.test(h3), 'the declared verdict was trusted over the report');
});
t('routes are ordered by verifier rank only when every packet carries one; scores render; the board adds none', () => {
  const a = packet('R7', { verifier: { scores: { brief_adherence: { score: 0.9, pass: true, note: 'on brief' }, voice_fit: { score: 0.6, pass: false, note: 'generic' } }, rank: 2, unknown: ['visual_legibility'], verified_by: 'verify', independent: true } });
  const b = packet('R8', { verifier: { scores: { brief_adherence: { score: 0.95, pass: true, note: 'on brief' } }, rank: 1, unknown: [], verified_by: 'verify', independent: true } });
  w('r7.packet.json', a); w('r8.packet.json', b);
  const out = path.join(TMP, 'ranked.html');
  run(['--manifest', manifest(['r7.packet.json', 'r8.packet.json']), '--out', out]);
  const html = fs.readFileSync(out, 'utf8');
  assert(/ordered by verifier rank/.test(html) && html.indexOf('R8 · benefit') < html.indexOf('R7 · benefit'), 'not ordered by rank');
  assert(/could not judge: visual_legibility/.test(html) && /0\.60/.test(html), 'verifier detail missing');
  const mixed = manifest(['r7.packet.json', 'r1.packet.json']);
  run(['--manifest', mixed, '--out', path.join(TMP, 'mixed.html')]);
  assert(/unranked: not every packet carries a verifier rank/.test(fs.readFileSync(path.join(TMP, 'mixed.html'), 'utf8')), 'partial ranks should leave the board unranked');
});
t('measured costs sum across routes and say how many were measured', () => {
  const m = packet('R9', { provenance: { brand: 'Testbrand', brand_context: 'x', cost: { model: 'claude-x', input_tokens: 1000, output_tokens: 200, media_calls: 3, measured_by: 'orchestrator' } } });
  w('r9.packet.json', m);
  const out = path.join(TMP, 'cost.html');
  run(['--manifest', manifest(['r9.packet.json', 'r1.packet.json']), '--out', out]);
  const html = fs.readFileSync(out, 'utf8');
  assert(/board total: in 1000 · out 200 · media 3 \(1 of 2 routes measured; the rest not measured\)/.test(html), 'board total wrong: ' + (html.match(/board total[^<]*/) || [])[0]);
});
t('an unreadable brief is reported and the completion contract supplies the required renders', () => {
  const out = path.join(TMP, 'nobrief.html');
  const r = run(['--manifest', manifest(['r2.packet.json'], { brief_ref: 'missing.brief.json' }), '--out', out]);
  const html = fs.readFileSync(out, 'utf8');
  assert(/brief not readable at/.test(html) && /expected by the completion contract/.test(html), 'contract fallback not applied: ' + r.stdout);
});
t('an unreadable manifest, an empty packet list, or a missing --out is exit 2', () => {
  assert(run(['--manifest', path.join(TMP, 'nope.json'), '--out', path.join(TMP, 'x.html')]).status === 2, 'missing manifest');
  assert(run(['--manifest', manifest([]), '--out', path.join(TMP, 'x.html')]).status === 2, 'empty packets');
  assert(run(['--manifest', manifest(['r1.packet.json'])]).status === 2, 'missing --out');
});

console.log('\n' + npass + ' passed, ' + nfail + ' failed');
process.exit(nfail ? 1 : 0);
