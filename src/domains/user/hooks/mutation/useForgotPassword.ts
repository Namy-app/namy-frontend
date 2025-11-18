import { useMutation } from "@tanstack/react-query";
import { graphqlRequest } from "@/lib/graphql-client";
import { FORGOT_PASSWORD_MUTATION } from "@/lib/graphql-queries";

interface ForgotPasswordInput {
  email: string;
}

interface ForgotPasswordResponse {
  forgotPassword: {
    message: string;
  };
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (input: ForgotPasswordInput) => {
      const data = await graphqlRequest<ForgotPasswordResponse>(
        FORGOT_PASSWORD_MUTATION,
        { input }
      );
      return data.forgotPassword;
    },
  });
}
