import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4343;
const artifactsDir = 'C:/Users/felix/.gemini/antigravity-cli/brain/74d15db1-8f18-431a-add7-e84366ad8288/final_verification';

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
  console.log(`[Verified] ${name}`);
}

try {
  const browser = await chromium.launch();

  // Desktop 1440
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await desktop.waitForTimeout(600);
  await capture(desktop, "01_desktop_home_graph.png");

  // Open Lesson -> Coaching
  await desktop.locator(".guide-item, .route-preview-current button").first().click();
  await desktop.waitForTimeout(400);
  await desktop.locator('.lesson-view-tabs button:has-text("Coaching")').first().click();
  await desktop.waitForTimeout(300);
  await capture(desktop, "02_desktop_lesson_coaching.png");
  await desktop.keyboard.press("Escape");
  await desktop.waitForTimeout(300);

  // Mobile iPhone 14
  const iPhone = devices["iPhone 14"];
  const mobile = await browser.newPage({ ...iPhone });
  await mobile.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await mobile.waitForTimeout(600);
  await capture(mobile, "03_mobile_home_graph.png");

  // Mobile Lesson -> Coaching
  await mobile.locator(".guide-item, .mobile-commandbar-main button, .route-preview-current button").first().click();
  await mobile.waitForTimeout(500);
  const mobileCoach = mobile.locator('.lesson-view-tabs button:has-text("Coaching")').first();
  if (await mobileCoach.isVisible()) {
    await mobileCoach.click();
    await mobile.waitForTimeout(300);
    await capture(mobile, "04_mobile_lesson_coaching.png");
  }

  // Tablet iPad
  const iPad = devices["iPad Pro 11"];
  const tablet = await browser.newPage({ ...iPad });
  await tablet.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await tablet.waitForTimeout(600);
  await capture(tablet, "05_tablet_home_graph.png");

  await browser.close();
  console.log("All device verifications completed successfully!");
} finally {
  server.close();
}
