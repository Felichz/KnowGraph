import { useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { PROVIDER_LIBRARY, createProviderDraft, presetText } from "../../ai/providerSettings.js";
import { useLocale, useT } from "../../i18n/react.js";

// Catálogo de proveedores ejecutables agrupados.
export function ProviderPicker({ onPick }) {
  const t = useT();
  const locale = useLocale();
  const [q, setQ] = useState("");
  const groups = useMemo(() => {
    const term = q.trim().toLowerCase();
    const map = new Map();
    PROVIDER_LIBRARY.map((p) => ({ ...p, label: presetText(p, "label", locale), description: presetText(p, "description", locale) }))
      .filter((p) => !term || `${p.label} ${p.description}`.toLowerCase().includes(term))
      .forEach((p) => { if (!map.has(p.groupId)) map.set(p.groupId, []); map.get(p.groupId).push(p); });
    return [...map];
  }, [q, locale]);
  return (
    <div className="picker">
      <label className="field field--search">
        <Search size={16} strokeWidth={1.5} aria-hidden="true" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("settings.picker.searchPlaceholder")} aria-label={t("settings.picker.searchLabel")} autoFocus />
      </label>
      {groups.map(([group, items]) => (
        <section key={group} className="picker__group">
          <h3 className="eyebrow">{t(`settings.picker.groups.${group}`)}</h3>
          <ul>
            {items.map((p) => (
              <li key={p.id}>
                <button type="button" className="picker__item" onClick={() => onPick(createProviderDraft({ id: p.id, label: p.label }))}>
                  <span className="picker__text"><strong>{p.label}</strong><span className="t2">{p.description}</span></span>
                  <ChevronRight size={16} strokeWidth={1.5} className="t3" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {groups.length === 0 && <p className="t2">{t("settings.picker.empty")}</p>}
    </div>
  );
}
