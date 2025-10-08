import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/roles.js";
import {
  enroll,
  unenroll,
  getMyEnrollment,
  listMyEnrollments,
  toggleSectionDone,
  creatorLearners,
  creatorInsights,
} from "../controllers/enrollment.controller.js";

const router = Router();

router.use(protect);

// student
router.post("/enroll", authorize("student"), enroll);
router.delete("/enroll/:courseId", authorize("student"), unenroll);
router.get("/me/:courseId", authorize("student"), getMyEnrollment);
router.get("/me", authorize("student"), listMyEnrollments);
router.post(
  "/me/:courseId/sections/:sectionId/toggle",
  authorize("student"),
  toggleSectionDone
);

// creator analytics
router.get(
  "/creator/:courseId/learners",
  authorize("creator", "admin"),
  creatorLearners
);
router.get("/creator/insights", authorize("creator", "admin"), creatorInsights);

export default router;
