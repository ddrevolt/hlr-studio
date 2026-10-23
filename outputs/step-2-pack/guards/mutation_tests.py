# Mutation tests for preflight.md's R14 guard, tag scan and pointer check (lane E's round 3, 2026-10-23).
# Usage: python3 mutation_tests.py "$HB" "$ENG". Reads the three guards from preflight.md section 6, runs each on
# the pack as it is (must pass) and on mutated copies (each must fail with its own line). Writes nothing in $HB.
import os, re, shutil, subprocess, sys, tempfile
HB, ENG = sys.argv[1], sys.argv[2]
pf = open(os.path.join(HB, "outputs", "step-2-pack", "preflight.md"), encoding="utf-8").read().split("## 6. Commands", 1)[1].split("\n## 7.", 1)[0]
bodies = re.findall(r"<<'EOF'\n(.*?)\nEOF", pf, re.S)
tmp = tempfile.mkdtemp(prefix="hlr-mut-")
G = {}
for key, first in (("r14", "# R14 guard"), ("tags", "# Tag scan"), ("pointer", "# Pointer check")):
    b = [x for x in bodies if x.startswith(first)]
    if len(b) != 1: sys.exit(f"mutation_tests: preflight.md section 6 holds {len(b)} blocks starting {first!r}; nothing was tested")
    G[key] = os.path.join(tmp, key + ".py"); open(G[key], "w", encoding="utf-8").write(b[0] + "\n")
NEED = ["brand-pack", "DECISIONS.md", "PROGRESSION.md", "_setup/next-chat-prompts.md", "outputs/step-1-review/brand-review-v2.md", "outputs/step-2-pack/token-proposal.md"]
def copy():
    d = tempfile.mkdtemp(prefix="hb-", dir=tmp)
    for n in NEED:
        s = os.path.join(HB, n)
        if not os.path.exists(s): continue
        os.makedirs(os.path.dirname(os.path.join(d, n)), exist_ok=True)
        (shutil.copytree if os.path.isdir(s) else shutil.copy)(s, os.path.join(d, n))
    return d
def run(g, hb):
    r = subprocess.run(["python3", G[g], hb] + ([ENG] if g == "r14" else []), capture_output=True, text=True)
    return r.returncode, [l for l in (r.stdout + r.stderr).splitlines() if l.startswith("FAIL")]
def edit(path, fn):
    def f(hb):
        p = os.path.join(hb, path); t = open(p, encoding="utf-8").read(); u = fn(t)
        if u == t: raise SystemExit(f"mutation_tests: a mutation found no anchor in {path}; update the case")
        open(p, "w", encoding="utf-8").write(u)
    return f
BC, FY, TM, DEC = "brand-pack/brand-context.md", "brand-pack/figma.yaml", "brand-pack/token-model.md", "DECISIONS.md"
def owner(new):  # the first gap row owned by Eddie, given another owner
    return edit(BC, lambda t: re.sub(r"^(\| `[a-z_]+` \| role \| [^|]* \| )Eddie( \|)", lambda m: m.group(1) + new + m.group(2), t, count=1, flags=re.M))
BOARDS = re.compile(r"^(\s*)boards:\s*\{(.*)\}(.*)$", re.M)
def block(built_all):
    def fn(t):
        m = BOARDS.search(t); pairs = re.findall(r"(\"?[A-Za-z][A-Za-z -]*?\"?)\s*:\s*(\"[0-9]+:[0-9]+\")", m.group(2))
        if built_all: lines = [m.group(1) + "boards:   # built 2026-10-23"] + [m.group(1) + "  " + k + ": " + v for k, v in pairs]
        else: lines = [m.group(1) + "boards:"] + [m.group(1) + "  " + k + ": " + v + ("   # built 2026-10-23" if i < len(pairs) - 1 else "") for i, (k, v) in enumerate(pairs)]  # the last board, unbuilt
        return t[:m.start()] + "\n".join(lines) + t[m.end():]
    return fn
TAG = re.compile(r"\[documented, DECISIONS (\d{4}-\d{2}-\d{2}), lane C call (\d+) a\]")
cases = [
    ("r14", "a gap row owned by \"Eddie or HLR\"", owner("Eddie or HLR")),
    ("r14", "a gap row owned by \"Eddie (later)\"", owner("Eddie (later)")),
    ("r14", "a gap row owned by \"lane I\"", owner("lane I")),
    ("r14", "a gap row owned by \"to be assigned\"", owner("to be assigned")),
    ("r14", "a token-model register owner \"HLRx\"", edit(TM, lambda t: re.sub(r"\| HLR \|", "| HLRx |", t, count=1))),
    ("r14", "the boards line without its built note", edit(FY, lambda t: re.sub(r"(boards:.*?#.*?)built \d{4}-\d{2}-\d{2}", r"\1", t, count=1))),
    ("r14", "boards in block layout, one board not built", edit(FY, block(False))),
    ("tags", "an untagged opening paragraph", edit(BC, lambda t: t.replace("\n", "\n\nThis file is the brand's working summary.\n", 1))),
    ("tags", "an untagged line ending in a colon", edit(BC, lambda t: re.sub(r"^(## [^\n]+\n)", r"\1\nEvery rule below applies to every channel:\n", t, count=1, flags=re.M))),
    ("pointer", "a tag citing a date DECISIONS lacks", edit(BC, lambda t: TAG.sub(lambda m: "[documented, DECISIONS 2026-10-19, lane C call " + m.group(2) + " a]", t, count=1))),
    ("pointer", "a tag citing a call no ruling names", edit(BC, lambda t: TAG.sub(lambda m: "[documented, DECISIONS " + m.group(1) + ", lane C call 99 a]", t, count=1))),
    ("pointer", "a tag citing a lane line by its words", edit(BC, lambda t: TAG.sub("[documented, DECISIONS 2026-10-18, the ledger seed line]", t, count=1))),
    ("pointer", "a date whose section holds only a lane default", lambda hb: (edit(DEC, lambda t: re.sub(r"^(## \d{4}-\d{2}-\d{2}\n)", "## 2031-01-01\n\n- Lane C's default until Eddie rules: X. Reason: lane C. Replaced: nothing.\n\n\\1", t, count=1, flags=re.M))(hb), edit(BC, lambda t: TAG.sub("[documented, DECISIONS 2031-01-01]", t, count=1))(hb))),
    ("pointer", "a ratification note naming a call the ruling lacks", edit("brand-pack/tokens.json", lambda t: re.sub(r"by Eddie, Gate 2 package call \d+\)", "by Eddie, Gate 2 package call 99)", t, count=1))),
]
bad = 0
for g in ("r14", "tags", "pointer"):
    rc, fl = run(g, HB)
    print(("PASS " if rc == 0 else "FAIL ") + f"{g} on the pack as it is" + ("" if rc == 0 else ": " + "; ".join(fl[:3])))
    bad += rc != 0
for g, name, fn in cases:
    hb = copy(); fn(hb); rc, fl = run(g, hb)
    print(("PASS " if rc else "FAIL ") + f"{g} catches {name}" + (": " + fl[0][5:120] if fl else ""))
    bad += rc == 0
shutil.rmtree(tmp, ignore_errors=True)
print(f"mutation tests: {len(cases)} mutants, {bad} failure(s)"); sys.exit(1 if bad else 0)
