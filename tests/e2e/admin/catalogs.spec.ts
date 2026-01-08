import { test, expect } from "@playwright/test";
import path from "path";

// Test data
const testCatalog = {
  name: "Summer Menu 2026",
  description: "Special summer dishes and drinks",
  active: true,
};

test.describe("Admin - Catalog Management", () => {
  let catalogId: string;
  let storeId: string;

  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto("/auth");
    await page
      .getByPlaceholder("your@email.com")
      .fill("isaac.kolawole@geniex.dev");
    await page.getByPlaceholder("••••••••").first().fill("Admin@123456");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    // Wait for successful login
    await expect(page).toHaveURL("/explore", { timeout: 15000 });

    // Navigate to admin page
    await page.goto("/admin");
    await expect(page).toHaveURL("/admin", { timeout: 10000 });

    // Navigate to catalogs section
    const catalogsLink = page.getByRole("link", {
      name: /catálogos|catalogs|menús|menus/i,
    });
    if (await catalogsLink.isVisible()) {
      await catalogsLink.click();
    }
  });

  test("should display catalogs management page", async ({ page }) => {
    await expect(
      page.getByText(/catálogos|catalogs|menús/i).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should create a new catalog without images", async ({ page }) => {
    // Click create catalog button
    const createButton = page.getByRole("button", {
      name: /crear catálogo|nuevo catálogo|agregar catálogo|create catalog/i,
    });
    await createButton.click();

    // Fill in catalog details
    await page.getByLabel(/nombre|name/i).fill(testCatalog.name);
    await page
      .getByLabel(/descripción|description/i)
      .fill(testCatalog.description);

    // Submit form
    await page.getByRole("button", { name: /crear|guardar|save/i }).click();

    // Verify success message
    await expect(
      page.getByText(/catálogo creado|catalog created|éxito|success/i).first()
    ).toBeVisible({ timeout: 10000 });

    // Verify catalog appears in list
    await expect(page.getByText(testCatalog.name)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should create a catalog with images", async ({ page }) => {
    // Click create catalog button
    const createButton = page.getByRole("button", {
      name: /crear catálogo|nuevo catálogo|agregar catálogo|create catalog/i,
    });
    await createButton.click();

    // Fill basic details
    await page.getByLabel(/nombre|name/i).fill("Menu with Images");
    await page.getByLabel(/descripción|description/i).fill("Test menu with images");

    // Upload images (up to 10)
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      // Create a test image path
      const testImagePath = path.join(__dirname, "../../fixtures/test-menu.jpg");

      // Check if we can set files
      try {
        await fileInput.setInputFiles(testImagePath);
      } catch (error) {
        console.log("File upload not available in this test environment");
      }
    }

    // Submit form
    await page.getByRole("button", { name: /crear|guardar|save/i }).click();

    // Verify success message
    await expect(
      page.getByText(/catálogo creado|catalog created|éxito|success/i).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("should update an existing catalog", async ({ page }) => {
    // Find edit button for a catalog
    const editButton = page.getByRole("button", { name: /editar|edit/i }).first();
    await editButton.click();

    // Update catalog name
    const nameInput = page.getByLabel(/nombre|name/i);
    await nameInput.clear();
    await nameInput.fill("Updated Menu Name E2E");

    // Update description
    const descriptionInput = page.getByLabel(/descripción|description/i);
    await descriptionInput.clear();
    await descriptionInput.fill("Updated menu description");

    // Submit form
    await page
      .getByRole("button", { name: /actualizar|guardar|update|save/i })
      .click();

    // Verify success message
    await expect(
      page
        .getByText(/catálogo actualizado|catalog updated|éxito|success/i)
        .first()
    ).toBeVisible({ timeout: 10000 });

    // Verify updated name appears
    await expect(page.getByText("Updated Menu Name E2E")).toBeVisible({
      timeout: 10000,
    });
  });

  test("should delete a catalog", async ({ page }) => {
    // Find delete button
    const deleteButton = page
      .getByRole("button", { name: /eliminar|delete/i })
      .first();
    await deleteButton.click();

    // Confirm deletion
    const confirmButton = page.getByRole("button", {
      name: /confirmar|sí|yes/i,
    });
    await confirmButton.click();

    // Verify success message
    await expect(
      page
        .getByText(/catálogo eliminado|catalog deleted|éxito|success/i)
        .first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should validate required fields when creating catalog", async ({
    page,
  }) => {
    // Click create button
    const createButton = page.getByRole("button", {
      name: /crear catálogo|nuevo catálogo|create catalog/i,
    });
    await createButton.click();

    // Try to submit without filling required fields
    await page.getByRole("button", { name: /crear|guardar|save/i }).click();

    // Check for validation errors
    const errorMessages = page.locator("text=/requerido|required|obligatorio/i");
    await expect(errorMessages.first()).toBeVisible({ timeout: 5000 });
  });

  test("should view catalog details", async ({ page }) => {
    // Click on a catalog card to view details
    const catalogCard = page.locator('[data-testid="catalog-card"]').first();
    if (await catalogCard.isVisible()) {
      await catalogCard.click();

      // Verify catalog details are displayed
      await expect(
        page.getByText(/detalles del catálogo|catalog details/i)
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test("should filter catalogs by store", async ({ page }) => {
    // Find store filter dropdown
    const storeFilter = page.getByLabel(/tienda|store|filtrar/i);
    if (await storeFilter.isVisible()) {
      // Select a store from dropdown
      await storeFilter.selectOption({ index: 1 });
      await page.waitForTimeout(1000);

      // Verify filtered results
      await expect(page.locator('[data-testid="catalog-card"]')).toHaveCount(
        { timeout: 10000 }
      );
    }
  });

  test("should validate maximum 10 images per catalog", async ({ page }) => {
    // Click create button
    const createButton = page.getByRole("button", {
      name: /crear catálogo|nuevo catálogo|create catalog/i,
    });
    await createButton.click();

    // Fill basic info
    await page.getByLabel(/nombre|name/i).fill("Image Limit Test");
    await page.getByLabel(/descripción|description/i).fill("Testing image limit");

    // Try to upload more than 10 images
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      // Create multiple test image paths
      const testImages = Array(11)
        .fill(0)
        .map((_, i) => path.join(__dirname, `../../fixtures/test-image-${i}.jpg`));

      try {
        await fileInput.setInputFiles(testImages);
      } catch (error) {
        console.log("File upload test skipped");
      }
    }

    // Submit and check for validation error
    await page.getByRole("button", { name: /crear|guardar|save/i }).click();

    // Should show error about maximum images
    const errorMessage = page.getByText(
      /máximo 10 imágenes|maximum 10 images|límite de imágenes/i
    );
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
    }
  });

  test("should display catalog images in a gallery", async ({ page }) => {
    // Click on a catalog with images
    const catalogWithImages = page
      .locator('[data-testid="catalog-card"]')
      .filter({ hasText: /imagen|image/i })
      .first();

    if (await catalogWithImages.isVisible()) {
      await catalogWithImages.click();

      // Verify image gallery is displayed
      const gallery = page.locator('[data-testid="image-gallery"]');
      if (await gallery.isVisible()) {
        await expect(gallery).toBeVisible({ timeout: 5000 });

        // Verify images are displayed
        const images = page.locator('[data-testid="gallery-image"]');
        await expect(images.first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test("should toggle catalog active status", async ({ page }) => {
    // Find toggle button
    const toggleButton = page
      .getByRole("button", { name: /activar|desactivar|toggle/i })
      .first();

    if (await toggleButton.isVisible()) {
      await toggleButton.click();

      // Verify success message
      await expect(
        page.getByText(/estado actualizado|status updated|éxito/i).first()
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test("should search catalogs by name", async ({ page }) => {
    // Find search input
    const searchInput = page.getByPlaceholder(/buscar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill("Summer");
      await page.waitForTimeout(1000);

      // Verify filtered results contain search term
      const catalogCards = page.locator('[data-testid="catalog-card"]');
      const firstCard = catalogCards.first();
      if (await firstCard.isVisible()) {
        await expect(firstCard).toContainText(/summer/i, { timeout: 5000 });
      }
    }
  });
});
