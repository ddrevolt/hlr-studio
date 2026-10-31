#!/usr/bin/env node
/* a11y_check.js — the checks a persistent, public page owes its readers.

   This is the one gate web has that email and paid do not, and it is not decoration. An email is
   wrong for a day. A page is wrong until somebody notices, on a surface that is a legal object in
   most of the markets this brand sells in. The suite had zero accessibility checking anywhere
   before this — no contrast, no heading structure, no target size — while claiming to build
   template-grade components.

   HONEST ABOUT LEVELS. Each finding names the success criterion it maps to and its conformance
   level, and where a finding is real usability but only AAA by the letter, it says so. Overclaiming
   a WCAG level is how an accessibility report gets dismissed wholesale, including the parts that
   were right.

   IT REPORTS, IT DOES NOT BLOCK — the same standing ruling the safe-zone check follows: a
   governance system that blocks shipping gets routed around. `--strict` exits 1 for CI. What it
   DOES fail on, without --strict, is not being able to run: no headings supplied, no colour pairs,
   geometry it cannot read. A check that could not run must never read as one that passed.

   Usage:
     node a11y_check.js --page page.json [--strict] [--json]

   page.json:
     { "nodes": [
         {"name":"Collection title","role":"heading","level":1,"text":"The Everyday Collection"},
         {"name":"Body","role":"text","text":"…","fg":"#3c3831","bg":"#faf8f4","size":16},
         {"name":"Shop CTA","role":"link","text":"Learn more","href":"/collections/everyday",
          "width":180,"height":44,"fg":"#ffffff","bg":"#1f4e9a","size":12,"bold":true},
         {"name":"Hero","role":"image","alt":"","decorative":true}
       ] }

   Exit 0 ran and reported · 1 could not run, or (with --strict) found violations · 2 usage.
*/
const fs = require('fs');

const SCRIPT = 'a11y_check';
const die = (m, code = 2) => { console.error(SCRIPT + ': ' + m); process.exit(code); };
function arg(k, d) { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; }
function has(k) { return process.argv.indexOf(k) > 0; }

