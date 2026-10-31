#!/usr/bin/env node
/* route_findings.js — split a slate's findings by who can actually act on them.
   Usage: node route_findings.js --slate <slate.json> --lint <lint.json> --out <findings.md>

WHY THIS EXISTS
---------------
Four real runs on 2026-07-28 produced 49 findings — an average of twelve per
brief — and all twelve went to the same person in the same voice at the same
weight. Of those twelve, the drafter owned about two: pick an angle, confirm the
offer. The rest belonged to ops (a product database with no review field), to
counsel (a verbatim rule contradicting the brief), or to whoever owns the
taxonomy (a content type with no offer gate).

Surfacing all of it was correct. Putting all of it in one person's reply was not.
The requester asked for copy and received an audit, which is how a system that
catches more than its predecessor ends up feeling worse to use than the thing it
replaced.

So: every finding gets an owner, the reply carries only the drafter's, and the
rest go to a file addressed to the people who can fix them.

OWNERS
------
  you       the drafter. A decision only they can make: pick an angle, confirm
            the offer, choose between two briefed lines.
  brief     back to whoever wrote the brief. Wrong SKU, wrong product name, an
            instruction that cannot be followed.
  data      ops. Missing fields, placeholder SKUs, stale records.
  legal     counsel. Ledger topics, claims wording, clearance.
  system    the taxonomy, the contracts, the scripts. Nobody in the send's chain
            can act on it today.

DECLARING AN OWNER
------------------
A note may be a plain string (legacy, routed by keyword) or an object:

    { "owner": "data", "text": "...", "severity": "blocking" }

Objects are preferred, because keyword routing is a guess and a declared owner is
not. Anything unrecognised routes to `you`, deliberately — an unroutable finding
should land on a human rather than disappear into a file nobody opens.

EXIT CODES: 0 ran clean · 1 ran and something blocks the drafter · 2 could not start.
*/
const fs = require('fs');

function arg(k, d) { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; }
const die = (m, code = 2) => { console.error('route_findings: ' + m); process.exit(code); };

if (!arg('--slate')) {
  die('need --slate <slate.json>.\n' +
      '  usage: route_findings.js --slate <slate> [--lint <lint.json>] [--out findings.md]');
}

let slate;
try { slate = JSON.parse(fs.readFileSync(arg('--slate'), 'utf8')); }
catch (e) { die('cannot read the slate at ' + arg('--slate') + '\n  (' + e.message + ')'); }

let lint = null;
if (arg('--lint')) {
  try { lint = JSON.parse(fs.readFileSync(arg('--lint'), 'utf8')); }
  catch (e) { die('--lint unreadable (' + e.message + ')'); }
}

const OWNERS = ['you', 'brief', 'data', 'legal', 'system'];
const LABEL = {
  you: 'YOU — decisions only the drafter can make',
  brief: 'BACK TO THE BRIEF — for whoever wrote it',
  data: 'DATA / OPS — product records, SKUs, missing fields',
  legal: 'LEGAL — claims, ledger topics, clearance',
  system: 'SYSTEM — taxonomy, contracts, scripts',
};

/* Keyword routing is the fallback for plain-string notes. It is a guess, and it
   is biased toward `you`: a finding routed to the wrong queue is worse than one
   that lands on a human who can forward it. */
function guessOwner(text) {
  const t = String(text).toLowerCase();
  if (/\bledger\b|\bl\d{2}\b|claims?|counsel|clearance|testimonial|substantiat/.test(t)) return 'legal';
  if (/database|sku|placeholder|tbd-|no review|record|product db|stale|missing field/.test(t)) return 'data';
  if (/taxonomy|registry|gate count|no offer gate|type carries|module.*(no|not).*slot|seam map|contract/.test(t)) return 'system';
  if (/brief (says|calls|guesses|is wrong)|wrong (sku|name|product)|the brief/.test(t)) return 'brief';
  return 'you';
}

