import { test, expect } from "@playwright/test";

test.describe("Asynchronous Background Tasks, Global HUD & Cancellation (User Story 3)", () => {
  test.beforeEach(async ({ page }) => {
    page.on("pageerror", (err) => {
      throw new Error(`Uncaught browser exception: ${err.message}\n${err.stack}`);
    });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("HUD flotante permanece oculto cuando no hay tareas activas (Universal State 1: Empty)", async ({ page }) => {
    const hud = page.locator('aside[aria-label="Tareas activas en segundo plano"]');
    await expect(hud).not.toBeVisible();
  });

  test("muestra HUD flotante con streaming de caracteres y permite abrir la card (Universal State 2: Populated)", async ({ page }) => {
    // 1. Inyectar tarea activa en backgroundTaskManager vía localStorage
    await page.evaluate(() => {
      localStorage.setItem(
        "knowgraph_active_tasks",
        JSON.stringify([
          {
            id: "task_eval_streaming_1",
            graphId: "react",
            nodeId: "js_basics",
            cardKey: "react:js_basics",
            type: "evaluate",
            status: "running",
            stage: "evaluating",
            message: "Evaluando con modelo de pensamiento...",
            progress: 248,
            startedAt: Date.now(),
            updatedAt: Date.now(),
          },
        ])
      );
    });

    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    // 2. El HUD flotante debe ser visible en la esquina inferior derecha
    const hud = page.locator('aside[aria-label="Tareas activas en segundo plano"]');
    await expect(hud).toBeVisible();

    // 3. Hacer clic en el HUD para desplegar la lista de tareas
    await hud.click();
    await expect(page.locator("strong").filter({ hasText: /Tarjetas procesando con IA/ })).toBeVisible();
    await expect(page.locator("div").filter({ hasText: /248 chars/ }).first()).toBeVisible();

    // 4. Hacer clic en "Abrir card →" y verificar apertura del modal de estudio
    const openCardBtn = page.getByRole("button", { name: "Abrir card →" });
    await expect(openCardBtn).toBeVisible();
    await openCardBtn.click();

    const studyModal = page.locator('div[role="dialog"]');
    await expect(studyModal).toBeVisible();
    await expect(studyModal).toContainText("MODAL DE ESTUDIO");
  });

  test("permite cancelar una tarea en segundo plano y el HUD desaparece limpiamente (Universal State 4: Cancellation)", async ({ page }) => {
    // 1. Inyectar tarea activa
    await page.evaluate(() => {
      localStorage.setItem(
        "knowgraph_active_tasks",
        JSON.stringify([
          {
            id: "task_cancel_1",
            graphId: "react",
            nodeId: "state_updates",
            cardKey: "react:state_updates",
            type: "evaluate",
            status: "running",
            stage: "evaluating",
            message: "Procesando respuesta...",
            progress: 89,
            startedAt: Date.now(),
            updatedAt: Date.now(),
          },
        ])
      );
    });

    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    const hud = page.locator('aside[aria-label="Tareas activas en segundo plano"]');
    await expect(hud).toBeVisible();

    // 2. Desplegar popover del HUD
    await hud.click();

    // 3. Hacer clic en "Cancelar ✕"
    const cancelBtn = page.getByRole("button", { name: "Cancelar ✕" });
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();

    // 4. El HUD debe removerse del DOM sin excepciones
    await expect(hud).not.toBeVisible();
  });
});
