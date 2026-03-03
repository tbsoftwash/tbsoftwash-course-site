# Quickstart — Tampa Bay Soft Wash Academy (Course Site)

## Local dev (most common)

```bash
cd /home/kingb/.openclaw/workspace/tbsoftwash-course-site
npm install
npm run dev -- -p 3005
```

Open: http://localhost:3005

## If you get "EADDRINUSE" (port 3005 already used)

```bash
ss -ltnp | grep ':3005' || true
# kill the PID shown
kill -9 <PID>

npm run dev -- -p 3005
```

## If navigation errors show "Failed to fetch"

This usually means the dev server died or the router couldn’t fetch the next route payload.

1) Confirm server is running:
```bash
ss -ltnp | grep ':3005' || true
```

2) Restart dev server:
```bash
npm run dev -- -p 3005
```

3) If it keeps happening, disable Turbopack:
```bash
NEXT_DISABLE_TURBOPACK=1 npm run dev -- -p 3005
```

## Production-like local run

```bash
npm run build
npm run start -- -p 3005
```

## Docs
- More detail: `docs/LOCAL-SERVER-SETUP.md`
