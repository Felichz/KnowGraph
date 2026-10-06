import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/figtree";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/bricolage-grotesque";
import "./ui/theme/tokens.css";
import "./ui/theme/light.css";
import "./ui/theme/base.css";
import "./ui/theme/styles.css";
import App from "./App.jsx";
import { applyDocumentLocale } from "./i18n/locale.js";
import { applyDocumentTheme } from "./ui/theme/theme.js";

document.documentElement.dataset.runtime = window.learningDesktop?.isElectron ? "electron" : "web";
applyDocumentLocale();
applyDocumentTheme(); // index.html already set it before first paint; this keeps both in sync.

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
