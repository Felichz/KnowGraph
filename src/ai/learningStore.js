import { openDB } from "idb";

// IDBKeyRange es un global del browser. En Node 18+ también está disponible.
const keyRange = typeof IDBKeyRange !== "undefined" ? IDBKeyRange : undefined;

const DB_NAME = "learning-graph-ai";
const DB_VERSION = 3;
const MAX_ATTEMPTS_PER_NODE = 12;
const MAX_COACH_ITERATIONS_PER_NODE = 24;

let dbPromise;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("attempts")) {
          const store = db.createObjectStore("attempts", { keyPath: "id" });
          store.createIndex("byNode", ["graphId", "nodeId", "createdAt"]);
        }
        if (!db.objectStoreNames.contains("drafts")) {
          db.createObjectStore("drafts", { keyPath: "key" });
        }
        if (!db.objectStoreNames.contains("liveReviews")) {
          db.createObjectStore("liveReviews", { keyPath: "key" });
        }
        if (!db.objectStoreNames.contains("coachIterations")) {
          const store = db.createObjectStore("coachIterations", { keyPath: "id" });
          store.createIndex("byNode", ["graphId", "nodeId", "createdAt"]);
        }
      },
    });
  }
  return dbPromise;
}

function nodeRange(graphId, nodeId) {
  // El índice tiene keypath ["graphId", "nodeId", "createdAt"].
  // getAll([graphId, nodeId]) hace exact match sobre 2 componentes contra
  // una clave de 3 → nunca matchea. Usamos un bound con upper key que
  // completa el prefijo usando el mayor string Unicode.
  return keyRange.bound(
    [graphId, nodeId],
    [graphId, nodeId, "\uffff"],
  );
}

export async function saveAttempt(attempt) {
  const db = await getDb();
  const tx = db.transaction("attempts", "readwrite");
  await tx.store.put(attempt);
  await trimAttempts(tx, attempt.graphId, attempt.nodeId, MAX_ATTEMPTS_PER_NODE);
  await tx.done;
}

async function trimAttempts(tx, graphId, nodeId, max) {
  const all = await tx.store.index("byNode").getAll(nodeRange(graphId, nodeId));
  if (all.length <= max) return;
  all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const excess = all.length - max;
  for (let i = 0; i < excess; i++) {
    await tx.store.delete(all[i].id);
  }
}

