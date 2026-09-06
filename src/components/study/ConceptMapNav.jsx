import React from "react";

export function ConceptMapNav({
  node,
  graph,
  historyStack = [],
  onNavigateNode,
  onGoBack,
}) {
  if (!node || !graph) return null;

  const prereqNodes = (node.prerequisites || [])
    .map((id) => graph.nodes.find((n) => n.id === id))
    .filter(Boolean);

  const dependentNodes = (graph.edges || [])
    .filter(([source]) => source === node.id)
    .map(([, target]) => graph.nodes.find((n) => n.id === target))
    .filter(Boolean);

  const previousNode = historyStack.length > 0 ? historyStack[historyStack.length - 1] : null;

  const pillBtn = {
    padding: "3px 8px",
    background: "rgba(255, 255, 255, 0.04)",
    borderRadius: "6px",
    fontSize: "11px",
    color: "var(--text-secondary)",
    border: "1px solid var(--border-line)",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all var(--transition-fast)",
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 20px",
        background: "rgba(9, 12, 20, 0.9)",
        borderBottom: "1px solid var(--border-line)",
        fontSize: "12px",
        overflowX: "auto",
        whiteSpace: "nowrap",
        scrollbarWidth: "none",
        flexShrink: 0,
      }}
      aria-label="Flujo conceptual y mapa"
    >
      {previousNode && (
        <button
          type="button"
          onClick={onGoBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            color: "var(--accent-cyan)",
            fontSize: "11px",
            fontWeight: 600,
            padding: "3px 9px",
            borderRadius: "6px",
            background: "rgba(56, 189, 248, 0.1)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          ← Volver a {previousNode.label}
        </button>
      )}

      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>ANTES:</span>
        {prereqNodes.length > 0 ? (
          prereqNodes.map((p) => (
            <button key={p.id} type="button" onClick={() => onNavigateNode(p.id)} style={pillBtn}>
              {p.label}
            </button>
          ))
        ) : (
          <span style={{ color: "var(--text-muted)", fontSize: "11px", fontStyle: "italic" }}>Punto de partida</span>
        )}

        <span style={{ color: "var(--text-muted)", opacity: 0.5, fontSize: "12px" }}>→</span>

        <span
          style={{
            padding: "3px 10px",
            background: "rgba(56, 189, 248, 0.12)",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            borderRadius: "6px",
            color: "var(--accent-cyan)",
            fontWeight: 700,
            fontSize: "11.5px",
            boxShadow: "0 0 10px rgba(56, 189, 248, 0.15)",
            whiteSpace: "nowrap",
          }}
        >
          {node.label}
        </span>

        <span style={{ color: "var(--text-muted)", opacity: 0.5, fontSize: "12px" }}>→</span>

        <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>DESPUÉS:</span>
        {dependentNodes.length > 0 ? (
          dependentNodes.map((d) => (
            <button key={d.id} type="button" onClick={() => onNavigateNode(d.id)} style={pillBtn}>
              {d.label}
            </button>
          ))
        ) : (
          <span style={{ color: "var(--text-muted)", fontSize: "11px", fontStyle: "italic" }}>Eslabón avanzado</span>
        )}
      </div>
    </nav>
  );
}
