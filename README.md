# Tampa Bay Soft Wash Academy (Course Site)

This repo is the **Next.js “Academy” web app** that renders the Tampa Bay Soft Wash operator course content as a modern, app-like training portal.

- **Live domain (production):** `academy.tbsoftwash.com`
- **Repo (site/app):** `tbsoftwash-course-site`
- **Content repo (source of truth):** `tbsoftwash-course`
- **Important:** The course content is vendored into this repo via **git subtree** (NOT a submodule).

---

## 0) What this is (and what it isn’t)

### This is
- A **dark-first**, glassy, professional training portal for exterior-cleaning operators.
- A static-friendly Next.js app that loads markdown lessons and provides “reader UX” features.

### This is not
- Not WordPress.
- Not MDX. (We intentionally keep markdown → HTML via `remark`.)
- Not an authenticated SaaS (yet). Progress is currently localStorage-based.

---

## 1) Branching / deploy reality

We maintain two lanes:
- **`master`** = production lane (what Vercel usually deploys)
- **`dev`** = active build lane (new work lands here first)

If you see the live site showing an older version, it’s usually because Vercel is deploying `master` while recent changes are on `dev`.

---

## 2) Content dependency strategy (git subtree)

Vercel does not reliably fetch private submodules. We vendor the course repo into this app:

- Vendored path: `tbsoftwash-course-site/tbsoftwash-course/`
- Source repo remote: `course` → `https://github.com/BrianV1981/tbsoftwash-course.git`

### Updating the vendored course content
From this repo root:

```bash
git remote -v
# confirm you have a "course" remote

git subtree pull --prefix tbsoftwash-course course master --squash -m "Sync vendored tbsoftwash-course"
```

Notes:
- The subtree commit recorded in this repo must match the last subtree “squash” base.
- If a subtree pull says it’s already up-to-date, the upstream commit may not have been included in a subtree-squash base yet.

---

## 3) Key UX features (what the app provides)

### Course reader UX
- `/course` = accordion “reader” with inline previews
- In-lesson “sticky header” and Prev/Next navigation

### Search
- Sidebar search filters lessons by title/slug

### Progress tracking (no auth)
LocalStorage keys:
- `tbsa.completedLessons.v1`
- `tbsa.lastLesson.v1`
- `tbsa.activityDays.v1`

Refresh event:
- `tbsa:progress`

### Settings
- Theme: Light / Dark / System (next-themes)
- Diagram style: A/B/C (per-browser)
- Reader preview mode: preview/full
- Theme preset skins (Default / Midnight / Mac Light)

### Inline reference viewers
We intentionally avoid sending users to raw file pages.

- **Inline MD viewer**: any internal `*.md` reference becomes a dropdown viewer with a Download button.
- **Figures**: `FIGURE: <baseName>` renders an SVG from the illustrations pipeline.
- **Photos**: `PHOTO: <file.jpg> | optional caption` renders an owned photo from the course repo.

---

## 4) Content callouts (authoring conventions)

### A) Figures
In lesson markdown:

```md
FIGURE: mock-fig-103-psi-vs-gpm
```

Site renders via:
- `GET /api/figure?name=<base>&style=<A-clean|B-dark-glassy|C-hybrid>`
- Looks up: `tbsoftwash-course/08_illustrations/src/<base>_<style>.svg`

### B) Photo inserts (no-faces policy)
In lesson markdown:

```md
PHOTO: roof_tile_after_clean.jpg | Roof “after” standard (tile)
```

Site renders via:
- `GET /api/photo?name=<file>`
- Looks up: `tbsoftwash-course/08_illustrations/photos/<file>`

### C) Inline markdown reference viewer
In lesson markdown, any internal `*.md` reference such as:

```md
Proof Pack SOP: `04_sops/proof-pack/proof-pack-sop-v1.md`
```

…is rendered inline (dropdown viewer + Download).

API:
- `GET /api/md?path=<relpath>`
- `GET /api/md?path=<relpath>&download=1`

Allowlist lives in: `src/app/api/md/route.ts`

---

## 5) Local development

From repo root:

```bash
npm install
npm run dev
```

Build check (required before shipping to prod):

```bash
npm run build
```

---

## 6) Deployment (Vercel)

This is designed to deploy on Vercel with no special build steps.

Important environment behavior:
- Course loader resolves paths using `process.env.VERCEL_PROJECT_DIR || process.cwd()` so it works locally and on Vercel.

---

## 7) Theming

We use `next-themes`:
- Default theme: **dark**
- Light/Dark/System toggle

We also support “preset skins” stored in:
- `tbsa.themePreset.v1`

The preset is applied via `data-preset` on `<html>` in `ThemePresetHydrator`.

---

## 8) Troubleshooting

### A) Vercel deploy shows old UI
- Confirm what branch Vercel is building (Production branch)
- Recent changes may be on `dev`

### B) MD viewers show raw file names
- Ensure the link/path matches the allowlist in `/api/md`

### C) Diagram style doesn’t appear to change
- Diagram style only affects pages with a `FIGURE:`.
- Use `/course/figures/psi-vs-gpm` to test switching.

### D) “Missing figure”
- Ensure the SVG exists in `tbsoftwash-course/08_illustrations/src/` with suffix `_<style>.svg`.

---

## 9) Safety + publishing policy

- **No public recipe-level chemical ratios** in public lessons.
- Use decision logic, safety, ranges, and process.
- Recipe-level details belong behind a disclaimer wall / gated area if ever added.

---

## 10) Repo map (high signal)

App code:
- `src/app/course/**` routes
- `src/lib/course.ts` markdown loader
- `src/lib/progress.ts` progress tracking
- `src/app/api/*` content APIs (`md`, `figure`, `photo`, previews)

Vendored course content:
- `tbsoftwash-course/03_curriculum/**`
- `tbsoftwash-course/04_sops/**`
- `tbsoftwash-course/08_illustrations/**`

---

## Maintainer notes for the next AI agent

1) **Do not convert to MDX** unless there’s a clear payoff. Current pipeline is stable.
2) **Avoid submodules** (Vercel pain). Keep subtree vendoring.
3) Always run `npm run build` before pushing anything intended for production.
4) Keep operator content public-safe (no reckless chemical recipes).
5) Photo policy: **no faces** unless explicitly approved.
