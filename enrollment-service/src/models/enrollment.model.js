import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Enrollment = sequelize.define(
  "Enrollment",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    courseId: { type: DataTypes.INTEGER, allowNull: false },
    studentId: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("active", "completed", "cancelled"),
      defaultValue: "active",
    },
    progress: { type: DataTypes.FLOAT, defaultValue: 0 }, // 0..100
    totalSections: { type: DataTypes.INTEGER, defaultValue: 0 }, // denormalized
    lastSectionId: { type: DataTypes.INTEGER, allowNull: true },
    startedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    completedAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "enrollments",
    timestamps: true,
    indexes: [{ unique: true, fields: ["courseId", "studentId"] }],
  }
);
