import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4242;
const artifactsDir = 'C:/Users/felix/.gemini/antigravity-cli/brain/74d15db1-8f18-431a-add7-e84366ad8288/smell_audit_all';

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

  // 1. Coaching view without sidebar (Clean Full-Width Coaching)
  console.log("1. Auditing Coaching View...");
  await page.locator(".guide-item, .route-preview-current button").first().click();
  await page.waitForTimeout(500);
  const coachTab = page.locator('.lesson-view-tabs button:has-text("Coaching")').first();
  await coachTab.click();
  await page.waitForTimeout(400);
  await capture(page, "01_coaching_full_width_clean.png");

  // 2. Coaching view with drafted text and active coaching bar
  console.log("2. Auditing Coaching with text...");
  const textarea = page.locator("textarea").first();
  if (await textarea.isVisible()) {
    await textarea.fill("En React los closures permiten capturar props y state en el momento en que se renderiza el componente. La inmutabilidad garantiza que el reconciliation detecte cambios en el virtual DOM.");
    await page.waitForTimeout(600);
    await capture(page, "02_coaching_with_draft_and_bar.png");
  }

  // 3. Evaluation Tab
  console.log("3. Auditing Evaluation Tab...");
  const evalTab = page.locator('.lesson-view-tabs button:has-text("Evaluar")').first();
  await evalTab.click();
  await page.waitForTimeout(400);
  await capture(page, "03_evaluation_tab_view.png");

  // 4. Reading Tab Full View
  console.log("4. Auditing Reading Tab...");
  const readTab = page.locator('.lesson-view-tabs button:has-text("Lectura")').first();
  await readTab.click();
  await page.waitForTimeout(400);
  await capture(page, "04_reading_tab_full_view.png");

  // Close Lesson Modal
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // 5. Command Palette (Ctrl+K)
  console.log("5. Auditing Command Palette...");
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(300);
  await capture(page, "05_command_palette_modal.png");
  await page.keyboard.type("closure");
  await page.waitForTimeout(300);
  await capture(page, "06_command_palette_search_results.png");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 6. Navigation Drawer
  console.log("6. Auditing Navigation Drawer...");
  await page.locator(".workspace-nav-toggle").click();
  await page.waitForTimeout(400);
  await capture(page, "07_nav_drawer_full.png");
  await page.locator(".workspace-nav-toggle").click();
  await page.waitForTimeout(300);

  // 7. Progress & Seniority Drawer
  console.log("7. Auditing Progress Drawer...");
  const progBtn = page.locator(".progress-block").first();
  if (await progBtn.isVisible()) {
    await progBtn.click();
    await page.waitForTimeout(400);
    await capture(page, "08_progress_seniority_drawer.png");
    // Close it
    const closeProg = page.locator('.progress-drawer__header button, button[aria-label="Cerrar progreso"]').first();
    if (await closeProg.isVisible()) await closeProg.click();
    await page.waitForTimeout(300);
  }

  // 8. Flashcards Deck View & Practice Runner
  console.log("8. Auditing Flashcards View...");
  await page.locator(".workspace-nav-toggle").click();
  await page.waitForTimeout(400);
  const flashcardNavBtn = page.locator('button:has-text("Flashcards")').first();
  if (await flashcardNavBtn.isVisible()) {
    await flashcardNavBtn.click();
    await page.waitForTimeout(400);
    await page.locator(".workspace-nav-toggle").click();
    await page.waitForTimeout(400);
    await capture(page, "09_flashcards_deck_overview.png");

    // Click Iniciar sesión de práctica
    const startPracticeBtn = page.locator('button:has-text("Iniciar sesión de práctica")').first();
    if (await startPracticeBtn.isVisible()) {
      await startPracticeBtn.click();
      await page.waitForTimeout(400);
      await capture(page, "10_flashcard_runner_front.png");

      // Flip card with Space
      await page.keyboard.press("Space");
      await page.waitForTimeout(400);
      await capture(page, "11_flashcard_runner_back_flipped.png");

      // Rate card
      await page.keyboard.press("3");
      await page.waitForTimeout(400);
      await capture(page, "12_flashcard_runner_next_streak.png");
    }
  }

  await browser.close();
  console.log("Systematic Playwright audit completed successfully!");
} finally {
  server.close();
}
