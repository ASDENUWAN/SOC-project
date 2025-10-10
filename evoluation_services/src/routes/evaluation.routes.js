import { Router } from "express";
import { createEvaluation, getAllEvaluations } from "../controllers/evaluation.controller.js";

const router = Router();

router.post("/", createEvaluation);
router.get("/", getAllEvaluations);

export default router;
