import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4964;
const artifactsDir = 'C:/Users/felix/.gemini/antigravity-cli/brain/74d15db1-8f18-431a-add7-e84366ad8288/mobile_audit_redesign';

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
  
  // Real iPhone 14 mobile context
  const context = await browser.newContext({
    ...devices['iPhone 14'],
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  
  const page = await context.newPage();

  // Pre-seed sample attempt
  await page.addInitScript(() => {
    const testAttempt = {
      id: "attempt-test-01",
      graphId: "react",
      nodeId: "js-readiness-react",
      createdAt: new Date().toISOString(),
      answer: "JavaScript moderno aporta closures, módulos ES, Promises y desestructuración. Los closures permiten a los hooks mantener estado entre renders.",
      evaluation: {
        score: 110,
        status: "mastery",
        summary: "Excelente explicación del modelo mental de React y JavaScript moderno.",
        strengths: ["Uso correcto de closures e inmutabilidad"],
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

  // 1. Mobile Graph with HUD and Bottom Nav
  console.log("1. Capturing 01_mobile_graph_with_hud_and_bottom_nav.png...");
  await page.screenshot({ path: path.join(artifactsDir, "01_mobile_graph_with_hud_and_bottom_nav.png") });

  // 2. Open Left Nav Drawer on Mobile (test drawer + backdrop)
  console.log("2. Capturing 02_mobile_nav_drawer_open_with_backdrop.png...");
  await page.locator(".workspace-nav-toggle").first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactsDir, "02_mobile_nav_drawer_open_with_backdrop.png") });

  // Close drawer by clicking close button inside header
  await page.locator('.workspace-nav-heading button[aria-label="Cerrar navegación"]').first().click();
  await page.waitForTimeout(300);

  // 3. Tap "Estudiar lección" in MobileGraphHUD
  console.log("3. Capturing 03_mobile_lesson_modal_reading_full_screen.png...");
  await page.locator(".mobile-graph-hud__cta").first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactsDir, "03_mobile_lesson_modal_reading_full_screen.png") });

  // 4. Switch to "Explicar" tab
  console.log("4. Capturing 04_mobile_lesson_modal_coach_tab.png...");
  const coachTab = page.locator(".lesson-view-tabs button").nth(1);
  if (await coachTab.isVisible()) {
    await coachTab.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(artifactsDir, "04_mobile_lesson_modal_coach_tab.png") });
  }

  // 5. Switch to "Evaluar" tab
  console.log("5. Capturing 05_mobile_lesson_modal_eval_tab.png...");
  const evalTab = page.locator(".lesson-view-tabs button").nth(2);
  if (await evalTab.isVisible()) {
    await evalTab.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(artifactsDir, "05_mobile_lesson_modal_eval_tab.png") });
  }

  // Close Lesson Modal
  await page.locator(".lesson-header .modal-close").first().click();
  await page.waitForTimeout(300);

  // 6. Switch to Flashcards from Bottom Navigation Bar
  console.log("6. Capturing 06_mobile_flashcards_view_with_bottom_nav.png...");
  await page.locator('.mobile-bottom-nav__item:has-text("Flashcards")').first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactsDir, "06_mobile_flashcards_view_with_bottom_nav.png") });

  // 7. Open Flashcard Modal
  console.log("7. Capturing 07_mobile_flashcard_modal_front.png...");
  await page.locator(".flashcard").first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactsDir, "07_mobile_flashcard_modal_front.png") });

  // 8. Flip card to reveal answer
  console.log("8. Capturing 08_mobile_flashcard_modal_flipped_back.png...");
  await page.locator(".flashcard-modal__flip-cta").first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactsDir, "08_mobile_flashcard_modal_flipped_back.png") });

  // Close Flashcard Modal
  await page.locator(".flashcard-modal .modal-close").first().click();
  await page.waitForTimeout(300);

  // 9. Open Progress Sheet from Bottom Nav
  console.log("9. Capturing 09_mobile_progress_panel_full_screen.png...");
  await page.locator('.mobile-bottom-nav__item:has-text("Progreso")').first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactsDir, "09_mobile_progress_panel_full_screen.png") });

  // Close Progress Panel
  await page.locator('.mobile-bottom-nav__item:has-text("Grafo")').first().click();
  await page.waitForTimeout(300);

  // 10. Open Settings / Provider Sheet from Bottom Nav
  console.log("10. Capturing 10_mobile_settings_modal_full_screen.png...");
  await page.locator('.mobile-bottom-nav__item:has-text("Ajustes")').first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactsDir, "10_mobile_settings_modal_full_screen.png") });

  await browser.close();
  console.log("ALL MOBILE REDESIGN TESTS FINISHED SUCCESSFULLY!");
} finally {
  server.close();
}
