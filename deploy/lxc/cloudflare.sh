#!/bin/bash
# YouTube Downloader — Cloudflare Tunnel helper
# Runs INSIDE the container. Called by deploy.sh or standalone.
#
# Usage:
#   cloudflare.sh install <TOKEN>   — install or replace tunnel
#   cloudflare.sh remove            — uninstall tunnel
#   cloudflare.sh status            — show tunnel status

set -euo pipefail

ACTION="${1:-status}"
TOKEN="${2:-}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()    { echo -e "${GREEN}[cloudflare]${NC} $*"; }
warning() { echo -e "${YELLOW}[warn]${NC}  $*"; }
error()   { echo -e "${RED}[error]${NC} $*"; exit 1; }

install_cloudflared() {
    if ! command -v cloudflared &>/dev/null; then
        info "Installing cloudflared..."
        local arch
        arch=$(dpkg --print-architecture)
        curl -fsSL "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-${arch}.deb" \
            -o /tmp/cloudflared.deb
        dpkg -i /tmp/cloudflared.deb > /dev/null
        rm /tmp/cloudflared.deb
    else
        info "cloudflared $(cloudflared --version 2>&1 | head -1) already installed."
    fi
}

case "$ACTION" in
    install)
        [[ -z "$TOKEN" ]] && error "Usage: cloudflare.sh install <TOKEN>"

        install_cloudflared

        # Remove existing service if present
        if systemctl is-active --quiet cloudflared 2>/dev/null; then
            info "Removing existing tunnel service..."
            cloudflared service uninstall 2>/dev/null || true
            sleep 1
        fi

        info "Installing tunnel service with provided token..."
        cloudflared service install "$TOKEN"
        systemctl enable cloudflared
        systemctl start cloudflared
        sleep 3

        if systemctl is-active --quiet cloudflared; then
            echo -e "${GREEN}✓ Cloudflare Tunnel is running.${NC}"
            echo ""
            echo "  Configure your public hostname in the Cloudflare dashboard:"
            echo "    Zero Trust → Networks → Tunnels → your tunnel → Public Hostnames"
            echo "    Add: your-domain.com → http://localhost:8080"
        else
            error "Tunnel service failed to start. Check: journalctl -u cloudflared -n 30"
        fi
        ;;

    remove)
        if ! command -v cloudflared &>/dev/null; then
            info "cloudflared is not installed."
            exit 0
        fi

        info "Stopping and removing Cloudflare Tunnel..."
        systemctl stop cloudflared 2>/dev/null || true
        cloudflared service uninstall 2>/dev/null || true
        apt-get remove -y cloudflared > /dev/null 2>&1 || \
            rm -f /usr/local/bin/cloudflared
        echo -e "${GREEN}✓ Cloudflare Tunnel removed.${NC}"
        ;;

    status)
        if ! command -v cloudflared &>/dev/null; then
            echo "cloudflared: not installed"
            exit 0
        fi
        echo "cloudflared: $(cloudflared --version 2>&1 | head -1)"
        if systemctl is-active --quiet cloudflared 2>/dev/null; then
            echo -e "service:     ${GREEN}running${NC}"
        else
            echo -e "service:     ${RED}stopped${NC}"
        fi
        ;;

    *)
        error "Unknown action: $ACTION. Use: install <token> | remove | status"
        ;;
esac
