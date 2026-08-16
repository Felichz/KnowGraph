import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appJsxPath = path.resolve(__dirname, "..", "src", "App.jsx");
const flashcardViewPath = path.resolve(__dirname, "..", "src", "components", "FlashcardView.jsx");
const providerSettingsPath = path.resolve(__dirname, "..", "src", "components", "ProviderSettingsPanel.jsx");
const cssPath = path.resolve(__dirname, "..", "src", "product-ui.css");

// 1. UPDATE FlashcardView.jsx WITH TTS
let flashcardContent = fs.readFileSync(flashcardViewPath, "utf8");

if (!flashcardContent.includes("const [speaking, setSpeaking] = useState(false);")) {
  // Add speaking state after practiceComplete state
  flashcardContent = flashcardContent.replace(
    'const [practiceComplete, setPracticeComplete] = useState(false);',
    `const [practiceComplete, setPracticeComplete] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const toggleSpeech = useCallback((textToRead) => {
    if (typeof window === "undefined" || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
    const synth = window.speechSynthesis;
    if (synth.speaking || speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    if (!textToRead) return;
    synth.cancel();
    const utterance = new window.SpeechSynthesisUtterance(textToRead);
    utterance.lang = "es-419";
    utterance.rate = 1.0;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synth.speak(utterance);
  }, [speaking]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [activeCardId, modalFlipped]);`
  );

  // Replace user attempt section with TTS header
  const targetAttempt = `<div className="flashcard-modal__user-attempt">
                        <span className="flashcard-modal__eyebrow">TU RESPUESTA EVALUADA</span>
                        <ReadingChunks text={attempt.answer} className="flashcard-modal__long-answer" />`;

  const replacementAttempt = `<div className="flashcard-modal__user-attempt">
                        <div className="flashcard-modal__user-attempt-header">
                          <span className="flashcard-modal__eyebrow">TU RESPUESTA EVALUADA</span>
                          <button
                            type="button"
                            className={\`flashcard-tts-btn \${speaking ? "is-playing" : ""}\`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSpeech(attempt.answer);
                            }}
                            aria-label={speaking ? "Detener lectura de tu respuesta" : "Leer tu respuesta en voz alta"}
                            title={speaking ? "Detener lectura" : "Leer tu respuesta en voz alta"}
                          >
                            {speaking ? (
                              <>
                                <svg viewBox="0 0 20 20" aria-hidden="true" className="tts-icon-pulse"><path d="M6 5h3v10H6zm5 0h3v10h-3z" fill="currentColor" /></svg>
                                <span>Detener</span>
                              </>
                            ) : (
                              <>
                                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M9 4.5 5 8H2v4h3l4 3.5v-11ZM13.5 6.5a5 5 0 0 1 0 7M16 4a9 9 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <span>Escuchar mi respuesta</span>
                              </>
                            )}
                          </button>
                        </div>
                        <ReadingChunks text={attempt.answer} className="flashcard-modal__long-answer" />`;

  flashcardContent = flashcardContent.replace(targetAttempt, replacementAttempt);
  fs.writeFileSync(flashcardViewPath, flashcardContent, "utf8");
  console.log("FlashcardView.jsx updated with TTS!");
}

// 2. UPDATE ProviderSettingsPanel.jsx WITH BACKUP MANAGEMENT SECTION
let providerContent = fs.readFileSync(providerSettingsPath, "utf8");

