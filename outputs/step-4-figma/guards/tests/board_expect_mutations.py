# Mutation tests for board_expect.py (written by the Foundations review round 2 as be_mutations.py, F2-02; kept here by
# Chat 6, 2026-10-23, REVIEW.md R20; round 3's classes added, F3-05, and a case passes only on the guard's own output,
# F3-07). Each case copies the inputs board_expect.py reads into a scratch brand home, applies one mutation, reruns it,
# and lists which EXPECT entries changed against the unmutated run. A case is ok only when the guard ran (exit 0, JSON
# out) and the entry the mutation targets changed; b7 and b8 must run and change nothing (b7 changes description prose
# only, the tag the board shows is unchanged; b8 a ground-mode value, the cells print light values). A guard that
# crashes on a case misses it.
# Usage: python3 board_expect_mutations.py <brand home> <board_expect.py> <scratch dir>.
import json, os, re, shutil, subprocess, sys
home, guard, out = sys.argv[1], sys.argv[2], sys.argv[3]
FILES = ['brand-pack/tokens.json', 'brand-pack/exemplars.json', 'brand-pack/strictness-map.md', 'brand-pack/figma.yaml', 'PROGRESSION.md']
src = {f: open(os.path.join(home, f), encoding='utf-8').read() for f in FILES}
def run(files):
    d = os.path.join(out, 'case'); shutil.rmtree(d, ignore_errors=True); os.makedirs(d + '/brand-pack')
    for f, s in files.items(): open(os.path.join(d, f), 'w', encoding='utf-8').write(s)
    p = subprocess.run([sys.executable, '-I', guard, d], capture_output=True, text=True)
    if p.returncode != 0: return {'error': 'exit %d: %s' % (p.returncode, ' '.join(p.stderr.split())[-200:])}
    try: return json.loads(p.stdout)
    except ValueError: return {'error': 'no JSON on stdout: ' + ' '.join(p.stdout.split())[:120]}
base = run(src)
def diff(a, b):
    ch = []
    for k in ('colors', 'lines'):
        ch += ['%s[%s]' % (k, x) for x in sorted(set(a[k]) | set(b[k])) if a[k].get(x) != b[k].get(x)]
    for k in ('pairs', 'rows'):
        if a[k] != b[k]: ch.append('%s (%d entries differ)' % (k, sum(1 for x, y in zip(a[k], b[k]) if x != y) + abs(len(a[k]) - len(b[k]))))
    for k in ('pairNames', 'status', 'space', 'margins', 'radius', 'strokes', 'breakpoints', 'header', 'closing', 'closed'):
        if a.get(k) != b.get(k): ch.append(k + ' ' + json.dumps(b.get(k))[:120])
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
def desc(path, old, new):
    def f(t):
        o = t
        for k in path.split('.'): o = o[k]
        assert old in o['$description'], (path, old); o['$description'] = o['$description'].replace(old, new, 1)
    return f
