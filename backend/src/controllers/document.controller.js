import path from "path";
import asyncHandler from "../utils/asyncHandler.js";
import Document from "../models/Document.model.js";
import User from "../models/User.model.js";

export const getDocuments = asyncHandler(async (req, res) => {
  const docs = await Document.find({
    user: req.user._id
  }).sort({ createdAt: -1 });

  res.json(docs);
});

export const deleteDocument = asyncHandler(async (req, res) => {
  await Document.findByIdAndDelete(req.params.id);

  res.json({
    message: "Document deleted"
  });
});

export const downloadDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    res.status(404);
    throw new Error("Document not found");
  }

  // Check if owner
  if (document.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to download this document");
  }

  const user = await User.findById(req.user._id);

  if (user.credits < 10) {
    res.status(403);
    throw new Error("Not enough credits to download this document");
  }

  // Deduct credits
  user.credits -= 10;
  await user.save();

  const filePath = path.join(process.cwd(), "uploads", document.filename);
  res.download(filePath);
});