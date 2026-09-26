import { useMemo, useRef, useState } from "react";
import { ArrowRight, BarChart3, Layers, Map, Network, Search, Settings2, Shuffle } from "lucide-react";
import { Overlay } from "../primitives/Overlay.jsx";
import { CategoryDot } from "../primitives/CategoryDot.jsx";
import { ScoreValue } from "../primitives/Score.jsx";
import { actions } from "../state/useWorkspace.js";

const norm = (s = "") => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function buildActions(graphId) {
  const other = graphId === "react" ? "rails" : "react";
  return [
    { id: "a-map", label: "Ir al mapa", icon: Map, run: () => actions.setView("map") },
    { id: "a-flash", label: "Ir a flashcards", icon: Layers, run: () => actions.setView("flashcards") },
    { id: "a-progress", label: "Ver progreso", icon: BarChart3, run: () => actions.setView("progress") },
    { id: "a-graph", label: "Ver el mapa como grafo", icon: Network, run: () => { actions.setView("map"); actions.setPref("mapMode", "graph"); } },
    { id: "a-switch", label: `Cambiar a ${other === "react" ? "React" : "Rails"}`, icon: Shuffle, run: () => actions.setGraph(other) },
    { id: "a-settings", label: "Conexiones de IA y respaldo", icon: Settings2, run: () => actions.openOverlay("settings") },
  ];
}

// Paleta de comandos (⌘/Ctrl+K): cards del mapa activo + acciones.
export function CommandPalette({ model, open, onClose }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef(null);
  const { graph, progress } = model;

  const results = useMemo(() => {
    const q = norm(query.trim());
    const acts = buildActions(graph.id).filter((a) => !q || norm(a.label).includes(q)).map((a) => ({ ...a, kind: "action" }));
    const cards = graph.nodes
      .map((node) => {
        const label = norm(node.label);
        const cat = norm(graph.categories[node.cat]?.label);
        const score = !q ? 0 : label.startsWith(q) ? 3 : label.includes(q) ? 2 : cat.includes(q) || norm(node.lesson?.summary).includes(q) ? 1 : 0;
        return { node, score };
      })
      .filter((r) => !q || r.score > 0)
      .sort((a, b) => b.score - a.score || a.node.priority - b.node.priority)
      .slice(0, q ? 12 : 6)
      .map(({ node }) => ({ id: node.id, kind: "card", node, run: () => actions.openCard(node.id) }));
    return q ? [...cards, ...acts] : [...acts, ...cards];
  }, [query, graph]);

  const close = () => { setQuery(""); setActive(0); onClose(); };
  const choose = (item) => { close(); item.run(); };
  const onKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = (active + (event.key === "ArrowDown" ? 1 : -1) + results.length) % Math.max(results.length, 1);
      setActive(next);
      listRef.current?.querySelector(`[data-index="${next}"]`)?.scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter" && results[active]) { event.preventDefault(); choose(results[active]); }
  };

  return (
    <Overlay open={open} onClose={close} kind="palette" label="Buscar">
      <div className="palette" onKeyDown={onKeyDown}>
        <label className="palette__search">
          <Search size={16} strokeWidth={1.5} aria-hidden="true" />
          <input autoFocus value={query} onChange={(e) => { setQuery(e.target.value); setActive(0); }} placeholder={`Buscar en ${graph.label} o escribir un comando…`}
            role="combobox" aria-expanded="true" aria-controls="palette-list" aria-activedescendant={results[active] ? `pal-${results[active].id}` : undefined} />
        </label>
        <ul id="palette-list" ref={listRef} className="palette__list" role="listbox" aria-label="Resultados">
          {results.length === 0 && <li className="palette__empty t2">Sin resultados para “{query}”.</li>}
          {results.map((item, i) => {
            const Icon = item.icon;
            return (
              <li key={item.id} id={`pal-${item.id}`} role="option" aria-selected={i === active} data-index={i}
                className={`palette__item ${i === active ? "is-active" : ""}`} onMouseMove={() => setActive(i)} onClick={() => choose(item)}>
                {item.kind === "card" ? <CategoryDot graph={graph} cat={item.node.cat} /> : <Icon size={16} strokeWidth={1.5} aria-hidden="true" />}
                <span className="palette__label clamp-1">{item.kind === "card" ? item.node.label : item.label}</span>
                {item.kind === "card" ? <ScoreValue score={progress.of(item.node.id).displayScore} empty="" /> : <ArrowRight size={14} strokeWidth={1.5} className="t3" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      </div>
    </Overlay>
  );
}
