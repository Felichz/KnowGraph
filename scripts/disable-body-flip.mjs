import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const flashcardViewPath = path.resolve(__dirname, "..", "src", "components", "FlashcardView.jsx");
const cssPath = path.resolve(__dirname, "..", "src", "product-ui.css");

let content = fs.readFileSync(flashcardViewPath, "utf8");

// 1. Remove onClick from flashcard-modal__body
content = content.replace(
  `<div
                className={\`flashcard-modal__body \${modalFlipped ? "is-flipped" : ""}\`}
                onClick={() => setModalFlipped((v) => !v)}
                title="Hacé clic o presioná Espacio para girar"
              >`,
  `<div className={\`flashcard-modal__body \${modalFlipped ? "is-flipped" : ""}\`}>`
);

// 2. Replace flip-hint with explicit button on front
const oldFlipHint = `<div className="flashcard-modal__flip-hint">
                      <kbd>ESPACIO</kbd> o clic para revelar modelo mental y respuesta
                    </div>`;

const newFlipBtn = `<button
                      type="button"
                      className="flashcard-modal__flip-cta"
                      onClick={() => setModalFlipped(true)}
                      aria-label="Revelar modelo mental y respuesta"
                    >
                      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3.5a6.5 6.5 0 0 1 6.5 6.5h-2a4.5 4.5 0 1 0-1.3 3.2l1.4 1.4A6.5 6.5 0 1 1 10 3.5zm3.5 3.5L18 10l-4.5 3V7z" fill="currentColor"/></svg>
                      <span>Revelar respuesta y modelo mental</span>
                      <kbd>ESPACIO</kbd>
                    </button>`;

if (content.includes(oldFlipHint)) {
  content = content.replace(oldFlipHint, newFlipBtn);
}

fs.writeFileSync(flashcardViewPath, content, "utf8");
console.log("FlashcardView.jsx updated to disable body-click flip!");

// 3. Add CSS for flip CTA button
const flipCtaCss = `
/* Flip CTA Button on Flashcard Front */
.flashcard-modal__flip-cta {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 10px !important;
  margin-top: 24px !important;
  padding: 10px 18px !important;
  border: 1px solid rgba(100, 231, 220, .35) !important;
  border-radius: 8px !important;
  background: rgba(100, 231, 220, .08) !important;
  color: #64e7dc !important;
  font: 600 13px Inter, ui-sans-serif, system-ui, sans-serif !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
}

.flashcard-modal__flip-cta:hover {
  background: rgba(100, 231, 220, .18) !important;
  border-color: #64e7dc !important;
  color: #fff !important;
  box-shadow: 0 0 14px rgba(100, 231, 220, .25) !important;
  transform: translateY(-1px) !important;
}

.flashcard-modal__flip-cta svg {
  width: 15px !important;
  height: 15px !important;
}

.flashcard-modal__flip-cta kbd {
  display: inline-block !important;
  padding: 2px 6px !important;
  border: 1px solid rgba(100, 231, 220, .3) !important;
  border-radius: 4px !important;
  background: rgba(0, 0, 0, .3) !important;
  color: #a5f3fc !important;
  font: 700 10px "JetBrains Mono", ui-monospace, monospace !important;
}
`;

fs.appendFileSync(cssPath, flipCtaCss, "utf8");
console.log("CSS updated with flip CTA button!");
