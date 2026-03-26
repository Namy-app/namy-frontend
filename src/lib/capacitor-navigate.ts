"use client";

/**
 * In Capacitor static export, navigating to a dynamic route like /stores/uuid
 * causes a hard file-system lookup which fails (file not found).
 * This utility saves the destination to localStorage and navigates to the
 * pre-built placeholder shell, which then client-side navigates to the real route.
 */

const isCapacitor =
  typeof window !== "undefined" &&
  !!(window as Window & { Capacitor?: unknown }).Capacitor;

export function navigateTo(
  path: string,
  router: { push: (p: string) => void }
): void {
  if (isCapacitor && isDynamicRoute(path)) {
    localStorage.setItem("spa_redirect", path);
    const placeholder = getPlaceholderPath(path);
    router.push(placeholder);
  } else {
    router.push(path);
  }
}

function isDynamicRoute(path: string): boolean {
  return /^\/stores\/[^/]+/.test(path);
}

function getPlaceholderPath(path: string): string {
  if (path.startsWith("/stores/")) {return "/stores/placeholder";}
  return path;
}
