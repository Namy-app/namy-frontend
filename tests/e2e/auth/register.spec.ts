import { test, expect } from "@playwright/test";

test.describe("Authentication - Register", () => {
  test.beforeEach(async ({ context }) => {
    // Clear cookies and local storage before each test
    await context.clearCookies();
    await context.clearPermissions();
  });

  test("should display registration form", async ({ page }) => {
    await page.goto("/auth");

    // Click on Registrarse tab
    await page.getByRole("tab", { name: "Registrarse" }).click();

    // Verify all registration form fields are visible
    await expect(page.getByPlaceholder("John Doe")).toBeVisible();
    await expect(page.getByPlaceholder("your@email.com")).toBeVisible();
    await expect(page.getByPlaceholder("••••••••").first()).toBeVisible();
    await expect(page.getByText("Confirmar contraseña")).toBeVisible();
    await expect(
      page.getByPlaceholder("Ingresa el código de referido")
    ).toBeVisible();
    await expect(page.getByText("Acepto los")).toBeVisible();
  });

  test("should show validation errors for empty required fields", async ({
    page,
  }) => {
    await page.goto("/auth");
    await page.getByRole("tab", { name: "Registrarse" }).click();

    // Try to submit without filling required fields
    await page.getByRole("button", { name: "Registrarse" }).click();

    // Should stay on auth page (browser validation prevents submission)
    await expect(page).toHaveURL("/auth");
  });

  test("should show error when passwords do not match", async ({ page }) => {
    await page.goto("/auth");
    await page.getByRole("tab", { name: "Registrarse" }).click();

    // Fill form with mismatched passwords
    await page.getByPlaceholder("John Doe").fill("Test User");
    await page.getByPlaceholder("your@email.com").fill("test@example.com");
    await page.getByPlaceholder("••••••••").first().fill("Password123!");
    await page
      .getByPlaceholder("••••••••")
      .last()
      .fill("DifferentPassword123!");

    // Accept terms
    const termsCheckbox = page.locator('input[type="checkbox"]').first();
    await termsCheckbox.check();

    await page.getByRole("button", { name: "Registrarse" }).click();

    // Should show error toast
    await expect(
      page.getByText(/Las contraseñas no coinciden/i).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should show error when terms are not accepted", async ({ page }) => {
    await page.goto("/auth");
    await page.getByRole("tab", { name: "Registrarse" }).click();

    // Fill form without accepting terms
    await page.getByPlaceholder("John Doe").fill("Test User");
    await page.getByPlaceholder("your@email.com").fill("test@example.com");
    await page.getByPlaceholder("••••••••").first().fill("Password123!");
    await page.getByPlaceholder("••••••••").last().fill("Password123!");

    await page.getByRole("button", { name: "Registrarse" }).click();

    // Should show error toast
    await expect(page.getByText(/Se requieren términos/i).first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("should successfully register with valid data", async ({ page }) => {
    await page.goto("/auth");
    await page.getByRole("tab", { name: "Registrarse" }).click();

    // Generate unique email to avoid conflicts
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;

    // Fill registration form
    await page.getByPlaceholder("John Doe").fill("Test User");
    await page.getByPlaceholder("your@email.com").fill(testEmail);
    await page.getByPlaceholder("••••••••").first().fill("Password123!");
    await page.getByPlaceholder("••••••••").last().fill("Password123!");

    // Accept terms
    const termsCheckbox = page.locator('input[type="checkbox"]').first();
    await termsCheckbox.check();

    await page.getByRole("button", { name: "Registrarse" }).click();

    // Should redirect to verify email page
    await expect(page).toHaveURL(/\/auth\/verify-email/, { timeout: 15000 });

    // Should show success message (toast)
    await expect(page.getByText(/Registro exitoso/i).first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("should accept referral code input during registration", async ({
    page,
  }) => {
    await page.goto("/auth");
    await page.getByRole("tab", { name: "Registrarse" }).click();

    // Verify referral code field is present and can be filled
    const referralInput = page.getByPlaceholder(
      "Ingresa el código de referido"
    );
    await expect(referralInput).toBeVisible();

    // Fill referral code
    await referralInput.fill("TESTREF123");
    await expect(referralInput).toHaveValue("TESTREF123");

    // Verify it's optional (can submit without error for missing referral)
    // The form should still be valid with or without a referral code
    await expect(referralInput).not.toHaveAttribute("required");
  });

  test("should show error for already registered email", async ({ page }) => {
    await page.goto("/auth");
    await page.getByRole("tab", { name: "Registrarse" }).click();

    // Use email that's already registered
    await page.getByPlaceholder("John Doe").fill("Test User");
    await page
      .getByPlaceholder("your@email.com")
      .fill("isaac.kolawole@geniex.dev");
    await page.getByPlaceholder("••••••••").first().fill("Password123!");
    await page.getByPlaceholder("••••••••").last().fill("Password123!");

    // Accept terms
    const termsCheckbox = page.locator('input[type="checkbox"]').first();
    await termsCheckbox.check();

    await page.getByRole("button", { name: "Registrarse" }).click();

    // Should show error toast
    await expect(page.getByText(/Error de registro/i).first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("should navigate to terms page when clicking terms link", async ({
    page,
  }) => {
    await page.goto("/auth");
    await page.getByRole("tab", { name: "Registrarse" }).click();

    // Click on Términos y Condiciones link
    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: "Términos y Condiciones" }).click(),
    ]);

    // Should open terms page in new tab
    await expect(newPage).toHaveURL(/\/terms/);
  });
});
