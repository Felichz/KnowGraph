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
  const { speaking, activeSectionId, playSection, stop } = useAudioNarrator();
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
        padding: "2px 8px", fontSize: "11px", borderRadius: "4px", display: "inline-flex", alignItems: "center", gap: "4px",
        background: activeSectionId === sectionId ? "var(--accent-cyan)" : "var(--bg-surface-raised)",
        color: activeSectionId === sectionId ? "var(--bg-workspace)" : "var(--text-secondary)",
      }}
    >
      <span>{activeSectionId === sectionId ? "⏹ Detener" : "🔊 Escuchar"}</span>
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", color: "var(--text-primary)" }}>
      {/* Resumen */}
      <section style={{ padding: "16px", background: "var(--bg-surface)", border: "1px solid var(--border-line)", borderRadius: "var(--radius-panel)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-cyan)", letterSpacing: "0.08em" }}>EN UNA FRASE</span>
          {renderAudioBtn("summary", `${lesson.summary}. Por qué importa: ${lesson.why}`)}
        </div>
        <p style={{ margin: "8px 0 12px", fontSize: "15px", fontWeight: 600, lineHeight: 1.5 }}>{lesson.summary}</p>
        <div style={{ borderTop: "1px solid var(--border-line)", paddingTop: "10px", fontSize: "13px", color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--accent-gold)" }}>Por qué importa: </strong>{lesson.why}
        </div>
      </section>

      {/* Explicación */}
      {lesson.explanation && (
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h4 style={{ margin: 0, fontSize: "12px", letterSpacing: "0.05em", color: "var(--text-muted)" }}>EXPLICACIÓN CLARA</h4>
            {renderAudioBtn("explanation", lesson.explanation)}
          </div>
          <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6, color: "var(--text-secondary)", whiteSpace: "pre-line" }}>
            <DeepDiveText text={lesson.explanation} nodeId={node?.id} onOpenDeepDive={(id, pos) => setActiveDeepDive({ id, position: pos })} />
          </p>
        </section>
      )}

      {activeDeepDive && <DeepDivePopover diveId={activeDeepDive.id} position={activeDeepDive.position} onClose={() => setActiveDeepDive(null)} />}
      {lesson.mermaid && <section><h4 style={{ margin: "0 0 8px", fontSize: "12px", color: "var(--text-muted)" }}>DIAGRAMA</h4><MermaidChart chart={lesson.mermaid} /></section>}
      <CodeComparisonSection lesson={lesson} />

      {/* Pasos y Trade-offs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
        {lesson.steps?.length > 0 && (
          <div style={{ padding: "14px", background: "var(--bg-surface)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-cyan)" }}>PASO A PASO</span>
            <ol style={{ margin: "8px 0 0", paddingLeft: "18px", fontSize: "13px", color: "var(--text-secondary)" }}>
              {lesson.steps.map((step, idx) => (<li key={idx} style={{ marginBottom: "6px" }}>{step}</li>))}
            </ol>
          </div>
        )}
        {lesson.pitfalls?.length > 0 && (
          <div style={{ padding: "14px", background: "var(--bg-surface)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-red)" }}>TRADE-OFFS Y RIESGOS</span>
            <ul style={{ margin: "8px 0 0", paddingLeft: "18px", fontSize: "13px", color: "var(--text-secondary)" }}>
              {lesson.pitfalls.map((pitfall, idx) => (<li key={idx} style={{ marginBottom: "6px" }}>{pitfall}</li>))}
            </ul>
          </div>
        )}
      </div>

      {/* Preguntas de entrevista FAANG */}
      <InterviewQuestionsSection node={node} graph={graph} />

      {/* Fuentes oficiales y recordatorios */}
      <LessonSources sources={lesson.sources} relatedNodes={relatedNodes} onOpenRelated={onNavigateNode} />

      {/* Acciones */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "12px", borderTop: "1px solid var(--border-line)" }}>
        <button type="button" onClick={() => { stop(); onGoToLearn(); }} style={{ padding: "8px 14px", background: "var(--bg-surface-raised)", borderRadius: "var(--radius-control)", color: "var(--text-secondary)", fontSize: "13px" }}>Conversar con el tutor →</button>
        <button type="button" onClick={() => { stop(); onGoToParaphrase(); }} style={{ padding: "8px 16px", background: "var(--bg-surface-emphasis)", border: "1px solid var(--accent-cyan)", borderRadius: "var(--radius-control)", color: "var(--accent-cyan)", fontSize: "13px", fontWeight: 600 }}>03 Parafrasear con tus palabras →</button>
      </div>
    </div>
  );
}
