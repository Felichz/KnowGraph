import assert from "node:assert/strict";
import { createLearningController } from "../../src/logic/learningController.js";

const attempts = [];
const drafts = new Map();
const storage = {
  async listAllAttempts() { return attempts.slice(); },
  async listAttempts(graphId, nodeId) {
    return attempts.filter((item) => item.graphId === graphId && item.nodeId === nodeId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },
  async saveAttempt(attempt) { attempts.push(attempt); },
  async getDraft(graphId, nodeId) { return drafts.get(`${graphId}:${nodeId}`) ?? ""; },
  async setDraft(graphId, nodeId, text) { drafts.set(`${graphId}:${nodeId}`, text); },
  async deleteDraft(graphId, nodeId) { drafts.delete(`${graphId}:${nodeId}`); },
};

const ai = {
  isCancel: () => false,
  async evaluateParaphraseStream({ graphId, nodeId, contentHash, onProgress, onBlock }) {
    onProgress?.(12);
    onBlock?.({ id: "scoreSummary.rubric.completeness.score", value: "15", complete: true, phase: "end" });
    return {
      attempt: {
        id: "attempt_test",
        createdAt: new Date().toISOString(),
        graphId,
        nodeId,
        contentHash,
        evaluation: {
          rubric: {
            accuracy: { score: 32, max: 40, note: "ok" },
            causalityAndTradeoffs: { score: 20, max: 25, note: "ok" },
            application: { score: 15, max: 20, note: "ok" },
            completeness: { score: 15, max: 15, note: "ok" },
          },
          strengths: [],
          gaps: [],
          misconceptions: [],
          nextAttemptPrompt: "x",
          conciseVerdict: "y",
          score: 104,
          scoreScaleVersion: 3,
          coveragePercent: 100,
          rawScore: 82,
        },
      },
    };
  },
};

const controller = createLearningController({ graphId: "react", storage, ai });
let notifications = 0;
const unsubscribe = controller.subscribe(() => { notifications += 1; });
await controller.hydrate();
let state = controller.getSnapshot();
assert.equal(state.hydrated, true);
assert.ok(state.graph.nodes.length > 0);
assert.equal(state.selectedNodeId, state.graph.nodes[0].id);

const firstCategory = state.graph.nodes[0].cat;
controller.selectOnlyGroup(firstCategory);
state = controller.getSnapshot();
assert.ok(state.visibleNodes.every((node) => node.cat === firstCategory));
assert.ok(state.suggestedNextNode);

const nodeId = state.selectedNodeId;
await controller.updateDraft(nodeId, "Una explicación suficientemente larga para probar el draft.");
await controller.submitParaphrase(nodeId);
state = controller.getSnapshot();
assert.equal(state.activeEvaluation, null);
assert.equal(state.attemptsByNode[nodeId].length, 1);
assert.equal(state.selectedNode.progress.score, 104);
assert.equal(typeof state.selectedNode.progress.score, "number");
assert.equal(state.selectedNode.progress.scoreView.displayScore, 104);
assert.equal(typeof state.selectedNode.progress.attemptCount, "number");
assert.equal(typeof state.selectedNode.progress.isComplete, "boolean");

// Boundary check for unattempted node: score must be null, not undefined or object
const unattemptedProgress = state.progressMap[state.graph.nodes[1].id];
assert.equal(unattemptedProgress.score, null);
assert.equal(unattemptedProgress.scoreView, null);
assert.ok(notifications > 3);

unsubscribe();
controller.destroy();
console.log("learning controller: OK");
