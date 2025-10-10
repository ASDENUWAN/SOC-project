import express from "express";
import { registerStudent } from "../controllers/student.controller.js";

const router = express.Router();

// POST endpoint for student registration
router.post("/register", registerStudent);

export default router;
