import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Course } from "./course.model.js";

export const Section = sequelize.define(
  "Section",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    courseId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    order: { type: DataTypes.INTEGER, defaultValue: 1 },
    contentType: {
      type: DataTypes.ENUM("video", "pdf", "text"),
      allowNull: false,
    },
    contentUrl: { type: DataTypes.TEXT }, // public URL (video/pdf)
    contentKey: { type: DataTypes.TEXT }, // ← exact S3 key
    textContent: { type: DataTypes.TEXT }, // for text
  },
  { tableName: "sections", timestamps: true }
);

Course.hasMany(Section, {
  foreignKey: "courseId",
  as: "sections",
  onDelete: "CASCADE",
});
Section.belongsTo(Course, { foreignKey: "courseId", as: "course" });
