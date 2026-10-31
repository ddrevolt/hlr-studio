#!/usr/bin/env python3
"""Board drift guard, part 1 of 2 (Chat 6, 2026-10-23; REVIEW.md section 6 row R19, after R2-05 and the Foundations
review F1-01 to F1-05: boards on 00 Foundations kept text the pack had since changed; tightened after round 2, F2-02).
Builds what the 00 Foundations boards must say from the pack: every colour cell's hex, alias and whole tag line
(tokens.json; a [derived] value not yet ruled reads "[derived], for Donnie to confirm", and a [derived] part inside a
description adds "; the alias [derived], for Donnie to confirm"; Donnie confirms since Eddie's ruling of 2026-10-23), every Certified pairs cell's four lines (its ratio,
computed as the engine computes it; its source; "certified: <roles>" or "recorded: <restriction>"; the pair with its
hexes), every Type specimen line in full (exemplars.json, and the two board lines that quote no exemplar) and how many
specimens the board holds (text styles x canvases), the strictness map rows, header, closing note and status
(strictness-map.md), the Layout board's token lines (each space step, the two margins, the radius, the CTA and rule
strokes on each canvas with their tags, the breakpoints; tokens.json and figma.yaml) and the gates already closed
(PROGRESSION.md). Every Color cell is expected in full: its label, its path, "HEX" or "HEX, alias of PATH" and its tag
line. Type lines are compared in their exact case, as the board renders them (Foundations review round 3, F3-05).
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
    s = ('[derived' + rest + ']' if ruled(rest) else '[derived], for Donnie to confirm') if k == 'derived' else '[' + k + ']'
    for k, rest, at in tags[1:]:
        if k == 'derived' and not ruled(rest):
            s += ('; the alias' if re.search(r'\balias\b', desc[:at], re.I) else '; a part') + ' [derived], for Donnie to confirm'
    return s
colors = {}
for p, o in walk(tok):
    if o.get('$type') != 'color' or p.startswith('contrast-pairs'):
        continue
    v = o['$value']
    hexv = resolve(v)
    parts = p.split('.'); alias = v.strip('{}').replace('.', '/') if isinstance(v, str) and v.startswith('{') else None
    hx = hexv.upper() if isinstance(hexv, str) else hexv
    colors[p.replace('.', '/')] = {'label': ' '.join(parts[2:] if parts[0] == 'color' else parts[1:]), 'path': p.replace('.', '/'),
                                   'value': hx + (', alias of ' + alias if alias else ''), 'hex': hx, 'alias': alias,
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
st = re.search(r"(Drafted by .*? delegation)\b.*?\(ratified (\d{4}-\d\d-\d\d) by (Eddie|Donnie)", sm.replace('\u2019', "'"))
status = {'drafted': st.group(1), 'ratified': st.group(2), 'by': st.group(3)}   # Eddie ratified the map; Donnie ratifies from 2026-10-23
TAG = r'\[(documented|observed|derived)((?:,[^\]]*)?)\]'
def ruled_date(rest):
    m = re.search(r'\b(?:ruled|ratified) (\d{4}-\d\d-\d\d)', rest); return m.group(1) if m else None
def modes_from(text):
    """{canvas: [px, tag kind, ruled date]} from "web 1 px [observed, ...]", "web: 1 px [...]" or "1 px on web and social [...]"."""
    out, last = {}, 0
    for m in re.finditer(TAG, text):
        span = text[last:m.start()]; last = m.end()
        for c, px in re.findall(r'\b(web|social|email):? (\d+) px\b', span): out[c] = [int(px), m.group(1), ruled_date(m.group(2))]
        for px, cs in re.findall(r'\b(\d+) px on ((?:web|social|email)(?:(?:, | and )(?:web|social|email))*)', span):
            for c in re.findall(r'web|social|email', cs): out[c] = [int(px), m.group(1), ruled_date(m.group(2))]
    return out
px = lambda v: int(str(resolve(v)).replace('px', ''))
first_tag = lambda d: (re.search(TAG, d) or [None, None])[1]
space = {'space/' + k: '%d px' % px(o['$value']) for k, o in tok['space'].items() if re.fullmatch(r'\d+', k)}
margins = {'space/' + k: {'px': px(o['$value']), 'alias': o['$value'].strip('{}').replace('.', '/'), 'tag': first_tag(o.get('$description', '')),
                          'ratified': (re.search(r'\(ratified (\d{4}-\d\d-\d\d)', o.get('$description', '')) or [None, None])[1]}
           for k, o in tok['space'].items() if k.endswith('-margin')}
radius = {'radius/' + k: {'v': str(o['$value']).replace('px', ''), 'tag': first_tag(o.get('$description', ''))} for k, o in tok['radius'].items()}
strokes = {}
for k in ('cta', 'rule'):
    o = tok['stroke'][k]; got = modes_from(o.get('$description', ''))
    vals = {'web': px(o['$value']), **{c: px(v) for c, v in o.get('$extensions', {}).get('com.hlr', {}).get('modes', {}).items()}}
    strokes['stroke/' + k] = {c: [vals[c]] + got.get(c, [None, None, None])[1:] for c in vals}
fy = open(home + '/brand-pack/figma.yaml', encoding='utf-8').read()
bp = re.search(r'^\s*breakpoints:\s*\{([^}]*)\}', fy, re.M)
breakpoints = sorted(int(x) for x in re.findall(r':\s*(\d+)', bp.group(1))) if bp else []
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
                      'specimens': specimens, 'strictness': {'rows': rows, 'header': header, 'closing': closing, 'status': status}, 'closedGates': closed,
                      'layout': {'space': space, 'margins': margins, 'radius': radius, 'strokes': strokes, 'breakpoints': breakpoints}},
                     ensure_ascii=False, indent=1))
else:
    print(json.dumps({'colors': {k: fnv(chr(1).join([v['label'], v['path'], v['value'], v['tag'] or ''])) for k, v in colors.items()},
                      'pairs': [fnv(chr(1).join(p)) for p in pairs], 'pairNames': [p[1] for p in pairs],
                      'lines': {k: fnv(v) for k, v in lines.items() if k.startswith('hlr-')},
                      'other': {k: fnv(v) for k, v in OTHER.items()}, 'specimens': specimens,
                      'rows': [fnv(chr(1).join(r)) for r in rows], 'header': fnv(header), 'closing': fnv(closing), 'status': status,
                      'space': space, 'margins': margins, 'radius': radius, 'strokes': strokes, 'breakpoints': breakpoints, 'closed': closed},
                     separators=(',', ':')))
