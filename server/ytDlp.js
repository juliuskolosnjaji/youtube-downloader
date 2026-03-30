const { spawn } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const {
  ytDlpBin,
  ffmpegBin,
  downloadsDir,
  maxUrlLength,
  ytDlpCookiesFile,
  ytDlpCookiesFromBrowser
} = require('./config');

function safeText(value) {
  return String(value || '').replace(/[^\w.\- ]+/g, ' ').trim();
}

function sanitizeBaseName(input) {
  const cleaned = safeText(input)
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 80);
  return cleaned || 'download';
}

function detectScope(targetUrl, requestedScope = 'auto') {
  if (requestedScope === 'video' || requestedScope === 'playlist' || requestedScope === 'channel') {
    return requestedScope;
  }

  try {
    const parsed = new URL(targetUrl);
    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();

    if (parsed.searchParams.get('list')) {
      return 'playlist';
    }

    if (host.includes('youtube.com')) {
      if (pathname.startsWith('/playlist')) {
        return 'playlist';
      }

      if (
        pathname.startsWith('/channel/') ||
        pathname.startsWith('/@') ||
        pathname.startsWith('/c/') ||
        pathname.startsWith('/user/') ||
        pathname.endsWith('/videos')
      ) {
        return 'channel';
      }
    }
  } catch {
    return 'video';
  }

  return 'video';
}

function makeJobId() {
  return crypto.randomBytes(8).toString('hex');
}

function parseJson(stdout) {
  try {
    return JSON.parse(stdout);
  } catch {
    return null;
  }
}

function parseProgressLine(line) {
  if (!line.startsWith('[download]')) {
    return null;
  }

  const percentMatch = line.match(/(\d+(?:\.\d+)?)%/);
  const totalMatch = line.match(/of\s+([~\d.]+\w+i?B)/i);
  const speedMatch = line.match(/at\s+([~\d.]+\w+i?B\/s)/i);
  const etaMatch = line.match(/ETA\s+(.+)$/i);

  return {
    percent: percentMatch ? Number.parseFloat(percentMatch[1]) : null,
    total: totalMatch ? totalMatch[1] : null,
    speed: speedMatch ? speedMatch[1] : null,
    eta: etaMatch ? etaMatch[1] : null,
    raw: line
  };
}

function getAuthArgs(auth = {}) {
  const args = [];
  const sessionCookiesFile = auth.cookiesFile || '';

  if (sessionCookiesFile && fs.existsSync(sessionCookiesFile)) {
    args.push('--cookies', sessionCookiesFile);
  } else if (ytDlpCookiesFile && fs.existsSync(ytDlpCookiesFile)) {
    args.push('--cookies', ytDlpCookiesFile);
  } else if (ytDlpCookiesFromBrowser) {
    args.push('--cookies-from-browser', ytDlpCookiesFromBrowser);
  }

  return args;
}

function getFfmpegArgs() {
  if (!ffmpegBin) {
    return [];
  }

  if (fs.existsSync(ffmpegBin)) {
    const stat = fs.statSync(ffmpegBin);
    return ['--ffmpeg-location', stat.isDirectory() ? ffmpegBin : path.dirname(ffmpegBin)];
  }

  return [];
}

function runCommand(args, options = {}) {
  const child = spawn(ytDlpBin, [...getAuthArgs(options.auth), ...args], {
    cwd: options.cwd,
    env: {
      ...process.env,
      PYTHONUNBUFFERED: '1'
    }
  });

  const promise = new Promise((resolve, reject) => {
    let cancelled = false;

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      stdout += text;
      if (typeof options.onStdoutLine === 'function') {
        for (const line of text.split(/\r?\n/)) {
          if (line.trim()) {
            options.onStdoutLine(line.trim());
          }
        }
      }
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      if (typeof options.onStderrLine === 'function') {
        for (const line of chunk.toString().split(/\r?\n/)) {
          if (line.trim()) {
            options.onStderrLine(line.trim());
          }
        }
      }
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (cancelled) {
        const error = new Error('Download stopped by user.');
        error.code = 'DOWNLOAD_CANCELLED';
        reject(error);
        return;
      }

      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(stderr.trim() || stdout.trim() || `yt-dlp exited with code ${code}`));
      }
    });
  });

  if (typeof options.onSpawn === 'function') {
    options.onSpawn(child);
  }

  return {
    child,
    promise,
    cancel() {
      cancelled = true;
      if (!child.killed) {
        child.kill('SIGTERM');
        setTimeout(() => {
          if (!child.killed) {
            child.kill('SIGKILL');
          }
        }, 1500).unref?.();
      }
    }
  };
}

