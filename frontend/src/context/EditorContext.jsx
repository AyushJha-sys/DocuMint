import React, { createContext, useContext, useState } from "react";

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const [file, setFile] = useState(null);
  const [signature, setSignature] = useState(null);
  const [stampImg, setStampImg] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(0.6);

  const [sigPos, setSigPos] = useState({ x: 120, y: 120 });
  const [stampPos, setStampPos] = useState({ x: 260, y: 200 });
  const [sigSize, setSigSize] = useState({ w: 160, h: 80 });
  const [stampSize, setStampSize] = useState({ w: 140, h: 100 });

  const [showSign, setShowSign] = useState(false);
  const [signMode, setSignMode] = useState("draw");
  const [typedName, setTypedName] = useState("");
  const [typedFont, setTypedFont] = useState("cursive");

  const value = {
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
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
