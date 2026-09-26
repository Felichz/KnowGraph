// Parser de markdown mínimo y seguro (bloques). El renderer vive en Markdown.jsx.
export function parseMarkdown(source) {
  const parts = String(source ?? "").replace(/\r/g, "").split(/```/);
  const blocks = [];
  parts.forEach((part, index) => {
    if (index % 2 === 1) {
      const match = part.match(/^([\w#+-]*)\n/);
      blocks.push({ type: "code", lang: match?.[1] ?? "", code: (match ? part.slice(match[0].length) : part).replace(/\n$/, "") });
      return;
    }
    parseFlow(part, blocks);
  });
  return blocks;
}

function parseFlow(text, blocks) {
  const lines = text.split("\n");
  let para = [];
  let list = null;
  let quote = null;
  let table = null;
  const flush = () => {
    if (para.length) blocks.push({ type: "p", text: para.join(" ").trim() });
    if (list) blocks.push(list);
    if (quote) blocks.push({ type: "quote", text: quote.join(" ") });
    if (table) blocks.push(table);
    para = []; list = null; quote = null; table = null;
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();
    if (!trimmed) { flush(); continue; }
    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) { flush(); blocks.push({ type: "h", level: heading[1].length, text: heading[2] }); continue; }
    if (/^(-{3,}|\*{3,})$/.test(trimmed)) { flush(); blocks.push({ type: "hr" }); continue; }
    if (trimmed.startsWith(">")) { if (!quote) { flush(); quote = []; } quote.push(trimmed.replace(/^>\s?/, "")); continue; }
    if (trimmed.startsWith("|")) {
      const cells = trimmed.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
      if (cells.every((cell) => /^:?-{2,}:?$/.test(cell))) continue;
      if (!table) { flush(); table = { type: "table", head: cells, rows: [] }; } else table.rows.push(cells);
      continue;
    }
    const bullet = trimmed.match(/^[-*+]\s+(.*)$/);
    const ordered = trimmed.match(/^\d+[.)]\s+(.*)$/);
    if (bullet || ordered) {
      const type = bullet ? "ul" : "ol";
      if (!list || list.type !== type) { flush(); list = { type, items: [] }; }
      list.items.push((bullet ?? ordered)[1]);
      continue;
    }
    if (list && /^\s{2,}/.test(raw)) { list.items[list.items.length - 1] += ` ${trimmed}`; continue; }
    if (list || quote || table) flush();
    para.push(trimmed);
  }
  flush();
}

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;

// Tokens inline: {type: text|code|strong|em|link, value, href}
export function parseInline(text) {
  const tokens = [];
  String(text ?? "").split(INLINE).forEach((part) => {
    if (!part) return;
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) tokens.push({ type: "code", value: part.slice(1, -1) });
    else if (part.startsWith("**") && part.endsWith("**") && part.length > 3) tokens.push({ type: "strong", value: part.slice(2, -2) });
    else if (/^(\*|_).+(\*|_)$/.test(part)) tokens.push({ type: "em", value: part.slice(1, -1) });
    else if (/^\[[^\]]+\]\([^)]+\)$/.test(part)) {
      const [, label, href] = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      tokens.push(isSafeHref(href) ? { type: "link", value: label, href } : { type: "text", value: label });
    } else tokens.push({ type: "text", value: part });
  });
  return tokens;
}

export function isSafeHref(href) {
  return /^(https?:\/\/|mailto:|#)/i.test(String(href ?? "").trim());
}
