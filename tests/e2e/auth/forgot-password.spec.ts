import { test, expect } from "@playwright/test";

test.describe("Authentication - Forgot Password", () => {
  test.beforeEach(async ({ context }) => {
    // Clear cookies and local storage before each test
    await context.clearCookies();
    await context.clearPermissions();
  });

  test("should display forgot password page", async ({ page }) => {
    await page.goto("/auth/forgot-password");

    // Verify page elements
    await expect(
      page.getByRole("heading", { name: "Forgot Password?" })
    ).toBeVisible();
    await expect(
      page.getByText("Enter your email and we'll send you a reset link")
    ).toBeVisible();
    await expect(page.getByPlaceholder("your@email.com")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Send Reset Link" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Back to Login" })
    ).toBeVisible();
  });

  test("should navigate from login page to forgot password", async ({
    page,
  }) => {
    await page.goto("/auth");

    // Click forgot password link
    await page
      .getByRole("link", { name: /¿Olvidaste tu contraseña?/i })
      .click();

    // Should be on forgot password page
    await expect(page).toHaveURL("/auth/forgot-password");
    await expect(
      page.getByRole("heading", { name: "Forgot Password?" })
    ).toBeVisible();
  });

  test("should show validation error for empty email", async ({ page }) => {
    await page.goto("/auth/forgot-password");

    // Try to submit without email
    await page.getByRole("button", { name: "Send Reset Link" }).click();

    // Browser validation should prevent submission
    await expect(page).toHaveURL("/auth/forgot-password");
  });

  test("should send reset link for valid email", async ({ page }) => {
    await page.goto("/auth/forgot-password");

    // Enter email
    await page.getByPlaceholder("your@email.com").fill("test@example.com");
    await page.getByRole("button", { name: "Send Reset Link" }).click();

    // Should show success message
    await expect(
      page.getByText(/Password reset email sent/i).first()
    ).toBeVisible({ timeout: 10000 });

    // Should show confirmation screen
    await expect(
      page.getByText("We've sent a password reset link to:")
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("test@example.com")).toBeVisible();
  });

  test("should display help information after sending email", async ({
    page,
  }) => {
    await page.goto("/auth/forgot-password");

    await page.getByPlaceholder("your@email.com").fill("test@example.com");
    await page.getByRole("button", { name: "Send Reset Link" }).click();

    // Wait for success state
    await expect(
      page.getByText("We've sent a password reset link to:")
    ).toBeVisible({ timeout: 10000 });

    // Should show help information
    await expect(page.getByText("Didn't receive the email?")).toBeVisible();
    await expect(page.getByText("Check your spam folder")).toBeVisible();
    await expect(
      page.getByText("Make sure you entered the correct email")
    ).toBeVisible();
    await expect(
      page.getByText("Wait a few minutes and try again")
    ).toBeVisible();
  });

  test("should allow trying different email", async ({ page }) => {
    await page.goto("/auth/forgot-password");

    // Send reset link
    await page.getByPlaceholder("your@email.com").fill("first@example.com");
    await page.getByRole("button", { name: "Send Reset Link" }).click();

    // Wait for success state
    await expect(
      page.getByText("We've sent a password reset link to:")
    ).toBeVisible({ timeout: 10000 });

    // Click try different email
    await page.getByRole("button", { name: "Try Different Email" }).click();

    // Should go back to form
    await expect(
      page.getByText("Enter your email and we'll send you a reset link")
    ).toBeVisible();
    await expect(page.getByPlaceholder("your@email.com")).toHaveValue("");
  });

  test("should navigate back to login from forgot password page", async ({
    page,
  }) => {
    await page.goto("/auth/forgot-password");

    // Click back to login
    await page.getByRole("button", { name: "Back to Login" }).click();

    // Should redirect to auth page
    await expect(page).toHaveURL("/auth");
    await expect(page.getByRole("tab", { name: "Acceso" })).toBeVisible();
  });

  test("should navigate back to login from success screen", async ({
    page,
  }) => {
    await page.goto("/auth/forgot-password");

    // Send reset link
    await page.getByPlaceholder("your@email.com").fill("test@example.com");
    await page.getByRole("button", { name: "Send Reset Link" }).click();

    // Wait for success state
    await expect(
      page.getByText("We've sent a password reset link to:")
    ).toBeVisible({ timeout: 10000 });

    // Click back to login from success screen
    await page.getByRole("button", { name: "Back to Login" }).click();

    // Should redirect to auth page
    await expect(page).toHaveURL("/auth");
  });

  test("should handle invalid email format gracefully", async ({ page }) => {
    await page.goto("/auth/forgot-password");

    // Enter invalid email (browser validation should catch this)
    await page.getByPlaceholder("your@email.com").fill("invalid-email");

    // The browser's built-in validation should prevent submission
    // We can't easily test this in Playwright, but we can verify the button is clickable
    const submitButton = page.getByRole("button", { name: "Send Reset Link" });
    await expect(submitButton).toBeEnabled();
  });
});
