import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4230;
const artifactsDir = 'C:/Users/felix/.gemini/antigravity-cli/brain/74d15db1-8f18-431a-add7-e84366ad8288/deep_smell_audit';

if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });

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

async function capture(page, name) {
  const file = path.join(artifactsDir, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`[Captured] ${name}`);
}

try {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  // 1. Node Hover State in Graph (highlighting edges)
  console.log("1. Capturing Node Hover in Graph...");
  const firstNode = page.locator(".topology-node").first();
  if (await firstNode.isVisible()) {
    await firstNode.hover();
    await page.waitForTimeout(300);
    await capture(page, "01_node_hover_highlight.png");
  }

  // 2. Filter Category in Graph (e.g. single category focused)
  console.log("2. Capturing Category Filter in Navigation Drawer...");
  await page.locator(".workspace-nav-toggle").click();
  await page.waitForTimeout(400);
  const secondCatBtn = page.locator(".category-filter-item, .category-filter-button").nth(1);
  if (await secondCatBtn.isVisible()) {
    await secondCatBtn.click();
    await page.waitForTimeout(400);
    await capture(page, "02_single_category_filtered.png");
    // Reset to Todos
    const todosBtn = page.locator('button:has-text("Todos")').first();
    if (await todosBtn.isVisible()) await todosBtn.click();
  }
  await page.locator(".workspace-nav-toggle").click();
  await page.waitForTimeout(300);

  // 3. Switch to Rails Graph
  console.log("3. Capturing Rails Graph...");
  await page.locator(".workspace-nav-toggle").click();
  await page.waitForTimeout(400);
  const railsGraphBtn = page.locator('button:has-text("Rails entrevistas")').first();
  if (await railsGraphBtn.isVisible()) {
    await railsGraphBtn.click();
    await page.waitForTimeout(600);
    await page.locator(".workspace-nav-toggle").click();
    await page.waitForTimeout(400);
    await capture(page, "03_rails_graph_view.png");

    // Switch back to React
    await page.locator(".workspace-nav-toggle").click();
    await page.waitForTimeout(400);
    const reactGraphBtn = page.locator('button:has-text("React entrevistas")').first();
    if (await reactGraphBtn.isVisible()) await reactGraphBtn.click();
    await page.waitForTimeout(600);
    await page.locator(".workspace-nav-toggle").click();
    await page.waitForTimeout(400);
  }

  // 4. Open Lesson with Code Block & Deep Dive
  console.log("4. Capturing Code Block & Info in Lesson...");
  await page.locator(".guide-item, .route-preview-current button").first().click();
  await page.waitForTimeout(600);

  // Scroll down to code snippet
  const codeBlock = page.locator(".lesson-example-section");
  if (await codeBlock.isVisible()) {
    await codeBlock.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await capture(page, "04_lesson_code_snippet.png");

    // Click code explanation info button
    const infoBtn = page.locator(".code-info-button").first();
    if (await infoBtn.isVisible()) {
      await infoBtn.click();
      await page.waitForTimeout(300);
      await capture(page, "05_lesson_code_explanation_open.png");
    }
  }

  // 5. Coaching Live Drafting & Simulated Text
  console.log("5. Capturing Live Coaching with drafted text...");
  const coachTab = page.locator('.lesson-view-tabs button:has-text("Coaching")').first();
  await coachTab.click();
  await page.waitForTimeout(400);

  const draftTextarea = page.locator(".paraphrase-review__input, textarea").first();
  if (await draftTextarea.isVisible()) {
    await draftTextarea.fill(
      "JavaScript moderno aporta closures para capturar el estado del render, módulos para aislar componentes, Promises para manejar asincronía en fetches y patrones de inmutabilidad para evitar mutaciones directas que rompen el shallow compare de React."
    );
    await page.waitForTimeout(800);
    await capture(page, "06_coaching_live_drafting_with_text.png");
  }

  // Close Lesson
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // 6. Tablet Breakpoint (1024x768)
  console.log("6. Capturing Tablet View (1024x768)...");
  const tablet = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const tPage = await tablet.newPage();
  await tPage.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await tPage.waitForTimeout(800);
  await capture(tPage, "07_tablet_overview.png");

  // Open Lesson in Tablet
  await tPage.locator(".guide-item, .route-preview-current button").first().click();
  await tPage.waitForTimeout(600);
  await capture(tPage, "08_tablet_lesson_reading.png");

  // Switch to Coaching in Tablet
  const tCoachTab = tPage.locator('.lesson-view-tabs button:has-text("Coaching")').first();
  await tCoachTab.click();
  await tPage.waitForTimeout(600);
  await capture(tPage, "09_tablet_split_studio.png");

  // 7. Mobile Breakpoint (390x844) Lesson Modal
  console.log("7. Capturing Mobile Lesson Modal (390x844)...");
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mPage = await mobile.newPage();
  await mPage.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await mPage.waitForTimeout(800);

  await mPage.locator(".guide-item, .route-preview-current button").first().click();
  await mPage.waitForTimeout(600);
  await capture(mPage, "10_mobile_lesson_reading.png");

  const mCoachTab = mPage.locator('.lesson-view-tabs button:has-text("Coaching")').first();
  await mCoachTab.click();
  await mCoachTab.scrollIntoViewIfNeeded();
  await mPage.waitForTimeout(600);
  await capture(mPage, "11_mobile_lesson_coaching.png");

  await browser.close();
  console.log("Deep smell audit captures completed!");
} finally {
  server.close();
}
