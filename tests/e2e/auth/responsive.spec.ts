import { test, expect } from "@playwright/test";

test.describe("Authentication - Responsive Design", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
    await context.clearPermissions();
  });

  test("should display login form correctly on mobile portrait", async ({
    page,
  }) => {
    // Set mobile viewport (iPhone 12)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/auth");

    // Logo should be visible
    await expect(page.locator('img[alt="Ñamy Logo"]')).toBeVisible();

    // Form elements should be visible and properly stacked
    await expect(page.getByPlaceholder("your@email.com")).toBeVisible();
    await expect(page.getByPlaceholder("••••••••").first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Iniciar sesión" })
    ).toBeVisible();

    // Tabs should be visible
    await expect(page.getByRole("tab", { name: "Acceso" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Registrarse" })).toBeVisible();
  });

  test("should display login form correctly on mobile landscape", async ({
    page,
  }) => {
    // Set mobile landscape viewport
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto("/auth");

    // All elements should still be accessible
    await expect(page.locator('img[alt="Ñamy Logo"]')).toBeVisible();
    await expect(page.getByPlaceholder("your@email.com")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Iniciar sesión" })
    ).toBeVisible();
  });

  test("should display login form correctly on tablet", async ({ page }) => {
    // Set tablet viewport (iPad)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/auth");

    await expect(page.locator('img[alt="Ñamy Logo"]')).toBeVisible();
    await expect(page.getByPlaceholder("your@email.com")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Iniciar sesión" })
    ).toBeVisible();
  });

  test("should display login form correctly on desktop", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/auth");

    await expect(page.locator('img[alt="Ñamy Logo"]')).toBeVisible();
    await expect(page.getByPlaceholder("your@email.com")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Iniciar sesión" })
    ).toBeVisible();
  });

  test("should allow login on small mobile screen", async ({ page }) => {
    // Set small mobile viewport (iPhone SE)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/auth");

    // Fill and submit login form
    await page
      .getByPlaceholder("your@email.com")
      .fill("isaac.kolawole@geniex.dev");
    await page.getByPlaceholder("••••••••").first().fill("Admin@123456");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    // Should successfully login
    await expect(page).toHaveURL("/explore", { timeout: 15000 });
  });

  test("should display registration form correctly on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/auth");

    // Switch to register tab
    await page.getByRole("tab", { name: "Registrarse" }).click();

    // All registration fields should be visible
    await expect(page.getByPlaceholder("John Doe")).toBeVisible();
    await expect(page.getByPlaceholder("your@email.com")).toBeVisible();
    await expect(page.getByPlaceholder("••••••••").first()).toBeVisible();
    await expect(page.getByText("Confirmar contraseña")).toBeVisible();
    await expect(
      page.getByPlaceholder("Ingresa el código de referido")
    ).toBeVisible();
    await expect(page.getByText("Acepto los")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Registrarse" })
    ).toBeVisible();
  });

  test("should display forgot password page correctly on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/auth/forgot-password");

    await expect(
      page.getByRole("heading", { name: "Forgot Password?" })
    ).toBeVisible();
    await expect(page.getByPlaceholder("your@email.com")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Send Reset Link" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Back to Login" })
    ).toBeVisible();
  });

  test("should handle touch interactions on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/auth");

    // Click on register tab (click works for both mouse and touch)
    await page.getByRole("tab", { name: "Registrarse" }).click();

    // Should show registration form
    await expect(page.getByPlaceholder("John Doe")).toBeVisible();

    // Click back to login
    await page.getByRole("tab", { name: "Acceso" }).click();

    // Should show login form
    await expect(page.getByText("Correo electrónico")).toBeVisible();
  });

  test("should scroll properly on small mobile screens", async ({ page }) => {
    // Very small viewport
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/auth");

    // Switch to registration which has more fields
    await page.getByRole("tab", { name: "Registrarse" }).click();

    // Should be able to scroll to see all fields
    await page.getByPlaceholder("John Doe").scrollIntoViewIfNeeded();
    await expect(page.getByPlaceholder("John Doe")).toBeVisible();

    await page
      .getByPlaceholder("Ingresa el código de referido")
      .scrollIntoViewIfNeeded();
    await expect(
      page.getByPlaceholder("Ingresa el código de referido")
    ).toBeVisible();

    await page
      .getByRole("button", { name: "Registrarse" })
      .scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("button", { name: "Registrarse" })
    ).toBeVisible();
  });

  test("should maintain form state when rotating device", async ({ page }) => {
    // Start in portrait
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/auth");

    // Fill in some data
    await page.getByPlaceholder("your@email.com").fill("test@example.com");
    await page.getByPlaceholder("••••••••").first().fill("password123");

    // Rotate to landscape
    await page.setViewportSize({ width: 844, height: 390 });

    // Form data should be preserved
    await expect(page.getByPlaceholder("your@email.com")).toHaveValue(
      "test@example.com"
    );
    await expect(page.getByPlaceholder("••••••••").first()).toHaveValue(
      "password123"
    );
  });

  test("should display verify email page correctly on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/auth/verify-email?email=test@example.com");

    await expect(
      page.getByRole("heading", { name: "Verify your email" })
    ).toBeVisible();
    await expect(page.getByPlaceholder("your@email.com")).toBeVisible();
    await expect(page.getByPlaceholder("Enter 6-digit code")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Verify Email" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Resend verification email" })
    ).toBeVisible();
  });

  test("should display reset password page correctly on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/auth/reset-password?token=test-token");

    await expect(
      page.getByRole("heading", { name: "Reset Your Password" })
    ).toBeVisible();
    await expect(page.getByText("New Password", { exact: true })).toBeVisible();
    await expect(page.getByText("Confirm New Password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Reset Password" })
    ).toBeVisible();
  });
});
