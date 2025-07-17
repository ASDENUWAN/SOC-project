import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../config/s3.js";

export const uploadProfilePic = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    acl: "public-read",
    metadata: (req, file, cb) => cb(null, { fieldName: "PROFILE_PIC" }),
    key: (req, file, cb) => {
      const ext = file.originalname.split(".").pop();
      cb(null, `profiles/${req.user.id}_${Date.now()}.${ext}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images allowed"), false);
    }
    cb(null, true);
  },
});
