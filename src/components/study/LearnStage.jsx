import React, { useEffect, useRef, useState } from "react";
import { coachChatStream, reconcileParaphraseStream, isCancel } from "../../ai/client.js";
import { LearnQuickPrompts } from "./LearnQuickPrompts.jsx";

export function LearnStage({ node, draft = "", onUpdateDraft, onGoToParaphrase }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamDelta, setStreamDelta] = useState("");
  const [reconciling, setReconciling] = useState(false);
  const abortRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamDelta]);

  const sendQuery = async (queryText) => {
    const cleanText = (queryText ?? input).trim();
    if (!cleanText || streaming) return;
    setInput("");
    const newMsg = { role: "user", content: cleanText };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setStreaming(true);
    setStreamDelta("");
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      let accumulated = "";
      await coachChatStream({
        node, message: cleanText, history: updatedMessages, signal: controller.signal,
        onChunk: (delta) => { accumulated += delta; setStreamDelta(accumulated); },
      });
      setMessages((prev) => [...prev, { role: "assistant", content: accumulated }]);
    } catch (err) {
      if (!isCancel(err)) setMessages((prev) => [...prev, { role: "assistant", content: "Error al consultar al tutor: " + (err.message || "Problema de red") }]);
    } finally {
      setStreaming(false);
      setStreamDelta("");
    }
  };

  const handleReconcile = async () => {
    if (messages.length === 0 || reconciling) return;
    setReconciling(true);
    const controller = new AbortController();
    try {
      const result = await reconcileParaphraseStream({ node, currentDraft: draft, messages, signal: controller.signal });
      if (result?.text) {
        onUpdateDraft?.(result.text);
        onGoToParaphrase?.();
      }
    } catch (err) {
      if (!isCancel(err)) alert("No se pudo sintetizar el borrador: " + (err.message || "Error desconocido"));
    } finally {
      setReconciling(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "480px", background: "var(--bg-surface)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line-strong)", boxShadow: "var(--shadow-card)", overflow: "hidden" }}>
      {/* Header bar con acción de reconciliar */}
      {messages.length > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid var(--border-line)", background: "rgba(26, 32, 46, 0.6)" }}>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            ⚡ {messages.length} {messages.length === 1 ? "mensaje" : "mensajes"} en sesión
          </span>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              type="button" onClick={handleReconcile} disabled={reconciling}
              style={{
                padding: "4px 12px", fontSize: "11px", fontWeight: 600, borderRadius: "var(--radius-control)",
                background: "linear-gradient(135deg, rgba(94, 234, 212, 0.18), rgba(96, 165, 250, 0.12))",
                border: "1px solid var(--border-accent)", color: "var(--accent-cyan)", cursor: reconciling ? "wait" : "pointer",
              }}
            >
              {reconciling ? "✨ Sintetizando ideas…" : "✨ Integrar chat a mi respuesta"}
            </button>
            <button
              type="button" onClick={onGoToParaphrase}
              style={{ fontSize: "11px", color: "var(--text-secondary)", background: "transparent", border: "none", cursor: "pointer" }}
            >
              Ir a borrador →
            </button>
          </div>
        </div>
      )}

      {/* Mensajes */}
      <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.length === 0 && <LearnQuickPrompts onSelectPrompt={sendQuery} />}
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "82%", padding: "10px 14px",
            borderRadius: m.role === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
            background: m.role === "user" ? "linear-gradient(135deg, rgba(94, 234, 212, 0.14), rgba(96, 165, 250, 0.08))" : "var(--bg-surface-raised)",
            color: "var(--text-primary)", fontSize: "13px", lineHeight: 1.55,
            border: `1px solid ${m.role === "user" ? "rgba(94, 234, 212, 0.35)" : "var(--border-line)"}`,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)", whiteSpace: "pre-line",
          }}>
            {m.content}
          </div>
        ))}
        {streaming && streamDelta && (
          <div style={{
            alignSelf: "flex-start", maxWidth: "82%", padding: "10px 14px", borderRadius: "14px 14px 14px 3px",
            background: "var(--bg-surface-raised)", color: "var(--text-primary)", fontSize: "13px", lineHeight: 1.55,
            border: "1px solid var(--border-accent)", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)", whiteSpace: "pre-line",
          }}>
            {streamDelta}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input box */}
      <form onSubmit={(e) => { e.preventDefault(); sendQuery(); }} style={{ display: "flex", gap: "8px", padding: "12px 14px", borderTop: "1px solid var(--border-line)", background: "rgba(10, 13, 18, 0.6)" }}>
        <input
          type="text" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Preguntale al tutor sobre este concepto…" disabled={streaming}
          style={{ flex: 1, padding: "9px 14px", background: "var(--bg-surface)", border: "1px solid var(--border-line-strong)", borderRadius: "var(--radius-control)", color: "var(--text-primary)", fontSize: "13px", outline: "none" }}
        />
        <button
          type="submit" disabled={streaming || !input.trim()}
          style={{
            padding: "9px 18px",
            background: !streaming && input.trim() ? "linear-gradient(135deg, var(--accent-cyan), #38bdf8)" : "var(--bg-surface-emphasis)",
            border: "1px solid var(--border-accent)", borderRadius: "var(--radius-control)",
            color: !streaming && input.trim() ? "#08090d" : "var(--text-muted)", fontSize: "13px", fontWeight: 700,
            cursor: streaming || !input.trim() ? "not-allowed" : "pointer",
            boxShadow: !streaming && input.trim() ? "0 0 12px rgba(94, 234, 212, 0.3)" : "none",
          }}
        >
          {streaming ? "Escribiendo…" : "Preguntar"}
        </button>
      </form>
    </div>
  );
}
