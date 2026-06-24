"use client";

import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";

import { env } from "@/lib/env";
import { graphqlRequest } from "@/lib/graphql-client";
import {
  buildPromoDeepLink,
  isPromoActive,
  isPromoDismissedFor,
  notificationToPromo,
  pushPayloadToPromo,
  surfacePromo,
} from "@/lib/promo-storage";
import { recoverPendingPromo } from "@/store/usePromoStore";

const REGISTER_PUSH_TOKEN = `
  mutation RegisterPushToken($token: String!, $platform: String!) {
    registerPushToken(token: $token, platform: $platform)
  }
`;

// Novu sometimes prepends "Título\t" or "Mensaje\t" to subject/body fields
function stripNovuPrefix(s: string): string {
  const tab = s.indexOf("\t");
  return tab !== -1 ? s.slice(tab + 1) : s;
}

// Works for both FCM data (Record<string,string>) and Novu data (Record<string,unknown>)
function buildDeepLink(
  data: Record<string, unknown> | undefined
): string | undefined {
  return buildPromoDeepLink(data);
}

async function getNovuInboxToken(userId: string): Promise<string | null> {
  const appId = env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER;
  if (!appId) {
    return null;
  }

  const sessionRes = await fetch("https://api.novu.co/v1/inbox/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      applicationIdentifier: appId,
      subscriberId: userId,
    }),
  });
  if (!sessionRes.ok) {
    return null;
  }

  const { data } = (await sessionRes.json()) as { data: { token: string } };
  return data.token;
}

/** Mark a Novu inbox message read so unread sync stops resurfacing it. */
export async function markNovuInboxNotificationRead(
  userId: string,
  messageId: string
): Promise<void> {
  try {
    const token = await getNovuInboxToken(userId);
    if (!token) {
      return;
    }

    await fetch(
      `https://api.novu.co/v1/inbox/notifications/${messageId}/read`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch {
    // best-effort
  }
}

// Wait up to 8s for the auth store to hydrate a userId (cold-start race)
async function waitForUserId(): Promise<string | null> {
  const { useAuthStore } = await import("@/store/useAuthStore");
  const existing = useAuthStore.getState().user?.id;
  if (existing) {
    return existing;
  }
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      unsub();
      resolve(null);
    }, 8000);
    const unsub = useAuthStore.subscribe((state) => {
      if (state.user?.id) {
        clearTimeout(timeout);
        unsub();
        resolve(state.user.id);
      }
    });
  });
}

