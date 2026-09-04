import React, { useEffect, useRef, useState } from "react";
import { useStudySession } from "../../hooks/useStudySession.js";
import { evaluateParaphraseStream, isCancel } from "../../ai/client.js";
import { hashAnswer, hashCardContent } from "../../ai/contentHash.js";
import { ReadStage } from "./ReadStage.jsx";
import { LearnStage } from "./LearnStage.jsx";
import { ParaphraseStage } from "./ParaphraseStage.jsx";
import { EvaluateStage } from "./EvaluateStage.jsx";
import { ConceptMapNav } from "./ConceptMapNav.jsx";

const STAGES = [
  { id: "read", num: "01", label: "Leer" },
  { id: "learn", num: "02", label: "Aprender" },
  { id: "paraphrase", num: "03", label: "Parafrasear" },
  { id: "evaluate", num: "04", label: "Evaluar" },
];

export function StudyModal({
  node,
  graph,
  graphId,
  open = false,
  historyStack = [],
  onNavigateNode,
  onGoBack,
  onClose,
}) {
  const { stage, setStage, draft, updateDraft, attempts, latestAttempt, recordAttempt } = useStudySession(graphId, node);
  const [evaluating, setEvaluating] = useState(false);
  const [evalStartedAt, setEvalStartedAt] = useState(null);
  const [evalChars, setEvalChars] = useState(0);
  const [currentEval, setCurrentEval] = useState(null);
  const [zenMode, setZenMode] = useState(false);
  const scrollContainerRef = useRef(null);
  const evalAbortRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
  }, [stage, node?.id]);

  if (!open || !node) return null;

  const handleEvaluate = async () => {
    if (!draft.trim() || evaluating) return;
    setEvaluating(true);
    setEvalStartedAt(Date.now());
    setEvalChars(0);
    setStage("evaluate");

    const controller = new AbortController();
    evalAbortRef.current = controller;

    try {
      const result = await evaluateParaphraseStream({
        node,
        learnerAnswer: draft,
        contentHash: hashCardContent(node.lesson),
        signal: controller.signal,
        onDelta: (_delta, chars) => setEvalChars(chars),
      });
      await recordAttempt({
        id: `attempt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        graphId,
        nodeId: node.id,
        createdAt: new Date().toISOString(),
        score: result.score || result.displayScore || 0,
        evaluation: result,
        answerHash: hashAnswer(draft),
      });
      setCurrentEval(result);
    } catch (err) {
      if (!isCancel(err)) {
        console.error("Error al evaluar:", err);
        alert("Error al evaluar con IA: " + (err.message || "Problema de red"));
      }
    } finally {
      setEvaluating(false);
      evalAbortRef.current = null;
    }
  };

  const handleCancelEval = () => {
    evalAbortRef.current?.abort();
    setEvaluating(false);
  };

  const activeEvaluation = currentEval || latestAttempt?.evaluation || null;

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: zenMode ? "var(--bg-workspace)" : "rgba(9, 11, 15, 0.8)", backdropFilter: zenMode ? "none" : "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: zenMode ? 0 : "20px" }} onClick={onClose}>
      <div style={{ width: "100%", maxWidth: zenMode ? "100vw" : "900px", height: zenMode ? "100vh" : "auto", maxHeight: zenMode ? "100vh" : "90vh", background: "var(--bg-workspace)", border: zenMode ? "none" : "1px solid var(--border-line-strong)", borderRadius: zenMode ? 0 : "var(--radius-panel)", display: "flex", flexDirection: "column", overflow: "hidden" }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={node.label}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid var(--border-line)", background: "var(--bg-surface)" }}>
          <div>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-cyan)", letterSpacing: "0.08em" }}>MODAL DE ESTUDIO</span>
            <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "var(--text-primary)" }}>{node.label}</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button type="button" onClick={() => setZenMode((v) => !v)} title={zenMode ? "Salir de modo Zen" : "Modo Zen pantalla completa"} style={{ padding: "4px 8px", background: "var(--bg-surface-raised)", border: "1px solid var(--border-line)", borderRadius: "4px", fontSize: "11px", color: "var(--text-secondary)" }}>
              {zenMode ? "Salir de Zen" : "🧘 Modo Zen"}
            </button>
            <button type="button" onClick={onClose} style={{ fontSize: "20px", color: "var(--text-muted)", padding: "2px 8px" }} aria-label="Cerrar">×</button>
          </div>
        </header>

        <ConceptMapNav node={node} graph={graph} historyStack={historyStack} onNavigateNode={onNavigateNode} onGoBack={onGoBack} />

        <nav style={{ display: "flex", borderBottom: "1px solid var(--border-line)", background: "var(--bg-surface-raised)" }}>
          {STAGES.map((tab) => {
            const active = stage === tab.id;
            return (
              <button key={tab.id} type="button" onClick={() => setStage(tab.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px 14px", fontSize: "12px", fontWeight: active ? 700 : 500, color: active ? "var(--accent-cyan)" : "var(--text-secondary)", borderBottom: `2px solid ${active ? "var(--accent-cyan)" : "transparent"}`, background: active ? "var(--bg-workspace)" : "transparent" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", opacity: 0.7 }}>{tab.num}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div ref={scrollContainerRef} style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {stage === "read" && <ReadStage node={node} graph={graph} onNavigateNode={onNavigateNode} onGoToLearn={() => setStage("learn")} onGoToParaphrase={() => setStage("paraphrase")} />}
          {stage === "learn" && <LearnStage node={node} onGoToParaphrase={() => setStage("paraphrase")} />}
          {stage === "paraphrase" && <ParaphraseStage draft={draft} onUpdateDraft={updateDraft} onEvaluate={handleEvaluate} isEvaluating={evaluating} node={node} />}
          {stage === "evaluate" && (
            <EvaluateStage
              evaluation={activeEvaluation} attempts={attempts} isEvaluating={evaluating}
              evalStartedAt={evalStartedAt} streamingChars={evalChars} onCancel={handleCancelEval}
              onRetry={() => setStage("paraphrase")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
