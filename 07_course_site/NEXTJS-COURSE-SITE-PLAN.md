# Next.js Course Site Plan (tbsoftwash-course → web)

## Goal
Publish the operator course as a browsable Next.js site where:
- each lesson markdown file becomes a page
- navigation is generated from content metadata (no hand-edited nav drift)
- we can add gating later (email capture / paid access) without changing the content source

## Source of truth
- Content repo: `tbsoftwash-course/`
- Lesson pages: `tbsoftwash-course/03_curriculum/module-*/lesson-*.md`
- Printables: `tbsoftwash-course/03_curriculum/printables/`
- SOP library: `tbsoftwash-course/04_sops/`

## Delivery lanes
- Operator lane (default)
- Homeowner-safe lane (public pages where appropriate)

## Target URL structure (proposed)
- `/course` → course home / overview
- `/course/springboard` → track overview
- `/course/springboard/week-1-gutters/lesson-01` …
- `/course/module/1/getting-started/lesson-01` …
- `/sops/...` (optional public/private)
- `/printables/operator-checklist-pack-v1` (download page + DOCX/PDF)

## Content metadata (frontmatter)
To make pages auto-navigable, each lesson should include YAML frontmatter:

```yaml
---
title: "Roof Soft Wash: Workflow + QA"
description: "How to run the job stripe-free, protect landscaping, and deliver proof."
track: "core" # core|springboard
module: 3
lesson: 2
slug: "roof-workflow-and-qa"
audience: ["operator"] # operator|homeowner
estimated_minutes: 20
prereqs: ["module-2/lesson-01"]
---
```

## Tech stack (recommended)
- Next.js 14+ (App Router)
- MDX (or Markdown + remark/rehype) for rendering
- Contentlayer OR a lightweight custom loader that reads from `tbsoftwash-course/` on build
- TailwindCSS for styling

## Build stages (Brian requested: do 1 then 2 then 3)

### Stage 1 — Information architecture + content contracts (YOU ARE HERE)
- Lock URL patterns
- Define required frontmatter fields + defaults
- Define “end-of-lesson block” standard
- Decide public vs private sections

### Stage 2 — Content normalization
- Add frontmatter to existing lessons
- Standardize headings and end-of-lesson blocks
- Ensure all internal links work in web context (relative link strategy)

### Stage 3 — Next.js implementation
- Create Next.js app (separate repo or sibling folder)
- Implement lesson routing + generated nav
- Add search (optional) + sitemap
- Add printable download pages

## Decision needed
Where should the Next.js app live?
- Option A (recommended): `/home/kingb/.openclaw/workspace/tbsoftwash-course-site/` (separate)
- Option B: inside existing `tbsoftwash-site/` (currently Astro; would be a larger migration)
