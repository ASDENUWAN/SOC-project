import express from "express";
import { createCourse } from "../controllers/creator.controller.js";

const router = express.Router();

// POST endpoint to create a course
router.post("/course", createCourse);

// Example GET endpoint
router.get("/course", (req, res) => {
  res.json({ message: "Course GET works!" });
});

export default router;
