import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4210;
const artifactsDir = 'C:/Users/felix/.gemini/antigravity-cli/brain/74d15db1-8f18-431a-add7-e84366ad8288/studio';

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
console.log(`Server running on http://127.0.0.1:${PORT}`);

async function saveScreenshot(page, filename) {
  const p = path.join(artifactsDir, filename);
  await page.screenshot({ path: p, fullPage: false });
  console.log(`Saved: ${filename}`);
}

try {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 1. Home / Graph with Search Trigger button in Header
  console.log("1. Capturing Desktop Overview with Commandbar Search Trigger...");
  await saveScreenshot(page, "01_home_commandbar_search.png");

  // 2. Open Command Palette via search trigger or Ctrl+K
  console.log("2. Opening Command Palette...");
  await page.locator(".desktop-commandbar__search-trigger").click();
  await page.waitForTimeout(500);
  await saveScreenshot(page, "02_command_palette_open.png");

  // Type in Command Palette search
  console.log("2.1 Searching inside Command Palette...");
  await page.locator(".command-palette__input").fill("state");
  await page.waitForTimeout(400);
  await saveScreenshot(page, "03_command_palette_search_results.png");

  // Close Command Palette
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // 3. Open Lesson Card and test Split Studio
  console.log("3. Opening Lesson Modal...");
  const guideItem = page.locator(".guide-item, .route-preview-current button").first();
  await guideItem.click();
  await page.waitForTimeout(800);

  // Switch to Coaching Tab to see Split Studio
  console.log("3.1 Switching to Coaching Tab (Split Studio)...");
  const coachTab = page.locator('.lesson-view-tabs button:has-text("Coaching")').first();
  await coachTab.click();
  await page.waitForTimeout(600);
  await saveScreenshot(page, "04_split_studio_coaching.png");

  // Toggle Zen Mode
  console.log("3.2 Toggling Zen Mode...");
  const zenBtn = page.locator(".lesson-zen-toggle").first();
  if (await zenBtn.isVisible()) {
    await zenBtn.click();
    await page.waitForTimeout(600);
    await saveScreenshot(page, "05_zen_mode_fullscreen.png");
    // Toggle back from Zen
    await zenBtn.click();
    await page.waitForTimeout(400);
  }

  // Close Lesson Modal
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // 4. Test Flashcards Practice Runner
  console.log("4. Testing Flashcards View & Rapid Practice Mode...");
  const navToggle = page.locator(".workspace-nav-toggle").first();
  await navToggle.click();
  await page.waitForTimeout(500);

  const flashcardsBtn = page.locator('.graph-switcher button:has-text("Flashcards")').first();
  await flashcardsBtn.click();
  await page.waitForTimeout(700);

  // Close nav
  await navToggle.click();
  await page.waitForTimeout(400);

  await saveScreenshot(page, "06_flashcards_deck_view.png");

  // Click "Iniciar práctica rápida"
  console.log("4.1 Starting Rapid Practice Session...");
  const practiceCta = page.locator(".flashcards__practice-cta").first();
  if (await practiceCta.isVisible()) {
    await practiceCta.click();
    await page.waitForTimeout(600);
    await saveScreenshot(page, "07_flashcards_practice_front.png");

    // Press Space to flip card
    console.log("4.2 Flipping card with Space...");
    await page.keyboard.press("Space");
    await page.waitForTimeout(500);
    await saveScreenshot(page, "08_flashcards_practice_back_flipped.png");

    // Press '4' (Fácil) to test rating progression
    console.log("4.3 Rating card with hotkey 4...");
    await page.keyboard.press("4");
    await page.waitForTimeout(500);
    await saveScreenshot(page, "09_flashcards_practice_next_card_streak.png");
  }

  await browser.close();
  console.log("All Studio screenshots captured successfully!");
} finally {
  server.close();
}
