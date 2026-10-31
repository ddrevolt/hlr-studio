#!/usr/bin/env node
/* test_exemplar_pick.js — the voice model reaches the gate, and says when it is thin.

   What these encode is not a script's contract, it is the 27 July failure. The
   exemplars stopped reaching the generator and every automated check stayed green,
   because the checks grade whether rules fired and nothing graded whether the
   generator was shown any of the brand's writing. So the first tests here are the ones that
   would have gone red that day: a missing file is exit 2 with a sentence, an
   unmatched role is exit 1 rather than a silent substitution, and a thin match
   says so out loud instead of pretending it is a voice model.

   Run: node tests/test_exemplar_pick.js
*/
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');

const PICK = path.join(__dirname, '..', 'scripts', 'exemplar_pick.js');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'exemplar-'));
const uniq = () => Math.random().toString(36).slice(2);

const ex = (role, type, text, voice) => ({ id: 'x' + uniq().slice(0, 4), text, role, type, voice: voice || 'Plain' });
function file(list) {
  const p = path.join(TMP, 'ex-' + uniq() + '.json');
  fs.writeFileSync(p, JSON.stringify({ version: 1, exemplars: list }));
  return p;
}
function run(args) {
  try { return { code: 0, out: execFileSync('node', [PICK, ...args], { encoding: 'utf8' }), err: '' }; }
  catch (e) { return { code: e.status, out: String(e.stdout || ''), err: String(e.stderr || '') }; }
}
const j = (args) => { const r = run([...args, '--json']); return { ...r, obj: r.out ? JSON.parse(r.out) : null }; };

// A pool with enough headlines to be a real pattern, and deliberately thin elsewhere.
const POOL = () => [
  ex('headline', 'product_launch', 'Ink Blue, now in A5', 'Playful'),
  ex('headline', 'product_launch', 'Twelve covers walked into a bindery', 'Playful'),
  ex('headline', 'product_launch', 'Opens flat, stays flat', 'Easy'),
  ex('headline', 'product_launch', 'The planner with room for Sunday', 'Plain'),
  ex('headline', 'occasion', 'A notebook for the first day of term', 'Plain'),
  ex('headline', 'occasion', 'Lists for a long weekend', 'Playful'),
  ex('body', 'product_launch', 'Sixty sheets of cotton paper, sewn in fours.', 'Warm'),
  ex('cta', 'product_launch', 'GET YOURS', 'Easy'),
  ex('testimonial', 'testimonial', 'My handwriting got neater, honestly.', 'Plain'),
];

let pass = 0, fail = 0;
const t = (name, fn) => { try { fn(); console.log('  \x1b[32mPASS\x1b[0m  ' + name); pass++; }
  catch (e) { console.log('  \x1b[31mFAIL\x1b[0m  ' + name + '\n        ' + e.message); fail++; } };

console.log('\nexemplar_pick.js — the voice model reaches the gate\n');

t('EP1 matching exemplars are returned for a role and type', () => {
  const r = j(['--file', file(POOL()), '--role', 'headline', '--type', 'product_launch']);
  if (r.code !== 0) throw new Error('exit ' + r.code + ' on a healthy pick');
  if (r.obj.matched !== 4) throw new Error('expected 4 matches, got ' + r.obj.matched);
  if (r.obj.exemplars.some(e => e.role !== 'headline')) throw new Error('a foreign role leaked into the pick');
});

t('EP2 a missing file is exit 2 with a sentence, never a silent empty pick', () => {
  const r = run(['--file', '/nonexistent/NOPE.json', '--role', 'headline']);
  if (r.code !== 2) throw new Error('expected exit 2, got ' + r.code);
  if (/TypeError|at Object|at Module/.test(r.err)) throw new Error('a stack trace reached the caller');
  if (!/silent drop|27 July/.test(r.err)) throw new Error('the error does not say what the consequence is: ' + r.err);
});

t('EP3 no --file at all is exit 2 — the 27 July failure mode', () => {
  const r = run(['--role', 'headline']);
  if (r.code !== 2) throw new Error('running with no exemplars at all was treated as fine: exit ' + r.code);
  if (!/generic/.test(r.err)) throw new Error('the error does not name the cost: ' + r.err);
});

