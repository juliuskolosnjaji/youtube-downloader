const express = require('express');
const fsp = require('node:fs/promises');
const path = require('node:path');
const { sessionSecretsDir, ytDlpCookiesFromBrowser } = require('../config');
const { listJobs, getJob } = require('../store');
const { makeJobId, probeUrl, detectScope } = require('../ytDlp');
const {
  getMemJob,
  getActiveCount,
  getQueueLength,
  publicJob,
  persistAndBroadcast,
  enqueueAndProcess,
  cancelJob,
  removeJobAndAssets,
  addSubscriber,
  removeSubscriber
} = require('../queue');

const router = express.Router();

const COPY = {
  en: {
    invalidCookies: 'Please upload a Netscape-format cookies file exported for yt-dlp.',
    storeCookiesFailed: 'Failed to store cookies.',
    removeCookiesFailed: 'Failed to remove cookies.',
    invalidUrl: 'Please provide a valid http(s) URL.',
    probeFailed: 'Probe failed.',
    createDownloadFailed: 'Failed to create download.',
    downloadNotFound: 'Download not found.',
    unknownRoute: 'Unknown API route.',
    invalidFileName: 'Invalid file name',
    forbidden: 'Forbidden',
    internalServerError: 'Internal server error.',
    cancelledByUser: 'Download stopped by user.'
  },
  de: {
    invalidCookies: 'Bitte lade eine Netscape-Cookie-Datei hoch, die für yt-dlp exportiert wurde.',
    storeCookiesFailed: 'Cookies konnten nicht gespeichert werden.',
    removeCookiesFailed: 'Cookies konnten nicht entfernt werden.',
    invalidUrl: 'Bitte gib eine gültige http(s)-URL an.',
    probeFailed: 'Analyse fehlgeschlagen.',
    createDownloadFailed: 'Download konnte nicht erstellt werden.',
    downloadNotFound: 'Download nicht gefunden.',
    unknownRoute: 'Unbekannte API-Route.',
    invalidFileName: 'Ungültiger Dateiname',
    forbidden: 'Zugriff verweigert',
    internalServerError: 'Interner Serverfehler.',
    cancelledByUser: 'Download wurde vom Nutzer gestoppt.'
  }
};

function getLocale(req) {
  const explicit = String(req.headers['x-app-locale'] || '').toLowerCase();
  if (explicit.startsWith('de')) return 'de';
  if (explicit.startsWith('en')) return 'en';
  const acceptLanguage = String(req.headers['accept-language'] || '').toLowerCase();
  return acceptLanguage.startsWith('de') ? 'de' : 'en';
}

function translate(req, key) {
  const locale = getLocale(req);
  return COPY[locale]?.[key] || COPY.en[key] || key;
}

function getBaseUrl(req) {
  const { appBaseUrl, host: cfgHost, port: cfgPort } = require('../config');
  if (appBaseUrl) {
    return appBaseUrl.replace(/\/$/, '').startsWith('http')
      ? appBaseUrl.replace(/\/$/, '')
      : 'https://' + appBaseUrl.replace(/\/$/, '');
  }
  const proto = req.headers['x-forwarded-proto'] || 'http';
  const hostHeader = req.headers.host || `${cfgHost}:${cfgPort}`;
  return `${proto}://${hostHeader}`;
}

function getSessionCookiesFile(sessionId) {
  return path.join(sessionSecretsDir, sessionId, 'youtube-cookies.txt');
}

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

async function getCookieStatus(sessionId) {
  const sessionCookiesFile = getSessionCookiesFile(sessionId);
  try {
    const stat = await fsp.stat(sessionCookiesFile);
    return {
      configured: true,
      source: 'session-file',
      size: stat.size,
      updatedAt: stat.mtime.toISOString(),
      browserSource: ytDlpCookiesFromBrowser || null
    };
  } catch {
    return {
      configured: Boolean(ytDlpCookiesFromBrowser),
      source: ytDlpCookiesFromBrowser ? 'browser-profile' : 'none',
      size: 0,
      updatedAt: null,
      browserSource: ytDlpCookiesFromBrowser || null
    };
  }
}

function looksLikeNetscapeCookies(content) {
  const value = String(content || '').trim();
  return (
    value.startsWith('# Netscape HTTP Cookie File') ||
    value.split(/\r?\n/).some((line) => line && !line.startsWith('#') && line.split('\t').length >= 7)
  );
}

// GET /health
router.get('/health', (req, res) => {
  res.json({
    ok: true,
    activeDownloads: getActiveCount(),
    queuedDownloads: getQueueLength()
  });
});

// GET /cookies
router.get('/cookies', async (req, res) => {
  try {
    const status = await getCookieStatus(req.sessionId);
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message || translate(req, 'internalServerError') });
  }
});

// PUT /cookies
router.put('/cookies', async (req, res) => {
  const sessionId = req.sessionId;
  const sessionCookiesFile = getSessionCookiesFile(sessionId);
  try {
    const content = String(req.body?.content || '');
    if (!looksLikeNetscapeCookies(content)) {
      return res.status(400).json({ error: translate(req, 'invalidCookies') });
    }
    await fsp.mkdir(path.dirname(sessionCookiesFile), { recursive: true });
    await fsp.writeFile(sessionCookiesFile, content, { mode: 0o600 });
    res.json(await getCookieStatus(sessionId));
  } catch (err) {
    res.status(500).json({ error: err.message || translate(req, 'storeCookiesFailed') });
  }
});

