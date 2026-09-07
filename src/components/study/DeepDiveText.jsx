import React from "react";
import { findDeepDiveMatches } from "../../reactDeepDives.js";

export function DeepDiveText({ text = "", nodeId = "", onOpenDeepDive = null }) {
  if (!text || typeof text !== "string") return text;
  const matches = findDeepDiveMatches(text, nodeId, 3);
  if (!matches || matches.length === 0) return text;

  const parts = [];
  let cursor = 0;

  matches.forEach((match, idx) => {
    if (match.start > cursor) {
      parts.push(text.slice(cursor, match.start));
    }

    parts.push(
      <span key={`${match.id}-${idx}`} style={{ display: "inline-flex", alignItems: "baseline", gap: "2px" }}>
        <span>{match.text}</span>
        <button
          type="button"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            onOpenDeepDive?.(match.id, {
              top: rect.bottom + window.scrollY + 8,
              left: rect.left + rect.width / 2,
            });
          }}
          title="Ver explicación técnica de bajo nivel"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: "rgba(112, 221, 212, 0.15)",
            color: "var(--accent-cyan)",
            fontSize: "10px",
            fontWeight: 700,
            cursor: "pointer",
            border: "1px solid var(--accent-cyan)",
            padding: 0,
            lineHeight: 1,
          }}
        >
          ?
        </button>
      </span>
    );
    cursor = match.end;
  });

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return <>{parts}</>;
}
