import { test, expect } from "@playwright/test";

test.describe("Flashcards View & Active Recall (User Story 6)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Conmutar a la vista de Flashcards
    const flashcardsBtn = page.locator("header button").filter({ hasText: /^Flashcards$/ });
    await flashcardsBtn.click();
  });

  test("renderiza la cuadrícula de flashcards con contador y filtros de dominio", async ({ page }) => {
    // Verificar contador inicial
    const counter = page.locator("span").filter({ hasText: /Mostrando \d+ de \d+ flashcards/ });
    await expect(counter).toBeVisible();

    // Botones de filtro presentes
    await expect(page.getByRole("button", { name: "Todas" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sin intento" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Base < 100" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Base dominada (100+)" })).toBeVisible();

    // Al inicio (sin intentos), "Sin intento" debe tener todas o la mayoría
    await page.getByRole("button", { name: "Sin intento" }).click();
    await expect(page.locator("div").filter({ hasText: /Tocar para ver respuesta/ }).first()).toBeVisible();

    // "Base dominada (100+)" debe estar vacío inicialmente
    await page.getByRole("button", { name: "Base dominada (100+)" }).click();
    await expect(page.locator("body")).toContainText("No hay flashcards que coincidan con este filtro");

    // Restaurar con "Todas"
    await page.getByRole("button", { name: "Todas" }).click();
    await expect(page.locator("div").filter({ hasText: /Tocar para ver respuesta/ }).first()).toBeVisible();
  });

  test("voltea la tarjeta en 3D mostrando anverso (pregunta) y reverso (respuesta técnica clave)", async ({ page }) => {
    const firstCard = page.getByTestId("flashcard-card").first();
    await expect(firstCard).toBeVisible();

    // Tocar anverso para voltear
    await firstCard.click();

    // Verificar contenido del reverso
    await expect(firstCard.locator("span").filter({ hasText: "RESPUESTA TÉCNICA CLAVE" })).toBeVisible();
    await expect(firstCard.locator("span").filter({ hasText: "Volver a voltear ↺" })).toBeVisible();

    // Tocar de nuevo para volver al anverso
    await firstCard.click();
    await expect(firstCard.locator("span").filter({ hasText: "Tocar para ver respuesta ↺" })).toBeVisible();
  });

  test("permite saltar directamente al modal de estudio completo desde una tarjeta", async ({ page }) => {
    // Voltear la primera flashcard
    const firstCard = page.getByTestId("flashcard-card").first();
    await firstCard.click();

    // Presionar botón "Estudiar card →" dentro de la tarjeta volteada
    const studyCardBtn = firstCard.getByRole("button", { name: "Estudiar card →" });
    await expect(studyCardBtn).toBeVisible();
    await studyCardBtn.click();

    // El StudyModal debe abrirse en la etapa 01 Leer
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText("MODAL DE ESTUDIO");
    await expect(modal).toContainText("01");
    await expect(modal).toContainText("Leer");

    // Cerrar el modal y verificar que regresa a la vista de Flashcards
    await modal.getByRole("button", { name: "Cerrar" }).click();
    await expect(modal).not.toBeVisible();
    await expect(firstCard).toBeVisible();
  });

  test("abre la vista de flashcards mediante acción rápida en la Command Palette (Ctrl+K)", async ({ page }) => {
    // Volver primero al Grafo
    await page.locator("header button").filter({ hasText: /^Grafo$/ }).click();
    await expect(page.locator("main article").first()).toBeVisible();

    // Abrir Command Palette
    await page.keyboard.press("Control+k");
    const input = page.getByPlaceholder(/Buscar concepto o acción/i);
    await expect(input).toBeVisible();

    // Filtrar la acción de flashcards
    await input.fill("flashcards");
    const flashcardOption = page.locator('div[role="dialog"]').getByText(/Ir a modo Flashcards/i);
    await expect(flashcardOption).toBeVisible();
    await flashcardOption.click();

    // Verificar que ahora estamos en la vista de Flashcards
    await expect(page.locator("div").filter({ hasText: /Tocar para ver respuesta/ }).first()).toBeVisible();
  });
});
