import { test, expect } from "@playwright/test";
import { REVIEW_KEY, failOnPageError, seedFixture } from "./helpers.js";

const filters = (page) => page.getByRole("radiogroup", { name: "Filter flashcards" });
const filter = (page, name) => filters(page).getByRole("radio", { name });
const modalOf = (page) => page.getByRole("dialog").filter({ has: page.locator(".fmodal__frame") });

// User Story 6: Review — flashcards grid, and a single card modal that is the review (reveal, rate 1–4, next).
test.describe("Flashcards & active recall (User Story 6)", () => {
  test.beforeEach(async ({ page }) => {
    failOnPageError(page);
    await page.goto("/react?view=flashcards");
    await expect(page.getByRole("heading", { name: "Review", exact: true })).toBeVisible();
  });

  test("renders the grid with the two counted filters and a due-today empty state with 'Show all'", async ({ page }) => {
    // Without progress nothing is due, so the view opens on "All" and there is no "Review N due" action.
    await expect(filters(page).getByRole("radio")).toHaveText(["Due today · 0", "All · 101"]);
    await expect(filter(page, "All · 101")).toHaveAttribute("aria-checked", "true");
    await expect(page.locator("button.fcard")).toHaveCount(101);
    await expect(page.getByRole("button", { name: /^Review \d+ due$/ })).toHaveCount(0);

    await filter(page, "Due today · 0").click();
    await expect(page.locator("button.fcard")).toHaveCount(0);
    await expect(page.getByText("Nothing due today")).toBeVisible();
    await page.getByRole("button", { name: "Show all" }).click();
    await expect(filter(page, "All · 101")).toHaveAttribute("aria-checked", "true");
    await expect(page.locator("button.fcard")).toHaveCount(101);
  });

  test("card modal reveals the answer, offers the ratings and moves between cards with buttons and keys", async ({ page }) => {
    const first = page.locator("button.fcard").first();
    const title = (await first.locator(".fcard__title").textContent()).trim();
    await first.click();

    // The dialog is labelled by the current card's title, which changes while navigating.
    await expect(page.getByRole("dialog", { name: title })).toBeVisible();
    const modal = modalOf(page);
    await expect(modal.locator(".fmodal__pos")).toHaveText("1 / 101");
    await expect(modal.getByRole("button", { name: "Previous card" })).toBeDisabled();
    const rates = modal.getByRole("group", { name: "How well did you know it?" });
    await expect(rates).toHaveCount(0);
    await expect(modal.locator(".fmodal__keys")).toHaveText("Space shows the answer · 1–4 rate it · ← → move between cards");

    // Rating keys do nothing before the answer is shown.
    await page.keyboard.press("3");
    await expect(modal.locator(".fmodal__pos")).toHaveText("1 / 101");

    await modal.getByRole("button", { name: /Show answer/ }).click();
    await expect(modal.getByRole("heading", { name: "Key idea" })).toBeVisible();
    await expect(modal.getByText("You haven't written an explanation for this card yet.")).toBeVisible();
    await expect(rates.getByRole("button")).toHaveText([/Again\s*1/, /Hard\s*2/, /Good\s*3/, /Easy\s*4/]);

    await modal.getByRole("button", { name: "Next card" }).click();
    await expect(modal.locator(".fmodal__pos")).toHaveText("2 / 101");
    await expect(modal.getByRole("heading", { name: "Key idea" })).toHaveCount(0);
    await expect(rates).toHaveCount(0);

    await page.keyboard.press("Space");
    await expect(modal.getByRole("heading", { name: "Key idea" })).toBeVisible();
    await page.keyboard.press("Space");
    await expect(modal.getByRole("heading", { name: "Key idea" })).toHaveCount(0);
    await page.keyboard.press("ArrowRight");
    await expect(modal.locator(".fmodal__pos")).toHaveText("3 / 101");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(modal.locator(".fmodal__pos")).toHaveText("1 / 101");
    await expect(modal.locator("#fmodal-title")).toHaveText(title);

    // Navigating does not rate anything.
    expect(await page.evaluate((key) => localStorage.getItem(key), REVIEW_KEY)).toBeNull();
    await page.keyboard.press("Escape");
    await expect(page.locator(".fmodal")).toHaveCount(0);
  });

  test("'Study' in the card modal opens the study session and closing returns to Review", async ({ page }) => {
    await page.getByRole("button", { name: "State, snapshots and batching: open flashcard" }).click();
    const modal = page.getByRole("dialog", { name: "State, snapshots and batching" });
    await modal.getByRole("button", { name: "Study", exact: true }).click();
    await expect(modal).toHaveCount(0);
    await expect(page).toHaveURL(/\/react\/card\/state_updates\?view=flashcards$/);
    await expect(page.locator("#study-tab-read")).toHaveAttribute("aria-selected", "true");

    await page.getByRole("button", { name: "Close (Esc)" }).click();
    await expect(page.locator(".study")).toHaveCount(0);
    await expect(page).toHaveURL(/\/react\?view=flashcards$/);
    await expect(page.locator("button.fcard").first()).toBeVisible();
  });

  test("the command palette jumps to Review from Study", async ({ page }) => {
    await page.getByRole("navigation", { name: "Views" }).getByRole("button", { name: "Study" }).click();
    await expect(page.locator(".next")).toBeVisible();
    await page.keyboard.press("Control+k");
    const palette = page.getByRole("dialog", { name: "Search" });
    await palette.getByRole("combobox").fill("review");
    await palette.getByRole("option", { name: "Go to Review" }).click();
    await expect(page).toHaveURL(/\?view=flashcards$/);
    await expect(page.locator("button.fcard").first()).toBeVisible();
  });

  test("reviewing the due deck: reveal, rate with keys and buttons, persist the schedule and finish 'All caught up'", async ({ page }) => {
    await seedFixture(page, "hydrated-state");
    await page.getByRole("button", { name: "Review 4 due" }).click();
    const modal = modalOf(page);
    const pos = modal.locator(".fmodal__pos");
    await expect(pos).toHaveText("1 / 4");
    // Weakest first: the unevaluated draft leads the queue.
    await expect(modal.locator("#fmodal-title")).toHaveText("State, snapshots and batching");
    const rates = modal.getByRole("group", { name: "How well did you know it?" });

    // Keyboard first (focus starts on the card frame), then the mouse for the last card.
    await page.keyboard.press("Space");
    await page.keyboard.press("1"); // Again
    await expect(pos).toHaveText("2 / 4");
    await expect(rates).toHaveCount(0);

    await page.keyboard.press("Space");
    await page.keyboard.press("3"); // Good
    await expect(pos).toHaveText("3 / 4");

    await page.keyboard.press("Space");
    await page.keyboard.press("4"); // Easy
    await expect(pos).toHaveText("4 / 4");

    await modal.getByRole("button", { name: /Show answer/ }).click();
    await rates.getByRole("button", { name: /Hard/ }).click();
    await expect(page.getByRole("dialog", { name: "All caught up" })).toBeVisible();
    await expect(modal).toContainText("You reviewed 4 cards. Each one comes back when it is due.");

    const schedule = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}"), REVIEW_KEY);
    expect(Object.keys(schedule).sort()).toEqual(["components_props", "js_basics", "react_mental_model", "state_updates"]);
    expect(schedule.state_updates.interval).toBe(0);
    expect(Object.values(schedule).map((e) => e.interval).sort()).toEqual([0, 1, 1, 3]);

    // "Again" keeps one card for today; the badge and the filter follow the schedule.
    await expect(page.getByRole("navigation", { name: "Views" }).getByRole("button", { name: /^Review/ })).toHaveAccessibleName("Review · 1 due today");

    // The done screen hands off to studying the card left unfinished.
    await modal.getByRole("button", { name: "Continue studying: Mental model: UI as a function of state" }).click();
    await expect(page.locator(".fmodal")).toHaveCount(0);
    await expect(page).toHaveURL(/\/react\/card\/react_mental_model\?view=flashcards$/);
    await expect(page.locator("#study-tab-paraphrase")).toHaveAttribute("aria-selected", "true");

    await page.getByRole("button", { name: "Close (Esc)" }).click();
    await expect(filter(page, "Due today · 1")).toHaveAttribute("aria-checked", "true");
    await expect(page.locator("button.fcard")).toHaveCount(1);
    await expect(page.locator("button.fcard .fcard__title")).toHaveText("State, snapshots and batching");
    await expect(page.locator("button.fcard .fcard__hint")).toHaveText("Due today");
    await filter(page, "All · 101").click();
    await expect(page.getByRole("button", { name: "Modern JavaScript for reading React: open flashcard" })).toContainText("Next review in 3 days");
  });

  // Regression: "Show answer" and the rating buttons unmount when clicked; focus must return to the
  // card frame so Space / 1–4 / arrows keep working.
  test("keyboard shortcuts keep working after rating a card with the mouse", async ({ page }) => {
    await seedFixture(page, "hydrated-state");
    await page.getByRole("button", { name: "Review 4 due" }).click();
    const modal = modalOf(page);
    await modal.getByRole("button", { name: /Show answer/ }).click();
    await modal.getByRole("group", { name: "How well did you know it?" }).getByRole("button", { name: /Good/ }).click();
    await expect(modal.locator(".fmodal__pos")).toHaveText("2 / 4");
    await expect(modal.locator(".fmodal__frame")).toBeFocused({ timeout: 3000 });
    await page.keyboard.press("Space");
    await expect(modal.getByRole("heading", { name: "Key idea" })).toBeVisible({ timeout: 3000 });
  });

  test("hydrated progress: score badges, the due-today queue and 'Improve explanation' (Universal State 2)", async ({ page }) => {
    await seedFixture(page, "hydrated-state");

    // Three attempts and one draft are "worked" cards due for their first review.
    await expect(filter(page, "Due today · 4")).toHaveAttribute("aria-checked", "true");
    await expect(page.getByRole("button", { name: "Review 4 due" })).toBeVisible();
    await expect(page.locator("button.fcard")).toHaveCount(4);
    await expect(page.locator("button.fcard .fcard__top")).toContainText([/85\/120/, /105\/120/, /115\/120/]);
    // A draft without evaluation still says the explanation is saved.
    await expect(page.getByRole("button", { name: "State, snapshots and batching: open flashcard" })).toContainText("Your explanation is saved");

    await filter(page, "All · 101").click();
    await expect(page.locator("button.fcard")).toHaveCount(101);

    await page.getByRole("button", { name: "State, snapshots and batching: open flashcard" }).click();
    const modal = page.getByRole("dialog", { name: "State, snapshots and batching" });
    await modal.getByRole("button", { name: /Show answer/ }).click();
    await expect(modal.locator(".fmodal__mine")).toHaveText(/State updates in React are batched/);
    await modal.getByRole("button", { name: "Improve explanation" }).click();
    await expect(modal).toHaveCount(0);
    await expect(page).toHaveURL(/\/react\/card\/state_updates\?view=flashcards$/);
    await expect(page.locator("#study-tab-paraphrase")).toHaveAttribute("aria-selected", "true");
  });
});
