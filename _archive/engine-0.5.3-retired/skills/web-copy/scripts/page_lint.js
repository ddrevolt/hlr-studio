#!/usr/bin/env node
/* page_lint.js — deterministic gate for a page's copy. Fix every ERROR and re-run until clean.

   FAILS CLOSED on its inputs, in the same places every lint in this suite does: a missing
   prohibited-territory list, an unreadable brand context or an unusable ledger are ERRORs.

   Two things this checks that the email and paid lints do not.

   SLOT BUDGETS ACROSS BREAKPOINTS. These sections are built to measured site geometry, and the
   mobile form is often not a reflow: a card row becomes a narrow carousel, a grid becomes slides.
   A card title that fits a wide desktop card does not fit a narrow slide, and nothing at the
   desktop breakpoint will tell you. So copy is checked against every breakpoint the section
   actually ships, and a slot the site does not render at a breakpoint has a budget of zero there:
   copy written into it disappears on the phone rather than truncating, which is worse, because it
   looks fine everywhere you would think to look.

   PERSISTENCE. A page is wrong until somebody notices. That is not a different rule from email's,
   it is the same rule with a longer exposure, and it is why the ledger is not optional here.

   THE LIVE SLOT MAP GOVERNS. Pass --slotmap and it is parsed, not merely named. Desktop budgets
   come from it (a slot map's single figure is measured at the desktop width its meta declares) and
   mobile budgets stay with the snapshot, which is the only source that has them; every finding says
   which. Where the two disagree the map wins and the drift is reported: a slot budget the brand
   deliberately raised in its map, and a snapshot that never caught up, would otherwise flag copy
   against a number the brand had already retired.

   The two sources need not share a slot vocabulary (a map's benefit.title can be a snapshot's
   card_title, and some sections barely overlap at all). Nothing here guesses a join. Unmatched slots are
   reported, and escalated to sign-off only where the page actually wrote copy into one — a gate
   that never goes green is a gate somebody removes.

   Budgets are ADVISORY (ruling 2026-07-25): web modules are auto-layout and resilience-tested, so
   they absorb longer copy. Over-budget warns, far over (>2x) warns louder, neither blocks. The
   exception is a slot the site does not render at all, where copy disappears instead of truncating
   — that is still an error.

   Usage:
     node page_lint.js --page page.json --pack <brand pack folder>
                       [--sections section-data.json] [--slotmap slotmap_web.yaml]
                       [--facts facts.json] [--ledger ledger.json] [--prohibited list.json]
     --brand-context <brand-context.md> still works and wins over --pack; --brand <name|alias>
     resolves through brands/registry.yaml. The measured section library resolves from the pack's
     `section_library` role (explicit --sections wins) and the live map from `slotmap_web` (explicit
     --slotmap wins). The claims ledger is compiled by lib/claims.js, shared with the email and paid
     lints.

   Exit 0 PASS or WARN · 1 FAIL or INSUFFICIENT-INPUT · 2 could not start.
*/
const fs = require('fs'), path = require('path'), crypto = require('crypto');
function arg(k, d) { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; }
function has(k) { return process.argv.indexOf(k) > 0; }

const errors = [], warns = [], needsSignoff = [], insufficient = [];
const die = m => {
  console.log(JSON.stringify({ errors: [m], warns: [], needs_human_signoff: [],
                               insufficient_input: [], verdict: 'FAIL', checked: {} }, null, 1));
  console.error('page_lint: ' + m + '\n  Nothing was checked, so this is not a clean run — it is a '
    + 'run that could not start.');
  process.exit(2);
};
function sharedLib(name) {
  const cands = [path.join(__dirname, '..', '..', '..', 'lib', name)];
  if (process.env.CLAUDE_PLUGIN_ROOT) cands.push(path.join(process.env.CLAUDE_PLUGIN_ROOT, 'lib', name));
  for (const c of cands) if (fs.existsSync(c)) return require(c);
  die('the shared module lib/' + name + ' is not beside this plugin (looked in ' + cands.join(', ') + ').');
}
const pack = sharedLib('pack.js');
const claims = sharedLib('claims.js');
const provenance = sharedLib('provenance.js');

