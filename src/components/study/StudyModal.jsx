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
    <div className={zenMode ? "study-modal-backdrop zen" : "study-modal-backdrop"} style={{ position: "fixed", inset: 0, backgroundColor: zenMode ? "var(--bg-workspace)" : "rgba(4, 6, 10, 0.82)", backdropFilter: zenMode ? "none" : "blur(14px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: zenMode ? 0 : undefined }} onClick={onClose}>
      <div style={{ width: "100%", maxWidth: zenMode ? "100vw" : "940px", height: zenMode ? "100vh" : "auto", maxHeight: zenMode ? "100vh" : "90vh", background: "linear-gradient(180deg, #111520 0%, #0c0e15 100%)", border: zenMode ? "none" : "1px solid rgba(255, 255, 255, 0.12)", borderRadius: zenMode ? 0 : "16px", boxShadow: zenMode ? "none" : "var(--shadow-modal)", display: "flex", flexDirection: "column", overflow: "hidden" }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={node.label}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid var(--border-line)", background: "rgba(17, 21, 31, 0.8)", gap: "12px" }}>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-cyan)", letterSpacing: "0.08em" }}>MODAL DE ESTUDIO</span>
            <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.015em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{node.label}</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <button type="button" onClick={() => setZenMode((v) => !v)} title={zenMode ? "Salir de modo Zen" : "Modo Zen pantalla completa"} style={{ padding: "4px 10px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--border-line)", borderRadius: "6px", fontSize: "11px", color: "var(--text-secondary)", flexShrink: 0, whiteSpace: "nowrap" }}>
              {zenMode ? "Salir de Zen" : "🧘 Modo Zen"}
            </button>
            <button type="button" onClick={onClose} style={{ fontSize: "18px", color: "var(--text-muted)", padding: "2px 8px", borderRadius: "4px", flexShrink: 0 }} aria-label="Cerrar">✕</button>
          </div>
        </header>

        <ConceptMapNav node={node} graph={graph} historyStack={historyStack} onNavigateNode={onNavigateNode} onGoBack={onGoBack} />

        <nav style={{ display: "flex", borderBottom: "1px solid var(--border-line)", background: "rgba(10, 13, 19, 0.85)", overflowX: "auto" }}>
          {STAGES.map((tab) => {
            const active = stage === tab.id;
            return (
              <button key={tab.id} type="button" onClick={() => setStage(tab.id)} style={{ flex: 1, minWidth: "75px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "11px 14px", fontSize: "12px", fontWeight: active ? 700 : 500, color: active ? "var(--accent-cyan)" : "var(--text-secondary)", borderBottom: `2px solid ${active ? "var(--accent-cyan)" : "transparent"}`, background: active ? "rgba(94, 234, 212, 0.05)" : "transparent", whiteSpace: "nowrap", transition: "all var(--transition-fast)" }}>
                <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", opacity: active ? 1 : 0.6, color: active ? "var(--accent-cyan)" : "inherit" }}>{tab.num}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div ref={scrollContainerRef} style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {stage === "read" && <ReadStage node={node} graph={graph} onNavigateNode={onNavigateNode} onGoToLearn={() => setStage("learn")} onGoToParaphrase={() => setStage("paraphrase")} />}
          {stage === "learn" && (
            <LearnStage
              node={node}
              draft={draft}
              onUpdateDraft={updateDraft}
              onGoToParaphrase={() => setStage("paraphrase")}
            />
          )}
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
