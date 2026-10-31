#!/usr/bin/env node
/* verify_packets.js: the deterministic half of the verifier (studio-engine 0.5.1).

   Reads route packets (options-board/references/packet-schema.json), applies the hard gates a
   human never has to re-check (schema, lint verdicts, fingerprints, completion), computes the
   deterministic taste signals the pairwise judge is NOT trusted with, and writes the pair list
   the judge will see: copy exhibits only, never a worker transcript, never a lint verdict, never
   a route id. It scores nothing itself. A packet with a FAIL lint is not rankable and says why.

   Usage:
     node verify_packets.js --packets r1.packet.json,r2.packet.json[,...] --pack <folder>
                            [--out signals.json] [--pairs pairs.json] [--mirror] [--exhibit-lines 3]
                            [--dimensions brief_adherence,voice_fit,distinctiveness] [--seed 7]
   --brand-context <file> and --brand <name> work as on every other script.

   Output (stdout and --out): {verdict, errors, warns, dimensions, packets: [{route_id, rankable,
   hard_fail, reasons, pending_human, fingerprints, signals, unknown}], pairs: n, pairs_path}.
   Verdict: PASS (every packet rankable), INSUFFICIENT-INPUT (some packet not rankable or fewer
   than two rankable), FAIL (the run could not start). */
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
function arg(k, d) { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; }
function has(k) { return process.argv.indexOf(k) > 0; }
function sharedLib(name) {
  const cands = [path.join(__dirname, '..', '..', '..', 'lib', name)];
  if (process.env.CLAUDE_PLUGIN_ROOT) cands.push(path.join(process.env.CLAUDE_PLUGIN_ROOT, 'lib', name));
  for (const c of cands) if (fs.existsSync(c)) return require(c);
  console.log(JSON.stringify({ errors: ['shared module lib/' + name + ' not found'], warns: [], verdict: 'FAIL', packets: [] }, null, 1));
  process.exit(2);
}
const pack = sharedLib('pack.js');
const schemaLib = sharedLib('schema.js');
const die = m => {
  console.log(JSON.stringify({ errors: [m], warns: [], verdict: 'FAIL', packets: [] }, null, 1));
  console.error('verify_packets: ' + m + '\n  Nothing was checked, so this is not a clean run: it is a run that could not start.');
  process.exit(2);
};
const readJSON = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const resolveFrom = (base, p) => (p && !path.isAbsolute(p) ? path.resolve(path.dirname(base), p) : p);

// ------------------------------------------------------------------ inputs
const packetPaths = (arg('--packets', '') || '').split(',').map(s => s.trim()).filter(Boolean);
if (!packetPaths.length) die('pass --packets a.packet.json,b.packet.json (two or more route packets)');
let CTX = null; try { CTX = pack.resolveContext(process.argv); } catch (e) { die(e.message); }
const DIMENSIONS = (arg('--dimensions', 'brief_adherence,voice_fit,distinctiveness')).split(',').map(s => s.trim()).filter(Boolean);
const EXHIBIT_LINES = parseInt(arg('--exhibit-lines', '3'), 10) || 3;
const MIRROR = has('--mirror');
let seed = parseInt(arg('--seed', '7'), 10) || 7;
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

let schema = null;
{
  const cands = [path.join(__dirname, '..', '..', 'options-board', 'references', 'packet-schema.json')];
  if (process.env.CLAUDE_PLUGIN_ROOT) cands.push(path.join(process.env.CLAUDE_PLUGIN_ROOT, 'skills', 'options-board', 'references', 'packet-schema.json'));
  for (const c of cands) if (fs.existsSync(c)) { schema = readJSON(c); break; }
  if (!schema) die('packet-schema.json not found beside options-board; the verifier cannot validate what it did not define');
}

