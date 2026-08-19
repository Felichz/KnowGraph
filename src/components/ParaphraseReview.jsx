import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { coachChatStream, evaluateParaphraseStream, generateParaphraseStream, improveParaphraseStream, isCancel, judgePedagogy, liveReviewStream, polishParaphraseStream, polishPedagogyHarnessStream, reconcileParaphraseStream, refinePedagogyStream, userFacingAiError } from "../ai/client.js";
import {
  getDraft,
  getDraftRecord,
  getLiveReview,
  setDraft,
  listAttempts,
  listCoachIterations,
  saveAttempt,
  saveCoachIteration,
  saveLiveReview,
  updateCoachIterationMessages,
  updateCoachIterationReconciledHash,
} from "../ai/learningStore.js";
import { hashAnswer, hashCardContent, hashReconcileInput } from "../ai/contentHash.js";
import { buildLiveReviewState, normalizeLiveReviewState } from "../ai/liveReview.js";
import { EvaluationFeedback } from "./EvaluationFeedback.jsx";
import { AttemptHistory } from "./AttemptHistory.jsx";
import { LiveReviewPanel } from "./LiveReviewPanel.jsx";
import { LiveRequestFeedback } from "./LiveRequestFeedback.jsx";
import { ProgressLoader } from "./ProgressLoader.jsx";
import { CoachIterationHistory } from "./CoachIterationHistory.jsx";
import { CoachChat } from "./CoachChat.jsx";

const LIVE_DEBOUNCE_MS = 5_000;

