import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { type AuthResponse, type SignupInput } from "@/lib/api-types";
import { graphqlRequest } from "@/lib/graphql-client";
import { SIGNUP_MUTATION } from "@/lib/graphql-queries";
import { useAuthStore } from "@/store/useAuthStore";

interface SignUpResponse {
  signUp: AuthResponse;
}

export function useSignup(): UseMutationResult<
  AuthResponse,
  Error,
  SignupInput,
  unknown
> {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (input: SignupInput) => {
      const data = await graphqlRequest<SignUpResponse>(SIGNUP_MUTATION, {
        input,
      });
      return data.signUp;
    },
    onSuccess: (data) => {
      // Store auth data in Zustand store
      setAuth(data.user, data.accessToken);
    },
  });
}
