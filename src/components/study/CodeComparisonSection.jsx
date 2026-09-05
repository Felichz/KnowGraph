import React, { useState } from "react";
import { CodeSnippet } from "../common/CodeSnippet.jsx";

export function CodeComparisonSection({ lesson }) {
  const comparison = lesson?.codeComparison;
  const [activeTab, setActiveTab] = useState("production");

  if (!comparison && !lesson?.code) return null;

  if (!comparison) {
    return (
      <section>
        <CodeSnippet
          code={lesson.code}
          language={lesson.codeLang || "javascript"}
          narration={lesson.takeaway}
          label={lesson.codeLabel || "Ejemplo"}
        />
      </section>
    );
  }

  const { naive, production } = comparison;
  const current = activeTab === "naive" ? naive : production;

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ margin: 0, fontSize: "11.5px", letterSpacing: "0.06em", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          COMPARATIVA PEDAGÓGICA (NAIVE VS SENIOR)
        </h4>
        <div style={{ display: "flex", gap: "4px", background: "rgba(10, 13, 18, 0.7)", padding: "3px", borderRadius: "var(--radius-control)", border: "1px solid var(--border-line)" }}>
          <button
            type="button"
            onClick={() => setActiveTab("naive")}
            style={{
              padding: "4px 10px", fontSize: "11px", borderRadius: "6px", border: activeTab === "naive" ? "1px solid rgba(248, 113, 113, 0.35)" : "1px solid transparent", cursor: "pointer",
              background: activeTab === "naive" ? "rgba(248, 113, 113, 0.16)" : "transparent",
              color: activeTab === "naive" ? "var(--accent-red)" : "var(--text-muted)",
              fontWeight: activeTab === "naive" ? 700 : 500,
            }}
          >
            ⚠️ {naive?.label || "Enfoque Ingenuo"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("production")}
            style={{
              padding: "4px 10px", fontSize: "11px", borderRadius: "6px", border: activeTab === "production" ? "1px solid var(--border-accent)" : "1px solid transparent", cursor: "pointer",
              background: activeTab === "production" ? "rgba(94, 234, 212, 0.15)" : "transparent",
              color: activeTab === "production" ? "var(--accent-cyan)" : "var(--text-muted)",
              fontWeight: activeTab === "production" ? 700 : 500,
            }}
          >
            🛡️ {production?.label || "Patrón Senior"}
          </button>
        </div>
      </div>

      <CodeSnippet
        code={current?.code || ""}
        language={lesson.codeLang || "javascript"}
        label={current?.label || (activeTab === "naive" ? "Enfoque ingenuo" : "Patrón senior")}
      />

      {activeTab === "naive" && naive?.whyItFails && (
        <div style={{ padding: "12px 14px", background: "rgba(248, 113, 113, 0.06)", border: "1px solid rgba(248, 113, 113, 0.25)", borderLeft: "3px solid var(--accent-red)", borderRadius: "var(--radius-control)" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-red)", letterSpacing: "0.04em" }}>⚠️ CAUSA DE FALLO EN PRODUCCIÓN:</span>
          <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {naive.whyItFails}
          </p>
        </div>
      )}

      {activeTab === "production" && production?.tradeOff && (
        <div style={{ padding: "12px 14px", background: "rgba(94, 234, 212, 0.05)", border: "1px solid var(--border-accent)", borderLeft: "3px solid var(--accent-cyan)", borderRadius: "var(--radius-control)" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-cyan)", letterSpacing: "0.04em" }}>⚖️ TRADE-OFF ASUMIDO:</span>
          <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {production.tradeOff}
          </p>
        </div>
      )}
    </section>
  );
}
