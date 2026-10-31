#!/usr/bin/env python3
"""email_screens: a Playwright screenshot per twin and width, and the proportion check.
Usage: python3 crew/producers/email_screens.py [--twins outputs/step-8-email/twins] [--assembled file.html ...]
Writes M##-600.png and M##-1200.png beside each twin and proportions.json. Proportion check: the 600
render is the 1200 render scaled by one half, so each module's height at 600 must be half its height at
1200 (within 3 percent), and M03's image well must keep 622:812. The check against the Figma master's
own height needs a Figma read, which this script never makes: Eddie's chat does it (report.md)."""
import argparse
import glob
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--twins", default=os.path.join(ROOT, "outputs", "step-8-email", "twins"))
    ap.add_argument("--assembled", nargs="*", default=[])
    a = ap.parse_args()
    from playwright.sync_api import sync_playwright
    result, bad = {}, []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for path in sorted(glob.glob(os.path.join(a.twins, "M*-*.html"))) + a.assembled:
            base = os.path.splitext(path)[0]
            tail = base.rsplit("-", 1)[-1]
            if tail.isdigit():
                width = int(tail)
            else:  # an assembled file: the width of its first table
                import re
                width = int(re.search(r'<table[^>]*\swidth="(\d+)"', open(path, encoding="utf-8").read()).group(1))
            page = browser.new_page(viewport={"width": width, "height": 800})
            page.goto("file://" + os.path.abspath(path))
            page.screenshot(path=base + ".png", full_page=True)
            h = page.evaluate("Math.ceil(document.body.getBoundingClientRect().height)")
            sw = page.evaluate("document.documentElement.scrollWidth")
            result[os.path.basename(path)] = {"width": width, "height": h, "scrollWidth": sw}
            if sw > width:
                bad.append("%s overflows: scrollWidth %d > %d" % (os.path.basename(path), sw, width))
            page.close()
        browser.close()
    mods = sorted({k.split("-")[0] for k in result if k.startswith("M") and k[1:3].isdigit()})
    for m in mods:
        h6, h12 = result[m + "-600.html"]["height"], result[m + "-1200.html"]["height"]
        if abs(h12 / 2.0 - h6) > 0.03 * h12 / 2.0 + 2:
            bad.append("%s height at 600 is %d, half of 1200 is %.0f" % (m, h6, h12 / 2.0))
    with open(os.path.join(a.twins, "proportions.json"), "w", encoding="utf-8") as fh:
        json.dump(result, fh, indent=1)
        fh.write("\n")
    print("%d screenshots; %d problems" % (len(result), len(bad)))
    for b in bad:
        print("  " + b)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
