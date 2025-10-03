import { Router } from "express";
import { upload } from "../utils/s3.js";
import {
  getProfile,
  updateProfile,
  deleteMyProfile,
  listUsers,
  approveCreator,
  deleteUser,
  // new
  listStudents,
  listCreatorsGrouped,
  setCreatorStatus,
  setCreatorRating,
  deleteCreator,
  listPublicCreators,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/roles.js";

const router = Router();
// Public route (no auth)
router.get("/public/creators", listPublicCreators);
// Protected routes (need auth)
router.use(protect);

// Self profile
router.get("/profile", getProfile);
router.put("/profile", upload.single("profilePic"), updateProfile);
router.delete("/profile", deleteMyProfile);

// Admin-only
router.get("/users", authorize("admin"), listUsers);
router.put("/users/:id/approve", authorize("admin"), approveCreator);
router.delete("/users/:id", authorize("admin"), deleteUser);

// Admin-only creators management
router.get("/students", authorize("admin"), listStudents);
router.get("/creators", authorize("admin"), listCreatorsGrouped);
router.put("/creators/:id/status", authorize("admin"), setCreatorStatus);
router.put("/creators/:id/rating", authorize("admin"), setCreatorRating);
router.delete("/creators/:id", authorize("admin"), deleteCreator);

export default router;
