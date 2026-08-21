import React, { useEffect, useRef, useState } from "react";
import { ChatMarkdown } from "./CoachChat.jsx";

export function LearningThreadView({
  graphId,
  node,
  draftRecord,
  currentTask,
  onStartHarness,
  onCancelHarness,
  onSendUserMessage,
  onRequestEvaluate,
}) {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [judgePanelOpen, setJudgePanelOpen] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const isTaskRunning = Boolean(currentTask?.status === "running");
  const isMastery = Boolean(
    (draftRecord?.harnessPassedThreshold || (draftRecord?.harnessScore ?? 0) >= 95) &&
    !isTaskRunning
  );

  const history = draftRecord?.harnessHistory || currentTask?.history || [];
  const score = draftRecord?.harnessScore ?? currentTask?.score ?? null;
  const rubric = draftRecord?.harnessRubric ?? currentTask?.rubric ?? null;

  // Masterclass text: either latest task draft or saved draft text
  const masterclassText = currentTask?.status === "running"
    ? currentTask.draft
    : (draftRecord?.text || "");

  // Messages thread from saved record or empty
  const [threadMessages, setThreadMessages] = useState(() => {
    return Array.isArray(draftRecord?.messages) ? draftRecord.messages : [];
  });

  useEffect(() => {
    if (Array.isArray(draftRecord?.messages)) {
      setThreadMessages(draftRecord.messages);
    }
  }, [draftRecord?.messages]);

  // Auto-scroll to bottom when messages or streaming text change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [threadMessages.length, isTaskRunning, currentTask?.stage, currentTask?.draft]);

  // Speech Recognition (Dictation)
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
          setInputText((prev) => (prev ? `${prev.trim()} ${transcript.trim()}` : transcript.trim()));
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    const clean = inputText.trim();
    if (!clean || isTaskRunning) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      role: "user",
      content: clean,
      createdAt: new Date().toISOString(),
    };

    const nextMessages = [...threadMessages, userMsg];
    setThreadMessages(nextMessages);
    setInputText("");

    if (onSendUserMessage) {
      onSendUserMessage(clean, nextMessages);
    }
  };

  const quickPrompts = [
    "¿Por qué falla el enfoque ingenuo?",
    "¿Podrías explicarlo con una analogía visual?",
    "¿Cómo diagnostico este error en producción?",
    "Tengo una duda con el código...",
  ];

  return (
    <div className="learning-thread-view" aria-label="Espacio de Aprendizaje y Mentoría Socrática">
      {/* Header Bar */}
      <header className="learning-thread-header">
        <div className="learning-thread-header__title-group">
          <span className="learning-thread-header__tag">
            <span className="learning-thread-header__tag-dot" aria-hidden="true" />
            MENTORÍA SOCRÁTICA & MASTERCLASS
          </span>
          <h2 className="learning-thread-header__title">{node?.label || node?.title || "Concepto"}</h2>
        </div>

        <div className="learning-thread-header__actions">
          {score !== null && (
            <button
              type="button"
              className={`learning-thread-judge-badge ${isMastery ? "is-mastery" : ""}`}
              onClick={() => setJudgePanelOpen((v) => !v)}
              title="Click para ver la auditoría del Juez Pedagógico y evolución"
            >
              <span className="learning-thread-judge-badge__icon" aria-hidden="true">
                {isMastery ? "🏆" : "⚖️"}
              </span>
              <span>{isMastery ? `Maestría (${score}/100)` : `Juez: ${score}/100`}</span>
            </button>
          )}

          <button
            type="button"
            className="learning-thread-regen-btn"
            onClick={onStartHarness}
            disabled={isTaskRunning}
            title="Genera o perfecciona la lección magistral completa con el Juez Pedagógico"
          >
            <span className="learning-thread-regen-btn__icon" aria-hidden="true">✨</span>
            <span>{masterclassText ? "Regenerar Lección" : "Generar Lección"}</span>
          </button>
        </div>
      </header>

      {/* Collapsible Judge Panel */}
      {judgePanelOpen && (
        <section className="learning-thread-judge-drawer" aria-label="Auditoría del Juez Pedagógico">
          <div className="learning-thread-judge-drawer__header">
            <div className="learning-thread-judge-drawer__title-wrap">
              <span className="learning-thread-judge-drawer__pill">AUDITORÍA PEDAGÓGICA RIGUROSA</span>
              <strong>Evaluación de Calidad del Mentor</strong>
            </div>
            <button
              type="button"
              className="learning-thread-judge-drawer__close"
              onClick={() => setJudgePanelOpen(false)}
              aria-label="Cerrar panel de auditoría"
            >
              ✕
            </button>
          </div>

          <div className="learning-thread-judge-drawer__body">
            {history.length > 0 && (
              <div className="learning-thread-judge-drawer__sparkline-row">
                <span className="learning-thread-judge-drawer__sublabel">Evolución de Refinamiento (Meta: 95+)</span>
                <div className="learning-thread-judge-drawer__history-pills">
                  {history.map((h, i) => (
                    <span
                      key={i}
                      className={`history-pill ${h.score >= 95 ? "is-target" : (h.score >= 80 ? "is-good" : "is-initial")}`}
                    >
                      Iter {h.iteration}: <strong>{h.score}/100</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {rubric && (
              <div className="learning-thread-judge-drawer__rubric-grid">
                <div className="rubric-stat-card">
                  <span>🪝 Anclaje Didáctico</span>
                  <strong>{rubric.foundationalContext ?? 0}/20</strong>
                </div>
                <div className="rubric-stat-card">
                  <span>🔭 Alcance y Foco</span>
                  <strong>{rubric.selfContainedScope ?? 0}/20</strong>
                </div>
                <div className="rubric-stat-card">
                  <span>⏳ Ritmo y Markdown</span>
                  <strong>{rubric.cognitivePacing ?? 0}/20</strong>
                </div>
                <div className="rubric-stat-card">
                  <span>⚖️ Causalidad Física</span>
                  <strong>{rubric.causalityAndTradeoffs ?? 0}/20</strong>
                </div>
                <div className="rubric-stat-card">
                  <span>🎯 Código y Socrática</span>
                  <strong>{rubric.applicationAndFailureModes ?? 0}/20</strong>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Main Conversation & Masterclass Thread */}
      <div className="learning-thread-container">
        <div className="learning-thread-messages" role="log" aria-live="polite">
          {/* 1. Masterclass Message (Initial Teacher Lesson or Live Running Stream) */}
          {masterclassText || isTaskRunning ? (
            <article
              className={`learning-thread-bubble learning-thread-bubble--mentor is-masterclass ${
                isTaskRunning ? "is-running-stream" : ""
              }`}
            >
              <div className="learning-thread-bubble__header">
                <div className="learning-thread-bubble__author">
                  <span
                    className={`learning-thread-bubble__avatar ${
                      isTaskRunning ? "is-pulsing" : ""
                    }`}
                    aria-hidden="true"
                  >
                    🧠
                  </span>
                  <div className="learning-thread-bubble__author-info">
                    <strong>Mentor Senior</strong>
                    <small>
                      {isTaskRunning
                        ? currentTask.stage === "judging"
                          ? "⚖️ Juez Pedagógico auditando calidad..."
                          : currentTask.stage === "generating_initial"
                          ? "🪄 Redactando explicación base..."
                          : `🪄 Refinando explicación (Iteración ${currentTask.iteration || 1})...`
                        : "Lección Magistral de Apertura"}
                    </small>
                  </div>
                </div>

                <div className="learning-thread-bubble__header-right">
                  {score !== null && !isTaskRunning && (
                    <button
                      type="button"
                      className={`learning-thread-bubble__judge-pill ${isMastery ? "is-mastery" : ""}`}
                      onClick={() => setJudgePanelOpen((v) => !v)}
                      title="Click para ver/ocultar el desglose de 5 dimensiones del Juez"
                    >
                      <span>{isMastery ? "🏆 100/100 Maestría" : `⚖️ Juez: ${score}/100`}</span>
                      <span className="judge-pill-arrow">{judgePanelOpen ? "▲" : "▼"}</span>
                    </button>
                  )}

                  {isTaskRunning && (
                    <button
                      type="button"
                      className="learning-thread-bubble__cancel-btn"
                      onClick={onCancelHarness}
                      title="Cancelar proceso en segundo plano"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>

              {/* Live Stage Stepper Bar */}
              <div className="learning-thread-stepper-bar" aria-label="Fases del proceso pedagógico">
                <div
                  className={`stepper-step ${
                    isTaskRunning && currentTask.stage === "generating_initial"
                      ? "is-active"
                      : masterclassText
                      ? "is-done"
                      : ""
                  }`}
                >
                  <span className="stepper-step__num">1</span>
                  <span className="stepper-step__label">Redacción Magistral</span>
                </div>
                <div className="stepper-divider" />
                <div
                  className={`stepper-step ${
                    isTaskRunning && currentTask.stage === "judging"
                      ? "is-active"
                      : score !== null
                      ? "is-done"
                      : ""
                  }`}
                >
                  <span className="stepper-step__num">2</span>
                  <span className="stepper-step__label">
                    {isTaskRunning && currentTask.stage === "judging"
                      ? "Auditoría del Juez (Evaluando...)"
                      : score !== null
                      ? `Juez Pedagógico (${score}/100)`
                      : "Auditoría del Juez"}
                  </span>
                </div>
                <div className="stepper-divider" />
                <div
                  className={`stepper-step ${
                    isMastery ? "is-done is-mastery" : isTaskRunning && currentTask.stage === "refining" ? "is-active" : ""
                  }`}
                >
                  <span className="stepper-step__num">3</span>
                  <span className="stepper-step__label">
                    {isTaskRunning && currentTask.stage === "refining"
                      ? `Refinamiento (Iter ${currentTask.iteration})`
                      : isMastery
                      ? "Maestría Aprobada"
                      : "Publicación"}
                  </span>
                </div>
              </div>

              {/* Inline Collapsible Judge Breakdown */}
              {judgePanelOpen && (score !== null || rubric !== null) && (
                <div className="learning-thread-inline-judge" aria-label="Desglose de evaluación del Juez">
                  <div className="inline-judge-header">
                    <strong>⚖️ Auditoría del Juez Pedagógico (5 Dimensiones):</strong>
                    <span className="inline-judge-total">Puntaje Final: <strong>{score}/100</strong></span>
                  </div>
                  {rubric && (
                    <div className="inline-judge-rubric-grid">
                      <div className="inline-rubric-item">
                        <span className="rubric-dim-title">🪝 Anclaje Didáctico</span>
                        <div className="rubric-dim-bar-wrap">
                          <div
                            className="rubric-dim-bar-fill"
                            style={{ width: `${Math.min(100, ((rubric.foundationalContext ?? 20) / 20) * 100)}%` }}
                          />
                        </div>
                        <span className="rubric-dim-score">{rubric.foundationalContext ?? 20}/20</span>
                      </div>
                      <div className="inline-rubric-item">
                        <span className="rubric-dim-title">🔭 Alcance y Foco</span>
                        <div className="rubric-dim-bar-wrap">
                          <div
                            className="rubric-dim-bar-fill"
                            style={{ width: `${Math.min(100, ((rubric.selfContainedScope ?? 20) / 20) * 100)}%` }}
                          />
                        </div>
                        <span className="rubric-dim-score">{rubric.selfContainedScope ?? 20}/20</span>
                      </div>
                      <div className="inline-rubric-item">
                        <span className="rubric-dim-title">⏳ Ritmo y Markdown</span>
                        <div className="rubric-dim-bar-wrap">
                          <div
                            className="rubric-dim-bar-fill"
                            style={{ width: `${Math.min(100, ((rubric.cognitivePacing ?? 20) / 20) * 100)}%` }}
                          />
                        </div>
                        <span className="rubric-dim-score">{rubric.cognitivePacing ?? 20}/20</span>
                      </div>
                      <div className="inline-rubric-item">
                        <span className="rubric-dim-title">⚖️ Causalidad Física</span>
                        <div className="rubric-dim-bar-wrap">
                          <div
                            className="rubric-dim-bar-fill"
                            style={{ width: `${Math.min(100, ((rubric.causalityAndTradeoffs ?? 20) / 20) * 100)}%` }}
                          />
                        </div>
                        <span className="rubric-dim-score">{rubric.causalityAndTradeoffs ?? 20}/20</span>
                      </div>
                      <div className="inline-rubric-item">
                        <span className="rubric-dim-title">🎯 Código y Socrática</span>
                        <div className="rubric-dim-bar-wrap">
                          <div
                            className="rubric-dim-bar-fill"
                            style={{ width: `${Math.min(100, ((rubric.applicationAndFailureModes ?? 20) / 20) * 100)}%` }}
                          />
                        </div>
                        <span className="rubric-dim-score">{rubric.applicationAndFailureModes ?? 20}/20</span>
                      </div>
                    </div>
                  )}
                  {Array.isArray(draftRecord?.harnessCritique) && draftRecord.harnessCritique.length > 0 && (
                    <div className="inline-judge-critique">
                      <strong>Observaciones del Juez:</strong>
                      <ul>
                        {draftRecord.harnessCritique.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Message Content */}
              {masterclassText ? (
                <div className="learning-thread-bubble__content coach-hint__markdown">
                  <ChatMarkdown text={masterclassText} />
                </div>
              ) : isTaskRunning ? (
                <div className="learning-thread-bubble__thinking">
                  <div className="learning-thread-spinner" aria-hidden="true" />
                  <span>{currentTask.message || "Preparando lección pedagógica de clase mundial..."}</span>
                </div>
              ) : null}
            </article>
          ) : (
            <div className="learning-thread-empty">
              <div className="learning-thread-empty__icon">🧠</div>
              <h3>Comenzá tu sesión de aprendizaje</h3>
              <p>
                El Mentor con IA redactará una <strong>Lección Magistral</strong> completa con analogías, mecánica interna y código estructurado en Markdown, auditada por el Juez Pedagógico.
              </p>
              <button
                type="button"
                className="learning-thread-start-btn"
                onClick={onStartHarness}
              >
                🪄 Iniciar Lección con el Mentor (100/100)
              </button>
            </div>
          )}

          {/* 2. Follow-up Socratic Messages Thread */}
          {threadMessages.map((msg) => (
            <article
              key={msg.id}
              className={`learning-thread-bubble learning-thread-bubble--${msg.role}`}
            >
              <div className="learning-thread-bubble__header">
                <div className="learning-thread-bubble__author">
                  <span className="learning-thread-bubble__avatar" aria-hidden="true">
                    {msg.role === "user" ? "👤" : "🧠"}
                  </span>
                  <div className="learning-thread-bubble__author-info">
                    <strong>{msg.role === "user" ? "Vos" : "Mentor Senior"}</strong>
                    {msg.role === "assistant" && <small>Respuesta Socrática</small>}
                  </div>
                </div>
              </div>

              <div className="learning-thread-bubble__content coach-hint__markdown">
                {msg.role === "user" ? (
                  <p>{msg.content}</p>
                ) : (
                  <ChatMarkdown text={msg.content} />
                )}
              </div>
            </article>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Turn-Taking Composer Bar */}
        <footer className="learning-thread-composer-wrap">
          {/* Quick suggestions when idle */}
          {!isTaskRunning && masterclassText && (
            <div className="learning-thread-chips" role="toolbar" aria-label="Sugerencias rápidas de preguntas">
              {quickPrompts.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="learning-thread-chip"
                  onClick={() => {
                    setInputText(chip);
                    textareaRef.current?.focus();
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Blocked / Refining Banner */}
          {isTaskRunning && (
            <div className="learning-thread-locked-banner" role="status">
              <div className="learning-thread-locked-banner__spinner" aria-hidden="true" />
              <div className="learning-thread-locked-banner__text">
                <strong>El Mentor está perfeccionando la explicación con el Juez Pedagógico.</strong>
                <span>El campo de respuesta se habilitará automáticamente al alcanzar la calidad óptima.</span>
              </div>
            </div>
          )}

          {/* Composer Form */}
          <form className={`learning-thread-composer ${isTaskRunning ? "is-disabled" : ""}`} onSubmit={handleSendMessage}>
            <div className="learning-thread-composer__input-box">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isTaskRunning}
                placeholder={
                  isTaskRunning
                    ? "Esperando que el mentor termine de pulir la explicación..."
                    : "Escribí tu duda, contale al mentor lo que entendiste o respondé a su pregunta de reflexión..."
                }
                rows={2}
                maxLength={4000}
                aria-label="Tu mensaje o respuesta para el Mentor"
              />

              <div className="learning-thread-composer__actions">
                <button
                  type="button"
                  className={`learning-thread-composer__voice-btn ${isListening ? "is-recording" : ""}`}
                  onClick={toggleSpeechRecognition}
                  disabled={isTaskRunning}
                  aria-label={isListening ? "Detener dictado por voz" : "Dictar con tu voz"}
                  title={isListening ? "Detener dictado" : "Dictar respuesta con tu voz"}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" fill="currentColor"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>

                <button
                  type="submit"
                  className="learning-thread-composer__send-btn"
                  disabled={isTaskRunning || !inputText.trim()}
                  aria-label="Enviar mensaje al mentor"
                  title="Enviar (Enter)"
                >
                  <span>Enviar</span>
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="learning-thread-composer__hint">
              <span>Enter para enviar · Shift+Enter para nueva línea</span>
              {onRequestEvaluate && (
                <button
                  type="button"
                  className="learning-thread-composer__eval-link"
                  onClick={onRequestEvaluate}
                >
                  ¿Listo para certificarte? Ir a Evaluación ➔
                </button>
              )}
            </div>
          </form>
        </footer>
      </div>
    </div>
  );
}
