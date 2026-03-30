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

const DOWNLOAD_RETENTION_MS = 24 * 60 * 60 * 1000;

function readNumericString(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const match = value.replace(",", ".").match(/-?\d+(\.\d+)?/);
  if (!match) return null;
  return Number.parseFloat(match[0]);
}

document.addEventListener("alpine:init", () => {
  Alpine.data("app", () => ({
    locale: navigator.language?.toLowerCase().startsWith("de") ? "de" : "en",
    theme: window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    url: "",
    mode: "video",
    scope: "auto",
    audioQuality: "192K",
    metadata: null,
    jobs: [],
    cookieStatus: null,
    showCookieModal: false,
    message: "",
    messageError: false,
    isLoading: false,
    cookieFileContent: "",
    cookieFileName: "",
    _eventSources: null,

    init() {
      this._eventSources = new Map();
      this.applyTheme(this.theme);
      this.loadDownloads().catch(() => {});
      this.loadCookieStatus().catch(() => {});
      setInterval(() => {
        this.loadDownloads().catch(() => {});
      }, 15000);
    },

    t(key, vars = {}) {
      const table = LOCALES[this.locale] || LOCALES.en;
      const fallback = LOCALES.en[key] || key;
      const template = table[key] || fallback;
      return template.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
    },

    applyTheme(t) {
      this.theme = t === "dark" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", this.theme === "dark");
      document.documentElement.setAttribute("data-theme", this.theme);
    },

    setTheme(t) {
      this.applyTheme(t);
    },

    setLocale(l) {
      if (LOCALES[l]) this.locale = l;
    },

    getBaseUrl() {
      return window.location.origin;
    },

    async _request(url, options = {}) {
      const headers = {
        "X-App-Locale": this.locale,
        ...(options.headers || {})
      };
      if (options.body && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
      const res = await fetch(url, { ...options, headers });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || this.t("requestFailed"));
      return payload;
    },

    showMsg(text, isError = false) {
      this.message = text;
      this.messageError = isError;
    },

    clearMsg() {
      this.message = "";
      this.messageError = false;
    },

    // Cookie management
    async loadCookieStatus() {
      try {
        this.cookieStatus = await this._request("/api/cookies");
      } catch (err) {
        this.cookieStatus = null;
      }
    },

    handleCookieFile(e) {
      const file = e.target.files?.[0];
      if (file) {
        this.cookieFileName = file.name;
        const reader = new FileReader();
        reader.onload = (ev) => { this.cookieFileContent = ev.target.result; };
        reader.readAsText(file);
      } else {
        this.cookieFileName = "";
        this.cookieFileContent = "";
      }
    },

    async uploadCookies() {
      if (!this.cookieFileContent) {
        this.showMsg(this.t("cookieSelectFirst"), true);
        return;
      }
      try {
        await this._request("/api/cookies", {
          method: "PUT",
          body: JSON.stringify({ content: this.cookieFileContent })
        });
        await this.loadCookieStatus();
        this.showMsg(this.t("cookieSaved"));
        this.cookieFileContent = "";
        this.cookieFileName = "";
        this.showCookieModal = false;
      } catch (err) {
        this.showMsg(err.message, true);
      }
    },

    async deleteCookies() {
      try {
        await this._request("/api/cookies", { method: "DELETE" });
        await this.loadCookieStatus();
        this.showMsg(this.t("cookieRemoved"));
      } catch (err) {
        this.showMsg(err.message, true);
      }
    },

    get cookieStatusText() {
      const s = this.cookieStatus;
      if (!s) return this.t("cookieNoSessionInfo");
      if (s.source === "session-file" && s.configured) {
        return this.t("cookiePrivateActive", { time: this.formatDateTime(s.updatedAt) });
      }
      if (s.source === "browser-profile") {
        return this.t("cookieFallbackActive", { browser: s.browserSource || "" });
      }
      return this.t("cookieMissing");
    },

    get cookiePillText() {
      const s = this.cookieStatus;
      if (!s) return this.t("cookieLoading");
      if (s.source === "session-file" && s.configured) return this.t("cookiePrivatePill");
      if (s.source === "browser-profile") return this.t("cookieFallbackPill");
      return this.t("cookieMissingPill");
    },

    get cookiePillClass() {
      const s = this.cookieStatus;
      if (!s) return "pill pill-inactive";
      if (s.source === "session-file" && s.configured) return "pill pill-active";
      if (s.source === "browser-profile") return "pill pill-fallback";
      return "pill pill-inactive";
    },

    // URL inspection and download
    async inspectUrl() {
      this.clearMsg();
      this.metadata = null;
      this.isLoading = true;
      try {
        this.showMsg(this.t("metadataLoading"));
        this.metadata = await this._request("/api/probe", {
          method: "POST",
          body: JSON.stringify({ url: this.url.trim(), scope: this.scope })
        });
        this.showMsg(this.t("metadataLoaded"));
      } catch (err) {
        this.showMsg(err.message, true);
      } finally {
        this.isLoading = false;
      }
    },

    async startDownload() {
      this.clearMsg();
      if (!this.metadata) {
        await this.inspectUrl();
        if (!this.metadata) return;
      }
      this.isLoading = true;
      try {
        const job = await this._request("/api/downloads", {
          method: "POST",
          body: JSON.stringify({
            url: this.url.trim(),
            scope: this.scope,
            mode: this.mode,
            audioQuality: this.audioQuality
          })
        });
        this.upsertJob(job);
        this.showMsg(this.t("downloadQueued"));
      } catch (err) {
        this.showMsg(err.message, true);
      } finally {
        this.isLoading = false;
      }
    },

    resetForm() {
      this.url = "";
      this.scope = "auto";
      this.metadata = null;
      this.clearMsg();
    },

    // Downloads list
    async loadDownloads() {
      try {
        const jobs = await this._request("/api/downloads");
        const nextIds = new Set(jobs.map((j) => j.id));

        // Close stale event sources
        for (const [id, src] of this._eventSources.entries()) {
          if (!nextIds.has(id)) {
            src.close();
            this._eventSources.delete(id);
          }
        }

        this.jobs = jobs;
        for (const job of jobs) {
          if (this.isActive(job)) this.subscribeToJob(job.id);
        }
      } catch {
        // silently fail on polling
      }
    },

    upsertJob(job) {
      const idx = this.jobs.findIndex((j) => j.id === job.id);
      if (idx >= 0) {
        this.jobs.splice(idx, 1, job);
      } else {
        this.jobs.unshift(job);
      }
      if (this.isActive(job)) {
        this.subscribeToJob(job.id);
      } else if (this._eventSources.has(job.id)) {
        this._eventSources.get(job.id)?.close();
        this._eventSources.delete(job.id);
      }
    },

    subscribeToJob(id) {
      if (this._eventSources.has(id)) return;
      const source = new EventSource(`/api/downloads/${id}/events`);

      source.addEventListener("job", (e) => {
        const payload = JSON.parse(e.data);
        const idx = this.jobs.findIndex((j) => j.id === payload.id);
        if (idx >= 0) {
          this.jobs.splice(idx, 1, payload);
        } else {
          this.jobs.unshift(payload);
        }
        if (["finished", "failed", "cancelled"].includes(payload.status)) {
          source.close();
          this._eventSources.delete(id);
        }
      });

      source.addEventListener("removed", (e) => {
        const payload = JSON.parse(e.data);
        this.jobs = this.jobs.filter((j) => j.id !== payload.id);
        source.close();
        this._eventSources.delete(id);
      });

      source.onerror = () => {
        source.close();
        this._eventSources.delete(id);
        setTimeout(() => {
          const current = this.jobs.find((j) => j.id === id);
          if (current && this.isActive(current)) {
            this.subscribeToJob(id);
          }
        }, 1500);
      };

      this._eventSources.set(id, source);
    },

    async cancelDownload(id) {
      try {
        const job = await this._request(`/api/downloads/${id}/cancel`, { method: "POST" });
        this.upsertJob(job);
        this.showMsg(this.t("stopMessage"));
      } catch (err) {
        this.showMsg(err.message, true);
      }
    },

    async removeDownload(id) {
      try {
        await this._request(`/api/downloads/${id}`, { method: "DELETE" });
        this.jobs = this.jobs.filter((j) => j.id !== id);
        this._eventSources.get(id)?.close();
        this._eventSources.delete(id);
        this.showMsg(this.t("removeMessage"));
      } catch (err) {
        this.showMsg(err.message, true);
      }
    },

    // Computed getters
    get sortedJobs() {
      return [...this.jobs].sort((a, b) => {
        const ta = new Date(b.createdAt || 0).getTime();
        const tb = new Date(a.createdAt || 0).getTime();
        return ta - tb;
      });
    },

    get statTotal() {
      return this.jobs.length;
    },

    get statSizeMiB() {
      return this.jobs.reduce((sum, j) => sum + this.jobSizeMiB(j), 0).toFixed(2);
    },

    get statSpeed() {
      return this.jobs.reduce((sum, j) => sum + this.jobSpeedKiB(j), 0).toFixed(2);
    },

    get statEta() {
      return this.jobs.map((j) => this.jobEta(j)).find((e) => e && e !== "--") || "--";
    },

    get mp3Count() {
      return this.jobs.filter((j) => this.jobMode(j) === "audio").length;
    },

    get mp4Count() {
      return this.jobs.filter((j) => this.jobMode(j) === "video").length;
    },

    get mp3Pct() {
      return this.jobs.length ? Math.round((this.mp3Count / this.jobs.length) * 100) : 0;
    },

    get mp4Pct() {
      return this.jobs.length ? Math.round((this.mp4Count / this.jobs.length) * 100) : 0;
    },

    get statTotalBarWidth() {
      return Math.min(this.jobs.length * 12, 100) + "%";
    },

    get statSizeBarWidth() {
      return Math.min(parseFloat(this.statSizeMiB), 100) + "%";
    },

    get statSpeedBarWidth() {
      return Math.min(parseFloat(this.statSpeed) / 10, 100) + "%";
    },

    get statEtaBarWidth() {
      return (this.statEta && this.statEta !== "--") ? "38%" : "0%";
    },

    // Per-job helpers
    jobStatus(job) {
      if (job.status === "done" || job.status === "finished") return "finished";
      if (job.status === "running" || job.status === "downloading") return "downloading";
      if (job.status === "error" || job.status === "failed") return "failed";
      if (job.status === "cancelled") return "cancelled";
      return "queued";
    },

    jobMode(job) {
      if (job.mode === "audio" || job.format === "mp3" || job.format === "MP3") return "audio";
      return "video";
    },

    jobPercent(job) {
      if (typeof job.progress === "number") return Math.max(0, Math.min(job.progress, 100));
      if (typeof job.progress?.percent === "number") return Math.max(0, Math.min(job.progress.percent, 100));
      return 0;
    },

    jobSizeMiB(job) {
      return readNumericString(job.sizeMiB) ?? readNumericString(job.size_mib) ?? readNumericString(job.progress?.total) ?? 0;
    },

    jobSpeedKiB(job) {
      return readNumericString(job.speedKib) ?? readNumericString(job.speed_kib) ?? readNumericString(job.progress?.speed) ?? 0;
    },

    jobEta(job) {
      return job.eta || job.progress?.eta || "--";
    },

    statusText(job) {
      const s = this.jobStatus(job);
      if (s === "finished") return this.t("statusFinished");
      if (s === "cancelled") return this.t("statusCancelled");
      if (s === "failed") return this.t("statusFailed");
      if (s === "downloading") return this.t("statusDownloading");
      return this.t("statusQueued");
    },

    progressText(job) {
      const s = this.jobStatus(job);
      if (s === "finished") return this.t("progressFinished");
      if (s === "cancelled") return this.t("progressCancelled");
      if (s === "failed") return this.t("progressFailed");

      const parts = [];
      const pct = this.jobPercent(job);
      if (pct > 0) parts.push(`${pct.toFixed(1)}%`);
      const size = this.jobSizeMiB(job);
      if (size > 0) parts.push(`${size.toFixed(2)} MiB`);
      const speed = this.jobSpeedKiB(job);
      if (speed > 0) parts.push(`${speed.toFixed(2)} KiB/s`);
      const eta = this.jobEta(job);
      if (eta && eta !== "--") parts.push(`ETA ${eta}`);
      return parts.join(" · ") || this.t("progressWaiting");
    },

    badgeClass(job) {
      const s = this.jobStatus(job);
      if (s === "finished") return "badge badge-done";
      if (s === "failed") return "badge badge-error";
      if (s === "cancelled") return "badge badge-neutral";
      return "badge badge-running";
    },

    progressClass(job) {
      const s = this.jobStatus(job);
      if (s === "finished") return "prog-fill done";
      if (s === "failed") return "prog-fill error";
      if (s === "downloading") return "prog-fill running";
      return "prog-fill";
    },

    jobTag(job) {
      const mode = this.jobMode(job);
      const uploader = job.uploader || this.t("unknownCreator");
      return `${mode === "audio" ? "MP3 AUDIO" : "MP4 VIDEO"} · ${uploader}`;
    },

    isActive(job) {
      const s = this.jobStatus(job);
      return s === "queued" || s === "downloading";
    },

    isFinished(job) {
      return this.jobStatus(job) === "finished";
    },

    getDownloadLink(job) {
      if (job.filename) return `/downloads/${encodeURIComponent(job.filename)}`;
      if (job.downloadUrl) return job.downloadUrl;
      return "";
    },

    fileDownloadUrl(job, file) {
      if (file.downloadUrl) return file.downloadUrl;
      return `/download-file?job=${encodeURIComponent(job.id)}&file=${encodeURIComponent(file.relativePath || file.name)}`;
    },

    expiryLabel(job) {
      const createdAt = job.createdAt;
      if (!createdAt) return "";
      const createdMs = new Date(createdAt).getTime();
      if (!Number.isFinite(createdMs)) return "";
      const expiresMs = createdMs + DOWNLOAD_RETENTION_MS;
      const remainingMs = expiresMs - Date.now();
      if (remainingMs <= 0) return this.t("expiryExpired");
      if (remainingMs < DOWNLOAD_RETENTION_MS) return this.t("expiryUrgent");
      return "";
    },

    expiryUrgent(job) {
      const createdAt = job.createdAt;
      if (!createdAt) return false;
      const createdMs = new Date(createdAt).getTime();
      if (!Number.isFinite(createdMs)) return false;
      const expiresMs = createdMs + DOWNLOAD_RETENTION_MS;
      return (expiresMs - Date.now()) < DOWNLOAD_RETENTION_MS;
    },

    formatDuration(s) {
      if (!s && s !== 0) return this.t("unknownDuration");
      const total = Number(s);
      if (!Number.isFinite(total)) return this.t("unknownDuration");
      const hours = Math.floor(total / 3600);
      const minutes = Math.floor((total % 3600) / 60);
      const secs = Math.floor(total % 60);
      return [hours, minutes, secs]
        .filter((v, i) => v > 0 || i > 0)
        .map((v) => String(v).padStart(2, "0"))
        .join(":");
    },

    formatDateTime(v) {
      return new Date(v).toLocaleString(this.locale);
    },

    metaLine(m) {
      if (!m) return "";
      const parts = [
        m.uploader || this.t("unknownCreator"),
        m.isCollection
          ? this.t("metadataCollectionLoaded", {
              scope: m.scope === "channel" ? this.t("scopeChannel") : this.t("scopePlaylist"),
              count: m.entryCount || 0
            })
          : this.formatDuration(m.duration),
        m.extractor || null
      ].filter(Boolean);
      return parts.join(" · ");
    }
  }));
});
