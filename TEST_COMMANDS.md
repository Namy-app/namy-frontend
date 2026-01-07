# Quick Test Commands Reference

## 🚀 Most Common Commands

```bash
# Development workflow
pnpm test                 # Run unit tests in watch mode
pnpm cypress              # Open Cypress GUI for E2E tests

# CI/CD or pre-commit
pnpm test:run             # Run all unit tests once
pnpm test:coverage        # Check code coverage
pnpm e2e:headless         # Run E2E tests in background
```

## 📋 All Available Commands

### Unit/Integration Tests (Vitest)

| Command | Description | When to Use |
|---------|-------------|-------------|
| `pnpm test` | Watch mode | During development |
| `pnpm test:run` | Run once | Before commit, in CI |
| `pnpm test:ui` | Interactive UI | Debugging tests |
| `pnpm test:coverage` | Generate coverage | Check test quality |

### E2E Tests (Cypress)

| Command | Description | When to Use |
|---------|-------------|-------------|
| `pnpm cypress` | Interactive GUI | Writing/debugging E2E |
| `pnpm cypress:headless` | Headless run | CI/CD pipeline |
| `pnpm e2e` | Start server + test | Full E2E locally |
| `pnpm e2e:headless` | Server + headless | CI/CD pipeline |

## 🎯 Specific Test Commands

### Run Specific Tests

```bash
# Vitest - run tests matching pattern
pnpm test wallet          # All tests with "wallet" in path
pnpm test subscription    # All tests with "subscription"
pnpm test VideoAdsModal   # Specific component tests

# Cypress - run specific file
pnpm cypress run --spec "cypress/e2e/auth/login.cy.ts"
pnpm cypress run --spec "cypress/e2e/coupon/*.cy.ts"
```

### Debug Tests

```bash
# Vitest with UI (best for debugging)
pnpm test:ui

# Cypress interactive (click through tests)
pnpm cypress
```

## 📊 Coverage Commands

```bash
# Generate HTML coverage report
pnpm test:coverage

# View coverage (after running above)
open coverage/index.html          # macOS
xdg-open coverage/index.html      # Linux
start coverage/index.html         # Windows
```

## 🔄 Typical Workflow

### During Development
```bash
# Terminal 1: Dev server
pnpm dev

# Terminal 2: Unit tests in watch mode
pnpm test

# When needed: Open Cypress for E2E
pnpm cypress
```

### Before Committing
```bash
# Run all checks
pnpm test:run && pnpm lint && pnpm type-check

# Optional: Run E2E if you changed critical flows
pnpm e2e:headless
```

### In CI/CD
```bash
# Fast unit tests
pnpm test:run

# Full E2E suite (slower)
pnpm e2e:headless
```

## 🐛 Troubleshooting

### Clear Test Cache
```bash
# Vitest
rm -rf .vitest-cache
pnpm test:run

# Cypress
rm -rf cypress/videos cypress/screenshots
pnpm cypress run
```

### Reset Everything
```bash
# Clean install
rm -rf node_modules
pnpm install

# Reinstall Cypress binary
pnpm cypress install
```

## 💡 Pro Tips

1. **Use `test:ui`** for debugging failing tests
2. **Use Cypress GUI** to see tests run in real browser
3. **Run specific tests** during development to save time
4. **Check coverage** before merging PRs
5. **Use watch mode** to get instant feedback

## 🎓 Learning Resources

- Vitest: https://vitest.dev/guide/
- Cypress: https://docs.cypress.io/guides/getting-started/writing-your-first-test
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/
