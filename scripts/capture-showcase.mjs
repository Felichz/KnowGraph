import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

const outDir = path.resolve("tmp", "showcase");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function isUp(url) {
  return fetch(url, { method: "GET" }).then(() => true).catch(() => false);
}

async function ensureServer() {
  if (await isUp("http://127.0.0.1:4173/")) return;
  const proc = spawn("node", ["scripts/serve-dist.mjs"], { cwd: process.cwd(), detached: true, stdio: "ignore", windowsHide: true });
  proc.unref();
  for (let i = 0; i < 30; i++) {
    if (await isUp("http://127.0.0.1:4173/")) return;
    await wait(200);
  }
}

async function capture() {
  await ensureServer();
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Seed boundary/evaluated fixture into IndexedDB so Stage 4 and node scores have rich data
  const boundaryFixture = JSON.parse(
    fs.readFileSync(path.resolve("tests", "fixtures", "workspace-boundary.json"), "utf8")
  );

  await page.goto("http://127.0.0.1:4173/");
  await page.waitForLoadState("domcontentloaded");

  await page.evaluate((backup) => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open("learning-graph-ai", 3);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction(["attempts", "drafts"], "readwrite");
        const attemptsStore = tx.objectStore("attempts");
        attemptsStore.clear();
        for (const item of backup.learning.attempts || []) {
          attemptsStore.put(item);
        }
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };
    });
  }, boundaryFixture);

  await page.reload();
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(500);

  // 1. Workspace Cockpit with scores and active nodes
  await page.screenshot({ path: path.join(outDir, "01-workspace-cockpit.png") });

  // 2. Study Modal Stage 1 (Leer)
  const node = page.locator("main article").filter({ hasText: /Estado, snapshots y batching/ });
  await node.click();
  await page.waitForSelector('div[role="dialog"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "02-study-modal-read.png") });

  // 3. Study Modal Stage 2 (Aprender)
  const modal = page.locator('div[role="dialog"]');
  await modal.getByRole("button", { name: /Aprender/ }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "03-study-modal-learn.png") });

  // 4. Study Modal Stage 3 (Parafrasear)
  await modal.getByRole("button", { name: /Parafrasear/ }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "04-study-modal-paraphrase.png") });

  // Close modal
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 5. Open evaluated node (js_basics) for Stage 4 (Evaluar)
  const jsNode = page.locator("main article").first();
  await jsNode.click();
  await page.waitForSelector('div[role="dialog"]');
  const jsModal = page.locator('div[role="dialog"]');
  await jsModal.getByRole("button", { name: "04 Evaluar", exact: true }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "05-study-modal-evaluate.png") });

  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 6. SVG Topology Canvas
  const topologyBtn = page.getByRole("button", { name: /Topología SVG/i });
  await topologyBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, "06-topology-svg.png") });

  // Switch back to grid
  await page.getByRole("button", { name: /Cuadrícula/i }).click();
  await page.waitForTimeout(300);

  // 7. Flashcards Grid
  await page.getByRole("button", { name: "Flashcards" }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "07-flashcards-grid.png") });

  // 8. Flipped Flashcard (3D recall)
  const firstCard = page.getByTestId("flashcard-card").first();
  await firstCard.click();
  await page.waitForTimeout(600); // 3D flip animation
  await page.screenshot({ path: path.join(outDir, "08-flashcard-flipped.png") });

  // 9. Command Palette (Ctrl+K)
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "09-command-palette.png") });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 10. Seniority & Milestones Panel
  const seniorityBtn = page.locator("header button[aria-label='Ver Mapa de Seniority y Milestones']");
  await seniorityBtn.click();
  await page.waitForSelector('div[aria-label="Panel de Seniority y Milestones"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "10-seniority-panel.png") });
  const closeBtn = page.locator('div[aria-label="Panel de Seniority y Milestones"] button').filter({ hasText: "×" });
  await closeBtn.click();
  await page.waitForTimeout(300);

  // 11. BYOK Settings Modal
  const settingsBtn = page.locator("header button").filter({ hasText: /BYOK/ });
  await settingsBtn.click();
  await page.waitForSelector('div[role="dialog"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "11-byok-settings-modal.png") });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 12. Mobile Viewport (iPhone / Pixel portrait)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "12-mobile-cockpit.png") });

  await browser.close();
  console.log("Complete visual suite captured in tmp/showcase/!");
}

capture().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
