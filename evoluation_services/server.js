// src/server.js
import app from "./src/app.js";

const PORT = process.env.PORT || 4050;

app.listen(PORT, async () => {
  try {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error(err);
  }
});
