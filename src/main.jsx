import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/theme.css";

document.documentElement.dataset.runtime = window.learningDesktop?.isElectron ? "electron" : "web";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