function PedagogicalSparkline({ history = [], threshold = 95 }) {
  if (!history || history.length === 0) return null;
  const width = 170;
  const height = 44;
  const paddingX = 20;
  const paddingY = 8;

  const points = history.map((item, idx) => {
    const x = history.length === 1
      ? width / 2
      : paddingX + (idx / (history.length - 1)) * (width - paddingX * 2);
    const clampedScore = Math.max(0, Math.min(100, item.score ?? 0));
    const y = height - paddingY - (clampedScore / 100) * (height - paddingY * 2);
    return { x, y, score: item.score, iteration: item.iteration };
  });

  const polylineStr = points.map((p) => `${p.x},${p.y}`).join(" ");
  const thresholdY = height - paddingY - (threshold / 100) * (height - paddingY * 2);

  return (
    <div className="pedagogical-sparkline-container" title={`Trayectoria del Juez: ${history.map((h) => `${h.score}/100`).join(" → ")}`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="pedagogical-sparkline-svg">
        <line
          x1={paddingX}
          y1={thresholdY}
          x2={width - paddingX}
          y2={thresholdY}
          stroke="#10b981"
          strokeDasharray="3,3"
          strokeWidth="1.2"
          opacity="0.6"
        />
        <text x={width - 2} y={thresholdY + 3} fill="#10b981" fontSize="8.5" textAnchor="end" opacity="0.8">95</text>

        {points.length > 1 && (
          <polyline
            fill="none"
            stroke="url(#sparklineGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylineStr}
          />
        )}

        <defs>
          <linearGradient id="sparklineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {points.map((p, i) => {
          const isFinal = i === points.length - 1;
          const isTargetReached = p.score >= threshold;
          return (
            <g key={i} className="sparkline-point">
              <circle
                cx={p.x}
                cy={p.y}
                r={isFinal ? 4 : 3}
                fill={isTargetReached ? "#10b981" : (p.score >= 80 ? "#fbbf24" : "#f59e0b")}
                stroke="#0f172a"
                strokeWidth="1.5"
              />
              <text
                x={p.x}
                y={p.y - 5}
                fill={isTargetReached ? "#34d399" : "#fbbf24"}
                fontSize="9"
                fontWeight="700"
                textAnchor="middle"
              >
                {p.score}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function ParaphraseReview({ graphId, node, providerProfile, viewMode = "all", onRequestCoach, onRequestEvaluate, onEvaluationSaved, onNavigateBack, onNavigateNext, hasPrevious, hasNext }) {
  const contentHash = hashCardContent(node);

  const [draft, setDraftState] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [view, setView] = useState({ mode: "draft" });
  const [pending, setPending] = useState(null);
  const [liveStatus, setLiveStatus] = useState("idle");
  const [liveReview, setLiveReview] = useState(null);
  const [liveError, setLiveError] = useState(null);
  const [debounceStartedAt, setDebounceStartedAt] = useState(null);
  const [debounceNow, setDebounceNow] = useState(0);
  const [streamingChars, setStreamingChars] = useState(0);
  const [streamingSections, setStreamingSections] = useState({});
  const [streamingBlocks, setStreamingBlocks] = useState({});
  const [liveProgress, setLiveProgress] = useState({ phase: "idle", chars: 0, startedAt: null, now: 0 });
  const [coachIterations, setCoachIterations] = useState([]);
  const [coachViewIndex, setCoachViewIndex] = useState(null);
  const [chatState, setChatState] = useState({ iterationId: null, status: "idle", streamingText: "", progress: null, error: null });
  const [shortcutFeedback, setShortcutFeedback] = useState({ modifier: false, enter: false, triggered: false });
  const [cancelFeedback, setCancelFeedback] = useState(false);
  const [error, setError] = useState(null);
  const [isDraftAiGenerated, setIsDraftAiGenerated] = useState(false);
  const [isGeneratingParaphrase, setIsGeneratingParaphrase] = useState(false);
  const [paraphraseMode, setParaphraseMode] = useState(null);
  const [paraphraseProgress, setParaphraseProgress] = useState(0);
  const [aiTooltipOpen, setAiTooltipOpen] = useState(false);
  const [polishTooltipOpen, setPolishTooltipOpen] = useState(false);
  const [harnessState, setHarnessState] = useState({
    isActive: false,
    stage: null,
    message: "",
    currentScore: null,
    rubric: null,
    critique: [],
    history: [],
    passedThreshold: false,
    iteration: 0,
    isOpen: false,
  });
  const paraphraseControllerRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const toggleSpeechRecognition = () => {
    if (typeof window === "undefined") return;
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("El reconocimiento de voz no está disponible en este navegador.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = "es-ES";
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript + " ";
          }
        }
        if (transcript.trim()) {
          setDraftState((prev) => {
            const next = prev ? `${prev.trim()} ${transcript.trim()}` : transcript.trim();
            userEditedDraftRef.current = true;
            draftRef.current = next;
            if (draftSaveRef.current) clearTimeout(draftSaveRef.current);
            draftSaveRef.current = setTimeout(() => {
              saveDraft(graphId, node.id, next).catch(() => {});
            }, 300);
            return next;
          });
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const textareaRef = useRef(null);
  const draftRef = useRef("");
  const initialLoadRef = useRef(true);
  const userEditedDraftRef = useRef(false);
  const liveControllerRef = useRef(null);
  const liveRequestRef = useRef(null);
  const pendingControllerRef = useRef(null);
  const activeRequestRef = useRef(null);
  const draftSaveRef = useRef(null);
  const liveDebounceRef = useRef(null);
  const liveDebounceClockRef = useRef(null);
  const chatControllerRef = useRef(null);
  const chatRequestRef = useRef(null);
  const shortcutPulseRef = useRef(null);
  const streamCharsRef = useRef(0);
  const streamFrameRef = useRef(null);
  const streamBlocksRef = useRef({});
  const streamBlockFrameRef = useRef(null);
  const cancelFeedbackRef = useRef(null);

  const coachActiveIndex = coachIterations.length
    ? Math.max(0, Math.min(Number.isInteger(coachViewIndex) ? coachViewIndex : coachIterations.length - 1, coachIterations.length - 1))
    : -1;
  const selectedCoachIteration = coachActiveIndex >= 0 ? coachIterations[coachActiveIndex] : null;
  const isViewingCoachHistory = Number.isInteger(coachViewIndex) && coachActiveIndex >= 0;
  const visibleCoachReview = isViewingCoachHistory ? selectedCoachIteration?.review : liveReview;
  const visibleCoachText = isViewingCoachHistory ? selectedCoachIteration?.answer ?? "" : draft;
  const visibleCoachStatus = isViewingCoachHistory ? "ready" : liveStatus;
  const currentIterationMatchesDraft = Boolean(
    selectedCoachIteration
      && selectedCoachIteration.answerHash === hashAnswer(draft.trim())
      && selectedCoachIteration.contentHash === contentHash,
  );
  const activeChatIteration = isViewingCoachHistory || currentIterationMatchesDraft ? selectedCoachIteration : null;

  useEffect(() => {
    initialLoadRef.current = true;
    let cancelled = false;
    (async () => {
      const [storedDraftRecord, list, storedLiveReview, storedCoachIterations] = await Promise.all([
        getDraftRecord(graphId, node.id),
        listAttempts(graphId, node.id),
        getLiveReview(graphId, node.id),
        listCoachIterations(graphId, node.id),
      ]);
      if (cancelled || !initialLoadRef.current) return;
      initialLoadRef.current = false;
      const storedText = storedDraftRecord?.text ?? (typeof storedDraftRecord === "string" ? storedDraftRecord : "");
      const initialText = storedText || list.at(-1)?.answer || "";
      const isAi = Boolean(storedDraftRecord?.isAiGenerated || (!storedText && list.at(-1)?.isAiGenerated));
      const initialAnswerHash = hashAnswer(initialText.trim());
      const latestCoachIteration = storedCoachIterations.at(-1);
      const reusableIterationReview = latestCoachIteration
        && latestCoachIteration.answerHash === initialAnswerHash
        && latestCoachIteration.contentHash === contentHash
        ? latestCoachIteration.review
        : null;
      const reusableLiveReview = reusableIterationReview ?? (storedLiveReview
        && storedLiveReview.answerHash === initialAnswerHash
        && storedLiveReview.contentHash === contentHash
        ? storedLiveReview.review
        : null);
      userEditedDraftRef.current = false;
      draftRef.current = initialText;
      setIsDraftAiGenerated(isAi);
      setDraftState(initialText);
      setAttempts(list);
      setCoachIterations(storedCoachIterations);
      setCoachViewIndex(null);
      setChatState({ iterationId: null, status: "idle", streamingText: "", progress: null, error: null });
      setView({ mode: "draft" });
      setLiveStatus(reusableLiveReview ? "ready" : "idle");
      setLiveReview(normalizeLiveReviewState(reusableLiveReview));
      setLiveProgress({ phase: "idle", chars: 0, startedAt: null, now: 0 });
      setLiveError(null);
      setError(null);
      setPending(null);
    })();
    return () => {
      cancelled = true;
      liveRequestRef.current = null;
      activeRequestRef.current = null;
      liveControllerRef.current?.abort();
      paraphraseControllerRef.current?.abort();
      chatControllerRef.current?.abort();
      chatRequestRef.current = null;
      pendingControllerRef.current?.abort();
    };
  }, [contentHash, graphId, node.id]);

  useEffect(() => () => {
    if (draftSaveRef.current) clearTimeout(draftSaveRef.current);
    if (liveDebounceRef.current) clearTimeout(liveDebounceRef.current);
    if (liveDebounceClockRef.current) clearInterval(liveDebounceClockRef.current);
    if (streamFrameRef.current) cancelAnimationFrame(streamFrameRef.current);
    if (streamBlockFrameRef.current) cancelAnimationFrame(streamBlockFrameRef.current);
    liveControllerRef.current?.abort();
    paraphraseControllerRef.current?.abort();
    chatControllerRef.current?.abort();
    chatRequestRef.current = null;
    pendingControllerRef.current?.abort();
    if (shortcutPulseRef.current) clearTimeout(shortcutPulseRef.current);
    if (cancelFeedbackRef.current) clearTimeout(cancelFeedbackRef.current);
  }, []);

  useEffect(() => {
    if (draft === draftRef.current) return undefined;
    draftRef.current = draft;
    if (draftSaveRef.current) clearTimeout(draftSaveRef.current);
    draftSaveRef.current = setTimeout(() => {
      setDraft(graphId, node.id, draft, { isAiGenerated: isDraftAiGenerated });
    }, 400);
    return undefined;
  }, [draft, graphId, node.id, isDraftAiGenerated]);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const scroller = textarea.closest(".lesson-content");
    const scrollTop = scroller?.scrollTop;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.max(textarea.scrollHeight, 190)}px`;
    if (scroller && Number.isFinite(scrollTop)) scroller.scrollTop = scrollTop;
  }, [visibleCoachText, viewMode]);

  const handleDraftChange = useCallback((event) => {
    const scroller = event.currentTarget.closest(".lesson-content");
    const scrollTop = scroller?.scrollTop;
    userEditedDraftRef.current = true;
    setIsDraftAiGenerated(false);
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
    const startedAt = Date.now();
    setLiveStatus("running");
    setLiveError(null);
    setLiveProgress({ phase: "connecting", chars: 0, startedAt, now: startedAt });

    try {
      const result = await liveReviewStream({
        graphId,
        nodeId: node.id,
        answer: trimmed,
        contentHash,
        node,
        provider: providerProfile,
        signal: controller.signal,
        onSection: (field, value) => {
          if (liveRequestRef.current !== requestId) return;
          if (field === "scoreSummary") {
            setLiveProgress((previous) => ({ ...previous, phase: "scoring", now: Date.now() }));
            // Una evaluación nueva no puede mostrar la checklist de la anterior
            // mientras todavía no llegó su bloque coverage.
            setLiveReview((previous) => buildLiveReviewState(value, previous?.hint ?? null, [], []));
          } else if (field === "coverage") {
            setLiveProgress((previous) => ({ ...previous, phase: "coverage", now: Date.now() }));
            setLiveReview((previous) => previous
              ? { ...previous, coverage: Array.isArray(value) ? value : [] }
              : previous);
          } else if (field === "hint") {
            setLiveProgress((previous) => ({ ...previous, phase: "hint", now: Date.now() }));
            setLiveReview((previous) => previous
              ? { ...previous, hint: value, nextGapId: value?.kind === "gap" ? value.id : null }
              : previous);
          } else if (field === "additionalGaps") {
            setLiveReview((previous) => previous
              ? { ...previous, additionalGaps: Array.isArray(value) ? value : [] }
              : previous);
          }
        },
        onReset: (fallback) => {
          if (liveRequestRef.current !== requestId) return;
          setLiveReview(null);
          setLiveProgress((previous) => ({
            ...previous,
            phase: "fallback",
            chars: 0,
            fallbackFrom: fallback?.from ?? null,
            fallbackTo: fallback?.to ?? null,
            now: Date.now(),
          }));
        },
        onProgress: (length) => {
          if (liveRequestRef.current !== requestId) return;
          setLiveProgress((previous) => ({
            ...previous,
            chars: length,
            phase: length > 0 ? "receiving" : "processing",
            now: Date.now(),
          }));
        },
      });
      if (liveRequestRef.current !== requestId) return;
      liveControllerRef.current = null;
      setLiveReview(result.review);
      setLiveStatus("ready");
      setLiveProgress((previous) => ({ ...previous, phase: "hint", now: Date.now() }));
      const answerHash = hashAnswer(trimmed);
      const iteration = {
        id: `coach_${Date.now().toString(36)}_${Math.random().toString(16).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        graphId,
        nodeId: node.id,
        answer: trimmed,
        answerHash,
        contentHash,
        review: result.review,
        model: result.model,
        routedVia: result.routedVia,
        provider: result.provider,
        fallbackFrom: result.fallbackFrom,
        durationMs: Date.now() - startedAt,
        messages: [],
        isAiGenerated: Boolean(isDraftAiGenerated),
      };
      try {
        await saveCoachIteration(iteration);
        const storedIterations = await listCoachIterations(graphId, node.id);
        setCoachIterations(storedIterations);
        setCoachViewIndex(null);
        await saveLiveReview({
          graphId,
          nodeId: node.id,
          answerHash,
          contentHash,
          review: result.review,
        });
      } catch (storageError) {
        setLiveError(storageError?.message ?? "La revisión llegó, pero no se pudo guardar su iteración local.");
      }
    } catch (e) {
      if (liveRequestRef.current !== requestId || isCancel(e)) return;
      liveControllerRef.current = null;
      setLiveStatus("error");
      setLiveProgress((previous) => ({ ...previous, now: Date.now() }));
      setLiveError(userFacingAiError(e, "No se pudo conectar con el servicio de IA. Verificá que el gateway esté iniciado y que el provider esté disponible; después reintentá."));
    }
  }, [contentHash, graphId, node, node.id, providerProfile]);

  const cancelLiveReview = useCallback(() => {
    const hasDebounce = Boolean(liveDebounceRef.current || liveDebounceClockRef.current || debounceStartedAt);
    const hasRequest = Boolean(liveControllerRef.current || liveRequestRef.current || liveStatus === "running");
    if (!hasDebounce && !hasRequest) return;

    if (liveDebounceRef.current) clearTimeout(liveDebounceRef.current);
    if (liveDebounceClockRef.current) clearInterval(liveDebounceClockRef.current);
    liveDebounceRef.current = null;
    liveDebounceClockRef.current = null;
    liveControllerRef.current?.abort();
    liveControllerRef.current = null;
    liveRequestRef.current = null;
    setDebounceStartedAt(null);
    setDebounceNow(0);
    setLiveStatus("idle");
    setLiveProgress({ phase: "idle", chars: 0, startedAt: null, now: 0 });
    setLiveError(null);
    setShortcutFeedback({ modifier: false, enter: false, triggered: false });
    setCancelFeedback(true);
    if (cancelFeedbackRef.current) clearTimeout(cancelFeedbackRef.current);
    cancelFeedbackRef.current = setTimeout(() => {
      cancelFeedbackRef.current = null;
      setCancelFeedback(false);
    }, 1400);
  }, [debounceStartedAt, liveStatus]);

  const triggerLiveReviewNow = useCallback(() => {
    if (liveStatus !== "waiting" || !draft.trim() || draft.trim().length < 20) return;
    if (liveDebounceRef.current) clearTimeout(liveDebounceRef.current);
    if (liveDebounceClockRef.current) clearInterval(liveDebounceClockRef.current);
    liveDebounceRef.current = null;
    liveDebounceClockRef.current = null;
    setDebounceStartedAt(null);
    startLiveReview(draft);
  }, [draft, liveStatus, startLiveReview]);

  const triggerLiveReviewFromShortcut = useCallback(() => {
    if (liveStatus !== "waiting" || !draft.trim() || draft.trim().length < 20) return;
    setShortcutFeedback({ modifier: true, enter: true, triggered: true });
    if (shortcutPulseRef.current) clearTimeout(shortcutPulseRef.current);
    shortcutPulseRef.current = setTimeout(() => {
      shortcutPulseRef.current = null;
      setShortcutFeedback({ modifier: false, enter: false, triggered: false });
    }, 520);
    triggerLiveReviewNow();
  }, [draft, liveStatus, triggerLiveReviewNow]);

  const cancelParaphraseGeneration = useCallback(() => {
    if (paraphraseControllerRef.current) {
      paraphraseControllerRef.current.abort();
      paraphraseControllerRef.current = null;
    }
    setIsGeneratingParaphrase(false);
    setParaphraseMode(null);
  }, []);

  const handleGenerateAiParaphrase = useCallback(async () => {
    if (isGeneratingParaphrase) {
      cancelParaphraseGeneration();
      return;
    }

    if (draft.trim().length > 40 && !isDraftAiGenerated) {
      const confirmed = window.confirm(
        "Ya escribiste parte de tu respuesta. ¿Querés reemplazarla con una paráfrasis pedagógica completa generada con IA?"
      );
      if (!confirmed) return;
    }

    cancelLiveReview();
    const controller = new AbortController();
    paraphraseControllerRef.current = controller;
    setIsGeneratingParaphrase(true);
    setParaphraseMode("generate");
    setParaphraseProgress(0);
    userEditedDraftRef.current = false;

    let accumulated = "";
    try {
      const result = await generateParaphraseStream({
        node,
        provider: providerProfile,
        signal: controller.signal,
        onProgress: (length) => {
          setParaphraseProgress(length);
        },
        onDelta: (delta) => {
          accumulated += delta;
          setDraftState(accumulated);
          draftRef.current = accumulated;
        },
      });

      const finalText = result.text || accumulated;
      setDraftState(finalText);
      draftRef.current = finalText;
      setIsDraftAiGenerated(true);
      await setDraft(graphId, node.id, finalText, { isAiGenerated: true, generatedAt: new Date().toISOString() });
      startLiveReview(finalText);
    } catch (err) {
      if (!isCancel(err)) {
        setError({ code: err?.code ?? "upstream", message: userFacingAiError(err, "No se pudo generar la paráfrasis con IA.") });
      }
    } finally {
      setIsGeneratingParaphrase(false);
      setParaphraseMode(null);
      paraphraseControllerRef.current = null;
    }
  }, [cancelLiveReview, cancelParaphraseGeneration, draft, isDraftAiGenerated, isGeneratingParaphrase, node, providerProfile, graphId, startLiveReview]);

  const handleIncorporateFocus = useCallback(async (hintToIncorporate) => {
    if (isGeneratingParaphrase) {
      cancelParaphraseGeneration();
      return;
    }

    cancelLiveReview();
    const controller = new AbortController();
    paraphraseControllerRef.current = controller;
    setIsGeneratingParaphrase(true);
    setParaphraseMode("improve");
    setParaphraseProgress(0);
    userEditedDraftRef.current = false;

    let accumulated = "";
    try {
      const result = await improveParaphraseStream({
        node,
        currentDraft: draft,
        focusTitle: hintToIncorporate?.text ?? "",
        focusDetail: hintToIncorporate?.detail ?? hintToIncorporate?.text ?? "",
        provider: providerProfile,
        signal: controller.signal,
        onProgress: (length) => {
          setParaphraseProgress(length);
        },
        onDelta: (delta) => {
          accumulated += delta;
          setDraftState(accumulated);
          draftRef.current = accumulated;
        },
      });

      const finalText = result.text || accumulated;
      setDraftState(finalText);
      draftRef.current = finalText;
      setIsDraftAiGenerated(true);
      await setDraft(graphId, node.id, finalText, { isAiGenerated: true, generatedAt: new Date().toISOString() });
      startLiveReview(finalText);
    } catch (err) {
      if (!isCancel(err)) {
        setError({ code: err?.code ?? "upstream", message: userFacingAiError(err, "No se pudo incorporar el foco con IA.") });
      }
    } finally {
      setIsGeneratingParaphrase(false);
      setParaphraseMode(null);
      paraphraseControllerRef.current = null;
    }
  }, [cancelLiveReview, cancelParaphraseGeneration, draft, isGeneratingParaphrase, node, providerProfile, graphId, startLiveReview]);

  const handleReconcileChatWithDraft = useCallback(async () => {
    if (isGeneratingParaphrase) {
      cancelParaphraseGeneration();
      return;
    }

    const messages = activeChatIteration?.messages || [];
    if (messages.length === 0) return;

    const inputHash = hashReconcileInput(draft, messages);
    if (activeChatIteration?.reconciledHash === inputHash) return;

    cancelLiveReview();
    const controller = new AbortController();
    paraphraseControllerRef.current = controller;
    setIsGeneratingParaphrase(true);
    setParaphraseMode("reconcile");
    setParaphraseProgress(0);
    userEditedDraftRef.current = false;

    let accumulated = "";
    try {
      const result = await reconcileParaphraseStream({
        node,
        currentDraft: draft,
        messages,
        provider: providerProfile,
        signal: controller.signal,
        onProgress: (length) => {
          setParaphraseProgress(length);
        },
        onDelta: (delta) => {
          accumulated += delta;
          setDraftState(accumulated);
          draftRef.current = accumulated;
        },
      });

      const finalText = result.text || accumulated;
      setDraftState(finalText);
      draftRef.current = finalText;
      setIsDraftAiGenerated(true);
      await setDraft(graphId, node.id, finalText, { isAiGenerated: true, generatedAt: new Date().toISOString() });

      // Save reconciledHash on the iteration
      if (activeChatIteration?.id) {
        const nextHash = hashReconcileInput(finalText, messages);
        await updateCoachIterationReconciledHash(activeChatIteration.id, nextHash);
        const storedIterations = await listCoachIterations(graphId, node.id);
        setCoachIterations(storedIterations);
      }

      startLiveReview(finalText);
    } catch (err) {
      if (!isCancel(err)) {
        setError({ code: err?.code ?? "upstream", message: userFacingAiError(err, "No se pudo reconciliar el borrador con el chat.") });
      }
    } finally {
      setIsGeneratingParaphrase(false);
      setParaphraseMode(null);
      paraphraseControllerRef.current = null;
    }
  }, [activeChatIteration, cancelLiveReview, cancelParaphraseGeneration, draft, graphId, isGeneratingParaphrase, node, providerProfile, startLiveReview]);

  const handlePolishPedagogy = useCallback(async () => {
    if (isGeneratingParaphrase) {
      cancelParaphraseGeneration();
      return;
    }

    cancelLiveReview();
    const controller = new AbortController();
    paraphraseControllerRef.current = controller;
    setIsGeneratingParaphrase(true);
    setParaphraseMode("polish_judge");
    setParaphraseProgress(0);
    userEditedDraftRef.current = false;

    let currentDraft = draft.trim();
    const history = [];

    setHarnessState({
      isActive: true,
      stage: "judging",
      message: "⚖️ Evaluando calidad pedagógica con Juez...",
      currentScore: null,
      rubric: null,
      critique: [],
      history: [],
      passedThreshold: false,
      iteration: 0,
      isOpen: true,
    });

    try {
      // Si no hay borrador o es muy corto, generamos el borrador inicial
      if (!currentDraft || currentDraft.length < 15) {
        setHarnessState((prev) => ({
          ...prev,
          stage: "generating_initial",
          message: "🪄 Generando borrador inicial...",
        }));
        let initAcc = "";
        const genRes = await polishParaphraseStream({
          node,
          currentDraft: "",
          provider: providerProfile,
          signal: controller.signal,
          onDelta: (delta) => {
            initAcc += delta;
            setDraftState(initAcc);
            draftRef.current = initAcc;
          },
        });
        currentDraft = genRes.text || initAcc;
      }

      // Paso 1: Evaluación Inicial con el Juez
      setHarnessState((prev) => ({
        ...prev,
        stage: "judging",
        iteration: 0,
        message: "⚖️ Evaluando calidad pedagógica inicial con Juez...",
      }));

      let judgeResult = await judgePedagogy({
        node,
        draft: currentDraft,
        provider: providerProfile,
        signal: controller.signal,
      });

      history.push({
        iteration: 0,
        score: judgeResult.score,
        rubric: judgeResult.rubric,
        verdict: judgeResult.verdict,
        critique: judgeResult.pedagogicalCritique,
        draft: currentDraft,
      });

      setHarnessState((prev) => ({
        ...prev,
        currentScore: judgeResult.score,
        rubric: judgeResult.rubric,
        critique: judgeResult.pedagogicalCritique || [],
        passedThreshold: judgeResult.passedThreshold,
        history: [...history],
        iteration: 0,
        message: judgeResult.passedThreshold
          ? `✨ ¡Meta de calidad alcanzada (${judgeResult.score}/100)!`
          : `⚖️ Juez asignó ${judgeResult.score}/100 (Meta: 95+)`,
      }));

      // Bucle de Refinamiento (hasta 6 iteraciones o hasta alcanzar 95+)
      let iter = 0;
      const maxIterations = 6;

      while (!judgeResult.passedThreshold && iter < maxIterations) {
        if (controller.signal.aborted) break;
        iter += 1;

        setHarnessState((prev) => ({
          ...prev,
          stage: "refining",
          iteration: iter,
          message: `🪄 Refinando explicación según crítica del Juez (Iteración ${iter}/${maxIterations})...`,
        }));

        let refinedAcc = "";
        const refineRes = await refinePedagogyStream({
          node,
          draft: currentDraft,
          critique: judgeResult.pedagogicalCritique,
          currentScore: judgeResult.score,
          provider: providerProfile,
          signal: controller.signal,
          onDelta: (delta) => {
            refinedAcc += delta;
            setDraftState(refinedAcc);
            draftRef.current = refinedAcc;
          },
        });

        currentDraft = refineRes.text || refinedAcc;
        setDraftState(currentDraft);
        draftRef.current = currentDraft;

        // Re-evaluación del Juez sobre el texto refinado
        setHarnessState((prev) => ({
          ...prev,
          stage: "judging",
          iteration: iter,
          message: `⚖️ Re-evaluando calidad con Juez (Iteración ${iter})...`,
        }));

        judgeResult = await judgePedagogy({
          node,
          draft: currentDraft,
          provider: providerProfile,
          signal: controller.signal,
        });

        history.push({
          iteration: iter,
          score: judgeResult.score,
          rubric: judgeResult.rubric,
          verdict: judgeResult.verdict,
          critique: judgeResult.pedagogicalCritique,
          draft: currentDraft,
        });

        setHarnessState((prev) => ({
          ...prev,
          currentScore: judgeResult.score,
          rubric: judgeResult.rubric,
          critique: judgeResult.pedagogicalCritique || [],
          passedThreshold: judgeResult.passedThreshold,
          history: [...history],
          iteration: iter,
          message: judgeResult.passedThreshold
            ? `✨ ¡Maestría pedagógica alcanzada (${judgeResult.score}/100)!`
            : `⚖️ Juez asignó ${judgeResult.score}/100 en Iteración ${iter} (Meta: 95+)`,
        }));
      }

      setHarnessState((prev) => ({
        ...prev,
        isActive: false,
        stage: "done",
        message: judgeResult.passedThreshold
          ? `✨ ¡Maestría pedagógica alcanzada (${judgeResult.score}/100)!`
          : `Evaluación completada (${judgeResult.score}/100)`,
        isOpen: true,
      }));

      setIsDraftAiGenerated(true);
      await setDraft(graphId, node.id, currentDraft, { isAiGenerated: true, generatedAt: new Date().toISOString() });
      startLiveReview(currentDraft);
    } catch (err) {
      if (!isCancel(err)) {
        setError({ code: err?.code ?? "upstream", message: userFacingAiError(err, "Error durante el perfeccionamiento con Juez pedagógico.") });
      }
      setHarnessState((prev) => ({ ...prev, isActive: false }));
    } finally {
      setIsGeneratingParaphrase(false);
      setParaphraseMode(null);
      paraphraseControllerRef.current = null;
    }
  }, [cancelLiveReview, cancelParaphraseGeneration, draft, graphId, isGeneratingParaphrase, node, providerProfile, startLiveReview]);

  useEffect(() => {
    if (!debounceStartedAt) return undefined;
    const onKeyDown = (event) => {
      const modifier = event.key === "Control" || event.key === "Meta" || event.ctrlKey || event.metaKey;
      const enter = event.key === "Enter";
      if (!modifier && !enter) return;
      setShortcutFeedback((previous) => ({
        ...previous,
        modifier: previous.modifier || modifier,
        enter: previous.enter || enter,
      }));
    };
    const onKeyUp = (event) => {
      if (event.key === "Control" || event.key === "Meta") {
        setShortcutFeedback((previous) => ({ ...previous, modifier: false }));
      }
      if (event.key === "Enter") {
        setShortcutFeedback((previous) => ({ ...previous, enter: false }));
      }
    };
    const reset = () => setShortcutFeedback({ modifier: false, enter: false, triggered: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", reset);
    };
  }, [debounceStartedAt]);

  const selectCoachIteration = useCallback((index) => {
    if (!coachIterations.length) return;
    const safeIndex = Math.max(0, Math.min(index, coachIterations.length - 1));
    setCoachViewIndex(safeIndex);
  }, [coachIterations.length]);

  const returnToCurrentCoach = useCallback(() => {
    setCoachViewIndex(null);
  }, []);

  const sendCoachQuestion = useCallback(async (question) => {
    if (!activeChatIteration || chatState.status === "running") return;
    const previousMessages = activeChatIteration.messages ?? [];
    const userMessage = {
      id: `coach_message_${Date.now().toString(36)}_${Math.random().toString(16).slice(2, 8)}`,
      role: "user",
      content: question,
      createdAt: new Date().toISOString(),
    };
    const optimisticMessages = [...previousMessages, userMessage];
    setCoachIterations((iterations) => iterations.map((iteration) => (
      iteration.id === activeChatIteration.id ? { ...iteration, messages: optimisticMessages } : iteration
    )));
    await updateCoachIterationMessages(activeChatIteration.id, optimisticMessages).catch(() => {});

    chatControllerRef.current?.abort();
    const controller = new AbortController();
    chatControllerRef.current = controller;
    const request = { controller, iterationId: activeChatIteration.id, optimisticMessages, streamed: "" };
    chatRequestRef.current = request;
    const startedAt = Date.now();
    let streamed = "";
    setChatState({
      iterationId: activeChatIteration.id,
      status: "running",
      streamingText: "",
      progress: { phase: "connecting", chars: 0, startedAt, now: startedAt },
      error: null,
    });

    try {
      const result = await coachChatStream({
        graphId,
        nodeId: node.id,
        answer: activeChatIteration.answer,
        contentHash: activeChatIteration.contentHash,
        node,
        review: activeChatIteration.review,
        history: previousMessages,
        question,
        provider: providerProfile,
        signal: controller.signal,
        onProgress: () => {
          if (chatControllerRef.current !== controller) return;
          setChatState((state) => ({
            ...state,
            progress: { ...state.progress, phase: "processing", now: Date.now() },
          }));
        },
        onDelta: (delta, length) => {
          if (chatControllerRef.current !== controller) return;
          streamed += delta;
          request.streamed = streamed;
          setChatState((state) => ({
            ...state,
            streamingText: streamed,
            progress: { ...state.progress, phase: "receiving", chars: length, now: Date.now() },
          }));
        },
      });
      if (chatControllerRef.current !== controller) return;
      const assistantMessage = {
        ...result.message,
        model: result.model,
        routedVia: result.routedVia,
        provider: result.provider,
        fallbackFrom: result.fallbackFrom,
      };
      const finalMessages = [...optimisticMessages, assistantMessage];
      setCoachIterations((iterations) => iterations.map((iteration) => (
        iteration.id === activeChatIteration.id ? { ...iteration, messages: finalMessages } : iteration
      )));
      await updateCoachIterationMessages(activeChatIteration.id, finalMessages);
      chatControllerRef.current = null;
      chatRequestRef.current = null;
      setChatState({ iterationId: activeChatIteration.id, status: "idle", streamingText: "", progress: null, error: null });
    } catch (chatError) {
      if (chatControllerRef.current !== controller || isCancel(chatError)) return;
      chatControllerRef.current = null;
      chatRequestRef.current = null;
      setChatState({
        iterationId: activeChatIteration.id,
        status: "error",
        streamingText: streamed,
        progress: null,
        error: userFacingAiError(chatError, "No se pudo obtener la respuesta del coach."),
      });
    }
  }, [activeChatIteration, chatState.status, graphId, node, providerProfile]);

  const stopCoachResponse = useCallback(() => {
    const request = chatRequestRef.current;
    if (!request || chatControllerRef.current !== request.controller) return;

    request.cancelled = true;
    chatControllerRef.current = null;
    chatRequestRef.current = null;
    request.controller.abort();

    const partialText = request.streamed.trim();
    const messages = partialText
      ? [...request.optimisticMessages, {
        id: `coach_message_${Date.now().toString(36)}_${Math.random().toString(16).slice(2, 8)}`,
        role: "assistant",
        content: request.streamed,
        createdAt: new Date().toISOString(),
        interrupted: true,
      }]
      : request.optimisticMessages;
    setCoachIterations((iterations) => iterations.map((iteration) => (
      iteration.id === request.iterationId ? { ...iteration, messages } : iteration
    )));
    updateCoachIterationMessages(request.iterationId, messages).catch(() => {});
    setChatState({ iterationId: request.iterationId, status: "idle", streamingText: "", progress: null, error: null });
  }, []);

  useEffect(() => {
    if (initialLoadRef.current) return undefined;
    if (!userEditedDraftRef.current) {
      return undefined;
    }
    userEditedDraftRef.current = false;
    if (liveDebounceRef.current) clearTimeout(liveDebounceRef.current);
    if (liveDebounceClockRef.current) clearInterval(liveDebounceClockRef.current);
    liveControllerRef.current?.abort();
    liveRequestRef.current = null;
    if (!draft.trim()) {
      setDebounceStartedAt(null);
      setLiveStatus("idle");
      setLiveReview(null);
      setLiveProgress({ phase: "idle", chars: 0, startedAt: null, now: 0 });
      return undefined;
    }
    setLiveStatus("waiting");
    // Mientras editás solo se actualiza el coaching liviano; el checkpoint completo es manual.
    if (pendingControllerRef.current) {
      pendingControllerRef.current.abort();
    }
    const startedAt = Date.now();
    setDebounceStartedAt(startedAt);
    setDebounceNow(startedAt);
    const clock = setInterval(() => setDebounceNow(Date.now()), 50);
    liveDebounceClockRef.current = clock;
    liveDebounceRef.current = setTimeout(() => {
      setDebounceStartedAt(null);
      clearInterval(clock);
      liveDebounceClockRef.current = null;
      liveDebounceRef.current = null;
      startLiveReview(draft);
    }, LIVE_DEBOUNCE_MS);
    return () => {
      if (liveDebounceRef.current) clearTimeout(liveDebounceRef.current);
      if (liveDebounceClockRef.current) clearInterval(liveDebounceClockRef.current);
      clearInterval(clock);
      liveDebounceClockRef.current = null;
    };
  }, [draft, startLiveReview]);

  useEffect(() => {
    if (liveStatus !== "running" || !liveProgress.startedAt) return undefined;
    const timer = setInterval(() => {
      setLiveProgress((previous) => ({ ...previous, now: Date.now() }));
    }, 250);
    return () => clearInterval(timer);
  }, [liveStatus, liveProgress.startedAt]);

  useEffect(() => {
    if (chatState.status !== "running" || !chatState.progress?.startedAt) return undefined;
    const timer = setInterval(() => {
      setChatState((previous) => ({
        ...previous,
        progress: previous.progress ? { ...previous.progress, now: Date.now() } : null,
      }));
    }, 250);
    return () => clearInterval(timer);
  }, [chatState.status, chatState.progress?.startedAt]);

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
        provider: providerProfile,
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
        onReset: (fallback) => {
          if (activeRequestRef.current !== requestId) return;
          const preserveScores = fallback?.scope === "feedback";
          streamCharsRef.current = 0;
          setStreamingChars(0);
          setStreamingSections((previous) => preserveScores && previous.scoreSummary
            ? { scoreSummary: previous.scoreSummary }
            : {});
          streamBlocksRef.current = preserveScores
            ? Object.fromEntries(Object.entries(streamBlocksRef.current).filter(([id]) => id.startsWith("scoreSummary.")))
            : {};
          setStreamingBlocks({ ...streamBlocksRef.current });
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
      const attempt = { ...result.attempt, answer, durationMs, isAiGenerated: Boolean(isDraftAiGenerated) };
      await saveAttempt(attempt);
      // Pintar el resultado recibido inmediatamente. La lectura posterior de
      // IndexedDB queda como sincronizacion, pero no debe ser el momento que
      // desbloquea la UI: una respuesta valida ya esta disponible en memoria.
      setAttempts((previous) => [...previous.filter((item) => item.id !== attempt.id), attempt]
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
      setView({ mode: "draft" });
      onEvaluationSaved?.(attempt);
      const list = await listAttempts(graphId, node.id);
      setAttempts(list);
      setPending(null);
      pendingControllerRef.current = null;
      activeRequestRef.current = null;
    } catch (e) {
      if (activeRequestRef.current !== requestId) return;
      pendingControllerRef.current = null;
      activeRequestRef.current = null;
      setPending(null);
      if (isCancel(e)) return;
      setError({ code: e?.code ?? "upstream", message: userFacingAiError(e, "Error desconocido") });
    }
  }, [contentHash, draft, graphId, node, onEvaluationSaved, providerProfile]);

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
    userEditedDraftRef.current = false;
    draftRef.current = text;
    setDraftState(text);
    await setDraft(graphId, node.id, text);
    setView({ mode: "draft" });
    onRequestCoach?.();
  }, [attempts, view.index, graphId, node.id, onRequestCoach]);

  const charCount = draft.length;
  const visibleCoachCharCount = visibleCoachText.length;
  const tooShort = charCount > 0 && charCount < 80;
  const canonicalAttempt = view.mode === "attempt" ? attempts[view.index] : attempts.at(-1) ?? null;
  const canonicalAnswerHash = canonicalAttempt ? hashAnswer(canonicalAttempt.answer.trim()) : null;
  const matchingCoachIteration = canonicalAnswerHash
    ? [...coachIterations].reverse().find((iteration) => iteration.answerHash === canonicalAnswerHash && iteration.contentHash === contentHash)
    : null;
  const coachReviewForAttempt = matchingCoachIteration?.review
    ?? (canonicalAnswerHash && canonicalAnswerHash === hashAnswer(draft.trim()) ? liveReview : null);
  const debounceProgress = debounceStartedAt
    ? Math.max(0, Math.min(1, (debounceNow - debounceStartedAt) / LIVE_DEBOUNCE_MS))
    : 0;

  if (viewMode === "hidden") return null;

  return (
    <section className={`paraphrase-review paraphrase-review--${viewMode}`} aria-labelledby="paraphrase-review-title">
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
          <div className="mastery-workspace__editor">
            <div className="paraphrase-review__editor">
              <div className="paraphrase-review__editor-tools">
                <div className="paraphrase-review__tool-buttons">
                  <button
                    type="button"
                    className={`voice-dictate-button ${isListening ? "is-recording" : ""}`}
                    onClick={toggleSpeechRecognition}
                    aria-label={isListening ? "Detener dictado por voz" : "Dictar respuesta por voz"}
                    title={isListening ? "Detener dictado" : "Dictar respuesta con tu voz"}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" fill="currentColor"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>{isListening ? "Grabando voz..." : "Dictar por voz"}</span>
                  </button>

                  <div className="ai-generate-wrapper">
                    <button
                      type="button"
                      className={`ai-generate-button ${isGeneratingParaphrase ? "is-generating" : ""}`}
                      onClick={handleGenerateAiParaphrase}
                      disabled={isGeneratingParaphrase || Boolean(pending)}
                      aria-label={isGeneratingParaphrase ? "Generando paráfrasis fluida con IA..." : "Generar paráfrasis con IA"}
                      title="Generar una paráfrasis pedagógica fluida con IA (Skill V5)"
                    >
                      <span className="ai-generate-button__icon" aria-hidden="true">✨</span>
                      <span>{isGeneratingParaphrase ? "Generando con IA..." : "Generar con IA"}</span>
                    </button>

                    <div className="ai-generate-tooltip-wrapper">
                      <button
                        type="button"
                        className="ai-generate-tooltip-trigger"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAiTooltipOpen((v) => !v);
                        }}
                        onMouseEnter={() => setAiTooltipOpen(true)}
                        onMouseLeave={() => setAiTooltipOpen(false)}
                        aria-label="¿Por qué y cuándo conviene generar con IA?"
                        title="¿Por qué y cuándo conviene generar con IA?"
                      >
                        <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M10 8.5v5M10 5.8v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                      </button>
                      {aiTooltipOpen && (
                        <div className="ai-generate-tooltip-popover" role="tooltip">
                          <div className="ai-generate-tooltip-badge">✨ PARAFRASEO RÁPIDO</div>
                          <strong className="ai-generate-tooltip-title">¿Por qué y cuándo usar esta opción?</strong>
                          <p>
                            <strong>Ahorro de tiempo para entrevistas:</strong> Si ya dominás este concepto y estás corto de tiempo, podés auto-generar una paráfrasis pedagógica fluida en segundos para avanzar rápido en el grafo sin detenerte a escribirlo a mano.
                          </p>
                          <p>
                            <strong>Identificación en Flashcards:</strong> La card queda taggeada como <em>✨ Generada con IA</em> para que luego puedas filtrarla al instante y ensayarla manualmente desde cero cuando tengas más tiempo.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ai-polish-wrapper">
                    <button
                      type="button"
                      className={`ai-polish-button ${isGeneratingParaphrase && paraphraseMode === "polish_judge" ? "is-generating" : ""}`}
                      onClick={handlePolishPedagogy}
                      disabled={isGeneratingParaphrase || Boolean(pending)}
                      aria-label={isGeneratingParaphrase && paraphraseMode === "polish_judge" ? "Perfeccionando explicación con Juez Pedagógico..." : "Perfeccionar con Juez IA (Harness Loop)"}
                      title="Ejecuta un loop interactivo de Juez + Refinador para evaluar y perfeccionar la pedagogía hasta alcanzar 90+/100"
                    >
                      <span className="ai-polish-button__icon" aria-hidden="true">💡</span>
                      <span>
                        {isGeneratingParaphrase && paraphraseMode === "polish_judge"
                          ? (harnessState.stage === "judging"
                              ? `⚖️ Juez: ${harnessState.iteration === 0 ? "Evaluando" : `Iteración ${harnessState.iteration}`}...`
                              : `🪄 Refinando: Iteración ${harnessState.iteration}...`)
                          : (harnessState.currentScore !== null
                              ? `💡 Perfeccionar (${harnessState.currentScore}/100)`
                              : "💡 Perfeccionar con Juez")}
                      </span>
                    </button>

                    <div className="ai-polish-tooltip-wrapper">
                      <button
                        type="button"
                        className="ai-polish-tooltip-trigger"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPolishTooltipOpen((v) => !v);
                        }}
                        onMouseEnter={() => setPolishTooltipOpen(true)}
                        onMouseLeave={() => setPolishTooltipOpen(false)}
                        aria-label="¿Cómo funciona el Harness con Juez Pedagógico?"
                        title="¿Cómo funciona el Harness con Juez Pedagógico?"
                      >
                        <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="M10 8.5v5M10 5.8v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                      </button>
                      {polishTooltipOpen && (
                        <div className="ai-polish-tooltip-popover" role="tooltip">
                          <div className="ai-polish-tooltip-badge">💡 HARNESS CON LLM-AS-A-JUDGE</div>
                          <strong className="ai-polish-tooltip-title">Loop de Auto-Perfeccionamiento Pedagógico</strong>
                          <p>
                            <strong>1. Juez Evaluador:</strong> Asigna un puntaje en 5 dimensiones (Intuición, Autocontención del alcance, Ritmo cognitivo, Causalidad y Código/Cierre).
                          </p>
                          <p>
                            <strong>2. Refinamiento Iterativo:</strong> Si el puntaje es menor a 95/100, el Juez genera observaciones y el Refinador reescribe el texto hasta alcanzar la maestría didáctica.
                          </p>
                          <p>
                            <strong>3. Minimapa en Vivo:</strong> Muestra la trayectoria de mejora y el desglose de cada dimensión en tiempo real.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {isDraftAiGenerated && !isGeneratingParaphrase && (
                  <span className="ai-generated-tag" title="Este borrador fue generado automáticamente con IA. Modificalo libremente o volvé a practicarlo desde cero.">
                    <span className="ai-generated-tag__spark" aria-hidden="true">✨</span>
                    <span>Generado con IA</span>
                  </span>
                )}
              </div>

              {harnessState.isOpen && (
                <div className={`pedagogical-harness-panel ${harnessState.isActive ? "is-running" : "is-complete"}`}>
                  <div className="pedagogical-harness-panel__header">
                    <div className="pedagogical-harness-panel__title-group">
                      <span className="pedagogical-harness-panel__badge">
                        {harnessState.isActive ? "⚡ HARNESS PEDAGÓGICO EN VIVO" : "🏆 EVALUACIÓN DEL JUEZ PEDAGÓGICO"}
                      </span>
                      <div className="pedagogical-harness-panel__status-msg">
                        {harnessState.message}
                      </div>
                    </div>

                    <div className="pedagogical-harness-panel__actions">
                      {harnessState.isActive && (
                        <button
                          type="button"
                          className="pedagogical-harness-panel__cancel-btn"
                          onClick={cancelParaphraseGeneration}
                        >
                          Cancelar
                        </button>
                      )}
                      {!harnessState.isActive && (
                        <button
                          type="button"
                          className="pedagogical-harness-panel__close-btn"
                          onClick={() => setHarnessState((prev) => ({ ...prev, isOpen: false }))}
                          aria-label="Cerrar panel del Juez"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pedagogical-harness-panel__body">
                    <div className="pedagogical-harness-panel__chart-block">
                      <div className="pedagogical-harness-panel__chart-header">
                        <span className="pedagogical-harness-panel__chart-title">Evolución de Calidad</span>
                        <span className="pedagogical-harness-panel__target-pill">Meta: 95/100</span>
                      </div>
                      <PedagogicalSparkline history={harnessState.history} threshold={95} />
                    </div>

                    {harnessState.rubric && (
                      <div className="pedagogical-harness-panel__rubric-grid">
                        <div className="pedagogical-rubric-chip" title="Apertura con modelo mental intuitivo del problema">
                          <span className="pedagogical-rubric-chip__name">🧠 Intuición</span>
                          <span className="pedagogical-rubric-chip__val">
                            {harnessState.rubric.intuitionAndClarity ?? 0}/{harnessState.rubric.selfContainedScope !== undefined ? 20 : 25}
                          </span>
                        </div>
                        {harnessState.rubric.selfContainedScope !== undefined && (
                          <div className="pedagogical-rubric-chip" title="Autocontención del scope y cero jerga/amenazas huérfanas">
                            <span className="pedagogical-rubric-chip__name">🔭 Alcance</span>
                            <span className="pedagogical-rubric-chip__val">{harnessState.rubric.selfContainedScope ?? 0}/20</span>
                          </div>
                        )}
                        <div className="pedagogical-rubric-chip" title="Ritmo respirable, una sola idea a la vez y párrafos delimitados">
                          <span className="pedagogical-rubric-chip__name">⏳ Ritmo</span>
                          <span className="pedagogical-rubric-chip__val">
                            {harnessState.rubric.cognitivePacing ?? 0}/{harnessState.rubric.selfContainedScope !== undefined ? 20 : 25}
                          </span>
                        </div>
                        <div className="pedagogical-rubric-chip" title="Causa y efecto físico/arquitectónico y análisis de trade-offs">
                          <span className="pedagogical-rubric-chip__name">⚖️ Causalidad</span>
                          <span className="pedagogical-rubric-chip__val">
                            {harnessState.rubric.causalityAndTradeoffs ?? 0}/{harnessState.rubric.selfContainedScope !== undefined ? 20 : 25}
                          </span>
                        </div>
                        <div className="pedagogical-rubric-chip" title="Código operativo funcional, errores observables en producción y regla memorable">
                          <span className="pedagogical-rubric-chip__name">🎯 Código/Cierre</span>
                          <span className="pedagogical-rubric-chip__val">
                            {harnessState.rubric.applicationAndFailureModes ?? 0}/{harnessState.rubric.selfContainedScope !== undefined ? 20 : 25}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {Array.isArray(harnessState.critique) && harnessState.critique.length > 0 && (
                    <div className="pedagogical-harness-panel__critique">
                      <strong className="pedagogical-harness-panel__critique-title">
                        {harnessState.isActive ? "🔍 Foco de mejora del Refinador:" : "🔍 Observaciones pedagógicas:"}
                      </strong>
                      <ul>
                        {harnessState.critique.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              <textarea
                ref={textareaRef}
                className={`paraphrase-review__textarea ${isViewingCoachHistory ? "is-readonly" : ""}`}
                value={visibleCoachText}
                onChange={isViewingCoachHistory ? undefined : handleDraftChange}
                readOnly={isViewingCoachHistory}
                onKeyDown={(event) => {
                  if (isViewingCoachHistory) return;
                  if (event.key === "Escape" && (debounceStartedAt || liveStatus === "running")) {
                    event.preventDefault();
                    // La card también tiene un listener global de Escape para
                    // cerrarse. El coaching activo tiene prioridad y consume
                    // el evento antes de que llegue a ese listener.
                    event.stopPropagation();
                    cancelLiveReview();
                    return;
                  }
                  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                    event.preventDefault();
                    triggerLiveReviewFromShortcut();
                  }
                }}
                placeholder="Explicá qué es, cómo funciona, por qué importa y qué trade-offs tiene..."
                rows={9}
                aria-label={isViewingCoachHistory ? "Explicación guardada de esta iteración" : "Tu explicación con tus palabras"}
              />
            </div>
          </div>
          <LiveReviewPanel
            status={visibleCoachStatus}
            review={visibleCoachReview}
            hint={visibleCoachReview?.hint}
            error={isViewingCoachHistory ? null : liveError}
            progress={isViewingCoachHistory ? null : { ...liveProgress, now: liveStatus === "running" ? Date.now() : liveProgress.now }}
            footerMeta={(
              <>
                {isViewingCoachHistory ? (
                  <span className="paraphrase-review__readonly-badge">SOLO LECTURA · ITERACIÓN {coachActiveIndex + 1}</span>
                ) : !isViewingCoachHistory && (debounceStartedAt || liveStatus === "running") ? (
                  <span className="live-coach-controls">
                    {debounceStartedAt && (
                      <DebounceRing progress={debounceProgress} onTrigger={triggerLiveReviewNow} shortcutState={shortcutFeedback} />
                    )}
                    <LiveCancelButton onCancel={cancelLiveReview} />
                  </span>
                ) : cancelFeedback ? (
                  <span className="live-cancelled-feedback" role="status">
                    <span aria-hidden="true">■</span>
                    <span>revisión detenida</span>
                    <kbd>Esc</kbd>
                  </span>
                ) : shortcutFeedback.triggered ? (
                  <ShortcutFlash shortcutState={shortcutFeedback} />
                ) : null}
                <span className={`paraphrase-review__count ${!isViewingCoachHistory && tooShort ? "is-warn" : ""}`}>
                  {visibleCoachCharCount} caracteres{!isViewingCoachHistory && tooShort ? " · un poco corta" : ""}
                </span>
              </>
            )}
            coverageNode={node}
            onIncorporateFocus={isViewingCoachHistory ? undefined : handleIncorporateFocus}
            isIncorporatingFocus={isGeneratingParaphrase && paraphraseMode === "improve"}
          />
          {visibleCoachReview?.hint && (() => {
            const currentReconcileHash = hashReconcileInput(draft, activeChatIteration?.messages || []);
            const isAlreadyReconciled = Boolean(
              activeChatIteration?.reconciledHash
              && activeChatIteration.reconciledHash === currentReconcileHash
            );
            return (
              <LiveHint
                key={`${selectedCoachIteration?.id ?? "draft"}:${visibleCoachReview.hint.id ?? visibleCoachReview.hint.text}`}
                chatProps={{
                  iteration: activeChatIteration,
                  status: chatState.iterationId === activeChatIteration?.id ? chatState.status : "idle",
                  streamingText: chatState.iterationId === activeChatIteration?.id ? chatState.streamingText : "",
                  progress: chatState.iterationId === activeChatIteration?.id ? chatState.progress : null,
                  error: chatState.iterationId === activeChatIteration?.id ? chatState.error : null,
                  onSend: sendCoachQuestion,
                  onStop: stopCoachResponse,
                  onReconcile: isViewingCoachHistory ? undefined : handleReconcileChatWithDraft,
                  isReconciling: isGeneratingParaphrase && paraphraseMode === "reconcile",
                  isAlreadyReconciled,
                }}
              />
            );
          })()}
          <CoachIterationHistory
            iterations={coachIterations}
            attempts={attempts}
            viewIndex={isViewingCoachHistory ? coachActiveIndex : null}
            onSelect={selectCoachIteration}
            onSelectAttempt={(index) => {
              selectAttempt(index);
              onRequestEvaluate?.();
            }}
            onReturnCurrent={returnToCurrentCoach}
          />
      </div>
      </>}

      {viewMode !== "coach" && <section className="canonical-review" aria-labelledby="canonical-review-title">
        <header className="canonical-review__header">
          <div>
            <span className="lesson-section-label">EVALUACIÓN COMPLETA</span>
            <h3 id="canonical-review-title">Resultado de tu evaluación</h3>
          </div>
          <div className="canonical-review__header-actions">
            <button type="button" className="quiz-primary-button canonical-review__evaluate-button" onClick={() => submitFullEvaluation(draft, "manual")} disabled={!draft.trim() || Boolean(pending)}>
              {pending ? "Procesando..." : "Procesar evaluación completa"}
            </button>
          </div>
        </header>
        <div className={`canonical-review__draft-status ${draft.trim() ? "is-ready" : "is-empty"}`}>
          <div>
            <span>BORRADOR ACTUAL</span>
            <strong>{draft.trim() ? `${charCount} caracteres listos para evaluar` : "Todavía no escribiste una respuesta"}</strong>
          </div>
          {onRequestCoach && <button type="button" onClick={onRequestCoach}>{draft.trim() ? "Editar en Coaching" : "Ir a Coaching"} →</button>}
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
            <p><strong>No se pudo completar la evaluación.</strong> {error.message}</p>
            <button type="button" className="quiz-primary-button" onClick={() => submitFullEvaluation(draft, "manual")}>Reintentar</button>
          </div>
        )}
        {!pending && canonicalAttempt ? (
          <div className="paraphrase-review__result">
          <AttemptHistory
            attempts={attempts}
            coachIterations={coachIterations}
            viewIndex={view.mode === "attempt" ? view.index : attempts.length - 1}
            onSelect={selectAttempt}
            onSelectCoachIteration={(index) => {
              selectCoachIteration(index);
              onRequestCoach?.();
            }}
            onBackToDraft={backToDraft}
          />
           <EvaluationFeedback
             evaluation={canonicalAttempt.evaluation}
             attemptContentHash={canonicalAttempt.contentHash}
             currentContentHash={contentHash}
             coachHint={coachReviewForAttempt?.hint}
           />
          <details className="paraphrase-review__attempt-answer">
            <summary>Ver respuesta evaluada</summary>
            <blockquote className="paraphrase-review__answer">{canonicalAttempt.answer}</blockquote>
          </details>
          <div className="paraphrase-review__result-actions">
            <button type="button" className="quiz-primary-button" onClick={startEdit}>Volver al coaching</button>
            {onNavigateBack && hasPrevious && <button type="button" className="quiz-secondary-button" onClick={onNavigateBack}>← Volver a la card anterior</button>}
            {onNavigateNext && hasNext && <button type="button" className="quiz-next-button" onClick={onNavigateNext}>Siguiente card →</button>}
          </div>
        </div>
        ) : !pending && coachIterations.length > 0 ? (
          <div className="canonical-review__coaching-preview">
            <AttemptHistory
              attempts={[]}
              coachIterations={coachIterations}
              onSelectCoachIteration={(index) => {
                selectCoachIteration(index);
                onRequestCoach?.();
              }}
              onBackToDraft={backToDraft}
            />
            <div className="canonical-review__empty canonical-review__empty--coaching">
              <strong>Tenés {coachIterations.length} {coachIterations.length === 1 ? "checkpoint" : "checkpoints"} de coaching registrados.</strong>
              <span>El gráfico arriba muestra la evolución de tus borradores. Procesá la evaluación completa para obtener el score formal de 120 puntos y la rúbrica detallada.</span>
              <button type="button" className="quiz-primary-button" style={{ marginTop: "14px" }} onClick={() => submitFullEvaluation(draft, "manual")} disabled={!draft.trim() || Boolean(pending)}>
                {pending ? "Procesando..." : "Procesar evaluación completa ahora"}
              </button>
            </div>
          </div>
        ) : !pending ? (
          <div className="canonical-review__empty">
            <strong>Todavía no hay una evaluación completa.</strong>
            <span>El coaching rápido vive en la vista de Coaching. A medida que escribas tu explicación, los checkpoints y evaluaciones se irán combinando en este gráfico.</span>
          </div>
        ) : null}
      </section>}
    </section>
  );
}

function LiveHint({ chatProps }) {
  const chatHasState = Boolean(
    chatProps.iteration?.messages?.length
      || chatProps.status === "running"
      || chatProps.status === "error"
      || chatProps.streamingText,
  );
  const [chatOpen, setChatOpen] = useState(chatHasState);
  useEffect(() => {
    setChatOpen(chatHasState);
  }, [chatHasState]);

  return (
    <section className="paraphrase-review__coach-details">
      <div className="paraphrase-review__hint-expanded">
          <button
            type="button"
            className="paraphrase-review__coach-chat-toggle"
            aria-expanded={chatOpen}
            onClick={() => setChatOpen((value) => !value)}
          >
            {chatOpen ? "Cerrar conversación" : "Preguntarle al coach"}
          </button>
          {chatOpen && <CoachChat {...chatProps} />}
      </div>
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

function ShortcutKeys({ shortcutState, className = "" }) {
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(`${navigator.platform} ${navigator.userAgent}`);
  const modifierLabel = isMac ? "⌘" : "Ctrl";
  return (
    <span className={`debounce-feedback__shortcut ${shortcutState.triggered ? "is-triggered" : ""} ${className}`.trim()} aria-hidden="true">
      <kbd className={shortcutState.modifier ? "is-pressed" : ""}>{modifierLabel}</kbd>
      <span className="debounce-feedback__shortcut-separator">+</span>
      <kbd className={shortcutState.enter ? "is-pressed" : ""}>↵</kbd>
    </span>
  );
}

function ShortcutFlash({ shortcutState }) {
  return <ShortcutKeys shortcutState={shortcutState} className="is-flash" />;
}

function DebounceRing({ progress, onTrigger, shortcutState }) {
  const percent = Math.round(progress * 100);
  const remainingSeconds = Math.ceil((1 - progress) * 5);
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(`${navigator.platform} ${navigator.userAgent}`);
  const shortcutLabel = isMac ? "⌘ + ↵" : "Ctrl + ↵";
  const shortcutAria = isMac ? "Command Enter" : "Control Enter";
  return (
    <button
      type="button"
      className="debounce-feedback"
      style={{ "--debounce-angle": `${progress * 360}deg` }}
      title={`Evaluar el coaching ahora (${shortcutLabel})`}
      aria-keyshortcuts={shortcutAria}
      aria-label={`Evaluar el coaching ahora con ${shortcutLabel}. La evaluación automática comenzaría en ${remainingSeconds} segundos.`}
      onClick={onTrigger}
    >
      <span className="debounce-feedback__ring" style={{ "--debounce-angle": `${progress * 360}deg` }}>
        <span>{percent}</span>
      </span>
      <span className="debounce-feedback__label">evaluar ahora · {remainingSeconds}s</span>
      <ShortcutKeys shortcutState={shortcutState} />
    </button>
  );
}

function LiveCancelButton({ onCancel }) {
  return (
    <button
      type="button"
      className="live-cancel-button"
      title="Detener la revisión del coaching"
      aria-label="Detener la revisión del coaching"
      aria-keyshortcuts="Escape"
      onClick={onCancel}
    >
      <span className="live-cancel-button__icon" aria-hidden="true">■</span>
      <span className="live-cancel-button__label">detener</span>
      <kbd>Esc</kbd>
    </button>
  );
}
