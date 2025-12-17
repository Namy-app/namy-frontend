import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Interface for GraphQL error structure
 */
export interface GraphQLError {
  response?: {
    errors?: Array<{
      message?: string;
      extensions?: {
        code?: string;
        validationErrors?: Array<string>;
      };
    }>;
  };
}

/**
 * Extracts user-friendly error messages from various error formats
 * @param error - The error object to extract message from
 * @returns A clean error message string
 */
export function extractErrorMessage(error: unknown): string | null {
  // Handle GraphQL errors
  if (error && typeof error === "object" && "response" in error) {
    const graphqlError = error as GraphQLError;
    const errors = graphqlError.response?.errors;
    const firstError = errors?.[0];

    if (firstError) {
      // Prioritize validation errors
      if (firstError.extensions?.validationErrors?.length) {
        return firstError.extensions.validationErrors.join(", ");
      }

      // Use main error message
      if (firstError.message) {
        return firstError.message;
      }
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Fallback for unknown error types
  return null;
}

/**
 * Extracts all validation errors from a GraphQL error
 * @param error - The GraphQL error object
 * @returns Array of validation error messages
 */
export function extractValidationErrors(error: unknown): string[] {
  if (error && typeof error === "object" && "response" in error) {
    const graphqlError = error as GraphQLError;
    const errors = graphqlError.response?.errors;
    const validationErrors: string[] = [];

    errors?.forEach((err) => {
      if (err.extensions?.validationErrors) {
        validationErrors.push(...err.extensions.validationErrors);
      }
    });

    return validationErrors;
  }

  return [];
}

/**
 * Checks if an error is a validation error
 * @param error - The error to check
 * @returns True if the error contains validation errors
 */
export function isValidationError(error: unknown): boolean {
  if (error && typeof error === "object" && "response" in error) {
    const graphqlError = error as GraphQLError;
    const errors = graphqlError.response?.errors;
    const firstError = errors?.[0];

    if (!firstError) {
      return false;
    }

    // Check for validation error codes
    const validationErrorCodes = [
      "VALIDATION_ERROR",
      "BAD_USER_INPUT",
      "GRAPHQL_VALIDATION_FAILED",
    ];
    const codeMatch = validationErrorCodes.includes(
      firstError.extensions?.code ?? ""
    );

    // Check if there are validation errors in extensions
    const hasValidationErrors =
      firstError.extensions?.validationErrors &&
      firstError.extensions.validationErrors.length > 0;

    // Check for validation-related error messages
    const validationKeywords = [
      "validation",
      "invalid input",
      "required field",
      "must be",
      "expected",
    ];
    const messageMatch = validationKeywords.some(
      (keyword) =>
        firstError.message?.toLowerCase().includes(keyword.toLowerCase()) ??
        false
    );

    return codeMatch || hasValidationErrors || messageMatch;
  }

  return false;
}

/**
 * Checks if an error is an authentication error
 * @param error - The error to check
 * @returns True if the error is authentication related
 */
export function isAuthenticationError(error: unknown): boolean {
  if (error && typeof error === "object" && "response" in error) {
    const graphqlError = error as GraphQLError;
    const errors = graphqlError.response?.errors;
    const firstError = errors?.[0];

    if (!firstError) {
      return false;
    }

    // Check for authentication error codes
    const authErrorCodes = ["UNAUTHENTICATED", "UNAUTHORIZED", "FORBIDDEN"];
    const codeMatch = authErrorCodes.includes(
      firstError.extensions?.code ?? ""
    );

    // Check for authentication-related error messages
    const authKeywords = [
      "unauthenticated",
      "authentication required",
      "invalid token",
      "token expired",
    ];
    const messageMatch = authKeywords.some(
      (keyword) =>
        firstError.message?.toLowerCase().includes(keyword.toLowerCase()) ??
        false
    );

    return codeMatch || messageMatch;
  }

  return false;
}

/**
 * Interface for user location coordinates
 */
export interface UserLocation {
  latitude: number;
  longitude: number;
}

/**
 * Options for geolocation request
 */
export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

/**
 * Gets the user's current location using the browser's geolocation API
 * @param options - Optional geolocation configuration
 * @returns Promise that resolves to user's latitude and longitude
 * @throws Error if geolocation is not supported or permission denied
 */
export function getUserLocation(
  options: GeolocationOptions = {}
): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: options.enableHighAccuracy ?? true,
      timeout: options.timeout ?? 10000, // 10 seconds
      maximumAge: options.maximumAge ?? 300000, // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = "Unknown error occurred";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }

        reject(new Error(errorMessage));
      },
      defaultOptions
    );
  });
}

/**
 * Gets user location with fallback handling and loading states
 * @param options - Optional geolocation configuration
 * @returns Promise with user location or null if failed
 */
export async function getUserLocationSafe(
  options: GeolocationOptions = {}
): Promise<UserLocation | null> {
  try {
    return await getUserLocation(options);
  } catch (error) {
    console.warn("Failed to get user location:", error);
    return null;
  }
}

/**
 * Generates a random 6-digit PIN string
 * @returns A string containing 6 random digits (000000-999999)
 *
 * Examples: "123456", "007890", "000001", "999999", "042038"
 */
export function generate6DigitPin(): string {
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
}
