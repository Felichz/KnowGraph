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

  // Seed boundary fixture into IndexedDB so Stage 4, nodes, and progress have full realistic data
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

  // 1. Workspace Cockpit (Top view)
  await page.screenshot({ path: path.join(outDir, "01-workspace-cockpit-top.png") });

  // 2. Workspace Cockpit (Scrolled down)
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "02-workspace-cockpit-scrolled.png") });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);

  // 3. Workspace Cockpit with Category Filter active
  const stateCatBtn = page.getByRole("button", { name: /Estado & datos/i });
  if (await stateCatBtn.isVisible()) {
    await stateCatBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, "03-workspace-filtered-category.png") });
    // Reset back to Todos
    await page.getByRole("button", { name: /Todos/i }).click();
    await page.waitForTimeout(200);
  }

  // 4. SVG Topology View (Initial)
  const topologyBtn = page.getByRole("button", { name: /Topología SVG/i });
  await topologyBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, "04-topology-svg-initial.png") });

  // 5. SVG Topology View (Zoomed in)
  const zoomInBtn = page.getByRole("button", { name: "+" });
  if (await zoomInBtn.isVisible()) {
    await zoomInBtn.click();
    await page.waitForTimeout(150);
    await zoomInBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, "05-topology-svg-zoomed.png") });
  }

  // Back to Grid view
  await page.getByRole("button", { name: /Cuadrícula/i }).click();
  await page.waitForTimeout(300);

  // 6. Flashcards Grid
  await page.getByRole("button", { name: "Flashcards" }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "06-flashcards-grid.png") });

  // 7. Flashcard Flipped (3D recall)
  const firstFlashcard = page.getByTestId("flashcard-card").first();
  await firstFlashcard.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, "07-flashcard-flipped.png") });

  // Return to Grafo view
  await page.locator("header button").filter({ hasText: /^Grafo$/ }).click();
  await page.waitForTimeout(300);

  // 8. Study Modal Stage 1 (Leer - Top)
  const node = page.locator("main article").filter({ hasText: /Estado, snapshots y batching/ });
  await node.click();
  await page.waitForSelector('div[role="dialog"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "08-study-read-top.png") });

  // 9. Study Modal Stage 1 (Scrolled to Code Comparison)
  await page.evaluate(() => {
    const scrollers = document.querySelectorAll('div[role="dialog"] div');
    for (const el of scrollers) {
      if (el.scrollHeight > el.clientHeight && el.clientHeight > 200) {
        el.scrollTop = 380;
      }
    }
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "09-study-read-scroll-code.png") });

  // 10. Study Modal Stage 1 (Scrolled to FAANG questions & expanded)
  const modalDialog = page.locator('div[role="dialog"]');
  const faangSummary = modalDialog.locator("summary").filter({ hasText: /Preguntas de Entrevista FAANG/i });
  if (await faangSummary.isVisible()) {
    await faangSummary.click();
    await page.waitForTimeout(300);
  }
  await page.evaluate(() => {
    const scrollers = document.querySelectorAll('div[role="dialog"] div');
    for (const el of scrollers) {
      if (el.scrollHeight > el.clientHeight && el.clientHeight > 200) {
        el.scrollTop = 900;
      }
    }
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "10-study-read-scroll-faang.png") });

  // 11. Study Modal Zen Mode (Top)
  const zenBtn = modalDialog.getByRole("button", { name: /Modo Zen/i });
  if (await zenBtn.isVisible()) {
    await zenBtn.click();
    await page.waitForTimeout(400);
    // Scroll to top of zen
    await page.evaluate(() => {
      const scrollers = document.querySelectorAll('div[role="dialog"] div');
      for (const el of scrollers) {
        if (el.scrollHeight > el.clientHeight && el.clientHeight > 200) {
          el.scrollTop = 0;
        }
      }
    });
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(outDir, "11-study-zen-mode-top.png") });

    // 12. Study Modal Zen Mode (Scrolled)
    await page.evaluate(() => {
      const scrollers = document.querySelectorAll('div[role="dialog"] div');
      for (const el of scrollers) {
        if (el.scrollHeight > el.clientHeight && el.clientHeight > 200) {
          el.scrollTop = 500;
        }
      }
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, "12-study-zen-mode-scroll.png") });

    // Exit Zen Mode with "Salir de Zen"
    const exitZenBtn = page.getByRole("button", { name: /Salir de Zen/i });
    if (await exitZenBtn.isVisible()) {
      await exitZenBtn.click();
      await page.waitForTimeout(300);
    }
  }

  // 13. Study Modal Stage 2 (Aprender)
  await modalDialog.getByRole("button", { name: /Aprender/ }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "13-study-learn-tab.png") });

  // 14. Study Modal Stage 3 (Parafrasear)
  await modalDialog.getByRole("button", { name: /Parafrasear/ }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "14-study-paraphrase-tab.png") });

  // Close modal
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 15. Study Modal Stage 4 (Evaluar) on evaluated node
  const jsNode = page.locator("main article").first();
  await jsNode.click();
  await page.waitForSelector('div[role="dialog"]');
  const jsModal = page.locator('div[role="dialog"]');
  await jsModal.getByRole("button", { name: "04 Evaluar", exact: true }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "15-study-evaluate-tab-score.png") });

  // 16. Study Modal Stage 4 Scrolled to attempts history
  await page.evaluate(() => {
    const scrollers = document.querySelectorAll('div[role="dialog"] div');
    for (const el of scrollers) {
      if (el.scrollHeight > el.clientHeight && el.clientHeight > 200) {
        el.scrollTop = 500;
      }
    }
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "16-study-evaluate-tab-history.png") });

  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 17. Command Palette Empty
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "17-command-palette-empty.png") });

  // 18. Command Palette Search
  const paletteInput = page.getByPlaceholder(/Buscar concepto o acción/i);
  await paletteInput.fill("batching");
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "18-command-palette-search.png") });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 19. Seniority Panel Top
  const seniorityBtn = page.locator("header button[aria-label='Ver Mapa de Seniority y Milestones']");
  await seniorityBtn.click();
  await page.waitForSelector('div[aria-label="Panel de Seniority y Milestones"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "19-seniority-panel-top.png") });

  // 20. Seniority Panel Scrolled
  await page.evaluate(() => {
    const panel = document.querySelector('div[aria-label="Panel de Seniority y Milestones"]');
    if (panel) {
      const scrollable = panel.querySelector('div[style*="overflow-y: auto"], div[style*="overflowY: auto"]') || panel;
      scrollable.scrollTop = 500;
    }
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "20-seniority-panel-scroll.png") });
  const closeSeniorityBtn = page.locator('div[aria-label="Panel de Seniority y Milestones"] button').filter({ hasText: "×" });
  await closeSeniorityBtn.click();
  await page.waitForTimeout(300);

  // 21. BYOK Settings Modal
  const settingsBtn = page.locator("header button").filter({ hasText: /BYOK/ });
  await settingsBtn.click();
  await page.waitForSelector('div[role="dialog"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "21-byok-settings-modal.png") });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 22. Mobile Viewport (Workspace Top)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "22-mobile-workspace-top.png") });

  // 23. Mobile Workspace Scrolled
  await page.evaluate(() => window.scrollTo(0, 450));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "23-mobile-workspace-scrolled.png") });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);

  // 24. Mobile Flashcards
  const mobileNav = page.locator("nav.mobile-bottom-nav");
  await mobileNav.getByRole("button", { name: "Flashcards" }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "24-mobile-flashcards.png") });

  // 25. Mobile Study Modal
  await mobileNav.getByRole("button", { name: "Grafo" }).click();
  await page.waitForTimeout(300);
  const mobileNode = page.locator("main article").first();
  await mobileNode.click();
  await page.waitForSelector('div[role="dialog"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "25-mobile-study-modal.png") });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 26. Mobile Bottom Navigation Active
  await page.screenshot({ path: path.join(outDir, "26-mobile-bottom-nav-active.png") });

  await browser.close();
  console.log("Full 26-view visual coverage suite captured in tmp/showcase/!");
}

capture().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
