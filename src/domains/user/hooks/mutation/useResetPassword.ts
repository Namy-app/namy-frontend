import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { graphqlRequest } from "@/lib/graphql-client";
import { RESET_PASSWORD_MUTATION } from "@/lib/graphql-queries";

interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  resetPassword: {
    message: string;
  };
}

export function useResetPassword(): UseMutationResult<
  { message: string },
  Error,
  ResetPasswordInput,
  unknown
> {
  return useMutation({
    mutationFn: async (input: ResetPasswordInput) => {
      const data = await graphqlRequest<ResetPasswordResponse>(
        RESET_PASSWORD_MUTATION,
        { input }
      );
      return data.resetPassword;
    },
  });
}
