# Admin E2E Tests - Quick Start Guide

Get up and running with admin E2E tests in 5 minutes!

## 1️⃣ Prerequisites Check

```bash
# Make sure backend is running
cd namy-backend
npm run start:dev

# Make sure frontend is running
cd namy-ui
npm run dev
```

## 2️⃣ Install Dependencies

```bash
cd namy-ui

# Install Playwright if not already installed
npx playwright install
```

## 3️⃣ Run Your First Test

```bash
# Run all admin tests
npm run e2e:admin
```

That's it! 🎉

---

## 📖 Common Commands

### Run tests with different options

```bash
# See tests running in browser
npm run e2e:admin:headed

# Interactive UI mode
npm run e2e:admin:ui

# Run specific test file
npx playwright test tests/e2e/admin/stores.spec.ts

# Run specific test by name
npx playwright test -g "should create a new store"

# Debug a test
npx playwright test tests/e2e/admin/stores.spec.ts --debug
```

### View test results

```bash
# Generate HTML report
npx playwright show-report

# View last test results
npx playwright test --reporter=html
```

---

## 🎯 What Gets Tested

When you run `npm run e2e:admin`, it tests:

✅ **Stores** - Create, update, delete, toggle status
✅ **Discounts** - Create, update, delete, validate dates/values
✅ **Catalogs** - Create with images, update, delete
✅ **Video Ads** - Upload, create, update, delete (Super Admin)
✅ **Queries** - Statistics, user management, filtering

---

## 🔧 Troubleshooting

### Tests fail with "Login failed"
**Solution:** Check admin credentials in test files
```typescript
// Default: isaac.kolawole@geniex.dev / Admin@123456
```

### Tests fail with "Element not found"
**Solution:** Backend might not be running or database is empty
```bash
# Start backend
cd namy-backend && npm run start:dev

# Seed database if needed
npm run seed
```

### File upload tests are skipped
**Solution:** Add test fixtures
```bash
# Add sample files to tests/fixtures/
tests/fixtures/test-menu.jpg
tests/fixtures/test-video.mp4
```

### Tests are slow
**Solution:** Run in headless mode (default) or parallel
```bash
# Headless is faster
npm run e2e:admin

# Or specify parallel workers
npx playwright test tests/e2e/admin --workers=4
```

---

## 📂 Test Files Overview

| File | What It Tests | Run Time |
|------|--------------|----------|
| `stores.spec.ts` | Store CRUD operations | ~2 min |
| `discounts.spec.ts` | Discount CRUD + validation | ~2 min |
| `catalogs.spec.ts` | Catalog CRUD + images | ~3 min |
| `video-ads.spec.ts` | Video upload + ad management | ~4 min |
| `admin-queries.spec.ts` | Statistics + user queries | ~3 min |

**Total Runtime:** ~15 minutes for complete suite

---

## 🎓 Next Steps

1. **Read the README**
   ```bash
   cat tests/e2e/admin/README.md
   ```

2. **View Test Summary**
   ```bash
   cat tests/e2e/admin/TEST_SUMMARY.md
   ```

3. **Explore Test Helpers**
   ```bash
   cat tests/e2e/admin/utils/admin-test-helpers.ts
   ```

4. **Run Tests in UI Mode**
   ```bash
   npm run e2e:admin:ui
   ```

---

## 💡 Pro Tips

### Tip 1: Use Test Helpers
```typescript
import { loginAsAdmin, createStore } from "./utils/admin-test-helpers";

test("my test", async ({ page }) => {
  await loginAsAdmin(page);
  await createStore(page, { /* data */ });
});
```

### Tip 2: Debug Failed Tests
```bash
# Run with trace
npx playwright test tests/e2e/admin/stores.spec.ts --trace on

# View trace
npx playwright show-trace trace.zip
```

### Tip 3: Run Specific Test
```bash
# By file
npx playwright test stores.spec.ts

# By name
npx playwright test -g "create store"
```

### Tip 4: Watch Mode (Re-run on changes)
```bash
npx playwright test tests/e2e/admin --ui
# Use UI mode for interactive development
```

---

## ✅ Checklist

Before running tests, make sure:

- [ ] Backend is running (`npm run start:dev`)
- [ ] Frontend is running (`npm run dev`)
- [ ] Database has admin user
- [ ] Playwright is installed (`npx playwright install`)
- [ ] Test fixtures exist (optional, tests will skip if missing)

---

## 🆘 Need Help?

1. Check [README.md](./README.md) for detailed docs
2. Check [TEST_SUMMARY.md](./TEST_SUMMARY.md) for coverage info
3. Check Playwright docs: https://playwright.dev
4. Ask the team on Slack

---

## 🚀 Quick Test Commands Reference

```bash
# Run all admin tests
npm run e2e:admin

# Run with UI
npm run e2e:admin:ui

# Run headed (see browser)
npm run e2e:admin:headed

# Run single file
npx playwright test tests/e2e/admin/stores.spec.ts

# Run single test
npx playwright test -g "should create a new store"

# Debug mode
npx playwright test --debug

# Generate report
npx playwright test --reporter=html
npx playwright show-report
```

---

**Ready to go? Run your first test:**
```bash
npm run e2e:admin
```

Good luck! 🍀
