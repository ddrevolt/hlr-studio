# Builds the corpus TSVs and counts.md from the verified read-only walk chunks in ../_raw.
import sys, os, json, re, collections
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import decode

RAW = os.path.join(HERE, '..', '_raw')
OUT = os.path.join(HERE, '..')
CHAT1 = '/mnt/user-data/uploads/claude-cowork/highlight-brandbook/outputs/step-1-review/figma'

PAGES = [
    ('email', '0:1', 'Email', ['email_01.json', 'email_02.json'] + ['email_R%d.json' % i for i in range(1, 8)], 'email_R1.json'),
    ('social', '2:32177', 'Organic Social', ['social_R%d.json' % i for i in range(1, 11)], 'social_R1.json'),
    ('paid', '2:35858', 'Paid Social', ['paid_R%d.json' % i for i in range(1, 9)], 'paid_R1.json'),
    ('web', '2:182972', 'Website', ['web_R%d.json' % i for i in range(1, 4)], 'web_R1.json'),
]
INDEPENDENT_TEXT_COUNT = {'0:1': 4156, '2:32177': 3807, '2:35858': 3613, '2:182972': 1398}
# Website (v6) chunks carry their own hashes, computed in the file at the source (method.md, 5f).
SOURCE_HASHED = {'2:182972': ['web_S1.json']}
NOT_WALKED = [('Components', '2:31579', 'other', 53), ('Retail/Press', '2:33120', 'other', 1287), ('Print', '2:35751', 'other', 20),
              ('Inspiration', '2:35848', 'other', 0), ('Images', '2:31298', 'other', 85)]
RULING = "by the client lead's ruling of 2026-10-18"

COLS = ['channel', 'page', 'section_path', 'frame_id', 'frame_name', 'frame_w', 'frame_h', 'text_id', 'layer_name',
        'characters', 'font_family', 'font_style', 'font_size', 'x', 'y', 'w', 'h', 'flags']

ESC_COUNTS = collections.Counter()


def esc(s):
    if s is None:
        return ''
    out = []
    for ch in s:
        o = ord(ch)
        if ch == '\\':
            out.append('\\\\'); ESC_COUNTS['backslash'] += 1
        elif ch == '\n':
            out.append('\\n'); ESC_COUNTS['newline'] += 1
        elif ch == '\r':
            out.append('\\r'); ESC_COUNTS['carriage_return'] += 1
        elif ch == '\t':
            out.append('\\t'); ESC_COUNTS['tab'] += 1
        elif o < 32 or o in (0x7f, 0x85, 0x2028, 0x2029):
            out.append('\\u%04x' % o); ESC_COUNTS['U+%04X' % o] += 1
        else:
            out.append(ch)
    return ''.join(out)


JS_WS = '[\t\n\v\f\r    -     　﻿]'


def nz(s):
    return re.sub(JS_WS + '+', ' ', s).strip(' ')


def layer_name(r):
    # Exact name only when it differs from the text after whitespace collapse (hash-verified); otherwise the collapsed text.
    if r['layer_name'] is not None:
        return r['layer_name']
    return nz(r['characters'])


def flags(r):
    f = []
    if r['kind'] == 'b':
        f.append('board_text')
    if r['kind'] == 'l':
        f += ['loose_text', 'coords=canvas']
    if str(r['nested']) == '1':
        f.append('nested')
    if r['flag']:
        f.append(r['flag'])
    if ' / ' in r['font_family'] or ' / ' in r['font_style']:
        f.append('mixed_font_runs')
    if r['font_size'] == '':
        f.append('mixed_size')
    if r['layer_name'] is not None:
        f.append('name_differs')
    return ';'.join(f)


def tsv_row(ch, pname, r, with_reason):
    loose = r['kind'] == 'l'
    vals = [ch, pname, r['section_path'],
            '' if loose else r['frame_id'], '' if loose else (r['frame_name'] or ''),
            '' if loose else str(r['frame_w']), '' if loose else str(r['frame_h']),
            r['text_id'], layer_name(r), r['characters'], r['font_family'], r['font_style'], r['font_size'],
            str(r['x']), str(r['y']), str(r['w']), str(r['h']), flags(r)]
    if with_reason:
        vals.append(r['reason'])
    return '\t'.join(esc(v) for v in vals)


