import { GraphQLClient, type RequestDocument } from "graphql-request";

import { env } from "./env";

type GraphQLError = {
  response?: {
    errors?: Array<{
      message?: string;
      extensions?: {
        code?: string;
        validationErrors?: Array<string>;
        originalError?: {
          message?: string | string[];
        };
      };
    }>;
  };
};

export const PORTAL_AUTH_STORAGE_KEY = "namy-portal-auth";

let currentPortalToken: string | null = null;

export const portalGraphqlClient = new GraphQLClient(env.NEXT_PUBLIC_API_URL, {
  headers: {
    "Content-Type": "application/json",
    ...(env.NEXT_PUBLIC_API_URL.includes("ngrok") && {
      "ngrok-skip-browser-warning": "true",
    }),
  },
  fetch: fetch,
});

let portalAuthErrorCallback: (() => void) | null = null;

export const setPortalAuthErrorCallback = (
  callback: (() => void) | null
): void => {
  portalAuthErrorCallback = callback;
};

export const setPortalAuthToken = (token: string | null): void => {
  currentPortalToken = token;
  if (token) {
    portalGraphqlClient.setHeader("authorization", `Bearer ${token}`);
  } else {
    portalGraphqlClient.setHeader("authorization", "");
  }
};

export function getPortalAuthToken(): string | null {
  return currentPortalToken ?? readPortalTokenFromStorage();
}

export function getPortalRestBaseUrl(): string {
  return env.NEXT_PUBLIC_API_URL.replace(/\/graphql\/?$/, "");
}

function readPortalTokenFromStorage(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(PORTAL_AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as {
      state?: { portalToken?: string | null };
    };
    return parsed.state?.portalToken ?? null;
  } catch {
    return null;
  }
}

function parseError(error: unknown): GraphQLError | null {
  if (error && typeof error === "object" && "response" in error) {
    return error as GraphQLError;
  }
  return null;
}

function graphqlErrorMessage(graphqlError: GraphQLError | null): string {
  const firstError = graphqlError?.response?.errors?.[0];
  if (!firstError) {
    return "";
  }
  const original = firstError.extensions?.originalError?.message;
  const originalText = Array.isArray(original) ? original[0] : original;
  return (
    firstError.extensions?.validationErrors?.[0] ||
    originalText ||
    firstError.message ||
    ""
  );
}

function isAuthenticationError(graphqlError: GraphQLError | null): boolean {
  if (!graphqlError) {
    return false;
  }
  const firstError = graphqlError.response?.errors?.[0];
  if (!firstError) {
    return false;
  }

  const authErrorMessages = [
    "Unauthenticated",
    "Authentication required",
    "Invalid token",
    "Token expired",
  ];
  const messageMatch = authErrorMessages.some(
    (msg) =>
      firstError.message?.toLowerCase().includes(msg.toLowerCase()) ?? false
  );
  const authErrorCodes = ["UNAUTHENTICATED"];
  const codeMatch = authErrorCodes.includes(firstError.extensions?.code ?? "");
  return messageMatch || codeMatch;
}

const isNgrok = env.NEXT_PUBLIC_API_URL.includes("ngrok");

export async function portalGraphqlRequest<T>(
  query: RequestDocument,
  variables?: Record<string, unknown>
): Promise<T> {
  if (isNgrok) {
    portalGraphqlClient.setHeader("ngrok-skip-browser-warning", "true");
  }

  const token = currentPortalToken ?? readPortalTokenFromStorage();
  setPortalAuthToken(token);

  try {
    return await portalGraphqlClient.request<T>(query, variables);
  } catch (error) {
    const parsedError = parseError(error);

    if (isAuthenticationError(parsedError)) {
      const errorMsg = graphqlErrorMessage(parsedError);
      const isCredentialError = /password|email|pin|incorrecto/i.test(errorMsg);
      if (!isCredentialError) {
        portalAuthErrorCallback?.();
      }
      throw new Error(
        errorMsg || "Tu sesión ha expirado. Inicia sesión de nuevo."
      );
    }

    if (parsedError) {
      const errorMsg = graphqlErrorMessage(parsedError);
      throw new Error(errorMsg || "GraphQL request failed");
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}
