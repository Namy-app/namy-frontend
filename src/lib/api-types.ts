// Common API response types based on namy-api GraphQL schema

export interface User {
  id: string;
  email: string;
  phone?: string;
  displayName?: string;
  avatarUrl?: string;
  role: string;
  city?: string;
  country?: string;
  verified: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastSeen?: string;
  referralCode?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginInput {
  emailOrUsername: string;
  password: string;
}

export interface SignupInput {
  email: string;
  username?: string;
  password: string;
  displayName?: string;
  phone?: string;
  city?: string;
  country?: string;
  referralCode?: string;
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  logo?: string;
  coverImage?: string;
  isActive: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Discount {
  id: string;
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  storeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}
