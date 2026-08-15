import React, { useState, useEffect, useRef, useMemo } from "react";

export function CommandPalette({
  open,
  onClose,
  graph,
  onSelectNode,
  onSwitchGraph,
  onOpenFlashcards,
  onOpenProviderSettings,
  onOpenProgress,
  graphConfigs = {},
  activeGraphKey = "react",
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const allItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    const actions = [
      {
        id: "action-flashcards",
        type: "action",
        label: "Iniciar práctica de Flashcards",
        description: "Repaso activo con tarjetas y autoevaluación",
        icon: "✦",
        run: () => { onClose(); onOpenFlashcards?.(); },
      },
      {
        id: "action-progress",
        type: "action",
        label: "Ver progreso y milestones",
        description: "Métricas de dominio por etapas y seniority",
        icon: "📊",
        run: () => { onClose(); onOpenProgress?.(); },
      },
      {
        id: "action-providers",
        type: "action",
        label: "Configurar proveedores de IA",
        description: "Conexiones de OpenCode, Groq, Ollama, OpenAI y endpoints locales",
        icon: "⚙",
        run: () => { onClose(); onOpenProviderSettings?.(); },
      },
      ...Object.values(graphConfigs)
        .filter((g) => g.id !== activeGraphKey)
        .map((g) => ({
          id: `action-switch-${g.id}`,
          type: "action",
          label: `Cambiar a mapa de ${g.label}`,
          description: `Explorar ${g.subtitle || "conceptos clave"}`,
          icon: "🗺",
          run: () => { onClose(); onSwitchGraph?.(g.id); },
        })),
    ].filter((item) => !q || item.label.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));

    const nodes = (graph?.nodes ?? []).map((node) => {
      const cat = graph?.categories?.[node.cat]?.label ?? node.cat;
      const summary = node.lesson?.summary ?? "";
      return {
        id: `node-${node.id}`,
        type: "node",
        node,
        label: node.label ?? node.title,
        category: cat,
        summary,
        priority: node.priority,
        run: () => { onClose(); onSelectNode?.(node); },
      };
    }).filter((item) => {
      if (!q) return true;
      return (
        item.label.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q)
      );
    });

    return [...actions, ...nodes];
  }, [query, graph, graphConfigs, activeGraphKey, onClose, onSelectNode, onSwitchGraph, onOpenFlashcards, onOpenProviderSettings, onOpenProgress]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (allItems.length ? (prev + 1) % allItems.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (allItems.length ? (prev - 1 + allItems.length) % allItems.length : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (allItems[selectedIndex]) {
          allItems[selectedIndex].run();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, allItems, selectedIndex, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const activeEl = list.querySelector(".is-selected");
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!open) return null;

  return (
    <div
      className="command-palette-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="command-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Buscador y paleta de comandos"
      >
        <div className="command-palette__search">
          <svg className="command-palette__search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="M16 16l-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="command-palette__input"
            placeholder="Buscar concepto, card, acción o atajo... (Escribí para filtrar)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="command-palette__esc-badge">ESC</kbd>
        </div>

        <div className="command-palette__list" ref={listRef} role="listbox">
          {allItems.length === 0 ? (
            <div className="command-palette__empty">
              <span>No se encontraron conceptos ni acciones para "{query}".</span>
            </div>
          ) : (
            allItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              if (item.type === "action") {
                return (
                  <div
                    key={item.id}
                    role="option"
                    aria-selected={isSelected}
                    className={`command-palette__item command-palette__item--action ${isSelected ? "is-selected" : ""}`}
                    onClick={item.run}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <span className="command-palette__item-icon">{item.icon}</span>
                    <div className="command-palette__item-content">
                      <strong className="command-palette__item-title">{item.label}</strong>
                      <span className="command-palette__item-desc">{item.description}</span>
                    </div>
                    <span className="command-palette__item-badge">Acción</span>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  role="option"
                  aria-selected={isSelected}
                  className={`command-palette__item command-palette__item--node ${isSelected ? "is-selected" : ""}`}
                  onClick={item.run}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <span className="command-palette__item-priority">#{String(item.priority ?? idx + 1).padStart(2, "0")}</span>
                  <div className="command-palette__item-content">
                    <div className="command-palette__item-top">
                      <strong className="command-palette__item-title">{item.label}</strong>
                      <span className="command-palette__item-cat">{item.category}</span>
                    </div>
                    {item.summary && <span className="command-palette__item-desc">{item.summary}</span>}
                  </div>
                  <span className="command-palette__item-enter-hint" aria-hidden="true">↵</span>
                </div>
              );
            })
          )}
        </div>

        <footer className="command-palette__footer">
          <div className="command-palette__shortcuts">
            <span><kbd>↑</kbd><kbd>↓</kbd> Navegar</span>
            <span><kbd>↵</kbd> Abrir</span>
            <span><kbd>ESC</kbd> Cerrar</span>
          </div>
          <span className="command-palette__total">{allItems.length} resultados</span>
        </footer>
      </div>
    </div>
  );
}
