import { openDB } from "idb";

// IDBKeyRange es un global del browser. En Node 18+ también está disponible.
const keyRange = typeof IDBKeyRange !== "undefined" ? IDBKeyRange : undefined;

const DB_NAME = "learning-graph-ai";
const DB_VERSION = 1;
const MAX_ATTEMPTS_PER_NODE = 12;

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
  return value?.text ?? "";
}

export async function setDraft(graphId, nodeId, text) {
  const db = await getDb();
  const key = `${graphId}:${nodeId}`;
  if (!text) {
    await db.delete("drafts", key);
    return;
  }
  await db.put("drafts", { key, text, updatedAt: new Date().toISOString() });
}

export async function deleteDraft(graphId, nodeId) {
  const db = await getDb();
  await db.delete("drafts", `${graphId}:${nodeId}`);
}

export async function listAllAttempts() {
  const db = await getDb();
  const tx = db.transaction("attempts", "readonly");
  const all = await tx.store.getAll();
  await tx.done;
  return all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
