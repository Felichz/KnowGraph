import { test, expect } from "@playwright/test";
import { failOnPageError, seedFixture } from "./helpers.js";

const dockOf = (page) => page.getByRole("navigation", { name: "Mobile main navigation" });

// User Story 7: phone ergonomics — bottom dock with the two destinations, next step first, compact top bar.
test.describe("Mobile ergonomics & bottom dock (User Story 7)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    failOnPageError(page);
    await page.goto("/react");
  });

  test("shows the bottom dock instead of the sidebar and puts the next step above the grid", async ({ page }) => {
    const dock = dockOf(page);
    await expect(dock).toBeVisible();
    await expect(dock.getByRole("button")).toHaveText(["Study", "Review", "Search", "Settings"]);
    await expect(dock.getByRole("button", { name: "Study" })).toHaveAttribute("aria-current", "page");
    await expect(dock.locator(".dock__badge")).toHaveCount(0);
    await expect(page.locator(".sidebar")).toHaveCount(0);
    await expect(page.locator(".mtopbar .curriculum")).toHaveAccessibleName("Curriculum: React interviews. Change");
    await expect(page.locator(".next")).toContainText("Start here");

    await seedFixture(page, "hydrated-state");
    await expect(dock.getByRole("button", { name: /^Review/ })).toHaveAccessibleName("Review · 4 due today");
    await expect(dock.locator(".dock__badge")).toHaveText("4");
    const next = await page.locator(".next").boundingBox();
    const grid = await page.locator(".hgrid").boundingBox();
    expect(next.y).toBeLessThan(grid.y);
    // No horizontal page scroll at phone width.
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });

  test("navigates every dock destination with one tap", async ({ page }) => {
    const dock = dockOf(page);

    await dock.getByRole("button", { name: "Review" }).click();
    await expect(page).toHaveURL(/\?view=flashcards$/);
    await expect(page.locator("button.fcard").first()).toBeVisible();
    await expect(dock.getByRole("button", { name: "Review" })).toHaveAttribute("aria-current", "page");

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

    await dock.getByRole("button", { name: "Study" }).click();
    await expect(page).toHaveURL(/\/react$/);
    await expect(page.locator(".next")).toBeVisible();
  });

  test("the curriculum menu in the top bar switches maps", async ({ page }) => {
    await page.locator(".mtopbar .curriculum").click();
    await page.getByRole("menu", { name: "Choose curriculum" }).getByRole("menuitemradio", { name: /Rails/ }).click();
    await expect(page).toHaveURL(/\/rails$/);
    await expect(page.locator(".mtopbar .curriculum")).toHaveAccessibleName(/^Curriculum: Rails/);
  });

  test("tapping a grid area focuses it: a top-bar chip names it and its concepts show as rows", async ({ page }) => {
    await seedFixture(page, "hydrated-state");
    await page.locator(".hgrid__area", { hasText: "State & data" }).click();
    const chip = page.locator(".mtopbar .focus-chip");
    await expect(chip).toHaveText("Showing State & data");
    await expect(page.locator("button.concept-row")).toHaveCount(11);

    await chip.click();
    await expect(chip).toHaveCount(0);
    await expect(page.locator("button.concept-row")).toHaveCount(0);

    await page.locator(".hgrid__area", { hasText: "State & data" }).click();
    await page.locator('button.concept-row[data-node="state_updates"]').click();
    await expect(page.getByRole("region", { name: "Study: State, snapshots and batching" })).toBeVisible();
  });

  test("'View as graph' opens graph mode with a compact concept sheet; 'Back to the grid' returns", async ({ page }) => {
    await seedFixture(page, "hydrated-state");
    await page.getByRole("button", { name: "View as graph" }).click();
    await expect(page.locator(".graph-svg")).toBeVisible();
    const sheet = page.getByRole("complementary", { name: "Selected concept" });
    await expect(sheet.getByRole("heading", { level: 2 })).toBeVisible();
    await expect(sheet.getByRole("button", { name: "Study now" })).toBeVisible();
    await page.getByRole("toolbar", { name: "Map controls" }).getByRole("button", { name: "Back to the grid" }).click();
    await expect(page.locator(".hgrid")).toBeVisible();
    await expect(page.locator(".graph-svg")).toHaveCount(0);
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
    await expect(page.locator(".next")).toBeVisible();
  });

  test("an unknown card URL falls back to the map", async ({ page }) => {
    await page.goto("/react/card/does_not_exist");
    await expect(page).toHaveURL(/\/react$/);
    await expect(page.locator(".study")).toHaveCount(0);
    await expect(page.locator(".next")).toBeVisible();
  });

  test("supports browser Back / Forward between the map and a card", async ({ page }) => {
    await page.goto("/react");
    await seedFixture(page, "hydrated-state");
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
