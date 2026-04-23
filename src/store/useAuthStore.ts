import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { type User } from "@/lib/api-types";
import { capacitorStorage } from "@/lib/capacitor-storage";
import { setAuthToken, setAuthErrorCallback } from "@/lib/graphql-client";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  expiresAt: number | null;

  // Actions
  setAuth: (user: User, accessToken: string, rememberMe?: boolean) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
  checkExpiration: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      rememberMe: false,
      expiresAt: null,

      setAuth: (user, accessToken, rememberMe = false) => {
        setAuthToken(accessToken);
        // If remember me: 30 days, otherwise: 1 day
        const expirationTime = rememberMe
          ? 30 * 24 * 60 * 60 * 1000
          : 24 * 60 * 60 * 1000;
        const expiresAt = Date.now() + expirationTime;

        set({
          user,
          accessToken,
          isAuthenticated: true,
          rememberMe,
          expiresAt,
        });
      },

      clearAuth: () => {
        setAuthToken(null);
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          rememberMe: false,
          expiresAt: null,
        });
        // Navigation is handled by ProtectedRoute — no hard redirect here.
        // A hard window.location.href causes a full page reload which races
        // with async storage hydration and can log the user out on the next page.
      },

      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
      },

      checkExpiration: () => {
        const state = get();
        if (state.expiresAt && Date.now() > state.expiresAt) {
          get().clearAuth();
          return false;
        }
        return true;
      },
    }),
    {
      name: "namy-auth-storage",
      storage: createJSONStorage(() => capacitorStorage),
      // Initialize auth token on hydration
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          // Check if session has expired
          if (state.expiresAt && Date.now() > state.expiresAt) {
            void capacitorStorage.removeItem("namy-auth-storage");
          } else {
            setAuthToken(state.accessToken);
          }
        }
      },
    }
  )
);

// Register the auth error callback when the module loads
// This allows the graphql-client to trigger logout on auth errors
if (typeof window !== "undefined") {
  setAuthErrorCallback(() => {
    const state = useAuthStore.getState();
    state.clearAuth();
  });
}
