import React, { useState } from "react";
import { CodeComparisonSection } from "./CodeComparisonSection.jsx";
import { MermaidChart } from "../common/MermaidChart.jsx";
import { useAudioNarrator } from "../../hooks/useAudioNarrator.js";
import { DeepDiveText } from "./DeepDiveText.jsx";
import { DeepDivePopover } from "./DeepDivePopover.jsx";
import { InterviewQuestionsSection } from "./InterviewQuestionsSection.jsx";
import { LessonSources } from "./LessonSources.jsx";

export function ReadStage({ node, graph, onNavigateNode, onGoToLearn, onGoToParaphrase }) {
  const lesson = node?.lesson || {};
  const { activeSectionId, playSection, stop } = useAudioNarrator();
  const [activeDeepDive, setActiveDeepDive] = useState(null);

  const relatedNodes = (node?.relatedIds || [])
    .map((id) => graph?.nodes?.find((n) => n.id === id))
    .filter(Boolean);

  const renderAudioBtn = (sectionId, text) => (
    <button
      type="button"
      onClick={() => playSection(sectionId, text)}
      title={activeSectionId === sectionId ? "Detener lectura" : "Escuchar esta sección"}
      style={{
        padding: "3px 9px", fontSize: "11px", borderRadius: "6px", display: "inline-flex", alignItems: "center", gap: "5px",
        background: activeSectionId === sectionId ? "var(--accent-cyan)" : "rgba(255, 255, 255, 0.04)",
        color: activeSectionId === sectionId ? "#080b13" : "var(--text-secondary)",
        border: "1px solid var(--border-line)", cursor: "pointer", fontWeight: 500,
      }}
    >
      <span>{activeSectionId === sectionId ? "⏹ Detener" : "🔊 Escuchar"}</span>
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", color: "var(--text-primary)" }}>
      {/* Resumen Editorial "EN UNA FRASE" */}
      <section
        style={{
          padding: "18px 22px",
          background: "linear-gradient(135deg, rgba(28, 38, 62, 0.45) 0%, rgba(15, 22, 36, 0.65) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderLeft: "3px solid var(--accent-cyan)",
          borderRadius: "var(--radius-panel)",
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-cyan)", letterSpacing: "0.08em", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span>📌</span> EN UNA FRASE
          </span>
          {renderAudioBtn("summary", `${lesson.summary}. Por qué importa: ${lesson.why}`)}
        </div>
        <p style={{ margin: "10px 0 12px", fontSize: "15px", fontWeight: 600, lineHeight: 1.55, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          {lesson.summary}
        </p>
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.07)", paddingTop: "10px", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          <strong style={{ color: "var(--accent-gold)" }}>Por qué importa: </strong>{lesson.why}
        </div>
      </section>

      {/* Explicación Clara */}
      {lesson.explanation && (
        <section style={{ padding: "0 4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h4 style={{ margin: 0, fontSize: "11px", letterSpacing: "0.07em", color: "var(--text-muted)", fontWeight: 700 }}>EXPLICACIÓN CLARA</h4>
            {renderAudioBtn("explanation", lesson.explanation)}
          </div>
          <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.65, color: "var(--text-secondary)", whiteSpace: "pre-line" }}>
            <DeepDiveText text={lesson.explanation} nodeId={node?.id} onOpenDeepDive={(id, pos) => setActiveDeepDive({ id, position: pos })} />
          </p>
        </section>
      )}

      {activeDeepDive && <DeepDivePopover diveId={activeDeepDive.id} position={activeDeepDive.position} onClose={() => setActiveDeepDive(null)} />}
      {lesson.mermaid && <section><h4 style={{ margin: "0 0 8px", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.06em", fontWeight: 700 }}>DIAGRAMA</h4><MermaidChart chart={lesson.mermaid} /></section>}
      <CodeComparisonSection lesson={lesson} />

      {/* Pasos y Trade-offs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
        {lesson.steps?.length > 0 && (
          <div style={{ padding: "16px", background: "rgba(18, 25, 40, 0.6)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line)", boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-cyan)", letterSpacing: "0.06em" }}>PASO A PASO</span>
            <ol style={{ margin: "10px 0 0", paddingLeft: "18px", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {lesson.steps.map((step, idx) => (<li key={idx} style={{ marginBottom: "6px" }}>{step}</li>))}
            </ol>
          </div>
        )}
        {lesson.pitfalls?.length > 0 && (
          <div style={{ padding: "16px", background: "rgba(18, 25, 40, 0.6)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line)", boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-red)", letterSpacing: "0.06em" }}>TRADE-OFFS Y RIESGOS</span>
            <ul style={{ margin: "10px 0 0", paddingLeft: "18px", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {lesson.pitfalls.map((pitfall, idx) => (<li key={idx} style={{ marginBottom: "6px" }}>{pitfall}</li>))}
            </ul>
          </div>
        )}
      </div>

      <InterviewQuestionsSection node={node} graph={graph} />
      <LessonSources sources={lesson.sources} relatedNodes={relatedNodes} onOpenRelated={onNavigateNode} />

      {/* Acciones al final */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "14px", borderTop: "1px solid var(--border-line)" }}>
        <button type="button" onClick={() => { stop(); onGoToLearn(); }} style={{ padding: "9px 16px", background: "rgba(255, 255, 255, 0.04)", border: "1px solid var(--border-line)", borderRadius: "var(--radius-control)", color: "var(--text-secondary)", fontSize: "12.5px", fontWeight: 500, cursor: "pointer" }}>
          Conversar con el tutor →
        </button>
        <button type="button" onClick={() => { stop(); onGoToParaphrase(); }} style={{ padding: "9px 18px", background: "linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-indigo) 100%)", border: "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "var(--radius-control)", color: "#ffffff", fontSize: "12.5px", fontWeight: 700, cursor: "pointer", boxShadow: "0 0 16px rgba(56, 189, 248, 0.25)" }}>
          03 Parafrasear con tus palabras →
        </button>
      </div>
    </div>
  );
}
