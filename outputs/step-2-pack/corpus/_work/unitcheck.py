# Compares FNV-1a block hashes of every unit record (id, kind, nesting, size, section path, text count) with the file's.
import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import strcheck, decode
RAW = os.path.join(HERE, '..', '_raw')
def units(files):
    Q = []
    for f in files:
        d = decode.load(os.path.join(RAW, f))
        secs = {int(s.split('|', 2)[0]): s.split('|', 2)[2] for s in d['s']}
        for urec in d['u']:
            uid, w, h, si, k, nest, mode, nr, name = urec.split('|', 8)
            if int(nr) == 0: continue
            q = [uid, k + nest, w + ',' + h, secs[int(si)], int(nr)]
            if Q and Q[-1][:4] == q[:4]: Q[-1][4] += q[4]
            else: Q.append(q)
    return ['\x00'.join(str(v) for v in q) for q in Q]
if __name__ == '__main__':
    import build
    exp = json.load(open(os.path.join(RAW, 'unitcheck.json')))
    for key, pid, pname, files, r1 in build.PAGES:
        L = units(files)
        got = strcheck.blocks(L); want = exp[pid]['qb'].split(',')
        bad = [i for i, (a, b) in enumerate(zip(got, want)) if a != b]
        print(key, 'units', len(L), exp[pid]['n'], 'blocks', len(got), len(want), 'bad', bad)
