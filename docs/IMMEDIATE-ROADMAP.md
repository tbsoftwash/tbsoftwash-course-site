# Immediate Roadmap (Draft)

Date: 2026-03-04
Source: First-pass critique from external AI reviewer (no full context). Captured *as-is* for now; we will refine later.

Scope: **academy.tbsoftwash.com** (Next.js academy app)

Guiding constraint (current Phase 1): public/free, no DB/Drive dependency, progress saved locally with export/import; avoid exposing exact chemical recipes publicly.

---

## 0) SEO crawlability basics (blocking / discovery)

**Problem statement (critique):** academy subdomain may be invisible to crawlers.

**Our immediate checks (manual):**
- Confirm `robots.txt` exists and allows crawl
- Confirm `sitemap.xml` exists and lists key pages
- Add/verify Google Search Console property for `academy.tbsoftwash.com`

**Deliverable:**
- Working `https://academy.tbsoftwash.com/robots.txt`
- Working `https://academy.tbsoftwash.com/sitemap.xml`

Status: ✅ Implemented in code; verify Vercel deployment + cache propagation.

---

## 1) Safety policy vs “recipe-level” details (liability wall)

**Critique:** Without exact chemical ratios, an operator course may feel incomplete.

**Suggested fix (critique):**
- Build disclaimer wall immediately.
- Put hard-coded recipes into curriculum behind that wall.
- Provide a downloadable waterproof PDF cheat sheet.

**Notes / open questions (for later):**
- We currently intentionally avoid publishing exact recipe-level ratios publicly.
- Decide: do we create a “Recipe Vault” lane with an acknowledgement wall (local storage gated in Phase 1), and keep the main lessons public-safe?

Status: Planned / decision pending.

---

## 2) Platform choice: custom Next.js vs LMS features

**Critique:** Custom app lacks LMS features that drive learning success:
- quizzes
- community/forum
- video completion tracking

**Suggested fix (critique):**
- If staying custom, add interactive elements (quizzes/checkpoints) inside lessons.

Status: Planned (Phase 1+).

---

## 3) Progress tracking (no auth) limitations

**Critique:** localStorage-only progress is unacceptable long-term (no cross-device sync, no analytics).

**Suggested fix (critique):**
- Implement Auth.js (NextAuth) + lightweight DB (Supabase/Vercel Postgres)
- Track progress server-side + analytics

**Notes:**
- Current Phase 1 intentionally ships with local progress + export/import.
- Future: add honest messaging (“saved on this device; sync later”).

Status: Planned (Phase 2).

---

## 4) SOP delivery: markdown viewer vs field utility

**Critique:** Downloading markdown is clunky for field use.

**Suggested fix (critique):**
- Convert SOPs into interactive mobile checklists (tap-to-check)

Status: Planned (Operator Resources / Tools initiative).

---

## 5) Field reliability: offline / PWA

**Critique:** Dynamic APIs for photos/figures can break on spotty service.

**Suggested fix (critique):**
- Add PWA/offline caching (service worker) so SOPs/photos/figures work offline.

Status: Planned (Phase 2).

---

## Execution order (proposed)

1) **SEO plumbing**: robots + sitemap + Search Console verification
2) **Interactive operator resources**: checklists, proof-pack generator, non-negotiables card
3) **Recipe Vault decision**: acknowledgement wall + content policy
4) **Offline/PWA**: cache core resources + assets
5) **Auth + analytics**: cross-device progress + insight into lesson dropoff

---

## Source critique (verbatim summary)

- “Safety policy is a curriculum killer” (wants recipes behind waiver)
- “Custom Next.js misses LMS features (quizzes/community/video tracking)”
- “LocalStorage progress unacceptable for professional app”
- “SOP markdown download not field-usable; make interactive mobile checklists”
- “Offline problem; convert to PWA with caching”
