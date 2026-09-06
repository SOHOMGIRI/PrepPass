import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * Upload a file buffer to AWS S3.
 * Returns the public URL of the uploaded object.
 *
 * This function is designed to be non-blocking and non-breaking:
 * if AWS env vars are missing, it silently returns null so the
 * rest of the application continues working normally.
 */

const isConfigured = () =>
  process.env.AWS_REGION &&
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_S3_BUCKET_NAME;

let s3Client = null;

const getClient = () => {
  if (!s3Client && isConfigured()) {
    s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
};

/**
 * @param {Buffer} buffer   - The file buffer (from multer memoryStorage)
 * @param {string} fileName - Original file name (e.g. "resume.pdf")
 * @param {string} mimeType - MIME type (e.g. "application/pdf")
 * @param {string} userId   - MongoDB user ID for folder organization
 * @returns {string|null}   - Public S3 URL or null if upload was skipped/failed
 */
export const uploadToS3 = async (buffer, fileName, mimeType, userId) => {
  const client = getClient();
  if (!client) return null;

  const bucket = process.env.AWS_S3_BUCKET_NAME;
  const timestamp = Date.now();
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `resumes/${userId}/${timestamp}-${sanitizedName}`;

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      })
    );

    const fileUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    console.log(`[S3] Uploaded: ${fileUrl}`);
    return fileUrl;
  } catch (err) {
    // Log but do NOT throw — S3 failure should never break the core feature
    console.error("[S3] Upload failed (non-fatal):", err.message);
    return null;
  }
};
