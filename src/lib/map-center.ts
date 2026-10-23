/** A map remains useful without GPS: explicit centre, valid location, stores, city. */
export type MapCenter = { lat: number; lng: number };
const DEFAULT_CENTER: MapCenter = { lat: 19.4326, lng: -99.1332 };
export function isMapCoordinate(point: {
  lat?: number | null;
  lng?: number | null;
}): point is MapCenter {
  return (
    typeof point.lat === "number" &&
    Number.isFinite(point.lat) &&
    Math.abs(point.lat) <= 90 &&
    typeof point.lng === "number" &&
    Number.isFinite(point.lng) &&
    Math.abs(point.lng) <= 180
  );
}
export function resolveMapCenter(
  center: MapCenter | undefined,
  location: { latitude: number; longitude: number } | null,
  stores: { lat?: number | null; lng?: number | null }[]
): MapCenter {
  if (center && isMapCoordinate(center)) {
    return center;
  }
  const gps = location && { lat: location.latitude, lng: location.longitude };
  if (gps && isMapCoordinate(gps)) {
    return gps;
  }
  const valid = stores.filter(isMapCoordinate);
  if (!valid.length) {
    return DEFAULT_CENTER;
  }
  return {
    lat: valid.reduce((sum, point) => sum + point.lat, 0) / valid.length,
    lng: valid.reduce((sum, point) => sum + point.lng, 0) / valid.length,
  };
}
