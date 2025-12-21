import type { ExcludedDaysAndTime } from "../admin";

export type CouponItem = {
  code: string;
  used?: boolean;
  expiresAt: string;
  usedAt?: string;
  store?: {
    name?: string;
    restrictions?: string | null;
  } | null;
  discount?: {
    title?: string;
    type?: string;
    value?: number;
    additionalRestrictions?: string[] | null;
    restrictions?: string | null;
    minPurchaseAmount?: number | null;
    maxDiscountAmount?: number | null;
    excludedDaysAndTime?: ExcludedDaysAndTime | null;
    excludedDaysOfWeek?: number[] | null;
    excludedHours?: number[] | null;
  } | null;
};

export type Coupon = {
  id: string;
  code: string;
  qrCode: string;
  url: string;
  used: boolean;
  usedAt?: string;
  valid?: string;
  expiresAt: string;
  createdAt: string;
  storeId?: string;
  discountId?: string;
  // populated client-side
  store?: {
    id?: string;
    name?: string;
    address?: string;
    city?: string;
    restrictions?: string | null;
  } | null;
  discount?: {
    id?: string;
    title?: string;
    description?: string;
    type?: string;
    value?: number;
    excludedDaysAndTime?: ExcludedDaysAndTime | null;
    excludedDaysOfWeek?: number[] | null;
    excludedHours?: number[] | null;
    restrictions?: string | null;
    additionalRestrictions?: string[] | null;
    minPurchaseAmount?: number | null;
    maxDiscountAmount?: number | null;
  } | null;
};
