#!/bin/bash
# YouTube Downloader — Proxmox host-side deploy script
#
# Run this ON THE PROXMOX HOST (not inside the container).
# It will either create a new LXC container and set up the app,
# or detect an existing one and update it.
#
# Usage:
#   bash <(curl -fsSL https://raw.githubusercontent.com/juliuskolosnjaji/youtube-downloader/main/deploy/lxc/deploy.sh)

set -euo pipefail

GITHUB_RAW="https://raw.githubusercontent.com/juliuskolosnjaji/youtube-downloader/main/deploy/lxc"
APP_DIR="/opt/youtube-downloader"
SERVICE_NAME="youtube-downloader"
DEFAULT_MEMORY=512
DEFAULT_SWAP=512
DEFAULT_DISK=4
DEFAULT_BRIDGE="vmbr0"
DEFAULT_STORAGE="local-lvm"
DEFAULT_HOSTNAME="youtube-downloader"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()    { echo -e "${GREEN}[deploy]${NC} $*"; }
warning() { echo -e "${YELLOW}[warn]${NC}  $*"; }
error()   { echo -e "${RED}[error]${NC} $*"; exit 1; }
prompt()  { echo -e "${CYAN}$*${NC}"; }

command -v pct &>/dev/null || error "This script must be run on a Proxmox host (pct not found)."
[[ $EUID -ne 0 ]] && error "Run as root."

# ─────────────────────────────────────────────────────────────────────────────
# Header
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}YouTube Downloader — LXC Deploy${NC}"
echo -e "github.com/juliuskolosnjaji/youtube-downloader"
echo "────────────────────────────────────────────────"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# Step 1 — Container
# ─────────────────────────────────────────────────────────────────────────────
echo -e "${BOLD}[1/3] Container${NC}"
echo ""

# Find next free CT ID
next_id() {
    local id=100
    while pct status "$id" &>/dev/null 2>&1; do
        id=$((id + 1))
    done
    echo "$id"
}

# Check if any existing container has the app installed
find_existing() {
    for id in $(pct list 2>/dev/null | awk 'NR>1 {print $1}'); do
        if pct exec "$id" -- test -d "$APP_DIR/.git" 2>/dev/null; then
            echo "$id"
            return
        fi
    done
}

EXISTING_ID=$(find_existing)

if [[ -n "$EXISTING_ID" ]]; then
    CT_STATUS=$(pct status "$EXISTING_ID" | awk '{print $2}')
    CT_HOSTNAME=$(pct config "$EXISTING_ID" | grep "^hostname:" | awk '{print $2}')
    echo -e "Found existing container: ${BOLD}CT $EXISTING_ID${NC} (${CT_HOSTNAME}, ${CT_STATUS})"
    echo ""
    prompt "  What do you want to do?"
    echo "    [1] Update the app in CT $EXISTING_ID  (default)"
    echo "    [2] Create a new container"
    echo ""
    read -rp "  Choice [1]: " CONTAINER_CHOICE
    CONTAINER_CHOICE="${CONTAINER_CHOICE:-1}"
else
    CONTAINER_CHOICE="2"
fi

