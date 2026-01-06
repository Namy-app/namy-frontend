import { create } from "zustand";

import type { Store } from "@/lib/api-types";

interface StoresState {
  stores: Store[];
  store: Store | null;
  storeId: string;
  getStores: () => Store[];
  getStore: () => Store | null;
  getStoreId: () => string;
  setStoreId: (id: string) => void;
  setStore: (newStore: Store) => void;
  setStores: (newStores: Store[]) => void;
  reset: () => void;
}

export const useStoresStore = create<StoresState>((set, get) => ({
  stores: [],
  store: null,
  storeId: "",
  getStores: () => get().stores,
  getStore: () => get().store,
  getStoreId: () => get().storeId,
  setStoreId: (id: string) => set(() => ({ storeId: id })),
  setStore: (newStore: Store) => set(() => ({ store: newStore })),
  setStores: (newStores: Store[]) => set(() => ({ stores: newStores })),
  reset: () => set(() => ({ stores: [], store: null, storeId: "" })),
}));
