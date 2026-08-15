import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.resolve(__dirname, "..", "src", "product-ui.css");

const polishStyles = `
/* ── Visual Polish Refinements ── */
.flashcards__toolbar {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 16px !important;
  flex-wrap: wrap !important;
  padding: 12px 18px !important;
  background: rgba(11, 18, 26, 0.6) !important;
  border: 1px solid #1c2b3a !important;
  border-radius: 12px !important;
  margin-bottom: 20px !important;
}
.flashcards__filters {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  flex-wrap: wrap !important;
}
.flashcards__actions {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
}

/* Zen mode drafting centering */
.lesson-modal.is-zen {
  padding: 24px 32px !important;
  overflow-y: auto !important;
}
.lesson-modal.is-zen .lesson-layout--coach {
  grid-template-columns: minmax(0, 1fr) !important;
  max-width: 860px !important;
  margin: 0 auto !important;
}
.lesson-modal.is-zen .paraphrase-review__input {
  min-height: 280px !important;
  font-size: 14.5px !important;
  line-height: 1.6 !important;
}

/* Split Studio Sidebar Glow */
.lesson-studio-guide {
  border: 1px solid rgba(100, 231, 220, 0.22) !important;
  background: linear-gradient(180deg, rgba(14, 23, 34, 0.8) 0%, rgba(9, 15, 23, 0.9) 100%) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
}
.lesson-studio-guide__summary {
  color: #f0f7fc !important;
}
.lesson-studio-guide__why {
  color: #9cb1c5 !important;
}
`;

fs.appendFileSync(cssPath, polishStyles, "utf8");
console.log("Visual polish appended successfully!");
