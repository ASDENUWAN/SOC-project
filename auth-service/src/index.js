import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { testConnection, sequelize } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // your React app URL
    credentials: true, // <— allows Access-Control-Allow-Credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4010;
(async () => {
  await testConnection();
  // In dev, sync models → create tables if missing
  await sequelize.sync({ alter: true });
  app.listen(PORT, () => console.log(`🚀 Auth Service running on ${PORT}`));
})();
