#!/usr/bin/env python3
"""build_twins: write the module twins (placeholders intact) to twins/<width>/M##.html for widths 1200 and 600,
and, when Playwright is installed, a screenshot per module per width to screenshots/<width>/M##.png.
Usage: python3 crew/producers/email_html/build_twins.py [--no-shots]
Each screenshot fills the slots with their own ids ("M02.headline") so no copy is invented. Offline."""
import argparse
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import twins  # noqa: E402

WIDTHS = (1200, 600)


def sample(fragment):
    def sub(m):
        return m.group(1)
    frag = re.sub(r"<!--/?(?:opt|card)[^>]*-->", "", fragment)
    frag = re.sub(r"\{\{(href)\}\}", "#", frag)
    frag = frag.replace('href="{{cta_url}}"', 'href="#"')
    return re.sub(r"\{\{([A-Za-z0-9_.]+)\}\}", sub, frag)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-shots", action="store_true")
    a = ap.parse_args()
    made = {}
    for w in WIDTHS:
        t, *_ = twins.all_twins(w)
        os.makedirs(os.path.join(HERE, "twins", str(w)), exist_ok=True)
        for m, frag in t.items():
            with open(os.path.join(HERE, "twins", str(w), m + ".html"), "w", encoding="utf-8") as fh:
                fh.write(frag + "\n")
        made[w] = t
    print("twins: %d modules x %d widths" % (len(made[1200]), len(WIDTHS)))
    if a.no_shots:
        return
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("playwright not installed; screenshots skipped")
        return
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for w in WIDTHS:
            os.makedirs(os.path.join(HERE, "screenshots", str(w)), exist_ok=True)
            page = browser.new_page(viewport={"width": w, "height": 900})
            for m, frag in made[w].items():
                page.set_content('<html><body style="margin:0;background:#fff;">%s</body></html>' % sample(frag))
                page.locator("table[data-module]").first.screenshot(path=os.path.join(HERE, "screenshots", str(w), m + ".png"))
            page.close()
        browser.close()
    print("screenshots: written")


if __name__ == "__main__":
    main()
