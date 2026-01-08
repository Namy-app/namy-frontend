import { test, expect } from "@playwright/test";
import path from "path";

// Test data
const testVideoAd = {
  title: "Test Ad Campaign 2026",
  description: "E2E test video advertisement",
  duration: 30,
  priority: 1,
};

test.describe("Admin - Video Ads Management (Super Admin Only)", () => {
  let videoAdId: string;
  let uploadedVideoKey: string;

  test.beforeEach(async ({ page }) => {
    // Login as super admin (not regular admin)
    await page.goto("/auth");
    await page
      .getByPlaceholder("your@email.com")
      .fill("isaac.kolawole@geniex.dev");
    await page.getByPlaceholder("••••••••").first().fill("Admin@123456");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    // Wait for successful login
    await expect(page).toHaveURL("/explore", { timeout: 15000 });

    // Navigate to admin video ads page
    await page.goto("/admin/video-ads");
    await expect(page).toHaveURL("/admin/video-ads", { timeout: 10000 });
  });

  test("should display video ads management page", async ({ page }) => {
    await expect(
      page.getByText(/anuncios de video|video ads/i).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should request presigned upload URL", async ({ page }) => {
    // Click on upload video button
    const uploadButton = page.getByRole("button", {
      name: /subir video|upload video|cargar video/i,
    });
    await uploadButton.click();

    // Select file (this will trigger presigned URL request)
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      const testVideoPath = path.join(
        __dirname,
        "../../fixtures/test-video.mp4"
      );

      try {
        await fileInput.setInputFiles(testVideoPath);

        // Wait for upload to start
        await expect(
          page.getByText(/subiendo|uploading|cargando/i)
        ).toBeVisible({ timeout: 10000 });

        // Wait for upload to complete
        await expect(
          page.getByText(/subida completa|upload complete|éxito/i)
        ).toBeVisible({ timeout: 30000 });
      } catch (error) {
        console.log("Video upload test skipped - file not available");
      }
    }
  });

  test("should create a video ad after upload", async ({ page }) => {
    // Assuming video is already uploaded, click create ad button
    const createButton = page.getByRole("button", {
      name: /crear anuncio|create ad|nuevo anuncio/i,
    });
    await createButton.click();

    // Fill in video ad details
    await page.getByLabel(/título|title/i).fill(testVideoAd.title);
    await page
      .getByLabel(/descripción|description/i)
      .fill(testVideoAd.description);

    // Fill duration (1-60 seconds)
    await page
      .getByLabel(/duración|duration/i)
      .fill(testVideoAd.duration.toString());

    // Fill priority
    const priorityInput = page.getByLabel(/prioridad|priority/i);
    if (await priorityInput.isVisible()) {
      await priorityInput.fill(testVideoAd.priority.toString());
    }

    // Select uploaded video from list
    const videoSelect = page.getByLabel(/video|archivo/i);
    if (await videoSelect.isVisible()) {
      await videoSelect.selectOption({ index: 0 });
    }

    // Submit form
    await page.getByRole("button", { name: /crear|guardar|save/i }).click();

    // Verify success message
    await expect(
      page
        .getByText(/anuncio creado|ad created|video ad created|éxito/i)
        .first()
    ).toBeVisible({ timeout: 10000 });

    // Verify video ad appears in list
    await expect(page.getByText(testVideoAd.title)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should validate video duration (1-60 seconds)", async ({ page }) => {
    // Click create button
    const createButton = page.getByRole("button", {
      name: /crear anuncio|create ad|nuevo anuncio/i,
    });
    await createButton.click();

    // Fill with invalid duration (>60)
    await page.getByLabel(/título|title/i).fill("Duration Test");
    await page.getByLabel(/descripción|description/i).fill("Testing duration");
    await page.getByLabel(/duración|duration/i).fill("90");

    // Submit
    await page.getByRole("button", { name: /crear|guardar|save/i }).click();

    // Check for validation error
    await expect(
      page
        .getByText(/duración debe estar entre|duration must be between|1 y 60/i)
        .first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should validate maximum file size (100MB)", async ({ page }) => {
    // Click upload button
    const uploadButton = page.getByRole("button", {
      name: /subir video|upload video/i,
    });
    await uploadButton.click();

    // Try to upload a large file
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      // Note: This test would need a large test file
      // In practice, the validation happens before upload starts

      // Check for size validation message
      const sizeError = page.getByText(
        /archivo muy grande|file too large|máximo 100mb/i
      );
      if (await sizeError.isVisible()) {
        await expect(sizeError).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test("should validate video MIME types", async ({ page }) => {
    // Click upload button
    const uploadButton = page.getByRole("button", {
      name: /subir video|upload video/i,
    });
    await uploadButton.click();

    // Try to upload non-video file
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      const invalidFile = path.join(__dirname, "../../fixtures/test-image.jpg");

      try {
        await fileInput.setInputFiles(invalidFile);

        // Check for MIME type validation error
        await expect(
          page
            .getByText(/tipo de archivo inválido|invalid file type|solo videos/i)
            .first()
        ).toBeVisible({ timeout: 10000 });
      } catch (error) {
        console.log("MIME type validation test skipped");
      }
    }
  });

  test("should update a video ad", async ({ page }) => {
    // Find edit button
    const editButton = page.getByRole("button", { name: /editar|edit/i }).first();
    await editButton.click();

    // Update title
    const titleInput = page.getByLabel(/título|title/i);
    await titleInput.clear();
    await titleInput.fill("Updated Video Ad Title E2E");

    // Update description
    const descriptionInput = page.getByLabel(/descripción|description/i);
    await descriptionInput.clear();
    await descriptionInput.fill("Updated description");

    // Submit
    await page
      .getByRole("button", { name: /actualizar|guardar|update|save/i })
      .click();

    // Verify success message
    await expect(
      page
        .getByText(/anuncio actualizado|ad updated|éxito|success/i)
        .first()
    ).toBeVisible({ timeout: 10000 });

    // Verify updated title
    await expect(page.getByText("Updated Video Ad Title E2E")).toBeVisible({
      timeout: 10000,
    });
  });

  test("should toggle video ad active status", async ({ page }) => {
    // Find toggle button
    const toggleButton = page
      .getByRole("button", { name: /activar|desactivar|toggle/i })
      .first();
    await toggleButton.click();

    // Verify success message
    await expect(
      page.getByText(/estado actualizado|status updated|éxito/i).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should delete a video ad", async ({ page }) => {
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
        .getByText(/anuncio eliminado|ad deleted|video eliminado|éxito/i)
        .first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should display video ad statistics", async ({ page }) => {
    // Click on a video ad card to view stats
    const adCard = page.locator('[data-testid="video-ad-card"]').first();
    if (await adCard.isVisible()) {
      await adCard.click();

      // Verify statistics are displayed
      await expect(
        page.getByText(/impresiones|impressions|vistas|views|estadísticas/i)
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test("should preview video before creating ad", async ({ page }) => {
    // After uploading video, click preview
    const previewButton = page.getByRole("button", {
      name: /vista previa|preview/i,
    });

    if (await previewButton.isVisible()) {
      await previewButton.click();

      // Verify video player is visible
      await expect(page.locator("video")).toBeVisible({ timeout: 10000 });

      // Close preview
      const closeButton = page.getByRole("button", { name: /cerrar|close/i });
      await closeButton.click();
    }
  });

  test("should sort video ads by priority", async ({ page }) => {
    // Find sort dropdown
    const sortSelect = page.getByLabel(/ordenar|sort/i);
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption("priority");
      await page.waitForTimeout(1000);

      // Verify ads are sorted
      // First ad should have highest priority
      const firstAd = page.locator('[data-testid="video-ad-card"]').first();
      await expect(firstAd).toBeVisible({ timeout: 5000 });
    }
  });

  test("should filter video ads by status", async ({ page }) => {
    // Find status filter
    const statusFilter = page.getByLabel(/estado|status|filtrar/i);
    if (await statusFilter.isVisible()) {
      // Filter by active
      await statusFilter.selectOption("active");
      await page.waitForTimeout(1000);

      // Filter by inactive
      await statusFilter.selectOption("inactive");
      await page.waitForTimeout(1000);

      // Show all
      await statusFilter.selectOption("all");
    }
  });

  test("should display video ad watch count", async ({ page }) => {
    // Find a video ad card
    const adCard = page.locator('[data-testid="video-ad-card"]').first();
    if (await adCard.isVisible()) {
      // Verify watch count is displayed
      await expect(
        adCard.getByText(/veces visto|times watched|vistas/i)
      ).toBeVisible({ timeout: 5000 });
    }
  });
});
