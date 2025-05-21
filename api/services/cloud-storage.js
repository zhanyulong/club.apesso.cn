const { Storage } = require('@google-cloud/storage');

const { GCP_PROJECT_ID, GCP_SERVICE_ACCOUNT_KEY } = require('../utils/config');

let storage;

try {
  if (GCP_SERVICE_ACCOUNT_KEY && GCP_PROJECT_ID) {
    storage = new Storage({
      credentials: JSON.parse(GCP_SERVICE_ACCOUNT_KEY),
      projectId: GCP_PROJECT_ID,
    });
  } else {
    console.warn(
      'Google Cloud Storage credentials not configured, creating mock storage'
    );
    storage = {
      bucket: () => ({
        file: () => ({
          createWriteStream: () => ({
            on: () => ({ on: () => ({ end: () => {} }) }),
            end: () => {},
          }),
          delete: () => Promise.resolve(),
        }),
      }),
    };
  }
} catch (error) {
  console.warn('Failed to initialize Google Cloud Storage:', error.message);
  storage = {
    bucket: () => ({
      file: () => ({
        createWriteStream: () => ({
          on: () => ({ on: () => ({ end: () => {} }) }),
          end: () => {},
        }),
        delete: () => Promise.resolve(),
      }),
    }),
  };
}

module.exports = storage;
