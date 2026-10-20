# Compares FNV-1a block hashes of every decoded row (id, reason code, font key, coordinates, characters) with the file's.
import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import decode, strcheck
RAW = os.path.join(HERE, '..', '_raw')
INV = {v: k for k, v in decode.RS.items()}
def key(r):
    rf = INV[(r['reason'], r['flag'])]
    fk = r['font_family'] + '|' + r['font_style'] + '|' + (r['font_size'] if r['font_size'] != '' else '*')
    return r['text_id'] + '\x00' + rf + '\x00' + fk + '\x00' + ','.join(str(v) for v in (r['x'], r['y'], r['w'], r['h'])) + '\x00' + r['characters']
if __name__ == '__main__':
    import build
    exp = json.load(open(os.path.join(RAW, 'rowcheck.json')))
    for k, pid, pname, files, r1 in build.PAGES:
        rows = build.load_page(k, pid, files, r1)
        got = strcheck.blocks([key(r) for r in rows]); want = exp[pid]['rb'].split(',')
        bad = [i for i, (a, b) in enumerate(zip(got, want)) if a != b]
        print(k, 'rows', len(rows), exp[pid]['n'], 'blocks', len(got), len(want), 'bad', bad)