/* ------------------------------------------------------------------ YAML */
/* The YAML parser is lib/yaml.js (0.5.2), shared by every script that reads a slot map or figma.yaml. */
const { parseYaml } = sharedLib('yaml.js');

// ---------------------------------------------------------------- inputs
let page, pageSha = null;
try {
  const raw = fs.readFileSync(arg('--page'));
  page = JSON.parse(raw.toString('utf8'));
  pageSha = crypto.createHash('sha256').update(raw).digest('hex');
} catch (e) { die('cannot read --page: ' + e.message); }

/* --slotmap: parsed, and allowed to govern.
   This flag used to be read only by has(), which stamped `<path> (live)` into the report while every
   budget still came from the bundled snapshot — including for a path that did not exist. That is the
   silent wrong result this suite exists to prevent: a report asserting a check it never ran, on the
   one input the skill's own doctrine says wins over the snapshot.
   The loader below is that fix. It parses the YAML for real; an unparseable map is an exit-2 refusal
   rather than a partial object, because a half-read map reports present slots as absent, which is the
   same class of wrong answer wearing a different hat. */
/* The brand pack: --brand-context <file>, --pack <folder> or --brand <name>. See lib/pack.js. */
let CTX = null;
try { CTX = pack.resolveContext(process.argv); }
catch (e) { die(e.message); }
const brandContextPath = CTX ? CTX.brandContextPath : null;
let fileMap = CTX ? CTX.fileMap : {};

let slotmapPath = null, slotmap = null;
if (!has('--slotmap') && CTX) {
  /* The live map is the contract; when the pack names one it governs without being asked for. */
  const p = pack.resolveRole(CTX, 'slotmap_web');
  if (p === false) die('the brand context names slotmap_web "' + fileMap.slotmap_web + '" and it is not '
    + 'beside it. Budgets would silently fall back to the snapshot while the pack claims a live map.');
  if (p) process.argv.push('--slotmap', p);
}
if (has('--slotmap')) {
  slotmapPath = arg('--slotmap');
  if (!slotmapPath) die('--slotmap was passed with no path after it.\n'
    + '  The live slot map is the contract the bundled snapshot only photographs, so a run that\n'
    + '  cannot resolve it is checking against a possibly stale copy.\n'
    + '  Pass the path: --slotmap <slotmap_web.yaml>, or omit the flag to use the snapshot knowingly.');
  let rawMap;
  try { rawMap = fs.readFileSync(slotmapPath, 'utf8'); }
  catch (e) { die('cannot read the slot map at ' + slotmapPath + '\n'
    + '  Budgets would silently fall back to the bundled snapshot while the report named your file,\n'
    + '  which is a report claiming a check it did not run.\n'
    + '  Check `slotmap_web` in your brand-context.md file map. (' + e.message + ')'); }
  try { slotmap = /\.ya?ml$/i.test(slotmapPath) ? parseYaml(rawMap) : JSON.parse(rawMap); }
  catch (e) { die('the slot map at ' + slotmapPath + ' did not parse:\n  ' + e.message
    + '\n  Refusing to fall back to the bundled snapshot — a run that silently substitutes the '
    + 'photograph for the contract is the defect this loader replaced.'); }
  if (!slotmap || !slotmap.modules || !Object.keys(slotmap.modules).length)
    die('the slot map at ' + slotmapPath + ' parsed but carries no `modules:` block. '
      + 'Nothing could be reconciled against the snapshot, so this is not a live-map run.');
}

const REF = p => path.join(__dirname, '..', 'references', p);
/* The measured section library is BRAND data: the pack's section_library role, or --sections. The
   engine's references/section-data.json is a schema with an empty roster and is named only so the
   refusal below can say where the real one belongs. */