t('EP4 an unmatched role exits 1 rather than substituting another role', () => {
  const r = run(['--file', file(POOL()), '--role', 'preheader']);
  if (r.code !== 1) throw new Error('expected exit 1, got ' + r.code);
  if (/Ink Blue/.test(r.out)) throw new Error("a headline was handed to a preheader gate");
  if (!/do not\s+substitute|not\s+substitute/i.test(r.err)) throw new Error('no instruction on what to do instead: ' + r.err);
});

t('EP5 a thin match is reported as thin, not passed off as a voice model', () => {
  const r = j(['--file', file(POOL()), '--role', 'testimonial']);
  if (!r.obj.thin) throw new Error('a 1-exemplar pick was not flagged thin');
  if (!r.obj.notes.some(n => /imitate these lines rather than the voice/.test(n)))
    throw new Error('the note does not name the parroting risk: ' + JSON.stringify(r.obj.notes));
  if (r.code !== 0) throw new Error('a thin pick blocked the run — it should warn, not block');
});

t('EP6 a healthy match is NOT flagged thin (over-warning control)', () => {
  const r = j(['--file', file(POOL()), '--role', 'headline', '--type', 'product_launch']);
  if (r.obj.thin) throw new Error('4 exemplars were called thin — the warning would become noise');
  if (r.obj.notes.length) throw new Error('unnecessary notes on a healthy pick: ' + JSON.stringify(r.obj.notes));
});

t('EP7 a thin type widens to the role, and says that it did', () => {
  const r = j(['--file', file(POOL()), '--role', 'headline', '--type', 'occasion']);
  if (r.obj.matched < 3) throw new Error('the pick did not widen: ' + r.obj.matched);
  if (!r.obj.notes.some(n => /widened/.test(n))) throw new Error('widening was silent: ' + JSON.stringify(r.obj.notes));
  if (r.obj.exemplars.some(e => e.role !== 'headline')) throw new Error('widening crossed roles, which it must never do');
});

t('EP8 role is never relaxed, even when that leaves the pick thin', () => {
  const only = [ex('cta', 'product_launch', 'GET YOURS', 'Easy')];
  const r = j(['--file', file(only), '--role', 'cta', '--type', 'occasion']);
  if (r.obj.exemplars.some(e => e.role !== 'cta')) throw new Error('a non-cta line reached a cta gate');
  if (!r.obj.thin) throw new Error('a 1-line pick was not flagged thin');
});

t('EP9 a voice filter narrows but never invents, and admits when it could not apply', () => {
  const hit = j(['--file', file(POOL()), '--role', 'headline', '--voice', 'Playful']);
  if (hit.obj.exemplars.some(e => e.voice !== 'Playful')) throw new Error('the voice filter leaked');
  const miss = j(['--file', file(POOL()), '--role', 'cta', '--voice', 'Warm']);
  if (!miss.obj.notes.some(n => /no "Warm" exemplar/.test(n)))
    throw new Error('an unsatisfiable voice filter passed silently: ' + JSON.stringify(miss.obj.notes));
});

t('EP10 the human-readable output tells the generator not to carry claims over', () => {
  const r = run(['--file', file(POOL()), '--role', 'headline', '--type', 'product_launch']);
  if (!/facts layer/.test(r.out)) throw new Error('nothing stops a figure being copied out of an exemplar');
  if (!/Do not reuse the words/.test(r.out)) throw new Error('nothing warns against verbatim reuse');
});

t('EP11 --coverage reports empty and single-line cells', () => {
  const r = j(['--file', file(POOL()), '--coverage']);
  const obj = JSON.parse(run(['--file', file(POOL()), '--coverage']).out);
  if (obj.total !== 9) throw new Error('wrong total: ' + obj.total);
  if (!obj.thin_or_empty.some(c => c.count === 0)) throw new Error('no empty cell reported on a sparse pool');
  if (!obj.by_role.headline) throw new Error('no per-role counts');
});

