import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Certificate = sequelize.define(
  "Certificate",
  {
    certificate_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    course_id: { type: DataTypes.STRING, allowNull: false },
    student_id: { type: DataTypes.STRING, allowNull: false },
    exam_id: { type: DataTypes.STRING, allowNull: false },
    marks: { type: DataTypes.F, allowNull: false },
    status: {
      type: DataTypes.ENUM("excellent", "good", "average", "fail"),
      allowNull: false,
      defaultValue: "fail",
    },
    file_url: { type: DataTypes.TEXT, allowNull: true },
    issue_date: { type: DataTypes.DATEONLY, allowNull: false },
  },
  {
    tableName: "Certificate",
    timestamps: true, // adds createdAt
    updatedAt: false, // we don't need updatedAt for now
  }
);
