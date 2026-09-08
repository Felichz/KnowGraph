import React, { useState } from "react";
import { useSpeechRecognition } from "../../../hooks/useSpeechRecognition.js";
import { StudyStageChunks } from "./StudyStageChunks.jsx";

export function StudyStageParaphrase({
  node,
  draft = "",
  onChangeDraft,
  onEvaluate,
}) {
  const [viewMode, setViewMode] = useState("editor");
  const { isListening, isSupported, toggleListening } = useSpeechRecognition();

  const charCount = draft.length;
  const isShort = charCount < 140;

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onEvaluate?.();
    }
  };

  const handleDictation = () => {
    toggleListening((transcript) => {
      const updated = draft ? `${draft} ${transcript}` : transcript;
      onChangeDraft?.(updated);
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>Consigna de parafraseo senior:</h4>
          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Explicá el mecanismo interno, fallos en escala y trade-offs con tus palabras.</span>
        </div>

        <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: "6px", padding: "2px", border: "1px solid var(--border-line-subtle)" }}>
          <button onClick={() => setViewMode("editor")} style={{ padding: "4px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: 500, background: viewMode === "editor" ? "rgba(255, 255, 255, 0.1)" : "transparent", color: viewMode === "editor" ? "var(--text-primary)" : "var(--text-muted)" }}>
            ✏️ Editor
          </button>
          <button onClick={() => setViewMode("chunks")} style={{ padding: "4px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: 500, background: viewMode === "chunks" ? "rgba(255, 255, 255, 0.1)" : "transparent", color: viewMode === "chunks" ? "var(--text-primary)" : "var(--text-muted)" }}>
            📖 Chunks
          </button>
        </div>
      </div>

      {viewMode === "editor" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
          <textarea
            value={draft} onChange={(e) => onChangeDraft?.(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Escribí tu explicación técnica acá. Podés incluir código o razonamiento de trade-offs..."
            rows={10}
            style={{ width: "100%", flex: 1, minHeight: "220px", padding: "14px", borderRadius: "8px", background: "rgba(13, 17, 24, 0.95)", border: "1px solid var(--border-line)", color: "var(--text-primary)", fontSize: "14px", lineHeight: 1.6, resize: "vertical", outline: "none" }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {isSupported && (
                <button type="button" onClick={handleDictation} style={{
                  display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "6px", fontSize: "12px",
                  background: isListening ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.06)", color: isListening ? "#F87171" : "var(--text-secondary)", border: isListening ? "1px solid #F87171" : "1px solid var(--border-line)", cursor: "pointer",
                }}>
                  <span>{isListening ? "⏹️ Detener dictado" : "🎙️ Dictado por voz"}</span>
                </button>
              )}
              <span style={{ fontSize: "12px", color: isShort ? "var(--accent-gold)" : "var(--text-muted)", fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>
                {charCount} caracteres {isShort && <span style={{ marginLeft: "6px", opacity: 0.8 }}>(demasiado corta para medir profundidad)</span>}
              </span>
            </div>

            <button onClick={onEvaluate} style={{
              padding: "8px 18px", borderRadius: "6px", background: "var(--color-brand-primary, #5EEAD4)", color: "#0B0D13", fontWeight: 700, fontSize: "13px", boxShadow: "0 2px 8px rgba(94, 234, 212, 0.25)", cursor: "pointer",
            }}>
              Evaluar con IA (Ctrl+Enter)
            </button>
          </div>
        </div>
      ) : (
        <StudyStageChunks text={draft} />
      )}
    </div>
  );
}
