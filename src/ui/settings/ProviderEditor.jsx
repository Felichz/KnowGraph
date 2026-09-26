import { useState } from "react";
import { Check, RefreshCw, Zap } from "lucide-react";
import { fetchAiProviderModels, testAiProvider, userFacingAiError } from "../../ai/client.js";
import { normalizeProviderDraft, saveProviderDraft, saveProviderProfile } from "../../ai/providerSettings.js";
import { Button } from "../primitives/Button.jsx";
import { Notice } from "../primitives/Feedback.jsx";
import { notifyProviderChanged } from "../hooks/useProviderLabel.js";
import { toast } from "../state/toastStore.js";

// Editor de una conexión: endpoint, API key, modelo (con descubrimiento), prueba y guardado.
export function ProviderEditor({ draft, onSaved }) {
  const [form, setForm] = useState(() => normalizeProviderDraft(draft));
  const [models, setModels] = useState([]);
  const [busy, setBusy] = useState(null); // models | test | save
  const [result, setResult] = useState(null); // { tone, text }
  const set = (key) => (e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setResult(null); };
  const ready = form.baseUrl && form.apiKey && form.model;

  const loadModels = async () => {
    setBusy("models"); setResult(null);
    try {
      const res = await fetchAiProviderModels({ provider: normalizeProviderDraft(form) });
      setModels(res.models ?? []);
      setResult(res.models?.length ? { tone: "success", text: `${res.models.length} modelos disponibles.` } : { tone: "warn", text: res.error || "No se pudieron listar modelos; escribí el id a mano." });
    } catch (e) { setResult({ tone: "error", text: userFacingAiError(e, "No se pudo consultar el catálogo.") }); }
    setBusy(null);
  };
  const test = async () => {
    setBusy("test"); setResult(null);
    try {
      const res = await testAiProvider({ provider: normalizeProviderDraft(form) });
      setResult(res.reachable ? { tone: "success", text: `Responde en ${res.latencyMs} ms con ${res.model}.` } : { tone: "error", text: res.error || `No respondió (HTTP ${res.status ?? "?"}).` });
    } catch (e) { setResult({ tone: "error", text: userFacingAiError(e, "No se pudo probar la conexión.") }); }
    setBusy(null);
  };
  const save = async (activate) => {
    setBusy("save");
    try {
      if (activate) await saveProviderProfile(form, { activate: true }); else await saveProviderDraft(form);
      notifyProviderChanged();
      toast({ tone: "success", message: activate ? `“${form.label}” quedó activa.` : "Conexión guardada." });
      onSaved();
    } catch (e) { setResult({ tone: "error", text: e.message }); setBusy(null); }
  };

  return (
    <form className="editor-form" onSubmit={(e) => { e.preventDefault(); if (ready) save(true); }}>
      <label className="field"><span className="field__label">Nombre</span><input value={form.label} onChange={set("label")} /></label>
      <label className="field"><span className="field__label">Endpoint (base URL)</span><input className="mono" value={form.baseUrl} onChange={set("baseUrl")} placeholder="https://…/v1" /></label>
      <label className="field">
        <span className="field__label">API key</span>
        <input type="password" className="mono" value={form.apiKey} onChange={set("apiKey")} autoComplete="off" placeholder="sk-…" />
        <span className="field__hint">Se envía solo al gateway con cada pedido; nunca se registra.</span>
      </label>
      <div className="field">
        <span className="field__label">Modelo</span>
        <div className="field__row">
          <input className="mono" list="provider-models" value={form.model} onChange={set("model")} placeholder="id del modelo" aria-label="Modelo" />
          <Button variant="secondary" icon={RefreshCw} onClick={loadModels} loading={busy === "models"} disabled={!form.baseUrl || !form.apiKey} disabledReason={!form.apiKey ? "Completá endpoint y API key" : undefined}>Cargar</Button>
        </div>
        <datalist id="provider-models">{models.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</datalist>
      </div>
      {result && <Notice tone={result.tone}>{result.text}</Notice>}
      <div className="editor-form__actions">
        <Button variant="ghost" icon={Zap} onClick={test} loading={busy === "test"} disabled={!ready} disabledReason={!ready ? "Completá los tres campos" : undefined}>Probar</Button>
        <Button variant="secondary" onClick={() => save(false)} disabled={busy === "save"}>Guardar</Button>
        <Button type="submit" variant="primary" icon={Check} loading={busy === "save"} disabled={!ready} disabledReason={!ready ? "Completá los tres campos" : undefined}>Guardar y usar</Button>
      </div>
    </form>
  );
}
