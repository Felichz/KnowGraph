import { test, expect } from "@playwright/test";
import { REVIEW_KEY, failOnPageError, seedFixture } from "./helpers.js";

const filters = (page) => page.getByRole("radiogroup", { name: "Filter flashcards" });
const filter = (page, name) => filters(page).getByRole("radio", { name });

// User Story 6: flashcards grid, navigable modal, self-rated practice and spaced repetition.
test.describe("Flashcards & active recall (User Story 6)", () => {
  test.beforeEach(async ({ page }) => {
    failOnPageError(page);
    await page.goto("/react?view=flashcards");
    await expect(page.getByRole("heading", { name: "Review" })).toBeVisible();
  });

  test("renders the grid with counted filters and an empty state with 'Show all'", async ({ page }) => {
    // Without progress nothing is due, so the view opens on "All".
    await expect(filter(page, "All · 101")).toHaveAttribute("aria-checked", "true");
    await expect(filter(page, "Due today · 0")).toBeVisible();
    await expect(filter(page, "Not attempted · 101")).toBeVisible();
    await expect(filter(page, "Below 100 · 0")).toBeVisible();
    await expect(filter(page, "Mastered · 0")).toBeVisible();
    await expect(page.locator("button.fcard")).toHaveCount(101);
    await expect(page.getByRole("button", { name: "Practice 101" })).toBeEnabled();

    await filter(page, "Mastered · 0").click();
    await expect(page.locator("button.fcard")).toHaveCount(0);
    await expect(page.getByText("No cards match this filter")).toBeVisible();
    await expect(page.getByRole("button", { name: "Practice 0" })).toBeDisabled();
    await page.getByRole("button", { name: "Show all" }).click();
    await expect(filter(page, "All · 101")).toHaveAttribute("aria-checked", "true");
    await expect(page.locator("button.fcard")).toHaveCount(101);

    await filter(page, "Due today · 0").click();
    await expect(page.getByText("Nothing due today")).toBeVisible();
  });

  test("card modal reveals the answer and moves between cards with buttons and keys", async ({ page }) => {
    const first = page.locator("button.fcard").first();
    const title = (await first.locator(".fcard__title").textContent()).trim();
    await first.click();

    // The dialog is labelled by the current card's title, which changes while navigating.
    await expect(page.getByRole("dialog", { name: title })).toBeVisible();
    const modal = page.getByRole("dialog").filter({ has: page.locator(".fmodal__frame") });
    await expect(modal.locator(".fmodal__pos")).toHaveText("1 / 101");
    await expect(modal.getByRole("button", { name: "Previous card" })).toBeDisabled();

    await modal.getByRole("button", { name: /Show answer/ }).click();
    await expect(modal.getByRole("heading", { name: "Key idea" })).toBeVisible();
    await expect(modal.getByText("You haven't written an explanation for this card yet.")).toBeVisible();

    await modal.getByRole("button", { name: "Next card" }).click();
    await expect(modal.locator(".fmodal__pos")).toHaveText("2 / 101");
    await expect(modal.getByRole("heading", { name: "Key idea" })).toHaveCount(0);

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

    await page.keyboard.press("Escape");
    await expect(page.locator(".fmodal")).toHaveCount(0);
  });

  test("'Study' in the card modal opens the study session and closing returns to flashcards", async ({ page }) => {
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

  test("the command palette jumps to flashcards from the map", async ({ page }) => {
    await page.getByRole("navigation", { name: "Views" }).getByRole("button", { name: "Map" }).click();
    await expect(page.locator(".hgrid")).toBeVisible();
    await page.keyboard.press("Control+k");
    const palette = page.getByRole("dialog", { name: "Search" });
    await palette.getByRole("combobox").fill("flashcards");
    await palette.getByRole("option", { name: "Go to flashcards" }).click();
    await expect(page).toHaveURL(/\?view=flashcards$/);
    await expect(page.locator("button.fcard").first()).toBeVisible();
  });

  test("practice: reveal, rate with keys 1–4 and persist the review schedule", async ({ page }) => {
    await filter(page, "All · 101").click();
    await page.getByRole("button", { name: "Practice 101" }).click();
    const dialog = page.getByRole("dialog", { name: "Practice" });
    await expect(dialog.locator(".overlay-header__subtitle")).toHaveText("Card 1 of 101");
    const firstCard = (await dialog.locator(".practice__q").textContent()).trim();

    // Rating keys do nothing before the answer is shown.
    await dialog.getByRole("button", { name: "Show answer" }).click();
    const rates = dialog.getByRole("group", { name: "How well did you know it?" });
    await expect(rates.getByRole("button")).toHaveText([/Again\s*1/, /Hard\s*2/, /Good\s*3/, /Easy\s*4/]);
    await page.keyboard.press("1");
    await expect(dialog.locator(".overlay-header__subtitle")).toHaveText("Card 2 of 101");

    await page.keyboard.press("Space");
    await expect(rates).toBeVisible();
    await page.keyboard.press("3");
    await expect(dialog.locator(".overlay-header__subtitle")).toHaveText("Card 3 of 101");

    const schedule = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}"), REVIEW_KEY);
    const entries = Object.values(schedule);
    expect(entries).toHaveLength(2);
    expect(entries.map((e) => e.interval).sort()).toEqual([0, 1]);

    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toHaveCount(0);
    // "Again" brings the first card back today.
    await expect(filter(page, "Due today · 1")).toBeVisible();
    await filter(page, "Due today · 1").click();
    await expect(page.locator("button.fcard")).toHaveCount(1);
    await expect(page.locator("button.fcard .fcard__title")).toHaveText(firstCard);
    await expect(page.locator("button.fcard .fcard__hint")).toHaveText("Due today");
  });

  test("hydrated progress: score badges, mastery filters and the due-today queue (Universal State 2)", async ({ page }) => {
    await seedFixture(page, "hydrated-state");

    // Three attempts and one draft are "worked" cards due for their first review.
    await expect(filter(page, "Due today · 4")).toHaveAttribute("aria-checked", "true");
    await expect(page.getByRole("button", { name: "Review 4 due" })).toBeVisible();
    await expect(page.locator("button.fcard")).toHaveCount(4);

    await filter(page, "Mastered · 2").click();
    await expect(page.locator("button.fcard")).toHaveCount(2);
    await expect(page.locator("button.fcard .fcard__top")).toContainText([/105\/120/, /115\/120/]);

    await filter(page, "Below 100 · 1").click();
    await expect(page.locator("button.fcard")).toHaveCount(1);
    await expect(page.locator("button.fcard")).toContainText("85/120");

    await filter(page, "Not attempted · 98").click();
    await expect(page.locator("button.fcard")).toHaveCount(98);
    // A draft without evaluation still says the explanation is saved.
    await expect(page.getByRole("button", { name: "State, snapshots and batching: open flashcard" })).toContainText("Your explanation is saved");

    await page.getByRole("button", { name: "State, snapshots and batching: open flashcard" }).click();
    const modal = page.getByRole("dialog", { name: "State, snapshots and batching" });
    await modal.getByRole("button", { name: /Show answer/ }).click();
    await expect(modal.locator(".fmodal__mine")).toHaveText(/State updates in React are batched/);
    await expect(modal.getByRole("button", { name: "Improve explanation" })).toBeVisible();
  });
});
