// `useStore` was previously used to fetch store metadata by ID.
// Redeem flows should use `GET_COUPON_REDEEM_DETAILS_QUERY` instead
// which returns nested `store` and `discount` objects with the coupon.
//
// This stub remains to prevent accidental import breakages; it throws
// at runtime with guidance to migrate code.
export function useStore(): never {
  throw new Error(
    "useStore is removed for redeem flows. Use coupon redeem payloads (GET_COUPON_REDEEM_DETAILS_QUERY) or implement a store-specific hook if needed."
  );
}