let sectionsPath = arg('--sections', null), sectionsSource = null;
if (!sectionsPath && CTX) {
  const p = pack.resolveRole(CTX, 'section_library');
  if (p === false) die('the brand context names section_library "' + fileMap.section_library + '" and it is not beside it.');
  if (p) { sectionsPath = p; sectionsSource = 'pack section_library'; }
}
if (!sectionsPath) { sectionsPath = REF('section-data.json'); sectionsSource = 'engine schema (empty roster)'; }
else if (!sectionsSource) sectionsSource = '--sections';
let sections;
try { sections = JSON.parse(fs.readFileSync(sectionsPath, 'utf8')); }
catch (e) { die('cannot read the section data (' + e.message + ') — copy would be checked against no slot budgets at all'); }
if (!Array.isArray(sections.sections) || sections.sections.length === 0) {
  const roster = sections.sections && !Array.isArray(sections.sections) ? Object.keys(sections.sections) : [];
  if (!roster.length) die('the section library at ' + sectionsPath + ' is EMPTY (' + sectionsSource + '). '
    + 'This engine ships no geometry for any brand: a section library is measured from the brand\'s '
    + 'built web masters, and grading a page against another brand\'s geometry is worse than not '
    + 'grading it. Name the measured section-data.json in the pack\'s `section_library` role (or pass '
    + '--sections), or build and measure the masters first (asset-production).');
}

let facts = { allowed_figures: [] };
if (has('--facts')) {
  try { facts = JSON.parse(fs.readFileSync(arg('--facts'), 'utf8')); }
  catch (e) { die('--facts given but unreadable (' + e.message + ')'); }
} else {
  warns.push('input: no --facts supplied; every figure on the page is treated as unverified');
}

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
    + 'whose File map carries "prohibited_patterns", or --prohibited <list.json>. Refusing to lint: a page '
    + 'stays up until somebody notices, so certifying one against no claims rules is the longest-'
    + 'lived version of that mistake.');
}
let PROHIBITED;
try { PROHIBITED = new RegExp('(' + prohibitedPatterns.join('|') + ')', 'i'); }
catch (e) { die('prohibited_patterns do not compile as a regex: ' + e.message); }

/* The same ledger email-copy and paid-ad-copy read. */
let ledger = null, ledgerSource = null, ledgerStatus = null, LEDGER_RULES = [], LEDGER = null;
function loadLedger(p) {
  const abs = path.isAbsolute(p) ? p : path.join(CTX ? CTX.packDir : '.', p);
  ledger = JSON.parse(fs.readFileSync(abs, 'utf8')); ledgerSource = abs;
}
if (has('--ledger')) {
  try { loadLedger(arg('--ledger')); } catch (e) { die('--ledger unreadable: ' + e.message); }
} else if (fileMap.legal_ledger) {
  try { loadLedger(fileMap.legal_ledger); }
  catch (e) { die('brand context names a legal_ledger that will not load: ' + e.message); }
}
if (ledger) {
  /* Compiled by lib/claims.js: literal triggers, regex triggers, lemmas with inflection, and the
     paraphrase_risk flag. Production is a written claim, never an inference. */
  try { LEDGER = claims.compileLedger(ledger); } catch (e) { die(e.message); }
  ledgerStatus = LEDGER.status;
  LEDGER_RULES = LEDGER.rules;
}
const ledgerHits = claims.makeHitCounter();

// ---------------------------------------------------------------- figures
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
    byUnit.get(u).add(String(f.value)); bare.add(String(f.value));
  } else { bare.add(String(f)); }
});
const FIGURE = /(\d+(?:\.\d+)?)\s?(g\b|grams?|cal(?:ories)?\b|%|mg\b|x\b|×|star|servings?|minutes?|hours?|days?|weeks?|months?|years?)/gi;
const COMPARATIVE = /\b\d+(?:\.\d+)?\s?(?:x|times|%)\s+(?:the\s+)?(?:more|less|fewer|higher|lower|better)/i;

