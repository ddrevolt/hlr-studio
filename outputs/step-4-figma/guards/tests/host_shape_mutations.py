# Mutation tests for host_shape_check.py (written by the Foundations review round 2 as hsc_mutations.py, F2-07; kept
# here by Chat 6, 2026-10-23, as the cases that must fail, REVIEW.md R20; round 3's near variants added, F3-06; E09's
# merge-token rule and the ruled-note check added after the batch 2 review round 1, BR1-08). Each
# case copies the pack's two inputs, applies one mutation and runs the guard. A case passes only on the guard's own
# verdict (F3-07): a must-fail case needs exit 1, a first line FAIL and a failure line naming what was mutated; the
# control needs exit 0 and PASS. A guard that crashes prints neither, so it misses.
# Usage: python3 host_shape_mutations.py <brand-pack> <guard> <scratch dir>. Every line must start with ok.
import json, os, re, shutil, subprocess, sys
pack, guard, out = sys.argv[1], sys.argv[2], sys.argv[3]
ml0 = open(pack + '/module-library.json', encoding='utf-8').read()
sm0 = open(pack + '/slotmap.yaml', encoding='utf-8').read()
m15 = json.loads(ml0)['MOD_SHAPE']['M15']
def shape(key, new):
    d = json.loads(ml0); d['MOD_SHAPE'][key] = new; return json.dumps(d, ensure_ascii=False, indent=1), sm0
def edit(key, old, new):
    s = json.loads(ml0)['MOD_SHAPE'][key]; assert s.count(old) == 1, (key, old); return shape(key, s.replace(old, new))
def slot(old, new):
    assert sm0.count(old) == 1, old
    return ml0, sm0.replace(old, new)
