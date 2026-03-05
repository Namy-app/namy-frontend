/**
 * Default challenges for the Ñamy gamification system.
 *
 * Single source of truth for default challenge definitions on the frontend.
 * Mirrors the backend's default-challenges.data.ts — keep in sync if values change.
 *
 * Supported entityType values:
 *   discounts                     → awarded when a user redeems a coupon
 *   first_visit_coupon_redemption → awarded on first coupon redemption at a store
 *   reviews                       → awarded when a user leaves a review
 *   mural_posts                   → awarded when a user uploads a mural post (once/week)
 *   referrals                     → awarded when a referred user joins
 *   login_streaks                 → awarded for consecutive daily logins
 */

export interface DefaultChallenge {
  id: string;
  name: string;
  entityType: string;
  entityId: null;
  count: number;
  points: number;
  isActive: boolean;
  expiresAt: null;
}

export const DEFAULT_CHALLENGES: DefaultChallenge[] = [
  // ── Discount / coupon challenges ──────────────────────────────────────────
  {
    id: "a87c32b1-d184-4842-b7b6-6be28729331d",
    name: "Use coupon",
    entityType: "discounts",
    entityId: null,
    count: 1,
    points: 100,
    isActive: true,
    expiresAt: null,
  },

  // ── First-visit coupon redemption ─────────────────────────────────────────
  {
    id: "26199c1b-54a1-4d82-9821-0ac57b97679a",
    name: "Use coupon at a new place",
    entityType: "first_visit_coupon_redemption",
    entityId: null,
    count: 1,
    points: 25,
    isActive: true,
    expiresAt: null,
  },

  // ── Review challenges ─────────────────────────────────────────────────────
  {
    id: "2fc45512-8b9e-4fae-883b-6c67504622b0",
    name: "Leave a review",
    entityType: "reviews",
    entityId: null,
    count: 1,
    points: 40,
    isActive: true,
    expiresAt: null,
  },

  // ── Mural post challenges ─────────────────────────────────────────────────
  {
    id: "456724c3-4da4-419e-a969-9c88e2c822bd",
    name: "Upload post (once a week)",
    entityType: "mural_posts",
    entityId: null,
    count: 1,
    points: 50,
    isActive: true,
    expiresAt: null,
  },

  // ── Referral challenges ───────────────────────────────────────────────────
  {
    id: "5a43fa14-1644-48a6-b9f7-c9359f8a4e70",
    name: "Invite a friend to Ñamy",
    entityType: "referrals",
    entityId: null,
    count: 1,
    points: 75,
    isActive: true,
    expiresAt: null,
  },

  // ── Login streak challenges ───────────────────────────────────────────────
  {
    id: "1d2c4d13-58b9-41fc-9f95-41c25db6f579",
    name: "Visit Ñamy every day",
    entityType: "login_streaks",
    entityId: null,
    count: 1,
    points: 5,
    isActive: true,
    expiresAt: null,
  },
  {
    id: "ee04a953-81d3-41e6-b12a-533da2b106c9",
    name: "Enter Ñamy for 7 days in a row",
    entityType: "login_streaks",
    entityId: null,
    count: 7,
    points: 40,
    isActive: true,
    expiresAt: null,
  },
];

/** Look up a default challenge by entityType (returns the first match) */
export function getDefaultChallenge(
  entityType: string
): DefaultChallenge | undefined {
  return DEFAULT_CHALLENGES.find((c) => c.entityType === entityType);
}

/** Look up a default challenge by id */
export function getDefaultChallengeById(
  id: string
): DefaultChallenge | undefined {
  return DEFAULT_CHALLENGES.find((c) => c.id === id);
}