sem = lambda t: t['color']['semantic']
cases = [  # (name, files, the EXPECT entry that must change; None: must run and change nothing)
 ('b1 F1-03 state: placeholder label aliases text.primary', tok(lambda t: t['component']['placeholder']['label'].__setitem__('$value', '{color.semantic.text.primary}')), 'colors[component/placeholder/label]'),
 ('b2 F1-01 state: pair 4 names text.primary on the placeholder', tok(lambda t: t['contrast-pairs']['pairs'][3].__setitem__('fg', '{color.semantic.text.primary}')), 'pairs'),
 ('b3 F1-02 class: hlr-web-heading-04 text changed', ex(set_ex('hlr-web-heading-04', 'Words for the Heart')), 'lines[hlr-web-heading-04]'),
 ('b4 strictness map: one row cell changed', rep('brand-pack/strictness-map.md', 'Clear space and minimum size: gap, owner HLR', 'Clear space: 1x the cap height'), 'rows'),
 ('b5 PROGRESSION: Gate 4 not closed', rep('PROGRESSION.md', '- [x] **Gate 4**', '- [ ] **Gate 4**'), 'closed'),
 ('b6 tag: on-placeholder un-ruled, its tag flips back to derived', tok(lambda t: sem(t)['text']['on-placeholder'].__setitem__('$description', sem(t)['text']['on-placeholder']['$description'].replace('[documented]', '[derived]', 1))), 'colors[color/semantic/text/on-placeholder]'),
 ('b7 description only: on-placeholder prose changes, tag still [documented]', tok(desc('color.semantic.text.on-placeholder', 'Set at Gate 4', 'Named at Gate 4')), None),
 ('b8 a ground mode value: text.muted on deep changes', tok(lambda t: sem(t)['text']['muted']['$extensions']['com.hlr']['modes'].__setitem__('deep', '{color.extended.neutral-400}')), None),
 ('b9 a pair ratio or role: pair 4 roles body -> display', tok(lambda t: t['contrast-pairs']['pairs'][3].__setitem__('roles', ['display'])), 'pairs'),
 ('b10 a pair removed from contrast-pairs (board keeps its cell)', tok(lambda t: t['contrast-pairs']['pairs'].pop(9)), 'pairs'),
 ('b11 exemplar text changed after character 40', ex(lambda e: [find_ex(e, k).__setitem__('text', find_ex(e, k)['text'][:40] + ' CHANGED TAIL') for k in ['hlr-web-heading-03']]), 'lines[hlr-web-heading-03]'),
 ('b12 a Layout tag changed: the social CTA stroke no longer ruled', tok(desc('stroke.cta', '[derived, ruled 2026-10-22 by Eddie, Gate 2 package call 1]', '[derived]')), 'strokes'),
 ('b13 a margin re-aliased: space.email-margin to space.24', tok(lambda t: t['space']['email-margin'].__setitem__('$value', '{space.24}')), 'margins'),
 ('b14 a pair renamed in the pack: pair 1 source', tok(lambda t: t['contrast-pairs']['pairs'][0].__setitem__('source', 'Onyx on Alabaster')), 'pairNames'),
 ('b15 strictness map ratified on another day', rep('brand-pack/strictness-map.md', '(ratified 2026-10-23 by Eddie, decision sheet)', '(ratified 2026-10-24 by Eddie, decision sheet)'), 'status'),
 ('b16 figma.yaml breakpoints changed', rep('brand-pack/figma.yaml', 'breakpoints: { desktop: 1440, mobile: 390 }', 'breakpoints: { desktop: 1280, mobile: 390 }'), 'breakpoints'),
 ('b17 an exemplar\'s case changed: hlr-social-headline-05 capitalised', ex(lambda e: find_ex(e, 'hlr-social-headline-05').__setitem__('text', find_ex(e, 'hlr-social-headline-05')['text'].capitalize())), 'lines[hlr-social-headline-05]'),
 ('b18 a Color label: a colour token renamed (sea-salt to sea-mist)', tok(lambda t: t['color']['brand'].__setitem__('sea-mist', t['color']['brand'].pop('sea-salt'))), 'colors[color/brand/sea-mist]'),
]
lines = ['control: base run ' + ('ok' if 'error' not in base else 'ERROR ' + base['error'])]
for name, files, want in cases:
    r = run(files)
    if 'error' in r: lines.append('MISS %s -> the guard did not run: %s' % (name, r['error'])); continue
    ch = diff(base, r)
    ok = (not ch) if want is None else any(c.startswith(want) for c in ch)
    lines.append('%s %s -> %s' % ('ok  ' if ok else 'MISS', name, ', '.join(ch) or 'NO EXPECT CHANGE'))
print('\n'.join(lines))
if 'error' not in base: json.dump(base, open(os.path.join(out, 'base.json'), 'w'))
# the mutated EXPECT for the Figma run: b1 + b2 + b3 + b4 + b12 + b16 combined
combo = dict(src)
t = json.loads(src['brand-pack/tokens.json']); t['component']['placeholder']['label']['$value'] = '{color.semantic.text.primary}'; t['contrast-pairs']['pairs'][3]['fg'] = '{color.semantic.text.primary}'
desc('stroke.cta', '[derived, ruled 2026-10-22 by Eddie, Gate 2 package call 1]', '[derived]')(t)
combo['brand-pack/tokens.json'] = json.dumps(t, ensure_ascii=False, indent=1)
e = json.loads(src['brand-pack/exemplars.json']); find_ex(e, 'hlr-web-heading-04')['text'] = 'Words for the Heart'; combo['brand-pack/exemplars.json'] = json.dumps(e, ensure_ascii=False, indent=1)
combo['brand-pack/strictness-map.md'] = src['brand-pack/strictness-map.md'].replace('Clear space and minimum size: gap, owner HLR', 'Clear space: 1x the cap height', 1)
combo['brand-pack/figma.yaml'] = src['brand-pack/figma.yaml'].replace('breakpoints: { desktop: 1440, mobile: 390 }', 'breakpoints: { desktop: 1280, mobile: 390 }', 1)
c = run(combo)
if 'error' not in c and 'error' not in base:
    json.dump(c, open(os.path.join(out, 'expect_mutated.json'), 'w'), separators=(',', ':'))
    print('combined mutated EXPECT written:', ', '.join(diff(base, c)))
miss = [l for l in lines if l.startswith('MISS') or l.startswith('control: base run ERROR')]
for l in miss: print('  missed: ' + l)
sys.exit(1 if miss else 0)
