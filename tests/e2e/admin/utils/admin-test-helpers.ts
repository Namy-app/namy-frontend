import { Page, expect } from "@playwright/test";

/**
 * Admin Test Helper Functions
 * Reusable utilities for E2E admin tests
 */

// Authentication
export async function loginAsAdmin(page: Page) {
  await page.goto("/auth");
  await page
    .getByPlaceholder("your@email.com")
    .fill("isaac.kolawole@geniex.dev");
  await page.getByPlaceholder("••••••••").first().fill("Admin@123456");
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await expect(page).toHaveURL("/explore", { timeout: 15000 });
}

export async function loginAsSuperAdmin(page: Page) {
  // Same as admin for now - adjust if different credentials needed
  await loginAsAdmin(page);
}

export async function logout(page: Page) {
  const logoutButton = page.getByRole("button", { name: /cerrar sesión|logout/i });
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
  }
}

// Navigation
export async function navigateToAdmin(page: Page) {
  await page.goto("/admin");
  await expect(page).toHaveURL("/admin", { timeout: 10000 });
}

export async function navigateToStores(page: Page) {
  await navigateToAdmin(page);
  const storesLink = page.getByRole("link", { name: /tiendas|stores/i });
  if (await storesLink.isVisible()) {
    await storesLink.click();
  }
}

export async function navigateToDiscounts(page: Page) {
  await navigateToAdmin(page);
  const discountsLink = page.getByRole("link", { name: /descuentos|discounts/i });
  if (await discountsLink.isVisible()) {
    await discountsLink.click();
  }
}

export async function navigateToCatalogs(page: Page) {
  await navigateToAdmin(page);
  const catalogsLink = page.getByRole("link", { name: /catálogos|catalogs/i });
  if (await catalogsLink.isVisible()) {
    await catalogsLink.click();
  }
}

export async function navigateToVideoAds(page: Page) {
  await page.goto("/admin/video-ads");
  await expect(page).toHaveURL("/admin/video-ads", { timeout: 10000 });
}

export async function navigateToUsers(page: Page) {
  await page.goto("/admin/users");
  await expect(page).toHaveURL("/admin/users", { timeout: 10000 });
}

// Store helpers
export async function createStore(
  page: Page,
  storeData: {
    name: string;
    description: string;
    address: string;
    phoneNumber: string;
    email: string;
    category?: string;
  }
) {
  const createButton = page.getByRole("button", {
    name: /crear tienda|nueva tienda/i,
  });
  await createButton.click();

  await page.getByLabel(/nombre/i).fill(storeData.name);
  await page.getByLabel(/descripción/i).fill(storeData.description);
  await page.getByLabel(/dirección/i).fill(storeData.address);
  await page.getByLabel(/teléfono/i).fill(storeData.phoneNumber);
  await page.getByLabel(/correo|email/i).fill(storeData.email);

  if (storeData.category) {
    await page.getByLabel(/categoría/i).selectOption(storeData.category);
  }

  await page.getByRole("button", { name: /crear|guardar/i }).click();

  // Wait for success message
  await expect(
    page.getByText(/tienda creada|store created/i).first()
  ).toBeVisible({ timeout: 10000 });
}

export async function deleteStore(page: Page, storeName: string) {
  // Find store by name and delete
  const storeCard = page.getByText(storeName).locator("..");
  const deleteButton = storeCard.getByRole("button", { name: /eliminar|delete/i });
  await deleteButton.click();

  // Confirm deletion
  const confirmButton = page.getByRole("button", { name: /confirmar|sí|yes/i });
  await confirmButton.click();

  await expect(
    page.getByText(/tienda eliminada|store deleted/i).first()
  ).toBeVisible({ timeout: 10000 });
}

