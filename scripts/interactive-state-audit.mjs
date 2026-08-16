import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4444;
const artifactsDir = 'C:/Users/felix/.gemini/antigravity-cli/brain/74d15db1-8f18-431a-add7-e84366ad8288/interactive_audit';

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
  console.log(`[Captured Interactive State] ${name}`);
}

try {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  // 1. Graph Node Hover & HUD Tooltip state
  console.log("1. Hovering node in graph...");
  const firstNode = page.locator(".topology-node").first();
  if (await firstNode.isVisible()) {
    await firstNode.hover();
    await page.waitForTimeout(400);
    await capture(page, "01_graph_node_hover_hud_active.png");
  }

  // 2. Hovering stage 2 node
  const secondNode = page.locator(".topology-node").nth(1);
  if (await secondNode.isVisible()) {
    await secondNode.hover();
    await page.waitForTimeout(400);
    await capture(page, "02_graph_node_hover_incoming_outgoing.png");
  }

  // 3. Open Lesson Modal -> Reading View
  console.log("3. Opening Lesson Modal...");
  await firstNode.click();
  await page.waitForTimeout(500);

  // 4. Code copy button hover and click
  console.log("4. Testing Code Snippet Copy button...");
  const copyBtn = page.locator('.lesson-code-actions button, button[aria-label="Copiar código"], .lesson-code-copy-btn').first();
  if (await copyBtn.isVisible()) {
    await copyBtn.hover();
    await page.waitForTimeout(300);
    await capture(page, "03_lesson_code_copy_button_hover.png");
    await copyBtn.click();
    await page.waitForTimeout(200);
    await capture(page, "04_lesson_code_copied_feedback.png");
  }

  // 5. Deep Dive popover interaction
  console.log("5. Testing Deep Dive click...");
  const deepDiveKeyword = page.locator('.reading-chunk--deep-dive, .deep-dive-link, button.reading-chunk').first();
  if (await deepDiveKeyword.isVisible()) {
    await deepDiveKeyword.click();
    await page.waitForTimeout(400);
    await capture(page, "05_deep_dive_popover_open.png");
    // Close it with Escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
  }

  // 6. Section Audio hover tooltip
  console.log("6. Testing Section Audio button...");
  const audioBtn = page.locator(".section-audio-button").first();
  if (await audioBtn.isVisible()) {
    await audioBtn.hover();
    await page.waitForTimeout(300);
    await capture(page, "06_section_audio_button_hover.png");
  }

  // 7. Coaching View Live Typing & Countdown State
  console.log("7. Testing Coaching Live State...");
  const coachTab = page.locator('.lesson-view-tabs button:has-text("Coaching")').first();
  await coachTab.click();
  await page.waitForTimeout(400);
  const textarea = page.locator("textarea").first();
  if (await textarea.isVisible()) {
    await textarea.click();
    await textarea.fill("En React los closures permiten encapsular variables del scope padre dentro de funciones como useCallback o useEffect, pero si no se pasan las dependencias correctas se genera un stale closure.");
    await page.waitForTimeout(500);
    await capture(page, "07_coaching_live_timer_active.png");
  }

  // 8. Evaluation Tab & Process Draft
  console.log("8. Testing Evaluation Tab...");
  const evalTab = page.locator('.lesson-view-tabs button:has-text("Evaluar")').first();
  await evalTab.click();
  await page.waitForTimeout(400);
  await capture(page, "08_eval_tab_ready_to_evaluate.png");

  // Close Lesson Modal
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // 9. Command Palette Interactive Search & Arrow Navigation
  console.log("9. Testing Command Palette Arrow navigation...");
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(300);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(200);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(200);
  await capture(page, "09_command_palette_arrow_selected.png");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 10. Provider Settings Modal - Model Selection Toggle
  console.log("10. Testing Provider Settings Modal...");
  const aiBtn = page.locator('.toolbar-pill--ai, button:has-text("IA"), .header-ai-btn').first();
  if (await aiBtn.isVisible()) {
    await aiBtn.click();
    await page.waitForTimeout(400);
    await capture(page, "10_provider_settings_modal_open.png");

    // Click Provider Catalog tab
    const catalogTab = page.locator('button:has-text("Catálogo"), [role="tab"]:has-text("Catálogo")').first();
    if (await catalogTab.isVisible()) {
      await catalogTab.click();
      await page.waitForTimeout(300);
      await capture(page, "11_provider_catalog_category_pills.png");
    }

    // Close Modal
    const closeBtn = page.locator('.provider-panel__header button, button[aria-label="Cerrar configuración"]').first();
    if (await closeBtn.isVisible()) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // 11. Flashcards Interactive Runner State (Front -> Back -> Scoring)
  console.log("11. Testing Flashcards Runner...");
  await page.locator(".workspace-nav-toggle").click();
  await page.waitForTimeout(300);
  const flashcardNav = page.locator('button:has-text("Flashcards")').first();
  if (await flashcardNav.isVisible()) {
    await flashcardNav.click();
    await page.waitForTimeout(300);
    await page.locator(".workspace-nav-toggle").click();
    await page.waitForTimeout(300);

    const startBtn = page.locator('button:has-text("Iniciar práctica rápida")').first();
    if (await startBtn.isVisible()) {
      await startBtn.click();
      await page.waitForTimeout(400);
      await capture(page, "12_flashcards_runner_front_state.png");

      // Flip card
      await page.keyboard.press("Space");
      await page.waitForTimeout(400);
      await capture(page, "13_flashcards_runner_back_rating_buttons.png");

      // Rate card (3 - Bien)
      await page.keyboard.press("3");
      await page.waitForTimeout(400);
      await capture(page, "14_flashcards_runner_streak_feedback.png");
    }
  }

  await browser.close();
  console.log("Interactive state audit completed successfully!");
} finally {
  server.close();
}
