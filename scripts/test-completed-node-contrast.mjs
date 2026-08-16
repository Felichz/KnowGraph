import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");
const PORT = 4953;
const artifactsDir = 'C:/Users/felix/.gemini/antigravity-cli/brain/74d15db1-8f18-431a-add7-e84366ad8288/contrast_audit';

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

  // Pre-seed completed attempts in localStorage
  await page.addInitScript(() => {
    const attempts = [
      {
        id: "att_1",
        graphId: "react",
        nodeId: "js-moderno-react",
        createdAt: new Date().toISOString(),
        durationMs: 14000,
        answer: "JavaScript moderno incluye destructuring, optional chaining, closures e inmutabilidad con map y filter.",
        model: "gpt-4o",
        evaluation: {
          score: 100,
          displayScore: 100,
          rubrics: { mentalModel: 40, technicalDepth: 35, practicalApplication: 25 },
          feedback: "Excelente explicación completa.",
          strengths: ["Claridad conceptual", "Buenos ejemplos"],
          weaknesses: [],
        },
      }
    ];
    localStorage.setItem("learning_attempts_v1", JSON.stringify(attempts));
  });

  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  console.log("Capturing graph with Node 1 completed (100% solid) and Node 2 as next (100%), with subsequent nodes transparent...");
  await page.screenshot({ path: path.join(artifactsDir, "06_completed_node_solid_vs_uncompleted_transparent.png") });

  await browser.close();
  console.log("Completed node test finished!");
} finally {
  server.close();
}
