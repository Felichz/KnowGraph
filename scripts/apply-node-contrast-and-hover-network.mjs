import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.resolve(__dirname, "..", "src", "product-ui.css");

const contrastRules = `
/* ══════════════════════════════════════════════════════════════════════════════
   NODE CONTRAST & RELATIONAL HOVER NETWORK
   ══════════════════════════════════════════════════════════════════════════════ */

/* 1. Base Node Styling (Crisp, solid, never washed out) */
.topology-node {
  outline: none !important;
  cursor: pointer !important;
  opacity: 0.92 !important;
  filter: none !important;
  transition: opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1),
              filter 0.22s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.18s ease !important;
}

/* 2. Completed Nodes (Solid, crisp, full presence, never transparent) */
.topology-node.is-complete {
  opacity: 1 !important;
  filter: none !important;
}
.topology-node.is-complete .topology-node__surface {
  fill: #0d151e !important;
  stroke: rgba(100, 231, 220, 0.45) !important;
  stroke-width: 1.2px !important;
}
.topology-node.is-complete .topology-node__score {
  fill: #7ee8de !important;
  font-weight: 700 !important;
}
.topology-node.is-complete .topology-node__label {
  fill: #f1f6fa !important;
}

/* 3. Uncompleted / Normal Nodes */
.topology-node.is-uncompleted {
  opacity: 0.88 !important;
  filter: none !important;
}
.topology-node.is-uncompleted .topology-node__surface {
  fill: #0c1219 !important;
  stroke: rgba(52, 73, 98, 0.55) !important;
  stroke-width: 1.2px !important;
}

/* 4. Active Guide Node (Next recommended) */
.topology-node.guide-node-1 {
  opacity: 1 !important;
  filter: drop-shadow(0 0 8px rgba(100, 231, 220, 0.45)) drop-shadow(0 0 20px rgba(100, 231, 220, 0.2)) !important;
}

/* ══════════════════════════════════════════════════════════════════════════════
   HOVER STATE & RELATIONAL NETWORK ISOLATION
   ══════════════════════════════════════════════════════════════════════════════ */

/* The hovered card itself */
.topology-node.is-hovered {
  opacity: 1 !important;
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 12px rgba(100, 231, 220, 0.35)) !important;
  transform: translateY(-2px) !important;
}
.topology-node.is-hovered .topology-node__surface {
  fill: #131c26 !important;
  stroke: #64e7dc !important;
  stroke-width: 2px !important;
}

/* Related cards (Ancestors that it needs, Descendants that it enables) */
.topology-node.is-relation {
  opacity: 1 !important;
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.4)) !important;
}
.topology-node.is-ancestor .topology-node__surface {
  fill: #0f1824 !important;
  stroke: #5aa9ff !important;
  stroke-width: 1.8px !important;
}
.topology-node.is-descendant .topology-node__surface {
  fill: #0f1c24 !important;
  stroke: #2dd4bf !important;
  stroke-width: 1.8px !important;
}

/* All other nodes that are NOT in the active relational network fade heavily */
.topology-node.is-dimmed {
  opacity: 0.12 !important;
  filter: grayscale(0.7) blur(0.2px) !important;
  pointer-events: none !important;
}

/* Edges */
.topology-edge {
  transition: stroke-opacity 0.2s ease, stroke-width 0.2s ease !important;
}
.topology-edge.is-dimmed {
  stroke-opacity: 0.03 !important;
}
.topology-edge.is-incoming {
  stroke: #5aa9ff !important;
  stroke-width: 2.5px !important;
  stroke-opacity: 1 !important;
  filter: drop-shadow(0 0 4px rgba(90, 169, 255, 0.5)) !important;
}
.topology-edge.is-outgoing {
  stroke: #2dd4bf !important;
  stroke-width: 2.5px !important;
  stroke-opacity: 1 !important;
  filter: drop-shadow(0 0 4px rgba(45, 212, 191, 0.5)) !important;
}
`;

fs.appendFileSync(cssPath, contrastRules, "utf8");
console.log("Node contrast and relational hover network CSS rules appended!");
