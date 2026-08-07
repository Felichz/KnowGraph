// Smoke test del gateway. Uso fetch nativo de Node 18+.
// Ejecutar desde server/: node smoke.mjs

const BASE = process.env.SMOKE_BASE ?? "http://127.0.0.1:4317";

async function expect(path, init, expectedStatus) {
  try {
    const res = await fetch(`${BASE}${path}`, init);
    const text = await res.text();
    const ok = res.status === expectedStatus;
    console.log(`${ok ? "✓" : "✗"} ${init?.method ?? "GET"} ${path} → ${res.status} (expected ${expectedStatus})`);
    if (!ok || process.env.VERBOSE) {
      console.log("  body:", text.slice(0, 300));
    }
    return { ok, status: res.status, body: text };
  } catch (e) {
    console.log(`✗ ${init?.method ?? "GET"} ${path} → ERROR ${e.message}`);
    return { ok: false };
  }
}

await expect("/api/ai/status", undefined, 200);

await expect("/api/ai/evaluate", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }, 400);
await expect("/api/ai/evaluate", { method: "POST", headers: { "Content-Type": "application/json" }, body: "not json" }, 400);

// Con token "replace-me" esperamos 401 del upstream
const validPayload = {
  graphId: "react",
  nodeId: "smoke",
  answer: "Una explicación de prueba.",
  contentHash: "sha256:smoke",
  node: { id: "smoke", label: "Smoke", lesson: { summary: "X", why: "", explanation: "", steps: [], pitfalls: [] } },
};
await expect("/api/ai/evaluate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(validPayload),
}, 401);

console.log("done");
