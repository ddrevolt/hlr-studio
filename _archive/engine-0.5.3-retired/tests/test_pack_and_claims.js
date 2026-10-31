#!/usr/bin/env node
/* test_pack_and_claims.js: the engine-level contracts added in the studio-engine refactor.

   1. --pack <folder> resolves the pack on every script that reads one, and behaves exactly like
      --brand-context <file>; a folder with no brand-context.md is exit 2.
   2. The claims ledger upgrade: an old-format ledger (literal triggers) still works; regex
      triggers and lemmas catch a plural and an -ing form that used to buy a PASS; paraphrase_risk
      entries are reported for the verifier, matched or not, and never change the verdict.
   3. The neutral type fixture loads only when no registry resolves, the pack's registry wins when
      it does, and the report names which ran.
   4. The provenance cost object is normalised into every lint report and rendered on the stamp.

   Run: node tests/test_pack_and_claims.js
*/
'use strict';
const { spawnSync } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');

const ROOT = path.normalize(path.join(__dirname, '..'));
const SK = s => path.join(ROOT, 'skills', s, 'scripts');
const COPY = path.join(SK('email-copy'), 'copy_lint.js');
const PAID = path.join(SK('paid-ad-copy'), 'paid_lint.js');
const PAGE = path.join(SK('web-copy'), 'page_lint.js');
const RENDER = path.join(SK('email-copy'), 'render_onepager.js');
const SKU = path.join(SK('email-copy'), 'sku_lookup.js');
const EXPICK = path.join(SK('email-copy'), 'exemplar_pick.js');
const PREFLIGHT = path.join(SK('email-copy'), 'preflight.py');
const SEAM = path.join(SK('email-copy'), 'build_seam_map.py');
const TOKENS = path.join(SK('design-system'), 'tokens_build.js');
const SLOTLINT = path.join(SK('asset-production'), 'slot_lint.js');
const CORPUS = path.join(SK('customer-evidence'), 'corpus_lint.py');
const claims = require(path.join(ROOT, 'lib', 'claims.js'));

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'engine-'));
let uniq = 0;
const w = (n, o) => { const p = path.join(TMP, n); fs.writeFileSync(p, typeof o === 'string' ? o : JSON.stringify(o, null, 1)); return p; };
const run = (cmd, args) => { const r = spawnSync(cmd, args, { encoding: 'utf8' }); let out = null; try { out = JSON.parse(r.stdout); } catch (e) { /* not json */ } return { rc: r.status, out, stdout: r.stdout, stderr: r.stderr }; };
let npass = 0, nfail = 0;
function t(name, fn) { try { fn(); npass++; console.log('  \x1b[32mPASS\x1b[0m  ' + name); } catch (e) { nfail++; console.log('  \x1b[31mFAIL\x1b[0m  ' + name + '\n        ' + e.message); } }
const assert = (c, m) => { if (!c) throw new Error(m); };

/* ---------------------------------------------------------------- a synthetic pack */
function makePack(dir, opts = {}) {
  fs.mkdirSync(dir, { recursive: true });
  const fm = {
    brand: 'Testbrand', voice_contract: 'voice.md', legal_ledger: opts.ledger === null ? null : 'ledger.json',
    product_db: 'products.json', exemplars: null, type_registry_core: opts.registry === null ? null : 'taxonomy.json',
    type_registry_overlay: null, module_library: opts.modlib === null ? null : 'module-library.json',
    slotmap: null, seam_map: null, slotmap_paid: null, slotmap_web: null, section_library: opts.sections ? 'section-data.json' : null,
    tokens: 'tokens.json', figma_config: 'figma.yaml', options_register: 'register.jsonl',
    brand_domains: ['testbrand.example'], recency_months: 12,
    prohibited_patterns: ['weight[- ]?loss', 'lose weight', 'detox', 'clinically', 'miracle', 'risk[- ]?free', 'guaranteed[- ]?results', 'cure(?:s|d)?\\b'],
    ...(opts.fileMap || {}),
  };
  fs.writeFileSync(path.join(dir, 'brand-context.md'), '# ctx\n\n## File map\n\n```json\n' + JSON.stringify(fm, null, 1) + '\n```\n');
  fs.writeFileSync(path.join(dir, 'voice.md'), '# voice\n');
  fs.writeFileSync(path.join(dir, 'products.json'), JSON.stringify({ 'SKU-1': { name: 'Product One', category: 'cat', nutrition: { protein_g: '12' } } }));
  fs.writeFileSync(path.join(dir, 'ledger.json'), JSON.stringify(opts.ledgerDoc || { version: 'test-seed-1', entries: [
    { id: 'L-OLD', topic: 'Old format literal', triggers: ['money-back'], severity: 'needs_legal' },
  ] }));
  fs.writeFileSync(path.join(dir, 'taxonomy.json'), JSON.stringify(opts.registryDoc || { version: '7.1', types: {
    product_grid: { gates: ['angle', 'hero', 'cta', 'offer', 'subject'] },
    brand_only_type: { gates: ['angle', 'hero', 'cta', 'subject'] },
  } }));
  fs.writeFileSync(path.join(dir, 'module-library.json'), JSON.stringify(opts.modlibDoc || {
    _status: 'test', MOD_LABEL: { M13: 'Product feature' }, GEN_LABEL: { prod_heading: 'Product heading' },
    MOD_GEN: { M13: ['prod_heading', 'prod_body'] }, MOD_SHAPE: { M13: 'one idea' } }));
  fs.writeFileSync(path.join(dir, 'tokens.json'), JSON.stringify({ color: { ink: { $value: '#111111', $type: 'color', $description: '[documented] ink' } },
    'contrast-pairs': { pairs: [{ bg: '#ffffff', fg: '{color.ink}', roles: ['body'], source: 'test' }] } }));
  fs.writeFileSync(path.join(dir, 'figma.yaml'), 'slots:\n  namespace: testns\n  key: slot\nfigma:\n  file_key: null\n');
  if (opts.sections) fs.writeFileSync(path.join(dir, 'section-data.json'), fs.readFileSync(path.join(ROOT, 'skills', 'web-copy', 'tests', 'fixtures', 'section-data.fixture.json')));
  return dir;
}
const PACK = makePack(path.join(TMP, 'pack'));
const FACTS = w('facts.json', { allowed_figures: [{ value: '12', unit: 'g', source: 'nutrition.protein_g' }] });

