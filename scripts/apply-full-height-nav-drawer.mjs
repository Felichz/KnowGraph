import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appJsxPath = path.resolve(__dirname, "..", "src", "App.jsx");
const cssPath = path.resolve(__dirname, "..", "src", "product-ui.css");

let appContent = fs.readFileSync(appJsxPath, "utf8");

const navDrawerJsx = `      <section className={\`map-workspace \${workspaceNavOpen ? "is-nav-open" : "is-nav-closed"} \${progressPanelOpen ? "is-progress-open" : "is-progress-closed"} \${providerSettingsOpen ? "is-provider-open" : "is-provider-closed"}\`} aria-label="Workspace de aprendizaje">
        <nav id="workspace-navigation" className="workspace-nav-drawer" aria-label="Navegación del workspace">
          <div className="graph-switcher" aria-label="Elegir grafo">
            <div className="workspace-nav-heading">
              <div><span>WORKSPACE</span><strong>Navegación</strong></div>
              <button type="button" onClick={() => setWorkspaceNavOpen(false)} aria-label="Cerrar navegación"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg></button>
            </div>
            <span className="workspace-nav-label">MAPA DE CONOCIMIENTO</span>
            {Object.values(GRAPH_CONFIGS).map((item) => (
              <button key={item.id} className={\`graph-switch \${item.id === graphKey ? "is-active" : ""}\`} onClick={() => switchGraph(item.id)}>
                {item.label}
              </button>
            ))}
            <ViewModeToggle mode={viewMode} onChange={setViewMode} />
          </div>

          <div className="legend">
            <div className="workspace-nav-section-title"><span>FOCO</span><small>Elegí un grupo para aislarlo</small></div>
            <button className={\`category-chip category-all \${activeCats.size === Object.keys(graph.categories).length ? "is-active" : ""}\`} onClick={showAllCategories} aria-pressed={activeCats.size === Object.keys(graph.categories).length}>Todos</button>
            {Object.entries(graph.categories).map(([key, category]) => {
              const active = activeCats.has(key);
              const categoryNodes = graph.nodes.filter((node) => node.cat === key);
              const focused = activeCats.size === 1 && active;
              return (
                <button key={key} className={\`category-chip \${focused ? "is-focused" : ""}\`} onClick={() => focusCategory(key)} aria-pressed={focused} style={{ "--category-color": category.color, opacity: active ? 1 : 0.42 }}>
                  <span className="category-dot" style={{ background: category.color }} />{category.label}<span className="category-count">{categoryNodes.filter((node) => checked.has(node.id)).length}/{categoryNodes.length}</span>
                </button>
              );
            })}
          </div>

          <div className="map-focus-strip" aria-label="Próximo desafío sugerido">
            <div className="map-focus-strip__copy">
              <span>PRÓXIMO DESAFÍO</span>
              <strong>{primaryNext ? primaryNext.label : "Ruta completada"}</strong>
            </div>
            <span className="map-focus-strip__scope">
              {activeCats.size === Object.keys(graph.categories).length
                ? "Viendo la ruta completa"
                : \`Foco: \${[...activeCats].map((key) => graph.categories[key]?.label).filter(Boolean).join(", ")}\`}
            </span>
            {primaryNext && (
              <button type="button" onClick={() => openLesson(primaryNext)}>
                Abrir card <span aria-hidden="true">→</span>
              </button>
            )}
          </div>

          <div className="workspace-nav-backup" aria-label="Respaldo y datos locales">
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
          </div>
        </nav>`;

