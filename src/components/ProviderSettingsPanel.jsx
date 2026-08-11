import { useEffect, useMemo, useRef, useState } from "react";
import { fetchAiProviderModels, testAiProvider } from "../ai/client.js";
import {
  EMPTY_PROVIDER_PROFILE,
  PROVIDER_PRESETS,
  clearProviderProfile,
  createProviderDraft,
  loadProviderDrafts,
  normalizeProviderProfile,
  providerStorageDescription,
  saveProviderDraft,
  saveProviderProfile,
} from "../ai/providerSettings.js";

export function ProviderSettingsPanel({ open, profile, onClose, onSaved }) {
  const [draft, setDraft] = useState(() => ({ ...EMPTY_PROVIDER_PROFILE }));
  const [status, setStatus] = useState({ kind: "idle", message: "" });
  const [models, setModels] = useState([]);
  const [modelFilter, setModelFilter] = useState("");
  const [manualModelOpen, setManualModelOpen] = useState(false);
  const [modelsStatus, setModelsStatus] = useState({ kind: "idle", message: "" });
  const storageDescription = useMemo(() => providerStorageDescription(), []);
  const wasOpenRef = useRef(false);
  const draftsRef = useRef({});
  const draftsHydratedRef = useRef(false);
  const modelRequestRef = useRef(null);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      let active = true;
      loadProviderDrafts().then((stored) => {
        if (!active) return;
        draftsRef.current = stored.profiles;
        draftsHydratedRef.current = true;
        const adapter = profile?.adapter ?? stored.activeAdapter ?? "openai";
        setDraft(stored.profiles[adapter] ?? profile ?? createProviderDraft(adapter));
      });
      setDraft(profile ? { ...profile } : { ...EMPTY_PROVIDER_PROFILE });
      setModelFilter("");
      setModels([]);
      setModelsStatus({ kind: "idle", message: "" });
      setManualModelOpen(false);
      setStatus({ kind: "idle", message: "" });
      wasOpenRef.current = open;
      return () => { active = false; };
    }

    if (!open) {
      draftsHydratedRef.current = false;
      setManualModelOpen(false);
    }
    wasOpenRef.current = open;
    return undefined;
  }, [open, profile]);

  useEffect(() => () => modelRequestRef.current?.abort(), []);

  // Drafts remain separate by preset. Switching to OpenRouter to inspect a
  // model must never overwrite an unfinished MiniMax configuration.
  useEffect(() => {
    if (!open || !draftsHydratedRef.current) return undefined;
    const timer = window.setTimeout(() => {
      draftsRef.current[draft.adapter] = draft;
      saveProviderDraft(draft).catch(() => {});
    }, 300);
    return () => window.clearTimeout(timer);
  }, [draft, open]);

  const update = (field, value) => setDraft((current) => {
    const next = { ...current, [field]: value };
    draftsRef.current[next.adapter] = next;
    return next;
  });

  const changeAdapter = (adapter) => {
    const next = draftsRef.current[adapter] ?? createProviderDraft(adapter);
    draftsRef.current[adapter] = next;
    setDraft(next);
    setModelFilter("");
    setModels([]);
    setModelsStatus({ kind: "idle", message: "" });
    setManualModelOpen(false);
    setStatus({ kind: "idle", message: "" });
  };

  const getValidatedProfile = () => {
    const next = normalizeProviderProfile(draft);
    if (!next) {
      setStatus({ kind: "error", message: "Completa endpoint, API key y modelo antes de continuar." });
      return null;
    }
    return next;
  };

  const getDiscoveryProfile = () => {
    const next = normalizeProviderProfile(draft, { requireModel: false });
    if (!next) {
      setStatus({ kind: "error", message: "Completa endpoint y API key antes de cargar el catálogo." });
      return null;
    }
    return next;
  };

  const loadModels = async (provider = null, { quiet = false } = {}) => {
    const next = provider ?? getDiscoveryProfile();
    if (!next) return null;

    modelRequestRef.current?.abort();
    const controller = new AbortController();
    modelRequestRef.current = controller;
    setModelsStatus({ kind: "loading", message: "Cargando catálogo…" });
    try {
      const result = await fetchAiProviderModels({ provider: next, signal: controller.signal });
      const nextModels = Array.isArray(result.models) ? result.models : [];
      setModels(nextModels);
      setModelsStatus({
        kind: nextModels.length > 0 ? "success" : "empty",
        message: nextModels.length > 0
          ? `${nextModels.length} modelos disponibles (${catalogSourceLabel(result)}).`
          : result.discovery?.catalog?.warning ?? "No encontramos un catálogo. Podés escribir el slug manualmente.",
      });
      if (!quiet && nextModels.length === 0) {
        setStatus({ kind: "idle", message: "El slug manual sigue siendo válido aunque el provider no publique /models." });
      }
      return result;
    } catch (error) {
      if (error?.name === "AbortError") return null;
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
    setStatus({ kind: "testing", message: "Enviando una inferencia mínima al modelo…" });
    try {
      const result = await testAiProvider({ provider: next });
      if (!result.reachable) {
        setStatus({ kind: "error", message: testErrorMessage(result) });
        return;
      }
      setStatus({ kind: "success", message: `El modelo respondió en ${result.latencyMs ?? "?"} ms. El catálogo se carga por separado.` });
    } catch (error) {
      setStatus({ kind: "error", message: error?.message ?? "No se pudo comprobar el modelo." });
    }
  };

  const selectModel = (modelId) => {
    update("model", modelId);
    setModelFilter("");
  };

  const visibleModels = models
    .filter((model) => `${model.label} ${model.id}`.toLowerCase().includes(modelFilter.trim().toLowerCase()))
    .slice(0, 250);
  const preset = PROVIDER_PRESETS[draft.adapter] ?? PROVIDER_PRESETS.openai;

  const save = async () => {
    const next = getValidatedProfile();
    if (!next) return;
    try {
      const saved = await saveProviderProfile(next);
      draftsRef.current[next.adapter] = saved;
      onSaved?.(saved);
      setStatus({ kind: "success", message: "Provider seleccionado para las próximas evaluaciones." });
    } catch (error) {
      setStatus({ kind: "error", message: error?.message ?? "No se pudo guardar la configuración." });
    }
  };

  const clear = async () => {
    await clearProviderProfile();
    draftsRef.current = {};
    setDraft({ ...EMPTY_PROVIDER_PROFILE });
    setModelFilter("");
    setModels([]);
    setModelsStatus({ kind: "idle", message: "" });
    setManualModelOpen(false);
    onSaved?.(null);
    setStatus({ kind: "idle", message: "Se usará el provider por defecto del gateway." });
  };

  return (
    <aside id="workspace-provider-panel" className={`workspace-provider-panel ${open ? "is-open" : ""}`} aria-label="Configuración del provider de IA" aria-hidden={!open}>
      <header className="workspace-provider-panel__header">
        <div>
          <h2>Proveedor de IA</h2>
          <p>Conectá tu propia cuenta o endpoint compatible.</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar configuración de provider">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" /></svg>
        </button>
      </header>

      <form className="provider-settings-form" onSubmit={(event) => { event.preventDefault(); save(); }}>
        <label className="provider-field">
          <span>Provider</span>
          <select value={draft.adapter} onChange={(event) => changeAdapter(event.target.value)}>
            <option value="openai">OpenAI compatible</option>
            <option value="openrouter">OpenRouter</option>
            <option value="minimax">MiniMax</option>
          </select>
          <small>{preset.description}</small>
        </label>

        <label className="provider-field">
          <span>Nombre visible</span>
          <input value={draft.label} onChange={(event) => update("label", event.target.value)} placeholder="Mi provider" maxLength="80" />
        </label>

        <label className="provider-field">
          <span>Base URL</span>
          <input value={draft.baseUrl} onChange={(event) => update("baseUrl", event.target.value)} placeholder="https://api.example.com/v1" inputMode="url" autoCapitalize="none" spellCheck="false" />
          <small>Debe incluir la versión; la app agrega <code>/chat/completions</code>.</small>
        </label>

        <label className="provider-field">
          <span>API key</span>
          <input type="password" value={draft.apiKey} onChange={(event) => update("apiKey", event.target.value)} placeholder="Pegá tu clave" autoComplete="new-password" spellCheck="false" />
        </label>

        <label className="provider-field">
          <span>Modelo</span>
          <div className="provider-model-picker">
            <div className="provider-model-picker__input-row">
              <select
                value={draft.model}
                disabled={models.length === 0 || modelsStatus.kind === "loading"}
                onChange={(event) => selectModel(event.target.value)}
                aria-label="Modelo del provider"
              >
                <option value="">{models.length > 0 ? "Seleccioná un modelo" : "Cargá catálogo o ingresá un slug"}</option>
                {draft.model && !models.some((model) => model.id === draft.model) && <option value={draft.model}>{draft.model}</option>}
                {visibleModels.map((model) => <option value={model.id} key={model.id}>{model.label} · {model.id}</option>)}
              </select>
              <button type="button" className="provider-test-button provider-model-test" onClick={testConnection} disabled={status.kind === "testing" || !draft.model}>
                {status.kind === "testing" ? "Probando…" : "Probar modelo"}
              </button>
            </div>
            {models.length > 0 && <input className="provider-model-filter" value={modelFilter} onChange={(event) => setModelFilter(event.target.value)} placeholder="Buscar por nombre o slug…" aria-label="Filtrar modelos" />}
            {models.length === 0 && manualModelOpen && <input value={draft.model} onChange={(event) => update("model", event.target.value)} placeholder="Escribí el slug del modelo" maxLength="200" autoCapitalize="none" spellCheck="false" />}
            <div className="provider-model-picker__actions">
              <button type="button" className="provider-manual-model" onClick={() => loadModels()} disabled={modelsStatus.kind === "loading"}>Actualizar catálogo</button>
              {models.length === 0 && <button type="button" className="provider-manual-model" onClick={() => setManualModelOpen((current) => !current)}>{manualModelOpen ? "Ocultar entrada manual" : "Ingresar slug manualmente"}</button>}
            </div>
            <small>{modelsStatus.message || "El catálogo es opcional: una conexión se verifica enviando una inferencia mínima al modelo elegido."}</small>
          </div>
        </label>

        <p className="provider-storage-note">{storageDescription} La key se envía solo al gateway al pedir una respuesta; el gateway no la persiste.</p>

        {status.kind !== "idle" && <p className={`provider-status provider-status--${status.kind}`} role={status.kind === "error" ? "alert" : "status"}>{status.message}</p>}

        <div className="provider-settings-actions">
          <button type="submit" className="provider-save-button">Usar provider</button>
        </div>

        {profile && <button type="button" className="provider-clear-button" onClick={clear}>Volver al provider del gateway</button>}
      </form>
    </aside>
  );
}

function catalogSourceLabel(result) {
  const upstream = result.discovery?.upstream?.available;
  const source = result.discovery?.catalog?.source;
  if (upstream && source === "models.dev") return "endpoint + catálogo";
  if (upstream) return "endpoint";
  if (source === "models.dev") return "catálogo";
  return "preset";
}

function testErrorMessage(result) {
  if (result.error === "token_rejected") return "El endpoint respondió, pero rechazó la API key.";
  if (result.error === "chat_route_not_found") return "El endpoint no expone /chat/completions. Elegí un provider compatible o un adapter nativo.";
  if (result.error === "rate_limited") return "El provider limitó la prueba. Esperá un momento y reintentá.";
  if (result.error === "timeout") return "El modelo tardó demasiado en responder. Revisá la URL o reintentá.";
  return "El modelo rechazó la prueba. Confirmá el slug, la URL y la API key.";
}
