import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

/* ================= DATABASE CONNECTION ================= */

connectDB();

/* ================= SERVER START ================= */

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/* ================= GRACEFUL SHUTDOWN ================= */

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  server.close(() => {
    process.exit(1);
  });
});