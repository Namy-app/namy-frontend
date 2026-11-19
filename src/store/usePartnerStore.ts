import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { capacitorStorage } from "@/lib/capacitor-storage";
import { setPartnerModeGetter } from "@/lib/graphql-client";

export type PartnerLang = "en" | "es";

export interface PartnerFeatures {
  mural?: boolean;
  leaderboard?: boolean;
  challenges?: boolean;
}

export interface PartnerBranding {
  logoUrl?: string | null;
  colors?: {
    primary?: string;
    secondary?: string;
  };
}

export interface PartnerConfig {
  slug: string;
  name: string;
  discountLevel: number;
  adsDisabled: boolean;
  features: PartnerFeatures;
  branding: PartnerBranding;
}

interface PartnerState {
  partner: PartnerConfig | null;
  lang: PartnerLang;
  parentOrigin: string | null;
  lastPath: string | null;

  setPartner: (
    config: PartnerConfig,
    lang: PartnerLang,
    parentOrigin: string | null
  ) => void;
  setLastPath: (path: string) => void;
  clearPartner: () => void;
}

const initialState = {
  partner: null,
  lang: "en" as const,
  parentOrigin: null,
  lastPath: null,
};

export const usePartnerStore = create<PartnerState>()(
  persist(
    (set) => ({
      ...initialState,

      setPartner: (partner, lang, parentOrigin) => {
        set({ partner, lang, parentOrigin });
      },

      setLastPath: (lastPath) => {
        set({ lastPath });
      },

      clearPartner: () => {
        set({ ...initialState });
      },
    }),
    {
      name: "namy-partner-storage",
      storage: createJSONStorage(() => capacitorStorage),
    }
  )
);

export function useIsPartnerMode(): boolean {
  return usePartnerStore((state) => state.partner != null);
}

export function usePartnerConfig(): PartnerConfig | null {
  return usePartnerStore((state) => state.partner);
}

const subscribeHydration = (notify: () => void): (() => void) => {
  const start = usePartnerStore.persist.onHydrate(notify);
  const finish = usePartnerStore.persist.onFinishHydration(notify);
  return () => {
    start();
    finish();
  };
};

export function usePartnerHydrated(): boolean {
  return useSyncExternalStore(
    subscribeHydration,
    usePartnerStore.persist.hasHydrated,
    () => false
  );
}

if (typeof window !== "undefined") {
  setPartnerModeGetter(() => usePartnerStore.getState().partner != null);
}
