import { test, expect } from "@playwright/test";
import { failOnPageError, seedFixture, sse } from "./helpers.js";

const hud = (page) => page.getByRole("region", { name: "AI tasks" });

// A running task as backgroundTaskManager persists it ("knowgraph_active_tasks"), so the HUD
// rehydrates it on load exactly as after a reload in the middle of an evaluation.
function injectRunningTask(page, { nodeId, progress }) {
  return page.addInitScript(({ nodeId, progress }) => {
    const now = Date.now();
    localStorage.setItem("knowgraph_active_tasks", JSON.stringify([{
      id: `task_eval_${nodeId}`, graphId: "react", nodeId, cardKey: `react:${nodeId}`, type: "evaluation",
      status: "running", stage: "evaluating", message: "Evaluating…", progress, startedAt: now, updatedAt: now,
    }]));
  }, { nodeId, progress });
}

const evaluation = {
  score: 104, scoreScaleVersion: 3, coveragePercent: 100, rawScore: 88,
  conciseVerdict: "Solid model of snapshots and batching.",
  nextAttemptPrompt: "Add how automatic batching changed in React 18.",
  rubric: {
    accuracy: { score: 38, max: 40, note: "" }, causalityAndTradeoffs: { score: 22, max: 25, note: "" },
    application: { score: 16, max: 20, note: "" }, completeness: { score: 12, max: 15, note: "" },
  },
  strengths: ["Snapshot model"], gaps: [], misconceptions: [],
};

// User Story 3: background AI tasks surface in a global HUD that survives navigation and can be cancelled.
test.describe("Background AI tasks & global HUD (User Story 3)", () => {
  test.beforeEach(async ({ page }) => {
    failOnPageError(page);
  });

  test("the HUD stays hidden when there are no tasks (Universal State 1: Empty)", async ({ page }) => {
    await page.goto("/react");
    await expect(page.locator(".hgrid")).toBeVisible();
    await expect(hud(page)).toHaveCount(0);
  });

  test("a rehydrated running task shows its progress and opens its card (Universal State 2: Populated)", async ({ page }) => {
    await injectRunningTask(page, { nodeId: "js_basics", progress: 248 });
    await page.goto("/react");

    const head = hud(page).locator(".hud__head");
    await expect(head).toHaveText(/1 AI task running/);
    await expect(head).toHaveAttribute("aria-expanded", "true");
    const item = hud(page).locator(".hud__item");
    await expect(item.locator(".hud__title")).toHaveText("Modern JavaScript for reading React");
    await expect(item.locator(".hud__sub")).toHaveText("Evaluation · 248 chars");

    await head.click();
    await expect(head).toHaveAttribute("aria-expanded", "false");
    await expect(item).toHaveCount(0);
    await head.click();

    await item.locator(".hud__open").click();
    await expect(page).toHaveURL(/\/react\/card\/js_basics$/);
    await expect(page.locator("#study-tab-evaluate")).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#study-tab-evaluate")).toContainText("Evaluating…");
    // The HUD stays available above the study session.
    await expect(hud(page)).toBeVisible();
  });

  test("cancelling a task removes the HUD cleanly (Universal State 4: Cancellation)", async ({ page }) => {
    await injectRunningTask(page, { nodeId: "state_updates", progress: 89 });
    await page.goto("/react");
    await expect(hud(page)).toBeVisible();
    await hud(page).getByRole("button", { name: "Cancel task" }).click();
    await expect(hud(page)).toHaveCount(0);
    expect(await page.evaluate(() => localStorage.getItem("knowgraph_active_tasks"))).toBeNull();
  });

  test("a real evaluation runs in the background, notifies when ready and can be dismissed (mocked gateway)", async ({ page }) => {
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    await page.route("**/api/ai/evaluate/stream", async (route) => {
      const body = JSON.parse(route.request().postData());
      await gate;
      await route.fulfill({
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
        body: sse([
          ["progress", { length: 120, stage: "evaluating" }],
          ["done", { attempt: { id: "attempt_e2e_eval", graphId: "react", nodeId: body.nodeId, answer: body.answer,
            contentHash: body.contentHash, createdAt: new Date().toISOString(), evaluation } }],
        ]),
      });
    });

    await page.goto("/react");
    await seedFixture(page, "hydrated-state"); // includes a draft for state_updates
    await page.goto("/react/card/state_updates");
    await page.locator("#study-tab-evaluate").click();
    await page.getByRole("button", { name: "Evaluate now" }).click();

    await expect(page.getByRole("tabpanel").getByRole("status")).toContainText("Evaluating your explanation with AI...");
    await expect(page.locator("#study-tab-evaluate")).toContainText("Evaluating…");
    await expect(hud(page).locator(".hud__head")).toHaveText(/1 AI task running/);
    await expect(hud(page).locator(".hud__title")).toHaveText("State, snapshots and batching");

    // Keep studying elsewhere while it evaluates.
    await page.keyboard.press("Escape");
    await expect(page.locator(".study")).toHaveCount(0);
    release();

    const toast = page.locator(".toast", { hasText: "Evaluation ready: State, snapshots and batching" });
    await expect(toast).toBeVisible();
    await expect(hud(page).locator(".hud__head")).toHaveText(/AI tasks/);
    await expect(hud(page).locator(".hud__sub")).toHaveText("Evaluation · ready");
    await expect(page.locator('.hgrid__cell[data-node="state_updates"]')).toHaveAttribute("aria-label", /104\/120 · extra depth/);

    await toast.getByRole("button", { name: "Open" }).click();
    await expect(page.locator("#study-tab-evaluate")).toHaveAttribute("aria-selected", "true");
    const result = page.locator(".result");
    await expect(result.locator(".score-value--lg")).toHaveAttribute("aria-label", "104 of 120");
    await expect(result).toContainText("Solid model of snapshots and batching.");

    await hud(page).getByRole("button", { name: "Dismiss" }).click();
    await expect(hud(page)).toHaveCount(0);
  });
});
