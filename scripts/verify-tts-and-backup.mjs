import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4957;
const artifactsDir = 'C:/Users/felix/.gemini/antigravity-cli/brain/74d15db1-8f18-431a-add7-e84366ad8288/tts_and_backup_audit';

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
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Pre-seed an attempt in localStorage so we can test the flashcard TTS button
  await page.addInitScript(() => {
    const testAttempt = {
      id: "attempt-test-01",
      graphId: "react",
      nodeId: "js-readiness-react",
      createdAt: new Date().toISOString(),
      answer: "JavaScript moderno aporta closures, módulos ES, Promises y desestructuración. Los closures permiten a los hooks como useState mantener referencias al estado entre renders, mientras que la inmutabilidad asegura que React pueda detectar cambios por identidad de objeto.",
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

  // 1. Open Settings Modal to verify Backup Management UI
  console.log("1. Opening Settings / Provider modal...");
  const settingsBtn = page.locator(".workspace-provider-toggle").first();
  await settingsBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactsDir, "01_settings_modal_backup_section.png") });

  // Close settings modal
  const closeSettings = page.locator("#workspace-provider-panel .modal-close, #workspace-provider-panel button:has-text('Cerrar'), #workspace-provider-panel button[aria-label*='Cerrar']").first();
  if (await closeSettings.isVisible()) {
    await closeSettings.click();
    await page.waitForTimeout(300);
  }

  // 2. Open Navigation Drawer to verify clean layout
  console.log("2. Opening Navigation Drawer...");
  const navBtn = page.locator(".workspace-nav-toggle").first();
  await navBtn.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactsDir, "02_nav_drawer_clean_with_settings_footer.png") });

  // 3. Switch to Flashcards and open card with attempt to test TTS button
  console.log("3. Switching to Flashcards View...");
  const flashcardTab = page.locator('.view-mode-toggle button:has-text("Flashcards")').first();
  await flashcardTab.click();
  await page.waitForTimeout(600);

  // Open first flashcard
  const firstCard = page.locator(".flashcard").first();
  await firstCard.click();
  await page.waitForTimeout(400);

  // Flip card
  const flipBody = page.locator(".flashcard-modal__body").first();
  await flipBody.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactsDir, "03_flashcard_flipped_with_user_answer_tts.png") });

  await browser.close();
  console.log("Verification finished successfully!");
} finally {
  server.close();
}
