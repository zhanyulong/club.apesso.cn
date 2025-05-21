const cloudStorage = require('../services/cloud-storage');
const { GCP_STORAGE_BUCKET_ID } = require('./config');

const deleteImage = async (fileName, bucketName) => {
  // Gracefully handle missing GCP configuration in development
  if (!GCP_STORAGE_BUCKET_ID || !bucketName) {
    console.warn(
      'Google Cloud Storage not configured, skipping image deletion'
    );
    return;
  }

  try {
    await cloudStorage.bucket(bucketName).file(fileName).delete();
  } catch (error) {
    console.warn(`Failed to delete image ${fileName}:`, error.message);
  }
};

module.exports = { deleteImage };
