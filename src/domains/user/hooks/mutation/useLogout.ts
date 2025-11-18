import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: async () => {
      // Logout is handled client-side by clearing the auth state
      return Promise.resolve();
    },
    onSuccess: () => {
      clearAuth();
    },
  });
}
