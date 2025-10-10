import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Question = sequelize.define("Question", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  quizId: { type: DataTypes.INTEGER, allowNull: false },
  questionText: { type: DataTypes.STRING, allowNull: false },
  options: { type: DataTypes.JSON, allowNull: false },
  correctAnswer: { type: DataTypes.STRING, allowNull: false },
});
