const fsp = require('node:fs/promises');
const path = require('node:path');
const { maxConcurrentDownloads, downloadsDir } = require('./config');
const { upsertJob, deleteJob } = require('./store');
const { runDownload } = require('./ytDlp');
const { isR2Configured, uploadDownload, uploadFile, getDownloadUrl, deleteObject } = require('./r2');

// In-memory state
const jobs = new Map();
const subscribers = new Map();
const pendingQueue = [];
const runningDownloads = new Map();
let activeDownloads = 0;

function initQueue(persistedJobs) {
  for (const job of persistedJobs) {
    jobs.set(job.id, job);
  }
}

function getMemJob(id) {
  return jobs.get(id);
}

function getActiveCount() {
  return activeDownloads;
}

function getQueueLength() {
  return pendingQueue.length;
}

function sendEvent(jobId, event, data) {
  const clients = subscribers.get(jobId);
  if (!clients || clients.size === 0) {
    return;
  }
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) {
    res.write(payload);
  }
}

function closeSubscribers(jobId) {
  const clients = subscribers.get(jobId);
  if (!clients || clients.size === 0) {
    return;
  }
  for (const res of clients) {
    res.end();
  }
  subscribers.delete(jobId);
}

function addSubscriber(jobId, res) {
  if (!subscribers.has(jobId)) {
    subscribers.set(jobId, new Set());
  }
  subscribers.get(jobId).add(res);
}

function removeSubscriber(jobId, res) {
  const clients = subscribers.get(jobId);
  if (clients) {
    clients.delete(res);
    if (clients.size === 0) {
      subscribers.delete(jobId);
    }
  }
}

function publicJob(job, baseUrl) {
  const files = Array.isArray(job.files)
    ? job.files.map((file) => ({
        name: file.name,
        relativePath: file.relativePath,
        downloadUrl: file.downloadUrl || `${baseUrl}/download-file?job=${encodeURIComponent(job.id)}&file=${encodeURIComponent(file.relativePath)}`,
        objectKey: file.objectKey || null
      }))
    : [];

  return {
    id: job.id,
    url: job.url,
    mode: job.mode,
    scope: job.scope || 'video',
    title: job.title,
    status: job.status,
    progress: job.progress,
    createdAt: job.createdAt,
    startedAt: job.startedAt || null,
    finishedAt: job.finishedAt || null,
    error: job.error || null,
    audioQuality: job.audioQuality || null,
    thumbnail: job.thumbnail || '',
    uploader: job.uploader || '',
    filename: job.filename || null,
    objectKey: job.objectKey || null,
    entryCount: job.entryCount || 0,
    files,
    downloadUrl: job.filename ? `${baseUrl}/downloads/${encodeURIComponent(job.filename)}` : (files[0]?.downloadUrl || null)
  };
}

async function persistAndBroadcast(job, baseUrl) {
  jobs.set(job.id, job);
  await upsertJob(job);
  sendEvent(job.id, 'job', publicJob(job, baseUrl || ''));
}

function sanitizeCollectionDirName(job) {
  const safeTitle = String(job.title || job.url || 'download')
    .replace(/[^\w.\- ]+/g, ' ')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 80) || 'download';
  return `${safeTitle}_${job.id}`;
}

async function listCollectionFiles(outputDir, mode) {
  const extension = mode === 'audio' ? '.mp3' : '.mp4';

  async function walk(dirPath) {
    const entries = await fsp.readdir(dirPath, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await walk(fullPath)));
        continue;
      }

      if (entry.isFile() && path.extname(entry.name).toLowerCase() === extension) {
        files.push(fullPath);
      }
    }

    return files;
  }

  try {
    const absoluteFiles = await walk(outputDir);
    return absoluteFiles
      .sort((left, right) => left.localeCompare(right))
      .map((filePath) => ({
        name: path.basename(filePath),
        relativePath: path.relative(outputDir, filePath),
        filePath
      }));
  } catch {
    return [];
  }
}

function removeFromQueue(jobId) {
  const index = pendingQueue.indexOf(jobId);
  if (index >= 0) {
    pendingQueue.splice(index, 1);
    return true;
  }
  return false;
}

function isTerminalStatus(status) {
  return status === 'finished' || status === 'failed' || status === 'cancelled';
}

