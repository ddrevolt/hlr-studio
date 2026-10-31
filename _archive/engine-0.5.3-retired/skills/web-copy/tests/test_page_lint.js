#!/usr/bin/env node
/* test_page_lint.js — every rule in page_lint.js as the failure it exists to stop.

   The two that matter most are the ones email and paid do not have: a slot budget that only bites
   at a breakpoint nobody looked at, and a slot the site does not render at all, where copy does not
   truncate — it disappears, and looks correct everywhere you would think to check.

   Run: node tests/test_page_lint.js
*/
const { spawnSync } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');

const LINT = process.env.LINT || path.join(__dirname, '..', 'scripts', 'page_lint.js');
const SECFIX = path.join(__dirname, 'fixtures', 'section-data.fixture.json');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'web-'));
const w = (n, o) => { const p = path.join(TMP, n); fs.writeFileSync(p, typeof o === 'string' ? o : JSON.stringify(o, null, 1)); return p; };
const uniq = () => Math.random().toString(36).slice(2);

const CTX = w('brand-context.md', '```json\n' + JSON.stringify({
  brand: 'Test', prohibited_patterns: ['weight[- ]?loss', 'detox', 'clinically'],
}) + '\n```');
const FACTS = w('facts.json', { allowed_figures: [
  { value: '12', unit: 'g', source: 'nutrition.protein_g' },
  { value: '3', unit: 'months', source: 'refill_interval' },
] });

const basePage = () => ({
  skill: 'web-copy', format: 1, page_type: 'collection',
  brief: { name: 'Desk collection', objective: 'trial' },
  provenance: { generated_at: '2026-07-27' },
  breakpoints: ['desktop', 'mobile_carousel'],
  sections: [
    { id: 'W12', slots: { title: 'The Desk Collection', description: 'Paper, pens and planners for the week.' } },
    { id: 'W03', slots: {
        heading: 'BOUND FOR A REASON',
        card_title: ['Cotton paper', 'Sewn spines', 'Lies flat'],
        card_body: ['Takes ink without bleeding.', 'No glue, no loose pages.', 'Open it and write.'],
        cta_label: 'SHOP NOTEBOOKS' } },
    { id: 'W04', slots: {
        heading: 'Collection FAQs',
        question: ['How long does a refill last?'],
        answer: ['Up to 3 months between refills.'] } },
  ],
});

function run(page, extra = []) {
  const p = w('p-' + uniq() + '.json', page);
  const args = [LINT, '--page', p, '--brand-context', CTX, '--facts', FACTS, '--sections', SECFIX, ...extra];
  const r = spawnSync('node', args, { encoding: 'utf8' });
  let out; try { out = JSON.parse(r.stdout || '{}'); } catch (e) { out = { errors: ['<unparseable>'] }; }
  return { code: r.status, out, stderr: String(r.stderr || '') };
}
let pass = 0, fail = 0;
const t = (name, fn) => { try { fn(); console.log('  \x1b[32mPASS\x1b[0m  ' + name); pass++; }
  catch (e) { console.log('  \x1b[31mFAIL\x1b[0m  ' + name + '\n        ' + e.message); fail++; } };
const expectErr = (r, needle, msg) => {
  if (!(r.out.errors || []).some(e => e.toLowerCase().includes(needle.toLowerCase()))) {
    throw new Error((msg || 'expected an error matching "' + needle + '"') + '; got ' + JSON.stringify(r.out.errors));
  }
};
const expectNotFail = r => { if (r.out.verdict === 'FAIL') throw new Error('rejected valid input: ' + JSON.stringify(r.out.errors)); };
const warnsMatching = (r, re) => (r.out.warns || []).filter(x => re.test(x));

console.log('\npage_lint.js — copy that has to fit boxes somebody already built\n');

t('control: a well-formed collection page is not rejected', () => {
  const r = run(basePage());
  expectNotFail(r);
  if (r.out.verdict === 'INSUFFICIENT-INPUT') throw new Error('reported unrunnable: '
    + JSON.stringify(r.out.insufficient_input));
});

