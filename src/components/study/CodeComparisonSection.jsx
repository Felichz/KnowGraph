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
    <section style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ margin: 0, fontSize: "12px", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
          COMPARATIVA PEDAGÓGICA (NAIVE VS SENIOR)
        </h4>
        <div style={{ display: "flex", gap: "4px", background: "var(--bg-canvas)", padding: "2px", borderRadius: "4px" }}>
          <button
            type="button"
            onClick={() => setActiveTab("naive")}
            style={{
              padding: "3px 8px", fontSize: "11px", borderRadius: "4px", border: "none", cursor: "pointer",
              background: activeTab === "naive" ? "rgba(239, 118, 104, 0.2)" : "transparent",
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
              padding: "3px 8px", fontSize: "11px", borderRadius: "4px", border: "none", cursor: "pointer",
              background: activeTab === "production" ? "var(--bg-surface-emphasis)" : "transparent",
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
        <div style={{ padding: "10px 14px", background: "rgba(239, 118, 104, 0.08)", borderLeft: "3px solid var(--accent-red)", borderRadius: "var(--radius-control)" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-red)" }}>⚠️ CAUSA DE FALLO EN PRODUCCIÓN:</span>
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
            {naive.whyItFails}
          </p>
        </div>
      )}

      {activeTab === "production" && production?.tradeOff && (
        <div style={{ padding: "10px 14px", background: "rgba(112, 221, 212, 0.08)", borderLeft: "3px solid var(--accent-cyan)", borderRadius: "var(--radius-control)" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-cyan)" }}>⚖️ TRADE-OFF ASUMIDO:</span>
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
            {production.tradeOff}
          </p>
        </div>
      )}
    </section>
  );
}
