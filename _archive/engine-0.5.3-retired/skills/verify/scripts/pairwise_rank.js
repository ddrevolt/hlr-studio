#!/usr/bin/env node
/* pairwise_rank.js: turns pairwise judgments into verifier blocks and a rank (studio-engine 0.4.0).

   The judge (a fresh-context agent that saw only copy exhibits) returns one record per pair:
     {pair_id, winner: "A"|"B"|"tie", dimensions: {<dimension>: "A"|"B"|"tie"}, reason}
   This script maps A and B back to route ids through the signals file verify_packets.js wrote,
   reconciles mirrored pairs (the same pair judged with positions swapped: if the same POSITION wins
   both times the judge showed position bias and the pair is a tie), counts wins, losses and ties per
   route and per dimension, and ranks rankable routes by Copeland score (wins minus losses), then
   Bradley-Terry strength, then the deterministic checklist mean. It writes each packet back with its
   `verifier` block filled in the shape the board renders.

   Usage:
     node pairwise_rank.js --signals signals.json --judgments judgments.json --out-dir <folder>
                           [--judge "<who judged>"] [--independent true|false] [--pack <folder>]
   The judge's name and independence are facts about how the run was made; this script records what
   it is told and does not guess. --independent defaults to null (unknown), which the board shows.

   Output: {verdict, errors, warns, ranked: [{route_id, rank, copeland, bt}], written: [paths]}. */
'use strict';
const fs = require('fs'), path = require('path');
function arg(k, d) { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; }
function has(k) { return process.argv.indexOf(k) > 0; }
const die = m => { console.log(JSON.stringify({ errors: [m], warns: [], verdict: 'FAIL', ranked: [], written: [] }, null, 1)); console.error('pairwise_rank: ' + m); process.exit(2); };
const readJSON = p => JSON.parse(fs.readFileSync(p, 'utf8'));

let signals, judgments;
try { signals = readJSON(arg('--signals')); } catch (e) { die('cannot read --signals: ' + e.message); }
try { judgments = readJSON(arg('--judgments')); judgments = Array.isArray(judgments) ? judgments : (judgments.judgments || judgments.pairs || []); } catch (e) { die('cannot read --judgments: ' + e.message); }
const outDir = arg('--out-dir'); if (!outDir) die('pass --out-dir <folder> for the verified packets');
fs.mkdirSync(outDir, { recursive: true });
const dims = signals.dimensions || ['brief_adherence', 'voice_fit', 'distinctiveness'];
const pairMap = new Map((signals.pair_map || []).map(p => [p.pair_id, p]));
const errors = [], warns = [];

// -------------------------------------------------- reconcile mirrors, tally
const byPair = new Map(); judgments.forEach(j => { if (j && j.pair_id) byPair.set(j.pair_id, j); });
const games = {}; // route -> dim -> {w,l,t}
const ensure = (r, d) => { games[r] = games[r] || {}; games[r][d] = games[r][d] || { wins: 0, losses: 0, ties: 0 }; return games[r][d]; };
const ALL = '__overall__';
const seenBase = new Set(); let judged = 0, missing = 0, biased = 0;
function outcome(j, dim) {
  const w = dim === ALL ? j.winner : (j.dimensions || {})[dim];
  return w === 'A' || w === 'B' || w === 'tie' ? w : null;
}
function toRoute(pm, pos) { return pos === 'A' ? pm.a : pos === 'B' ? pm.b : null; }
for (const [pid, pm] of pairMap) {
  if (pm.mirror_of) continue;                       // handled with its base pair
  const base = byPair.get(pid); const mirror = [...pairMap.values()].find(x => x.mirror_of === pid); const mj = mirror ? byPair.get(mirror.pair_id) : null;
  if (!base) { missing++; continue; }
  judged++; seenBase.add(pid);
  for (const dim of [ALL, ...dims]) {
    let winnerRoute = null, tie = false;
    const o = outcome(base, dim); if (o === null) { warns.push(pid + ': no verdict for ' + (dim === ALL ? 'winner' : dim)); continue; }
    if (o === 'tie') tie = true; else winnerRoute = toRoute(pm, o);
    if (mirror && mj) {
      const om = outcome(mj, dim);
      if (om && om !== 'tie' && o !== 'tie') {
        const mirrorWinner = toRoute(mirror, om);
        if (mirrorWinner !== winnerRoute) { tie = true; winnerRoute = null; if (dim === ALL) biased++; }  // same position won twice: position bias
      } else if (om === 'tie' || o === 'tie') { tie = true; winnerRoute = null; }
    }
    const a = ensure(pm.a, dim), b = ensure(pm.b, dim);
    if (tie) { a.ties++; b.ties++; } else if (winnerRoute === pm.a) { a.wins++; b.losses++; } else if (winnerRoute === pm.b) { b.wins++; a.losses++; }
  }
}
if (!judged) die('no judgment matched a pair in the signals file; the judge output and the pair list do not belong to the same run');