/* ---- contrast, per WCAG 2.x relative luminance ---- */
function lum(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
  if (!m) return null;
  const [r, g, b] = [0, 2, 4].map(i => parseInt(m[1].substr(i, 2), 16) / 255)
    .map(c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const la = lum(a), lb = lum(b);
  if (la == null || lb == null) return null;
  const hi = Math.max(la, lb), lo = Math.min(la, lb);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}
/* "Large text" is 18pt / 24px, or 14pt / 18.66px when bold. Below that the floor is 4.5:1. */
const isLarge = n => (n.size >= 24) || (n.bold && n.size >= 18.66);

/* Link text that means nothing away from its surroundings. A screen-reader user can pull up a list
   of every link on the page; a run of entries reading "Learn more" is that list made useless. */
const VAGUE = /^(learn more|read more|click here|here|more|shop now|see more|find out more|this link|continue|go|view|details|link)\.?$/i;

function a11yCheck(page, opts = {}) {
  const nodes = Array.isArray(page) ? page : (page.nodes || []);
  const findings = [], insufficient = [], skipped = [];
  const ran = { headings: false, links: false, contrast: false, targets: false, alt: false };
  const add = (id, level, node, detail, fix) => findings.push({ criterion: id, level, node, detail, fix });

  const headings = nodes.filter(n => String(n.role || '').toLowerCase() === 'heading');
  const links = nodes.filter(n => ['link', 'cta', 'button'].includes(String(n.role || '').toLowerCase()));
  const images = nodes.filter(n => String(n.role || '').toLowerCase() === 'image');
  const texty = nodes.filter(n => n.fg && n.bg);

  // ---- 1.3.1 Info and Relationships (A) — heading structure
  if (headings.length) {
    ran.headings = true;
    const h1 = headings.filter(h => Number(h.level) === 1);
    if (!h1.length) {
      add('1.3.1', 'A', '(page)', 'no h1. The page has no top-level heading, so a screen-reader '
        + 'user landing here has nothing that says what the page is.',
        'Promote the page title (on a collection page, the collection header\'s title) to level 1.');
    } else if (h1.length > 1) {
      add('1.3.1', 'A', h1.map(h => h.name).join(', '), h1.length + ' h1s. More than one top-level '
        + 'heading means the outline has more than one top, which is the same as having none.',
        'Keep the page title at 1 and demote the rest to 2.');
    }
    let prev = 0;
    for (const h of headings) {
      const lvl = Number(h.level);
      if (!lvl || lvl < 1 || lvl > 6) {
        add('1.3.1', 'A', h.name, 'heading level is ' + JSON.stringify(h.level) + ', which is not 1–6.',
            'Set a real level; a styled-large paragraph is not a heading.');
      } else {
        if (prev && lvl > prev + 1) {
          add('1.3.1', 'A', h.name, 'jumps from h' + prev + ' to h' + lvl + '. Skipping a level '
            + 'breaks the outline a screen reader navigates by.',
            'Use h' + (prev + 1) + ', or add the missing level above it.');
        }
        prev = lvl;
      }
      if (!String(h.text || '').trim()) {
        add('1.3.1', 'A', h.name, 'empty heading — it is announced with nothing in it.',
            'Give it text, or make it not a heading.');
      }
    }
  } else {
    insufficient.push('no node carried role "heading", so the heading outline was not checked. '
      + 'Every page has one; if these were not supplied, this report says nothing about structure.');
  }

  // ---- 2.4.4 / 2.4.9 Link Purpose
  if (links.length) {
    ran.links = true;
    const byText = new Map();
    for (const l of links) {
      const t = String(l.text || '').trim();
      if (!t) {
        add('2.4.4', 'A', l.name, 'a link with no text. It is announced as its URL, or as nothing.',
            'Give it a label. An icon-only control needs an accessible name.');
        continue;
      }
      const key = t.toLowerCase();
      if (!byText.has(key)) byText.set(key, []);
      byText.get(key).push(l);
    }
    for (const [key, group] of byText) {
      const dests = new Set(group.map(l => l.href).filter(Boolean));
      if (VAGUE.test(key)) {
        /* Precision matters here. 2.4.4 is satisfied if the surrounding context disambiguates, and
           a script cannot see context. So: repeated-and-different-destinations is a real 2.4.4
           failure; a single vague link is 2.4.9, which is AAA, and saying otherwise is overclaiming. */
        if (dests.size > 1) {
          add('2.4.4', 'A', group.map(l => l.name).join(', '), '"' + String(group[0].text).trim()
            + '" appears ' + group.length + ' times pointing at ' + dests.size + ' different places. '
            + 'A reader listing the page\'s links gets ' + group.length + ' identical entries that go '
            + 'to different pages.',
            'Name the destination: "Shop the collection", not "Order now".');
        } else {
          add('2.4.9', 'AAA', group[0].name, '"' + String(group[0].text).trim() + '" does not say '
            + 'where it goes when read on its own. In context this may be fine — that is why this is '
            + 'AAA and not A — but it is free to fix and it is the whole link text for this control.',
            'Name the destination.');
        }
      } else if (dests.size > 1 && group.length > 1) {
        add('2.4.4', 'A', group.map(l => l.name).join(', '), 'the same link text "' + String(group[0].text).trim()
          + '" points at ' + dests.size + ' different destinations.',
          'Two links that read the same should go to the same place.');
      }
    }
  } else {
    insufficient.push('no node carried role "link", "cta" or "button", so link text was not checked. '
      + 'A page with no links is unusual; a node list missing them is not.');
  }

  // ---- 1.1.1 Non-text Content (A)
  if (images.length) {
    ran.alt = true;
    for (const im of images) {
      const alt = im.alt;
      const dec = im.decorative === true;
      if (dec) {
        if (alt) add('1.1.1', 'A', im.name, 'marked decorative and given alt text "' + alt + '". '
          + 'Decorative means the reader loses nothing by not hearing it — so it should be announced '
          + 'as nothing.', 'Set alt to the empty string, not to a description.');
        continue;
      }
      if (alt == null) {
        add('1.1.1', 'A', im.name, 'no alt attribute at all. A missing alt is not the same as an '
          + 'empty one: many readers fall back to announcing the filename.',
          'Describe what the image conveys, or mark it decorative and set alt="".');
      } else if (!String(alt).trim()) {
        add('1.1.1', 'A', im.name, 'empty alt on an image not marked decorative. That is the right '
          + 'markup for decoration and the wrong markup for content, and nothing here says which.',
          'Mark it decorative if it is, otherwise describe it.');
      } else if (/^(image|photo|picture|graphic|img)[\s_-]/i.test(String(alt))) {
        add('1.1.1', 'A', im.name, 'alt begins "' + String(alt).split(/\s+/)[0] + '" — it is already '
          + 'announced as an image, so the word is repeated to the reader.',
          'Start with the content: "Blue ceramic mug on an oak desk", not "Image of…".');
      } else if (/\.(jpg|jpeg|png|webp|svg|gif)$/i.test(String(alt).trim())) {
        add('1.1.1', 'A', im.name, 'alt is a filename.', 'Describe what the image conveys.');
      }
    }
  }

  // ---- 1.4.3 Contrast (Minimum) (AA)
  if (texty.length) {
    ran.contrast = true;
    for (const n of texty) {
      const r = contrast(n.fg, n.bg);
      if (r == null) {
        skipped.push(n.name + ' (fg "' + n.fg + '" / bg "' + n.bg + '" are not both 6-digit hex)');
        continue;
      }
      if (n.size == null) {
        skipped.push(n.name + ' (no size, so the large-text threshold cannot be applied)');
        continue;
      }
      const floor = isLarge(n) ? 3 : 4.5;
      if (r < floor) {
        add('1.4.3', 'AA', n.name, r + ':1 against a ' + floor + ':1 floor ('
          + (isLarge(n) ? 'large text' : 'normal text') + ' at ' + n.size + 'px'
          + (n.bold ? ' bold' : '') + '), ' + n.fg + ' on ' + n.bg + '.',
          'Darken the foreground or lighten the background. A near miss is still a miss, even when '
           + 'the brand\'s own strictness map proposes it.');
      }
    }
  } else {
    insufficient.push('no node carried both a foreground and a background colour, so contrast was '
      + 'not checked anywhere. This is the check most likely to find something and the easiest to '
      + 'leave out of an export.');
  }

  // ---- 2.5.8 Target Size (Minimum) (AA, WCAG 2.2)
  const targets = links.filter(l => typeof l.width === 'number' && typeof l.height === 'number');
  if (targets.length) {
    ran.targets = true;
    for (const l of targets) {
      if (l.width < 24 || l.height < 24) {
        add('2.5.8', 'AA', l.name, Math.round(l.width) + '×' + Math.round(l.height)
          + ' against a 24×24 minimum.',
          'Grow the hit area — padding counts, the visible box does not have to.');
      }
    }
  } else if (links.length) {
    insufficient.push('no link carried width and height, so target size was not checked.');
  }

  const byLevel = findings.reduce((a, f) => (a[f.level] = (a[f.level] || 0) + 1, a), {});
  const blocking = findings.filter(f => f.level === 'A' || f.level === 'AA').length;
  return {
    verdict: insufficient.length ? 'INSUFFICIENT-INPUT' : (findings.length ? 'REPORT' : 'CLEAR'),
    findings, by_level: byLevel, at_or_below_aa: blocking,
    checks_run: ran, insufficient_input: insufficient, unreadable: skipped,
    note: 'Automated checking finds roughly a third of real accessibility problems. Keyboard order, '
        + 'focus visibility, motion, and whether the page makes sense read aloud are not in here and '
        + 'are not implied by a CLEAR result.',
  };
}

if (require.main === module) {
  const p = arg('--page');
  if (!p) die('need --page <page.json>.\n' +
    '  usage: a11y_check.js --page page.json [--strict] [--json]\n' +
    '  page.json is {"nodes":[…]} with role, text, level, alt, fg, bg, size, width, height.');
  let page;
  try { page = JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { die('cannot read --page at ' + p + '\n  Without the node list nothing can be measured, '
    + 'and a clean result would mean nothing. (' + e.message + ')'); }

  const r = a11yCheck(page);
  r.mode = has('--strict') ? 'strict (findings exit 1)' : 'callout (findings are reported, never blocked)';

  if (has('--json')) { console.log(JSON.stringify(r, null, 1)); }
  else {
    const line = '='.repeat(66);
    console.log(line); console.log('ACCESSIBILITY'); console.log(line);
    console.log('checked: ' + Object.entries(r.checks_run).filter(([, v]) => v).map(([k]) => k).join(', ')
      + (Object.values(r.checks_run).some(v => !v)
        ? '   NOT checked: ' + Object.entries(r.checks_run).filter(([, v]) => !v).map(([k]) => k).join(', ')
        : ''));
    if (r.findings.length) {
      console.log('-'.repeat(66));
      console.log(r.findings.length + ' finding(s) — ' + r.at_or_below_aa + ' at A or AA\n');
      for (const f of r.findings) {
        console.log('  [' + f.criterion + ' ' + f.level + ']  ' + f.node);
        console.log('      ' + f.detail);
        console.log('      → ' + f.fix + '\n');
      }
    }
    if (r.unreadable.length) {
      console.log('-'.repeat(66));
      console.log('NOT MEASURED (' + r.unreadable.length + ') — these may or may not pass:');
      for (const s of r.unreadable.slice(0, 8)) console.log('  · ' + s);
    }
    if (r.insufficient_input.length) {
      console.log('-'.repeat(66));
      console.log('COULD NOT CHECK — this is not a clear result\n');
      for (const s of r.insufficient_input) console.log('  · ' + s);
    }
    console.log(line);
    console.log(r.verdict === 'CLEAR' ? 'RESULT: CLEAR — every check that ran found nothing'
      : r.verdict === 'REPORT' ? 'RESULT: ' + r.findings.length + ' finding(s) — reported, not blocked'
      : 'RESULT: INSUFFICIENT-INPUT — the check did not run over everything it was pointed at');
    console.log('mode: ' + r.mode);
    console.log('\n' + r.note);
  }
  process.exit((r.verdict === 'INSUFFICIENT-INPUT' || (has('--strict') && r.findings.length)) ? 1 : 0);
}

module.exports = { a11yCheck, contrast, isLarge };
