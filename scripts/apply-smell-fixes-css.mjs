import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.resolve(__dirname, "..", "src", "product-ui.css");

const smellFixes = `
/* ══════════════════════════════════════════════════════════════════════════════
   VISUAL SMELL AUDIT REFINEMENTS (CRAFT POLISH)
   ══════════════════════════════════════════════════════════════════════════════ */

/* 1. Category Nav Pills: Custom Visible Scrollbar & Fade */
.provider-category-nav {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  overflow-x: auto !important;
  padding: 4px 4px 10px !important;
  margin: 0 -4px !important;
  scrollbar-width: thin !important;
  scrollbar-color: rgba(91, 230, 218, 0.6) rgba(15, 25, 36, 0.8) !important;
  -webkit-overflow-scrolling: touch !important;
}
.provider-category-nav::-webkit-scrollbar {
  height: 6px !important;
  display: block !important;
}
.provider-category-nav::-webkit-scrollbar-track {
  background: rgba(14, 23, 34, 0.8) !important;
  border-radius: 999px !important;
  margin: 0 4px !important;
}
.provider-category-nav::-webkit-scrollbar-thumb {
  background: rgba(91, 230, 218, 0.5) !important;
  border-radius: 999px !important;
  transition: all 0.15s ease !important;
}
.provider-category-nav:hover::-webkit-scrollbar-thumb,
.provider-category-nav::-webkit-scrollbar-thumb:hover {
  background: var(--p-cyan) !important;
  box-shadow: 0 0 10px rgba(91, 230, 218, 0.6) !important;
}

/* 2. Mobile Commandbar single row alignment */
@media (max-width: 760px) {
  .desktop-commandbar {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 8px !important;
    flex-wrap: nowrap !important;
    min-height: 48px !important;
  }
  .desktop-commandbar__identity {
    flex: 1 !important;
    min-width: 0 !important;
  }
  .desktop-commandbar h1 {
    font-size: 13.5px !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
  .desktop-commandbar__search-trigger {
    flex: none !important;
    width: 34px !important;
    min-height: 34px !important;
    padding: 0 !important;
    justify-content: center !important;
  }
  .workspace-provider-toggle {
    flex: none !important;
    width: 34px !important;
    min-height: 34px !important;
    padding: 0 !important;
    justify-content: center !important;
  }
}

/* 3. Provider Directory Search Tools inline row */
.provider-directory__tools {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  flex-wrap: nowrap !important;
}
.provider-directory__search-box {
  flex: 1 !important;
  min-width: 0 !important;
}
.provider-directory__refresh {
  flex: none !important;
  min-width: 82px !important;
  min-height: 38px !important;
  height: 38px !important;
  border-radius: 8px !important;
  font: 600 11.5px Inter, ui-sans-serif, system-ui, sans-serif !important;
}
.provider-directory__warning {
  background: rgba(237, 137, 54, 0.1) !important;
  border: 1px solid rgba(237, 137, 54, 0.25) !important;
  color: #fbd38d !important;
  border-radius: 8px !important;
  padding: 8px 12px !important;
  font-size: 11.5px !important;
  line-height: 1.4 !important;
  margin: 4px 0 !important;
}

/* 4. Lesson Reading Summary Typography Balance */
.lesson-content--read > .lesson-intro .lesson-summary {
  max-width: 68ch !important;
  margin-top: 8px !important;
  font-size: 19px !important;
  font-weight: 600 !important;
  letter-spacing: -0.015em !important;
  line-height: 1.48 !important;
  color: #eaf1f8 !important;
}
.lesson-content--read > .lesson-intro .lesson-why {
  font-size: 14px !important;
  line-height: 1.55 !important;
  color: #9ab0c4 !important;
}

/* 5. Topology Stage Ruler Rect Occlusion */
.topology-stage-ruler rect {
  fill: #080d13 !important;
  fill-opacity: 0.95 !important;
  stroke: #1b2938 !important;
  stroke-width: 1px !important;
  rx: 8px !important;
}
`;

fs.appendFileSync(cssPath, smellFixes, "utf8");
console.log("Smell fixes applied to product-ui.css!");
