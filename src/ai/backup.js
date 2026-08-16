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
    secretsIncluded: false,
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

export function downloadBackup(backup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `learning-workspace-backup-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
