import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { evaluateParaphraseStream, isCancel, liveReviewStream } from "../ai/client.js";
import {
  getDraft,
  getLiveReview,
  setDraft,
  listAttempts,
  saveAttempt,
  saveLiveReview,
} from "../ai/learningStore.js";
import { hashAnswer, hashCardContent } from "../ai/contentHash.js";
import { buildLiveReviewState } from "../ai/liveReview.js";
import { getCompletionView, getScoreView, isEvaluationSurfaceComplete } from "../ai/types.js";
import { EvaluationFeedback } from "./EvaluationFeedback.jsx";
import { AttemptHistory } from "./AttemptHistory.jsx";
import { LiveReviewPanel } from "./LiveReviewPanel.jsx";
import { ProgressLoader } from "./ProgressLoader.jsx";

const LIVE_DEBOUNCE_MS = 5_000;

export function ParaphraseReview({ graphId, node, viewMode = "all", onRequestCoach, onEvaluationSaved, onNavigateBack, onNavigateNext, hasPrevious, hasNext }) {
  const contentHash = hashCardContent(node);

  const [draft, setDraftState] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [view, setView] = useState({ mode: "draft" });
  const [pending, setPending] = useState(null);
  const [liveStatus, setLiveStatus] = useState("idle");
  const [liveReview, setLiveReview] = useState(null);
  const [liveError, setLiveError] = useState(null);
  const [lastCheckpoint, setLastCheckpoint] = useState(null);
  const [debounceStartedAt, setDebounceStartedAt] = useState(null);
  const [debounceNow, setDebounceNow] = useState(0);
  const [streamingChars, setStreamingChars] = useState(0);
  const [streamingSections, setStreamingSections] = useState({});
  const [streamingBlocks, setStreamingBlocks] = useState({});
  const [error, setError] = useState(null);

  const textareaRef = useRef(null);
  const draftRef = useRef("");
  const initialLoadRef = useRef(true);
  const skipNextLiveEffectRef = useRef(false);
  const liveControllerRef = useRef(null);
  const liveRequestRef = useRef(null);
  const pendingControllerRef = useRef(null);
  const activeRequestRef = useRef(null);
  const draftSaveRef = useRef(null);
  const liveDebounceRef = useRef(null);
  const streamCharsRef = useRef(0);
  const streamFrameRef = useRef(null);
  const streamBlocksRef = useRef({});
  const streamBlockFrameRef = useRef(null);

  useEffect(() => {
    initialLoadRef.current = true;
    let cancelled = false;
    (async () => {
      const [storedDraft, list, storedLiveReview] = await Promise.all([
        getDraft(graphId, node.id),
        listAttempts(graphId, node.id),
        getLiveReview(graphId, node.id),
      ]);
      if (cancelled || !initialLoadRef.current) return;
      initialLoadRef.current = false;
      const initialText = storedDraft || list.at(-1)?.answer || "";
      const initialAnswerHash = hashAnswer(initialText.trim());
      const reusableLiveReview = storedLiveReview
        && storedLiveReview.answerHash === initialAnswerHash
        && storedLiveReview.contentHash === contentHash
        ? storedLiveReview.review
        : null;
      skipNextLiveEffectRef.current = true;
      draftRef.current = initialText;
      setDraftState(initialText);
      setAttempts(list);
      setLastCheckpoint(list.at(-1) ?? null);
      setView({ mode: "draft" });
      setLiveStatus(reusableLiveReview ? "ready" : "idle");
      setLiveReview(reusableLiveReview);
      setLiveError(null);
      setError(null);
      setPending(null);
    })();
    return () => {
      cancelled = true;
      liveRequestRef.current = null;
      activeRequestRef.current = null;
      liveControllerRef.current?.abort();
      pendingControllerRef.current?.abort();
    };
  }, [contentHash, graphId, node.id]);

  useEffect(() => () => {
    if (draftSaveRef.current) clearTimeout(draftSaveRef.current);
    if (liveDebounceRef.current) clearTimeout(liveDebounceRef.current);
    if (streamFrameRef.current) cancelAnimationFrame(streamFrameRef.current);
    if (streamBlockFrameRef.current) cancelAnimationFrame(streamBlockFrameRef.current);
    liveControllerRef.current?.abort();
    pendingControllerRef.current?.abort();
  }, []);

  useEffect(() => {
    if (draft === draftRef.current) return undefined;
    draftRef.current = draft;
    if (draftSaveRef.current) clearTimeout(draftSaveRef.current);
    draftSaveRef.current = setTimeout(() => {
      setDraft(graphId, node.id, draft);
    }, 400);
    return undefined;
  }, [draft, graphId, node.id]);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const scroller = textarea.closest(".lesson-content");
    const scrollTop = scroller?.scrollTop;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    if (scroller && Number.isFinite(scrollTop)) scroller.scrollTop = scrollTop;
  }, [draft]);

  const handleDraftChange = useCallback((event) => {
    const scroller = event.currentTarget.closest(".lesson-content");
    const scrollTop = scroller?.scrollTop;
    setDraftState(event.target.value);
    if (scroller && Number.isFinite(scrollTop)) {
      requestAnimationFrame(() => {
        scroller.scrollTop = scrollTop;
      });
    }
  }, []);

  const startLiveReview = useCallback(async (answer) => {
    const trimmed = answer.trim();
    if (!trimmed || trimmed.length < 20) {
      liveControllerRef.current?.abort();
      setLiveStatus("idle");
      setLiveReview(null);
      return;
    }

    liveControllerRef.current?.abort();
    const controller = new AbortController();
    const requestId = Symbol("live-review");
    liveControllerRef.current = controller;
    liveRequestRef.current = requestId;
    setLiveStatus("running");
    setLiveError(null);

    try {
      const result = await liveReviewStream({
        graphId,
        nodeId: node.id,
        answer: trimmed,
        contentHash,
        node,
        signal: controller.signal,
        onSection: (field, value) => {
          if (liveRequestRef.current !== requestId) return;
          if (field === "points") {
            setLiveReview((previous) => buildLiveReviewState(value, previous?.hint ?? null));
          } else if (field === "hint") {
            setLiveReview((previous) => previous ? { ...previous, hint: value, nextGapId: value?.kind === "gap" ? value.id : null } : previous);
          }
        },
        onProgress: () => {},
      });
      if (liveRequestRef.current !== requestId) return;
      liveControllerRef.current = null;
      setLiveReview(result.review);
      setLiveStatus("ready");
      try {
        await saveLiveReview({
          graphId,
          nodeId: node.id,
          answerHash: hashAnswer(trimmed),
          contentHash,
          review: result.review,
        });
      } catch {
        // La caché local es útil, pero no debe convertir una revisión válida en error.
      }
    } catch (e) {
      if (liveRequestRef.current !== requestId || isCancel(e)) return;
      liveControllerRef.current = null;
      setLiveStatus("error");
      setLiveError(e?.message ?? "No se pudo actualizar la revisión viva.");
    }
  }, [contentHash, graphId, node, node.id]);

  useEffect(() => {
    if (initialLoadRef.current) return undefined;
    if (skipNextLiveEffectRef.current) {
      skipNextLiveEffectRef.current = false;
      return undefined;
    }
    if (liveDebounceRef.current) clearTimeout(liveDebounceRef.current);
    liveControllerRef.current?.abort();
    liveRequestRef.current = null;
    if (!draft.trim()) {
      setDebounceStartedAt(null);
      setLiveStatus("idle");
      setLiveReview(null);
      return undefined;
    }
    setLiveStatus("waiting");
    // Mientras editás solo se actualiza el coaching liviano; el checkpoint completo es manual.
    const currentAnswerKey = hashAnswer(draft.trim());
    if (pendingControllerRef.current && pending?.answerKey !== currentAnswerKey) {
      pendingControllerRef.current.abort();
    }
    const startedAt = Date.now();
    setDebounceStartedAt(startedAt);
    setDebounceNow(startedAt);
    const clock = setInterval(() => setDebounceNow(Date.now()), 50);
    liveDebounceRef.current = setTimeout(() => {
      setDebounceStartedAt(null);
      clearInterval(clock);
      startLiveReview(draft);
    }, LIVE_DEBOUNCE_MS);
    return () => {
      if (liveDebounceRef.current) clearTimeout(liveDebounceRef.current);
      clearInterval(clock);
    };
  }, [draft, pending, startLiveReview]);

  const submitFullEvaluation = useCallback(async (answerOverride = draft, source = "manual") => {
    const answer = answerOverride.trim();
    if (!answer || pendingControllerRef.current) return;
    initialLoadRef.current = false;

    const controller = new AbortController();
    const requestId = Symbol("full-evaluation");
    const answerKey = hashAnswer(answer);
    activeRequestRef.current = requestId;
    pendingControllerRef.current = controller;
    const startedAt = Date.now();
    setPending({ controller, startedAt, answerKey, source });
    streamCharsRef.current = 0;
    setStreamingChars(0);
    setStreamingSections({});
    streamBlocksRef.current = {};
    setStreamingBlocks({});
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
          if (activeRequestRef.current !== requestId) return;
          streamCharsRef.current = length;
          if (!streamFrameRef.current) {
            streamFrameRef.current = requestAnimationFrame(() => {
              streamFrameRef.current = null;
              setStreamingChars(streamCharsRef.current);
            });
          }
        },
        onSection: (field, value) => {
          if (activeRequestRef.current !== requestId) return;
          setStreamingSections((previous) => ({ ...previous, [field]: value }));
        },
        onBlock: (block) => {
          if (activeRequestRef.current !== requestId) return;
          streamBlocksRef.current = { ...streamBlocksRef.current, [block.id]: { ...streamBlocksRef.current[block.id], ...block } };
          if (!streamBlockFrameRef.current) {
            streamBlockFrameRef.current = requestAnimationFrame(() => {
              streamBlockFrameRef.current = null;
              setStreamingBlocks({ ...streamBlocksRef.current });
            });
          }
        },
      });
      if (activeRequestRef.current !== requestId) return;
      const durationMs = Date.now() - startedAt;
      const attempt = { ...result.attempt, answer, durationMs };
      await saveAttempt(attempt);
      onEvaluationSaved?.(attempt);
      const list = await listAttempts(graphId, node.id);
      setAttempts(list);
      setLastCheckpoint(attempt);
      setPending(null);
      pendingControllerRef.current = null;
      activeRequestRef.current = null;
    } catch (e) {
      if (activeRequestRef.current !== requestId) return;
      pendingControllerRef.current = null;
      activeRequestRef.current = null;
      setPending(null);
      if (isCancel(e)) return;
      setError({ code: e?.code ?? "upstream", message: e?.message ?? "Error desconocido" });
    }
  }, [contentHash, draft, graphId, node, onEvaluationSaved]);

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
    onRequestCoach?.();
  }, [onRequestCoach]);

  const startEdit = useCallback(async () => {
    const text = attempts[view.index]?.answer ?? "";
    draftRef.current = text;
    setDraftState(text);
    await setDraft(graphId, node.id, text);
    setView({ mode: "draft" });
    onRequestCoach?.();
  }, [attempts, view.index, graphId, node.id, onRequestCoach]);

  const charCount = draft.length;
  const tooShort = charCount > 0 && charCount < 80;
  const canonicalAttempt = view.mode === "attempt" ? attempts[view.index] : attempts.at(-1) ?? null;
  const canonicalCompletion = canonicalAttempt ? getCompletionView(canonicalAttempt.evaluation) : null;
  const debounceProgress = debounceStartedAt
    ? Math.max(0, Math.min(1, (debounceNow - debounceStartedAt) / LIVE_DEBOUNCE_MS))
    : 0;

  if (viewMode === "hidden") return null;

  return (
    <section className="paraphrase-review" aria-labelledby="paraphrase-review-title">
      {viewMode !== "evaluate" && <>
      <div className="paraphrase-review__head">
        <div>
          <span className="lesson-section-label">EXPLICÁ CON TUS PALABRAS</span>
          <h3 id="paraphrase-review-title">Escribí y recibí coaching mientras avanzás</h3>
        </div>
        <span className="paraphrase-review__auto-badge">SIN ENVIAR · REVISIÓN AUTOMÁTICA</span>
      </div>
      <p className="paraphrase-review__intro">
        Escribí como si respondieras en una entrevista. La app identifica qué ideas esenciales ya cubriste y mantiene visible el próximo gap mientras editás.
      </p>

      <div className="mastery-workspace">
          <LiveReviewPanel
            status={liveStatus}
            review={liveReview}
            error={liveError}
            isFinalizing={Boolean(pending)}
            lastCheckpoint={lastCheckpoint ? getScoreView(lastCheckpoint.evaluation)?.displayScore : null}
          />
          <div className="mastery-workspace__editor">
            <div className="paraphrase-review__editor">
              <textarea
                ref={textareaRef}
                className="paraphrase-review__textarea"
                value={draft}
                onChange={handleDraftChange}
                placeholder="Explicá qué es, cómo funciona, por qué importa y qué trade-offs tiene..."
                rows={9}
                aria-label="Tu explicación con tus palabras"
              />
              <div className="paraphrase-review__editor-bottom-dock">
                {liveReview?.hint && (
                  <div className={`paraphrase-review__sticky-hint ${["waiting", "running"].includes(liveStatus) ? "is-stale" : ""}`}>
                    <span>{liveReview.hint.kind === "gap" ? "AHORA" : "PARA PROFUNDIZAR"}</span>
                    {liveReview.hint.text}
                  </div>
                )}
                <div className="paraphrase-review__editor-footer">
                  <div className="paraphrase-review__editor-meta">
                    {debounceStartedAt && <DebounceRing progress={debounceProgress} />}
                    {liveStatus === "running" && <LiveRequestIndicator />}
                    <span className={`paraphrase-review__count ${tooShort ? "is-warn" : ""}`}>
                      {charCount} caracteres{tooShort ? " · un poco corta" : ""}
                    </span>
                  </div>
                  <div className="paraphrase-review__actions">
                    <button type="button" className="quiz-secondary-button" onClick={() => submitFullEvaluation(draft, "manual")} disabled={!draft.trim() || Boolean(pending)}>
                      {pending ? "Confirmando..." : "Forzar checkpoint completo"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {pending && (
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
            {error && (
              <div className="paraphrase-review__error" role="alert">
                <p><strong>No se pudo completar el checkpoint.</strong> {error.message}</p>
                <button type="button" className="quiz-primary-button" onClick={() => submitFullEvaluation(draft, "manual")}>Reintentar</button>
              </div>
            )}
          </div>
      </div>
      </>}

      {viewMode !== "coach" && <section className="canonical-review" aria-labelledby="canonical-review-title">
        <header className="canonical-review__header">
          <div>
            <span className="lesson-section-label">EVALUACIÓN COMPLETA</span>
            <h3 id="canonical-review-title">Score canónico y feedback profundo</h3>
          </div>
          <span className="canonical-review__badge">CHECKPOINT</span>
        </header>
        {canonicalAttempt ? (
          <div className="paraphrase-review__result">
          <AttemptHistory attempts={attempts} viewIndex={view.mode === "attempt" ? view.index : attempts.length - 1} onSelect={selectAttempt} onBackToDraft={backToDraft} />
          <EvaluationFeedback
            evaluation={canonicalAttempt.evaluation}
            attemptNumber={attempts.indexOf(canonicalAttempt) + 1}
            total={attempts.length}
            attemptContentHash={canonicalAttempt.contentHash}
            currentContentHash={contentHash}
            model={canonicalAttempt.model}
            routedVia={canonicalAttempt.routedVia}
            durationMs={canonicalAttempt.durationMs}
          />
          <p className="paraphrase-review__answer-label">Tu explicación en este intento:</p>
          <blockquote className="paraphrase-review__answer">{canonicalAttempt.answer}</blockquote>
          <div className="paraphrase-review__result-actions">
            <button type="button" className="quiz-primary-button" onClick={startEdit}>Volver al coaching</button>
            {canonicalCompletion && (
              <span className={`paraphrase-review__completion ${canonicalCompletion.isComplete ? "is-complete" : ""}`}>
                {isEvaluationSurfaceComplete(canonicalAttempt.evaluation)
                  ? "✓ Nodo completo · cobertura conceptual 100%"
                  : `Cobertura conceptual ${canonicalCompletion.percent}% (${canonicalCompletion.score}/${canonicalCompletion.max} puntos) · score global ${getScoreView(canonicalAttempt.evaluation).displayScore}/120`}
              </span>
            )}
            {onNavigateBack && hasPrevious && <button type="button" className="quiz-secondary-button" onClick={onNavigateBack}>← Volver a la card anterior</button>}
            {onNavigateNext && hasNext && <button type="button" className="quiz-next-button" onClick={onNavigateNext}>Siguiente card →</button>}
          </div>
        </div>
        ) : (
          <div className="canonical-review__empty">
            <strong>Todavía no hay un checkpoint completo.</strong>
            <span>El coaching de arriba es rápido y provisional; cuando confirmes una evaluación aparecerán acá el score canónico, las barras y el feedback detallado.</span>
          </div>
        )}
      </section>}
    </section>
  );
}

function ParaphraseEditor({ draft, onDraftChange, hint, liveStatus }) {
  const editorRef = useRef(null);
  const selectionOffsetRef = useRef(draft.length);
  const renderedHintKeyRef = useRef("");
  const dismissedHintKeyRef = useRef("");

  const hintKey = hint ? `${hint.id}:${hint.kind}:${hint.text}` : "";

  useLayoutEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const currentDraft = readEditorDraft(editor);
    if (currentDraft !== draft) {
      replaceEditorDraft(editor, draft);
      restoreEditorSelection(editor, Math.min(selectionOffsetRef.current, draft.length));
    }

    editor.dataset.empty = draft ? "false" : "true";
    if (!hintKey) {
      removeEditorHint(editor);
      renderedHintKeyRef.current = "";
      dismissedHintKeyRef.current = "";
      return;
    }

    if (hintKey !== dismissedHintKeyRef.current && hintKey !== renderedHintKeyRef.current) {
      injectEditorHint(editor, draft, selectionOffsetRef.current, hint);
      renderedHintKeyRef.current = hintKey;
    }
  }, [draft, hint, hintKey]);

  const captureSelection = useCallback(() => {
    const editor = editorRef.current;
    if (editor) selectionOffsetRef.current = getEditorSelectionOffset(editor, draft.length);
  }, [draft.length]);

  const handleInput = useCallback((event) => {
    const editor = event.currentTarget;
    const selectionOffset = getEditorSelectionOffset(editor, draft.length);
    const nextDraft = readEditorDraft(editor);
    selectionOffsetRef.current = selectionOffset;
    if (hintKey) {
      dismissedHintKeyRef.current = hintKey;
      renderedHintKeyRef.current = "";
      removeEditorHint(editor);
    }
    onDraftChange(nextDraft);
  }, [draft.length, hintKey, onDraftChange]);

  const handleBeforeInput = useCallback((event) => {
    if (event.inputType?.startsWith("delete") && editorTouchesProtectedHint(event.currentTarget, event.inputType)) {
      event.preventDefault();
    }
  }, []);

  return (
    <div
      ref={editorRef}
      className="paraphrase-review__rich-editor"
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline="true"
      aria-label="Tu explicación con tus palabras"
      data-empty={!draft ? "true" : "false"}
      onInput={handleInput}
      onBeforeInput={handleBeforeInput}
      onKeyUp={captureSelection}
      onMouseUp={captureSelection}
      onSelect={captureSelection}
    />
  );
}

