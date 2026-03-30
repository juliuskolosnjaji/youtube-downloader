const LOCALES = {
  en: {
    appTitle: "Kepr",
    modalLabel: "Cookie upload",
    modalTitle: "Upload your YouTube cookies first",
    modalBody:
      "Some YouTube links only work with a signed-in session. Upload your Netscape cookies file so protected links can be accessed.",
    cookieChooseFile: "Choose cookie file",
    cookieFileEmpty: "No file selected",
    cookieUploadAction: "Upload cookies",
    cookieDismissAction: "Continue without cookies",
    sessionLabel: "Private session",
    cookieFileLabel: "Cookie file",
    cookieUploadButton: "Upload cookies",
    cookieDeleteButton: "Delete cookies",
    statsLabel: "Session stats",
    statTotalLabel: "Downloads",
    statSizeLabel: "Downloaded",
    statSpeedLabel: "Speed",
    statEtaLabel: "Remaining",
    formatMixLabel: "Format mix",
    privacyLabel: "Privacy",
    privacyShortNotice:
      "Kepr only uses a necessary first-party session cookie for browser separation and stores downloads for 24 hours.",
    privacyPolicyLink: "Privacy policy",
    imprintLink: "Imprint",
    pageTitle: "Download locally.",
    pageSubtitle: "Save YouTube videos and MP3s directly to your session.",
    downloadLabel: "Download",
    videoUrlLabel: "Video URL",
    videoUrlPlaceholder: "https://www.youtube.com/watch?v=...",
    scopeAuto: "Auto detect",
    scopeVideo: "Single video",
    scopePlaylist: "Entire playlist",
    scopeChannel: "Entire channel",
    modeVideo: "MP4 video",
    modeAudio: "MP3 audio",
    inspectAction: "Inspect URL",
    downloadAction: "Start download",
    resetAction: "Reset",
    viewOriginal: "View original",
    downloadsCurrentLabel: "Downloads - Current session",
    refreshAction: "Refresh",
    downloadFile: "Download file",
    stopAction: "Stop",
    removeAction: "Remove",
    unknownDuration: "Unknown length",
    unknownCreator: "Unknown creator",
    unknownTitle: "Untitled",
    requestFailed: "Request failed.",
    cookieProblem: "Problem",
    cookieLoading: "Loading...",
    cookieNoSessionInfo: "No session information available yet.",
    cookiePrivateActive: "Cookie file active. Last updated {time}",
    cookiePrivatePill: "Active",
    cookieFallbackActive: "Global browser fallback active: {browser}",
    cookieFallbackPill: "Fallback",
    cookieMissing: "No private cookie file uploaded for this browser session.",
    cookieMissingPill: "Missing",
    statusFinished: "Done",
    statusCancelled: "Stopped",
    statusFailed: "Error",
    statusDownloading: "Running",
    statusQueued: "Queued",
    progressFinished: "Download complete",
    progressCancelled: "Download was stopped",
    progressFailed: "The downloader reported an error",
    progressWaiting: "Waiting for progress",
    emptyDownloads: "No downloads in this session yet.",
    stopMessage: "Download stopped.",
    removeMessage: "Download removed.",
    metadataLoading: "Inspecting URL...",
    metadataLoaded: "Metadata loaded.",
    metadataCollectionLoaded: "{scope} detected · {count} item(s)",
    downloadQueued: "Download queued. Progress updates automatically.",
    downloadsRefreshed: "Download list refreshed.",
    cookieSelectFirst: "Please choose a Netscape cookie file first.",
    cookieSaved: "Private cookies saved.",
    cookieRemoved: "Private cookies removed.",
    expiryWarningDays: "Deleted in {days} day(s)",
    expiryUrgent: "Deleted in less than 24h",
    expiryExpired: "Expired - will be removed soon",
    statUnitMiB: "MiB",
    statUnitKiBs: "KiB/s",
    statUnitEta: "ETA"
  },
  de: {
    appTitle: "Kepr",
    modalLabel: "Cookie-Upload",
    modalTitle: "Lade zuerst deine YouTube-Cookies hoch",
    modalBody:
      "Einige YouTube-Links funktionieren nur mit einer angemeldeten Session. Lade deine Netscape-Cookie-Datei hoch, damit geschützte Links funktionieren.",
    cookieChooseFile: "Cookie-Datei auswählen",
    cookieFileEmpty: "Noch keine Datei ausgewählt",
    cookieUploadAction: "Cookies hochladen",
    cookieDismissAction: "Ohne Cookies fortfahren",
    sessionLabel: "Private Session",
    cookieFileLabel: "Cookie-Datei",
    cookieUploadButton: "Cookies hochladen",
    cookieDeleteButton: "Cookies löschen",
    statsLabel: "Session",
    statTotalLabel: "Downloads",
    statSizeLabel: "Gesamt",
    statSpeedLabel: "Speed",
    statEtaLabel: "Verbleibend",
    formatMixLabel: "Formate",
    privacyLabel: "Datenschutz",
    privacyShortNotice:
      "Kepr verwendet nur ein notwendiges First-Party-Session-Cookie zur Trennung von Browser-Sitzungen und speichert Downloads 24 Stunden.",
    privacyPolicyLink: "Datenschutz",
    imprintLink: "Impressum",
    pageTitle: "Download locally.",
    pageSubtitle: "YouTube Videos und MP3s lokal speichern",
    downloadLabel: "Download",
    videoUrlLabel: "Video-URL",
    videoUrlPlaceholder: "https://www.youtube.com/watch?v=...",
    scopeAuto: "Automatisch",
    scopeVideo: "Einzelnes Video",
    scopePlaylist: "Ganze Playlist",
    scopeChannel: "Ganzer Kanal",
    modeVideo: "MP4 Video",
    modeAudio: "MP3 Audio",
    inspectAction: "Prüfen",
    downloadAction: "Download starten",
    resetAction: "Reset",
    viewOriginal: "Original ansehen",
    downloadsCurrentLabel: "Downloads - Current session",
    refreshAction: "Aktualisieren",
    downloadFile: "Datei herunterladen",
    stopAction: "Stoppen",
    removeAction: "Entfernen",
    unknownDuration: "Unbekannte Länge",
    unknownCreator: "Unbekannter Creator",
    unknownTitle: "Ohne Titel",
    requestFailed: "Anfrage fehlgeschlagen.",
    cookieProblem: "Problem",
    cookieLoading: "Wird geladen...",
    cookieNoSessionInfo: "Noch keine Session-Informationen verfügbar.",
    cookiePrivateActive: "Cookie-Datei aktiv. Zuletzt aktualisiert {time}",
    cookiePrivatePill: "Aktiv",
    cookieFallbackActive: "Globaler Browser-Fallback aktiv: {browser}",
    cookieFallbackPill: "Fallback",
    cookieMissing: "Keine private Cookie-Datei für diese Browser-Session hochgeladen.",
    cookieMissingPill: "Fehlt",
    statusFinished: "Fertig",
    statusCancelled: "Gestoppt",
    statusFailed: "Fehler",
    statusDownloading: "Läuft",
    statusQueued: "Wartet",
    progressFinished: "Download abgeschlossen",
    progressCancelled: "Download wurde gestoppt",
    progressFailed: "Der Downloader hat einen Fehler gemeldet",
    progressWaiting: "Warte auf Fortschritt",
    emptyDownloads: "Noch keine Downloads in dieser Session.",
    stopMessage: "Download wurde gestoppt.",
    removeMessage: "Download wurde entfernt.",
    metadataLoading: "URL wird analysiert...",
    metadataLoaded: "Metadaten geladen.",
    metadataCollectionLoaded: "{scope} erkannt · {count} Element(e)",
    downloadQueued: "Download eingeplant. Der Fortschritt aktualisiert sich automatisch.",
    downloadsRefreshed: "Downloadliste aktualisiert.",
    cookieSelectFirst: "Bitte wähle zuerst eine Netscape-Cookie-Datei aus.",
    cookieSaved: "Private Cookies wurden gespeichert.",
    cookieRemoved: "Private Cookies wurden entfernt.",
    expiryWarningDays: "Wird in {days} Tag(en) gelöscht",
    expiryUrgent: "Wird in weniger als 24h gelöscht",
    expiryExpired: "Abgelaufen - wird bald entfernt",
    statUnitMiB: "MiB",
    statUnitKiBs: "KiB/s",
    statUnitEta: "ETA"
  }
};

