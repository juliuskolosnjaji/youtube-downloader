const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const {
  downloadsDir,
  tempDir,
  secretsDir,
  sessionSecretsDir,
  jobsFile,
  retentionHours
} = require('./config');
const { deleteObject } = require('./r2');

async function ensureDir(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true });
}

async function ensureDataLayout() {
  await ensureDir(downloadsDir);
  await ensureDir(tempDir);
  await ensureDir(secretsDir);
  await ensureDir(sessionSecretsDir);
  await ensureDir(path.dirname(jobsFile));

  for (const filePath of [
    path.join(downloadsDir, '.gitkeep'),
    path.join(tempDir, '.gitkeep')
  ]) {
    try {
      await fsp.access(filePath);
    } catch {
      await fsp.writeFile(filePath, '');
    }
  }

  try {
    await fsp.access(jobsFile);
  } catch {
    await fsp.writeFile(jobsFile, '[]\n');
  }
}

async function readJobs() {
  await ensureDataLayout();
  const raw = await fsp.readFile(jobsFile, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeJobs(jobs) {
  await ensureDataLayout();
  const serialized = JSON.stringify(jobs, null, 2);
  await fsp.writeFile(jobsFile, `${serialized}\n`);
}

async function upsertJob(job) {
  const jobs = await readJobs();
  const index = jobs.findIndex((entry) => entry.id === job.id);

  if (index >= 0) {
    jobs[index] = job;
  } else {
    jobs.unshift(job);
  }

  await writeJobs(jobs.slice(0, 250));
}

async function getJob(jobId) {
  const jobs = await readJobs();
  return jobs.find((job) => job.id === jobId) || null;
}

async function listJobs() {
  return readJobs();
}

async function deleteJob(jobId) {
  const jobs = await readJobs();
  await writeJobs(jobs.filter((job) => job.id !== jobId));
}

async function cleanupExpiredDownloads() {
  const jobs = await readJobs();
  const now = Date.now();
  const maxAgeMs = retentionHours * 60 * 60 * 1000;

  const nextJobs = [];

  for (const job of jobs) {
    const createdAt = job.finishedAt || job.createdAt;
    const fileExists = job.filename
      ? fs.existsSync(path.join(downloadsDir, job.filename))
      : false;
    const collectionDir = job.scope && job.scope !== 'video'
      ? path.join(
          downloadsDir,
          `${String(job.title || job.url || 'download')
            .replace(/[^\w.\- ]+/g, ' ')
            .trim()
            .replace(/\s+/g, '_')
            .replace(/_+/g, '_')
            .slice(0, 80) || 'download'}_${job.id}`
        )
      : null;
    const collectionExists = collectionDir ? fs.existsSync(collectionDir) : false;
    const hasRemoteFiles = Array.isArray(job.files) && job.files.some((file) => file.objectKey);

    if (
      createdAt &&
      now - new Date(createdAt).getTime() > maxAgeMs &&
      ((job.filename && fileExists) || job.objectKey || collectionExists || hasRemoteFiles)
    ) {
      if (job.filename && fileExists) {
        await fsp.rm(path.join(downloadsDir, job.filename), { force: true });
      }
      if (collectionExists) {
        await fsp.rm(collectionDir, { recursive: true, force: true });
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
      continue;
    }

    nextJobs.push(job);
  }

  if (nextJobs.length !== jobs.length) {
    await writeJobs(nextJobs);
  }
}

module.exports = {
  ensureDataLayout,
  readJobs,
  writeJobs,
  upsertJob,
  getJob,
  listJobs,
  deleteJob,
  cleanupExpiredDownloads
};
