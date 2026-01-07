# Test Setup Complete! 🎉

## What's Been Set Up

### ✅ Vitest (Unit/Integration Tests)
- Configuration files created
- Test files updated to use Vitest instead of Jest
- All existing tests migrated

### ✅ Cypress (E2E Tests)
- Full Cypress configuration
- Custom commands for common operations
- Comprehensive E2E test examples

## 📦 Installation Steps

Run this command to install all testing dependencies:

```bash
pnpm install
```

This will install:
- **Vitest** - Fast unit test runner
- **@testing-library/react** - Component testing utilities
- **@testing-library/jest-dom** - Custom matchers
- **Cypress** - E2E testing framework
- **jsdom** - DOM implementation for tests
- **Coverage tools** - Code coverage reporting

## 🚀 Quick Start

### 1. Run Unit Tests (Vitest)

```bash
# Watch mode - tests rerun on file changes
pnpm test

# Run once
pnpm test:run

# With UI dashboard
pnpm test:ui

# With coverage report
pnpm test:coverage
```

### 2. Run E2E Tests (Cypress)

```bash
# Interactive mode (recommended for development)
pnpm cypress

# Headless mode (for CI/CD)
pnpm cypress:headless

# Start dev server + run tests automatically
pnpm e2e
```

## 📁 Project Structure

```
namy-ui/
├── vitest.config.ts              # Vitest configuration
├── vitest.setup.ts               # Test setup & global mocks
├── cypress.config.ts             # Cypress configuration
├── cypress/
│   ├── e2e/                      # E2E test files
│   │   ├── auth/
│   │   │   └── login.cy.ts       # Login/auth tests
│   │   ├── coupon/
│   │   │   ├── generate-coupon.cy.ts  # Coupon generation flow
│   │   │   └── my-coupons.cy.ts       # My coupons page
│   │   ├── subscription/
│   │   │   └── premium.cy.ts     # Premium subscription
│   │   └── wallet/
│   │       └── wallet.cy.ts      # Wallet management
│   └── support/
│       ├── commands.ts           # Custom Cypress commands
│       ├── e2e.ts               # E2E setup
│       └── component.ts         # Component testing setup
└── src/
    ├── app/
    │   ├── wallet/__tests__/
    │   │   └── page.test.tsx     # Wallet page tests
    │   ├── subscription/__tests__/
    │   │   └── page.test.tsx     # Subscription tests
    │   └── my-coupons/__tests__/
    │       └── page.test.tsx     # Coupons tests
    ├── components/__tests__/
    │   └── VideoAdsModal.test.tsx  # Video ads tests
    └── domains/payment/components/__tests__/
        └── WalletDashboard.test.tsx  # Wallet dashboard tests
```

## 🎯 Test Coverage

### Unit/Integration Tests
- ✅ Wallet (create, balance, transactions, pagination)
- ✅ Subscription (display, payment, cancel, auto-renew)
- ✅ Video Ads (modal, progression, completion, rate limiting)
- ✅ Coupons (list, filter, QR codes, sharing)

### E2E Tests
- ✅ Authentication flow
- ✅ Full coupon generation with video ads
- ✅ Coupon management and filtering
- ✅ Premium subscription purchase
- ✅ Wallet deposits and transactions

## 🔧 Custom Cypress Commands

We've created custom commands to make E2E testing easier:

```typescript
// Login to the app
cy.login('user@example.com', 'password123')

// Logout
cy.logout()

// Get element by test ID
cy.getByTestId('submit-button').click()

// Wait for specific GraphQL query
cy.waitForGraphQL('GetUserQuery')
```

## 📊 Running Tests in CI/CD

Tests are configured to run in your CI/CD pipeline:

```bash
# Unit tests (fast)
pnpm test:run

# E2E tests (slower, requires running app)
pnpm e2e:headless
```

## 🐛 Debugging Tips

### Vitest Debugging
```bash
# Run specific test file
pnpm test wallet

# Open UI for interactive debugging
pnpm test:ui
```

### Cypress Debugging
```bash
# Open interactive GUI
pnpm cypress

# Run specific test
pnpm cypress run --spec "cypress/e2e/auth/login.cy.ts"

# Screenshots saved automatically on failure
# Check: cypress/screenshots/
```

## 📝 Key Differences: Vitest vs Jest

| Feature | Jest | Vitest |
|---------|------|--------|
| Import style | `import jest` | `import { vi }` |
| Mock function | `jest.fn()` | `vi.fn()` |
| Mock module | `jest.mock()` | `vi.mock()` |
| Speed | Good | ⚡ Faster |
| ESM support | Requires config | Native ✅ |

**All your test code has been updated to use Vitest!**

## ⚠️ Important Notes

1. **Test files use `.test.tsx`** extension (not `.spec.tsx`)
2. **E2E files use `.cy.ts`** extension (Cypress convention)
3. **Mock data** should be in your test files or separate mock files
4. **Environment variables** are configured in `cypress.config.ts` for E2E tests
5. **First E2E run** will take longer as Cypress downloads browser binaries

## 🎓 Next Steps

1. **Install dependencies**: `pnpm install`
2. **Run unit tests**: `pnpm test` - should see all tests passing
3. **Try Cypress**: `pnpm cypress` - explore the interactive GUI
4. **Add tests** for new features as you build them
5. **Check coverage**: `pnpm test:coverage` - aim for >80%

## 📚 Learn More

- Full testing guide: [TESTING.md](./TESTING.md)
- Test cases documentation: [TEST_CASES.md](./TEST_CASES.md)
- Vitest docs: https://vitest.dev/
- Cypress docs: https://docs.cypress.io/

## 🤝 Need Help?

Common issues:

1. **"Cannot find module @testing-library/react"**
   - Solution: Run `pnpm install`

2. **Cypress binary not found**
   - Solution: Run `pnpm cypress install`

3. **Tests failing with ESM errors**
   - Solution: Check that `"type": "module"` is in package.json ✅

4. **E2E tests can't connect**
   - Solution: Make sure dev server is running: `pnpm dev`

---

Happy Testing! 🧪✨
