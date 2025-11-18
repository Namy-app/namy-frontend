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

// Helper function to set authorization header
export const setAuthToken = (token: string | null): void => {
  if (token) {
    graphqlClient.setHeader("authorization", `Bearer ${token}`);
  } else {
    graphqlClient.setHeader("authorization", "");
  }
};

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
