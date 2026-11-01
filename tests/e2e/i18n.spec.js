import { expect, test } from "@playwright/test";

const sidebar = (page) => page.getByRole("complementary", { name: /Main navigation|Navegación principal/ });

// English is the default language on first visit (even for a Spanish browser); EN / ES lives in Settings
// (and the Ctrl+K palette), switches the interface and the curriculum, and the choice survives reloads.
test.describe("Internationalization (EN default, ES via Settings)", () => {
  test.use({ locale: "es-AR" });

  test("first visit renders English regardless of browser language", async ({ page }) => {
    await page.goto("/react");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle(/React and Rails interview maps/);
    await expect(page.locator(".sidebar__nav").getByRole("button")).toHaveText(["Study", "Review"]);
    await expect(page.locator(".topbar")).toContainText("React interviews");
    const next = page.locator(".next");
    await expect(next).toContainText("Start here");
    await expect(next.getByRole("button", { name: "Start studying" })).toBeVisible();
    await expect(next.locator("#next-title")).toHaveText("Modern JavaScript for reading React");
    await expect(page.locator("main")).not.toContainText("Empieza aquí");
    // The language switch is not in the top bar any more.
    await expect(page.locator(".topbar").getByRole("radio")).toHaveCount(0);
  });

  test("the Settings switcher changes to Spanish and the choice persists", async ({ page }) => {
    await page.goto("/react");
    await sidebar(page).getByRole("button", { name: "Settings", exact: true }).click();
    await page.locator(".settings").getByRole("radio", { name: "ES", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.getByRole("dialog", { name: "Ajustes" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator(".sidebar__nav").getByRole("button")).toHaveText(["Estudiar", "Repasar"]);
    const next = page.locator(".next");
    await expect(next).toContainText("Empieza aquí");
    await expect(next.getByRole("button", { name: "Empezar a estudiar" })).toBeVisible();
    await expect(next.getByRole("list", { name: "Cómo se estudia aquí" })).toBeVisible();

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.locator(".topbar__title")).toContainText("Estudiar");
    await expect(page.locator(".next")).toContainText("Empieza aquí");
  });

  test("study card content and stages follow the language", async ({ page }) => {
    await page.goto("/react/card/state_updates");
    await expect(page.getByRole("heading", { name: /State, snapshots and batching/ }).first()).toBeVisible();
    await expect(page.locator("#study-tab-paraphrase")).toContainText("Explain");
    await expect(page.locator(".study__mentor")).toHaveText("Ask the mentor");
    await expect(page.locator(".study__back")).toHaveText("Study");
    await page.evaluate(() => localStorage.setItem("learning-workspace:locale", "es"));
    await page.reload();
    await expect(page.getByRole("heading", { name: /Estado, snapshots y batching/ }).first()).toBeVisible();
    await expect(page.locator("#study-tab-paraphrase")).toContainText("Explicar");
    await expect(page.locator(".study__mentor")).toHaveText("Pregúntale al mentor");
    await expect(page.locator(".study__back")).toHaveText("Estudiar");
  });

  test("Settings and the command palette switch back to English", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("learning-workspace:locale", "es"));
    await page.goto("/react?view=flashcards");
    await expect(page.locator(".topbar__title")).toContainText("Repasar");
    await sidebar(page).getByRole("button", { name: "Ajustes", exact: true }).click();
    await page.locator(".settings").getByRole("radio", { name: "EN", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("#settings-title")).toHaveText("Settings");
    await page.keyboard.press("Escape");
    await expect(page.locator(".topbar__title")).toContainText("Review");

    // The palette offers the other language as a command.
    await page.keyboard.press("Control+k");
    const palette = page.getByRole("dialog", { name: "Search" });
    await palette.getByRole("combobox").fill("language");
    await palette.getByRole("option", { name: "Switch language to Español" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.locator(".topbar__title")).toContainText("Repasar");
  });
});
