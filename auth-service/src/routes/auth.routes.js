import { Router } from "express";
import { register, signin, logout } from "../controllers/auth.controller.js";

const router = Router();
router.post("/register", register);
router.post("/login", signin);
router.post("/logout", logout);
export default router;
