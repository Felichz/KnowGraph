import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4235;
const artifactsDir = 'C:/Users/felix/.gemini/antigravity-cli/brain/74d15db1-8f18-431a-add7-e84366ad8288/graph_audit';

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
  
  // 1. Desktop Standard 1440x900
  const context1440 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context1440.newPage();
  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await capture(page, "01_main_graph_desktop_1440.png");

  // 2. Click Zoom In twice
  const zoomInBtn = page.locator('button[aria-label="Acercar zoom"], button[title="Acercar zoom"]').first();
  if (await zoomInBtn.isVisible()) {
    await zoomInBtn.click();
    await page.waitForTimeout(200);
    await zoomInBtn.click();
    await page.waitForTimeout(300);
    await capture(page, "02_main_graph_zoomed_in.png");
  }

  // 3. Wide Desktop 1920x1080
  const context1080 = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const pageWide = await context1080.newPage();
  await pageWide.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await pageWide.waitForTimeout(800);
  await capture(pageWide, "03_main_graph_wide_1080.png");

  // 4. Hover on stage 2 node
  const node2 = pageWide.locator(".topology-node").nth(1);
  if (await node2.isVisible()) {
    await node2.hover();
    await pageWide.waitForTimeout(300);
    await capture(pageWide, "04_main_graph_hover_stage2.png");
  }

  // 5. Hover on stage 3 node
  const node3 = pageWide.locator(".topology-node").nth(2);
  if (await node3.isVisible()) {
    await node3.hover();
    await pageWide.waitForTimeout(300);
    await capture(pageWide, "05_main_graph_hover_stage3.png");
  }

  await browser.close();
  console.log("Graph audit captures completed!");
} finally {
  server.close();
}