const rawNotes = Array.isArray(slate.notes) ? slate.notes : [];
const findings = rawNotes.map(n => {
  if (n && typeof n === 'object') {
    return {
      owner: OWNERS.includes(n.owner) ? n.owner : 'you',
      declared: OWNERS.includes(n.owner),
      severity: n.severity || 'note',
      text: String(n.text == null ? '' : n.text),
    };
  }
  const text = String(n);
  const severity = /^(BLOCKING|BLOCKED|FORK)\b/.test(text) ? 'blocking' : 'note';
  return { owner: guessOwner(text), declared: false, severity, text };
});

/* The drafter also owns anything the lint is waiting on them for. */
const signoff = (lint && lint.needs_human_signoff) || [];
const verdict = lint ? lint.verdict : 'not checked';

const byOwner = {};
OWNERS.forEach(o => { byOwner[o] = findings.filter(f => f.owner === o); });
const yours = byOwner.you;
const elsewhere = findings.length - yours.length;

// ------------------------------------------------------------------ the file
const outPath = arg('--out');
if (outPath) {
  let md = '# Findings — ' + (slate.brief_name || slate.brief && slate.brief.name || 'untitled') + '\n\n';
  md += 'Automated checks: **' + verdict + '**' +
        (signoff.length ? ' · ' + signoff.length + ' line(s) waiting on a person' : '') + '\n\n';
  md += findings.length + ' findings, routed by who can act on them. ' +
        (elsewhere ? elsewhere + ' of them are not the drafter\'s.' : '') + '\n';
  const undeclared = findings.filter(f => !f.declared).length;
  if (undeclared) {
    md += '\n> ' + undeclared + ' of these were routed by keyword rather than a declared `owner` ' +
          'field, so the routing is a guess. Declare `owner` on the note to make it certain.\n';
  }
  OWNERS.forEach(o => {
    if (!byOwner[o].length) return;
    md += '\n## ' + LABEL[o] + '\n\n';
    byOwner[o].forEach(f => {
      md += '- ' + (f.severity === 'blocking' ? '**[BLOCKING]** ' : '') + f.text + '\n';
    });
  });
  if (signoff.length) {
    md += '\n## Waiting on a person (from the automated checks)\n\n';
    signoff.forEach(s => {
      md += '- ' + (typeof s === 'string' ? s : (s.topic ? '**' + s.topic + '** — ' + (s.why || s.note || 'needs sign-off') : JSON.stringify(s))) + '\n';
    });
  }
  try { fs.writeFileSync(outPath, md); }
  catch (e) { die('could not write ' + outPath + ' (' + e.message + ')'); }
}

// ----------------------------------------------------------------- the reply
console.log('REPLY SUMMARY — this is what belongs in the message to the requester:');
console.log('');
const blockingYours = yours.filter(f => f.severity === 'blocking');
if (!yours.length && !signoff.length) {
  console.log('  Nothing needs the drafter. Lint ' + verdict + '.');
} else {
  console.log('  ' + (yours.length + signoff.length) + ' thing(s) need you' +
    (blockingYours.length ? ', ' + blockingYours.length + ' of them blocking' : '') + ':');
  yours.forEach(f => console.log('   - ' + (f.severity === 'blocking' ? '[BLOCKING] ' : '') + f.text.slice(0, 160)));
  signoff.forEach(s => console.log('   - [NEEDS A DECISION] ' + (typeof s === 'string' ? s : (s.topic || JSON.stringify(s))).slice(0, 160)));
}
if (elsewhere) {
  console.log('');
  console.log('  ' + elsewhere + ' further finding(s) belong to ' +
    OWNERS.filter(o => o !== 'you' && byOwner[o].length).map(o => o + ' (' + byOwner[o].length + ')').join(', ') +
    (outPath ? ' — written to ' + outPath : ' — pass --out to write them to a file'));
  console.log('  Do NOT put these in the reply. Point at the file.');
}

process.exit(blockingYours.length ? 1 : 0);
