import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";

const PORTAL_SELECTED_STORE_KEY = "namy-portal-selected-store";

const portalLocalStorage: StateStorage = {
  getItem: (name): string | null => {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem(name);
  },
  setItem: (name, value): void => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem(name, value);
  },
  removeItem: (name): void => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.removeItem(name);
  },
};

interface PortalSelectedStoreState {
  selectedStoreId: string | null;
  isSwitchingStore: boolean;
  setSelectedStoreId: (selectedStoreId: string) => void;
  setIsSwitchingStore: (isSwitchingStore: boolean) => void;
  clearSelectedStore: () => void;
}

export const usePortalSelectedStoreStore = create<PortalSelectedStoreState>()(
  persist(
    (set) => ({
      selectedStoreId: null,
      isSwitchingStore: false,
      setSelectedStoreId: (selectedStoreId) => {
        set({ selectedStoreId });
      },
      setIsSwitchingStore: (isSwitchingStore) => {
        set({ isSwitchingStore });
      },
      clearSelectedStore: () => {
        set({ selectedStoreId: null, isSwitchingStore: false });
      },
    }),
    {
      name: PORTAL_SELECTED_STORE_KEY,
      storage: createJSONStorage(() => portalLocalStorage),
      partialize: (state) => ({
        selectedStoreId: state.selectedStoreId,
      }),
    }
  )
);
