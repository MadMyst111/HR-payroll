import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { TempoDevtools } from "tempo-devtools";

// Initialize Tempo Devtools if in Tempo environment
if (import.meta.env.VITE_TEMPO === "true") {
  TempoDevtools.init();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
