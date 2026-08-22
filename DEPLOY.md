# Deploying to GitHub Pages

You said you've already created a GitHub account, so this picks up from
there. Two ways to get the code into a repo — pick whichever feels easier —
then the Pages setup is the same either way.

## 1. Get the code into a GitHub repository

### Option A — using the GitHub website (no command line)

1. Go to github.com, sign in, and click **New repository**.
2. Name it something like `course-site` (or `<your-username>.github.io` if
   you want it at the root of your GitHub Pages domain — see the note
   below). Leave it **Public**. Don't add a README/gitignore/license (you
   already have files to upload).
3. Click **Create repository**.
4. On the next page, click **uploading an existing file**.
5. Drag the whole unzipped `course-site` folder's *contents* (not the folder
   itself) into the upload area — or drag the folder in, GitHub will keep
   the structure.
6. Scroll down and click **Commit changes**.

### Option B — using git on your own machine

```bash
cd course-site
git init
git add .
git commit -m "Initial course site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

(Replace `<your-username>` and `<repo-name>` with your actual GitHub
username and the repository name you created.)

## 2. Turn on GitHub Pages

1. In your repository on GitHub, go to **Settings → Pages** (left sidebar,
   under "Code and automation").
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Under **Branch**, choose `main` and folder `/ (root)`, then **Save**.
4. Wait a minute or two, then refresh the page — GitHub will show you the
   live URL, something like:

   ```
   https://<your-username>.github.io/<repo-name>/
   ```

That's it — the site is live. Every time you push new commits (or upload
new files through the website), GitHub Pages rebuilds automatically within
a minute or so.

## About the repo name and URL

- If your repo is named anything other than `<your-username>.github.io`,
  your site lives at `https://<your-username>.github.io/<repo-name>/` —
  note the extra `/<repo-name>/` in the path. All the links in this project
  use **relative paths** (like `../assets/css/style.css`), so this works
  correctly either way — you don't need to change anything.
- If you'd rather have the site at the shorter
  `https://<your-username>.github.io/` (no repo name in the path), name the
  repository exactly `<your-username>.github.io`.

## Updating the site later

- **Via the website:** open the file you want to change on GitHub, click
  the pencil (edit) icon, make your change, and commit. Or use **Add
  file → Upload files** to add new PDFs/units.
- **Via git:** edit files locally, then

  ```bash
  git add .
  git commit -m "Update unit 3 materials"
  git push
  ```

Either way, if you added or renamed units/quizzes/files, re-run
`python3 scripts/build_search_index.py` locally first and commit the
updated `assets/data/search-index.json`, so search stays accurate.

## Custom domain (optional)

If you own a domain and want it to point at the site instead of the
`github.io` address, GitHub's own guide covers it end to end:
https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
