import express from "express";
import {
  getDocuments,
  deleteDocument,
  downloadDocument
} from "../controllers/document.controller.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getDocuments);
router.delete("/:id", protect, deleteDocument);
router.get("/:id/download", protect, downloadDocument);

export default router;