"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { navigateTo } from "@/lib/capacitor-navigate";
import { initPushNotifications, resetPushHandler } from "@/lib/push-handler";
import { useAuthStore } from "@/store/useAuthStore";
import { useIsPartnerMode, usePartnerHydrated } from "@/store/usePartnerStore";

export function PushNotificationProvider(): null {
  const router = useRouter();
  const isPartnerMode = useIsPartnerMode();
  const partnerHydrated = usePartnerHydrated();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const hasHydrated = useAuthStore.persist.hasHydrated();

  useEffect(() => {
    if (
      !hasHydrated ||
      !partnerHydrated ||
      !user?.id ||
      isPartnerMode ||
      pathname?.startsWith("/partner")
    ) {
      return;
    }
    void initPushNotifications(user.id, (path) => navigateTo(path, router));
    return () => {
      resetPushHandler();
    };
  }, [hasHydrated, partnerHydrated, user?.id, router, isPartnerMode, pathname]);

  return null;
}
