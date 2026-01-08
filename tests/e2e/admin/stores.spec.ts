import { test, expect } from "@playwright/test";

// Test data
const testStore = {
  name: "Test Restaurant E2E",
  description: "A test restaurant for E2E testing",
  address: "123 Test Street, Test City",
  phoneNumber: "+1234567890",
  email: "teststore@example.com",
  latitude: 19.4326,
  longitude: -99.1332,
  category: "RESTAURANT",
};

test.describe("Admin - Store Management", () => {
  let storeId: string;

  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto("/auth");
    await page.getByPlaceholder("your@email.com").fill("isaac.kolawole@geniex.dev");
    await page.getByPlaceholder("••••••••").first().fill("Admin@123456");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    // Wait for successful login
    await expect(page).toHaveURL("/explore", { timeout: 15000 });

    // Navigate to admin page
    await page.goto("/admin");
    await expect(page).toHaveURL("/admin", { timeout: 10000 });
  });

  test("should display admin stores page", async ({ page }) => {
    // Check for admin page elements
    await expect(page.getByText(/tiendas/i)).toBeVisible({ timeout: 10000 });
  });

  test("should create a new store", async ({ page }) => {
    // Click on create store button
    const createButton = page.getByRole("button", { name: /crear tienda|nueva tienda|agregar tienda/i });
    await createButton.click();

    // Fill in store details
    await page.getByLabel(/nombre/i).fill(testStore.name);
    await page.getByLabel(/descripción/i).fill(testStore.description);
    await page.getByLabel(/dirección/i).fill(testStore.address);
    await page.getByLabel(/teléfono/i).fill(testStore.phoneNumber);
    await page.getByLabel(/correo|email/i).fill(testStore.email);

    // Fill coordinates if inputs are visible
    const latitudeInput = page.getByLabel(/latitud/i);
    if (await latitudeInput.isVisible()) {
      await latitudeInput.fill(testStore.latitude.toString());
    }

    const longitudeInput = page.getByLabel(/longitud/i);
    if (await longitudeInput.isVisible()) {
      await longitudeInput.fill(testStore.longitude.toString());
    }

    // Select category
    await page.getByLabel(/categoría/i).selectOption("RESTAURANT");

    // Submit form
    await page.getByRole("button", { name: /crear|guardar/i }).click();

    // Verify success message
    await expect(
      page.getByText(/tienda creada|store created|éxito/i).first()
    ).toBeVisible({ timeout: 10000 });

    // Verify store appears in list
    await expect(page.getByText(testStore.name)).toBeVisible({ timeout: 10000 });
  });

  test("should update an existing store", async ({ page }) => {
    // Find a store in the list and click edit
    const editButton = page.getByRole("button", { name: /editar/i }).first();
    await editButton.click();

    // Update store name
    const nameInput = page.getByLabel(/nombre/i);
    await nameInput.clear();
    await nameInput.fill("Updated Store Name E2E");

    // Submit form
    await page.getByRole("button", { name: /actualizar|guardar/i }).click();

    // Verify success message
    await expect(
      page.getByText(/tienda actualizada|store updated|éxito/i).first()
    ).toBeVisible({ timeout: 10000 });

    // Verify updated name appears
    await expect(page.getByText("Updated Store Name E2E")).toBeVisible({
      timeout: 10000,
    });
  });

  test("should toggle store active status", async ({ page }) => {
    // Find toggle button for a store
    const toggleButton = page.getByRole("button", { name: /activar|desactivar|toggle/i }).first();
    await toggleButton.click();

    // Verify success message
    await expect(
      page.getByText(/estado actualizado|status updated|éxito/i).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should delete a store", async ({ page }) => {
    // Find delete button for a store
    const deleteButton = page.getByRole("button", { name: /eliminar|delete/i }).first();
    await deleteButton.click();

    // Confirm deletion in dialog
    const confirmButton = page.getByRole("button", { name: /confirmar|sí|yes/i });
    await confirmButton.click();

    // Verify success message
    await expect(
      page.getByText(/tienda eliminada|store deleted|éxito/i).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should display store statistics", async ({ page }) => {
    // Click on a store to view details/stats
    const storeCard = page.locator('[data-testid="store-card"]').first();
    if (await storeCard.isVisible()) {
      await storeCard.click();

      // Verify statistics are displayed
      await expect(
        page.getByText(/estadísticas|statistics|total/i)
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test("should validate required fields when creating store", async ({ page }) => {
    // Click create button
    const createButton = page.getByRole("button", { name: /crear tienda|nueva tienda/i });
    await createButton.click();

    // Try to submit without filling required fields
    await page.getByRole("button", { name: /crear|guardar/i }).click();

    // Check for validation errors
    const errorMessages = page.locator('text=/requerido|required|obligatorio/i');
    await expect(errorMessages.first()).toBeVisible({ timeout: 5000 });
  });

  test("should resend store PIN email", async ({ page }) => {
    // Find resend PIN button
    const resendButton = page.getByRole("button", { name: /reenviar pin|resend pin/i }).first();

    if (await resendButton.isVisible()) {
      await resendButton.click();

      // Verify success message
      await expect(
        page.getByText(/pin enviado|pin sent|email enviado/i).first()
      ).toBeVisible({ timeout: 10000 });
    }
  });
});
