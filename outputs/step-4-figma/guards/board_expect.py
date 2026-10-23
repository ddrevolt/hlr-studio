#!/usr/bin/env python3
"""Board drift guard, part 1 of 2 (Chat 6, 2026-10-23; REVIEW.md section 6 row R19, after R2-05 and the Foundations
review F1-01 to F1-05: boards on 00 Foundations kept text the pack had since changed; tightened after round 2, F2-02).
Builds what the 00 Foundations boards must say from the pack: every colour cell's hex, alias and whole tag line
(tokens.json; a [derived] value not yet ruled reads "[derived], for Eddie to confirm", and a [derived] part inside a
description adds "; the alias [derived], for Eddie to confirm"), every Certified pairs cell's four lines (its ratio,
computed as the engine computes it; its source; "certified: <roles>" or "recorded: <restriction>"; the pair with its
hexes), every Type specimen line in full (exemplars.json, and the two board lines that quote no exemplar) and how many
specimens the board holds (text styles x canvases), the strictness map rows (strictness-map.md) and the gates already
closed (PROGRESSION.md).
Usage: python3 board_expect.py <brand home> > board-expect.json, then paste its output as EXPECT in board_drift.js and
run that with use_figma (read-only). Prints hashed, compact JSON; --plain prints the values themselves."""
import json, re, sys
home = sys.argv[1] if len(sys.argv) > 1 else '.'
tok = json.load(open(home + '/brand-pack/tokens.json', encoding='utf-8'))
def get(path):
    o = tok
    for k in path.split('.'):
        o = o[k]
    return o
def walk(o, p=''):
    if isinstance(o, dict):
        if '$value' in o:
            yield p, o
        for k, v in o.items():
            if not k.startswith('$'):
                yield from walk(v, p + '.' + k if p else k)
def resolve(v):
    while isinstance(v, str) and v.startswith('{'):
        v = get(v.strip('{}'))['$value']
    return v
def tag_line(desc):
    """The tag line a Color cell shows for a token: its first tag, and any [derived] part not yet ruled."""
    tags = [(m.group(1), m.group(2) or '', m.start()) for m in re.finditer(r'\[(documented|observed|derived)((?:,[^\]]*)?)\]', desc)]
    if not tags:
        return None
    ruled = lambda rest: 'ruled' in rest or 'ratified' in rest
    k, rest, _ = tags[0]
    s = ('[derived' + rest + ']' if ruled(rest) else '[derived], for Eddie to confirm') if k == 'derived' else '[' + k + ']'
    for k, rest, at in tags[1:]:
        if k == 'derived' and not ruled(rest):
            s += ('; the alias' if re.search(r'\balias\b', desc[:at], re.I) else '; a part') + ' [derived], for Eddie to confirm'
    return s
colors = {}
for p, o in walk(tok):
    if o.get('$type') != 'color' or p.startswith('contrast-pairs'):
        continue
    v = o['$value']
    hexv = resolve(v)
    colors[p.replace('.', '/')] = {'hex': hexv.upper() if isinstance(hexv, str) else hexv,
                                   'alias': v.strip('{}').replace('.', '/') if isinstance(v, str) and v.startswith('{') else None,
                                   'tag': tag_line(o.get('$description', ''))}
def lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    c = [v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4 for v in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
def ratio(a, b):  # the engine's formula (tokens_build.js), printed as it prints it
    l1, l2 = sorted([lum(a), lum(b)], reverse=True)
    return '%.2f:1' % ((l1 + 0.05) / (l2 + 0.05))
def roles_phrase(r):
    s = r[0] if len(r) == 1 else ', '.join(r[:-1]) + ' and ' + r[-1]
    return s if 'display' in r else s + ', not display'
pairs = []
for p in tok['contrast-pairs']['pairs']:
    fg, bg = p['fg'].strip('{}'), p['bg'].strip('{}')
    fh, bh = resolve(p['fg']).lstrip('#').upper(), resolve(p['bg']).lstrip('#').upper()
    status = 'certified: ' + roles_phrase(p['roles']) if p.get('roles') else 'recorded: ' + p.get('restriction', '')
    pairs.append([ratio(fh, bh), p.get('source', ''), status,
                  '%s (#%s) on %s (#%s)' % (fg.replace('.', '/'), fh, bg.replace('.', '/'), bh)])
ex = json.load(open(home + '/brand-pack/exemplars.json', encoding='utf-8'))
lines = {}
def scan(o):
    if isinstance(o, dict):
        if 'id' in o and 'text' in o and isinstance(o['id'], str):
            lines[o['id']] = o['text']
        for v in o.values():
            scan(v)
    elif isinstance(o, list):
        for v in o:
            scan(v)
scan(ex)
ext = tok['$extensions']['com.hlr']
specimens = len(ext['text_styles']) * len(ext['modes']['layout'])  # one specimen row per text style on each canvas
OTHER = {'digits, not a price': '0123456789', 'the brand name': 'High Light Rituals'}  # board lines that quote no exemplar
sm = open(home + '/brand-pack/strictness-map.md', encoding='utf-8').read()
rows = [[c.strip().replace('`', '') for c in l.strip().strip('|').split(' | ')] for l in sm.split('\n')
        if l.startswith('| ') and not l.startswith('| Element class') and not l.startswith('|---')]
paras = sm.split('\n\n')
header = ' '.join(x.replace('`', '') for x in paras if x.startswith('Rules from the playbook') or x.startswith('Element classes from'))
closing = [x for x in paras if x.startswith('Adopted with')][0].strip().replace('`', '')
prog = open(home + '/PROGRESSION.md', encoding='utf-8').read()
closed = sorted({int(n) for n in re.findall(r'- \[x\] \*\*Gate (\d)\*\*', prog)} | {int(n) for n in re.findall(r'\*\*Gate (\d)\*\* closed', prog)})
def fnv(s):
    b = s.encode('utf-16-le'); h = 0x811c9dc5
    for i in range(0, len(b), 2):
        h ^= b[i] | (b[i + 1] << 8); h = (h * 0x01000193) & 0xffffffff
    return format(h, '08x')
# Hashed, so the expectations paste into board_drift.js small: the guard names the cell that differs, and this
# script's --plain output shows what the pack says for it.
if '--plain' in sys.argv:
    print(json.dumps({'colors': colors, 'pairs': pairs, 'lines': {k: v for k, v in lines.items() if k.startswith('hlr-')}, 'other': OTHER,
                      'specimens': specimens, 'strictness': {'rows': rows, 'header': header, 'closing': closing}, 'closedGates': closed},
                     ensure_ascii=False, indent=1))
else:
    print(json.dumps({'colors': {k: fnv('%s|%s|%s' % (v['hex'], v['alias'] or '', v['tag'])) for k, v in colors.items()},
                      'pairs': [fnv(chr(1).join(p)) for p in pairs],
                      'lines': {k: fnv(v.lower()) for k, v in lines.items() if k.startswith('hlr-')},
                      'other': {k: fnv(v.lower()) for k, v in OTHER.items()}, 'specimens': specimens,
                      'rows': [fnv(chr(1).join(r)) for r in rows], 'header': fnv(header), 'closing': fnv(closing), 'closed': closed},
                     separators=(',', ':')))
