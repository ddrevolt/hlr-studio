#!/usr/bin/env node
/* Tests for the verifier scripts: verify_packets.js, pairwise_rank.js, judge_calibration.js, judge_brief.js.
   Synthetic packets and a synthetic pack for Testbrand, a fictional stationery brand; no real brand data.
   Run: node tests/test_verify.js */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process'), crypto = require('crypto');
const here = path.resolve(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-'));
let passed = 0, failed = 0;
const ok = (c, m) => { if (c) passed++; else { failed++; console.log('  FAIL ' + m); } };
const w = (name, obj) => { const p = path.join(tmp, name); fs.writeFileSync(p, typeof obj === 'string' ? obj : JSON.stringify(obj, null, 1)); return p; };
const run = (script, args) => { const r = cp.spawnSync('node', [path.join(here, 'scripts', script), ...args], { encoding: 'utf8' }); let out = null; try { out = JSON.parse(r.stdout); } catch (e) { /* leave null */ } return { code: r.status, out, err: r.stderr }; };
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

// ---------------------------------------------------------------- synthetic pack
const packDir = path.join(tmp, 'pack'); fs.mkdirSync(packDir);
fs.writeFileSync(path.join(packDir, 'favorites.json'), JSON.stringify({ favorites: [{ id: 'fav001', text: 'Every page in this book was folded by the person who signed it', role: 'headline' }] }));
fs.writeFileSync(path.join(packDir, 'voice-calibration.json'), JSON.stringify({ labels: [
  { id: 'L1', text: 'Ruled, plain or dot grid, in a cover you can write on', role: 'headline', sheet_role: 'hero', verdict: 'keep', sheet: 1 },
  { id: 'L2', text: 'Is your notebook working as hard as you are?', role: 'headline', sheet_role: 'hero', verdict: 'cut', sheet: 1 },
  { id: 'L3', text: 'A second notebook rides along with this order', role: 'headline', sheet_role: 'hero', verdict: 'keep', sheet: 1, stable: false, remark: { verdict: 'cut' } },
  { id: 'L4', text: 'CHOOSE YOUR PAPER', role: 'cta', sheet_role: 'cta', verdict: 'keep', sheet: 1 },
  { id: 'L5', text: 'READY TO WRITE?', role: 'cta', sheet_role: 'cta', verdict: 'cut', sheet: 1 },
  { id: 'L6', text: 'DO NOT MISS OUT', role: 'cta', sheet_role: 'cta', verdict: 'cut', sheet: 1 },
], _sheet2: { controls: 10, controls_agree: 6 } }));
fs.writeFileSync(path.join(packDir, 'lexicon.json'), JSON.stringify({ _role: 'concrete_lexicon', product: ['notebook', 'paper', 'linen'], scene: ['desk'], product_families: ['Linen Notebooks'], product_names: [] }));
fs.writeFileSync(path.join(packDir, 'judge-rubric.md'), '# Testbrand: measured preference\n\nKept: the product named in full, the paper and cover described plainly. Cut: questions.\n\n| role | kept | cut |\n|---|---|---|\n| cta | a verb and the product | a question |\n');
fs.writeFileSync(path.join(packDir, 'brand-context.md'), '# Test brand\n\n```json\n' + JSON.stringify({ brand: 'Testbrand', favorites: 'favorites.json', concrete_lexicon: 'lexicon.json', voice_calibration: 'voice-calibration.json', judge_calibration: null, judge_rubric: null }) + '\n```\n');

// ---------------------------------------------------------------- synthetic slates, lints, packets
function slate(name, subj, head, body, offer, cta) {
  const s = { skill: 'email-copy', format: 3, type: 'sale_launch', brief: { must_say: ['Linen Notebooks'], guidance: { vocabulary: ['linen'] } },
    gates: { subject: [{ copy: subj, checklist: { a: true, b: false }, register: 'Plain' }], hero: [{ copy: head, copy2: body, checklist: { a: true, b: true }, register: 'Bright' }], offer: [{ copy: offer, checklist: { a: true }, register: 'Plain' }], cta: [{ copy: cta, checklist: { a: false }, register: 'Dry' }] },
    envelope: { preheader: [{ copy: 'pre ' + name }] } };
  return w(name + '.slates.json', s);
}
function lint(name, slatePath, verdict, extra = {}) { return w(name + '.copy_lint.json', Object.assign({ verdict, errors: [], warns: [], needs_human_signoff: verdict === 'INSUFFICIENT-INPUT' ? ['x', 'y'] : [], checked: { slate_sha256: sha(slatePath) } }, extra)); }
function packet(id, slatePath, lintPath, verdict, over = {}) {
  return w(id.toLowerCase() + '.packet.json', Object.assign({ kind: 'route-packet', format: 1, route_id: id, frame: 'occasion', angle: 'angle ' + id, brief_ref: 'b.brief.json', routes_ref: null, brand: 'Testbrand', worker: null,
    channel_deliverables: [{ surface: 'email', name: 'launch', type: 'sale_launch', copy: { path: slatePath, skill: 'email-copy' }, lint: { path: lintPath, verdict }, renders: [{ surface: 'email', ratio_or_breakpoint: 'email', path: null, rendered_by: null, placeholder: true }], image_plan: null, image_files: [] }],
    passed_over: [], provenance: { brand: 'Testbrand', brand_context: path.join(packDir, 'brand-context.md'), cost: { model: null, input_tokens: null, output_tokens: null, media_calls: null, measured_by: 'not measured' } },
    verifier: null, completion: { brief_type: 'email', items: [{ item: 'subject and preheader', done: true }], complete: false, verdict: 'INSUFFICIENT-INPUT' } }, over));
}
const s1 = slate('r1', 'The spring covers are here', 'Six new covers, one paper inside', 'Each cover is cut from waxed canvas. Spend $50 and 2 notebooks ride along.', 'Spend $50, choose any 2 Linen Notebooks free', 'CHOOSE YOUR COVERS');
const s2 = slate('r2', 'Which paper suits your pen?', 'Paper that keeps up with fountain pens', 'Ink sits on the page and dries without feathering. Spend $50 and 2 are free.', 'What $50 brings home this week', 'READY TO WRITE?');
const s3 = slate('r3', 'Third route', 'Every page in this book was folded by the person who signed it', 'Body three. Spend $50, take 2.', 'Offer three at $50 for 2', 'GO');
const l1 = lint('r1', s1, 'WARN'), l2 = lint('r2', s2, 'INSUFFICIENT-INPUT'), l3 = lint('r3', s3, 'FAIL');
const p1 = packet('R1', s1, l1, 'WARN'), p2 = packet('R2', s2, l2, 'INSUFFICIENT-INPUT'), p3 = packet('R3', s3, l3, 'FAIL');
// R4: fingerprint mismatch (lint made on a different file)
const s4 = slate('r4', 'Four', 'Head four', 'Body four. Spend $50, take 2.', 'Offer four $50 2 free', 'TAKE 2');
const l4 = lint('r4', s1, 'WARN'); const p4 = packet('R4', s4, l4, 'WARN');

console.log('verify_packets.js');
{
  const sig = path.join(tmp, 'signals.json'), pairs = path.join(tmp, 'pairs.json');
  const r = run('verify_packets.js', ['--packets', [p1, p2, p3, p4].join(','), '--pack', packDir, '--out', sig, '--pairs', pairs, '--mirror', '--seed', '3']);
  ok(r.out && r.out.verdict === 'INSUFFICIENT-INPUT', 'V1 a FAIL packet makes the run INSUFFICIENT-INPUT, not FAIL');
  const by = Object.fromEntries((r.out.packets || []).map(p => [p.route_id, p]));
  ok(by.R1 && by.R1.rankable === true, 'V2 WARN packet is rankable');
  ok(by.R2 && by.R2.rankable === true && by.R2.pending_human === 2, 'V3 INSUFFICIENT-INPUT packet is rankable with pending_human counted from the lint report');
  ok(by.R3 && by.R3.rankable === false && by.R3.hard_fail && /lint FAIL/.test(by.R3.reasons.join(' ')), 'V4 FAIL lint is not rankable and says so');
  ok(by.R4 && by.R4.rankable === false && /fingerprint/.test(by.R4.reasons.join(' ')), 'V5 fingerprint mismatch is not rankable');
  ok(by.R1.signals.email && by.R1.signals.email.family_named_rate > 0 && by.R1.signals.email.checklist_mean === 0.625, 'V6 signals computed (family rate, checklist mean)');
  ok(by.R2.signals.email.question_rate > 0, 'V7 question rate catches the question subject');
  ok(by.R3.signals.email.favorites_echo_max_5grams >= 3, 'V8 favorites echo catches a line copied from a favorite');
  ok(by.R1.unknown.includes('visual_legibility') && by.R1.unknown.includes('pack_fidelity'), 'V9 unknown dimensions listed without renders or composite');
  ok(r.out.pairs === 2 && r.out.pair_map.length === 2 && r.out.pair_map[1].mirror_of === 'P001', 'V10 two rankable routes give one pair plus its mirror');
  const pj = JSON.parse(fs.readFileSync(pairs, 'utf8'));
  ok(!JSON.stringify(pj).includes('R1') && !JSON.stringify(pj).includes('WARN') && pj.pairs[0].A.email, 'V11 pairs file carries exhibits only: no route ids, no verdicts');
  const r2 = run('verify_packets.js', ['--packets', p3 + ',' + p4, '--pack', packDir]);
  ok(r2.out.verdict === 'INSUFFICIENT-INPUT' && r2.out.pairs === 0 && r2.out.warns.some(x => /fewer than two/.test(x)), 'V12 fewer than two rankable: no pairs, warned');
  const r3 = run('verify_packets.js', ['--pack', packDir]);
  ok(r3.code === 2 && r3.out.verdict === 'FAIL', 'V13 no packets is a run that could not start');
  // V14: the family-named signal comes from the pack's lexicon, never from the engine
  const noLex = path.join(tmp, 'nolex'); fs.mkdirSync(noLex);
  fs.writeFileSync(path.join(noLex, 'brand-context.md'), '# Test brand\n\n```json\n' + JSON.stringify({ brand: 'Testbrand', favorites: null, concrete_lexicon: null }) + '\n```\n');
  const r4 = run('verify_packets.js', ['--packets', [p1, p2].join(','), '--pack', noLex]);
  const n1 = (r4.out.packets || []).find(p => p.route_id === 'R1');
  ok(n1 && n1.signals.email.family_named_rate === null && r4.out.warns.some(x => /product families: concrete_lexicon is null/.test(x)), 'V14 without the pack\'s product families the family-named rate is null and warned, not guessed');
  const badLex = path.join(tmp, 'badlex'); fs.mkdirSync(badLex);
  fs.writeFileSync(path.join(badLex, 'brand-context.md'), '# Test brand\n\n```json\n' + JSON.stringify({ brand: 'Testbrand', concrete_lexicon: 'missing.json' }) + '\n```\n');
  const r5 = run('verify_packets.js', ['--packets', [p1, p2].join(','), '--pack', badLex]);
  ok(r5.code === 2 && r5.out.verdict === 'FAIL', 'V15 a concrete_lexicon role wired to a missing file is a refusal');
  // V16: a social packet validates and is read by its own shape: cover, caption, panels
  const sp = w('post.social.json', { skill: 'social-copy', post_format: 'carousel', brief: { must_say: ['Linen Notebooks'] }, gates: {
    cover: [{ copy: 'Lists that never make it to Friday', checklist: { a: true }, register: 'Plain' }, { copy: 'What does a sewn spine change?', checklist: { a: false }, register: 'Bright' }],
    caption: [{ copy: 'Linen Notebooks keep the week in one place.', checklist: { a: true } }],
    sequence: [{ role: 'cover', slots: { headline: 'Lists that never make it to Friday' } }, { role: 'inner', slots: { body: 'The page is still there on Wednesday.' } }, { role: 'end', slots: { cta: 'SEE THE COVERS' } }] } });
  const sl = lint('post', sp, 'PASS');
  const spk = packet('R5', sp, sl, 'PASS', { channel_deliverables: [{ surface: 'social', name: 'term carousel', type: 'carousel', copy: { path: sp, skill: 'social-copy' }, lint: { path: sl, verdict: 'PASS' },
    renders: [{ surface: 'social', ratio_or_breakpoint: '4x5', path: null, rendered_by: null, placeholder: true }], image_plan: null, image_files: [] }],
    completion: { brief_type: 'social', items: [{ item: 'cover lines and captions inside the platform\'s limits', done: true }], complete: false, verdict: 'INSUFFICIENT-INPUT' } });
  const pairs6 = path.join(tmp, 'pairs6.json');
  const r6 = run('verify_packets.js', ['--packets', [p1, spk].join(','), '--pack', packDir, '--pairs', pairs6]);
  const n6 = (r6.out.packets || []).find(p => p.route_id === 'R5');
  const soc = fs.existsSync(pairs6) ? JSON.parse(fs.readFileSync(pairs6, 'utf8')).pairs.map(p => p.A.social || p.B.social).find(Boolean) : null;
  ok(n6 && n6.rankable === true && !n6.hard_fail && soc && soc.cover.length === 2 && soc.panels.length === 3
    && n6.signals.social.question_rate > 0 && n6.signals.social.family_named_rate > 0, 'V16 a social packet validates, is rankable, and is read by its own shape (cover, caption, panels): ' + JSON.stringify(n6 && [n6.reasons, soc]));

  // V17: a second deliverable on one surface is named and not judged; the first one is kept
  const sp2 = w('post2.social.json', { skill: 'social-copy', post_format: 'story_set', gates: { cover: [{ copy: 'The studio is open' }], sequence: [{ role: 'frame', structure: 'text', slots: { headline: 'The studio is open' } }] } });
  const sl2 = lint('post2', sp2, 'PASS');
  const two = JSON.parse(fs.readFileSync(spk, 'utf8'));
  two.channel_deliverables.push({ surface: 'social', name: 'studio stories', type: 'story_set', copy: { path: sp2, skill: 'social-copy' }, lint: { path: sl2, verdict: 'PASS' }, renders: [], image_plan: null, image_files: [] });
  const spk2 = w('r5b.packet.json', two);
  const r7 = run('verify_packets.js', ['--packets', [p1, spk2].join(','), '--pack', packDir]);
  const n7 = (r7.out.packets || []).find(p => p.route_id === 'R5');
  ok(n7 && (r7.out.warns || []).some(x => /R5: a second social deliverable \(studio stories\) is not judged/.test(x)) && n7.signals.social && n7.signals.social.question_rate > 0,
    'V17 a second deliverable on one surface is named in the warnings and the first one is the one judged: ' + JSON.stringify(r7.out.warns));

  console.log('pairwise_rank.js');
  const pm = r.out.pair_map; const a = pm[0].a, b = pm[0].b; // base pair positions
  // consistent judgments: route a wins in both orientations
  const jud = w('j.json', [
    { pair_id: 'P001', winner: 'A', dimensions: { brief_adherence: 'A', voice_fit: 'A', distinctiveness: 'tie' }, reason: 'A concrete' },
    { pair_id: 'P001m', winner: 'B', dimensions: { brief_adherence: 'B', voice_fit: 'B', distinctiveness: 'tie' }, reason: 'B concrete' },
  ]);
  const outDir = path.join(tmp, 'verified');
  const rr = run('pairwise_rank.js', ['--signals', sig, '--judgments', jud, '--out-dir', outDir, '--judge', 'test-judge', '--independent', 'true', '--pack', packDir]);
  ok(rr.out && rr.out.verdict === 'PASS', 'R1 rank produced');
  const ranked = Object.fromEntries(rr.out.ranked.map(x => [x.route_id, x]));
  ok(ranked[a].rank === 1 && ranked[b].rank === 2 && ranked.R3.rank === null && ranked.R4.rank === null, 'R2 consistent winner ranks first; unrankable packets get null');
  const v1 = JSON.parse(fs.readFileSync(path.join(outDir, path.basename(fs.readdirSync(outDir).find(f => f.startsWith(a.toLowerCase())))), 'utf8')).verifier;
  ok(v1 && v1.scores.voice_fit.score === 1 && v1.scores.distinctiveness.score === 0.5 && v1.scores.hard_gates.pass === true && v1.independent === true, 'R3 verifier block: win share, tie share, hard gates, independence');
  ok(rr.out.warns.some(x => /calibration/.test(x)), 'R4 warns that no calibration exists in the pack');
  // position bias: A wins in both orientations -> tie
  const jud2 = w('j2.json', [{ pair_id: 'P001', winner: 'A', dimensions: {}, reason: '' }, { pair_id: 'P001m', winner: 'A', dimensions: {}, reason: '' }]);
  const rb = run('pairwise_rank.js', ['--signals', sig, '--judgments', jud2, '--out-dir', path.join(tmp, 'v2')]);
  ok(rb.out.position_bias_ties === 1 && rb.out.ranked.filter(x => x.rank).every(x => x.copeland === 0), 'R5 same position winning both ways is a tie, counted as bias');
  const rc = run('pairwise_rank.js', ['--signals', sig, '--judgments', w('j3.json', [{ pair_id: 'ZZZ', winner: 'A' }]), '--out-dir', path.join(tmp, 'v3')]);
  ok(rc.code === 2, 'R6 judgments from another run are refused');
  // the written packet still validates against the packet schema
  const schema = JSON.parse(fs.readFileSync(path.join(here, '..', 'options-board', 'references', 'packet-schema.json'), 'utf8'));
  const validate = require(path.join(here, '..', '..', 'lib', 'schema.js')).validate;
  const anyOut = JSON.parse(fs.readFileSync(path.join(outDir, fs.readdirSync(outDir)[0]), 'utf8'));
  ok(validate(schema, anyOut).ok, 'R7 verified packet validates against packet-schema');
}

console.log('judge_calibration.js');
{
  const pairs = path.join(tmp, 'cal-pairs.json'), key = path.join(tmp, 'cal-key.json');
  const r = run('judge_calibration.js', ['--pack', packDir, '--build', pairs, '--key', key, '--n', '10', '--seed', '5']);
  ok(r.out && r.out.verdict === 'PASS' && r.out.built === 3, 'C1 builds every keep-versus-cut pair of the same role (1x1 hero + 1x2 cta = 3), excluding the unstable line');
  ok(r.out.excluded_unstable === 1 && r.out.owner_test_retest === 0.6, 'C2 excludes unstable marks and reads the owner test-retest from the calibration');
  const pj = JSON.parse(fs.readFileSync(pairs, 'utf8')), kj = JSON.parse(fs.readFileSync(key, 'utf8'));
  ok(!JSON.stringify(pj).includes('keep') && kj.pairs.every(k => k.keep_position === 'A' || k.keep_position === 'B'), 'C3 pairs carry no verdicts; key carries the keep position');
  const perfect = kj.pairs.map(k => ({ pair_id: k.pair_id, winner: k.keep_position }));
  const rs = run('judge_calibration.js', ['--pack', packDir, '--score', w('perf.json', perfect), '--key', key, '--judge', 'oracle', '--out', path.join(packDir, 'judge-calibration.json')]);
  ok(rs.out && rs.out.agreement === 1 && rs.out.n_pairs === 3 && rs.out.by_role.cta.n === 2, 'C4 a perfect judge scores 1.0 with per-role counts');
  ok(fs.existsSync(path.join(packDir, 'judge-calibration.json')) && JSON.parse(fs.readFileSync(path.join(packDir, 'judge-calibration.json'), 'utf8'))._role === 'judge_calibration', 'C5 writes the pack role file');
  const wrong = kj.pairs.map(k => ({ pair_id: k.pair_id, winner: k.keep_position === 'A' ? 'B' : 'A' }));
  const rw = run('judge_calibration.js', ['--pack', packDir, '--score', w('wrong.json', wrong), '--key', key]);
  ok(rw.out.agreement === 0 && /chance/.test(rw.out.reading), 'C6 an inverted judge scores 0 and is read as not above chance');
  const inc = run('judge_calibration.js', ['--pack', packDir, '--build', pairs, '--key', key, '--n', '10', '--include-unstable']);
  ok(inc.out.built === 4 && inc.out.excluded_unstable === 0, 'C7 --include-unstable brings the flipped line back (2x1 hero + 1x2 cta = 4 pairs)');
  // pairwise_rank picks up the calibration once it exists in the pack (File map names it)
  fs.writeFileSync(path.join(packDir, 'brand-context.md'), '# Test brand\n\n```json\n' + JSON.stringify({ brand: 'Testbrand', favorites: 'favorites.json', voice_calibration: 'voice-calibration.json', judge_calibration: 'judge-calibration.json' }) + '\n```\n');
  const sig = path.join(tmp, 'signals.json');
  const rr = run('pairwise_rank.js', ['--signals', sig, '--judgments', path.join(tmp, 'j.json'), '--out-dir', path.join(tmp, 'v4'), '--pack', packDir]);
  const v = JSON.parse(fs.readFileSync(path.join(tmp, 'v4', 'r1.packet.json'), 'utf8')).verifier;
  ok(v.calibration && v.calibration.agreement_with_owner === 1 && v.calibration.owner_test_retest === 0.6 && !rr.out.warns.some(x => /no judge_calibration/.test(x)), 'C8 verifier block carries the pack calibration once it exists');
}

console.log('judge_brief.js');
{
  const out1 = path.join(tmp, 'brief-null.md');
  const b1 = run('judge_brief.js', ['--pack', packDir, '--out', out1]);
  const t1 = fs.existsSync(out1) ? fs.readFileSync(out1, 'utf8') : '';
  ok(b1.code === 1 && b1.out.verdict === 'INSUFFICIENT-INPUT' && b1.out.preference.status === 'none on file', 'B1 a null judge_rubric writes the brief and exits INSUFFICIENT-INPUT');
  ok(/## The brand's own preference: Testbrand/.test(t1) && /None on file/.test(t1) && /Do not import any other brand/.test(t1), 'B2 the null brief tells the judge, in its own text, that no measured preference is on file');
  const rubric = fs.readFileSync(path.join(here, 'references', 'pairwise-rubric.md'), 'utf8');
  ok(t1.startsWith(rubric.trimEnd()), 'B3 the brief opens with the engine rubric, unchanged');
  fs.writeFileSync(path.join(packDir, 'brand-context.md'), '# Test brand\n\n```json\n' + JSON.stringify({ brand: 'Testbrand', favorites: 'favorites.json', concrete_lexicon: 'lexicon.json', voice_calibration: 'voice-calibration.json', judge_calibration: 'judge-calibration.json', judge_rubric: 'judge-rubric.md' }) + '\n```\n');
  const out2 = path.join(tmp, 'brief-pack.md');
  const b2 = run('judge_brief.js', ['--pack', packDir, '--out', out2]);
  const t2 = fs.existsSync(out2) ? fs.readFileSync(out2, 'utf8') : '';
  ok(b2.code === 0 && b2.out.verdict === 'PASS' && b2.out.preference.status === 'pack' && /^[0-9a-f]{64}$/.test(b2.out.preference.sha256), 'B4 a pack judge_rubric is appended and its hash recorded');
  ok(/Kept: the product named in full/.test(t2) && /\| cta \| a verb and the product/.test(t2) && !/None on file/.test(t2), 'B5 the brief carries the pack\'s preference and by-role table, not the null notice');
  fs.writeFileSync(path.join(packDir, 'brand-context.md'), '# Test brand\n\n```json\n' + JSON.stringify({ brand: 'Testbrand', judge_rubric: 'gone.md' }) + '\n```\n');
  const b3 = run('judge_brief.js', ['--pack', packDir, '--out', path.join(tmp, 'brief-bad.md')]);
  ok(b3.code === 2 && b3.out.verdict === 'FAIL' && !fs.existsSync(path.join(tmp, 'brief-bad.md')), 'B6 a judge_rubric wired to a missing file is a refusal and writes nothing');
  const b4 = run('judge_brief.js', ['--out', path.join(tmp, 'brief-nopack.md')]);
  ok(b4.code === 2, 'B7 no pack is a refusal: the brief needs the brand it judges for');
  fs.mkdirSync(path.join(packDir, 'rubric-dir'), { recursive: true });
  fs.writeFileSync(path.join(packDir, 'brand-context.md'), '# Test brand\n\n```json\n' + JSON.stringify({ brand: 'Testbrand', judge_rubric: 'rubric-dir' }) + '\n```\n');
  const b5 = run('judge_brief.js', ['--pack', packDir, '--out', path.join(tmp, 'brief-dir.md')]);
  ok(b5.code === 2 && b5.out && b5.out.verdict === 'FAIL', 'B9 a judge_rubric that points at a folder is a refusal (exit 2), never the exit 1 that means none on file');
  fs.writeFileSync(path.join(packDir, 'brand-context.md'), '# Test brand\n\n```json\n' + JSON.stringify({ brand: 'Testbrand', judge_rubric: 7 }) + '\n```\n');
  const b6 = run('judge_brief.js', ['--pack', packDir, '--out', path.join(tmp, 'brief-num.md')]);
  ok(b6.code === 2, 'B10 a judge_rubric that is not a path or null is a refusal');
  fs.writeFileSync(path.join(packDir, 'brand-context.md'), '# Test brand\n\n```json\n' + JSON.stringify({ brand: 'Testbrand' }) + '\n```\n');
  const b7 = run('judge_brief.js', ['--pack', packDir, '--out', path.join(tmp, 'brief-absent.md')]);
  ok(b7.code === 1 && b7.out.warns.some(x => /absent from the File map/.test(x)), 'B11 a judge_rubric missing from the File map is named, then treated as none on file');
  ok(!/kept|cut:/i.test(rubric.split('## The brand\'s preference comes from the brand')[0].replace(/keep-versus-cut|kept and cut/gi, '')), 'B8 the engine rubric states no brand\'s measured preference of its own');
}

console.log(passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
