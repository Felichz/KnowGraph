import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.resolve(__dirname, "..", "src", "product-ui.css");
const providerSettingsPath = path.resolve(__dirname, "..", "src", "components", "ProviderSettingsPanel.jsx");

// 1. Update CSS to enforce footer order
const footerOrderCss = `
.workspace-nav-drawer > .workspace-nav-footer {
  order: 5 !important;
  margin-top: auto !important;
}
`;
fs.appendFileSync(cssPath, footerOrderCss, "utf8");

// 2. In ProviderSettingsPanel, also add Backup section at the bottom of catalog view if no connections, or make it always accessible
let providerContent = fs.readFileSync(providerSettingsPath, "utf8");

const catalogBackupJsx = `          <section className="provider-backup-section" aria-label="Gestión de datos y respaldo">
            <div className="provider-backup-section__header">
              <span className="guide-kicker">GESTIÓN DE DATOS Y RESPALDO</span>
              <p>Exportá o restaurá tu progreso de estudio, notas y configuración en formato JSON.</p>
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
        </div>
      )}`;

if (!providerContent.includes('aria-label="Gestión de datos y respaldo" in catalog')) {
  // Replace the closing of catalog view with backup block included
  providerContent = providerContent.replace(
    /\{\s*view === "catalog" && \([\s\S]*?<\/div>\s*\}\s*\)/,
    (match) => {
      if (match.includes("provider-backup-section")) return match;
      return match.replace(/<\/div>\s*\)\s*$/, catalogBackupJsx);
    }
  );
  fs.writeFileSync(providerSettingsPath, providerContent, "utf8");
}

console.log("Polish script finished!");