import applyfix, strcheck
FIXES, FIXBAD = applyfix.load_fixes()
assert not FIXBAD, FIXBAD
STRCHECK = json.load(open(os.path.join(RAW, 'strcheck.json')))


def load_page(key, pid, files, r1):
    gstr = decode.load_strings(RAW, pid) + decode.load(os.path.join(RAW, r1))['t']
    if pid in SOURCE_HASHED:
        import chunkcheck
        for f in SOURCE_HASHED[pid]:
            d, _, bad = chunkcheck.check(f)
            assert not bad, ('source hash check', f, bad)
        assert len(gstr) == d['h'][4], ('string table length', pid, len(gstr), d['h'][4])
        for f in files:
            d, _, bad = chunkcheck.check(f, r1)
            assert not bad, ('source hash check', f, bad)
        _, _, bad = chunkcheck.check('census_%s.json' % key)
        assert not bad, ('source hash check', 'census', bad)
    else:
        for (fp, kind, idx), s in FIXES.items():
            if fp == pid and kind == 't':
                gstr[idx] = s
        assert strcheck.blocks(gstr) == STRCHECK[pid]['tb'].split(','), ('string table hash check', pid)
    rows = []
    for f in files:
        d, rr = decode.decode(os.path.join(RAW, f), gstr)
        if d['v'] < 3:
            for r in rr:
                r['_v12'] = True
        rows += rr
    if pid == '0:1':
        v12 = [r for r in rows if r.get('_v12')]
        for (fp, kind, idx), s in FIXES.items():
            if fp == pid and kind == 'r':
                v12[idx]['characters'] = s
        assert strcheck.blocks([r['characters'] for r in v12]) == STRCHECK[pid]['rb'].split(','), 'v1/v2 row hash check'
    return rows


def census(key):
    c = decode.load(os.path.join(RAW, 'census_%s.json' % key))
    secs = []
    for s in c['s']:
        i, d, path, v = s.split('|', 3)
        u0, u1, b0, b1, l0, l1, wt, tx = [int(x) for x in v.split(',')]
        secs.append(dict(i=int(i), d=int(d), path=path, u0=u0, u1=u1, b0=b0, b1=b1, l0=l0, l1=l1, wt=wt, tx=tx))
    k1 = []
    for s in c['k1']:
        name, fr, sub, tx = s.rsplit('|', 3)
        k1.append(dict(name=name, frames=int(fr), subsections=int(sub), texts=int(tx)))
    return c, secs, k1


def top(path):
    return path.split(' / ')[0]


def chat1_frames(key):
    fn = os.path.join(CHAT1, 'frames-%s.tsv' % key)
    out = collections.Counter(); types = collections.defaultdict(collections.Counter)
    with open(fn, encoding='utf-8') as fh:
        lines = fh.read().split('\n')
    hdr = lines[1].split('\t')
    for ln in lines[2:]:
        if not ln.strip():
            continue
        p = ln.split('\t')
        rec = dict(zip(hdr, p))
        out[rec['section']] += 1
        types[rec['section']][rec['type']] += 1
    return out, types


def md(s):
    return esc(s).replace('|', '\\|')


