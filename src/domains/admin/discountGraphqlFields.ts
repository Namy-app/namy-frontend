/**
 * Quantity / redemption limit fields on the full GraphQL `Discount` type only.
 * Do not use on `CouponDiscountInfo` (generateCoupon / myCoupons nested discount).
 *
 * Backend schema (not aliases):
 * - `maxUses` — lifetime cap across all users ("Usos máximos en total")
 * - `maxUsesPerUserPerMonth` — per-user monthly cap ("Usos máximos por mes")
 * - `monthlyRedemptionCap` — store-wide monthly redemption cap (optional admin field)
 */
export const DISCOUNT_QUANTITY_LIMIT_SELECTION = `
        maxUses
        usedCount
        maxUsesPerUserPerMonth
        monthlyRedemptionCap`;