export async function listAttempts(graphId, nodeId) {
  const db = await getDb();
  const tx = db.transaction("attempts", "readonly");
  const all = await tx.store.index("byNode").getAll(nodeRange(graphId, nodeId));
  await tx.done;
  return all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getLatestAttempt(graphId, nodeId) {
  const list = await listAttempts(graphId, nodeId);
  return list[list.length - 1] ?? null;
}

export async function getDraft(graphId, nodeId) {
  const db = await getDb();
  const tx = db.transaction("drafts", "readonly");
  const value = await tx.store.get(`${graphId}:${nodeId}`);
  await tx.done;
  if (typeof value === "string") return value;
  return value?.text ?? "";
}

export async function getDraftRecord(graphId, nodeId) {
  const db = await getDb();
  const tx = db.transaction("drafts", "readonly");
  const value = await tx.store.get(`${graphId}:${nodeId}`);
  await tx.done;
  if (!value) return null;
  if (typeof value === "string") {
    return { key: `${graphId}:${nodeId}`, text: value, isAiGenerated: false };
  }
  return value;
}

export async function setDraft(graphId, nodeId, text, options = {}) {
  const db = await getDb();
  const key = `${graphId}:${nodeId}`;
  if (!text) {
    await db.delete("drafts", key);
    return;
  }
  const isAiGenerated = Boolean(options.isAiGenerated);
  await db.put("drafts", {
    key,
    text,
    isAiGenerated,
    source: isAiGenerated ? (options.source ?? "ai") : (options.source ?? "user"),
    generatedAt: isAiGenerated ? (options.generatedAt ?? new Date().toISOString()) : undefined,
    updatedAt: new Date().toISOString(),
    ...(options.harnessHistory ? { harnessHistory: options.harnessHistory } : {}),
    ...(options.harnessScore !== undefined ? { harnessScore: options.harnessScore } : {}),
    ...(options.harnessRubric ? { harnessRubric: options.harnessRubric } : {}),
    ...(options.harnessCritique ? { harnessCritique: options.harnessCritique } : {}),
    ...(options.harnessPassedThreshold !== undefined ? { harnessPassedThreshold: options.harnessPassedThreshold } : {}),
  });
}

export async function listAllDrafts() {
  const db = await getDb();
  const tx = db.transaction("drafts", "readonly");
  const all = await tx.store.getAll();
  await tx.done;
  return all;
}

export async function deleteDraft(graphId, nodeId) {
  const db = await getDb();
  await db.delete("drafts", `${graphId}:${nodeId}`);
}

export async function getLiveReview(graphId, nodeId) {
  const db = await getDb();
  return (await db.get("liveReviews", `${graphId}:${nodeId}`)) ?? null;
}

export async function saveLiveReview({ graphId, nodeId, answerHash, contentHash, review }) {
  const db = await getDb();
  await db.put("liveReviews", {
    key: `${graphId}:${nodeId}`,
    graphId,
    nodeId,
    answerHash,
    contentHash,
    review,
    updatedAt: new Date().toISOString(),
  });
}

export async function saveCoachIteration(iteration) {
  const db = await getDb();
  const tx = db.transaction("coachIterations", "readwrite");
  await tx.store.put(iteration);
  await trimAttempts(tx, iteration.graphId, iteration.nodeId, MAX_COACH_ITERATIONS_PER_NODE);
  await tx.done;
}

export async function listCoachIterations(graphId, nodeId) {
  const db = await getDb();
  const tx = db.transaction("coachIterations", "readonly");
  const all = await tx.store.index("byNode").getAll(nodeRange(graphId, nodeId));
  await tx.done;
  return all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function updateCoachIterationMessages(iterationId, messages) {
  const db = await getDb();
  const tx = db.transaction("coachIterations", "readwrite");
  const iteration = await tx.store.get(iterationId);
  if (iteration) {
    await tx.store.put({
      ...iteration,
      messages: Array.isArray(messages) ? messages : [],
      chatUpdatedAt: new Date().toISOString(),
    });
  }
  await tx.done;
}

export async function updateCoachIterationReconciledHash(iterationId, reconciledHash) {
  const db = await getDb();
  const tx = db.transaction("coachIterations", "readwrite");
  const iteration = await tx.store.get(iterationId);
  if (iteration) {
    await tx.store.put({
      ...iteration,
      reconciledHash,
      reconciledAt: new Date().toISOString(),
    });
  }
  await tx.done;
}

export async function listAllAttempts() {
  const db = await getDb();
  const tx = db.transaction("attempts", "readonly");
  const all = await tx.store.getAll();
  await tx.done;
  return all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

const STATE_STORES = ["attempts", "drafts", "liveReviews", "coachIterations"];

export async function exportLearningState() {
  const db = await getDb();
  const tx = db.transaction(STATE_STORES, "readonly");
  const result = {};
  for (const name of STATE_STORES) {
    result[name] = await tx.objectStore(name).getAll();
  }
  await tx.done;
  return result;
}

export async function importLearningState(payload) {
  const db = await getDb();
  const tx = db.transaction(STATE_STORES, "readwrite");
  for (const name of STATE_STORES) {
    const store = tx.objectStore(name);
    await store.clear();
    const rows = Array.isArray(payload?.[name]) ? payload[name] : [];
    for (const row of rows) {
      if (row && typeof row === "object") await store.put(row);
    }
  }
  await tx.done;
}
