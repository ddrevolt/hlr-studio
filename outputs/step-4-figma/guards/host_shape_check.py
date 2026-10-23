#!/usr/bin/env python3
"""Host consistency guard (Chat 6, 2026-10-23; REVIEW.md section 6 row R21, after R2-04 and R3-01: a fix reached an
element but not the modules that host it; tightened after the Foundations review round 2, F2-07, and round 3, F3-06).
Reads the pack only.
  1. A ruled element slot (RULES, from the slot map) carries its rule in the slot map's note, in its element's own
     copy shape (module-library.json MOD_SHAPE) and in the shape of every module that composes the element, directly
     or through another element, whether or not the shape writes the slot id; a shape that writes the slot id must
     carry it too. Carrying means every required phrase and no forbidden one (a negated rule fails: never, not, no,
     avoid, without, rather than or instead of before the rule's words; the full name outside its two-line exception).
  2. Every budget a shape writes, in digits or words and in any form ("12 characters at most", "a 10-character cap",
     "ten characters", "14 chars"), belongs to the slot id nearest it in the same clause, before or after it, and
     equals that slot's max_chars in the slot map.
  3. Every host-stamped slot (a module slot with role label, such as M11.cta) has its budget written in its module's
     copy shape, read the same way.
  4. Every composed element slot with budget_from names a host that composes the element.
  5. Every element slot whose slot map note carries a rule (never, only, a merge token) has an entry in RULES, so a
     ruled slot added later cannot go unchecked (after the batch 2 review round 1, BR1-08: E09's rule was missing).
RULES holds each ruled element slot with the phrases its slot map note gives it: E07.name (the short form), E09.price
and E09.compare_at (a merge token, never typed).
Usage: python3 host_shape_check.py <brand-pack folder>. Exit 0 on PASS, 1 on any failure."""
import json, re, sys
pack = sys.argv[1] if len(sys.argv) > 1 else 'brand-pack'
ml = json.load(open(pack + '/module-library.json', encoding='utf-8'))
sm = open(pack + '/slotmap.yaml', encoding='utf-8').read()
shape = ml.get('MOD_SHAPE', {})
RULES = {'E07.name': {'require': ['short form', 'only where it fits two lines'],
                      'forbid': [r'\b(?:never|not|no|avoid(?:s|ing)?|without|rather than|instead of)\b\W+(?:\w+\W+){0,2}short form',
                                 r'\bfull (?:\w+ )?name\b(?![^.;]{0,40}only where)']}}
MERGE = {'require': ['merge token', 'never typed'],
         'forbid': [r'\b(?:never|not|no|avoid(?:s|ing)?|without|rather than|instead of)\b\W+(?:\w+\W+){0,2}merge tokens?\b',
                    r'(?<!never )\btyped\b', r'\bas (?:a )?figures?\b']}
RULES.update({'E09.price': MERGE, 'E09.compare_at': MERGE})
WORDS = {w: i + 1 for i, w in enumerate('one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty'.split())}
WORDS.update({'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90})
TENS = '|'.join(['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'])
NUM = r'(\d+|(?:' + TENS + r')-(?:one|two|three|four|five|six|seven|eight|nine)|' + '|'.join(sorted(WORDS, key=len, reverse=True)) + ')'
BUDGET = re.compile(r'\b' + NUM + r'[- ](?:characters?|chars?)\b', re.I)
def number(w):
    w = w.lower()
    if w.isdigit(): return int(w)
    if '-' in w: a, b = w.split('-'); return WORDS[a] + WORDS[b]
    return WORDS[w]
def budgets(prose):
    """(slot id, n) for every budget the prose writes, each given to the slot id nearest it in its clause."""
    out = []
    for seg in prose.split(';'):
        ids = [(m.start(), m.end(), m.group(1)) for m in re.finditer(r'\b([EM]\d\d\.\w+)\b', seg)]
        for b in BUDGET.finditer(seg):
            if ids:
                near = min(ids, key=lambda i: (b.start() - i[1], 0) if i[1] <= b.start() else (i[0] - b.end(), 1))
                out.append((near[2], number(b.group(1))))
    return out
fails = []
slots = {m.group(1): m.group(0) for m in re.finditer(r'\{ id: ([EM]\d\d\.\w+), [^}]*\}', sm)}
budget = {k: int(re.search(r'max_chars: (\d+)', v).group(1)) for k, v in slots.items() if re.search(r'max_chars: (\d+)', v)}
blocks = {m.group(1): m.group(2) for m in re.finditer(r'\n  ([EM]\d\d):\n(.*?)(?=\n  [EM]\d\d:\n|\Z)', sm, re.S)}
def parts(key):
    comp = re.search(r'composed: \{([^}]*)\}', blocks.get(key, '')); reps = re.search(r'repeats: \{([^}]*)\}', blocks.get(key, ''))
    return set(re.findall(r'E\d\d', (comp.group(1) if comp else '') + ' ' + (reps.group(1) if reps else '')))
def composes(key, eid, seen=()):
    return eid in parts(key) or any(composes(p, eid, seen + (key,)) for p in parts(key) if p not in seen)
def carries(text, rule):
    miss = [p for p in rule['require'] if p not in text]
    bad = [p for p in rule['forbid'] if re.search(p, text, re.I)]
    return miss, bad
for sid, rule in RULES.items():
    eid = sid.split('.')[0]
    miss, bad = carries(slots.get(sid, ''), rule)
    if miss or bad: fails.append('slot map: %s does not carry its rule (missing %s; against it %s)' % (sid, miss, bad))
    hosts = {eid} | {k for k in shape if k != eid and (composes(k, eid) or sid in shape[k])}
    for k in sorted(hosts):
        if k not in shape: fails.append('%s has no copy shape, so nothing tells the copy skill %s\'s rule' % (k, sid)); continue
        miss, bad = carries(shape[k], rule)
        if miss or bad: fails.append('%s copy shape does not carry %s\'s rule (missing %s; against it %s)' % (k, sid, miss, bad))
for k, prose in shape.items():
    for sid, n in budgets(prose):
        if sid in budget and n != budget[sid]:
            fails.append('%s copy shape gives %s %d characters, the slot map %d' % (k, sid, n, budget[sid]))
for m in re.finditer(r'id: (M\d\d)\.(\w+), role: label, [^}]*?max_chars: (\d+)', sm):
    mid, field, n = m.group(1), m.group(2), int(m.group(3))
    if (mid + '.' + field, n) not in budgets(shape.get(mid, '')):
        fails.append('%s copy shape does not give %s.%s its budget, %d characters' % (mid, mid, field, n))
for m in re.finditer(r'\{ id: (E\d\d\.\w+), [^}]*\}', sm):
    note = re.search(r'note: "([^"]*)"', m.group(0))
    if note and re.search(r'\b(?:never|only|merge tokens?)\b', note.group(1), re.I) and m.group(1) not in RULES:
        fails.append('slot map: %s carries a rule ("%s") that RULES does not hold, so no host is checked for it' % (m.group(1), note.group(1)[:60]))
for m in re.finditer(r'id: (E\d\d)\.(\w+), [^}]*budget_from: "(M\d\d)"', sm):
    eid, host = m.group(1), m.group(3)
    if not composes(host, eid):
        fails.append('%s.%s budget_from %s, which does not compose %s, directly or through another element' % (eid, m.group(2), host, eid))
print('PASS' if not fails else 'FAIL'); [print(' ', f) for f in fails]
sys.exit(1 if fails else 0)
