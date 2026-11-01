import { test, expect } from "@playwright/test";
import { failOnPageError, seedFixture } from "./helpers.js";

const sidebar = (page) => page.getByRole("complementary", { name: "Main navigation" });
const nav = (page) => page.getByRole("navigation", { name: "Views" });

async function runPaletteAction(page, query, option) {
  await page.keyboard.press("Control+k");
  const palette = page.getByRole("dialog", { name: "Search" });
  await palette.getByRole("combobox").fill(query);
  await palette.getByRole("option", { name: option }).click();
  await expect(palette).toHaveCount(0);
}

// User Story 1: navigate the knowledge map (next step, heat grid, area focus, graph mode, two views, palette).
test.describe("Workspace navigation & map views (User Story 1)", () => {
  test.beforeEach(async ({ page }) => {
    failOnPageError(page);
    await page.goto("/react");
  });

  test("first use boots on a single 'Start here' step with the three-step loop and nothing else", async ({ page }) => {
    await expect(sidebar(page)).toContainText("Learning Workspace");
    await expect(sidebar(page).locator(".curriculum")).toHaveAccessibleName("Curriculum: React interviews. Change");
    await expect(nav(page).getByRole("button")).toHaveText(["Study", "Review"]);
    await expect(nav(page).getByRole("button", { name: "Study" })).toHaveAttribute("aria-current", "page");
    // Nothing is due yet, so Review carries no badge.
    await expect(nav(page).locator(".side-item__badge")).toHaveCount(0);
    await expect(page.locator(".topbar__title")).toHaveText(/Study\s*·\s*React interviews/);

    // The top bar only says where you are: no List/Graph, language or theme controls, and no focus chip yet.
    await expect(page.locator(".topbar").getByRole("button")).toHaveCount(0);
    await expect(page.locator(".topbar").getByRole("radio")).toHaveCount(0);

    const next = page.getByRole("region", { name: "Modern JavaScript for reading React" });
    await expect(next).toHaveClass(/\bnext\b/);
    await expect(next).toContainText("Start here");
    await expect(next.locator("#next-title")).toHaveText("Modern JavaScript for reading React");
    await expect(next.getByRole("button")).toHaveText(["Start studying"]);
    const steps = next.getByRole("list", { name: "How studying works here" });
    await expect(steps.getByRole("listitem")).toHaveCount(3);
    await expect(steps).toContainText("Read the card.");
    await expect(steps).toContainText("Explain it in your own words.");
    await expect(steps).toContainText("Get it evaluated.");

    // Grid, levels, hint and concept cards only appear once there is activity.
    await expect(page.locator(".hgrid")).toHaveCount(0);
    await expect(page.locator(".levels")).toHaveCount(0);
    await expect(page.locator(".map__hint")).toHaveCount(0);
    await expect(page.locator("button.concept")).toHaveCount(0);

    await next.getByRole("button", { name: "Start studying" }).click();
    await expect(page).toHaveURL(/\/react\/card\/js_basics$/);
    await expect(page.locator("#study-tab-read")).toHaveAttribute("aria-selected", "true");
  });

  test("the legacy ?view=progress URL canonicalises to the map", async ({ page }) => {
    await page.goto("/react?view=progress");
    await expect(page).toHaveURL(/\/react$/);
    await expect(page.locator(".next")).toBeVisible();
    await expect(nav(page).getByRole("button", { name: "Study" })).toHaveAttribute("aria-current", "page");
    await expect(nav(page).getByRole("button", { name: /Progress/ })).toHaveCount(0);
  });

  test("switches between the React and Rails curricula from the compact menu", async ({ page }) => {
    const trigger = sidebar(page).locator(".curriculum");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    const menu = page.getByRole("menu", { name: "Choose curriculum" });
    await expect(menu.getByRole("menuitemradio")).toHaveCount(2);
    await expect(menu.getByRole("menuitemradio", { name: /React/ })).toHaveAttribute("aria-checked", "true");
    await menu.getByRole("menuitemradio", { name: /Rails/ }).click();
    await expect(menu).toHaveCount(0);
    await expect(page).toHaveURL(/\/rails$/);
    await expect(trigger).toHaveAccessibleName(/^Curriculum: Rails/);
    await expect(page.locator(".topbar__sub")).toContainText("Rails");
    await expect(page.locator(".next")).toContainText("Start here");

    // Escape closes the menu without switching.
    await trigger.click();
    await expect(menu.getByRole("menuitemradio", { name: /Rails/ })).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
    await expect(page).toHaveURL(/\/rails$/);

    await trigger.click();
    await menu.getByRole("menuitemradio", { name: /React/ }).click();
    await expect(page).toHaveURL(/\/react$/);
    await expect(page.locator(".topbar__sub")).toContainText("React interviews");
  });

  test("clicking a grid area focuses it; the top-bar chip or a second click clears the focus", async ({ page }) => {
    await seedFixture(page, "hydrated-state");
    await expect(page.locator(".map__hint")).toBeVisible();
    await expect(page.locator(".focus-chip")).toHaveCount(0);

    const area = page.locator(".hgrid__area", { hasText: "State & data" });
    await area.click();
    await expect(area).toHaveAttribute("aria-pressed", "true");
    const chip = page.locator(".topbar .focus-chip");
    await expect(chip).toHaveText("Showing State & data");
    await expect(chip).toHaveAccessibleName("Show all areas");
    // Only the focused area stays in the grid, and its concepts appear as cards.
    await expect(page.locator(".hgrid__row")).toHaveCount(1);
    await expect(page.locator("button.concept")).toHaveCount(11);
    await expect(page.locator('button.concept[data-node="state_updates"]')).toBeVisible();
    await expect(page.locator(".map__hint")).toHaveCount(0);

    await chip.click();
    await expect(chip).toHaveCount(0);
    await expect(page.locator(".hgrid__row")).toHaveCount(11);
    await expect(page.locator("button.concept")).toHaveCount(0);
    await expect(page.locator(".map__hint")).toBeVisible();

    const effects = page.locator(".hgrid__area", { hasText: "Effects & async" });
    await effects.click();
    await expect(page.locator("button.concept")).toHaveCount(5);
    await expect(chip).toHaveText("Showing Effects & async");
    await effects.click();
    await expect(page.locator("button.concept")).toHaveCount(0);
    await expect(chip).toHaveCount(0);
  });

  test("graph mode: dependency map, controls, minimap and the selected-concept panel", async ({ page }) => {
    // On first use the grid is hidden, so the palette is the way into the graph.
    await runPaletteAction(page, "graph", "View the map as a graph");
    const svg = page.locator(".graph-svg");
    await expect(svg).toBeVisible();
    expect(await svg.locator("g.gnode[data-node]").count()).toBe(101);
    await expect(page.locator(".gminimap")).toBeVisible();

    const toolbar = page.getByRole("toolbar", { name: "Map controls" });
    await expect(toolbar.getByRole("button", { name: "Back to the grid" })).toBeVisible();
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

  test("'View as graph' on the grid is remembered across reloads and 'Back to the grid' returns", async ({ page }) => {
    await seedFixture(page, "hydrated-state");
    await page.locator(".hgrid__graph").click();
    await expect(page.locator(".graph-svg")).toBeVisible();
    await expect(page.locator(".hgrid")).toHaveCount(0);
    await page.reload();
    await expect(page.locator(".graph-svg")).toBeVisible();
    await page.getByRole("toolbar", { name: "Map controls" }).getByRole("button", { name: "Back to the grid" }).click();
    await expect(page.locator(".hgrid")).toBeVisible();
    await expect(page.locator(".graph-svg")).toHaveCount(0);
    await page.reload();
    await expect(page.locator(".hgrid")).toBeVisible();
  });

  test("sidebar navigates between Study and Review; Search and Settings open their overlays", async ({ page }) => {
    await nav(page).getByRole("button", { name: "Review" }).click();
    await expect(page).toHaveURL(/\?view=flashcards$/);
    await expect(page.getByRole("heading", { name: "Review", exact: true })).toBeVisible();
    await expect(page.locator(".topbar__title")).toHaveText(/Review\s*·\s*React interviews/);
    await expect(nav(page).getByRole("button", { name: "Review" })).toHaveAttribute("aria-current", "page");

    await nav(page).getByRole("button", { name: "Study" }).click();
    await expect(page).toHaveURL(/\/react$/);
    await expect(page.locator(".next")).toBeVisible();

    await sidebar(page).getByRole("button", { name: /Search…/ }).click();
    await expect(page.getByRole("dialog", { name: "Search" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Search" })).toHaveCount(0);

    await sidebar(page).getByRole("button", { name: "Settings", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Settings" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Settings" })).toHaveCount(0);
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

  test("hydrated progress: resume step, review link, due badge, lit grid and collapsed levels (Universal State 2)", async ({ page }) => {
    await seedFixture(page, "hydrated-state");

    // The most recent unfinished card (85/120) is the single next step; four worked cards are due.
    const next = page.locator(".next");
    await expect(next).toContainText("Pick up where you left off");
    await expect(next.locator("#next-title")).toHaveText("Mental model: UI as a function of state");
    await expect(next).toContainText("Your explanation needs work before it reaches 100");
    await expect(next.getByRole("button", { name: "Resume" })).toBeVisible();
    await expect(next.locator(".intro__steps")).toHaveCount(0);
    const review = next.locator(".next__review");
    await expect(review).toHaveText(/or review 4 cards due today/);

    const reviewNav = nav(page).getByRole("button", { name: /^Review/ });
    await expect(reviewNav).toHaveAccessibleName("Review · 4 due today");
    await expect(reviewNav.locator(".side-item__badge")).toHaveText("4");

    const grid = page.locator(".hgrid");
    await expect(grid.getByRole("heading", { name: "Your map" })).toBeVisible();
    await expect(grid.getByRole("button", { name: "View as graph" })).toBeVisible();
    await expect(grid.locator(".hgrid__total")).toHaveText(/2\s*\/101 mastered/);
    await expect(grid.locator(".hgrid__row")).toHaveCount(11);
    await expect(grid.locator(".hgrid__cell")).toHaveCount(101);
    await expect(grid.locator('.hgrid__cell[data-node="js_basics"]')).toHaveAttribute("aria-label", /105\/120 · extra depth/);
    await expect(grid.locator('.hgrid__cell[data-node="components_props"]')).toHaveAttribute("aria-label", /115\/120 · extra depth/);
    await expect(grid.locator('.hgrid__cell[data-node="react_mental_model"]')).toHaveAttribute("aria-label", /^Mental model: UI as a function of state · 85\/120/);
    await expect(grid.locator('.hgrid__cell[data-node="state_updates"]')).toHaveAttribute("aria-label", /draft, not evaluated yet/);
    await expect(page.locator(".hgrid__area", { hasText: "Mental model & components" })).toContainText("2/7");

    // Levels and milestones: collapsed under the grid, opened on demand.
    const levels = page.locator("details.levels");
    await expect(levels).not.toHaveAttribute("open", "");
    await expect(levels.locator("summary")).toContainText("Levels and milestones");
    await expect(levels.getByRole("heading", { name: "Milestones" })).toBeHidden();
    await levels.locator("summary").click();
    await expect(levels).toHaveAttribute("open", "");
    await expect(levels.getByRole("list", { name: "Seniority levels" })).toBeVisible();
    await expect(levels.getByRole("heading", { name: "Milestones" })).toBeVisible();

    await page.locator(".hgrid__area", { hasText: "Mental model & components" }).click();
    await expect(page.locator('button.concept[data-node="js_basics"]')).toHaveAttribute("aria-label", /score 105 of 120, mastered/);
    await expect(page.locator('button.concept[data-node="react_mental_model"]')).toHaveAttribute("aria-label", /score 85 of 120(\.|$)/);

    // Resume opens the card on the stage it left off.
    await page.locator(".focus-chip").click();
    await next.getByRole("button", { name: "Resume" }).click();
    await expect(page).toHaveURL(/\/react\/card\/react_mental_model$/);
    await expect(page.locator("#study-tab-paraphrase")).toHaveAttribute("aria-selected", "true");
  });

  test("with nothing to resume the next step is 'Best next', and its review link opens Review (Boundary)", async ({ page }) => {
    await seedFixture(page, "workspace-boundary");
    const next = page.locator(".next");
    await expect(next.locator(".pill").first()).toHaveText("Best next");
    await expect(next.getByRole("button", { name: "Study now" })).toBeVisible();
    await expect(next.getByRole("button", { name: "Resume" })).toHaveCount(0);
    const review = next.locator(".next__review");
    await expect(review).toHaveText(/or review 2 cards due today/);
    await review.click();
    await expect(page).toHaveURL(/\?view=flashcards$/);
    await expect(page.getByRole("radiogroup", { name: "Filter flashcards" }).getByRole("radio", { name: "Due today · 2" })).toHaveAttribute("aria-checked", "true");
  });
});
