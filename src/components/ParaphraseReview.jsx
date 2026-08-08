import React, { useEffect, useRef, useState, useCallback } from "react";
import { evaluateParaphraseStream, isCancel } from "../ai/client.js";
import {
  getDraft,
  setDraft,
  deleteDraft,
  listAttempts,
  saveAttempt,
} from "../ai/learningStore.js";
import { hashCardContent } from "../ai/contentHash.js";
import { getCompletionView, getScoreView, isEvaluationSurfaceComplete } from "../ai/types.js";
import { EvaluationFeedback } from "./EvaluationFeedback.jsx";
import { AttemptHistory } from "./AttemptHistory.jsx";
import { ProgressLoader } from "./ProgressLoader.jsx";

const DEBOUNCE_MS = 400;

export function ParaphraseReview({ graphId, node, onEvaluationSaved, onNavigateBack, onNavigateNext, hasPrevious, hasNext }) {
  const contentHash = hashCardContent(node);

  const [draft, setDraftState] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [view, setView] = useState({ mode: "draft" }); // mode: 'draft' | 'attempt' | 'pending' | 'error'
  const [pending, setPending] = useState(null); // { controller, startedAt }
  const [streamingChars, setStreamingChars] = useState(0);
  const [streamingSections, setStreamingSections] = useState({});
  const [streamingBlocks, setStreamingBlocks] = useState({});
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);
  const draftRef = useRef("");
  const initialLoadRef = useRef(true);
  const pendingControllerRef = useRef(null);
  const activeRequestRef = useRef(null);
  const streamCharsRef = useRef(0);
  const streamFrameRef = useRef(null);
  const streamBlocksRef = useRef({});
  const streamBlockFrameRef = useRef(null);

  // Cargar borrador y attempts al cambiar de nodo.
  // Solo en la carga inicial de cada card decidimos el view y los datos;
  // después de eso, todo lo maneja el usuario (submit, edit, etc).
  // Si la resolución async de este effect cae DESPUÉS de un submit,
  // no debe pisar el state con la lista vieja.
  useEffect(() => {
    initialLoadRef.current = true;
    let cancelled = false;
    (async () => {
      const [text, list] = await Promise.all([getDraft(graphId, node.id), listAttempts(graphId, node.id)]);
      if (cancelled) return;
      if (!initialLoadRef.current) return; // hubo submit/edit mientras tanto
      initialLoadRef.current = false;
      draftRef.current = text;
      setDraftState(text);
      setAttempts(list);
      setView(list.length > 0 ? { mode: "attempt", index: list.length - 1 } : { mode: "draft" });
      setError(null);
      setPending(null);
    })();
    return () => {
      cancelled = true;
      activeRequestRef.current = null;
      pendingControllerRef.current?.abort();
    };
  }, [graphId, node.id]);

  useEffect(() => () => {
    if (streamFrameRef.current) cancelAnimationFrame(streamFrameRef.current);
    if (streamBlockFrameRef.current) cancelAnimationFrame(streamBlockFrameRef.current);
    pendingControllerRef.current?.abort();
  }, []);

  // Guardar borrador con debounce
  useEffect(() => {
    if (draft === draftRef.current) return;
    draftRef.current = draft;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDraft(graphId, node.id, draft);
    }, DEBOUNCE_MS);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [draft, graphId, node.id]);

  const submit = useCallback(async () => {
    const answer = draft.trim();
    if (!answer) return;
    if (pending) return;

    // Desactivar el effect de carga: si su async resuelve después de este submit,
    // no debe pisar nuestros setStates con la lista vieja.
    initialLoadRef.current = false;

    const controller = new AbortController();
    const requestId = Symbol("evaluation");
    activeRequestRef.current = requestId;
    pendingControllerRef.current = controller;
    const startedAt = Date.now();
    setPending({ controller, startedAt });
    streamCharsRef.current = 0;
    setStreamingChars(0);
    setStreamingSections({});
    streamBlocksRef.current = {};
    setStreamingBlocks({});
    setView({ mode: "pending" });
    setError(null);

    try {
      const result = await evaluateParaphraseStream({
        graphId,
        nodeId: node.id,
        answer,
        contentHash,
        node,
        signal: controller.signal,
        onProgress: (length) => {
          streamCharsRef.current = length;
          if (!streamFrameRef.current) {
            streamFrameRef.current = requestAnimationFrame(() => {
              streamFrameRef.current = null;
              setStreamingChars(streamCharsRef.current);
            });
          }
        },
        onSection: (field, value) => {
          setStreamingSections((prev) => ({ ...prev, [field]: value }));
        },
        onBlock: (block) => {
          streamBlocksRef.current = {
            ...streamBlocksRef.current,
            [block.id]: { ...streamBlocksRef.current[block.id], ...block },
          };
          if (!streamBlockFrameRef.current) {
            streamBlockFrameRef.current = requestAnimationFrame(() => {
              streamBlockFrameRef.current = null;
              setStreamingBlocks({ ...streamBlocksRef.current });
            });
          }
        },
      });
      if (activeRequestRef.current !== requestId) return;
      pendingControllerRef.current = null;
      const attempt = { ...result.attempt, answer };
      await saveAttempt(attempt);
      onEvaluationSaved?.(attempt);
      // Limpiar borrador después de un éxito
      await deleteDraft(graphId, node.id);
      draftRef.current = "";
      setDraftState("");
      const list = await listAttempts(graphId, node.id);
      setAttempts(list);
      setView({ mode: "attempt", index: Math.max(0, list.length - 1) });
      setPending(null);
    } catch (e) {
      if (activeRequestRef.current !== requestId) return;
      if (isCancel(e)) {
        activeRequestRef.current = null;
        pendingControllerRef.current = null;
        setPending(null);
        setStreamingChars(0);
        setStreamingSections({});
        setStreamingBlocks({});
        setView({ mode: "draft" });
        return;
      }
      activeRequestRef.current = null;
      pendingControllerRef.current = null;
      setPending(null);
      setStreamingChars(0);
      setStreamingSections({});
      setStreamingBlocks({});
      setView({ mode: "error" });
      setError({ code: e?.code ?? "upstream", message: e?.message ?? "Error desconocido" });
    }
  }, [draft, graphId, node, pending, contentHash, onEvaluationSaved]);

  const cancel = useCallback(() => {
    pending?.controller?.abort();
  }, [pending]);

  const selectAttempt = useCallback((index) => {
    setView({ mode: "attempt", index });
    setError(null);
  }, []);

  const backToDraft = useCallback(() => {
    setView({ mode: "draft" });
    setError(null);
  }, []);

  const startEdit = useCallback(async () => {
    const text = attempts[view.index]?.answer ?? "";
    draftRef.current = text;
    setDraftState(text);
    await setDraft(graphId, node.id, text);
    setView({ mode: "draft" });
  }, [attempts, view.index, graphId, node.id]);

  const charCount = draft.length;
  const tooShort = charCount > 0 && charCount < 80;
  const canSubmit = draft.trim().length > 0 && !pending;

  const currentAttempt = view.mode === "attempt" ? attempts[view.index] : null;
  const currentCompletion = currentAttempt ? getCompletionView(currentAttempt.evaluation) : null;

  return (
    <section className="paraphrase-review" aria-labelledby="paraphrase-review-title">
      <div className="paraphrase-review__head">
        <div>
          <span className="lesson-section-label">EXPLICÁ CON TUS PALABRAS</span>
          <h3 id="paraphrase-review-title">Escribí lo que entendiste y pedí una revisión</h3>
        </div>
      </div>
      <p className="paraphrase-review__intro">
        Incluí qué es, cuándo lo usarías, una consecuencia o trade-off y, si podés, un ejemplo. La IA no bloquea tu progreso: solo te devuelve una devolución con puntaje y puntos para mejorar.
      </p>

      {view.mode === "draft" && (
        <div className="paraphrase-review__editor">
          <textarea
            className="paraphrase-review__textarea"
            value={draft}
            onChange={(e) => setDraftState(e.target.value)}
            placeholder="Empezá a escribir…"
            rows={6}
            disabled={Boolean(pending)}
            aria-label="Tu explicación con tus palabras"
          />
          <div className="paraphrase-review__editor-footer">
            <span className={`paraphrase-review__count ${tooShort ? "is-warn" : ""}`}>
              {charCount} caracteres{tooShort ? " · un poco corta" : ""}
            </span>
            <div className="paraphrase-review__actions">
              {attempts.length > 0 && (
                <button type="button" className="quiz-secondary-button" onClick={() => setView({ mode: "attempt", index: attempts.length - 1 })}>
                  Ver último intento
                </button>
              )}
              <button type="button" className="quiz-primary-button" onClick={submit} disabled={!canSubmit}>
                {pending ? "Revisando…" : "Pedir revisión"}
              </button>
            </div>
          </div>
        </div>
      )}

      {view.mode === "pending" && pending && (
        <ProgressLoader
          startedAt={pending.startedAt}
          expectedMs={90_000}
          maxMs={300_000}
          streamingChars={streamingChars}
          streamingSections={streamingSections}
          streamingBlocks={streamingBlocks}
          onCancel={cancel}
        />
      )}

      {/* hidden: el texto crudo del stream se descarta al terminar */}

      {view.mode === "error" && error && (
        <div className="paraphrase-review__error" role="alert">
          <p><strong>No se pudo completar la revisión.</strong> {error.message}</p>
          <div className="paraphrase-review__actions">
            <button type="button" className="quiz-primary-button" onClick={submit}>Reintentar</button>
            <button type="button" className="quiz-secondary-button" onClick={backToDraft}>Volver al borrador</button>
          </div>
        </div>
      )}

      {view.mode === "attempt" && currentAttempt && (
        <div className="paraphrase-review__result">
          <AttemptHistory
            attempts={attempts}
            viewIndex={view.index}
            onSelect={selectAttempt}
            onBackToDraft={backToDraft}
          />
          <EvaluationFeedback
            evaluation={currentAttempt.evaluation}
            attemptNumber={view.index + 1}
            total={attempts.length}
            attemptContentHash={currentAttempt.contentHash}
            currentContentHash={contentHash}
            model={currentAttempt.model}
            routedVia={currentAttempt.routedVia}
          />
          <p className="paraphrase-review__answer-label">Tu explicación en este intento:</p>
          <blockquote className="paraphrase-review__answer">{currentAttempt.answer}</blockquote>
          <div className="paraphrase-review__result-actions">
            <button type="button" className="quiz-secondary-button" onClick={startEdit}>
              Editar y reintentar
            </button>
            {currentCompletion && (
              <span className={`paraphrase-review__completion ${currentCompletion.isComplete ? "is-complete" : ""}`}>
                {isEvaluationSurfaceComplete(currentAttempt.evaluation)
                  ? "✓ Nodo completo · cobertura conceptual 100%"
                  : `Cobertura conceptual ${currentCompletion.percent}% (${currentCompletion.score}/${currentCompletion.max} puntos) · último score global ${getScoreView(currentAttempt.evaluation).displayScore}/120 · podés seguir iterando`}
              </span>
            )}
            {onNavigateBack && hasPrevious && (
              <button type="button" className="quiz-secondary-button" onClick={onNavigateBack}>
                ← Volver a la card anterior
              </button>
            )}
            {onNavigateNext && hasNext && (
              <button type="button" className="quiz-next-button" onClick={onNavigateNext}>
                Siguiente card →
              </button>
            )}
          </div>
        </div>
      )}

      {view.mode === "attempt" && !currentAttempt && (
        <div className="paraphrase-review__error" role="status">
          <p>El intento se guardó pero no se puede mostrar. <button type="button" className="quiz-secondary-button" onClick={() => { setView({ mode: "attempt", index: Math.max(0, attempts.length - 1) }); }}>Reintentar carga</button></p>
        </div>
      )}
    </section>
  );
}
