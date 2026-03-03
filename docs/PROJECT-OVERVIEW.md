# Project Overview — Tampa Bay Soft Wash Academy

This doc exists so a new developer/agent can understand the entire project quickly.

## Repos
- **Site/app:** `tbsoftwash-course-site` (Next.js app)
- **Course content:** `tbsoftwash-course` (markdown, SOPs, printables, illustrations)

## High-level goal
Render operator training as a modern, app-like manual:
- fast navigation
- searchable lessons
- progress tracking
- embedded references (SOPs/printables) inline
- figures and photos embedded inline

## Content philosophy
- Operator-focused
- Public-safe (no dangerous exact recipe ratios)
- Truth/proof-first: Proof Pack + chain of custody
- Reduce overcomplexity; teach decision logic

## Key UX primitives
- `FIGURE:` → diagram style A/B/C SVG
- `PHOTO:` → owned course photos
- Inline `.md` references → dropdown viewer + Download

## Deployment
Vercel. Avoid submodules. Use subtree vendoring.
