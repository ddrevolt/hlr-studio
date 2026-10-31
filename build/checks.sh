#!/bin/sh
# HLR Studio checks. Usage: sh build/checks.sh [scratch dir]. Run from the brand home root (the repo root).
# Runs what the runner and GitHub can reach without the Mac: the guard suite, the pack mutation tests, every
# engine test in the newest hlr-studio-engine bundle, and the em dash scan over our own text. The census and the
# overlap scans live in claude-cowork/_tools on the Mac (they name other brands) and are not run here: a release
# still needs them, run by Eddie, and the run log says so.
set -u
HB="$(cd "$(dirname "$0")/.." && pwd)"; OUT="${1:-/tmp/hlr-checks}"; rc=0
mkdir -p "$OUT"; ENG="$OUT/engine"
BUNDLE=$(ls "$HB"/outputs/step-3-bundle/hlr-studio-engine-*.plugin | sort -V | tail -1)
echo "engine bundle: $BUNDLE"
rm -rf "$ENG" && mkdir -p "$ENG" && unzip -q "$BUNDLE" -d "$ENG" || { echo "unzip failed"; exit 1; }

echo "--- guard suite"
sh "$HB/outputs/step-4-figma/guards/tests/run_all.sh" "$HB" "$OUT/gt" || rc=1

echo "--- pack mutation tests"
python3 -I "$HB/outputs/step-2-pack/guards/mutation_tests.py" "$HB" "$ENG" > "$OUT/mut.log" 2>&1 || { rc=1; tail -20 "$OUT/mut.log"; }; tail -1 "$OUT/mut.log"

echo "--- engine tests"
n=0; fail=0
for t in $(find "$ENG" -path '*/tests/test_*' \( -name '*.js' -o -name '*.py' \) | sort); do
  n=$((n+1))
  case "$t" in
    *.js) node "$t" >"$OUT/t.log" 2>&1 || { fail=$((fail+1)); echo "FAIL $t"; tail -5 "$OUT/t.log"; } ;;
    *.py) python3 -I "$t" >"$OUT/t.log" 2>&1 || { fail=$((fail+1)); echo "FAIL $t"; tail -5 "$OUT/t.log"; } ;;
  esac
done
echo "engine tests: $n files, $fail failed"; [ "$fail" -eq 0 ] || rc=1

echo "--- em dash scan (our own text; verbatim client corpora excluded)"
python3 -I "$HB/build/emdash_scan.py" "$HB" || rc=1

[ $rc -eq 0 ] && echo "checks: PASS" || echo "checks: FAIL"
exit $rc
