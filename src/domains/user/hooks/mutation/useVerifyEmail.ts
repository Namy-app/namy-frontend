import { useMutation } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { VERIFY_EMAIL_MUTATION } from "@/lib/graphql-queries";

interface VerifyEmailInput {
  email: string;
  code: string;
}

interface VerifyEmailResponse {
  verifyEmail: {
    message: string;
  };
}

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async (input: VerifyEmailInput) => {
      const response = await graphqlClient.request<VerifyEmailResponse>(
        VERIFY_EMAIL_MUTATION,
        { input }
      );
      return response.verifyEmail;
    },
  });
};
