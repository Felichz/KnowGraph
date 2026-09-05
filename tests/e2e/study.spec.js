import { test, expect } from "@playwright/test";

test.describe("Study Modal Guided Route & Stages (User Story 2)", () => {
  test.beforeEach(async ({ page }) => {
    page.on("pageerror", (err) => {
      throw new Error(`Uncaught browser exception: ${err.message}\n${err.stack}`);
    });
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

  test("navega por el flujo conceptual Antes -> Ahora -> Después y permite regresar con el botón volver", async ({ page }) => {
    // Abrir un concepto con prerrequisitos/dependientes como 'state_updates'
    const nodeCard = page.locator("main article").filter({ hasText: /Estado, snapshots y batching/ });
    await nodeCard.click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    // Barra de navegación conceptual visible
    const nav = modal.locator('nav[aria-label="Flujo conceptual y mapa"]');
    await expect(nav).toBeVisible();
    await expect(nav).toContainText("ANTES:");
    await expect(nav).toContainText("DESPUÉS:");

    // Navegar a un nodo en ANTES o DESPUÉS
    const targetBtn = nav.locator("button").filter({ hasText: /useState|Efectos|Render/ }).first();
    if (await targetBtn.isVisible()) {
      await targetBtn.click();
      // Debe mostrar el botón de regreso
      const backBtn = nav.locator("button").filter({ hasText: /← Volver a/ });
      await expect(backBtn).toBeVisible();
      await backBtn.click();
      // Regresa al nodo original
      await expect(modal).toContainText("Estado, snapshots y batching");
    }
  });

  test("expande la sección de preguntas FAANG y muestra enlaces a fuentes oficiales", async ({ page }) => {
    const nodeCard = page.locator("main article").filter({ hasText: /Estado, snapshots y batching/ });
    await nodeCard.click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    // Sección de preguntas FAANG
    const faangSummary = modal.locator("summary").filter({ hasText: /PREGUNTAS DE ENTREVISTA FAANG/ });
    if (await faangSummary.isVisible()) {
      await faangSummary.click();
      await expect(modal).toContainText("GreatFrontEnd");
    }

    // Fuentes oficiales
    await expect(modal).toContainText("FUENTES OFICIALES");
  });

  test("activa lectura asistida por voz TTS y conmuta entre reproducir y detener (User Story 4)", async ({ page }) => {
    const nodeCard = page.locator("main article").filter({ hasText: /Estado, snapshots y batching/ });
    await nodeCard.click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    // Botón de audio en la sección 'EN UNA FRASE'
    const audioBtn = modal.locator("button").filter({ hasText: /🔊 Escuchar/ }).first();
    await expect(audioBtn).toBeVisible();

    // Iniciar lectura
    await audioBtn.click();
    await expect(modal.locator("button").filter({ hasText: /⏹ Detener/ }).first()).toBeVisible();

    // Detener lectura
    const stopBtn = modal.locator("button").filter({ hasText: /⏹ Detener/ }).first();
    await stopBtn.click();
    await expect(modal.locator("button").filter({ hasText: /🔊 Escuchar/ }).first()).toBeVisible();
  });

  test("permite navegar por el historial de evaluaciones con paginación de tiempo (User Story 2 State 3: Boundary)", async ({ page }) => {
    // 1. Sembrar fixture con múltiples intentos históricos para js_basics
    const fs = await import("node:fs");
    const boundaryFixture = JSON.parse(
      fs.readFileSync(new URL("../fixtures/workspace-boundary.json", import.meta.url), "utf8")
    );

    await page.evaluate((backup) => {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open("learning-graph-ai", 3);
        req.onerror = () => reject(req.error);
        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction(["attempts", "drafts"], "readwrite");
          const attemptsStore = tx.objectStore("attempts");
          attemptsStore.clear();
          for (const item of backup.learning.attempts || []) {
            attemptsStore.put(item);
          }
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        };
      });
    }, boundaryFixture);

    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    // 2. Abrir card js_basics
    const jsNode = page.locator("main article").first();
    await jsNode.click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    // 3. Ir a la etapa 04 Evaluar
    await modal.getByRole("button", { name: /04.*Evaluar/i }).click();

    // 4. Verificar que muestra el intento más reciente (Intento 3 de 3 con score 120/120)
    await expect(modal).toContainText("Intento 3 de 3");
    await expect(modal).toContainText(/120\s*\/\s*120/);
    await expect(modal).toContainText("Último resultado");

    // 5. Navegar hacia atrás en el tiempo (Intento 2 de 3)
    const prevBtn = modal.locator("button").filter({ hasText: "←" }).first();
    await expect(prevBtn).toBeVisible();
    await prevBtn.click();

    await expect(modal).toContainText("Intento 2 de 3");
    await expect(modal).toContainText(/90\s*\/\s*120/);

    // Debe aparecer el botón para volver a la versión actual
    const returnBtn = modal.getByRole("button", { name: "Volver a la versión actual" });
    await expect(returnBtn).toBeVisible();
    await returnBtn.click();

    // Regresa al intento 3
    await expect(modal).toContainText("Intento 3 de 3");
    await expect(modal).toContainText(/120\s*\/\s*120/);
  });
});
