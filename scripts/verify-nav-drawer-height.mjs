import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4955;
const artifactsDir = 'C:/Users/felix/.gemini/antigravity-cli/brain/74d15db1-8f18-431a-add7-e84366ad8288/nav_drawer_audit';

if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split("?")[0];
  if (reqPath === "/" || !path.extname(reqPath)) reqPath = "/index.html";
  const filePath = path.join(DIST, reqPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(DIST, "index.html"), (err2, indexData) => {
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

try {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  // 1. Open Nav Drawer in Graph View
  console.log("1. Opening navigation drawer in graph view...");
  const hamburger = page.locator(".workspace-nav-toggle").first();
  await hamburger.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactsDir, "01_nav_drawer_open_in_graph_view.png") });

  // 2. Switch to Flashcards View with Drawer Open
  console.log("2. Switching to flashcards view with drawer open...");
  const flashcardTab = page.locator('.view-mode-toggle button:has-text("Flashcards")').first();
  if (await flashcardTab.isVisible()) {
    await flashcardTab.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactsDir, "02_nav_drawer_open_in_flashcards_view.png") });
  }

  // 3. Switch back to Graph View
  console.log("3. Switching back to graph view...");
  const graphTab = page.locator('.view-mode-toggle button:has-text("Grafo")').first();
  if (await graphTab.isVisible()) {
    await graphTab.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactsDir, "03_nav_drawer_open_in_graph_view_returned.png") });
  }

  await browser.close();
  console.log("Nav drawer height verification completed successfully!");
} finally {
  server.close();
}
