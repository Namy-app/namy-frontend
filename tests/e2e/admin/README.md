# Admin E2E Tests

Comprehensive end-to-end tests for all admin mutations and queries in the Ñamy application.

## Test Coverage

### 1. Store Management (`stores.spec.ts`)
- ✅ Create store
- ✅ Update store
- ✅ Delete store
- ✅ Toggle store active status
- ✅ Resend store PIN email
- ✅ View store statistics
- ✅ Form validation

### 2. Discount Management (`discounts.spec.ts`)
- ✅ Create discount
- ✅ Update discount
- ✅ Delete discount
- ✅ Toggle discount active status
- ✅ Validate discount code uniqueness
- ✅ Validate discount dates
- ✅ Validate percentage values (0-100)
- ✅ View discount usage statistics
- ✅ Filter discounts by status

### 3. Catalog Management (`catalogs.spec.ts`)
- ✅ Create catalog without images
- ✅ Create catalog with images
- ✅ Update catalog
- ✅ Delete catalog
- ✅ Toggle catalog active status
- ✅ View catalog details
- ✅ Filter catalogs by store
- ✅ Validate maximum 10 images
- ✅ Display catalog image gallery
- ✅ Search catalogs by name

### 4. Video Ads Management (`video-ads.spec.ts`) - Super Admin Only
- ✅ Request presigned upload URL
- ✅ Create video ad after upload
- ✅ Update video ad
- ✅ Delete video ad
- ✅ Toggle video ad active status
- ✅ Validate duration (1-60 seconds)
- ✅ Validate file size (max 100MB)
- ✅ Validate MIME types
- ✅ Preview video before creating ad
- ✅ View video ad statistics
- ✅ Sort video ads by priority
- ✅ Filter video ads by status

### 5. Admin Queries & Statistics (`admin-queries.spec.ts`)
- ✅ Display store statistics dashboard
- ✅ Display total stores count
- ✅ Display active vs inactive stores
- ✅ Display stores by category
- ✅ Filter statistics by date range
- ✅ Display paginated list of users
- ✅ Navigate between user pages
- ✅ Search users by email
- ✅ Filter users by role
- ✅ View user details with activity
- ✅ Display user coupons history
- ✅ Display user statistics
- ✅ Filter users by premium status
- ✅ Sort users by registration date
- ✅ Display discount usage stats
- ✅ Display monthly redemption stats
- ✅ Display video ad impressions
- ✅ Display video ad watch count
- ✅ Display video ad completion rate
- ✅ Display admin dashboard with key metrics
- ✅ Display recent activity feed
- ✅ Display charts and graphs

## Prerequisites

1. **Backend Running**: Make sure the namy-backend server is running
2. **Database Seeded**: Ensure test data exists (at least one admin user)
3. **Admin Credentials**: Valid admin user credentials configured

### Default Test Credentials
```
Email: isaac.kolawole@geniex.dev
Password: Admin@123456
```

## Running the Tests

### Run all admin tests
```bash
npm run test:e2e:admin
```

### Run specific test file
```bash
npx playwright test tests/e2e/admin/stores.spec.ts
npx playwright test tests/e2e/admin/discounts.spec.ts
npx playwright test tests/e2e/admin/catalogs.spec.ts
npx playwright test tests/e2e/admin/video-ads.spec.ts
npx playwright test tests/e2e/admin/admin-queries.spec.ts
```

### Run in headed mode (see browser)
```bash
npx playwright test tests/e2e/admin --headed
```

### Run in debug mode
```bash
npx playwright test tests/e2e/admin --debug
```

### Run specific test
```bash
npx playwright test tests/e2e/admin/stores.spec.ts -g "should create a new store"
```

### Run with UI mode
```bash
npx playwright test tests/e2e/admin --ui
```

## Test Structure

Each test file follows this pattern:

