import React, { useState } from "react";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition.js";

export function ParaphraseStage({ draft = "", onUpdateDraft, onEvaluate, isEvaluating = false, node }) {
  const { isListening, isSupported, toggleListening } = useSpeechRecognition();
  const [viewMode, setViewMode] = useState("editor");
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
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", color: "var(--text-primary)" }}>
      {/* Consigna */}
      <div style={{ padding: "14px 18px", background: "rgba(56, 189, 248, 0.05)", border: "1px solid rgba(56, 189, 248, 0.25)", borderLeft: "3px solid var(--accent-cyan)", borderRadius: "var(--radius-panel)", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)" }}>
        <strong style={{ fontSize: "12px", color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "6px" }}>
          💡 Consigna de parafraseo senior:
        </strong>
        <p style={{ margin: "5px 0 0", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.55 }}>
          Explicá <strong>{node?.label}</strong> con tus palabras como en una entrevista técnica. Podés tipear o dictar por voz.
        </p>
      </div>

      {/* Barra de herramientas */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "3px", background: "rgba(0, 0, 0, 0.4)", padding: "3px", borderRadius: "8px", border: "1px solid var(--border-line)" }}>
          <button type="button" onClick={() => setViewMode("editor")} style={{ padding: "5px 12px", fontSize: "11.5px", borderRadius: "6px", border: "none", cursor: "pointer", background: viewMode === "editor" ? "rgba(255, 255, 255, 0.12)" : "transparent", color: viewMode === "editor" ? "var(--accent-cyan)" : "var(--text-secondary)", fontWeight: viewMode === "editor" ? 700 : 500 }}>✏️ Editor</button>
          <button type="button" onClick={() => setViewMode("chunks")} style={{ padding: "5px 12px", fontSize: "11.5px", borderRadius: "6px", border: "none", cursor: "pointer", background: viewMode === "chunks" ? "rgba(255, 255, 255, 0.12)" : "transparent", color: viewMode === "chunks" ? "var(--accent-cyan)" : "var(--text-secondary)", fontWeight: viewMode === "chunks" ? 700 : 500 }}>📖 Chunks ({chunks.length})</button>
        </div>

        {isSupported && (
          <button
            type="button" onClick={() => toggleListening(handleTranscript)}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "var(--radius-control)", fontSize: "11.5px", fontWeight: 600, background: isListening ? "rgba(244, 63, 94, 0.18)" : "rgba(255, 255, 255, 0.04)", color: isListening ? "var(--accent-red)" : "var(--text-secondary)", border: `1px solid ${isListening ? "var(--accent-red)" : "var(--border-line)"}`, boxShadow: isListening ? "0 0 16px rgba(244, 63, 94, 0.35)" : "none", cursor: "pointer" }}
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
          style={{ width: "100%", padding: "16px", background: "rgba(9, 13, 23, 0.85)", border: `1px solid ${isListening ? "var(--accent-red)" : "rgba(255, 255, 255, 0.12)"}`, borderRadius: "var(--radius-panel)", color: "var(--text-primary)", fontSize: "14px", lineHeight: 1.65, outline: "none", boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.45)", resize: "vertical", transition: "border-color 0.2s, box-shadow 0.2s" }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "260px", overflowY: "auto", padding: "12px", background: "rgba(9, 13, 23, 0.85)", borderRadius: "var(--radius-panel)", border: "1px solid var(--border-line)" }}>
          {chunks.length === 0 ? <p style={{ fontSize: "12.5px", color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>Escribí texto en el editor para analizar los chunks.</p> : chunks.map((chunk, idx) => (
            <div key={idx} style={{ padding: "12px 16px", background: "rgba(20, 27, 44, 0.65)", borderRadius: "8px", fontSize: "13px", lineHeight: 1.55, borderLeft: "3px solid var(--accent-cyan)", border: "1px solid var(--border-line)" }}>
              <span style={{ fontSize: "10.5px", color: "var(--text-muted)", display: "block", marginBottom: "4px", fontFamily: "var(--font-mono)" }}>Chunk {idx + 1} ({chunk.split(/\s+/).length} palabras)</span>
              {chunk}
            </div>
          ))}
        </div>
      )}

      {/* Métricas y guardado */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11.5px", color: "var(--text-muted)" }}>
        <span style={{ fontFamily: "var(--font-mono)" }}>
          {charCount} caracteres · {wordCount} palabras {!hasEnoughText && <span style={{ color: "var(--accent-gold)" }}>(un poco corta)</span>}
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--accent-green)", fontWeight: 500 }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-green)", boxShadow: "0 0 8px var(--accent-green)" }} />
          Guardado local
        </span>
      </div>

      {/* Botón de evaluación */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid var(--border-line)" }}>
        <small style={{ color: "var(--text-muted)", fontSize: "11px", fontFamily: "var(--font-mono)" }}>Tip: Ctrl+Enter para evaluar</small>
        <button
          type="button" onClick={onEvaluate} disabled={!draft.trim() || isEvaluating}
          style={{
            padding: "10px 22px",
            background: hasEnoughText ? "linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-indigo) 100%)" : "rgba(255, 255, 255, 0.05)",
            color: hasEnoughText ? "#ffffff" : "var(--text-muted)",
            border: `1px solid ${hasEnoughText ? "rgba(255, 255, 255, 0.25)" : "var(--border-line)"}`,
            borderRadius: "var(--radius-control)",
            fontSize: "12.5px",
            fontWeight: 700,
            cursor: !draft.trim() || isEvaluating ? "not-allowed" : "pointer",
            boxShadow: hasEnoughText ? "0 0 20px rgba(56, 189, 248, 0.3)" : "none",
            transition: "all var(--transition-fast)",
          }}
        >
          {isEvaluating ? "🧠 Evaluando con IA…" : "04 Evaluar con IA →"}
        </button>
      </div>
    </div>
  );
}
