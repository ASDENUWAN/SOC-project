import express from "express";
import { sequelize } from "./src/config/db.js";
import router from "./src/routes/index.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

sequelize.sync().then(() => {
  console.log("✅ Database synced");
  app.listen(process.env.PORT || 4060, () =>
    console.log("🚀 Server running on port 4060")
  );
});
