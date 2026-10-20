# Compares FNV-1a block hashes (20 strings per block, UTF-16 code units) of the transcribed string tables with the file's.
import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import decode
RAW = os.path.join(HERE, '..', '_raw')
def b36(n):
    a = '0123456789abcdefghijklmnopqrstuvwxyz'; s = ''
    while True:
        s = a[n % 36] + s; n //= 36
        if n == 0: return s
def fnv(h, s):
    b = s.encode('utf-16-le')
    for i in range(0, len(b), 2):
        h ^= b[i] | (b[i + 1] << 8); h = (h * 16777619) & 0xffffffff
    h ^= 0; h = (h * 16777619) & 0xffffffff
    return h
def blocks(L, B=20):
    out = []
    for i in range(0, len(L), B):
        h = 0x811c9dc5
        for s in L[i:i + B]: h = fnv(h, s)
        out.append(b36(h))
    return out
def tables():
    T = {}
    for pid, r1 in [('0:1', 'email_R1.json'), ('2:32177', 'social_R1.json'), ('2:35858', 'paid_R1.json')]:
        T[pid] = decode.load_strings(RAW, pid) + json.load(open(os.path.join(RAW, r1)))['t']
    return T
if __name__ == '__main__':
    exp = json.load(open(os.path.join(RAW, 'strcheck.json')))
    T = tables()
    for pid, t in T.items():
        got = blocks(t); want = exp[pid]['tb'].split(',')
        bad = [i for i, (a, b) in enumerate(zip(got, want)) if a != b]
        print(pid, 'strings', len(t), exp[pid]['n'], 'blocks', len(got), len(want), 'bad blocks', bad)
    rows = []
    for f in ['email_01.json', 'email_02.json']:
        d, rr = decode.decode(os.path.join(RAW, f), None); rows += rr
    got = blocks([r['characters'] for r in rows]); want = exp['0:1']['rb'].split(',')
    print('email v1/v2 rows', len(rows), 'bad row blocks', [i for i, (a, b) in enumerate(zip(got, want)) if a != b])
