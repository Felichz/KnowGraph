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
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(4, 7, 14, 0.85)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200, padding: "20px" }} onClick={onClose} role="dialog" aria-label="Ajustes de IA y Respaldo">
      <div style={{ width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto", background: "linear-gradient(180deg, rgba(20, 27, 44, 0.96) 0%, rgba(11, 15, 26, 0.98) 100%)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "var(--radius-panel)", padding: "24px", display: "flex", flexDirection: "column", gap: "18px", boxShadow: "0 30px 80px -10px rgba(0, 0, 0, 0.9), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>⚙️</span> Proveedores de IA y Respaldo
          </h3>
          <button type="button" onClick={onClose} style={{ fontSize: "20px", color: "var(--text-muted)", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", cursor: "pointer" }}>×</button>
        </div>

        {/* Presets */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["openrouter", "openai", "groq", "ollama", "custom"].map((key) => {
            const p = PROVIDER_LIBRARY.find((item) => item.id === key) || { label: key };
            const isSel = draft.adapter === key;
            return (
              <button
                key={key} type="button" onClick={() => handleSelectPreset(key)}
                style={{
                  padding: "5px 12px", borderRadius: "var(--radius-pill)", fontSize: "11.5px", fontWeight: 600,
                  background: isSel ? "rgba(56, 189, 248, 0.18)" : "rgba(255, 255, 255, 0.04)",
                  color: isSel ? "var(--accent-cyan)" : "var(--text-secondary)",
                  border: isSel ? "1px solid rgba(56, 189, 248, 0.45)" : "1px solid var(--border-line)",
                  boxShadow: isSel ? "0 0 12px rgba(56, 189, 248, 0.2)" : "none",
                  cursor: "pointer",
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "11px", fontWeight: 600 }}>Endpoint Base URL</span>
            <input type="text" value={draft.baseUrl || ""} onChange={(e) => setDraft({ ...draft, baseUrl: e.target.value })} style={{ padding: "10px 12px", background: "rgba(9, 13, 23, 0.85)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "var(--radius-control)", color: "var(--text-primary)", outline: "none", fontSize: "13px" }} required />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "11px", fontWeight: 600 }}>API Key</span>
            <input type="password" value={draft.apiKey || ""} onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })} placeholder="sk-..." style={{ padding: "10px 12px", background: "rgba(9, 13, 23, 0.85)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "var(--radius-control)", color: "var(--text-primary)", outline: "none", fontSize: "13px" }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "11px", fontWeight: 600 }}>Modelo</span>
            <input type="text" value={draft.model || ""} onChange={(e) => setDraft({ ...draft, model: e.target.value })} placeholder="ej. gpt-4o, llama-3.3-70b" style={{ padding: "10px 12px", background: "rgba(9, 13, 23, 0.85)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "var(--radius-control)", color: "var(--text-primary)", outline: "none", fontSize: "13px" }} required />
          </label>

          {testResult && (
            <div style={{ padding: "10px 14px", borderRadius: "var(--radius-control)", background: testResult.ok ? "rgba(16, 185, 129, 0.12)" : "rgba(244, 63, 94, 0.12)", color: testResult.ok ? "var(--accent-green)" : "var(--accent-red)", border: `1px solid ${testResult.ok ? "rgba(16, 185, 129, 0.3)" : "rgba(244, 63, 94, 0.3)"}`, fontSize: "12px" }}>
              {testResult.msg}
            </div>
          )}
          {savedMessage && <div style={{ color: "var(--accent-green)", fontSize: "12px", fontWeight: 600 }}>{savedMessage}</div>}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
            <button type="button" onClick={handleTest} disabled={testing || !draft.baseUrl} style={{ padding: "9px 16px", background: "rgba(255, 255, 255, 0.04)", border: "1px solid var(--border-line)", borderRadius: "var(--radius-control)", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, cursor: testing || !draft.baseUrl ? "not-allowed" : "pointer" }}>
              {testing ? "Probando…" : "Probar conexión"}
            </button>
            <button type="submit" style={{ padding: "10px 22px", background: "linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-indigo) 100%)", color: "#ffffff", borderRadius: "var(--radius-control)", fontWeight: 700, fontSize: "12.5px", border: "1px solid rgba(255, 255, 255, 0.2)", boxShadow: "0 0 16px rgba(56, 189, 248, 0.3)", cursor: "pointer" }}>
              Guardar y Activar
            </button>
          </div>
        </form>

        <BackupActions />
      </div>
    </div>
  );
}