// ---- the breakpoint budget: web's distinguishing check ----
t('B1 copy that fits desktop and not the mobile carousel is caught at the mobile budget', () => {
  const p = basePage();
  p.sections[1].slots.card_body[0] = 'Sewn by hand and pressed flat overnight, every book still opens flat on its first try.';
  const r = run(p);
  const hits = warnsMatching(r, /card_body\[0\].*mobile_carousel/);
  if (!hits.length) throw new Error('an over-budget body passed the carousel slide budget: ' + JSON.stringify(r.out.warns));
  if (warnsMatching(r, /card_body\[0\].*at desktop/).length) throw new Error('it also flagged desktop, where it fits');
});
t('B2 a budget overrun WARNS rather than errors — a derived threshold must not reject', () => {
  const p = basePage();
  p.sections[1].slots.card_body[0] = 'Sewn by hand and pressed flat overnight, every book still opens flat on its first try.';
  expectNotFail(run(p));
});
t('B3 declaring no breakpoints is INSUFFICIENT-INPUT, not a desktop pass', () => {
  const p = basePage(); delete p.breakpoints;
  const r = run(p);
  if (r.out.verdict !== 'INSUFFICIENT-INPUT') throw new Error('verdict was ' + r.out.verdict);
  if (r.code === 0) throw new Error('a desktop-only check exited 0');
  if (!(r.out.insufficient_input || []).some(x => /not a reflow/.test(x))) {
    throw new Error('the reason was not stated: ' + JSON.stringify(r.out.insufficient_input));
  }
});
t('B4 a slot NOT RENDERED at a breakpoint is an ERROR — copy there disappears, it does not truncate', () => {
  const p = basePage();
  p.breakpoints = ['desktop', 'mobile_stack'];
  p.sections.push({ id: 'W02', verbatim_source: 'reviews-platform/0001',
    slots: { pull_quote: 'THE FIRST TO SELL OUT EVERY WEEK', subcopy: 'Something load-bearing here.' } });
  const r = run(p);
  expectErr(r, 'NOT RENDERED', 'copy written into a slot the site does not render passed');
  if (!(r.out.errors || []).some(e => /disappears/.test(e))) throw new Error('the consequence was not stated');
});
t('B5 the same slot is fine when the breakpoint that drops it is not shipped', () => {
  const p = basePage();
  p.breakpoints = ['desktop'];
  p.sections.push({ id: 'W02', verbatim_source: 'reviews-platform/0001',
    slots: { pull_quote: 'THE FIRST TO SELL OUT EVERY WEEK', subcopy: 'Something load-bearing here.' } });
  expectNotFail(run(p));
});

// ---- composition ----
t('C1 a section the library has never heard of is an error', () => {
  const p = basePage(); p.sections.push({ id: 'W99', slots: { heading: 'Ghost' } });
  expectErr(run(p), 'neither the library snapshot');
});
t('C2 a slot that does not exist on its section is an error, and lists the real ones', () => {
  const p = basePage(); p.sections[0].slots.subtitle = 'Nope';
  const r = run(p);
  expectErr(r, 'does not exist on');
  if (!(r.out.errors || []).some(e => /has: title, description/.test(e))) throw new Error('the real slots were not listed');
});
t('C3 a page type that requires a section without it is an error', () => {
  const p = basePage(); p.page_type = 'editorial';
  expectErr(run(p), 'requires section', 'an editorial page with no SEO block passed as one');
});
t('C4 a page composing no sections at all is an error', () => {
  const p = basePage(); p.sections = [];
  expectErr(run(p), 'composes no sections');
});
t('C5 an unratified page type blocks rather than passing', () => {
  const p = basePage(); p.page_type = 'microsite';
  const r = run(p);
  if (r.out.verdict !== 'INSUFFICIENT-INPUT') throw new Error('verdict was ' + r.out.verdict);
  if (r.code === 0) throw new Error('exit 0 on an unknown page type');
});
t('C6 writing copy into a section that takes none is an error', () => {
  const p = basePage(); p.sections.push({ id: 'W19', slots: { heading: 'A band with words' } });
  expectErr(run(p), 'takes no copy');
});
t('C7 missing brief or provenance is an error', () => {
  expectErr(run((() => { const p = basePage(); delete p.brief; return p; })()), 'no `brief` block');
  expectErr(run((() => { const p = basePage(); delete p.provenance; return p; })()), 'no `provenance` block');
});

