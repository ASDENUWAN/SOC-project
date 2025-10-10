// src/app.js
import express from "express";
import { sequelize } from "./config/db.js";
import creatorRoutes from "./routes/creator.routes.js";

const app = express();

app.use(express.json());
app.use("/api/creator", creatorRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
