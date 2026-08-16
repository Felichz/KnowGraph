import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.resolve(__dirname, "..", "src", "product-ui.css");

const deepSmellFixes = `
/* ══════════════════════════════════════════════════════════════════════════════
   DEEP VISUAL SMELL AUDIT REFINEMENTS
   ══════════════════════════════════════════════════════════════════════════════ */

/* 1. Ensure modal backdrop covers screen and hides mobile commandbar cleanly */
.desktop-shell.has-open-lesson > .desktop-commandbar {
  display: none !important;
}
.modal-backdrop {
  z-index: 1000 !important;
}
@media (max-width: 760px) {
  .lesson-modal {
    margin-top: 0 !important;
    border-radius: 0 !important;
    max-height: 100vh !important;
    height: 100vh !important;
  }
}

/* 2. Topology Node Solid Background (prevents cross-layer edge bleed through text) */
.topology-node__surface {
  fill: #0c1219 !important;
}
.topology-node.is-dimmed {
  opacity: 0.2 !important;
}

/* 3. Code Copy Button */
.code-copy-button {
  display: inline-flex !important;
  align-items: center !important;
  gap: 5px !important;
  min-height: 26px !important;
  height: 26px !important;
  padding: 0 9px !important;
  border: 1px solid #2b3c4f !important;
  border-radius: 6px !important;
  background: #111a24 !important;
  color: #94a3b8 !important;
  font: 500 11.5px Inter, ui-sans-serif, system-ui, sans-serif !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
}
.code-copy-button:hover {
  border-color: var(--p-cyan) !important;
  color: #eaf1f8 !important;
  background: #162230 !important;
}
.code-copy-button.is-copied {
  border-color: #22c55e !important;
  color: #4ade80 !important;
  background: rgba(34, 197, 94, 0.12) !important;
}
.code-copy-button svg {
  width: 13px !important;
  height: 13px !important;
}

/* 4. Live Request Coaching Feedback Bar alignment */
.debounce-feedback {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
}
.debounce-feedback__cancel-hint {
  display: none !important;
}
`;

fs.appendFileSync(cssPath, deepSmellFixes, "utf8");
console.log("Deep smell fixes appended successfully to product-ui.css!");
