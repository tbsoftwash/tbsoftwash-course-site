# Response to External Review (Academy) — Tampa Bay Soft Wash

Date: 2026-03-05
Author voice: **growth / operator-standard**

This document is written to respond directly to the reviewer critique and provide concrete examples so the feedback can be grounded in the actual product constraints and current build.

---

## 0) Context you didn’t have (important)

This Academy is intentionally shipping in **Phase 1** as:
- **public / free**
- **no DB / no auth** (by design, to avoid shipping friction and credential/deploy risk)
- **local-only progress** with **export/import JSON** backup
- **public-safe chemical guidance** (process + decision logic + safety) — not a public recipe vault

That’s not “fear of liability” so much as it’s **business positioning** + **publishing policy**.

The public internet is full of DIY readers and copycats. We’re building an operator standard that can be published openly without encouraging reckless mixing, while still teaching the correct workflow, safety, and risk control.

If/when “recipe-level” details are introduced, they will live behind an explicit acknowledgement wall (Recipe Vault concept) and will be written like an internal operator reference.

---

## 1) Critique: “Safety policy is a curriculum killer (recipes are the course)”

**Your claim:** Without exact ratios, the course fails.

**Our position:** Workflow + risk control is the real differentiator.

- We are *not* pretending ratios don’t matter.
- We are saying that publishing exact recipe-level mixing to the open public web is a different product lane than a public Academy.

**Why:**
- Encouraging DIY mixing at scale is not aligned with the public-facing standard.
- Many failures in the field are not because someone didn’t know “3% vs 6%” — they’re because they didn’t protect plants, didn’t control dwell/dry, didn’t rinse correctly, didn’t test oxidation, didn’t control overspray, didn’t close out, etc.

**What we *do* teach publicly (examples):**
- “Apply bottom-up, rinse top-down” for house washing (non-negotiable)
- no high pressure on roofs
- protection protocols for electrical, plants, stained/sealed wood doors
- decision logic for stains / oxidation risk
- closeout + Proof Pack (documentation) as part of delivery

**Planned compromise:** Recipe Vault acknowledgement wall + separate vault pages (not in the main public lessons).

---

## 2) Critique: “Custom Next.js vs LMS — missing quizzes/community/video completion”

**Your claim:** We’re inheriting technical debt and missing LMS features.

**Our position:** Correct that LMS features are valuable; we chose custom for control + portability.

Reasons we chose a custom app:
- The course content is the source of truth (Git-based), versioned, and vendored into the site (no LMS lock-in).
- We can render operator-specific constructs: inline SOP embeds, figures A/B/C, photo references, and YouTube players inside lessons.
- We can keep the aesthetic and UX consistent with the “operator manual” goal.

**Roadmap response:**
- We agree interactive elements matter.
- Instead of a full LMS replatform, we’re planning **operator tools** (interactive checklists, proof-pack generators, non-negotiables builders) first.
- Quizzes/checkpoints can be added later as lightweight UI blocks.

---

## 3) Critique: “Progress tracking (no auth) is unacceptable”

**Your claim:** localStorage progress is unacceptable for professional users.

**Our position:** For Phase 1, it’s a feature, not a bug.

- No sign-in means less friction and less time-to-value.
- We’re explicit in the UI that progress is saved on the device.
- We ship export/import JSON so users can back up.

**Roadmap response:**
- We agree cross-device sync and analytics will matter later.
- Phase 2 can introduce Auth.js + a small DB (Supabase/Vercel Postgres) once deliverability and product fit are validated.

---

## 4) Critique: “SOP delivery is clunky (markdown downloads)”

**Your claim:** downloading markdown isn’t field-usable.

**Our position:** Correct; that’s why we render SOPs inline and will evolve to interactive checklists.

Current behavior:
- SOP references open inline (dropdown) with on-page reading.
- Download exists as a fallback.

Roadmap response:
- We agree the next step is tap-to-check mobile checklists for field use.
- This aligns with our interactive operator resources plan.

---

## 5) Critique: “Offline reliability (PWA) — APIs for photos/figures can break”

**Your claim:** spotty service will break the app.

**Our position:** Valid concern, staged solution.

- Figures/photos are served from the same domain via API routes.
- We can add PWA caching later (service worker + pre-cache key assets) once the content set stabilizes.

This is on the roadmap, but not the first milestone.

---

## 6) SEO crawlability (the specific claim)

**Your claim:** the subdomain is “completely invisible” and “actively blocking crawlers.”

**What we observed:**
- The site returns HTTP 200 for `/`, `/course`, and lesson pages.
- It does **not** send an `X-Robots-Tag: noindex` header on those pages.
- The real issue was simply missing discovery endpoints.

**Fix implemented:** we added:
- `/robots.txt`
- `/sitemap.xml`

(Those routes are generated via Next.js `app/robots.ts` and `app/sitemap.ts`.)

---

# Concrete examples (so you can critique the real thing)

## Key URLs (public)
- Academy home: https://academy.tbsoftwash.com/
- Course index: https://academy.tbsoftwash.com/course
- Module 0 Orientation (what the course is + why it’s free + review meta):
  - https://academy.tbsoftwash.com/course/core/0/welcome-and-how-to-use

## “How to do the job” examples
- House wash workflow + QA (includes bottom-up apply / top-down rinse):
  - https://academy.tbsoftwash.com/course/core/4/housewash-workflow-and-qa
- Roof workflow + QA:
  - https://academy.tbsoftwash.com/course/core/3/roof-workflow-and-qa
- Springboard “Week 0 — First 7 days momentum plan”:
  - https://academy.tbsoftwash.com/course/springboard/week-0-first-7-days/first-7-days-momentum-plan

## Printables (operator field support)
- Printables index: https://academy.tbsoftwash.com/course/printables

## Current publishing stance (summary)
- Public course teaches **process, safety, decision logic, boundaries, and QA**.
- Exact recipe-level ratios are intentionally not published publicly.
- A gated “Recipe Vault” acknowledgement wall is a planned lane if we ever introduce recipes.

---

## Bottom line

Your critique correctly highlights what would be required to turn this into a full paid LMS product (auth, analytics, quizzes, community, offline-first checklists).

But the current Academy is intentionally shipping as a **public, free operator standard** with:
- low-friction access
- portable/versioned content
- strong workflow + protection + closeout discipline

If you want to critique the teaching quality, please use the URLs above (especially House workflow + Roof workflow + Module 0 orientation). That’s the real product.
