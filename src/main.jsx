import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";
import "./product-ui.css";

document.documentElement.dataset.runtime = window.learningDesktop?.isElectron ? "electron" : "web";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
