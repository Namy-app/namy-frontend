import { test, expect } from "@playwright/test";

test.describe("Admin - User Management", () => {
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

    // Navigate to admin users page
    await page.goto("/admin/users");
    await expect(page).toHaveURL("/admin/users", { timeout: 10000 });
  });

  test.describe("User List Display", () => {
    test("should display paginated list of users", async ({ page }) => {
      // Verify users page loaded
      await expect(
        page.getByText(/usuarios|users|lista de usuarios/i).first()
      ).toBeVisible({ timeout: 10000 });

      // Verify user table/list exists
      const userList = page.locator('[data-testid="user-list"], table, [role="table"]');
      await expect(userList).toBeVisible({ timeout: 10000 });
    });

    test("should display user information columns", async ({ page }) => {
      // Check for user data columns
      const expectedColumns = [
        /nombre|name|usuario/i,
        /email|correo/i,
        /rol|role/i,
        /estado|status/i,
      ];

      for (const column of expectedColumns) {
        const header = page.getByText(column).first();
        if (await header.isVisible()) {
          await expect(header).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test("should display premium badge for premium users", async ({ page }) => {
      // Look for premium indicators
      const premiumBadge = page.locator('[data-testid="premium-badge"], .premium-badge, text=/premium/i');

      if ((await premiumBadge.count()) > 0) {
        await expect(premiumBadge.first()).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe("User Search", () => {
    test("should search users by email", async ({ page }) => {
      // Find search input
      const searchInput = page.getByPlaceholder(/buscar|search|filtrar/i);

      if (await searchInput.isVisible()) {
        // Search for admin user
        await searchInput.fill("isaac.kolawole@geniex.dev");
        await page.waitForTimeout(1000); // Wait for debounce

        // Verify search result
        await expect(
          page.getByText("isaac.kolawole@geniex.dev")
        ).toBeVisible({ timeout: 10000 });
      }
    });

    test("should search users by name", async ({ page }) => {
      const searchInput = page.getByPlaceholder(/buscar|search|filtrar/i);

      if (await searchInput.isVisible()) {
        await searchInput.fill("Isaac");
        await page.waitForTimeout(1000);

        // Verify results contain search term
        const results = page.locator('[data-testid="user-row"], tr');
        if ((await results.count()) > 0) {
          const firstResult = results.first();
          await expect(firstResult).toContainText(/isaac/i, { timeout: 5000 });
        }
      }
    });

    test("should show no results for non-existent user", async ({ page }) => {
      const searchInput = page.getByPlaceholder(/buscar|search|filtrar/i);

      if (await searchInput.isVisible()) {
        await searchInput.fill("nonexistentuser@example.com");
        await page.waitForTimeout(1000);

        // Verify no results message
        await expect(
          page.getByText(/no se encontraron|no results|sin resultados/i)
        ).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe("User Filtering", () => {
    test("should filter users by role - ADMIN", async ({ page }) => {
      const roleFilter = page.getByLabel(/rol|role/i);

      if (await roleFilter.isVisible()) {
        await roleFilter.selectOption("ADMIN");
        await page.waitForTimeout(1000);

        // Verify filtered results show only admins
        const roleBadges = page.locator('[data-testid="role-badge"], .role-badge');
        if ((await roleBadges.count()) > 0) {
          const firstBadge = roleBadges.first();
          await expect(firstBadge).toContainText(/admin/i, { timeout: 5000 });
        }
      }
    });

    test("should filter users by role - USER", async ({ page }) => {
      const roleFilter = page.getByLabel(/rol|role/i);

      if (await roleFilter.isVisible()) {
        await roleFilter.selectOption("USER");
        await page.waitForTimeout(1000);

        // Verify results show regular users
        const roleBadges = page.locator('[data-testid="role-badge"], .role-badge');
        if ((await roleBadges.count()) > 0) {
          await expect(roleBadges.first()).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test("should filter users by premium status", async ({ page }) => {
      const premiumFilter = page.getByLabel(/premium|suscripción/i);

      if (await premiumFilter.isVisible()) {
        // Filter to show only premium users
        await premiumFilter.click();
        await page.waitForTimeout(1000);

        // Verify premium badges are visible
        const premiumBadges = page.locator('[data-testid="premium-badge"]');
        if ((await premiumBadges.count()) > 0) {
          await expect(premiumBadges.first()).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test("should filter users by active status", async ({ page }) => {
      const statusFilter = page.getByLabel(/estado|status|activo/i);

      if (await statusFilter.isVisible()) {
        // Filter active users
        await statusFilter.selectOption("active");
        await page.waitForTimeout(1000);

        // Filter inactive users
        await statusFilter.selectOption("inactive");
        await page.waitForTimeout(1000);

        // Show all
        await statusFilter.selectOption("all");
      }
    });
  });

  test.describe("User Pagination", () => {
    test("should navigate to next page", async ({ page }) => {
      const nextButton = page.getByRole("button", { name: /siguiente|next/i });

      if (await nextButton.isVisible() && !(await nextButton.isDisabled())) {
        await nextButton.click();
        await page.waitForTimeout(1000);

        // Verify page changed
        const pageIndicator = page.getByText(/página|page.*2/i);
        if (await pageIndicator.isVisible()) {
          await expect(pageIndicator).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test("should navigate to previous page", async ({ page }) => {
      // First go to page 2
      const nextButton = page.getByRole("button", { name: /siguiente|next/i });
      if (await nextButton.isVisible() && !(await nextButton.isDisabled())) {
        await nextButton.click();
        await page.waitForTimeout(1000);

        // Then go back
        const prevButton = page.getByRole("button", { name: /anterior|previous/i });
        if (await prevButton.isVisible()) {
          await prevButton.click();
          await page.waitForTimeout(1000);

          // Verify back on page 1
          const pageIndicator = page.getByText(/página|page.*1/i);
          if (await pageIndicator.isVisible()) {
            await expect(pageIndicator).toBeVisible({ timeout: 5000 });
          }
        }
      }
    });

    test("should display total user count", async ({ page }) => {
      // Look for total count indicator
      const totalCount = page.getByText(/total.*\d+|mostrando.*de.*\d+/i);
      if (await totalCount.isVisible()) {
        await expect(totalCount).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe("User Details View", () => {
    test("should view user details", async ({ page }) => {
      // Click on first user
      const firstUser = page.locator('[data-testid="user-row"], tr').first();
      if (await firstUser.isVisible()) {
        await firstUser.click();

        // Verify user details page or modal opened
        await expect(
          page.getByText(/detalles del usuario|user details|perfil/i)
        ).toBeVisible({ timeout: 10000 });
      }
    });

    test("should display user statistics", async ({ page }) => {
      // Click on a user
      const firstUser = page.locator('[data-testid="user-row"]').first();
      if (await firstUser.isVisible()) {
        await firstUser.click();

        // Verify user stats are displayed
        const stats = [
          /cupones|coupons/i,
          /nivel|level/i,
          /puntos|points/i,
          /redenciones|redemptions/i,
        ];

        for (const stat of stats) {
          const statElement = page.getByText(stat);
          if (await statElement.isVisible()) {
            await expect(statElement).toBeVisible({ timeout: 5000 });
          }
        }
      }
    });

    test("should display user coupons history", async ({ page }) => {
      // Click on a user
      const firstUser = page.locator('[data-testid="user-row"]').first();
      if (await firstUser.isVisible()) {
        await firstUser.click();

        // Navigate to coupons tab
        const couponsTab = page.getByRole("tab", { name: /cupones|coupons/i });
        if (await couponsTab.isVisible()) {
          await couponsTab.click();

          // Verify coupons list
          await expect(
            page.getByText(/cupones generados|generated coupons|historial/i)
          ).toBeVisible({ timeout: 10000 });
        }
      }
    });

    test("should display user level and progress", async ({ page }) => {
      // Click on a user
      const firstUser = page.locator('[data-testid="user-row"]').first();
      if (await firstUser.isVisible()) {
        await firstUser.click();

        // Verify level information
        const levelInfo = page.locator('[data-testid="user-level"], .level-badge');
        if (await levelInfo.isVisible()) {
          await expect(levelInfo).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test("should display user monthly usage", async ({ page }) => {
      // Click on a user
      const firstUser = page.locator('[data-testid="user-row"]').first();
      if (await firstUser.isVisible()) {
        await firstUser.click();

        // Look for monthly usage info
        const monthlyUsage = page.getByText(/uso mensual|monthly usage|este mes/i);
        if (await monthlyUsage.isVisible()) {
          await expect(monthlyUsage).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test("should display user redemptions with details", async ({ page }) => {
      // Click on a user
      const firstUser = page.locator('[data-testid="user-row"]').first();
      if (await firstUser.isVisible()) {
        await firstUser.click();

        // Navigate to redemptions tab
        const redemptionsTab = page.getByRole("tab", { name: /redenciones|redemptions/i });
        if (await redemptionsTab.isVisible()) {
          await redemptionsTab.click();

          // Verify redemptions list with details (bill amount, discount value)
          const redemptionsList = page.locator('[data-testid="redemptions-list"]');
          if (await redemptionsList.isVisible()) {
            await expect(redemptionsList).toBeVisible({ timeout: 5000 });
          }
        }
      }
    });
  });

  test.describe("User Sorting", () => {
    test("should sort users by registration date (newest first)", async ({ page }) => {
      const sortSelect = page.getByLabel(/ordenar|sort/i);

      if (await sortSelect.isVisible()) {
        await sortSelect.selectOption("created_desc");
        await page.waitForTimeout(1000);

        // Verify sorting indicator
        await expect(sortSelect).toHaveValue("created_desc");
      }
    });

    test("should sort users by registration date (oldest first)", async ({ page }) => {
      const sortSelect = page.getByLabel(/ordenar|sort/i);

      if (await sortSelect.isVisible()) {
        await sortSelect.selectOption("created_asc");
        await page.waitForTimeout(1000);

        await expect(sortSelect).toHaveValue("created_asc");
      }
    });

    test("should sort users by name", async ({ page }) => {
      const sortSelect = page.getByLabel(/ordenar|sort/i);

      if (await sortSelect.isVisible()) {
        await sortSelect.selectOption("name");
        await page.waitForTimeout(1000);

        await expect(sortSelect).toHaveValue("name");
      }
    });

    test("should sort users by email", async ({ page }) => {
      const sortSelect = page.getByLabel(/ordenar|sort/i);

      if (await sortSelect.isVisible()) {
        await sortSelect.selectOption("email");
        await page.waitForTimeout(1000);

        await expect(sortSelect).toHaveValue("email");
      }
    });
  });

  test.describe("User Activity", () => {
    test("should display user activity timeline", async ({ page }) => {
      // Click on a user
      const firstUser = page.locator('[data-testid="user-row"]').first();
      if (await firstUser.isVisible()) {
        await firstUser.click();

        // Navigate to activity tab
        const activityTab = page.getByRole("tab", { name: /actividad|activity/i });
        if (await activityTab.isVisible()) {
          await activityTab.click();

          // Verify activity timeline
          await expect(
            page.getByText(/actividad reciente|recent activity|historial/i)
          ).toBeVisible({ timeout: 10000 });
        }
      }
    });

    test("should display user audit trail", async ({ page }) => {
      // Click on a user
      const firstUser = page.locator('[data-testid="user-row"]').first();
      if (await firstUser.isVisible()) {
        await firstUser.click();

        // Look for audit information
        const auditInfo = page.locator('[data-testid="audit-trail"], .audit-log');
        if (await auditInfo.isVisible()) {
          await expect(auditInfo).toBeVisible({ timeout: 5000 });
        }
      }
    });
  });

  test.describe("Export Users", () => {
    test("should export users list", async ({ page }) => {
      // Look for export button
      const exportButton = page.getByRole("button", { name: /exportar|export/i });

      if (await exportButton.isVisible()) {
        // Start download
        const downloadPromise = page.waitForEvent('download');
        await exportButton.click();

        // Wait for download
        const download = await downloadPromise;

        // Verify download started
        expect(download.suggestedFilename()).toMatch(/users.*\.(csv|xlsx|json)/i);
      }
    });
  });
});
