"""The in-repo instructions (backlog claude-md): CLAUDE.md and crew/README.md stay under 100 lines, carry no
em dash, name no path that does not exist, and name no brand but HLR's own files. Run: python3 -m unittest discover -s crew/tests"""
import os
import re
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EM = chr(0x2014)
FILES = ("CLAUDE.md", "crew/README.md")
RUNTIME = ("crew/runs/",)  # created when the crew runs


def read(p):
    with open(os.path.join(ROOT, p), encoding="utf-8") as fh:
        return fh.read()


class RecordTests(unittest.TestCase):
    def test_length_and_punctuation(self):
        for f in FILES:
            t = read(f)
            self.assertLess(len(t.splitlines()), 100, f)
            self.assertNotIn(EM, t, f)

    def test_every_named_path_resolves(self):
        for f in FILES:
            for p in re.findall(r"`([^`\s]+)`", read(f)):
                if "/" not in p or any(c in p for c in "<>*{}$=") or p.startswith(("--", "http", "/")) or p.startswith(RUNTIME):
                    continue
                cand = [p]
                if f.startswith("crew/"):
                    cand.append(os.path.join("crew", p))
                self.assertTrue(any(os.path.exists(os.path.join(ROOT, c)) for c in cand), "%s names %s" % (f, p))
        for p in ("brand-pack", "crew", "build", "outputs", "_archive"):
            self.assertTrue(os.path.isdir(os.path.join(ROOT, p)), p)

    def test_bare_file_names_in_claude_md_exist_in_the_pack(self):
        t = read("CLAUDE.md")
        sect = t[t.index("- `brand-pack/`"):t.index("- `PROGRESSION.md`")]
        for name in re.findall(r"`([a-z0-9_-]+\.(?:md|json|yaml))`", sect):
            self.assertTrue(os.path.exists(os.path.join(ROOT, "brand-pack", name)), name)


if __name__ == "__main__":
    unittest.main()