t('EP12 malformed and empty files are exit 2, not an empty pick', () => {
  const bad = path.join(TMP, 'bad-' + uniq() + '.json');
  fs.writeFileSync(bad, '{ not json');
  if (run(['--file', bad, '--role', 'headline']).code !== 2) throw new Error('malformed JSON did not exit 2');
  const empty = file([]);
  if (run(['--file', empty, '--role', 'headline']).code !== 2) throw new Error('an empty exemplar file did not exit 2');
  const noKey = path.join(TMP, 'nokey-' + uniq() + '.json');
  fs.writeFileSync(noKey, JSON.stringify({ version: 1 }));
  if (run(['--file', noKey, '--role', 'headline']).code !== 2) throw new Error('a file with no exemplars key did not exit 2');
});

/* ---------------------------------------------------------------------------
   CHANNEL — the defect found the same day the script shipped.

   The exemplar file was built for email and had no channel field, and the pick
   matched on role name alone. `headline` exists on all three surfaces and means
   three different jobs: an email hero to an opted-in reader, a ~40-char paid
   field competing in a feed, a web heading orienting someone already on the page.
   Nothing stopped an email headline being handed to a paid gate. That failure is
   worse than a bad pick because the output comes back fluent and on voice and
   wrong for the surface — which survives review in a way obviously-bad copy does
   not. Channel is now filtered before role and is never relaxed.
   --------------------------------------------------------------------------- */

const ch = (channel, role, type, text) => ({ id: 'c' + uniq().slice(0, 4), channel, text, role, type, voice: 'Plain' });
const MIXED = () => [
  ch('email', 'headline', 'product_launch', 'A cover for every kind of week'),
  ch('email', 'headline', 'product_launch', 'Twelve colours, cut by hand'),
  ch('email', 'headline', 'product_launch', 'The planner that starts on Monday'),
  ch('paid', 'headline', 'product_launch', 'Cotton paper, sewn in fours'),
  ch('paid', 'headline', 'product_launch', 'Bring the good pen'),
  ch('paid', 'primary_text', 'product_launch', 'Our binder sews every spine by hand, sixteen pages at a time.'),
  ch('web', 'heading', 'collection', 'The Everyday Collection'),
];

t('EP13 a channel filter never leaks another surface in', () => {
  const r = j(['--file', file(MIXED()), '--channel', 'paid', '--role', 'headline']);
  if (r.obj.exemplars.some(e => e.channel !== 'paid'))
    throw new Error('an email line reached a paid gate: ' + JSON.stringify(r.obj.exemplars.map(e => e.channel)));
  if (r.obj.matched !== 2) throw new Error('expected 2 paid headlines, got ' + r.obj.matched);
});

t('EP14 channel is never relaxed to widen a thin pick', () => {
  // paid has 2 headlines — under THIN. Widening must NOT reach for email's 3.
  const r = j(['--file', file(MIXED()), '--channel', 'paid', '--role', 'headline', '--type', 'occasion']);
  if (r.obj.exemplars.some(e => e.channel !== 'paid'))
    throw new Error('widening crossed channels — the exact failure this guards');
  if (!r.obj.thin) throw new Error('a 2-line pick was not flagged thin');
});

t('EP15 a channel with no exemplars exits 1 and forbids falling back', () => {
  const r = run(['--file', file(MIXED()), '--channel', 'sms', '--role', 'headline']);
  if (r.code !== 1) throw new Error('expected exit 1, got ' + r.code);
  if (/cut by hand|good pen/.test(r.out)) throw new Error("another channel's copy was handed over anyway");
  if (!/do NOT fall back/.test(r.err)) throw new Error('no instruction against falling back: ' + r.err);
});

t('EP16 a multi-channel file with NO --channel refuses rather than mixing', () => {
  const r = run(['--file', file(MIXED()), '--role', 'headline']);
  if (r.code !== 2) throw new Error('a multi-channel file silently mixed: exit ' + r.code);
  if (!/more than one channel/.test(r.err)) throw new Error('the error does not name the cause: ' + r.err);
});

t('EP17 an untagged file refuses a channel filter rather than matching everything', () => {
  const r = run(['--file', file(POOL()), '--channel', 'email', '--role', 'headline']);
  if (r.code !== 2) throw new Error('an untagged file accepted a channel filter: exit ' + r.code);
  if (!/cannot prove/.test(r.err)) throw new Error('the error does not explain why: ' + r.err);
});

