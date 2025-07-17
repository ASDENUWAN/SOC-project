import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { User } from "../models/user.model.js";

export const initAuth = (app) => {
  app.use(cookieParser());
};

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
