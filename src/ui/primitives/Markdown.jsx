import { CodeBlock } from "./CodeBlock.jsx";
import { parseInline, parseMarkdown } from "./markdownParse.js";

export function Inline({ text }) {
  return parseInline(text).map((token, i) => {
    if (token.type === "code") return <code key={i} className="code-inline">{token.value}</code>;
    if (token.type === "strong") return <strong key={i}>{token.value}</strong>;
    if (token.type === "em") return <em key={i}>{token.value}</em>;
    if (token.type === "link") return <a key={i} href={token.href} target="_blank" rel="noreferrer noopener">{token.value}</a>;
    return <span key={i}>{token.value}</span>;
  });
}

// Markdown seguro para lección del mentor, chat y detalle de foco (design-spec D.9).
export function Markdown({ text, className = "", headingOffset = 1 }) {
  const blocks = parseMarkdown(text);
  return (
    <div className={`md ${className}`}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "code": return <CodeBlock key={i} code={block.code} language={block.lang} />;
          case "h": {
            const level = Math.min(6, block.level + headingOffset);
            const Tag = `h${level}`;
            return <Tag key={i} className={`md__h md__h${Math.min(level, 4)}`}><Inline text={block.text} /></Tag>;
          }
          case "hr": return <hr key={i} className="md__hr" />;
          case "quote": return <blockquote key={i} className="md__quote"><Inline text={block.text} /></blockquote>;
          case "ul": return <ul key={i} className="md__list">{block.items.map((item, j) => <li key={j}><Inline text={item} /></li>)}</ul>;
          case "ol": return <ol key={i} className="md__list md__list--ol">{block.items.map((item, j) => <li key={j}><Inline text={item} /></li>)}</ol>;
          case "table": return (
            <div key={i} className="data-table-wrap">
              <table className="data-table">
                <thead><tr>{block.head.map((cell, j) => <th key={j}><Inline text={cell} /></th>)}</tr></thead>
                <tbody>{block.rows.map((row, r) => <tr key={r}>{row.map((cell, j) => <td key={j}><Inline text={cell} /></td>)}</tr>)}</tbody>
              </table>
            </div>
          );
          default: return <p key={i} className="md__p"><Inline text={block.text} /></p>;
        }
      })}
    </div>
  );
}
