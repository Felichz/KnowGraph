import React, { useState } from "react";
import { applyBackup, createBackup, downloadBackup, parseBackup } from "../../ai/backup.js";

export function BackupActions({ onRestoreSuccess }) {
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const backup = await createBackup();
      await downloadBackup(backup);
      setStatus({ type: "success", message: "Respaldo generado con éxito." });
    } catch (err) {
      setStatus({ type: "error", message: `Error al exportar: ${err.message}` });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backup = parseBackup(text);
      await applyBackup(backup);
      setStatus({ type: "success", message: "✓ Respaldo restaurado con éxito" });
      onRestoreSuccess?.();
    } catch (err) {
      setStatus({ type: "error", message: `Error al restaurar: ${err.message || "Archivo inválido"}` });
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "14px", borderTop: "1px solid var(--border-line)" }}>
      <h4 style={{ margin: 0, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase" }}>
        DATOS Y RESPALDO LOCAL
      </h4>

      <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
        Descargá una copia JSON con tus intentos, notas y configuración BYOK, o restaurala en cualquier dispositivo.
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={handleExport}
          disabled={isExporting}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            background: "rgba(255, 255, 255, 0.06)",
            color: "var(--text-primary)",
            fontSize: "12px",
            fontWeight: 600,
            border: "1px solid var(--border-line)",
            cursor: "pointer",
          }}
        >
          {isExporting ? "Generando..." : "Exportar respaldo JSON"}
        </button>

        <label
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            background: "rgba(255, 255, 255, 0.04)",
            color: "var(--text-secondary)",
            fontSize: "12px",
            fontWeight: 600,
            border: "1px solid var(--border-line)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>Importar respaldo JSON</span>
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {status.message && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "12px",
            background: status.type === "success" ? "rgba(74, 222, 128, 0.1)" : "rgba(239, 68, 68, 0.1)",
            color: status.type === "success" ? "var(--color-status-success, #4ADE80)" : "var(--color-status-error, #F87171)",
            border: status.type === "success" ? "1px solid rgba(74, 222, 128, 0.25)" : "1px solid rgba(239, 68, 68, 0.25)",
          }}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}
