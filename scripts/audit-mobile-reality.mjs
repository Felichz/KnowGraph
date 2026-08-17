import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4960;
const artifactsDir = 'C:/Users/felix/.gemini/antigravity-cli/brain/74d15db1-8f18-431a-add7-e84366ad8288/mobile_audit_initial';

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
  
  // Test with iPhone 14 (390 x 844) with touch enabled
  const context = await browser.newContext({
    ...devices['iPhone 14'],
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  
  const page = await context.newPage();

  // Pre-seed some progress
  await page.addInitScript(() => {
    const testAttempt = {
      id: "attempt-test-01",
      graphId: "react",
      nodeId: "js-readiness-react",
      createdAt: new Date().toISOString(),
      answer: "JavaScript moderno aporta closures, módulos ES, Promises y desestructuración.",
      evaluation: {
        score: 110,
        status: "mastery",
        summary: "Excelente explicación del modelo mental de React y JavaScript moderno.",
        strengths: ["Uso correcto de closures e inmutabilidad"],
        weaknesses: [],
        followUpQuestion: "¿Cómo afecta el hoisting?",
        keyPointsChecked: [true, true, true]
      },
      model: "gpt-4o-mini",
      routedVia: "direct",
      durationMs: 1420
    };
    localStorage.setItem("learning_attempts_v1", JSON.stringify([testAttempt]));
  });

  console.log("Navigating to mobile view...");
  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 1. Initial Home Screen / Graph on Mobile
  console.log("1. Capturing 01_mobile_graph_initial.png...");
  await page.screenshot({ path: path.join(artifactsDir, "01_mobile_graph_initial.png") });

  // 2. Open Left Navigation Menu on Mobile
  console.log("2. Capturing 02_mobile_nav_menu_open.png...");
  const navBtn = page.locator(".workspace-nav-toggle, button[aria-label*='menú'], button[aria-label*='Navegación']").first();
  if (await navBtn.isVisible()) {
    await navBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(artifactsDir, "02_mobile_nav_menu_open.png") });
    // Close nav
    const closeNavBtn = page.locator(".workspace-nav-close, .workspace-nav-toggle").first();
    if (await closeNavBtn.isVisible()) await closeNavBtn.click();
    await page.waitForTimeout(300);
  }

  // 3. Open Search / Command Palette on Mobile
  console.log("3. Capturing 03_mobile_command_palette.png...");
  const searchBtn = page.locator(".command-trigger, button:has-text('Buscar')").first();
  if (await searchBtn.isVisible()) {
    await searchBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(artifactsDir, "03_mobile_command_palette.png") });
    // Close command palette with Escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
  }

  // 4. Open Settings / Provider Modal on Mobile
  console.log("4. Capturing 04_mobile_settings_modal.png...");
  const settingsBtn = page.locator("button:has-text('IA'), button[aria-label*='IA'], button[aria-label*='Ajustes']").first();
  if (await settingsBtn.isVisible()) {
    await settingsBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(artifactsDir, "04_mobile_settings_modal.png") });
    const closeSettings = page.locator("#workspace-provider-panel button[aria-label*='Cerrar'], .modal-close").first();
    if (await closeSettings.isVisible()) await closeSettings.click();
    await page.waitForTimeout(300);
  }

  // 5. Click on a Graph Node / Open Lesson Modal on Mobile
  console.log("5. Capturing 05_mobile_lesson_modal_read.png...");
  // Try opening node directly or via route button
  const nextBtn = page.locator("button:has-text('Abrir card'), button:has-text('Continuar'), .route-step-card").first();
  if (await nextBtn.isVisible()) {
    await nextBtn.click();
  } else {
    // Click on a node in cytoscape or DOM
    await page.mouse.click(195, 420);
  }
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(artifactsDir, "05_mobile_lesson_modal_read.png") });

  // 6. Switch Lesson Modal to "Explicar / Coaching" Tab on Mobile
  console.log("6. Capturing 06_mobile_lesson_modal_coach.png...");
  const coachTab = page.locator("button:has-text('Explicar'), button:has-text('Coaching'), [data-tab='coach']").first();
  if (await coachTab.isVisible()) {
    await coachTab.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(artifactsDir, "06_mobile_lesson_modal_coach.png") });
  }

  // 7. Switch Lesson Modal to "Evaluar" Tab on Mobile
  console.log("7. Capturing 07_mobile_lesson_modal_eval.png...");
  const evalTab = page.locator("button:has-text('Evaluar'), [data-tab='evaluate']").first();
  if (await evalTab.isVisible()) {
    await evalTab.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(artifactsDir, "07_mobile_lesson_modal_eval.png") });
  }

  // Close Lesson Modal
  const closeLesson = page.locator(".modal-close, button[aria-label*='Cerrar']").first();
  if (await closeLesson.isVisible()) {
    await closeLesson.click();
    await page.waitForTimeout(300);
  }

  // 8. Switch to Flashcards View on Mobile
  console.log("8. Capturing 08_mobile_flashcards_view.png...");
  const navBtn2 = page.locator(".workspace-nav-toggle").first();
  if (await navBtn2.isVisible()) {
    await navBtn2.click();
    await page.waitForTimeout(300);
  }
  const flashcardsTab = page.locator('.view-mode-toggle button:has-text("Flashcards")').first();
  if (await flashcardsTab.isVisible()) {
    await flashcardsTab.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(artifactsDir, "08_mobile_flashcards_view.png") });

    // Open Flashcard Modal on Mobile
    console.log("9. Capturing 09_mobile_flashcard_modal_front.png...");
    const card = page.locator(".flashcard").first();
    if (await card.isVisible()) {
      await card.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(artifactsDir, "09_mobile_flashcard_modal_front.png") });

      // Flip card on Mobile
      console.log("10. Capturing 10_mobile_flashcard_modal_back.png...");
      const flipBtn = page.locator(".flashcard-modal__flip-cta, button:has-text('Ver respuesta')").first();
      if (await flipBtn.isVisible()) {
        await flipBtn.click();
        await page.waitForTimeout(400);
        await page.screenshot({ path: path.join(artifactsDir, "10_mobile_flashcard_modal_back.png") });
      }
    }
  }

  // 11. Test Progress / Stats Panel on Mobile
  console.log("11. Capturing 11_mobile_progress_panel.png...");
  const progressBtn = page.locator(".progress-indicator, button:has-text('dominado')").first();
  if (await progressBtn.isVisible()) {
    await progressBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(artifactsDir, "11_mobile_progress_panel.png") });
  }

  await browser.close();
  console.log("Mobile audit suite finished successfully!");
} finally {
  server.close();
}
