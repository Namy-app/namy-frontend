import { useMutation } from "@tanstack/react-query";
import { graphqlRequest } from "@/lib/graphql-client";
import { SIGNUP_MUTATION } from "@/lib/graphql-queries";
import { AuthResponse, SignupInput } from "@/lib/api-types";
import { useAuthStore } from "@/store/useAuthStore";

interface SignUpResponse {
  signUp: AuthResponse;
}

export function useSignup() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (input: SignupInput) => {
      const data = await graphqlRequest<SignUpResponse>(SIGNUP_MUTATION, { input });
      return data.signUp;
    },
    onSuccess: (data) => {
      // Store auth data in Zustand store
      setAuth(data.user, data.accessToken);
    },
  });
}
