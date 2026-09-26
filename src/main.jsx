import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@fontsource-variable/newsreader";
import "./ui/theme/tokens.css";
import "./ui/theme/base.css";
import "./ui/theme/styles.css";
import App from "./App.jsx";

document.documentElement.dataset.runtime = window.learningDesktop?.isElectron ? "electron" : "web";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if ("serviceWorker" in navigator && !window.learningDesktop?.isElectron) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
