import { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext";
import PDFPreview from "../components/PDFPreview";
import SignatureCanvas from "react-signature-canvas";
import { PDFDocument } from "pdf-lib";
import api from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEditor } from "../context/EditorContext";

export default function Editor() {
  const {
    file, setFile,
    signature, setSignature,
    stampImg, setStampImg,
    pageNumber, setPageNumber,
    numPages, setNumPages,
    zoom, setZoom,
    sigPos, setSigPos,
    stampPos, setStampPos,
    sigSize, setSigSize,
    stampSize, setStampSize,
    showSign, setShowSign,
    signMode, setSignMode,
    typedName, setTypedName,
    typedFont, setTypedFont,
  } = useEditor();

  const { refreshCredits, user } = useUser();

  const signRef = useRef(null);

  function handleFile(e) {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPageNumber(0);
      setNumPages(0);
      toast.success("PDF selected");
    }
  }

  async function uploadPDF() {
    if (!file) {
      toast.error("Select a PDF first");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      await api.post("/pdf/upload", formData);
      toast.success("PDF uploaded");

      const storedUploads = parseInt(localStorage.getItem("pdfsUploaded") || "0");
      localStorage.setItem("pdfsUploaded", (storedUploads + 1).toString());
      refreshCredits();

    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  }

  function clearSignature() {
    signRef.current?.clear();
  }

  function saveDrawSignature() {
    const data = signRef.current.toDataURL();
    setSignature(data);
    setShowSign(false);
    toast.success("Signature created");
  }

  function saveTypedSignature() {

    if (!typedName) {
      toast.error("Enter your name");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 400;
    canvas.height = 200;

    ctx.font = `48px ${typedFont}`;
    ctx.fillStyle = "black";
    ctx.fillText(typedName, 20, 100);

    const data = canvas.toDataURL();

    setSignature(data);
    setShowSign(false);

    toast.success("Typed signature created");
  }

  function handleStamp(e) {

    const img = e.target.files[0];
    if (!img) return;

    const reader = new FileReader();

    reader.onload = () => {
      setStampImg(reader.result);
      toast.success("Stamp added");
    };

    reader.readAsDataURL(img);
  }

  function deleteSignature() {
    setSignature(null);
  }

  function deleteStamp() {
    setStampImg(null);
  }

  function startDrag(e, type) {

    const startX = e.clientX;
    const startY = e.clientY;

    const startPos = type === "sig" ? sigPos : stampPos;

    function move(ev) {

      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      if (type === "sig") {
        setSigPos({
          x: startPos.x + dx,
          y: startPos.y + dy
        });
      }

      if (type === "stamp") {
        setStampPos({
          x: startPos.x + dx,
          y: startPos.y + dy
        });
      }

    }

    function stop() {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    }

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);

  }

  function startResize(e, type) {

    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;

    const startSize = type === "sig" ? sigSize : stampSize;

    function move(ev) {

      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      if (type === "sig") {
        setSigSize({
          w: startSize.w + dx,
          h: startSize.h + dy
        });
      }

      if (type === "stamp") {
        setStampSize({
          w: startSize.w + dx,
          h: startSize.h + dy
        });
      }

    }

    function stop() {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    }

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);

  }

  async function downloadPDF() {

    if (!file) {
      toast.error("Upload PDF first");
      return;
    }

    if ((user?.credits || 0) < 10) {
      toast.error("Insufficient credits.");
      return;
    }

    const toastId = toast.loading("Processing PDF...", { autoClose: false });

    try {

      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const page = pdfDoc.getPages()[pageNumber];
      const { height } = page.getSize();

      const unzoomedSig = {
        x: sigPos.x / zoom,
        y: sigPos.y / zoom,
        w: sigSize.w / zoom,
        h: sigSize.h / zoom
      };

      const unzoomedStamp = {
        x: stampPos.x / zoom,
        y: stampPos.y / zoom,
        w: stampSize.w / zoom,
        h: stampSize.h / zoom
      };

      if (signature) {
        const sigBytes = await fetch(signature).then(r => r.arrayBuffer());
        const sigImage = await pdfDoc.embedPng(sigBytes);

        page.drawImage(sigImage, {
          x: unzoomedSig.x,
          y: height - unzoomedSig.y - unzoomedSig.h,
          width: unzoomedSig.w,
          height: unzoomedSig.h
        });
      }

      if (stampImg) {
        const stampBytes = await fetch(stampImg).then(r => r.arrayBuffer());
        const stampImage = await pdfDoc.embedPng(stampBytes);

        page.drawImage(stampImage, {
          x: unzoomedStamp.x,
          y: height - unzoomedStamp.y - unzoomedStamp.h,
          width: unzoomedStamp.w,
          height: unzoomedStamp.h
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "signed-document.pdf";
      link.click();

      const storedDownloads = parseInt(localStorage.getItem("pdfsDownloaded") || "0");
      localStorage.setItem("pdfsDownloaded", (storedDownloads + 1).toString());
      refreshCredits();

      toast.update(toastId, {
        render: "Signed PDF downloaded",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });

    } catch (err) {

      console.error(err);

      toast.update(toastId, {
        render: "Failed to build PDF.",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });

    }

  }

  return (

    <div className="max-w-6xl mx-auto">

      <ToastContainer position="top-right" autoClose={2000} />

      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        PDF Editor
      </h1>

      <div className="flex gap-6">

        {/* LEFT PANEL */}

        <div className="w-56 bg-white dark:bg-gray-900 border rounded-xl p-4 space-y-3">

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFile}
          />

          <button
            onClick={uploadPDF}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg"
          >
            Upload
          </button>

          <button
            onClick={() => setShowSign(true)}
            className="w-full py-2 bg-blue-600 text-white rounded-lg"
          >
            Signature
          </button>

          <label className="w-full py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-center cursor-pointer block">
            Upload Stamp
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleStamp}
              className="hidden"
            />
          </label>

          <button
            onClick={downloadPDF}
            className="w-full py-2 bg-green-600 text-white rounded-lg"
          >
            Download Signed PDF
          </button>

        </div>

        {/* PDF VIEWER */}

        <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl h-[calc(100vh-140px)] flex flex-col items-center p-4 overflow-auto">

          {numPages > 0 && (
            <div className="flex items-center gap-4 mb-4">

              <button
                onClick={() => setPageNumber(Math.max(0, pageNumber - 1))}
                disabled={pageNumber === 0}
                className="px-4 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="text-sm font-medium">
                Page {pageNumber + 1} / {numPages}
              </span>

              <button
                onClick={() => setPageNumber(Math.min(numPages - 1, pageNumber + 1))}
                disabled={pageNumber === numPages - 1}
                className="px-4 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>

              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>

              <button
                onClick={() => setZoom(Math.max(0.4, zoom - 0.2))}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded font-medium disabled:opacity-50"
                disabled={zoom <= 0.4}
              >
                -
              </button>
              <span className="text-sm font-medium">
                Zoom: {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(2.0, zoom + 0.2))}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded font-medium disabled:opacity-50"
                disabled={zoom >= 2.0}
              >
                +
              </button>

            </div>
          )}

          <div className="relative bg-white shadow-lg">

            {file ? (
              <PDFPreview
                file={file}
                pageIndex={pageNumber}
                onLoadSuccess={setNumPages}
                scale={zoom}
              />
            ) : (
              <div className="text-gray-500 p-20">
                Upload a PDF to preview
              </div>
            )}

            {signature && (
              <div
                style={{ position:"absolute", left:sigPos.x, top:sigPos.y, zIndex:50 }}
                onMouseDown={(e)=>startDrag(e,"sig")}
                className="group border border-transparent hover:border-indigo-500/50 cursor-move"
              >
                <img src={signature} alt="signature" style={{width:sigSize.w,height:sigSize.h}} draggable={false} />
                <button
                  onClick={deleteSignature}
                  className="absolute -top-3 -right-3 bg-red-500 text-white w-6 h-6 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md flex items-center justify-center font-bold"
                >
                  ✕
                </button>
                <div
                  onMouseDown={(e)=>startResize(e,"sig")}
                  className="absolute bottom-0 right-0 w-4 h-4 bg-indigo-500 rounded-sm cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            )}

            {stampImg && (
              <div
                style={{ position:"absolute", left:stampPos.x, top:stampPos.y, zIndex: 50 }}
                onMouseDown={(e)=>startDrag(e,"stamp")}
                className="group border border-transparent hover:border-indigo-500/50 cursor-move"
              >
                <img src={stampImg} alt="stamp" style={{width:stampSize.w,height:stampSize.h}} draggable={false} />
                <button
                  onClick={deleteStamp}
                  className="absolute -top-3 -right-3 bg-red-500 text-white w-6 h-6 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md flex items-center justify-center font-bold"
                >
                  ✕
                </button>
                <div
                  onMouseDown={(e)=>startResize(e,"stamp")}
                  className="absolute bottom-0 right-0 w-4 h-4 bg-indigo-500 rounded-sm cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            )}

          </div>

        </div>

      </div>

      {showSign && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl w-[440px] shadow-2xl">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create Signature</h3>
              <button 
                onClick={() => setShowSign(false)} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button 
                onClick={()=>setSignMode("draw")} 
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${signMode === "draw" ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
              >
                Draw Signature
              </button>
              <button 
                onClick={()=>setSignMode("type")} 
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${signMode === "type" ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
              >
                Type Signature
              </button>
            </div>

            {signMode==="draw" && (
              <div className="flex flex-col items-center">
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white w-full h-[200px]">
                  <SignatureCanvas
                    ref={signRef}
                    penColor="black"
                    canvasProps={{ width: 392, height: 200, className: "signature-canvas" }}
                  />
                </div>
                <div className="flex gap-3 mt-6 w-full">
                  <button onClick={clearSignature} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                    Clear
                  </button>
                  <button onClick={saveDrawSignature} className="flex-1 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20">
                    Save
                  </button>
                </div>
              </div>
            )}

            {signMode==="type" && (
              <div className="animate-fade-up flex flex-col">
                <input
                  type="text"
                  placeholder="Type your name..."
                  value={typedName}
                  onChange={(e)=>setTypedName(e.target.value)}
                  className="w-full p-3.5 mb-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                />

                <select 
                  value={typedFont} 
                  onChange={(e) => setTypedFont(e.target.value)}
                  className="w-full p-3.5 mb-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none cursor-pointer"
                >
                  <option value="cursive">Cursive (Elegant)</option>
                  <option value='"Brush Script MT", cursive'>Brush Script (Classic)</option>
                  <option value='"Lucida Handwriting", cursive'>Lucida (Handwritten)</option>
                  <option value="serif">Serif (Formal)</option>
                  <option value="monospace">Monospace (Technical)</option>
                  <option value="fantasy">Fantasy (Stylized)</option>
                </select>

                <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white flex items-center justify-center h-32 overflow-hidden text-black shadow-inner">
                  <span style={{ fontFamily: typedFont, fontSize: '42px' }}>
                    {typedName || "Preview"}
                  </span>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowSign(false)} className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                    Cancel
                  </button>
                  <button onClick={saveTypedSignature} className="flex-1 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20">
                    Use Signature
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}