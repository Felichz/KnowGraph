import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.resolve(__dirname, "..", "src", "product-ui.css");

const newStyles = `
/* ══════════════════════════════════════════════════════════════════════════════
   NEXT-GENERATION LEARNING WORKSPACE & INTERVIEW STUDIO STYLES
   ══════════════════════════════════════════════════════════════════════════════ */

/* ── 1. Desktop Commandbar Search Trigger ── */
.desktop-commandbar__search-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 8px;
  padding: 0 12px;
  color: #7b8e9f;
  background: rgba(11, 18, 26, 0.7);
  font: 500 12px Inter, ui-sans-serif, system-ui, sans-serif;
  cursor: pointer;
  transition: all 0.15s ease;
}
.desktop-commandbar__search-trigger:hover {
  border-color: rgba(100, 231, 220, 0.4);
  color: #d8e5ef;
  background: rgba(17, 26, 38, 0.9);
  box-shadow: 0 0 12px rgba(100, 231, 220, 0.08);
}
.desktop-commandbar__search-trigger svg {
  width: 14px;
  height: 14px;
  stroke: #7890a6;
  flex: none;
}
.desktop-commandbar__search-trigger kbd {
  display: inline-flex;
  align-items: center;
  font: 600 9.5px "JetBrains Mono", monospace;
  color: #64e7dc;
  background: rgba(100, 231, 220, 0.1);
  border: 1px solid rgba(100, 231, 220, 0.25);
  border-radius: 4px;
  padding: 1px 5px;
  line-height: 1.3;
}
@media (max-width: 640px) {
  .desktop-commandbar__search-trigger span,
  .desktop-commandbar__search-trigger kbd {
    display: none;
  }
  .desktop-commandbar__search-trigger {
    padding: 0 9px;
  }
}

/* ── 2. Universal Command Palette Modal ── */
.command-palette-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: clamp(40px, 12vh, 120px);
  background: rgba(4, 7, 11, 0.75);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  animation: cp-fade-in 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes cp-fade-in {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
.command-palette {
  width: 100%;
  max-width: 640px;
  margin: 0 16px;
  background: #0d141e;
  border: 1px solid #233446;
  border-radius: 14px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.command-palette__search {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid #1a2838;
  background: #101925;
}
.command-palette__search-icon {
  width: 18px;
  height: 18px;
  stroke: var(--p-cyan);
  flex: none;
}
.command-palette__input {
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: #fff;
  font: 500 14px Inter, ui-sans-serif, system-ui, sans-serif;
}
.command-palette__input::placeholder {
  color: #62778c;
}
.command-palette__esc-badge {
  font: 600 10px "JetBrains Mono", monospace;
  color: #6c8196;
  background: #182332;
  border: 1px solid #28394c;
  border-radius: 4px;
  padding: 2px 6px;
}
.command-palette__list {
  max-height: 380px;
  overflow-y: auto;
  padding: 8px 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.command-palette__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.12s ease;
  user-select: none;
}
.command-palette__item.is-selected {
  background: rgba(100, 231, 220, 0.09);
  border: 1px solid rgba(100, 231, 220, 0.28);
}
.command-palette__item-icon {
  font-size: 16px;
  color: var(--p-cyan);
  width: 24px;
  text-align: center;
  flex: none;
}
.command-palette__item-priority {
  font: 700 11px "JetBrains Mono", monospace;
  color: #64e7dc;
  background: rgba(100, 231, 220, 0.1);
  border-radius: 4px;
  padding: 2px 6px;
  flex: none;
}
.command-palette__item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.command-palette__item-top {
  display: flex;
  align-items: center;
  gap: 8px;
}
.command-palette__item-title {
  color: #e5eff8;
  font-size: 12.5px;
  font-weight: 650;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.command-palette__item-cat {
  font-size: 10.5px;
  color: #71889e;
}
.command-palette__item-desc {
  font-size: 11px;
  color: #7d91a5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.command-palette__item-badge {
  font: 600 10px Inter, sans-serif;
  color: #8da4b9;
  background: #172332;
  border-radius: 4px;
  padding: 2px 6px;
}
.command-palette__item-enter-hint {
  font-family: "JetBrains Mono", monospace;
  color: #64e7dc;
  font-size: 13px;
  opacity: 0;
  transition: opacity 0.12s;
}
.command-palette__item.is-selected .command-palette__item-enter-hint {
  opacity: 1;
}
.command-palette__empty {
  padding: 32px 16px;
  text-align: center;
  color: #74899d;
  font-size: 12.5px;
}
.command-palette__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 18px;
  background: #090e15;
  border-top: 1px solid #182636;
  font-size: 11px;
  color: #63778a;
}
.command-palette__shortcuts {
  display: flex;
  align-items: center;
  gap: 14px;
}
.command-palette__shortcuts kbd {
  font: 600 9.5px "JetBrains Mono", monospace;
  color: #92a7ba;
  background: #141f2c;
  border: 1px solid #233446;
  border-radius: 3px;
  padding: 1px 4px;
  margin-right: 4px;
}

/* ── 3. Split Studio in Lesson View ── */
.lesson-layout--coach {
  display: grid;
  grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}
.lesson-studio-guide {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: rgba(14, 21, 30, 0.7);
  border: 1px solid #203144;
  border-radius: 12px;
  padding: 16px;
  position: sticky;
  top: 16px;
}
.lesson-studio-guide__section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.lesson-studio-guide__summary {
  color: #e5eff8;
  font-size: 12.5px;
  line-height: 1.45;
  font-weight: 550;
}
.lesson-studio-guide__why {
  color: #8da4b9;
  font-size: 11.5px;
  line-height: 1.45;
}
.lesson-studio-guide__prompt {
  background: rgba(100, 231, 220, 0.05);
  border: 1px solid rgba(100, 231, 220, 0.18);
  border-radius: 8px;
  padding: 10px 12px;
}
.lesson-studio-guide__prompt p {
  color: #c9f5f0;
  font-size: 11.5px;
  line-height: 1.45;
  margin: 0;
}
.lesson-studio-guide__checklist {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lesson-studio-guide__checklist li {
  position: relative;
  padding-left: 18px;
  color: #92a7bb;
  font-size: 11.5px;
  line-height: 1.4;
}
.lesson-studio-guide__checklist li::before {
  content: "→";
  position: absolute;
  left: 0;
  color: var(--p-cyan);
  font-weight: bold;
}
@media (max-width: 900px) {
  .lesson-layout--coach {
    grid-template-columns: 1fr;
  }
  .lesson-studio-guide {
    position: static;
  }
}

/* ── 4. Zen Mode / Focus Mode ── */
.lesson-modal.is-zen {
  max-width: 100vw;
  width: 100vw;
  height: 100vh;
  border-radius: 0;
  border: 0;
  inset: 0;
  position: fixed;
  background: #080d13;
}
.lesson-zen-toggle {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid #233446;
  border-radius: 8px;
  background: #111a24;
  color: #8fa1b4;
  cursor: pointer;
  transition: all 0.15s;
}
.lesson-zen-toggle:hover,
.lesson-zen-toggle.is-active {
  border-color: var(--p-cyan);
  color: #fff;
  background: rgba(100, 231, 220, 0.14);
}
.lesson-zen-toggle svg {
  width: 14px;
  height: 14px;
}

/* ── 5. Enhanced Flashcards Practice Runner ── */
.flashcards__practice-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  border: 1px solid rgba(100, 231, 220, 0.45);
  border-radius: 8px;
  padding: 0 13px;
  color: #081d1c;
  background: var(--p-cyan);
  font: 700 11.5px Inter, ui-sans-serif, system-ui, sans-serif;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 14px rgba(100, 231, 220, 0.18);
}
.flashcards__practice-cta:hover {
  background: #95f7ee;
  box-shadow: 0 0 20px rgba(100, 231, 220, 0.35);
  transform: translateY(-1px);
}
.flashcard__streak-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(240, 160, 80, 0.15);
  border: 1px solid rgba(240, 160, 80, 0.35);
  color: #ffb86c;
  font: 700 10.5px Inter, sans-serif;
  border-radius: 999px;
  padding: 1px 7px;
  margin-left: 8px;
}
.flashcard-modal__rating-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  flex-wrap: wrap;
}
.flashcard-modal__rating-label {
  font-size: 11.5px;
  color: #8da2b6;
  font-weight: 600;
}
.flashcard-modal__ratings {
  display: flex;
  align-items: center;
  gap: 6px;
}
.flashcard-rating-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 32px;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 0 10px;
  font: 650 11px Inter, sans-serif;
  cursor: pointer;
  transition: all 0.15s;
}
.flashcard-rating-btn kbd {
  font: 700 9px "JetBrains Mono", monospace;
  background: rgba(0, 0, 0, 0.25);
  padding: 1px 4px;
  border-radius: 3px;
}
.rating-again {
  background: rgba(245, 101, 101, 0.12);
  border-color: rgba(245, 101, 101, 0.35);
  color: #feb2b2;
}
.rating-again:hover {
  background: rgba(245, 101, 101, 0.25);
  color: #fff;
}
.rating-hard {
  background: rgba(237, 137, 54, 0.12);
  border-color: rgba(237, 137, 54, 0.35);
  color: #fbd38d;
}
.rating-hard:hover {
  background: rgba(237, 137, 54, 0.25);
  color: #fff;
}
.rating-good {
  background: rgba(66, 153, 225, 0.12);
  border-color: rgba(66, 153, 225, 0.35);
  color: #bee3f8;
}
.rating-good:hover {
  background: rgba(66, 153, 225, 0.25);
  color: #fff;
}
.rating-easy {
  background: rgba(72, 187, 120, 0.12);
  border-color: rgba(72, 187, 120, 0.35);
  color: #c6f6d5;
}
.rating-easy:hover {
  background: rgba(72, 187, 120, 0.25);
  color: #fff;
}
.flashcard-modal__flip-hint {
  margin-top: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  color: #64e7dc;
  background: rgba(100, 231, 220, 0.08);
  border: 1px solid rgba(100, 231, 220, 0.2);
  border-radius: 6px;
  padding: 4px 10px;
}
.flashcard-modal__flip-hint kbd {
  font: 700 9.5px "JetBrains Mono", monospace;
  background: rgba(0, 0, 0, 0.3);
  padding: 1px 5px;
  border-radius: 3px;
  color: #fff;
}
.flashcard-modal--complete {
  text-align: center;
  padding: 40px 24px;
}
.flashcard-complete-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.flashcard-complete-emoji {
  font-size: 48px;
}
.flashcard-complete-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}
`;

fs.appendFileSync(cssPath, newStyles, "utf8");
console.log("product-ui.css updated successfully!");
