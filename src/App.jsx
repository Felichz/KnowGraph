import React from "react";
import "./styles/theme.css";

export default function App() {
  return (
    <div id="root" style={{ padding: "32px", color: "#f8fafc", background: "var(--bg-workspace)", minHeight: "100vh" }}>
      <header style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700 }}>⚡ Learning Workspace V2</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
          Clean slate ready for Spec-Driven Visual Design Workflow from scratch.
        </p>
      </header>
    </div>
  );
}
