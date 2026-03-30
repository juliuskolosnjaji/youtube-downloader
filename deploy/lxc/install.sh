#!/usr/bin/env bash
# YouTube Downloader LXC — Proxmox VE Install Script
# Author: juliuskolosnjaji
# Source: https://github.com/juliuskolosnjaji/youtube-downloader
#
# Run on the Proxmox host:
#   bash <(curl -fsSL https://raw.githubusercontent.com/juliuskolosnjaji/youtube-downloader/main/deploy/lxc/install.sh)

set -Eeuo pipefail

# ==============================================================================
# Colors & Formatting
# ==============================================================================

YW=$'\033[33m'
YWB=$'\033[93m'
BL=$'\033[36m'
RD=$'\033[01;31m'
BGN=$'\033[4;92m'
GN=$'\033[1;92m'
DGN=$'\033[32m'
CL=$'\033[m'
BOLD=$'\033[1m'
BFR="\\r\\033[K"
TAB="  "

# ==============================================================================
# Icons
# ==============================================================================

CM="${TAB}✔️ ${TAB}"
CROSS="${TAB}✖️ ${TAB}"
INFO="${TAB}💡${TAB}"
CREATING="${TAB}🚀${TAB}"
GATEWAY="${TAB}🌐${TAB}"
CONTAINERID="${TAB}🆔${TAB}"
HOSTNAME="${TAB}🏠${TAB}"
DISKSIZE="${TAB}💾${TAB}"
CPUCORE="${TAB}🧠${TAB}"
RAMSIZE="${TAB}🛠️ ${TAB}"
NETWORK="${TAB}📡${TAB}"
BRIDGE="${TAB}🌉${TAB}"
DEFAULT="${TAB}⚙️ ${TAB}"
ADVANCED="${TAB}🧩${TAB}"
VERIFYPW="${TAB}🔐${TAB}"
CLOUD="${TAB}☁️ ${TAB}"

# ==============================================================================
# Header
# ==============================================================================