const POLL_INTERVAL_MS = 15000;
const EXPIRY_INTERVAL_MS = 60000;
const DOWNLOAD_RETENTION_MS = 24 * 60 * 60 * 1000;

const state = {
  locale: detectLocale(),
  theme: detectTheme(),
  metadata: null,
  jobs: new Map(),
  eventSources: new Map(),
  cookiesStatus: null,
  downloadsPolling: null,
  isInspecting: false,
  isStartingDownload: false
};

const elements = {
  probeForm: document.querySelector("#probe-form"),
  urlInput: document.querySelector("#url-input"),
  clearButton: document.querySelector("#clear-button"),
  refreshButton: document.querySelector("#refresh-button"),
  inspectButton: document.querySelector("#inspect-button"),
  downloadButton: document.querySelector("#download-button"),
  openModalButton: document.querySelector("#open-modal-button"),
  metadataCard: document.querySelector("#metadata-card"),
  message: document.querySelector("#message"),
  thumbnail: document.querySelector("#thumbnail"),
  videoTitle: document.querySelector("#video-title"),
  videoMeta: document.querySelector("#video-meta"),
  videoLink: document.querySelector("#video-link"),
  scopeSelect: document.querySelector("#scope-select"),
  audioQuality: document.querySelector("#audio-quality"),
  downloadsList: document.querySelector("#downloads-list"),
  template: document.querySelector("#download-template"),
  cookieModal: document.querySelector("#cookie-modal"),
  cookieStatus: document.querySelector("#cookie-status"),
  cookieStatusPill: document.querySelector("#cookie-status-pill"),
  cookiePillText: document.querySelector("#cookie-pill-text"),
  cookieFile: document.querySelector("#cookie-file"),
  cookieFileName: document.querySelector("#cookie-file-name"),
  cookieFileTrigger: document.querySelector("#cookie-file-trigger"),
  uploadCookiesButton: document.querySelector("#upload-cookies-button"),
  deleteCookiesButton: document.querySelector("#delete-cookies-button"),
  dismissModalButton: document.querySelector("#dismiss-modal-button"),
  statTotal: document.querySelector("#stat-total"),
  statSize: document.querySelector("#stat-size"),
  statSpeed: document.querySelector("#stat-speed"),
  statEta: document.querySelector("#stat-eta"),
  statTotalBar: document.querySelector("#stat-total-bar"),
  statSizeBar: document.querySelector("#stat-size-bar"),
  statSpeedBar: document.querySelector("#stat-speed-bar"),
  statEtaBar: document.querySelector("#stat-eta-bar"),
  formatMp4Bar: document.querySelector("#format-mp4-bar"),
  formatMp4Pct: document.querySelector("#format-mp4-pct"),
  formatMp3Bar: document.querySelector("#format-mp3-bar"),
  formatMp3Pct: document.querySelector("#format-mp3-pct"),
  localeButtons: [...document.querySelectorAll(".locale-btn")],
  themeButtons: [...document.querySelectorAll(".theme-btn")]
};

