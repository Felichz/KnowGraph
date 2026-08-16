import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appPath = path.resolve(__dirname, "..", "src", "App.jsx");
const cssPath = path.resolve(__dirname, "..", "src", "product-ui.css");

// 1. In App.jsx, only show learning-guide when viewMode === "graph"
let appCode = fs.readFileSync(appPath, "utf8");
appCode = appCode.replace(
  '<section className="learning-guide" aria-label="Ruta sugerida de aprendizaje">',
  '{viewMode === "graph" && (\n        <section className="learning-guide" aria-label="Ruta sugerida de aprendizaje">'
);
appCode = appCode.replace(
  '      </section>\n\n      <section className="canvas-row">',
  '      </section>\n      )}\n\n      <section className="canvas-row">'
);
fs.writeFileSync(appPath, appCode, "utf8");

// 2. In product-ui.css, make coaching view full width and clean
const coachingFullWidthStyles = `
/* ══════════════════════════════════════════════════════════════════════════════
   COACHING VIEW FULL-WIDTH CLEANUP
   ══════════════════════════════════════════════════════════════════════════════ */
.lesson-layout--coach {
  display: block !important;
  width: 100% !important;
}
.lesson-content--coach {
  width: 100% !important;
  max-width: 960px !important;
  margin: 0 auto !important;
  padding: 24px clamp(16px, 3vw, 40px) 40px !important;
}
.lesson-content--coach .paraphrase-review {
  width: 100% !important;
  max-width: 100% !important;
}
.paraphrase-review__head h3 {
  font-size: 24px !important;
  font-weight: 700 !important;
  color: #f1f5f9 !important;
}
.paraphrase-review__intro {
  max-width: 800px !important;
  font-size: 13.5px !important;
  line-height: 1.6 !important;
  color: #94a3b8 !important;
}
.paraphrase-review__textarea {
  width: 100% !important;
  min-height: 300px !important;
  font-size: 15.5px !important;
  line-height: 1.7 !important;
  padding: 18px 20px !important;
  border-radius: 12px !important;
  background: #080d14 !important;
  border: 1px solid #233345 !important;
}
.paraphrase-review__textarea:focus {
  border-color: var(--p-cyan) !important;
  box-shadow: 0 0 0 3px rgba(91, 230, 218, 0.12) !important;
}
`;

fs.appendFileSync(cssPath, coachingFullWidthStyles, "utf8");
console.log("Coaching full width and flashcard guide fix applied!");