```typescript
test.describe("Feature Name", () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Login and navigate to admin section
  });

  test("should perform action", async ({ page }) => {
    // Arrange: Set up test data
    // Act: Perform the action
    // Assert: Verify the results
  });
});
```

## Test Helpers

Reusable helper functions are available in `utils/admin-test-helpers.ts`:

### Authentication
- `loginAsAdmin(page)` - Login as admin user
- `loginAsSuperAdmin(page)` - Login as super admin
- `logout(page)` - Logout current user

### Navigation
- `navigateToAdmin(page)` - Go to admin dashboard
- `navigateToStores(page)` - Go to stores section
- `navigateToDiscounts(page)` - Go to discounts section
- `navigateToCatalogs(page)` - Go to catalogs section
- `navigateToVideoAds(page)` - Go to video ads section
- `navigateToUsers(page)` - Go to users section

### CRUD Operations
- `createStore(page, storeData)` - Create a new store
- `deleteStore(page, storeName)` - Delete a store
- `createDiscount(page, discountData)` - Create a discount
- `deleteDiscount(page, discountCode)` - Delete a discount
- `createCatalog(page, catalogData)` - Create a catalog

### Assertions
- `expectSuccessMessage(page, message?)` - Assert success message
- `expectErrorMessage(page, message?)` - Assert error message
- `expectValidationError(page)` - Assert validation error

### Data Generators
- `generateRandomEmail()` - Generate unique email
- `generateRandomStoreName()` - Generate unique store name
- `generateRandomDiscountCode()` - Generate unique discount code
- `getFutureDateString(days)` - Get future date string
- `getPastDateString(days)` - Get past date string
- `getTodayDateString()` - Get today's date string

## Example Test

```typescript
import { test, expect } from "@playwright/test";
import { loginAsAdmin, navigateToStores, createStore } from "./utils/admin-test-helpers";

test("should create a store using helpers", async ({ page }) => {
  // Login as admin
  await loginAsAdmin(page);

  // Navigate to stores
  await navigateToStores(page);

  // Create store
  await createStore(page, {
    name: "Test Restaurant",
    description: "Test description",
    address: "123 Test St",
    phoneNumber: "+1234567890",
    email: "test@example.com",
    category: "RESTAURANT",
  });

  // Verify
  await expect(page.getByText("Test Restaurant")).toBeVisible();
});
```

## Fixtures Directory

Place test files in `tests/fixtures/`:
- `test-menu.jpg` - Sample menu image for catalog tests
- `test-video.mp4` - Sample video for video ad tests (1-60 seconds, < 100MB)
- `test-image.jpg` - Sample image for validation tests

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Clean up test data after tests
3. **Waits**: Use `expect` with timeout instead of `waitForTimeout`
4. **Selectors**: Prefer `data-testid` attributes when available
5. **Assertions**: Always verify success/error messages
6. **Error Handling**: Test both success and error cases

## Debugging Tips

1. **Screenshots**: Playwright automatically captures screenshots on failure
2. **Videos**: Enable video recording in `playwright.config.ts`
3. **Trace Viewer**: Use `--trace on` to record traces
4. **Console Logs**: Check browser console logs in trace viewer

## CI/CD Integration

Add to your CI pipeline:

```yaml
- name: Run Admin E2E Tests
  run: npm run test:e2e:admin

- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Known Issues & Limitations

1. **File Uploads**: Some file upload tests may be skipped if fixtures are not available
2. **Timing**: Some tests may need increased timeouts on slower machines
3. **Super Admin**: Video ads tests require super admin permissions
4. **Database State**: Tests assume certain data exists (stores, discounts, etc.)

## Extending the Tests

To add new tests:

1. Create a new test file in `tests/e2e/admin/`
2. Import test helpers from `utils/admin-test-helpers.ts`
3. Follow the existing test structure
4. Update this README with new test coverage

## Related Documentation

- [Playwright Documentation](https://playwright.dev)
- [Testing Best Practices](../../TESTING.md)
- [Backend API Documentation](../../../namy-backend/README.md)