function checkText(where, text) {
  const t = String(text || '');
  if (!t.trim()) return;
  let m; FIGURE.lastIndex = 0;
  while ((m = FIGURE.exec(t)) !== null) {
    const num = m[1], unit = normUnit(m[2]);
    if (unitAware && byUnit.has(unit)) {
      if (!byUnit.get(unit).has(num)) errors.push(where + ': figure "' + m[0].trim() + '" not verified for unit "' + (unit || 'none') + '"');
    } else if (!bare.has(num)) {
      errors.push(where + ': figure "' + m[0].trim() + '" not in verified facts');
    }
  }
  if (COMPARATIVE.test(t)) errors.push(where + ': comparative claim "' + (t.match(COMPARATIVE) || [])[0]
    + '" — needs substantiation against a named competitor set');
  if (PROHIBITED.test(t)) errors.push(where + ': prohibited territory — "' + (t.match(PROHIBITED) || [])[0] + '"');
  for (const r of LEDGER_RULES) {
    const hit = claims.matchRule(r, t);
    if (!hit) continue;
    ledgerHits.note(r.id);
    const tag = r.paraphrase_risk ? claims.PARAPHRASE_TAG : '';
    if (r.status === 'prohibited') {
      errors.push(where + ': ledger ' + r.id + ' prohibits "' + hit + '" (' + r.topic + ')' + tag);
    } else if (r.status === 'conditional') {
      const satisfied = claims.requiredLanguageSatisfied(r, t);
      if (satisfied === false) {
        errors.push(where + ': ledger ' + r.id + ' allows "' + hit + '" only with the required language ('
          + JSON.stringify(r.required_language) + ') — it is not present' + tag);
      } else {
        needsSignoff.push(where + ': ledger ' + r.id + ' (' + r.topic + ') conditional on "' + hit
          + '" — ' + (r.requires || 'see the ledger')
          + '  [no machine-checkable required_language; a human must confirm and record it]' + tag);
      }
    }
  }
}

// ---------------------------------------------------------------- structure
const BY_ID = new Map((sections.sections || []).map(s => [s.id, s]));

/* ---------------------------------------------------------------- reconciliation
   The live map and the section library can describe the same modules in DIFFERENT VOCABULARIES.
   A promo may line up (eyebrow / heading / body) while a reviews section does not (the map has
   heading, rating, count, review.stars, review.quote, review.name; the library has pull_quote,
   subcopy, review_quote, attribution), and a benefit row's map can say benefit.title /
   benefit.body where the library says card_title / card_body.

   So this joins on an exact normalised name and REPORTS the rest. It does not guess. A fuzzy
   join could silently attach a `rating` budget to a `subcopy` slot whose mobile budget is zero,
   and the failure mode of a wrong join here is copy that vanishes on the phone while the lint
   says PASS. An unmatched slot is a mapping decision for a human to make
   once and record, not something a lint invents per run. */
const norm = s => String(s).toLowerCase().replace(/^[mwpe]\d{2}\./, '').replace(/\./g, '_');
const RECON = new Map();
if (slotmap) {
  for (const [mid, mod] of Object.entries(slotmap.modules)) {
    const rec = BY_ID.get(mid);
    const mapSlots = new Map();
    for (const s of (mod.slots || [])) if (s && s.id) mapSlots.set(norm(s.id), s);
    // Composed elements (cta: E01.label) are real fillable slots that live on the element.
    for (const [role, ref] of Object.entries(mod.composed || {})) mapSlots.set(norm(role), { id: ref, composed: true });
    const snapSlots = new Set(Object.keys((rec && rec.slots) || {}));
    const matched = new Map(), mapOnly = [], snapOnly = [];
    for (const [k, s] of mapSlots) (snapSlots.has(k) ? matched.set(k, s) : mapOnly.push(s.id || k));
    for (const k of snapSlots) if (!mapSlots.has(k)) snapOnly.push(k);
    RECON.set(mid, { matched, mapOnly, snapOnly, inSnapshot: !!rec,
                     stampsNoText: !!mod.stamps_no_text });
  }
}
// The map's length figure. Web lengths are advisory by the 2026-07-25 ruling, so this changes what
// a warning SAYS, never whether copy is blocked.
const mapLen = s => (s && (s.typical_chars != null ? s.typical_chars
                        : (s.max_chars != null ? s.max_chars : null)));
