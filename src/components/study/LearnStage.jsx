import React, { useEffect, useRef, useState } from "react";
import { coachChatStream, isCancel } from "../../ai/client.js";

const QUICK_PROMPTS = [
  "¿Por qué falla el enfoque ingenuo?",
  "¿Podrías explicarlo con una analogía?",
  "¿Cómo diagnostico este error en producción?",
  "Tengo una duda con el código...",
];

export function LearnStage({ node, onGoToParaphrase }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamDelta, setStreamDelta] = useState("");
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
        node,
        message: cleanText,
        history: updatedMessages,
        signal: controller.signal,
        onChunk: (delta) => {
          accumulated += delta;
          setStreamDelta(accumulated);
        },
      });
      setMessages((prev) => [...prev, { role: "assistant", content: accumulated }]);
    } catch (err) {
      if (!isCancel(err)) {
        setMessages((prev) => [...prev, { role: "assistant", content: "Error al consultar al tutor: " + (err.message || "Problema de red") }]);
      }
    } finally {
      setStreaming(false);
      setStreamDelta("");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "480px", background: "var(--bg-surface)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line)", overflow: "hidden" }}>
      {/* Header bar con acción de reconciliar */}
      {messages.length > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderBottom: "1px solid var(--border-line)", background: "var(--bg-surface-raised)" }}>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{messages.length} mensajes intercambiados</span>
          <button type="button" onClick={onGoToParaphrase} style={{ fontSize: "11px", color: "var(--accent-cyan)", background: "transparent", border: "none", cursor: "pointer", fontWeight: 600 }}>
            03 Redactar mi respuesta con estas ideas →
          </button>
        </div>
      )}

      {/* Mensajes */}
      <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px 10px" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 6px" }}>Espacio Socrático con el Tutor</p>
            <p style={{ fontSize: "12px", maxWidth: "420px", margin: "0 auto 16px" }}>
              Preguntale sobre trade-offs en producción o elegí una consulta rápida:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
              {QUICK_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => sendQuery(p)}
                  style={{ padding: "6px 12px", borderRadius: "16px", background: "var(--bg-surface-raised)", border: "1px solid var(--border-line)", fontSize: "12px", color: "var(--accent-cyan)", cursor: "pointer" }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "80%", padding: "10px 14px", borderRadius: "10px", background: m.role === "user" ? "var(--bg-surface-emphasis)" : "var(--bg-surface-raised)", color: m.role === "user" ? "var(--accent-cyan)" : "var(--text-primary)", fontSize: "13px", lineHeight: 1.5, border: `1px solid ${m.role === "user" ? "var(--accent-cyan)" : "var(--border-line)"}`, whiteSpace: "pre-line" }}>
            {m.content}
          </div>
        ))}

        {streaming && streamDelta && (
          <div style={{ alignSelf: "flex-start", maxWidth: "80%", padding: "10px 14px", borderRadius: "10px", background: "var(--bg-surface-raised)", color: "var(--text-primary)", fontSize: "13px", lineHeight: 1.5, border: "1px solid var(--border-line)", whiteSpace: "pre-line" }}>
            {streamDelta}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input box */}
      <form onSubmit={(e) => { e.preventDefault(); sendQuery(); }} style={{ display: "flex", gap: "8px", padding: "12px", borderTop: "1px solid var(--border-line)", background: "var(--bg-workspace)" }}>
        <input
          type="text" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Preguntale al tutor sobre este concepto…" disabled={streaming}
          style={{ flex: 1, padding: "8px 12px", background: "var(--bg-surface)", border: "1px solid var(--border-line)", borderRadius: "var(--radius-control)", color: "var(--text-primary)", fontSize: "13px", outline: "none" }}
        />
        <button type="submit" disabled={streaming || !input.trim()} style={{ padding: "8px 16px", background: "var(--bg-surface-emphasis)", border: "1px solid var(--accent-cyan)", borderRadius: "var(--radius-control)", color: "var(--accent-cyan)", fontSize: "13px", fontWeight: 600, cursor: streaming ? "not-allowed" : "pointer" }}>
          {streaming ? "Escribiendo…" : "Preguntar"}
        </button>
      </form>
    </div>
  );
}
