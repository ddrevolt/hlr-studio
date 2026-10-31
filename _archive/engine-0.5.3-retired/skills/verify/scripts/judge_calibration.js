#!/usr/bin/env node
/* judge_calibration.js: measures the pairwise judge against the brand owner (studio-engine 0.4.0).

   The verifier ranks routes by asking a fresh-context judge to compare copy in pairs. Before that
   rank means anything, the same judge has to be tested the same way against the only grade that
   counts: the brand owner's own blind keep-or-cut marks (the pack's voice_calibration role). This
   script builds keep-versus-cut pairs from those marks (same role, same sheet, positions randomised,
   answers held in a separate key), and later scores the judge's answers against the key.

   Build:  node judge_calibration.js --pack <folder> --build pairs.json --key key.json [--n 120] [--seed 7]
                                     [--include-unstable] [--roles eyebrow,hero,...] [--exclude-pairs prior-key.json]
   Score:  node judge_calibration.js --pack <folder> --score judgments.json --key key.json
                                     [--judge "<who judged>"] [--out judge-calibration.json]

   The score reports agreement with the owner, a 95 percent interval, agreement by role, the share of
   A-position picks (position bias), and two reference lines the number has to be read against:
   chance (0.5) and the owner's own test-retest agreement, taken from the calibration file when a
   sheet re-marked earlier lines. A judge cannot be expected to agree with the owner more often than
   the owner agrees with himself. */
'use strict';
const fs = require('fs'), path = require('path');
function arg(k, d) { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; }
function has(k) { return process.argv.indexOf(k) > 0; }
const die = m => { console.log(JSON.stringify({ errors: [m], verdict: 'FAIL' }, null, 1)); console.error('judge_calibration: ' + m); process.exit(2); };
const readJSON = p => JSON.parse(fs.readFileSync(p, 'utf8'));
function sharedLib(name) {
  const cands = [path.join(__dirname, '..', '..', '..', 'lib', name)];
  if (process.env.CLAUDE_PLUGIN_ROOT) cands.push(path.join(process.env.CLAUDE_PLUGIN_ROOT, 'lib', name));
  for (const c of cands) if (fs.existsSync(c)) return require(c);
  die('shared module lib/' + name + ' not found');
}
const pack = sharedLib('pack.js');
let CTX = null; try { CTX = pack.resolveContext(process.argv); } catch (e) { die(e.message); }
if (!CTX) die('pass --pack <folder> (or --brand-context / --brand): the marks live in the pack');
const calPath = pack.resolveRole(CTX, 'voice_calibration');
if (!calPath) die('the pack\'s voice_calibration role is null: there are no marks to calibrate against');
if (calPath === false) die('voice_calibration is named in the File map and not on disk');
const cal = readJSON(calPath); const labels = cal.labels || [];
const ownerRetest = cal._sheet2 && cal._sheet2.controls ? +(cal._sheet2.controls_agree / cal._sheet2.controls).toFixed(3) : null;

let seed = parseInt(arg('--seed', '7'), 10) || 7;
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