// ---- claims, on the longest-lived surface ----
t('L1 a prohibited territory in page copy is an error', () => {
  const p = basePage(); p.sections[0].slots.description = 'A clinically proven detox.';
  expectErr(run(p), 'prohibited territory');
});
t('L2 an unverified figure is an error', () => {
  const p = basePage(); p.sections[2].slots.answer[0] = 'Up to 9 months between refills.';
  expectErr(run(p), 'not verified');
});
t('L3 a verified figure in its own unit passes', () => {
  expectNotFail(run(basePage()));
});
t('L4 no prohibited list resolved -> refuses to run', () => {
  const p = w('p-' + uniq() + '.json', basePage());
  const ctx = w('empty-' + uniq() + '.md', '```json\n{"prohibited_patterns": []}\n```');
  const r = spawnSync('node', [LINT, '--page', p, '--brand-context', ctx, '--sections', SECFIX], { encoding: 'utf8' });
  if (r.status === 0) throw new Error('linted a page against no claims rules at all');
  if (!/stays up until somebody notices/.test(r.stderr + r.stdout)) throw new Error('wrong reason');
});
t('L5 a ledger with no _status is UNVERIFIED, never production', () => {
  const lg = w('lg.json', { version: '1.0', entries: [
    { id: 'L-002', topic: 'health', status: 'prohibited', pattern: 'boosts?\\s+immunity' }] });
  const r = run(basePage(), ['--ledger', lg]);
  if (!/UNVERIFIED LEDGER/.test(r.out.checked.claims_checking)) {
    throw new Error('an unfinished ledger read as approved: ' + r.out.checked.claims_checking);
  }
});
t('L6 an unresolvable conditional blocks rather than warning', () => {
  const lg = w('lg2.json', { _status: 'production', entries: [
    { id: 'L-009', topic: 'sourcing', status: 'conditional', pattern: '\\bcotton\\b', ruling: 'counsel to supply wording' }] });
  const r = run(basePage(), ['--ledger', lg]);
  if (r.out.verdict !== 'INSUFFICIENT-INPUT') throw new Error('verdict was ' + r.out.verdict);
  if (r.code === 0) throw new Error('an unresolvable claims rule was shippable');
});

// ---- the section's own rules ----
t('S1 a verbatim section with no citation is an error', () => {
  const p = basePage();
  p.breakpoints = ['desktop'];
  p.sections.push({ id: 'W02', slots: { pull_quote: 'THE FIRST TO SELL OUT', review_quote: ['Best thing I buy.'] } });
  expectErr(run(p), 'cites nothing', 'invented reviewer copy could ship again');
});
t('S2 an open modelling decision is surfaced on every page that touches it', () => {
  const p = basePage();
  p.breakpoints = ['desktop'];
  p.sections.push({ id: 'W01', slots: { heading: 'WRITE IT DOWN', body: 'Five notebooks, one cover.' } });
  if (!warnsMatching(run(p), /unresolved modelling decision/).length) {
    throw new Error('a page was written against a component that will move, silently');
  }
});

// ---- SEO, where it belongs ----
t('E1 an intent with no SEO block to put it in warns', () => {
  const p = basePage(); p.search_intent = 'best notebook for fountain pens';
  if (!warnsMatching(run(p), /composes no SEO block/).length) throw new Error('unreported');
});
t('E2 an SEO block with no declared intent warns', () => {
  const p = basePage(); p.page_type = 'editorial';
  p.sections.push({ id: 'W18', slots: { body: 'Long form copy about paper weights.' } });
  if (!warnsMatching(run(p), /declares no `search_intent`/).length) throw new Error('unreported');
});
t('E3 several intents on one page warns', () => {
  const p = basePage(); p.page_type = 'editorial';
  p.search_intent = ['notebooks', 'planners', 'fountain pens'];
  p.sections.push({ id: 'W18', slots: { body: 'Long form.' } });
  if (!warnsMatching(run(p), /search intents/).length) throw new Error('unreported');
});

