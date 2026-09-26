import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { applyBackup, createBackup, downloadBackup, parseBackup } from "../../ai/backup.js";
import { Button } from "../primitives/Button.jsx";
import { ConfirmDialog } from "../primitives/ConfirmDialog.jsx";
import { Notice } from "../primitives/Feedback.jsx";
import { toast } from "../state/toastStore.js";
import { refreshProgress } from "../state/progressStore.js";
import { notifyProviderChanged } from "../hooks/useProviderLabel.js";

// Respaldo local: exportar/importar progreso, borradores y conexiones (incluye API keys).
export function BackupSection({ onRestored }) {
  const input = useRef(null);
  const [pending, setPending] = useState(null);
  const [error, setError] = useState(null);

  const exportNow = async () => {
    try { await downloadBackup(await createBackup()); toast({ tone: "success", message: "Respaldo descargado." }); } catch (e) { setError(e.message); }
  };
  const onFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try { setPending(parseBackup(await file.text())); setError(null); } catch (e) { setError(e.message || "El archivo no es un respaldo válido."); }
  };
  const restore = async () => {
    try {
      await applyBackup(pending);
      setPending(null);
      ["react", "rails"].forEach((g) => refreshProgress(g));
      notifyProviderChanged(); onRestored?.();
      toast({ tone: "success", message: "Respaldo restaurado." });
    } catch (e) { setPending(null); setError(e.message); }
  };

  return (
    <section className="settings__section">
      <h3 className="settings__h">Respaldo</h3>
      <p className="t2">Guarda tu progreso, borradores e intentos en un archivo JSON. <strong>El archivo incluye las API keys de tus conexiones</strong>: guardalo en un lugar privado.</p>
      {error && <Notice tone="error">{error}</Notice>}
      <div className="settings__row">
        <Button variant="secondary" icon={Download} onClick={exportNow}>Exportar</Button>
        <Button variant="ghost" icon={Upload} onClick={() => input.current?.click()}>Importar…</Button>
        <input ref={input} type="file" accept="application/json,.json" hidden onChange={onFile} />
      </div>
      <ConfirmDialog open={Boolean(pending)} title="¿Restaurar este respaldo?" destructive confirmLabel="Restaurar"
        body="Reemplaza el progreso, los borradores y las conexiones de este navegador por los del archivo. No se puede deshacer."
        onConfirm={restore} onCancel={() => setPending(null)} />
    </section>
  );
}
