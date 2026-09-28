import { test, expect } from "@playwright/test";

// These specs assert the Spanish interface: English is the default, so select Spanish first
// (tests/e2e/i18n.spec.js covers the English default and the switcher).
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("learning-workspace:locale", "es"));
});

test.describe("Mobile Ergonomics & Bottom Navigation (User Story 7)", () => {
  test.use({ viewport: { width: 375, height: 667 } }); // Viewport móvil estándar

  test("muestra la barra inferior fija en móvil y permite navegar entre vistas con un toque", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const bottomNav = page.locator("nav.mobile-bottom-nav");
    await expect(bottomNav).toBeVisible();

    // 1. Tocar en Flashcards
    await bottomNav.getByRole("button", { name: "Flashcards" }).click();
    await expect(page.locator("div").filter({ hasText: /Tocar para ver respuesta/ }).first()).toBeVisible();

    // 2. Tocar en Progreso (Seniority)
    await bottomNav.getByRole("button", { name: "Progreso" }).click();
    const progressPanel = page.locator('div[aria-label="Panel de Seniority y Milestones"]');
    await expect(progressPanel).toBeVisible();
    await progressPanel.locator("button").filter({ hasText: "×" }).click();
    await expect(progressPanel).not.toBeVisible();

    // 3. Tocar en Buscar (Command Palette)
    await bottomNav.getByRole("button", { name: "Buscar" }).click();
    const palette = page.locator('div[role="dialog"]');
    await expect(palette).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(palette).not.toBeVisible();

    // 4. Tocar en Ajustes (BYOK Modal)
    await bottomNav.getByRole("button", { name: "Ajustes" }).click();
    const settingsModal = page.locator('div[role="dialog"]');
    await expect(settingsModal).toBeVisible();
    await expect(settingsModal).toContainText("Proveedores de IA y Respaldo");
    await page.keyboard.press("Escape");
    await expect(settingsModal).not.toBeVisible();

    // 5. Volver a Grafo
    await bottomNav.getByRole("button", { name: "Grafo" }).click();
    await expect(page.locator("main article").first()).toBeVisible();
  });
});

test.describe("Bidirectional URL Routing & History (User Story 1 Acceptance 5)", () => {
  test("abre directamente la card solicitada vía URL /:graph/card/:nodeId", async ({ page }) => {
    await page.goto("/react/card/state_updates");
    await page.waitForLoadState("domcontentloaded");

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText("Estado, snapshots y batching");

    // Cerrar el modal actualiza la URL a /react
    const closeBtn = modal.getByRole("button", { name: "Cerrar" });
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
    expect(page.url()).toContain("/react");
  });

  test("soporta navegación de historial popstate (Atrás / Adelante del navegador)", async ({ page }) => {
    await page.goto("/react");
    await page.waitForLoadState("domcontentloaded");

    // Abrir un nodo
    const nodeCard = page.locator("main article").filter({ hasText: /Estado, snapshots y batching/ });
    await nodeCard.click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    expect(page.url()).toContain("/react/card/state_updates");

    // Botón Atrás del navegador
    await page.goBack();
    await expect(modal).not.toBeVisible();

    // Botón Adelante del navegador
    await page.goForward();
    await expect(modal).toBeVisible();
  });
});
