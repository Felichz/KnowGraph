import React, { useState } from "react";

export function FlashcardCard({ node, progress, category, onOpenNode }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const score = progress?.score ?? progress?.latestAttempt?.score ?? null;
  const isMastered = score !== null && score >= 100;
  const catColor = category?.color || "#38BDF8";

  const handleCardClick = (e) => {
    if (e.target.closest("button.study-card-btn")) return;
    setIsFlipped((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      if (e.target.closest("button.study-card-btn")) return;
      e.preventDefault();
      setIsFlipped((prev) => !prev);
    }
  };

  const question = node.interviewQuestions?.[0]?.question || node.lesson?.why || `¿Cómo funciona ${node.label} y cuáles son sus trade-offs en producción?`;
  const answer = node.lesson?.takeaway || node.lesson?.summary || "Patrón de ingeniería senior validado para escala y concurrencia.";

  return (
    <div
      data-testid="flashcard-card" tabIndex={0} onClick={handleCardClick} onKeyDown={handleKeyDown}
      className="flip-card-container" style={{ width: "100%", minHeight: "220px", height: "240px", cursor: "pointer", outline: "none" }}
    >
      <div className={`flip-card-inner ${isFlipped ? "is-flipped" : ""}`}>
        {/* Front Face */}
        <div className="flip-card-front" style={{
          background: "rgba(16, 21, 29, 0.95)", border: "1px solid var(--border-line)", borderRadius: "12px",
          padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: catColor, textTransform: "uppercase" }}>{category?.label || node.cat}</span>
              {score !== null && (
                <span style={{ fontSize: "11px", fontWeight: 700, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", color: isMastered ? "var(--color-status-excellence, #F5C451)" : "var(--text-secondary)", background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: "4px" }}>
                  {score > 100 ? `★ ${score}/120` : `${score}/120`}
                </span>
              )}
            </div>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>{node.label}</h4>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.4 }}>{question}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--border-line-subtle)" }}>
            <span style={{ fontSize: "11px", color: "var(--color-brand-primary, #5EEAD4)", display: "flex", alignItems: "center", gap: "4px" }}>
              Tocar para ver respuesta ↺
            </span>
          </div>
        </div>

        {/* Back Face */}
        <div className="flip-card-back" style={{
          background: "rgba(21, 27, 37, 0.98)", border: "1px solid rgba(94, 234, 212, 0.3)", borderRadius: "12px",
          padding: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
        }}>
          <div>
            <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--color-brand-primary, #5EEAD4)", textTransform: "uppercase" }}>
              RESPUESTA TÉCNICA CLAVE
            </span>
            <p style={{ margin: "8px 0 0 0", fontSize: "13.5px", color: "var(--text-primary)", lineHeight: 1.5 }}>{answer}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--border-line-subtle)" }}>
            <button className="study-card-btn" onClick={(e) => { e.stopPropagation(); onOpenNode(node.id); }} style={{ fontSize: "12px", fontWeight: 600, color: "#0B0D13", background: "var(--color-brand-primary, #5EEAD4)", padding: "4px 10px", borderRadius: "6px", cursor: "pointer" }}>
              Estudiar card →
            </button>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Volver a voltear ↺</span>
          </div>
        </div>
      </div>
    </div>
  );
}
