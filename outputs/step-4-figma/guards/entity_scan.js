// Entity and closed-gate guard (Chat 6, 2026-10-23). Entities: REVIEW.md section 6 row R12, after Chat 6's
// component descriptions (01, 02) and the Foundations review F1-04 (00): descriptions held &#39;, &quot; and &amp; as
// text, because the description setter stores a straight apostrophe, a straight double quote and an ampersand as HTML
// entities; descriptions are written with typographic quotes and no ampersand. Closed gates: row R19, after the
// Foundations review F1-05 and F2-01: text promising work from a gate that had closed (the rule block is
// closed_gate_rule.js's, verbatim; tests/closed_gate_parity.js keeps the copies in step).
// Read-only; run with use_figma once per page that holds components: set PAGE to 00 Foundations 0:1, 01 Elements 7:2
// or 02 Modules 7:3 (text styles and variables are scanned on every run), and paste board_expect.py's "closed" list as
// CLOSED. Returns every description, component name or text that holds an entity or promises a closed gate's work;
// [] passes.
const PAGE = '0:1';
const CLOSED = PASTE_CLOSED_GATES_HERE;
// BEGIN closed-gate rule
const closedGatePromises = (() => {
  // Built from char codes, not \u escapes, so the block survives being pasted through a tool that decodes them
  // (a decoded U+2028 inside a regex literal is a syntax error).
  const WS = new RegExp('[\\t\\x0b\\x0c\\r \\x1c-\\x1f\\x85\\xa0' + String.fromCharCode(0x1680, 0x2000) + '-' + String.fromCharCode(0x200a, 0x2028, 0x2029, 0x202f, 0x205f, 0x3000, 0xfeff) + ']', 'g');
  const norm = t => t.replace(WS, ' ');
  const PAST = '(?:named|ruled|adopted|ratified|decided|chosen|chose|confirmed|closed|routed|set|recorded|approved|built|taken|took|kept|moved|made|picked|added|settled)';
  const AUX = new Set(['is', 'are', 'be', 'being', 'get', 'gets', 'getting', 'to', 'will', 'would', 'shall', 'can', 'could', 'must', 'should', 'may', 'might']);
  const DATED = ' ?(?:, ?|\\(|on |\\(on )?20\\d\\d-\\d\\d', UNDATED = '(?!' + DATED + ')';
  const NOUN = '(?:item|decision|call|question|proposal|ruling|matter|task)';
  const VERB = '(?:will|would|shall|rules|sets|names|decides|chooses|settles|takes|owns|brings|confirms|ratifies|routes)';
  const future = n => { const g0 = 'gate ' + n, g = g0 + '\\b'; return [
    '\\buntil ' + g + '(?! ' + PAST + '\\b[^.;]*\\b20\\d\\d-\\d\\d)',
    '\\b' + g + ' (?:' + VERB + '\\b|to (?!(?:gate|review|step|chat|lane)\\b)[a-z])',
    '\\b' + g + ' (?:is|are)\\b(?! (?:closed|done|over|past)\\b)',
    '\\b(?:is|are|be|being|get|gets|getting) (?:\\S+ )?' + PAST + ' (?:at|in|by|with) ' + g + UNDATED,
    '\\ban? ' + g + ' ' + NOUN + '\\b(?! \\d)' + UNDATED,
    '(?:\\b(?:is|are|be|being|remains?|stays?)|:) the ' + g + ' ' + NOUN + '\\b(?! \\d)' + UNDATED,
    '\\b(?:proposal|draft)\\b[^.;]{0,40}\\b' + g, '\\b(?:waits?|waiting) (?:on|for) ' + g,
    '\\bpending\\b[^.;()]{0,24}\\b' + g, '\\b(?:comes?|arrives?|lands?)\\b[^.;()]{0,60}\\b' + g,
    '\\bfor ' + g + '(?!,? which ' + PAST + '\\b)' + UNDATED, '\\bto ' + g + UNDATED,
    '\\b(?:once|when|as soon as|by the time) ' + g + '(?! (?:' + PAST + '|had|was|were)\\b)',
    '\\b' + g0 + "['" + String.fromCharCode(0x2019) + "]s" + '\\b(?![^.;]{0,30}\\b20\\d\\d-\\d\\d)'].map(s => new RegExp(s, 'i')); };
  const DATED_RE = new RegExp('^' + DATED, 'i'), PAST_RE = new RegExp('^' + PAST + '$', 'i');
  const strip = w => w.replace(/^[(),:]+|[(),:]+$/g, '');
  const bareAt = (c, n) => {
    const re = new RegExp('\\bat gate ' + n + '\\b', 'gi'); let m;
    while ((m = re.exec(c))) {
      if (DATED_RE.test(c.slice(m.index + m[0].length))) continue;
      const toks = c.slice(0, m.index).split(' ').filter(Boolean); let j = toks.length - 1;
      if (j >= 2 && toks[j - 1].toLowerCase() === 'by') j -= 2;
      if (j >= 0 && /^\(?20\d\d-\d\d-\d\d[),]?$/i.test(toks[j])) j -= 1;
      if (j >= 0 && toks[j].toLowerCase() === 'on') j -= 1;
      const w = j >= 0 ? strip(toks[j].toLowerCase()) : '';
      const past = PAST_RE.test(w) || (w === 'open' && j >= 1 && toks[j - 1].toLowerCase() === 'left');
      if (past && !toks.slice(Math.max(0, j - 2), j).some(x => AUX.has(strip(x.toLowerCase())))) continue;
      return true;
    }
    return false;
  };
  const unbound = (c, n) => /\bnot yet binding\b/i.test(c) && [...c.matchAll(new RegExp('\\bgate ' + n + '\\b', 'gi'))].some(m => !DATED_RE.test(c.slice(m.index + m[0].length)));
  const OPEN_CELL = /^(?:open|pending|conflict|conditional|unresolved)\b|^\[derived\](?!.*\b(?:ratified|ruled|adopted)\b)|\bto confirm\b| open$/i;
  const STEP_CELL = /^(?:gate|review|step) \d+[a-z]?(?: ?(?:,|;|and) ?(?:gate|review|step) \d+[a-z]?)*$/i;
  const rowPromise = (t, closed) => {
    if (!t.trim().startsWith('|')) return false;
    const cells = t.trim().replace(/^\|+|\|+$/g, '').split('|').map(x => x.trim());
    if (!cells.some(x => OPEN_CELL.test(x))) return false;
    return cells.some(x => { const s = x.replace(/ ?\([^)]*\)/g, '').trim(); return STEP_CELL.test(s) && [...s.matchAll(/\bgate (\d)\b/gi)].some(g => closed.includes(+g[1])); });
  };
  const HISTORY = [/^\| *20\d\d-\d\d-\d\d *\|/i, /^ *# *20\d\d-\d\d-\d\d/i];
  return (text, closed) => {
    const t = norm(text);
    if (HISTORY.some(h => h.test(t))) return [];
    if (rowPromise(t, closed)) return [t.trim()];
    const out = [];
    for (const c of t.replace(/([.;!?])[ \n]+/g, '$1\n').split(/\n+/).filter(x => x.trim())) {
      const gs = [...new Set([...c.matchAll(/\bgate (\d)\b/gi)].map(x => +x[1]))].filter(g => closed.includes(g)).sort();
      for (const n of gs) if (future(n).some(r => r.test(c)) || bareAt(c, n) || unbound(c, n)) { out.push(c.trim()); break; }
    }
    return out;
  };
})();
// END closed-gate rule
const ENT = /&(#\d+|#x[0-9a-f]+|amp|quot|apos|lt|gt|nbsp);/i;
const page = await figma.getNodeByIdAsync(PAGE);
await figma.setCurrentPageAsync(page);
const hits = [];
const gate = (what, s) => { for (const c of closedGatePromises(s || '', CLOSED)) hits.push(what + ' promises a closed gate' + String.fromCharCode(8217) + 's work: "' + c.slice(0, 120) + '"'); };
for (const s of await figma.getLocalTextStylesAsync()) { if (ENT.test(s.description)) hits.push('text style ' + s.name); gate('text style ' + s.name, s.description); }
for (const v of await figma.variables.getLocalVariablesAsync()) { if (ENT.test(v.description)) hits.push('variable ' + v.name); gate('variable ' + v.name, v.description); }
let comps = 0, texts = 0;
for (const n of page.findAll(x => x.type === 'COMPONENT' || x.type === 'COMPONENT_SET')) { comps++; if (ENT.test(n.description || '')) hits.push('component ' + n.id + ' ' + n.name); if (ENT.test(n.name)) hits.push('name ' + n.id); gate('component ' + n.id + ' ' + n.name, n.description); }
for (const t of page.findAllWithCriteria({ types: ['TEXT'] })) { texts++; if (ENT.test(t.characters)) hits.push('text ' + t.id + ' ' + t.name); gate('text ' + t.id, t.characters); }
return { page: page.name, comps, texts, hits };
