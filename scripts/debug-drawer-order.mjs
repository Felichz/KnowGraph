import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4956;

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

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
};

await new Promise((resolve) => server.listen(PORT, resolve));

try {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await page.locator(".workspace-nav-toggle").first().click();
  await page.waitForTimeout(500);

  const drawerInfo = await page.evaluate(() => {
    const drawer = document.querySelector(".workspace-nav-drawer");
    if (!drawer) return "No drawer found";
    return Array.from(drawer.children).map((c) => ({
      class: c.className,
      order: window.getComputedStyle(c).order,
      top: c.getBoundingClientRect().top,
      height: c.getBoundingClientRect().height,
    }));
  });

  console.log("Drawer children info:", JSON.stringify(drawerInfo, null, 2));
  await browser.close();
} finally {
  server.close();
}
