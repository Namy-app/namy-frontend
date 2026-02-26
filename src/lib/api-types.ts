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
  isPremium: boolean;
  premiumStartDate?: string;
  premiumEndDate?: string;
  autoRenew: boolean;
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
  email: string;
  password: string;
}

export interface SignupInput {
  email: string;
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
  imageUrl?: string;
  image1Url?: string;
  image2Url?: string;
  image3Url?: string;
  lat?: number;
  lng?: number;
  placeId?: string;
  distance?: number;
  isActive: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  type?: "PRODUCT" | "SERVICE";
  categoryId?: string;
  subCategory?: string;
  catId?: string;
  subCatId?: string;
  category?: { id: string; name: string };
  subcategory?: { id: string; name: string };
  averageRating?: number;
  reviewCounter?: number;
  url?: string;
  city?: string;
  openDays?: Record<string, unknown>;
  additionalInfo?: Record<string, unknown>;
  discountAvailabilityStatus?: "available" | "soon" | "unavailable";
  discountAvailabilityText?: string;
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
  availableDaysAndTimes?: Record<string, unknown>;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

// ============ MURAL ============

export type PostBadge = "top_poster" | "mas_likes";
export type MuralPostStatus = "pending" | "approved" | "rejected";

export interface MuralPostUser {
  id: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface MuralPostStore {
  id: string;
  name: string;
  address?: string;
}

export interface MuralPost {
  id: string;
  userId: string;
  storeId: string;
  imageUrl: string;
  badge?: PostBadge;
  likes: number;
  points: number;
  status: MuralPostStatus;
  rejectionNote?: string;
  createdAt: string;
  updatedAt: string;
  user?: MuralPostUser;
  store?: MuralPostStore;
  commentsCount?: number;
  isLikedByMe?: boolean;
}

export interface MuralComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: MuralPostUser;
}

export interface MuralFeedResponse {
  posts: MuralPost[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface MuralCommentsResponse {
  comments: MuralComment[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface MuralFeedInput {
  page?: number;
  pageSize?: number;
  storeId?: string;
  userId?: string;
  city?: string;
  search?: string;
}

export interface CreateMuralPostInput {
  storeId: string;
  imageUrl: string;
}

export interface CreateMuralCommentInput {
  postId: string;
  content: string;
}

export interface ChallengeInfo {
  id: string;
  name: string;
  entityType: string;
  count: number;
  points: number;
  isActive: boolean;
  expiresAt?: string;
}

export interface UserChallenge {
  id: string;
  challengeId: string;
  status: "on-going" | "awarded" | "expired" | "failed";
  count: number;
  challenge?: ChallengeInfo;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  city?: string;
  balance: number;
  isCurrentUser: boolean;
}
