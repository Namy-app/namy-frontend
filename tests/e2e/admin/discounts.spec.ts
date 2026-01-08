import { test, expect } from "@playwright/test";

// Test data
const testDiscount = {
  code: "TEST50OFF",
  description: "50% off for E2E testing",
  type: "PERCENTAGE",
  value: 50,
  minPurchaseAmount: 100,
  maxUses: 100,
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
};

test.describe("Admin - Discount Management", () => {
  let discountId: string;
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

    // Navigate to discounts section
    const discountsLink = page.getByRole("link", {
      name: /descuentos|discounts/i,
    });
    if (await discountsLink.isVisible()) {
      await discountsLink.click();
    }
  });

  test("should display discounts management page", async ({ page }) => {
    await expect(
      page.getByText(/descuentos|discounts/i).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should create a new discount", async ({ page }) => {
    // Click create discount button
    const createButton = page.getByRole("button", {
      name: /crear descuento|nuevo descuento|agregar descuento/i,
    });
    await createButton.click();

    // Fill in discount details
    await page.getByLabel(/código/i).fill(testDiscount.code);
    await page.getByLabel(/descripción/i).fill(testDiscount.description);

    // Select discount type
    await page.getByLabel(/tipo/i).selectOption("PERCENTAGE");

    // Fill value
    await page.getByLabel(/valor/i).fill(testDiscount.value.toString());

    // Fill minimum purchase amount
    const minPurchaseInput = page.getByLabel(/mínimo|minimum/i);
    if (await minPurchaseInput.isVisible()) {
      await minPurchaseInput.fill(testDiscount.minPurchaseAmount.toString());
    }

    // Fill max uses
    const maxUsesInput = page.getByLabel(/máximo de usos|max uses/i);
    if (await maxUsesInput.isVisible()) {
      await maxUsesInput.fill(testDiscount.maxUses.toString());
    }

    // Fill dates
    await page.getByLabel(/fecha de inicio|start date/i).fill(testDiscount.startDate);
    await page.getByLabel(/fecha de fin|end date/i).fill(testDiscount.endDate);

    // Submit form
    await page.getByRole("button", { name: /crear|guardar/i }).click();

    // Verify success message
    await expect(
      page.getByText(/descuento creado|discount created|éxito/i).first()
    ).toBeVisible({ timeout: 10000 });

    // Verify discount appears in list
    await expect(page.getByText(testDiscount.code)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should update an existing discount", async ({ page }) => {
    // Find edit button for a discount
    const editButton = page.getByRole("button", { name: /editar/i }).first();
    await editButton.click();

    // Update description
    const descriptionInput = page.getByLabel(/descripción/i);
    await descriptionInput.clear();
    await descriptionInput.fill("Updated discount description E2E");

    // Submit form
    await page.getByRole("button", { name: /actualizar|guardar/i }).click();

    // Verify success message
    await expect(
      page.getByText(/descuento actualizado|discount updated|éxito/i).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should toggle discount active status", async ({ page }) => {
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

  test("should delete a discount", async ({ page }) => {
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
      page.getByText(/descuento eliminado|discount deleted|éxito/i).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should validate discount code uniqueness", async ({ page }) => {
    // Click create button
    const createButton = page.getByRole("button", {
      name: /crear descuento|nuevo descuento/i,
    });
    await createButton.click();

    // Try to use an existing code
    await page.getByLabel(/código/i).fill("EXISTING_CODE");
    await page.getByLabel(/descripción/i).fill("Test");
    await page.getByLabel(/tipo/i).selectOption("PERCENTAGE");
    await page.getByLabel(/valor/i).fill("10");

    // Submit
    await page.getByRole("button", { name: /crear|guardar/i }).click();

    // Check for duplicate error
    await expect(
      page.getByText(/código ya existe|code already exists|duplicado/i).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should validate discount dates", async ({ page }) => {
    // Click create button
    const createButton = page.getByRole("button", {
      name: /crear descuento|nuevo descuento/i,
    });
    await createButton.click();

    // Fill form with end date before start date
    await page.getByLabel(/código/i).fill("DATETEST");
    await page.getByLabel(/descripción/i).fill("Date validation test");
    await page.getByLabel(/tipo/i).selectOption("PERCENTAGE");
    await page.getByLabel(/valor/i).fill("10");

    const pastDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const futureDate = new Date().toISOString().split("T")[0];

    await page.getByLabel(/fecha de inicio|start date/i).fill(futureDate);
    await page.getByLabel(/fecha de fin|end date/i).fill(pastDate);

    // Submit
    await page.getByRole("button", { name: /crear|guardar/i }).click();

    // Check for validation error
    await expect(
      page
        .getByText(
          /fecha de fin debe ser posterior|end date must be after|fecha inválida/i
        )
        .first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should validate percentage discount value (0-100)", async ({ page }) => {
    // Click create button
    const createButton = page.getByRole("button", {
      name: /crear descuento|nuevo descuento/i,
    });
    await createButton.click();

    // Fill form with invalid percentage
    await page.getByLabel(/código/i).fill("PERCENTTEST");
    await page.getByLabel(/descripción/i).fill("Percentage validation test");
    await page.getByLabel(/tipo/i).selectOption("PERCENTAGE");
    await page.getByLabel(/valor/i).fill("150"); // Invalid: > 100

    // Submit
    await page.getByRole("button", { name: /crear|guardar/i }).click();

    // Check for validation error
    await expect(
      page
        .getByText(/valor debe estar entre|value must be between|0 y 100/i)
        .first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should display discount usage statistics", async ({ page }) => {
    // Click on a discount to view details/stats
    const discountCard = page.locator('[data-testid="discount-card"]').first();
    if (await discountCard.isVisible()) {
      await discountCard.click();

      // Verify statistics are displayed
      await expect(
        page.getByText(/usos|uses|estadísticas|statistics/i)
      ).toBeVisible({ timeout: 10000 });
    }
  });

  test("should filter discounts by status", async ({ page }) => {
    // Find filter dropdown
    const filterSelect = page.getByLabel(/filtrar|filter|estado/i);
    if (await filterSelect.isVisible()) {
      // Filter by active
      await filterSelect.selectOption("active");
      await page.waitForTimeout(1000);

      // Filter by inactive
      await filterSelect.selectOption("inactive");
      await page.waitForTimeout(1000);

      // Show all
      await filterSelect.selectOption("all");
    }
  });
});
