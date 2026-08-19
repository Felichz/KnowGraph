import assert from "node:assert/strict";
import {
  cancelTask,
  dismissTask,
  getActiveTaskNodeIds,
  getActiveTasks,
  getAllTasks,
  getTask,
  getTasksSnapshot,
  subscribeToTasks,
  taskSyncChannel,
} from "../../src/ai/backgroundTaskManager.js";

// Test 1: Active task queries and initial empty snapshot
assert.deepEqual(getAllTasks(), []);
assert.deepEqual(getActiveTasks(), []);
assert.deepEqual(Array.from(getActiveTaskNodeIds("test-graph")), []);
const initialSnapshot = getTasksSnapshot();
assert.equal(initialSnapshot.size, 0);

// Test 2: Subscriber notification on mutation
let notificationCount = 0;
const unsubscribe = subscribeToTasks((snapshot) => {
  notificationCount += 1;
});

// Test 3: Dismissing non-existent task is safe
dismissTask("test-graph", "node-1");
assert.equal(getTask("test-graph", "node-1"), null);

// Test 4: Cancelling non-existent task is safe
cancelTask("test-graph", "node-1");
assert.equal(getTask("test-graph", "node-1"), null);

// Test 5: Multi-tab sync via BroadcastChannel simulation
if (typeof BroadcastChannel !== "undefined") {
  const simulatedRemoteTab = new BroadcastChannel("knowgraph_tasks_sync");

  // Send a task mutation from "Tab B"
  const remoteTaskPayload = {
    taskId: "harness-remote-123",
    type: "pedagogical_harness",
    graphId: "react",
    nodeId: "custom-hooks",
    cardKey: "react:custom-hooks",
    status: "running",
    stage: "judging",
    message: "Juez evaluando calidad...",
    iteration: 1,
    currentScore: 92,
    updatedAt: Date.now(),
  };

  simulatedRemoteTab.postMessage({
    type: "TASK_MUTATION",
    cardKey: "react:custom-hooks",
    task: remoteTaskPayload,
  });

  // Wait a small tick for BroadcastChannel dispatch
  await new Promise((resolve) => setTimeout(resolve, 50));

  const syncedTask = getTask("react", "custom-hooks");
  assert.ok(syncedTask, "Task from remote tab should sync to local store");
  assert.equal(syncedTask.status, "running");
  assert.equal(syncedTask.currentScore, 92);
  assert.equal(syncedTask.stage, "judging");

  // Verify getTasksSnapshot() returned a new Map containing the synced task
  const currentSnapshot = getTasksSnapshot();
  assert.equal(currentSnapshot.get("react:custom-hooks")?.currentScore, 92);
  assert(notificationCount > 0, "Subscribers should be notified on remote tab broadcast");

  // Simulate remote tab dismissal
  simulatedRemoteTab.postMessage({
    type: "TASK_DISMISS",
    cardKey: "react:custom-hooks",
  });

  await new Promise((resolve) => setTimeout(resolve, 50));
  assert.equal(getTask("react", "custom-hooks"), null);

  simulatedRemoteTab.close();
}

unsubscribe();
console.log("background task manager + useSyncExternalStore + multi-tab tests: OK");
