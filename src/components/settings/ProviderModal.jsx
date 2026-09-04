import React, { useEffect, useState } from "react";
import {
  loadProviderProfile,
  saveProviderProfile,
  PROVIDER_LIBRARY,
} from "../../ai/providerSettings.js";
import { testAiProvider } from "../../ai/client.js";
import { BackupActions } from "./BackupActions.jsx";

export function ProviderModal({ open = false, onClose }) {
  const [draft, setDraft] = useState({ adapter: "openrouter", baseUrl: "https://openrouter.ai/api/v1", apiKey: "", model: "google/gemini-2.5-flash" });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    loadProviderProfile().then((profile) => {
      if (profile) {
        setDraft({
          adapter: profile.adapter || "openrouter",
          baseUrl: profile.baseUrl || "",
          apiKey: profile.apiKey || "",
          model: profile.model || "",
        });
      }
    });
  }, [open]);

  if (!open) return null;

  const handleSelectPreset = (presetId) => {
    const preset = PROVIDER_LIBRARY.find((p) => p.id === presetId);
    if (!preset) return;
    setDraft((prev) => ({
      adapter: preset.id,
      baseUrl: preset.baseUrl,
      apiKey: prev.apiKey,
      model: preset.defaultModel,
    }));
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testAiProvider({ provider: draft });
      setTestResult({ ok: true, msg: `✓ Conexión exitosa. Latencia: ${res.latencyMs || 0}ms` });
    } catch (err) {
      setTestResult({ ok: false, msg: `✕ Error: ${err.message || "Fallo de conexión"}` });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await saveProviderProfile(draft, { activate: true });
    setSavedMessage("✓ Configuración guardada correctamente");
    setTimeout(() => { setSavedMessage(""); onClose(); }, 600);
  };

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(9, 11, 15, 0.8)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 }} onClick={onClose} role="dialog" aria-label="Ajustes de IA y Respaldo">
      <div style={{ width: "100%", maxWidth: "540px", maxHeight: "90vh", overflowY: "auto", background: "var(--bg-surface)", border: "1px solid var(--border-line-strong)", borderRadius: "var(--radius-panel)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>Proveedores de IA y Respaldo</h3>
          <button type="button" onClick={onClose} style={{ fontSize: "20px", color: "var(--text-muted)" }}>×</button>
        </div>

        {/* Presets */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["openrouter", "openai", "groq", "ollama", "custom"].map((key) => {
            const p = PROVIDER_LIBRARY.find((item) => item.id === key) || { label: key };
            const isSel = draft.adapter === key;
            return (
              <button key={key} type="button" onClick={() => handleSelectPreset(key)} style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, background: isSel ? "var(--accent-cyan)" : "var(--bg-surface-raised)", color: isSel ? "var(--bg-workspace)" : "var(--text-secondary)" }}>
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "11px" }}>Endpoint Base URL</span>
            <input type="text" value={draft.baseUrl || ""} onChange={(e) => setDraft({ ...draft, baseUrl: e.target.value })} style={{ padding: "8px 10px", background: "var(--bg-canvas)", border: "1px solid var(--border-line)", borderRadius: "6px", color: "var(--text-primary)" }} required />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "11px" }}>API Key</span>
            <input type="password" value={draft.apiKey || ""} onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })} placeholder="sk-..." style={{ padding: "8px 10px", background: "var(--bg-canvas)", border: "1px solid var(--border-line)", borderRadius: "6px", color: "var(--text-primary)" }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "11px" }}>Modelo</span>
            <input type="text" value={draft.model || ""} onChange={(e) => setDraft({ ...draft, model: e.target.value })} placeholder="ej. gpt-4o, llama-3.3-70b" style={{ padding: "8px 10px", background: "var(--bg-canvas)", border: "1px solid var(--border-line)", borderRadius: "6px", color: "var(--text-primary)" }} required />
          </label>

          {testResult && (
            <div style={{ padding: "8px 12px", borderRadius: "6px", background: testResult.ok ? "rgba(85, 217, 138, 0.1)" : "rgba(239, 118, 104, 0.1)", color: testResult.ok ? "var(--accent-green)" : "var(--accent-red)", fontSize: "12px" }}>
              {testResult.msg}
            </div>
          )}
          {savedMessage && <div style={{ color: "var(--accent-green)", fontSize: "12px" }}>{savedMessage}</div>}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
            <button type="button" onClick={handleTest} disabled={testing || !draft.baseUrl} style={{ padding: "8px 12px", background: "var(--bg-surface-raised)", borderRadius: "6px", color: "var(--text-secondary)", fontSize: "12px" }}>
              {testing ? "Probando…" : "Probar conexión"}
            </button>
            <button type="submit" style={{ padding: "8px 16px", background: "var(--accent-cyan)", color: "var(--bg-workspace)", borderRadius: "6px", fontWeight: 700, fontSize: "12px" }}>
              Guardar y Activar
            </button>
          </div>
        </form>

        {/* Respaldo y portabilidad */}
        <BackupActions />
      </div>
    </div>
  );
}
