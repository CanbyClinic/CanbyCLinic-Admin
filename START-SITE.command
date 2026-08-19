#!/bin/bash
cd "$(dirname "$0")"
PORT=4173
if command -v node >/dev/null 2>&1; then
  (sleep 1; open "http://127.0.0.1:${PORT}/") &
  PORT=$PORT node server.mjs
elif command -v python3 >/dev/null 2>&1; then
  (sleep 1; open "http://127.0.0.1:${PORT}/") &
  python3 -m http.server "$PORT" --bind 127.0.0.1
else
  echo "Install Node.js or Python 3, then run this file again."
  read -p "Press Enter to close"
fi
