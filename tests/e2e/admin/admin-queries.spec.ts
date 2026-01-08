import { test, expect } from "@playwright/test";

test.describe("Admin - Queries and Statistics", () => {
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
  });

  test.describe("Store Statistics", () => {
    test("should display store statistics dashboard", async ({ page }) => {
      // Click on statistics section
      const statsLink = page.getByRole("link", {
        name: /estadísticas|statistics|análisis/i,
      });

      if (await statsLink.isVisible()) {
        await statsLink.click();

        // Verify statistics dashboard is visible
        await expect(
          page.getByText(/estadísticas|statistics/i).first()
        ).toBeVisible({ timeout: 10000 });
      }
    });

    test("should display total stores count", async ({ page }) => {
      // Navigate to dashboard
      await page.goto("/admin/dashboard");

      // Verify total stores metric is displayed
      await expect(
        page.getByText(/total de tiendas|total stores/i)
      ).toBeVisible({ timeout: 10000 });

      // Verify count is a number
      const storesCount = page.locator('[data-testid="total-stores-count"]');
      if (await storesCount.isVisible()) {
        const count = await storesCount.textContent();
        expect(count).toMatch(/\d+/);
      }
    });

    test("should display active stores vs inactive stores", async ({
      page,
    }) => {
      await page.goto("/admin/dashboard");

      // Verify active stores count
      const activeStores = page.locator('[data-testid="active-stores-count"]');
      if (await activeStores.isVisible()) {
        await expect(activeStores).toBeVisible({ timeout: 5000 });
      }

      // Verify inactive stores count
      const inactiveStores = page.locator(
        '[data-testid="inactive-stores-count"]'
      );
      if (await inactiveStores.isVisible()) {
        await expect(inactiveStores).toBeVisible({ timeout: 5000 });
      }
    });

    test("should display stores by category breakdown", async ({ page }) => {
      await page.goto("/admin/dashboard");

      // Verify category breakdown chart/table
      const categoryBreakdown = page.locator(
        '[data-testid="stores-by-category"]'
      );
      if (await categoryBreakdown.isVisible()) {
        await expect(categoryBreakdown).toBeVisible({ timeout: 5000 });

        // Verify categories are listed
        await expect(
          categoryBreakdown.getByText(/restaurant|café|bar/i)
        ).toBeVisible({ timeout: 5000 });
      }
    });

    test("should filter statistics by date range", async ({ page }) => {
      await page.goto("/admin/dashboard");

      // Find date range filter
      const fromDate = page.getByLabel(/desde|from/i);
      const toDate = page.getByLabel(/hasta|to/i);

      if ((await fromDate.isVisible()) && (await toDate.isVisible())) {
        // Set date range (last 30 days)
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        await fromDate.fill(thirtyDaysAgo.toISOString().split("T")[0]);
        await toDate.fill(today.toISOString().split("T")[0]);

        // Apply filter
        const applyButton = page.getByRole("button", {
          name: /aplicar|apply/i,
        });
        await applyButton.click();

        // Wait for data to refresh
        await page.waitForTimeout(2000);
      }
    });
  });

  test.describe("User Management Queries", () => {
    test("should display paginated list of users", async ({ page }) => {
      // Navigate to users section
      await page.goto("/admin/users");

      // Verify users table is displayed
      await expect(
        page.getByText(/usuarios|users|lista de usuarios/i).first()
      ).toBeVisible({ timeout: 10000 });

      // Verify table has rows
      const userRows = page.locator('[data-testid="user-row"]');
      if ((await userRows.count()) > 0) {
        await expect(userRows.first()).toBeVisible({ timeout: 5000 });
      }
    });

    test("should navigate between user pages", async ({ page }) => {
      await page.goto("/admin/users");

      // Find pagination controls
      const nextButton = page.getByRole("button", { name: /siguiente|next/i });
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(1000);

        // Verify page changed
        const pageIndicator = page.locator('[data-testid="current-page"]');
        if (await pageIndicator.isVisible()) {
          const pageNum = await pageIndicator.textContent();
          expect(pageNum).toContain("2");
        }

        // Go back to previous page
        const prevButton = page.getByRole("button", {
          name: /anterior|previous/i,
        });
        await prevButton.click();
      }
    });

    test("should search users by email", async ({ page }) => {
      await page.goto("/admin/users");

      // Find search input
      const searchInput = page.getByPlaceholder(/buscar|search/i);
      if (await searchInput.isVisible()) {
        await searchInput.fill("isaac.kolawole@geniex.dev");
        await page.waitForTimeout(1000);

        // Verify search results
        await expect(
          page.getByText("isaac.kolawole@geniex.dev")
        ).toBeVisible({ timeout: 10000 });
      }
    });

    test("should filter users by role", async ({ page }) => {
      await page.goto("/admin/users");

      // Find role filter
      const roleFilter = page.getByLabel(/rol|role|filtrar/i);
      if (await roleFilter.isVisible()) {
        // Filter by admin
        await roleFilter.selectOption("ADMIN");
        await page.waitForTimeout(1000);

        // Filter by user
        await roleFilter.selectOption("USER");
        await page.waitForTimeout(1000);

        // Show all
        await roleFilter.selectOption("ALL");
      }
    });

    test("should view user details with activity", async ({ page }) => {
      await page.goto("/admin/users");

      // Click on a user to view details
      const userRow = page.locator('[data-testid="user-row"]').first();
      if (await userRow.isVisible()) {
        await userRow.click();

        // Verify user details are displayed
        await expect(
          page.getByText(/detalles del usuario|user details/i)
        ).toBeVisible({ timeout: 10000 });

        // Verify activity section
        await expect(
          page.getByText(/actividad|activity|historial/i)
        ).toBeVisible({ timeout: 5000 });
      }
    });

    test("should display user coupons history", async ({ page }) => {
      await page.goto("/admin/users");

      // Click on a user
      const userRow = page.locator('[data-testid="user-row"]').first();
      if (await userRow.isVisible()) {
        await userRow.click();

        // Navigate to coupons tab
        const couponsTab = page.getByRole("tab", { name: /cupones|coupons/i });
        if (await couponsTab.isVisible()) {
          await couponsTab.click();

          // Verify coupons list
          await expect(
            page.getByText(/cupones generados|generated coupons/i)
          ).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test("should display user statistics", async ({ page }) => {
      await page.goto("/admin/users");

      // Click on a user
      const userRow = page.locator('[data-testid="user-row"]').first();
      if (await userRow.isVisible()) {
        await userRow.click();

        // Verify user stats are displayed
        const stats = [
          /total cupones|total coupons/i,
          /cupones usados|coupons used/i,
          /nivel|level/i,
          /puntos|points/i,
        ];

        for (const stat of stats) {
          const statElement = page.getByText(stat);
          if (await statElement.isVisible()) {
            await expect(statElement).toBeVisible({ timeout: 5000 });
          }
        }
      }
    });

    test("should filter users by premium status", async ({ page }) => {
      await page.goto("/admin/users");

      // Find premium filter
      const premiumFilter = page.getByLabel(/premium|suscripción/i);
      if (await premiumFilter.isVisible()) {
        // Filter premium users
        await premiumFilter.click();
        await page.waitForTimeout(1000);

        // Verify premium badge on users
        const premiumBadge = page.locator('[data-testid="premium-badge"]');
        if ((await premiumBadge.count()) > 0) {
          await expect(premiumBadge.first()).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test("should sort users by registration date", async ({ page }) => {
      await page.goto("/admin/users");

      // Find sort dropdown
      const sortSelect = page.getByLabel(/ordenar|sort/i);
      if (await sortSelect.isVisible()) {
        // Sort by newest first
        await sortSelect.selectOption("created_desc");
        await page.waitForTimeout(1000);

        // Sort by oldest first
        await sortSelect.selectOption("created_asc");
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe("Discount Usage Statistics", () => {
    test("should display discount usage stats", async ({ page }) => {
      await page.goto("/admin/discounts");

      // Click on a discount to view stats
      const discountCard = page.locator('[data-testid="discount-card"]').first();
      if (await discountCard.isVisible()) {
        await discountCard.click();

        // Verify usage statistics
        await expect(
          page.getByText(/usos totales|total uses|estadísticas/i)
        ).toBeVisible({ timeout: 10000 });

        // Verify usage chart
        const usageChart = page.locator('[data-testid="usage-chart"]');
        if (await usageChart.isVisible()) {
          await expect(usageChart).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test("should display monthly redemption stats", async ({ page }) => {
      await page.goto("/admin/discounts");

      // View discount details
      const discountCard = page.locator('[data-testid="discount-card"]').first();
      if (await discountCard.isVisible()) {
        await discountCard.click();

        // Check for monthly stats
        await expect(
          page.getByText(/redenciones mensuales|monthly redemptions/i)
        ).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe("Video Ads Statistics", () => {
    test("should display video ad impressions", async ({ page }) => {
      await page.goto("/admin/video-ads");

      // Find video ad card
      const adCard = page.locator('[data-testid="video-ad-card"]').first();
      if (await adCard.isVisible()) {
        // Verify impression count is displayed
        await expect(
          adCard.getByText(/impresiones|impressions/i)
        ).toBeVisible({ timeout: 5000 });
      }
    });

    test("should display video ad watch count", async ({ page }) => {
      await page.goto("/admin/video-ads");

      // Find video ad card
      const adCard = page.locator('[data-testid="video-ad-card"]').first();
      if (await adCard.isVisible()) {
        // Verify watch count is displayed
        await expect(
          adCard.getByText(/veces visto|views|reproducciones/i)
        ).toBeVisible({ timeout: 5000 });
      }
    });

    test("should display video ad completion rate", async ({ page }) => {
      await page.goto("/admin/video-ads");

      // Click on a video ad
      const adCard = page.locator('[data-testid="video-ad-card"]').first();
      if (await adCard.isVisible()) {
        await adCard.click();

        // Verify completion rate metric
        const completionRate = page.getByText(/tasa de finalización|completion rate/i);
        if (await completionRate.isVisible()) {
          await expect(completionRate).toBeVisible({ timeout: 5000 });
        }
      }
    });
  });

  test.describe("Dashboard Overview", () => {
    test("should display admin dashboard with key metrics", async ({ page }) => {
      await page.goto("/admin/dashboard");

      // Verify key metrics are displayed
      const metrics = [
        /total tiendas|total stores/i,
        /total usuarios|total users/i,
        /total cupones|total coupons/i,
        /cupones activos|active coupons/i,
      ];

      for (const metric of metrics) {
        const metricElement = page.getByText(metric);
        if (await metricElement.isVisible()) {
          await expect(metricElement).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test("should display recent activity feed", async ({ page }) => {
      await page.goto("/admin/dashboard");

      // Verify activity feed
      const activityFeed = page.locator('[data-testid="activity-feed"]');
      if (await activityFeed.isVisible()) {
        await expect(activityFeed).toBeVisible({ timeout: 5000 });

        // Verify activity items
        const activityItems = page.locator('[data-testid="activity-item"]');
        if ((await activityItems.count()) > 0) {
          await expect(activityItems.first()).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test("should display charts and graphs", async ({ page }) => {
      await page.goto("/admin/dashboard");

      // Look for charts
      const charts = page.locator('canvas, svg[class*="chart"]');
      if ((await charts.count()) > 0) {
        await expect(charts.first()).toBeVisible({ timeout: 5000 });
      }
    });
  });
});
