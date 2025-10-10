import { Attempt } from "../models/index.js";

export const createAttempt = async (req, res) => {
  try {
    const attempt = await Attempt.create(req.body);
    res.status(201).json({ message: "Attempt created successfully", data: attempt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.findAll();
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAttemptById = async (req, res) => {
  try {
    const attempt = await Attempt.findByPk(req.params.id);
    attempt
      ? res.json(attempt)
      : res.status(404).json({ error: "Attempt not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAttempt = async (req, res) => {
  try {
    const [updated] = await Attempt.update(req.body, { where: { id: req.params.id } });
    updated
      ? res.json({ message: "Attempt updated successfully" })
      : res.status(404).json({ error: "Attempt not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAttempt = async (req, res) => {
  try {
    const deleted = await Attempt.destroy({ where: { id: req.params.id } });
    deleted
      ? res.json({ message: "Attempt deleted successfully" })
      : res.status(404).json({ error: "Attempt not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
