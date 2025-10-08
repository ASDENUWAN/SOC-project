import { Router } from "express";
import {
  createCertificate,
  listCertificates,
  getCertificate,
  getQuizInfo,
} from "../controllers/certificate.controller.js";

const router = Router();

// 🔹 New route to fetch quiz info
router.get("/quiz/info", getQuizInfo);

router.get("/", listCertificates);
router.get("/:id", getCertificate);
router.post("/", createCertificate);

export default router;

