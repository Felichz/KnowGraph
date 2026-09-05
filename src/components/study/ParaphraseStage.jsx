import React, { useState } from "react";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition.js";

export function ParaphraseStage({ draft = "", onUpdateDraft, onEvaluate, isEvaluating = false, node }) {
  const { isListening, isSupported, toggleListening } = useSpeechRecognition();
  const [viewMode, setViewMode] = useState("editor"); // "editor" | "chunks"
  const charCount = draft.length;
  const minRecommended = 140;
  const hasEnoughText = charCount >= minRecommended;

  const handleTranscript = (transcript) => {
    const next = draft ? `${draft.trim()} ${transcript}` : transcript;
    onUpdateDraft?.(next);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      if (draft.trim() && !isEvaluating) {
        e.preventDefault();
        onEvaluate?.();
      }
    }
  };

  const chunks = draft.split(/\n\s*\n/).map((c) => c.trim()).filter(Boolean);
  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", color: "var(--text-primary)" }}>
      {/* Consigna */}
      <div style={{ padding: "12px 16px", background: "rgba(94, 234, 212, 0.04)", border: "1px solid var(--border-accent)", borderLeft: "3px solid var(--accent-cyan)", borderRadius: "var(--radius-panel)" }}>
        <strong style={{ fontSize: "12px", color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "6px" }}>
          💡 Consigna de parafraseo senior:
        </strong>
        <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          Explicá <strong>{node?.label}</strong> con tus palabras como en una entrevista técnica. Podés tipear o dictar por voz.
        </p>
      </div>

      {/* Barra de herramientas */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "4px", background: "rgba(10, 13, 18, 0.7)", padding: "3px", borderRadius: "var(--radius-control)", border: "1px solid var(--border-line)" }}>
          <button type="button" onClick={() => setViewMode("editor")} style={{ padding: "4px 10px", fontSize: "11px", borderRadius: "6px", border: viewMode === "editor" ? "1px solid var(--border-accent)" : "1px solid transparent", cursor: "pointer", background: viewMode === "editor" ? "rgba(94, 234, 212, 0.14)" : "transparent", color: viewMode === "editor" ? "var(--accent-cyan)" : "var(--text-muted)", fontWeight: viewMode === "editor" ? 700 : 500 }}>✏️ Editor</button>
          <button type="button" onClick={() => setViewMode("chunks")} style={{ padding: "4px 10px", fontSize: "11px", borderRadius: "6px", border: viewMode === "chunks" ? "1px solid var(--border-accent)" : "1px solid transparent", cursor: "pointer", background: viewMode === "chunks" ? "rgba(94, 234, 212, 0.14)" : "transparent", color: viewMode === "chunks" ? "var(--accent-cyan)" : "var(--text-muted)", fontWeight: viewMode === "chunks" ? 700 : 500 }}>📖 Chunks ({chunks.length})</button>
        </div>

        {isSupported && (
          <button
            type="button" onClick={() => toggleListening(handleTranscript)}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 12px", borderRadius: "var(--radius-control)", fontSize: "11px", fontWeight: 600, background: isListening ? "rgba(248, 113, 113, 0.18)" : "var(--bg-surface-raised)", color: isListening ? "var(--accent-red)" : "var(--text-secondary)", border: `1px solid ${isListening ? "var(--accent-red)" : "var(--border-line-strong)"}`, boxShadow: isListening ? "0 0 16px rgba(248, 113, 113, 0.35)" : "none" }}
          >
            <span>{isListening ? "🔴 Grabando voz..." : "🎙️ Dictar por voz"}</span>
          </button>
        )}
      </div>

      {/* Editor o Vista por Chunks */}
      {viewMode === "editor" ? (
        <textarea
          value={draft} onChange={(e) => onUpdateDraft?.(e.target.value)} onKeyDown={handleKeyDown}
          placeholder="Escribí o dictá acá tu explicación técnica… (Ctrl+Enter para evaluar)" rows={9}
          style={{ width: "100%", padding: "14px", background: "rgba(10, 13, 18, 0.75)", border: `1px solid ${isListening ? "var(--accent-red)" : "var(--border-line-strong)"}`, borderRadius: "var(--radius-panel)", color: "var(--text-primary)", fontSize: "13.5px", lineHeight: 1.6, outline: "none", boxShadow: "inset 0 2px 6px rgba(0, 0, 0, 0.35)", resize: "vertical" }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "240px", overflowY: "auto", padding: "10px", background: "rgba(10, 13, 18, 0.75)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line-strong)" }}>
          {chunks.length === 0 ? <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>Escribí texto en el editor para analizar los chunks.</p> : chunks.map((chunk, idx) => (
            <div key={idx} style={{ padding: "10px 14px", background: "var(--bg-surface-raised)", borderRadius: "8px", fontSize: "12.5px", lineHeight: 1.5, borderLeft: "3px solid var(--accent-cyan)", border: "1px solid var(--border-line)" }}>
              <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "3px", fontFamily: "var(--font-mono)" }}>Chunk {idx + 1} ({chunk.split(/\s+/).length} palabras)</span>
              {chunk}
            </div>
          ))}
        </div>
      )}

      {/* Métricas y guardado */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--text-muted)" }}>
        <span style={{ fontFamily: "var(--font-mono)" }}>
          {charCount} caracteres · {wordCount} palabras {!hasEnoughText && <span style={{ color: "var(--accent-gold)" }}>(un poco corta)</span>}
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "var(--accent-green)", fontWeight: 500 }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-green)" }} />
          Guardado local
        </span>
      </div>

      {/* Botón de evaluación */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--border-line)" }}>
        <small style={{ color: "var(--text-muted)", fontSize: "11px", fontFamily: "var(--font-mono)" }}>Tip: Ctrl+Enter para evaluar</small>
        <button
          type="button" onClick={onEvaluate} disabled={!draft.trim() || isEvaluating}
          style={{
            padding: "9px 20px",
            background: hasEnoughText ? "linear-gradient(135deg, var(--accent-cyan), #38bdf8)" : "var(--bg-surface-emphasis)",
            color: hasEnoughText ? "#08090d" : "var(--accent-cyan)",
            border: "1px solid var(--border-accent)",
            borderRadius: "var(--radius-control)",
            fontSize: "12px",
            fontWeight: 700,
            cursor: !draft.trim() || isEvaluating ? "not-allowed" : "pointer",
            boxShadow: hasEnoughText ? "0 0 16px rgba(94, 234, 212, 0.3)" : "none",
          }}
        >
          {isEvaluating ? "🧠 Evaluando con IA…" : "04 Evaluar con IA →"}
        </button>
      </div>
    </div>
  );
}
