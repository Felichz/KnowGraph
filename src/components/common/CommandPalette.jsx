import React, { useEffect, useRef, useState } from "react";

export function CommandPalette({
  open = false,
  nodes = [],
  categories = {},
  onSelectNode,
  onOpenFlashcards,
  onOpenProgress,
  onOpenSettings,
  onClose,
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const cleanQuery = query.trim().toLowerCase();

  const actions = [
    { id: "action-flashcards", label: "📇 Ir a modo Flashcards", run: () => { onClose?.(); onOpenFlashcards?.(); } },
    { id: "action-progress", label: "📊 Ver mapa de Seniority y Milestones", run: () => { onClose?.(); onOpenProgress?.(); } },
    { id: "action-settings", label: "⚙️ Configurar proveedores de IA y Respaldo", run: () => { onClose?.(); onOpenSettings?.(); } },
  ].filter((a) => !cleanQuery || a.label.toLowerCase().includes(cleanQuery));

  const filteredNodes = nodes
    .filter((n) => n.label.toLowerCase().includes(cleanQuery) || (categories[n.cat]?.label || "").toLowerCase().includes(cleanQuery))
    .map((n) => ({ id: n.id, label: n.label, cat: n.cat, isNode: true }));

  const items = [...actions, ...filteredNodes];

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, items.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + items.length) % Math.max(1, items.length));
    } else if (e.key === "Enter" && items[selectedIndex]) {
      e.preventDefault();
      const item = items[selectedIndex];
      if (item.run) item.run();
      else { onSelectNode?.(item.id); onClose?.(); }
    } else if (e.key === "Escape") {
      onClose?.();
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(9, 11, 15, 0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "80px", zIndex: 9999 }} onClick={onClose}>
      <div style={{ width: "100%", maxWidth: "540px", background: "var(--bg-surface)", border: "1px solid var(--border-line-strong)", borderRadius: "var(--radius-panel)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", overflow: "hidden" }} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Buscar o ejecutar acción">
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-line)" }}>
          <input
            ref={inputRef} type="text" value={query} onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown} placeholder="Buscar concepto o acción… (ej. flashcards, hooks)"
            style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "var(--text-primary)" }}
          />
        </div>

        <ul style={{ listStyle: "none", margin: 0, padding: "6px 0", maxHeight: "320px", overflowY: "auto" }}>
          {items.length === 0 ? (
            <li style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "13px" }}>No se encontraron conceptos ni comandos.</li>
          ) : (
            items.map((item, i) => {
              const isSelected = i === selectedIndex;
              if (!item.isNode) {
                return (
                  <li key={item.id} onClick={item.run} style={{ display: "flex", alignItems: "center", padding: "8px 16px", cursor: "pointer", background: isSelected ? "var(--bg-surface-raised)" : "transparent", color: isSelected ? "var(--accent-cyan)" : "var(--accent-gold)", fontSize: "13px", fontWeight: 600 }}>
                    {item.label}
                  </li>
                );
              }
              const cat = categories[item.cat] || { label: item.cat, color: "#70ddd4" };
              return (
                <li key={item.id} onClick={() => { onSelectNode?.(item.id); onClose?.(); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", cursor: "pointer", background: isSelected ? "var(--bg-surface-raised)" : "transparent", color: isSelected ? "var(--accent-cyan)" : "var(--text-primary)", fontSize: "13px" }}>
                  <span>{item.label}</span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cat.color }} />
                    {cat.label}
                  </span>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