// Fetch the full promo from Novu's API using the messageId embedded in every FCM payload
async function fetchNovuPromoAndShow(
  nvMessageId: string,
  navigateFn: (path: string) => void
): Promise<void> {
  try {
    const userId = await waitForUserId();
    if (!userId) {
      navigateFn("/explore");
      return;
    }

    const token = await getNovuInboxToken(userId);
    if (!token) {
      navigateFn("/explore");
      return;
    }

    const notifRes = await fetch(
      `https://api.novu.co/v1/inbox/notifications/${nvMessageId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!notifRes.ok) {
      navigateFn("/explore");
      return;
    }
    const { data: notif } = (await notifRes.json()) as {
      data: {
        _id?: string;
        subject?: string;
        body?: string;
        data?: Record<string, unknown>;
      };
    };

    const promo = notificationToPromo({
      id: notif._id ?? nvMessageId,
      subject: notif.subject,
      body: notif.body,
      data: notif.data,
    });

    if (promo.title || promo.body) {
      await surfacePromo(promo);
    }
  } catch {
    // ignore — just navigate
  }
  navigateFn("/explore");
}

export async function syncLatestNovuPromo(userId: string): Promise<void> {
  return fetchLatestNovuPromo(userId);
}

// On app open, fetch the latest unread promo-banner from Novu inbox
// so the banner shows automatically without needing a tray tap
async function fetchLatestNovuPromo(userId: string): Promise<void> {
  try {
    const token = await getNovuInboxToken(userId);
    if (!token) {
      return;
    }

    const notifRes = await fetch(
      "https://api.novu.co/v1/inbox/notifications?limit=10",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!notifRes.ok) {
      return;
    }
    const { data: notifications } = (await notifRes.json()) as {
      data: Array<{
        _id?: string;
        subject?: string;
        body?: string;
        isRead: boolean;
        data?: Record<string, unknown>;
      }>;
    };

    const unreadPromos = notifications.filter(
      (n) => !n.isRead && (!n.data?.type || n.data.type === "promo_banner")
    );

    for (const notif of unreadPromos) {
      const promo = notificationToPromo({
        id: notif._id,
        subject: notif.subject,
        body: notif.body,
        data: notif.data,
      });
      if (!promo.title && !promo.body) {
        continue;
      }
      if (!isPromoActive(promo)) {
        continue;
      }
      if (await isPromoDismissedFor(promo)) {
        continue;
      }
      await surfacePromo(promo);
      return;
    }
  } catch {
    // ignore
  }
}

let initialized = false;

export async function initPushNotifications(
  _userId: string,
  navigateFn: (path: string) => void
): Promise<void> {
  console.warn("[Push] init called");
  if (!Capacitor.isNativePlatform()) {
    return;
  }
  if (initialized) {
    console.warn("[Push] already initialized");
    return;
  }
  initialized = true;

  const platform = Capacitor.getPlatform() === "ios" ? "apns" : "fcm";

  const perm = await PushNotifications.requestPermissions();
  console.warn("[Push] permission:", JSON.stringify(perm));
  if (perm.receive !== "granted") {
    return;
  }

  await PushNotifications.addListener("registration", (token) => {
    console.warn("[Push] token received:", token.value);
    graphqlRequest(REGISTER_PUSH_TOKEN, { token: token.value, platform }).catch(
      (err) => console.error("[Push] register token failed:", err)
    );
  });

  await PushNotifications.addListener("registrationError", (err) => {
    console.error("[Push] registration error:", JSON.stringify(err));
  });

  // Foreground: notification arrives while app is open
  await PushNotifications.addListener("pushNotificationReceived", (n) => {
    console.warn("[Push] received raw:", JSON.stringify(n));
    const data = n.data;
    if (data?.type && data.type !== "promo_banner") {
      return;
    }

    const title = stripNovuPrefix(
      n.title ||
        data?.title ||
        data?.notification_title ||
        data?.gcm_notification_title ||
        ""
    );
    const body = stripNovuPrefix(
      n.body ||
        data?.body ||
        data?.notification_body ||
        data?.gcm_notification_body ||
        ""
    );

    if (title || body) {
      const promo = pushPayloadToPromo({
        title,
        body,
        imageUrl: data?.imageUrl,
        deepLink: buildDeepLink(data),
        expiresAt: data?.expiresAt,
        novuMessageId: data?.__nvMessageId as string | undefined,
      });
      if (!isPromoActive(promo)) {
        return;
      }
      void surfacePromo(promo);
    } else {
      // FCM stripped title/body — fetch from Novu API using messageId
      const nvMessageId = data?.__nvMessageId as string | undefined;
      if (nvMessageId) {
        void fetchNovuPromoAndShow(nvMessageId, () => {
          // foreground: no navigation needed, just show the banner in place
        });
      }
    }
  });

  // Background / closed: user tapped the notification
  await PushNotifications.addListener(
    "pushNotificationActionPerformed",
    (action) => {
      console.warn("[Push] actionPerformed raw:", JSON.stringify(action));
      const data = action.notification.data;
      const isPromo = !data?.type || data.type === "promo_banner";

      if (isPromo) {
        const title = stripNovuPrefix(
          action.notification.title ||
            data?.title ||
            data?.notification_title ||
            data?.gcm_notification_title ||
            ""
        );
        const body = stripNovuPrefix(
          action.notification.body ||
            data?.body ||
            data?.notification_body ||
            data?.gcm_notification_body ||
            ""
        );

        if (title || body) {
          const promo = pushPayloadToPromo({
            title,
            body,
            imageUrl: data?.imageUrl,
            deepLink: buildDeepLink(data),
            expiresAt: data?.expiresAt,
            novuMessageId: data?.__nvMessageId as string | undefined,
          });
          void surfacePromo(promo);
          navigateFn("/explore");
        } else {
          // FCM stripped our payload (notification message, not data message).
          // Use the Novu messageId to fetch the full notification from the API.
          const nvMessageId = data?.__nvMessageId as string | undefined;
          if (nvMessageId) {
            void fetchNovuPromoAndShow(nvMessageId, navigateFn);
          } else {
            navigateFn("/explore");
          }
        }
      } else {
        navigateFn(buildDeepLink(data) ?? "/explore");
      }
    }
  );

  await PushNotifications.register();

  // Recover any promo that arrived before listeners were set up
  await recoverPendingPromo();

  // Also fetch the latest unread promo-banner from Novu so banner shows
  // automatically when the user opens the app, without needing a tray tap
  void fetchLatestNovuPromo(_userId);
}

export function resetPushHandler(): void {
  initialized = false;
  if (Capacitor.isNativePlatform()) {
    PushNotifications.removeAllListeners().catch(() => undefined);
  }
}
