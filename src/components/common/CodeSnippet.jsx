import React, { useMemo, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-ruby.js";
import "prismjs/components/prism-bash.js";

const LANG_MAP = {
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  rb: "ruby",
  ruby: "ruby",
  sh: "bash",
  bash: "bash",
};

export function CodeSnippet({ code = "", language = "javascript", narration = null, label = "" }) {
  const [copied, setCopied] = useState(false);
  const [showNarration, setShowNarration] = useState(false);

  const cleanLang = (language || "").trim().toLowerCase();
  const prismLang = LANG_MAP[cleanLang] || "javascript";

  const highlightedHtml = useMemo(() => {
    const grammar = Prism.languages[prismLang] || Prism.languages.javascript;
    try {
      return Prism.highlight(code, grammar, prismLang);
    } catch {
      return code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  }, [code, prismLang]);

  const handleCopy = async () => {
    if (!code || !navigator.clipboard) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-snippet-wrap" style={{ borderRadius: "var(--radius-control)", overflow: "hidden", background: "var(--bg-canvas)", border: "1px solid var(--border-line)" }}>
      <div className="code-snippet-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", background: "var(--bg-surface-raised)", borderBottom: "1px solid var(--border-line)", fontSize: "11px", color: "var(--text-secondary)" }}>
        <span>{label || cleanLang.toUpperCase()}</span>
        <div style={{ display: "flex", gap: "8px" }}>
          {narration && (
            <button type="button" onClick={() => setShowNarration((v) => !v)} style={{ color: showNarration ? "var(--accent-cyan)" : "inherit", padding: "2px 6px" }}>
              {showNarration ? "Ocultar explicación" : "Explicar código"}
            </button>
          )}
          <button type="button" onClick={handleCopy} style={{ padding: "2px 6px" }}>
            {copied ? "✓ Copiado" : "Copiar"}
          </button>
        </div>
      </div>
      {showNarration && narration && (
        <div className="code-snippet-narration" style={{ padding: "10px 14px", background: "var(--bg-surface)", borderBottom: "1px solid var(--border-line)", fontSize: "12px", color: "var(--accent-cyan)" }}>
          {narration}
        </div>
      )}
      <pre style={{ margin: 0, padding: "14px", overflowX: "auto", fontSize: "13px", lineHeight: "1.5" }}>
        <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      </pre>
    </div>
  );
}
