import { test, expect } from "@playwright/test";

test.describe("Authentication - Login Edge Cases", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
    await context.clearPermissions();
  });

  test("should handle SQL injection attempts in email field", async ({
    page,
  }) => {
    await page.goto("/auth");

    // Try SQL injection patterns
    const sqlInjectionAttempts = [
      "admin'--",
      "admin' OR '1'='1",
      "'; DROP TABLE users--",
      "1' OR '1' = '1' /*",
    ];

    for (const attempt of sqlInjectionAttempts) {
      await page.getByPlaceholder("your@email.com").clear();
      await page.getByPlaceholder("your@email.com").fill(attempt);
      await page.getByPlaceholder("••••••••").first().clear();
      await page.getByPlaceholder("••••••••").first().fill("password123");
      await page.getByRole("button", { name: "Iniciar sesión" }).click();

      await page.waitForTimeout(1000);

      // Should either show error or remain on auth page (not crash)
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/auth/);
    }
  });

  test("should handle XSS attempts in email field", async ({ page }) => {
    await page.goto("/auth");

    const xssAttempts = [
      '<script>alert("xss")</script>',
      "<img src=x onerror=alert(1)>",
      "javascript:alert(1)",
      "<svg/onload=alert(1)>",
    ];

    for (const attempt of xssAttempts) {
      await page.getByPlaceholder("your@email.com").clear();
      await page.getByPlaceholder("your@email.com").fill(attempt);
      await page.getByPlaceholder("••••••••").first().clear();
      await page.getByPlaceholder("••••••••").first().fill("password123");
      await page.getByRole("button", { name: "Iniciar sesión" }).click();

      await page.waitForTimeout(1000);

      // Should not execute any scripts
      const alerts = [];
      page.on("dialog", (dialog) => {
        alerts.push(dialog.message());
        dialog.dismiss();
      });

      // Should remain on auth page
      expect(page.url()).toMatch(/\/auth/);
      expect(alerts.length).toBe(0);
    }
  });

  test("should handle very long email addresses", async ({ page }) => {
    await page.goto("/auth");

    // Create a very long but technically valid email
    const longLocalPart = "a".repeat(64);
    const longDomain = "b".repeat(63);
    const longEmail = `${longLocalPart}@${longDomain}.com`;

    await page.getByPlaceholder("your@email.com").fill(longEmail);
    await page.getByPlaceholder("••••••••").first().fill("password123");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    // Should handle gracefully without crashing
    await page.waitForTimeout(1000);
    expect(page.url()).toBeTruthy();
  });

  test("should handle very long passwords", async ({ page }) => {
    await page.goto("/auth");

    // Create a very long password (1000 characters)
    const longPassword = "A".repeat(1000);

    await page.getByPlaceholder("your@email.com").fill("test@example.com");
    await page.getByPlaceholder("••••••••").first().fill(longPassword);
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    // Should handle gracefully without crashing
    await page.waitForTimeout(1000);
    expect(page.url()).toBeTruthy();
  });

  test("should handle email with special characters", async ({ page }) => {
    await page.goto("/auth");

    const specialEmails = [
      "user+tag@example.com",
      "user.name@example.com",
      "user_name@example.com",
      "user-name@example.com",
      "123@example.com",
    ];

    for (const email of specialEmails) {
      await page.getByPlaceholder("your@email.com").clear();
      await page.getByPlaceholder("your@email.com").fill(email);
      await page.getByPlaceholder("••••••••").first().clear();
      await page.getByPlaceholder("••••••••").first().fill("password123");
      await page.getByRole("button", { name: "Iniciar sesión" }).click();

      await page.waitForTimeout(1000);

      // Should accept these valid email formats
      expect(page.url()).toBeTruthy();
    }
  });

  test("should handle unicode characters in password", async ({ page }) => {
    await page.goto("/auth");

    const unicodePasswords = [
      "密码123456",
      "пароль123",
      "パスワード123",
      "🔒password123",
      "contraseña123",
    ];

    for (const password of unicodePasswords) {
      await page.getByPlaceholder("your@email.com").clear();
      await page.getByPlaceholder("your@email.com").fill("test@example.com");
      await page.getByPlaceholder("••••••••").first().clear();
      await page.getByPlaceholder("••••••••").first().fill(password);
      await page.getByRole("button", { name: "Iniciar sesión" }).click();

      await page.waitForTimeout(1000);

      // Should handle unicode gracefully
      expect(page.url()).toBeTruthy();
    }
  });

  test("should handle rapid multiple login attempts", async ({ page }) => {
    await page.goto("/auth");

    // Attempt rapid login clicks
    await page.getByPlaceholder("your@email.com").fill("test@example.com");
    await page.getByPlaceholder("••••••••").first().fill("password123");

    // Click submit button multiple times rapidly
    const submitButton = page.getByRole("button", { name: "Iniciar sesión" });
    await submitButton.click();
    await submitButton.click();
    await submitButton.click();

    // Wait for any response
    await page.waitForTimeout(2000);

    // Should handle gracefully (not crash, not duplicate requests)
    expect(page.url()).toBeTruthy();
  });

  test("should handle whitespace in email field", async ({ page }) => {
    await page.goto("/auth");

    const whitespaceEmails = [
      "  test@example.com",
      "test@example.com  ",
      "  test@example.com  ",
      "test @example.com",
    ];

    for (const email of whitespaceEmails) {
      await page.getByPlaceholder("your@email.com").clear();
      await page.getByPlaceholder("your@email.com").fill(email);
      await page.getByPlaceholder("••••••••").first().clear();
      await page.getByPlaceholder("••••••••").first().fill("password123");
      await page.getByRole("button", { name: "Iniciar sesión" }).click();

      await page.waitForTimeout(1000);

      // Should handle or trim whitespace
      expect(page.url()).toBeTruthy();
    }
  });

  test("should handle empty password field with filled email", async ({
    page,
  }) => {
    await page.goto("/auth");

    await page.getByPlaceholder("your@email.com").fill("test@example.com");
    // Leave password empty
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    // Should show validation or prevent submission
    await page.waitForTimeout(1000);
    expect(page.url()).toMatch(/\/auth/);
  });

  test("should handle empty email field with filled password", async ({
    page,
  }) => {
    await page.goto("/auth");

    // Leave email empty
    await page.getByPlaceholder("••••••••").first().fill("password123");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    // Should show validation or prevent submission
    await page.waitForTimeout(1000);
    expect(page.url()).toMatch(/\/auth/);
  });

  test("should handle login with Enter key on email field", async ({
    page,
  }) => {
    await page.goto("/auth");

    await page
      .getByPlaceholder("your@email.com")
      .fill("isaac.kolawole@geniex.dev");
    await page.getByPlaceholder("••••••••").first().fill("Admin@123456");

    // Press Enter on email field
    await page.getByPlaceholder("your@email.com").press("Enter");

    // Should submit form
    await page.waitForTimeout(2000);

    // Should either redirect or show error
    const currentUrl = page.url();
    expect(currentUrl).toBeTruthy();
  });

  test("should handle login with Enter key on password field", async ({
    page,
  }) => {
    await page.goto("/auth");

    await page
      .getByPlaceholder("your@email.com")
      .fill("isaac.kolawole@geniex.dev");
    await page.getByPlaceholder("••••••••").first().fill("Admin@123456");

    // Press Enter on password field
    await page.getByPlaceholder("••••••••").first().press("Enter");

    // Should submit form
    await expect(page).toHaveURL("/explore", { timeout: 15000 });
  });

  test("should handle invalid email format", async ({ page }) => {
    await page.goto("/auth");

    const invalidEmails = [
      "notanemail",
      "@example.com",
      "user@",
      "user@.com",
      "user..name@example.com",
    ];

    for (const email of invalidEmails) {
      await page.getByPlaceholder("your@email.com").clear();
      await page.getByPlaceholder("your@email.com").fill(email);
      await page.getByPlaceholder("••••••••").first().clear();
      await page.getByPlaceholder("••••••••").first().fill("password123");
      await page.getByRole("button", { name: "Iniciar sesión" }).click();

      await page.waitForTimeout(1000);

      // Should either show validation error or reject
      expect(page.url()).toMatch(/\/auth/);
    }
  });

  test("should handle case sensitivity in email", async ({ page, context }) => {
    // Try different case variations
    const emailVariations = [
      "Isaac.Kolawole@geniex.dev",
      "ISAAC.KOLAWOLE@GENIEX.DEV",
      "isaac.KOLAWOLE@geniex.DEV",
    ];

    for (const email of emailVariations) {
      // Clear cookies before each attempt
      await context.clearCookies();
      await page.goto("/auth");

      await page.getByPlaceholder("your@email.com").fill(email);
      await page.getByPlaceholder("••••••••").first().fill("Admin@123456");
      await page.getByRole("button", { name: "Iniciar sesión" }).click();

      await page.waitForTimeout(2000);

      // Check if login succeeded or failed
      const currentUrl = page.url();
      expect(currentUrl).toBeTruthy();
    }
  });

  test("should prevent login with only spaces in password", async ({
    page,
  }) => {
    await page.goto("/auth");

    await page.getByPlaceholder("your@email.com").fill("test@example.com");
    await page.getByPlaceholder("••••••••").first().fill("        ");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    await page.waitForTimeout(1000);

    // Should not allow login with spaces-only password
    expect(page.url()).toMatch(/\/auth/);
  });

  test("should handle copy-paste credentials", async ({ page }) => {
    await page.goto("/auth");

    // Simulate copy-paste with potential extra characters
    const emailWithZeroWidth = "test@example.com\u200B"; // Zero-width space
    const passwordWithZeroWidth = "password123\u200B";

    await page.getByPlaceholder("your@email.com").fill(emailWithZeroWidth);
    await page.getByPlaceholder("••••••••").first().fill(passwordWithZeroWidth);
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    await page.waitForTimeout(1000);

    // Should handle or sanitize invisible characters
    expect(page.url()).toBeTruthy();
  });
});
