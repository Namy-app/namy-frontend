// ==================== Enums ====================

export enum StoreType {
  PRODUCT = "PRODUCT",
  SERVICE = "SERVICE",
}

export enum PriceRange {
  BUDGET = "BUDGET",
  MODERATE = "MODERATE",
  EXPENSIVE = "EXPENSIVE",
  LUXURY = "LUXURY",
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

// ==================== Interfaces ====================

export interface OpenDay {
  day: string;
  startTime: string;
  endTime: string;
  closed?: boolean;
}

export interface OpenDaysStructure {
  availableDays: OpenDay[];
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  categoryId: string;
  subCategory?: string;
  type: StoreType;
  city: string;
  address: string;
  lat?: number;
  lng?: number;
  phoneNumber?: string;
  price: PriceRange;
  active: boolean;
  url?: string;
  openDays?: OpenDaysStructure;
  tags?: string;
  averageRating: number;
  reviewCounter: number;
  additionalInfo?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface StoreCreationResponse {
  store: Store;
  plainPin: string;
  message: string;
}

export interface StoreUpdateResponse {
  store: Store;
  plainPin?: string;
  message: string;
}

export interface StoreStatistics {
  total: number;
  active: number;
  inactive: number;
  byType: {
    product: number;
    service: number;
  };
  byPriceRange: {
    budget: number;
    moderate: number;
    expensive: number;
    luxury: number;
  };
}

export interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface StoresResponse {
  data: Store[];
  paginationInfo: PaginationInfo;
}

// ==================== Input Types ====================

export interface CreateStoreInput {
  name: string;
  description?: string;
  categoryId: string;
  subCategory?: string;
  type: StoreType;
  city: string;
  address: string;
  lat?: number;
  lng?: number;
  phoneNumber?: string;
  price: PriceRange;
  active: boolean;
  url?: string;
  openDays?: OpenDaysStructure;
  tags?: string;
  additionalInfo?: Record<string, unknown>;
}

export interface UpdateStoreInput {
  name?: string;
  description?: string;
  categoryId?: string;
  subCategory?: string;
  type?: StoreType;
  city?: string;
  address?: string;
  lat?: number;
  lng?: number;
  phoneNumber?: string;
  price?: PriceRange;
  active?: boolean;
  url?: string;
  openDays?: OpenDaysStructure;
  tags?: string;
  additionalInfo?: Record<string, unknown>;
  regeneratePin?: boolean;
}

export interface StoreFiltersInput {
  name?: string;
  city?: string;
  categoryId?: string;
  subCategory?: string;
  type?: StoreType;
  price?: PriceRange;
  active?: boolean | null;
  search?: string;
}

export interface PaginationInput {
  first?: number;
  after?: string;
  page?: number;
}

// ==================== Discount Types ====================

export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED_AMOUNT = "FIXED_AMOUNT",
}

export interface Discount {
  id: string;
  storeId: string;
  title: string;
  description?: string;
  type: DiscountType;
  value: number;
  code?: string;
  startDate: string;
  endDate: string;
  active: boolean;
  maxUses?: number;
  usedCount: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  excludedDaysOfWeek: number[];
  excludedHours: number[];
  maxUsesPerUserPerMonth?: number;
  monthlyRedemptionCap?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiscountsResponse {
  data: Discount[];
  paginationInfo: PaginationInfo;
}

export interface CreateDiscountInput {
  storeId: string;
  title: string;
  description?: string;
  type: DiscountType;
  value: number;
  code?: string;
  startDate: string;
  endDate: string;
  active: boolean;
  maxUses?: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  excludedDaysOfWeek?: number[];
  excludedHours?: number[];
  maxUsesPerUserPerMonth?: number;
  monthlyRedemptionCap?: number;
}

export interface UpdateDiscountInput {
  title?: string;
  description?: string;
  type?: DiscountType;
  value?: number;
  code?: string;
  startDate?: string;
  endDate?: string;
  active?: boolean;
  maxUses?: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  excludedDaysOfWeek?: number[];
  excludedHours?: number[];
  maxUsesPerUserPerMonth?: number;
  monthlyRedemptionCap?: number;
}

export interface DiscountFiltersInput {
  storeId?: string | null;
  active?: boolean;
  type?: DiscountType;
}

// ==================== Coupon Types ====================

export interface Coupon {
  id: string;
  userId: string;
  discountId: string;
  storeId: string;
  code: string;
  qrCode: string;
  used: boolean;
  usedAt?: string;
  createdAt: string;
  expiresAt: string;
}

export interface CouponsResponse {
  data: Coupon[];
  paginationInfo: PaginationInfo;
}

export interface CouponFiltersInput {
  storeId?: string;
  userId?: string;
  discountId?: string;
  used?: boolean;
}

// ==================== Catalog Types ====================

export interface Catalog {
  id: string;
  storeId: string;
  name: string;
}

export interface CatalogItem {
  id: string;
  catalogId: string;
  name: string;
  url: string;
}

export interface CreateCatalogInput {
  storeId: string;
  name: string;
}

export interface CreateCatalogItemInput {
  catalogId: string;
  name: string;
  url: string;
}

// ==================== User Management Types ====================

export interface User {
  id: string;
  email: string;
  phone?: string;
  displayName?: string;
  avatarUrl?: string;
  role: UserRole;
  city?: string;
  country?: string;
  verified: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastSeen?: string;
  referralCode?: string;
}

export interface UsersResponse {
  data: User[];
  paginationInfo: PaginationInfo;
}

export interface CouponStoreInfo {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  phoneNumber?: string;
  averageRating?: number;
  reviewCounter?: number;
}

export interface CouponDiscountInfo {
  id: string;
  title: string;
  description?: string;
  type: string;
  value: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
}

export interface UserCoupon {
  id: string;
  code: string;
  qrCode: string;
  url: string;
  used: boolean;
  usedAt?: string;
  expiresAt: string;
  createdAt: string;
  storeId: string;
  discountId: string;
  store?: CouponStoreInfo;
  discount?: CouponDiscountInfo;
}

export interface CouponRedemption {
  id: string;
  couponId: string;
  userId: string;
  storeId: string;
  redeemedAt: string;
  billTotalCents?: number;
  discountCents?: number;
  pointsEarned?: number;
  comment?: string;
  coupon?: {
    id: string;
    code: string;
    used: boolean;
    usedAt?: string;
    expiresAt: string;
    createdAt: string;
    store?: {
      id: string;
      name: string;
      city?: string;
    };
    discount?: {
      id: string;
      title: string;
      type: string;
      value: number;
    };
  };
}

export interface UserDetailsWithActivity {
  id: string;
  email: string;
  phone?: string;
  displayName?: string;
  avatarUrl?: string;
  role: UserRole;
  city?: string;
  country?: string;
  verified: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastSeen?: string;
  referralCode?: string;
  level: number;
  monthlyUsageCount: number;
  totalCouponUsageCount: number;
  coupons: UserCoupon[];
  redemptions: CouponRedemption[];
  totalCoupons: number;
  totalRedemptions: number;
}
