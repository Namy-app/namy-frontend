import type { AvailableDaysAndTimes, Discount } from "@/domains/admin";

const ALL_WEEK_DAY_INDICES = [0, 1, 2, 3, 4, 5, 6] as const;

/** Full week, all day — default for new discounts to pass backend validation. */
export const DEFAULT_WEEK_AVAILABLE_DAYS: AvailableDaysAndTimes = {
  availableDays: ALL_WEEK_DAY_INDICES.map((dayIndex) => ({
    dayIndex,
    timeRanges: [{ start: "00:00", end: "23:59" }],
  })),
};

/** Derive exclusions from the schedule editor — never use a stale parallel array. */
export function computeExcludedDaysOfWeek(
  availableDaysAndTimes?: AvailableDaysAndTimes | null
): number[] {
  const activeDayIndices =
    availableDaysAndTimes?.availableDays?.map((d) => d.dayIndex) ?? [];
  return ALL_WEEK_DAY_INDICES.filter((day) => !activeDayIndices.includes(day));
}

export function resolveInitialAvailableDays(
  discount?: Discount
): AvailableDaysAndTimes {
  const existing = discount?.availableDaysAndTimes?.availableDays ?? [];
  if (existing.length > 0) {
    return discount!.availableDaysAndTimes!;
  }

  if (discount?.excludedDaysOfWeek?.length) {
    const excluded = new Set(discount.excludedDaysOfWeek);
    return {
      availableDays: ALL_WEEK_DAY_INDICES.filter((d) => !excluded.has(d)).map(
        (dayIndex) => ({
          dayIndex,
          timeRanges: [{ start: "00:00", end: "23:59" }],
        })
      ),
    };
  }

  return DEFAULT_WEEK_AVAILABLE_DAYS;
}
