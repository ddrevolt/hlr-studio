#!/usr/bin/env node
/* social_lint.js: deterministic gate for an organic post (feed post, carousel, story set). Fix every
   ERROR and re-run until clean.

   FAILS CLOSED on its inputs, as the email and paid lints do: a missing prohibited-territory list, an
   unreadable brand context and an unusable ledger are ERRORs, never silent passes. On top of the
   shared claims checks it checks what is particular to an organic post:

   SHAPE. The post format decides the gates and the sequence. A carousel runs cover, inner panels,
   end, inside the platform's range and the brief's count; a story set runs frames, each one
   structure; a feed post is one entry. A gate missing with a declared reason is INSUFFICIENT-INPUT;
   a gate missing with no reason is an ERROR.

   CAPTIONS. A caption over the platform's ceiling, too many hashtags and a carousel outside the
   platform's range are ERRORs. A first line that runs past the fold, a must-say at or across the
   fold, a pasted URL or bare domain (it does not click) and two captions that read the same before
   the fold are WARNs. The fold is the platform's visible count, line breaks and spaces included.
   Every platform number follows its confidence in references/organic-specs.json: a
   breach is an ERROR when the number is agreed and a WARN when it is contested or approximate.
   Platform numbers come from that file, never from here.

   SLOTS. Panel and frame copy is checked against the brand's social slot map (pack role
   slotmap_social) through the declared `module`. No slot map, or no declared module, reads OFF with
   the reason. A module the map does not stamp, a key that maps to no stamped slot, a key that
   belongs to another panel or frame, and a slot map the File map names and cannot find are ERRORs.
   A slot with no measured budget needs a human's sign-off (INSUFFICIENT-INPUT); no budget is
   invented.

   COPY IS A STRING. Option copy and slot values that are not strings are ERRORs, never coerced: a
   coerced object reads "[object Object]", which no claims rule matches.

   Usage:
     node social_lint.js --slate post.social.json --pack <brand pack folder>
                         [--facts facts.json] [--ledger ledger.json] [--prohibited list.json]
                         [--specs organic-specs.json] [--gates gate-data.json] [--slotmap-social file.yaml]
     --brand-context <brand-context.md> still works and wins over --pack; --brand <name|alias>
     resolves through brands/registry.yaml. The claims ledger is compiled by lib/claims.js, shared
     with the email, paid and web lints.

   Exit 0 PASS or WARN · 1 FAIL or INSUFFICIENT-INPUT · 2 could not start. */
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
function arg(k, d) { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; }
function has(k) { return process.argv.indexOf(k) > 0; }

const errors = [], warns = [], needsSignoff = [], insufficient = [];
const kindOf = v => (v === null ? 'null' : Array.isArray(v) ? 'an array' : typeof v === 'object' ? 'an object' : 'a ' + typeof v);
function sharedLib(name) {
  const cands = [path.join(__dirname, '..', '..', '..', 'lib', name)];
  if (process.env.CLAUDE_PLUGIN_ROOT) cands.push(path.join(process.env.CLAUDE_PLUGIN_ROOT, 'lib', name));
  for (const c of cands) if (fs.existsSync(c)) return require(c);
  console.log(JSON.stringify({ errors: ['shared module lib/' + name + ' not found'], warns: [],
                               needs_human_signoff: [], insufficient_input: [], verdict: 'FAIL', checked: {} }, null, 1));
  console.error('social_lint: the shared module lib/' + name + ' is not beside this plugin (looked in ' + cands.join(', ') + ').');
  process.exit(2);
}
const pack = sharedLib('pack.js');
const claims = sharedLib('claims.js');
const provenance = sharedLib('provenance.js');
const die = m => {
  console.log(JSON.stringify({ errors: [m], warns: [], needs_human_signoff: [],
                               insufficient_input: [], verdict: 'FAIL', checked: {} }, null, 1));
  console.error('social_lint: ' + m + '\n  Nothing was checked, so this is not a clean run: it is a run that could not start.');
  process.exit(2);
};

// ---------------------------------------------------------------- inputs
let slate, slateSha = null;
try {
  const raw = fs.readFileSync(arg('--slate'));
  slate = JSON.parse(raw.toString('utf8'));
  slateSha = crypto.createHash('sha256').update(raw).digest('hex');
} catch (e) { die('cannot read --slate: ' + e.message); }
if (!slate || typeof slate !== 'object' || Array.isArray(slate)) die('--slate is not a JSON object');

const REF = p => path.join(__dirname, '..', 'references', p);
let specs, gateData;
try { specs = JSON.parse(fs.readFileSync(arg('--specs', REF('organic-specs.json')), 'utf8')); }
catch (e) { die('cannot read the organic specs (' + e.message + '); captions would be checked against no ceiling at all'); }
try { gateData = JSON.parse(fs.readFileSync(arg('--gates', REF('gate-data.json')), 'utf8')); }
catch (e) { die('cannot read the gate data (' + e.message + ')'); }
const GM = gateData.GATE_META || {}, FORMATS = gateData.FORMATS || {};

