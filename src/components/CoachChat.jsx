import React, { useEffect, useRef, useState } from "react";
import { LiveRequestFeedback } from "./LiveRequestFeedback.jsx";
import { ReadingChunks, splitReadingChunks } from "./ReadingChunks.jsx";

export function CoachChat({ iteration, status = "idle", streamingText = "", progress, error, onSend, onStop }) {
  const [question, setQuestion] = useState("");
  const endRef = useRef(null);
  const running = status === "running";
  const messages = iteration?.messages ?? [];

  useEffect(() => {
    setQuestion("");
  }, [iteration?.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [messages.length, streamingText]);

  const submit = (event) => {
    event?.preventDefault();
    const clean = question.trim();
    if (!clean || running || !iteration) return;
    setQuestion("");
    onSend(clean);
  };

  return (
    <section className="coach-chat" aria-label="Conversación con el coach">
      <header className="coach-chat__header">
        <div>
          <span>CONVERSACIÓN DE ESTA ITERACIÓN</span>
          <strong>Preguntale al coach</strong>
        </div>
        {messages.length > 0 && <small>{messages.length} mensaje{messages.length === 1 ? "" : "s"}</small>}
      </header>

      {!iteration ? (
        <p className="coach-chat__unavailable">Primero procesá esta versión para crear su contexto de coaching.</p>
      ) : (
        <>
          <div className="coach-chat__messages" aria-live="polite">
            {messages.length === 0 && !running && (
              <div className="coach-chat__empty">
                Preguntá por el concepto, un ejemplo, un trade-off o cualquier parte del hint que todavía no te cierre.
              </div>
            )}
            {messages.map((message) => (
              <article className={`coach-chat__message coach-chat__message--${message.role}`} key={message.id}>
                <span>{message.role === "user" ? "VOS" : "COACH"}</span>
                <ChatMessageContent content={message.content} singleChunk={message.role === "assistant"} />
                {message.interrupted && <small className="coach-chat__interrupted">Respuesta interrumpida</small>}
              </article>
            ))}
            {running && (
              <article className="coach-chat__message coach-chat__message--assistant is-streaming">
                <span>COACH</span>
                {streamingText ? <ChatMessageContent content={streamingText} singleChunk /> : <div className="coach-chat__thinking">Preparando una explicación...</div>}
                <LiveRequestFeedback progress={progress} compact />
              </article>
            )}
            <div ref={endRef} />
          </div>

          {error && <p className="coach-chat__error" role="alert">{error}</p>}

          <form className="coach-chat__composer" onSubmit={submit}>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submit();
                }
              }}
              rows="2"
              maxLength="4000"
              placeholder="¿Qué parte querés entender mejor?"
              aria-label="Pregunta para el coach"
              disabled={false}
            />
            <div className="coach-chat__composer-footer">
              <span>Enter envía · Shift+Enter agrega una línea</span>
              {running ? (
                <button type="button" className="coach-chat__stop" onClick={onStop} aria-label="Detener respuesta del coach">
                  Detener
                </button>
              ) : (
                <button type="submit" disabled={!question.trim()}>Enviar</button>
              )}
            </div>
          </form>
        </>
      )}
    </section>
  );
}

function ChatMessageContent({ content, singleChunk = false }) {
  if (singleChunk) {
    return (
      <ReadingChunks
        text={content}
        singleChunk
        chunkElement="div"
        contentElement="div"
        className="coach-chat__reading-chunks"
        chunkClassName="coach-chat__response-chunk"
        renderChunk={(chunk) => <ChatMarkdown text={chunk} />}
      />
    );
  }

  return <ChatMarkdown text={content} />;
}