/* ---------------------------------------------------------------- slates */
const AX = ['Benefit', 'Occasion', 'Product', 'Proof', 'Urgency', 'Curiosity'];
const opt = (copy, axis, extra = {}) => ({ copy, axis, score: 15, why: 'because', ...extra });
const gate = (n, mk) => Array.from({ length: n }, (_, i) => mk(i));
const emailSlate = (over = {}) => ({
  skill: 'email-copy', format: 2, type: 'product_grid',
  brief: { name: 'Fixture brief', type: 'product_grid', objective: 'test', audience: 'test' },
  provenance: { generated_at: '2026-09-06', brand: 'Testbrand', brand_context: path.join(PACK, 'brand-context.md'), facts: [], guardrails: ['fixture run'],
                /* 0.3.0: a slate records which favorite and exemplar ids each gate saw; a clean fixture carries the block */
                exemplars_shown: { hero: { favorites: [], exemplars: [], exit: 1, note: 'fixture: no exemplars' } } },
  gates: {
    angle: gate(3, i => opt('Angle line ' + i, AX[i], { tension: 'a real tension ' + i })),
    hero: gate(5, i => opt('Hero line number ' + i, AX[i])),
    subject: gate(5, i => opt('Subject ' + i, AX[i])),
    cta: gate(6, i => opt(['SHOP NOW', 'GET YOURS', 'TRY IT', 'ORDER TODAY', 'SEE THE RANGE', 'START HERE'][i], AX[i])),
    offer: gate(6, i => opt(['Free delivery on your first order', 'Ends Sunday night', 'A second one, free', 'Your first order, for less', 'Only this week', 'Guess what is back'][i], AX[i])),
  },
  modules: {}, routes: [], notes: [], ...over,
});
const emailRun = (slate, extra = []) => run('node', [COPY, '--slate', w('s' + (uniq++) + '.json', slate), '--facts', FACTS, ...extra]);
const withHero = (text) => { const s = emailSlate(); s.gates.hero[0].copy = text; return s; };

const paidSlate = (over = {}) => ({
  skill: 'paid-ad-copy', format: 1, type: 'problem_solution', ratios: ['4x5'],
  brief: { name: 'f', objective: 'o', audience: 'a' }, provenance: { brand_context: 'x' },
  grounding: [{ id: 'G1', source: 's', kind: 'review', text: 'quote' }],
  gates: {
    insight: [{ copy: 'the insight', tension: 't', grounded_in: ['G1'] }],
    concept: gate(3, i => ({ copy: 'Concept ' + i, axis: AX[i], lead_quality: 'q' + i, grounded_in: ['G1'] })),
    copy: [{ axis: 'Problem', primary_text: 'The list on the receipt went through the wash.', headline: 'Every list in one place', description: 'd' },
           { axis: 'Curiosity gap', primary_text: 'There is a reason it opens flat.', headline: 'Look at the spine', description: 'd' },
           { axis: 'Direct address', primary_text: 'You know the lists this is for.', headline: 'For the lists you keep', description: 'd' }],
  }, notes: [], ...over,
});
const paidRun = (slate, extra = []) => run('node', [PAID, '--slate', w('p' + (uniq++) + '.json', slate), '--facts', FACTS, ...extra]);