function detectLocale() {
  return navigator.language?.toLowerCase().startsWith("de") ? "de" : "en";
}

function detectTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  if (current === "light" || current === "dark") {
    return current;
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function t(key, vars = {}) {
  const table = LOCALES[state.locale] || LOCALES.en;
  const fallback = LOCALES.en[key] || key;
  const template = table[key] || fallback;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
}

function applyStaticTranslations() {
  document.documentElement.lang = state.locale;
  document.title = t("appTitle");

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  });

  document.querySelectorAll("option[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  elements.localeButtons.forEach((button) => {
    button.dataset.active = button.dataset.locale === state.locale ? "true" : "false";
  });

  elements.themeButtons.forEach((button) => {
    button.dataset.active = button.dataset.theme === state.theme ? "true" : "false";
  });

  if (!elements.cookieFile.files?.length) {
    elements.cookieFileName.textContent = t("cookieFileEmpty");
  }
}

function applyTheme(theme) {
  const normalizedTheme = theme === "dark" ? "dark" : "light";
  state.theme = normalizedTheme;
  document.documentElement.setAttribute("data-theme", normalizedTheme);
  document.documentElement.classList.toggle("theme-dark", normalizedTheme === "dark");
  document.documentElement.classList.toggle("theme-light", normalizedTheme === "light");
  document.body.dataset.theme = normalizedTheme;
  document.body.classList.toggle("theme-dark", normalizedTheme === "dark");
  document.body.classList.toggle("theme-light", normalizedTheme === "light");
  elements.themeButtons.forEach((button) => {
    button.dataset.active = button.dataset.theme === normalizedTheme ? "true" : "false";
  });
}

