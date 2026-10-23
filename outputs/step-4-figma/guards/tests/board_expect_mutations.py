# Mutation tests for board_expect.py (written by the Foundations review round 2 as be_mutations.py, F2-02; kept here by
# Chat 6, 2026-10-23, REVIEW.md R20). Each case copies the four inputs board_expect.py reads into a scratch brand home,
# applies one mutation, reruns it, and lists which EXPECT entries changed against the unmutated run. Every case but b7
# and b8 must change an entry: b7 changes description prose only (the tag, which the board shows, still says derived),
# b8 a ground-mode value (the cells print light values; the ground specimens resolve live).
# Usage: python3 board_expect_mutations.py <brand home> <board_expect.py> <scratch dir>.
import json, os, re, shutil, subprocess, sys
home, guard, out = sys.argv[1], sys.argv[2], sys.argv[3]
FILES = ['brand-pack/tokens.json', 'brand-pack/exemplars.json', 'brand-pack/strictness-map.md', 'PROGRESSION.md']
src = {f: open(os.path.join(home, f), encoding='utf-8').read() for f in FILES}
def run(files):
    d = os.path.join(out, 'case'); shutil.rmtree(d, ignore_errors=True); os.makedirs(d + '/brand-pack')
    for f, s in files.items(): open(os.path.join(d, f), 'w', encoding='utf-8').write(s)
    p = subprocess.run([sys.executable, '-I', guard, d], capture_output=True, text=True)
    return json.loads(p.stdout) if p.returncode == 0 else {'error': p.stderr[-300:]}
base = run(src)
def diff(a, b):
    ch = []
    for k in ('colors', 'lines'):
        ch += ['%s[%s]' % (k, x) for x in sorted(set(a[k]) | set(b[k])) if a[k].get(x) != b[k].get(x)]
    for k in ('pairs', 'rows'):
        if a[k] != b[k]: ch.append('%s (%d entries differ)' % (k, sum(1 for x, y in zip(a[k], b[k]) if x != y) + abs(len(a[k]) - len(b[k]))))
    for k in ('header', 'closing', 'closed'):
        if a[k] != b[k]: ch.append(k + ' ' + json.dumps(b[k]))
    return ch
def tok(fn):
    t = json.loads(src['brand-pack/tokens.json']); fn(t); s = dict(src); s['brand-pack/tokens.json'] = json.dumps(t, ensure_ascii=False, indent=1); return s
def rep(f, old, new):
    assert src[f].count(old) >= 1, (f, old); s = dict(src); s[f] = src[f].replace(old, new, 1); return s
def ex(fn):
    e = json.loads(src['brand-pack/exemplars.json']); fn(e); s = dict(src); s['brand-pack/exemplars.json'] = json.dumps(e, ensure_ascii=False, indent=1); return s
def find_ex(e, i):
    if isinstance(e, dict):
        if e.get('id') == i: return e
        for v in e.values():
            r = find_ex(v, i)
            if r: return r
    elif isinstance(e, list):
        for v in e:
            r = find_ex(v, i)
            if r: return r
def set_ex(i, text):
    def f(e): find_ex(e, i)['text'] = text
    return f
sem = lambda t: t['color']['semantic']
cases = [
 ('b1 F1-03 state: placeholder label aliases text.primary', tok(lambda t: t['component']['placeholder']['label'].__setitem__('$value', '{color.semantic.text.primary}'))),
 ('b2 F1-01 state: pair 4 names text.primary on the placeholder', tok(lambda t: t['contrast-pairs']['pairs'][3].__setitem__('fg', '{color.semantic.text.primary}'))),
 ('b3 F1-02 class: hlr-web-heading-04 text changed', ex(set_ex('hlr-web-heading-04', 'Words for the Heart'))),
 ('b4 strictness map: one row cell changed', rep('brand-pack/strictness-map.md', 'Clear space and minimum size: gap, owner HLR', 'Clear space: 1x the cap height')),
 ('b5 PROGRESSION: Gate 4 not closed', rep('PROGRESSION.md', '- [x] **Gate 4**', '- [ ] **Gate 4**')),
 ('b6 tag: on-placeholder ruled, tag flips to documented', tok(lambda t: sem(t)['text']['on-placeholder'].__setitem__('$description', sem(t)['text']['on-placeholder']['$description'].replace('[derived]', '[documented]')))),
 ('b7 description only: on-placeholder says ratified, tag still [derived]', tok(lambda t: sem(t)['text']['on-placeholder'].__setitem__('$description', sem(t)['text']['on-placeholder']['$description'].replace('for Eddie to confirm', 'ratified by Eddie')))),
 ('b8 a ground mode value: text.muted on deep changes', tok(lambda t: sem(t)['text']['muted']['$extensions']['com.hlr']['modes'].__setitem__('deep', '{color.extended.neutral-400}'))),
 ('b9 a pair ratio or role: pair 4 roles body -> display', tok(lambda t: t['contrast-pairs']['pairs'][3].__setitem__('roles', ['display']))),
 ('b10 a pair removed from contrast-pairs (board keeps its cell)', tok(lambda t: t['contrast-pairs']['pairs'].pop(9))),
 ('b11 exemplar text changed after character 40', ex(lambda e: [find_ex(e, k).__setitem__('text', find_ex(e, k)['text'][:40] + ' CHANGED TAIL') for k in ['hlr-web-heading-03']])),
]
lines = ['control: base run ' + ('ok' if 'error' not in base else base['error'])]
for name, files in cases:
    r = run(files)
    lines.append('%s -> %s' % (name, r['error'] if 'error' in r else (', '.join(diff(base, r)) or 'NO EXPECT CHANGE')))
print('\n'.join(lines))
json.dump(base, open(os.path.join(out, 'base.json'), 'w'))
# the mutated EXPECT for the Figma run: b1 + b2 + b3 + b4 combined
combo = dict(src)
for f, s in [('brand-pack/tokens.json', None)]: pass
t = json.loads(src['brand-pack/tokens.json']); t['component']['placeholder']['label']['$value'] = '{color.semantic.text.primary}'; t['contrast-pairs']['pairs'][3]['fg'] = '{color.semantic.text.primary}'
combo['brand-pack/tokens.json'] = json.dumps(t, ensure_ascii=False, indent=1)
e = json.loads(src['brand-pack/exemplars.json']); find_ex(e, 'hlr-web-heading-04')['text'] = 'Words for the Heart'; combo['brand-pack/exemplars.json'] = json.dumps(e, ensure_ascii=False, indent=1)
combo['brand-pack/strictness-map.md'] = src['brand-pack/strictness-map.md'].replace('Clear space and minimum size: gap, owner HLR', 'Clear space: 1x the cap height', 1)
c = run(combo); json.dump(c, open(os.path.join(out, 'expect_mutated.json'), 'w'), separators=(',', ':'))
print('combined mutated EXPECT written:', ', '.join(diff(base, c)))
miss = [l for l in lines[1:] if 'NO EXPECT CHANGE' in l and not l.startswith(('b7 ', 'b8 '))]
for l in miss: print('MISS ' + l)
sys.exit(1 if miss or 'error' in base else 0)
