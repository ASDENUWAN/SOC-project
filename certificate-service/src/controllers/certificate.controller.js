import { Certificate } from "../models/certificate.model.js";

//  Fetch quiz info (simulate from database)
export const getQuizInfo = async (req, res) => {
  try {
    const { course_id, student_id, exam_id } = req.query;
    if (!course_id || !student_id || !exam_id) {
      return res.status(400).json({ message: "course_id, student_id, exam_id are required" });
    }

    // Pretend this is data fetched from your quiz results DB
    const quizData = [
      { course_id: "C101", student_id: "S001", exam_id: "E001", student_name: "Alice Johnson", course_title: "Web Development", marks: 85 },
      { course_id: "C102", student_id: "S002", exam_id: "E002", student_name: "Bob Smith", course_title: "Database Systems", marks: 65 },
      { course_id: "C103", student_id: "S003", exam_id: "E003", student_name: "Charlie Brown", course_title: "Networking Basics", marks: 50 },
      { course_id: "C104", student_id: "S004", exam_id: "E004", student_name: "Diana Prince", course_title: "Python Programming", marks: 38 },
      { course_id: "C105", student_id: "S005", exam_id: "E005", student_name: "Evan Peters", course_title: "AI Foundations", marks: 20 },
    ];

    const found = quizData.find(
      (q) =>
        q.course_id === course_id &&
        q.student_id === student_id &&
        q.exam_id === exam_id
    );

    if (!found) {
      return res.status(404).json({ message: "No record found for provided IDs" });
    }

    let status = "fail";
    if (found.marks >= 75) status = "excellent";
    else if (found.marks >= 55) status = "good";
    else if (found.marks >= 35) status = "average";

    return res.json({
      student_name: found.student_name,
      course_title: found.course_title,
      marks: found.marks,
      status,
    });
  } catch (err) {
    console.error("getQuizInfo error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Create new certificate
export const createCertificate = async (req, res) => {
  try {
    const { course_id, student_id, exam_id, student_name, marks, status, issue_date, pdfDataUrl } = req.body;

    const cert = await Certificate.create({
      course_id,
      student_id,
      exam_id,
      student_name,
      marks,
      status,
      issue_date,
      file_url: pdfDataUrl || null,
    });

    res.status(201).json(cert);
  } catch (err) {
    console.error("createCertificate error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 List all certificates
export const listCertificates = async (req, res) => {
  try {
    const all = await Certificate.findAll({ order: [["certificate_id", "DESC"]] });
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get single certificate
export const getCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findByPk(req.params.id);
    if (!cert) return res.status(404).json({ message: "Certificate not found" });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

