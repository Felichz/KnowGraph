import React from "react";
import { evaluateInterviewQuestions } from "../../logic/interviewUnlock.js";

export function InterviewQuestionsSection({
  node,
  graph,
  checked = new Set(),
}) {
  const questions = node?.interviewQuestions || [];
  if (questions.length === 0) return null;

  const evaluated = evaluateInterviewQuestions(questions, graph, checked);
  const unlockedCount = evaluated.filter((e) => e.isUnlocked).length;

  return (
    <section style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line-strong)", boxShadow: "var(--shadow-card)", overflow: "hidden" }}>
      <details style={{ padding: "16px" }}>
        <summary style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: "13px" }}>
          <span style={{ fontSize: "11px", color: "var(--accent-cyan)", letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>
            PREGUNTAS DE ENTREVISTA FAANG
          </span>
          <span style={{ fontSize: "11.5px", fontFamily: "var(--font-mono)", color: unlockedCount === questions.length ? "var(--accent-green)" : "var(--accent-gold)", fontWeight: 600 }}>
            {unlockedCount}/{questions.length} desbloqueadas
          </span>
        </summary>

        <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {evaluated.map(({ question, missingNodes, isUnlocked }) => (
            <div
              key={question.id}
              style={{
                padding: "10px 14px",
                background: isUnlocked ? "rgba(74, 222, 128, 0.04)" : "rgba(248, 113, 113, 0.04)",
                borderRadius: "var(--radius-control)",
                border: `1px solid ${isUnlocked ? "rgba(74, 222, 128, 0.2)" : "rgba(248, 113, 113, 0.2)"}`,
                borderLeft: `3px solid ${isUnlocked ? "var(--accent-green)" : "var(--accent-red)"}`,
                fontSize: "12.5px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                <strong>#{question.id}: {question.title}</strong>
                <span style={{ fontSize: "10px", fontWeight: 700, fontFamily: "var(--font-mono)", color: isUnlocked ? "var(--accent-green)" : "var(--text-muted)" }}>
                  {isUnlocked ? "✓ LISTA" : "BLOQUEADA"}
                </span>
              </div>
              {!isUnlocked && (
                <p style={{ margin: "4px 0 0", fontSize: "11px", color: "var(--text-muted)" }}>
                  Prerrequisitos pendientes: {missingNodes.map((n) => n.label).join(", ")}
                </p>
              )}
            </div>
          ))}

          {graph.interviewQuestionSource && (
            <a
              href={graph.interviewQuestionSource}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "11.5px", color: "var(--accent-cyan)", marginTop: "4px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <span>Ver banco de preguntas de referencia en GreatFrontEnd</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </details>
    </section>
  );
}