function createUserSegment(text, part = "only") {
  const segment = document.createElement("span");
  segment.dataset.editorUser = "true";
  segment.dataset.editorUserPart = part;
  segment.textContent = text;
  return segment;
}

function readEditorDraft(editor) {
  return Array.from(editor.querySelectorAll("[data-editor-user]"))
    .map((segment) => segment.innerText ?? segment.textContent ?? "")
    .join("");
}

function replaceEditorDraft(editor, draft) {
  editor.replaceChildren(createUserSegment(draft));
}

function removeEditorHint(editor) {
  editor.querySelectorAll("[data-editor-hint], [data-editor-hint-separator]").forEach((element) => element.remove());
}

function injectEditorHint(editor, draft, offset, hint) {
  const safeOffset = Math.max(0, Math.min(draft.length, offset));
  const before = draft.slice(0, safeOffset);
  const after = draft.slice(safeOffset);
  const fragment = document.createDocumentFragment();
  if (before) fragment.append(createUserSegment(before, "before"), createEditorBreak());
  fragment.append(createHintSegment(hint, Boolean(before), Boolean(after)));
  if (after) fragment.append(createEditorBreak(), createUserSegment(after, "after"));
  editor.replaceChildren(fragment);
  restoreEditorSelection(editor, safeOffset);
}

