#!/bin/sh
# The guards' own tests (Chat 6, 2026-10-23, REVIEW.md R20): run whenever a guard changes, and at each close that
# touches tokens, exemplars, the strictness map, the slot map or a gate. Usage: sh run_all.sh <brand home> <scratch dir>.
# Exit 0 when every guard still fails on its fixtures and passes on the pack.
HB="$1"; OUT="$2"; G="$(cd "$(dirname "$0")/.." && pwd)"; rc=0
mkdir -p "$OUT/hsc" "$OUT/bem"
python3 -I "$G/closed_gate_scan.py" --test || rc=1
python3 -I "$G/closed_gate_scan.py" "$HB" | head -1 || rc=1
python3 -I "$G/closed_gate_scan.py" "$HB" > /dev/null || rc=1
node "$G/tests/closed_gate_parity.js" "$HB" || rc=1
python3 -I "$G/host_shape_check.py" "$HB/brand-pack" || rc=1
python3 -I "$G/tests/host_shape_mutations.py" "$HB/brand-pack" "$G/host_shape_check.py" "$OUT/hsc" > "$OUT/hsc.txt" || { rc=1; grep MISS "$OUT/hsc.txt"; }
echo "host_shape_mutations: $(grep -c '^ok' "$OUT/hsc.txt") ok, $(grep -c '^MISS' "$OUT/hsc.txt") missed"
python3 -I "$G/tests/board_expect_mutations.py" "$HB" "$G/board_expect.py" "$OUT/bem" > "$OUT/bem.txt" || { rc=1; grep MISS "$OUT/bem.txt"; }
echo "board_expect_mutations: $(grep -c ' -> ' "$OUT/bem.txt") cases, $(grep -c '^MISS' "$OUT/bem.txt") missed"
[ $rc -eq 0 ] && echo "guard tests: PASS" || echo "guard tests: FAIL"
exit $rc
