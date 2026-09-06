import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

const outDir = path.resolve("tmp", "showcase");
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

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

  // Seed boundary fixture into IndexedDB
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

  // US1-Scen01: Workspace Cockpit Grid (Top)
  await page.screenshot({ path: path.join(outDir, "US1-Scen01-Desktop-CockpitGrid.png") });

  // US1-Scen01: Workspace Cockpit Grid (Scrolled)
  await page.evaluate(() => window.scrollTo(0, 450));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "US1-Scen01-Desktop-CockpitScrolled.png") });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);

  // US1-Scen02: Rails Graph Switcher
  const railsBtn = page.locator("header button").filter({ hasText: /^Rails$/ });
  if (await railsBtn.isVisible()) {
    await railsBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(outDir, "US1-Scen02-Desktop-RailsGraph.png") });
    // Switch back to React
    await page.locator("header button").filter({ hasText: /^React$/ }).click();
    await page.waitForTimeout(300);
  }

  // US1-Scen03: Category Filter Active
  const stateCatBtn = page.getByRole("button", { name: /Estado & datos/i });
  if (await stateCatBtn.isVisible()) {
    await stateCatBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, "US1-Scen03-Desktop-CategoryFilter.png") });
    await page.getByRole("button", { name: /Todos/i }).click();
    await page.waitForTimeout(200);
  }

  // US1-Scen09: SVG Topology View (Initial)
  const topologyBtn = page.getByRole("button", { name: /Topología SVG/i });
  await topologyBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, "US1-Scen09-Desktop-TopologySVG.png") });

  // US1-Scen09: SVG Topology View (Zoomed)
  const zoomInBtn = page.getByRole("button", { name: "+" });
  if (await zoomInBtn.isVisible()) {
    await zoomInBtn.click();
    await page.waitForTimeout(150);
    await zoomInBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, "US1-Scen09-Desktop-TopologySVGZoomed.png") });
  }

  // Return to Grid view
  await page.getByRole("button", { name: /Cuadrícula/i }).click();
  await page.waitForTimeout(300);

  // US6-Scen01: Flashcards Grid
  await page.getByRole("button", { name: "Flashcards" }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "US6-Scen01-Desktop-FlashcardsGrid.png") });

  // US6-Scen02: Flashcard Flipped (3D recall)
  const firstFlashcard = page.getByTestId("flashcard-card").first();
  await firstFlashcard.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, "US6-Scen02-Desktop-FlashcardFlipped.png") });

  // Return to Grafo view
  await page.locator("header button").filter({ hasText: /^Grafo$/ }).click();
  await page.waitForTimeout(300);

  // US2-Scen01: Study Modal Stage 1 (Leer - Top)
  const node = page.locator("main article").filter({ hasText: /Estado, snapshots y batching/ });
  await node.click();
  await page.waitForSelector('div[role="dialog"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "US2-Scen01-Desktop-StudyReadTop.png") });

  // US2-Scen01: Study Modal Stage 1 (Scrolled to Code Comparison)
  await page.evaluate(() => {
    const scrollers = document.querySelectorAll('div[role="dialog"] div');
    for (const el of scrollers) {
      if (el.scrollHeight > el.clientHeight && el.clientHeight > 200) {
        el.scrollTop = 380;
      }
    }
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "US2-Scen01-Desktop-StudyReadCode.png") });

  // US2-Scen03: Study Modal Stage 1 (Scrolled to FAANG questions)
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
  await page.screenshot({ path: path.join(outDir, "US2-Scen03-Desktop-StudyReadFAANG.png") });

  // US2-Scen07: Study Modal Zen Mode
  const zenBtn = modalDialog.getByRole("button", { name: /Modo Zen/i });
  if (await zenBtn.isVisible()) {
    await zenBtn.click();
    await page.waitForTimeout(400);
    await page.evaluate(() => {
      const scrollers = document.querySelectorAll('div[role="dialog"] div');
      for (const el of scrollers) {
        if (el.scrollHeight > el.clientHeight && el.clientHeight > 200) {
          el.scrollTop = 0;
        }
      }
    });
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(outDir, "US2-Scen07-Desktop-StudyZenMode.png") });

    const exitZenBtn = page.getByRole("button", { name: /Salir de Zen/i });
    if (await exitZenBtn.isVisible()) {
      await exitZenBtn.click();
      await page.waitForTimeout(300);
    }
  }

  // US2-Scen08: Study Modal Stage 2 (Aprender)
  await modalDialog.getByRole("button", { name: /Aprender/ }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "US2-Scen08-Desktop-StudyLearnStage.png") });

  // US2-Scen11: Study Modal Stage 3 (Parafrasear)
  await modalDialog.getByRole("button", { name: /Parafrasear/ }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "US2-Scen11-Desktop-StudyParaphrase.png") });

  // Close modal
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // US2-Scen14: Study Modal Stage 4 (Evaluar - Scorecard)
  const jsNode = page.locator("main article").first();
  await jsNode.click();
  await page.waitForSelector('div[role="dialog"]');
  const jsModal = page.locator('div[role="dialog"]');
  await jsModal.getByRole("button", { name: "04 Evaluar", exact: true }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "US2-Scen14-Desktop-StudyEvaluateScore.png") });

  // US2-Scen15: Study Modal Stage 4 (Evaluar - History)
  await page.evaluate(() => {
    const scrollers = document.querySelectorAll('div[role="dialog"] div');
    for (const el of scrollers) {
      if (el.scrollHeight > el.clientHeight && el.clientHeight > 200) {
        el.scrollTop = 500;
      }
    }
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "US2-Scen15-Desktop-StudyEvaluateHistory.png") });

  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // US1-Scen04: Command Palette Empty
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "US1-Scen04-Desktop-CommandPalette.png") });

  // US1-Scen04: Command Palette Search
  const paletteInput = page.getByPlaceholder(/Buscar concepto o acción/i);
  await paletteInput.fill("batching");
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "US1-Scen04-Desktop-CommandPaletteSearch.png") });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // US1-Scen06: Seniority Panel Top
  const seniorityBtn = page.locator("header button[aria-label='Ver Mapa de Seniority y Milestones']");
  await seniorityBtn.click();
  await page.waitForSelector('div[aria-label="Panel de Seniority y Milestones"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "US1-Scen06-Desktop-SeniorityTop.png") });

  // US1-Scen06: Seniority Panel Scrolled
  await page.evaluate(() => {
    const panel = document.querySelector('div[aria-label="Panel de Seniority y Milestones"]');
    if (panel) {
      const scrollable = panel.querySelector('div[style*="overflow-y: auto"], div[style*="overflowY: auto"]') || panel;
      scrollable.scrollTop = 500;
    }
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "US1-Scen06-Desktop-SeniorityScroll.png") });
  const closeSeniorityBtn = page.locator('div[aria-label="Panel de Seniority y Milestones"] button').filter({ hasText: "×" });
  await closeSeniorityBtn.click();
  await page.waitForTimeout(300);

  // US3-Scen01: BYOK Settings Modal
  const settingsBtn = page.locator("header button").filter({ hasText: /BYOK/ });
  await settingsBtn.click();
  await page.waitForSelector('div[role="dialog"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "US3-Scen01-Desktop-BYOKSettings.png") });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // US7-Scen01: Mobile Viewport (Workspace Top)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "US7-Scen01-Mobile-WorkspaceTop.png") });

  // US7-Scen01: Mobile Workspace Scrolled
  await page.evaluate(() => window.scrollTo(0, 450));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, "US7-Scen01-Mobile-WorkspaceScrolled.png") });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);

  // US7-Scen02: Mobile Flashcards
  const mobileNav = page.locator("nav.mobile-bottom-nav");
  await mobileNav.getByRole("button", { name: "Flashcards" }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "US7-Scen02-Mobile-Flashcards.png") });

  // US7-Scen02: Mobile Study Modal
  await mobileNav.getByRole("button", { name: "Grafo" }).click();
  await page.waitForTimeout(300);
  const mobileNode = page.locator("main article").first();
  await mobileNode.click();
  await page.waitForSelector('div[role="dialog"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, "US7-Scen02-Mobile-StudyModal.png") });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // US7-Scen01: Mobile Bottom Navigation Active
  await page.screenshot({ path: path.join(outDir, "US7-Scen01-Mobile-BottomNavActive.png") });

  await browser.close();
  console.log("Spec-mapped visual coverage suite captured successfully in tmp/showcase/!");
}

capture().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
