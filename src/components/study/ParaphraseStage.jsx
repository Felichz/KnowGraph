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
      <div style={{ padding: "10px 14px", background: "var(--bg-surface)", borderLeft: "3px solid var(--accent-cyan)", borderRadius: "var(--radius-control)" }}>
        <strong style={{ fontSize: "12px", color: "var(--accent-cyan)" }}>Consigna de parafraseo senior:</strong>
        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
          Explicá <strong>{node?.label}</strong> con tus palabras como en una entrevista técnica. Podés tipear o dictar por voz.
        </p>
      </div>

      {/* Barra de herramientas */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "4px", background: "var(--bg-canvas)", padding: "2px", borderRadius: "4px" }}>
          <button type="button" onClick={() => setViewMode("editor")} style={{ padding: "3px 8px", fontSize: "11px", borderRadius: "4px", border: "none", cursor: "pointer", background: viewMode === "editor" ? "var(--bg-surface-raised)" : "transparent", color: viewMode === "editor" ? "var(--accent-cyan)" : "var(--text-muted)", fontWeight: viewMode === "editor" ? 700 : 500 }}>✏️ Editor</button>
          <button type="button" onClick={() => setViewMode("chunks")} style={{ padding: "3px 8px", fontSize: "11px", borderRadius: "4px", border: "none", cursor: "pointer", background: viewMode === "chunks" ? "var(--bg-surface-raised)" : "transparent", color: viewMode === "chunks" ? "var(--accent-cyan)" : "var(--text-muted)", fontWeight: viewMode === "chunks" ? 700 : 500 }}>📖 Chunks ({chunks.length})</button>
        </div>

        {isSupported && (
          <button
            type="button" onClick={() => toggleListening(handleTranscript)}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "var(--radius-control)", fontSize: "11px", fontWeight: 600, background: isListening ? "rgba(239, 118, 104, 0.15)" : "var(--bg-surface-raised)", color: isListening ? "var(--accent-red)" : "var(--text-secondary)", border: `1px solid ${isListening ? "var(--accent-red)" : "var(--border-line)"}` }}
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
          style={{ width: "100%", padding: "12px", background: "var(--bg-canvas)", border: `1px solid ${isListening ? "var(--accent-red)" : "var(--border-line)"}`, borderRadius: "var(--radius-control)", color: "var(--text-primary)", fontSize: "13px", lineHeight: 1.6, outline: "none" }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "240px", overflowY: "auto", padding: "8px", background: "var(--bg-canvas)", borderRadius: "var(--radius-control)", border: "1px solid var(--border-line)" }}>
          {chunks.length === 0 ? <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>Escribí texto en el editor para analizar los chunks.</p> : chunks.map((chunk, idx) => (
            <div key={idx} style={{ padding: "8px 12px", background: "var(--bg-surface)", borderRadius: "4px", fontSize: "12px", lineHeight: 1.5, borderLeft: "2px solid var(--accent-cyan)" }}>
              <span style={{ fontSize: "10px", color: "var(--text-muted)", display: "block" }}>Chunk {idx + 1} ({chunk.split(/\s+/).length} palabras)</span>
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
        <span style={{ color: "var(--accent-green)" }}>✓ Guardado local</span>
      </div>

      {/* Botón de evaluación */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--border-line)" }}>
        <small style={{ color: "var(--text-muted)", fontSize: "11px" }}>Tip: Ctrl+Enter para evaluar</small>
        <button
          type="button" onClick={onEvaluate} disabled={!draft.trim() || isEvaluating}
          style={{ padding: "8px 16px", background: hasEnoughText ? "var(--accent-cyan)" : "var(--bg-surface-emphasis)", color: hasEnoughText ? "var(--bg-workspace)" : "var(--accent-cyan)", border: "1px solid var(--accent-cyan)", borderRadius: "var(--radius-control)", fontSize: "12px", fontWeight: 700, cursor: !draft.trim() || isEvaluating ? "not-allowed" : "pointer" }}
        >
          {isEvaluating ? "🧠 Evaluando con IA…" : "04 Evaluar con IA →"}
        </button>
      </div>
    </div>
  );
}
