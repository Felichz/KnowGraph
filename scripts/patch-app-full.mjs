import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appPath = path.resolve(__dirname, "..", "src", "App.jsx");

let content = fs.readFileSync(appPath, "utf8");

// 1. Ensure CommandPalette import
if (!content.includes('import { CommandPalette }')) {
  content = content.replace(
    'import { ProviderSettingsPanel } from "./components/ProviderSettingsPanel.jsx";',
    'import { ProviderSettingsPanel } from "./components/ProviderSettingsPanel.jsx";\nimport { CommandPalette } from "./components/CommandPalette.jsx";'
  );
}

// 2. Add search trigger button in commandbar if not present
if (!content.includes('desktop-commandbar__search-trigger')) {
  const target = `        <button
          type="button"
          className={\`workspace-provider-toggle \${providerSettingsOpen ? "is-active" : ""}\`}`;
  const replacement = `        <button
          type="button"
          className="desktop-commandbar__search-trigger"
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="Buscar concepto o acción (Ctrl+K)"
          title="Buscar concepto o acción (Ctrl+K)"
        >
          <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="M16 16l-3.5-3.5" />
          </svg>
          <span>Buscar concepto...</span>
          <kbd>Ctrl K</kbd>
        </button>
${target}`;
  content = content.replace(target, replacement);
}

// 3. Add zen toggle in lesson header actions if not present
if (!content.includes('lesson-zen-toggle')) {
  const target = `{lessonHistory.length > 0 && <button className="modal-back"`;
  const replacement = `<button
                className={\`lesson-zen-toggle \${zenMode ? "is-active" : ""}\`}
                type="button"
                aria-label={zenMode ? "Salir de modo Zen" : "Modo Zen (pantalla completa)"}
                title={zenMode ? "Salir de modo Zen (Esc)" : "Modo concentración Zen"}
                onClick={() => setZenMode((z) => !z)}
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7V3h4M17 7V3h-4M3 13v4h4M17 13v4h-4"/>
                </svg>
              </button>
              ${target}`;
  content = content.replace(target, replacement);
}

// 4. In lesson-modal class, add is-zen
if (!content.includes('${zenMode ? "is-zen" : ""}')) {
  content = content.replace(
    'className={`lesson-modal ${lessonContextOpen ? "is-context-open" : "is-context-closed"}`}',
    'className={`lesson-modal ${lessonContextOpen ? "is-context-open" : "is-context-closed"} ${zenMode ? "is-zen" : ""}`}'
  );
}

// 5. In lesson-layout, inject Split Studio guide when lessonView === "coach"
if (!content.includes('lesson-studio-guide')) {
  const target = `<div className={\`lesson-layout lesson-layout--\${lessonView}\`}>
            <article className={\`lesson-content lesson-content--\${lessonView}\`}`;
  const replacement = `<div className={\`lesson-layout lesson-layout--\${lessonView} \${zenMode ? "is-zen" : ""}\`}>
            {lessonView === "coach" && !zenMode && (
              <aside className="lesson-studio-guide" aria-label="Guía de referencia rápida">
                <div className="lesson-studio-guide__section">
                  <span className="lesson-section-label">EN UNA FRASE</span>
                  <p className="lesson-studio-guide__summary">{selected.lesson.summary}</p>
                </div>
                {selected.lesson.why && (
                  <div className="lesson-studio-guide__section">
                    <span className="lesson-section-label">POR QUÉ IMPORTA</span>
                    <p className="lesson-studio-guide__why">{selected.lesson.why}</p>
                  </div>
                )}
                {selected.lesson.prompt && (
                  <div className="lesson-studio-guide__section lesson-studio-guide__prompt">
                    <span className="lesson-section-label">CONSIGNA ESPERADA</span>
                    <p>{selected.lesson.prompt}</p>
                  </div>
                )}
                {selected.lesson.steps?.length > 0 && (
                  <div className="lesson-studio-guide__section">
                    <span className="lesson-section-label">PUNTOS CLAVE PARA CUBRIR</span>
                    <ul className="lesson-studio-guide__checklist">
                      {selected.lesson.steps.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>
            )}
            <article className={\`lesson-content lesson-content--\${lessonView} \${lessonView === "coach" && !zenMode ? "is-split" : ""}\`}`;
  content = content.replace(target, replacement);
}

// 6. Inject CommandPalette before </main>
if (!content.includes('<CommandPalette')) {
  const target = `    </main>`;
  const replacement = `      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        graph={graph}
        onSelectNode={(node) => openLesson(node, false)}
        onSwitchGraph={switchGraph}
        onOpenFlashcards={() => setViewMode("flashcards")}
        onOpenProviderSettings={() => setProviderSettingsOpen(true)}
        onOpenProgress={() => setProgressPanelOpen(true)}
        graphConfigs={GRAPH_CONFIGS}
        activeGraphKey={graphKey}
      />
    </main>`;
  content = content.replace(target, replacement);
}

fs.writeFileSync(appPath, content, "utf8");
console.log("App.jsx patched successfully!");
