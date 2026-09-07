import React from "react";

export function LessonSources({ sources = [], relatedNodes = [], onOpenRelated = null }) {
  if (!sources.length && !relatedNodes.length) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px" }}>
      {sources.length > 0 && (
        <section style={{ padding: "12px 14px", background: "var(--bg-surface)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line)" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em" }}>
            FUENTES OFICIALES Y DOCUMENTACIÓN
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "8px" }}>
            {sources.map((s, idx) => (
              <a
                key={idx}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--accent-cyan)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <span>{s.label}</span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {relatedNodes.length > 0 && (
        <section style={{ padding: "12px 14px", background: "var(--bg-surface)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line)" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em" }}>
            CONCEPTOS RELACIONADOS
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
            {relatedNodes.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => onOpenRelated?.(node.id)}
                style={{
                  padding: "4px 10px", background: "var(--bg-surface-raised)",
                  border: "1px solid var(--border-line)", borderRadius: "4px",
                  fontSize: "11px", color: "var(--text-secondary)", cursor: "pointer",
                }}
              >
                Abrir: {node.label} →
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
