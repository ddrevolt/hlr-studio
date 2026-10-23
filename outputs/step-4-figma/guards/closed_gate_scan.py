#!/usr/bin/env python3
"""Closed-gate scan (Chat 6, 2026-10-23; REVIEW.md section 6 row R19, after the Foundations review F1-05 and F2-01:
text kept promising work from a gate that had closed, on the boards and then in six pack lines the board fix missed).
A mention of a closed gate (PROGRESSION.md) fails when its clause promises the gate's work: "until Gate 4", "Gate 4
rules", "breakpoints at Gate 4", "a Gate 4 item", "are set at Gate 4", "Gate 4 will", "a proposal comes at Gate 4",
"Draft for Gate 4", "waits on Gate 4". Records pass: "Gate 4 left", "named at Gate 4", "since Gate 4", "Gate 2
package call 1", "Gate 1 C6", "(Eddie, Gate 2, 2026-10-21)", and dated log rows and comments. board_drift.js and
entity_scan.js carry the same rule for Figma text and descriptions (keep the three in step: the CASES below are their
shared test).
Usage: python3 closed_gate_scan.py <brand home> [--test | --cases-json | --verdicts-json]. Scans brand-pack/ (md, json, yaml) and the Review 2
package. Exit 0 when nothing promises a closed gate's work."""
import json, os, re, sys
PART = r'(?:named|ruled|adopted|ratified|decided|chosen|confirmed|closed|routed|set|recorded|approved|built|taken|kept|moved|made|picked|left open)'
# A closed gate's mention fails when its clause promises the gate's work. Citations of a past ruling ("Gate 2 package
# call 1", "(Eddie, Gate 2, 2026-10-21)", "Gate 1 C6", "Gate 4 left", "named at Gate 4") match none of these.
FUTURE = [r'\buntil Gate {n}\b',
          r'\bGate {n}\s+(?:will|would|shall|rules|sets|names|decides|chooses|settles|takes|owns|brings|confirms|ratifies|routes)\b',
          r'\b(?:is|are|be|being)\s+(?:\w+\s+)?' + PART + r'\s+(?:at|in|by|with)\s+Gate {n}\b',
          r'\b(?:an?|the)\s+Gate {n}\s+(?:item|decision|call|question|proposal|ruling|matter|task)\b(?!\s+\d)',
          r'\b(?:proposal|draft)\b[^.;]{{0,40}}\bGate {n}\b', r'\b(?:waits?|waiting)\s+(?:on|for)\s+Gate {n}\b',
          r'\b(?:comes?|arrives?|lands?)\b[^.;()]{{0,60}}\bGate {n}\b', r'\bfor Gate {n}\b', r'\bnot yet binding\b']
RECORD = r'\b(?:named|ruled|adopted|ratified|decided|chosen|confirmed|closed|routed|set|recorded|approved|built|taken|kept|moved|made|picked|left open)\b'
def bare_at(c, n):
    """A bare "at Gate 4" names the gate as the time of the work, unless a record verb goes before it in the clause
    (and not as "is named at") or a date goes with it."""
    for m in re.finditer(r'\bat Gate %d\b' % n, c):
        before, after = c[max(0, m.start() - 48):m.start()], c[m.end():m.end() + 16]
        if re.match(r'\s*(?:,\s*|\(|on\s+)?20\d\d-\d\d', after):
            continue
        if re.search(RECORD, before, re.I) and not re.search(r'\b(?:is|are|be|being)\s+(?:\w+\s+)?' + RECORD + r'[^.;]*$', before, re.I):
            continue
        return True
    return False
HISTORY = [r'^\|\s*20\d\d-\d\d-\d\d\s*\|', r'^\s*#\s*20\d\d-\d\d-\d\d']  # dated log rows and comments are records
def clauses(text):
    return [c for c in re.split(r'(?<=[.;!?])\s+|\n+', text) if c.strip()]
def promises(text, closed):
    """The clauses of text that promise a closed gate's work."""
    if any(re.search(h, text) for h in HISTORY):
        return []
    out = []
    for c in clauses(text):
        for n in sorted({int(g) for g in re.findall(r'\bGate (\d)\b', c)} & set(closed)):
            if any(re.search(p.format(n=n), c, re.I) for p in FUTURE) or bare_at(c, n):
                out.append(c.strip()); break
    return out
