"use client";

import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { useEffect, useRef } from "react";

import { graphqlRequest } from "@/lib/graphql-client";

const REGISTER_PUSH_TOKEN = `
  mutation RegisterPushToken($token: String!, $platform: String!) {
    registerPushToken(token: $token, platform: $platform)
  }
`;

const REMOVE_PUSH_TOKEN = `
  mutation RemovePushToken($token: String!, $platform: String!) {
    removePushToken(token: $token, platform: $platform)
  }
`;

export function usePushNotifications(userId: string | undefined): void {
  const tokenRef = useRef<string | null>(null);
  const platformRef = useRef<string | null>(null);

  useEffect(() => {
    if (!userId || !Capacitor.isNativePlatform()) {
      return;
    }

    const rawPlatform = Capacitor.getPlatform(); // 'ios' | 'android'
    const platform = rawPlatform === "ios" ? "apns" : "fcm";
    platformRef.current = platform;

    let mounted = true;

    const registerToken = async (token: string): Promise<void> => {
      try {
        await graphqlRequest(REGISTER_PUSH_TOKEN, {
          token,
          platform,
        });
        console.warn("[PushNotifications] Token registered:", token, platform);
      } catch (err) {
        console.error("[PushNotifications] Failed to register token:", err);
      }
    };

    const setup = async () => {
      // Request permission
      const permResult = await PushNotifications.requestPermissions();
      if (permResult.receive !== "granted") {
        console.warn("[PushNotifications] Permission not granted");
        return;
      }

      // Add listeners BEFORE calling register() to avoid missing the registration event
      await PushNotifications.addListener(
        "registration",
        (token: { value: string }) => {
          if (!mounted) {
            return;
          }
          tokenRef.current = token.value;
          void registerToken(token.value);
        }
      );

      // Registration error
      await PushNotifications.addListener(
        "registrationError",
        (err: unknown) => {
          console.error("[PushNotifications] Registration error:", err);
        }
      );

      // Notification received while app is in foreground
      await PushNotifications.addListener(
        "pushNotificationReceived",
        (notification: { title?: string; body?: string }) => {
          console.warn(
            "[PushNotifications] Notification received:",
            notification
          );
        }
      );

      await PushNotifications.register();
    };

    setup().catch((err) =>
      console.error("[PushNotifications] Setup error:", err)
    );

    return () => {
      mounted = false;

      // Remove all listeners and unregister token on cleanup
      PushNotifications.removeAllListeners().catch(() => undefined);

      if (tokenRef.current && platformRef.current) {
        graphqlRequest(REMOVE_PUSH_TOKEN, {
          token: tokenRef.current,
          platform: platformRef.current,
        }).catch((err) =>
          console.error("[PushNotifications] Failed to remove token:", err)
        );
      }
    };
  }, [userId]);
}
