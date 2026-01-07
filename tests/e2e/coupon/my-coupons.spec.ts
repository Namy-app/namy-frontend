import { test, expect } from '@playwright/test'
import { login } from '../../helpers/auth'

test.describe('My Coupons Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page, 'isaac.kolawole@geniex.dev', 'Admin@123456')

    // Navigate to my coupons
    await page.goto('/my-coupons')
  })

  test('should display coupons list', async ({ page }) => {
    await expect(page.getByText('Mis Cupones')).toBeVisible()

    // Should show filter tabs
    await expect(page.getByRole('button', { name: /Todos/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Activos/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Canjeados/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Expirados/i })).toBeVisible()
  })

  test('should filter coupons by status', async ({ page }) => {
    // Click on active filter
    await page.getByRole('button', { name: /Activos/i }).click()

    // Check that URL or UI updates
    const couponCards = page.getByTestId('coupon-card')
    const count = await couponCards.count()

    if (count > 0) {
      // Active coupons should not show expired or redeemed badge
      for (let i = 0; i < count; i++) {
        const card = couponCards.nth(i)
        await expect(card).not.toContainText('Expirado')
        await expect(card).not.toContainText('Canjeado')
      }
    }

    // Click on redeemed filter
    await page.getByRole('button', { name: /Canjeados/i }).click()
    // Should only show redeemed coupons
  })

  test('should show empty state when no coupons exist', async ({ page }) => {
    // Intercept API and return empty coupons
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

    await expect(page.getByText('Aún no tienes cupones')).toBeVisible()
    await expect(page.getByRole('button', { name: /Explorar Descuentos/i })).toBeVisible()
  })

  test('should navigate to explore when clicking explore button from empty state', async ({ page }) => {
    // Intercept to return empty coupons
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

    await page.getByRole('button', { name: /Explorar Descuentos/i }).click()
    await expect(page).toHaveURL(/\/explore/)
  })
})
