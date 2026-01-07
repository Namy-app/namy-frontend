# Testing Guide

This project uses **Vitest** for unit/integration tests and **Cypress** for E2E tests.

## 📦 Installation

Install all dependencies:

```bash
pnpm install
```

## 🧪 Unit/Integration Tests (Vitest)

### Running Tests

```bash
# Run tests in watch mode (development)
pnpm test

# Run tests once
pnpm test:run

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### Test Structure

Unit/integration tests are located in `__tests__` folders next to the components/pages they test:

```
src/
├── app/
│   ├── wallet/
│   │   └── __tests__/
│   │       └── page.test.tsx
│   ├── subscription/
│   │   └── __tests__/
│   │       └── page.test.tsx
│   └── my-coupons/
│       └── __tests__/
│           └── page.test.tsx
├── components/
│   └── __tests__/
│       └── VideoAdsModal.test.tsx
└── domains/
    └── payment/
        └── components/
            └── __tests__/
                └── WalletDashboard.test.tsx
```

### Writing Vitest Tests

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const mockFn = vi.fn()
    render(<MyComponent onClick={mockFn} />)

    fireEvent.click(screen.getByRole('button'))
    expect(mockFn).toHaveBeenCalled()
  })
})
```

## 🎭 E2E Tests (Cypress)

### Running E2E Tests

```bash
# Open Cypress GUI (interactive)
pnpm cypress

# Run Cypress tests in headless mode
pnpm cypress:headless

# Start dev server and run E2E tests
pnpm e2e

# Start dev server and run E2E tests in headless mode
pnpm e2e:headless
```

### E2E Test Structure

E2E tests are located in the `cypress/e2e` folder:

```
cypress/
├── e2e/
│   ├── auth/
│   │   └── login.cy.ts
│   ├── coupon/
│   │   ├── generate-coupon.cy.ts
│   │   └── my-coupons.cy.ts
│   ├── subscription/
│   │   └── premium.cy.ts
│   └── wallet/
│       └── wallet.cy.ts
└── support/
    ├── commands.ts       # Custom commands
    ├── e2e.ts           # E2E setup
    └── component.ts     # Component testing setup
```

### Writing Cypress Tests

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123')
    cy.visit('/page-url')
  })

  it('should perform user action', () => {
    cy.contains('Click Me').click()
    cy.url().should('include', '/success')
    cy.contains('Success!').should('be.visible')
  })
})
```

### Custom Cypress Commands

We have custom commands to make testing easier:

```typescript
// Login
cy.login('user@example.com', 'password123')

// Logout
cy.logout()

// Get element by test ID
cy.getByTestId('submit-button')

// Wait for GraphQL operation
cy.waitForGraphQL('GetUserQuery')
```

## 🎯 Test Coverage

### What's Tested

#### Unit/Integration Tests (Vitest)
- ✅ Wallet functionality (WAL-001 to WAL-010)
- ✅ Subscription features (SUB-001 to SUB-009)
- ✅ Video ads flow (ADS-001 to ADS-005)
- ✅ Coupon management (CPN-001 to CPN-009)

#### E2E Tests (Cypress)
- ✅ Authentication (login, registration)
- ✅ Coupon generation with video ads
- ✅ My coupons page (filtering, QR codes, sharing)
- ✅ Premium subscription (payment, cancellation)
- ✅ Wallet management (deposits, transactions)

### Generate Coverage Report

```bash
pnpm test:coverage
```

Coverage report will be generated in `coverage/` folder. Open `coverage/index.html` in your browser to view the detailed report.

## 🔧 Configuration Files

### Vitest Configuration
- **vitest.config.ts** - Main Vitest configuration
- **vitest.setup.ts** - Test setup and global mocks

### Cypress Configuration
- **cypress.config.ts** - Main Cypress configuration
- **cypress/support/commands.ts** - Custom commands
- **cypress/support/e2e.ts** - E2E setup

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '24'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:run

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '24'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm e2e:headless
```

## 📝 Best Practices

### Unit/Integration Tests
1. **Mock external dependencies** (APIs, modules)
2. **Test user behavior**, not implementation details
3. **Use data-testid** for reliable element selection
4. **Keep tests fast** - avoid unnecessary waits
5. **Test accessibility** - use role-based queries

### E2E Tests
1. **Test critical user flows** only (don't duplicate unit tests)
2. **Use custom commands** for common actions
3. **Intercept network requests** when needed
4. **Clean state** between tests
5. **Be patient** - use appropriate timeouts

## 🐛 Debugging

### Vitest
```bash
# Run specific test file
pnpm test src/app/wallet/__tests__/page.test.tsx

# Run tests matching pattern
pnpm test wallet

# Debug in VS Code
# Add this to launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "pnpm",
  "runtimeArgs": ["test"],
  "console": "integratedTerminal"
}
```

### Cypress
```bash
# Open Cypress GUI for interactive debugging
pnpm cypress

# Run specific test file
pnpm cypress run --spec "cypress/e2e/auth/login.cy.ts"

# Take screenshots on failure (enabled by default)
# Videos are disabled by default (configure in cypress.config.ts)
```

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🤝 Contributing

When adding new features:
1. Write unit tests for component logic
2. Write E2E tests for critical user flows
3. Ensure tests pass before committing: `pnpm test:run && pnpm e2e:headless`
4. Maintain >80% code coverage
