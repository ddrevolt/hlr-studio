#!/usr/bin/env node
/* test_a11y_check.js — the accessibility floors, driven directly with mock node lists.

   Written as a pure function over plain objects for the same reason the safe-zone and structure
   checks are: code that only runs against a live page is code nothing tests, and the numbers here
   are the ones that decide whether somebody can read the page at all.

   Three groups: findings it must catch, valid pages it must NOT flag (a check that over-blocks gets
   switched off), and unrunnable states that must never read as clear.

   Run: node tests/test_a11y_check.js
*/
const { spawnSync } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');
const { a11yCheck, contrast, isLarge } = require('../scripts/a11y_check.js');

const SCRIPT = path.join(__dirname, '..', 'scripts', 'a11y_check.js');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'a11y-'));

/* A page that passes every check that runs. */
const clean = () => ({ nodes: [
  { name: 'Collection title', role: 'heading', level: 1, text: 'The Everyday Collection' },
  { name: 'Benefit heading', role: 'heading', level: 2, text: 'Bound for a reason' },
  { name: 'Card title', role: 'heading', level: 3, text: 'Sewn by hand' },
  { name: 'Body', role: 'text', text: 'Printed on cotton paper.', fg: '#333333', bg: '#ffffff', size: 16 },
  { name: 'Shop CTA', role: 'link', text: 'Shop the collection', href: '/collections/everyday',
    width: 280, height: 44, fg: '#ffffff', bg: '#1f4e79', size: 12, bold: true },
  { name: 'FAQ link', role: 'link', text: 'How the binding works', href: '/pages/how-it-works',
    width: 200, height: 40 },
  { name: 'Hero', role: 'image', alt: 'An open notebook on a desk, its cover visible' },
  { name: 'Texture', role: 'image', alt: '', decorative: true },
] });

let pass = 0, fail = 0;
const t = (name, fn) => { try { fn(); console.log('  \x1b[32mPASS\x1b[0m  ' + name); pass++; }
  catch (e) { console.log('  \x1b[31mFAIL\x1b[0m  ' + name + '\n        ' + e.message); fail++; } };
const crit = r => r.findings.map(f => f.criterion + '/' + f.node);
const expectFinding = (r, criterion, msg) => {
  if (!r.findings.some(f => f.criterion === criterion)) {
    throw new Error((msg || 'expected a ' + criterion + ' finding') + '; got ' + JSON.stringify(crit(r)));
  }
};
const expectNo = (r, criterion, msg) => {
  const hit = r.findings.filter(f => f.criterion === criterion);
  if (hit.length) throw new Error((msg || 'false positive on ' + criterion) + ': ' + JSON.stringify(hit.map(h => h.detail)));
};

console.log('\na11y_check.js — the floor a public page owes its readers\n');

t('control: a well-formed page is CLEAR', () => {
  const r = a11yCheck(clean());
  if (r.verdict !== 'CLEAR') throw new Error('verdict ' + r.verdict + ': '
    + JSON.stringify(r.findings.map(f => f.detail).concat(r.insufficient_input)));
});

// ---- 1.3.1 headings ----
t('1.3.1 no h1 is caught', () => {
  const p = clean(); p.nodes[0].level = 2;
  expectFinding(a11yCheck(p), '1.3.1');
});
t('1.3.1 two h1s are caught', () => {
  const p = clean(); p.nodes[1].level = 1;
  const r = a11yCheck(p);
  if (!r.findings.some(f => /2 h1s/.test(f.detail))) throw new Error('multiple tops not reported');
});
t('1.3.1 a skipped level is caught and names both', () => {
  const p = clean(); p.nodes[1].level = 4;
  const r = a11yCheck(p);
  if (!r.findings.some(f => /jumps from h1 to h4/.test(f.detail))) {
    throw new Error('skipped level not reported: ' + JSON.stringify(r.findings.map(f => f.detail)));
  }
});
t('1.3.1 an empty heading is caught', () => {
  const p = clean(); p.nodes[2].text = '   ';
  const r = a11yCheck(p);
  if (!r.findings.some(f => /empty heading/.test(f.detail))) throw new Error('empty heading passed');
});

