import { useMemo, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-markup.js";
import "prismjs/components/prism-css.js";
import "prismjs/components/prism-javascript.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-ruby.js";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-json.js";
import { Check, Copy } from "lucide-react";
import { Button } from "./Button.jsx";
import { useT } from "../../i18n/react.js";

const ALIAS = { js: "javascript", javascript: "javascript", jsx: "jsx", ts: "typescript", typescript: "typescript", tsx: "tsx",
  rb: "ruby", ruby: "ruby", erb: "ruby", sh: "bash", bash: "bash", shell: "bash", json: "json", css: "css", html: "markup", xml: "markup" };
const LABEL = { javascript: "JavaScript", jsx: "React JSX", typescript: "TypeScript", tsx: "React TSX", ruby: "Ruby",
  bash: "Terminal", json: "JSON", css: "CSS", markup: "HTML" };

export function guessLanguage(code = "") {
  if (/\bdef\s|\bend\b|\.rb\b|do \|/.test(code)) return "ruby";
  if (/<[A-Z][\w.]*|className=|useState|=>/.test(code)) return "jsx";
  return "javascript";
}

// Bloque de código con Prism y copiar (DESIGN §1.6, design-spec D.9).
export function CodeBlock({ code, language, label, actions, header = true, marker }) {
  const t = useT();
  const lang = ALIAS[String(language ?? "").toLowerCase()] ?? guessLanguage(code);
  const [copied, setCopied] = useState(false);
  const html = useMemo(() => {
    const grammar = Prism.languages[lang];
    return grammar ? Prism.highlight(String(code ?? ""), grammar, lang) : null;
  }, [code, lang]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(String(code ?? ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { setCopied(false); }
  }
  return (
    <figure className="code-block">
      {header && (
        <figcaption className="code-block__head">
          <span className="code-block__label">{marker}{label ?? LABEL[lang] ?? t("primitives.codeBlock.code")}</span>
          <span className="code-block__actions">
            {actions}
            <Button variant="ghost" size="sm" icon={copied ? Check : Copy} minWidth={108} onClick={copy}
              aria-label={t(copied ? "primitives.codeBlock.copiedAria" : "primitives.codeBlock.copyAria")}>
              {t(copied ? "primitives.codeBlock.copied" : "primitives.codeBlock.copy")}
            </Button>
          </span>
        </figcaption>
      )}
      <pre className="code-block__pre" lang="en" translate="no">
        {html ? <code className={`language-${lang}`} dangerouslySetInnerHTML={{ __html: html }} /> : <code>{code}</code>}
      </pre>
    </figure>
  );
}
