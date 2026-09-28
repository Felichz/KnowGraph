import { expect, test } from "@playwright/test";

// English is the default language on first visit (even for a Spanish browser); EN / ES switches
// the interface and the curriculum, and the choice survives reloads.
test.describe("Internationalization (EN default, ES via switcher)", () => {
  test.use({ locale: "es-AR" });

  test("first visit renders English regardless of browser language", async ({ page }) => {
    await page.goto("/react");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle(/React and Rails interview maps/);
    const nav = page.locator(".sidebar__nav");
    await expect(nav).toContainText("Map");
    await expect(nav).toContainText("Progress");
    await expect(page.locator(".topbar")).toContainText("React interviews");
    await expect(page.locator("main")).toContainText("Suggested route", { ignoreCase: true });
    await expect(page.locator("main")).toContainText("Mental model & components");
    await expect(page.locator("main")).not.toContainText("Ruta sugerida", { ignoreCase: true });
  });

  test("top-bar switcher changes to Spanish and the choice persists", async ({ page }) => {
    await page.goto("/react");
    await page.locator(".topbar__lang").getByRole("radio", { name: "ES", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.locator(".sidebar__nav")).toContainText("Mapa");
    await expect(page.locator("main")).toContainText("Ruta sugerida", { ignoreCase: true });
    await expect(page.locator("main")).toContainText("Modelo mental & componentes");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.locator(".sidebar__nav")).toContainText("Progreso");
  });

  test("study card content and stages follow the language", async ({ page }) => {
    await page.goto("/react/card/state_updates");
    await expect(page.getByRole("heading", { name: /State, snapshots and batching/ }).first()).toBeVisible();
    await expect(page.locator("body")).toContainText("AI mentor");
    await page.evaluate(() => localStorage.setItem("learning-workspace:locale", "es"));
    await page.reload();
    await expect(page.getByRole("heading", { name: /Estado, snapshots y batching/ }).first()).toBeVisible();
    await expect(page.locator("body")).toContainText("Mentor IA");
  });

  test("settings language section switches back to English", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("learning-workspace:locale", "es"));
    await page.goto("/react?view=progress");
    await expect(page.locator(".topbar")).toContainText("Progreso");
    await page.getByRole("button", { name: "Conexiones de IA" }).click();
    await page.locator(".settings").getByRole("radio", { name: "EN", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("#settings-title")).toHaveText("AI connections");
  });
});