let facts = { allowed_figures: [] };
if (has('--facts')) {
  try { facts = JSON.parse(fs.readFileSync(arg('--facts'), 'utf8')); }
  catch (e) { die('--facts given but unreadable (' + e.message + '); refusing to lint figures against nothing'); }
} else {
  warns.push('input: no --facts supplied; every figure in the copy is treated as unverified');
}
if (!facts || typeof facts !== 'object' || Array.isArray(facts)) die('--facts is ' + kindOf(facts) + ', not a JSON object with an `allowed_figures` array');
if (facts.allowed_figures != null && !Array.isArray(facts.allowed_figures)) {
  die('--facts: `allowed_figures` is ' + kindOf(facts.allowed_figures) + ', not an array; refusing to lint figures against a list it cannot read');
}

let CTX = null;
try { CTX = pack.resolveContext(process.argv); } catch (e) { die(e.message); }
const brandContextPath = CTX ? CTX.brandContextPath : null;
const fileMap = CTX ? (CTX.fileMap || {}) : {};

/* Prohibited territories are brand content: resolved, never hardcoded. */
let prohibitedPatterns = null, prohibitedSource = null;
if (has('--prohibited')) {
  try {
    const j = JSON.parse(fs.readFileSync(arg('--prohibited'), 'utf8'));
    prohibitedPatterns = Array.isArray(j) ? j : j.prohibited_patterns;
    prohibitedSource = arg('--prohibited');
  } catch (e) { die('--prohibited unreadable: ' + e.message); }
} else if (CTX) {
  prohibitedPatterns = fileMap.prohibited_patterns;
  prohibitedSource = brandContextPath;
}
if (!Array.isArray(prohibitedPatterns) || !prohibitedPatterns.length) {
  die('no prohibited-territory list resolved. Supply --pack <folder> (or --brand-context <brand-context.md>) '
    + 'whose File map carries "prohibited_patterns", or --prohibited <list.json>. Refusing to lint: passing '
    + 'here would certify a post against no claims rules at all.');
}
let PROHIBITED;
try { PROHIBITED = new RegExp('(' + prohibitedPatterns.join('|') + ')', 'i'); }
catch (e) { die('prohibited_patterns do not compile as a regex: ' + e.message); }

/* The claims ledger: the same file every channel reads. A claim prohibited in an email is
   prohibited in a caption. */
let ledger = null, ledgerSource = null, ledgerStatus = null;
function loadLedger(p) {
  const abs = path.isAbsolute(p) ? p : path.join(CTX ? CTX.packDir : '.', p);
  ledger = JSON.parse(fs.readFileSync(abs, 'utf8'));
  ledgerSource = abs;
}
if (has('--ledger')) {
  try { loadLedger(arg('--ledger')); } catch (e) { die('--ledger unreadable: ' + e.message); }
} else if (fileMap.legal_ledger) {
  try { loadLedger(fileMap.legal_ledger); } catch (e) { die('brand context names a legal_ledger that will not load: ' + e.message); }
}
let LEDGER_RULES = [], LEDGER = null;
if (ledger) {
  try { LEDGER = claims.compileLedger(ledger); } catch (e) { die(e.message); }
  ledgerStatus = LEDGER.status;
  LEDGER_RULES = LEDGER.rules;
}
const ledgerHits = claims.makeHitCounter();

// ---------------------------------------------------------------- figures (unit-aware)
const byUnit = new Map(), bare = new Set();
const normUnit = u => {
  const s = String(u || '').toLowerCase().replace(/[^a-z%]/g, '');
  if (!s) return '';
  if (/^(g|gram|grams)$/.test(s)) return 'g';
  if (/^(mg|milligram|milligrams)$/.test(s)) return 'mg';
  if (/^(cal|cals|calorie|calories|kcal)$/.test(s)) return 'cal';
  if (s === '%' || s === 'percent' || s === 'pct') return '%';
  return s;
};
let unitAware = false;
(facts.allowed_figures || []).forEach(f => {
  if (f && typeof f === 'object' && f.value != null) {
    unitAware = true;
    const u = normUnit(f.unit);
    if (!byUnit.has(u)) byUnit.set(u, new Set());
    byUnit.get(u).add(String(f.value));
    bare.add(String(f.value));
  } else { bare.add(String(f)); }
});
let briefFigures = [];
if (slate.brief_figures != null) {
  if (Array.isArray(slate.brief_figures)) briefFigures = slate.brief_figures;
  else errors.push('brief_figures is ' + kindOf(slate.brief_figures) + ', not an array of strings; none of its figures were admitted');
}
briefFigures.map(String).forEach(s => (s.match(/\d+(?:\.\d+)?/g) || []).forEach(n => bare.add(n)));

const FIGURE = /(\d+(?:\.\d+)?)\s?(g\b|grams?|cal(?:ories)?\b|%|mg\b|x\b|×|star|servings?|minutes?|hours?|days?|weeks?|months?|years?)/gi;
const COMPARATIVE = /\b\d+(?:\.\d+)?\s?(?:x|times|%)\s+(?:the\s+)?(?:more|less|fewer|higher|lower|better)/i;
function checkFigures(where, t) {
  let m; FIGURE.lastIndex = 0;
  while ((m = FIGURE.exec(t)) !== null) {
    const num = m[1], unit = normUnit(m[2]);
    if (unitAware && byUnit.has(unit)) {
      if (!byUnit.get(unit).has(num)) errors.push(where + ': figure "' + m[0].trim() + '" not verified for unit "' + (unit || 'none') + '"');
    } else if (!bare.has(num)) {
      errors.push(where + ': figure "' + m[0].trim() + '" not in verified facts or brief');
    }
  }
  if (COMPARATIVE.test(t)) errors.push(where + ': comparative claim "' + (t.match(COMPARATIVE) || [])[0]
    + '": comparatives need substantiation against a named competitor set, not a product figure');
}

