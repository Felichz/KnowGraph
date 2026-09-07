import React, { useRef, useState } from "react";
import { applyBackup, createBackup, downloadBackup, parseBackup } from "../../ai/backup.js";

export function BackupActions() {
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState("");

  const handleExport = async () => {
    try {
      setStatus("Exportando respaldo...");
      const backup = await createBackup();
      await downloadBackup(backup);
      setStatus("✓ Respaldo exportado correctamente.");
    } catch (err) {
      setStatus("Error al exportar: " + err.message);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setStatus("Restaurando respaldo...");
      const text = await file.text();
      const backup = parseBackup(text);
      await applyBackup(backup);
      setStatus("✓ Respaldo restaurado con éxito. Recargando...");
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      setStatus("Error al restaurar: " + err.message);
    }
  };

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "18px", borderTop: "1px solid var(--border-line)" }}>
      <div>
        <h4 style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>DATOS Y RESPALDO LOCAL</h4>
        <p style={{ margin: "4px 0 0", fontSize: "11.5px", color: "var(--text-secondary)", lineHeight: 1.45 }}>
          Exportá todas tus notas, borradores e historial a un archivo JSON para migrar o hacer backup.
        </p>
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={handleExport}
          style={{ padding: "8px 14px", background: "rgba(94, 234, 212, 0.12)", border: "1px solid var(--border-accent)", borderRadius: "var(--radius-control)", color: "var(--accent-cyan)", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
        >
          Exportar respaldo JSON
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{ padding: "8px 14px", background: "var(--bg-surface-raised)", border: "1px solid var(--border-line-strong)", borderRadius: "var(--radius-control)", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
        >
          Importar respaldo...
        </button>
        <input ref={fileInputRef} type="file" accept=".json,application/json" hidden onChange={handleFileChange} />
      </div>

      {status && <span style={{ fontSize: "11px", fontWeight: 500, color: status.startsWith("✓") ? "var(--accent-green)" : "var(--accent-red)" }}>{status}</span>}
    </section>
  );
}
