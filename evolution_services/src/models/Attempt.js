import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Attempt = sequelize.define("Attempt", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  quizId: { type: DataTypes.INTEGER, allowNull: false },
  studentId: { type: DataTypes.INTEGER, allowNull: false },
  answers: { type: DataTypes.JSON },
  marks: { type: DataTypes.FLOAT },
  status: { type: DataTypes.STRING },
});