if [[ "$CONTAINER_CHOICE" == "1" ]]; then
    # ── Update existing ───────────────────────────────────────────────────────
    CT_ID="$EXISTING_ID"
    CT_STATUS=$(pct status "$CT_ID" | awk '{print $2}')

    if [[ "$CT_STATUS" != "running" ]]; then
        info "Starting container $CT_ID..."
        pct start "$CT_ID"
        sleep 3
    fi

    info "Pulling latest code inside CT $CT_ID..."
    pct exec "$CT_ID" -- bash -c "
        cd $APP_DIR
        git fetch --quiet origin main
        BEFORE=\$(git rev-parse HEAD)
        git reset --hard origin/main --quiet
        AFTER=\$(git rev-parse HEAD)
        if [[ \"\$BEFORE\" == \"\$AFTER\" ]]; then
            echo 'Already up to date.'
        else
            echo \"Updated: \${BEFORE:0:7} → \${AFTER:0:7}\"
            git log --oneline \"\$BEFORE..\$AFTER\"
            npm install --omit=dev --silent
        fi

        # Update service file if changed
        if ! diff -q $APP_DIR/deploy/lxc/$SERVICE_NAME.service \
                      /etc/systemd/system/$SERVICE_NAME.service &>/dev/null; then
            cp $APP_DIR/deploy/lxc/$SERVICE_NAME.service /etc/systemd/system/$SERVICE_NAME.service
            systemctl daemon-reload
        fi

        # Update update script
        cp $APP_DIR/deploy/lxc/update.sh /usr/local/bin/ytdl-update
        chmod +x /usr/local/bin/ytdl-update

        systemctl restart $SERVICE_NAME
        sleep 2
        systemctl is-active --quiet $SERVICE_NAME && echo 'Service is running.' || echo 'WARNING: service failed to start.'
    "

else
    # ── Create new container ──────────────────────────────────────────────────
    echo ""
    prompt "  Container configuration (press Enter to accept defaults):"
    echo ""

    DEFAULT_CTID=$(next_id)
    read -rp "  CT ID [$DEFAULT_CTID]: " CT_ID
    CT_ID="${CT_ID:-$DEFAULT_CTID}"

    if pct status "$CT_ID" &>/dev/null 2>&1; then
        error "CT $CT_ID already exists. Choose a different ID."
    fi

    read -rp "  Hostname [$DEFAULT_HOSTNAME]: " CT_HOSTNAME
    CT_HOSTNAME="${CT_HOSTNAME:-$DEFAULT_HOSTNAME}"

    read -rp "  Memory MB [$DEFAULT_MEMORY]: " CT_MEMORY
    CT_MEMORY="${CT_MEMORY:-$DEFAULT_MEMORY}"

    read -rp "  Disk GB [$DEFAULT_DISK]: " CT_DISK
    CT_DISK="${CT_DISK:-$DEFAULT_DISK}"

    read -rp "  Network bridge [$DEFAULT_BRIDGE]: " CT_BRIDGE
    CT_BRIDGE="${CT_BRIDGE:-$DEFAULT_BRIDGE}"

    read -rp "  Storage [$DEFAULT_STORAGE]: " CT_STORAGE
    CT_STORAGE="${CT_STORAGE:-$DEFAULT_STORAGE}"

    # Find a Debian 12 template
    TEMPLATE=$(pveam list local 2>/dev/null | grep -i "debian-12" | head -1 | awk '{print $1}')
    if [[ -z "$TEMPLATE" ]]; then
        info "Downloading Debian 12 template..."
        pveam update > /dev/null
        TEMPLATE_NAME=$(pveam available --section system 2>/dev/null | grep -i "debian-12" | head -1 | awk '{print $2}')
        [[ -z "$TEMPLATE_NAME" ]] && error "Could not find a Debian 12 template. Run 'pveam update' and try again."
        pveam download local "$TEMPLATE_NAME" > /dev/null
        TEMPLATE="local:vztmpl/$TEMPLATE_NAME"
    fi

    echo ""
    info "Creating container CT $CT_ID ($CT_HOSTNAME)..."
    pct create "$CT_ID" "$TEMPLATE" \
        --hostname "$CT_HOSTNAME" \
        --memory "$CT_MEMORY" \
        --swap "$DEFAULT_SWAP" \
        --rootfs "$CT_STORAGE:$CT_DISK" \
        --net0 "name=eth0,bridge=$CT_BRIDGE,ip=dhcp" \
        --unprivileged 1 \
        --features nesting=1 \
        --ostype debian \
        --start 1

    info "Waiting for container to boot..."
    sleep 5

    # Install curl in container first (needed to download setup.sh)
    info "Installing curl in container..."
    pct exec "$CT_ID" -- apt-get update -qq
    pct exec "$CT_ID" -- apt-get install -y -qq curl

    # Wait for network
    for i in {1..20}; do
        if lxc-attach -n "$CT_ID" -- curl -fsSL --max-time 3 https://github.com &>/dev/null; then
            break
        fi
        sleep 2
    done

    # Run setup inside the container
    info "Running setup inside CT $CT_ID..."
    lxc-attach -n "$CT_ID" -- curl -fsSL "$GITHUB_RAW/setup.sh" -o /tmp/setup.sh
    lxc-attach -n "$CT_ID" -- bash /tmp/setup.sh
fi

# ─────────────────────────────────────────────────────────────────────────────
# Step 2 — Configure .env
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}[2/3] Configuration${NC}"
echo ""

ENV_EXISTS=$(pct exec "$CT_ID" -- bash -c "
    grep -q '^PORT=' $APP_DIR/.env && \
    grep -q '^PORT=8080' $APP_DIR/.env && \
    echo 'default' || echo 'custom'
" 2>/dev/null || echo "default")

if [[ "$ENV_EXISTS" == "default" ]]; then
    warning ".env is still at defaults."
    prompt "  Edit it now? [Y/n]: "
    read -rp "  " EDIT_ENV
    EDIT_ENV="${EDIT_ENV:-Y}"
    if [[ "${EDIT_ENV^^}" == "Y" ]]; then
        lxc-attach -n "$CT_ID" -- nano "$APP_DIR/.env"
        lxc-attach -n "$CT_ID" -- systemctl restart "$SERVICE_NAME" || true
    fi
else
    info ".env already configured, skipping."
fi

# ─────────────────────────────────────────────────────────────────────────────
# Step 3 — Cloudflare Tunnel
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}[3/3] Cloudflare Tunnel${NC}"
echo ""

CF_INSTALLED=$(pct exec "$CT_ID" -- bash -c "
    command -v cloudflared &>/dev/null && \
    systemctl is-active --quiet cloudflared && \
    echo 'yes' || echo 'no'
" 2>/dev/null || echo "no")

if [[ "$CF_INSTALLED" == "yes" ]]; then
    echo -e "  Cloudflare Tunnel is ${GREEN}already running${NC}."
    echo ""
    prompt "  What do you want to do?"
    echo "    [1] Keep existing tunnel  (default)"
    echo "    [2] Replace with a new tunnel token"
    echo "    [3] Remove tunnel"
    echo ""
    read -rp "  Choice [1]: " CF_CHOICE
    CF_CHOICE="${CF_CHOICE:-1}"
else
    echo "  No Cloudflare Tunnel is configured."
    echo ""
    prompt "  Set one up? This lets you expose the app without opening ports."
    echo "    [1] Skip — access via LAN IP only  (default)"
    echo "    [2] Set up a Cloudflare Tunnel"
    echo ""
    read -rp "  Choice [1]: " CF_CHOICE_NEW
    CF_CHOICE="${CF_CHOICE_NEW:-1}"
    [[ "$CF_CHOICE" == "2" ]] && CF_CHOICE="new"
fi

case "$CF_CHOICE" in
    new|2)
        echo ""
        echo -e "  ${CYAN}How to get a tunnel token:${NC}"
        echo "    1. Go to dash.cloudflare.com → Zero Trust → Networks → Tunnels"
        echo "    2. Create a tunnel → Cloudflared connector"
        echo "    3. Copy the token shown in the install command"
        echo ""
        read -rp "  Paste your tunnel token: " CF_TOKEN
        [[ -z "$CF_TOKEN" ]] && warning "No token entered, skipping Cloudflare setup." || \
            lxc-attach -n "$CT_ID" -- bash -c "curl -fsSL $GITHUB_RAW/cloudflare.sh -o /tmp/cloudflare.sh && bash /tmp/cloudflare.sh install" "$CF_TOKEN"
        ;;
    3)
        lxc-attach -n "$CT_ID" -- bash -c "curl -fsSL $GITHUB_RAW/cloudflare.sh -o /tmp/cloudflare.sh && bash /tmp/cloudflare.sh remove"
        ;;
    *)
        info "Skipping Cloudflare Tunnel."
        ;;
esac

# ─────────────────────────────────────────────────────────────────────────────
# Done
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "────────────────────────────────────────────────"
echo -e "${GREEN}${BOLD}✓ Done!${NC}"
echo ""

CT_IP=$(pct exec "$CT_ID" -- hostname -I 2>/dev/null | awk '{print $1}' || echo "unknown")
echo -e "  LAN access:  ${BOLD}http://$CT_IP:8080${NC}"

CF_URL=$(pct exec "$CT_ID" -- bash -c "
    cloudflared tunnel info 2>/dev/null | grep -oP '(?<=URL: ).*' | head -1
" 2>/dev/null || true)
[[ -n "$CF_URL" ]] && echo -e "  Tunnel URL:  ${BOLD}$CF_URL${NC}"

echo ""
echo -e "  Logs:        pct exec $CT_ID -- journalctl -u $SERVICE_NAME -f"
echo -e "  Update:      pct exec $CT_ID -- ytdl-update"
echo -e "  Re-deploy:   Run this script again"
echo ""
