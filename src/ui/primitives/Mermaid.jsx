import { useEffect, useId, useState } from "react";
import { CodeBlock } from "./CodeBlock.jsx";
import { Skeleton } from "./Feedback.jsx";

let loader;
function loadMermaid() {
  if (!loader) {
    loader = import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false, theme: "base", securityLevel: "strict",
        themeVariables: {
          darkMode: true, background: "#070604", primaryColor: "#1D1B19", primaryTextColor: "#EEECE7",
          primaryBorderColor: "#474440", lineColor: "#938F87", secondaryColor: "#161512", tertiaryColor: "#100E0C",
          fontFamily: "Geist Variable, ui-sans-serif, system-ui", fontSize: "14px",
        },
        flowchart: { htmlLabels: true, curve: "basis" },
      });
      return mermaid;
    });
  }
  return loader;
}

// Diagrama Mermaid lazy con fallback al código fuente (design-spec E.3).
export function Mermaid({ chart }) {
  const id = `mmd-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [state, setState] = useState({ status: "loading", svg: "" });
  useEffect(() => {
    let alive = true;
    setState({ status: "loading", svg: "" });
    loadMermaid()
      .then((mermaid) => mermaid.render(id, chart))
      .then(({ svg }) => { if (alive) setState({ status: "ready", svg }); })
      .catch(() => { if (alive) setState({ status: "error", svg: "" }); });
    return () => { alive = false; };
  }, [chart, id]);
  if (state.status === "error") {
    return (
      <div className="diagram diagram--fallback">
        <p className="diagram__note">No se pudo dibujar el diagrama; este es su texto.</p>
        <CodeBlock code={chart} language="markup" label="Diagrama (Mermaid)" />
      </div>
    );
  }
  if (state.status === "loading") {
    return (
      <div className="diagram diagram--loading" aria-busy="true">
        <Skeleton height={240} radius="var(--r-md)" />
        <span className="diagram__note">Preparando diagrama…</span>
      </div>
    );
  }
  return <div className="diagram" dangerouslySetInnerHTML={{ __html: state.svg }} />;
}
