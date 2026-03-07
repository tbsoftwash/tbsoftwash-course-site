#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-3005}"

cd "$(dirname "$0")/.."

echo "[dev-watch] Starting dev server watchdog on port ${PORT} (branch: $(git branch --show-current))"

echo "[dev-watch] If Next crashes, it will restart in 1s. Ctrl+C to stop."

while true; do
  # Ensure we’re on dev (policy)
  git checkout dev >/dev/null 2>&1 || true

  # Kill any stale listener on the port (best effort)
  if command -v lsof >/dev/null 2>&1; then
    PID=$(lsof -ti tcp:${PORT} -sTCP:LISTEN 2>/dev/null || true)
    if [ -n "${PID}" ]; then
      echo "[dev-watch] Port ${PORT} already in use by PID ${PID}. Killing..."
      kill ${PID} >/dev/null 2>&1 || true
      sleep 0.5
    fi
  fi

  npm run dev -- -p "${PORT}" || true
  echo "[dev-watch] next dev exited. Restarting in 1s..."
  sleep 1
 done
