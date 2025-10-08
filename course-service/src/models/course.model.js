// src/models/course.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Course = sequelize.define(
  "Course",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    creatorId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },

    subject: {
      type: DataTypes.ENUM("maths", "english", "it"),
      allowNull: false,
    },
    gradeLevel: { type: DataTypes.STRING },
    language: { type: DataTypes.STRING },

    status: {
      type: DataTypes.ENUM("draft", "approved", "rejected"),
      defaultValue: "draft",
    },
    rejectReason: { type: DataTypes.TEXT },
    thumbnailUrl: { type: DataTypes.TEXT },
  },
  { tableName: "courses", timestamps: true }
);
