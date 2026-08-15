import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4223;
const artifactsDir = 'C:/Users/felix/.gemini/antigravity-cli/brain/74d15db1-8f18-431a-add7-e84366ad8288/smell_audit';

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

  // Desktop context
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dPage = await desktop.newPage();
  await dPage.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await dPage.waitForTimeout(800);

  // 1. Provider Catalog with Custom Scrollbar
  console.log("Auditing Provider Panel & Catalog Scrollbar...");
  await dPage.locator(".workspace-provider-toggle").click();
  await dPage.waitForTimeout(600);
  await capture(dPage, "01_provider_catalog_scrollbar.png");

  // Scroll provider category pills to the right to test scrollbar position
  const categoryNav = dPage.locator(".provider-category-nav");
  if (await categoryNav.isVisible()) {
    await categoryNav.evaluate((el) => { el.scrollLeft = 200; });
    await dPage.waitForTimeout(300);
    await capture(dPage, "02_provider_catalog_pills_scrolled.png");
  }

  // Click on a provider to inspect Editor
  const providerItem = dPage.locator(".provider-catalog-item").first();
  if (await providerItem.isVisible()) {
    await providerItem.click();
    await dPage.waitForTimeout(500);
    await capture(dPage, "03_provider_editor_clean.png");
    // Go back to catalog
    await dPage.locator('button[aria-label="Volver"]').click();
    await dPage.waitForTimeout(300);
  }

  // Close provider panel
  await dPage.locator(".workspace-provider-toggle").click();
  await dPage.waitForTimeout(400);

  // 2. Navigation Drawer (Accordion & Hierarchy)
  console.log("Auditing Navigation Drawer...");
  await dPage.locator(".workspace-nav-toggle").click();
  await dPage.waitForTimeout(500);
  await capture(dPage, "04_nav_drawer_open.png");
  await dPage.locator(".workspace-nav-toggle").click();
  await dPage.waitForTimeout(400);

  // 3. Progress & Seniority Milestones Drawer
  console.log("Auditing Progress & Seniority Drawer...");
  await dPage.locator(".progress-block").click();
  await dPage.waitForTimeout(500);
  await capture(dPage, "05_progress_drawer_open.png");
  await dPage.locator(".progress-block").click();
  await dPage.waitForTimeout(400);

  // 4. Lesson Modal (Reading View & Code)
  console.log("Auditing Lesson Reading View...");
  await dPage.locator(".guide-item, .route-preview-current button").first().click();
  await dPage.waitForTimeout(600);
  await capture(dPage, "06_lesson_reading_view.png");

  // 5. Lesson Modal (Split Studio Coaching)
  console.log("Auditing Lesson Split Studio Coaching...");
  await dPage.locator('.lesson-view-tabs button:has-text("Coaching")').first().click();
  await dPage.waitForTimeout(600);
  await capture(dPage, "07_lesson_split_studio_coaching.png");

  // 6. Lesson Modal (Evaluation Tab)
  console.log("Auditing Lesson Evaluation Tab...");
  await dPage.locator('.lesson-view-tabs button:has-text("Evaluar")').first().click();
  await dPage.waitForTimeout(600);
  await capture(dPage, "08_lesson_evaluation_view.png");
  await dPage.keyboard.press("Escape");
  await dPage.waitForTimeout(400);

  // 7. Mobile View Audit (390x844)
  console.log("Auditing Mobile View (390x844)...");
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mPage = await mobile.newPage();
  await mPage.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await mPage.waitForTimeout(800);
  await capture(mPage, "09_mobile_home.png");

  // Open Provider in Mobile
  await mPage.locator(".workspace-provider-toggle").click();
  await mPage.waitForTimeout(600);
  await capture(mPage, "10_mobile_provider_catalog_scrollbar.png");

  await browser.close();
  console.log("All visual smell audit captures completed successfully!");
} finally {
  server.close();
}
