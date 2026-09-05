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
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(4, 7, 14, 0.85)", backdropFilter: "blur(16px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "80px", zIndex: 9999 }} onClick={onClose}>
      <div style={{ width: "100%", maxWidth: "600px", background: "linear-gradient(180deg, rgba(20, 27, 44, 0.96) 0%, rgba(11, 15, 26, 0.98) 100%)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "16px", boxShadow: "0 30px 80px -10px rgba(0, 0, 0, 0.9), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)", overflow: "hidden" }} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Buscar o ejecutar acción">
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border-line)", display: "flex", alignItems: "center", gap: "12px", background: "rgba(16, 22, 36, 0.5)" }}>
          <span style={{ fontSize: "16px", color: "var(--accent-cyan)", opacity: 0.85 }}>🔍</span>
          <input
            ref={inputRef} type="text" value={query} onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown} placeholder="Buscar concepto o acción… (ej. flashcards, hooks)"
            style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: "15px", color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}
          />
          <kbd style={{ fontSize: "10.5px", fontFamily: "var(--font-mono)", background: "rgba(0, 0, 0, 0.45)", padding: "2px 7px", borderRadius: "5px", border: "1px solid var(--border-line)", color: "var(--text-muted)" }}>
            ESC
          </kbd>
        </div>

        <ul style={{ listStyle: "none", margin: 0, padding: "8px 0", maxHeight: "350px", overflowY: "auto" }}>
          {items.length === 0 ? (
            <li style={{ padding: "20px", color: "var(--text-muted)", fontSize: "13px", textAlign: "center" }}>No se encontraron conceptos ni comandos.</li>
          ) : (
            items.map((item, i) => {
              const isSelected = i === selectedIndex;
              if (!item.isNode) {
                return (
                  <li key={item.id} onClick={item.run} style={{ display: "flex", alignItems: "center", padding: "11px 22px", cursor: "pointer", background: isSelected ? "rgba(245, 158, 11, 0.12)" : "transparent", color: isSelected ? "var(--accent-gold)" : "var(--text-secondary)", fontSize: "13px", fontWeight: 600, borderLeft: isSelected ? "2px solid var(--accent-gold)" : "2px solid transparent", transition: "all var(--transition-fast)" }}>
                    {item.label}
                  </li>
                );
              }
              const cat = categories[item.cat] || { label: item.cat, color: "#38bdf8" };
              return (
                <li key={item.id} onClick={() => { onSelectNode?.(item.id); onClose?.(); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 22px", cursor: "pointer", background: isSelected ? "rgba(56, 189, 248, 0.12)" : "transparent", color: isSelected ? "var(--accent-cyan)" : "var(--text-primary)", fontSize: "13px", borderLeft: isSelected ? "2px solid var(--accent-cyan)" : "2px solid transparent", transition: "all var(--transition-fast)" }}>
                  <span style={{ fontWeight: isSelected ? 600 : 400 }}>{item.label}</span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cat.color, boxShadow: `0 0 6px ${cat.color}` }} />
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
