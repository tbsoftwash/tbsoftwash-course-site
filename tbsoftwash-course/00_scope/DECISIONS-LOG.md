# Decisions Log

(Short, high-signal record of key choices.)

## Positioning
- TBSoftWash course teaches a **top 50–75% pricing** operator model.
- Differentiation: experience + attention to detail + safety + documentation + customer experience.

## Research workflow
- Use **Clawgle** primarily for Google discovery.
- Use **web_fetch** for fast extraction after sources are chosen.
- Fall back to Clawgle for dynamic sites/CAPTCHAs/weird rendering.

## Voice & tone
- Warm-first, professional structure.
- Default opener: **"Hey <Name>,"**

## Audience
- Operator-focused course (business owners + technicians), but still useful for handy homeowners.

## Monetization
- Promote Amazon products throughout the course via end-of-lesson **Gear Boxes** (Starter/Pro/Premium + Consumables + optional Homeowner-safe).
- Coverage goal: **everything reasonable** (field gear + ops + content/marketing + AI/automation accessories), without becoming spam.

## Recipe Vault (chemical ratios) gating
- Decision: Keep public course pages **public-safe** (process + decision logic + stop conditions) and place exact chemical ratios/recipe-level cards behind a **one-time disclaimer wall per browser** (localStorage acknowledgment).
- Rationale: Radical transparency without encouraging skim-reader misuse; recipes may exist publicly already, but we add safety friction + clear responsibility framing.
- Plan: `07_course_site/RECIPE-VAULT-DISCLAIMER-WALL.md`

## Documentation approach
- Document-heavy roadmap and artifacts now.
- Prune later once patterns are proven.
