import { useMutation } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { RESEND_VERIFICATION_MUTATION } from "@/lib/graphql-queries";

interface ResendVerificationInput {
  email: string;
}

interface ResendVerificationResponse {
  resendVerification: {
    message: string;
  };
}

export const useResendVerification = () => {
  return useMutation({
    mutationFn: async (input: ResendVerificationInput) => {
      const response = await graphqlClient.request<ResendVerificationResponse>(
        RESEND_VERIFICATION_MUTATION,
        { input }
      );
      return response.resendVerification;
    },
  });
};
