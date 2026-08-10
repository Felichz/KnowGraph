// Extrae propiedades completas de un objeto JSON mientras todavía se está
// generando. Nunca reemplaza al parseo/validación final: solo alimenta previews.

const COMPLETABLE_FIELDS = new Set([
  "scoreSummary",
  "coverage",
  "feedback",
  "rubric",
  "strengths",
  "gaps",
  "misconceptions",
  "nextAttemptPrompt",
  "conciseVerdict",
  "points",
  "hint",
]);

export function extractCompletedFields(text, emitted = new Set()) {
  const fields = [];
  const objectStart = text.indexOf("{");
  if (objectStart < 0) return fields;

  let cursor = objectStart + 1;
  while (cursor < text.length) {
    cursor = skipWhitespaceAndCommas(text, cursor);
    if (text[cursor] === "}") break;
    if (text[cursor] !== '"') break;

    const keyEnd = findStringEnd(text, cursor);
    if (keyEnd < 0) break;
    let key;
    try {
      key = JSON.parse(text.slice(cursor, keyEnd));
    } catch {
      break;
    }

    cursor = skipWhitespace(text, keyEnd);
    if (text[cursor] !== ":") break;
    const valueStart = skipWhitespace(text, cursor + 1);
    const valueEnd = findValueEnd(text, valueStart);
    if (valueEnd < 0) break;

    const rawValue = text.slice(valueStart, valueEnd);
    let value;
    try {
      value = JSON.parse(rawValue);
    } catch {
      break;
    }

    if (COMPLETABLE_FIELDS.has(key) && !emitted.has(key)) {
      emitted.add(key);
      fields.push({ key, value });
    }

    cursor = skipWhitespace(text, valueEnd);
    if (text[cursor] === ",") {
      cursor += 1;
      continue;
    }
    if (text[cursor] === "}") break;
    break;
  }

  return fields;
}

function skipWhitespace(text, cursor) {
  while (cursor < text.length && /\s/.test(text[cursor])) cursor += 1;
  return cursor;
}

function skipWhitespaceAndCommas(text, cursor) {
  while (cursor < text.length && (text[cursor] === "," || /\s/.test(text[cursor]))) cursor += 1;
  return cursor;
}

function findStringEnd(text, start) {
  let escaped = false;
  for (let i = start + 1; i < text.length; i += 1) {
    const char = text[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === '"') return i + 1;
  }
  return -1;
}

function findValueEnd(text, start) {
  const first = text[start];
  if (!first) return -1;
  if (first === '"') return findStringEnd(text, start);

  if (first === "{" || first === "[") {
    const stack = [first === "{" ? "}" : "]"];
    let escaped = false;
    let inString = false;
    for (let i = start + 1; i < text.length; i += 1) {
      const char = text[i];
      if (inString) {
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (char === '"') inString = false;
        continue;
      }
      if (char === '"') {
        inString = true;
      } else if (char === "{" || char === "[") {
        stack.push(char === "{" ? "}" : "]");
      } else if (char === "}" || char === "]") {
        if (stack[stack.length - 1] !== char) return -1;
        stack.pop();
        if (stack.length === 0) return i + 1;
      }
    }
    return -1;
  }

  // true, false, null y números solo pueden terminar antes de una coma o
  // del cierre del objeto. Si todavía no apareció ese delimitador, el valor
  // sigue incompleto.
  for (let i = start; i < text.length; i += 1) {
    if (text[i] === "," || text[i] === "}") return i;
  }
  return -1;
}
