import { test, expect } from "@playwright/test";

test.describe("Workspace Navigation & Visual Views (User Story 1)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("monta la app con React por defecto, renderizando cabecera, navegación y nodos", async ({ page }) => {
    await expect(page.locator("header")).toContainText("Learning Workspace");
    await expect(page.locator("header")).toContainText("101");

    // Verifica que existan categorías y nodos en el canvas
    const categoryNav = page.locator("nav").filter({ hasText: /Todos/ });
    await expect(categoryNav).toBeVisible();

    const nodeArticles = page.locator("main article");
    await expect(nodeArticles.first()).toBeVisible();
    const count = await nodeArticles.count();
    expect(count).toBeGreaterThan(10);
  });

  test("conmuta entre el grafo de React y el grafo de Rails actualizando el temario", async ({ page }) => {
    // Cambiar a Rails con el botón de switch en la cabecera
    const railsBtn = page.locator("header button").filter({ hasText: /^Rails$/ });
    await expect(railsBtn).toBeVisible();
    await railsBtn.click();
    await expect(page.locator("body")).toContainText("Active Record");

    // Volver a React
    const reactBtn = page.locator("header button").filter({ hasText: /^React$/ });
    await expect(reactBtn).toBeVisible();
    await reactBtn.click();
    await expect(page.locator("body")).toContainText("Modelo mental & componentes");
  });

  test("filtra conceptos por categoría y restaura con 'Todos'", async ({ page }) => {
    const allBtn = page.getByRole("button", { name: /Todos/ });
    await expect(allBtn).toBeVisible();

    // Click en la categoría Estado & datos
    const stateCategoryBtn = page.getByRole("button", { name: /Estado & datos/ });
    await expect(stateCategoryBtn).toBeVisible();
    await stateCategoryBtn.click();

    // Ahora sólo debe haber secciones de esa categoría
    await expect(page.locator("main")).toContainText("Estado & datos");

    // Restaurar con Todos
    await allBtn.click();
    await expect(page.locator("main")).toContainText("Modelo mental & componentes");
  });

  test("conmuta entre Cuadrícula y Topología SVG interactiva con Pan & Zoom", async ({ page }) => {
    const gridBtn = page.getByRole("button", { name: "⊞ Cuadrícula" });
    const topoBtn = page.getByRole("button", { name: "☊ Topología SVG" });

    await expect(gridBtn).toBeVisible();
    await expect(topoBtn).toBeVisible();

    // Conmutar a Topología SVG
    await topoBtn.click();

    // El SVG debe estar montado
    const svg = page.locator("main svg");
    await expect(svg).toBeVisible();

    // Debe contener columnas de etapa y aristas con marcadores
    await expect(svg.getByText("ETAPA 1", { exact: true })).toBeVisible();
    const edgePaths = svg.locator('path[marker-end*="topo-arrow"]');
    const edgeCount = await edgePaths.count();
    expect(edgeCount).toBeGreaterThan(5);

    // Controles flotantes de zoom presentes
    await expect(page.getByRole("button", { name: "+" })).toBeVisible();
    await expect(page.getByRole("button", { name: "-" })).toBeVisible();
    await expect(page.getByRole("button", { name: "⟲ Centrar" })).toBeVisible();

    // Volver a Cuadrícula
    await gridBtn.click();
    await expect(page.locator("main article").first()).toBeVisible();
  });

  test("alterna a la vista de Flashcards y permite interactuar con tarjetas", async ({ page }) => {
    const flashcardsTabBtn = page.locator("header button").filter({ hasText: /^Flashcards$/ });
    await expect(flashcardsTabBtn).toBeVisible();
    await flashcardsTabBtn.click();

    // La cuadrícula de flashcards debe renderizarse
    const cards = page.locator("div").filter({ hasText: /Tocar para ver respuesta/ });
    await expect(cards.first()).toBeVisible();

    // Voltear la primera flashcard
    await cards.first().click();
    await expect(page.locator("div").filter({ hasText: /Volver a voltear/ }).first()).toBeVisible();

    // Volver al modo Grafo
    await page.locator("header button").filter({ hasText: /^Grafo$/ }).click();
    await expect(page.locator("main article").first()).toBeVisible();
  });

  test("abre y filtra la Command Palette con Ctrl+K y cierra con Escape", async ({ page }) => {
    await page.keyboard.press("Control+k");

    const paletteInput = page.getByPlaceholder(/Buscar concepto o acción/i);
    await expect(paletteInput).toBeVisible();

    // Filtrar un concepto
    await paletteInput.fill("batching");
    await expect(page.locator('div[role="dialog"]')).toContainText("Estado, snapshots y batching");

    // Cerrar con Escape
    await page.keyboard.press("Escape");
    await expect(paletteInput).not.toBeVisible();
  });

  test("abre el panel lateral de Seniority & Milestones y lo cierra", async ({ page }) => {
    const seniorityBtn = page.locator("header button[aria-label='Ver Mapa de Seniority y Milestones']");
    await expect(seniorityBtn).toBeVisible();
    await seniorityBtn.click();

    // Verificar secciones del panel
    const panel = page.locator('div[aria-label="Panel de Seniority y Milestones"]');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText("NIVELES DE SENIORITY");
    await expect(panel).toContainText("React profesional");
    await expect(panel).toContainText("Senior frontend");
    await expect(panel).toContainText("HITOS DE APRENDIZAJE");

    // Cerrar con el botón ×
    const closeBtn = panel.locator("button").filter({ hasText: "×" });
    await closeBtn.click();
    await expect(panel).not.toBeVisible();
  });
});
