import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection, sequelize } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;
(async () => {
  await testConnection();
  // In dev, sync models → create tables if missing
  await sequelize.sync({ alter: true });
  app.listen(PORT, () => console.log(`🚀 Auth Service running on ${PORT}`));
})();