def verify(key, pid, files, rows):
    # End-to-end check against block hashes computed in the file by read-only calls (_raw/rowcheck.json, unitcheck.json, namecheck.json).
    import rowcheck, unitcheck, namecheck
    if pid in SOURCE_HASHED:
        # Every chunk was already checked against its source hashes in load_page; count what they covered.
        H = [decode.load(os.path.join(RAW, f)) for f in files]
        byc = {}
        for r in rows:
            byc.setdefault(r['chunk'], []).append(r)
        UN, LN, SN = namecheck.lists(pid, files, byc)
        LNd = [t + '\x00' + n for t, n, c in LN if namecheck.nz(n) != namecheck.nz(c)]
        assert len(LNd) == len(LN), ('layer name rule', key)
        nb = lambda lab: sum(len(h['hb'][lab].split(',')) for h in H if h['hb'][lab])
        assert sum(h['hn'][1] for h in H) == len(rows), ('source hash row count', key)
        return dict(rows=len(rows), row_blocks=nb('r'), units=len(unitcheck.units(files)), unit_blocks=nb('q'),
                    unit_names=len(UN), layer_names=len(LNd), sections=len(SN), fixed=0)
    R = json.load(open(os.path.join(RAW, 'rowcheck.json')))[pid]
    assert len(rows) == R['n'] and strcheck.blocks([rowcheck.key(r) for r in rows]) == R['rb'].split(','), ('row hash check', key)
    U = json.load(open(os.path.join(RAW, 'unitcheck.json')))[pid]
    uk = unitcheck.units(files)
    assert len(uk) == U['n'] and strcheck.blocks(uk) == U['qb'].split(','), ('unit hash check', key)
    N = json.load(open(os.path.join(RAW, 'namecheck.json')))[pid]
    byc = {}
    for r in rows:
        byc.setdefault(r['chunk'], []).append(r)
    UN, LN, SN = namecheck.lists(pid, files, byc)
    LNd = [t + '\x00' + n for t, n, c in LN if namecheck.nz(n) != namecheck.nz(c)]
    assert len(LNd) == len(LN), ('layer name rule', key)
    for lab, L, n, b in [('unit names', UN, N['un'], N['ub']), ('layer names', LNd, N['ln'], N['lb']), ('section paths', SN, N['sn'], N['sb'])]:
        assert len(L) == n and strcheck.blocks(L) == b.split(','), ('name hash check', lab, key)
    return dict(rows=len(rows), row_blocks=len(R['rb'].split(',')), units=len(uk), unit_blocks=len(U['qb'].split(',')),
                unit_names=len(UN), layer_names=len(LNd), sections=len(SN),
                fixed=sum(1 for (fp, kind, idx) in FIXES if fp == pid))


def main():
    stats = {}
    excluded_lines = []
    all_rows = {}
    for key, pid, pname, files, r1 in PAGES:
        rows = load_page(key, pid, files, r1)
        ver = verify(key, pid, files, rows)
        ids = [r['text_id'] for r in rows]
        assert len(rows) == INDEPENDENT_TEXT_COUNT[pid], (key, len(rows))
        assert len(set(ids)) == len(ids), key
        all_rows[key] = rows
        vis = [r for r in rows if r['reason'] == 'visible']
        exc = [r for r in rows if r['reason'] != 'visible']
        with open(os.path.join(OUT, 'corpus-visible-%s.tsv' % key), 'w', encoding='utf-8', newline='\n') as fh:
            fh.write('\t'.join(COLS) + '\n')
            for r in vis:
                fh.write(tsv_row(key, pname, r, False) + '\n')
        for r in exc:
            excluded_lines.append(tsv_row(key, pname, r, True))
        stats[key] = dict(rows=len(rows), visible=len(vis), verify=ver,
                          unresolved=sum(1 for r in vis if r['flag'] == 'unresolved'),
                          reasons=collections.Counter(r['reason'] for r in exc),
                          detail=collections.Counter((r['reason'], r['flag']) for r in exc))
    with open(os.path.join(OUT, 'excluded.tsv'), 'w', encoding='utf-8', newline='\n') as fh:
        fh.write('\t'.join(COLS + ['reason']) + '\n')
        for ln in excluded_lines:
            fh.write(ln + '\n')
    json.dump({'escapes': ESC_COUNTS}, open(os.path.join(HERE, 'escape_counts.json'), 'w'), indent=1)
    write_counts(stats, all_rows)


