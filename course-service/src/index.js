import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { testConnection, sequelize } from "./config/db.js";
import { initAuth } from "./middleware/auth.js";
import courseRoutes from "./routes/course.routes.js";

// Models must be imported once to register associations
import "./models/course.model.js";
import "./models/section.model.js";

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

//app.get("/", (_req, res) => res.send("Course Service OK"));
app.use("/api/courses", courseRoutes);

const PORT = process.env.PORT || 4030;
(async () => {
  await testConnection();
  await sequelize.sync({ alter: true }); // dev-friendly
  app.listen(PORT, () => console.log(`🚀 Course Service on ${PORT}`));
})();
