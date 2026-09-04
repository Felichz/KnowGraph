import assert from "node:assert/strict";
import { getSeniorityProgress, getMilestoneProgress } from "../../src/logic/seniorityProgress.js";
import { evaluateInterviewQuestions } from "../../src/logic/interviewUnlock.js";

// Test seniority progress
const sampleBands = [
  { id: "band_1", label: "Junior", nodeIds: ["a", "b"], requires: [] },
  { id: "band_2", label: "Senior", nodeIds: ["c"], requires: ["band_1"] },
];

const checkedNodes = new Set(["a", "b"]);
const totalNodes = new Set(["a", "b", "c"]);

const result = getSeniorityProgress(sampleBands, checkedNodes, totalNodes);
assert.equal(result[0].percentage, 100);
assert.equal(result[0].complete, true);
assert.equal(result[1].requirementsMet, true);
assert.equal(result[1].percentage, 0);

// Test milestones
const sampleMilestones = [
  { id: "m1", label: "Milestone 1", nodeIds: ["a"] },
];
const mResult = getMilestoneProgress(sampleMilestones, checkedNodes, totalNodes);
assert.equal(mResult[0].percentage, 100);
assert.equal(mResult[0].done, 1);

// Test interview questions
const dummyGraph = {
  nodes: [
    { id: "a", label: "Node A", priority: 1, prerequisites: [] },
    { id: "b", label: "Node B", priority: 2, prerequisites: ["a"] },
  ],
};
const dummyQuestions = [
  { id: 1, title: "Question 1", nodeIds: ["a"] },
  { id: 2, title: "Question 2", nodeIds: ["b"] },
];

// Sin 'a' dominado, la pregunta 2 (que requiere 'a' como prerrequisito de 'b') está bloqueada
const locked = evaluateInterviewQuestions(dummyQuestions, dummyGraph, new Set());
assert.equal(locked[1].isUnlocked, false);
assert.equal(locked[1].missingNodes.length, 1);
assert.equal(locked[1].missingNodes[0].id, "a");

// Con 'a' dominado, la pregunta 2 está desbloqueada
const unlocked = evaluateInterviewQuestions(dummyQuestions, dummyGraph, new Set(["a"]));
assert.equal(unlocked[1].isUnlocked, true);
assert.equal(unlocked[1].missingNodes.length, 0);

console.log("seniority and interview unlock logic: OK");
