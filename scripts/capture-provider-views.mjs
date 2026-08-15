import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4188;
const artifactsDir = 'C:/Users/felix/.gemini/antigravity-cli/brain/74d15db1-8f18-431a-add7-e84366ad8288';
const testResultsDir = path.resolve(__dirname, "..", "test-results");

if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
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
  if (reqPath === "/" || !path.extname(reqPath)) {
    reqPath = "/index.html";
  }
  const filePath = path.join(DIST, reqPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fallback to index.html for SPA
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
console.log(`Static server running on http://127.0.0.1:${PORT}`);

try {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 1. Click provider toggle button in commandbar
  console.log("Opening provider panel...");
  const providerToggle = page.locator(".workspace-provider-toggle");
  await providerToggle.click();
  await page.waitForTimeout(600);

  // 2. Click "Agregar conexión" to go to catalog
  console.log("Navigating to catalog view...");
  const addBtn = page.locator(".provider-add-button, button:has-text('Agregar conexión')").first();
  if (await addBtn.isVisible()) {
    await addBtn.click();
    await page.waitForTimeout(600);
  }

  // Capture 1: All categories with Pills bar
  console.log("Capturing 1: Catalog with category pills...");
  const path1Artifact = path.join(artifactsDir, "catalog-all-categories.png");
  const path1Local = path.join(testResultsDir, "catalog-all-categories.png");
  await page.screenshot({ path: path1Artifact, fullPage: false });
  await page.screenshot({ path: path1Local, fullPage: false });

  // Capture 2: Click a specific category pill (e.g. second pill / "APIs directas" or "Routers")
  console.log("Capturing 2: Filtering by specific category pill...");
  const pills = page.locator(".provider-category-pill");
  const count = await pills.count();
  console.log(`Found ${count} category pills.`);
  if (count > 1) {
    await pills.nth(1).click();
    await page.waitForTimeout(400);
  }
  const path2Artifact = path.join(artifactsDir, "catalog-filtered-category.png");
  const path2Local = path.join(testResultsDir, "catalog-filtered-category.png");
  await page.screenshot({ path: path2Artifact, fullPage: false });
  await page.screenshot({ path: path2Local, fullPage: false });

  // Capture 3: Search interaction (typing in search box)
  console.log("Capturing 3: Search filtering with reactive counts & clear button...");
  const searchInput = page.locator(".provider-directory__search-input");
  await searchInput.fill("deepseek");
  await page.waitForTimeout(400);
  const path3Artifact = path.join(artifactsDir, "catalog-search-results.png");
  const path3Local = path.join(testResultsDir, "catalog-search-results.png");
  await page.screenshot({ path: path3Artifact, fullPage: false });
  await page.screenshot({ path: path3Local, fullPage: false });

  // Capture 4: Mobile viewport
  console.log("Capturing 4: Mobile view...");
  await page.setViewportSize({ width: 390, height: 844 });
  await searchInput.fill("");
  await page.waitForTimeout(400);
  const path4Artifact = path.join(artifactsDir, "catalog-mobile-view.png");
  const path4Local = path.join(testResultsDir, "catalog-mobile-view.png");
  await page.screenshot({ path: path4Artifact, fullPage: false });
  await page.screenshot({ path: path4Local, fullPage: false });

  await browser.close();
  console.log("All screenshots captured successfully!");
} finally {
  server.close();
}
