"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  useIsPartnerMode,
  usePartnerConfig,
  usePartnerStore,
} from "@/store/usePartnerStore";

/**
 * Keeps a partner session out of Namy auth screens and remembers the last
 * in-app path so Reload can return the user to the same screen.
 */
export function PartnerRouteGuard(): null {
  const pathname = usePathname();
  const router = useRouter();
  const isPartnerMode = useIsPartnerMode();
  const partner = usePartnerConfig();

  useEffect(() => {
    if (!isPartnerMode) {
      return;
    }

    if (pathname.startsWith("/auth")) {
      router.replace("/partner/expired");
      return;
    }

    const excluded = [
      "/league",
      "/wallet",
      "/subscription",
      "/referrals",
      "/premium",
    ];
    if (
      pathname === "/" ||
      excluded.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      ) ||
      ((pathname === "/mural" || pathname.startsWith("/mural/")) &&
        partner?.features.mural !== true)
    ) {
      router.replace("/explore");
      return;
    }

    if (!pathname.startsWith("/partner")) {
      const search = window.location.search;
      usePartnerStore
        .getState()
        .setLastPath(search ? `${pathname}${search}` : pathname);
    }
  }, [isPartnerMode, partner, pathname, router]);

  return null;
}
