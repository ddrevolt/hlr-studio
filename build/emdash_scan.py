#!/usr/bin/env python3
"""Em dash scan over our own text in the HLR brand home (REVIEW.md section 2, house rule R7).

Usage: python3 emdash_scan.py <brand home>. Exit 1 when the character appears in a file we wrote.
Excluded, because they hold verbatim client text or engine code: the corpora, the site pulls, the pattern
inventories, review-workbook and explainer app sources, bundles, images and the product database's verbatim
Shopify titles (checked by key, not skipped). Verbatim client text keeps its punctuation.
"""
import os, sys, json

EM = chr(0x2014)
SKIP_DIRS = {
    ".git", ".claude", "node_modules", "_setup", "_archive", "HLR Content", "HLR Logo & Marks", "High Light Rituals Fonts",
    "outputs/step-2-pack/corpus", "outputs/step-1-review/site", "outputs/step-1-review/figma",
    "outputs/step-1-review/patterns", "outputs/step-1-review/pattern-inventories", "outputs/review/app",
    "outputs/review/assets", "outputs/explainer", "outputs/concepts", "build/log",
}
TEXT_EXT = {".md", ".json", ".yaml", ".yml", ".txt", ".csv", ".tsv", ".css", ".js", ".py", ".html", ".sh"}


def main(hb):
    hits = []
    for root, dirs, files in os.walk(hb):
        rel = os.path.relpath(root, hb)
        rel = "" if rel == "." else rel
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS and os.path.join(rel, d) not in SKIP_DIRS]
        for f in files:
            if os.path.splitext(f)[1] not in TEXT_EXT:
                continue
            p = os.path.join(root, f)
            try:
                text = open(p, encoding="utf-8").read()
            except (UnicodeDecodeError, OSError):
                continue
            if EM not in text:
                continue
            if p.endswith("brand-pack/products.json"):
                # verbatim Shopify titles may keep the character; everything else in the file may not
                d = json.load(open(p, encoding="utf-8"))
                s = json.dumps(d, ensure_ascii=False)
                for key in ("shopify_title", "title_verbatim"):
                    s = s.replace(key, "")
                import re
                s2 = re.sub(r'"(shopify_title|title_verbatim)": "[^"]*"', "", json.dumps(d, ensure_ascii=False))
                if EM not in s2:
                    continue
            for i, line in enumerate(text.splitlines(), 1):
                if EM in line:
                    hits.append(f"{os.path.relpath(p, hb)}:{i}")
    base_p = os.path.join(hb, "build", "emdash_baseline.txt")
    base = set()
    if os.path.exists(base_p):
        base = {l.strip() for l in open(base_p, encoding="utf-8") if l.strip() and not l.startswith("#")}
    new = [h for h in hits if h not in base]
    known = [h for h in hits if h in base]
    print(f"em dash scan: {len(new)} new line(s), {len(known)} known (build/emdash_baseline.txt, to clear)")
    for h in new[:200]:
        print("  NEW " + h)
    return 1 if new else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "."))