// ---- 2.4.4 / 2.4.9 link purpose, and the level distinction that matters ----
t('2.4.4 the same vague label going to different places is level A', () => {
  const p = clean();
  p.nodes.push({ name: 'L1', role: 'link', text: 'Learn more', href: '/a', width: 100, height: 40 });
  p.nodes.push({ name: 'L2', role: 'link', text: 'Learn more', href: '/b', width: 100, height: 40 });
  const r = a11yCheck(p);
  const f = r.findings.find(x => x.criterion === '2.4.4');
  if (!f) throw new Error('six identical entries in a link list went unreported: ' + JSON.stringify(crit(r)));
  if (f.level !== 'A') throw new Error('level was ' + f.level);
});
t('2.4.9 a SINGLE vague link is AAA, not A — overclaiming gets a report dismissed', () => {
  const p = clean();
  p.nodes.push({ name: 'L1', role: 'link', text: 'Learn more', href: '/a', width: 100, height: 40 });
  const r = a11yCheck(p);
  const f = r.findings.find(x => x.node === 'L1');
  if (!f) throw new Error('a vague label was not reported at all');
  if (f.criterion !== '2.4.9' || f.level !== 'AAA') {
    throw new Error('reported as ' + f.criterion + ' ' + f.level + '; in context this may be fine, '
      + 'which is exactly why it is AAA');
  }
});
t('2.4.4 the same NON-vague label going to different places is still caught', () => {
  const p = clean();
  p.nodes.push({ name: 'L1', role: 'link', text: 'Starter packs', href: '/a', width: 100, height: 40 });
  p.nodes.push({ name: 'L2', role: 'link', text: 'Starter packs', href: '/b', width: 100, height: 40 });
  expectFinding(a11yCheck(p), '2.4.4');
});
t('a link with no text at all is caught', () => {
  const p = clean();
  p.nodes.push({ name: 'Icon', role: 'link', text: '', href: '/a', width: 40, height: 40 });
  const r = a11yCheck(p);
  if (!r.findings.some(f => /no text/.test(f.detail))) throw new Error('an unnamed control passed');
});
t('control: descriptive labels going to distinct places are not flagged', () => {
  expectNo(a11yCheck(clean()), '2.4.4');
  expectNo(a11yCheck(clean()), '2.4.9');
});

// ---- 1.1.1 alt text ----
t('1.1.1 a missing alt attribute is caught, and is not the same as an empty one', () => {
  const p = clean(); delete p.nodes[6].alt;
  const r = a11yCheck(p);
  if (!r.findings.some(f => /no alt attribute/.test(f.detail))) throw new Error('missing alt passed');
});
t('1.1.1 an empty alt on a non-decorative image is caught', () => {
  const p = clean(); p.nodes[6].alt = '';
  expectFinding(a11yCheck(p), '1.1.1');
});
t('1.1.1 "Image of…" is caught — it is announced as an image already', () => {
  const p = clean(); p.nodes[6].alt = 'Image of a product';
  const r = a11yCheck(p);
  if (!r.findings.some(f => /already\s+announced as an image/.test(f.detail))) {
    throw new Error('redundant prefix passed: ' + JSON.stringify(r.findings.map(f => f.detail)));
  }
});
t('1.1.1 a filename as alt is caught', () => {
  const p = clean(); p.nodes[6].alt = 'hero-product-1440.jpg';
  const r = a11yCheck(p);
  if (!r.findings.some(f => /filename/.test(f.detail))) throw new Error('filename alt passed');
});
t('1.1.1 decoration WITH a description is caught — decorative means announced as nothing', () => {
  const p = clean(); p.nodes[7].alt = 'A textured background';
  expectFinding(a11yCheck(p), '1.1.1');
});
t('control: correctly-marked decoration is not flagged', () => {
  const r = a11yCheck({ nodes: [
    { name: 'H', role: 'heading', level: 1, text: 'Title' },
    { name: 'Texture', role: 'image', alt: '', decorative: true }] });
  expectNo(r, '1.1.1');
});

// ---- 1.4.3 contrast ----
t('1.4.3 body text below 4.5:1 is caught', () => {
  const p = clean(); p.nodes[3].fg = '#9a978f';
  const r = a11yCheck(p);
  expectFinding(r, '1.4.3');
  if (!/4\.5:1 floor/.test((r.findings.find(f => f.criterion === '1.4.3') || {}).detail || '')) {
    throw new Error('the floor was not named');
  }
});
t('1.4.3 a near miss is still a miss: just under 4.5:1 fails', () => {
  /* A pair a brand proposes as a remedy can still sit just under the floor. */
  const r0 = contrast('#797979', '#ffffff');
  const r = a11yCheck({ nodes: [
    { name: 'H', role: 'heading', level: 1, text: 'T' },
    { name: 'Near', role: 'text', fg: '#797979', bg: '#ffffff', size: 16 }] });
  if (r0 >= 4.5) throw new Error('fixture is not actually a near miss: ' + r0);
  expectFinding(r, '1.4.3', 'a ' + r0 + ':1 pair passed');
});
t('1.4.3 large text gets the 3:1 floor, not 4.5:1', () => {
  const mk = size => a11yCheck({ nodes: [
    { name: 'H', role: 'heading', level: 1, text: 'T' },
    { name: 'Big', role: 'text', fg: '#8a8a8a', bg: '#ffffff', size }] });
  const c = contrast('#8a8a8a', '#ffffff');
  if (!(c >= 3 && c < 4.5)) throw new Error('fixture must sit between the two floors, got ' + c);
  expectFinding(mk(16), '1.4.3', 'normal text at ' + c + ':1 should fail');
  expectNo(mk(24), '1.4.3', 'large text at ' + c + ':1 should pass the 3:1 floor');
});
t('1.4.3 bold at 18.66px counts as large', () => {
  if (!isLarge({ size: 18.66, bold: true })) throw new Error('bold 18.66 should be large');
  if (isLarge({ size: 18.66 })) throw new Error('non-bold 18.66 is not large');
  if (!isLarge({ size: 24 })) throw new Error('24px is large regardless of weight');
});

