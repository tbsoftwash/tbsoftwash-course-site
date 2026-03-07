#!/usr/bin/env bash
set -euo pipefail

SESSION="tbacademy-dev"
PORT="${1:-3005}"

cd "$(dirname "$0")/.."

tmux has-session -t "${SESSION}" 2>/dev/null && {
  echo "[tmux-dev] Session already running: ${SESSION}"
  echo "[tmux-dev] Attach with: tmux attach -t ${SESSION}"
  exit 0
}

tmux new-session -d -s "${SESSION}" "bash scripts/dev-watch.sh ${PORT}"

echo "[tmux-dev] Started ${SESSION} on port ${PORT}"

echo "[tmux-dev] Attach: tmux attach -t ${SESSION}"

echo "[tmux-dev] Kill:   tmux kill-session -t ${SESSION}"
