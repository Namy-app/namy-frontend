import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { type AuthResponse, type LoginInput } from "@/lib/api-types";
import { graphqlRequest } from "@/lib/graphql-client";
import { LOGIN_MUTATION } from "@/lib/graphql-queries";
import { useAuthStore } from "@/store/useAuthStore";

interface SignInResponse {
  signIn: AuthResponse;
}

interface LoginInputWithRememberMe extends LoginInput {
  rememberMe?: boolean;
}

export function useLogin(): UseMutationResult<
  AuthResponse & { rememberMe?: boolean },
  Error,
  LoginInputWithRememberMe,
  unknown
> {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async ({
      rememberMe,
      ...credentials
    }: LoginInputWithRememberMe) => {
      const data = await graphqlRequest<SignInResponse>(LOGIN_MUTATION, {
        input: credentials,
      });
      return { ...data.signIn, rememberMe };
    },
    onSuccess: (data) => {
      // Store auth data in Zustand store with rememberMe flag
      setAuth(data.user, data.accessToken, data.rememberMe);
    },
  });
}
