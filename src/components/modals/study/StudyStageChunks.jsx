import React from "react";
import { useReadingChunks } from "../../../hooks/useReadingChunks.js";

export function StudyStageChunks({ text = "" }) {
  const { chunks, stats, getChunkClass, hoverChunk, clearHover } = useReadingChunks(text);

  if (!chunks.length) {
    return (
      <div
        style={{
          padding: "40px 20px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "13px",
          background: "rgba(255,255,255,0.02)",
          borderRadius: "8px",
          border: "1px dashed var(--border-line)",
        }}
      >
        Escribí tu respuesta en el editor para descomponerla en chunks cognitivos.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Metrics Header */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          padding: "8px 12px",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "6px",
          border: "1px solid var(--border-line-subtle)",
          fontSize: "12px",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-mono)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span>Chunks: <strong>{stats.totalChunks}</strong></span>
        <span>Palabras: <strong>{stats.totalWords}</strong></span>
        <span>Promedio: <strong>{stats.avgWordsPerChunk} p/chunk</strong></span>
      </div>

      {/* Chunks List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {chunks.map((chunk, index) => (
          <div
            key={index}
            className={getChunkClass(index)}
            onMouseEnter={() => hoverChunk(index)}
            onMouseLeave={clearHover}
            style={{
              padding: "12px 14px",
              borderRadius: "8px",
              background: index % 2 === 0 ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border-line-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--accent-cyan)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Chunk {index + 1}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {chunk.split(/\s+/).filter(Boolean).length} palabras
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "13.5px", lineHeight: 1.5, color: "var(--text-primary)" }}>
              {chunk}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
