import { GraphQLClient } from "graphql-request";

import { env } from "./env";

// eslint-disable-next-line no-console
console.log("API URL:", env.NEXT_PUBLIC_API_URL);

// Create the GraphQL client instance
export const graphqlClient = new GraphQLClient(env.NEXT_PUBLIC_API_URL, {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  fetch: fetch,
});

// Callback for handling authentication errors (set by auth store)
let authErrorCallback: (() => void) | null = null;

// Register a callback to be called when authentication errors occur
export const setAuthErrorCallback = (callback: (() => void) | null): void => {
  authErrorCallback = callback;
};

// Helper function to set authorization header
export const setAuthToken = (token: string | null): void => {
  if (token) {
    graphqlClient.setHeader("authorization", `Bearer ${token}`);
  } else {
    graphqlClient.setHeader("authorization", "");
  }
};

// Check if an error is an authentication error
function isAuthenticationError(error: unknown): boolean {
  if (error && typeof error === "object" && "response" in error) {
    const graphqlError = error as {
      response?: {
        errors?: Array<{
          message?: string;
          extensions?: { code?: string };
        }>;
      };
    };
    const errors = graphqlError.response?.errors;
    const firstError = errors?.[0];

    if (!firstError) {
      return false;
    }

    // Check for authentication-related error messages
    const authErrorMessages = [
      "User not found",
      "Unauthorized",
      "Unauthenticated",
      "Authentication required",
      "Invalid token",
      "Token expired",
      "Forbidden",
    ];

    const messageMatch = authErrorMessages.some(
      (msg) =>
        firstError.message?.toLowerCase().includes(msg.toLowerCase()) ?? false
    );

    // Check for authentication-related error codes
    const authErrorCodes = ["UNAUTHENTICATED", "UNAUTHORIZED", "FORBIDDEN"];
    const codeMatch = authErrorCodes.includes(
      firstError.extensions?.code ?? ""
    );

    return messageMatch || codeMatch;
  }
  return false;
}

// Helper function to make GraphQL requests with error handling
export async function graphqlRequest<T>(
  query: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: any
): Promise<T> {
  try {
    // eslint-disable-next-line no-console
    console.log("GraphQL Request:", { query, variables });
    const result = await graphqlClient.request<T>(query, variables);
    // eslint-disable-next-line no-console
    console.log("GraphQL Response:", result);
    return result;
  } catch (error) {
    console.error("GraphQL Error:", error);

    // Check if this is an authentication error
    if (isAuthenticationError(error)) {
      console.error("Authentication error detected - triggering logout");
      // Call the registered callback to clear auth state
      if (authErrorCallback) {
        authErrorCallback();
      }
      throw new Error("Your session has expired. Please log in again.");
    }

    // Handle GraphQL errors
    if (error && typeof error === "object" && "response" in error) {
      const graphqlError = error as {
        response?: { errors?: Array<{ message?: string }> };
      };
      const graphqlErrors = graphqlError.response?.errors;
      const errorMessage =
        graphqlErrors?.[0]?.message || "GraphQL request failed";
      console.error("GraphQL Error Message:", errorMessage);
      throw new Error(errorMessage);
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}
