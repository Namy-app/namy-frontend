/**
 * Discount Utility Functions
 * Provides discount calculations based on user level
 */

import { fromZonedTime, toZonedTime } from "date-fns-tz";

/** Store schedule / availability is always evaluated in Cancún time. */
export const STORE_TIMEZONE = "America/Cancun";

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

/**
 * Time and availability validation utilities
 */

interface TimeRange {
  start: string;
  end: string;
}

interface DayAvailability {
  dayIndex: number;
  timeRanges: TimeRange[];
}

interface AvailableDaysAndTimes {
  availableDays: DayAvailability[];
}

interface Discount {
  active?: boolean;
  startDate?: string;
  endDate?: string;
  excludedDaysOfWeek?: number[];
  excludedHours?: number[];
  availableDaysAndTimes?: AvailableDaysAndTimes;
}

/**
 * Parse time string to hours and minutes
 */
export function parseTime(timeString: string): {
  hours: number;
  minutes: number;
} {
  const [hoursStr, minutesStr] = timeString.split(":");
  return {
    hours: Number.parseInt(hoursStr || "0", 10),
    minutes: Number.parseInt(minutesStr || "0", 10),
  };
}

/**
 * Get current day index in store timezone (0 = Monday, 6 = Sunday)
 */
export function getCurrentDayIndex(): number {
  const now = toZonedTime(new Date(), STORE_TIMEZONE);
  return (now.getDay() + 6) % 7; // Convert from Sunday=0 to Monday=0
}

/**
 * Check if current time is within a time range
 */
export function isWithinTimeRange(
  currentHour: number,
  currentMinute: number,
  timeRange: TimeRange
): boolean {
  const start = parseTime(timeRange.start);
  const end = parseTime(timeRange.end);

  const currentMinutes = currentHour * 60 + currentMinute;
  const startMinutes = start.hours * 60 + start.minutes;
  const endMinutes = end.hours * 60 + end.minutes;

  if (endMinutes < startMinutes) {
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

/**
 * Check if discount is currently valid based on date and time restrictions
 * (schedule day/hour evaluated in America/Cancun, not device local time)
 */
export function isDiscountValid(discount?: Discount | null): boolean {
  if (!discount?.active) {
    return false;
  }

  const absoluteNow = new Date();
  const now = toZonedTime(absoluteNow, STORE_TIMEZONE);

  // Check date range (ISO instants — compare in absolute time)
  if (discount.endDate && new Date(discount.endDate) < absoluteNow) {
    return false;
  }

  if (discount.startDate && new Date(discount.startDate) > absoluteNow) {
    return false;
  }

  // excludedDaysOfWeek uses Sun=0 (JS default) — Cancún weekday
  if (discount.excludedDaysOfWeek?.length) {
    if (discount.excludedDaysOfWeek.includes(now.getDay())) {
      return false;
    }
  }

  // excludedHours uses 0-23 — Cancún hour
  if (discount.excludedHours?.length) {
    if (discount.excludedHours.includes(now.getHours())) {
      return false;
    }
  }

  // Check day/time availability
  if (discount.availableDaysAndTimes) {
    const dayIndex = getCurrentDayIndex();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const { availableDays } = discount.availableDaysAndTimes;

    const dayAvailability = availableDays.find(
      (day) => day.dayIndex === dayIndex
    );
    if (!dayAvailability) {
      return false;
    }

    const hasAvailableTimeRange = dayAvailability.timeRanges.some((timeRange) =>
      isWithinTimeRange(currentHour, currentMinute, timeRange)
    );

    if (!hasAvailableTimeRange) {
      return false;
    }
  }

  return true;
}

/**
 * Calculate the next available time for a discount.
 * Builds the target in Cancún wall-clock, then returns a UTC instant via fromZonedTime.
 */
export function calculateNextAvailableTime(
  discount?: Discount | null
): Date | null {
  if (!discount?.active || !discount.availableDaysAndTimes) {
    return null;
  }

  const now = toZonedTime(new Date(), STORE_TIMEZONE);
  const { availableDays } = discount.availableDaysAndTimes;
  const currentDayIndex = getCurrentDayIndex();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Check if there's a later time range today
  const todayAvailability = availableDays.find(
    (day) => day.dayIndex === currentDayIndex
  );

  if (todayAvailability) {
    for (const timeRange of todayAvailability.timeRanges) {
      const start = parseTime(timeRange.start);

      if (
        currentHour < start.hours ||
        (currentHour === start.hours && currentMinute < start.minutes)
      ) {
        const nextWallClock = new Date(now);
        nextWallClock.setHours(start.hours, start.minutes, 0, 0);
        return fromZonedTime(nextWallClock, STORE_TIMEZONE);
      }
    }
  }

  // Look for next available day (check next 7 days)
  for (let i = 1; i <= 7; i++) {
    const checkDayIndex = (currentDayIndex + i) % 7;
    const dayAvailability = availableDays.find(
      (day) => day.dayIndex === checkDayIndex
    );

    if (dayAvailability && dayAvailability.timeRanges.length > 0) {
      const firstTimeRange = dayAvailability.timeRanges[0];
      if (!firstTimeRange) {
        continue;
      }

      const start = parseTime(firstTimeRange.start);
      const nextWallClock = new Date(now);
      nextWallClock.setDate(now.getDate() + i);
      nextWallClock.setHours(start.hours, start.minutes, 0, 0);
      return fromZonedTime(nextWallClock, STORE_TIMEZONE);
    }
  }

  return null;
}

/**
 * Format time difference as countdown string
 */
export function formatCountdown(diffMs: number): string {
  if (diffMs <= 0) {
    return "Disponible ahora";
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}
