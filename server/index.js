const express = require('express');
const crypto = require('node:crypto');
const path = require('node:path');
const { port, host, publicDir, sessionSecretsDir } = require('./config');
const { ensureDataLayout, cleanupExpiredDownloads, listJobs } = require('./store');
const { initQueue } = require('./queue');
const apiRouter = require('./routes/api');
const filesRouter = require('./routes/files');

const app = express();

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Session middleware — reads/sets kepr_session cookie
function getSessionId(req, res) {
  const header = req.headers.cookie || '';
  const cookies = Object.fromEntries(
    header.split(';').map(p => p.trim()).filter(Boolean).map(p => {
      const sep = p.indexOf('=');
      return [sep >= 0 ? p.slice(0, sep) : p, sep >= 0 ? decodeURIComponent(p.slice(sep + 1)) : ''];
    })
  );
  if (cookies.kepr_session && /^[a-f0-9]{48}$/.test(cookies.kepr_session)) return cookies.kepr_session;
  if (cookies.tubedrop_session && /^[a-f0-9]{48}$/.test(cookies.tubedrop_session)) return cookies.tubedrop_session;
  const sessionId = crypto.randomBytes(24).toString('hex');
  const secureFlag = String(req.headers['x-forwarded-proto'] || '').includes('https') ? '; Secure' : '';
  res.setHeader('Set-Cookie', `kepr_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24}${secureFlag}`);
  return sessionId;
}

app.use((req, res, next) => {
  req.sessionId = getSessionId(req, res);
  next();
});

app.use(express.json());

app.use('/api', apiRouter);
app.use('/', filesRouter);

// Static files with cache headers
app.use(express.static(publicDir, {
  setHeaders(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (['.html', '.css', '.js'].includes(ext)) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  }
}));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

async function bootstrap() {
  await ensureDataLayout();
  await cleanupExpiredDownloads();
  const jobs = await listJobs();
  initQueue(jobs);
  app.listen(port, host, () => {
    console.log(`YouTube Downloader running on http://${host}:${port}`);
  });
}

bootstrap().catch(err => { console.error(err); process.exitCode = 1; });