if (!providerContent.includes("onExportBackup")) {
  providerContent = providerContent.replace(
    'export function ProviderSettingsPanel({ open, profile, onClose, onSaved }) {',
    'export function ProviderSettingsPanel({ open, profile, onClose, onSaved, onExportBackup, onImportBackup }) {'
  );

  const backupSectionJsx = `          <section className="provider-backup-section" aria-label="Gestión de datos y respaldo">
            <div className="provider-backup-section__header">
              <span className="guide-kicker">GESTIÓN DE DATOS Y RESPALDO</span>
              <p>Exportá tu progreso, borradores de respuestas y configuración en JSON para respaldar o sincronizar entre dispositivos.</p>
            </div>
            <div className="provider-backup-section__actions">
              <button
                type="button"
                className="provider-backup-btn"
                onClick={onExportBackup}
              >
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v10m-4-4 4 4 4-4M3 15v2h14v-2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Exportar respaldo (.json)
              </button>
              <button
                type="button"
                className="provider-backup-btn"
                onClick={onImportBackup}
              >
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 13V3m-4 4 4-4 4 4M3 15v2h14v-2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Importar respaldo (.json)
              </button>
            </div>
          </section>

          <p className="provider-storage-note">`;

  providerContent = providerContent.replace('<p className="provider-storage-note">', backupSectionJsx);
  fs.writeFileSync(providerSettingsPath, providerContent, "utf8");
  console.log("ProviderSettingsPanel.jsx updated with Backup section!");
}

// 3. UPDATE App.jsx TO PASS PROPS AND CLEAN UP DRAWER FOOTER
let appContent = fs.readFileSync(appJsxPath, "utf8");

// Pass props to ProviderSettingsPanel
appContent = appContent.replace(
  '<ProviderSettingsPanel\n        open={providerSettingsOpen}\n        profile={providerProfile}\n        onClose={() => setProviderSettingsOpen(false)}\n        onSaved={setProviderProfile}\n      />',
  `<ProviderSettingsPanel
        open={providerSettingsOpen}
        profile={providerProfile}
        onClose={() => setProviderSettingsOpen(false)}
        onSaved={setProviderProfile}
        onExportBackup={exportBackup}
        onImportBackup={() => backupInputRef.current?.click()}
      />`
);

// Replace workspace-nav-backup in drawer with sleek footer
const oldNavBackup = `<div className="workspace-nav-backup" aria-label="Respaldo y datos locales">
            <div className="workspace-nav-section-title">
              <span>DATOS Y RESPALDO</span>
              <small>Exportá o restaurá tu progreso en JSON</small>
            </div>
            <div className="workspace-nav-backup__buttons">
              <button type="button" className="workspace-nav-backup__btn" onClick={exportBackup}>
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v10m-4-4 4 4 4-4M3 15v2h14v-2" /></svg>
                Exportar datos
              </button>
              <button type="button" className="workspace-nav-backup__btn" onClick={() => backupInputRef.current?.click()}>
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 13V3m-4 4 4-4 4 4M3 15v2h14v-2" /></svg>
                Importar datos
              </button>
            </div>
          </div>`;

const newNavFooter = `<div className="workspace-nav-footer">
            <button
              type="button"
              className="workspace-nav-settings-btn"
              onClick={() => {
                setWorkspaceNavOpen(false);
                setProgressPanelOpen(false);
                setProviderSettingsOpen(true);
              }}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2a2 2 0 0 0-2 2c0 .4-.1.8-.4 1.1-.3.3-.7.4-1.1.4A2 2 0 0 0 4.5 7.5c-.3.3-.7.4-1.1.4A2 2 0 0 0 2 10a2 2 0 0 0 2 2c.4 0 .8.1 1.1.4.3.3.4.7.4 1.1A2 2 0 0 0 7.5 17.5c.3.3.4.7.4 1.1A2 2 0 0 0 10 20a2 2 0 0 0 2-2c0-.4.1-.8.4-1.1.3-.3.7-.4 1.1-.4A2 2 0 0 0 15.5 14.5c.3-.3.7-.4 1.1-.4A2 2 0 0 0 18 12a2 2 0 0 0-2-2c-.4 0-.8-.1-1.1-.4-.3-.3-.4-.7-.4-1.1A2 2 0 0 0 12.5 4.5c-.3-.3-.4-.7-.4-1.1A2 2 0 0 0 10 2zM10 13a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
              <span>Ajustes, IA y Respaldo</span>
            </button>
          </div>`;

if (appContent.includes(oldNavBackup)) {
  appContent = appContent.replace(oldNavBackup, newNavFooter);
}
fs.writeFileSync(appJsxPath, appContent, "utf8");
console.log("App.jsx updated!");

