// Wallet Types
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  isActive: boolean;
  frozenAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletBalance {
  balance: number;
  frozenAmount: number;
  availableBalance: number;
  currency: string;
}

// Transaction Types
export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
  REFUND = "refund",
  PURCHASE = "purchase",
  REWARD = "reward",
  BONUS = "bonus",
  TRANSFER_IN = "transfer_in",
  TRANSFER_OUT = "transfer_out",
  COMMISSION = "commission",
  PENALTY = "penalty",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REVERSED = "reversed",
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  currency: string;
  description?: string;
  metadata?: Record<string, unknown>;
  referenceId?: string;
  referenceType?: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedTransactions {
  data: WalletTransaction[];
  paginationInfo: PaginationInfo;
}

// Payment Types
export enum PaymentIntentStatus {
  REQUIRES_PAYMENT_METHOD = "requires_payment_method",
  REQUIRES_CONFIRMATION = "requires_confirmation",
  REQUIRES_ACTION = "requires_action",
  PROCESSING = "processing",
  REQUIRES_CAPTURE = "requires_capture",
  CANCELED = "canceled",
  SUCCEEDED = "succeeded",
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: PaymentIntentStatus;
  description?: string;
}

export interface CheckoutSession {
  id: string;
  url: string;
  amount: number;
  currency: string;
  status: string;
}

// Input Types
export interface CreateWalletInput {
  userId: string;
  currency?: string;
}

export interface GetWalletInput {
  id?: string;
  userId?: string;
}

export interface GetTransactionsInput {
  walletId: string;
  limit?: number;
  offset?: number;
  type?: TransactionType;
  status?: TransactionStatus;
}

export interface CreatePaymentIntentInput {
  amount: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateCheckoutSessionInput {
  amount: number;
  successUrl: string;
  cancelUrl: string;
  currency?: string;
  description?: string;
}

export interface DepositToWalletInput {
  walletId: string;
  amount: number;
  description?: string;
  referenceId?: string;
  referenceType?: string;
}

export interface WithdrawFromWalletInput {
  walletId: string;
  amount: number;
  description?: string;
}

export interface SpendFromWalletInput {
  walletId: string;
  amount: number;
  description?: string;
  referenceId?: string;
  referenceType?: string;
  metadata?: Record<string, unknown>;
}

// Subscription types
export enum SubscriptionInterval {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  PAUSED = "paused",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  PAST_DUE = "past_due",
}

export interface Subscription {
  id: string;
  walletId: string;
  name: string;
  amount: number;
  currency: string;
  interval: SubscriptionInterval;
  intervalCount: number;
  status: SubscriptionStatus;
  startDate: string;
  nextBillingDate: string;
  endDate?: string;
  trialEndDate?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionBillingHistory {
  id: string;
  subscriptionId: string;
  transactionId?: string;
  amount: number;
  status: string;
  billingDate: string;
  paidAt?: string;
  failureReason?: string;
  retryCount: number;
  createdAt: string;
}

export interface CreateSubscriptionInput {
  walletId: string;
  name: string;
  amount: number;
  currency?: string;
  interval: SubscriptionInterval;
  intervalCount?: number;
  startDate?: string;
  trialEndDate?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface CancelSubscriptionInput {
  subscriptionId: string;
  reason?: string;
}