// ---- 2.5.8 target size ----
t('2.5.8 a target under 24x24 is caught', () => {
  const p = clean();
  p.nodes.push({ name: 'Tiny', role: 'link', text: 'Close the banner', href: '/x', width: 16, height: 16 });
  expectFinding(a11yCheck(p), '2.5.8');
});
t('control: a 24x24 target passes', () => {
  const p = clean();
  p.nodes.push({ name: 'Small but legal', role: 'link', text: 'Close the banner', href: '/x', width: 24, height: 24 });
  expectNo(a11yCheck(p), '2.5.8');
});

// ---- unrunnable states ----
t('no headings supplied is INSUFFICIENT-INPUT, not CLEAR', () => {
  const r = a11yCheck({ nodes: [{ name: 'L', role: 'link', text: 'Shop books', href: '/a', width: 40, height: 40 }] });
  if (r.verdict !== 'INSUFFICIENT-INPUT') throw new Error('verdict ' + r.verdict);
  if (r.checks_run.headings) throw new Error('it claims to have checked headings');
});
t('no colour pairs means contrast did not run, and the report says so', () => {
  const r = a11yCheck({ nodes: [{ name: 'H', role: 'heading', level: 1, text: 'T' },
                                { name: 'L', role: 'link', text: 'Shop books', href: '/a', width: 40, height: 40 }] });
  if (r.checks_run.contrast) throw new Error('contrast claims to have run with no pairs');
  if (!r.insufficient_input.some(s => /contrast was\s+not checked/.test(s))) {
    throw new Error('the absence was not stated: ' + JSON.stringify(r.insufficient_input));
  }
});
t('an unreadable colour is named, not silently skipped', () => {
  const r = a11yCheck({ nodes: [
    { name: 'H', role: 'heading', level: 1, text: 'T' },
    { name: 'Odd', role: 'text', fg: 'brand/ink', bg: '#ffffff', size: 16 }] });
  if (!r.unreadable.some(s => /Odd/.test(s))) throw new Error('a token reference passed as measured');
});
t('the report never implies more than it measured', () => {
  const r = a11yCheck(clean());
  if (!/roughly a third/.test(r.note)) throw new Error('a CLEAR result carries no caveat about coverage');
});

// ---- CLI contract ----
const pageFile = obj => { const p = path.join(TMP, 'p-' + Math.random().toString(36).slice(2) + '.json'); fs.writeFileSync(p, JSON.stringify(obj)); return p; };

t('CLI: findings report and exit 0 — callout, never block', () => {
  const p = clean(); p.nodes[3].fg = '#9a978f';
  const r = spawnSync('node', [SCRIPT, '--page', pageFile(p)], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error('an accessibility finding blocked the run (exit ' + r.status + ')');
  if (!/reported, not blocked/.test(r.stdout)) throw new Error('the page does not say it is advisory');
});
t('CLI: --strict exits 1 for CI', () => {
  const p = clean(); p.nodes[3].fg = '#9a978f';
  const r = spawnSync('node', [SCRIPT, '--page', pageFile(p), '--strict'], { encoding: 'utf8' });
  if (r.status !== 1) throw new Error('--strict did not block (exit ' + r.status + ')');
});
t('CLI: an unrunnable check exits non-zero WITHOUT --strict', () => {
  const r = spawnSync('node', [SCRIPT, '--page', pageFile({ nodes: [] })], { encoding: 'utf8' });
  if (r.status === 0) throw new Error('a check that measured nothing exited 0');
});
t('CLI: a missing page file fails like a sentence, not a stack', () => {
  const r = spawnSync('node', [SCRIPT, '--page', path.join(TMP, 'nope.json')], { encoding: 'utf8' });
  if (/Traceback|node:fs:\d+|at Object\.\w+ \(node:/.test(r.stderr + r.stdout)) throw new Error('stack trace');
  if (r.status !== 2) throw new Error('a usage error should exit 2, got ' + r.status);
  if (!/^a11y_check:/m.test(r.stderr)) throw new Error('the message does not name the script');
});

console.log('\n' + pass + ' passed, ' + fail + ' failed\n');
fs.rmSync(TMP, { recursive: true, force: true });
process.exit(fail ? 1 : 0);
