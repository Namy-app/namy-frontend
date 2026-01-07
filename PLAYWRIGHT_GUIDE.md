# Playwright E2E Testing Guide

## 🎭 Why Playwright Over Cypress

We switched to Playwright because:
- ✅ **Faster** - Better performance
- ✅ **Multi-browser** - Test in Chrome, Firefox, Safari simultaneously
- ✅ **No blank screen issues** - More reliable GUI
- ✅ **Better debugging** - Built-in trace viewer
- ✅ **Auto-wait** - Smarter element detection
- ✅ **Modern** - Actively developed by Microsoft

## 🚀 Quick Start

### Run All Tests

```bash
# Run all E2E tests (headless)
yarn e2e

# Run with browser visible
yarn e2e:headed

# Open interactive UI
yarn playwright

# Debug mode (step through tests)
yarn e2e:debug
```

### Run Specific Test

```bash
# Run specific test file
npx playwright test tests/e2e/auth/login.spec.ts

# Run tests matching pattern
npx playwright test tests/e2e/coupon

# Run in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 📁 Test Structure

```
tests/
├── e2e/
│   ├── auth/
│   │   └── login.spec.ts          # Login tests
│   ├── coupon/
│   │   └── my-coupons.spec.ts     # Coupon management
│   └── ...
└── helpers/
    └── auth.ts                     # Reusable auth functions
```

## ✍️ Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/your-page')
  })

  test('should do something', async ({ page }) => {
    // Your test code
    await page.click('button')
    await expect(page.getByText('Success')).toBeVisible()
  })
})
```

### Using Helper Functions

```typescript
import { login } from '../helpers/auth'

test('user can view dashboard', async ({ page }) => {
  await login(page, 'user@example.com', 'password')
  await page.goto('/dashboard')
  await expect(page.getByText('Welcome')).toBeVisible()
})
```

### Common Actions

```typescript
// Navigate
await page.goto('/page')

// Click
await page.click('button')
await page.getByRole('button', { name: 'Submit' }).click()

// Fill input
await page.fill('input[name="email"]', 'test@example.com')
await page.locator('input[name="email"]').fill('test@example.com')

// Assertions
await expect(page.getByText('Success')).toBeVisible()
await expect(page).toHaveURL(/\/dashboard/)
await expect(page.locator('h1')).toContainText('Hello')

// Wait for navigation
await page.waitForURL('/dashboard')

// Intercept API calls
await page.route('**/graphql', async (route) => {
  const request = route.request()
  const postData = request.postDataJSON()

  if (postData?.operationName === 'GetUser') {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ data: { user: mockUser } }),
    })
  } else {
    await route.continue()
  }
})
```

## 🔍 Debugging

### Interactive UI Mode

```bash
yarn playwright
```

Opens a UI where you can:
- ✅ See all tests
- ✅ Run tests one by one
- ✅ See screenshots/videos
- ✅ View traces

### Debug Mode

```bash
yarn e2e:debug
```

Opens browser in debug mode with Playwright Inspector:
- ⏯️ Step through tests
- 🔍 Inspect elements
- 📝 See executed steps
- ⏱️ View timing

### View Test Report

```bash
# After running tests
npx playwright show-report
```

Opens HTML report with:
- Test results
- Screenshots
- Videos
- Traces

## 📊 Test Reports

After running tests, you get:
- **HTML Report** - `playwright-report/index.html`
- **Test Results** - `test-results/` folder
- **Screenshots** - Captured on failure
- **Videos** - Recorded on failure
- **Traces** - Full execution trace

## 🎯 Best Practices

### 1. Use Data Test IDs

```typescript
// In your component
<button data-testid="submit-button">Submit</button>

// In your test
await page.getByTestId('submit-button').click()
```

### 2. Use Helper Functions

```typescript
// tests/helpers/auth.ts
export async function login(page: Page, email: string, password: string) {
  await page.goto('/auth/login')
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL(/^(?!.*\/auth\/login)/)
}
```

### 3. Clean State Between Tests

```typescript
test.beforeEach(async ({ context }) => {
  await context.clearCookies()
  await context.clearPermissions()
})
```

### 4. Use Auto-Waiting

Playwright automatically waits for elements. Don't use manual `sleep`:

```typescript
// ❌ Bad
await page.click('button')
await page.waitForTimeout(5000)

// ✅ Good
await page.click('button')
await expect(page.getByText('Success')).toBeVisible()
```

## 🌐 Multi-Browser Testing

Test across all browsers at once:

```bash
# Run in all browsers
yarn e2e

# Run in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Mobile browsers
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## 🚦 CI/CD Integration

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '24'
      - name: Install dependencies
        run: yarn install
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: yarn e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📝 Example Tests

### Login Test

```typescript
test('user can login', async ({ page }) => {
  await page.goto('/auth/login')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByText('Welcome back')).toBeVisible()
})
```

### API Mocking Test

```typescript
test('shows error message on API failure', async ({ page }) => {
  await page.route('**/api/user', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Server error' })
    })
  })

  await page.goto('/profile')
  await expect(page.getByText('Failed to load user')).toBeVisible()
})
```

## 🆚 Playwright vs Cypress

| Feature | Playwright | Cypress |
|---------|-----------|---------|
| Speed | ⚡⚡⚡ Faster | ⚡⚡ Good |
| Multi-browser | ✅ Chrome, Firefox, Safari | ❌ Limited |
| Auto-wait | ✅ Built-in | ✅ Built-in |
| Debugging | ✅ Excellent | ✅ Excellent |
| GUI | ✅ Works reliably | ❌ Sometimes blank |
| API | ✅ Modern | ✅ Good |
| Community | ✅ Growing | ✅ Large |

## 📚 Resources

- [Playwright Docs](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer)

## 💡 Tips

1. **Use headed mode** during development: `yarn e2e:headed`
2. **Use debug mode** when tests fail: `yarn e2e:debug`
3. **Check traces** for detailed execution: `npx playwright show-trace trace.zip`
4. **Run specific tests** during development to save time
5. **Use test.only()** to focus on single test while debugging

```typescript
test.only('this test will run alone', async ({ page }) => {
  // ...
})
```

Happy Testing with Playwright! 🎭✨
