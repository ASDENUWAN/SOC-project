import { Router } from "express";
import { upload } from "../utils/s3.js";
import {
  getProfile,
  updateProfile,
  listUsers,
  approveCreator,
  deleteUser,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/roles.js";

const router = Router();

router.use(protect);

// Student/Creator/Admin can view & edit THEIR profile
router.get("/profile", getProfile);
router.put(
  "/profile",
  upload.single("profilePic"), // ← must match your form‑data key
  updateProfile
);

// Admin only
router.get("/users", authorize("admin"), listUsers);
router.put("/users/:id/approve", authorize("admin"), approveCreator);
router.delete("/users/:id", authorize("admin"), deleteUser);

export default router;