if (has('--build')) {
  const N = parseInt(arg('--n', '120'), 10) || 120; const includeUnstable = has('--include-unstable');
  const roleFilter = arg('--roles', null) ? new Set(arg('--roles').split(',').map(s => s.trim())) : null;
  let used = new Set();
  if (arg('--exclude-pairs', null)) { try { const prev = readJSON(arg('--exclude-pairs')); (prev.pairs || []).forEach(k => used.add(k.keep_id + '|' + k.cut_id)); } catch (e) { die('cannot read --exclude-pairs: ' + e.message); } }
  const usable = labels.filter(l => l.text && l.verdict && (includeUnstable || l.stable !== false) && (!roleFilter || roleFilter.has(l.sheet_role || l.role)));
  const excluded = labels.filter(l => !includeUnstable && l.stable === false && (!roleFilter || roleFilter.has(l.sheet_role || l.role))).length;
  const groups = {};
  usable.forEach(l => { const k = (l.sheet_role || l.role) + '|' + (l.sheet || 1); (groups[k] = groups[k] || { keeps: [], cuts: [] })[l.verdict === 'keep' ? 'keeps' : 'cuts'].push(l); });
  // candidate pairs per group: every keep with every cut, then a stratified draw
  const cands = [];
  Object.entries(groups).forEach(([k, g]) => { if (!g.keeps.length || !g.cuts.length) return; const ps = []; g.keeps.forEach(a => g.cuts.forEach(b => { if (!used.has(a.id + '|' + b.id)) ps.push({ role: k.split('|')[0], sheet: +k.split('|')[1], keep: a, cut: b }); })); cands.push({ key: k, pairs: shuffle(ps) }); });
  const total = cands.reduce((s, c) => s + c.pairs.length, 0);
  const picked = [];
  cands.forEach(c => { const share = Math.max(1, Math.round(N * c.pairs.length / total)); picked.push(...c.pairs.slice(0, share)); });
  shuffle(picked); const chosen = picked.slice(0, N);
  const pairs = [], key = [];
  chosen.forEach((p, i) => {
    const id = 'C' + String(i + 1).padStart(3, '0'); const keepIsA = rnd() < 0.5;
    pairs.push({ pair_id: id, role: p.role, A: keepIsA ? p.keep.text : p.cut.text, B: keepIsA ? p.cut.text : p.keep.text });
    key.push({ pair_id: id, role: p.role, sheet: p.sheet, keep_position: keepIsA ? 'A' : 'B', keep_id: p.keep.id, cut_id: p.cut.id });
  });
  fs.writeFileSync(arg('--build'), JSON.stringify({ note: 'Calibration pairs for the pairwise judge. Each pair is two lines of the same role; one the brand owner kept, one he cut, in random order. Pick the one that reads more like copy the brand would ship. No other information is given, and none should be sought.', pairs }, null, 1));
  if (arg('--key')) fs.writeFileSync(arg('--key'), JSON.stringify({ built_from: path.basename(calPath), n: key.length, excluded_unstable: includeUnstable ? 0 : excluded, owner_test_retest: ownerRetest, pairs: key }, null, 1));
  console.log(JSON.stringify({ verdict: 'PASS', built: pairs.length, groups: Object.keys(groups).length, candidate_pairs: total, excluded_unstable: includeUnstable ? 0 : excluded, owner_test_retest: ownerRetest, pairs_path: arg('--build'), key_path: arg('--key') || null }, null, 1));
  process.exit(0);
}

if (has('--score')) {
  let judgments, key;
  try { judgments = readJSON(arg('--score')); judgments = Array.isArray(judgments) ? judgments : (judgments.judgments || []); } catch (e) { die('cannot read --score: ' + e.message); }
  try { key = readJSON(arg('--key')); } catch (e) { die('cannot read --key: ' + e.message); }
  const byId = new Map(judgments.map(j => [j.pair_id, j]));
  let n = 0, agree = 0, ties = 0, aPicks = 0, missing = 0; const byRole = {};
  for (const k of key.pairs) {
    const j = byId.get(k.pair_id); if (!j) { missing++; continue; }
    const w = j.winner; if (w !== 'A' && w !== 'B') { ties++; continue; }
    n++; if (w === 'A') aPicks++; const ok = w === k.keep_position; if (ok) agree++;
    const r = (byRole[k.role] = byRole[k.role] || { n: 0, agree: 0 }); r.n++; if (ok) r.agree++;
  }
  if (!n) die('no decisive judgments matched the key');
  const p = agree / n; const z = 1.96; const den = 1 + z * z / n; const centre = (p + z * z / (2 * n)) / den; const half = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / den;
  const result = {
    verdict: 'PASS', judge: arg('--judge', null), judged_at: new Date().toISOString(),
    n_pairs: n, ties_or_abstained: ties, missing, agreement: +p.toFixed(3), ci95: [+(centre - half).toFixed(3), +(centre + half).toFixed(3)],
    chance: 0.5, owner_test_retest: key.owner_test_retest != null ? key.owner_test_retest : ownerRetest,
    position_bias_share_A: +(aPicks / n).toFixed(3),
    by_role: Object.fromEntries(Object.entries(byRole).map(([r, v]) => [r, { n: v.n, agreement: +(v.agree / v.n).toFixed(3) }])),
    built_from: key.built_from, excluded_unstable: key.excluded_unstable,
    reading: p <= 0.5 + half ? 'not distinguishable from chance on this sample' : (key.owner_test_retest && p >= key.owner_test_retest ? 'at or above the owner\'s own test-retest agreement: as good as this kind of mark allows' : 'above chance, below the owner\'s own consistency'),
  };
  if (has('--out')) fs.writeFileSync(arg('--out'), JSON.stringify(Object.assign({ _role: 'judge_calibration', _note: 'How often the verifier\'s pairwise judge picks the line the brand owner kept over the one he cut, on pairs built from the pack\'s voice_calibration. Read against chance (0.5) and the owner\'s own test-retest agreement. Rebuild when the marks change or the judge changes.' }, result), null, 1));
  console.log(JSON.stringify(result, null, 1));
  process.exit(0);
}
die('pass --build <pairs.json> --key <key.json>, or --score <judgments.json> --key <key.json>');
