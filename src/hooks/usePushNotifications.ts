"use client";

import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { navigateTo } from "@/lib/capacitor-navigate";
import { graphqlRequest } from "@/lib/graphql-client";
import { savePendingPromo } from "@/lib/promo-storage";
import { usePromoStore } from "@/store/usePromoStore";

const REGISTER_PUSH_TOKEN = `
  mutation RegisterPushToken($token: String!, $platform: String!) {
    registerPushToken(token: $token, platform: $platform)
  }
`;

/**
 * Resolves the intended deep-link route from notification data.
 *
 * Priority: explicit `deepLink` field → storeId shorthand → storeIds list.
 *
 * Supported routes:
 *   /stores/:id
 *   /explore?new_restaurants=true
 *   /restaurants?ids=1,2,3
 */
function resolveNotificationRoute(
  data: Record<string, string> | undefined
): string {
  if (data?.deepLink?.startsWith("/")) {return data.deepLink;}
  if (data?.storeId) {return `/stores/${data.storeId}`;}
  if (data?.storeIds) {return `/stores?ids=${data.storeIds}`;}

  return "/explore";
}

export function usePushNotifications(userId: string | undefined): void {
  const router = useRouter();
  const { offerPromo } = usePromoStore();

  // Keep stable refs so listeners always use the latest values without re-running setup
  const routerRef = useRef(router);
  const offerPromoRef = useRef(offerPromo);
  useEffect(() => {
    routerRef.current = router;
  }, [router]);
  useEffect(() => {
    offerPromoRef.current = offerPromo;
  }, [offerPromo]);

  // Tracks the userId for which push was already initialized this session
  const initializedForRef = useRef<string | null>(null);

  useEffect(() => {
    if (!userId || !Capacitor.isNativePlatform()) {return;}
    if (initializedForRef.current === userId) {return;}
    initializedForRef.current = userId;

    const rawPlatform = Capacitor.getPlatform();
    const platform = rawPlatform === "ios" ? "apns" : "fcm";

    const setup = async () => {
      const permResult = await PushNotifications.requestPermissions();
      if (permResult.receive !== "granted") {return;}

      // Register listeners BEFORE calling register() to avoid missing the token event
      await PushNotifications.addListener(
        "registration",
        (token: { value: string }) => {
          graphqlRequest(REGISTER_PUSH_TOKEN, {
            token: token.value,
            platform,
          }).catch((err) =>
            console.error("[Push] Failed to register token:", err)
          );
        }
      );

      await PushNotifications.addListener(
        "registrationError",
        (err: unknown) => {
          console.error("[Push] Registration error:", err);
        }
      );

      // App is in FOREGROUND — show promo banner, save for offline recovery
      await PushNotifications.addListener(
        "pushNotificationReceived",
        (notification: {
          title?: string;
          body?: string;
          data?: Record<string, string>;
        }) => {
          const data = notification.data;
          // Treat missing type as promo_banner (promo workflows always send it,
          // but FCM data maps can occasionally drop optional fields)
          if (data?.type && data.type !== "promo_banner") {return;}

          const promo = {
            title: notification.title ?? data?.title ?? "",
            body: notification.body ?? data?.body ?? "",
            imageUrl: data?.imageUrl,
            deepLink: data?.deepLink,
            expiresAt: data?.expiresAt,
            type: "promo_banner" as const,
          };

          void offerPromoRef.current(promo);
          void savePendingPromo(promo);
        }
      );

      // App was in BACKGROUND or CLOSED — user tapped the notification
      await PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (action: {
          notification: {
            title?: string;
            body?: string;
            data?: Record<string, string>;
          };
          actionId: string;
        }) => {
          const data = action.notification.data;
          const isPromo = !data?.type || data.type === "promo_banner";

          if (isPromo) {
            const promo = {
              title: action.notification.title ?? data?.title ?? "",
              body: action.notification.body ?? data?.body ?? "",
              imageUrl: data?.imageUrl,
              deepLink: data?.deepLink ?? resolveNotificationRoute(data),
              expiresAt: data?.expiresAt,
              type: "promo_banner" as const,
            };
            // Persist so recoverPendingPromo picks it up even on cold start
            void savePendingPromo(promo);
            void offerPromoRef.current(promo);
            // Always land on explore so the banner can render — the CTA button
            // on the banner navigates to the specific store/route
            localStorage.setItem("spa_redirect", "/explore");
            navigateTo("/explore", routerRef.current);
          } else {
            // Non-promo notification: navigate directly to the route
            const route = resolveNotificationRoute(data);
            localStorage.setItem("spa_redirect", route);
            navigateTo(route, routerRef.current);
          }
        }
      );

      await PushNotifications.register();
    };

    setup().catch((err) => console.error("[Push] Setup error:", err));

    return () => {
      // Reset so a new userId (re-login) triggers setup again
      initializedForRef.current = null;
      PushNotifications.removeAllListeners().catch(() => undefined);
    };
  }, [userId]);
}
