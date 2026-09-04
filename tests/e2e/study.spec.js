import { test, expect } from "@playwright/test";

test.describe("Study Modal Guided Route & Stages (User Story 2)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("abre el modal de estudio en la etapa 01 Leer al hacer clic en un concepto", async ({ page }) => {
    // Abrir el concepto de estado y batching
    const nodeCard = page.locator("main article").filter({ hasText: /Estado, snapshots y batching/ });
    await expect(nodeCard).toBeVisible();
    await nodeCard.click();

    // El modal debe abrirse
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText("MODAL DE ESTUDIO");
    await expect(modal).toContainText("Estado, snapshots y batching");

    // Debe mostrar las 4 etapas
    await expect(modal).toContainText("01");
    await expect(modal).toContainText("Leer");
    await expect(modal).toContainText("02");
    await expect(modal).toContainText("Aprender");
    await expect(modal).toContainText("03");
    await expect(modal).toContainText("Parafrasear");
    await expect(modal).toContainText("04");
    await expect(modal).toContainText("Evaluar");

    // Etapa 01 activa por defecto
    await expect(modal).toContainText("EN UNA FRASE");
    await expect(modal).toContainText("Por qué importa:");
  });

  test("interactúa con la comparativa pedagógica Naive vs Senior en la etapa 01 Leer", async ({ page }) => {
    const nodeCard = page.locator("main article").filter({ hasText: /Estado, snapshots y batching/ });
    await nodeCard.click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    // Sección de comparativa de código
    await expect(modal).toContainText("COMPARATIVA PEDAGÓGICA (NAIVE VS SENIOR)");

    // Por defecto el patrón senior está activo
    await expect(modal).toContainText("TRADE-OFF ASUMIDO");

    // Conmutar al enfoque ingenuo
    const naiveBtn = modal.getByRole("button", { name: /Enfoque ingenuo/i });
    await expect(naiveBtn).toBeVisible();
    await naiveBtn.click();

    // Debe mostrar el callout de fallo en producción
    await expect(modal).toContainText("CAUSA DE FALLO EN PRODUCCIÓN");

    // Conmutar de vuelta al patrón senior
    const seniorBtn = modal.getByRole("button", { name: /Patrón Senior/i });
    await expect(seniorBtn).toBeVisible();
    await seniorBtn.click();
    await expect(modal).toContainText("TRADE-OFF ASUMIDO");
  });

  test("navega a la etapa 02 Aprender e inspecciona los chips del tutor socrático", async ({ page }) => {
    const nodeCard = page.locator("main article").filter({ hasText: /Estado, snapshots y batching/ });
    await nodeCard.click();

    const modal = page.locator('div[role="dialog"]');

    // Cambiar a la etapa 02 Aprender
    await modal.getByRole("button", { name: /Aprender/ }).click();

    // Verificar el espacio socrático
    await expect(modal).toContainText("Espacio Socrático con el Tutor");
    await expect(modal).toContainText("¿Por qué falla el enfoque ingenuo?");
    await expect(modal).toContainText("¿Podrías explicarlo con una analogía?");
    await expect(modal).toContainText("¿Cómo diagnostico este error en producción?");

    // Input de chat presente
    const chatInput = modal.getByPlaceholder("Preguntale al tutor sobre este concepto…");
    await expect(chatInput).toBeVisible();
  });

  test("navega a la etapa 03 Parafrasear, redacta una respuesta y alterna vista de Chunks", async ({ page }) => {
    const nodeCard = page.locator("main article").filter({ hasText: /Estado, snapshots y batching/ });
    await nodeCard.click();

    const modal = page.locator('div[role="dialog"]');

    // Cambiar a la etapa 03 Parafrasear
    await modal.getByRole("button", { name: "03 Parafrasear", exact: true }).click();

    await expect(modal).toContainText("Consigna de parafraseo senior:");

    const textarea = modal.locator("textarea");
    await expect(textarea).toBeVisible();

    const sampleAnswer = "En React, el estado no es una variable reactiva en memoria directa sino una foto o snapshot del render en curso. Cuando invocamos un setter, agendamos un nuevo ciclo de reconciliación en Fiber.";
    await textarea.fill(sampleAnswer);

    // Métricas en tiempo real
    await expect(modal).toContainText(`${sampleAnswer.length} caracteres`);

    // Alternar a vista de Chunks
    const chunksBtn = modal.getByRole("button", { name: /Chunks/ });
    await chunksBtn.click();
    await expect(modal).toContainText("Chunk 1");

    // Volver al editor
    const editorBtn = modal.getByRole("button", { name: /Editor/ });
    await editorBtn.click();
    await expect(textarea).toBeVisible();
  });

  test("activa el Modo Zen pantalla completa y lo desactiva", async ({ page }) => {
    const nodeCard = page.locator("main article").first();
    await nodeCard.click();

    const modal = page.locator('div[role="dialog"]');
    const zenBtn = modal.getByRole("button", { name: /Modo Zen/ });
    await expect(zenBtn).toBeVisible();

    // Activar Zen
    await zenBtn.click();
    await expect(modal.getByRole("button", { name: /Salir de Zen/ })).toBeVisible();

    // Salir de Zen
    await modal.getByRole("button", { name: /Salir de Zen/ }).click();
    await expect(modal.getByRole("button", { name: /Modo Zen/ })).toBeVisible();
  });

  test("cierra el modal de estudio con la tecla Escape", async ({ page }) => {
    const nodeCard = page.locator("main article").first();
    await nodeCard.click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
  });
});
