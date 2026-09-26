import { useRef, useState } from "react";
import { Filter, LayoutGrid } from "lucide-react";
import { CategoryDot } from "../primitives/CategoryDot.jsx";
import { actions } from "../state/useWorkspace.js";
import { FocusPopover } from "./FocusPicker.jsx";

// Lista de focos (single-select). En colapsada: botón Filtro que abre un popover.
export function SidebarFocus({ model, collapsed }) {
  const [open, setOpen] = useState(false);
  const anchor = useRef(null);
  const { graph, focusCat, progress } = model;
  if (collapsed) {
    const label = focusCat ? `Foco: ${graph.categories[focusCat].label}` : "Foco: todos";
    return (
      <div className="sidebar__focus">
        <button ref={anchor} type="button" className={`icon-btn icon-btn--md ${focusCat ? "is-selected" : ""}`} aria-label={label}
          data-tip={label} data-tip-side="right" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <Filter size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
        {open && <FocusPopover model={model} anchor={anchor} onClose={() => setOpen(false)} />}
      </div>
    );
  }
  const total = progress.total;
  return (
    <div className="sidebar__focus">
      <p className="eyebrow sidebar__eyebrow" data-tip="Elegí un grupo para aislarlo">Foco</p>
      <div role="radiogroup" aria-label="Foco de estudio" className="focus-list">
        <FocusRow checked={!focusCat} onSelect={() => actions.setFocus(null)} label="Todos"
          icon={<LayoutGrid size={16} strokeWidth={1.5} aria-hidden="true" />} count={`${progress.done}/${total}`} status={progress.status} />
        {Object.entries(graph.categories).map(([cat, info]) => (
          <FocusRow key={cat} checked={focusCat === cat} onSelect={() => actions.setFocus(cat)} label={info.label}
            icon={<CategoryDot graph={graph} cat={cat} />} count={`${progress.byCat[cat]?.done ?? 0}/${progress.byCat[cat]?.total ?? 0}`} status={progress.status} />
        ))}
      </div>
    </div>
  );
}

export function FocusRow({ checked, onSelect, label, icon, count, status }) {
  return (
    <button type="button" role="radio" aria-checked={checked} className={`side-item focus-row ${checked ? "is-selected" : ""}`} onClick={onSelect}>
      <span className="focus-row__icon">{icon}</span>
      <span className="side-item__label clamp-1">{label}</span>
      {status === "loading" ? <span className="skeleton" style={{ width: 28, height: 12 }} aria-hidden="true" />
        : <span className="side-item__meta mono">{status === "error" ? "—" : count}</span>}
    </button>
  );
}
