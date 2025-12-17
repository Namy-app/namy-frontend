/**
 * Formats a date string or Date object to YYYY-MM-DD format
 * @param dateString - Date string, Date object, or timestamp to format
 * @returns Formatted date string in YYYY-MM-DD format
 */
export function formatDateToYMD(dateString: string | Date | number): string {
  let date: Date;

  // Handle different input types
  if (dateString instanceof Date) {
    date = dateString;
  } else if (typeof dateString === "number") {
    date = new Date(dateString);
  } else {
    date = new Date(dateString);
  }

  // Check if date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }

  // Format to YYYY-MM-DD
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Formats a date string or Date object to YYYY-MM-DD format with error handling
 * @param dateString - Date string, Date object, or timestamp to format
 * @param fallback - Fallback value if date is invalid (defaults to empty string)
 * @returns Formatted date string in YYYY-MM-DD format or fallback value
 */
export function formatDateToYMDSafe(
  dateString: string | Date | number,
  fallback: string = ""
): string {
  try {
    return formatDateToYMD(dateString);
  } catch (error) {
    console.warn("Failed to format date:", error);
    return fallback;
  }
}