function createEditorBreak() {
  const lineBreak = document.createElement("br");
  lineBreak.dataset.editorHintSeparator = "true";
  return lineBreak;
}

function createHintSegment(hint, hasBefore, hasAfter) {
  const segment = document.createElement("span");
  segment.dataset.editorHint = "true";
  segment.contentEditable = "false";
  segment.className = `paraphrase-review__editor-inline-hint ${hasBefore ? "has-before" : "at-start"} ${hasAfter ? "has-after" : "at-end"}`;
  const label = document.createElement("span");
  label.textContent = hint.kind === "gap" ? "AHORA" : "PARA PROFUNDIZAR";
  segment.append(label, document.createTextNode(hint.text));
  return segment;
}

function editorTouchesProtectedHint(editor, inputType) {
  const hint = editor.querySelector("[data-editor-hint]");
  const selection = window.getSelection();
  if (!hint || !selection?.rangeCount) return false;
  const range = selection.getRangeAt(0);
  if (!range.collapsed && range.intersectsNode(hint)) return true;
  if (hint.contains(selection.anchorNode)) return true;

  const anchorElement = selection.anchorNode?.nodeType === Node.ELEMENT_NODE
    ? selection.anchorNode
    : selection.anchorNode?.parentElement;
  const userPart = anchorElement?.closest?.("[data-editor-user-part]");
  if (!userPart || !userPart.contains(selection.anchorNode)) return false;
  if (inputType === "deleteContentBackward" && userPart.dataset.editorUserPart === "after" && isCaretAtStart(userPart, selection)) return true;
  if (inputType === "deleteContentForward" && userPart.dataset.editorUserPart === "before" && isCaretAtEnd(userPart, selection)) return true;
  return false;
}

