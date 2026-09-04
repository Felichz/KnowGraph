import React, { useEffect, useId, useState } from "react";

let mermaidLoader = null;
function getMermaid() {
  if (!mermaidLoader) {
    mermaidLoader = import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "strict",
        themeVariables: {
          primaryColor: "#11151b",
          primaryTextColor: "#f3f5f7",
          primaryBorderColor: "#70ddd4",
          lineColor: "#727c89",
          secondaryColor: "#161b22",
          tertiaryColor: "#0c0f14",
        },
        flowchart: { htmlLabels: true, curve: "basis" },
      });
      return mermaid;
    });
  }
  return mermaidLoader;
}

export function MermaidChart({ chart = "" }) {
  const diagramId = `mermaid-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    if (!chart.trim()) return;

    getMermaid()
      .then((mermaid) => mermaid.render(diagramId, chart))
      .then(({ svg: rendered }) => {
        if (active) setSvg(rendered);
      })
      .catch(() => {
        if (active) setError(true);
      });

    return () => {
      active = false;
    };
  }, [chart, diagramId]);

  if (error) return null;

  return (
    <div
      className="mermaid-chart-container"
      style={{
        margin: "12px 0",
        padding: "16px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-line)",
        borderRadius: "var(--radius-panel)",
        overflowX: "auto",
        display: "flex",
        justifyContent: "center",
      }}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    >
      {!svg && <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Cargando diagrama…</span>}
    </div>
  );
}
