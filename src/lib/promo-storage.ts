"use client";

import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

import type { PromoBannerData } from "@/app/explore/components/PromoBanner";

const DISMISSED_KEY = "namy_dismissed_promos";
const PENDING_PROMO_KEY = "namy_pending_promo";

// ---------------------------------------------------------------------------
// Low-level cross-platform storage (mirrors capacitorStorage)
// ---------------------------------------------------------------------------

async function storageGet(key: string): Promise<string | null> {
  if (Capacitor.isNativePlatform()) {
    const { value } = await Preferences.get({ key });
    return value;
  }
  return localStorage.getItem(key);
}

async function storageSet(key: string, value: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await Preferences.set({ key, value });
  } else {
    localStorage.setItem(key, value);
  }
}

async function storageRemove(key: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await Preferences.remove({ key });
  } else {
    localStorage.removeItem(key);
  }
}

// ---------------------------------------------------------------------------
// Dismissed promo IDs (Set<string> serialised as JSON array)
// ---------------------------------------------------------------------------

export async function getDismissedPromoIds(): Promise<Set<string>> {
  try {
    const raw = await storageGet(DISMISSED_KEY);
    if (!raw) {return new Set();}
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {return new Set();}
    return new Set(parsed.filter((v): v is string => typeof v === "string"));
  } catch {
    return new Set();
  }
}

export async function markPromoAsDismissed(promoId: string): Promise<void> {
  const ids = await getDismissedPromoIds();
  ids.add(promoId);
  // Keep at most 50 entries to prevent unbounded growth
  const trimmed = Array.from(ids).slice(-50);
  await storageSet(DISMISSED_KEY, JSON.stringify(trimmed));
}

export async function isPromoDismissed(promoId: string): Promise<boolean> {
  const ids = await getDismissedPromoIds();
  return ids.has(promoId);
}

export async function clearDismissedPromos(): Promise<void> {
  await storageRemove(DISMISSED_KEY);
}

// ---------------------------------------------------------------------------
// Pending promo (received while offline / app closed)
// ---------------------------------------------------------------------------

export async function savePendingPromo(promo: PromoBannerData): Promise<void> {
  await storageSet(PENDING_PROMO_KEY, JSON.stringify(promo));
}

export async function loadPendingPromo(): Promise<PromoBannerData | null> {
  try {
    const raw = await storageGet(PENDING_PROMO_KEY);
    if (!raw) {return null;}
    return JSON.parse(raw) as PromoBannerData;
  } catch {
    return null;
  }
}

export async function clearPendingPromo(): Promise<void> {
  await storageRemove(PENDING_PROMO_KEY);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns true if the promo has not expired yet (or has no expiry). */
export function isPromoActive(promo: PromoBannerData): boolean {
  if (!promo.expiresAt) {return true;}
  return new Date(promo.expiresAt) > new Date();
}

/** Derives a stable ID for a promo from its payload. */
export function promoId(promo: PromoBannerData): string {
  // Use deepLink + expiresAt as a fingerprint; falls back to title hash
  return `${promo.deepLink ?? ""}|${promo.expiresAt ?? ""}|${promo.title}`;
}
