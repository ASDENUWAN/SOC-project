import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Certificate } from "../models/certificate.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "..", "..");

function computeStatus(marks) {
  const m = Number(marks);
  if (m >= 75) return "excellent";
  if (m >= 55) return "good";
  if (m >= 35) return "average";
  return "fail";
}

export const createCertificate = async (req, res) => {
  try {
    const {
      course_id,
      student_id,
      exam_id,
      marks,
      status, // optional manual override
      issue_date, // optional, default: today
      pdfDataUrl // optional: 'data:application/pdf;base64,...'
    } = req.body;

    if (!course_id || !student_id || !exam_id || marks === undefined) {
      return res.status(400).json({ message: "course_id, student_id, exam_id, marks are required" });
    }

    const computedStatus = status || computeStatus(marks);
    const today = issue_date || new Date().toISOString().slice(0, 10);

    const row = await Certificate.create({
      course_id, student_id, exam_id,
      marks: Number(marks),
      status: computedStatus,
      issue_date: today,
    });

    // Save PDF if provided
    if (pdfDataUrl && pdfDataUrl.startsWith("data:application/pdf;base64,")) {
      const base64 = pdfDataUrl.split(",")[1];
      const buf = Buffer.from(base64, "base64");

      const dir = path.join(ROOT, "uploads", "certificates");
      fs.mkdirSync(dir, { recursive: true });

      const filename = `certificate-${row.certificate_id}.pdf`;
      const filepath = path.join(dir, filename);
      fs.writeFileSync(filepath, buf);

      const publicBase = process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 4021}`;
      row.file_url = `${publicBase}/uploads/certificates/${filename}`;
      await row.save();
    }

    return res.status(201).json(row.toJSON());
  } catch (err) {
    console.error("❌ createCertificate error:", err);
    res.status(500).json({ message: "Could not create certificate" });
  }
};

export const listCertificates = async (req, res) => {
  const rows = await Certificate.findAll({ order: [["certificate_id", "DESC"]] });
  res.json(rows.map(r => r.toJSON()));
};

export const getCertificate = async (req, res) => {
  const row = await Certificate.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: "Not found" });
  res.json(row.toJSON());
};
