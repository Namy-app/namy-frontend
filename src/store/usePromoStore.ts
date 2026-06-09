"use client";

import { create } from "zustand";

import type { PromoBannerData } from "@/app/explore/components/PromoBanner";
import {
  clearPendingPromo,
  isPromoActive,
  isPromoDismissedFor,
  markPromoDismissedForever,
} from "@/lib/promo-storage";
import { markNovuInboxNotificationRead } from "@/lib/push-handler";
import { useAuthStore } from "@/store/useAuthStore";

interface PromoState {
  activePromo: PromoBannerData | null;
  /**
   * Offer a promo for display. Silently skipped if:
   * - type is not "promo_banner"
   * - already expired
   * - user has previously dismissed it
   */
  offerPromo: (promo: PromoBannerData) => Promise<void>;
  /** User explicitly dismissed the banner. Persists the ID so it won't reappear. */
  dismissPromo: () => Promise<void>;
  /** Internal: force-set (used by recovery path after offline delivery). */
  _forceSetPromo: (promo: PromoBannerData) => void;
}

export const usePromoStore = create<PromoState>()((set, get) => ({
  activePromo: null,

  offerPromo: async (promo) => {
    if (promo.type !== "promo_banner") {
      return;
    }
    if (!isPromoActive(promo)) {
      return;
    }
    if (await isPromoDismissedFor(promo)) {
      return;
    }
    set({ activePromo: promo });
  },

  dismissPromo: async () => {
    const current = get().activePromo;
    set({ activePromo: null });
    await clearPendingPromo();
    if (!current) {
      return;
    }
    await markPromoDismissedForever(current);
    const userId = useAuthStore.getState().user?.id;
    if (userId && current.novuMessageId) {
      void markNovuInboxNotificationRead(userId, current.novuMessageId);
    }
  },

  _forceSetPromo: (promo) => set({ activePromo: promo }),
}));

/**
 * Call once on app open / resume. Loads any promo that arrived while the app
 * was closed or offline, validates it, and surfaces it if still active and
 * not dismissed.
 */
export async function recoverPendingPromo(): Promise<void> {
  const {
    loadPendingPromo,
    isPromoActive,
    isPromoDismissedFor,
    clearPendingPromo: clear,
  } = await import("@/lib/promo-storage");
  const promo = await loadPendingPromo();
  if (!promo) {
    return;
  }
  if (!promo.title && !promo.body) {
    await clear();
    return;
  }
  if (!isPromoActive(promo)) {
    await clear();
    return;
  }
  if (await isPromoDismissedFor(promo)) {
    await clear();
    return;
  }
  await usePromoStore.getState().offerPromo(promo);
}
