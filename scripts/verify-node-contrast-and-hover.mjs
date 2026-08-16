import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4545;
const artifactsDir = 'C:/Users/felix/.gemini/antigravity-cli/brain/74d15db1-8f18-431a-add7-e84366ad8288/contrast_audit';

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

  // 1. Normal state: All nodes solid, crisp, completed/uncompleted contrast
  console.log("1. Capturing normal graph state with solid cards...");
  await capture(page, "01_normal_graph_all_nodes_solid.png");

  // 2. Hover on node 2 (Modelo mental: UI como función del estado)
  // This node has incoming ancestor from node 1 and outgoing descendant to stage 3
  console.log("2. Hovering node 2 to verify relational network and dimming of unrelated nodes...");
  const secondNode = page.locator(".topology-node").nth(1);
  if (await secondNode.isVisible()) {
    await secondNode.hover();
    await page.waitForTimeout(400);
    await capture(page, "02_node_hover_focus_ancestors_and_descendants.png");
  }

  // 3. Hover on node 1 (JavaScript moderno para leer React)
  console.log("3. Hovering node 1...");
  const firstNode = page.locator(".topology-node").first();
  if (await firstNode.isVisible()) {
    await firstNode.hover();
    await page.waitForTimeout(400);
    await capture(page, "03_node1_hover_outgoing_network.png");
  }

  // 4. Hover on node in stage 4 (Error boundaries)
  console.log("4. Hovering stage 4 node...");
  const stage4Node = page.locator('.topology-node:has-text("Error boundaries")').first();
  if (await stage4Node.isVisible()) {
    await stage4Node.hover();
    await page.waitForTimeout(400);
    await capture(page, "04_stage4_node_hover_ancestor_chain.png");
  }

  await browser.close();
  console.log("Contrast and hover verification completed successfully!");
} finally {
  server.close();
}