// Discount helpers
export async function createDiscount(
  page: Page,
  discountData: {
    code: string;
    description: string;
    type: string;
    value: number;
    startDate: string;
    endDate: string;
  }
) {
  const createButton = page.getByRole("button", {
    name: /crear descuento|nuevo descuento/i,
  });
  await createButton.click();

  await page.getByLabel(/código/i).fill(discountData.code);
  await page.getByLabel(/descripción/i).fill(discountData.description);
  await page.getByLabel(/tipo/i).selectOption(discountData.type);
  await page.getByLabel(/valor/i).fill(discountData.value.toString());
  await page.getByLabel(/fecha de inicio|start date/i).fill(discountData.startDate);
  await page.getByLabel(/fecha de fin|end date/i).fill(discountData.endDate);

  await page.getByRole("button", { name: /crear|guardar/i }).click();

  await expect(
    page.getByText(/descuento creado|discount created/i).first()
  ).toBeVisible({ timeout: 10000 });
}

export async function deleteDiscount(page: Page, discountCode: string) {
  const discountCard = page.getByText(discountCode).locator("..");
  const deleteButton = discountCard.getByRole("button", {
    name: /eliminar|delete/i,
  });
  await deleteButton.click();

  const confirmButton = page.getByRole("button", { name: /confirmar|sí|yes/i });
  await confirmButton.click();

  await expect(
    page.getByText(/descuento eliminado|discount deleted/i).first()
  ).toBeVisible({ timeout: 10000 });
}

// Catalog helpers
export async function createCatalog(
  page: Page,
  catalogData: {
    name: string;
    description: string;
  }
) {
  const createButton = page.getByRole("button", {
    name: /crear catálogo|nuevo catálogo/i,
  });
  await createButton.click();

  await page.getByLabel(/nombre/i).fill(catalogData.name);
  await page.getByLabel(/descripción/i).fill(catalogData.description);

  await page.getByRole("button", { name: /crear|guardar/i }).click();

  await expect(
    page.getByText(/catálogo creado|catalog created/i).first()
  ).toBeVisible({ timeout: 10000 });
}

// Assertions
export async function expectSuccessMessage(page: Page, message?: string) {
  if (message) {
    await expect(page.getByText(message).first()).toBeVisible({
      timeout: 10000,
    });
  } else {
    await expect(
      page.getByText(/éxito|success|creado|actualizado|eliminado/i).first()
    ).toBeVisible({ timeout: 10000 });
  }
}

export async function expectErrorMessage(page: Page, message?: string) {
  if (message) {
    await expect(page.getByText(message).first()).toBeVisible({
      timeout: 10000,
    });
  } else {
    await expect(
      page.getByText(/error|falló|failed|inválido|invalid/i).first()
    ).toBeVisible({ timeout: 10000 });
  }
}

export async function expectValidationError(page: Page) {
  const errorMessages = page.locator("text=/requerido|required|obligatorio|inválido/i");
  await expect(errorMessages.first()).toBeVisible({ timeout: 5000 });
}

// Wait helpers
export async function waitForTableToLoad(page: Page) {
  await page.waitForSelector('[data-testid*="-row"]', { timeout: 10000 });
}

export async function waitForLoadingToFinish(page: Page) {
  // Wait for loading spinner to disappear
  const loader = page.locator('[data-testid="loading"], .loading, .spinner');
  if (await loader.isVisible()) {
    await loader.waitFor({ state: "hidden", timeout: 10000 });
  }
}

// Data generators
export function generateRandomEmail(): string {
  const timestamp = Date.now();
  return `test-${timestamp}@example.com`;
}

export function generateRandomStoreName(): string {
  const timestamp = Date.now();
  return `Test Store ${timestamp}`;
}

export function generateRandomDiscountCode(): string {
  const timestamp = Date.now();
  return `TEST${timestamp}`;
}

export function getFutureDateString(daysInFuture: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysInFuture);
  return date.toISOString().split("T")[0];
}

export function getPastDateString(daysInPast: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysInPast);
  return date.toISOString().split("T")[0];
}

export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}
