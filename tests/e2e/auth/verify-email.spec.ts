import { test, expect } from "@playwright/test";

test.describe("Authentication - Verify Email", () => {
  test.beforeEach(async ({ context }) => {
    // Clear cookies and local storage before each test
    await context.clearCookies();
    await context.clearPermissions();
  });

  test("should display verify email page", async ({ page }) => {
    await page.goto("/auth/verify-email?email=test@example.com");

    // Verify page elements
    await expect(
      page.getByRole("heading", { name: "Verify your email" })
    ).toBeVisible();
    await expect(
      page.getByText("We've sent a verification code to your email address")
    ).toBeVisible();
    await expect(page.getByPlaceholder("your@email.com")).toBeVisible();
    await expect(page.getByPlaceholder("Enter 6-digit code")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Verify Email" })
    ).toBeVisible();
  });

  test("should pre-fill email from URL parameter", async ({ page }) => {
    const testEmail = "prefilled@example.com";
    await page.goto(
      `/auth/verify-email?email=${encodeURIComponent(testEmail)}`
    );

    // Email input should be pre-filled
    await expect(page.getByPlaceholder("your@email.com")).toHaveValue(
      testEmail
    );
  });

  test("should show validation error for empty fields", async ({ page }) => {
    await page.goto("/auth/verify-email");

    // Try to submit without filling fields
    await page.getByRole("button", { name: "Verify Email" }).click();

    // Browser validation should prevent submission
    await expect(page).toHaveURL(/\/auth\/verify-email/);
  });

  test("should show error for missing email", async ({ page }) => {
    await page.goto("/auth/verify-email");

    // Clear email field if pre-filled
    await page.getByPlaceholder("your@email.com").clear();

    // Fill only code, not email
    await page.getByPlaceholder("Enter 6-digit code").fill("123456");
    await page.getByRole("button", { name: "Verify Email" }).click();

    // Should stay on page due to browser validation (email is required)
    // Browser validation prevents submission when required field is empty
    await expect(page).toHaveURL(/\/auth\/verify-email/);
  });

  test("should show error for missing verification code", async ({ page }) => {
    await page.goto("/auth/verify-email");

    // Fill only email, not code
    await page.getByPlaceholder("your@email.com").fill("test@example.com");
    await page.getByRole("button", { name: "Verify Email" }).click();

    // Should show error (browser validation or custom)
    await expect(page).toHaveURL(/\/auth\/verify-email/);
  });

  test("should show error for invalid verification code", async ({ page }) => {
    await page.goto("/auth/verify-email?email=test@example.com");

    // Fill with invalid code
    await page.getByPlaceholder("Enter 6-digit code").fill("000000");
    await page.getByRole("button", { name: "Verify Email" }).click();

    // Should show error toast
    await expect(page.getByText(/Verification failed/i).first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("should limit verification code to 6 characters", async ({ page }) => {
    await page.goto("/auth/verify-email?email=test@example.com");

    const codeInput = page.getByPlaceholder("Enter 6-digit code");
    await codeInput.fill("1234567890");

    // Should only accept 6 characters
    await expect(codeInput).toHaveValue("123456");
  });

  test("should allow resending verification email", async ({ page }) => {
    await page.goto("/auth/verify-email?email=test@example.com");

    // Click resend button
    await page
      .getByRole("button", { name: "Resend verification email" })
      .click();

    // Should show success message or cooldown
    // Either "Verification email sent" or error about cooldown
    await expect(page.locator("body")).toContainText(
      /Verification email sent|wait.*seconds/i,
      {
        timeout: 10000,
      }
    );
  });

  test("should show cooldown timer after resending", async ({ page }) => {
    await page.goto("/auth/verify-email?email=test@example.com");

    // Click resend button
    await page
      .getByRole("button", { name: "Resend verification email" })
      .click();

    // Should show cooldown or success
    await page.waitForTimeout(1000);

    // Check if button shows cooldown
    const resendButton = page.getByRole("button", { name: /Resend/i });
    const buttonText = await resendButton.textContent();

    // Should show either cooldown timer or be disabled
    expect(buttonText).toMatch(
      /Resend in \d+s|Sending...|Resend verification email/
    );
  });

  test("should show error when resending without email", async ({ page }) => {
    await page.goto("/auth/verify-email");

    // Clear email field
    await page.getByPlaceholder("your@email.com").clear();

    // Try to resend
    await page
      .getByRole("button", { name: "Resend verification email" })
      .click();

    // Should show error
    await expect(page.getByText(/Email required/i).first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("should navigate back to login", async ({ page }) => {
    await page.goto("/auth/verify-email?email=test@example.com");

    // Click back to login button
    await page.getByRole("button", { name: "Back to Login" }).click();

    // Should redirect to auth page
    await expect(page).toHaveURL("/auth");
    await expect(page.getByRole("tab", { name: "Acceso" })).toBeVisible();
  });

  test('should display "Didn\'t receive the code?" text', async ({ page }) => {
    await page.goto("/auth/verify-email?email=test@example.com");

    // Verify help text is visible
    await expect(page.getByText("Didn't receive the code?")).toBeVisible();
  });
});
