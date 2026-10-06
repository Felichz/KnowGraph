import { useEffect, useId, useState } from "react";
import { CodeBlock } from "./CodeBlock.jsx";
import { Skeleton } from "./Feedback.jsx";
import { useT } from "../../i18n/react.js";
import { useTheme } from "../hooks/useTheme.js";

let loader;
const loadMermaid = () => (loader ??= import("mermaid").then(({ default: mermaid }) => mermaid));

// themeVariables from the active theme's tokens (DESIGN §1.6), so light and dark diagrams match the code blocks.
function themeConfig(theme) {
  const css = getComputedStyle(document.documentElement);
  const v = (name) => css.getPropertyValue(name).trim();
  return {
    startOnLoad: false, theme: "base", securityLevel: "strict",
    themeVariables: {
      darkMode: theme === "dark", background: v("--surface-inset"), primaryColor: v("--surface-2"), primaryTextColor: v("--text-1"),
      primaryBorderColor: v("--diagram-border"), lineColor: v("--text-3"), secondaryColor: v("--surface-1"), tertiaryColor: v("--bg-app"),
      fontFamily: "Figtree Variable, ui-sans-serif, system-ui", fontSize: "14px",
    },
    flowchart: { htmlLabels: true, curve: "basis" },
  };
}

// Diagrama Mermaid lazy con fallback al código fuente (design-spec E.3).
export function Mermaid({ chart }) {
  const t = useT();
  const id = `mmd-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const { theme } = useTheme();
  const [state, setState] = useState({ status: "loading", svg: "", chart });
  useEffect(() => {
    let alive = true;
    // A theme change re-renders in place (keeps the previous SVG); a new chart shows the skeleton.
    setState((prev) => (prev.chart === chart ? prev : { status: "loading", svg: "", chart }));
    loadMermaid()
      .then((mermaid) => { mermaid.initialize(themeConfig(theme)); return mermaid.render(id, chart); })
      .then(({ svg }) => { if (alive) setState({ status: "ready", svg, chart }); })
      .catch(() => { if (alive) setState({ status: "error", svg: "", chart }); });
    return () => { alive = false; };
  }, [chart, id, theme]);
  if (state.status === "error") {
    return (
      <div className="diagram diagram--fallback">
        <p className="diagram__note">{t("primitives.mermaid.error")}</p>
        <CodeBlock code={chart} language="markup" label={t("primitives.mermaid.sourceLabel")} />
      </div>
    );
  }
  if (state.status === "loading") {
    return (
      <div className="diagram diagram--loading" aria-busy="true">
        <Skeleton height={240} radius="var(--r-md)" />
        <span className="diagram__note">{t("primitives.mermaid.loading")}</span>
      </div>
    );
  }
  return <div className="diagram" dangerouslySetInnerHTML={{ __html: state.svg }} />;
}
