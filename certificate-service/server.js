import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { testConnection, sequelize } from "./src/config/db.js";
import certificateRoutes from "./src/routes/certificate.routes.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "20mb" }));

// static hosting for saved PDFs
const uploads = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploads));

app.use("/api/certificates", certificateRoutes);

const PORT = process.env.PORT || 4070;

(async () => {
  await testConnection();
  await sequelize.sync({ alter: true });
  app.listen(PORT, () => console.log(`Certificate Service listening on ${PORT}`));
})();
