// utils/s3.js
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
dotenv.config();

// create a v3 S3Client
export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const upload = multer({
  storage: multerS3({
    s3, // <— now a v3 client
    bucket: process.env.S3_BUCKET,
    //acl: "public-read",
    key: (_req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
});
