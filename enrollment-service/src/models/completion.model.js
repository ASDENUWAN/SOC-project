import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Enrollment } from "./enrollment.model.js";

export const Completion = sequelize.define(
  "Completion",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    enrollmentId: { type: DataTypes.INTEGER, allowNull: false },
    sectionId: { type: DataTypes.INTEGER, allowNull: false },
    isCompleted: { type: DataTypes.BOOLEAN, defaultValue: true },
    completedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "enrollment_completions",
    timestamps: true,
    indexes: [{ unique: true, fields: ["enrollmentId", "sectionId"] }],
  }
);

Enrollment.hasMany(Completion, {
  foreignKey: "enrollmentId",
  as: "completions",
  onDelete: "CASCADE",
});
Completion.belongsTo(Enrollment, {
  foreignKey: "enrollmentId",
  as: "enrollment",
});
