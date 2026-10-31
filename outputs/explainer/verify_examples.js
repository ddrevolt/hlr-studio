#!/usr/bin/env node
'use strict';
/* verify_examples.js: run the explainer's example lines through the engine's own claims matcher.

   The page never states a check's verdict that the check did not give. This script compiles the
   pack's ledger with the engine's lib/claims.js (the module every copy lint shares) and tests the
   pack's prohibited patterns, then writes examples-verified.json beside itself.

   Usage: node verify_examples.js --engine <hlr-studio-engine folder> [--home <brand home>]
   The engine folder is the installed plugin (or a copy of it); --home defaults to two folders up. */

const fs = require('fs');
const path = require('path');

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const engine = arg('--engine');
if (!engine) { console.error('verify_examples.js: --engine <hlr-studio-engine folder> is required'); process.exit(2); }
const home = path.resolve(arg('--home', path.join(__dirname, '..', '..')));
const claims = require(path.join(path.resolve(engine), 'lib', 'claims.js'));

const ledger = JSON.parse(fs.readFileSync(path.join(home, 'brand-pack', 'legal-ledger.json'), 'utf8'));
const bc = fs.readFileSync(path.join(home, 'brand-pack', 'brand-context.md'), 'utf8');
const fm = JSON.parse(bc.match(/## File map[\s\S]*?```json\n([\s\S]*?)\n```/)[1]);
const patterns = (fm.prohibited_patterns || []).map(p => new RegExp(p, 'i'));
const compiled = claims.compileLedger(ledger);
const pkg = JSON.parse(fs.readFileSync(path.join(path.resolve(engine), '.claude-plugin', 'plugin.json'), 'utf8'));

const EXAMPLES = [
  { id: 'treats-anxiety', text: 'This crystal treats anxiety.' },
  { id: 'handmade', text: 'Handmade in our studio, each one of a kind.' },
  { id: 'one-at-a-time', text: 'Each pendant is made one at a time.' },
  { id: 'stone-of', text: 'Long held as a stone of protection.' },
  { id: 'headline', text: 'Made after you choose it' },
];

const out = EXAMPLES.map(ex => {
  const ledgerHits = compiled.rules
    .filter(r => claims.matchRule(r, ex.text))
    .map(r => ({ id: r.id, severity: r.severity, title: r.title, matched: claims.matchRule(r, ex.text) }));
  const patternHits = patterns
    .map((re, i) => ({ index: i + 1, matched: (ex.text.match(re) || [null])[0] }))
    .filter(h => h.matched);
  let verdict = 'clear';
  if (patternHits.length || ledgerHits.some(h => h.severity === 'needs_legal')) verdict = 'blocked';
  else if (ledgerHits.some(h => h.severity === 'conditional')) verdict = 'asks a person';
  else if (ledgerHits.length) verdict = 'listed for review';
  return { ...ex, verdict, ledger_hits: ledgerHits, pattern_hits: patternHits };
});

const result = {
  _role: 'explainer example verdicts',
  _note: 'Written by verify_examples.js with the engine\'s lib/claims.js; matching is lexical only, as the module says.',
  engine: `${pkg.name} ${pkg.version}`,
  ledger: ledger.version,
  paraphrase_risk: compiled.paraphraseEntries.map(p => p.id),
  run_at: new Date().toISOString().replace(/\.\d+Z$/, 'Z'),
  examples: out,
};
fs.writeFileSync(path.join(__dirname, 'examples-verified.json'), JSON.stringify(result, null, 1) + '\n');
for (const e of out) console.log(`${e.id}: ${e.verdict} | ledger ${e.ledger_hits.map(h => h.id + ':' + h.severity).join(', ') || '-'} | patterns ${e.pattern_hits.map(h => h.index).join(', ') || '-'}`);
