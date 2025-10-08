import multer from "multer";
import { putObjectFromBuffer } from "../utils/s3.js";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadToS3 = upload.single("file");

/** After multer parses the file, push it to S3 and attach keys to req.file */
export async function s3Push(req, res, next) {
  try {
    if (!req.file) return next();
    const { buffer, mimetype } = req.file;

    const { key, url } = await putObjectFromBuffer({
      buffer,
      contentType: mimetype,
      keyPrefix: "courses",
      userId: req.user.id,
    });

    req.file.location = url; // public URL
    req.file.s3Key = key; // exact S3 key
    next();
  } catch (e) {
    next(e);
  }
}
