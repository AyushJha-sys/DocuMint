import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

/* ================= SECURITY ================= */

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

/* ================= CORS ================= */

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map(origin => origin.trim())
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS Blocked: Origin ${origin} not in`, allowedOrigins);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* ================= BODY PARSER ================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FILES ================= */

app.use("/uploads", express.static("uploads"));

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.send("DocuMint API running");
});

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/user", userRoutes);

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);

  const statusCode =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : 500;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;