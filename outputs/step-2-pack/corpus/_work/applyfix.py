# Loads the ASCII-escaped exact strings fetched for entries that failed the hash check, verifies each against the file's per-string hash.
import sys, os, json, re, glob
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import strcheck
RAW = os.path.join(HERE, '..', '_raw')
def unesc(s):
    t = re.sub(r'\\u([0-9a-f]{4})', lambda m: chr(int(m.group(1), 16)), s)
    return t.encode('utf-16-le', 'surrogatepass').decode('utf-16-le')
def per_hashes():
    P = json.load(open(os.path.join(RAW, 'strcheck_per.json')))
    H = {}
    for pid, d in P.items():
        for kind in ('t', 'r'):
            for ent in d[kind]:
                k, hs = ent.split(':', 1); k = int(k)
                for j, h in enumerate(hs.split(',')):
                    H[(pid, kind, k * 20 + j)] = h
    return H
def load_fixes(check=True):
    H = per_hashes(); F = {}; bad = []
    for fn in sorted(glob.glob(os.path.join(RAW, 'fix_*.json'))):
        d = json.load(open(fn)); pid = d['page']
        for ent in d['s']:
            key, val = ent.split('|', 1); kind = key[0]; idx = int(key[1:]); s = unesc(val)
            h = strcheck.b36(strcheck.fnv(0x811c9dc5, s))
            if check and H.get((pid, kind, idx)) != h:
                bad.append((os.path.basename(fn), key))
            F[(pid, kind, idx)] = s
    return F, bad
if __name__ == '__main__':
    F, bad = load_fixes()
    need = json.load(open(os.path.join(RAW, 'strcheck_bad.json')))
    want = set()
    for pid, L in need['tables'].items():
        for i in L: want.add((pid, 't', i))
    for i in need['v12rows']: want.add(('0:1', 'r', i))
    print('fixes', len(F), 'hash failures', bad, 'still missing', len(want - set(F)))
