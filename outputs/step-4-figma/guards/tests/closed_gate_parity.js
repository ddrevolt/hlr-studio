// Parity test for the closed-gate rule (Chat 6, 2026-10-23, R19 and R20): the block in closed_gate_rule.js,
// board_drift.js and entity_scan.js must be identical, and must agree with closed_gate_scan.py on its CASES and on
// every pack line that names a gate, and on 5,000 seeded fuzzed lines (closed_gate_scan.py --fuzz-json). Usage: node tests/closed_gate_parity.js <brand home>. Exit 0 when all agree.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const G = path.join(__dirname, '..'), home = process.argv[2] || '.';
const block = f => { const t = fs.readFileSync(path.join(G, f), 'utf8'); const m = t.match(/\/\/ BEGIN closed-gate rule\n([\s\S]*?)\/\/ END closed-gate rule/); return m ? m[1] : null; };
const ref = block('closed_gate_rule.js'); let fails = 0;
for (const f of ['board_drift.js', 'entity_scan.js']) { const b = block(f); if (b !== ref) { fails++; console.log('FAIL ' + f + ': ' + (b === null ? 'no rule block' : 'its rule block differs from closed_gate_rule.js')); } }
const { closedGatePromises } = require(path.join(G, 'closed_gate_rule.js'));
const py = a => JSON.parse(cp.execFileSync('python3', ['-I', path.join(G, 'closed_gate_scan.py'), ...a], { encoding: 'utf8' }));
const cases = py(['--cases-json']);
for (const [t, mustFail] of cases) if ((closedGatePromises(t, [1, 2, 3, 4]).length > 0) !== mustFail) { fails++; console.log('FAIL case (should ' + (mustFail ? 'fail' : 'pass') + '): ' + t); }
const fz = py(['--fuzz-json']); let fd = 0;  // 5,000 seeded lines with odd spaces and non-ASCII words: the parity is by construction
for (const [t, n] of fz) if (closedGatePromises(t, [1, 2, 3, 4]).length !== n) { fd++; if (fd <= 3) console.log('FAIL fuzz line, Python ' + n + ': ' + JSON.stringify(t).slice(0, 140)); }
fails += fd;
const v = py([home, '--verdicts-json']);
for (const [line, n] of v.lines) { const j = closedGatePromises(line, v.closed).length; if ((j > 0) !== (n > 0)) { fails++; console.log('FAIL pack line, Python ' + n + ' JS ' + j + ': ' + line.slice(0, 140)); } }
console.log(fails ? fails + ' disagreement(s)' : 'parity: ' + cases.length + ' cases, ' + fz.length + ' fuzzed lines and ' + v.lines.length + ' pack lines agree; the embedded blocks are identical');
process.exit(fails ? 1 : 0);
