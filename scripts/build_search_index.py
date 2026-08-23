#!/usr/bin/env python3
"""
Regenerate assets/data/search-index.json by scanning every course page for
searchable entries.

Run this locally after you add or edit units, quizzes, or files:

    python3 scripts/build_search_index.py

It requires no third-party packages (standard library only), and it does not
run as part of GitHub Pages deployment — the JSON file it writes is a plain
static asset that you commit like any other file.

How it finds content, per course HTML page (courses/*/index.html):
  - Each <details class="unit" data-title="..." ...> becomes one search
    entry (type: "unit"), linked to the course page + #unit-id.
  - Each <div class="quiz" ...> inside a unit becomes one search entry
    (type: "quiz"), so students can search "quiz" or a topic and land
    straight on the practice questions.
  - Each <a> inside a <ul class="file-list"> becomes one search entry
    (type: "file"), linking directly to the downloadable file.

If you restructure a page a lot, just make sure `data-title` attributes on
<details class="unit"> stay accurate — that's the main thing this script
reads for unit entries.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COURSES_DIR = ROOT / "courses"
OUTPUT = ROOT / "assets" / "data" / "search-index.json"

DETAILS_TAG_RE = re.compile(r"<details\b[^>]*class=\"unit\"[^>]*>", re.IGNORECASE)
ID_ATTR_RE = re.compile(r'\bid="([^"]+)"')
DATA_TITLE_ATTR_RE = re.compile(r'\bdata-title="([^"]*)"')
TITLE_RE = re.compile(r"<title>([^<]*)</title>", re.IGNORECASE)
QUIZ_RE = re.compile(r'<div\s+class="quiz"', re.IGNORECASE)
FILELIST_RE = re.compile(
    r'<ul class="file-list">(.*?)</ul>', re.IGNORECASE | re.DOTALL
)
FILE_LINK_RE = re.compile(
    r'<a href="([^"]+)"[^>]*>.*?</span>\s*([^<]+)</a>', re.IGNORECASE | re.DOTALL
)


def course_name(html: str, fallback: str) -> str:
    m = TITLE_RE.search(html)
    if not m:
        return fallback
    # Title looks like "Physics — Your Name" -> take the first segment.
    return m.group(1).split("—")[0].strip() or fallback


def build():
    entries = []
    if not COURSES_DIR.exists():
        print("No courses/ directory found.", file=sys.stderr)
        sys.exit(1)

    for course_dir in sorted(COURSES_DIR.iterdir()):
        page = course_dir / "index.html"
        if not page.exists():
            continue
        html = page.read_text(encoding="utf-8")
        rel_page = f"courses/{course_dir.name}/index.html"
        cname = course_name(html, course_dir.name)

        for m in DETAILS_TAG_RE.finditer(html):
            tag = m.group(0)
            id_match = ID_ATTR_RE.search(tag)
            title_match = DATA_TITLE_ATTR_RE.search(tag)
            if not id_match:
                continue
            unit_id = id_match.group(1)
            title = (title_match.group(1) if title_match else "") or unit_id
            entries.append({
                "title": title,
                "course": cname,
                "type": "unit",
                "url": f"{rel_page}#{unit_id}",
                "tags": title.lower().split(),
            })
            # Does this unit contain a quiz? (naive: look a bit past the match)
            window = html[m.end(): m.end() + 6000]
            if QUIZ_RE.search(window):
                entries.append({
                    "title": f"{title} — Self-check quiz",
                    "course": cname,
                    "type": "quiz",
                    "url": f"{rel_page}#{unit_id}",
                    "tags": ["quiz", "practice", "self-check"] + title.lower().split(),
                })

        for fl in FILELIST_RE.finditer(html):
            for link in FILE_LINK_RE.finditer(fl.group(1)):
                href, label = link.group(1), link.group(2).strip()
                if href.startswith("http"):
                    url = href
                else:
                    url = f"{course_dir.name}/{href}"
                    url = f"courses/{url}"
                entries.append({
                    "title": label,
                    "course": cname,
                    "type": "file",
                    "url": url,
                    "tags": ["download", "file", "pdf"] + label.lower().split(),
                })

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(entries, indent=2), encoding="utf-8")
    print(f"Wrote {len(entries)} entries to {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    build()
