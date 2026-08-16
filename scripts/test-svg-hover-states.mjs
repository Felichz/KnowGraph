import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4950;
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
  await page.waitForTimeout(1200);

  // 1. Default View: Completed & Guide nodes stand out at 100%, uncompleted nodes are transparent (0.42)
  console.log("1. Capturing default view...");
  await page.screenshot({ path: path.join(artifactsDir, "01_default_view_uncompleted_transparent.png") });

  // 2. Hover first node (JavaScript moderno para leer React)
  console.log("2. Hovering first node...");
  await page.locator(".topology-node").first().dispatchEvent("pointerenter");
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactsDir, "02_hover_node1_network.png") });

  // 3. Hover second node (Modelo mental: UI como función del estado)
  console.log("3. Hovering second node...");
  await page.locator(".topology-node").nth(1).dispatchEvent("pointerenter");
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactsDir, "03_hover_node2_network.png") });

  // 4. Hover third node (Componentes, props y composición)
  console.log("4. Hovering third node...");
  await page.locator(".topology-node").nth(2).dispatchEvent("pointerenter");
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactsDir, "04_hover_node3_network.png") });

  // 5. Pointer leave (return to default view)
  console.log("5. Leaving hover...");
  await page.locator(".topology-node").nth(2).dispatchEvent("pointerleave");
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactsDir, "05_back_to_default_view.png") });

  await browser.close();
  console.log("All 5 state screenshots captured successfully!");
} finally {
  server.close();
}
