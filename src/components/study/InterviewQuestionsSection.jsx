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
    <section style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line)", overflow: "hidden" }}>
      <details style={{ padding: "14px" }}>
        <summary style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: "13px" }}>
          <span style={{ fontSize: "11px", color: "var(--accent-cyan)", letterSpacing: "0.06em" }}>
            PREGUNTAS DE ENTREVISTA FAANG
          </span>
          <span style={{ fontSize: "12px", color: unlockedCount === questions.length ? "var(--accent-green)" : "var(--accent-gold)" }}>
            {unlockedCount}/{questions.length} desbloqueadas
          </span>
        </summary>

        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {evaluated.map(({ question, missingNodes, isUnlocked }) => (
            <div
              key={question.id}
              style={{
                padding: "8px 12px",
                background: "var(--bg-surface-raised)",
                borderRadius: "var(--radius-control)",
                borderLeft: `3px solid ${isUnlocked ? "var(--accent-green)" : "var(--accent-red)"}`,
                fontSize: "12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                <strong>#{question.id}: {question.title}</strong>
                <span style={{ fontSize: "10px", fontWeight: 700, color: isUnlocked ? "var(--accent-green)" : "var(--text-muted)" }}>
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
              style={{ fontSize: "11px", color: "var(--accent-cyan)", marginTop: "4px", textDecoration: "none" }}
            >
              Ver banco de preguntas de referencia en GreatFrontEnd ↗
            </a>
          )}
        </div>
      </details>
    </section>
  );
}