const SECPACK = makePack(path.join(TMP, 'secpack'), { sections: true });
const pageDoc = (over = {}) => ({
  skill: 'web-copy', format: 1, page_type: 'collection', breakpoints: ['desktop', 'mobile_carousel'],
  brief: { name: 'Everyday', objective: 'trial' }, provenance: { brand_context: 'x' },
  sections: [{ id: 'W12', slots: { title: 'The Desk Collection', description: 'Paper, pens and planners for the week.' } }],
  notes: [], ...over,
});
const pageRun = (page, extra = []) => run('node', [PAGE, '--page', w('w' + (uniq++) + '.json', page), '--facts', FACTS, ...extra]);

/* ================================================================ 1. --pack */
t('copy_lint: --pack behaves like --brand-context on a clean slate', () => {
  const a = emailRun(emailSlate(), ['--pack', PACK]);
  const b = emailRun(emailSlate(), ['--brand-context', path.join(PACK, 'brand-context.md')]);
  assert(a.rc === 0 && a.out.verdict === 'PASS', 'pack run: ' + a.stdout + a.stderr);
  assert(b.rc === 0 && b.out.verdict === 'PASS', 'context run: ' + b.stdout);
  assert(a.out.checked.pack_resolved_by === '--pack' && b.out.checked.pack_resolved_by === '--brand-context', 'report does not say how the pack resolved');
  assert(a.out.checked.brand_context === b.out.checked.brand_context, 'both should resolve the same brand context');
});
t('copy_lint: a --pack folder with no brand-context.md is exit 2, nothing checked', () => {
  const r = emailRun(emailSlate(), ['--pack', path.join(TMP, 'not-a-pack')]);
  assert(r.rc === 2 && /brand-context\.md/.test(r.stderr), 'expected exit 2 naming brand-context.md: ' + r.rc + ' ' + r.stderr);
});
t('copy_lint: --brand-context wins when both flags are given', () => {
  const other = makePack(path.join(TMP, 'other'), { fileMap: { brand: 'Otherbrand' } });
  const r = emailRun(emailSlate(), ['--pack', other, '--brand-context', path.join(PACK, 'brand-context.md')]);
  assert(r.out.checked.brand_context === path.join(PACK, 'brand-context.md'), 'explicit file did not win');
});
t('copy_lint: --brand resolves through a registry (custom --registry) and a missing pack is exit 2', () => {
  const reg = w('reg.yaml', 'version: 1\nbrands:\n  testbrand:\n    name: Testbrand\n    aliases: [TB]\n    pack: ' + PACK + '\n  ghost:\n    name: Ghost\n    aliases: [GH]\n    pack: /nowhere/ghost\n');
  const ok = emailRun(emailSlate(), ['--brand', 'tb', '--registry', reg]);
  assert(ok.rc === 0 && ok.out.checked.pack_resolved_by === '--brand testbrand', 'brand run failed: ' + ok.stdout + ok.stderr);
  const gone = emailRun(emailSlate(), ['--brand', 'GH', '--registry', reg]);
  assert(gone.rc === 2 && /not where it says|no brand-context/.test(gone.stderr), 'missing pack should be exit 2: ' + gone.stderr);
  const unknown = emailRun(emailSlate(), ['--brand', 'nobody', '--registry', reg]);
  assert(unknown.rc === 2 && /no registered brand/.test(unknown.stderr), 'unknown brand should be exit 2');
});
t('--brand reads a pack registered at the Mac path through the claude-cowork mount a Cowork shell sees, and says so', () => {
  const mount = path.join(TMP, 'mnt', 'claude-cowork');
  makePack(path.join(mount, 'mounted', 'brand-pack'));
  const reg = w('reg-mount.yaml', 'version: 1\nbrands:\n  mounted:\n    name: Mounted\n    aliases: [MB]\n    pack: /Users/x/Documents/claude-cowork/mounted/brand-pack\n');
  const args = [COPY, '--slate', w('s' + (uniq++) + '.json', emailSlate()), '--facts', FACTS, '--brand', 'mb', '--registry', reg];
  const r = spawnSync('node', args, { encoding: 'utf8', env: { ...process.env, CLAUDE_COWORK_ROOT: mount } });
  let out = null; try { out = JSON.parse(r.stdout); } catch (e) { /* not json */ }
  assert(out && out.checked.brand_context === path.join(mount, 'mounted', 'brand-pack', 'brand-context.md'), 'not remapped: ' + r.stdout.slice(0, 300) + r.stderr);
  assert(/^--brand mounted \(the registry's pack path \/Users\/x\/Documents\/claude-cowork\/mounted\/brand-pack is not on this machine/.test(out.checked.pack_resolved_by), 'the remap was not said: ' + out.checked.pack_resolved_by);
  const none = spawnSync('node', args, { encoding: 'utf8', cwd: TMP, env: { ...process.env, CLAUDE_COWORK_ROOT: path.join(TMP, 'nowhere') } });
  assert(none.status === 2 && /not where it says/.test(none.stderr), 'a folder that is not mounted should stay missing: ' + none.status + none.stderr);
});
t('paid_lint and page_lint accept --pack', () => {
  const p = paidRun(paidSlate(), ['--pack', PACK]);
  assert(p.out && p.out.checked.pack_resolved_by === '--pack' && p.out.checked.brand_context, 'paid: ' + p.stdout + p.stderr);
  const g = pageRun(pageDoc(), ['--pack', SECPACK]);
  assert(g.out && g.out.checked.pack_resolved_by === '--pack', 'page: ' + g.stdout + g.stderr);
  assert(/section_library/.test(g.out.checked.section_library), 'page_lint did not take the section library from the pack: ' + g.out.checked.section_library);
});
t('page_lint refuses an empty roster and names the section_library role', () => {
  const g = pageRun(pageDoc(), ['--pack', PACK]);
  assert(g.rc === 2 && /section_library/.test(g.stderr), 'expected exit 2 naming the role: ' + g.stderr);
});
t('sku_lookup, exemplar_pick, preflight, build_seam_map, tokens_build, slot_lint and corpus_lint accept --pack', () => {
  const s = run('node', [SKU, '--pack', PACK, '--match', 'product one']);
  assert(s.rc === 0 && s.out.matched[0].sku === 'SKU-1', 'sku_lookup: ' + s.stderr);
  const e = run('node', [EXPICK, '--pack', PACK, '--role', 'headline']);
  assert(e.rc === 2 && /exemplars.*null/.test(e.stderr), 'exemplar_pick should report the null role: ' + e.stderr);
  const pf = run('python3', [PREFLIGHT, '--pack', PACK, '--json']);
  assert(pf.rc === 0 && pf.out.pack_resolved_by === '--pack' && pf.out.resolved.includes('type_registry_core'), 'preflight: ' + pf.stdout + pf.stderr);
  const sm = run('python3', [SEAM, '--pack', PACK, '-o', path.join(TMP, 'seam.json')]);
  assert(sm.rc === 2 && /slotmap.*null/.test(sm.stderr), 'build_seam_map should refuse a null slotmap: ' + sm.stderr);
  const tk = run('node', [TOKENS, 'check', '--pack', PACK]);
  assert(tk.rc === 0 && /PASS/.test(tk.stdout), 'tokens_build check: ' + tk.stdout + tk.stderr);
  const ex = run('node', [TOKENS, 'export', '--pack', PACK, '--out', path.join(TMP, 'tok')]);
  assert(ex.rc === 0 && /--testbrand-color-ink/.test(fs.readFileSync(path.join(TMP, 'tok', 'tokens.css'), 'utf8')), 'tokens_build export prefix: ' + ex.stderr);
  const tpl = w('tpl.json', { W01: { slots: [] } });
  const sl = run('node', [SLOTLINT, '--template', tpl, '--pack', PACK]);
  assert(sl.rc !== 2 || !/namespace resolved/.test(sl.stderr), 'slot_lint did not take the namespace from the pack: ' + sl.stderr);
  const corpus = w('corpus.md', '**1.** "Works fine for me."\n*— reviews.example/1, 2026-05 | speaker:a*\n');
  const cl = run('python3', [CORPUS, corpus, '--pack', PACK, '--json']);
  assert(cl.rc !== 2, 'corpus_lint should take brand_domains from the pack: ' + cl.stderr);
});
t('slot_lint and page_lint read a figma.yaml or slot map carrying block scalars (note: >), as every real pack does', () => {
  const dir = makePack(path.join(TMP, 'folded'));
  fs.writeFileSync(path.join(dir, 'figma.yaml'), 'slots:\n  namespace: foldns\n  key: slot\n  note: >\n    Resolution is by stamp, never by node id,\n    so the maps survive renames.\n\n  prefixes:\n    module: W\n    element: E\nfigma:\n  file_key: null\n');
  const tpl = w('tpl-folded.json', { W01: { slots: [] } });
  const r = run('node', [SLOTLINT, '--template', tpl, '--pack', dir]);
  assert(r.out && !/could not be parsed/.test(String((r.out.errors || [])[0])), 'slot_lint still refuses a folded scalar: ' + r.stdout);
  assert((r.out.notes || []).some(n => /namespace "foldns"/.test(n)), 'namespace not read from the pack config: ' + JSON.stringify(r.out.notes));
  const sm = w('slotmap-folded.yaml', 'meta:\n  namespace: foldns\n  max_width: 1440\n  note: >\n    a folded\n    note\nmodules:\n  W12:\n    name: "Header"\n    slots:\n      - { id: W12.title, role: title, typical_chars: 30 }\n');
  const g = pageRun(pageDoc(), ['--pack', SECPACK, '--slotmap', sm]);
  assert(g.out && g.out.checked.slotmap_modules === 1, 'page_lint did not parse the folded slot map: ' + g.stdout + g.stderr);
});
t('tokens_build export refuses to run with no brand identity at all', () => {
  const r = run('node', [TOKENS, 'export', '--tokens', path.join(PACK, 'tokens.json'), '--out', path.join(TMP, 'tok2')]);
  assert(r.rc === 2 && /brand identity/.test(r.stderr), 'expected a refusal: ' + r.rc + r.stderr);
});

/* ================================================================ 2. claims upgrade */
const ledgerPack = (entries, extra = {}) => makePack(path.join(TMP, 'lp' + (uniq++)), { ledgerDoc: { version: 'test-seed-1', ...extra, entries } });

t('old ledger format (literal triggers) still fires and still escapes regex metacharacters', () => {
  const p = ledgerPack([{ id: 'L1', topic: 'offer', triggers: ['save (big)', 'money-back'], severity: 'needs_legal' }]);
  const hit = emailRun(withHero('Save (big) today'), ['--pack', p]);
  assert(hit.out.verdict === 'FAIL' && hit.out.errors.some(e => /L1 prohibits "Save \(big\)"/.test(e)), 'literal did not fire: ' + hit.stdout);
  /* As a regex "save (big)" would match "save big"; as the literal it is, it must not. */
  const miss = emailRun(withHero('Save big today'), ['--pack', p]);
  assert(miss.out.verdict === 'PASS', 'literal trigger treated as regex: ' + miss.stdout);
  assert(hit.out.checked.ledger_trigger_formats['literal triggers'] === 1, 'format not reported');
});
t('a literal trigger does NOT catch a plural or an -ing form (the gap this upgrade closes)', () => {
  const p = ledgerPack([{ id: 'L1', topic: 'cleanse', triggers: ['cleanse'], severity: 'needs_legal' }]);
  const r = emailRun(withHero('A gentle cleansing ritual'), ['--pack', p]);
  /* "cleanse" is not a substring of "cleansing", so the old format misses it; recorded so the
     next test is proven to be the fix and not a coincidence. */
  assert(r.out.verdict === 'PASS', 'baseline changed: ' + r.stdout);
});
t('lemmas: the plural form fails', () => {
  const p = ledgerPack([{ id: 'L1', topic: 'cleanse', lemmas: ['cleanse'], severity: 'needs_legal' }]);
  const r = emailRun(withHero('Three cleanses a week'), ['--pack', p]);
  assert(r.rc === 1 && r.out.verdict === 'FAIL' && r.out.errors.some(e => /L1 prohibits "cleanses"/.test(e)), 'plural not caught: ' + r.stdout);
});
t('lemmas: the -ing form fails', () => {
  const p = ledgerPack([{ id: 'L1', topic: 'cleanse', lemmas: ['cleanse'], severity: 'needs_legal' }]);
  const r = emailRun(withHero('A gentle cleansing ritual'), ['--pack', p]);
  assert(r.rc === 1 && r.out.verdict === 'FAIL' && r.out.errors.some(e => /L1 prohibits "cleansing"/.test(e)), '-ing not caught: ' + r.stdout);
});
t('lemmas: the -ed form and a multi-word lemma with inflection fail; an unrelated word does not', () => {
  const p = ledgerPack([{ id: 'L1', topic: 'weight', lemmas: ['shed pounds', 'slim'], severity: 'needs_legal' }]);
  assert(emailRun(withHero('She shed pounds fast'), ['--pack', p]).out.verdict === 'FAIL', '-ed not caught');
  assert(emailRun(withHero('Shedding pounds by spring'), ['--pack', p]).out.verdict === 'FAIL', 'multi-word -ing not caught');
  assert(emailRun(withHero('A slimmer profile'), ['--pack', p]).out.verdict === 'PASS', 'comparative "slimmer" is not an inflection and should not fire');
  assert(emailRun(withHero('A slimming routine'), ['--pack', p]).out.verdict === 'FAIL', 'doubled consonant -ing not caught');
});
t('regex triggers: trigger_format "regex" on the entry compiles each trigger as a regex', () => {
  const p = ledgerPack([{ id: 'L1', topic: 'refund', triggers: ['money[- ]?back'], trigger_format: 'regex', severity: 'needs_legal' }]);
  for (const line of ['your money back', 'the money-back promise', 'moneyback terms']) {
    const r = emailRun(withHero(line), ['--pack', p]);
    assert(r.out.verdict === 'FAIL', 'regex trigger missed: ' + line);
  }
  assert(emailRun(withHero('the money came back'), ['--pack', p]).out.verdict === 'PASS', 'regex over-matched');
});
t('regex triggers: ledger-level trigger_format applies to every entry without its own', () => {
  const p = ledgerPack([{ id: 'L1', topic: 'x', triggers: ['glp[- ]?1'], severity: 'needs_legal' },
                        { id: 'L2', topic: 'y', triggers: ['10% off'], trigger_format: 'literal', severity: 'needs_legal' }], { trigger_format: 'regex' });
  assert(emailRun(withHero('GLP1 friendly'), ['--pack', p]).out.verdict === 'FAIL', 'ledger-level regex format ignored');
  const r = emailRun(withHero('Get 10% off'), ['--pack', p]);
  assert(r.out.verdict === 'FAIL' && r.out.checked.ledger_trigger_formats['regex triggers'] === 1 && r.out.checked.ledger_trigger_formats['literal triggers'] === 1, 'per-entry literal override lost: ' + JSON.stringify(r.out.checked.ledger_trigger_formats));
});
t('a regex trigger that does not compile is a refusal (exit 2), not a silent skip', () => {
  const p = ledgerPack([{ id: 'L1', topic: 'x', triggers: ['('], trigger_format: 'regex', severity: 'needs_legal' }]);
  const r = emailRun(emailSlate(), ['--pack', p]);
  assert(r.rc === 2 && /L1 regex trigger/.test(r.stderr), 'expected exit 2: ' + r.rc + ' ' + r.stderr);
});
t('paraphrase_risk entries are reported for the verifier whether or not they matched, and never change the verdict', () => {
  const p = ledgerPack([{ id: 'L9', topic: 'satiety', lemmas: ['satiety'], severity: 'needs_legal', paraphrase_risk: true },
                        { id: 'L8', topic: 'plain', lemmas: ['plain'], severity: 'needs_legal' }]);
  const clean = emailRun(withHero('Stays with you all morning'), ['--pack', p]);
  assert(clean.out.verdict === 'PASS', 'a paraphrase must still pass the lexical lint (the lint never claims to judge meaning): ' + clean.stdout);
  assert(clean.out.checked.paraphrase_review_required === true, 'flag missing');
  const rev = clean.out.checked.paraphrase_review;
  assert(rev.length === 1 && rev[0].id === 'L9' && rev[0].paraphrase_review === true && rev[0].lexical_hits === 0, 'review block wrong: ' + JSON.stringify(rev));
  assert(/did not judge meaning/.test(rev[0].note), 'the note must say meaning was not judged');
  const hit = emailRun(withHero('Built for satiety'), ['--pack', p]);
  assert(hit.out.verdict === 'FAIL' && hit.out.checked.paraphrase_review[0].lexical_hits === 1, 'hit not counted');
  assert(hit.out.errors.some(e => /\[paraphrase_review\]$/.test(e)), 'finding from a flagged entry is not tagged: ' + hit.out.errors.join(' | '));
});
t('the same ledger compiles identically in paid_lint and page_lint (one claims module)', () => {
  const p = ledgerPack([{ id: 'L1', topic: 'cleanse', lemmas: ['cleanse'], severity: 'needs_legal', paraphrase_risk: true }]);
  const paid = paidRun((() => { const s = paidSlate(); s.gates.copy[0].primary_text = 'A cleansing week'; return s; })(), ['--pack', p]);
  assert(paid.out.verdict === 'FAIL' && paid.out.errors.some(e => /L1 prohibits "cleansing"/.test(e)), 'paid missed the lemma: ' + paid.stdout);
  assert(paid.out.checked.paraphrase_review_required === true && paid.out.checked.ledger_trigger_formats.lemmas === 1, 'paid report lacks the claims fields');
  const sp = makePack(path.join(TMP, 'lp-sec'), { sections: true, ledgerDoc: { version: 'test-seed-1', entries: [{ id: 'L1', topic: 'cleanse', lemmas: ['cleanse'], severity: 'needs_legal', paraphrase_risk: true }] } });
  const page = pageRun(pageDoc({ sections: [{ id: 'W12', slots: { title: 'Cleanses for spring', description: 'x' } }] }), ['--pack', sp]);
  assert(page.out.verdict === 'FAIL' && page.out.errors.some(e => /L1 prohibits "Cleanses"/.test(e)), 'page missed the plural: ' + page.stdout);
  assert(page.out.checked.paraphrase_review_required === true, 'page report lacks the claims fields');
});
t('lib/claims: inflect covers plural, -ing, -ed, dropped e, doubled consonant and y-endings', () => {
  const re = l => new RegExp(claims.inflect(l), 'i');
  assert(['cleanse', 'cleanses', 'cleansed', 'cleansing'].every(x => re('cleanse').test(x)), 'e-ending forms');
  assert(['carry', 'carries', 'carried', 'carrying'].every(x => re('carry').test(x)), 'y-ending forms');
  assert(['slim', 'slims', 'slimmed', 'slimming'].every(x => re('slim').test(x)), 'doubled consonant');
  assert(['detox', 'detoxes', 'detoxing'].every(x => re('detox').test(x)), 'x-ending forms');
  assert(!re('cleanse').test('cleanser') && !re('slim').test('slimline'), 'over-match');
});

/* ================================================================ 3. type registry and neutral fixture */
t('the pack registry decides required gates; a brand-only type is ratified there and unknown to the fixture', () => {
  const s = emailSlate({ type: 'brand_only_type', brief: { name: 'x', type: 'brand_only_type', objective: 'o', audience: 'a' } });
  delete s.gates.offer;
  const live = emailRun(s, ['--pack', PACK]);
  assert(live.out.verdict === 'PASS' && /\(live\)/.test(live.out.checked.type_registry), 'live registry not used: ' + live.stdout);
  const fx = emailRun(s, ['--prohibited', w('proh.json', ['detox'])]);
  assert(fx.out.verdict === 'INSUFFICIENT-INPUT' && /neutral fixture/.test(fx.out.checked.type_registry), 'fixture fallback not reported: ' + fx.stdout);
  assert(fx.out.needs_human_signoff.some(x => /neutral fixture/.test(x)), 'the signoff line must name the fixture as the source');
});
t('a registry the pack names and cannot find is exit 2; a null registry falls back to the fixture and says so', () => {
  const broken = makePack(path.join(TMP, 'broken'), { fileMap: { type_registry_core: 'missing.json' } });
  const r = emailRun(emailSlate(), ['--pack', broken]);
  assert(r.rc === 2 && /type_registry_core/.test(r.stderr), 'expected exit 2: ' + r.stderr);
  const nul = makePack(path.join(TMP, 'nul'), { registry: null });
  const n = emailRun(emailSlate(), ['--pack', nul]);
  assert(n.out.verdict === 'PASS' && /neutral fixture/.test(n.out.checked.type_registry), 'null registry should fall back to the fixture and report it: ' + n.stdout);
});
t('the neutral fixture carries no brand: no registered brand named, no restaurant vocabulary, no module library', () => {
  const gd = JSON.parse(fs.readFileSync(path.join(ROOT, 'skills', 'email-copy', 'references', 'gate-data.json'), 'utf8'));
  assert(gd.types_status === 'neutral-fixture', 'fixture not labelled');
  assert(!('MOD_SHAPE' in gd) && !('MOD_GEN' in gd) && !('MOD_LABEL' in gd) && !('GEN_LABEL' in gd), 'module library still in the engine');
  const text = JSON.stringify(gd);
  assert(!/menu|grand.opening/i.test(text), 'restaurant vocabulary in the fixture');
  // whatever registry this engine ships with (none, or a bundle's brands), the fixture names none of them
  const regText = fs.readFileSync(path.join(ROOT, 'brands', 'registry.yaml'), 'utf8').split('\n').filter(l => !/^\s*#/.test(l)).join('\n');
  const names = [...regText.matchAll(/^\s{4}(?:name|aliases):\s*(.+)$/gm)].flatMap(m => m[1].replace(/^\[|\]$/g, '').split(',')).map(x => x.trim()).filter(x => x.length > 1);
  for (const n of names) assert(!new RegExp('(?<![a-z0-9])' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![a-z0-9])', 'i').test(text), 'a registered brand is named in the fixture: ' + n);
  assert(gd.types.find(x => x.id === 'product_grid').gates.join(',') === 'angle,hero,cta,offer,subject', 'product_grid gates changed');
  assert(gd.GATE_META.angle.count === 3 && gd.GATE_META.hero.count === 5 && gd.GATE_META.cta.count === 6, 'GATE_META counts changed');
});
t('module_library.gate_counts overrides a count; the engine default holds without it', () => {
  const ov = makePack(path.join(TMP, 'ov'), { modlibDoc: { _status: 'test', gate_counts: { hero: 3 }, MOD_LABEL: {} } });
  const s = emailSlate(); s.gates.hero = s.gates.hero.slice(0, 3);
  assert(emailRun(s, ['--pack', ov]).out.verdict === 'PASS', 'override not applied');
  const base = emailRun(s, ['--pack', PACK]);
  assert(base.out.verdict === 'FAIL' && base.out.errors.some(e => /need 5/.test(e)), 'engine default lost');
});
t('render_onepager labels modules from the pack module library and marks unknown ones', () => {
  const s = emailSlate({ modules: { M13: [{ vals: { prod_heading: 'A heading' } }], M99: [{ vals: { x: 'y' } }] } });
  const sp = w('r.json', s);
  const lint = run('node', [COPY, '--slate', sp, '--facts', FACTS, '--pack', PACK]);
  const lp = w('r.lint.json', lint.stdout);
  const out = path.join(TMP, 'r.html');
  const r = run('node', [RENDER, '--slate', sp, '--lint', lp, '--out', out, '--pack', PACK]);
  const html = fs.readFileSync(out, 'utf8');
  assert(/Product feature/.test(html) && /UNKNOWN MODULE/.test(html), 'labels not applied: rc ' + r.rc + ' ' + r.stderr);
  const bare = run('node', [RENDER, '--slate', sp, '--lint', lp, '--out', out]);
  assert(!/Product feature/.test(fs.readFileSync(out, 'utf8')), 'labels came from somewhere other than the pack: ' + bare.stderr);
});

/* ================================================================ 4. cost line */
t('every lint report carries provenance.cost normalised, "not measured" when absent', () => {
  const e = emailRun(emailSlate(), ['--pack', PACK]);
  assert(e.out.checked.cost.measured_by === 'not measured' && e.out.checked.cost.model === null, 'email cost default: ' + JSON.stringify(e.out.checked.cost));
  const s = emailSlate(); s.provenance.cost = { model: 'claude-x', input_tokens: 1200, output_tokens: 300, media_calls: 0, measured_by: 'orchestrator' };
  const m = emailRun(s, ['--pack', PACK]);
  assert(m.out.checked.cost.input_tokens === 1200 && m.out.checked.cost.model === 'claude-x', 'measured cost not copied');
  assert(paidRun(paidSlate(), ['--pack', PACK]).out.checked.cost.measured_by === 'not measured', 'paid cost missing');
  assert(pageRun(pageDoc(), ['--pack', SECPACK]).out.checked.cost.measured_by === 'not measured', 'page cost missing');
});
t('the provenance stamp shows "cost: not measured" until values exist, then the values', () => {
  const s = emailSlate(); const sp = w('c.json', s);
  const lp = w('c.lint.json', run('node', [COPY, '--slate', sp, '--facts', FACTS, '--pack', PACK]).stdout);
  const r = run('node', [RENDER, '--slate', sp, '--lint', lp, '--out', path.join(TMP, 'c.html'), '--pack', PACK]);
  assert(/cost: not measured/.test(r.stdout), 'stamp lacks the not-measured line: ' + r.stdout);
  assert(/not measured/.test(fs.readFileSync(path.join(TMP, 'c.html'), 'utf8')), 'one-pager lacks the cost row');
  s.provenance.cost = { model: 'claude-x', input_tokens: 1200, output_tokens: 300, media_calls: 2, measured_by: 'orchestrator' };
  const sp2 = w('c2.json', s);
  const lp2 = w('c2.lint.json', run('node', [COPY, '--slate', sp2, '--facts', FACTS, '--pack', PACK]).stdout);
  const r2 = run('node', [RENDER, '--slate', sp2, '--lint', lp2, '--out', path.join(TMP, 'c2.html'), '--pack', PACK]);
  assert(/cost: model claude-x · in 1200 · out 300 · media 2 · measured by orchestrator/.test(r2.stdout), 'stamp lacks the measured line: ' + r2.stdout);
});

t('build_seam_map carries a proposed slot with max_chars null into the map with its status, and never invents a budget (0.3.0)', () => {
  const sm = w('slotmap-null.yaml', '# test\nmeta:\n  namespace: t\nelements:\n  E13:\n    name: "Item Card"\n    slots:\n      - { id: E13.name, role: name, max_chars: 34, case: title }\n      - { id: E13.descriptor, role: descriptor, max_chars: null, budget: null, case: sentence, status: "proposed, unbuilt" }\nmodules:\n  M12:\n    name: "Hero"\n    slots:\n      - { id: M12.heading, role: heading, max_chars: 64, case: title }\n');
  const out = path.join(TMP, 'seam-null.json');
  const r = run('python3', [SEAM, '--slotmap', sm, '-o', out]);
  assert(r.rc === 0, 'build_seam_map failed: ' + r.stderr);
  const seam = JSON.parse(fs.readFileSync(out, 'utf8'));
  const d = seam.map.E13['E13.descriptor'];
  assert(d && d.max_chars === null && /proposed, unbuilt/.test(d.status), 'the null budget and status were not carried: ' + JSON.stringify(d));
  assert(seam.map.E13['E13.name'].max_chars === 34 && !('status' in seam.map.E13['E13.name']), 'a measured slot changed: ' + JSON.stringify(seam.map.E13['E13.name']));
  assert(seam.map.M12['M12.heading'].max_chars === 64, 'a module slot changed');
});

console.log('\n' + npass + ' passed, ' + nfail + ' failed');
process.exit(nfail ? 1 : 0);
