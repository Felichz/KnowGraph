import assert from "node:assert/strict";
import { lastActivityAt, resumeTarget, reviewCount, reviewOrder, scoreTier } from "../../src/logic/studyQueue.js";

const node = (id, priority) => ({ id, priority, label: id });
const nodes = [node("a", 1), node("b", 2), node("c", 3), node("d", 4), node("e", 5)];
const data = {
  a: { attempts: [{ createdAt: "2026-09-01" }], isComplete: true, displayScore: 108, hasDraft: false },
  b: { attempts: [{ createdAt: "2026-09-03", answer: "old" }], representative: { answer: "old" }, isComplete: false, displayScore: 72, hasDraft: true, draft: { text: "new", updatedAt: "2026-09-05" } },
  c: { attempts: [], isComplete: false, displayScore: null, hasDraft: true, draft: { text: "x", updatedAt: "2026-09-04" } },
  d: { attempts: [{ createdAt: "2026-09-02" }], isComplete: false, displayScore: 40, hasDraft: false },
};
const progress = { of: (id) => data[id] ?? { attempts: [], isComplete: false, displayScore: null, hasDraft: false } };

assert.equal(lastActivityAt(data.b), "2026-09-05", "latest of draft and attempt");
const resume = resumeTarget(nodes, progress);
assert.equal(resume.node.id, "b", "most recent unfinished card");
assert.equal(resume.stage, "evaluate", "changed draft after an attempt resumes in Evaluate");
assert.equal(resumeTarget([node("c", 3)], progress).stage, "paraphrase", "draft without attempt resumes in Paraphrase");
assert.equal(resumeTarget([node("a", 1), node("e", 5)], progress), null, "mastered or untouched cards are not resumed");

assert.deepEqual(reviewOrder(nodes, progress).map((n) => n.id), ["c", "d", "b", "a", "e"], "weak worked cards first, then mastered, then untouched");
assert.equal(reviewCount(nodes, progress), 3);

assert.equal(scoreTier(data.a), "extra");
assert.equal(scoreTier({ displayScore: 100, isComplete: true }), "mastered");
assert.equal(scoreTier(data.d), "progress");
assert.equal(scoreTier(progress.of("e")), "none");
console.log("study queue: OK");