function setLocale(locale) {
  if (!LOCALES[locale]) {
    return;
  }

  state.locale = locale;
  applyStaticTranslations();
  updateAudioQualityVisibility();
  renderCookieStatus(state.cookiesStatus);
  renderMetadata(state.metadata);
  renderDownloads();
}

function formatDuration(seconds) {
  if (!seconds && seconds !== 0) {
    return t("unknownDuration");
  }

  const total = Number(seconds);
  if (!Number.isFinite(total)) {
    return t("unknownDuration");
  }

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = Math.floor(total % 60);
  return [hours, minutes, secs]
    .filter((value, index) => value > 0 || index > 0)
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function formatDateTime(value) {
  return new Date(value).toLocaleString(state.locale);
}

function showMessage(text, isError = false) {
  elements.message.hidden = false;
  elements.message.textContent = text;
  elements.message.dataset.tone = isError ? "error" : "neutral";
}

function clearMessage() {
  elements.message.hidden = true;
  elements.message.textContent = "";
  delete elements.message.dataset.tone;
}

function getSelectedMode() {
  return document.querySelector('input[name="mode"]:checked')?.value || "video";
}

function updateAudioQualityVisibility() {
  elements.audioQuality.hidden = getSelectedMode() !== "audio";
}

function syncRequestButtons() {
  const busy = state.isInspecting || state.isStartingDownload;
  elements.inspectButton.disabled = busy;
  elements.downloadButton.disabled = busy;
}

async function requestJson(url, options = {}) {
  const headers = {
    "X-App-Locale": state.locale,
    ...(options.headers || {})
  };

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    headers,
    ...options
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || t("requestFailed"));
  }
  return payload;
}

function openCookieModal() {
  elements.cookieModal.hidden = false;
}

function closeCookieModal() {
  elements.cookieModal.hidden = true;
}

function renderMetadata(metadata) {
  state.metadata = metadata;

  if (!metadata) {
    elements.metadataCard.hidden = true;
    elements.thumbnail.src = "";
    return;
  }

  const webpageUrl = metadata.webpageUrl || metadata.originalUrl || metadata.url || elements.urlInput.value.trim();

  elements.metadataCard.hidden = false;
  elements.thumbnail.src = metadata.thumbnail || "";
  elements.thumbnail.alt = `${metadata.title || t("unknownTitle")} thumbnail`;
  elements.videoTitle.textContent = metadata.title || t("unknownTitle");
  elements.videoMeta.textContent = [
    metadata.uploader || metadata.artist || t("unknownCreator"),
    metadata.isCollection
      ? t("metadataCollectionLoaded", {
          scope: metadata.scope === "channel" ? t("scopeChannel") : t("scopePlaylist"),
          count: metadata.entryCount || 0
        })
      : formatDuration(metadata.duration),
    metadata.extractor || null
  ].filter(Boolean).join(" • ");
  elements.videoLink.href = webpageUrl;
  elements.videoLink.textContent = t("viewOriginal");
}

function renderCookieStatus(status, errorMessage = "") {
  if (errorMessage) {
    elements.cookieStatus.textContent = errorMessage;
    elements.cookiePillText.textContent = t("cookieProblem");
    elements.cookieStatusPill.className = "pill pill-inactive";
    return;
  }

  state.cookiesStatus = status;

  if (!status) {
    elements.cookieStatus.textContent = t("cookieNoSessionInfo");
    elements.cookiePillText.textContent = t("cookieLoading");
    elements.cookieStatusPill.className = "pill pill-inactive";
    return;
  }

  if (status.source === "session-file" && status.configured) {
    elements.cookieStatus.textContent = t("cookiePrivateActive", {
      time: formatDateTime(status.updatedAt)
    });
    elements.cookiePillText.textContent = t("cookiePrivatePill");
    elements.cookieStatusPill.className = "pill pill-active";
    closeCookieModal();
    return;
  }

  if (status.source === "browser-profile") {
    elements.cookieStatus.textContent = t("cookieFallbackActive", {
      browser: status.browserSource || ""
    });
    elements.cookiePillText.textContent = t("cookieFallbackPill");
    elements.cookieStatusPill.className = "pill pill-fallback";
    closeCookieModal();
    return;
  }

  elements.cookieStatus.textContent = t("cookieMissing");
  elements.cookiePillText.textContent = t("cookieMissingPill");
  elements.cookieStatusPill.className = "pill pill-inactive";
}

