import { Quiz } from "../models/index.js";

export const createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ message: "Quiz created successfully", data: quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    quiz ? res.json(quiz) : res.status(404).json({ error: "Quiz not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const [updated] = await Quiz.update(req.body, { where: { id: req.params.id } });
    updated
      ? res.json({ message: "Quiz updated successfully" })
      : res.status(404).json({ error: "Quiz not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const deleted = await Quiz.destroy({ where: { id: req.params.id } });
    deleted
      ? res.json({ message: "Quiz deleted successfully" })
      : res.status(404).json({ error: "Quiz not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
