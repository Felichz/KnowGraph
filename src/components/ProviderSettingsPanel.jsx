import { useEffect, useMemo, useRef, useState } from "react";
import { fetchAiProviderModels } from "../ai/client.js";
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
  const [models, setModels] = useState([]);
  const [modelQuery, setModelQuery] = useState("");
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [modelsStatus, setModelsStatus] = useState({ kind: "idle", message: "" });
  const storageDescription = useMemo(() => providerStorageDescription(), []);
  const wasOpenRef = useRef(false);
  const modelRequestRef = useRef(null);

  useEffect(() => {
    // Hydrate only when the inspector is opened. Saving changes `profile` in
    // App; reacting to that same write would erase the success confirmation.
    if (open && !wasOpenRef.current) {
      setDraft(profile ? { ...profile } : { ...EMPTY_PROVIDER_PROFILE });
      setModelQuery(profile?.model ?? "");
      setModels([]);
      setModelsStatus({ kind: "idle", message: "" });
      setModelMenuOpen(false);
      setStatus({ kind: "idle", message: "" });
    }
    if (!open) setModelMenuOpen(false);
    wasOpenRef.current = open;
  }, [open, profile]);

  useEffect(() => () => modelRequestRef.current?.abort(), []);

  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));

  const changeAdapter = (adapter) => {
    if (adapter === "minimax") {
      setDraft((current) => ({ ...current, ...MINIMAX_PRESET, label: current.label || "MiniMax" }));
      setModelQuery(MINIMAX_PRESET.model);
      setModels([]);
      setModelsStatus({ kind: "idle", message: "" });
      return;
    }
    setDraft((current) => ({ ...current, adapter: "openai", model: "" }));
    setModelQuery("");
    setModels([]);
    setModelsStatus({ kind: "idle", message: "" });
  };

  const getValidatedProfile = () => {
    const next = normalizeProviderProfile(draft);
    if (!next) {
      setStatus({ kind: "error", message: "Completa endpoint, API key y modelo antes de continuar." });
      return null;
    }
    return next;
  };

  const loadModels = async (provider = null, { quiet = false } = {}) => {
    const next = provider ?? getValidatedProfile();
    if (!next) return;

    modelRequestRef.current?.abort();
    const controller = new AbortController();
    modelRequestRef.current = controller;
    setModelsStatus({ kind: "loading", message: "Cargando catálogo..." });
    try {
      const result = await fetchAiProviderModels({ provider: next, signal: controller.signal });
      if (!result.reachable) {
        const message = testErrorMessage(result);
        setModelsStatus({ kind: "error", message });
        if (!quiet) setStatus({ kind: "error", message });
        return result;
      }

      const nextModels = Array.isArray(result.models) ? result.models : [];
      setModels(nextModels);
      setModelMenuOpen(true);
      setModelsStatus({
        kind: nextModels.length > 0 ? "success" : "empty",
        message: nextModels.length > 0
          ? `${nextModels.length} modelos disponibles.`
          : "El provider respondió, pero no publicó modelos.",
      });
      if (!quiet && nextModels.length === 0) {
        setStatus({ kind: "error", message: "El endpoint funciona, pero no publicó un catálogo de modelos." });
      }
      return result;
    } catch (error) {
      if (error?.name === "AbortError") return;
      const message = error?.message ?? "No se pudo cargar el catálogo.";
      setModelsStatus({ kind: "error", message });
      if (!quiet) setStatus({ kind: "error", message });
      return null;
    } finally {
      if (modelRequestRef.current === controller) modelRequestRef.current = null;
    }
  };

  const testConnection = async () => {
    const next = getValidatedProfile();
    if (!next) return;
    setStatus({ kind: "testing", message: "Verificando endpoint, token y catálogo..." });
    try {
      const result = await loadModels(next, { quiet: true });
      if (!result || !result.reachable) {
        setStatus({ kind: "error", message: result ? testErrorMessage(result) : "No se pudo comprobar el provider." });
        return;
      }
      const catalogHint = result.models?.length
        ? `${result.models.length} modelos disponibles.`
        : "El provider no publicó un catálogo; podés escribir el slug manualmente.";
      setStatus({ kind: "success", message: `Conexión lista en ${result.latencyMs ?? "?"} ms. ${catalogHint}` });
    } catch (error) {
      setStatus({ kind: "error", message: error?.message ?? "No se pudo comprobar el provider." });
    }
  };

  const selectModel = (modelId) => {
    update("model", modelId);
    setModelQuery(modelId);
    setModelMenuOpen(false);
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
    setModelQuery("");
    setModels([]);
    setModelsStatus({ kind: "idle", message: "" });
    setModelMenuOpen(false);
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
          <div className="provider-model-picker">
            <div className="provider-model-picker__input-row">
              <input
                value={modelQuery}
                onChange={(event) => {
                  setModelQuery(event.target.value);
                  update("model", event.target.value);
                  setModelMenuOpen(true);
                }}
                onFocus={() => models.length > 0 && setModelMenuOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setModelMenuOpen(false);
                }}
                placeholder="openrouter/auto"
                maxLength="200"
                autoCapitalize="none"
                spellCheck="false"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={modelMenuOpen}
                aria-controls="provider-model-options"
              />
              <button
                type="button"
                className="provider-model-load"
                onClick={() => models.length > 0 ? setModelMenuOpen((current) => !current) : loadModels()}
                disabled={modelsStatus.kind === "loading"}
              >
                {modelsStatus.kind === "loading" ? "Cargando..." : models.length > 0 ? "Catálogo" : "Buscar modelos"}
              </button>
            </div>
            {modelMenuOpen && models.length > 0 && (
              <div id="provider-model-options" className="provider-model-options" role="listbox" aria-label="Modelos disponibles">
                {models
                  .filter((model) => `${model.label} ${model.id}`.toLowerCase().includes(modelQuery.trim().toLowerCase()))
                  .slice(0, 80)
                  .map((model) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected={draft.model === model.id}
                      className={`provider-model-option ${draft.model === model.id ? "is-selected" : ""}`}
                      key={model.id}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectModel(model.id)}
                    >
                      <span>{model.label}</span>
                      <code>{model.id}</code>
                    </button>
                  ))}
                {models.filter((model) => `${model.label} ${model.id}`.toLowerCase().includes(modelQuery.trim().toLowerCase())).length === 0 && (
                  <p className="provider-model-empty">No hay modelos que coincidan. Podés escribir el slug manualmente.</p>
                )}
              </div>
            )}
            <small>
              {modelsStatus.message || "Cargá el catálogo para buscar por nombre o slug. También podés escribirlo manualmente."}
            </small>
          </div>
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
