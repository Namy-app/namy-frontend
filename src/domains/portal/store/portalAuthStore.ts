import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";

import type { PortalOwner } from "@/domains/portal/types";
import {
  PORTAL_AUTH_STORAGE_KEY,
  setPortalAuthErrorCallback,
  setPortalAuthToken,
} from "@/lib/portalGraphqlClient";

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

interface PortalJwtPayload {
  role?: string;
  defaultStoreId?: string;
}

function decodePortalJwtPayload(token: string): PortalJwtPayload | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) {
      return null;
    }
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    return JSON.parse(atob(padded)) as PortalJwtPayload;
  } catch {
    return null;
  }
}

function isRestaurantOwnerToken(token: string): boolean {
  const payload = decodePortalJwtPayload(token);
  return payload?.role === "restaurant_owner";
}

function defaultStoreIdFromToken(token: string): string | null {
  return decodePortalJwtPayload(token)?.defaultStoreId ?? null;
}

interface PortalAuthState {
  portalToken: string | null;
  owner: PortalOwner | null;
  defaultStoreId: string | null;
  isAuthenticated: boolean;
  tempPassword: string | null;

  setPortalAuth: (
    portalToken: string,
    owner: PortalOwner,
    tempPassword?: string
  ) => void;
  switchStore: (portalToken: string) => void;
  clearPortalAuth: () => void;
  updateOwner: (owner: Partial<PortalOwner>) => void;
  clearTempPassword: () => void;
}

export const usePortalAuthStore = create<PortalAuthState>()(
  persist(
    (set, get) => ({
      portalToken: null,
      owner: null,
      defaultStoreId: null,
      isAuthenticated: false,
      tempPassword: null,

      setPortalAuth: (portalToken, owner, tempPassword) => {
        if (!isRestaurantOwnerToken(portalToken)) {
          get().clearPortalAuth();
          return;
        }
        setPortalAuthToken(portalToken);
        set({
          portalToken,
          owner,
          defaultStoreId: defaultStoreIdFromToken(portalToken),
          isAuthenticated: true,
          tempPassword: tempPassword ?? null,
        });
      },

      switchStore: (portalToken) => {
        if (!isRestaurantOwnerToken(portalToken)) {
          return;
        }
        setPortalAuthToken(portalToken);
        set({
          portalToken,
          defaultStoreId: defaultStoreIdFromToken(portalToken),
          isAuthenticated: true,
        });
      },

      clearPortalAuth: () => {
        setPortalAuthToken(null);
        set({
          portalToken: null,
          owner: null,
          defaultStoreId: null,
          isAuthenticated: false,
          tempPassword: null,
        });
      },

      updateOwner: (updatedOwner) => {
        set((state) => ({
          owner: state.owner ? { ...state.owner, ...updatedOwner } : null,
        }));
      },

      clearTempPassword: () => {
        set({ tempPassword: null });
      },
    }),
    {
      name: PORTAL_AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => portalLocalStorage),
      partialize: (state) => ({
        portalToken: state.portalToken,
        owner: state.owner,
        defaultStoreId: state.defaultStoreId,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state?.portalToken) {
          return;
        }
        if (!isRestaurantOwnerToken(state.portalToken)) {
          queueMicrotask(() => {
            usePortalAuthStore.getState().clearPortalAuth();
          });
          return;
        }
        setPortalAuthToken(state.portalToken);
        const defaultStoreId = defaultStoreIdFromToken(state.portalToken);
        if (defaultStoreId && state.defaultStoreId !== defaultStoreId) {
          queueMicrotask(() => {
            usePortalAuthStore.setState({ defaultStoreId });
          });
        }
      },
    }
  )
);

if (typeof window !== "undefined") {
  setPortalAuthErrorCallback(() => {
    usePortalAuthStore.getState().clearPortalAuth();
  });
}