// ---- reporting ----
t('R1 the report fingerprints the page and names the section source', () => {
  const c = run(basePage()).out.checked;
  if (!/^[0-9a-f]{64}$/.test(c.page_sha256 || '')) throw new Error('no fingerprint');
  if (!/no --slotmap supplied/.test(c.section_source)) throw new Error('it does not say budgets came from the snapshot alone');
});
t('R2 the report says accessibility was NOT checked here', () => {
  const c = run(basePage()).out.checked;
  if (!/NOT CHECKED HERE/.test(c.accessibility || '')) {
    throw new Error('a clean copy lint could be read as an accessible page');
  }
});

/* ---- --slotmap: the flag must not claim a check it did not run ----
   Found by two independent eval responders on 2026-07-27, reproduced with a path that does not
   exist: the report came back `<path> (live)`, verdict WARN, exit 0. Every web page ever linted
   with this flag was checked against the bundled snapshot while its report named the live map.
   These four are the regression, and all four fail against the pre-fix script. */
t('SM1 an unreadable --slotmap exits 2 rather than silently using the snapshot', () => {
  const r = run(basePage(), ['--slotmap', path.join(TMP, 'does-not-exist.yaml')]);
  if (r.code !== 2) throw new Error('expected exit 2 (could not start), got ' + r.code);
  if (!/cannot read the slot map/i.test(r.stderr)) throw new Error('no actionable message on stderr');
});
t('SM2 an unreadable --slotmap never reports the path as (live)', () => {
  const r = run(basePage(), ['--slotmap', '/nonexistent/NOPE.yaml']);
  const src = (r.out.checked || {}).section_source || '';
  if (/\(live\)/.test(src)) throw new Error('report claims a live check against a file that does not exist: ' + src);
});
t('SM3 a parseable --slotmap is actually parsed and governs', () => {
  const sm = w('slotmap_web.yaml', [
    'meta:', '  namespace: fixture', '  max_width: 1440',
    'modules:', '  W01:', '    name: "Split Promo"', '    slots:',
    '      - { id: W01.eyebrow, role: eyebrow, typical_chars: 64, case: upper }',
    '      - { id: W01.heading, role: heading, typical_chars: 72, case: title }',
    '      - { id: W01.body, role: body, typical_chars: 230, case: sentence }',
  ].join('\n'));
  const r = run(basePage(), ['--slotmap', sm]);
  const c = r.out.checked || {};
  if (!/parsed and governing/.test(c.section_source || '')) {
    throw new Error('the map was not reported as governing: ' + c.section_source);
  }
  if (c.slotmap_modules !== 1) throw new Error('expected 1 parsed module, got ' + c.slotmap_modules);
  if ((r.out.insufficient_input || []).some(x => /NOT loaded/i.test(x))) {
    throw new Error('still claiming the map did not load');
  }
});

t('SM3b an unparseable --slotmap exits 2 rather than falling back to the snapshot', () => {
  const sm = w('slotmap_web.yaml', 'modules:\n  W01:\n    slots:\n      - { id: W01.a, role: a\n');
  const r = run(basePage(), ['--slotmap', sm]);
  if (r.code !== 2) throw new Error('expected exit 2, got ' + r.code);
  if (!/Refusing to fall back/.test(r.stderr + JSON.stringify(r.out))) {
    throw new Error('it did not say it refused the fallback');
  }
});

t('SM3c a map that parses but carries no modules is not a live-map run', () => {
  const sm = w('slotmap_web.yaml', 'meta:\n  modules: 20\n');
  const r = run(basePage(), ['--slotmap', sm]);
  if (r.code !== 2) throw new Error('expected exit 2, got ' + r.code);
  if (!/no `modules:` block/.test(r.stderr)) throw new Error('no actionable message');
});

