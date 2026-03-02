# Recipe Vault (Chemical Ratios) — Disclaimer Wall Plan (v1)

Decision: Use a **one-time acknowledgment per browser** (localStorage) before showing recipe-level chemical ratios and operator-only step-by-step cards.

## Why
- Keep the main course publicly safe (process + decision logic + stop conditions).
- Still honor radical transparency: recipes exist, but behind a clear safety acknowledgment.
- Reduce foreseeable misuse from skim-readers.

## Lane structure
1) **Public course pages (default)**
   - Process + safety + decision logic
   - Ranges instead of exact ratios
   - “When to stop / when to hire a pro”
   - Links to blog sources

2) **Recipe Vault (gated by disclaimer wall)**
   - Exact ratios / step-by-step “job cards”
   - Clear PPE + runoff + stop-conditions on every page
   - “Operator reference” framing

## UX (Next.js)
- Vault routes:
  - `/course/vault` (index)
  - `/course/vault/chemicals/*`
  - `/course/vault/recipes/*`

- Gate behavior:
  - If not acknowledged → redirect to `/course/vault/acknowledge` (disclaimer page)
  - If acknowledged → allow access
  - Store flag in `localStorage` (e.g. `tbsa.vaultAck.v1=true`)

## Disclaimer copy (draft)
**Title:** Chemical & Risk Content — Read Before Proceeding

This section contains **chemical dilution ratios** and **operator workflows**.
Misuse can cause **injury**, **property damage**, and **environmental harm**.

- Follow product labels + SDS, and local regulations.
- Always test a small area first.
- Never mix chemicals.
- Never let product dry on surfaces.
- Protect landscaping and manage runoff.
- If you are not trained/equipped, hire a professional.

**Acknowledgment checkboxes:**
- [ ] I understand this is not individualized advice for my property.
- [ ] I understand the risks and will follow label/SDS and local rules.
- [ ] I accept responsibility for my use of this information.

Buttons:
- Continue to Recipe Vault
- Go back

## Content rule
Any lesson that references chemical ratios should:
- keep the public lesson safe
- provide a link: “See Recipe Vault (acknowledgment required)”

## Notes
This is a safety and clarity mechanism, not a paywall.
