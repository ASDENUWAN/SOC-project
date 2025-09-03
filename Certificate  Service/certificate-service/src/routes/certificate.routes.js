import { Router } from "express";
import { createCertificate, listCertificates, getCertificate } from "../controllers/certificate.controller.js";

const router = Router();

router.get("/", listCertificates);
router.get("/:id", getCertificate);
router.post("/", createCertificate);

export default router;
