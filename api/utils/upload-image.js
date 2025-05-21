const util = require('util');

const cloudStorage = require('../services/cloud-storage');
const { GCP_STORAGE_BUCKET_ID } = require('./config');

// Gracefully handle missing bucket configuration in development
let bucket;
try {
  if (GCP_STORAGE_BUCKET_ID) {
    bucket = cloudStorage.bucket(GCP_STORAGE_BUCKET_ID);
  }
} catch (error) {
  console.warn(
    'Google Cloud Storage not configured, image uploads will be disabled'
  );
  bucket = null;
}

const uploadImage = (file, fileName, bucketName) =>
  new Promise((resolve, reject) => {
    if (!bucket || !GCP_STORAGE_BUCKET_ID) {
      // Return a placeholder URL for development when GCS is not configured
      const placeholderUrl = `http://localhost:5000/placeholder/${fileName}`;
      console.warn(
        'Google Cloud Storage not configured, returning placeholder URL'
      );
      resolve(placeholderUrl);
      return;
    }

    const { buffer } = file;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on('finish', () => {
        const publicUrl = util.format(
          `https://storage.googleapis.com/${bucketName}/${blob.name}`
        );
        resolve(publicUrl);
      })
      .on('error', () => {
        reject(new Error('Unable to upload image, something went wrong'));
      })
      .end(buffer);
  });

module.exports = { uploadImage };
