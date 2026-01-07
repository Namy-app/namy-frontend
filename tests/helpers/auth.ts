import { Page } from '@playwright/test'

export async function login(page: Page, email: string, password: string) {
  await page.goto('/auth')

  // Fill in login form using placeholders
  await page.getByPlaceholder('your@email.com').fill(email)
  await page.getByPlaceholder('••••••••').first().fill(password)
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()

  // Wait for redirect to explore page
  await page.waitForURL('/explore', { timeout: 15000 })
}

export async function logout(page: Page) {
  await page.getByTestId('user-menu').click()
  await page.getByRole('button', { name: /Cerrar Sesión/i }).click()
}
