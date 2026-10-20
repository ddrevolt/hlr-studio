# Compares FNV-1a block hashes of transcribed names (unit names, differing layer names, section paths) with the file's.
import sys, os, json, re
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import decode, strcheck
RAW = os.path.join(HERE, '..', '_raw')
JSWS = re.compile('[\t\n\v\f\r    -     　﻿]+')
def nz(s): return JSWS.sub(' ', s).strip(' ')
def lists(pid, files, rows_by_chunk):
    UN, LN, SI = [], [], {}
    for f in files:
        d = decode.load(os.path.join(RAW, f))
        secs = {int(s.split('|', 2)[0]): s.split('|', 2)[2] for s in d['s']}
        for urec in d['u']:
            uid, w, h, si, k, nest, mode, nr, name = urec.split('|', 8)
            if int(nr) == 0: continue
            si = int(si)
            if si in SI: assert SI[si] == secs[si], ('section index not global', f, si)
            SI[si] = secs[si]
            if k != 'l':
                e = uid + '\x00' + name
                if not UN or UN[-1] != e: UN.append(e)
        for r in rows_by_chunk[f]:
            if r['layer_name'] is not None: LN.append((r['text_id'], r['layer_name'], r['characters']))
    SN = sorted(SI.values(), key=lambda s: s.encode('utf-16-be'))
    return UN, LN, SN
if __name__ == '__main__':
    import build
    exp = json.load(open(os.path.join(RAW, 'namecheck.json')))
    for key, pid, pname, files, r1 in build.PAGES:
        rows = build.load_page(key, pid, files, r1)
        byc = {}
        for r in rows: byc.setdefault(r['chunk'], []).append(r)
        UN, LN, SN = lists(pid, files, byc)
        LNd = [t + '\x00' + n for t, n, c in LN if nz(n) != nz(c)]
        e = exp[pid]
        for lab, L, n, b in [('units', UN, e['un'], e['ub']), ('layers', LNd, e['ln'], e['lb']), ('sections', SN, e['sn'], e['sb'])]:
            got = strcheck.blocks(L); want = b.split(',')
            bad = [i for i, (a, c) in enumerate(zip(got, want)) if a != c]
            print(key, lab, 'n', len(L), n, 'blocks', len(got), len(want), 'bad', bad)
        print(key, 'layer names carried', len(LN), 'of which differ after collapse', len(LNd))