t('SM4 omitting --slotmap says budgets came from the snapshot alone, and does not block', () => {
  const r = run(basePage());
  if (r.out.verdict === 'INSUFFICIENT-INPUT') throw new Error('over-blocked a run that never asked for the live map');
  const src = (r.out.checked || {}).section_source || '';
  if (!/no --slotmap supplied/.test(src)) throw new Error('snapshot not named as the only source: ' + src);
  if (!/may lag/.test(src)) throw new Error('it does not admit the snapshot can lag the components');
});

/* ---- what the loader is FOR: the map wins, and disagreements are reported ---- */
const LIVEMAP = () => w('slotmap_web.yaml', [
  'meta:', '  namespace: fixture', '  max_width: 1440',
  'modules:', '  W01:', '    name: "Split Promo"', '    slots:',
  '      - { id: W01.eyebrow, role: eyebrow, typical_chars: 64, case: upper }',
  '      - { id: W01.heading, role: heading, typical_chars: 72, case: title }',
  '      - { id: W01.body, role: body, typical_chars: 230, case: sentence }',
].join('\n'));

t('SM5 the map wins on a budget the snapshot has stale, and the drift is reported', () => {
  // Snapshot W01.eyebrow is 35; the map says 64 (raised in the map, not in the snapshot). A 40-char
  // eyebrow must NOT warn, and the disagreement must be visible.
  const p = basePage();
  p.sections = [{ id: 'W01', slots: { eyebrow: 'x'.repeat(40) } }];
  const r = run(p, ['--slotmap', LIVEMAP()]);
  const overflowed = (r.out.checked.slot_budget_findings || [])
    .some(f => f.slot === 'eyebrow' && f.breakpoint === 'desktop');
  if (overflowed) throw new Error('copy inside the LIVE budget was flagged against the stale one');
  const drift = r.out.checked.budget_drift || [];
  if (!drift.some(d => d.slot === 'eyebrow' && d.snapshot === 35 && d.map === 64)) {
    throw new Error('the 35 -> 64 drift was not reported: ' + JSON.stringify(drift));
  }
});

t('SM6 mobile budgets still come from the snapshot, because the map has one figure at 1440', () => {
  const p = basePage();
  p.breakpoints = ['desktop', 'mobile_stack'];
  p.sections = [{ id: 'W01', slots: { eyebrow: 'x'.repeat(40) } }];
  const r = run(p, ['--slotmap', LIVEMAP()]);
  const mob = (r.out.checked.slot_budget_findings || [])
    .find(f => f.slot === 'eyebrow' && f.breakpoint === 'mobile_stack');
  if (!mob) throw new Error('the mobile budget stopped being checked once the map loaded');
  if (mob.budget !== 30) throw new Error('mobile budget should be the snapshot 30, got ' + mob.budget);
  if (!/snapshot/.test(mob.source || '')) throw new Error('mobile source not labelled snapshot');
});

t('SM7 a slot only the map knows is accepted on the map authority, not rejected', () => {
  const sm = w('slotmap_web.yaml', [
    'meta:', '  namespace: fixture',
    'modules:', '  W01:', '    slots:',
    '      - { id: W01.kicker, role: kicker, typical_chars: 40, case: upper }',
  ].join('\n'));
  const p = basePage();
  p.sections = [{ id: 'W01', slots: { kicker: 'Short line' } }];
  const r = run(p, ['--slotmap', sm]);
  if ((r.out.errors || []).some(e => /does not exist/.test(e))) {
    throw new Error('rejected a slot the built component actually has: ' + JSON.stringify(r.out.errors));
  }
  if (!(r.out.warns || []).some(x => /exists in .* but not in the bundled snapshot/.test(x))) {
    throw new Error('accepted it silently rather than flagging the stale snapshot');
  }
});

t('SM8 a slot in neither source is still an error, and says so', () => {
  const p = basePage();
  p.sections = [{ id: 'W01', slots: { invented: 'nope' } }];
  const r = run(p, ['--slotmap', LIVEMAP()]);
  if (!(r.out.errors || []).some(e => /the live map does not have it either/.test(e))) {
    throw new Error('did not confirm the map was consulted: ' + JSON.stringify(r.out.errors));
  }
});