const pageTypes = sections.page_types || {};
const pickedType = page.page_type || null;
const typeRec = pickedType ? pageTypes[pickedType] : null;

for (const block of ['brief', 'provenance']) {
  const v = page[block];
  if (!v || typeof v !== 'object' || !Object.keys(v).length) {
    errors.push('no `' + block + '` block — without it the page cannot be audited against what was asked for');
  }
}
if (!pickedType) {
  errors.push('the page declares no `page_type`, so its expected section set cannot be resolved');
} else if (!typeRec) {
  needsSignoff.push('page type "' + pickedType + '" is not in the roster ('
    + Object.keys(pageTypes).join(', ') + '), so its composition could not be checked. '
    + 'Confirm the type is real, or add it.');
}

const composed = Array.isArray(page.sections) ? page.sections : [];
if (!composed.length) {
  errors.push('the page composes no sections. A web page in this system is an assembly of section '
    + 'instances; a page with none is a document, not a page.');
}

/* A section the library has never heard of is the web analogue of copy written for a deleted email
   module: it lints clean and there is nothing to put it in. */
const unknown = composed.map(s => s.id).filter(id => id && !BY_ID.has(id));
if (unknown.length) {
  /* This error used to say "either the live slotmap has masters this snapshot does not, or the page
     wants something built — say which." With the map loaded it can say which. */
  const uniq = [...new Set(unknown)];
  const inMap = slotmap ? uniq.filter(id => slotmap.modules[id]) : [];
  const nowhere = uniq.filter(id => !inMap.includes(id));
  if (inMap.length) errors.push('section(s) ' + JSON.stringify(inMap) + ' are in ' + slotmapPath
    + ' but NOT in the bundled snapshot, so they were composed against no budgets at all. These are '
    + 'built masters the snapshot has not caught up with — regenerate section-data.json.');
  if (nowhere.length) errors.push('section(s) ' + JSON.stringify(nowhere) + ' are in neither the '
    + 'library snapshot' + (slotmap ? ' nor ' + slotmapPath : '') + '. The page is asking for a '
    + 'section that would have to be built — a new master is a real request, not a typo.');
}
if (typeRec && Array.isArray(typeRec.requires)) {
  const have = new Set(composed.map(s => s.id));
  const miss = typeRec.requires.filter(r => !have.has(r));
  if (miss.length) errors.push('page type "' + pickedType + '" requires section(s) ' + JSON.stringify(miss)
    + ' and the page does not compose them. That is what makes it this page type rather than another.');
}

// ---------------------------------------------------------------- slots and budgets
const budgetFindings = [], overflows = [], drift = [];
const declaredBps = Array.isArray(page.breakpoints) && page.breakpoints.length
  ? page.breakpoints : null;
if (!declaredBps) {
  insufficient.push('the page declares no `breakpoints`, so copy was checked against the desktop '
    + 'budget only. Mobile is often not a reflow: a card row can become a narrow carousel and a grid '
    + 'can become slides, so a desktop-only check says nothing about whether this copy survives on a phone.');
}

/* The composed section (0.3.0, compose, map, cut, lint): class-A sections are written whole as
   eyebrow, heading, body, CTA in `composed`, mapped to slots, cut to the tightest breakpoint, and the
   cuts recorded in `cuts` for fit_check.js. Figures and prohibited territories apply to the composed
   text too; the budgets apply to the cut strings walked below. */
