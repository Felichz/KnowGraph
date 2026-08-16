import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.resolve(__dirname, "..", "src", "product-ui.css");

const graphRefinements = `
/* ══════════════════════════════════════════════════════════════════════════════
   GRAPH SCREEN POLISH & HUD REFINEMENTS
   ══════════════════════════════════════════════════════════════════════════════ */

/* 1. Stage Surface & Header in World Space */
.topology-stage__surface {
  fill: #0c1219 !important;
  stroke: #1b2636 !important;
  stroke-width: 1px !important;
}
.topology-stage__header {
  pointer-events: none !important;
}
.topology-stage__index {
  fill: #7da5c9 !important;
  font: 700 11px "JetBrains Mono", ui-monospace, monospace !important;
  letter-spacing: 0.08em !important;
}
.topology-stage__meta {
  fill: #54687d !important;
  font: 500 11px Inter, ui-sans-serif, system-ui, sans-serif !important;
}

/* 2. Glassmorphic Graph Toolbar HUD */
.topology-graph-toolbar {
  position: absolute !important;
  top: 12px !important;
  left: 14px !important;
  right: 14px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 14px !important;
  padding: 6px 10px 6px 14px !important;
  border: 1px solid rgba(43, 62, 82, 0.65) !important;
  border-radius: 10px !important;
  background: rgba(12, 18, 26, 0.88) !important;
  backdrop-filter: blur(14px) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35) !important;
  z-index: 10 !important;
}
.topology-graph-reading {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  min-width: 0 !important;
  flex: 1 1 auto !important;
}
.topology-graph-reading strong {
  color: #eaf1f8 !important;
  font-size: 12.5px !important;
  font-weight: 700 !important;
  white-space: nowrap !important;
}
.topology-graph-reading span {
  color: #8da1b5 !important;
  font-size: 11.5px !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
.topology-graph-stage {
  color: var(--p-cyan) !important;
  font: 700 11px "JetBrains Mono", ui-monospace, monospace !important;
  letter-spacing: 0.04em !important;
  background: rgba(91, 230, 218, 0.08) !important;
  border: 1px solid rgba(91, 230, 218, 0.22) !important;
  border-radius: 6px !important;
  padding: 4px 9px !important;
  white-space: nowrap !important;
}

/* 3. Bottom Route Suggestion Bar (Full Legibility & Smooth Wrapping) */
.map-workspace > .learning-guide {
  display: flex !important;
  align-items: center !important;
  gap: 20px !important;
  padding: 10px 18px !important;
  background: #0b1117 !important;
  border-top: 1px solid #1c2837 !important;
}
.guide-levels {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  gap: 16px !important;
  flex: 1 1 auto !important;
}
.guide-level {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  min-width: 0 !important;
  padding-left: 12px !important;
  border-left: 2px solid #2b3a4c !important;
}
.guide-level-1 { border-left-color: #64e7dc !important; }
.guide-level-2 { border-left-color: #f59e0b !important; }
.guide-level-3 { border-left-color: #3b82f6 !important; }
.guide-level-label {
  margin-bottom: 0 !important;
  font: 700 10.5px "JetBrains Mono", ui-monospace, monospace !important;
  letter-spacing: 0.08em !important;
  white-space: nowrap !important;
}
.guide-items {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  flex-wrap: wrap !important;
}
.map-workspace .guide-item {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  max-width: fit-content !important;
  min-height: 28px !important;
  height: 28px !important;
  padding: 0 10px !important;
  border: 1px solid #263647 !important;
  border-radius: 7px !important;
  background: #111a24 !important;
  color: #c9d6e4 !important;
  font-size: 11.5px !important;
  font-weight: 500 !important;
  white-space: nowrap !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
}
.map-workspace .guide-item:hover {
  border-color: var(--p-cyan) !important;
  color: #ffffff !important;
  background: #172433 !important;
  box-shadow: 0 0 10px rgba(91, 230, 218, 0.2) !important;
}
.guide-number {
  font-family: "JetBrains Mono", ui-monospace, monospace !important;
  font-weight: 700 !important;
  color: var(--p-cyan) !important;
}
`;

fs.appendFileSync(cssPath, graphRefinements, "utf8");
console.log("Graph refinements appended to product-ui.css!");
