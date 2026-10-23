#!/usr/bin/env python3
"""Host consistency guard (Chat 6, 2026-10-23; REVIEW.md section 6 row R21, after R2-04 and R3-01: a fix reached an
element but not the modules that host it; tightened after the Foundations review round 2, F2-07). Reads the pack only.
  1. A ruled element slot (RULES, from the slot map) carries its rule in the slot map's note, in its element's own
     copy shape (module-library.json MOD_SHAPE) and in the shape of every module that composes the element, directly
     or through another element, whether or not the shape writes the slot id; a shape that writes the slot id must
     carry it too. Carrying means every required phrase and no forbidden one (a negated rule fails).
  2. Every budget a shape writes after a slot id, in the same clause ("(E02.label, 12 characters at most)", "the CTA label (M11.cta)
     caps, 16 characters at most") equals that slot's max_chars in the slot map.
  3. Every host-stamped slot (a module slot with role label, such as M11.cta) has its budget written in its module's
     copy shape.
  4. Every composed element slot with budget_from names a host that composes the element.
Usage: python3 host_shape_check.py <brand-pack folder>. Exit 0 on PASS, 1 on any failure."""
import json, re, sys
pack = sys.argv[1] if len(sys.argv) > 1 else 'brand-pack'
ml = json.load(open(pack + '/module-library.json', encoding='utf-8'))
sm = open(pack + '/slotmap.yaml', encoding='utf-8').read()
shape = ml.get('MOD_SHAPE', {})
RULES = {'E07.name': {'require': ['short form', 'only where it fits two lines'],
                      'forbid': [r'\b(?:never|not|no)\b\W+(?:\w+\W+){0,2}short form', r'\bfull (?:display )?name\b(?![^.;]{0,40}only where)']}}
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
    for seg in prose.split(';'):
        for n in re.finditer(r'(\d+) characters', seg):
            ids = re.findall(r'\b([EM]\d\d\.\w+)\b', seg[:n.start()])
            if ids and ids[-1] in budget and int(n.group(1)) != budget[ids[-1]]:
                fails.append('%s copy shape gives %s %s characters, the slot map %d' % (k, ids[-1], n.group(1), budget[ids[-1]]))
for m in re.finditer(r'id: (M\d\d)\.(\w+), role: label, [^}]*?max_chars: (\d+)', sm):
    mid, field, n = m.group(1), m.group(2), m.group(3)
    prose = shape.get(mid, '')
    if (mid + '.' + field) not in prose or (n + ' characters') not in prose:
        fails.append('%s copy shape does not give %s.%s its budget, %s characters' % (mid, mid, field, n))
for m in re.finditer(r'id: (E\d\d)\.(\w+), [^}]*budget_from: "(M\d\d)"', sm):
    eid, host = m.group(1), m.group(3)
    if not composes(host, eid):
        fails.append('%s.%s budget_from %s, which does not compose %s, directly or through another element' % (eid, m.group(2), host, eid))
print('PASS' if not fails else 'FAIL'); [print(' ', f) for f in fails]
sys.exit(1 if fails else 0)
