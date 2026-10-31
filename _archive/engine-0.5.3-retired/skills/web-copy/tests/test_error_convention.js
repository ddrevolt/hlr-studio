#!/usr/bin/env node
/* test_error_convention.js — every shipped script of this skill, run against the two things a user
   actually does wrong: point it at a file that is not there, and at one that is there and
   malformed. The convention is email-copy/references/script-conventions.md and it is the suite's,
   not this package's — exit 0 ran clean, 1 ran and found a problem, 2 could not start; every
   failure is a sentence, a consequence and a way forward, on stderr, never a stack.

   Run: node tests/test_error_convention.js
*/
const { spawnSync } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');

const SCRIPTS = path.join(__dirname, '..', 'scripts');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'errconv-'));
const GONE = path.join(TMP, 'not-here.json');
const JUNK = path.join(TMP, 'junk.json');
fs.writeFileSync(JUNK, '{ this is not json at all ');
const JUNKMD = path.join(TMP, 'junk.md');
fs.writeFileSync(JUNKMD, 'no file map block here\n');

/* Every shipped script, with an invocation that is well-formed except for one bad path. */
const CASES = [
  { name: 'page_lint.js', run: ['node', [path.join(SCRIPTS, 'page_lint.js'), '--page', GONE, '--brand-context', JUNKMD]] },
  { name: 'page_lint.js (malformed page)', run: ['node', [path.join(SCRIPTS, 'page_lint.js'), '--page', JUNK, '--brand-context', JUNKMD]] },
  { name: 'a11y_check.js', run: ['node', [path.join(SCRIPTS, 'a11y_check.js'), '--page', GONE]] },
  { name: 'a11y_check.js (malformed page)', run: ['node', [path.join(SCRIPTS, 'a11y_check.js'), '--page', JUNK]] },
  { name: 'a11y_check.js (no --page)', run: ['node', [path.join(SCRIPTS, 'a11y_check.js')]] },
];

/* What a traceback or a raw runtime stack looks like, in either language. */
const STACK = [
  /Traceback \(most recent call last\)/,
  /^\s+File ".*", line \d+, in /m,
  /^\w*Error: .*\n\s+at [\w.]+ \(/m,          // Node stack frame
  /node:internal\//,
  /node:fs:\d+/,
  /^\s+at Object\.\w+ \(node:/m,
];

let pass = 0, fail = 0;
const t = (name, fn) => { try { fn(); console.log('  \x1b[32mPASS\x1b[0m  ' + name); pass++; }
  catch (e) { console.log('  \x1b[31mFAIL\x1b[0m  ' + name + '\n        ' + e.message); fail++; } };


console.log('\nevery shipped script fails like a sentence, not like a stack\n');

for (const c of CASES) {
  t(c.name, () => {
    const r = spawnSync(c.run[0], c.run[1], { encoding: 'utf8' });
    const err = String(r.stderr || '');
    const all = err + String(r.stdout || '');

    const stack = STACK.find(re => re.test(all));
    if (stack) throw new Error('emits a stack trace (' + stack + '):\n        '
      + all.split('\n').slice(0, 4).join('\n        '));

    if (r.status === 0) throw new Error('exited 0 on a missing or malformed input — the caller '
      + 'cannot tell this failed');
    if (r.status !== 1 && r.status !== 2) throw new Error('exit code ' + r.status
      + ' is not in the convention (0 ran clean, 1 found a problem, 2 could not start)');

    /* The message has to name the script, so a person running three of these in a row knows
       which one spoke, and has to say more than one line — a bare "file not found" is not an
       error message a non-engineer can act on. */
    const named = new RegExp('^' + c.name.split(/[ .]/)[0].replace(/_/g, '_'), 'm');
    if (!named.test(all) && !/^\s*(ERROR|REFUSED)/m.test(all)) {
      throw new Error('the message does not name the script or lead with ERROR/REFUSED:\n        '
        + all.split('\n')[0]);
    }
    const body = all.trim();
    if (body.length < 60) throw new Error('one short line is not an error message a non-engineer '
      + 'can act on: ' + JSON.stringify(body));
  });
}

t('the 1/2 split is real: a usage error and a finding are different codes', () => {
  /* A page that exists and breaks a rule is a finding (1). A page that is not there, or a brand
     context with no claims rules, is a usage error (2). Conflating them makes a broken pipeline
     and a page with a bad claim on it look identical to whatever is calling this. */
  const ctx = path.join(TMP, 'ctx.md');
  fs.writeFileSync(ctx, '```json\n{"prohibited_patterns":["detox"]}\n```');
  const page = path.join(TMP, 'thin.json');
  fs.writeFileSync(page, JSON.stringify({ page_type: 'collection', sections: [] }));

  const found = spawnSync('node', [path.join(SCRIPTS, 'page_lint.js'), '--page', page,
    '--brand-context', ctx,
    '--sections', path.join(__dirname, 'fixtures', 'section-data.fixture.json')], { encoding: 'utf8' });
  if (found.status !== 1) throw new Error('a page that ran and failed should exit 1, got ' + found.status);

  const usage = spawnSync('node', [path.join(SCRIPTS, 'page_lint.js'), '--page', page], { encoding: 'utf8' });
  if (usage.status !== 2) throw new Error('no resolvable claims rules should exit 2, got ' + usage.status);
});

console.log('\n' + pass + ' passed, ' + fail + ' failed\n');
fs.rmSync(TMP, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
