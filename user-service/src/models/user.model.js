// models/user.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("student", "creator", "admin"),
      defaultValue: "student",
    },
    mobile: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: true },
    rating: { type: DataTypes.FLOAT, allowNull: true, defaultValue: null },
    profilePicUrl: { type: DataTypes.TEXT, allowNull: true },
    // NEW: S3 key to support precise delete/replace
    profilePicKey: { type: DataTypes.STRING, allowNull: true },

    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
  },
  { tableName: "users", timestamps: true }
);
