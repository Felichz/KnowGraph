import { useEffect, useMemo, useRef, useState } from "react";
import { fetchAiProviderCatalog, fetchAiProviderModels, testAiProvider } from "../ai/client.js";
import {
  EMPTY_PROVIDER_PROFILE,
  PROVIDER_LIBRARY,
  clearProviderProfile,
  createProviderDraft,
  loadProviderSettings,
  normalizeProviderProfile,
  providerStorageDescription,
  removeProviderProfile,
  saveProviderProfile,
  setActiveProviderProfile,
} from "../ai/providerSettings.js";

const FALLBACK_DIRECTORY = PROVIDER_LIBRARY.map((provider) => ({
  ...provider,
  connectable: true,
  compatibility: provider.availability === "local" ? "local" : "compatible",
  modelCount: 0,
}));

export function ProviderSettingsPanel({ open, profile, onClose, onSaved }) {
  const [settings, setSettings] = useState({ version: 4, activeProfileId: null, profiles: [] });
  const [view, setView] = useState("connections");
  const [draft, setDraft] = useState(() => ({ ...EMPTY_PROVIDER_PROFILE }));
  const [status, setStatus] = useState({ kind: "idle", message: "" });
  const [directory, setDirectory] = useState({ providers: FALLBACK_DIRECTORY, source: "builtin", warning: null });
  const [directoryStatus, setDirectoryStatus] = useState("idle");
  const [providerQuery, setProviderQuery] = useState("");
  const [models, setModels] = useState([]);
  const [modelFilter, setModelFilter] = useState("");
  const [manualModelOpen, setManualModelOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modelsStatus, setModelsStatus] = useState({ kind: "idle", message: "" });
  const modelRequestRef = useRef(null);
  const directoryRequestRef = useRef(null);
  const wasOpenRef = useRef(false);
  const isDesktopRuntime = typeof window !== "undefined" && Boolean(window.learningDesktop?.isElectron);
  const storageDescription = useMemo(() => providerStorageDescription(), []);
  const providerById = useMemo(() => new Map(directory.providers.map((provider) => [provider.id, provider])), [directory]);
  
  const allBaseProviders = useMemo(() => directory.providers
    .filter((provider) => isDesktopRuntime || provider.availability !== "local"),
    [directory.providers, isDesktopRuntime]
  );

  const visibleProviders = useMemo(() => filterProviders(allBaseProviders, providerQuery),
    [allBaseProviders, providerQuery]
  );

  const categories = useMemo(() => {
    const groups = new Map();
    for (const provider of allBaseProviders) {
      if (provider.id === "custom") continue;
      const groupName = provider.group || "Otros";
      groups.set(groupName, true);
    }
    return [...groups.keys()];
  }, [allBaseProviders]);

  const categoryCounts = useMemo(() => {
    const counts = new Map();
    for (const provider of visibleProviders) {
      if (provider.id === "custom") continue;
      const groupName = provider.group || "Otros";
      counts.set(groupName, (counts.get(groupName) || 0) + 1);
    }
    return counts;
  }, [visibleProviders]);

  const displayedProviders = useMemo(() => {
    if (selectedCategory === "all") return visibleProviders;
    return visibleProviders.filter((provider) => (provider.group || "Otros") === selectedCategory);
  }, [visibleProviders, selectedCategory]);

  const displayedGroups = useMemo(() => {
    const available = displayedProviders.filter((provider) => provider.id !== "custom");
    return groupProviders(available);
  }, [displayedProviders]);

  const localProviderCount = useMemo(() => directory.providers.filter((provider) => provider.availability === "local").length, [directory.providers]);
  const selectedProvider = providerById.get(draft.adapter) ?? providerFromDraft(draft);

  const refresh = async () => {
    const next = await loadProviderSettings();
    setSettings(next);
    return next;
  };

  const loadDirectory = async ({ force = false } = {}) => {
    if (directoryStatus === "loading" && !force) return;
    directoryRequestRef.current?.abort();
    const controller = new AbortController();
    directoryRequestRef.current = controller;
    setDirectoryStatus("loading");
    try {
      const next = await fetchAiProviderCatalog({ signal: controller.signal, refresh: force });
      if (Array.isArray(next.providers) && next.providers.length) {
        setDirectory({ providers: next.providers, source: next.source ?? "models.dev", warning: next.warning ?? null });
      }
      setDirectoryStatus("ready");
    } catch (error) {
      if (error?.name === "AbortError") return;
      setDirectoryStatus("error");
      setDirectory((current) => ({
        ...current,
        warning: "No se pudo actualizar el directorio. Podés usar la biblioteca integrada o reintentar.",
      }));
    } finally {
      if (directoryRequestRef.current === controller) directoryRequestRef.current = null;
    }
  };

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      refresh().then((next) => {
        if (!next.profiles || next.profiles.length === 0) {
          setView("catalog");
        } else {
          setView("connections");
        }
      }).catch(() => {
        setView("catalog");
      });
      loadDirectory().catch(() => {});
      setSelectedCategory("all");
      setProviderQuery("");
      setStatus({ kind: "idle", message: "" });
      resetModelState();
    }
    wasOpenRef.current = open;
  // Opening the panel is the intentional refresh boundary for the public directory.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => {
    modelRequestRef.current?.abort();
    directoryRequestRef.current?.abort();
  }, []);

  const resetModelState = () => {
    setModels([]);
    setModelFilter("");
    setManualModelOpen(false);
    setModelsStatus({ kind: "idle", message: "" });
  };

  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));

  const startCreate = (provider) => {
    if (!provider?.connectable) return;
    setDraft(createProviderDraft(provider));
    resetModelState();
    setStatus({ kind: "idle", message: "" });
    setView("editor");
  };

  const startEdit = (connection) => {
    setDraft({ ...connection });
    resetModelState();
    setStatus({ kind: "idle", message: "" });
    setView("editor");
  };

  const getValidatedProfile = ({ requireModel = true } = {}) => {
    const next = normalizeProviderProfile(draft, { requireModel });
    if (!next) {
      setStatus({
        kind: "error",
        message: requireModel
          ? "Completá endpoint, API key y modelo antes de guardar."
          : "Completá endpoint y API key antes de cargar el catálogo.",
      });
      return null;
    }
    return next;
  };

  const loadModels = async () => {
    const next = getValidatedProfile({ requireModel: false });
    if (!next) return;
    modelRequestRef.current?.abort();
    const controller = new AbortController();
    modelRequestRef.current = controller;
    setModelsStatus({ kind: "loading", message: "Cargando modelos…" });
    try {
      const result = await fetchAiProviderModels({ provider: next, signal: controller.signal });
      const nextModels = Array.isArray(result.models) ? result.models : [];
      setModels(nextModels);
      setModelsStatus({
        kind: nextModels.length ? "success" : "empty",
        message: nextModels.length
          ? `${nextModels.length} modelos disponibles · ${catalogSourceLabel(result)}.`
          : result.discovery?.catalog?.warning ?? "No encontramos modelos. Podés ingresar el slug manualmente.",
      });
    } catch (error) {
      if (error?.name === "AbortError") return;
      const message = error?.message ?? "No se pudo cargar el catálogo.";
      setModelsStatus({ kind: "error", message });
      setStatus({ kind: "error", message });
    } finally {
      if (modelRequestRef.current === controller) modelRequestRef.current = null;
    }
  };

  const testConnection = async () => {
    const next = getValidatedProfile();
    if (!next) return;
    setStatus({ kind: "testing", message: "Probando el modelo con una inferencia mínima…" });
    try {
      const result = await testAiProvider({ provider: next });
      setStatus(result.reachable
        ? { kind: "success", message: `El modelo respondió en ${result.latencyMs ?? "?"} ms.` }
        : { kind: "error", message: testErrorMessage(result) });
    } catch (error) {
      setStatus({ kind: "error", message: error?.message ?? "No se pudo comprobar el modelo." });
    }
  };

  const save = async ({ activate }) => {
    const next = getValidatedProfile();
    if (!next) return;
    try {
      const saved = await saveProviderProfile(next, { activate });
      const nextSettings = await refresh();
      if (activate) onSaved?.(saved);
      setStatus({ kind: "success", message: activate ? "Conexión guardada y seleccionada para el coaching." : "Conexión guardada." });
      setView("connections");
      if (!activate && nextSettings.activeProfileId === saved.id) onSaved?.(saved);
    } catch (error) {
      setStatus({ kind: "error", message: error?.message ?? "No se pudo guardar la conexión." });
    }
  };

  const activate = async (connection) => {
    try {
      const saved = await setActiveProviderProfile(connection.id);
      await refresh();
      onSaved?.(saved);
      setStatus({ kind: "success", message: `${saved.label} se usará en las próximas evaluaciones.` });
    } catch (error) {
      setStatus({ kind: "error", message: error?.message ?? "No se pudo activar la conexión." });
    }
  };

  const useGatewayDefault = async () => {
    await setActiveProviderProfile(null);
    await refresh();
    onSaved?.(null);
    setStatus({ kind: "success", message: "Se usará el provider por defecto del gateway." });
  };

  const remove = async (connection) => {
    const wasActive = settings.activeProfileId === connection.id;
    await removeProviderProfile(connection.id);
    await refresh();
    if (wasActive) onSaved?.(null);
    setStatus({ kind: "success", message: `Se eliminó ${connection.label}.` });
  };

  const resetAll = async () => {
    await clearProviderProfile();
    await refresh();
    onSaved?.(null);
    setStatus({ kind: "success", message: "Se eliminaron las conexiones guardadas en esta sesión." });
  };

  const visibleModels = models
    .filter((model) => `${model.label} ${model.id}`.toLowerCase().includes(modelFilter.trim().toLowerCase()))
    .slice(0, 250);
  const activeConnection = settings.profiles.find((connection) => connection.id === settings.activeProfileId) ?? profile;

  return (
    <aside id="workspace-provider-panel" className={`workspace-provider-panel ${open ? "is-open" : ""}`} aria-label="Conexiones de IA" aria-hidden={!open}>
      <header className="workspace-provider-panel__header">
        <div>
          <h2>{view === "connections" ? "Conexiones de IA" : view === "catalog" ? "Elegí un provider" : "Configurar conexión"}</h2>
          <p>{view === "connections" ? "Elegí la cuenta y el modelo que usa el coaching." : view === "catalog" ? "Directo si el protocolo es compatible; transparente si necesita otro adaptador." : "La prueba usa una inferencia mínima; nunca envía contenido de estudio."}</p>
        </div>
        <div className="workspace-provider-panel__header-actions">
          {view === "catalog" && settings.profiles.length > 0 && (
            <button
              type="button"
              className="provider-header-nav-btn"
              onClick={() => { setView("connections"); setStatus({ kind: "idle", message: "" }); }}
              title="Ver conexiones guardadas"
            >
              Guardadas ({settings.profiles.length})
            </button>
          )}
          {view === "connections" && (
            <button
              type="button"
              className="provider-header-add-btn"
              onClick={() => { setView("catalog"); setStatus({ kind: "idle", message: "" }); }}
              title="Explorar catálogo de proveedores"
            >
              <PlusIcon /> Agregar
            </button>
          )}
          {view === "editor" && (
            <button
              type="button"
              onClick={() => { setView(settings.profiles.length > 0 ? "connections" : "catalog"); setStatus({ kind: "idle", message: "" }); }}
              aria-label="Volver"
            >
              <BackIcon />
            </button>
          )}
          <button type="button" onClick={onClose} aria-label="Cerrar conexiones de IA"><CloseIcon /></button>
        </div>
      </header>

      {view === "connections" && (
        <div className="provider-connections">
          <section className="provider-active-summary" aria-label="Conexión en uso">
            <div>
              <span>En uso</span>
              <strong>{activeConnection ? activeConnection.label : "Provider del gateway"}</strong>
              <small>{activeConnection ? activeConnection.model : "Sin una conexión personal activa"}</small>
            </div>
            {activeConnection && <button type="button" className="provider-link-button" onClick={useGatewayDefault}>Usar gateway</button>}
          </section>

          <section className="provider-connection-list" aria-label="Conexiones guardadas">
            <div className="provider-section-heading">
              <div className="provider-section-heading__left">
                <h3>Guardadas</h3>
                <span className="provider-section-heading__count">{settings.profiles.length}</span>
              </div>
              <button
                type="button"
                className="provider-inline-add-btn"
                onClick={() => { setView("catalog"); setStatus({ kind: "idle", message: "" }); }}
              >
                <PlusIcon /> Nueva conexión
              </button>
            </div>
            {settings.profiles.length === 0 ? (
              <div className="provider-empty-state">
                <strong>Todavía no hay conexiones configuradas.</strong>
                <p>Conectá una cuenta o endpoint del catálogo para comenzar a estudiar con IA.</p>
                <button
                  type="button"
                  className="provider-empty-action-btn"
                  onClick={() => { setView("catalog"); setStatus({ kind: "idle", message: "" }); }}
                >
                  <PlusIcon /> Explorar catálogo de proveedores
                </button>
              </div>
            ) : settings.profiles.map((connection) => {
              const isActive = connection.id === settings.activeProfileId;
              const isReady = Boolean(normalizeProviderProfile(connection));
              const provider = providerById.get(connection.adapter);
              return (
                <article className={`provider-connection-row ${isActive ? "is-active" : ""}`} key={connection.id}>
                  <button type="button" className="provider-connection-row__main" onClick={() => (isReady ? activate(connection) : startEdit(connection))}>
                    <span className="provider-connection-row__marker" aria-hidden="true" />
                    <span><strong>{connection.label}</strong><small>{connection.model || "Falta elegir un modelo"} · {provider?.label ?? connection.adapter}</small></span>
                    <span className="provider-connection-row__state">{isActive ? "En uso" : isReady ? "Usar" : "Completar"}</span>
                  </button>
                  <div className="provider-connection-row__actions">
                    <button type="button" onClick={() => startEdit(connection)} aria-label={`Editar ${connection.label}`} title="Editar"><EditIcon /></button>
                    <button type="button" onClick={() => remove(connection)} aria-label={`Eliminar ${connection.label}`} title="Eliminar"><TrashIcon /></button>
                  </div>
                </article>
              );
            })}
          </section>

          <p className="provider-storage-note">{storageDescription} La clave viaja solo al gateway al pedir una respuesta; el gateway no la persiste.</p>
          {settings.profiles.length > 0 && <button type="button" className="provider-danger-link" onClick={resetAll}>Eliminar todas las conexiones de esta sesión</button>}
          <ProviderStatus status={status} />
        </div>
      )}

      {view === "catalog" && (
        <div className="provider-catalog provider-directory">
          <div className="provider-directory__tools">
            <div className="provider-directory__search-box">
              <SearchIcon className="provider-directory__search-icon" />
              <input
                value={providerQuery}
                onChange={(event) => setProviderQuery(event.target.value)}
                placeholder="Buscar provider, modelo o protocolo…"
                className="provider-directory__search-input"
                autoFocus
              />
              {providerQuery ? (
                <button
                  type="button"
                  className="provider-directory__search-clear"
                  onClick={() => setProviderQuery("")}
                  aria-label="Limpiar búsqueda"
                >
                  <CloseIcon />
                </button>
              ) : null}
            </div>
            <button
              type="button"
              className="provider-directory__refresh"
              onClick={() => loadDirectory({ force: true })}
              disabled={directoryStatus === "loading"}
            >
              {directoryStatus === "loading" ? "Actualizando…" : "Actualizar"}
            </button>
          </div>

          <div className="provider-directory__meta-row">
            <p className="provider-directory__summary">
              {directoryStatus === "loading"
                ? "Actualizando el directorio de providers…"
                : `${visibleProviders.filter((p) => p.id !== "custom").length} providers · ${
                    directory.source === "models.dev" ? "catálogo Models.dev" : "biblioteca integrada"
                  }`}
            </p>
            {selectedCategory !== "all" && (
              <button
                type="button"
                className="provider-link-button provider-directory__reset-filter"
                onClick={() => setSelectedCategory("all")}
              >
                Ver todos
              </button>
            )}
          </div>

          {directory.warning && <p className="provider-directory__warning">{directory.warning}</p>}

          {!isDesktopRuntime && localProviderCount > 0 && (
            <div className="provider-desktop-only-note" role="note">
              <DesktopIcon />
              <span><strong>Modelos locales</strong><small>Disponible solo en la app de escritorio.</small></span>
            </div>
          )}

          {/* Category Navigation Bar (Pills) */}
          <nav className="provider-category-nav" aria-label="Categorías de proveedores">
            <button
              type="button"
              className={`provider-category-pill ${selectedCategory === "all" ? "is-active" : ""}`}
              onClick={() => setSelectedCategory("all")}
              aria-pressed={selectedCategory === "all"}
            >
              <span>Todos</span>
              <span className="provider-category-pill__count">
                {visibleProviders.filter((p) => p.id !== "custom").length}
              </span>
            </button>
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              const count = categoryCounts.get(category) || 0;
              return (
                <button
                  key={category}
                  type="button"
                  className={`provider-category-pill ${isSelected ? "is-active" : ""} ${count === 0 ? "is-empty" : ""}`}
                  onClick={() => setSelectedCategory(isSelected ? "all" : category)}
                  aria-pressed={isSelected}
                  disabled={count === 0 && providerQuery.length > 0}
                >
                  <span>{category}</span>
                  <span className="provider-category-pill__count">{count}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick-connect Custom / Generic Endpoint */}
          {selectedCategory === "all" && !providerQuery && (
            <button
              type="button"
              className="provider-directory__custom"
              onClick={() =>
                startCreate(providerById.get("custom") ?? FALLBACK_DIRECTORY.find((provider) => provider.id === "custom"))
              }
            >
              <span className="provider-catalog-item__glyph" aria-hidden="true"><CodeIcon /></span>
              <span>
                <strong>Endpoint compatible</strong>
                <small>Conectá un gateway propio, vLLM o cualquier <code>/chat/completions</code>.</small>
              </span>
              <ChevronIcon />
            </button>
          )}

          {/* Grouped / Filtered Providers List */}
          <div className="provider-directory__groups">
            {displayedGroups.map(([group, providers]) => {
              const groupId = `provider-group-${slugify(group)}`;
              return (
                <section key={group} className="provider-directory__section" aria-labelledby={groupId}>
                  <div className="provider-section-heading">
                    <h3 id={groupId}>{group}</h3>
                    <span className="provider-section-heading__count">{providers.length}</span>
                  </div>
                  <div className="provider-catalog-list" role="list">
                    {providers.map((provider) => (
                      <button
                        type="button"
                        className={`provider-catalog-item ${provider.connectable ? "" : "is-unavailable"}`}
                        key={provider.id}
                        onClick={() => startCreate(provider)}
                        disabled={!provider.connectable}
                        title={provider.connectable ? `Conectar ${provider.label}` : provider.description}
                      >
                        <span className="provider-catalog-item__glyph" aria-hidden="true">{provider.label.slice(0, 1)}</span>
                        <span>
                          <strong>{provider.label}</strong>
                          <small>{provider.description}</small>
                          <span className={`provider-compatibility provider-compatibility--${provider.availability}`}>
                            {availabilityLabel(provider)}
                          </span>
                        </span>
                        {provider.connectable ? <ChevronIcon /> : <LockIcon />}
                      </button>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {displayedGroups.length === 0 && (
            <div className="provider-empty-state">
              <strong>No encontramos providers que coincidan.</strong>
              <p>
                {providerQuery
                  ? `No hay resultados para "${providerQuery}" en ${selectedCategory === "all" ? "el catálogo" : selectedCategory}.`
                  : "No hay providers disponibles en esta categoría."}
              </p>
              {(providerQuery || selectedCategory !== "all") && (
                <button
                  type="button"
                  className="provider-directory__clear-btn"
                  onClick={() => {
                    setProviderQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  Restablecer filtros
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {view === "editor" && (
        <form className="provider-settings-form" onSubmit={(event) => { event.preventDefault(); save({ activate: true }); }}>
          <div className="provider-editor-provider">
            <span className="provider-catalog-item__glyph" aria-hidden="true">{selectedProvider.label.slice(0, 1)}</span>
            <div><strong>{selectedProvider.label}</strong><small>{selectedProvider.description}</small></div>
            <button type="button" className="provider-link-button" onClick={() => setView("catalog")}>Cambiar</button>
          </div>

          {selectedProvider.availability === "local" && <p className="provider-local-notice">Este endpoint solo puede usarse desde Electron o un gateway local con <code>ALLOW_PRIVATE_PROVIDER_URLS=true</code>. El deployment público lo rechaza por seguridad.</p>}

          <label className="provider-field"><span>Nombre de esta conexión</span><input value={draft.label} onChange={(event) => update("label", event.target.value)} placeholder="Ej. OpenRouter personal" maxLength="80" /></label>
          <label className="provider-field"><span>Base URL</span><input value={draft.baseUrl} onChange={(event) => update("baseUrl", event.target.value)} placeholder="https://api.example.com/v1" inputMode="url" autoCapitalize="none" spellCheck="false" /><small>La app agrega <code>/chat/completions</code>. Debe ser HTTPS y una API compatible.</small></label>
          <label className="provider-field"><span>API key</span><input type="password" value={draft.apiKey} onChange={(event) => update("apiKey", event.target.value)} placeholder="Pegá tu clave" autoComplete="new-password" spellCheck="false" /></label>

          <section className="provider-model-section" aria-labelledby="provider-model-label">
            <div className="provider-field">
              <span id="provider-model-label">Modelo</span>
              <div className="provider-model-picker__input-row">
                {models.length > 0 && !manualModelOpen ? (
                  <select
                    value={draft.model}
                    onChange={(event) => update("model", event.target.value)}
                    aria-label="Seleccionar modelo"
                  >
                    <option value="">Seleccioná un modelo</option>
                    {draft.model && !models.some((model) => model.id === draft.model) && <option value={draft.model}>{draft.model}</option>}
                    {visibleModels.map((model) => <option value={model.id} key={model.id}>{model.label} · {model.id}</option>)}
                  </select>
                ) : (
                  <input
                    value={draft.model}
                    onChange={(event) => update("model", event.target.value)}
                    placeholder="Ej: gpt-4o, llama-3.3-70b, deepseek-chat…"
                    maxLength="200"
                    autoCapitalize="none"
                    spellCheck="false"
                  />
                )}
                <button type="button" className="provider-test-button" onClick={testConnection} disabled={status.kind === "testing" || !draft.model}>{status.kind === "testing" ? "Probando…" : "Probar modelo"}</button>
              </div>
              {models.length > 0 && !manualModelOpen && <input className="provider-model-filter" value={modelFilter} onChange={(event) => setModelFilter(event.target.value)} placeholder="Filtrar modelos de la lista…" aria-label="Buscar modelo" />}
              <div className="provider-model-picker__actions">
                <button type="button" className="provider-manual-model" onClick={loadModels} disabled={modelsStatus.kind === "loading"}>{modelsStatus.kind === "loading" ? "Cargando…" : "Cargar catálogo"}</button>
                {models.length > 0 && (
                  <button type="button" className="provider-manual-model" onClick={() => setManualModelOpen((current) => !current)}>
                    {manualModelOpen ? "Elegir de lista" : "Ingresar slug manualmente"}
                  </button>
                )}
              </div>
              <small>{modelsStatus.message || "El catálogo ayuda a elegir; probar modelo confirma URL, credencial y slug reales."}</small>
            </div>
          </section>

          <ProviderStatus status={status} />
          <div className="provider-settings-actions"><button type="button" className="provider-secondary-button" onClick={() => save({ activate: false })}>Guardar</button><button type="submit" className="provider-save-button">Guardar y usar</button></div>
        </form>
      )}
    </aside>
  );
}

function ProviderStatus({ status }) {
  if (status.kind === "idle") return null;
  return <p className={`provider-status provider-status--${status.kind}`} role={status.kind === "error" ? "alert" : "status"}>{status.message}</p>;
}

function filterProviders(providers, query) {
  const terms = query.trim().toLowerCase();
  if (!terms) return providers;
  return providers.filter((provider) => [provider.label, provider.id, provider.description, provider.transport, provider.catalogName, ...(provider.environmentVariables ?? [])].filter(Boolean).join(" ").toLowerCase().includes(terms));
}

function groupProviders(providers) {
  const groups = providers.reduce((result, provider) => {
    const current = result.get(provider.group) ?? [];
    current.push(provider);
    result.set(provider.group, current);
    return result;
  }, new Map());
  return [...groups.entries()];
}

function providerFromDraft(draft) {
  return { id: draft.adapter, label: draft.label || "Endpoint compatible", description: "API Chat Completions compatible.", availability: "ready", connectable: true };
}

function availabilityLabel(provider) {
  if (provider.availability === "local") return "Local";
  if (provider.availability === "adapter-required") return "Requiere adaptador";
  return provider.transport === "chat-completions" ? "Compatible" : "Listo";
}

function catalogSourceLabel(result) {
  const upstream = result.discovery?.upstream?.available;
  const source = result.discovery?.catalog?.source;
  if (upstream && source === "models.dev") return "endpoint y catálogo";
  if (upstream) return "endpoint";
  if (source === "models.dev") return "catálogo";
  return "preset";
}

function testErrorMessage(result) {
  if (result.error === "token_rejected") return "El endpoint respondió, pero rechazó la API key.";
  if (result.error === "chat_route_not_found") return "El endpoint no expone /chat/completions. Elegí un endpoint compatible.";
  if (result.error === "rate_limited") return "El provider limitó la prueba. Esperá un momento y reintentá.";
  if (result.error === "timeout") return "El modelo tardó demasiado. Revisá la URL o reintentá.";
  return "El modelo rechazó la prueba. Confirmá URL, API key y slug.";
}

function slugify(value) { return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-"); }
function CloseIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5 5 15" /></svg>; }
function BackIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M11.5 4.5 6 10l5.5 5.5M6.5 10h8" /></svg>; }
function ChevronIcon({ className = "" }) { return <svg viewBox="0 0 20 20" className={className} aria-hidden="true"><path d="m8 4 6 6-6 6" /></svg>; }
function PlusIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" /></svg>; }
function EditIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4.5 15.5 3.1-.6L15 7.5 12.5 5 5.1 12.4l-.6 3.1ZM11.7 5.8l2.5 2.5" /></svg>; }
function TrashIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 6.5h11M8 3.8h4M6.3 6.5l.6 9h6.2l.6-9M8.5 9v4M11.5 9v4" /></svg>; }
function SearchIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="4.5" /><path d="m12 12 4 4" /></svg>; }
function LockIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="4.5" y="8.5" width="11" height="8" rx="1.5" /><path d="M7 8.5V6.7a3 3 0 0 1 6 0v1.8" /></svg>; }
function CodeIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7.2 5-4 5 4 5M12.8 5l4 5-4 5M11.3 3.8 8.7 16.2" /></svg>; }
function DesktopIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3.5" width="14" height="10" rx="1.5" /><path d="M7.5 16.5h5M10 13.5v3" /></svg>; }
