import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
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
