import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const embedTextInPdf = async (
  buffer,
  { text, x, y, pageIndex }
) => {
  const pdfDoc = await PDFDocument.load(buffer);
  const pages = pdfDoc.getPages();

  if (pageIndex >= pages.length) {
    throw new Error("Invalid page index");
  }

  const page = pages[pageIndex];

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText(text, {
    x: Number(x),
    y: Number(y),
    size: 18,
    font,
    color: rgb(0, 0, 0)
  });

  const modifiedPdf = await pdfDoc.save();

  return modifiedPdf;
};