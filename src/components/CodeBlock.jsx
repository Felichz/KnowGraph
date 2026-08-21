import React, { useMemo, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-ruby.js";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-css.js";
import "prismjs/components/prism-markup.js";

const LANG_MAP = {
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  rb: "ruby",
  ruby: "ruby",
  sh: "bash",
  bash: "bash",
  shell: "bash",
  json: "json",
  css: "css",
  html: "markup",
  xml: "markup",
};

const DISPLAY_LANG = {
  javascript: "JavaScript",
  jsx: "React JSX",
  typescript: "TypeScript",
  tsx: "React TSX",
  ruby: "Ruby",
  bash: "Terminal",
  json: "JSON",
  css: "CSS",
  markup: "HTML",
};

export function CodeBlock({ code = "", language = "" }) {
  const [copied, setCopied] = useState(false);

  const cleanLang = (language || "").trim().toLowerCase();
  const prismLang = LANG_MAP[cleanLang] || (Prism.languages[cleanLang] ? cleanLang : "javascript");
  const displayLabel = DISPLAY_LANG[prismLang] || (cleanLang ? cleanLang.toUpperCase() : "Code");

  const highlightedHtml = useMemo(() => {
    const grammar = Prism.languages[prismLang] || Prism.languages.javascript;
    try {
      return Prism.highlight(code, grammar, prismLang);
    } catch {
      return code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  }, [code, prismLang]);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className="vscode-codeblock" aria-label={`Bloque de código ${displayLabel}`}>
      <div className="vscode-codeblock__header">
        <div className="vscode-codeblock__dots" aria-hidden="true">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>
        <span className="vscode-codeblock__lang">{displayLabel}</span>
        <button
          type="button"
          className="vscode-codeblock__copy-btn"
          onClick={handleCopy}
          aria-label={copied ? "Código copiado al portapapeles" : "Copiar código"}
          title="Copiar código al portapapeles"
        >
          {copied ? (
            <>
              <svg viewBox="0 0 20 20" width="14" height="14" fill="#34d399" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>¡Copiado!</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" aria-hidden="true">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>
      <pre className={`vscode-codeblock__pre language-${prismLang}`}>
        <code
          className={`vscode-codeblock__code language-${prismLang}`}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </pre>
    </div>
  );
}
