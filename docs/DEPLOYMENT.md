# Deployment (Vercel)

## Branches
- `master`: production lane
- `dev`: active development lane

## Domain
- Production domain: `academy.tbsoftwash.com`

## Common cause of "old version"
Changes are on `dev` but Vercel Production is building `master`.

### Fix options
1) Temporarily set Vercel Production Branch to `dev`
2) Use a staging domain for `dev` and keep prod on `master`
3) Merge `dev` → `master` when ready to ship

## Build requirement
Always run:

```bash
npm run build
```

before shipping to `master`.
