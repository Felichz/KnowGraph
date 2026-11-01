import { test, expect } from "@playwright/test";
import { failOnPageError, seedFixture, sse } from "./helpers.js";

const CARD = "State, snapshots and batching";

const studyRegion = (page, label = CARD) => page.getByRole("region", { name: `Study: ${label}` });
const tab = (page, id) => page.locator(`#study-tab-${id}`);

// User Story 2: the study session (Read → Explain → Evaluate, the mentor in the header) over the map.
test.describe("Study session stages (User Story 2)", () => {
  test.beforeEach(async ({ page }) => {
    failOnPageError(page);
  });

  test("opens from a heat-grid cell on the Read stage with three stage tabs and the mentor in the header", async ({ page }) => {
    await page.goto("/react");
    await seedFixture(page, "hydrated-state");
    await page.locator('.hgrid__cell[data-node="state_updates"]').click();
    await expect(page).toHaveURL(/\/react\/card\/state_updates$/);

    const study = studyRegion(page);
    await expect(study.getByRole("heading", { level: 1 })).toHaveText(CARD);
    await expect(study.locator(".study__back")).toHaveText("Study");
    const tabs = study.getByRole("tablist", { name: "Study stages" }).getByRole("tab");
    await expect(tabs).toHaveText([/^01\s*Read$/, /^02\s*Explain\s*Draft$/, /^03\s*Evaluate$/]);
    await expect(tab(page, "read")).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#study-tab-mentor")).toHaveCount(0);
    const mentor = study.locator(".study__mentor");
    await expect(mentor).toHaveText("Ask the mentor");
    await expect(mentor).toHaveAttribute("aria-pressed", "false");

    const stage = page.getByRole("tabpanel");
    await expect(stage.locator(".lesson__lead")).toBeVisible();
    await expect(stage.getByRole("heading", { name: "Naive vs. production" })).toBeVisible();
    await expect(stage.getByText("Why it fails.")).toBeVisible();
    await expect(stage.getByText("Trade-off.")).toBeVisible();
    await expect(stage.getByRole("heading", { name: "Sources" })).toBeVisible();
    await expect(stage.locator(".lesson__sources a").first()).toHaveAttribute("href", /^https?:\/\//);
    // The Read stage ends in one primary action plus a quiet way to the mentor.
    const footer = stage.locator(".stage__next");
    await expect(footer.getByRole("button")).toHaveText(["Explain it", "Stuck? Ask the mentor"]);
    await expect(footer.getByRole("button", { name: "Explain it" })).toHaveClass(/btn--primary/);

    const rail = page.getByRole("complementary", { name: "Card context" });
    await expect(rail).toContainText("Where it fits");
    await expect(rail).toContainText("Interview questions");

    await study.locator(".study__back").click();
    await expect(page.locator(".study")).toHaveCount(0);
    await expect(page).toHaveURL(/\/react$/);
  });

  test("stage tabs switch with clicks, arrow keys and in-stage buttons; the header mentor opens and returns", async ({ page }) => {
    await page.goto("/react/card/state_updates");
    await tab(page, "read").focus();
    await page.keyboard.press("ArrowRight");
    await expect(tab(page, "paraphrase")).toHaveAttribute("aria-selected", "true");
    await expect(tab(page, "paraphrase")).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(tab(page, "evaluate")).toHaveAttribute("aria-selected", "true");
    await expect(tab(page, "evaluate")).toBeFocused();

    await tab(page, "read").click();
    await page.getByRole("tabpanel").getByRole("button", { name: "Explain it" }).click();
    await expect(tab(page, "paraphrase")).toHaveAttribute("aria-selected", "true");

    // The mentor is an aid, not a step: no tab is selected while it is open, and pressing again returns.
    const mentor = studyRegion(page).locator(".study__mentor");
    await mentor.click();
    await expect(mentor).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("tabpanel", { name: "AI mentor" })).toBeVisible();
    await expect(page.getByRole("tab", { selected: true })).toHaveCount(0);
    await mentor.click();
    await expect(mentor).toHaveAttribute("aria-pressed", "false");
    await expect(tab(page, "paraphrase")).toHaveAttribute("aria-selected", "true");

    await tab(page, "read").click();
    await page.getByRole("tabpanel").getByRole("button", { name: "Stuck? Ask the mentor" }).click();
    await expect(page.getByRole("tabpanel", { name: "AI mentor" })).toBeVisible();
    await expect(mentor).toHaveAttribute("aria-pressed", "true");
    await mentor.click();
    await expect(tab(page, "read")).toHaveAttribute("aria-selected", "true");
  });

  test("AI mentor shows starter questions and streams an answer (mocked gateway)", async ({ page }) => {
    await page.route("**/api/ai/live-review/chat/stream", (route) => route.fulfill({
      status: 200,
      headers: { "Content-Type": "text/event-stream" },
      body: sse([
        ["delta", { text: "Think of state as a ", length: 20 }],
        ["delta", { text: "photo of one render.", length: 40 }],
        ["done", { message: { role: "assistant", content: "Think of state as a photo of one render." } }],
      ]),
    }));
    await page.goto("/react/card/state_updates");
    await studyRegion(page).getByRole("button", { name: "Ask the mentor", exact: true }).click();
    const chat = page.getByRole("region", { name: "Conversation with the mentor" });
    await expect(chat.getByRole("button", { name: "Explain it with an analogy" })).toBeVisible();
    await expect(chat.getByRole("button", { name: "What would they ask me in an interview?" })).toBeVisible();

    const input = chat.getByRole("textbox", { name: "Question for the mentor" });
    await input.fill("Why is state a snapshot?");
    await input.press("Enter");
    await expect(chat.locator(".msg--user")).toHaveText("Why is state a snapshot?");
    await expect(chat.locator(".msg--assistant")).toContainText("Think of state as a photo of one render.");
    await expect(input).toHaveValue("");
  });

  test("Evaluate without a draft shows the empty state; Explain autosaves, coaches on pause and unlocks evaluation", async ({ page }) => {
    const reviews = [];
    await page.route("**/api/ai/live-review/stream", (route) => {
      reviews.push(JSON.parse(route.request().postData()));
      return route.fulfill({
        status: 200,
        headers: { "Content-Type": "text/event-stream" },
        body: sse([
          ["progress", { length: 40, stage: "live_review" }],
          ["done", { review: { hint: { kind: "gap", id: "gap_e2e", label: "Automatic batching", text: "Say what React 18 batches automatically." }, coverage: [] } }],
        ]),
      });
    });
    await page.goto("/react/card/state_updates");
    await tab(page, "evaluate").click();
    const stage = page.getByRole("tabpanel");
    await expect(stage.getByText("Write your explanation first")).toBeVisible();
    await stage.getByRole("button", { name: "Explain it first" }).click();
    await expect(tab(page, "paraphrase")).toHaveAttribute("aria-selected", "true");

    const editor = stage.getByRole("textbox", { name: "Your explanation" });
    const evaluate = stage.locator(".editor__actions").getByRole("button", { name: "Evaluate" });
    // One primary action; coaching has no button of its own.
    await expect(stage.getByRole("button", { name: "Review with AI" })).toHaveCount(0);
    await expect(evaluate).toHaveAttribute("aria-disabled", "true");
    const coach = page.getByRole("complementary", { name: "Guide for your explanation" });
    await expect(coach).toContainText("When you pause, the coach marks which ideas you have covered");

    const answer = "State in React is a snapshot of one render. Calling a setter schedules a new render and updates are batched.";
    await editor.fill(answer);
    await expect(stage.locator(".editor__bar")).toContainText(`${answer.split(/\s+/).length} words`);
    await expect(stage.locator(".editor__bar")).toContainText("Saved");
    await expect(tab(page, "paraphrase")).toContainText("Draft");
    await expect(evaluate).not.toHaveAttribute("aria-disabled", "true");

    // About five seconds after typing stops the draft is reviewed once and the coach shows the next idea.
    await expect(coach).toContainText("Automatic batching", { timeout: 20_000 });
    await expect(coach).toContainText("Say what React 18 batches automatically.");
    expect(reviews).toHaveLength(1);
    expect(reviews[0]).toMatchObject({ nodeId: "state_updates", answer });

    await page.reload();
    await expect(tab(page, "read")).toHaveAttribute("aria-selected", "true");
    await tab(page, "paraphrase").click();
    await expect(page.getByRole("textbox", { name: "Your explanation" })).toHaveValue(answer);
    await page.getByRole("tabpanel").locator(".editor__actions").getByRole("button", { name: "Evaluate" }).click();
    await expect(tab(page, "evaluate")).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("heading", { name: "Evaluate your explanation" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Evaluate now" })).toBeVisible();
    await expect(page.locator(".eval-draft")).toContainText(answer);
    // No result yet, so nothing points past the evaluation.
    await expect(page.locator(".eval-next")).toHaveCount(0);
  });

  test("after an evaluation below 100 the primary action is 'Improve my explanation'", async ({ page }) => {
    await page.goto("/react");
    await seedFixture(page, "hydrated-state");
    await page.goto("/react/card/react_mental_model");
    await tab(page, "evaluate").click();
    await expect(tab(page, "evaluate")).toContainText("85/120");
    const next = page.locator(".eval-next");
    await expect(next.getByRole("button")).toHaveText(["Improve my explanation", "Back to Study"]);
    await expect(next.getByRole("button", { name: "Improve my explanation" })).toHaveClass(/btn--primary/);
    await next.getByRole("button", { name: "Improve my explanation" }).click();
    await expect(tab(page, "paraphrase")).toHaveAttribute("aria-selected", "true");

    await tab(page, "evaluate").click();
    await page.locator(".eval-next").getByRole("button", { name: "Back to Study" }).click();
    await expect(page.locator(".study")).toHaveCount(0);
    await expect(page).toHaveURL(/\/react$/);
  });

  test("Zen mode toggles; Escape leaves Zen first, then closes the session", async ({ page }) => {
    await page.goto("/react/card/state_updates");
    const study = studyRegion(page);
    await study.getByRole("button", { name: "Zen mode" }).click();
    await expect(study).toHaveClass(/is-zen/);
    const exit = study.getByRole("button", { name: "Exit Zen mode (Esc)" });
    await expect(exit).toHaveAttribute("aria-pressed", "true");
    await exit.click();
    await expect(study).not.toHaveClass(/is-zen/);

    await study.getByRole("button", { name: "Zen mode" }).click();
    await page.keyboard.press("Escape");
    await expect(study).not.toHaveClass(/is-zen/);
    await page.keyboard.press("Escape");
    await expect(study).toHaveCount(0);
    await expect(page).toHaveURL(/\/react$/);
  });

  test("context rail links open the neighbour card and 'Back to' returns", async ({ page }) => {
    await page.goto("/react/card/state_updates");
    const rail = page.getByRole("complementary", { name: "Card context" });
    await rail.getByRole("button", { name: /Hooks and their rules/ }).click();
    await expect(page.locator(".study__title")).toHaveText("Hooks and their rules");
    await expect(page).toHaveURL(/\/react\/card\/[a-z_]+$/);
    await expect(page).not.toHaveURL(/state_updates$/);

    await page.getByRole("button", { name: `Back to ${CARD}` }).click();
    await expect(page.locator(".study__title")).toHaveText(CARD);
    await expect(page).toHaveURL(/\/react\/card\/state_updates$/);
    await page.getByRole("button", { name: "Close (Esc)" }).click();
    await expect(page.locator(".study")).toHaveCount(0);
  });

  test("read-aloud narrator toggles play, pause and stop", async ({ page }) => {
    // Headless browsers have no voices: stub the Web Speech API so the narrator's state is deterministic.
    await page.addInitScript(() => {
      const synth = { speak() {}, cancel() {}, pause() {}, resume() {}, getVoices: () => [] };
      Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
      window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    });
    await page.goto("/react/card/state_updates");
    const narrator = page.getByRole("group", { name: "Read aloud" });
    await narrator.getByRole("button", { name: "Read aloud" }).click();
    await narrator.getByRole("button", { name: "Pause reading" }).click();
    await expect(narrator.getByRole("button", { name: "Resume reading" })).toBeVisible();
    await narrator.getByRole("button", { name: "Stop reading" }).click();
    await expect(narrator.getByRole("button", { name: "Read aloud" })).toBeVisible();
    await expect(narrator.getByRole("button", { name: "Stop reading" })).toHaveCount(0);
    await narrator.getByRole("button", { name: /^Speed 1x/ }).click();
    await expect(narrator.getByRole("button", { name: /^Speed 1.25x/ })).toBeVisible();
  });

  test("attempt history navigates between evaluations; a mastered card leads to the next concept (State 3: Boundary)", async ({ page }) => {
    await page.goto("/react");
    await seedFixture(page, "workspace-boundary");
    await page.goto("/react/card/js_basics");
    await tab(page, "evaluate").click();
    await expect(tab(page, "evaluate")).toContainText("120/120");

    const history = page.getByRole("complementary", { name: "Attempt history" });
    await expect(history.getByRole("heading", { name: "History · 3" })).toBeVisible();
    await expect(history.getByRole("img", { name: "Progress: 65, 90, 120" })).toBeVisible();
    const items = history.locator(".history__item");
    await expect(items).toHaveCount(3);
    await expect(items.nth(0)).toHaveAttribute("aria-current", "true");

    const result = page.locator(".result");
    await expect(result.locator(".score-value--lg")).toHaveAttribute("aria-label", "120 of 120");
    await expect(result).toContainText("Latest attempt");

    await items.filter({ hasText: "#2" }).click();
    await expect(items.nth(1)).toHaveAttribute("aria-current", "true");
    await expect(result.locator(".score-value--lg")).toHaveAttribute("aria-label", "90 of 120");
    await expect(result).toContainText("Previous attempt");

    await items.filter({ hasText: "#3" }).click();
    await expect(result.locator(".score-value--lg")).toHaveAttribute("aria-label", "120 of 120");
    await expect(result).toContainText("Latest attempt");

    // Mastered: the primary action is the best next concept, not another rewrite.
    const next = page.locator(".eval-next");
    const primary = next.getByRole("button", { name: /^Next: / });
    await expect(primary).toHaveClass(/btn--primary/);
    await expect(next.getByRole("button", { name: "Improve my explanation" })).toHaveCount(0);
    await expect(next.getByRole("button", { name: "Back to Study" })).toBeVisible();
    const label = (await primary.textContent()).replace(/^Next:\s*/, "").trim();
    expect(label).not.toBe("Modern JavaScript for reading React");
    await primary.click();
    await expect(page.locator(".study__title")).toHaveText(label);
    await expect(page).not.toHaveURL(/js_basics$/);
    await expect(tab(page, "read")).toHaveAttribute("aria-selected", "true");
  });
});
