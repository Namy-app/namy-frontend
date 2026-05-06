import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";

/**
 * Interface for location data
 */
export interface LocationData {
  placeId?: string;
  lat?: number;
  lng?: number;
  address?: string;
}

function buildGoogleMapsUrl(location: LocationData): string {
  if (location.placeId) {
    const query =
      location.lat && location.lng
        ? `${location.lat},${location.lng}`
        : encodeURIComponent(location.address ?? "");
    return `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${location.placeId}`;
  } else if (location.lat && location.lng) {
    return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
  } else if (location.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
  }
  return "";
}

async function openUrl(url: string): Promise<void> {
  const platform = Capacitor.getPlatform();
  if (platform === "android" || platform === "ios") {
    await Browser.open({ url });
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/**
 * Opens a location in Google Maps using placeId, coordinates, or address
 */
export function openInGoogleMaps(location: LocationData): void {
  const url = buildGoogleMapsUrl(location);
  if (!url) {
    console.warn("No location data provided for Google Maps");
    return;
  }
  void openUrl(url);
}

/**
 * Gets the Google Maps URL for a location without opening it
 */
export function getGoogleMapsUrl(location: LocationData): string {
  if (location.lat && location.lng) {
    return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
  } else if (location.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`;
  }
  return "";
}

/**
 * Opens directions to a location in Google Maps
 * @param destination - Destination location
 * @param origin - Origin location (optional, defaults to user's current location)
 */
export function openDirectionsInGoogleMaps(
  destination: LocationData,
  origin?: LocationData
): void {
  let mapsUrl = "https://www.google.com/maps/dir/";

  if (origin) {
    if (origin.lat && origin.lng) {
      mapsUrl += `${origin.lat},${origin.lng}/`;
    } else if (origin.address) {
      mapsUrl += `${encodeURIComponent(origin.address)}/`;
    }
  }

  if (destination.lat && destination.lng) {
    mapsUrl += `${destination.lat},${destination.lng}`;
  } else if (destination.address) {
    mapsUrl += encodeURIComponent(destination.address);
  } else {
    console.warn("No destination data provided for Google Maps directions");
    return;
  }

  void openUrl(mapsUrl);
}
