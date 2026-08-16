import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4646;
const artifactsDir = 'C:/Users/felix/.gemini/antigravity-cli/brain/74d15db1-8f18-431a-add7-e84366ad8288/contrast_audit';

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
  await page.waitForTimeout(600);

  // Hover explicitly over the surface of node 2
  const surfaces = page.locator(".topology-node__surface");
  console.log(`Found ${await surfaces.count()} node surfaces`);
  
  await surfaces.nth(1).hover();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactsDir, "02_real_hover_node2.png") });

  await browser.close();
  console.log("Real hover screenshot captured!");
} finally {
  server.close();
}
