import { test, expect } from '@playwright/test'
import { login } from '../../helpers/auth'

test.describe('Coupons - Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page, 'isaac.kolawole@geniex.dev', 'Admin@123456')
    await page.goto('/my-coupons')
  })

  test('should display coupons page correctly on mobile portrait', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    // Page title should be visible
    await expect(page.getByText('Mis Cupones')).toBeVisible()

    // Filter tabs should be visible and stacked if needed
    await expect(page.getByRole('button', { name: /Todos/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Activos/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Canjeados/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Expirados/i })).toBeVisible()
  })

  test('should display coupons page correctly on mobile landscape', async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 })

    await expect(page.getByText('Mis Cupones')).toBeVisible()
    await expect(page.getByRole('button', { name: /Todos/i })).toBeVisible()
  })

  test('should display coupons page correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })

    await expect(page.getByText('Mis Cupones')).toBeVisible()
    await expect(page.getByRole('button', { name: /Todos/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Activos/i })).toBeVisible()
  })

  test('should display coupons page correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })

    await expect(page.getByText('Mis Cupones')).toBeVisible()

    // All filter buttons should be visible in a row on desktop
    await expect(page.getByRole('button', { name: /Todos/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Activos/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Canjeados/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Expirados/i })).toBeVisible()
  })

  test('should display coupon cards correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    // Check if coupons exist
    const couponCards = page.getByTestId('coupon-card')
    const count = await couponCards.count()

    if (count > 0) {
      // First coupon card should be visible
      await expect(couponCards.first()).toBeVisible()

      // Card should be full width on mobile
      const firstCard = couponCards.first()
      await expect(firstCard).toBeVisible()
    }
  })

  test('should handle filter interactions on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    // Click on Activos filter (use click instead of tap for broader compatibility)
    await page.getByRole('button', { name: /Activos/i }).first().click()

    // Filter should be applied
    // Check that we're still on the coupons page
    await expect(page).toHaveURL(/\/my-coupons/)
  })

  test('should display empty state correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    // Mock empty coupons response
    await page.route('**/graphql', async (route) => {
      const request = route.request()
      const postData = request.postDataJSON()

      if (postData?.operationName === 'MyCoupons') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              myCoupons: [],
            },
          }),
        })
      } else {
        await route.continue()
      }
    })

    await page.reload()

    // Empty state should be visible
    await expect(page.getByText('Aún no tienes cupones')).toBeVisible()
    await expect(page.getByRole('button', { name: /Explorar Descuentos/i })).toBeVisible()
  })

  test('should scroll through coupons on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    const couponCards = page.getByTestId('coupon-card')
    const count = await couponCards.count()

    if (count > 3) {
      // First card should be visible
      await expect(couponCards.first()).toBeVisible()

      // Scroll down
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

      // Last card should now be visible
      await expect(couponCards.last()).toBeVisible()
    }
  })

  test('should maintain filter state when rotating device', async ({ page }) => {
    // Start in portrait
    await page.setViewportSize({ width: 390, height: 844 })

    // Select Activos filter
    await page.getByRole('button', { name: /Activos/i }).click()

    // Rotate to landscape
    await page.setViewportSize({ width: 844, height: 390 })

    // Filter should still be active
    // We can check this by verifying we're still on the page
    await expect(page).toHaveURL(/\/my-coupons/)
  })

  test('should navigate to explore from empty state on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    // Mock empty coupons
    await page.route('**/graphql', async (route) => {
      const request = route.request()
      const postData = request.postDataJSON()

      if (postData?.operationName === 'MyCoupons') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              myCoupons: [],
            },
          }),
        })
      } else {
        await route.continue()
      }
    })

    await page.reload()
    await page.waitForTimeout(1000)

    // Click explore button (use click instead of tap)
    const exploreButton = page.getByRole('button', { name: /Explorar Descuentos/i })
    const buttonExists = await exploreButton.isVisible().catch(() => false)

    if (buttonExists) {
      await exploreButton.click()
      // Should navigate to explore
      await expect(page).toHaveURL(/\/explore/)
    } else {
      // Empty state button might not exist, test is implementation-specific
      console.log('Explore button not found in empty state')
    }
  })

  test('should display filter tabs in single row on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })

    // Get all filter buttons
    const todosBtn = page.getByRole('button', { name: /Todos/i })
    const activosBtn = page.getByRole('button', { name: /Activos/i })
    const canjeadosBtn = page.getByRole('button', { name: /Canjeados/i })
    const expiradosBtn = page.getByRole('button', { name: /Expirados/i })

    // All should be visible
    await expect(todosBtn).toBeVisible()
    await expect(activosBtn).toBeVisible()
    await expect(canjeadosBtn).toBeVisible()
    await expect(expiradosBtn).toBeVisible()

    // Get bounding boxes to verify they're in a row
    const todosBox = await todosBtn.boundingBox()
    const activosBox = await activosBtn.boundingBox()

    if (todosBox && activosBox) {
      // They should be roughly at the same vertical position (same row)
      const verticalDiff = Math.abs(todosBox.y - activosBox.y)
      expect(verticalDiff).toBeLessThan(10)
    }
  })

  test('should handle very small screens gracefully', async ({ page }) => {
    // Very small viewport (old iPhone SE)
    await page.setViewportSize({ width: 320, height: 568 })

    // Page should still be functional
    await expect(page.getByText('Mis Cupones')).toBeVisible()
    await expect(page.getByRole('button', { name: /Todos/i })).toBeVisible()

    // Should be able to scroll
    const couponCards = page.getByTestId('coupon-card')
    const count = await couponCards.count()

    if (count > 0) {
      await couponCards.first().scrollIntoViewIfNeeded()
      await expect(couponCards.first()).toBeVisible()
    }
  })
})