// 4. APPEND CSS FOR FLASHCARD TTS AND PROVIDER BACKUP SECTION
const additionalCss = `
/* ══════════════════════════════════════════════════════════════════════════════
   FLASHCARD TTS & PROVIDER BACKUP SECTION STYLING
   ══════════════════════════════════════════════════════════════════════════════ */

.flashcard-modal__user-attempt-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 12px !important;
  margin-bottom: 8px !important;
}

.flashcard-modal__user-attempt-header .flashcard-modal__eyebrow {
  margin-bottom: 0 !important;
}

.flashcard-tts-btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  height: 28px !important;
  padding: 0 10px !important;
  border: 1px solid rgba(100, 231, 220, .3) !important;
  border-radius: 6px !important;
  background: rgba(100, 231, 220, .08) !important;
  color: #64e7dc !important;
  font: 600 11px Inter, ui-sans-serif, system-ui, sans-serif !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
}

.flashcard-tts-btn:hover {
  background: rgba(100, 231, 220, .18) !important;
  border-color: #64e7dc !important;
  color: #fff !important;
  box-shadow: 0 0 10px rgba(100, 231, 220, .25) !important;
}

.flashcard-tts-btn.is-playing {
  background: rgba(245, 158, 11, .15) !important;
  border-color: #f59e0b !important;
  color: #f59e0b !important;
}

.flashcard-tts-btn.is-playing:hover {
  background: rgba(245, 158, 11, .25) !important;
  color: #fff !important;
}

.flashcard-tts-btn svg {
  width: 14px !important;
  height: 14px !important;
}

.tts-icon-pulse {
  animation: tts-pulse 1s infinite alternate ease-in-out;
}

@keyframes tts-pulse {
  from { opacity: 0.6; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1.08); }
}

.workspace-nav-footer {
  margin-top: auto !important;
  padding: 10px 12px 14px !important;
  border-top: 1px solid var(--p-line) !important;
  background: #090e14 !important;
}

.workspace-nav-settings-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  width: 100% !important;
  height: 34px !important;
  border: 1px solid #233244 !important;
  border-radius: 7px !important;
  background: #111822 !important;
  color: #94a3b8 !important;
  font: 600 12px Inter, ui-sans-serif, system-ui, sans-serif !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
}

.workspace-nav-settings-btn:hover {
  background: #182330 !important;
  border-color: var(--p-line-strong) !important;
  color: #e2e8f0 !important;
}

.workspace-nav-settings-btn svg {
  width: 15px !important;
  height: 15px !important;
}

/* Provider Modal Backup Section */
.provider-backup-section {
  display: grid !important;
  gap: 10px !important;
  padding: 14px 16px !important;
  margin: 14px 0 !important;
  border: 1px solid #1c2a3b !important;
  border-radius: 10px !important;
  background: linear-gradient(145deg, rgba(100, 231, 220, .03), transparent 70%), #0d141e !important;
}

.provider-backup-section__header {
  display: grid !important;
  gap: 3px !important;
}

.provider-backup-section__header p {
  color: #7b8a9e !important;
  font-size: 11.5px !important;
  line-height: 1.4 !important;
  margin: 0 !important;
}

.provider-backup-section__actions {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 10px !important;
}

.provider-backup-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 7px !important;
  height: 38px !important;
  padding: 0 12px !important;
  border: 1px solid #283a50 !important;
  border-radius: 8px !important;
  background: #141e2b !important;
  color: #d1dbe7 !important;
  font: 600 12px Inter, ui-sans-serif, system-ui, sans-serif !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
}

.provider-backup-btn:hover {
  background: #1c2b3d !important;
  border-color: #64e7dc !important;
  color: #64e7dc !important;
  box-shadow: 0 0 12px rgba(100, 231, 220, .15) !important;
}

.provider-backup-btn svg {
  width: 15px !important;
  height: 15px !important;
}
`;

fs.appendFileSync(cssPath, additionalCss, "utf8");
console.log("CSS updated!");
