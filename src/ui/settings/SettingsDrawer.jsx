import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { loadProviderSettings, providerStorageDescription, removeProviderProfile, setActiveProviderProfile } from "../../ai/providerSettings.js";
import { Overlay, OverlayHeader } from "../primitives/Overlay.jsx";
import { Button, IconButton } from "../primitives/Button.jsx";
import { Notice } from "../primitives/Feedback.jsx";
import { notifyProviderChanged } from "../hooks/useProviderLabel.js";
import { toast } from "../state/toastStore.js";
import { ProviderPicker } from "./ProviderPicker.jsx";
import { ProviderEditor } from "./ProviderEditor.jsx";
import { BackupSection } from "./BackupSection.jsx";
import { LanguageSection } from "./LanguageSection.jsx";
import { ThemeSection } from "./ThemeSection.jsx";
import { useT } from "../../i18n/react.js";

// Conexiones de IA (lista · catálogo · editor) y respaldo local (US5).
export default function SettingsDrawer({ open, onClose, initialView }) {
  const t = useT();
  const [view, setView] = useState(initialView === "picker" ? "picker" : "list");
  const [editing, setEditing] = useState(null);
  const [state, setState] = useState({ profiles: [], activeProfileId: null });
  const [error, setError] = useState(null);

  const reload = useCallback(() => loadProviderSettings().then((s) => setState({ profiles: s.profiles ?? [], activeProfileId: s.activeProfileId ?? null })).catch((e) => setError(e.message)), []);
  useEffect(() => { reload(); }, [reload]);

  const activate = async (id) => {
    try { await setActiveProviderProfile(id); await reload(); notifyProviderChanged(); setError(null); } catch (e) { setError(e.message); }
  };
  const remove = async (profile) => {
    await removeProviderProfile(profile.id); await reload(); notifyProviderChanged();
    toast({ tone: "info", message: t("settings.drawer.removed", { label: profile.label }) });
  };
  const back = () => { setView("list"); setEditing(null); reload(); };

  const title = view === "picker" ? t("settings.drawer.newConnection") : view === "editor" ? (editing?.label || t("settings.drawer.connection")) : t("settings.drawer.title");
  return (
    <Overlay open={open} onClose={onClose} kind="drawer" labelledBy="settings-title">
      <OverlayHeader id="settings-title" title={title} subtitle={view === "list" ? providerStorageDescription() : undefined} onClose={onClose}
        actions={view !== "list" ? <IconButton icon={ArrowLeft} label={t("common.actions.back")} onClick={back} /> : null} />
      <div className="settings">
        {view === "picker" && <ProviderPicker onPick={(draft) => { setEditing(draft); setView("editor"); }} />}
        {view === "editor" && editing && <ProviderEditor draft={editing} onSaved={back} />}
        {view === "list" && (
          <>
            {error && <Notice tone="error">{error}</Notice>}
            <section className="settings__section">
              <div role="radiogroup" aria-label={t("settings.drawer.activeConnection")} className="conn-list">
                <label className={`conn ${!state.activeProfileId ? "is-active" : ""}`}>
                  <input type="radio" name="conn" checked={!state.activeProfileId} onChange={() => activate(null)} />
                  <span className="conn__text"><strong>{t("settings.drawer.gatewayTitle")}</strong><span className="t3">{t("settings.drawer.gatewayHint")}</span></span>
                </label>
                {state.profiles.map((p) => (
                  <div key={p.id} className={`conn ${state.activeProfileId === p.id ? "is-active" : ""}`}>
                    <label className="conn__main">
                      <input type="radio" name="conn" checked={state.activeProfileId === p.id} onChange={() => activate(p.id)} />
                      <span className="conn__text"><strong className="clamp-1">{p.label}</strong><span className="t3 mono clamp-1">{p.model || t("settings.drawer.noModel")}</span></span>
                    </label>
                    <IconButton icon={Pencil} label={t("settings.drawer.editConnection", { label: p.label })} onClick={() => { setEditing(p); setView("editor"); }} />
                    <IconButton icon={Trash2} label={t("settings.drawer.deleteConnection", { label: p.label })} onClick={() => remove(p)} />
                  </div>
                ))}
              </div>
              <Button variant="secondary" icon={Plus} onClick={() => setView("picker")}>{t("settings.drawer.addConnection")}</Button>
            </section>
            <LanguageSection />
            <ThemeSection />
            <BackupSection onRestored={reload} />
          </>
        )}
      </div>
    </Overlay>
  );
}
