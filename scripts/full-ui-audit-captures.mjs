import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4198;
const artifactsDir = 'C:/Users/felix/.gemini/antigravity-cli/brain/74d15db1-8f18-431a-add7-e84366ad8288/audit';
const testResultsDir = path.resolve(__dirname, "..", "test-results", "audit");

for (const dir of [artifactsDir, testResultsDir]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".mjs":  "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".ico":  "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf":  "font/ttf",
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split("?")[0];
  if (reqPath === "/" || !path.extname(reqPath)) reqPath = "/index.html";
  const filePath = path.join(DIST, reqPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(DIST, "index.html"), (err2, indexData) => {
        if (err2) {
          res.statusCode = 404;
          res.end("Not found");
          return;
        }
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(indexData);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.setHeader("Content-Type", MIME[ext] ?? "application/octet-stream");
    res.end(data);
  });
});

await new Promise((resolve) => server.listen(PORT, resolve));
console.log(`Audit server running on http://127.0.0.1:${PORT}`);

async function saveScreenshot(page, filename) {
  const p1 = path.join(artifactsDir, filename);
  const p2 = path.join(testResultsDir, filename);
  await page.screenshot({ path: p1, fullPage: false });
  await page.screenshot({ path: p2, fullPage: false });
  console.log(`Captured: ${filename}`);
}

try {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 1. Desktop Graph Overview
  await saveScreenshot(page, "01_desktop_graph_overview.png");

  // 2. Open Navigation Sidebar
  console.log("Opening nav sidebar...");
  const navToggle = page.locator(".workspace-nav-toggle").first();
  if (await navToggle.isVisible()) {
    await navToggle.click();
    await page.waitForTimeout(600);
    await saveScreenshot(page, "02_desktop_nav_sidebar_open.png");

    // 3. Switch to Flashcards mode from sidebar
    console.log("Switching to flashcards mode...");
    const flashcardsToggle = page.locator('.graph-switcher button:has-text("Flashcards"), .view-mode-toggle button:has-text("Flashcards")').first();
    if (await flashcardsToggle.isVisible()) {
      await flashcardsToggle.click();
      await page.waitForTimeout(700);
      await saveScreenshot(page, "09_desktop_flashcards_view.png");

      // Switch back to Graph mode
      const graphToggle = page.locator('.graph-switcher button:has-text("Grafo"), .view-mode-toggle button:has-text("Grafo")').first();
      if (await graphToggle.isVisible()) await graphToggle.click();
      await page.waitForTimeout(600);
    }

    // Close nav sidebar
    await navToggle.click();
    await page.waitForTimeout(400);
  }

  // 4. Open Progress Panel
  console.log("Opening progress panel...");
  const progressBlock = page.locator(".progress-block").first();
  if (await progressBlock.isVisible()) {
    await progressBlock.click();
    await page.waitForTimeout(600);
    await saveScreenshot(page, "03_desktop_progress_panel_open.png");

    // Close progress panel
    await progressBlock.click();
    await page.waitForTimeout(400);
  }

  // 5. Open Provider Panel (Catalog)
  console.log("Opening provider panel...");
  const providerToggle = page.locator(".workspace-provider-toggle");
  if (await providerToggle.isVisible()) {
    await providerToggle.click();
    await page.waitForTimeout(600);
    await saveScreenshot(page, "04_desktop_provider_catalog.png");

    // Click Custom endpoint to see editor form
    const customBtn = page.locator(".provider-directory__custom");
    if (await customBtn.isVisible()) {
      await customBtn.click();
      await page.waitForTimeout(500);
      await saveScreenshot(page, "05_desktop_provider_editor.png");

      const backBtn = page.locator('.workspace-provider-panel__header button[aria-label="Volver"]').first();
      if (await backBtn.isVisible()) await backBtn.click();
      await page.waitForTimeout(400);
    }

    await providerToggle.click();
    await page.waitForTimeout(400);
  }

  // 6. Open Lesson Card Modal (Lectura, Coaching, Evaluación)
  console.log("Opening lesson card modal...");
  const guideItem = page.locator(".guide-item, .route-preview-current button").first();
  if (await guideItem.isVisible()) {
    await guideItem.click();
    await page.waitForTimeout(800);
    await saveScreenshot(page, "06_desktop_lesson_read.png");

    // Coaching Tab
    const coachTab = page.locator('.lesson-view-tabs button:has-text("Coaching")').first();
    if (await coachTab.isVisible()) {
      await coachTab.click();
      await page.waitForTimeout(600);
      await saveScreenshot(page, "07_desktop_lesson_coach.png");
    }

    // Evaluate Tab
    const evalTab = page.locator('.lesson-view-tabs button:has-text("Evaluar")').first();
    if (await evalTab.isVisible()) {
      await evalTab.click();
      await page.waitForTimeout(600);
      await saveScreenshot(page, "08_desktop_lesson_evaluate.png");
    }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
  }

  // 7. Tablet Viewport
  console.log("Capturing tablet view...");
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForTimeout(500);
  await saveScreenshot(page, "10_tablet_graph_overview.png");

  // 8. Mobile Viewport
  console.log("Capturing mobile views...");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await saveScreenshot(page, "11_mobile_graph_overview.png");

  // Mobile nav
  const mobileNav = page.locator(".workspace-nav-toggle").first();
  if (await mobileNav.isVisible()) {
    await mobileNav.click();
    await page.waitForTimeout(500);
    await saveScreenshot(page, "12_mobile_sidebar_open.png");
    await mobileNav.click();
    await page.waitForTimeout(400);
  }

  // Mobile lesson modal
  const mobileGuideItem = page.locator(".guide-item").first();
  if (await mobileGuideItem.isVisible()) {
    await mobileGuideItem.click();
    await page.waitForTimeout(800);
    await saveScreenshot(page, "13_mobile_lesson_modal.png");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
  }

  await browser.close();
  console.log("All UI audit captures finished successfully!");
} finally {
  server.close();
}