def write_counts(stats, all_rows):
    L = []
    A = L.append
    A('# HLR corpus re-cut: counts')
    A('')
    A('2026-10-18. Lane A, Gate 1 call 8. Source: Figma file `LYyYXPDUHVoAABh865EvMI` (read-only walk through the Figma connector). Provenance: observed.')
    A('')
    A('Pages walked in full: Email (0:1), Organic Social (2:32177), Paid Social (2:35858), Website (2:182972). Pages not walked, %s: %s. See "Left out" at the end. `corpus-visible-other.tsv` was not written, because a header-only file would read as "no visible copy".' % (
        RULING, ', '.join('%s (%s)' % (nm, pid) for nm, pid, chn, n in NOT_WALKED)))
    A('')
    A('Completeness check: an independent count of every TEXT node on each walked page (`findAllWithCriteria`) equals the rows walked, and every text id appears once.')
    A('')
    A('| Channel | Page | TEXT nodes on page (independent count) | Rows walked | Unique text ids |')
    A('|---|---|---|---|---|')
    for key, pid, pname, files, r1 in PAGES:
        A('| %s | %s (%s) | %d | %d | %d |' % (key, pname, pid, INDEPENDENT_TEXT_COUNT[pid], stats[key]['rows'], len(set(r['text_id'] for r in all_rows[key]))))
    A('')
    A('Verification against the file: after the walk, read-only calls computed FNV-1a hashes inside the file over blocks of 20 records, for every row (text id, reason, font, x, y, w, h, characters), for every unit (id, kind, nesting, frame size, section path, text count) and for every name the TSVs carry (unit names, layer names that differ from their text, section paths). The files match every block on Email, Organic Social and Paid Social. Strings that lost invisible characters in copying (line separators U+2028, no-break spaces, word joiners, zero-width joiners and spaces) were re-read with those characters escaped, checked by hash one by one, and are corrected here (method.md, section 5e). Website was read with both safeguards from the start (method.md, section 5f): every string came back escaped to printable ASCII, and every chunk carried the same hashes, computed in the file by the walk itself over the original strings; each chunk was checked as soon as it was stored, and every block matches. Website hashes are per chunk, so a unit split across two chunks is hashed in both; the unit count below counts it once.')
    A('')
    A('| Channel | Rows hashed (blocks) | Units hashed (blocks) | Unit names / differing layer names / section paths hashed | Strings re-read and corrected | Mismatches |')
    A('|---|---|---|---|---|---|')
    for key, pid, pname, files, r1 in PAGES:
        v = stats[key]['verify']
        A('| %s | %d (%d) | %d (%d) | %d / %d / %d | %d | 0 |' % (key, v['rows'], v['row_blocks'], v['units'], v['unit_blocks'], v['unit_names'], v['layer_names'], v['sections'], v['fixed']))
    A('')
    A('## 1. Units walked, per page')
    A('')
    A('A unit is what the walk treated as one deliverable. Frame: a frame, group, component, component set or instance that is a direct child of the page or of a section (sections recursed). Board: a frame that holds two or more deliverable-sized frames laid side by side or stacked; its deliverable children are walked as frames (counted as nested) and the board itself is walked only for text that sits directly on it. Loose text: a text node that is a direct child of the page or a section. Top-level means a direct child of the page or of a first-level section; nested means inside a second-level section or inside a board.')
    A('')
    A('| Channel | Frames top-level | Frames nested | Frames total | Boards (top-level / nested) | Loose text nodes | Units with at least one text node | Units total |')
    A('|---|---|---|---|---|---|---|---|')
    cen = {}
    for key, pid, pname, files, r1 in PAGES:
        c, secs, k1 = census(key)
        cen[key] = (c, secs, k1)
        t = collections.Counter()
        for s in secs:
            for k in ('u0', 'u1', 'b0', 'b1', 'l0', 'l1', 'wt', 'tx'):
                t[k] += s[k]
        A('| %s | %d | %d | %d | %d (%d / %d) | %d | %d | %d |' % (key, t['u0'], t['u1'], t['u0'] + t['u1'], t['b0'] + t['b1'], t['b0'], t['b1'], t['l0'] + t['l1'], t['wt'], c['h'][1]))
    A('')
    A('## 2. Text nodes, per page: visible and excluded by reason')
    A('')
    A('Visible counts include text flagged `unresolved` (counted visible, see method.md). Zero opacity includes text whose fills and strokes are all invisible (flag `no_visible_paint`). Off frame includes text clipped away by a clipping frame or mask (flag `clipped_or_masked`).')
    A('')
    A('| Channel | Text nodes | Visible | of which unresolved | Hidden | Zero opacity (of which no visible paint) | Empty | Off frame (of which clipped or masked) | Buried (by image / by solid) |')
    A('|---|---|---|---|---|---|---|---|---|')
    for key, pid, pname, files, r1 in PAGES:
        s = stats[key]; d = s['detail']; rz = s['reasons']
        A('| %s | %d | %d | %d | %d | %d (%d) | %d | %d (%d) | %d (%d / %d) |' % (
            key, s['rows'], s['visible'], s['unresolved'], rz['hidden'], rz['zero_opacity'], d[('zero_opacity', 'no_visible_paint')],
            rz['empty'], rz['off_frame'], d[('off_frame', 'clipped_or_masked')], rz['buried'], d[('buried', 'cover=image')], d[('buried', 'cover=solid')]))
    A('')
    A('## 3. Per first-level section')
    A('')
    for key, pid, pname, files, r1 in PAGES:
        c, secs, k1 = cen[key]
        rows = all_rows[key]
        agg = collections.OrderedDict()
        for s in secs:
            tp = top(s['path'])
            a = agg.setdefault(tp, collections.Counter())
            for k in ('u0', 'u1', 'b0', 'b1', 'l0', 'l1', 'tx'):
                a[k] += s[k]
        rs = collections.defaultdict(collections.Counter)
        for r in rows:
            rs[top(r['section_path'])][r['reason']] += 1
        A('### %s' % key)
        A('')
        A('| Section | Frames top-level | Frames nested | Boards | Loose text | Text nodes | Visible | Hidden | Zero opacity | Empty | Off frame | Buried |')
        A('|---|---|---|---|---|---|---|---|---|---|---|---|')
        for tp, a in agg.items():
            q = rs[tp]
            A('| %s | %d | %d | %d | %d | %d | %d | %d | %d | %d | %d | %d |' % (md(tp), a['u0'], a['u1'], a['b0'] + a['b1'], a['l0'] + a['l1'], a['tx'], q['visible'], q['hidden'], q['zero_opacity'], q['empty'], q['off_frame'], q['buried']))
        A('')
    A('## 4. Frame counts against Chat 1')
    A('')
    A('Chat 1 lists: `outputs/step-1-review/figma/frames-{email,social,paid,web}.tsv` (read-only). Chat 1 listed the direct children of each first-level section (and of the page), whatever their type, and did not recurse into sub-sections or boards. Column "Direct children (re-cut census)" counts the same level in this walk: frame-like children / text children. "Frames walked" counts every frame unit this walk opened under that section, including frames inside sub-sections and boards.')
    A('')
    for key, pid, pname, files, r1 in PAGES:
        c, secs, k1 = cen[key]
        ch1, ch1t = chat1_frames(key)
        agg = collections.OrderedDict()
        for s in secs:
            a = agg.setdefault(top(s['path']), collections.Counter())
            for k in ('u0', 'u1', 'b0', 'b1', 'l0', 'l1'):
                a[k] += s[k]
        A('### %s' % key)
        A('')
        A('| Section | Chat 1 rows (by type) | Direct children (re-cut census): frame-like / text / sub-sections | Frames walked (top-level + nested) | Boards found |')
        A('|---|---|---|---|---|')
        names = [x['name'] for x in k1]
        for x in k1:
            nm = x['name']
            a = agg.get(nm, collections.Counter())
            tys = ', '.join('%s %d' % (t, n) for t, n in sorted(ch1t.get(nm, {}).items()))
            A('| %s | %d (%s) | %d / %d / %d | %d | %d |' % (md(nm), ch1.get(nm, 0), md(tys) if tys else 'none', x['frames'], x['texts'], x['subsections'], a['u0'] + a['u1'], a['b0'] + a['b1']))
        extra = [n for n in ch1 if n not in names]
        for n in extra:
            A('| %s (Chat 1 only) | %d | not a first-level section in this walk | | |' % (md(n), ch1[n]))
        A('| Total | %d | %d / %d / %d | %d | %d |' % (sum(ch1.values()), sum(x['frames'] for x in k1), sum(x['texts'] for x in k1), sum(x['subsections'] for x in k1),
                                                     sum(a['u0'] + a['u1'] for a in agg.values()), sum(a['b0'] + a['b1'] for a in agg.values())))
        A('')
    # brief claims
    c, secs, k1 = cen['social']
    so = [s for s in secs if s['path'].startswith('sept-october 2026 / ')]
    subs = [s for s in so if s['d'] == 2]
    A('Checks against the figures in the lane brief:')
    A('')
    A('- Organic Social, "sept-october 2026": %d dated sub-sections; frames walked inside them: %d (%d frames directly in the sub-sections, %d frames inside %d boards within them), plus %d loose text nodes in the sub-sections. The brief cites 111 frames in 16 sub-sections, which equals the %d frames plus %d boards that sit directly in the sub-sections; this walk opens those boards and walks their %d frames.' % (
        len(subs), sum(s['u1'] for s in so), sum(s['u1'] for s in subs), sum(s['u1'] for s in so if s['d'] > 2), sum(s['b1'] for s in subs), sum(s['l1'] for s in subs),
        sum(s['u1'] for s in subs), sum(s['b1'] for s in subs), sum(s['u1'] for s in so if s['d'] > 2)))
    c, secs, k1 = cen['paid']
    boards_top = [s for s in secs if s['d'] == 2 and '[board]' in s['path']]
    boards_nest = [s for s in secs if s['d'] > 2 and '[board]' in s['path']]
    subsec = [s for s in secs if s['d'] == 2 and '[board]' not in s['path']]
    A('- Paid Social: %d first-level boards plus %d boards nested inside them (%d boards in all); %d frames walked inside boards; %d frames in %d nested sections (%s). The brief cites 486 frames in 13 boards and 38 in nested sections. The nested-section figure matches. The board figure differs because this walk\'s board rule (method.md, section 2) found %d boards and opened their nested boards as well.' % (
        len(boards_top), len(boards_nest), len(boards_top) + len(boards_nest), sum(s['u1'] for s in boards_top + boards_nest), sum(s['u1'] for s in subsec), len(subsec),
        ', '.join(md(s['path'].split(' / ', 1)[1]) for s in subsec), len(boards_top) + len(boards_nest)))
    A('')
    A('## 5. Twenty most repeated visible lines, per channel')
    A('')
    A('Exact characters (case, spacing and line breaks as in the file; newlines shown as \\n, and Figma soft line breaks, the line separator U+2028, shown as \\u2028)."Text nodes" counts visible text nodes carrying exactly that string; "Frames" counts distinct units (frames, boards, or loose text) carrying it. Dashes and all other punctuation inside the lines are the client\'s own characters, kept verbatim. Trailing spaces are kept in the TSVs but do not show in this table.')
    A('')
    for key, pid, pname, files, r1 in PAGES:
        vis = [r for r in all_rows[key] if r['reason'] == 'visible']
        cnt = collections.Counter(r['characters'] for r in vis)
        fr = collections.defaultdict(set)
        first = {}
        for i, r in enumerate(vis):
            fr[r['characters']].add(r['frame_id'])
            first.setdefault(r['characters'], i)
        topn = sorted(cnt.items(), key=lambda kv: (-kv[1], first[kv[0]]))[:20]
        A('### %s (%d visible text nodes, %d distinct strings)' % (key, len(vis), len(cnt)))
        A('')
        A('| # | Line | Text nodes | Frames |')
        A('|---|---|---|---|')
        for i, (s, n) in enumerate(topn, 1):
            A('| %d | %s | %d | %d |' % (i, md(s), n, len(fr[s])))
        A('')
    A('## 6. Left out')
    A('')
    A('Not walked, %s. Text node counts are from the read-only page census earlier in this lane.' % RULING)
    A('')
    A('| Page | Id | Channel | Text nodes on page |')
    A('|---|---|---|---|')
    for nm, pid, chn, n in NOT_WALKED:
        A('| %s | %s | %s | %d |' % (nm, pid, chn, n))
    A('')
    open(os.path.join(OUT, 'counts.md'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')


if __name__ == '__main__':
    main()
