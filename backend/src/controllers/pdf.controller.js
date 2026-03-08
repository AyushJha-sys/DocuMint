import asyncHandler from "../utils/asyncHandler.js";
import { embedTextInPdf } from "../services/pdf.service.js";
import Document from "../models/Document.model.js";

export const signPdf = asyncHandler(async (req, res) => {
  const { text, x, y, pageIndex } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error("No PDF uploaded");
  }

  const modifiedPdf = await embedTextInPdf(req.file.buffer, {
    text,
    x,
    y,
    pageIndex: Number(pageIndex)
  });

  await Document.create({
    user: req.user._id,
    filename: `signed_${Date.now()}.pdf`
  });

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=signed.pdf"
  });

  res.send(Buffer.from(modifiedPdf));
});