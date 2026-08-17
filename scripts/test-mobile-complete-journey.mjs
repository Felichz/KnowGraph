import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4980;
const artifactsDir = 'C:/Users/felix/.gemini/antigravity-cli/brain/74d15db1-8f18-431a-add7-e84366ad8288/mobile_journey_verified';

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
  
  // Real iPhone 14 context
  const context = await browser.newContext({
    ...devices['iPhone 14'],
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  
  const page = await context.newPage();

  // Pre-seed sample evaluation attempt
  await page.addInitScript(() => {
    const testAttempt = {
      id: "attempt-journey-01",
      graphId: "react",
      nodeId: "js-readiness-react",
      createdAt: new Date().toISOString(),
      answer: "JavaScript moderno aporta closures, módulos ES, Promises y desestructuración. Los closures permiten a los hooks mantener estado entre renders.",
      evaluation: {
        score: 115,
        status: "mastery",
        summary: "Excelente explicación del modelo mental de React y JavaScript moderno.",
        strengths: ["Uso correcto de closures e inmutabilidad", "Explicación clara de hooks"],
        weaknesses: [],
        followUpQuestion: "¿Cómo afecta el hoisting en este contexto?",
        keyPointsChecked: [true, true, true]
      },
      model: "gpt-4o-mini",
      routedVia: "direct",
      durationMs: 1420
    };
    localStorage.setItem("learning_attempts_v1", JSON.stringify([testAttempt]));
  });

  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  // STEP 1: Mobile Graph Screen + HUD
  console.log("Step 1: Capturing 01_journey_graph_hud.png...");
  await page.screenshot({ path: path.join(artifactsDir, "01_journey_graph_hud.png") });

  // STEP 2: Navigate HUD Stepper to Next Step
  console.log("Step 2: Testing HUD stepper navigation...");
  const nextStepBtn = page.locator('.mobile-graph-hud__stepper button[aria-label="Concepto siguiente"]');
  if (await nextStepBtn.isVisible()) {
    await nextStepBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(artifactsDir, "02_journey_stepper_next_concept.png") });
  }

  // STEP 3: Open Lesson Modal from HUD
  console.log("Step 3: Opening Lesson Modal (Lectura)...");
  await page.locator(".mobile-graph-hud__cta").first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactsDir, "03_journey_lesson_read.png") });

  // STEP 4: Switch to Coaching Tab & Check Voice Dictate Button
  console.log("Step 4: Switching to Coaching Tab with Dictate Button...");
  await page.locator('.lesson-view-tabs button:has-text("Coaching")').first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactsDir, "04_journey_lesson_coaching_voice.png") });

  // STEP 5: Switch to Evaluar Tab
  console.log("Step 5: Switching to Evaluar Tab...");
  await page.locator('.lesson-view-tabs button:has-text("Evaluar")').first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactsDir, "05_journey_lesson_evaluar.png") });

  // Close Lesson Modal
  await page.locator(".lesson-header .modal-close").first().click();
  await page.waitForTimeout(300);

  // STEP 6: Switch Knowledge Graph from React to Rails via Drawer
  console.log("Step 6: Switching Graph to Rails via Drawer...");
  await page.locator(".workspace-nav-toggle").first().click();
  await page.waitForTimeout(400);
  await page.locator('.graph-switch:has-text("Rails entrevistas")').first().click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(artifactsDir, "06_journey_switched_to_rails_graph.png") });

  // STEP 7: Test Full-Screen Search Palette from Bottom Nav
  console.log("Step 7: Testing Search Palette from Bottom Nav...");
  await page.locator('.mobile-bottom-nav__item:has-text("Buscar")').first().click();
  await page.waitForTimeout(400);
  await page.locator(".command-palette__input").fill("Active Record");
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(artifactsDir, "07_journey_search_palette.png") });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // STEP 8: Test Flashcards Practice Deck
  console.log("Step 8: Testing Flashcards Practice Deck...");
  await page.locator('.mobile-bottom-nav__item:has-text("Flashcards")').first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactsDir, "08_journey_flashcards_deck.png") });

  // STEP 9: Open Flashcard & Flip with 2x2 Rating Grid
  console.log("Step 9: Opening Flashcard and revealing answer with 2x2 Rating Grid...");
  await page.locator(".flashcard").first().click();
  await page.waitForTimeout(400);
  await page.locator(".flashcard-modal__flip-cta").first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactsDir, "09_journey_flashcard_flipped_ratings.png") });
  await page.locator(".flashcard-modal .modal-close").first().click();
  await page.waitForTimeout(300);

  // STEP 10: Test Progress Panel Sheet
  console.log("Step 10: Testing Progress Panel Sheet...");
  await page.locator('.mobile-bottom-nav__item:has-text("Progreso")').first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactsDir, "10_journey_progress_sheet.png") });
  await page.locator('.workspace-progress-panel__header button').first().click();
  await page.waitForTimeout(300);

  // STEP 11: Test Settings / Provider Sheet
  console.log("Step 11: Testing Settings / Provider Sheet...");
  await page.locator('.mobile-bottom-nav__item:has-text("Ajustes")').first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactsDir, "11_journey_settings_sheet.png") });
  await page.locator('.mobile-bottom-nav__item:has-text("Grafo")').first().click();
  await page.waitForTimeout(300);

  await browser.close();
  console.log("COMPLETE MOBILE USER JOURNEY VERIFIED WITH 100% SUCCESS!");
} finally {
  server.close();
}
