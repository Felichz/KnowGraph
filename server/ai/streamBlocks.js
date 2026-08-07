// Parser incremental para el JSON estructurado del evaluador.
//
// No intenta validar la respuesta final. Su único trabajo es identificar hojas
// que alimentan la UI mientras todavía están incompletas. La validación real
// sigue ocurriendo después, con Zod y el JSON Schema.

const STREAMABLE_LEAVES = new Set([
  "score",
  "max",
  "note",
  "nextAttemptPrompt",
  "conciseVerdict",
  "topic",
  "explanation",
  "revisionHint",
  "quote",
  "correction",
]);

const STREAMABLE_ROOTS = new Set(["strengths"]);

export function extractStreamingBlocks(text) {
  const blocks = [];
  scanValue(text, skipWhitespace(text, 0), [], blocks);
  return blocks;
}

function scanValue(text, cursor, path, blocks) {
  if (cursor >= text.length) return cursor;
  const first = text[cursor];

  if (first === '"') {
    const token = readString(text, cursor);
    if (isStreamablePath(path)) {
      blocks.push({
        id: pathToId(path),
        kind: "text",
        value: token.value,
        complete: token.complete,
      });
    }
    return token.end;
  }

  if (first === "{") return scanObject(text, cursor, path, blocks);
  if (first === "[") return scanArray(text, cursor, path, blocks);

  const scalar = readScalar(text, cursor);
  if (isStreamablePath(path) && scalar.value.length > 0) {
    blocks.push({
      id: pathToId(path),
      kind: "number",
      value: scalar.value,
      complete: scalar.complete,
    });
  }
  return scalar.end;
}

function scanObject(text, cursor, path, blocks) {
  cursor += 1;
  while (cursor < text.length) {
    cursor = skipWhitespaceAndCommas(text, cursor);
    if (text[cursor] === "}") return cursor + 1;
    if (text[cursor] !== '"') return cursor;

    const keyToken = readString(text, cursor);
    if (!keyToken.complete) return keyToken.end;
    cursor = skipWhitespace(text, keyToken.end);
    if (text[cursor] !== ":") return cursor;
    cursor = skipWhitespace(text, cursor + 1);
    if (cursor >= text.length) return cursor;

    cursor = scanValue(text, cursor, [...path, keyToken.value], blocks);
    cursor = skipWhitespace(text, cursor);
    if (text[cursor] === ",") {
      cursor += 1;
      continue;
    }
    if (text[cursor] === "}") return cursor + 1;
    return cursor;
  }
  return cursor;
}

function scanArray(text, cursor, path, blocks) {
  cursor += 1;
  let index = 0;
  while (cursor < text.length) {
    cursor = skipWhitespaceAndCommas(text, cursor);
    if (text[cursor] === "]") return cursor + 1;
    const next = scanValue(text, cursor, [...path, index], blocks);
    if (next === cursor) return cursor;
    cursor = skipWhitespace(text, next);
    index += 1;
    if (text[cursor] === ",") {
      cursor += 1;
      continue;
    }
    if (text[cursor] === "]") return cursor + 1;
    return cursor;
  }
  return cursor;
}

function readString(text, start) {
  let escaped = false;
  for (let cursor = start + 1; cursor < text.length; cursor += 1) {
    const char = text[cursor];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === '"') {
      const raw = text.slice(start, cursor + 1);
      return { value: decodeString(raw, true), complete: true, end: cursor + 1 };
    }
  }

  const raw = text.slice(start);
  return { value: decodeString(raw, false), complete: false, end: text.length };
}

function readScalar(text, start) {
  let end = start;
  while (end < text.length && !",}]".includes(text[end])) end += 1;
  const raw = text.slice(start, end).trim();
  const complete = end < text.length;
  return { value: raw, complete, end };
}

function decodeString(raw, complete) {
  const candidate = complete ? raw : `${raw}"`;
  try {
    return JSON.parse(candidate);
  } catch {
    // Mientras el modelo está dentro de una escape sequence no siempre existe
    // un JSON parcial decodificable. Mostramos una aproximación segura hasta
    // que llegue el siguiente fragmento.
    return raw
      .slice(1)
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }
}

function isStreamablePath(path) {
  // Contrato actual: scoreSummary completo primero, feedback después.
  if (path[0] === "scoreSummary" && path[1] === "rubric" && path.length === 4) {
    return path[3] === "score" || path[3] === "max";
  }
  if (path[0] === "feedback") {
    if (path[1] === "rubricNotes" && path.length === 3) return true;
    if (path[1] === "strengths" && path.length === 3 && typeof path[2] === "number") return true;
    if ((path[1] === "gaps" || path[1] === "misconceptions") && path.length === 4) return true;
    if ((path[1] === "nextAttemptPrompt" || path[1] === "conciseVerdict") && path.length === 2) return true;
  }

  // Compatibilidad para fixtures y respuestas antiguas.
  if (path.length === 1 && STREAMABLE_ROOTS.has(path[0])) return true;
  if (path.length === 2 && path[0] === "strengths" && typeof path[1] === "number") return true;
  const leaf = path[path.length - 1];
  if (!STREAMABLE_LEAVES.has(leaf)) return false;

  if (path[0] === "rubric" && path.length === 3) return true;
  if ((path[0] === "gaps" || path[0] === "misconceptions") && path.length === 3) return true;
  if ((path[0] === "nextAttemptPrompt" || path[0] === "conciseVerdict") && path.length === 1) return true;
  return false;
}

function pathToId(path) {
  return path.map((part) => typeof part === "number" ? `[${part}]` : part).join(".").replaceAll(".[", "[");
}

function skipWhitespace(text, cursor) {
  while (cursor < text.length && /\s/.test(text[cursor])) cursor += 1;
  return cursor;
}

function skipWhitespaceAndCommas(text, cursor) {
  while (cursor < text.length && (text[cursor] === "," || /\s/.test(text[cursor]))) cursor += 1;
  return cursor;
}
