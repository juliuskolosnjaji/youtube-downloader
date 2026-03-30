#!/bin/bash
# YouTube Downloader — update script
# Installed to /usr/local/bin/ytdl-update during setup.
# Run as root to pull the latest code from GitHub and restart the service.

set -euo pipefail

GITHUB_BRANCH="main"
APP_DIR="/opt/youtube-downloader"
APP_USER="ytdl"
SERVICE_NAME="youtube-downloader"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()    { echo -e "${GREEN}[update]${NC} $*"; }
warning() { echo -e "${YELLOW}[warn]${NC}  $*"; }
error()   { echo -e "${RED}[error]${NC} $*"; exit 1; }

[[ $EUID -ne 0 ]] && error "Run as root."
[[ -d "$APP_DIR/.git" ]] || error "App not found at $APP_DIR. Run setup.sh first."

# ── 1. Pull latest code ───────────────────────────────────────────────────────
info "Fetching latest code from GitHub..."
BEFORE=$(git -C "$APP_DIR" rev-parse HEAD)
git -C "$APP_DIR" fetch --quiet origin "$GITHUB_BRANCH"
git -C "$APP_DIR" reset --hard "origin/$GITHUB_BRANCH" --quiet
AFTER=$(git -C "$APP_DIR" rev-parse HEAD)

if [[ "$BEFORE" == "$AFTER" ]]; then
    info "Already up to date ($(git -C "$APP_DIR" log -1 --format='%h %s'))."
    exit 0
fi

info "Updated: $BEFORE → $AFTER"
git -C "$APP_DIR" log --oneline "${BEFORE}..${AFTER}"

# ── 2. Update npm dependencies ────────────────────────────────────────────────
info "Updating npm dependencies..."
cd "$APP_DIR"
sudo -u "$APP_USER" npm install --omit=dev --silent

# ── 3. Update service file if it changed ─────────────────────────────────────
if ! diff -q "$APP_DIR/deploy/lxc/$SERVICE_NAME.service" \
              "/etc/systemd/system/$SERVICE_NAME.service" &>/dev/null; then
    info "Service file changed, reloading systemd..."
    cp "$APP_DIR/deploy/lxc/$SERVICE_NAME.service" "/etc/systemd/system/$SERVICE_NAME.service"
    systemctl daemon-reload
fi

# ── 4. Update this script itself if it changed ────────────────────────────────
cp "$APP_DIR/deploy/lxc/update.sh" /usr/local/bin/ytdl-update
chmod +x /usr/local/bin/ytdl-update

# ── 5. Restart the service ────────────────────────────────────────────────────
info "Restarting $SERVICE_NAME..."
systemctl restart "$SERVICE_NAME"
sleep 2

if systemctl is-active --quiet "$SERVICE_NAME"; then
    echo -e "${GREEN}✓ Update complete. Service is running.${NC}"
else
    error "Service failed to start after update. Check: journalctl -u $SERVICE_NAME -n 50"
fi
