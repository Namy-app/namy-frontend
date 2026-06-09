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
    if (!raw) {
      return new Set();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return new Set();
    }
    return new Set(parsed.filter((v): v is string => typeof v === "string"));
  } catch {
    return new Set();
  }
}

/** Strip Novu workflow prefix (e.g. "Título\\t") from subject/body. */
export function normalizePromoText(value: string): string {
  const tab = value.indexOf("\t");
  const stripped = tab !== -1 ? value.slice(tab + 1) : value;
  return stripped.trim();
}

export async function markPromoAsDismissed(id: string): Promise<void> {
  const ids = await getDismissedPromoIds();
  ids.add(id);
  const trimmed = Array.from(ids).slice(-50);
  await storageSet(DISMISSED_KEY, JSON.stringify(trimmed));
}

export async function isPromoDismissed(id: string): Promise<boolean> {
  const ids = await getDismissedPromoIds();
  return ids.has(id);
}

/** Legacy id from an earlier build (deepLink|expiresAt|title). */
export function legacyPromoId(promo: PromoBannerData): string {
  return `${promo.deepLink ?? ""}|${promo.expiresAt ?? ""}|${promo.title}`;
}

/** True if this promo was dismissed (matches current or legacy fingerprint). */
export async function isPromoDismissedFor(
  promo: PromoBannerData
): Promise<boolean> {
  if (
    promo.novuMessageId &&
    (await isNovuMessageDismissed(promo.novuMessageId))
  ) {
    return true;
  }
  const ids = await getDismissedPromoIds();
  const current = promoId(promo);
  if (ids.has(current)) {
    return true;
  }
  const legacy = legacyPromoId(promo);
  return legacy !== current && ids.has(legacy);
}

export async function markPromoDismissedForever(
  promo: PromoBannerData
): Promise<void> {
  await markPromoAsDismissed(promoId(promo));
  const legacy = legacyPromoId(promo);
  if (legacy !== promoId(promo)) {
    await markPromoAsDismissed(legacy);
  }
  if (promo.novuMessageId) {
    await markNovuMessageDismissed(promo.novuMessageId);
  }
}

const DISMISSED_NOVU_KEY = "namy_dismissed_novu_messages";

async function getDismissedNovuMessageIds(): Promise<Set<string>> {
  try {
    const raw = await storageGet(DISMISSED_NOVU_KEY);
    if (!raw) {
      return new Set();
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return new Set();
    }
    return new Set(parsed.filter((v): v is string => typeof v === "string"));
  } catch {
    return new Set();
  }
}

export async function markNovuMessageDismissed(
  messageId: string
): Promise<void> {
  const ids = await getDismissedNovuMessageIds();
  ids.add(messageId);
  await storageSet(
    DISMISSED_NOVU_KEY,
    JSON.stringify(Array.from(ids).slice(-50))
  );
}

async function isNovuMessageDismissed(messageId: string): Promise<boolean> {
  const ids = await getDismissedNovuMessageIds();
  return ids.has(messageId);
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
    if (!raw) {
      return null;
    }
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
  if (!promo.expiresAt) {
    return true;
  }
  return new Date(promo.expiresAt) > new Date();
}

/** Stable fingerprint — title + body only (deepLink/expiry may differ per sync path). */
export function promoId(promo: PromoBannerData): string {
  return `${normalizePromoText(promo.title)}|${normalizePromoText(promo.body)}`;
}

// ---------------------------------------------------------------------------
// Promo routing, payloads, and surfacing
// ---------------------------------------------------------------------------

const PROMO_BANNER_BLOCKED_PREFIXES = ["/admin", "/auth", "/coming-soon"];

/** User-facing routes where the full-screen promo may appear. */
export function isPromoBannerRoute(pathname: string): boolean {
  if (pathname === "/") {
    return false;
  }
  return !PROMO_BANNER_BLOCKED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/** Novu / FCM payloads may send storeIds as a comma string or JSON array. */
export function normalizeStoreIds(value: unknown): string[] {
  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (Array.isArray(value)) {
    return value.filter(
      (v): v is string => typeof v === "string" && v.length > 0
    );
  }
  return [];
}

/** Resolve the in-app route for a promo notification payload. */
export function buildPromoDeepLink(
  data: Record<string, unknown> | undefined
): string | undefined {
  if (!data) {
    return undefined;
  }

  const explicit = data.deepLink;
  if (typeof explicit === "string" && explicit.startsWith("/")) {
    return explicit;
  }

  if (typeof data.storeId === "string" && data.storeId) {
    return `/stores/${data.storeId}`;
  }

  const storeIds = normalizeStoreIds(data.storeIds);
  if (storeIds.length === 1) {
    return `/stores/${storeIds[0]}`;
  }
  if (storeIds.length > 1) {
    return `/restaurants?ids=${storeIds.join(",")}`;
  }

  return undefined;
}

export function notificationToPromo(notification: {
  id?: string;
  subject?: string;
  body?: string;
  data?: Record<string, unknown>;
  redirect?: { url?: string; target?: string } | null;
}): PromoBannerData {
  const data = notification.data ?? {};

  const title = normalizePromoText(
    (typeof data.title === "string" && data.title) || notification.subject || ""
  );
  const body = normalizePromoText(
    (typeof data.body === "string" && data.body) || notification.body || ""
  );

  let deepLink = buildPromoDeepLink(data);
  if (
    !deepLink &&
    typeof notification.redirect?.url === "string" &&
    notification.redirect.url.startsWith("/")
  ) {
    deepLink = notification.redirect.url;
  }

  return {
    title,
    body,
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : undefined,
    deepLink,
    expiresAt: typeof data.expiresAt === "string" ? data.expiresAt : undefined,
    novuMessageId: notification.id,
    type: "promo_banner",
  };
}

/** Build promo from push/FCM payload fields. */
export function pushPayloadToPromo(fields: {
  title?: string;
  body?: string;
  imageUrl?: string;
  deepLink?: string;
  expiresAt?: string;
  novuMessageId?: string;
}): PromoBannerData {
  return {
    title: normalizePromoText(fields.title ?? ""),
    body: normalizePromoText(fields.body ?? ""),
    imageUrl: fields.imageUrl,
    deepLink: fields.deepLink,
    expiresAt: fields.expiresAt,
    novuMessageId: fields.novuMessageId,
    type: "promo_banner",
  };
}

export function isPromoNotificationData(
  data: Record<string, unknown> | undefined
): boolean {
  return !data?.type || data.type === "promo_banner";
}

/** Save and display a promo banner if it is still active and not dismissed. */
export async function surfacePromo(promo: PromoBannerData): Promise<boolean> {
  if (promo.type !== "promo_banner" || !isPromoActive(promo)) {
    return false;
  }
  if (!promo.title && !promo.body) {
    return false;
  }
  if (await isPromoDismissedFor(promo)) {
    await clearPendingPromo();
    return false;
  }
  await savePendingPromo(promo);
  const { usePromoStore } = await import("@/store/usePromoStore");
  await usePromoStore.getState().offerPromo(promo);
  return usePromoStore.getState().activePromo !== null;
}
