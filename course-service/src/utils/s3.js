import crypto from "crypto";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION;
const bucket = process.env.S3_BUCKET;

export const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const publicUrlForKey = (key) =>
  `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(key)}`;

/** Safely extract the object key from a virtual-hosted S3 URL */
export function keyFromUrl(url) {
  try {
    const u = new URL(url);
    // "/courses/123/169..-abcd.mp4" -> "courses/123/169..-abcd.mp4"
    return decodeURIComponent(u.pathname.replace(/^\/+/, ""));
  } catch {
    return null;
  }
}

/** Upload from buffer and return { key, url } */
export async function putObjectFromBuffer({
  buffer,
  contentType,
  keyPrefix = "courses",
  userId,
}) {
  const ext = (contentType.split("/")[1] || "bin").toLowerCase();
  const rnd = crypto.randomBytes(8).toString("hex");
  const key = `${keyPrefix}/${userId}/${Date.now()}-${rnd}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return { key, url: publicUrlForKey(key) };
}

export async function deleteObjectByKey(key) {
  if (!key) return;
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

/** Delete by key if provided; else try to derive key from URL */
export async function deleteByKeyOrUrl({ key, url }) {
  try {
    const finalKey = key || keyFromUrl(url);
    if (finalKey) {
      await deleteObjectByKey(finalKey);
    }
  } catch {
    // swallow — best-effort cleanup
  }
}
