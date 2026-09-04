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
        padding: "10px 16px",
        background: "var(--bg-surface)",
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
              gap: "4px",
              color: "var(--accent-cyan)",
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 6px",
              borderRadius: "4px",
              background: "rgba(112, 221, 212, 0.1)",
            }}
          >
            ← Volver a {previousNode.label}
          </button>
        </div>
      )}

      {/* Flujo Antes -> Ahora -> Después */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        {/* Antes */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em" }}>ANTES:</span>
          {prereqNodes.length > 0 ? (
            prereqNodes.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onNavigateNode(p.id)}
                style={{ padding: "2px 8px", background: "var(--bg-surface-raised)", borderRadius: "4px", fontSize: "11px", color: "var(--text-secondary)", border: "1px solid var(--border-line)" }}
              >
                {p.label}
              </button>
            ))
          ) : (
            <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>Punto de partida</span>
          )}
        </div>

        <span style={{ color: "var(--text-muted)" }}>→</span>

        {/* Ahora */}
        <span style={{ padding: "2px 8px", background: "var(--bg-surface-emphasis)", border: "1px solid var(--accent-cyan)", borderRadius: "4px", color: "var(--accent-cyan)", fontWeight: 700, fontSize: "11px" }}>
          {node.label}
        </span>

        <span style={{ color: "var(--text-muted)" }}>→</span>

        {/* Después */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em" }}>DESPUÉS:</span>
          {dependentNodes.length > 0 ? (
            dependentNodes.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => onNavigateNode(d.id)}
                style={{ padding: "2px 8px", background: "var(--bg-surface-raised)", borderRadius: "4px", fontSize: "11px", color: "var(--text-secondary)", border: "1px solid var(--border-line)" }}
              >
                {d.label}
              </button>
            ))
          ) : (
            <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>Eslabón avanzado</span>
          )}
        </div>
      </div>
    </nav>
  );
}
