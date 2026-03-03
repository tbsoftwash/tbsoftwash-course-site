# Local Server Setup — Tampa Bay Soft Wash Academy (Course Site)

This doc explains how to run the Academy site locally (localhost) and troubleshoot common issues.

Repo: `tbsoftwash-course-site`

---

## 1) Prerequisites

### Required
- Node.js (LTS recommended)
- npm

Check versions:

```bash
node -v
npm -v
```

---

## 2) Get the code

```bash
cd /home/kingb/.openclaw/workspace/tbsoftwash-course-site

git status
# optional: ensure you’re on the branch you want
# git checkout master
# or: git checkout dev

git pull
```

---

## 3) Install dependencies

```bash
npm install
```

If install fails, try:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 4) Run the local dev server (recommended)

Dev mode gives hot reload and fastest iteration.

```bash
npm run dev -- -p 3005
```

Open:
- http://localhost:3005

### Notes
- If you don’t pass `-p 3005`, Next picks a default port (often 3000).
- Dev mode uses your local filesystem for the vendored course content in `tbsoftwash-course/`.

---

## 5) Run a production-like server locally

```bash
npm run build
npm run start -- -p 3005
```

Use this to validate Vercel-like builds.

---

## 6) Port already in use

See what’s using the port:

```bash
lsof -i :3005
```

Kill the PID (example PID 12345):

```bash
kill -9 12345
```

Then start the server again.

---

## 7) Common failure modes

### A) "Module not found" / missing dependency
Run:

```bash
npm install
npm run build
```

### B) "Old version" on live domain vs local
- Local dev serves your local branch.
- Live domain is whatever Vercel deployed from GitHub.

### C) Course content missing
This repo vendors course content here:
- `tbsoftwash-course-site/tbsoftwash-course/`

If that folder is missing or stale:
- run the subtree sync (see README), or pull latest commits.

---

## 8) Stop the server
In the terminal running the server:
- Press `Ctrl + C`