let composedStrings = 0;
composed.forEach((sec, si) => {
  if (!sec || typeof sec !== 'object') return;
  const where0 = 'sections[' + si + '] ' + (sec.id || '?');
  if (sec.composed != null) {
    if (typeof sec.composed !== 'object' || Array.isArray(sec.composed)) errors.push(where0 + '.composed: expected an object (eyebrow, heading, body, cta)');
    else Object.entries(sec.composed).forEach(([k, v]) => { if (typeof v === 'string') { composedStrings++; checkText(where0 + '.composed.' + k, v); } });
  }
  if (sec.cuts != null && !Array.isArray(sec.cuts)) errors.push(where0 + '.cuts: expected an array of {slot, from, composed, cut}');
});

composed.forEach((sec, si) => {
  const rec = BY_ID.get(sec.id);
  if (!rec) return;
  const where0 = 'sections[' + si + '] ' + sec.id;
  const slots = rec.slots || {};
  const vals = sec.slots || {};

  if (rec.slots && Object.keys(slots).length === 0 && Object.keys(vals).length) {
    errors.push(where0 + ': this section takes no copy (' + (rec.note || 'image or data only')
      + ') and copy was written for it');
  }
  const recon = RECON.get(sec.id);
  for (const [name, val] of Object.entries(vals)) {
    const fromMap = recon && (recon.matched.get(norm(name))
      || (recon.mapOnly.includes(name) ? { id: name } : null));
    if (!slots[name]) {
      /* The map is generated from the built components; the snapshot is a photograph of them. A
         slot the map knows and the snapshot does not is a stale snapshot, not bad copy — rejecting
         it here would be the lint telling a writer that a slot they can see in Figma is imaginary. */
      const mapKnows = recon && recon.mapOnly.some(id => norm(id) === norm(name));
      if (mapKnows) {
        warns.push(where0 + ': slot "' + name + '" exists in ' + slotmapPath + ' but not in the '
          + 'bundled snapshot, so it was accepted on the map\'s authority and checked against NO '
          + 'budget. The snapshot has fallen behind the built components for this section.');
      } else {
        errors.push(where0 + ': slot "' + name + '" does not exist on ' + rec.name
          + ' (has: ' + Object.keys(slots).join(', ') + ')'
          + (slotmap ? '; the live map does not have it either' : ''));
        continue;
      }
    }
    const spec = slots[name] || { budget: {} };
    const items = Array.isArray(val) ? val : [val];
    items.forEach((v, vi) => {
      const where = where0 + '.' + name + (Array.isArray(val) ? '[' + vi + ']' : '');
      checkText(where, v);
      const len = String(v == null ? '' : v).length;
      const bps = declaredBps || ['desktop'];
      for (const bp of bps) {
        if (!(rec.breakpoints || []).includes(bp)) continue;
        /* The map's figure is a single scalar measured at the desktop width its meta declares,
           so it governs DESKTOP and the snapshot remains the only source for mobile. Mixed
           provenance per slot is fine as long as the report says so — which is what `src` carries.
           Where the two disagree the map wins by contract, and the disagreement is reported. */
        const snapBudget = (spec.budget || {})[bp];
        const live = fromMap ? mapLen(fromMap) : null;
        const useLive = live != null && bp === 'desktop';
        const budget = useLive ? live : snapBudget;
        let src = useLive ? 'live map' : 'snapshot';
        if (useLive && snapBudget != null && snapBudget !== live) {
          src = 'live map (snapshot said ' + snapBudget + ' — stale)';
          drift.push({ section: sec.id, slot: name, breakpoint: bp, map: live, snapshot: snapBudget });
        }
        if (budget == null) continue;
        if (budget === 0 && len > 0) {
          errors.push(where + ': this slot is NOT RENDERED at ' + bp + ' ('
            + (spec.note || 'absent at this breakpoint')
            + '). Copy written here does not truncate, it disappears — and it looks correct at every '
            + 'breakpoint you would think to check.');
          overflows.push({ section: sec.id, slot: name, breakpoint: bp, len, budget, kind: 'not-rendered' });
        } else if (budget > 0 && len > budget) {
          const over = len - budget;
          const msg = where + ': ' + len + ' chars against a ' + budget + '-char budget at ' + bp
            + ' (' + over + ' over) [' + src + ']' + (spec.note ? ' — ' + spec.note : '');
          /* Budgets are typical values, not limits — the 2026-07-25 ruling: web modules are
             auto-layout and resilience-tested, so they absorb longer copy and the number advises
             rather than enforces. Far outside typical (>2x) is worth a louder line, still not a
             block. An error here would reject copy that renders fine and the check would be turned
             off within a month. */
          warns.push(len > budget * 2 ? msg + ' — more than 2x typical; confirm it still reads'
                                      : msg);
          overflows.push({ section: sec.id, slot: name, breakpoint: bp, len, budget,
                           source: src, kind: len > budget * 2 ? 'far-over' : 'over' });
        }
      }
    });
  }
  if (rec.requires_verbatim) {
    const cited = sec.verbatim_source || (sec.provenance && sec.provenance.verbatim_source);
    if (!cited) {
      errors.push(where0 + ': ' + rec.name + ' puts a customer\'s words on a public page and cites '
        + 'nothing. Set `verbatim_source`. An uncited verbatim slot is how invented reviewer names '
        + 'and ratings reach a page.');
    }
  }
  if (rec.open_decision) {
    warns.push(where0 + ': ' + rec.name + ' has an unresolved modelling decision — ' + rec.open_decision);
  }
});

