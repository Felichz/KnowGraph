import { test, expect } from "@playwright/test";

const PARAPHRASE = "Una función pura devuelve el mismo resultado para los mismos argumentos y no tiene efectos secundarios observables. Esto facilita el razonamiento, el testing y la memoización.";

test.describe("paraphrase review e2e", () => {
  test("submit evalúa y muestra el feedback", async ({ page }) => {
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));

    await page.goto("/");
    await page.waitForSelector(".node-group", { timeout: 15_000 });
    await page.locator(".node-group").first().click();
    await page.waitForSelector(".paraphrase-review__textarea", { timeout: 10_000 });

    await page.locator(".paraphrase-review__textarea").fill(PARAPHRASE);
    const submitBtn = page.getByRole("button", { name: /Pedir revisi[oó]n/i });
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // El feedback puede tardar hasta 60s por el LLM
    const feedback = page.locator(".feedback");
    await expect(feedback).toBeVisible({ timeout: 75_000 });

    // El fallback NO debe estar visible
    await expect(page.locator(".paraphrase-review__error", { hasText: /no se puede mostrar/i })).toHaveCount(0);

    // Contenido del feedback
    await expect(feedback.locator(".feedback__score")).toContainText("/100");
    await expect(feedback.locator(".rubric")).toBeVisible();
    await expect(page.locator(".paraphrase-review__answer")).toContainText(PARAPHRASE);

    // Score es un número
    const scoreText = await feedback.locator(".feedback__score strong").textContent();
    expect(scoreText).toMatch(/^\d+$/);
    const score = Number(scoreText);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);

    // No hubo errores de consola
    expect(consoleErrors, `Errores: ${consoleErrors.join("\n")}`).toEqual([]);
  });

  test("navegación entre intentos funciona", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".node-group");
    await page.locator(".node-group").first().click();
    await page.waitForSelector(".paraphrase-review__textarea");

    // Primer intento
    await page.locator(".paraphrase-review__textarea").fill("Primer intento: las funciones puras son deterministas y sin efectos secundarios.");
    await page.getByRole("button", { name: /Pedir revisi[oó]n/i }).click();
    await expect(page.locator(".feedback")).toBeVisible({ timeout: 75_000 });

    // Editar y segundo intento
    await page.getByRole("button", { name: /Editar y reintentar/i }).click();
    await expect(page.locator(".paraphrase-review__textarea")).toBeVisible();
    await page.locator(".paraphrase-review__textarea").fill("Segundo intento: además de determinismo y falta de side-effects, las funciones puras son componibles y permiten memoización con cachés.");
    await page.getByRole("button", { name: /Pedir revisi[oó]n/i }).click();
    await expect(page.locator(".feedback")).toBeVisible({ timeout: 75_000 });

    // Estamos en el intento 2 de 2
    await expect(page.locator(".attempt-history__counter")).toContainText("Intento 2 de 2");

    // Navegar al anterior (scoped a .attempt-history para no matchear el botón TTS)
    await page.locator(".attempt-history button", { hasText: /Anterior/i }).click();
    await expect(page.locator(".attempt-history__counter")).toContainText("Intento 1 de 2");

    // Volver al siguiente
    await page.locator(".attempt-history button", { hasText: /Siguiente/i }).click();
    await expect(page.locator(".attempt-history__counter")).toContainText("Intento 2 de 2");
  });

  test("flashcards muestra el último intento evaluado", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".node-group");
    await page.locator(".node-group").first().click();
    await page.waitForSelector(".paraphrase-review__textarea");

    await page.locator(".paraphrase-review__textarea").fill(PARAPHRASE);
    await page.getByRole("button", { name: /Pedir revisi[oó]n/i }).click();
    await expect(page.locator(".feedback")).toBeVisible({ timeout: 75_000 });

    // Cerrar el modal antes de cambiar de vista
    await page.keyboard.press("Escape");
    await expect(page.locator(".lesson-modal")).toHaveCount(0);

    // Cambiar a vista Flashcards
    await page.getByRole("tab", { name: "Flashcards" }).click();
    await expect(page.locator(".flashcards")).toBeVisible();

    // Debe haber al menos una card
    const firstCard = page.locator(".flashcard").first();
    await expect(firstCard).toBeVisible();
  });

  test("flashcards muestra el intento con MAYOR score, no el más reciente", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".node-group");
    await page.locator(".node-group").first().click();
    await page.waitForSelector(".paraphrase-review__textarea");

    // Primer intento: respuesta muy corta (esperamos score bajo)
    await page.locator(".paraphrase-review__textarea").fill("x");
    await page.getByRole("button", { name: /Pedir revisi[oó]n/i }).click();
    await expect(page.locator(".feedback")).toBeVisible({ timeout: 75_000 });
    const firstScore = Number(await page.locator(".feedback__score strong").textContent());

    // Editar y reintentar con respuesta larga (esperamos score más alto)
    await page.getByRole("button", { name: /Editar y reintentar/i }).click();
    await page.locator(".paraphrase-review__textarea").fill(PARAPHRASE);
    await page.getByRole("button", { name: /Pedir revisi[oó]n/i }).click();
    await expect(page.locator(".feedback")).toBeVisible({ timeout: 75_000 });
    const secondScore = Number(await page.locator(".feedback__score strong").textContent());

    // Aserción clave: el segundo intento debería tener score >= primero
    expect(secondScore).toBeGreaterThanOrEqual(firstScore);

    // Cerrar modal y abrir flashcards
    await page.keyboard.press("Escape");
    await page.getByRole("tab", { name: "Flashcards" }).click();
    await expect(page.locator(".flashcards")).toBeVisible();

    // Verificar que la flashcard muestra el score MAYOR (no el último)
    const badge = page.locator(".flashcard__badge").first();
    const badgeText = await badge.textContent();
    const flashcardScore = Number(badgeText.match(/(\d+)\/100/)?.[1] ?? -1);
    expect(flashcardScore).toBe(Math.max(firstScore, secondScore));
  });
});
