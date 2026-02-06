/**
 * Interface for location data
 */
export interface LocationData {
  placeId?: string;
  lat?: number;
  lng?: number;
  address?: string;
}

/**
 * Opens a location in Google Maps using placeId, coordinates, or address
 * @param location - Object containing placeId, lat/lng coordinates and/or address
 * @returns void
 */
export function openInGoogleMaps(location: LocationData): void {
  let mapsUrl: string;

  // Use placeId if available (most reliable for Google Maps)
  if (location.placeId) {
    mapsUrl = `https://www.google.com/maps/search/?api=1&query_place_id=${location.placeId}`;
  } else if (location.lat && location.lng) {
    mapsUrl = `https://www.google.com/maps/search/${location.lat},${location.lng}`;
  } else if (location.address) {
    // Fallback to address if coordinates aren't available
    mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(location.address)}`;
  } else {
    console.warn("No location data provided for Google Maps");
    return;
  }

  // Always open in new tab
  window.open(mapsUrl, "_blank", "noopener,noreferrer");
}

/**
 * Gets the Google Maps URL for a location without opening it
 * @param location - Object containing lat/lng coordinates and/or address
 * @returns Google Maps URL string
 */
export function getGoogleMapsUrl(location: LocationData): string {
  let mapsUrl = "https://www.google.com/maps/search/";

  if (location.lat && location.lng) {
    mapsUrl += `${location.lat},${location.lng}`;
  } else if (location.address) {
    mapsUrl += encodeURIComponent(location.address);
  } else {
    return "";
  }

  return mapsUrl;
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

  // Add origin if provided
  if (origin) {
    if (origin.lat && origin.lng) {
      mapsUrl += `${origin.lat},${origin.lng}/`;
    } else if (origin.address) {
      mapsUrl += `${encodeURIComponent(origin.address)}/`;
    } else {
      mapsUrl += ""; // Empty origin will use current location
    }
  }

  // Add destination
  if (destination.lat && destination.lng) {
    mapsUrl += `${destination.lat},${destination.lng}`;
  } else if (destination.address) {
    mapsUrl += encodeURIComponent(destination.address);
  } else {
    console.warn("No destination data provided for Google Maps directions");
    return;
  }

  // Always open in new tab
  window.open(mapsUrl, "_blank", "noopener,noreferrer");
}