// ---------------------------------------------------------------- SEO, where it belongs
const seoSections = composed.filter(s => (BY_ID.get(s.id) || {}).seo_block);
if (page.search_intent && !seoSections.length) {
  warns.push('the page declares a `search_intent` and composes no SEO block (a section marked seo_block). Intent with '
    + 'nowhere to put it ends up spread thinly across headings that were written for readers.');
}
if (seoSections.length && !page.search_intent) {
  warns.push('the page composes an SEO block and declares no `search_intent`. That block '
    + 'exists to answer one question; without a stated one it becomes filler.');
}
if (Array.isArray(page.search_intent) && page.search_intent.length > 1) {
  warns.push('the page declares ' + page.search_intent.length + ' search intents. A page that '
    + 'answers several questions ranks for none of them well and reads as a list.');
}

/* ---------------------------------------------------------------- reconciliation report
   Only for the sections this page actually composes — a page-level lint has no business grading
   the whole library, and a wall of findings about sections nobody touched trains people to skip
   the report. */
const reconReport = [];
if (slotmap) {
  for (const sec of composed) {
    const r = RECON.get(sec.id);
    if (!r) {
      if (BY_ID.has(sec.id)) warns.push(sec.id + ' is in the snapshot but NOT in ' + slotmapPath
        + '. Copy has somewhere to land here only if the snapshot is right; the map is generated '
        + 'from the built components and does not know this section.');
      continue;
    }
    if (r.stampsNoText) continue;                 // structural by declaration; nothing to reconcile
    if (!r.mapOnly.length && !r.snapOnly.length) continue;

    /* Escalate only what this page is actually exposed to. The two vocabularies diverge across most
       of the library, so signing off every divergence on every page would put a permanent exit-1 on
       the lint — and a gate that never goes green is a gate somebody removes. A divergence the page
       wrote copy into is a real uncertainty about that copy's budget; a divergence in a slot the
       page never touched is a library-maintenance note. */
    const written = new Set(Object.keys((sec.slots) || {}).map(norm));
    const exposed = [...r.mapOnly, ...r.snapOnly].filter(n => written.has(norm(n)));
    reconReport.push({ section: sec.id, matched: [...r.matched.keys()],
                       map_only: r.mapOnly, snapshot_only: r.snapOnly,
                       written_into_unmatched: exposed });
    const detail = 'Matched ' + r.matched.size + '; only in the map: ' + JSON.stringify(r.mapOnly)
      + '; only in the snapshot: ' + JSON.stringify(r.snapOnly) + '. These were NOT joined — a '
      + 'guess here can attach the wrong budget to a slot whose real budget is zero, which is copy '
      + 'that disappears rather than truncates.';
    if (exposed.length) {
      needsSignoff.push(sec.id + ': this page writes copy into ' + JSON.stringify(exposed)
        + ', which the live map and the snapshot do not agree exists under that name, so that copy '
        + 'was checked against no budget or the wrong one. ' + detail
        + ' Decide the mapping for these slots and record it.');
    } else {
      warns.push(sec.id + ': the live map and the snapshot use different slot names here, but this '
        + 'page writes into none of the divergent ones, so no copy on it is affected. ' + detail);
    }
  }
  if (drift.length) {
    warns.push('slot budgets where the live map and the snapshot disagree (the map won): '
      + drift.map(d => d.section + '.' + d.slot + ' ' + d.snapshot + '→' + d.map).join(', ')
      + '. Each is a place the snapshot has fallen behind a deliberate decision.');
  }
}

