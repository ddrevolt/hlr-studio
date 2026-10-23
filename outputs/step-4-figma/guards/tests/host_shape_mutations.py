# Mutation tests for host_shape_check.py (written by the Foundations review round 2 as hsc_mutations.py, F2-07; kept
# here by Chat 6, 2026-10-23, as the cases that must fail, REVIEW.md R20). Each case copies the pack's two inputs,
# applies one mutation and runs the guard. Usage: python3 host_shape_mutations.py <brand-pack> <guard> <scratch dir>.
# Every line must start with ok; a MISS is a guard that passes a defect it was built for.
import json, os, re, shutil, subprocess, sys
pack, guard, out = sys.argv[1], sys.argv[2], sys.argv[3]
ml0 = open(pack + '/module-library.json', encoding='utf-8').read()
sm0 = open(pack + '/slotmap.yaml', encoding='utf-8').read()
m15 = json.loads(ml0)['MOD_SHAPE']['M15']
def shape(key, new):
    d = json.loads(ml0); d['MOD_SHAPE'][key] = new; return json.dumps(d, ensure_ascii=False, indent=1), sm0
def slot(old, new):
    assert sm0.count(old) == 1, old
    return ml0, sm0.replace(old, new)
cases = {
 'm0 unchanged pack (control)': (ml0, sm0, 0),
 'm1 M15 shape as round 3 left it (full display name, E07.name named)': shape('M15', m15.split('the short form')[0] + 'the product name from products.json (E07.name, set in caps by the style) and a caps link (E02.label, 12 characters at most).') + (1,),
 'm2 M11 shape without its 16': shape('M11', json.loads(ml0)['MOD_SHAPE']['M11'].replace('16 characters at most', 'short')) + (1,),
 'm3 M15 shape names E07.name with the full-name rule and the words "short form" negated': shape('M15', m15.split('the short form')[0] + 'the full product name (E07.name, never a short form; set in caps by the style) and a caps link (E02.label, 12 characters at most).') + (1,),
 'm4 M15 shape gives the full-name rule without writing the slot id': shape('M15', m15.split('the short form')[0] + 'the product display name from products.json as written, set in caps by the style, and a caps link (E02.label, 12 characters at most).') + (1,),
 'm5 slot map E02.label budget 12 -> 10, M15 shape still says 12': slot('max_chars: 12, budget_from: "M06"', 'max_chars: 10, budget_from: "M06"') + (1,),
 'm6 slot map E07.name note back to the full display name': slot('note: "a short form: the stone,', 'note: "the full display name: the stone,') + (1,),
 'm7 slot map M12.cta 16 -> 14, M12 shape still says 16': (ml0, re.sub(r'(id: M12\.cta, [^}]*max_chars: )16', r'\g<1>14', sm0), 1),
 'm8 E07 own shape back to the full display name': shape('E07', 'label: one accent word (a month, a stone); name: the product display name from products.json, as written (the style sets caps).') + (1,),
}
res = []
for name, (ml, sm, want_fail) in cases.items():
    d = os.path.join(out, re.sub(r'\W+', '_', name.split(' ')[0]))
    shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
    open(d + '/module-library.json', 'w', encoding='utf-8').write(ml); open(d + '/slotmap.yaml', 'w', encoding='utf-8').write(sm)
    p = subprocess.run([sys.executable, '-I', guard, d], capture_output=True, text=True)
    got = 'FAIL' if p.returncode else 'PASS'
    ok = (p.returncode != 0) == bool(want_fail)
    res.append('%-4s guard %s (exit %d), should %s: %s | %s' % ('ok' if ok else 'MISS', got, p.returncode, 'FAIL' if want_fail else 'PASS', name, ' '.join(p.stdout.split())[:200]))
print('\n'.join(res))
sys.exit(1 if any(r.startswith('MISS') for r in res) else 0)
