import { useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { PROVIDER_LIBRARY, createProviderDraft } from "../../ai/providerSettings.js";

// Catálogo de proveedores ejecutables agrupados.
export function ProviderPicker({ onPick }) {
  const [q, setQ] = useState("");
  const groups = useMemo(() => {
    const term = q.trim().toLowerCase();
    const map = new Map();
    PROVIDER_LIBRARY.filter((p) => !term || `${p.label} ${p.description}`.toLowerCase().includes(term))
      .forEach((p) => { if (!map.has(p.group)) map.set(p.group, []); map.get(p.group).push(p); });
    return [...map];
  }, [q]);
  return (
    <div className="picker">
      <label className="field field--search">
        <Search size={16} strokeWidth={1.5} aria-hidden="true" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar proveedor…" aria-label="Buscar proveedor" autoFocus />
      </label>
      {groups.map(([group, items]) => (
        <section key={group} className="picker__group">
          <h3 className="eyebrow">{group}</h3>
          <ul>
            {items.map((p) => (
              <li key={p.id}>
                <button type="button" className="picker__item" onClick={() => onPick(createProviderDraft(p.id))}>
                  <span className="picker__text"><strong>{p.label}</strong><span className="t2">{p.description}</span></span>
                  <ChevronRight size={16} strokeWidth={1.5} className="t3" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {groups.length === 0 && <p className="t2">No hay proveedores que coincidan.</p>}
    </div>
  );
}
