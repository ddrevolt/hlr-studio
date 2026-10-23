// The closed-gate rule for Figma text (Chat 6, 2026-10-23; REVIEW.md section 6 row R19, after the Foundations review
// F1-05 and F2-01 and F2-02). The JS twin of closed_gate_scan.py's rule: board_drift.js and entity_scan.js embed the
// block between the markers verbatim, and tests/closed_gate_parity.js checks the three copies are identical and agree
// with the Python rule on its CASES and on every pack line that names a closed gate.
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
if (typeof module !== 'undefined') module.exports = { closedGatePromises };
