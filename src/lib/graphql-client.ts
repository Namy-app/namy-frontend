import { GraphQLClient } from "graphql-request";

import { env } from "./env";

type GraphQLError = {
  response?: {
    errors?: Array<{
      message?: string;
      extensions?: {
        code?: string;
        validationErrors?: Array<string>;
      };
    }>;
  };
};

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
function parseError(error: unknown): GraphQLError | null {
  if (error && typeof error === "object" && "response" in error) {
    return error as {
      response?: {
        errors?: Array<{
          message?: string;
          extensions?: {
            code?: string;
            validationErrors?: Array<string>;
          };
        }>;
      };
    };
  }
  return null;
}

// Check if an error is an authentication error
function isAuthenticationError(graphqlError: GraphQLError | null): boolean {
  if (graphqlError) {
    const errors = graphqlError.response?.errors;
    const firstError = errors?.[0];

    if (!firstError) {
      return false;
    }

    // Check for authentication-related error messages
    const authErrorMessages = [
      // "User not found",
      // "Unauthorized",
      "Unauthenticated",
      "Authentication required",
      "Invalid token",
      "Token expired",
      // "Forbidden",
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
    const result = await graphqlClient.request<T>(query, variables);
    return result;
  } catch (error) {
    console.error("GraphQL Error:", error);
    const parsedError = parseError(error);

    // Check if this is an authentication error
    if (isAuthenticationError(parsedError)) {
      // Guest-accessible pages - don't trigger logout
      const guestPages = ["/", "/explore", "/restaurants", "/service", "/auth"];

      const isGuestPage =
        typeof window !== "undefined" &&
        guestPages.some(
          (page) =>
            window.location.pathname === page ||
            window.location.pathname.startsWith(page + "/")
        );

      // Call the registered callback to clear auth state only if not on guest-accessible pages
      if (authErrorCallback && !isGuestPage) {
        console.error("Authentication error detected - triggering logout");
        authErrorCallback();
      }

      const errorMsg =
        parsedError?.response?.errors?.[0]?.extensions?.validationErrors?.[0] ??
        parsedError?.response?.errors?.[0]?.message;

      // For guest pages, just log the error but don't throw
      if (isGuestPage) {
        console.warn("Auth required for this feature:", errorMsg);
        throw new Error("Please log in to access this feature");
      }

      throw new Error(
        errorMsg ?? "Your session has expired. Please log in again."
      );
    }

    // Handle GraphQL errors
    if (parsedError) {
      const errorMsg =
        parsedError?.response?.errors?.[0]?.extensions?.validationErrors?.[0] ??
        parsedError?.response?.errors?.[0]?.message;
      const errorMessage = errorMsg || "GraphQL request failed";
      console.error("GraphQL Error Message:", errorMessage);
      throw new Error(errorMessage);
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}
