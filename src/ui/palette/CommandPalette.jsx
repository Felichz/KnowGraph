import { useMemo, useRef, useState } from "react";
import { ArrowRight, BarChart3, Languages, Layers, Map, Moon, Network, Search, Settings2, Shuffle, Sun } from "lucide-react";
import { Overlay } from "../primitives/Overlay.jsx";
import { CategoryDot } from "../primitives/CategoryDot.jsx";
import { ScoreValue } from "../primitives/Score.jsx";
import { actions } from "../state/useWorkspace.js";
import { useTheme } from "../hooks/useTheme.js";
import { toggleTheme } from "../theme/theme.js";
import { LOCALES } from "../../i18n/locale.js";
import { useLocale, useT } from "../../i18n/react.js";

const norm = (s = "") => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function buildActions(graphId, locale, theme, t) {
  const other = graphId === "react" ? "rails" : "react";
  const nextLocale = LOCALES.find((item) => item !== locale) ?? locale;
  const nextTheme = theme === "dark" ? "light" : "dark";
  return [
    { id: "a-map", label: t("palette.actions.map"), icon: Map, run: () => actions.setView("map") },
    { id: "a-flash", label: t("palette.actions.flashcards"), icon: Layers, run: () => actions.setView("flashcards") },
    { id: "a-progress", label: t("palette.actions.progress"), icon: BarChart3, run: () => actions.setView("progress") },
    { id: "a-graph", label: t("palette.actions.graphView"), icon: Network, run: () => { actions.setView("map"); actions.setPref("mapMode", "graph"); } },
    { id: "a-switch", label: t("palette.actions.switchGraph", { name: other === "react" ? "React" : "Rails" }), icon: Shuffle, run: () => actions.setGraph(other) },
    { id: "a-settings", label: t("palette.actions.settings"), icon: Settings2, run: () => actions.openOverlay("settings") },
    { id: "a-locale", label: t("palette.actions.switchLanguage", { language: t(`common.language.${nextLocale}`) }), icon: Languages, run: () => actions.setLocale(nextLocale) },
    { id: "a-theme", label: t(`common.theme.switchTo.${nextTheme}`), icon: nextTheme === "light" ? Sun : Moon, run: toggleTheme },
  ];
}

// Paleta de comandos (⌘/Ctrl+K): cards del mapa activo + acciones.
export function CommandPalette({ model, open, onClose }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef(null);
  const t = useT();
  const locale = useLocale();
  const { theme } = useTheme();
  const { graph, progress } = model;

  const results = useMemo(() => {
    const q = norm(query.trim());
    const acts = buildActions(graph.id, locale, theme, t).filter((a) => !q || norm(a.label).includes(q)).map((a) => ({ ...a, kind: "action" }));
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
  }, [query, graph, locale, theme, t]);

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
    <Overlay open={open} onClose={close} kind="palette" label={t("palette.dialogLabel")}>
      <div className="palette" onKeyDown={onKeyDown}>
        <label className="palette__search">
          <Search size={16} strokeWidth={1.5} aria-hidden="true" />
          <input autoFocus value={query} onChange={(e) => { setQuery(e.target.value); setActive(0); }} placeholder={t("palette.placeholder", { graph: graph.label })}
            role="combobox" aria-expanded="true" aria-controls="palette-list" aria-activedescendant={results[active] ? `pal-${results[active].id}` : undefined} />
        </label>
        <ul id="palette-list" ref={listRef} className="palette__list" role="listbox" aria-label={t("palette.resultsLabel")}>
          {results.length === 0 && <li className="palette__empty t2">{t("palette.empty", { query })}</li>}
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
