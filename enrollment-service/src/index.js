import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { testConnection, sequelize } from "./config/db.js";
import { initAuth } from "./middleware/auth.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";

// models
import "./models/enrollment.model.js";
import "./models/completion.model.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
initAuth(app);

app.get("/", (_req, res) => res.send("Enrollment Service OK"));
app.use("/api/enrollments", enrollmentRoutes);

const PORT = process.env.PORT || 4040;
(async () => {
  await testConnection();
  await sequelize.sync({ alter: true }); // dev-friendly
  app.listen(PORT, () => console.log(`🚀 Course Service on ${PORT}`));
})();
