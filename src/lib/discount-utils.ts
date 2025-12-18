/**
 * Discount Utility Functions
 * Provides discount calculations based on user level
 */

export enum UserLevel {
  LEVEL_1 = 1, // New User - 10% discount
  LEVEL_2 = 2, // Active User - 12% discount
  LEVEL_3 = 3, // VIP User - 15% discount
}

export const LEVEL_DISCOUNTS: Record<UserLevel, number> = {
  [UserLevel.LEVEL_1]: 10,
  [UserLevel.LEVEL_2]: 12,
  [UserLevel.LEVEL_3]: 15,
} as const;

export const LEVEL_NAMES: Record<UserLevel, string> = {
  [UserLevel.LEVEL_1]: "New User",
  [UserLevel.LEVEL_2]: "Active User",
  [UserLevel.LEVEL_3]: "VIP User",
} as const;

/**
 * Get discount percentage for a user level
 * Premium users always get the highest discount (15%)
 * @param level - User level (1, 2, or 3)
 * @param isPremium - Whether user is premium
 * @returns Discount percentage
 */
export function getDiscountPercentage(
  level: UserLevel,
  isPremium: boolean = false
): number {
  // Premium users always get the highest discount (15%)
  if (isPremium) {
    return 15;
  }
  return LEVEL_DISCOUNTS[level] || LEVEL_DISCOUNTS[UserLevel.LEVEL_1];
}

/**
 * Get level name for display
 * Premium users display as "Premium Member"
 * @param level - User level (1, 2, or 3)
 * @param isPremium - Whether user is premium
 * @returns Level name
 */
export function getLevelName(
  level: UserLevel,
  isPremium: boolean = false
): string {
  if (isPremium) {
    return "Premium Member";
  }
  return LEVEL_NAMES[level] || LEVEL_NAMES[UserLevel.LEVEL_1];
}

/**
 * Calculate discount amount for a given price and level
 * @param price - Original price
 * @param level - User level
 * @param isPremium - Whether user is premium
 * @returns Discount amount
 */
export function calculateDiscount(
  price: number,
  level: UserLevel,
  isPremium: boolean = false
): number {
  const discountPercentage = getDiscountPercentage(level, isPremium);
  return (price * discountPercentage) / 100;
}

/**
 * Calculate final price after discount
 * @param price - Original price
 * @param level - User level
 * @param isPremium - Whether user is premium
 * @returns Final price after discount
 */
export function calculateFinalPrice(
  price: number,
  level: UserLevel,
  isPremium: boolean = false
): number {
  return price - calculateDiscount(price, level, isPremium);
}

/**
 * Format discount display
 * @param level - User level
 * @param isPremium - Whether user is premium
 * @returns Formatted string showing discount
 */
export function formatDiscount(
  level: UserLevel,
  isPremium: boolean = false
): string {
  const discountPercentage = getDiscountPercentage(level, isPremium);
  return `${discountPercentage}% off`;
}

const formatHour = (h: number): string => {
  if (h === 0) {
    return "12AM";
  }
  if (h === 12) {
    return "12PM";
  }
  if (h < 12) {
    return `${h}AM`;
  }
  return `${h - 12}PM`;
};

export function displayExcludedHours(excludedHours: number[]): string {
  if (excludedHours.length === 0) {
    return "No excluded hours";
  }

  if (excludedHours[0] && excludedHours[1]) {
    return `Between ${formatHour(excludedHours[0])} and ${formatHour(excludedHours[1])}`;
  }

  if (excludedHours[0]) {
    return `After ${formatHour(excludedHours[0])}`;
  }

  if (excludedHours[1]) {
    return `Before ${formatHour(excludedHours[1])}`;
  }

  return "--";
}
