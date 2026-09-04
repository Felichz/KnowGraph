import React, { useState } from "react";

export function FlashcardCard({
  node,
  category = null,
  progress = null,
  onOpenStudy = null,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const color = category?.color || "#70ddd4";
  const lesson = node?.lesson || {};
  const score = progress?.score;

  return (
    <div
      style={{ perspective: "1000px", minHeight: "220px", cursor: "pointer" }}
      onClick={() => setIsFlipped((v) => !v)}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          minHeight: "220px",
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "none",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* CARA ANVERSO (Pregunta de entrevista) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-line)",
            borderTop: `4px solid ${color}`,
            borderRadius: "var(--radius-panel)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color, letterSpacing: "0.05em" }}>
                {category?.label || "CONCEPTO"}
              </span>
              {score != null && (
                <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: score >= 100 ? "var(--accent-green)" : "var(--accent-gold)", fontWeight: 700 }}>
                  {score}/120
                </span>
              )}
            </div>
            <h3 style={{ margin: "4px 0 8px", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
              {node.label}
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {lesson.summary || "Explica este concepto y sus trade-offs en arquitectura."}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--text-muted)", borderTop: "1px solid var(--border-line)", paddingTop: "8px" }}>
            <span>Tocar para ver respuesta ↺</span>
          </div>
        </div>

        {/* CARA REVERSO (Respuesta técnica y por qué importa) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "var(--bg-surface-emphasis)",
            border: `1px solid ${color}`,
            borderRadius: "var(--radius-panel)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-gold)", letterSpacing: "0.08em" }}>
              RESPUESTA TÉCNICA CLAVE
            </span>
            <p style={{ margin: "6px 0 10px", fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.5 }}>
              {lesson.why || lesson.explanation || "Revisa la lección completa para dominar los detalles."}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--border-line)" }}>
            <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Volver a voltear ↺</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenStudy?.(node.id);
              }}
              style={{
                padding: "4px 10px",
                background: "var(--bg-surface-raised)",
                border: "1px solid var(--accent-cyan)",
                borderRadius: "var(--radius-control)",
                color: "var(--accent-cyan)",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              Estudiar card →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
