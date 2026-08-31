"use client";

import { Capacitor } from "@capacitor/core";

/**
 * In Capacitor static export (iOS + Android), navigating to a dynamic route
 * like /stores/uuid causes a hard file-system lookup which fails (file not
 * found). This utility saves the destination to localStorage and navigates to
 * the pre-built placeholder shell, which then reads the real id client-side.
 */

const PLACEHOLDER_IDS = new Set(["id", "placeholder"]);

/** Full dynamic path for client-side id resolution (e.g. /stores/<uuid>?discountId=...). */
export const CAPACITOR_DYNAMIC_PATH_KEY = "capacitor_dynamic_path";

/** Dispatched when navigating to a new entity while already on a placeholder shell. */
export const CAPACITOR_DYNAMIC_NAV_EVENT = "capacitor-dynamic-nav";

function stripQueryAndHash(segment: string): string {
  return segment.split("?")[0]?.split("#")[0] ?? segment;
}

/** One-shot redirect target set by 404.html after a failed file lookup. */
export const SPA_REDIRECT_KEY = "spa_redirect";

/** True in the native iOS/Android shell, false on web. */
export function isCapacitorNative(): boolean {
  return typeof window !== "undefined" && Capacitor.isNativePlatform();
}

export function isCapacitorDynamicRoute(path: string): boolean {
  return (
    /^\/stores\/[^/]+/.test(path) ||
    /^\/admin\/stores\/[^/]+/.test(path) ||
    /^\/admin\/users\/[^/]+/.test(path)
  );
}

export function getCapacitorPlaceholderPath(path: string): string {
  if (path.startsWith("/stores/")) {
    return "/stores/id";
  }
  if (path.startsWith("/admin/stores/")) {
    return "/admin/stores/id";
  }
  if (path.startsWith("/admin/users/")) {
    return "/admin/users/id";
  }
  return path;
}

export function setCapacitorDynamicPath(path: string): void {
  localStorage.setItem(CAPACITOR_DYNAMIC_PATH_KEY, path);
}

export function clearCapacitorNavigationState(): void {
  localStorage.removeItem(CAPACITOR_DYNAMIC_PATH_KEY);
  localStorage.removeItem(SPA_REDIRECT_KEY);
}

/** Real entity id when the URL param is the static-export placeholder shell. */
export function resolveCapacitorDynamicId(
  pathPrefix: string,
  paramsId: string | undefined
): string | null {
  if (paramsId && !PLACEHOLDER_IDS.has(paramsId)) {
    return stripQueryAndHash(paramsId);
  }
  if (typeof window === "undefined") {
    return null;
  }
  const dynamicPath = localStorage.getItem(CAPACITOR_DYNAMIC_PATH_KEY);
  if (!dynamicPath?.startsWith(pathPrefix)) {
    return null;
  }
  const segment = dynamicPath.split("/").filter(Boolean).pop();
  return segment ? stripQueryAndHash(segment) : null;
}

/** Query param from the stored Capacitor path (native has no real search string on the shell URL). */
export function resolveCapacitorDynamicQueryParam(
  param: string
): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const dynamicPath = localStorage.getItem(CAPACITOR_DYNAMIC_PATH_KEY);
  if (!dynamicPath?.includes("?")) {
    return null;
  }
  const search = dynamicPath.slice(dynamicPath.indexOf("?"));
  return new URLSearchParams(search).get(param);
}

function notifyCapacitorDynamicNavigation(): void {
  window.dispatchEvent(new Event(CAPACITOR_DYNAMIC_NAV_EVENT));
}

function navigateCapacitorDynamicRoute(
  path: string,
  navigate: (target: string) => void
): void {
  setCapacitorDynamicPath(path);
  const placeholder = getCapacitorPlaceholderPath(path);
  const normalizedCurrent = window.location.pathname.replace(/\/+$/, "") || "/";
  const normalizedPlaceholder = placeholder.replace(/\/+$/, "") || "/";

  if (normalizedCurrent === normalizedPlaceholder) {
    notifyCapacitorDynamicNavigation();
    navigate(`${placeholder}?_cd=${Date.now()}`);
    return;
  }

  navigate(placeholder);
}

export function navigateTo(
  path: string,
  router: { push: (p: string) => void; replace?: (p: string) => void }
): void {
  if (isCapacitorNative() && isCapacitorDynamicRoute(path)) {
    navigateCapacitorDynamicRoute(path, (target) => {
      if (router.replace && target.includes("?_cd=")) {
        router.replace(target);
      } else {
        router.push(target);
      }
    });
  } else {
    router.push(path);
  }
}

export function replaceTo(
  path: string,
  router: { replace: (p: string) => void }
): void {
  if (isCapacitorNative() && isCapacitorDynamicRoute(path)) {
    navigateCapacitorDynamicRoute(path, (target) => router.replace(target));
  } else {
    router.replace(path);
  }
}

// ---------------------------------------------------------------------------
// Cold start (runs before React — import from an early layout client module)
// ---------------------------------------------------------------------------

export const APP_BOOT_KEY = "namy_app_boot";

const RESTORED_SHELL_PREFIXES = ["/stores/", "/admin/stores/", "/admin/users/"];

function isRootShell(path: string): boolean {
  return path === "/" || path === "/index.html" || path.endsWith("/index.html");
}

function shouldResetRestoredShell(path: string): boolean {
  return RESTORED_SHELL_PREFIXES.some((prefix) => path.startsWith(prefix));
}

/**
 * Runs synchronously before React renders.
 *
 * iOS restores the last WebView URL (e.g. /stores/id/) on cold start.
 * useEffect-based redirects run too late — StoreDetailClient already read
 * stale localStorage and fetched the wrong store.
 */
export function runCapacitorColdStartSync(): void {
  if (typeof window === "undefined" || !Capacitor.isNativePlatform()) {
    return;
  }
  if (sessionStorage.getItem(APP_BOOT_KEY)) {
    return;
  }

  const path = window.location.pathname;
  const redirect = localStorage.getItem(SPA_REDIRECT_KEY);

  if (redirect && redirect !== "/" && isRootShell(path)) {
    sessionStorage.setItem(APP_BOOT_KEY, "1");
    localStorage.removeItem(SPA_REDIRECT_KEY);

    if (isCapacitorDynamicRoute(redirect)) {
      localStorage.setItem(CAPACITOR_DYNAMIC_PATH_KEY, redirect);
      window.location.replace(getCapacitorPlaceholderPath(redirect) + "/");
      return;
    }

    window.location.replace(redirect);
    return;
  }

  sessionStorage.setItem(APP_BOOT_KEY, "1");
  localStorage.removeItem(SPA_REDIRECT_KEY);
  localStorage.removeItem(CAPACITOR_DYNAMIC_PATH_KEY);

  if (shouldResetRestoredShell(path)) {
    window.location.replace("/explore/");
  }
}
