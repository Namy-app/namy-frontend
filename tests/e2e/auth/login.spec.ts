import { test, expect } from "@playwright/test";

test.describe("Authentication - Login", () => {
  test.beforeEach(async ({ context }) => {
    // Clear cookies and local storage before each test
    await context.clearCookies();
    await context.clearPermissions();
  });

  test("should display login page", async ({ page }) => {
    await page.goto("/auth");

    await expect(page.getByRole("tab", { name: "Acceso" })).toBeVisible();
    await expect(page.getByPlaceholder("your@email.com")).toBeVisible();
    await expect(page.getByPlaceholder("••••••••")).toBeVisible();
  });

  test("should show validation errors for empty fields", async ({ page }) => {
    await page.goto("/auth");

    // Click the submit button without filling fields
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    // Browser validation will prevent submission
    // Check that we're still on the auth page (form didn't submit)
    await expect(page).toHaveURL("/auth");
  });

  test("should successfully login with valid credentials", async ({ page }) => {
    await page.goto("/auth");

    // Fill in the login form
    await page
      .getByPlaceholder("your@email.com")
      .fill("isaac.kolawole@geniex.dev");
    await page.getByPlaceholder("••••••••").first().fill("Admin@123456");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    // Should redirect to explore page
    await expect(page).toHaveURL("/explore", { timeout: 15000 });

    // Check for success by looking for explore page elements
    await expect(page.getByText("🍽️ Promos en Restaurantes")).toBeVisible({
      timeout: 10000,
    });
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/auth");

    // Fill in invalid credentials
    await page.getByPlaceholder("your@email.com").fill("wrong@example.com");
    await page.getByPlaceholder("••••••••").first().fill("wrongpassword");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    // Should show error toast
    await expect(
      page
        .getByText(
          /Error de inicio de sesión|Correo electrónico o contraseña inválidos/i
        )
        .first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("should navigate to register tab", async ({ page }) => {
    await page.goto("/auth");

    // Click on the Registrarse tab
    await page.getByRole("tab", { name: "Registrarse" }).click();

    // Verify signup form is visible
    await expect(page.getByPlaceholder("John Doe")).toBeVisible();
    await expect(page.getByText("Nombre para mostrar")).toBeVisible();
  });
});
