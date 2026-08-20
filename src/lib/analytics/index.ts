import type { User } from "@/lib/api-types";
import { resolveCapacitorDynamicId } from "@/lib/capacitor-navigate";

import {
  captureEvent,
  captureEventDistinct,
  getAnalyticsPlatform,
  identifyUser,
  initPosthog,
  isAnalyticsReady,
  resetUser,
} from "./posthog-client";
import type {
  AnalyticsEventMap,
  AnalyticsEventName,
  IdentifyTraits,
} from "./types";

const PLACEHOLDER_IDS = new Set(["id", "placeholder"]);

export function normalizePath(path: string | null | undefined): string {
  if (!path) {
    return "/";
  }
  const trimmed = path.split("?")[0]?.split("#")[0] ?? "/";
  if (trimmed === "/" || trimmed === "") {
    return "/";
  }
  const withoutSlash = trimmed.replace(/\/+$/, "");
  return withoutSlash || "/";
}

export function isAdminPath(path: string): boolean {
  return path === "/admin" || path.startsWith("/admin/");
}

export function screenNameFromPath(path: string): string {
  if (path === "/") {
    return "onboarding";
  }
  const segment = path.split("/").filter(Boolean)[0];
  return segment ?? "unknown";
}

export function resolveStoreIdFromPath(path: string): string | undefined {
  if (!path.startsWith("/stores/")) {
    return undefined;
  }
  const paramId = path.split("/").filter(Boolean)[1];
  const resolved = resolveCapacitorDynamicId("/stores/", paramId);
  if (!resolved || PLACEHOLDER_IDS.has(resolved)) {
    return undefined;
  }
  return resolved;
}

export function toIdentifyTraits(user: User): IdentifyTraits {
  return {
    user_id: user.id,
    role: user.role,
    verified: user.verified,
    is_premium: user.isPremium,
    auto_renew: user.autoRenew,
    city: user.city,
    country: user.country,
    created_at: user.createdAt,
  };
}

export const analytics = {
  init: initPosthog,
  isReady: isAnalyticsReady,
  platform: getAnalyticsPlatform,
  track<K extends AnalyticsEventName>(
    event: K,
    properties?: AnalyticsEventMap[K],
    options?: { sendInstantly?: boolean }
  ): void {
    captureEvent(event, properties, options);
  },
  trackDistinct<K extends AnalyticsEventName>(
    event: K,
    distinctKey: string,
    properties?: AnalyticsEventMap[K]
  ): void {
    captureEventDistinct(event, distinctKey, properties);
  },
  identify(userId: string, traits: IdentifyTraits): void {
    identifyUser(userId, traits);
  },
  reset(): void {
    resetUser();
  },
  screen(
    screen: string,
    properties: { path: string; store_id?: string }
  ): void {
    captureEvent("screen_viewed", {
      screen,
      path: properties.path,
      ...(properties.store_id ? { store_id: properties.store_id } : {}),
    });
  },
};
