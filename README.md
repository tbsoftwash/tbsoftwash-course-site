# Tampa Bay Soft Wash Course (Public Content)

This repo contains the **public operator-course content** for Tampa Bay Soft Wash Academy.

- Primary consumer: the Next.js course site (`tbsoftwash-course-site`) which vendors this repo via **git subtree**.
- Content types: lessons, SOPs, printables, diagrams, and owned photos.

## What lives here
- `00_scope/` – goals, audience, constraints, decisions
- `01_business_profile/` – extracted site notes + positioning
- `02_chemicals/` – public-safe chemical library pages
- `03_curriculum/` – modules and lessons (markdown)
- `04_sops/` – SOPs, checklists, QA
- `05_sales_marketing/` – offers, scripts, marketing ops
- `06_ops/` – operations playbooks
- `07_course_site/` – site specs and policies (vault/disclaimer, diagrams pipeline)
- `08_illustrations/` – owned diagrams (A/B/C) + photo assets
- `09_voice_of_operator/` – operator rants captured and structured for insertion
- `99_backlog/` – next actions

## Authoring conventions

### Inline SOP/Printable references
Reference internal docs using backticks:

- `04_sops/proof-pack/proof-pack-sop-v1.md`

The site will render these as an inline dropdown viewer with a Download button.

### Diagrams
Use:

- `FIGURE: <baseName>`

### Photos (owned, no faces)
Use:

- `PHOTO: <file.jpg> | optional caption`

Photos live in:
- `08_illustrations/photos/`

See:
- `08_illustrations/photos/INDEX.md`

## Publishing policy
- Keep operator content **public-safe**.
- Avoid publishing exact chemical ratio recipes.
- Emphasize safety, SDS habits, ranges, and decision logic.
