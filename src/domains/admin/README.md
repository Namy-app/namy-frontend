# Admin Dashboard

Complete admin functionality for managing stores on the Ñamy platform.

## Features

✅ **Role-Based Access Control**

- Only users with `admin` or `super_admin` role can access
- Automatic redirect for unauthorized users
- Admin button visible in user profile page

✅ **Store Management**

- Create new stores with comprehensive form
- View store statistics and analytics
- List all stores with filtering
- Update and delete stores
- Toggle store active status
- Secure PIN generation for coupon redemption

✅ **Dashboard Analytics**

- Total stores count
- Active vs inactive stores
- Product vs service stores breakdown
- Price range distribution
- Growth metrics

## Setup

### 1. Assign Admin Role to User

Admin access is controlled by the `role` field in the User table. To make a user an admin, update their role in the database:

```sql
-- Make a user an admin
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';

-- Make a user a super admin
UPDATE users SET role = 'super_admin' WHERE email = 'superadmin@example.com';
```

### 2. Access Admin Dashboard

1. Login to the platform
2. Go to `/user` page
3. Click on "🔑 Admin Dashboard" button (only visible to admins)
4. You'll be redirected to `/admin/stores`

## Usage

### Creating a Store

1. Navigate to Admin Dashboard (`/admin/stores`)
2. Click "Create Store" button
3. Fill in the form with store details:
   - **Basic Information**: Name, description, type, price range
   - **Category**: Category ID and optional sub-category
   - **Location**: City, address, lat/lng coordinates, phone number
   - **Additional**: Website URL, tags, active status

4. Click "Create Store"
5. **IMPORTANT**: Save the generated PIN immediately! You won't be able to see it again.
6. The PIN is used by the store to redeem customer coupons

### Store PIN

When you create a store, the system generates a secure 6-digit PIN. This PIN is:

- Hashed in the database using bcrypt
- Shown only once after creation
- Required by the store to redeem customer coupons
- Cannot be retrieved later (only regenerated)

**⚠️ CRITICAL**: Make sure to save the PIN and share it securely with the store owner.

### Regenerating a PIN

If a store loses their PIN, you can regenerate it:

1. Update the store with `regeneratePin: true`
2. A new PIN will be generated and returned
3. The old PIN will be invalidated

## API Reference

### GraphQL Mutations

**Create Store** (Admin Only)

```graphql
mutation CreateStore($input: CreateStoreInput!) {
  createStore(input: $input) {
    store {
      id
      name
      # ... other fields
    }
    plainPin # ⚠️ Save this immediately!
    message
  }
}
```

**Update Store** (Admin Only)

```graphql
mutation UpdateStore($id: ID!, $input: UpdateStoreInput!) {
  updateStore(id: $id, input: $input) {
    store {
      id
      name
      # ... other fields
    }
    plainPin # Only returned if regeneratePin: true
    message
  }
}
```

**Delete Store** (Admin Only)

```graphql
mutation DeleteStore($id: ID!) {
  deleteStore(id: $id) # Returns true/false
}
```

**Toggle Store Active Status** (Admin Only)

```graphql
mutation ToggleStoreActive($id: ID!) {
  toggleStoreActive(id: $id) {
    id
    name
    active
  }
}
```

### GraphQL Queries

**Get Store Statistics** (Admin Only)

```graphql
query GetStoreStatistics($filters: StoreFiltersInput) {
  storeStatistics(filters: $filters) {
    total
    active
    inactive
    byType {
      product
      service
    }
    byPriceRange {
      budget
      moderate
      expensive
      luxury
    }
  }
}
```

**Get All Stores**

```graphql
query GetAllStores($filters: StoreFiltersInput, $pagination: PaginationInput) {
  stores(filters: $filters, pagination: $pagination) {
    data {
      id
      name
      # ... other fields
    }
    paginationInfo {
      total
      page
      pageSize
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
}
```

## React Hooks

### Mutations

```typescript
import {
  useCreateStore,
  useUpdateStore,
  useDeleteStore,
  useToggleStoreActive,
} from "@/domains/admin/hooks";

// Create store
const createStore = useCreateStore();
await createStore.mutateAsync(storeData);

// Update store
const updateStore = useUpdateStore();
await updateStore.mutateAsync({ id, input: updateData });

// Delete store
const deleteStore = useDeleteStore();
await deleteStore.mutateAsync(storeId);

// Toggle active status
const toggleActive = useToggleStoreActive();
await toggleActive.mutateAsync(storeId);
```

### Queries

```typescript
import { useStoreStatistics, useStores, useStore } from "@/domains/admin/hooks";

// Get statistics
const { data: stats } = useStoreStatistics(filters);

// Get all stores
const { data: storesData } = useStores(filters, pagination);

// Get single store
const { data: store } = useStore(storeId);
```

## Types

### Enums

```typescript
enum StoreType {
  PRODUCT = "product",
  SERVICE = "service",
}

enum PriceRange {
  BUDGET = "budget",
  MODERATE = "moderate",
  EXPENSIVE = "expensive",
  LUXURY = "luxury",
}

enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}
```

### Interfaces

```typescript
interface CreateStoreInput {
  name: string; // Required
  description?: string;
  categoryId: string; // Required
  subCategory?: string;
  type: StoreType; // Required
  city: string; // Required
  address: string; // Required
  lat?: number;
  lng?: number;
  phoneNumber?: string;
  price: PriceRange; // Required
  active: boolean; // Required
  url?: string;
  openDays?: OpenDaysStructure;
  tags?: string;
  additionalInfo?: Record<string, unknown>;
}
```

## Security

### Backend Protection

All admin endpoints are protected with:

```typescript
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
```

This ensures:

- User must be authenticated (JWT token)
- User must have admin or super_admin role
- Unauthorized requests return 403 Forbidden

### Frontend Protection

The admin dashboard checks user role and:

- Shows access denied message for non-admins
- Redirects unauthenticated users to login
- Only displays admin UI elements to authorized users

## Mobile Support

The admin dashboard is fully responsive:

- Mobile-friendly forms with touch optimization
- Responsive tables that adapt to screen size
- Modal overlays that work on all devices
- Touch-friendly buttons and inputs

## Best Practices

1. **PIN Management**
   - Always save the PIN immediately after creation
   - Share PINs securely (encrypted communication)
   - Consider implementing a PIN management system for stores

2. **Store Creation**
   - Fill in all available information for better discoverability
   - Add accurate lat/lng for map features
   - Use descriptive tags for search optimization
   - Keep store information up to date

3. **Access Control**
   - Regularly audit admin users
   - Use `super_admin` role sparingly
   - Consider implementing audit logs for admin actions

## Troubleshooting

### "Access Denied" Error

- Verify your user role in the database
- Ensure you're logged in
- Check that your JWT token is valid

### PIN Not Saving

- Make sure to copy the PIN immediately after store creation
- PIN is only shown once for security reasons
- Use `regeneratePin: true` to create a new one if lost

### GraphQL Errors

- Ensure you have a valid authentication token
- Check that all required fields are provided
- Verify field types match the schema

## Future Enhancements

- [ ] Bulk store import from CSV
- [ ] Store image upload
- [ ] Advanced analytics dashboard
- [ ] Audit log for admin actions
- [ ] Store performance metrics
- [ ] Admin user management
- [ ] Email notifications for store events