// DELETE /cookies
router.delete('/cookies', async (req, res) => {
  const sessionId = req.sessionId;
  const sessionCookiesFile = getSessionCookiesFile(sessionId);
  try {
    await fsp.rm(sessionCookiesFile, { force: true });
    res.json(await getCookieStatus(sessionId));
  } catch (err) {
    res.status(500).json({ error: err.message || translate(req, 'removeCookiesFailed') });
  }
});

// POST /probe
router.post('/probe', async (req, res) => {
  try {
    if (!isValidHttpUrl(req.body?.url)) {
      return res.status(400).json({ error: translate(req, 'invalidUrl') });
    }
    const sessionCookiesFile = getSessionCookiesFile(req.sessionId);
    const metadata = await probeUrl(req.body.url, {
      scope: req.body.scope || 'auto',
      auth: { cookiesFile: sessionCookiesFile }
    });
    res.json(metadata);
  } catch (err) {
    res.status(500).json({ error: err.message || translate(req, 'probeFailed') });
  }
});

// POST /downloads
router.post('/downloads', async (req, res) => {
  try {
    if (!isValidHttpUrl(req.body?.url)) {
      return res.status(400).json({ error: translate(req, 'invalidUrl') });
    }

    const sessionCookiesFile = getSessionCookiesFile(req.sessionId);
    const mode = req.body.mode === 'audio' ? 'audio' : 'video';
    const scope = detectScope(req.body.url, req.body.scope || 'auto');
    const metadata = await probeUrl(req.body.url, {
      scope,
      auth: { cookiesFile: sessionCookiesFile }
    });

    const job = {
      id: makeJobId(),
      sessionId: req.sessionId,
      cookiesFile: sessionCookiesFile,
      url: req.body.url,
      mode,
      scope,
      title: metadata.title,
      uploader: metadata.uploader,
      thumbnail: metadata.thumbnail,
      entryCount: metadata.entryCount || 0,
      status: 'queued',
      progress: { percent: 0, total: null, speed: null, eta: null },
      audioQuality: mode === 'audio' ? (req.body.audioQuality || '192K') : null,
      createdAt: new Date().toISOString()
    };

    const baseUrl = getBaseUrl(req);
    await persistAndBroadcast(job, baseUrl);
    await enqueueAndProcess(job);

    res.status(202).json(publicJob(job, baseUrl));
  } catch (err) {
    res.status(500).json({ error: err.message || translate(req, 'createDownloadFailed') });
  }
});

// GET /downloads
router.get('/downloads', async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);
    const storedJobs = await listJobs();
    res.json(
      storedJobs
        .filter((job) => job.sessionId === req.sessionId)
        .map((job) => publicJob(job, baseUrl))
    );
  } catch (err) {
    res.status(500).json({ error: err.message || translate(req, 'internalServerError') });
  }
});

// GET /downloads/:id
router.get('/downloads/:id([a-f0-9]+)', async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);
    const job = getMemJob(req.params.id) || (await getJob(req.params.id));
    if (!job || job.sessionId !== req.sessionId) {
      return res.status(404).json({ error: translate(req, 'downloadNotFound') });
    }
    res.json(publicJob(job, baseUrl));
  } catch (err) {
    res.status(500).json({ error: err.message || translate(req, 'internalServerError') });
  }
});

// POST /downloads/:id/cancel
router.post('/downloads/:id([a-f0-9]+)/cancel', async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);
    const job = getMemJob(req.params.id) || (await getJob(req.params.id));
    if (!job || job.sessionId !== req.sessionId) {
      return res.status(404).json({ error: translate(req, 'downloadNotFound') });
    }
    await cancelJob(job);
    res.json(publicJob(job, baseUrl));
  } catch (err) {
    res.status(500).json({ error: err.message || translate(req, 'internalServerError') });
  }
});

// DELETE /downloads/:id
router.delete('/downloads/:id([a-f0-9]+)', async (req, res) => {
  try {
    const job = getMemJob(req.params.id) || (await getJob(req.params.id));
    if (!job || job.sessionId !== req.sessionId) {
      return res.status(404).json({ error: translate(req, 'downloadNotFound') });
    }
    await removeJobAndAssets(job);
    res.json({ ok: true, id: job.id });
  } catch (err) {
    res.status(500).json({ error: err.message || translate(req, 'internalServerError') });
  }
});

// GET /downloads/:id/events  (SSE)
router.get('/downloads/:id([a-f0-9]+)/events', async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);
    const jobId = req.params.id;
    const job = getMemJob(jobId) || (await getJob(jobId));
    if (!job || job.sessionId !== req.sessionId) {
      return res.status(404).json({ error: translate(req, 'downloadNotFound') });
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.flushHeaders();

    addSubscriber(jobId, res);
    res.write(`event: job\ndata: ${JSON.stringify(publicJob(job, baseUrl))}\n\n`);

    req.on('close', () => {
      removeSubscriber(jobId, res);
    });
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || translate(req, 'internalServerError') });
    }
  }
});

module.exports = router;
