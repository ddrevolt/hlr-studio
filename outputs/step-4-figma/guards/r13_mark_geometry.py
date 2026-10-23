#!/usr/bin/env python3
"""REVIEW.md guard R13 (one geometry kept as several marks), Chat 5, 2026-10-23.

Hashes the path data of every SVG under a marks folder and lists the files that
share one geometry. A group of more than one file is one mark with several
colourways: the library keeps one component for it, fill bound to a variable
(Gate 3 call 8 a). Exit 0 always; the report is the result.
Usage: python3 r13_mark_geometry.py "HLR Logo & Marks" [--json]
"""
import hashlib, json, os, re, sys

def geometry(path):
    s = open(path, encoding="utf-8", errors="replace").read()
    vb = re.search(r'viewBox="([^"]+)"', s)
    ds = re.findall(r'\sd="([^"]+)"', s) + re.findall(r'\spoints="([^"]+)"', s)
    norm = "|".join(re.sub(r"\s+", " ", d.strip()) for d in ds)
    return (vb.group(1) if vb else ""), len(ds), hashlib.sha256(norm.encode()).hexdigest()[:16]

def main(root, as_json):
    groups = {}
    for dp, _, fs in os.walk(root):
        for f in sorted(fs):
            if f.lower().endswith(".svg"):
                p = os.path.join(dp, f)
                vb, n, h = geometry(p)
                if n == 0:
                    continue
                groups.setdefault(h, {"viewBox": vb, "paths": n, "files": []})["files"].append(os.path.relpath(p, root))
    shared = {h: g for h, g in groups.items() if len(g["files"]) > 1}
    if as_json:
        print(json.dumps({"geometries": len(groups), "shared": shared}, indent=1))
    else:
        print(f"{len(groups)} distinct geometries; {len(shared)} shared by more than one file")
        for h, g in shared.items():
            print(f"- {h} viewBox {g['viewBox']}, {g['paths']} paths: " + "; ".join(g["files"]))

if __name__ == "__main__":
    main(sys.argv[1], "--json" in sys.argv)
