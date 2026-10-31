#!/usr/bin/env node
/* judge_brief.js: assembles the pairwise judge's whole brief (studio-engine 0.5.1).

   The engine carries the method (references/pairwise-rubric.md). The brand carries its measured
   preference: what its owner kept and cut when marking lines blind, overall and by role, in the
   pack's `judge_rubric` role (a markdown file). This script joins the two into one file, so the
   judge still reads exactly two files (this brief and a pairs file) and the engine never speaks
   for a brand it has not measured.

   Usage:
     node judge_brief.js --pack <folder> --out judge-brief.md
   --brand-context <file> and --brand <name> work as on every other script.

   Output (stdout): {verdict, errors, warns, brief_path, preference: {status, path, sha256}, rubric}.
   Verdict and exit code:
     PASS (0)               the pack names a judge_rubric and it was appended
     INSUFFICIENT-INPUT (1) the role is null: the brief is written and says, in the judge's own
                            text, that no measured preference is on file; every rank built on it is
                            uncalibrated for taste and must say so
     FAIL (2)               no pack, no --out, or the role names a file that is not there (a wired
                            role that is missing is a refusal, never a silent fallback) */
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
function arg(k, d) { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; }
function sharedLib(name) {
  const cands = [path.join(__dirname, '..', '..', '..', 'lib', name)];
  if (process.env.CLAUDE_PLUGIN_ROOT) cands.push(path.join(process.env.CLAUDE_PLUGIN_ROOT, 'lib', name));
  for (const c of cands) if (fs.existsSync(c)) return require(c);
  console.log(JSON.stringify({ verdict: 'FAIL', errors: ['shared module lib/' + name + ' not found'], warns: [] }, null, 1));
  process.exit(2);
}
const pack = sharedLib('pack.js');
const die = m => {
  console.log(JSON.stringify({ verdict: 'FAIL', errors: [m], warns: [] }, null, 1));
  console.error('judge_brief: ' + m + '\n  No brief was written, so no judge should run on this pack yet.');
  process.exit(2);
};
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

const warns0 = [];
const out = arg('--out', null);
if (!out) die('pass --out <judge-brief.md>: the judge reads the file this writes');
let CTX = null; try { CTX = pack.resolveContext(process.argv); } catch (e) { die(e.message); }
if (!CTX) die('no pack: pass --pack <folder> (or --brand-context / --brand). The brief needs the brand it judges for.');

const rubricPath = path.join(__dirname, '..', 'references', 'pairwise-rubric.md');
if (!fs.existsSync(rubricPath)) die('references/pairwise-rubric.md is missing beside this script');
const rubric = fs.readFileSync(rubricPath, 'utf8').trimEnd();

if (!CTX.fileMap || typeof CTX.fileMap !== 'object') die('the brand context has no readable File map, so judge_rubric cannot be resolved');
const rawRole = CTX.fileMap.judge_rubric;
if (rawRole === '') warns0.push('judge_rubric is an empty string in the File map; write null when the brand has no measured preference. Treated as none on file.');
if (rawRole != null && typeof rawRole !== 'string') die('judge_rubric in the File map must be a file path or null, not ' + JSON.stringify(rawRole));
const role = pack.resolveRole(CTX, 'judge_rubric');
if (role && !fs.statSync(role).isFile()) die('judge_rubric "' + rawRole + '" is not a file. Point it at the markdown file that holds the measured preference, or set it to null.');
if (role === false) die('the brand context names judge_rubric "' + CTX.fileMap.judge_rubric + '" and it is not beside it. '
  + 'Fix the File map rather than dropping the role: the judge would be told the brand has no measured preference when it has one.');

const brand = CTX.fileMap.brand || 'this brand';
const warns = warns0;
if (!Object.prototype.hasOwnProperty.call(CTX.fileMap, 'judge_rubric')) warns.push('judge_rubric is absent from the File map. A role the brand lacks is written as null, so the gap is on the record; treated as none on file.');
let section, preference;
if (role) {
  const body = fs.readFileSync(role, 'utf8').trim();
  if (!body) die('judge_rubric "' + role + '" is empty. Either write the measured preference into it or set the role to null.');
  section = '## The brand\'s own preference: ' + brand + '\n\n'
    + 'Taken from the brand\'s pack (`judge_rubric`: ' + path.basename(role) + ', sha256 ' + sha(role).slice(0, 12) + '). '
    + 'It is what the brand owner kept and cut, blind. Where its by-role guidance conflicts with its general rule, the by-role guidance wins.\n\n'
    + body.replace(/^#\s+.*\n+/, '');
  preference = { status: 'pack', path: role, sha256: sha(role) };
} else {
  section = '## The brand\'s own preference: ' + brand + '\n\n'
    + 'None on file. This brand\'s owner has not marked lines for the judge yet, so there is no measured preference to judge voice_fit against. '
    + 'Judge voice_fit on the brief\'s own terms only (what was asked, the product, the offer, in the reader\'s terms). '
    + 'Say "no measured preference" in any reason that turns on voice, and prefer a tie to a guess. '
    + 'Do not import any other brand\'s taste, and do not treat your own register as the brand\'s.';
  preference = { status: 'none on file', path: null, sha256: null };
  warns.push('judge_rubric: null in the File map, so the judge brief carries no measured preference. Every rank built on it is uncalibrated for taste; say so beside the rank.');
}

const brief = rubric + '\n\n' + section + '\n';
try { fs.writeFileSync(out, brief); } catch (e) { die('cannot write --out ' + out + ': ' + e.message); }
const verdict = role ? 'PASS' : 'INSUFFICIENT-INPUT';
console.log(JSON.stringify({ verdict, errors: [], warns, brief_path: out, preference,
  rubric: { path: rubricPath, sha256: sha(rubricPath) }, pack: CTX.brandContextPath }, null, 1));
process.exit(verdict === 'PASS' ? 0 : 1);
