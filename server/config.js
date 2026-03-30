require('dotenv').config();

const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const secretsDir = path.join(rootDir, 'secrets');
const sessionSecretsDir = path.join(secretsDir, 'sessions');

function positiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

module.exports = {
  rootDir,
  publicDir: path.join(rootDir, 'public'),
  downloadsDir: path.join(dataDir, 'downloads'),
  tempDir: path.join(dataDir, 'tmp'),
  secretsDir,
  sessionSecretsDir,
  jobsFile: path.join(dataDir, 'jobs.json'),
  port: positiveInt(process.env.PORT, 8080),
  host: process.env.HOST || '0.0.0.0',
  appBaseUrl: process.env.APP_BASE_URL || '',
  ytDlpBin: process.env.YTDLP_BIN || 'yt-dlp',
  ffmpegBin: process.env.FFMPEG_BIN || 'ffmpeg',
  ytDlpCookiesFile: process.env.YTDLP_COOKIES_FILE || path.join(secretsDir, 'youtube-cookies.txt'),
  ytDlpCookiesFromBrowser: process.env.YTDLP_COOKIES_FROM_BROWSER || '',
  maxConcurrentDownloads: positiveInt(process.env.MAX_CONCURRENT_DOWNLOADS, 2),
  maxUrlLength: positiveInt(process.env.MAX_URL_LENGTH, 2048),
  retentionHours: positiveInt(process.env.DOWNLOADS_RETENTION_HOURS, 24),
  r2AccountId: process.env.R2_ACCOUNT_ID || '',
  r2Bucket: process.env.R2_BUCKET || '',
  r2AccessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  r2Region: process.env.R2_REGION || 'auto',
  r2PublicBaseUrl: process.env.R2_PUBLIC_BASE_URL || ''
};
