import assert from "node:assert/strict";
import {
  cancelTask,
  dismissTask,
  getActiveTaskNodeIds,
  getActiveTasks,
  getAllTasks,
  getTask,
} from "../../src/ai/backgroundTaskManager.js";

// Test 1: Active task queries and isolation
assert.deepEqual(getAllTasks(), []);
assert.deepEqual(getActiveTasks(), []);
assert.deepEqual(Array.from(getActiveTaskNodeIds("test-graph")), []);

// Test 2: Dismissing non-existent task is safe
dismissTask("test-graph", "node-1");
assert.equal(getTask("test-graph", "node-1"), null);

// Test 3: Cancelling non-existent task is safe
cancelTask("test-graph", "node-1");
assert.equal(getTask("test-graph", "node-1"), null);

console.log("background task manager tests: OK");
