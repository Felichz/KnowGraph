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

  // 1. Workspace
  await page.goto("http://127.0.0.1:4173/");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(500);
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

  // 5. Flashcards
  await page.getByRole("button", { name: "Flashcards" }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "05-flashcards-grid.png") });

  // 6. Seniority Panel
  const seniorityBtn = page.locator("header button[aria-label='Ver Mapa de Seniority y Milestones']");
  await seniorityBtn.click();
  await page.waitForSelector('div[aria-label="Panel de Seniority y Milestones"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "06-seniority-panel.png") });
  const closeBtn = page.locator('div[aria-label="Panel de Seniority y Milestones"] button').filter({ hasText: "×" });
  await closeBtn.click();
  await page.waitForTimeout(300);

  // 7. BYOK Settings Modal
  const settingsBtn = page.locator("header button").filter({ hasText: /BYOK/ });
  await settingsBtn.click();
  await page.waitForSelector('div[role="dialog"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "07-byok-settings-modal.png") });

  await browser.close();
  console.log("All showcase screenshots captured successfully in tmp/showcase/!");
}

capture().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
