# Auth Stub (Phase 1)

Status: **Stubbed** (UI exists, no SMTP/Auth.js wired yet).

Goal for Phase 1:
- Keep progress local (localStorage).
- Add **passwordless email sign-in** later (magic link; no password storage).

## Planned stack
- Auth.js (NextAuth) for Next.js App Router
- Email Provider via SMTP (Google Workspace) OR Resend
- JWT sessions (no DB required)

## Required env vars (Vercel)

### Auth.js
- `AUTH_SECRET` (generate once; 32+ chars)
- `AUTH_URL` (e.g., `https://academy.tbsoftwash.com`)

### SMTP (Google Workspace)
- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=465` (SSL) or `587` (STARTTLS)
- `SMTP_USER=academy@tbsoftwash.com`
- `SMTP_PASS=<Google App Password>`
- `EMAIL_FROM=academy@tbsoftwash.com`

## Why we’re stubbing this
- Avoid DB + vendor spend at the start.
- Ship onboarding + export/import now.
- Add email sign-in when SMTP is configured and tested.

## UX requirements
- Landing page offers:
  - Continue as Guest
  - Sign in with Email (Coming soon)
- Inside course:
  - Banner: guest mode / local progress
  - Export/Import progress in user card