cases = {  # name: (module library, slot map, must fail, a phrase the guard's failure line must carry)
 'm0 unchanged pack (control)': (ml0, sm0, 0, 'PASS'),
 'm1 M15 shape as round 3 left it (full display name, E07.name named)': shape('M15', m15.split('the short form')[0] + 'the product name from products.json (E07.name, set in caps by the style) and a caps link (E02.label, 12 characters at most).') + (1, 'M15 copy shape does not carry E07.name'),
 'm2 M11 shape without its 16': shape('M11', json.loads(ml0)['MOD_SHAPE']['M11'].replace('16 characters at most', 'short')) + (1, 'M11 copy shape does not give M11.cta its budget'),
 'm3 M15 shape names E07.name with the full-name rule and the words "short form" negated': shape('M15', m15.split('the short form')[0] + 'the full product name (E07.name, never a short form; set in caps by the style) and a caps link (E02.label, 12 characters at most).') + (1, 'M15 copy shape does not carry E07.name'),
 'm4 M15 shape gives the full-name rule without writing the slot id': shape('M15', m15.split('the short form')[0] + 'the product display name from products.json as written, set in caps by the style, and a caps link (E02.label, 12 characters at most).') + (1, 'M15 copy shape does not carry E07.name'),
 'm5 slot map E02.label budget 12 -> 10, M15 shape still says 12': (ml0, re.sub(r'(id: E02\.label, [^}]*max_chars: )12', r'\g<1>10', sm0), 1, 'M15 copy shape gives E02.label 12 characters, the slot map 10'),
 'm6 slot map E07.name note back to the full display name': slot('note: "a short form: the stone,', 'note: "the full display name: the stone,') + (1, 'slot map: E07.name does not carry its rule'),
 'm7 slot map M12.cta 16 -> 14, M12 shape still says 16': (ml0, re.sub(r'(id: M12\.cta, [^}]*max_chars: )16', r'\g<1>14', sm0), 1, 'M12 copy shape'),
 'm8 E07 own shape back to the full display name': shape('E07', 'label: one accent word (a month, a stone); name: the product display name from products.json, as written (the style sets caps).') + (1, 'E07 copy shape does not carry E07.name'),
 'n1 M15 negates the short form with "rather than"': edit('M15', 'the short form of the product name (E07.name:', 'the full product name rather than the short form (E07.name:') + (1, 'M15 copy shape does not carry E07.name'),
 'n2 M15 negates the short form with "avoid"': edit('M15', 'the short form of the product name (E07.name:', 'the product name (avoid the short form) (E07.name:') + (1, 'M15 copy shape does not carry E07.name'),
 'n3 M15 writes E02.label\'s budget as "a 10-character cap" (slot map 12)': edit('M15', '(E02.label, 12 characters at most)', '(E02.label, a 10-character cap)') + (1, 'M15 copy shape gives E02.label 10 characters, the slot map 12'),
 'n4 M11 writes its CTA budget as "14 chars" (slot map 16)': edit('M11', '16 characters at most here', '14 chars at most here') + (1, 'M11 copy shape gives M11.cta 14 characters, the slot map 16'),
 'n5 M15 writes the budget before the slot id ("a caps link of 10 characters at most (E02.label)")': edit('M15', 'and a caps link (E02.label, 12 characters at most).', 'and a caps link of 10 characters at most (E02.label).') + (1, 'M15 copy shape gives E02.label 10 characters, the slot map 12'),
 'n6 M15 spells the budget "ten characters"': edit('M15', '(E02.label, 12 characters at most)', '(E02.label, ten characters at most)') + (1, 'M15 copy shape gives E02.label 10 characters, the slot map 12'),
 'm9 E06 shape types the compare-at price as a figure (BR1-08)': shape('E06', 'name: the product display name from products.json; price: only from products.json, hidden by default; struck: the compare-at price as a figure from products.json.') + (1, "E06 copy shape does not carry E09.compare_at's rule"),
 'm10 E09 own shape types its prices': shape('E09', 'price and compare_at: the figures from products.json, typed as written; offers wait for HLR (C10).') + (1, "E09 copy shape does not carry E09.price's rule"),
 'n7 M06 negates the merge token ("not a merge token")': edit('M06', 'is a merge token, never typed', 'is not a merge token but typed from products.json, never typed by hand') + (1, "M06 copy shape does not carry E09.price's rule"),
 'n8 E06 keeps the words but types the figure ("a merge token or typed")': edit('E06', 'is a merge token, never typed', 'is a merge token, never typed by default, else typed as a figure') + (1, "E06 copy shape does not carry E09.compare_at's rule"),
 'm11 slot map: a new ruled note on an element slot RULES does not hold': slot('{ id: E06.name, role: name, case: as-is, typical_chars: 16, flex_verified: ">=4x", max_chars: 64 }', '{ id: E06.name, role: name, case: as-is, typical_chars: 16, flex_verified: ">=4x", max_chars: 64, note: "from products.json only, never invented" }') + (1, 'slot map: E06.name carries a rule'),
}
res = []
for name, (ml, sm, want_fail, phrase) in cases.items():
    d = os.path.join(out, re.sub(r'\W+', '_', name.split(' ')[0]))
    shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
    open(d + '/module-library.json', 'w', encoding='utf-8').write(ml); open(d + '/slotmap.yaml', 'w', encoding='utf-8').write(sm)
    p = subprocess.run([sys.executable, '-I', guard, d], capture_output=True, text=True)
    first = (p.stdout.split('\n') or [''])[0].strip()
    if want_fail: ok = p.returncode == 1 and first == 'FAIL' and phrase in p.stdout
    else: ok = p.returncode == 0 and first == 'PASS'
    said = ' '.join(p.stdout.split())[:200] or ('no verdict; stderr: ' + ' '.join(p.stderr.split())[-160:])
    res.append('%-4s exit %d, should %s (naming "%s"): %s | %s' % ('ok' if ok else 'MISS', p.returncode, 'FAIL' if want_fail else 'PASS', phrase, name, said))
print('\n'.join(res))
sys.exit(1 if any(r.startswith('MISS') for r in res) else 0)
