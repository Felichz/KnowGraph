import React from "react";
import { useReadingChunks, splitReadingChunks } from "../hooks/useReadingChunks.js";

export function ChunkedDraftView({
  text = "",
  onEdit,
  isReadonly = false,
  className = "",
}) {
  const { chunks, stats } = useReadingChunks(text);

  return (
    <div className={`chunked-draft-view ${className}`.trim()} aria-label="Borrador dividido por chunks de lectura">
      <div className="chunked-draft-view__header">
        <div className="chunked-draft-view__stats">
          <span className="chunked-draft-view__stat-pill">📖 {stats.totalChunks} chunks</span>
          <span className="chunked-draft-view__stat-pill">📝 {stats.totalWords} palabras</span>
          <span className="chunked-draft-view__stat-pill">⚡ ~{stats.avgWordsPerChunk} pal/chunk</span>
        </div>
        {!isReadonly && onEdit && (
          <button
            type="button"
            className="chunked-draft-view__edit-btn"
            onClick={onEdit}
            title="Volver al modo de edición rápida de texto"
          >
            ✏️ Volver a editar
          </button>
        )}
      </div>

      <div className="chunked-draft-view__content coach-hint__markdown">
        <ChunkedDraftMarkdown text={text} onEdit={!isReadonly ? onEdit : undefined} />
      </div>
    </div>
  );
}

function ChunkedDraftMarkdown({ text, onEdit }) {
  const normalized = String(text ?? "").replace(/\r/g, "");
  const blocks = normalized.split(/\n{2,}/).filter((block) => Boolean(block.trim()));

  if (!blocks.length) {
    return <p className="chunked-draft-view__empty">No hay texto para mostrar.</p>;
  }

  return (
    <div className="chunked-draft-flow">
      {blocks.map((block, blockIndex) => (
        <DraftBlock key={blockIndex} text={block} onEdit={onEdit} />
      ))}
    </div>
  );
}

function DraftBlock({ text, onEdit }) {
  const lines = text.split("\n");
  const headingMatch = lines[0].match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);

  if (headingMatch && lines.length === 1) {
    const HeadingTag = `h${headingMatch[1].length}`;
    return (
      <HeadingTag className="chunked-draft-heading">
        <ChunkedInline text={headingMatch[2]} onEdit={onEdit} />
      </HeadingTag>
    );
  }

  const isList = lines.every((line) => /^\s*[-*+]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line));
  if (isList) {
    const isOrdered = /^\s*\d+[.)]/.test(lines[0]);
    const ListTag = isOrdered ? "ol" : "ul";
    return (
      <ListTag className="chunked-draft-list">
        {lines.map((line, idx) => {
          const itemText = line.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, "");
          return (
            <li key={idx}>
              <ChunkedInline text={itemText} onEdit={onEdit} />
            </li>
          );
        })}
      </ListTag>
    );
  }

  return (
    <p className="chunked-draft-paragraph">
      <ChunkedInline text={text} onEdit={onEdit} />
    </p>
  );
}

function ChunkedInline({ text, onEdit }) {
  const chunks = splitReadingChunks(text);

  if (!chunks.length) {
    return <InlineFormatting text={text} />;
  }

  return chunks.map((chunk, index) => (
    <React.Fragment key={`${index}-${chunk.slice(0, 15)}`}>
      {index > 0 && " "}
      <span
        className={`coach-hint__chunk coach-hint__chunk--${index % 2 === 0 ? "a" : "b"} chunked-draft-interactive-chunk`}
        onClick={onEdit}
        title={onEdit ? "Hacé click para editar este tramo" : undefined}
      >
        <InlineFormatting text={chunk} />
      </span>
    </React.Fragment>
  ));
}

function InlineFormatting({ text }) {
  return String(text)
    .split(/(\[[^\]\n]+\]\([^\)\n]+\)|`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|\*[^*\n]+\*|_[^_\n]+_)/g)
    .filter(Boolean)
    .map((part, index) => {
      const link = part.match(/^\[([^\]\n]+)\]\(([^\)\n]+)\)$/);
      if (link) {
        return (
          <a key={index} href={link[2]} target="_blank" rel="noreferrer">
            {link[1]}
          </a>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={index}>{part.slice(1, -1)}</code>;
      }
      if ((part.startsWith("**") && part.endsWith("**")) || (part.startsWith("__") && part.endsWith("__"))) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if ((part.startsWith("*") && part.endsWith("*")) || (part.startsWith("_") && part.endsWith("_"))) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
}
