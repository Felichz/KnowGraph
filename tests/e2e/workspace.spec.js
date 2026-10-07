import { test, expect } from "@playwright/test";
import { failOnPageError, seedFixture } from "./helpers.js";

// User Story 1: navigate the knowledge map (heat grid, focus areas, list/graph modes, views, palette).
test.describe("Workspace navigation & map views (User Story 1)", () => {
  test.beforeEach(async ({ page }) => {
    failOnPageError(page);
    await page.goto("/react");
  });

  test("boots on the React map with sidebar, heat grid, Continue and first-use intro", async ({ page }) => {
    const sidebar = page.getByRole("complementary", { name: "Main navigation" });
    await expect(sidebar).toContainText("Learning Workspace");
    await expect(sidebar.getByRole("radio", { name: "React" })).toHaveAttribute("aria-checked", "true");
    await expect(page.locator(".topbar__title")).toContainText("React interviews");

    const grid = page.locator(".hgrid");
    await expect(grid.getByRole("heading", { name: "Your map" })).toBeVisible();
    await expect(grid.locator(".hgrid__total")).toHaveText(/0\s*\/101 mastered/);
    await expect(grid.locator(".hgrid__row")).toHaveCount(11);
    await expect(grid.locator(".hgrid__cell")).toHaveCount(101);
    await expect(grid.locator('.hgrid__cell[data-node="state_updates"]')).toHaveAttribute("aria-label", "State, snapshots and batching · not started");

    const cont = page.locator(".continue");
    await expect(cont.getByRole("heading", { name: "Continue" })).toBeVisible();
    await expect(cont.locator(".continue__tile.is-best")).toContainText("Modern JavaScript for reading React");
    await expect(cont.getByRole("button", { name: "Study now" })).toBeVisible();
    await expect(cont.getByRole("button", { name: "Open flashcards" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "How studying works here" })).toBeVisible();

    // No concept cards until an area is picked.
    await expect(page.locator("button.concept")).toHaveCount(0);
    await expect(page.locator(".map__hint")).toBeVisible();
  });

  test("dismisses the first-use intro and keeps it hidden after reload", async ({ page }) => {
    await page.getByRole("button", { name: "Hide this introduction" }).click();
    await expect(page.getByRole("heading", { name: "How studying works here" })).toHaveCount(0);
    await page.reload();
    await expect(page.locator(".continue")).toBeVisible();
    await expect(page.getByRole("heading", { name: "How studying works here" })).toHaveCount(0);
  });

  test("switches between the React and Rails maps", async ({ page }) => {
    const graphs = page.getByRole("complementary", { name: "Main navigation" }).getByRole("radiogroup", { name: "Knowledge map" });
    await graphs.getByRole("radio", { name: "Rails" }).click();
    await expect(page).toHaveURL(/\/rails$/);
    await expect(page.locator(".hgrid__area")).toContainText(["Rails core & request", "Active Record & DB"]);
    await expect(page.locator(".hgrid__cell")).toHaveCount(41);

    await graphs.getByRole("radio", { name: "React" }).click();
    await expect(page).toHaveURL(/\/react$/);
    await expect(page.locator(".hgrid__area").first()).toContainText("Mental model & components");
  });

  test("picking an area shows its concept cards; picking again or 'All' clears the focus", async ({ page }) => {
    const area = page.locator(".hgrid__area", { hasText: "State & data" });
    await area.click();
    await expect(area).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".topbar__sub")).toContainText("State & data");
    await expect(page.locator("button.concept")).toHaveCount(11);
    await expect(page.locator('button.concept[data-node="state_updates"]')).toBeVisible();
    const focus = page.getByRole("radiogroup", { name: "Study focus" });
    await expect(focus.getByRole("radio", { name: /State & data/ })).toHaveAttribute("aria-checked", "true");

    await area.click();
    await expect(page.locator("button.concept")).toHaveCount(0);
    await expect(page.locator(".map__hint")).toBeVisible();

    await focus.getByRole("radio", { name: /Effects & async/ }).click();
    await expect(page.locator("button.concept")).toHaveCount(5);
    await focus.getByRole("radio", { name: /^All/ }).click();
    await expect(page.locator(".topbar__sub")).toContainText("All focus areas");
    await expect(page.locator("button.concept")).toHaveCount(0);
  });

  test("graph mode: dependency map, controls, minimap and the selected-concept panel", async ({ page }) => {
    await page.getByRole("radiogroup", { name: "Map mode" }).getByRole("radio", { name: "Graph" }).click();
    const svg = page.locator(".graph-svg");
    await expect(svg).toBeVisible();
    expect(await svg.locator("g.gnode[data-node]").count()).toBe(101);
    await expect(page.locator(".gminimap")).toBeVisible();

    const toolbar = page.getByRole("toolbar", { name: "Map controls" });
    const zoom = toolbar.locator(".gpanel__zoom");
    const before = await zoom.textContent();
    await toolbar.getByRole("button", { name: "Zoom in" }).click();
    await expect(zoom).not.toHaveText(before);
    await toolbar.getByRole("button", { name: "Zoom out" }).click();
    await toolbar.getByRole("button", { name: "Show the whole map" }).click();
    await toolbar.getByRole("button", { name: "Go to best next" }).click();

    // The panel starts on the best next concept; selecting another node updates it.
    const panel = page.getByRole("complementary", { name: "Selected concept" });
    await expect(panel.getByRole("heading", { level: 2 })).toHaveText("Modern JavaScript for reading React");
    await svg.locator('g.gnode[data-node="state_updates"]').focus();
    await expect(panel.getByRole("heading", { level: 2 })).toHaveText("State, snapshots and batching");
    await expect(panel.getByRole("button", { name: "Back to best next" })).toBeVisible();

    await panel.getByRole("button", { name: "Study now" }).click();
    await expect(page).toHaveURL(/\/react\/card\/state_updates$/);
    await expect(page.getByRole("region", { name: "Study: State, snapshots and batching" })).toBeVisible();
  });

  test("graph mode is remembered across reloads and List returns to the grid", async ({ page }) => {
    await page.getByRole("radio", { name: "Graph" }).click();
    await expect(page.locator(".graph-svg")).toBeVisible();
    await page.reload();
    await expect(page.locator(".graph-svg")).toBeVisible();
    await page.getByRole("radio", { name: "List" }).click();
    await expect(page.locator(".hgrid")).toBeVisible();
    await expect(page.locator(".graph-svg")).toHaveCount(0);
  });

  test("sidebar navigates between Map, Flashcards and Progress views", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Views" });
    await nav.getByRole("button", { name: "Flashcards" }).click();
    await expect(page).toHaveURL(/\?view=flashcards$/);
    await expect(page.getByRole("heading", { name: "Review" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Flashcards" })).toHaveAttribute("aria-current", "page");

    await nav.getByRole("button", { name: /Progress/ }).click();
    await expect(page).toHaveURL(/\?view=progress$/);
    await expect(page.locator(".progress__hero")).toContainText(/0\s*\/101 cards mastered/);
    await expect(page.getByRole("heading", { name: "Seniority levels" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Milestones" })).toBeVisible();

    await nav.getByRole("button", { name: "Map" }).click();
    await expect(page).toHaveURL(/\/react$/);
    await expect(page.locator(".hgrid")).toBeVisible();
  });

  test("command palette opens with Ctrl+K, filters, opens a card with Enter and closes with Escape", async ({ page }) => {
    await page.keyboard.press("Control+k");
    const palette = page.getByRole("dialog", { name: "Search" });
    const input = palette.getByRole("combobox");
    await expect(input).toBeFocused();
    await expect(input).toHaveAttribute("placeholder", /Search React interviews/);

    await input.fill("batching");
    await expect(palette.getByRole("option").first()).toContainText("State, snapshots and batching");
    await page.keyboard.press("Escape");
    await expect(palette).toHaveCount(0);

    await page.keyboard.press("Control+k");
    await page.getByRole("dialog", { name: "Search" }).getByRole("combobox").fill("batching");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/react\/card\/state_updates$/);
  });

  test("hydrated progress lights the grid, the counters and the progress view (Universal State 2)", async ({ page }) => {
    await seedFixture(page, "hydrated-state");

    const grid = page.locator(".hgrid");
    await expect(grid.locator(".hgrid__total")).toHaveText(/2\s*\/101 mastered/);
    await expect(grid.locator('.hgrid__cell[data-node="js_basics"]')).toHaveAttribute("aria-label", /105\/120 · extra depth/);
    await expect(grid.locator('.hgrid__cell[data-node="components_props"]')).toHaveAttribute("aria-label", /115\/120 · extra depth/);
    await expect(grid.locator('.hgrid__cell[data-node="react_mental_model"]')).toHaveAttribute("aria-label", /^Mental model: UI as a function of state · 85\/120/);
    await expect(grid.locator('.hgrid__cell[data-node="state_updates"]')).toHaveAttribute("aria-label", /draft, not evaluated yet/);
    await expect(page.locator(".hgrid__area", { hasText: "Mental model & components" })).toContainText("2/7");

    // Work in progress: no first-use intro, and four worked cards are due for review.
    await expect(page.getByRole("heading", { name: "How studying works here" })).toHaveCount(0);
    await expect(page.locator(".continue")).toContainText("4 cards to review today");

    await page.locator(".hgrid__area", { hasText: "Mental model & components" }).click();
    await expect(page.locator('button.concept[data-node="js_basics"]')).toHaveAttribute("aria-label", /score 105 of 120, mastered/);
    await expect(page.locator('button.concept[data-node="react_mental_model"]')).toHaveAttribute("aria-label", /score 85 of 120(\.|$)/);

    await page.getByRole("navigation", { name: "Views" }).getByRole("button", { name: /Progress/ }).click();
    await expect(page.locator(".progress__hero")).toContainText(/2\s*\/101 cards mastered/);
  });
});