t('EP18 a single-channel file still works without --channel (compat control)', () => {
  const oneChannel = MIXED().filter(e => e.channel === 'email');
  const r = j(['--file', file(oneChannel), '--role', 'headline']);
  if (r.code !== 0) throw new Error('a single-channel file was refused: exit ' + r.code);
  if (r.obj.matched !== 3) throw new Error('expected 3, got ' + r.obj.matched);
});

t('EP19 --coverage reports per channel, not across all of them', () => {
  const r = JSON.parse(run(['--file', file(MIXED()), '--channel', 'email', '--coverage']).out);
  if (r.total !== 3) throw new Error('coverage counted other channels: total ' + r.total);
});

/* ---------------------------------------------------------------------------
   FAVORITES (0.3.0). An owner's blind keeps are the target; a historical exemplar corpus only fills
   what they leave (the first calibrated owner cut every line drawn from his). So
   favorites matching role and channel go first, historical lines fill the rest, every pick
   records the ids it showed, and a cut never reaches a writer.
   --------------------------------------------------------------------------- */
const favFile = (list, extra) => {
  const p = path.join(TMP, 'fav-' + uniq() + '.json');
  fs.writeFileSync(p, JSON.stringify({ _role: 'favorites', brief_type: 'sale_launch', favorites: list, ...(extra || {}) }));
  return p;
};
const fav = (id, role, text, channel, more) => ({ id, role, text, channel: channel === undefined ? 'email' : channel, ...(more || {}) });
const FAVS = () => [
  fav('fav1', 'headline', 'Write it down before it gets away.'),
  fav('fav2', 'headline', 'Paper that forgives a heavy hand.'),
  fav('fav3', 'cta', 'PICK A COVER'),
  fav('fav4', 'headline', 'Cotton paper, sewn in fours', 'paid'),
];

t('EP20 favorites matching the role are shown FIRST and historical exemplars fill the remaining slots', () => {
  const r = j(['--file', file(MIXED()), '--favorites', favFile(FAVS()), '--channel', 'email', '--role', 'headline', '--type', 'product_launch']);
  if (r.code !== 0) throw new Error('exit ' + r.code + ': ' + r.err);
  const src = r.obj.exemplars.map(e => e.source);
  if (src[0] !== 'favorites' || src[1] !== 'favorites') throw new Error('favorites did not come first: ' + JSON.stringify(src));
  if (!src.slice(2).every(x => x === 'exemplars')) throw new Error('historical lines should fill the rest: ' + JSON.stringify(src));
  if (r.obj.matched !== 5) throw new Error('expected 2 favorites + 3 historical = 5, got ' + r.obj.matched);
  if (r.obj.exemplars.some(e => e.channel !== 'email')) throw new Error('a paid favorite leaked into an email gate');
});

t('EP21 the pick RECORDS which favorite and exemplar ids it returned, in JSON and in the prose output', () => {
  const r = j(['--file', file(MIXED()), '--favorites', favFile(FAVS()), '--channel', 'email', '--role', 'headline']);
  if (JSON.stringify(r.obj.favorites.ids) !== JSON.stringify(['fav1', 'fav2'])) throw new Error('favorite ids not recorded: ' + JSON.stringify(r.obj.favorites));
  if (r.obj.exemplar_ids.length !== 3) throw new Error('exemplar ids not recorded: ' + JSON.stringify(r.obj.exemplar_ids));
  if (!Array.isArray(r.obj.shown) || r.obj.shown.length !== 5) throw new Error('shown list missing');
  const prose = run(['--file', file(MIXED()), '--favorites', favFile(FAVS()), '--channel', 'email', '--role', 'headline']).out;
  if (!/SHOWN/.test(prose) || !/favorites: fav1, fav2/.test(prose)) throw new Error('the prose output does not list the shown ids: ' + prose);
});

t('EP22 a line marked cut in a favorites file is dropped and counted; cuts never reach a writer', () => {
  const list = FAVS().concat([fav('cut1', 'headline', 'BUY NOW, THINK LATER', 'email', { verdict: 'cut' })]);
  const r = j(['--file', file(MIXED()), '--favorites', favFile(list), '--channel', 'email', '--role', 'headline']);
  if (r.obj.exemplars.some(e => /THINK LATER/.test(e.text))) throw new Error('a cut was shown to the writer');
  if (r.obj.favorites.dropped_cuts !== 1) throw new Error('the drop was not counted: ' + JSON.stringify(r.obj.favorites));
  if (!r.obj.notes.some(n => /never shown to the writer/.test(n))) throw new Error('the drop was silent: ' + JSON.stringify(r.obj.notes));
});