function normalizeStatus(job) {
  if (job.status === "done" || job.status === "finished") {
    return "finished";
  }
  if (job.status === "running" || job.status === "downloading") {
    return "downloading";
  }
  if (job.status === "error" || job.status === "failed") {
    return "failed";
  }
  if (job.status === "cancelled") {
    return "cancelled";
  }
  return "queued";
}

function resolveMode(job) {
  if (job.mode === "audio" || job.format === "mp3" || job.format === "MP3") {
    return "audio";
  }
  return "video";
}

function statusText(job) {
  const status = normalizeStatus(job);
  if (status === "finished") {
    return t("statusFinished");
  }
  if (status === "cancelled") {
    return t("statusCancelled");
  }
  if (status === "failed") {
    return t("statusFailed");
  }
  if (status === "downloading") {
    return t("statusDownloading");
  }
  return t("statusQueued");
}

function getJobPercent(job) {
  if (typeof job.progress === "number") {
    return Math.max(0, Math.min(job.progress, 100));
  }
  if (typeof job.progress?.percent === "number") {
    return Math.max(0, Math.min(job.progress.percent, 100));
  }
  return 0;
}

function readNumericString(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== "string") {
    return null;
  }

  const match = value.replace(",", ".").match(/-?\d+(\.\d+)?/);
  if (!match) {
    return null;
  }
  return Number.parseFloat(match[0]);
}

function getJobSizeMiB(job) {
  return (
    readNumericString(job.sizeMiB) ??
    readNumericString(job.size_mib) ??
    readNumericString(job.progress?.total) ??
    0
  );
}

function getJobSpeedKiB(job) {
  return (
    readNumericString(job.speedKib) ??
    readNumericString(job.speed_kib) ??
    readNumericString(job.progress?.speed) ??
    0
  );
}

function getJobEta(job) {
  return job.eta || job.progress?.eta || "--";
}

function progressText(job) {
  const status = normalizeStatus(job);
  if (status === "finished") {
    return t("progressFinished");
  }
  if (status === "cancelled") {
    return t("progressCancelled");
  }
  if (status === "failed") {
    return t("progressFailed");
  }

  const parts = [];
  const percent = getJobPercent(job);
  if (percent > 0) {
    parts.push(`${percent.toFixed(1)}%`);
  }

  const size = getJobSizeMiB(job);
  if (size > 0) {
    parts.push(`${size.toFixed(2)} MiB`);
  }

  const speed = getJobSpeedKiB(job);
  if (speed > 0) {
    parts.push(`${speed.toFixed(2)} KiB/s`);
  }

  const eta = getJobEta(job);
  if (eta && eta !== "--") {
    parts.push(`ETA ${eta}`);
  }

  return parts.join(" • ") || t("progressWaiting");
}

