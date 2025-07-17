import express from "express";
import dotenv from "dotenv";
import { testConnection, sequelize } from "./config/db.js";
import { initAuth } from "./middleware/auth.js";

import userRoutes from "./routes/user.routes.js";

dotenv.config();
const app = express();
app.use(express.json());
initAuth(app);

// User CRUD & admin
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 4001;
(async () => {
  await testConnection();
  await sequelize.sync({ alter: true });
  app.listen(PORT, () => console.log(`🚀 User Service on ${PORT}`));
})();