// favorites, for the echo signal (a route that parrots the brand owner's own keeps is not new copy)
let favorites = [];
if (CTX) {
  const r = pack.resolveRole(CTX, 'favorites');
  if (r) { try { favorites = (readJSON(r).favorites || []).map(f => f.text); } catch (e) { /* signal degrades, said below */ } }
}
const words = t => (t || '').toLowerCase().replace(/[^a-z0-9$+' ]/g, ' ').split(/\s+/).filter(Boolean);
const grams = (t, n) => { const w = words(t); const out = new Set(); for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(' ')); return out; };
// product families, for the family-named signal: the pack's own (concrete_lexicon.product_families), never the engine's
let families = [], familiesNote = 'no pack resolved';
if (CTX) {
  const lr = pack.resolveRole(CTX, 'concrete_lexicon');
  if (lr === false) die('the brand context names concrete_lexicon "' + CTX.fileMap.concrete_lexicon + '" and it is not beside it. Fix the File map rather than dropping the role.');
  if (lr) {
    try { families = (readJSON(lr).product_families || []).filter(f => typeof f === 'string' && f.trim()); }
    catch (e) { die('concrete_lexicon "' + lr + '" will not load (' + e.message + '). Fix it rather than dropping it.'); }
    familiesNote = families.length ? null : 'the pack\'s concrete_lexicon names no product family';
  } else familiesNote = 'concrete_lexicon is null in the File map';
}
const escapeRe = x => String(x).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const famRes = families.map(f => new RegExp('(?<![a-z0-9])' + f.trim().split(/\s+/).map(escapeRe).join('\\s+') + '(?:e?s)?(?![a-z0-9])', 'i'));
// a 5-gram that only repeats a product family's own name is not an echo of the owner's keeps
const famWindows = families.flatMap(f => { const w = words(f); const k = Math.min(3, w.length); const o = []; for (let i = 0; i + k <= w.length; i++) o.push(w.slice(i, i + k).join(' ')); return o; });
const fav5 = new Set(); favorites.forEach(t => grams(t, 5).forEach(g => { if (!famWindows.some(fw => (' ' + g + ' ').includes(' ' + fw + ' '))) fav5.add(g); }));

// ------------------------------------------------------------------ copy readers
function emailStrings(doc) {
  const g = doc.gates || {}; const out = { subject: [], hero_head: [], hero_body: [], offer: [], cta: [], preheader: [] }; const opts = [];
  (g.subject || []).forEach(o => { out.subject.push(o.copy); opts.push(o); });
  (g.hero || []).forEach(o => { out.hero_head.push(o.copy); if (o.copy2) out.hero_body.push(o.copy2); opts.push(o); });
  (g.offer || []).forEach(o => { out.offer.push(o.copy); opts.push(o); });
  (g.cta || []).forEach(o => { out.cta.push(o.copy); opts.push(o); });
  ((doc.envelope || {}).preheader || []).forEach(p => out.preheader.push(typeof p === 'string' ? p : p.copy));
  return { groups: out, options: opts };
}
function paidStrings(doc) {
  const out = { hook: [], headline: [], primary_text: [], description: [] }; const opts = [];
  (((doc.gates || {}).copy) || []).forEach(e => { if (e.on_image) out.hook.push(e.on_image); if (e.headline) out.headline.push(e.headline); if (e.primary_text) out.primary_text.push(e.primary_text); if (e.description) out.description.push(e.description); opts.push(e); });
  return { groups: out, options: opts };
}
function socialStrings(doc) {
  const g = doc.gates || {}; const out = { cover: [], caption: [], panels: [] }; const opts = [];
  (g.cover || []).forEach(o => { if (o && o.copy) { out.cover.push(o.copy); opts.push(o); } });
  (g.caption || []).forEach(o => { if (o && o.copy) { out.caption.push(o.copy); opts.push(o); } });
  (g.sequence || []).forEach(e => Object.values((e && e.slots) || {}).forEach(v => (Array.isArray(v) ? v : [v]).forEach(x => { if (typeof x === 'string' && x.trim()) out.panels.push(x); })));
  return { groups: out, options: opts };
}
function webStrings(doc) {
  const out = { hero: [], sections: [] }; const opts = [];
  const walk = (node, depth) => {
    if (!node || depth > 4) return;
    if (typeof node === 'string') return;
    if (Array.isArray(node)) return node.forEach(n => walk(n, depth + 1));
    if (node.copy && typeof node.copy === 'string') { (node.slot && /hero/i.test(String(node.slot)) ? out.hero : out.sections).push(node.copy); opts.push(node); }
    Object.values(node).forEach(v => walk(v, depth + 1));
  };
  walk(doc.sections || doc.modules || doc, 0);
  return { groups: out, options: opts };
}

function signalsFor(strings, options, brief) {
  const all = Object.values(strings).flat().filter(Boolean);
  const n = all.length || 1;
  const ck = options.map(o => o.checklist).filter(c => c && typeof c === 'object').map(c => { const v = Object.values(c).filter(x => x === true || x === false); return v.length ? v.filter(Boolean).length / v.length : null; }).filter(x => x !== null);
  const registers = new Set(options.map(o => o.register).filter(Boolean));
  const mandated = new Set([...(brief && brief.must_say || []), ...(brief && brief.guidance && brief.guidance.vocabulary || [])].flatMap(s => words(String(s))));
  let mand = 0, tot = 0; all.forEach(t => words(t).forEach(w => { tot++; if (mandated.has(w)) mand++; }));
  let echo = 0; all.forEach(t => { const g = grams(t, 5); let c = 0; g.forEach(x => { if (fav5.has(x)) c++; }); if (c > echo) echo = c; });
  return {
    lines: all.length,
    checklist_mean: ck.length ? +(ck.reduce((a, b) => a + b, 0) / ck.length).toFixed(3) : null,
    register_spread: registers.size, registers: [...registers],
    family_named_rate: famRes.length ? +(all.filter(t => famRes.some(r => r.test(t))).length / n).toFixed(3) : null,
    question_rate: +(all.filter(t => /\?/.test(t)).length / n).toFixed(3),
    bare_exclamation_rate: +(all.filter(t => /!\s*$/.test(t.trim()) && words(t).length <= 3).length / n).toFixed(3),
    mandated_word_share: tot ? +(mand / tot).toFixed(3) : null,
    favorites_echo_max_5grams: favorites.length ? echo : null,
  };
}

// ------------------------------------------------------------------ packets
const errors = [], warns = [], out = [];
for (const pp of packetPaths) {
  let doc; try { doc = readJSON(pp); } catch (e) { errors.push(pp + ': cannot read (' + e.message + ')'); continue; }
  const rec = { route_id: doc.route_id || path.basename(pp), path: pp, rankable: true, hard_fail: false, reasons: [], pending_human: 0, fingerprints: [], signals: {}, exhibits: {}, unknown: [] };
  const v = schemaLib.validate(schema, doc);
  if (v && v.errors && v.errors.length) { rec.rankable = false; rec.hard_fail = true; rec.reasons.push('packet fails packet-schema: ' + v.errors.slice(0, 3).join('; ')); }
  const dels = Array.isArray(doc.channel_deliverables) ? doc.channel_deliverables : [];
  let anyRender = false;
  for (const d of dels) {
    const verdict = d.lint && d.lint.verdict;
    if (verdict === 'FAIL') { rec.rankable = false; rec.hard_fail = true; rec.reasons.push(d.surface + ': lint FAIL (a rule was broken; nothing here is ranked until it is fixed)'); }
    if (verdict == null) { rec.rankable = false; rec.reasons.push(d.surface + ': no lint verdict; an unlinted deliverable cannot be ranked'); }
    const copyPath = resolveFrom(pp, d.copy && d.copy.path); const lintPath = resolveFrom(pp, d.lint && d.lint.path);
    if (copyPath && lintPath && fs.existsSync(copyPath) && fs.existsSync(lintPath)) {
      try {
        const lint = readJSON(lintPath); const want = lint.checked && (lint.checked.slate_sha256 || lint.checked.sha256);
        const got = sha(copyPath); const ok = want ? want === got : null;
        rec.fingerprints.push({ surface: d.surface, ok, note: ok === null ? 'lint report carries no fingerprint' : ok ? 'lint report matches the copy bytes' : 'lint report does not match the copy bytes: the copy was edited after it was linted' });
        if (ok === false) { rec.rankable = false; rec.hard_fail = true; rec.reasons.push(d.surface + ': fingerprint mismatch'); }
        if (verdict === 'INSUFFICIENT-INPUT') rec.pending_human += (lint.needs_human_signoff || []).length || 1;
      } catch (e) { warns.push(rec.route_id + ' ' + d.surface + ': lint report unreadable (' + e.message + ')'); }
    } else if (verdict === 'INSUFFICIENT-INPUT') rec.pending_human += 1;
    /* Signals and exhibits are kept per surface, so the first deliverable on a surface is the one
       judged; a second one on the same surface is named, never silently dropped. */
    if (rec.signals[d.surface]) {
      warns.push(rec.route_id + ': a second ' + d.surface + ' deliverable' + (d.name ? ' (' + d.name + ')' : '') + ' is not judged; signals and exhibits are kept per surface, so only the first ' + d.surface + ' deliverable is compared. Develop one per route, or one per packet.');
      continue;
    }
    if (copyPath && fs.existsSync(copyPath)) {
      try {
        const cdoc = readJSON(copyPath);
        const read = d.surface === 'email' ? emailStrings(cdoc) : d.surface === 'paid' ? paidStrings(cdoc) : d.surface === 'social' ? socialStrings(cdoc) : webStrings(cdoc);
        rec.signals[d.surface] = signalsFor(read.groups, read.options, cdoc.brief);
        if (d.voice_lint && typeof d.voice_lint.mean_likelihood === 'number') rec.signals[d.surface].voice_lint_mean = d.voice_lint.mean_likelihood;
        const ex = {}; Object.entries(read.groups).forEach(([k, arr]) => { if (arr.length) ex[k] = arr.slice(0, EXHIBIT_LINES); });
        rec.exhibits[d.surface] = ex;
      } catch (e) { warns.push(rec.route_id + ' ' + d.surface + ': copy file unreadable (' + e.message + '); no signals, no exhibits'); }
    } else { warns.push(rec.route_id + ' ' + d.surface + ': copy path missing; the judge will not see this surface'); }
    if ((d.renders || []).some(r => r && r.path && !r.placeholder)) anyRender = true;
  }
  if (!anyRender) rec.unknown.push('visual_legibility');
  if (!dels.some(d => d.image_plan && d.image_plan.pack_composite && d.image_plan.pack_composite.file)) rec.unknown.push('pack_fidelity');
  if (doc.completion && doc.completion.verdict !== 'PASS') rec.reasons.push('completion ' + (doc.completion.verdict || 'unknown') + ' (ranked on copy only; the board shows what is missing)');
  if (!Object.keys(rec.exhibits).length && rec.rankable) { rec.rankable = false; rec.reasons.push('no readable copy: nothing for a judge to compare'); }
  out.push(rec);
}
if (!favorites.length) warns.push('favorites: none resolved from the pack, so favorites_echo is null; a route that parrots the brand owner\'s keeps would not be flagged');
if (familiesNote) warns.push('product families: ' + familiesNote + ', so family_named_rate is null; the engine names no product family of its own');

// ------------------------------------------------------------------ pairs
const rankable = out.filter(r => r.rankable);
const pairs = [];
for (let i = 0; i < rankable.length; i++) for (let j = i + 1; j < rankable.length; j++) {
  const flip = rnd() < 0.5; const a = flip ? rankable[j] : rankable[i]; const b = flip ? rankable[i] : rankable[j];
  const id = 'P' + String(pairs.length + 1).padStart(3, '0');
  pairs.push({ pair_id: id, A: a.exhibits, B: b.exhibits, _a: a.route_id, _b: b.route_id, mirror_of: null });
  if (MIRROR) pairs.push({ pair_id: id + 'm', A: b.exhibits, B: a.exhibits, _a: b.route_id, _b: a.route_id, mirror_of: id });
}
const pairsPath = arg('--pairs', null);
if (pairsPath) {
  // The judge file carries exhibits only; the mapping back to routes lives in the signals file.
  fs.writeFileSync(pairsPath, JSON.stringify({ dimensions: DIMENSIONS, note: 'Copy exhibits only. No route ids, no lint verdicts, no transcripts. Judge each pair on the rubric and return {pair_id, winner, dimensions, reason}.', pairs: pairs.map(p => ({ pair_id: p.pair_id, A: p.A, B: p.B })) }, null, 1));
}
const verdict = errors.length ? 'FAIL' : (rankable.length >= 2 && rankable.length === out.length) ? 'PASS' : 'INSUFFICIENT-INPUT';
if (rankable.length < 2 && !errors.length) warns.push('fewer than two rankable packets: nothing to compare, so no rank will exist and the board will say unranked');
const result = { verdict, errors, warns, dimensions: DIMENSIONS, mirror: MIRROR, exhibit_lines: EXHIBIT_LINES,
  packets: out.map(r => ({ route_id: r.route_id, path: r.path, rankable: r.rankable, hard_fail: r.hard_fail, reasons: r.reasons, pending_human: r.pending_human, fingerprints: r.fingerprints, signals: r.signals, unknown: r.unknown })),
  pairs: pairs.length, pairs_path: pairsPath, pair_map: pairs.map(p => ({ pair_id: p.pair_id, a: p._a, b: p._b, mirror_of: p.mirror_of })),
  pack: CTX ? CTX.brandContextPath || null : null, generated_at: new Date().toISOString() };
const text = JSON.stringify(result, null, 1);
if (has('--out')) fs.writeFileSync(arg('--out'), text);
console.log(text);
process.exit(verdict === 'FAIL' ? 2 : verdict === 'INSUFFICIENT-INPUT' ? 1 : 0);
