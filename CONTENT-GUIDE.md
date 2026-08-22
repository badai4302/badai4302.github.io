# Content Guide — how to fill in your real courses

Everything on this site is plain HTML, so "editing content" mostly means
editing text inside tags with any text editor (VS Code, Notepad, GitHub's
built-in web editor — whatever you like). No compiling, no build step.
This guide walks through each piece using `courses/course-1-physics/index.html`
as the reference example — keep it open side-by-side while you edit the
other six.

## 1. Set up your profile page

Open `index.html` and replace the bracketed placeholders:
`[Your Name]`, the bio paragraphs, `you@example.com`, and the contact list.
If you have a headshot, drop it in `assets/img/` (create the folder if it
doesn't exist) and replace the `profile-photo` div's placeholder text with:

```html
<img src="assets/img/your-photo.jpg" alt="Your Name">
```

## 2. Rename a course

Each course lives in its own folder under `courses/`. To turn `course-2`
into your real second course:

1. Rename the folder (e.g., `course-2` → `algebra-1`) — or leave the folder
   name as-is and just change the visible title; either works, but keep the
   folder name simple (lowercase, hyphens, no spaces) since it becomes part
   of the URL.
2. Open that course's `index.html` and replace:
   - The `<title>` tag
   - The `<h1>` and the `<p class="lede">` description
   - Each unit's `<summary>` text and `<span class="unit-meta">` (e.g. "Week 3")
   - The sidebar `<nav class="unit-nav">` links to match your unit titles
3. Update `courses/index.html` and `index.html` (the homepage) to point the
   course card's `href` at the renamed folder, and update its title/description.
4. If you renamed the folder, update the `<a href="courses/course-2/index.html">`
   links wherever they appear.

## 3. Add a unit (a section students can expand/collapse)

Copy this block, paste it before the closing `<p class="no-results" ...>` in
a course page, and edit it:

```html
<details class="unit" id="unit-3" data-title="Unit 3 Title Here" data-tags="keyword1 keyword2">
  <summary>
    Unit 3 — Your Unit Title
    <span class="unit-meta">Week 5</span>
  </summary>
  <div class="unit-body">
    <p>Your unit content — as much text, images, or links as you want.</p>
  </div>
</details>
```

Then add a matching link in the `<nav class="unit-nav">` sidebar at the top
of the same page:

```html
<li><a href="#unit-3">Unit 3 — Your Unit Title</a></li>
```

Notes:
- `id="unit-3"` must be unique on the page and must match the sidebar
  link's `href="#unit-3"`.
- `data-title` and `data-tags` power the in-page filter box and site search
  — keep them accurate.

## 4. Add a quiz (instant self-check feedback, no gradebook)

Paste this anywhere inside a unit's `<div class="unit-body">`:

```html
<div class="quiz" data-quiz='[
  {
    "question": "Your question text?",
    "choices": ["Choice A", "Choice B", "Choice C", "Choice D"],
    "correctIndex": 1,
    "explanation": "Why that answer is correct — shown after the student answers."
  },
  {
    "question": "A second question?",
    "choices": ["Choice A", "Choice B"],
    "correctIndex": 0,
    "explanation": "Explanation for this one."
  }
]'></div>
```

- `correctIndex` is zero-based (0 = first choice, 1 = second, etc.)
- Add as many question objects as you want inside the array
- Every course page that has a quiz must load `assets/js/quiz.js` before
  `</body>` (the templates already do this)
- This is entirely client-side and resets on page reload — there's no
  gradebook connection and no data is sent anywhere, exactly as requested

## 5. Add downloadable files (PDFs, slides)

1. Put the file in that course's `files/` folder (e.g.
   `courses/course-2/files/unit1-slides.pdf`).
2. Link it from the unit:

```html
<ul class="file-list">
  <li><a href="files/unit1-slides.pdf"><span class="file-icon">📄</span> Unit 1 Slides (PDF)</a></li>
</ul>
```

Works for slides, worksheets, datasets — any file type. The 📄 emoji is
just a visual icon; swap it for 🖥️ (slides) or 📊 (data) if you like.

## 6. Add an interactive simulation

The projectile motion simulator (`assets/js/projectile-sim.js`) is built to
be reusable — you can embed a second one anywhere (e.g., a "Moon gravity"
demo) just by copying the `<div class="sim-wrap" data-projectile-sim>` block
from Unit 3 of the Physics example into another unit.

For a **different** physics concept (pendulum, circuits, wave interference,
etc.), you'll need a new small JS file. The general pattern used here is:

1. A `<canvas>` element for drawing
2. Sliders/inputs (`<input type="range">`, `<select>`) for the variables
   students can adjust
3. A JS function that redraws the canvas whenever an input changes, using
   `requestAnimationFrame` for animation
4. A readout showing key computed values (range, height, time, etc.)

`assets/js/projectile-sim.js` is heavily commented and is the best starting
point to copy and adapt — even if you're not deeply familiar with
JavaScript, an AI assistant (like this one) can adapt it for a new physics
concept quickly if you describe what the simulation should show.

## 7. Rebuild search after content changes

Whenever you add/rename units, quizzes, or files, run this locally and
commit the result:

```bash
python3 scripts/build_search_index.py
```

This rewrites `assets/data/search-index.json`, which powers `search.html`.
