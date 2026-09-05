import React, { useState } from "react";

export function FlashcardCard({
  node,
  category = null,
  progress = null,
  onOpenStudy = null,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const color = category?.color || "#38bdf8";
  const lesson = node?.lesson || {};
  const score = progress?.score;

  return (
    <div
      data-testid="flashcard-card"
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
            pointerEvents: isFlipped ? "none" : "auto",
            opacity: isFlipped ? 0 : 1,
            background: "linear-gradient(180deg, rgba(20, 27, 44, 0.8) 0%, rgba(12, 16, 26, 0.94) 100%)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "var(--radius-panel)",
            boxShadow: "0 4px 18px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "10.5px", fontWeight: 700, color, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />
                {category?.label || "CONCEPTO"}
              </span>
              {score != null && (
                <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: score >= 100 ? "var(--accent-green)" : "var(--accent-gold)", fontWeight: 700, background: score >= 100 ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.12)", padding: "2px 7px", borderRadius: "5px", border: `1px solid ${score >= 100 ? "rgba(16, 185, 129, 0.25)" : "rgba(245, 158, 11, 0.25)"}` }}>
                  {score}/120
                </span>
              )}
            </div>
            <h3 style={{ margin: "4px 0 8px", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.35, letterSpacing: "-0.01em" }}>
              {node.label}
            </h3>
            <p style={{ margin: 0, fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: 1.55 }}>
              {lesson.summary || "Explica este concepto y sus trade-offs en arquitectura."}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--text-muted)", borderTop: "1px solid var(--border-line)", paddingTop: "10px" }}>
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
            pointerEvents: isFlipped ? "auto" : "none",
            opacity: isFlipped ? 1 : 0,
            background: "linear-gradient(180deg, rgba(26, 35, 56, 0.95) 0%, rgba(14, 18, 30, 0.98) 100%)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${color}45`,
            borderRadius: "var(--radius-panel)",
            boxShadow: `0 0 24px -4px ${color}20, 0 8px 30px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`,
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "10px", fontWeight: 700, color: "var(--accent-gold)", letterSpacing: "0.08em" }}>
              <span>💡</span> RESPUESTA TÉCNICA CLAVE
            </span>
            <p style={{ margin: "8px 0 10px", fontSize: "12.5px", color: "var(--text-primary)", lineHeight: 1.55 }}>
              {lesson.why || lesson.explanation || "Revisa la lección completa para dominar los detalles."}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid var(--border-line)" }}>
            <span style={{ fontSize: "10.5px", color: "var(--text-muted)" }}>Volver a voltear ↺</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenStudy?.(node.id);
              }}
              style={{
                padding: "6px 14px",
                background: "linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-indigo) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "var(--radius-control)",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 600,
                boxShadow: "0 0 12px rgba(56, 189, 248, 0.25)",
                cursor: "pointer",
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
