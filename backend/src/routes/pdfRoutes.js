import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import protect from "../middleware/authMiddleware.js";
import Document from "../models/Document.model.js";
import User from "../models/User.model.js";

const router = express.Router();

/* ================= MULTER CONFIG ================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads";

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      "signed_" + Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

/* ================= ROUTE ================= */

router.post(
  "/upload",
  protect,
  upload.single("pdf"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: "No PDF uploaded",
      });
    }

    try {

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      /* ===== CREDIT CHECK ===== */

      if (user.credits < 10) {
        return res.status(403).json({
          message: "Not enough credits to process this PDF",
        });
      }

      /* ===== DEDUCT CREDITS ===== */

      user.credits -= 10;

      /* ===== INCREASE SIGNED COUNT ===== */

      user.signedDocuments += 1;

      await user.save();

      /* ===== SAVE DOCUMENT ===== */

      const document = await Document.create({
        user: req.user.id,
        filename: req.file.filename,
      });

      res.status(201).json({
        document,
        remainingCredits: user.credits,
        signedDocuments: user.signedDocuments,
      });

    } catch (error) {

      res.status(500).json({
        message: "PDF upload failed",
      });

    }
  }
);

export default router;