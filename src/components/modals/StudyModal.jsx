import React, { useEffect, useRef, useState } from "react";
import { useStudySession } from "../../hooks/useStudySession.js";
import { StudyStageRead } from "./study/StudyStageRead.jsx";
import { StudyStageLearn } from "./study/StudyStageLearn.jsx";
import { StudyStageParaphrase } from "./study/StudyStageParaphrase.jsx";
import { StudyStageEvaluate } from "./study/StudyStageEvaluate.jsx";

export function StudyModal({
  graphId = "react", graph, nodeId, onClose, onNavigateNode,
  activeEvaluation = null, onStartEvaluation, onCancelEvaluation,
}) {
  const [isZenMode, setIsZenMode] = useState(false);
  const [historyStack, setHistoryStack] = useState([]);
  const contentRef = useRef(null);

  const node = graph?.nodeById?.get(nodeId) || graph?.nodes?.find((n) => n.id === nodeId);
  const { stage, setStage, draft, updateDraft, attempts } = useStudySession(graphId, node);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [stage]);

  if (!node) return null;

  const previousNodeId = historyStack[historyStack.length - 1] ?? null;
  const previousNode = previousNodeId ? graph?.nodeById?.get(previousNodeId) : null;

  const handleJumpToNode = (targetId) => {
    setHistoryStack((prev) => [...prev, nodeId]);
    onNavigateNode?.(targetId);
  };

  const handleBackToPrevious = () => {
    const nextStack = [...historyStack];
    const prevId = nextStack.pop();
    setHistoryStack(nextStack);
    if (prevId) onNavigateNode?.(prevId);
  };

  const tabs = [
    { id: "read", label: "01 Leer" },
    { id: "learn", label: "02 Aprender" },
    { id: "paraphrase", label: "03 Parafrasear" },
    { id: "evaluate", label: "04 Evaluar" },
  ];

  return (
    <div role="dialog" aria-modal="true" style={{
      position: "fixed", inset: 0, zIndex: 50, background: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: isZenMode ? 0 : "20px",
    }}>
      <div style={{
        width: isZenMode ? "100vw" : "100%", maxWidth: isZenMode ? "100vw" : "940px",
        height: isZenMode ? "100vh" : "88vh", background: "var(--color-surface-overlay, #1E2532)",
        borderRadius: isZenMode ? 0 : "14px", border: isZenMode ? "none" : "1px solid var(--border-line)",
        display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
      }}>
        {/* Header */}
        <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border-line)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase" }}>MODAL DE ESTUDIO</span>
            <span style={{ color: "var(--border-line)" }}>•</span>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>{node.label}</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button onClick={() => setIsZenMode((p) => !p)} style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "12px", background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>
              {isZenMode ? "✕ Salir de Zen" : "⛶ Modo Zen"}
            </button>
            <button onClick={onClose} aria-label="Cerrar" style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "14px", background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}>
              Cerrar ×
            </button>
          </div>
        </div>

        {/* Conceptual Navigation */}
        <nav aria-label="Flujo conceptual y mapa" style={{ padding: "6px 20px", background: "rgba(0,0,0,0.25)", borderBottom: "1px solid var(--border-line-subtle)", display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", flexShrink: 0 }}>
          {previousNode && (
            <button onClick={handleBackToPrevious} style={{ color: "var(--color-brand-primary, #5EEAD4)", textDecoration: "underline", marginRight: "6px" }}>
              ← Volver a {previousNode.label}
            </button>
          )}
          <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>ANTES:</span>
          {(node.prerequisites || []).map((id) => (
            <button key={id} onClick={() => handleJumpToNode(id)} style={{ color: "var(--text-secondary)", textDecoration: "underline" }}>
              {graph?.nodeById?.get(id)?.label || id}
            </button>
          ))}
          <span style={{ color: "var(--text-muted)", fontWeight: 600, marginLeft: "8px" }}>DESPUÉS:</span>
          {(graph?.edges || []).filter(([src]) => src === node.id).map(([, tgt]) => (
            <button key={tgt} onClick={() => handleJumpToNode(tgt)} style={{ color: "var(--text-secondary)", textDecoration: "underline" }}>
              {graph?.nodeById?.get(tgt)?.label || tgt}
            </button>
          ))}
        </nav>

        {/* Tabs Bar */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border-line)", background: "rgba(0,0,0,0.15)", flexShrink: 0 }}>
          {tabs.map((tab) => {
            const active = stage === tab.id;
            return (
              <button
                key={tab.id} onClick={() => setStage(tab.id)}
                style={{ flex: 1, padding: "10px 0", fontSize: "13px", fontWeight: active ? 700 : 500, color: active ? "var(--color-brand-primary, #5EEAD4)" : "var(--text-muted)", borderBottom: active ? "2px solid var(--color-brand-primary, #5EEAD4)" : "2px solid transparent", background: active ? "rgba(94, 234, 212, 0.04)" : "transparent" }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Stage Content */}
        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: isZenMode ? "32px 15% 60px 15%" : "20px 24px 40px 24px" }}>
          {stage === "read" && <StudyStageRead node={node} />}
          {stage === "learn" && <StudyStageLearn node={node} onIntegrateIntoDraft={(text) => { updateDraft(draft ? `${draft}\n\n${text}` : text); setStage("paraphrase"); }} />}
          {stage === "paraphrase" && <StudyStageParaphrase node={node} draft={draft} onChangeDraft={updateDraft} onEvaluate={() => { onStartEvaluation?.(node, draft); setStage("evaluate"); }} />}
          {stage === "evaluate" && <StudyStageEvaluate attempts={attempts} activeEvaluation={activeEvaluation} onCancelEvaluation={onCancelEvaluation} />}
        </div>
      </div>
    </div>
  );
}
