import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

const GATEWAY_PORT = 4317;
const STATIC_PORT = 4173;

function isUp(url) {
  return fetch(url, { method: "GET" })
    .then(() => true)
    .catch(() => false);
}

async function waitFor(url, label, timeoutMs = 10000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    if (await isUp(url)) {
      console.log(`  ✓ ${label} up`);
      return;
    }
    await wait(200);
  }
  throw new Error(`${label} no respondió en ${timeoutMs}ms`);
}

async function ensureGateway() {
  if (await isUp(`http://127.0.0.1:${GATEWAY_PORT}/api/ai/status`)) {
    console.log("  ✓ gateway ya estaba corriendo");
    return;
  }
  console.log("  → arrancando gateway...");
  spawn("node", ["index.js"], {
    cwd: "C:\\Users\\felix\\dev\\learning\\server",
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  }).unref();
  await waitFor(`http://127.0.0.1:${GATEWAY_PORT}/api/ai/status`, "gateway");
}

async function ensureStatic() {
  if (await isUp(`http://127.0.0.1:${STATIC_PORT}/`)) {
    console.log("  ✓ static server ya estaba corriendo");
    return;
  }
  console.log("  → arrancando static server...");
  spawn("node", [`C:\\Users\\felix\\dev\\learning\\scripts\\serve-dist.mjs`], {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  }).unref();
  await waitFor(`http://127.0.0.1:${STATIC_PORT}/`, "static");
}

export default async function globalSetup() {
  console.log("[playwright setup]");
  await ensureGateway();
  await ensureStatic();
  console.log("[playwright setup] ok");
}