header_info() {
  clear
  cat <<"EOF"
    __  __    ____           ____                      __                __
   / / / /   / __ \____     / __ \____ _      ______  / /___  ____ _____/ /__  _____
  / / / /   / / / / __ \   / / / / __ \ | /| / / __ \/ / __ \/ __ `/ __  / _ \/ ___/
 / /_/ /   / /_/ / / / /  / /_/ / /_/ / |/ |/ / / / / / /_/ / /_/ / /_/ /  __/ /
/_____/   /_____/_/ /_/  /_____/\____/|__/|__/_/ /_/_/\____/\__,_/\__,_/\___/_/

EOF
  echo -e "${DGN}    LXC Install Script${CL}   ${YW}github.com/juliuskolosnjaji/youtube-downloader${CL}"
  echo -e "    ${BL}────────────────────────────────────────────────────────────────────────────${CL}"
  echo ""
}

# ==============================================================================
# Helpers
# ==============================================================================

msg_info()  { local msg="$1"; echo -ne "${TAB}${YW}⠋${CL} ${msg}..."; }
msg_ok()    { local msg="$1"; echo -e "${BFR}${CM}${GN}${msg}${CL}"; }
msg_error() { local msg="$1"; echo -e "${BFR}${CROSS}${RD}${msg}${CL}"; }

catch_errors() {
  set -Eeuo pipefail
  trap 'error_handler $LINENO "$BASH_COMMAND"' ERR
}

error_handler() {
  local line="$1" cmd="$2"
  msg_error "Error on line ${line}: ${cmd}"
  if [[ -n "${CT_ID:-}" ]] && pct status "$CT_ID" &>/dev/null; then
    echo -e "\n${INFO}${YW}Container CT${CT_ID} may be in an incomplete state.${CL}"
    read -rp "${TAB}Remove CT${CT_ID}? [y/N]: " yn
    [[ "${yn,,}" == "y" ]] && { pct stop "$CT_ID" 2>/dev/null || true; pct destroy "$CT_ID" --purge 2>/dev/null || true; msg_ok "Removed CT${CT_ID}"; }
  fi
  exit 1
}

check_proxmox() {
  command -v pct &>/dev/null || { msg_error "This script must run on a Proxmox VE host."; exit 1; }
  [[ $EUID -ne 0 ]] && { msg_error "Run as root."; exit 1; }
}

spinner_pid=""
start_spinner() { (while true; do for c in '⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏'; do echo -ne "\r${TAB}${YW}${c}${CL} ${1}..."; sleep 0.1; done; done) & spinner_pid=$!; }
stop_spinner()  { [[ -n "$spinner_pid" ]] && { kill "$spinner_pid" 2>/dev/null; wait "$spinner_pid" 2>/dev/null || true; spinner_pid=""; }; }

# ==============================================================================
# Defaults
# ==============================================================================

APP="YouTube Downloader"
NSAPP="youtube-downloader"
GITHUB_RAW="https://raw.githubusercontent.com/juliuskolosnjaji/youtube-downloader/main/deploy/lxc"
APP_DIR="/opt/youtube-downloader"
SERVICE_NAME="youtube-downloader"

var_cpu="1"
var_ram="512"
var_disk="4"
var_os="debian"
var_version="12"
var_unprivileged="1"

# ==============================================================================
# Main
# ==============================================================================

header_info
check_proxmox
catch_errors

# ── Detect existing installation ──────────────────────────────────────────────
EXISTING_CT=""
for id in $(pct list 2>/dev/null | awk 'NR>1 {print $1}'); do
  if pct exec "$id" -- test -d "$APP_DIR/.git" 2>/dev/null; then
    EXISTING_CT="$id"
    break
  fi
done

# ── Mode selection ────────────────────────────────────────────────────────────
if [[ -n "$EXISTING_CT" ]]; then
  CT_STATUS=$(pct status "$EXISTING_CT" | awk '{print $2}')
  CT_HOSTNAME=$(pct config "$EXISTING_CT" | grep "^hostname:" | awk '{print $2}')

  echo -e "${INFO}${YW}Found existing installation in CT${EXISTING_CT} (${CT_HOSTNAME}, ${CT_STATUS})${CL}\n"

  ACTION=$(whiptail --backtitle "YouTube Downloader" \
    --title "Existing Installation Detected" \
    --menu "\nWhat would you like to do?" 15 60 3 \
    "1" "Update app in CT${EXISTING_CT}" \
    "2" "Manage Cloudflare Tunnel in CT${EXISTING_CT}" \
    "3" "Create a new container" \
    3>&1 1>&2 2>&3) || { echo -e "\n${INFO}${YW}Cancelled.${CL}"; exit 0; }
else
  ACTION="new"
fi

# ==============================================================================
# UPDATE existing container
# ==============================================================================
if [[ "$ACTION" == "1" ]]; then
  header_info
  CT_ID="$EXISTING_CT"

  if [[ "$(pct status "$CT_ID" | awk '{print $2}')" != "running" ]]; then
    msg_info "Starting CT${CT_ID}"
    pct start "$CT_ID"
    sleep 3
    msg_ok "Started CT${CT_ID}"
  fi

  msg_info "Pulling latest code from GitHub"
  UPDATE_OUTPUT=$(pct exec "$CT_ID" -- bash -c "
    cd $APP_DIR
    git fetch --quiet origin main
    BEFORE=\$(git rev-parse HEAD)
    git reset --hard origin/main --quiet
    AFTER=\$(git rev-parse HEAD)
    if [[ \"\$BEFORE\" == \"\$AFTER\" ]]; then
      echo 'already-up-to-date'
    else
      echo \"updated:\${BEFORE:0:7}→\${AFTER:0:7}\"
      npm install --omit=dev --silent

      # Refresh service file if changed
      if ! diff -q $APP_DIR/deploy/lxc/$SERVICE_NAME.service \
                    /etc/systemd/system/$SERVICE_NAME.service &>/dev/null; then
        cp $APP_DIR/deploy/lxc/$SERVICE_NAME.service /etc/systemd/system/$SERVICE_NAME.service
        systemctl daemon-reload
      fi

      # Refresh update script
      cp $APP_DIR/deploy/lxc/update.sh /usr/local/bin/ytdl-update
      chmod +x /usr/local/bin/ytdl-update
    fi
  " 2>&1)

  if echo "$UPDATE_OUTPUT" | grep -q "already-up-to-date"; then
    msg_ok "Already up to date"
  else
    CHANGE=$(echo "$UPDATE_OUTPUT" | grep "^updated:" | head -1 | sed 's/updated://')
    msg_ok "Updated ${CHANGE}"
    msg_info "Restarting service"
    pct exec "$CT_ID" -- systemctl restart "$SERVICE_NAME"
    sleep 2
    msg_ok "Service restarted"
  fi

  CT_IP=$(pct exec "$CT_ID" -- hostname -I 2>/dev/null | awk '{print $1}' || echo "unknown")
  echo -e "\n${CM}${GN}Update complete!${CL}"
  echo -e "${GATEWAY}${BGN}http://${CT_IP}:8080${CL}\n"
  exit 0
fi

# ==============================================================================
# CLOUDFLARE management
# ==============================================================================
if [[ "$ACTION" == "2" ]]; then
  header_info
  CT_ID="$EXISTING_CT"

  if [[ "$(pct status "$CT_ID" | awk '{print $2}')" != "running" ]]; then
    msg_info "Starting CT${CT_ID}"; pct start "$CT_ID"; sleep 3; msg_ok "Started CT${CT_ID}"
  fi

  _manage_cloudflare "$CT_ID"
  exit 0
fi

# ==============================================================================
# CLOUDFLARE helper function (used in both new + existing flows)
# ==============================================================================
_manage_cloudflare() {
  local ct="$1"

  CF_RUNNING=$(pct exec "$ct" -- bash -c "
    command -v cloudflared &>/dev/null && \
    systemctl is-active --quiet cloudflared && echo yes || echo no
  " 2>/dev/null || echo "no")

  if [[ "$CF_RUNNING" == "yes" ]]; then
    CF_ACTION=$(whiptail --backtitle "YouTube Downloader" \
      --title "Cloudflare Tunnel" \
      --menu "\nTunnel is currently running." 14 60 3 \
      "1" "Keep existing tunnel" \
      "2" "Replace tunnel token" \
      "3" "Remove tunnel" \
      3>&1 1>&2 2>&3) || return 0
  else
    CF_ACTION=$(whiptail --backtitle "YouTube Downloader" \
      --title "Cloudflare Tunnel (optional)" \
      --menu "\nExpose the app via Cloudflare without opening ports." 15 60 2 \
      "1" "Skip — LAN access only" \
      "2" "Set up Cloudflare Tunnel" \
      3>&1 1>&2 2>&3) || return 0
    [[ "$CF_ACTION" == "1" ]] && { msg_ok "Skipping Cloudflare Tunnel"; return 0; }
    CF_ACTION="2"
  fi

  case "$CF_ACTION" in
    2)
      CF_TOKEN=$(whiptail --backtitle "YouTube Downloader" \
        --title "Cloudflare Tunnel Token" \
        --inputbox "\nPaste your tunnel token.\n\nGet it at:\n  dash.cloudflare.com → Zero Trust\n  → Networks → Tunnels → Create tunnel\n  → Cloudflared → copy the token\n" \
        18 70 3>&1 1>&2 2>&3) || return 0

      if [[ -z "$CF_TOKEN" ]]; then
        msg_error "No token entered — skipping Cloudflare setup"
        return 0
      fi

      msg_info "Installing Cloudflare Tunnel"
      pct exec "$ct" -- bash -c "curl -fsSL $GITHUB_RAW/cloudflare.sh -o /tmp/cloudflare.sh && bash /tmp/cloudflare.sh install" "$CF_TOKEN"
      msg_ok "Cloudflare Tunnel installed"
      ;;
    3)
      msg_info "Removing Cloudflare Tunnel"
      pct exec "$ct" -- bash -c "curl -fsSL $GITHUB_RAW/cloudflare.sh -o /tmp/cloudflare.sh && bash /tmp/cloudflare.sh remove"
      msg_ok "Cloudflare Tunnel removed"
      ;;
    *)
      msg_ok "Keeping existing tunnel"
      ;;
  esac
}

# ==============================================================================
# NEW container setup
# ==============================================================================
header_info

# ── Settings: Default or Advanced ────────────────────────────────────────────
if (whiptail --backtitle "YouTube Downloader" \
  --title "Settings" \
  --yesno "Use default settings?\n\n  CPU Cores: ${var_cpu}\n  RAM:       ${var_ram} MB\n  Disk:      ${var_disk} GB\n  OS:        ${var_os} ${var_version}\n  Type:      Unprivileged" \
  14 50); then
  SETTINGS="default"
else
  SETTINGS="advanced"
fi

# ── Container ID ──────────────────────────────────────────────────────────────
next_id() {
  local id=100
  while pct status "$id" &>/dev/null 2>&1; do id=$((id + 1)); done
  echo "$id"
}
DEFAULT_CTID=$(next_id)

if [[ "$SETTINGS" == "advanced" ]]; then
  CT_ID=$(whiptail --backtitle "YouTube Downloader" \
    --title "Container ID" \
    --inputbox "\nEnter container ID:" 9 50 "$DEFAULT_CTID" \
    3>&1 1>&2 2>&3) || exit 0
  [[ -z "$CT_ID" ]] && CT_ID="$DEFAULT_CTID"
  pct status "$CT_ID" &>/dev/null && { msg_error "CT${CT_ID} already exists."; exit 1; }
else
  CT_ID="$DEFAULT_CTID"
fi

# ── Hostname ──────────────────────────────────────────────────────────────────
if [[ "$SETTINGS" == "advanced" ]]; then
  CT_HOSTNAME=$(whiptail --backtitle "YouTube Downloader" \
    --title "Hostname" \
    --inputbox "\nEnter hostname:" 9 50 "$NSAPP" \
    3>&1 1>&2 2>&3) || exit 0
  [[ -z "$CT_HOSTNAME" ]] && CT_HOSTNAME="$NSAPP"
else
  CT_HOSTNAME="$NSAPP"
fi

# ── Root password ─────────────────────────────────────────────────────────────
CT_PW=$(whiptail --backtitle "YouTube Downloader" \
  --title "Root Password" \
  --passwordbox "\nSet a root password for the container\n(leave blank to disable password login):" \
  11 50 3>&1 1>&2 2>&3) || exit 0

# ── Resources ─────────────────────────────────────────────────────────────────
if [[ "$SETTINGS" == "advanced" ]]; then
  CT_CPU=$(whiptail --backtitle "YouTube Downloader" \
    --title "CPU Cores" --inputbox "\nCPU cores:" 9 40 "$var_cpu" 3>&1 1>&2 2>&3) || exit 0
  CT_RAM=$(whiptail --backtitle "YouTube Downloader" \
    --title "RAM" --inputbox "\nRAM in MB:" 9 40 "$var_ram" 3>&1 1>&2 2>&3) || exit 0
  CT_DISK=$(whiptail --backtitle "YouTube Downloader" \
    --title "Disk" --inputbox "\nDisk size in GB:" 9 40 "$var_disk" 3>&1 1>&2 2>&3) || exit 0
else
  CT_CPU="$var_cpu"
  CT_RAM="$var_ram"
  CT_DISK="$var_disk"
fi

# ── Storage ───────────────────────────────────────────────────────────────────
STORAGE_LIST=$(pvesm status -content rootdir 2>/dev/null | awk 'NR>1 {print $1 " " $1}')
if [[ -z "$STORAGE_LIST" ]]; then
  CT_STORAGE="local-lvm"
else
  if [[ "$SETTINGS" == "advanced" ]]; then
    CT_STORAGE=$(whiptail --backtitle "YouTube Downloader" \
      --title "Storage" --menu "\nSelect storage:" 15 50 6 \
      $STORAGE_LIST 3>&1 1>&2 2>&3) || exit 0
  else
    CT_STORAGE=$(echo "$STORAGE_LIST" | awk 'NR==1 {print $1}')
  fi
fi

# ── Network bridge ────────────────────────────────────────────────────────────
if [[ "$SETTINGS" == "advanced" ]]; then
  BRIDGE_LIST=$(ip link show | awk '/^[0-9]+: vmbr/{gsub(":",""); print $2 " " $2}')
  if [[ -n "$BRIDGE_LIST" ]]; then
    CT_BRIDGE=$(whiptail --backtitle "YouTube Downloader" \
      --title "Network Bridge" --menu "\nSelect bridge:" 14 50 4 \
      $BRIDGE_LIST 3>&1 1>&2 2>&3) || exit 0
  else
    CT_BRIDGE="vmbr0"
  fi
else
  CT_BRIDGE="vmbr0"
fi

# ── Confirm ───────────────────────────────────────────────────────────────────
whiptail --backtitle "YouTube Downloader" \
  --title "Confirm Settings" \
  --yesno "\n  Container ID: ${CT_ID}
  Hostname:     ${CT_HOSTNAME}
  CPU cores:    ${CT_CPU}
  RAM:          ${CT_RAM} MB
  Disk:         ${CT_DISK} GB
  Storage:      ${CT_STORAGE}
  Bridge:       ${CT_BRIDGE}
  Unprivileged: yes\n\nProceed?" \
  17 50 || { echo -e "\n${INFO}${YW}Cancelled.${CL}"; exit 0; }

# ==============================================================================
# Build container
# ==============================================================================
header_info

echo -e "${CREATING}${GN}Creating CT${CT_ID} (${CT_HOSTNAME})${CL}\n"

# ── Debian 12 template ────────────────────────────────────────────────────────
msg_info "Checking for Debian 12 template"
TEMPLATE=$(pveam list local 2>/dev/null | grep -i "debian-12" | head -1 | awk '{print $1}')
if [[ -z "$TEMPLATE" ]]; then
  stop_spinner 2>/dev/null || true
  msg_info "Downloading Debian 12 template"
  pveam update > /dev/null 2>&1
  TEMPLATE_NAME=$(pveam available --section system 2>/dev/null | grep -i "debian-12" | head -1 | awk '{print $2}')
  [[ -z "$TEMPLATE_NAME" ]] && { msg_error "Debian 12 template not found. Run 'pveam update'."; exit 1; }
  pveam download local "$TEMPLATE_NAME" > /dev/null 2>&1
  TEMPLATE="local:vztmpl/$TEMPLATE_NAME"
fi
msg_ok "Template ready"

# ── Create LXC ────────────────────────────────────────────────────────────────
msg_info "Creating container"
PCT_ARGS=(
  "$CT_ID" "$TEMPLATE"
  --hostname "$CT_HOSTNAME"
  --memory "$CT_RAM"
  --swap 512
  --rootfs "${CT_STORAGE}:${CT_DISK}"
  --cores "$CT_CPU"
  --net0 "name=eth0,bridge=${CT_BRIDGE},ip=dhcp"
  --unprivileged 1
  --features "nesting=1"
  --ostype "debian"
  --start 1
)
[[ -n "$CT_PW" ]] && PCT_ARGS+=(--password "$CT_PW")
pct create "${PCT_ARGS[@]}" > /dev/null 2>&1
msg_ok "Container CT${CT_ID} created"

# ── Wait for network ──────────────────────────────────────────────────────────
msg_info "Waiting for network"
for i in {1..30}; do
  if pct exec "$CT_ID" -- curl -fsSL --max-time 3 https://github.com &>/dev/null; then
    break
  fi
  sleep 2
done
msg_ok "Network ready"

# ── Run setup ─────────────────────────────────────────────────────────────────
msg_info "Installing dependencies (Node.js, ffmpeg, yt-dlp)"
pct exec "$CT_ID" -- bash -c "
  apt-get update -qq
  apt-get install -y --no-install-recommends curl ca-certificates gnupg git ffmpeg python3 > /dev/null
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - > /dev/null
  apt-get install -y nodejs > /dev/null
  curl -fsSL https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
  chmod +x /usr/local/bin/yt-dlp
" > /dev/null 2>&1
msg_ok "Dependencies installed"

msg_info "Cloning repository"
pct exec "$CT_ID" -- bash -c "
  useradd --system --shell /usr/sbin/nologin --home-dir /opt/youtube-downloader ytdl 2>/dev/null || true
  git clone --branch main --depth 1 https://github.com/juliuskolosnjaji/youtube-downloader.git $APP_DIR > /dev/null 2>&1
  mkdir -p $APP_DIR/data/downloads $APP_DIR/data/tmp $APP_DIR/secrets/sessions
  touch $APP_DIR/data/downloads/.gitkeep $APP_DIR/data/tmp/.gitkeep
  echo '[]' > $APP_DIR/data/jobs.json
  chown -R ytdl:ytdl $APP_DIR
  cd $APP_DIR && sudo -u ytdl npm install --omit=dev --silent
  cp $APP_DIR/.env.example $APP_DIR/.env
  chown ytdl:ytdl $APP_DIR/.env && chmod 600 $APP_DIR/.env
" > /dev/null 2>&1
msg_ok "Repository deployed"

msg_info "Installing systemd service"
pct exec "$CT_ID" -- bash -c "
  cp $APP_DIR/deploy/lxc/$SERVICE_NAME.service /etc/systemd/system/$SERVICE_NAME.service
  cp $APP_DIR/deploy/lxc/update.sh /usr/local/bin/ytdl-update
  chmod +x /usr/local/bin/ytdl-update
  systemctl daemon-reload
  systemctl enable $SERVICE_NAME > /dev/null 2>&1
" > /dev/null 2>&1
msg_ok "Service installed"

# ── Configure .env ────────────────────────────────────────────────────────────
if (whiptail --backtitle "YouTube Downloader" \
  --title "Configuration" \
  --yesno "\nEdit .env config now?\n\nYou can change PORT, R2 storage settings, yt-dlp options etc.\nThe app won't start until PORT is reachable." \
  12 55); then
  pct exec "$CT_ID" -- nano "$APP_DIR/.env"
fi

# ── Start service ─────────────────────────────────────────────────────────────
msg_info "Starting service"
pct exec "$CT_ID" -- systemctl start "$SERVICE_NAME" > /dev/null 2>&1
sleep 2
if pct exec "$CT_ID" -- systemctl is-active --quiet "$SERVICE_NAME"; then
  msg_ok "Service started"
else
  msg_error "Service failed to start — check: pct exec ${CT_ID} -- journalctl -u ${SERVICE_NAME} -n 30"
fi

# ── Cloudflare Tunnel ─────────────────────────────────────────────────────────
_manage_cloudflare "$CT_ID"

# ==============================================================================
# Done
# ==============================================================================
CT_IP=$(pct exec "$CT_ID" -- hostname -I 2>/dev/null | awk '{print $1}' || echo "unknown")

echo ""
echo -e "${CM}${GN}${BOLD}${APP} setup complete!${CL}"
echo ""
echo -e "${CONTAINERID}${BL}Container:${CL}  CT${CT_ID} (${CT_HOSTNAME})"
echo -e "${GATEWAY}${BL}LAN access:${CL} ${BGN}http://${CT_IP}:8080${CL}"

CF_URL=$(pct exec "$CT_ID" -- bash -c "
  [ -f /etc/cloudflared/config.yml ] && grep 'hostname' /etc/cloudflared/config.yml | awk '{print \$2}' | head -1 || true
" 2>/dev/null || true)
[[ -n "$CF_URL" ]] && echo -e "${CLOUD}${BL}Tunnel:${CL}     ${BGN}https://${CF_URL}${CL}"

echo ""
echo -e "${INFO}${YW}Useful commands:${CL}"
echo -e "${TAB}Update app:    ${BOLD}pct exec ${CT_ID} -- ytdl-update${CL}"
echo -e "${TAB}View logs:     ${BOLD}pct exec ${CT_ID} -- journalctl -u ${SERVICE_NAME} -f${CL}"
echo -e "${TAB}Re-run script: ${BOLD}bash <(curl -fsSL ${GITHUB_RAW}/install.sh)${CL}"
echo ""
