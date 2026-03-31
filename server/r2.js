const fs = require('node:fs');
const path = require('node:path');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const {
  r2AccountId,
  r2Bucket,
  r2AccessKeyId,
  r2SecretAccessKey,
  r2Region,
  r2PublicBaseUrl
} = require('./config');

const isConfigured = Boolean(r2AccountId && r2Bucket && r2AccessKeyId && r2SecretAccessKey);

const client = isConfigured
  ? new S3Client({
      region: r2Region,
      endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: r2AccessKeyId,
        secretAccessKey: r2SecretAccessKey
      }
    })
  : null;

function safeDownloadName(value) {
  return String(value || 'download')
    .replace(/[^\w.\- ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180) || 'download';
}

function getObjectKey(jobId, filename) {
  return `${jobId}/${safeDownloadName(path.basename(filename))}`;
}

async function uploadFile(jobId, filename, filePath) {
  if (!isConfigured || !client || !filename) {
    return null;
  }

  const safeName = safeDownloadName(filename);
  const objectKey = getObjectKey(jobId, safeName);

  await client.send(
    new PutObjectCommand({
      Bucket: r2Bucket,
      Key: objectKey,
      Body: fs.createReadStream(filePath),
      ContentType: safeName.toLowerCase().endsWith('.mp3') ? 'audio/mpeg' : 'video/mp4',
      ContentDisposition: `attachment; filename="${safeName}"`
    })
  );

  return {
    objectKey,
    filename: safeName
  };
}

async function uploadDownload(job, filePath) {
  if (!job?.filename) {
    return null;
  }
  return uploadFile(job.id, job.filename, filePath);
}

async function getDownloadUrl(jobOrObject, overrideFilename = '') {
  const objectKey = typeof jobOrObject === 'string' ? jobOrObject : jobOrObject?.objectKey;
  const filename = typeof jobOrObject === 'string'
    ? overrideFilename
    : (jobOrObject?.filename || overrideFilename);

  if (!objectKey || !isConfigured || !client) {
    return null;
  }

  if (r2PublicBaseUrl) {
    return `${r2PublicBaseUrl.replace(/\/$/, '')}/${encodeURIComponent(objectKey)}`;
  }

  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: r2Bucket,
      Key: objectKey,
      ResponseContentDisposition: `attachment; filename="${safeDownloadName(filename || 'download')}"`
    }),
    { expiresIn: 900 }
  );
}

async function deleteObject(objectKey) {
  if (!objectKey || !isConfigured || !client) {
    return;
  }

  await client.send(
    new DeleteObjectCommand({
      Bucket: r2Bucket,
      Key: objectKey
    })
  );
}

module.exports = {
  isR2Configured: isConfigured,
  safeDownloadName,
  uploadFile,
  uploadDownload,
  getDownloadUrl,
  deleteObject
};