async function processQueue() {
  while (activeDownloads < maxConcurrentDownloads && pendingQueue.length > 0) {
    const jobId = pendingQueue.shift();
    const job = jobs.get(jobId);
    if (!job || job.status !== 'queued') {
      continue;
    }

    activeDownloads += 1;
    job.status = 'downloading';
    job.startedAt = new Date().toISOString();
    await persistAndBroadcast(job);

    const download = runDownload(job, async (progress) => {
      if (!jobs.has(job.id) || job.status === 'cancelled') {
        return;
      }

      job.progress = {
        percent: progress.percent,
        total: progress.total,
        speed: progress.speed,
        eta: progress.eta
      };
      await persistAndBroadcast(job);
    });

    runningDownloads.set(job.id, download);

    download.promise
      .then(async ({ filename, outputDir, isCollection, scope }) => {
        if (!jobs.has(job.id) || job.status === 'cancelled') {
          return;
        }

        job.status = 'finished';
        job.scope = scope;
        job.filename = isCollection ? null : filename;
        job.finishedAt = new Date().toISOString();

        if (isCollection && outputDir) {
          const files = await listCollectionFiles(outputDir, job.mode);
          job.files = [];

          for (const file of files) {
            let downloadUrl = null;
            let objectKey = null;

            if (isR2Configured) {
              const uploaded = await uploadFile(job.id, file.name, file.filePath);
              if (uploaded) {
                objectKey = uploaded.objectKey;
                downloadUrl = await getDownloadUrl(uploaded.objectKey, uploaded.filename);
                await fsp.rm(file.filePath, { force: true }).catch(() => {});
              }
            }

            job.files.push({
              name: file.name,
              relativePath: file.relativePath,
              objectKey,
              downloadUrl
            });
          }

          if (isR2Configured) {
            await fsp.rm(outputDir, { recursive: true, force: true }).catch(() => {});
          }
        } else if (isR2Configured && filename) {
          const filePath = path.join(downloadsDir, filename);
          const uploaded = await uploadDownload(job, filePath);
          if (uploaded) {
            job.filename = uploaded.filename;
            job.objectKey = uploaded.objectKey;
            await fsp.rm(filePath, { force: true }).catch(() => {});
          }
          job.files = job.filename
            ? [{
                name: job.filename,
                relativePath: job.filename,
                objectKey: job.objectKey || null,
                downloadUrl: job.objectKey ? await getDownloadUrl(job.objectKey, job.filename) : null
              }]
            : [];
        } else if (filename) {
          job.files = [{
            name: filename,
            relativePath: filename,
            objectKey: null,
            downloadUrl: null
          }];
        }

        job.progress = {
          percent: 100,
          total: job.progress?.total || null,
          speed: null,
          eta: null
        };
        await persistAndBroadcast(job);
      })
      .catch(async (error) => {
        if (!jobs.has(job.id)) {
          return;
        }

        job.status = error.code === 'DOWNLOAD_CANCELLED' ? 'cancelled' : 'failed';
        job.error = error.message;
        job.finishedAt = new Date().toISOString();
        job.progress = {
          percent: job.progress?.percent || 0,
          total: job.progress?.total || null,
          speed: null,
          eta: null
        };
        await persistAndBroadcast(job);
      })
      .finally(() => {
        runningDownloads.delete(job.id);
        activeDownloads -= 1;
        setImmediate(() => {
          processQueue().catch((error) => {
            console.error('Queue processing failed:', error);
          });
        });
      });
  }
}

async function cancelJob(job) {
  if (!job || isTerminalStatus(job.status)) {
    return job;
  }

  if (job.status === 'queued') {
    removeFromQueue(job.id);
    job.status = 'cancelled';
    job.error = null;
    job.finishedAt = new Date().toISOString();
    job.progress = {
      percent: job.progress?.percent || 0,
      total: job.progress?.total || null,
      speed: null,
      eta: null
    };
    await persistAndBroadcast(job);
    return job;
  }

  if (job.status === 'downloading') {
    const controller = runningDownloads.get(job.id);
    if (controller) {
      controller.cancel();
    } else {
      job.status = 'cancelled';
      job.error = null;
      job.finishedAt = new Date().toISOString();
      await persistAndBroadcast(job);
    }
  }

  return job;
}

async function removeJobAndAssets(job) {
  await cancelJob(job);
  removeFromQueue(job.id);
  runningDownloads.delete(job.id);

  if (job.filename) {
    await fsp.rm(path.join(downloadsDir, job.filename), { force: true });
  }
  if (job.scope && job.scope !== 'video') {
    const collectionDir = path.join(downloadsDir, sanitizeCollectionDirName(job));
    await fsp.rm(collectionDir, { recursive: true, force: true }).catch(() => {});
  }
  if (Array.isArray(job.files)) {
    for (const file of job.files) {
      if (file.objectKey) {
        await deleteObject(file.objectKey).catch(() => {});
      }
    }
  }
  if (job.objectKey) {
    await deleteObject(job.objectKey).catch(() => {});
  }

  jobs.delete(job.id);
  await deleteJob(job.id);
  sendEvent(job.id, 'removed', { id: job.id });
  closeSubscribers(job.id);
}

function enqueueAndProcess(job) {
  pendingQueue.push(job.id);
  return processQueue();
}

module.exports = {
  initQueue,
  getMemJob,
  getActiveCount,
  getQueueLength,
  sendEvent,
  closeSubscribers,
  addSubscriber,
  removeSubscriber,
  persistAndBroadcast,
  publicJob,
  enqueueAndProcess,
  processQueue,
  cancelJob,
  removeJobAndAssets,
  sanitizeCollectionDirName,
  listCollectionFiles
};
