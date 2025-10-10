import { Quiz } from "../models/quiz.model.js";
import { Question } from "../models/question.model.js";
import { Attempt } from "../models/attempt.model.js";
import axios from "axios";

const CERT_SERVICE = process.env.CERT_SERVICE_URL || "http://certificate-service:4050";

export const getQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findByPk(quizId, { include: [Question] });

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const sanitized = quiz.Questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      options: q.options,
    }));

    res.json({ id: quiz.id, title: quiz.title, questions: sanitized });
  } catch (err) {
    res.status(500).json({ message: "Error fetching quiz", error: err.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers, studentId } = req.body;

    const questions = await Question.findAll({ where: { quizId } });
    if (!questions.length) return res.status(404).json({ message: "No questions found" });

    let correct = 0;
    for (const q of questions) {
      if (answers[q.id] && answers[q.id] === q.correctAnswer) correct++;
    }

    const marks = (correct / questions.length) * 100;
    const attempt = await Attempt.create({
      quizId,
      studentId,
      answers,
      marks,
      status: "completed",
    });

    // Send data to certificate microservice (optional)
    try {
      await axios.post(`${CERT_SERVICE}/api/certificates`, {
        course_id: quizId,
        student_id: studentId,
        exam_id: attempt.id,
        marks,
        status: marks >= 50 ? "passed" : "failed",
      });
    } catch (err) {
      console.log("⚠️ Could not reach Certification Service:", err.message);
    }

    res.json({ marks, status: marks >= 50 ? "passed" : "failed" });
  } catch (err) {
    res.status(500).json({ message: "Error submitting quiz", error: err.message });
  }
};
