import { useEffect, useRef } from "react";
import { CategoryDot } from "../primitives/CategoryDot.jsx";
import { useIsMobile } from "../hooks/useMediaQuery.js";
import { actions, useWorkspace } from "../state/useWorkspace.js";
import { ConceptCard, ConceptRow } from "./ConceptCard.jsx";

// Grupos por categoría con cabecera sticky (INF-030…038). ←/→ mueven el foco entre cards.
export function ConceptGroups({ model, activeTaskNodeIds }) {
  const mobile = useIsMobile();
  const lastOpened = useWorkspace((s) => s.lastOpenedNodeId);
  const root = useRef(null);
  const { graph, activeCats, progress, guidance } = model;

  useEffect(() => {
    if (!lastOpened || !root.current) return;
    const el = root.current.querySelector(`[data-node="${lastOpened}"]`);
    if (!el) return;
    el.scrollIntoView({ block: "nearest" });
    el.classList.add("is-highlight");
    const t = setTimeout(() => el.classList.remove("is-highlight"), 1200);
    return () => clearTimeout(t);
  }, [lastOpened]);

  function onKeyDown(event) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const items = [...root.current.querySelectorAll("[data-node]")];
    const i = items.indexOf(document.activeElement);
    if (i < 0) return;
    event.preventDefault();
    items[Math.max(0, Math.min(items.length - 1, i + (event.key === "ArrowRight" ? 1 : -1)))]?.focus();
  }

  const groups = Object.keys(graph.categories).filter((cat) => activeCats.has(cat));
  return (
    <div ref={root} className="groups" onKeyDown={onKeyDown}>
      {groups.map((cat) => {
        const nodes = graph.nodes.filter((node) => node.cat === cat).sort((a, b) => a.priority - b.priority);
        const stats = progress.byCat[cat] ?? { done: 0, total: nodes.length };
        return (
          <section key={cat} className="group" aria-labelledby={`group-${cat}`}>
            <header className="group__head">
              <h2 id={`group-${cat}`} className="group__title">
                <CategoryDot graph={graph} cat={cat} /> {graph.categories[cat].label}
              </h2>
              <span className="group__count mono">{progress.status === "error" ? "—" : `${stats.done}/${stats.total}`} dominadas</span>
              {graph.categoryContext?.[cat] ? <p className="group__context clamp-1">{graph.categoryContext[cat]}</p> : null}
            </header>
            <div className={mobile ? "rows" : "grid"}>
              {nodes.map((node) => {
                const props = {
                  key: node.id, node, graph, p: progress.of(node.id), loading: progress.status === "loading",
                  level: guidance.levelById.get(node.id) ?? 0, aiActive: activeTaskNodeIds.has(node.id),
                  missing: node.prerequisites.filter((id) => !progress.checked.has(id)).map((id) => graph.nodeById.get(id)?.label).filter(Boolean),
                  onOpen: () => actions.openCard(node.id),
                };
                return mobile ? <ConceptRow {...props} /> : <ConceptCard {...props} />;
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