export function ChatMarkdown({ text, chunked = false, className = "coach-chat__message-content" }) {
  const markdownBlocks = String(text ?? "").split(/```/);
  return (
    <div className={className}>
      {markdownBlocks.map((block, blockIndex) => {
        if (blockIndex % 2 === 1) {
          return (
            <pre
              key={blockIndex}
            >
              <code>{block.replace(/^\w+\n/, "")}</code>
            </pre>
          );
        }

        return <MarkdownFlow key={blockIndex} text={block} chunked={chunked} />;
      })}
    </div>
  );
}

export function ChunkedMarkdown({ text }) {
  return <ChatMarkdown text={text} chunked className="coach-hint__markdown" />;
}

function MarkdownFlow({ text, chunked = false }) {
  const lines = String(text ?? "").replace(/\r/g, "").split("\n");
  const elements = [];
  let paragraph = [];
  let list = null;
  const renderInline = (value) => chunked
    ? <ChunkedInlineMarkdown text={value} />
    : <InlineMarkdown text={value} />;

  const flushParagraph = () => {
    const value = paragraph.join(" ").trim();
    if (value) elements.push(<p key={`p-${elements.length}`}>{renderInline(value)}</p>);
    paragraph = [];
  };

  const flushList = () => {
    if (!list || !list.items.length) return;
    const ListTag = list.type === "ordered" ? "ol" : "ul";
    elements.push(
      <ListTag key={`list-${elements.length}`}>
          {list.items.map((item, index) => <li key={`${list.type}-${index}`}>{renderInline(item)}</li>)}
      </ListTag>,
    );
    list = null;
  };

  const pushTable = (headerLine, separatorLine, bodyLines) => {
    const headers = parseTableRow(headerLine);
    if (!headers || !isTableSeparator(separatorLine)) return false;
    const rows = bodyLines.map(parseTableRow).filter(Boolean);
    elements.push(
      <div className="coach-chat__table-wrap" key={`table-${elements.length}`}>
        <table>
          <thead>
            <tr>{headers.map((cell, index) => <th key={`th-${index}`} scope="col">{renderInline(cell)}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`tr-${rowIndex}`}>
                {headers.map((_, columnIndex) => (
                  <td key={`td-${rowIndex}-${columnIndex}`}>
                    {renderInline(row[columnIndex] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );
    return true;
  };

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const unordered = line.match(/^\s*[-*+]\s+(.*)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    const marker = unordered ? { type: "unordered", value: unordered[1] } : ordered ? { type: "ordered", value: ordered[1] } : null;

    if (parseTableRow(line) && isTableSeparator(lines[lineIndex + 1] ?? "")) {
      flushParagraph();
      flushList();
      const tableBody = [];
      let bodyIndex = lineIndex + 2;
      while (bodyIndex < lines.length && parseTableRow(lines[bodyIndex])) {
        tableBody.push(lines[bodyIndex]);
        bodyIndex += 1;
      }
      pushTable(line, lines[lineIndex + 1], tableBody);
      lineIndex = bodyIndex - 1;
      continue;
    }

    const heading = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      flushParagraph();
      flushList();
      const Heading = `h${heading[1].length}`;
       elements.push(<Heading key={`heading-${elements.length}`}>{renderInline(heading[2])}</Heading>);
      continue;
    }

    if (/^\s*(\*{3,}|-{3,}|_{3,})\s*$/.test(line)) {
      flushParagraph();
      flushList();
      elements.push(<hr key={`hr-${elements.length}`} />);
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      flushParagraph();
      flushList();
      const quoteLines = [line.replace(/^\s*>\s?/, "")];
      while (lineIndex + 1 < lines.length && /^\s*>\s?/.test(lines[lineIndex + 1])) {
        lineIndex += 1;
        quoteLines.push(lines[lineIndex].replace(/^\s*>\s?/, ""));
      }
      elements.push(
        <blockquote key={`quote-${elements.length}`}>
          <p>{renderInline(quoteLines.join(" "))}</p>
        </blockquote>,
      );
      continue;
    }

    if (marker) {
      flushParagraph();
      if (!list || list.type !== marker.type) {
        flushList();
        list = { type: marker.type, items: [] };
      }
      list.items.push(marker.value.trim());
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    if (list) {
      list.items[list.items.length - 1] = `${list.items.at(-1)} ${line.trim()}`.trim();
    } else {
      paragraph.push(line.trim());
    }
  }

  flushParagraph();
  flushList();
  return elements;
}

function ChunkedInlineMarkdown({ text }) {
  const chunks = splitReadingChunks(text);
  return chunks.map((chunk, index) => (
    <React.Fragment key={`${chunk}-${index}`}>
      {index > 0 && " "}
      <span className={`coach-hint__chunk coach-hint__chunk--${index % 2 === 0 ? "a" : "b"}`}>
        <InlineMarkdown text={chunk} />
      </span>
    </React.Fragment>
  ));
}

function parseTableRow(line) {
  const value = String(line ?? "").trim();
  if (!value.includes("|") || !value.replace(/\|/g, "").trim()) return null;
  const withoutEdges = value.replace(/^\|/, "").replace(/\|$/, "");
  const cells = withoutEdges.split("|").map((cell) => cell.trim());
  return cells.length > 1 ? cells : null;
}

function isTableSeparator(line) {
  const cells = parseTableRow(line);
  return Boolean(cells?.length && cells.every((cell) => /^:?-{3,}:?$/.test(cell)));
}

function InlineMarkdown({ text }) {
  return String(text).split(/(\[[^\]\n]+\]\([^\)\n]+\)|`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|\*[^*\n]+\*|_[^_\n]+_)/g).filter(Boolean).map((part, index) => {
    const link = part.match(/^\[([^\]\n]+)\]\(([^\)\n]+)\)$/);
    if (link) {
      const href = safeMarkdownHref(link[2]);
      return <a key={index} href={href} target="_blank" rel="noreferrer">{link[1]}</a>;
    }
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("__") && part.endsWith("__")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    if (part.startsWith("_") && part.endsWith("_")) return <em key={index}>{part.slice(1, -1)}</em>;
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function safeMarkdownHref(href) {
  const value = String(href).trim();
  return /^(https?:\/\/|mailto:|#)/i.test(value) ? value : "#";
}