function isCaretAtStart(element, selection) {
  const range = document.createRange();
  range.selectNodeContents(element);
  range.setEnd(selection.anchorNode, selection.anchorOffset);
  return range.toString().length === 0;
}

function isCaretAtEnd(element, selection) {
  const range = document.createRange();
  range.selectNodeContents(element);
  range.setStart(selection.anchorNode, selection.anchorOffset);
  return range.toString().length === 0;
}

function getEditorSelectionOffset(editor, fallback) {
  const selection = window.getSelection();
  if (!selection?.rangeCount || !editor.contains(selection.anchorNode)) return fallback;
  const segments = Array.from(editor.querySelectorAll("[data-editor-user]"));
  let offset = 0;
  for (const segment of segments) {
    if (segment === selection.anchorNode || segment.contains(selection.anchorNode)) {
      const range = document.createRange();
      range.selectNodeContents(segment);
      range.setEnd(selection.anchorNode, selection.anchorOffset);
      return offset + range.toString().length;
    }
    offset += (segment.innerText ?? segment.textContent ?? "").length;
  }
  return fallback;
}

function restoreEditorSelection(editor, offset) {
  const segment = editor.querySelector("[data-editor-user]");
  if (!segment) return;
  const walker = document.createTreeWalker(segment, NodeFilter.SHOW_TEXT);
  let remaining = Math.max(0, offset);
  let node = walker.nextNode();
  let lastNode = segment;
  while (node) {
    lastNode = node;
    if (remaining <= node.nodeValue.length) {
      const range = document.createRange();
      range.setStart(node, remaining);
      range.collapse(true);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
    remaining -= node.nodeValue.length;
    node = walker.nextNode();
  }
  const range = document.createRange();
  range.selectNodeContents(lastNode);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function DebounceRing({ progress }) {
  const percent = Math.round(progress * 100);
  const remainingSeconds = Math.ceil((1 - progress) * 5);
  return (
    <span className="debounce-feedback" title={`La revisión empieza en aproximadamente ${remainingSeconds} segundos`} aria-label={`Pausa para revisar: ${remainingSeconds} segundos restantes`}>
      <span className="debounce-feedback__ring" style={{ "--debounce-angle": `${progress * 360}deg` }}>
        <span>{percent}</span>
      </span>
      <span className="debounce-feedback__label">pausa · {remainingSeconds}s</span>
    </span>
  );
}

function LiveRequestIndicator() {
  return (
    <span className="live-request-feedback" role="status" aria-live="polite">
      <span className="live-request-feedback__spinner" aria-hidden="true" />
      <span className="live-request-feedback__label">request en proceso</span>
      <span className="live-request-feedback__detail">recibiendo respuesta</span>
    </span>
  );
}
