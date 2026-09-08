import React, { useEffect, useState } from "react";
import { createProviderDraft, loadProviderSettings, saveProviderProfile } from "../../ai/providerSettings.js";
import { testAiProvider } from "../../ai/client.js";
import { BackupActions } from "./BackupActions.jsx";

export function ProviderModal({ isOpen, onClose, onRefreshData }) {
  const [providerKey, setProviderKey] = useState("openrouter");
  const [draft, setDraft] = useState(() => createProviderDraft("openrouter"));
  const [testStatus, setTestStatus] = useState({ state: "idle", message: "" });
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadProviderSettings().then((s) => {
        const active = s.profiles.find((p) => p.id === s.activeProfileId);
        if (active) { setProviderKey(active.adapter || "openrouter"); setDraft(active); }
      }).catch(console.error);
    }
  }, [isOpen]);

  const handleProviderChange = (adapter) => {
    setProviderKey(adapter); setDraft(createProviderDraft(adapter)); setTestStatus({ state: "idle", message: "" });
  };

  const handleTest = async () => {
    setTestStatus({ state: "loading", message: "Probando conexión con el endpoint..." });
    try {
      const res = await testAiProvider({ provider: draft });
      setTestStatus({ state: "success", message: res?.ok ? "Conexión exitosa" : "Endpoint respondió correctamente." });
    } catch (err) {
      setTestStatus({ state: "error", message: `Error de conexión: ${err.message}` });
    }
  };

  const handleSave = async () => {
    try {
      await saveProviderProfile(draft, { activate: true });
      setSaveStatus("Configuración guardada y activada con éxito.");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      setSaveStatus(`Error al guardar: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 50, background: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: "600px", background: "var(--color-surface-overlay, #1E2532)",
        borderRadius: "14px", border: "1px solid var(--border-line)", padding: "24px",
        display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 24px 64px rgba(0,0,0,0.8)", maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>Proveedores de IA y Respaldo</h3>
          <button onClick={onClose} style={{ padding: "4px 8px", borderRadius: "6px", background: "rgba(255,255,255,0.06)", fontSize: "14px" }}>✕</button>
        </div>

        <div style={{ display: "flex", gap: "6px", background: "rgba(0,0,0,0.25)", padding: "3px", borderRadius: "8px" }}>
          {["openrouter", "openai", "ollama"].map((p) => (
            <button key={p} onClick={() => handleProviderChange(p)} style={{
              flex: 1, padding: "6px 0", borderRadius: "6px", fontSize: "12px", fontWeight: 600,
              background: providerKey === p ? "rgba(255,255,255,0.12)" : "transparent",
              color: providerKey === p ? "var(--text-primary)" : "var(--text-muted)",
            }}>
              {p === "openrouter" ? "OpenRouter" : p === "openai" ? "OpenAI" : "Ollama"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div>
            <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>Base URL</label>
            <input type="text" value={draft.baseUrl || ""} onChange={(e) => setDraft((p) => ({ ...p, baseUrl: e.target.value }))}
              style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-line)", color: "var(--text-primary)", fontSize: "13px" }} />
          </div>
          <div>
            <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>API Key</label>
            <input type="password" value={draft.apiKey || ""} placeholder="sk-..." onChange={(e) => setDraft((p) => ({ ...p, apiKey: e.target.value }))}
              style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-line)", color: "var(--text-primary)", fontSize: "13px" }} />
          </div>
          <div>
            <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>Modelo</label>
            <input type="text" value={draft.model || ""} onChange={(e) => setDraft((p) => ({ ...p, model: e.target.value }))}
              style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-line)", color: "var(--text-primary)", fontSize: "13px" }} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", alignItems: "center" }}>
          <button onClick={handleTest} style={{ padding: "8px 14px", borderRadius: "6px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--border-line)", fontSize: "12px", fontWeight: 600 }}>Probar conexión</button>
          <button onClick={handleSave} style={{ padding: "8px 16px", borderRadius: "6px", background: "var(--color-brand-primary, #5EEAD4)", color: "#0B0D13", fontSize: "12px", fontWeight: 700 }}>Guardar y Activar</button>
        </div>

        {testStatus.message && <div style={{ fontSize: "12px", color: testStatus.state === "error" ? "#F87171" : "#4ADE80" }}>{testStatus.message}</div>}
        {saveStatus && <div style={{ fontSize: "12px", color: "#4ADE80" }}>{saveStatus}</div>}
        <BackupActions onRestoreSuccess={onRefreshData} />
      </div>
    </div>
  );
}
