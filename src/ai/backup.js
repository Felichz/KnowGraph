import {
  exportLearningState,
  importLearningState,
} from "./learningStore.js";
import {
  exportProviderSettings,
  importProviderSettings,
} from "./providerSettings.js";

export const BACKUP_APP_ID = "learning-workspace";
export const BACKUP_KIND = "state-backup";
export const BACKUP_VERSION = 1;

export async function createBackup() {
  const [learning, providers] = await Promise.all([
    exportLearningState(),
    exportProviderSettings(),
  ]);
  return {
    app: BACKUP_APP_ID,
    kind: BACKUP_KIND,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    secretsIncluded: true,
    learning,
    providers,
  };
}

export function parseBackup(text) {
  const value = JSON.parse(text);
  if (!value || typeof value !== "object" || value.app !== BACKUP_APP_ID || value.kind !== BACKUP_KIND || value.version !== BACKUP_VERSION) {
    throw new Error("El archivo no es un respaldo válido de Learning Workspace.");
  }
  return value;
}

export async function applyBackup(value) {
  if (value?.providers && typeof value.providers === "object") {
    await importProviderSettings(value.providers);
  }
  await importLearningState(value?.learning ?? null);
}

export async function downloadBackup(backup) {
  const jsonContent = JSON.stringify(backup, null, 2);
  const defaultFilename = `learning-workspace-backup-${new Date().toISOString().slice(0, 10)}.json`;

  if (typeof window !== "undefined" && window.learningDesktop?.backup?.save) {
    const result = await window.learningDesktop.backup.save(jsonContent, defaultFilename);
    if (result?.canceled) return;
    if (!result?.success) {
      throw new Error(result?.error || "Error al guardar el archivo en disco.");
    }
    return;
  }

  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.style.display = "none";
  anchor.href = url;
  anchor.download = defaultFilename;
  document.body.appendChild(anchor);
  anchor.click();
  setTimeout(() => {
    try {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch {}
  }, 1000);
}
