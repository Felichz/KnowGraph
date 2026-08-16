import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4959;
const artifactsDir = 'C:/Users/felix/.gemini/antigravity-cli/brain/74d15db1-8f18-431a-add7-e84366ad8288/final_tts_and_backup_audit';

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

  // Pre-seed attempt in localStorage
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

  // 1. Open Navigation Drawer
  console.log("1. Capturing clean navigation drawer...");
  await page.locator(".workspace-nav-toggle").first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactsDir, "01_nav_drawer_with_footer.png") });

  // 2. Click Settings button from drawer footer
  console.log("2. Opening Settings from drawer footer...");
  await page.locator(".workspace-nav-settings-btn").first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactsDir, "02_settings_modal_with_backup_section.png") });

  // Close settings
  const closeBtn = page.locator("#workspace-provider-panel button[aria-label*='Cerrar']").first();
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // 3. Switch to Flashcards
  console.log("3. Switching to flashcards...");
  await page.locator(".workspace-nav-toggle").first().click();
  await page.waitForTimeout(300);
  await page.locator('.view-mode-toggle button:has-text("Flashcards")').first().click();
  await page.waitForTimeout(600);

  // Open first flashcard
  await page.locator(".flashcard").first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactsDir, "03_flashcard_front_with_flip_cta.png") });

  // Explicitly flip card
  await page.locator(".flashcard-modal__flip-cta").first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(artifactsDir, "04_flashcard_back_with_answer_tts_btn.png") });

  await browser.close();
  console.log("All verifications captured successfully!");
} finally {
  server.close();
}