function toCreatedAtMs(createdAt) {
  if (typeof createdAt === "number" && Number.isFinite(createdAt)) {
    return createdAt > 1e12 ? createdAt : createdAt * 1000;
  }

  if (typeof createdAt === "string" && /^\d+$/.test(createdAt)) {
    const parsed = Number.parseInt(createdAt, 10);
    return parsed > 1e12 ? parsed : parsed * 1000;
  }

  if (createdAt) {
    const parsed = new Date(createdAt).getTime();
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function getExpiryLabel(createdAt) {
  const createdAtMs = toCreatedAtMs(createdAt);
  if (!createdAtMs) {
    return "";
  }

  const expiresAtMs = createdAtMs + DOWNLOAD_RETENTION_MS;
  const remainingMs = expiresAtMs - Date.now();

  if (remainingMs <= 0) {
    return `<div class="expiry-label urgent">${t("expiryExpired")}</div>`;
  }

  if (remainingMs < DOWNLOAD_RETENTION_MS) {
    return `<div class="expiry-label urgent">${t("expiryUrgent")}</div>`;
  }

  return "";
}

function formatStatValue(value, unitKey) {
  return `${value}<sup>${t(unitKey)}</sup>`;
}

function renderStats() {
  const jobs = [...state.jobs.values()];
  const total = jobs.length;
  const totalSize = jobs.reduce((sum, job) => sum + getJobSizeMiB(job), 0);
  const maxSpeed = jobs.reduce((sum, job) => sum + getJobSpeedKiB(job), 0);
  const etaJob = jobs
    .map((job) => getJobEta(job))
    .find((eta) => eta && eta !== "--");
  const mp3Count = jobs.filter((job) => resolveMode(job) === "audio").length;
  const mp4Count = jobs.filter((job) => resolveMode(job) === "video").length;
  const mp3Pct = total ? Math.round((mp3Count / total) * 100) : 0;
  const mp4Pct = total ? Math.round((mp4Count / total) * 100) : 0;

  elements.statTotal.innerHTML = String(total);
  elements.statSize.innerHTML = formatStatValue(totalSize.toFixed(2), "statUnitMiB");
  elements.statSpeed.innerHTML = formatStatValue(maxSpeed.toFixed(2), "statUnitKiBs");
  elements.statEta.innerHTML = `${etaJob || "--"}<sup>${t("statUnitEta")}</sup>`;

  elements.statTotalBar.style.width = `${Math.min(total * 12, 100)}%`;
  elements.statSizeBar.style.width = `${Math.min(totalSize, 100)}%`;
  elements.statSpeedBar.style.width = `${Math.min(maxSpeed / 10, 100)}%`;
  elements.statEtaBar.style.width = etaJob && etaJob !== "--" ? "38%" : "0%";

  elements.formatMp3Bar.style.width = `${mp3Pct}%`;
  elements.formatMp3Pct.textContent = `${mp3Pct}%`;
  elements.formatMp4Bar.style.width = `${mp4Pct}%`;
  elements.formatMp4Pct.textContent = `${mp4Pct}%`;
}

function createStatsFragments(job) {
  const parts = [
    `${getJobPercent(job).toFixed(0)}%`,
    `${getJobSizeMiB(job).toFixed(2)} MiB`,
    `${getJobSpeedKiB(job).toFixed(2)} KiB/s`,
    `ETA ${getJobEta(job)}`
  ];

  return parts.map((part, index) => {
    const span = document.createElement("span");
    span.textContent = part;

    if (index === parts.length - 1) {
      return span;
    }

    const fragment = document.createDocumentFragment();
    fragment.append(span);
    const sep = document.createElement("span");
    sep.className = "sep";
    sep.textContent = "•";
    fragment.append(sep);
    return fragment;
  });
}

function getDownloadLink(job) {
  if (job.downloadUrl) {
    return job.downloadUrl;
  }
  if (job.filename) {
    return `/downloads/${encodeURIComponent(job.filename)}`;
  }
  return "";
}

function renderDownloads() {
  const jobs = [...state.jobs.values()].sort((a, b) => {
    return (toCreatedAtMs(b.created_at || b.createdAt) || 0) - (toCreatedAtMs(a.created_at || a.createdAt) || 0);
  });

  elements.downloadsList.innerHTML = "";

  if (jobs.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = t("emptyDownloads");
    elements.downloadsList.append(empty);
    renderStats();
    return;
  }

  for (const job of jobs) {
    const fragment = elements.template.content.cloneNode(true);
    const article = fragment.querySelector(".dl-item");
    const tag = fragment.querySelector(".dl-tag");
    const title = fragment.querySelector(".dl-title");
    const badge = fragment.querySelector(".badge");
    const progressBar = fragment.querySelector(".prog-fill");
    const stats = fragment.querySelector(".dl-stats");
    const expirySlot = fragment.querySelector(".expiry-slot");
    const link = fragment.querySelector(".dl-link");
    const stopButton = fragment.querySelector(".stop-btn");
    const removeButton = fragment.querySelector(".remove-btn");
    const error = fragment.querySelector(".download-error");
    const mode = resolveMode(job);
    const status = normalizeStatus(job);
    const percent = getJobPercent(job);

    article.dataset.jobId = job.id;
    article.dataset.status = status;
    tag.textContent = `${mode === "audio" ? "MP3 AUDIO" : "MP4 VIDEO"} • ${job.uploader || job.artist || t("unknownCreator")}`;
    title.textContent = job.title || t("unknownTitle");
    badge.textContent = statusText(job);
    badge.className = "badge";
    progressBar.className = "prog-fill";
    stats.innerHTML = "";
    expirySlot.innerHTML = getExpiryLabel(job.created_at || job.createdAt);

    if (status === "finished") {
      badge.classList.add("badge-done");
      progressBar.classList.add("done");
    } else if (status === "failed") {
      badge.classList.add("badge-error");
      progressBar.classList.add("error");
    } else if (status === "cancelled") {
      badge.classList.add("badge-neutral");
    } else {
      badge.classList.add("badge-running");
      progressBar.classList.add("running");
    }

    progressBar.style.width = `${Math.max(0, Math.min(percent, 100))}%`;

    createStatsFragments(job).forEach((node) => {
      stats.append(node);
    });

    const downloadUrl = getDownloadLink(job);
    const actionRow = fragment.querySelector(".download-actions");
    if (status === "finished" && downloadUrl) {
      link.hidden = false;
      link.href = downloadUrl;
      link.download = job.filename || "";
      link.textContent = t("downloadFile");
    }

    if (status === "finished" && Array.isArray(job.files) && job.files.length > 1) {
      link.hidden = true;
      job.files.forEach((file) => {
        const anchor = document.createElement("a");
        anchor.className = "dl-link";
        anchor.href = file.downloadUrl || `/download-file?job=${encodeURIComponent(job.id)}&file=${encodeURIComponent(file.relativePath || file.name)}`;
        anchor.download = file.name || "";
        anchor.textContent = `${t("downloadFile")} · ${file.name}`;
        actionRow.insertBefore(anchor, stopButton);
      });
    }

    stopButton.hidden = !["queued", "downloading"].includes(status);
    removeButton.hidden = false;
    stopButton.textContent = t("stopAction");
    removeButton.textContent = t("removeAction");

    if (job.error) {
      error.hidden = false;
      error.textContent = job.error;
    }

    elements.downloadsList.append(fragment);
  }

  renderStats();
}

function upsertJob(job) {
  state.jobs.set(job.id, job);
  renderDownloads();
  if (["queued", "downloading", "running"].includes(job.status)) {
    subscribeToJob(job.id);
  } else if (state.eventSources.has(job.id)) {
    state.eventSources.get(job.id)?.close();
    state.eventSources.delete(job.id);
  }
}

function subscribeToJob(jobId) {
  if (state.eventSources.has(jobId)) {
    return;
  }

  const source = new EventSource(`/api/downloads/${jobId}/events`);
  source.addEventListener("job", (event) => {
    const payload = JSON.parse(event.data);
    state.jobs.set(payload.id, payload);
    renderDownloads();
    if (["finished", "failed", "cancelled", "done", "error"].includes(payload.status)) {
      source.close();
      state.eventSources.delete(jobId);
    }
  });

  source.addEventListener("removed", (event) => {
    const payload = JSON.parse(event.data);
    state.jobs.delete(payload.id);
    renderDownloads();
    source.close();
    state.eventSources.delete(jobId);
  });

  source.onerror = () => {
    source.close();
    state.eventSources.delete(jobId);
    setTimeout(() => {
      const current = state.jobs.get(jobId);
      if (current && ["queued", "downloading", "running"].includes(current.status)) {
        subscribeToJob(jobId);
      }
    }, 1500);
  };

  state.eventSources.set(jobId, source);
}

async function loadDownloads() {
  const jobs = await requestJson("/api/downloads");
  const nextIds = new Set(jobs.map((job) => job.id));

  for (const [jobId, source] of state.eventSources.entries()) {
    if (!nextIds.has(jobId)) {
      source.close();
      state.eventSources.delete(jobId);
    }
  }

  state.jobs = new Map();
  jobs.forEach(upsertJob);
  renderDownloads();
}

async function cancelDownload(jobId) {
  try {
    const job = await requestJson(`/api/downloads/${jobId}/cancel`, {
      method: "POST"
    });
    upsertJob(job);
    showMessage(t("stopMessage"));
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function removeDownload(jobId) {
  try {
    await requestJson(`/api/downloads/${jobId}`, {
      method: "DELETE"
    });
    state.jobs.delete(jobId);
    state.eventSources.get(jobId)?.close();
    state.eventSources.delete(jobId);
    renderDownloads();
    showMessage(t("removeMessage"));
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function loadCookieStatus() {
  try {
    const status = await requestJson("/api/cookies");
    renderCookieStatus(status);
  } catch (error) {
    renderCookieStatus(null, error.message);
  }
}

async function inspectUrl(options = {}) {
  if (state.isInspecting || (state.isStartingDownload && !options.allowWhileStarting)) {
    return;
  }

  clearMessage();
  renderMetadata(null);
  state.isInspecting = true;
  syncRequestButtons();

  try {
    showMessage(t("metadataLoading"));
    const metadata = await requestJson("/api/probe", {
      method: "POST",
      body: JSON.stringify({
        url: elements.urlInput.value.trim(),
        scope: elements.scopeSelect.value
      })
    });
    renderMetadata(metadata);
    showMessage(t("metadataLoaded"));
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    state.isInspecting = false;
    syncRequestButtons();
  }
}

async function startDownload() {
  if (state.isStartingDownload || state.isInspecting) {
    return;
  }

  clearMessage();
  state.isStartingDownload = true;
  syncRequestButtons();

  try {
    if (!state.metadata) {
      await inspectUrl({ allowWhileStarting: true });
      if (!state.metadata) {
        return;
      }
    }

    const job = await requestJson("/api/downloads", {
      method: "POST",
      body: JSON.stringify({
        url: elements.urlInput.value.trim(),
        scope: elements.scopeSelect.value,
        mode: getSelectedMode(),
        audioQuality: elements.audioQuality.value
      })
    });
    upsertJob(job);
    showMessage(t("downloadQueued"));
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    state.isStartingDownload = false;
    syncRequestButtons();
  }
}

elements.probeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await inspectUrl();
});

elements.downloadButton.addEventListener("click", async () => {
  await startDownload();
});

elements.clearButton.addEventListener("click", () => {
  elements.urlInput.value = "";
  elements.scopeSelect.value = "auto";
  renderMetadata(null);
  state.metadata = null;
  clearMessage();
});

elements.refreshButton.addEventListener("click", async () => {
  clearMessage();
  try {
    await loadDownloads();
    showMessage(t("downloadsRefreshed"));
  } catch (error) {
    showMessage(error.message, true);
  }
});

elements.downloadsList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const article = button.closest("[data-job-id]");
  const jobId = article?.dataset.jobId;
  if (!jobId) {
    return;
  }

  if (button.dataset.action === "cancel") {
    await cancelDownload(jobId);
    return;
  }

  if (button.dataset.action === "remove") {
    await removeDownload(jobId);
  }
});

elements.openModalButton.addEventListener("click", openCookieModal);
elements.dismissModalButton.addEventListener("click", closeCookieModal);
elements.cookieFileTrigger.addEventListener("click", () => {
  elements.cookieFile.click();
});

elements.localeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLocale(button.dataset.locale);
  });
});

