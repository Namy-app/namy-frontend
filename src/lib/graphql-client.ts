import { GraphQLClient } from "graphql-request";
import { env } from "./env";

console.log('API URL:', env.NEXT_PUBLIC_API_URL);

// Create the GraphQL client instance
export const graphqlClient = new GraphQLClient(env.NEXT_PUBLIC_API_URL, {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  fetch: fetch,
});

// Helper function to set authorization header
export const setAuthToken = (token: string | null) => {
  if (token) {
    graphqlClient.setHeader("authorization", `Bearer ${token}`);
  } else {
    graphqlClient.setHeader("authorization", "");
  }
};

// Helper function to make GraphQL requests with error handling
export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  try {
    console.log('GraphQL Request:', { query, variables });
    const result = await graphqlClient.request<T>(query, variables);
    console.log('GraphQL Response:', result);
    return result;
  } catch (error: any) {
    console.error('GraphQL Error:', error);
    // Handle GraphQL errors
    if (error.response?.errors) {
      const graphqlErrors = error.response.errors;
      const errorMessage = graphqlErrors[0]?.message || "GraphQL request failed";
      console.error('GraphQL Error Message:', errorMessage);
      throw new Error(errorMessage);
    }
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error("Network error: Could not connect to server");
  }
}
