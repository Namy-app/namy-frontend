"use client";

import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { NovuProvider, useNotifications } from "@novu/nextjs/hooks";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import {
  PromoBanner,
  type PromoBannerData,
} from "@/app/explore/components/PromoBanner";
import { analytics } from "@/lib/analytics";
import { env } from "@/lib/env";
import {
  isPromoBannerRoute,
  isPromoNotificationData,
  notificationToPromo,
  promoId,
  surfacePromo,
} from "@/lib/promo-storage";
import { syncLatestNovuPromo } from "@/lib/push-handler";
import { useAuthStore } from "@/store/useAuthStore";
import { recoverPendingPromo, usePromoStore } from "@/store/usePromoStore";

function PromoSyncBootstrap({ userId }: { userId: string | undefined }): null {
  const pathname = usePathname();
  const canSyncPromos =
    !!userId && pathname !== null && isPromoBannerRoute(pathname);

  useEffect(() => {
    if (!canSyncPromos) {
      return;
    }
    void recoverPendingPromo();
    void syncLatestNovuPromo(userId!);
  }, [canSyncPromos, userId]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !canSyncPromos) {
      return;
    }

    const resumePromise = App.addListener("appStateChange", ({ isActive }) => {
      if (isActive) {
        void recoverPendingPromo();
        void syncLatestNovuPromo(userId!);
      }
    });

    return () => {
      void resumePromise.then((handle) => handle.remove());
    };
  }, [canSyncPromos, userId]);

  return null;
}

function NovuPromoSync(): null {
  const pathname = usePathname();
  const lastSurfacedIdRef = useRef<string | null>(null);
  const canSyncPromos =
    pathname !== null &&
    isPromoBannerRoute(pathname) &&
    Capacitor.isNativePlatform(); // Only show promos on native apps

  const { notifications } = useNotifications({
    read: false,
    limit: 10,
  });

  useEffect(() => {
    if (!canSyncPromos || !notifications?.length) {
      return;
    }

    const latestPromo = notifications.find((n) =>
      isPromoNotificationData(n.data as Record<string, unknown> | undefined)
    );
    if (!latestPromo?.id || latestPromo.id === lastSurfacedIdRef.current) {
      return;
    }

    lastSurfacedIdRef.current = latestPromo.id;
    void surfacePromo(
      notificationToPromo({
        id: latestPromo.id,
        subject: latestPromo.subject,
        body: latestPromo.body,
        data: latestPromo.data as Record<string, unknown> | undefined,
        redirect: latestPromo.redirect,
      })
    );
  }, [canSyncPromos, notifications]);

  return null;
}

function GlobalPromoBanner(): React.JSX.Element | null {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { activePromo, dismissPromo } = usePromoStore();

  const canShow =
    isAuthenticated && pathname !== null && isPromoBannerRoute(pathname);

  useEffect(() => {
    if (!canShow && activePromo) {
      usePromoStore.setState({ activePromo: null });
    }
  }, [canShow, activePromo]);

  if (!canShow || !activePromo) {
    return null;
  }

  return (
    <VisiblePromoBanner
      promo={activePromo}
      onDismiss={() => {
        void dismissPromo();
      }}
    />
  );
}

function VisiblePromoBanner({
  promo,
  onDismiss,
}: {
  promo: PromoBannerData;
  onDismiss: () => void;
}): React.JSX.Element {
  const viewedKey = promo.novuMessageId || promoId(promo);

  useEffect(() => {
    analytics.trackDistinct("promo_banner_viewed", viewedKey, {
      ...(promo.novuMessageId ? { novu_message_id: promo.novuMessageId } : {}),
      promo_id: promoId(promo),
      ...(promo.deepLink ? { deep_link: promo.deepLink } : {}),
    });
  }, [viewedKey, promo]);

  return <PromoBanner promo={promo} onClose={onDismiss} />;
}

/** Novu session, promo sync, and global banner overlay. */
export function PromoProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const userId = useAuthStore((s) => s.user?.id);
  const appId = env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER;

  if (!userId || !appId) {
    return (
      <>
        <PromoSyncBootstrap userId={userId} />
        <GlobalPromoBanner />
        {children}
      </>
    );
  }

  return (
    <NovuProvider applicationIdentifier={appId} subscriberId={userId}>
      <PromoSyncBootstrap userId={userId} />
      <NovuPromoSync />
      <GlobalPromoBanner />
      {children}
    </NovuProvider>
  );
}
