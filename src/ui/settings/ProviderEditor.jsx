import { useState } from "react";
import { Check, RefreshCw, Zap } from "lucide-react";
import { fetchAiProviderModels, testAiProvider, userFacingAiError } from "../../ai/client.js";
import { normalizeProviderDraft, saveProviderDraft, saveProviderProfile } from "../../ai/providerSettings.js";
import { Button } from "../primitives/Button.jsx";
import { Notice } from "../primitives/Feedback.jsx";
import { notifyProviderChanged } from "../hooks/useProviderLabel.js";
import { toast } from "../state/toastStore.js";
import { useT } from "../../i18n/react.js";

// Editor de una conexión: endpoint, API key, modelo (con descubrimiento), prueba y guardado.
export function ProviderEditor({ draft, onSaved }) {
  const t = useT();
  const [form, setForm] = useState(() => normalizeProviderDraft(draft));
  const [models, setModels] = useState([]);
  const [busy, setBusy] = useState(null); // models | test | save
  const [result, setResult] = useState(null); // { tone, text }
  const set = (key) => (e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setResult(null); };
  const ready = form.baseUrl && form.apiKey && form.model;
  const needAll = !ready ? t("settings.editor.needAllFields") : undefined;

  const loadModels = async () => {
    setBusy("models"); setResult(null);
    try {
      const res = await fetchAiProviderModels({ provider: normalizeProviderDraft(form) });
      setModels(res.models ?? []);
      setResult(res.models?.length ? { tone: "success", text: t("settings.editor.modelsAvailable", { n: res.models.length }) } : { tone: "warn", text: res.error || t("settings.editor.modelsUnavailable") });
    } catch (e) { setResult({ tone: "error", text: userFacingAiError(e, t("settings.editor.catalogFailed")) }); }
    setBusy(null);
  };
  const test = async () => {
    setBusy("test"); setResult(null);
    try {
      const res = await testAiProvider({ provider: normalizeProviderDraft(form) });
      setResult(res.reachable ? { tone: "success", text: t("settings.editor.testOk", { ms: res.latencyMs, model: res.model }) } : { tone: "error", text: res.error || t("settings.editor.testNoResponse", { status: res.status ?? "?" }) });
    } catch (e) { setResult({ tone: "error", text: userFacingAiError(e, t("settings.editor.testFailed")) }); }
    setBusy(null);
  };
  const save = async (activate) => {
    setBusy("save");
    try {
      if (activate) await saveProviderProfile(form, { activate: true }); else await saveProviderDraft(form);
      notifyProviderChanged();
      toast({ tone: "success", message: activate ? t("settings.editor.activated", { label: form.label }) : t("settings.editor.saved") });
      onSaved();
    } catch (e) { setResult({ tone: "error", text: e.message }); setBusy(null); }
  };

  return (
    <form className="editor-form" onSubmit={(e) => { e.preventDefault(); if (ready) save(true); }}>
      <label className="field"><span className="field__label">{t("settings.editor.name")}</span><input value={form.label} onChange={set("label")} /></label>
      <label className="field"><span className="field__label">{t("settings.editor.endpoint")}</span><input className="mono" value={form.baseUrl} onChange={set("baseUrl")} placeholder="https://…/v1" /></label>
      <label className="field">
        <span className="field__label">{t("settings.editor.apiKey")}</span>
        <input type="password" className="mono" value={form.apiKey} onChange={set("apiKey")} autoComplete="off" placeholder="sk-…" />
        <span className="field__hint">{t("settings.editor.apiKeyHint")}</span>
      </label>
      <div className="field">
        <span className="field__label">{t("settings.editor.model")}</span>
        <div className="field__row">
          <input className="mono" list="provider-models" value={form.model} onChange={set("model")} placeholder={t("settings.editor.modelPlaceholder")} aria-label={t("settings.editor.model")} />
          <Button variant="secondary" icon={RefreshCw} onClick={loadModels} loading={busy === "models"} disabled={!form.baseUrl || !form.apiKey} disabledReason={!form.apiKey ? t("settings.editor.needEndpointAndKey") : undefined}>{t("settings.editor.loadModels")}</Button>
        </div>
        <datalist id="provider-models">{models.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</datalist>
      </div>
      {result && <Notice tone={result.tone}>{result.text}</Notice>}
      <div className="editor-form__actions">
        <Button variant="ghost" icon={Zap} onClick={test} loading={busy === "test"} disabled={!ready} disabledReason={needAll}>{t("settings.editor.test")}</Button>
        <Button variant="secondary" onClick={() => save(false)} disabled={busy === "save"}>{t("common.actions.save")}</Button>
        <Button type="submit" variant="primary" icon={Check} loading={busy === "save"} disabled={!ready} disabledReason={needAll}>{t("settings.editor.saveAndUse")}</Button>
      </div>
    </form>
  );
}
