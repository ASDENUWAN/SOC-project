import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/roles.js";
import { uploadToS3, s3Push } from "../middleware/upload.middleware.js";
import {
  // public
  publicList,
  publicGet,

  // creator/admin
  myCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  submitCourse,

  // admin
  listAllForAdmin,
  listPending,
  setStatus,

  // sections
  listCourseSections,
  addSection,
  updateSection,
  deleteSection,
} from "../controllers/course.controller.js";

const router = Router();

/* ----- Public (students) ----- */
router.get("/public/courses", publicList);
router.get("/public/courses/:id", publicGet);

/* ----- Protected ----- */
router.use(protect);

// creator/admin
router.get("/me/courses", authorize("creator", "admin"), myCourses);
router.get("/courses/:id", getCourse);
router.post("/courses", authorize("creator", "admin"), createCourse);
router.put("/courses/:id", authorize("creator", "admin"), updateCourse);
router.delete("/courses/:id", authorize("creator", "admin"), deleteCourse);
router.put("/courses/:id/submit", authorize("creator", "admin"), submitCourse);

// admin moderation
router.get("/admin/courses", authorize("admin"), listAllForAdmin);
router.get("/admin/courses/pending", authorize("admin"), listPending);
router.put("/admin/courses/:id/status", authorize("admin"), setStatus);

// sections
router.get(
  "/courses/:id/sections",
  authorize("creator", "admin"),
  listCourseSections
);
router.post(
  "/courses/:id/sections",
  authorize("creator", "admin"),
  uploadToS3,
  s3Push, // ← attach key + url
  addSection
);
router.put(
  "/sections/:id",
  authorize("creator", "admin"),
  uploadToS3,
  s3Push, // ← attach key + url
  updateSection
);
router.delete("/sections/:id", authorize("creator", "admin"), deleteSection);

export default router;