t('SM9 divergent slot vocabularies are reported for a human, never guessed at', () => {
  // The map calls them reason.*; the snapshot calls them card_*. Joining those by guess would
  // attach the wrong budget, so the lint must surface it instead.
  const sm = w('slotmap_web.yaml', [
    'meta:', '  namespace: fixture',
    'modules:', '  W03:', '    slots:',
    '      - { id: W03.heading, role: heading, typical_chars: 36, case: upper }',
    '      - { id: W03.reason.title, role: title, typical_chars: 28, case: title }',
    '      - { id: W03.reason.body, role: body, typical_chars: 96, case: sentence }',
  ].join('\n'));
  const p = basePage();
  p.breakpoints = ['desktop', 'mobile_carousel'];
  p.sections = [{ id: 'W03', slots: { heading: 'Why it works' } }];
  const r = run(p, ['--slotmap', sm]);
  const rec = (r.out.checked.slot_name_reconciliation || []).find(x => x.section === 'W03');
  if (!rec) throw new Error('no reconciliation reported for a section whose names diverge');
  if (!rec.map_only.includes('W03.reason.title')) throw new Error('map-only slot not listed: ' + JSON.stringify(rec));
  if (!rec.snapshot_only.includes('card_title')) throw new Error('snapshot-only slot not listed: ' + JSON.stringify(rec));
  if (!rec.matched.includes('heading')) throw new Error('the one real match was not found');
  // The page writes only into `heading`, which BOTH sources have — so the divergence is a library
  // note, not a blocker on this page's copy.
  if (!(r.out.warns || []).some(x => /writes into none of the divergent ones/.test(x))) {
    throw new Error('an untouched divergence was escalated instead of noted');
  }
  if ((r.out.needs_human_signoff || []).some(x => /W03/.test(x))) {
    throw new Error('blocked a page whose copy is not exposed to the divergence');
  }
});

t('SM9b a divergence the page DOES write into is escalated, not just noted', () => {
  const sm = w('slotmap_web.yaml', [
    'meta:', '  namespace: fixture',
    'modules:', '  W03:', '    slots:',
    '      - { id: W03.heading, role: heading, typical_chars: 36, case: upper }',
    '      - { id: W03.reason.title, role: title, typical_chars: 28, case: title }',
  ].join('\n'));
  const p = basePage();
  p.breakpoints = ['desktop', 'mobile_carousel'];
  p.sections = [{ id: 'W03', slots: { heading: 'Why it works', card_title: 'Cotton paper' } }];
  const r = run(p, ['--slotmap', sm]);
  if (!(r.out.needs_human_signoff || []).some(x => /writes copy into .*card_title/.test(x))) {
    throw new Error('copy landing in an unreconciled slot was not escalated: '
      + JSON.stringify(r.out.needs_human_signoff));
  }
  const rec = (r.out.checked.slot_name_reconciliation || []).find(x => x.section === 'W03');
  if (!rec.written_into_unmatched.includes('card_title')) {
    throw new Error('exposure not recorded in the report: ' + JSON.stringify(rec));
  }
});

t('SM10 the report states the advisory length policy rather than implying enforcement', () => {
  const r = run(basePage(), ['--slotmap', LIVEMAP()]);
  const pol = (r.out.checked || {}).length_policy || '';
  if (!/ADVISORY/.test(pol)) throw new Error('length policy not stated: ' + pol);
  if (!/never block/.test(pol)) throw new Error('the policy does not say budgets never block');
});

t('SM11 copy far past typical is flagged louder, still without blocking', () => {
  const p = basePage();
  p.sections = [{ id: 'W01', slots: { eyebrow: 'x'.repeat(200) } }];   // >2x the live 60
  const r = run(p, ['--slotmap', LIVEMAP()]);
  if ((r.out.errors || []).length) throw new Error('advisory budget blocked: ' + JSON.stringify(r.out.errors));
  if (!(r.out.warns || []).some(x => /more than 2x typical/.test(x))) {
    throw new Error('far-over copy was not flagged louder than a normal overflow');
  }
});

console.log('\n' + pass + ' passed, ' + fail + ' failed\n');
fs.rmSync(TMP, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
