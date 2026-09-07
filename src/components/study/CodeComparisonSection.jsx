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
        <div style={{ display: "flex", gap: "4px", background: "rgba(0, 0, 0, 0.4)", padding: "3px", borderRadius: "8px", border: "1px solid var(--border-line)" }}>
          <button
            type="button"
            onClick={() => setActiveTab("naive")}
            style={{
              padding: "5px 12px", fontSize: "11.5px", borderRadius: "6px", border: activeTab === "naive" ? "1px solid rgba(244, 63, 94, 0.4)" : "1px solid transparent", cursor: "pointer",
              background: activeTab === "naive" ? "rgba(244, 63, 94, 0.16)" : "transparent",
              color: activeTab === "naive" ? "var(--accent-red)" : "var(--text-secondary)",
              fontWeight: activeTab === "naive" ? 700 : 500,
            }}
          >
            ⚠️ {naive?.label || "Enfoque Ingenuo"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("production")}
            style={{
              padding: "5px 12px", fontSize: "11.5px", borderRadius: "6px", border: activeTab === "production" ? "1px solid rgba(56, 189, 248, 0.4)" : "1px solid transparent", cursor: "pointer",
              background: activeTab === "production" ? "rgba(56, 189, 248, 0.16)" : "transparent",
              color: activeTab === "production" ? "var(--accent-cyan)" : "var(--text-secondary)",
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
        <div style={{ padding: "14px 16px", background: "rgba(244, 63, 94, 0.06)", border: "1px solid rgba(244, 63, 94, 0.25)", borderLeft: "3px solid var(--accent-red)", borderRadius: "var(--radius-panel)", boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-red)", letterSpacing: "0.04em" }}>⚠️ CAUSA DE FALLO EN PRODUCCIÓN:</span>
          <p style={{ margin: "5px 0 0", fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: 1.55 }}>
            {naive.whyItFails}
          </p>
        </div>
      )}

      {activeTab === "production" && production?.tradeOff && (
        <div style={{ padding: "14px 16px", background: "rgba(56, 189, 248, 0.06)", border: "1px solid rgba(56, 189, 248, 0.25)", borderLeft: "3px solid var(--accent-cyan)", borderRadius: "var(--radius-panel)", boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-cyan)", letterSpacing: "0.04em" }}>⚖️ TRADE-OFF ASUMIDO:</span>
          <p style={{ margin: "5px 0 0", fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: 1.55 }}>
            {production.tradeOff}
          </p>
        </div>
      )}
    </section>
  );
}