t('EP23 favorites alone carry a gate when the historical file has no such role, and when the exemplars role is null', () => {
  const r = j(['--file', file(MIXED()), '--favorites', favFile(FAVS()), '--channel', 'email', '--role', 'cta']);
  if (r.code !== 0) throw new Error('a role held only by favorites was refused: ' + r.err);
  if (r.obj.matched !== 1 || r.obj.exemplars[0].id !== 'fav3') throw new Error('the cta favorite was not returned: ' + JSON.stringify(r.obj.exemplars));
  if (!r.obj.thin) throw new Error('one favorite is still a thin pick');
  const ctxDir = fs.mkdtempSync(path.join(TMP, 'pack-'));
  fs.writeFileSync(path.join(ctxDir, 'favorites.json'), JSON.stringify({ favorites: FAVS() }));
  fs.writeFileSync(path.join(ctxDir, 'brand-context.md'), '```json\n' + JSON.stringify({ brand: 'T', exemplars: null, favorites: 'favorites.json' }) + '\n```\n');
  const r2 = j(['--pack', ctxDir, '--channel', 'email', '--role', 'headline']);
  if (r2.code !== 0) throw new Error('favorites with a null exemplars role were refused: ' + r2.err);
  if (r2.obj.matched !== 2) throw new Error('expected the two email headline favorites, got ' + r2.obj.matched);
});

t('EP24 an untagged favorite is not matched under a channel filter, and says so; a favorites role that does not resolve is a refusal', () => {
  const list = [fav('u1', 'headline', 'Untagged line', null)];
  const r = j(['--file', file(MIXED()), '--favorites', favFile(list), '--channel', 'email', '--role', 'headline']);
  if (r.obj.exemplars.some(e => e.id === 'u1')) throw new Error('an untagged favorite reached a channel-filtered gate');
  if (!r.obj.notes.some(n => /no channel tag/.test(n))) throw new Error('the exclusion was silent: ' + JSON.stringify(r.obj.notes));
  const ctxDir = fs.mkdtempSync(path.join(TMP, 'pack-'));
  const exPath = file(MIXED());
  fs.writeFileSync(path.join(ctxDir, 'brand-context.md'), '```json\n' + JSON.stringify({ brand: 'T', exemplars: exPath, favorites: 'missing.json' }) + '\n```\n');
  const r2 = run(['--pack', ctxDir, '--channel', 'email', '--role', 'headline']);
  if (r2.code !== 2) throw new Error('a wired-and-broken favorites role was not refused: exit ' + r2.code);
});

t('EP25 favorites starred on another type are still shown first, and the note says which type they came from', () => {
  const r = j(['--file', file(MIXED()), '--favorites', favFile(FAVS()), '--channel', 'email', '--role', 'headline', '--type', 'product_launch']);
  if (!r.obj.notes.some(n => /starred on type "sale_launch"/.test(n))) throw new Error('off-type favorites were not named: ' + JSON.stringify(r.obj.notes));
});

t('EP26 with no favorites at all the pick is unchanged: historical exemplars only, and the note says the role is null', () => {
  const ctxDir = fs.mkdtempSync(path.join(TMP, 'pack-'));
  fs.writeFileSync(path.join(ctxDir, 'brand-context.md'), '```json\n' + JSON.stringify({ brand: 'T', exemplars: file(MIXED()), favorites: null }) + '\n```\n');
  const r = j(['--pack', ctxDir, '--channel', 'email', '--role', 'headline']);
  if (r.obj.matched !== 3 || r.obj.exemplars.some(e => e.source !== 'exemplars')) throw new Error('historical pick changed: ' + JSON.stringify(r.obj));
  if (!r.obj.notes.some(n => /favorites role is null/.test(n))) throw new Error('the null role was not named: ' + JSON.stringify(r.obj.notes));
});

console.log('\n' + pass + ' passed, ' + fail + ' failed\n');
fs.rmSync(TMP, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