CASES = [  # (text, must fail), with Gates 1 to 4 closed. The first 14 are the Foundations review round 2 test set.
    ('Alternate grounds (Forest, Onyx, Fawn) arrive with their mode names at Gate 4', True),
    ('Clear space and minimum sizes: none documented; a proposal comes at Gate 4', True),
    ('Breakpoints are not set (figma.yaml breakpoints: null); a proposal comes with Gate 4', True),
    ('Clear space and minimum size: gap, proposal at Gate 4', True),
    ('[derived] Draft for Gate 4, not yet binding', True),
    ('[observed] breakpoints at Gate 4', True),
    ("Per-breakpoint budgets live in lane D's section_library; breakpoints at Gate 4.", True),
    ("The engine's reference phone is 390: Gate 4 rules the breakpoints (figma.yaml breakpoints null)", True),
    ('No recipe yet: canvas and structure are a Gate 4 item (owner Eddie).', True),
    ('The margins stay two tokens until Gate 4 sets the web margins, then fold into one canvas-moded space.margin', True),
    ('then the C4 candidate grounds as primitives until Gate 4 names the modes', True),
    ('Web breakpoints are set at Gate 4.', True), ('Gate 4 will name the breakpoints.', True),
    ('The focus ring is a Gate 4 decision.', True),
    ('Breakpoints are not set (figma.yaml breakpoints: null): Gate 4 left web breakpoints, margins and grid to Eddie at Review 2, with the web masters.', False),
    ("Gap, owner HLR: Gate 4 left it open for HLR’s vectors (Review 1).", False),
    ('[derived] Adopted at Gate 4, for Eddie to confirm', False),
    ('Forest, Onyx and Fawn are the alternate grounds, named at Gate 4.', False),
    ('(ratified 2026-10-22 by Eddie, Gate 2 package call 5) Its alias was set at Gate 4 (2026-10-23) [derived, for Eddie to confirm].', False),
    ('social 2 px [derived, ruled 2026-10-22 by Eddie, Gate 2 package call 1], unused while social art draws no CTA (Gate 1 C6)', False),
    ('Gate 4, decided by Claude under Eddie’s delegation (2026-10-23), for Eddie to confirm.', False),
    ('Aliases text.on-placeholder since Gate 4 (2026-10-23), so the label stays Onyx on every ground.', False),
    ('Review 2, with the web masters (Gate 4 closed without it)', False),
    ('Gate 3 call 7, path 1', False), ('The next batch waits on Gate 4.', True), ('Gate 4 sets it.', True),
    ('binding only once Eddie ratifies it at Gate 2.', True), ('the mode is named at Gate 4.', True),
    ('Eddie at Gate 2, then HLR', True), ('Gate 1 picks C3, C4, C5, C6 and C8 go to HLR at Review 1.', False),
    ('(Eddie, Gate 2, 2026-10-21)', False), ('Gate 4 added on-placeholder (31:40), 89 in all', False), ('(Gate 1, Brand Review Q11)', False),
    ('| 2026-10-22 | Strictness map | Eddie rules it at Gate 4, before any module |', False),
    ('keyed by Shopify handle until HLR\'s export lands, then by SKU (DECISIONS 2026-10-18, Gate 2 call 7 a)', False),
    ('Status: ratified by Eddie at Gate 2 on 2026-10-21 (lane C calls 1 a, 7 a and 8 a)', False),
    ('adopted as drafted at Gate 4 on 2026-10-23 by Claude under Eddie\'s delegation', False), ('Eddie rules on it at Gate 4, as planned.', True),
    ('the warm, deep and night grounds (named at Gate 4, 2026-10-23)', False), ('Eddie rules on it at Gate 4.', True),
]
def selftest():
    bad = [(t, m) for t, m in CASES if bool(promises(t, [1, 2, 3, 4])) != m]
    for t, m in bad: print('  self-test: should %s: %s' % ('fail' if m else 'pass', t))
    return not bad
if __name__ == '__main__':
    home = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else '.'
    if '--cases-json' in sys.argv: print(json.dumps(CASES, ensure_ascii=False)); sys.exit(0)
    if not selftest(): print('FAIL (self-test)'); sys.exit(2)
    if '--test' in sys.argv: print('self-test: %d cases, all as expected' % len(CASES)); sys.exit(0)
    prog = open(os.path.join(home, 'PROGRESSION.md'), encoding='utf-8').read()
    closed = sorted({int(n) for n in re.findall(r'- \[x\] \*\*Gate (\d)\*\*', prog)} | {int(n) for n in re.findall(r'\*\*Gate (\d)\*\* closed', prog)})
    files = []
    for root, ds, fs in os.walk(os.path.join(home, 'brand-pack')):
        files += [os.path.join(root, f) for f in fs if f.endswith(('.md', '.json', '.yaml', '.yml'))]
    files.append(os.path.join(home, 'outputs', 'step-4-figma', 'review-2-package.md'))
    hits = []; verdicts = []
    for f in sorted(files):
        if not os.path.exists(f): continue
        for i, line in enumerate(open(f, encoding='utf-8').read().split('\n'), 1):
            found = promises(line, closed)
            if re.search(r'\bGate \d\b', line): verdicts.append([line, len(found)])
            for c in found:
                hits.append('%s:%d: %s' % (os.path.relpath(f, home), i, c[:160]))
    if '--verdicts-json' in sys.argv: print(json.dumps({'closed': closed, 'lines': verdicts}, ensure_ascii=False)); sys.exit(0)
    print('closed gates %s; %d files; %d clause(s) promise a closed gate\'s work' % (closed, len(files), len(hits)))
    for h in hits: print('  ' + h)
    sys.exit(1 if hits else 0)
