import { Question } from "../models/index.js";

export const createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ message: "Question added successfully", data: question });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    question
      ? res.json(question)
      : res.status(404).json({ error: "Question not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const [updated] = await Question.update(req.body, { where: { id: req.params.id } });
    updated
      ? res.json({ message: "Question updated successfully" })
      : res.status(404).json({ error: "Question not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const deleted = await Question.destroy({ where: { id: req.params.id } });
    deleted
      ? res.json({ message: "Question deleted successfully" })
      : res.status(404).json({ error: "Question not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