// -------------------------------------------------- Bradley-Terry strength (overall), small n
const rankable = (signals.packets || []).filter(p => p.rankable).map(p => p.route_id);
function bradleyTerry(routes) {
  const s = {}; routes.forEach(r => (s[r] = 1));
  const wins = {}; routes.forEach(r => (wins[r] = {}));
  for (const pm of pairMap.values()) { if (pm.mirror_of) continue; const j = byPair.get(pm.pair_id); if (!j) continue; const o = outcome(j, ALL); if (o === 'A') wins[pm.a][pm.b] = (wins[pm.a][pm.b] || 0) + 1; else if (o === 'B') wins[pm.b][pm.a] = (wins[pm.b][pm.a] || 0) + 1; else if (o === 'tie') { wins[pm.a][pm.b] = (wins[pm.a][pm.b] || 0) + 0.5; wins[pm.b][pm.a] = (wins[pm.b][pm.a] || 0) + 0.5; } }
  for (let it = 0; it < 200; it++) {
    const next = {};
    for (const i of routes) {
      let num = 0, den = 0;
      for (const j of routes) { if (i === j) continue; const wij = wins[i][j] || 0, wji = wins[j][i] || 0, n = wij + wji; if (!n) continue; num += wij; den += n / (s[i] + s[j]); }
      next[i] = den ? Math.max(1e-6, num / den) : s[i];
    }
    const norm = routes.reduce((a, r) => a + next[r], 0) / routes.length || 1; routes.forEach(r => (s[r] = next[r] / norm));
  }
  return s;
}
const bt = bradleyTerry(rankable);
const checklistMean = r => { const p = (signals.packets || []).find(x => x.route_id === r); if (!p) return 0; const vals = Object.values(p.signals || {}).map(s => s && s.checklist_mean).filter(v => typeof v === 'number'); return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0; };
const copeland = r => { const g = (games[r] || {})[ALL] || { wins: 0, losses: 0, ties: 0 }; return g.wins - g.losses; };
const order = [...rankable].sort((x, y) => (copeland(y) - copeland(x)) || ((bt[y] || 0) - (bt[x] || 0)) || (checklistMean(y) - checklistMean(x)));
const rankOf = {}; order.forEach((r, i) => (rankOf[r] = i + 1));

// -------------------------------------------------- calibration reference, if the pack carries one
let calibration = null;
if (has('--pack')) {
  try {
    const pack = require(path.join(__dirname, '..', '..', '..', 'lib', 'pack.js'));
    const ctx = pack.resolveContext(process.argv); const r = ctx ? pack.resolveRole(ctx, 'judge_calibration') : null;
    if (r) { const c = readJSON(r); calibration = { agreement_with_owner: c.agreement, n_pairs: c.n_pairs, owner_test_retest: c.owner_test_retest, chance: 0.5, judged_by: c.judge, at: c.judged_at }; }
    else if (r === false) warns.push('judge_calibration is named in the File map and not on disk');
    else warns.push('no judge_calibration in the pack: the rank below has never been checked against the brand owner');
  } catch (e) { warns.push('pack not read for calibration: ' + e.message); }
}

// -------------------------------------------------- write verifier blocks
const judge = arg('--judge', null); const indep = has('--independent') ? arg('--independent') === 'true' : null;
const written = [], ranked = [];
for (const p of signals.packets || []) {
  let doc; try { doc = readJSON(p.path); } catch (e) { errors.push(p.route_id + ': packet unreadable (' + e.message + ')'); continue; }
  const g = games[p.route_id] || {}; const scores = {};
  for (const dim of dims) {
    const x = g[dim] || { wins: 0, losses: 0, ties: 0 }; const n = x.wins + x.losses + x.ties;
    scores[dim] = { score: n ? +((x.wins + 0.5 * x.ties) / n).toFixed(3) : 0, pass: p.rankable, note: p.rankable ? ('pairwise win share ' + x.wins + 'W ' + x.losses + 'L ' + x.ties + 'T of ' + n + (n ? '' : '; not judged')) : ('not ranked: ' + p.reasons.join('; ')), wins: x.wins, losses: x.losses, ties: x.ties };
  }
  scores.hard_gates = { score: p.rankable ? 1 : 0, pass: !p.hard_fail, note: p.hard_fail ? p.reasons.join('; ') : (p.pending_human ? p.pending_human + ' item(s) wait for a human (INSUFFICIENT-INPUT), ranked on copy' : 'schema, lint verdicts and fingerprints all pass') };
  doc.verifier = {
    scores, rank: p.rankable ? rankOf[p.route_id] || null : null, unknown: p.unknown || [],
    verified_by: 'verify 0.4.0: pairwise' + (judge ? ', judged by ' + judge : '') + (signals.mirror ? ', mirrored pairs' : ''),
    verified_at: new Date().toISOString(), independent: indep,
    method: { aggregation: 'Copeland (wins minus losses), Bradley-Terry strength, then checklist mean', copeland: p.rankable ? copeland(p.route_id) : null, bradley_terry: p.rankable ? +(bt[p.route_id] || 0).toFixed(3) : null, pairs_judged: judged, pairs_missing: missing, position_bias_ties: biased, signals: p.signals },
    calibration,
  };
  const outPath = path.join(outDir, path.basename(p.path));
  fs.writeFileSync(outPath, JSON.stringify(doc, null, 1)); written.push(outPath);
  ranked.push({ route_id: p.route_id, rank: doc.verifier.rank, copeland: doc.verifier.method.copeland, bt: doc.verifier.method.bradley_terry, rankable: p.rankable });
}
if (missing) warns.push(missing + ' pair(s) had no judgment; their games are not counted');
if (biased) warns.push(biased + ' pair(s) showed position bias (the same position won when swapped) and were counted as ties');
if (!calibration) warns.push('this rank carries no calibration number; run judge_calibration.js so the board can say how often this judge agrees with the brand owner');
const verdict = errors.length ? 'FAIL' : (rankable.length >= 2 ? 'PASS' : 'INSUFFICIENT-INPUT');
console.log(JSON.stringify({ verdict, errors, warns, ranked: ranked.sort((a, b) => (a.rank || 99) - (b.rank || 99)), written, judged, missing, position_bias_ties: biased }, null, 1));
process.exit(verdict === 'FAIL' ? 2 : 0);
