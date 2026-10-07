import { test, expect } from "@playwright/test";
import { failOnPageError, seedFixture, sse } from "./helpers.js";

const CARD = "State, snapshots and batching";

const studyRegion = (page, label = CARD) => page.getByRole("region", { name: `Study: ${label}` });
const tab = (page, id) => page.locator(`#study-tab-${id}`);

// User Story 2: the study session (Read → AI mentor → Paraphrase → Evaluate) over the map.
test.describe("Study session stages (User Story 2)", () => {
  test.beforeEach(async ({ page }) => {
    failOnPageError(page);
  });

  test("opens from a heat-grid cell on the Read stage with the four stage tabs", async ({ page }) => {
    await page.goto("/react");
    await page.locator('.hgrid__cell[data-node="state_updates"]').click();
    await expect(page).toHaveURL(/\/react\/card\/state_updates$/);

    const study = studyRegion(page);
    await expect(study.getByRole("heading", { level: 1 })).toHaveText(CARD);
    const tabs = study.getByRole("tablist", { name: "Study stages" }).getByRole("tab");
    await expect(tabs).toHaveText([/01\s*Read/, /02\s*AI mentor/, /03\s*Paraphrase/, /04\s*Evaluate/]);
    await expect(tab(page, "read")).toHaveAttribute("aria-selected", "true");

    const stage = page.getByRole("tabpanel");
    await expect(stage.locator(".lesson__lead")).toBeVisible();
    await expect(stage.getByRole("heading", { name: "Naive vs. production" })).toBeVisible();
    await expect(stage.getByText("Why it fails.")).toBeVisible();
    await expect(stage.getByText("Trade-off.")).toBeVisible();
    await expect(stage.getByRole("heading", { name: "Sources" })).toBeVisible();
    await expect(stage.locator(".lesson__sources a").first()).toHaveAttribute("href", /^https?:\/\//);

    const rail = page.getByRole("complementary", { name: "Card context" });
    await expect(rail).toContainText("Where it fits");
    await expect(rail).toContainText("Interview questions");
  });

  test("stage tabs switch with clicks, arrow keys and the in-stage next buttons", async ({ page }) => {
    await page.goto("/react/card/state_updates");
    await tab(page, "read").focus();
    await page.keyboard.press("ArrowRight");
    await expect(tab(page, "mentor")).toHaveAttribute("aria-selected", "true");
    await expect(tab(page, "mentor")).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(tab(page, "evaluate")).toHaveAttribute("aria-selected", "true");

    await tab(page, "read").click();
    await page.getByRole("tabpanel").getByRole("button", { name: "Talk to the mentor" }).click();
    await expect(tab(page, "mentor")).toHaveAttribute("aria-selected", "true");
    await page.getByRole("tabpanel").getByRole("button", { name: "Go to paraphrase" }).click();
    await expect(tab(page, "paraphrase")).toHaveAttribute("aria-selected", "true");
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
    await tab(page, "mentor").click();
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

  test("Evaluate without a draft shows the empty state; Paraphrase autosaves and unlocks evaluation", async ({ page }) => {
    await page.goto("/react/card/state_updates");
    await tab(page, "evaluate").click();
    const stage = page.getByRole("tabpanel");
    await expect(stage.getByText("Write your explanation first")).toBeVisible();
    await stage.getByRole("button", { name: "Go to paraphrase" }).click();
    await expect(tab(page, "paraphrase")).toHaveAttribute("aria-selected", "true");

    const editor = stage.getByRole("textbox", { name: "Your explanation" });
    const evaluate = stage.locator(".editor__actions").getByRole("button", { name: "Evaluate" });
    await expect(evaluate).toHaveAttribute("aria-disabled", "true");
    const answer = "State in React is a snapshot of one render. Calling a setter schedules a new render and updates are batched.";
    await editor.fill(answer);
    await expect(stage.locator(".editor__bar")).toContainText(`${answer.split(/\s+/).length} words`);
    await expect(stage.locator(".editor__bar")).toContainText("Saved");
    await expect(tab(page, "paraphrase")).toContainText("Draft");

    await page.reload();
    await expect(tab(page, "read")).toHaveAttribute("aria-selected", "true");
    await tab(page, "paraphrase").click();
    await expect(page.getByRole("textbox", { name: "Your explanation" })).toHaveValue(answer);
    await page.getByRole("tabpanel").locator(".editor__actions").getByRole("button", { name: "Evaluate" }).click();
    await expect(tab(page, "evaluate")).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("heading", { name: "Evaluate your explanation" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Evaluate now" })).toBeVisible();
    await expect(page.locator(".eval-draft")).toContainText(answer);
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

  test("attempt history navigates between evaluations (User Story 2 State 3: Boundary)", async ({ page }) => {
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
  });
});