elements.themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyTheme(button.dataset.theme);
  });
});

document.querySelectorAll('.toggle-btn input[name="mode"]').forEach((input) => {
  input.addEventListener("change", () => {
    document.querySelectorAll(".toggle-btn").forEach((label) => {
      label.classList.toggle("active", label.querySelector("input")?.checked);
    });
    updateAudioQualityVisibility();
  });
});

elements.cookieFile.addEventListener("change", () => {
  const file = elements.cookieFile.files?.[0];
  elements.cookieFileName.textContent = file ? file.name : t("cookieFileEmpty");
});

elements.uploadCookiesButton.addEventListener("click", async () => {
  const file = elements.cookieFile.files?.[0];
  if (!file) {
    showMessage(t("cookieSelectFirst"), true);
    return;
  }

  try {
    const content = await file.text();
    await requestJson("/api/cookies", {
      method: "PUT",
      body: JSON.stringify({ content })
    });
    await loadCookieStatus();
    showMessage(t("cookieSaved"));
    elements.cookieFile.value = "";
    elements.cookieFileName.textContent = t("cookieFileEmpty");
  } catch (error) {
    showMessage(error.message, true);
  }
});

elements.deleteCookiesButton.addEventListener("click", async () => {
  try {
    await requestJson("/api/cookies", { method: "DELETE" });
    await loadCookieStatus();
    showMessage(t("cookieRemoved"));
  } catch (error) {
    showMessage(error.message, true);
  }
});

applyTheme(state.theme);
applyStaticTranslations();
updateAudioQualityVisibility();
syncRequestButtons();
renderDownloads();

loadDownloads().catch((error) => {
  showMessage(error.message, true);
});

loadCookieStatus().catch((error) => {
  renderCookieStatus(null, error.message);
});

state.downloadsPolling = window.setInterval(() => {
  loadDownloads().catch(() => {});
}, POLL_INTERVAL_MS);

window.setInterval(() => {
  renderDownloads();
}, EXPIRY_INTERVAL_MS);