// ---------------------------------------------------------------- verdict
const verdict = errors.length ? 'FAIL'
  : ((needsSignoff.length || insufficient.length) ? 'INSUFFICIENT-INPUT'
    : (warns.length ? 'WARN' : 'PASS'));

console.log(JSON.stringify({
  errors, warns, needs_human_signoff: needsSignoff, insufficient_input: insufficient, verdict,
  checked: {
    page: arg('--page'), page_sha256: pageSha,
    page_type: pickedType, sections: composed.length,
    composed_strings_checked: composedStrings,
    breakpoints: declaredBps || ['desktop (assumed)'],
    slot_budget_findings: overflows,
    section_source: slotmapPath
      ? slotmapPath + ' (parsed and governing; desktop budgets from the map, mobile from the '
        + 'snapshot — the map carries one figure measured at 1440)'
      : 'bundled section-data.json ONLY — no --slotmap supplied, so budgets are a photograph of the '
        + 'built components and may lag them',
    slotmap_modules: slotmap ? Object.keys(slotmap.modules).length : 0,
    section_library: sectionsPath + ' (' + sectionsSource + ')',
    brand_context: brandContextPath, pack_resolved_by: CTX ? CTX.how : null,
    slot_name_reconciliation: reconReport,
    budget_drift: drift,
    length_policy: 'ADVISORY (ruling 2026-07-25) — web modules are auto-layout and '
      + 'resilience-tested, so budgets warn and never block. Over 2x typical is flagged louder. '
      + 'Hard limits live in the email slotmap and on legally load-bearing slots.',
    prohibited_source: prohibitedSource, prohibited_patterns: prohibitedPatterns.length,
    figure_check: unitAware ? 'unit-aware' : (bare.size ? 'unit-blind' : 'none'),
    ledger: ledgerSource || null, ledger_status: ledgerStatus,
    ledger_trigger_formats: LEDGER ? LEDGER.formats : null,
    paraphrase_review: claims.paraphraseReview(LEDGER, ledgerHits.hits),
    paraphrase_review_required: !!(LEDGER && LEDGER.paraphraseEntries.length),
    cost: provenance.normalizeCost(page.provenance),
    claims_checking: (() => {
      if (!ledger) return 'OFF — prohibited-territory list only; no graded claims rules resolved';
      if (ledgerStatus === 'unverified') return 'UNVERIFIED LEDGER — carries no _status: "production", so it is not treated as counsel-approved. Flags are real; clearance is not implied.';
      if (ledgerStatus === 'fixture') return 'FIXTURE LEDGER — the mechanism is proven, the content is invented. Not a claims clearance.';
      if (ledgerStatus === 'test-seed') return 'TEST-SEED LEDGER (' + ledger.version + ') — ' + LEDGER_RULES.length + ' rules enforce provisionally.';
      return 'on — ' + LEDGER_RULES.length + ' ledger rules applied';
    })(),
    accessibility: 'NOT CHECKED HERE — run scripts/a11y_check.js. Copy passing this lint says '
      + 'nothing about heading structure, link text, alt text or contrast.',
  },
}, null, 1));
process.exit((errors.length || needsSignoff.length || insufficient.length) ? 1 : 0);
