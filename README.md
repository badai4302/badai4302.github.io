# Course Site

A plain HTML/CSS/JavaScript website for hosting and organizing course
materials across 7 courses, deployable for free on GitHub Pages.

No build step, no framework, no server — every page is a static HTML file
that works by itself in a browser or once pushed to GitHub Pages.

## What's included

- `index.html` — your profile/about page
- `courses/index.html` — a filterable list of all 7 courses
- `courses/course-1-physics/` — a **fully built example course** demonstrating
  every feature: unit navigation, collapsible sections, an in-page filter, an
  embedded self-check quiz, an interactive projectile-motion simulator, and
  downloadable files
- `courses/course-2/` through `courses/course-7/` — starter templates for
  your other six courses (same pattern, placeholder content)
- `search.html` — search across every course's units, quizzes, and files
- `assets/css/style.css` — one shared stylesheet for the whole site
- `assets/js/` — small vanilla-JS modules: navigation, collapsible sections,
  the quiz widget, search/filter, and the projectile simulator
- `scripts/build_search_index.py` — regenerates `assets/data/search-index.json`
  after you add or edit content (Python 3, no extra packages needed)

See **DEPLOY.md** for how to put this on GitHub Pages, and
**CONTENT-GUIDE.md** for how to fill in your real course content.

## Preview it locally before deploying

Because the pages use `fetch()` for search, opening `index.html` directly
with `file://` will work for most things but the search page needs a local
server. From the project folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/` in your browser.

## Feature checklist (what you asked for → where it lives)

- **Clickable navigation between units/weeks** → the sidebar in every course
  page (`.unit-nav`), built from plain anchor links to each unit's `id`
- **Expandable/collapsible sections** → each unit is a native HTML
  `<details>/<summary>` element (works even with JavaScript disabled);
  `assets/js/collapsible.js` adds "Expand all / Collapse all" buttons
- **Search or filter across materials** → `search.html` searches everything
  site-wide; each course page also has its own in-page filter box
- **Embedded quizzes with instant feedback** → `assets/js/quiz.js`, driven by
  a plain JSON array per quiz, no backend or gradebook involved
- **Interactive diagrams/simulations** → `assets/js/projectile-sim.js`, a
  canvas-based projectile motion visualizer with adjustable velocity, angle,
  and gravity
- **Downloadable files** → plain links to PDFs/slides in each course's
  `files/` folder
