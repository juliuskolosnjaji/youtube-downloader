#!/bin/bash
# YouTube Downloader — LXC container setup script
# Run this inside a Debian 12 / Ubuntu 24.04 LXC container as root.
#
# Usage:
#   bash <(curl -fsSL https://raw.githubusercontent.com/juliuskolosnjaji/youtube-downloader/main/deploy/lxc/setup.sh)
#
# Or on Proxmox:
#   pct exec <CTID> -- bash <(curl -fsSL https://raw.githubusercontent.com/juliuskolosnjaji/youtube-downloader/main/deploy/lxc/setup.sh)

set -euo pipefail

GITHUB_REPO="juliuskolosnjaji/youtube-downloader"
GITHUB_BRANCH="main"
APP_DIR="/opt/youtube-downloader"
APP_USER="ytdl"
SERVICE_NAME="youtube-downloader"
NODE_MAJOR="22"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()    { echo -e "${GREEN}[setup]${NC} $*"; }
warning() { echo -e "${YELLOW}[warn]${NC}  $*"; }
error()   { echo -e "${RED}[error]${NC} $*"; exit 1; }

[[ $EUID -ne 0 ]] && error "Run as root."

# ── 1. System packages ────────────────────────────────────────────────────────
info "Updating system packages..."
apt-get update -qq
apt-get install -y --no-install-recommends \
    curl ca-certificates gnupg git ffmpeg python3 \
    > /dev/null

# ── 2. Node.js via NodeSource ─────────────────────────────────────────────────
if ! command -v node &>/dev/null || [[ "$(node --version | cut -d. -f1 | tr -d 'v')" -lt "$NODE_MAJOR" ]]; then
    info "Installing Node.js $NODE_MAJOR..."
    curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash - > /dev/null
    apt-get install -y nodejs > /dev/null
else
    info "Node.js $(node --version) already installed, skipping."
fi

# ── 3. yt-dlp ─────────────────────────────────────────────────────────────────
info "Installing yt-dlp..."
curl -fsSL "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp" \
    -o /usr/local/bin/yt-dlp
chmod +x /usr/local/bin/yt-dlp

# ── 4. App user ───────────────────────────────────────────────────────────────
if ! id "$APP_USER" &>/dev/null; then
    info "Creating user $APP_USER..."
    useradd --system --shell /usr/sbin/nologin --home-dir "$APP_DIR" "$APP_USER"
fi

# ── 5. Clone from GitHub ──────────────────────────────────────────────────────
if [[ -d "$APP_DIR/.git" ]]; then
    info "Repository already exists, pulling latest from GitHub..."
    git -C "$APP_DIR" fetch --quiet origin "$GITHUB_BRANCH"
    git -C "$APP_DIR" reset --hard "origin/$GITHUB_BRANCH" --quiet
else
    info "Cloning from github.com/$GITHUB_REPO..."
    git clone --branch "$GITHUB_BRANCH" --depth 1 \
        "https://github.com/$GITHUB_REPO.git" "$APP_DIR"
fi

# Preserve .env and data/secrets across deploys
mkdir -p "$APP_DIR/data/downloads" "$APP_DIR/data/tmp" "$APP_DIR/secrets/sessions"
touch "$APP_DIR/data/downloads/.gitkeep" "$APP_DIR/data/tmp/.gitkeep"
[[ -f "$APP_DIR/data/jobs.json" ]] || echo "[]" > "$APP_DIR/data/jobs.json"

chown -R "$APP_USER:$APP_USER" "$APP_DIR"

# ── 6. Install npm dependencies ───────────────────────────────────────────────
info "Installing npm dependencies..."
cd "$APP_DIR"
sudo -u "$APP_USER" npm install --omit=dev --silent

# ── 7. .env file ─────────────────────────────────────────────────────────────
if [[ ! -f "$APP_DIR/.env" ]]; then
    info "Creating .env from .env.example..."
    cp "$APP_DIR/.env.example" "$APP_DIR/.env"
    chown "$APP_USER:$APP_USER" "$APP_DIR/.env"
    chmod 600 "$APP_DIR/.env"
    warning "Edit $APP_DIR/.env before starting the service."
fi

# ── 8. Install update script ──────────────────────────────────────────────────
info "Installing update script..."
cp "$APP_DIR/deploy/lxc/update.sh" /usr/local/bin/ytdl-update
chmod +x /usr/local/bin/ytdl-update

# ── 9. systemd service ────────────────────────────────────────────────────────
info "Installing systemd service..."
cp "$APP_DIR/deploy/lxc/$SERVICE_NAME.service" "/etc/systemd/system/$SERVICE_NAME.service"
systemctl daemon-reload
systemctl enable "$SERVICE_NAME"

echo ""
echo -e "${GREEN}✓ Setup complete.${NC}"
echo ""
echo "  Next steps:"
echo "    1. Edit the config:   nano $APP_DIR/.env"
echo "    2. Start the service: systemctl start $SERVICE_NAME"
echo "    3. Check status:      systemctl status $SERVICE_NAME"
echo "    4. View logs:         journalctl -u $SERVICE_NAME -f"
echo "    5. Update later:      ytdl-update"
echo ""
