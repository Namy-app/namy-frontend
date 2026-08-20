"use client";

import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  analytics,
  isAdminPath,
  normalizePath,
  resolveStoreIdFromPath,
  screenNameFromPath,
  toIdentifyTraits,
} from "@/lib/analytics";
import {
  hasTrackedAppOpenedThisSession,
  markAppOpenedThisSession,
} from "@/lib/analytics/posthog-client";
import { useAuthStore } from "@/store/useAuthStore";

let lastScreenKey: string | null = null;

export function AnalyticsProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isHydrated, setIsHydrated] = useState(() =>
    useAuthStore.persist.hasHydrated()
  );
  const [isReady, setIsReady] = useState(false);
  const lastIdentifiedIdRef = useRef<string | null>(null);
  const hasSeenBackgroundRef = useRef(false);

  useEffect(() => {
    if (isHydrated) {
      return;
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    if (useAuthStore.persist.hasHydrated()) {
      setTimeout(() => setIsHydrated(true), 0);
    }
    return unsub;
  }, [isHydrated]);

  useEffect(() => {
    let cancelled = false;
    let removeAppListener: (() => void) | undefined;

    const start = async (): Promise<void> => {
      await analytics.init();
      if (cancelled) {
        return;
      }
      setIsReady(true);

      if (!hasTrackedAppOpenedThisSession()) {
        markAppOpenedThisSession();
        analytics.track("app_opened");
      }

      if (!Capacitor.isNativePlatform()) {
        return;
      }

      const handle = await App.addListener("appStateChange", ({ isActive }) => {
        if (!isActive) {
          hasSeenBackgroundRef.current = true;
          return;
        }
        if (hasSeenBackgroundRef.current) {
          analytics.track("app_foregrounded");
        }
      });
      removeAppListener = () => {
        void handle.remove();
      };
    };

    void start();

    return () => {
      cancelled = true;
      removeAppListener?.();
    };
  }, []);

  useEffect(() => {
    if (!isReady || !isHydrated) {
      return;
    }

    const userId = user?.id ?? null;
    const previousId = lastIdentifiedIdRef.current;

    if (userId && user && userId !== previousId) {
      if (previousId && previousId !== userId) {
        analytics.reset();
      }
      analytics.identify(userId, toIdentifyTraits(user));
      lastIdentifiedIdRef.current = userId;
      return;
    }

    if (!userId && previousId) {
      lastIdentifiedIdRef.current = null;
    }
  }, [isReady, isHydrated, user]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const path = normalizePath(pathname);
    if (isAdminPath(path)) {
      return;
    }

    const storeId = resolveStoreIdFromPath(path);
    if (path.startsWith("/stores/") && !storeId) {
      return;
    }

    const screenKey = storeId ? `/stores/${storeId}` : path;
    if (lastScreenKey === screenKey) {
      return;
    }
    lastScreenKey = screenKey;

    analytics.screen(screenNameFromPath(path), {
      path: storeId ? `/stores/${storeId}` : path,
      store_id: storeId,
    });

    if (path === "/explore") {
      analytics.track("explore_viewed", {
        is_authenticated: isAuthenticated,
      });
    }

    if (path === "/subscription") {
      analytics.track("subscription_viewed", {
        is_premium: user?.isPremium,
      });
    }
  }, [isReady, pathname, isAuthenticated, user?.isPremium]);

  return <>{children}</>;
}