async function probeUrl(targetUrl, options = {}) {
  if (!targetUrl || targetUrl.length > maxUrlLength) {
    throw new Error('The provided URL is missing or too long.');
  }

  const scope = detectScope(targetUrl, options.scope);

  const args = [
    '--dump-single-json',
    '--no-warnings',
    ...(scope === 'video' ? ['--no-playlist'] : ['--flat-playlist']),
    targetUrl
  ];

  const { promise } = runCommand(args, { auth: options.auth });
  const { stdout } = await promise;
  const data = parseJson(stdout);

  if (!data) {
    throw new Error('Unable to read metadata from yt-dlp.');
  }

  const formats = Array.isArray(data.formats)
    ? data.formats
        .filter((format) => format.format_id)
        .slice(-30)
        .map((format) => ({
          formatId: format.format_id,
          ext: format.ext,
          resolution: format.resolution || `${format.width || '?'}x${format.height || '?'}`,
          fps: format.fps || null,
          audioExt: format.audio_ext || null,
          videoExt: format.video_ext || null,
          filesize: format.filesize || format.filesize_approx || null,
          note: format.format_note || format.format || ''
        }))
    : [];

  return {
    title: data.title || 'Untitled',
    uploader: data.uploader || data.channel || 'Unknown creator',
    duration: data.duration || null,
    webpageUrl: data.webpage_url || targetUrl,
    thumbnail: data.thumbnail || '',
    extractor: data.extractor || '',
    scope,
    isCollection: scope !== 'video',
    entryCount: Number(data.playlist_count || data.n_entries || (Array.isArray(data.entries) ? data.entries.length : 0)) || 0,
    formats
  };
}

function runDownload(job, onProgress) {
  const baseName = sanitizeBaseName(job.title || job.url);
  const extension = job.mode === 'audio' ? 'mp3' : 'mp4';
  const scope = detectScope(job.url, job.scope);
  const isCollection = scope !== 'video';
  const outputDir = isCollection ? path.join(downloadsDir, `${baseName}_${job.id}`) : downloadsDir;
  const filename = `${baseName}_${job.id}.${extension}`;
  const outputTemplate = isCollection
    ? path.join(outputDir, `%(title)s [%(id)s].%(ext)s`)
    : path.join(outputDir, filename);

  const args = [
    '--newline',
    '-o',
    outputTemplate
  ];

  if (!isCollection) {
    args.unshift('--no-playlist');
  }

  args.push(...getFfmpegArgs());

  if (job.mode === 'audio') {
    args.push(
      '-x',
      '--audio-format',
      'mp3',
      '--audio-quality',
      job.audioQuality || '192K'
    );
  } else {
    args.push(
      '-f',
      'bv*+ba/b[ext=mp4]/b'
    );
    args.push('--merge-output-format', 'mp4');
  }

  args.push(job.url);
  const command = runCommand(args, {
    auth: {
      cookiesFile: job.cookiesFile || ''
    },
    onStdoutLine: (line) => {
      const progress = parseProgressLine(line);
      if (progress) {
        onProgress(progress);
      }
    },
    onStderrLine: (line) => {
      const progress = parseProgressLine(line);
      if (progress) {
        onProgress(progress);
      }
    }
  });

  return {
    cancel: command.cancel,
    promise: command.promise.then(() => ({
      filename,
      filePath: isCollection ? null : outputTemplate,
      outputDir: isCollection ? outputDir : null,
      isCollection,
      scope
    }))
  };
}

module.exports = {
  safeText,
  sanitizeBaseName,
  detectScope,
  makeJobId,
  parseJson,
  parseProgressLine,
  getAuthArgs,
  getFfmpegArgs,
  runCommand,
  probeUrl,
  runDownload
};
