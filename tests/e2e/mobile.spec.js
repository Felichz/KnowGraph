import { test, expect } from "@playwright/test";
import { failOnPageError } from "./helpers.js";

// User Story 7: phone ergonomics — bottom dock, Continue first, focus sheet.
test.describe("Mobile ergonomics & bottom dock (User Story 7)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    failOnPageError(page);
    await page.goto("/react");
  });

  test("shows the bottom dock instead of the sidebar and puts Continue above the grid", async ({ page }) => {
    const dock = page.getByRole("navigation", { name: "Mobile main navigation" });
    await expect(dock).toBeVisible();
    await expect(dock.getByRole("button")).toHaveText(["Map", "Flashcards", "Progress", "Search", "Settings"]);
    await expect(dock.getByRole("button", { name: "Map" })).toHaveAttribute("aria-current", "page");
    await expect(page.locator(".sidebar")).toHaveCount(0);

    const cont = await page.locator(".continue").boundingBox();
    const grid = await page.locator(".hgrid").boundingBox();
    expect(cont.y).toBeLessThan(grid.y);
    // No horizontal page scroll at phone width.
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });

  test("navigates every dock destination with one tap", async ({ page }) => {
    const dock = page.getByRole("navigation", { name: "Mobile main navigation" });

    await dock.getByRole("button", { name: "Flashcards" }).click();
    await expect(page).toHaveURL(/\?view=flashcards$/);
    await expect(page.locator("button.fcard").first()).toBeVisible();

    await dock.getByRole("button", { name: "Progress" }).click();
    await expect(page.locator(".progress__hero")).toContainText(/0\s*\/101 cards mastered/);

    await dock.getByRole("button", { name: "Search" }).click();
    const palette = page.getByRole("dialog", { name: "Search" });
    await expect(palette).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(palette).toHaveCount(0);

    await dock.getByRole("button", { name: "Settings" }).click();
    const settings = page.getByRole("dialog", { name: "Settings" });
    await expect(settings).toContainText("AI connections");
    await page.keyboard.press("Escape");
    await expect(settings).toHaveCount(0);

    await dock.getByRole("button", { name: "Map" }).click();
    await expect(page).toHaveURL(/\/react$/);
    await expect(page.locator(".hgrid")).toBeVisible();
  });

  test("the focus sheet picks an area and lists its concepts as rows", async ({ page }) => {
    await page.getByRole("button", { name: "Focus: all" }).click();
    const sheet = page.getByRole("dialog", { name: "Study focus" });
    await sheet.getByRole("radio", { name: /State & data/ }).click();
    await expect(sheet).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Focus: State & data" })).toBeVisible();
    await expect(page.locator("button.concept-row")).toHaveCount(11);

    await page.locator('button.concept-row[data-node="state_updates"]').click();
    await expect(page.getByRole("region", { name: "Study: State, snapshots and batching" })).toBeVisible();
  });

  test("the top bar toggles graph mode with a compact concept sheet", async ({ page }) => {
    await page.getByRole("button", { name: "View as graph" }).click();
    await expect(page.locator(".graph-svg")).toBeVisible();
    const sheet = page.getByRole("complementary", { name: "Selected concept" });
    await expect(sheet).toContainText("Modern JavaScript for reading React");
    await expect(sheet.getByRole("button", { name: "Study now" })).toBeVisible();
    await page.getByRole("button", { name: "View as list" }).click();
    await expect(page.locator(".hgrid")).toBeVisible();
  });
});

// User Story 1 (acceptance 5): every card has a URL and the browser history works.
test.describe("URL routing & history (User Story 1 Acceptance 5)", () => {
  test.beforeEach(async ({ page }) => {
    failOnPageError(page);
  });

  test("opens the requested card directly from /:graph/card/:nodeId and closing returns to /react", async ({ page }) => {
    await page.goto("/react/card/state_updates");
    const study = page.getByRole("region", { name: "Study: State, snapshots and batching" });
    await expect(study).toBeVisible();
    await study.getByRole("button", { name: "Close (Esc)" }).click();
    await expect(study).toHaveCount(0);
    await expect(page).toHaveURL(/\/react$/);
    await expect(page.locator(".hgrid")).toBeVisible();
  });

  test("an unknown card URL falls back to the map", async ({ page }) => {
    await page.goto("/react/card/does_not_exist");
    await expect(page).toHaveURL(/\/react$/);
    await expect(page.locator(".study")).toHaveCount(0);
    await expect(page.locator(".hgrid")).toBeVisible();
  });

  test("supports browser Back / Forward between the map and a card", async ({ page }) => {
    await page.goto("/react");
    await page.locator('.hgrid__cell[data-node="state_updates"]').click();
    const study = page.getByRole("region", { name: "Study: State, snapshots and batching" });
    await expect(study).toBeVisible();
    await expect(page).toHaveURL(/\/react\/card\/state_updates$/);

    await page.goBack();
    await expect(study).toHaveCount(0);
    await expect(page).toHaveURL(/\/react$/);

    await page.goForward();
    await expect(study).toBeVisible();
    await expect(page).toHaveURL(/\/react\/card\/state_updates$/);
  });
});
