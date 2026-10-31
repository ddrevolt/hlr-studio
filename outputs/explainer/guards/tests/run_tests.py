#!/usr/bin/env python3
"""Must-fail cases for guards/explainer_drift.py. Each case mutates a scratch copy of the
content or the data and asserts that the guard fails; the clean copy must pass.

Usage: python3 guards/tests/run_tests.py [--home <brand home>] [--engine <engine folder>]
Prints one line per case and exits non-zero if any case behaves wrongly."""
import argparse, copy, json, os, subprocess, sys, tempfile

here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(os.path.dirname(here))
guard = os.path.join(root, "guards", "explainer_drift.py")
ap = argparse.ArgumentParser()
ap.add_argument("--home", default=os.path.normpath(os.path.join(root, "..", "..")))
ap.add_argument("--engine", default=None)
a = ap.parse_args()

content = json.load(open(os.path.join(root, "content.json"), encoding="utf-8"))
data = json.load(open(os.path.join(root, "explainer-data.json"), encoding="utf-8"))
verdicts_path = os.path.join(root, "examples-verified.json")


def run(c, d, extra=()):
    with tempfile.TemporaryDirectory() as t:
        cp, dp = os.path.join(t, "content.json"), os.path.join(t, "data.json")
        json.dump(c, open(cp, "w", encoding="utf-8"), ensure_ascii=False)
        json.dump(d, open(dp, "w", encoding="utf-8"), ensure_ascii=False)
        cmd = [sys.executable, guard, "--home", a.home, "--content", cp, "--data", dp, "--verdicts", verdicts_path, *extra]
        if a.engine:
            cmd += ["--engine", a.engine]
        r = subprocess.run(cmd, capture_output=True, text=True)
        return r.returncode, r.stdout


def first_fact(c):
    for st in c["stages"]:
        f = (st.get("predict") or {}).get("fact")
        if f and not f["source"].startswith(("engine:", "http")):
            return f
    raise SystemExit("no fact to mutate")


cases = []


def case(name, mutate, extra=()):
    c, d = copy.deepcopy(content), copy.deepcopy(data)
    mutate(c, d)
    cases.append((name, c, d, extra))


EM = chr(0x2014)
case("a quote changed by one word", lambda c, d: first_fact(c).update(quote=first_fact(c)["quote"].replace("empty", "full", 1)))
case("a source file that does not exist", lambda c, d: first_fact(c).update(source="brand-pack/no-such-file.md"))
case("a stale stamp", lambda c, d: d["stamp"]["sources"].update({next(iter(d["stamp"]["sources"])): "0" * 64}))
case("an em dash in our prose", lambda c, d: c["meta"].update(lede=c["meta"]["lede"] + " " + EM + " and more"))
case("a price in our prose", lambda c, d: c["stages"][0].update(human="Priced at $48 for the demo."))
case("a karat in our prose", lambda c, d: c["stages"][0].update(human="Set in 14k gold."))
case("a fact from _setup/", lambda c, d: c["stages"][0]["predict"].update(fact={"source": "_setup/brand-forge-playbook.md", "quote": "One engine, many packs."}))
case("a stage reading an unknown card", lambda c, d: c["stages"][1]["reads"].append("no-such-card"))
case("a scenario answer outside its options", lambda c, d: c["scenarios"][0]["answer"].append("tokens") if "tokens" not in c["scenarios"][0]["options"] else c["scenarios"][0]["answer"].append("figma"))
case("a value path that does not resolve", lambda c, d: c["values"].update(products="products.nothing_here"))
case("a placeholder with no value", lambda c, d: c["meta"].update(lede=c["meta"]["lede"] + " {nonexistent_value}"))
case("an external source with no checked date", lambda c, d: c["compare"]["cd_facts"][0].pop("checked"))
case("a File map role with no card", lambda c, d: [x.update(roles=[]) for x in c["cards"] if x["id"] == "voice"])
case("a census term in the content", lambda c, d: c["meta"].update(lede=c["meta"]["lede"] + " Zzqbrandtest"), extra=("--extra-term", "Zzqbrandtest"))

bad = 0
code, out = run(content, data)
ok = code == 0
print(("ok   " if ok else "FAIL ") + "the clean copy passes" + ("" if ok else "\n" + out))
bad += 0 if ok else 1
for name, c, d, extra in cases:
    code, out = run(c, d, extra)
    ok = code != 0
    print(("ok   " if ok else "FAIL ") + "must fail: " + name)
    bad += 0 if ok else 1
print(f"{len(cases) + 1 - bad} passed, {bad} failed")
sys.exit(1 if bad else 0)
