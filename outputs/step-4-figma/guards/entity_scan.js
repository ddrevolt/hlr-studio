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
  const PART = '(?:named|ruled|adopted|ratified|decided|chosen|confirmed|closed|routed|set|recorded|approved|built|taken|kept|moved|made|picked|left open)';
  const fut = n => ['\\buntil Gate ' + n + '\\b',
    '\\bGate ' + n + '\\s+(?:will|would|shall|rules|sets|names|decides|chooses|settles|takes|owns|brings|confirms|ratifies|routes)\\b',
    '\\b(?:is|are|be|being)\\s+(?:\\w+\\s+)?' + PART + '\\s+(?:at|in|by|with)\\s+Gate ' + n + '\\b',
    '\\b(?:an?|the)\\s+Gate ' + n + '\\s+(?:item|decision|call|question|proposal|ruling|matter|task)\\b(?!\\s+\\d)',
    '\\b(?:proposal|draft)\\b[^.;]{0,40}\\bGate ' + n + '\\b', '\\b(?:waits?|waiting)\\s+(?:on|for)\\s+Gate ' + n + '\\b',
    '\\b(?:comes?|arrives?|lands?)\\b[^.;()]{0,60}\\bGate ' + n + '\\b', '\\bfor Gate ' + n + '\\b', '\\bnot yet binding\\b'].map(s => new RegExp(s, 'i'));
  const RECORD = new RegExp('\\b' + PART + '\\b', 'i');
  const PASSIVE = new RegExp('\\b(?:is|are|be|being)\\s+(?:\\w+\\s+)?\\b' + PART + '\\b[^.;]*$', 'i');
  const bareAt = (c, n) => {
    const re = new RegExp('\\bat Gate ' + n + '\\b', 'g'); let m;
    while ((m = re.exec(c))) {
      const before = c.slice(Math.max(0, m.index - 48), m.index), after = c.slice(m.index + m[0].length, m.index + m[0].length + 16);
      if (/^\s*(?:,\s*|\(|on\s+)?20\d\d-\d\d/.test(after)) continue;
      if (RECORD.test(before) && !PASSIVE.test(before)) continue;
      return true;
    }
    return false;
  };
  const HISTORY = [/^\|\s*20\d\d-\d\d-\d\d\s*\|/, /^\s*#\s*20\d\d-\d\d-\d\d/];
  return (text, closed) => {
    if (HISTORY.some(h => h.test(text))) return [];
    const out = [];
    for (const c of text.replace(/([.;!?])\s+/g, '$1\n').split(/\n+/).filter(x => x.trim())) {
      const gs = [...new Set([...c.matchAll(/\bGate (\d)\b/g)].map(x => +x[1]))].filter(g => closed.includes(g)).sort();
      for (const n of gs) if (fut(n).some(r => r.test(c)) || bareAt(c, n)) { out.push(c.trim()); break; }
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
