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

  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "8px 20px",
        background: "rgba(10, 13, 19, 0.75)",
        borderBottom: "1px solid var(--border-line)",
        fontSize: "12px",
      }}
      aria-label="Flujo conceptual y mapa"
    >
      {/* Botón de retroceso si venimos de otro nodo */}
      {previousNode && (
        <div style={{ display: "flex", alignItems: "center" }}>
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
              padding: "2px 8px",
              borderRadius: "4px",
              background: "rgba(94, 234, 212, 0.1)",
              border: "1px solid rgba(94, 234, 212, 0.25)",
            }}
          >
            ← Volver a {previousNode.label}
          </button>
        </div>
      )}

      {/* Flujo Antes -> Ahora -> Después */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        {/* Antes */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>ANTES:</span>
          {prereqNodes.length > 0 ? (
            prereqNodes.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onNavigateNode(p.id)}
                style={{ padding: "2px 8px", background: "rgba(255, 255, 255, 0.04)", borderRadius: "5px", fontSize: "11px", color: "var(--text-secondary)", border: "1px solid var(--border-line)" }}
              >
                {p.label}
              </button>
            ))
          ) : (
            <span style={{ color: "var(--text-muted)", fontSize: "11px", fontStyle: "italic" }}>Punto de partida</span>
          )}
        </div>

        <span style={{ color: "var(--text-muted)", opacity: 0.6 }}>→</span>

        {/* Ahora */}
        <span style={{ padding: "2px 9px", background: "rgba(94, 234, 212, 0.12)", border: "1px solid rgba(94, 234, 212, 0.4)", borderRadius: "5px", color: "var(--accent-cyan)", fontWeight: 700, fontSize: "11px", boxShadow: "0 0 8px rgba(94, 234, 212, 0.15)" }}>
          {node.label}
        </span>

        <span style={{ color: "var(--text-muted)", opacity: 0.6 }}>→</span>

        {/* Después */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>DESPUÉS:</span>
          {dependentNodes.length > 0 ? (
            dependentNodes.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => onNavigateNode(d.id)}
                style={{ padding: "2px 8px", background: "rgba(255, 255, 255, 0.04)", borderRadius: "5px", fontSize: "11px", color: "var(--text-secondary)", border: "1px solid var(--border-line)" }}
              >
                {d.label}
              </button>
            ))
          ) : (
            <span style={{ color: "var(--text-muted)", fontSize: "11px", fontStyle: "italic" }}>Eslabón avanzado</span>
          )}
        </div>
      </div>
    </nav>
  );
}
