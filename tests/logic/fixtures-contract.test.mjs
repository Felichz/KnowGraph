import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseBackup } from "../../src/ai/backup.js";
import { GRAPH_REGISTRY } from "../../src/logic/graphRegistry.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_DIR = path.resolve(__dirname, "../fixtures");

assert.ok(fs.existsSync(FIXTURES_DIR), "tests/fixtures directory must exist");
const fixtureFiles = fs.readdirSync(FIXTURES_DIR).filter((file) => file.endsWith(".json"));
assert.ok(fixtureFiles.length >= 3, "At least 3 fixtures (populated, boundary, degraded) must exist");

for (const file of fixtureFiles) {
  const filePath = path.join(FIXTURES_DIR, file);
  const rawText = fs.readFileSync(filePath, "utf8");

  // Degraded state fixtures must be rejected by runtime parser
  if (file.includes("degraded")) {
    assert.throws(
      () => parseBackup(rawText),
      /no es un respaldo válido/,
      `${file}: degraded fixture must be rejected by runtime parser`
    );
    continue;
  }
  
  // 1. Strict Schema Conformance via runtime backup parser
  const backup = parseBackup(rawText);
  assert.equal(backup.app, "learning-workspace", `${file}: app identifier must match`);
  assert.equal(backup.kind, "state-backup", `${file}: kind must be state-backup`);
  assert.equal(backup.version, 1, `${file}: schema version must be 1`);
  assert.ok(backup.learning, `${file}: backup.learning must be defined`);

  const attempts = backup.learning.attempts || [];
  if (attempts.length > 0) {
    // 2. Domain Alignment: nodeIds must strictly exist in the graph registry
    for (const attempt of attempts) {
      const graph = GRAPH_REGISTRY[attempt.graphId];
      assert.ok(graph, `${file}: attempt graphId '${attempt.graphId}' must exist in registry`);
      assert.ok(
        graph.nodeIds.has(attempt.nodeId),
        `${file}: attempt nodeId '${attempt.nodeId}' must exist in '${attempt.graphId}' graph`
      );

      // Verify evaluation rubric structure if present
      if (attempt.evaluation) {
        assert.ok(
          Number.isFinite(attempt.evaluation.score),
          `${file}: attempt evaluation score must be a finite number`
        );
        assert.ok(
          attempt.evaluation.rubric,
          `${file}: attempt evaluation must contain rubric object`
        );
      }
    }

    // 3. Distribution Variance (for populated/hydrated/boundary states)
    if (file.includes("hydrated") || file.includes("populated") || file.includes("boundary")) {
      const scores = attempts.map((a) => a.evaluation?.score ?? a.score ?? 0);
      const hasDeveloping = scores.some((s) => s < 100);
      const hasMastery = scores.some((s) => s >= 100);
      assert.ok(
        hasDeveloping && hasMastery,
        `${file}: realistic populated/boundary fixtures must include both developing (< 100) and mastery (>= 100) items`
      );
    }
  }

  // 4. Lexical & Structural Realism on drafts
  const drafts = backup.learning.drafts || [];
  for (const draft of drafts) {
    const [graphId, nodeId] = draft.key.split(":");
    const graph = GRAPH_REGISTRY[graphId];
    assert.ok(graph, `${file}: draft graphId '${graphId}' must exist in registry`);
    assert.ok(
      graph.nodeIds.has(nodeId),
      `${file}: draft nodeId '${nodeId}' must exist in '${graphId}' graph`
    );
    assert.ok(
      typeof draft.text === "string" && draft.text.trim().length >= 20,
      `${file}: draft text must be realistic technical prose (>= 20 characters)`
    );
  }
}

console.log(`fixtures contract validation: OK (${fixtureFiles.length} fixtures verified, 0 drift)`);
