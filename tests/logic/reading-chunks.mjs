import assert from "node:assert/strict";
import { splitParagraph, splitReadingChunks } from "../../src/hooks/useReadingChunks.js";

// Test 1: Empty text handling
assert.deepEqual(splitReadingChunks(""), []);
assert.deepEqual(splitReadingChunks(null), []);

// Test 2: Single paragraph segmentation
const paragraph = "React separa la lógica de UI. Los componentes son funciones puras que retornan JSX accesible.";
const chunks = splitParagraph(paragraph);
assert(chunks.length >= 1);
assert.equal(chunks.join(" ").trim(), paragraph.trim());

// Test 3: Multi-paragraph chunking
const multiParagraph = `Primer párrafo de explicación conceptual importante.

Segundo párrafo con detalles sobre trade-offs y arquitectura.`;
const multiChunks = splitReadingChunks(multiParagraph);
assert(multiChunks.length >= 2);

// Test 4: Structured text preservation (bullet points, markdown lists)
const structuredText = "- Item 1: Custom hooks\n- Item 2: Screens\n- Item 3: Presentational";
const structuredChunks = splitParagraph(structuredText);
assert.equal(structuredChunks.length, 1);
assert.equal(structuredChunks[0], structuredText);

console.log("reading chunks logic tests: OK");
