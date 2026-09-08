import React, { useState } from "react";
import { useAudioNarrator } from "../../../hooks/useAudioNarrator.js";
import { StudyStageReadExtras } from "./StudyStageReadExtras.jsx";

export function StudyStageRead({ node }) {
  const [codeTab, setCodeTab] = useState("senior");
  const { speaking, activeSectionId, playSection, stop } = useAudioNarrator();

  const lesson = node?.lesson || {};
  const summary = lesson.summary || "Concepto fundamental de ingeniería.";
  const why = lesson.why || "Arquitectura crítica para producción y concurrencia.";

  const naive = lesson.codeComparison?.naive || {
    label: "Enfoque ingenuo",
    code: lesson.code || "// Enfoque inicial sin optimización concurrente",
    whyItFails: "Bloquea el hilo principal bajo alta carga y satura la cola de eventos.",
  };

  const senior = lesson.codeComparison?.production || {
    label: "Patrón Senior",
    code: lesson.code || "// Patrón idiomático de producción",
    tradeOff: "Mayor costo de memoria o abstracción a cambio de resiliencia y predictibilidad.",
  };

  const isAudioActive = speaking && activeSectionId === "summary";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Summary Section */}
      <section style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h4 style={{ margin: 0, fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", color: "var(--text-muted)", textTransform: "uppercase" }}>
            EN UNA FRASE
          </h4>
          <button
            onClick={() => (isAudioActive ? stop() : playSection("summary", summary))}
            style={{
              display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 8px", borderRadius: "4px",
              fontSize: "11px", background: isAudioActive ? "rgba(244, 63, 94, 0.15)" : "rgba(255, 255, 255, 0.06)",
              color: isAudioActive ? "var(--accent-red)" : "var(--color-brand-primary, #5EEAD4)", border: "1px solid var(--border-line)", cursor: "pointer",
            }}
          >
            {isAudioActive ? "⏹ Detener" : "🔊 Escuchar"}
          </button>
        </div>
        <p style={{ margin: 0, fontSize: "15px", lineHeight: 1.55, color: "var(--text-primary)", background: isAudioActive ? "rgba(94, 234, 212, 0.08)" : "transparent", padding: isAudioActive ? "4px 8px" : 0, borderRadius: "4px" }}>
          {summary}
        </p>
      </section>

      {/* Rationale Section */}
      <section style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <h4 style={{ margin: 0, fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", color: "var(--text-muted)", textTransform: "uppercase" }}>
          Por qué importa:
        </h4>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.5, color: "var(--text-secondary)" }}>
          {why}
        </p>
      </section>

      {/* Code Comparison Section */}
      <section style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <h4 style={{ margin: 0, fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", color: "var(--text-muted)", textTransform: "uppercase" }}>
            COMPARATIVA PEDAGÓGICA (NAIVE VS SENIOR)
          </h4>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: "6px", padding: "2px", border: "1px solid var(--border-line-subtle)" }}>
            <button
              onClick={() => setCodeTab("naive")}
              style={{
                padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: 600,
                background: codeTab === "naive" ? "rgba(248, 113, 113, 0.2)" : "transparent",
                color: codeTab === "naive" ? "#F87171" : "var(--text-muted)",
              }}
            >
              Enfoque ingenuo
            </button>
            <button
              onClick={() => setCodeTab("senior")}
              style={{
                padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: 600,
                background: codeTab === "senior" ? "rgba(94, 234, 212, 0.2)" : "transparent",
                color: codeTab === "senior" ? "var(--color-brand-primary, #5EEAD4)" : "var(--text-muted)",
              }}
            >
              Patrón Senior
            </button>
          </div>
        </div>

        <pre style={{ margin: 0, padding: "14px", borderRadius: "8px", background: "rgba(13, 17, 24, 0.95)", border: "1px solid var(--border-line-subtle)", fontFamily: "var(--font-mono)", fontSize: "13px", lineHeight: 1.5, color: "#E2E8F0", overflowX: "auto" }}>
          <code>{codeTab === "naive" ? naive.code : senior.code}</code>
        </pre>

        {codeTab === "naive" ? (
          <div style={{ padding: "10px 14px", borderRadius: "6px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#F87171", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "2px" }}>
              CAUSA DE FALLO EN PRODUCCIÓN
            </span>
            <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>{naive.whyItFails}</span>
          </div>
        ) : (
          <div style={{ padding: "10px 14px", borderRadius: "6px", background: "rgba(94, 234, 212, 0.08)", border: "1px solid rgba(94, 234, 212, 0.2)" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--color-brand-primary, #5EEAD4)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "2px" }}>
              TRADE-OFF ASUMIDO
            </span>
            <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>{senior.tradeOff}</span>
          </div>
        )}
      </section>

      <StudyStageReadExtras node={node} />
    </div>
  );
}
