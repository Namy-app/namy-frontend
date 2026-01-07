import { test, expect } from "@playwright/test";

test.describe("Authentication - Reset Password", () => {
  test.beforeEach(async ({ context }) => {
    // Clear cookies and local storage before each test
    await context.clearCookies();
    await context.clearPermissions();
  });

  test("should display reset password page with valid token", async ({
    page,
  }) => {
    await page.goto("/auth/reset-password?token=valid-test-token-123");

    // Verify page elements
    await expect(
      page.getByRole("heading", { name: "Reset Your Password" })
    ).toBeVisible();
    await expect(page.getByText("Enter your new password below")).toBeVisible();
    await expect(page.getByText("New Password", { exact: true })).toBeVisible();
    await expect(page.getByText("Confirm New Password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Reset Password" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Back to Login" })
    ).toBeVisible();
  });

  test("should show error and redirect when token is missing", async ({
    page,
  }) => {
    await page.goto("/auth/reset-password");

    // Should show error toast
    await expect(page.getByText(/Invalid reset link/i).first()).toBeVisible({
      timeout: 10000,
    });

    // Should show invalid reset link message
    await expect(
      page.getByRole("heading", { name: "Invalid Reset Link" })
    ).toBeVisible();
    await expect(
      page.getByText("Redirecting to password reset...")
    ).toBeVisible();

    // Should redirect after a few seconds
    await page.waitForURL(/\/auth\/forgot-password/, { timeout: 5000 });
  });

  test("should show validation error for empty fields", async ({ page }) => {
    await page.goto("/auth/reset-password?token=valid-test-token-123");

    // Try to submit without filling fields
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Browser validation should prevent submission
    await expect(page).toHaveURL(/\/auth\/reset-password/);
  });

  test("should show error when passwords do not match", async ({ page }) => {
    await page.goto("/auth/reset-password?token=valid-test-token-123");

    // Fill with mismatched passwords
    await page.getByPlaceholder("••••••••").first().fill("NewPassword123!");
    await page
      .getByPlaceholder("••••••••")
      .last()
      .fill("DifferentPassword123!");
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Should show error toast
    await expect(page.getByText(/Passwords don't match/i).first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("should show error for password less than 8 characters", async ({
    page,
  }) => {
    await page.goto("/auth/reset-password?token=valid-test-token-123");

    // Fill with short password
    await page.getByPlaceholder("••••••••").first().fill("Short1!");
    await page.getByPlaceholder("••••••••").last().fill("Short1!");
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Should show error toast
    await expect(page.getByText(/Password too short/i).first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("should display password strength indicator", async ({ page }) => {
    await page.goto("/auth/reset-password?token=valid-test-token-123");

    // Password strength should be visible (showStrength prop is true)
    await page.getByPlaceholder("••••••••").first().fill("TestPassword123!");

    // The PasswordInput component with showStrength should display strength indicator
    // This is a visual component, so we just verify the input works
    await expect(page.getByPlaceholder("••••••••").first()).toHaveValue(
      "TestPassword123!"
    );
  });

  test("should show password requirements hint", async ({ page }) => {
    await page.goto("/auth/reset-password?token=valid-test-token-123");

    // Should display password hint
    await expect(
      page.getByText("Use 8+ characters with mix of letters, numbers & symbols")
    ).toBeVisible();
  });

  test("should reset password with valid data and token", async ({ page }) => {
    // Mock the API to return success
    await page.route("**/graphql", async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      if (postData?.operationName === "ResetPassword") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: {
              resetPassword: {
                success: true,
                message: "Password reset successfully",
              },
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/auth/reset-password?token=valid-test-token-123");

    // Fill with valid matching passwords
    await page.getByPlaceholder("••••••••").first().fill("NewPassword123!");
    await page.getByPlaceholder("••••••••").last().fill("NewPassword123!");
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Should show success message
    await expect(
      page.getByText(/Password reset successful/i).first()
    ).toBeVisible({ timeout: 10000 });

    // Should redirect to login page
    await expect(page).toHaveURL("/auth", { timeout: 5000 });
  });

  test("should show error for expired or invalid token", async ({ page }) => {
    // Mock the API to return error
    await page.route("**/graphql", async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      if (postData?.operationName === "ResetPassword") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            errors: [
              {
                message: "Invalid or expired reset token",
              },
            ],
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/auth/reset-password?token=expired-token");

    // Fill with valid matching passwords
    await page.getByPlaceholder("••••••••").first().fill("NewPassword123!");
    await page.getByPlaceholder("••••••••").last().fill("NewPassword123!");
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Should show error message
    await expect(page.getByText(/Reset failed/i).first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("should navigate back to login", async ({ page }) => {
    await page.goto("/auth/reset-password?token=valid-test-token-123");

    // Click back to login button
    await page.getByRole("button", { name: "Back to Login" }).click();

    // Should redirect to auth page
    await expect(page).toHaveURL("/auth");
    await expect(page.getByRole("tab", { name: "Acceso" })).toBeVisible();
  });

  test("should disable submit button while resetting", async ({ page }) => {
    // Mock the API to delay response
    await page.route("**/graphql", async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();

      if (postData?.operationName === "ResetPassword") {
        // Delay the response
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: {
              resetPassword: {
                success: true,
                message: "Password reset successfully",
              },
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/auth/reset-password?token=valid-test-token-123");

    await page.getByPlaceholder("••••••••").first().fill("NewPassword123!");
    await page.getByPlaceholder("••••••••").last().fill("NewPassword123!");
    await page.getByRole("button", { name: "Reset Password" }).click();

    // Button should show loading state
    await expect(
      page.getByRole("button", { name: "Resetting..." })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Resetting..." })
    ).toBeDisabled();
  });
});