// Replace from <section className={`map-workspace up to <aside id="workspace-progress-panel"
const regex = /<section className=\{`map-workspace[\s\S]*?<aside id="workspace-progress-panel"/;
if (regex.test(appContent)) {
  appContent = appContent.replace(regex, `${navDrawerJsx}\n\n      <aside id="workspace-progress-panel"`);
  fs.writeFileSync(appJsxPath, appContent, "utf8");
  console.log("App.jsx updated with workspace-nav-drawer and Backup UI!");
} else {
  console.error("Could not find map-workspace pattern in App.jsx");
}

const navDrawerCss = `
/* ══════════════════════════════════════════════════════════════════════════════
   FULL HEIGHT NAVIGATION DRAWER & VISIBLE BACKUP UI
   ══════════════════════════════════════════════════════════════════════════════ */

.desktop-shell > .map-workspace.is-nav-closed > .workspace-nav-drawer {
  display: none !important;
}

.desktop-shell > .map-workspace.is-nav-open {
  display: grid !important;
  grid-template-areas:
    "nav map"
    "nav route"
    "milestones milestones"
    "seniority seniority" !important;
  grid-template-columns: 310px minmax(0, 1fr) !important;
  grid-template-rows: minmax(560px, 68dvh) auto auto auto !important;
}

.desktop-shell > .map-workspace.is-nav-open.is-progress-open {
  grid-template-areas:
    "nav map progress"
    "nav route progress"
    "milestones milestones milestones"
    "seniority seniority seniority" !important;
  grid-template-columns: 290px minmax(0, 1fr) clamp(320px, 23vw, 368px) !important;
}

.workspace-nav-drawer {
  grid-area: nav !important;
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
  min-height: 100% !important;
  border-right: 1px solid var(--p-line) !important;
  background: #0e141c !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  scrollbar-width: thin !important;
  scrollbar-color: #2b3a4d transparent !important;
  z-index: 10 !important;
}

.workspace-nav-drawer .graph-switcher {
  display: flex !important;
  flex-direction: column !important;
  gap: 6px !important;
  padding: 14px 13px 13px !important;
  background: #10161e !important;
  border-bottom: 1px solid var(--p-line) !important;
}

.workspace-nav-drawer .legend {
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
  padding: 12px 10px !important;
  background: #0d131a !important;
  border-bottom: 1px solid var(--p-line) !important;
  max-height: 280px !important;
  overflow-y: auto !important;
  scrollbar-width: thin !important;
}

.workspace-nav-drawer .map-focus-strip {
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
  padding: 12px 13px !important;
  background: linear-gradient(145deg, rgba(243, 189, 82, .055), transparent 70%), #10161e !important;
  border-bottom: 1px solid var(--p-line) !important;
}

.workspace-nav-backup {
  margin-top: auto !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
  padding: 14px 13px !important;
  background: #0a0f15 !important;
  border-top: 1px solid var(--p-line) !important;
}

.workspace-nav-backup .workspace-nav-section-title {
  display: grid !important;
  gap: 4px !important;
  margin: 0 0 6px !important;
}

.workspace-nav-backup .workspace-nav-section-title span {
  color: #738093 !important;
  font: 750 10px "JetBrains Mono", ui-monospace, monospace !important;
  letter-spacing: .13em !important;
}

.workspace-nav-backup .workspace-nav-section-title small {
  color: #687587 !important;
  font-size: 11px !important;
  line-height: 1.35 !important;
}

.workspace-nav-backup__buttons {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 8px !important;
}

.workspace-nav-backup__btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
  height: 34px !important;
  padding: 0 10px !important;
  border: 1px solid #233244 !important;
  border-radius: 7px !important;
  background: #131c27 !important;
  color: #cbd5e1 !important;
  font: 600 11.5px Inter, ui-sans-serif, system-ui, sans-serif !important;
  cursor: pointer !important;
  transition: all 0.15s ease !important;
  white-space: nowrap !important;
}

.workspace-nav-backup__btn:hover {
  background: #1b2837 !important;
  border-color: #64e7dc !important;
  color: #64e7dc !important;
}

.workspace-nav-backup__btn svg {
  width: 14px !important;
  height: 14px !important;
  stroke: currentColor !important;
  fill: none !important;
  stroke-width: 1.8 !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
}
`;

fs.appendFileSync(cssPath, navDrawerCss, "utf8");
console.log("product-ui.css updated with full height nav drawer and backup CSS!");
