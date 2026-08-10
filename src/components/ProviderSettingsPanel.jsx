import { useEffect, useMemo, useRef, useState } from "react";
import { testAiProvider } from "../ai/client.js";
import {
  EMPTY_PROVIDER_PROFILE,
  MINIMAX_PRESET,
  clearProviderProfile,
  normalizeProviderProfile,
  providerStorageDescription,
  saveProviderProfile,
} from "../ai/providerSettings.js";

export function ProviderSettingsPanel({ open, profile, onClose, onSaved }) {
  const [draft, setDraft] = useState(() => ({ ...EMPTY_PROVIDER_PROFILE }));
  const [status, setStatus] = useState({ kind: "idle", message: "" });
  const storageDescription = useMemo(() => providerStorageDescription(), []);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    // Hydrate only when the inspector is opened. Saving changes `profile` in
    // App; reacting to that same write would erase the success confirmation.
    if (open && !wasOpenRef.current) {
      setDraft(profile ? { ...profile } : { ...EMPTY_PROVIDER_PROFILE });
      setStatus({ kind: "idle", message: "" });
    }
    wasOpenRef.current = open;
  }, [open, profile]);

  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));

  const changeAdapter = (adapter) => {
    if (adapter === "minimax") {
      setDraft((current) => ({ ...current, ...MINIMAX_PRESET, label: current.label || "MiniMax" }));
      return;
    }
    update("adapter", "openai");
  };

  const getValidatedProfile = () => {
    const next = normalizeProviderProfile(draft);
    if (!next) {
      setStatus({ kind: "error", message: "Completa endpoint, API key y modelo antes de continuar." });
      return null;
    }
    return next;
  };

  const testConnection = async () => {
    const next = getValidatedProfile();
    if (!next) return;
    setStatus({ kind: "testing", message: "Verificando endpoint y token..." });
    try {
      const result = await testAiProvider({ provider: next });
      if (!result.reachable) {
        setStatus({ kind: "error", message: testErrorMessage(result) });
        return;
      }
      const modelHint = Number.isFinite(result.modelCount) ? ` | ${result.modelCount} modelos visibles` : "";
      setStatus({ kind: "success", message: `Conexion lista en ${result.latencyMs ?? "?"} ms${modelHint}.` });
    } catch (error) {
      setStatus({ kind: "error", message: error?.message ?? "No se pudo comprobar el provider." });
    }
  };

  const save = async () => {
    const next = getValidatedProfile();
    if (!next) return;
    try {
      const saved = await saveProviderProfile(next);
      onSaved?.(saved);
      setStatus({ kind: "success", message: "Provider seleccionado para las proximas evaluaciones." });
    } catch (error) {
      setStatus({ kind: "error", message: error?.message ?? "No se pudo guardar la configuracion." });
    }
  };

  const clear = async () => {
    await clearProviderProfile();
    setDraft({ ...EMPTY_PROVIDER_PROFILE });
    onSaved?.(null);
    setStatus({ kind: "idle", message: "Se usara el provider por defecto del gateway." });
  };

  return (
    <aside id="workspace-provider-panel" className={`workspace-provider-panel ${open ? "is-open" : ""}`} aria-label="Configuracion del provider de IA" aria-hidden={!open}>
      <header className="workspace-provider-panel__header">
        <div>
          <h2>Proveedor de IA</h2>
          <p>Usa tu propia cuenta compatible con OpenAI.</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar configuracion de provider">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" /></svg>
        </button>
      </header>

      <form className="provider-settings-form" onSubmit={(event) => { event.preventDefault(); save(); }}>
        <label className="provider-field">
          <span>Compatibilidad</span>
          <select value={draft.adapter} onChange={(event) => changeAdapter(event.target.value)}>
            <option value="openai">OpenAI compatible</option>
            <option value="minimax">MiniMax</option>
          </select>
        </label>

        <label className="provider-field">
          <span>Nombre visible</span>
          <input value={draft.label} onChange={(event) => update("label", event.target.value)} placeholder="Mi provider" maxLength="80" />
        </label>

        <label className="provider-field">
          <span>Base URL</span>
          <input value={draft.baseUrl} onChange={(event) => update("baseUrl", event.target.value)} placeholder="https://api.example.com/v1" inputMode="url" autoCapitalize="none" spellCheck="false" />
          <small>Debe incluir la version; la app agrega <code>/chat/completions</code>.</small>
        </label>

        <label className="provider-field">
          <span>API key</span>
          <input type="password" value={draft.apiKey} onChange={(event) => update("apiKey", event.target.value)} placeholder="Pega tu clave" autoComplete="new-password" spellCheck="false" />
        </label>

        <label className="provider-field">
          <span>Modelo</span>
          <input value={draft.model} onChange={(event) => update("model", event.target.value)} placeholder="MiniMax-M3" maxLength="200" autoCapitalize="none" spellCheck="false" />
        </label>

        <label className="provider-check">
          <input type="checkbox" checked={draft.supportsResponseFormat} onChange={(event) => update("supportsResponseFormat", event.target.checked)} />
          <span>Este provider acepta <code>response_format</code> con JSON Schema.</span>
        </label>

        <p className="provider-storage-note">{storageDescription} La key se envia solo al gateway al pedir una respuesta; el gateway no la persiste.</p>

        {status.kind !== "idle" && <p className={`provider-status provider-status--${status.kind}`} role={status.kind === "error" ? "alert" : "status"}>{status.message}</p>}

        <div className="provider-settings-actions">
          <button type="button" className="provider-test-button" onClick={testConnection} disabled={status.kind === "testing"}>
            {status.kind === "testing" ? "Probando..." : "Probar conexion"}
          </button>
          <button type="submit" className="provider-save-button">Usar provider</button>
        </div>

        {profile && <button type="button" className="provider-clear-button" onClick={clear}>Volver al provider del gateway</button>}
      </form>
    </aside>
  );
}

function testErrorMessage(result) {
  if (result.error === "token_rejected") return "El endpoint respondio, pero rechazo la API key.";
  if (result.error === "timeout") return "El endpoint tardo demasiado en responder. Revisa la URL o reintenta.";
  return "No se pudo verificar el endpoint. Confirma la URL, la key y que exponga /models.";
}
