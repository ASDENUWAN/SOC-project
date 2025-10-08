// src/middleware/auth.js
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

export const initAuth = (app) => app.use(cookieParser());

export const protect = (req, res, next) => {
  try {
    const token = req.cookies?.access_token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
