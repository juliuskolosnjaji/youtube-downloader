const express = require('express');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const { downloadsDir } = require('../config');
const { listJobs, getJob } = require('../store');
const { getMemJob, sanitizeCollectionDirName } = require('../queue');
const { isR2Configured, getDownloadUrl, safeDownloadName } = require('../r2');

const router = express.Router();

const MIME_TYPES = {
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

// GET /downloads/:filename — serve download file or redirect to R2
router.get('/downloads/:filename', async (req, res) => {
  const sessionId = req.sessionId;
  const filename = req.params.filename;

  if (!filename || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).send('Invalid file name');
  }

  // Look through persisted jobs to find owner
  const allJobs = await listJobs();
  const ownerJob = allJobs.find((job) => job.filename === filename && job.sessionId === sessionId);

  if (!ownerJob) {
    return res.status(404).send('Download not found');
  }

  if (ownerJob.objectKey && isR2Configured) {
    try {
      const signedUrl = await getDownloadUrl(ownerJob);
      if (!signedUrl) {
        return res.status(404).send('Download not found');
      }
      return res.redirect(302, signedUrl);
    } catch {
      return res.status(404).send('Download not found');
    }
  }

  const filePath = path.join(downloadsDir, filename);
  try {
    const stat = await fsp.stat(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', `attachment; filename="${safeDownloadName(path.basename(filePath))}"`);
    res.setHeader('Cache-Control', 'no-store');
    fs.createReadStream(filePath).pipe(res);
  } catch {
    res.status(404).send('Download not found');
  }
});

// GET /download-file?job=&file= — serve collection file or redirect to R2
router.get('/download-file', async (req, res) => {
  const sessionId = req.sessionId;
  const jobId = String(req.query.job || '');
  const fileParam = String(req.query.file || '');

  const job = getMemJob(jobId) || (await getJob(jobId));

  if (!job || job.sessionId !== sessionId) {
    return res.status(404).send('Download not found');
  }

  const matchingFile = Array.isArray(job.files)
    ? job.files.find((file) => file.relativePath === fileParam || file.name === fileParam)
    : null;

  if (!matchingFile) {
    return res.status(404).send('Download not found');
  }

  if (matchingFile.objectKey && isR2Configured) {
    try {
      const signedUrl = await getDownloadUrl(matchingFile.objectKey, matchingFile.name);
      if (!signedUrl) {
        return res.status(404).send('Download not found');
      }
      return res.redirect(302, signedUrl);
    } catch {
      return res.status(404).send('Download not found');
    }
  }

  const collectionDir = path.join(downloadsDir, sanitizeCollectionDirName(job));
  const filePath = path.normalize(path.join(collectionDir, matchingFile.relativePath));
  if (!filePath.startsWith(collectionDir)) {
    return res.status(403).send('Forbidden');
  }

  try {
    const stat = await fsp.stat(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', `attachment; filename="${safeDownloadName(path.basename(filePath))}"`);
    res.setHeader('Cache-Control', 'no-store');
    fs.createReadStream(filePath).pipe(res);
  } catch {
    res.status(404).send('Download not found');
  }
});

module.exports = router;
