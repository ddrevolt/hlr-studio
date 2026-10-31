#!/usr/bin/env node
/* test_route_findings.js — findings go to whoever can act on them.

   The attack this encodes is not a bug, it is a product failure that four real
   runs on 2026-07-28 demonstrated: 49 findings across four briefs, all of them
   delivered to one person at one weight, when about two per brief were actually
   theirs. The requester asked for copy and got an audit.

   The rule these tests hold: a declared owner is honoured exactly, an
   unrecognised one lands on a human rather than vanishing, and nothing the
   drafter cannot act on reaches the reply.

   Run: node tests/test_route_findings.js
*/
const { execFileSync } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');

const ROUTE = path.join(__dirname, '..', 'scripts', 'route_findings.js');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'findings-'));
const uniq = () => Math.random().toString(36).slice(2);
const w = (o) => { const p = path.join(TMP, 's-' + uniq() + '.json'); fs.writeFileSync(p, JSON.stringify(o)); return p; };

function run(args) {
  try { return { code: 0, out: execFileSync('node', [ROUTE, ...args], { encoding: 'utf8' }) }; }
  catch (e) { return { code: e.status, out: String(e.stdout || ''), err: String(e.stderr || '') }; }
}
const slate = (notes, extra = {}) => ({ brief_name: 'Fixture', notes, ...extra });

let pass = 0, fail = 0;
const t = (name, fn) => { try { fn(); console.log('  \x1b[32mPASS\x1b[0m  ' + name); pass++; }
  catch (e) { console.log('  \x1b[31mFAIL\x1b[0m  ' + name + '\n        ' + e.message); fail++; } };

console.log('\nroute_findings.js — findings reach the person who can act on them\n');

t('RF1 a declared owner is honoured exactly, not re-guessed', () => {
  // Text that keyword-routing would send to `legal`, declared as `you`.
  const p = w(slate([{ owner: 'you', text: 'The ledger topic L15 is your call on this one.' }]));
  const r = run(['--slate', p]);
  if (!/1 thing\(s\) need you/.test(r.out)) throw new Error('declared owner was overridden: ' + r.out);
});

t('RF2 an unrecognised owner lands on a human, never disappears', () => {
  const p = w(slate([{ owner: 'marketing-ops-team', text: 'Something nobody classified.' }]));
  const r = run(['--slate', p]);
  if (!/need you/.test(r.out)) throw new Error('an unroutable finding vanished: ' + r.out);
  if (!/Something nobody classified/.test(r.out)) throw new Error('the text was lost');
});

t('RF3 plain strings route by keyword, and stay out of the reply when they can', () => {
  const p = w(slate([
    'The product database has no review field on any record.',
    'Ledger L06 marks satiety conditional and the quote trips it.',
    'PROVISIONAL — ANGLE NOT RATIFIED.',
  ]));
  const r = run(['--slate', p]);
  if (!/1 thing\(s\) need you/.test(r.out)) throw new Error('expected exactly one for the drafter: ' + r.out);
  if (!/data \(1\)/.test(r.out) || !/legal \(1\)/.test(r.out)) throw new Error('keyword routing failed: ' + r.out);
});

t('RF4 BLOCKING / BLOCKED / FORK prefixes are read as blocking', () => {
  const p = w(slate(['FORK — the offer decides the type and nobody has decided.']));
  const r = run(['--slate', p]);
  if (!/1 of them blocking/.test(r.out)) throw new Error('a FORK was not treated as blocking: ' + r.out);
});

t("RF5 exit 1 only when something BLOCKING is the drafter's", () => {
  const blocking = w(slate(['BLOCKING — you have to pick an angle before anything else runs.']));
  if (run(['--slate', blocking]).code !== 1) throw new Error('a blocking drafter item did not exit 1');
  const notMine = w(slate(['BLOCKING — the legal ledger is still test-seed and counsel must rule.']));
  const r = run(['--slate', notMine]);
  if (r.code !== 0) throw new Error("someone else's blocker exited non-zero: " + r.code);
});

t('RF6 the file groups by owner and admits when routing was guessed', () => {
  const out = path.join(TMP, 'f-' + uniq() + '.md');
  const p = w(slate([
    'The product database has no review field.',
    { owner: 'you', text: 'Pick an angle.' },
  ]));
  run(['--slate', p, '--out', out]);
  const md = fs.readFileSync(out, 'utf8');
  if (!/## DATA \/ OPS/.test(md)) throw new Error('no owner grouping in the file');
  if (!/routed by keyword rather than a declared/.test(md)) throw new Error('guessed routing not admitted');
  if (!/1 of these were routed by keyword/.test(md)) throw new Error('wrong guess count: ' + md.slice(0, 400));
});

t('RF7 lint sign-off items count as the drafter\'s', () => {
  const p = w(slate([]));
  const lp = path.join(TMP, 'l-' + uniq() + '.json');
  fs.writeFileSync(lp, JSON.stringify({ verdict: 'INSUFFICIENT-INPUT',
    needs_human_signoff: [{ topic: 'L14', why: 'renewal terms' }] }));
  const r = run(['--slate', p, '--lint', lp]);
  if (!/NEEDS A DECISION/.test(r.out)) throw new Error('sign-off items did not reach the reply: ' + r.out);
});

t('RF8 a slate with nothing for the drafter says so (over-blocking control)', () => {
  const p = w(slate(['The taxonomy has no offer gate on product_launch.']));
  const r = run(['--slate', p]);
  if (!/Nothing needs the drafter/.test(r.out)) throw new Error('invented work for the drafter: ' + r.out);
  if (r.code !== 0) throw new Error('exited non-zero with nothing to do');
});

t('RF9 it tells the caller not to paste the rest into the reply', () => {
  const p = w(slate(['Ledger L15 needs counsel.', 'The product database has no review field.']));
  const r = run(['--slate', p]);
  if (!/Do NOT put these in the reply/.test(r.out)) throw new Error('no instruction to withhold: ' + r.out);
});

t('RF10 could-not-start is exit 2, with a sentence', () => {
  const r = run(['--slate', '/nonexistent/NOPE.json']);
  if (r.code !== 2) throw new Error('expected exit 2, got ' + r.code);
  if (/TypeError|at Object/.test(r.err || '')) throw new Error('a stack trace reached the user');
  const bad = path.join(TMP, 'bad-' + uniq() + '.json');
  fs.writeFileSync(bad, '{ not json');
  if (run(['--slate', bad]).code !== 2) throw new Error('malformed JSON did not exit 2');
});

console.log('\n' + pass + ' passed, ' + fail + ' failed\n');
fs.rmSync(TMP, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
