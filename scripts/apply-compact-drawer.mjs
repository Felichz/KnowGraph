import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.resolve(__dirname, "..", "src", "product-ui.css");

const compactDrawerCss = `
/* ══════════════════════════════════════════════════════════════════════════════
   COMPACT & SCROLLABLE NAV DRAWER WITH FULL VISIBILITY OF BACKUP SECTION
   ══════════════════════════════════════════════════════════════════════════════ */

.workspace-nav-drawer {
  grid-area: nav !important;
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
  max-height: 100% !important;
  border-right: 1px solid var(--p-line) !important;
  background: #0e141c !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  scrollbar-width: thin !important;
  scrollbar-color: #2b3a4d transparent !important;
  box-sizing: border-box !important;
  z-index: 10 !important;
}

.workspace-nav-drawer .graph-switcher {
  flex: 0 0 auto !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 5px !important;
  padding: 12px 13px 10px !important;
  background: #10161e !important;
  border-bottom: 1px solid var(--p-line) !important;
}

.workspace-nav-drawer .legend {
  flex: 1 1 auto !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 3px !important;
  padding: 10px 10px !important;
  background: #0d131a !important;
  border-bottom: 1px solid var(--p-line) !important;
  max-height: min(200px, 24vh) !important;
  overflow-y: auto !important;
  scrollbar-width: thin !important;
  scrollbar-color: #3b4d63 transparent !important;
}

.workspace-nav-drawer .map-focus-strip {
  flex: 0 0 auto !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 6px !important;
  padding: 10px 13px !important;
  background: linear-gradient(145deg, rgba(243, 189, 82, .055), transparent 70%), #10161e !important;
  border-bottom: 1px solid var(--p-line) !important;
}

.workspace-nav-drawer .map-focus-strip button {
  min-height: 30px !important;
  height: 30px !important;
  padding: 0 12px !important;
  font-size: 11px !important;
}

.workspace-nav-backup {
  flex: 0 0 auto !important;
  margin-top: auto !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 6px !important;
  padding: 10px 13px 14px !important;
  background: #0a0f15 !important;
  border-top: 1px solid var(--p-line) !important;
}

.workspace-nav-backup .workspace-nav-section-title {
  display: grid !important;
  gap: 2px !important;
  margin: 0 0 4px !important;
}

.workspace-nav-backup .workspace-nav-section-title span {
  color: #738093 !important;
  font: 750 9.5px "JetBrains Mono", ui-monospace, monospace !important;
  letter-spacing: .12em !important;
}

.workspace-nav-backup .workspace-nav-section-title small {
  color: #687587 !important;
  font-size: 10.5px !important;
  line-height: 1.3 !important;
}

.workspace-nav-backup__buttons {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 6px !important;
}

.workspace-nav-backup__btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 5px !important;
  height: 32px !important;
  min-height: 32px !important;
  padding: 0 8px !important;
  border: 1px solid #233244 !important;
  border-radius: 6px !important;
  background: #131c27 !important;
  color: #cbd5e1 !important;
  font: 600 11px Inter, ui-sans-serif, system-ui, sans-serif !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
  white-space: nowrap !important;
}

.workspace-nav-backup__btn:hover {
  background: #1b2837 !important;
  border-color: #64e7dc !important;
  color: #64e7dc !important;
}

.workspace-nav-backup__btn svg {
  width: 13px !important;
  height: 13px !important;
  stroke: currentColor !important;
  fill: none !important;
  stroke-width: 1.8 !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
}
`;

fs.appendFileSync(cssPath, compactDrawerCss, "utf8");
console.log("Compact drawer CSS applied!");
