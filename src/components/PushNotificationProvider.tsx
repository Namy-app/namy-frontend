"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { navigateTo } from "@/lib/capacitor-navigate";
import { initPushNotifications, resetPushHandler } from "@/lib/push-handler";
import { useAuthStore } from "@/store/useAuthStore";

export function PushNotificationProvider(): null {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    void initPushNotifications(user.id, (path) => navigateTo(path, router));

    return () => {
      resetPushHandler();
    };
  }, [user?.id, router]);

  return null;
}
