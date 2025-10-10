import express from "express";
import * as quizController from "../controllers/quizController.js";
import * as questionController from "../controllers/questionController.js";
import * as attemptController from "../controllers/attemptController.js";

const router = express.Router();

// Quizzes
router.post("/quizzes", quizController.createQuiz);
router.get("/quizzes", quizController.getQuizzes);
router.get("/quizzes/:id", quizController.getQuizById);
router.put("/quizzes/:id", quizController.updateQuiz);
router.delete("/quizzes/:id", quizController.deleteQuiz);

// Questions
router.post("/questions", questionController.createQuestion);
router.get("/questions", questionController.getQuestions);
router.get("/questions/:id", questionController.getQuestionById);
router.put("/questions/:id", questionController.updateQuestion);
router.delete("/questions/:id", questionController.deleteQuestion);

// Attempts
router.post("/attempts", attemptController.createAttempt);
router.get("/attempts", attemptController.getAttempts);
router.get("/attempts/:id", attemptController.getAttemptById);
router.put("/attempts/:id", attemptController.updateAttempt);
router.delete("/attempts/:id", attemptController.deleteAttempt);

export default router;
