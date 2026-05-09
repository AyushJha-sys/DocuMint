import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { EditorProvider } from "./context/EditorContext";
import { UserProvider } from "./context/UserContext";
// Improved structure
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <EditorProvider>
        <App />
      </EditorProvider>
    </UserProvider>
  </BrowserRouter>
);
