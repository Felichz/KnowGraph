import React, { useEffect, useRef } from "react";
import { REACT_DEEP_DIVES } from "../../reactDeepDives.js";

export function DeepDivePopover({ diveId = null, position = null, onClose = null }) {
  const popoverRef = useRef(null);
  const dive = diveId ? REACT_DEEP_DIVES[diveId] : null;

  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose?.();
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!dive || !position) return null;

  return (
    <div
      ref={popoverRef}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        transform: "translateX(-50%)",
        width: "360px",
        maxWidth: "90vw",
        maxHeight: "380px",
        overflowY: "auto",
        background: "var(--bg-surface)",
        border: "1px solid var(--accent-cyan)",
        borderRadius: "var(--radius-panel)",
        boxShadow: "0 16px 36px rgba(0, 0, 0, 0.6)",
        padding: "16px",
        zIndex: 10000,
        color: "var(--text-primary)",
        fontSize: "13px",
      }}
      role="dialog"
      aria-label={dive.title}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--accent-cyan)", letterSpacing: "0.08em" }}>
            DEEP DIVE DE BAJO NIVEL
          </span>
          <h4 style={{ margin: "2px 0 0", fontSize: "14px", fontWeight: 700 }}>{dive.title}</h4>
        </div>
        <button type="button" onClick={onClose} style={{ fontSize: "16px", color: "var(--text-muted)", padding: "2px 6px" }}>×</button>
      </div>

      <p style={{ margin: "6px 0 10px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
        {dive.inDepth || dive.why}
      </p>

      {dive.pitfall && (
        <div style={{ padding: "8px 10px", background: "rgba(239, 118, 104, 0.1)", borderRadius: "6px", borderLeft: "2px solid var(--accent-red)", fontSize: "12px", color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--accent-red)" }}>Atención: </strong>{dive.pitfall}
        </div>
      )}
    </div>
  );
}
