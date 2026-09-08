import React, { useState } from "react";

export function StudyStageReadExtras({ node }) {
  const [showAnswerForId, setShowAnswerForId] = useState(null);

  const questions = node?.interviewQuestions || node?.lesson?.interviewQuestions || [
    {
      id: "q1",
      source: "GreatFrontEnd",
      title: "Senior Architectural Drill",
      question: `¿Cómo mitigarías caídas de rendimiento asociadas a ${node?.label || "este concepto"} en entornos de alto tráfico?`,
      sampleAnswer: "Identificar cuellos de botella con profiling, separar mutaciones síncronas de commits y aplicar técnicas concurrentes.",
    },
  ];

  const sources = node?.lesson?.sources || [
    { title: "React Official Documentation", url: "https://react.dev", type: "official" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
      {/* FAANG Interview Coverage Accordion */}
      <details
        style={{
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid var(--border-line)",
          borderRadius: "8px",
          padding: "10px 14px",
        }}
      >
        <summary
          style={{
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "11px",
            letterSpacing: "0.06em",
            color: "var(--accent-cyan)",
            textTransform: "uppercase",
            userSelect: "none",
          }}
        >
          PREGUNTAS DE ENTREVISTA FAANG ({questions.length})
        </summary>

        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {questions.map((q) => (
            <div
              key={q.id || q.title}
              style={{
                padding: "10px",
                background: "rgba(0, 0, 0, 0.25)",
                borderRadius: "6px",
                border: "1px solid var(--border-line-subtle)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: "rgba(99, 102, 241, 0.15)",
                    color: "var(--accent-indigo, #818CF8)",
                  }}
                >
                  {q.source || "GreatFrontEnd"}
                </span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>
                  {q.title}
                </span>
              </div>

              <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                {q.question}
              </p>

              <button
                onClick={() => setShowAnswerForId((prev) => (prev === q.id ? null : q.id))}
                style={{
                  fontSize: "11px",
                  color: "var(--color-brand-primary, #5EEAD4)",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                {showAnswerForId === q.id ? "Ocultar respuesta" : "Ver respuesta de referencia"}
              </button>

              {showAnswerForId === q.id && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "8px 10px",
                    borderRadius: "4px",
                    background: "rgba(255, 255, 255, 0.04)",
                    fontSize: "12.5px",
                    color: "var(--text-primary)",
                    lineHeight: 1.4,
                  }}
                >
                  {q.sampleAnswer}
                </div>
              )}
            </div>
          ))}
        </div>
      </details>

      {/* Official Documentation Sources */}
      <section style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <h4 style={{ margin: 0, fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", color: "var(--text-muted)", textTransform: "uppercase" }}>
          FUENTES OFICIALES
        </h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {sources.map((src) => (
            <a
              key={src.url}
              href={src.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                color: "var(--accent-cyan)",
                textDecoration: "none",
                background: "rgba(56, 189, 248, 0.06)",
                padding: "3px 8px",
                borderRadius: "4px",
                border: "1px solid rgba(56, 189, 248, 0.2)",
              }}
            >
              <span>{src.title}</span>
              <span>↗</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
