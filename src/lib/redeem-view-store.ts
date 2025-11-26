// Simple client-side global store for passing coupon view data between pages.
// This avoids putting coupon data or credentials in the URL.

import type { DecodedCouponData } from "./coupon-decoder";

const STORAGE_KEY = "namy:redeemViewData";

let _viewData: DecodedCouponData | null = null;

type StoredShape = {
  expiresAt: number; // ms unix
  data: DecodedCouponData;
};

function readFromSession(): DecodedCouponData | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed: StoredShape = JSON.parse(raw);
    if (!parsed || !parsed.data) {
      return null;
    }
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.data;
  } catch (_err) {
    // if parsing fails, clear the key
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (_) {
      // ignore
    }
    return null;
  }
}

export function setRedeemViewData(
  data: DecodedCouponData,
  ttlSeconds = 300
): void {
  _viewData = data;
  try {
    const shape: StoredShape = {
      expiresAt: Date.now() + ttlSeconds * 1000,
      data,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(shape));
  } catch (_err) {
    // ignore sessionStorage errors (e.g., private mode)
  }
}

export function getRedeemViewData(): DecodedCouponData | null {
  if (_viewData) {
    return _viewData;
  }
  const fromSession = readFromSession();
  if (fromSession) {
    _viewData = fromSession;
    // keep session copy until explicitly cleared or TTL expires
    return _viewData;
  }
  return null;
}

export function clearRedeemViewData(): void {
  _viewData = null;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (_) {
    // ignore
  }
}
