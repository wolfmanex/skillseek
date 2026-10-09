import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Photo storage on Cloudflare R2 (S3-compatible). Browsers upload straight to the
 * bucket with short-lived presigned URLs; photos are served from R2_PUBLIC_URL.
 * When the R2 variables are missing, photo uploads are simply hidden.
 */
const env = () => ({
  accountId: process.env.R2_ACCOUNT_ID,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  bucket: process.env.R2_BUCKET,
  publicUrl: process.env.R2_PUBLIC_URL?.replace(/\/$/, ""),
  // "eu" for buckets created with the EU jurisdiction.
  jurisdiction: process.env.R2_JURISDICTION,
});

export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
export const MAX_PHOTOS = 12;
export const PHOTO_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export function storageEnabled() {
  const e = env();
  return !!(e.accountId && e.accessKeyId && e.secretAccessKey && e.bucket && e.publicUrl);
}

let client: S3Client | undefined;
function s3() {
  const e = env();
  client ??= new S3Client({
    region: "auto",
    forcePathStyle: true,
    endpoint: `https://${e.accountId}${e.jurisdiction ? `.${e.jurisdiction}` : ""}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: e.accessKeyId!, secretAccessKey: e.secretAccessKey! },
  });
  return client;
}

export function photoUrl(key: string) {
  return `${env().publicUrl}/${key}`;
}

export async function presignUpload(key: string, contentType: string) {
  return getSignedUrl(s3(), new PutObjectCommand({ Bucket: env().bucket, Key: key, ContentType: contentType }), {
    expiresIn: 300,
  });
}

/** Size and type of an uploaded object, or null if it doesn't exist. */
export async function headObject(key: string) {
  try {
    const res = await s3().send(new HeadObjectCommand({ Bucket: env().bucket, Key: key }));
    return { size: res.ContentLength ?? 0, contentType: res.ContentType ?? "" };
  } catch {
    return null;
  }
}

export async function deleteObject(key: string) {
  try {
    await s3().send(new DeleteObjectCommand({ Bucket: env().bucket, Key: key }));
  } catch (err) {
    console.error("[storage] delete failed", key, err);
  }
}
