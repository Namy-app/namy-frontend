"use client";

import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";

import { graphqlRequest } from "@/lib/graphql-client";
import { clearDismissedPromos, savePendingPromo } from "@/lib/promo-storage";
import { recoverPendingPromo, usePromoStore } from "@/store/usePromoStore";

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
  if (!data) {return undefined;}
  if (typeof data.deepLink === "string" && data.deepLink.startsWith("/"))
    {return data.deepLink;}
  if (typeof data.storeId === "string" && data.storeId)
    {return `/stores/${data.storeId}`;}
  if (typeof data.storeIds === "string" && data.storeIds)
    {return `/restaurants?ids=${data.storeIds}`;}
  return undefined;
}

// Wait up to 8s for the auth store to hydrate a userId (cold-start race)
async function waitForUserId(): Promise<string | null> {
  const { useAuthStore } = await import("@/store/useAuthStore");
  const existing = useAuthStore.getState().user?.id;
  if (existing) {return existing;}
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
    const { env } = await import("@/lib/env");
    const appId = env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER;
    const userId = await waitForUserId();
    if (!appId || !userId) {
      navigateFn("/explore");
      return;
    }

    // Get a Novu session token
    const sessionRes = await fetch("https://api.novu.co/v1/inbox/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationIdentifier: appId,
        subscriberId: userId,
      }),
    });
    if (!sessionRes.ok) {
      navigateFn("/explore");
      return;
    }
    const { data: sessionData } = (await sessionRes.json()) as {
      data: { token: string };
    };

    // Fetch the specific notification
    const notifRes = await fetch(
      `https://api.novu.co/v1/inbox/notifications/${nvMessageId}`,
      {
        headers: { Authorization: `Bearer ${sessionData.token}` },
      }
    );
    if (!notifRes.ok) {
      navigateFn("/explore");
      return;
    }
    const { data: notif } = (await notifRes.json()) as {
      data: { subject?: string; body?: string; data?: Record<string, unknown> };
    };

    const nd = notif.data ?? {};
    const promo = {
      title:
        typeof nd.title === "string" && nd.title
          ? nd.title
          : stripNovuPrefix(notif.subject ?? ""),
      body:
        typeof nd.body === "string" && nd.body
          ? nd.body
          : stripNovuPrefix(notif.body ?? ""),
      imageUrl: typeof nd.imageUrl === "string" ? nd.imageUrl : undefined,
      deepLink: buildDeepLink(nd),
      expiresAt: typeof nd.expiresAt === "string" ? nd.expiresAt : undefined,
      type: "promo_banner" as const,
    };

    if (promo.title || promo.body) {
      // Clear dismissed list so re-tapping always re-shows the banner
      await clearDismissedPromos();
      await savePendingPromo(promo);
      usePromoStore.getState()._forceSetPromo(promo);
    }
  } catch {
    // ignore — just navigate
  }
  navigateFn("/explore");
}

// On app open, fetch the latest unread promo-banner from Novu inbox
// so the banner shows automatically without needing a tray tap
async function fetchLatestNovuPromo(userId: string): Promise<void> {
  try {
    const { env } = await import("@/lib/env");
    const appId = env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER;
    if (!appId) {return;}

    const sessionRes = await fetch("https://api.novu.co/v1/inbox/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationIdentifier: appId,
        subscriberId: userId,
      }),
    });
    if (!sessionRes.ok) {return;}
    const { data: sessionData } = (await sessionRes.json()) as {
      data: { token: string };
    };

    const notifRes = await fetch(
      "https://api.novu.co/v1/inbox/notifications?limit=10",
      {
        headers: { Authorization: `Bearer ${sessionData.token}` },
      }
    );
    if (!notifRes.ok) {return;}
    const { data: notifications } = (await notifRes.json()) as {
      data: Array<{
        subject?: string;
        body?: string;
        isRead: boolean;
        data?: Record<string, unknown>;
      }>;
    };

    // Find the latest unread promo_banner notification
    const notif = notifications.find(
      (n) => !n.isRead && (!n.data?.type || n.data.type === "promo_banner")
    );
    if (!notif) {return;}

    const nd = notif.data ?? {};
    const title =
      typeof nd.title === "string" && nd.title
        ? nd.title
        : stripNovuPrefix(notif.subject ?? "");
    const body =
      typeof nd.body === "string" && nd.body
        ? nd.body
        : stripNovuPrefix(notif.body ?? "");
    if (!title && !body) {return;}

    const promo = {
      title,
      body,
      imageUrl: typeof nd.imageUrl === "string" ? nd.imageUrl : undefined,
      deepLink: buildDeepLink(nd),
      expiresAt: typeof nd.expiresAt === "string" ? nd.expiresAt : undefined,
      type: "promo_banner" as const,
    };

    // Only show if this is a genuinely new promo (different from what's in storage)
    const { loadPendingPromo } = await import("@/lib/promo-storage");
    const existing = await loadPendingPromo();
    const isSame =
      existing?.title === promo.title && existing?.body === promo.body;
    if (isSame) {
      // Same promo — respect previous dismiss, let recoverPendingPromo handle it
      return;
    }

    // New promo from admin — clear dismissed list and show fresh
    await clearDismissedPromos();
    await savePendingPromo(promo);
    usePromoStore.getState()._forceSetPromo(promo);
  } catch {
    // ignore
  }
}

let initialized = false;

export async function initPushNotifications(
  _userId: string,
  navigateFn: (path: string) => void
): Promise<void> {
  if (!Capacitor.isNativePlatform()) {return;}
  if (initialized) {return;}
  initialized = true;

  const platform = Capacitor.getPlatform() === "ios" ? "apns" : "fcm";

  const perm = await PushNotifications.requestPermissions();
  if (perm.receive !== "granted") {return;}

  await PushNotifications.addListener("registration", (token) => {
    graphqlRequest(REGISTER_PUSH_TOKEN, { token: token.value, platform }).catch(
      (err) => console.error("[Push] register token failed:", err)
    );
  });

  await PushNotifications.addListener("registrationError", (err) => {
    console.error("[Push] registration error:", err);
  });

  // Foreground: notification arrives while app is open
  await PushNotifications.addListener("pushNotificationReceived", (n) => {
    console.warn("[Push] received raw:", JSON.stringify(n));
    const data = n.data;
    if (data?.type && data.type !== "promo_banner") {return;}

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
      const promo = {
        title,
        body,
        imageUrl: data?.imageUrl,
        deepLink: buildDeepLink(data),
        expiresAt: data?.expiresAt,
        type: "promo_banner" as const,
      };
      void clearDismissedPromos();
      void savePendingPromo(promo);
      usePromoStore.getState()._forceSetPromo(promo);
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
          // FCM delivered full payload — save and show immediately
          const promo = {
            title,
            body,
            imageUrl: data?.imageUrl,
            deepLink: buildDeepLink(data),
            expiresAt: data?.expiresAt,
            type: "promo_banner" as const,
          };
          void clearDismissedPromos();
          void savePendingPromo(promo);
          usePromoStore.getState()._forceSetPromo(promo);
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
