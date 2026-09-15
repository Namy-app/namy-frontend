export interface PortalOwner {
  id: string;
  email: string;
  mustChangePassword: boolean;
}

export interface PortalStoreOption {
  id: string;
  name: string;
  city: string;
  type: string;
}

export interface PortalLoginResponse {
  tempToken: string;
  mustChangePassword: boolean;
  stores: PortalStoreOption[];
}

export interface PortalVerifyResponse {
  accessToken: string;
  mustChangePassword: boolean;
  owner: PortalOwner;
}

export interface PortalSwitchResponse {
  accessToken: string;
}

export interface PortalAuthPayload {
  accessToken: string;
  mustChangePassword: boolean;
  owner: PortalOwner;
}

export enum PortalBillingStatus {
  ACTIVE = "ACTIVE",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  GRACE_PERIOD = "GRACE_PERIOD",
  HIDDEN = "HIDDEN",
}

export enum PortalInvoiceStatus {
  PAID = "PAID",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

export interface PortalStoreBilling {
  accumulatedBalance?: number | null;
  lastBilledAt?: string | null;
  lastChargedAmount?: number | null;
}

export interface PortalStore {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  image1Url?: string | null;
  image2Url?: string | null;
  image3Url?: string | null;
  city?: string | null;
  type?: string | null;
  address?: string | null;
  price?: string | null;
  billingEnabled: boolean;
  billingStatus: PortalBillingStatus;
  accumulatedBalance?: number | null;
  billing?: PortalStoreBilling | null;
  openDays?: PortalOpenDays | null;
}

export interface PortalInvoice {
  id: string;
  storeId: string;
  month: string;
  totalRedemptions: number;
  amountCharged?: number | null;
  status: PortalInvoiceStatus;
  createdAt: string;
}

export interface PortalOwnerBilling {
  accumulatedBalance: number;
  lastBilledAt?: string | null;
  lastChargedAmount?: number | null;
  hasStripeCustomer: boolean;
}

export interface PortalOwnerInvoiceStoreBreakdown {
  storeId: string;
  storeName: string;
  redemptions: number;
  balance: number;
}

export interface PortalOwnerInvoice {
  id: string;
  month: string;
  totalRedemptions: number;
  amountCharged?: number | null;
  status: PortalInvoiceStatus;
  storeBreakdown?: PortalOwnerInvoiceStoreBreakdown[] | null;
  createdAt: string;
}

export interface PortalStoreBalance {
  storeId: string;
  storeName: string;
  accumulatedBalance: number;
  billingEnabled: boolean;
  billingStatus: PortalBillingStatus;
  redemptionsThisMonth: number;
}

export interface PortalRedemption {
  id: string;
  storeId: string;
  redeemedAt: string;
  billTotalCents?: number | null;
  discountCents?: number | null;
}

export interface PortalActiveCoupon {
  id: string;
  code: string;
  value: number;
  expiresAt: string;
  used: boolean;
  storeId: string;
  discountType?: string | null;
  discountTitle?: string | null;
}

export interface PortalDiscount {
  id: string;
  title: string;
  type: string;
  value: number;
  customText?: string | null;
  startDate: string;
  endDate: string;
}

export interface PortalOpenDay {
  day: string;
  startTime: string;
  endTime: string;
  closed?: boolean;
}

export interface PortalOpenDays {
  availableDays: PortalOpenDay[];
}

export interface UpdatePortalStoreInfoInput {
  storeId: string;
  description?: string;
  imageUrl?: string;
  image1Url?: string;
  image2Url?: string;
  image3Url?: string;
}

export interface PortalPaymentMethod {
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
}