// ---------------------------------------------------------------- text checks
let stringsChecked = 0;
function checkText(where, text) {
  const t = String(text == null ? '' : text);
  if (!t.trim()) return;
  stringsChecked++;
  checkFigures(where, t);
  if (PROHIBITED.test(t)) errors.push(where + ': prohibited territory: "' + (t.match(PROHIBITED) || [])[0] + '"');
  for (const r of LEDGER_RULES) {
    const hit = claims.matchRule(r, t);
    if (!hit) continue;
    ledgerHits.note(r.id);
    const tag = r.paraphrase_risk ? claims.PARAPHRASE_TAG : '';
    if (r.status === 'prohibited') {
      errors.push(where + ': ledger ' + r.id + ' prohibits "' + hit + '" (' + r.topic + ')' + (r.note ? ': ' + r.note : '') + tag);
    } else if (r.status === 'conditional') {
      const satisfied = claims.requiredLanguageSatisfied(r, t);
      if (satisfied === false) {
        errors.push(where + ': ledger ' + r.id + ' allows "' + hit + '" only with the required language ('
          + JSON.stringify(r.required_language) + '); it is not present' + tag);
      } else {
        needsSignoff.push(where + ': ledger ' + r.id + ' (' + r.topic + ') conditional on "' + hit + '": '
          + (r.requires || 'see the ledger') + '  [no machine-checkable required_language; a human must confirm and record it]' + tag);
      }
    }
  }
  if (/\b[A-Z0-9]{4,}\d\b/.test(t) && !/\{\{/.test(t) && /code/i.test(t)) {
    errors.push(where + ': looks like a literal discount code (use the merge token)');
  }
}
const strings = v => (typeof v === 'string' ? [v] : (Array.isArray(v) ? v.flatMap(strings)
  : (v && typeof v === 'object' ? Object.values(v).flatMap(strings) : [])));
const normLine = s => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
/* A field that should hold copy: a string is checked; anything else is an ERROR and is not coerced. */
function textField(where, v) {
  if (v == null) return;
  if (typeof v === 'string') { checkText(where, v); return; }
  errors.push(where + ': is ' + kindOf(v) + ', not a string; it was not checked, and copy nobody checked cannot ship');
}
/* A slot value: a string, or an array of strings for a slot that sets a list. */
function slotStrings(where, v) {
  if (typeof v === 'string') return [v];
  if (Array.isArray(v) && v.every(x => typeof x === 'string')) return v;
  errors.push(where + ': is ' + kindOf(v) + '; a slot takes a string (or an array of strings), so this was not checked');
  return [];
}
/* A platform number errors only when its sources agree; a contested or approximate one warns. */
const bySpec = (conf, msg) => ((conf === 'contested' || conf === 'approximate') ? warns : errors).push(msg + ' (' + (conf || 'agreed') + ')');

// ---------------------------------------------------------------- structure
for (const block of ['brief', 'provenance']) {
  const v = slate[block];
  if (!v || typeof v !== 'object' || !Object.keys(v).length) {
    errors.push('no `' + block + '` block: without it the output cannot be audited against what was asked for');
  }
}
const brief = (slate.brief && typeof slate.brief === 'object') ? slate.brief : {};
const pf = slate.post_format || brief.post_format || null;
const fmt = pf ? FORMATS[pf] : null;
if (!pf) errors.push('slate declares no `post_format` (' + Object.keys(FORMATS).join(', ') + '), so its gates and its sequence cannot be checked');
else if (!fmt) errors.push('post_format "' + pf + '" is not one of ' + Object.keys(FORMATS).join(', '));

if (slate.gates != null && (typeof slate.gates !== 'object' || Array.isArray(slate.gates))) errors.push('gates is ' + kindOf(slate.gates) + ', not an object keyed by gate (angle, cover, caption, sequence); nothing in it was read');
if (slate.module != null && typeof slate.module !== 'string') errors.push('module is ' + kindOf(slate.module) + ', not a master id string such as "S03"; panel and frame copy could not be matched to a master');
if (brief.must_say != null && !Array.isArray(brief.must_say)) errors.push('brief.must_say is ' + kindOf(brief.must_say) + ', not an array of strings; the must-say checks did not run');
const gates = (slate.gates && typeof slate.gates === 'object' && !Array.isArray(slate.gates)) ? slate.gates : {};
const noText = pf === 'feed_post' && slate.on_image === false;
const required = fmt ? fmt.gates.filter(g => !(noText && (g === 'cover' || g === 'sequence'))) : [];
const notRun = (slate.gates_not_run && typeof slate.gates_not_run === 'object') ? slate.gates_not_run : {};
const stage = slate.stage || (Object.keys(notRun).length ? null : 'copy');
const missing = required.filter(g => !(Array.isArray(gates[g]) && gates[g].length));
for (const g of missing) {
  if (notRun[g]) {
    insufficient.push('gate `' + g + '` was not run: ' + notRun[g] + '. The gates that did run were checked; '
      + 'this one was not, so the post is incomplete by design rather than clean.');
  } else if (stage === 'angle' && g !== 'angle') {
    insufficient.push('this post is at the ANGLE stage: `' + g + '` has not run because the workflow stops for a '
      + 'human to pick the angle. Everything present was checked; it is not a finished post and does not claim to be.');
  } else {
    errors.push('a ' + pf + ' requires gate `' + g + '` and this slate has none, with no reason declared. If it was '
      + 'deliberately not run, say so in `stage` or `gates_not_run` so the report can tell that apart from an omission.');
  }
}
if (noText && Array.isArray(gates.cover) && gates.cover.length) warns.push('on_image is false, yet the slate carries a cover gate; a post with no text on the image has no cover line to set');
if (noText && Array.isArray(gates.sequence) && gates.sequence.length) warns.push('on_image is false, yet the slate carries panel copy in gates.sequence; a post with no text on the image sets none of it');
if (pf === 'story_set' && Array.isArray(gates.caption) && gates.caption.length) {
  warns.push('gates.caption: a story set carries no caption, so these are posted nowhere; drop them or move the words into the frames');
}

// ---------------------------------------------------------------- grounding (optional for organic)
const pool = new Map();
for (const g of (Array.isArray(slate.grounding) ? slate.grounding : [])) if (g && g.id) pool.set(String(g.id), g);
function checkCited(where, ids) {
  if (!Array.isArray(ids) || !ids.length) return;
  if (!pool.size) { errors.push(where + ': cites grounding ' + JSON.stringify(ids) + ' and the slate carries no grounding pool'); return; }
  const unknown = ids.filter(i => !pool.has(String(i)));
  if (unknown.length) errors.push(where + ': grounded_in cites ' + JSON.stringify(unknown) + ', which are not in the grounding pool');
}
function checkVerbatim(where, o) {
  if (!o || typeof o !== 'object') return;
  if (o.verbatim_source != null) {
    if (!pool.has(String(o.verbatim_source))) errors.push(where + ': verbatim_source "' + o.verbatim_source + '" is not in the grounding pool; a customer\'s words on a post cite the item they came from');
  } else if (o.quote === true) {
    errors.push(where + ': marked as a quote with no `verbatim_source`; first-party copy dressed as a customer\'s words is the thing this blocks');
  }
}

// ---------------------------------------------------------------- the route frame
const selectedRoute = brief.selected_route && typeof brief.selected_route === 'object' ? brief.selected_route : null;
let angleInRoute = false;
if (selectedRoute) {
  const routeAxis = String(selectedRoute.axis || '').toLowerCase();
  const angles = Array.isArray(gates.angle) ? gates.angle : [];
  if (!routeAxis) errors.push('brief.selected_route names no axis, so the angle gate cannot be checked against the route\'s frame');
  if (angles.length) {
    angleInRoute = true;
    const scenes = [];
    angles.forEach((o, i) => {
      if (!o) return;
      if (routeAxis && String(o.axis || '').toLowerCase() !== routeAxis) errors.push('gates.angle[' + i + ']: axis "' + o.axis + '" leaves the pre-selected route\'s frame (' + selectedRoute.axis + '); under a route the options differ on scene or mechanism, not on axis');
      const sc = String(o.scene || o.mechanism || '').trim().toLowerCase();
      if (!sc) errors.push('gates.angle[' + i + ']: no `scene` (or `mechanism`); inside a route the options must differ on scene or mechanism, and that is unverifiable without it');
      else scenes.push(sc);
    });
    if (scenes.length && new Set(scenes).size < scenes.length) errors.push('gates.angle: ' + new Set(scenes).size + ' distinct scenes across ' + scenes.length + ' options; two options on one scene are one option written twice');
  }
}
const developed = ['cover', 'caption', 'sequence'].some(g => Array.isArray(gates[g]) && gates[g].length);
if (developed && Array.isArray(gates.angle) && gates.angle.length) {
  const ag = slate.angle_gate && typeof slate.angle_gate === 'object' ? slate.angle_gate : null;
  if (!ag || !ag.picked_by) errors.push('angle_gate: copy was developed and the slate does not say who picked the angle (angle_gate.picked_by: "human", or "recommended" with provisional: true)');
  else if (ag.picked_by !== 'human' && ag.provisional !== true) errors.push('angle_gate: picked_by is "' + ag.picked_by + '" and provisional is not true; an unattended run labels the developed recommendation provisional');
}
const shown = slate.provenance && slate.provenance.exemplars_shown && typeof slate.provenance.exemplars_shown === 'object' ? slate.provenance.exemplars_shown : null;
if (developed && !shown) warns.push('provenance.exemplars_shown is missing: the file does not record which exemplar and favorite ids the gates were shown. exemplar_pick.js prints them under SHOWN; copy them in.');

// ---------------------------------------------------------------- option gates
function walkOptions(gid) {
  const opts = gates[gid];
  if (opts === undefined) return;
  const meta = GM[gid] || {};
  const base = 'gates.' + gid;
  if (!Array.isArray(opts)) { errors.push(base + ': not an array'); return; }
  const want = Number.isInteger(meta.count) && meta.count > 0 ? meta.count : null;
  if (want != null && opts.length && opts.length < want) errors.push(base + ': ' + opts.length + ' options (need ' + want + ')');
  if (want != null && opts.length > want) warns.push(base + ': ' + opts.length + ' options (the contract says ' + want + ')');
  const axes = [];
  opts.forEach((o, i) => {
    const w = base + '[' + i + ']';
    if (!o || typeof o !== 'object') { errors.push(w + ': not an object'); return; }
    if (o.copy != null && typeof o.copy !== 'string') { errors.push(w + ': copy is ' + kindOf(o.copy) + ', not a string; it was not checked, and copy nobody checked cannot ship'); return; }
    if (!String(o.copy || '').trim()) { errors.push(w + ': empty copy'); return; }
    checkText(w, o.copy);
    ['why', 'tension'].forEach(k => textField(w + '.' + k, o[k]));
    if (o.composed != null) strings(o.composed).forEach((s, j) => checkText(w + '.composed' + (typeof o.composed === 'string' ? '' : '[' + j + ']'), s));
    if (o.cuts != null && !Array.isArray(o.cuts)) errors.push(w + '.cuts: expected an array of {slot, from, composed, cut}');
    if (gid === 'angle') checkCited(w, o.grounded_in);
    if (gid === 'caption') checkVerbatim(w, o);
    if ((meta.axes || []).length) {
      if (!o.axis) errors.push(w + ': no axis; the distinctness claim is unverifiable without it');
      else if (!meta.axes.includes(o.axis)) errors.push(w + ': axis "' + o.axis + '" is not in the ' + gid + ' set (' + meta.axes.join(', ') + ')');
      else axes.push(o.axis);
    }
  });
  if (axes.length && new Set(axes).size < axes.length && !(gid === 'angle' && angleInRoute)) {
    const dupes = [...new Set(axes.filter((a, i) => axes.indexOf(a) !== i))];
    errors.push(base + ': ' + new Set(axes).size + ' distinct axes across ' + axes.length + ' options (repeated: ' + dupes.join(', ') + '); these are rewordings, not different options');
  }
  if (gid === 'cover' && (meta.axes || []).length) {
    meta.axes.forEach((wantAxis, i) => {
      const got = (opts[i] || {}).axis;
      if (got && got !== wantAxis) warns.push(base + '[' + i + ']: hook is "' + got + '"; the contract assigns "' + wantAxis + '" to this position so the three cover all three hooks. Check the set still spans them.');
    });
  }
}
['angle', 'cover', 'caption'].forEach(walkOptions);

// ---------------------------------------------------------------- captions
const cap = specs.caption || {}, tags = specs.hashtags || {}, links = specs.links || {};
const mustSay = (Array.isArray(brief.must_say) ? brief.must_say : []).filter(Boolean).map(String);
const URL_RE = /(https?:\/\/|www\.)\S+/gi;
const DOMAIN_RE = /(^|[\s(])[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|org|co|io|shop|store|us|uk|ca|au|de|fr|es|it|nl|eu|info|biz|me|app|link|page|site|online)(?:\/\S*)?(?=$|[\s),.!?;:])/i;
const HASHTAG_RE = /#[\p{L}\p{N}_]+/gu;
const foldConf = cap.visible_confidence || cap.confidence;
const beforeFolds = [];
(Array.isArray(gates.caption) ? gates.caption : []).forEach((o, i) => {
  if (!o || typeof o !== 'object' || typeof o.copy !== 'string' || !o.copy.trim()) return;
  const w = 'gates.caption[' + i + ']', t = o.copy;
  if (Number.isInteger(cap.max) && t.length > cap.max) bySpec(cap.confidence, w + ': ' + t.length + ' characters against the platform\'s caption ceiling of ' + cap.max);
  /* The fold is a character count, line breaks and spaces included. A must-say is found across a
     line break or a run of spaces, so "Linen\nNotebooks" is the must-say "Linen Notebooks". */
  const first = t.split(/\r?\n/)[0];
  const foldAt = Number.isInteger(cap.visible) ? cap.visible : null;
  beforeFolds.push(normLine(foldAt == null ? first : t.slice(0, foldAt)));
  if (foldAt != null && first.length > foldAt) {
    warns.push(w + ': the first line runs ' + first.length + ' characters and the caption folds behind "more" at about ' + foldAt + '; what has to land goes before the fold');
  }
  if (foldAt != null) {
    mustSay.forEach(m => {
      const re = new RegExp(m.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'), 'i');
      const hit = re.exec(t);
      if (!hit) return;
      if (hit.index >= foldAt) warns.push(w + ': must-say ' + JSON.stringify(m) + ' first appears at character ' + hit.index + ', after the fold (about ' + foldAt + ')');
      else if (hit.index + hit[0].length > foldAt) warns.push(w + ': must-say ' + JSON.stringify(m) + ' runs across the fold (about ' + foldAt + '); a reader who does not tap "more" sees half of it');
    });
  }
  const n = (t.replace(URL_RE, ' ').match(HASHTAG_RE) || []).length;
  if (Number.isInteger(tags.max) && n > tags.max) bySpec(tags.confidence, w + ': ' + n + ' hashtags against the platform\'s maximum of ' + tags.max);
  URL_RE.lastIndex = 0;
  if (links.clickable_in_caption === false && (URL_RE.test(t) || DOMAIN_RE.test(t))) {
    warns.push(w + ': a URL or domain in an organic caption does not click; point to the profile link or a story sticker instead');
  }
  URL_RE.lastIndex = 0;
});
for (let i = 0; i < beforeFolds.length; i++) for (let j = i + 1; j < beforeFolds.length; j++) {
  if (beforeFolds[i] && beforeFolds[i] === beforeFolds[j]) warns.push('gates.caption[' + i + '] and [' + j + '] read the same before the fold; the three differ where the reader decides');
}

// ---------------------------------------------------------------- the sequence
/* The ratios the post declares: each one must be a size the format's recipe builds. */
const declaredRatios = slate.ratios != null ? slate.ratios : (brief.ratios != null ? brief.ratios : null);
if (fmt && declaredRatios != null) {
  if (!Array.isArray(declaredRatios)) errors.push('ratios: is ' + kindOf(declaredRatios) + ', not an array');
  else declaredRatios.forEach(r => {
    if (!(fmt.ratios || []).includes(String(r))) errors.push('ratios: "' + r + '" is not a ' + fmt.label.toLowerCase() + ' size (' + (fmt.ratios || []).join(', ') + '); the recipe builds no master at it');
  });
}

const seq = gates.sequence;
const ROLES = fmt && Array.isArray(fmt.sequence_roles) ? fmt.sequence_roles.map(String) : [];
let sequenceShape = null;
if (seq !== undefined && fmt) {
  if (!Array.isArray(seq)) errors.push('gates.sequence: not an array');
  else if (seq.length) {
    const roles = seq.map(e => (e && e.role) || null);
    sequenceShape = roles.join(',');
    const panelsWanted = Number.isInteger(brief.panels) ? brief.panels : null;
    const framesWanted = Number.isInteger(brief.frames) ? brief.frames : null;
    if (pf === 'carousel') {
      /* sequence_roles names the opener, the repeated middle and the closer. */
      const car = specs.carousel || {};
      const [OPEN, MID, CLOSE] = [ROLES[0], ROLES[1], ROLES[ROLES.length - 1]];
      if (ROLES.length < 3) errors.push('gate data: the carousel format names ' + ROLES.length + ' sequence role(s); it needs the opener, the middle and the closer');
      if (roles[0] !== OPEN) errors.push('gates.sequence[0]: a carousel opens on its ' + OPEN + ' panel (role "' + OPEN + '"), got "' + roles[0] + '"');
      if (roles[roles.length - 1] !== CLOSE) errors.push('gates.sequence[' + (roles.length - 1) + ']: a carousel closes on its ' + CLOSE + ' panel (role "' + CLOSE + '"), got "' + roles[roles.length - 1] + '"');
      const mid = roles.slice(1, -1);
      if (!mid.length) errors.push('gates.sequence: a carousel needs at least one ' + MID + ' panel between the ' + OPEN + ' and the ' + CLOSE);
      mid.forEach((r, k) => { if (r !== MID) errors.push('gates.sequence[' + (k + 1) + ']: between the ' + OPEN + ' and the ' + CLOSE + ' every panel is "' + MID + '", got "' + r + '"'); });
      if (Number.isInteger(car.max_panels) && seq.length > car.max_panels) bySpec(car.confidence, 'gates.sequence: ' + seq.length + ' panels against the platform\'s maximum of ' + car.max_panels);
      if (Number.isInteger(car.min_panels) && seq.length < car.min_panels) bySpec(car.confidence, 'gates.sequence: ' + seq.length + ' panel(s); a carousel takes at least ' + car.min_panels);
      if (panelsWanted != null && seq.length !== panelsWanted) errors.push('gates.sequence: the brief asks for ' + panelsWanted + ' panels and the sequence has ' + seq.length);
      if (!slate.build_mode) warns.push('build_mode is not declared (' + (fmt.build_modes || []).join(' or ') + '); asset-production builds the two differently');
      else if (!(fmt.build_modes || []).includes(slate.build_mode)) errors.push('build_mode "' + slate.build_mode + '" is not one of ' + (fmt.build_modes || []).join(', '));
    } else if (pf === 'story_set') {
      const FRAME = ROLES[0];
      roles.forEach((r, k) => { if (r !== FRAME) errors.push('gates.sequence[' + k + ']: a story set is a run of frames (role "' + FRAME + '"), got "' + r + '"'); });
      seq.forEach((e, k) => {
        const st = e && e.structure;
        if (!st) errors.push('gates.sequence[' + k + ']: no `structure` (' + (fmt.structures || []).join(', ') + ')');
        else if (!(fmt.structures || []).includes(st)) errors.push('gates.sequence[' + k + ']: structure "' + st + '" is not one of ' + (fmt.structures || []).join(', '));
      });
      if (framesWanted != null && seq.length !== framesWanted) errors.push('gates.sequence: the brief asks for ' + framesWanted + ' frames and the sequence has ' + seq.length);
    } else if (pf === 'feed_post') {
      const POST = ROLES[0], most = Number.isInteger(fmt.max_entries) ? fmt.max_entries : 1;
      if (seq.length > most || roles.some(r => r !== POST)) errors.push('gates.sequence: a feed post is ' + most + ' entry with role "' + POST + '", got [' + roles.join(', ') + ']');
    }
    seq.forEach((e, k) => {
      const w = 'gates.sequence[' + k + ']';
      if (!e || typeof e !== 'object') { errors.push(w + ': not an object'); return; }
      if (!e.slots || typeof e.slots !== 'object' || Array.isArray(e.slots) || !Object.keys(e.slots).length) { errors.push(w + ': no `slots`; every panel or frame carries the copy it sets'); return; }
      Object.entries(e.slots).forEach(([key, v]) => slotStrings(w + '.slots.' + key, v).forEach(s => checkText(w + '.slots.' + key, s)));
      if (e.composed != null) strings(e.composed).forEach(s => checkText(w + '.composed', s));
      if (e.cuts != null && !Array.isArray(e.cuts)) errors.push(w + '.cuts: expected an array of {slot, from, composed, cut}');
      checkVerbatim(w, e);
    });
    if (Array.isArray(gates.cover) && gates.cover.length && seq[0] && seq[0].slots) {
      const covers = new Set(gates.cover.map(o => normLine(o && o.copy)).filter(Boolean));
      const lead = strings(seq[0].slots).map(normLine);
      if (!lead.some(x => covers.has(x))) warns.push('gates.sequence[0]: the first ' + (pf === 'story_set' ? 'frame' : 'panel') + ' carries none of the cover gate\'s lines; the pick should lead the post, or the cover gate was skipped in practice');
    }
  }
}

// ---------------------------------------------------------------- in-frame slot ceilings
let socialSlots = null, slotSource = null, slotNote = null;
{
  let sp = has('--slotmap-social') ? arg('--slotmap-social') : null;
  if (!sp && CTX) {
    const p = pack.resolveRole(CTX, 'slotmap_social');
    if (p === false) slotNote = 'the File map names slotmap_social "' + fileMap.slotmap_social + '" and it does not resolve';
    else if (p) sp = p;
  }
  if (slotNote) errors.push(slotNote + '; a slot map the pack names and cannot find is a refusal, not an OFF');
  if (sp) {
    try {
      const body = fs.readFileSync(sp, 'utf8').split(/^module_node_ids:/m)[0];
      const mods = {}; let cur = null;
      for (const line of body.split(/\r?\n/)) {
        const m = line.match(/^  ([A-Z]\d+):\s*$/);
        if (m) { cur = m[1]; mods[cur] = {}; continue; }
        if (!cur) continue;
        const sl = line.match(/^\s*-\s*\{\s*id:\s*([A-Z]\d+\.[\w.]+)\s*,(.*)\}\s*$/);
        if (sl) {
          const mc = sl[2].match(/max_chars:\s*(\d+|null)/);
          mods[cur][sl[1]] = { slot: sl[1], max_chars: mc && mc[1] !== 'null' ? parseInt(mc[1], 10) : null,
                               status: (sl[2].match(/status:\s*"([^"]*)"/) || [])[1] || null };
        }
      }
      if (Object.keys(mods).length) { socialSlots = mods; slotSource = sp; }
      else slotNote = 'parsed ' + sp + ' and found no stamped modules';
    } catch (e) {
      slotNote = 'unreadable (' + e.message + ')';
      errors.push('the social slot map at ' + sp + ' is unreadable (' + e.message + '); panel and frame copy was checked against nothing');
    }
  } else if (!slotNote) slotNote = 'no slotmap_social role in the File map and no --slotmap-social';
}
const declaredModule = typeof slate.module === 'string' ? slate.module : null;
let slotChecks = 0, moduleUnknown = false, captionLayer = null;
if (socialSlots && declaredModule && !socialSlots[declaredModule]) {
  moduleUnknown = true;
  errors.push('slate declares module "' + declaredModule + '" and the social slot map has no such module. Available: '
    + Object.keys(socialSlots).join(', ') + '. Copy written for a master the design system does not stamp has no node to land in.');
} else if (socialSlots && declaredModule) {
  const slots = socialSlots[declaredModule];
  /* A key maps to a stamped id through the entry's own panel or structure: on an inner panel
     `body` is S03.inner.body and `item1.body` is S03.inner.item1.body. A key that already carries
     the module is used as is and must still belong to this entry's panel. `caption` is the
     module's caption layer (S03.caption), which the brand stamps only when it keeps captions in
     the file beside the set. */
  const CAPTION_ID = declaredModule + '.caption';
  if (slots[CAPTION_ID]) captionLayer = CAPTION_ID;
  const partOf = e => (pf === 'carousel' ? e.role : (pf === 'story_set' ? e.structure : null));
  const idFor = (e, key) => {
    if (key === 'caption') return CAPTION_ID;
    if (key.startsWith(declaredModule + '.')) return key;
    const part = partOf(e);
    return declaredModule + '.' + (part ? part + '.' : '') + key;
  };
  (Array.isArray(seq) ? seq : []).forEach((e, k) => {
    if (!e || !e.slots || typeof e.slots !== 'object' || Array.isArray(e.slots)) return;
    const part = partOf(e);
    Object.entries(e.slots).forEach(([key, v]) => {
      const id = idFor(e, key), spec = slots[id], w = 'gates.sequence[' + k + '].slots.' + key;
      if (part && id !== CAPTION_ID && !id.startsWith(declaredModule + '.' + part + '.')) {
        errors.push(w + ': "' + id + '" belongs to another ' + (pf === 'story_set' ? 'structure' : 'panel') + '; this entry is "' + part + '", so its copy lands in ' + declaredModule + '.' + part + '.*');
        return;
      }
      if (!spec) { errors.push(w + ': "' + id + '" is not a stamped slot on ' + declaredModule + ' (has: ' + Object.keys(slots).join(', ') + ')'); return; }
      slotChecks++;
      if (spec.max_chars == null) {
        needsSignoff.push(w + ': ' + id + ' carries no measured budget' + (spec.status ? ' (' + spec.status + ')' : '') + '; the copy cannot be checked against it, and no budget is invented');
        return;
      }
      (typeof v === 'string' ? [v] : (Array.isArray(v) ? v.filter(x => typeof x === 'string') : [])).forEach(s => {
        if (s.length > spec.max_chars) errors.push(w + ': ' + s.length + ' chars against ' + id + '\'s measured ceiling of ' + spec.max_chars + '; it is set in the artwork, so it overflows the frame');
      });
    });
  });
  /* The caption layer is excluded from export, so a caption longer than its box only clips the
     file's copy of it: a WARN, never a FAIL. */
  if (captionLayer && Number.isInteger(slots[CAPTION_ID].max_chars)) {
    (Array.isArray(gates.caption) ? gates.caption : []).forEach((o, i) => {
      if (o && typeof o.copy === 'string' && o.copy.length > slots[CAPTION_ID].max_chars) {
        warns.push('gates.caption[' + i + ']: ' + o.copy.length + ' characters against the caption layer ' + CAPTION_ID + ' (' + slots[CAPTION_ID].max_chars + '); the post is unaffected, the file\'s copy of the caption clips');
      }
    });
  }
}

// ---------------------------------------------------------------- verdict
const verdict = errors.length ? 'FAIL'
  : ((needsSignoff.length || insufficient.length) ? 'INSUFFICIENT-INPUT' : (warns.length ? 'WARN' : 'PASS'));

console.log(JSON.stringify({
  errors, warns, needs_human_signoff: needsSignoff, insufficient_input: insufficient,
  verdict,
  checked: {
    slate: arg('--slate'), slate_sha256: slateSha,
    post_format: pf, recipe: fmt ? fmt.recipe : null, on_image: !noText,
    stage: stage || 'partial', gates_not_run: Object.keys(notRun),
    gates_present: Object.keys(gates).filter(g => Array.isArray(gates[g]) && gates[g].length),
    sequence: sequenceShape, build_mode: slate.build_mode || null,
    ratios: Array.isArray(declaredRatios) ? declaredRatios : null,
    strings_checked: stringsChecked,
    caption_checking: (Array.isArray(gates.caption) && gates.caption.length)
      ? 'on: ceiling ' + cap.max + ' (' + (cap.confidence || 'agreed') + '), fold at about ' + cap.visible + ' (' + (foldConf || 'agreed') + '), hashtags ' + tags.max + ' (' + (tags.confidence || 'agreed') + ')'
      : 'OFF: no caption gate in this post',
    social_slotmap: slotSource,
    declared_module: declaredModule,
    caption_layer: captionLayer,
    slot_checking: (() => {
      if (!socialSlots) return 'OFF: no social slot map resolved (' + slotNote + '), so panel and frame copy was not checked against any real slot';
      if (!declaredModule) return 'OFF: a social slot map resolved (' + Object.keys(socialSlots).length + ' modules) but the slate declares no `module`, so panel and frame copy could not be matched to a master';
      if (moduleUnknown) return 'OFF: the slate declares module "' + declaredModule + '", which the social slot map does not stamp';
      if (!slotChecks) return 'on: no panel or frame copy present to check';
      return 'on: ' + slotChecks + ' slot(s) checked against ' + declaredModule + '\'s measured ceilings';
    })(),
    angle_gate_inside_selected_route: selectedRoute ? angleInRoute : null,
    exemplars_shown_recorded: !!shown,
    grounding_items: pool.size,
    brand_context: brandContextPath, pack_resolved_by: CTX ? CTX.how : null,
    prohibited_source: prohibitedSource, prohibited_patterns: prohibitedPatterns.length,
    figure_check: unitAware ? 'unit-aware' : (bare.size ? 'unit-blind' : 'none'),
    ledger: ledgerSource || null, ledger_status: ledgerStatus,
    ledger_trigger_formats: LEDGER ? LEDGER.formats : null,
    paraphrase_review: claims.paraphraseReview(LEDGER, ledgerHits.hits),
    paraphrase_review_required: !!(LEDGER && LEDGER.paraphraseEntries.length),
    claims_checking: (() => {
      if (!ledger) return 'OFF: prohibited-territory list only; no graded claims rules resolved';
      if (ledgerStatus === 'unverified') return 'UNVERIFIED LEDGER: carries no _status: "production", so it is not treated as counsel-approved. Flags are real; clearance is not implied.';
      if (ledgerStatus === 'fixture') return 'FIXTURE LEDGER: the mechanism is proven, the content is invented. Not a claims clearance.';
      if (ledgerStatus === 'test-seed') return 'TEST-SEED LEDGER (' + ledger.version + '): ' + LEDGER_RULES.length + ' topics enforce provisionally.';
      return 'on: ' + LEDGER_RULES.length + ' ledger rules applied';
    })(),
    cost: provenance.normalizeCost(slate.provenance),
    specs_verified: specs._verified || null,
  },
}, null, 1));
/* A check that could not run must not read as one that passed. */
process.exit((errors.length || needsSignoff.length || insufficient.length) ? 1 : 0);
