# TBSoftWash Course — Roadmap & Direction (document-heavy working plan)

This is a *living* roadmap. It’s intentionally verbose; we can prune later.

## North Star
Build a comprehensive exterior cleaning course that captures TBSoftWash end-to-end and teaches a **top 50–75% pricing** operator model: higher price justified by documented process, attention to detail, risk reduction, communication, and results.

## Guiding principles
1) **Process over personality:** course must be executable by a new hire/owner-operator.
2) **Florida reality:** humidity, algae, tile roofs, stucco, HOAs, landscaping sensitivity.
3) **Proof is part of delivery:** before/after + QA + customer communication are core service steps.
4) **Method selection matters:** chemical/mechanical choices and substrate constraints drive outcomes.
5) **Document everything:** we’ll generate more notes than needed; final cut comes later.

## Current assets already built (quick index)
- Business/service extraction + pricing notes: `01_business_profile/`
- Service-page mini-SOP notes: `01_business_profile/services/`
- Blog idea deep dive: `01_business_profile/blog-deep-dive.md`
- Competitor plan + seed list: `02_competitors/`
- Curriculum skeleton: `03_curriculum/module-map.md`
- SOP template + SOP folder: `04_sops/`
- Voice-of-customer + comms + review SOPs: `05_sales_marketing/`

## Phase 1 — Infrastructure (FOUNDATION)
**Goal:** create the “course factory” so every new research item becomes a lesson, checklist, or template.

### Deliverables
- Folder structure (done)
- SOP template (done)
- Standard lesson template (to create)
- Standard teardown template for competitors (to create)
- Asset pipeline rules (photos/screenshots naming; to create)

### Done Definition
We can add a new service/competitor/post and reliably output:
- summary
- SOP checklist
- customer script
- QA checklist
- upsell/bundle notes

## Phase 2 — TBSoftWash business profiling (TRUTH SOURCE)
**Goal:** extract TBSoftWash “house style” and turn it into repeatable SOPs.

### Workstreams
1) **Service SOPs (core):** roof, house wash, windows, gutters, brightening, flatwork.
2) **Specialty modules:** paver sealing, wood stain/seal, rust/hard water, graffiti, hydro-jetting.
3) **Pricing logic:** minimums + multipliers + complexity factors.
4) **Customer experience:** communication timeline, proof pack, review engine.

### Outputs
- One polished SOP per service (in `04_sops/`)
- One “sales page outline” per service (optional) showing how to communicate value

## Phase 3 — Competitive deep dive (FLORIDA MARKET)
**Goal:** identify top-performing Florida operators and steal what works:
- offer stacks
- guarantees
- estimate flows
- operations signals
- content strategies

### Method
- Clawgle for discovery (Google/local pack)
- `web_fetch` for extraction
- Write competitor teardowns (1 page each)

### Outputs
- `02_competitors/teardowns/<brand>.md`
- `02_competitors/takeaways.md` updated weekly
- “What we’ll incorporate” decisions logged

## Phase 4 — Curriculum build (COURSE ASSEMBLY)
**Goal:** convert SOPs + templates into a structured curriculum.

### Course architecture (recommended)
- Track A: Owner-operator (estimating, pricing, sales, ops)
- Track B: Technician (field execution + safety + QA)
- Shared: chemicals/equipment, documentation, customer experience

### Outputs
- Module outlines → lesson scripts → worksheets
- Quizzes/checks (optional)

## Phase 5 — Packaging & launch
**Goal:** make it easy to consume.

## Parallel Track — AI Book (Operator Growth)
**Goal:** publish a first-person operator book about adopting AI in the exterior cleaning industry to stay relevant as search changes and to generate leads.

### Outputs
- `/resources/ai/` landing page + chapter 1 email gate
- Book outline + chapter drafts
- Prompt library + templates appendix

### Integration
- Cross-link lightly from operator academy pages
- Keep homeowner resources separate to avoid confusion

### Outputs
- Printable PDFs (checklists)
- Notion/Google Drive structure (optional)
- Versioning system (v0.1, v0.2…)

## Master backlog (prioritized)
### P0 (next 1–3 days)
1) Create **Proof Pack SOP** (photo checklist + naming + delivery to customer) (done: `04_sops/proof-pack/proof-pack-sop-v1.md`)
2) Create competitor teardown template (done: `02_competitors/TEARDOWN-TEMPLATE.md`)
3) Convert 2 core services into full SOPs:
   - Roof soft wash SOP (done: `04_sops/roofs/roof-soft-wash-sop-v1.md`)
   - House wash SOP (done: `04_sops/houses/house-wash-softwash-sop-v1.md`)

### P1 (next 1–2 weeks)
4) Windows SOP (WFP + interior)
5) Gutter cleaning SOP + gutter brightening SOP
6) Flatwork SOP (surface cleaner + post-treat)
7) “Why we cost more” value stack page (for sales)

### P2 (after core is stable)
8) Paver sealing SOP
9) Wood stain/seal SOP
10) Rust/hard water stain modules
11) Drain jetting SOP refinement

## Decisions log (to keep us aligned)
- Pricing position: **top 50–75%** in the market.
- Voice: **warm-first, corporate-structured**, default opener: “Hey <Name>,”.
- Research workflow: Clawgle for discovery; web_fetch for extraction; Clawgle fallback.

## Risks / unknowns
- Course delivery platform not selected yet.
- How much chemical detail to publish (full recipes vs ranges + safety-first).
- Some competitors may hide SOP details; we’ll infer from offer/proof signals.

## Next action I will execute unless redirected
Create the **Proof Pack SOP** + competitor teardown template, then start polishing the Roof SOP.
