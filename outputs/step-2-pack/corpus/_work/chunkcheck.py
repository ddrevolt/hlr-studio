# Checks a v6 chunk (Website) against the hashes it carries, which the read-only walk computed in the file over the
# original strings (method.md, 5e record formats; 5f). Run after writing each chunk to _raw, before reading the next.
import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import decode, strcheck, rowcheck, unitcheck, namecheck
RAW = os.path.join(HERE, '..', '_raw')


def raw_ascii(fn):
    # The stored chunk must be printable ASCII with no backslash: nothing was escaped by JSON or changed in copying.
    b = open(os.path.join(RAW, fn), 'rb').read()
    return all(32 <= c <= 126 or c == 10 for c in b) and b'\\' not in b


def table(pid, r1):
    t = decode.load_strings(RAW, pid)
    if r1 and os.path.exists(os.path.join(RAW, r1)):
        t = t + decode.load(os.path.join(RAW, r1))['t']
    return t


def check(fn, r1=None):
    p = os.path.join(RAW, fn); d = decode.load(p); hb, hn = d['hb'], d['hn']; bad = []; rows = None
    if not raw_ascii(fn):
        bad.append('not printable ASCII')

    def cmp(lab, i, L):
        if len(L) != hn[i] or ','.join(strcheck.blocks(L)) != hb[lab]:
            bad.append(lab)
    if d['kind'] == 'S':
        cmp('t', 0, d['t'])
    elif d['kind'] == 'C':
        cmp('s', 0, d['s']); cmp('k1', 1, d['k1'])
    else:
        cmp('t', 0, d['t'])
        _, rows = decode.decode(p, table(d['h'][0], r1))
        cmp('r', 1, [rowcheck.key(r) for r in rows])
        cmp('q', 2, unitcheck.units([fn]))
        UN, LN, SN = namecheck.lists(d['h'][0], [fn], {fn: rows})
        cmp('u', 3, UN); cmp('l', 4, [t + '\x00' + n for t, n, c in LN]); cmp('s', 5, SN)
    return d, rows, bad


if __name__ == '__main__':
    r1 = None
    for fn in sys.argv[1:]:
        if fn.startswith('--r1='):
            r1 = fn[5:]; continue
        d, rows, bad = check(fn, r1)
        print(fn, d['kind'], 'h', d['h'], 'hn', d['hn'], 'rows', None if rows is None else len(rows), 'MISMATCH ' + ','.join(bad) if bad else 'all hashes match')
