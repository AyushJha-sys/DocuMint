import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import worker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = worker;

export default function PDFPreview({ file, pageIndex, onLoadSuccess, scale = 1.0 }) {

  const containerRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);

  useEffect(() => {

    if (!file) return;

    const loadDocument = async () => {

      const reader = new FileReader();

      reader.onload = async () => {

        const typedArray = new Uint8Array(reader.result);

        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        
        setPdfDoc(pdf);
        if (onLoadSuccess) {
          onLoadSuccess(pdf.numPages);
        }

      };

      reader.readAsArrayBuffer(file);

    };

    loadDocument();

  }, [file]);

  useEffect(() => {

    if (!pdfDoc) return;

    const renderPage = async () => {

      containerRef.current.innerHTML = "";

      const pageNum = pageIndex + 1;
      if (pageNum < 1 || pageNum > pdfDoc.numPages) return;

      const page = await pdfDoc.getPage(pageNum);

      // Output scale tied to prop
      const viewport = page.getViewport({ scale });
      const pixelRatio = window.devicePixelRatio || 1;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set true hardware backing resolution
      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);
      
      // Set CSS visual size
      canvas.style.width = Math.floor(viewport.width) + "px";
      canvas.style.height = Math.floor(viewport.height) + "px";

      const transform = pixelRatio !== 1
        ? [pixelRatio, 0, 0, pixelRatio, 0, 0]
        : null;

      await page.render({
        canvasContext: ctx,
        transform,
        viewport
      }).promise;

      canvas.className = "border rounded shadow";

      containerRef.current.appendChild(canvas);

    };

    renderPage();

  }, [pdfDoc, pageIndex, scale]);

  return (
    <div className="flex flex-col items-center">
      <div ref={containerRef}></div>
    </div>
  );
}
