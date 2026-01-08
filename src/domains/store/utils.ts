import type { Discount } from "@/domains/admin/types";
import { convertTo12Hour } from "@/lib/date-time-utils";

export interface RestrictionItem {
  key: string;
  icon: string;
  text: string;
}

/**
 * Generates a list of discount restrictions with icons based on the discount properties
 * @param discount - The discount object from DiscountsResponse
 * @returns Array of restriction items with icons and text
 */
export const getDiscountRestrictions = (
  discount?: Discount
): RestrictionItem[] => {
  const restrictions: RestrictionItem[] = [
    {
      key: "discount-0",
      icon: "❌",
      text: "Muestra tu código QR antes de pagar",
    },
  ];

  if (!discount) {
    return restrictions;
  }

  let counter = 0;

  const generateKey = (): string => {
    counter += 1;
    return `discount-${counter}`;
  };

  // Add custom additional restrictions first
  if (
    discount.additionalRestrictions &&
    discount.additionalRestrictions.length > 0
  ) {
    discount.additionalRestrictions.forEach((restriction) => {
      restrictions.push({
        key: generateKey(),
        icon: "📋",
        text: restriction,
      });
    });
  }

  // Minimum purchase amount
  if (discount.minPurchaseAmount && discount.minPurchaseAmount > 0) {
    restrictions.push({
      key: generateKey(),
      icon: "💰",
      text: `Compra mínima de $${discount.minPurchaseAmount.toFixed(2)}`,
    });
  }

  // Maximum discount amount (for percentage discounts)
  if (discount.maxDiscountAmount && discount.maxDiscountAmount > 0) {
    restrictions.push({
      key: generateKey(),
      icon: "🔝",
      text: `Descuento máximo de $${discount.maxDiscountAmount.toFixed(2)}`,
    });
  }

  // Maximum uses per user per month
  if (discount.maxUsesPerUserPerMonth && discount.maxUsesPerUserPerMonth > 0) {
    restrictions.push({
      key: generateKey(),
      icon: "👤",
      text: `Máximo ${discount.maxUsesPerUserPerMonth} ${
        discount.maxUsesPerUserPerMonth === 1 ? "uso" : "usos"
      } por usuario al mes`,
    });
  }

  // Monthly redemption cap (total uses across all users)
  if (discount.monthlyRedemptionCap && discount.monthlyRedemptionCap > 0) {
    restrictions.push({
      key: generateKey(),
      icon: "📊",
      text: `Límite mensual de ${discount.monthlyRedemptionCap} ${
        discount.monthlyRedemptionCap === 1 ? "canje" : "canjes"
      }`,
    });
  }

  // Total max uses
  if (discount.maxUses && discount.maxUses > 0) {
    const remaining = discount.maxUses - discount.usedCount;
    restrictions.push({
      key: generateKey(),
      icon: "🎫",
      text: `${remaining} ${remaining === 1 ? "uso disponible" : "usos disponibles"} de ${discount.maxUses}`,
    });
  }

  // Excluded days of week
  if (discount.excludedDaysOfWeek && discount.excludedDaysOfWeek.length > 0) {
    const dayNames = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const excludedDays = discount.excludedDaysOfWeek
      .map((dayIndex) => dayNames[dayIndex])
      .filter(Boolean);

    if (excludedDays.length > 0) {
      restrictions.push({
        key: generateKey(),
        icon: "🚫",
        text: `No válido los ${excludedDays.join(", ")}`,
      });
    }
  }

  // Excluded hours
  if (discount.excludedHours && discount.excludedHours.length > 0) {
    const sortedHours = [...discount.excludedHours].sort((a, b) => a - b);
    const hourRanges = getHourRanges(sortedHours);

    if (hourRanges.length > 0) {
      restrictions.push({
        key: generateKey(),
        icon: "⏰",
        text: `No válido de ${hourRanges.join(", ")}`,
      });
    }
  }

  // Available days and times
  if (
    discount.availableDaysAndTimes?.availableDays &&
    discount.availableDaysAndTimes.availableDays.length > 0
  ) {
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const availableDays = discount.availableDaysAndTimes.availableDays
      .map(
        (day) =>
          `${dayNames[day.dayIndex]} (${day.timeRanges
            .map((tr) => {
              return `${convertTo12Hour(tr.start, true)} - ${convertTo12Hour(tr.end, true)}`;
            })
            .join(", ")})`
      )
      .filter(Boolean);

    if (availableDays.length > 0) {
      restrictions.push({
        key: generateKey(),
        icon: "📅",
        text: `Disponible solo ${availableDays.join(", ")}`,
      });
    }
  }

  // Validity period
  const startDate = new Date(discount.startDate);
  const endDate = new Date(discount.endDate);
  const now = new Date();

  if (startDate > now) {
    restrictions.push({
      key: generateKey(),
      icon: "🕐",
      text: `Válido desde ${startDate.toLocaleDateString("es-ES")}`,
    });
  }

  restrictions.push({
    key: generateKey(),
    icon: "📆",
    text: `Válido hasta ${endDate.toLocaleDateString("es-ES")}`,
  });

  return restrictions;
};

/**
 * Helper function to convert array of excluded hours into readable ranges
 * @param hours - Sorted array of excluded hours (0-23)
 * @returns Array of hour range strings
 */
function getHourRanges(hours: number[]): string[] {
  if (hours.length === 0) {
    return [];
  }

  const ranges: string[] = [];
  let rangeStart = hours[0];
  let rangeEnd = hours[0];

  for (let i = 1; i <= hours.length; i++) {
    if (i < hours.length && rangeEnd && hours[i] === rangeEnd + 1) {
      rangeEnd = hours[i];
    } else {
      if (rangeStart && rangeEnd && rangeStart === rangeEnd) {
        ranges.push(`${rangeStart}:00-${rangeStart + 1}:00`);
      } else {
        ranges.push(
          rangeEnd ? `${rangeStart}:00-${rangeEnd + 1}:00` : `${rangeStart}:00`
        );
      }
      if (i < hours.length) {
        rangeStart = hours[i];
        rangeEnd = hours[i];
      }
    }
  }

  return ranges;
}
