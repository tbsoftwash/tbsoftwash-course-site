# Course Illustrations Pipeline (v1)

Goal: create consistent, original illustrations for course pages and printables.

## Principles
- Do not copy third-party artwork. Recreate concepts with original diagrams.
- Prioritize clarity over aesthetics.
- Use the same visual language across modules (icons, callouts, labels).

## File locations
- Source SVG/PNG: `tbsoftwash-course/08_illustrations/src/`
- Exported web images: `tbsoftwash-course/08_illustrations/export/`
- Course site public assets: `tbsoftwash-course-site/public/illustrations/`

## Naming
- `fig-###-short-name.(svg|png)`

## Initial illustration backlog (from external training inspiration)
- fig-101-outlet-taping-sequence
- fig-102-pressurewasher-types-tree
- fig-103-psi-vs-gpm-tradeoff
- fig-104-bypass-thermal-relief
- fig-105-downstream-vs-softwash
- fig-106-hose-ends-and-coiling
- fig-107-quick-connect-and-o-ring

## Production process
1) Draft in SVG (Figma or Inkscape) with layers.
2) Export at 1600px wide PNG + SVG.
3) Add into lesson markdown with `FIGURE:` callouts.
4) Course site renders figures with consistent styling.

## Notes
If you want to use third-party illustrations directly, we need written permission/license.
