import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type User } from "@/lib/api-types";
import { setAuthToken } from "@/lib/graphql-client";

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
      // Initialize auth token on hydration
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          // Check if session has expired
          if (state.expiresAt && Date.now() > state.expiresAt) {
            // persisted state is a plain object (no functions). Removing the
            // localStorage entry clears the expired session safely during
            // rehydration instead of calling a nonexistent `clearAuth`.
            try {
              if (typeof window !== "undefined" && window.localStorage) {
                window.localStorage.removeItem("namy-auth-storage");
              }
            } catch {
              // ignore errors during cleanup
            }
          } else {
            setAuthToken(state.accessToken);
          }
        }
      },
    }
  )
);
