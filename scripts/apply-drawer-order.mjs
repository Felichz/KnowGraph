import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.resolve(__dirname, "..", "src", "product-ui.css");

const navDrawerOrderRules = `
/* ══════════════════════════════════════════════════════════════════════════════
   EXPLICIT DRAWER ORDER & FULL HEIGHT
   ══════════════════════════════════════════════════════════════════════════════ */

.workspace-nav-drawer > .graph-switcher {
  order: 1 !important;
}

.workspace-nav-drawer > .legend {
  order: 2 !important;
}

.workspace-nav-drawer > .map-focus-strip {
  order: 3 !important;
}

.workspace-nav-drawer > .workspace-nav-backup {
  order: 4 !important;
  margin-top: auto !important;
}
`;

fs.appendFileSync(cssPath, navDrawerOrderRules, "utf8");
console.log("Drawer order rules appended!");
