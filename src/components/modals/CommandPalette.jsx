import React, { useEffect, useMemo, useRef, useState } from "react";

export function CommandPalette({
  isOpen,
  onClose,
  nodes = [],
  onSelectNode,
  onSwitchView,
  onOpenSeniority,
  onOpenSettings,
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const quickActions = useMemo(() => [
    { id: "action-flashcards", label: "Ir a modo Flashcards (Active recall)", keywords: ["flashcards", "cards"], run: () => onSwitchView("flashcards") },
    { id: "action-graph", label: "Ir a modo Grafo (Mapa curricular)", keywords: ["grafo", "graph"], run: () => onSwitchView("graph") },
    { id: "action-seniority", label: "Ver Mapa de Seniority y Milestones", keywords: ["seniority", "hitos"], run: onOpenSeniority },
    { id: "action-backup", label: "Configurar proveedores de IA y Respaldo", keywords: ["respaldo", "backup", "byok", "ia"], run: onOpenSettings },
  ], [onSwitchView, onOpenSeniority, onOpenSettings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { actions: quickActions, nodes: nodes.slice(0, 8) };
    const matchedActions = quickActions.filter((a) => a.label.toLowerCase().includes(q) || a.keywords.some((k) => k.includes(q)));
    const matchedNodes = nodes.filter((n) => n.label.toLowerCase().includes(q) || n.cat.toLowerCase().includes(q)).slice(0, 15);
    return { actions: matchedActions, nodes: matchedNodes };
  }, [query, quickActions, nodes]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 50, background: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "14vh",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: "580px", background: "var(--color-surface-overlay, #1E2532)",
        borderRadius: "12px", border: "1px solid var(--border-line)", boxShadow: "0 24px 64px rgba(0,0,0,0.8)", overflow: "hidden",
      }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-line)", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "16px", color: "var(--text-muted)" }}>🔍</span>
          <input
            ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar concepto o acción... (Ctrl+K)"
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "14px" }}
          />
          <kbd style={{ fontSize: "11px", padding: "2px 6px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>ESC</kbd>
        </div>

        <div style={{ maxHeight: "360px", overflowY: "auto", padding: "8px" }}>
          {filtered.actions.length > 0 && (
            <div style={{ marginBottom: "8px" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", padding: "4px 8px", display: "block" }}>
                Acciones Rápidas
              </span>
              {filtered.actions.map((act) => (
                <div
                  key={act.id} onClick={() => { onClose(); act.run(); }}
                  style={{ padding: "8px 10px", borderRadius: "6px", fontSize: "13px", color: "var(--color-brand-primary, #5EEAD4)", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span>⚡</span><span>{act.label}</span>
                </div>
              ))}
            </div>
          )}

          {filtered.nodes.length > 0 && (
            <div>
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", padding: "4px 8px", display: "block" }}>
                Conceptos Curriculares
              </span>
              {filtered.nodes.map((n) => (
                <div
                  key={n.id} onClick={() => { onClose(); onSelectNode(n.id); }}
                  style={{ padding: "8px 10px", borderRadius: "6px", fontSize: "13px", color: "var(--text-primary)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span>{n.label}</span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>{n.cat}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
